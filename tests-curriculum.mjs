import assert from 'node:assert/strict';
import {curriculum,rubric,dailyPlans,majorScales} from './curriculum.js';
import {chapterDemos,repertoire,midiBytes,readingVariation,scoreSvg} from './curriculum-practice.js';
import {encodeRecord,decodeRecord,observations,competency,blockPassed,recommendation,validRecord,validDates} from './curriculum-progress.js';
import {blankProgress} from './course.js';
import {mutateProgress} from './backend/progress.js';
import {readMidi} from './midi-file.js';
import {weeklySummary,exercises} from './exercises.js';
assert.equal(curriculum.length,12);assert.equal(curriculum.filter(b=>b.number).length,8);assert.equal(curriculum.flatMap(b=>b.chapters).length,36);assert.equal(new Set(curriculum.flatMap(b=>b.chapters.map(c=>c.id))).size,36);assert.equal(rubric.length,7);assert.equal(majorScales.length,12);
for(const b of curriculum){for(const id of b.requires)assert.ok(curriculum.some(x=>x.id===id));for(const c of b.chapters){for(const field of ['id','title','goal','example','solo','error'])assert.ok(c[field].length>0);assert.ok(c.body.length>=3);assert.ok(c.terms.length>=2);assert.equal(c.steps.length,3);assert.equal(c.notes.length,c.fingers.length);assert.ok(c.quiz.options[c.quiz.answer]);}}
for(const p of dailyPlans)assert.equal(p.parts.reduce((n,x)=>n+x[1],0),p.minutes);
assert.equal(exercises.length,96);assert.equal(chapterDemos.length,36);assert.equal(repertoire.length,36);
for(const e of [...chapterDemos,...repertoire,readingVariation(987)]){const midi=readMidi(midiBytes(e).buffer);assert.ok(midi.notes.length>0);assert.ok(midi.notes.every(n=>n.note>=21&&n.note<=108));assert.ok(Math.abs(midi.duration-Math.max(...e.events.map(x=>x.beat+x.duration)))<.01);assert.match(scoreSvg(e),/<svg/);assert.ok(e.events.every(x=>x.duration>0&&x.beat>=0));}
assert.deepEqual(readingVariation(42),readingVariation(42));assert.notDeepEqual(readingVariation(42).events,readingVariation(43).events);
const dates=['2026-01-01','2026-01-02','2026-01-03'];assert.equal(validDates(dates,3),true);assert.equal(validDates(['2026-02-30','2026-01-02','2026-01-03'],3),false);assert.equal(validDates(['9999-01-01',...dates],4),false);assert.equal(validDates(dates,2),false);
let p=blankProgress();const before=structuredClone(p);
const record=r=>{p=mutateProgress(p,'journal',{entry:{stage:1,minutes:1,tempo:60,note:encodeRecord(r)}});};
const first=curriculum[0].chapters[0];record({chapter:first.id,type:'read'});record({chapter:first.id,type:'attempt'});assert.equal(competency(p.journal,curriculum[0],first).qualified,false);
assert.equal(decodeRecord({note:'[PIANO-PATH-CURRICULUM-V2] invalid'}),null);
assert.equal(validRecord({chapter:first.id,type:'quiz',score:100,answers:[0,0,0]}),false);
assert.throws(()=>encodeRecord({chapter:'not-real',type:'read'}));
assert.throws(()=>encodeRecord({chapter:first.id,type:'assessment',rubric:[5],source:'self',evidence:'x',takes:1}));
const assessment=(c,source='self',extra={})=>({chapter:c.id,type:'assessment',source,teacher:source==='teacher-feedback'?'Guru piano — catatan pengguna':'',evidence:'Rekaman karya utuh; melodi jelas, ritme stabil, kenyamanan diamati dan refleksi tersedia.',takes:1,rubric:Array(7).fill(3),...extra});
record({chapter:first.id,type:'quiz',score:100,answers:[first.quiz.answer,1,1]});record(assessment(first));assert.equal(competency(p.journal,curriculum[0],first).qualified,true);assert.equal(blockPassed(p.journal,'foundation'),false);
for(const b of curriculum){for(const c of b.chapters){record({chapter:c.id,type:'read'});record({chapter:c.id,type:'attempt'});record({chapter:c.id,type:'quiz',score:100,answers:[c.quiz.answer,1,1]});if(b.human&&b.id!=='advanced'){record(assessment(c));assert.equal(competency(p.journal,b,c).qualified,false);}record(assessment(c,b.human?'teacher-feedback':'self',b.id==='advanced'?{takes:3,dates}:{}));}assert.equal(blockPassed(p.journal,b.id),true,b.id);}
assert.deepEqual(p.stages,before.stages,'v1 achievements untouched');
assert.ok(p.journal.length<1000);assert.equal(weeklySummary(p).minutes,0,'evidence records are not practice minutes');assert.equal(weeklySummary(p).sessions,0);
const backup=mutateProgress(blankProgress(),'import',{progress:p});assert.deepEqual(backup.journal,p.journal);assert.equal(blockPassed(backup.journal,'advanced'),true);
const advancedOnly=p.journal.filter(e=>['individual','independent','portfolio'].includes(decodeRecord(e)?.chapter));assert.equal(blockPassed(advancedOnly,'advanced'),false,'prerequisites cannot be bypassed');
record({...assessment(first),rubric:[2,3,3,3,3,3,3]});assert.equal(competency(p.journal,curriculum[0],first).qualified,false,'latest review controls current competency; old evidence retained');assert.ok(observations(p.journal,first.id).assessments.length>=2);assert.equal(recommendation(p.journal).block.id,'foundation');
console.log('PASS: 36 chapters, 12 prerequisite groups, 96 examples, original MIDI round trips, daily plans, 7 descriptive rubrics, distinct evidence states, self/reported teacher distinction, advanced dates, guest-equivalent records, v1 preservation and backup merge.');
