/* Núcleo: estado, persistencia, fases y reloj, fondo. (Script clásico: comparte ámbito global con los demás de esta carpeta) */
const $=s=>document.querySelector(s);
const isDisplay=location.hash==='#display';
if(isDisplay)document.body.classList.add('display');
let S={mode:'down',total:600,base:0,running:false,startAt:0,name:'',msg:'',warn:2,red:1,sound:true,auto:true,fx:true,bgOn:true,dim:35,bgVer:0,bgSel:'u',bgRot:0};
try{const sv=JSON.parse(localStorage.getItem('visainTimer')||'{}');for(const k of['mode','total','name','msg','warn','red','sound','auto','fx','bgOn','dim','bgSel','bgRot'])if(k in sv)S[k]=sv[k];}catch(e){}
let win=null,lastPhase='',wake=null,view='timer';
const save=()=>{try{localStorage.setItem('visainTimer',JSON.stringify(S))}catch(e){}};
const elapsed=()=>S.base+(S.running?Date.now()-S.startAt:0);
const pad=n=>String(n).padStart(2,'0');
const fmt=s=>{const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h>0?h+':'+pad(m)+':'+pad(x):pad(m)+':'+pad(x)};
function calc(){
  const e=elapsed();let text,phase='ok',pct=0,label;
  if(S.mode==='down'){
    const rem=S.total*1000-e;
    if(rem>0){const r=Math.ceil(rem/1000);text=fmt(r);label='Tiempo restante';
      if(r<=S.red*60)phase='red';else if(r<=S.warn*60)phase='warn';}
    else{text='+'+fmt(Math.floor(-rem/1000));phase='over';label='Tiempo cumplido';}
    pct=S.total?Math.min(1,e/(S.total*1000)):0;
  }else{
    text=fmt(Math.floor(e/1000));label='Tiempo transcurrido';
    if(S.total>0){const r=Math.ceil((S.total*1000-e)/1000);
      if(r<=0){phase='over';label='Límite superado';}else if(r<=S.red*60)phase='red';else if(r<=S.warn*60)phase='warn';
      pct=Math.min(1,e/(S.total*1000));}
  }
  return{text,phase,pct,label};
}
function render(){
  const c=calc();
  $('#time').textContent=c.text;$('#time').classList.toggle('long',c.text.length>5);
  $('#label').textContent=c.label;$('#bar').style.width=(c.pct*100)+'%';
  $('#name').textContent=S.name||'';$('#msg').textContent=S.msg||'';
  document.body.classList.remove('warn','red','over');if(c.phase!=='ok')document.body.classList.add(c.phase);
  setFx(c.phase);applyBgState();
  document.title=(S.running?c.text+' · ':'')+'Visain Timer';
  if(!isDisplay){
    $('#bStart').textContent=S.running?'⏸ Pausar':(elapsed()>0?'▶ Reanudar':'▶ Iniciar');
    $('#bStart').classList.toggle('run',S.running);
    $('#mDown').classList.toggle('on',S.mode==='down');$('#mUp').classList.toggle('on',S.mode==='up');
    $('#tinLbl').textContent=S.mode==='down'?'Tiempo':'Límite';
    if(document.activeElement!==$('#inMin')&&document.activeElement!==$('#inSec')){$('#inMin').value=Math.floor(S.total/60);$('#inSec').value=pad(S.total%60);}
    if(c.phase!==lastPhase&&S.running&&S.sound){ if(c.phase==='warn')beep([660],.25);else if(c.phase==='red')beep([660,660],.2);else if(c.phase==='over')beep([880,880,880],.45); }
    lastPhase=c.phase;
  }
}

/* ===== fondo personalizado (IndexedDB, mismo origen => el proyector lo lee solo) ===== */
function idb(){return new Promise((res,rej)=>{try{const r=indexedDB.open('visainBg',1);r.onupgradeneeded=()=>r.result.createObjectStore('f');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);}catch(e){rej(e)}});}
async function idbGet(){try{const d=await idb();return await new Promise(r=>{const q=d.transaction('f').objectStore('f').get('bg');q.onsuccess=()=>r(q.result||null);q.onerror=()=>r(null);});}catch(e){return null}}
async function idbSet(v){try{const d=await idb();return await new Promise(r=>{const t=d.transaction('f','readwrite');v?t.objectStore('f').put(v,'bg'):t.objectStore('f').delete('bg');t.oncomplete=()=>r(true);t.onerror=()=>r(false);});}catch(e){return false}}
let bgUrl=null,bgHas=false,bgKey='';
async function loadBg(){
  const key=S.bgSel+'|'+S.bgVer;bgKey=key;const box=$('#bgm');
  if(bgUrl){URL.revokeObjectURL(bgUrl);bgUrl=null;}
  let el=null;
  if(/^p\d+$/.test(S.bgSel||'')){const i=parseInt(S.bgSel.slice(1));if(PGF[i]){el=document.createElement('img');el.src=PGF[i];}}
  else if(S.bgSel==='u'){const rec=await idbGet();if(bgKey!==key)return;
    if(rec&&rec.blob){bgUrl=URL.createObjectURL(rec.blob);if((rec.type||'').startsWith('video')){el=document.createElement('video');el.src=bgUrl;el.autoplay=true;el.loop=true;el.muted=true;el.playsInline=true;el.play&&el.play().catch(()=>{});}else{el=document.createElement('img');el.src=bgUrl;}}}
  box.innerHTML='';bgHas=!!el;if(el)box.appendChild(el);applyBgState();
}
function applyBgState(){
  const on=bgHas&&S.bgOn!==false;document.body.classList.toggle('hasbg',on);
  $('#bgdim').style.opacity=(S.dim||0)/100;
  if(S.bgSel+'|'+S.bgVer!==bgKey)loadBg();
}

/* ===== sonidos ===== */
let ac=null;
function beep(freqs,dur){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();freqs.forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f;o.type='sine';o.connect(g);g.connect(ac.destination);const t=ac.currentTime+i*(dur+.12);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.35,t+.02);g.gain.linearRampToValueAtTime(0,t+dur);o.start(t);o.stop(t+dur+.05);});}catch(e){}}
function tone(f0,f1,st,dur,type,vol,o){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const t=ac.currentTime+st,os=ac.createOscillator(),g=ac.createGain();os.type=type;os.frequency.setValueAtTime(f0,t);if(f1)os.frequency.exponentialRampToValueAtTime(f1,t+dur);
  if(o&&o.lp){const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=o.lp;os.connect(f);f.connect(g);}else os.connect(g);g.connect(ac.destination);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.02);g.gain.setValueAtTime(vol,t+Math.max(.03,dur-.07));g.gain.linearRampToValueAtTime(0,t+dur);os.start(t);os.stop(t+dur+.03);
  if(o&&o.vib){const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=6;lg.gain.value=o.vib;l.connect(lg);lg.connect(os.frequency);l.start(t);l.stop(t+dur+.03);}}catch(e){}}
function sndWin(){[[523.25,0,.14],[659.25,.13,.14],[783.99,.26,.14],[1046.5,.39,.55]].forEach(([f,t,d])=>{tone(f,0,t,d,'triangle',.3);tone(f*2,0,t,d,'sine',.08);});
  [1046.5,1318.5,1568].forEach(f=>tone(f,0,.62,.95,'triangle',.18));[2093,2637,3136].forEach((f,i)=>tone(f,0,.95+i*.1,.25,'sine',.07));}
function sndFail(){tone(196,185,0,.42,'sawtooth',.22,{lp:900});tone(185,175,.46,.42,'sawtooth',.22,{lp:850});tone(175,165,.92,.42,'sawtooth',.22,{lp:800});tone(165,105,1.38,1.1,'sawtooth',.24,{lp:700,vib:5});}
function sndTick(){tone(1100,700,0,.035,'square',.05);}
function sndPick(){tone(660,0,0,.12,'triangle',.22);tone(990,0,.12,.25,'triangle',.22);}
function sndBeep5(){tone(880,0,0,.09,'square',.12);}
function sndBuzz(){tone(140,110,0,.7,'sawtooth',.25,{lp:700});}
