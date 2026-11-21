# Each test: (name, description, javascript body run inside an async function in the page, timeout seconds)
# The body can use TH (helpers.js). Return a short string summary; throw or TH.note(...) to fail.
TESTS = []
def test(name, desc, timeout=240):
    def deco(js):
        TESTS.append((name, desc, js, timeout)); return js
    return deco

test('boot', 'Title screen, start a game, HUD and version label are present')("""
  const v=document.querySelector('#ver').textContent.trim();
  if(!/^\\d+\\.\\d+\\.\\d+(\\.\\d+)?$/.test(v))TH.note('version label looks wrong: '+v);
  for(const s of['#hud','#menu4','#btnA','#btnU','#pad'])if(!document.querySelector(s)||!document.querySelector(s).getBoundingClientRect().width)TH.note('missing or hidden: '+s);
  TH.statsOk('start');
  return 'version '+v+', '+AR.def.name+' / '+LV.name;
""")

test('menus', 'Every menu button and tab opens, renders and closes; Stats and Log windows don’t block play')("""
  const btn=o=>document.querySelector(`#menu4 .mb[data-o="${o}"]`);
  const order=[...document.querySelectorAll('#menu4 .mb')].map(b=>b.dataset.o).join(',');
  if(order!=='gear,stats,tal,bag,map,log')TH.note('main button order is '+order);
  const tabs=[...document.querySelectorAll('.tabs b:not(.trt)')].map(b=>b.dataset.t).join(',');
  if(tabs!=='gear,stats,tal,bag,map,log')TH.note('menu tab order is '+tabs);
  const press=el=>{el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));el.dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));el.click()};
  for(const t of['gear','stats','tal','bag','map','log']){
    openPack(t);await TH.until(()=>mode==='pack');renderPack();
    const pane=document.querySelector('#pk-'+t);if(!pane||!pane.classList.contains('on'))TH.note('menu tab did not show: '+t);
    TH.scan('menu tab '+t,pane.innerText);closePack();await TH.until(()=>mode==='world');}
  openStats();if(!statsOn())TH.note('Stats window did not open');
  const x0=P.x;keys.d=true;await new Promise(r=>TH._st(r,600));keys.d=false;
  if(mode!=='world')TH.note('Stats window changed mode to '+mode);
  TH.scan('stats window',document.querySelector('#stwb').innerHTML);
  closeStats();openLog();if(!logOn())TH.note('Log did not open');if(mode!=='world')TH.note('Log changed mode to '+mode);closeLog();
  return 'moved '+Math.round(P.x-x0)+'px with Stats open';
""")

test('maps', 'All 12 maps generate on 8 different world seeds; every fire, gate, prop, chest and spawn can be walked to', 400)("""
  const out=[],seen0={};let checked=0;
  const TN={};for(const k of['G','ROAD','OAK','PINE','DEAD','BOG','MUD','ROCKT','SHR','FIRE','STN','BRIDGE','ENTT','CHEST','PROPT','WATER','WALL','BARRIER','EXIT','GATE','DOOR','FLOOR','IWALL','BLDG','IDOOR','BRAMBLE','CRACK','DEEP','DEADFALL','BOARDS','MIRE','SPOIL','IRONG'])TN[eval(k)]=k;
  const cur=LV;
  for(let seed=0;seed<8;seed++){RUN=100003+seed*7919;AREAS.length=0;
  for(let ai=0;ai<AREA_DEFS.length;ai++)for(let zi=0;zi<NZ;zi++){
    const L=getZone(getArea(ai),zi),W=L.MW,Hh=L.MH,m=L.map;checked++;
    const pzs=new Set(L.props.filter(p=>p.t==='pzseal'||p.t==='pzgate'||p.t==='pzblock').map(p=>p.tx+p.ty*W));
    const open=(x,y)=>{if(x<0||y<0||x>=W||y>=Hh)return false;const t=m[y*W+x];return !BLOCK[t]||t===DOOR||t===IDOOR||t===BARRIER||isGateT(t)||pzs.has(x+y*W)};  // tool-gated tiles and puzzle gates count as passable
    const seen=new Uint8Array(W*Hh),q=[];const s=L.start||L.fires[0];
    if(!s){TH.note(`${L.name}: no start`);continue}
    q.push(s.x+s.y*W);seen[q[0]]=1;
    while(q.length){const i=q.pop(),x=i%W,y=(i/W)|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(open(nx,ny)&&!seen[nx+ny*W]){seen[nx+ny*W]=1;q.push(nx+ny*W)}}}
    const near=(x,y)=>{for(const[dx,dy]of[[0,0],[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx>=0&&ny>=0&&nx<W&&ny<Hh&&seen[nx+ny*W])return true}return false};
    const pic=(x,y)=>{const ch={G:'.',ROAD:'=',OAK:'T',PINE:'T',DEAD:'T',ROCKT:'R',WATER:'~',DEEP:'~',BOG:',',MUD:',',CHEST:'C',PROPT:'P',WALL:'#',IWALL:'#',BLDG:'#',FIRE:'F',BRAMBLE:'%',CRACK:'/'};let r='';for(let dy=-4;dy<=4;dy++){for(let dx=-6;dx<=6;dx++){const nx=x+dx,ny=y+dy;r+=nx<0||ny<0||nx>=W||ny>=Hh?' ':dx===0&&dy===0?'@':(ch[TN[m[ny*W+nx]]]||'?')}r+='\\n'}return r};
    const bad=[];
    L.fires.forEach((f,i)=>{if(!near(f.x,f.y))bad.push(['fire '+i,f.x,f.y])});
    (L.gates||[]).forEach((g,i)=>{if(!near(g.inner.x,g.inner.y))bad.push(['gate '+i,g.inner.x,g.inner.y])});
    (L.props||[]).forEach(p=>{if(!near(p.tx,p.ty))bad.push(['prop '+p.t,p.tx,p.ty])});
    (L.chests||[]).forEach((c,i)=>{if(!near(c.x,c.y))bad.push([c.secret?'secret chest':'chest',c.x,c.y])});
    (L.spawns||[]).forEach(sp=>{const x=Math.floor(sp.x/T),y=Math.floor(sp.y/T);if(!near(x,y))bad.push(['spawn '+sp.kind,x,y])});
    if(L.arena&&!near(L.arena.x,L.arena.y))bad.push(['boss arena',L.arena.x,L.arena.y]);
    if(!L.fires.length)bad.push(['no fires',0,0]);
    if(bad.length)TH.note(`seed ${seed}, ${AREA_DEFS[ai].name} / ${L.name}: can't reach ${bad.map(b=>`${b[0]} at ${b[1]},${b[2]}`).slice(0,5).join('; ')}${bad.length>5?' …':''}\\n${pic(bad[0][1],bad[0][2])}`);
  }}
  return checked+' maps checked';
""")

test('fights', 'Every creature on every map can be fought to the end at that map’s level without errors or softlocks', 900)("""
  TH.autoTap();DEV.god=1;DEV.peace=1;const res=[];
  for(let mi=0;mi<AREA_DEFS.length*NZ;mi++){
    const ai=Math.floor(mi/NZ),zi=mi%NZ;goFire(ai,zi,0);await TH.toWorld();devSetLevel(ELV(mi));
    const kinds=Object.keys(MAPDEF[mi].mobs||{});
    for(const k of kinds){const r=await TH.fight(k,{maxRounds:60});if(!r.won)TH.note(`map ${mi} ${k}: lost in god mode?`);res.push(`${mi}:${k}:${r.rounds}`);TH.statsOk('after '+k)}}
  for(const e of LOGALL){TH.scan('log',e.text);TH.scan('log why',e.why)}
  return res.length+' fights';
""")

test('bosses', 'All four bosses can be fought through every phase, and the way onward opens', 900)("""
  TH.autoTap();DEV.god=1;DEV.peace=1;const out=[];
  const bosses=Object.keys(KINDS).filter(k=>KINDS[k].boss);
  for(let ai=0;ai<bosses.length&&ai<AREA_DEFS.length;ai++){
    goFire(ai,LASTZ,0);await TH.toWorld();devSetLevel(ELV(ai*NZ+LASTZ)+2);for(const sl of['weapon','armor','helm','shield'])P.eq[sl]=genGear(Math.min(3,ai),{slot:sl,exact:3,wt:'sword'});recalc();P.hp=P.max;
    const k=AREA_DEFS[ai].boss||bosses[ai];
    const r=await TH.fight(k,{maxRounds:200,act:b=>{const ad=b.foes.findIndex(f=>!f.dead&&!f.k.boss&&f.hp>0);B.tgt=ad>=0?ad:b.foes.findIndex(f=>!f.dead&&f.hp>0);return b.foes.some(f=>f.st&&f.st.crystal)&&ARTN.crush?'ar:crush':'slash'}});
    out.push(`${k}: ${r.rounds} rounds`);if(r.mode==='dead')TH.note(k+': died in god mode');
    if(mode==='win'){out.push('final victory screen');break}}
  return out.join(', ');
""")

test('death', 'Dying (even with the log open) shows the death screen and getting up works')("""
  TH.autoTap();const g0=P.gold=200,xp0=P.xp=10;
  const r=TH.fight('bear',{act:(b,n)=>{if(n===1)openLog();P.hp=1;return 'guard'},maxRounds:20});
  await TH.until(()=>mode==='dead',60000,'death screen');
  if(getComputedStyle(document.querySelector('#dead')).display==='none')TH.note('death screen not visible');
  closeLog();respawn();await TH.toWorld();
  if(P.hp!==P.max)TH.note('not at full health after getting up');
  if(P.gold>=g0)TH.note('no gold lost on death');
  TH.statsOk('after respawn');
  return `gold ${g0}→${P.gold}, xp ${xp0}→${P.xp}`;
""")

test('actions', 'Every weapon type’s three attacks, every skill, Guard, Study and items work in battle', 600)("""
  TH.autoTap();DEV.god=1;DEV.mana=1;devSetLevel(12);P.pts+=30;
  for(const t in TAL)for(const n of TAL[t].nodes)P.tal[n.id]=n.max;recalc();
  addItem('potion',5);addItem('bandage',5);addItem('bitterleaf',3);
  const out=[];
  for(const wt of Object.keys(ARTS)){
    const g=genGear(1,{slot:'weapon',wt});addItem(g);P.eq.weapon=g;recalc();P.hp=P.max;
    const plan=[...ARTS[wt].map(a=>'ar:'+a.id),...skillList().map(s=>'sk:'+s.id),'guard','look','it:potion','it:bandage','slash'];
    const used=[];
    await TH.fight('band3',{maxRounds:40,act:(b,n)=>{P.mp=P.mmax;P.hp=P.max;if(used.length<plan.length)for(const f of b.foes)if(!f.dead){f.max=Math.max(f.max,5000);f.hp=f.max}let a=plan[used.length]||'slash';used.push(a);
      if(a.startsWith('ar:')&&!canArt(ARTN[a.slice(3)]))a='slash';if(a.startsWith('it:')&&!hasItem(a.slice(3)))a='slash';
      if(used.length>plan.length)for(const f of b.foes)f.hp=1;return a}});
    const skipped=plan.filter((a,i)=>used[i]!==a);if(skipped.length)TH.note(wt+': could not use '+skipped.join(', '));out.push(wt+':'+used.length)}
  for(const e of LOGALL){TH.scan('log',e.text);TH.scan('log why',e.why)}
  return out.join(' ');
""")

test('events', 'Every map event and special prop runs with each choice, without errors or getting stuck', 600)("""
  TH.autoTap();TH.autoDialog();TH.autoFight=1;DEV.god=1;DEV.peace=1;const out=[];
  for(const id in MEV)for(const pk of[0,1,2]){TH.step('event '+id+' choice '+pk);TH.pick=pk;P.gold=200;addItem('bandage');addItem('potion');
    try{await MEV[id]();}catch(e){TH.note('event '+id+' choice '+pk+': '+e.message)}
    try{await TH.toWorld()}catch(e){TH.note('event '+id+' choice '+pk+' left the game in mode '+mode);mode='world'}out.push(id)}
  for(const t in NEWP)if(!t.startsWith('pz'))for(const pk of[0,1,2]){TH.step('prop '+t+' choice '+pk);TH.pick=pk;P.gold=200;addItem('bandage');addItem('bitterleaf');addItem('candlestub');addItem('potion');
    const p={t,tx:5,ty:5,x:88,y:88,st:0};
    try{for(let k=0;k<3;k++){await NEWP[t].use(p);await TH.toWorld()}}catch(e){TH.note('prop '+t+' choice '+pk+': '+e.message);mode='world'}}
  for(const e of EVENTS){TH.step('random event '+EVENTS.indexOf(e));TH.pick=0;try{await e.f();await TH.toWorld()}catch(er){TH.note('random event failed: '+er.message);mode='world'}}
  TH.statsOk('after events');
  return Object.keys(MEV).length+' events, '+Object.keys(NEWP).length+' props, '+EVENTS.length+' random events';
""")

test('loot', 'Loot that doesn’t fit in a full bag is dropped on the ground, not lost')("""
  TH.autoTap();DEV.god=1;DEV.ohk=1;DEV.peace=1;
  while(P.bag.length<BAG_MAX)P.bag.push({id:'rabbit',n:1});
  const piles0=(LV.piles||[]).length,props0=props.length;
  // make every drop roll succeed for this one fight
  const _r=Math.random;Math.random=()=>0.0001;
  try{await TH.fight('wolf')}finally{Math.random=_r}
  await new Promise(r=>TH._st(r,400));
  const grew=props.length>props0||(LV.piles||[]).length>piles0;
  if(!grew)TH.note('full bag: nothing was dropped on the ground');
  P.bag=[];return grew?'loot dropped on the ground':'';
""")

test('levels', 'Levelling up to 30, spending every talent, and equipping every rarity keeps all stats sane')("""
  for(let l=2;l<=30;l++){P.xp=nextXp(P.lv);if(typeof gainXp==='function')gainXp(0);devSetLevel(l)}
  P.pts=200;for(const t in TAL)for(const n of TAL[t].nodes)P.tal[n.id]=n.max;recalc();TH.statsOk('all talents');
  for(let r=1;r<=7;r++)for(let tier=0;tier<4;tier++){for(let i=0;i<4;i++){P.bag=[];devGear(r,tier);const b=P.bag[0];if(!b)continue;const it=ITEMS[b.id];
    TH.scan(`item r${r} t${tier}`,itemTip(b.id));if(it.slot){const s=it.slot==='charm'?'charm':it.slot;P.eq[s]=b.id;recalc();TH.statsOk(`wearing ${it.n}`)}}}
  TH.scan('player tooltip',pTip());TH.scan('stats',JSON.stringify(statSections()));
  return 'level '+P.lv+', attack '+effAtk().toFixed(1)+', health '+P.max;
""")

test('tooltips', 'Every item, status, attack and creature tooltip text is free of undefined/NaN')("""
  let n=0;for(const id in ITEMS){TH.scan('item '+id,itemTip(id));n++}
  for(const k in STATUS){TH.scan('status '+k,STATUS[k].tip);n++}
  for(const w in ARTS)for(const a of ARTS[w]){TH.scan('attack '+a.id,a.tip);n++}
  TH.scan('player tooltip',pTip());TH.scan('head tooltip',pTip(true));
  if(/class='ws'|class='r'/.test(pTip(true)))TH.note('head tooltip still has grey breakdown text');
  return n+' tooltips';
""")

test('save', 'Saving, reloading the page and loading brings back the same game')("""
  devSetLevel(7);P.gold=321;addItem('potion',3);goFire(1,1,0);await TH.toWorld();
  const snap=JSON.stringify({lv:P.lv,gold:P.gold,area:AR.i,zone:LV.zi,bag:P.bag.length,eq:P.eq});
  await saveGame();localStorage.setItem('__snap',snap);
  return 'saved';
""")

test('travel', 'Lighting fires and fast travelling between them works on every map', 400)("""
  TH.autoDialog();DEV.peace=1;let n=0;
  for(let ai=0;ai<AREA_DEFS.length;ai++)for(let zi=0;zi<NZ;zi++){
    goFire(ai,zi,0);await TH.toWorld();const L=LV;
    for(let fi=0;fi<L.fires.length;fi++){TH.step(`travel ${ai}/${zi} fire ${fi}`);goFire(ai,zi,fi);await TH.toWorld();if(LV!==L)TH.note(`travel to fire ${fi} of ${L.name} landed in ${LV.name}`);
      const f=L.fires[fi];if(Math.hypot(P.x-(f.x*T+8),P.y-(f.y*T+8))>4*T)TH.note(`travel to fire ${fi} of ${L.name} landed far from it`);n++}}
  return n+' fires visited';
""")


test('puzzles', 'Every statue, grave and totem puzzle can be solved', 300)("""
  TH.autoTap();TH.autoDialog();TH.autoFight=1;DEV.god=1;DEV.peace=1;const out=[];
  for(let mi=0;mi<MAPDEF.length;mi++){const pz=MAPDEF[mi].puzzle;if(!pz||pz==='lever')continue;
    TH.step('puzzle '+pz+' on map '+mi);goFire(Math.floor(mi/NZ),mi%NZ,0);await TH.toWorld();
    if(!LV.pz){TH.note(`map ${mi} (${LV.name}) should have a ${pz} puzzle but has none`);continue}
    const ps=t=>props.filter(p=>p.t===t);
    if(pz==='statues'){for(const p of ps('pzstatue'))for(let k=0;k<4&&p.f!==LV.pz.want;k++){await NEWP.pzstatue.use(p);await TH.toWorld()}}
    if(pz==='graves'){const g=ps('pzgrave').find(p=>p.right);if(!g)TH.note(`map ${mi}: no grave is the right one`);else{TH.pick=0;await NEWP.pzgrave.use(g);await TH.toWorld()}}
    if(pz==='totems'){await NEWP.pzeye.use(ps('pzeye')[0]);await new Promise(r=>TH._st(r,300));for(const i of LV.pz.seq){const p=ps('pztotem').find(q=>q.i===i);await NEWP.pztotem.use(p);await TH.toWorld()}}
    await new Promise(r=>TH._st(r,300));await TH.toWorld();
    if(!LV.pz.done)TH.note(`map ${mi} (${LV.name}): ${pz} puzzle not solved after doing it right`);else out.push(pz+'@'+mi)}
  return out.join(', ');
""")

test('flee', 'Kill one of a pack, flee: the dead stay dead (same layout), no XP for running, the survivors keep their HP; winning later pays for the whole pack once', 200)("""
  TH.autoTap();TH.autoDialog();DEV.god=1;DEV.peace=0;await TH.toWorld();
  const m=makeMob('imps',P.x+30,P.y);m.n=3;mobs.push(m);LV.mobs=mobs;const xp0=P.xp,lv0=P.lv;
  startBattle(m,'neutral');await TH.until(()=>mode==='battle'&&B&&B.turnDone&&!B.busy,30000,'first turn');
  const b=B;b.foes[0].hp=0;await reap();b.foes[1].hp=Math.max(1,b.foes[1].hp-3);const hp1=b.foes[1].hp;
  const rnd=Math.random;Math.random=()=>0.001;act('flee');await TH.until(()=>mode==='world',30000,'flee to finish');Math.random=rnd;
  if(P.xp!==xp0||P.lv!==lv0)TH.note('got XP for fleeing: '+xp0+' → '+P.xp);
  if(m.n!==2)TH.note('overworld pack should show 2, shows '+m.n);
  if(!m.keep||m.keep.length!==3)TH.note('kept foes should be all 3 (dead one included), got '+(m.keep&&m.keep.length));
  const said=[];const sy=window.say;window.say=(t,...r)=>{said.push(t);return sy(t,...r)};P.inv=0;m.stun=0;m.bored=0;startBattle(m,'neutral');await TH.until(()=>mode==='battle'&&B&&B.turnDone&&!B.busy,30000,'re-encounter');
  if(B.foes.length!==3||!B.foes[0].dead)TH.note('re-encounter should keep the dead one in place: '+B.foes.map(f=>f.name+(f.dead?'(dead)':'')).join(', '));
  if(B.foes[1].hp!==hp1)TH.note('survivor HP not kept: '+hp1+' → '+B.foes[1].hp);
  const rows=[...document.querySelectorAll('#epanel .erow')].filter(r=>getComputedStyle(r).display!=='none').length;if(rows!==2)TH.note('enemy panel should list 2 living, shows '+rows);
  window.say=sy;if(!said.some(t=>/fell|body|bodies|left now|one fewer/.test(t)))TH.note('re-encounter text does not mention the kill: '+said.join(' | '));
  const want=B.foes.reduce((a,f)=>a+xpFor(f),0);for(const f of B.foes)if(!f.dead)f.hp=0;await reap();await checkEnd();await TH.until(()=>mode==='world',30000,'victory');
  const got=(P.lv>lv0?9999:P.xp-xp0);if(got!==9999&&got!==want)TH.note('victory XP should cover all 3 once ('+want+'), got '+got);
  return 'kept 3, xp after win '+got;
""")

test('swing', 'The overworld sword only hits what is in front of you (a half circle), in every direction', 120)("""
  DEV.peace=0;await TH.toWorld();const res=[];
  for(const[face,dx,dy]of[['right',1,0],['left',-1,0],['down',0,1],['up',0,-1]])for(const side of[1,-1]){
    mobs.length=0;LV.mobs=mobs;P.face=face;P.slashCd=0;P.inv=0;const m=makeMob('vagrant',P.x+dx*side*12,P.y+dy*side*14);m.stun=9;mobs.push(m);
    doSlash();await new Promise(r=>TH._st(r,500));const hit=mode!=='world';res.push(face+(side>0?'+':'-')+(hit?'hit':'miss'));
    if(side>0&&!hit)TH.note('facing '+face+', a foe in front was not hit');if(side<0&&hit)TH.note('facing '+face+', a foe BEHIND was hit');
    if(hit){await TH.until(()=>mode==='battle'&&B,20000,'battle');B.over=true;endBattle('fled');await TH.until(()=>mode==='world',20000,'back to world')}}
  mobs.length=0;LV.mobs=mobs;return res.join(' ');
""")

test('scale', 'The view shows the same slice of the world on the short side of every screen (overworld and battle)', 60)("""
  await TH.toWorld();const r=document.querySelector('#view').getBoundingClientRect(),dpr=devicePixelRatio||1,short=Math.min(r.width,r.height)*dpr;
  const vis=short/S;if(Math.abs(vis-VIEW_W)>1)TH.note('overworld short side shows '+vis.toFixed(1)+' game px, want '+VIEW_W);
  if(KK<S&&dpr<2)TH.note('canvas resolution '+KK+' is coarser than the screen scale '+S.toFixed(2));
  return 'S='+S.toFixed(2)+' K='+KK;
""")

test('trade', 'Every map has a camp (lit fire, anvil, stash, Mortimer); buying, selling, gambling, the stash, locking, forgetting and the record all work', 300)("""
  TH.autoTap();TH.autoDialog();DEV.peace=1;const out=[];
  for(let ai=0;ai<4;ai++){const a=getArea(ai);for(let zi=0;zi<3;zi++){const L=getZone(a,zi),st=L.start,f=L.fires.find(f=>f.start);if(!st||!f||!f.lit){TH.note(`map ${ai}.${zi}: no lit camp fire`);continue}
    for(const t of['f_anvil','f_stash','crow'])if(!L.props.some(p=>p.t===t&&Math.hypot(p.tx-st.x,p.ty-st.y)<7))TH.note(`map ${ai}.${zi}: no ${t} at the camp`);
    for(const t of['f_anvil','f_stash']){const p=L.props.find(p=>p.t===t);if(p&&!L.reach[p.ty*L.MW+p.tx+L.MW]&&!L.reach[p.ty*L.MW+p.tx-L.MW]&&!L.reach[p.ty*L.MW+p.tx+1]&&!L.reach[p.ty*L.MW+p.tx-1])TH.note(`map ${ai}.${zi}: ${t} can't be reached`)}}}
  bindLevel(getZone(getArea(0),0));useLevelMobs(LV);
  const crow=props.find(p=>p.t==='crow');P.gold=5000;openTrade('buy',crow);if(mode!=='pack')TH.note('the trade screen did not open');
  const g0=P.gold,b0=P.bag.length;sel={src:'shop',i:TL.findIndex(s=>ITEMS[s.id].slot)};renderPack();$('#tA').click();if(P.gold>=g0||P.bag.length!==b0+1)TH.note('buying gear failed');
  const v0=VISIT;closePack();VISIT++;openTrade('buy',crow);if(crow.vis===v0)TH.note('stock did not change on a new visit');
  const cons=AR.mcons.reduce((a,s)=>a+s.n,0);VISIT++;freshStock(crow);if(AR.mcons.reduce((a,s)=>a+s.n,0)!==cons)TH.note('consumables restocked');
  document.querySelector('#pack .tabs b[data-t=gamble]').click();for(let k=0;k<12;k++){sel={src:'gam',i:k};renderPack();$('#tA').click()}out.push('gambled '+P.rec.gambles);
  const bi=P.bag.length-1,id=P.bag[bi].id;P.bag[bi].lk=1;document.querySelector('#pack .tabs b[data-t=buy]').click();sel={src:'tbag',i:bi};renderPack();if($('#tA')&&!$('#tA').disabled)TH.note('a locked item can be sold');
  P.bag[bi].lk=0;sel={src:'tbag',i:bi};renderPack();const g1=P.gold;$('#tA').click();if(P.gold<=g1)TH.note('selling failed');
  document.querySelector('#pack .tabs b[data-t=stash]').click();const n0=P.bag.length;document.querySelector('#trbar [data-b=storeall]')?.click();if(P.stash.length===0||P.bag.length>=n0)TH.note('storing failed');
  sel={src:'stash',i:0};renderPack();$('#tA').click();closePack();
  P.tal.keen=1;P.attr.str=2;const pts=P.pts,ap=P.apts;openTrade('buy',crow);await forgetDlg();if(P.tal.keen||P.attr.str||P.pts!==pts+1||P.apts!==ap+2)TH.note('forgetting did not refund the points');closePack();
  openPack('stats');if(!document.querySelector('#pk-stats').textContent.includes('Gold spent'))TH.note('no record on the stats screen');closePack();
  TH.statsOk('after trading');return out.join(' ')+', stash '+P.stash.length+', gold spent '+P.rec.spent;
""")

test('puzzles2', 'Block rooms, lantern rings and race gates are built on every map and every one can be solved', 300)("""
TH.autoTap();TH.autoDialog();DEV.god=1;DEV.peace=1;const out=[];let tot={blocks:0,lamps:0,race:0},solved={blocks:0,lamps:0,race:0};
      for(let ai=0;ai<4;ai++)for(let zi=0;zi<3;zi++){const L=getZone(getArea(ai),zi);bindLevel(L);useLevelMobs(L);mode='world';const ks=(L.rooms||[]).map(r=>r.t);out.push(`${ai}.${zi}: ${ks.join(',')}`);
        for(const [ri,R0] of (L.rooms||[]).entries()){tot[R0.t]++;
          if(R0.t==='blocks'&&R0.bl){// BFS solve
            const isIn=(x,y)=>x>R0.x0&&x<R0.x0+R0.W-1&&y>R0.y0&&y<R0.y0+R0.H-1&&(map[id(x,y)]===G||(PROPAT[id(x,y)]&&PROPAT[id(x,y)].t==='pzblock'));
            const ex=R0.x0+5,ey=R0.y0+R0.H-2;const key=(bl,pp)=>bl.map(b=>b.join(',')).sort().join('|')+'#'+pp;
            // normalise player position to min reachable cell
            const reach=(bl,sx,sy)=>{const s=new Set([sx+','+sy]),q=[[sx,sy]];while(q.length){const[a,c]=q.shift();for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=a+dx,ny=c+dy,k=nx+','+ny;if(s.has(k)||!isIn(nx,ny)||bl.some(b=>b[0]===nx&&b[1]===ny))continue;s.add(k);q.push([nx,ny])}}return s};
            const st0=R0.bl.map(b=>[b.tx,b.ty]);const q=[[st0,[ex,ey],[]]],seen=new Set();let sol=null;
            while(q.length&&!sol&&seen.size<60000){const[bl,pp,path]=q.shift();const rs=reach(bl,pp[0],pp[1]);const k=key(bl,[...rs].sort()[0]);if(seen.has(k))continue;seen.add(k);
              if(R0.plates.every(([x,y])=>bl.some(b=>b[0]===x&&b[1]===y))){sol=path;break}
              for(let i=0;i<bl.length;i++)for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const px=bl[i][0]-dx,py=bl[i][1]-dy,nx=bl[i][0]+dx,ny=bl[i][1]+dy;if(!rs.has(px+','+py))continue;if(!isIn(nx,ny)||bl.some(b=>b[0]===nx&&b[1]===ny))continue;const nb=bl.map(b=>b.slice());nb[i]=[nx,ny];q.push([nb,[bl[i][0],bl[i][1]],path.concat([[i,dx,dy]])])}}
            if(!sol){TH.note('unsolvable block room');continue}mobs.length=0;
            // execute
            for(const[i,dx,dy]of sol){const bl=R0.bl[i];P.x=dx?(dx>0?bl.tx*T-4:(bl.tx+1)*T+4):bl.tx*T+8;P.y=dy?(dy>0?bl.ty*T:(bl.ty+1)*T+4):bl.ty*T+12;pushT=0;pushDir=null;for(let k=0;k<4;k++)pzPush(dx,dy,.15)}
            await new Promise(r=>TH._st(r,600));if(R0.done&&!props.some(p=>p.t==='pzseal'&&p.room===ri))solved.blocks++;else out.push('  block room: solution of '+sol.length+' pushes did not open it');out.push('  blocks: '+sol.length+' pushes')}
          if(R0.t==='lamps'){const lamps=props.filter(p=>p.t==='pzlamp'&&p.room===ri);for(let m=0;m<32&&!R0.done;m++){const on0=R0.on.slice();const pr=[0,1,2,3,4].filter(i=>m>>i&1);for(const i of pr)await NEWP.pzlamp.use(lamps.find(l=>l.i===i));if(R0.done)break;R0.on=on0}if(R0.done)solved.lamps++;else out.push('  lamps unsolved')}
          if(R0.t==='race'){P.x=R0.px*T+8;P.y=R0.py*T+12;pzUpdate(.016,0,0);const op=R0.open>0;P.x=R0.cx*T+8;P.y=R0.cy*T+12;pzUpdate(.016,0,0);if(op&&R0.done)solved.race++;else out.push('  race failed open='+op+' dur='+R0.dur)}}}
      for(const k in tot)if(solved[k]<tot[k])TH.note(k+': solved '+solved[k]+' of '+tot[k]);return 'built '+JSON.stringify(tot)
""")
