import {curriculum} from './curriculum.js';

const names=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
export const name=n=>names[n%12]+(Math.floor(n/12)-1);
const durations={instrument:[2,2,2,2],pulse:[1,1,2,2,2],meter:[2,1,1,1,1,3],together:[1,1,1,1,1,1,1,1],scales:Array(8).fill(1),function:Array(4).fill(4),pedal:Array(4).fill(4),memory:Array(4).fill(4),reharmonize:Array(4).fill(4),portfolio:Array(4).fill(4)};
export const chapterDemos=curriculum.flatMap(block=>block.chapters.map(c=>{
 let beat=0;
 const events=c.notes.map((notes,i)=>{const duration=durations[c.id]?.[i]??1;const event={notes:notes===null?[]:Array.isArray(notes)?notes:[notes],beat,duration,velocity:c.id==='phrases'?[40,55,70,90,105,80,60,40][i]:80,fingers:c.fingers[i],gate:c.id==='symbols'&&i>=4?.3:.88};beat+=duration;return event;});
 if(c.id==='individual'){events.splice(0,events.length,...[{notes:[48,60],beat:0,duration:2/3,velocity:70},{notes:[64],beat:2/3,duration:2/3,velocity:80},{notes:[55],beat:1,duration:1,velocity:42},{notes:[67],beat:4/3,duration:2/3,velocity:80}]);}
 return {key:`demo:${c.id}`,title:c.title,stage:block.legacy,chapter:0,group:block.title,meter:c.id==='meter'?3:4,events};
}));

// Newly composed original studies. Four beats per bar; independent bass/treble voices.
const schemes={
 foundation:[[60,62,64,60],[62,64,65,62],[64,65,67,64],[62,60,60,null]],
 notation:[[60,64,62,null],[65,64,62,60],[62,null,64,65],[64,62,60,null]],
 coordination:[[60,62,64,67],[65,64,62,60],[64,67,65,64],[62,65,62,60]],
 technique:[[60,62,64,65],[67,69,71,72],[72,71,69,67],[65,64,62,60]],
 harmony:[[64,67,64,60],[65,69,65,60],[62,67,71,67],[64,62,60,null]],
 musicality:[[60,62,64,67],[69,67,65,64],[65,64,62,67],[64,62,60,null]],
 listening:[[60,64,62,67],[65,69,67,64],[62,65,64,62],[64,62,60,null]],
 practice:[[60,64,67,64],[62,65,69,65],[64,67,71,67],[65,64,62,60]],
 classical:[[60,62,64,65],[67,65,64,62],[64,65,67,69],[67,64,62,60]],
 pop:[[67,64,62,60],[69,67,64,62],[65,69,67,65],[64,62,60,null]],
 jazz:[[60,63,65,null],[67,65,63,60],[65,66,67,70],[67,65,63,60]],
 advanced:[[60,64,67,72],[71,69,67,64],[65,69,72,69],[67,65,64,60]]
};
const fingerMaps={foundation:[1,2,3,1],notation:[1,3,2,null],coordination:[1,2,3,5],technique:[1,2,3,1],harmony:[3,5,3,1],musicality:[1,2,3,5],listening:[1,3,2,5],practice:[1,2,4,2],classical:[1,2,3,4],pop:[5,3,2,1],jazz:[1,2,3,null],advanced:[1,2,3,5]};
export const repertoire=curriculum.flatMap((block,index)=>['reading','etude','piece'].map((kind,k)=>{
 const bars=kind==='reading'?4:kind==='etude'?8:block.id==='jazz'?12:block.id==='advanced'?32:16;
 const events=[];
 const basses=block.id==='jazz'?[48,48,48,48,53,53,48,48,55,53,48,55]:[48,53,55,48];
 for(let bar=0;bar<bars;bar++){
  // A, varied A, contrasting B, return A; extra advanced cycle adds a register variation.
  const contrast=kind==='piece'&&bar%16>=8&&bar%16<12;
  const pattern=schemes[block.id][bar%4];
  const shift=contrast?5:kind==='piece'&&bar>=16?12:0;
  pattern.forEach((n,i)=>events.push({notes:n===null?[]:[n+shift],beat:bar*4+i,duration:1,velocity:bar%4===2?90:70,hand:'right',fingers:bar===0?fingerMaps[block.id][i]:null,gate:.88}));
  if(index>=2)events.push({notes:[basses[bar%basses.length]+(contrast?5:0)],beat:bar*4,duration:4,velocity:42,hand:'left',fingers:5,gate:.9});
 }
 events.sort((a,b)=>a.beat-b.beat);
 const key=`repertoire:${block.id}:${kind}`;
 return {key,title:`${['Kartu baca baru','Étude mini','Miniatur utuh'][k]} — ${block.title}`,group:block.title,stage:block.legacy,chapter:0,events,kind,bars,
  purpose:kind==='reading'?'Membaca kontur, interval, dan diam sebelum mendengar; gunakan variasi baru untuk setiap uji.':kind==='etude'?block.chapters[1].goal:block.criteria,
  prerequisite:block.requires.length?`Kompetensi ${block.requires.join(', ')}; contoh chapter dalam tahap ini sudah nyaman.`:'Menemukan C, memahami nomor jari, dan menyiapkan posisi nyaman.',
  practice:'Pindai semua birama, tepuk ritme, lalu mainkan tangan terpisah bila perlu. Latih potongan 2 birama dengan overlap 1 ketuk; sambungkan kembali ke frasa. Tempo awal 40–60 BPM atau lebih lambat bila perlu; tambah 3–5 BPM setelah tiga pengulangan berkualitas. Pertahankan panjang nada, arah frasa, dan kenyamanan.',
  fingers:'Penjarian awal tertera pada birama pertama; rencanakan ulang tiap perpindahan posisi. Untuk melodi lima nada, coba kanan 1–2–3–4–5 dan kiri 5–4–3–2–1. Bass tunggal kiri dapat memakai 5 dengan perpindahan seluruh tangan. Untuk tangga nada gunakan tabel tonalitas; jangan menerapkan satu pola jari ke semua birama.',
  difficulty:'Peralihan akhir birama 4 menuju 5 dan 8 menuju 9, terutama perubahan posisi/karakter. Tandai nada tujuan; coba kedatangan tanpa bunyi lalu tambah ketukan.',
  license:'Komposisi dan MIDI orisinal Piano Path, CC BY 4.0. Atribusi: Piano Path — Studi Kurikulum 2026. Partitur dihasilkan dari komposisi ini; audio sintetis memakai sampel Salamander (CC BY 3.0), kredit di samples/ATTRIBUTION.md.',
  scope:index>=8?'Studi pengantar sebagai bahan kerja teknik/motif. Kelulusan jalur/lanjut tetap membutuhkan repertoar pilihan yang lebih luas dan evaluasi manusia; miniatur ini sendiri belum membuktikan tingkat lanjut.':'Latihan orisinal tahap ini; nilai utuh dengan rubrik dan rekaman, bukan durasi playback.'};
}));
export const curriculumExercises=[...chapterDemos,...repertoire];

// Deterministic when a seed is supplied, new motif/order otherwise. Always unseen before audio.
export function readingVariation(seed=Math.floor(Math.random()*0x7fffffff)){
 let state=seed>>>0;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/2**32;};
 const pool=[60,62,64,65,67],events=Array.from({length:16},(_,i)=>({notes:i%4===3&&random()<.35?[]:[pool[Math.floor(random()*pool.length)]],beat:i,duration:1,velocity:75}));
 return {key:'reading:variation',title:'Variasi baca baru',events,seed};
}
const varint=n=>{const a=[n&127];while((n=Math.floor(n/128)))a.unshift((n&127)|128);return a;};
export function midiBytes(exercise,bpm=60){
 if(!Number.isFinite(bpm)||bpm<20||bpm>300)throw Error('Tempo tidak valid.');
 const ppqn=480,events=[];
 for(const e of exercise.events)for(const n of e.notes){events.push({tick:Math.round(e.beat*ppqn),bytes:[0x90,n,e.velocity??80],off:false});events.push({tick:Math.round((e.beat+e.duration*(e.gate??.9))*ppqn),bytes:[0x80,n,0],off:true});}
 events.sort((a,b)=>a.tick-b.tick||Number(b.off)-Number(a.off));
 const tempo=Math.round(60000000/bpm),track=[0,255,81,3,(tempo>>16)&255,(tempo>>8)&255,tempo&255];let last=0;
 for(const e of events){track.push(...varint(e.tick-last),...e.bytes);last=e.tick;}
 const end=Math.round(Math.max(...exercise.events.map(e=>e.beat+e.duration))*ppqn);
 track.push(...varint(Math.max(0,end-last)),255,47,0);
 const length=track.length;
 return new Uint8Array([77,84,104,100,0,0,0,6,0,0,0,1,1,224,77,84,114,107,(length>>>24)&255,(length>>>16)&255,(length>>>8)&255,length&255,...track]);
}

const xml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const diatonic=n=>Math.floor(n/12)*7+[0,0,1,1,2,3,3,4,4,5,5,6][n%12];
// Readable grand-staff study notation; each line is four 4/4 bars. Exact durations/fingers below.
export function scoreSvg(exercise,maxBars=4){
 const meter=exercise.meter||4,end=Math.max(...exercise.events.map(e=>e.beat+e.duration)),bars=Math.min(maxBars,Math.ceil(end/meter)),width=900,height=220;
 let svg=`<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${xml(exercise.title)} — notasi latihan ${meter}/4" viewBox="0 0 ${width} ${height}"><rect width="900" height="220" fill="#fffdf8"/><text x="12" y="24" fill="#182e2a" font-size="18">𝄞</text><text x="12" y="140" fill="#182e2a" font-size="30">𝄢</text><text x="50" y="62" font-size="18">${meter}</text><text x="50" y="80" font-size="18">4</text>`;
 for(const y0 of [45,135])for(let i=0;i<5;i++)svg+=`<path d="M75 ${y0+i*10}H885" stroke="#808080" stroke-width="1"/>`;
 for(let bar=0;bar<=bars;bar++){const x=85+bar*(790/bars);svg+=`<path d="M${x} 45V85M${x} 135V175" stroke="#808080"/>`;}
 for(const e of exercise.events.filter(e=>e.beat<bars*meter)){
  const x=100+e.beat*(790/(bars*meter));
  if(!e.notes.length){svg+=`<text x="${x}" y="76" font-size="18">𝄽</text><text x="${x}" y="107" font-size="10">${e.duration} ketuk diam</text>`;continue;}
  for(const n of e.notes){const treble=n>=60,base=treble?85:175,anchor=diatonic(treble?64:43),y=base-(diatonic(n)-anchor)*5;
   const top=treble?45:135,bottom=treble?85:175;
   for(let ly=bottom+10;ly<=y;ly+=10)svg+=`<path d="M${x-10} ${ly}h20" stroke="#555"/>`;
   for(let ly=top-10;ly>=y;ly-=10)svg+=`<path d="M${x-10} ${ly}h20" stroke="#555"/>`;
   if([1,3,6,8,10].includes(n%12))svg+=`<text x="${x-18}" y="${y+5}" font-size="15">♯</text>`;
   svg+=`<ellipse cx="${x}" cy="${y}" rx="6" ry="4" fill="${e.duration>=2?'#fffdf8':'#182e2a'}" stroke="#182e2a" transform="rotate(-15 ${x} ${y})"/>`;
   if(e.duration===3)svg+=`<circle cx="${x+12}" cy="${y-2}" r="2" fill="#182e2a"/>`;
   if(e.duration<1)svg+=`<path d="M${x+5} ${y-27}q12 4 7 15" fill="none" stroke="#182e2a"/>`;
   if(e.duration<4)svg+=`<path d="M${x+5} ${y}v-27" stroke="#182e2a"/>`;
  }
  svg+=`<text x="${x-5}" y="193" font-size="9" fill="#182e2a">${Number(e.duration.toFixed(2))} ketuk${e.fingers!=null?" · "+xml(e.fingers):""}</text>`;
  svg+=`<text x="${x-5}" y="207" font-size="10" fill="#182e2a">${xml(e.notes.map(name).join('+'))}</text>`;
 }
 return svg+'</svg>';
}
