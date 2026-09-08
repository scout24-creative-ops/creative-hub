import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const page=await readFile(new URL('../concept-studio.html',import.meta.url),'utf8');
const context=vm.createContext({TextEncoder,Blob});
vm.runInContext(page.slice(page.indexOf('const CRC_TABLE ='),page.indexOf('function downloadBlob(')),context);

for(const kinds of [[],['landingpage'],['email'],['landingpage','email']]) {
  test(`ZIP directory matches selected outputs: ${kinds.join(', ') || 'images only'}`,async()=>{
    const files=[{name:'image.jpg',data:new Uint8Array([0xff,0xd8,0xff,0xd9])},
      ...kinds.map(kind=>({name:kind+'.html',data:new TextEncoder().encode(`<p>${kind} draft</p>`)}))];
    const bytes=Buffer.from(await context.zipStore(files).arrayBuffer());
    const end=bytes.length-22;
    assert.equal(bytes.readUInt32LE(end),0x06054b50);
    assert.equal(bytes.readUInt16LE(end+10),files.length);
    let position=bytes.readUInt32LE(end+16);
    const names=[];
    for(const file of files){
      assert.equal(bytes.readUInt32LE(position),0x02014b50);
      const size=bytes.readUInt32LE(position+24), nameLength=bytes.readUInt16LE(position+28);
      const name=bytes.subarray(position+46,position+46+nameLength).toString();
      names.push(name);assert.equal(name,file.name);assert.equal(size,file.data.length);
      assert.equal(bytes.readUInt32LE(position+16),context.crc32(file.data));
      const offset=bytes.readUInt32LE(position+42);
      assert.equal(bytes.readUInt32LE(offset),0x04034b50);
      assert.deepEqual(bytes.subarray(offset+30+nameLength,offset+30+nameLength+size),Buffer.from(file.data));
      position+=46+nameLength;
    }
    assert.deepEqual(names,files.map(file=>file.name));
    assert.equal(position,end);
  });
}
