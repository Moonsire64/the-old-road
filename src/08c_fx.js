/* ================= BATTLE ANIMATIONS (0.21) =================
   Every weapon lands its own way, every enemy attack shows what it is (bites, claws, things spat at you, plain heavy blows),
   and burning, bleeding, poisoned, staggered, humming and stanced foes all show it on their bodies. */
function drawHitFx(f,e){const t=f.t,w=f.w||'sword',big=f.big,A=a=>Math.max(0,a),col=a=>big?`rgba(255,225,130,${a})`:`rgba(240,245,250,${a})`;ctx.lineCap='round';
  const arc=(r,a0,a1,pr,lw)=>{ctx.strokeStyle=col(A(1-pr));ctx.lineWidth=lw;ctx.beginPath();ctx.arc(e.x,e.y,r,a0,a0+(a1-a0)*Math.min(1,pr*2.2));ctx.stroke()};
  const line=(x0,y0,x1,y1,a,lw)=>{ctx.strokeStyle=col(a);ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke()};
  const burst=(n,cols,sp)=>{if(!f.b){f.b=1;for(let i=0;i<n;i++)B.fx.push({k:'spark',t:0,x:e.x+(Math.random()-.5)*16,y:e.y+(Math.random()-.5)*16,vx:(Math.random()-.5)*sp,vy:-sp*.4-Math.random()*sp*.6,c:pick(cols)})}};
  if(w==='dagger'){const pr=t/.28;if(pr>1)return;for(let k=0;k<2;k++){const q=pr*2-k*.6;if(q<0||q>1)continue;const L=6+q*16;line(e.x-22+k*8,e.y+6-k*10,e.x-22+k*8+L,e.y+6-k*10-L*.3,1-q,2)}if(pr>.3)burst(4,['#ffffff','#e8e0d0'],50);return}
  if(w==='spear'||w==='halberd'){const pr=t/.3;if(pr>1)return;const L=(w==='halberd'?44:52)*Math.min(1,pr*2.5);line(e.x-56,e.y+4,e.x-56+L,e.y+4,1-pr,w==='halberd'?3:2);ctx.fillStyle=col(1-pr);ctx.fillRect(e.x-58+L,e.y+1,5,6);
    if(w==='halberd'&&pr>.35)arc(22,-2.4,-.6,(pr-.35)*1.4,3);if(pr>.35)burst(6,['#ffffff','#c8c8c8'],70);return}
  if(w==='mace'||w==='hammer'||w==='flail'){const pr=t/.45;if(pr>1)return;
    if(w==='flail'&&pr<.5)arc(20,-3.6,2.2,pr*1.2,2);
    if(pr>.15){const q=(pr-.15)/.85;ctx.strokeStyle=col(A(1-q));ctx.lineWidth=w==='hammer'?4:3;ctx.beginPath();ctx.ellipse(e.x,e.y+8,8+q*(w==='hammer'?46:34),(8+q*(w==='hammer'?46:34))*.45,0,0,7);ctx.stroke()}
    if(pr>.15)burst(w==='hammer'?14:9,['#a8a090','#8a8070','#ffd870'],90);return}
  if(w==='axe'){const pr=t/.32;if(pr>1)return;line(e.x-20,e.y-26,e.x-20+40*Math.min(1,pr*2.5),e.y-26+44*Math.min(1,pr*2.5),1-pr,4);if(pr>.35)burst(7,['#ffffff','#c8a878','#8a6a44'],70);return}
  if(w==='scythe'){const pr=t/.45;if(pr>1)return;arc(34,-2.6,1.2,pr,3);arc(28,-2.6,1.2,Math.max(0,pr-.08),1);if(pr>.4)burst(6,['#ffffff','#9ac84a'],60);return}
  if(w==='great'){const pr=t/.4;if(pr>1)return;arc(30,-2.9,.9,pr,4);arc(22,-2.9,.9,Math.max(0,pr-.1),2);if(pr>.4)burst(8,['#ffffff','#ffd870'],80);return}
  /* sword: one clean diagonal, with a second fainter trail */
  {const pr=t/.3;if(pr>1)return;const q=Math.min(1,pr*2.4);line(e.x-20,e.y-20,e.x-20+38*q,e.y-20+38*q,1-pr,3);line(e.x-12,e.y-24,e.x-12+34*q,e.y-24+34*q,(1-pr)*.4,1);if(pr>.35)burst(4,['#ffffff'],50)}}

function drawFoeAtkFx(f,e,p){const t=f.t,k=f.k.slice(3),big=f.big;ctx.lineCap='round';
  if(k==='bite'){const pr=t/.35;if(pr>1)return;const o=14*(1-Math.min(1,pr*2.2));ctx.fillStyle=`rgba(255,240,230,${1-pr})`;for(let i=0;i<5;i++){const x=p.x-12+i*6;ctx.beginPath();ctx.moveTo(x,p.y-12-o);ctx.lineTo(x+3,p.y-5-o);ctx.lineTo(x+6,p.y-12-o);ctx.fill();ctx.beginPath();ctx.moveTo(x,p.y+8+o);ctx.lineTo(x+3,p.y+1+o);ctx.lineTo(x+6,p.y+8+o);ctx.fill()}
    if(pr>.45&&!f.b){f.b=1;for(let i=0;i<6;i++)B.fx.push({k:'spark',t:0,x:p.x+(Math.random()-.5)*14,y:p.y,vx:(Math.random()-.5)*50,vy:-20-Math.random()*30,c:'#c83a2a'})}return}
  if(k==='claw'){const pr=t/.3;if(pr>1)return;ctx.strokeStyle=`rgba(255,90,70,${1-pr})`;ctx.lineWidth=big?3:2;const q=Math.min(1,pr*2.5);for(let i=0;i<3;i++){const x=p.x+12-i*7;ctx.beginPath();ctx.moveTo(x,p.y-18);ctx.lineTo(x-16*q,p.y-18+30*q);ctx.stroke()}return}
  if(k==='proj'){const fp=f.f&&f.f.pos||e,pr=t/.32;if(pr>1.4)return;if(pr<=1){const x=fp.x+(p.x-fp.x)*pr,y=fp.y+(p.y-fp.y)*pr-Math.sin(pr*Math.PI)*24;ctx.fillStyle='rgba(170,200,90,.95)';ctx.beginPath();ctx.arc(x,y,big?5:3.5,0,7);ctx.fill()}
    else if(!f.b){f.b=1;for(let i=0;i<10;i++)B.fx.push({k:'spark',t:0,x:p.x,y:p.y,vx:(Math.random()-.5)*60,vy:-20-Math.random()*30,c:pick(['#9ac84a','#c8d870','#6a8a2a'])})}return}
  /* impact: a hard ring where it landed */
  {const pr=t/.35;if(pr>1)return;ctx.strokeStyle=`rgba(255,120,90,${1-pr})`;ctx.lineWidth=big?4:2;ctx.beginPath();ctx.arc(p.x,p.y-2,6+pr*(big?40:24),0,7);ctx.stroke();if(big&&pr<.2){ctx.fillStyle=`rgba(255,255,255,${.35*(1-pr/.2)})`;ctx.fillRect(0,0,W,H)}}}

/* statuses you can see: flames, blood, bubbles, stars, the Colossus's hum, Harrow's stance */
function drawFoeStatusFx(dt){if(!B||!B.foes)return;for(const f of B.foes){if(f.dead||!f.pos||!f.box)continue;const{x,y,w,h}=f.box,cx=x+w/2,st=f.st||{};
  if(st.burn&&Math.random()<.5)B.fx.push({k:'spark',t:.2,x:x+Math.random()*w,y:y+h*(.3+Math.random()*.6),vx:(Math.random()-.5)*10,vy:-30-Math.random()*20,c:pick(['#ffd870','#f08a24','#c8401a'])});
  if(st.bleed&&Math.random()<.18)B.fx.push({k:'spark',t:.1,x:x+w*(.3+Math.random()*.4),y:y+h*.4,vx:0,vy:10,c:'#b81e1e'});
  if(st.poison&&Math.random()<.2)B.fx.push({k:'spark',t:.2,x:x+Math.random()*w,y:y+h*.8,vx:0,vy:-18,c:pick(['#9ac84a','#c8e870'])});
  if(st.stag||st.dazed){for(let i=0;i<3;i++){const a=time*5+i*2.1;ctx.fillStyle='#ffe870';ctx.fillRect(cx+Math.cos(a)*w*.3|0,y-4+Math.sin(a)*3|0,2,2)}}
  if(st.hum){const pr=(time*1.4)%1;ctx.strokeStyle=`rgba(110,176,255,${(1-pr)*.7})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(cx,y+h*.55,w*(.3+pr*.6),h*(.15+pr*.3),0,0,7);ctx.stroke();
    const need=Math.round(f.max*.1),p=Math.min(1,(f.humD||0)/need);ctx.fillStyle='#0a0a12';ctx.fillRect(cx-w*.35,y+h+4,w*.7,4);ctx.fillStyle='#6ab0ff';ctx.fillRect(cx-w*.35,y+h+4,w*.7*p,4)}
  if(st.stblade){ctx.fillStyle=`rgba(232,64,42,${.12+.08*Math.sin(time*6)})`;ctx.fillRect(x,y,w,h)}
  if(st.stshield){ctx.strokeStyle=`rgba(200,210,230,${.4+.2*Math.sin(time*4)})`;ctx.lineWidth=2;ctx.strokeRect(x+2,y+2,w-4,h-4)}
  if(st.hatch&&f.kind==='eggsac')f.shake=Math.max(f.shake,st.hatch<=1?.2:.05)}
  if(B.shake>0){B.shake-=dt}}
