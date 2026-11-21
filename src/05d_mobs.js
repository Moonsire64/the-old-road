/* ================= 0.10 CREATURES: three more per area ================= */
Object.assign(KINDS,{
  thornling:{name:'Thornling',ini:4,hp:16,atk:5,def:1,xp:8,spd:36,aggro:4},
  mosstroll:{name:'Moss Troll',ini:2,hp:38,atk:11,def:2,xp:20,spd:30,aggro:4.5},
  poacher:{name:'Poacher',ini:6,hp:24,atk:8,def:1,xp:16,spd:40,aggro:6,human:1},
  gnasher:{name:'Deep Gnasher',ini:7,hp:18,atk:6,def:1,xp:10,spd:44,aggro:5},
  wisp:{name:'Lantern Wisp',ini:8,hp:14,atk:6,def:0,xp:12,spd:40,fly:1,aggro:4},
  revenant:{name:"Miner's Revenant",ini:2,hp:34,atk:11,def:3,xp:22,spd:26,aggro:4},
  hag:{name:'Bog Hag',ini:4,hp:30,atk:9,def:1,xp:22,spd:28,aggro:5,human:1},
  toad:{name:'Mire Toad',ini:3,hp:32,atk:9,def:1,xp:16,spd:30,aggro:4},
  serpent:{name:'Mire Serpent',ini:6,hp:28,atk:10,def:2,xp:18,spd:38,aggro:5},
  archer:{name:'Deserter Pikeman',ini:7,hp:28,atk:10,def:2,xp:18,spd:40,aggro:6,human:1},
  hound:{name:'War Hound',ini:8,hp:26,atk:9,def:1,xp:16,spd:54,aggro:6},
  crowswarm:{name:'Crow Swarm',ini:8,hp:20,atk:6,def:0,xp:14,spd:50,fly:1,aggro:5}});
Object.assign(FP,{
  thornling:['plant',.05,0,0,{bleed:1,poison:.5}],mosstroll:['beast',0,0,0,{stun:.35,poison:.25}],poacher:['humanoid',.12,.06,0,{}],
  gnasher:['vermin',.15,0,0,{poison:.3}],wisp:['fiend',.3,0,0,{bleed:1,poison:1,burn:1,stun:.3}],revenant:['undead',0,.08,0,{bleed:1,poison:1,stun:.3}],
  hag:['humanoid',.05,0,0,{poison:.5,debuff:.3}],toad:['beast',.05,0,0,{poison:1}],serpent:['beast',.12,0,0,{poison:.75}],
  archer:['humanoid',.06,.14,0,{}],hound:['beast',.12,0,0,{}],crowswarm:['beast',.3,0,0,{stun:.5,bleed:.3}]});
Object.assign(BSZ,{thornling:.16,mosstroll:.3,poacher:.27,gnasher:.15,wisp:.18,revenant:.28,hag:.27,toad:.2,serpent:.2,archer:.28,hound:.2,crowswarm:.2});
Object.assign(BLEEDC,{thornling:.25,gnasher:.3,hound:.35,crowswarm:.15,serpent:.1});
Object.assign(GOLD,{poacher:[4,10],hag:[6,14],archer:[8,16],revenant:[3,9]});
Object.assign(INTRO,{
  thornling:["A clump of brambles picks itself up and comes at you.","A bramble-thing pulls itself out of the briars and comes at you."],
  mosstroll:["A mossy boulder stands up on two legs.","A troll, green with moss, smelling of wet dog."],
  poacher:["A poacher steps out from behind a tree, arrow already nocked.","\"King's deer, King's woods, King's business,\" says the poacher. \"Not yours.\""],
  gnasher:["Teeth come out of the dark, then the rest of it.","A Gnasher: mostly jaw."],
  wisp:["A small light bobs towards you, like a lantern on a pole.","A Lantern Wisp. Miners used to follow them, and get lost."],
  revenant:["A dead miner in a dented helmet shuffles out of the tunnel. His lamp is still lit.","A dead miner with a pickaxe comes at you, still on shift."],
  hag:["A hag rises out of the reeds, grinning with four teeth.","\"A knight,\" says the hag. \"Come closer, so I can see you.\""],
  toad:["A toad the size of a cart blinks at you.","The mire swells, croaks, and turns out to be a toad."],
  serpent:["A green serpent slides out of the water.","A Mire Serpent rears up out of the water, tongue flicking."],
  archer:["A pikeman in a torn royal tabard. Your brother's colours. He lowers the point at your chest.","A deserter with a pike twice his height. “I'm not going back,” he says."],
  hound:["A war hound in a spiked collar. Your brother's kennels.","A big war dog in a spiked collar, trained to go for horses' legs."],
  crowswarm:["The crows come down all at once.","A cloud of crows, all coming at you."]});
Object.assign(DIE,{
  thornling:["The Thornling falls apart into an ordinary bramble."],mosstroll:["The troll sits down heavily and doesn't get up."],
  poacher:["The poacher drops. His bow clatters away."],gnasher:["The Gnasher's jaw snaps shut one last time."],wisp:["The wisp gutters out like a candle."],
  revenant:["The revenant falls apart and its lamp goes out."],hag:["The hag sinks back into the reeds, still cackling."],toad:["The toad deflates with a long, rude noise."],
  serpent:["The serpent uncoils and goes still."],archer:["The pikeman goes down on his own pike."],hound:["The hound whimpers once and lies down."],crowswarm:["The last crows scatter."]});
Object.assign(STUDY,{
  thornling:[['h',"When it bristles, hitting it hurts you too. Wait it out, or burn it."],['f',"About the size of a cat, and nastier."]],
  mosstroll:[['h',"Its wounds close every turn unless it is bleeding or burning."],['f',"It smells like a dog that has been in a pond for a year."]],
  poacher:[['h',"He sets snares. You won't be running anywhere once you're caught."],['f',"His boots are royal army issue. A deserter."]],
  gnasher:[['h',"Bites in flurries, and gets worse when it's hurt."],['f',"It has a mouth full of teeth, all pointing inwards."]],
  wisp:[['h',"Hard to hit. It feeds on your MP, and it burns."],['f',"It gives off a soft, steady light. Easy to follow."]],
  revenant:[['h',"Put it down once and it gets back up. Twice is usually enough."],['f',"His lamp still burns."]],
  hag:[['h',"Her curses weaken your arm. She can patch herself up, once."],['f',"She is humming a lullaby, badly."]],
  toad:[['h',"Its skin is poison. Hitting it with a blade may poison you."],['f',"Its throat swells like a bladder when it croaks."]],
  serpent:[['h',"When it coils, it is about to crush you and hold you fast. Guard."],['f',"Its eyes are milky and lidless."]],
  archer:[['h',"When he sets his pike, don't walk onto it. Guard, or hit him with something he can't meet."],['h',"Wound-up blows from you are what the set pike punishes worst."],['f',"He has your brother's colours on, torn off at the shoulder."]],
  hound:[['h',"Fast, and its bite opens wounds."],['f',"It was somebody's dog once. It still has the collar."]],
  crowswarm:[['h',"Very hard to hit. They go for the eyes."],['f',"One of them is carrying a brass button."]]});
Object.assign(DROPS,{thornling:[['silk',.15],['bitterleaf',.12]],mosstroll:[['pelt',.3],['potion',.08]],poacher:[['horn',.15],['bandage',.15],['potion',.06]],
  gnasher:[['battooth',.25],['potion',.05]],wisp:[['candlestub',.3],['hallowed',.08]],revenant:[['scrap',.35],['shard',.1],['lampoil',.12]],
  hag:[['bitterleaf',.25],['spores',.2],['potion',.08]],toad:[['jelly',.25],['bitterleaf',.1]],serpent:[['tusk',.15],['potion',.06]],
  archer:[['button',.2],['bandage',.15],['potion',.08]],hound:[['pelt',.25],['potion',.05]],crowswarm:[['button',.3],['ring',.05]]});
/* their moves */
/* the Rot Mother's egg sacs: they do nothing but wait, and then hatch */
KINDS.eggsac={name:'Egg Sac',ini:0,hp:22,atk:0,def:0,xp:2};
const FOE_AI={
  async eggsac(f,e){e.st.hatch=(e.st.hatch||3)-1;updBUI();if(e.st.hatch>0){f.shake=.3;await say('The egg sac twitches.',500);return}
    f.hp=0;f.dead=true;f.die=9;f.noXP=1;SFX.squelch();await say('The egg sac splits and two slimes slither out.',800,true);summon('slime',2,'Two of her brood hatch.')},
  async thornling(f,e){if(!e.st.bristle&&chance(.3)){e.st.bristle=2;updBUI();await say('It bristles. Every thorn stands up.',900)}else{await eHit(f,1,'It lashes you with a thorny limb. (# dmg)')}},
  async mosstroll(f,e){if(e.st.coiled){delete e.st.coiled;await eHit(f,1.9,'The troll brings both fists down. (# dmg)')}else if(chance(.28)){e.st.coiled=1;updBUI();await say('The troll raises both fists over its head...',1000,true)}else await eHit(f,1,'A heavy, mossy backhand. (# dmg)')},
  async poacher(f,e){if(!P.st.rooted&&chance(.3)){f.lunge=.2;await say('He kicks a snare across the ground. It bites into your leg.',800);await inflict('rooted',2,'You are caught fast.')}else if(chance(.2)){await eHit(f,1.5,'He takes his time with this one. (# dmg)')}else await eHit(f,1,'An arrow finds a gap. (# dmg)')},
  async gnasher(f,e){const n=e.hp<e.max*.5?3:2;if(chance(.45)){for(let i=0;i<n&&P.hp>0;i++)await eHit(f,.5,i?'And again. (# dmg)':'It bites, and bites. (# dmg)')}else await eHit(f,1,'Its jaw closes on your arm. (# dmg)')},
  async wisp(f,e){const r=Math.random();if(r<.3&&P.mp>0){const m=Math.min(P.mp,3);P.mp-=m;addNum('p',m,'#7ab8e8');e.hp=Math.min(e.max,e.hp+m*2);updBUI();await say(`It drinks the light out of you. −${m} MP.`,800)}
    else if(r<.5&&!P.st.blind){B.fx.push({k:'heal',t:0});await say('It flares up, bright as noon.',700);await inflict('blind',2,"You can't see!")}
    else{await eHit(f,1,'It brushes against you. It burns. (# dmg)');if(P.hp>0&&!P.st.burn&&chance(.35))await inflict('burn',2,'You are burning.')}},
  async revenant(f,e){if(!P.st.wither&&chance(.3)){await eHit(f,.8,'The pick catches you and wrenches. (# dmg)');if(P.hp>0)await inflict('wither',3,'Your sword arm goes numb. Withered.')}else await eHit(f,1.1,'A pickaxe, swung by a man who did it every day of his life. (# dmg)')},
  async hag(f,e){if(e.hp<e.max*.5&&!e.mended){e.mended=1;const h=Math.round(e.max*.35);e.hp=Math.min(e.max,e.hp+h);addNum(f,h,'#8fe08a');SFX.heal();updBUI();await say('She stirs something foul into her own wounds. They close.',900)}
    else if(!P.st.wither&&chance(.35)){B.fx.push({k:'rot',t:0});SFX.dread();await say('She points a crooked finger and says your name. Your real one.',900);await inflict('wither',3,'Your arm goes weak. Withered.')}
    else await eHit(f,1,'She rakes you with long yellow nails. (# dmg)')},
  async toad(f,e){if(!P.st.rooted&&chance(.3)){await eHit(f,.8,'Its tongue whips out and wraps your leg. (# dmg)');if(P.hp>0)await inflict('rooted',1,'It reels you in.')}else await eHit(f,1.1,'It flops onto you. (# dmg)')},
  async serpent(f,e){if(e.st.coiled){delete e.st.coiled;await eHit(f,1.6,'It wraps around you and squeezes. (# dmg)');if(P.hp>0)await inflict('rooted',2,'You cannot move.')}
    else if(chance(.25)){e.st.coiled=1;updBUI();await say('The serpent draws itself into a tight coil...',1000,true)}
    else if(!P.st.poison&&chance(.35)){await eHit(f,.8,'Fangs, quick as anything. (# dmg)');if(P.hp>0)await inflict('poison',3,'You are poisoned.')}else await eHit(f,1,'It strikes. (# dmg)')},
  /* the pikeman: sets his pike (your next blow is met on the point before it lands), or drives it in two-handed */
  async archer(f,e){if(!e.st.pikeset&&chance(.3)){e.st.pikeset=1;updBUI();await say('He plants the butt of the pike and lowers the point. Come on, then.',1000,true)}
    else if(chance(.25)){await eHit(f,1.35,'He runs the pike in with his whole weight behind it. (# dmg)');if(P.hp>0&&chance(.35)&&!P.st.bleed)await inflict('bleed',3,'The head comes out ragged. You are bleeding.')}else await eHit(f,1,'The pike jabs at you, then again. (# dmg)')},
  async hound(f,e){if(chance(.3)){await eHit(f,1.2,'It leaps for your throat. (# dmg)')}else await eHit(f,1,'It worries at your arm. (# dmg)')},
  async crowswarm(f,e){if(!P.st.blind&&chance(.3)){SFX.caw(1);await say('They go for your eyes.',700);await inflict('blind',2,"You can't see!")}else{for(let i=0;i<3&&P.hp>0;i++)await eHit(f,.4,i?'Peck. (# dmg)':'Beaks, everywhere. (# dmg)')}}};
