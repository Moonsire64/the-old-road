
/* ---- extra creatures ---- */
SPR.imp=[spr(["k........k","kk......kk",".kkkkkkkk.",".kppppppk.",".kpeppepk.",".kppmmppk.","..kppppk..",".kkpPPpkk.","kpkpPPpkpk","...kppk...","..kk..kk.."],{k:'#060306',p:'#4a2e44',P:'#6a4060',e:'#ff8a2a',m:'#1a0a12'})];
SPR.wolf=[spr([".kk.k...........","kffkfk..........","kfefffk.........","kffffffkkkkkkk..",".kkfffffffffffk.","..kffFffffffFfkk","...kfffffffffk.k","...kfk.kfkkfk...","...kfk.kfk.kfk..","..kkk.kkk..kkk.."],{k:'#050505',f:'#4a4a48',F:'#6a6a64',e:'#e8e86a'})];
for(const k of['imp','wolf']){SPR[k].white=tint(SPR[k][0],'#ffffff');SPR[k].flip=SPR[k].map(flipH)}

/* ---- props ---- */
const PS={
 grave:spr(["..kkkkkk..",".kRrrrrrk.","kRrrxxrrdk","kRrrxxrrdk","kRxxxxxxdk","kRrrxxrrdk","kRrrxxrrdk","kRrrrrrrdk","kmrrrrrrdk","kmmrrrmmdk","kkkkkkkkkk",".bbbbbbbb."],{k:'#050505',R:'#6a6862',r:'#4a4844',d:'#2c2b28',x:'#2a2926',m:'#2f4422',b:'#1a140e'}),
 scare:spr(["....kkkk....","...kHHHHk...",".kkkkkkkkkk.","...kssssk...","...ksesek...","...kssssk...","....kmmk....","bbbbkcckbbbb","ybbkcCCckbby","...kcCCck...","...kcccck...","...kcCCck...","....kbbk....",".....bb.....",".....bb.....",".....bb.....",".....bb.....",".....bb.....",".....bb....."],{k:'#070605',H:'#2a2418',s:'#9a8a5a',e:'#050505',m:'#3a2a1a',c:'#4a3a5a',C:'#5a4a6a',b:'#5a4030',y:'#b8a050'}),
 well:spr(["..kkkkkkkkkkkk..",".kwwwwwwwwwwwwk.","kwwwwwwwwwwwwwwk","..kp........pk..","..kp........pk..","..kp...kk...pk..","kkkkkkkkkkkkkkkk","kRrRrRrRrRrRrRrk","krRrRrRrRrRrRrRk","kRrRrRrRrRrRrRrk","krRrRrRrRrRrRrRk","kRrRrRrRrRrRrRrk","kkkkkkkkkkkkkkkk"],{k:'#060606',w:'#3a2a1a',p:'#2a1d12',R:'#5a5852',r:'#3e3d39'}),
 bush:spr(["...kkkkk....",".kkgGggGkk..","kgGgrgGggGk.","kgggGggrggk.","kGgrggGgggGk","kggGggrgGggk",".kgggGgggkk.","..kkkkkkk..."],{k:'#050805',g:'#15281a',G:'#22402a',r:'#9a1a3a'}),
 bushBad:spr(["...kkkkk....",".kkgGggGkk..","kgGgrgGggGk.","kgggGggrggk.","kGgrggGgggGk","kggGggrgGggk",".kgggGgggkk.","..kkkkkkk..."],{k:'#050805',g:'#15281a',G:'#22402a',r:'#5a2a8a'}),
 bushEaten:spr(["...kkkkk....",".kkgGggGkk..","kgGgggGggGk.","kgggGgggggk.","kGggggGgggGk","kggGggggGggk",".kgggGgggkk.","..kkkkkkk..."],{k:'#050805',g:'#15281a',G:'#22402a'}),
 corpse:spr(["....kkk.......","...kssskkkkk..","kk.kseskdddddk","kbkkssskddrddk",".kbbkkkkdddddk","..kk....kkkkk."],{k:'#050505',s:'#7a7d84',e:'#050505',d:'#3a3a3a',r:'#5e1616',b:'#5a4030'}),
 mound:spr(["....kkkk....","..kkddddkk..",".kdDddDdddk.","kddddDddddDk","kkkkkkkkkkkk"],{k:'#0a0806',d:'#2a2016',D:'#3a2c1e'}),
 dug:spr(["............","..kkkkkkkk..",".kddkkkkddk.","kddkkkkkkddk",".kkkkkkkkkk."],{k:'#050403',d:'#2a2016'}),
 hungry:spr(["..kkkkkkkk..",".kRRRRRRRRk.","kRrkkkkkkrRk","kRkmmmmmmkRk","kRrkkkkkkrRk",".kkkkkkkkkk.","...kRrrdk...","...kRxrdk...","...kRrrdk...","...kRrrdk...","..kRRrrrdk..",".kRrrrrrrdk.","kkkkkkkkkkkk"],{k:'#050505',R:'#6a6862',r:'#4a4844',d:'#2c2b28',m:'#1a0505',x:'#8a2a1a'}),
 bell:spr(["..kkkk..",".kRRrrk.","kRrrrrdk","kRrrrrdk","kyyyyyyk","kRrrrrdk","kRrrrrdk","kRrrrrdk","kmrrrrdk","kmmrrrdk","kRrrrmdk","kRrrrrdk","kddddddk",".kkkkkk."],{k:'#050505',R:'#5c5b55',r:'#3c3b37',d:'#25241f',m:'#2f4422',y:'#8a6a2a'}),
 bellLit:spr(["..kkkk..",".kRRrrk.","kRrrrrdk","kRrrrrdk","kyyyyyyk","kRrrrrdk","kRrrrrdk","kRrrrrdk","kmrrrrdk","kmmrrrdk","kRrrrmdk","kRrrrrdk","kddddddk",".kkkkkk."],{k:'#050505',R:'#5c5b55',r:'#3c3b37',d:'#25241f',m:'#2f4422',y:'#ffd870'}),
 brazier:spr(["kkkkkkkkkk","kIiiiiiiIk",".kIiiiiIk.","..kkIIkk..","....kk....","....kk....","...kIIk...","..kIiiIk..",".kkkkkkkk."],{k:'#050505',I:'#5a5a5a',i:'#3a3a3a'}),
 sign:spr(["kkkkkkkkkk","kwwwwwwwwk","kwxwxxwxwk","kwwwwwwwwk","kkkkkkkkkk","....kpk...","....kpk...","....kpk...","....kpk...","....kpk...","...kkpkk.."],{k:'#050505',w:'#5a4430',x:'#2a1d12',p:'#3a2a1a'}),
 fox:spr(["...kkkkk..","..kooOook.",".kooooOook","kwoooooook",".kkkkkkkk."],{k:'#140a04',o:'#a8501a',O:'#c86a2a',w:'#e8dcc0'}),
 frog:spr([".k.k.","kgggk","kgGgk",".k.k."],{k:'#0a1206',g:'#3a5a2a',G:'#6a8a3a'}),
 owl:spr([".k..k.","kbbbbk","kebbek","kbyybk","kbbbbk",".kbbk.","..kk.."],{k:'#0a0806',b:'#4a3a2a',e:'#e8c84a',y:'#8a6a3a'}),
 owlBack:spr([".k..k.","kbbbbk","kbbbbk","kbbbbk","kbbbbk",".kbbk.","..kk.."],{k:'#0a0806',b:'#4a3a2a'}),
};
PS.foxRun=flipH(PS.fox);

/* ---- status icons ---- */
const SI_ROWS={
 claw:["a..a..a",".a..a..","..a..a.","a..a..a",".a..a..","..a..a.","......."],
 target:["..aaa..",".a...a.","a..b..a","a.bbb.a","a..b..a",".a...a.","..aaa.."],
 up:["...a...","..aaa..",".aaaaa.","...a...","...a...","...a...","......."],
 drop:["...a...","..aaa..",".aaaaa.",".abaaa.",".aaaaa.","..aaa..","......."],
 star:["a.....a",".a.a.a.","..aaa..","aaaaaaa","..aaa..",".a.a.a.","a.....a"],
 eye:["r......",".raaaa.","aarbbaa","abbrbba","aabbraa",".aaaar.","......r"],
 roots:["...a...","...a...","..aaa..",".a.a.a.","a..a..a",".a.a.a.","a..a..a"],
 down:["...a...","...a...","...a...","a..a..a",".a.a.a.","..aaa..","...a..."],
 shield:["aaaaaaa","abbbbba","abbbbba","abbbbba",".abbba.","..aba..","...a..."],
 x:["a.....a",".a...a.","..a.a..","...a...","..a.a..",".a...a.","a.....a"],
 sun:["...a...",".a.a.a.","..bbb..","aabbbaa","..bbb..",".a.a.a.","...a..."],
 plus:["...a...","...a...","...a...","aaaaaaa","...a...","...a...","...a..."],
 flame:["...a...","..aa...","..aba..",".abba..",".abbba.","abbbbba",".aaaaa."],
 swirl:[".aaaa..","a....a.","a.aa.a.","a.a..a.","a..aa..","a......",".aaaaa."],
 block:["aaaaaaa","abbbbba","ab.a.ba","abaaaba","ab.a.ba","abbbbba","aaaaaaa"],
 bang:["..aaa..","..aaa..","..aaa..","..aaa..","...a...",".......","..aaa.."],
 bone:["aa...aa","aaa.aaa",".aaaaa.","..aaa..",".aaaaa.","aaa.aaa","aa...aa"],
 teeth:["aaaaaaa","a.a.a.a",".......",".......",".......","a.a.a.a","aaaaaaa"],
 moon:["..aaa..",".abaaa.","aaaaaba","aabaaaa","aaaaaaa",".aabaa.","..aaa.."],
 wave:[".......","aa..aa.","..aa..a",".......","aa..aa.","..aa..a","......."],
};
