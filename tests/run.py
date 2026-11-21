#!/usr/bin/env python3
"""Hollowmere automated test suite.  python3 run.py [test names...]  (no names = run everything)"""
import asyncio, sys, time, json, os, re
from playwright.async_api import async_playwright
sys.path.insert(0, os.path.dirname(__file__))
from tests import TESTS
GAME = 'file://' + os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'dist', 'index.html')) + '#phone'
HELP = open(os.path.join(os.path.dirname(__file__), 'helpers.js')).read()
HERE = os.path.dirname(os.path.abspath(__file__))
SHOTS = os.path.join(HERE, 'shots'); os.makedirs(SHOTS, exist_ok=True)
TIME_SCALE = 0.15   # game timers run ~7x faster so the suite finishes quickly
INIT = """window.__realSetTimeout=window.setTimeout;window.__TS=%s;
window.setTimeout=function(f,ms,...a){return window.__realSetTimeout(f,(ms||0)*window.__TS,...a)};
try{localStorage.setItem('hm_dev','0')}catch(e){}""" % TIME_SCALE

async def start(b, vp=(390, 844), fresh=True):
    ctx = await b.new_context(viewport={'width': vp[0], 'height': vp[1]})
    await ctx.add_init_script(INIT)
    pg = await ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append('JS error: ' + (getattr(e,'stack',None) or str(e))[:600]))
    prog = []; pg.on('console', lambda m: prog.append(m.text[3:]) if m.text.startswith('TH:') else None); pg._prog = prog
    pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' and 'favicon' not in m.text else None)
    await pg.goto(GAME); await pg.wait_for_selector('#begin', state='visible', timeout=15000)
    if fresh:
        await pg.evaluate("try{localStorage.removeItem('hm_save1')}catch(e){}")
        await pg.click('#begin'); await pg.wait_for_function("typeof mode!=='undefined'&&mode==='world'", timeout=20000)
        await pg.evaluate(HELP)
    return ctx, pg, errs

async def run_one(b, name, desc, js, tmo):
    t0 = time.time(); res = {'name': name, 'desc': desc, 'ok': False, 'problems': [], 'summary': ''}
    ctx = pg = None
    try:
        ctx, pg, errs = await start(b)
        body = "(async()=>{" + js + "})()"
        res['summary'] = await asyncio.wait_for(pg.evaluate(body), tmo) or ''
        if name == 'save':   # second half: reload the page and Continue
            res['problems'] += await pg.evaluate("TH.bad")
            await pg.reload(); await pg.wait_for_selector('#cont', state='visible', timeout=15000)
            await pg.click('#cont'); await pg.wait_for_function("typeof mode!=='undefined'&&mode==='world'", timeout=20000)
            diff = await pg.evaluate("""(()=>{const a=JSON.parse(localStorage.getItem('__snap')),b={lv:P.lv,gold:P.gold,area:AR.i,zone:LV.zi,bag:P.bag.length,eq:P.eq};
              const d=[];for(const k in a)if(JSON.stringify(a[k])!==JSON.stringify(b[k]))d.push(k+': '+JSON.stringify(a[k])+' → '+JSON.stringify(b[k]));return d})()""")
            res['problems'] += ['after loading, ' + d for d in diff]; res['summary'] = 'saved and loaded'
        else: res['problems'] += await pg.evaluate("TH.bad")
    except asyncio.TimeoutError:
        res['problems'].append(f'Took longer than {tmo}s — probably stuck')
    except Exception as e:
        res['problems'].append(re.sub(r'\s+', ' ', str(e))[:400])
    if pg is not None:
        res['problems'] += errs
        if res['problems'] and pg._prog: res['problems'].append('last step reached: ' + pg._prog[-1])
    if pg and res['problems']:
        try:
            info = await pg.evaluate("`mode=${mode}, map=${LV&&LV.name}, battle=${!!B}`")
            res['problems'].append('state at the end: ' + info)
            await pg.screenshot(path=f'{SHOTS}/{name}.png'); res['shot'] = f'{SHOTS}/{name}.png'
        except Exception: pass
    if ctx: await ctx.close()
    res['ok'] = not res['problems']; res['secs'] = round(time.time() - t0, 1)
    return res

async def main():
    pick = sys.argv[1:]
    todo = [t for t in TESTS if not pick or t[0] in pick]
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        sem = asyncio.Semaphore(4)
        async def guarded(t):
            async with sem:
                r = await run_one(b, *t)
                print(('PASS ' if r['ok'] else 'FAIL ') + f"{r['name']:<9} {r['secs']:>6}s  {r['summary'] if r['ok'] else ''}", flush=True)
                for pr in r['problems'][:12]: print('      - ' + pr.replace('\n', '\n        '), flush=True)
                return r
        rs = await asyncio.gather(*[guarded(t) for t in todo])
        await b.close()
    ver = re.search(r'id="ver">([^<]+)<', open(os.path.join(HERE, '..', 'dist', 'index.html')).read()).group(1)
    ok = sum(r['ok'] for r in rs)
    print(f"\n{ok}/{len(rs)} passed  (game {ver})")
    json.dump({'version': ver, 'results': rs}, open(os.path.join(HERE, 'last.json'), 'w'), indent=1)
    sys.exit(0 if ok == len(rs) else 1)
if __name__ == "__main__":
    asyncio.run(main())
