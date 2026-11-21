/* ================= PUZZLES II (0.19) =================
   Three kinds of Zelda-style puzzle, built into the map itself, two per map on top of each map's old puzzle:
   - BLOCK ROOMS: a walled ruin with stone blocks and pressure plates. Push every plate down and the sealed alcove at the back opens.
     Every room is made backwards from the solved state (blocks pulled off their plates), so it always has a solution.
     Got it stuck? The reset stone by the entrance puts every block back.
   - LANTERN RINGS: five lanterns round a stone. Lighting one flips it and both its neighbours. Light all five. (Five in a ring can
     always be solved, whatever the start.)
   - RACE GATES: an iron portcullis over a little vault, and a pressure plate somewhere down the path. Step on the plate and the gate
     opens, but only for as long as a brisk run takes. */

function pzKinds(zi){return[['blocks','race'],['lamps','blocks'],['race','lamps']][zi]||[]}

/* ---- generation (runs inside placeProps, before other props are scattered) ---- */
function buildPuzzles(r,ty){if(LV.kind!=='zone')return;LV.rooms=[];const kinds=pzKinds(LV.zi);
  for(const k of kinds){let ok=false;for(let t=0;t<40&&!ok;t++)ok=k==='blocks'?pzBlocks(r,ty):k==='lamps'?pzLamps(r,ty):pzRace(r,ty)}}
const PZ_BAD=t=>t===BLDG||t===DOOR||t===GATE||t===EXIT||t===FIRE||t===CHEST||t===PROPT||t===BARRIER||t===ENTT||t===BRIDGE||t===IDOOR||isGateT(t);
function pzFree(x0,y0,w,h,pad){for(let y=y0-pad;y<y0+h+pad;y++)for(let x=x0-pad;x<x0+w+pad;x++){if(x<3||y<3||x>=MW-3||y>=MH-3)return false;const q=id(x,y);
    if(PZ_BAD(map[q])||PROPAT[q]||CHESTS[q]||inPocket(x,y))return false}
  if(fires.some(f=>f.x>=x0-4&&f.x<x0+w+4&&f.y>=y0-4&&f.y<y0+h+4))return false;
  if(LV.gates.some(g=>Math.hypot(g.inner.x-(x0+w/2),g.inner.y-(y0+h/2))<w+6))return false;
  if((LV.rooms||[]).some(o=>Math.hypot(o.cx-(x0+w/2),o.cy-(y0+h/2))<24))return false;
  if(LV.start&&Math.hypot(LV.start.x-(x0+w/2),LV.start.y-(y0+h/2))<14)return false;
  if(LV.puzzle&&Math.hypot(LV.puzzle.x-(x0+w/2),LV.puzzle.y-(y0+h/2))<16)return false;
  /* never open a way into somewhere a tool is meant to open */
  if(chests.some(c=>(c.secret||c.veil||c.sealed)&&c.x>=x0-5&&c.x<x0+w+5&&c.y>=y0-5&&c.y<y0+h+5))return false;return true}
const reachCount=s=>{let n=0;for(let i=0;i<s.length;i++)if(s[i])n++;return n};
/* stamp tiles, then make sure nothing that could be reached before has been cut off (else put it all back) */
function pzStamp(cells,connectFrom){const old=cells.map(([x,y])=>map[id(x,y)]),before=flood(true),nb=reachCount(before);
  cells.forEach(([x,y,t])=>map[id(x,y)]=t);
  if(connectFrom){const[cx,cy]=connectFrom;const s0=flood(true);if(!s0[id(cx,cy)]){const held=new Set(cells.map(([x,y])=>id(x,y)));bfsConnect(cx,cy,s0,(a,b)=>held.has(id(a,b))||!!PROPAT[id(a,b)]||PZ_BAD(map[id(a,b)]),(a,b)=>{const q=id(a,b);if(a<1||b<1||a>=MW-1||b>=MH-1)return;const t=map[q];map[q]=t===BOG||t===WATER||t===BRIDGE?BRIDGE:ROAD})}}
  const after=flood(true);let lost=0;for(let i=0;i<before.length;i++)if(before[i]&&!after[i]&&!cells.some(([x,y])=>id(x,y)===i))lost++;
  if(lost>0||(connectFrom&&!after[id(connectFrom[0],connectFrom[1])])){cells.forEach(([x,y],i)=>map[id(x,y)]=old[i]);return false}
  REACH=LV.reach=after;return true}

/* BLOCK ROOM: 11 x 9 walls, entrance in the middle of the bottom wall, sealed 3x2 alcove behind the top wall */
function pzBlocks(r,ty){const W=11,H=9,x0=6+((r()*(MW-W-12))|0),y0=8+((r()*(MH-H-14))|0);
  if(!pzFree(x0,y0-3,W,H+4,1))return false;
  const wallT=ty==='cave'?WALL:ROCKT,cells=[],ex=x0+5,ey=y0+H-1;
  for(let y=y0-3;y<y0+H;y++)for(let x=x0;x<x0+W;x++){let t;
    if(y<y0){/* alcove: walls round a 3x2 pocket */t=(x>=x0+4&&x<=x0+6&&y>=y0-2)?G:wallT}
    else t=(x===x0||x===x0+W-1||y===y0||y===y0+H-1)?wallT:G;
    if(x===ex&&y===ey)t=G;cells.push([x,y,t])}
  /* a pillar or two inside, for something to push round */
  const inner=[];for(let y=y0+1;y<y0+H-1;y++)for(let x=x0+1;x<x0+W-1;x++)inner.push([x,y]);
  const pil=[];for(let k=0;k<1+((r()*2)|0);k++){const[a,b]=inner[(r()*inner.length)|0];if(Math.abs(a-ex)<=1&&b>=y0+H-3)continue;if(a===x0+5&&b===y0+1)continue;pil.push([a,b])}
  for(const[a,b]of pil){const c=cells.find(c=>c[0]===a&&c[1]===b);c[2]=wallT}
  if(!pzStamp(cells,[ex,ey+1]))return false;
  /* plates and blocks, worked out backwards */
  const nB=LV.area.i>=2?3:2,isIn=(x,y)=>x>x0&&x<x0+W-1&&y>y0&&y<y0+H-1&&map[id(x,y)]===G,startP=[ex,ey-1];
  for(let attempt=0;attempt<30;attempt++){const free=inner.filter(([x,y])=>isIn(x,y)&&!(x===startP[0]&&y===startP[1])&&!(x===x0+5&&y===y0+1));
    const plates=[];while(plates.length<nB){const c=free[(r()*free.length)|0];if(!plates.some(p=>p[0]===c[0]&&p[1]===c[1]))plates.push(c)}
    let blocks=plates.map(p=>p.slice()),pl=startP.slice();
    const occ=(x,y)=>blocks.some(b=>b[0]===x&&b[1]===y),reachP=(fx,fy,tx,ty2)=>{const seen=new Set([fx+','+fy]),q=[[fx,fy]];while(q.length){const[a,b]=q.shift();if(a===tx&&b===ty2)return true;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=a+dx,ny=b+dy,k=nx+','+ny;if(seen.has(k)||!isIn(nx,ny)||occ(nx,ny))continue;seen.add(k);q.push([nx,ny])}}return false};
    /* the player starts by pulling from wherever is free near a block */
    let pulls=0;for(let k=0;k<160&&pulls<(nB===3?22:16);k++){const b=blocks[(r()*blocks.length)|0],[dx,dy]=[[1,0],[-1,0],[0,1],[0,-1]][(r()*4)|0],c1=[b[0]+dx,b[1]+dy],c2=[b[0]+2*dx,b[1]+2*dy];
      if(!isIn(...c1)||!isIn(...c2)||occ(...c1)||occ(...c2))continue;if(!reachP(pl[0],pl[1],c1[0],c1[1])&&!(pl[0]===c1[0]&&pl[1]===c1[1]))continue;
      b[0]=c1[0];b[1]=c1[1];pl=c2;pulls++}
    if(blocks.some(b=>plates.some(p=>p[0]===b[0]&&p[1]===b[1])))continue;
    if(blocks.some(b=>b[0]===startP[0]&&b[1]===startP[1]))continue;
    if(!reachP(startP[0],startP[1],pl[0],pl[1]))continue;
    if(blocks.reduce((a,b,i)=>a+Math.abs(b[0]-plates[i][0])+Math.abs(b[1]-plates[i][1]),0)<nB*3)continue;
    const R0={t:'blocks',x0,y0,W,H,cx:x0+5,cy:y0+4,plates,start:blocks.map(b=>b.slice()),done:0};LV.rooms.push(R0);
    R0.bl=blocks.map((b,i)=>addProp('pzblock',b[0],b[1],true,{room:LV.rooms.length-1,i}));
    addProp('pzseal',x0+5,y0,true,{room:LV.rooms.length-1});const c=addChest(x0+5,y0-2,null);c.hoard=1;c.sealed=1;
    const rs=[[ex-1,ey+1],[ex+1,ey+1],[ex-2,ey+1],[ex+2,ey+1]].find(([a,b])=>map[id(a,b)]===G&&!PROPAT[id(a,b)]&&solidOKpz(a,b));if(rs)addProp('pzreset',rs[0],rs[1],true,{room:LV.rooms.length-1});
    return true}
  return true}
function solidOKpz(x,y){const before=flood(true),nb=reachCount(before),o=map[id(x,y)];map[id(x,y)]=PROPT;const n=reachCount(flood(true));map[id(x,y)]=o;return n>=nb-1}

/* LANTERN RING: five lanterns on a circle of radius 3, a carved stone to read */
function pzLamps(r,ty){const cx=10+((r()*(MW-20))|0),cy=10+((r()*(MH-20))|0);if(!pzFree(cx-4,cy-4,9,10,0))return false;
  const pos=[0,1,2,3,4].map(i=>{const a=-Math.PI/2+i*1.2566;return[Math.round(cx+Math.cos(a)*3),Math.round(cy+Math.sin(a)*3)]});
  const cells=[];for(let y=cy-4;y<=cy+5;y++)for(let x=cx-4;x<=cx+4;x++)if(Math.hypot(x-cx,y-cy)<=4.3)cells.push([x,y,ty==='cave'?G:G]);
  if(!pzStamp(cells,[cx,cy+5]))return false;
  let on=[1,1,1,1,1];const press=i=>{for(const j of[i,(i+1)%5,(i+4)%5])on[j]^=1};let n=0;while(n<3||on.every(v=>v)){press((r()*5)|0);n++}
  const R0={t:'lamps',cx,cy,on,done:0};LV.rooms.push(R0);const ri=LV.rooms.length-1;
  pos.forEach(([x,y],i)=>addProp('pzlamp',x,y,true,{room:ri,i}));addProp('pzclue',cx,cy+5,true,{title:'Words cut into a kerb stone',text:'LIGHT ONE AND\nITS NEIGHBOURS ANSWER.\n\nWHEN ALL FIVE BURN,\nTHE STONE WILL GIVE.'});return true}

/* RACE GATE: a 3x3 vault cut into solid ground beside a path, a portcullis across its mouth, a plate 11-17 steps away */
function pzRace(r,ty){const D4=[[1,0],[-1,0],[0,1],[0,-1]];
  for(let tries=0;tries<200;tries++){const ax=6+((r()*(MW-12))|0),ay=6+((r()*(MH-12))|0),a=id(ax,ay);if(!REACH[a]||(map[a]!==G&&map[a]!==ROAD)||inPocket(ax,ay))continue;
    if(!pzFree(ax-1,ay-1,3,3,0))continue;const[dx,dy]=D4[(r()*4)|0],gx=ax+dx,gy=ay+dy,cx=ax+dx*3,cy=ay+dy*3;
    const cells=[[gx,gy]];for(let y=cy-1;y<=cy+1;y++)for(let x=cx-1;x<=cx+1;x++)cells.push([x,y]);cells.push([ax+dx*2,ay+dy*2]);
    if(!cells.every(([x,y])=>x>3&&y>3&&x<MW-4&&y<MH-4&&SOLID_OK(map[id(x,y)])&&!REACH[id(x,y)]&&!PROPAT[id(x,y)]))continue;
    /* sealed all round: nothing reachable may touch the vault except through the gate */
    const inC=(x,y)=>cells.some(c=>c[0]===x&&c[1]===y)||(x===ax&&y===ay);if(!cells.slice(1).every(([x,y])=>[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].every(([p,q])=>inC(x+p,y+q)||(!REACH[id(x+p,y+q)]&&BLOCK[map[id(x+p,y+q)]]))))continue;
    if(chests.some(c=>(c.secret||c.veil||c.sealed)&&Math.hypot(c.x-cx,c.y-cy)<6))continue;
    /* the plate: somewhere reachable, a fair run away along the ground */
    const d=new Int16Array(MW*MH).fill(-1),q=[a];d[a]=0;for(let h=0;h<q.length;h++){const c=q[h];if(d[c]>20)continue;const x=c%MW,y=(c/MW)|0;for(const[ex,ey]of D4){const n=id(x+ex,y+ey);if(d[n]>=0||BLOCK[map[n]])continue;d[n]=d[c]+1;q.push(n)}}
    const opts=[];for(let i=0;i<d.length;i++)if(d[i]>=11&&d[i]<=17&&map[i]===G&&!PROPAT[i]&&!CHESTS[i])opts.push(i);if(!opts.length)continue;
    const pi=opts[(r()*opts.length)|0],pdist=d[pi];
    const wall=ty==='cave'?WALL:ROCKT;cells.forEach(([x,y])=>map[id(x,y)]=G);
    const R0={t:'race',cx,cy,gx,gy,px:pi%MW,py:(pi/MW)|0,dur:+(pdist*T/60*1.45+1.6).toFixed(1),open:0,done:0};LV.rooms.push(R0);const ri=LV.rooms.length-1;
    addProp('pzgate',gx,gy,true,{room:ri});addProp('pzplate',R0.px,R0.py,false,{room:ri});const c=addChest(cx,cy,null);c.hoard=1;c.sealed=1;return true}
  return false}

/* ---- props ---- */
Object.assign(NEWP,{
  pzblock:{u:()=>0,draw:(p,bx,by)=>{const ox=(p.ax||0),oy=(p.ay||0),x=Math.round(bx-8+ox),y=Math.round(by-16+oy),R0=LV.rooms[p.room],on=R0&&R0.plates.some(q=>q[0]===p.tx&&q[1]===p.ty);
    ctx.fillStyle='#0a0908';ctx.fillRect(x,y,16,16);ctx.fillStyle=on?'#8a8270':'#6a645a';ctx.fillRect(x+1,y+1,14,14);ctx.fillStyle=on?'#a8a088':'#847c70';ctx.fillRect(x+1,y+1,14,4);
    ctx.fillStyle='#4a4640';ctx.fillRect(x+1,y+12,14,3);ctx.fillStyle='#3a3630';ctx.fillRect(x+4,y+7,8,1);ctx.fillRect(x+7,y+5,1,5);if(on){ctx.fillStyle='#ffd870';ctx.fillRect(x+7,y+8,2,2)}}},
  pzseal:{u:p=>LV.rooms[p.room]&&LV.rooms[p.room].done?0:1,use:async()=>{amb('A slab of stone set into the wall. It won\'t move. There\'s a mechanism under the floor.',2400)},
    draw:(p,bx,by)=>{const x=Math.round(bx-8),y=Math.round(by-22);ctx.fillStyle='#0a0908';ctx.fillRect(x,y,16,22);ctx.fillStyle='#5a5448';ctx.fillRect(x+1,y+1,14,20);ctx.fillStyle='#7a7266';ctx.fillRect(x+1,y+1,14,3);ctx.fillStyle='#c9a24b';ctx.fillRect(x+6,y+8,4,4);ctx.fillStyle='#3a3630';ctx.fillRect(x+7,y+9,2,2)}},
  pzreset:{u:p=>LV.rooms[p.room]&&!LV.rooms[p.room].done?2:0,use:async p=>{const R0=LV.rooms[p.room];if(!R0||R0.done)return;
      if(R0.bl.some((b,i)=>Math.abs(P.x-(R0.start[i][0]*T+8))<12&&Math.abs(P.y-(R0.start[i][1]*T+12))<12)){amb('Step clear of where the blocks go back to.',2000);return}
      R0.bl.forEach((b,i)=>pzMoveBlock(b,R0.start[i][0],R0.start[i][1],true));SFX.thud();cam.shake=.2;amb('The floor grinds, and every block slides back to where it started.',2600)},
    draw:(p,bx,by)=>{const x=Math.round(bx-5),y=Math.round(by-12);ctx.fillStyle='#0a0908';ctx.fillRect(x,y,10,12);ctx.fillStyle='#6a645a';ctx.fillRect(x+1,y+1,8,10);ctx.fillStyle='#c9a24b';ctx.fillRect(x+3,y+3,4,1);ctx.fillRect(x+3,y+5,1,3);ctx.fillRect(x+6,y+5,1,3);ctx.fillRect(x+3,y+8,4,1)}},
  pzlamp:{u:p=>LV.rooms[p.room]&&LV.rooms[p.room].done?0:2,use:async p=>{const R0=LV.rooms[p.room];if(!R0||R0.done)return;for(const j of[p.i,(p.i+1)%5,(p.i+4)%5])R0.on[j]^=1;R0.on[p.i]?SFX.ignite():SFX.hiss();
      if(R0.on.every(v=>v)){R0.done=1;rec('puzzles',1);setTimeout(()=>{SFX.chime();pzChest(R0.cx,R0.cy);amb('All five burn. The stone between them gives.',3000)},500)}},
    draw:(p,bx,by)=>{const R0=LV.rooms[p.room],lit=R0&&R0.on[p.i],x=Math.round(bx),y=Math.round(by);ctx.fillStyle='#0a0908';ctx.fillRect(x-2,y-16,5,16);ctx.fillStyle='#4a4640';ctx.fillRect(x-1,y-15,3,15);
      ctx.fillStyle='#0a0908';ctx.fillRect(x-4,y-21,9,7);ctx.fillStyle=lit?'#ffd870':'#2a2622';ctx.fillRect(x-3,y-20,7,5);if(lit){ctx.fillStyle='#fff4c0';ctx.fillRect(x-1,y-19,3,3);if(Math.random()<.05)particles.push({x:p.x,y:p.y-14,vx:(Math.random()-.5)*6,vy:-14,g:0,life:.6,c:'#ffd870',w:'spark'})}}},
  pzgate:{u:p=>LV.rooms[p.room]&&!LV.rooms[p.room].open?1:0,use:async()=>{amb('A portcullis, rusted down into its slot. There must be a way to raise it.',2400)},
    draw:(p,bx,by)=>{const R0=LV.rooms[p.room];if(R0&&R0.open)return;const x=Math.round(bx-8),y=Math.round(by-20);ctx.fillStyle='#0a0a0c';ctx.fillRect(x,y,16,20);for(let i=0;i<4;i++){ctx.fillStyle='#5a6068';ctx.fillRect(x+1+i*4,y+1,2,19);ctx.fillStyle='#8a9098';ctx.fillRect(x+1+i*4,y+1,1,19)}ctx.fillStyle='#5a6068';ctx.fillRect(x,y+6,16,2);ctx.fillRect(x,y+13,16,2)}},
  pzplate:{u:()=>0,flat:(p,x,y)=>{const R0=LV.rooms[p.room],down=R0&&R0.open>0;ctx.fillStyle='#0a0908';ctx.fillRect(x-6,y-5,12,10);ctx.fillStyle=down?'#5a5448':'#7a7266';ctx.fillRect(x-5,y-4,10,8);ctx.fillStyle=down?'#c9a24b':'#9a9080';ctx.fillRect(x-2,y-1,4,2)}}
});

/* ---- pushing blocks ---- */
let pushT=0,pushDir=null;
function pzMoveBlock(b,nx,ny,instant){delete PROPAT[id(b.tx,b.ty)];map[id(b.tx,b.ty)]=G;const ox=(b.tx-nx)*T,oy=(b.ty-ny)*T;b.tx=nx;b.ty=ny;b.x=nx*T+8;b.y=ny*T+8;PROPAT[id(nx,ny)]=b;map[id(nx,ny)]=PROPT;
  if(!instant){b.ax=ox;b.ay=oy}else{b.ax=0;b.ay=0}}
function pzPush(vx,vy,dt){if(!LV.rooms||!LV.rooms.length){pushT=0;return}const ax=Math.abs(vx),ay=Math.abs(vy);if(Math.max(ax,ay)<.5){pushT=0;return}
  const d=ax>ay?[Math.sign(vx),0]:[0,Math.sign(vy)],ptx=Math.floor(P.x/T),pty=Math.floor((P.y-3)/T),bt=PROPAT[id(ptx+d[0],pty+d[1])];
  if(!bt||bt.t!=='pzblock'){pushT=0;return}const R0=LV.rooms[bt.room];if(!R0||R0.done){pushT=0;return}
  /* must be pressed right up against it */
  const edge=d[0]?Math.abs((bt.tx*T+8)-P.x):Math.abs((bt.ty*T+8)-(P.y-4));if(edge>14){pushT=0;return}
  if(!pushDir||pushDir[0]!==d[0]||pushDir[1]!==d[1]){pushDir=d;pushT=0}pushT+=dt;if(pushT<.28)return;pushT=-.12;
  const nx=bt.tx+d[0],ny=bt.ty+d[1],q=id(nx,ny),inside=nx>R0.x0&&nx<R0.x0+R0.W-1&&ny>R0.y0&&ny<R0.y0+R0.H-1;
  if(!inside||map[q]!==G||PROPAT[q]||CHESTS[q]||mobs.some(m=>Math.floor(m.x/T)===nx&&Math.floor((m.y-3)/T)===ny)){SFX.thunk();return}
  pzMoveBlock(bt,nx,ny);SFX.thud();for(let k=0;k<5;k++)particles.push({x:bt.x-d[0]*8,y:bt.y+6,vx:(Math.random()-.5)*20,vy:-6,g:0,life:.4,c:'#8a8070',w:'smoke'});
  if(R0.plates.every(([x,y])=>R0.bl.some(b=>b.tx===x&&b.ty===y))){R0.done=1;rec('puzzles',1);setTimeout(()=>{const s=props.find(p=>p.t==='pzseal'&&p.room===bt.room);
    if(s){delete PROPAT[id(s.tx,s.ty)];map[id(s.tx,s.ty)]=G;props.splice(props.indexOf(s),1)}SFX.chime();cam.shake=.3;amb('The last plate sinks. Behind you, at the back of the room, stone grinds on stone.',3200)},400)}}
function pzUpdate(dt,vx,vy){if(!LV.rooms)return;pzPush(vx,vy,dt);
  for(const b of props)if(b.t==='pzblock'&&(b.ax||b.ay)){const k=Math.min(1,dt*10);b.ax-=b.ax*k*1.6;b.ay-=b.ay*k*1.6;if(Math.abs(b.ax)<.3)b.ax=0;if(Math.abs(b.ay)<.3)b.ay=0}
  const ptx=Math.floor(P.x/T),pty=Math.floor((P.y-3)/T);
  LV.rooms.forEach((R0,ri)=>{if(R0.t!=='race'||R0.done)return;
    if(ptx===R0.px&&pty===R0.py&&!R0.open){R0.open=R0.dur;const g=props.find(p=>p.t==='pzgate'&&p.room===ri);if(g){map[id(g.tx,g.ty)]=G}SFX.clang();amb(`A chain rattles and a gate goes up. Run.`,1600);R0.tick=0}
    if(R0.open>0){R0.open-=dt;R0.tick-=dt;if(R0.tick<=0){R0.tick=R0.open<2?.25:.5;SFX.tick?SFX.tick():AU.tone('square',1400,1400,.02,.03)}
      const inGate=ptx===R0.gx&&pty===R0.gy;if(R0.open<=0&&inGate)R0.open=.1;
      /* inside the vault: it's yours, the gate stays up for good */
      if(Math.abs(ptx-R0.cx)<=1&&Math.abs(pty-R0.cy)<=1){R0.done=1;R0.open=1e9;rec('puzzles',1);SFX.chime()}
      else if(R0.open<=0){R0.open=0;const g=props.find(p=>p.t==='pzgate'&&p.room===ri);if(g)map[id(g.tx,g.ty)]=PROPT;SFX.thud();amb('The portcullis slams down.',1600)}}})}
