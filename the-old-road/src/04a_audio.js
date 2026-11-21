/* ================= AUDIO ================= */
const AU={ctx:null,m:null,muted:false,
  init(){if(this.ctx){if(this.ctx.state==='suspended')this.ctx.resume();return}
    try{this.ctx=new(window.AudioContext||window.webkitAudioContext)()}catch(e){return}
    const c=this.ctx;this.m=c.createGain();this.m.gain.value=.8;this.m.connect(c.destination);
    const b=c.createBuffer(1,c.sampleRate*2,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;this.nb=b;
    this.fx=c.createDelay(1);this.fx.delayTime.value=.27;const fb=c.createGain();fb.gain.value=.42;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1300;
    this.fx.connect(lp);lp.connect(fb);fb.connect(this.fx);lp.connect(this.m);this.fxIn=c.createGain();this.fxIn.connect(this.fx);
    this.ambient()},
  ambient(){const c=this.ctx,g=c.createGain();g.gain.setValueAtTime(0,c.currentTime);g.gain.linearRampToValueAtTime(1,c.currentTime+4);g.connect(this.m);this.ambG=g;
    const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=150;lp.Q.value=5;const dg=c.createGain();dg.gain.value=.05;lp.connect(dg);dg.connect(g);
    [43.65,43.95,65.4,51.9].forEach(f=>{const o=c.createOscillator();o.type='sawtooth';o.frequency.value=f;o.connect(lp);o.start()});
    const lfo=c.createOscillator();lfo.frequency.value=.04;const lg=c.createGain();lg.gain.value=70;lfo.connect(lg);lg.connect(lp.frequency);lfo.start();
    const n=c.createBufferSource();n.buffer=this.nb;n.loop=true;const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=480;bp.Q.value=.7;
    const wg=c.createGain();wg.gain.value=.04;n.connect(bp);bp.connect(wg);wg.connect(g);n.start();
    const l2=c.createOscillator();l2.frequency.value=.07;const l2g=c.createGain();l2g.gain.value=.03;l2.connect(l2g);l2g.connect(wg.gain);l2.start();
    const l3=c.createOscillator();l3.frequency.value=.11;const l3g=c.createGain();l3g.gain.value=260;l3.connect(l3g);l3g.connect(bp.frequency);l3.start()},
  setAmb(v){if(this.ambG)this.ambG.gain.linearRampToValueAtTime(v,this.ctx.currentTime+.8)},
  tone(type,f0,f1,dur,vol=.2,delay=0,wet=0,at){if(!this.ctx)return;const c=this.ctx,t=at!=null?at:c.currentTime+delay;
    const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1!==f0)o.frequency.exponentialRampToValueAtTime(Math.max(1,f1),t+dur);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g);g.connect(this.m);if(wet){const w=c.createGain();w.gain.value=wet;g.connect(w);w.connect(this.fxIn)}o.start(t);o.stop(t+dur+.05)},
  noise(dur,vol,f0,f1,type='bandpass',delay=0,q=1,at){if(!this.ctx)return;const c=this.ctx,t=at!=null?at:c.currentTime+delay;
    const s=c.createBufferSource();s.buffer=this.nb;const f=c.createBiquadFilter();f.type=type;f.Q.value=q;f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
    const g=c.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(this.m);s.start(t,Math.random());s.stop(t+dur+.05)},
  toggle(){this.muted=!this.muted;if(this.m)this.m.gain.value=this.muted?0:.8;$('#mute').classList.toggle('off',this.muted)}
};
const SFX={
  slash(){AU.noise(.13,.2,3200,700,'bandpass',0,1.3)},
  thunk(){AU.tone('square',110,55,.09,.1);AU.noise(.05,.1,700,300)},
  hit(){AU.tone('square',210,60,.15,.16);AU.noise(.09,.22,1300,300)},
  crit(){SFX.hit();AU.tone('square',700,200,.12,.1,.03)},
  hurt(){AU.tone('sawtooth',180,65,.28,.16);AU.noise(.14,.16,900,200,'lowpass')},
  smite(){AU.tone('sine',330,990,.4,.18,0,.6);AU.tone('triangle',660,1320,.32,.1,.06,.6);AU.noise(.45,.1,5000,1500,'highpass')},
  heal(){[523,659,784,1046].forEach((f,i)=>AU.tone('sine',f,f,.3,.1,i*.08,.6))},
  lvl(){[392,523,659,784,1046].forEach((f,i)=>AU.tone('square',f,f,.2,.07,i*.11,.5))},
  guard(){AU.tone('triangle',520,480,.18,.12);AU.noise(.07,.15,6000,3000,'highpass')},
  clang(){AU.tone('triangle',900,860,.3,.1,0,.4);AU.tone('square',1400,1300,.12,.04)},
  miss(){AU.noise(.18,.1,1500,3500)},
  bat(){AU.tone('sawtooth',2400,3200,.07,.04);AU.tone('sawtooth',2600,3500,.06,.035,.09)},
  creak(){AU.tone('sawtooth',72,50,1.1,.12,0,.5);AU.tone('sawtooth',97,58,.9,.06,.15,.5);AU.noise(.7,.08,320,140,'lowpass')},
  caw(v=1){AU.tone('sawtooth',840,560,.15,.05*v,0,.4);AU.tone('sawtooth',800,520,.17,.05*v,.22,.4)},
  squelch(){AU.noise(.2,.15,500,120,'lowpass');AU.tone('sine',160,60,.15,.1)},
  howl(){if(!AU.ctx)return;const c=AU.ctx,t=c.currentTime,o=c.createOscillator(),g=c.createGain(),v=c.createOscillator(),vg=c.createGain();
    o.type='sine';o.frequency.setValueAtTime(290,t);o.frequency.linearRampToValueAtTime(520,t+.9);o.frequency.linearRampToValueAtTime(470,t+2.2);o.frequency.linearRampToValueAtTime(350,t+3);
    v.frequency.value=5;vg.gain.value=7;v.connect(vg);vg.connect(o.frequency);
    g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.03,t+.6);g.gain.linearRampToValueAtTime(.0001,t+3);
    o.connect(g);g.connect(AU.fxIn);o.start(t);v.start(t);o.stop(t+3.1);v.stop(t+3.1)},
  sting(){[[293.7,0],[349.2,0],[415.3,0],[277.2,.28],[329.6,.28],[392,.28]].forEach(([f,d])=>AU.tone('square',f,f,.4,.05,d,.5))},
  die(){AU.noise(.6,.16,1600,90,'lowpass');AU.tone('sawtooth',220,40,.6,.08)},
  shrine(){[659,880,988,1318].forEach((f,i)=>AU.tone('sine',f,f*1.003,1,.05,i*.13,.9))},
  chest(){AU.noise(.35,.1,400,150,'lowpass');[523,659,784].forEach((f,i)=>AU.tone('triangle',f,f,.5,.06,.25+i*.09,.6))},
  fall(){[392,349,311,262].forEach((f,i)=>AU.tone('triangle',f,f*.98,.6,.08,i*.32,.6))}
};
const MUS={timer:null,
  start(boss){if(!AU.ctx)return;this.stop();this.boss=boss;this.step=0;this.next=AU.ctx.currentTime+.15;this.timer=setInterval(()=>this.tick(),40)},
  stop(){clearInterval(this.timer);this.timer=null},
  tick(){const c=AU.ctx,spb=60/(this.boss?112:96)/2;while(this.next<c.currentTime+.2){this.play(this.step,this.next);this.step++;this.next+=spb}},
  play(s,t){const i=s%16,bar=(s>>4)%4;
    const roots=this.boss?[73.4,69.3,65.4,77.8]:[73.4,73.4,58.3,65.4];const r=roots[bar];
    const pat=[1,0,1,0,1,0,0,1,1,0,1,0,1.5,0,1.2,0];
    if(pat[i])AU.tone('triangle',r*pat[i],r*pat[i],.22,.13,0,0,t);
    if(i%4===0)AU.tone('square',r/2,r/2,.12,.05,0,0,t);
    if(i%4===2)AU.noise(.04,.035,7000,5000,'highpass',0,1,t);
    if(i===0&&bar%2===0)AU.tone('sine',r*8,r*8,1.4,.035,0,.7,t);
    if(this.boss&&i===8)AU.tone('sawtooth',r*4*1.06,r*4,.5,.025,0,.5,t)}
};

