
/* ================= SPAWNS ================= */
function makeMob(kind,x,y){return{kind,x,y,t:0,next:1,wx:0,wy:0,anim:Math.random()*5,stun:0,flip:false,alert:0,wob:Math.random()*6,state:'awake',chase:0,bored:0,n:0}}
const SPAWN_TBL={
  woods:p=>p<.35?{pack:4,bat:2,vagrant:1,spider:3,thornling:3,poacher:1}:p<.7?{pack:3,golem:2,bear:2,vagrant:1,bat:1,spider:2,stag:2,thornling:2,poacher:2,mosstroll:1}:{pack:3,bear:2,brigand:3,knight:2,stag:2,spider:1,mosstroll:3,poacher:2},
  cave:p=>p<.5?{bat:3,ooze:3,pack:3,golem:2,ghoul:2,crawler:1,gnasher:3,wisp:2,revenant:1}:{bat:2,golem:2,ooze:2,pack:3,knight:1,ghoul:2,crawler:3,gnasher:2,wisp:2,revenant:3},
  swamp:p=>p<.5?{slime:3,shroom:3,mosquito:2,pack:2,leech:3,drowned:1,toad:3,hag:1,serpent:1}:{shroom:2,slime:2,mosquito:2,bear:1,pack:3,leech:2,drowned:3,toad:2,hag:2,serpent:3},
  plains:p=>p<.5?{pack:3,brigand:2,bear:1,vagrant:2,boar:3,hound:3,crowswarm:2,archer:1}:{knight:3,brigand:2,pack:3,boar:3,archer:3,hound:2,crowswarm:2}};
const BAT_CAP={woods:3,cave:7,swamp:2,plains:1},ENT_N={woods:6,cave:0,swamp:5,plains:2},SPAWN_N=34;
function pickKind(tx,ty){const p=LV.prog+(Math.random()-.5)*.25,type=LV.type;
  if(type==='swamp'&&nearType(tx,ty,[BOG],2)&&chance(.45))return chance(.5)?'slime':'mosquito';
  const tbl=(typeof MAPDEF!=='undefined'&&LV.kind==='zone'&&mapDef().mobs)||SPAWN_TBL[type](p);let tot=0;for(const k in tbl)tot+=tbl[k];let r=Math.random()*tot;for(const k in tbl){r-=tbl[k];if(r<=0)return k==='pack'?AREA_PACK[type]:k}return AREA_PACK[type]}
const SAFE_R=15;
function genSpawns(){const type=LV.type,ar=LV.arena,occ=[];let bats=0;
  for(let i=0;i<SPAWN_N;i++){for(let tries=0;tries<80;tries++){const tx=3+((Math.random()*(MW-6))|0),ty=3+((Math.random()*(MH-6))|0),t=map[id(tx,ty)];
    if(BLOCK[t]||!REACH[id(tx,ty)]||inPocket(tx,ty)||t===DOOR||t===GATE||t===EXIT)continue;if(ar&&Math.hypot(tx-ar.x,ty-ar.y)<ar.r+3)continue;
    /* nothing spawns within SAFE_R tiles of anywhere you can appear (start, fires, gates, the way back): more than the widest sight range, so you never wake up in a fight */
    if((START&&Math.hypot(START.x-tx,START.y-ty)<SAFE_R)||fires.some(f=>Math.hypot(f.x-tx,f.y-ty)<SAFE_R)||LV.gates.some(g=>Math.hypot(g.inner.x-tx,g.inner.y-ty)<SAFE_R)||(LV.back&&Math.hypot(LV.back.x-tx,LV.back.y-ty)<SAFE_R))continue;
    const px=tx*T+8,py=ty*T+12;if(occ.some(o=>Math.abs(o.x-px)<120&&Math.abs(o.y-py)<120))continue;
    const k=pickKind(tx,ty);if((k==='bat'||k==='mosquito')&&bats>=BAT_CAP[type]+(k==='mosquito'?4:0))continue;if(KINDS[k].human&&!nearType(tx,ty,[ROAD],3)&&chance(.35))continue;
    if(k==='bat'||k==='mosquito')bats++;occ.push({x:px,y:py});SPAWNS.push({kind:k,x:px,y:py,n:KINDS[k].pack?(KINDS[k].n||2):0});break}}
  const tt=type==='swamp'?PINE:OAK,cands=[];
  for(let y=3;y<MH-3;y++)for(let x=3;x<MW-3;x++){if(map[id(x,y)]!==tt||PROPAT[id(x,y)]||inPocket(x,y))continue;
    if(!nearType(x,y,[ROAD],1)||!touchesReach(REACH,x,y))continue;if(fires.some(f=>Math.hypot(f.x-x,f.y-y)<7))continue;cands.push({x,y})}
  const ents=[];cands.sort(()=>Math.random()-.5);for(const c of cands){if(ents.length>=ENT_N[type]*(LV.zi===0?.5:1))break;if(ents.some(e=>Math.hypot(e.x-c.x,e.y-c.y)<14))continue;ents.push(c)}
  for(const e of ents){map[id(e.x,e.y)]=ENTT;SPAWNS.push({kind:'ent',vk:type==='plains'?'hedgeent':null,x:e.x*T+8,y:e.y*T+15,tx:e.x,ty:e.y,dormant:1,treeT:tt})}
  /* gatekeepers (0.17): a sleeping ent (a golem, underground) standing in a one-tile gap in a tree line or rock wall, where the two sides are
     a long walk apart. Wake it and win (or run) and the gap stays open: a shortcut. Both sides are already reachable, so it never skips
     anything (no tool gates, no boss barrier) */
  {const want=type==='woods'?4:type==='cave'?3:3,solidT=t=>type==='cave'?t===WALL:isTree(t),ok=(x,y)=>{const q=id(x,y);return REACH[q]&&!BLOCK[map[q]]&&!inPocket(x,y)&&!(ar&&Math.hypot(x-ar.x,y-ar.y)<ar.r+3)};
   const pathLen=(a,b,cap)=>{const d=new Int16Array(MW*MH).fill(-1),q=[a];d[a]=0;for(let h=0;h<q.length;h++){const c=q[h];if(c===b)return d[c];if(d[c]>=cap)continue;const cx=c%MW,cy=(c/MW)|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const n=id(cx+dx,cy+dy);if(d[n]>=0||BLOCK[map[n]]||!REACH[n])continue;d[n]=d[c]+1;q.push(n)}}return 9999};
   const cs=[];for(let y=4;y<MH-4;y++)for(let x=4;x<MW-4;x++){const t=map[id(x,y)];if(!solidT(t)||PROPAT[id(x,y)]||inPocket(x,y))continue;
     if(ok(x-1,y)&&ok(x+1,y)&&solidT(map[id(x,y-1)])&&solidT(map[id(x,y+1)]))cs.push({x,y,a:id(x-1,y),b:id(x+1,y)});
     else if(ok(x,y-1)&&ok(x,y+1)&&solidT(map[id(x-1,y)])&&solidT(map[id(x+1,y)]))cs.push({x,y,a:id(x,y-1),b:id(x,y+1)});
     /* a wall two thick: the keeper stands in the first tile, the second is cleared behind it */
     else if(ok(x-1,y)&&solidT(map[id(x+1,y)])&&ok(x+2,y)&&!PROPAT[id(x+1,y)]&&solidT(map[id(x,y-1)])&&solidT(map[id(x,y+1)])&&solidT(map[id(x+1,y-1)])&&solidT(map[id(x+1,y+1)]))cs.push({x,y,a:id(x-1,y),b:id(x+2,y),c2:id(x+1,y)});
     else if(ok(x,y-1)&&solidT(map[id(x,y+1)])&&ok(x,y+2)&&!PROPAT[id(x,y+1)]&&solidT(map[id(x-1,y)])&&solidT(map[id(x+1,y)])&&solidT(map[id(x-1,y+1)])&&solidT(map[id(x+1,y+1)]))cs.push({x,y,a:id(x,y-1),b:id(x,y+2),c2:id(x,y+1)})}
   cs.sort(()=>Math.random()-.5);const gk=[];let tries=0;
   for(const c of cs){if(gk.length>=want||tries>400)break;if(gk.some(e=>Math.hypot(e.x-c.x,e.y-c.y)<16)||ents.some(e=>Math.hypot(e.x-c.x,e.y-c.y)<6))continue;
     if(fires.some(f=>Math.hypot(f.x-c.x,f.y-c.y)<6)||LV.gates.some(g=>Math.hypot(g.inner.x-c.x,g.inner.y-c.y)<6))continue;
     tries++;if(pathLen(c.a,c.b,30)<24)continue;gk.push(c);map[id(c.x,c.y)]=ENTT;if(c.c2!=null)map[c.c2]=type==='cave'?ROAD:G;
     SPAWNS.push(type==='cave'?{kind:'golem',x:c.x*T+8,y:c.y*T+15,tx:c.x,ty:c.y,dormant:1,gk:1}:{kind:'ent',vk:type==='plains'?'hedgeent':null,x:c.x*T+8,y:c.y*T+15,tx:c.x,ty:c.y,dormant:1,treeT:type==='swamp'?PINE:map[c.a]===OAK?OAK:tt,gk:1})}
   LV.gks=gk.length}
  if(type==='plains'){const fld=[];for(let y=4;y<MH-4;y++)for(let x=4;x<MW-4;x++){const q=id(x,y);if(map[q]===G&&REACH[q]&&!PROPAT[q]&&!inPocket(x,y)&&nearType(x,y,[ROAD],2)&&!fires.some(f=>Math.hypot(f.x-x,f.y-y)<8))fld.push({x,y})}
    fld.sort(()=>Math.random()-.5);const sm=[];for(const c of fld){if(sm.length>=(LV.zi===0?2:4))break;if(sm.some(e=>Math.hypot(e.x-c.x,e.y-c.y)<16))continue;sm.push(c);SPAWNS.push({kind:'strawman',x:c.x*T+8,y:c.y*T+14,tx:c.x,ty:c.y,dormant:1})}}
  if(LV.bossTile){const bt=LV.bossTile;SPAWNS.push({kind:AR.def.boss,x:bt.x*T+8,y:bt.y*T+15,tx:bt.x,ty:bt.y,dormant:1,boss:1});
    /* two guards near the boss clearing: only on ground you can actually walk to (a few tries round the circle) */
    if(LV.zi===LASTZ)for(let k=0;k<2;k++)for(let tries=0;tries<16;tries++){const an=Math.random()*6.283,x=Math.round(LV.arena.x+Math.cos(an)*10),y=Math.round(LV.arena.y+Math.sin(an)*10);if(x<1||y<1||x>=MW-1||y>=MH-1)continue;if(!BLOCK[map[id(x,y)]]&&REACH[id(x,y)]&&!inPocket(x,y)){SPAWNS.push({kind:type==='cave'?'golem':type==='swamp'?'bear':'knight',x:x*T+8,y:y*T+12});break}}}}
let bossMob=null;
function resetMobs(){mobs=[];LV.mobs=mobs;bossMob=null;
  for(const s of SPAWNS){const gone=s.perm||s.dead||(s.boss&&AR.bossDead);
    if(s.dormant&&(s.kind==='ent'||s.kind==='elder'||s.gk))map[id(s.tx,s.ty)]=gone?G:ENTT;if(gone)continue;
    const m=makeMob(s.kind,s.x,s.y);m.sp=s;m.n=s.n||0;if(s.vk)m.vk=s.vk;if(s.dormant){m.state='dormant';m.tx=s.tx;m.ty=s.ty;m.treeT=s.treeT;m.gk=s.gk}if(s.boss){m.boss=1;bossMob=m}mobs.push(m)}}
function useLevelMobs(L){if(!L.mobs)resetMobs();else{mobs=L.mobs;bossMob=mobs.find(m=>m.boss)||null}}
/* keep awake mobs out of a radius around an arrival point, without despawning them */
function pushAway(x,y,R=6*T){for(const m of mobs){if(m.state!=='awake'||m.boss)continue;let d=Math.hypot(m.x-x,m.y-y);if(d>=R)continue;
  let a=d<1?Math.random()*6.283:Math.atan2(m.y-y,m.x-x),ok=false;
  for(let k=0;k<16&&!ok;k++){const an=a+(k%2?1:-1)*Math.ceil(k/2)*.39;for(let rr=R;rr<=R+5*T;rr+=T){const nx=x+Math.cos(an)*rr,ny=y+Math.sin(an)*rr;
    if(nx<2*T||ny<2*T||nx>(MW-2)*T||ny>(MH-2)*T)break;if(KINDS[m.kind].fly||boxFree(nx,ny)){m.x=nx;m.y=ny;ok=true;break}}}
  m.stun=Math.max(m.stun,1.2)}}

/* ================= NOTICES (tap to continue) ================= */
const NQ=[];let noteCur=null;
function notice(text,title){if(!text)return Promise.resolve();if(typeof clog==='function')clog(title?`${title}: ${text}`:text,'','','','world');return new Promise(res=>{NQ.push({text,title,res});if(!noteCur)nextNote()})}
function nextNote(){if(noteCur){noteCur.res();noteCur=null}const n=NQ.shift();const el=$('#note');
  if(!n){el.style.display='none';if(mode==='note')mode='world';return}
  noteCur=n;if(mode==='world')mode='note';padV={x:0,y:0};$('#ntitle').textContent=n.title||'';$('#ntitle').style.display=n.title?'block':'none';$('#ntext').textContent=n.text;el.style.display='block';el._t=performance.now()}
function noteTap(){if(noteCur&&performance.now()-$('#note')._t>90){nextNote();return true}return!!noteCur}
/* lists of found things: duplicates collapse to "Bitterleaf x2" */
const listJoin=a0=>{const c=new Map();for(const x of a0)c.set(x,(c.get(x)||0)+1);const a=[...c].map(([x,n])=>n>1?`${x} x${n}`:x);return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1]};
/* gold is scarce: every purchase should be a decision (0.15: about 40% less than before) */
const coinsFor=()=>Math.round(ri(1,4)*(1+.6*AR.i)+LV.prog*2);
/* when the bag is full, things go on the ground in a little pile you can come back for */
function dropPile(ids,wx,wy){if(!ids.length||!props)return;const tx=Math.floor((wx??P.x)/T),ty=Math.floor((wy??P.y)/T);let ex=props.find(p=>p.t==='pile'&&!p.st&&Math.abs(p.tx-tx)<=2&&Math.abs(p.ty-ty)<=2);
  if(ex){ex.items.push(...ids);return}for(let r=0;r<4;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const a=tx+dx,b=ty+dy;if(a<1||b<1||a>=MW-1||b>=MH-1)continue;const t=map[id(a,b)];if(BLOCK[t]||t===DOOR||t===IDOOR||PROPAT[id(a,b)])continue;addProp('pile',a,b,false,{items:ids.slice()});return}}
/* searching things: often nothing, sometimes a small blessing, otherwise loot */
const NOTHING=['Nothing worth taking.','Nothing.','Someone got here first.','Empty, as it turns out.'];
function buffRoll(){const q=Math.random();
  if(q<.3){P.blessed=Math.max(P.blessed||0,2);SFX.shrine();return'You stand before it a while. You are Blessed.'}
  if(q<.55){P.sharp=Math.max(P.sharp||0,2);SFX.clang();return'A whetstone, worn thin. You give your blade a few strokes with it. (+2 Attack for your next two fights.)'}
  if(q<.8){const h=Math.min(P.max-P.hp,Math.round(P.max*.2));P.hp+=h;SFX.heal();return`A sprig of something green and bitter. You chew it.${h?` +${h} HP.`:''}`}
  const m=P.mmax-P.mp;P.mp=P.mmax;SFX.chime();return`A prayer scratched into the wood. You read it under your breath.${m?` +${m} MP.`:''}`}
function rummage(tier,coins,none){const q=Math.random();if(q<.3)return none||pick(NOTHING);if(q<.43)return buffRoll();return grant([lootRoll(tier)],coins)||none||pick(NOTHING)}
function grant(ids,coins){ids=ids||[];const got=[],left=[],lid=[];for(const i of ids){rec('found',1);if(addItem(i))got.push(iname(i));else{left.push(iname(i));lid.push(i)}}dropPile(lid);if(coins){coins=Math.round(coins*(1+(P.gf||0)));P.gold+=coins;rec('earned',coins)}
  let s='';const all=(coins?[coins+' gold']:[]).concat(got);if(all.length){s='You find '+listJoin(all)+'.';SFX.coin()}if(left.length)s+=(s?' ':'')+'Your bag is full, so you leave '+listJoin(left)+' on the ground.';return s}

/* ================= TRAVEL BETWEEN LEVELS ================= */
function fadeFlash(){const f=$('#fade');f.style.transition='none';f.style.opacity=1;requestAnimationFrame(()=>{f.style.transition='opacity .9s';f.style.opacity=0})}
function banner(t,small){const b=$('#banner');b.textContent=t;b.classList.toggle('small',!!small);b.classList.remove('on');void b.offsetWidth;b.classList.add('on')}
function loadInto(fn,title,sub){const ld=$('#load');$('#ldt').textContent=title||'';$('#lds').textContent=sub||bagPick('load',LOADTXT);ld.style.display='flex';mode='load';padV={x:0,y:0};
  requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>{fn();watchers=[];particles=[];leaves=[];P.trail=[];BG=null;VIG=null;resize();updCam();
    setTimeout(()=>{ld.style.display='none';mode=noteCur?'note':'world';fadeFlash()},380)},30)))}
function enterLevel(L,x,y){VISIT++;setTimeout(hunterFollow,0);if(DIFF.hc&&L.kind==='zone'&&chance(.35))setTimeout(()=>{if(mode==='world')amb(bagPick('hccrow',HC_CROW),4200)},3000);if(LV&&L.area!==LV.area)EV.fog=0;bindLevel(L);if(typeof resize==="function")resize();P.x=x;P.y=y;useLevelMobs(L);pushAway(x,y);P.inv=Math.max(P.inv,1)}
function goZone(ar,zi,gate){const L=getZone(ar,zi);bindLevel(L);const g=L.gates.find(q=>q.to===gate.from)||L.gates[0];enterLevel(L,g.inner.x*T+8,g.inner.y*T+12);
  for(const q of L.gates)q.away=q!==g;g.away=false}
function goFire(ai,zi,fi,title){const ar=getArea(ai),newArea=ar!==AR;
  loadInto(()=>{const L=getZone(ar,zi);bindLevel(L);const f=fires[fi];f.lit=true;enterLevel(L,f.x*T+8,(f.y+1)*T+14);ar.lastFire={zi,fi};exitAway=false;
    setTimeout(()=>banner(newArea?ar.def.name:L.name,!newArea),500)},title||ar.def.name,newArea?null:ar.def.zones[zi])}
let gateCd=0;
function useGate(g){if(gateCd>0)return;gateCd=1.5;const ar=AR,to=g.to,from=LV.zi;
  loadInto(()=>{goZone(ar,to,{from});setTimeout(()=>banner(LV.name,true),500)},ar.def.zones[to],(MAPDEF[ar.i*NZ+to]||{}).sub)}
function useDoor(b){if(b.nailed){if(!P.tools.crowbar){toast('The door has been nailed shut from outside, boards across it and all. You could prise them off with something.',3200);return}b.nailed=0;if(AR.ints[b.key])AR.ints[b.key].nailed=1;SFX.creak();setTimeout(()=>SFX.thud(),250);for(let k=0;k<18;k++)particles.push({x:b.door.x*T+8,y:b.door.y*T+6,vx:(Math.random()-.5)*50,vy:-10-Math.random()*30,g:60,life:.8,c:pick(['#7a5a34','#4a3420','#c8a878']),w:'spark'});amb('The boards come away. Whatever they were keeping in, it was a long time ago.',2600);return}
  if(gateCd>0)return;gateCd=1;const ar=AR;
  loadInto(()=>{const L=getInterior(ar,b.key);enterLevel(L,L.start.x*T+8,L.start.y*T+12);setTimeout(()=>banner(L.name,true),400)},BTYPES[b.bt].name,bagPick('door',DOORTXT))}
function leaveInterior(){if(gateCd>0)return;gateCd=1;const ar=AR,L0=LV;
  loadInto(()=>{const Z=getZone(ar,L0.parent);enterLevel(Z,L0.door.x*T+8,(L0.door.y+1)*T+14)},ar.def.zones[L0.parent],'Back outside.')}

/* ================= FIRES ================= */
function gainXP(n){n=Math.round(n*2);P.xp+=n;while(P.xp>=nextXp(P.lv)){P.xp-=nextXp(P.lv);lvlUp();notice(lvlMsg())}}
/* a spot for a reward chest that can never wall the player in */
function safeChestSpot(cx,cy){const ptx=Math.floor(P.x/T),pty=Math.floor((P.y-3)/T);
  for(let r=1;r<=7;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=cx+dx,y=cy+dy,q=id(x,y),t=map[q];
    if(BLOCK[t]||t===DOOR||t===EXIT||t===GATE||t===IDOOR||PROPAT[q])continue;if(Math.abs(x-ptx)<=1&&Math.abs(y-pty)<=1)continue;
    map[q]=CHEST;const s=flood(true);const ok=s[id(ptx,pty)]&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>s[id(x+a,y+b)]);map[q]=t;if(ok)return{x,y}}
  return freeNear(cx,cy)}
function freeNear(x,y){const pt=Math.floor(P.x/T),pq=Math.floor((P.y-4)/T);for(const[dx,dy]of[[0,0],[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1]]){const a=x+dx,b=y+dy;if(!BLOCK[map[id(a,b)]]&&!(pt===a&&pq===b))return{x:a,y:b}}return{x,y}}
const threatNear=()=>mobs.some(m=>(m.hunt||m.alert)&&m.stun<=0&&Math.hypot(m.x-P.x,m.y-P.y)<10*T);
/* kindling a fire is a one-time mercy: it mends you and marks a place to travel to. There is no resting, so nothing comes back */
function kindle(f){f.lit=true;rec('fires',1);const h=P.max-P.hp,m=P.mmax-P.mp,had=Object.keys(P.st).length>0;P.hp=P.max;P.mp=P.mmax;P.st={};fadeFlash();
  for(const L of allLevels(AR))for(const s of L.spawns)if(s.dead){s.perm=1}
  AR.lastFire={zi:LV.zi,fi:fires.indexOf(f)};pushAway(P.x,P.y,6*T);
  if(hasT('kindled'))P.blessed=Math.max(P.blessed,3);
  SFX.ignite();SFX.heal();notice(bagPick('kindle',KINDLE)+(h||m||had?` The warmth gets into you.${h?` +${h} HP.`:''}${m?` +${m} MP.`:''}${had?' Your ailments ease.':''}`:'')+' You can travel here from any other lit fire.')}
const BEYOND={elder:'the Wychwood Elder',colossus:'the Colossus',rotmother:'the Rot Mother',harrow:'Lord Harrow'};
async function fireDialog(f){if(mode!=='world')return;
  if(threatNear()){amb('Not with an enemy that close.',2200,true);return}
  const opts=[],travel=f.lit&&travelList().length>1;if(!f.lit)opts.push('Kindle the fire');if(travel)opts.push('Travel');opts.push('Leave');
  const body=f.lit&&!travel?'The fire is lit. You can travel between this fire and any other lit one.':f.lit?bagPick('firelit',['The fire crackles.','Embers, and a little warmth.','The flames are warm on your face.']):bagPick('fireunlit',['Old ash in a ring of stones.','A cold firepit. There is kindling enough.']);
  const c=opts[await dialog(f.lit?'A campfire':'A cold firepit',body,opts)];
  if(c==='Kindle the fire')kindle(f);else if(c==='Travel')setTimeout(()=>openPack('map',true),50)}
const DIRN=['east','south-east','south','south-west','west','north-west','north','north-east'];
function fireDir(f){const dx=f.x-ZS/2,dy=f.y-ZS/2;if(Math.hypot(dx,dy)<14)return'centre';return DIRN[((Math.round(Math.atan2(dy,dx)/(Math.PI/4))%8)+8)%8]}
function travelList(){const l=[];AREAS.forEach((a,ai)=>{if(!a)return;a.zones.forEach((Z,zi)=>{if(!Z)return;Z.fires.forEach((f,fi)=>{if(f.lit)l.push({ai,zi,fi,f,label:a.def.zones[zi]+' — '+(f.start?(zi===0?'the first fire':'the camp'):f.boss?'beyond '+BEYOND[a.def.boss]:fireDir(f))})})})});
  const seen={};for(const x of l){const k=x.ai+x.label;seen[k]=(seen[k]||0)+1;if(seen[k]>1)x.label+=' ('+seen[k]+')'}return l}
async function exitDialog(){const nx=AR.def.next;if(nx==null)return;
  const c=await dialog('The way on',EXIT_TXT[AR.i],['Go on to '+AREA_DEFS[nx].name,'Not yet']);if(c===0)goFire(nx,0,0)}
async function backDialog(){const pv=AR.i-1;if(pv<0)return;
  const c=await dialog('The way back',BACK_TXT[pv],['Return to '+AREA_DEFS[pv].name,'Stay']);
  if(c===0){const pa=getArea(pv),Z=getZone(pa,LASTZ);let fi=0,bd=1e9;Z.fires.forEach((f,i)=>{const d=Z.arena?Math.hypot(f.x-Z.arena.x,f.y-Z.arena.y):0;if(d<bd){bd=d;fi=i}});goFire(pv,LASTZ,fi)}}

/* ================= INTERACTIONS ================= */
const BELL_ORDER=[0,3,1,2];
const EPI_BELL='HERE LIES THE BELLWARDEN.\nHE RANG THEM AS HE LIVED:\nTHE LOWEST FIRST, THEN THE HIGHEST,\nTHEN THE TWO BETWEEN, LOW TO HIGH.';
const GENERIC={table:'Nothing on the table worth taking.',wardrobe:'Empty.',painting:'A painting, too dark to make out.',fireplace:'Cold ash.',altar:'A plain stone altar.',counter:'An empty counter.',cage:'An empty cage.',totem:'Bones and twine.',tent:'An empty tent.',cart:'An empty cart.',boat:'A rotting boat.',minecart:'An empty mine cart.',scare:'A scarecrow.',shrine:'A small shrine.',book:'Rows of books, swollen shut with damp.'};
const LOOTY=new Set(['table','wardrobe','tent','cart','boat','minecart']);
const pkey=p=>p.t.startsWith('f_')?p.t.slice(2):p.t;
const tierHere=()=>Math.min(3,AR.i+(LV.prog>.5?1:0));
/* can USE do anything with this prop right now? */
function usable(p){if(p.broken||p.tree)return 0;const t=pkey(p);if(NEWP[t])return NEWP[t].u(p);
  switch(t){case'grave':case'sign':case'statue':return p.read?1:2;
    case'crow':case'frogking':case'bell':case'crystal':case'anvil':case'stash':return 2;case'hungry':return p.fed?1:2;
    case'brazier':return LV.brazSolved?0:2;case'well':return p.st<3?2:0;
    case'stones':case'stack':case'lever':case'hintstone':case'noticeboard':return 2;
    case'banner':return p.torn?0:2;case'grindstone':return p.st?0:2;
    case'pile':return p.st||!p.items.length?0:2;
    case'crevice':return p.n>=3?0:2;
    case'coldcamp':case'gallows':case'dovecote':case'toybox':
    case'axestump':case'hollowlog':case'stoneface':case'skeleton':case'mudpot':case'turnip':case'picnic':
    case'idol':case'mushring':case'spring':case'satchel':case'glint':
    case'bush':case'corpse':case'mound':case'bed':case'table':case'wardrobe':case'shelf':case'altar':case'shrine':case'cauldron':case'tent':case'cart':case'boat':case'minecart':case'hive':case'haystack':case'hay':case'fireplace':case'painting':case'counter':case'cage':case'totem':case'scare':return p.st?0:2}
  return 0}
let useT=null;
function findUse(){const fx=P.x+FD[P.face][0]*10,fy=P.y-5+FD[P.face][1]*10,bx=P.x,by=P.y-5;let best=null,bs=1e9;
  const consider=(o,x,y,lvl)=>{const db=Math.hypot(x-bx,y-by);if(db>22)return;const s=Math.hypot(x-fx,y-fy)+(lvl===1?6:0);if(s<bs){bs=s;best={o,x,y,lvl}}};
  for(const f of fires)if(Math.abs(f.x*T+8-bx)<40&&Math.abs(f.y*T+8-by)<40)consider({fire:f},f.x*T+8,f.y*T+9,2);
  {const tx=Math.floor(fx/T),ty=Math.floor((fy+2)/T),t=tAt(tx,ty);if(isGateT(t)){const need=TILE_TOOL[t];consider({gate:{x:tx,y:ty,t,need}},tx*T+8,ty*T+8,P.tools[need]?2:1)}}
  if(LV.kind==='zone'){for(const b of LV.blds){const x=b.door.x*T+8,y=b.door.y*T+12;if(Math.abs(x-bx)<40&&Math.abs(y-by)<40)consider({door:b},x,y,2)}}
  else for(let x=0;x<MW;x++)if(map[id(x,MH-1)]===IDOOR)consider({exitDoor:1},x*T+8,(MH-1)*T+4,2);
  for(const c of chests)if(!c.open&&!c.veil&&Math.abs(c.x*T+8-bx)<40&&Math.abs(c.y*T+8-by)<40)consider({chest:c},c.x*T+8,c.y*T+9,2);
  for(const p of props){if(Math.abs(p.x-bx)>40||Math.abs(p.y-by)>40)continue;const u=usable(p);if(u)consider({prop:p},p.x,p.y,u)}
  for(const o of SMALLS){if(o.used||Math.abs(o.x-bx)>30||Math.abs(o.y-by)>30)continue;consider({sm:o},o.x,o.y,1)}
  return best}
/* a cache at the end of a dead end: found by pressing Use (or striking) right there */
function takeCache(tx,ty){if(!LV.caches)return false;const c=LV.caches.find(c=>!c.got&&Math.abs(c.x-tx)<=1&&Math.abs(c.y-ty)<=1);if(!c)return false;c.got=1;rec('caches',1);
  const t=tierHere(),q=Math.random(),items=q<.5?[genGear(t,{min:2})]:q<.75?[oreFor(t)]:q<.88?[gemFor(t)]:[lootRollOld(t)],g=q>=.5?coinsFor()*3:0;SFX.dig&&SFX.dig();SFX.coin();
  for(let k=0;k<14;k++)particles.push({x:c.x*T+8,y:c.y*T+8,vx:(Math.random()-.5)*30,vy:-10-Math.random()*25,g:20,life:1,c:'#ffe8a0',w:'spark'});
  notice('Wedged into the very end of the passage:'+grant(items,g).replace(/^You find /,''));return true}
function doUse(){if(mode!=='world')return;const u=useT;if(!u){takeCache(Math.floor(P.x/T),Math.floor((P.y-3)/T));return}
  if(u.o.fire)return fireDialog(u.o.fire);if(u.o.chest)return openChest(u.o.chest);if(u.o.gate)return useGateTool(u.o.gate);if(u.o.door)return useDoor(u.o.door);if(u.o.exitDoor)return leaveInterior();if(u.o.sm)return useSmall(u.o.sm);useProp(u.o.prop)}
const GATE_HINT={brand:'A wall of brambles, thick as rope. A blade won\'t get through it.',powder:'The rock here is cracked right through. Blasting powder would open it.',hook:'Deep, still water. Too deep to wade. There is a post on the far side.',
  axe:'A dead tree has come down right across the way. Too big to climb, too heavy to shift.',crowbar:'Boards, nailed across the gap from the other side.',pole:'Mire. It sucks at your boot. It isn\'t far across, if you could get over it.',shovel:'The bank has come down here: a heap of earth and stones where the way used to be.',keys:'An iron gate, locked with a new padlock.'};
function useGateTool(g){if(!P.tools[g.need]){toast(GATE_HINT[g.need],3200);return}
  const burst=(x,y,cols,n=24)=>{for(let k=0;k<n;k++)particles.push({x:x*T+8+(Math.random()-.5)*12,y:y*T+8+(Math.random()-.5)*12,vx:(Math.random()-.5)*50,vy:-10-Math.random()*40,g:30,life:1,c:pick(cols),w:'spark'})};
  if(g.need==='hook'||g.need==='pole'){const W0=g.need==='hook'?DEEP:MIRE,[dx,dy]=FD[P.face],px=Math.floor(P.x/T),py=Math.floor((P.y-3)/T);let crossed=0;
    for(let i=1;i<=6;i++){const x=px+dx*i,y=py+dy*i,t=tAt(x,y);if(t===W0){crossed++;continue}if(crossed&&!BLOCK[t]){SFX.whoosh();HOOK={sx:P.x,sy:P.y,tx:x*T+8,ty:y*T+12,t:0,pole:g.need==='pole'};return}break}
    amb(g.need==='hook'?'The hook finds nothing to catch on from here. Face the water.':'Not from here. Face the mire and try again.',2400);return}
  const T0=g.t,cols=T0===BRAMBLE?['#ff9a3a','#ffd75e','#c8401a','#3a2a1a']:T0===DEADFALL||T0===BOARDS?['#7a5a34','#4a3420','#c8a878','#2a1a10']:T0===SPOIL?['#6a5236','#4a3a24','#8a7a5a']:T0===IRONG?['#8a9098','#ffd75e','#5a6068']:['#6a645c','#8a8478','#ffd75e','#3a3632'];
  const open=(x,y)=>{map[id(x,y)]=G;burst(x,y,cols);for(const[p,q]of[[1,0],[-1,0],[0,1],[0,-1]])if(tAt(x+p,y+q)===T0)open(x+p,y+q)};
  rec('gates',1);if(T0===BRAMBLE){SFX.ignite();open(g.x,g.y)}else if(T0===DEADFALL){[0,1,2].forEach(i=>setTimeout(()=>SFX.thunk(),i*160));setTimeout(()=>open(g.x,g.y),450)}
  else if(T0===BOARDS){SFX.creak();setTimeout(()=>{SFX.thud();open(g.x,g.y)},300)}else if(T0===SPOIL){[0,1,2].forEach(i=>setTimeout(()=>SFX.dig(),i*200));setTimeout(()=>open(g.x,g.y),550)}
  else if(T0===IRONG){SFX.clang();setTimeout(()=>{SFX.creak();open(g.x,g.y)},250)}else{SFX.thud();SFX.dig();open(g.x,g.y);cam.shake=.3}}
let bellCd=0;
async function anvilDialog(){if(mode==='world'){openTrade('forge');return}for(;;){const id0=P.eq.weapon;if(!id0){notice('You have no weapon to work on.');return}const it=ITEMS[id0],up=it.up||0;
  if(up>=10){await dialog('Anvil',`${iname(id0)} can't be improved any further.`,['Leave']);return}
  if(it.ba==null)it.ba=it.st.atk||1;const lv=up+1,mat=UPMAT(lv),n=UPN(lv),cost=15*lv,have=(P.bag.find(b=>b.id===mat)||{n:0}).n,ga=Math.max(1,Math.round(it.ba*.12));
  const c=await dialog('Anvil',`${iname(id0)}\nAttack ${it.st.atk} → ${it.st.atk+ga}${lv===5||lv===10?', and +3% critical chance':''}\n\nNeeds ${n} × ${ITEMS[mat].n} (you have ${have}) and ${cost} gold (you have ${P.gold}).`,[`Reinforce to +${lv}`,'Leave'],false,[itemTip(mat),'']);
  if(c!==0)return;if(have<n||P.gold<cost){toast("You don't have what it needs.",2000,true);continue}
  for(let i=0;i<n;i++)removeItem(mat);P.gold-=cost;rec('spent',cost);it.up=lv;it.st.atk+=ga;if(lv===5||lv===10)it.st.crit=Math.round(((it.st.crit||0)+.03)*100)/100;recalc();
  [0,1,2].forEach(i=>setTimeout(()=>SFX.clang(),i*180));for(let k=0;k<20;k++)particles.push({x:P.x,y:P.y-12,vx:(Math.random()-.5)*60,vy:-20-Math.random()*40,g:60,life:.8,c:pick(['#ffd75e','#ff9a3a','#fff4c0']),w:'spark'})}}
const showEp=(title,txt)=>dialog(title,`<div class="ep">${esc(txt).replace(/\n/g,'<br>')}</div>`,['Leave'],true);
async function useProp(p){const t=pkey(p);if(NEWP[t])return NEWP[t].use(p);
  switch(t){
    case'grave':SFX.thud();p.read=1;await showEp('A grave',p.ep==='bell'?EPI_BELL:p.ep);break;
    case'sign':p.read=1;await showEp('A signpost',p.text);break;
    case'statue':p.read=1;if(!p.ins)p.ins=takeU('statue',FL.statue)||'A worn statue. The weather has taken its face.';await showEp('A statue',p.ins);break;
    case'well':well(p);break;case'hungry':hungry(p);break;
    case'bell':ringBell(p);break;case'brazier':lightBrazier(p);break;case'crystal':SFX.bell((Math.random()*4)|0);p.flash=.8;break;
    case'bush':p.st=1;SFX.eat();if(p.bad){P.hp=Math.max(1,P.hp-6);notice('The berries are bitter. Your stomach turns. −6 HP.')}else{const h=Math.min(10,P.max-P.hp);P.hp+=h;notice(`You eat the berries. +${h} HP.`)}break;
    case'corpse':{const c=await dialog('The dead',p.note,['Search the body','Leave']);if(c!==0)break;p.st=1;
      notice(grant([lootRoll(Math.min(3,AR.i+1))],chance(.6)?coinsFor():0)||'Nothing of use.');break}
    case'mound':p.st=1;SFX.dig();if(P.tools.shovel){notice('You dig properly, with the shovel, down past where anyone stopped before. '+grant([chance(.4)?genGear(tierHere(),{min:2}):lootRoll(tierHere())],coinsFor()*2));break}notice((LV.type==='cave'?'You heave the rubble aside. ':'You dig into the loose earth. ')+(rummage(tierHere(),chance(.4)?coinsFor():0,'Nothing.')));break;
    case'crow':await shop(p);break;
    case'noticeboard':p.read=1;await showEp('A notice board',p.text);break;
    case'banner':{const c=await dialog('A royal banner','Blue silk and gold thread. Your brother\'s sigil: the tower of your house, crowned.',['Tear it down','Leave']);if(c!==0)break;p.torn=1;SFX.thunk();
      const n=(window._torn=(window._torn||0)+1);notice(n===1?'You tear it down.':n===5?'Another banner down.':'You tear it down.');break}
    case'grindstone':{p.st=1;SFX.clang();P.sharp=3;notice('You work your blade on the old grindstone until the edge sings. (+2 Attack for your next three fights.)');break}
    case'coldcamp':{const c=await dialog('A cold campfire','A ring of stones and old ashes. Whoever camped here packed in a hurry.',['Search the ashes','Leave']);if(c!==0)break;p.st=1;const q=Math.random();
      if(q<.5)notice(rummage(tierHere(),chance(.5)?coinsFor():0,'Nothing but ash.'));else if(q<.75)notice(bagPick('camp',LORE.camp));else{P.st.burn=1;notice('The ashes are not as cold as they look. You are burning.')}break}
    case'gallows':{const c=await dialog('A gallows','A gallows by the road with a new rope. A notice is nailed to the post.',['Read the notice','Search the body','Leave']);if(c===2)break;
      if(c===0){await showEp('Nailed to the gallows',takeU('gallows',LORE.gallows)||'BY ORDER OF THE KING.');break}p.st=1;notice(rummage(tierHere(),coinsFor(),'Someone has already taken everything.'));break}
    case'dovecote':{p.st=1;const t=LORE.letters[Math.min(LORE.letters.length-1,(window._letters=(window._letters||0)+1)-1)];SFX.caw(1.2);await showEp('A dovecote',t);break}
    case'toybox':{p.st=1;notice('A toy box, rotted through. Inside, under the mould, a wooden sword with two names carved into the hilt: yours and your brother\'s.'+grant(['woodsword']));break}
    case'axestump':{p.tries=(p.tries||0)+1;SFX.thunk();if(p.tries===1)notice('An axe, buried deep in an old stump. You pull. It does not move.');else if(p.tries===2)notice('You brace a boot against the stump and heave. Something creaks. It might be the stump. It might be you.');
      else{p.st=1;SFX.clang();notice('It comes free with a crack that carries through the trees. '+grant([genGear(tierHere(),{slot:'weapon',wt:'axe',min:2,noU:1})]))}break}
    case'hollowlog':{const c=await dialog('A hollow log','A fallen trunk, hollow all the way through. There\'s a rustle inside.',['Reach in','Leave']);if(c!==0)break;p.st=1;const q=Math.random();
      if(q<.45)notice('Your fingers close on something. '+(rummage(tierHere(),chance(.4)?coinsFor():0,'Just rot.')));
      else if(q<.7)notice('A fox bolts out of the other end and is gone.');
      else if(q<.9){notice('Bats. Hundreds of them.');const m=makeMob(LV.type==='swamp'?'mosquito':'bat',P.x+10,P.y-10);mobs.push(m);LV.mobs=mobs;setTimeout(()=>{if(mode==='world'&&mobs.includes(m))startBattle(m,'ambush')},400)}
      else{P.st.poison=3;SFX.hiss();notice('A spider inside bites you before you can pull your hand back. You are poisoned.')}break}
    case'stoneface':{if(!p.rid)p.rid=takeU('riddle',RIDDLES)||RIDDLES[0];const R0=p.rid,opts=R0.a.slice().sort(()=>Math.random()-.5);
      const c=await dialog('A face in the stone',`The stone opens its eyes and speaks, slowly:\n\n“${R0.q}”`,opts.concat(['Say nothing']));if(c>=opts.length)break;p.st=1;
      if(opts[c]===R0.a[0]){SFX.chime();notice('The stone face spits a pebble into the grass. '+grant([chance(.5)?genGear(Math.min(3,tierHere()+1),{min:3}):'elixir']))}
      else{SFX.thud();notice('The stone face closes its eyes and says nothing more.')}break}
    case'crevice':{p.n=(p.n||0)+1;SFX.shout();if(p.n===1)notice('You shout into the crack. Your voice comes back a long time later.');else if(p.n===2)notice('You shout again. It comes back twice, from two different directions.');
      else{const R=26,cx=p.tx,cy=p.ty;for(let y=Math.max(0,cy-R);y<Math.min(MH,cy+R);y++)for(let x=Math.max(0,cx-R);x<Math.min(MW,cx+R);x++)if((x-cx)**2+(y-cy)**2<R*R)LV.seen[y*MW+x]=1;notice('You shout a third time and listen. The echoes tell you the shape of the tunnels. (Your map fills in.)')}break}
    case'skeleton':{const c=await dialog('A skeleton','Picked clean, still in what\'s left of its boots.',['Search it','Leave']);if(c!==0)break;p.st=1;
      if(chance(.25)){SFX.clang();for(const m of mobs)if(m.state==='awake'&&Math.hypot(m.x-P.x,m.y-P.y)<12*T)m.hunt=1;notice('It falls apart with a tremendous clatter. Everything nearby heard that.')}
      else notice(rummage(tierHere(),coinsFor(),'Nothing but bones.'));break}
    case'mudpot':{const c=await dialog('A bubbling mud pot','Thick grey mud, blipping and steaming. There\'s a glint at the bottom.',['Reach in','Leave']);if(c!==0)break;p.st=1;
      if(chance(.5)){P.st.burn=2;const d=Math.round(P.max*.08);P.hp=Math.max(1,P.hp-d);SFX.hiss();notice(`It is much hotter than it looks. −${d} HP. You are burning.`)}else notice(rummage(tierHere(),coinsFor(),'Just mud, all the way down.'));break}
    case'turnip':{p.st=1;const q=Math.random();if(q<.6)notice('You pull up a turnip. '+grant(['turnip']));else if(q<.7){SFX.coin();notice('You pull, and pull, and keep pulling. '+grant(['bigturnip']))}else{const d=Math.max(1,Math.round(P.max*.05));P.hp=Math.max(1,P.hp-d);notice(`Something underneath bites your hand and keeps the turnip. −${d} HP.`)}break}
    case'picnic':{const c=await dialog('A picnic','A blanket laid out for a picnic, the food half eaten.',['Help yourself','Leave']);if(c!==0)break;p.st=1;const q=Math.random();
      if(q<.5){const h=Math.min(15,P.max-P.hp);P.hp+=h;notice(`Stale bread, hard cheese, a bottle of cider. It's the best meal you've had in weeks.${h?` +${h} HP.`:''}`)}
      else if(q<.8){P.st.poison=3;notice('The ants were here first, and they are not sharing. You are poisoned.')}else notice('Under the basket, a purse. '+grant([],coinsFor()*2));break}
    case'lever':{if(LV.lever.solved){SFX.thunk();break}p.up=!p.up;SFX.clang();const lv=props.filter(q=>q.t==='lever').sort((a,b)=>a.i-b.i);
      if(lv.every((q,i)=>q.up===LV.lever.pat[i])){LV.lever.solved=true;setTimeout(()=>{SFX.chime();const s=safeChestSpot(LV.lever.x,LV.lever.y);addChest(s.x,s.y,[genGear(Math.min(3,tierHere()+1),{min:3}),'elixir']);amb('Somewhere close, stone grinds against stone.')},500)}break}
    case'hintstone':{p.read=1;const h=p.pat.map(u=>u?'up':'down');await showEp('A carved stone',`Three hands are carved into the stone.\n\nThe first points ${h[0]}. The second points ${h[1]}. The third points ${h[2]}.`);break}
    case'idol':{const c=await dialog('A black idol','A squat figure of black stone with cupped hands. The stone is warm, which it has no business being.',['Touch it','Leave']);if(c!==0)break;p.st=1;const q=Math.random();
      if(q<.35){P.blessed=Math.max(P.blessed,2);SFX.shrine();notice('The warmth runs up your arm and settles in your chest. You are Blessed.')}
      else if(q<.7){P.st.wither=6;const d=Math.round(P.max*.15);P.hp=Math.max(1,P.hp-d);SFX.dread();notice(`The warmth turns to cold, all at once. Your sword arm goes weak. −${d} HP, and you are Weakened.`)}
      else if(q<.85)notice('Something clinks into your palm. '+grant([],ri(20,40)*(1+AR.i)));else notice('Nothing happens.');break}
    case'mushring':{const c=await dialog('A ring of pale mushrooms','A perfect circle of them, pale as knuckles.',['Eat one','Step into the ring','Leave']);if(c===2)break;p.st=1;
      if(c===0){const q=Math.random();if(q<.4){const m=Math.min(8,P.mmax-P.mp);P.mp+=m;notice(`It tastes of earth and something sweet. +${m} MP.`)}else if(q<.75){P.st.poison=5;SFX.hurt();notice('It tastes of earth and something sour. You are poisoned.')}else notice('For a while you hear the trees whispering to each other.')}
      else{if(chance(.5)&&LV.kind==='zone'){for(let k=0;k<200;k++){const x=4+((Math.random()*(MW-8))|0),y=4+((Math.random()*(MH-8))|0);if(REACH[id(x,y)]&&!BLOCK[map[id(x,y)]]&&!inPocket(x,y)&&Math.hypot(x*T-P.x,y*T-P.y)>30*T){P.x=x*T+8;P.y=y*T+12;P.trail=[];pushAway(P.x,P.y);updCam();fadeFlash();SFX.chime();break}}notice('The world lurches sideways. When it settles, you are somewhere else entirely.')}
        else notice('You stand in the ring. Nothing happens.')}break}
    case'spring':{const c=await dialog('A spring','Cold water welling up between the stones.',['Drink','Leave']);if(c!==0)break;p.st=1;
      if(chance(LV.type==='swamp'?.5:.25)){P.st.poison=4;SFX.hurt();notice('It tastes of iron, then of something worse. You are poisoned.')}else{const h=Math.min(12,P.max-P.hp);P.hp+=h;SFX.heal();notice(`The water is cold and clean.${h?` +${h} HP.`:''}`)}break}
    case'pile':{const got=[],keep=[];for(const i of p.items)(addItem(i)?got:keep).push(i);p.items=keep;if(!keep.length){p.st=1;delete PROPAT[id(p.tx,p.ty)]}
      if(got.length){SFX.coin();notice('You pick up '+listJoin(got.map(iname))+'.'+(keep.length?' Your bag is full again; the rest stays here.':''))}else notice('Your bag is still full.');break}
    case'satchel':{const c=await dialog('An abandoned satchel','A leather satchel, half buried in leaves. The buckle is still done up.',['Open it','Leave']);if(c!==0)break;p.st=1;
      if(chance(.35)){P.st.poison=4;P.st.bleed=3;const d=Math.round(P.max*.08);P.hp=Math.max(1,P.hp-d);SFX.hiss();notice(`Something living inside it bites you. −${d} HP. You are poisoned and bleeding.`)}
      else notice(rummage(tierHere(),coinsFor(),'Empty.'));break}
    case'glint':{const c=await dialog('A glint','Something catches the light, down in the grass.',['Reach for it','Leave']);if(c!==0)break;p.st=1;
      if(chance(.45)){const d=Math.round(P.max*.15);P.hp=Math.max(1,P.hp-d);P.st.bleed=4;SFX.clang();notice(`Iron jaws snap shut on your hand. Someone set a trap here, and it was not for bears. −${d} HP. You are bleeding.`)}
      else notice(grant(chance(.3)?['ring']:[],ri(5,15)*(1+AR.i)));break}
    case'anvil':await anvilDialog();break;
    case'stash':SFX.chest&&SFX.chest();openTrade('stash');break;
    case'frogking':{SFX.croak();const c=await dialog('The Frog King',FROG_LINES[(p.talk||0)%FROG_LINES.length],['Kiss the frog','Bow','Leave']);p.talk=(p.talk||0)+1;
      if(c===0){if(!p.kissed){p.kissed=1;notice('You kiss the frog. Nothing happens. A tiny crown falls off his head. “Take it,” he says. '+grant(['tinycrown']))}else notice('The King of the Fen looks away.')}
      else if(c===1)notice('You bow. The King nods, very slightly.');break}
    case'bed':{p.st=1;const h=Math.min(P.max-P.hp,Math.round(P.max*.25));P.hp+=h;const had=Object.keys(P.st).length>0;P.st={};SFX.heal();fadeFlash();notice(`You lie down for a while.${h?` +${h} HP.`:''}${had?' Whatever ailed you is gone when you wake.':''}`);break}
    case'shelf':p.st=1;notice('A book: '+(takeU('book',FL.book)||GENERIC.book));break;
    case'altar':case'shrine':p.st=1;if(chance(.35)){P.blessed=Math.max(P.blessed,1);SFX.shrine();notice('You pray. For once, something seems to listen. You are Blessed.')}else notice(takeU(t,FL[t])||GENERIC[t]);break;
    case'cauldron':p.st=1;notice('It is warm, though there\'s no fire under it. A bubble brings something up. '+grant([pick(['potion','hallowed','bitterleaf','elixir'])]));break;
    case'hive':{p.st=1;const h=Math.min(10,P.max-P.hp);P.hp+=h;notice(`You scoop out some honey while the bees are elsewhere.${h?` +${h} HP.`:''}`);break}
    case'haystack':case'hay':p.st=1;notice(chance(.35)?'Something is buried in the hay. '+grant([lootRoll(AR.i)]):'Just hay.');break;
    default:{p.st=1;let s=takeU(t,FL[t]||[])||GENERIC[t]||'Nothing of note.';
      if(LOOTY.has(t)&&chance(.5)){const g=rummage(tierHere(),chance(.3)?coinsFor():0,'');if(g)s+='\n\n'+g}notice(s)}}}
function breakProp(p){p.broken=1;map[id(p.tx,p.ty)]=LV.kind==='interior'?FLOOR:G;p.solid=false;SFX.thunk();SFX.dig();
  for(let k=0;k<10;k++)particles.push({x:p.x,y:p.y,vx:(Math.random()-.5)*40,vy:-10-Math.random()*20,g:40,life:.8,c:pick(['#5a3e26','#7a5a36','#3a2414']),w:'leaf'});
  if(chance(.3))setTimeout(()=>notice(rummage(Math.min(3,AR.i),chance(.3)?coinsFor():0,'Just splinters.')),250)}
const chips=(p,cols,n=8)=>{for(let k=0;k<n;k++)particles.push({x:p.x+(Math.random()-.5)*10,y:p.y-4,vx:(Math.random()-.5)*36,vy:-10-Math.random()*20,g:40,life:.7,c:pick(cols),w:'leaf'})};
function strikeProp(p){const t=pkey(p);
  switch(t){
    case'banner':if(!p.torn){p.torn=1;SFX.thunk();chips(p,['#2a2a6a','#c9a24b'],10)}break;
    case'barrel':case'crate':if(!p.broken)breakProp(p);break;
    case'bell':ringBell(p);break;case'brazier':lightBrazier(p);break;
    case'nest':SFX.thunk();if(!p.st){p.st=1;setTimeout(()=>notice('A nest falls out of the branches. '+grant([pick(['battooth','potion','button','ring','hallowed'])])),250)}break;
    case'chime':SFX.chime();break;case'owl':SFX.hoot();p.turn=3;break;
    case'crystal':SFX.bell((Math.random()*4)|0);p.flash=.8;break;
    case'orevein':SFX.clang();chips(p,['#6a645c','#8a8478']);p.hits=(p.hits||0)+1;if(p.hits===3&&!p.st){p.st=1;notice('A piece of the vein breaks away. '+grant([oreFor(tierHere()),chance(.5)?'shard':'scrap']))}break;
    case'hive':SFX.bat();P.hp=Math.max(1,P.hp-4);clog('Bees: −4 HP','','#e07a6a','','world');amb('The bees pour out. −4 HP.',2200,true);break;
    case'sheep':SFX.baa();p.fl=1.5;break;
    case'flowers':for(let k=0;k<14;k++)particles.push({x:p.x+(Math.random()-.5)*20,y:p.y,vx:(Math.random()-.5)*30,vy:-10-Math.random()*20,g:25,life:1.2,c:pick(['#e84a4a','#f0d84a','#f4f4f4','#b86ae8','#f08ac8']),w:'leaf'});break;
    case'cairn':if(p.st){SFX.thunk();break}p.st=1;SFX.dig();chips(p,['#6a645c','#4a4640'],12);if(chance(.35))setTimeout(()=>notice('Something was under the stones. '+grant([lootRoll(Math.min(3,AR.i))])),300);break;
    case'haystack':case'hay':case'scare':SFX.thunk();chips(p,['#c8a24b','#a88a3a','#8a6a2a']);break;
    case'well':case'minecart':case'cage':case'cauldron':case'anvil':SFX.clang();break;
    default:SFX.thunk()}}
function well(p){p.st++;SFX.shout();
  if(p.st===1)notice('You call into the well. Your voice comes back a moment late, and not quite right.');
  else if(p.st===2)notice('You call again. Something answers, in a different voice.');
  else{notice('You call a third time. A flask is thrown up out of the dark and lands at your feet, with a note tied to it: GO AWAY. '+grant(['hallowed','rock'],ri(10,25)))}}
/* the hungry shrine wants one particular thing (a consumable, picked once per shrine) and gives back exactly one piece of gear */
async function hungry(p){p=p||{};if(!p.want)p.want=pick(['potion','bandage','bitterleaf','hallowed','lampoil']);const nm=ITEMS[p.want].n,an=/^[aeiou]/i.test(nm)?'an':'a';
  if(p.fed){await dialog('A hungry shrine','The stone mouth is shut.',['Leave']);return}
  const ch=[];if(hasItem(p.want))ch.push(`Offer ${an} ${nm}`);ch.push('Leave');
  const c=ch[await dialog('A hungry shrine',`A stone bowl on a pedestal, carved with an open mouth. Scratched into the rim, over and over: ${nm.toUpperCase()}.${hasItem(p.want)?'':` You have no ${nm.toLowerCase()} to give it.`}`,ch)];
  if(c&&c.startsWith('Offer')){p.fed=p.fedP=p.fedG=1;removeItem(p.want);const g=genGear(Math.min(3,AR.i+1),{min:2,max:3,noU:1});SFX.coin();notice('The bowl takes it. Something clatters out of the stone mouth. '+grant([g]))}}
function ringBell(p){SFX.bell(p.pitch);p.flash=.7;if(LV.bellSolved)return;LV.bellSeq.push(p.pitch);const i=LV.bellSeq.length-1;
  if(LV.bellSeq[i]!==BELL_ORDER[i]){LV.bellSeq=[];setTimeout(()=>SFX.thud(),800);return}
  if(LV.bellSeq.length===4){LV.bellSolved=true;const pz=LV.puzzle;setTimeout(()=>{[0,1,2,3].forEach(i=>setTimeout(()=>SFX.bell(i),i*140));const s=safeChestSpot(pz.x,pz.y);addChest(s.x,s.y,['tolling','elixir']);
    for(let k=0;k<20;k++)particles.push({x:s.x*T+8,y:s.y*T+8,vx:(Math.random()-.5)*40,vy:-20-Math.random()*30,g:20,life:1.4,c:pick(['#ffd870','#c9a24b']),w:'spark'});amb('The bells ring together. The ground opens.',3200)},900)}}
function lightBrazier(p){if(LV.brazSolved||p.lit>0)return;p.lit=14;SFX.ignite();
  const bz=props.filter(q=>q.t==='brazier');
  if(bz.every(q=>q.lit>0)){LV.brazSolved=true;bz.forEach(q=>q.lit=1e9);const pz=LV.puzzle;setTimeout(()=>{SFX.chime();const s=safeChestSpot(pz.x,pz.y);addChest(s.x,s.y,['ember','elixir']);amb('Three flames burn blue. Something in the stone answers.',3200)},600)}}
function fairy(p){const q=p.pair;if(!q)return;SFX.chime();
  for(let k=0;k<16;k++)particles.push({x:p.x,y:p.y,vx:(Math.random()-.5)*40,vy:-10-Math.random()*30,g:-5,life:1,c:pick(['#f0a0f0','#ffd8ff','#b86ae8']),w:'spark'});
  P.x=q.x;P.y=q.y+20;q.away=false;P.trail=[];pushAway(P.x,P.y,4*T);updCam();fadeFlash();
  for(let k=0;k<16;k++)particles.push({x:q.x,y:q.y,vx:(Math.random()-.5)*40,vy:-10-Math.random()*30,g:-5,life:1,c:pick(['#f0a0f0','#ffd8ff','#b86ae8']),w:'spark'});
  /* both rings wither away once used: they are baked into the ground, so redraw the bits of ground they were on */
  for(const r of[p,q]){r.t='ringdone';for(const dx of[-16,0,16])for(const dy of[-12,0,12]){CPRE.delete(Math.floor((r.x+dx)/256)+','+Math.floor((r.y+dy)/256));LV.chunks.delete(Math.floor((r.x+dx)/256)+','+Math.floor((r.y+dy)/256))}}}
/* a chest behind a tool gate is worth at least as much as the place where you found that tool */
function openChest(c){if(c.locked){if(!P.tools.keys){toast('Locked, with a royal seal pressed into the wax over the keyhole.',2800);return}c.locked=0;c.hoard=1;SFX.clang()}
  if(c.hoard){c.hoard=0;const t=clamp(Math.round(AR.i*.9+LV.prog*1.1)+1,0,3);c.loot=[genGear(t,{min:3}),chance(.5)?oreFor(t):pick(['potion','elixir','hallowed'])];c.gold=coinsFor()*4}
let tier=clamp(Math.round(AR.i*.9+LV.prog*1.1),0,3);if(c.need){const ta=toolArea(c.need);if(ta>=0)tier=Math.max(tier,clamp(Math.round(ta*.9+.6),0,3))}let items;
  if(c.relic&&c.loot){c.open=true;SFX.chest();const t=ITEMS[c.loot[0]];addItem(c.loot[0]);SFX.lvl();notice(`${TOOLS[t.tool].ow} ${TOOLS[t.tool].bt}`,`You found the ${t.n}`);return}
  if(c.loot)items=c.loot.slice();else{items=c.secret||c.veil||chance(.22)?[genGear(Math.min(3,tier+(c.secret?1:0)),{min:c.secret||c.veil?3:1,mf:c.secret?.5:0})]:[chance(.4)?pick(['potion','bandage','hallowed','bitterleaf','lampoil']):chance(.35)?oreFor(tier):pick(JUNK)];if(chance(.35))items.push(chance(.2)?oreFor(tier):chance(.3)?pick(['potion','hallowed','bitterleaf','lampoil']):pick(JUNK))}
  if(chance(c.secret||c.veil?.35:c.gold?.5:.1))items.push(gemFor(tier));
  if(!c.secret&&!c.veil&&chance(.08)){P.st.poison=4;SFX.hiss();notice('A needle springs from the lock and finds your thumb. You are poisoned.')}
  c.open=true;rec('chests',1);SFX.chest();notice('Inside the chest: '+grant(items,c.gold||(c.loot||chance(.5)?0:coinsFor())).replace(/^You find /,''));
  for(let i=0;i<12;i++)particles.push({x:c.x*T+8,y:c.y*T+6,vx:(Math.random()-.5)*24,vy:-12-Math.random()*20,g:10,life:1,c:pick(['#ffd75e','#c9a24b','#fff0b0']),w:'spark'})}

/* ================= MERCHANT ================= */
let crowTalk=0;
/* Mortimer keeps different stock wherever he perches: what the road ahead calls for, and not much of it */
const STOCKS=[
  ()=>[['bandage',4],['potion',3],['bitterleaf',2],['ore1',2],['G',0,{min:2,max:2,noU:1}],['G',0,{min:2,max:2,noU:1,wt:'axe',slot:'weapon'}],['G',0,{min:2,max:3,noU:1,slot:'shield'}]],
  ()=>[['lampoil',3],['potion',3],['hallowed',2],['ore1',2],['ore2',1],['G',1,{min:2,max:3,noU:1,wt:pick(['mace','hammer']),slot:'weapon'}],['G',1,{min:2,max:3,noU:1,slot:'helm'}],['G',1,{min:2,max:2,noU:1}]],
  ()=>[['bitterleaf',4],['bandage',3],['potion',3],['elixir',1],['ore2',2],['G',2,{min:2,max:3,noU:1,wt:pick(['dagger','scythe']),slot:'weapon'}],['G',2,{min:2,max:3,noU:1,slot:'boots'}],['G',2,{min:2,max:3,noU:1}]],
  ()=>[['potion',4],['hallowed',2],['elixir',1],['ore2',2],['ore3',1],['G',3,{min:3,max:3,noU:1}],['G',3,{min:2,max:3,noU:1,slot:'armor'}],['G',3,{min:2,max:3,noU:1,wt:pick(['spear','great']),slot:'weapon'}]]];
const STOCK_ROAD=()=>[['potion',1],[pick(['bandage','bitterleaf','lampoil','hallowed']),1],['G',Math.min(3,AR.i+1),{min:3,max:3,noU:1}],['G',Math.min(3,AR.i+1),{min:2,max:3,noU:1}]];
/* a visit is every arrival on a map (gate, door, travel): Mortimer's gear is new each visit. His consumables are one stock per region that never refills */
let VISIT=Date.now();
function consStock(p){if(p.road){if(!p.cons)p.cons=STOCK_ROAD().filter(([id])=>id!=='G'&&ITEMS[id]).map(([id,n])=>({id,n}));return p.cons}
  if(!AR.mcons)AR.mcons=STOCKS[AR.i]().filter(([id])=>id!=='G'&&ITEMS[id]).map(([id,n])=>({id,n:Math.max(1,Math.ceil(n/2))}));return AR.mcons}
const dropGen=id=>{if(/^g\d+$/.test(id)&&!P.bag.concat(P.stash).some(b=>b.id===id)&&!Object.values(P.eq).includes(id))delete ITEMS[id]};
function gearStock(p){for(const s of p.gear||[])if(s.n>0)dropGen(s.id);
  const L=(p.road?STOCK_ROAD:STOCKS[AR.i])().filter(([id])=>id==='G').map(([,t,o])=>({id:genGear(t,o),n:1}));
  if(chance(.5))L.push({id:gemFor(tierHere()),n:1});
  if(!p.road){const t=tierHere();L.push({id:genGear(t,{min:2,max:3,noU:1}),n:1},{id:genGear(t,{min:2,max:2,noU:1}),n:1})}p.gear=L;p.gam=null}
function freshStock(p){if(p.vis!==VISIT||!p.gear){p.vis=VISIT;gearStock(p)}return consStock(p).filter(s=>s.n>0).concat(p.gear.filter(s=>s.n>0))}
/* gambling, as with Gheed: pay for an unknown piece of a given kind. Mostly it has a little magic in it; now and then it is something else entirely */
const GAMBLE_SLOTS=['weapon','shield','helm','armor','legs','gloves','boots','belt','cloak','amulet','ring','charm'];
const gamblePrice=(slot,t)=>Math.round((70+80*t+20*t*t)*(slot==='ring'||slot==='amulet'||slot==='charm'?1.5:1));
function gambleList(p){if(!p.gam){const t=tierHere();p.gam=GAMBLE_SLOTS.map(slot=>({slot,t,pr:gamblePrice(slot,t)}))}return p.gam}
function gambleItem(slot,t){const q=Math.random(),own=owned();
  if(q<.03){const u=Object.keys(UNIQ).filter(id=>ITEMS[id].slot===slot&&UNIQ[id]<=t&&!own.has(id));if(u.length)return rollUnique(pick(u),t)}
  if(q<.07&&t>=1){const s=[];for(const k in SETS)if(SETS[k].t<=t)s.push(...SETS[k].pieces.filter(id=>ITEMS[id].slot===slot&&!own.has(id)));if(s.length)return pick(s)}
  const r=Math.random(),ex=r<.04?5:r<.13?4:r<.36?3:2;return genGear(t,{slot,exact:ex,noU:1})}
const restockPrice=()=>20+20*AR.i;
const forgetPrice=()=>Math.round(30*P.lv*(1+.5*(P.forgot||0)));
async function shop(p){if(DIFF.hc)return;SFX.caw(.9);openTrade('buy',p)}
/* Hardcore: Mortimer never trades with you. He is not gone, though. He keeps count, and after Harrow falls he comes to collect */
const HC_CROW=['A crow sits on a branch above the camp. It looks at your purse, then at you, and does not come down.','A crow calls once from somewhere above the camp.','A black feather lies on the anvil, laid very straight.','Wings settle behind you. When you turn there is only a branch, still moving.','A crow follows you along the road for a while, tree to tree. It never lands where you could reach it.','A crow with a satchel watches you from too far away to call to.'];
async function secretEnd(){SFX.caw&&SFX.caw(1);
  await notice('The field goes quiet. Then a single crow drops out of the dark and lands on Harrow\'s fallen shield. It has a satchel.');
  await dialog('Mortimer','“You never came to see me.”\n\nHe hops closer.\n\n“Not once, the whole way. I waited by every fire. I carried what you might need. You walked past all of it.”',['I never needed you','Who are you?']);
  await dialog('Mortimer','“Your brother came to me at the end, and paid what I asked. Everyone does.”\n\nHe spreads his wings.',['…']);
  SFX.dread&&SFX.dread();cam.shake=.6;fadeFlash();P.hp=0;rec('deaths',1);clog('You died. Mortimer took what you carried.','','#ff6a5a','','every');deleteSave();mode='dead';
  $('#dead h2').textContent='MORTIMER COLLECTS';$('#deadp').textContent='One peck. It is very quick, and he has done it many times before.';
  $('#dstat').textContent=`Secret ending: The Debt · Hardcore · Level ${P.lv}`;$('#rise').textContent='BEGIN AGAIN';$('#dead').style.display='flex'}
async function crowTalkDlg(){const l=crowTalk<CROW_LINES.length?CROW_LINES[crowTalk++]:'“That is all I know.”';await dialog('Mortimer',l,['Back'])}
async function forgetDlg(){const pr=forgetPrice(),sp=Object.values(P.tal).reduce((a,b)=>a+b,0),sa=Object.values(P.attr).reduce((a,b)=>a+b,0);
  if(!sp&&!sa){pflash('You have nothing to forget.');return}
  const c=await dialog('Forget',`“There is a way to forget what you have learned, and start again. It is not cheap.”\n\nEvery talent and stat point you have spent comes back to you to spend again (${sp} talent, ${sa} stat).\n\n${pr} gold. You have ${P.gold}.`,['Forget it all','Leave']);
  if(c!==0)return;if(P.gold<pr){pflash("You can't afford that.");return}
  P.gold-=pr;rec('spent',pr);P.forgot=(P.forgot||0)+1;P.pts+=sp;P.tal={};P.apts=(P.apts||0)+sa;for(const k in P.attr)P.attr[k]=0;recalc();P.hp=Math.min(P.hp,P.max);P.mp=Math.min(P.mp,P.mmax);buildKnight();SFX.dread();pflash('It leaves you dizzy. Everything you learned is waiting to be learned again.');renderPack()}

/* ================= HUNTERS (0.16) =================
   Once in each region something picks up your trail. It is far tougher than anything else there, it never loses interest, and if you leave
   the map it follows you onto the next one. Kill it and it always carries a piece of a set. Running only buys time */
const HUNTERS=[
  {kind:'poacher',name:'The Huntsman',warn:'A horn sounds, close. Then a second, closer. You are being hunted.',intro:'The Huntsman steps out of the trees, wiping his knife. He says nothing.'},
  {kind:'revenant',name:'The Foreman',warn:'A pick strikes stone somewhere behind you. Then again, nearer.',intro:'The Foreman has followed you through three tunnels. His lamp went out long ago and he doesn\'t seem to need it.'},
  {kind:'hag',name:'Mother Gall',warn:'An old woman starts laughing out in the reeds, and keeps laughing.',intro:'Mother Gall comes out of the reeds with a sack over her shoulder and a cleaver in her hand.'},
  {kind:'knight',name:'Sir Aldous the Faithless',warn:'Hoofbeats behind you, then nothing. The rider has got down and is coming on foot.',intro:'Sir Aldous lifts his visor. "The King has named you traitor," he says. "I am sworn to bring you before him, alive or dead."'}];
function hunterFoe(f,m){const H=HUNTERS[AR.i]||HUNTERS[0];f.name=H.name;f.hp=f.max=Math.round(f.max*3.2);f.atk=Math.round(f.atk*1.35*10)/10;f.def+=2;f.ini+=2;f.xpm=(f.xpm||1)*4;f.hunter=1;f.ek=f.kind;return f}
/* the prize: a set piece you don't have yet (any set, if none is open to this region), else something legendary */
function hunterPrize(){const own=owned(),t=tierHere(),s=[];for(const k in SETS)if(SETS[k].t<=Math.max(1,t))s.push(...SETS[k].pieces.filter(id=>!own.has(id)));
  if(!s.length)for(const k in SETS)s.push(...SETS[k].pieces.filter(id=>!own.has(id)));return s.length?pick(s):genGear(Math.min(3,t+1),{exact:5,noU:1})}
function hunterSpot(){let best=null,bd=0;for(let k=0;k<60;k++){const a=Math.random()*6.283,r=(11+Math.random()*5)*T,x=P.x+Math.cos(a)*r,y=P.y+Math.sin(a)*r,tx=Math.floor(x/T),ty=Math.floor((y-3)/T);
    if(tx<2||ty<2||tx>MW-3||ty>MH-3||!REACH||!REACH[id(tx,ty)]||!boxFree(x,y)||inPocket(tx,ty))continue;const onS=Math.abs(x-P.x)<W/2&&Math.abs(y-P.y)<H/2;if(!onS)return{x,y};if(r>bd){bd=r;best={x,y}}}return best}
function spawnHunter(){const H=HUNTERS[AR.i]||HUNTERS[0];if(mobs.some(m=>m.hunter))return true;const s=hunterSpot();if(!s)return false;
  const m=makeMob(H.kind,s.x,s.y);m.hunt=1;m.hunter=1;mobs.push(m);return true}
function startHunter(){if(LV.kind!=='zone'||AR.hunter)return;AR.hunter={on:1};if(!spawnHunter()){AR.hunter=null;return}const H=HUNTERS[AR.i]||HUNTERS[0];
  SFX.dread&&SFX.dread();setTimeout(()=>SFX.howl&&SFX.howl(),600);notice(H.warn,'You are being hunted')}
/* it follows you from map to map within its region (never into houses: it waits outside) */
function hunterFollow(){if(!AR.hunter||AR.hunter.done||LV.kind!=='zone')return;setTimeout(()=>{if(LV.kind==='zone'&&AR.hunter&&!AR.hunter.done&&(mode==='world'||mode==='note')&&spawnHunter())amb('It followed you.',3200,true)},7000)}

/* ================= EVENTS ================= */
const EVENTS=[
  {w:4,f:()=>startHunter()},
  {w:3,f:async()=>{if(DIFF.hc)return;await notice('Mortimer drops out of the sky onto a branch beside you. “Business,” he says.');await shop({road:1})}},
  {w:2,f:()=>{const n=20+P.lv*6;SFX.chime();notice(`A star falls, close enough that you see where it lands. You stand there a while, thinking. +${n} XP.`);gainXP(n)}},
  {w:2,f:()=>{P.blessed=Math.max(P.blessed,2);SFX.shrine();notice('A pale shape passes straight through you, and you are cold to the bone. You are Blessed.')}},
  {w:2,f:()=>{const h=Math.round((P.max-P.hp)*.5);P.hp+=h;P.mp=Math.min(P.mmax,P.mp+4);SFX.heal();notice(`A long stretch of quiet. You catch your breath.${h?` +${h} HP.`:''}`)}},
  {w:2,f:()=>{const g=chance(.5)?genGear(AR.i,{min:2}):pick(['potion','hallowed','lampoil']);SFX.caw(.8);notice('A crow lands on your shoulder, drops something into your hand and flies off. '+grant([g]))}},
  {w:2,f:()=>{EV.blood=180;SFX.dread();notice('The moon comes up red.')}},
  {w:2,f:()=>{const c=P.bag.filter(b=>ITEMS[b.id].use);if(!c.length)return;const b=pick(c);removeItem(b.id);toast(`Something small and quick tugs at your belt. Your ${ITEMS[b.id].n} is gone.`,4000,true)}},
  {w:3,f:()=>{if(LV.kind!=='zone')return;for(let k=0;k<40;k++){const a=Math.random()*6.283,tx=Math.floor(P.x/T+Math.cos(a)*10),ty=Math.floor(P.y/T+Math.sin(a)*10);if(tx<2||ty<2||tx>MW-3||ty>MH-3||BLOCK[map[id(tx,ty)]]||inPocket(tx,ty))continue;
      const pk=AREA_PACK[LV.type],m=makeMob(pk,tx*T+8,ty*T+12);m.n=Math.min(3,KINDS[pk].units.length+1);m.hunt=1;mobs.push(m);break}if(LV.type==='woods'){SFX.howlpack();amb('Howling, close, and getting closer.',3600,true)}else{SFX.dread();amb('Something is coming, and there is more than one of it.',3600,true)}}},
  {w:2,f:()=>{const n=ri(10,25)*(1+AR.i);notice('A purse lies in the grass, half rotted. '+grant([],n))}},
  {w:2,f:()=>{if(LV.kind!=='zone')return;const d=Math.round(P.max*.12);P.hp=Math.max(1,P.hp-d);SFX.thud();notice(LV.type==='cave'?`Stones come loose from the ceiling. One of them finds you. −${d} HP.`:`A dead branch lets go above you. You hear it a moment too late. −${d} HP.`)}},
  {w:1,f:()=>{if(P.gold<10)return;const n=Math.max(5,Math.round(P.gold*.15));P.gold-=n;notice(`Your purse feels lighter. A hole has worn through the bottom. You lost ${n} gold somewhere back there.`)}},
  {w:1,f:()=>{SFX.caw(1);amb('A raven lands on a stone nearby, looks at you a while, and flies on.',4200)}},
];
function triggerEvent(){let tot=0;for(const e of EVENTS)tot+=e.w;let r=Math.random()*tot;for(const e of EVENTS){r-=e.w;if(r<=0){e.f();return}}}

/* ================= WORLD UPDATE ================= */
let pendHit=false;
/* every weapon swings its own way out here: r = reach ahead, w = half-width to the sides, arc = how wide the sweep is drawn (0 = a thrust),
   back = how far it reaches round behind you (only the scythe's sweep does) */
const WSWING={sword:{dur:.22,cd:.4,r:22,w:16,arc:2.6,len:15},dagger:{dur:.13,cd:.24,r:16,w:7,arc:0,len:11},axe:{dur:.26,cd:.46,r:22,w:15,arc:2.2,len:15},
  mace:{dur:.26,cd:.46,r:20,w:15,arc:2.2,len:14},flail:{dur:.32,cd:.5,r:23,w:20,arc:3.8,len:16},great:{dur:.32,cd:.6,r:28,w:20,arc:3,len:21},
  hammer:{dur:.34,cd:.62,r:21,w:18,arc:2.2,len:17,slam:1},spear:{dur:.2,cd:.44,r:31,w:7,arc:0,len:25},halberd:{dur:.3,cd:.56,r:29,w:14,arc:1.8,len:23},
  scythe:{dur:.34,cd:.58,r:26,w:26,arc:4.4,len:20,back:7}};
const swingOf=()=>WSWING[wType()]||WSWING.sword;
function doSlash(){if(P.slashCd>0||pendHit)return;const S=swingOf();P.slashT=S.dur;P.slashDur=S.dur;P.slashCd=S.cd;S.arc?SFX.slash():SFX.whoosh();
  const[fx,fy]=FD[P.face],reach=Math.min(S.r*.55,15),hx=P.x+fx*reach,hy=P.y-6+fy*reach,ox=P.x,oy=P.y-6;
  const inArc=(x,y,big,ex=0)=>{/* only the half in front of you: al is how far ahead the point is, so nothing behind (or level with your back) can be hit */
    const dx=x-ox,dy=y-oy,al=dx*fx+dy*fy,lat=Math.abs(dy*fx-dx*fy);return al>=-(S.back||0)&&al<S.r+(big?9:0)+ex*.9&&lat<S.w+(big?9:0)+ex*.9};
  /* if the swing catches more than one creature, only the nearest is hit */
  let best=null,bd=1e9;
  for(const m of mobs){const im=SPR[m.kind]&&SPR[m.kind][0],sc=m.boss?2:1,hw=im?im.width*sc/2:6,hh=im?im.height*sc:12,ex=Math.max(0,hw-7);
    const my=m.state==='dormant'?m.y-10:m.y-Math.min(6,hh/2),my2=m.y-hh*.6;
    /* test the point of the creature's body nearest the swing, not just its centre: big things are easy to hit */
    const nx=clamp(ox,m.x-hw*.85,m.x+hw*.85),ny=clamp(oy,m.y-hh*.9,m.y);
    if(inArc(m.x,my,m.boss,ex)||inArc(m.x,my2,m.boss,ex)||inArc(nx,ny,m.boss,5)){const dd=Math.hypot(nx-ox,ny-oy);if(dd<bd){bd=dd;best={m,my}}}}
  if(best){const m=best.m,my=best.my;for(let i=0;i<10;i++)particles.push({x:m.x,y:my,vx:(Math.random()-.5)*60,vy:-10-Math.random()*40,g:60,life:.5,c:pick(['#ffffff','#ffe8a0','#d8402a']),w:'spark'});
      if(m.state==='dormant'&&m.kind!=='strawman'){m.state='waking';m.t=0;SFX.creak();m.first='player';return}
      if(m.state==='dormant')m.state='awake';
      SFX.thud();m.stun=1;P.inv=Math.max(P.inv,.6);pendHit=true;setTimeout(()=>{pendHit=false;if(mode==='world'&&mobs.includes(m))startBattle(m,'player')},260);return}
  for(const p of props){if(p.tree||p.broken)continue;if(inArc(p.x,p.y,false)&&Math.hypot(p.x-hx,p.y-hy)<Math.max(18,S.r*.7)){strikeProp(p);return}}
  if(S.slam)setTimeout(()=>{cam.shake=Math.max(cam.shake||0,.15);for(let k=0;k<14;k++){const a=k/14*6.283;particles.push({x:hx,y:hy+4,vx:Math.cos(a)*40,vy:Math.sin(a)*20,g:0,life:.35,c:'#a8a090',w:'spark'})}},S.dur*600);
  const tx=Math.floor(hx/T),ty=Math.floor((hy+4)/T),tt=tAt(tx,ty);
  if(isTree(tt)){const p=PROPAT[id(tx,ty)];if(p&&p.tree){strikeProp(p);return}}
  strikeSurface(tx,ty,hx,hy,tt)}
/* hitting the world: everything answers in its own way, and now and then something turns up */
const TSHAKE=new Map();
function strikeSurface(tx,ty,hx,hy,t){const burst=(n,cols,vy=-20,g=50,w='spark',life=.6)=>{for(let i=0;i<n;i++)particles.push({x:hx+(Math.random()-.5)*6,y:hy+(Math.random()-.5)*4,vx:(Math.random()-.5)*36,vy:vy-Math.random()*20,g,life,c:pick(cols),w})};
  if(takeCache(tx,ty))return;const k=tx+','+ty,once=!(LV.struck||(LV.struck={}))[k];LV.struck[k]=1;
  const find=(p,msg)=>{if(!once||!chance(p))return false;const g=chance(.5)?Math.max(1,Math.round(coinsFor()*.6)):0,it=g?null:chance(.7)?pick(JUNK):lootRollOld(tierHere());const s=grant(it?[it]:[],g);if(s){SFX.coin();amb(msg+' '+s.replace(/^You find /,''),3000)}return true};
  if(isTree(t)){SFX.thunk();TSHAKE.set(k,time);burst(6,LV.type==='swamp'?['#22301a','#3a4a24','#4a3a20']:['#18301e','#213f27','#3a2a1d','#4a6a2a'],-14,40,'leaf',.9);
    if(once&&chance(.12)){SFX.caw&&SFX.caw(.7);for(let i=0;i<3;i++)crows.push({x:hx,y:hy-14,t:0,st:1,vx:(Math.random()-.5)*60,vy:-30-Math.random()*20})}
    else find(.04,'Out of the branches drops');return}
  if(t===WALL||t===ROCKT||t===STN||t===CRACK){SFX.clang();burst(7,['#6a645c','#8a8478','#ffd75e','#c8c0b0'],-16,60);if(t!==CRACK)find(.025,'A loose stone comes away. Behind it:');else amb('There\'s a crack in it, but a blade won\'t open it.',2000);return}
  if(t===DEADFALL){SFX.thunk();burst(6,['#7a5a34','#4a3420','#c8a878'],-14,60);amb(P.tools.axe?'A sword won\'t do it. Use the axe.':'You hack at it and barely mark it. This needs an axe.',2000);return}
  if(t===BOARDS){SFX.thud();burst(4,['#7a5a34','#4a3420'],-10,60);amb('The boards hold. They need prising off, not hitting.',2000);return}
  if(t===SPOIL){SFX.dig&&SFX.dig();burst(6,['#6a5236','#4a3a24'],-12,60);amb('Your blade goes in and comes out muddy. This needs digging.',2000);return}
  if(t===IRONG){SFX.clang();burst(6,['#ffd75e','#c8c8c8'],-14,60);amb('Iron. Your sword would break first.',2000);return}
  if(t===MIRE){SFX.squelch();burst(8,['#3a3a1c','#5a5030'],-18,80);return}
  if(t===BRAMBLE){SFX.rustle();burst(6,['#3a2a1a','#5a3a1a','#2a4a1a'],-14,40,'leaf');amb('The brambles spring straight back. Fire might do it.',2000);return}
  if(t===WATER||t===DEEP){SFX.splash();burst(10,['#8ac8f0','#c8e8ff','#5a9ac8'],-30,90,'spark',.5);if(LV.type!=='cave'&&once&&chance(.05)){amb('Something silver flicks away under the surface.',2000)}return}
  if(t===BOG){SFX.squelch();burst(8,['#2a3a24','#4a5a34','#1a2a18'],-22,80);find(.03,'Out of the bog comes');return}
  if(t===MUD){SFX.squelch();burst(7,['#5a4a30','#3a3020','#6a5a3a'],-18,80);return}
  if(t===FIRE){SFX.ignite();burst(14,['#ffd870','#f08a24','#c8401a'],-40,-10,'spark',.8);return}
  if(t===BRIDGE){SFX.thunk();burst(5,['#6a4a2e','#3a2414','#8a6a4a'],-14,60);return}
  if(t===DOOR||t===IDOOR||t===BLDG||t===IWALL){SFX.thud();burst(5,['#5a4a3a','#3a3028','#8a7a6a'],-10,60);if(t===DOOR)amb(pick(['Nobody answers.','You knock. Nobody answers.','Inside, a floorboard creaks, and then nothing.']),1800);return}
  if(t===CHEST){SFX.clang();burst(5,['#c9a24b','#ffe8a0'],-16,60);return}
  if(t===ROAD||t===FLOOR){SFX.thud();burst(6,LV.kind==='interior'?['#5a5650','#3a3632']:['#8a7a5a','#6a5a40','#a89a78'],-8,30,'smoke',.7);find(.015,'Trodden into the dirt:');return}
  if(t===G){SFX.rustle();burst(7,LV.type==='plains'?['#5a9a3a','#7ab84a','#3a7a2a']:LV.type==='cave'?['#4a4640','#6a645c']:['#2a4a2a','#3a5a30','#1a3a20'],-16,60,'leaf',.6);find(.02,'In the cut grass:');return}
  SFX.thunk()}
let exitAway=true,stT=0;
/* afflictions carry on outside battle: one 'turn' every 4 seconds, never lethal out here */
let floats=[];
/* damage numbers live in world space: they stay where you were hit, and climb up-right in hard pixel steps */
function addFloat(x,y,t,c){floats.push({x,y,t,c:c||'#ff3a2a',age:0})}
function updFloats(dt){for(const f of floats)f.age+=dt;floats=floats.filter(f=>f.age<1.7)}
/* floating text everywhere uses one clear font: a bold sans with a solid dark outline, so it reads over any background */
const FT_FONT=s=>`800 ${s}px Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif`;
function otext(t,x,y,fill,w=2.4){ctx.lineJoin='round';ctx.miterLimit=2;ctx.lineWidth=w;ctx.strokeStyle='rgba(0,0,0,.92)';ctx.strokeText(t,x,y);ctx.fillStyle=fill;ctx.fillText(t,x,y)}
function drawFloats(){if(!floats.length)return;ctx.font=FT_FONT(8.5);ctx.textBaseline='alphabetic';
  for(const f of floats){const st=Math.floor(f.age/.16),x=Math.round(f.x-cam.x)+st,y=Math.round(f.y-cam.y)-st*2;ctx.globalAlpha=f.age>1.25?Math.max(0,1-Math.floor((f.age-1.25)/.15)*.34):1;
    otext(f.t,x,y,f.c)}ctx.globalAlpha=1}
function stTick(){let hurt=0,n=0;const dm={poison:2+Math.floor(P.lv/3),bleed:2+Math.floor(P.lv/3),burn:3+Math.floor(P.lv/2)};
  for(const k of['poison','bleed','burn']){if(!P.st[k])continue;const d=Math.min(dm[k],P.hp-1);if(d>0){P.hp-=d;hurt+=d;if(typeof hpLog==='function')clog(`${STATUS[k].n}: −${d} HP`,'','#e07a6a','','world');addFloat(P.x+7,P.y-16-n*9,'- '+d,{poison:'#7ad83a',bleed:'#ff3a2a',burn:'#ff8a1a'}[k]);n++}if(--P.st[k]<=0)delete P.st[k]}
  for(const k of['blind','wither'])if(P.st[k]&&--P.st[k]<=0)delete P.st[k];
  if(hurt){particles.push({x:P.x,y:P.y-18,vx:0,vy:-14,g:0,life:.9,c:P.st.bleed?'#d83a3a':'#9ac84a',w:'spark'})}}
/* hidden chests at the end of dead ends: no marker at all; walk right up to one and it is there */
function revealVeiled(){for(const c of chests)if(c.veil&&Math.abs(c.x*T+8-P.x)<T*1.3&&Math.abs(c.y*T+8-(P.y-6))<T*1.3){c.veil=0;map[id(c.x,c.y)]=CHEST;SFX.coin&&SFX.coin();for(let k=0;k<16;k++)particles.push({x:c.x*T+8,y:c.y*T+6,vx:(Math.random()-.5)*30,vy:-10-Math.random()*30,g:5,life:1.3,c:'#ffe8a0',w:'spark'});amb('Tucked away at the end here:',2200)}}
/* the grappling hook: it flies out, bites, and hauls you across (you can't steer while it does) */
let HOOK=null;const HOOK_FLY=.2,HOOK_PULL=.38;
function updHook(dt){HOOK.t+=dt;const k=HOOK.t;if(k>HOOK_FLY){const u=Math.min(1,(k-HOOK_FLY)/HOOK_PULL),e=u*u*(3-2*u);P.x=HOOK.sx+(HOOK.tx-HOOK.sx)*e;P.y=HOOK.sy+(HOOK.ty-HOOK.sy)*e-(HOOK.pole?Math.sin(u*Math.PI)*14:0);P.moving=true;P.anim+=dt*2}
  if(k>=HOOK_FLY+HOOK_PULL){P.x=HOOK.tx;P.y=HOOK.ty;P.trail=[];HOOK=null;SFX.thud&&SFX.thud()}updCam()}
function drawHook(){if(!HOOK)return;if(HOOK.pole)return;const k=HOOK.t,u=Math.min(1,k/HOOK_FLY),hx=HOOK.sx+(HOOK.tx-HOOK.sx)*u,hy=HOOK.sy-8+(HOOK.ty-8-(HOOK.sy-8))*u,px=P.x-cam.x,py=P.y-9-cam.y;
  ctx.strokeStyle='#5a4030';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(hx-cam.x,hy-cam.y);ctx.stroke();ctx.fillStyle='#d8dde3';ctx.fillRect(Math.round(hx-cam.x)-1,Math.round(hy-cam.y)-1,3,3)}
function updWorld(dt){if(HOOK){updHook(dt);return}checkEvSpots();revealVeiled();
  worldTime+=dt;eventT-=dt;if(eventT<=0){eventT=300+Math.random()*420;triggerEvent()}
  if(EV.blood>0)EV.blood-=dt;if(EV.fog>0)EV.fog-=dt;gateCd-=dt;
  P.slashT-=dt;P.slashCd-=dt;P.inv-=dt;bellCd-=dt;stT+=dt;if(stT>=4){stT=0;stTick()}
  {let vx=padV.x,vy=padV.y;
    if(keys.arrowleft||keys.a)vx=-1;if(keys.arrowright||keys.d)vx=1;if(keys.arrowup||keys.w)vy=-1;if(keys.arrowdown||keys.s)vy=1;
    const mag=Math.hypot(vx,vy);P.moving=mag>.1;
    if(P.moving){vx/=Math.max(mag,1);vy/=Math.max(mag,1);
      if(P.slashT<=0)P.face=Math.abs(vx)>Math.abs(vy)?(vx<0?'left':'right'):(vy<0?'up':'down');
      const mud=tAt(Math.floor(P.x/T),Math.floor((P.y-2)/T))===MUD,sp=60*P.speed*DEV.spd*(mud?(LV.type==='swamp'?.45:.6):1)*dt,ox=P.x,oy=P.y;moveBody(P,vx*sp,vy*sp);pzUpdate(dt,vx,vy);rec('dist',Math.hypot(P.x-ox,P.y-oy)/T);P.anim+=dt*(mud?.5:1)}}
  const ptx=Math.floor(P.x/T),pty=Math.floor((P.y-3)/T),here=tAt(ptx,pty);reveal(ptx,pty);
  if(LV.kind==='zone'){
    if(here===EXIT){if(exitAway){exitAway=false;(LV.back&&ptx===LV.back.x&&pty===LV.back.y)?backDialog():exitDialog()}}else exitAway=true;
    if(here===GATE){const g=LV.gates.find(g=>g.tiles.some(([x,y])=>x===ptx&&y===pty));if(g&&g.away!==false){g.away=false;useGate(g);return}}
    else for(const g of LV.gates)if(Math.hypot(P.x-(g.inner.x*T+8),P.y-(g.inner.y*T+12))>40)g.away=true;
  }
  updProps(dt);useT=findUse();$('#btnU').classList.toggle('hot',!!useT&&useT.lvl===2);
  for(const m of mobs){if(Math.abs(m.x-P.x)>700&&Math.abs(m.y-P.y)>700&&!m.hunt)continue;updMob(m,dt)}
  if(mode!=='world')return;
  ambT-=dt;if(ambT<=0){ambT=40+Math.random()*40;const ty=LV.type,r=Math.random();
    if(LV.kind==='interior'){r<.5?SFX.creak():SFX.drip()}else if(ty==='plains')SFX.bird();else if(ty==='cave'){r<.6?SFX.drip():SFX.creak()}else if(ty==='swamp'){r<.6?SFX.croak():SFX.howl()}else{if(r<.3)SFX.howl();else if(r<.5)SFX.caw(.6);else if(r<.62)SFX.creak()}
    if(Math.random()<.3){const k=LV.kind==='interior'?'inside':ty;const ml=LV.kind==='zone'?mapDef().amb:null;amb(ml&&chance(.6)?bagPick('ambm'+curMap(),ml):bagPick('amb'+k,AMBIENT_AREA[k]),3200)}}
  if(LV.kind==='zone'&&LV.type==='plains'&&Math.random()<dt*.15)SFX.bird();
  if(LV.type==='cave'&&Math.random()<dt*.2)SFX.drip();
  for(const c of crows){c.t+=dt;if(c.st===0&&Math.abs(P.x-c.x)<40&&Math.hypot(P.x-c.x,P.y-c.y-10)<38){c.st=1;c.vx=(c.x<P.x?-1:1)*(30+Math.random()*20);c.vy=-35;if(Math.random()<.6)SFX.caw(.8)}
    if(c.st===1){c.x+=c.vx*dt;c.y+=c.vy*dt;c.vy-=8*dt;if(c.y<cam.y-60)c.st=2}}
  if(LV.type!=='plains'&&LV.kind==='zone'){eyeT-=dt;if(eyeT<=0){eyeT=2+Math.random()*4;if(watchers.length<4){for(let k=0;k<20;k++){const tx=Math.floor((cam.x+Math.random()*W)/T),ty=Math.floor((cam.y+Math.random()*H)/T),t1=tAt(tx,ty),t2=tAt(tx,ty+1);
      if(!((isTree(t1)&&isTree(t2))||(t1===WALL&&t2===WALL)))continue;const wx=tx*T+8,wy=ty*T+2;if(Math.hypot(wx-P.x,wy-P.y)<6*T)continue;
      watchers.push({x:wx+(Math.random()*6-3|0),y:wy,life:3+Math.random()*4,a:0,col:pick(['#ff3a22','#ffb02e','#d8ff6a']),gap:pick([3,4,5])});break}}}}
  for(const w of watchers){w.life-=dt;const near=Math.hypot(w.x-P.x,w.y-P.y)<4.5*T;w.a=clamp(w.a+(near||w.life<0?-3:1.2)*dt,0,1)}
  watchers=watchers.filter(w=>w.life>-1||w.a>0);
  updCam()}
function updProps(dt){
  for(const g of glowShrooms){g.puff-=dt;if(g.puff<=0&&!g.cr&&Math.abs(P.x-g.x)<5&&Math.abs(P.y-2-g.y)<4){g.puff=4;SFX.puff();for(let i=0;i<8;i++)particles.push({x:g.x,y:g.y,vx:(Math.random()-.5)*16,vy:-6-Math.random()*10,g:-2,life:1.2,c:'#5fe0c0',w:'spark'})}}
  for(const p of props){if(p.tree)continue;if(Math.abs(p.x-P.x)>260||Math.abs(p.y-P.y)>260){if(p.t!=='brazier')continue}
    p.cd-=dt;if(p.flash>0)p.flash-=dt;if(p.turn>0)p.turn-=dt;if(p.fl>0)p.fl-=dt;if(p.broken)continue;
    const d=Math.hypot(P.x-p.x,(P.y-4)-p.y);
    if(p.t==='ring'){if(d>24)p.away=true;if(d<9&&p.away&&mode==='world'){p.away=false;fairy(p)}continue}
    if(p.t==='frog'){if(p.hop>0){p.hop-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt}else if(d<24&&p.cd<=0){const a=Math.atan2(p.y-P.y,p.x-P.x)+(Math.random()-.5);p.vx=Math.cos(a)*55;p.vy=Math.sin(a)*55;p.hop=.28;p.cd=1.2;if(Math.random()<.6)SFX.croak()}
      p.x=clamp(p.x,p.tx*T-24,p.tx*T+40);p.y=clamp(p.y,p.ty*T-24,p.ty*T+40);continue}
    if(p.t==='sheep'){p.wt=(p.wt||0)-dt;if(d<28){const a=Math.atan2(p.y-P.y,p.x-P.x);p.vx=Math.cos(a)*30;p.vy=Math.sin(a)*30;p.wt=1}else if(p.wt<=0){p.wt=2+Math.random()*3;const a=Math.random()*6.283,st=Math.random()<.5;p.vx=st?0:Math.cos(a)*8;p.vy=st?0:Math.sin(a)*8}
      /* sheep test their whole body against trees, and wander home if they ever end up wedged */
      const nx=p.x+(p.vx||0)*dt,ny=p.y+(p.vy||0)*dt,ok=(x,y)=>passable(x,y+4)&&passable(x-4,y+4)&&passable(x+4,y+4)&&passable(x,y-1);if(ok(nx,ny)&&Math.hypot(nx-(p.tx*T+8),ny-(p.ty*T+8))<56){p.x=nx;p.y=ny}else if(!ok(p.x,p.y)){p.x+=((p.tx*T+8)-p.x)*.1;p.y+=((p.ty*T+8)-p.y)*.1}if(Math.abs(p.vx||0)>1)p.flip=p.vx<0;if(Math.random()<dt*.04&&d<120)SFX.baa();continue}
    /* the fox: bolts when you get close, a little slower than you, and it can't run through trees or water. Corner it or catch it and it drops what it carries */
    if(p.t==='fox'){if(p.st===0&&d<46){p.st=1;p.life=0;SFX.puff()}
      if(p.st===1){p.life+=dt;const a0=Math.atan2(p.y-P.y,p.x-P.x);let moved=false;
        for(const da of[0,.5,-.5,1,-1,1.6,-1.6]){const a=a0+da,nx=p.x+Math.cos(a)*52*dt,ny=p.y+Math.sin(a)*52*dt;if(passable(nx,ny+3)&&passable(nx+4,ny+3)&&passable(nx-4,ny+3)){p.vx=Math.cos(a)*52;p.x=nx;p.y=ny;moved=true;break}}
        if(d<11){p.st=2;SFX.coin&&SFX.coin();notice('You grab the fox by the scruff. It drops what it was carrying and twists free. '+grant([chance(.35)?genGear(tierHere()):lootRoll(tierHere())],chance(.5)?coinsFor():0))}
        else if(d>200||p.life>20)p.st=2}continue}}
  for(const p of props)if(p.t==='brazier'&&p.lit>0&&!LV.brazSolved){p.lit-=dt;if(p.lit<=0){p.lit=0;SFX.hiss()}}}
function updCam(){const ww=MW*T,hh=MH*T;/* follow the player's ROUNDED position, so the knight's on-screen spot never flips a pixel back and forth as the camera and he round differently (the walking jitter) */
  /* the camera moves in half-pixel steps (the canvas is 2x, so still whole real pixels): cam.x/y stay whole numbers for all the drawing code, and the
     leftover half (cam.fx/fy) is applied once as a shift of the whole world layer. Everything that moves is drawn on the same half-pixel grid. */
  const px=R2(P.x),py=R2(P.y),cx=ww<=W?Math.round((ww-W)/2):R2(clamp(px-W/2,0,ww-W)),cy=hh<=H?Math.round((hh-H)/2):R2(clamp(py-8-H/2,0,hh-H));
  cam.x=Math.floor(cx);cam.y=Math.floor(cy);cam.fx=cx-cam.x;cam.fy=cy-cam.y}
function passable(px,py){const tx=Math.floor(px/T),ty=Math.floor(py/T);if(tx<0||ty<0||tx>=MW||ty>=MH)return false;const t=map[ty*MW+tx];return!BLOCK[t]&&t!==DOOR&&t!==IDOOR}
function boxFree(x,y){return passable(x-4,y-4)&&passable(x+3,y-4)&&passable(x-4,y-1)&&passable(x+3,y-1)}
function moveBody(o,dx,dy){if(o===P&&DEV.noclip){o.x=clamp(o.x+dx,T,(MW-1)*T);o.y=clamp(o.y+dy,T,(MH-1)*T);return}if(dx&&boxFree(o.x+dx,o.y))o.x+=dx;if(dy&&boxFree(o.x,o.y+dy))o.y+=dy}
const AGGRO_MUL=1.1,LEASH=1.7,DOUBT=1.8,CHASE=1.1;  /* CHASE stretches every distance used for losing interest, not for noticing */
/* ---- PATHFINDING (0.16): one distance map from the player, rebuilt whenever you step onto a new tile. A chasing creature that can't see
   a straight way to you walks downhill on it, so it goes round lakes and through the gap in a wall instead of pressing its face into it ---- */
let FLOW=null;const FLOW_R=26;
function flowField(){const ptx=Math.floor(P.x/T),pty=Math.floor((P.y-3)/T);if(FLOW&&FLOW.L===LV&&FLOW.x===ptx&&FLOW.y===pty)return FLOW;
  const d=FLOW&&FLOW.L===LV?FLOW.d:new Int16Array(MW*MH);d.fill(-1);const q=new Int32Array(MW*MH);let h=0,t=0;const ok=(x,y)=>x>0&&y>0&&x<MW-1&&y<MH-1&&passable(x*T+8,y*T+8);
  if(ok(ptx,pty)){d[pty*MW+ptx]=0;q[t++]=pty*MW+ptx}
  while(h<t){const c=q[h++],cx=c%MW,cy=(c/MW)|0,dc=d[c];if(dc>=FLOW_R*2)continue;
    for(let k=0;k<8;k++){const ax=[1,-1,0,0,1,1,-1,-1][k],ay=[0,0,1,-1,1,-1,1,-1][k],nx=cx+ax,ny=cy+ay,n=ny*MW+nx;if(d[n]>=0||!ok(nx,ny))continue;
      if(ax&&ay&&(!ok(cx+ax,cy)||!ok(cx,cy+ay)))continue;d[n]=dc+(ax&&ay?3:2);q[t++]=n}}
  return FLOW={L:LV,x:ptx,y:pty,d}}
/* is the straight line from a to b clear for a body? (sampled every half tile) */
function lineFree(ax,ay,bx,by){const L=Math.hypot(bx-ax,by-ay),n=Math.ceil(L/(T*.5));for(let i=1;i<n;i++){const u=i/n;if(!boxFree(ax+(bx-ax)*u,ay+(by-ay)*u))return false}return true}
/* the way to walk towards the player along the distance map, as a unit vector (null if off the map) */
function flowDir(m){const F=flowField(),tx=Math.floor(m.x/T),ty=Math.floor((m.y-3)/T),here=F.d[ty*MW+tx];let best=here>=0?here:1e9,bx=0,by=0;
  for(let k=0;k<8;k++){const ax=[1,-1,0,0,1,1,-1,-1][k],ay=[0,0,1,-1,1,-1,1,-1][k],v=F.d[(ty+ay)*MW+tx+ax];if(v>=0&&v<best){best=v;bx=ax;by=ay}}
  if(!bx&&!by)return null;const gx=(tx+bx)*T+8,gy=(ty+by)*T+11,L=Math.hypot(gx-m.x,gy-m.y)||1;return[(gx-m.x)/L,(gy-m.y)/L]}
/* how things move once they have seen you: wolves and hounds circle before they rush; people spread out and come at you from the sides;
   wisps, imps and hags blink from place to place. Everything else just comes */
const MOVE={wolf:'circle',wolves:'circle',hound:'circle',houndpack:'circle',stag:'circle',gnasher:'circle',
  brigand:'flank',band:'flank',band3:'flank',vagrant:'flank',poacher:'flank',knight:'flank',oathsworn:'flank',archer:'flank',
  wisp:'blink',imp:'blink',imps:'blink',hag:'blink',revenant:'blink'};
function blinkTo(m){const a0=Math.random()*6.283;for(let k=0;k<16;k++){const a=a0+k*.39,r=(2.6+Math.random())*T,x=P.x+Math.cos(a)*r,y=P.y+Math.sin(a)*r,q=id(Math.floor(x/T),Math.floor((y-3)/T));
    if(!boxFree(x,y)||!REACH||!REACH[q])continue;
    const puff=(px,py)=>{for(let i=0;i<12;i++)particles.push({x:px,y:py-8,vx:(Math.random()-.5)*40,vy:-10-Math.random()*25,g:0,life:.6,c:pick(['#b86ae8','#6a3a8a','#d8c8f0']),w:'spark'})};
    puff(m.x,m.y);m.x=x;m.y=y;puff(x,y);SFX.whoosh&&SFX.whoosh();m.det=0;return true}return false}
function updMob(m,dt){
  m.anim+=dt;const dx=P.x-m.x,dy=P.y-m.y,d=Math.hypot(dx,dy);
  if(m.kind==='ent'||m.boss||KINDS[m.kind].ambush||(m.gk&&m.state!=='awake')){
    /* a scarecrow doesn't shake itself awake first: up close it may take a swing at you (and the fight starts), and touching it starts the fight */
    if(m.state==='dormant'&&m.kind==='strawman'){if(mode!=='world'||DEV.peace||P.inv>0)return;if(d<11){m.state='awake';startBattle(m,'contact');return}
      if(d<30){m.swT=(m.swT||0)+dt;if(m.swT>.8){m.swT=0;if(chance(.35)){m.state='awake';SFX.slash();for(let i=0;i<8;i++)particles.push({x:m.x+(P.x-m.x)*.5,y:m.y-10,vx:(Math.random()-.5)*50,vy:-20-Math.random()*20,g:60,life:.4,c:'#d8d0b0',w:'spark'});startBattle(m,'ambush')}}}return}
    if(m.state==='dormant'){if(d<(m.boss?46:26)&&mode==='world'&&!DEV.peace){m.state='waking';m.t=0;m.kind==='elder'||m.kind==='ent'?SFX.creak():m.gk?SFX.thud():SFX.dread();m.first='ambush'}return}
    if(m.state==='waking'){m.t+=dt;if(m.t>.85&&mode==='world'){if(m.kind==='ent'||m.kind==='elder'||m.gk)map[id(m.tx,m.ty)]=G;m.state='awake';startBattle(m,m.first)}return}
    /* once awake (you ran from it), an ent wanders and chases like anything else, only very slowly */
    if(m.kind!=='ent'){m.stun-=dt;if(m.stun<=0&&d<14&&P.inv<=0&&mode==='world'&&!DEV.peace)startBattle(m,'contact');return}}
  if(m.stun>0)m.stun-=dt;if(m.bored>0)m.bored-=dt;
  /* past the first region everything out here moves faster: +12% per region */
  const k=KINDS[m.kind];let sp=k.spd*(EV.blood>0?1.15:1)*1.05*(1+.12*AR.i),tx=0,ty=0;
  if(m.hunter)sp=50*(1+.06*AR.i);  /* a hunter walks a little slower than you: you can get ahead, never away */
  /* NOTICING: within its sight range AND on your screen (so nothing jumps you from off-screen; the screen shows the same area on every phone).
     LOSING INTEREST: once you are beyond its sight range, a chasing mob builds up 'doubt' while it is off-screen, or while it is not actually closing in on you (stuck on a tree,
     water in the way, you outpacing it). Gaining ground on screen clears it. After DOUBT seconds it gives up, stops, and only then wanders off. */
  const aggroR=k.aggro*AGGRO_MUL*T*(EV.blood>0?1.4:1)*(EV.fog>0?.6:1)*(1-(P.stealth||0))*(DEV.peace?0:1),onScr=Math.abs(dx)<W/2+6&&Math.abs(dy)<H/2+6;
  if(!m.alert&&!m.hunt&&d<aggroR&&onScr&&(m.bored<=0||d<aggroR*.5)&&m.stun<=0&&mode==='world'){m.alert=1;m.doubt=0;m.pd=d;m.pt=0;if(k.fly)SFX.bat()}
  const aggro=(m.hunt||m.alert)&&m.stun<=0&&mode==='world';
  if(aggro){
    if(!m.hunt){m.pt+=dt;if(m.pt>=1){const gain=m.pd-d;m.pd=d;m.pt=0;m.gain=gain}
      /* inside its sight range the doubt is frozen (you cannot shake it off just by running); only beyond it does doubt build or fade */
      /* doubt depends on time AND distance: frozen while you are close (within half its sight), then it builds faster the further away you are,
         half as fast again if it can't see you or isn't gaining. It only fades while it is gaining on you, on screen. */
      const CR=aggroR*CHASE,R0=CR*.5;if(d>R0){const stalled=m.gain!=null&&m.gain<T*.5,gaining=m.gain!=null&&m.gain>=T*.5;
        if(gaining&&onScr&&d<CR)m.doubt=Math.max(0,m.doubt-dt);else m.doubt+=dt*((d-R0)/(CR-R0))*(!onScr||stalled?1.5:1)}
      if(m.doubt>DOUBT||d>aggroR*CHASE*LEASH){m.alert=0;m.bored=6;m.doubt=0;m.gain=null;m.wx=m.wy=0;m.t=0;m.next=1.2+Math.random();m.hx=m.hx||0}}
    if(m.alert||m.hunt){let ax=dx/d,ay=dy/d;const mv=MOVE[m.kind];
      /* where it is really heading: straight at you, or (flankers) a point off to one side of you until it is close */
      let gx=P.x,gy=P.y;if(mv==='flank'&&d>2.6*T){if(!m.side)m.side=chance(.5)?1:-1;const off=Math.min(3.2*T,d*.45);gx=P.x-dy/d*off*m.side;gy=P.y+dx/d*off*m.side;const gd=Math.hypot(gx-m.x,gy-m.y)||1;ax=(gx-m.x)/gd;ay=(gy-m.y)/gd}
      /* circlers: once close, they lope round you for a moment, then rush in */
      if(mv==='circle'&&d<4.6*T&&d>1.2*T&&!m.rush){m.circ=(m.circ||0)+dt;if(!m.cdir)m.cdir=chance(.5)?1:-1;const tn=[-dy/d*m.cdir,dx/d*m.cdir],inw=d>3.4*T?.45:d<2.4*T?-.35:0;ax=tn[0]+dx/d*inw;ay=tn[1]+dy/d*inw;const L=Math.hypot(ax,ay)||1;ax/=L;ay/=L;
        if(m.circ>(m.cmax||(m.cmax=.9+Math.random()*1.3))){m.rush=1;m.circ=0;m.cmax=0;SFX.growl&&SFX.growl()}}
      if(m.rush){sp*=1.45;ax=dx/d;ay=dy/d;if(d>5.5*T)m.rush=0}
      /* blinkers: every few seconds, while you are in sight, they vanish and reappear a few paces from you */
      if(mv==='blink'&&d>3.4*T&&d<9*T&&onScr){m.bl=(m.bl||0)+dt;if(m.bl>(m.blmax||(m.blmax=2.2+Math.random()*2))){m.bl=0;m.blmax=0;if(blinkTo(m))return}}
      /* the way there: straight if it can see a clear line, otherwise along the distance map round whatever is in the way */
      if(!k.fly&&!(mv==='circle'&&m.circ>0)){m.lc=(m.lc||0)-dt;if(m.lc<=0){m.lc=.25;m.see=lineFree(m.x,m.y,gx,gy)}
        if(!m.see){const fd=flowDir(m);if(fd){ax=fd[0];ay=fd[1]}}}
      if(!k.fly&&!boxFree(m.x+ax*5,m.y+ay*5)){for(const a of[.79,-.79,1.57,-1.57]){const c=Math.cos(a),s2=Math.sin(a),bx=ax*c-ay*s2,by=ax*s2+ay*c;if(boxFree(m.x+bx*5,m.y+by*5)){ax=bx;ay=by;break}}}
      tx=ax;ty=ay}}
  if(!(aggro&&(m.alert||m.hunt))){m.rush=0;m.circ=0;m.t=(m.t||0)+dt;if(m.t>(m.next||0)){m.t=0;m.next=1.5+Math.random()*2.5;const a=Math.random()*6.283,still=Math.random()<.45;m.wx=still?0:Math.cos(a);m.wy=still?0:Math.sin(a)}tx=m.wx||0;ty=m.wy||0;sp*=.4}
  /* turn smoothly instead of snapping to a new direction */
  {const r=Math.min(1,dt*7);m.hx=(m.hx||0)+(tx-(m.hx||0))*r;m.hy=(m.hy||0)+(ty-(m.hy||0))*r;tx=m.hx;ty=m.hy}
  if(m.kind==='slime'||m.kind==='ooze')sp*=Math.sin(m.anim*5)>0?1.5:.1;
  if(k.fly){m.wob+=dt*5;tx+=Math.cos(m.wob)*.6;ty+=Math.sin(m.wob*1.3)*.6;m.x=clamp(m.x+tx*sp*dt,T*2,(MW-2)*T);m.y=clamp(m.y+ty*sp*dt,T*2,(MH-2)*T)}
  else moveBody(m,tx*sp*dt,ty*sp*dt);
  if(Math.abs(tx)>.1)m.flip=tx<0;
  if(mode==='world'&&!DEV.peace&&m.stun<=0&&P.inv<=0&&d<(k.pack?13:11))startBattle(m,'contact')}
/* ================= WORLD RENDER ================= */
function treeImg(t,tx,ty){const h=hash(tx,ty),type=LV.type;
  if(t===PINE)return PINES[(h*PINES.length)|0];if(t===DEAD)return DEADS[(h*DEADS.length)|0];
  const set=type==='plains'?OAKS_B:type==='swamp'?OAKS_S:OAKS;return set[(h*set.length)|0]}
function drawWorld(){
  const type=LV.type;
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.save();ctx.translate(-(cam.fx||0),-(cam.fy||0));
  const cx0=Math.max(0,Math.floor(cam.x/256)),cy0=Math.max(0,Math.floor(cam.y/256)),cx1=Math.min(Math.ceil(MW*T/256)-1,Math.floor((cam.x+W)/256)),cy1=Math.min(Math.ceil(MH*T/256)-1,Math.floor((cam.y+H)/256));
  for(let cy=cy0;cy<=cy1;cy++)for(let cx=cx0;cx<=cx1;cx++)ctx.drawImage(getChunk(cx,cy),cx*256-cam.x,cy*256-cam.y);
  const tx0=Math.floor(cam.x/T)-2,ty0=Math.floor(cam.y/T)-1,tx1=Math.floor((cam.x+W)/T)+2,ty1=Math.floor((cam.y+H)/T)+4;
  for(let ty=Math.max(0,ty0);ty<=Math.min(MH-1,ty1);ty++)for(let tx=Math.max(0,tx0);tx<=Math.min(MW-1,tx1);tx++){const t=map[id(tx,ty)];
    if(t===BOG||t===WATER){const s=Math.sin(time*1.5+tx*1.7+ty*2.3);if(s>.6){ctx.fillStyle=t===WATER&&type==='plains'?'rgba(220,240,255,.5)':'rgba(90,130,90,.25)';ctx.fillRect(tx*T+((hash(tx,ty)*10)|0)-cam.x,ty*T+6+((s*3)|0)-cam.y,4,1)}
      if(t===BOG&&hash(tx*3,ty)<.15&&((time*.7+hash(tx,ty)*9)%3)<.4){ctx.fillStyle='#4a6a3a';ctx.fillRect(tx*T+8-cam.x,ty*T+8-cam.y,2,2)}}
    else if(t===GATE){ctx.fillStyle=`rgba(255,230,180,${.12+Math.sin(time*2+tx+ty)*.06})`;ctx.fillRect(tx*T-cam.x,ty*T-cam.y,T,T)}}
  const vis=(x,y,m)=>x>cam.x-m&&x<cam.x+W+m&&y>cam.y-m&&y<cam.y+H+m;
  drawSmalls();
  for(const p of props){if(p.solid||p.tree||p.t==='ring'||p.t==='flowers'||p.t==='sheep')continue;if(!vis(p.x,p.y,24))continue;const x=Math.round(p.x-cam.x),y=Math.round(p.y-cam.y);
    if(NEWP[p.t]&&NEWP[p.t].flat)NEWP[p.t].flat(p,x,y);else if(p.t==='corpse')ctx.drawImage(PS.corpse,x-7,y-2);else if(p.t==='mound')ctx.drawImage(p.st?PS.dug:PS.mound,x-6,y);
    else if(p.t==='frog')ctx.drawImage(PS.frog,x-2,y-(p.hop>0?3:0));else if(p.t==='fox'&&p.st<2)ctx.drawImage(p.st?(p.vx>0?PS.foxRun:PS.fox):PS.fox,x-5,y);
    else if(['crevice','skeleton','mudpot','stones','turnip','picnic','coldcamp'].includes(p.t)){if(!(p.t==='turnip'&&p.st)){const im=PS[p.t];ctx.drawImage(im,x-(im.width>>1),y-(im.height>>1))}if(p.t==='mudpot'&&Math.random()<.04)particles.push({x:p.x+(Math.random()-.5)*8,y:p.y-2,vx:0,vy:-6,g:0,life:.7,c:'#8a7a5a',w:'spark'})}
    else if(p.t==='mushring'||p.t==='spring'||p.t==='satchel'){if(!(p.t==='mushring'&&p.st))ctx.drawImage(PS[p.t],x-(PS[p.t].width>>1),y-(PS[p.t].height>>1))}
    else if(p.t==='pile'){if(!p.st){ctx.drawImage(PS.satchel,x-(PS.satchel.width>>1),y-(PS.satchel.height>>1));if(Math.sin(time*3+p.x)>.6){ctx.globalAlpha=.8;ctx.drawImage(PS.glint,x+1,y-8);ctx.globalAlpha=1}}}
    else if(p.t==='glint'){if(!p.st){ctx.globalAlpha=.4+.6*Math.max(0,Math.sin(time*3+p.x));ctx.drawImage(PS.glint,x-3,y-3);ctx.globalAlpha=1}}
    else if(p.t==='crow'){ctx.drawImage(PS.crow,x-4,y-4-(Math.sin(time*3+p.x)>.9?1:0))}else if(p.t==='frogking')ctx.drawImage(PS.frogking,x-5,y-4-(Math.sin(time*2)>.8?2:0));
    else if(p.t==='f_painting')ctx.drawImage(FS.painting,x-6,y-24);
    else if(p.broken){const im=p.t==='f_barrel'?FS.barrelB:FS.crateB;ctx.drawImage(im,x-im.width/2,y)}}
  const list=[];
  for(let ty=Math.max(0,ty0);ty<=Math.min(MH-1,ty1);ty++)for(let tx=Math.max(0,tx0);tx<=Math.min(MW-1,tx1);tx++){const t=map[id(tx,ty)];
    if(t===OAK||t===PINE||t===DEAD)list.push({y:ty*T+15,t,tx,ty,k:'tree'});else if(t===ROCKT)list.push({y:ty*T+14,tx,ty,k:'rock'});
    else if(t===STN)list.push({y:ty*T+15,tx,ty,k:'stone'});else if(t===FIRE)list.push({y:ty*T+12,tx,ty,k:'fire'});
    else if(t===CHEST)list.push({y:ty*T+14,tx,ty,k:'chest'});else if(t===BRAMBLE)list.push({y:ty*T+15,tx,ty,k:'bramble'});else if(t===DEADFALL||t===BOARDS||t===SPOIL||t===IRONG)list.push({y:ty*T+15,tx,ty,k:'gate2',t});else if(t===CRACK)list.push({y:ty*T+15,tx,ty,k:'crack'});else if(t===PROPT)list.push({y:ty*T+15,tx,ty,k:'prop'});else if(t===BARRIER)list.push({y:ty*T+15,tx,ty,k:'barrier'})}
  for(const b of LV.blds){const B=BTYPES[b.bt];if(b.x*T>cam.x+W+20||(b.x+B.fw)*T<cam.x-20||(b.y-6)*T>cam.y+H||(b.y+B.fh)*T<cam.y-10)continue;list.push({y:(b.y+B.fh)*T-1,b,k:'bld'})}
  for(const p of props)if(p.t==='sheep'&&vis(p.x,p.y,20))list.push({y:p.y+4,p,k:'sheep'});
  for(const m of mobs){if(!vis(m.x,m.y,80))continue;if(KINDS[m.kind].fly)continue;list.push({y:m.y,m,k:'mob'})}
  list.push({y:P.y,k:'player'});list.sort((a,b)=>a.y-b.y);
  for(const o of list){
    if(o.k==='tree'){const img=treeImg(o.t,o.tx,o.ty),j=((hash(o.tx+5,o.ty)*5)|0)-2,x0=o.tx*T+8-img.width/2+j,y0=o.ty*T+16-img.height;
      const behind=P.x>x0+2&&P.x<x0+img.width-2&&P.y-4>y0&&P.y<o.ty*T+12;if(behind)ctx.globalAlpha=.42;let sh=0;if(TSHAKE.size){const st=TSHAKE.get(o.tx+','+o.ty);if(st!=null){const e=time-st;if(e>.45)TSHAKE.delete(o.tx+','+o.ty);else sh=Math.round(Math.sin(e*55)*2*(1-e/.45))}}ctx.drawImage(img,x0-cam.x+sh,y0-cam.y);ctx.globalAlpha=1;
      const p=PROPAT[id(o.tx,o.ty)];if(p)drawTreeProp(p,o.tx*T+8+j-cam.x,o.ty*T+16-img.height-cam.y)}
    else if(o.k==='rock')ctx.drawImage(ROCK,o.tx*T+1-cam.x,o.ty*T+7-cam.y);
    else if(o.k==='stone')ctx.drawImage(STONE,o.tx*T+4-cam.x,o.ty*T-3-cam.y);
    else if(o.k==='fire')drawFire(o.tx,o.ty);
    else if(o.k==='chest'){const c=CHESTS[id(o.tx,o.ty)];ctx.drawImage(c&&c.open?CHEST_OPEN:CHEST_SPR,o.tx*T+1-cam.x,o.ty*T+4-cam.y)}
    else if(o.k==='prop')drawSolidProp(PROPAT[id(o.tx,o.ty)]);
    else if(o.k==='barrier')drawBarrier(o.tx,o.ty);else if(o.k==='bramble')drawBramble(o.tx,o.ty);else if(o.k==='gate2')drawGate2(o.tx,o.ty,o.t);else if(o.k==='crack')drawCrack(o.tx,o.ty);
    else if(o.k==='bld')drawBld(o.b);
    else if(o.k==='sheep'){const p=o.p;ctx.drawImage(p.flip?PS.sheepF:PS.sheep,Math.round(p.x-4-cam.x),Math.round(p.y-3-cam.y-(p.fl>0&&Math.sin(time*30)>0?1:0)))}
    else if(o.k==='mob')drawMob(o.m);else if(o.k==='player'){drawPlayer();drawHook()}}
  for(const m of mobs)if(KINDS[m.kind].fly&&vis(m.x,m.y,40))drawMob(m);
  for(const c of crows){if(c.st===2)continue;const x=Math.round(c.x-cam.x),y=Math.round(c.y-cam.y);if(x<-10||x>W+10||y<-10||y>H+10)continue;ctx.fillStyle='#050505';
    if(c.st===0){ctx.fillRect(x,y,3,2);ctx.fillRect(x+(c.t%4<.2?3:-1),y-1,1,1)}else{const f=Math.sin(c.t*25)>0;ctx.fillRect(x,y,3,1);ctx.fillRect(x-2,y+(f?-1:1),2,1);ctx.fillRect(x+3,y+(f?-1:1),2,1)}}
  for(const g of glowShrooms){const x=g.x-cam.x,y=g.y-cam.y;if(x<-4||x>W+4||y<-4||y>H+4)continue;if(g.cr){ctx.fillStyle='#6ab8e8';ctx.fillRect(x,y-2,1,3);ctx.fillRect(x+2,y-1,1,2);ctx.fillStyle='#d8f4ff';ctx.fillRect(x,y-2,1,1)}else{ctx.fillStyle='#3fd0b0';ctx.fillRect(x,y,2,1);ctx.fillStyle='#a4b098';ctx.fillRect(x+.5|0,y+1,1,1)}}
  drawParticles();drawFloats();ctx.restore();if(LV.kind==='zone')drawFog();drawLight();if(mode==='world'||mode==='note')drawUseMark()}
function drawUseMark(){const u=useT;if(!u)return;const x=Math.round(u.x-cam.x),y=Math.round(u.y-cam.y-(u.o.prop&&u.o.prop.solid||u.o.chest?20:16)+Math.sin(time*4)*1.5);
  ctx.fillStyle='#000';ctx.fillRect(x-3,y-1,7,5);ctx.fillStyle=u.lvl===2?'#ffe8a0':'#8a8670';ctx.fillRect(x-2,y,5,1);ctx.fillRect(x-1,y+1,3,1);ctx.fillRect(x,y+2,1,1)}
function reveal(tx,ty){if(LV.lastRev===tx+ty*MW)return;LV.lastRev=tx+ty*MW;const R=LV.kind==='interior'?7:8;
  for(let y=Math.max(0,ty-R);y<=Math.min(MH-1,ty+R);y++)for(let x=Math.max(0,tx-R);x<=Math.min(MW-1,tx+R);x++)if((x-tx)*(x-tx)+(y-ty)*(y-ty)<=R*R)LV.seen[y*MW+x]=1}
function drawBramble(tx,ty){const x=tx*T-cam.x,y=ty*T-cam.y;ctx.fillStyle='#120c08';ctx.fillRect(x,y-4,16,20);
  for(let i=0;i<9;i++){const h=hash(tx*5+i,ty*3);ctx.strokeStyle=i%3?'#2a1e14':'#3e2a1a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+h*16,y+16);ctx.quadraticCurveTo(x+8+Math.sin(i*1.7)*10,y+4,x+hash(ty,i*7)*16,y-4);ctx.stroke()}
  ctx.fillStyle='#8a2a1a';for(let i=0;i<10;i++)ctx.fillRect(x+((hash(i*11,tx)*15)|0),y-3+((hash(ty,i*13)*18)|0),1,1);ctx.fillStyle='#2a3a1a';for(let i=0;i<6;i++)ctx.fillRect(x+((hash(i,tx*3)*14)|0),y-2+((hash(ty*5,i)*16)|0),2,1)}
/* the newer gates: a fallen trunk, boards nailed across, a heap of fallen earth, an iron gate */
function drawGate2(tx,ty,t){const x=tx*T-cam.x|0,y=ty*T-cam.y|0,F=(c,a,b,w,h)=>{ctx.fillStyle=c;ctx.fillRect(x+a,y+b,w,h)},hz=!BLOCK[tAt(tx,ty-1)]||!BLOCK[tAt(tx,ty+1)];
  if(t===DEADFALL){if(hz){F('#0c0806',-1,3,18,11);F('#4a3420',0,4,16,9);F('#5e4430',0,4,16,3);F('#2a1c12',0,11,16,1);F('#c8a878',13,5,3,7);F('#8a6a44',14,7,1,3);F('#2a1c12',4,6,1,4);F('#2a1c12',9,8,2,1)}
    else{F('#0c0806',2,-3,12,20);F('#4a3420',3,-2,10,18);F('#5e4430',3,-2,3,18);F('#c8a878',4,13,8,3);F('#2a1c12',7,2,1,5)}return}
  if(t===BOARDS){const dark=LV.type==='cave';F(dark?'#08070a':'#0a0806',0,-2,16,18);for(const[o]of[[1],[6],[11]]){F('#1a120a',-1,o-1,18,5);F('#7a5a34',-1,o,18,3);F('#8a6a44',-1,o,18,1);F('#c8c8c8',1,o+1,1,1);F('#c8c8c8',14,o+1,1,1)}return}
  if(t===SPOIL){ctx.fillStyle='#0c0806';ctx.beginPath();ctx.ellipse(x+8,y+10,10,8,0,0,7);ctx.fill();ctx.fillStyle='#5a4630';ctx.beginPath();ctx.ellipse(x+8,y+9,9,7,0,0,7);ctx.fill();F('#6e5838',3,4,8,3);F('#7a7670',4,8,3,2);F('#8a8478',10,10,2,2);F('#3a2c1c',6,12,4,1);return}
  if(t===IRONG){F('#0a0a0c',0,-6,16,22);for(let i=0;i<4;i++){F('#5a6068',1+i*4,-5,2,20);F('#8a9098',1+i*4,-5,1,20)}F('#5a6068',0,-4,16,2);F('#5a6068',0,8,16,2);F('#c9a24b',7,2,3,3);F('#1a1a1a',8,3,1,2)}}
function drawCrack(tx,ty){const x=tx*T-cam.x,y=ty*T-cam.y;
  if(LV.type==='cave'){ctx.fillStyle='#1c1a1a';ctx.fillRect(x,y-4,16,20);ctx.fillStyle='#3a3632';ctx.fillRect(x,y+11,16,5);ctx.fillStyle='#2a2826';ctx.fillRect(x+1,y-3,14,13)}
  else{ctx.fillStyle='#050505';ctx.beginPath();ctx.ellipse(x+8,y+9,9,8,0,0,7);ctx.fill();ctx.fillStyle='#5a5650';ctx.beginPath();ctx.ellipse(x+8,y+8,8,7,0,0,7);ctx.fill();ctx.fillStyle='#7a7670';ctx.fillRect(x+3,y+3,5,3)}
  ctx.strokeStyle='#d8a24a';ctx.globalAlpha=.55+Math.sin(time*2+tx)*.15;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+8,y);ctx.lineTo(x+6,y+5);ctx.lineTo(x+10,y+8);ctx.lineTo(x+7,y+13);ctx.stroke();ctx.globalAlpha=1}
function drawBld(b){const B=BTYPES[b.bt],img=bldSprite(b.bt),x=b.x*T-cam.x,y=(b.y+B.fh)*T-img.height-cam.y;ctx.drawImage(img,Math.round(x),Math.round(y));
  if(b.nailed){const dx=Math.round(b.door.x*T-cam.x),dy=Math.round(b.door.y*T-cam.y);for(const[o,a]of[[3,-1],[8,1],[12,-1]]){ctx.fillStyle='#1a120a';ctx.fillRect(dx,dy+o-1,16,4);ctx.fillStyle='#7a5a34';ctx.fillRect(dx,dy+o,16,2);ctx.fillStyle='#c8c8c8';ctx.fillRect(dx+2,dy+o,1,1);ctx.fillRect(dx+13,dy+o,1,1)}}
  if(B.style==='mill'){const hx=x+img.width/2,hy=y+img.height-B.fh*16-10,a=time*.6;ctx.strokeStyle='#3a2a1a';ctx.lineWidth=2;for(let k=0;k<4;k++){const an=a+k*Math.PI/2;ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(hx+Math.cos(an)*26,hy+Math.sin(an)*26);ctx.stroke();ctx.fillStyle='rgba(220,210,180,.8)';ctx.save();ctx.translate(hx,hy);ctx.rotate(an);ctx.fillRect(8,1,17,5);ctx.restore()}ctx.fillStyle='#2a1a0a';ctx.fillRect(hx-2,hy-2,4,4)}
  if(B.chim&&Math.random()<.05)particles.push({x:b.x*T+img.width-10+cam.x*0,y:(b.y+B.fh)*T-img.height+2,vx:3,vy:-8,g:-1,life:2.5,c:'rgba(120,120,120,.6)',w:'smoke'})}
function drawBarrier(tx,ty){const x=tx*T-cam.x,y=ty*T-cam.y,cave=LV.type==='cave';
  if(cave){ctx.fillStyle='#1a1816';ctx.fillRect(x,y-4,16,20);for(let i=0;i<9;i++){const h=hash(tx*7+i,ty);ctx.fillStyle=h<.5?'#4a4640':'#2e2b28';ctx.fillRect(x+((h*12)|0),y-4+((hash(i,tx)*16)|0),5,4)}}
  else{ctx.fillStyle='#0c0805';ctx.fillRect(x+1,y-6,14,22);ctx.strokeStyle='#3a2416';ctx.lineWidth=1;for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(x+(hash(i,tx)*16),y-6);ctx.quadraticCurveTo(x+8+Math.sin(i)*8,y+4,x+(hash(tx,i)*16),y+16);ctx.stroke()}ctx.fillStyle='#6a3a2a';for(let i=0;i<8;i++)ctx.fillRect(x+((hash(i*3,ty)*14)|0)+1,y-5+((hash(ty,i*5)*20)|0),1,1)}}
function drawTreeProp(p,cx,top){
  if(p.t==='owl')ctx.drawImage(p.turn>0?PS.owlBack:PS.owl,Math.round(cx-3),Math.round(top+6));
  else if(p.t==='nest'&&!p.st){ctx.fillStyle='#2a1d12';ctx.fillRect(Math.round(cx-3),Math.round(top+4),6,2);ctx.fillStyle='#4a3424';ctx.fillRect(Math.round(cx-2),Math.round(top+3),4,1)}
  else if(p.t==='chime'){ctx.fillStyle='#c9a24b';for(let i=0;i<3;i++){const sw=Math.round(Math.sin(time*2+i));ctx.fillRect(Math.round(cx-3+i*3+sw),Math.round(top+8),1,4+i%2)}}}
function drawSolidProp(p){if(!p)return;const bx=p.tx*T+8-cam.x,by=p.ty*T+16-cam.y;if(NEWP[p.t]&&NEWP[p.t].draw){NEWP[p.t].draw(p,bx,by);return}
  if(p.t==='lever'){ctx.fillStyle='#050505';ctx.fillRect(bx-5,by-6,10,6);ctx.fillStyle='#4a4640';ctx.fillRect(bx-4,by-5,8,4);ctx.strokeStyle='#2a1a10';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx,by-4);ctx.lineTo(bx+(p.up?-1:1)*2,by-(p.up?16:8));ctx.stroke();ctx.fillStyle='#a82a2a';ctx.fillRect(bx+(p.up?-1:1)*2-2,by-(p.up?18:10),4,3);return}
  if(p.t==='banner'){const im=p.torn?PS.bannerTorn:PS.banner;ctx.drawImage(im,Math.round(bx-6+Math.sin(time*2+p.tx)*.5),by-24);return}
  if(p.t==='stack'){ctx.fillStyle='#3a3632';ctx.fillRect(bx-6,by-3,12,3);for(let i=0;i<p.h;i++){const w=10-i;ctx.fillStyle='#050505';ctx.fillRect(Math.round(bx-w/2-1+Math.sin(i*2.1)),by-5-i*2,w+2,3);ctx.fillStyle=i%2?'#7a766e':'#6a665e';ctx.fillRect(Math.round(bx-w/2+Math.sin(i*2.1)),by-5-i*2,w,2)}return}
  let img=p.t.startsWith('f_')?FS[p.t.slice(2)]:PS[p.t];if(p.t==='bush')img=p.st?PS.bushEaten:PS.bush;if(p.t==='bell')img=p.flash>0?PS.bellLit:PS.bell;
  if(!img)return;const sw=p.t==='cage'?Math.round(Math.sin(time*1.3+p.tx)*1):0;ctx.drawImage(img,Math.round(bx-img.width/2+sw),Math.round(by-img.height-(p.t==='crystal'?2:0)));
  if(p.t==='brazier'&&p.lit>0){const blue=LV.brazSolved;for(let i=0;i<5;i++){const fl=Math.sin(time*13+i*2)*2;ctx.fillStyle=blue?(i<2?'#3a6ad8':i<4?'#6ab0ff':'#d8f0ff'):(i<2?'#c8401a':i<4?'#f08a24':'#ffd870');ctx.fillRect(Math.round(bx-3+i%3*2),Math.round(by-img.height-3-i+fl*.5),2,4)}}
  if((p.t==='shrine'||p.t==='f_altar')&&!p.st&&Math.sin(time*9+p.tx)>-.3){ctx.fillStyle='#ffe8a0';ctx.fillRect(Math.round(bx-1),Math.round(by-img.height+(p.t==='shrine'?10:0)),2,1)}
  if(p.t==='hive'&&Math.random()<.3)particles.push({x:p.x+(Math.random()-.5)*10,y:p.y-6,vx:(Math.random()-.5)*20,vy:(Math.random()-.5)*10,g:0,life:.6,c:'#e8c84a',w:'spark'})}
function drawFire(tx,ty){const f=fires.find(f=>f.x===tx&&f.y===ty),x=tx*T-cam.x,y=ty*T-cam.y;
  ctx.fillStyle='#1a0f08';ctx.fillRect(x+3,y+11,10,3);ctx.fillStyle='#3a2414';ctx.fillRect(x+4,y+11,8,2);
  if(f&&f.lit){for(let i=0;i<5;i++){const fl=Math.sin(time*13+i*2)*2;ctx.fillStyle=i<2?'#c8401a':i<4?'#f08a24':'#ffd870';ctx.fillRect(x+5+i%3*2,y+7-i+fl*.5,2,4)}
    if(Math.random()<.3)particles.push({x:tx*T+8+(Math.random()*6-3),y:ty*T+6,vx:(Math.random()-.5)*6,vy:-20,g:0,life:1,c:'#f08a24',w:'ember'})}
  else{ctx.fillStyle='#2a2420';ctx.fillRect(x+6,y+10,4,1);if(Math.sin(time*2+tx)>.7){ctx.fillStyle='#6a2a10';ctx.fillRect(x+7,y+10,1,1)}}}
function eyePos(m){const sp=SPR[m.vk]||SPR[m.kind];if(!sp)return null;const img=sp[0],fl=m.flip,ox=m.x-img.width/2,oy=m.y-img.height+(KINDS[m.kind].fly?-10:0);
  const E={bat:{c:'#ff3b2a',p:[[5,4],[8,4]]},mosquito:{c:'#ff6a2a',p:[[5,4],[8,4]]},shroom:{c:'#f0dd48',p:[[5,7],[9,7]]},golem:{c:'#6fd0ff',p:[[6,2],[9,2]]},ent:{c:'#d8ff6a',p:[[6,7],[9,7]]},bear:{c:'#ffab2e',p:[[4,4],[11,4]]},knight:{c:'#ff3322',p:[[4,5],[7,5]]}}[m.kind];
  if(!E)return null;return{c:E.c,p:E.p.map(([a,b])=>[ox+(fl?img.width-1-a:a),oy+b+(m.bob||0)])}}
/* mobs are placed on a half-pixel grid (the canvas is drawn at 2x, so that is still a whole real pixel): with the camera stepping a whole pixel at a time, whole-pixel mobs stutter against it */
const R2=v=>Math.round(v*KK)/KK;  /* sub-pixel steps the canvas can show exactly (see resize) */
function drawMob(m){const k=KINDS[m.kind];
  /* a hunter carries a dark red stain on the ground under it, pulsing: you always know which one it is */
  if(m.hunter){const pz=.5+.5*Math.sin(time*4);ctx.fillStyle=`rgba(150,10,10,${.25+.2*pz})`;ctx.beginPath();ctx.ellipse(R2(m.x-cam.x),R2(m.y-cam.y),9+pz*2,4,0,0,7);ctx.fill()}
  if(m.kind==='strawman'&&(m.state==='dormant'||m.state==='waking')){const s=m.state==='waking'?(Math.random()-.5)*3:0,img=SPR.strawman[0];ctx.drawImage(img,R2(m.x-img.width/2+s-cam.x),R2(m.y-img.height-cam.y));return}
  if(m.kind==='elder'&&(m.state==='dormant'||m.state==='waking')){const s=m.state==='waking'?(Math.random()-.5)*3:0;ctx.drawImage(ELDER_TREE,R2(m.x-30+s-cam.x),R2(m.y+1-76-cam.y));return}
  /* a golem asleep in a gap in the rock: dark as the wall around it, until it moves */
  if(m.gk&&m.kind==='golem'&&(m.state==='dormant'||m.state==='waking')){const img=SPR.golem[0],s=m.state==='waking'?(Math.random()-.5)*3:0;if(!SPR.golem.dark)SPR.golem.dark=tintSpr(img,'#2e2a27',.7);ctx.drawImage(m.state==='waking'&&m.t>.4?img:SPR.golem.dark,R2(m.x-img.width/2+s-cam.x),R2(m.y-img.height-cam.y));return}
  if(m.kind==='ent'&&(m.state==='dormant'||(m.state==='waking'&&m.t<.4))){const img=treeImg(m.treeT||OAK,m.tx,m.ty),j=((hash(m.tx+5,m.ty)*5)|0)-2,s=m.state==='waking'?(Math.random()-.5)*3:0;ctx.drawImage(img,m.tx*T+8-img.width/2+j+s-cam.x,m.ty*T+16-img.height-cam.y);return}
  if(m.boss){const img=SPR[m.kind][0],sc=2,s=m.state==='waking'?(Math.random()-.5)*3:0,bob=Math.sin(time*1.5)>0?-1:0;
    ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(m.x-cam.x,m.y-cam.y,img.width*.8,4,0,0,7);ctx.fill();
    ctx.drawImage(img,R2(m.x-img.width*sc/2+s-cam.x),R2(m.y-img.height*sc-cam.y+bob),img.width*sc,img.height*sc);return}
  if(k.pack){const unit=k.units[0],set=SPR[unit],n=m.n||k.units.length,offs=[[0,0],[-9,4],[9,5],[-3,10],[-12,12],[7,13]];
    for(let i=0;i<n;i++){const img=(m.flip?set.flip:set)[0],bob=Math.sin(m.anim*7+i*2)>0?-1:0,x=m.x+offs[i][0]-img.width/2-cam.x,y=m.y+offs[i][1]-img.height-cam.y+bob;
      ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(m.x+offs[i][0]-cam.x,m.y+offs[i][1]-1-cam.y,img.width*.35,2,0,0,7);ctx.fill();
      if(m.stun>0&&Math.floor(time*10)%2)ctx.globalAlpha=.5;ctx.drawImage(img,R2(x),R2(y));ctx.globalAlpha=1}
    return}
  const set=SPR[m.vk]||SPR[m.kind];let fr=k.fly?(m.anim*(m.kind==='mosquito'?14:8)|0)%2:0;const img=(m.flip?set.flip:set)[fr]||set[0];
  let bob=0,sx=1,sy=1;if(m.kind==='slime'||m.kind==='ooze'){sy=1+Math.sin(m.anim*5)*.12;sx=2-sy}else if(!k.fly)bob=Math.sin(m.anim*6)>0?-1:0;m.bob=bob;
  const w=img.width*sx,h=img.height*sy,x=m.x-w/2-cam.x,y=m.y-h-cam.y+(k.fly?-10:0)+bob;
  ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(m.x-cam.x,m.y-1-cam.y,img.width*.35,2.5,0,0,7);ctx.fill();
  if(m.stun>0&&Math.floor(time*10)%2)ctx.globalAlpha=.5;
  ctx.drawImage(img,R2(x),R2(y),R2(w),R2(h));ctx.globalAlpha=1;
  if(m.kind==='slime'&&Math.random()<.04)particles.push({x:m.x+(Math.random()*8-4),y:m.y-3,vx:0,vy:5,g:30,life:.5,c:'#5e7426',w:'drip'})}
function drawPlayer(){
  for(const t of P.trail){ctx.globalAlpha=t.a*.4;ctx.drawImage(KNW[P.face][1],R2(t.x-6-KPAD-cam.x),R2(t.y-16-KPAD-cam.y))}ctx.globalAlpha=1;
  ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.ellipse(P.x-cam.x,P.y-1-cam.y,5,2,0,0,7);ctx.fill();
  const fr=P.moving?1+((P.anim*7|0)%2):0,img=(P.slashT>0?KNS:KNW)[P.face][fr],bob=P.moving&&fr===1?-1:0,x=R2(P.x-6-cam.x),y=R2(P.y-16-cam.y)+bob;
  if(P.inv>0&&Math.floor(time*12)%2)ctx.globalAlpha=.35;
  const behind=P.face==='up';if(behind)drawSword();ctx.drawImage(img,x-KPAD,y-KPAD);ctx.globalAlpha=1;if(!behind)drawSword();
  if(LV.type!=='plains'||LV.kind==='interior'){const lx=P.face==='left'?x+1:x+10,ly=y+11;ctx.fillStyle='#2a1d10';ctx.fillRect(lx,ly,2,3);ctx.fillStyle=Math.random()<.9?'#ffd27a':'#fff0b0';ctx.fillRect(lx,ly+1,2,1)}}
function drawSword(){if(P.slashT<=0)return;const S=swingOf(),dur=P.slashDur||S.dur,base={right:0,down:Math.PI/2,left:Math.PI,up:-Math.PI/2}[P.face],p=1-P.slashT/dur,cx=P.x-cam.x,cy=P.y-8-cam.y,bc=(ITEMS[P.eq.weapon]||{}).blade||'#e8edf2';
  if(!S.arc){/* a thrust: out and back, with a bright point */const e=Math.sin(Math.min(1,p)*Math.PI),L=4+e*(S.len-4),ca=Math.cos(base),sa=Math.sin(base);
    ctx.strokeStyle=bc;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx+ca*3,cy+sa*3);ctx.lineTo(cx+ca*L,cy+sa*L);ctx.stroke();ctx.fillStyle='#fff';ctx.fillRect(Math.round(cx+ca*L)-1,Math.round(cy+sa*L)-1,2,2);
    if(e>.6){ctx.strokeStyle='rgba(220,230,240,.35)';ctx.beginPath();ctx.moveTo(cx+ca*(L+2)-sa*3,cy+sa*(L+2)+ca*3);ctx.lineTo(cx+ca*(L+4),cy+sa*(L+4));ctx.lineTo(cx+ca*(L+2)+sa*3,cy+sa*(L+2)-ca*3);ctx.stroke()}return}
  const ease=S.slam?p*p:p,from=base-S.arc/2;
  for(let k=0;k<4;k++){const pp=Math.max(0,ease-k*.09),a=from+pp*S.arc;ctx.strokeStyle=k?`rgba(220,230,240,${.35-k*.08})`:bc;ctx.lineWidth=k||S.len<18?1:2;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*4,cy+Math.sin(a)*4);ctx.lineTo(cx+Math.cos(a)*S.len,cy+Math.sin(a)*S.len);ctx.stroke()}
  const a=from+ease*S.arc;ctx.fillStyle='#c9a24b';ctx.fillRect(Math.round(cx+Math.cos(a)*4)-1,Math.round(cy+Math.sin(a)*4)-1,2,2);
  if(wType()==='flail'){ctx.fillStyle=bc;ctx.fillRect(Math.round(cx+Math.cos(a)*S.len)-2,Math.round(cy+Math.sin(a)*S.len)-2,4,4)}}
function drawParticles(){for(const p of particles){ctx.fillStyle=p.c;ctx.globalAlpha=clamp(p.life*(p.w==='smoke'?.4:1.5),0,1);ctx.fillRect(Math.round(p.x-cam.x),Math.round(p.y-cam.y),p.w==='leaf'||p.w==='smoke'?2:1,p.w==='smoke'?2:1)}ctx.globalAlpha=1;
  for(const l of leaves){ctx.fillStyle=l.c;ctx.fillRect(Math.round(l.x),Math.round(l.y),Math.abs(Math.sin(l.r))>.5?2:1,1)}}
function updParticles(dt){updFloats(dt);for(const p of particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.g*dt}particles=particles.filter(p=>p.life>0);if(particles.length>400)particles.splice(0,particles.length-400);
  if(!LV)return;const type=LV.kind==='interior'?'inside':LV.type,cols=type==='plains'?['#f4f4f4','#f08ac8','#f0d84a','#e8e0c0']:type==='cave'||type==='inside'?['#6a645c','#4a4640','#8a8478']:['#3a2414','#4a2c16','#2a3a1a','#5a1e14'];
  const slow=type==='cave'||type==='inside';if(leaves.length<(slow?8:14)&&Math.random()<dt*2)leaves.push({x:Math.random()*W,y:-3,vx:slow?0:-4-Math.random()*6,vy:slow?(type==='inside'?4:14)+Math.random()*10:8+Math.random()*8,r:Math.random()*6,c:pick(cols)});
  for(const l of leaves){l.r+=dt*4;l.x+=(l.vx+(slow?0:Math.sin(l.r)*8))*dt;l.y+=l.vy*dt}leaves=leaves.filter(l=>l.y<H+4&&l.x>-6)}
const FOG=[...Array(6)].map((_,i)=>({x:Math.random()*600,y:Math.random()*400,r:50+Math.random()*60,v:3+Math.random()*5,par:.5+i*.08}));
function drawFog(){const type=LV.type,a=type==='plains'?.03:type==='swamp'?.12:.08,col=type==='cave'?'90,100,120':'140,160,150';
  for(const f of FOG){const span=W+f.r*2,spanY=H+f.r*2,x=(((f.x+time*f.v-cam.x*f.par)%span)+span)%span-f.r,y=(((f.y-cam.y*f.par)%spanY)+spanY)%spanY-f.r;
  const g=ctx.createRadialGradient(x,y,0,x,y,f.r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(x-f.r,y-f.r,f.r*2,f.r*2)}}
const TINT={woods:'rgba(4,12,8,.36)',cave:'rgba(3,4,14,.36)',swamp:'rgba(14,20,4,.34)',plains:'rgba(255,236,190,.05)',inside:'rgba(8,5,2,.32)'},VIGA={woods:.7,cave:.85,swamp:.7,plains:.3,inside:.8};
function drawLight(){const type=LV.kind==='interior'?'inside':LV.type,vis=(x,y,m)=>x>-m&&x<W+m&&y>-m&&y<H+m;
  ctx.fillStyle=TINT[type];ctx.fillRect(0,0,W,H);
  const g=[],fl=Math.sin(time*11)*1.5+Math.sin(time*7.3)*1.2;
  for(const f of fires){const x=f.x*T+8-cam.x,y=f.y*T+8-cam.y;if(f.lit&&vis(x,y,70))g.push([x,y,46+fl,'rgba(240,120,40,.22)'])}
  for(const p of props){const x=p.x-cam.x,y=p.y-cam.y;if(!vis(x,y,50))continue;
    if(p.t==='brazier'&&p.lit>0)g.push([x,y-12,34,LV.brazSolved?'rgba(80,140,255,.22)':'rgba(240,120,40,.2)']);
    else if(p.t==='ring')g.push([x,y,16+Math.sin(time*2)*2,'rgba(230,130,230,.14)']);
    else if((p.t==='bell'||p.t==='crystal')&&p.flash>0)g.push([x,y,22*p.flash,'rgba(160,220,255,.25)']);
    else if(p.t==='crystal')g.push([x,y-4,12,'rgba(100,180,240,.12)']);
    else if(p.t==='shrine'||p.t==='f_altar')g.push([x,y-8,14,'rgba(255,220,140,.12)'])}
  if(LV.kind==='interior')for(const o of decos)if(o.k==='window'){const x=o.x+8-cam.x,y=o.y+10-cam.y;if(vis(x,y,40))g.push([x,y+12,30,'rgba(150,170,200,.1)'])}
  for(const s of glowShrooms){const x=s.x-cam.x,y=s.y-cam.y;if(vis(x,y,12))g.push([x,y,9,s.cr?'rgba(110,190,240,.2)':'rgba(60,220,180,.2)'])}
  if(type!=='plains')g.push([P.x-cam.x,P.y-10-cam.y,50,'rgba(255,190,90,.08)']);
  for(let tx=Math.floor(cam.x/T);tx<=Math.floor((cam.x+W)/T);tx++)for(let ty=Math.floor(cam.y/T);ty<=Math.floor((cam.y+H)/T)+1;ty++)if(tAt(tx,ty)===STN)g.push([tx*T+8-cam.x,ty*T+4-cam.y,10,'rgba(200,30,20,.18)']);
  ctx.globalCompositeOperation='lighter';
  for(const[x,y,r,c]of g){const gr=ctx.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,c);gr.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gr;ctx.fillRect(x-r,y-r,r*2,r*2)}
  for(const f of fireflies){const x=f.x+Math.sin(time*f.sp+f.ph)*14-cam.x,y=f.y+Math.cos(time*f.sp*1.3+f.ph)*10-cam.y,a=(Math.sin(time*2.3+f.ph*3)+1)/2;if(a<.3||!vis(x,y,4))continue;
    if(type==='plains'){ctx.globalCompositeOperation='source-over';const w=Math.sin(time*18+f.ph)>0;ctx.fillStyle=['#f0d84a','#f4f4f4','#f08ac8','#8ac8f0'][(f.ph*10|0)%4];ctx.fillRect(x|0,y|0,1,1);ctx.fillRect((x|0)+(w?-1:1),y|0,1,1);ctx.fillRect((x|0)+(w?1:-1),(y|0),1,1);ctx.globalCompositeOperation='lighter'}
    else{ctx.fillStyle=`rgba(200,255,90,${a*.9})`;ctx.fillRect(x|0,y|0,1,1)}}
  for(const w of watchers){if(w.a<=0||Math.sin(time*.9+w.x)>.93)continue;ctx.fillStyle=w.col;ctx.globalAlpha=w.a*.9;const x=Math.round(w.x-cam.x),y=Math.round(w.y-cam.y);ctx.fillRect(x,y,1,1);ctx.fillRect(x+w.gap,y,1,1)}
  ctx.globalAlpha=1;
  for(const m of mobs){if(Math.abs(m.x-P.x)>W||Math.abs(m.y-P.y)>H)continue;if(m.state==='dormant'&&m.kind==='elder'){if(Math.sin(time*.7)>.85){ctx.fillStyle='#ff4a1a';const x=m.x-cam.x,y=m.y-46-cam.y;ctx.fillRect(x-6|0,y|0,2,1);ctx.fillRect(x+4|0,y|0,2,1)}}
    else if(m.state!=='dormant'&&!m.boss&&!(m.kind==='ent'&&m.state==='waking'&&m.t<.4)){const e=eyePos(m);if(e){ctx.fillStyle=e.c;ctx.globalAlpha=.85;for(const[a,b]of e.p)ctx.fillRect(a-cam.x|0,b-cam.y|0,1,1);ctx.globalAlpha=1}}}
  if(hasT('morbid')){for(const p of props){if(p.st||!['mound','nest','corpse','ring','cairn','tent','cart','boat','minecart','f_wardrobe','f_table'].includes(p.t))continue;if(Math.abs(p.x-P.x)>80||Math.abs(p.y-P.y)>80)continue;if(Math.sin(time*3+p.x)>.6){ctx.fillStyle='rgba(255,240,180,.8)';ctx.fillRect(Math.round(p.x-cam.x+Math.sin(time*5+p.y)*4),Math.round(p.y-cam.y-6+Math.cos(time*4)*3),1,1)}}
    for(const c of LV.caches||[]){if(c.got||Math.abs(c.x*T-P.x)>90||Math.abs(c.y*T-P.y)>90)continue;if(Math.sin(time*2.4+c.y)>.5){ctx.fillStyle='rgba(255,240,180,.75)';ctx.fillRect(c.x*T+8-cam.x+Math.cos(time*4)*4|0,c.y*T+8-cam.y+Math.sin(time*3)*2|0,1,1)}}
    for(const c of chests){if(c.open||Math.abs(c.x*T-P.x)>90||Math.abs(c.y*T-P.y)>90)continue;if(Math.sin(time*3+c.x)>.6){ctx.fillStyle='rgba(255,240,180,.8)';ctx.fillRect(c.x*T+8-cam.x+Math.sin(time*5)*5|0,c.y*T+2-cam.y|0,1,1)}}}
  ctx.globalCompositeOperation='source-over';
  if(EV.blood>0&&LV.kind==='zone'){ctx.fillStyle='rgba(140,10,0,.13)';ctx.fillRect(0,0,W,H)}
  /* the bog: a barely-there drizzle */
  if(LV.type==='swamp'&&LV.kind==='zone'){ctx.strokeStyle='rgba(190,205,215,.13)';ctx.lineWidth=.5;ctx.beginPath();const n=Math.round(W*H/1800);for(let i=0;i<n;i++){const sp=150+(i*37%60),x=((i*97.3+time*sp*.3)%(W+20))-10,y=((i*53.7+time*sp)%(H+20))-10;ctx.moveTo(x,y);ctx.lineTo(x-1,y-4)}ctx.stroke()}
  /* choking fog: grey closes in to a few tiles round you (and things out there can't see you well either) */
  if(EV.fog>0&&LV.kind==='zone'){const a=Math.min(1,EV.fog/8),x=P.x-cam.x,y=P.y-10-cam.y,gr=ctx.createRadialGradient(x,y,22,x,y,95);gr.addColorStop(0,'rgba(120,130,120,0)');gr.addColorStop(1,`rgba(120,130,120,${.8*a})`);ctx.fillStyle=gr;ctx.fillRect(0,0,W,H)}
  ctx.drawImage(getVig(),0,0)}
function getVig(){if(!VIG){VIG=cvs(W,H);const v=VIG.getContext('2d'),a=LV?VIGA[LV.kind==='interior'?'inside':LV.type]:.7,g=v.createRadialGradient(W/2,H/2,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${a})`);v.fillStyle=g;v.fillRect(0,0,W,H)}return VIG}

/* riddles for the stone faces: first answer is right */
const RIDDLES=[{q:"The more you take, the more you leave behind.",a:['Footsteps','Coins','Breath']},
 {q:"Feed me and I live. Give me a drink and I die.",a:['Fire','A ghoul','A plant']},
 {q:"I have a neck but no head, and I wear a cap.",a:['A bottle','A knight','A mushroom']},
 {q:"Speak my name and I am gone.",a:['Silence','A secret','The dead']},
 {q:"What walks on four legs in the morning, two at noon and three in the evening?",a:['A man','A wolf','A ghost']},
 {q:"I have cities but no houses, forests but no trees, rivers but no water.",a:['A map','A dream','A grave']},
 {q:"The one who makes me sells me. The one who buys me never uses me. The one who uses me never knows.",a:['A coffin','A sword','A crown']},
 {q:"What can run but never walks, has a mouth but never talks?",a:['A river','A wolf','A rumour']}];
