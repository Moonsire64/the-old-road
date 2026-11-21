import asyncio,sys,json
sys.path.insert(0,__import__('os').path.dirname(__import__('os').path.abspath(__file__)))
import run
from playwright.async_api import async_playwright
JS="""(async()=>{TH.autoTap();DEV.peace=1;const out={};const kinds=Object.keys(MAPDEF[0].mobs);
 const st=JSON.stringify(P.eq);out.lvl=P.lv;out.hp=P.max;out.atk=effAtk();out.def=P.def;out.eq=st;
 for(const k of kinds){let w=0,hp=0,rs=0;const N=12;for(let i=0;i<N;i++){P.hp=P.max;P.mp=P.mmax;P.st={};const r=await TH.fight(k,{maxRounds:60});if(r.won){w++;hp+=P.hp/P.max}rs+=r.rounds;if(mode==='dead'){respawn();await TH.toWorld()}P.xp=0;devSetLevel(1)}
   const f=makeFoe(k,0,1);out[k]=`win ${w}/${N}, hp left ${w?Math.round(100*hp/w):0}%, rounds ${(rs/N).toFixed(1)} | foe hp ${f.max} atk ${f.atk} def ${f.def}`+(KINDS[k].pack?' pack x'+KINDS[k].units.length:'')}
 return out})()"""
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        ctx,pg,errs=await run.start(b)
        r=await pg.evaluate(JS)
        for k,v in r.items():print(k,':',v)
        print(errs[:3])
asyncio.run(m())
