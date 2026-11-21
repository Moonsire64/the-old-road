const $=s=>document.querySelector(s);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const chance=p=>Math.random()<p;
const pick=a=>a[Math.floor(Math.random()*a.length)];
function cvs(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hash(x,y){let h=(x*374761393+y*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
function makeNoise(seed){const r=mulberry(seed),g=new Float32Array(65536);for(let i=0;i<65536;i++)g[i]=r();
  const v=(a,b)=>g[((b&255)<<8)|(a&255)],s=t=>t*t*(3-2*t);
  return(x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),u=s(x-xi),w=s(y-yi);return(v(xi,yi)*(1-u)+v(xi+1,yi)*u)*(1-w)+(v(xi,yi+1)*(1-u)+v(xi+1,yi+1)*u)*w}}

/* ================= SPRITES ================= */
function spr(rows,pal){const h=rows.length,w=Math.max(...rows.map(r=>r.length)),c=cvs(w,h),x=c.getContext('2d');
  for(let y=0;y<h;y++)for(let i=0;i<rows[y].length;i++){const ch=rows[y][i];if(ch!=='.'&&pal[ch]){x.fillStyle=pal[ch];x.fillRect(i,y,1,1)}}return c}
function flipH(c){const o=cvs(c.width,c.height),x=o.getContext('2d');x.translate(c.width,0);x.scale(-1,1);x.drawImage(c,0,0);return o}
function tint(c,col){const o=cvs(c.width,c.height),x=o.getContext('2d');x.drawImage(c,0,0);x.globalCompositeOperation='source-in';x.fillStyle=col;x.fillRect(0,0,c.width,c.height);return o}

const OB_PAL={k:'#000000',R:'#4d1111',r:'#240a0a',S:'#4a4a56',s:'#2b2b33',d:'#17171c',e:'#ff3322',g:'#5e4d2c',b:'#140e09'};
const KD=["....kRRk....","...kRRRRk...","...kkkkkk...","..kSSSSSSk..","..kSssssdk..","..kseeeedk..","..kssssddk..",".kkkddddkkk.","kSsrrRRrrsdk","kskrRggRrkdk","kskrrRRrrkdk",".kkbbggbbkk.","..krrrrrrk.."];
const KU=["....kRRk....","...kRRRRk...","...kkkkkk...","..kSSSSSSk..","..kSssssdk..","..kssssssk..","..kddddddk..",".kkkddddkkk.","kSsRRRRRRsdk","kskRrrrrRkdk","kskRrrrrRkdk",".kkRrrrrRkk.","..kRRRRRRk.."];
const KS=["...kRRk.....","..kRRRRk....","...kkkkkk...","..kSSSSSSk..","..kSssssssk.","..ksssseeek.","..kssssssk..","...kkddkk...","..kRsSSsk...",".kRRssssdk..",".kRrrRRrdk..",".kRbbggbk...","..krrrrrk..."];
const LEG_V=[["..kddkkddk..","..kdk..kdk..","..kkk..kkk.."],["..kddkkddk..","..kdk..kkk..","..kkk......."],["..kddkkddk..","..kkk..kdk..",".......kkk.."]];
const LEG_S=[["..kddddk....","..kdkkdk....","..kkk.kkk..."],["..kddddk....",".kdk..kdk...",".kk....kk..."],["..kddddk....","...kddk.....","...kkkk....."]];


const SPR={};
SPR.bat=[spr(["k............k","kk...k..k...kk","kwk..kkkk..kwk","kwwkkPPPPkkwwk",".kwwpePPepwwk.","..kkppppppkk..","....kpffpk....",".....kkkk....."],{k:'#050307',p:'#2a1c2e',P:'#47344f',w:'#33243a',e:'#ff3b2a',f:'#e6dccb'}),
 spr(["..............",".....k..k.....",".....kkkk.....","....kPPPPk....",".kkkpePPepkkk.","kwwwppppppwwwk","kwwkkpffpkkwwk","kk..kkkkkk..kk"],{k:'#050307',p:'#2a1c2e',P:'#47344f',w:'#33243a',e:'#ff3b2a',f:'#e6dccb'})];
SPR.slime=[spr(["....kkkkkk....","..kkGGgggykk..",".kGwGgggyyggk.",".kGgggyyggggk.","kgdgegggegggdk","kggggyggggggdk","kdgggggyyggddk","kddgggggggdddk",".kddddddddddk.","..kkkkkkkkkk.."],{k:'#0a1207',g:'#3d5a1e',G:'#5e7426',d:'#22351a',y:'#9a9a32',w:'#cfd59a',e:'#0b0f05'})];
SPR.shroom=[spr(["....kkkkkk....","..kkcCCsCckk..",".kcCsCCCCcCck.","kcCCCcsCCCsCck","kccsCCCCcCCcck","kkcccccccccckk",".kkkkkkkkkkkk.","...ktetttetk..","...kttmmmttk..","...kTtttttTk..","..kkTttttTTkk.",".ktk.TTTT.ktk.","..k..kTTk..k..",".....kk.kk...."],{k:'#0a0505',c:'#4e1822',C:'#7d2a38',s:'#c9b98a',t:'#b3a688',T:'#7f7462',e:'#f0dd48',m:'#1a0808'})];
SPR.golem=[spr([".....kkkkkk.....","....kRRrrrRk....","....krerrerk....","....kmrrrrmk....","..kkkkddddkkkk..",".kRRrkrrRrkrRRk.","kRrrrkrerrkrrrRk","krrmrkrrerkrmrrk","krrrdkrrrrkdrrrk","kdrrdkmrrmkdrrdk",".kddk.kddk.kddk.",".kRRk.kkkk.kRRk.","..kk.krrrrk.kk..","....kRrk.kRrk...","....krdk.krdk...","...kkkkk.kkkkk.."],{k:'#0a0a09',r:'#5a5a54',R:'#7c7b72',d:'#363633',m:'#3c5528',e:'#6fd0ff'})];
const ENT_ROWS=["...kkkkkkkkk....",".kkLLlLLlLLLkk..","kLLlLLLlLLlLLLk.","kLlLLlLLLLlLLlLk","kLLLlLLlLLLlLLLk",".kkLLkbbbbkLLkk.","...kkbbBbbbkk...","....kbebbebk....","....kbBmmBbk....","..kkkbbmmbbkkk..",".kbbkbBbbbBkbbk.","kbk.kbbBbbbk.kbk","kk..kbbbBbbk..kk","....kbBbbbBk....","....kbbbbbbk....","...kbbk..kbbk...","..kbbk....kbbk..",".kkkk......kkkk."];
SPR.ent=[spr(ENT_ROWS,{k:'#070504',b:'#3a291c',B:'#56402d',l:'#18301c',L:'#264a2a',e:'#d8ff6a',m:'#060302'})];
SPR.elder=[spr(ENT_ROWS,{k:'#030202',b:'#2b1e15',B:'#45321f',l:'#0f1c11',L:'#1a2d1b',e:'#ff5a24',m:'#1a0402'})];
SPR.bear=[spr(["..kk.kk...............", ".kffkffk....kkkkkk....", ".kfffffk..kkFFFFFFkk..", "kffefffkkkFFffffffFFk.", "knnfffffFfffffffffffFk", "kkkffffffffffffffffffk", ".kkfffffffffffffffffdk", "..kffffffffffffffffddk", "..kdfffffffffffffffddk", "..kdffdkkkkkkkkkkdffdk", "..kdffdk........kdffdk", "..kcfcdk........kcfcdk", "..kkkkk.........kkkkk."],{k:'#060403',f:'#33241a',F:'#4e3828',d:'#1e140d',n:'#7a6250',e:'#ffab2e',c:'#d8d2c4'}),spr(["..kk.kk...............", ".kffkffk....kkkkkk....", ".kfffffk..kkFFFFFFkk..", "kffefffkkkFFffffffFFk.", "knnfffffFfffffffffffFk", "kkkffffffffffffffffffk", ".kkfffffffffffffffffdk", "..kffffffffffffffffddk", "..kdfffffffffffffffddk", "..kdffdkkkkkkkkkkdffdk", "...kdffdk......kdffdk.", "...kcfcdk......kcfcdk.", "...kkkkk.......kkkkk.."],{k:'#060403',f:'#33241a',F:'#4e3828',d:'#1e140d',n:'#7a6250',e:'#ffab2e',c:'#d8d2c4'})];
SPR.brigand=[spr(["....kkkk....","...khhhhk...","..khHhhhhk..","..khessehk..","..khrrrrhk..","..kkrRRrkk..",".kbcccccbbk.","kbcbccccbcbk","ksccbbbbccsk","kskcccccckgk",".kkccccccgk.","..kbbbbbbk..","..kcckkcck..","..kck..kck..","..kbk..kbk..","..kkk..kkk.."],{k:'#070605',h:'#2e2418',H:'#4a3a26',e:'#d9cfae',s:'#9c7656',r:'#6e1c1c',R:'#9a2b2b',b:'#24180f',c:'#36321f',g:'#b9c0c6'})];
SPR.vagrant=[spr(["............","....kkkk....","...kccccck..","..kcCsssck..","..kcseseck..","..kcswwsck..",".kccwwwwcck.","kcCcccccCcck","kcCcCccCcCkb","kccCccccCckb",".kcccCcccckb",".kcCcccCcckb","..kccccccckb","..kck.kck..b","..ksk.ksk..b","..kkk.kkk..k"],{k:'#070605',c:'#35322b',C:'#4f4b41',s:'#94765c',e:'#e0d6b0',w:'#7d7b70',b:'#5a4030'})];
SPR.knight=[spr(KD.concat(LEG_V[0]),OB_PAL)];
for(const k in SPR){SPR[k].white=tint(SPR[k][0],'#ffffff');SPR[k].flip=SPR[k].map(flipH)}

/* trees & props */
function makeOak(seed,big){const r=mulberry(seed),w=30,h=38,c=cvs(w,h),x=c.getContext('2d');
  const tx=12+Math.floor(r()*2);
  x.fillStyle='#0b0806';x.fillRect(tx-1,18,8,h-19);x.fillRect(tx-3,h-4,12,4);
  x.fillStyle='#2a1d14';x.fillRect(tx,18,6,h-20);x.fillRect(tx-2,h-3,10,2);
  x.fillStyle='#3b2a1d';x.fillRect(tx+1,20,1,h-24);
  x.fillStyle='#160f0a';for(let i=0;i<4;i++)x.fillRect(tx+2+((r()*3)|0),21+((r()*12)|0),1,2+((r()*3)|0));
  const blobs=[[15,12,10],[8+r()*2,16,6+r()*2],[22-r()*2,16,6+r()*2],[15+r()*4-2,6,7]];
  const ins=(px,py)=>blobs.some(([bx,by,br])=>(px-bx)**2+(py-by)**2<=br*br);
  const pal=big?['#070e09','#0c1710','#122016','#182a1c']:['#0b170f','#112217','#18301e','#213f27'];
  for(let py=0;py<27;py++)for(let px=0;px<w;px++){if(!ins(px,py))continue;
    const edge=!ins(px-1,py)||!ins(px+1,py)||!ins(px,py-1)||!ins(px,py+1);
    if(edge){x.fillStyle='#040906';x.fillRect(px,py,1,1);continue}
    const l=-(px-15)/18-(py-10)/14+(hash(px+seed*7,py)-.5)*.8;
    let i=l>.55?3:l>.15?2:l>-.35?1:0;if(i>0&&((px+py)&1)&&hash(px*3+seed,py*7)<.35)i--;
    x.fillStyle=pal[i];x.fillRect(px,py,1,1)}
  return c}
function makePine(seed){const r=mulberry(seed),w=24,h=42,c=cvs(w,h),x=c.getContext('2d');
  x.fillStyle='#0b0806';x.fillRect(10,h-10,4,10);x.fillStyle='#24180f';x.fillRect(11,h-10,2,9);
  const lean=(r()-.5)*1.5;
  const ins=(px,py)=>{for(let t=0;t<4;t++){const top=1+t*7,hh=13,half=3+t*2.4;if(py>=top&&py<top+hh){const k=(py-top+1)/hh;if(Math.abs(px-11.5-lean*(1-py/h))<=half*k+.5)return true}}return false};
  const pal=['#07120e','#0c1b15','#12261d','#193326'];
  for(let py=0;py<h-7;py++)for(let px=0;px<w;px++){if(!ins(px,py))continue;
    const edge=!ins(px-1,py)||!ins(px+1,py)||!ins(px,py-1)||!ins(px,py+1);
    if(edge){x.fillStyle='#030806';x.fillRect(px,py,1,1);continue}
    const l=-(px-11.5)/9+(hash(px+seed,py*3)-.5)*.9-((py%7)>9?.4:0);
    let i=l>.5?3:l>0?2:l>-.5?1:0;x.fillStyle=pal[i];x.fillRect(px,py,1,1)}
  return c}
function makeDead(seed){const r=mulberry(seed),w=26,h=36,c=cvs(w,h),x=c.getContext('2d');
  const px=(a,b,col)=>{x.fillStyle=col;x.fillRect(a,b,1,1)};
  x.fillStyle='#0a0908';x.fillRect(10,10,5,h-10);x.fillRect(8,h-3,9,3);
  x.fillStyle='#3a342d';x.fillRect(11,10,3,h-12);x.fillStyle='#4e463c';x.fillRect(11,12,1,h-16);
  for(let b=0;b<7;b++){let bx=11+((r()*3)|0),by=8+((r()*16)|0),dir=r()<.5?-1:1;
    for(let s=0;s<6+r()*7;s++){if(r()<.75)bx+=dir;if(r()<.65)by--;px(bx,by,s<3?'#3a342d':'#2c2723');if(r()<.12){px(bx,by-1,'#2c2723')}}}
  for(let s=0;s<9;s++)px(12+((r()*3)|0)-1,10-s,'#2c2723');
  return c}
const OAKS=[...Array(8)].map((_,i)=>makeOak(11+i*31));
const PINES=[...Array(6)].map((_,i)=>makePine(91+i*17));
const DEADS=[...Array(4)].map((_,i)=>makeDead(301+i*13));
const ELDER_TREE=(()=>{const o=makeOak(777,true),c=cvs(60,76),x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(o,0,0,60,76);return c})();
const ROCK=spr(["...kkkkk......","..kRRrrrkk....",".kRrrrrrrrk...","kRrrrrrdrrrk..","krrrmrrrrdrk..","krrmmrrrrddk..",".kkddddddkk...","...kkkkkk....."],{k:'#060606',R:'#5f5e58',r:'#45443f',d:'#2c2b28',m:'#344a26'});
const STONE=spr(["..kkkk..",".kRRrrk.","kRrrrrdk","kRrrrrdk","krrxrrdk","krxxxrdk","krrxrrdk","krrrrrdk","krmrrrdk","kmmrrrdk","krrrrmdk","krrrrrdk","krrrrrdk","kmrrrrdk","kmmrrmdk","krrrrrdk","kddddddk",".kkkkkk."],{k:'#050505',R:'#5c5b55',r:'#3c3b37',d:'#25241f',m:'#2f4422',x:'#7a1c14'});
const SHRINE=spr(["......kk......",".....kffk.....","....kkkkkk....","...kRRRRRRk...","...kkkkkkkk....","....kRrrdk....","....krrrdk....","....kRxrdk....","....krxrdk....","....krrrdk....","....kmrrdk....","...kRrrrrdk...","..kRrrmrrrdk..","..kkkkkkkkkk.."],{k:'#050606',R:'#6a6a64',r:'#45453f',d:'#2a2a26',m:'#2f4422',x:'#6fb6d8',f:'#bfeaff'});

const CHEST_ROWS=["..kkkkkkkkkk..",".kbBBBBBBBBbk.","kbBbbbbbbbbBbk","kbBbbbbbbbbBbk","kggggggggggggk","kbbbbkyykbbbbk","kbBbbkyykbbBbk","kbBbbbkkbbbBbk","kbBbbbbbbbbBbk","kggggggggggggk",".kkkkkkkkkkkk."];
const CPAL={k:'#070504',b:'#3a2618',B:'#5a3c24',g:'#5a5448',y:'#c9a24b',d:'#020101'};
const CHEST_SPR=spr(CHEST_ROWS,CPAL),CHEST_OPEN=spr(["..kkkkkkkkkk..",".kbBBBBBBBBbk.",".kkkkkkkkkkkk.","kddddddddddddk"].concat(CHEST_ROWS.slice(4)),CPAL);
