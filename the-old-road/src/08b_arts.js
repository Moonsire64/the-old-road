/* ================= WEAPON ARTS & FOE PROFILES =================
   Each weapon type has three arts besides the plain Slash. They cost nothing but damage:
   the more an art does besides hurting, the less it hurts. Some cost MP, one costs blood, one takes two turns.
   Foes have a type, a level, armour, dodge, parry, block and resistances, and weapons care about all of it. */
const WT_ICON={axe:'axe',knife:'dagger',maul:'hammer',scythe:'scythe',spear:'spear',great:'great',flail:'flail',halberd:'halberd'};
const WT_NAME={sword:'Sword',axe:'Axe',mace:'Mace',spear:'Spear',dagger:'Dagger',great:'Greatsword',hammer:'Hammer',scythe:'Scythe',flail:'Flail',halberd:'Halberd'};
function wTypeOf(it){if(!it)return'sword';return it.wt||WT_ICON[it.icon]||'sword'}
function wType(){return wTypeOf(P.eq.weapon&&ITEMS[P.eq.weapon])}
/* type, dodge, parry, block, resistances (bleed, poison, stun, burn, debuff): 1 = immune */
const FP={
  bat:['beast',.25,0,0,{stun:.2}],mosquito:['vermin',.25,0,0,{poison:.5}],
  slime:['ooze',0,0,0,{bleed:1,poison:.75,stun:.5}],ooze:['ooze',0,0,0,{bleed:1,poison:1,stun:.5}],
  shroom:['plant',0,0,0,{bleed:1,poison:1,stun:.25}],ent:['plant',0,0,0,{bleed:1,poison:.5,stun:.4}],
  golem:['construct',0,0,0,{bleed:1,poison:1,stun:.5,debuff:.25}],strawman:['construct',.05,0,0,{bleed:1,poison:1,stun:.2}],
  bear:['beast',0,0,0,{stun:.3}],wolf:['beast',.1,0,0,{}],stag:['beast',.12,0,0,{stun:.2}],boar:['beast',.05,0,0,{stun:.3}],
  brigand:['humanoid',.08,.12,0,{}],vagrant:['humanoid',.06,.06,0,{}],knight:['humanoid',0,.12,.25,{bleed:.3,stun:.4}],
  imp:['fiend',.15,0,0,{burn:1}],spider:['vermin',.1,0,0,{poison:1}],crawler:['vermin',0,0,.2,{poison:.5,stun:.3}],leech:['vermin',.05,0,0,{bleed:.5,poison:.5}],
  ghoul:['undead',.08,0,0,{bleed:.75,poison:1}],drowned:['undead',0,0,0,{bleed:1,poison:1,stun:.2}],
  elder:['plant',0,0,0,{bleed:1,poison:.5,stun:.7,debuff:.3}],colossus:['construct',0,0,.15,{bleed:1,poison:1,stun:.7,debuff:.3}],
  rotmother:['plant',0,0,0,{bleed:.5,poison:1,stun:.7,debuff:.3}],harrow:['humanoid',.05,.15,.2,{bleed:.3,stun:.6,debuff:.3}]};
const TYPE_N={beast:'Beast',vermin:'Vermin',ooze:'Ooze',plant:'Plant',construct:'Construct',humanoid:'Humanoid',fiend:'Fiend',undead:'Undead'};
/* how each weapon fares against each kind of thing */
const WVT={sword:{humanoid:1.1},axe:{plant:1.25,beast:1.1},mace:{undead:1.25,construct:1.25,ooze:.8},spear:{beast:1.25,fiend:1.1},
  dagger:{humanoid:1.15,construct:.8},great:{construct:1.1,undead:1.1},flail:{undead:1.15,humanoid:1.1,ooze:.85},halberd:{beast:1.15,humanoid:1.15},hammer:{construct:1.3,vermin:1.15,ooze:.8},scythe:{plant:1.25,vermin:1.15,humanoid:1.05}};
const WTRAIT={sword:'Your Measured Cut always lands: foes can\'t dodge or parry it.',axe:'Foes can\'t block your hits with a shield.',mace:'Your hits ignore 2 extra points of armour, and still do 80% damage when blocked.',
  spear:'Foes are half as likely to dodge you.',dagger:'+25% damage against bleeding or poisoned foes, and +10% crit chance against people.',
  great:'Your hits still do 80% damage when blocked.',flail:'Shields don\'t help against it: a blocked hit still does full damage. Foes can\'t parry it either.',halberd:'Reach and weight: it goes first more often, and bites through a little armour.',hammer:'Your hits still do 80% damage when blocked.',scythe:'Some of its attacks hit every foe at once.'};
function foeProfile(f){const p=FP[f.kind]||['beast',0,0,0,{}];f.type=p[0];f.dodge=p[1]+(f.roleDodge||0);f.parry=p[2];f.block=p[3];f.res=p[4];
  f.lv=ELV(curMap())+(f.k.boss?4:0)}
const lvGap=f=>(f.lv||P.lv)-P.lv;
const lvMiss=f=>clamp(.015*lvGap(f),0,.25);
/* accuracy: each weapon has its own, each art adjusts it. Chance to hit = accuracy − foe dodge − level penalty */
const WACC={sword:.95,axe:.88,mace:.88,spear:.92,dagger:.97,great:.85,hammer:.82,scythe:.86,flail:.86,halberd:.86};
const ACCM={lash:-.04,pullhook:-.05,flurry:.05,envenom:.03,hilt:.05,headsman:-.1,concuss:-.05,sweep:-.08,reap:-.08,quake:-.1,sunder:-.05,bloodharvest:-.08};
const pAcc=(m=0)=>WACC[wType()]+(P.acc||0)+m;
const effDodge=(f,nd)=>nd?0:f.dodge*(wType()==='spear'?.5:1);
const hitChance=(f,m=0,nd)=>clamp(pAcc(m)-effDodge(f,nd)-lvMiss(f),.05,1);
/* you have the same defences the creatures do: dodge, parry, block, resistances */
const WPARRY={sword:.08,dagger:.06,great:.06,spear:.05,axe:.04,mace:.03,scythe:.03,hammer:.02,flail:.02,halberd:.07};
const pParry=()=>(WPARRY[wType()]||.04)+(P.parry||0);
const shieldDef=()=>{const s=P.eq.shield&&ITEMS[P.eq.shield];return s?(s.st&&s.st.def)||1:0};
const pBlock=()=>{if(!P.eq.shield)return 0;return Math.min(.5,(.1+.025*shieldDef())*(P.guard?2:1)+(P.block||0))};
const helmDef=()=>{const h=P.eq.helm&&ITEMS[P.eq.helm];return h?(h.st&&h.st.def)||0:0};
function pRes(){const a=P.rAll||0;return{bleed:Math.min(.5,P.def*.012+(P.rBleed||0)+a),poison:P.poisonImm?1:Math.min(.6,(P.rPoison||0)+a),stun:Math.min(.5,helmDef()*.04+(P.rStun||0)+a),burn:Math.min(.6,(P.rBurn||0)+a),debuff:Math.min(.5,(P.rDebuff||0)+a)}}
const PRESK={poison:'poison',bleed:'bleed',burn:'burn',dazed:'stun',rooted:'debuff',blind:'debuff',wither:'debuff'};
const pDodge=()=>Math.max(0,(P.dodge||0)+(B&&B.pb&&B.pb.dgU>=B.rnd?.25:0)-(P.st.rooted?.05:0));
async function ripCounter(f){if(P.hp>0&&f.hp>0&&B.pb.ward==='riposte'){delete B.pb.ward;updBUI();say('You answer it.',500,'auto');await sleep(250);await strike(f,.4,true,{noproc:1,src:'Riposte'})}}
const lvFoeMult=f=>{const g=lvGap(f);return g>0?Math.min(1.4,1+.025*g):Math.max(.85,1+.015*g)};
function wtMult(f,wt){let m=(WVT[wt]||{})[f.type]||1;if(wt==='dagger'&&(f.st.bleed||f.st.poison))m*=1.25;const g=-lvGap(f);if(g>0)m*=1+.03*Math.min(5,g);return m}
const RESK={bleed:'bleed',poison:'poison',stag:'stun',burn:'burn',cripple:'debuff',vuln:'debuff',shred:'debuff',slow:'debuff',exposed:'debuff'};
const RES_N={bleed:'Bleed',poison:'Poison',stun:'Stun',burn:'Burn',debuff:'Weaken / Shred'};
/* try to put a status on a foe; its resistances get a say */
const STN2={stag:'Stunned',cripple:'Weakened',vuln:'Vulnerable',shred:'Shredded',bleed:'Bleeding',poison:'Poisoned',burn:'Burning',slow:'Slowed',exposed:'Exposed'};
function foeSt(f,k,turns){if(!f||f.hp<=0)return false;const nm=STN2[k]||k;if(k==='stag'&&f.st.steady){addNum(f,'STEADY','#a8a8a0','');clog(`${f.name} can't be stunned yet`,'It was stunned very recently and is Steadied for a turn or two.','#a8a8a0');return false}const r=(f.res||{})[RESK[k]]||0;
  if(r>=1){addNum(f,'IMMUNE','#a8a8a0','');clog(`${f.name} is immune to ${nm}`,`${TYPE_N[f.type]||'It'}s like this cannot be ${nm.toLowerCase()}. (${RES_N[RESK[k]]} resistance: immune.)`,'#a8a8a0');return false}if(chance(r)){addNum(f,'RESIST','#a8a8a0','');clog(`${f.name} resists ${nm}`,`Its ${RES_N[RESK[k]].toLowerCase()} resistance\t${P100(r)}`,'#a8a8a0');return false}
  addNum(f,nm.toUpperCase(),'#e0c07a','');clog(`${f.name} is ${nm}${k==='shred'?` (×${Math.min(5,(f.st.shred||0)+turns)})`:k==='stag'?'':` (${turns} turns)`}`,(STATUS[k]||{}).tip+(r?` It resisted ${P100(r)} of the time, but not this time.`:''),'#e0c07a');
  if(k==='shred')f.st.shred=Math.min(5,(f.st.shred||0)+turns);else f.st[k]=Math.max(f.st[k]||0,turns);return true}
function foeTip(f){const g=lvGap(f),wt=wType(),m=(WVT[wt]||{})[f.type]||1,kn=P.known&&(P.known[f.ek||f.kind]||(!f.ek||f.ek===f.kind)&&P.known[f.kind]);
  let t=`<b>${f.name}</b><span class='r'>Level ${f.lv} ${TYPE_N[f.type]||''}${g>0?` · ${g} above you`:g<0?` · ${-g} below you`:''}</span>`;
  const fr=(n,v,c)=>`<span class='wr'><span>${n}</span><em${c?` style='color:${c}'`:''}>${v}</em></span>`;
  if(!kn)return t+`<span class='fx' style='color:#8a8670'>Study it to learn more about it.</span>`;
  t+=fr('Armour',f.def)+(f.st.shred?`<span class='ws'>−${2*f.st.shred} shredded</span>`:'')+fr('Speed',f.ini)+fr('Your chance to hit',Math.round(hitChance(f)*100)+'%')+`<span class='ws'>with a Slash</span>`;
  if(m!==1)t+=fr(`Your ${WT_NAME[wt].toLowerCase()} vs ${(TYPE_N[f.type]||'').toLowerCase()}s`,`${m>1?'+':''}${Math.round((m-1)*100)}%`,m>1?'#8fe08a':'#e08a7a');
  if(g>0)t+=`<span class='wh'>It is ${g} level${g>1?'s':''} above you</span>`+fr('Your misses',`+${Math.round(lvMiss(f)*100)}%`,'#e08a7a')+fr('Its damage',`+${Math.round((lvFoeMult(f)-1)*100)}%`,'#e08a7a');
  {const d=[];if(f.dodge)d.push(`Dodge ${Math.round(f.dodge*100)}%`);if(f.parry)d.push(`Parry ${Math.round(f.parry*100)}%`);if(f.block)d.push(`Block ${Math.round(f.block*100)}%`);
    t+=`<span class='wh'>Defences</span>`+(d.length?d.map(x=>{const i=x.lastIndexOf(' ');return fr(x.slice(0,i),x.slice(i+1))}).join(''):`<span class='ws'>Does not dodge, parry or block.</span>`);
    const rs=Object.keys(RES_N).filter(k=>f.res[k]);t+=`<span class='wh'>Resistances</span>`+(rs.length?rs.map(k=>fr(RES_N[k],f.res[k]>=1?'immune':Math.round(f.res[k]*100)+'%')).join(''):`<span class='ws'>None</span>`)}
  return t}
const ARTS={
  sword:[
    {id:'riposte',n:'Riposte Stance',c:{},tip:'A 40% cut. Until the end of next round your dodge is 25% higher, and the first attack aimed at you is answered with another 40% cut, whether it lands or not. Neither cut causes bleeding, stuns or other effects.'},
    {id:'measured',n:'Measured Cut',c:{},tip:'60% damage, but it cannot be dodged, parried or blocked. The target becomes Vulnerable for 2 turns: it takes 25% more damage.'},
    {id:'hilt',n:'Hilt Prayer',c:{mp:2},tip:'40% damage with the pommel. Clears one affliction from you and leaves you Kindled: your next skill is 50% stronger.'}],
  axe:[
    {id:'hew',n:'Hew',c:{},tip:'75% damage and a stack of Shred: −2 armour and +6% damage taken per stack, up to 5, for the whole fight. Best early, against armour.'},
    {id:'hook',n:'Hook the Guard',c:{},tip:'Hook the beard of the axe over its shield or arm and drag it aside. 45% damage. Ends any shield wall or hardening, and for 2 turns it cannot block or parry (Exposed).'},
    {id:'headsman',n:"Headsman's Stroke",c:{},pri:-1,tip:'Goes last. 90% damage, but 220% against a foe under 35% health.'}],
  mace:[
    {id:'crush',n:'Crush',c:{},tip:'80% damage that ignores armour entirely. Worse than a Slash against soft things, far better against plate and stone.'},
    {id:'concuss',n:'Concuss',c:{},tip:'40% damage and a 50% chance the target loses its next turn, before its stun resistance.'},
    {id:'bulwark',n:'Bulwark',c:{mp:2},pri:1,tip:'Goes first. 40% damage from behind your shield, and you are Fortified for 3 turns: you take 30% less damage.'}],
  spear:[
    {id:'lunge',n:'Lunge',c:{},pri:1,tip:'Goes first. 75% damage.'},
    {id:'setspear',n:'Set Spear',c:{},pri:1,tip:'Goes first. Plant the butt and lower the point, as against a cavalry charge. No blow of your own. Until the round ends you take 25% less damage and anything that hits you is struck back at 60%. Against a charge or any other wound-up attack, it is far better: half damage, and the counter lands at 150%.'},
    {id:'skewer',n:'Skewer',c:{},tip:'70% to the target and 45% to everything behind it. Cannot be dodged.'}],
  dagger:[
    {id:'flurry',n:'Flurry',c:{mp:2},tip:'Four stabs at 22% each. Each rolls its own dodge, parry and block, and each has its own chance to cause Bleeding (25%), Shred (15%), Vulnerable (10%) or Weakened (10%).'},
    {id:'envenom',n:'Envenom',c:{},tip:'A shallow nick with a poisoned edge. 30% damage, then poison for 4 turns that ignores armour. Useless against things that cannot be poisoned.'},
    {id:'shadow',n:'Shadowstep',c:{mp:2},pri:1,tip:'Goes first. No blow of your own. The next attack aimed at you this round misses, and you are Whetted: your next strike is 40% stronger.'}],
  great:[
    {id:'overhead',n:'Overhead Cleave',c:{ch:1},tip:'Takes two turns: heave the blade back, then bring it down for 200%. It cannot be dodged, parried or blocked. You are open while you wind up.'},
    {id:'sweep',n:'Sweep',c:{},tip:'A wide, flat arc through everything in front of you. Every foe takes 50%.'},
    {id:'ironwill',n:'Iron Will',c:{mp:2},pri:1,tip:'Goes first. No blow of your own. Clears every affliction on you, and for 3 turns none can take hold.'}],
  hammer:[
    {id:'sunder',n:'Sunder',c:{},tip:'60% damage and 2 stacks of Shred: −2 armour and +6% damage taken per stack, up to 5, for the whole fight.'},
    {id:'quake',n:'Quake',c:{},pri:-1,tip:'Goes last. Every foe takes 45% and has a 40% chance to lose its next turn, before its stun resistance.'},
    {id:'anvil',n:'Anvil Ring',c:{},tip:'40% damage, struck so the head rings. You regain 1 MP and are Kindled: your next skill is 50% stronger.'}],
  flail:[
    {id:'lash',n:'Round the Shield',c:{},tip:'65% damage, whipped over and round its guard: it cannot be dodged, parried or blocked.'},
    {id:'wrap',n:'Wrap the Chain',c:{},tip:'35% damage. The chain catches a limb: for 2 turns it is Exposed (cannot block or parry) and Slowed.'},
    {id:'whirl2',n:'Whirling Chain',c:{mp:2},tip:'Swing it round your head and let everything have it. Every foe takes 40%, each with a 25% chance to lose its next turn.'}],
  halberd:[
    {id:'chop',n:'Poleaxe Chop',c:{},tip:'90% damage and a stack of Shred: −2 armour and +6% damage taken, for the whole fight.'},
    {id:'keepback',n:'Keep Them Back',c:{},pri:1,tip:'Goes first. 50% damage with the spike, and it is Slowed for 2 turns. This round you take 20% less damage.'},
    {id:'pullhook',n:'Pull Down',c:{},tip:'Hook it with the back of the head and drag. 50% damage and a 60% chance it loses its next turn, before its stun resistance.'}],
  scythe:[
    {id:'reap',n:'Reap',c:{},tip:'A long reaping pull through all of them. Every foe takes 45%. You heal for 20% of all the damage dealt.'},
    {id:'hamstring',n:'Hamstring',c:{},tip:'Hook the blade behind its leg and pull. 45% damage. For 2 turns it is Weakened (deals 30% less) and Slowed (−3 speed, so it tends to act after you).'},
    {id:'bloodharvest',n:'Blood Harvest',c:{hp:.12},tip:'Paid in your own blood. Three swings at 40%, each at a random foe, each with a 35% chance to cause Bleeding.'}]};
const ARTS_S={"riposte": "40% + 40%", "measured": "60% sure", "hilt": "40%", "hew": "75% shred", "hook": "45% expose", "headsman": "90/220%", "crush": "80% pierce", "concuss": "40% stun", "bulwark": "40%", "lunge": "75%", "setspear": "60% counter", "skewer": "70% / 45%", "flurry": "4 × 22%", "envenom": "30% poison", "shadow": "evade", "overhead": "200%", "sweep": "50% all", "ironwill": "cleanse", "sunder": "60% shred", "quake": "45% all", "anvil": "40%", "reap": "45% all", "hamstring": "45% weaken", "bloodharvest": "3 × 40%", "lash": "65% sure", "wrap": "35% expose", "whirl2": "40% all", "chop": "90% shred", "keepback": "50% slow", "pullhook": "50% stun"};
const ARTN={};for(const k in ARTS)for(const a of ARTS[k]){ARTN[a.id]=a;a.s=ARTS_S[a.id]}
function costTxt(a){const c=a.c,p=[];if(c.mp)p.push(c.mp+' MP');if(c.hp)p.push(Math.max(1,Math.round(P.max*c.hp))+' HP');if(c.ch)p.push('2 turns');if(a.pri===1)p.push('first');if(a.pri===-1)p.push('last');return p.join(' · ')}
const artSmall=a=>[a.s,costTxt(a)].filter(Boolean).join(' · ');
function canArt(a){const c=a.c;return P.mp>=(c.mp||0)&&(!c.hp||P.hp>Math.round(P.max*c.hp))}
function actPri(a){a=a||"";if(a==='guard'||a==='flee'||a.startsWith('it:'))return 100;if(a.startsWith('ar:')){const r=ARTN[a.slice(3)];return r.pri===1?100:r.pri===-1?-100:0}return 0}
const PDEB=['poison','bleed','burn','dazed','blind','rooted','wither'];
function cleanse(n){let g=null;for(const k of PDEB)if(P.st[k]&&n>0){delete P.st[k];g=g||k;n--}return g}
const hit=(r,f)=>r&&!r.blk&&f.hp>0;
async function doArt(id){const f=tgt(),A=ARTN[id];B.artAcc=ACCM[id]||0;say(A.n+'.',600,'auto');await sleep(150);
  switch(id){
    case'riposte':await strike(f,.4,false,{noproc:1});B.pb.ward='riposte';B.pb.wardR=B.rnd+1;B.pb.dgU=B.rnd+1;updBUI();await say('You come out of the cut in a duellist\'s stance.',700,'auto');break;
    case'measured':{const r=await strike(f,.6,false,{sure:1});if(hit(r,f)&&foeSt(f,'vuln',2)){updBUI();await say(NM(f,'You open a gap in the @\'s guard. Vulnerable.'),700,'auto')}break}
    case'hilt':{await strike(f,.4);const d=cleanse(1);B.pb.kind=1;SFX.heal();updBUI();await say('You murmur over the cross-guard.'+(d?` The ${STATUS[d].n.toLowerCase()} lifts.`:'')+' Kindled.',800,'auto');break}
    case'hew':{const r=await strike(f,.75);if(hit(r,f)&&foeSt(f,'shred',1)){updBUI();await say(NM(f,`The @'s armour splits. (Shred ${f.st.shred})`),650,'auto')}break}
    case'hook':{const r=await strike(f,.45);if(r&&f.hp>0){const had=f.st.wall||f.st.harden;delete f.st.wall;delete f.st.harden;f.st.exposed=2;updBUI();await say(NM(f,had?'You hook its guard and wrench it away. The @ is Exposed.':'You hook it off balance. The @ is Exposed.'),700,'auto')}break}
    case'headsman':{const lo=f.hp<f.max*.35,r=await strike(f,lo?2.2:.9);if(r&&lo)await say('It was already dying. You finish the thought.',700,'auto');break}
    case'crush':await strike(f,.8,false,{pierce:1});await sleep(250);break;
    case'concuss':{const r=await strike(f,.4);if(hit(r,f)){if(chance(.5)&&foeSt(f,'stag',1)){updBUI();await say(NM(f,'The @ reels. It will lose its next turn.'),700,'auto')}else await say('It shakes the blow off.',600,'auto')}break}
    case'bulwark':{await strike(f,.4);B.pb.fort=3;SFX.guard();updBUI();await say('You come out of the swing behind your shield. Fortified.',700,'auto');break}
    case'lunge':await strike(f,.75);await sleep(250);break;
    case'setspear':B.pb.brace=1;SFX.guard();updBUI();await say('You plant the butt of the spear and set the point. Let them come.',700,'auto');break;
    case'skewer':{const r=await strike(f,.7,false,{nododge:1});if(r)for(const e of alive())if(e!==f)await strike(e,.45,true,{nododge:1});updBUI();await sleep(250);break}
    case'flurry':{const got=new Set();for(let i=0;i<4;i++){const t=tgt();if(!t)break;const r=await strike(t,.22,i>0);if(!hit(r,t))continue;
        if(chance(.25)&&foeSt(t,'bleed',3))got.add('bleeding');if(chance(.15)&&foeSt(t,'shred',1))got.add('shredded');
        if(chance(.1)&&foeSt(t,'vuln',2))got.add('vulnerable');if(chance(.1)&&foeSt(t,'cripple',2))got.add('weakened');updBUI()}
      await say(got.size?'It is left '+listJoin([...got])+'.':'Four quick holes. Nothing worse.',700,'auto');break}
    case'envenom':{const r=await strike(f,.3);if(hit(r,f)&&foeSt(f,'poison',4)){updBUI();await say(NM(f,'The @ is poisoned.'),600,'auto')}break}
    case'shadow':B.pb.ward='evade';B.pb.whet=1;SFX.miss();updBUI();await say('You slip into its blind side. Whetted.',700,'auto');break;
    case'overhead':B.charge='overhead';updBUI();await say('You heave the greatsword back over your shoulder...',900,'auto');break;
    case'sweep':SFX.whoosh();for(const e of alive())await strike(e,.5,e!==f);await sleep(250);break;
    case'ironwill':{const had=PDEB.some(k=>P.st[k]);for(const k of PDEB)delete P.st[k];B.pb.unsh=3;SFX.heal();B.fx.push({k:'heal',t:0});updBUI();await say((had?'You put the pain somewhere else. ':'')+'Unshaken.',800,'auto');break}
    case'sunder':{const r=await strike(f,.6);if(hit(r,f)&&foeSt(f,'shred',2)){updBUI();await say(NM(f,`The @'s armour caves in. (Shred ${f.st.shred})`),650,'auto')}break}
    case'quake':{SFX.thud();for(const e of B.foes)if(!e.dead)e.shake=.6;let n=0;for(const e of alive()){const r=await strike(e,.45,true);if(r&&e.hp>0&&chance(.4)&&foeSt(e,'stag',1))n++}updBUI();await say(n?'The ground bucks. '+(n>1?'Some of them go':'One goes')+' down.':'The ground bucks. They keep their feet.',800,'auto');break}
    case'anvil':{await strike(f,.4);[0,2].forEach((p,i)=>setTimeout(()=>SFX.bell(p),i*110));P.mp=Math.min(P.mmax,P.mp+1);B.pb.kind=1;updBUI();await say('The note hangs in the air. +1 MP. Kindled.',800,'auto');break}
    case'reap':{let tot=0;for(const e of alive()){const r=await strike(e,.45,e!==f);if(r)tot+=r.d}const h=Math.min(P.max-P.hp,Math.round(tot*.2));if(h>0){P.hp+=h;addNum('p',h,'#8fe08a');hpLog(h,'Reap')}updBUI();await say(h?`The harvest feeds you. +${h} HP.`:'A wide, hungry arc.',700,'auto');break}
    case'hamstring':{const r=await strike(f,.45);if(hit(r,f)){const a=foeSt(f,'cripple',2),b=foeSt(f,'slow',2);updBUI();if(a||b)await say(NM(f,'The @ stumbles.'+(a&&b?' Weakened and Slowed.':a?' Weakened.':' Slowed.')),700,'auto')}break}
    case'lash':await strike(f,.65,false,{sure:1});await sleep(250);break;
    case'wrap':{const r=await strike(f,.35);if(hit(r,f)){f.st.exposed=2;foeSt(f,'slow',2);updBUI();await say(NM(f,'The chain wraps round the @. It is Exposed.'),700,'auto')}break}
    case'whirl2':{SFX.whoosh();let n=0;for(const e of alive()){const r=await strike(e,.4,e!==f);if(hit(r,e)&&chance(.25)&&foeSt(e,'stag',1))n++}updBUI();if(n)await say(n>1?'Some of them go down.':'One of them goes down.',650,'auto');break}
    case'chop':{const r=await strike(f,.9);if(hit(r,f)&&foeSt(f,'shred',1)){updBUI();await say(NM(f,`The @'s armour splits. (Shred ${f.st.shred})`),650,'auto')}break}
    case'keepback':{B.pb.keep=1;const r=await strike(f,.5);if(hit(r,f))foeSt(f,'slow',2);updBUI();await say('You hold it off at the length of the pole.',650,'auto');break}
    case'pullhook':{const r=await strike(f,.5);if(hit(r,f)){if(chance(.6)&&foeSt(f,'stag',1)){updBUI();await say(NM(f,'You drag the @ off its feet.'),700,'auto')}else await say('It keeps its feet.',600,'auto')}break}
    case'bloodharvest':{let n=0;for(let i=0;i<3;i++){const a=alive();if(!a.length)break;const t=pick(a),r=await strike(t,.4,true);if(hit(r,t)&&chance(.35)&&foeSt(t,'bleed',3))n++;updBUI()}if(n)await say(n>1?'Blood answers blood. They bleed.':'Blood answers blood.',700,'auto');break}}
  B.artAcc=0;updBUI()}
async function releaseArt(id){const f=tgt();B.charge=null;
  if(id==='overhead'){say('Overhead Cleave!',600,'auto');await strike(f,2,false,{sure:1});await sleep(300)}updBUI()}
/* where a stat comes from, piece by piece: "+2 Grim Band", "+10 The Wychwarden's Vigil (2 pieces)", "+4 Thick Hide (talent)" */
function srcOf(k){const out=[],f=v=>(v>0?'+':'−')+(PCT.has(k)?Math.round(Math.abs(v)*1000)/10+'%':Math.round(Math.abs(v)*10)/10);
  for(const sl of Object.keys(P.eq)){const id=P.eq[sl];if(id&&ITEMS[id]){const v=(ITEMS[id].st||{})[k];if(v)out.push(`${f(v)} ${iname(id)}`)}}
  const sc=setCounts();for(const s in sc)for(const n in SETS[s].b)if(sc[s]>=+n&&SETS[s].b[n][k])out.push(`${f(SETS[s].b[n][k])} ${SETS[s].n} (${n} pieces)`);
  const TS={atk:[['keen',2]],max:[['thick',8]],def:[['thick',1]],mmax:[['devotion',3]],smite:[['sear',4]],crit:[['bleed',.04],['keen',.02]],thorns:[['spiked',2]]};
  for(const[t,m]of TS[k]||[])if(tr(t))out.push(`${f(m*tr(t))} ${TALN[t]?TALN[t].name:t} (talent${P.talB[t]?', partly from gear':''})`);
  return out}
/* your own stats on hover: current value, then what's changing it and why */
/* brief: the overworld head icon. Just the numbers, no breakdowns */
function pTip(brief){const pb=(B&&B.pb)||{},sg=n=>n>0?'+'+n:'−'+Math.abs(n),pc=x=>Math.round(x*100)+'%';
  const row=(n,v,m)=>`<span class='wr'><span>${n}</span><em>${v}</em></span>${brief?'':m.map(x=>`<span class='ws'>${x}</span>`).join('')}`;
  const base=lvlBase();
  const am=[],dm=[],im=[],cm=[];
  am.push(...srcOf('atk'));
  if(hasT('nothing')){const x=2*Math.floor((1-P.hp/P.max)*5);if(x)am.push(`+${x} Nothing to Lose`)}
  if(P.sharp>0)am.push(`+2 grindstone, ${P.sharp} fight${P.sharp>1?'s':''} left`);
  if(P.st.wither)am.push('−30% Withered');if(P.blessed)am.push('+10% damage, Blessed');
  if(pb.whet)am.push('+40% next strike, Whetted');if(B&&B.riposte)am.push('+70% next Slash, Riposte');if(pb.kind)am.push('+50% next skill, Kindled');
  dm.push(...srcOf('def'));
  if(P.guard)dm.push('far less damage taken, Guarding');if(pb.fort)dm.push(`−30% damage taken, Fortified ${pb.fort}`);if(pb.brace)dm.push('−25% damage taken, Spear Set');if(B&&B.bastion)dm.push('−25% from the first blow, Bastion');
  im.push(...srcOf('ini'));cm.push(...srcOf('crit'));
  let t=brief?`<b>Paladin</b>`+row('Level',P.lv,[])+row('Experience',`${P.xp} / ${nextXp(P.lv)}`,[]):`<b>Paladin</b><span class='r'>Level ${P.lv} · ${WT_NAME[wType()]} · ${P.xp} / ${nextXp(P.lv)} XP</span>`;
  t+=row('Health',`${Math.max(0,P.hp)} / ${P.max}`,[])+row('Magic Power',`${P.mp} / ${P.mmax}`,[]);
  const acm=[`${pc(WACC[wType()])} ${WT_NAME[wType()].toLowerCase()}`].concat(attr('mob')?[`+${(.4*attr('mob')).toFixed(1)}% Mobility`]:[],srcOf('acc'));
  const dgm=[];if(B&&B.pb&&B.pb.dgU>=B.rnd)dgm.push('+25% Riposte Stance');if(P.st.rooted)dgm.push('−5% Rooted');
  const prm=[`${pc(WPARRY[wType()]||.04)} ${WT_NAME[wType()].toLowerCase()}`].concat(!P.eq.shield&&attr('fort')?[`+${attr('fort')}% Fortitude (no shield)`]:[],srcOf('parry')),blm=P.eq.shield?[`shield: 10% + 2.5% per point of its armour (${shieldDef()})`].concat(attr('fort')?[`+${attr('fort')}% Fortitude`]:[],P.guard?['×2 Guarding']:[]):['no shield'];const R=pRes();
  t+=row('Attack',Math.round(effAtk()*10)/10,am)+row('Accuracy',pc(pAcc()),acm)+row('Armour',P.def,dm)+row('Dodge',pc(pDodge()),dgm)+row('Parry',pc(pParry()),prm)+row('Block',pc(pBlock()),blm)+row('Speed',P.ini,im)+row('Critical chance',pc(P.crit),cm);
  t+=`<span class='wh'>Resistances</span>`+row('Bleed',pc(R.bleed),['1.2% per armour'])+row('Poison',R.poison>=1?'immune':pc(R.poison),[])+row('Stun',pc(R.stun),['4% per helm armour'])+row('Burn',pc(R.burn),[])+row('Weaken',pc(R.debuff),[]);
  if(P.st.dazed||P.st.blind)t+=row('Chance to hit','50%',[P.st.blind?'Blinded':'Dazed']);
  const ex=[];if(P.lifesteal)ex.push(`Life steal ${pc(P.lifesteal)}`);if(P.thorns)ex.push(`Thorns ${P.thorns}`);if(P.bleedc)ex.push(`Bleed chance ${pc(P.bleedc)}`);
  if(P.stagger)ex.push(`Stagger chance ${pc(P.stagger)}`);if(P.pierce)ex.push(`Armour piercing ${P.pierce}`);if(P.cleave)ex.push(`Cleave ${pc(P.cleave)}`);if(P.regen)ex.push('Regenerating');
  if(ex.length)t+=`<span class='wh'>Extras</span>`+ex.map(x=>{const i=x.lastIndexOf(' ');return i>0&&/\d/.test(x.slice(i))?row(x.slice(0,i),x.slice(i+1),[]):brief?row(x,'yes',[]):`<span class='ws'>${x}</span>`}).join('');
  const af=PDEB.filter(k=>P.st[k]).map(k=>`${STATUS[k].n} ${P.st[k]}`);if(af.length)t+=`<span class='wh' style='color:#e08a7a'>Afflictions</span>`+PDEB.filter(k=>P.st[k]).map(k=>row(STATUS[k].n,`${P.st[k]} turn${P.st[k]>1?'s':''}`,[])).join('');
  return t}

/* ---- Stats window ---- */
function lvlBase(){const L1=P.lv-1;return{atk:Math.round((7+.75*L1)*10)/10,def:Math.floor(L1/6),ini:4+Math.floor(L1/3),crit:.08,max:35+Math.round(2.5*L1),mmax:10+Math.floor(.75*L1)}}
function statSections(){const pb=(B&&B.pb)||{},sg=n=>n>0?'+'+n:'−'+Math.abs(n),pc=x=>Math.round(x*100)+'%',wt=wType(),wn=WT_NAME[wt].toLowerCase();
  const base=lvlBase(),am=[`${base.atk} from level`,...srcOf('atk')];if(attrMult()!==1)am.push(`+${Math.round((attrMult()-1)*100)}% ${LIGHTW.includes(wt)?'Dexterity':'Strength'}`);
  if(hasT('nothing')){const x=2*Math.floor((1-P.hp/P.max)*5);if(x)am.push(`+${x} Nothing to Lose`)}
  if(P.sharp>0)am.push(`+2 grindstone, ${P.sharp} fight${P.sharp>1?'s':''} left`);if(P.st.wither)am.push('−30% Withered');if(P.blessed)am.push('+10% Blessed');
  const dm=[`${base.def} from level`,...srcOf('def')];
  const R=pRes(),S=[];
  S.push(['Vitals',[
    ['Level',P.lv,[],`Each level grants a talent point, ${APL} stat points, a little health, MP and attack, and every third level +1 Speed.`],
    ['Experience',`${P.xp} / ${nextXp(P.lv)}`,[],'Earned from foes near your level. Foes far below you give little.'],
    ['Health',`${Math.max(0,P.hp)} / ${P.max}`,[`${base.max} from level`].concat(attr('vit')?[`+${2*attr('vit')} Health points`]:[]).concat(srcOf('max')),'If this reaches zero, you fall.'],
    ['Magic Power',`${P.mp} / ${P.mmax}`,[`${base.mmax} from level`].concat(attr('ene')?[`+${attr('ene')} Mana points`]:[]).concat(srcOf('mmax')),'Spent on skills and some attacks. Guarding restores a little; kindling a new fire fills it.']]]);
  const off=[
    ['Attack',Math.round(effAtk()*10)/10,am,'How hard your weapon hits. Enemy armour is subtracted from it.'],
    ['Accuracy',pc(pAcc()),[`${pc(WACC[wt])} ${wn}`].concat(attr('mob')?[`+${(.4*attr('mob')).toFixed(1)}% Mobility`]:[]).concat(srcOf('acc')),'Your chance to hit, before the foe gets to dodge. Set mostly by weapon type.'],
    ['Critical chance',pc(P.crit),['8% base',...srcOf('crit')],'Odds that a hit lands 60% harder.'],
    ['Speed',P.ini,[`${base.ini} from level`,...srcOf('ini')],'Each round everyone\'s Speed gets a little luck added. Highest goes first, and you win ties.']];
  if(P.smite)off.push(['Smite bonus','+'+P.smite,srcOf('smite'),'Extra holy damage on Smite.']);
  if(P.lifesteal)off.push(['Life steal',pc(P.lifesteal),srcOf('lifesteal'),'Portion of hit damage returned to you as health. Every hit of a multi-hit attack drains.']);
  if(P.bleedc)off.push(['Bleed chance',pc(P.bleedc),srcOf('bleedc'),'Chance for a hit to open a wound.']);
  if(P.stagger)off.push(['Stagger chance',pc(P.stagger),srcOf('stagger'),'Chance for a hit to make the foe lose its turn.']);
  if(P.pierce)off.push(['Armour piercing',P.pierce,srcOf('pierce'),'Ignores this much of the foe\'s armour.']);
  if(P.cleave)off.push(['Cleave',pc(P.cleave),srcOf('cleave'),'Portion of each hit that splashes onto the other foes.']);
  S.push(['Offence',off]);
  const def=[
    ['Armour',P.def,dm,'Each point shaves a little off every blow you take, and helps resist bleeding.'],
    ['Dodge',pc(pDodge()),['5% base'].concat(attr('mob')?[`+${(.4*attr('mob')).toFixed(1)}% Mobility`]:[]).concat(srcOf('dodge')).concat(P.st.rooted?['−5% Rooted']:[]),'Chance to slip an attack entirely.'],
    ['Parry',pc(pParry()),[`${pc(WPARRY[wt]||.04)} ${wn}`].concat(!P.eq.shield&&attr('fort')?[`+${attr('fort')}% Fortitude (no shield)`]:[],srcOf('parry')),'Chance to turn a blow aside with your weapon, taking nothing.'],
    ['Block',pc(pBlock()),(P.eq.shield?[`10% + 2.5% per shield armour (${shieldDef()})`]:['no shield']).concat(attr('fort')&&P.eq.shield?[`+${attr('fort')}% Fortitude`]:[]),'Chance to catch a blow on your shield: half damage, and it cannot open a wound. Doubled while Guarding.']];
  if(P.thorns)def.push(['Thorns',P.thorns,srcOf('thorns'),'Damage dealt back to anything that hits you.']);
  if(P.regen)def.push(['Regeneration',P.regen,srcOf('regen'),'Health regained each turn in battle.']);
  S.push(['Defence',def]);
  S.push(['Resistances',[
    ['Bleed',pc(R.bleed),['1.2% per armour',...srcOf('rBleed'),...srcOf('rAll')],'Chance to shrug off a wound. Caps at 50%.'],
    ['Poison',R.poison>=1?'immune':pc(R.poison),P.poisonImm?['warded']:[...srcOf('rPoison'),...srcOf('rAll')],'Chance to shrug off poison. Caps at 60%.'],
    ['Stun',pc(R.stun),['4% per helm armour',...srcOf('rStun'),...srcOf('rAll')],'Chance to shrug off dazes. Caps at 50%.'],
    ['Burn',pc(R.burn),[...srcOf('rBurn'),...srcOf('rAll')],'Chance to shrug off burning. Caps at 60%.'],
    ['Weaken',pc(R.debuff),[...srcOf('rAll')],'Chance to shrug off roots, blindness and withering. Caps at 50%.']]]);
  if(attr('fort'))for(const r of S[S.length-1][1])if(r[1]!=='immune')r[2].push(`+${attr('fort')}% Fortitude`);
  const oth=[['Move speed',pc(P.speed),['100% base'].concat(attr('mob')?[`+${(.5*attr('mob')).toFixed(1)}% Mobility`]:[],srcOf('speed')),'How fast you walk.']];
  if(P.light)oth.push(['Light','+'+pc(P.light),srcOf('light'),'How far your lantern reaches.']);
  if(P.stealth)oth.push(['Stealth',pc(P.stealth),srcOf('stealth'),'How hard you are to notice.']);
  if(P.mf)oth.push(['Magic find','+'+pc(P.mf),srcOf('mf'),'Better rarity on items that drop. Does not make items drop more often.']);
  if(P.gf)oth.push(['Gold find','+'+pc(P.gf),srcOf('gf'),'More coin from foes and finds.']);
  if(P.xpb)oth.push(['Experience bonus','+'+pc(P.xpb),srcOf('xpb'),'More experience from foes.']);
  if(P.potb)oth.push(['Potion potency','+'+pc(P.potb),srcOf('potb'),'Potions heal more.']);
  S.push(['Other',oth]);
  const af=PDEB.filter(k=>P.st[k]).map(k=>[STATUS[k].n,P.st[k],[],'An affliction. A bed clears them all.']);if(af.length)S.push(['Afflictions',af]);
  return S}
/* the run so far, for the Stats screen */
function recSection(){const R=P.rec,n=k=>Math.round(R[k]||0),t=n('time'),hh=Math.floor(t/3600),mm=Math.floor(t/60)%60,d=R.dist||0,kk=R.kk||{},top=Object.keys(kk).sort((a,b)=>kk[b]-kk[a])[0],fmt=x=>x.toLocaleString('en-GB');
  return['Record',[
    ['Time played',hh?`${hh}h ${mm}m`:`${mm}m`,[],'Time spent in the game itself, not on the title screen.'],
    ['Distance walked',d>=1000?(d/1000).toFixed(1)+' km':Math.round(d)+' m',[],'Counting a pace of road as a metre.'],
    ['Fights won',fmt(n('won')),[],''],['Fights fled',fmt(n('fled')),[],''],['Deaths',fmt(n('deaths')),[],''],
    ['Kills',fmt(n('kills')),top?[`most of all: ${top} ×${kk[top]}`]:[],'Everything you have put down.'],['Great foes slain',fmt(n('bosses')),[],''],
    ['Damage dealt',fmt(n('dealt')),[],''],['Damage taken',fmt(n('taken')),[],''],['Hardest blow',fmt(n('best')),[],'Your biggest single hit.'],['Critical hits',fmt(n('crits')),[],''],
    ['Fires kindled',fmt(n('fires')),[],''],['Chests opened',fmt(n('chests')),[],''],['Hidden caches found',fmt(n('caches')),[],'Things tucked into the ends of dead ends.'],['Puzzles solved',fmt(n('puzzles')),[],''],['Things poked at',fmt(n('poked')),[],'Stumps, burrows, puddles, bottles…'],['Things found',fmt(n('found')),[],''],['Things used',fmt(n('used')),[],'Potions, bandages and the like.'],
    ['Gold earned',fmt(n('earned')),[],''],['Gold spent',fmt(n('spent')),[],''],['Gambles',fmt(n('gambles')),[],'Unknown things bought from Mortimer.']]]}
function renderStats(sel){sel=sel||'#stwb';const S=statSections();if(sel==='#pk-stats')S.push(recSection());
  const html=`<div class="sth"><canvas id="sthc" width="16" height="16"></canvas><div><b>Paladin</b><span>Level ${P.lv} · ${WT_NAME[wType()]}</span></div></div>`+
    `<div class="sts"><div class="stsh">Attributes${P.apts>0&&!B?` · <em>${P.apts} point${P.apts>1?'s':''} to spend</em>`:''}</div>${ATTR.map(([k,n,d])=>`<div class="str" data-tip="${esc(`<b>${n} ${attr(k)}</b><span class='fx'>${d}</span><span class='wh'>Where it comes from</span><span class='ws'>${(P.attr[k]||0)} spent</span>${srcOf('a_'+k).map(x=>`<span class='ws'>${x}</span>`).join('')}`)}"><span>${n}</span><b style="margin-left:auto">${attr(k)}</b>${P.apts>0&&!B?`<i class="ap" data-attr="${k}">+</i>`:''}</div>`).join('')}</div>`+
    S.map(([h,rows])=>`<div class="sts"><div class="stsh">${h}</div>${rows.map(([n,v,m,d])=>`<div class="str" data-tip="${esc(`<b>${n}</b><span class='fx'>${d}</span>${m.length?`<span class='wh'>Where it comes from</span>${m.map(x=>`<span class='ws'>${x}</span>`).join('')}`:''}`)}"><span>${n}</span><b>${v}</b></div>`).join('')}</div>`).join('');
  const el=$(sel);if(el._h===html)return;el._h=html;el.innerHTML=html;
  try{const c=$(sel+' #sthc');if(c&&KN){c.width=12;c.height=8;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(KN.down[0],0,0,12,8,0,0,12,8)}}catch(e){}}
