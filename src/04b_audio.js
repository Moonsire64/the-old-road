
Object.assign(SFX,{
  growl(){AU.tone('sawtooth',90,60,.45,.05,0,.3);AU.noise&&0},
  rustle(){AU.tone('triangle',900,500,.08,.02);AU.tone('triangle',700,400,.08,.02,.06)},
  bell(i){const f=[262,330,392,523][i];AU.tone('sine',f,f,2.2,.12,0,.8);AU.tone('sine',f*2.01,f*2.01,1.4,.04,0,.6);AU.tone('triangle',f*3.02,f*3,0.6,.02)},
  croak(){AU.tone('square',140,90,.12,.05);AU.tone('square',150,95,.1,.05,.15)},
  hoot(){AU.tone('sine',420,380,.35,.05,0,.6);AU.tone('sine',400,360,.5,.05,.45,.6)},
  chime(){[784,988,1175,1568].forEach((f,i)=>AU.tone('sine',f,f,1.4,.035,i*.13+Math.random()*.05,.8))},
  whoosh(){AU.noise(.2,.12,600,2400,'bandpass',0,.8)},
  dig(){AU.noise(.12,.15,500,200,'lowpass');AU.noise(.12,.12,600,250,'lowpass',.18)},
  hiss(){AU.noise(.5,.08,3000,800,'highpass')},
  ignite(){AU.noise(.4,.14,300,2000,'bandpass');AU.tone('sawtooth',90,180,.3,.05)},
  thud(){AU.tone('sine',90,40,.3,.15)},
  puff(){AU.noise(.15,.06,1200,400,'bandpass')},
  splash(){AU.noise(.25,.1,1200,300,'lowpass')},
  shout(){AU.tone('sawtooth',220,180,.35,.05,0,.9)},
  eat(){AU.noise(.06,.08,900,500);AU.noise(.06,.08,900,500,'bandpass',.12)},
  coin(){AU.tone('square',988,988,.08,.05);AU.tone('square',1318,1318,.25,.05,.08,.4)},
  dread(){AU.tone('sawtooth',55,52,2.4,.08,0,.6);AU.tone('sawtooth',58.3,55,2.4,.06,.1,.6)},
  bird(){const f=1800+Math.random()*900;AU.tone('sine',f,f*1.3,.08,.03);AU.tone('sine',f*1.1,f*1.4,.07,.03,.12);if(Math.random()<.5)AU.tone('sine',f*.9,f*1.2,.1,.025,.26)},
  drip(){const f=900+Math.random()*700;AU.tone('sine',f,f*.6,.12,.04,0,.8)},
  baa(){if(!AU.ctx)return;AU.tone('sawtooth',320,280,.45,.04,0,.3);AU.tone('sawtooth',330,300,.4,.03,.05)},
  howlpack(){SFX.howl();setTimeout(()=>SFX.howl(),700)}
});
