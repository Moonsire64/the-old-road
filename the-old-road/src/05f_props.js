/* ================= 0.13: three new things to poke at on every map =================
   Each is used once. 'after' is what you get if you come back to it. */
const once=(title,text,choices,fx,after)=>({u:p=>p.st?1:2,use:async p=>{if(p.st){notice(after||'You have already been here.');return}
  const c=await dialog(title,text,choices);if(c<0||c>=choices.length||/^(leave|walk on|let it be)/i.test(choices[c]))return;
  const r=await fx(c,p);if(r!==false)p.st=1}});
const hurtPct=pc=>{const d=Math.max(1,Math.round(P.max*pc));P.hp=Math.max(1,P.hp-d);SFX.hurt&&SFX.hurt();return d};
const healPct=pc=>{const h=Math.min(P.max-P.hp,Math.round(P.max*pc));P.hp+=h;return h};
const gearOf=(o={})=>genGear(tierHere(),o);
const hiddenChest=loot=>{const s=safeChestSpot(Math.floor(P.x/T),Math.floor(P.y/T));addChest(s.x,s.y,loot);SFX.chest&&SFX.chest()};

Object.assign(NEWP,{
/* ---- Wood's Edge ---- */
beehive:once('A wild hive','A hollow stump, loud with bees. Honey has run down the bark.',['Take some honey','Leave'],async()=>{
  if(chance(.55)){const h=healPct(.2);SFX.eat();notice(`You get a fistful before they notice. +${h} HP.`)}else{const d=hurtPct(.1);P.st.poison=3;SFX.hiss();notice(`They notice. −${d} HP, and the stings swell. You are Poisoned.`)}},'The bees remember you.'),
offerbowl:once('An offering bowl','A stone bowl on a post at the edge of the path. People have left gold in it, and a bent nail, and a child\'s tooth.',['Leave a potion','Take the gold','Leave'],async c=>{
  if(c===0){if(!hasItem('potion')){notice('You have nothing worth leaving.');return false}removeItem('potion');P.blessed=Math.max(P.blessed,3);SFX.shrine();notice('You set it down among the gold. The wind drops. You are Blessed.')}
  else{const g=coinsFor();P.gold+=g;if(chance(.5)){P.st.wither=4;SFX.dread();notice(`${g} gold. Your hand aches as you pocket it. You are Weakened.`)}else{SFX.coin();notice(`${g} gold.`)}}},'The bowl is empty now.'),
lostpack:once('A lost pack','A traveller\'s pack, half buried in leaves. The straps have been chewed through.',['Open it','Leave'],async()=>{
  if(chance(.25)){notice('A wren has made a nest in it.');fightNow('spider');return}
  notice('Inside, among the mould: '+grant([pick(['bandage','potion','bitterleaf','lampoil'])],coinsFor()))},'Just the chewed straps now.'),
/* ---- The Thicket ---- */
thornglint:once('In the thorns','A glint, deep in a thornbush. Metal. You\'d have to reach in.',['Reach in','Leave'],async()=>{
  const d=hurtPct(.12);P.st.bleed=2;notice(`The thorns find every gap in your sleeve. −${d} HP. You are bleeding. `+grant([gearOf()]))},'Your blood is still on the thorns.'),
antlerpost:once('An antler post','A stag\'s skull nailed to a post, antlers hung with feathers and wire.',['Touch it','Leave'],async()=>{
  P.sharp=Math.max(P.sharp||0,3);SFX.howl&&SFX.howl();notice('Your hand comes away smelling of blood. Your blade feels keener for it. Out in the thorns, a wolf howls.');huntNow('wolves',2)},'The skull on its post, facing the path.'),
stuckaxe:once('An axe in a stump','A woodcutter\'s axe driven deep into an oak stump. The handle is dark with use.',['Pull it free','Leave'],async()=>{
  if(chance(.45)){SFX.thunk();notice('It comes free with a crack. '+grant([gearOf({slot:'weapon',wt:'axe'})]))}else{const d=hurtPct(.08);notice(`It doesn't budge. You wrench your shoulder trying. −${d} HP.`);return false}},'Only the cut in the stump is left.'),
/* ---- The Heartwood ---- */
fairyring:once('A ring of white mushrooms','A perfect circle of pale mushrooms. The grass inside is greener, and quiet.',['Step inside','Leave'],async()=>{
  if(chance(.6)){P.mp=P.mmax;SFX.chime();notice('The air hums. Your head clears completely. MP restored.')}else{P.st.wither=4;SFX.dread();notice('You come out the other side and do not remember how long you were in there. You are Weakened.')}},'The ring has gone grey.'),
bloodaltar:once('A mossed altar','A flat stone, green with moss, a knife rusted to its surface. The moss is darker in the middle.',['Offer your blood','Leave'],async()=>{
  const d=hurtPct(.3);P.apts=(P.apts||0)+1;SFX.shrine();updHud();notice(`You open your palm on the knife. −${d} HP. The moss drinks it in. You have 1 extra stat point to spend.`)},'The moss has drunk it all.'),
hummingtree:once('A humming tree','A hollow oak, its heart open to the sky. It hums, very low, like someone remembering a song.',['Listen','Leave'],async()=>{
  gainXP(12+P.lv*4);SFX.chime();notice('You lean in. It is a lullaby. Your mother sang it to you and your brother in the castle nursery.')},'It hums on without you.'),
/* ---- The Mouth ---- */
minerlamp:once('A miner\'s lamp','A lamp on a hook, still a quarter full of oil. Whoever hung it meant to come back.',['Take the oil','Light it and leave it','Leave'],async c=>{
  if(c===0)notice(grant(['lampoil']));else{P.blessed=Math.max(P.blessed,2);SFX.ignite&&SFX.ignite();notice('You light it for whoever is still down here. It feels right. You are Blessed.')}},'The lamp burns on, or doesn\'t.'),
toolrack:once('A tool rack','Rusted picks and shovels on pegs. A few are still good.',['Rummage','Leave'],async()=>{
  if(chance(.3)){const d=hurtPct(.06);P.st.bleed=2;notice(`A rotten peg gives and a pick comes down on your arm. −${d} HP. You are bleeding.`)}else notice('You find something useful. '+grant([chance(.5)?'scrap':'bandage'],coinsFor()))},'Only the pegs are left.'),
echoshaft:once('A deep shaft','A shaft drops away into black. Cold air breathes up out of it.',['Shout down it','Drop a coin','Leave'],async c=>{
  if(c===0){if(chance(.5)){SFX.bat&&SFX.bat();notice('Your voice comes back from a long way down, and bats pour up out of the shaft.');fightNow('bat')}else{gainXP(8+P.lv*3);notice('Your voice comes back changed. It sounds like his. You stand very still for a while.')}}
  else{if(P.gold<1){notice('You have nothing to drop.');return false}P.gold-=1;if(chance(.4)){P.blessed=Math.max(P.blessed,2);SFX.chime();notice('You never hear it land. That feels like a good sign. You are Blessed.')}else notice('It rings off the rock for a long time.')}},'The shaft breathes up at you.'),
/* ---- Flooded Galleries ---- */
sunkcart:once('A sunken cart','An ore cart, tipped into black water. There\'s still something in it.',['Wade in','Leave'],async()=>{
  P.mp=Math.max(0,P.mp-3);SFX.splash();notice('The cold takes your breath. −3 MP. '+grant([oreFor(tierHere())]))},'The water has closed over it again.'),
glowworms:once('Glow-worms','The ceiling here is thick with glow-worms, a slow green sky.',['Sit under them a while','Leave'],async()=>{
  const m=Math.min(P.mmax-P.mp,Math.ceil(P.mmax*.5));P.mp+=m;SFX.chime();notice(`For a while you forget where you are. +${m} MP.`)},'They have dimmed, as if tired.'),
tiedbody:once('A body on a beam','A miner, tied to a beam so the water wouldn\'t take him. He drowned there.',['Search him','Say a word for him','Leave'],async c=>{
  if(c===0){if(chance(.3)){notice('Something lives in his coat.');fightNow('ooze')}else notice('His pockets: '+grant([chance(.5)?'potion':'bandage'],coinsFor()))}
  else{P.blessed=Math.max(P.blessed,2);SFX.shrine();notice('You don\'t know his name, so you say yours. You are Blessed.')}},'He is still tied there.'),
/* ---- The Deep Vault ---- */
strongbox:once('A strongbox','An iron box bolted to the rock. The hinges have rusted thin.',['Pay a locksmith\'s worth (25 gold) of patience','Force it','Leave'],async c=>{
  if(c===0){if(P.gold<25){notice('You lack the patience. And the gold.');return false}P.gold-=25;notice('An hour of picking. '+grant([gearOf({min:2})]))}
  else{const d=hurtPct(.15);notice(`The hinge gives, and so does a knuckle. −${d} HP. `+grant([gearOf()]))}},'Empty, and broken.'),
pulsecrystal:once('A pulsing crystal','A crystal as tall as you, lit from inside, slow as a heartbeat.',['Touch it','Leave'],async()=>{
  if(chance(.65)){P.mp=P.mmax;P.blessed=Math.max(P.blessed,1);SFX.chime();notice('Light runs up your arm. MP restored. You are Blessed. '+grant(['shard']))}else{const d=hurtPct(.2);SFX.crit&&SFX.crit();notice(`It bites. −${d} HP. Your fingers are numb for an hour.`)}},'It has gone dark.'),
fatherstatue:once('A statue of the old king','Your father in stone, crowned, with the words of his coronation oath cut into the plinth.',['Kneel','Take the gems from the crown','Leave'],async c=>{
  if(c===0){P.blessed=Math.max(P.blessed,4);gainXP(10+P.lv*3);SFX.shrine();notice('You kneel. You don\'t pray. You just stay there. You are Blessed.')}
  else{const g=coinsFor()*4;P.gold+=g;P.st.wither=5;SFX.dread();notice(`${g} gold of glass and garnet. Your arm goes cold to the shoulder. You are Weakened.`)}},'He has no face to look at you with.'),
/* ---- Fen's Edge ---- */
eeltrap:once('An eel trap','A wicker trap, staked in the shallows. Something moves inside it.',['Pull it up','Leave'],async()=>{
  if(chance(.6))notice('Nothing alive in it. Somebody wrapped a purse in oilcloth and hid it in the bottom. '+grant([],coinsFor()));else{const d=hurtPct(.08);P.st.bleed=2;SFX.splash();notice(`An eel, all teeth. −${d} HP. You are bleeding.`)}},'The trap is broken open.'),
reedman:once('A reed figure','A man made of bundled reeds, tied to a stake, arms out. His face is a knot.',['Burn it','Leave it standing'],async c=>{
  if(c===0){SFX.ignite&&SFX.ignite();if(chance(.5)){P.blessed=Math.max(P.blessed,3);notice('It goes up all at once. You are Blessed.')}else{notice('It burns. Something in the reeds screams.');fightNow('shroom')}}else return false},'Only the stake is left.'),
rowboat:once('A rotting rowboat','A rowboat, half sunk, the name on the side scraped off.',['Search under the seat','Leave'],async()=>{
  notice('Wrapped in oilcloth under the seat: '+grant([pick(['bandage','potion','lampoil','bitterleaf'])],coinsFor()*2))},'Nothing left but the rot.'),
/* ---- Rotwater ---- */
bogbody:once('A bog body','A man preserved in the peat, brown as a boot. He has a ring on one finger.',['Take the ring','Leave'],async()=>{
  const g=gearOf({slot:'charm'});if(chance(.4)){P.st.wither=5;SFX.dread();notice('The finger comes with it. You are Weakened. '+grant([g]))}else notice('It slides off easily, as if he wanted you to have it. '+grant([g]))},'He looks lighter without it.'),
witchbottle:once('A witch bottle','A glass bottle hung from a branch, full of pins, hair and something dark.',['Smash it','Drink it','Leave'],async c=>{
  if(c===0){notice('Whatever was kept in it is out now.');fightNow('shroom')}
  else if(chance(.5)){const h=healPct(.35);SFX.heal();notice(`It tastes of iron and rain. +${h} HP.`)}else{P.st.poison=4;SFX.hiss();notice('It tastes exactly like it looks. You are Poisoned.')}},'Broken glass in the mud.'),
wisplamp:once('A will-o\'-the-wisp','A pale light, floating just above the reeds. It bobs away when you step closer, and waits.',['Follow it','Leave'],async()=>{
  if(chance(.6)){hiddenChest([gearOf(),'potion']);notice('It leads you in a slow loop and goes out over a chest you would never have found.')}else{const d=hurtPct(.15);SFX.splash();notice(`It leads you into the deep mud and goes out. −${d} HP.`)}},'The wisp has gone.'),
/* ---- The Mother's Bed ---- */
eggclutch:once('A clutch of eggs','Eggs the size of your head, leathery, warm. One of them twitches.',['Smash them','Leave'],async()=>{
  gainXP(14+P.lv*4);notice('You do it quickly. Their mother is less quick, but not by much.');fightNow('brood')},'Shells and slime.'),
rotoffering:once('A heap of offerings','Rotten meat, piled on a flat stone and buzzing. An offering.',['Burn bitterleaf over it','Eat a piece','Leave'],async c=>{
  if(c===0){if(!hasItem('bitterleaf')){notice('You have no bitterleaf.');return false}removeItem('bitterleaf');P.blessed=Math.max(P.blessed,3);SFX.shrine();notice('The smoke drives the flies off. Something in the fen is offended. You are Blessed.')}
  else{P.st.poison=5;gainXP(20+P.lv*5);SFX.eat();notice('You do it. You don\'t know why. You are Poisoned, and you understand the Mother a little better.')}},'The flies have it back.'),
cocoon:once('A silk cocoon','A cocoon as long as a man, hung from a dead tree.',['Cut it open','Leave'],async()=>{
  if(chance(.5)){notice('He is alive, barely. He gives you everything he has and runs. '+grant(['potion','bandage'],coinsFor()*2))}else notice('He is not alive. His gear is still good. '+grant([gearOf()]))},'Empty silk, moving in the wind.'),
/* ---- The Low Fields ---- */
lostlamb:once('A lamb in the wire','A lamb, caught in a fence, too tired now even to bleat.',['Free it','Leave'],async()=>{
  P.blessed=Math.max(P.blessed,3);SFX.baa&&SFX.baa();notice('You unhook it and it stumbles off toward the farm. Small things still matter. You are Blessed.')},'Tufts of wool on the wire.'),
milestone:once('A milestone','An old milestone, the distances worn smooth. Someone has scratched a new line under them: HE IS NOT YOUR KING.',['Read it properly','Leave'],async()=>{
  gainXP(10+P.lv*3);notice('Under the new line, older and smaller, a child\'s carving: "W." Your brother cut it the summer he was nine.')},'HE IS NOT YOUR KING.'),
appletree:once('An apple tree','An old apple tree in a ruined orchard, still fruiting, for no one.',['Eat an apple','Leave'],async()=>{
  const h=healPct(.18);SFX.eat();notice(`Sour, and good. +${h} HP.`)},'You have had the best of it.'),
/* ---- The Broken Road ---- */
wagonwreck:once('An overturned wagon','A supply wagon on its side, Harrow\'s black and gold on the canvas. The horses are long gone.',['Loot it','Leave'],async()=>{
  if(chance(.3)){notice('Harrow\'s men left someone to watch it.');fightNow('band3')}else notice('Army stores: '+grant([gearOf(),'bandage'],coinsFor()))},'Picked clean.'),
gibbet:once('A gibbet','An iron cage on a pole, with a dead man still inside it.',['Say the rites','Take the boots','Leave'],async c=>{
  if(c===0){P.blessed=Math.max(P.blessed,3);SFX.shrine();notice('You say the words, badly. The crows wait politely. You are Blessed.')}
  else{notice('They fit, which is the worst part. '+grant([gearOf({slot:'boots'})]))}},'The cage creaks.'),
tollbooth:once('A toll booth','A barrier across the road and a booth with a strongbox. The sign says: BY ORDER OF THE KING.',['Pay the toll (10 gold)','Rob the box','Leave'],async c=>{
  if(c===0){if(P.gold<10){notice('You can\'t pay. Nobody is here to mind.');return false}P.gold-=10;P.blessed=Math.max(P.blessed,2);gainXP(8+P.lv*2);notice('You pay the toll. You are Blessed.')}
  else{const g=coinsFor()*3;P.gold+=g;SFX.coin();notice(`${g} gold, out of the king's strongbox.`);huntNow('band3')}},'The barrier is up.'),
/* ---- Harrow's Field ---- */
warhorn:once('A war horn','A big horn on a post at the edge of the field, for calling the companies in.',['Blow it','Leave'],async()=>{
  SFX.shout&&SFX.shout();gainXP(16+P.lv*4);notice('The note rolls across the whole field. Every head on it turns toward you.');huntNow('knight')},'The horn is cracked now.'),
fallenbanner:once('A fallen banner','Your family\'s banner. Not his black and gold: the old green. Trampled into the mud.',['Raise it','Leave it'],async c=>{
  if(c!==0)return false;P.blessed=Math.max(P.blessed,5);P.mp=P.mmax;SFX.shrine();notice('You drive the pole into the earth. Somewhere across the field, someone sees it and stops. MP restored. You are Blessed.')},'The note carries right across the field.'),
pinnedletter:once('A letter on a knife','A letter, pinned to a post with a knife you recognise. It\'s addressed to you.',['Read it','Leave'],async()=>{
  gainXP(20+P.lv*5);notice('“Come home, then. I\'ve kept your room. — W.”  The knife is yours. You gave it to him when you were boys. '+grant([gearOf({slot:'weapon',wt:'dagger'})]))},'The knife hole in the post.'),
});

/* their art */
Object.assign(PS,{
  beehive:mk(12,12,f=>{f('#050403',1,3,10,9);f('#4a3020',2,4,8,8);f('#6a4a2a',3,4,2,8);f('#e0a020',4,6,4,3);f('#f0c040',5,7,2,1);f('#141008',5,9,2,2);f('#ffe070',9,2,1,1);f('#ffe070',2,1,1,1)}),
  offerbowl:mk(10,14,f=>{f('#050403',4,5,2,9);f('#5a5852',4,6,2,8);f('#050403',0,2,10,4);f('#7a7870',1,2,8,3);f('#3a3830',2,3,6,1);f('#c9a24b',3,3,1,1);f('#c9a24b',6,3,1,1)}),
  lostpack:mk(12,9,f=>{f('#050403',1,1,10,8);f('#5a4026',2,2,8,6);f('#3a2a18',2,4,8,1);f('#7a5a36',3,2,2,2);f('#2a3a1a',0,7,12,2);f('#4a5a2a',1,7,3,1)}),
  thornglint:mk(14,12,f=>{f('#050403',0,2,14,10);f('#1a2a14',1,3,12,8);f('#3a4a24',2,4,4,3);f('#2a3a1a',7,5,5,4);f('#8a3a3a',3,3,1,1);f('#8a3a3a',10,4,1,1);f('#f0f0d0',6,7,1,1);f('#c0c0a0',7,7,1,1)}),
  antlerpost:mk(14,16,f=>{f('#050403',6,5,2,11);f('#4a3020',6,6,2,10);f('#e8e0c8',5,4,4,3);f('#e8e0c8',1,0,1,4);f('#e8e0c8',2,2,3,1);f('#e8e0c8',12,0,1,4);f('#e8e0c8',9,2,3,1);f('#050403',6,5,1,1);f('#050403',8,5,1,1);f('#8a2a2a',3,7,1,3);f('#3a4a8a',10,7,1,3)}),
  stuckaxe:mk(14,10,f=>{f('#050403',1,4,12,6);f('#4a3020',2,5,10,5);f('#6a4a2a',3,5,8,1);f('#8a8a92',6,1,4,4);f('#c0c0c8',7,1,2,2);f('#3a2414',9,0,4,2)}),
  fairyring:mk(16,8,f=>{for(const[x,y]of[[1,3],[3,1],[6,0],[9,0],[12,1],[14,3],[12,5],[9,6],[6,6],[3,5]]){f('#050403',x,y,2,2);f('#e8e0d0',x,y,2,1);f('#b8b0a0',x,y+1,1,1)}}),
  bloodaltar:mk(16,10,f=>{f('#050403',1,3,14,7);f('#4a5a3a',2,3,12,3);f('#5a5852',2,6,12,4);f('#2a3a20',5,4,6,1);f('#5a1a14',7,4,2,1);f('#8a8a92',3,3,4,1)}),
  hummingtree:mk(16,24,f=>{f('#050403',4,4,8,20);f('#4a3020',5,5,6,19);f('#2a1810',7,8,2,7);f('#1a1008',7,9,2,5);f('#6a4a2a',5,5,1,19);f('#2a3a1a',2,0,12,6);f('#3a5a2a',3,1,10,4)}),
  minerlamp:mk(8,16,f=>{f('#050403',3,0,2,16);f('#4a3020',3,1,2,15);f('#050403',0,4,8,6);f('#5a5852',1,4,6,5);f('#f0c040',2,5,4,3);f('#ffe8a0',3,6,2,1)}),
  toolrack:mk(16,14,f=>{f('#050403',0,2,16,2);f('#4a3020',0,2,16,1);for(const x of[2,6,10,13]){f('#4a3020',x,3,1,10);f('#7a7a82',x-1,3,3,2)}f('#5a3a24',0,13,16,1)}),
  echoshaft:mk(16,10,f=>{f('#3a3a40',0,0,16,10);f('#050403',2,2,12,7);f('#0a0a0e',3,3,10,5);f('#5a5852',0,0,16,2);f('#4a3020',1,0,2,10);f('#4a3020',13,0,2,10)}),
  sunkcart:mk(14,10,f=>{f('#1a2a3a',0,5,14,5);f('#050403',2,1,10,6);f('#5a4a3a',3,2,8,4);f('#3a3a40',3,2,8,1);f('#8a6a3a',5,3,2,1);f('#2a3a4a',0,6,14,1)}),
  glowworms:mk(16,8,f=>{f('#1a1a20',0,0,16,3);for(const[x,y]of[[1,3],[3,5],[5,2],[7,6],[9,3],[11,5],[13,2],[15,4],[2,7],[12,7]]){f('#2a4a2a',x,0,1,y);f('#8aff8a',x,y,1,1)}}),
  tiedbody:mk(12,18,f=>{f('#050403',5,0,2,18);f('#4a3020',5,0,2,18);f('#050403',3,4,6,12);f('#4a4038',4,5,4,10);f('#c8b890',4,3,4,3);f('#8a7a58',3,8,6,1);f('#2a3a4a',0,14,12,4)}),
  strongbox:mk(12,10,f=>{f('#050403',0,1,12,9);f('#3a3a40',1,2,10,7);f('#5a5a62',1,2,10,2);f('#c9a24b',5,5,2,2);f('#2a2a30',1,6,10,1)}),
  pulsecrystal:mk(10,22,f=>{f('#050403',3,0,4,22);f('#4a8ad8',4,1,2,20);f('#8ac8ff',4,2,1,8);f('#d8f0ff',4,4,1,2);f('#050403',0,10,3,12);f('#3a6aa8',1,11,1,10);f('#050403',7,12,3,10);f('#3a6aa8',8,13,1,8)}),
  fatherstatue:mk(12,24,f=>{f('#050403',2,0,8,24);f('#8a8a82',3,1,6,22);f('#6a6a62',3,3,6,3);f('#c9a24b',3,0,6,1);f('#aaaaa2',9,6,1,14);f('#5a5a52',2,20,8,4)}),
  eeltrap:mk(14,8,f=>{f('#1a2a3a',0,4,14,4);f('#050403',2,1,10,6);f('#8a7a48',3,2,8,4);f('#5a4a28',4,2,1,4);f('#5a4a28',7,2,1,4);f('#5a4a28',10,2,1,4)}),
  reedman:mk(12,20,f=>{f('#050403',5,0,2,20);f('#4a3020',5,6,2,14);f('#050403',0,4,12,4);f('#a8984a',1,5,10,2);f('#050403',3,0,6,14);f('#b8a85a',4,1,4,12);f('#6a5a28',5,3,2,1)}),
  rowboat:mk(16,8,f=>{f('#1a2a3a',0,5,16,3);f('#050403',0,2,16,5);f('#4a3a26',1,3,14,3);f('#2a2016',3,3,10,1);f('#5a4a30',1,3,14,1)}),
  bogbody:mk(16,8,f=>{f('#2a2018',0,3,16,5);f('#050403',2,2,12,4);f('#6a4a2a',3,3,10,2);f('#8a6a3a',3,3,3,2);f('#c9a24b',12,4,1,1)}),
  witchbottle:mk(8,16,f=>{f('#4a3020',3,0,2,5);f('#050403',1,5,6,10);f('#4a6a5a',2,6,4,8);f('#2a2a20',2,10,4,4);f('#c8c8c8',3,7,1,2)}),
  wisplamp:mk(10,14,f=>{f('#6a8ad8',3,2,4,4);f('#c8e0ff',4,3,2,2);f('#3a5aa8',2,6,1,2);f('#3a5aa8',7,6,1,2);f('#2a3a2a',0,12,10,2)}),
  eggclutch:mk(16,10,f=>{for(const[x,y]of[[1,3],[6,2],[10,3]]){f('#050403',x,y,5,7);f('#c8c0a0',x+1,y+1,3,5);f('#e8e0c8',x+1,y+1,1,2)}f('#4a5a3a',0,9,16,1)}),
  rotoffering:mk(14,10,f=>{f('#050403',0,4,14,6);f('#5a5852',1,6,12,4);f('#6a2a1a',3,3,8,4);f('#8a3a2a',4,3,3,2);f('#2a2a20',9,1,1,1);f('#2a2a20',5,0,1,1);f('#2a2a20',11,2,1,1)}),
  cocoon:mk(10,22,f=>{f('#4a3020',4,0,2,3);f('#050403',1,2,8,20);f('#d8d0c0',2,3,6,18);f('#b8b0a0',3,5,1,14);f('#a8a090',6,8,1,10)}),
  lostlamb:mk(16,12,f=>{f('#4a3020',0,4,16,1);f('#4a3020',2,2,1,10);f('#4a3020',13,2,1,10);f('#050403',4,5,8,6);f('#e8e8e0',5,6,6,4);f('#2a2a2a',10,6,2,2);f('#2a2a2a',6,10,1,2);f('#2a2a2a',9,10,1,2)}),
  milestone:mk(10,14,f=>{f('#050403',1,2,8,12);f('#8a8a82',2,3,6,11);f('#aaaaa2',2,3,6,2);f('#5a5a52',3,6,4,1);f('#5a5a52',3,8,4,1);f('#5a5a52',3,10,3,1)}),
  appletree:mk(16,22,f=>{f('#050403',6,10,4,12);f('#4a3020',7,10,2,12);f('#1a2a14',1,1,14,11);f('#2a4a24',2,2,12,8);f('#c83a2a',4,4,1,1);f('#c83a2a',9,3,1,1);f('#c83a2a',11,7,1,1);f('#c83a2a',5,8,1,1);f('#c83a2a',8,6,1,1)}),
  wagonwreck:mk(18,12,f=>{f('#050403',1,2,16,8);f('#5a4026',2,3,14,6);f('#d8c8a0',3,3,12,3);f('#c9a24b',7,4,4,1);f('#1a1a1a',7,5,4,1);f('#050403',2,8,4,4);f('#6a4a2a',3,9,2,2);f('#050403',12,8,4,4);f('#6a4a2a',13,9,2,2)}),
  gibbet:mk(12,24,f=>{f('#050403',5,0,2,24);f('#3a3a40',5,0,2,24);f('#3a3a40',2,4,8,1);f('#050403',2,5,8,11);for(const x of[2,4,6,8,9])f('#5a5a62',x,5,1,11);f('#5a5a62',2,15,8,1);f('#c8b890',4,7,3,3)}),
  tollbooth:mk(18,14,f=>{f('#050403',0,2,8,12);f('#5a4026',1,3,6,11);f('#8a2a20',0,1,8,2);f('#1a1008',2,6,4,3);f('#050403',8,7,10,2);f('#d8d0c0',8,7,10,1);f('#8a2a20',11,7,2,1);f('#8a2a20',15,7,2,1)}),
  warhorn:mk(14,16,f=>{f('#050403',6,4,2,12);f('#4a3020',6,5,2,11);f('#050403',1,1,12,5);f('#c8b890',2,2,9,2);f('#e8d8b0',2,2,3,1);f('#c9a24b',10,1,3,4)}),
  fallenbanner:mk(18,8,f=>{f('#2a2018',0,6,18,2);f('#4a3020',0,5,18,1);f('#050403',3,1,12,5);f('#2a5a2a',4,2,10,3);f('#c9a24b',8,2,2,2);f('#3a2a1a',6,4,4,1)}),
  pinnedletter:mk(10,16,f=>{f('#050403',4,0,2,16);f('#4a3020',4,0,2,16);f('#050403',1,3,8,9);f('#e8e0c8',2,4,6,7);f('#8a8070',3,6,4,1);f('#8a8070',3,8,4,1);f('#c0c0c8',4,2,1,4);f('#c9a24b',3,1,3,1)}),
});

/* three per map, added to each map's own list */
[['beehive','offerbowl','lostpack'],['thornglint','antlerpost','stuckaxe'],['fairyring','bloodaltar','hummingtree'],
 ['minerlamp','toolrack','echoshaft'],['sunkcart','glowworms','tiedbody'],['strongbox','pulsecrystal','fatherstatue'],
 ['eeltrap','reedman','rowboat'],['bogbody','witchbottle','wisplamp'],['eggclutch','rotoffering','cocoon'],
 ['lostlamb','milestone','appletree'],['wagonwreck','gibbet','tollbooth'],['warhorn','fallenbanner','pinnedletter']]
 .forEach((ts,mi)=>{const D=MAPDEF[mi];D.props=(D.props||[]).concat(ts.map(t=>[t,1,t==='milestone'||t==='tollbooth'||t==='wagonwreck'||t==='warhorn'?'road':'hid']))});

/* ---- chapel furnishings (0.13.14) ---- */
Object.assign(NEWP,{
  lectern:once('A lectern','A big book lies open on the lectern, swollen with damp. Someone has marked a passage in red.',['Read the marked passage','Leave'],async()=>{
    gainXP(8+P.lv*3);SFX.page&&SFX.page();notice(pick(['“The second son shall keep the door, and the first shall keep the crown.” The priest read this verse at your naming.','“Light a candle for the living, for the dead have no use of it.”','“No king may enter here armed.”']))},'The book has fallen shut.'),
  font:once('A holy-water font','A stone basin by the door, half full of cold, clear water.',['Drink','Wash your wounds','Leave'],async c=>{
    if(c===0){const had=P.st.poison||P.st.bleed||P.st.wither;delete P.st.poison;delete P.st.bleed;delete P.st.wither;SFX.heal();notice(had?'It burns going down, and the sickness goes with it. Your afflictions are cleansed.':'It tastes of stone.')}
    else{const h=healPct(.2);SFX.heal();notice(`The cold makes you gasp. +${h} HP.`)}},'The font is dry.'),
  candles:{u:p=>p.st?1:2,use:async p=>{if(p.st){notice('Your candle is still burning.');return}const c=await dialog('Votive candles','A rack of candles, most burned out. A few stubs left, and a taper.',['Light one for the dead','Light one for your brother','Leave']);
    if(c===2||c<0)return;p.st=1;SFX.ignite&&SFX.ignite();if(c===0){P.blessed=Math.max(P.blessed,2);notice('The flame burns straight and steady. You are Blessed.')}else{gainXP(10+P.lv*3);notice('It gutters and nearly goes out, then catches and burns brighter than the rest.')}}},
  reliquary:once('A reliquary','A small gilt box on a ledge. Inside, on velvet: a finger bone and a ring.',['Take the ring','Leave it be'],async c=>{
    if(c!==0)return false;const g=gearOf({slot:'charm'});if(chance(.5)){P.st.wither=5;SFX.dread();notice('The candles all lean away from you. You are Weakened. '+grant([g]))}else{SFX.chime();notice('Nothing stops you. '+grant([g]))}},'Just the bone now.'),
});
Object.assign(FS,{
  lectern:mk(12,16,f=>{f('#050403',2,1,8,6);f('#4a3020',3,2,6,4);f('#e8e0c8',3,1,3,3);f('#d8d0b8',6,1,3,3);f('#8a2a2a',4,2,1,1);f('#050403',5,7,2,9);f('#5a3a24',5,7,2,8);f('#050403',2,14,8,2);f('#4a3020',3,14,6,1)}),
  font:mk(12,12,f=>{f('#050403',1,2,10,4);f('#7a7870',2,2,8,3);f('#4a6a8a',3,3,6,1);f('#8ab8d8',4,3,2,1);f('#050403',4,6,4,6);f('#6a6862',5,6,2,5);f('#050403',2,10,8,2);f('#5a5852',3,10,6,1)}),
  candles:mk(14,14,f=>{f('#050403',0,8,14,6);f('#3a2a1a',1,9,12,4);for(const[x,h]of[[2,3],[4,5],[6,2],[8,4],[10,3],[12,2]]){f('#e8e0c8',x,9-h,1,h)}f('#f0c040',4,2,1,2);f('#ffe8a0',4,2,1,1);f('#f0c040',8,4,1,1)}),
  reliquary:mk(12,10,f=>{f('#050403',1,2,10,8);f('#c9a24b',2,3,8,6);f('#8a6a2a',2,6,8,1);f('#f0d070',3,3,2,1);f('#5a1a2a',5,4,2,2);f('#c9a24b',4,0,4,2)}),
});
