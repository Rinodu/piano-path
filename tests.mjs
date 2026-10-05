import assert from 'node:assert/strict';
import {stages,blankProgress,stagePassed,canComplete,rhythmScore} from './course.js';
import {mutateProgress} from './backend/progress.js';
import {sampleNotes,nearestSample} from './piano-audio.js';
import {statSync} from 'node:fs';
assert.equal(sampleNotes.length,14);
for(let n=48;n<=87;n++)assert.ok(Math.abs(nearestSample(n)-n)<=1,'Sampler covers keyboard, chords and inversions');
for(const name of ['C3','Ds3','Fs3','A3','C4','Ds4','Fs4','A4','C5','Ds5','Fs5','A5','C6','Ds6'])assert.ok(statSync(new URL(`samples/${name}.mp3`,import.meta.url)).size>1000);
let p=blankProgress();assert.equal(stages.length,8);assert.equal(stages.reduce((n,s)=>n+s.lessons.length,0),24);assert.throws(()=>mutateProgress(p,'lesson',{stage:2,chapter:0}));
for(const s of stages){assert.equal(s.quiz.length,5);assert.equal(s.checks.length,3);assert.equal(canComplete(p,s.id),true);for(let c=0;c<3;c++)p=mutateProgress(p,'lesson',{stage:s.id,chapter:c});for(let c=0;c<3;c++)p=mutateProgress(p,'check',{stage:s.id,index:c,checked:true});p=mutateProgress(p,'quiz',{stage:s.id,answers:s.quiz.map(q=>q.answer)});p=mutateProgress(p,'practice',{stage:s.id,rubric:[3,4,3,4],reviewed:true});assert.equal(stagePassed(p.stages[s.id]),true);}
assert.throws(()=>mutateProgress(p,'practice',{stage:1,rubric:[0,3,4,5],reviewed:true}));assert.throws(()=>mutateProgress(p,'check',{stage:1,index:0,checked:false}));assert.throws(()=>mutateProgress(p,'journal',{entry:{stage:1,minutes:-1,tempo:60,note:'a'}}));
p=mutateProgress(p,'journal',{entry:{stage:1,minutes:45,tempo:60,note:'latihan'}});assert.equal(p.journal.length,1);const merged=mutateProgress(p,'import',{progress:p});assert.equal(merged.journal.length,1);assert.throws(()=>mutateProgress(blankProgress(),'import',{progress:{stages:{8:p.stages[8]},journal:[],path:'pop'}}));
assert.equal(rhythmScore([100,200],[100,200]),100);assert.equal(rhythmScore([100],[100,200]),0);assert.equal(rhythmScore([300,400],[100,200]),0);
console.log('PASS: 8 stage gates, 24 chapters, 40 quiz questions, rubric bounds, journal validation, backup merge, rhythm scoring.');
