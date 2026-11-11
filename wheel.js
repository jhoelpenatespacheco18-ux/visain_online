/* Ruleta y modos de juego */
/* ===== RULETA / JUEGO ===== */
function setView(v){view=v;document.body.classList.toggle('view-wheel',v==='wheel');$('#tTimer').classList.toggle('on',v==='timer');$('#tWheel').classList.toggle('on',v==='wheel');if(v==='wheel'&&window.__sizeW)setTimeout(window.__sizeW,30);}
if(!isDisplay){
const wc=$('#wheel'),wx=wc.getContext('2d'),D=Math.PI/180;
$('#wLogo').src=$('#logoImg').src;
const imgRing=new Image(),imgCen=new Image();imgRing.src='../../assets/img/seal-ring.png';imgCen.src='../../assets/img/seal-center.png';
const PAL=['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e91e63','#ff7043','#8bc34a','#00acc1','#d4a017','#7e57c2'];
const SP=[['#5b2bb0','#fff'],['#f0b429','#2a1650'],['#7a3cd0','#fff'],['#d9901a','#2a1650'],['#4a2080','#fff'],['#ffd76a','#2a1650']];
const DN=['','Fácil','Medio','Difícil'];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let W2={mode:'q',used:{},ok:0,bad:0,teams:[],turn:0,p:[1,2,3],time:30,reb:false,cats:[0,1,2,3,4,5],people:[],peopleRm:false,prizes:[],prizesRm:false,usedP:[],usedG:[],fd:0,ft:'all'};
let MINE=[];
try{Object.assign(W2,JSON.parse(localStorage.getItem('visainWheel2')||'{}'));}catch(e){}
try{MINE=JSON.parse(localStorage.getItem('visainMine')||'[]');}catch(e){}
const saveW=()=>{try{localStorage.setItem('visainWheel2',JSON.stringify(W2))}catch(e){}};
const saveM=()=>{try{localStorage.setItem('visainMine',JSON.stringify(MINE))}catch(e){}};
const ALL=()=>Q.map((x,i)=>({id:'b'+i,cat:x[0],type:x[1],diff:x[2],q:x[3],a:x[4],note:x[5]||''})).concat(MINE.map((x,i)=>({id:'m'+i,cat:x.cat,type:x.type,diff:x.diff,q:x.q,a:x.a,note:x.note||''})));
const pool=()=>ALL().filter(x=>W2.cats.includes(x.cat)&&!W2.used[x.id]&&(!W2.fd||x.diff===W2.fd)&&(W2.ft==='all'||x.type===W2.ft));
let SG=[],NS=1,SEG=360,rot=Math.random()*360,spinning=false,sp0=0,spT0=0,spEnd=0,spDur=5400,winIdx=-1,lastSeg=-1,ptK=0;
let cur=null,cs=null,qEnd=0,qTot=0,qInt=null,lastBeep=-1;

function segs(){
  const m=W2.mode;
  if(m==='q'){const pl=pool(),c1=W2.cats.filter(c=>pl.some(x=>x.cat===c)),L=c1.length?c1:(W2.cats.length?W2.cats.slice():[0,1,2,3,4,5]);
    return L.map(c=>({l:CATS[c].n,e:CATS[c].e,c:CATS[c].c,t:CATS[c].t,d:c}));}
  if(m==='t'){return W2.teams.length?W2.teams.map((t,i)=>({l:t.n,e:'',c:t.c,t:'#fff',d:i})):[{l:'Crea equipos',e:'👥',c:'#5b2bb0',t:'#fff',d:-1},{l:'en ⚙ Configurar',e:'⚙',c:'#f0b429',t:'#2a1650',d:-1}];}
  const src=m==='p'?W2.people.filter(n=>!(W2.peopleRm&&W2.usedP.includes(n))):W2.prizes.filter(n=>!(W2.prizesRm&&W2.usedG.includes(n)));
  if(!src.length)return [{l:m==='p'?'Agrega personas':'Agrega premios',e:m==='p'?'🧑':'🎁',c:'#5b2bb0',t:'#fff',d:-1},{l:'en ⚙ Configurar',e:'⚙',c:'#f0b429',t:'#2a1650',d:-1}];
  return src.map((n,i)=>{const ci=(i===src.length-1&&src.length>1&&(src.length-1)%6===0)?3:i%6;return{l:n,e:'',c:SP[ci][0],t:SP[ci][1],d:n};});
}
function refreshSegs(){SG=segs();NS=SG.length;SEG=360/NS;}
const segAt=r=>Math.min(NS-1,Math.floor((((270-r)%360)+360)%360/SEG));

/* ----- dibujo ----- */
function sizeW(){const s=wc.clientWidth;if(!s)return;wc.width=wc.height=Math.round(s*DPR);}
window.__sizeW=sizeW;
function drawW(t){
  const s=wc.clientWidth;if(!s)return;if(wc.width!==Math.round(s*DPR))sizeW();
  const x=wx;x.setTransform(DPR,0,0,DPR,0,0);x.clearRect(0,0,s,s);
  const cx0=s/2,cy0=s/2+s*.018,OR=s/2-s*.045,R=OR-s*.05,hub=R*.33;
  let g=x.createLinearGradient(0,cy0-OR,0,cy0+OR);g.addColorStop(0,'#fff1b8');g.addColorStop(.35,'#e0a826');g.addColorStop(.65,'#a97409');g.addColorStop(1,'#ffe38a');
  x.beginPath();x.arc(cx0,cy0,OR,0,6.283);x.fillStyle=g;x.fill();
  x.beginPath();x.arc(cx0,cy0,R+s*.012,0,6.283);x.fillStyle='#24104a';x.fill();
  // focos
  const nb=28,br=(OR+R+s*.012)/2,ph=Math.floor(t/140);
  for(let i=0;i<nb;i++){const a=i/nb*6.283,bx=cx0+Math.cos(a)*br,by=cy0+Math.sin(a)*br,lit=((i+ph)%3===0);
    x.save();if(lit){x.shadowColor='#fff3b0';x.shadowBlur=s*.02;}x.beginPath();x.arc(bx,by,s*.0098,0,6.283);x.fillStyle=lit?'#fffbe0':'#9a6a10';x.fill();x.restore();}
  // sectores
  for(let i=0;i<NS;i++){const a0=(rot+i*SEG)*D,a1=(rot+(i+1)*SEG)*D;x.beginPath();x.moveTo(cx0,cy0);x.arc(cx0,cy0,R,a0,a1);x.closePath();x.fillStyle=SG[i].c;x.fill();}
  g=x.createRadialGradient(cx0,cy0,hub,cx0,cy0,R);g.addColorStop(0,'rgba(255,255,255,.24)');g.addColorStop(.55,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(0,0,0,.34)');
  x.beginPath();x.arc(cx0,cy0,R,0,6.283);x.fillStyle=g;x.fill();
  x.strokeStyle='rgba(255,226,140,.75)';x.lineWidth=Math.max(1,s*.004);
  if(NS>1)for(let i=0;i<NS;i++){const a=(rot+i*SEG)*D;x.beginPath();x.moveTo(cx0+Math.cos(a)*hub,cy0+Math.sin(a)*hub);x.lineTo(cx0+Math.cos(a)*R,cy0+Math.sin(a)*R);x.stroke();}
  // ganador
  if(winIdx>=0&&!spinning&&winIdx<NS){const a0=(rot+winIdx*SEG)*D,a1=(rot+(winIdx+1)*SEG)*D;x.beginPath();x.moveTo(cx0,cy0);x.arc(cx0,cy0,R,a0,a1);x.closePath();
    x.fillStyle=`rgba(255,255,255,${.16+.16*Math.sin(t/160)})`;x.fill();x.strokeStyle='#fff7c2';x.lineWidth=s*.008;x.stroke();}
  // textos
  const hasE=NS<=14;
  for(let i=0;i<NS;i++){const sgm=SG[i],ang=(rot+(i+.5)*SEG)*D;x.save();x.translate(cx0,cy0);x.rotate(ang);
    let fs=Math.max(9,Math.min(R*.1,2*Math.PI*R*.7/NS*.5));const maxW=R*(sgm.e&&hasE?.45:.52);
    x.font=`800 ${fs}px "Segoe UI",system-ui,sans-serif`;let txt=sgm.l;
    while(x.measureText(txt).width>maxW&&fs>9){fs-=1;x.font=`800 ${fs}px "Segoe UI",system-ui,sans-serif`;}
    if(x.measureText(txt).width>maxW){while(txt.length>2&&x.measureText(txt+'…').width>maxW)txt=txt.slice(0,-1);txt+='…';}
    x.textBaseline='middle';x.textAlign='right';x.fillStyle=sgm.t;x.shadowColor=sgm.t==='#fff'?'rgba(0,0,0,.45)':'rgba(255,255,255,.35)';x.shadowBlur=3;x.fillText(txt,R*.92,0);
    if(sgm.e&&hasE){x.shadowBlur=0;x.textAlign='center';x.font=`${Math.min(R*.1,2*Math.PI*R*.4/NS)}px "Segoe UI Emoji","Apple Color Emoji",sans-serif`;x.fillText(sgm.e,R*.415,0);}
    x.restore();}
  // centro (sello de marca)
  x.save();x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=s*.02;x.beginPath();x.arc(cx0,cy0,hub+s*.012,0,6.283);
  g=x.createLinearGradient(cx0,cy0-hub,cx0,cy0+hub);g.addColorStop(0,'#fff1b8');g.addColorStop(.5,'#d9901a');g.addColorStop(1,'#ffe38a');x.fillStyle=g;x.fill();x.restore();
  x.beginPath();x.arc(cx0,cy0,hub,0,6.283);x.fillStyle='#fff';x.fill();
  const hs=hub*1.96;
  if(imgRing.complete&&imgRing.naturalWidth){x.save();x.translate(cx0,cy0);x.rotate(t*.00022);x.drawImage(imgRing,-hs/2,-hs/2,hs,hs);x.restore();}
  if(imgCen.complete&&imgCen.naturalWidth)x.drawImage(imgCen,cx0-hs/2,cy0-hs/2,hs,hs);
  // puntero hoja
  x.save();x.translate(cx0,cy0-OR+s*.02);x.rotate(-ptK*.5);
  x.shadowColor='rgba(0,0,0,.55)';x.shadowBlur=s*.014;x.shadowOffsetY=s*.006;
  x.beginPath();x.moveTo(0,s*.06);x.bezierCurveTo(s*.05,s*.015,s*.04,-s*.045,0,-s*.045);x.bezierCurveTo(-s*.04,-s*.045,-s*.05,s*.015,0,s*.06);
  g=x.createLinearGradient(-s*.04,0,s*.04,0);g.addColorStop(0,'#c9740c');g.addColorStop(.5,'#ffb83a');g.addColorStop(1,'#c9740c');x.fillStyle=g;x.fill();
  x.shadowColor='transparent';x.lineWidth=s*.006;x.strokeStyle='#fff';x.stroke();
  x.beginPath();x.arc(0,-s*.012,s*.011,0,6.283);x.fillStyle='#fff';x.fill();x.restore();
}
function loop(t){
  if(view==='wheel'){
    if(spinning){const u=Math.min(1,(t-spT0)/spDur),e=1-Math.pow(1-u,4);rot=sp0+(spEnd-sp0)*e;const sg=segAt(rot);if(sg!==lastSeg){lastSeg=sg;ptK=1;sndTick();}if(u>=1){spinning=false;finish(segAt(rot));}}
    ptK*=.88;drawW(t);}
  requestAnimationFrame(loop);}

/* ----- giro ----- */
function spin(){
  if(spinning)return;if(!SG.length)return;
  if(SG[0].d===-1&&W2.mode!=='q'){openModal(W2.mode==='t'?'equipos':'listas');return;}
  stopQT();cur=null;cs=null;winIdx=-1;refreshSegs();card();
  if(SG[0].d===-1&&W2.mode!=='q'){openModal(W2.mode==='t'?'equipos':'listas');return;}
  const i=Math.floor(Math.random()*NS),jit=.14+Math.random()*.72,base=270-(i+jit)*SEG;
  sp0=rot;spEnd=rot+(5+Math.floor(Math.random()*3))*360+((((base-rot)%360)+360)%360);spT0=performance.now();spinning=true;lastSeg=segAt(rot);
}
function wheelBurst(n){burst(n,'ok',wc.getBoundingClientRect());}
function finish(i){
  winIdx=i;const sg=SG[i],m=W2.mode;sndPick();wheelBurst(60);
  if(m==='q'){const pl=pool().filter(x=>x.cat===sg.d);if(!pl.length){cs={kind:'none',cat:sg.d};card();return;}startQ(pl[Math.floor(Math.random()*pl.length)]);return;}
  if(m==='t'){if(sg.d>=0){W2.turn=sg.d;saveW();updTeams();cs={kind:'who',emoji:'👥',kick:'Turno de',name:sg.l,color:W2.teams[sg.d].c,sub:'Ahora gira 🎯 Preguntas para que responda esta mesa.'};}card();return;}
  if(m==='p'||m==='g'){if(sg.d===-1){card();return;}
    if(m==='p'&&W2.peopleRm&&!W2.usedP.includes(sg.d))W2.usedP.push(sg.d);
    if(m==='g'&&W2.prizesRm&&!W2.usedG.includes(sg.d))W2.usedG.push(sg.d);
    saveW();cs={kind:'who',emoji:m==='p'?'🧑':'🎁',kick:m==='p'?'Le toca a':'Premio / reto',name:sg.l,color:'#ffd76a',sub:'',rm:(m==='p'?!W2.peopleRm:!W2.prizesRm)};
    wheelBurst(100);sndWin();card();updScore();}
}

/* ----- preguntas ----- */
function startQ(x){
  const tm=W2.teams.length?Math.min(W2.turn,W2.teams.length-1):-1;
  cur=Object.assign({},x,{team:tm,orig:tm,rebote:false,phase:'ask',shown:false,picked:null});cs={kind:'q'};card();qtStart();
}
function qtStart(){stopQT();if(!(W2.time>0)||!cur||cur.phase!=='ask')return;qTot=W2.time*1000;qEnd=Date.now()+qTot;lastBeep=-1;
  qInt=setInterval(()=>{if(!cur||cur.phase!=='ask'){stopQT();return;}const rem=qEnd-Date.now(),b=$('#qtBar');
    if(b){b.style.width=Math.max(0,rem/qTot*100)+'%';b.parentNode.classList.toggle('low',rem<=5000);}
    const sec=Math.ceil(rem/1000);if(rem>0&&sec<=5&&sec!==lastBeep){lastBeep=sec;sndBeep5();}
    if(rem<=0){stopQT();sndBuzz();if(cur.type==='v'){cur.picked=null;resolve(false);}else{cur.shown=true;card();}}},200);}
function stopQT(){if(qInt){clearInterval(qInt);qInt=null;}}
function advance(){if(W2.teams.length&&cur&&cur.orig>=0)W2.turn=(cur.orig+1)%W2.teams.length;}
function resolve(ok){
  if(!cur||cur.phase!=='ask')return;stopQT();const pts=W2.p[cur.diff-1]||0;
  if(ok){W2.ok++;cur.phase='done';cur.ok=true;cur.gain=pts;if(cur.team>=0&&W2.teams[cur.team])W2.teams[cur.team].s+=pts;W2.used[cur.id]=1;advance();sndWin();wheelBurst(160);}
  else{W2.bad++;cur.ok=false;sndFail();$('#qcard').classList.remove('shake');void $('#qcard').offsetWidth;$('#qcard').classList.add('shake');
    document.body.classList.add('failflash');setTimeout(()=>document.body.classList.remove('failflash'),950);
    if(W2.reb&&W2.teams.length>1&&!cur.rebote)cur.phase='reb';else{cur.phase='done';W2.used[cur.id]=1;advance();}}
  saveW();card();updTeams();updScore();refreshSegs();}
function doReb(i){if(!cur||cur.phase!=='reb')return;if(i<0){cur.phase='done';W2.used[cur.id]=1;advance();saveW();card();updTeams();updScore();refreshSegs();return;}
  cur.team=i;cur.rebote=true;cur.phase='ask';cur.picked=null;cur.shown=false;card();qtStart();}
function vf(v){if(!cur||cur.type!=='v'||cur.phase!=='ask')return;cur.picked=v;resolve(v===cur.a);}

/* ----- tarjeta ----- */
function card(){
  const el=$('#qcard');
  if(!cs){const t={q:['🎡 Gira la ruleta','Cae una categoría y sale una pregunta. Filtra por dificultad y tipo arriba.'],t:['👥 Sorteo de equipos','Gira para saber qué mesa responde.'],p:['🧑 Sorteo de personas','Gira para elegir a quién le toca.'],g:['🎁 Premios y retos','Gira para descubrir qué sale.']}[W2.mode];
    el.innerHTML=`<div class="qtext" style="margin:auto;text-align:center">${t[0]}<div style="font-size:.5em;font-weight:500;color:#d9c9ff;margin-top:8px">${t[1]}</div></div>`;return;}
  if(cs.kind==='none'){el.innerHTML=`<div class="qtext" style="margin:auto;text-align:center">Sin preguntas disponibles en <span style="color:var(--gold2)">${esc(CATS[cs.cat].n)}</span><div style="font-size:.5em;font-weight:500;color:#d9c9ff;margin-top:8px">Cambia los filtros o reinicia las preguntas en ⚙ Configurar → Reglas.</div></div>`;return;}
  if(cs.kind==='who'){el.innerHTML=`<div style="margin:auto;text-align:center"><div style="letter-spacing:.2em;text-transform:uppercase;color:#d9c9ff;font-weight:700">${cs.emoji} ${esc(cs.kick)}</div><div class="qtext" style="font-size:clamp(28px,6vh,64px);color:${cs.color};margin:10px 0;text-shadow:0 0 24px rgba(255,215,106,.4)">${esc(cs.name)}</div><div style="color:#d9c9ff">${esc(cs.sub||'')}</div>${cs.rm?'<div class="qbtns" style="justify-content:center;margin-top:14px"><button class="btn" data-act="rmw">✕ Retirar de la ruleta</button></div>':''}</div>`;return;}
  const c=cur,cat=CATS[c.cat],tm=c.team>=0?W2.teams[c.team]:null,pts=W2.p[c.diff-1]||0;
  let h=`<div class="qtop"><span class="qcat" style="background:${cat.c};color:${cat.t}">${cat.e} ${esc(cat.n)}</span><span class="qbadge d${c.diff}">${DN[c.diff]} · ${pts} pt${pts===1?'':'s'}</span>${c.type==='v'?'<span class="qbadge vf">Verdadero / Falso</span>':''}${tm?`<span class="qturn">· Turno: <span style="color:${tm.c}">● </span>${esc(tm.n)}${c.rebote?' (rebote)':''}</span>`:''}</div>`;
  if(W2.time>0&&c.phase==='ask')h+=`<div class="qtime"><i id="qtBar"></i></div>`;
  h+=`<div class="qtext">${esc(c.q)}</div>`;
  const showAns=c.phase==='done'||(c.type==='a'&&c.shown&&c.phase!=='reb')||(c.type==='a'&&c.phase==='reb');
  if(showAns){const at=c.type==='v'?(c.a?'VERDADERO':'FALSO'):c.a;h+=`<div class="qans" style="display:block"><small>Respuesta correcta</small>${esc(at)}${c.note?`<em>${esc(c.note)}</em>`:''}</div>`;}
  if(c.phase==='done'){h+=c.ok?`<div class="qres" style="display:block;color:var(--ok)">✔ ¡Correcto!${c.gain&&tm?` +${c.gain} para ${esc(tm.n)}`:''}</div>`:`<div class="qres" style="display:block;color:#ff8a8c">✘ Incorrecto${c.picked===null&&c.type==='v'?' (tiempo agotado)':''}</div>`;
    h+=`<div class="qbtns"><button class="btn main" data-act="spin">🎡 Girar de nuevo</button></div>`;}
  else if(c.phase==='reb'){h+=`<div class="qres" style="display:block;color:#ff8a8c">✘ Incorrecto${c.picked===null&&c.type==='v'?' (tiempo agotado)':''} · ¡Rebote!</div><div class="reb" style="display:flex">¿Qué mesa responde?`+W2.teams.map((t,i)=>i===c.orig?'':`<button class="btn" data-act="reb" data-i="${i}" style="padding:6px 12px"><span style="color:${t.c}">●</span> ${esc(t.n)}</button>`).join('')+`<button class="btn" data-act="reb" data-i="-1" style="padding:6px 12px">Nadie</button></div>`;}
  else{
    if(c.type==='v')h+=`<div class="qbtns"><button class="btn vv" data-act="vt">✔ VERDADERO</button><button class="btn ff" data-act="vf">✘ FALSO</button></div>`;
    else h+=`<div class="qbtns"><button class="btn" data-act="reveal">👁 Ver respuesta</button><button class="btn ok" data-act="ok">✔ Correcta</button><button class="btn bad" data-act="bad">✘ Incorrecta</button></div>`;}
  el.innerHTML=h;
}
$('#qcard').addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if(a==='reveal'){if(cur){cur.shown=true;card();}}else if(a==='ok')resolve(true);else if(a==='bad')resolve(false);else if(a==='vt')vf(true);else if(a==='vf')vf(false);
  else if(a==='reb')doReb(parseInt(b.dataset.i));else if(a==='spin')spin();
  else if(a==='rmw'&&cs&&cs.kind==='who'){const m=W2.mode,n=cs.name;if(m==='p'&&!W2.usedP.includes(n))W2.usedP.push(n);if(m==='g'&&!W2.usedG.includes(n))W2.usedG.push(n);saveW();cs.rm=false;refreshSegs();winIdx=-1;card();updScore();}});

/* ----- equipos, marcador, filtros, modos ----- */
function updTeams(){const el=$('#teams');if(!W2.teams.length){el.style.display='none';return;}el.style.display='grid';
  el.innerHTML=W2.teams.map((t,i)=>`<div class="team${i===W2.turn?' turn':''}" data-i="${i}" style="border-color:${i===W2.turn?'':t.c+'88'}">${i===W2.turn?'<span class="tag">TURNO</span>':''}<div class="tn"><i style="background:${t.c}"></i>${esc(t.n)}</div><div class="ts">${t.s}</div><div class="tb"><button data-a="m" data-i="${i}">−</button><button data-a="p" data-i="${i}">+</button></div></div>`).join('');}
$('#teams').addEventListener('click',e=>{const b=e.target.closest('button[data-a]');const tm=e.target.closest('.team');if(!tm)return;const i=parseInt(tm.dataset.i);
  if(b){const d=b.dataset.a==='p'?1:-1;W2.teams[i].s=Math.max(0,W2.teams[i].s+d);}else W2.turn=i;saveW();updTeams();});
function updScore(){const pl=pool().length,m=W2.mode;let extra='';
  if(m==='q')extra=`<span class="pill">Preguntas disponibles: ${pl}</span>`;else if(m==='p')extra=`<span class="pill">En la ruleta: ${SG[0]&&SG[0].d===-1?0:SG.length}</span>`;else if(m==='g')extra=`<span class="pill">En la ruleta: ${SG[0]&&SG[0].d===-1?0:SG.length}</span>`;
  $('#score').innerHTML=`<span class="pill g">✔ ${W2.ok}</span><span class="pill r">✘ ${W2.bad}</span>${extra}`;}
function updFilters(){const el=$('#filters');if(W2.mode!=='q'){el.style.display='none';return;}el.style.display='flex';
  const ch=(k,v,l,on)=>`<button class="chip${on?' on':''}" data-k="${k}" data-v="${v}">${l}</button>`;
  el.innerHTML=ch('d',0,'Todas',!W2.fd)+ch('d',1,'Fácil',W2.fd===1)+ch('d',2,'Medio',W2.fd===2)+ch('d',3,'Difícil',W2.fd===3)+'<span class="sep"></span>'+ch('t','all','Todo tipo',W2.ft==='all')+ch('t','a','Abiertas',W2.ft==='a')+ch('t','v','V / F',W2.ft==='v');}
$('#filters').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(!b)return;if(b.dataset.k==='d')W2.fd=parseInt(b.dataset.v);else W2.ft=b.dataset.v;saveW();winIdx=-1;refreshSegs();updFilters();updScore();});
const MODES=[['q','🎯 Preguntas','Ruleta de preguntas'],['t','👥 Equipos','Ruleta de equipos'],['p','🧑 Personas','Ruleta de personas'],['g','🎁 Premios','Premios y retos']];
function updModes(){$('#modes').innerHTML=MODES.map(m=>`<button class="chip${W2.mode===m[0]?' on':''}" data-m="${m[0]}">${m[1]}</button>`).join('');$('#wTitle').textContent=MODES.find(m=>m[0]===W2.mode)[2];}
$('#modes').addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b||spinning)return;setMode(b.dataset.m);});
function setMode(m){W2.mode=m;saveW();stopQT();cur=null;cs=null;winIdx=-1;refreshSegs();updModes();updFilters();updScore();updTeams();card();}
function resetAll(){W2.used={};W2.ok=0;W2.bad=0;W2.turn=0;W2.teams.forEach(t=>t.s=0);W2.usedP=[];W2.usedG=[];saveW();stopQT();cur=null;cs=null;winIdx=-1;refreshSegs();updScore();updTeams();card();}

/* ----- configuración (modal) ----- */
const TABS=[['equipos','👥 Equipos'],['listas','🧑 Listas'],['reglas','🎯 Reglas'],['mias','✍ Mis preguntas']];
let mtab='equipos';
function showTab(t){mtab=t;$('#mtabs').innerHTML=TABS.map(x=>`<button class="chip${x[0]===t?' on':''}" data-t="${x[0]}">${x[1]}</button>`).join('');document.querySelectorAll('.msec').forEach(s=>s.classList.toggle('on',s.dataset.sec===t));}
$('#mtabs').addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(b)showTab(b.dataset.t);});
function fillModal(){
  $('#tCount').value=W2.teams.length||6;$('#tNames').value=W2.teams.map(t=>t.n).join('\n');
  $('#lPeople').value=W2.people.join('\n');$('#lPeopleRm').checked=!!W2.peopleRm;$('#lPrizes').value=W2.prizes.join('\n');$('#lPrizesRm').checked=!!W2.prizesRm;
  $('#rP1').value=W2.p[0];$('#rP2').value=W2.p[1];$('#rP3').value=W2.p[2];$('#rTime').value=W2.time;$('#rReb').checked=!!W2.reb;
  $('#rCats').innerHTML=CATS.map((c,i)=>`<label class="chk" style="margin:2px 0"><input type="checkbox" data-c="${i}" ${W2.cats.includes(i)?'checked':''}> ${c.e} ${esc(c.full)}</label>`).join('');
  $('#qCat').innerHTML=CATS.map((c,i)=>`<option value="${i}">${esc(c.n)}</option>`).join('');
  $('#qCount').textContent=`Tienes ${MINE.length} pregunta(s) propia(s). Banco oficial: ${Q.length} preguntas.`;
}
function openModal(t){fillModal();showTab(t||mtab);$('#modal').classList.add('open');}
function closeModal(){$('#modal').classList.remove('open');refreshSegs();updModes();updFilters();updScore();updTeams();card();}
$('#bWSet').onclick=()=>openModal();$('#mClose').onclick=closeModal;$('#modal').addEventListener('mousedown',e=>{if(e.target.id==='modal')closeModal();});
const lines=v=>v.split(/\n/).map(s=>s.trim()).filter(Boolean);
$('#tMake').onclick=()=>{const n=Math.max(1,Math.min(24,parseInt($('#tCount').value)||1)),p=($('#tPrefix').value||'Mesa').trim();W2.teams=Array.from({length:n},(_,i)=>({n:`${p} ${i+1}`,c:PAL[i%PAL.length],s:0}));W2.turn=0;saveW();$('#tNames').value=W2.teams.map(t=>t.n).join('\n');};
$('#tApply').onclick=()=>{const L=lines($('#tNames').value).slice(0,24);W2.teams=L.map((n,i)=>({n,c:PAL[i%PAL.length],s:(W2.teams[i]&&W2.teams[i].s)||0}));W2.turn=0;saveW();};
$('#tZero').onclick=()=>{W2.teams.forEach(t=>t.s=0);saveW();};
$('#tClear').onclick=()=>{W2.teams=[];W2.turn=0;saveW();$('#tNames').value='';};
$('#lApply').onclick=()=>{W2.people=lines($('#lPeople').value);W2.prizes=lines($('#lPrizes').value);W2.peopleRm=$('#lPeopleRm').checked;W2.prizesRm=$('#lPrizesRm').checked;saveW();refreshSegs();};
$('#lPeopleRm').onchange=$('#lPrizesRm').onchange=()=>{W2.peopleRm=$('#lPeopleRm').checked;W2.prizesRm=$('#lPrizesRm').checked;saveW();};
$('#lBack').onclick=()=>{W2.usedP=[];W2.usedG=[];saveW();refreshSegs();};
['rP1','rP2','rP3'].forEach((id,i)=>$('#'+id).oninput=()=>{W2.p[i]=Math.max(0,parseInt($('#'+id).value)||0);saveW();});
$('#rTime').oninput=()=>{W2.time=Math.max(0,parseInt($('#rTime').value)||0);saveW();};
$('#rReb').onchange=()=>{W2.reb=$('#rReb').checked;saveW();};
$('#rCats').addEventListener('change',e=>{const c=parseInt(e.target.dataset.c);if(isNaN(c))return;W2.cats=W2.cats.filter(x=>x!==c);if(e.target.checked)W2.cats.push(c);W2.cats.sort();saveW();});
$('#rReset').onclick=()=>{resetAll();};
$('#qType').onchange=()=>{const v=$('#qType').value==='v';$('#qVfWrap').style.display=v?'block':'none';$('#qAnsLbl').textContent=v?'Explicación (opcional)':'Respuesta correcta';};
$('#qAdd').onclick=()=>{const q=$('#qText').value.trim(),ty=$('#qType').value,an=$('#qAns').value.trim();if(!q||(ty==='a'&&!an))return;
  MINE.push({cat:parseInt($('#qCat').value),type:ty,diff:parseInt($('#qDiff').value),q,a:ty==='v'?$('#qVf').value==='1':an,note:ty==='v'?an:''});saveM();$('#qText').value='';$('#qAns').value='';
  $('#qCount').textContent=`✔ Pregunta agregada. Tienes ${MINE.length} propia(s).`;};
$('#qDel').onclick=()=>{if(!MINE.length)return;MINE.forEach((_,i)=>delete W2.used['m'+i]);MINE=[];saveM();saveW();$('#qCount').textContent='Se borraron tus preguntas propias.';};

$('#bSpin').onclick=spin;$('#bWFull').onclick=()=>toggleFull();
$('#tTimer').onclick=()=>setView('timer');$('#tWheel').onclick=()=>setView('wheel');
addEventListener('resize',()=>{if(view==='wheel')sizeW();});
window.__wheelKey=e=>{if(view!=='wheel')return false;
  if(e.key==='Escape'&&$('#modal').classList.contains('open')){closeModal();return true;}
  if($('#modal').classList.contains('open'))return false;
  if(e.code==='Space'){e.preventDefault();spin();return true;}
  if(e.key==='Enter'){if(cur&&cur.type==='a'){cur.shown=true;card();}return true;}
  if(e.key==='c'||e.key==='C'){resolve(true);return true;}
  if(e.key==='x'||e.key==='X'){resolve(false);return true;}
  if(e.key==='v'||e.key==='V'){vf(true);return true;}
  if(e.key==='f'||e.key==='F'){vf(false);return true;}
  return false;};
refreshSegs();updModes();updFilters();updScore();updTeams();card();requestAnimationFrame(loop);
window.__game={setView,spin,startQ,W2:()=>W2};
}
