
/* ================= HUD / TOAST ================= */
let toastTimer=null;
function toast(t,ms,warn){notice(t)}
/* passing remarks: shown and gone on their own, no tap needed */
const amb=(t,ms=3200,warn)=>{if(typeof clog==='function')clog(t,'','#a8a090','','world');return toastOld(t,ms,warn)};
function toastOld(t,ms=2800,warn){const el=$('#toast');el.textContent=t;el.className=warn?'on warn':'on';clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.className=warn?'warn':'',ms)}
let hudKey='',hudFrame=0;
function updHud(){
  $('#hhp').style.width=(clamp(P.hp/P.max,0,1)*100)+'%';$('#hhpn').textContent=`${Math.max(0,P.hp)}/${P.max}`;$('#hmp').style.width=(P.mp/P.mmax*100)+'%';$('#hmpn').textContent=`${P.mp}/${P.mmax}`;
  $('#hlv').textContent=P.lv;$('#hgold').textContent=P.gold;$('#hxp').style.width=(P.xp/nextXp(P.lv)*100)+'%';$('#hxpn').textContent=`${P.xp}/${nextXp(P.lv)}`;$('#bdot').style.display=P.pts>0?'block':'none';$('#sdot').style.display=P.apts>0?'block':'none';
  if(!(hudFrame++%20)){$('#hlvrow').dataset.tip=`<b>Level ${P.lv}</b><span class='r'>${P.xp} / ${nextXp(P.lv)} XP</span><span class='fx'>${nextXp(P.lv)-P.xp} XP to level ${P.lv+1}.</span>`;{const pc=Math.max(0,Math.min(100,Math.round((1-P.xp/nextXp(P.lv))*100)));$('#hlvt').dataset.tip=`<b>Level ${P.lv}</b><span class='fx'>${pc}% left until level ${P.lv+1}.</span>`}$('#hhead').dataset.tip=pTip(true);
    if(typeof KNW!=='undefined'&&KNW){const hx=$('#headc').getContext('2d');hx.imageSmoothingEnabled=false;hx.clearRect(0,0,16,20);hx.drawImage(KNW.down[0],-KPAD+2,-KPAD+2)}}
  const key=[P.blessed,EV.blood>0,EV.fog>0,P.regen,JSON.stringify(P.st)].join();if(key!==hudKey){hudKey=key;let h='';
    if(P.blessed)h+=iconHTML('blessed',0,`<span class='r'>${P.blessed} fight${P.blessed>1?'s':''} left</span>`);if(EV.blood>0)h+=iconHTML('bloodmoon');if(EV.fog>0)h+=iconHTML('fog');for(const k of['poison','bleed','burn','blind','wither'])if(P.st[k])h+=iconHTML(k,P.st[k]);$('#hbuffs').innerHTML=iconRow(h.match(/<img[^>]*>/g)||[])}}

/* ================= TOOLTIPS ================= */
const tipEl=$('#tip');let tipTimer=null,tipSuppress=false,tipOwner=null;
function showTip(el){const t=el.dataset.tip;if(!t)return;tipEl.innerHTML=t;tipEl.style.display='block';tipOwner=el;tipEl.classList.remove('cols');tipEl.style.zoom='';
  /* a tooltip taller than the screen goes into two columns, and if it still doesn't fit it is scaled down: it never runs off the top or bottom */
  {const ah=$('#app').getBoundingClientRect().height-12;if(tipEl.offsetHeight>ah){tipEl.classList.add('cols');if(tipEl.offsetHeight>ah)tipEl.style.zoom=Math.max(.6,ah/tipEl.offsetHeight)}}
  const r=el.getBoundingClientRect(),ar=$('#app').getBoundingClientRect(),zz=+tipEl.style.zoom||1,tw=tipEl.offsetWidth*zz,th=tipEl.offsetHeight*zz;
  let x=clamp(r.left+r.width/2-ar.left-tw/2,6,ar.width-tw-6),y=r.top-ar.top-th-8;if(y<6)y=r.bottom-ar.top+8;if(y+th>ar.height-6)y=ar.height-th-6;
  /* landscape battle: anything in the right-hand action panel gets its tooltip to the LEFT of the panel, over the battle scene, never over the buttons */
  {const bu=$('#bui');if(mode==='battle'&&bu&&bu.contains(el)&&matchMedia('(orientation:landscape) and (max-height:640px)').matches){const br=bu.getBoundingClientRect();
    x=Math.max(6,br.left-ar.left-tw-10);y=clamp(r.top+r.height/2-ar.top-th/2,6,ar.height-th-6)}}
  tipEl.style.left=(x/zz)+'px';tipEl.style.top=(Math.max(6,y)/zz)+'px'}
function hideTip(){tipEl.style.display='none';tipOwner=null}
/* on a phone, a plain tap opens these at once (there is no hover): HUD, status icons, every row of the Stats screen */
const instant=el=>el.classList.contains('si')||el.closest('.statg')||el.closest('.stgrid')||el.closest('#stwb')||el.closest('#hudL')||el.closest('.hb');
document.addEventListener('pointerdown',e=>{const el=e.target.closest('[data-tip]');
  if(tipOwner&&tipOwner!==el)hideTip();clearTimeout(tipTimer);
  if(!el||e.pointerType==='mouse')return;
  if(instant(el)&&!el.classList.contains('hb')){if(tipOwner===el)hideTip();else showTip(el);return}
  tipTimer=setTimeout(()=>{showTip(el);tipSuppress=true;if(navigator.vibrate)try{navigator.vibrate(8)}catch(_){}},430)},true);
document.addEventListener('pointerup',()=>clearTimeout(tipTimer),true);
document.addEventListener('pointercancel',()=>clearTimeout(tipTimer),true);
document.addEventListener('click',e=>{if(tipSuppress){tipSuppress=false;e.stopPropagation();e.preventDefault()}},true);
document.addEventListener('pointerover',e=>{if(e.pointerType!=='mouse')return;const el=e.target.closest('[data-tip]');clearTimeout(tipTimer);if(!el){hideTip();return}if(el!==tipOwner)tipTimer=setTimeout(()=>showTip(el),220)});
document.addEventListener('contextmenu',e=>e.preventDefault());

/* ================= DIALOG ================= */
let dlgPrev=null;
let dlgKeep=false,dlgLastScroll=0;
/* menus have no Leave/Back button: the ✕ in the corner (or Esc) does that, and backs out of nested menus all the way */
const DLG_CANCEL=/^(leave|back|stay|keep playing|resume|close|done|cancel|not now|never mind)$/i;let dlgAbort=false;
function dialog(title,body,choices,raw,tips){return new Promise(res=>{let ci=-1;choices.forEach((c,i)=>{if(DLG_CANCEL.test(String(c).trim()))ci=i});
  if(dlgAbort&&ci>=0){res(ci);return}dlgAbort=false;
  dlgPrev=mode;mode='dlg';padV={x:0,y:0};hideTip();
  $('#dlgt').textContent=title;$('#dlgb').innerHTML=raw?body:esc(body);
  $('#dlgc').innerHTML=choices.map((c,i)=>i===ci&&!/^resume$/i.test(String(c).trim())?'':`<div class="btn${i===0&&choices.length>1&&!tips?' pri':''}" data-i="${i}"${tips&&tips[i]?` data-tip="${esc(tips[i])}"`:''}>${esc(c)}</div>`).join('');
  const X=$('#dlgx');X.style.display=ci>=0?'block':'none';X.onclick=ci<0?null:()=>{/* ✕ is the same as that screen's Back/Leave: one step back, not all the way out */$('#dlg').style.display='none';hideTip();mode=dlgPrev==='dlg'||dlgPrev==='note'?'world':dlgPrev;res(ci)};
  $('#dlg').style.display='flex';
  $('#dlgc').scrollTop=dlgKeep?dlgLastScroll:0;dlgKeep=false;$('#dlgc').querySelectorAll('.btn').forEach(b=>b.onclick=()=>{dlgLastScroll=$('#dlgc').scrollTop;if(typeof clog==='function'&&dlgPrev!=='battle'){const bd=plainT(raw?body:esc(body)).trim(),ch=choices[+b.dataset.i];clog(choices.length>1?`${title} → ${ch}`:`${title}${bd?': '+bd.split('\n')[0].slice(0,80)+(bd.length>80?'…':''):''}`,bd,'#d8cfb0','','world')}$('#dlg').style.display='none';hideTip();mode=dlgPrev==='dlg'||dlgPrev==='note'?'world':dlgPrev;res(+b.dataset.i)})})}

/* ================= PACK ================= */
const SLOTS=[['helm','HEAD'],['amulet','NECK'],['armor','CHEST'],['legs','LEGS'],['boots','FEET'],['weapon','MAIN HAND'],['shield','OFF HAND'],['cloak','BACK'],['gloves','HANDS'],['belt','BELT'],['ring','RING'],['ring2','RING'],['charm','CHARM'],['charm2','CHARM']];
let packTab='gear',sel=null,talTree='blade';
function openPack(tab,fromFire){if(mode!=='world')return;MV=null;mapPick=null;atFire=!!fromFire;$('#pgold').textContent='◈ '+P.gold;$('#app').classList.add('inpk');mode='pack';padV={x:0,y:0};sel=null;hideTip();$('#toast').className='';if(tab)packTab=tab;$('#pack').style.display='flex';renderPack()}
function closePack(){atFire=false;if(TRADE){TRADE=null;$('#pack').classList.remove('trade');if(['buy','gamble','stash','forge'].includes(packTab))packTab='bag'}$('#pack').style.display='none';$('#app').classList.remove('inpk');hideTip();if(mode==='pack')mode='world'}
function pflash(t){const e=$('#pmsg');e.textContent=t;e.style.opacity=1;clearTimeout(e._t);e._t=setTimeout(()=>e.style.opacity=0,2200)}
function specialLines(it){const st={};for(const k in it.st||{})if(!STATN[k]&&k!=='poisonImm')st[k]=it.st[k];return Object.keys(st).length?gearLines({st}):[]}
function compareLines(it,cur){const st=it.st||{},cs=cur?(cur.st||{}):{},keys=[...new Set([...Object.keys(st),...Object.keys(cs)])].filter(k=>STATN[k]||k==='poisonImm');
  return keys.map(k=>{const v=st[k]||0,c=cs[k]||0;if(k==='poisonImm')return v?'<div>Immune to poison</div>':(c?'<div class="dn">Loses poison immunity</div>':'');
    const diff=v-c,dt=cur&&diff?` <span class="${diff>0?'up':'dn'}">${diff>0?'▲':'▼'}${fv(k,Math.abs(diff))}</span>`:'';if(!v&&!dt)return'';
    return`<div>${STATN[k]} ${v>=0?'+':'−'}${fv(k,Math.abs(v))}${dt}</div>`}).join('')||'<div>No particular effect</div>'}
/* ---- comparing gear: base values only (anvil reinforcement is left out), every modifier listed ---- */
function baseSt(it){const s=Object.assign({},it.st||{});if(it.up){if(it.ba!=null)s.atk=it.ba;const cr=(it.up>=5?.03:0)+(it.up>=10?.03:0);if(cr){s.crit=Math.round(((s.crit||0)-cr)*100)/100;if(!s.crit)delete s.crit}}return s}
const lineFor=(k,v)=>gearLines({st:{[k]:v}})[0];
const fmtv=(k,v)=>k.startsWith('tal_')?(v<0?'−':'+')+Math.abs(v):(v<0?'−':'+')+fv(k,Math.abs(v));
/* comparing gear: one plain line per stat, the difference only ("+1 Speed", "−2 Armour"); green if it goes up, red if down */
function diffLines(nw,old){const a=baseSt(nw),b=old?baseSt(old):{},out=[];
  for(const k of [...new Set([...Object.keys(a),...Object.keys(b)])].sort((x,y)=>statRank(x)-statRank(y))){const va=a[k]||0,vb=b[k]||0,d=Math.round((va-vb)*1000)/1000;if(!d)continue;
    const nm=k.startsWith('tal_')?(TALN[k.slice(4)]?TALN[k.slice(4)].name:k):(STATN[k]||k);out.push([d>0?'up':'dn',`${fmtv(k,d)} ${nm}`])}
  if(nw.slot==='weapon'){const t1=wTypeOf(nw),t0=old?wTypeOf(old):'sword';if(t1!==t0){out.push(['nt',`Makes you fight with a ${WT_NAME[t1].toLowerCase()} (attacks: ${ARTS[t1].map(x=>x.n).join(', ')})`]);
    const da=Math.round((WACC[t1]-WACC[t0])*100);if(da)out.push([da>0?'up':'dn',`${da>0?'+':'−'}${Math.abs(da)}% Accuracy`]);out.push(['nt',`Weapon bonus: ${WTRAIT[t1]}`])}}
  /* sets: what wearing this would switch on (or off) */
  const sc=setCounts(),after=Object.assign({},sc);if(old&&old.set)after[old.set]=(after[old.set]||1)-1;if(nw.set)after[nw.set]=(after[nw.set]||0)+1;
  for(const k of new Set([nw.set,old&&old.set].filter(Boolean))){const S=SETS[k],n0=sc[k]||0,n1=after[k]||0;
    for(const n in S.b){const t=+n;if(n1>=t&&n0<t)out.push(['up',`Set bonus ${t}/${S.pieces.length}: ${S.txt[n]}`]);else if(n0>=t&&n1<t)out.push(['dn',`Loses set bonus ${t}/${S.pieces.length}: ${S.txt[n]}`])}}
  return out}
function cmpHTML(id,oid){const nw=ITEMS[id],old=oid?ITEMS[oid]:null,dl=diffLines(nw,old);
  const box=(t,h)=>`<div class="cbox"><div class="cl">${t}</div>${h}</div>`;
  return`<div class="cmp">${box('This',itemTip(id))}${box(oid?'Equipped now':'Equipped now: nothing',oid?itemTip(oid):'<i>That slot is empty.</i>')}</div>
    <div class="cdiff"><div class="cl">If you equip it</div>${dl.length?dl.map(([c,t])=>`<div class="${c}">${c==='up'?'▲ ':c==='dn'?'▼ ':'• '}${esc(t)}</div>`).join(''):'<div>No difference at all.</div>'}
    ${(nw.up||(old&&old.up))?'<div class="nt">Compared at base values. Anvil reinforcement isn\'t counted.</div>':'<div class="nt">Compared at base values.</div>'}</div>`}
function renderPack(){
  document.querySelectorAll('.tabs b').forEach(b=>b.classList.toggle('on',b.dataset.t===packTab));
  const pan=['buy','gamble','stash','forge'].includes(packTab)?'trade':packTab;document.querySelectorAll('.pkb').forEach(p=>p.classList.toggle('on',p.id==='pk-'+pan));$('#tdot').style.display=P.pts>0?'block':'none';$('#tsdot').style.display=P.apts>0?'block':'none';
  if(packTab==='gear'){
    for(const[s,l]of SLOTS){const el=document.querySelector(`.doll .slot[data-s="${s}"]`),id=P.eq[s];
      el.innerHTML=(id?`<img src="${icon(id)}">`:'')+`<span${l.length>6?' class="lg"':''}>${l}</span>`;el.classList.toggle('sel',!!sel&&sel.src==='eq'&&sel.s===s);el.style.borderColor=id?RARITY[ITEMS[id].r].c+'99':'';
      el.dataset.tip=id?itemTip(id):`<i>Empty.</i>`}
    const x=$('#dollc').getContext('2d');x.clearRect(0,0,12,16);x.drawImage(KN.down[0],0,0);
  }
  else if(packTab==='bag'){let h='';const tk=Object.keys(P.tools);$('#toolrow').innerHTML=tk.length?'<div class="tl">Tools</div>'+tk.map(k=>`<div class="slot" data-tip="${esc(itemTip('t_'+k))}"><img src="${icon('t_'+k)}"></div>`).join(''):'';
    for(let i=0;i<BAG_MAX;i++){const b=P.bag[i];if(!b){h+='<div class="slot empty"></div>';continue}const it=ITEMS[b.id];
      h+=`<div class="slot${sel&&sel.src==='bag'&&sel.i===i?' sel':''}" data-i="${i}" data-tip="${esc(itemTip(b.id))}" style="border-color:${RARITY[it.r].c}77"><img src="${icon(b.id)}">${b.n>1?`<i class="n">${b.n}</i>`:''}${b.lk?'<i class="lk"></i>':''}</div>`}
    $('#bag').innerHTML=h;bagDrag()}
  else if(packTab==='tal'){
    $('#tpts').innerHTML=P.pts?`<b style="color:#d8a24a">${P.pts}</b> unspent point${P.pts>1?'s':''}.`:'No points to spend.';
    $('#tpick').innerHTML=Object.keys(TAL).map(k=>`<b class="${k===talTree?'on':''}" data-k="${k}" style="color:${TAL[k].col}">${TAL[k].name}<em>${spent(k)} pts</em></b>`).join('');
    $('#tpick').querySelectorAll('b').forEach(b=>b.onclick=()=>{talTree=b.dataset.k;sel=null;renderPack()});
    const t=TAL[talTree],sp=spent(talTree);
    $('#tnodes').innerHTML=t.nodes.map((n,i)=>{const r=P.tal[n.id]||0,gb=P.talB[n.id]||0,lock=sp<n.req;return`<div class="node${lock?' lock':''}${r?' has':''}${r>=n.max?' max':''}${sel&&sel.src==='tal'&&sel.id===n.id?' sel':''}" data-n="${i}" data-tip="${esc(`<b>${n.name}</b><span class='r'>Rank ${r}/${n.max}${lock?` · needs ${n.req} points in ${t.name}`:''}</span><span class='fx'>${n.desc}</span>`)}"><div class="rk">${r}/${n.max}</div><div class="tx"><b>${n.name}${gb?` <em style="color:#c7b377;font-style:normal">+${gb} from gear</em>`:''}</b><span>${lock?`Needs ${n.req} in ${t.name}`:n.desc}</span></div></div>`}).join('');
    $('#tnodes').querySelectorAll('.node').forEach(el=>el.onclick=()=>{const n=+el.dataset.n;sel={src:'tal',t:talTree,n,id:TAL[talTree].nodes[n].id};renderPack()})}
  else if(packTab==='map')drawMap();
  else if(packTab==='log')renderLogTo('#plogt','#plogl');
  else if(packTab==='stats')renderStats('#pk-stats');
  else if(pan==='trade')renderTrade();
  $('#pack .pk').classList.toggle('logm',packTab==='log'||packTab==='stats');
  renderDet()}
/* drag an item onto another slot to swap them (or onto an empty slot to move it to the end); a tap still selects */
let drag=null;
function bagDrag(){const slots=[...$('#bag').children];slots.forEach((el,i)=>{el.dataset.k=i;
  el.onpointerdown=e=>{if(!P.bag[i])return;e.preventDefault();drag={i,x:e.clientX,y:e.clientY,on:false,pid:e.pointerId,el};}});}
document.addEventListener('pointermove',e=>{if(!drag)return;if(!drag.on&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8){drag.on=true;hideTip();tipSuppress=true;
    const g=document.createElement('img');g.id='dragg';g.src=icon(P.bag[drag.i].id);document.body.appendChild(g);drag.el.style.opacity=.35}
  if(drag.on){const g=$('#dragg');g.style.left=(e.clientX-20)+'px';g.style.top=(e.clientY-20)+'px'}});
document.addEventListener('pointerup',e=>{if(!drag)return;const d=drag;drag=null;const g=$('#dragg');if(g)g.remove();tipSuppress=false;
  if(!d.on){sel={src:'bag',i:d.i};renderPack();return}
  const t=document.elementFromPoint(e.clientX,e.clientY),sl=t&&t.closest('#bag > div');if(!sl){renderPack();return}
  let j=+sl.dataset.k;if(j>=P.bag.length)j=P.bag.length-1;if(j!==d.i){const a=P.bag;[a[d.i],a[j]]=[a[j],a[d.i]];SFX.thunk&&SFX.thunk()}
  if(sel&&sel.src==='bag'){if(sel.i===d.i)sel.i=j;else if(sel.i===j)sel.i=d.i}renderPack()});
function renderDet(){const d=$('#det');
  if(packTab==='map'){const L=mapLevel();if(mapPick){d.innerHTML=`<h3>${fireName(mapPick.L,mapPick.f)}</h3><div class="ty">${mapPick.L.area.def.name} · ${mapPick.L.name}</div><div class="btns"><button class="btn pri" onclick="mapTravel()">Travel here</button><button class="btn" onclick="mapPick=null;renderPack()">Cancel</button></div>`;return}
    d.innerHTML=`<h3>${L.name}</h3><div class="ty">${L.area.def.name}</div><div class="fl">${atFire?'Tap a lit fire to travel there.':'Sit at a lit fire and choose Travel to journey between fires.'}</div>`;return}
  if(!sel){d.innerHTML=packTab==='bag'?'<div class="fl">Tap an item to look at it.</div>':packTab==='tal'?'<div class="fl">Tap a talent, then learn it. Each tree unlocks deeper talents as you spend points in it.</div>':'<div class="fl">Tap a slot to inspect what you are wearing.</div>';return}
  if(sel.src==='tal'){const t=TAL[sel.t],n=t.nodes[sel.n],r=P.tal[n.id]||0,lock=spent(sel.t)<n.req,can=!lock&&r<n.max&&P.pts>0;
    const gs=srcOf('tal_'+n.id),tot=tr(n.id),pw=SKILLT.has(n.id)&&tot?`<div>Power ×${skR(n.id).toFixed(2)} at rank ${tot} (+25% for each rank after the first)</div>`:'';
    const rk=r||gs.length?`<div class="sl"><div>Rank ${tot}: ${r} learned${gs.map(x=>`, ${esc(x)}`).join('')}</div>${pw}</div>`:'';
    d.innerHTML=`<h3 style="color:${t.col}">${n.name}</h3><div class="ty">${t.name} · rank ${r}/${n.max}${lock?` · needs ${n.req} in ${t.name}`:''}</div>${rk}<div class="fl">${n.desc}</div><div class="btns"><button class="btn pri" id="dA" ${can?'':'disabled'}>${r>=n.max?'Mastered':'Learn'}</button></div>`;
    $('#dA').onclick=()=>{if(!can)return;const om=P.max,omp=P.mmax;P.tal[n.id]=r+1;P.pts--;recalc();P.hp+=P.max-om;P.mp+=P.mmax-omp;SFX.lvl();renderPack()};return}
  if(['shop','gam','stash','tbag','fg'].includes(sel.src)){tradeDet(d);return}
  const id=sel.src==='bag'?(P.bag[sel.i]||{}).id:P.eq[sel.s];
  if(!id){d.innerHTML=sel.src==='eq'?`<div class="fl">Empty.</div>`:'';return}
  const it=ITEMS[id],R=RARITY[it.r];const PAIR={charm:'charm2',ring:'ring2'},pb=it.slot,p2=PAIR[pb];let tslot=p2?(sel.cmp&&(sel.cmp===pb||sel.cmp===p2)?sel.cmp:(!P.eq[pb]?pb:!P.eq[p2]?p2:pb)):it.slot;const cur=sel.src==='bag'&&it.slot&&P.eq[tslot]?ITEMS[P.eq[tslot]]:null;
  const btns=sel.src==='eq'?'<button class="btn" id="dA">Unequip</button>':it.slot?'<button class="btn pri" id="dA">Equip</button><button class="btn" id="dB">Discard</button>':it.junk||it.mat?'<button class="btn" id="dB">Discard</button>':'<button class="btn pri" id="dA">Use</button><button class="btn" id="dB">Discard</button>';
  if(sel.src==='bag'&&it.slot){const two=p2&&P.eq[pb]&&P.eq[p2];
    d.innerHTML=`<h3 style="color:${R.c}">${esc(iname(id))}</h3><div class="ty" style="color:${R.c}aa">${typeLine(it)}</div>${two?`<div class="cpick"><b class="${tslot===pb?'on':''}" data-c="${pb}">vs first ${pb}</b><b class="${tslot===p2?'on':''}" data-c="${p2}">vs second ${pb}</b></div>`:''}${cmpHTML(id,P.eq[tslot])}<div class="btns"><button class="btn pri" id="dA">${P.eq[tslot]?'Equip, replacing it':'Equip'}</button><button class="btn" id="dB">Discard</button></div>`;
    d.querySelectorAll('.cpick b').forEach(b=>b.onclick=()=>{sel.cmp=b.dataset.c;renderPack()})}
  else d.innerHTML=`<h3 style="color:${R.c}">${esc(iname(id))}</h3><div class="ty" style="color:${R.c}aa">${typeLine(it)}${cur?` · replaces ${esc(iname(P.eq[tslot]))}`:''}</div><div class="sl">${it.slot?compareLines(it,cur)+specialLines(it).map(l=>`<div>${l}</div>`).join(''):`<div>${it.junk?'No use. A merchant will buy it.':it.fx}</div>`}${it.set?`<div>${setHTML(it).replace(/<span/g,'<div').replace(/<\/span>/g,'</div>')}</div>`:''}<div style="color:#c9a24b">Sells for ${sellPrice(id)} gold</div></div><div class="fl">${esc(it.d||'')}</div><div class="btns">${btns}</div>`;
  if(sel.src==='bag'){const bb=P.bag[sel.i],bt=d.querySelector('.btns');if(bt&&bb){bt.insertAdjacentHTML('beforeend',`<button class="btn lock" id="dL">${bb.lk?'Unlock':'Lock'}</button>`);if(bb.lk){const x=$('#dB');if(x)x.remove()}
    $('#dL').onclick=()=>{bb.lk=bb.lk?0:1;pflash(bb.lk?'Locked. It can\'t be sold, stored or thrown away until you unlock it.':'Unlocked.');renderPack()}}}
  const A=$('#dA'),Bb=$('#dB');
  if(sel.src==='eq')A.onclick=()=>{if(P.bag.length>=BAG_MAX){pflash('Your bag is full.');return}P.bag.push({id,n:1});P.eq[sel.s]=null;recalc();buildKnight();renderPack()};
  else if(it.slot)A.onclick=()=>{
    /* heavy weapons need both hands: no shield with them */
    const twoH=w=>w&&ITEMS[w]&&ITEMS[w].slot==='weapon'&&HEAVYW.includes(wTypeOf(ITEMS[w]));
    if(it.slot==='shield'&&twoH(P.eq.weapon)){pflash(`Your ${ITEMS[P.eq.weapon].n} needs both hands.`);return}
    if(it.slot==='weapon'&&twoH(id)&&P.eq.shield){if(P.bag.length-1+(P.eq.weapon?1:0)+1>BAG_MAX){pflash('No room in your bag for your shield.');return}P.bag.push({id:P.eq.shield,n:1});P.eq.shield=null}
    /* the item you took off goes into the very slot the new one came from, and you stay on the Bag screen */
    const old=P.eq[tslot],om=P.max,bi=sel.i;if(old)P.bag[bi]={id:old,n:1};else P.bag.splice(bi,1);P.eq[tslot]=id;recalc();if(P.max>om)P.hp+=P.max-om;buildKnight();SFX.guard();sel=old?{src:'bag',i:bi}:null;renderPack()};
  else if(A)A.onclick=()=>{if(it.use==='oil'){pflash('Only useful in a fight.');return}const m=applyItem(id);removeItem(id);SFX.heal();pflash(m);if(!P.bag[sel.i]||P.bag[sel.i].id!==id)sel=null;renderPack()};
  if(Bb)Bb.onclick=()=>{P.bag.splice(sel.i,1);sel=null;pflash('Discarded.');renderPack()}}
document.querySelectorAll('.doll .slot').forEach(el=>el.onclick=()=>{sel={src:'eq',s:el.dataset.s};renderPack()});
document.querySelectorAll('.tabs b').forEach(b=>b.onclick=()=>{if(b.dataset.t==='log'&&packTab!=='log')logTab='world';packTab=b.dataset.t;sel=null;renderPack()});
document.querySelectorAll('#plogt b').forEach(b=>b.onclick=()=>{logTab=b.dataset.t;renderPack()});
$('#pkx').onclick=closePack;
/* map screen: browse any region you've been to; tap a lit fire to travel there (Elden Ring style) */
let MV=null,mapPick=null,atFire=false;
const mapLevel=()=>{if(!MV)return LV;const ar=AREAS[MV.ai];return ar&&ar.zones[MV.zi]||LV};
const seenAny=L=>!!(L&&L.seen&&L.seen.some(v=>v));
function mapNav(){const el=$('#mnav');const L=mapLevel(),ar=L.area,ais=AREAS.map((a,i)=>a&&a.zones.some(seenAny)?i:-1).filter(i=>i>=0),k=ais.indexOf(ar.i);
  let h=`<div class="mnr"><button class="mnb" ${k<=0?'disabled':''} onclick="mapGo(${ais[k-1]},null)">◀</button><b>${ar.def.name}</b><button class="mnb" ${k<0||k>=ais.length-1?'disabled':''} onclick="mapGo(${ais[k+1]},null)">▶</button></div><div class="mnr">`;
  for(let zi=0;zi<NZ;zi++){const Z=ar.zones[zi],ok=seenAny(Z);h+=`<button class="mnz${L===Z?' on':''}" ${ok?'':'disabled'} onclick="mapGo(${ar.i},${zi})">${ok?ar.def.zones[zi]:'?'}</button>`}
  h+=`</div>`;if(L!==LV)h+=`<div class="mnr"><button class="mnb wide" onclick="MV=null;mapPick=null;renderPack()">Back to where you are</button></div>`;
  /* only rebuild the buttons when they actually change: the map redraws 3 times a second, and replacing a button between press and release swallowed the click */
  if(el._h!==h){el._h=h;el.innerHTML=h}}
function mapGo(ai,zi){const ar=AREAS[ai];if(zi==null){zi=ar.zones.findIndex(seenAny);if(zi<0)return}MV=ar===AR&&ar.zones[zi]===LV?null:{ai,zi};mapPick=null;renderPack()}
function drawMap(){const L=mapLevel(),c=$('#mapc'),MW2=L.MW,MH2=L.MH,sc=MW2>60?3:8,M=L.map,ix=(a,b)=>b*MW2+a;c.width=MW2*sc;c.height=MH2*sc;c.style.aspectRatio=MW2+' / '+MH2;c._L=L;c._sc=sc;const x=c.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);
  const ty=L.type,pl=ty==='plains',cave=ty==='cave',ins=L.kind==='interior';
  const COL={[G]:cave?'#3a3632':pl?'#4a8a3a':ty==='swamp'?'#232a14':'#1d2a1f',[ROAD]:pl?'#a08a60':'#6a5a3e',[OAK]:pl?'#2a5a26':'#0e1a12',[PINE]:'#0b1611',[DEAD]:'#3a342d',[BOG]:'#1f4a3a',[MUD]:'#5a4c2c',[ROCKT]:'#4a4a44',[FIRE]:cave?'#3a3632':'#1d2a1f',[STN]:'#b83a2a',[BRIDGE]:'#7a5a34',[ENTT]:pl?'#2a5a26':'#0e1a12',[CHEST]:ins?'#6a4a2e':cave?'#3a3632':'#1d2a1f',[PROPT]:cave?'#3a3632':'#1d2a1f',[WATER]:'#1a3a5a',[WALL]:'#1a1818',[BARRIER]:'#6a3a8a',[EXIT]:'#e8e0c8',[GATE]:'#c9a24b',[FLOOR]:'#5a4632',[IWALL]:'#1a1410',[BLDG]:'#5a3a2a',[DOOR]:'#c9a24b',[IDOOR]:'#c9a24b',[BRAMBLE]:'#4a2a1a',[CRACK]:'#5a5048',[DEEP]:'#0c1a2a',[DEADFALL]:'#5a3e22',[BOARDS]:'#7a5a34',[MIRE]:'#3a3a1c',[SPOIL]:'#6a5236',[IRONG]:'#5a6068'};
  const SN=L.seen,sn=(a,b)=>SN[ix(a,b)];
  for(let y=0;y<MH2;y++)for(let tx=0;tx<MW2;tx++){if(!sn(tx,y))continue;x.fillStyle=COL[M[ix(tx,y)]]||COL[G];x.fillRect(tx*sc,y*sc,sc,sc)}
  const ex=L.pocket&&L.pocket.exit;if(ex&&sn(ex.x,ex.y)){x.fillStyle='#e8e0c8';x.font='bold 11px monospace';x.fillText('▲',ex.x*sc-3,ex.y*sc+6)}
  if(L.back&&sn(L.back.x,L.back.y)){x.fillStyle='#e8e0c8';x.font='bold 11px monospace';x.fillText('▼',L.back.x*sc-3,L.back.y*sc+6)}
  if(L.bossTile&&!L.area.bossDead&&sn(L.bossTile.x,L.bossTile.y)){x.fillStyle='#d83a2a';x.font='bold 13px monospace';x.fillText('☠',L.bossTile.x*sc-4,L.bossTile.y*sc+4)}
  x.fillStyle='#e8e0c8';x.font='bold 9px monospace';for(const g of L.gates||[]){const[gx,gy]=g.tiles[0];if(!sn(g.inner.x,g.inner.y))continue;x.fillText({E:'▶',W:'◀',N:'▲',S:'▼'}[g.e],clamp(gx*sc-3,1,c.width-9),clamp(gy*sc+4,8,c.height-2))}
  const R=Math.max(4,sc*1.6);for(const f of L.fires){if(!sn(f.x,f.y))continue;const cx=f.x*sc+sc/2,cy=f.y*sc+sc/2,pickd=mapPick&&mapPick.f===f;
    if(f.lit){x.fillStyle='rgba(255,170,60,.25)';x.beginPath();x.arc(cx,cy,R*1.9,0,7);x.fill()}
    x.fillStyle=f.lit?'#ff9a3a':'#5a3a20';x.beginPath();x.moveTo(cx,cy-R);x.lineTo(cx+R*.75,cy);x.lineTo(cx,cy+R);x.lineTo(cx-R*.75,cy);x.fill();
    if(f.lit){x.fillStyle='#ffe8a0';x.fillRect(cx-1,cy-2,2,3)}if(pickd){x.strokeStyle='#fff';x.lineWidth=2;x.strokeRect(cx-R-3,cy-R-3,R*2+6,R*2+6)}}
  if(L===LV){const px=(P.x/T)*sc,py=(P.y/T)*sc,pr=Math.max(3,sc*1.6),pl=1+.25*Math.sin(time*5);
    x.strokeStyle='rgba(255,90,60,.9)';x.lineWidth=Math.max(1,sc*.5);x.beginPath();x.arc(px,py,pr*2.2*pl,0,6.283);x.stroke();
    x.fillStyle='#000';x.beginPath();x.arc(px,py,pr+1.5,0,6.283);x.fill();x.fillStyle=Math.floor(time*3)%2?'#ff5a3c':'#fff4c0';x.beginPath();x.arc(px,py,pr,0,6.283);x.fill();
    const [fx,fy]=FD[P.face]||[0,1];x.strokeStyle='#fff';x.lineWidth=Math.max(1,sc*.45);x.beginPath();x.moveTo(px,py);x.lineTo(px+fx*pr*2,py+fy*pr*2);x.stroke()}
  $('#mstat').textContent='';mapNav()}
function fireName(L,f){return f.start?(L.zi===0?'The first fire':'The camp by the way in'):f.boss?'Beyond '+BEYOND[L.area.def.boss]:'A fire to the '+fireDir(f)}
$('#mapc').addEventListener('click',e=>{const c=$('#mapc'),L=c._L,sc=c._sc;if(!L||packTab!=='map'||!atFire)return;const r=c.getBoundingClientRect(),k=Math.min(r.width/c.width,r.height/c.height),ox=(r.width-c.width*k)/2,oy=(r.height-c.height*k)/2;
  const px=(e.clientX-r.left-ox)/k,py=(e.clientY-r.top-oy)/k;let best=null,bd=1e9;
  for(const f of L.fires){if(!f.lit||!L.seen[f.y*L.MW+f.x])continue;const d=Math.hypot(f.x*sc+sc/2-px,f.y*sc+sc/2-py);if(d<bd){bd=d;best=f}}
  if(!best||bd>Math.max(14,sc*4)/Math.min(1,k)){mapPick=null;renderPack();return}
  mapPick={L,f:best,ai:L.area.i,zi:L.zi,fi:L.fires.indexOf(best)};renderPack()});
function mapTravel(){const m=mapPick;if(!m||!atFire)return;if(threatNear()){pflash("You can't travel while you're being hunted.");return}if(LV===m.L&&Math.hypot(P.x-(m.f.x*T+8),P.y-(m.f.y*T+14))<3*T){pflash('You are already there.');return}
  closePack();mapPick=null;MV=null;goFire(m.ai,m.zi,m.fi)}
/* keep the item details in view on tall screens */
{const rp=renderPack;renderPack=function(){rp();if(sel&&innerHeight>innerWidth&&packTab!=='map'){const d=$('#det');requestAnimationFrame(()=>d.scrollIntoView({block:'nearest'}))}}}

/* ================= Bestiary (0.13.19): from the game menu. A creature appears once you've met it; its details once you've studied it ================= */
function noteSeen(f){if(!f||!f.kind)return;P.seen=P.seen||{};const key=f.ek||f.vk||f.kind,o=P.seen[key];if(o&&o.lv>f.lv)return;
  P.seen[key]={key,kind:f.kind,vk:f.vk||null,ek:key,role:f.role||null,name:f.name,lv:f.lv,type:f.type,def:f.def,ini:f.ini,max:f.max,atk:f.atk,dodge:f.dodge||0,parry:f.parry||0,block:f.block||0,res:Object.assign({},f.res||{}),boss:!!f.k.boss}}
/* one entry per distinct creature: each base kind, then its pack roles that differ, then its variants and their roles */
function bestiaryOrder(){const out=[],seenK=new Set(),entries=k=>{const r=[k];const R=UNIT_ROLES[k];if(R)R.forEach((x,i)=>{if(!roleOrd(x))r.push(k+'#'+i)});return r};
  const add=k=>{if(!k||!KINDS[k])return;if(KINDS[k].pack){for(const u of KINDS[k].units)add(u);return}const base=KINDS[k].base||k;if(seenK.has(base))return;seenK.add(base);
    out.push(...entries(base));for(const v in KINDS)if(KINDS[v].base===base)out.push(...entries(v))};
  for(let mi=0;mi<MAPDEF.length;mi++){for(const k in (MAPDEF[mi].mobs||{}))add(k);if(mi%NZ===NZ-1&&AREA_DEFS[(mi/NZ)|0])add(AREA_DEFS[(mi/NZ)|0].boss)}
  for(const k in KINDS)if(!KINDS[k].pack&&!KINDS[k].base)add(k);return out}
let bstSel=null;
function sprURL(k){try{const s=SPR[k];const im=Array.isArray(s)?s[0]:s;const c=document.createElement('canvas');c.width=im.width;c.height=im.height;c.getContext('2d').drawImage(im,0,0);return c.toDataURL()}catch(e){return''}}
function renderBestiary(){const ord=bestiaryOrder(),S=P.seen||{},K=P.known||{},knowE=e=>!!K[e],n=ord.filter(k=>S[k]).length;
  $('#bstc').textContent=`${n} of ${ord.length} met · ${ord.filter(k=>S[k]&&K[k]).length} studied`;
  $('#bgrid').innerHTML=ord.map(k=>{const s=S[k];if(!s)return`<div class="bc un"><i>?</i><span>???</span></div>`;
    return`<div class="bc${bstSel===k?' on':''}${s.boss?' boss':''}" data-k="${k}"><img src="${sprURL(s.vk||s.kind)}"><span>${esc(s.name)}</span>${knowE(k)?'':'<em>not studied</em>'}</div>`}).join('');
  const s=bstSel&&S[bstSel];
  if(!s){$('#bdet').innerHTML=`<div class="bhint">${n?'Tap a creature to see what you know about it.':'You haven\'t fought anything yet. That won\'t last.'}</div>`;return}
  const f=Object.assign({st:{},k:KINDS[s.kind],hp:s.max},s);f.ek=s.key;f.name=s.name;
  let h=`<div class="btop"><img src="${sprURL(s.vk||s.kind)}"><div>${foeTip(f).replace(/<b>[^<]*<\/b>/,`<b>${esc(s.name)}</b>`)}</div></div>`;
  if(K[s.key||s.kind])h+=`<span class='wh'>Strength</span><span class='wr'><span>Health</span><em>${s.max}</em></span><span class='wr'><span>Attack</span><em>${Math.round(s.atk)}</em></span><span class='ws'>the strongest one you have met (level ${s.lv})</span>`;
  $('#bdet').innerHTML=h}
let bstPrev=null;
function openBestiary(){bstPrev=mode;mode='bst';hideTip();$('#bst').classList.add('on');renderBestiary()}
function closeBestiary(){$('#bst').classList.remove('on');hideTip();mode=bstPrev==='dlg'||!bstPrev?'world':bstPrev}

/* ================= TRADE: Mortimer, gambling, the stash (0.15) =================
   One screen, built for fingers: tap anything to see it in full below (with how it compares to what you wear), then act on it.
   Nothing here needs hovering. */
let TRADE=null,TL=[];
/* ---- the anvil: reinforce a weapon, set gems, drill a socket, reforge an item's magic ---- */
function forgeList(){const L=[];for(const s of Object.keys(P.eq))if(P.eq[s])L.push({id:P.eq[s],eq:s});for(const b of P.bag)if(ITEMS[b.id].slot)L.push({id:b.id});return L}
const drillCost=id=>30+Math.round(buyPrice(id)*.8),reforgeCost=id=>Math.round(buyPrice(id)*.6*(1+.5*(ITEMS[id].rf||0)));
function forgeDet(d){const g=TL[sel.i];if(!g){sel=null;renderDet();return}const id=g.id,it=ITEMS[id],R0=RARITY[it.r];let h=`<h3 style="color:${R0.c}">${esc(iname(id))}</h3><div class="ty" style="color:${R0.c}aa">${typeLine(it)}${g.eq?' · worn':''}</div><div class="sl">${gearLines(it).map(l=>`<div>${l}</div>`).join('')}</div>`,b='';
  if(it.slot==='weapon'){const up=it.up||0;if(up<10){if(it.ba==null)it.ba=it.st.atk||1;const lv=up+1,mat=UPMAT(lv),n=UPN(lv),cost=15*lv,have=(P.bag.find(x=>x.id===mat)||{n:0}).n;
    h+=`<div class="pr">Reinforce to +${lv}: ${n} × ${ITEMS[mat].n} (you have ${have}) and ${cost} gold</div>`;b+=`<button class="btn" data-f="up">Reinforce +${lv}</button>`}}
  const free=it.so?(it.so-(it.gems||[]).length):0;
  if(free>0){const gs=[...new Set(P.bag.filter(x=>ITEMS[x.id].gem).map(x=>x.id))];if(gs.length){h+=`<div class="pr">${free} empty socket${free>1?'s':''}. Set a gem (for good):</div>`;b+=gs.map(x=>{const[k,v]=gemStat(it,x);return`<button class="btn" data-f="gem" data-g="${x}">${ITEMS[x].n} · +${fv(k,v)}</button>`}).join('')}else h+=`<div class="pr">${free} empty socket${free>1?'s':''}. You have no gems.</div>`}
  if(SOCKS.includes(it.slot)&&!it.so){h+=`<div class="pr">Drill a socket: ${drillCost(id)} gold</div>`;b+=`<button class="btn" data-f="drill">Drill a socket</button>`}
  if(it.r>=2&&it.r<=5&&!it.uq&&!it.set){if(it.up||(it.gems||[]).length)h+=`<div class="pr" style="color:#8a8670">Reinforced or gem-set gear can't be reforged.</div>`;else{h+=`<div class="pr">Reforge its magic (new random stats, same kind and quality): ${reforgeCost(id)} gold</div>`;b+=`<button class="btn" data-f="re">Reforge</button>`}}
  d.innerHTML=h+`<div class="btns" style="flex-wrap:wrap">${b}</div>`;d.querySelectorAll('[data-f]').forEach(x=>x.onclick=()=>forgeAct(g,x.dataset.f,x.dataset.g))}
function forgeAct(g,f,gid){const id=g.id,it=ITEMS[id],spark=()=>{[0,1,2].forEach(i=>setTimeout(()=>SFX.clang(),i*160));for(let k=0;k<20;k++)particles.push({x:P.x,y:P.y-12,vx:(Math.random()-.5)*60,vy:-20-Math.random()*40,g:60,life:.8,c:pick(['#ffd75e','#ff9a3a','#fff4c0']),w:'spark'})};
  if(f==='up'){const lv=(it.up||0)+1,mat=UPMAT(lv),n=UPN(lv),cost=15*lv,have=(P.bag.find(x=>x.id===mat)||{n:0}).n,ga=Math.max(1,Math.round(it.ba*.12));if(have<n||P.gold<cost){pflash("You don't have what it needs.");return}
    for(let i=0;i<n;i++)removeItem(mat);P.gold-=cost;rec('spent',cost);it.up=lv;it.st.atk+=ga;if(lv===5||lv===10)it.st.crit=Math.round(((it.st.crit||0)+.03)*100)/100;spark();pflash(`${iname(id)}: +${ga} attack.`)}
  else if(f==='gem'){const[k,v]=gemStat(it,gid);it.st[k]=Math.round(((it.st[k]||0)+v)*1000)/1000;(it.gems=it.gems||[]).push(gid);removeItem(gid);SFX.chime&&SFX.chime();spark();pflash(`The ${ITEMS[gid].n} settles into the socket. +${fv(k,v)}.`)}
  else if(f==='drill'){const c=drillCost(id);if(P.gold<c){pflash("You can't afford that.");return}P.gold-=c;rec('spent',c);it.so=1;it.gems=[];spark();pflash('One clean socket, drilled and polished.')}
  else if(f==='re'){const c=reforgeCost(id);if(P.gold<c){pflash("You can't afford that.");return}P.gold-=c;rec('spent',c);
    const nid=genGear(it.tier||tierHere(),{slot:it.slot,exact:it.r,wt:it.wt,noU:1}),n=ITEMS[nid];if(n.uq||n.set||n.r!==it.r){delete ITEMS[nid];pflash('The spell slips away from you. Try again.');return}
    const keep={so:it.so,gems:it.gems,rf:(it.rf||0)+1};for(const k of Object.keys(it))delete it[k];Object.assign(it,n,keep);delete ITEMS[nid];spark();pflash(`It comes out of the fire as ${it.n}.`)}
  recalc();buildKnight();renderPack()}

function openTrade(tab,p){if(mode!=='world')return;
  const near=t=>props.find(q=>q.t===t&&Math.hypot(q.x-P.x,q.y-P.y)<8*T);
  const crow=p&&(p.t==='crow'||p.road)?p:(!DIFF.hc&&near('crow'))||null,stash=!(p&&p.road)&&(tab==='stash'||!!near('f_stash')),forge=tab==='forge'||!!near('f_anvil');
  TRADE={crow,stash,forge};$('#pack').classList.add('trade');
  document.querySelectorAll('#pack .tabs b.trt').forEach(b=>b.classList.toggle('av',b.dataset.t==='stash'?stash:b.dataset.t==='forge'?forge:!!crow));
  openPack(tab)}
const junkVal=()=>P.bag.filter(b=>ITEMS[b.id].junk&&!b.lk).reduce((a,b)=>a+sellPrice(b.id)*b.n,0);
function qIcon(slot){const k='q_'+slot;if(!ITEMS[k]){const a=slot==='weapon'?{icon:'sword'}:ARM[slot]||{icon:'charm'};ITEMS[k]={n:'?',r:1,icon:slot==='charm'?'rosary':a.icon,c:['#7a7a72','#2a2a28','#a8a8a0']}}return icon(k)}
function tSlot(id,n,i,src,pr,lk){const it=ITEMS[id];return`<div class="slot${sel&&sel.src===src&&sel.i===i?' sel':''}" data-src="${src}" data-i="${i}" data-tip="${esc(itemTip(id))}" style="border-color:${RARITY[it.r].c}77"><img src="${icon(id)}">${n>1?`<i class="n">${n}</i>`:''}${lk?'<i class="lk"></i>':''}${pr!=null?`<i class="pr${src==='shop'&&P.gold<pr?' no':''}">${pr}</i>`:''}</div>`}
function renderTrade(){const X=TRADE;if(!X){packTab='bag';renderPack();return}$('#trgold').textContent='◈ '+P.gold+' gold';let top='',bar='';
  if(packTab==='buy'&&X.crow){$('#trtl').textContent=X.crow.road?'Mortimer, on a branch':"Mortimer's wares";TL=freshStock(X.crow);
    top=TL.map((s,i)=>tSlot(s.id,s.n,i,'shop',buyPrice(s.id))).join('')||'<div class="empty-note">He has nothing left to sell you.</div>';const jv=junkVal();
    bar=`<button class="btn" data-b="junk"${jv?'':' disabled'}>Sell all junk${jv?' · '+jv:''}</button>${X.crow.road?'':`<button class="btn" data-b="restock">Different gear · ${restockPrice()}</button>`}<button class="btn" data-b="forget">Forget…</button><button class="btn" data-b="talk">Talk</button>`}
  else if(packTab==='gamble'&&X.crow){$('#trtl').textContent='Sold as they are. No looking first.';TL=gambleList(X.crow);
    top=TL.map((g,i)=>`<div class="slot q${sel&&sel.src==='gam'&&sel.i===i?' sel':''}" data-src="gam" data-i="${i}"><img src="${qIcon(g.slot)}"><i class="pr${P.gold<g.pr?' no':''}">${g.pr}</i></div>`).join('')}
  else if(packTab==='forge'&&X.forge){$('#trtl').textContent='At the anvil: pick something to work on';TL=forgeList();
    top=TL.map((g,i)=>{const it=ITEMS[g.id];return`<div class="slot${sel&&sel.src==='fg'&&sel.i===i?' sel':''}" data-src="fg" data-i="${i}" data-tip="${esc(itemTip(g.id))}" style="border-color:${RARITY[it.r].c}77"><img src="${icon(g.id)}">${g.eq?'<i class="pr" style="color:#c7b377">worn</i>':''}${it.so?`<i class="n">${(it.gems||[]).length}/${it.so}</i>`:''}</div>`}).join('')||'<div class="empty-note">You have nothing to work on.</div>'}
  else{packTab='stash';TL=P.stash;$('#trtl').textContent=`Your stash · ${P.stash.length} thing${P.stash.length===1?'':'s'}`;
    top=P.stash.map((b,i)=>tSlot(b.id,b.n,i,'stash',null,b.lk)).join('')||'<div class="empty-note">Empty. Whatever you leave here is waiting at every camp.</div>';
    if(P.bag.some(b=>!b.lk))bar='<button class="btn" data-b="storeall">Store everything not locked</button>'}
  $('#trg').innerHTML=top;$('#trbar').innerHTML=bar;
  let h='';for(let i=0;i<BAG_MAX;i++){const b=P.bag[i];h+=b?tSlot(b.id,b.n,i,'tbag',packTab==='stash'||packTab==='forge'||ITEMS[b.id].tool?null:sellPrice(b.id),b.lk):'<div class="slot empty"></div>'}$('#trb').innerHTML=h;
  document.querySelectorAll('#pk-trade .slot[data-src]').forEach(el=>el.onclick=()=>{sel={src:el.dataset.src,i:+el.dataset.i};renderPack();
    const dt=$('#det');if(dt&&!matchMedia('(orientation:landscape) and (max-height:640px)').matches){const r=dt.getBoundingClientRect();if(r.top>innerHeight-120)dt.scrollIntoView({block:'nearest',behavior:'smooth'})}});
  document.querySelectorAll('#trbar .btn').forEach(b=>b.onclick=()=>tradeBar(b.dataset.b))}
async function tradeBar(k){const X=TRADE;
  if(k==='junk'){let g=0;for(let i=P.bag.length-1;i>=0;i--){const b=P.bag[i];if(ITEMS[b.id].junk&&!b.lk){g+=sellPrice(b.id)*b.n;P.bag.splice(i,1)}}if(g){P.gold+=g;rec('earned',g);SFX.coin();pflash(`Sold your junk for ${g} gold.`)}sel=null}
  else if(k==='restock'){const pr=restockPrice();if(P.gold<pr){pflash("You can't afford that.");return}P.gold-=pr;rec('spent',pr);gearStock(X.crow);X.crow.vis=VISIT;SFX.caw&&SFX.caw(.9);pflash('He rummages in the satchel and lays out something else.');sel=null}
  else if(k==='forget'){await forgetDlg();return}
  else if(k==='talk'){await crowTalkDlg();return}
  else if(k==='storeall'){let n=0;for(let i=P.bag.length-1;i>=0;i--){if(P.bag[i].lk)continue;stashPut(P.bag.splice(i,1)[0]);n++}if(n){SFX.chest&&SFX.chest();pflash(`Stored ${n} thing${n>1?'s':''}.`)}sel=null}
  renderPack()}
function stashPut(b){if(stackable(b.id)){const o=P.stash.find(x=>x.id===b.id);if(o){o.n+=b.n;o.lk=o.lk||b.lk;return}}P.stash.push(b)}
/* the slot an item would go into, for comparing: rings and charms pick the empty one, or the one you chose */
function cmpSlot(it){const PAIR={charm:'charm2',ring:'ring2'},pb=it.slot,p2=PAIR[pb];return p2?(sel.cmp&&(sel.cmp===pb||sel.cmp===p2)?sel.cmp:(!P.eq[pb]?pb:!P.eq[p2]?p2:pb)):pb}
function infoHTML(id){const it=ITEMS[id];if(!it.slot)return`<div class="sl"><div>${it.junk?'No use. Mortimer will buy it.':it.fx||''}</div></div>`;
  const PAIR={charm:'charm2',ring:'ring2'},pb=it.slot,p2=PAIR[pb],ts=cmpSlot(it),two=p2&&P.eq[pb]&&P.eq[p2];
  return(two?`<div class="cpick"><b class="${ts===pb?'on':''}" data-c="${pb}">vs first ${pb}</b><b class="${ts===p2?'on':''}" data-c="${p2}">vs second ${pb}</b></div>`:'')+cmpHTML(id,P.eq[ts])}
function tradeDet(d){const X=TRADE,R=c=>RARITY[c.r];let h='',btn='';
  if(sel.src==='fg'){forgeDet(d);return}
  if(sel.src==='gam'){const g=TL[sel.i];if(!g){sel=null;renderDet();return}
    h=`<h3>An unknown ${(SLOTN[g.slot]||g.slot).toLowerCase()}</h3><div class="ty">Gamble · as good as what you find around here</div><div class="sl"><div>Usually Uncommon. Often Rare. Now and then Epic or Legendary, and very rarely a unique or a piece of a set.</div></div><div class="pr">${g.pr} gold · you have ${P.gold}</div><div class="fl">“No refunds. No looking.”</div>`;
    btn=`<button class="btn pri" id="tA">Buy it unseen · ${g.pr}</button>`}
  else{const L=sel.src==='shop'?TL:sel.src==='stash'?P.stash:P.bag,e=L[sel.i];if(!e){sel=null;renderDet();return}const it=ITEMS[e.id];
    h=`<h3 style="color:${R(it).c}">${esc(iname(e.id))}${e.n>1?` ×${e.n}`:''}</h3><div class="ty" style="color:${R(it).c}aa">${typeLine(it)}</div>${infoHTML(e.id)}${it.set?`<div class="sl">${setHTML(it).replace(/<span/g,'<div').replace(/<\/span>/g,'</div>')}</div>`:''}`;
    if(sel.src==='shop'){const pr=buyPrice(e.id);h+=`<div class="pr">${pr} gold · you have ${P.gold}</div>${it.slot?'':`<div class="fl">${esc(it.d||'')}</div>`}`;btn=`<button class="btn pri" id="tA">Buy · ${pr}</button>`}
    else if(sel.src==='stash'){h+=it.slot?'':`<div class="fl">${esc(it.d||'')}</div>`;btn=`<button class="btn pri" id="tA">Take</button><button class="btn lock" id="tL">${e.lk?'Unlock':'Lock'}</button>`}
    else{const sp=sellPrice(e.id);h+=it.slot?'':`<div class="fl">${esc(it.d||'')}</div>`;
      btn=(packTab==='stash'?`<button class="btn pri" id="tA"${e.lk?' disabled':''}>Store</button>`:X.crow&&!it.tool?`<button class="btn pri" id="tA"${e.lk?' disabled':''}>Sell · ${sp}${e.n>1?' each':''}</button>`:'')+`<button class="btn lock" id="tL">${e.lk?'Unlock':'Lock'}</button>`;
      if(e.lk)h+=`<div class="pr" style="color:#8a8670">Locked: it can't be sold, stored or thrown away.</div>`}}
  d.innerHTML=h+`<div class="btns">${btn}</div>`;
  d.querySelectorAll('.cpick b').forEach(b=>b.onclick=()=>{sel.cmp=b.dataset.c;renderPack()});
  const A=$('#tA'),Lk=$('#tL');if(Lk)Lk.onclick=()=>{const L=sel.src==='stash'?P.stash:P.bag,e=L[sel.i];if(e){e.lk=e.lk?0:1;renderPack()}};
  if(A)A.onclick=()=>tradeAct()}
function tradeAct(){const X=TRADE;
  if(sel.src==='gam'){const g=TL[sel.i];if(P.gold<g.pr){pflash("You can't afford that.");return}if(P.bag.length>=BAG_MAX){pflash('Your bag is full.');return}
    P.gold-=g.pr;rec('spent',g.pr);rec('gambles',1);const id=gambleItem(g.slot,g.t);addItem(id);const it=ITEMS[id];SFX.coin();if(it.r>=4)setTimeout(()=>SFX.lvl&&SFX.lvl(),150);
    sel={src:'tbag',i:P.bag.findIndex(b=>b.id===id)};pflash(`It's ${/^[AEIOU]/i.test(RARITY[it.r].n)?'an':'a'} ${RARITY[it.r].n.toLowerCase()} one: ${iname(id)}.`);renderPack();return}
  if(sel.src==='shop'){const s=TL[sel.i],pr=buyPrice(s.id);if(P.gold<pr){pflash("You can't afford that.");return}if(!addItem(s.id)){pflash('Your bag is full.');return}
    P.gold-=pr;rec('spent',pr);s.n--;SFX.coin();if(s.n<=0)sel=null;renderPack();return}
  if(sel.src==='stash'){const b=P.stash[sel.i];if(stackable(b.id)&&P.bag.find(x=>x.id===b.id)){P.bag.find(x=>x.id===b.id).n+=b.n}else{if(P.bag.length>=BAG_MAX){pflash('Your bag is full.');return}P.bag.push(b)}P.stash.splice(sel.i,1);sel=null;SFX.thunk&&SFX.thunk();renderPack();return}
  const b=P.bag[sel.i];if(!b||b.lk)return;
  if(packTab==='stash'){stashPut(P.bag.splice(sel.i,1)[0]);sel=null;SFX.thunk&&SFX.thunk();renderPack();return}
  const pr=sellPrice(b.id);P.gold+=pr;rec('earned',pr);if(--b.n<=0){P.bag.splice(sel.i,1);dropGen(b.id);sel=null}SFX.coin();renderPack()}
