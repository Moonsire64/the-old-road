
/* ================= AREAS, ZONES, INTERIORS ================= */
const T=16,ZS=104;let MW=ZS,MH=ZS;
let RUN=(Math.random()*1e6)|0;
const G=0,ROAD=1,OAK=2,PINE=3,DEAD=4,BOG=5,MUD=6,ROCKT=7,SHR=8,FIRE=9,STN=10,BRIDGE=11,ENTT=12,CHEST=13,PROPT=14,WATER=15,WALL=16,BARRIER=17,EXIT=18,GATE=19,DOOR=20,FLOOR=21,IWALL=22,BLDG=23,IDOOR=24,BRAMBLE=25,CRACK=26,DEEP=27,DEADFALL=28,BOARDS=29,MIRE=30,SPOIL=31,IRONG=32;
const BLOCK=new Uint8Array(48);[OAK,PINE,DEAD,BOG,ROCKT,FIRE,STN,ENTT,CHEST,PROPT,WATER,WALL,BARRIER,IWALL,BLDG,BRAMBLE,CRACK,DEEP,DEADFALL,BOARDS,MIRE,SPOIL,IRONG].forEach(t=>BLOCK[t]=1);
/* tool gates: which tile each tool clears, and which tool each gate kind needs (0.18: eight tools, one per map before each boss) */
const GATE_T={bramble:BRAMBLE,crack:CRACK,deep:DEEP,deadfall:DEADFALL,boards:BOARDS,mire:MIRE,spoil:SPOIL,iron:IRONG};
const GATE_TOOL={bramble:'brand',crack:'powder',deep:'hook',deadfall:'axe',boards:'crowbar',mire:'pole',spoil:'shovel',iron:'keys'};
const TILE_TOOL={};for(const k in GATE_T)TILE_TOOL[GATE_T[k]]=GATE_TOOL[k];const TOOL_GATE={};for(const k in GATE_TOOL)TOOL_GATE[GATE_TOOL[k]]=k;
const isGateT=t=>t in TILE_TOOL;
const AREA_DEFS=[
  {name:'The Shaded Woods',type:'woods',seed:1337,boss:'elder',next:1,zones:["Wood's Edge",'The Thicket','The Heartwood'],blds:['cabin','lodge','chapel','tower','charcoal','sawmill','kennel','bothy','ruinhall','forester'],puzzle:{t:'bell',z:1}},
  {name:'The Underground Passage',type:'cave',seed:2024,boss:'colossus',next:2,zones:['The Mouth','Flooded Galleries','The Deep Vault'],blds:['bunk','office','shrine','store','forge','guard','ossuary','pumphouse','deepchapel','powder'],puzzle:{t:'braz',z:1}},
  {name:'The Forested Swamp',type:'swamp',seed:777,boss:'rotmother',next:3,zones:["Fen's Edge",'Rotwater',"The Mother's Bed"],blds:['stilt','witch','sunken','boathouse','herbal','tannery','ferry','smokehouse','drownedhouse','reedhut']},
  {name:'The Plains',type:'plains',seed:4040,boss:'harrow',next:null,zones:['The Low Fields','The Broken Road',"Harrow's Field"],blds:['farm','barn','windmill','inn','chapel','smithy','granary','manor','shepherd','burntfarm','tollhouse']},
];
/* three maps per area, one after another: the first leads to the second, the second to the last (where the boss waits) */
const NZ=3,LASTZ=2;
const LINKS=[{a:0,ea:'E',b:1,eb:'W'},{a:1,ea:'N',b:2,eb:'S'}];
const ZPROG=[.15,.5,.85];
/* difficulty by map (area × 3 + map). Each map is a clear step up from the last; the expected level climbs with it */
const MAP_SCALE=[0.85,1.3,1.5, 2.3,2.45,3.0, 3.6,3.8,4.5, 4.7,4.85,5.0],BOSS_SCALE=[1,1.6,2.05,2.45];
const ELV=mi=>1+4*mi;  /* levels come twice as fast since 0.13, so the expected level per map doubled too */
const curMap=()=>AR.i*NZ+(LV.kind==='zone'?LV.zi:(LV.parent||0));
/* xp per kill is set so that clearing a map once takes you to about the next map's level; past that, the penalty bites hard */
const XP_MAP=[.12,.29,.53, 1.67,2.15,2.97, 4.48,4.89,5.16, 2.92,2.62,2.8];
const AREAS=[];
let AR=null,LV=null,map,fires,decos,glowShrooms,fireflies,crows,chests,CHESTS,props,PROPAT,SPAWNS,REACH,START;
function bindLevel(L){LV=L;AR=L.area;MW=L.MW;MH=L.MH;map=L.map;fires=L.fires;decos=L.decos;glowShrooms=L.glow;fireflies=L.flies;crows=L.crows;chests=L.chests;CHESTS=L.CH;props=L.props;PROPAT=L.PAT;SPAWNS=L.spawns;REACH=L.reach;START=L.start;if(typeof bindSmalls==='function'&&L.reach)bindSmalls()}
function getArea(i){if(!AREAS[i])AREAS[i]={i,def:AREA_DEFS[i],zones:[],ints:{},bossDead:false,lastFire:null};return AREAS[i]}
function getZone(ar,zi){if(!ar.zones[zi]){const prev=LV;ar.zones[zi]=genZone(ar,zi);if(prev)bindLevel(prev)}return ar.zones[zi]}
function getInterior(ar,key){if(!ar.ints[key].L){const prev=LV,d=ar.ints[key];d.L=genInterior(ar,key,d);if(prev)bindLevel(prev)}return ar.ints[key].L}
function allLevels(ar){return ar.zones.filter(Boolean).concat(Object.values(ar.ints).map(d=>d.L).filter(Boolean))}
function newLevel(ar,kind,key,w,h){return{area:ar,kind,key,MW:w,MH:h,type:ar.def.type,map:new Uint8Array(w*h),seen:new Uint8Array(w*h),fires:[],decos:[],glow:[],flies:[],crows:[],chests:[],CH:{},props:[],PAT:{},spawns:[],reach:null,chunks:new Map(),dbk:new Map(),gates:[],blds:[],bossTile:null,arena:null,pocket:null,puzzle:null,start:null,fpt:null,name:'',bellSeq:[],bellSolved:false,brazSolved:false,brazHint:false,prog:.5}}
const id=(x,y)=>y*MW+x;
const solidFill=()=>LV.kind==='interior'?IWALL:LV.type==='cave'?WALL:OAK;
const tAt=(x,y)=>(x<0||y<0||x>=MW||y>=MH)?solidFill():map[id(x,y)];
const isTree=t=>t===OAK||t===PINE||t===DEAD||t===ENTT;
const inPocket=(x,y)=>{const p=LV.pocket;return!!p&&x>=p.x0-1&&x<=p.x1+1&&y>=p.y0-1&&y<=p.y1+1};
const progress=()=>LV.prog;
function nearType(tx,ty,types,r){for(let y=ty-r;y<=ty+r;y++)for(let x=tx-r;x<=tx+r;x++)if(types.includes(tAt(x,y)))return true;return false}
function flood(passBarrier){const s=LV.fpt,seen=new Uint8Array(MW*MH),q=[id(s.x,s.y)];seen[q[0]]=1;
  while(q.length){const c=q.pop(),cx=c%MW,cy=(c/MW)|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=MW||ny>=MH)continue;const ni=id(nx,ny),t=map[ni];
    if(seen[ni]||(BLOCK[t]&&!(passBarrier&&(t===BARRIER||t===FIRE&&inPocket(nx,ny)))))continue;seen[ni]=1;q.push(ni)}}return seen}
const touchesReach=(s,x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>s[id(x+dx,y+dy)]);
function addDeco(o){decos.push(o);const k=((o.x/256)|0)+','+((o.y/256)|0);let b=LV.dbk.get(k);if(!b)LV.dbk.set(k,b=[]);b.push(o)}
function addChest(x,y,loot){map[id(x,y)]=CHEST;const o={x,y,open:false,loot};chests.push(o);CHESTS[id(x,y)]=o;return o}
function addProp(t,x,y,solid,extra){const p=Object.assign({t,tx:x,ty:y,x:x*T+8,y:y*T+8,solid,st:0,cd:0,away:true},extra||{});props.push(p);PROPAT[id(x,y)]=p;if(solid)map[id(x,y)]=PROPT;return p}
function gatePos(ar,li){const r=mulberry(ar.def.seed*13+li*977+RUN);return 18+((r()*(ZS-40))|0)}
function edgeTiles(e,pos){return e==='E'?[[ZS-1,pos],[ZS-1,pos+1]]:e==='W'?[[0,pos],[0,pos+1]]:e==='N'?[[pos,0],[pos+1,0]]:[[pos,ZS-1],[pos+1,ZS-1]]}
function edgeInner(e,pos){return e==='E'?{x:ZS-4,y:pos}:e==='W'?{x:3,y:pos}:e==='N'?{x:pos,y:3}:{x:pos,y:ZS-4}}
/* BFS repair: carve the shortest path from (x,y) to anything already reachable */
function bfsConnect(x,y,seen,reserved,setRoad){const prev=new Int32Array(MW*MH).fill(-1),q=[id(x,y)];prev[q[0]]=q[0];let hit=-1;
  for(let qi=0;qi<q.length&&hit<0;qi++){const c=q[qi],cx=c%MW,cy=(c/MW)|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy;if(nx<2||ny<2||nx>=MW-2||ny>=MH-2)continue;const ni=id(nx,ny);if(prev[ni]>=0||reserved(nx,ny))continue;prev[ni]=c;if(seen[ni]){hit=ni;break}q.push(ni)}}
  if(hit<0)return;let c=prev[hit];while(c!==id(x,y)&&c>=0){const cx=c%MW,cy=(c/MW)|0;if(BLOCK[map[c]]&&map[c]!==FIRE&&map[c]!==CHEST&&map[c]!==PROPT)setRoad(cx,cy);c=prev[c]}}

function genZone(ar,zi){const def=ar.def,ty=def.type,L=newLevel(ar,'zone',zi,ZS,ZS);L.name=def.zones[zi];L.zi=zi;L.prog=ZPROG[zi];bindLevel(L);
  const seed=def.seed*7+zi*131+RUN,r=mulberry(seed),N1=makeNoise(seed),N2=makeNoise(seed+1),N3=makeNoise(seed+2);
  const treeFor=(x,y)=>ty==='swamp'?(N3(x/6,y/6)>.6?DEAD:PINE):ty==='plains'?OAK:(N3(x/9,y/9)>.55?PINE:OAK);
  const solid=(x,y)=>ty==='cave'?WALL:treeFor(x,y);
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const n=N1(x/8,y/8)*.65+N2(x/3,y/3)*.35;let t=G;
    if(ty==='cave')t=WALL;else if(x<2||y<2||x>=MW-2||y>=MH-2)t=treeFor(x,y);
    else if(ty==='plains'){if(n>.63)t=OAK;else if(r()<.015)t=OAK;else if(r()<.006)t=ROCKT}
    else{if(n>.5)t=treeFor(x,y);else if(n>.42&&r()<.4)t=treeFor(x,y);else if(r()<.05)t=treeFor(x,y);else if(r()<.01)t=ROCKT}
    map[id(x,y)]=t}
  if(ty==='swamp')for(let y=3;y<MH-3;y++)for(let x=3;x<MW-3;x++){const b=N2(x/6+20,y/6+20);if(b>.64)map[id(x,y)]=BOG;else if(b>.56)map[id(x,y)]=MUD;else if(N1(x/4+40,y/4)>.72&&map[id(x,y)]===G)map[id(x,y)]=MUD}
  if(ty==='plains'){for(let y=3;y<MH-3;y++)for(let x=3;x<MW-3;x++)if(N2(x/8+30,y/8+30)>.72)map[id(x,y)]=WATER;
    const vert=r()<.5;let rp=35+((r()*30)|0);for(let k=0;k<ZS;k++){const q=r();rp+=q<.3?-1:q<.6?1:0;rp=clamp(rp,25,ZS-28);for(let j=0;j<3;j++){if(vert)map[id(rp+j,k)]=WATER;else map[id(k,rp+j)]=WATER}}}
  /* 0.17: every area gets what makes the swamp work: a second layer of ground you can't simply walk through, so paths bend, split and cross it.
     Woods: denser thickets, mud and a winding creek or two. Cave: natural caverns and an underground stream. Plains: hedgerows and old stone walls */
  const meander=(x,y,a0,len,fn)=>{let wig=r()*6.283,ang=a0;for(let k=0;k<len;k++){wig+=(r()-.5)*.5;ang=a0+Math.sin(wig)*.75;x+=Math.cos(ang);y+=Math.sin(ang);if(x<3||y<3||x>MW-4||y>MH-4)break;fn(Math.round(x),Math.round(y))}};
  const edgeStart=()=>{const e=(r()*4)|0,t=10+r()*(ZS-20);return e===0?[3,t,0]:e===1?[MW-4,t,Math.PI]:e===2?[t,3,Math.PI/2]:[t,MH-4,-Math.PI/2]};
  if(ty==='woods'){for(let y=3;y<MH-3;y++)for(let x=3;x<MW-3;x++){const q=id(x,y);if(map[q]===G&&N2(x/7+50,y/7)>.6)map[q]=treeFor(x,y);else if(map[q]===G&&N1(x/5+30,y/5+9)>.7)map[q]=MUD}
    for(let c=0;c<1+(r()<.6?1:0);c++){const[sx,sy,a]=edgeStart();meander(sx,sy,a+(r()-.5)*.6,260,(x,y)=>{for(const[a2,b2]of[[0,0],[1,0],[0,1],[1,1]]){const q=id(x+a2,y+b2);if(x+a2<MW-2&&y+b2<MH-2)map[q]=WATER}})}}
  if(ty==='cave'){for(let y=4;y<MH-4;y++)for(let x=4;x<MW-4;x++){const v=N1(x/7+11,y/7+3)*.7+N2(x/3,y/3)*.3;if(v>.6)map[id(x,y)]=G}
    {const[sx,sy,a]=edgeStart();meander(sx,sy,a+(r()-.5)*.6,240,(x,y)=>{for(const[a2,b2]of[[0,0],[1,0],[0,1],[1,1]])if(x+a2<MW-2&&y+b2<MH-2)map[id(x+a2,y+b2)]=WATER})}}
  if(ty==='plains')for(let k=0;k<16;k++){let x=6+r()*(ZS-12),y=6+r()*(ZS-12);const horiz=r()<.5,len=6+((r()*12)|0),stone=r()<.35;for(let i=0;i<len;i++){const ix=Math.round(x),iy=Math.round(y);if(map[id(ix,iy)]===G)map[id(ix,iy)]=stone?ROCKT:OAK;if(horiz)x+=1,y+=r()<.2?(r()<.5?1:-1):0;else y+=1,x+=r()<.2?(r()<.5?1:-1):0;if(x<4||y<4||x>MW-5||y>MH-5)break}}
  const reservedT=new Uint8Array(MW*MH),reserved=(x,y)=>reservedT[id(x,y)]===1;
  const setRoad=(x,y)=>{if(x<1||y<1||x>=MW-1||y>=MH-1||reserved(x,y))return;const t=map[id(x,y)];map[id(x,y)]=(t===BOG||t===WATER||t===BRIDGE)?BRIDGE:ROAD};
  /* winding tunnels (not in the swamp, which is right as it is): a heading that wanders but keeps turning back towards where it's going, and a width that swells and narrows */
  const carveW=(p,q)=>{let x=p.x,y=p.y,ang=Math.atan2(q.y-y,q.x-x),wig=r()*6.283,n=0,wd=1;const cap=Math.hypot(q.x-x,q.y-y)*1.5+8;
    while(Math.hypot(q.x-x,q.y-y)>1.5&&n++<cap){const d=Math.hypot(q.x-x,q.y-y);let da=Math.atan2(q.y-y,q.x-x)-ang;da=Math.atan2(Math.sin(da),Math.cos(da));wig+=(r()-.5)*.9;
      ang+=da*(d<10?.5:.22)+Math.sin(wig)*.17;x=clamp(x+Math.cos(ang),3,MW-4);y=clamp(y+Math.sin(ang),3,MH-4);if(r()<.08)wd=ty==='cave'&&r()<.3?2:1;const ix=Math.round(x),iy=Math.round(y);
      for(let a=-1;a<=wd;a++)for(let b=-1;b<=wd;b++)if(wd<2||Math.abs(a)+Math.abs(b)<4)setRoad(ix+a,iy+b)}
    carveS({x:Math.round(x),y:Math.round(y)},q)};
  const carveS=(p,q)=>{let x=p.x,y=p.y,n=0;while((x!==q.x||y!==q.y)&&n++<900){for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)setRoad(x+a,y+b);
      const dx=Math.sign(q.x-x),dy=Math.sign(q.y-y);
      if(r()<.22){if(r()<.5&&dy)x+=r()<.5?1:-1;else if(dx)y+=r()<.5?1:-1}
      else if(dx&&(!dy||r()<Math.abs(q.x-x)/(Math.abs(q.x-x)+Math.abs(q.y-y))))x+=dx;else y+=dy;
      x=clamp(x,3,MW-4);y=clamp(y,3,MH-4)}for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)setRoad(x+a,y+b)};
  const carve=(p,q)=>ty==='swamp'?carveS(p,q):carveW(p,q);
  const clear=(cx,cy,rad,force)=>{for(let y=Math.floor(cy-rad);y<=cy+rad;y++)for(let x=Math.floor(cx-rad);x<=cx+rad;x++){if(x<2||y<2||x>=MW-2||y>=MH-2||reserved(x,y))continue;
      if(Math.hypot(x-cx,y-cy)<=rad+(hash(x,y)-.5)){const t=map[id(x,y)];if(t!==ROAD&&t!==BRIDGE&&(force||t!==BOG&&t!==WATER))map[id(x,y)]=G}}};
  const pts=[],far=(x,y,d)=>pts.every(p=>Math.hypot(p.x-x,p.y-y)>=d);
  const randPt=(m,d,tries=300)=>{for(let k=0;k<tries;k++){const x=m+((r()*(ZS-2*m))|0),y=m+((r()*(ZS-2*m))|0);if(far(x,y,d))return{x,y}}return{x:m+((r()*(ZS-2*m))|0),y:m+((r()*(ZS-2*m))|0)}};
  // gates
  LINKS.forEach((lk,li)=>{if(lk.a!==zi&&lk.b!==zi)return;const e=lk.a===zi?lk.ea:lk.eb,to=lk.a===zi?lk.b:lk.a,pos=gatePos(ar,li),inner=edgeInner(e,pos);
    L.gates.push({e,pos,to,li,inner,tiles:edgeTiles(e,pos)});pts.push(Object.assign({k:'gate'},inner))});
  // fire / start
  if(zi===0){const s=ar.i===0?{x:14+((r()*12)|0),y:ZS-16-((r()*12)|0)}:randPt(16,26);L.start={x:s.x,y:s.y};pts.push({x:s.x,y:s.y+1,k:'start'});
    if(ar.i>0){const a=r()*6.283,bx=clamp(Math.round(s.x+Math.cos(a)*6),6,ZS-7),by=clamp(Math.round(s.y+Math.sin(a)*6),6,ZS-7);L.back={x:bx,y:by};pts.push({x:bx,y:by,k:'back'})}}
  /* every other map has a camp just inside the way in: a lit fire, an anvil, a stash, and (unless you are playing Hardcore) Mortimer */
  else{const g=L.gates.find(q=>q.to===zi-1)||L.gates[0],dv={N:[0,1],S:[0,-1],E:[-1,0],W:[1,0]}[g.e],s={x:clamp(g.inner.x+dv[0]*6,8,ZS-9),y:clamp(g.inner.y+dv[1]*6,8,ZS-9)};L.start=s;pts.push({x:s.x,y:s.y+1,k:'start'})}
  // arena + pocket
  if(zi===LASTZ){const a=randPt(20,34);L.arena={x:a.x,y:a.y,r:6};pts.push({x:a.x,y:a.y,k:'arena'});
    const dirs=[[0,-1],[1,0],[0,1],[-1,0]].sort(()=>r()-.5);let d=dirs[0];for(const dd of dirs){const cx=a.x+dd[0]*12,cy=a.y+dd[1]*12;if(cx>10&&cy>10&&cx<ZS-10&&cy<ZS-10){d=dd;break}}
    const pcx=a.x+d[0]*12,pcy=a.y+d[1]*12;L.pocket={x0:pcx-2,y0:pcy-2,x1:pcx+2,y1:pcy+2,gap:{x:pcx-d[0]*3,y:pcy-d[1]*3},out:{x:pcx-d[0]*4,y:pcy-d[1]*4},fire:{x:pcx,y:pcy},exit:def.next!=null?{x:pcx+d[0]*2+(d[0]?0:1),y:pcy+d[1]*2+(d[1]?0:1)}:null};
    for(let y=L.pocket.y0-2;y<=L.pocket.y1+2;y++)for(let x=L.pocket.x0-2;x<=L.pocket.x1+2;x++)reservedT[id(x,y)]=1;reservedT[id(L.pocket.out.x,L.pocket.out.y)]=0;pts.push({x:L.pocket.out.x,y:L.pocket.out.y,k:'out'})}
  /* campfires are only for travel now, so fewer of them, spread as far from each other (and from the way in) as the map allows */
  const nf=(zi===0?3:zi===LASTZ?2:3)-(DIFF.h>1?1:0),fireSpots=[],anchors=pts.filter(p=>p.k==='gate'||p.k==='start'||p.k==='arena');
  for(let k=0;k<nf;k++){let best=null,bd=-1;for(let t=0;t<90;t++){const x=12+((r()*(ZS-24))|0),y=12+((r()*(ZS-24))|0);if(!far(x,y,10))continue;let m=1e9;for(const a of anchors.concat(fireSpots))m=Math.min(m,Math.hypot(a.x-x,a.y-y));if(m>bd){bd=m;best={x,y}}}
    const p=best||randPt(10,17);fireSpots.push(p);pts.push({x:p.x,y:p.y+1,k:'fire'})}
  if(def.puzzle&&def.puzzle.z===zi){const p=randPt(12,20);L.puzzle={t:def.puzzle.t,x:p.x,y:p.y};pts.push({x:p.x,y:p.y,k:'puzzle'})}
  // buildings
  /* every map draws its buildings from a shuffled list, so you see different kinds map to map; if one won't fit, the next kind is tried */
  const nb=ty==='cave'?7:9,pool=def.blds.slice().sort(()=>r()-.5);let pi=0;for(let k=0;k<nb;k++)for(let tryB=0;tryB<pool.length;tryB++){const bt=pool[pi++%pool.length],B=BTYPES[bt];let placed=false;
    for(let tries=0;tries<200;tries++){const bx=8+((r()*(ZS-16-B.fw))|0),by=8+((r()*(ZS-16-B.fh))|0),cx=bx+B.fw/2,cy=by+B.fh/2;if(!far(cx,cy,14))continue;
      let bad=false;for(let y=by-1;y<=by+B.fh+1&&!bad;y++)for(let x=bx-1;x<=bx+B.fw;x++)if(reserved(x,y))bad=true;if(bad)continue;
      const key=`z${zi}b${k}`,door={x:bx+(B.fw>>1),y:by+B.fh-1},nailed=k===nb-1&&r()<.85;L.blds.push({x:bx,y:by,bt,key,door,nailed});ar.ints[key]={bt,zi,door,key,nailed};
      for(let y=by-1;y<=by+B.fh;y++)for(let x=bx-1;x<=bx+B.fw;x++)reservedT[id(x,y)]=1;pts.push({x:door.x,y:door.y+1,k:'door',cx,cy});placed=true;break}if(placed)break}
  for(let k=0;k<22;k++){const p=randPt(6,8);pts.push(Object.assign({k:'way'},p))}
  // clear and connect
  for(const p of pts){const force=p.k!=='way';clear(p.x,p.y,p.k==='arena'?6:p.k==='start'?4.6:p.k==='way'?2.5+r()*2.5:3.2,force)}
  for(const b of L.blds){const B=BTYPES[b.bt];for(let y=b.y-1;y<=b.y+B.fh+1;y++)for(let x=b.x-1;x<=b.x+B.fw;x++)if(x>1&&y>1&&x<MW-2&&y<MH-2)map[id(x,y)]=G}
  const inT=new Set([0]),edges=[];while(inT.size<pts.length){let best=null;for(const i of inT)for(let j=0;j<pts.length;j++){if(inT.has(j))continue;const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);if(!best||d<best.d)best={i,j,d}}inT.add(best.j);edges.push([best.i,best.j])}
  for(let k=0;k<5;k++){const i=(r()*pts.length)|0,j=(r()*pts.length)|0;if(i!==j&&Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y)<45)edges.push([i,j])}
  /* loops: outside the swamp, many points also join their second- or third-nearest neighbour, so most routes have another way round */
  if(ty!=='swamp')pts.forEach((p,i)=>{if(p.k==='way'||r()>.5)return;const o=pts.map((q,j)=>[j,Math.hypot(p.x-q.x,p.y-q.y)]).filter(([j,d])=>j!==i&&d<42&&!edges.some(([a,b])=>(a===i&&b===j)||(a===j&&b===i))).sort((a,b)=>a[1]-b[1]);if(o.length>1)edges.push([i,o[1+((r()*Math.min(2,o.length-1))|0)][0]])});
  for(const[i,j]of edges)carve(pts[i],pts[j]);
  for(let k=0;k<10;k++){const p=pts[(r()*pts.length)|0],q={x:clamp(p.x+((r()-.5)*40|0),5,ZS-6),y:clamp(p.y+((r()-.5)*40|0),5,ZS-6)};carve(p,q);clear(q.x,q.y,2.5)}
  if(ty==='cave')for(let k=0;k<12;k++){const cx=6+((r()*(ZS-12))|0),cy=6+((r()*(ZS-12))|0);if(reserved(cx,cy))continue;for(let y=cy-2;y<=cy+2;y++)for(let x=cx-3;x<=cx+3;x++)if(map[id(x,y)]===G&&Math.hypot((x-cx)/3,(y-cy)/2)<1&&!reserved(x,y))map[id(x,y)]=WATER}
  // fixed features
  for(const g of L.gates)for(const[x,y]of g.tiles){map[id(x,y)]=GATE;const ix=x===0?1:x===ZS-1?ZS-2:x,iy=y===0?1:y===ZS-1?ZS-2:y;map[id(ix,iy)]=ROAD;const jx=x===0?2:x===ZS-1?ZS-3:x,jy=y===0?2:y===ZS-1?ZS-3:y;map[id(jx,jy)]=ROAD}
  if(L.start){fires.push({x:L.start.x,y:L.start.y,lit:true,away:false,travel:true,start:true})}
  for(const p of fireSpots)fires.push({x:p.x,y:p.y,lit:false,away:true});
  for(const f of fires)map[id(f.x,f.y)]=FIRE;
  if(L.arena){const ar2=L.arena;for(let k=0;k<11;k++){const an=k/11*Math.PI*2+.3,x=Math.round(ar2.x+Math.cos(an)*(ar2.r-.5)),y=Math.round(ar2.y+Math.sin(an)*(ar2.r-1));if(map[id(x,y)]===G)map[id(x,y)]=STN}
    L.bossTile={x:ar2.x,y:ar2.y-2};map[id(ar2.x,ar2.y-2)]=def.boss==='elder'?ENTT:G;
    const pk=L.pocket;for(let y=pk.y0-1;y<=pk.y1+1;y++)for(let x=pk.x0-1;x<=pk.x1+1;x++){const edge=x===pk.x0-1||x===pk.x1+1||y===pk.y0-1||y===pk.y1+1;map[id(x,y)]=edge?solid(x,y):G}
    map[id(pk.gap.x,pk.gap.y)]=BARRIER;map[id(pk.out.x,pk.out.y)]=ROAD;
    if(pk.exit)map[id(pk.exit.x,pk.exit.y)]=EXIT}
  if(L.back)map[id(L.back.x,L.back.y)]=EXIT;
  for(const b of L.blds){const B=BTYPES[b.bt];for(let y=b.y;y<b.y+B.fh;y++)for(let x=b.x;x<b.x+B.fw;x++)map[id(x,y)]=BLDG;map[id(b.door.x,b.door.y)]=DOOR;if(map[id(b.door.x,b.door.y+1)]!==BRIDGE)map[id(b.door.x,b.door.y+1)]=ROAD}
  L.fpt=L.gates[0].inner;map[id(L.fpt.x,L.fpt.y)]=ROAD;
  // guarantee every important point is reachable
  const must=()=>pts.filter(p=>p.k!=='way').map(p=>p.k==='door'?{x:p.x,y:p.y}:p);
  for(let pass=0;pass<3;pass++){let s=flood(true),fixed=0;for(const p of must()){if(s[id(p.x,p.y)])continue;bfsConnect(p.x,p.y,s,(x,y)=>reserved(x,y)&&!(x===p.x&&y===p.y),setRoad);fixed++;s=flood(true)}
    for(const f of fires){if(inPocket(f.x,f.y))continue;if(!s[id(f.x,f.y+1)]){map[id(f.x,f.y+1)]=G;bfsConnect(f.x,f.y+1,s,reserved,setRoad);fixed++;s=flood(true)}}if(!fixed)break}
  let seen=flood(true);
  for(let k=0;k<MW*MH;k++){const t=map[k];if(!seen[k]&&(t===G||t===MUD||t===ROAD)){const x=k%MW,y=(k/MW)|0;if(!inPocket(x,y))map[k]=solid(x,y)}}
  REACH=L.reach=seen;
  // chests
  const ar2=L.arena,cc=[];for(let y=3;y<MH-3;y++)for(let x=3;x<MW-3;x++){const k=id(x,y);if(map[k]!==G||!seen[k]||inPocket(x,y))continue;
    let open=0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])if(!BLOCK[map[id(x+dx,y+dy)]])open++;if(open!==1)continue;
    if(nearType(x,y,[ROAD,BRIDGE,FIRE,DOOR,GATE],2)||(ar2&&Math.hypot(x-ar2.x,y-ar2.y)<ar2.r+2))continue;cc.push({x,y})}
  /* chests are rarer than they were (0.15): at most 6 ordinary ones a map (plus the hidden and tool-locked ones), never closer than 14 tiles */
  cc.sort(()=>r()-.5);for(const c of cc){if(chests.length>=6)break;if(chests.some(o=>Math.hypot(o.x-c.x,o.y-c.y)<14))continue;addChest(c.x,c.y,null)}
  if(chests.length<5){const nb2=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]].filter(([p,q])=>BLOCK[map[id(x+p,y+q)]]).length,fb=[];
    for(let y=3;y<MH-3;y++)for(let x=3;x<MW-3;x++){const k=id(x,y);if(map[k]!==G||!seen[k]||inPocket(x,y)||nb2(x,y)<(ty==='cave'?4:5))continue;if(nearType(x,y,[ROAD,BRIDGE,FIRE,DOOR,GATE],2))continue;fb.push({x,y})}
    fb.sort(()=>r()-.5);for(const c of fb){if(chests.length>=5)break;if(chests.some(o=>Math.hypot(o.x-c.x,o.y-c.y)<14))continue;
      map[id(c.x,c.y)]=CHEST;const s2=flood(true);map[id(c.x,c.y)]=G;if(!fires.every(f=>inPocket(f.x,f.y)||touchesReach(s2,f.x,f.y))||!L.gates.every(g=>s2[id(g.inner.x,g.inner.y)]))continue;addChest(c.x,c.y,null)}}
  /* open a small glade around each chest so canopies never bury it */
  for(const c of chests)for(let dy=-1;dy<=2;dy++)for(let dx=-1;dx<=1;dx++){const x=c.x+dx,y=c.y+dy,q=id(x,y),t=map[q];if((dx||dy)&&(t===OAK||t===PINE||t===DEAD)&&!inPocket(x,y)&&!PROPAT[q])map[q]=G}
  REACH=L.reach=flood(true);
  makeSecrets(L,r,ty);
  /* the tool for this map lies in the chest furthest from the way in, and right beside it is somewhere only that tool opens */
  if(zi<LASTZ){const tk=(TOOL_MAP[ar.i]||[])[zi],s0=L.start||L.fpt,cs=chests.filter(c=>!c.loot&&!c.veil&&!c.secret).sort((a,b)=>Math.hypot(b.x-s0.x,b.y-s0.y)-Math.hypot(a.x-s0.x,a.y-s0.y));
    if(tk&&cs.length){let done=false;for(const d of[5,8,12])for(const rc of cs.slice(0,4)){if(done)break;const sc=makeSecret(L,r,TOOL_GATE[tk],{x:rc.x,y:rc.y,d});if(sc){sc.near=1;rc.loot=['t_'+tk];rc.relic=1;done=true}}
      if(!done){cs[0].loot=['t_'+tk];cs[0].relic=1}}}
  makeDeadEnds(L,r);
  {const oc=chests.filter(c=>!c.loot&&!c.veil&&!c.secret&&!c.relic);if(oc.length>3)oc[(r()*oc.length)|0].locked=1}
  placeProps(r,ty);
  /* last pass: anything placed after the main layout (puzzles, props, chests, spawns, roadside events) must be walkable to.
     If it isn't, carve the shortest path to it. Secret chests stay behind their tool gates. */
  {const want=[];for(const p of props)if(!p.tree)want.push([p.tx,p.ty,p.solid]);for(const c of chests)if(!c.secret&&!c.sealed)want.push([c.x,c.y,1]);
   for(const sp of L.spawns)want.push([Math.floor(sp.x/T),Math.floor(sp.y/T),0]);for(const e of L.evs||[])want.push([e.x,e.y,0]);
   let s=flood(true);
   for(const[x,y,solid]of want){if(x<2||y<2||x>=MW-2||y>=MH-2||inPocket(x,y))continue;if(solid?touchesReach(s,x,y):(s[id(x,y)]||touchesReach(s,x,y)))continue;
     let sx=x,sy=y;if(solid){const o=[[0,1],[1,0],[-1,0],[0,-1]].map(([a,b])=>[x+a,y+b]).find(([a,b])=>!BLOCK[map[id(a,b)]])||[x,y+1];[sx,sy]=o;if(BLOCK[map[id(sx,sy)]]&&!PROPAT[id(sx,sy)]&&!reserved(sx,sy))setRoad(sx,sy)}
     else if(BLOCK[map[id(sx,sy)]]&&!PROPAT[id(sx,sy)])setRoad(sx,sy);
     bfsConnect(sx,sy,s,(a,b)=>reserved(a,b)||!!PROPAT[id(a,b)],setRoad);s=flood(true)}
   /* secret chests: reachable once the tool clears the way */
   const sT=(()=>{const st=L.fpt,seen=new Uint8Array(MW*MH),q=[id(st.x,st.y)];seen[q[0]]=1;while(q.length){const c=q.pop(),cx=c%MW,cy=(c/MW)|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=MW||ny>=MH)continue;const ni=id(nx,ny),t=map[ni];if(seen[ni]||(BLOCK[t]&&t!==BARRIER&&!isGateT(t)))continue;seen[ni]=1;q.push(ni)}}return seen})();
   for(const c of chests)if(c.secret&&!touchesReach(sT,c.x,c.y)){const o=[[0,1],[1,0],[-1,0],[0,-1]].map(([a,b])=>[c.x+a,c.y+b]).find(([a,b])=>!BLOCK[map[id(a,b)]]);if(o){bfsConnect(o[0],o[1],sT,(a,b)=>reserved(a,b)||!!PROPAT[id(a,b)],setRoad);s=flood(true)}}
   /* owls, nests and chimes sit in trees: drop any that ended up walled in */
   for(let i=props.length-1;i>=0;i--){const p=props[i];if(p.tree&&!touchesReach(s,p.tx,p.ty)){props.splice(i,1);delete PROPAT[id(p.tx,p.ty)]}}
   REACH=L.reach=s}
  for(let k=0;k<3600;k++){const x=2+((r()*(ZS-4))|0),y=2+((r()*(ZS-4))|0),t=map[id(x,y)];if(t!==G&&t!==MUD)continue;
    const nearTree=isTree(tAt(x+1,y))||isTree(tAt(x-1,y))||isTree(tAt(x,y-1))||tAt(x,y-1)===WALL;const ox=x*T+2+((r()*12)|0),oy=y*T+2+((r()*12)|0),p=r();
    if(ty==='plains'){addDeco({x:ox,y:oy,k:p<.45?'flower':'grass',c:pick(['#e84a4a','#f0d84a','#f4f4f4','#b86ae8','#5a9ae8','#f08ac8'])});continue}
    if(ty==='cave'){if(p<.08)glowShrooms.push({x:ox,y:oy,ph:r()*6,puff:0,cr:r()<.5});else addDeco({x:ox,y:oy,k:p<.2?'bones':'pebble'});continue}
    if(p<.06&&nearTree)glowShrooms.push({x:ox,y:oy,ph:r()*6,puff:0});else if(p<.1)addDeco({x:ox,y:oy,k:'bones'});else if(p<.13)addDeco({x:ox,y:oy,k:'skull'});
    else addDeco({x:ox,y:oy,k:ty==='swamp'&&nearType(x,y,[BOG],1)?'reed':nearTree?'fern':'grass'})}
  if(ty!=='cave')for(let k=0;k<(ty==='swamp'?120:ty==='plains'?36:40);k++){for(let tries=0;tries<20;tries++){const x=3+((r()*(ZS-6))|0),y=3+((r()*(ZS-6))|0);if(ty==='swamp'&&!nearType(x,y,[BOG],2))continue;fireflies.push({x:x*T,y:y*T,ph:r()*9,sp:.3+r()*.6});break}}
  if(ty!=='cave')for(let y=2;y<MH-2;y++)for(let x=2;x<MW-2;x++)if(map[id(x,y)]===DEAD&&r()<.22&&!PROPAT[id(x,y)])crows.push({x:x*T+8+((r()*6-3)|0),y:y*T-6-((r()*8)|0),st:0,vx:0,vy:0,t:r()*5});
  /* last safety net: anything solid you are meant to use (puzzle pieces, chests, props) must touch walkable ground you can actually get to */
  {let s=flood(true),ch=0;const need=props.filter(p=>!p.tree&&p.solid).map(p=>[p.tx,p.ty]).concat(chests.filter(c=>!c.secret&&!c.veil&&!c.sealed).map(c=>[c.x,c.y]));
   for(const[x,y]of need){if(x<2||y<2||x>=MW-2||y>=MH-2||inPocket(x,y)||touchesReach(s,x,y))continue;
     const o=[[0,1],[1,0],[-1,0],[0,-1]].map(([a,b])=>[x+a,y+b]).find(([a,b])=>!PROPAT[id(a,b)]&&!CHESTS[id(a,b)]&&a>0&&b>0&&a<MW-1&&b<MH-1);if(!o)continue;
     if(BLOCK[map[id(o[0],o[1])]])map[id(o[0],o[1])]=ty==='cave'?ROAD:G;bfsConnect(o[0],o[1],s,(a,b)=>reserved(a,b)||!!PROPAT[id(a,b)]||!!CHESTS[id(a,b)],setRoad);s=flood(true);ch++}
   if(ch)REACH=L.reach=s}
  genSmalls(r,ty);
  genSpawns();
  return L}

/* ---------- interiors ---------- */
const SOLID_OK=t=>t===OAK||t===PINE||t===DEAD||t===WALL||t===ROCKT||t===WATER||t===BOG;
/* tool-gated secret rooms: a short corridor sealed by brambles, cracked rock or deep water, a chest beyond */
function makeSecrets(L,r,ty){const D4=[[1,0],[-1,0],[0,1],[0,-1]];
  /* every map: one gate for each tool of its own region, and two more for tools from anywhere (some you will only be able to open on a later visit) */
  const own=TOOL_MAP[L.area.i]||[],all=TOOL_MAP.flat(),want=own.concat([all[(r()*all.length)|0],all[(r()*all.length)|0]]).map(k=>TOOL_GATE[k]);
  for(const kind of want)makeSecret(L,r,kind,null);}
/* one tool-gated nook: a short passage sealed by the gate, a little room beyond it with a chest. near = {x,y,d} keeps it close to a spot */
function makeSecret(L,r,kind,near){const D4=[[1,0],[-1,0],[0,1],[0,-1]],two=kind==='deep'||kind==='mire';
  for(let tries=0;tries<(near?900:700);tries++){
    const ax=near?clamp(near.x+(((r()*2-1)*near.d)|0),5,MW-6):5+((r()*(MW-10))|0),ay=near?clamp(near.y+(((r()*2-1)*near.d)|0),5,MH-6):5+((r()*(MH-10))|0),a=id(ax,ay);
    if(!REACH[a]||(map[a]!==G&&map[a]!==ROAD)||inPocket(ax,ay))continue;
    if(fires.some(f=>Math.hypot(f.x-ax,f.y-ay)<5)||L.gates.some(g=>Math.hypot(g.inner.x-ax,g.inner.y-ay)<6)||chests.some(c=>Math.hypot(c.x-ax,c.y-ay)<3))continue;
    const[dx,dy]=D4[(r()*4)|0],len=two?4:3,cx=ax+dx*(len+2),cy=ay+dy*(len+2);
    if(cx<5||cy<5||cx>MW-6||cy>MH-6)continue;
    const cells=[];for(let i=1;i<=len;i++)cells.push([ax+dx*i,ay+dy*i]);
    for(let y=cy-2;y<=cy+2;y++)for(let x=cx-2;x<=cx+2;x++)if(Math.hypot(x-cx,y-cy)<=2.3&&!cells.some(c=>c[0]===x&&c[1]===y))cells.push([x,y]);
    if(!cells.every(([x,y])=>SOLID_OK(map[id(x,y)])&&!REACH[id(x,y)]&&!PROPAT[id(x,y)]))continue;
    const old=cells.map(([x,y])=>map[id(x,y)]),GT=GATE_T[kind];
    cells.forEach(([x,y],i)=>{map[id(x,y)]=i===0||(two&&i===1)?GT:G});
    const s=flood(true);if(cells.slice(two?2:1).some(([x,y])=>s[id(x,y)])){cells.forEach(([x,y],i)=>map[id(x,y)]=old[i]);continue}
    const c=addChest(cx,cy,null);c.secret=1;c.need=GATE_TOOL[kind];return c}
  return null}
function makeDeadEnds(L,r){const D4=[[1,0],[-1,0],[0,1],[0,-1]];
  const dead=[];for(let y=4;y<MH-4;y++)for(let x=4;x<MW-4;x++){const q=id(x,y);if(map[q]!==G||!REACH[q]||inPocket(x,y))continue;
    if(D4.filter(([p,o])=>!BLOCK[map[id(x+p,y+o)]]).length!==1)continue;if(nearType(x,y,[ROAD,BRIDGE,FIRE,DOOR,GATE,CHEST,EXIT],2))continue;dead.push({x,y})}
  dead.sort(()=>r()-.5);let nv=0;for(const d of dead){if(nv>=2)break;if(chests.some(c=>Math.hypot(c.x-d.x,c.y-d.y)<8))continue;const o={x:d.x,y:d.y,open:false,loot:null,veil:1};chests.push(o);CHESTS[id(d.x,d.y)]=o;nv++}
  /* caches (0.16): something tucked into the very end of a few more dead ends. Nothing marks them. Press Use or strike there and you find it; Morbid Curiosity makes them glimmer */
  L.caches=[];for(const d of dead){if(L.caches.length>=3)break;if(chests.some(c=>Math.hypot(c.x-d.x,c.y-d.y)<8)||L.caches.some(c=>Math.hypot(c.x-d.x,c.y-d.y)<16))continue;L.caches.push({x:d.x,y:d.y,got:0})}}
function genInterior(ar,key,d){const B=BTYPES[d.bt],L=newLevel(ar,'interior',key,B.iw,B.ih);L.name=B.name;L.bt=d.bt;L.parent=d.zi;L.door=d.door;L.mat=B.mat;L.prog=ZPROG[d.zi];bindLevel(L);
  const r=mulberry(ar.def.seed*31+key.length*7+d.door.x*131+d.door.y+RUN),w=B.iw,h=B.ih;
  map.fill(IWALL);
  const rects=[{x:1,y:2,w:w-2,h:h-3}],walls=[];
  while(rects.length<B.rooms){rects.sort((a,b)=>b.w*b.h-a.w*a.h);const R=rects.shift(),vert=R.w>R.h;
    if(vert&&R.w<9||!vert&&R.h<8){rects.push(R);break}
    if(vert){const c=R.x+3+((r()*(R.w-6))|0);rects.push({x:R.x,y:R.y,w:c-R.x,h:R.h},{x:c+1,y:R.y,w:R.x+R.w-c-1,h:R.h});walls.push({v:1,c,a:R.y,b:R.y+R.h-1})}
    else{const c=R.y+3+((r()*(R.h-6))|0);rects.push({x:R.x,y:R.y,w:R.w,h:c-R.y},{x:R.x,y:c+1,w:R.w,h:R.y+R.h-c-1});walls.push({v:0,c,a:R.x,b:R.x+R.w-1})}}
  for(const R of rects)for(let y=R.y;y<R.y+R.h;y++)for(let x=R.x;x<R.x+R.w;x++)map[id(x,y)]=FLOOR;
  for(const wl of walls){const p=wl.a+1+((r()*(wl.b-wl.a-2))|0);for(let k=0;k<2;k++){if(wl.v)map[id(wl.c,p+k)]=FLOOR;else map[id(p+k,wl.c)]=FLOOR}}
  const mid=w>>1;map[id(mid,h-1)]=IDOOR;map[id(mid,h-2)]=FLOOR;map[id(mid,h-3)]=FLOOR;
  if(B.water)for(let k=0;k<4;k++){const cx=2+((r()*(w-4))|0),cy=3+((r()*(h-7))|0);for(let y=cy-1;y<=cy+1;y++)for(let x=cx-2;x<=cx+2;x++)if(map[id(x,y)]===FLOOR&&Math.abs(x-mid)>1&&r()<.8)map[id(x,y)]=WATER}
  L.start={x:mid,y:h-2};L.fpt={x:mid,y:h-2};
  {const s0=flood(false);for(let i=0;i<w*h;i++)if(map[i]===FLOOR&&!s0[i])map[i]=WATER}
  const floors=()=>{const s1=flood(false);let n=0;for(let i=0;i<w*h;i++)if(s1[i]&&map[i]===FLOOR)n++;return n};
  const okSolid=(x,y)=>{const before=floors(),old=map[id(x,y)];map[id(x,y)]=PROPT;const s=flood(false);let n=0;for(let i=0;i<w*h;i++)if(s[i]&&(map[i]===FLOOR))n++;map[id(x,y)]=old;return n>=before-1};
  const spots=[];for(let y=2;y<h-1;y++)for(let x=1;x<w-1;x++)if(map[id(x,y)]===FLOOR&&!(Math.abs(x-mid)<=1&&y>=h-4))spots.push({x,y,wall:[[0,-1],[-1,0],[1,0]].some(([a,b])=>map[id(x+a,y+b)]===IWALL)});
  spots.sort(()=>r()-.5);spots.sort((a,b)=>b.wall-a.wall);
  /* beds: 0-2 per building (1 most often); an anvil only one building in five */
  const FL=B.furn.filter(f=>f!=='bed'&&f!=='anvil');{const q=r(),nb=q<.2?0:q<.85?1:2;for(let i=0;i<nb;i++)FL.splice(Math.min(FL.length,1+i),0,'bed');if(r()<.2)FL.splice(Math.min(FL.length,2),0,'anvil')}
  for(const f of FL){const nonSolid=f==='painting';for(let k=0;k<spots.length;k++){const s=spots[k];if(map[id(s.x,s.y)]!==FLOOR||PROPAT[id(s.x,s.y)])continue;
    if(f==='painting'&&map[id(s.x,s.y-1)]!==IWALL)continue;if(f==='pew'&&s.wall&&r()<.7)continue;
    if(!nonSolid&&!okSolid(s.x,s.y))continue;addProp('f_'+f,s.x,s.y,!nonSolid);spots.splice(k,1);break}}
  for(const R of rects)if(R.w>=4&&R.h>=4&&r()<.7)addDeco({x:(R.x+1)*T,y:(R.y+1)*T,k:'rug',w:(R.w-2)*T,h:(R.h-2)*T,c:pick(['#4a1e1a','#2a3a4a','#3a2a1a','#2a3a22'])});
  for(let x=1;x<w-1;x++)if(map[id(x,1)]===IWALL&&map[id(x,2)]===FLOOR&&x%4===2&&!PROPAT[id(x,2)])addDeco({x:x*T,y:T,k:'window'});
  const cs=spots.filter(s=>map[id(s.x,s.y)]===FLOOR&&s.y<h-4);for(let k=0;k<(d.nailed?2:1)&&cs.length;k++){const s=cs.splice((r()*cs.length)|0,1)[0];if(okSolid(s.x,s.y)){const c=addChest(s.x,s.y,null);if(d.nailed)c.veil=0,c.secret=0,c.hoard=1}}
  REACH=L.reach=flood(false);
  const ms=spots.filter(s=>map[id(s.x,s.y)]===FLOOR&&s.y<h-5),n=Math.min(ms.length,r()<.2?0:1+(B.iw>=20&&r()<.4?1:0));
  for(let k=0;k<n;k++){const s=ms[(r()*ms.length)|0];let kind=B.mobs[k%B.mobs.length];if(KINDS[kind].pack)kind=AREA_PACK[ar.def.type];SPAWNS.push({kind,x:s.x*T+8,y:s.y*T+12,n:KINDS[kind].pack?2:0,inside:1})}
  return L}

/* ---------- props ---------- */
function placeProps(r,ty){
  const tiles=[];for(let y=3;y<MH-3;y++)for(let x=3;x<MW-3;x++)if(map[id(x,y)]===G&&REACH[id(x,y)]&&!inPocket(x,y))tiles.push({x,y});
  tiles.sort(()=>r()-.5);
  const ar=LV.arena,st=LV.start||LV.fpt;
  const busy=(x,y,d=3)=>props.some(p=>Math.abs(p.tx-x)<d&&Math.abs(p.ty-y)<d&&Math.hypot(p.tx-x,p.ty-y)<d)||chests.some(c=>Math.hypot(c.x-x,c.y-y)<3)||fires.some(f=>Math.hypot(f.x-x,f.y-y)<3)||(ar&&Math.hypot(x-ar.x,y-ar.y)<ar.r+2)||nearType(x,y,[DOOR,GATE,BLDG],1);
  const treeN=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]].filter(([p,q])=>{const t=tAt(x+p,y+q);return isTree(t)||t===WALL}).length;
  let ti=0;const find=(fn,d=3)=>{for(let k=0;k<tiles.length;k++){const t=tiles[(ti+k)%tiles.length];if(map[id(t.x,t.y)]!==G||busy(t.x,t.y,d))continue;if(fn(t.x,t.y)){ti=(ti+k+1)%tiles.length;return t}}return null};
  const solidOK=(x,y)=>{if(nearType(x,y,[ROAD,BRIDGE],0))return false;const old=map[id(x,y)];map[id(x,y)]=PROPT;
    let ok=[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>!BLOCK[map[id(x+a,y+b)]]).length>=1;
    if(ok&&[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>!BLOCK[map[id(x+a,y+b)]]).length<=2){const s=flood(true);ok=fires.every(f=>inPocket(f.x,f.y)||touchesReach(s,f.x,f.y))&&LV.gates.every(g=>s[id(g.inner.x,g.inner.y)])&&chests.every(c=>touchesReach(s,c.x,c.y))&&LV.blds.every(b=>s[id(b.door.x,b.door.y+1)])}
    map[id(x,y)]=old;return ok};
  /* every map gets its own blend of the everyday clutter: roughly a third of the common kinds are left out, and the rest come in
     anywhere from half to one and a half times the usual number. Lore (graves, signs, notes), anything with a job to do, and each
     map's own special objects are never touched. */
  const VARY=['mound','stump','log','bush','owl','ring','cairn','glint','cart','satchel','cage','shrine','tent','totem','hollowlog','noticeboard','banner','coldcamp','mushring','spring','statue','idol','crow','skeleton','timber','crystal','frog','flowers','sheep','haystack','nest','chime','mudpot','geode','picnic','scare','bones','rocks'];
  const SKIP=new Set(),MUL={};for(const t of VARY){if(r()<.35)SKIP.add(t);MUL[t]=.5+r()}
  const place=(t,fn,solid,extra,d)=>{if(SKIP.has(t)&&!(typeof NEWP!=='undefined'&&NEWP[t]))return null;for(let k=0;k<30;k++){const s=find(fn,d);if(!s)return null;if(solid&&!solidOK(s.x,s.y)){tiles.splice(tiles.indexOf(s),1);continue}return addProp(t,s.x,s.y,solid,extra?Object.assign({},extra):null)}return null};
  const many=(t,n,fn,solid,extra,d)=>{if(MUL[t])n=Math.max(1,Math.round(n*MUL[t]));for(let k=0;k<n;k++)place(t,fn,solid,typeof extra==='function'?extra(k):extra,d)};
  /* the camp: anvil to one side of the fire, the stash to the other, Mortimer in front (not in Hardcore). Placed first so nothing else crowds it */
  if(LV.start&&LV.kind==='zone'){const f=LV.start,spot=(prefs,solid)=>{const ring=[];for(let rr=2;rr<=6;rr++)for(let a=0;a<16;a++)ring.push([Math.round(Math.cos(a*.39+.2)*rr),Math.round(1+Math.sin(a*.39+.2)*rr)]);
      for(const[dx,dy]of prefs.concat(ring)){const x=f.x+dx,y=f.y+dy,q=id(x,y);if(x<3||y<3||x>=MW-3||y>=MH-3)continue;if(dx===0&&(dy===1||dy===2))continue;
        if(PROPAT[q]||chests.some(c=>c.x===x&&c.y===y)||fires.some(o=>o.x===x&&o.y===y))continue;const t=map[q];
        if(solid?(t!==G||!solidOK(x,y)):!((t===G||t===ROAD)&&REACH[q]))continue;return{x,y}}return null};
    const an=spot([[-2,0],[-2,1],[-3,0],[-2,-1]],true);if(an)addProp('f_anvil',an.x,an.y,true);
    const sh=spot([[2,0],[2,1],[3,0],[2,-1]],true);if(sh)addProp('f_stash',sh.x,sh.y,true);
    if(!DIFF.hc){const cr=spot([[1,2],[-1,2],[1,3],[-1,3]],false);if(cr)addProp('crow',cr.x,cr.y,false)}}
  buildPuzzles(r,ty);
  const pz=LV.puzzle,TX=TXT[ty],any=()=>true,road1=(x,y)=>nearType(x,y,[ROAD],1),hid=(x,y)=>treeN(x,y)>=2;
  if(pz&&pz.t==='bell'){const order=[0,1,2,3].sort(()=>r()-.5);[[-2,-2],[2,-2],[-2,2],[2,2]].forEach(([dx,dy],k)=>{const x=pz.x+dx,y=pz.y+dy;map[id(x,y)]=G;addProp('bell',x,y,true,{pitch:order[k]})});map[id(pz.x,pz.y-3)]=G;addProp('grave',pz.x,pz.y-3,true,{ep:'bell'})}
  if(pz&&pz.t==='braz')[[-2,-1],[2,-1],[0,2]].forEach(([dx,dy])=>{const x=pz.x+dx,y=pz.y+dy;map[id(x,y)]=G;addProp('brazier',x,y,true,{lit:0})});
  for(let k=0;k<3;k++){const e=takeU('ep'+ty,TX.eps);if(!e)break;place('grave',hid,true,{ep:e})}
  for(let k=0;k<2;k++){const t=takeU('sign'+ty,TX.signs);if(!t)break;place('sign',road1,true,{text:t},6)}
  for(let k=0;k<2;k++){const t=takeU('note'+ty,TX.notes);if(!t)break;place('corpse',hid,false,{note:t},8)}
  const openish=(x,y)=>{for(let p=-1;p<=1;p++)for(let q=-1;q<=1;q++)if(BLOCK[map[id(x+p,y+q)]]||map[id(x+p,y+q)]===ROAD)return false;return true};
  for(let k=0;k<2;k++){const r1=place('ring',openish,false,null,6);const r2=r1&&place('ring',(x,y)=>openish(x,y)&&Math.hypot(x-r1.tx,y-r1.ty)>40,false,null,6);
    if(r1&&r2){r1.pair=r2;r2.pair=r1}else if(r1){props.splice(props.indexOf(r1),1);delete PROPAT[id(r1.tx,r1.ty)]}}
  many('mound',ty==='cave'?7:5,any,false,null,6);
  many('cart',3,road1,true,null,8);many('cage',ty==='plains'?1:2,hid,true,null,8);for(let k=0;k<1;k++){const t=takeU('statue',FL.statue);if(t)place('statue',any,true,{ins:t},10)}many('shrine',2,road1,true,null,10);many('cairn',4,any,true,null,8);
  if(ty!=='cave'){many('log',6,any,true,null,5);many('stump',7,any,true,null,4);many('tent',2,hid,true,null,12);many('bush',ty==='plains'?8:6,(x,y)=>treeN(x,y)>=1,true,()=>({bad:r()<.33}));if(LV.zi%2===1)place('hungry',hid,true)}
  if(ty==='woods'||ty==='swamp')many('totem',2,hid,true,null,10);many('idol',1,hid,true,null,12);
  const nearW=(x,y)=>nearType(x,y,[WATER,BOG],1);
  if(ty==='woods'){many('axestump',1,any,true,null,14);many('hollowlog',2,hid,true,null,10);many('stoneface',1,hid,true,null,16)}
  if(ty==='cave'){many('crevice',2,any,false,null,12);many('skeleton',3,hid,false,null,8);many('stoneface',1,hid,true,null,16)}
  if(ty==='swamp'){many('mudpot',3,any,false,null,8);many('hollowlog',2,hid,true,null,10);many('skeleton',1,hid,false,null,8)}
  if(ty==='plains'){many('picnic',1,any,false,null,14)}
  /* the King's hand is everywhere */
  for(let k=0;k<2;k++){const t=(k===1&&r()<.6?takeU('wanted',LORE.wanted):takeU('decree',LORE.decrees))||takeU('torn',LORE.torn);if(t)place('noticeboard',road1,true,{text:t},8)||place('noticeboard',any,true,{text:t},8)}
  many('banner',ty==='cave'?1:2,ty==='swamp'?any:road1,true,null,10);many('coldcamp',2,any,false,null,10);if(r()<.6)place('grindstone',road1,true,null,10);
  if((ty==='woods'||ty==='plains')&&r()<.6)place('gallows',road1,true,null,8)||place('gallows',any,true,null,8);
  if(LV.zi===1)place('dovecote',any,true,null,6)||place('dovecote',hid,true,null,4);
  if(AR.i===0&&LV.zi===1)place('toybox',hid,true,null,10);
  many('satchel',1,hid,false,null,8);many('glint',1,any,false,null,8);many('mound',2,any,false,null,6);many('shrine',1,road1,true,null,10);
  if(mapDef().puzzle==='lever'){for(let k=0;k<60;k++){const s=find(any,5);if(!s)break;const ok=[0,2,4].every(dx=>map[id(s.x+dx,s.y)]===G&&!PROPAT[id(s.x+dx,s.y)]&&solidOK(s.x+dx,s.y))&&map[id(s.x+2,s.y+3)]===G&&!PROPAT[id(s.x+2,s.y+3)];if(!ok)continue;
    let pat;do{pat=[r()<.5,r()<.5,r()<.5]}while(!pat.some(Boolean));LV.lever={pat,solved:false,x:s.x+2,y:s.y+3};
    [0,2,4].forEach((dx,i)=>addProp('lever',s.x+dx,s.y,true,{i,up:false}));addProp('hintstone',s.x+2,s.y+3,true,{pat});break}}many('mushring',ty==='cave'?1:2,any,false,null,8);many('spring',ty==='cave'?1:2,any,false,null,8);many('satchel',2,hid,false,null,8);many('glint',3,any,false,null,8);
  if(ty==='woods'||ty==='plains'){many('scare',ty==='plains'?2:1,any,true,null,10);many('well',ty==='plains'?2:1,any,true,null,12);many('fox',2,hid,false,null,10)}
  if(ty==='cave'){many('crystal',14,(x,y)=>treeN(x,y)>=2,true,null,4);many('minecart',5,road1,true,null,8);many('orevein',9,(x,y)=>treeN(x,y)>=3,true,null,6);many('timber',8,(x,y)=>treeN(x,y)>=2,true,null,6)}
  if(ty==='plains'){many('flowers',12,any,false,null,5);many('sheep',8,(x,y)=>!nearType(x,y,[WATER],1),false,()=>({}),5);many('hive',3,hid,true,null,10);many('haystack',5,any,true,null,8)}
  if(ty==='swamp'){many('boat',4,(x,y)=>nearType(x,y,[BOG],1),true,null,8);let fr=0;for(const t of tiles){if(fr>=24)break;const tt=map[id(t.x,t.y)];if(tt!==G&&tt!==MUD)continue;if(!nearType(t.x,t.y,[BOG],1)||PROPAT[id(t.x,t.y)])continue;if(props.some(p=>p.t==='frog'&&Math.hypot(p.tx-t.x,p.ty-t.y)<3))continue;addProp('frog',t.x,t.y,false);fr++}}
  if(ty==='swamp'&&LV.zi===1)place('frogking',(x,y)=>nearType(x,y,[BOG],2),false,null,6);
  const treeSpots=(type,near)=>{const out=[];for(let y=3;y<MH-3;y++)for(let x=3;x<MW-3;x++){if(map[id(x,y)]!==type||PROPAT[id(x,y)]||inPocket(x,y))continue;if(!touchesReach(REACH,x,y))continue;if(near&&!nearType(x,y,[ROAD],1))continue;out.push({x,y})}return out.sort(()=>r()-.5)};
  if(ty==='woods'||ty==='swamp'){treeSpots(DEAD).slice(0,3).forEach(s=>addProp('nest',s.x,s.y,false,{tree:1}));treeSpots(DEAD).filter(s=>!PROPAT[id(s.x,s.y)]).slice(0,3).forEach(s=>addProp('chime',s.x,s.y,false,{tree:1}))}
  if(ty!=='cave')treeSpots(ty==='swamp'?PINE:OAK,true).slice(0,6).forEach(s=>addProp('owl',s.x,s.y,false,{tree:1}));
  mapExtras({r,place,many,any,hid,road1,openish,find,solidOK,ty});
}

/* ---------- chunked ground rendering ---------- */
function getChunk(cx,cy){const k=cx+','+cy;let c=LV.chunks.get(k);if(!c){const g=CPRE_L===LV&&CPRE.get(k);if(g){let r;while(!(r=g.next()).done);c=r.value;CPRE.delete(k)}else c=renderChunk(cx,cy);LV.chunks.set(k,c)}return c}
function renderChunk(cx,cy){const g=chunkGen(cx,cy);let r;while(!(r=g.next()).done);return r.value}
/* chunks are drawn a few rows at a time in the background so walking never stutters */
const CPRE=new Map();let CPRE_L=null;
function prefetchChunks(budget=6){if(!LV||LV.kind==='title')return;if(CPRE_L!==LV){CPRE.clear();CPRE_L=LV}
  const t0=performance.now(),cx0=Math.floor((cam.x-128)/256),cy0=Math.floor((cam.y-128)/256),cx1=Math.floor((cam.x+W+128)/256),cy1=Math.floor((cam.y+H+128)/256);
  for(let cy=cy0;cy<=cy1;cy++)for(let cx=cx0;cx<=cx1;cx++){if(cx<0||cy<0||cx*256>=MW*T||cy*256>=MH*T)continue;const k=cx+','+cy;if(LV.chunks.has(k))continue;
    let g=CPRE.get(k);if(!g){g=chunkGen(cx,cy);CPRE.set(k,g)}
    while(performance.now()-t0<budget){const r=g.next();if(r.done){LV.chunks.set(k,r.value);CPRE.delete(k);break}}if(performance.now()-t0>=budget)return}}
function* chunkGen(cx,cy){
  const ty=LV.type,inside=LV.kind==='interior',S=256,SS=S*HDK,gc=cvs(S,S),gh=cvs(SS,SS),x=gh.getContext('2d'),img=x.createImageData(SS,SS),d=img.data,N=LV.noise||(LV.noise=makeNoise(99+AR.i*7+(LV.zi||0)));
  const grass=(patch,n,k)=>ty==='plains'?[(50+patch*22+n*10)*k,(92+patch*30+n*12)*k,(36+patch*14)*k]:ty==='swamp'?[(18+patch*9+n*3)*k,(24+patch*10+n*4)*k,(12+patch*6)*k]:ty==='cave'?[34+patch*9+n*4,31+patch*8+n*4,29+patch*7+n*3]:[(14+patch*9+n*3)*k,(23+patch*12+n*4)*k,(17+patch*8)*k];
  const wood=LV.mat==='wood';
  for(let ly=0;ly<SS;ly++){if(ly&&ly%32===0)yield;for(let lx2=0;lx2<SS;lx2++){const qx=cx*SS+lx2,qy=cy*SS+ly,px=(qx/HDK)|0,py=(qy/HDK)|0,tx=px>>4,ty2=py>>4;let c;
    if(tx>=MW||ty2>=MH){c=[0,0,0]}else{
    const t=map[ty2*MW+tx],n=hash(qx,qy),patch=N(qx/(40*HDK),qy/(40*HDK)),lx=px&15,lyy=py&15;
    if(inside){
      if(t===FLOOR||t===PROPT||t===CHEST){if(wood){const plank=(py>>2);c=(lyy%4===0)?[30,20,12]:[66+n*10+(hash(plank,px>>5)*14),46+n*8,28+n*5];if((px+(plank%2)*24)%48===0)c=[30,20,12]}
        else{c=(lx===0||lyy===0)?[38,36,33]:[58+patch*10+n*6,56+patch*9+n*5,52+patch*8+n*4]}}
      /* indoor water: clearly bluer and brighter than the floor, with a dark lip where it meets the floor so it reads as a sunken pool */
      else if(t===WATER){const up=map[(ty2-1)*MW+tx]!==WATER,lt=map[ty2*MW+tx-1]!==WATER,rt=map[ty2*MW+tx+1]!==WATER,dn=map[(ty2+1)*MW+tx]!==WATER;
        c=[28+patch*10,70+patch*16,104+patch*18];if(((px*2+py*5)%29)<1)c=[120,170,200];if((up&&lyy<3)||(lt&&lx<2)||(rt&&lx>13))c=[10,18,22];else if(dn&&lyy>13)c=[70,110,130]}
      else if(t===IDOOR){c=lyy<12?[8,6,4]:[66,46,28]}
      else{const below=tAt(tx,ty2+1)!==IWALL&&tAt(tx,ty2+1)!==IDOOR;c=wood?[34+n*6,24+n*5,16+n*3]:[40+n*8,38+n*7,36+n*6];
        if(below&&lyy>=6){c=wood?((lyy%3===0)?[40,28,16]:[90+n*14,64+n*10,40+n*6]):((lyy===6||(lyy-6)%4===0||((lx+(((lyy-6)>>2)%2)*8)%16===0))?[52,50,46]:[88+n*12,84+n*10,78+n*8]);if(lyy===6)c=[20,16,12]}
        if(lyy<2&&tAt(tx,ty2-1)!==IWALL)c=[10,8,6]}}
    else if(t===ROAD||t===FIRE||t===EXIT||t===GATE||t===DOOR){let edge=false;
      if(t===ROAD){const rd=v=>v===ROAD||v===BRIDGE||v===FIRE||v===EXIT||v===BARRIER||v===GATE||v===DOOR||v===BLDG;const L=tAt(tx-1,ty2),R=tAt(tx+1,ty2),U=tAt(tx,ty2-1),D=tAt(tx,ty2+1);
        if((!rd(L)&&lx<3)||(!rd(R)&&lx>12)||(!rd(U)&&lyy<3)||(!rd(D)&&lyy>12))edge=n<.55}
      if(edge||t===FIRE||t===EXIT)c=grass(patch,n,1);
      else if(ty==='plains')c=n>.95?[150,130,96]:[118+patch*14,98+patch*12,68+patch*8];
      else if(ty==='cave')c=n>.95?[70,64,58]:[48+patch*8,42+patch*7,36+patch*6];
      else c=n>.965?[66,58,46]:n>.9?[34,28,21]:[44+patch*10,37+patch*8,27+patch*6];
      if(t===GATE){const dk=.55;c=[c[0]*dk,c[1]*dk,c[2]*dk]}}
    else if(t===BRIDGE){const horiz=[tAt(tx-1,ty2),tAt(tx+1,ty2)].some(v=>v===BRIDGE||v===ROAD);const k=horiz?px:py;c=(k%5===0)?[16,11,7]:ty==='plains'?[110+n*20,80+n*14,50+n*8]:[58+n*14,42+n*10,27+n*6];if((horiz?lyy:lx)<1||(horiz?lyy:lx)>14)c=[20,14,9]}
    else if(t===BOG){c=n>.97?[38,60,46]:[9+patch*6,22+patch*8,19+patch*6];if(((px+py*3)%23)===0)c=[24,44,36]}
    else if(t===MIRE){c=[22+patch*8+n*6,24+patch*8+n*5,12+patch*4];if(((px*5+py*3)%31)<1)c=[70,66,40];if(n>.97)c=[90,80,50]}
    else if(t===DEEP){c=[6+patch*4,12+patch*6,22+patch*8];if(((px*3+py*7)%41)<1)c=[40,60,80]}
    else if(t===WATER){c=ty==='cave'?[10+patch*6,18+patch*8,30+patch*10]:[38+patch*16,90+patch*24,140+patch*26];if(((px*2+py*5)%37)<1)c=ty==='cave'?[40,60,80]:[150,200,230]}
    else if(t===MUD)c=ty==='swamp'?(n>.93?[88,76,48]:[64+patch*12,54+patch*10,32+patch*6]):[26+patch*8,29+patch*8,19+patch*5];
    else if(t===WALL){const below=tAt(tx,ty2+1)!==WALL,above=tAt(tx,ty2-1)!==WALL;c=[20+patch*6+n*6,18+patch*5+n*5,18+patch*5+n*4];
      if(below&&lyy>=11)c=lyy===11?[78,72,66]:[50+n*12,46+n*10,42+n*8];if(above&&lyy<1)c=[8,7,7];if(n>.985)c=[60,56,52]}
    else if(t===BLDG){c=grass(patch,n,.6)}
    else{/* impassable woods read as dense undergrowth, with a ragged edge, so open ground looks like the way through */
      const blocked=isTree(t)||t===ROCKT;let und=blocked;
      if(!blocked&&ty!=='cave'){const bt=v=>isTree(v)||v===ROCKT;const e=(lx<3&&bt(tAt(tx-1,ty2)))||(lx>12&&bt(tAt(tx+1,ty2)))||(lyy<3&&bt(tAt(tx,ty2-1)))||(lyy>12&&bt(tAt(tx,ty2+1)));if(e&&hash(qx>>1,qy>>1)<.55)und=true}
      if(und){const g=grass(patch,n,.42);c=n>.82?grass(patch,n,.68):n<.18?[g[0]*.45,g[1]*.45,g[2]*.45]:g;if(ty==='plains')c=[c[0]*.8,c[1]*.85,c[2]*.7]}
      else{const k=t===STN?.75:1;c=grass(patch,n,k);if(ty!=='cave'&&n>.985)c=[c[0]+18,c[1]+26,c[2]+10]}}}
    const o=(ly*SS+lx2)*4;d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=255}}
  x.putImageData(img,0,0);x._hd=true;x.imageSmoothingEnabled=false;x.scale(HDK,HDK);x.translate(-cx*S,-cy*S);
  const tx0=cx*16-1,ty0=cy*16-1,tx1=cx*16+17,ty1=cy*16+17;
  if(!inside){x.fillStyle=ty==='plains'?'rgba(0,30,0,.25)':'rgba(0,0,0,.38)';
    for(let ty2=Math.max(0,ty0);ty2<Math.min(MH,ty1);ty2++)for(let tx=Math.max(0,tx0);tx<Math.min(MW,tx1);tx++)if(isTree(map[id(tx,ty2)])){x.beginPath();x.ellipse(tx*T+8,ty2*T+14,11,5,0,0,7);x.fill()}}
  for(let by=cy-1;by<=cy+1;by++)for(let bx=cx-1;bx<=cx+1;bx++){const b=LV.dbk.get(bx+','+by);if(!b)continue;for(const o of b){
    if(o.k==='grass'){x.fillStyle=ty==='plains'?'#4a8a32':'#24361f';x.fillRect(o.x,o.y,1,2);x.fillRect(o.x+2,o.y-1,1,3);x.fillStyle=ty==='plains'?'#6aaa44':'#31462a';x.fillRect(o.x+1,o.y,1,2)}
    else if(o.k==='flower'){x.fillStyle='#3a7a2a';x.fillRect(o.x+1,o.y+1,1,2);x.fillStyle=o.c;x.fillRect(o.x,o.y,3,1);x.fillRect(o.x+1,o.y-1,1,3);x.fillStyle='#f8e868';x.fillRect(o.x+1,o.y,1,1)}
    else if(o.k==='fern'){x.fillStyle='#1d3220';x.fillRect(o.x,o.y,5,1);x.fillRect(o.x+1,o.y-1,3,1);x.fillRect(o.x+2,o.y-2,1,1);x.fillStyle='#284428';x.fillRect(o.x+1,o.y,1,1)}
    else if(o.k==='reed'){x.fillStyle='#4a5a28';x.fillRect(o.x,o.y-4,1,5);x.fillRect(o.x+2,o.y-3,1,4);x.fillStyle='#6a4a2a';x.fillRect(o.x,o.y-5,1,2)}
    else if(o.k==='pebble'){x.fillStyle='#4a4642';x.fillRect(o.x,o.y,2,1);x.fillStyle='#2a2826';x.fillRect(o.x,o.y+1,2,1)}
    else if(o.k==='bones'){x.fillStyle='#8a8470';x.fillRect(o.x,o.y,4,1);x.fillRect(o.x+2,o.y+2,3,1);x.fillStyle='#5f5a4c';x.fillRect(o.x,o.y+1,1,1)}
    else if(o.k==='skull'){x.fillStyle='#a49d86';x.fillRect(o.x,o.y,3,2);x.fillRect(o.x+1,o.y+2,1,1);x.fillStyle='#1a1a14';x.fillRect(o.x,o.y+1,1,1);x.fillRect(o.x+2,o.y+1,1,1)}
    else if(o.k==='rug'){x.fillStyle=o.c;x.fillRect(o.x,o.y,o.w,o.h);x.strokeStyle='rgba(200,170,100,.35)';x.strokeRect(o.x+2.5,o.y+2.5,o.w-5,o.h-5)}
    else if(o.k==='window'){x.fillStyle='#050403';x.fillRect(o.x+4,o.y+2,8,9);x.fillStyle='#2a3a4a';x.fillRect(o.x+5,o.y+3,6,7);x.fillStyle='#4a5a6a';x.fillRect(o.x+5,o.y+3,2,3);x.fillStyle='#050403';x.fillRect(o.x+7,o.y+3,1,7);x.fillRect(o.x+5,o.y+6,6,1)}}}
  for(const f of fires){if(f.x<tx0||f.x>tx1||f.y<ty0||f.y>ty1)continue;x.fillStyle='#3a3a36';for(let a=0;a<10;a++){const an=a/10*6.283;x.fillRect(f.x*T+8+Math.cos(an)*9-1|0,f.y*T+10+Math.sin(an)*6-1|0,3,2)}x.fillStyle='#0c0a08';x.beginPath();x.ellipse(f.x*T+8,f.y*T+10,7,4,0,0,7);x.fill()}
  for(const p of props){if(p.tx<tx0||p.tx>tx1||p.ty<ty0||p.ty>ty1)continue;
    if(p.t==='ring')for(let a=0;a<9;a++){const an=a/9*6.283,mx=p.x+Math.cos(an)*12|0,my=p.y+Math.sin(an)*9|0;x.fillStyle='#d8c8a8';x.fillRect(mx,my,3,1);x.fillStyle='#8a3a3a';x.fillRect(mx+1,my,1,1);x.fillStyle='#8a8070';x.fillRect(mx+1,my+1,1,1)}
    if(p.t==='flowers'){const rr=mulberry(p.tx*99+p.ty);for(let k=0;k<26;k++){const fx=p.x-12+rr()*24|0,fy=p.y-9+rr()*18|0;x.fillStyle='#3a7a2a';x.fillRect(fx+1,fy+1,1,2);x.fillStyle=['#e84a4a','#f0d84a','#f4f4f4','#b86ae8','#f08ac8'][(rr()*5)|0];x.fillRect(fx,fy,3,1);x.fillRect(fx+1,fy-1,1,3)}}}
  for(const ex of[LV.pocket&&LV.pocket.exit,LV.back])if(ex&&ex.x>=tx0&&ex.x<=tx1&&ex.y>=ty0&&ex.y<=ty1){const px=ex.x*T,py=ex.y*T;x.fillStyle='#000';x.beginPath();x.ellipse(px+8,py+9,7,6,0,0,7);x.fill();x.fillStyle='#3a3530';for(let a=0;a<12;a++){const an=a/12*6.283;x.fillRect(px+8+Math.cos(an)*8-1|0,py+9+Math.sin(an)*7-1|0,2,2)}}
  gc._hd=gh;gc._nohd=1;return gc}
