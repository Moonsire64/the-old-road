
/* ================= DATA ================= */
const KINDS={
  bat:{name:'Gloom Bat',ini:7,hp:10,atk:5,def:0,xp:7,spd:46,fly:1,aggro:3.6},
  mosquito:{name:'Bog Mosquito',ini:7,hp:14,atk:7,def:0,xp:8,spd:48,fly:1,aggro:3.6},
  slime:{name:'Marsh Slime',ini:1,hp:22,atk:6,def:1,xp:4,spd:20,aggro:4},
  shroom:{name:'Blightcap',ini:2,hp:24,atk:7,def:1,xp:5,spd:20,aggro:4},
  golem:{name:'Stone Golem',ini:0,hp:30,atk:7,def:5,xp:12,spd:13,aggro:3.5},
  ent:{name:'Rotwood Ent',ini:2,hp:46,atk:11,def:4,xp:18,spd:9,aggro:4},
  bear:{name:'Blackfur Bear',ini:3,hp:38,atk:10,def:2,xp:15,spd:40,aggro:5},
  brigand:{name:'Brigand',ini:6,hp:30,atk:10,def:3,xp:18,spd:42,aggro:6,human:1},
  vagrant:{name:'Vagrant',ini:4,hp:22,atk:7,def:2,xp:14,spd:32,aggro:5,human:1},
  knight:{name:'Oathbroken Knight',ini:3,hp:48,atk:12,def:6,xp:30,spd:30,aggro:6,human:1},
  imp:{name:'Imp',ini:5,hp:7,atk:2.6,def:0,xp:3},
  wolf:{name:'Wolf',ini:6,hp:13,atk:4.5,def:1,xp:6},
  spider:{name:'Webweaver',ini:6,hp:18,atk:6,def:1,xp:11,spd:44,aggro:4.5},
  stag:{name:'Hollow Stag',ini:6,hp:28,atk:8,def:2,xp:16,spd:52,aggro:5.5},
  ghoul:{name:'Ghoul',ini:5,hp:26,atk:8,def:1,xp:15,spd:40,aggro:5},
  crawler:{name:'Blind Crawler',ini:2,hp:36,atk:8,def:4,xp:18,spd:26,aggro:3.5},
  leech:{name:'Bloodleech',ini:3,hp:18,atk:6,def:0,xp:10,spd:24,aggro:3.5},
  drowned:{name:'The Drowned',ini:1,hp:34,atk:9,def:2,xp:18,spd:22,aggro:4},
  boar:{name:'Tusked Boar',ini:5,hp:30,atk:9,def:2,xp:16,spd:50,aggro:5},
  strawman:{name:'Strawman',ini:3,hp:30,atk:9,def:1,xp:20,ambush:1},
  elder:{name:'Wychwood Elder',ini:2,hp:180,atk:13,def:4,xp:90,boss:1},
  ooze:{name:'Cave Ooze',ini:1,hp:16,atk:5,def:2,xp:6,spd:16,aggro:3.5},
  colossus:{name:'Gloomcrystal Colossus',ini:1,hp:330,atk:15,def:8,xp:260,boss:1},
  rotmother:{name:'The Rot Mother',ini:2,hp:340,atk:16,def:3,xp:380,boss:1},
  harrow:{name:'Lord Harrow, the Last Oath',ini:5,hp:500,atk:19,def:7,xp:520,boss:1},
  imps:{pack:1,us:1.4,units:['imp','imp'],spd:34,aggro:4.5,name:'Imps'},
  wolves:{pack:1,units:['wolf','wolf'],spd:46,aggro:6,name:'Wolves'},
  brood:{pack:1,us:1.15,units:['slime','slime'],spd:22,aggro:4,name:'Slime Brood'},
  band:{pack:1,us:.75,units:['brigand','brigand'],spd:42,aggro:6,human:1,name:'Brigand Band'},
};
const UNIT_NAMES={imp:['Imp','Second Imp','Third Imp'],wolf:['Gaunt Wolf','Grey Wolf','Scarred Wolf'],slime:['Marsh Slime','Bog Slime','Mire Slime'],brigand:['Brigand','Cutthroat','Brigand Captain']};
const MODES={baby:{n:'Baby Mode',h:.6,a:.6,mf:0,hc:false,d:'Enemies are much weaker. When you die, you get back up at a fire.'},normal:{n:'Normal Mode',h:1,a:1,mf:0,hc:false,d:'The game as intended. Hard, but when you die you get back up at a fire, poorer and a little less experienced.'},man:{n:'Man Mode',h:1.35,a:1.25,mf:.25,hc:false,d:'Enemies are much tougher and every map has one fire fewer. Better loot. Death works as in Normal Mode.'},hardcore:{n:'Hardcore Mode',h:1.35,a:1.25,mf:.25,hc:true,d:'As Man Mode, but death is permanent. One life. Mortimer will not trade with you. He keeps count all the same.'}};
let DIFF=MODES.normal;
const AREA_PACK={woods:'wolves',cave:'imps',swamp:'brood',plains:'band'},AREA_LV=[1,6,11,16];
/* ---- no-repeat text helpers ---- */
const BAGS={},USED={};
function bagPick(key,arr){let b=BAGS[key];if(!b||!b.length){const last=b&&b.last;b=BAGS[key]=arr.slice().sort(()=>Math.random()-.5);if(b.length>1&&b[b.length-1]===last)b.unshift(b.pop())}const v=b.pop();b.last=v;return v}
function takeU(key,arr){const u=USED[key]||(USED[key]=new Set()),left=arr.filter(x=>!u.has(x));if(!left.length)return null;const v=left[(Math.random()*left.length)|0];u.add(v);return v}
const INTRO={
  bat:["A Gloom Bat drops out of the canopy.","A bat as wide as your arms unfolds from the branches above you.","A bat shrieks right by your ear."],
  mosquito:["A Bog Mosquito the size of a crow drifts out of the haze.","A high whine, then a weight on the back of your neck."],
  slime:["A Marsh Slime heaves itself out of the bog.","The mud in front of you sits up."],
  shroom:["A Blightcap tears itself out of the soil.","One of the mushrooms is walking towards you."],
  golem:["Moss-covered stones grind together and rise.","A heap of boulders shifts, and stands."],
  ent:["The tree beside you tears its roots out of the ground.","The bark splits down the middle and an eye opens in the gap."],
  bear:["A Blackfur Bear crashes out of the undergrowth.","A bear stands up out of the dark. It's taller than you."],
  brigand:["A Brigand steps onto the road, knife already drawn.","“Far enough,” says the Brigand."],
  vagrant:["A Vagrant lurches out of the ferns, muttering.","A gaunt man in rags blocks the path. His eyes won't settle on anything."],
  knight:["A knight in black iron stands in the road with his sword out.","An Oathbroken Knight turns towards you and draws."],
  imps:["Two imps spill out of a hollow log, sticks raised.","A knot of imps, giggling. They stop when they see you."],
  wolves:["Ghouls come out of the dark and spread out around you.","Wolves. Thin ones. Hungry ones."],
  brood:["A slime in the bog splits in two, then in two again.","The mud heaves in two places at once."],
  band:["Two Brigands step out of the grass, one on either side of you.","“Easy,” says one Brigand. The other is already circling behind you."],
  ooze:["A puddle on the cave floor rises to meet you.","A grey ooze slides down the wall and drops in front of you."],
  elder:["The great tree groans and every branch in the clearing creaks with it."],
  colossus:["What you took for crystals in the wall is a golem, and it stands up."],
  rotmother:["The largest mushroom in the fen opens its gills and exhales."],
  harrow:["A knight in gilded black rises from the grass and raises his sword in salute."],
};
const DIE={
  bat:["The Gloom Bat drops into the leaves.","The bat spirals down and lies still."],
  mosquito:["The mosquito bursts in a spray of blood.","The mosquito falls into the mud."],
  slime:["The Marsh Slime bursts with a wet slap.","The slime sags and spreads into the mud."],
  shroom:["The Blightcap collapses in a puff of spores.","The Blightcap topples and splits open."],
  golem:["The Stone Golem falls apart into ordinary rubble."],
  ent:["The Ent splits down the middle and goes still."],
  bear:["The bear slumps with a long, rattling breath."],
  brigand:["The Brigand falls and doesn't get up."],
  vagrant:["The Vagrant sags to the ground, still muttering about the trees."],
  knight:["The Oathbroken Knight kneels, and does not rise."],
  imp:["The @ pops like a candle going out.","The @ falls over and stays down."],
  wolf:["The @ goes down.","The @ crumples, whining."],
  ooze:["The ooze goes flat and stays flat."],
  elder:["The Wychwood Elder splits down the middle with a crack like a lightning strike, and the wood goes quiet."],
  colossus:["The Colossus comes apart crystal by crystal. Each one rings as it falls."],
  rotmother:["The Rot Mother collapses into a heap of spores. The fen goes quiet."],
  harrow:["Lord Harrow kneels and bows his head. “It is your right,” he says."],
};
// h = useful, f = flavour, m = the study gets nowhere
const STUDY={
  bat:[['h',"Its wings are thin. Holy fire would go straight through them."],['h',"It slips away from blades easily. Things it can't see coming are another matter."],['f',"It hangs back between bites, waiting for you to tire."],['m',"It won't hold still long enough to tell you anything."]],
  mosquito:[['h',"It heals itself on what it drinks. Kill it quickly or not at all."],['h',"Its bite festers. Bitterleaf will help."],['f',"Its belly is swollen and dark. It has fed recently."]],
  slime:[['h',"Its bile is the real danger. Bitterleaf clears it."],['f',"A wet green mass that smells like a sickroom."],['m',"You lean in close. It smells like a drain."]],
  shroom:[['h',"Its spores fog the mind. Bitterleaf, or a steady will, would help."],['f',"Its gills pulse slowly, in time with something that isn't your heartbeat."]],
  golem:[['h',"Stone on stone. Steel rings off it. Fire from above wouldn't care about stone."],['h',"When it draws its stones tight, your blade will barely scratch it."],['f',"Moss grows thick on one side. It stood still for a very long time before it moved."]],
  ent:[['h',"Old bark, dry as tinder. It would go up quickly if someone had fire."],['h',"Its roots never stop moving. Once they have your legs, you won't be running."],['f',"Count the rings and you'd reach the year you were born, and keep going."]],
  bear:[['h',"When it rears up, something heavy follows. Raise your shield."],['f',"There are arrowheads buried in its shoulder. Other hunters had the same idea."],['m',"You try to make yourself look bigger. It doesn't work."]],
  brigand:[['h',"His eyes keep drifting to your belt. Your potions aren't safe."],['f',"He has a farmer's hands, cracked and brown from years in the fields."]],
  vagrant:[['h',"His hands are full of dirt, and he's looking at your eyes."],['f',"He keeps muttering about “the thing under the trees”."]],
  knight:[['h',"When the greatsword goes up, it comes down. Guard."],['h',"Behind that shield, steel does little. Fire doesn't care about shields."],['f',"Black iron, and a crest that has been cracked down the middle."]],
  imp:[['h',"Weak alone. There are just a lot of them. Something that hits them all at once would help."],['f',"They're arguing about who gets your boots."]],
  wolf:[['h',"When one howls, the others grow bolder. Kill the loud one first."],['f',"Ribs like birdcages. They're as hungry as you are."]],
  ooze:[['h',"Its acid lingers like poison."],['f',"Mostly water and grit. It moves slowly and it doesn't stop."]],
  colossus:[['h',"Its crystal plates turn edges. A mace or hammer, or a crushing blow, will crack them off."],['h',"Every third turn the ceiling groans before it comes down. Raise your shield."],['h',"Crystal and stone. Steel does little. Holy fire doesn't care what you're made of."],['f',"Each crystal on its back hums a different note."]],
  rotmother:[['h',"She feeds on her own brood. Every slime of hers that lives, mends her."],['h',"When she swells, something wet and awful follows. A raised shield will keep most of it off."],['h',"Her spores poison and confuse. Bitterleaf clears both."],['f',"Every mushroom in the fen grew from her. She is as old as the fen itself."]],
  harrow:[['h',"He will call for help when he is hurt, and when he is nearly beaten he will stop defending himself entirely. That is when he is most dangerous, and most open."],['h',"When the sword goes up, Guard. He is very good at this."],['h',"His curse weakens your arm. Bitterleaf clears it."],['f',"His armour was gold once. He has waited in this field a long time."],['m',"“I swore to hold this field,” he says. “I will hold it.”"]],
  elder:[['h',"When it is hurt it calls its children out of the thorns. While they live, it is hard to hurt."],['h',"Fire stops it mending."],['h',"Every third breath it draws its roots up. Raise your shield when the ground shakes."],['h',"Its bark is ancient and dry. Fire would hurt it badly."],['h',"Its whispering rot weakens your arm. Bitterleaf clears it."],['f',"It is older than the road, and older than the kingdom."]],
};
const AMBIENT_AREA={
  woods:["Somewhere far off, a chapel bell is ringing for the dead.","The old road runs under the moss here. Your father's soldiers built it.","A wayside cross, bare of flowers. No one comes this way to pray any more.","The trees here were old when the first king was crowned.","Mist lies in the hollows, white and still.","A branch snaps somewhere behind you.","The birds have gone quiet.","A big animal crashes off through the trees.","Far off, a wolf howls. Another answers.","The wind carries a smell of old smoke.","An axe is going somewhere far off. Then it stops.","A gust brings a shower of leaves down.","Your lantern gutters, then steadies."],
  cave:["The tunnel walls are cut with the marks of a thousand picks. Men worked here for generations.","Far down in the dark, water falls into water.","A miner's prayer is carved over the arch: KEEP US, AND BRING US UP.","The air is still and very cold. Nothing has stirred it for years.","Water drips somewhere ahead.","Rats scatter away from your light.","Water ticks somewhere inside the rock.","A pebble rolls down from somewhere above you.","Cold air moves past you, from deeper in."],
  swamp:["The mist lifts for a moment. Drowned houses stand in the water, roofs and all.","A church tower rises out of the fen, its bell long gone.","Grave markers lean in the mud, their names worn away.","The water is black and very still.","A large shape turns over under the water.","The frogs fall silent all at once.","Bubbles rise from the bog and burst. The smell is terrible.","The mud pulls at your boots.","A heron lifts off and flaps away into the mist."],
  plains:["The fields lie fallow, and the farmhouses stand empty.","A row of fresh graves by the road, marked with sticks.","The castle towers stand against the sky, the colour of old bone.","Smoke rises from a village on the horizon. Too much smoke for cooking fires.","A long line of crows sits along a fence, silent.","Birdsong. You hadn't heard any in days.","The wind flattens the grass in long waves.","A cloud crosses the sun.","A bell rings once, far off.","The smell of hay drifts over from a barn somewhere."],
  inside:["A cold hearth, swept clean before the family left.","The crucifix over the door has been taken down. Its shape is still pale on the wall.","The floorboards settle.","Dust turns slowly in the air.","Rats in the walls, by the sound of it."]};
const REST=["You sit by the fire and say a prayer for the dead.","You keep watch over the fire until the stars turn.","You rest by the fire.","You sit by the fire until the ache goes out of your legs.","The fire is warm. You sleep a little.","You rest. Your legs stop shaking after a while."];
const KINDLE=["The fire catches.","You coax the old fire back to life.","The kindling takes, and the flames climb."];
const DEATHP=["The forest keeps what falls in it.","Your name is struck from the roll of knights.","No bell is rung for you.","The crows come down before nightfall.","No one comes looking.","By morning the leaves have covered you.","Your lantern rolls away and burns out in the moss."];
const LOADTXT=["The road goes on.","The trees close behind you.","The air changes.","Further in.","You crawl the last stretch in the dark.","Behind you, the trees go quiet."];
const DOORTXT=["The door sticks, then gives.","It's darker inside.","The hinges scream."];
const TXT={
  woods:{eps:["HERE LIES ALDRIC.\nHE WENT TO SEE WHAT\nWAS MAKING THAT NOISE.","SIR PELL.\nWE FOUND MOST OF HIM.","MAGDA,\nWHO KNEW A SHORTCUT.","BELOVED HUSBAND.\nHE SAID IT WAS\nONLY A TREE.","TOMAS, AGED NINE.\nHE WANDERED OFF.","HERE LIES A STRANGER.\nWE NEVER LEARNED HIS NAME.","THE BROTHERS OWEN AND RHYS.\nTOGETHER, AS ALWAYS.","HE KEPT THE ROAD\nFOR FORTY YEARS.\nTHEN THE ROAD KEPT HIM.","GONE INTO THE TREES.\nPRAY FOR THEM.","WE BURIED HER AT DUSK.\nBY MORNING THE GROUND\nHAD BEEN DISTURBED.","REST NOW.","ELSPETH, WOODCUTTER.\nSHE FELLED THE WRONG TREE."],
    signs:["ASHFORD — 9 MILES\n\nThe arrow points into the trees.","TURN BACK\n\nSomeone has scratched underneath: “we did”","THE ELDER SLEEPS. DO NOT WAKE IT.","WOODCUTTERS WANTED\n\nThe rest of the notice has rotted away.","KEEP TO THE ROAD\n\nThe road is mostly mud from here.","NO FIRES\n\nThe bottom of the post is burned black."],
    notes:["A dead knight slumped against a root. A note in his glove:\n\n“Day nine. Ate the last of the bread. Can hear them moving in the trees at night.”","A dead pilgrim. Her note:\n\n“If you find this, keep to the road and don't stop for the—”\n\nThe ink runs out.","A dead squire, still holding his sword. He died at the post he was given.","A dead woodcutter, his axe still stuck in a tree. The bark has grown over the head of it.","A dead hunter with an empty quiver. He spent every arrow before the end.","A dead man in a nightshirt, barefoot, a long way from any house.","A dead knight, face down. The crest on his shield belongs to one of the old houses that swore to your father.","A dead messenger. The letter in his bag reads: “Send no more men.”"]},
  cave:{eps:["OLD BRAM.\nHE WENT DEEPER.","CANARY.\nGOOD BIRD.","THE NIGHT SHIFT.\nALL OF THEM.","HOLLIS, FOREMAN.\nFIRST DOWN, LAST UP.","NAME UNKNOWN.\nFOUND IN SHAFT SIX.","HE HEARD SINGING\nIN THE ROCK.","IDA.\nSHE CARRIED THE LAMP.","DO NOT DIG HERE."],
    signs:["MIND THE DROP","SHAFT 3 — CLOSED\nBY ORDER OF THE GUILD","NO SINGING IN THE TUNNELS\n\nUnderneath: “it answers”","LAMPS LIT AT ALL TIMES","THIS WAY UP\n\nThe arrow has been painted over and redrawn, pointing down.","HEAD COUNT: 31\n\nThe board has not been touched since the day the mine flooded."],
    notes:["A dead miner. Scratched into the wall beside him:\n\n“DON'T DIG PAST THE RED SEAM”","A dead miner with a lantern long burned out. A dead canary lies in the cage beside him.","Two dead miners, back to back. One is holding the other's hand.","A dead foreman with a ledger. The last page is a list of names with lines through them.","A dead surveyor with a map of the tunnels, half of it in pencil, half in blood.","A dead girl in a miner's coat far too big for her. Her father's name is stitched inside the collar.","A dead man wedged into a crack in the rock. He must have been hiding."]},
  swamp:{eps:["OLD MOLL.\nSHE KNEW EVERY PATH\nTHROUGH THE FEN BUT ONE.","DROWNED.","HE ATE THE MUSHROOM.","BELOVED FROG.","SHE WENT FOR A SWIM\nAT NIGHT.","THE FERRYMAN.\nPAID IN FULL.","HERE LIES WHAT\nTHE BOG GAVE BACK.","AGNES, HERBWIFE.\nSHE HEALED HALF THE FEN.","NO NAME.\nNO FACE.","GONE TO THE MOTHER."],
    signs:["DO NOT DRINK THE WATER","HERE BE BOG\n\nThe sign is slowly sinking.","FERRY — 1 COPPER\n\nThere is no ferry.","STAY ON THE BOARDS","HERBS — ASK AT THE STILT HOUSE\n\nThe stilt house has no stairs any more.","THE MOTHER WATCHES"],
    notes:["A body half sunk in the mud, one arm up. The hand is holding a note:\n\n“The ground is softer than it looks.”","A dead herbalist with a basket of fen mushrooms. Half of them are the kind that kill.","A dead knight in rusted mail. In his hand is the roll of his company, every name struck through.","A dead fisherman, tangled in his own net, face down in the shallows.","A dead woman in a wedding dress, green with mould up to the knee.","A dead boy with a frog in a jar. You open the jar and let the frog go.","A dead hunter, covered in bites. His last arrow is still nocked."]},
  plains:{eps:["MERRICK.\nHE SAW THE SUN AND WEPT.","SHE PLANTED THE FLOWERS.\nTHEY OUTLIVED HER.","GONE TO THE CASTLE.\nNOT COMING BACK.","BELOVED HORSE.\nBETTER THAN MOST PEOPLE.","HARVEST, YEAR OF\nTHE GILDED OATH.\nNINETEEN NAMES.","HE FOUGHT FOR HARROW.\nHARROW WON.\nHE DID NOT.","THE MILLER'S BOY.\nHE CHASED THE BRIGANDS.","SHEPHERD.\nHIS FLOCK STILL WAITS.","HERE LIE THE LAST\nOF THE FAIR.","SOMEONE'S MOTHER."],
    signs:["WELCOME TO THE LOW FIELDS","LORD HARROW'S LAND\nTRESPASSERS WILL BE\n\nThe rest has been hacked away.","THE LAST LANTERN INN\nWARM BEDS · HOT FOOD","MILL — EAST","TOLL — PAY THE KNIGHT\n\nThe knight's name has been scratched out.","MARKET EVERY SEVENTH DAY\n\nNo one has kept count in years."],
    notes:["A dead farmer in a field gone to seed. His tithe receipt is folded inside his shirt.","A dead messenger. The sealed letter he carried says: “Hang the bearer.”","A dead shepherd. His sheep are grazing round him.","A dead brigand with a purse full of stones. His friends paid him off, by the look of it.","A dead knight in gilded armour, kneeling towards Harrow's field with his sword laid across his knees.","A dead miller, flour still on his hands. His note: “Somebody is using the mill at night.”","A dead girl, laid out with care under a crown of daisies."]}};
const FL={
  book:["“A Field Guide to the Wychwood.” The margins are full of someone's notes: which paths flood, which ones have wolves.","“On Hope.” Someone has used most of the pages to light fires.","“The Elder Sleeps: A Lullaby.” A cradle song from the forest villages, older than the kingdom.","“Mushrooms of the Fen.” Most entries are marked with a skull.","“Accounts, Year of the Long Rain.” The last forty pages are lists of what the flood took.","A diary. The last pages are the same prayer, written out again and again.","“Prayers for the Lost.” The spine is cracked open at the prayer for drowned men.","“How to Speak with Crows.” One line is underlined: “They will lie to you, but only for profit.”","“A History of the Kingdom, Volume Nine.” The last chapter tells of your father's coronation.","A book of pressed flowers, every one labelled in a careful hand.","“The Oath of the Road.” Every knight of the realm swears it when he takes up the sword. You swore it at fifteen.","A child's primer. The letters are all drawn as trees.","“Of Bells and Their Order.” Most of it has rotted. One line survives: “lowest first, then highest, then the two between.”"],
  table:["Two plates of mould. One chair knocked over.","A letter to a sister in the next village, begging her to come and take the children.","Dice on the table, and a few coins, left in the middle of a game.","Carved into the wood: the names of the family's dead, with the year beside each one.","A map of the area, marked with the places the soldiers camped.","Candle stubs, and a child's drawing of a tree with a face.","A bowl of cold stew with the spoon still standing in it.","A knife, a whetstone and a list of debts owed to the house."],
  wardrobe:["Clothes for someone taller.","A moth flies out and bumps against your face.","Empty. It smells of lavender.","A child's coat, folded very neatly.","A cloak with the crest cut out of it."],
  painting:["A portrait of a stern woman. Her eyes have been scratched out.","A landscape of these woods, green and sunlit.","A knight on a grey horse, painted by someone who liked horses more than knights.","A still life of fruit, painted from memory.","A family of five. The paint has been scraped away from one of them."],
  fireplace:["Cold ash, full of half-burned paper.","The chimney moans when the wind gets up.","A half-burned letter: “...and not to come back for me.”"],
  altar:["You kneel and say the old words.","A candle in a dish, burned down to the last inch.","The altar cloth is embroidered with a sun, the gold thread picked out."],
  counter:["A ledger of debts. Nobody has paid anything in a year.","A bell for service. You ring it. Dust comes down from the rafters."],
  shrine:["A small roadside shrine. Somebody has left a fresh candle burning.","You kneel and pray for a while."],
  statue:["SIR ALDOUS, WHO HELD THE ROAD.\n\nThe statue's face has worn smooth.","TO THE FALLEN.\n\nThe last row of names is still being added to, in chalk.","A woman holding a lantern. Someone has put a real lantern in her hand.","IN MEMORY OF THE LAST GOOD HARVEST.","A kneeling knight. The plaque has been chiselled away.","A child with a bird on her hand. The bird has been knocked off.","A tall hooded figure. Whatever the plaque said, it's been prised away.","THEY WENT DOWN SO THAT OTHERS WOULD NOT HAVE TO."],
  cage:["Bones in a hanging cage, and a spider that has made a home of the ribs.","An empty cage. The door has been forced.","A cage creaking on its chain."],
  totem:["Bones, feathers and twine, bound together with great care.","A post hung with bones, with eyes painted on it in white."],
  tent:["A bedroll, a cold pot and a journal. The last entry: “Tomorrow, the road.”","Two bedrolls, and a pot still warm on the ashes. Whoever slept here left fast.","A collapsed tent with a single boot sticking out.","A tent full of drying herbs, all crumbled to dust."],
  cart:["A wagon with one wheel gone.","An overturned cart. Whatever it carried was taken long ago.","A cart loaded with empty coffins."],
  boat:["A rowboat with a hole in the bottom.","A boat sunk to the gunwales. Fish dart out from under it.","A flat-bottomed punt, the pole still in it."],
  minecart:["A mine cart full of ore. Nobody came back for it.","A mine cart tipped on its side. A cold lantern lies underneath."],
  scare:["A scarecrow with its mouth stitched shut.","A scarecrow in a knight's tabard, faded past colour."],
};
const CROW_LINES=["“Mortimer. I trade. Coin for things, things for coin.”","“A fire knows who lit it.”","“Some of the trees by the road are not trees. Keep your distance.”","“I don't ask where things come from.”","“Ring the low bells first.”","“Each place has something at its heart, bigger than the rest. Be ready before you go to it.”","“When it raises its arm, raise your shield.”","“Most knights who come this way do not come back.”"];
const FROG_LINES=["“I am the King of this Fen,” says the frog. “Kneel.”","“I was a man once, and a prince. That was a long time ago.”","“The Mother sleeps in the deep water. Leave her be, if you can.”","“Flies,” says the King, “are the only honest creatures left.”"];
const EXIT_TXT=["A passage slopes down into the dark. Cold air comes up it.","A long climb up through wet stone. At the top, grey light and the smell of rot.","The trees thin. Beyond them, daylight."];
const BACK_TXT=["The tunnel climbs back towards the woods.","The path drops back down towards the tunnels.","The trees close in again, back towards the fen."];
/* ---- items ---- r: 0 junk 1 common 2 uncommon 3 rare 4 epic 5 legendary ---- */
const RARITY=[{n:'Junk',c:'#8a8a8a'},{n:'Common',c:'#e6e6e6'},{n:'Uncommon',c:'#5fd35f'},{n:'Rare',c:'#4a9eff'},{n:'Epic',c:'#b55cff'},{n:'Legendary',c:'#ff8c1a'}];
const ITEMS={
  notched:{n:'Notched Sword',slot:'weapon',r:1,st:{atk:1},icon:'sword',c:['#8b9099','#3a2a1d','#6d5a33'],blade:'#b8bcc2',d:'Older than you. It has been sharpened too many times.'},
  arming:{n:'Arming Sword',slot:'weapon',r:1,st:{atk:3},icon:'sword',c:['#d0d5db','#3a2a1d','#c9a24b'],blade:'#eef2f6',d:'Plain and well balanced. It\'s been kept sharp.'},
  axe:{n:'Bearded Axe',slot:'weapon',r:2,st:{atk:5,crit:-.03},icon:'axe',c:['#a8adb5','#4a3424'],blade:'#d0d5db',d:'Heavy in the head. It pulls your arm round after every swing.'},
  knife:{n:"Brigand's Knife",slot:'weapon',r:3,st:{ini:2,atk:5,crit:.15,bleedc:.25,gf:.15},icon:'knife',c:['#c8ccd2','#24180f','#7a2020'],blade:'#e0e4e8',d:'Short and mean. A cutpurse\'s knife.'},
  longsword:{n:'Longsword',slot:'weapon',r:3,st:{atk:6},icon:'sword',c:['#e4e8ec','#24180f','#c9a24b'],blade:'#ffffff',d:'A real knight\'s blade, forged in the castle smithy.'},
  tolling:{n:'Tolling Blade',slot:'weapon',r:4,st:{atk:7,stagger:.15},icon:'sword',c:['#c8a24b','#3a2a1d','#ffd870'],blade:'#ffe8a0',d:'Forged from a melted bell. Every blow rings, and the ringing throws foes off balance.'},
  oathbreaker:{n:'Oathbreaker',slot:'weapon',r:4,st:{atk:8,lifesteal:.2},icon:'sword',c:['#3a3a44','#140e09','#a01c14'],blade:'#ff5a3a',d:'Black steel. Each wound it opens gives you back a little.'},
  heartmaul:{n:'Heartwood Maul',slot:'weapon',r:5,st:{atk:10,smite:4},icon:'maul',c:['#5a4030','#2b1e15','#ff6a24'],blade:'#ffb070',d:'Cut from the Elder itself. The wood is still warm.'},
  buckler:{n:'Splintered Buckler',slot:'shield',r:1,st:{def:1},icon:'shield',c:['#5a4030','#3a2a1d','#6d6a58'],d:'More splinter than buckler.'},
  kite:{n:'Kite Shield',slot:'shield',r:2,st:{def:2,max:4},icon:'shield',c:['#6e1818','#3a2a1d','#c9a24b'],d:'A round shield. The painted crest has worn away.'},
  tower:{n:'Tower Shield',slot:'shield',r:3,st:{ini:-1,def:4,flee:-.15},icon:'shield',c:['#5c5f66','#2e3036','#8b9099'],d:'A tall shield, heavy enough that you\'ll walk rather than run.'},
  blackshield:{n:'Black Iron Shield',slot:'shield',r:4,st:{def:4,thorns:2},icon:'shield',c:['#2b2b33','#17171c','#a01c14'],d:'A shield covered in iron spikes.'},
  capleather:{n:'Leather Cap',slot:'helm',r:1,st:{def:1},icon:'helm',c:['#6a4a2e','#2e1e12'],pal:{H:'#6a4a2e',h:'#4a321e',j:'#2e1e12',P:'#4a321e',e:'#c8a888'},d:'A dead man\'s cap, still greasy inside.'},
  bascinet:{n:'Bascinet',slot:'helm',r:2,st:{def:2,max:4},icon:'helm',c:['#b8bcc2','#40444b'],pal:{H:'#cfd4da',h:'#8b9099',j:'#50555e',P:'#9c2a24'},d:'A rounded steel cap with a visor and a red plume.'},
  greathelm:{n:'Great Helm',slot:'helm',r:3,st:{def:3,max:6},icon:'helm',c:['#d0d4da','#50555e'],pal:{H:'#d6dade',h:'#8a8e96',j:'#44484f',P:'#d8d0b8'},d:'A full great helm. Hard to cut through and hard to see out of.'},
  bearskull:{n:'Bearskull Helm',slot:'helm',r:4,st:{atk:2,def:2,max:8},icon:'helm',c:['#d8cfb0','#4e3828'],pal:{H:'#d8cfb0',h:'#9a917a',j:'#4e3828',P:'#33241a',e:'#ffab2e'},d:'The bear\'s skull, with the jaw cut away so you can see out.'},
  gambeson:{n:'Gambeson',slot:'armor',r:1,st:{def:1},icon:'armor',c:['#8a7a5a','#4a3c2a','#5e1616'],pal:{S:'#8a7a5a',s:'#6a5a40',d:'#3e3424'},d:'Quilted cloth, stained at the seams.'},
  hauberk:{n:'Mail Hauberk',slot:'armor',r:2,st:{def:3},icon:'armor',c:['#a8adb5','#50555e','#9c2a24'],pal:{S:'#b4b9c0',s:'#7a7f87',d:'#454950'},d:'Ten thousand rings, each riveted by hand.'},
  brigandine:{n:'Brigandine',slot:'armor',r:3,st:{def:4,max:6},icon:'armor',c:['#6a4430','#2a1a10','#c9a24b'],pal:{S:'#6a4430',s:'#4a2e20',d:'#2a1a10',r:'#26382a',R:'#3e5a3e'},d:'Steel plates riveted inside leather. It has had several owners.'},
  oathplate:{n:'Oathbroken Plate',slot:'armor',r:4,st:{ini:-1,def:6,max:4},icon:'armor',c:['#3a3a44','#17171c','#4d1111'],pal:{S:'#4a4a56',s:'#2b2b33',d:'#17171c',r:'#240a0a',R:'#4d1111'},d:'Black iron plate, taken off an Oathbroken Knight. The straps were cut to get it off him.'},
  boots:{n:'Worn Boots',slot:'boots',r:1,st:{},icon:'boots',c:['#4a3424','#24180f'],d:'Good boots, resoled at least twice.'},
  wolfhide:{n:'Wolfhide Boots',slot:'boots',r:2,st:{ini:2,speed:.15,flee:.15},icon:'boots',c:['#6d6a58','#3a3830'],d:'Wolfskin, fur side in. Warm and quiet.'},
  sabatons:{n:'Iron Sabatons',slot:'boots',r:3,st:{ini:-1,def:2},icon:'boots',c:['#a8adb5','#40444b'],d:'Heavy plate boots. Every step rings.'},
  battooth:{n:'Bat-Tooth Necklace',slot:'charm',r:2,st:{crit:.06},icon:'charm',c:['#e6dccb','#3a2a1d','#ff3b2a'],d:'A string of wolf teeth on a gut cord.'},
  slimeglass:{n:'Slime-Glass Vial',slot:'charm',r:3,st:{poisonImm:1},icon:'vial',c:['#5e7426','#2a1a10','#cfd59a'],d:'A toad\'s bile sac, dried hard. Poison doesn\'t take on you while you wear it.'},
  golemheart:{n:'Golem Heart',slot:'charm',r:3,st:{def:2,max:10},icon:'heart',c:['#6a6a64','#2c2b28','#6fd0ff'],d:'A heavy stone pendant. It steadies your breathing.'},
  candle:{n:'Blessed Candle',slot:'charm',r:3,st:{mmax:5,smite:3},icon:'candle',c:['#e8dcc0','#3a2a1d','#9fdcff'],d:'It never burns down. Nobody in the village knows who blessed it.'},
  rosary:{n:'Moss Rosary',slot:'charm',r:3,st:{regen:2},icon:'rosary',c:['#4a7a3a','#1a2a14','#c9a24b'],d:'A string of moss beads, still growing.'},
  ember:{n:'Ember of the First Fire',slot:'charm',r:5,st:{mmax:5,smite:3,regen:1,crit:.05},icon:'candle',c:['#ffb040','#3a1a0a','#fff0b0'],d:'The fire everything else was lit from. It has been burning since the forest was young.'},
  warhammer:{n:'Bell-Ringer Warhammer',slot:'weapon',r:4,st:{atk:9,stagger:.1,crit:-.03},icon:'maul',c:['#8a8e96','#3a2a1d','#c9a24b'],blade:'#d8dde3',d:'A heavy hammer. You can hear every swing coming.'},
  aegis:{n:'Pilgrim\'s Aegis',slot:'shield',r:4,st:{def:5,max:10},icon:'shield',c:['#d8d0b8','#5a4a3a','#4a7ab8'],d:'A pilgrim\'s shield painted with the road-saint, its rim worn down by miles of road.'},
  wardenhelm:{n:'Warden\'s Helm',slot:'helm',r:4,st:{def:4,max:10},icon:'helm',c:['#5a6a7a','#2a3038'],pal:{H:'#6a7a8a',h:'#4a5662',j:'#2a3038',P:'#2a5a8a'},d:'Worn by the wardens of the old mines, who kept the deep tunnels shut.'},
  dawnplate:{n:'Plate of the Last Dawn',slot:'armor',r:4,st:{ini:-1,def:7,max:8},icon:'armor',c:['#e8d8a8','#7a6a3a','#d8a24a'],pal:{S:'#e8dcb4',s:'#b0a070',d:'#6a5a30',r:'#d8a24a',R:'#ffe08a'},d:'Polished until you can see your face in it, but there\'s no dawn left for it to catch.'},
  stormboots:{n:'Stormstrider Boots',slot:'boots',r:4,st:{ini:3,def:2,speed:.2,flee:.2},icon:'boots',c:['#4a6a8a','#1a2a3a'],d:'Light as cloth. You could run all day in them.'},
  eyecharm:{n:'The Open Eye',slot:'charm',r:4,st:{crit:.1,lifesteal:.08},icon:'charm',c:['#e8e4d8','#3a2a1d','#4ae8a8'],d:'A glass eye on a chain. With it on, you see where to hit.'},
  crystalblade:{n:'Gloomcrystal Blade',slot:'weapon',r:5,st:{atk:12,stagger:.2},icon:'sword',c:['#6ab8e8','#1c2436','#e8f8ff'],blade:'#bfeaff',d:'A shield of grown crystal. It rings like a bell when struck.'},
  rotcrown:{n:'Crown of Rot',slot:'helm',r:5,st:{def:4,max:16,poisonImm:1,regen:1},icon:'helm',c:['#5e2a70','#2a1030'],pal:{H:'#5e2a70',h:'#3a1a4a',j:'#1a0a22',P:'#9ac84a',e:'#ff5ae8'},d:'Fen mushrooms have grown all over it.'},
  lastoath:{n:'The Last Oath',slot:'shield',r:5,st:{def:7,thorns:3,max:10},icon:'shield',c:['#d8b048','#17130f','#ffe8a0'],d:'Lord Harrow\'s shield, black and gold, dented all over.'},
  potion:{n:'Potion',use:'heal',r:1,icon:'vial',c:['#a8322a','#2a1a10','#ff9a8a'],fx:'Restores 45% of your health.',d:'Red and thick. It tastes of iron and honey.'},
  elixir:{n:'Elixir',use:'full',r:3,icon:'vial',c:['#e8c84a','#2a1a10','#fff4c0'],fx:'Restores all health and MP and clears every affliction.',d:'A gold flask, warm to the touch.'},
  hallowed:{n:'Hallowed Water',use:'mp',r:2,icon:'vial',c:['#5f93bd','#2a1a10','#cfeaff'],fx:'Restores 10 MP.',d:'Water drawn from a shrine, ice cold.'},
  bitterleaf:{n:'Bitterleaf',use:'cure',r:1,icon:'leaf',c:['#4a7a3a','#1a2a14','#8fc06a'],fx:'Clears poison, daze, blindness, roots and withering.',d:'Chewed raw. It tastes awful and clears the head.'},
  lampoil:{n:'Lamp Oil',use:'oil',r:2,icon:'oil',c:['#8a6a2a','#2a1a10','#ffd870'],fx:'Battle only. Thrown: burns every foe for fire damage and sets them alight. Wooden things burn better.',d:'A stoppered flask of lamp oil. Thrown, it burns.'},
  bandage:{n:'Bandage',use:'bandage',r:1,icon:'leaf',c:['#e8e0c8','#6a5a40','#a01818'],fx:'Stops bleeding.',d:'Clean linen strips. Stops bleeding.'},
  rock:{n:'Rock',junk:1,r:0,v:1,icon:'heart',c:['#6a6a64','#2c2b28','#7a7a72'],d:'A fist-sized rock.'},
  spoon:{n:'Bent Spoon',junk:1,r:0,v:3,icon:'knife',c:['#8a8a84','#3a3a36','#8a8a84'],d:'Bent nearly double.'},
  letter:{n:'Unsent Letter',junk:1,r:0,v:2,icon:'leaf',c:['#d8cfb0','#6a6a5a','#8a2a1a'],d:'A letter home to someone\'s mother. It was never sent.'},
  rabbit:{n:"Rabbit's Foot",junk:1,r:0,v:6,icon:'leaf',c:['#d8d0c0','#5a4a3a','#8a7a6a'],d:'A rabbit\'s foot on a string.'},
  duck:{n:'Wooden Duck',junk:1,r:0,v:5,icon:'heart',c:['#c8a24b','#5a4030','#e8402a'],d:'A wooden horse, the paint worn off by small hands.'},
  finger:{n:'Fingerbone',junk:1,r:0,v:4,icon:'knife',c:['#d8cfb0','#6a6450','#d8cfb0'],d:'A severed finger, dried. Some charlatan\'s charm.'},
  shard:{n:'Gloomcrystal Shard',junk:1,r:0,v:28,icon:'vial',c:['#6ab8e8','#1c2436','#d8f4ff'],d:'A sliver of crystal from the deep. It hums when you hold it.'},
  tinycrown:{n:'Tiny Crown',junk:1,r:0,v:60,icon:'helm',c:['#c9a24b','#5a4a2a'],d:'Real gold, made for a very small head.'},
  button:{n:'Brass Button',junk:1,r:0,v:8,icon:'heart',c:['#c8a24b','#5a4a2a','#ffe8a0'],d:'A silver button stamped with a crest you don\'t recognise.'},
  wing:{n:'Bat Wing',junk:1,r:0,v:3,icon:'leaf',c:['#3a2a3a','#140e14','#6a4a5a'],d:'Thin as paper. Some apothecaries still buy them.'},
  pelt:{n:'Wolf Pelt',junk:1,r:0,v:12,icon:'armor',c:['#6d6a58','#3a3830','#8a8670'],d:'Mangy, but warm.'},
  claw:{n:'Bear Claw',junk:1,r:0,v:16,icon:'knife',c:['#2a2420','#0e0c0a','#d8cfb0'],d:'As long as your finger, and still sharp.'},
  jelly:{n:'Slime Jelly',junk:1,r:0,v:4,icon:'vial',c:['#5e7426','#2a1a10','#cfd59a'],d:'It wobbles. Some alchemists pay for it.'},
  spores:{n:'Spore Sac',junk:1,r:0,v:7,icon:'heart',c:['#a4b098','#4a5040','#f0dd48'],d:'A ripe spore sac. Mortimer buys them.'},
  scrap:{n:'Iron Scrap',junk:1,r:0,v:9,icon:'shield',c:['#6a6a6a','#2a2a2a','#8a8a8a'],d:'Twisted iron. A smith would melt it down.'},
  ring:{n:'Tarnished Ring',junk:1,r:0,v:30,icon:'charm',c:['#c9a24b','#3a2a1d','#8a6a3a'],d:'Engraved on the inside: “Always.”'},
  locket:{n:'Empty Locket',junk:1,r:0,v:22,icon:'charm',c:['#d8d0b8','#3a2a1d','#a8a090'],d:'An empty locket.'},
  dice:{n:'Bone Dice',junk:1,r:0,v:9,icon:'heart',c:['#e8e0c8','#5a5040','#1a1410'],d:'Weighted, badly.'},
  pipe:{n:'Clay Pipe',junk:1,r:0,v:5,icon:'knife',c:['#d8c8a8','#5a4a3a','#3a2a1a'],d:'The bowl still smells of tobacco.'},
  candlestub:{n:'Candle Stub',junk:1,r:0,v:2,icon:'candle',c:['#d8cfb0','#3a2a1d','#6a6450'],d:'Nearly burned down.'},
  horn:{n:'Hunting Horn',junk:1,r:0,v:20,icon:'heart',c:['#c8b088','#4a3424','#8a6a3a'],d:'Cracked. It won\'t sound again.'},
};
const JUNK=['rock','spoon','letter','rabbit','duck','finger','button','ring','locket','dice','pipe','candlestub','horn','scrap'];
const PRICE_R=[0,35,85,200,450,980],PRICE_U={bandage:18,potion:45,hallowed:55,bitterleaf:28,lampoil:60,elixir:280};
const buyPrice=id=>{const it=ITEMS[id];return it.junk?it.v:it.mat?it.v*3:PRICE_U[id]||Math.round(PRICE_R[it.r]*(1+.35*(it.tier||0))*(it.sup?1.4:1)+(it.up||0)*30)};
const sellPrice=id=>{const it=ITEMS[id];return it.junk?Math.max(1,Math.round(it.v*.5)):it.tool?0:it.mat?Math.round(it.v*.6):Math.max(1,Math.round(buyPrice(id)*.18))};
const POOLS=[['arming','buckler','capleather','wolfhide','kite','hauberk','battooth'],['axe','kite','bascinet','hauberk','sabatons','battooth','candle','wolfhide'],['longsword','tower','greathelm','brigandine','golemheart','rosary','candle','sabatons'],['warhammer','aegis','wardenhelm','dawnplate','stormboots','eyecharm','longsword','brigandine']];
const DROPS={bat:[['wing',.35],['battooth',.04],['potion',.06]],mosquito:[['bitterleaf',.15],['wing',.25],['potion',.06]],slime:[['jelly',.4],['slimeglass',.05],['bitterleaf',.15]],shroom:[['spores',.4],['bitterleaf',.2],['potion',.06]],golem:[['scrap',.4],['shard',.15],['golemheart',.06],['sabatons',.06],['potion',.12]],ent:[['rosary',.08],['lampoil',.2],['hallowed',.12]],bear:[['claw',.5],['bearskull',.08],['wolfhide',.08],['potion',.2]],brigand:[['knife',.1],['capleather',.08],['dice',.2],['pipe',.15],['potion',.2],['lampoil',.12]],vagrant:[['candle',.05],['hallowed',.2],['letter',.2],['candlestub',.2]],knight:[['oathbreaker',.1],['blackshield',.1],['oathplate',.07],['greathelm',.08],['ring',.25],['potion',.3]],imp:[['button',.15],['spoon',.12],['potion',.05]],wolf:[['pelt',.3],['wolfhide',.05],['potion',.05]],elder:[['heartmaul',1],['elixir',1]],ooze:[['jelly',.3],['shard',.15],['bitterleaf',.12]],colossus:[['crystalblade',1],['elixir',1]],rotmother:[['rotcrown',1],['elixir',1]],harrow:[['lastoath',1],['elixir',1]]};
const GOLD={brigand:[8,16],vagrant:[2,7],knight:[14,28],imp:[1,4],elder:[90,90],colossus:[160,160],rotmother:[230,230],harrow:[320,320]};

/* ---- talents ---- */
const TAL={
  blade:{name:'Blade',col:'#d86a5a',nodes:[
    {id:'keen',name:'Keen Edge',max:3,req:0,desc:'+2 Attack and +2% critical chance per rank.'},
    {id:'riposte',name:'Riposte',max:1,req:2,desc:'The Slash after a Guard strikes 70% harder and cannot miss.'},
    {id:'bleed',name:'Bloodletting',max:2,req:3,desc:'+4% critical chance per rank, and your critical hits leave the foe bleeding for 2 turns.'},
    {id:'twin',name:'Twin Cut',max:1,req:4,desc:'New skill. Two quick cuts at 55% power each. 3 MP.'},
    {id:'hamstring',name:'Hamstring',max:1,req:5,desc:'Slashes have a 25% chance to cripple the foe, cutting its damage by 30% for 2 turns.'},
    {id:'exec',name:'Executioner',max:1,req:6,desc:'Deal 40% more damage to foes below 35% of their health. Each kill gives back 2 MP.'},
    {id:'whirl',name:'Whirlwind',max:1,req:8,desc:'New skill. Strike every foe at 55% power. 4 MP.'},
    {id:'harvest',name:'Red Harvest',max:1,req:10,desc:'Each kill restores 3% of your health and makes you 10% stronger for the rest of the fight (up to +30%).'}]},
  bulwark:{name:'Bulwark',col:'#8fb0c8',nodes:[
    {id:'thick',name:'Thick Hide',max:3,req:0,desc:'+8 max HP and +1 armour per rank.'},
    {id:'stalwart',name:'Stalwart',max:2,req:2,desc:'Guard blocks more and restores 2 more MP per rank.'},
    {id:'iron',name:'Iron Will',max:1,req:3,desc:'50% chance to shrug off any affliction before it takes hold.'},
    {id:'bash',name:'Shield Bash',max:1,req:4,desc:'New skill. A light blow with a 25% chance to throw the foe off balance, costing it a turn (10% against the strongest foes). 3 MP.'},
    {id:'spiked',name:'Spiked Rim',max:2,req:5,desc:'Attackers take 2 damage per rank, and your Guard blocks hit back for double.'},
    {id:'last',name:'Last Stand',max:1,req:6,desc:'Once per fight, a killing blow leaves you standing with 20% of your health instead.'},
    {id:'unbroken',name:'Unbroken',max:1,req:8,desc:'Guarding shakes off every affliction on you.'},
    {id:'bastion',name:'Bastion',max:1,req:11,desc:'The first two blows you take each fight deal 40% less damage.'}]},
  faith:{name:'Faith',col:'#d8b85a',nodes:[
    {id:'devotion',name:'Devotion',max:3,req:0,desc:'+3 max MP per rank, and you start every fight with 1 more MP per rank.'},
    {id:'sear',name:'Searing Light',max:2,req:2,desc:'Smite deals +4 damage per rank.'},
    {id:'mend',name:'Mend',max:1,req:3,desc:'New skill. Restore 30% of your health, twice per fight. 6 MP.'},
    {id:'kindled',name:'Kindled',max:1,req:4,desc:'Kindling a fire leaves you Blessed (+10% damage) for your next 3 fights.'},
    {id:'consec',name:'Consecrate',max:1,req:5,desc:'Smite leaves the foe burning for 3 turns, and sets every other foe alight for 1.'},
    {id:'absolve',name:'Absolution',max:1,req:6,desc:'Smite heals you for 25% of the damage it deals.'},
    {id:'martyr',name:"Martyr's Light",max:1,req:9,desc:'While below 30% health, Smite costs half as much.'}]},
  grim:{name:'Grim',col:'#a898c0',nodes:[
    {id:'lowexp',name:'Low Expectations',max:2,req:0,desc:'+10% experience per rank.'},
    {id:'gallows',name:'Gallows Humour',max:1,req:2,desc:'Study always tells you something useful, and restores 3 MP.'},
    {id:'scav',name:'Scavenger',max:2,req:3,desc:'Foes are 25% more likely to drop things, per rank.'},
    {id:'spite',name:'Spite',max:1,req:4,desc:'While below 35% health, deal 30% more damage.'},
    {id:'pick',name:'Light Fingers',max:1,req:5,desc:'Slashes have a 12% chance to steal something from the foe.'},
    {id:'nothing',name:'Nothing to Lose',max:1,req:6,desc:'+2 Attack for every 20% of health you are missing.'},
    {id:'morbid',name:'Morbid Curiosity',max:1,req:8,desc:'Hidden things nearby glimmer faintly, including what is tucked away at the ends of dead ends.'},
    {id:'accept',name:'Acceptance',max:1,req:10,desc:'Afflictions on you last a turn less, and poison and bleeding hurt you half as much.'}]},
};

/* ---- statuses ---- */
const STATUS={
  bleed:{n:'Bleeding',i:'drop',pal:{a:'#a01818',b:'#ff6a5a'},bad:1,tip:'Losing blood every turn, and slowly while you walk. Only a bandage stops it.'},
  poison:{n:'Poisoned',i:'drop',pal:{a:'#5a8a2a',b:'#c8e08a'},bad:1,tip:'Lose health every turn, and slowly while you walk. Bitterleaf or a potion clears it.'},
  dazed:{n:'Dazed',i:'star',pal:{a:'#e8d36a'},bad:1,tip:'Half your swings miss.'},
  blind:{n:'Blinded',i:'eye',pal:{a:'#d8d0b8',b:'#6d6a58',r:'#d8402a'},bad:1,tip:'You can\'t see. Half your swings miss.'},
  rooted:{n:'Rooted',i:'roots',pal:{a:'#9a7a4a'},bad:1,tip:'Held fast by roots. You cannot flee.'},
  wither:{n:'Withered',i:'down',pal:{a:'#a070c8'},bad:1,tip:'Your strength rots. Attack reduced by 30%.'},
  guard:{n:'Guarding',i:'shield',pal:{a:'#8fb0c8',b:'#3a5a78'},tip:'Shield raised. Incoming damage greatly reduced until your next turn.'},
  riposte:{n:'Riposte',i:'x',pal:{a:'#e8edf2'},tip:'Your next Slash strikes 30% harder.'},
  blessed:{n:'Blessed',i:'sun',pal:{a:'#e8c85a',b:'#fff4c0'},tip:'+10% damage. Lasts a few fights.'},
  regen:{n:'Regenerating',i:'plus',pal:{a:'#6ac86a'},tip:'Recover a little health every turn.'},
  burn:{n:'Burning',i:'flame',pal:{a:'#d8601a',b:'#ffd75e'},bad:1,tip:'On fire. Takes damage every turn.'},
  stag:{n:'Staggered',i:'swirl',pal:{a:'#d8d0b8'},bad:1,tip:'Off balance. Will lose its next turn.'},
  harden:{n:'Hardened',i:'block',pal:{a:'#8a8a84',b:'#4a4a46'},tip:'Armor greatly increased for a short while.'},
  wall:{n:'Shield Wall',i:'shield',pal:{a:'#8a8a84',b:'#3a3a40'},tip:'Behind its shield. Blades do much less.'},
  coiled:{n:'Coiled',i:'bang',pal:{a:'#e8402a'},tip:'It is gathering itself for a big one. Guard, or hit it first.'},
  hum:{n:'Resonating',i:'bang',pal:{a:'#6ab0ff'},tip:'The Colossus is building to a shattering note. Hit it hard enough before it finishes (the bar under its name) and the note breaks, and so does its balance. If not, Guard.'},
  stshield:{n:'Shield stance',i:'shield',pal:{a:'#c8c8c8'},tip:'Harrow is behind his shield. Light blows glance off. A wound-up or crushing blow knocks him off balance.'},
  stblade:{n:'Blade stance',i:'claw',pal:{a:'#e8402a'},tip:'Harrow is attacking. He hits a quarter harder, but if you Guard when he swings, you catch the blade and cut back hard.'},
  hatch:{n:'Hatching',i:'bang',pal:{a:'#e8c8a0'},tip:'When this runs out, it hatches into two more of her brood.'},
  pikeset:{n:'Pike set',i:'bang',pal:{a:'#d8d0c0'},tip:'The point is lowered at you. Your next blow walks onto it first: more so if it is a big, wound-up one. Guard, use an item, or let him come.'},
  cripple:{n:'Weakened',i:'bone',pal:{a:'#d8cfb0'},bad:1,tip:'Deals 30% less damage.'},
  shred:{n:'Shredded',i:'claw',pal:{a:'#c8a070'},bad:1,tip:'Armour torn open. Each stack strips 2 armour and adds 6% damage taken. Lasts the whole fight.'},
  vuln:{n:'Vulnerable',i:'target',pal:{a:'#ff6a5a',b:'#ffd870'},bad:1,tip:'Takes 25% more damage from your attacks.'},
  ward:{n:'Riposte',i:'x',pal:{a:'#ffe8a0'},tip:'+25% dodge. The first attack aimed at you is answered with a 40% cut.'},
  evade:{n:'Shadowstep',i:'swirl',pal:{a:'#a8b8d8'},tip:'The next blow aimed at you this round misses entirely.'},
  brace:{n:'Spear Set',i:'up',pal:{a:'#d8cfb0'},tip:'Until the round ends, you take 25% less damage and strike back at anything that hits you.'},
  fort:{n:'Fortified',i:'block',pal:{a:'#8fb0c8',b:'#3a5a78'},tip:'You take 30% less damage.'},
  unsh:{n:'Unshaken',i:'sun',pal:{a:'#e8edf2',b:'#8fb0c8'},tip:'No new affliction can take hold of you.'},
  kind:{n:'Kindled',i:'flame',pal:{a:'#5a9ae8',b:'#cfe8ff'},tip:'Your next skill is 50% stronger.'},
  crystal:{n:'Crystal Plates',i:'block',pal:{a:'#6ab0ff',b:'#d8f0ff'},tip:'+4 armour per plate. Blunt weapons, Crush, Sunder and Quake crack one off per hit. They grow back.'},
  steady:{n:'Steadied',i:'block',pal:{a:'#a8a8a0'},tip:'Just shook off a stun. Cannot be stunned again for a moment.'},
  slow:{n:'Slowed',i:'down',pal:{a:'#8fb0d8'},bad:1,tip:'−3 speed. Tends to act later in the round.'},
  exposed:{n:'Exposed',i:'target',pal:{a:'#ffb070'},bad:1,tip:'Its guard is down. It cannot block or parry.'},
  bristle:{n:'Bristling',i:'claw',pal:{a:'#a8c060'},bad:0,tip:'Hitting it hurts you.'},
  whet:{n:'Whetted',i:'up',pal:{a:'#ffd870'},tip:'Your next strike is 40% stronger.'},
  windup:{n:'Winding Up',i:'bang',pal:{a:'#ffb070'},tip:'Your next turn brings it down.'},
  frenzy:{n:'Frenzied',i:'teeth',pal:{a:'#d8402a'},tip:'Worked up by the howling. Hits 25% harder.'},
  bloodmoon:{n:'Blood Moon',i:'moon',pal:{a:'#c83a2a',b:'#7a1a10'},bad:1,tip:'Everything is angrier and hits harder, and is worth more when it dies.'},
  fog:{n:'Choking Fog',i:'wave',pal:{a:'#8a9a90'},bad:1,tip:'You can barely see a few steps. Creatures can\'t see you well either: they notice you from much closer. Lifts after a few minutes, or when you leave the area.'},
};
const SICON={};
function sicon(k){if(SICON[k])return SICON[k];const s=STATUS[k];return SICON[k]=spr(SI_ROWS[s.i],Object.assign({k:'#000'},s.pal)).toDataURL()}
/* status icons: buffs first, then a divider, then debuffs (each with its own border colour) */
function iconRow(list){const g=list.filter(h=>!h.includes('si debuff')),b=list.filter(h=>h.includes('si debuff'));return g.join('')+(g.length&&b.length?'<i class="isep"></i>':'')+b.join('')}
function iconHTML(k,turns,extra){const s=STATUS[k];return`<img class="si ${s.bad?'debuff':'buff'}" src="${sicon(k)}" data-tip="<b>${s.n}</b>${turns?`<span class='r'>${turns} ${turns===1?'turn':'turns'} left${mode==='world'?` (about ${turns*4}s of walking)`:''}</span>`:''}<span class='fx'>${s.tip}</span>${extra||''}">`}

const ICON_ROWS={
 sword:["..........kk",".........kak","........kak.",".......kak..","......kak...",".....kak....","..k.kak.....","..kkak......","...kck......","..kkcck.....",".kbk.kk.....",".kk........."],
 axe:["......kkk...",".....kaaak..","....kaaaak..","....kaaak...","...kbkkk....","...kbk......","..kbk.......","..kbk.......",".kbk........",".kbk........","kbk.........","kk.........."],
 knife:["............",".........kk.","........kak.",".......kak..","......kak...",".....kak....","...kkck.....","....kc......","...kbk......","..kbk.......","..kk........","............"],
 flail:["......k.....",".....kak....","....kaaak...","...kaacaak..","....kaaak...",".....kak....","......c.....",".....c......","....kbk.....","...kbk......","..kbk.......","..kk........"],
 halberd:["......kk....",".....kak....","..kkkkak....",".kaaakbk....",".kaaakbkk...","..kaakbkak..","...kkkbkk...",".....kbk....",".....kbk....",".....kbk....",".....kbk....",".....kk....."],
 maul:["....kkkkk...","...kaaaaak..","...kacaaak..","...kaaaaak..","....kkbkk...","......kbk...",".....kbk....",".....kbk....","....kbk.....","....kbk.....","...kbk......","...kk......."],
 shield:[".kkkkkkkkkk.","kaaaaccaaaak","kaaaaccaaaak","kaaaaccaaaak","kcccccccccck","kaaaaccaaaak",".kaaaccaaak.",".kaaaccaaak.","..kaaccaak..","...kaccak...","....kcck....",".....kk....."],
 helm:["....kkkk....","..kkaaaakk..",".kaaaaaaaak.",".kaaaaaaaak.","kaaaaaaaaaak","kakkkkkkkkak","kabbbbbbbbak","kaaaaaaaaaak","kaaakaakaaak","kaaakaakaaak",".kaaaaaaaak.","..kkkkkkkk.."],
 armor:["..kk....kk..",".kaak..kaak.","kaaaakkaaaak","kaaaaaaaaaak","kbaaaaaaaabk",".kbaaaaaabk.","..kaaccaak..","..kaaccaak..","..kaaaaaak..","..kbaaaabk..","..kbbbbbbk..","..kkkkkkkk.."],
 boots:["............","...kkkk.....","...kaak.....","...kaak.....","...kaak.....","...kaak.....","...kaak.....","...kaakkkk..","...kaaaaaak.","...kaaaaaaak","...kbbbbbbbk","...kkkkkkkk."],
 charm:["..bbbbbbbb..",".b........b.","b..........b","b..........b",".b........b.","..b......b..","...b....b...","....kkkk....","....kaak....","...kacak....","...kaaaak...","....kkkk...."],
 vial:["....kkkk....","....kbbk....",".....kk.....","....kaak....","...kaaaak...","..kaaaaaak..","..kaccaaak..","..kacaaaak..","..kaaaaaak..","..kaaaaaak..","...kaaaak...","....kkkk...."],
 heart:["............","..kkk..kkk..",".kaaakkaaak.","kaacaaaaaaak","kacaaaaaaaak","kaaaaaaaaaak",".kaaaaaaaak.","..kaaaaaak..","...kaaaak...","....kaak....",".....kk.....","............"],
 candle:[".....kk.....","....kcck....","....kcck....",".....kk.....","....kaak....","....kaak....","....kaak....","....kaak....","....kaak....","..kkkaakkk..","..kbbbbbbk..","..kkkkkkkk.."],
 rosary:["...kk.kk....","..kak.kak...","..kk...kk...",".kk.....kk..","kak.....kak.",".kk.....kk..","..kk...kk...","..kak.kak...","...kkkkk....",".....kak....","....kcck....","....kkkk...."],
 leaf:["..........kk","........kkak","......kkaaak","....kkaaaaak","...kaaaacak.","..kaaacaaak.","..kaacaaak..",".kacaaaak...",".kcaaakk....","kckkkk......","kk..........","............"],
 oil:["....kkk.....","....kbk.....","...kkkkk....","..kaaaaak...",".kaaaaaaak..",".kaccaaaak..",".kacaaaaak..",".kaaaaaaak..",".kaaaaaaak..","..kaaaaak...","...kkkkk....","............"],
};
const ICONS={};
function icon(id){if(ICONS[id])return ICONS[id];const it=ITEMS[id];const c=spr(ICON_ROWS[it.icon],{k:'#050505',a:it.c[0],b:it.c[1],c:it.c[2]||'#c9a24b'});return ICONS[id]=c.toDataURL()}
