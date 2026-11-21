
/* ---- recolours, bosses, area props ---- */
function recolor(c,mp){const o=cvs(c.width,c.height),x=o.getContext('2d');x.drawImage(c,0,0);const d=x.getImageData(0,0,o.width,o.height),a=d.data,M={};
  for(const k in mp)M[parseInt(k.slice(1),16)]=parseInt(mp[k].slice(1),16);
  for(let i=0;i<a.length;i+=4){if(!a[i+3])continue;const v=(a[i]<<16)|(a[i+1]<<8)|a[i+2];if(M[v]!==undefined){const t=M[v];a[i]=t>>16;a[i+1]=(t>>8)&255;a[i+2]=t&255}}
  x.putImageData(d,0,0);return o}
SPR.ooze=[recolor(SPR.slime[0],{'#0a1207':'#07080e','#3d5a1e':'#3a4a5c','#5e7426':'#5a6c80','#22351a':'#232c38','#9a9a32':'#8aa0b8','#cfd59a':'#dce8f4','#0b0f05':'#06080c'})];
SPR.colossus=[recolor(SPR.golem[0],{'#0a0a09':'#04050a','#5a5a54':'#34445e','#7c7b72':'#54688e','#363633':'#1c2436','#3c5528':'#6ab8e8','#6fd0ff':'#e8f8ff'})];
SPR.rotmother=[recolor(SPR.shroom[0],{'#0a0505':'#050305','#4e1822':'#3a1a4a','#7d2a38':'#5e2a70','#c9b98a':'#9ac84a','#b3a688':'#7a8a5a','#7f7462':'#4a5a3a','#f0dd48':'#ff5ae8','#1a0808':'#14061a'})];
SPR.harrow=[spr(KD.concat(LEG_V[0]),{k:'#050403',R:'#d8b048',r:'#7a5a1a',S:'#4a4238',s:'#2e2924',d:'#17130f',e:'#ffd040',g:'#ffe8a0',b:'#1a1208'})];
for(const k of['ooze','colossus','rotmother','harrow']){SPR[k].white=tint(SPR[k][0],'#ffffff');SPR[k].flip=SPR[k].map(flipH)}
PS.sheep=spr([".kkkkk...","kwWwWwk..","kwwwwwwkk","kwWwwwkhk","kwwwWwkkk",".kkkkkk..",".k.k.k.k."],{k:'#1a1612',w:'#e8e4d8',W:'#cfc8b8',h:'#3a3028'});
PS.sheepF=flipH(PS.sheep);
PS.crystal=spr(["..k..",".kak.",".kak.","kabak","kabak","kaaak","kabak",".kak.","kkkkk"],{a:'#6ab8e8',b:'#d8f4ff',k:'#0a1a2a'});
// brighter oaks for the plains
function makeBrightOak(seed){const r=mulberry(seed),w=30,h=38,c=cvs(w,h),x=c.getContext('2d'),tx=12+Math.floor(r()*2);
  x.fillStyle='#1a120a';x.fillRect(tx-1,18,8,h-19);x.fillRect(tx-3,h-4,12,4);x.fillStyle='#5a3e26';x.fillRect(tx,18,6,h-20);x.fillRect(tx-2,h-3,10,2);x.fillStyle='#7a5636';x.fillRect(tx+1,20,1,h-24);
  const blobs=[[15,12,10],[8+r()*2,16,6+r()*2],[22-r()*2,16,6+r()*2],[15+r()*4-2,6,7]],ins=(px,py)=>blobs.some(([bx,by,br])=>(px-bx)**2+(py-by)**2<=br*br),pal=['#2a5a26','#3a7a30','#4f9a3e','#6ab852'];
  for(let py=0;py<27;py++)for(let px=0;px<w;px++){if(!ins(px,py))continue;const edge=!ins(px-1,py)||!ins(px+1,py)||!ins(px,py-1)||!ins(px,py+1);
    if(edge){x.fillStyle='#163018';x.fillRect(px,py,1,1);continue}const l=-(px-15)/18-(py-10)/14+(hash(px+seed*7,py)-.5)*.8;let i=l>.55?3:l>.15?2:l>-.35?1:0;if(i>0&&((px+py)&1)&&hash(px*3+seed,py*7)<.35)i--;x.fillStyle=pal[i];x.fillRect(px,py,1,1)}
  return c}
const OAKS_B=[...Array(6)].map((_,i)=>makeBrightOak(501+i*29));
const OAKS_S=OAKS.map(o=>recolor(o,{'#0b170f':'#14170a','#112217':'#1c2210','#18301e':'#263014','#213f27':'#323d1a'}));
