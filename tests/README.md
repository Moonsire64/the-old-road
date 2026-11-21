# Hollowmere test suite
Run `/home/claude/check.sh` (build + every test), or `cd suite && python3 run.py fights maps` for some.
Game timers run ~7x faster. Tests run 4 at a time in separate headless browsers; failures save a screenshot in suite/shots/.
Tests live in tests.py (JS run inside the game page, using helpers in helpers.js: TH.fight, TH.until, TH.scan, TH.note ...).
Rule: run check.sh before every publish; add a test for every bug that reaches the player.
