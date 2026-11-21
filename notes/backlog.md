# Playtest feedback, 21 Nov 2026 — work plan (first four areas only)

Split into batches, one per response. Tick as done.

## Batch 1 — bugs, UI, small changes (DONE in 0.14.0)
- [x] Stat-point yellow dot clears instantly (like talents)
- [x] Item compare: plain "+1 / -2", no arrows; fix "Gain: -1 speed"
- [x] Status-curing items restore no HP
- [x] Every HP change (regen, heals, leech, thorns…) in the log; player deaths in the log
- [x] Remove stone stacking; remove skipping stones; remove fishing entirely
- [x] Hangman's rope nerf
- [x] Regen ticks at end of the final battle turn (unless dead)
- [x] Loot lines stack: "Bitterleaf x2"
- [x] Bag fits landscape on regular Android
- [x] Player not enormous indoors
- [x] Whole UI ~45-60% translucent until hovered/pressed (overworld + battle)
- [x] Talent tree headers stay put while scrolling
- [x] No status on the player if the foe died to riposte/thorns
- [x] Overworld swing hits only the nearest target
- [x] Clicks not registering (map location tabs etc.)
- [x] Title screen scales in landscape
- [x] Hide the permanent Regenerating buff on the player
- [x] Orange runner: catchable, respects trees/water; sheep stuck in tree
- [x] Remove turnips
- [x] Fairy circles vanish after use
- [x] Set line: show the bonus you'd get (e.g. 2/4: …), drop "adds to the set"
- [x] Multi-screen dialogs: ✕ goes back one screen
- [x] Equip keeps you on Bag; replaced item takes the same bag slot
- [x] Overkill clamp (damage dealt never exceeds HP left)
- [x] Remove ward bell; Use button spam is quiet
- [x] Strawmen: fight starts immediately; occasionally swing at you
- [x] Cold campfire visible
- [x] Choking fog: real effect, and must not persist across areas
- [x] Blightcaps smaller in battle
- [x] Only spent points unlock tree tiers; Bastion needs 11
- [x] Mob first-hit 10% → 50%; weapon reach -10%
- [x] Buffs and debuffs separated in both bars; enemy icons never overlap UI
- [x] Long tooltips never go off-screen
- [x] Buildings: beds 0-2 (1 likeliest), anvil 20%
- [x] Remove Purity talent; "grants a skill" → +1 rank
- [x] Affixes always in the same order
- [x] Mosquitoes have life leech
- [x] 4-mob packs → 3, 3 → 2 (stats compensated)
- [x] Water readable vs floor in Sunken Chapel / Ferryman's house
- [x] Hungry shrine: demands a random consumable, always gives exactly one piece of gear
- [x] Bog maps: faint drizzle
- [x] No Rotwood Ents in area 4; new variant there
- [x] Hookshot animation
- [x] Tool-locked chests use the tier of the map where the tool was found

## Batch 2 — economy, merchant, balance (DONE 0.15.0)
- Mortimer + lit bonfire + anvil at every map's entry; gear re-rolls every visit/teleport; consumables don't restock and he stocks less of them
- Compare Mortimer's gear to equipped; stash beside him; item locking; gambling (Gheed); more gold sinks; less gold
- Consumable drops -60%; chests rarer; unique rarity check; more +talent gear
- Thorns, armour, life leech, Red Harvest nerfs; Brigand's Knife, Wychwarden's Ward fixes
- Fortitude → parry when no shield
- Faster enemies past area 1
- Stat and skill tooltips: base + bonus + sources
- Man mode / Hardcore: one less bonfire per map; no Mortimer in Hardcore + hinted secret ending (he one-taps you after the final boss)
- Stats screen: playtime, kills, distance, damage dealt/taken…

## Batch 3 — overworld creatures and weapons (DONE 0.16.0)
- Better pathfinding; varied movement (circling, flanking, teleporting)
- Random-event hunter per area: never gives up, very tough, guaranteed set drops
- Replace archers
- Weapon types drawn in the overworld; each type its own reach and swing (dagger stab, scythe sweep); more weapon types (D2 balance of 1h/2h)
- Striking things in the overworld has effects everywhere
- Hidden items in some dead ends (no cues; Morbid Curiosity)

## Batch 4 — maps, tools, puzzles, content
- [x] Tunnels: winding, looping, long (swamp-quality generation for every area) — 0.17.0
- [x] Ent-style path openings, more of that (never a sequence skip) — 0.17.0 gatekeepers
- [x] One tool per non-boss map (double the tools), each with a use right next to where you get it; more uses — 0.18.0
- [x] Zelda-grade puzzles — 0.19.0 (block rooms, lantern rings, race gates)
- [x] ~10x clickables / points of interest; more varied buildings — 0.20.0
- [~] Rewrite flavour text (less AI-sounding) — 0.20.1 first pass: ~200 worst lines + item descriptions

## Batch 5 — bosses, battle variety, build depth
- Bosses: far more HP and real mechanics (bosses 2-4 especially)
- Many more battle animations
- Enchanting / gems / sockets; impactful talents

## Ideas only (discuss, don't build)
Class identity, caster/summoner viability, quests/NPCs/story, endgame, sound design.
