/* Calculadora de bonos, Catálogo, Liquidar producto y liquidación imprimible */
(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const nf=n=>(+n||0).toLocaleString('es-CO',{maximumFractionDigits:2});
const money=n=>(n<0?'-':'')+'$'+Math.round(Math.abs(n||0)).toLocaleString('es-CO');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const load=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v?Object.assign(d,v):d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const MN=['Semilla','Emprendedor','Impacto','Infinity','Fundador Oro'];
const PK={"Semilla":{A:{"Maxi 3":1,"Mak-Vid":1,"Ether-Ju":1},B:{"Maxi 3":2}},"Emprendedor":{A:{"Maxi 3":3,"Mak-Vid":2,"Slym-Vid":1,"Ether-Ju":1},B:{"Maxi 3":5}},"Impacto":{A:{"Maxi 3":7,"Mak-Vid":4,"Slym-Vid":2,"Ether-Ju":2},B:{"Maxi 3":11}},"Infinity":{A:{"Maxi 3":15,"Mak-Vid":10,"Slym-Vid":5,"Ether-Ju":5},B:{"Maxi 3":26}},"Fundador Oro":{A:{"Maxi 3":10,"Mak-Vid":35,"Slym-Vid":15,"Ether-Ju":15},B:{"Maxi 3":45}}};
const LV={"Bono Impulso":[35,6,3,1,1,1,3],"Bono Residual":[30,6,3,1,1,1,8],"Bono Aliado Comercial":[10,5,5,5,5,5,5]};
const AG=[35,10,2,2,2,2,7],MK=200;
const RG=[["Aire","El Visionario","Visión",3125000,0],["Tierra","El Constructor","Fundamento",6250000,300000],["Fuego","El Impulsor","Acción",12500000,0],["Agua","El Conector","Conexión",25000000,0],["Diamante","El Líder","Excelencia",50000000,5000000]];
const RD=[{n:"Diamante Ejecutivo",ap:"El Estratega",lema:"Liderazgo",base:"Ser Diamante",req:[["Diamantes directos",2]],premio:"Viaje Nacional para 2 personas",m:10000000},{n:"Diamante Embajador",ap:"El Representante",lema:"Influencia",base:"Ser Diamante Ejecutivo",req:[["Diamantes en el nivel 1",4],["Diamantes en el nivel 2",2]],premio:"Viaje Internacional para 2 personas",m:20000000},{n:"Diamante Éter",ap:"El Trascendente",lema:"Trascendencia",base:"Ser Diamante Ejecutivo",req:[["Diamantes en el nivel 1",6],["Diamantes en el nivel 2",4],["Diamantes en el nivel 3",2]],premio:"Crucero para 2 personas",m:20000000},{n:"Diamante Imperial",ap:"El Maestro",lema:"Legado",base:"Ser Diamante Ejecutivo",req:[["Diamantes en el nivel 1",8],["Diamantes en el nivel 2",6],["Diamantes en el nivel 3",4],["Diamantes en el nivel 4",2]],premio:"Automóvil",m:20000000},{n:"Diamante Imperial Dorado",ap:"La Leyenda",lema:"Legado Eterno",base:"Ser Diamante Ejecutivo",req:[["Diamantes en el nivel 1",10],["Diamantes en el nivel 2",8],["Diamantes en el nivel 3",6],["Diamantes en el nivel 4",4],["Diamantes en el nivel 5",2]],premio:"Camioneta (o cuota inicial de apartamento)",m:30000000}];
const BR={"Venta directa":"Es tu ganancia por vender los productos al precio público, habiéndolos comprado al precio de empresario. Se liquida sobre los <b>PUNTOS</b> del producto (1 punto = $1.000), no sobre su precio: puntos × porcentaje de tu membresía (20% Semilla, 25% Emprendedor, 30% Impacto, 40% Infinity y 50% Fundador Oro). Ejemplo: Maxi 3 tiene 125 puntos; con Fundador Oro (50%) ganas $62.500 por caja. Maxi Kids no aplica descuento.","Bono Impulso":"Se paga por las compras de <b>membresías</b> de tu organización, hasta 7 niveles (35%, 6%, 3%, 1%, 1%, 1% y 3%). Cada punto equivale a $1.000 COP. Pago mensual automático.","Bono Residual":"Se paga únicamente por las <b>RECOMPRAS</b> de tu organización, en 7 niveles (30%, 6%, 3%, 1%, 1%, 1% y 8%). Niveles 1 y 2 desde el inicio con empresario activo; niveles 3 y 4 exigen activo y calificado con 2 vinculados directos; niveles 5, 6 y 7 con 3 vinculados directos.","Bono Campaña Five":"Bonificación semanal (lunes a domingo) sobre los puntos de las membresías, o de las recompras de combos, que ingresan tus vinculados directos en la semana: <b>6%</b> cuando ingresan de 1 a 4 personas y <b>10%</b> desde 5 personas.","Bono Ayudando y Ganando":"Compensación por la gestión y apoyo en la compra de productos de causas sociales (Maxi Kids, 200 puntos por caja), en 7 niveles (35%, 10%, 2%, 2%, 2%, 2% y 7%). Requiere ser empresario calificado.","Bono Aliado Comercial":"Se distribuye por las compras en aliados comerciales, en 7 niveles: 10% el nivel 1 y 5% cada uno de los niveles 2 a 7. El empresario que concreta el acuerdo recibe el 10%. Aplican términos y condiciones.","Bono de Rangos":"Reconocimiento por acumular ganancias de red (Aire $3.125.000, Tierra $6.250.000, Fuego $12.500.000, Agua $25.000.000 y Diamante $50.000.000) y, desde Diamante, por construir la estructura de Diamantes que exige cada rango Diamante.","Bono de Igualación":"Porcentaje adicional del bono residual generado por tus directos, según tu rango: 5% Fuego, 10% Agua y 20% Diamante. Requiere tener el rango, estar activo y calificado."};
const BONOS=[['Venta directa','🛒'],['Bono Impulso','🚀'],['Bono Residual','🔁'],['Bono Campaña Five','🖐'],['Bono Ayudando y Ganando','💛'],['Bono Aliado Comercial','🤝'],['Bono de Rangos','🏆'],['Bono de Igualación','⚖️']];

/* ---------- datos del catálogo (editables) ---------- */
const DEFC=()=>({prod:[{id:'p1',name:'Maxi 3',price:250000,pts:125,nod:0},{id:'p2',name:'Mak-Vid',price:120000,pts:60,nod:0},{id:'p3',name:'Slym-Vid',price:140000,pts:70,nod:0},{id:'p4',name:'Ether-Ju',price:170000,pts:85,nod:0},{id:'p5',name:'Maxi Kids',price:200000,pts:200,nod:1}],
 mem:{"Semilla":{inv:350000,pts:190,pct:20,rec:140},"Emprendedor":{inv:980000,pts:500,pct:25,rec:140},"Impacto":{inv:1980000,pts:1300,pct:30,rec:140},"Infinity":{inv:5000000,pts:3000,pct:40,rec:280},"Fundador Oro":{inv:10000000,pts:6500,pct:50,rec:280}},n:6});
let CAT=load('visainCat2',DEFC());
const pp=p=>(p.pts!==''&&p.pts!=null&&!isNaN(+p.pts))?+p.pts:(+p.price||0)/2000;
const pct=(p,m)=>p.nod?0:(+CAT.mem[m].pct||0);
const dscPts=(p,m)=>pp(p)*pct(p,m)/100;           /* puntos de descuento por caja */
const final=(p,m)=>(+p.price||0)-dscPts(p,m)*1000;  /* precio que paga el empresario */
const byId=id=>CAT.prod.find(p=>p.id==id)||CAT.prod[0];
const byName=n=>CAT.prod.find(p=>p.name==n);
const opts=(arr,sel)=>arr.map(a=>`<option value="${esc(a[0])}"${a[0]==sel?' selected':''}>${esc(a[1])}</option>`).join('');
const prodOpts=sel=>opts(CAT.prod.map(p=>[p.id,p.name]),sel);
const memOpts=sel=>opts(MN.map(m=>[m,m]),sel);

/* ---------- liquidación acumulada ---------- */
let SUM=load('visainSum2',{items:[],who:''});
function sumRender(){const t=SUM.items.reduce((a,x)=>a+x.v,0);const e=$('#sumTot');if(e)e.innerHTML=SUM.items.length?`<b>${money(t)}</b> · ${SUM.items.length} bono(s)`:'';
  const box=$('#sumBox');if(!box)return;
  box.innerHTML=SUM.items.length?`<div class="tw"><table><tr><th>Concepto</th><th class="r">Valor</th><th></th></tr>${SUM.items.map((x,i)=>`<tr><td>${esc(x.n)}</td><td class="r">${money(x.v)}</td><td><button class="x" data-del="${i}" title="Quitar">×</button></td></tr>`).join('')}<tr class="big"><td>Total a liquidar</td><td class="r">${money(t)}</td><td></td></tr></table></div>`:'<p class="mut" style="margin:0">Aún no has sumado ningún bono. Calcula uno y pulsa «Sumar a la liquidación».</p>';
  box.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{SUM.items.splice(+b.dataset.del,1);save('visainSum2',SUM);sumRender();});}
function addSum(n,v,dt){SUM.items.push({n,v,dt});save('visainSum2',SUM);sumRender();const b=$('#sumBox');if(b)b.scrollIntoView({behavior:'smooth',block:'nearest'});}
function printDoc(title,who,rowsHtml,total,extra){const logo=($('.logo img')||{}).src||'';
  $('#pa').innerHTML=`<div class="tt"><div><h1>${esc(title)}</h1><div class="res2">${esc(who||'')}${who?' · ':''}${new Date().toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'})}</div></div><img src="${logo}" alt=""></div>${rowsHtml}${total!=null?`<div class="tot">Total: ${money(total)}</div>`:''}${extra||''}<div class="fn">Valor del punto: $1.000 COP. Documento informativo generado con el simulador de VISAIN International; los valores son estimados y están sujetos al plan de compensación vigente, a la calificación del periodo y al ciclo de pagos establecido.</div>`;
  document.body.classList.add('printing');setTimeout(()=>{try{window.print()}catch(e){}setTimeout(()=>document.body.classList.remove('printing'),400)},80);}

/* ====================== CATÁLOGO ====================== */
function catEdit(){
  $('#catProd').innerHTML=CAT.prod.map((p,i)=>`<tr><td><input type="text" data-i="${i}" data-f="name" value="${esc(p.name)}"></td><td><input type="number" data-i="${i}" data-f="price" value="${p.price}" step="1000" min="0"></td><td><input type="number" data-i="${i}" data-f="pts" value="${p.pts}" step="5" min="0"></td><td style="text-align:center"><input type="checkbox" data-i="${i}" data-f="nod" ${p.nod?'':'checked'} title="Marca si el descuento de membresía aplica a este producto"></td><td><button class="x" data-del="${i}" title="Eliminar">×</button></td></tr>`).join('');
  $('#catProd').querySelectorAll('input').forEach(el=>el.oninput=()=>{const p=CAT.prod[+el.dataset.i],f=el.dataset.f;if(f=='name')p.name=el.value;else if(f=='nod')p.nod=el.checked?0:1;else p[f]=el.value===''?'':+el.value;
    if(f=='price'&&!p._ptsEdited&&false){}save('visainCat2',CAT);catCalc();liqRender();calRender();});
  $('#catProd').querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{if(CAT.prod.length<2)return;CAT.prod.splice(+b.dataset.del,1);save('visainCat2',CAT);catEdit();catCalc();liqFill();liqRender();calFillProd();calRender();});
  $('#catMem').innerHTML=MN.map(m=>{const x=CAT.mem[m];return `<tr><td><b>${m}</b></td>`+['inv','pts','pct','rec'].map(f=>`<td><input type="number" data-m="${m}" data-f="${f}" value="${x[f]}" min="0" step="${f=='pct'?1:f=='inv'?10000:10}"></td>`).join('')+'</tr>'}).join('');
  $('#catMem').querySelectorAll('input').forEach(el=>el.oninput=()=>{CAT.mem[el.dataset.m][el.dataset.f]=+el.value||0;save('visainCat2',CAT);catCalc();liqRender();calRender();});
}
function catCalc(){
  $('#catMat').innerHTML=`<tr><th>Producto</th><th class="r">Precio público</th><th class="r">Puntos</th>${MN.map(m=>`<th class="r">${m}<br>${CAT.mem[m].pct}%</th>`).join('')}</tr>`+CAT.prod.map(p=>`<tr><td><b>${esc(p.name)}</b>${p.nod?' <span class="mut">(sin descuento)</span>':''}</td><td class="r">${money(p.price)}</td><td class="r">${nf(pp(p))}</td>${MN.map(m=>`<td class="r">${money(final(p,m))}<br><small class="okc">ganas ${money(p.price-final(p,m))}</small></td>`).join('')}</tr>`).join('');
  $('#catPk').innerHTML=MN.map(m=>['A','B'].map(o=>{const it=PK[m][o];let pub=0,cost=0,pts=0,box=0,miss=[];
    const lis=Object.keys(it).map(n=>{const p=byName(n);if(!p){miss.push(n);return `${it[n]}× ${n}`}pub+=it[n]*p.price;cost+=it[n]*final(p,m);pts+=it[n]*pp(p);box+=it[n];return `${it[n]}× ${n}`}).join(' · ');
    return `<tr><td><b>${m}</b></td><td>Opción ${o}</td><td>${lis}${miss.length?' <span class="warn">(falta en catálogo: '+miss.join(', ')+')</span>':''}</td><td class="r">${box}</td><td class="r">${nf(pts)}</td><td class="r">${money(pub)}</td><td class="r">${money(cost)}</td><td class="r okc">${money(pub-cost)}</td></tr>`}).join('')).join('');
}
/* ====================== LIQUIDAR PRODUCTO ====================== */
let LQ=load('visainLiqP',{mem:'Semilla',who:'',lines:[{pid:'p1',q:2}],pay:''});
function liqFill(){const sel=$('#lqM');sel.innerHTML=memOpts(LQ.mem);
  $('#lqL').innerHTML=LQ.lines.map((l,i)=>{if(!CAT.prod.find(p=>p.id==l.pid))l.pid=CAT.prod[0].id;return `<tr><td><select data-i="${i}" data-f="pid">${prodOpts(l.pid)}</select></td><td><input type="number" min="0" data-i="${i}" data-f="q" value="${l.q}" style="max-width:90px"></td><td><button class="x" data-del="${i}">×</button></td></tr>`}).join('');
  $('#lqL').querySelectorAll('[data-f]').forEach(el=>el.oninput=()=>{LQ.lines[+el.dataset.i][el.dataset.f]=el.dataset.f=='q'?(+el.value||0):el.value;save('visainLiqP',LQ);liqRender();});
  $('#lqL').querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{LQ.lines.splice(+b.dataset.del,1);if(!LQ.lines.length)LQ.lines.push({pid:CAT.prod[0].id,q:1});save('visainLiqP',LQ);liqFill();liqRender();});}
function liqCalc(){let cj=0,pts=0,pub=0,pay=0,dp=0,gan=0;const rows=LQ.lines.filter(l=>l.q>0).map(l=>{const p=byId(l.pid),f=final(p,LQ.mem),d=dscPts(p,LQ.mem);cj+=l.q;pts+=pp(p)*l.q;pub+=p.price*l.q;pay+=f*l.q;dp+=d*l.q;gan+=(p.price-f)*l.q;return{p,q:l.q,pts:pp(p),pc:pct(p,LQ.mem),d,f,tot:f*l.q,g:(p.price-f)*l.q}});return{rows,cj,pts,pub,pay,dp,gan};}
function liqRender(){if(!$('#lqR'))return;const r=liqCalc(),m=CAT.mem[LQ.mem];
  $('#lqR').innerHTML=`<div class="res"><div class="k">Total a pagar · ${esc(LQ.mem)} (${m.pct}%)</div><div class="v">${money(r.pay)}</div><div class="mut" style="margin-top:4px">${nf(r.cj)} caja(s) · ${nf(r.pts)} puntos de producto · descuento total ${nf(r.dp)} pts = ${money(r.dp*1000)}</div></div>
  <div class="tw"><table><tr><th>Producto</th><th class="r">Cajas</th><th class="r">Pts/caja</th><th class="r">Descuento</th><th class="r">Desc. en pts</th><th class="r">Precio final/caja</th><th class="r">Total</th><th class="r">Ganas al vender</th></tr>${r.rows.map(x=>`<tr><td><b>${esc(x.p.name)}</b></td><td class="r">${nf(x.q)}</td><td class="r">${nf(x.pts)}</td><td class="r">${x.p.nod?'<span class="mut">no aplica</span>':x.pc+'%'}</td><td class="r">${nf(x.d)} = ${money(x.d*1000)}</td><td class="r">${money(x.f)}</td><td class="r"><b>${money(x.tot)}</b></td><td class="r okc">${money(x.g)}</td></tr>`).join('')}<tr class="big"><td>Totales</td><td class="r">${nf(r.cj)}</td><td class="r">${nf(r.pts)}</td><td></td><td class="r">${nf(r.dp)} = ${money(r.dp*1000)}</td><td class="r">Público ${money(r.pub)}</td><td class="r">${money(r.pay)}</td><td class="r">${money(r.gan)}</td></tr></table></div>
  <div class="note"><b>¿Cómo se liquida?</b> Puntos del producto × % de tu membresía = puntos de descuento (1 punto = $1.000). Precio final = precio público − descuento. Si lo vendes al precio público, esa diferencia es tu <b>venta directa</b>${r.rows.some(x=>x.p.nod)?'. Los productos «sin descuento» (Maxi Kids) se pagan al precio público y no generan ganancia por venta directa':''}.</div>`;
  const pv=+LQ.pay||0;$('#lqPay2').innerHTML=pv?`${nf(pv)} puntos = <b>${money(pv*1000)}</b>`:'';}
function liqText(){const r=liqCalc();return `Liquidación de producto · ${LQ.who||''}\nMembresía: ${LQ.mem} (${CAT.mem[LQ.mem].pct}%)\n`+r.rows.map(x=>`${x.q} × ${x.p.name}: ${x.pts} pts, descuento ${x.p.nod?'no aplica':x.pc+'%'} → ${money(x.f)} c/u = ${money(x.tot)}`).join('\n')+`\nTOTAL A PAGAR: ${money(r.pay)} (${nf(r.cj)} cajas · ${nf(r.pts)} pts)\nGanancia si vendes al público: ${money(r.gan)}`;}
/* ====================== CALCULADORA ====================== */
let CS=load('visainCal2',{mem:'Semilla',who:'',bono:'Venta directa',a:true,q:true,dd:3,lv:{},vd:[{pid:'p1',q:2}],cf:{tipo:'mem',txt:'3x190'},rg:{g:0,ri:'',base:false,n:[0,0,0,0,0]},ig:{pct:5,txt:'2x300000'}});
const mk7=()=>['','','','','','',''];
function calRender(){if(!$('#calIn'))return;calInputs();calResult();}
function calFillProd(){}
function pv(t){const out=[];String(t||'').split(/[;\s]+/).filter(Boolean).forEach(tk=>{let m=tk.match(/^(\d+)[x×*]([\d.,]+)$/i),n=1,v;if(m){n=+m[1];v=m[2]}else v=tk;v=+String(v).replace(/[.,]/g,'');if(v>0&&n>0)out.push({n,v});});return out;}
function calInputs(){const b=CS.bono,box=$('#calIn');let h='';
  const chk=`<div class="row2" style="margin-top:0"><label class="ck"><input type="checkbox" id="cA" ${CS.a?'checked':''}> Empresario activo</label><label class="ck"><input type="checkbox" id="cQ" ${CS.q?'checked':''}> Empresario calificado</label></div>`;
  if(b=='Venta directa'){h=`<label class="l">Tu membresía (define el % de ganancia)</label><select id="cM">${memOpts(CS.mem)}</select><label class="l">Productos que vendiste</label><div id="cVd">${CS.vd.map((l,i)=>`<div class="row2" style="margin:5px 0"><select data-i="${i}" data-f="pid" style="flex:1">${prodOpts(l.pid)}</select><input type="number" min="0" data-i="${i}" data-f="q" value="${l.q}" style="width:90px" placeholder="cajas"><button class="x" data-del="${i}">×</button></div>`).join('')}</div><button class="btn sm" id="cVdAdd">+ Agregar producto</button>`}
  else if(LV[b]||b=='Bono Ayudando y Ganando'){const L=LV[b]||AG,ag=b=='Bono Ayudando y Ganando';CS.lv[b]=CS.lv[b]||mk7();
    h=`<p class="mut" style="margin:0 0 6px;font-size:13px">${ag?'Escribe <b>cajas de Maxi Kids</b> por persona de cada nivel.':'Escribe los <b>puntos</b> de cada persona del nivel.'} Varias personas separadas por espacio. Atajo: <b>4x500</b> = 4 personas con 500 puntos.</p>`;
    if(!ag&&b=='Bono Impulso')h+=`<div class="chips">${MN.map(m=>`<span class="chp" data-add="${CAT.mem[m].pts}">${m} ${nf(CAT.mem[m].pts)}</span>`).join('')}<span class="mut" style="font-size:12px;align-self:center">← toca para agregar al nivel que estás editando</span></div>`;
    if(b=='Bono Residual')h+=`<label class="l">Vinculados directos activos que tienes</label><select id="cDd"><option value="0" ${CS.dd<2?'selected':''}>0 o 1 → niveles 1-2</option><option value="2" ${CS.dd==2?'selected':''}>2 → niveles 1-4</option><option value="3" ${CS.dd>=3?'selected':''}>3 o más → 7 niveles</option></select><p class="mut" style="margin:6px 0 0;font-size:12.5px">Recompras desde ${CAT.mem[CS.mem].rec} pts (mínimo de ${CS.mem}). Ejemplo: <b>10x140</b></p>`;
    h+=L.map((p,i)=>`<div class="lvr"><span>Nivel ${i+1}</span><b>${p}%</b><input type="text" data-lv="${i}" value="${esc(CS.lv[b][i])}" placeholder="${ag?'ej. 3x2':'ej. 4x500'}"></div>`).join('');}
  else if(b=='Bono Campaña Five'){h=`<label class="l">¿Qué ingresó esta semana?</label><select id="cFt"><option value="mem" ${CS.cf.tipo=='mem'?'selected':''}>Membresías de mis directos</option><option value="combo" ${CS.cf.tipo=='combo'?'selected':''}>Recompras de combos de mis directos</option></select><label class="l">Puntos de cada persona (ej. 3x190 500 1300)</label><input type="text" id="cFx" value="${esc(CS.cf.txt)}"><div class="chips">${MN.map(m=>`<span class="chp" data-addcf="${CAT.mem[m].pts}">${m} ${nf(CAT.mem[m].pts)}</span>`).join('')}<span class="chp" data-addcf="140">Active 140</span><span class="chp" data-addcf="280">Active Plus 280</span></div>`}
  else if(b=='Bono de Rangos'){const rg=CS.rg;h=`<label class="l">Ganancias de red acumuladas ($)</label><input type="number" id="rG" value="${rg.g||''}" step="100000" min="0" placeholder="ej. 8000000"><div class="chips">${RG.map(x=>`<span class="chp" data-rg="${x[3]}">${x[0]} ${money(x[3])}</span>`).join('')}</div><label class="l">Rango Diamante a evaluar (opcional)</label><select id="rI"><option value="">— ninguno —</option>${RD.map((r,i)=>`<option value="${i}" ${rg.ri===String(i)?'selected':''}>${r.n}</option>`).join('')}</select>`;
    if(rg.ri!==''){const r=RD[+rg.ri];h+=`<label class="ck"><input type="checkbox" id="rB" ${rg.base?'checked':''}> ${r.base}</label>`+r.req.map((q,k)=>`<label class="l">${q[0]} (requiere ${q[1]})</label><input type="number" min="0" data-rn="${k}" value="${rg.n[k]||''}">`).join('')}}
  else{h=`<label class="l">Tu rango</label><select id="iP"><option value="5" ${CS.ig.pct==5?'selected':''}>Fuego · 5%</option><option value="10" ${CS.ig.pct==10?'selected':''}>Agua · 10%</option><option value="20" ${CS.ig.pct==20?'selected':''}>Diamante · 20%</option></select><label class="l">Bono residual que generó cada directo ($) — ej. 2x300000</label><input type="text" id="iX" value="${esc(CS.ig.txt)}">`}
  box.innerHTML=`<div class="g2"><div class="card" style="margin:0">${chk}${h}</div><div class="card" style="margin:0"><h3>¿Cómo se liquida?</h3><div class="note" style="margin:0">${BR[b]}</div></div></div>`;
  /* eventos */
  $('#cA').onchange=e=>{CS.a=e.target.checked;calSave()};$('#cQ').onchange=e=>{CS.q=e.target.checked;calSave()};
  const M=$('#cM');if(M)M.onchange=()=>{CS.mem=M.value;calSave()};
  $$('#cVd [data-f]').forEach(el=>el.oninput=()=>{CS.vd[+el.dataset.i][el.dataset.f]=el.dataset.f=='q'?(+el.value||0):el.value;calSave(1)});
  $$('#cVd [data-del]').forEach(x=>x.onclick=()=>{CS.vd.splice(+x.dataset.del,1);if(!CS.vd.length)CS.vd.push({pid:CAT.prod[0].id,q:1});calSave()});
  const ad=$('#cVdAdd');if(ad)ad.onclick=()=>{CS.vd.push({pid:CAT.prod[0].id,q:1});calSave()};
  let lastLv=0;$$('[data-lv]').forEach(el=>{el.onfocus=()=>lastLv=+el.dataset.lv;el.oninput=()=>{CS.lv[b][+el.dataset.lv]=el.value;calSave(1)}});
  $$('[data-add]').forEach(c=>c.onclick=()=>{const el=$(`[data-lv="${lastLv}"]`);CS.lv[b][lastLv]=((el.value.trim()?el.value.trim()+' ':'')+c.dataset.add);calSave()});
  const dd=$('#cDd');if(dd)dd.onchange=()=>{CS.dd=+dd.value;calSave(1)};
  const ft=$('#cFt');if(ft)ft.onchange=()=>{CS.cf.tipo=ft.value;calSave(1)};const fx=$('#cFx');if(fx)fx.oninput=()=>{CS.cf.txt=fx.value;calSave(1)};
  $$('[data-addcf]').forEach(c=>c.onclick=()=>{CS.cf.txt=(CS.cf.txt.trim()?CS.cf.txt.trim()+' ':'')+c.dataset.addcf;calSave()});
  const rG=$('#rG');if(rG)rG.oninput=()=>{CS.rg.g=+rG.value||0;calSave(1)};$$('[data-rg]').forEach(c=>c.onclick=()=>{CS.rg.g=+c.dataset.rg;calSave()});
  const rI=$('#rI');if(rI)rI.onchange=()=>{CS.rg.ri=rI.value;calSave()};const rB=$('#rB');if(rB)rB.onchange=()=>{CS.rg.base=rB.checked;calSave(1)};
  $$('[data-rn]').forEach(el=>el.oninput=()=>{CS.rg.n[+el.dataset.rn]=+el.value||0;calSave(1)});
  const iP=$('#iP');if(iP)iP.onchange=()=>{CS.ig.pct=+iP.value;calSave(1)};const iX=$('#iX');if(iX)iX.oninput=()=>{CS.ig.txt=iX.value;calSave(1)};
}
function calSave(soft){save('visainCal2',CS);if(soft)calResult();else calRender();}
let LASTR=[];
function calc(){const b=CS.bono,m=CAT.mem[CS.mem],res={t:b,cop:0,pts:0,det:[],info:[],cond:[],why:'',pot:0,items:null};const A=CS.a,Q=CS.q;
  const ck=(ok,t)=>res.cond.push((ok?'✔ ':'✖ ')+t);
  if(b=='Venta directa'){let cj=0,pt=0;CS.vd.forEach(l=>{const p=byId(l.pid);if(!p||!l.q)return;const g1=p.nod?0:pp(p)*1000*pct(p,CS.mem)/100,g=g1*l.q;cj+=l.q;pt+=pp(p)*l.q;res.cop+=g;res.det.push([p.name,l.q+' caja(s)',`${nf(pp(p))} pts × ${p.nod?0:m.pct}% × $1.000 = ${money(g1)} c/u · compras a ${money(final(p,CS.mem))}, vendes a ${money(p.price)}`,p.nod?'—':m.pct+'%',g]);if(p.nod)res.info.push(p.name+' no aplica descuento: sin ganancia por venta directa.')});
    res.res=[['Membresía',CS.mem+' · '+m.pct+'%'],['Cajas vendidas',nf(cj)],['Puntos vendidos',nf(pt)],['Regla','Puntos × % × $1.000']];ck(A,'Vinculado activo y cumplo el código de ética');if(!A)res.why='No aplica: exige ser vinculado activo y cumplir el código de ética.';}
  else if(LV[b]||b=='Bono Ayudando y Ganando'){const ag=b=='Bono Ayudando y Ganando',L=LV[b]||AG,lv=CS.lv[b]||mk7();let lim=7,pn=0,base=0,pts=0;
    if(b=='Bono Residual'){const ld=CS.dd>=3?7:CS.dd>=2?4:2;lim=ld;if(ld<7)res.info.push(`Niveles ${ld+1} a 7 no cuentan: faltan vinculados directos.`);if(!Q&&lim>2){res.info.push(`Niveles 3 a ${lim} no cuentan: exigen empresario activo y calificado.`);lim=2}if(!A)res.why='No aplica: el Residual exige ser empresario activo.';ck(A,'Empresario activo');ck(Q,'Empresario calificado');res.cond.push(`Vinculados directos: ${CS.dd>=3?'3 o más':CS.dd>=2?'2':'0 o 1'} → cuentan los niveles 1 a ${lim}`);
      const lowRec=pv(lv.join(' ')).filter(x=>x.v<m.rec).length;if(lowRec)res.info.push(`Ojo: hay ${lowRec} recompra(s) por debajo del mínimo de ${m.rec} pts de ${CS.mem}.`);}
    if(ag){if(!Q)res.why='No aplica: este bono exige ser empresario calificado.';ck(Q,'Empresario calificado')}
    for(let i=0;i<L.length&&i<lim;i++){const it=pv(lv[i]);let n=0,c=0;it.forEach(x=>{n+=x.n;c+=x.n*x.v});if(!c)continue;const bs=ag?c*MK:c,g=bs*L[i]/100;pn+=n;base+=bs;pts+=g;res.det.push(['Nivel '+(i+1),n+' persona(s)',ag?`${nf(c)} cajas de Maxi Kids (${nf(bs)} puntos)`:`${nf(bs)} puntos`,L[i]+'%',g*1000])}
    res.cop=pts*1000;res.pts=pts;res.res=[['Empresarios que generan puntos',nf(pn)],['Puntos generados por tu red',nf(base)],['Puntos de pago',nf(pts)],['Valor del punto','$1.000 COP']];}
  else if(b=='Bono Campaña Five'){const it=pv(CS.cf.txt);let np=0,tp=0;it.forEach(x=>{np+=x.n;tp+=x.n*x.v});const p=np>=5?10:6;res.pts=tp*p/100;res.cop=res.pts*1000;
    it.forEach(x=>res.det.push([x.n>1?x.n+' personas':'1 persona',x.n+'',`${nf(x.n*x.v)} puntos`,p+'%',x.n*x.v*p/100*1000]));
    res.res=[['Tipo',CS.cf.tipo=='combo'?'Recompras de combos':'Membresías'],['Personas en la semana',nf(np)],['Porcentaje aplicado',`${p}% (${np>=5?'5 o más personas':'1 a 4 personas'})`],['Puntos generados',nf(tp)],['Puntos de pago',nf(res.pts)]];
    res.cond.push((np>=5?'✔ ':'• ')+np+' persona(s) → '+p+'%');if(np<1)res.why='No aplica: se necesita al menos 1 persona en la semana.';if(np>0&&np<5)res.info.push(`Con ${5-np} persona(s) más en la semana el porcentaje sube al 10%.`);}
  else if(b=='Bono de Rangos'){res.rango=true;const g=+CS.rg.g||0;let cur=null,nx=RG[0];RG.forEach((x,i)=>{if(g>=x[3]){cur=x;nx=RG[i+1]||null}});
    res.items=[];res.info.push('Rango por ganancias de red: '+(cur?`${cur[0]} · ${cur[1]} «${cur[2]}»`:'aún sin rango')+'. '+(nx?`Te faltan ${money(nx[3]-g)} para ${nx[0]} (${money(nx[3])}).`:'Rango máximo por ganancias alcanzado.'));
    if(cur&&cur[4]){res.cop+=cur[4];res.det.push(['Rango '+cur[0]+' «'+cur[2]+'»','','Premio en dinero + reconocimiento (entrevista · Noche de Estrellas)','',cur[4]])}else if(cur)res.info.push('La presentación no indica bono en dinero para el rango '+cur[0]+'.');
    if(CS.rg.ri!==''){const r=RD[+CS.rg.ri];let ok=!!CS.rg.base;res.cond.push((CS.rg.base?'✔ ':'✖ ')+r.base);r.req.forEach((q,k)=>{const v=+CS.rg.n[k]||0,y=v>=q[1];if(!y)ok=false;res.cond.push(`${y?'✔':'✖'} ${q[0]}: ${v} de ${q[1]}`)});
      if(ok){res.cop+=r.m;res.det.push([r.n+' «'+r.lema+'»','','Premio: '+r.premio,'',r.m])}else res.info.push('Aún no cumples todos los requisitos de '+r.n+'.')}
    if(!A){res.pot=res.cop;res.cop=0;res.why='Marcaste que no estás activo en este periodo.'}
    res.res=[['Ganancias de red acumuladas',money(g)]];}
  else{const it=pv(CS.ig.txt),p=CS.ig.pct;let np=0,tt=0;it.forEach(x=>{np+=x.n;tt+=x.n*x.v;res.det.push([x.n>1?x.n+' directos':'1 directo',x.n+'',`${money(x.n*x.v)}${x.n>1?` (${x.n}×${money(x.v)})`:''}`,p+'%',x.n*x.v*p/100])});res.cop=tt*p/100;
    res.res=[['Directos',nf(np)],['Residual generado por tus directos',money(tt)],['Porcentaje adicional',p+'%']];ck(A&&Q,'Activo y calificado en el rango indicado');if(!(A&&Q))res.why='No aplica: la Igualación exige estar activo y calificado en el rango indicado.';}
  if(res.why&&!res.rango){res.pot=res.cop;res.cop=0;res.pts=0}
  return res;}
function calResult(){const r=calc();LASTR=r;const b=CS.bono;
  const det=r.det.length?`<div class="tw"><table><tr><th>Concepto</th><th>Personas</th><th>Base</th><th class="r">%</th><th class="r">Pago</th></tr>${r.det.map(x=>`<tr><td>${esc(x[0])}</td><td>${esc(x[1])}</td><td>${esc(x[2])}</td><td class="r">${x[3]}</td><td class="r"><b>${money(x[4])}</b></td></tr>`).join('')}</table></div>`:'<p class="mut">Completa los datos para ver el detalle.</p>';
  $('#calOut').innerHTML=`<div class="res"><div class="k">${esc(b)}${r.why?' · no aplica':''}</div><div class="v">${money(r.cop)}</div>${r.pts?`<div class="mut">${nf(r.pts)} puntos de pago × $1.000</div>`:''}${r.why?`<div class="warn" style="margin-top:6px">${esc(r.why)}${r.pot?` Habrías generado ${money(r.pot)}.`:''}</div>`:''}</div>${det}
  ${r.res?`<div class="tw"><table>${r.res.map(x=>`<tr><td class="mut">${esc(x[0])}</td><td class="r"><b>${esc(x[1])}</b></td></tr>`).join('')}</table></div>`:''}
  ${r.cond.length?`<div class="note">${r.cond.map(esc).join('<br>')}</div>`:''}${r.info.length?`<div class="note">${r.info.map(esc).join('<br>')}</div>`:''}
  <div class="row2"><button class="btn gold sm" id="cAdd" ${r.cop>0?'':'disabled style="opacity:.5"'}>➕ Sumar a la liquidación</button></div>`;
  const a=$('#cAdd');if(a)a.onclick=()=>{if(r.cop>0)addSum(b+(b=='Venta directa'?' · '+CS.mem:''),r.cop,r.det)};}
function calHead(){$('#calB').innerHTML=BONOS.map(x=>`<button data-b="${x[0]}" class="${x[0]==CS.bono?'on':''}">${x[1]} ${x[0].replace('Bono ','').replace('de ','')}</button>`).join('');
  $$('#calB button').forEach(bt=>bt.onclick=()=>{CS.bono=bt.dataset.b;save('visainCal2',CS);calHead();calRender();});}
/* ====================== HTML ====================== */
function build(){
  const tabs=document.createElement('div');tabs.id='tabs';
  tabs.innerHTML=`<a class="tab" href="../../index.html" title="Inicio">🏠</a><button class="tab" data-t="pres">🎬 Presentación</button><button class="tab" data-t="cal">🧮 Calculadora de bonos</button><button class="tab" data-t="cat">📦 Catálogo</button><button class="tab" data-t="liq">🧾 Liquidar producto</button><span class="sp"></span><span class="tot" id="sumTot"></span>`;
  document.body.insertBefore(tabs,document.body.firstChild);
  const pa=document.createElement('div');pa.id='pa';document.body.appendChild(pa);
  const host=document.createElement('div');host.innerHTML=`
<div class="pg" id="pgCal"><div class="wrap"><h2>🧮 Calculadora de bonos</h2><p class="sub">Elige el bono, escribe lo que genera cada nivel y ve cuánto se liquida. Usa las mismas reglas del plan (1 punto = $1.000). Lo que sumes queda en la liquidación acumulada, que puedes imprimir.</p>
 <div class="bsel" id="calB"></div><div id="calIn" style="margin-bottom:14px"></div>
 <div class="g2"><div class="card" style="margin:0"><h3>Resultado</h3><div id="calOut"></div></div>
 <div class="card" style="margin:0"><h3>Liquidación acumulada</h3><label class="l">A nombre de</label><input type="text" id="sumWho" placeholder="Nombre del empresario"><div id="sumBox" style="margin-top:8px"></div><div class="row2"><button class="btn gold sm" id="sumPrint">🖨 Imprimir liquidación</button><button class="btn sm" id="sumClr">Vaciar</button></div>
 <h3 style="margin-top:16px">Puntos ↔ dinero</h3><div class="row2" style="margin:0"><input type="number" id="cvP" placeholder="Puntos" style="width:48%"><input type="number" id="cvC" placeholder="Pesos ($)" style="width:48%"></div><p class="mut" id="cvO" style="margin:6px 0 0;font-size:13px">1 punto = $1.000 COP</p></div></div></div></div>
<div class="pg" id="pgCat"><div class="wrap"><h2>📦 Catálogo</h2><p class="sub">Productos, precios, puntos y descuentos por membresía. Todo es editable y se guarda en este navegador; la calculadora y «Liquidar producto» usan estos mismos valores.</p>
 <div class="card"><h3>Productos</h3><div class="tw"><table><thead><tr><th>Producto</th><th>Precio público ($)</th><th>Puntos</th><th style="text-align:center">¿Aplica descuento?</th><th></th></tr></thead><tbody id="catProd"></tbody></table></div><div class="row2"><button class="btn sm" id="catAdd">+ Agregar producto</button><button class="btn sm" id="catRst">↺ Restaurar valores del plan</button></div></div>
 <div class="card"><h3>Membresías</h3><div class="tw"><table><thead><tr><th>Membresía</th><th>Inversión ($)</th><th>Puntos</th><th>% descuento / ganancia</th><th>Recompra mín. (pts)</th></tr></thead><tbody id="catMem"></tbody></table></div></div>
 <div class="card"><h3>Precio por membresía (lo que paga el empresario y lo que gana por caja)</h3><div class="tw"><table id="catMat"></table></div></div>
 <div class="card"><h3>Paquetes de membresía · Opción A y B</h3><div class="tw"><table><thead><tr><th>Membresía</th><th></th><th>Contenido</th><th class="r">Cajas</th><th class="r">Puntos</th><th class="r">Valor público</th><th class="r">Paga</th><th class="r">Ganancia</th></tr></thead><tbody id="catPk"></tbody></table></div>
 <div class="note"><b>Combos de recompra:</b> Active $350.000 (140 pts) y Active Plus $1.500.000 (280 pts). No suman puntos para rangos ni bonos. <b>Recompra mínima:</b> 140 pts (Semilla, Emprendedor, Impacto) y 280 pts (Infinity, Fundador Oro).</div></div></div></div>
<div class="pg" id="pgLiq"><div class="wrap"><h2>🧾 Liquidar producto</h2><p class="sub">Elige la membresía, el producto y las cajas: te muestra los puntos, el descuento (en puntos y en pesos), el precio final y cuánto ganas al venderlo al público.</p>
 <div class="g2"><div class="card" style="margin:0"><h3>Datos</h3><label class="l">Empresario / cliente</label><input type="text" id="lqW" placeholder="Nombre"><label class="l">Membresía</label><select id="lqM"></select>
  <label class="l">Productos</label><div class="tw"><table><tbody id="lqL"></tbody></table></div><div class="row2"><button class="btn sm" id="lqAdd">+ Agregar producto</button></div>
  <label class="l">Cargar un paquete de membresía</label><div class="row2" style="margin:0"><select id="lqPk" style="flex:1"><option value="A">Opción A</option><option value="B">Opción B</option></select><button class="btn sm" id="lqPkGo">Cargar</button></div>
  <label class="l">Convertir puntos a pesos</label><input type="number" id="lqPay" placeholder="Puntos"><p class="mut" id="lqPay2" style="margin:4px 0 0"></p></div>
 <div class="card" style="margin:0;grid-column:1/-1"><h3>Resultado</h3><div id="lqR"></div><div class="row2"><button class="btn gold sm" id="lqPrint">🖨 Imprimir</button><button class="btn sm" id="lqCopy">📋 Copiar resumen</button><button class="btn sm" id="lqSum">➕ Sumar ganancia a la liquidación</button></div></div></div></div></div>`;
  while(host.firstChild)document.body.insertBefore(host.firstChild,$('#bar'));
}
function wire(){
  $$('#tabs .tab[data-t]').forEach(b=>b.onclick=()=>setTab(b.dataset.t));
  $('#sumWho').value=SUM.who||'';$('#sumWho').oninput=e=>{SUM.who=e.target.value;save('visainSum2',SUM)};
  $('#sumPrint').onclick=()=>{if(!SUM.items.length)return;const t=SUM.items.reduce((a,x)=>a+x.v,0);
    printDoc('Liquidación de bonos',SUM.who,`<table><tr><th>Concepto</th><th class="r">Valor</th></tr>${SUM.items.map(x=>`<tr><td><b>${esc(x.n)}</b>${(x.dt||[]).map(d=>`<div class="res2">${esc(d[0])}${d[1]?' · '+esc(d[1]):''} · ${esc(d[2])}${d[3]?' × '+d[3]:''} = ${money(d[4])}</div>`).join('')}</td><td class="r">${money(x.v)}</td></tr>`).join('')}</table>`,t)};
  $('#sumClr').onclick=()=>{SUM.items=[];save('visainSum2',SUM);sumRender()};
  const cp=$('#cvP'),cc=$('#cvC');cp.oninput=()=>{cc.value=cp.value===''?'':Math.round(+cp.value*1000)};cc.oninput=()=>{cp.value=cc.value===''?'':+(+cc.value/1000).toFixed(2)};
  $('#catAdd').onclick=()=>{CAT.n=(CAT.n||6)+1;CAT.prod.push({id:'p'+CAT.n+Date.now()%1000,name:'Nuevo producto',price:0,pts:0,nod:0});save('visainCat2',CAT);catEdit();catCalc();liqFill();};
  $('#catRst').onclick=()=>{if(!confirm('¿Restaurar productos y membresías a los valores del plan?'))return;CAT=DEFC();save('visainCat2',CAT);catEdit();catCalc();liqFill();liqRender();calRender();};
  $('#lqW').value=LQ.who||'';$('#lqW').oninput=e=>{LQ.who=e.target.value;save('visainLiqP',LQ)};
  $('#lqM').onchange=e=>{LQ.mem=e.target.value;save('visainLiqP',LQ);liqRender()};
  $('#lqAdd').onclick=()=>{LQ.lines.push({pid:CAT.prod[0].id,q:1});save('visainLiqP',LQ);liqFill();liqRender()};
  $('#lqPkGo').onclick=()=>{const it=PK[LQ.mem][$('#lqPk').value];const ls=[];Object.keys(it).forEach(n=>{const p=byName(n);if(p)ls.push({pid:p.id,q:it[n]})});if(ls.length){LQ.lines=ls;save('visainLiqP',LQ);liqFill();liqRender()}};
  $('#lqPay').value=LQ.pay||'';$('#lqPay').oninput=e=>{LQ.pay=e.target.value;save('visainLiqP',LQ);const v=+LQ.pay||0;$('#lqPay2').innerHTML=v?`${nf(v)} puntos = <b>${money(v*1000)}</b>`:''};
  $('#lqPrint').onclick=()=>{const r=liqCalc();printDoc('Liquidación de producto',(LQ.who?LQ.who+' · ':'')+'Membresía '+LQ.mem+' ('+CAT.mem[LQ.mem].pct+'%)',`<table><tr><th>Producto</th><th class="r">Cajas</th><th class="r">Pts/caja</th><th class="r">Descuento</th><th class="r">Precio final</th><th class="r">Total</th></tr>${r.rows.map(x=>`<tr><td>${esc(x.p.name)}</td><td class="r">${nf(x.q)}</td><td class="r">${nf(x.pts)}</td><td class="r">${x.p.nod?'no aplica':x.pc+'% = '+nf(x.d)+' pts ('+money(x.d*1000)+')'}</td><td class="r">${money(x.f)}</td><td class="r">${money(x.tot)}</td></tr>`).join('')}</table><div class="res2">${nf(r.cj)} caja(s) · ${nf(r.pts)} puntos de producto · descuento total ${money(r.dp*1000)} · si se vende al público ganas ${money(r.gan)}</div>`,r.pay)};
  $('#lqCopy').onclick=()=>{const t=liqText();try{navigator.clipboard.writeText(t);$('#lqCopy').textContent='✔ Copiado'}catch(e){prompt('Copia el resumen:',t)}setTimeout(()=>$('#lqCopy').textContent='📋 Copiar resumen',1500)};
  $('#lqSum').onclick=()=>{const r=liqCalc();if(r.gan>0)addSum('Venta directa · '+LQ.mem+' ('+nf(r.cj)+' cajas)',r.gan,r.rows.map(x=>[x.p.name,x.q+' caja(s)',`${nf(x.pts)} pts × ${x.p.nod?0:x.pc}% × $1.000`,x.p.nod?'—':x.pc+'%',x.g]));setTab('cal')};
}
function setTab(t){document.body.dataset.tab=t;$$('#tabs .tab').forEach(b=>b.classList.toggle('on',b.dataset.t==t));try{location.hash=t}catch(e){}
  if(t=='pres')window.dispatchEvent(new Event('resize'));
  if(t=='cal'){calHead();calRender();sumRender()}if(t=='cat'){catEdit();catCalc()}if(t=='liq'){liqFill();liqRender()}
  $$('.pg').forEach(p=>p.scrollTop=0);}
build();wire();sumRender();
const h=(location.hash||'').slice(1);setTab(['cal','cat','liq'].includes(h)?h:'pres');
window.__tools={setTab,CAT:()=>CAT,CS:()=>CS,calc,liqCalc,liqFill,liqRender,get LQ(){return LQ}};
})();
