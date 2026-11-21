
/* ================= BATTLE ================= */
let B=null;
/* walk into something without striking it first, and 1 time in 10 it gets the first blow */
function startBattle(m,first){if(mode!=='world')return;if(first==='contact'&&Math.random()<.5)first='caught';mode='trans';$('#banner').classList.remove('on');P.slashT=0;P.roll=0;padV={x:0,y:0};hideTip();
  SFX.sting();AU.setAmb(.35);transition(()=>{scene='battle';battleBegin(m,first)})}
function transition(fn){TR={t:0,dur:1.05,fn,fired:false}}
function drawTrans(){if(!TR)return;const t=TR.t;
  if(t<.3){if(Math.floor(t*20)%2){ctx.fillStyle='rgba(220,210,190,.55)';ctx.fillRect(0,0,W,H)}}
  else{const p=t<.55?(t-.3)/.25:1-(t-.55)/.5,n=12,h=Math.ceil(H/n);ctx.fillStyle='#000';for(let i=0;i<n;i++){const w=W*clamp(p,0,1);if(i%2)ctx.fillRect(0,i*h,w,h);else ctx.fillRect(W-w,i*h,w,h)}}}
function setUI(m){const b=m==='battle';$('#app').classList.toggle('battle',b);
  $('#ow').style.display=b?'none':'';$('#bui').style.display=b?'flex':'none';$('#epanel').style.display=$('#ppanel').style.display=b?'block':'none';$('#hud').style.display='flex';$('#hudL').style.visibility=b?'hidden':'';$('#app').classList.toggle('inb',b);resize()}
/* members of a pack aren't clones: each position has its own name and a real twist (UNIT_ROLES) */
const UNIT_ROLES={
  wolf:[{n:'Gaunt Wolf',hm:.8,am:.95,ini:2,dodge:.1,d:'Lean and quick: acts sooner and is harder to hit, but frail.'},{n:'Wolf',d:'An ordinary wolf.'},{n:'Scarred Wolf',hm:1.3,am:1.1,ini:-1,def:1,d:'An old fighter: tougher and hits harder, but slower.'}],
  greywolf:[{n:'Timber Wolf',d:'A big timber wolf. The rest of the pack follows it.'},{n:'Timber Bitch',hm:.9,am:1.1,ini:2,d:'Fast and vicious: acts sooner and bites harder, but has less health.'},{n:'Old Timber',hm:1.35,am:1.15,ini:-2,def:1,d:'The pack leader: much tougher and stronger, but slow.'}],
  imp:[{n:'Imp',d:'An ordinary imp.'},{n:'Sneak Imp',hm:.85,dodge:.15,ini:1,d:'Slippery: much harder to hit, but frail.'},{n:'Fat Imp',hm:1.4,am:.9,ini:-2,d:'Well fed: lots of health, slow, a weaker bite.'},{n:'Imp in a Hat',hm:1.1,am:1.25,d:'The leader. It hits harder than the others.'}],
  slime:[{n:'Marsh Slime',d:'An ordinary slime.'},{n:'Bog Slime',hm:1.3,def:1,ini:-1,d:'Thick: tougher and better armoured, but slow.'},{n:'Mire Slime',am:1.2,d:'Acidic: hits harder.'},{n:'Little Slime',hm:.5,am:.7,ini:2,d:'Small and quick. It acts early but goes down fast.'}],
  brigand:[{n:'Brigand',d:'An ordinary brigand.'},{n:'Cutthroat',hm:.85,am:1.2,ini:2,d:'A knife-man: fast and hits hard, but lightly built.'},{n:'Brigand Captain',hm:1.3,am:1.15,def:1,d:'The leader: tougher, better armoured and stronger.'}],
  hound:[{n:'War Hound',d:'A trained war dog.'},{n:'War Bitch',hm:.9,am:1.1,ini:2,d:'Faster and bites harder, but has less health.'}]};
/* every distinct kind of foe has its own key (f.ek): base kinds, variants, and each pack role that changes stats. Study and the Bestiary go by it */
const roleOrd=R=>!(R.hm||R.am||R.ini||R.def||R.dodge);
function applyRole(f,kind,i,n){const R=n>1&&UNIT_ROLES[kind]&&UNIT_ROLES[kind][i];f.ek=f.vk||f.kind;if(!R)return f;if(roleOrd(R)){f.name=KINDS[kind].name;f.role=R.d;return f}f.ri=i;f.ek+='#'+i;f.name=R.n;f.hp=f.max=Math.max(1,Math.round(f.max*(R.hm||1)));f.atk=Math.round(f.atk*(R.am||1)*10)/10;
  f.ini+=R.ini||0;f.def=Math.max(0,f.def+(R.def||0));f.roleDodge=R.dodge||0;f.role=R.d;f.xpm=(f.xpm||1)*((R.hm||1)+(R.am||1))/2;return f}
function makeFoe(kind,i,n,unit){if(KINDS[kind].base){const V=KINDS[kind],f=makeFoe(V.base,i,1,unit);f.vk=kind;f.name=V.name;f.hp=f.max=Math.round(f.max*V.hm);f.atk=Math.round(f.atk*V.am*10)/10;f.xpm=V.xpm||1;return applyRole(f,kind,i,n)}
  const k=KINDS[kind],bm=EV.blood>0?1.2:1,sc=k.boss?BOSS_SCALE[AR.i]:MAP_SCALE[curMap()],hm=k.boss?1.35:unit?1.35*unit:1.75,am=k.boss?1.15:unit?1.1*unit:1.3,hp=Math.round(k.hp*sc*hm*DIFF.h);
  return applyRole({kind,k,unit,name:(n>1&&UNIT_NAMES[kind]&&UNIT_NAMES[kind][i])||k.name,hp,max:hp,ini:(k.ini??3)+(EV.blood>0?1:0),atk:Math.round(k.atk*sc*am*bm*DIFF.a*10)/10,def:k.def,st:{},turn:0,mended:0,shake:0,flash:0,lunge:0,die:0,dead:false,box:null},kind,i,n)}
const alive=()=>B.foes.filter(f=>!f.dead&&f.hp>0);
function tgt(){let f=B.foes[B.tgt];if(!f||f.dead||f.hp<=0){const a=alive();if(a.length){B.tgt=B.foes.indexOf(a[0]);f=a[0]}}return f}
function ordOf(w){return'';if(!B||!B.order)return'';const i=B.order.findIndex(o=>w==='p'?o.p:o.f===w);if(i<0||B.order[i].done)return'';return'acts '+ORD[i]}
function updBUI(){if(!B)return;
  const many=B.foes.length>1;
  const EH=B.foes.map((f,i)=>{const ic=iconRow(Object.keys(f.st).filter(k=>f.st[k]>0&&STATUS[k]).map(k=>k==='shred'?iconHTML(k,0,`<span class='r'>${f.st[k]} of 5 stacks</span>`):k==='crystal'?iconHTML(k,0,`<span class='r'>${f.st[k]} plates</span>`):iconHTML(k,k==='coiled'||k==='stag'||f.st[k]>50?0:f.st[k])));
    return`<div data-tip="${esc(foeTip(f))}" class="erow${many&&i===B.tgt&&!f.dead?' tg':''}${f.dead?' dead':''}" data-i="${i}">${many?`<div class="nm"><b>${i===B.tgt&&!f.dead?'▸ ':''}${f.name}</b><div class="icons">${ic}</div><span>Lvl ${f.lv}</span></div><div class="cl"><div class="bar"><i style="width:${clamp(f.hp/f.max,0,1)*100}%"></i></div><div class="num">${f.dead?0:Math.max(0,Math.ceil(f.hp))}/${f.max}</div></div>`:`<div class="nm"><b>${f.name}</b><span>Lvl ${f.lv}</span></div><div class="bar"><i style="width:${clamp(f.hp/f.max,0,1)*100}%"></i></div><div class="ft"><div class="icons">${ic}</div><div class="num">HP ${f.dead?0:Math.max(0,Math.ceil(f.hp))}/${f.max}</div></div>`}</div>`}).join('');
  /* only rebuild the enemy panel when something in it changed, so a tap on a foe's row isn't lost to a rebuild */
  {const ep=$('#epanel');if(ep._h!==EH){ep._h=EH;ep.innerHTML=EH}}
  $('#epanel').classList.toggle('many',B.foes.length>1);
  $('#epanel').querySelectorAll('.erow').forEach(el=>el.onclick=e=>{if(e.target.classList.contains('si'))return;const i=+el.dataset.i;if(!B.foes[i].dead){B.tgt=i;updBUI()}});
  $('#plv').textContent='Lvl '+P.lv+(ordOf('p')?' · '+ordOf('p'):'');$('#php').style.width=(clamp(P.hp/P.max,0,1)*100)+'%';$('#phpn').textContent=`${Math.max(0,P.hp)}/${P.max}`;
  $('#pmp').style.width=(P.mp/P.mmax*100)+'%';$('#pmpn').textContent=`${P.mp}/${P.mmax}`;
  const PI=[];for(const k of['poison','bleed','burn','dazed','blind','rooted','wither'])if(P.st[k])PI.push(iconHTML(k,P.st[k]));let pi='';
  if(P.guard)pi+=iconHTML('guard');if(B.riposte)pi+=iconHTML('riposte');if(P.blessed)pi+=iconHTML('blessed',0,`<span class='r'>${P.blessed} fight${P.blessed>1?'s':''} left</span>`);if(EV.blood>0)pi+=iconHTML('bloodmoon');
  const pb=B.pb||{};if(B.charge)pi+=iconHTML('windup');if(pb.ward==='evade')pi+=iconHTML('evade');if(pb.ward==='riposte'||pb.dgU>=B.rnd)pi+=iconHTML('ward');if(pb.brace)pi+=iconHTML('brace');if(pb.fort)pi+=iconHTML('fort',pb.fort);if(pb.unsh)pi+=iconHTML('unsh',pb.unsh);if(pb.kind)pi+=iconHTML('kind');if(pb.whet)pi+=iconHTML('whet');
  $('#picons').innerHTML=iconRow(PI.concat(pi.match(/<img[^>]*>/g)||[]));for(const f of B.foes)if(!f.dead)noteSeen(f);$('#pxp').style.width=clamp(P.xp/nextXp(P.lv),0,1)*100+'%';$('#pxpn').textContent=`${P.xp}/${nextXp(P.lv)}`;statusDiff()}
/* log every buff and debuff as it lands or wears off, so Resolve order shows them in sequence */
function pStatKeys(){const s=[],pb=B.pb||{};for(const k of PDEB)if(P.st[k])s.push(k);if(P.guard)s.push('guard');if(B.riposte)s.push('riposte');if(B.charge)s.push('windup');if(pb.ward==='evade')s.push('evade');if(pb.ward==='riposte'||pb.dgU>=B.rnd)s.push('ward');for(const k of['brace','fort','unsh','kind','whet'])if(pb[k])s.push(k);return s}
function statusDiff(){if(!B||B.over)return;const cur={p:pStatKeys()};B.foes.forEach((f,i)=>{if(!f.dead&&f.hp>0)cur[i]=Object.keys(f.st).filter(k=>f.st[k]>0&&STATUS[k])});
  const prev=B._sd;B._sd=cur;if(!prev)return;const recent=LOGALL.slice(-3).map(e=>e.text).join(' ');
  for(const w in cur){if(!prev[w])continue;const f=w==='p'?null:B.foes[+w],who=f?f.name:'You',cat=f?'out':'in';
    for(const k of cur[w]){const n=STATUS[k].n;if(!prev[w].includes(k)&&!recent.includes(`is ${n}`)&&!recent.includes(`are ${n}`))clog(STATUS[k].bad?(f?`${who} is ${n}`:`You are ${n}`):(f?`${who} gains ${n}`:`You gain ${n}`),STATUS[k].tip,STATUS[k].bad?'#e0a07a':'#9fc0d8','',cat)}
    for(const k of prev[w])if(!cur[w].includes(k))clog(f?`${who} is no longer ${STATUS[k].n}`:`${STATUS[k].n} wears off`,'','#8a8670','',cat)}}
let msgSkip=null,typing=false,skipType=false;
function msgTap(){if(typing)skipType=true;else if(msgSkip)msgSkip()}
let sayId=0;
async function say(t,hold=900,imp){const el=$('#msg'),me=++sayId;el.classList.remove('more','hold');typing=true;skipType=false;
  for(let i=1;i<=t.length;i++){if(me!==sayId)return;if(skipType){el.textContent=t;break}el.textContent=t.slice(0,i);if(i%2===0)await sleep(15)}
  if(me!==sayId)return;typing=false;let fn;
  if(imp==='auto'){el.classList.add('more');await new Promise(r=>{const to=setTimeout(r,Math.max(hold,450));fn=msgSkip=()=>{clearTimeout(to);r()}})}
  else{el.classList.add('hold');await new Promise(r=>{fn=msgSkip=r})}
  if(msgSkip===fn)msgSkip=null;if(me===sayId)el.classList.remove('more','hold')}
function setActs(on){document.querySelectorAll('#acts button').forEach(b=>b.disabled=!on&&b.dataset.a!=='stats')}
const NM=(f,t)=>t.replace(/@/g,f.name);
async function battleBegin(m,first){
  const k=KINDS[m.kind],units=k.pack?k.units.slice(0,1).concat(Array((m.n||k.units.length)-1).fill(k.units[0])):[m.vk||m.kind];
  const back=m.keep&&m.keep.length?m.keep:null;delete m.keep;
  if(back)for(const f of back){f.shake=f.flash=f.lunge=0;f.st={};if(f.dead)f.die=9;else f.die=0}
  B={m,back:!!back,foes:back||units.map((u,i)=>m.hunter?hunterFoe(makeFoe(u,i,units.length,0),m):makeFoe(u,i,units.length,k.pack?(k.us||1):0)),tgt:0,busy:true,tu:{},fx:[],nums:[],pShake:0,pFlash:0,pLunge:0,eIn:1,stolen:0,riposte:false,last:0,bastion:hasT('bastion'),accept:hasT('accept'),pb:{},charge:null};if(!back)B.foes.forEach(foeProfile);if(tr('devotion'))P.mp=Math.min(P.mmax,P.mp+tr('devotion'));
  clog(`${KINDS[m.kind].name}${m.boss?'':''} · ${LV.name||AR.def.name}`,'','','lf');
  /* the World log notes every encounter and who, if anyone, got the first hit in */
  {const lv=B.foes.filter(f=>!f.dead),nm=back&&lv.length===1?lv[0].name:KINDS[m.kind].name,fs=first==='player'?'you struck first':first==='ambush'?'it ambushed you and struck first':first==='caught'?'it caught you off guard and struck first':'no one struck first';
   clog(`Encountered ${nm}${back?' again':''}: ${fs}.`,back?B.foes.map(f=>f.dead?`${f.name}\tkilled earlier`:`${f.name}\t${f.hp}/${f.max} HP`).join('\n'):'','#a8a08a','','world')}BG=null;resize();mode='battle';P.guard=false;setUI('battle');hideSub();setActs(false);updBUI();$('#msg').textContent='';
  MUS.start(!!k.boss);await sleep(450);
  const killed=B.foes.filter(f=>f.dead),liveB=B.foes.filter(f=>!f.dead);
  if(back&&killed.length){const one=liveB.length===1,nm=one?liveB[0].name:'survivors',dn=killed.length===1?killed[0].name:'the others';
    await say(one?pick([`The ${nm} comes back alone. It stops where the ${dn} fell, then looks at you.`,`The ${nm} has been standing over the ${dn}'s body.`,`Only the ${nm} is left now.`]):pick([`The ${nm} close ranks over the ${dn==='the others'?'bodies':dn+'\'s body'}.`,`They come at you again, one fewer this time.`]),1100,true)}
  else if(back){const hurt=liveB.some(f=>f.hp<f.max),one=liveB.length===1;await say(one?(hurt?pick([`The ${liveB[0].name} is back, still bleeding from last time.`,`It's the same ${liveB[0].name}. It still carries the wounds you gave it.`]):`The ${liveB[0].name} again.`):pick([`They come at you again.`,`The same pack as before.`]),1100,true)}
  else if(m.hunter&&!m.met){m.met=1;await say((HUNTERS[AR.i]||HUNTERS[0]).intro,1400,true)}
  else if(m.hunter)await say(`${(HUNTERS[AR.i]||HUNTERS[0]).name} again.`,1100,true);
  else await say(pick(INTRO[m.kind]||['Something attacks.']),1100,true);
  /* ents have you before the fight starts: roots up around your legs the moment combat begins */
  if(B.foes.some(f=>f.kind==='ent')){P.st.rooted=Math.max(P.st.rooted||0,3);SFX.creak();clog('You are Rooted','The ent\'s roots grab you as soon as the fight starts. You can\'t flee while Rooted.','#e0a07a','','in');updBUI();await say('Roots burst up around your legs before you can move. You are Rooted.',900)}
  if(first==='player'){B.fs=1;await say('You strike first.',500,'auto');await pSlash(true);B.fs=0;await reap();if(await checkEnd())return}
  else if(first==='ambush'||first==='caught'){await say(first==='caught'?'It\'s on you before you\'re ready.':'It has you before you can draw.',700);clog(first==='caught'?'Caught off guard: it strikes first':'Ambushed: it strikes first',first==='caught'?'Walk into a foe without striking it first, and half the time it gets the first blow.':'Some of them wait for you to come close.','#e0a07a','','ord');B.fs=1;await foesTurn();B.fs=0;if(await checkEnd())return}
  runRounds()}
const ORD=['1st','2nd','3rd','4th','5th'];
/* each round: everyone's speed gets a luck roll of 1-8, bell-shaped so 4 and 5 are most common (1d4+1d5-1). Highest acts first, ties go to you */
const spdRoll=()=>ri(1,4)+ri(1,5)-1;
async function runRounds(){const b=B;
  while(b&&!b.over){
    b.order=null;let a;if(b.charge){roundReset();a='rel:'+b.charge;setActs(false);updBUI();await say('You bring it down...',500,'auto')}else a=await new Promise(r=>{b.turnDone=r;prompt()});setActs(false);if(b.over)return;a=a||'guard';  /* never let a missing action freeze the fight */
    const pr0=actPri(a),pd=spdRoll(),ord=[{p:1,base:P.ini,roll:pd,pri:pr0,r:P.ini+pd+pr0}].concat(alive().map(f=>{const dd=spdRoll(),sl=f.st.slow?3:0;return{f,base:f.ini-sl,slow:sl,roll:dd,pri:0,r:f.ini-sl+dd}})).sort((x,y)=>y.r-x.r);
    b.order=ord;updBUI();{const sub=o=>{const bits=[`Speed ${o.p?P.ini:o.base}`,`luck +${o.roll}`];if(!o.p){if(EV.blood>0)bits.push('Blood Moon +1');if(o.slow)bits.push('Slowed −3')}if(o.pri>0)bits.push('Guard, items, fleeing and quick attacks always go first');if(o.pri<0)bits.push('this attack always goes last');return'  '+bits.join(' · ')};
      clog(ord.map(o=>o.p?'You':o.f.name).join('  →  '),`Round ${b.rnd||1}: who goes first\nEach round everyone's Speed gets a little luck added. Highest goes first, and you win ties.\n\n`+ord.map((o,i)=>`${ORD[i]||(i+1)+'th'}  ${o.p?'You':o.f.name}\t${o.pri?(o.pri>0?'first':'last'):o.r}\n${sub(o)}`).join('\n'),'#c9a24b','','ord')}
    for(const o of ord){if(b.over)return;
      if(o.p){if(P.hp<=0)continue;b.busy=true;await execAct(a)}
      else{if(o.f.dead||o.f.hp<=0)continue;b.busy=true;B.src='';await sleep(220);await foeAct(o.f);await reap()}
      o.done=1;if(b.over)return;if(await checkEnd())return;updBUI()}
    await tick();if(await checkEnd())return}}
function roundReset(){P.guard=false;B.rnd=(B.rnd||0)+1;if(B.pb){if(!(B.pb.wardR>=B.rnd))delete B.pb.ward;delete B.pb.brace;delete B.pb.keep}}
function prompt(){hideSub();roundReset();$('#acts [data-a=attack]').innerHTML=`Attack<small>${WT_NAME[wType()]}</small>`;updBUI();B.busy=false;setActs(true);$('#msg').classList.remove('more');$('#msg').textContent=B.foes.length>1&&alive().length>1?'What will you do? (Tap a foe to target it.)':'What will you do?'}
function smiteCost(){return Math.max(1,(hasT('martyr')&&P.hp<P.max*.3?2:3)-(P.smitec||0))}
function skillList(){const l=[{id:'smite',n:'Smite',mp:smiteCost(),tip:'Holy fire from above. Ignores armor entirely. Wood burns especially well. Leaves you Whetted: your next strike is 40% stronger.'+(hasT('consec')?' Leaves the foe burning.':'')+(hasT('absolve')?' Heals you for 25% of the damage.':'')}];
  if(hasT('twin'))l.push({id:'twin',n:'Twin Cut',mp:3,tip:'Two quick cuts at 55% power each.'});
  if(hasT('whirl'))l.push({id:'whirl',n:'Whirlwind',mp:4,tip:'Strike every foe at 55% power.'});
  if(hasT('bash'))l.push({id:'bash',n:'Shield Bash',mp:3,tip:'A light blow. 25% chance to stagger the foe, costing it its next turn (10% against the strongest).'});
  if(hasT('mend'))l.push({id:'mend',n:'Mend',mp:6,once:2,tip:'Restore 30% of your health. Twice per fight.'});return l}
const skUsable=s=>P.mp>=s.mp&&!(s.once&&B&&B.onceU&&(B.onceU[s.id]||0)>=s.once);
/* the three lists share one tab bar, sitting along the bottom of the text box: Attacks | Skills | Items, and ✕ back to the main buttons */
function showSub(kind){const el=$('#sub');$('#bui').classList.add('insub');$('#subt').innerHTML=[['attack','Attacks'],['skills','Skills'],['items','Items']].map(([k,n])=>`<b class="stab${k===kind?' on':''}" data-k="${k}">${n}</b>`).join('')+'<b class="subx">✕</b>';let h='';
  if(kind==='attack'){h+=`<button data-a="slash" data-tip="${esc(`<b>Slash</b><span class='r'>100% · accuracy ${Math.round(pAcc()*100)}%</span><span class='fx'>A plain, full-strength blow. Its armour is subtracted from the damage. Now and then a gold ring closes on the foe: tap as it closes for a precise strike (+40%), or exactly as it closes for a perfect one (double damage). Neither can be dodged, parried or blocked.</span>`)}">Slash<small>100%</small></button>`;for(const a of ARTS[wType()])h+=`<button data-a="ar:${a.id}" ${canArt(a)?'':'disabled'} data-tip="${esc(`<b>${a.n}</b><span class='r'>${artSmall(a)}</span><span class='fx'>${a.tip}</span><span class='fx' style='color:#a8a08a'>Accuracy ${Math.round(pAcc(ACCM[a.id]||0)*100)}%${['measured','overhead'].includes(a.id)?' (cannot miss)':''}</span>`)}">${a.n}<small>${artSmall(a)}</small></button>`}
  else if(kind==='skills'){h+=`<button data-a="guard" data-tip="<b>Guard</b><span class='fx'>Raise your shield: take far less damage until your next turn and recover 2 MP. When a red ring closes on you, tap as it closes to parry (half damage), or exactly as it closes to take no damage at all. Poisons and the like still land.</span>">Guard<small>first</small></button>`;for(const s of skillList())h+=`<button data-a="sk:${s.id}" ${!skUsable(s)?'disabled':''} data-tip="${esc(`<b>${s.n}</b><span class='r'>${s.mp} MP</span><span class='fx'>${s.tip}</span>`)}">${s.n}<small>${s.once&&B.onceU&&B.onceU[s.id]?'used':s.mp+' MP'}</small></button>`}
  else{for(const k in P.tools){h+=`<button data-a="tl:${k}" ${(B.tu[k]||0)>=((1+(P.tool2||0)))?'disabled':''} data-tip="${esc(itemTip('t_'+k))}">${TOOLS[k].n}<small>tool</small></button>`}
    const its=P.bag.filter(b=>ITEMS[b.id].use);for(const b of its)h+=`<button data-a="it:${b.id}" data-tip="${esc(itemTip(b.id))}">${ITEMS[b.id].n}<small>×${b.n}</small></button>`;if(!its.length&&!Object.keys(P.tools).length)h+='<div class="empty">Nothing in your bag will help here.</div>'}
  el.innerHTML=h;el.scrollTop=0;$('#subt').querySelectorAll('.stab').forEach(t=>t.addEventListener('click',()=>act(t.dataset.k)));$('#subt .subx').addEventListener('click',()=>act('back'));el.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>act(b.dataset.a)));
  $('#acts').style.display='none';el.style.display='grid';placeTabs()}
function placeTabs(){const t=$('#subt'),m=$('#msg');if(!t||!m)return;t.style.top=(m.offsetTop+m.offsetHeight-38)+'px';t.style.left=(m.offsetLeft+7)+'px';t.style.width=(m.offsetWidth-14)+'px'}
function hideSub(){$('#sub').style.display='none';$('#acts').style.display='grid';$('#bui').classList.remove('insub')}
/* pick an action (Pokemon-style): nothing happens until the round resolves */
async function act(a){if(a==='stats'){if(B)statsOn()?closeStats():openStats();return}if(!B||B.busy||!B.turnDone)return;
  if(a==='skills'||a==='items'||a==='attack')return showSub(a);if(a==='back')return hideSub();
  if(a==='flee'&&B.m.boss){B.busy=true;setActs(false);hideSub();await say("There's no running from this.",900);return prompt()}
  if(a.startsWith('sk:')){const sk=skillList().find(x=>x.id===a.slice(3));if(!sk||!skUsable(sk))return}
  if(a.startsWith('tl:')){const k=a.slice(3);if(!P.tools[k]||(B.tu[k]||0)>=(1+(P.tool2||0)))return}
  if(a.startsWith('it:')&&!hasItem(a.slice(3)))return;
  if(a.startsWith('ar:')){const r=ARTN[a.slice(3)];if(!r||!canArt(r))return}
  B.busy=true;setActs(false);hideSub();const r=B.turnDone;B.turnDone=null;r(a)}
/* carry out the chosen action when its turn comes up */
async function execAct(a){B.src=a==='slash'?'Slash':a.startsWith('ar:')?ARTN[a.slice(3)].n:a.startsWith('rel:')?ARTN[a.slice(4)].n:a.startsWith('sk:')?((skillList().find(s=>'sk:'+s.id===a)||{}).n||'Skill'):a.startsWith('it:')?ITEMS[a.slice(3)].n:a.startsWith('tl:')?((TOOLS[a.slice(3)]||{}).n||'Tool'):a==='guard'?'Guard':a==='look'?'Study':'';
  if(a==='slash')await pSlash();
  else if(a==='look')await study();
  else if(a.startsWith('ar:')){const r=ARTN[a.slice(3)],c=r.c;if(P.mp<(c.mp||0)){await say('You reach for the power, but there isn\'t enough left in you.');return}
    P.mp-=c.mp||0;if(c.hp){const d=Math.round(P.max*c.hp);P.hp-=d;rec('taken',d);addNum('p',d,'#d83a3a')}updBUI();await doArt(r.id)}
  else if(a.startsWith('rel:'))await releaseArt(a.slice(4));
  else if(a==='guard'){P.guard=true;B.riposte=hasT('riposte');P.mp=Math.min(P.mmax,P.mp+2+2*tr('stalwart'));SFX.guard();
    if(hasT('unbroken')){for(const d of['poison','dazed','blind','rooted','wither','bleed','slow'])delete P.st[d]}
    updBUI();await say('You raise your shield.',600,'auto')}
  else if(a==='flee'){if(P.st.rooted)await say('Roots hold your legs fast.',800);
    else{const slow=alive().every(f=>['golem','slime','shroom'].includes(f.kind)),ch=(slow?.85:alive().some(f=>f.k.human)?.45:.6)+P.flee;
      if(chance(ch)){SFX.miss();await say(pick(['You break away.','You run. It doesn\'t follow.']),700);
        const dead=B.foes.filter(f=>f.dead),live=alive();
        /* no XP for kills when you run: everything (XP, gold, loot) for the whole group is paid once, when you finally win */
        if(dead.length&&live.length){
          await say(live.length===1?`${dead.length>1?'Its pack lies dead behind you':'One of them lies dead behind you'}. The ${live[0].name} stays with the body${live[0].hp<live[0].max?', licking its wounds':''}.`:`You leave ${dead.length===1?'one of them':dead.length+' of them'} dead. The rest stand back and let you go.`,1000,true);
          clog(`Fled. Killed ${dead.map(f=>f.name).join(', ')}; ${live.map(f=>f.name).join(', ')} still there.`,'','#a8a08a','','world')}
        else clog(`Fled from ${KINDS[B.m.kind].name}.`,live.some(f=>f.hp<f.max)?live.map(f=>`${f.name}\t${f.hp}/${f.max} HP`).join('\n'):'','#a8a08a','','world');
        B.m.keep=live.length?B.foes:null;if(KINDS[B.m.kind].pack)B.m.n=live.length;
        endBattle('fled');return}
      await say("You can't get away.",700)}}
  else if(a.startsWith('sk:')){const sk=skillList().find(x=>x.id===a.slice(3));if(!sk||P.mp<sk.mp){await say('You reach for the power, but there isn\'t enough left in you.');return}if(sk.once){if(B.onceU&&(B.onceU[sk.id]||0)>=sk.once){await say(sk.once>1?'You have done that as often as you can this fight.':'You have already done that this fight.');return}B.onceU=B.onceU||{};B.onceU[sk.id]=(B.onceU[sk.id]||0)+1}P.mp-=sk.mp;B.skm=B.pb.kind?1.5:1;const kd=B.pb.kind;delete B.pb.kind;updBUI();if(kd)say('Kindled.',400,'auto');await doSkill(sk.id);B.skm=1;if(sk.id==='smite'){B.pb.whet=1;updBUI()}}
  else if(a.startsWith('tl:')){const k=a.slice(3);B.tu[k]=(B.tu[k]||0)+1;await useToolB(k)}
  else if(a.startsWith('it:')){const id=a.slice(3);if(!hasItem(id)){await say('You reach for it. It isn\'t there any more.');return}await battleItem(id)}
  if(a!=='guard')B.riposte=false;
  await reap()}
async function study(){const f=tgt(),L=STUDY[f.kind]||[['f','It looks back at you.']];let l;P.known=P.known||{};const ek=f.ek||f.kind,nw=!P.known[ek];P.known[ek]=1;
  if(hasT('gallows')){const h=L.filter(x=>x[0]==='h');l=pick(h.length?h:L);P.mp=Math.min(P.mmax,P.mp+1);updBUI()}else l=bagPick('study'+f.kind,L);
  await say(l[1],2000,true);if(nw){updBUI();await say(NM(f,'You size up the @. (Hold its name to see its defences.)'),900,true)}}
function dmgMult(f){let m=1;if(B&&B.harv)m*=1+.1*B.harv;if(hasT('exec')&&f.hp<f.max*.35)m*=1.4;if(hasT('spite')&&P.hp<P.max*.35)m*=1.3;if(P.blessed)m*=1.1;return m}
function pDmgX(f,mult=1,pierce=false,parts=[]){const bw=typeof bossWard==='function'?bossWard(f):[1,''];if(bw[0]!==1){mult*=bw[0];parts=parts.concat([[bw[1],bw[0]]])}const sh=f.st.shred||0,arm=f.def+(f.st.wall?4:0)+(f.st.harden?3:0)+4*(f.st.crystal||0),def=pierce?0:Math.max(0,arm-(P.pierce||0)-2*sh),dm=dmgMult(f),km=B&&B.skm||1,vu=f.st.vuln?1.25:1,shm=1+.06*sh,rnd=ri(-1,2);
  const raw=effAtk()*mult*dm*km*vu*shm,d=Math.max(1,Math.round(raw+rnd-def)),L=[`Your attack\t${Math.round(effAtk()*10)/10}`];
  for(const[n,v]of parts)if(v!==1)L.push(`${capF(n)}\t${X(v)}`);if(dm!==1)L.push(`${[hasT('exec')&&f.hp<f.max*.35?'Executioner':'',hasT('spite')&&P.hp<P.max*.35?'Spite':'',P.blessed?'Blessed':''].filter(Boolean).join(', ')}\t${X(dm)}`);
  if(km!==1)L.push(`Kindled\t${X(km)}`);if(vu!==1)L.push('It is Vulnerable\t×1.25');if(sh)L.push(`Shredded (${sh})\t${X(shm)}`);L.push(`Luck\t${rnd>=0?'+':'−'}${Math.abs(rnd)}`);
  if(pierce)L.push('Its armour\tignored');else{L.push(`Its armour\t−${def}`);const an=[];if(f.st.wall)an.push('+4 shield wall');if(f.st.harden)an.push('+3 hardened');if(f.st.crystal)an.push(`+${4*f.st.crystal} crystal plates`);if(P.pierce)an.push(`−${P.pierce} your piercing`);if(sh)an.push(`−${2*sh} shredded`);if(an.length)L.push(`  ${f.def} base, ${an.join(', ')}`)}L.push(`=\t${d}`);return{d,why:L.join('\n')}}
function pDmg(f,mult=1,pierce=false){return pDmgX(f,mult,pierce).d}
/* overkill is clipped: a hit never does more than the foe has left (so no life drain off a corpse) */
function hurtFoe(f,d,col,lab,why){if(DEV.ohk)d=Math.max(d,f.hp);d=Math.max(0,Math.min(d,Math.ceil(f.hp)));f.hp-=d;if(f.st&&f.st.hum)f.humD=(f.humD||0)+d;rec('dealt',d);recMax('best',d);f.shake=.35;f.flash=.25;addNum(f,d,col||'#fff',lab);if(why!==false)clog(`${lab||B.src||'You'} → ${f.name}: ${d}`,why||'',col&&col!=='#fff'?col:'');return d}
async function strike(f,mult,noQ,o={}){
  /* a set pike: whatever you swing at the pikeman, you walk onto the point first (only once, then he has to set it again) */
  if(f.st&&f.st.pikeset&&!o.noproc&&f.hp>0&&P.hp>0){delete f.st.pikeset;updBUI();await eHit(f,mult>=1.4?1.1:.7,'You walk onto the set pike. (# dmg)');if(P.hp<=0)return null}
  if(!o.sure&&(P.st.dazed||P.st.blind)&&chance(.5)){B.pLunge=.3;SFX.miss();await sleep(200);await say(P.st.blind?'You swing at nothing.':'You\'re dizzy and your swing goes wide.',700);return null}
  const pr=!noQ&&chance(.25)?await qte('atk',f):false,wt=wType(),src=o.src||B.src||'Strike';
  if(!o.sure&&!pr){
    const am=o.acc??(B.artAcc||0),hc=hitChance(f,am,o.nododge);if(!chance(hc)){const dg=effDodge(f,o.nododge),isD=dg>0&&chance(dg/Math.max(.01,1-hc));B.pLunge=.3;SFX.miss();await sleep(150);addNum(f,isD?'DODGE':'MISS','#c8c8c8','');
      clog(`${src} → ${f.name}: ${isD?'dodged':'missed'}`,`Your accuracy\t${P100(WACC[wt])}\n  ${WT_NAME[wt]}${am?`\n${src}\t${am>0?'+':'−'}${P100(Math.abs(am))}`:''}${P.acc?`\nGear\t${P.acc>0?'+':'−'}${P100(Math.abs(P.acc))}`:''}${dg?`\nIts dodge\t−${P100(dg)}${wt==='spear'?'\n  halved by your spear':''}`:''}${lvMiss(f)?`\nIt is ${lvGap(f)} levels above you\t−${P100(lvMiss(f))}`:''}\n=\t${P100(hc)} chance to hit\nThe roll went against you.`,'#a8a8a0');
      await say(isD?NM(f,pick(['The @ twists out of the way.','The @ sways out of the way.','The @ slips aside.'])):pick(['You miss.','Your blow goes wide.','Too far. You hit air.']),600);return null}
    if(f.parry&&!f.st.exposed&&wt!=='flail'&&chance(f.parry)){B.pLunge=.3;await sleep(120);SFX.clang();f.lunge=.2;addNum(f,'PARRY','#c8c8c8','');clog(`${f.name} parries your ${src}`,`Its parry chance\t${P100(f.parry)}\nA precise strike (the gold ring) can't be parried, and an Exposed foe can't parry at all.`,'#a8a8a0');await say(NM(f,'The @ turns your blade aside.'),600);return null}}
  const blk=!o.sure&&!pr&&f.block&&!f.st.exposed&&wt!=='axe'&&chance(f.block)?(wt==='flail'?1:['mace','hammer','great'].includes(wt)?.8:.5):0;
  const parts=[[src,mult]];if(B.pb&&B.pb.whet){parts.push(['Whetted',1.4]);mult*=1.4;delete B.pb.whet}
  {const tm=(WVT[wt]||{})[f.type]||1,om=wt==='dagger'&&(f.st.bleed||f.st.poison)?1.25:1,lg=-lvGap(f),lm=lg>0?1+.03*Math.min(5,lg):1;if(tm!==1)parts.push([`${WT_NAME[wt].toLowerCase()} vs ${(TYPE_N[f.type]||'').toLowerCase()}`,tm]);if(om!==1)parts.push(['dagger on a bleeding/poisoned foe',om]);if(lm!==1)parts.push([`you are ${lg} levels above it`,lm])}
  mult*=wtMult(f,wt);
  B.pLunge=.3;await sleep(120);B.fx.push({k:'hit',t:0,f,big:pr,w:wt});if(['mace','hammer','flail'].includes(wt)||pr)B.shake=Math.max(B.shake||0,pr?.25:.15);SFX.slash();if(pr||blk)SFX.clang();await sleep(100);
  const crit=chance(P.crit+(wt==='dagger'&&f.type==='humanoid'?.1:0));if(crit)parts.push(['critical hit',1.6]);if(pr)parts.push([pr===2?'perfect timing':'precise timing',pr===2?2:1.4]);
  const DX=pDmgX(f,mult*(crit?1.6:1)*(pr===2?2:pr?1.4:1),!!o.pierce,parts),d=Math.min(Math.max(1,Math.ceil(f.hp)),Math.max(1,Math.round(DX.d*(blk||1))));if(pr===2)SFX.crit();hurtFoe(f,d,crit?'#ffd75e':'#fff',crit?src+' CRIT':src,DX.why+(blk?`\nIt blocked\t${X(blk)}\n  ${P100(f.block)} chance to block\n=\t${d}`:''));crit?SFX.crit():SFX.hit();if(crit)rec('crits',1);
  if(P.lifesteal>0&&P.hp<P.max&&Math.round(d*P.lifesteal)>0){const h=Math.min(P.max-P.hp,Math.round(d*P.lifesteal));P.hp+=h;addNum('p',h,'#8fe08a','Drain');clog(`Life drain: +${h} HP`,`Damage dealt\t${d}\nLife steal (gear)\t×${P100(P.lifesteal)}\n=\t+${h}`,'#8fe08a')}
  if(f.hp>0&&blk!==.5&&!o.noproc){if(hasT('hamstring')&&chance(.25))foeSt(f,'cripple',2);if(P.bleedc&&!f.st.bleed&&chance(P.bleedc))foeSt(f,'bleed',3);if(P.stagger&&chance(P.stagger))foeSt(f,'stag',1);if(crit&&hasT('bleed')&&!f.st.bleed)foeSt(f,'bleed',2)}
  if(hasT('pick')&&chance(.12)){const t=(DROPS[f.kind]||[['potion',1]]),g=pick(t)[0];if(addItem(g)){updBUI();await say(`You lift a ${ITEMS[g].n} off it mid-swing.`,900,true)}}
  if(f.kind==='harrow'&&f.stance==='shield'&&f.hp>0&&(mult>=1.4||['mace','hammer','flail','great'].includes(wt)||['Crush','Sunder','Quake'].includes(src))){f.stance=null;delete f.st.stshield;delete f.st.wall;f.st.stag=1;SFX.clang();addNum(f,'BROKEN','#ffd870','');updBUI();clog('Harrow\'s guard is broken','A heavy, crushing or wound-up blow knocks him off balance while he is behind his shield.','#ffd870')}
  if(f.st.crystal&&f.hp>0&&(wt==='mace'||wt==='hammer'||o.pierce||['Crush','Sunder','Quake'].includes(src))){f.st.crystal--;if(!f.st.crystal)delete f.st.crystal;SFX.clang();addNum(f,'CRACK','#6ab0ff','');clog('A crystal plate cracks off','Blunt weapons, Crush, Sunder and Quake break one plate per hit. Each plate is +4 armour.','#6ab0ff');updBUI()}
  if(f.st.bristle&&P.hp>0){const td=2+Math.floor(P.lv/3);P.hp=Math.max(1,P.hp-td);addNum('p',td,'#a8c060','Thorns');clog(`Thorns → you: ${td}`,'It was Bristling: anything that strikes it takes 2 + level/3 damage.','#a8c060');updBUI();await say(`The thorns bite back. (${td} dmg)`,500,'auto')}
  if(f.kind==='toad'&&!P.st.poison&&chance(.25)&&!(B.pb&&B.pb.unsh)){P.st.poison=2;updBUI();await say('Its skin is slick with poison, and now so are you.',600,'auto')}
  updBUI();if(blk&&f.hp>0)await say(NM(f,blk===.5?'The @ takes it on its shield.':'The @ gets its shield up, but the weight goes through it.'),600,'auto');return{d,crit,pr,blk:blk===.5}}
async function pSlash(noQ){const f=tgt(),rip=B.riposte,r=await strike(f,rip?1.7:1,noQ,rip?{sure:1}:{});if(!r)return;
  if(P.cleave>0){for(const e of alive())if(e!==f){B.fx.push({k:'slash',t:0,f:e});hurtFoe(e,Math.max(1,Math.round(r.d*P.cleave)),'#fff','Cleave',`Your hit\t${r.d}\nCleave (weapon)\t×${P100(P.cleave)}\n=\t${Math.max(1,Math.round(r.d*P.cleave))}`)}updBUI()}
  if(rip)await say('You turn its blow into an opening.',600,'auto');else if(r.crit)await say('A clean strike.',500,'auto');else if(r.d<=2)await say('Your blade barely bites.',700,'auto');else await sleep(350)}
async function doSkill(id){const f=tgt();
  if(id==='smite'){B.pLunge=.25;B.fx.push({k:'smite',t:0,f});SFX.smite();say('You call down holy fire!',700,'auto');await sleep(380);
    const wood=f.kind==='ent'||f.kind==='elder'||f.kind==='strawman',holy=f.type==='undead'||f.type==='fiend',cr=chance(P.crit),DX=pDmgX(f,(wood?1.7:1.15)*(holy?1.5:1),true,[['Smite',1.15],...(wood?[['wood burns',1.7/1.15]]:[]),...(holy?[['holy vs '+(TYPE_N[f.type]||'').toLowerCase(),1.5]]:[])]),d=Math.round((DX.d+3+P.smite)*(cr?1.6:1));hurtFoe(f,d,cr?'#fff4c0':'#ffd75e',cr?'Smite CRIT':'Smite',DX.why+`\nHoly fire\t+3${P.smite?`\nSmite bonus (talents & gear)\t+${P.smite}`:''}${cr?'\nCritical hit\t×1.6':''}\n=\t${d}`);if(cr)SFX.crit();if(hasT('consec')){foeSt(f,'burn',3);for(const e2 of alive())if(e2!==f)foeSt(e2,'burn',1)};
    if(hasT('absolve')){const h=Math.min(P.max-P.hp,Math.round(d*.25));if(h>0){P.hp+=h;addNum('p',h,'#8fe08a');hpLog(h,'Absolution')}}updBUI();
    await sleep(320);if(holy)await say('Holy light burns it.',700,'auto');if(cr)await say('The fire burns white-hot.',600,'auto');if(wood)await say('The bark catches fire.',700,'auto');else if(hasT('consec'))await say('The holy fire sticks to it and keeps burning.',600,'auto');else await sleep(250)}
  else if(id==='twin'){const k=.55*skR('twin');say('Twin Cut.',600,'auto');await strike(f,k);if(f.hp>0){await sleep(100);await strike(f,k,true)}await sleep(300)}
  else if(id==='whirl'){say('Whirlwind.',700,'auto');B.pLunge=.4;SFX.slash();await sleep(200);for(const e of alive()){B.fx.push({k:'slash',t:0,f:e});const cr=chance(P.crit),d=pDmg(e,.55*skR('whirl')*(cr?1.6:1));hurtFoe(e,d,cr?'#ffd75e':'#fff');cr?SFX.crit():SFX.hit();await sleep(90)}updBUI();await sleep(400)}
  else if(id==='bash'){B.pLunge=.35;await sleep(180);SFX.clang();const cr=chance(P.crit),d=pDmg(f,.6*skR('bash')*(cr?1.6:1));hurtFoe(f,d,cr?'#ffd75e':'#fff');if(cr)SFX.crit();updBUI();
    if(f.hp>0&&chance(.3*(cr?2:1))&&foeSt(f,'stag',1)){updBUI();await say('It reels, off balance.',700,'auto')}else await say('You slam your shield into it. It stays on its feet.',700,'auto')}
  else if(id==='mend'){const cr=chance(P.crit),h=Math.min(P.max-P.hp,Math.round(P.max*.3*skR('mend')*(cr?1.6:1)*(B.skm||1)));P.hp+=h;SFX.heal();B.fx.push({k:'heal',t:0});addNum('p',h,cr?'#d8ffb0':'#8fe08a');clog(`Mend: +${h} HP`,`Max health\t${P.max}\nMend\t×25%${cr?'\nCritical\t×1.6':''}${B.skm&&B.skm!==1?'\nKindled\t×1.5':''}\n=\t+${h}\n  never more than you were missing`,'#8fe08a');updBUI();await say(cr?`Light floods through you. +${h} HP.`:`Warm light closes your wounds. +${h} HP.`,900,'auto')}}
async function useToolB(k){const f=tgt();B.pLunge=.3;await sleep(150);
  if(k==='brand'){SFX.ignite();for(const e of alive()){const wood=e.kind==='ent'||e.kind==='elder'||e.kind==='strawman';foeSt(e,'burn',3);if(wood)hurtFoe(e,6+P.lv*2,'#ff9a3a');const p=e.pos||{x:W*.69,y:H*.3};for(let i=0;i<10;i++)B.fx.push({k:'spark',t:0,x:p.x+(Math.random()-.5)*24,y:p.y+(Math.random()-.5)*24,vx:(Math.random()-.5)*40,vy:-30-Math.random()*30,c:pick(['#ff9a3a','#ffd75e','#c8401a'])})}
    updBUI();await say('You sweep the Firebrand across them and they all catch.',900,'auto');if(chance(.25)){P.st.burn=2;updBUI();await say('The flames catch your sleeve too.',800,true)}}
  else if(k==='powder'){SFX.thud();SFX.ignite();const d=14+P.lv*3;for(const e of alive()){hurtFoe(e,Math.round(d*(e.k.boss?.7:1)),'#ffd75e');const p=e.pos||{x:W*.69,y:H*.3};for(let i=0;i<14;i++)B.fx.push({k:'spark',t:0,x:p.x,y:p.y,vx:(Math.random()-.5)*90,vy:(Math.random()-.5)*90,c:pick(['#ffd75e','#ff9a3a','#6a645c'])})}
    const self=Math.max(1,Math.round(P.max*.15/(P.guard?2:1)));P.hp-=self;rec('taken',self);B.pShake=.4;addNum('p',self,'#ff6a5a');updBUI();await say(`The blast tears through them. Some of it finds you too. (${self} dmg)`,900)}
  else if(k==='hook'){SFX.whoosh();const heavy=['bear','golem','knight','ent'].includes(f.kind)||f.k.boss;
    if(heavy&&chance(.4)){const d=Math.max(1,Math.round(P.max*.06));P.hp-=d;rec('taken',d);P.guard=false;addNum('p',d,'#ff6a5a');updBUI();await say(NM(f,'The hook bites, but the @ is too heavy. It drags you off your feet.'),900);await inflict('dazed',1,'Your head rings.')}
    else{const had=f.st.wall||f.st.harden||f.st.coiled;delete f.st.wall;delete f.st.harden;if(f.st.coiled){delete f.st.coiled;if(f.k.boss)f.turn++}if(f.k.fly)foeSt(f,'stag',1);hurtFoe(f,pDmg(f,.4));updBUI();
      await say(NM(f,had?'The hook drags its guard aside and breaks its stance.':f.k.fly?'You hook the @ out of the air. It flaps on the ground.':'You rip the hook back out through the @.'),900)}}
  else if(k==='axe'){SFX.thunk();const wood=['ent','elder','strawman','thornling','shroom'].includes(f.kind)||f.type==='plant';const r=await strike(f,wood?1.6:.8,true,{src:"Woodsman's Axe",noproc:1});if(r&&wood)await say(NM(f,'The axe bites deep. It splits the wood of the @.'),800,'auto')}
  else if(k==='crowbar'){SFX.clang();const r=await strike(f,.35,true,{src:'Crowbar',nododge:1});if(f.hp>0){delete f.st.wall;delete f.st.harden;f.st.exposed=2;updBUI();await say(NM(f,'You get the crowbar into its guard and lever. The @ is Exposed.'),800,'auto')}}
  else if(k==='pole'){SFX.whoosh();let n=0;for(const e of alive()){foeSt(e,'slow',2);if(!e.k.boss&&(e.k.fly||e.max<40)&&chance(.4)&&foeSt(e,'stag',1))n++}updBUI();await say(n?'The pole sweeps their legs. Some of them go down.':'The pole sweeps their legs. They stagger.',850,'auto')}
  else if(k==='shovel'){SFX.clang();const r=await strike(f,.55,true,{src:'Shovel'});if(r&&f.hp>0&&chance(.5)&&foeSt(f,'stag',1)){updBUI();await say(NM(f,'The flat of the blade rings off the @\'s head.'),800,'auto')}}
  else if(k==='keys'){SFX.coin();let n=0;for(const e of alive())if(e.type==='humanoid'&&foeSt(e,'cripple',2))n++;updBUI();await say(n?'You hold up the Warden\'s keys. Those who serve the crown lose heart. Their arms go heavy.':'You jangle the keys. Nothing here serves the crown.',900,'auto')}
  else if(k==='bell'){[0,2,1,3].forEach((p,i)=>setTimeout(()=>SFX.bell(p),i*110));let n=0;for(const e of alive())if(chance(.5)&&foeSt(e,'stag',1))n++;updBUI();
    await say(n?'The Wardbell rings out. Some of them reel.':'The Wardbell rings out. Nothing flinches.',800);if(chance(.35))await inflict('dazed',1,'The ringing hurts your own head too.')}}
async function battleItem(id){removeItem(id);
  if(id==='lampoil'){B.pLunge=.3;await sleep(200);SFX.ignite();
    for(const f of alive()){const e=f.pos||{x:W*.69,y:H*.3};for(let i=0;i<12;i++)B.fx.push({k:'spark',t:0,x:e.x+(Math.random()-.5)*26,y:e.y+(Math.random()-.5)*26,vx:(Math.random()-.5)*50,vy:-30-Math.random()*40,c:pick(['#ff9a3a','#ffd75e','#c8401a'])});
      const wood=f.kind==='ent'||f.kind==='elder'||f.kind==='strawman',d=Math.round((10+P.lv*2)*(wood?1.6:1));hurtFoe(f,d,'#ff9a3a');foeSt(f,'burn',2)}
    updBUI();await say('The flask shatters and the fire spreads.',800);return}
  const msg=applyItem(id);SFX.heal();B.fx.push({k:'heal',t:0});updBUI();await say(msg,800)}
const HEALC=new Set(['#8fe08a','#d8ffb0','#7ab8e8']);
function addNum(who,v,c,lab){if(!B)return;const mine=B.nums.filter(n=>n.who===who),q=mine.filter(n=>n.t<.35).length,used=new Set(mine.map(n=>n.k));let k=0;while(used.has(k)&&k<5)k++;B.nums.push({who,v,c,k,lab:lab===undefined?(who==='p'||HEALC.has(c)?'':B.src||''):lab,t:-q*.35})}
/* ---- combat log: what happened, in order; hold an entry to see why ---- */
/* the log outlives the fight: every battle is kept, newest at the bottom */
const LOGALL=[];
/* three views: what you did (out), what was done to you (in), and the order things happened in (ord) */
const plainT=h=>String(h||'').replace(/<br\s*\/?>/g,'\n').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
const logCat=t=>/^— Round|^Order:/.test(t)?'ord':/→ you|^You are |^You dodge|feeds|regrows|join|spill|crawl|out of the undergrowth|runs up/.test(t)?'in':'out';
let logTab='out';
function clog(text,why,c,cls,cat){const e={text,why:why||'',c:c||'',cls:cls||'',cat:cls==='lf'?'all':cat||logCat(text)};if(B&&B.fs&&e.cat!=='world'&&e.cat!=='all')e.text='First strike · '+e.text;if(B){B.log=B.log||[];B.log.push(e)}LOGALL.push(e);if(LOGALL.length>600)LOGALL.shift();if($('#clog').classList.contains('on'))renderLog()}
const capF=s=>String(s).charAt(0).toUpperCase()+String(s).slice(1);
/* tooltips for log entries: "label\tvalue" lines become aligned rows, "=\tvalue" a total, lines indented two spaces a small note */
function fmtWhy(w){if(!w)return'';const ls=String(w).split('\n'),tots=ls.filter(l=>/^=/.test(l)).length;let ti=0,h='';
  const row=(a,b,c)=>`<span class='wr${c?' '+c:''}'><span>${esc(a)}</span><em>${esc(b)}</em></span>`;
  for(const raw of ls){const l=raw.replace(/\s+$/,'');let m;
    if(!l.trim()){h+="<span class='wsp'></span>";continue}
    if(/^  /.test(l)){h+=`<span class='ws'>${esc(l.trim())}</span>`;continue}
    if(/^=/.test(l)){ti++;h+=row(ti<tots?'Subtotal':'Total',l.replace(/^=\s*/,''),'tot');continue}
    if(l.includes('\t')){const[a,b]=l.split('\t');h+=row(a,b);continue}
    if(m=l.match(/^([×÷])\s?([\d.]+)\s+(.+)$/)){h+=row(capF(m[3]),m[1]+m[2]);continue}
    if(m=l.match(/^([+−-])\s?(\d[\d.]*%?)\s+(.+)$/)){h+=row(capF(m[3]),(m[1]==='-'?'−':m[1])+m[2]);continue}
    h+=`<span class='wn'>${esc(l)}</span>`}
  return h}
/* resolve order: every combat event in the order it happened, numbers kept for the tooltip */
const stripN=t=>String(t).replace(/:\s*[+−-]?\d+(\.\d+)?(\s*(HP|MP))?$/,'').replace(/\s*\(\d+ turns?\)/,'').replace(/\s*\(\d+ of \d+\)/,'');
/* every change to your health goes in the log */
function hpLog(h,src,why){if(h)clog(`${src}: ${h>0?'+':'−'}${Math.abs(h)} HP`,why||'',h>0?'#8fe08a':'#e07a6a','','in')}
function renderLog(){renderLogTo('#clogt','#clogl')}
function renderLogTo(ts,ls){document.querySelectorAll(ts+' b').forEach(b=>b.classList.toggle('on',b.dataset.t===logTab));const el=$(ls),ro=logTab==='ord',L=LOGALL.filter(e=>e.cat==='all'||e.cat==='every'||(ro?e.cat==='ord'||e.cat==='in'||e.cat==='out':e.cat===logTab));
  const L2=[];for(let i=0;i<L.length;i++){const e=L[i];if(e.cat==='all'){const nx=L[i+1];if(!nx||nx.cat==='all')continue}L2.push(e)}
  el.innerHTML=L2.length?'':'<div class="le">Nothing yet.</div>';el.innerHTML+=L2.map(e=>{const sh=ro&&e.cat!=='ord'&&e.cls!=='lf'?stripN(e.text):e.text,tip=e.why||sh!==e.text?`<b>${esc(e.text)}</b>${fmtWhy(e.why)}`:'';return`<div class="${e.cls||'le'}${ro&&e.cat==='ord'?' lr':''}" style="${e.c?'color:'+e.c:''}" ${tip?`data-tip="${esc(tip)}"`:''}>${esc(sh)}</div>`}).join('');el.scrollTop=el.scrollHeight}
const P100=x=>Math.round(x*100)+'%',X=x=>'×'+(Math.round(x*100)/100);
function qte(kind,f){return new Promise(res=>{const dur=kind==='atk'?560:620;B.qte={kind,f,start:performance.now(),dur,res,done:false};
  setTimeout(()=>{if(B&&B.qte&&!B.qte.done&&B.qte.res===res){B.qte.done=true;B.qte=null;res(false)}},dur+170)})}
function qteTap(){if(!B||!B.qte||B.qte.done)return false;const q=B.qte,t=performance.now()-q.start,win=q.kind==='atk'?110:140,off=Math.abs(t-q.dur),ok=off<=win,perf=off<=(q.kind==='atk'?35:40);
  q.done=true;B.qf={ok,perf,kind:q.kind,t:0,early:t<q.dur-win,pos:q.kind==='atk'?(q.f&&q.f.pos):B.pPos};B.qte=null;q.res(perf?2:ok?1:0);return true}
addEventListener('pointerdown',e=>{if(B&&B.qte){qteTap();e.preventDefault();e.stopPropagation()}},true);
async function inflict(st,turns,msg){
  /* a foe that died to your Thorns or Riposte mid-attack doesn't get to leave anything on you */
  if(B&&B.cur&&(B.cur.dead||B.cur.hp<=0))return false;
  if(B&&B.pb&&B.pb.unsh){await say('It tries to grip your mind and can\'t. You\'re Unshaken.',700);return false}
  if(st==='poison'&&P.poisonImm){await say('The poison doesn\'t take.',600);return false}
  if((st==='dazed'||st==='rooted'||st==='blind')&&hasT('iron')&&chance(.5)){await say('You shake it off.',600);return false}
  {const rk=PRESK[st],rv=rk?pRes()[rk]:0;if(rv>0&&chance(rv)){addNum('p','RESIST','#a8a8a0','');clog(`You resist ${(STATUS[st]||{n:st}).n}`,`Your ${rk==='debuff'?'weaken':rk} resistance\t${P100(rv)}`,'#a8a8a0','','in');await say('You shrug it off.',600);return false}}
  P.st[st]=Math.max(1,turns-(hasT('accept')?1:0));addNum('p',(STATUS[st]||{n:st}).n.toUpperCase(),'#e0a07a','');clog(`You are ${(STATUS[st]||{n:st}).n} (${P.st[st]} turns)`,(STATUS[st]||{}).tip||'',' #e0a07a'.trim());updBUI();await say(msg,700,true);return true}
const BLEEDC={stag:.3,ghoul:.3,leech:.4,boar:.35,wolf:.25,bear:.3,brigand:.2,bat:.12,knight:.15,harrow:.2,imp:.08};
async function eHit(f,mult,text){
  /* Harrow in blade stance: Guard as he swings and you catch it and cut back */
  if(f.kind==='harrow'&&f.stance==='blade'&&P.guard&&!f.lastOath){f.lunge=.35;await sleep(120);SFX.clang();const d=Math.round(effAtk()*1.6);hurtFoe(f,d,'#ffd870','Counter');f.st.stag=1;delete f.st.stblade;f.stance=null;updBUI();await say(`You catch his blade on your guard and cut back hard. He reels. (${d} dmg)`,1100,true);return 0}
  if(f.kind==='harrow'&&f.stance==='blade')mult*=1.25;
  if(B.pb.ward!=='riposte'&&chance(pDodge())){f.lunge=.35;await sleep(120);SFX.miss();addNum('p','DODGE','#c8c8c8');clog(`You dodge ${f.name}'s attack`,`Dodge chance\t${P100(pDodge())}`,'#a8a8a0','','in');updBUI();await say(NM(f,pick(['You step out of the @\'s reach.','The @ hits empty air. You\'d already moved.'])),700);return 0}
  if(B.pb.ward==='riposte'&&chance(pDodge())){f.lunge=.35;await sleep(120);SFX.miss();addNum('p','DODGE','#c8c8c8');clog(`You dodge ${f.name}'s attack`,`Dodge chance\t${P100(pDodge())}\n  includes +25% from your Riposte stance`,'#a8a8a0','','in');updBUI();await say(NM(f,'You let the @\'s blow slide past.'),650);await ripCounter(f);return 0}
  if(chance(pParry())){f.lunge=.35;await sleep(120);SFX.clang();addNum('p','PARRY','#c8c8c8');clog(`You parry ${f.name}'s attack`,`Parry chance\t${P100(pParry())}\n  from your ${WT_NAME[wType()].toLowerCase()}\nA parried blow does nothing.`,'#a8a8a0','','in');updBUI();await say(NM(f,'You turn the @\'s blow aside with your blade.'),650);await ripCounter(f);return 0}
  if(B.pb.ward==='evade'){delete B.pb.ward;f.lunge=.35;await sleep(120);SFX.miss();clog(`${f.name}'s attack misses you`,'Shadowstep: the next blow aimed at you this round misses entirely.','#a8a8a0','','in');updBUI();await say(NM(f,'The @ strikes where you were. You are not there.'),750);return 0}
  const par=(mult>=1.7||chance(.2))?await qte('def',f):false;f.lunge=.35;await sleep(120);
  let m=mult*(f.st.frenzy?1.25:1)*(f.st.cripple?.7:1)*lvFoeMult(f);const W=[`${f.name}'s attack\t${f.atk}`];if(mult!==1)W.push(`${mult>=1.6?'Wound-up attack':'This move'}\t${X(mult)}`);if(f.st.frenzy)W.push('Frenzied\t×1.25');if(f.st.cripple)W.push('Weakened\t×0.7');if(lvFoeMult(f)!==1)W.push(`Level difference\t${X(lvFoeMult(f))}`);
  const rr=ri(-1,1);let d=Math.max(1,Math.round(f.atk*m*30/(30+P.def))+rr);W.push(`Your armour (${P.def})\t−${Math.round(100-3000/(30+P.def))}%`);W.push(`Luck\t${rr>=0?'+':'−'}${Math.abs(rr)}`);
  if(B.bastion){B.bastion=(B.bastion===true?1:B.bastion)+1;if(B.bastion>2)B.bastion=false;d=Math.max(1,Math.ceil(d*.6));W.push('Bastion (first two blows)\t×0.6')}
  if(par===2){d=0;W.push('Perfect parry\t×0')}else if(par){d=Math.max(1,Math.ceil(d*.5));W.push('Parried\t×0.5')}
  const blkd=!par&&chance(pBlock());if(blkd){d=Math.max(1,Math.ceil(d*.5));W.push(`Blocked\t×0.5\n  ${P100(pBlock())} chance to block`)}
  if(B.pb.fort){d=Math.max(1,Math.ceil(d*.7));W.push('Fortified\t×0.7')}if(B.pb.keep){d=Math.max(1,Math.ceil(d*.8));W.push('Kept at pole\'s length\t×0.8')}if(B.pb.brace){d=Math.max(1,Math.ceil(d*(mult>=1.6?.5:.75)));W.push(`Spear Set\t${mult>=1.6?'×0.5':'×0.75'}`)}
  if(par===2){SFX.clang();SFX.crit()}else if(P.guard){const gd=2.2+.6*tr('stalwart');d=Math.max(1,Math.ceil(d/gd));W.push(`Guarding\t÷${gd}`);SFX.clang()}else if(par)SFX.clang();else SFX.hurt();W.push(`=\t${d}`);
  {const tx=(text||'').toLowerCase(),k=/bite|fang|teeth|jaw|snap|gore|tusk|drink|mandible|latch/.test(tx)?'bite':/claw|rake|scratch|talon|sickle|knife|stab|cut|blade|sword|pike|jab|cleave|slash/.test(tx)?'claw':/spit|bile|acid|spore|web|shard|fling|throw|arrow|crows/.test(tx)?'proj':'impact';B.fx.push({k:'fa_'+k,t:0,f,big:mult>=1.6});if(mult>=1.6)B.shake=Math.max(B.shake||0,.3);if(P.guard&&d>0)B.fx.push({k:'guardflash',t:0});if(blkd)B.fx.push({k:'blockspark',t:0})}
  P.hp-=d;rec('taken',d);if(blkd){SFX.clang();addNum('p','BLOCK','#c8c8c8','')}if(d>0){B.pShake=.35;B.pFlash=.25;addNum('p',d,'#ff6a5a')}else addNum('p','PERFECT','#d8f4ff');clog(`${f.name} → you: ${d}`,W.join('\n'),'#ff8a7a');
  let saved=false;if(P.hp<=0&&hasT('last')&&!B.last){B.last=1;P.hp=Math.max(1,Math.round(P.max*.2));saved=true}
  /* mosquitoes drink: half of what they take from you comes back to them */
  if(f.kind==='mosquito'&&d>0&&f.hp>0){const h=Math.min(f.max-f.hp,Math.round(d*.5));if(h>0){f.hp+=h;addNum(f,h,'#8fe08a','Drain');clog(`${f.name} drinks: +${h} HP`,'Bog Mosquitoes heal for half the damage they deal.','#8fe08a','','in')}}
  if(P.thorns&&f.hp>0)hurtFoe(f,P.thorns,'#d8a24a','Thorns','Your gear has Thorns: attackers take that much damage.');
  updBUI();await say(par===2?NM(f,text).replace(/\s*\(# dmg\)/,'')+' You meet it perfectly. Not a scratch.':NM(f,text).replace('#',d)+(par?' You catch it at the last moment.':P.guard?' Your shield takes most of it.':''),750);
  if(P.hp>0&&f.hp>0&&!P.guard&&!blkd&&!P.st.bleed&&chance(BLEEDC[f.kind]||0)){const rb=pRes().bleed;if(chance(rb)){addNum('p','RESIST','#a8a8a0','');clog('You resist Bleeding',`Your armour gives ${P100(rb)} bleed resistance.`,'#a8a8a0','','in')}else{P.st.bleed=4;addNum('p','BLEEDING','#d83a3a','');clog('You are Bleeding (4 turns)',`Its attacks have a ${P100(BLEEDC[f.kind])} chance to open a wound when you are not guarding. Only a bandage stops bleeding.`,'#d83a3a');updBUI();await say('You are bleeding.')}}
  if(saved)await say('You should be dead. You stay standing.',1000,true);
  await ripCounter(f);
  if(P.hp>0&&f.hp>0&&B.pb.brace){const ch=mult>=1.6;say(NM(f,ch?'The charge breaks on your spear point!':'The @ comes onto your spear point.'),500,'auto');await sleep(250);await strike(f,ch?1.5:.6,true,{noproc:1,src:ch?'Spear vs charge':'Spear'})}
  return d}
async function foesTurn(){for(const f of alive()){if(P.hp<=0)break;await foeAct(f);await reap();if(!alive().length)break}}
async function foeAct(f){const e=f;B.cur=f;
  if(e.st.stag){delete e.st.stag;e.st.steady=2;updBUI();await say(NM(f,'The @ stumbles, off balance, and loses its footing.'),700);return}
  e.turn++;if(e.st.wall)e.st.wall--;
  if(f.k.boss&&await bossPhase(f))return;
  if(f.kind==='rotmother'){const br=alive().filter(x=>x.kind==='slime').length;if(br&&e.hp<e.max){const h=Math.min(e.max-e.hp,Math.round(e.max*.03*br));e.hp+=h;addNum(f,h,'#8fe08a','');clog(`The Rot Mother feeds: +${h}`,`3% of her health for each of her brood still alive (${br}).`,'#8fe08a');updBUI()}}
  /* COLOSSUS: every fifth turn it starts to hum. Two turns to break the note with damage, or it shatters everything */
  if(f.kind==='colossus'&&e.st.hum){e.st.hum--;updBUI();const need=Math.round(e.max*.1);
    if((e.humD||0)>=need){delete e.st.hum;e.st.stag=1;e.st.crystal=0;f.shake=.8;SFX.clang();updBUI();await say('The note breaks. Plates fall off the Colossus and it staggers.',1000,true);return}
    if(e.st.hum>0){f.shake=.5;await say(`The hum climbs. (${e.humD||0}/${need} to break it)`,900,true);return}
    delete e.st.hum;f.shake=1;cam.shake=.6;await eHit(f,P.guard?1.2:2.6,'RESONANT SHATTER. Every crystal in the cavern shrieks at once. (# dmg)');return}
  if(f.kind==='colossus'&&e.ph>=2&&e.turn%5===4){e.st.hum=2;e.humD=0;f.shake=.6;SFX.chime&&SFX.chime();updBUI();await say('The Colossus goes still and begins to hum. Every crystal in the walls answers. Break the note, or brace.',1300,true);return}
  /* ROT MOTHER: from her second phase she lays an egg sac every fourth turn */
  if(f.kind==='rotmother'&&e.ph>=2&&e.turn%4===1&&!alive().some(x=>x.kind==='eggsac')&&alive().length<3){summon('eggsac',1,'She lays an egg sac on the fen floor.');await say('She lays an egg sac. Burst it before it hatches.',900,true);return}
  /* HARROW: changes stance every two turns */
  if(f.kind==='harrow'&&!e.lastOath&&e.turn%2===1){const nx=e.stance==='shield'?'blade':'shield';e.stance=nx;delete e.st.stshield;delete e.st.stblade;e.st['st'+nx]=99;if(nx==='shield')e.st.wall=Math.max(e.st.wall||0,2);updBUI();
    clog(nx==='shield'?'Harrow takes up a shield stance':'Harrow takes up a blade stance',nx==='shield'?'Light blows glance off. A heavy or crushing blow knocks him off balance.':'He hits harder. Guard as he swings to catch the blade and cut back.','#e0a07a')}
  if(f.kind==='colossus'&&e.ph>=2&&e.turn%4===0&&(e.st.crystal||0)<3){e.st.crystal=(e.st.crystal||0)+1;updBUI();clog('Crystal regrows on the Colossus',`+4 armour per plate (${e.st.crystal} now). Blunt weapons, Crush and Sunder crack a plate off.`,'#6ab0ff')}
  switch(f.kind){
    case'bat':if(chance(.3)){const d=await eHit(f,.9,'The bat bites and drinks! (# dmg)');e.hp=Math.min(e.max,e.hp+Math.ceil(d/2))}else await eHit(f,1,'The bat rakes you with its claws. (# dmg)');break;
    case'slime':SFX.squelch();if(!P.st.poison&&chance(.4)){await eHit(f,.6,'It spits a gob of warm bile at you. (# dmg)');if(P.hp>0)await inflict('poison',3,'You are poisoned.')}else await eHit(f,1,'It slaps into you with a wet thud. (# dmg)');break;
    case'shroom':if(!P.st.dazed&&chance(.4)){f.lunge=.3;await sleep(200);B.fx.push({k:'spore',t:0});SFX.miss();await say('It bursts a cloud of spores in your face.',700);await inflict('dazed',2,'Your head swims.')}else await eHit(f,1,'It headbutts you with its cap. (# dmg)');break;
    case'golem':if(!e.st.harden&&e.hp<e.max*.6&&chance(.5)){e.st.harden=3;SFX.clang();await say('The golem draws its stones tighter.',900)}else await eHit(f,1.05,'A stone fist slams into you. (# dmg)');break;
    case'ent':if(!P.st.rooted&&chance(.35)){await eHit(f,.7,'Roots burst from the ground and lash at you. (# dmg)');if(P.hp>0)await inflict('rooted',2,'They wrap round your legs!')}else await eHit(f,1,'A heavy branch lashes across your chest. (# dmg)');break;
    case'bear':if(e.st.coiled){delete e.st.coiled;await eHit(f,1.9,'The bear comes down with a crushing MAUL! (# dmg)')}else if(chance(.32)){e.st.coiled=1;f.lunge=.15;updBUI();await say('The bear rears up on its hind legs...',1000,true)}else await eHit(f,1,'It swipes at you with black claws. (# dmg)');break;
    case'brigand':if(hasItem('potion')&&!B.stolen&&chance(.3)){removeItem('potion');B.stolen++;f.lunge=.3;await sleep(200);await say('The Brigand darts in and lifts a potion from your belt.',1000,true)}
      else if(chance(.35)){await eHit(f,.6,'Knife, knife! (# dmg)');if(P.hp>0)await eHit(f,.6,'And again! (# dmg)')}else await eHit(f,1,'He stabs at a gap in your armour. (# dmg)');break;
    case'vagrant':{const r=Math.random();if(!P.st.blind&&r<.3){f.lunge=.3;await sleep(200);B.fx.push({k:'dirt',t:0});await say('He flings a fistful of grave-dirt into your visor!',800);await inflict('blind',2,"You can't see!")}
      else if(r<.42)await say('He mutters a prayer to the old gods of the wood.',900);else await eHit(f,1,'He cracks you with a knotted cudgel. (# dmg)');break}
    case'knight':if(e.st.coiled){delete e.st.coiled;await eHit(f,2.1,'The greatsword comes down in a terrible CLEAVE! (# dmg)')}else if(chance(.27)){e.st.coiled=1;updBUI();await say('The Oathbroken Knight raises his greatsword high...',1000,true)}
      else if(!e.st.wall&&chance(.25)){e.st.wall=3;SFX.clang();updBUI();await say('He sets his shield and waits.',900)}else await eHit(f,1,'His blade bites into your side. (# dmg)');break;
    case'imp':{const r=Math.random();if(r<.25)await say(NM(f,pick(['The @ cackles and dances out of reach.','The @ trips over its own stick.'])),700);
      else if(r<.45)await eHit(f,1.1,'The @ bites your ankle. (# dmg)');else await eHit(f,1,'The @ jabs you with a pointed stick. (# dmg)');break}
    case'wolf':{const others=alive().filter(o=>o!==f&&o.kind==='wolf');if(others.length&&!f.howled&&chance(.3)){f.howled=1;SFX.howl();others.forEach(o=>o.st.frenzy=2);updBUI();await say(NM(f,'The @ howls. The others answer, closer and bolder.'),900)}
      else if(chance(.2))await eHit(f,.8,'The @ goes for your hamstring. (# dmg)');else await eHit(f,1,'The @ snaps at you. (# dmg)');break}
    case'colossus':
      if(e.turn%3===0){delete e.st.coiled;await eHit(f,2.1,'The ceiling comes down. CAVE-IN! (# dmg)')}
      else if(e.turn%3===2){e.st.coiled=1;f.shake=.6;updBUI();await say('The ceiling groans...',1100,true)}
      else{const r=Math.random();if(!e.st.harden&&e.hp<e.max*.6&&r<.35){e.st.harden=3;SFX.clang();updBUI();await say('Crystal grows over its wounds.',900)}
        else if(r<.7){await eHit(f,.6,'Crystal shards fly across the cavern. (# dmg)');if(P.hp>0)await eHit(f,.6,'More of them. (# dmg)')}
        else await eHit(f,1,'A fist the size of a cart hits you. (# dmg)')}break;
    case'rotmother':
      if(e.turn%3===0){delete e.st.coiled;await eHit(f,1.8,'She bursts and soaks you in something warm and rotten. (# dmg)');if(P.hp>0&&!P.st.poison)await inflict('poison',3,'You are badly poisoned.')}
      else if(e.turn%3===2){e.st.coiled=1;f.shake=.5;updBUI();await say('She swells, wetly...',1100,true)}
      else{const r=Math.random();if(e.hp<e.max*.4&&e.mended<2&&r<.35){e.mended++;e.hp=Math.min(e.max,e.hp+24);addNum(f,24,'#8fe08a');SFX.heal();updBUI();await say('The fen feeds her. Her wounds fill with pale new growth.',900)}
        else if(!P.st.dazed&&r<.6){B.fx.push({k:'spore',t:0});SFX.miss();await say('A storm of spores.',600);await inflict('dazed',2,'Your head swims.')}
        else await eHit(f,1,'A cap the size of a cart slaps down on you. (# dmg)')}break;
    case'harrow':
      if(e.st.coiled&&(e.turn%3===0||e.lastOath)){delete e.st.coiled;await eHit(f,2.2,'"Kneel." The sword comes down. (# dmg)')}
      else if(e.turn%3===2||(e.lastOath&&chance(.5))){e.st.coiled=1;updBUI();await say('Lord Harrow raises his sword in a long, formal arc...',1100,true)}
      else{const r=Math.random();if(!e.lastOath&&!e.st.wall&&r<.3){e.st.wall=2;SFX.clang();updBUI();await say('He sets his shield. "Go on," he says.',900)}
        else if(!P.st.wither&&r<.6){B.fx.push({k:'rot',t:0});SFX.dread();await eHit(f,.5,'He names you oathbreaker. The word has weight. (# dmg)');if(P.hp>0)await inflict('wither',3,'Your arm goes weak. Withered.')}
        else if(!e.st.frenzy&&r<.75){e.st.frenzy=2;updBUI();await say('“For the field,” he says. He hits harder now.',900)}
        else await eHit(f,1,'A precise, patient cut. (# dmg)')}break;
    case'spider':if(!P.st.rooted&&chance(.3)){f.lunge=.2;await say('It spits a rope of web across your legs.');await inflict('rooted',2,'You are stuck fast.')}
      else if(!P.st.poison&&chance(.35)){await eHit(f,.8,'Its fangs sink in. (# dmg)');if(P.hp>0)await inflict('poison',3,'You are poisoned.')}else await eHit(f,1,'It skitters in and bites. (# dmg)');break;
    case'stag':if(e.st.coiled){delete e.st.coiled;await eHit(f,2,'The stag charges, antlers first! (# dmg)')}else if(chance(.3)){e.st.coiled=1;updBUI();await say('The stag lowers its antlers and paws the ground...',1000,true)}else await eHit(f,1,'It rears and kicks. (# dmg)');break;
    case'ghoul':if(e.hp<e.max*.5&&!e.fed&&P.st.bleed){e.fed=1;const h=Math.round(e.max*.3);e.hp=Math.min(e.max,e.hp+h);addNum(f,h,'#8fe08a');updBUI();await say('It licks up your spilled blood and its wounds close.')}
      else if(chance(.35)){await eHit(f,.65,'It claws at you. (# dmg)');if(P.hp>0)await eHit(f,.65,'And again, faster. (# dmg)')}else await eHit(f,1,'It bites, and holds on. (# dmg)');break;
    case'crawler':if(!e.st.wall&&chance(.28)){e.st.wall=2;SFX.clang();updBUI();await say('It curls up, plates overlapping.')}else if(chance(.25))await eHit(f,1.5,'It rears up and crashes down on you. (# dmg)');else await eHit(f,1,'Mandibles close on your arm. (# dmg)');break;
    case'leech':SFX.squelch();if(chance(.5)){const d=await eHit(f,.8,'It latches on and drinks. (# dmg)');e.hp=Math.min(e.max,e.hp+Math.ceil(d));updBUI()}else await eHit(f,1,'It slaps wetly against you. (# dmg)');break;
    case'drowned':if(P.st.rooted){await eHit(f,1.7,'It drags you down into the black water. (# dmg)')}else if(chance(.4)){await eHit(f,.6,'Cold hands close around your ankles. (# dmg)');if(P.hp>0)await inflict('rooted',2,'It has you.')}else await eHit(f,1,'A sodden fist. (# dmg)');break;
    case'boar':if(e.st.coiled){delete e.st.coiled;await eHit(f,1.8,'It charges, head down! (# dmg)')}else if(chance(.28)){e.st.coiled=1;updBUI();await say('The boar scrapes at the ground and snorts...',1000,true)}else await eHit(f,1,'It gores you with a tusk. (# dmg)');break;
    case'strawman':if(!P.st.blind&&chance(.3)){f.lunge=.3;SFX.caw(.9);await say('Its chest bursts open and crows pour out.');await inflict('blind',2,'They go for your eyes.')}else if(chance(.3))await eHit(f,1.4,'A rusted sickle swings out of the straw. (# dmg)');else await eHit(f,1,'It flails at you with stiff, stuffed arms. (# dmg)');break;
    case'ooze':SFX.squelch();if(!P.st.poison&&chance(.35)){await eHit(f,.7,'It splashes acid across your armour. (# dmg)');if(P.hp>0)await inflict('poison',3,'It keeps burning.')}else await eHit(f,1,'It slams into you, cold and heavy. (# dmg)');break;
    case'elder':
      if(e.st.coiled&&(e.turn%3===0||e.ph>=3)){delete e.st.coiled;await eHit(f,2,'The Elder rips its roots free and brings them down. UPROOT! (# dmg)')}
      else if(e.turn%3===2||(e.ph>=3&&e.turn%2===0)){e.st.coiled=1;f.shake=.6;updBUI();await say('The ground shakes.',1100,true)}
      else{const r=Math.random();
        if(e.hp<e.max*.4&&e.mended<2&&r<.4&&!e.st.burn){e.mended++;const h=18;e.hp=Math.min(e.max,e.hp+h);addNum(f,h,'#8fe08a');SFX.heal();updBUI();await say('Black sap seeps over its wounds. They close.',900)}
        else if(!P.st.wither&&r<.6){B.fx.push({k:'rot',t:0});SFX.dread();await eHit(f,.5,'The bark splits and something inside it whispers to you. (# dmg)');if(P.hp>0)await inflict('wither',3,'Your sword arm goes weak. Withered.')}
        else if(!P.st.rooted&&r<.8){await eHit(f,.7,'Roots erupt beneath you. (# dmg)');if(P.hp>0)await inflict('rooted',2,'They drag at your legs!')}
        else await eHit(f,1,'A bough the size of a man sweeps into you. (# dmg)')}break;
    default:if(FOE_AI[f.kind])await FOE_AI[f.kind](f,e);else await eHit(f,1,'It hits you. (# dmg)')}
  if(e.st.harden&&--e.st.harden<=0)delete e.st.harden;
  updBUI()}
async function tick(){B.src='';
  if(P.regen&&P.hp>0&&P.hp<P.max){const h=Math.min(P.regen,P.max-P.hp);P.hp+=h;addNum('p',h,'#8fe08a');hpLog(h,'Regeneration');updBUI()}
  for(const f of alive()){if(f.st.burn>0){const d=Math.max(3,Math.round(effAtk()*.25));hurtFoe(f,d,'#ff9a3a','Burn',`Your attack\t${Math.round(effAtk())}\nBurning\t×25%\n=\t${d}\n  at least 3, ignores armour`);f.st.burn--;if(!f.st.burn)delete f.st.burn;updBUI();await say(NM(f,`Flames gnaw at the @. (${d} dmg)`),550)}
    if(f.st.bleed>0&&f.hp>0){const d=Math.max(2,Math.round(effAtk()*.2));hurtFoe(f,d,'#d83a3a','Bleed',`Your attack\t${Math.round(effAtk())}\nBleeding\t×20%\n=\t${d}\n  at least 2, ignores armour`);f.st.bleed--;if(!f.st.bleed)delete f.st.bleed;updBUI();await say(NM(f,`The @ bleeds. (${d} dmg)`))}
    if(f.st.poison>0&&f.hp>0){const d=Math.max(2,Math.round(effAtk()*.2));hurtFoe(f,d,'#9ac84a','Poison',`Your attack\t${Math.round(effAtk())}\nPoison\t×20%\n=\t${d}\n  at least 2, ignores armour`);f.st.poison--;if(!f.st.poison)delete f.st.poison;updBUI();await say(NM(f,`Poison works through the @. (${d} dmg)`),550)}
    if(f.kind==='mosstroll'&&f.hp>0&&f.hp<f.max&&!f.st.burn&&!f.st.bleed){const h=Math.min(f.max-f.hp,Math.max(1,Math.round(f.max*.04)));f.hp+=h;addNum(f,h,'#8fe08a');updBUI();await say('The troll\'s wounds close up.',500)}
    for(const k of['cripple','frenzy','vuln','bristle','steady','slow','exposed'])if(f.st[k]&&--f.st[k]<=0)delete f.st[k]}
  for(const k of['fort','unsh'])if(B.pb[k]&&--B.pb[k]<=0)delete B.pb[k];
  await reap();
  if(P.st.burn&&P.hp>0){const d=3+Math.floor(P.lv/2);P.hp-=d;rec('taken',d);addNum('p',d,'#ff9a3a','Burn');clog(`Burn → you: ${d}`,`Base\t3\nHalf your level\t+${Math.floor(P.lv/2)}\n=\t${d}\nHits every turn while you burn.`,'#ff9a3a');updBUI();await say(`You are burning. (${d} dmg)`,650);if(--P.st.burn<=0)delete P.st.burn}
  if(P.st.bleed&&P.hp>0){const d=Math.max(1,Math.round((2+Math.floor(P.lv/3))*(hasT('accept')?.5:1)));P.hp-=d;rec('taken',d);addNum('p',d,'#d83a3a','Bleed');clog(`Bleed → you: ${d}`,`Base\t2\nA third of your level\t+${Math.floor(P.lv/3)}\n=\t${d}\nHits every turn. Only a bandage stops it.`,'#d83a3a');updBUI();await say(`You are bleeding. (${d} dmg)`);if(--P.st.bleed<=0)delete P.st.bleed}
  if(P.st.poison&&P.hp>0){const d=Math.max(1,Math.round((2+Math.floor(P.lv/3))*(hasT('accept')?.5:1)));P.hp-=d;rec('taken',d);addNum('p',d,'#9ac84a','Poison');clog(`Poison → you: ${d}`,`Base\t2\nA third of your level\t+${Math.floor(P.lv/3)}\n=\t${d}\nHits every turn until it runs its course.`,'#9ac84a');B.fx.push({k:'poison',t:0});updBUI();await say(`The bile burns in your veins. (${d} dmg)`,650);if(--P.st.poison<=0)delete P.st.poison}
  for(const k of['dazed','blind','wither'])if(P.st[k]&&--P.st[k]<=0)delete P.st[k];
  if(P.st.rooted&&--P.st.rooted<=0){delete P.st.rooted;await say('The roots loosen their grip.',500)}
  updBUI()}
/* experience is paid once, when the whole fight is won (the bar fills then); doubled across the board in 0.13 */
function xpFor(f){let xp=f.k.xp*(f.xpm||1)*(f.k.boss?1:XP_MAP[curMap()]*(f.unit?1.2:1.6));const xd=(P.lv-ELV(curMap()))/2;if(xd>0)xp*=Math.max(.05,1-.2*xd-.15*xd*(xd-1));
  return Math.max(1,Math.round(2*xp*(1+.05*tr('lowexp')*2+(P.xpb||0))*(EV.blood>0?1.5:1)))}
async function giveXp(n){B.xpGot=(B.xpGot||0)+n;P.xp+=n;addNum('p','+'+n+' XP','#e0b850');updBUI();await sleep(750);
  while(P.xp>=nextXp(P.lv)){P.xp-=nextXp(P.lv);lvlUp();updBUI();await say(lvlMsg(),1100,true)}}
async function reap(){for(const f of B.foes){if(f.hp<=0&&!f.dead&&f.kind==='revenant'&&!f.rose){f.rose=1;f.hp=Math.round(f.max*.4);f.st={};f.shake=.6;SFX.dread();updBUI();await say('It falls. Then it gets back up, and picks up its pick.',1000);continue}
    if(f.hp<=0&&!f.dead){clog(`${f.name} dies.`,'','#c8c8c8');f.dead=true;rec('kills',1);if(f.k.boss)rec('bosses',1);P.rec.kk=P.rec.kk||{};P.rec.kk[f.name]=(P.rec.kk[f.name]||0)+1;f.die=.001;SFX.die();updBUI();await say(NM(f,pick(DIE[f.kind]||['The @ dies.'])),900);
  if(hasT('harvest')){B.harv=Math.min(3,(B.harv||0)+1);const h=Math.min(P.max-P.hp,Math.round(P.max*.03));if(h>0){P.hp+=h;addNum('p',h,'#8fe08a');hpLog(h,'Red Harvest');updBUI()}}}}tgt()}
async function checkEnd(){if(DEV.god)P.hp=P.max;if(DEV.mana)P.mp=P.mmax;
  if(!alive().length){
    /* regeneration still ticks at the end of the turn that wins the fight */
    if(P.regen&&P.hp>0&&P.hp<P.max){const h=Math.min(P.regen,P.max-P.hp);P.hp+=h;addNum('p',h,'#8fe08a');hpLog(h,'Regeneration');updBUI()}
    const xp=B.foes.reduce((a,f)=>a+(f.dead&&!f.paid?xpFor(f):0),0);await giveXp(xp);
    let gold=0;for(const f of B.foes){if(f.paid)continue;const g=GOLD[f.kind];if(g)gold+=Math.round(ri(g[0],g[1])*(f.k.boss?.45:.3*(1+.4*AR.i))*(1+(P.gf||0)))}P.gold+=gold;rec('earned',gold);rec('won',1);
    const loot=[],lost=[],lostI=[];const keep=(id,nm)=>{rec('found',1);if(addItem(id))loot.push(nm);else{lost.push(nm);lostI.push(id)}};if(B.stolen)addItem('potion',B.stolen);
    const tb=tierHere();for(const f of B.foes){if(f.paid)continue;for(let q=0;q<(f.k.boss?2:1);q++)if(chance(f.k.boss?1:(f.unit?.005:.015)*(1+.15*tr('scav')))){const g=genGear(tb+(f.k.boss?1:0),{boss:f.k.boss,min:f.k.boss?3:1});keep(g,iname(g))}
      if(chance(f.k.boss?1:['golem','knight'].includes(f.kind)?.15:f.unit?.01:.03)){const o=oreFor(tb+(f.k.boss?1:0));keep(o,ITEMS[o].n)}}
    if(B.m&&B.m.hunter){const id=hunterPrize();keep(id,iname(id));const g=gemFor(tierHere());keep(g,ITEMS[g].n)}
    if(B.foes.some(f=>f.k.boss)){for(let i=0;i<2;i++){const g=gemFor(Math.min(3,AR.i+1));keep(g,ITEMS[g].n)}}
    let n=0;const sc=1+.15*tr('scav');for(const f of B.foes)if(!f.paid)for(const[id,ch]of(DROPS[f.kind]||[])){if(n>=2)break;if(!chance(ch*sc))continue;if(id in UNIQ&&(owned().has(id)||!chance(uniqGate())))continue;n++;keep(id,ITEMS[id].n)}
    const parts=[`${xp} XP`];if(gold)parts.push(`${gold} gold`);if(B.stolen)parts.push('your stolen potion');parts.push(...loot);
    SFX.coin();clog(`Won against ${B.m&&KINDS[B.m.kind]?KINDS[B.m.kind].name:'them'}: ${listJoin(parts)}`,lost.length?`Left on the ground (bag full): ${listJoin(lost)}`:'','#c9a24b','','world');await say('Victory. You gain '+listJoin(parts)+'.'+(lost.length?` Your bag is full, so ${listJoin(lost)} ${lost.length>1?'are':'is'} left on the ground.`:''),900,true);B.lostI=lostI;
    if(P.blessed>0)P.blessed--;
    endBattle('won');return true}
  if(P.hp<=0){P.hp=0;updBUI();SFX.fall();await say('You fall to your knees on the cold ground and everything goes dark.',1400,true);endBattle('dead');return true}
  return false}
function endBattle(res){const m=B.m;B.over=true;MUS.stop();setActs(false);
  transition(()=>{scene='world';setUI('world');AU.setAmb(1);
    if(res==='won'&&B.lostI&&B.lostI.length)dropPile(B.lostI,m.x,m.y);
    if(res==='won'){const mi=mobs.indexOf(m);if(mi>=0)mobs.splice(mi,1);if(m.sp)m.sp.dead=1;if(m.boss){AR.bossDead=true;if(m.sp){m.sp.perm=1;m.sp.dead=0}for(let i=0;i<MW*MH;i++)if(map[i]===BARRIER)map[i]=G;if(AR.def.next!=null)setTimeout(()=>notice('Somewhere behind the clearing, something that was holding shut lets go.'),1300)}}
    if(res==='fled')rec('fled',1);if(res==='dead')rec('deaths',1);
    if(res==='won'&&m.hunter){AR.hunter.done=1;setTimeout(()=>amb('Nothing is following you any more.',3600),1400)}
    if(res==='fled'&&m.hunter){m.stun=3;P.inv=2.2}else if(res==='fled'){m.stun=2.5;m.hunt=0;m.alert=0;m.bored=2;P.inv=1.8;if(m.kind==='ent'||m.kind==='elder')m.stun=3}
    if(res!=='dead'){for(const k of['dazed','rooted'])delete P.st[k];P.guard=false;if(P.sharp>0)P.sharp--}
    B=null;resize();if(typeof statsOn==='function'&&statsOn())renderStats();$('#clog').classList.remove('on');if(mode==='log')mode='world';
    if(res==='dead'){clog(`You died. ${m&&KINDS[m.kind]?KINDS[m.kind].name:'Something'} killed you.`,'','#ff6a5a','','every');mode='dead';if(DIFF.hc)deleteSave();$('#rise').textContent=DIFF.hc?'BEGIN AGAIN':'GET UP';$('#deadp').textContent=pick(DEATHP);$('#dstat').textContent=`Level ${P.lv} · ${AR.def.name}, ${LV.kind==='zone'?LV.name:AR.def.zones[LV.parent]}`;$('#dead').style.display='flex'}
    else if(res==='won'&&m.boss&&AR.def.next==null){if(DIFF.hc){mode='world';P.inv=99;setTimeout(secretEnd,900)}else{mode='win';$('#win').style.display='flex'}}
    else{mode='world';P.inv=Math.max(P.inv,1)}})}

function makeBG(){const c=cvs(W,H),x=c.getContext('2d'),type=LV.type,boss=B&&B.foes.some(f=>f.k.boss),r=mulberry(5+AR.i),n=B?B.foes.length:1,red=boss&&type!=='plains'||EV.blood>0;
  const SKY={woods:['#04070a',red?'#1a0f0c':'#0e1815','#060a07'],cave:['#020203','#0a0b10','#050608'],swamp:['#060805',red?'#1a100a':'#131a0b','#070905'],plains:[EV.blood>0?'#5a2a2a':'#5a8ec0',EV.blood>0?'#c87a6a':'#bcd6dc','#3e7a34']}[type];
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,SKY[0]);g.addColorStop(.45,SKY[1]);g.addColorStop(1,SKY[2]);x.fillStyle=g;x.fillRect(0,0,W,H);
  const pines=(base,col,hmin,hmax,cnt,dead)=>{x.fillStyle=col;x.strokeStyle=col;for(let i=0;i<cnt;i++){const px=(i/cnt)*W+r()*12-6,h=hmin+r()*(hmax-hmin),w=h*.32;
    if(dead){x.lineWidth=2;x.beginPath();x.moveTo(px,base);x.lineTo(px,base-h);x.stroke();x.lineWidth=1;for(let b=0;b<4;b++){const by=base-h*(.4+b*.15),d=r()<.5?-1:1;x.beginPath();x.moveTo(px,by);x.lineTo(px+d*w*.7,by-h*.15);x.stroke()}continue}
    for(let t=0;t<5;t++){const ty=base-h+t*h/5,tw=w*(t+1)/5;x.beginPath();x.moveTo(px,ty);x.lineTo(px-tw,ty+h/4);x.lineTo(px+tw,ty+h/4);x.fill()}x.fillRect(px-1,base-h*.2,2,h*.2)}};
  let ground='#0a120d',specks=['#101b13','#14221a','#0c150f','#1b2b1c'],plat=['#050906','#16241a','#1f3323'];
  if(type==='plains'){const sx=W*.8,sy=H*.12,sg=x.createRadialGradient(sx,sy,0,sx,sy,50);sg.addColorStop(0,'rgba(255,250,220,.9)');sg.addColorStop(.2,'rgba(255,240,200,.4)');sg.addColorStop(1,'rgba(255,240,200,0)');x.fillStyle=sg;x.fillRect(0,0,W,H);
    x.fillStyle='#fff8e0';x.beginPath();x.arc(sx,sy,8,0,7);x.fill();
    x.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<4;i++){const cx=r()*W,cy=H*(.08+r()*.2);x.beginPath();x.ellipse(cx,cy,18+r()*14,4,0,0,7);x.fill()}
    x.fillStyle='#6a9a5a';x.beginPath();x.ellipse(W*.2,H*.6,W*.5,H*.14,0,0,7);x.fill();x.fillStyle='#5a8a4a';x.beginPath();x.ellipse(W*.85,H*.62,W*.45,H*.12,0,0,7);x.fill();
    for(let i=0;i<6;i++){const tx=r()*W,ty=H*.5+r()*H*.06,s=6+r()*6;x.fillStyle='#4a3420';x.fillRect(tx-1,ty,2,s*.8);x.fillStyle=pick(['#2e6a2a','#3a7a30','#2a5a26']);x.beginPath();x.arc(tx,ty,s,0,7);x.fill()}
    ground='#4a8a3a';specks=['#5a9a46','#3e7a32','#6aaa52','#e84a4a','#f0d84a','#f4f4f4'];plat=['#2a5a24','#5a9a46','#6aaa52']}
  else if(type==='cave'){x.fillStyle='#101116';for(let i=0;i<14;i++){const px=r()*W,w=6+r()*14,h=H*(.08+r()*.22);x.beginPath();x.moveTo(px-w/2,0);x.lineTo(px+w/2,0);x.lineTo(px,h);x.fill()}
    x.fillStyle='#0c0d12';for(let i=0;i<10;i++){x.beginPath();x.ellipse(r()*W,H*.5,20+r()*30,H*.12+r()*H*.1,0,0,7);x.fill()}
    for(let i=0;i<10;i++){const cx=r()*W,cy=H*(.3+r()*.25);const cg=x.createRadialGradient(cx,cy,0,cx,cy,10);cg.addColorStop(0,'rgba(110,190,240,.4)');cg.addColorStop(1,'rgba(110,190,240,0)');x.fillStyle=cg;x.fillRect(cx-10,cy-10,20,20);x.fillStyle='#bfeaff';x.fillRect(cx|0,cy|0,1,2)}
    ground='#16141a';specks=['#22202a','#1a1820','#2a2730','#0e0d12'];plat=['#08080a','#24222a','#2e2c34']}
  else{const mx=W*.58,my=H*.11,mg=x.createRadialGradient(mx,my,0,mx,my,40);mg.addColorStop(0,red?'rgba(200,80,50,.35)':'rgba(200,200,170,.25)');mg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=mg;x.fillRect(0,0,W,H);
    x.fillStyle=red?'#b8573a':type==='swamp'?'#b8b88a':'#c9c6a8';x.beginPath();x.arc(mx,my,9,0,7);x.fill();x.fillStyle='rgba(5,8,10,.85)';x.fillRect(mx-24,my+2,50,3);x.fillRect(mx-14,my-5,22,2);
    pines(H*.5,type==='swamp'?'#10160c':'#0b1512',H*.18,H*.32,14,type==='swamp');
    const mist=x.createLinearGradient(0,H*.38,0,H*.56);mist.addColorStop(0,'rgba(120,140,130,0)');mist.addColorStop(.6,`rgba(120,140,130,${type==='swamp'?.24:.14})`);mist.addColorStop(1,'rgba(120,140,130,0)');x.fillStyle=mist;x.fillRect(0,H*.38,W,H*.2);
    pines(H*.6,type==='swamp'?'#090c06':'#060c09',H*.22,H*.4,8,type==='swamp');
    if(type==='swamp'){ground='#10160a';specks=['#18200e','#141c0c','#1e2810','#2a3a1a'];plat=['#060805','#1e2810','#2a3818']}}
  x.fillStyle=ground;x.fillRect(0,H*.58,W,H*.42);
  if(type==='swamp'){x.fillStyle='#0c1a14';x.fillRect(0,H*.6,W,H*.05);x.fillStyle='rgba(150,180,160,.15)';for(let i=0;i<20;i++)x.fillRect(r()*W|0,H*.6+r()*H*.05|0,4,1)}
  for(let i=0;i<500;i++){x.fillStyle=pick(specks);x.fillRect(r()*W|0,H*.58+r()*H*.42|0,1,r()<.3?2:1)}
  const pl=(cx,cy,rx,ry)=>{x.fillStyle=plat[0];x.beginPath();x.ellipse(cx,cy+1,rx+1,ry+1,0,0,7);x.fill();x.fillStyle=plat[1];x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,7);x.fill();x.fillStyle=plat[2];x.beginPath();x.ellipse(cx-rx*.15,cy-ry*.3,rx*.7,ry*.5,0,0,7);x.fill()};
  pl(n>1?W*.66:W*.69,H*FY(),n>1?W*.32:W*.22,n>1?8:6);pl(W*.27,H*.86,W*.25,7);return c}
const BSZ={shroom:.16,bat:.13,mosquito:.13,bear:.22,imp:.17,stag:.21,crawler:.15,leech:.12,spider:.17,boar:.19,ghoul:.22,drowned:.25,strawman:.27};
/* a boss never moves or shrinks: it keeps its solo spot and size, and anything it calls in stands at its feet, one each side, in front of it */
/* sizes come from the screen's SHORT side (scaled to what a portrait phone's height would be), so a creature or the knight is the same size on screen
   whichever way the phone is held. In landscape there is less height, so they are only capped if they would not fit. FY: where the foes stand. */
const refH=()=>VIEW_B*1.6,FY=()=>W>H?.52:.44;
function foeScale(f,img,many){const vk=f.vk||f.kind,bz=BSZ[vk]||BSZ[f.kind];let sc=clamp(Math.floor(refH()*(f.k.boss?.36:bz||.27)/img.height),2,f.k.boss?7:bz?4:6);sc=Math.min(sc,Math.max(2,Math.floor(H*(f.k.boss?.56:.46)/img.height)));if(many&&!f.k.boss)sc=Math.min(sc,Math.max(2,Math.floor(W*.2/img.width)));return sc}
function foeSlots(){const n=B.foes.length,bs=B.foes[0]&&B.foes[0].k.boss&&n>1;
  if(bs){const b=B.foes[0],bi=(SPR[b.vk||b.kind]||SPR[b.kind])[0],bw=bi.width*foeScale(b,bi,true),cx=W*.69;
    return B.foes.map((f,i)=>{if(i===0)return{cx,cy:H*FY()};const side=n===2?-1:i===1?-1:1,ai=(SPR[f.vk||f.kind]||SPR[f.kind])[0],aw=ai.width*foeScale(f,ai,true);return{cx:clamp(cx+side*Math.max(bw*.5,aw*.8),Math.max(W*.4,aw/2+4),W-aw/2-4),cy:H*(FY()+.06)}})}
  return B.foes.map((f,i)=>({cx:W*(n===1?.69:n===2?.53+i*.27:(W>H*1.15?.48+i*.19:.39+i*.22)),cy:H*(FY()+(n===3&&i===1?.035:0))}))}
function drawBattle(dt){if(!B){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);return}
  const shk=B.shake>0?B.shake*14:0;ctx.save();if(shk)ctx.translate((Math.random()-.5)*shk,(Math.random()-.5)*shk);
  if(!BG)BG=makeBG();if(shk){ctx.fillStyle='#000';ctx.fillRect(-20,-20,W+40,H+40)}ctx.drawImage(BG,0,0);
  for(const k of['pShake','pFlash','pLunge'])B[k]=Math.max(0,B[k]-dt);if(B.eIn>0)B.eIn=Math.max(0,B.eIn-dt*1.8);
  const slots=foeSlots(),many=B.foes.length>1;
  B.foes.forEach((f,i)=>{f.shake=Math.max(0,f.shake-dt);f.flash=Math.max(0,f.flash-dt);f.lunge=Math.max(0,f.lunge-dt);if(f.die>0)f.die+=dt;
    const vk=f.vk||f.kind,set=SPR[vk]||SPR[f.kind],img=set[0],bz=BSZ[vk]||BSZ[f.kind];let sc=foeScale(f,img,many);
    const ew=img.width*sc,eh=img.height*sc;let ex=slots[i].cx-ew/2,ey=slots[i].cy-eh+3+Math.round(Math.sin(time*2.5+i)*1.5);
    if(f.kind==='bat')ey-=H*.06+Math.sin(time*4)*3;
    ex+=B.eIn*W*.6;ex+=f.shake>0?(Math.random()-.5)*6:0;ex-=Math.sin(f.lunge/.35*Math.PI)*14;ey+=Math.sin(f.lunge/.35*Math.PI)*8;if(f.st.coiled)ex+=(Math.random()-.5)*2;
    f.box={x:ex,y:ey,w:ew,h:eh};f.pos={x:ex+ew/2,y:ey+eh/2};
    if(f.die<1.2){ctx.globalAlpha=f.die?Math.max(0,1-f.die/1.1):1;
      if(f.kind==='slime'){const s=1+Math.sin(time*4)*.06;ctx.drawImage(img,Math.round(ex-(ew*s-ew)/2),Math.round(ey+eh-eh/s),Math.round(ew*s),Math.round(eh/s))}
      else ctx.drawImage(img,Math.round(ex),Math.round(ey+(f.die?f.die*12:0)),ew,eh);
      if(f.flash>0&&Math.floor(f.flash*30)%2)ctx.drawImage(set.white,Math.round(ex),Math.round(ey),ew,eh);ctx.globalAlpha=1}
    if(many&&i===B.tgt&&!f.dead&&!B.busy){const bx=Math.round(f.pos.x),by=Math.round(ey-6+Math.sin(time*5)*2);ctx.fillStyle='#d8a24a';ctx.fillRect(bx-3,by,7,1);ctx.fillRect(bx-2,by+1,5,1);ctx.fillRect(bx-1,by+2,3,1);ctx.fillRect(bx,by+3,1,1)}});
  const ps=Math.min(clamp(Math.floor(refH()*.24/16),2,5),Math.max(2,Math.floor(H*.45/16))),pw=12*ps,ph=16*ps;let px=W*.27-pw/2,py=H*.86-ph+2;
  px+=Math.sin(B.pLunge/.3*Math.PI)*16;py-=Math.sin(B.pLunge/.3*Math.PI)*8;px+=B.pShake>0?(Math.random()-.5)*6:0;
  ctx.drawImage(KNW.up[0],Math.round(px-KPAD*ps),Math.round(py-KPAD*ps),(12+KPAD*2)*ps,(16+KPAD*2)*ps);
  if(P.guard){ctx.fillStyle='rgba(120,170,220,.22)';ctx.beginPath();ctx.ellipse(px+pw/2,py+ph/2,pw*.7,ph*.6,0,0,7);ctx.fill()}
  if(B.pFlash>0&&Math.floor(B.pFlash*30)%2){ctx.globalCompositeOperation='source-atop';ctx.fillStyle='rgba(255,60,40,.6)';ctx.fillRect(px,py,pw,ph);ctx.globalCompositeOperation='source-over'}
  B.pPos={x:px+pw/2,y:py+ph/2};
  if(P.st.dazed||P.st.blind){for(let i=0;i<3;i++){const a=time*4+i*2.1;ctx.fillStyle=P.st.blind?'#6a5a3a':'#e8d36a';ctx.fillRect(Math.round(px+pw/2+Math.cos(a)*pw*.35),Math.round(py+4+Math.sin(a)*3),2,2)}}
  if(P.st.rooted){ctx.strokeStyle='#3a291c';ctx.lineWidth=2;for(let i=0;i<4;i++){const bx=px+pw*(.15+i*.23);ctx.beginPath();ctx.moveTo(bx,py+ph+2);ctx.quadraticCurveTo(bx+6*Math.sin(i+time),py+ph*.75,bx+3,py+ph*.62);ctx.stroke()}}
  if(P.st.wither){ctx.fillStyle='rgba(160,112,200,.18)';ctx.fillRect(px,py,pw,ph)}
  for(const f of B.fx){f.t+=dt;const e=f.f&&f.f.pos||{x:W*.69,y:H*.3},p=B.pPos;
    if(f.k==='slash'){const pr=f.t/.3;if(pr>1)continue;ctx.strokeStyle=f.big?`rgba(255,230,140,${1-pr})`:`rgba(240,245,250,${1-pr})`;ctx.lineWidth=f.big?3:2;for(let i=0;i<3;i++){const o=(i-1)*8;ctx.beginPath();ctx.moveTo(e.x-18+o,e.y-18+pr*8);ctx.lineTo(e.x+16+o,e.y+16+pr*8);ctx.stroke()}}
    if(f.k==='smite'){const pr=f.t/.8;if(pr>1)continue;const w=18*(1-Math.abs(pr-.4)),gg=ctx.createLinearGradient(0,0,0,e.y+30);gg.addColorStop(0,'rgba(255,220,120,0)');gg.addColorStop(1,`rgba(255,220,120,${.8*(1-pr)})`);
      ctx.fillStyle=gg;ctx.fillRect(e.x-w/2,0,w,e.y+30);ctx.fillStyle=`rgba(255,250,220,${1-pr})`;ctx.fillRect(e.x-w/6,0,w/3,e.y+30);
      if(Math.random()<.6)B.fx.push({k:'spark',t:0,x:e.x+(Math.random()-.5)*30,y:e.y+(Math.random()-.5)*30,vx:(Math.random()-.5)*40,vy:-30-Math.random()*30,c:pick(['#ffd75e','#ff9a3a','#fff4c0'])})}
    if(f.k==='spark'){if(f.t>.7)continue;f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=60*dt;ctx.fillStyle=f.c;ctx.globalAlpha=1-f.t/.7;ctx.fillRect(f.x|0,f.y|0,2,2);ctx.globalAlpha=1}
    if(f.k==='heal'){if(f.t>1)continue;for(let i=0;i<8;i++){ctx.fillStyle=`rgba(140,230,130,${1-f.t})`;ctx.fillRect(p.x-14+i*4,p.y+10-f.t*40-(i%3)*6,2,2)}}
    if(f.k==='poison'){if(f.t>.9)continue;for(let i=0;i<6;i++){ctx.fillStyle=`rgba(150,190,60,${1-f.t})`;ctx.fillRect(p.x-12+i*5,p.y+8-f.t*30-(i%2)*8,2,2)}}
    if(f.k==='rot'){if(f.t>1.2)continue;for(let i=0;i<16;i++){const a=i*.7+f.t*3,rr=30-f.t*20;ctx.fillStyle=`rgba(160,112,200,${(1.2-f.t)*.7})`;ctx.fillRect(p.x+Math.cos(a)*rr|0,p.y+Math.sin(a)*rr*.6|0,2,2)}}
    if(f.k==='hit')drawHitFx(f,e);
    if(f.k.startsWith('fa_'))drawFoeAtkFx(f,e,p);
    if(f.k==='guardflash'){if(f.t>.35)continue;ctx.strokeStyle=`rgba(160,200,255,${1-f.t/.35})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x+14,p.y-4,14+f.t*30,-1.2,1.2);ctx.stroke()}
    if(f.k==='blockspark'){if(f.t>.4)continue;for(let i=0;i<10;i++){const a=i*.63,r=6+f.t*50;ctx.fillStyle=`rgba(255,230,150,${1-f.t/.4})`;ctx.fillRect(p.x+16+Math.cos(a)*r|0,p.y-6+Math.sin(a)*r|0,2,2)}}
    if(f.k==='ring'){if(f.t>.8)continue;ctx.strokeStyle=f.c.replace('A',String(1-f.t/.8));ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(f.x,f.y,10+f.t*80,(10+f.t*80)*.35,0,0,7);ctx.stroke()}
    if(f.k==='spore'||f.k==='dirt'){if(f.t>1)continue;const col=f.k==='spore'?'rgba(200,190,110,':'rgba(90,70,45,';for(let i=0;i<14;i++){const a=i*.9+f.t*2,rr=8+f.t*22;ctx.fillStyle=col+(1-f.t)*.8+')';ctx.fillRect(p.x+Math.cos(a)*rr|0,p.y-10+Math.sin(a)*rr*.6|0,2,2)}}}
  drawFoeStatusFx(dt);ctx.restore();
  B.fx=B.fx.filter(f=>f.t<1.3);
  ctx.font=FT_FONT(9.5);ctx.textAlign='center';
  for(const n of B.nums){n.t+=dt;if(n.t<0)continue;const o=n.who==='p'?B.pPos:n.who.pos;if(!o)continue;const y=o.y-20-n.k*10-n.t*18;ctx.globalAlpha=clamp(1.7-n.t*1.2,0,1);const tx=(typeof n.v==='number'?(HEALC.has(n.c)?'+'+n.v:''+n.v):n.v)+(n.lab?' '+n.lab:'');otext(tx,o.x,y,n.c,2.6)}
  ctx.globalAlpha=1;B.nums=B.nums.filter(n=>n.t<1.45);
  if(B.qte){const q=B.qte,p=clamp((performance.now()-q.start)/q.dur,0,1.4),o=q.kind==='atk'?(q.f&&q.f.pos):B.pPos;
    if(o){const rr=Math.max(1,9+(1-p)*40);ctx.lineWidth=1;ctx.strokeStyle='rgba(255,255,255,.55)';ctx.beginPath();ctx.arc(o.x,o.y,9,0,7);ctx.stroke();
      ctx.strokeStyle=q.kind==='atk'?'#ffd75e':'#ff5a4a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(o.x,o.y,rr,0,7);ctx.stroke();ctx.lineWidth=1;
      if(q.kind==='def'){ctx.fillStyle='#ff5a4a';ctx.fillRect(Math.round(o.x)-1,Math.round(o.y-30),2,5);ctx.fillRect(Math.round(o.x)-1,Math.round(o.y-23),2,2)}}}
  if(B.qf){B.qf.t+=dt;const q=B.qf,o=q.pos;if(o&&q.t<.9){ctx.globalAlpha=clamp(1.4-q.t*1.6,0,1);ctx.font=FT_FONT(9);ctx.textAlign='center';const tx=q.ok?(q.perf?'PERFECT':q.kind==='atk'?'PRECISE':'PARRY'):(q.early?'too soon':'');
      if(tx){otext(tx,o.x,o.y-24-q.t*10,q.ok?(q.kind==='atk'?'#ffd75e':'#9fdcff'):'#8a8670')}
      if(q.ok&&q.t<.15){ctx.strokeStyle=q.kind==='atk'?'#fff4c0':'#d8f4ff';ctx.beginPath();ctx.arc(o.x,o.y,9+q.t*120,0,7);ctx.stroke()}ctx.globalAlpha=1}else if(q.t>=.9)B.qf=null}
  const boss=B.foes.find(f=>f.k.boss&&!f.dead);if(boss&&boss.st.coiled){ctx.fillStyle=`rgba(120,20,10,${.12+Math.sin(time*8)*.06})`;ctx.fillRect(0,0,W,H)}
  ctx.drawImage(getVig(),0,0)}
cv.addEventListener('pointerdown',e=>{if(scene!=='battle'||!B)return;if(!B.qte&&(typing||msgSkip)){msgTap();return}const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;
  B.foes.forEach((f,i)=>{if(!f.dead&&f.box&&x>=f.box.x-4&&x<=f.box.x+f.box.w+4&&y>=f.box.y-4&&y<=f.box.y+f.box.h+4){B.tgt=i;updBUI()}})});
