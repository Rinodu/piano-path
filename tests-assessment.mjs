import assert from 'node:assert/strict';
import {holdGrade,velocityGrade} from './practice-assessment.js';
import {readMidi} from './midi-file.js';
import {midiFixture} from './tests-midi.mjs';
assert.equal(holdGrade(1,1),'tepat');assert.equal(holdGrade(.2,1),'terlalu singkat');assert.equal(holdGrade(1.4,1),'terlalu lama');assert.equal(holdGrade(.1,.1,.5),'tepat');assert.equal(velocityGrade(90,80),'tepat');assert.equal(velocityGrade(25,80),'terlalu lembut');assert.equal(velocityGrade(120,80),'terlalu keras');
const song=readMidi(midiFixture().buffer);assert.equal(song.notes[0].duration,1.5);assert.equal(song.notes[0].keyDuration,.5);assert.equal(song.notes[2].keyDuration,1);
console.log('PASS hold duration tolerance, velocity comparison and distinct MIDI key release/pedal duration.');
