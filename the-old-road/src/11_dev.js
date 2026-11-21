
/* ================= PLAYTEST TOOLS =================
   Hidden. Open with the ` key, or tap the Lv box in the HUD 5 times quickly (that also shows a 🛠 button). */
const DEV={god:false,ohk:false,mana:false,peace:false,noclip:false,spd:1,on:false};
try{DEV.on=localStorage.getItem('hm_dev')==='1'}catch(e){}
function devKillBoss(){const Z=getZone(AR,LASTZ);AR.bossDead=true;for(const s of Z.spawns)if(s.boss){s.perm=1;s.dead=0}
  for(let i=0;i<Z.map.length;i++)if(Z.map[i]===BARRIER)Z.map[i]=G;if(LV===Z){mobs=mobs.filter(m=>!m.boss);LV.mobs=mobs;bossMob=null}Z.chunks&&Z.chunks.clear&&Z.chunks.clear()}
/* dev: fill every gear slot with one item of the chosen rarity and tier (replaces what you wear) */
function devGearAll(r,tier){const slots=[['weapon','weapon'],['helm','helm'],['armor','armor'],['cloak','cloak'],['legs','legs'],['gloves','gloves'],['boots','boots'],['belt','belt'],['amulet','amulet'],['ring','ring'],['ring2','ring'],['charm','charm'],['charm2','charm'],['shield','shield']];
  const one=(slot)=>{if(r===6){const u=Object.keys(UNIQ).filter(x=>ITEMS[x].slot===slot);if(u.length)return rollUnique(pick(u))}
    if(r===7){const s=[];for(const k in SETS)s.push(...SETS[k].pieces.filter(x=>ITEMS[x].slot===slot));if(s.length)return pick(s)}
    return genGear(tier,{slot,exact:Math.min(r,5),noU:1})};
  let n=0;for(const[sl,slot]of slots){if(sl==='shield'&&P.eq.weapon&&HEAVYW.includes(wTypeOf(ITEMS[P.eq.weapon]))){P.eq.shield=null;continue}P.eq[sl]=one(slot);n++}
  recalc();P.hp=P.max;P.mp=P.mmax;buildKnight();if(typeof updHud==='function')updHud();devMsg(`Equipped ${n} items (${RARITY[r].n}, tier ${tier}).`)}
function devGear(r,tier){let id;if(r===6){const u=Object.keys(UNIQ).filter(x=>UNIQ[x]<=Math.max(tier,0)||UNIQ[x]===9&&tier>=3);id=rollUnique(pick(u.length?u:Object.keys(UNIQ)))}
  else if(r===7){const s=[];for(const k in SETS)s.push(...SETS[k].pieces);id=pick(s)}else id=genGear(tier,{exact:r,noU:1});
  if(!addItem(id)){devMsg('Bag is full.');return}devMsg('Added '+iname(id)+' ('+RARITY[ITEMS[id].r].n+')')}
function devSetLevel(n){n=clamp(n,1,40);const d=n-P.lv;P.lv=n;P.xp=0;P.pts=Math.max(0,P.pts+d);P.apts=Math.max(0,(P.apts||0)+d*APL);recalc();P.hp=P.max;P.mp=P.mmax;updHud();devMsg('Level '+n+(d>0?` (+${d} talent points)`:''))}
function devMsg(t){const e=document.getElementById('devmsg');if(e)e.textContent=t}
function devAct(k){const v=document.getElementById('dv_'+k);
  switch(k){
    case'go':{const ai=+$('#dv_area').value,zi=+$('#dv_zone').value;closeDev();goFire(ai,zi,0);break}
    case'boss':{const ai=+$('#dv_area').value;closeDev();const Z=getZone(getArea(ai),LASTZ);let bi=0,bd=1e9;Z.fires.forEach((f,i)=>{if(f.boss)return;const d=Math.hypot(f.x-Z.arena.x,f.y-Z.arena.y);if(d<bd){bd=d;bi=i}});goFire(ai,LASTZ,bi);
      /* then drop you on open ground just outside the arena, on the side facing that fire */
      setTimeout(()=>{if(LV!==Z)return;const A=Z.arena,f=Z.fires[bi],ang=Math.atan2(f.y-A.y,f.x-A.x);for(let d=A.r+2;d<A.r+12;d++){for(const da of[0,.3,-.3,.6,-.6,1,-1]){const tx=Math.round(A.x+Math.cos(ang+da)*d),ty=Math.round(A.y+Math.sin(ang+da)*d),px=tx*T+8,py=ty*T+12;if(passable(px,py)){P.x=px;P.y=py;return}}}},900);break}
    case'killboss':devKillBoss();devMsg('Boss of '+AR.def.name+' marked dead. Its seal is open.');break;
    case'fires':for(let zi=0;zi<NZ;zi++){const Z=getZone(AR,zi);for(const f of Z.fires)f.lit=true}bindLevel(LV);devMsg('Every fire in '+AR.def.name+' is lit.');break;
    case'reveal':for(const L of allLevels(AR))L.seen&&L.seen.fill(1);devMsg('Map revealed for this area.');break;
    case'killall':for(const m of mobs)if(!m.boss&&m.sp)m.sp.dead=1;mobs=mobs.filter(m=>m.boss);LV.mobs=mobs;devMsg('Cleared this map.');break;
    case'respawn':for(const L of allLevels(AR)){for(const s of L.spawns){s.dead=0;if(!s.boss)s.perm=0}L.mobs=null}resetMobs();devMsg('Everything is back.');break;
    case'event':closeDev();triggerEvent();break;
    case'blood':EV.blood=180;devMsg('Blood moon for 3 minutes.');break;
    case'lvup':devSetLevel(P.lv+1);break;case'lvdn':devSetLevel(P.lv-1);break;case'lvset':devSetLevel(+$('#dv_lv').value||1);break;
    case'heal':P.hp=P.max;P.mp=P.mmax;P.st={};updHud();devMsg('Fully restored.');break;
    case'gold':P.gold+=500;updHud();devMsg('+500 gold.');break;
    case'pts':P.pts+=5;devMsg('+5 talent points.');break;
    case'retal':{let n=0;for(const k in P.tal)n+=P.tal[k];P.tal={};P.pts+=n;recalc();devMsg('Talents refunded ('+n+' points).');break}
    case'gear':devGear(+$('#dv_rar').value,+$('#dv_tier').value);break;
    case'gearall':devGearAll(+$('#dv_rar').value,+$('#dv_tier').value);break;
    case'tools':for(const t in TOOLS)P.tools[t]=1;devMsg('All four tools.');break;
    case'ore':for(const o of['ore1','ore2','ore3','ironheart'])addItem(o,o==='ironheart'?1:6);devMsg('Ore added.');break;
    case'pots':addItem('potion',5);addItem('bandage',5);addItem('bitterleaf',3);addItem('hallowed',3);addItem('lampoil',2);addItem('elixir',1);devMsg('Consumables added.');break;
    case'clearbag':P.bag=P.bag.filter(b=>ITEMS[b.id].tool);devMsg('Bag emptied.');break;
    case'fight':{const kd=$('#dv_kind').value;closeDev();const m=makeMob(kd,P.x+14,P.y);if(KINDS[kd].pack)m.n=KINDS[kd].units.length;if(KINDS[kd].boss)m.boss=1;mobs.push(m);LV.mobs=mobs;startBattle(m,$('#dv_first').value);break}
    case'win':if(B&&!B.over){for(const f of B.foes)f.hp=0;closeDev();if(B.turnDone)act('guard')}else devMsg('Not in a battle.');break;
    default:if(k in DEV){DEV[k]=!DEV[k];devRender()}}}
function devRender(){const el=$('#dev');if(!el)return;const sa=$('#dv_area')?+$('#dv_area').value:AR.i;
  const tg=(k,l)=>`<button class="dvb${DEV[k]?' on':''}" onclick="devAct('${k}')">${l}: ${DEV[k]?'ON':'off'}</button>`,b=(k,l)=>`<button class="dvb" onclick="devAct('${k}')">${l}</button>`;
  const areas=AREA_DEFS.map((a,i)=>`<option value="${i}"${sa===i?' selected':''}>${a.name}</option>`).join('');
  const zones=[0,1,2].map(z=>`<option value="${z}">${z+1}: ${AREA_DEFS[sa].zones[z]}</option>`).join('');
  const kinds=Object.keys(KINDS).map(k=>`<option value="${k}">${KINDS[k].name}${KINDS[k].boss?' (boss)':KINDS[k].pack?' (pack)':''}</option>`).join('');
  el.innerHTML=`<div class="dvh"><b>Playtest tools</b><span onclick="closeDev()" class="dvx">✕</span></div><div id="devmsg">${AR.def.name} · ${LV.name} · Lv ${P.lv}</div>
  <h4>Travel</h4><div class="dvr"><select id="dv_area" onchange="devRender()">${areas}</select><select id="dv_zone">${zones}</select></div>
  <div class="dvr">${b('go','Go to map')}${b('boss','Go to boss')}${b('killboss','Kill this area\'s boss')}</div>
  <div class="dvr">${b('fires','Light all fires here')}${b('reveal','Reveal map')}</div>
  <h4>Cheats</h4><div class="dvr">${tg('god','God mode')}${tg('ohk','One-hit kills')}${tg('mana','Infinite MP')}</div>
  <div class="dvr">${tg('peace','Enemies ignore you')}${tg('noclip','Walk through walls')}<button class="dvb" onclick="DEV.spd=DEV.spd===1?2.5:1;devRender()">Speed: ×${DEV.spd}</button></div>
  <h4>You</h4><div class="dvr">${b('lvdn','Level −1')}${b('lvup','Level +1')}<input id="dv_lv" type="number" min="1" max="40" value="${P.lv}" style="width:56px">${b('lvset','Set level')}</div>
  <div class="dvr">${b('heal','Full heal')}${b('gold','+500 gold')}${b('pts','+5 talent pts')}${b('retal','Refund talents')}</div>
  <h4>Items</h4><div class="dvr"><select id="dv_rar">${[1,2,3,4,5,6,7].map(r=>`<option value="${r}" style="color:${RARITY[r].c}"${r===3?' selected':''}>${RARITY[r].n}</option>`).join('')}</select>
    <select id="dv_tier">${[0,1,2,3].map(t=>`<option value="${t}"${t===Math.min(3,AR.i)?' selected':''}>Tier ${t} (${AREA_DEFS[t].name})</option>`).join('')}</select></div>
  <div class="dvr">${b('gear','Give 1')}${b('gearall','Equip all slots')}${b('tools','All tools')}${b('ore','Ore')}${b('pots','Potions etc.')}${b('clearbag','Empty bag')}</div>
  <h4>Fights &amp; world</h4><div class="dvr"><select id="dv_kind">${kinds}</select><select id="dv_first"><option value="contact">Normal start</option><option value="player">I strike first</option><option value="ambush">Ambushed</option></select>${b('fight','Fight now')}</div>
  <div class="dvr">${b('win','Win current battle')}${b('killall','Clear this map')}${b('respawn','Respawn area')}${b('event','Random event')}${b('blood','Blood moon')}</div>`}
let devPrev=null;
function openDev(){if(!$('#dev')){const d=document.createElement('div');d.id='dev';document.getElementById('app').appendChild(d)}
  if(mode==='world'||mode==='note'){devPrev=mode;mode='dev';padV={x:0,y:0}}devRender();$('#dev').style.display='block'}
function closeDev(){const d=$('#dev');if(d)d.style.display='none';if(mode==='dev')mode=devPrev||'world';devPrev=null}
function devEnable(){DEV.on=true;try{localStorage.setItem('hm_dev','1')}catch(e){}$('#devbtn').style.display='flex';openDev()}
(()=>{const st=document.createElement('style');st.textContent=`#dev{position:absolute;z-index:80;left:6px;right:6px;top:6px;max-height:calc(100% - 12px);overflow:auto;display:none;background:#0d100dee;border:1px solid #c9a24b88;padding:10px 12px;font-family:Inter,sans-serif;font-size:14px;color:#e3d9bb;box-shadow:0 8px 40px #000}
#dev h4{margin:10px 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#c9a24b}.dvh{display:flex;justify-content:space-between;align-items:center;font-size:16px}.dvx{cursor:pointer;padding:2px 8px;font-size:18px}
#devmsg{color:#8fe08a;font-size:13px;margin-top:4px;min-height:18px}.dvr{display:flex;flex-wrap:wrap;gap:5px;margin:4px 0}
.dvb{background:#1d241d;color:#e3d9bb;border:1px solid #4a5c4c;padding:7px 9px;font:600 13px Inter,sans-serif;cursor:pointer;border-radius:3px}.dvb:active{filter:brightness(1.4)}.dvb.on{background:#3a5a2a;border-color:#8fe08a}
#dev select,#dev input{background:#141a14;color:#e3d9bb;border:1px solid #4a5c4c;padding:6px;font:13px Inter,sans-serif;max-width:100%}
#devbtn{position:absolute;z-index:7;right:8px;top:64px;width:34px;height:34px;display:none;align-items:center;justify-content:center;background:#141a14cc;border:1px solid #c9a24b88;font-size:17px;cursor:pointer;border-radius:4px}`;document.head.appendChild(st);
  const bt=document.createElement('div');bt.id='devbtn';bt.textContent='🛠';bt.title='Playtest tools';bt.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();$('#dev')&&$('#dev').style.display==='block'?closeDev():openDev()});document.getElementById('app').appendChild(bt);
  if(DEV.on)bt.style.display='flex';
  let taps=[];const lv=document.getElementById('hlv').parentElement;lv.addEventListener('pointerdown',()=>{const t=performance.now();taps=taps.filter(x=>t-x<1500);taps.push(t);if(taps.length>=5){taps=[];devEnable()}});
  addEventListener('keydown',e=>{if(e.code==='Backquote'||e.key==='`'||e.key==='~'||e.key==='F2'){e.preventDefault();if(!DEV.on)devEnable();else $('#dev')&&$('#dev').style.display==='block'?closeDev():openDev()}});
  setInterval(()=>{if(DEV.god&&P.hp<P.max&&mode!=='dead')P.hp=P.max;if(DEV.mana)P.mp=P.mmax},100)})();
