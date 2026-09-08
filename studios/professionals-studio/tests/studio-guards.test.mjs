import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const page = await readFile(new URL('../concept-studio.html', import.meta.url), 'utf8');
const storageCode = page.slice(page.indexOf('function storedValue('), page.indexOf('const state ='));
const encoderCode = page.slice(page.indexOf('async function exportBlob('), page.indexOf('async function renderAssetStudio('));
const campaignSelectionCode = page.slice(page.indexOf('function campaignPageKinds('), page.indexOf('/* One concept, the whole campaign.'));
const campaignBuilderCode = page.slice(page.indexOf('async function buildCampaignPages('), page.indexOf('/* `prettyBytes` came out of here.'));

test('document outputs are opt in for new, malformed and historical campaigns', () => {
  const context = vm.createContext({});
  vm.runInContext(campaignSelectionCode, context);
  for (const input of [undefined, null, {}, {outputs:{}}, {outputs:{email:'true',landingpage:1}}]) {
    assert.equal(context.campaignPageKinds(input).length, 0);
  }
  assert.deepEqual(Array.from(context.campaignPageKinds({outputs:{email:true}})), ['email']);
  assert.deepEqual(Array.from(context.campaignPageKinds({outputs:{landingpage:true}})), ['landingpage']);
  assert.deepEqual(Array.from(context.campaignPageKinds({outputs:{landingpage:true,email:true,unknown:true}})), ['landingpage','email']);
});

test('image only build does not fetch or render unselected documents', async () => {
  const context = vm.createContext({});
  vm.runInContext(campaignSelectionCode + campaignBuilderCode, context);
  const result = await context.buildCampaignPages({}, {campaign:{}});
  assert.equal(result.length,0);
});

test('document builder renders selected kinds and matches the logo to its actual surface', async () => {
  const requests=[];
  const context = vm.createContext({
    state:{brief:{}}, STORY_FONT_FILES:[],
    fieldOf:band => { assert.equal(band,'sand'); return {logo:''}; },
    assetDataUri:async path => {requests.push(path); return 'data:'+path;},
    conceptImage:()=> 'photo.jpg', proofForProduct:()=>[],
    storyFrom:input=>input,
    buildLandingPage:()=> 'landing draft', buildEmail:()=> 'email draft',
  });
  vm.runInContext(campaignSelectionCode + campaignBuilderCode, context);
  for (const kind of ['landingpage','email']) {
    const result=await context.buildCampaignPages({}, {cfg:{band:'blue'}, campaign:{outputs:{[kind]:true}}});
    assert.equal(result.length,1); assert.equal(result[0].kind,kind); assert.equal(result[0].status,'draft');
    assert.equal(result[0].story.band,'sand');
  }
  assert.ok(requests.includes('assets/logos/immoscout24-vertical.svg'));
  assert.ok(!requests.includes('assets/logos/immoscout24-vertical-white.svg'));
});

test('missing required document images stop export instead of producing broken standalone files', async () => {
  for (const missing of ['logo','photo']) {
    const context = vm.createContext({
      fieldOf:()=>({logo:''}), conceptImage:()=> 'photo.jpg',
      assetDataUri:async path => (missing==='photo' ? path==='photo.jpg' : path.includes('logos/')) ? null : 'data:ok',
    });
    vm.runInContext(campaignSelectionCode + campaignBuilderCode, context);
    await assert.rejects(context.buildCampaignPages({}, {cfg:{band:'sand'},campaign:{outputs:{email:true}}}), /could not be embedded/);
  }
});

test('inaccessible browser storage cannot prevent startup', () => {
  const context = vm.createContext({});
  Object.defineProperty(context, 'localStorage', { get() { throw new Error('SecurityError'); } });
  vm.runInContext(storageCode, context);
  assert.equal(context.storedValue('key'), '');
  assert.equal(context.storedRows('history').length, 0);
});

test('malformed or non-array history remains an empty recoverable collection', () => {
  for (const input of ['null', '{}', '42', '"text"', '{broken']) {
    const context = vm.createContext({ localStorage: { getItem: () => input } });
    vm.runInContext(storageCode, context);
    assert.equal(context.storedRows('history').length, 0);
  }
  const context = vm.createContext({localStorage:{getItem:()=> '[null,4,"bad",{"id":1}]'}});
  vm.runInContext(storageCode, context);
  assert.equal(context.storedRows('history').length, 1);
});

function encoder(sizeOf) {
  const calls = [];
  const context = vm.createContext({
    blobOf: async (canvas, type, quality) => { calls.push({type,quality}); return {size:sizeOf(type,quality)}; },
    capText: cap => `${cap} bytes`,
  });
  vm.runInContext(encoderCode, context);
  return {run:context.exportBlob,calls};
}

test('JPEG is compressed within the declared limit without resizing the artwork', async () => {
  const e = encoder((type,q)=>q>.8 ? 1200 : 900);
  const result = await e.run({},1000,false,['jpg']);
  assert.equal(result.blob.size,900);
  assert.equal(result.ext,'jpg');
  assert.ok(e.calls.every(c=>c.type==='image/jpeg'));
});

test('over-limit JPEG is withheld, not included with a warning', async () => {
  const result=await encoder(()=>1200).run({},1000,false,['jpg']);
  assert.equal(result.blocked,true);
  assert.equal(result.blob,null);
  assert.match(result.note,/not exported/);
});

test('PNG-only placement never receives JPEG or oversized PNG', async () => {
  const e=encoder(()=>1200);
  const result=await e.run({},1000,true,['png']);
  assert.equal(result.blocked,true);
  assert.ok(e.calls.every(c=>c.type==='image/png'));
});

test('valid PNG and an uncapped JPEG remain exportable', async () => {
  const png=await encoder(()=>800).run({},1000,true,['png']);
  assert.equal(png.ext,'png');assert.equal(png.blob.size,800);
  const jpg=await encoder(()=>100000).run({},null,false,['jpg']);
  assert.equal(jpg.ext,'jpg');assert.equal(jpg.blob.size,100000);
});
