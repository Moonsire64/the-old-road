# The Old Road

A dark-fantasy pixel RPG for phones: top-down exploration, turn-based battles, loot.

## Layout
- `src/` – the game, split into files that `build.sh` joins (in a fixed order) into one page.
- `site/` – files for the hosted test site: app manifest, service worker, icons.
- `tests/` – automated tests (Playwright). `python3 tests/run.py <test names>`; no names runs everything.
- `notes/backlog.md` – the to-do list.
- `docs/` – the built test site that GitHub Pages serves (refreshed by `deploy.sh`).

## Building and publishing
- `./build.sh` → `dist/index.html`, a single self-contained page.
- `./deploy.sh` → builds into `docs/` for the GitHub Pages test site.
- The version label is in `src/01_head.html` (`id="ver"`) and goes up on every publish. Saves only load in the exact version that wrote them.
- Public builds need `SIM_DEFAULT='off'`.
