/* Controles, atajos, proyector y ajustes */
/* push al proyector */
function push(){if(win&&!win.closed)try{win.postMessage({visain:1,S:Object.assign({},S,{base:elapsed()})},'*')}catch(e){}}
function change(){save();render();push();}
function toggleFull(){try{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen()}catch(e){}}

if(isDisplay){
  window.addEventListener('message',e=>{if(e.data&&e.data.visain){S=e.data.S;S.startAt=Date.now();render();}});
  try{window.opener&&window.opener.postMessage({visainReady:1},'*')}catch(e){}
  document.addEventListener('click',()=>toggleFull());
  setInterval(render,100);
  render();
}else{
  window.addEventListener('message',e=>{if(e.data&&e.data.visainReady)push();});
  setInterval(render,100);setInterval(push,1000);
  const start=()=>{if(S.running)return;S.startAt=Date.now();S.running=true;lastPhase=calc().phase;wl(true);change();};
  const pause=()=>{if(!S.running)return;S.base=elapsed();S.running=false;wl(false);change();};
  const toggle=()=>S.running?pause():start();
  const reset=()=>{S.running=false;S.base=0;lastPhase='ok';wl(false);change();};
  const addMin=d=>{S.total=Math.max(0,S.total+d*60);change();};
  const setMode=m=>{S.mode=m;S.running=false;S.base=0;change();};
  async function wl(on){try{if(on&&navigator.wakeLock){wake=await navigator.wakeLock.request('screen')}else if(wake){wake.release();wake=null}}catch(e){}}
  $('#bStart').onclick=toggle;$('#bReset').onclick=reset;$('#bPlus').onclick=()=>addMin(1);$('#bMinus').onclick=()=>addMin(-1);
  $('#mDown').onclick=()=>setMode('down');$('#mUp').onclick=()=>setMode('up');
  $('#bFull').onclick=()=>toggleFull();
  $('#bSet').onclick=()=>$('#drawer').classList.toggle('open');
  $('#bProj').onclick=openProj;
  function openProj(){win=window.open(location.href.split('#')[0]+'#display','visainDisplay','width=1280,height=720');setTimeout(push,600);}
  const setTime=()=>{const m=Math.max(0,parseInt($('#inMin').value)||0),s=Math.min(59,Math.max(0,parseInt($('#inSec').value)||0));S.total=m*60+s;change();};
  $('#inMin').onchange=$('#inSec').onchange=setTime;
  $('#inMin').onkeydown=$('#inSec').onkeydown=e=>{if(e.key==='Enter'){setTime();e.target.blur()}};
  [1,3,5,10,15,20,30,45,60].forEach(m=>{const b=document.createElement('button');b.className='chip';b.textContent=m+' min';b.onclick=()=>{S.total=m*60;S.running=false;S.base=0;change();};$('#chips').appendChild(b);});
  const bind=(id,key,type)=>{const el=$(id);if(type==='chk')el.checked=!!S[key];else el.value=S[key];el.oninput=()=>{S[key]=type==='chk'?el.checked:type==='num'?Math.max(0,parseFloat(el.value)||0):el.value;change();};};
  bind('#inName','name');bind('#inMsg','msg');bind('#inWarn','warn','num');bind('#inRed','red','num');bind('#inSound','sound','chk');bind('#inFx','fx','chk');bind('#inAuto','auto','chk');
  /* fondo */
  $('#inDim').value=S.dim;$('#dimVal').textContent=S.dim;
  $('#inDim').oninput=()=>{S.dim=parseInt($('#inDim').value)||0;$('#dimVal').textContent=S.dim;change();};
  $('#bBg').onclick=()=>$('#fBg').click();
  $('#fBg').onchange=async()=>{const f=$('#fBg').files[0];if(!f)return;if(f.size>400*1024*1024){alert('El archivo es muy grande (máx. 400 MB).');return;}
    const ok=await idbSet({blob:f,type:f.type,name:f.name});if(!ok){alert('No se pudo guardar el fondo en este navegador.');return;}S.bgOn=true;S.bgSel='u';S.bgVer=Date.now();$('#fBg').value='';change();markBg();};
  $('#bBgOff').onclick=async()=>{await idbSet(null);S.bgSel='';S.bgVer=Date.now();change();markBg();};
  const grid=$('#bgGrid');grid.innerHTML=PGT.map((t,i)=>`<img data-s="p${i}" title="Lámina ${i+1}" src="${t}">`).join('');
  function markBg(){grid.querySelectorAll('img').forEach(im=>im.classList.toggle('on',im.dataset.s===S.bgSel));}
  grid.onclick=e=>{const im=e.target.closest('img');if(!im)return;S.bgOn=true;S.bgSel=im.dataset.s;S.bgVer=Date.now();if(S.dim<70){S.dim=70;$('#inDim').value=70;$('#dimVal').textContent=70;}change();markBg();};
  $('#inRot').value=String(S.bgRot||0);$('#inRot').onchange=()=>{S.bgRot=parseInt($('#inRot').value)||0;change();};
  setInterval(()=>{if(!S.bgRot||!/^p\d+$/.test(S.bgSel||''))return;if(Date.now()-(window.__lastRot||0)<S.bgRot*1000)return;window.__lastRot=Date.now();S.bgSel='p'+((parseInt(S.bgSel.slice(1))+1)%PGF.length);S.bgVer=Date.now();change();markBg();},1000);
  markBg();
  /* idle */
  let idle;const wake2=()=>{document.body.classList.remove('idle');clearTimeout(idle);idle=setTimeout(()=>{if(S.running&&S.auto&&document.fullscreenElement&&!$('#drawer').classList.contains('open'))document.body.classList.add('idle')},3000)};
  ['mousemove','mousedown','keydown'].forEach(ev=>document.addEventListener(ev,wake2));wake2();
  document.addEventListener('keydown',e=>{
    if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&e.key!=='Escape')return;
    if(window.__wheelKey&&window.__wheelKey(e))return;
    if(view==='wheel')return;
    if(e.code==='Space'){e.preventDefault();toggle();}
    else if(e.key==='r'||e.key==='R')reset();
    else if(e.key==='f'||e.key==='F')toggleFull();
    else if(e.key==='p'||e.key==='P')openProj();
    else if(e.key==='ArrowUp'){e.preventDefault();addMin(1);}
    else if(e.key==='ArrowDown'){e.preventDefault();addMin(-1);}
    else if(e.key==='m'||e.key==='M')setMode(S.mode==='down'?'up':'down');
  });
  render();
}
