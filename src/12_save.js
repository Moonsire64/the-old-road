/* ================= SAVE & QUIT =================
   One save slot in localStorage. The whole world graph is written out with shared references kept intact;
   constant game data (sprites, kinds, item bases) is stored by name, and cached canvases are dropped and redrawn. */
/* a save only loads into the exact game version that wrote it; any update makes older saves unreadable, so no migration code is ever needed */
const SAVE_KEY='hm_save1',SAVE_V=()=>(document.getElementById('ver')||{}).textContent||'dev';
let CONSTS=null;
function constRegistry(){if(CONSTS)return CONSTS;const m=new Map();
  const reg=(name,obj)=>{if(!obj||typeof obj!=='object')return;for(const k of Object.keys(obj)){const v=obj[k];if(v&&typeof v==='object'&&!m.has(v)){m.set(v,name+'\u0001'+k);
      if(!Array.isArray(v)&&!(v instanceof HTMLCanvasElement))for(const k2 of Object.keys(v)){const w=v[k2];if(w&&typeof w==='object'&&!m.has(w))m.set(w,name+'\u0001'+k+'\u0001'+k2)}}}};
  const C={SPR,KINDS,AREA_DEFS,MODES,STATUS,TAL,BLDC,ICONS,SICON,TOOLS:typeof TOOLS!=='undefined'?TOOLS:{},WEAP:typeof WEAP!=='undefined'?WEAP:{},ARTS};
  if(typeof PS!=='undefined')C.PS=PS;
  const base={};for(const k in ITEMS)if(!/^g\d+$/.test(k))base[k]=ITEMS[k];C.ITEMS=base;
  for(const n in C)reg(n,C[n]);CONSTS={m,C};return CONSTS}
const isCanvasish=v=>v instanceof HTMLCanvasElement||v instanceof CanvasRenderingContext2D||(typeof Image!=='undefined'&&v instanceof Image)||v instanceof Node;
function u8b64(u){let s='';for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s)}
function b64u8(b){const s=atob(b),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u}
function serGraph(root){const {m:K}=constRegistry(),ids=new Map(),out=[];
  const enc=v=>{if(v===undefined)return{$u:1};if(v===null||typeof v!=='object'){if(typeof v==='function')return{$u:1};if(typeof v==='number'&&!isFinite(v))return{$n:String(v)};return v}
    if(K.has(v))return{$c:K.get(v)};if(isCanvasish(v))return{$u:1};if(ids.has(v))return{$r:ids.get(v)};
    const i=out.length;ids.set(v,i);out.push(null);let e;
    if(v instanceof Uint8Array)e={t:'u8',d:u8b64(v)};
    else if(ArrayBuffer.isView(v))e={t:'ta',k:v.constructor.name,d:Array.from(v)};
    else if(v instanceof Map)e={t:'m',d:[...v].filter(([,x])=>!isCanvasish(x)).map(([k,x])=>[enc(k),enc(x)])};
    else if(v instanceof Set)e={t:'s',d:[...v].map(enc)};
    else if(Array.isArray(v)){e={t:'a',d:v.map(enc)};const ex=Object.keys(v).filter(k=>!/^\d+$/.test(k));if(ex.length){e.x={};for(const k of ex)e.x[k]=enc(v[k])}}
    else{const o={};for(const k of Object.keys(v)){const x=v[k];if(typeof x==='function')continue;o[k]=enc(x)}e={t:'o',d:o}}
    out[i]=e;return{$r:i}};
  const r=enc(root);return{r,out}}
function desGraph(g){const {C}=constRegistry(),objs=g.out.map(e=>e.t==='u8'?b64u8(e.d):e.t==='ta'?new self[e.k](e.d):e.t==='m'?new Map():e.t==='s'?new Set():e.t==='a'?[]:{});
  const dec=v=>{if(v===null||typeof v!=='object')return v;if(v.$u)return undefined;if(v.$n!==undefined)return Number(v.$n);if(v.$r!==undefined)return objs[v.$r];
    if(v.$c!==undefined){const p=v.$c.split('\u0001');let o=C[p[0]];for(let i=1;i<p.length&&o!=null;i++)o=o[p[i]];return o}return v};
  g.out.forEach((e,i)=>{const o=objs[i];if(e.t==='m')for(const[k,x]of e.d)o.set(dec(k),dec(x));else if(e.t==='s')for(const x of e.d)o.add(dec(x));
    else if(e.t==='a'){e.d.forEach((x,j)=>o[j]=dec(x));if(e.x)for(const k in e.x)o[k]=dec(e.x[k])}else if(e.t==='o')for(const k in e.d)o[k]=dec(e.d[k])});
  return dec(g.r)}
async function gz(str){const s=new Blob([str]).stream().pipeThrough(new CompressionStream('gzip'));return u8b64(new Uint8Array(await new Response(s).arrayBuffer()))}
async function gunz(b){const s=new Blob([b64u8(b)]).stream().pipeThrough(new DecompressionStream('gzip'));return await new Response(s).text()}
const diffKey=()=>Object.keys(MODES).find(k=>MODES[k]===DIFF)||'normal';
async function saveGame(){const gens={};for(const k in ITEMS)if(/^g\d+$/.test(k))gens[k]=ITEMS[k];
  const root={P,EV,AREAS,LV,GEN,gens,BAGS,USED,RUN,worldTime,eventT,diff:diffKey()};
  const lvls=[];for(const a of AREAS)if(a)for(const L of allLevels(a)){lvls.push([L,L.chunks]);L.chunks=new Map()}
  let g;try{g=serGraph(root)}finally{for(const[L,c]of lvls)L.chunks=c}
  try{const o={v:SAVE_V(),at:Date.now(),sum:{lv:P.lv,area:AR.def.name,zone:LV.name||'',mode:MODES[diffKey()].n}},j=JSON.stringify(g);
    if(typeof CompressionStream!=='undefined')o.z=await gz(j);else o.g=g;localStorage.setItem(SAVE_KEY,JSON.stringify(o));return true}
  catch(e){console.error(e);return false}}
function saveInfo(){try{const s=localStorage.getItem(SAVE_KEY);if(!s)return null;const o=JSON.parse(s);return o.v===SAVE_V()?o:null}catch(e){return null}}
function deleteSave(){try{localStorage.removeItem(SAVE_KEY)}catch(e){}}
async function loadGame(){const o=saveInfo();if(!o)return false;let d;try{d=desGraph(o.z?JSON.parse(await gunz(o.z)):o.g)}catch(e){console.error(e);return false}
  for(const k of Object.keys(P))delete P[k];Object.assign(P,d.P);Object.assign(EV,d.EV);
  AREAS.length=0;d.AREAS.forEach((a,i)=>AREAS[i]=a);GEN=d.GEN;Object.assign(ITEMS,d.gens);
  for(const k of Object.keys(BAGS))delete BAGS[k];Object.assign(BAGS,d.BAGS);for(const k of Object.keys(USED))delete USED[k];Object.assign(USED,d.USED);
  P.guard=false;
  RUN=d.RUN;worldTime=d.worldTime||0;eventT=d.eventT||600;DIFF=MODES[d.diff]||MODES.normal;
  for(const a of AREAS)if(a)for(const L of allLevels(a))L.chunks=new Map();
  bindLevel(d.LV);useLevelMobs(LV);particles=[];floats=[];B=null;TR=null;
  recalc();buildKnight();hudKey='';return true}
/* also usable mid-battle: saving there keeps your health and items as they are now, and the fight is waiting where you left it */
async function gameMenu(){if(mode!=='world'&&!(mode==='battle'&&B&&B.turnDone&&!B.busy))return;const c=await dialog('The Old Road',`${MODES[diffKey()].n} · ${AR.def.name}${mode==='battle'?' · in a fight':''}`,['Resume','Bestiary','Save and quit','Quit without saving']);
  if(c===1){openBestiary();return}
  if(c===2){if(await saveGame()){mode='title';location.reload()}else notice('The save failed. Your browser may be out of storage space.')}
  else if(c===3){const k=await dialog('Quit without saving?',saveInfo()?'Everything since your last save will be lost.':'This knight will be lost.',['Quit','Keep playing']);if(k===0){mode='title';location.reload()}}}
