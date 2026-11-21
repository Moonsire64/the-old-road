/* ================= SMALL THINGS (0.20) =================
   The ground is full of things to poke at now: a few hundred per map, different in every region. Walk up, press Use.
   Most of the time it is just something to look at. Sometimes there's a coin or a trinket in it, now and then something bites,
   and very occasionally something comes out of it that wants a fight.
   They are stored compactly (LV.sm = [x, y, kind, used, ...]) so saves stay small. */

/* outcome weights: [look, find, bite, fight, heal] */
const SMK={
woods:[
  {id:'berries',n:'A berry bush',w:[2,0,0,0,3],spr:f=>{f('#0a1208',0,2,10,6);f('#1e3a1c',1,1,8,6);f('#2a4a24',2,0,6,3);for(const[a,b]of[[2,3],[5,2],[7,4],[3,5]])f('#a82030',a,b,1,1)},
   look:['The berries are hard and green.','Birds have had most of them.','You eat one. It\'s mostly pip.'],
   heal:['Blackberries. You eat a handful.','Sweet, a bit dusty. You eat until your fingers are purple.']},
  {id:'toadstools',n:'Toadstools',w:[5,1,1,0,0],spr:f=>{for(const[a,b]of[[0,3],[4,1],[7,4]]){f('#e8e0d0',a+1,b+2,1,3);f('#b82020',a,b,3,2);f('#f0e8d8',a+1,b,1,1)}},
   look:['Red caps with white spots. Poison.','Just mushrooms.','They smell like a damp cellar.','You kick one over. Underneath it\'s full of white grubs.'],
   find:'Pushed in among the caps:',bite:['You sniff one. Your nose goes numb for a minute.']},
  {id:'stump',n:'An old stump',w:[4,2,1,0,0],spr:f=>{f('#0a0806',0,3,10,6);f('#4a3220',1,3,8,5);f('#8a6a44',1,2,8,2);f('#5e4430',3,2,4,1);f('#2a1c12',4,5,1,3)},
   look:['Someone carved R + A into it, a long time ago. The bark has grown round the letters.','Axe marks, all on one side.','The rings are packed tight. It was old when it was cut.','Ants, hundreds of them, carrying their eggs somewhere.'],
   find:'In the hollow at the top, where the rain collects:',bite:['Ants. They go straight up your sleeve.']},
  {id:'log',n:'A rotten log',w:[3,2,1,1,0],spr:f=>{f('#0a0806',0,1,14,5);f('#3e2a1a',1,2,12,3);f('#5a4028',1,2,12,1);f('#8a6a44',12,2,2,3);f('#2a4a1a',3,1,3,1);f('#2a4a1a',8,1,2,1)},
   look:['You roll it over. Woodlice, a centipede, a smell of wet bread.','It comes apart in your hands like cake.','Beetle tracks under the bark.'],
   find:'Under it, pressed into the black earth:',bite:['An adder, curled underneath. It\'s quicker than you.'],fight:'spider'},
  {id:'nest',n:'A fallen nest',w:[3,3,0,0,0],spr:f=>{f('#2a1c10',0,2,9,4);f('#5a4028',1,2,7,3);f('#3a2a18',2,3,5,1);f('#d8d0c0',3,2,1,1);f('#c8c0b0',5,2,1,1)},
   look:['Two eggs, both cold. The wind blew it down.','Moss, hair and a strip of red cloth woven in.','Empty. The bits of shell are inside, so they hatched.'],
   find:'Magpies had it. Woven into the bottom:'},
  {id:'burrow',n:'A burrow',w:[3,1,3,0,0],spr:f=>{f('#2a1c10',0,2,10,5);f('#0a0604',2,3,6,3);f('#4a3a24',1,1,3,1);f('#4a3a24',7,1,2,1)},
   look:['You put your ear to it. Something down there is scratching.','Rabbit droppings, and fox fur caught on the roots.','It goes down further than your arm reaches.'],
   find:'You reach in to the shoulder and close your hand on:',bite:['Teeth. You get your hand back, bleeding.','Whatever\'s in there bites.']},
  {id:'mossrock',n:'A mossy stone',w:[4,2,0,0,0],spr:f=>{f('#0a0a08',0,2,10,6);f('#4a4a40',1,2,8,5);f('#2a4a1e',1,2,8,2);f('#3a5a26',2,1,5,2);f('#6a6a5e',6,5,2,1)},
   look:['You heave it over. A toad blinks up at you.','Underneath, the ground is pale and full of worms.','It\'s heavier than it looks. You put it back.'],
   find:'Under it:'},
  {id:'antler',n:'A shed antler',w:[4,2,0,0,0],spr:f=>{f('#c8b898',0,4,9,1);f('#c8b898',2,1,1,3);f('#c8b898',5,2,1,2);f('#c8b898',7,0,1,4);f('#8a7a5e',0,5,2,1)},
   look:['Six points. A big stag.','Chewed at the tips. Mice like the salt.','It would make a good knife handle.'],
   find:'Wedged in the fork of it:'},
  {id:'arrow',n:'An old arrow',w:[4,1,0,0,0],spr:f=>{f('#6a4a2a',0,3,9,1);f('#a8a8b0',9,2,2,3);f('#e8e0d0',0,2,2,1);f('#e8e0d0',0,4,2,1)},
   look:['Grey goose feathers. A royal fletcher\'s work.','It missed whatever it was meant for, and nobody came back for it.','The head has rusted to the shaft.'],
   find:'Tied to the shaft with thread:'},
  {id:'bones',n:'Bones',w:[5,1,0,0,0],spr:f=>{f('#d8d0c0',0,4,6,1);f('#d8d0c0',2,2,1,4);f('#c8c0b0',6,3,3,2);f('#a8a090',8,5,2,1)},
   look:['A deer. Wolves, by the marks.','Small bones, picked clean. An owl\'s been eating here.','A sheep, a long way from any farm.'],find:'Among them:'}],
cave:[
  {id:'rubble',n:'Loose rubble',w:[4,2,1,0,0],spr:f=>{for(const[a,b,c]of[[0,4,'#5a5650'],[3,2,'#6a665e'],[6,4,'#4a4640'],[2,5,'#3a3632']]){f('#0a0908',a,b,4,3);f(c,a,b,3,2)}},
   look:['You shift it. More rubble.','Pick marks on every piece. Dug out, then dumped.','Something with a lot of legs has been nesting in it.'],
   find:'Under the top layer:',bite:['A stone shifts and drops on your foot.']},
  {id:'puddle',n:'A puddle',w:[4,0,1,0,2],spr:f=>{f('#0a1418',0,2,11,4);f('#1a2a32',1,2,9,3);f('#3a5a6a',3,3,3,1)},
   look:['It is still and clear enough to drink.','It\'s deeper than it looks. Your arm goes in to the elbow without touching bottom.','A pale cave fish darts away.'],
   heal:['Cold enough to hurt your teeth. Good water, the best in days.'],bite:['You drink. It tastes of coins and something dead. Your stomach turns.']},
  {id:'candle',n:'A candle on a ledge',w:[3,3,0,0,0],spr:f=>{f('#d8cfb0',3,2,2,4);f('#ffd870',3,0,2,2);f('#3a3632',0,6,8,2)},
   look:['A candle burning on a ledge. Somebody\'s been down here today.','A row of candle stubs, one for each man who didn\'t come up.','It gutters in the draught.'],
   find:'You take what\'s left of it:',fixed:'candlestub'},
  {id:'pick',n:'A broken pick',w:[3,3,0,0,0],spr:f=>{f('#5a4028',0,3,8,1);f('#7a7a82',7,0,2,6);f('#5a5a62',6,0,1,2)},
   look:['The handle has snapped clean across.','Good iron. Nobody leaves a pick like this on purpose.','Initials burned into the handle: T.W.'],
   find:'You prise off the head:',fixed:'scrap'},
  {id:'ratnest',n:'A rats\' nest',w:[2,2,3,0,0],spr:f=>{f('#2a2420',0,2,10,5);f('#4a3e32',1,2,8,4);f('#a8a090',3,3,2,1);f('#6a5a4a',6,3,2,2)},
   look:['Shredded cloth, bootlaces, a page from a prayer book.','Empty. The rats have moved on.'],
   find:'Rats steal shiny things too. In the middle of it:',bite:['A rat the size of a cat bursts out of it and goes for your ankle.','They\'re still in there, and they bite.']},
  {id:'chalk',n:'Chalk marks',w:[6,0,0,0,0],spr:f=>{f('#d8d0c0',0,1,1,5);f('#d8d0c0',2,1,1,5);f('#d8d0c0',4,1,1,5);f('#d8d0c0',6,1,1,5);f('#d8d0c0',0,3,8,1)},
   look:['A tally on the rock: four strokes and a line through, over and over. Days down here.','An arrow and one word: OUT. The arrow points down.','A name, AGNES, and under it in a different hand: SORRY.','A map of the tunnels, scratched over so many times it\'s a grey smear.','Three marks, and the date of the collapse.']},
  {id:'glowcap',n:'Glowing fungus',w:[4,1,1,0,1],spr:f=>{for(const[a,b]of[[0,3],[3,1],[6,3]]){f('#2a3a2a',a+1,b+2,1,2);f('#7ae0b0',a,b,3,2)}},
   look:['It glows brighter as you get close.','Cold, greenish light. Your hand looks grey in it.','Spores drift off it when you breathe out, and glow for a moment.'],
   heal:['You eat a cap, because the miners did. Your head clears and your cuts stop stinging.'],bite:['You touch it and your fingertips go numb for an hour.'],find:'Growing out of something:'},
  {id:'boot',n:'A miner\'s boot',w:[3,3,0,0,0],spr:f=>{f('#0a0806',0,1,7,7);f('#3a2a1a',1,1,5,6);f('#3a2a1a',1,6,8,2);f('#5a4028',1,1,5,1)},
   look:['Just the one boot.','Hobnailed, the nails worn flat. He did a lot of walking in these.','Initials inside the cuff: T.W.'],
   find:'Stuffed in the toe, where he kept his pay:'},
  {id:'lampshard',n:'A smashed lamp',w:[3,2,0,0,0],spr:f=>{f('#3a3632',0,4,8,2);f('#8a8478',1,2,3,2);f('#c8d8e0',5,3,2,1);f('#c9a24b',2,1,1,1)},
   look:['Glass all over the floor. It was dropped.','There\'s still oil in the well, gone thick.'],find:'You drain what\'s left:',fixed:'lampoil'},
  {id:'vein',n:'A seam of ore',w:[3,3,0,0,0],spr:f=>{f('#3a3632',0,0,10,7);f('#2a2622',1,1,8,5);f('#c9a24b',2,2,1,1);f('#a88a4a',4,3,2,1);f('#c9a24b',7,4,1,1)},
   look:['Too thin to bother with.','Fool\'s gold.','It runs back into the rock out of reach.'],find:'You work a lump of it loose:',ore:1}],
swamp:[
  {id:'reeds',n:'Reeds',w:[4,1,2,0,0],spr:f=>{for(const a of[0,2,4,6]){f('#4a5a28',a,1,1,7);f('#6a4a2a',a,0,1,2)}},
   look:['You part them. A heron goes up, slow and angry.','Dozens of frogs, all going quiet at once.','The water behind them is black and still.'],
   find:'Caught among the stems:',bite:['A leech. You pull it off and it takes some skin with it.','An eel bumps your ankle, then latches on.']},
  {id:'spawn',n:'Frogspawn',w:[6,0,0,0,0],spr:f=>{f('#1a2a20',0,1,9,5);for(const[a,b]of[[1,2],[3,3],[5,2],[6,4],[2,4]])f('#c8d8b0',a,b,1,1)},
   look:['Thousands of black dots in jelly.','Something has been eating it from one side.','It quivers when you touch the water.']},
  {id:'bootmud',n:'A boot in the mud',w:[3,3,0,0,0],spr:f=>{f('#2a2a14',0,4,9,3);f('#3a2a1a',3,0,3,5);f('#5a4028',3,0,3,1)},
   look:['You pull. It doesn\'t come.','There\'s still a foot in it. You leave it.','Just a boot.'],
   find:'You get it free. Tucked in the top of it:'},
  {id:'bubbles',n:'Bubbling mud',w:[4,1,2,0,0],spr:f=>{f('#2a2a14',0,2,10,5);f('#4a4a24',2,3,2,2);f('#4a4a24',6,2,2,2);f('#6a6a3a',3,3,1,1)},
   look:['The mud heaves and settles, heaves and settles.','It smells of rotten eggs.','A bubble the size of your head comes up and pops.'],
   find:'A bubble bursts and leaves something on the surface:',bite:['A bubble bursts right in your face. You cough until your eyes stream.']},
  {id:'lilies',n:'Water lilies',w:[4,0,0,0,2],spr:f=>{f('#1a3a2a',0,2,5,3);f('#1a3a2a',5,3,5,3);f('#f0e8f0',2,2,2,1);f('#e8a8c8',7,3,1,1)},
   look:['White ones, and one pink.','A frog on every pad.'],heal:['You chew a root the way the fen-women do. The ache in your legs eases.']},
  {id:'moss',n:'Hanging moss',w:[4,2,0,0,0],spr:f=>{for(const a of[0,2,3,5,7]){f('#3a4a2a',a,0,1,3+((a*7)%4));f('#4a5a34',a,0,1,1)}},
   look:['It\'s cold and wet against your face.','Grey beards of it, hanging off everything.','Spiders live in it. Lots of them.'],find:'Caught up in it:',fixed:'bitterleaf'},
  {id:'bottle',n:'A bottle in the mud',w:[3,3,0,0,0],spr:f=>{f('#2a2a14',0,5,9,2);f('#2a4a3a',3,0,3,6);f('#5a8a6a',4,1,1,3);f('#6a4a2a',3,0,3,1)},
   look:['A note inside: TELL MOTHER I TRIED. Nothing else.','A note inside, in a child\'s writing: SEND HELP. WE ARE ON THE ISLAND.','Corked and empty.','A note inside: DO NOT FOLLOW THE LIGHTS IN THE FEN.'],
   find:'No message. Inside instead:'},
  {id:'eelhole',n:'An eel hole',w:[2,2,3,0,0],spr:f=>{f('#1a2414',0,1,10,6);f('#05080a',3,2,4,4);f('#2a3a20',1,1,2,1)},
   look:['A hole in the bank, round and wet. Something slides past inside.','Old eel traps, left to rot.'],
   find:'You reach in and come out with:',bite:['An eel. A big one. It has your thumb and won\'t let go.','An eel wraps round your wrist and squeezes hard.']},
  {id:'drownedbones',n:'Bones in the shallows',w:[5,1,0,1,0],spr:f=>{f('#1a2a20',0,2,10,5);f('#c8c0b0',1,3,6,1);f('#c8c0b0',2,2,1,3);f('#c8c0b0',7,4,2,1)},
   look:['A cow. It wandered in and couldn\'t get out.','Small, human. You don\'t look closer.','The bones are green with weed. The fish have been at them.'],find:'Among them, still bright:',fight:'leech'},
  {id:'stake',n:'An old mooring post',w:[5,1,0,0,0],spr:f=>{f('#0a0806',2,0,4,9);f('#4a3420',3,0,2,9);f('#8a7a5a',1,3,6,1);f('#8a7a5a',2,5,4,1)},
   look:['Rope rotted to a stain round the wood. There was a boat here once.','Notches cut in it to mark the floods. The highest is above your head.','Somebody has hammered nails into it in the shape of a fish.'],find:'Tied round it, under the green:'}],
plains:[
  {id:'flowers',n:'Wildflowers',w:[4,0,0,0,2],spr:f=>{for(const[a,b,c]of[[0,2,'#e84a4a'],[3,1,'#f0d84a'],[6,2,'#b86ae8'],[2,4,'#f4f4f4']]){f('#3a7a2a',a+1,b+1,1,3);f(c,a,b,3,1);f(c,a+1,b-1,1,3)}},
   look:['Poppies. They grow best where the ground\'s been turned over.','Cornflowers. Your mother used to put them in a jar by the window.','You pick one, then drop it.'],
   heal:['Camomile. You chew a head of it. It\'s bitter, and it settles you.']},
  {id:'molehill',n:'A molehill',w:[4,2,0,0,0],spr:f=>{f('#2a1c10',0,3,10,4);f('#4a3a24',1,2,8,4);f('#5a4a30',3,1,4,2)},
   look:['You kick it flat. There\'ll be another by tomorrow.','Fresh. The mole is right under your feet.'],find:'The mole has dug something up for you:'},
  {id:'warren',n:'A rabbit warren',w:[3,1,2,0,0],spr:f=>{f('#3a5a26',0,2,12,5);f('#0a0604',2,3,3,2);f('#0a0604',7,4,3,2);f('#5a4a30',1,2,2,1)},
   look:['A rabbit vanishes down one hole and pops up out of another.','Holes everywhere. A horse would break its leg here.'],find:'Kicked out of a hole, among the earth:',bite:['You step in a hole and turn your ankle.']},
  {id:'plough',n:'A rusted plough',w:[3,3,0,0,0],spr:f=>{f('#0a0806',0,2,12,5);f('#5a3a20',1,2,10,1);f('#6a4a3a',8,3,3,3);f('#8a5a3a',9,4,2,1)},
   look:['The field it was ploughing has gone back to grass.','Left halfway down a furrow. The ox was taken for the army.','Rust has eaten holes right through the blade.'],find:'You knock a piece off:',fixed:'scrap'},
  {id:'cairn',n:'A little cairn',w:[4,1,0,0,1],spr:f=>{f('#0a0a08',1,2,8,7);f('#6a665e',2,6,6,2);f('#7a766e',3,4,4,2);f('#8a867e',4,2,2,2)},
   look:['Every traveller adds a stone. It\'s nearly as tall as you.','A stone at the bottom has a name scratched on it.'],
   heal:['You add a stone, for luck.'],find:'Under the bottom stone, someone left an offering:'},
  {id:'helm',n:'A dented helm',w:[3,3,0,0,0],spr:f=>{f('#0a0a0c',0,1,9,7);f('#7a7a82',1,1,7,5);f('#9a9aa2',2,1,5,1);f('#0a0a0c',2,4,5,1);f('#5a5a62',3,2,1,3)},
   look:['A crown soldier\'s helm, with a dent the size of a fist in the side.','A name scratched inside the rim: DAVY.','The plume has rotted off. Grass grows up through the eyeholes.'],
   find:'Inside, wrapped in a rag:'},
  {id:'sheaf',n:'A fallen sheaf',w:[4,2,1,0,0],spr:f=>{f('#6a5a2a',0,3,10,3);f('#c8b060',0,2,10,2);f('#a89040',4,1,2,5)},
   look:['Last year\'s wheat, never brought in. Mice have it now.','Cut and bundled, then left.'],find:'Mice have been hoarding in it:',bite:['A field mouse runs up your arm and bites you on the way.']},
  {id:'purse',n:'A dropped purse',w:[1,5,0,0,0],spr:f=>{f('#1a1008',0,2,7,5);f('#6a4a2a',1,2,5,4);f('#c9a24b',3,1,1,1);f('#8a6a3a',1,2,5,1)},
   look:['Empty. Somebody got here first.'],find:'Somebody\'s bad day:',gold:1},
  {id:'crowbones',n:'A dead crow',w:[5,1,0,0,0],spr:f=>{f('#0a0a0e',0,3,8,3);f('#1a1a22',1,2,5,2);f('#c8c0b0',7,4,2,1)},
   look:['A crow pinned to the ground with a single arrow, its wings spread.','Its eyes are gone.','You pull the arrow out and leave it.'],find:'In its claws, still clenched:'},
  {id:'brokenarrows',n:'Broken arrows',w:[4,2,0,0,0],spr:f=>{f('#6a4a2a',0,2,6,1);f('#6a4a2a',3,4,7,1);f('#6a4a2a',1,6,5,1);f('#a8a8b0',9,3,2,2);f('#e8e0d0',0,1,2,1)},
   look:['A volley came down here. Dozens of arrows, snapped and trodden in.','They all point back towards the castle.'],find:'You pull out the best of the heads:',fixed:'scrap'}]};
for(const ty in SMK)for(const k of SMK[ty])k.img=mk(14,10,k.spr);

/* placement: called at the end of genZone. About 1 per 6 open tiles, never on roads, keeping off anything else */
function genSmalls(r,ty){const kinds=SMK[ty];if(!kinds)return;const out=[],taken=new Set(),want=ty==='cave'?340:440;let n=0;
  for(let k=0;k<want*12&&n<want;k++){const x=3+((r()*(MW-6))|0),y=3+((r()*(MH-6))|0),q=id(x,y);
    if(!REACH[q]||(map[q]!==G&&map[q]!==MUD)||PROPAT[q]||CHESTS[q]||inPocket(x,y))continue;
    let near=false;for(let dy=-1;dy<=1&&!near;dy++)for(let dx=-1;dx<=1;dx++)if(taken.has(id(x+dx,y+dy))){near=true;break}if(near)continue;
    if(fires.some(f=>Math.abs(f.x-x)<=1&&Math.abs(f.y-y)<=1))continue;
    const ki=(r()*kinds.length)|0;if(ty==='swamp'&&['reeds','lilies','spawn','eelhole','stake'].includes(kinds[ki].id)&&!nearType(x,y,[BOG,WATER,MUD],2))continue;
    taken.add(q);out.push(x,y,ki,0);n++}
  LV.sm=out}
let SMALLS=[];
function bindSmalls(){SMALLS=[];const L=LV;if(L.kind!=='zone')return;if(!L.sm)genSmalls(Math.random,L.type);const kinds=SMK[L.type];for(let i=0;i<L.sm.length;i+=4)SMALLS.push({i,x:L.sm[i]*T+8,y:L.sm[i+1]*T+10,k:kinds[L.sm[i+2]],used:L.sm[i+3]})}
function useSmall(o){if(o.used)return;o.used=1;LV.sm[o.i+3]=1;rec('poked',1);const k=o.k,w=k.w,tot=w.reduce((a,b)=>a+b,0);let q=Math.random()*tot,c=0;while(q>=w[c]){q-=w[c];c++}
  const t=tierHere();
  if(c===1){let items=[],g=0;if(k.gold)g=Math.max(2,Math.round(coinsFor()*1.5));else if(k.ore)items=[oreFor(t)];else if(k.fixed)items=[k.fixed];else if(chance(.45))g=Math.max(1,Math.round(coinsFor()*.5));else items=[chance(.15)?pick(['bitterleaf','bandage','lampoil']):pick(JUNK)];
    const s=grant(items,g);SFX.coin();amb(k.find+' '+s.replace(/^You find /,''),3400);return}
  if(c===2&&k.bite){const d=Math.max(1,Math.round(P.max*(.03+Math.random()*.03)));P.hp=Math.max(1,P.hp-d);rec('taken',d);SFX.hit&&SFX.hit();amb(pick(k.bite)+` −${d} HP`,3000);return}
  if(c===3&&k.fight){amb(pick(k.look),1500);setTimeout(()=>{if(mode==='world')fightNow(k.fight)},500);return}
  if(c===4&&k.heal){const h=Math.min(P.max-P.hp,Math.max(2,Math.round(P.max*.06)));P.hp+=h;SFX.heal&&SFX.heal();amb(pick(k.heal)+(h?` +${h} HP`:''),3200);return}
  amb(bagPick('sm_'+k.id,k.look),3000)}
function drawSmalls(){for(const o of SMALLS){const x=Math.round(o.x-cam.x),y=Math.round(o.y-cam.y);if(x<-16||y<-16||x>W+16||y>H+16)continue;if(o.used)ctx.globalAlpha=.55;ctx.drawImage(o.k.img,x-7,y-6);ctx.globalAlpha=1}}
