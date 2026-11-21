/* ================= EVERY MAP ITS OWN PLACE =================
   Each of the twelve maps has its own blend: which creatures (old, new and sharper variants), which oddities to
   poke at, which puzzle, which roadside happenings, and its own small voice. */

/* ---- variants: an old creature with a new name, sharper teeth, a different coat ---- */
/* recolour a creature's coat but keep its dark outline and its eyes, so it still reads as the same shape */
function tintSpr(c,col,a){const o=cvs(c.width,c.height),x=o.getContext('2d');x.drawImage(c,0,0);const d=x.getImageData(0,0,c.width,c.height),p=d.data,r=parseInt(col.slice(1,3),16),g=parseInt(col.slice(3,5),16),b=parseInt(col.slice(5,7),16);
  for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const L=p[i]*.3+p[i+1]*.59+p[i+2]*.11,sat=Math.max(p[i],p[i+1],p[i+2])-Math.min(p[i],p[i+1],p[i+2]);if(L<28||(sat>90&&L>120))continue;p[i]=p[i]*(1-a)+r*a;p[i+1]=p[i+1]*(1-a)+g*a;p[i+2]=p[i+2]*(1-a)+b*a}x.putImageData(d,0,0);return o}
function addVariant(id,base,o){const B=KINDS[base];KINDS[id]=Object.assign({},B,{base,name:o.name,hm:o.hm||1,am:o.am||1,xpm:o.xpm||o.hm||1},o.k||{});
  if(SPR[base]){SPR[id]=SPR[base].map(c=>tintSpr(c,o.tint||'#000',o.ta??.3));SPR[id].white=SPR[base].white;SPR[id].flip=SPR[id].map(flipH)}
  for(const T of[FP,BSZ,DIE,STUDY,DROPS,GOLD,BLEEDC])if(T[base]!==undefined&&T[id]===undefined)T[id]=T[base];if(o.bsz)BSZ[id]=o.bsz;
  INTRO[id]=o.intro||INTRO[base];if(o.study)STUDY[id]=o.study.concat(STUDY[base]||[])}
function addPack(id,unit,n,o){KINDS[id]=Object.assign({pack:1,units:Array(n).fill(unit),n,spd:KINDS[unit].spd||40,aggro:5.5},o);INTRO[id]=o.intro}
addVariant('cub','bear',{name:'Blackfur Cub',hm:.55,am:.65,xpm:.6,tint:'#c8a070',ta:.2,bsz:.16,intro:["A bear cub, all paws and temper. You look round for the mother. No sign of her.","A young bear stands up, wobbles, and comes at you anyway."]});
addVariant('broodmother','spider',{name:'Broodmother',hm:1.6,am:1.25,tint:'#6a2a6a',ta:.35,bsz:.22,intro:["A Webweaver the size of a cart wheel. The little ones scatter out of her way.","Something fat and patient comes down a thread as thick as rope."],study:[['h',"She's slow, and she doesn't need to be quick."]]});
/* the plains get their own disguised tree-thing: an old hawthorn hedge that has had enough */
addVariant('hedgeent','ent',{name:'Hawthorn Brute',hm:1.35,am:1.25,tint:'#9a8a3a',ta:.35,intro:["Part of the hedgerow tears itself up by the roots and comes at you, thorns first.","A hawthorn that was never planted by anyone stands up out of the hedge."],study:[['h',"Old, dry wood. It'll burn well."]]});
addVariant('greywolf','wolf',{name:'Timber Wolf',hm:1.35,am:1.25,tint:'#9aa0a8',ta:.4});
addVariant('oldbear','bear',{name:'Old Blackfur',hm:1.5,am:1.3,tint:'#b8b0a0',ta:.25,intro:["An old bear, grey at the muzzle and scarred all over. It has seen off better knights than you. Probably.","Old Blackfur. The woodcutters name him in their prayers, and not kindly."],study:[['f',"There is a broken arrowhead in his shoulder, healed over years ago."]]});
addVariant('blackooze','ooze',{name:'Black Ooze',hm:1.5,am:1.3,tint:'#0a0a14',ta:.55,intro:["One of the black pools on the floor starts to move towards you."]});
addVariant('barrowknight','knight',{name:'Barrow Knight',hm:1.2,am:1.15,tint:'#8aa88a',ta:.3,intro:["A knight in mouldering armour climbs out of a niche in the wall. He was buried with honours. He has kept the sword."]});
addVariant('crystalgolem','golem',{name:'Crystal Golem',hm:1.4,am:1.2,tint:'#6ab0ff',ta:.35,intro:["A golem grown through with blue crystal. It hums when it moves."]});
addVariant('bloatleech','leech',{name:'Bloated Leech',hm:1.6,am:1.2,tint:'#8a1a1a',ta:.35,intro:["A leech so full of somebody else's blood it can barely move. Barely."]});
addVariant('drownedcap','drowned',{name:'Drowned Captain',hm:1.6,am:1.3,tint:'#3a6a9a',ta:.3,intro:["A drowned man in the rags of a captain's coat. He still has his sword, and his temper."]});
addVariant('bulltoad','toad',{name:'Bull Toad',hm:1.5,am:1.3,tint:'#2a3a10',ta:.35,intro:["A toad the size of a cart."]});
addVariant('razorback','boar',{name:'Razorback',hm:1.45,am:1.3,tint:'#5a1a10',ta:.3,intro:["A boar with a ridge of bristles like a row of knives, and blood on its tusks."]});
addVariant('oathsworn','knight',{name:"Harrow's Oathsworn",hm:1.35,am:1.25,tint:'#c9a24b',ta:.25,intro:["One of Lord Harrow's oathsworn, in black and gold. \"For the field,\" he says, and means it.","An oathsworn knight blocks the road. He salutes you. Then he draws."]});
/* packs are one smaller than they were (4→3, 3→2); 'us' scales each member up to make up for it */
addPack('wolves3','wolf',2,{name:'Wolf Pack',us:1.4,spd:46,aggro:6.5,intro:["Two big wolves. One hangs back while the other circles.","A pair of wolves, ribs showing. They're hungry."]});
addPack('greywolves','greywolf',2,{name:'Timber Wolves',us:1.4,spd:48,aggro:7,intro:["Timber wolves, bigger than the ones at the wood's edge, and much less afraid."]});
addPack('impgang','imp',3,{name:'Imp Gang',us:1.3,spd:36,aggro:5,intro:["Three imps in a line, chattering."]});
addPack('brood4','slime',3,{name:'Slime Swarm',us:1,spd:22,aggro:4,intro:["Three slimes climb out of the bog one after another."]});
addPack('band3','brigand',2,{name:'Brigand Gang',us:1.1,spd:42,aggro:6.5,human:1,intro:["Two brigands step into the road. “Toll,” says the taller one. “All of it.”"]});
addPack('houndpack','hound',2,{name:'Hound Pair',us:.8,spd:54,aggro:7,intro:["Two war hounds, slipped from someone's leash. Your brother's kennel brand is on their flanks."]});
Object.assign(UNIT_NAMES,{hound:['War Hound','War Bitch'],imp:['Imp','Second Imp','Third Imp','Imp in a Hat'],slime:['Marsh Slime','Bog Slime','Mire Slime','Little Slime'],wolf:['Gaunt Wolf','Grey Wolf','Scarred Wolf']});

/* ---- the twelve maps ---- */
const MAPDEF=[
 {sub:'The trees close in behind you.',mobs:{wolves:4,bat:2,spider:2,thornling:3,poacher:1,cub:2,vagrant:1},props:[['snare',3,'any'],['wishtree',1,'hid']],puzzle:'lever',evs:['woodchild','branch','messenger'],
  amb:['A woodpecker stops hammering and watches you.','A child is singing somewhere ahead. Then it stops.','The path forks. Both ways go downhill.']},
 {sub:'Thorns, and things that live in thorns.',mobs:{wolves3:3,spider:2,broodmother:1,thornling:2,mosstroll:2,stag:2,poacher:2,bear:1},props:[['wishtree',1,'hid'],['hermit',1,'hid'],['snare',2,'any']],puzzle:null,evs:['poachercamp','howl','oldoak'],
  amb:['The brambles here have been cut back. Recently.','Webs strung between the trees, glittering with dew.','A troll\'s footprint, big enough to sit in.']},
 {sub:'The oldest trees. They were old when the old king was crowned.',mobs:{greywolves:3,oldbear:2,mosstroll:3,knight:2,brigand:2,stag:2,poacher:2},props:[['hermit',1,'hid'],['snare',1,'any']],puzzle:'statues',evs:['oldoak','brotherletter','branch'],
  amb:['The roots here are as thick as a man\'s waist.','Your family\'s crest is carved into a tree here, very old and half grown over.','A deep, slow snoring comes from somewhere nearby.']},
 {sub:'The road goes down, and keeps going down.',mobs:{imps:3,bat:3,ooze:3,gnasher:3,wisp:2,ghoul:2},props:[['minershrine',2,'hid'],['pulley',1,'road']],puzzle:'graves',evs:['cavein','lostminer','imptheft'],
  amb:['Water drips somewhere in the dark.','A pick handle, worn smooth, leaning against the wall where someone left it.','Far below, something sings.']},
 {sub:'Half of these tunnels are full of black water.',mobs:{gnasher:3,revenant:2,crawler:2,golem:2,blackooze:2,wisp:2,impgang:2,bat:1},props:[['pulley',2,'road'],['geode',3,'hid']],puzzle:null,evs:['echo','imptheft','cavein'],
  amb:['The water here is still and black.','Your lamp gutters, then steadies.','A mine-cart rattles past on a far track. You don\'t see who\'s pushing.']},
 {sub:'The miners sealed this place after the flood. The seal has been broken.',mobs:{revenant:3,barrowknight:2,crystalgolem:2,crawler:2,wisp:2,impgang:2,ghoul:2},props:[['geode',3,'hid'],['minershrine',1,'hid']],puzzle:'totems',evs:['crystalsong','brotherletter','lostminer'],
  amb:['The crystals hum when you get close.','Dozens of names scratched into the wall. Miners who came this far.','A cold draught from a crack in the rock.']},
 {sub:'Where the land goes soft.',mobs:{brood:3,slime:2,toad:3,leech:3,mosquito:2,shroom:2,hag:1},props:[['leechpool',2,'any'],['witchpot',1,'hid']],puzzle:'graves',evs:['wisplight','sinking','messenger'],
  amb:['The ground sinks a little under every step.','A heron watches you go by.','Fat bubbles rise slowly out of the mud.']},
 {sub:'The water here has gone bad, and so has everything that drinks it.',mobs:{serpent:3,bloatleech:2,drowned:2,toad:2,brood4:2,shroom:2,mosquito:2},props:[['witchpot',1,'hid'],['leechpool',1,'any'],['drownedbell',1,'any']],puzzle:'statues',evs:['frogchorus','fog','wisplight'],
  amb:['The frogs go quiet as you pass and start up again behind you.','A long shape moves under the green water.','A dead tree hung with little charms made of bone.']},
 {sub:'She\'s close. The air is thick with spores.',mobs:{hag:3,drownedcap:2,serpent:2,bulltoad:2,drowned:2,brood4:2,mosquito:1},props:[['drownedbell',1,'any'],['witchpot',1,'hid']],puzzle:'totems',evs:['motherdream','brotherletter','fog'],
  amb:['Spores drift past like snow.','The mushrooms here are as tall as you.','You can hear her: a wet sound, like breathing.']},
 {sub:'Open country at last. Nowhere to hide.',mobs:{hound:3,boar:3,crowswarm:2,band:3,vagrant:2,strawman:1},props:[['snare',2,'any'],['deserter',1,'hid']],puzzle:'lever',evs:['refugees','taxman','messenger'],
  amb:['The wind moves over the grass in long waves.','A burnt farmhouse. The fields around it have gone to seed.','A chapel bell rings in the fen, and nobody comes.']},
 {sub:'Your brother\'s army came this way, and left in a hurry.',mobs:{archer:3,band3:3,houndpack:2,razorback:2,crowswarm:2,brigand:2,strawman:2},props:[['deserter',2,'hid'],['warstandard',1,'road']],puzzle:'graves',evs:['ambushcart','refugees','taxman'],
  amb:['Broken arrows lie in the road.','A royal supply wagon, burnt to the axles.','Crows in their hundreds, picking over the field.']},
 {sub:'Lord Harrow has held this field for the crown for thirty years.',mobs:{knight:2,oathsworn:2,archer:3,band3:2,houndpack:2,crowswarm:1,razorback:1},props:[['warstandard',2,'road'],['deserter',1,'hid']],puzzle:'statues',evs:['herald','brotherletter','ambushcart'],
  amb:['From here you can see the castle. You grew up there.','A trumpet, very far off.','The grass here was trampled flat by an army a long time ago and never came back properly.']}];
const mapDef=()=>MAPDEF[curMap()]||MAPDEF[0];

/* ---- new things to poke at ---- */
Object.assign(PS,{
  snare:mk(12,6,f=>{f('#050403',1,3,10,3);f('#6a6a72',2,3,8,1);f('#8a8a92',2,4,2,1);f('#8a8a92',8,4,2,1);f('#4a3020',5,1,2,3);f('#2a1a10',0,5,12,1)}),
  wishtree:mk(16,22,f=>{f('#050403',6,8,4,14);f('#4a3020',7,8,2,14);f('#1a2a18',1,1,14,9);f('#2a4a24',2,2,12,7);f('#3a5a2a',3,2,6,3);f('#d83a3a',3,9,1,4);f('#f0d84a',7,10,1,3);f('#e8e8e8',11,9,1,4);f('#6a8ad8',12,7,1,3);f('#d83a3a',5,6,1,3)}),
  hermit:mk(12,16,f=>{f('#050403',2,2,8,14);f('#4a3a2a',3,6,6,10);f('#6a5a3a',3,6,2,8);f('#2a2018',3,2,6,5);f('#d8c8a8',4,4,4,3);f('#e8e8e8',4,6,4,2);f('#5a4028',10,1,1,15)}),
  minershrine:mk(12,12,f=>{f('#050403',1,4,10,8);f('#3a3632',2,5,8,6);f('#5a564e',2,5,8,1);f('#d8d0b8',3,2,1,3);f('#d8d0b8',6,1,1,4);f('#d8d0b8',8,2,1,3);f('#ffd870',3,1,1,1);f('#ffd870',6,0,1,1);f('#ffd870',8,1,1,1);f('#8a8a92',4,7,4,3)}),
  pulley:mk(14,22,f=>{f('#050403',1,0,12,3);f('#5a4028',2,1,10,1);f('#050403',6,2,2,14);f('#c8b896',7,3,1,12);f('#050403',3,14,8,8);f('#6a4a2a',4,15,6,6);f('#4a3020',4,17,6,1);f('#8a8e96',5,0,4,2)}),
  geode:mk(12,10,f=>{f('#050403',1,2,10,8);f('#5a564e',2,3,8,6);f('#7a766e',3,3,4,2);f('#3a3632',2,7,8,2);f('#6ab0ff',5,5,2,2);f('#b8e0ff',5,5,1,1)}),
  leechpool:mk(16,9,f=>{f('#050403',1,1,14,8);f('#2a1a14',2,2,12,6);f('#4a1a14',3,3,10,4);f('#7a2a20',5,4,3,1);f('#7a2a20',9,5,2,1)}),
  witchpot:mk(14,14,f=>{f('#050403',1,4,12,10);f('#1a1a1a',2,5,10,8);f('#3a3a3a',2,5,10,2);f('#7ad83a',3,4,8,2);f('#b8f07a',5,3,2,1);f('#9ae05a',9,2,1,1);f('#c8401a',3,13,2,1);f('#ff9a3a',7,13,3,1)}),
  drownedbell:mk(14,16,f=>{f('#050403',2,1,10,13);f('#3a5a6a',3,2,8,10);f('#5a8a9a',4,2,3,6);f('#2a3a4a',3,10,8,2);f('#050403',6,13,2,3);f('#7a6a3a',6,13,2,2);f('#2a6a5a',3,8,2,3);f('#2a6a5a',9,4,1,4)}),
  deserter:mk(14,12,f=>{f('#050403',2,1,10,11);f('#5a1a16',3,5,8,7);f('#8a2a24',3,5,3,4);f('#b89a7a',5,2,4,3);f('#6d7078',4,1,6,2);f('#e8e8e8',8,7,3,2);f('#d83a3a',9,8,1,1)}),
  warstandard:mk(12,26,f=>{f('#050403',5,2,2,24);f('#5a4028',5,2,1,24);f('#050403',6,2,6,12);f('#1a1a1a',7,3,5,10);f('#c9a24b',8,5,3,2);f('#c9a24b',9,7,1,4);f('#c9a24b',8,1,2,2)}),
  pzstatue:PS.statue,pzgrave:PS.grave,pztotem:PS.totem||PS.statue,pzeye:PS.hintstone||PS.statue});

/* puzzle helpers */
const FACE=['north','east','south','west'];
function pzChest(x,y,gear){const s=safeChestSpot(x,y);addChest(s.x,s.y,[genGear(Math.min(3,tierHere()+1),{min:3}),gear?genGear(tierHere(),{min:2}):'elixir']);
  for(let k=0;k<20;k++)particles.push({x:s.x*T+8,y:s.y*T+8,vx:(Math.random()-.5)*40,vy:-20-Math.random()*30,g:20,life:1.4,c:pick(['#ffd870','#c9a24b']),w:'spark'})}
const fightNow=kind=>{const m=makeMob(kind,P.x+12,P.y);m.state='awake';mobs.push(m);LV.mobs=mobs;setTimeout(()=>{if(mode==='world'&&mobs.includes(m))startBattle(m,'ambush')},350)};
const huntNow=(kind,n)=>{for(let k=0;k<40;k++){const a=Math.random()*6.283,tx=Math.floor(P.x/T+Math.cos(a)*9),ty=Math.floor(P.y/T+Math.sin(a)*9);if(tx<2||ty<2||tx>MW-3||ty>MH-3||BLOCK[map[id(tx,ty)]])continue;const m=makeMob(kind,tx*T+8,ty*T+12);if(n)m.n=n;m.hunt=1;m.state='awake';mobs.push(m);LV.mobs=mobs;return}};

const NEWP={
  snare:{u:p=>p.st?0:2,use:async p=>{const c=await dialog('A snare','A wire noose pegged into the ground. A poacher\'s, and fresh.',['Disarm it','Leave it']);if(c!==0)return;p.st=1;
    if(chance(.6)){SFX.clang();notice('You work the noose loose and pocket the wire. '+grant([chance(.5)?'bandage':'scrap'],chance(.5)?coinsFor():0))}else{const d=Math.round(P.max*.08);P.hp=Math.max(1,P.hp-d);P.st.bleed=3;SFX.clang();notice(`It snaps shut on your fingers. −${d} HP. You are bleeding.`)}}},
  wishtree:{u:p=>p.st?0:2,use:async p=>{const c=await dialog('A wishing tree','Ribbons tied to every branch, faded grey. People came here to ask for things.',['Tie a ribbon (5 gold)','Take a ribbon','Leave']);if(c===2)return;p.st=1;
    if(c===0){if(P.gold<5){notice('You have nothing to tie. You leave it.');p.st=0;return}P.gold-=5;if(chance(.6)){P.blessed=Math.max(P.blessed,2);SFX.shrine();notice('You tie it and make your wish. The ribbon stands out straight in the wind. You are Blessed.')}else notice('You tie it and make your wish. Nothing happens.')}
    else{P.st.wither=4;SFX.dread();notice('You pull one free. Your arm aches all the way to the shoulder. You are Weakened.')}}},
  hermit:{u:p=>p.st?1:2,use:async p=>{if(p.st){notice('The hermit is asleep, or pretending to be.');return}p.st=1;
    const c=await dialog('A hermit','An old hermit in a hut of sticks. He bows his head when he sees you.\n\n“I knew your father,” he says. “Your brother came this way once, on his road to the throne. I prayed for him then. I will pray for you now.”',['“What did you tell him?”','Ask for help','Leave']);
    if(c===0)await dialog('A hermit','“God keep you on the road,” he says.',['Leave']);
    else if(c===1){notice('He presses a bundle into your hands. “For the road,” he says. '+grant(['hallowed','bandage']))}}},
  minershrine:{u:p=>p.st?0:2,use:async p=>{const has=hasItem('candlestub');const c=await dialog('A miners\' shrine','Candle stubs on a ledge, and a tin cup of gold for the ones who didn\'t come up.',(has?['Light a candle']:[]).concat(['Take the gold','Leave']));const ch=(has?['light','take','leave']:['take','leave'])[c];if(ch==='leave')return;p.st=1;
    if(ch==='light'){removeItem('candlestub');P.mmax+=1;P.mp=P.mmax;SFX.shrine();notice('You light it and say the names you can read. Something in the dark seems to settle. +1 maximum MP, for good.')}
    else{P.gold+=ri(6,14);SFX.coin();notice('You take the dead men\'s gold. Behind you, one of them gets up.');fightNow(chance(.5)?'revenant':'ghoul')}}},
  pulley:{u:p=>p.st?0:2,use:async p=>{p.n=(p.n||0)+1;SFX.thunk();if(p.n<3){notice(p.n===1?'You haul on the rope. Far above, the pulley creaks and a load starts down.':'You haul again. It\'s heavy.');return}p.st=1;
    if(chance(.75))notice('A crate thumps down out of the dark. '+grant([lootRoll(tierHere()),chance(.4)?oreFor(tierHere()):'lampoil']));else{const d=Math.round(P.max*.12);P.hp=Math.max(1,P.hp-d);SFX.thud();notice(`The rope snaps. The crate comes down on you. −${d} HP.`)}}},
  geode:{u:p=>p.st?0:2,use:async p=>{p.st=1;SFX.clang();const wt=wType(),good=wt==='mace'||wt==='hammer';
    notice(good?'Your '+WT_NAME[wt].toLowerCase()+' splits it cleanly. '+grant(['shard',chance(.6)?oreFor(tierHere()):'shard']):chance(.4)?'You chip it open, clumsily. '+grant(['shard']):'Your blade skids off it. A mace or a hammer would crack it.');if(!good&&!p.tried){p.tried=1}}},
  leechpool:{u:p=>p.st?0:2,use:async p=>{const c=await dialog('A warm pool','Dark water, warm as blood, with leeches drifting in it. The fen-folk swear by them.',['Bathe','Leave']);if(c!==0)return;p.st=1;
    const had=P.st.poison;delete P.st.poison;delete P.st.wither;P.st.bleed=2;const d=Math.round(P.max*.06);P.hp=Math.max(1,P.hp-d);notice(`The leeches find you at once. −${d} HP, and you are bleeding.${had?' But the poison goes out of you with the blood.':''} Your arm feels stronger, somehow.`)}},
  witchpot:{u:p=>p.st?0:2,use:async p=>{const has=hasItem('bitterleaf');const c=await dialog('A witch\'s pot','A cauldron bubbling over a fire nobody is feeding. It smells of bitterleaf and fat.',(has?['Add a Bitterleaf']:[]).concat(['Drink from it','Leave']));const ch=(has?['add','drink','leave']:['drink','leave'])[c];if(ch==='leave')return;p.st=1;
    if(ch==='add'){removeItem('bitterleaf');SFX.chime();notice('The brew turns clear. You ladle it into a flask. '+grant(['potion','potion']))}
    else{const q=Math.random();if(q<.35){P.hp=P.max;SFX.heal();notice('It tastes of honey and grass, and your strength comes back.')}else if(q<.7){P.st.poison=5;notice('It tastes as bad as it smells. You are poisoned.')}else{P.st.dazed=0;P.blessed=Math.max(P.blessed,2);P.st.blind=0;notice('The world goes very bright, then settles. You are Blessed.')}}}},
  drownedbell:{u:p=>p.st?0:2,use:async p=>{const c=await dialog('A drowned bell','A church bell, sunk to its shoulders in the mud. The rope is still on it.',['Ring it','Leave']);if(c!==0)return;p.st=1;SFX.bell(0);
    notice('It rings once, flat and dull. Out in the mud something starts to move.');p.loot=1;LV.bellLoot=1;fightNow('drownedcap')}},
  deserter:{u:p=>p.st?1:2,use:async p=>{if(p.st){notice('He\'s asleep, or dead.');return}
    const opts=(hasItem('bandage')?['Give him a bandage']:[]).concat(['Rob him','Leave']);const c=await dialog('A deserter','A soldier in your brother\'s colours, sitting against a stone with a hole in his side. His breathing is slow.',opts);const ch=opts[c];if(ch==='Leave')return;p.st=1;
    if(ch==='Give him a bandage'){removeItem('bandage');notice('He binds it with shaking hands. “The castle,” he says. “The postern by the left tower is never locked. I kept that door for six years.” He gives you what he has. '+grant([genGear(tierHere(),{min:2,max:3,noU:1})],ri(8,16)))}
    else{P.gold+=ri(10,20);P.st.wither=4;SFX.coin();notice('You take his purse and leave him there. You are Weakened.')}}},
  warstandard:{u:p=>p.st?0:2,use:async p=>{const c=await dialog('A war standard','Harrow\'s black and gold, planted in the field, the pole as thick as your wrist. The men who hold this field will see it from a long way off.',['Tear it down','Leave']);if(c!==0)return;p.st=1;
    P.blessed=Math.max(P.blessed,3);SFX.thunk();notice('It comes down. Out in the field a horn sounds, and Harrow\'s men will be coming. You are Blessed.');huntNow(chance(.5)?'band3':'houndpack')}},
  /* puzzles */
  pzstatue:{u:()=>LV.pz&&LV.pz.done?1:2,draw:(p,bx,by)=>{const im=PS.statue;ctx.drawImage(im,Math.round(bx-im.width/2),Math.round(by-im.height));const d=[[0,-1],[1,0],[0,1],[-1,0]][p.f];ctx.fillStyle=LV.pz.done?'#ffd870':'#e8e0c8';ctx.fillRect(Math.round(bx+d[0]*5-1),Math.round(by-im.height/2+d[1]*5-1),2,2)},
    use:async p=>{if(LV.pz.done){notice(`It faces ${FACE[p.f]}, like the others.`);return}p.f=(p.f+1)%4;SFX.thunk();amb(`You heave it round. It faces ${FACE[p.f]} now.`,1800);
      if(props.filter(q=>q.t==='pzstatue').every(q=>q.f===LV.pz.want)){LV.pz.done=1;setTimeout(()=>{SFX.chime();pzChest(LV.pz.x,LV.pz.y);amb('All three look the same way. The ground between them opens.',3200)},500)}}},
  pzclue:{u:()=>2,draw:(p,bx,by)=>{const im=PS.hintstone||PS.grave;ctx.drawImage(im,Math.round(bx-im.width/2),Math.round(by-im.height))},use:async p=>{await showEp(p.title||'A carved stone',p.text)}},
  pzgrave:{u:p=>p.dug?0:2,draw:(p,bx,by)=>{const im=p.dug?PS.dug||PS.grave:PS.grave;ctx.drawImage(im,Math.round(bx-im.width/2),Math.round(by-im.height))},
    use:async p=>{const c=await dialog('A grave',p.ep,['Dig','Leave'],false);if(c!==0)return;if(LV.pz.done){notice('Nothing here but the dead.');p.dug=1;return}p.dug=1;SFX.dig();
      if(p.right){LV.pz.done=1;notice('Your spade hits wood. Inside the coffin, tucked under the bones, is a bundle.');pzChest(p.tx,p.ty+2,true)}else{notice('The one inside gets up.');fightNow(LV.pz.foe)}}},
  pztotem:{u:()=>LV.pz&&LV.pz.done?0:2,draw:(p,bx,by)=>{const im=PS.totem||PS.statue;ctx.drawImage(im,Math.round(bx-im.width/2),Math.round(by-im.height));if(p.flash>0){p.flash-=1/60;ctx.fillStyle=`rgba(255,232,160,${Math.min(.8,p.flash)})`;ctx.fillRect(Math.round(bx-4),Math.round(by-im.height-4),8,4)}},
    use:async p=>{const pz=LV.pz;if(pz.done)return;SFX.bell(p.i%4);p.flash=.8;pz.inp.push(p.i);const k=pz.inp.length-1;if(pz.inp[k]!==pz.seq[k]){pz.inp=[];setTimeout(()=>SFX.thud(),500);return}
      if(pz.inp.length===pz.seq.length){pz.done=1;setTimeout(()=>{SFX.chime();pzChest(pz.x,pz.y);amb('The pillars ring together and the stone between them slides open.',3000)},700)}}},
  pzeye:{u:()=>LV.pz&&LV.pz.done?0:2,draw:(p,bx,by)=>{const im=PS.hintstone||PS.statue;ctx.drawImage(im,Math.round(bx-im.width/2),Math.round(by-im.height))},
    use:async p=>{const pz=LV.pz;pz.inp=[];amb('Watch the pillars.',1800);const ts=props.filter(q=>q.t==='pztotem');pz.seq.forEach((i,k)=>setTimeout(()=>{const t=ts.find(q=>q.i===i);if(t){t.flash=.9;SFX.bell(i%4)}},700+k*700))}}};

/* lay out a map's own things (called at the end of placeProps) */
function mapExtras(h){const D=mapDef(),r=h.r,W={any:h.any,hid:h.hid,road:h.road1};
  for(const[t,n,w]of D.props||[]){h.many(t,n,W[w]||h.any,true,null,5);const have=props.filter(p=>p.t===t).length;if(have<n)h.many(t,n-have,h.any,true,null,3)}
  const pz=D.puzzle;
  /* puzzles never go right next to the boss pocket, where the paths can't always be joined up */
  const okPz=(x,y)=>x>=10&&y>=10&&x<MW-11&&y<MH-12&&h.openish(x,y)&&!(LV.pocket&&x>LV.pocket.x0-9&&x<LV.pocket.x1+9&&y>LV.pocket.y0-9&&y<LV.pocket.y1+9);
  if(pz==='statues'){const s=h.find(okPz,5)||h.find(h.openish,5)||h.find(h.any,4);if(s){s.x=clamp(s.x,9,MW-10);s.y=clamp(s.y,9,MH-11);const want=(r()*4)|0;LV.pz={t:'statues',want,x:s.x,y:s.y};[[-3,0],[3,0],[0,-3]].forEach(([dx,dy])=>{const x=s.x+dx,y=s.y+dy;if(map[id(x,y)]!==G)map[id(x,y)]=G;addProp('pzstatue',x,y,true,{f:(want+1+((r()*3)|0))%4})});
    addProp('pzclue',s.x,s.y+3,true,{text:['THEY ALL LOOKED UP AT THE NORTH STAR\nAND WERE LOST.','THEY WATCHED THE SUN RISE\nOVER THE CASTLE, EVERY MORNING,\nUNTIL THE MORNING IT DID NOT.','THEY TURNED TO FACE THE SOUTH,\nWHERE HE WOULD COME FROM.','THEY KEPT THEIR EYES ON THE WEST\nAND THE SETTING SUN, AND WAITED.'][want],title:'A carved stone'})}}
  if(pz==='graves'){const s=h.find(okPz,5)||h.find(h.openish,5)||h.find(h.any,4);if(s){s.x=clamp(s.x,9,MW-10);s.y=clamp(s.y,9,MH-11);const foe={0:'ghoul',1:'revenant',2:'drowned',3:'barrowknight'}[AR.i]||'ghoul';const yrs=[(r()*40|0)+300,(r()*40|0)+350,(r()*40|0)+400].sort(()=>r()-.5);const names=['ODO','BERTRAN','MAUD','ISOLDE','HUGH','AGNES','WAT','CECILY'].sort(()=>r()-.5);
    const rule=(r()*2)|0,best=rule?Math.max(...yrs):Math.min(...yrs);LV.pz={t:'graves',foe};
    [[-3,0],[0,0],[3,0]].forEach(([dx],k)=>{const x=s.x+dx,y=s.y;map[id(x,y)]=G;addProp('pzgrave',x,y,true,{ep:`${names[k]}\nDIED IN THE YEAR ${yrs[k]}`,right:yrs[k]===best})});
    addProp('pzclue',s.x,s.y+3,true,{title:'A note, nailed to a post',text:rule?'“We buried the money with the last man we put in the ground. No one robs a new grave.”':'“The old man made us put it in with the first one, who\'s been down there longest. Said nobody would dig that deep.”'})}}
  if(pz==='totems'){const s=h.find(okPz,5)||h.find(h.openish,5)||h.find(h.any,4);if(s){s.x=clamp(s.x,9,MW-10);s.y=clamp(s.y,9,MH-11);const seq=[0,1,2,3].sort(()=>r()-.5).concat([(r()*4)|0]);LV.pz={t:'totems',seq,inp:[],x:s.x,y:s.y};
    [[-2,-2],[2,-2],[-2,2],[2,2]].forEach(([dx,dy],i)=>{const x=s.x+dx,y=s.y+dy;map[id(x,y)]=G;addProp('pztotem',x,y,true,{i})});map[id(s.x,s.y+4)]=G;addProp('pzeye',s.x,s.y+4,true,{})}}
  /* roadside happenings: a few spots on the paths where something will happen the first time you pass */
  LV.evs=[];const ev=(D.evs||[]).slice();for(const e of ev){const s=h.find((x,y)=>h.road1(x,y)&&!(LV.start&&Math.hypot(x-LV.start.x,y-LV.start.y)<14)&&!(LV.evs.some(q=>Math.hypot(q.x-x,q.y-y)<20)),3);if(s)LV.evs.push({x:s.x,y:s.y,id:e,done:0})}}

/* ---- happenings ---- */
const MEV={
  woodchild:async()=>{await dialog('A girl in a red hood','“Have you seen my father? He went to cut wood. He hasn\'t come back.”',['“I\'ll look for him.”','“Go home.”']);const h=Math.min(P.max-P.hp,8);P.hp+=h;notice(`She gives you an apple for your trouble and runs off.${h?` +${h} HP.`:''}`)},
  branch:async()=>{SFX.creak&&SFX.creak();const c=await dialog('A crack overhead','A branch the size of a horse is coming down, right on top of you.',['Dive aside','Get your shield up']);const sh=!!P.eq.shield;
    if(c===0?chance(.6):(sh||chance(.3))){notice(c===0?'You roll clear and it crashes down where you stood.':'It bounces off your shield and numbs your arm.')}else{const d=Math.round(P.max*.15);P.hp=Math.max(1,P.hp-d);SFX.thud();notice(`It catches you across the back. −${d} HP.`)}},
  messenger:async()=>{const L=LORE.letters||[];await showEp('A dead messenger','A royal courier, face down in the road, an arrow in his back. The satchel is still sealed. Your brother\'s seal.\n\n'+(bagPick('courier',['“To all lords and holders of land: a pretender goes about the realm wearing my face. Take him, and bring him to me alive. — W.”','“Lord Harrow: hold the field. He will come to you last. — W.”','“Mother, I have had the old nursery kept as it was. I pray for you every night. — W.”'])));notice(grant([],coinsFor()))},
  poachercamp:async()=>{const c=await dialog('A poacher\'s camp','A lean-to, a cold fire, a brace of rabbits hanging from a branch. Nobody home.',['Help yourself','Keep walking']);if(c!==0)return;notice('You take what you can carry. '+grant([pick(['bandage','potion','horn']),lootRoll(tierHere())]));if(chance(.5))setTimeout(()=>fightNow('poacher'),300)},
  howl:async()=>{SFX.howlpack();amb('Howling, close, and getting closer.',3600,true);huntNow('wolves3',2)},
  oldoak:async()=>{const c=await dialog('An old oak','An oak older than the kingdom, with a face in the bark if you squint. People have left offerings at its roots: buttons, gold, a doll.',['Leave an offering (10 gold)','Take the offerings','Bow and go on']);
    if(c===0){if(P.gold<10){notice('You have nothing to give.');return}P.gold-=10;P.blessed=Math.max(P.blessed,3);SFX.shrine();notice('The leaves stir, though there is no wind. You are Blessed.')}else if(c===1){notice(grant(['button','doll'].filter(i=>ITEMS[i]),ri(10,20)));P.st.wither=5;SFX.dread();notice('The leaves stir, and something in you goes weak. You are Weakened.')}},
  brotherletter:async()=>{await showEp('A letter, pinned to a tree with a knife',bagPick('bro',['Brother,\n\nI have buried more men this year than our father buried in all his wars. Every one of them died because you would not kneel.\n\nCome to the castle. I will meet you at the gate myself.\n\n— W.','Brother,\n\nOur father named me his heir before the lords of the realm, and I was crowned before God. What you do now is rebellion, and it will be answered as rebellion.\n\nCome home and kneel, and you will keep your life.\n\n— W.','Brother,\n\nOur father is buried in the chapel crypt, and the lords have sworn their oaths to me over his tomb. The matter was settled there.\n\nLay down your sword.\n\n— W.']))},
  cavein:async()=>{const c=await dialog('A rumble','The ceiling groans. Dust pours down. You have a heartbeat to decide.',['Run','Press yourself to the wall']);if(c===0?chance(.5):chance(.75)){notice('It comes down behind you. When the dust settles, a seam of ore is showing in the fall. '+grant([oreFor(tierHere())]))}else{const d=Math.round(P.max*.15);P.hp=Math.max(1,P.hp-d);SFX.thud();notice(`A stone the size of your head finds you. −${d} HP.`)}},
  lostminer:async()=>{const c=await dialog('A miner','A miner with a lamp, very pale, asks you which way is up. He has been looking for a long time.',['Point the way','Say nothing']);if(c===0){P.blessed=Math.max(P.blessed,2);SFX.shrine();notice('He thanks you and walks off the way you pointed, and through the wall. You are Blessed.')}else{P.st.wither=3;notice('He keeps asking. He follows you a little way, asking. You are Weakened, and very cold.')}},
  imptheft:async()=>{if(P.gold<5)return;const n=Math.min(25,Math.max(5,Math.round(P.gold*.15)));const c=await dialog('An imp','An imp has its hand in your purse.',['Grab it','Let it go']);
    if(c===0&&chance(.5)){P.gold+=Math.round(n*.5);SFX.coin();notice('You catch it by the tail and shake. Your gold comes out, and some of somebody else\'s.')}else{P.gold-=n;notice(`It is gone, and so are ${n} of your gold.${c===0?' It bit you on the way.':''}`);if(c===0){P.hp=Math.max(1,P.hp-3)}}},
  echo:async()=>{amb('Your voice carries a long way down the tunnel and comes back to you twice.',4200);const R=20,cx=Math.floor(P.x/T),cy=Math.floor(P.y/T);for(let y=Math.max(0,cy-R);y<Math.min(MH,cy+R);y++)for(let x=Math.max(0,cx-R);x<Math.min(MW,cx+R);x++)if((x-cx)**2+(y-cy)**2<R*R)LV.seen[y*MW+x]=1},
  crystalsong:async()=>{const c=await dialog('Singing crystals','The crystals here are humming, all together, a long low chord.',['Listen','Smash them']);if(c===0){P.mp=P.mmax;SFX.chime();notice('You listen until the chord resolves. Your head is clear. Full MP.')}else{SFX.clang();notice('They shatter. The silence is worse. '+grant(['shard','shard']));huntNow('bat')}},
  wisplight:async()=>{const c=await dialog('A light in the reeds','A little light bobs over the bog, off the path, as if it wants you to follow.',['Follow it','Stay on the path']);if(c!==0)return;
    if(chance(.6)){const s=safeChestSpot(Math.floor(P.x/T)+2,Math.floor(P.y/T));addChest(s.x,s.y,null);notice('It leads you a little way and goes out over a chest half sunk in the mud.')}else{P.st.poison=4;notice('It leads you into the bog up to your waist and goes out. You climb out, poisoned.')}},
  sinking:async()=>{const c=await dialog('Soft ground','Your leg goes in to the knee, and the mud starts to pull.',['Pull free','Leave the boot']);if(c===0){const d=Math.round(P.max*.1);P.hp=Math.max(1,P.hp-d);notice(`You haul yourself out, boot and all. Your knee twists as you come free. −${d} HP.`)}else{notice('You leave the boot in the mud and go on with one bare foot.')}},
  frogchorus:async()=>{const c=await dialog('A chorus','A hundred frogs are singing, all at once, all around you.',['Croak back','Keep quiet']);if(c===0){SFX.croak&&SFX.croak();notice('The frogs fall silent. Then, one by one, they bring you things. '+grant([pick(['ring','button','locket'])],ri(4,10)))}else amb('They sing you all the way across.',3000)},
  fog:async()=>{EV.fog=240;SFX.dread();amb('A fog comes up off the water, thick and grey.',3600)},
  motherdream:async()=>{await showEp('A dream, standing up','For a moment you are somewhere else: a nursery, two beds, a woman singing. Then the song goes wet and wrong, and you are back in the bog, and the singing is still going.\n\nShe is close.');P.st.poison=2},
  refugees:async()=>{const c=await dialog('A family on the road','A man, a woman and three children, with everything they own on their backs. They are fleeing the King\'s new tax. They look at your sword, then at the ground.',['Give 20 gold','Give a potion','Wish them luck']);
    if(c===0){if(P.gold<20){notice('You do not have it to give. They thank you anyway.');return}P.gold-=20;P.blessed=Math.max(P.blessed,3);SFX.shrine();notice('The woman takes your hand. “The ford past the mill,” she says. “The soldiers never watch it.” You are Blessed.')}
    else if(c===1){if(!hasItem('potion')){notice('You have none left. They thank you anyway.');return}removeItem('potion');notice('The youngest gives you something she found by the road. '+grant([genGear(tierHere(),{min:3,max:3,noU:1,slot:'charm'})]))}},
  taxman:async()=>{const n=Math.max(10,Math.round(P.gold*.25));const c=await dialog('The King\'s tax','A collector in royal blue, with two brigands for an escort. “By order of the King. One part in four.”',['Pay '+n+' gold','Refuse']);if(c===0&&P.gold>=n){P.gold-=n;notice('He counts it twice and writes your name in a book. He spells it wrong.')}else{notice('“Then the King will have it the other way.”');fightNow('band')}},
  ambushcart:async()=>{const c=await dialog('An overturned cart','A supply cart on its side, barrels split, a dead mule in the traces. Nobody has touched the cargo.',['Search it','Leave it alone']);if(c!==0)return;notice('You find '+grant([lootRoll(tierHere()),pick(['potion','bandage'])],coinsFor()).replace(/^You find /,'')+(chance(.6)?' And then the brigands who were waiting for someone to do exactly that.':''));if(chance(.6))setTimeout(()=>fightNow('band3'),400)},
  herald:async()=>{const c=await dialog('A herald','A herald on a grey horse unrolls a scroll. “By order of the King: the pretender who wears the King\'s face is to be brought to Lord Harrow\'s field and held there.” He sees you and stops reading.',['Let him go','Take the scroll']);if(c===1){P.blessed=Math.max(P.blessed,2);notice('You take the scroll and tear it in half. He rides off at a gallop. You are Blessed.');huntNow('archer')}else amb('He rides off towards the castle, not quite fast enough to be casual.',3600)}};
function checkEvSpots(){if(!LV||!LV.evs)return;for(const e of LV.evs){if(e.done)continue;if(Math.hypot(P.x-(e.x*T+8),P.y-(e.y*T+8))<2.2*T){e.done=1;const f=MEV[e.id];if(f){mode==='world'&&f()}return}}}

/* ================= BOSSES: phases, help, and things to work out ================= */
function summon(kind,n,line){const keep=B.foes.filter(f=>!f.dead);const room=3-keep.length;if(room<=0)return 0;const tg=B.foes[B.tgt];B.foes=keep;let k=0;
  const boss=B.foes.find(f=>f.k.boss),RATIO={thornling:.12,slime:.07,eggsac:.06,crystalgolem:.16,archer:.12};
  for(;k<Math.min(n,room);k++){const f=makeFoe(kind,k,2,0);if(boss&&RATIO[kind]){f.max=f.hp=Math.max(10,Math.round(boss.max*RATIO[kind]))}foeProfile(f);f.eIn=1;B.foes.push(f)}B.tgt=Math.max(0,B.foes.indexOf(tg));BG=null;updBUI();clog(line||`${k} more join the fight.`,'','#e0a07a');return k}
const BOSSW={elder:'thornling',rotmother:'slime'};
/* how much of your damage gets through to a boss right now, and why */
function bossWard(f){if(f.kind==='elder'&&alive().some(e=>e.kind==='thornling'))return[.6,"its Thornlings shield it"];return[1,'']}
async function bossPhase(f){const e=f;e.ph=e.ph||1;const r=e.hp/e.max;
  if(f.kind==='elder'){
    if(e.ph===1&&r<.66){e.ph=2;f.shake=.8;SFX.creak&&SFX.creak();await say('The Elder groans, and the brambles round the clearing get up and walk.',1100,true);summon('thornling',2,'Two Thornlings tear themselves out of the undergrowth.');await say('While they\'re alive, your blows land soft.',900,true);return true}
    if(e.ph===2&&r<.33){e.ph=3;f.shake=.8;await say('The Elder heaves. Sap pours out of every wound, and it speeds up.',1100,true);summon('thornling',1,'Another Thornling crawls out of the roots.');return true}}
  if(f.kind==='colossus'){
    if(e.ph===1){e.ph=2;e.st.crystal=3;updBUI();await say('Crystal grows over the Colossus in thick blue plates. Edges skid off it. A blunt weapon would crack it.',1200,true);return false}
    if(e.ph===2&&r<.5){e.ph=3;await say('The Colossus slams the floor and a golem of blue crystal breaks off it and stands up.',1100,true);summon('crystalgolem',1);e.st.crystal=Math.max(e.st.crystal||0,2);updBUI();return true}}
  if(f.kind==='rotmother'){
    if(e.ph===1&&r<.75){e.ph=2;await say('She splits open along a seam and her brood spills out.',1000,true);summon('slime',2,'Two slimes slop out of her.');await say('She feeds off her brood. Kill them, or she\'ll keep healing.',900,true);return true}
    if(e.ph===2&&r<.35){e.ph=3;await say('She tears open again. More of them. She\'s nearly empty.',1000,true);summon('slime',2,'More of her brood spill out.');return true}}
  if(f.kind==='harrow'){
    if(e.ph===1&&r<.6){e.ph=2;await say('“Bannermen!” A horn answers from the edge of the field.',1000,true);summon('archer',1,'A pikeman in Harrow\'s colours runs up to the line and sets his pike.');return true}
    if(e.ph===2&&r<.3){e.ph=3;delete e.st.wall;e.st.frenzy=99;e.st.vuln=99;e.lastOath=1;SFX.dread();updBUI();await say('Harrow throws his shield aside. “My last oath,” he says. “I swore it to your father.” He stops guarding altogether.',1300,true);return true}}
  return false}
