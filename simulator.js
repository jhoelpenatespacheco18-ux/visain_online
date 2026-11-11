/* Motor de cálculo (calc, simulate) y interfaz del simulador */
(function(){
const $=s=>document.querySelector(s);
const fmtN=n=>Math.round(n).toLocaleString('es-CO');
const money=n=>'$'+fmtN(n);
const mshort=n=>{const a=Math.abs(n);return a>=1e6?'$'+(n/1e6).toFixed(a>=1e7?1:2).replace('.',',')+' M':a>=1e3?'$'+Math.round(n/1e3)+' mil':'$'+Math.round(n)};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ===== DATOS OFICIALES (presentación del plan de compensación) ===== */
const MEM=[
 {n:'Semilla',e:'🌱',inv:350000,pts:190,pct:.20,rec:140},
 {n:'Emprendedor',e:'📈',inv:980000,pts:500,pct:.25,rec:140},
 {n:'Impacto',e:'⭐',inv:1980000,pts:1300,pct:.30,rec:140},
 {n:'Infinity',e:'♾️',inv:5000000,pts:3000,pct:.40,rec:280},
 {n:'Fundador Oro',e:'👑',inv:10000000,pts:6500,pct:.50,rec:280}];
const PRD=[{k:'mak',n:'Mak-Vid',p:120000,pts:60},{k:'slym',n:'Slym-Vid',p:140000,pts:70},{k:'ether',n:'Ether-Ju',p:170000,pts:85},{k:'maxi',n:'Maxi 3',p:250000,pts:125}];
const IMP=[.35,.06,.03,.01,.01,.01,.03],RES=[.30,.06,.03,.01,.01,.01,.08],AYU=[.35,.10,.02,.02,.02,.02,.07],ALI=[.10,.05,.05,.05,.05,.05,.05];
const COMBOS=[
 {n:'Esencial',pts:[645,547,456,297,169],gan:[312000,390000,468000,624000,780000]},
 {n:'Vital',pts:[791,721,652,513,223],gan:[348000,435000,522000,696000,870000]},
 {n:'Renova',pts:[573,485,404,264,151],gan:[276000,345000,414000,552000,690000]},
 {n:'Elite',pts:[1184,1009,847,564,335],gan:[540000,675000,810000,1080000,1350000]}];
const RANKS=[
 {n:'Aire',t:'El Visionario',e:'🌬️',th:3125000,bonus:0},
 {n:'Tierra',t:'El Constructor',e:'🌍',th:6250000,bonus:300000},
 {n:'Fuego',t:'El Impulsor',e:'🔥',th:12500000,bonus:0},
 {n:'Agua',t:'El Conector',e:'💧',th:25000000,bonus:0},
 {n:'Diamante',t:'El Líder',e:'💎',th:50000000,bonus:5000000}];
const DIAM=[
 ['Diamante Ejecutivo','El Estratega','Ser Diamante + 2 Diamantes directos','Viaje nacional para 2 personas + 10 millones'],
 ['Diamante Embajador','El Representante','Ser D. Ejecutivo + 4D nivel 1 + 2D nivel 2','Viaje internacional para 2 personas + 20 millones'],
 ['Diamante Éter','El Trascendente','Ser D. Ejecutivo + 6D nv1 + 4D nv2 + 2D nv3','Crucero para 2 personas + 20 millones'],
 ['Diamante Imperial','El Maestro','Ser D. Ejecutivo + 8D nv1 + 6D nv2 + 4D nv3 + 2D nv4','Automóvil + 20 millones'],
 ['Diamante Imperial Dorado','La Leyenda','Ser D. Ejecutivo + 10D nv1 + 8D nv2 + 6D nv3 + 4D nv4 + 2D nv5','Camioneta + 30 millones o cuota inicial de apartamento']];
const BON=[
 {k:'vd',n:'Venta directa',c:'#ffd76a',e:'🛒'},
 {k:'imp',n:'Bono Impulso',c:'#e08a1a',e:'🚀'},
 {k:'res',n:'Bono Residual',c:'#a66cff',e:'♻️'},
 {k:'camp',n:'Campaña Five',c:'#ff6fb5',e:'🖐'},
 {k:'ayu',n:'Ayudando y Ganando',c:'#3ddc97',e:'🤝'},
 {k:'rng',n:'Bono de Rangos',c:'#f4f0ff',e:'🏔'},
 {k:'igu',n:'Bono de Igualación',c:'#5ec8ff',e:'⚖️'},
 {k:'ali',n:'Aliado Comercial',c:'#ff8a5c',e:'🏢'},
 {k:'corp',n:'Beneficio corporativo',c:'#c9b8ff',e:'🏛'}];

/* ===== ESTADO ===== */
const zeros=()=>Array(7).fill(0);
const DEF=()=>({mode:'sim',M:1,myRec:140,qual:true,retail:{mak:1,slym:0,ether:0,maxi:2},combos:[0,0,0,0],
  a:3,b:.15,act:70,recPts:140,mix:[40,30,15,10,5],donate:0,ally:0,wkCombo:0,month:12,hz:12,goal:5000000,goalM:12,
  man:{newPts:zeros(),recPts:zeros(),donPts:zeros(),allyCOP:zeros(),dAct:0,wkMemb:0,wkMembPts:500,wkCombo:0,wkComboPts:500,weeks:4,dRes:0,acc:0,corp:0,allyDeal:0}});
let ST=DEF();
try{const sv=JSON.parse(localStorage.getItem('visainCalc')||'null');if(sv){const d=DEF();ST=Object.assign(d,sv);ST.man=Object.assign(d.man,sv.man||{});ST.retail=Object.assign(d.retail,sv.retail||{});}}catch(e){}
const save=()=>{try{localStorage.setItem('visainCalc',JSON.stringify(ST))}catch(e){}};

/* ===== MOTOR DE CÁLCULO (un mes) ===== */
const rankIdx=acc=>{let r=-1;RANKS.forEach((x,i)=>{if(acc>=x.th)r=i});return r;};
function calc(I,acc){
  const m=MEM[I.M],act=I.myRec>=m.rec,cal=!!I.qual,ad=I.directsActive||0;
  const L={vd:0,imp:0,res:0,camp:0,ayu:0,rng:0,igu:0,ali:0,corp:0},lvl=Array.from({length:7},()=>({imp:0,res:0,ayu:0,ali:0})),w=[];
  const retail=PRD.reduce((s,p)=>s+(I.retail[p.k]||0)*p.p,0);
  const combosG=COMBOS.reduce((s,c,i)=>s+(I.combos[i]||0)*c.gan[I.M],0);
  if(!act){w.push(`Tu recompra personal (${fmtN(I.myRec)} pts) es menor al mínimo de ${m.rec} pts de ${m.n}: sin estar activo no se cobran bonos.`);
    return{L,lvl,w,act,total:0,retail};}
  L.vd=PRD.reduce((a,p)=>a+(I.retail[p.k]||0)*p.pts*1000,0)*m.pct+combosG;
  let blocked=false;
  for(let k=0;k<7;k++){
    L.imp+=lvl[k].imp=(I.newPts[k]||0)*1000*IMP[k];
    const need=k<2?0:(k<4?2:3),okRes=k<2||(ad>=need&&cal);
    if(okRes)L.res+=lvl[k].res=(I.recPts[k]||0)*1000*RES[k];else if((I.recPts[k]||0)>0)blocked=true;
    if(cal)L.ayu+=lvl[k].ayu=(I.donPts[k]||0)*1000*AYU[k];
    L.ali+=lvl[k].ali=(I.allyCOP[k]||0)*ALI[k];
  }
  if(blocked)w.push(ad<2?'Los niveles 3-7 del Residual no pagan hasta tener 2 vinculados directos activos (niveles 3-4) y 3 (niveles 5-7).':!cal?'Los niveles 3-7 del Residual requieren ser Empresario Calificado.':'Para cobrar los niveles 5, 6 y 7 del Residual necesitas 3 vinculados directos activos.');
  if(!cal&&zeros().some((_,k)=>(I.donPts[k]||0)>0))w.push('Ayudando y Ganando requiere ser Empresario Calificado.');
  const cp=(n,pts)=>(n>=5?.10:n>=1?.06:0)*(n*pts*1000*(I.weeks||4));
  L.camp=cp(I.wkMemb||0,I.wkMembPts||0)+cp(I.wkCombo||0,I.wkComboPts||0);
  if(I.allyDeal)L.ali+=I.allyDeal*.10;
  const ri=rankIdx(acc||0),ip=ri>=4?.20:ri>=3?.10:ri>=2?.05:0;
  if(ip&&cal)L.igu=ip*(I.dRes||0);
  if(I.M>=3){const okc=I.myRec>=180&&ad>=3;if(okc)L.corp=(I.corp||0)*1000*(I.M===3?.01:.02)/12;else if(I.corp>0)w.push('El beneficio corporativo requiere recompra personal de 180 pts y 3 vinculados directos activos.');}
  const total=Object.values(L).reduce((a,b)=>a+b,0);
  return{L,lvl,w,act,total,retail,ri};
}

/* ===== SIMULADOR DE CRECIMIENTO (hasta 36 meses) ===== */
function simulate(S,months){
  const K=8,N=Array.from({length:K},()=>Array(months+2).fill(0)),P=Array.from({length:K},()=>Array(months+2).fill(0));
  const mt=S.mix.reduce((a,b)=>a+b,0)||1,avgPts=S.mix.reduce((s,v,i)=>s+v/mt*MEM[i].pts,0);
  const rows=[];let acc=0;
  for(let m=1;m<=months;m++){
    N[0][m]=S.a;for(let k=1;k<K;k++)N[k][m]=S.b*P[k-1][m-1];
    for(let k=0;k<K;k++)P[k][m]=P[k][m-1]+N[k][m];
    const act=S.act/100,prev=k=>P[k][m-1]*act;
    const recP=k=>prev(k)*S.recPts;
    const avgDir=P[0][m-1]>0?P[1][m-1]/P[0][m-1]*act:0;
    let dRes=0;for(let j=0;j<7;j++){const need=j<2?0:(j<4?2:3);if(j<2||avgDir>=need)dRes+=RES[j]*recP(j+1)*1000;}
    const I={M:S.M,myRec:S.myRec,qual:S.qual,retail:S.retail,combos:S.combos,
      newPts:Array.from({length:7},(_,k)=>N[k][m]*avgPts),recPts:Array.from({length:7},(_,k)=>recP(k)),
      donPts:Array.from({length:7},(_,k)=>prev(k)*S.donate),allyCOP:Array.from({length:7},(_,k)=>prev(k)*S.ally),
      directsActive:Math.round(prev(0)),wkMemb:N[0][m]/4.33,wkMembPts:avgPts,wkCombo:S.wkCombo,wkComboPts:COMBOS[0].pts[S.M],weeks:4.33,dRes,corp:0,allyDeal:0};
    const r=calc(I,acc),old=rankIdx(acc);let total=r.total;
    if(r.act){const nr=rankIdx(acc+total);let b=0;for(let j=old+1;j<=nr;j++)b+=RANKS[j].bonus;r.L.rng=b;total+=b;}
    acc+=total;r.total=total;r.acc=acc;r.m=m;r.people=Array.from({length:7},(_,k)=>P[k][m]);r.newp=Array.from({length:7},(_,k)=>N[k][m]);
    rows.push(r);
  }
  return rows;
}
function manualResult(){
  const mn=ST.man,I={M:ST.M,myRec:ST.myRec,qual:ST.qual,retail:ST.retail,combos:ST.combos,newPts:mn.newPts,recPts:mn.recPts,donPts:mn.donPts,allyCOP:mn.allyCOP,
    directsActive:mn.dAct,wkMemb:mn.wkMemb,wkMembPts:mn.wkMembPts,wkCombo:mn.wkCombo,wkComboPts:mn.wkComboPts,weeks:mn.weeks,dRes:mn.dRes,corp:mn.corp,allyDeal:mn.allyDeal};
  const r=calc(I,mn.acc);r.acc=mn.acc;r.people=null;r.m=1;return r;
}

/* ===== UI: controles ===== */
const SLD={
 personal:[{k:'myRec',l:'Mi recompra personal del mes',min:0,max:1000,step:10,f:v=>fmtN(v)+' pts',h:()=>`Mínimo para estar activo en ${MEM[ST.M].n}: <b>${MEM[ST.M].rec} pts</b>`}],
 sim:[{k:'a',l:'Personas nuevas que patrocinas por mes',min:0,max:40,step:1,f:v=>fmtN(v)},
      {k:'b',l:'Nuevas que trae cada persona de tu equipo por mes',min:0,max:2,step:.05,f:v=>v.toFixed(2),h:()=>'Duplicación: 0,50 = una de cada dos personas trae a alguien nuevo cada mes. Sé conservador: crece de forma exponencial'},
      {k:'act',l:'% de tu equipo que compra cada mes',min:0,max:100,step:5,f:v=>v+'%'},
      {k:'recPts',l:'Recompra mensual por persona activa',min:0,max:600,step:10,f:v=>fmtN(v)+' pts',h:()=>'140 pts = $140.000 · 280 pts = $280.000'}],
 adv:[{k:'donate',l:'Compras solidarias por persona activa',min:0,max:100,step:5,f:v=>v+' pts',h:()=>'Para Ayudando y Ganando (requiere estar calificado)'},
      {k:'ally',l:'Compras de aliados comerciales por persona activa',min:0,max:500000,step:10000,f:v=>money(v)},
      {k:'wkCombo',l:'Recompras de combos semanales de tus directos',min:0,max:12,step:1,f:v=>v,h:()=>'Campaña Five: 1 a 4 personas = 6% · 5 o más = 10%'}]
};
let upd=null;
function slHTML(group,c,obj,idp){
  return `<div class="f"><div class="t"><span>${c.l}</span><output id="o_${idp}${c.k}"></output></div><input type="range" id="r_${idp}${c.k}" min="${c.min}" max="${c.max}" step="${c.step}">${c.h?`<div class="note" id="h_${idp}${c.k}"></div>`:''}</div>`;
}
function buildSliders(host,group,obj,idp){
  $(host).innerHTML=SLD[group].map(c=>slHTML(group,c,obj,idp)).join('');
  SLD[group].forEach(c=>{const r=$('#r_'+idp+c.k);r.oninput=()=>{obj[c.k]=parseFloat(r.value);schedule();};});
}
function syncSliders(group,obj,idp){
  SLD[group].forEach(c=>{const r=$('#r_'+idp+c.k);if(!r)return;if(document.activeElement!==r)r.value=obj[c.k];
    r.style.setProperty('--p',((obj[c.k]-c.min)/(c.max-c.min)*100)+'%');$('#o_'+idp+c.k).textContent=c.f(obj[c.k]);
    if(c.h)$('#h_'+idp+c.k).innerHTML=c.h();});
}
function buildStatic(){
  $('#mem').innerHTML=MEM.map((m,i)=>`<div class="mc" data-i="${i}"><div class="i">${m.e}</div><div class="n">${m.n}</div><div class="p">${Math.round(m.pct*100)}%</div><div class="v">${mshort(m.inv)}</div></div>`).join('');
  $('#mem').onclick=e=>{const c=e.target.closest('.mc');if(!c)return;ST.M=+c.dataset.i;if(ST.myRec<MEM[ST.M].rec)ST.myRec=MEM[ST.M].rec;schedule();};
  buildSliders('#fPersonal','personal',ST,'p_');
  $('#fRetail').innerHTML=PRD.map(p=>`<div class="f"><div class="t"><span>${p.n} vendidos (${money(p.p)} c/u)</span><output id="o_rt_${p.k}"></output></div><input type="range" id="r_rt_${p.k}" min="0" max="60" step="1"></div>`).join('')+`<div class="note">Vendes al precio público y compras con el descuento de tu membresía: la diferencia es tuya.</div>`;
  PRD.forEach(p=>{$('#r_rt_'+p.k).oninput=e=>{ST.retail[p.k]=+e.target.value;schedule();};});
  $('#fCombos').innerHTML=COMBOS.map((c,i)=>`<div class="f"><div class="t"><span>Combo ${c.n}</span><output id="o_cb_${i}"></output></div><input type="range" id="r_cb_${i}" min="0" max="10" step="1"></div>`).join('')+`<div class="note">La ganancia por combo depende de tu membresía (tabla oficial «Ganancia por combo»).</div>`;
  COMBOS.forEach((c,i)=>{$('#r_cb_'+i).oninput=e=>{ST.combos[i]=+e.target.value;schedule();};});
  buildSliders('#fSim','sim',ST,'s_');buildSliders('#fAdv','adv',ST,'v_');
  $('#fMix').innerHTML=MEM.map((m,i)=>`<div class="mixrow"><span>${m.e} ${m.n}</span><input type="range" id="r_mx${i}" min="0" max="100" step="5"><output id="o_mx${i}"></output></div>`).join('');
  MEM.forEach((m,i)=>{$('#r_mx'+i).oninput=e=>{ST.mix[i]=+e.target.value;schedule();};});
  $('#qual').onchange=()=>{ST.qual=$('#qual').checked;schedule();};
  $('#modeSeg').onclick=e=>{const b=e.target.closest('button');if(!b)return;ST.mode=b.dataset.m;schedule();};
  $('#hz').onclick=e=>{const b=e.target.closest('button');if(!b)return;ST.hz=+b.dataset.h;if(ST.month>ST.hz)ST.month=ST.hz;schedule();};
  // manual
  const mn=ST.man;
  const rows=Array.from({length:7},(_,k)=>`<tr><td>Nivel ${k+1}</td><td><input type="number" min="0" id="m_np${k}"><div style="margin-top:4px;display:flex;gap:3px;justify-content:flex-end">${MEM.map((m,i)=>`<button class="mini" title="+ ${m.n} (${m.pts} pts)" data-k="${k}" data-i="${i}">${m.e}</button>`).join('')}</div></td><td><input type="number" min="0" id="m_rp${k}"></td><td><input type="number" min="0" id="m_dp${k}"></td><td><input type="number" min="0" id="m_ac${k}"></td></tr>`).join('');
  const ex=[['dAct','Vinculados directos activos',1],['wkMemb','Membresías semanales de tus directos (promedio)',1],['wkMembPts','Puntos promedio por membresía',1],['wkCombo','Recompras de combos semanales (promedio)',1],['wkComboPts','Puntos promedio por combo',1],['weeks','Semanas del mes',1],['dRes','Residual generado por tus directos ($)',1],['acc','Ganancias de red acumuladas ($)',1],['corp','Puntos anuales de actividad VISAIN (beneficio corporativo)',1],['allyDeal','Monto de acuerdo comercial cerrado ($)',1]];
  $('#manBox').innerHTML=`<div class="note" style="margin-top:12px">Escribe lo que pasó este mes en tu organización. Cada fila es un nivel de tu red (1 punto = $1.000).</div><div class="lvtab"><table><tr><th>Nivel</th><th>Pts membresías nuevas</th><th>Pts recompras</th><th>Pts solidarias</th><th>Aliados ($)</th></tr>${rows}</table></div><div class="two" style="margin-top:10px">${ex.map(x=>`<div class="f" style="margin-top:6px"><div class="t"><span>${x[1]}</span></div><input type="number" min="0" id="m_${x[0]}"></div>`).join('')}</div>`;
  for(let k=0;k<7;k++){[['np','newPts'],['rp','recPts'],['dp','donPts'],['ac','allyCOP']].forEach(([p,key])=>{const el=$(`#m_${p}${k}`);el.value=mn[key][k]||'';el.oninput=()=>{mn[key][k]=parseFloat(el.value)||0;schedule();};});}
  ex.forEach(x=>{const el=$('#m_'+x[0]);el.value=mn[x[0]]||'';el.oninput=()=>{mn[x[0]]=parseFloat(el.value)||0;schedule();};});
  $('#manBox').onclick=e=>{const b=e.target.closest('.mini');if(!b)return;const k=+b.dataset.k,i=+b.dataset.i,el=$('#m_np'+k);mn.newPts[k]=(mn.newPts[k]||0)+MEM[i].pts;el.value=mn.newPts[k];schedule();};
  // metas
  $('#goal').value=ST.goal;$('#goal').oninput=()=>{ST.goal=+$('#goal').value;schedule();};
  $('#goalM').value=ST.goalM;$('#goalM').oninput=()=>{ST.goalM=+$('#goalM').value;schedule();};
  // info bonos
  const chips=a=>`<div class="ch">${a.map((p,i)=>`<span>N${i+1} <em>${Math.round(p*100)}%</em></span>`).join('')}</div>`;
  const pc=(k,t,body)=>{const b=BON.find(x=>x.k===k);return `<div class="pc"><h3><i style="background:${b.c}"></i>${b.e} ${t}</h3>${body}</div>`;};
  $('#pcts').innerHTML=
   pc('vd','1. Venta directa',`Ganas entre el <b>20% y el 50%</b> (según tu membresía) sobre el precio público de lo que vendes, más la ganancia de cada combo. Requiere estar activo.`)+
   pc('imp','2. Bono Impulso',`Hasta 7 niveles sobre las <b>compras de membresías</b> de tu organización. Pago mensual.${chips(IMP)}`)+
   pc('res','3. Bono Residual',`Sobre las <b>recompras</b> de tu red. Niveles 1-2 desde el inicio · 3-4 con 2 directos activos · 5-7 con 3 directos activos.${chips(RES)}`)+
   pc('camp','4. Campaña Five',`Semanal (lunes a domingo): membresías o recompras de combos de tus directos: de 1 a 4 personas = <b>6%</b> de los puntos; 5 o más = <b>10%</b>.`)+
   pc('ayu','5. Ayudando y Ganando',`Compras de productos para causas sociales (no aplican descuento). Requiere Empresario Calificado.${chips(AYU)}`)+
   pc('rng','6. Bono de Rangos',`Cada rango se alcanza al acumular ganancias: Aire $3,125 M · Tierra $6,25 M (<b>+$300.000</b>) · Fuego $12,5 M · Agua $25 M · Diamante $50 M (<b>+$5.000.000</b>).`)+
   pc('igu','7. Bono de Igualación',`Porcentaje adicional del <b>residual</b> que generan tus directos: <b>Fuego 5%</b> · <b>Agua 10%</b> · <b>Diamante 20%</b>. Pago mensual, activo y calificado.`)+
   pc('ali','8. Aliado Comercial',`Sobre las compras de los aliados comerciales y además <b>10%</b> si cierras el acuerdo.${chips(ALI)}`)+
   pc('corp','Beneficio corporativo',`<b>Infinity 1%</b> (primeros 500) y <b>Fundador Oro 2%</b> (primeros 200) de la actividad anual en puntos. Requiere 180 pts de recompra y 3 directos activos.`);
  $('#diam').innerHTML=DIAM.map(d=>`<div class="dm"><b>💎 ${d[0]}</b>${d[1]}<br>${d[2]}<br><em>${d[3]}</em></div>`).join('');
}

/* ===== UI: resultados ===== */
let raf=0;function schedule(){if(!raf)raf=requestAnimationFrame(()=>{raf=0;render();save();});}
const counters=new WeakMap();
function countTo(el,to,fmt){const from=counters.get(el)||0;counters.set(el,to);const t0=performance.now(),D=650;
  if(el._r)cancelAnimationFrame(el._r);
  const step=t=>{const u=Math.min(1,(t-t0)/D),e=1-Math.pow(1-u,3);el.textContent=fmt(from+(to-from)*e);if(u<1)el._r=requestAnimationFrame(step);};el._r=requestAnimationFrame(step);}
const tip=$('#tip');
function showTip(e,html){tip.innerHTML=html;tip.style.display='block';const w=tip.offsetWidth,x=Math.min(innerWidth-w-8,e.clientX+14);tip.style.left=Math.max(8,x)+'px';tip.style.top=(e.clientY+14)+'px';}
function hideTip(){tip.style.display='none';}

function render(){
  const sim=ST.mode==='sim',mem=MEM[ST.M];
  document.querySelectorAll('#mem .mc').forEach(c=>c.classList.toggle('on',+c.dataset.i===ST.M));
  $('#memInfo').innerHTML=`<b>${mem.n}</b> · inversión <b>${money(mem.inv)}</b> · ${fmtN(mem.pts)} puntos · ${Math.round(mem.pct*100)}% de ganancia directa · recompra mínima <b>${mem.rec} pts</b>`;
  $('#qual').checked=ST.qual;
  document.querySelectorAll('#modeSeg button').forEach(b=>b.classList.toggle('on',b.dataset.m===ST.mode));
  $('#simBox').style.display=sim?'block':'none';$('#manBox').style.display=sim?'none':'block';$('#tlBox').style.display=sim?'block':'none';
  syncSliders('personal',ST,'p_');syncSliders('sim',ST,'s_');syncSliders('adv',ST,'v_');
  PRD.forEach(p=>{const r=$('#r_rt_'+p.k);r.value=ST.retail[p.k];r.style.setProperty('--p',ST.retail[p.k]/60*100+'%');$('#o_rt_'+p.k).textContent=ST.retail[p.k]+' u · '+mshort(ST.retail[p.k]*p.p);});
  COMBOS.forEach((c,i)=>{const r=$('#r_cb_'+i);r.value=ST.combos[i];r.style.setProperty('--p',ST.combos[i]*10+'%');$('#o_cb_'+i).textContent=ST.combos[i]+' · '+mshort(ST.combos[i]*c.gan[ST.M]);});
  const mt=ST.mix.reduce((a,b)=>a+b,0)||1;MEM.forEach((m,i)=>{const r=$('#r_mx'+i);r.value=ST.mix[i];r.style.setProperty('--p',ST.mix[i]+'%');$('#o_mx'+i).textContent=Math.round(ST.mix[i]/mt*100)+'%';});
  $('#goalOut').textContent=money(ST.goal);$('#goalMOut').textContent='mes '+ST.goalM;
  $('#goal').style.setProperty('--p',(ST.goal-5e5)/(5e7-5e5)*100+'%');$('#goalM').style.setProperty('--p',(ST.goalM-3)/33*100+'%');
  document.querySelectorAll('#hz button').forEach(b=>b.classList.toggle('on',+b.dataset.h===ST.hz));

  let rows=null,r,acc;
  if(sim){rows=simulate(ST,36);if(ST.month>36)ST.month=36;r=rows[ST.month-1];acc=r.acc;}
  else{r=manualResult();acc=ST.man.acc;}
  const total=r.total;
  $('#heroLbl').textContent=sim?`Ingreso estimado en el mes ${ST.month}`:'Ingreso del mes según tus datos';
  countTo($('#total'),total,money);
  const ri=rankIdx(acc),people=sim?r.people.reduce((a,b)=>a+b,0):null;
  let chips=`<span class="chip ${r.act?'ok':'bad'}">${r.act?'✔ Activo':'✘ Inactivo'}</span><span class="chip">${mem.e} ${mem.n}</span><span class="chip">📅 Al año <b>${mshort(total*12)}</b></span>`;
  if(sim){chips+=`<span class="chip">👥 Red <b>${fmtN(people)}</b> personas</span><span class="chip">💰 Acumulado <b>${mshort(r.acc)}</b></span>`;}
  chips+=`<span class="chip">${ri>=0?RANKS[ri].e+' Rango '+RANKS[ri].n:'🌱 Sin rango aún'}</span>`;
  $('#heroChips').innerHTML=chips;
  $('#warns').innerHTML=r.w.map(x=>`<div class="warn">⚠ ${esc(x)}</div>`).join('');

  // donut
  const C=2*Math.PI*70,segs=BON.map(b=>({b,v:r.L[b.k]})),pos=segs.filter(s=>s.v>0);let cum=0;
  $('#donutSub').textContent=sim?`Mes ${ST.month}`:'Mes real';
  $('#donut').innerHTML=`<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="26"/>${
    pos.map(s=>{const len=Math.max(0,s.v/total*C);const g=pos.length>1?Math.min(2.5,len*.4):0;const h=`<circle class="seg" data-k="${s.b.k}" cx="100" cy="100" r="70" fill="none" stroke="${s.b.c}" stroke-width="26" stroke-dasharray="${Math.max(0,len-g)} ${C-Math.max(0,len-g)}" stroke-dashoffset="${-cum}"/>`;cum+=len;return h;}).join('')}</svg>
    <div class="mid"><span>Total</span><b>${mshort(total)}</b></div>`;
  $('#donut').querySelectorAll('.seg').forEach(c=>{const k=c.dataset.k;c.onmousemove=e=>{const b=BON.find(x=>x.k===k);showTip(e,`<b>${b.e} ${b.n}</b><div><span>Valor</span><span>${money(r.L[k])}</span></div><div><span>Del total</span><span>${(r.L[k]/total*100).toFixed(1)}%</span></div>`);hl(k,true);};c.onmouseleave=()=>{hideTip();hl(k,false);};});
  $('#leg').innerHTML=BON.map(b=>`<div class="lg ${r.L[b.k]>0?'':'zero'}" data-k="${b.k}"><i style="background:${b.c}"></i><span>${b.e} ${b.n}</span><span><b>${money(r.L[b.k])}</b><small>${total>0?(r.L[b.k]/total*100).toFixed(0)+'%':'0%'}</small></span></div>`).join('');

  // línea de tiempo
  if(sim){
    const H=ST.hz,W=720,Hh=230,ml=46,mb=24,mt2=10,bw=(W-ml)/H,max=niceMax(Math.max(...rows.slice(0,H).map(x=>x.total),1));
    let s=`<svg viewBox="0 0 ${W} ${Hh}">`;
    for(let i=0;i<=4;i++){const y=mt2+(Hh-mb-mt2)*(1-i/4);s+=`<line x1="${ml}" x2="${W}" y1="${y}" y2="${y}" stroke="rgba(255,255,255,.1)"/><text x="${ml-6}" y="${y+3}" text-anchor="end">${mshort(max*i/4)}</text>`;}
    rows.slice(0,H).forEach((x,i)=>{let y=Hh-mb;const bx=ml+i*bw+bw*.14,w=bw*.72;
      BON.forEach(b=>{const v=x.L[b.k];if(v<=0)return;const h=v/max*(Hh-mb-mt2);y-=h;s+=`<rect class="bar" data-m="${x.m}" x="${bx}" y="${y}" width="${w}" height="${Math.max(.5,h)}" fill="${b.c}" rx="1.5"/>`;});
      if(x.m===ST.month)s+=`<rect x="${ml+i*bw+bw*.06}" y="${mt2}" width="${bw*.88}" height="${Hh-mb-mt2}" fill="rgba(255,215,106,.14)" stroke="#ffd76a" rx="4" pointer-events="none"/>`;
      if(H<=12||x.m%(H>24?4:2)===0)s+=`<text x="${bx+w/2}" y="${Hh-8}" text-anchor="middle">${x.m}</text>`;});
    $('#timeline').innerHTML=s+'</svg>';
    $('#timeline').querySelectorAll('.bar').forEach(b=>{const m=+b.dataset.m;b.onclick=()=>{ST.month=m;schedule();};
      b.onmousemove=e=>{const x=rows[m-1];showTip(e,`<b>Mes ${m}</b>`+BON.filter(q=>x.L[q.k]>0).map(q=>`<div><span>${q.e} ${q.n}</span><span>${mshort(x.L[q.k])}</span></div>`).join('')+`<div><b>Total</b><b>${money(x.total)}</b></div>`);};b.onmouseleave=hideTip;});
    const cumH=rows.slice(0,H).reduce((a,x)=>a+x.total,0);
    $('#tlNote').innerHTML=`Acumulado en ${H} meses: <b style="color:#ffd76a">${money(cumH)}</b> · toca una barra para ver ese mes.`;
  }

  // niveles
  const lvMax=Math.max(1,...r.lvl.map(l=>l.imp+l.res+l.ayu+l.ali));
  $('#lvl').innerHTML=r.lvl.map((l,k)=>{const t=l.imp+l.res+l.ayu+l.ali;const part=(v,c)=>v>0?`<i style="width:${v/lvMax*100}%;background:${c}"></i>`:'';
    return `<div class="lv"><span>Nivel ${k+1}${sim?`<br><small>👥 ${fmtN(r.people[k])}</small>`:''}</span><div class="bar">${part(l.imp,'#e08a1a')}${part(l.res,'#a66cff')}${part(l.ayu,'#3ddc97')}${part(l.ali,'#ff8a5c')}</div><b>${mshort(t)}</b></div>`;}).join('')+
    `<div class="note">🟧 Impulso · 🟪 Residual · 🟩 Ayudando y Ganando · 🟥 Aliado comercial</div>`;

  // rangos
  $('#rankSub').textContent='Ganancias acumuladas: '+mshort(acc);
  $('#ranks').innerHTML=RANKS.map((x,i)=>`<div class="rk ${i<=ri?'done':(i===ri+1?'next':'')}"><div class="e">${x.e}</div><div class="n">${x.n}</div><div class="m">${x.t}</div><div class="g">${mshort(x.th)}${x.bonus?`<br>🎁 +${mshort(x.bonus)}`:''}</div></div>`).join('');
  const nx=RANKS[ri+1],prev=ri>=0?RANKS[ri].th:0;
  $('#prog').style.width=(nx?Math.min(100,(acc-prev)/(nx.th-prev)*100):100)+'%';
  $('#rankNote').innerHTML=nx?`Te faltan <b style="color:#ffd76a">${money(nx.th-acc)}</b> en ganancias para el rango <b>${nx.n}</b>.`:'🏆 ¡Alcanzaste el rango Diamante! El siguiente nivel son los rangos Diamante Ejecutivo e Imperial.';

  // meta
  goalCalc(rows);
  window.__last={total,L:r.L,sim,month:ST.month,acc,people};
}
function niceMax(v){const p=Math.pow(10,Math.floor(Math.log10(v))),n=v/p;return(n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10)*p;}
function hl(k,on){const el=document.querySelector(`.lg[data-k="${k}"]`);if(el)el.classList.toggle('hl',on);}
document.addEventListener('mouseover',e=>{const l=e.target.closest('.lg');if(!l)return;const k=l.dataset.k;document.querySelectorAll('#donut .seg').forEach(c=>c.style.strokeWidth=c.dataset.k===k?'31':'26');});
document.addEventListener('mouseout',e=>{if(e.target.closest&&e.target.closest('.lg'))document.querySelectorAll('#donut .seg').forEach(c=>c.style.strokeWidth='26');});

function goalCalc(rows){
  const el=$('#goalRes');
  if(ST.mode!=='sim'){el.innerHTML='<span style="color:#cbb8f5">Cambia a <b>Proyección</b> para calcular cuántas personas necesitas para llegar a tu meta.</span>';return;}
  const S=Object.assign({},ST);let found=null;
  for(let a=0;a<=200;a+=.5){S.a=a;const rr=simulate(S,ST.goalM)[ST.goalM-1];if(rr.total>=ST.goal){found=a;break;}}
  if(found===null){el.innerHTML=`Con tu configuración actual no llegas a <b>${money(ST.goal)}</b> en el mes ${ST.goalM}, ni patrocinando 200 personas al mes. Sube la <b>duplicación</b> (nuevas por persona), la recompra por persona o elige una membresía mayor.`;return;}
  const rr=simulate(Object.assign({},ST,{a:found}),ST.goalM)[ST.goalM-1];
  el.innerHTML=found===0?`✔ Con tu estructura actual ya superas <b>${money(ST.goal)}</b> en el mes ${ST.goalM}.`:
   `Para ganar <b>${money(ST.goal)}</b> en el mes <b>${ST.goalM}</b> necesitas patrocinar unas <b>${found%1?found.toFixed(1):found} personas por mes</b> (≈ ${fmtN(found*ST.goalM)} directos en total). Tu red llegaría a <b>${fmtN(rr.people.reduce((a,b)=>a+b,0))}</b> personas y ganarías unos <b>${money(rr.total)}</b> ese mes.`;
}

/* ===== botones ===== */
$('#bReset').onclick=()=>{if(confirm('¿Volver a los valores iniciales?')){ST=DEF();$('#modeSeg').querySelector('button');buildStatic();render();save();}};
$('#bPrint').onclick=()=>window.print();
$('#bCopy').onclick=async()=>{const x=window.__last;if(!x)return;const m=MEM[ST.M];
  let t=`CALCULADORA DE BONOS · VISAIN INTERNATIONAL\nMembresía: ${m.n}\n${x.sim?'Proyección · mes '+x.month:'Mes real'}\n\n`+BON.filter(b=>x.L[b.k]>0).map(b=>`${b.n}: ${money(x.L[b.k])}`).join('\n')+`\n\nTOTAL DEL MES: ${money(x.total)}\nAl año: ${money(x.total*12)}\n\nSimulación ilustrativa. Las ganancias dependen del esfuerzo individual y de los términos y condiciones vigentes.`;
  try{await navigator.clipboard.writeText(t);$('#bCopy').textContent='✔ Copiado';setTimeout(()=>$('#bCopy').textContent='📋 Copiar resumen',1600);}catch(e){prompt('Copia el resumen:',t);}};

/* ===== fondo: polvo dorado ===== */
(function(){const cv=$('#fx'),cx=cv.getContext('2d');let W,H,D=Math.min(2,devicePixelRatio||1),P=[];
  const rs=()=>{W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;cx.setTransform(D,0,0,D,0,0);P=Array.from({length:Math.min(110,Math.round(W*H/14000))},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2+.6,v:Math.random()*14+5,p:Math.random()*6.28,s:Math.random()+.5}));};
  rs();addEventListener('resize',rs);if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const spr=document.createElement('canvas');spr.width=spr.height=32;const g=spr.getContext('2d'),gr=g.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'rgba(255,250,225,1)');gr.addColorStop(.25,'rgba(255,205,80,.9)');gr.addColorStop(1,'rgba(255,190,60,0)');g.fillStyle=gr;g.fillRect(0,0,32,32);
  let t0=performance.now();(function f(t){const dt=Math.min(.05,(t-t0)/1000);t0=t;cx.clearRect(0,0,W,H);cx.globalCompositeOperation='lighter';
    for(const p of P){p.y-=p.v*dt;p.x+=Math.sin(t/1400*p.s+p.p)*8*dt;if(p.y<-10){p.y=H+10;p.x=Math.random()*W;}const a=.25+.55*Math.abs(Math.sin(t/900*p.s+p.p)),s=p.r*7;cx.globalAlpha=a*.7;cx.drawImage(spr,p.x-s/2,p.y-s/2,s,s);}
    cx.globalAlpha=1;requestAnimationFrame(f);})(t0);})();

buildStatic();render();
window.__calc={calc,simulate,ST:()=>ST,MEM,render};
})();
