import assert from 'node:assert/strict';
import {readMidi} from './midi-file.js';
const be=(n,size)=>Array.from({length:size},(_,i)=>(n>>>((size-i-1)*8))&255);
const vlq=n=>{const a=[n&127];while(n>>=7)a.unshift((n&127)|128);return a;};
const chunk=(name,data)=>[...new TextEncoder().encode(name),...be(data.length,4),...data];
export function midiFixture(){const conductor=[0,255,81,3,7,161,32,...vlq(480),255,81,3,15,66,64,...vlq(960),255,47,0];const performance=[0,255,3,5,...new TextEncoder().encode('Piano'),0,144,21,80,0,60,110,0,176,64,127,...vlq(480),128,21,0,0,60,0,...vlq(480),176,64,0,0,144,108,90,...vlq(480),108,0,0,255,47,0];return new Uint8Array([...chunk('MThd',[0,1,0,2,1,224]),...chunk('MTrk',conductor),...chunk('MTrk',performance)]);}
const bytes=midiFixture(),song=readMidi(bytes.buffer);assert.equal(song.format,1);assert.equal(song.tracks[1].name,'Piano');assert.equal(song.notes.length,3);assert.equal(song.duration,2.5);assert.deepEqual(song.notes.map(n=>[n.note,n.time,n.duration]),[[21,0,1.5],[60,0,1.5],[108,1.5,1]]);
assert.throws(()=>readMidi(new Uint8Array([1,2,3]).buffer));assert.throws(()=>readMidi(bytes.slice(0,-2).buffer));const wrong=bytes.slice();wrong[9]=2;assert.throws(()=>readMidi(wrong.buffer),/format 0 atau 1/);
const malformed=new Uint8Array([...chunk('MThd',[0,0,0,1,1,224]),...chunk('MTrk',[0,60,80,0,255,47,0])]);assert.throws(()=>readMidi(malformed.buffer),/Running status/);
const simple=new Uint8Array([...chunk('MThd',[0,0,0,1,1,224]),...chunk('MTrk',[0,153,60,100,...vlq(480),137,60,0,0,255,47,0])]);assert.throws(()=>readMidi(simple.buffer),/Tidak ada nada/);
const smpte=new Uint8Array([...chunk('MThd',[0,0,0,1,231,40]),...chunk('MTrk',[0,144,60,80,...vlq(1000),128,60,0,0,255,47,0])]);assert.equal(readMidi(smpte.buffer).duration,1);
console.log('PASS MIDI files: track merge, tempo changes, running status, velocity, pedal durations, 88-key extremes, SMPTE, corrupt/unsupported/drum-only rejection.');
