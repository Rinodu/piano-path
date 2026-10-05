// Salamander Grand Piano / Alexander Holm, CC BY 3.0. See samples/ATTRIBUTION.md.
export const sampleNotes = Array.from({length:14},(_,i)=>48+i*3);
const fileNames=['C3','Ds3','Fs3','A3','C4','Ds4','Fs4','A4','C5','Ds5','Fs5','A5','C6','Ds6'];
let buffers=new Map(),loading;
export function nearestSample(note){return sampleNotes.reduce((best,n)=>Math.abs(n-note)<Math.abs(best-note)?n:best,sampleNotes[0]);}
export function loadPiano(ctx){
  if(buffers.size===sampleNotes.length)return Promise.resolve();
  if(!loading)loading=Promise.all(sampleNotes.map(async(note,i)=>{
    const response=await fetch(new URL(`samples/${fileNames[i]}.mp3`,import.meta.url),{signal:AbortSignal.timeout(20000)});
    if(!response.ok)throw Error('Sampel piano gagal dimuat. Periksa koneksi lalu coba lagi.');
    return [note,await ctx.decodeAudioData(await response.arrayBuffer())];
  })).then(entries=>{buffers=new Map(entries);}).catch(error=>{loading=undefined;throw error;});
  return loading;
}
export function startPianoTone(ctx,n,when=ctx.currentTime){
  const root=nearestSample(n),source=ctx.createBufferSource(),gain=ctx.createGain();
  source.buffer=buffers.get(root);
  if(!source.buffer)throw Error('Sampel piano belum siap.');
  source.playbackRate.value=2**((n-root)/12);
  gain.gain.setValueAtTime(.8,when);
  source.connect(gain);gain.connect(ctx.destination);source.start(when);
  source.onended=()=>{source.disconnect();gain.disconnect();};
  return {gain,source,when};
}
export function releasePianoTone(ctx,v,when=ctx?.currentTime){
  if(!v||!ctx)return;
  if(when<=v.when&&ctx.currentTime<v.when){try{v.source.stop();}catch{}return;}
  const t=Math.max(when,ctx.currentTime,v.when+.005);
  if(v.gain.gain.cancelAndHoldAtTime)v.gain.gain.cancelAndHoldAtTime(t);
  else {v.gain.gain.cancelScheduledValues(t);v.gain.gain.setValueAtTime(v.gain.gain.value,t);}
  v.gain.gain.linearRampToValueAtTime(0,t+.35);
  try{v.source.stop(t+.36);}catch{}
}
