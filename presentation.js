/* Presentación con avatares: configuración, pasos por bono, avatares SVG, efectos y teclado */
(function(){
const $=s=>document.querySelector(s);
const fmt=n=>Math.round(n).toLocaleString('es-CO');
const money=n=>'$'+fmt(n);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* ===== datos oficiales ===== */
const MEM=[{n:'Semilla',e:'🌱',inv:350000,pts:190,pct:20},{n:'Emprendedor',e:'📈',inv:980000,pts:500,pct:25},{n:'Impacto',e:'⭐',inv:1980000,pts:1300,pct:30},{n:'Infinity',e:'♾️',inv:5000000,pts:3000,pct:40},{n:'Fundador Oro',e:'👑',inv:10000000,pts:6500,pct:50}];
const PRD={maxi:['Maxi 3',250000],mak:['Mak-Vid',120000],slym:['Slym-Vid',140000],ether:['Ether-Ju',170000]};
const IMP=[35,6,3,1,1,1,3],RES=[30,6,3,1,1,1,8],AYU=[35,10,2,2,2,2,7],ALI=[10,5,5,5,5,5,5];
const RANKS=[{n:'Aire',e:'🌬️',th:3125000,b:0},{n:'Tierra',e:'🌍',th:6250000,b:300000},{n:'Fuego',e:'🔥',th:12500000,b:0},{n:'Agua',e:'💧',th:25000000,b:0},{n:'Diamante',e:'💎',th:50000000,b:5000000}];
const COL={vd:'#ffd76a',imp:'#e08a1a',res:'#a66cff',camp:'#ff6fb5',ayu:'#3ddc97',ali:'#ff8a5c',rng:'#f4f0ff',igu:'#5ec8ff',gold:'#ffd76a'};
const FEM=['Ana','María','Laura','Sofía','Camila','Valentina','Daniela','Luisa','Paula','Carolina','Andrea','Juliana','Natalia','Mariana','Isabela','Lucía','Karen','Diana','Sara','Gabriela','Alejandra','Verónica','Tatiana','Marcela'];
const MAS=['Luis','Juan','Andrés','Felipe','Santiago','Diego','Mateo','Sebastián','Daniel','Camilo','David','Jorge','Pedro','Miguel','Nicolás','Esteban','Julián','Ricardo','Héctor','Óscar','Fabián','Iván','Alberto','Samuel'];

/* ===== avatares ===== */
const SKINS=['#f6d3b3','#e8b98a','#c98f5f','#a8693f','#7a4a2b','#f1c9a5'],HAIRS=['#2b1a12','#4a2c17','#8a5a2b','#c9a24a','#1a1a1a','#6b3a1f','#b5532a'],SHIRTS=['#5b2bb0','#e08a1a','#7a3cd0','#2f9e8f','#4a2080','#c2415c','#3b82c4','#d9901a'];
const shade=(h,a=.82)=>'#'+[1,3,5].map(i=>Math.round(parseInt(h.substr(i,2),16)*a).toString(16).padStart(2,'0')).join('');
function avatar(g,seed,me){
  const sk=SKINS[seed%6],hr=HAIRS[(seed*3+1)%7],sh=me?'#5b2bb0':SHIRTS[(seed*5+2)%8];
  let s='<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">';
  if(g==='f')s+=`<path d="M17 42Q14 11 40 10Q66 11 63 42L68 82Q54 78 52 60L28 60Q26 78 12 82Z" fill="${hr}"/>`;
  s+=`<path d="M5 100Q5 68 40 64Q75 68 75 100Z" fill="${sh}"/><path d="M31 66L40 80L49 66Z" fill="#fff" opacity=".92"/>`;
  if(me)s+=`<path d="M40 70l5 7-5 6-5-6z" fill="#ffb83a"/>`;
  s+=`<path d="M34 50h12v16q-6 6-12 0z" fill="${shade(sk)}"/><ellipse cx="40" cy="38" rx="17" ry="20" fill="${sk}"/><ellipse cx="23" cy="40" rx="3" ry="5" fill="${sk}"/><ellipse cx="57" cy="40" rx="3" ry="5" fill="${sk}"/>`;
  s+=g==='f'?`<path d="M22 37Q23 14 40 14Q58 14 58 37Q50 23 40 26Q30 23 22 37Z" fill="${hr}"/><circle cx="23" cy="46" r="2" fill="#ffd76a"/><circle cx="57" cy="46" r="2" fill="#ffd76a"/>`:`<path d="M21 38Q18 11 40 11Q62 11 59 38Q56 23 40 23Q24 23 21 38Z" fill="${hr}"/>${seed%3===0?`<path d="M26 50Q40 66 54 50Q50 58 40 58Q30 58 26 50Z" fill="${hr}" opacity=".85"/>`:''}`;
  s+=`<circle cx="33" cy="40" r="2.3" fill="#2a1650"/><circle cx="47" cy="40" r="2.3" fill="#2a1650"/><circle cx="33.8" cy="39.2" r=".8" fill="#fff"/><circle cx="47.8" cy="39.2" r=".8" fill="#fff"/><path d="M32 49Q40 57 48 49" stroke="#8a2f2f" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="29" cy="46" r="3" fill="#ff8a8a" opacity=".3"/><circle cx="51" cy="46" r="3" fill="#ff8a8a" opacity=".3"/></svg>`;
  return s;
}

/* ===== estado ===== */
const DEF=()=>({name:'Carlos',g:'m',M:1,qual:true,F:2,buy:1,rec:140,don:20,maxi:2,mak:1,slym:0,ether:0,wk:0,ally:0,ppl:{}});
let ST=DEF();
try{const sv=JSON.parse(localStorage.getItem('visainLiq')||'null');if(sv)ST=Object.assign(DEF(),sv);}catch(e){}
const save=()=>{try{localStorage.setItem('visainLiq',JSON.stringify(ST))}catch(e){}};
function person(k,i){const key=k+'-'+i;if(!ST.ppl[key]){const c=k*3+i,g=(c+k)%2?'m':'f';ST.ppl[key]={g,n:(g==='f'?FEM:MAS)[(c*5+3)%24],seed:(c*7+k*3+2)%50};}return ST.ppl[key];}
const shown=(N)=>Math.min(N,3);

/* ===== construcción de los pasos ===== */
function build(){
  const me=ST.name||'Tú',mem=MEM[ST.M],buy=MEM[ST.buy],F=Math.max(1,ST.F),rec=ST.rec,steps=[],N=[1];
  for(let k=1;k<=7;k++)N[k]=Math.pow(F,k);
  const names=k=>{const m=shown(N[k]),a=Array.from({length:m},(_,i)=>`<b>${esc(person(k,i).n)}</b>`);const extra=N[k]-m;
    return a.length>1?a.slice(0,-1).join(', ')+' y '+a[a.length-1]+(extra>0?` y otras ${fmt(extra)}`:''):a[0]+(extra>0?` y ${extra==1?'otra persona más':'otras '+fmt(extra)}`:'');};
  let acc=0;const add=(s)=>{s.add=s.add||0;acc+=s.add;steps.push(s);};
  const row=(l,v,cls)=>({l,v,cls});
  // 0 inicio
  steps.push({ch:'Comienzo',c:COL.gold,t:`Conoce a ${me}`,reveal:0,focus:[0],add:0,
    story:`Este es <b>${esc(me)}</b>. Hoy se une a VISAIN con la membresía <b>${mem.n}</b> ${mem.e}. Con ella tiene <b>${mem.pct}% de ganancia</b> en sus ventas y <b>8 formas de ganar</b>. Vamos a verlas una por una.`,
    rows:[row('Membresía',mem.n+' '+mem.e),row('Inversión',money(mem.inv)),row('Puntos',fmt(mem.pts)+' pts'),row('Ganancia directa',mem.pct+'%')]});
  // 1 venta directa
  const retail=Object.keys(PRD).reduce((s,k)=>s+(ST[k]||0)*PRD[k][1],0);
  if(retail>0){const gan=Object.keys(PRD).reduce((a,k)=>a+(ST[k]||0)*(PRD[k][1]/2000)*1000*mem.pct/100,0),lst=Object.keys(PRD).filter(k=>ST[k]>0).map(k=>`${ST[k]} ${PRD[k][0]}`).join(', ');
    add({ch:'1 · Venta directa',c:COL.vd,t:'Venta directa',reveal:0,focus:[0],add:gan,
    story:`<b>${esc(me)}</b> vende a sus clientes: ${lst}. Los compra con su descuento de <b>${mem.pct}%</b> y los vende al precio público: <b>la diferencia es suya</b> (puntos del producto × ${mem.pct}% × $1.000 por caja).`,
    rows:[...Object.keys(PRD).filter(k=>ST[k]>0).map(k=>row(`${ST[k]} × ${PRD[k][0]}`,money(ST[k]*PRD[k][1]))),row('Venta al público',money(retail)),row(`Ganancia (puntos × ${mem.pct}% × $1.000)`,money(gan),'res')]});}
  // 2-8 impulso
  for(let k=0;k<7;k++){const n=N[k+1],np=n*buy.pts,amt=np*1000*IMP[k]/100,inv=k===0?me:person(k,0).n;
    add({ch:'2 · Bono Impulso',c:COL.imp,t:`Bono Impulso · Nivel ${k+1}`,reveal:k+1,focus:[k+1],add:amt,
    story:k===0?`<b>${esc(me)}</b> invita a ${n==1?'una persona':n+' personas'}: ${names(1)}. Cada una compra la membresía <b>${buy.n}</b> (${fmt(buy.pts)} puntos). Es el <b>nivel 1</b>: por el <b>Bono Impulso</b> ${esc(me)} gana el <b>${IMP[0]}%</b>.`
      :`<b>${esc(inv)}</b> también invita, y así cada persona trae a ${F}. En el <b>nivel ${k+1}</b> ya hay <b>${fmt(n)}</b> personas con ${buy.n}${k>0?`, como ${names(k+1)}`:''}. ${esc(me)} gana el <b>${IMP[k]}%</b> de sus compras.`,
    rows:[row(`Personas en el nivel ${k+1}`,fmt(n)),row(`Puntos (${fmt(n)} × ${fmt(buy.pts)})`,fmt(np)+' pts'),row('Valor (1 punto = $1.000)',money(np*1000)),row(`Impulso nivel ${k+1} · ${IMP[k]}%`,money(amt),'res')]});}
  // 9-15 residual
  for(let k=0;k<7;k++){const n=N[k+1],tp=n*rec,need=k<2?0:(k<4?2:3),ok=k<2||(F>=need&&ST.qual),amt=ok?tp*1000*RES[k]/100:0;
    const why=F<need?`Necesita ${need} directos activos`:(!ST.qual?'Requiere estar calificado':'');
    add({ch:'3 · Bono Residual',c:COL.res,t:`Bono Residual · Nivel ${k+1}`,reveal:k+1,focus:[k+1],add:amt,
    story:(k===0?`Cada mes esas ${n==1?'persona':n+' personas'} vuelven a comprar: es su <b>recompra</b> de ${fmt(rec)} puntos. Por el <b>Bono Residual</b> ${esc(me)} gana el <b>${RES[0]}%</b> de cada recompra. ¡Y se repite <b>todos los meses</b>!`
      :`Las <b>${fmt(n)}</b> personas del nivel ${k+1} hacen su recompra mensual de ${fmt(rec)} puntos. ${esc(me)} gana el <b>${RES[k]}%</b> de todo ese consumo.`)+(ok?'':` <b style="color:#ffb0b2">🔒 ${why}.</b>`),
    rows:[row(`Recompra de cada uno`,fmt(rec)+' pts'),row(`Total del nivel (${fmt(n)} × ${fmt(rec)})`,fmt(tp)+' pts'),row('Valor (1 punto = $1.000)',money(tp*1000)),ok?row(`Residual nivel ${k+1} · ${RES[k]}%`,money(amt),'res'):row(`🔒 ${why}`,money(0),'lock res')]});}
  // campaña five
  if(ST.wk>=1){const p=ST.wk>=5?10:6,wp=ST.wk*buy.pts,amt=wp*1000*4*p/100;
    add({ch:'4 · Campaña Five',c:COL.camp,t:'Bono Campaña Five',reveal:1,focus:[1],add:amt,
    story:`Una bonificación <b>semanal</b> (de lunes a domingo). Si los directos de ${esc(me)} logran <b>${ST.wk} membresías por semana</b>, ${esc(me)} gana el <b>${p}%</b> de los puntos que generan. ${ST.wk<5?'Con 5 o más por semana el premio sube al 10%.':'¡El máximo: 10%!'}`,
    rows:[row('Membresías por semana',String(ST.wk)),row(`Puntos por semana (${ST.wk} × ${fmt(buy.pts)})`,fmt(wp)+' pts'),row('En 4 semanas',money(wp*1000*4)),row(`Campaña Five · ${p}%`,money(amt),'res')]});}
  // ayudando y ganando
  if(ST.don>0){let tot=0;const rows=[];for(let k=0;k<7;k++){const v=ST.qual?N[k+1]*ST.don*1000*AYU[k]/100:0;tot+=v;rows.push(row(`Nivel ${k+1} · ${AYU[k]}%`,money(v)));}
    add({ch:'5 · Ayudando y Ganando',c:COL.ayu,t:'Ayudando y Ganando',reveal:7,focus:'all',add:tot,
    story:`Cuando la red compra productos para <b>causas sociales</b>, todos ayudan y ${esc(me)} también gana: <b>7 niveles</b> de compensación. ${ST.qual?'':'<b style="color:#ffb0b2">🔒 Requiere estar calificado.</b>'}`,
    rows:[...rows,row('Total Ayudando y Ganando',money(tot),'res')]});}
  // aliado comercial
  if(ST.ally>0){let tot=0,purch=0;for(let k=0;k<7;k++){purch+=N[k+1]*ST.ally;tot+=N[k+1]*ST.ally*ALI[k]/100;}
    add({ch:'8 · Aliado Comercial',c:COL.ali,t:'Bono Aliado Comercial',reveal:7,focus:'all',add:tot,
    story:`La red también compra productos y servicios de nuestros <b>aliados comerciales</b>. ${esc(me)} gana <b>10%</b> en el nivel 1 y <b>5%</b> en los niveles 2 al 7.`,
    rows:[row('Compras de la red a aliados',money(purch)),row('Nivel 1 · 10%',money(N[1]*ST.ally*.1)),row('Niveles 2 a 7 · 5%',money(tot-N[1]*ST.ally*.1)),row('Total aliado comercial',money(tot),'res')]});}
  // rangos
  const ri=(()=>{let r=-1;RANKS.forEach((x,i)=>{if(acc>=x.th)r=i});return r;})(),bonus=RANKS.slice(0,ri+1).reduce((s,x)=>s+x.b,0),nx=RANKS[ri+1],accR=acc;
  add({ch:'6 · Bono de Rangos',c:COL.rng,t:'Bono de Rangos',reveal:7,focus:[0],add:bonus,
    story:ri>=0?`Todo lo que ${esc(me)} va ganando suma para subir de rango. Con <b>${money(accR)}</b> acumulados alcanza el rango <b>${RANKS[ri].n} ${RANKS[ri].e}</b>${bonus?` y recibe un bono de <b>${money(bonus)}</b>`:''}. ${nx?`El siguiente es <b>${nx.n}</b>.`:'¡Llegó a Diamante!'}`:`Todo lo que ${esc(me)} va ganando suma para subir de rango. El primero es <b>Aire 🌬️</b>, a los ${money(RANKS[0].th)} acumulados. ¡Cada mes se acerca más!`,
    rows:[row('Ganancias acumuladas',money(accR)),row('Rango alcanzado',ri>=0?RANKS[ri].n+' '+RANKS[ri].e:'En camino'),nx?row(`Para ${nx.n} (${money(nx.th)})`,'faltan '+money(nx.th-accR)):row('Rango máximo','💎'),row('Bono de rangos (Tierra $300.000 · Diamante $5.000.000)',money(bonus),'res')]});
  // igualación
  let R1=0;for(let j=1;j<=7;j++){const need=j<=2?0:(j<=4?2:3);if(j<=2||(F>=need&&ST.qual))R1+=Math.pow(F,j)*rec*1000*RES[j-1]/100;}
  const ip=ri>=4?20:ri>=3?10:ri>=2?5:0,dres=F*R1,igu=ip&&ST.qual?dres*ip/100:0,pot=dres*.05;
  add({ch:'7 · Bono de Igualación',c:COL.igu,t:'Bono de Igualación',reveal:7,focus:[1],add:igu,
    story:ip?`Cada directo de ${esc(me)} también construye su propia red y gana su Residual. Como ${esc(me)} es <b>${RANKS[ri].n}</b>, recibe un <b>${ip}% adicional</b> de ese residual: ¡ganancia sobre el esfuerzo de su equipo!`:`Cada directo construye su propia red y gana su Residual. Cuando ${esc(me)} llegue al rango <b>Fuego 🔥</b> recibe <b>5%</b> adicional de ese residual, con <b>Agua 💧</b> 10% y con <b>Diamante 💎</b> <b>20%</b>.`,
    rows:ip?[row(`Residual de sus ${F} directos`,money(dres)),row(`Igualación · ${ip}%`,money(igu),'res')]:[row(`Residual de sus ${F} directos`,money(dres)),row('Con rango Fuego (5%)',money(pot)),row('🔒 Aún sin el rango requerido',money(0),'lock res')]});
  // final
  const list=[];steps.forEach(s=>{if(s.add>0){const f=s.ch.replace(/^\d+ · /,'');const prev=list.find(x=>x.k===f);if(prev)prev.v+=s.add;else list.push({k:f,v:s.add,c:s.c});}});
  const total=list.reduce((a,x)=>a+x.v,0);
  steps.push({ch:'Resumen',c:COL.gold,t:'¡Así se ve el mes completo!',reveal:7,focus:'all',add:0,final:true,
    story:`Todo junto, en este ejemplo <b>${esc(me)}</b> suma <b>${money(total)}</b> en un mes, con una red que crece porque cada persona invita a ${F}. <b>Y tú también puedes construirlo.</b>`,
    rows:[...list.map(x=>({l:x.k,v:money(x.v),c:x.c})),{l:'TOTAL DEL MES',v:money(total),cls:'res'}]});
  // billetera acumulada
  let w=0;steps.forEach(s=>{w+=s.add;s.wallet=w;});
  steps.forEach(s=>{if(s.final)s.wallet=total;});
  return{steps,N};
}

/* ===== escenario ===== */
const stage=$('#stage'),colsEl=$('#cols'),linesEl=$('#lines'),meEl=$('#me');
const CX=k=>70+k*110,CY=400,SP=150;
const yOf=(i,m)=>CY+(i-(m-1)/2)*SP;
let S=null,idx=0,auto=null,lastW=0;
function layout(){
  const N=S.N;colsEl.innerHTML='';linesEl.innerHTML='';
  for(let k=1;k<=7;k++){
    const n=N[k],m=shown(n),col=document.createElement('div');col.className='col';col.dataset.k=k;col.style.left=(CX(k)-50)+'px';
    let h=`<div class="chd">Nivel ${k}<small>👥 ${fmt(n)}</small></div>`;
    for(let i=0;i<m;i++){const p=person(k,i);h+=`<div class="av" data-k="${k}" data-i="${i}" style="top:${yOf(i,m)-12}px;animation-delay:${i*90}ms">${avatar(p.g,p.seed)}<div class="nm" title="Toca para renombrar">${esc(p.n)}</div></div>`;}
    if(n>m)h+=`<div class="more" style="top:${yOf(m-1,m)+112}px"><b>+${fmt(n-m)}</b>más</div>`;
    col.innerHTML=h;colsEl.appendChild(col);
    // líneas
    const pm=k===1?1:shown(N[k-1]);
    for(let i=0;i<m;i++){const pi=k===1?0:Math.floor(i/Math.max(1,ST.F));if(pi>=pm)continue;
      const x1=k===1?132:CX(k-1)+42,y1=k===1?CY:yOf(pi,pm)-12,x2=CX(k)-42,y2=yOf(i,m)-12,mx=(x1+x2)/2;
      const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',`M${x1} ${y1}C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`);p.dataset.k=k;linesEl.appendChild(p);}
  }
  const me=ST.name||'Tú';
  meEl.style.top=CY+'px';meEl.innerHTML=`<div class="crown">👑</div>${avatar(ST.g,17,true)}<div class="nm">${esc(me)}</div><div class="wal" id="wal">$0</div>`;
}
function renderStep(back){
  const s=S.steps[idx];
  $('#chip').textContent=s.ch;$('#chip').style.background=s.c;$('#title').textContent=s.t;$('#story').innerHTML=s.story;
  $('#tape').innerHTML=s.rows.map((r,i)=>`<div class="tr ${r.cls||''}" style="animation-delay:${180+i*130}ms"><span>${r.c?`<i style="display:inline-block;width:11px;height:11px;border-radius:3px;background:${r.c};margin-right:8px"></i>`:''}${r.l}</span><b>${r.v}</b></div>`).join('');
  $('#disc').textContent='Ejemplo ilustrativo del plan de compensación. Los resultados reales dependen del esfuerzo individual y de los términos y condiciones vigentes.';
  document.querySelectorAll('.col').forEach(c=>{const k=+c.dataset.k,show=k<=s.reveal,focus=s.focus==='all'?show:(Array.isArray(s.focus)&&s.focus.includes(k));
    if(show&&!c.classList.contains('show')&&!back)c.querySelectorAll('.av').forEach(a=>{a.style.animation='none';void a.offsetWidth;a.style.animation='';});
    c.classList.toggle('show',show);c.classList.toggle('focus',focus);});
  linesEl.querySelectorAll('path').forEach(p=>p.classList.toggle('show',+p.dataset.k<=s.reveal));
  meEl.style.opacity=1;
  countTo($('#totv'),s.wallet);countTo($('#wal'),s.wallet);
  if(!back&&s.add>0)celebrate(s);
  // dots y chap
  document.querySelectorAll('#dots i').forEach((d,i)=>{d.className=i<idx?'past':i===idx?'now':'';});
  $('#chap').value=String(chapStart(idx));
  $('#bPrev').disabled=idx===0;$('#bNext').textContent=idx===S.steps.length-1?'↺ Reiniciar':'Siguiente ▶';
  if(s.final)finale();
}
const chapStart=i=>{const ch=S.steps[i].ch;let j=i;while(j>0&&S.steps[j-1].ch===ch)j--;return j;};
function buildNav(){
  $('#dots').innerHTML=S.steps.map((_,i)=>`<i data-i="${i}" title="Paso ${i+1}"></i>`).join('');
  const seen=new Set(),opts=[];S.steps.forEach((s,i)=>{if(!seen.has(s.ch)){seen.add(s.ch);opts.push(`<option value="${i}">${s.ch}</option>`);}});
  $('#chap').innerHTML=opts.join('');
}
$('#dots').onclick=e=>{const d=e.target.closest('i');if(d)go(+d.dataset.i);};
$('#chap').onchange=()=>go(+$('#chap').value);
function go(i){const back=i<idx;idx=Math.max(0,Math.min(S.steps.length-1,i));renderStep(back);}
const next=()=>idx>=S.steps.length-1?go(0):go(idx+1),prev=()=>go(idx-1);
$('#bNext').onclick=next;$('#bPrev').onclick=prev;

/* contador */
const cnt=new WeakMap();
function countTo(el,to){if(!el)return;const from=cnt.get(el)||0;cnt.set(el,to);if(el._r)cancelAnimationFrame(el._r);const t0=performance.now(),D=900;
  const f=t=>{const u=Math.min(1,(t-t0)/D),e=1-Math.pow(1-u,3);el.textContent=money(from+(to-from)*e);if(u<1)el._r=requestAnimationFrame(f);};el._r=requestAnimationFrame(f);}

/* monedas y sonido */
let ac=null;
function tone(f,st,d,v){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const t=ac.currentTime+st,o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.value=f;o.connect(g);g.connect(ac.destination);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.001,t+d);o.start(t);o.stop(t+d+.02);}catch(e){}}
const ding=()=>{[1318,1568,2093].forEach((f,i)=>tone(f,i*.09,.4,.16));};
function celebrate(s){
  ding();
  const srcCols=s.focus==='all'?[1,2,3,4,5,6,7]:(s.focus||[0]),pts=[];
  srcCols.forEach(k=>{if(k===0)pts.push([72,CY-40]);else{const m=shown(S.N[k]);for(let i=0;i<m;i++)pts.push([CX(k),yOf(i,m)-30]);}});
  const n=Math.min(12,Math.max(5,pts.length*3));
  for(let i=0;i<n;i++){const p=pts[i%pts.length],c=document.createElement('div');c.className='coin';c.textContent='🪙';c.style.left=p[0]+'px';c.style.top=p[1]+'px';stage.appendChild(c);
    const dx=72-p[0],dy=CY-50-p[1];
    const a=c.animate([{transform:'translate(0,0) scale(1) rotate(0)',opacity:1},{transform:`translate(${dx*.5}px,${dy*.5-70}px) scale(1.3) rotate(180deg)`,opacity:1,offset:.5},{transform:`translate(${dx}px,${dy}px) scale(.5) rotate(360deg)`,opacity:.9}],{duration:1000,delay:i*80,easing:'ease-in-out',fill:'backwards'});
    a.onfinish=()=>c.remove();}
  const f=document.createElement('div');f.className='float';f.textContent='+ '+money(s.add);f.style.left='20px';f.style.top=(CY-130)+'px';stage.appendChild(f);
  f.animate([{transform:'translateY(20px) scale(.6)',opacity:0},{transform:'translateY(-10px) scale(1.2)',opacity:1,offset:.25},{transform:'translateY(-70px) scale(1)',opacity:0}],{duration:2100,delay:600}).onfinish=()=>f.remove();
  meEl.animate([{transform:'translateY(-50%) scale(1)'},{transform:'translateY(-50%) scale(1.12)'},{transform:'translateY(-50%) scale(1)'}],{duration:500,delay:1300});
  burst(26,72,CY);
}
function finale(){ding();setTimeout(ding,300);burst(120,72,CY);burst(80,640,300);}

/* polvo dorado de fondo + chispas */
const cv=$('#fx'),cx=cv.getContext('2d');let W,H,D=Math.min(2,devicePixelRatio||1),P=[],B=[];
const spr=document.createElement('canvas');spr.width=spr.height=32;{const g=spr.getContext('2d'),gr=g.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'rgba(255,250,225,1)');gr.addColorStop(.25,'rgba(255,205,80,.9)');gr.addColorStop(1,'rgba(255,190,60,0)');g.fillStyle=gr;g.fillRect(0,0,32,32);}
function rs(){W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;cx.setTransform(D,0,0,D,0,0);P=Array.from({length:Math.min(130,Math.round(W*H/12000))},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2+.6,v:Math.random()*16+5,p:Math.random()*6.28,s:Math.random()+.5}));fit();}
function burst(n,sx,sy){const r=stage.getBoundingClientRect(),k=r.width/1280,x=r.left+sx*k,y=r.top+sy*k;for(let i=0;i<n;i++){const a=Math.random()*6.28,v=80+Math.random()*320;B.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-60,l:0,m:.8+Math.random()*1.4,r:1.5+Math.random()*3});}}
function fit(){const k=Math.min(innerWidth/1280,(innerHeight-58-44)/720);stage.style.transform=`scale(${k})`;}
let t0=performance.now();(function f(t){const dt=Math.min(.05,(t-t0)/1000);t0=t;cx.clearRect(0,0,W,H);cx.globalCompositeOperation='lighter';
  for(const p of P){p.y-=p.v*dt;p.x+=Math.sin(t/1400*p.s+p.p)*8*dt;if(p.y<-10){p.y=H+10;p.x=Math.random()*W;}cx.globalAlpha=(.25+.55*Math.abs(Math.sin(t/900*p.s+p.p)))*.7;const s=p.r*7;cx.drawImage(spr,p.x-s/2,p.y-s/2,s,s);}
  for(let i=B.length-1;i>=0;i--){const b=B[i];b.l+=dt;if(b.l>b.m){B.splice(i,1);continue;}b.vx*=1-1.6*dt;b.vy=b.vy*(1-1.6*dt)+160*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;cx.globalAlpha=Math.sin(Math.PI*b.l/b.m);const s=b.r*8;cx.drawImage(spr,b.x-s/2,b.y-s/2,s,s);}
  cx.globalAlpha=1;requestAnimationFrame(f);})(t0);
addEventListener('resize',rs);rs();

/* edición de personajes */
stage.addEventListener('click',e=>{
  const av=e.target.closest('.av'),me=e.target.closest('#me');
  if(me){ST.g=ST.g==='m'?'f':'m';save();refresh();return;}
  if(!av)return;const k=+av.dataset.k,i=+av.dataset.i,p=person(k,i);
  if(e.target.closest('.nm')){const n=prompt('Nombre de este personaje:',p.n);if(n&&n.trim()){p.n=n.trim().slice(0,14);save();refresh();}}
  else{p.g=p.g==='m'?'f':'m';p.n=(p.g==='f'?FEM:MAS)[(k*3+i+ST.F)%24];save();refresh();}
});
function refresh(){const keep=idx;S=build();layout();buildNav();idx=Math.min(keep,S.steps.length-1);renderStep(true);}

/* ===== configuración ===== */
function buildSetup(){
  $('#sMem').innerHTML=MEM.map((m,i)=>`<div data-i="${i}">${m.e}<b>${m.pct}%</b>${m.n}</div>`).join('');
  $('#sF').innerHTML=[1,2,3,4,5].map(n=>`<option value="${n}">${n} ${n==1?'persona':'personas'}</option>`).join('');
  $('#sBuy').innerHTML=MEM.map((m,i)=>`<option value="${i}">${m.n} · ${fmt(m.pts)} pts · ${money(m.inv)}</option>`).join('');
}
function fillSetup(){
  $('#sName').value=ST.name;$('#sQual').checked=ST.qual;$('#sF').value=ST.F;$('#sBuy').value=ST.buy;$('#sRec').value=ST.rec;$('#sDon').value=ST.don;
  ['maxi','mak','slym','ether'].forEach(k=>$('#s'+k[0].toUpperCase()+k.slice(1)).value=ST[k]);$('#sWk').value=ST.wk;$('#sAlly').value=ST.ally;
  document.querySelectorAll('#sGen button').forEach(b=>b.classList.toggle('on',b.dataset.g===ST.g));
  document.querySelectorAll('#sMem div').forEach(d=>d.classList.toggle('on',+d.dataset.i===ST.M));
}
$('#sGen').onclick=e=>{const b=e.target.closest('button');if(!b)return;ST.g=b.dataset.g;fillSetup();};
$('#sMem').onclick=e=>{const d=e.target.closest('div[data-i]');if(!d)return;ST.M=+d.dataset.i;fillSetup();};
$('#sRand').onclick=()=>{ST.ppl={};const o=Math.floor(Math.random()*30);for(let k=1;k<=7;k++)for(let i=0;i<3;i++){const c=k*3+i+o,g=(c+k)%2?'m':'f';ST.ppl[k+'-'+i]={g,n:(g==='f'?FEM:MAS)[(c*5+3)%24],seed:(c*7+k*3+2)%50};}};
$('#sGo').onclick=()=>{
  ST.name=$('#sName').value.trim()||'Tú';ST.qual=$('#sQual').checked;ST.F=+$('#sF').value;ST.buy=+$('#sBuy').value;
  ST.rec=Math.max(0,+$('#sRec').value||0);ST.don=Math.max(0,+$('#sDon').value||0);
  ['maxi','mak','slym','ether'].forEach(k=>ST[k]=Math.max(0,+$('#s'+k[0].toUpperCase()+k.slice(1)).value||0));ST.wk=Math.max(0,+$('#sWk').value||0);ST.ally=Math.max(0,+$('#sAlly').value||0);
  save();$('#setup').classList.add('hide');S=build();layout();buildNav();cnt.delete($('#totv'));idx=0;renderStep(false);
};
$('#bSet').onclick=()=>{fillSetup();$('#setup').classList.remove('hide');stopAuto();};
$('#bFull').onclick=toggleFull;
function toggleFull(){try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}catch(e){}}
function stopAuto(){if(auto){clearInterval(auto);auto=null;}$('#bAuto').classList.remove('on');$('#bAuto').textContent='▶ Auto';}
$('#bAuto').onclick=()=>{if(auto)return stopAuto();$('#bAuto').classList.add('on');$('#bAuto').textContent='⏸ Auto';auto=setInterval(()=>{if(idx>=S.steps.length-1)stopAuto();else next();},9000);};
document.addEventListener('keydown',e=>{
  if(document.body.dataset.tab!=='pres'||!$('#setup').classList.contains('hide')||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
  if(e.key==='ArrowRight'||e.code==='Space'||e.key==='PageDown'){e.preventDefault();next();}
  else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();prev();}
  else if(e.key==='f'||e.key==='F')toggleFull();else if(e.key==='a'||e.key==='A')$('#bAuto').click();
  else if(e.key==='Home')go(0);else if(e.key==='End')go(S.steps.length-1);
});
let idle;const wake=()=>{document.body.classList.remove('idle');clearTimeout(idle);idle=setTimeout(()=>{if(document.fullscreenElement&&$('#setup').classList.contains('hide'))document.body.classList.add('idle')},3500);};
['mousemove','mousedown','keydown'].forEach(ev=>document.addEventListener(ev,wake));
buildSetup();fillSetup();S=build();layout();buildNav();renderStep(true);
window.__liq={build:()=>build(),go:i=>go(i),ST:()=>ST,start:()=>$('#sGo').click()};
})();
