import {curriculum} from './curriculum.js';
// Persist observations in the deployed journal API. No schema change, no v1 mutation.
// Records are user declarations, including reported teacher feedback, not verified certificates.
export const recordPrefix='[PIANO-PATH-CURRICULUM-V2] ';
const ids=new Set(curriculum.flatMap(b=>b.chapters.map(c=>c.id)));
const sources=['self','teacher-feedback'];
export function isCurriculumRecord(entry){return typeof entry?.note==='string'&&entry.note.startsWith(recordPrefix);}
export function decodeRecord(entry){
 if(!isCurriculumRecord(entry))return null;
 try{const r=JSON.parse(entry.note.slice(recordPrefix.length));return validRecord(r)?r:null;}catch{return null;}
}
export function validRecord(r){
 if(!r||!ids.has(r.chapter)||!['read','attempt','quiz','assessment'].includes(r.type))return false;
 if(r.type==='quiz'){const c=curriculum.flatMap(b=>b.chapters).find(c=>c.id===r.chapter);return Array.isArray(r.answers)&&r.answers.length===3&&r.answers.every(n=>Number.isInteger(n)&&n>=0&&n<=2)&&r.score===Math.round([c.quiz.answer,1,1].reduce((n,a,i)=>n+(a===r.answers[i]?1:0),0)/3*100);}
 if(r.type!=='assessment')return true;
 return Array.isArray(r.rubric)&&r.rubric.length===7&&r.rubric.every(n=>Number.isInteger(n)&&n>=1&&n<=5)&&sources.includes(r.source)&&typeof r.evidence==='string'&&r.evidence.trim().length>=20&&r.evidence.length<=900&&Number.isInteger(r.takes)&&r.takes>=1&&r.takes<=20&&(r.source!=='teacher-feedback'||typeof r.teacher==='string'&&r.teacher.trim().length>=3&&r.teacher.length<=120)&&(!['individual','independent','portfolio'].includes(r.chapter)||validDates(r.dates,r.takes));
}
export function validDates(dates,takes){const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());return Array.isArray(dates)&&dates.length>=3&&dates.length<=takes&&new Set(dates).size===dates.length&&dates.every(d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d))&&new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d&&d<=today);}
export function encodeRecord(r){if(!validRecord(r))throw Error('Catatan kompetensi tidak valid.');const note=recordPrefix+JSON.stringify(r);if(note.length>2000)throw Error('Catatan terlalu panjang.');return note;}
export function observations(entries,chapter){
 const records=entries.map(decodeRecord).filter(r=>r?.chapter===chapter);
 return {read:records.some(r=>r.type==='read'),attempt:records.some(r=>r.type==='attempt'),quiz:Math.max(0,...records.filter(r=>r.type==='quiz').map(r=>r.score)),assessments:records.filter(r=>r.type==='assessment')};
}
export function competency(entries,block,c){
 const o=observations(entries,c.id),e=o.assessments.at(-1);
 const evidence=!!e&&e.rubric.every(n=>n>=3)&&(!block.human||e.source==='teacher-feedback')&&(block.id!=='advanced'||e.takes>=3);
 return { ...o,evaluation:e,qualified:o.read&&o.attempt&&o.quiz>=80&&evidence,needsHuman:!!block.human,source:e?.source};
}
export function blockPassed(entries,id,visiting=new Set()){
 const b=curriculum.find(b=>b.id===id);if(!b||visiting.has(id))return false;
 const seen=new Set(visiting).add(id);
 const prereqs=b.requires.every(r=>blockPassed(entries,r,seen));
 // Advanced depth also requires a documented specialization, not all three paths.
 const path=id!=='advanced'||['classical','pop','jazz'].some(r=>blockPassed(entries,r,seen));
 return prereqs&&path&&b.chapters.every(c=>competency(entries,b,c).qualified);
}
export function chapterPassed(entries,b,c){return b.requires.every(id=>blockPassed(entries,id))&&(b.id!=='advanced'||['classical','pop','jazz'].some(id=>blockPassed(entries,id)))&&competency(entries,b,c).qualified;}
export function recommendation(entries,path='pop'){
 const sequence=[...curriculum.filter(b=>b.number),curriculum.find(b=>b.id===path)||curriculum.find(b=>b.id==='pop'),curriculum.at(-1)];
 for(const b of sequence){const c=b.chapters.find(c=>!chapterPassed(entries,b,c));if(!c)continue;const o=competency(entries,b,c);return {block:b,chapter:c,focus:!o.read?'Baca kompetensi dan contoh.':!o.attempt?'Coba latihan terpandu dan catat percobaan.':o.quiz<80?'Ulang kuis lalu pelajari penjelasan.':!o.evaluation?'Rekam tugas utuh dan isi rubrik.':o.needsHuman&&o.source!=='teacher-feedback'?'Mintalah umpan balik pengajar; catatan mandiri tetap tersedia.':'Perbaiki aspek rubrik di bawah 3, lengkapi bukti, dan uji lagi pada hari berbeda.'};}
 return {focus:'Pelihara repertoar dan rencanakan evaluasi berkala. Penyelesaian bukan sertifikasi expert.'};
}
