import sys
from playwright.sync_api import sync_playwright
VP=[('a360',360,800),('i390',390,844),('a412',412,915),('La800',800,360),('Li844',844,390)]
pick=sys.argv[1:] 
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    for name,w,h in VP:
        if pick and name not in pick: continue
        ctx=b.new_context(viewport={'width':w,'height':h},device_scale_factor=3,is_mobile=True,has_touch=True)
        pg=ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+__import__('os').path.abspath(__import__('os').path.join(__import__('os').path.dirname(__file__),'..','dist','index.html'))+'#phone');pg.wait_for_timeout(1500)
        pg.screenshot(path=f'shots/{name}_0title.png')
        pg.evaluate("document.querySelector('#begin').click()");pg.wait_for_timeout(2500)
        pg.evaluate("DEV.peace=1;addItem('potion',3);addItem('bandage',2);devGear(3,0);devGear(2,0);P.apts=2;updHud()");pg.wait_for_timeout(400)
        pg.screenshot(path=f'shots/{name}_1world.png')
        pg.evaluate("openStats()");pg.wait_for_timeout(400);pg.screenshot(path=f'shots/{name}_2wstats.png');pg.evaluate("closeStats()")
        for t in ['gear','bag','stats']:
            pg.evaluate(f"openPack('{t}')");pg.wait_for_timeout(400)
            if t=='bag': pg.evaluate("(()=>{const e=document.querySelector('#pk-bag .slot, #pk-bag [data-i]');if(e)e.click()})()");pg.wait_for_timeout(200)
            pg.screenshot(path=f'shots/{name}_3pack_{t}.png');pg.evaluate("closePack()");pg.wait_for_timeout(200)
        pg.evaluate("void dialog('Mortimer','“Coin for things, things for coin. Same as ever.”',['Buy','Sell','Leave'])");pg.wait_for_timeout(400)
        pg.screenshot(path=f'shots/{name}_4dialog.png');pg.keyboard.press('Escape');pg.wait_for_timeout(300)
        pg.evaluate("mode='world';void (()=>{const m=makeMob('wolves3',P.x+20,P.y);mobs.push(m);startBattle(m,'neutral')})()");pg.wait_for_timeout(3000)
        pg.evaluate("window._t=setInterval(()=>{try{if(typing||msgSkip)msgTap()}catch(e){}},100)");pg.wait_for_timeout(1500)
        pg.screenshot(path=f'shots/{name}_5battle.png')
        try:
            pg.click('#acts [data-a=attack]',timeout=3000);pg.wait_for_timeout(300);pg.screenshot(path=f'shots/{name}_6attacks.png')
            pg.click('#sub [data-a=slash]',timeout=3000);pg.wait_for_timeout(4500)
        except Exception as e: print(name,'click',str(e)[:80])
        pg.evaluate("act('stats')");pg.wait_for_timeout(500);pg.screenshot(path=f'shots/{name}_7bstats.png');pg.evaluate("act('stats')")
        pg.evaluate("openLog();logTab='in';renderLog()");pg.wait_for_timeout(400);pg.screenshot(path=f'shots/{name}_8blog.png')
        print(name,errs)
        ctx.close()
    b.close()
