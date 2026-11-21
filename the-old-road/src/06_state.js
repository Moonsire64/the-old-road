
/* ================= STATE ================= */
const cv=$('#cv'),ctx=cv.getContext('2d');let W=200,H=300,S=2,KK=2;const VIEW_W=160,VIEW_B=208;
const dk=cvs(10,10),dctx=dk.getContext('2d');
let VIG=null,BG=null;
/* the title screen shrinks to fit whatever height there is (landscape phones with toolbars, saves adding buttons) */
function fitTitle(){const t=document.querySelector('#title');if(!t||t.style.display==='none'||getComputedStyle(t).display==='none')return;t.style.zoom=1;
  /* measure the content itself (it is centred, so it can spill off the top as well as the bottom), then scale it down until it fits with a margin */
  const kids=[...t.children].filter(e=>getComputedStyle(e).position!=='absolute'&&e.offsetParent!==null);if(!kids.length)return;
  const rs=kids.map(e=>e.getBoundingClientRect()),top=Math.min(...rs.map(r=>r.top)),bot=Math.max(...rs.map(r=>r.bottom)),wid=Math.max(...rs.map(r=>r.width));
  const tr=t.getBoundingClientRect(),z=Math.min(1,(tr.height-24)/(bot-top)*.95,(tr.width-24)/wid);if(z<.999)t.style.zoom=Math.max(.45,z)}
setInterval(()=>{if(typeof mode!=='undefined'&&mode==='title')fitTitle()},400);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>setTimeout(fitTitle,50));
function resize(){const r=$('#view').getBoundingClientRect(),dpr=window.devicePixelRatio||1;if(r.width<10||r.height<10)return;{const lb=$('#logb'),pp=$('#ppanel');if(lb&&pp){const want=matchMedia('(orientation:landscape) and (max-height:640px)').matches?pp:$('#bui');if(lb.parentNode!==want)want.appendChild(lb)}}if(typeof placeTabs==='function')setTimeout(placeTabs,0);setTimeout(fitTitle,0);
  /* ONE LOOK EVERYWHERE. The screen's short side always shows the same number of game pixels (VIEW_W in the world, VIEW_B in battle), so the
     world, the knight and every creature are the same size relative to the screen on every phone, in either orientation. That makes the scale S
     a fraction (say 2.4 screen pixels per game pixel). To keep pixel art crisp at a fractional scale, the canvas is drawn at a whole multiple K
     of the game resolution (2, 4, ...), at least as fine as the screen, and the browser scales that down smoothly ("sharp bilinear"): edges stay
     sharp, pixels stay even, and things can move in 1/K-pixel steps so nothing jitters. On dense phone screens K is capped at 4 and scaled up instead. */
  const short=Math.min(r.width,r.height)*dpr;S=short/(B?VIEW_B:VIEW_W);
  /* indoors: zoom out (up to a third) so more of the room fits; the knight stops looking enormous next to the furniture */
  if(!B&&LV&&LV.kind==='interior'){const fit=Math.min(r.width*dpr/(LV.MW*T),r.height*dpr/(LV.MH*T));S=Math.max(S*.66,Math.min(S,fit))}KK=Math.min(4,HDK*Math.max(1,Math.ceil(S/HDK-.001)));
  W=Math.ceil(r.width*dpr/S);H=Math.ceil(r.height*dpr/S);
  cv.width=W*KK;cv.height=H*KK;cv.style.width=(W*S/dpr)+'px';cv.style.height=(H*S/dpr)+'px';cv.style.imageRendering=KK>=S?'auto':'pixelated';dk.width=W;dk.height=H;ctx.setTransform(KK,0,0,KK,0,0);ctx._hd=true;ctx.imageSmoothingEnabled=false;BG=null;VIG=null}
addEventListener('resize',()=>setTimeout(resize,60));
addEventListener('orientationchange',()=>setTimeout(resize,250));

const P={x:0,y:0,face:'down',moving:false,anim:0,slashT:0,slashCd:0,inv:0,roll:0,gold:0,trail:[],lv:1,xp:0,hp:999,mp:999,st:{},guard:false,pts:0,apts:0,attr:{vit:0,ene:0,fort:0,mob:0,dex:0,str:0},tal:{},blessed:0,
  eq:{weapon:'notched',shield:null,helm:null,amulet:null,armor:'gambeson',gloves:null,belt:null,legs:null,boots:'boots',ring:null,ring2:null,cloak:null,charm:null,charm2:null},tools:{},talB:{},bag:[{id:'potion',n:2}],stash:[],rec:{}};
/* the run's record, for the Stats screen */
function rec(k,n){P.rec[k]=(P.rec[k]||0)+n}
function recMax(k,n){if(n>(P.rec[k]||0))P.rec[k]=n}
const EV={blood:0,fog:0};
const nextXp=lv=>Math.round(20*Math.pow(lv,1.5));
let mode='title',scene='world',mobs=[],cam={x:0,y:0},TR=null,time=0,worldTime=0;
let particles=[],watchers=[],leaves=[],ambT=25,eyeT=3,chestCd=0,eventT=600+Math.random()*1200;
const FD={down:[0,1],up:[0,-1],left:[-1,0],right:[1,0]};

/* ---- talents & stats ---- */
const tr=id=>(P.tal[id]||0)+(P.talB[id]||0),hasT=id=>tr(id)>0;
/* a skill talent above rank 1 (from gear) is 25% stronger per extra rank */
const skR=id=>1+.25*Math.max(0,tr(id)-1);
const spent=t=>TAL[t].nodes.reduce((a,n)=>a+(P.tal[n.id]||0),0);
function setCounts(){const c={};for(const sl in P.eq){const id=P.eq[sl];if(id&&ITEMS[id].set)c[ITEMS[id].set]=(c[ITEMS[id].set]||0)+1}return c}
/* ---- attributes: 1 point a level, spent freely (Diablo II style). Levels themselves now give half the health/MP/attack they used to ---- */
/* 0.16, as in Diablo II: swords, daggers, axes, maces and flails are one-handed; greatswords, hammers, scythes, spears and halberds take both hands.
   HEAVYW = two-handed (no shield). Swords, daggers and spears scale with Dexterity, everything else with Strength */
const APL=1,LIGHTW=['sword','dagger','spear'],HEAVYW=['great','hammer','scythe','spear','halberd'],STRW=['axe','mace','flail','great','hammer','scythe','halberd'];
const ATTR=[
  ['vit','Health','+2 max health per point.'],
  ['ene','Mana','+1 max MP per point.'],
  ['fort','Fortitude','+1% to every resistance per point, and +1% block chance with a shield, or +1% parry chance without one.'],
  ['mob','Mobility','+0.4% dodge, +0.4% accuracy and +0.5% walking speed per point.'],
  ['dex','Dexterity','+3% damage per point with light weapons: swords, daggers and spears.'],
  ['str','Strength','+3% damage per point with axes, maces, flails, greatswords, hammers, scythes and halberds.']];
const attr=k=>((P.attr&&P.attr[k])||0)+((P.ab&&P.ab[k])||0);  /* points you spent + points from gear (rings, amulets...) */
function attrMult(){const w=wType();return 1+.03*(LIGHTW.includes(w)?attr('dex'):STRW.includes(w)?attr('str'):0)}
function lvlUp(){P.lv++;P.pts++;P.apts=(P.apts||0)+APL;const om=P.max,h0=P.hp;recalc();P.hp=Math.min(P.max,P.hp+(P.max-om)+Math.round(P.max*.2));P.mp=P.mmax;SFX.lvl();if(typeof hpLog==='function')hpLog(P.hp-h0,'Level up')}
const lvlMsg=()=>`You reach level ${P.lv}. You have a talent point and a stat point to spend.`;
function spendAttr(k){if(!(P.apts>0)||B)return;P.attr[k]=(P.attr[k]||0)+1;P.apts--;const om=P.max,omp=P.mmax;recalc();P.hp+=P.max-om;P.mp+=P.mmax-omp;SFX.coin();if(typeof updHud==='function')updHud();{const d=document.querySelector('#tsdot');if(d)d.style.display=P.apts>0?'block':'none'}}
function recalc(){P.ab={};for(const sl in P.eq){const id=P.eq[sl];if(id&&ITEMS[id])for(const k in ITEMS[id].st||{})if(k.startsWith('a_'))P.ab[k.slice(2)]=(P.ab[k.slice(2)]||0)+ITEMS[id].st[k]}const L1=P.lv-1,s={dodge:.05+.004*attr('mob'),acc:.004*attr('mob'),ini:4+Math.floor(L1/3),bleedc:0,max:35+Math.round(2.5*L1)+2*attr('vit'),mmax:10+Math.floor(.75*L1)+attr('ene'),atk:Math.round((7+.75*L1)*10)/10,def:Math.floor(L1/6),block:P.eq.shield?.01*attr('fort'):0,parry:P.eq.shield?0:.01*attr('fort'),rAll:.01*attr('fort'),crit:.08,smite:0,flee:0,speed:1+.005*attr('mob'),lifesteal:0,regen:0,thorns:0,poisonImm:0,stagger:0,light:0,pierce:0,cleave:0,stealth:0,smitec:0,potb:0,gf:0,xpb:0,mf:0,tool2:0};P.talB={};
  const addSt=st=>{for(const k in st){if(k.startsWith('tal_'))P.talB[k.slice(4)]=(P.talB[k.slice(4)]||0)+st[k];else s[k]=(s[k]||0)+st[k]}};
  for(const sl in P.eq){const id=P.eq[sl];if(id)addSt(ITEMS[id].st||{})}
  const sc=setCounts();for(const k in sc)for(const n in SETS[k].b)if(sc[k]>=+n)addSt(SETS[k].b[n]);s.stealth=Math.min(.6,s.stealth);
  s.atk+=2*tr('keen');s.crit+=.02*tr('keen');s.max+=8*tr('thick');s.def+=tr('thick');s.mmax+=3*tr('devotion');s.smite+=4*tr('sear');s.crit+=.04*tr('bleed');s.thorns+=2*tr('spiked');
  Object.assign(P,s);P.hp=Math.min(P.hp,P.max);P.mp=Math.min(P.mp,P.mmax)}
function effAtk(){let a=P.atk*attrMult();if(hasT('nothing'))a+=2*Math.floor((1-P.hp/P.max)*5);if(P.sharp>0)a+=2;if(P.st.wither)a*=.7;return a}

/* ---- inventory ---- */
const BAG_MAX=24;
const hasItem=id=>P.bag.some(b=>b.id===id);
const stackable=id=>!!(ITEMS[id].use||ITEMS[id].junk||ITEMS[id].mat);
function addItem(id,n=1){if(ITEMS[id].tool){P.tools[ITEMS[id].tool]=1;return true}if(stackable(id)){const b=P.bag.find(b=>b.id===id);if(b){b.n+=n;return true}if(P.bag.length>=BAG_MAX)return false;P.bag.push({id,n});return true}
  for(let i=0;i<n;i++){if(P.bag.length>=BAG_MAX)return false;P.bag.push({id,n:1})}return true}
function removeItem(id){const i=P.bag.findIndex(b=>b.id===id);if(i<0)return;if(--P.bag[i].n<=0)P.bag.splice(i,1)}
function applyItem(id){rec('used',1);
  if(ITEMS[id].heal){const h=Math.min(P.max-P.hp,ITEMS[id].heal);P.hp+=h;return`You eat the ${ITEMS[id].n.toLowerCase()}. +${h} HP.`}
  if(id==='bandage'){delete P.st.bleed;return'You bind the wound. The bleeding stops.'}
  if(id==='potion'){const h=Math.min(P.max-P.hp,Math.round(Math.max(16,P.max*.45)*(1+P.potb)));P.hp+=h;return`You drink a potion. +${h} HP.`}
  if(id==='elixir'){P.hp=P.max;P.mp=P.mmax;P.st={};return'Warmth floods through you. Everything is restored.'}
  if(id==='hallowed'){const m=Math.min(P.mmax-P.mp,10);P.mp+=m;return`The water is cold and clean. +${m} MP.`}
  if(id==='bitterleaf'){const bl=P.st.bleed;P.st={};if(bl)P.st.bleed=bl;return'You chew the bitter leaf. Your head clears.'}
  return''}
function lootRoll(tier){const q=Math.random();if(q<.04)return oreFor(tier);if(q<.0775)return genGear(tier);return lootRollOld(tier)}
/* consumables are 60% rarer than they were (0.15): a quarter of these rolls, down from five in eight */
function lootRollOld(tier){return chance(.25)?pick(['potion','potion','bandage','bandage','hallowed','bitterleaf','lampoil']):pick(JUNK)}

/* ---- knight look follows gear ---- */
const KN_BASE={k:'#08080b',e:'#030305',g:'#c9a24b',b:'#3a2a1d',r:'#5e1616',R:'#9c2a24',S:'#7a6a52',s:'#5a4c3a',d:'#3a3024',H:'#6d7078',h:'#4c4f56',j:'#2e3036',P:'#6d7078'};
const fixRows=rows=>rows.map((r,i)=>i<2?r.replace(/R/g,'P'):(i>=3&&i<=6)?r.replace(/S/g,'H').replace(/s/g,'h').replace(/d/g,'j'):r);
let KN;
function buildKnight(){const pal=Object.assign({},KN_BASE);for(const sl of['armor','helm']){const id=P.eq[sl];if(id&&ITEMS[id].pal)Object.assign(pal,ITEMS[id].pal)}
  const D=fixRows(KD),U=fixRows(KU),Sd=fixRows(KS);KN={down:[],up:[],right:[],left:[]};
  const ck=P.eq.cloak&&ITEMS[P.eq.cloak]?ITEMS[P.eq.cloak].c:null;
  for(let f=0;f<3;f++){KN.down[f]=spr(D.concat(LEG_V[f]),pal);KN.up[f]=spr(U.concat(LEG_V[f]),pal);KN.right[f]=spr(Sd.concat(LEG_S[f]),pal);
    if(ck){cloakOn(KN.down[f],'down',ck,f);cloakOn(KN.up[f],'up',ck,f);cloakOn(KN.right[f],'side',ck,f)}KN.left[f]=flipH(KN.right[f])}gearOn()}
/* KNW: the overworld knight with the gear in your hands. Padded 2px on every side so a blade can stick out (16x20).
   Battle, paper-doll and portrait keep using plain KN. */
let KNW,KNS;
/* ---- the knight's carried gear (overworld, and the battle view from behind) ----
   Placeholder art until the knight is redrawn: the weapon points straight the way you face (pointPix).
   The shield is a heater on the shield arm (from the front), held out front (side), and slung on your back (from behind). */
const GK='#08080b';
function gpx(x,col,a,b,w=1,h=1){x.fillStyle=col;x.fillRect(a,b,w,h)}
function wpnInfo(wi){const c=wi.c||['#b8bcc2','#3a2a1d','#c9a24b'];return{M:wi.blade||c[0],G:c[1]||'#3a2a1d',A:c[2]||'#c9a24b'}}
/* hanging one-hander: fist at (hx,hy); flip mirrors nothing (it's symmetric) */
                                         /* the fist round the grip */
/* two-hander over the shoulder: from the hands at (hx,hy) up and out, dir -1 = toward the left of the picture */
             /* hands on the haft */
function shieldPix(x,lx,ty,c,face){const R=c[0]||'#8b9099',F=c[2]||'#6d5a33',W=c[1]||'#3a2a1d';
  if(face==='front'){                                               /* heater, 6 wide 8 tall */
    gpx(x,GK,lx,ty,6,6);gpx(x,GK,lx+1,ty+6,4,1);gpx(x,GK,lx+2,ty+7,2,1);
    gpx(x,R,lx+1,ty+1,4,5);gpx(x,R,lx+2,ty+6,2,1);gpx(x,F,lx+2,ty+2,2,3);gpx(x,F,lx+2,ty+1,2,1);gpx(x,'#fff',lx+1,ty+1,1,1);gpx(x,R,lx+1,ty+3,4,1);gpx(x,F,lx+2,ty+3,2,1)}
  else if(face==='back'){                                           /* slung on the back: the wooden back and its strap */
    gpx(x,GK,lx,ty,6,6);gpx(x,GK,lx+1,ty+6,4,1);gpx(x,GK,lx+2,ty+7,2,1);gpx(x,W,lx+1,ty+1,4,5);gpx(x,W,lx+2,ty+6,2,1);gpx(x,R,lx+1,ty+1,4,1);gpx(x,'#5a4026',lx+1,ty+3,4,1)}
  else{gpx(x,GK,lx,ty,4,8);gpx(x,GK,lx+1,ty+8,2,1);gpx(x,R,lx+1,ty+1,2,7);gpx(x,F,lx+2,ty+1,1,7);gpx(x,'#fff',lx+1,ty+1,1,1)}}
/* KNW frames are 20x24 with the plain knight at (4,4): room for a weapon over the shoulder */
/* the weapon simply points the way you face (placeholder until the knight is redrawn): fist at (hx,hy), (ux,uy) = direction */
function pointPix(x,t,hx,hy,ux,uy,col,sw=0){const{M,G,A}=col,W='#fff',P=[],at=(i,j,c)=>P.push([hx+ux*i-uy*j,hy+uy*i+ux*j,c]);
  /* each type has its own silhouette: i runs from the fist along the weapon, j across it */
  at(-1,0,A);at(0,0,G);
  const blade=(a,b,tip)=>{for(let i=a;i<=b;i++)at(i,0,i===a?W:M);at(b+1,0,tip||M)},haft=(a,b)=>{for(let i=a;i<=b;i++)at(i,0,G)};
  switch(t){
    case'dagger':at(1,-1,A);at(1,1,A);blade(2,3,W);break;
    case'great':at(1,0,G);for(let j=-2;j<=2;j++)at(2,j,A);blade(3,10,W);break;
    case'axe':haft(1,5);at(4,-1,M);at(5,-1,M);at(6,-1,M);at(4,-2,M);at(5,-2,M);at(6,-2,M);at(5,-3,W);at(5,1,M);break;
    case'mace':haft(1,4);for(let i=5;i<=7;i++)for(let j=-1;j<=1;j++)at(i,j,i===6&&j===0?A:M);at(6,-2,M);at(6,2,M);at(8,0,M);break;
    case'flail':{haft(1,2);const o=sw;at(3,o,A);at(4,0,A);for(let i=5;i<=7;i++)for(let j=-1;j<=1;j++)at(i,j+o,M);at(8,o,W);at(6,-2+o,M);at(6,2+o,M);break}
    case'hammer':haft(1,7);for(let i=7;i<=8;i++)for(let j=-2;j<=2;j++)at(i,j,M);at(7,0,A);break;
    case'spear':haft(1,9);at(10,-1,M);at(10,1,M);at(10,0,M);at(11,0,M);at(12,0,W);break;
    case'halberd':haft(1,9);at(10,0,M);at(11,0,M);at(12,0,W);for(let i=8;i<=9;i++)for(let j=-1;j>=-3;j--)at(i,j,M);at(8,-3,W);at(9,1,M);at(9,2,M);break;
    case'scythe':haft(1,8);for(const[i,j]of[[8,-1],[8,-2],[8,-3],[7,-4],[7,-5],[6,-6]])at(i,j,M);at(6,-6,W);at(7,-5,W);break;
    default:at(1,-1,A);at(1,0,A);at(1,1,A);blade(2,6,W)}
  for(const[a,b]of P){gpx(x,GK,a-1,b,3,1);gpx(x,GK,a,b-1,1,3)}for(const[a,b,c]of P)gpx(x,c,a,b,1,1);gpx(x,'#c8ccd2',hx,hy,1,1)}
/* KNW frames are 28x32 with the plain knight at (8,8) (room for a halberd or a greatsword). KNS is the same without the weapon (shown while you swing, so there is only one) */
const KPAD=8;
function gearOn(){KNW={down:[],up:[],right:[],left:[]};KNS={down:[],up:[],right:[],left:[]};const wi=P.eq.weapon&&ITEMS[P.eq.weapon],si=P.eq.shield&&ITEMS[P.eq.shield],t=wi?wTypeOf(wi):null,two=wi&&HEAVYW.includes(t),col=wi?wpnInfo(wi):null;
  const mk=(base,fn)=>{const c=cvs(12+KPAD*2,16+KPAD*2),x=c.getContext('2d');x.translate(KPAD-2,KPAD-2);fn(x,base);return c};
  for(let f=0;f<3;f++){const sw=f===1?1:f===2?-1:0;
    const dn=(x,w)=>{x.drawImage(KN.down[f],2,2);if(w&&wi)pointPix(x,t,3,13+sw,0,1,col,sw);if(si&&!two)shieldPix(x,10,9,si.c,'front')};
    const up=(x,w)=>{x.drawImage(KN.up[f],2,2);if(si)shieldPix(x,5,9,si.c,'back');if(w&&wi)pointPix(x,t,13,12-sw,0,-1,col,sw)};
    const rt=(x,w)=>{x.drawImage(KN.right[f],2,2);if(si&&!two)shieldPix(x,10,9,si.c,'side');if(w&&wi)pointPix(x,t,9,13+sw,1,0,col,sw)};
    KNW.down[f]=mk(0,(x)=>dn(x,1));KNS.down[f]=mk(0,(x)=>dn(x,0));KNW.up[f]=mk(0,(x)=>up(x,1));KNS.up[f]=mk(0,(x)=>up(x,0));
    KNW.right[f]=mk(0,(x)=>rt(x,1));KNS.right[f]=mk(0,(x)=>rt(x,0));KNW.left[f]=flipH(KNW.right[f]);KNS.left[f]=flipH(KNS.right[f])}}
/* a worn cloak: hangs over your back (seen from behind), shows at the hem and sides from the front, trails behind you side-on */
function cloakOn(cv,view,c,f){const x=cv.getContext('2d'),[M,D,A]=c,K='#08080b',px=(col,a,b,w=1,h=1)=>{x.fillStyle=col;x.fillRect(a,b,w,h)},sw=f===1?1:f===2?-1:0;
  if(view==='up'){for(let y=7;y<15;y++){const l=y<9?2:1,r=y<9?9:10;px(K,l,y);px(K,r,y);px(M,l+1,y,r-l-1)}px(D,4,9,1,6);px(D,7,9,1,6);px(A,3,7);px(A,8,7);
    for(let xx=1;xx<=10;xx++)px(xx%3===sw+1?D:M,xx,15);px(K,1,15);px(K,10,15)}
  else{x.globalCompositeOperation='destination-over';
    if(view==='down'){for(let y=11;y<15;y++){px(K,0,y);px(M,1,y);px(M,10,y);px(K,11,y)}px(D,1,14);px(D,10,14)}
    else{for(let y=8;y<16;y++){px(K,0,y)}px(K,1,15,2)}
    x.globalCompositeOperation='source-over';
    if(view==='side'){for(let y=8;y<15;y++){px(M,1,y,y<10?1:2);px(K,y<10?2:3,y)}px(D,2,11+Math.max(0,sw),1,3);px(A,2,8)}if(view==='down'){px(A,4,7);px(A,7,7)}}}

/* ---- tooltip text helpers ---- */
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const STATN={bleedc:'Chance to cause bleeding',pierce:'Armour piercing',ini:'Speed',atk:'Attack',def:'Defense',max:'Max HP',mmax:'Max MP',crit:'Critical chance',smite:'Smite damage',flee:'Escape chance',speed:'Move speed',lifesteal:'Life drain',regen:'Regeneration',thorns:'Thorns',stagger:'Stagger chance',light:'Lantern reach',acc:'Accuracy',rAll:'All resistances',rBleed:'Bleed resistance',rPoison:'Poison resistance',rStun:'Stun resistance',rBurn:'Burn resistance',a_str:'Strength',a_dex:'Dexterity',a_vit:'Health (stat)',a_ene:'Mana (stat)',a_fort:'Fortitude',a_mob:'Mobility'};
const PCT=new Set(['dodge','parry','block','acc','rAll','rBleed','rPoison','rStun','rBurn','bleedc','crit','flee','speed','lifesteal','stagger','light','cleave','stealth','potb','gf','xpb','mf']);
const fv=(k,v)=>PCT.has(k)?Math.round(v*100)+'%':''+v;
/* stat lines always come in the same order, whatever order the item rolled them in */
const STAT_ORDER=['atk','def','max','mmax','a_str','a_dex','a_vit','a_ene','a_fort','a_mob','ini','speed','crit','acc','pierce','cleave','stagger','bleedc','smite','lifesteal','regen','thorns','rAll','rBleed','rPoison','rStun','rBurn','poisonImm','flee','stealth','light','potb','gf','mf','xpb'];
const statRank=k=>{const i=STAT_ORDER.indexOf(k);return i<0?(k.startsWith('tal_')?200:100):i};
function gearLines(it){const st=it.st||{},out=[];if(it.so){const g=it.gems||[];out.push(`Sockets: ${g.map(x=>ITEMS[x].n).concat(Array(it.so-g.length).fill('empty')).join(', ')}`)}for(const k of Object.keys(st).sort((a,b)=>statRank(a)-statRank(b))){const v=st[k];
  if(k==='poisonImm'){out.push('Immune to poison');continue}
  if(k==='lifesteal'){out.push(`Slashes heal you for ${fv(k,v)} of the damage`);continue}
  if(k==='thorns'){out.push(`Attackers take ${v} damage`);continue}
  if(k==='stagger'){out.push(`Slashes have a ${fv(k,v)} chance to stagger`);continue}
  if(k==='regen'){out.push(`Regenerate ${v} HP per turn in battle`);continue}
  if(k==='light'){out.push(`Lantern reaches ${fv(k,v)} further`);continue}
  if(k==='pierce'){out.push(`Ignores ${v} of the foe's armour`);continue}
  if(k==='cleave'){out.push(`Slashes also hit every other foe for ${fv(k,v)} damage`);continue}
  if(k==='stealth'){out.push(`Enemies notice you ${fv(k,v)} less far away`);continue}
  if(k==='smitec'){out.push(`Smite costs ${v} less MP`);continue}
  if(k==='potb'){out.push(`Potions heal ${fv(k,v)} more`);continue}
  if(k==='gf'){out.push(`${fv(k,v)} more gold found`);continue}
  if(k==='xpb'){out.push(`${fv(k,v)} more experience`);continue}
  if(k==='mf'){out.push(`${fv(k,v)} better chance of finding magic items`);continue}
  if(k==='tool2'){out.push('Tools can be used twice per fight');continue}
  if(k.startsWith('tal_')){const n=TALN[k.slice(4)];out.push(`+${v} ${n.name}`);continue}
  out.push(`${STATN[k]} ${v>=0?'+':'−'}${fv(k,Math.abs(v))}`)}
  return out.length?out:['No particular effect']}
const typeLine=it=>it.junk?'Junk':it.tool?'Tool':it.mat?'Material':RARITY[it.r].n+' '+(it.slot?(it.bn||SLOTN[it.slot]):'consumable');
function setHTML(it){if(!it.set)return'';const S=SETS[it.set],sc=setCounts()[it.set]||0,eq=new Set(Object.values(P.eq));
  return`<span class='st'><b style='color:${RARITY[7].c}'>${esc(S.n)}</b>`+S.pieces.map(p=>`<span style='color:${eq.has(p)?RARITY[7].c:'#6a6a5a'}'>${esc(ITEMS[p].n)}</span>`).join('')+Object.keys(S.txt).map(n=>`<span style='color:${sc>=+n?'#c9a24b':'#6a6a5a'}'>(${n}) ${S.txt[n]}</span>`).join('')+'</span>'}
function itemTip(id){const it=ITEMS[id],R=RARITY[it.r];
  const body=it.slot?gearLines(it).map(l=>`<span class='fx'>${l}</span>`).join(''):it.junk?`<span class='fx'>No use. A merchant will buy it.</span>`:`<span class='fx'>${it.fx||''}</span>`;
  const sp=sellPrice(id);return`<b style='color:${R.c}'>${esc(iname(id))}</b><span class='r' style='color:${R.c}'>${typeLine(it)}</span>${body}${it.slot==='weapon'?`<span class='fx' style='color:#8fb0d8'>${WT_NAME[wTypeOf(it)]} attacks: ${ARTS[wTypeOf(it)].map(a=>a.n).join(', ')}</span><span class='fx' style='color:${HEAVYW.includes(wTypeOf(it))?'#e0a07a':'#8a8670'}'>${HEAVYW.includes(wTypeOf(it))?'Two-handed: no shield.':'One-handed.'} Scales with ${LIGHTW.includes(wTypeOf(it))?'Dexterity':'Strength'}.</span><span class='fx' style='color:#8fb0d8'>${WT_NAME[wTypeOf(it)]} bonus: ${WTRAIT[wTypeOf(it)]}</span>`:''}${setHTML(it)}<i>${esc(it.d||'')}</i>${sp?`<span class='v'>Sells for ${sp} gold</span>`:''}`}
