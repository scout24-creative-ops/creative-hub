import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {buildFacts,countPhrase,andList} from '../studio-facts.js';

const page=await readFile(new URL('../concept-studio.html',import.meta.url),'utf8');
const code=page.slice(page.indexOf('function renderSet('),page.indexOf('function openVariants('));

test('a fully withheld build has no success claim, browse action or approval prompt',()=>{
  const markup=[];
  const node=()=>({appendChild(){},addEventListener(){},querySelector(){return node();}});
  const context=vm.createContext({
    el:html=>{markup.push(html);return node();},esc:String,countPhrase,andList,
    ENGINE_VERSION:'test',SAFE_ZONE_VERSION:'test',
  });
  vm.runInContext(code,context);
  const facts=buildFacts({built:[],pages:[],rows:[{blocked:true,blockedReason:'No safe layout',placement:'Story'}],planned:1});
  context.renderSet(node(),[],[],{facts,noteTally:new Map()});
  const html=markup.join('\n');
  assert.match(html,/No files could be built/);
  assert.match(html,/No image assets were exported/);
  assert.match(html,/class="pill-btn browse" disabled/);
  assert.ok(!html.includes('Image exports passed'));
  assert.ok(!html.includes('Approve this set'));
  assert.ok(!html.includes('res-tick">✓'));
});
