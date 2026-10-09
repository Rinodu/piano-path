import {midiFilePanel,bindMidiFile} from './midi-file.js';
import {noteName} from './exercises.js';

export function fallingPage(piano){return `<section class="page-title"><span class="eyebrow">LATIHAN FILE MIDI</span><h1>Ikuti balok. Mainkan nadanya.</h1><p>Balok menyentuh garis bawah saat nada perlu dimainkan. Hubungkan piano USB di pengaturan MIDI di bawah halaman; keyboard komputer dan tuts layar juga bisa dipakai.</p><a href="#midi-connect" id="practice-usb">Ke pengaturan piano USB ↓</a></section>${midiFilePanel()}<section class="panel falling-panel"><div class="tool-controls"><label><input id="practice-example" type="checkbox" checked> Dengarkan contoh MIDI</label><label>Koreksi waktu input (ms)<input id="practice-offset" type="number" min="-500" max="500" step="10" value="0"></label><button id="practice-reset" class="outline">Reset hasil</button></div><p class="status-line">Matikan contoh untuk berlatih sendiri. Penilaian menghitung nada yang ditekan dalam ±250 ms; durasi tahan, pedal, dan ekspresi belum dinilai. Koreksi positif membantu jika input terlambat.</p><p id="practice-score" role="status">Tepat 0 · Terlewat 0 · Salah 0</p><canvas id="falling-roll" aria-label="Balok nada MIDI turun menuju garis waktu di atas tuts"></canvas><p id="practice-next" class="status-line">Buka file MIDI untuk melihat nada berikutnya.</p>${piano}</section>`;}

export function bindFalling(adapter){
 const $=s=>document.querySelector(s),canvas=$('#falling-roll'),ctx=canvas.getContext('2d');
 let state={notes:[],time:0,speed:1,playing:false},hits=new Set(),wrong=0,missed=0,baseline=0,disposed=false;
 const score=()=>$('#practice-score').textContent=`Tepat ${hits.size} · Terlewat ${missed} · Salah ${wrong}`;
 function reset(){hits.clear();wrong=missed=0;baseline=Math.max(0,state.time);score();draw();}
 function draw(){
  if(disposed)return;
  const box=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2),height=320;
  if(canvas.width!==Math.round(box.width*ratio)||canvas.height!==height*ratio){canvas.width=Math.round(box.width*ratio);canvas.height=height*ratio;}
  ctx.setTransform(ratio,0,0,ratio,0,0);ctx.fillStyle='#182e2a';ctx.fillRect(0,0,box.width,height);
  const bottom=height-18,scale=bottom/(4*state.speed),keys=new Map([...document.querySelectorAll('#keyboard .key')].map(k=>[Number(k.dataset.note),k.getBoundingClientRect()]));
  ctx.strokeStyle='#ffffff15';for(const rect of keys.values()){ctx.beginPath();ctx.moveTo(rect.x-box.x,0);ctx.lineTo(rect.x-box.x,height);ctx.stroke();}
  let visible=0,next;
  for(let i=0;i<state.notes.length;i++){
   const n=state.notes[i];if(n.time>state.time+4*state.speed)break;
   if(n.time+n.duration<state.time)continue;
   if(n.time>=state.time&&!next)next=n;
   const rect=keys.get(n.note);if(!rect)continue;
   const x=rect.x-box.x,y=bottom-(n.time+n.duration-state.time)*scale,h=n.duration*scale;
   if(x+rect.width<0||x>box.width)continue;
   ctx.fillStyle=hits.has(i)?'#d1eb82':n.time<=state.time?'#e6a15b':'#83b9d5';ctx.fillRect(x+2,Math.max(0,y),Math.max(2,rect.width-4),Math.min(bottom,y+h)-Math.max(0,y));
   if(rect.width>25){ctx.fillStyle='#182e2a';ctx.font='11px sans-serif';ctx.fillText(noteName(n.note),x+4,Math.max(12,y+14));}visible++;
  }
  ctx.fillStyle='#d1eb82';ctx.fillRect(0,bottom,box.width,3);
  canvas.dataset.blocks=String(visible);canvas.dataset.time=String(state.time);
  $('#practice-next').textContent=next?`Nada berikutnya: ${noteName(next.note)} · ${(Math.max(0,next.time-state.time)/state.speed).toFixed(1)} detik lagi`:'Geser rentang piano untuk melihat nada di luar layar. Balok biru = contoh, hijau = tepat.';
 }
 function update(next){
  if(next.notes!==state.notes||next.revision!==state.revision){state=next;reset();}else state=next;
  missed=state.notes.reduce((count,n,i)=>count+(!hits.has(i)&&n.time>=baseline&&n.time<state.time-.25*state.speed?1:0),0);score();draw();
 }
 function input(note,on){if(!on||!state.playing)return;const offset=Number($('#practice-offset').value);if(!Number.isFinite(offset)||Math.abs(offset)>500)return;const t=state.time-offset/1000*state.speed;let best=-1,distance=Infinity;for(let i=0;i<state.notes.length;i++){const n=state.notes[i],delta=Math.abs(n.time-t);if(n.note===note&&!hits.has(i)&&delta<=.25*state.speed&&delta<distance){best=i;distance=delta;}}if(best>=0)hits.add(best);else wrong++;score();draw();}
 adapter.setInputListener(input);
 const stop=bindMidiFile({...adapter,leadIn:2,timeline:update,startTone:(...args)=>$('#practice-example').checked?adapter.startTone(...args):null});
 $('#practice-reset').onclick=()=>{$('#song-stop').click();reset();};
 $('#practice-usb').onclick=e=>{e.preventDefault();$('#midi-connect').scrollIntoView({block:'center',behavior:'smooth'});$('#midi-connect').focus();};
 const scroller=$('#keyboard').closest('.keyboard-scroll');scroller.addEventListener('scroll',draw);window.addEventListener('resize',draw);draw();
 return ()=>{disposed=true;stop();adapter.setInputListener(null);scroller.removeEventListener('scroll',draw);window.removeEventListener('resize',draw);};
}
