import assert from 'node:assert/strict';
import {stages,blankProgress,stagePassed,canComplete,rhythmScore} from './course.js';
import {mutateProgress} from './backend/progress.js';
import {sampleNotes,nearestSample} from './piano-audio.js';
import {statSync} from 'node:fs';
import {exercises,matchNotes,parseMidi,weeklySummary} from './exercises.js';
import {velocityLayer} from './piano-audio.js';
assert.equal(exercises.length,24);
for(const e of exercises){assert.ok(e.events.length>0);for(const event of e.events){assert.ok(event.beat>=0&&event.duration>0);assert.ok(event.notes.every(n=>Number.isInteger(n)&&n>=0&&n<=127));}}
assert.equal(matchNotes([67,60,64],[60,64,67]),true);assert.equal(matchNotes([60,64],[60,64,67]),false);assert.equal(matchNotes([60,60],[60]),true);
assert.deepEqual(parseMidi([0x92,60,100]),{type:'on',note:60,velocity:100});assert.deepEqual(parseMidi([0x90,60,0]),{type:'off',note:60});assert.deepEqual(parseMidi([0xb0,64,127]),{type:'pedal',down:true});assert.equal(parseMidi([0x90,200,80]),null);
assert.deepEqual([35,80,115].map(velocityLayer),['soft','medium','loud']);
const goalProgress=mutateProgress(blankProgress(),'weekly',{weekly:{sessions:4,minutes:150}});assert.equal(goalProgress.weekly.minutes,150);assert.throws(()=>mutateProgress(blankProgress(),'weekly',{weekly:{sessions:8,minutes:100}}));
goalProgress.journal=[{date:'2026-10-04T18:00:00Z',minutes:30},{date:'2026-10-03T10:00:00Z',minutes:20}];const week=weeklySummary(goalProgress,new Date('2026-10-05T10:00:00Z'));assert.equal(week.start,'2026-10-05');assert.equal(week.sessions,1);assert.equal(week.minutes,30);
for(const layer of ['soft','loud'])for(const name of ['C3','Ds3','Fs3','A3','C4','Ds4','Fs4','A4','C5','Ds5','Fs5','A5','C6','Ds6'])assert.ok(statSync(new URL(`samples/${layer}/${name}.mp3`,import.meta.url)).size>1000);
assert.equal(sampleNotes.length,30);
for(const n of sampleNotes){const name=['C','Cs','D','Ds','E','F','Fs','G','Gs','A','As','B'][n%12]+(Math.floor(n/12)-1);for(const layer of ['','soft/','loud/'])assert.ok(statSync(new URL(`samples/${layer}${name}.mp3`,import.meta.url)).size>1000);}
for(let n=21;n<=108;n++)assert.ok(Math.abs(nearestSample(n)-n)<=1,'Sampler covers keyboard, chords and inversions');
for(const name of ['C3','Ds3','Fs3','A3','C4','Ds4','Fs4','A4','C5','Ds5','Fs5','A5','C6','Ds6'])assert.ok(statSync(new URL(`samples/${name}.mp3`,import.meta.url)).size>1000);
let p=blankProgress();assert.equal(stages.length,8);assert.equal(stages.reduce((n,s)=>n+s.lessons.length,0),24);assert.throws(()=>mutateProgress(p,'lesson',{stage:2,chapter:0}));
for(const s of stages){assert.equal(s.quiz.length,5);assert.equal(s.checks.length,3);assert.equal(canComplete(p,s.id),true);for(let c=0;c<3;c++)p=mutateProgress(p,'lesson',{stage:s.id,chapter:c});for(let c=0;c<3;c++)p=mutateProgress(p,'check',{stage:s.id,index:c,checked:true});p=mutateProgress(p,'quiz',{stage:s.id,answers:s.quiz.map(q=>q.answer)});p=mutateProgress(p,'practice',{stage:s.id,rubric:[3,4,3,4],reviewed:true});assert.equal(stagePassed(p.stages[s.id]),true);}
assert.throws(()=>mutateProgress(p,'practice',{stage:1,rubric:[0,3,4,5],reviewed:true}));assert.throws(()=>mutateProgress(p,'check',{stage:1,index:0,checked:false}));assert.throws(()=>mutateProgress(p,'journal',{entry:{stage:1,minutes:-1,tempo:60,note:'a'}}));
p=mutateProgress(p,'journal',{entry:{stage:1,minutes:45,tempo:60,note:'latihan'}});assert.equal(p.journal.length,1);const merged=mutateProgress(p,'import',{progress:p});assert.equal(merged.journal.length,1);assert.throws(()=>mutateProgress(blankProgress(),'import',{progress:{stages:{8:p.stages[8]},journal:[],path:'pop'}}));
assert.equal(rhythmScore([100,200],[100,200]),100);assert.equal(rhythmScore([100],[100,200]),0);assert.equal(rhythmScore([300,400],[100,200]),0);
console.log('PASS: 8 stage gates, 24 chapters, 40 quiz questions, rubric bounds, journal validation, backup merge, rhythm scoring.');
