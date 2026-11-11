/* Efectos visuales: polvo dorado y sonidos */
/* ===== FX: río de polvo dorado ===== */
const cv=$('#fx'),cx=cv.getContext('2d');let W=0,H=0,DPR=1;
let circ=null,paths=[],pulses=[],orbs=[],RV=[];
function rs(){DPR=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cx.setTransform(DPR,0,0,DPR,0,0);buildFx();}
const COL={ok:[255,205,80],warn:[255,176,32],red:[255,150,70],over:[255,120,60]};
const sprites={};
function sprite(k){if(sprites[k])return sprites[k];const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),[r,gg,b]=COL[k],gr=g.createRadialGradient(32,32,0,32,32,32);
  gr.addColorStop(0,'rgba(255,255,235,1)');gr.addColorStop(.18,`rgba(${r},${gg},${b},.95)`);gr.addColorStop(.55,`rgba(${r},${gg},${b},.25)`);gr.addColorStop(1,`rgba(${r},${gg},${b},0)`);g.fillStyle=gr;g.fillRect(0,0,64,64);return sprites[k]=c;}
let bokeh=null;
function bokehSprite(){if(bokeh)return bokeh;const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),gr=g.createRadialGradient(64,64,0,64,64,64);
  gr.addColorStop(0,'rgba(255,215,120,.55)');gr.addColorStop(.7,'rgba(255,190,70,.35)');gr.addColorStop(.9,'rgba(255,215,120,.6)');gr.addColorStop(1,'rgba(255,190,70,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);return bokeh=c;}
const CFG={ok:{mul:1,spd:1,glint:.9,rate:5,burst:0},warn:{mul:1.5,spd:1.5,glint:2.4,rate:12,burst:0},red:{mul:2.1,spd:2.1,glint:5.5,rate:24,burst:1},over:{mul:2.8,spd:2.7,glint:9,rate:40,burst:1}};
const rnd=(a,b)=>a+Math.random()*(b-a);
function buildFx(){
  // río
  const N=Math.min(1100,Math.round(W*H/1800));RV=[];
  for(let i=0;i<N;i++){const k=i%7<4?0:(i%7<6?1:2);RV.push({k,u:Math.random(),v:(Math.random()+Math.random()-1),spd:rnd(.018,.05),r:rnd(.8,3.4),ph:Math.random()*6.28,sw:rnd(.6,2)});}
  // bokeh
  orbs=[];for(let i=0;i<16;i++)orbs.push({x:Math.random()*W,y:Math.random()*H,r:rnd(18,80),vx:rnd(-8,8),vy:rnd(-12,-2),a:rnd(.05,.17),ph:Math.random()*6.28});
  // circuitos (lado derecho)
  circ=document.createElement('canvas');circ.width=Math.max(1,W);circ.height=Math.max(1,H);const g=circ.getContext('2d');paths=[];
  g.lineCap='round';g.lineJoin='round';
  const nT=Math.round(8+H/70);
  for(let i=0;i<nT;i++){
    let x=W*rnd(.62,.8),y=rnd(H*.05,H*.95);const pts=[[x,y]];let dir=0;
    while(x<W+20){const L=rnd(40,130);
      if(dir===0){x+=L;}else{const d=rnd(25,70);x+=d;y+=dir*d;}
      pts.push([x,y]);const r=Math.random();dir=r<.35?0:(r<.68?-1:1);if(y<H*.03)dir=1;if(y>H*.97)dir=-1;}
    paths.push(pts);
    g.strokeStyle='rgba(240,180,41,'+rnd(.14,.32).toFixed(2)+')';g.lineWidth=rnd(.8,1.6);g.beginPath();pts.forEach((p,j)=>j?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();
    pts.forEach((p,j)=>{if(j%2===0&&Math.random()<.6){g.fillStyle='rgba(255,215,106,.55)';g.beginPath();g.arc(p[0],p[1],rnd(1.5,3.2),0,6.28);g.fill();
      if(Math.random()<.3){g.strokeStyle='rgba(255,215,106,.4)';g.beginPath();g.arc(p[0],p[1],rnd(5,8),0,6.28);g.stroke();}}});
    let tot=0;pts.forEach((p,j)=>{if(j){tot+=Math.hypot(p[0]-pts[j-1][0],p[1]-pts[j-1][1]);}p[2]=tot;});paths[paths.length-1].len=tot;
  }
  pulses=[];for(let i=0;i<Math.min(28,paths.length*2);i++)pulses.push(newPulse());
}
function newPulse(){const p=paths[Math.floor(Math.random()*paths.length)];return{p,d:p?-Math.random()*p.len:0,v:rnd(90,220)};}
function pulsePos(pl){const pts=pl.p,d=pl.d;if(d<0||d>pts.len)return null;for(let j=1;j<pts.length;j++){if(pts[j][2]>=d){const a=pts[j-1],b=pts[j],t=(d-a[2])/Math.max(1,b[2]-a[2]);return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}}return null;}
function riverY(u,k,t){const ph=k===1?1.3:k===2?2.6:0,sh=k===1?-.12:k===2?.15:0;
  return H*(.72-.42*u+sh)+Math.sin(u*6.28*1.1+t*.5+ph)*H*.09+Math.sin(u*13+t*.9+ph)*H*.02;}
let P=[],G=[],fxPhase='ok',accP=0,accG=0,lastT=performance.now(),nextBurst=0,T=0;
function setFx(ph){if(ph!==fxPhase){fxPhase=ph;if(ph!=='ok'&&view==='timer')burst(ph==='warn'?90:180,ph);}}
function timeBox(){const r=$('#time').getBoundingClientRect();return r.width?r:{left:W*.2,top:H*.3,width:W*.6,height:H*.3};}
function spark(ph){const sp=CFG[ph].spd;P.push({x:Math.random()*W,y:H+10,vx:(Math.random()-.5)*14*sp,vy:-(18+Math.random()*46)*sp,r:1.2+Math.random()*3,l:0,m:3+Math.random()*4,ph:Math.random()*6.28,sw:.6+Math.random()*1.4,k:ph});}
function glint(ph,box){const b=box||timeBox();G.push({x:b.left+Math.random()*b.width,y:b.top+Math.random()*b.height,s:7+Math.random()*(ph==='ok'?12:22),l:0,m:.5+Math.random()*.6,k:ph,rot:Math.random()*.6-.3});}
function burst(n,ph,bx){const b=bx||timeBox(),cxx=b.left+b.width/2,cyy=b.top+b.height/2;
  for(let i=0;i<n;i++){const a=Math.random()*6.28,v=60+Math.random()*340;P.push({x:cxx+(Math.random()-.5)*b.width*.6,y:cyy+(Math.random()-.5)*b.height*.5,vx:Math.cos(a)*v,vy:Math.sin(a)*v-30,r:1.5+Math.random()*3.5,l:0,m:1.2+Math.random()*2,ph:Math.random()*6.28,sw:0,k:ph,drag:1});}
  for(let i=0;i<14;i++)glint(ph,b);}
function frame(t){
  const dt=Math.min(.05,(t-lastT)/1000);lastT=t;T+=dt;cx.clearRect(0,0,W,H);
  if(S.fx===false){P.length=G.length=0;requestAnimationFrame(frame);return;}
  const idle=!S.running&&elapsed()===0,ph=view==='wheel'?'ok':fxPhase,cf=CFG[ph],mul=idle?.6:(S.running?1:.75);
  cx.globalCompositeOperation='lighter';
  const col=COL[ph],cs=`${col[0]},${col[1]},${col[2]}`;
  // bokeh
  const bs=bokehSprite();
  for(const o of orbs){o.x+=o.vx*dt;o.y+=o.vy*dt;if(o.y<-100)o.y=H+100;if(o.x<-100)o.x=W+100;if(o.x>W+100)o.x=-100;
    cx.globalAlpha=o.a*(.7+.3*Math.sin(T*.6+o.ph))*(ph==='ok'?1:1.3);cx.drawImage(bs,o.x-o.r,o.y-o.r,o.r*2,o.r*2);}
  // circuitos
  cx.globalAlpha=.9*Math.min(1,mul+.2);cx.drawImage(circ,0,0,W,H);
  const sp=sprite(ph);
  for(const pl of pulses){pl.d+=pl.v*cf.spd*dt*mul;if(pl.d>pl.p.len+60){Object.assign(pl,newPulse());pl.d=-rnd(0,200);}
    for(let k=0;k<5;k++){const q=pulsePos({p:pl.p,d:pl.d-k*9});if(!q)continue;const s=(16-k*2.4);cx.globalAlpha=(1-k*.18)*.85;cx.drawImage(sp,q[0]-s,q[1]-s,s*2,s*2);}}
  // brillo del río (bandas suaves)
  for(let k=0;k<3;k++){cx.beginPath();for(let i=0;i<=60;i++){const u=i/60,x=u*W*1.1-W*.05,y=riverY(u,k,T);i?cx.lineTo(x,y):cx.moveTo(x,y);}
    cx.strokeStyle=`rgba(${cs},${k?.035:.055})`;cx.lineWidth=H*(k?.06:.09);cx.stroke();
    cx.strokeStyle=`rgba(${cs},${k?.05:.08})`;cx.lineWidth=H*(k?.02:.03);cx.stroke();}
  // partículas del río
  const nVis=Math.round(RV.length*Math.min(1,cf.mul*(idle?.55:.7)));
  for(let i=0;i<nVis;i++){const p=RV[i];p.u+=p.spd*cf.spd*dt*mul;if(p.u>1)p.u-=1;
    const u=p.u,x=u*W*1.1-W*.05,bw=H*(.025+.075*Math.sin(Math.PI*u))*(p.k?.8:1);
    const y=riverY(u,p.k,T)+p.v*bw+Math.sin(T*p.sw+p.ph)*5;
    const env=Math.pow(Math.sin(Math.PI*u),.6),tw=.55+.45*Math.sin(T*(3+p.sw*2)+p.ph),sz=p.r*(4+3*(1-Math.abs(p.v)));
    cx.globalAlpha=Math.min(1,env*tw*(.55+.4*(1-Math.abs(p.v))));cx.drawImage(sp,x-sz/2,y-sz/2,sz,sz);}
  // chispas ascendentes + destellos
  accP+=cf.rate*mul*dt;while(accP>=1){accP--;spark(ph);}
  accG+=cf.glint*mul*dt;while(accG>=1){accG--;glint(ph);}
  if(cf.burst&&S.running&&view==='timer'&&t>nextBurst){nextBurst=t+(ph==='over'?900:1800);burst(ph==='over'?60:30,ph);}
  for(let i=P.length-1;i>=0;i--){const p=P[i];p.l+=dt;if(p.l>p.m||p.y<-20||p.y>H+40){P.splice(i,1);continue;}
    if(p.drag){p.vx*=1-1.8*dt;p.vy=p.vy*(1-1.8*dt)+20*dt;}
    p.x+=(p.vx+Math.sin(p.l*p.sw*2+p.ph)*12*(p.sw?1:0))*dt;p.y+=p.vy*dt;
    const u=p.l/p.m,a=Math.sin(Math.PI*Math.min(1,u))*(.65+.35*Math.sin(p.l*9+p.ph)),sz=p.r*7;
    cx.globalAlpha=Math.max(0,a);cx.drawImage(sprite(p.k),p.x-sz/2,p.y-sz/2,sz,sz);}
  for(let i=G.length-1;i>=0;i--){const g=G[i];g.l+=dt;if(g.l>g.m){G.splice(i,1);continue;}
    const u=g.l/g.m,a=Math.sin(Math.PI*u),L=g.s*(.4+a);
    cx.save();cx.translate(g.x,g.y);cx.rotate(g.rot);cx.globalAlpha=a;
    cx.drawImage(sprite(g.k),-L,-L,L*2,L*2);
    cx.strokeStyle='rgba(255,250,225,.95)';cx.lineWidth=1.4;cx.lineCap='round';cx.beginPath();cx.moveTo(-L*1.6,0);cx.lineTo(L*1.6,0);cx.moveTo(0,-L*1.6);cx.lineTo(0,L*1.6);cx.stroke();
    cx.restore();}
  cx.globalAlpha=1;cx.globalCompositeOperation='source-over';requestAnimationFrame(frame);}
rs();addEventListener('resize',rs);requestAnimationFrame(frame);
