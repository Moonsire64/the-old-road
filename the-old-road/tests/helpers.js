/* Hollowmere test helpers: injected into the page after the title screen. */
window.TH = (() => {
  const H = {};
  H.bad = [];                       // problems found by scanners
  H.note = m => H.bad.push(m);
  H.realNow = () => performance.now();
  H.until = async (fn, ms = 20000, what = '') => {
    const t0 = performance.now();
    while (true) {
      let v = false; try { v = fn(); } catch (e) { }
      if (v) return v;
      if (performance.now() - t0 > ms) throw new Error('Timed out waiting for ' + (what || fn.toString().slice(0, 80)) + ` (mode=${mode})`);
      await new Promise(r => H._st(r, 15));
    }
  };
  H._st = (f, ms) => (window.__realSetTimeout || window.setTimeout).call(window, f, ms);
  // keep text moving: tap through battle text and notes, hit every timing ring perfectly
  H.autoTap = () => {
    if (H._iv) return;
    H._iv = setInterval(() => {
      try {
        if ((mode === 'note' || (typeof noteCur !== 'undefined' && noteCur)) && typeof noteTap === 'function') noteTap();
        if (typing || msgSkip) msgTap();
        if (H.autoFight && mode === 'battle' && B && B.turnDone && !H._fighting) act('slash');
        if (B && B.qte && !B.qte.done) { B.qte.start = performance.now() - B.qte.dur; qteTap(); }
      } catch (e) { }
    }, 25);
  };
  // answer every dialog automatically with H.pick (index, or function(title,choices) -> index)
  H.pick = 0; H.dialogs = [];
  H.autoDialog = () => {
    if (H._dlg) return; H._dlg = window.dialog;
    window.dialog = async (t, b, ch, raw, tips) => {
      H.dialogs.push(t); await new Promise(r => H._st(r, 1));
      // a menu that keeps coming back (a shop, a loop) gets its last option, which is nearly always Leave/Back
      const n = H.dialogs.length, rep = (n >= 4 && H.dialogs.slice(-4).every(x => x === t)) || H.dialogs.slice(-40).filter(x => x === t).length > 12;  // also: a menu we keep cycling back to
      if (rep || n > 400) return (ch || [0]).length - 1;
      const i = typeof H.pick === 'function' ? H.pick(t, ch) : H.pick; return Math.min(i, (ch || [0]).length - 1); };
  };
  H.toWorld = async () => { await H.until(() => { if (mode === 'note' && typeof noteCur !== 'undefined' && noteCur) nextNote(); if (mode === 'pack' && typeof closePack === 'function') closePack(); return mode === 'world'; }, 30000, 'world mode'); };  // a roadside event's notice can pop up on arrival: tap it away
  // start a fight with any KINDS entry next to the player, play it out, report what happened
  H.step = s => console.log('TH:' + s);
  H.fight = async (kind, o = {}) => {
    H.step('fight ' + kind + ' on ' + (LV && LV.name));
    await H.toWorld();
    const k = KINDS[kind]; if (!k) throw new Error('No such kind ' + kind);
    const m = makeMob(kind, P.x + 14, P.y);
    if (k.pack) m.n = k.units.length; if (k.boss) m.boss = 1;
    mobs.push(m); LV.mobs = mobs;
    const hp0 = P.hp;
    startBattle(m, o.first || 'contact');
    await H.until(() => mode === 'battle' && B, 15000, 'battle to start (' + kind + ')');
    const b = B; let rounds = 0, acts = []; H._fighting = 1;
    while (true) {
      await H.until(() => b.over || (B === b && b.turnDone) || mode === 'dead', o.roundMs || 30000, 'next turn in fight vs ' + kind + ' round ' + rounds);
      if (b.over || mode === 'dead') break;
      if (++rounds > (o.maxRounds || 80)) throw new Error(`Fight vs ${kind} still going after ${o.maxRounds || 80} rounds`);
      if (o.beforeAct) o.beforeAct(b, rounds);
      { const al = b.foes.map((f, i) => [f, i]).filter(([f]) => !f.dead && f.hp > 0); al.sort((x, y) => (!!x[0].k.boss - !!y[0].k.boss) || x[0].hp - y[0].hp); if (al.length) b.tgt = al[0][1]; }
      const a = o.act ? o.act(b, rounds) : 'slash';
      acts.push(a); act(a);
      await new Promise(r => H._st(r, 5));
    }
    H._fighting = 0;
    await H.until(() => mode === 'world' || mode === 'dead' || mode === 'win', 20000, 'fight vs ' + kind + ' to hand back control');
    return { kind, rounds, mode, hpLost: hp0 - P.hp, acts, won: mode !== 'dead' };
  };
  // scan any text for the usual signs of a bug
  H.scan = (where, s) => {
    s = String(s);
    const m = s.match(/undefined|NaN|\[object |null\b|Infinity/);
    if (m) H.note(`${where}: contains "${m[0]}" → ${s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 160)}`);
  };
  H.statsOk = where => {
    for (const k of ['hp', 'max', 'mp', 'mmax', 'atk', 'def', 'crit', 'ini', 'dodge', 'gold', 'xp', 'lv'])
      if (!Number.isFinite(P[k])) H.note(`${where}: P.${k} is ${P[k]}`);
    if (P.hp > P.max) H.note(`${where}: hp ${P.hp} above max ${P.max}`);
    if (P.mp > P.mmax) H.note(`${where}: mp ${P.mp} above max ${P.mmax}`);
  };
  return H;
})();
