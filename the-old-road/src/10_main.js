
/* ================= INPUT ================= */
const keys={};let padV={x:0,y:0};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys[k]=true;
  if(mode==='bst'&&(k==='escape'||k==='b')){e.preventDefault();closeBestiary()}
  else if(mode==='dlg'&&k==='escape'){e.preventDefault();const x=$('#dlgx');if(x.style.display!=='none')x.onclick()}
  else if(mode==='note'){if(k===' '||k==='enter'||k==='e'||k==='k'||k==='x'||k==='escape'){e.preventDefault();noteTap()}}
  else if(mode==='world'&&k==='l'){e.preventDefault();logOn()?closeLog():openLog()}
  else if(mode==='world'&&k==='escape'&&(logOn()||statsOn())){e.preventDefault();closeLog();closeStats()}
  else if(mode==='world'&&k==='c'){e.preventDefault();statsOn()?closeStats():openStats()}
  else if(mode==='battle'&&k==='escape'&&$('#sub').style.display==='grid'){e.preventDefault();hideSub()}
  else if((mode==='world'||mode==='battle')&&k==='escape'){e.preventDefault();gameMenu()}
  else if(mode==='world'){if(k===' '||k==='j'||k==='z')doSlash();if(k==='e'||k==='k'||k==='x'||k==='enter')doUse();if(k==='i'||k==='tab'){e.preventDefault();openPack()}if(k==='m'){openPack('map')}}
  else if(mode==='pack'&&(k==='escape'||k==='i'||k==='tab'||k==='m')){e.preventDefault();closePack()}
  if(mode==='battle'){const mp={'1':'attack','2':'skills','3':'guard','4':'items','5':'look','6':'flee'};if(mp[k])act(mp[k]);if(k==='enter'||k===' '||k==='f'){if(B&&B.qte)qteTap();else msgTap()}if(k==='escape')hideSub();
    if(B&&(k==='arrowleft'||k==='arrowright')){const a=alive();if(a.length>1){let i=a.indexOf(B.foes[B.tgt]);i=(i+(k==='arrowright'?1:-1)+a.length)%a.length;B.tgt=B.foes.indexOf(a[i]);updBUI()}}}
  if(k===' '||k.startsWith('arrow')||k==='tab')e.preventDefault()});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});
(()=>{const pad=$('#pad'),nub=$('#nub');let pid=null;
  const upd=e=>{const r=pad.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const d=Math.hypot(dx,dy),mx=48*(r.width/150);
    if(d>mx){dx*=mx/d;dy*=mx/d}nub.style.transform=`translate(${dx/(r.width/150)}px,${dy/(r.width/150)}px)`;/* full speed in any direction: divide by the clamped length, not the raw finger distance (which made you slow down whenever your thumb went past the edge, mostly on diagonals) */
    const dl=Math.hypot(dx,dy);padV=d<10?{x:0,y:0}:{x:dx/dl,y:dy/dl}};
  pad.addEventListener('pointerdown',e=>{pid=e.pointerId;pad.setPointerCapture(pid);upd(e)});
  pad.addEventListener('pointermove',e=>{if(e.pointerId===pid)upd(e)});
  const end=e=>{if(e.pointerId!==pid)return;pid=null;padV={x:0,y:0};nub.style.transform=''};
  pad.addEventListener('pointerup',end);pad.addEventListener('pointercancel',end)})();
const press=(el,fn)=>{el.addEventListener('pointerdown',e=>{e.preventDefault();el.classList.add('down');fn()});['pointerup','pointerleave','pointercancel'].forEach(t=>el.addEventListener(t,()=>el.classList.remove('down')))};
press($('#btnA'),()=>{if(mode==='note')noteTap();else if(mode==='world')doSlash()});
press($('#btnU'),()=>{if(mode==='note')noteTap();else if(mode==='world')doUse()});
/* text advances with a tap or click anywhere; the tap is swallowed so it never presses anything underneath */
let eatClick=0;
document.addEventListener('pointerdown',e=>{
  if(noteCur){e.preventDefault();e.stopPropagation();eatClick=performance.now();noteTap();return}
  if(mode==='battle'&&B&&!B.qte&&(typing||msgSkip)&&!e.target.closest('#logb,#clog,#stw,#acts [data-a=stats]')){e.preventDefault();e.stopPropagation();eatClick=performance.now();msgTap()}},true);
document.addEventListener('click',e=>{if(performance.now()-eatClick<500){e.preventDefault();e.stopPropagation()}},true);
/* the overworld Log and Stats windows don't pause anything: you keep moving and acting while they're up */
const logOn=()=>$('#clog').classList.contains('on'),statsOn=()=>$('#stw').classList.contains('on');
const openLog=()=>{const w=mode==='world';closeStats();if(w){logTab='world'}else if(mode==='battle'&&logTab==='world')logTab='out';$('#clog').classList.toggle('ow',w);$('#clog').classList.toggle('ob',mode==='battle');$('#clog').classList.add('on');renderLog()};
const closeLog=()=>{$('#clog').classList.remove('on','ow','ob');hideTip()};
const openStats=()=>{if(mode==='pack')closePack();if(mode!=='world'&&mode!=='battle')return;closeLog();hideTip();const b=mode==='battle';$('#stw').classList.toggle('ob',b);$('#stw').classList.toggle('ow',!b);$('#stw').classList.add('on');renderStats()};
const closeStats=()=>{$('#stw').classList.remove('on');hideTip()};
/* in battle, the Stats and Log windows sit in the gap between the enemy panel and your panel */
function fitBattleOv(el){const a=$('#app').getBoundingClientRect(),e=$('#epanel').getBoundingClientRect(),p=$('#ppanel').getBoundingClientRect();
  /* across: from the left of the enemy panel to the right of yours (so it never covers the buttons in landscape) */
  el.style.left=(e.left-a.left)+'px';el.style.width=(p.right-e.left)+'px';el.style.transform='none';
  /* down: the gap between the two panels; if that is too small to read (many foes, short screens), use the whole battle scene */
  const lb=$('#logb'),ptop=lb.parentNode.id==='ppanel'?Math.min(p.top,lb.getBoundingClientRect().top):p.top;let t=e.bottom-a.top+8,bt=a.bottom-ptop+6;const minH=Math.min(220,a.height*.5);
  if(a.height-t-bt<minH){t=e.top-a.top;bt=a.bottom-p.bottom}el.style.top=t+'px';el.style.bottom=bt+'px'}
function unfitOv(el){el.style.top='';el.style.bottom='';el.style.left='';el.style.width='';el.style.transform=''}
let ovT=0;function updOverlays(dt){for(const el of[$('#stw'),$('#clog')]){if(el.classList.contains('on')&&el.classList.contains('ob')&&mode==='battle')fitBattleOv(el);else if(el.style.top||el.style.left)unfitOv(el)}if(mode!=='world'&&mode!=='battle'&&mode!=='trans'){if(logOn())closeLog();if(statsOn())closeStats()}if(mode==='trans'&&statsOn())closeStats();if(statsOn()&&$('#stw').classList.contains('ob')&&mode!=='battle')closeStats();if(mode==='world'&&logOn()&&$('#clog').classList.contains('ob')){$('#clog').classList.remove('ob');$('#clog').classList.add('ow')}if(mode==='battle'&&logOn()&&$('#clog').classList.contains('ow')){$('#clog').classList.remove('ow');$('#clog').classList.add('ob');if(logTab==='world'){logTab='out';renderLog()}}if(statsOn()&&(ovT+=dt)>.4){ovT=0;renderStats()}}
$('#stwx').addEventListener('click',closeStats);
document.querySelectorAll('#menu4 .mb').forEach(b=>press(b,()=>{if(b.dataset.o==='stats'){if(statsOn())closeStats();else if(mode==='pack'){if(packTab==='stats')closePack();else{packTab='stats';sel=null;renderPack()}}else openStats();return}if(b.dataset.o==='log'){if(mode==='world'){logOn()?closeLog():openLog()}else if(mode==='pack'){if(packTab==='log')closePack();else{packTab='log';logTab='world';sel=null;renderPack()}}return}if(mode==='world')openPack(b.dataset.o);else if(mode==='pack'&&packTab===b.dataset.o)closePack();else if(mode==='pack'){packTab=b.dataset.o;sel=null;renderPack()}}));
$('#mute').addEventListener('click',()=>{AU.init();AU.toggle()});
/* fullscreen: only offered where the browser allows it and the game isn't already running as an installed app */
{const fb=$('#fsb'),de=document.documentElement,inApp=matchMedia('(display-mode: fullscreen),(display-mode: standalone)').matches;
  if(inApp||!(de.requestFullscreen||de.webkitRequestFullscreen)||document.fullscreenEnabled===false)fb.classList.add('no');
  fb.addEventListener('click',()=>{AU.init();const fe=document.fullscreenElement||document.webkitFullscreenElement;
    if(fe)(document.exitFullscreen||document.webkitExitFullscreen).call(document);
    else{const p=(de.requestFullscreen||de.webkitRequestFullscreen).call(de,{navigationUI:'hide'});if(p&&p.catch)p.catch(()=>notice('This page isn\'t allowed to go fullscreen here.'))}})}
/* on the hosted test site, make it installable to the home screen (fullscreen, own icon) and playable offline */
if(/github\.io$/.test(location.hostname)){const l=document.createElement('link');l.rel='manifest';l.href='manifest.webmanifest';document.head.appendChild(l);
  if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{})}
document.querySelectorAll('#acts button').forEach(b=>b.addEventListener('click',()=>act(b.dataset.a)));

$('#rise').addEventListener('click',()=>{if(DIFF.hc){deleteSave();location.reload();return}respawn()});
/* non-hardcore death: wake at your last fire. You lose 10% of this level's experience (never a level) and 30% of your coin; the area's dead get back up */
function respawn(){$('#dead').style.display='none';const lx=Math.min(P.xp,Math.round(nextXp(P.lv)*.1)),lg=Math.floor(P.gold*.3);P.xp-=lx;P.gold-=lg;P.hp=P.max;P.mp=P.mmax;P.st={};
  for(const L of allLevels(AR)){for(const s of L.spawns)if(s.dead)s.dead=0;L.mobs=null}
  const lf=AR.lastFire||{zi:0,fi:0};mode='world';goFire(AR.i,lf.zi,lf.fi,'You wake');setTimeout(()=>notice(`You wake by the fire, aching. You have lost ${lx} experience and ${lg} gold.`),1300)}
$('#winc').addEventListener('click',()=>{$('#win').style.display='none';mode='world';P.inv=2});

/* ================= LOOP ================= */
function drawTitle(){cam.x=Math.round(clamp(START.x*T+60+Math.sin(time*.05)*120-W/2,0,MW*T-W));cam.y=Math.round(clamp(START.y*T-140-H/2,0,MH*T-H));
  const sx=P.x,sy=P.y;P.x=-999;P.y=-999;drawWorld();P.x=sx;P.y=sy}
let pickM='normal';const selM=m=>{pickM=m;document.querySelectorAll('#modes .mode').forEach(x=>x.classList.toggle('on',x.dataset.m===m));$('#mdesc').textContent=MODES[m].d};
document.querySelectorAll('#modes .mode').forEach(b=>b.addEventListener('click',()=>selM(b.dataset.m)));selM('normal');
const SI=saveInfo();let newArmed=false;
if(SI){$('#cont').style.display='flex';const s=SI.sum;$('#csum').textContent=`Level ${s.lv} · ${s.mode} · ${s.area}`;$('#begin').textContent='NEW GAME'}
$('#cont').addEventListener('click',async()=>{if(await loadGame())startGame(diffKey());else{$('#cont').style.display='none';$('#mdesc').textContent='That save could not be read.'}});
$('#begin').addEventListener('click',()=>{if(SI&&!newArmed){newArmed=true;$('#mdesc').textContent='A new game will erase your saved knight. Tap NEW GAME again to go ahead.';return}if(SI)deleteSave();if(MODES[pickM].h>1)regenFirst(pickM);startGame(pickM)});
/* Man and Hardcore change how maps are built (one fire fewer; no Mortimer in Hardcore), so the first map is rebuilt for them */
function regenFirst(m){DIFF=MODES[m];AREAS.length=0;LV=null;const a=getArea(0);bindLevel(getZone(a,0));a.lastFire={zi:0,fi:0};P.x=START.x*T+8;P.y=(START.y+1)*T+14;resetMobs()}
$('#menub').addEventListener('click',()=>gameMenu());
$('#bstx').addEventListener('click',closeBestiary);$('#bgrid').addEventListener('click',e=>{const c=e.target.closest('.bc[data-k]');if(!c)return;bstSel=c.dataset.k;renderBestiary()});
$('#logb').addEventListener('click',()=>logOn()?closeLog():openLog());
['#stwb','#pk-stats'].forEach(sel=>$(sel).addEventListener('click',e=>{const a=e.target.closest('[data-attr]');if(!a)return;e.stopPropagation();spendAttr(a.dataset.attr);hideTip();if(statsOn())renderStats();if(mode==='pack'&&packTab==='stats')renderStats('#pk-stats');if(B&&mode==='battle')updBUI()}));document.querySelectorAll('#clogt b').forEach(b=>b.addEventListener('click',()=>{logTab=b.dataset.t;renderLog()}));$('#clogx').addEventListener('click',closeLog);
function startGame(m){DIFF=MODES[m];AU.init();$('#title').style.display='none';$('#app').classList.remove('ontitle');mode='world';updCam();
  setTimeout(()=>banner(AR.def.name),500);setTimeout(()=>SFX.howl(),2500)}
let last=performance.now();
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;time+=dt;
  if(TR){TR.t+=dt;if(!TR.fired&&TR.t>=.55){TR.fired=true;TR.fn()}if(TR.t>=TR.dur)TR=null}
  if(mode==='world'&&noteCur)mode='note';  /* a notice that popped up while a dialog was closing still pauses the world */
  if(mode==='world')updWorld(dt);
  if(mode!=='title'&&mode!=='dead'&&mode!=='load')rec('time',dt);
  updParticles(dt);
  if(mode==='title')drawTitle();else if(scene==='battle')drawBattle(dt);else{if(mode!=='world')updCam();drawWorld()}
  drawTrans();if(mode!=='title')updHud();
  updOverlays(dt);
  if(mode==='pack'&&packTab==='map'&&Math.floor(time*3)!==Math.floor((time-dt)*3))drawMap();
  if(scene!=='battle'&&mode!=='title'&&LV&&LV.chunks)prefetchChunks(5);
  requestAnimationFrame(loop)}

const AR0=getArea(0);bindLevel(getZone(AR0,0));AR0.lastFire={zi:0,fi:0};
P.x=START.x*T+8;P.y=(START.y+1)*T+14;recalc();P.hp=P.max;P.mp=P.mmax;buildKnight();resetMobs();
if(!SIM_OUTER){resize();setUI('world');updHud();$('#app').classList.add('ontitle');requestAnimationFrame(loop)}
</script>
</body>
</html>
