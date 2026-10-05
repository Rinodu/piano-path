import {stages,stagePassed} from './course.js';
import {isCurriculumRecord,recommendation} from './curriculum-progress.js';
import {curriculumExercises} from './curriculum-practice.js';
export const noteName=n=>['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][n%12]+(Math.floor(n/12)-1);
const seq=(notes,durations=1,velocity=80,start=0)=>{let beat=start;return notes.map((n,i)=>{const duration=Array.isArray(durations)?durations[i]:durations;const event={notes:n===null?[]:Array.isArray(n)?n:[n],beat,duration,velocity:Array.isArray(velocity)?velocity[i]:velocity};beat+=duration;return event;});};
const chord=(notes,beat,duration=4,velocity=75)=>({notes,beat,duration,velocity});
const both=(melody,bas)=>[...seq(melody),...bas.map((n,i)=>chord([n],i*4,4,45))].sort((a,b)=>a.beat-b.beat);
export const exercises=[
 {title:'Lima jari C',events:seq([60,62,64,65,67,65,64,62,60])},
 {title:'Satu, satu, dua — bunyi dan istirahat',events:seq([60,62,64,67,null],[1,1,2,2,2])},
 {title:'Melodi naik dan turun',events:seq([60,62,64,65,67,65,64,62,60],[1,1,1,1,1,1,1,1,4])},
 {title:'Penanda C4, G4, F3',events:seq([60,67,53],[2,2,2])},
 {title:'Semiton dan lompatan terts',events:seq([60,61,64,65,60,64,67])},
 {title:'Frasa membaca empat birama',events:seq([60,64,62,65,64,62,60,62,64,60],[1,1,2,2,2,1,1,1,1,4])},
 {title:'Melodi kanan dan bas kiri',events:both([60,62,64,67,65,64,62,60],[48,43])},
 {title:'Melodi jelas, iringan lembut',events:both([60,64,67,64,62,65,67,62],[48,43])},
 {title:'Legato lalu staccato',events:[...seq([60,62,64,65],1),...seq([67,65,64,62],1,80,4).map(e=>({...e,gate:.3}))]},
 {title:'C, F, G, Am',events:seq([[60,64,67],[65,69,72],[67,71,74],[69,72,76]],2)},
 {title:'Inversi dekat dengan bas akar',events:[[48,60,64,67],[43,59,62,67],[45,60,64,69],[41,60,65,69]].map((n,i)=>chord(n,i*4))},
 {title:'Bas pada 1, akor pada 2 dan 4',events:[[48,[60,64,67]],[43,[59,62,67]],[45,[60,64,69]],[41,[60,65,69]]].flatMap(([bass,c],i)=>[chord([bass],i*4,1,55),chord(c,i*4+1,1),chord(c,i*4+3,1)])},
 {title:'Arah frasa dan puncak',events:seq([60,62,64,67,69,67,64,62,60],[1,1,1,1,1,1,1,1,4],[42,50,62,80,110,92,72,55,40])},
 {title:'Resonansi berganti harmoni C–F',events:seq([[60,64,67],[60,65,69],[60,64,67],[60,65,69]],4).map(e=>({...e,gate:.98}))},
 {title:'Tempo stabil lalu akhir frasa melebar',events:seq([60,64,67,64,60,64,67,64,60],[1,1,1,1,1,1,1.2,1.5,3])},
 {title:'C mayor dan G mayor',events:seq([60,62,64,65,67,69,71,72,67,69,71,72,74,76,78,79],.5)},
 {title:'A minor natural, harmonik, dan arpeggio C',events:seq([57,59,60,62,64,65,67,69,57,59,60,62,64,65,68,69,60,64,67,72],.5)},
 {title:'Bas angka, melodi pada dan',events:Array.from({length:8},(_,i)=>[chord([48],i, .4,45),chord([60,64,67][i%3]?[ [60,64,67][i%3] ]:[],i+.5,.4,85)]).flat()},
 {title:'Studi dua suara',events:[...seq([60,62,64,65,67,65,64,62]),...seq([48,43,41,43],2,50)].sort((a,b)=>a.beat-b.beat)},
 {title:'Cuplikan intro, verse, chorus',events:[[60,64,67],[59,62,67],[60,64,69],[60,65,69]].flatMap((c,i)=>[chord(c,i*4,4,50),...seq(c,.5,55,16+i*4),chord(c,32+i*4,4,105)]).sort((a,b)=>a.beat-b.beat)},
 {title:'Blues C 12 birama, lalu ii–V–I',events:[...Array.from({length:12},(_,i)=>chord(i===4||i===5||i===9?[53,57,60,63]:i===8||i===11?[55,59,62,65]:[48,52,55,58],i*4,4)),...seq([[62,65,69,72],[67,71,74,77],[60,64,67,71]],4,80,48)]},
 {title:'Mini-program: pembuka, kontras, penutup',events:[...seq([60,64,67,72],1,85),...seq([57,60,64,69],2,45,4),...seq([[60,64,67],[65,69,72],[67,71,74],[60,64,67]],2,95,12)]},
 {title:'Titik jangkar A, B, dan kadens',events:seq([[60,64,67],[60,65,69],[59,62,67],[60,64,67]],4)},
 {title:'Dua interpretasi untuk dibandingkan',events:[...seq([60,62,64,67,60],1,70),...seq([60,62,64,67,60],[1,1,1,1.4,2],[40,55,75,105,45],6)]}
].map((e,i)=>({...e,id:String(i),stage:Math.floor(i/3)+1,chapter:i%3}));
export function exerciseFor(stage,chapter){return exercises[(stage-1)*3+chapter];}
exercises.push(...curriculumExercises.map((e,i)=>({...e,id:String(i+24)})));
export function noteDrill(mode='sequence'){
 if(mode==='chord')return [{notes:[60,64,67]},{notes:[65,69,72]},{notes:[59,62,67]},{notes:[60,64,69]}];
 if(mode==='random')return Array.from({length:8},()=>({notes:[[60,62,64,65,67,69,71,72][Math.floor(Math.random()*8)]]}));
 return [60,64,67,65,62,60].map(n=>({notes:[n]}));
}
export function matchNotes(actual,expected){const a=[...new Set(actual)].sort((x,y)=>x-y),b=[...new Set(expected)].sort((x,y)=>x-y);return a.length===b.length&&a.every((n,i)=>n===b[i]);}
export function parseMidi(data){if(!data||data.length<3)return null;const [status,n,value]=data;if(![status,n,value].every(Number.isInteger)||n<0||n>127||value<0||value>127)return null;const type=status&0xf0;if(type===0x90&&value>0)return {type:'on',note:n,velocity:value};if(type===0x80||(type===0x90&&value===0))return {type:'off',note:n};if(type===0xb0&&n===64)return {type:'pedal',down:value>=64};return null;}
function localDate(date){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(date));}
export function weeklySummary(p,now=new Date()){
 const today=localDate(now),monday=new Date(today+'T00:00:00Z');monday.setUTCDate(monday.getUTCDate()-(monday.getUTCDay()+6)%7);const start=monday.toISOString().slice(0,10);
 const entries=p.journal.filter(e=>!isCurriculumRecord(e)).filter(e=>{const d=localDate(e.date);return d>=start&&d<=today;});const next=stages.find(s=>!stagePassed(p.stages[s.id]));const chapter=next?next.lessons.findIndex((_,i)=>!p.stages[next.id]?.lessons?.includes(i)):-1;
 let focus=next?(chapter>=0?`Pelajari chapter ${chapter+1}: ${next.lessons[chapter].title}`:!(p.stages[next.id]?.quiz>=80)?'Kerjakan kuis tahap ini sampai minimal 80%.':'Selesaikan checklist dan rekam tugas praktik.'):'Semua tahap lulus. Pilih tiga fokus untuk pendalaman 12 minggu.';
 const low=next&&p.stages[next.id]?.rubric?.findIndex(n=>n<3);if(low>=0)focus=`Perbaiki ${['ritme','ketepatan not','kontrol gerakan','frasa dan keseimbangan'][low]}, lalu rekam ulang praktik.`;
 const current=recommendation(p.journal,p.path);focus=current.focus;const href=current.block?`#learn/${current.block.id}/${current.chapter.id}`:'#home';
 return {href,start,sessions:entries.length,minutes:entries.reduce((n,e)=>n+e.minutes,0),goal:p.weekly||{sessions:3,minutes:120},stage:next?.id||8,chapter:chapter>=0?chapter:3,focus};
}
