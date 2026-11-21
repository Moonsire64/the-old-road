/* ================= HD PIXELS =================
   The game is laid out on its original pixel grid, but drawn at twice the resolution.
   Every sprite gets a 2x version the first time it is drawn: edges are smoothed pixel-art style (Scale2x)
   and a one-sub-pixel rim of light and shade is added inside the outline. The ground is rendered at 2x natively. */
const HDK=2;
const _di=CanvasRenderingContext2D.prototype.drawImage;
function hdUp(c){const w=c.width,h=c.height;let s;try{s=new Uint32Array(c.getContext('2d').getImageData(0,0,w,h).data.buffer)}catch(e){return null}
  const W2=w*2,H2=h*2,o=cvs(W2,H2),ox=o.getContext('2d'),O=ox.createImageData(W2,H2),q=new Uint32Array(O.data.buffer);
  const g=(x,y)=>x<0||y<0||x>=w||y>=h?0:s[y*w+x];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const P=s[y*w+x],A=g(x,y-1),B=g(x+1,y),C=g(x-1,y),D=g(x,y+1);
    let e0=P,e1=P,e2=P,e3=P;
    if(C===A&&C!==D&&A!==B)e0=A;if(A===B&&A!==C&&B!==D)e1=B;if(D===C&&D!==B&&C!==A)e2=C;if(B===D&&B!==A&&D!==C)e3=D;
    const i=(2*y)*W2+2*x;q[i]=e0;q[i+1]=e1;q[i+W2]=e2;q[i+W2+1]=e3}
  /* rim light from the top-left, shade to the bottom-right, softened colour boundaries */
  const r=new Uint32Array(q),lum=v=>(v&255)*.3+((v>>8)&255)*.59+((v>>16)&255)*.11,dark=v=>(v>>>24)<128||lum(v)<20;
  const mix=(a,b,t)=>{const r0=a&255,g0=(a>>8)&255,b0=(a>>16)&255;return(((a>>>24)<<24)|((Math.round(((b>>16)&255)*t+b0*(1-t)))<<16)|((Math.round(((b>>8)&255)*t+g0*(1-t)))<<8)|Math.round((b&255)*t+r0*(1-t)))>>>0};
  const LIGHT=0xfff0ffff>>>0,SHADE=0xff000000>>>0;
  for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const i=y*W2+x,p=q[i];if(dark(p))continue;
    const up=y?q[i-W2]:0,lf=x?q[i-1]:0,dn=y<H2-1?q[i+W2]:0,rt=x<W2-1?q[i+1]:0;
    if(dark(up)||dark(lf))r[i]=mix(p,LIGHT,.16);else if(dark(dn)||dark(rt))r[i]=mix(p,SHADE,.2);
    else if(up!==p&&!dark(up))r[i]=mix(p,up,.28);else if(lf!==p&&!dark(lf))r[i]=mix(p,lf,.28)}
  new Uint32Array(O.data.buffer).set(r);ox.putImageData(O,0,0);o._nohd=1;return o}
CanvasRenderingContext2D.prototype.drawImage=function(src,...a){
  if(this._hd&&src&&src.width&&src instanceof HTMLCanvasElement){let h=src._hd;
    if(!h&&!src._nohd){if(src.width*src.height<=24000&&!src._live){h=src._hd=hdUp(src);if(!h)src._nohd=1}else src._nohd=1}
    if(h){if(a.length===2)return _di.call(this,h,a[0],a[1],src.width,src.height);
      if(a.length===4)return _di.call(this,h,a[0],a[1],a[2],a[3]);
      if(a.length===8)return _di.call(this,h,a[0]*HDK,a[1]*HDK,a[2]*HDK,a[3]*HDK,a[4],a[5],a[6],a[7])}}
  return _di.call(this,src,...a)};
