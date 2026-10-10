// Salamander Grand Piano / Alexander Holm, CC BY 3.0. See samples/ATTRIBUTION.md.
export const sampleNotes = Array.from({length:30},(_,i)=>21+i*3);
const fileNames=sampleNotes.map(n=>['C','Cs','D','Ds','E','F','Fs','G','Gs','A','As','B'][n%12]+(Math.floor(n/12)-1));
let buffers=new Map(),loading;
export function velocityLayer(velocity){return velocity<=50?'soft':velocity<=95?'medium':'loud';}
export function nearestSample(note){return sampleNotes.reduce((best,n)=>Math.abs(n-note)<Math.abs(best-note)?n:best,sampleNotes[0]);}
export function loadPiano(ctx){
  if(buffers.size===sampleNotes.length*3)return Promise.resolve();
  if(!loading)loading=Promise.all(['soft','medium','loud'].flatMap(layer=>sampleNotes.map(async(note,i)=>{
    const response=await fetch(new URL(`samples/${layer==='medium'?'':layer+'/'}${fileNames[i]}.mp3`,import.meta.url),{signal:AbortSignal.timeout(20000)});
    if(!response.ok)throw Error('Sampel piano gagal dimuat. Periksa koneksi lalu coba lagi.');
    return [layer+':'+note,await ctx.decodeAudioData(await response.arrayBuffer())];
  }))).then(entries=>{buffers=new Map(entries);}).catch(error=>{loading=undefined;throw error;});
  return loading;
}
export function startPianoTone(ctx,n,when=ctx.currentTime,velocity=80,output=ctx.destination){
  const root=nearestSample(n),source=ctx.createBufferSource(),gain=ctx.createGain();
  source.buffer=buffers.get(velocityLayer(velocity)+':'+root);
  if(!source.buffer)throw Error('Sampel piano belum siap.');
  source.playbackRate.value=2**((n-root)/12);
  gain.gain.setValueAtTime(.35+.55*Math.max(1,Math.min(127,velocity))/127,when);
  source.connect(gain);gain.connect(output);source.start(when);
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
