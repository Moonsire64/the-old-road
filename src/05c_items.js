
/* ================= v7 ITEMIZATION ================= */
RARITY.push({n:'Unique',c:'#c7b377'},{n:'Set',c:'#3ee0f0'});
RARITY[2].n='Magic';
PRICE_R.push(900,650);
Object.assign(ICON_ROWS,{
 gem:["............","....kkkk....","...kccaak...","..kcaaaabk..",".kcaaaaaabk.",".kaaaaaaabk.","..kaaaaabk..","...kaaabk...","....kabk....",".....kk.....","............","............"],
 skullgem:["............","...kkkkkk...","..kccaaaak..",".kcaaaaaaak.",".kakkaakkak.",".kakkaakkak.",".kaaaakaaak.","..kaaaaaak..","...kakakk...","...kkkkk....","............","............"],
 crowbar:["..........kk",".........kak","........kak.",".......kak..","......kak...",".....kak....","....kak.....","...kak......","..kak.......",".kak........","kakk........","kck........."],
 pole:["...........k","..........kb",".........kb.","........kb..",".......kb...","......kb....",".....kb.....","....kb......","...kb.......","..kb........",".kb.........","kk.........."],
 shovel:[".......kk...","......kbk...","......kbk...",".....kbk....",".....kbk....","....kbk.....","...kkkk.....","..kaaaak....","..kaaaak....","..kaaaak....","...kaak.....","....kk......"],
 key:["..kkk.......",".kaaak......",".ka.ak......",".kaaak......","..kak.......","..kak.......","..kak.......","..kaakk.....","..kak.......","..kaakk.....","..kak.......","...k........"],
 spear:["..........kk",".........kck","........kcck",".......kcck.","......kbkk..",".....kbk....","....kbk.....","...kbk......","..kbk.......",".kbk........","kbk.........","kk.........."],
 great:[".........kkk","........kaak",".......kaaak","......kaaak.",".....kaaak..","....kaaak...","kk.kaaak....","kckaaak.....",".kcck.......","..kcck......",".kbkkck.....","kbk..kk....."],
 scythe:["..kkkkkk....",".kaaaaaak...","kaakkkkaak..","kak....kbk..","kk.....kbk..","......kbk...","......kbk...",".....kbk....",".....kbk....","....kbk.....","....kbk.....","....kk......"],
 legs:["............",".kkkkkkkkkk.",".kbbbbbbbbk.",".kaaaaaaaak.",".kaaaaaaaak.",".kaakkkkaak.",".kaak..kaak.",".kaak..kaak.",".kcak..kcak.",".kaak..kaak.",".kaak..kaak.",".kkkk..kkkk."],
 gloves:["............","...k.k.k....","..kakakak...","..kakakakk..","..kakakakak.","..kaaaaakak.","..kaaaaaaak.","..kaaaaaak..","...kaaaak...","...kbbbbk...","...kbbbbk...","...kkkkkk..."],
 belt:["............","............","............","kkkkkkkkkkkk","aaaakkkkaaaa","aaaakcckaaaa","aaaakc.kaaaa","aaaakcckaaaa","aaaakkkkaaaa","kkkkkkkkkkkk","............","............"],
 torch:["....kk......","...kcck.....","..kcaack....","..kcaack....","...kaak.....","...kbbk.....","....kbk.....","....kbk.....","....kbk.....","....kbk.....","....kbk.....","....kk......"],
 bomb:["........k.c.",".......k.c..","......k.....","....kkkk....","..kkaaaakk..",".kaaccaaaak.",".kacaaaaaak.",".kaaaaaaaak.",".kaaaaaaaak.","..kaaaaaak..","...kkkkkk...","............"],
 hook:["...kkk......","..kaaak.....",".kak.kak....",".kak..kk....",".kak........","..kak..k....","...kaakak...","....kaaak...",".....kbk....","......kbk...",".......kbk..","........kk.."],
 cloak:["....kkkk....","...kbbbbk...","..kaccccak..","..kaaaaaak..",".kaaaaaaaak.",".kaaaaaaaak.",".kaaabbaaak.","kaaaabbaaaak","kaaaabbaaaak","kaaaaaaaaaak","kaakaaakaak.",".kk.kkk.kk.."],
 ring:["............","....kkkk....","...kcccck...","....kcck....","...kkkkkk...","..kaabbaak..",".kak....kak.",".kak....kak.",".kak....kak.","..kab..bak..","...kaaaak...","....kkkk...."],
 bell:[".....kk.....","....kbbk....","....kaak....","...kaaaak...","...kacaak...","..kaacaaak..","..kaaaaaak..",".kaaaaaaaak.",".kkkkkkkkkk.",".....kk.....",".....kk.....","............"],
 ore:["............","....kkkk....","...kaccak...","..kaaccaak..",".kaaaaaaaak.",".kabaaaacak.",".kaaaaccaak.",".kaabaaaaak.","..kaaaabak..","...kkkkkk...","............","............"]});
const SLOT_LIST=['weapon','shield','helm','armor','cloak','legs','gloves','boots','belt','amulet','ring','charm'];
const SLOTN={weapon:'weapon',shield:'shield',helm:'helm',armor:'armour',cloak:'cloak',legs:'legs',gloves:'gloves',boots:'boots',belt:'belt',amulet:'amulet',ring:'ring',ring2:'ring',charm:'charm',charm2:'charm'};
/* ---- tier materials: colours per tier ---- */
const MET=[['#8b9099','#3a2a1d','#6d5a33'],['#b8bcc2','#3a2a1d','#9c2a24'],['#d6dade','#24180f','#c9a24b'],['#e8d8a8','#2a1a10','#ffe08a']];
const BLADE=['#a8acb2','#d8dde3','#f0f4f8','#fff0c0'];
const ARMPAL=[{S:'#8a7a5a',s:'#6a5a40',d:'#3e3424'},{S:'#b4b9c0',s:'#7a7f87',d:'#454950'},{S:'#6a4430',s:'#4a2e20',d:'#2a1a10',r:'#26382a',R:'#3e5a3e'},{S:'#d6dade',s:'#9a9ea6',d:'#5a5e66',r:'#6a5a2a',R:'#c9a24b'}];
const HELMPAL=[{H:'#6a4a2e',h:'#4a321e',j:'#2e1e12',P:'#4a321e'},{H:'#cfd4da',h:'#8b9099',j:'#50555e',P:'#9c2a24'},{H:'#d6dade',h:'#8a8e96',j:'#44484f',P:'#d8d0b8'},{H:'#e8d8a8',h:'#b0a070',j:'#6a5a30',P:'#c9a24b'}];
const WEAP={
  sword:{icon:'sword',names:['Short Sword','Arming Sword','Longsword',"Knight's Blade"],atk:[2,4,6,8],st:{},d:'A plain, balanced sword.'},
  axe:{icon:'axe',names:['Hatchet','Bearded Axe','Broad Axe','War Axe'],atk:[2,5,7,9],st:{crit:-.02,bleedc:.15},d:'Heavy in the head. Hits harder, lands clean less often.'},
  mace:{icon:'maul',names:['Club','Flanged Mace','Morning Star',"Knight's Mace"],atk:[2,4,6,8],st:{pierce:2,stagger:.04},d:'Armour matters less to a mace.'},
  spear:{icon:'spear',names:['Boar Spear','Pike','Partisan','Winged Spear'],atk:[3,5,8,11],st:{ini:2},d:'Reach, and both hands on the shaft. You get your blow in first more often.'},
  dagger:{icon:'knife',names:['Knife','Dirk','Stiletto','Rondel'],atk:[1,3,4,6],st:{crit:.1,ini:1,bleedc:.2},d:'Light and quick. It finds the gaps.'},
  great:{icon:'great',names:['Greatsword','Zweihänder','Flamberge','Executioner'],atk:[4,7,10,13],st:{ini:-2,crit:.02},d:'Two hands, slow, and very heavy.'},
  hammer:{icon:'maul',names:['Maul','War Hammer','Great Hammer','Bell Hammer'],atk:[3,6,9,12],st:{stagger:.1,ini:-2,pierce:1},d:'Knocks things off their feet.'},
  flail:{icon:'flail',names:['Threshing Flail','Chain Flail','Morning Flail',"Knight's Flail"],atk:[2,5,7,9],st:{ini:-1,stagger:.05},d:'A spiked head on a chain. It goes round shields, and now and then round you.'},
  halberd:{icon:'halberd',names:['Bill','Glaive','Halberd','Poleaxe'],atk:[4,6,9,12],st:{ini:1,pierce:1},d:'An axe, a spike and a hook on a long pole. Reach, and weight behind it.'},
  scythe:{icon:'scythe',names:['Sickle','Reaping Hook','War Scythe','Harvester'],atk:[2,4,6,8],st:{cleave:.3,bleedc:.1},d:'A wide arc. Whatever stands beside your target gets some of it too.'}};
const ARM={
  shield:{icon:'shield',names:['Buckler','Kite Shield','Heater Shield','Pavise'],st:{def:[1,2,3,5]},d:'A slab of wood and iron between you and the next blow.'},
  helm:{icon:'helm',names:['Leather Cap','Bascinet','Great Helm','Armet'],st:{def:[1,2,3,4]},d:'Covers your head.'},
  armor:{icon:'armor',names:['Gambeson','Mail Hauberk','Brigandine','Plate Harness'],st:{def:[1,3,4,6]},d:'Covers your chest and back.'},
  legs:{icon:'legs',names:['Wool Leggings','Mail Chausses','Splinted Greaves','Plate Cuisses'],st:{def:[1,1,2,3]},d:'Covers the thighs and shins.'},
  gloves:{icon:'gloves',names:['Leather Gloves','Mail Mittens','Gauntlets','Plate Gauntlets'],st:{def:[0,1,1,2],atk:[0,0,1,1]},d:'Protects the hands, and helps the grip.'},
  boots:{icon:'boots',names:['Worn Boots','Riding Boots','Iron Sabatons','Plate Sabatons'],st:{def:[0,1,2,3]},d:'Boots for a long walk.'},
  belt:{icon:'belt',names:['Rope Belt','Leather Belt','Studded Belt',"Knight's Girdle"],st:{max:[3,5,8,12]},d:'A leather belt with loops for pouches.'},
  amulet:{icon:'charm',names:['Bone Pendant','Copper Amulet','Silver Amulet','Gold Amulet'],st:{mmax:[1,2,3,4]},d:'Worn close to the heart.'},
  charm:{icon:'rosary',names:['Trinket','Fetish','Talisman','Relic'],st:{},d:'Small things with old power in them.'},
  /* rings work like Diablo II's: no stats of their own, never plain (always magic or better), and their power is all in the affixes */
  cloak:{icon:'cloak',names:['Tattered Cloak','Wool Cloak','Fur Mantle',"Knight's Mantle"],st:{def:[0,1,1,2]},d:'Keeps the rain off and the cold out.'},
  ring:{icon:'ring',names:['Copper Ring','Silver Ring','Gold Ring','Starsilver Ring'],st:{},d:'A band of metal, and whatever was worked into it.'}};
const RING_METAL=['#c8804a','#c8ccd2','#e0b850','#e8f0ff'],RING_GEM=['#c83a2a','#3a7ad8','#3ac86a','#b04ad8','#e8e0c8','#e0a020'];
const CHARM_ICONS=['rosary','heart','candle','vial','leaf'];
/* affixes: s = slots allowed, v = max value per tier */
const PRE=[
  {n:['Sharp','Fine','Cruel','Merciless'],k:'atk',v:[1,2,3,5],s:'weapon gloves amulet ring'},
  {n:['Sturdy','Strong','Glorious','Blessed'],k:'def',v:[1,2,3,4],s:'shield helm armor legs boots gloves cloak'},
  {n:['Jagged','Vicious','Savage','Murderous'],k:'crit',v:[.02,.04,.06,.09],s:'weapon gloves amulet helm'},
  {n:['Hallowed','Sacred','Holy','Divine'],k:'smite',v:[1,2,3,5],s:'weapon amulet helm shield'},
  {n:['Swift','Quick','Fleet','Lightning'],k:'ini',v:[1,1,2,3],s:'boots gloves weapon legs amulet'},
  {n:['Leeching','Draining','Bloodthirsty','Vampiric'],k:'lifesteal',v:[.02,.03,.04,.06],s:'weapon amulet gloves ring'},
  {n:['Spiked','Barbed','Thorned','Razored'],k:'thorns',v:[1,1,2,3],s:'shield armor helm'},
  {n:['Lucky','Fortunate','Gilded','Charmed'],k:'mf',v:[.08,.12,.18,.25],s:'amulet helm boots charm gloves ring'},
  {n:['Bronze','Iron','Steel','Silver'],k:'acc',v:[.02,.03,.05,.07],s:'weapon gloves ring amulet helm'},
  {n:['Shimmering','Rainbow','Scintillating','Prismatic'],k:'rAll',v:[.03,.05,.07,.1],s:'ring amulet shield charm cloak'}];
const SUF=[
  {n:['of the Fox','of the Wolf','of the Bear','of the Whale'],k:'max',v:[4,7,11,16],s:'shield helm armor legs boots belt amulet charm gloves ring cloak'},
  {n:['of the Candle','of the Lamp','of the Beacon','of the Pyre'],k:'mmax',v:[2,3,4,6],s:'helm amulet belt charm weapon ring'},
  {n:['of Mending','of Renewal','of Regrowth','of the Troll'],k:'regen',v:[1,1,2,3],s:'armor belt amulet legs ring'},
  {n:['of Jarring','of Ringing','of Thunder','of the Earthquake'],k:'stagger',v:[.03,.05,.08,.12],s:'weapon gloves shield'},
  {n:['of Piercing','of Puncturing','of Breaching','of Ruin'],k:'pierce',v:[1,1,2,3],s:'weapon gloves'},
  {n:['of Haste','of Speed','of Alacrity','of the Wind'],k:'speed',v:[.05,.08,.12,.15],s:'boots legs'},
  {n:['of Escape','of Flight','of Evasion','of the Coward'],k:'flee',v:[.05,.08,.12,.18],s:'boots legs belt cloak'},
  {n:['of Fortune','of Wealth','of Greed','of Avarice'],k:'gf',v:[.1,.15,.25,.35],s:'amulet belt gloves charm ring'},
  {n:['of Learning','of Study','of Wisdom','of the Sage'],k:'xpb',v:[.03,.05,.08,.1],s:'amulet helm charm'},
  {n:['of Warding','of the Ward','of Shelter','of the Sanctum'],k:'def',v:[1,1,2,3],s:'amulet belt charm'},
  {n:['of Clotting','of Staunching','of the Tourniquet','of the Unbleeding'],k:'rBleed',v:[.05,.08,.12,.16],s:'ring amulet armor belt shield'},
  {n:['of the Antidote','of Purity','of the Physician','of Immunity'],k:'rPoison',v:[.05,.08,.12,.16],s:'ring amulet boots helm cloak'},
  {n:['of Steadiness','of Balance','of the Rock','of the Mountain'],k:'rStun',v:[.05,.08,.12,.16],s:'ring helm shield'},
  {n:['of Embers','of Ash','of the Hearth','of the Phoenix'],k:'rBurn',v:[.05,.08,.12,.16],s:'ring armor shield boots cloak'},
  {n:['of Strength','of Might','of the Giant','of the Titan'],k:'a_str',v:[1,2,3,5],s:'ring amulet gloves belt'},
  {n:['of Dexterity','of Skill','of Precision','of Perfection'],k:'a_dex',v:[1,2,3,5],s:'ring amulet gloves boots'},
  {n:['of Vigor','of Vitality','of Life','of the Colossus'],k:'a_vit',v:[1,2,3,5],s:'ring amulet armor belt'},
  {n:['of Energy','of the Mind','of Brilliance','of Sorcery'],k:'a_ene',v:[1,2,3,5],s:'ring amulet helm'},
  {n:['of the Hare','of the Deer','of the Stag','of the Swallow'],k:'a_mob',v:[1,2,3,5],s:'ring boots legs cloak'},
  {n:['of the Ox','of Iron','of Granite','of the Bastion'],k:'a_fort',v:[1,2,3,5],s:'ring shield armor belt'}];
/* charm specials */
const SPEC=[['tal_twin',1],['tal_whirl',1],['tal_bash',1],['tal_mend',1],['tal_keen',1],['tal_riposte',1],['tal_exec',1],['tal_stalwart',1],['tal_sear',1],['tal_spite',1],['tal_hamstring',1],['tal_harvest',1],['tal_morbid',1],['stealth',[.12,.16,.22,.3]],['smitec',1],['potb',[.1,.15,.2,.3]],['mf',[.1,.18,.26,.35]],['tool2',1]];
const RA=['Grim','Dread','Hollow','Ash','Bone','Blood','Gloom','Raven','Storm','Doom','Wrath','Pale','Corpse','Winter','Rune','Shadow','Iron','Ember','Mourn','Rot','Grave','Hate','Thorn','Crow'];
const RB={cloak:['Shroud','Mantle','Pall','Veil','Wing','Shadow'],ring:['Band','Coil','Loop','Circle','Knot','Seal'],weapon:['Bite','Fang','Song','Edge','Thirst','Mark','Reaver','Wound','Scar','Toll'],shield:['Ward','Wall','Bulwark','Aegis','Guard','Bastion'],helm:['Crown','Visage','Mask','Brow','Cowl','Halo'],armor:['Shroud','Hide','Coat','Carapace','Mantle','Skin'],legs:['Stride','Greaves','Shanks','Legs'],gloves:['Grip','Clutch','Fist','Hand','Touch','Claw'],boots:['Trail','Tread','Road','Track','Walk'],belt:['Cord','Coil','Clasp','Buckle','Girth'],amulet:['Heart','Eye','Star','Tear','Locket','Charm'],charm:['Token','Totem','Idol','Knot','Relic','Sign']};
/* ---- uniques: convert the hand-made specials, add new ones ---- */
/* uniques for the slots that had none or only one (0.13.28). Rings take after Diablo II's famous ones */
Object.assign(ITEMS,{
  kingsseal:{n:"The King's Seal",slot:'ring',st:{mmax:6,a_ene:3,smite:2},icon:'ring',c:['#e0b850','#1a1208','#2a5a2a'],d:'Your father\'s signet, set with the old green stone. It sealed every law he made.'},
  paupernail:{n:"Pauper's Nail",slot:'ring',st:{mf:.25,acc:.05},icon:'ring',c:['#8a8e96','#1a1208','#8a8e96'],d:'A horseshoe nail bent into a ring. For luck.'},
  bloodbond:{n:'Bloodbond',slot:'ring',st:{lifesteal:.04,max:10,a_str:2},icon:'ring',c:['#c8ccd2','#1a1208','#c83a2a'],d:'Two rings fused into one in a forge fire.'},
  ravenring:{n:'Ravenclaw',slot:'ring',st:{a_dex:4,acc:.08,rStun:.15},icon:'ring',c:['#3a3a44','#0a0a0e','#c8ccd2'],d:'A black band set with a single talon. Your hand is steadier for it.'},
  emberband:{n:'Ember Band',slot:'ring',st:{max:12,gf:.2,rBurn:.25},icon:'ring',c:['#c8804a','#1a1208','#e0a020'],d:'Warm to the touch, always. A smith\'s ring, worn thin at the inside.'},
  mirelight:{n:'Mirelight',slot:'ring',st:{rPoison:.2,regen:1,light:.15},icon:'ring',c:['#c8ccd2','#1a1208','#8ad8a8'],d:'A pale stone that glows when the air goes bad. In the fens it hardly stops.'},
  nightmantle:{n:'Mantle of Night',slot:'cloak',st:{def:2,stealth:.25,a_mob:3,flee:.15},icon:'cloak',c:['#1e2230','#0a0c14','#4a5a8a'],d:'Black wool, cut to blend into dusk. Nobody looks twice at you.'},
  wolfpelt:{n:"Wolfmother's Pelt",slot:'cloak',st:{def:3,max:10,a_fort:3,rBleed:.15},icon:'cloak',c:['#6a6a6e','#2a2a2e','#c8c8c8'],d:'The pelt of the biggest wolf in the Shaded Woods. Other wolves give you a wide berth.'},
  usurped:{n:'The Usurped Mantle',slot:'cloak',st:{def:3,rAll:.12,a_str:2,a_vit:2},icon:'cloak',c:['#2a5a2a','#142a14','#c9a24b'],d:'The green and gold of your house. He wore it to his coronation, then had it thrown in a ditch.'},
  bogwalkers:{n:'Bogwalkers',slot:'boots',st:{def:2,speed:.12,rPoison:.2},icon:'boots',c:['#4a5a3a','#22301a','#8a9a5a'],d:'Waxed to the knee and stinking of it. The mud slides off.'},
  bandolier:{n:"Poacher's Bandolier",slot:'belt',st:{max:10,gf:.15,potb:.25},icon:'belt',c:['#5a4026','#2a1a0e','#c9a24b'],d:'Loops for snares, a pouch for gold, and a flask that sloshes.'},
  cutpurse:{n:'Cutpurse Gloves',slot:'gloves',st:{atk:1,crit:.05,gf:.25,a_dex:2},icon:'gloves',c:['#3a2a1e','#1a120a','#8a6a3a'],d:'Thin kid leather, made for picking pockets.'},
  lastwatch:{n:'Greaves of the Last Watch',slot:'legs',st:{def:4,max:12,rStun:.15},icon:'legs',c:['#9aa0a8','#3a3e44','#c9a24b'],d:'The castle guard wore these the night your brother took the throne.'},
  hermitrobe:{n:"Hermit's Robe",slot:'armor',st:{def:2,mmax:5,regen:2,rAll:.08},icon:'armor',c:['#5a5444','#2a2618','#8a8070'],pal:{S:'#5a5444',s:'#3e3a2e',d:'#24211a'},d:'A monk\'s habit, forty years old. It smells of incense.'},
});
const UNIQ={kingsseal:2,paupernail:0,bloodbond:3,ravenring:2,emberband:1,mirelight:1,nightmantle:1,wolfpelt:2,usurped:3,bogwalkers:1,bandolier:1,cutpurse:1,lastwatch:2,hermitrobe:1,tolling:1,oathbreaker:2,heartmaul:9,blackshield:2,bearskull:1,oathplate:2,ember:3,warhammer:2,aegis:2,wardenhelm:2,dawnplate:3,stormboots:2,eyecharm:2,crystalblade:9,rotcrown:9,lastoath:9,knife:0,golemheart:1,candle:1,rosary:1,slimeglass:1,battooth:0};
for(const id in UNIQ)ITEMS[id].r=6;
ITEMS.battooth.slot='amulet';ITEMS.battooth.st={crit:.06,ini:1};
Object.assign(ITEMS.candle.st,{smitec:1});Object.assign(ITEMS.rosary.st,{tal_mend:1});Object.assign(ITEMS.ember.st,{tal_consec:1});Object.assign(ITEMS.slimeglass.st,{potb:.2});
Object.assign(ITEMS,{
  owlfeather:{n:'Owl Feather',slot:'charm',r:6,st:{stealth:.3,ini:1},icon:'leaf',c:['#d8cfb0','#5a4a3a','#8a7a5a'],d:'A soft grey owl feather. Your step goes quiet with it on you.'},
  bellshard:{n:'Bell-Shard',slot:'charm',r:6,st:{tal_bash:1,stagger:.05},icon:'vial',c:['#c9a24b','#3a2a1d','#ffe8a0'],d:'A sliver of a cracked bell. It rings when it touches iron.'},
  hangrope:{n:"The Hangman's Rope",slot:'belt',r:6,st:{max:6,thorns:1,rBleed:.15},icon:'belt',c:['#8a7a5a','#3a2a1a','#5a4a3a'],d:'A hangman\'s rope, cut down from the gallows.'},
  gravehands:{n:"Gravedigger's Hands",slot:'gloves',r:6,st:{atk:2,gf:.3,mf:.15},icon:'gloves',c:['#5a4a3a','#2a1a10','#8a7a5a'],d:'The dirt doesn\'t wash out.'},
  widowlocket:{n:"Widow's Locket",slot:'amulet',r:6,st:{mmax:4,regen:1,potb:.25},icon:'charm',c:['#d8d0b8','#3a2a1d','#8a2a2a'],d:'A locket with two tiny portraits inside, a man and a woman.'},
  pilgrimlegs:{n:"Pilgrim's Wraps",slot:'legs',r:6,st:{def:3,speed:.1,flee:.1},icon:'legs',c:['#8a7a5a','#3a2a1a','#c9a24b'],d:'Tightly wrapped hand-wraps, for a long march.'},
  longharvest:{n:'The Long Harvest',slot:'weapon',r:6,st:{atk:9,cleave:.5,lifesteal:.03},icon:'scythe',c:['#5a5a64','#2a1a10','#9ac84a'],blade:'#cfe0a0',d:'A field scythe, sharpened for war.'},
  ashenmask:{n:'Ashen Mask',slot:'helm',r:6,st:{def:2,xpb:.1,stealth:.15},icon:'helm',c:['#8a8478','#3a3632'],pal:{H:'#8a8478',h:'#5a5650',j:'#2a2826',P:'#3a3632'},d:'A plain iron mask with eye slits.'},
});
Object.assign(UNIQ,{owlfeather:1,bellshard:2,hangrope:1,gravehands:1,widowlocket:2,pilgrimlegs:1,longharvest:3,ashenmask:2});
/* ---- sets ---- */
const SETS={
  wych:{n:"The Wychwarden's Vigil",t:1,pieces:['wy_helm','wy_armor','wy_shield','wy_amulet'],b:{2:{max:10},3:{regen:2},4:{tal_thick:1,tal_stalwart:2}},txt:{2:'+10 Max HP',3:'Regenerate 2 HP per turn',4:'+1 Thick Hide, +2 Stalwart'}},
  harrow:{n:"Harrow's Retinue",t:2,pieces:['hr_gloves','hr_legs','hr_belt','hr_blade'],b:{2:{atk:2},3:{crit:.06},4:{ini:2,tal_exec:1}},txt:{2:'+2 Attack',3:'+6% Critical chance',4:'+2 Speed, +1 Executioner'}},
  pen:{n:'The Penitent',t:1,pieces:['pn_boots','pn_charm','pn_amulet'],b:{2:{smite:3},3:{mmax:4,tal_mend:1}},txt:{2:'+3 Smite damage',3:'+4 Max MP, +1 Mend'}}};
Object.assign(ITEMS,{
  wy_helm:{n:"Wychwarden's Hood",slot:'helm',r:7,set:'wych',st:{def:3,max:8,mmax:3,thorns:1},icon:'helm',c:['#3e5a3e','#1a2a14'],pal:{H:'#3e5a3e',h:'#2a3e2a',j:'#1a2a14',P:'#6a8a4a'},d:'Woven from living bark. Small green shoots keep sprouting from it.'},
  wy_armor:{n:"Wychwarden's Bark",slot:'armor',r:7,set:'wych',st:{def:5,regen:1,max:7,crit:.03},icon:'armor',c:['#4a3a2a','#2a1a10','#6a8a4a'],pal:{S:'#4a3a2a',s:'#3a2a1a',d:'#2a1a10',r:'#3e5a3e',R:'#6a8a4a'},d:'Thick bark plates over leather. It creaks.'},
  wy_shield:{n:"Wychwarden's Ward",slot:'shield',r:7,set:'wych',st:{def:5,thorns:1,max:12,stagger:.08,rAll:.06},icon:'shield',c:['#4a3a2a','#2a1a10','#6a8a4a'],d:'A slab of heartwood studded with thorns.'},
  wy_amulet:{n:"Wychwarden's Seed",slot:'amulet',r:7,set:'wych',st:{mmax:4,max:7,regen:1,def:1},icon:'charm',c:['#6a8a4a','#2a1a10','#c9a24b'],d:'An acorn from the Elder, six hundred years old and still green.'},
  hr_gloves:{n:"Harrow's Grip",slot:'gloves',r:7,set:'harrow',st:{atk:2,crit:.05,ini:1,max:6},icon:'gloves',c:['#d8b048','#17130f','#ffe8a0'],d:'Gilded knuckles, worn smooth.'},
  hr_legs:{n:"Harrow's Cuisses",slot:'legs',r:7,set:'harrow',st:{def:3,ini:1,max:8,flee:.08},icon:'legs',c:['#d8b048','#17130f','#ffe8a0'],d:'Plate greaves with padded knees, made for kneeling in chapel.'},
  hr_belt:{n:"Harrow's Sash",slot:'belt',r:7,set:'harrow',st:{max:11,regen:1,def:2},icon:'belt',c:['#8a1a14','#2a0a08','#d8b048'],d:'A red silk sash, gone brown at the edges.'},
  hr_blade:{n:"Harrow's Oathblade",slot:'weapon',r:7,set:'harrow',st:{atk:9,crit:.05,lifesteal:.03,smite:2},icon:'sword',c:['#e8d8a8','#17130f','#d8b048'],blade:'#fff0c0',d:'Every knight of the retinue carried one. This one has never been drawn in a fight.'},
  pn_boots:{n:"Penitent's Steps",slot:'boots',r:7,set:'pen',st:{def:2,flee:.08,max:6,ini:1},icon:'boots',c:['#5a4a3a','#2a1a10'],d:'Leather soles stitched to bare foot-wraps. A pilgrim\'s.'},
  pn_charm:{n:"Penitent's Knot",slot:'charm',r:7,set:'pen',st:{smitec:1,mmax:3,max:5},icon:'rosary',c:['#d8cfb0','#3a2a1d','#8a2a2a'],d:'A knotted cord, one knot for each prayer.'},
  pn_amulet:{n:"Penitent's Ash",slot:'amulet',r:7,set:'pen',st:{smite:2,regen:1,mmax:2,max:5},icon:'charm',c:['#8a8478','#3a2a1d','#e8c85a'],d:'A pinch of grey ash in a glass bead, from a saint\'s pyre.'}});
for(const k in SETS)for(const p of SETS[k].pieces){const st=ITEMS[p].st;for(const q in st)if(typeof st[q]==='number'&&st[q]>0&&q!=='smitec'&&q!=='ini')st[q]=st[q]<1?Math.round(st[q]*1.25*100)/100:Math.round(st[q]*1.25)}
/* ---- tools & materials ---- */
const TOOLS={
  brand:{n:'Firebrand',icon:'torch',c:['#c8401a','#4a3424','#ffd870'],ow:'Burns away brambles.',bt:'In battle: sets every foe alight. Wood burns badly. Sometimes the fire catches you too.'},
  powder:{n:'Blasting Powder',icon:'bomb',c:['#3a3a40','#1a1a1c','#ff9a3a'],ow:'Blows open cracked rock.',bt:'In battle: heavy damage to every foe, and you take some of the blast.'},
  hook:{n:'Grappling Hook',icon:'hook',c:['#a8adb5','#5a4030','#d8dde3'],ow:'Pulls you across deep water.',bt:'In battle: tears away a foe\'s guard and breaks whatever it is winding up. Heavy foes may drag you down instead.'},
  bell:{n:'Wardbell',icon:'bell',c:['#c9a24b','#3a2a1d','#ffe8a0'],ow:'Use when nothing else is in reach. Reveals hidden things nearby and wakes whatever is pretending to be a tree.',bt:'In battle: may stagger every foe. It may also ring in your own head.'}};
Object.assign(TOOLS,{
  axe:{n:"Woodsman's Axe",icon:'axe',c:['#a8adb5','#5a4030','#c9a24b'],ow:'Chops through trees that have come down across the way.',bt:'In battle: one slow, heavy chop. Anything made of wood takes double.'},
  crowbar:{n:'Crowbar',icon:'crowbar',c:['#5a5e66','#2a2a2e','#c84a2a'],ow:'Prises the boards off barricaded passages, and off the doors of houses that were nailed shut.',bt:'In battle: lever its guard apart. Light damage, and for 2 turns it cannot block or parry.'},
  pole:{n:'Vaulting Pole',icon:'pole',c:['#8a6a3a','#4a3018','#c9a24b'],ow:'Vaults you over a narrow stretch of mire. Face it and use it.',bt:'In battle: a low sweep at their legs. Every foe is Slowed, and the light ones may go down.'},
  shovel:{n:'Shovel',icon:'shovel',c:['#8a8e96','#5a4030','#3a3a3e'],ow:'Digs through earthfalls. Mounds and loose earth give up more when you dig them properly.',bt:'In battle: a flat, ringing blow with the blade. Some damage, and a fair chance it loses its next turn.'},
  keys:{n:"Warden's Keys",icon:'key',c:['#c9a24b','#3a2a1d','#ffe8a0'],ow:'Opens the iron gates on the old walls, and the chests the King\'s men locked.',bt:'In battle: you jangle them. Anyone who serves the crown loses heart and is Weakened for 2 turns.'}});
/* one tool per map before each boss: [first map, second map] for each region */
const TOOL_MAP=[['axe','brand'],['crowbar','powder'],['pole','hook'],['shovel','keys']];
const toolArea=k=>TOOL_MAP.findIndex(a=>a.includes(k));
for(const k in TOOLS){const t=TOOLS[k];ITEMS['t_'+k]={n:t.n,tool:k,r:6,icon:t.icon,c:t.c,fx:t.ow+' '+t.bt,d:''}}
Object.assign(ITEMS,{
  ore1:{n:'Rough Ore',mat:1,r:2,v:10,icon:'ore',c:['#6a645c','#2c2b28','#a8a090'],fx:'Reinforces a weapon from +0 up to +3 at an anvil.',d:'Lumpy, dull, useful.'},
  ore2:{n:'Refined Ore',mat:2,r:3,v:25,icon:'ore',c:['#8a9aaa','#2a3038','#d8e8f0'],fx:'Reinforces a weapon from +3 up to +6 at an anvil.',d:'Smelted once already, by someone who knew how.'},
  ore3:{n:'Starmetal',mat:3,r:4,v:60,icon:'ore',c:['#6ab8e8','#1c2436','#e8f8ff'],fx:'Reinforces a weapon from +6 up to +9 at an anvil.',d:'A lump of star-iron. It stays cold in the hand.'},
  ironheart:{n:'Heart of Iron',mat:4,r:5,v:150,icon:'heart',c:['#a8adb5','#2a2a2a','#ff6a3a'],fx:'Reinforces a weapon from +9 to +10 at an anvil.',d:'A lump of iron the size of a heart, warm from the inside.'}});
const UPMAT=lv=>lv<=3?'ore1':lv<=6?'ore2':lv<=9?'ore3':'ironheart';
const UPN=lv=>lv>=10?1:[1,1,2][(lv-1)%3];
const oreFor=t=>t>=3?(chance(.3)?'ore3':'ore2'):t>=2?(chance(.6)?'ore2':'ore1'):t>=1?(chance(.25)?'ore2':'ore1'):'ore1';
/* ---- generation ---- */
let GEN=0;
const owned=()=>new Set([...P.bag.concat(P.stash).map(b=>ITEMS[b.id].uq||b.id),...Object.values(P.eq).filter(Boolean).map(id=>ITEMS[id].uq||id)]);
function affRoll(a,tier,q=0){const ta=q===2?tier:q===1?Math.ceil(tier/2)+((Math.random()*(tier-Math.ceil(tier/2)+1))|0):(Math.random()*(tier+1))|0,hi=a.v[ta]*(q===2?1.15:1),lo0=ta>0?a.v[ta-1]:a.v[0]*.5,lo=q===2?hi*.85:q===1?(lo0+hi)/2:lo0,fl=hi<1;let x=lo+Math.random()*(hi-lo);
  x=fl?Math.round(x*100)/100:Math.max(1,Math.round(x));if(!fl&&ta>0&&a.v[ta-1]<hi&&x<=a.v[ta-1])x=a.v[ta-1]+1;return{v:x,name:a.n[ta]}}
/* a unique found deeper than its home tier grows with it (+30% per tier), so an early unique isn't dead weight in area 4 */
function rollUnique(uid,tier){const b=ITEMS[uid],it=JSON.parse(JSON.stringify(b));it.uq=uid;it.um=(1.1+Math.random()*.8+(chance(.08)?1+Math.random():0))*(1+.3*Math.max(0,(tier==null?0:tier)-(UNIQ[uid]>3?3:UNIQ[uid])));
  for(const k in it.st){const v=it.st[k];if(typeof v!=='number'||k.startsWith('tal_')||['smitec','poisonImm','tool2','ini'].includes(k)||v<=0)continue;
    const x=v*it.um;it.st[k]=v<1?Math.round(x*100)/100:Math.max(1,Math.round(x))}
  const id='g'+(++GEN);ITEMS[id]=it;return id}
/* D2 rules: normal (sometimes superior) / magic: max 1 prefix + 1 suffix / rare: 3-6 affixes, max 3 of each / set / unique */
/* every slot equally likely; weapons and trinkets, the most telling pieces, 10% rarer */
const SLOT_W={weapon:.9,shield:1,helm:1,armor:1,legs:1,gloves:1,boots:1,belt:1,cloak:1,amulet:.9,ring:.9,charm:.9};
function wpick(W){let t=0;for(const k in W)t+=W[k];let x=Math.random()*t;for(const k in W){x-=W[k];if(x<=0)return k}return Object.keys(W)[0]}
/* a unique in a creature's own drop list still has to pass this: ~3% without magic find, so a bear gives up its skull about 1 time in 400 */
function uniqGate(){return .08*(1+3*((P.mf||0)+DIFF.mf))}
function genGear(tier,o={}){tier=clamp(tier|0,0,3);const mf=(P.mf||0)+(o.mf||0)+DIFF.mf,own=owned(),mn=o.min||1;
  /* uniques (0.15): about 1 gear drop in 80 at the start, 1 in 35 by the end, before magic find. They were ten times rarer, which meant never */
  if(!o.noU&&chance((.012+.006*tier)*(1+3*mf)*(o.boss?5:1))){const u=Object.keys(UNIQ).filter(id=>UNIQ[id]<=tier&&!own.has(id));if(u.length)return rollUnique(pick(u),tier)}
  if(!o.noU&&tier>=1&&chance((.01+.005*tier)*(1+mf)*(o.boss?4:1))){const s=[];for(const k in SETS)if(SETS[k].t<=tier)s.push(...SETS[k].pieces.filter(id=>!own.has(id)));if(s.length)return pick(s)}
  const slot=o.slot||wpick(SLOT_W);
  const w=[mn>1||slot==='charm'||slot==='ring'?0:60,mn>2?0:31*(1+mf*.5),9*(1+mf),2.2*(1+.3*tier)*(1+mf)*(o.boss?3:1),.45*(1+.5*tier)*(1+mf)*(o.boss?4:1)];for(let i=0;i<mn-1;i++)w[i]=0;if(o.max)for(let i=o.max;i<5;i++)w[i]=0;if(o.exact)for(let i=0;i<5;i++)w[i]=i===o.exact-1?1:0;
  let x=Math.random()*w.reduce((a,b)=>a+b,0),r=1;for(let i=0;i<5;i++){x-=w[i];if(x<=0){r=i+1;break}}
  const it={slot,r,st:{},tier,gen:1};
  if(slot==='weapon'){const wt=o.wt||pick(Object.keys(WEAP)),Wd=WEAP[wt];it.wt=wt;it.bn=Wd.names[tier];it.st.atk=Wd.atk[tier];Object.assign(it.st,Wd.st);it.icon=Wd.icon;it.c=MET[tier];it.blade=BLADE[tier];it.d=Wd.d}
  else{const A=ARM[slot];it.bn=A.names[tier];for(const k in A.st)if(A.st[k][tier])it.st[k]=A.st[k][tier];it.icon=slot==='charm'?pick(CHARM_ICONS):A.icon;it.c=slot==='ring'?[RING_METAL[tier],'#1a1208',pick(RING_GEM)]:slot==='cloak'?[['#5a4a3a','#2a2018','#8a7a5a'],['#3a4a5a','#1a2430','#7a8aa0'],['#5a2a2a','#2a1414','#a8584a'],['#2a3a2a','#141e14','#c9a24b']][tier]:slot==='charm'?pick([['#c9a24b','#3a2a1d','#ffe8a0'],['#8a7a5a','#3a2a1a','#d8cfb0'],['#6a8aa8','#1a2a3a','#d8f0ff'],['#8a3a5a','#2a1020','#f0a0c0']]):MET[tier];it.d=A.d;
    if(slot==='armor')it.pal=ARMPAL[tier];if(slot==='helm')it.pal=HELMPAL[tier]}
  addSockets(it,r);
  if(r===1){it.n=it.bn;return reg(it)}
  if(r===5)for(const k of['atk','def','max','mmax'])if(it.st[k]>0)it.st[k]+=Math.max(1,Math.round(it.st[k]*.3));
  const q=r===5?2:r===4?1:0;
  const has=new Set(),okS=a=>a.s.split(' ').includes(slot);let np=0,ns=0,pre=null,suf=null;
  const add=(pool,isPre)=>{const c=pool.filter(a=>okS(a)&&!has.has(a.k));if(!c.length)return false;const a=pick(c);has.add(a.k);const z=affRoll(a,tier,q);it.st[a.k]=(it.st[a.k]||0)+z.v;if(isPre){np++;pre=z.name}else{ns++;suf=z.name}return true};
  let total=r===2?1:r===3?pick([3,4,4,5,5,6]):r===4?pick([5,6]):6;
  if(r===5||(slot==='charm'&&chance(r>=3?.75:.5))){const sp=pick(SPEC);it.st[sp[0]]=Array.isArray(sp[1])?affRoll({v:sp[1],n:['','','','']},tier,q).v:sp[1];has.add(sp[0]);if(r>=3)total--;else ns=1}
  /* more gear carries a talent (0.15): three rares in ten, and the odd magic piece */
  if(!Object.keys(it.st).some(k=>k.startsWith('tal_'))&&chance(r>=3?.3:r===2?.06:0)){const tl=pick(SPEC.filter(x=>x[0].startsWith('tal_')));it.st[tl[0]]=1;has.add(tl[0]);if(r>=3)total--;else ns=1}
  if(r===2){const q=Math.random();if(!ns){if(q<.35){add(PRE,1);add(SUF,0)}else if(q<.67)add(PRE,1);else add(SUF,0)}else if(q<.5)add(PRE,1)}
  else{for(let t=0;t<20&&np+ns<total;t++){const wantPre=np<3&&(ns>=3||chance(.5));add(wantPre?PRE:SUF,wantPre)}}
  it.n=r===2?`${pre?pre+' ':''}${it.bn}${suf?' '+suf:''}`:r===5?`${pick(RA)}${pick(LGA)}, ${pick(LGB)}`:`${pick(RA)} ${pick(RB[slot])}`;return reg(it)}
const LGA=['bane','fall','song','ward','heart','mourn','reaver','thorn','brand','wake','grasp','veil'],LGB=['the Last Light','Oath of Ash','the Unbroken','Grief Eternal','the Long Night','Crown of Ruin','the Sleepless','Hope\'s End','First of the Fallen','Keeper of Embers','the Black Vow','Dawn\'s Debt'];
function reg(it){const id='g'+(++GEN);ITEMS[id]=it;return id}
/* talents granted by gear */
/* ================= GEMS AND SOCKETS (0.21) =================
   Weapons, armour, helms and shields can come with sockets: plain gear most often, rares seldom. Gems set into them at an anvil add
   their stat for good: one thing in a weapon, another in armour, as in Diablo II. Three grades of each gem. */
const GEMS={
  ruby:{n:'Ruby',c:['#d83a3a','#5a1010','#ffb0a0'],w:['atk',[1,2,4],'attack'],a:['max',[6,12,20],'health']},
  sapphire:{n:'Sapphire',c:['#3a6ad8','#10205a','#b0c8ff'],w:['crit',[.02,.04,.06],'critical chance'],a:['mmax',[3,6,10],'MP']},
  emerald:{n:'Emerald',c:['#3ab86a','#105a2a','#b0ffc8'],w:['bleedc',[.04,.08,.12],'bleed chance'],a:['dodge',[.015,.03,.05],'dodge']},
  topaz:{n:'Topaz',c:['#e8b83a','#5a4010','#fff0b0'],w:['gf',[.1,.2,.3],'gold find'],a:['mf',[.06,.12,.2],'magic find']},
  amethyst:{n:'Amethyst',c:['#a85ad8','#3a105a','#e8c0ff'],w:['acc',[.03,.06,.09],'accuracy'],a:['def',[1,2,4],'armour']},
  skull:{n:'Skull',c:['#d8d0c0','#3a3630','#ffffff'],w:['lifesteal',[.01,.02,.03],'life steal'],a:['regen',[1,1,2],'regeneration']}};
const GEMGR=['Rough','Cut','Perfect'];
const fmtG=(k,v)=>['crit','bleedc','dodge','gf','mf','acc','lifesteal'].includes(k)?Math.round(v*1000)/10+'%':''+v;
for(const g in GEMS)for(let i=0;i<3;i++){const G0=GEMS[g];ITEMS[`gem_${g}${i+1}`]={n:`${GEMGR[i]} ${G0.n}`,gem:g,gr:i,r:i+1,v:[15,45,120][i],icon:g==='skull'?'skullgem':'gem',c:G0.c,
  d:`Set in a weapon: +${fmtG(G0.w[0],G0.w[1][i])} ${G0.w[2]}. Set in armour, a helm or a shield: +${fmtG(G0.a[0],G0.a[1][i])} ${G0.a[2]}. Gems go into sockets at an anvil.`}}
const gemFor=t=>`gem_${pick(Object.keys(GEMS))}${t>=3?(chance(.5)?3:2):t===2?(chance(.4)?2:1):1}`;
const SOCKS=['weapon','armor','helm','shield'];
function addSockets(it,r){if(!SOCKS.includes(it.slot)||it.so)return;const p=r===1?.3:r===2?.18:r===3?.1:0;if(!chance(p))return;const mx=it.slot==='weapon'||it.slot==='armor'?3:2;it.so=Math.min(mx,1+(chance(.4)?1:0)+(chance(.15)?1:0));it.gems=[]}
function gemStat(it,gid){const G=ITEMS[gid],g=GEMS[G.gem],w=it.slot==='weapon'?g.w:g.a;return[w[0],w[1][G.gr]]}
const TALN={};for(const t in TAL)for(const n of TAL[t].nodes)TALN[n.id]=n;
const SKILLT=new Set(['twin','whirl','bash','mend']);
const iname=id=>{const it=ITEMS[id];return it.n+(it.up?` +${it.up}`:'')};

/* v8.3: vendor trash a quarter rarer; a little more dry wit */
for(const k in DROPS)for(const e of DROPS[k])if(ITEMS[e[0]]&&ITEMS[e[0]].junk)e[1]*=.75;
/* 0.15: consumables drop 60% less often (bosses' elixirs untouched) */
for(const k in DROPS)for(const e of DROPS[k])if(['potion','bandage','hallowed','bitterleaf','lampoil'].includes(e[0]))e[1]*=.4;
FL.table.push("A letter to the local lord asking for the tithe to be lifted. It was never sent.");
FL.wardrobe.push("A fine coat with every pocket turned out. Somebody had been through it already.");
FL.painting.push("A portrait of a dog in a ruff collar. A great deal of money was spent on this.");
FL.book.push("“Surviving the Wychwood.” A slim volume. There's a small cross drawn next to the author's name.");
FL.tent.push("A tent at the bottom of a slope, full of floodwater.");
FL.cart.push("A cart with a hand-painted sign: FRESH APPLES. The apples rotted months ago.");
AMBIENT_AREA.woods.push("A woodpecker hammers away at a dead trunk.");
AMBIENT_AREA.cave.push("Your footsteps echo back slightly out of time.");
AMBIENT_AREA.swamp.push("A frog stares at you from a stone and doesn't move.");
AMBIENT_AREA.plains.push("A crow follows you for a while, then loses interest.");
STUDY.bear.push(['m',"A bear, broad as a cart, turning over logs for grubs."]);
STUDY.golem.push(['m',"You knock on it. Nobody's home. Somehow that's worse."]);
STUDY.imp.push(['m',"One of them sticks its tongue out at you."]);
STUDY.wolf.push(['m',"It looks at you the way you look at a meal you can't quite afford."]);
TXT.woods.eps.push("HERE LIES GODRIC.\nHE DID NOT NEED A MAP.");
TXT.woods.signs.push("BEWARE OF THE BEAR\n\nUnderneath, smaller: “and the other bear”");
/* v9: new creatures — words, drops, trophies */
Object.assign(INTRO,{
  spider:["A spider the size of a dog drops from the canopy on a line of silk.","A spider the size of a dog runs down the web towards you."],
  stag:["A stag steps out of the trees, its ribs showing. Its eyes are milky.","Antlers come up out of the bracken, then the rest of it: thin, grey, mangy."],
  ghoul:["A ghoul looks up from what it was eating.","A ghoul unfolds from the dark, sniffing."],
  crawler:["The tunnel floor ripples. A pale, segmented thing pours out of a crack.","A Blind Crawler lifts its head and tastes the air, then turns straight to you."],
  leech:["A black ooze comes up out of the water.","A Bloodleech the length of your arm rises from the mud."],
  drowned:["The water parts and a drowned man walks out of it.","A drowned man, heavy with weed, wades towards you."],
  boar:["A boar crashes out of the long grass, tusks first.","Bristles, tusks and small, furious eyes."],
  strawman:["The scarecrow turns its head.","The scarecrow steps down from its post."]});
Object.assign(DIE,{
  spider:["The Webweaver curls its legs in and goes still."],stag:["The stag folds to the ground."],ghoul:["The ghoul goes down, still chewing."],
  crawler:["The Crawler thrashes, then lies flat."],leech:["The leech bursts in a spray of blood."],
  drowned:["The Drowned sinks back into the water."],boar:["The boar keels over with a last furious grunt."],strawman:["The Strawman comes apart in a heap of straw and rags."]});
Object.assign(STUDY,{
  spider:[['h',"Its web holds you fast. Bitterleaf won't help, but killing it quickly will."],['h',"Its bite is poisonous."],['f',"It has eight eyes."],['m',"You try to count its eyes and give up at six."]],
  stag:[['h',"When it lowers its antlers, raise your shield."],['f',"There is moss growing inside its ribs."]],
  ghoul:[['h',"It heals itself on spilled blood. Don't bleed near it."],['f',"It wears the remains of a miner's coat."]],
  crawler:[['h',"When it curls up, steel barely scratches it. Holy fire doesn't care."],['f',"It has no eyes. It doesn't seem to need them."]],
  leech:[['h',"It heals as it drinks, and the bites bleed."],['m',"You get a good look at it. You wish you hadn't."]],
  drowned:[['h',"Once it has hold of your legs, it drags you under. Don't let it keep you."],['f',"There is a wedding ring on its finger."]],
  boar:[['h',"When it scrapes the ground, a charge is coming. Guard."],['f',"Its skull is thick enough to turn an arrow. Hunters aim for the legs."]],
  strawman:[['h',"Straw and dry wood. It will burn."],['h',"There are crows inside it."],['f',"A scarecrow's sack head with a smile stitched on, badly."]]});
Object.assign(DROPS,{spider:[['silk',.4],['potion',.06]],stag:[['antler',.4],['potion',.08]],ghoul:[['finger',.3],['ring',.08],['potion',.08]],crawler:[['scrap',.3],['shard',.12],['ore1',.15]],
  leech:[['jelly',.2],['potion',.06],['bandage',.1]],drowned:[['locket',.15],['ring',.08],['potion',.1]],boar:[['tusk',.45],['potion',.06]],strawman:[['spoon',.2],['potion',.1],['hallowed',.1]]});
Object.assign(ITEMS,{
  silk:{n:'Spider Silk',junk:1,r:0,v:6,icon:'leaf',c:['#e8e8e8','#8a8a8a','#ffffff'],d:'A clump of web, tough as rope and very sticky.'},
  antler:{n:'Stag Antler',junk:1,r:0,v:14,icon:'axe',c:['#c8bca8','#5a5040','#e8dcc8'],d:'A dried mushroom cap, grey and brittle.'},
  tusk:{n:'Boar Tusk',junk:1,r:0,v:12,icon:'knife',c:['#f0e8d8','#6a5a4a','#ffffff'],d:'A boar\'s tusk, curved and yellow.'},
  boot:{n:'Old Boot',junk:1,r:0,v:1,icon:'boots',c:['#4a3a2a','#1a1008'],d:'An old boot, full of swamp water.'},
  bigturnip:{n:'Enormous Turnip',junk:1,r:0,v:80,icon:'heart',c:['#e8d8f0','#5a3a6a','#4a8a3a'],d:'A huge turnip. It would have won a prize at the fair.'},
  turnip:{n:'Turnip',use:'heal',heal:10,r:1,icon:'heart',c:['#e8d8f0','#5a3a6a','#4a8a3a'],fx:'Restores 10 HP.',d:'Raw, earthy and better than it looks.'}});
PRICE_U.turnip=6;
AMBIENT_AREA.woods.push("A web stretches across the path at head height. You duck under it.","An antler lies in the moss, snapped off clean.","The wind drops and the wood goes quiet.","Claw marks on a trunk, higher than you can reach. A bear's.","A crow's feather drifts down in front of you.","Mushrooms have come up in a line across the path.");
AMBIENT_AREA.cave.push("Far off, a pick strikes stone. Twice more, then it stops.","The air smells of wet iron and tallow.","A lantern hook hammered into the wall. The lantern's gone.","A cold draught comes up from somewhere below.","Small bones crunch underfoot. Rats, mostly.","Something drips on the back of your neck. It's warm.");
AMBIENT_AREA.swamp.push("Gas bubbles up through the water and the reeds lean away from it.","A snake slides off a log and into the water as you pass.","A light bobs out on the water, too low for a lantern.","The mud sighs.","A dead tree full of crows. They all turn to watch you pass.","The water here is still and black.");
AMBIENT_AREA.plains.push("A scarecrow stands in a field that's gone back to weeds.","The wind smells of rain.","A hawk circles, then gives up on you.","Old wheat stubble crunches underfoot.","A horse whinnies somewhere out of sight.","A wooden sign lies face down in the grass.");
/* ===== the story so far: your brother rules from the castle ===== */
const LORE={
 decrees:["BY ORDER OF THE KING\n\nThe roads are closed. The bells are silenced. Fires are to be lit only by royal permission.","BY ORDER OF THE KING\n\nAll who bear arms without the King's seal are oathbreakers, and shall be treated as such.","TITHE NOTICE\n\nOne part in three of all harvest, coin and kin is owed to the castle. Collectors will call.","BY ORDER OF THE KING\n\nThe Wychwood is closed. Its keeper is not to be disturbed. Anyone who disturbs it will be hanged.","BY ORDER OF THE KING\n\nThere is no famine. Those who speak of famine will be shown what one is.","BY ORDER OF THE KING\n\nThe old oaths are dissolved. There is one oath now, and it is to him.","BY ORDER OF THE KING\n\nThe castle gates are closed until further notice.\n\nUnderneath, in charcoal: “Nine years now.”","CURFEW\n\nNo one is to be on the roads after dark, by order."],
 wanted:["WANTED\n\nA crude drawing of a knight in a dented helm. It looks a lot like you.\n\nUnderneath: ALIVE, underlined three times.","WANTED, FOR OATHBREAKING\n\nThe drawing is of you, a few years younger. Someone has added a little crown, then scribbled it out.","SEEN THIS MAN?\n\nA drawing of you. Report sightings to the castle. Reward: two hundred crowns.","MISSING: THE KING'S BROTHER\n\nIf found, do not approach. Send word to the castle."],
 gallows:["BY ORDER OF THE KING\n\nHanged for harbouring an oathbreaker.\n\nThree names are listed below. The rain has washed them out.","BY ORDER OF THE KING\n\nHanged for ringing a bell.","BY ORDER OF THE KING\n\nHanged for saying the old King's name aloud.","BY ORDER OF THE KING\n\nHanged for asking where the tithes go."],
 letters:["A pigeon sits on the roost with a letter tied to its leg. The seal is the King's. Inside, in your brother's hand:\n\n“Come home and kneel, and the matter is ended.”","Another letter, in the same hand:\n\n“Our father's lords have sworn to me. Your cause is lost. Do not make me spend more lives on it.”","A letter in your brother's hand:\n\n“Our mother died in the spring. She lies beside our father in the chapel crypt. I thought you should know.”","A royal decree, nailed up and rained on:\n\n“Any who give bread or shelter to the King's brother shall answer for it before the King.”"],
 torn:["A notice board, stripped bare. Only the nails and the torn corners are left.","A notice board, scrubbed clean. Someone has carved into the wood: HE LIES.","A notice board crusted with old paper. The newest notice says only: OBEY.","A notice board, burned black. The fire was recent.","BY ORDER OF THE KING\n\nThe rest is too wet to read.","A royal notice, half eaten by rats. What's left says: “...shall be rewarded.”"],
 camp:["Among the ashes, a scrap of royal blue cloth and a broken spear. Soldiers camped here.","A half-burned warrant under the royal seal, for the arrest of the King's brother and all who ride with him.","Boot prints, a lot of them, all heading towards the castle.","A tower with a crown on it, carved into a stone, with an X carved through it."]};
FL.statue.push("THE KING, BELOVED.\n\nSomeone has chipped the nose off.","THE TWO PRINCES.\n\nOne of the stone boys has had his head knocked off.");
FL.painting.push("A portrait of two boys in armour far too big for them. One of them is you. The other's face has been painted over with a crown.","A portrait of the King, newly hung. Your brother sits in your father's chair and wears your father's crown.");
FL.book.push("“A Short History of the Succession,” newly bound and stamped with your brother's seal.");
TXT.woods.notes.push("A dead soldier in the King's colours. His orders, folded small:\n\n“Find the brother. Bring him to the castle. Do not harm the face.”");
TXT.plains.notes.push("A dead tax collector, his ledger still in his hand. Next to your family's name, a single word: EXEMPT.");
TXT.swamp.notes.push("A dead courier. The letter he carried is addressed to you, from the castle chaplain: “Come home, and come in peace. Enough blood has been spilled.”");
TXT.cave.notes.push("A dead miner, his pick still in his hand. Chalked on the wall beside him: THE KING TAKES THE IRON. THE KING TAKES THE MEN.");
AMBIENT_AREA.plains.push("On the horizon, a black tower. One window is lit.","A crow drops a scrap of royal blue cloth at your feet and flies off.");
AMBIENT_AREA.woods.push("Through a gap in the trees, very far off, you can see the castle.");
CROW_LINES.push("“Your brother's men shoot crows on the castle road. I keep away from it.”","“The castle pays for news of you. I have told them nothing.”");
DEATHP.push("Word reaches the castle. Your brother orders the bells rung.");
INTRO.harrow=["Lord Harrow rises from the grass. “His Majesty said you would come,” he says. “I am sorry for it.”"];
DIE.harrow=["Lord Harrow sinks to one knee. “Tell your brother I kept the field,” he says, and dies there."];
ITEMS.woodsword={n:'Wooden Sword',slot:'weapon',r:1,st:{atk:1,crit:.05},icon:'sword',c:['#a07a48','#3a2a1a','#c8a060'],blade:'#c8a060',d:'Two names are carved into the hilt, yours and your brother\'s.'};
