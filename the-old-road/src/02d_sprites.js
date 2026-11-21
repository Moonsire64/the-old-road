
/* ---- furniture, scenery, buildings, npcs ---- */
const mk=(w,h,fn)=>{const c=cvs(w,h),x=c.getContext('2d');fn((col,a,b,cw,ch)=>{x.fillStyle=col;x.fillRect(a|0,b|0,cw,ch)},x);return c};
const FS={
  bed:mk(14,20,R=>{R('#1a120a',0,0,14,20);R('#5a3e26',1,1,12,18);R('#d8d0b8',2,2,10,4);R('#6e2a24',2,7,10,11);R('#8a3a30',2,7,10,2);R('#4a1e1a',2,16,10,2)}),
  table:mk(16,14,R=>{R('#120c06',0,2,16,7);R('#6a4a2e',1,3,14,5);R('#7a5a3a',1,3,14,1);R('#3a2414',2,9,2,5);R('#3a2414',12,9,2,5);R('#d8d0b8',4,4,3,2);R('#8a8478',9,4,2,2)}),
  chair:mk(8,12,R=>{R('#120c06',0,0,8,12);R('#5a3e26',1,1,6,4);R('#5a3e26',1,6,6,2);R('#3a2414',1,8,1,4);R('#3a2414',6,8,1,4)}),
  shelf:mk(16,22,R=>{R('#0c0805',0,0,16,22);R('#3a2414',1,1,14,20);for(let s=0;s<3;s++){R('#5a3e26',1,7+s*6,14,1);for(let b=0;b<6;b++)R(['#6e2a24','#2a4a6a','#4a6a2a','#8a6a2a','#5a2a5a','#3a3a3a'][(b+s*2)%6],2+b*2,2+s*6,2,5)}}),
  barrel:mk(12,14,R=>{R('#120c06',1,0,10,14);R('#6a4a2e',2,1,8,12);R('#7a5a3a',3,1,2,12);R('#3a3a36',1,3,10,1);R('#3a3a36',1,10,10,1)}),
  crate:mk(14,13,R=>{R('#120c06',0,0,14,13);R('#7a5a36',1,1,12,11);R('#5a3e26',1,1,12,1);R('#5a3e26',1,6,12,1);R('#5a3e26',1,11,12,1);for(let i=0;i<11;i++)R('#4a3020',1+i,1+i,1,1)}),
  fireplace:mk(16,20,R=>{R('#0a0a09',0,0,16,20);R('#4a4642',1,1,14,18);R('#5a5650',1,1,14,2);R('#0c0806',4,9,8,10);R('#3a1a0a',5,16,6,2);R('#a8401a',6,16,1,1);R('#a8401a',9,17,1,1)}),
  wardrobe:mk(14,22,R=>{R('#0c0805',0,0,14,22);R('#4a3020',1,1,12,20);R('#3a2414',7,2,1,18);R('#c9a24b',5,10,1,2);R('#c9a24b',8,10,1,2)}),
  altar:mk(16,14,R=>{R('#0a0a09',0,3,16,11);R('#6a6862',1,4,14,9);R('#7a2020',3,4,10,4);R('#c9a24b',3,7,10,1);R('#e8dcc0',7,0,2,4);R('#ffd870',7,0,2,1)}),
  pew:mk(16,10,R=>{R('#0c0805',0,0,16,10);R('#5a3e26',1,1,14,3);R('#4a3020',1,5,14,2);R('#3a2414',1,7,2,3);R('#3a2414',13,7,2,3)}),
  hay:mk(16,12,R=>{R('#2a2008',0,1,16,11);R('#b8963a',1,2,14,9);R('#d8b84a',2,2,12,2);for(let i=0;i<10;i++)R('#8a6a2a',1+i*1.4,4+(i%3)*2,1,2)}),
  cauldron:mk(14,12,R=>{R('#050505',0,1,14,11);R('#1a1a1a',1,2,12,9);R('#3a8a3a',2,2,10,2);R('#6ad86a',4,2,2,1);R('#2a2a2a',2,11,2,1);R('#2a2a2a',10,11,2,1)}),
  stash:mk(16,13,R=>{R('#060504',0,1,16,12);R('#4a3422',1,2,14,10);R('#5e4430',1,2,14,3);R('#2a1c12',1,5,14,1);R('#7a7a82',3,2,2,10);R('#7a7a82',11,2,2,10);R('#9a9aa2',3,2,2,1);R('#9a9aa2',11,2,2,1);R('#c9a24b',7,5,2,3);R('#2a1c12',7,7,2,1);R('#1a120a',1,11,14,1)}),
  anvil:mk(14,10,R=>{R('#050505',0,0,14,10);R('#5a5a60',1,1,12,3);R('#3a3a40',4,4,6,3);R('#4a4a50',2,7,10,3)}),
  counter:mk(16,14,R=>{R('#0c0805',0,0,16,14);R('#5a3e26',1,1,14,5);R('#4a3020',1,6,14,7);R('#8a8478',3,2,2,2);R('#3a5a3a',8,2,2,3)}),
  millstone:mk(16,14,R=>{R('#050505',1,2,14,11);R('#6a6862',2,3,12,9);R('#4a4844',7,6,2,2);R('#5a3e26',7,0,2,6)}),
  painting:mk(12,10,R=>{R('#3a2414',0,0,12,10);R('#c9a24b',1,1,10,8);R('#1a2a2a',2,2,8,6);R('#4a3a2a',4,4,3,3);R('#d8cfb0',5,4,1,1)}),
};
FS.barrelB=mk(12,6,R=>{R('#3a2414',1,2,4,2);R('#5a3e26',6,3,5,2);R('#3a3a36',3,4,6,1)});
FS.crateB=mk(14,6,R=>{R('#5a3e26',0,3,6,2);R('#7a5a36',7,2,6,2);R('#4a3020',4,4,5,1)});
Object.assign(PS,{
  cart:mk(24,15,R=>{R('#120c06',1,2,20,8);R('#5a3e26',2,3,18,6);R('#4a3020',2,5,18,1);R('#3a2414',20,6,4,2);R('#1a120a',3,9,7,6);R('#5a4030',4,10,5,4);R('#2a1d12',6,11,1,2);R('#1a120a',14,12,7,3);R('#5a4030',15,12,5,2)}),
  tent:mk(22,16,R=>{for(let y=0;y<14;y++){const w=Math.round(y*1.5);R('#100c08',11-w-1,y+1,w*2+2,1);R(y%3?'#7a6a4a':'#6a5a3a',11-w,y+1,w*2,1)}R('#0a0806',9,8,4,8);R('#3a2414',10,0,2,3)}),
  cage:mk(12,24,R=>{R('#2a1d12',1,0,2,24);R('#2a1d12',1,0,9,2);R('#3a3a3a',7,2,1,4);R('#1a1a1a',4,6,7,10);for(let i=0;i<4;i++)R('#4a4a4a',4+i*2,6,1,10);R('#4a4a4a',4,6,7,1);R('#4a4a4a',4,15,7,1);R('#d8cfb0',6,12,3,2)}),
  statue:mk(12,26,R=>{R('#0a0a09',2,22,8,4);R('#4a4844',3,22,6,3);R('#0a0a09',3,2,6,20);R('#7a7870',4,3,4,4);R('#6a6862',4,7,4,10);R('#5a5852',3,8,1,7);R('#5a5852',8,8,1,7);R('#6a6862',4,17,1,5);R('#6a6862',7,17,1,5);R('#8a8880',5,4,1,1)}),
  shrine:mk(12,16,R=>{R('#050505',0,4,12,12);R('#5a5852',1,5,10,10);R('#3a3832',0,2,12,3);R('#2a2826',3,0,6,3);R('#0a0806',4,8,4,6);R('#ffd870',5,10,2,2);R('#8a2a1a',5,12,2,1)}),
  log:mk(22,8,R=>{R('#0c0805',0,1,22,7);R('#4a3020',1,2,20,5);R('#5a3e26',1,2,20,1);R('#7a5a3a',19,2,2,5);R('#5a3e26',20,3,1,3);R('#2a5a2a',6,1,3,1)}),
  stump:mk(12,9,R=>{R('#0c0805',1,1,10,8);R('#4a3020',2,3,8,6);R('#8a6a42',2,1,8,3);R('#6a4a2e',4,2,4,1)}),
  cairn:mk(12,13,R=>{R('#050505',1,9,10,4);R('#5a5852',2,9,8,3);R('#050505',2,5,8,5);R('#6a6862',3,5,6,4);R('#050505',4,1,5,5);R('#7a7870',5,2,3,3)}),
  totem:mk(8,22,R=>{R('#0a0806',2,0,4,22);R('#5a4030',3,1,2,20);R('#d8cfb0',1,3,6,4);R('#050505',2,4,1,1);R('#050505',5,4,1,1);R('#8a2a1a',2,9,4,1);R('#3a5a3a',1,12,6,2);R('#d8cfb0',3,15,2,2)}),
  hive:mk(10,13,R=>{R('#2a2008',1,1,8,12);R('#c8962a',2,2,6,10);R('#a8761a',2,4,6,1);R('#a8761a',2,7,6,1);R('#a8761a',2,10,6,1);R('#1a1206',4,8,2,2)}),
  haystack:mk(20,15,R=>{for(let y=0;y<13;y++){const w=Math.round(4+y*.6);R('#2a2008',10-w-1,y+2,w*2+2,1);R(y%2?'#c8a64a':'#b8963a',10-w,y+2,w*2,1)}R('#d8b84a',8,2,4,2)}),
  boat:mk(24,10,R=>{R('#0c0805',0,2,24,7);R('#4a3a28',1,3,22,5);R('#5a4a34',2,3,20,1);R('#2a2014',4,5,16,2);R('#3a2a1a',18,0,1,4)}),
  minecart:mk(16,13,R=>{R('#050505',0,2,16,8);R('#4a4a4e',1,3,14,6);R('#5a5a60',1,3,14,1);R('#2a2826',2,4,12,2);R('#7a7468',3,3,4,1);R('#1a1a1a',2,10,4,3);R('#1a1a1a',10,10,4,3)}),
  orevein:mk(14,12,R=>{R('#050505',0,2,14,10);R('#3a3632',1,3,12,8);R('#4a4642',2,3,9,2);R('#6ab8e8',4,6,2,2);R('#c8a24b',8,5,2,1);R('#6ab8e8',9,8,1,2);R('#d8f4ff',4,6,1,1)}),
  timber:mk(16,24,R=>{R('#0c0805',1,0,3,24);R('#0c0805',12,0,3,24);R('#0c0805',0,0,16,4);R('#5a3e26',2,1,1,23);R('#5a3e26',13,1,1,23);R('#5a3e26',1,1,14,2);R('#3a2414',2,4,1,20)}),
  crow:mk(9,9,R=>{R('#050505',2,1,5,6);R('#0e0e12',3,2,3,4);R('#e8c84a',5,2,1,1);R('#4a4a3a',7,3,2,1);R('#050505',1,5,2,2);R('#3a3a3a',3,7,1,2);R('#3a3a3a',5,7,1,2)}),
  frogking:mk(11,10,R=>{R('#c9a24b',3,0,5,2);R('#ffd870',3,0,1,1);R('#ffd870',5,0,1,1);R('#ffd870',7,0,1,1);R('#0a1206',1,2,9,7);R('#3a5a2a',2,3,7,5);R('#6a8a3a',3,5,5,2);R('#e8e86a',2,3,2,2);R('#e8e86a',7,3,2,2);R('#050505',3,4,1,1);R('#050505',8,4,1,1);R('#0a1206',1,9,3,1);R('#0a1206',7,9,3,1)}),
});
SPR.mosquito=SPR.bat.map(c=>recolor(c,{'#2a1c2e':'#3a3428','#47344f':'#5a5240','#33243a':'#8a8a7a','#ff3b2a':'#ff6a2a','#e6dccb':'#2a2420'}));
SPR.mosquito.white=tint(SPR.mosquito[0],'#ffffff');SPR.mosquito.flip=SPR.mosquito.map(flipH);
/* ---- buildings ---- */
const BTYPES={
  cabin:{name:"Woodcutter's Cabin",fw:4,fh:3,iw:16,ih:12,rooms:2,mat:'wood',style:'gable',chim:1,col:['#5a3e26','#3a2414','#2a2a24','#1a1a16'],furn:['bed','table','chair','chair','fireplace','barrel','barrel','crate','shelf'],mobs:['imps','wolves']},
  lodge:{name:"Hunter's Lodge",fw:5,fh:3,iw:22,ih:14,rooms:3,mat:'wood',style:'gable',chim:1,col:['#4a3020','#2e1c10','#3a1e14','#24120c'],furn:['bed','bed','table','chair','fireplace','painting','painting','shelf','barrel','crate','wardrobe'],mobs:['bear','vagrant']},
  chapel:{name:'Ruined Chapel',fw:5,fh:4,iw:12,ih:14,rooms:1,mat:'stone',style:'steeple',col:['#5a5852','#3e3c38','#2a2a30','#1a1a20'],furn:['altar','lectern','font','candles','reliquary','pew','pew','pew','pew','painting'],mobs:['vagrant','bat']},
  tower:{name:'Old Watchtower',fw:3,fh:3,iw:14,ih:14,rooms:2,mat:'stone',style:'tower',col:['#5a5852','#3e3c38','#3a3a40','#24242a'],furn:['bed','table','anvil','crate','crate','barrel','shelf'],mobs:['brigand','brigand']},
  bunk:{name:"Miners' Bunkhouse",fw:5,fh:3,iw:20,ih:12,rooms:2,mat:'wood',style:'flat',col:['#4a4038','#2e2822','#3a3a3a','#262626'],furn:['bed','bed','bed','bed','table','chair','barrel','crate','crate'],mobs:['ooze','imps']},
  office:{name:"Foreman's Office",fw:4,fh:3,iw:14,ih:12,rooms:2,mat:'wood',style:'flat',col:['#4a3a2a','#2e2418','#3a3a3a','#262626'],furn:['table','chair','shelf','shelf','wardrobe','crate','painting'],mobs:['golem']},
  shrine:{name:'Collapsed Shrine',fw:4,fh:3,iw:16,ih:16,rooms:1,mat:'stone',style:'steeple',col:['#3e4450','#2a2e38','#22262e','#14161c'],furn:['altar','pew','pew','pew','painting'],mobs:['bat','bat']},
  store:{name:'Storehouse',fw:5,fh:3,iw:18,ih:14,rooms:2,mat:'wood',style:'flat',col:['#4a4038','#2e2822','#2e2e2e','#1e1e1e'],furn:['crate','crate','crate','crate','barrel','barrel','barrel','shelf'],mobs:['imps','ooze']},
  stilt:{name:'Stilt Hut',fw:4,fh:3,iw:14,ih:12,rooms:1,mat:'wood',style:'stilt',col:['#4a4a2a','#2e2e18','#6a6a3a','#4a4a24'],furn:['bed','table','chair','barrel','shelf','cauldron'],mobs:['slime','mosquito']},
  witch:{name:"Witch's Hut",fw:4,fh:3,iw:16,ih:14,rooms:2,mat:'wood',style:'gable',chim:1,col:['#3a2a3a','#241a24','#4a3a2a','#2a2014'],furn:['cauldron','cauldron','shelf','shelf','table','bed','barrel','painting'],mobs:['shroom','shroom']},
  sunken:{name:'Sunken Chapel',fw:5,fh:4,iw:18,ih:20,rooms:1,mat:'stone',style:'steeple',water:1,col:['#4a5248','#323a32','#22302a','#141e18'],furn:['altar','pew','pew','pew','pew','painting'],mobs:['slime','shroom','mosquito']},
  boathouse:{name:'Boathouse',fw:5,fh:3,iw:18,ih:12,rooms:1,mat:'wood',style:'gable',water:1,col:['#3e3a2a','#262218','#2a2a20','#1a1a14'],furn:['crate','crate','barrel','barrel','table','anvil'],mobs:['mosquito','slime']},
  farm:{name:'Farmhouse',fw:5,fh:3,iw:22,ih:16,rooms:4,mat:'wood',style:'gable',chim:1,col:['#c8b890','#9a8a68','#8a6a3a','#6a4e28'],furn:['bed','bed','table','chair','chair','fireplace','shelf','wardrobe','barrel','painting','crate'],mobs:['brigand','imps']},
  barn:{name:'Barn',fw:6,fh:4,iw:22,ih:16,rooms:1,mat:'wood',style:'gable',col:['#8a2a20','#5a1a14','#4a3a2a','#2e2418'],furn:['hay','hay','hay','hay','crate','crate','barrel','anvil'],mobs:['wolves','brigand']},
  windmill:{name:'Windmill',fw:3,fh:3,iw:12,ih:12,rooms:1,mat:'stone',style:'mill',col:['#c8c0a8','#9a9280','#6a4a2e','#4a3420'],furn:['millstone','crate','barrel','hay'],mobs:['imps']},
  charcoal:{name:"Charcoal Burner's Hut",fw:3,fh:3,iw:12,ih:12,rooms:1,mat:'wood',style:'flat',chim:1,col:['#3a3430','#221e1a','#2a2622','#16140f'],furn:['bed','fireplace','barrel','crate','crate','shelf'],mobs:['vagrant']},
  sawmill:{name:'Sawmill',fw:6,fh:3,iw:22,ih:12,rooms:2,mat:'wood',style:'gable',col:['#6a4a2a','#46301a','#3a2a1a','#24180e'],furn:['crate','crate','crate','barrel','table','anvil','shelf','hay'],mobs:['wolves','brigand']},
  kennel:{name:"Huntsman's Kennels",fw:5,fh:3,iw:18,ih:12,rooms:2,mat:'wood',style:'flat',col:['#5a4630','#3a2c1c','#3a2e22','#241c14'],furn:['hay','hay','hay','barrel','crate','table','bed'],mobs:['wolves','wolves']},
  forge:{name:'Old Forge',fw:4,fh:3,iw:16,ih:12,rooms:1,mat:'stone',style:'flat',chim:1,col:['#4a4440','#2e2a28','#3a2a22','#221812'],furn:['anvil','anvil','fireplace','barrel','crate','shelf'],mobs:['golem','imps']},
  guard:{name:'Guardhouse',fw:3,fh:3,iw:14,ih:14,rooms:2,mat:'stone',style:'tower',col:['#4a4c54','#30323a','#2a2a30','#18181e'],furn:['bed','bed','table','chair','crate','barrel','shelf'],mobs:['brigand','bat']},
  ossuary:{name:'Ossuary',fw:4,fh:4,iw:12,ih:14,rooms:1,mat:'stone',style:'steeple',col:['#5a5448','#3e3a32','#2a2620','#16140f'],furn:['altar','reliquary','candles','shelf','shelf','shelf','pew'],mobs:['bat','ooze']},
  herbal:{name:"Herbalist's Hut",fw:4,fh:3,iw:14,ih:12,rooms:1,mat:'wood',style:'stilt',col:['#3a4a2a','#24301a','#5a6a3a','#3a4a24'],furn:['cauldron','shelf','shelf','table','bed','barrel'],mobs:['shroom','mosquito']},
  tannery:{name:'Tannery',fw:5,fh:3,iw:18,ih:12,rooms:2,mat:'wood',style:'flat',col:['#4a3a26','#2e2416','#3a3020','#221c12'],furn:['cauldron','cauldron','barrel','barrel','crate','table','shelf'],mobs:['slime','slime']},
  ferry:{name:"Ferryman's House",fw:4,fh:3,iw:16,ih:12,rooms:2,mat:'wood',style:'gable',chim:1,water:1,col:['#3a3e34','#24281e','#2e2e24','#1a1a14'],furn:['bed','table','chair','fireplace','barrel','crate'],mobs:['mosquito','shroom']},
  smithy:{name:'Village Smithy',fw:4,fh:3,iw:16,ih:12,rooms:1,mat:'stone',style:'gable',chim:1,col:['#8a8270','#5e5848','#4a2a1e','#2e1a12'],furn:['anvil','anvil','fireplace','crate','barrel','shelf'],mobs:['brigand']},
  granary:{name:'Granary',fw:3,fh:3,iw:12,ih:12,rooms:1,mat:'wood',style:'tower',col:['#a8925a','#7a6a3e','#6a4a2a','#4a3220'],furn:['hay','hay','hay','crate','crate','barrel'],mobs:['imps','imps']},
  manor:{name:'Abandoned Manor',fw:6,fh:4,iw:26,ih:18,rooms:5,mat:'stone',style:'gable',chim:1,col:['#9a9488','#6a665c','#3a2a2e','#22181c'],furn:['bed','bed','bed','table','table','chair','chair','fireplace','fireplace','painting','painting','painting','wardrobe','shelf','shelf'],mobs:['brigand','vagrant','brigand']},
  inn:{name:'The Last Lantern Inn',fw:6,fh:4,iw:24,ih:18,rooms:4,mat:'wood',style:'gable',chim:1,col:['#b8a880','#8a7a58','#5a3a2a','#3a2418'],furn:['counter','counter','table','table','table','chair','chair','chair','barrel','barrel','barrel','bed','bed','fireplace','painting','shelf'],mobs:['brigand','vagrant','brigand']},
};
/* 0.20: three more buildings for every region, and three new shapes: roofless ruins, lean-tos, and round thatched huts */
Object.assign(BTYPES,{
  bothy:{name:"Shepherd's Bothy",fw:3,fh:3,iw:10,ih:10,rooms:1,mat:'stone',style:'round',col:['#6a665e','#4a463e','#8a7a4a','#5a4a2a'],furn:['bed','fireplace','barrel','crate'],mobs:['wolves']},
  ruinhall:{name:'Ruined Hall',fw:6,fh:3,iw:20,ih:14,rooms:2,mat:'stone',style:'ruin',col:['#5a5852','#3e3c38','#2a2a30','#1a1a20'],furn:['table','chair','painting','reliquary','crate','barrel','pew'],mobs:['brigand','vagrant','bat']},
  forester:{name:"Forester's Lean-to",fw:4,fh:2,iw:12,ih:10,rooms:1,mat:'wood',style:'lean',col:['#5a4028','#3a2818','#3a4a24','#24301a'],furn:['bed','table','barrel','crate','shelf'],mobs:['bear','vagrant']},
  pumphouse:{name:'Pump House',fw:4,fh:3,iw:14,ih:12,rooms:1,mat:'stone',style:'flat',col:['#4a4c50','#2e3034','#3a2a22','#221812'],furn:['barrel','barrel','crate','shelf','anvil'],mobs:['ooze','golem']},
  deepchapel:{name:'Chapel of the Deep',fw:5,fh:3,iw:14,ih:14,rooms:1,mat:'stone',style:'ruin',col:['#3e4450','#2a2e38','#22262e','#14161c'],furn:['altar','candles','pew','pew','reliquary','font'],mobs:['bat','revenant']},
  powder:{name:'Powder Store',fw:3,fh:2,iw:10,ih:10,rooms:1,mat:'wood',style:'lean',col:['#4a3a2a','#2e2418','#5a2a1e','#3a1a12'],furn:['barrel','barrel','barrel','crate','crate'],mobs:['imps']},
  smokehouse:{name:'Eel Smokehouse',fw:4,fh:2,iw:12,ih:10,rooms:1,mat:'wood',style:'lean',chim:1,col:['#3a3424','#241e14','#3a3a24','#24241a'],furn:['fireplace','barrel','barrel','shelf','table'],mobs:['slime','leech']},
  drownedhouse:{name:'Drowned House',fw:5,fh:3,iw:16,ih:12,rooms:2,mat:'wood',style:'ruin',water:1,col:['#3a3e34','#24281e','#2e2e24','#1a1a14'],furn:['bed','table','chair','painting','wardrobe'],mobs:['drowned','slime']},
  reedhut:{name:'Reed Hut',fw:3,fh:3,iw:10,ih:10,rooms:1,mat:'wood',style:'round',col:['#6a6a3a','#4a4a24','#8a8a4a','#5a5a2a'],furn:['bed','cauldron','barrel'],mobs:['mosquito','toad']},
  shepherd:{name:"Shepherd's Hut",fw:3,fh:3,iw:10,ih:10,rooms:1,mat:'wood',style:'round',col:['#a8925a','#7a6a3e','#c8b070','#8a7448'],furn:['bed','fireplace','barrel','hay'],mobs:['wolves','hound']},
  burntfarm:{name:'Burnt Farmstead',fw:5,fh:3,iw:18,ih:14,rooms:3,mat:'wood',style:'ruin',col:['#3a3028','#221c16','#2a2018','#16100c'],furn:['bed','table','chair','fireplace','crate','barrel'],mobs:['brigand','houndpack']},
  tollhouse:{name:'Toll House',fw:4,fh:2,iw:12,ih:10,rooms:1,mat:'stone',style:'lean',col:['#8a8270','#5e5848','#4a2a1e','#2e1a12'],furn:['counter','table','chair','crate','shelf'],mobs:['band']}});
const BLDC={};
function bldSprite(bt){if(BLDC[bt])return BLDC[bt];const b=BTYPES[bt],w=b.fw*16,h=(b.fh+2)*16+(b.style==='tower'?16:0)+(b.style==='steeple'?14:0),c=cvs(w,h),x=c.getContext('2d'),R=(col,a,bb,cw,ch)=>{x.fillStyle=col;x.fillRect(a|0,bb|0,cw,ch)};
  const[wall,wallD,roof,roofD]=b.col,stilt=b.style==='stilt'?8:0,base=h-stilt,wallH=b.style==='tower'?b.fh*16+22:b.style==='ruin'?b.fh*16-10:b.fh*16-2,top=base-wallH;
  if(stilt){for(const sx of[3,w/2-1,w-6])R('#1a120a',sx,base-2,3,stilt+2)}
  R('#050403',0,top-1,w,wallH+1);R(wall,1,top,w-2,wallH-1);
  if(b.mat==='wood')for(let yy=top+3;yy<base;yy+=4)R(wallD,1,yy,w-2,1);
  else for(let yy=top+2,row=0;yy<base;yy+=5,row++){R(wallD,1,yy,w-2,1);for(let xx=(row%2)*6+3;xx<w-2;xx+=12)R(wallD,xx,yy,1,5)}
  const roofTri=(peak,eave,ov)=>{for(let yy=peak;yy<=eave;yy++){const t=(yy-peak)/Math.max(1,eave-peak),hw=t*(w/2+ov);R('#050403',w/2-hw-1,yy,hw*2+2,1);R((yy-peak)%3===0?roofD:roof,w/2-hw,yy,hw*2,1)}};
  if(b.style==='gable'||b.style==='stilt'){roofTri(Math.max(0,top-26),top+4,3)}
  else if(b.style==='steeple'){roofTri(Math.max(14,top-20),top+4,2);R('#050403',w/2-5,0,10,top-6);R(wall,w/2-4,6,8,top-12);R(roofD,w/2-5,0,10,7);R('#8a8478',w/2-1,0,2,6);R('#0a0806',w/2-2,10,4,6)}
  else if(b.style==='flat'){R('#050403',-1,top-5,w+2,7);R(roof,0,top-4,w,5);R(roofD,0,top,w,1)}
  else if(b.style==='tower'){for(let xx=0;xx<w;xx+=8){R('#050403',xx,top-6,5,7);R(wall,xx+1,top-5,3,6)}R('#0a0806',w/2-2,top+12,4,7);R('#0a0806',w/2-2,top+30,4,7)}
  else if(b.style==='mill'){roofTri(Math.max(0,top-18),top+3,1)}
  else if(b.style==='ruin'){/* no roof: the wall-tops broken off unevenly, a dark edge where they broke, rubble at the foot */let hh=2;for(let xx=0;xx<w;xx+=3){hh=Math.max(0,Math.min(12,hh+((xx*7919+bt.length*31)%7)-3));x.clearRect(xx,top-1,3,hh+1);R('#050403',xx,top+hh,3,1);R(wallD,xx,top+hh+1,3,1)}
    for(let xx=3;xx<w-3;xx+=7){R('#050403',xx-1,base-3,5,3);R(wallD,xx,base-3,3,2);R(wall,xx,base-3,2,1)}}
  else if(b.style==='lean'){/* a single slope, high at the back */for(let yy=0;yy<14;yy++){const x0=Math.round((yy+1)*w/14);R('#050403',0,top-14+yy,x0+1,1);R(yy%3===0?roofD:roof,0,top-14+yy,x0-1,1)}R('#050403',0,top,w,1)}
  else if(b.style==='round'){/* a cone of thatch */roofTri(Math.max(0,top-22),top+5,4);for(let yy=top-14;yy<top+4;yy+=3)R(roofD,w/2-6,yy,12,1)}
  if(b.chim){R('#050403',w-14,top-20,7,16);R(wallD==='#2e1c10'?'#4a4642':'#5a5650',w-13,top-19,5,14)}
  if(b.style!=='tower'&&b.style!=='mill'){const wy=top+8;R('#050403',6,wy,7,7);R('#0e1014',7,wy+1,5,5);R(wallD,9,wy+1,1,5);R('#050403',w-13,wy,7,7);R('#0e1014',w-12,wy+1,5,5);R(wallD,w-10,wy+1,1,5)}
  const dw=b.fw>=5?12:10,dh=b.fw>=5?16:14;R('#050403',w/2-dw/2-1,base-dh-1,dw+2,dh+1);R('#1a0e06',w/2-dw/2,base-dh,dw,dh);R('#3a2414',w/2-dw/2+1,base-dh+1,dw-2,dh-1);R('#2a1a0c',w/2-1,base-dh+1,1,dh-1);R('#c9a24b',w/2+dw/2-3,base-dh/2,1,2);
  return BLDC[bt]=c}
/* v8.3 clickables */
PS.idol=mk(12,18,(f)=>{f('#050505',2,3,8,15);f('#1e1c22',3,4,6,13);f('#2e2a34',4,5,4,4);f('#c83a2a',4,6,1,1);f('#c83a2a',7,6,1,1);f('#141218',4,10,4,2);f('#3a3640',3,14,6,1);f('#050505',1,16,10,2);f('#2a2830',2,16,8,1)});
PS.mushring=mk(18,10,(f)=>{for(const[a,b]of[[1,5],[4,2],[8,1],[12,2],[15,5],[13,8],[8,8],[3,8]]){f('#2a2018',a+1,b+2,1,2);f('#d8d0c0',a,b,3,2);f('#f0e8d8',a+1,b,1,1)}});
PS.spring=mk(16,9,(f)=>{f('#2a2a24',1,2,14,6);f('#3a3a32',0,3,16,4);f('#1a3a4a',2,3,12,4);f('#2a5a6a',3,4,10,2);f('#6a9aaa',5,4,3,1)});
PS.satchel=mk(10,8,(f)=>{f('#1a1008',0,2,10,6);f('#5a3a20',1,3,8,4);f('#7a5030',1,2,8,2);f('#c9a24b',4,4,2,1);f('#3a2410',3,0,4,2)});
PS.glint=mk(7,7,(f)=>{f('#fff4c0',3,0,1,7);f('#fff4c0',0,3,7,1);f('#ffffff',3,3,1,1);f('#c9a24b',2,2,3,3);f('#ffffff',3,3,1,1)});
