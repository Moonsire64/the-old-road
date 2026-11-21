#!/usr/bin/env bash
# Joins the source files into one playable page: dist/index.html. Load order matters.
set -e
cd "$(dirname "$0")/src"
cat 01_head.html 02a_sprites.js 02b_sprites.js 02c_sprites.js 02d_sprites.js 02e_sprites.js 02f_sprites.js 02z_hd.js 03_map.js 04a_audio.js 04b_audio.js 05_data.js 05c_items.js 06_state.js 07_world.js 08_battle.js 08b_arts.js 08c_fx.js 05d_mobs.js 05e_maps.js 05f_props.js 05g_puzzles.js 05h_smalls.js 09_ui.js 11_dev.js 12_save.js 10_main.js > ../dist/index.html
python3 - <<'PY'
s=open('../dist/index.html').read();i=s.rindex('<script>')+8;j=s.rindex('</script>');open('/tmp/hm_check.js','w').write(s[i:j])
PY
node --check /tmp/hm_check.js
echo BUILD_OK
