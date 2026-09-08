import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const archive=process.argv[2];
if(!archive)throw new Error('Pass the downloaded ZIP path.');
const expectedKinds=(process.argv[3] ?? 'landingpage,email').split(',').filter(Boolean).sort();
function unzip(args){const r=spawnSync('unzip',[...args,archive],{maxBuffer:50*1024*1024});if(r.status!==0)throw new Error(r.stderr.toString());return r.stdout;}
unzip(['-t']);
const names=unzip(['-Z1']).toString().trim().split('\n');
assert.equal(new Set(names).size,names.length,'Duplicate archive filenames');
function read(name){const r=spawnSync('unzip',['-p',archive,name],{maxBuffer:50*1024*1024});if(r.status!==0)throw new Error(r.stderr.toString());return r.stdout;}
function jpegSize(data){
  assert.equal(data.readUInt16BE(0),0xffd8,'Not a JPEG');
  for(let offset=2;offset<data.length;){
    assert.equal(data[offset++],0xff);while(data[offset]===0xff)offset++;
    const marker=data[offset++];if(marker===0xd9||marker===0xda)break;
    const size=data.readUInt16BE(offset);
    if([0xc0,0xc1,0xc2].includes(marker))return {h:data.readUInt16BE(offset+3),w:data.readUInt16BE(offset+5)};
    offset+=size;
  }
  throw new Error('JPEG has no readable frame size');
}
const report={files:names.length,images:[],documents:[]};
for(const name of names){
  const data=read(name);
  if(name.endsWith('.jpg')){
    const match=name.match(/_(\d+)x(\d+)_/);assert.ok(match,'Missing dimensions in image name');
    const measured=jpegSize(data);assert.equal(measured.w,Number(match[1]));assert.equal(measured.h,Number(match[2]));
    assert.ok(data.length<=30*1024*1024,'Selected Meta placement exceeds byte cap');
    report.images.push({name,...measured,bytes:data.length});
  }else if(name.endsWith('.html')){
    const html=data.toString();assert.ok(!html.includes('_ds/'),'Exported page has unbundled font path');
    const fontData=[...html.matchAll(/src:url\("data:[^;]+;base64,([A-Za-z0-9+/=]+)"\)/g)];
    assert.equal(fontData.length,3,'All three brand fonts must be embedded');
    for(const match of fontData)assert.equal(Buffer.from(match[1],'base64').subarray(0,4).toString(),'wOF2');
    const draft=/<meta name="professionals-export-status" content="draft"/.test(html);
    assert.ok(draft,'Every document must disclose draft status');
    if(name.includes('email'))assert.ok(html.includes('Entwurf. Nicht versenden.'));
    if(name.includes('landingpage'))assert.ok(!html.includes('In vier Schritten zur Kampagne'));
    report.documents.push({name,embeddedFonts:fontData.length,draft,bytes:data.length});
  }
}
assert.equal(report.images.length,20);
assert.deepEqual(report.documents.map(d=>d.name.replace(/\.html$/,'')).sort(),expectedKinds,'Archive must contain only the selected document kinds');
console.log(JSON.stringify(report,null,2));
