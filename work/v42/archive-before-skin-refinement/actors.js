(function(){
'use strict';
const {C,clamp,lerp,COLORS,stats}=DuelCore,TAU=Math.PI*2;
const ink='#161d29',dark='#252b37',mid='#3c424d',light='#5e636b',skin='#d99b68',skinLight='#f3c48d',skinDark='#985e48',metal='#a7b4b9',metalLight='#e1e5d8',metalDark='#657483',gold='#d6aa48',goldLight='#f5d275';
const tint=(hex,v)=>'#'+hex.slice(1).match(/../g).map(s=>Math.round(clamp(parseInt(s,16)*v,0,255)).toString(16).padStart(2,'0')).join('');
const HEADS={
 knight:[
 '      hhhh       ','     hhhwwh      ','    hwwwwwwh     ','   hwwwwwwmmh    ','   hwwmmmwmmmh   ','  hmwwmmmmmmdh   ','  hmmmmmmmmmmdh  ','  hmmdddddddddh  ','  hmddiiiiiiiih  ','  hmddhhhhhhhhh  ','   hmdhwwwwwmh   ','   hmdhwwwwmmh   ','    hdhwwwwmdh   ','    hdhwmmmddh   ','     hdddddih    ','      hiiih      '
 ],
 lancer:[
 '     hhhhh      ','   hhmmmhhhh    ','  hmmmmmhhhhhh  ',' hmmmmhhhhhhhh  ',' hmmmhhhhhkkkhh ',' hmmhhhhhkkkkh  ',' hhhhhhhklllkh  ','  hhhkhklllkhh  ','  hhhkllkiilkh  ','   hhklkklllk  ','    hklllllkk  ','     kkllkkk   ','      kkkkh    ','      kllkh    '
 ],
 assassin:[
 '    hhh        ','   hhmmhhh     ',' hhhmmmmhhhhh  ',' hmmmmhhhhhhhh ','  hmmmhhhhhhhh ',' hhhhhhhhkkkhh ','  hhhhhklllkhh ','   hhhkliilkh  ','   hhklllkkkh  ','   hhhiiiiihh  ','    hiiiiihh   ','    hiiiiih    ','     hhhhhh    '
 ],
 swordsman:[
 '      hh       ','   hh bb hh    ','   hbbbbb hh   ',' hhbbbccccbhh  ',' hbbbccccbbbhh ','  hbbbcbbbbbhh ',' hbbbbbbkkkkbh ',' hbbbbbkkllkbh ','  hbbbklliilkh ','   hbbklllllk  ','    hbkllllkk  ','     hkkllkk   ','      kkkkh    ','      kllkh    '
 ],
 reaper:[
 '     ccccc      ','   ccCCCCcc     ','  cCCCcccccc    ',' cCCCcciiiicc   ',' cCCciiiiiiiic  ',' cCciiiiiiiiic  ',' ccitiiiiitiic  ',' ccitiiiiitiic  ',' ccitiiiiitiic  ',' ccitiiiiiiiic  ','  cciiiiiiiicc  ','  cc iiiii cc   ','   cc iii cc    ','    ccccccc     ','     ccccc      '
 ]};
function sprite(c,rows,x,y,palette,scale=2){for(let j=0;j<rows.length;j++)for(let i=0;i<rows[j].length;i++){const col=palette[rows[j][i]];if(col){c.fillStyle=col;c.fillRect(Math.round(x+i*scale),Math.round(y+j*scale),scale,scale);}}}
function ik(a,b,l1,l2,bend){let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.001;const reach=Math.min(d,l1+l2-.1),ux=dx/d,uy=dy/d,along=(l1*l1-l2*l2+reach*reach)/(2*reach),h=Math.sqrt(Math.max(0,l1*l1-along*along));return{x:a.x+ux*along-uy*h*bend,y:a.y+uy*along+ux*h*bend};}
function smooth(a,b,dt,speed=18){return lerp(a,b,1-Math.exp(-dt*speed));}
class DuelActors{
 static state(r,f,t,portrait){if(portrait)return{time:t,run:clamp(Math.abs(f.vx)/stats(f).speed,0,1),dash:0,air:0,lean:f.vx?7:0,cloth:[]};r.actorHistory??=[];let st=r.actorHistory[f.id];if(!st||st.kind!==f.kind||Math.hypot(f.x-st.x,f.y-st.y)>330||t<st.time){st={kind:f.kind,time:t,x:f.x,y:f.y,run:0,dash:0,air:0,lean:0,cloth:[]};r.actorHistory[f.id]=st;}const dt=clamp(t-st.time,0,.035);st.run=smooth(st.run,clamp(Math.abs(f.vx)/stats(f).speed,0,1),dt);st.dash=smooth(st.dash,f.dashRemaining>0||f.state==='ultCharge'?1:0,dt,35);st.air=smooth(st.air,f.grounded?0:1,dt,25);st.lean=smooth(st.lean,clamp(f.vx/18,-22,22)+(f.kind==='assassin'?Math.sign(f.vx)*7:0)+(f.dashRemaining>0?f.dashX*15:0),dt,16);st.dt=dt;st.time=t;st.x=f.x;st.y=f.y;return st;}
 static ribbon(r,f,st,idx,anchor,length,width,color,t,portrait,back=-f.facing){const c=r.ctx,n=6,S=C.scale,world={x:f.x+anchor.x*S,y:f.y+anchor.y*S};let nodes=st.cloth[idx];
  if(!nodes){nodes=Array.from({length:n},(_,i)=>({x:world.x+back*i*length/n*.6*S,y:world.y+i*length/n*.7*S,px:world.x+back*i*length/n*.6*S,py:world.y+i*length/n*.7*S}));st.cloth[idx]=nodes;}
  if(portrait){for(let i=0;i<n;i++){nodes[i].x=world.x+back*i*length/n*.65*S;nodes[i].y=world.y+i*length/n*.65*S+Math.sin(t*4-i*.6)*2;}}
  else if(st.dt>0){const dt=st.dt;for(let i=1;i<n;i++){const p=nodes[i],vx=(p.x-p.px)*Math.exp(-dt*5),vy=(p.y-p.py)*Math.exp(-dt*5);p.px=p.x;p.py=p.y;p.x+=vx+(back*55-f.vx*.38+Math.sin(t*7-i)*45)*dt*dt;p.y+=vy+245*dt*dt;}}
  nodes[0].x=world.x;nodes[0].y=world.y;const spacing=length*S/(n-1);for(let pass=0;pass<5;pass++)for(let i=1;i<n;i++){const a=nodes[i-1],b=nodes[i],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,k=(d-spacing)/d;if(i>1){a.x+=dx*k*.4;a.y+=dy*k*.4;}b.x-=dx*k*(i===1?1:.6);b.y-=dy*k*(i===1?1:.6);}
  const points=nodes.map(p=>({x:(p.x-f.x)/S,y:(p.y-f.y)/S})),left=[],right=[];for(let i=0;i<n;i++){const a=points[Math.max(0,i-1)],b=points[Math.min(n-1,i+1)],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,w=width*(1-i/n*.55);left.push([points[i].x-dy/d*w*.5,points[i].y+dx/d*w*.5]);right.push([points[i].x+dy/d*w*.5,points[i].y-dx/d*w*.5]);}
  r.path([...left,...right.slice().reverse()],color,ink,2);r.path([...left,...points.slice().reverse().map(p=>[p.x,p.y])],tint(color,1.2));r.path(right,null,tint(color,.62),2);if(f.kind==='reaper'||f.kind==='lancer'){const a=left[n-1],b=right[n-1];r.line({x:a[0],y:a[1]},{x:b[0],y:b[1]},gold,3);}
 }
 static limb(r,a,j,b,width,base,shade,detail){r.line(a,j,ink,width+3);r.line(j,b,ink,width+2);r.line(a,j,base,width);r.line(j,b,shade,width-1);r.line({x:a.x-2,y:a.y},{x:j.x-2,y:j.y-1},detail,Math.max(2,width*.27));r.line({x:j.x-2,y:j.y+1},{x:b.x-2,y:b.y-2},base,2);}
 static draw(r,f,t,w,portrait=false){
  const old=r.ctx,c=r.actorCanvas||(r.actorCanvas=document.createElement('canvas'));if(!c.width||c.width!==280){c.width=280;c.height=280;}const ctx=c.getContext('2d',{willReadFrequently:true}),st=this.state(r,f,t,portrait),color=COLORS[f.color]?.hex||'#367f75',bright=tint(color,1.43),shade=tint(color,.58),side=f.facing||1;
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,280,280);ctx.setTransform(.5,0,0,.5,140,180);ctx.lineCap='butt';ctx.lineJoin='bevel';r.ctx=ctx;
  const phase=clamp(f.stateTime/(f.duration||1),0,1),wind=['startup','ultWindup','throwWindup'].includes(f.state)?Math.sin(phase*Math.PI/2):0,stroke=f.state==='active'||f.state==='ultCharge'?1:f.state==='recovery'?Math.pow(1-phase,2):0,aim=f.attackAim||0;
  const run=st.run*(1-st.air*.7)*(1-st.dash*.7),cycle=f.anim*1.55,backwalk=f.move*side<0,land=(f.landing||0)>0?Math.sin(f.landing/.15*Math.PI)*9:0;
  const bob=Math.sin(t*3.2+f.id)*1.3*(1-run)+Math.abs(Math.sin(cycle))*3*run,crouch=land+st.dash*14+(f.state==='parry'?3:0)+(f.kind==='assassin'?8:3)+(f.state==='parry'&&f.guard==='low'?9:0),recoil=['stunned','clash'].includes(f.state)?-side*Math.sin(Math.min(1,phase*3)*Math.PI)*10:0;
  const hip={x:st.lean*.35+Math.cos(aim)*stroke*2,y:-45+crouch+bob*.3},shoulder={x:st.lean+recoil+Math.cos(aim)*(stroke*15-wind*9),y:-93+crouch+bob-Math.sin(-aim)*wind*2},head={x:shoulder.x+side*2,y:shoulder.y-18};
  const low=clamp((f.slideRemaining||0)/.12,0,1);if(low){hip.x=lerp(hip.x,-side*3,low);hip.y=lerp(hip.y,-14,low);shoulder.x=lerp(shoulder.x,-side*15,low);shoulder.y=lerp(shoulder.y,-31,low);head.x=shoulder.x+side*3;head.y=lerp(head.y,-43,low);}if(f.state==='feintRecovery'){shoulder.x-=Math.cos(f.attackAim)*Math.sin(phase*Math.PI)*10;head.x=shoulder.x+side*2;}if(f.state==='kickActive'){hip.x+=f.kickSide*10;shoulder.x-=f.kickSide*5;}
  const death=clamp((f.deathTime||0)/.48,0,1);if(f.dead){ctx.translate(side*death*10,0);ctx.rotate(side*(1-Math.pow(1-death,3))*1.49);ctx.globalAlpha=1-death*.25;}
  const stride=backwalk?26:36,feet=[0,1].map(i=>{const a=cycle+i*Math.PI,ground={x:Math.sin(a)*stride*run+(i?1:-1)*lerp(23,4,run),y:-Math.max(0,Math.cos(a))*14*run},lift=clamp(-f.vy/800,0,1),fall=clamp(f.vy/700,0,1),air={x:(i?side*17:-side*18)+st.lean*.25,y:i?-9-lift*17:-3-fall*8};return{x:lerp(ground.x,air.x,st.air)-(f.dashX||0)*st.dash*(i?25:42),y:lerp(ground.y,air.y,st.air)-(i?4:10)*st.dash};});
  if(low){feet[0]={x:-side*24,y:-3};feet[1]={x:side*43,y:0};}if(f.wallJumpTime>0){feet[0]={x:-Math.sign(f.vx)*21,y:-23};feet[1]={x:Math.sign(f.vx)*25,y:-6};}if(['kickStartup','kickActive','kickRecovery'].includes(f.state)){const k=f.state==='kickStartup'?phase*.3:f.state==='kickActive'?1:Math.pow(1-phase,2);feet[1]={x:lerp(side*20,f.kickSide*62,k),y:lerp(-4,-65,k)};}
  if(f.skin==='kite'){this.ribbon(r,f,st,0,{x:head.x-side*8,y:head.y-4},53,14,'#d1d0ca',t,portrait);}else if(f.skin==='thorfinn'){this.ribbon(r,f,st,0,{x:hip.x-side*9,y:hip.y-5},28,12,color,t,portrait);}else if(f.skin==='guts'){this.ribbon(r,f,st,0,{x:shoulder.x-side*10,y:shoulder.y},69,26,'#303540',t,portrait);}else if(f.kind==='boxer'){this.ribbon(r,f,st,0,{x:hip.x-side*8,y:hip.y-4},35,9,color,t,portrait);}else if(f.kind==='assassin'){this.ribbon(r,f,st,0,{x:shoulder.x-side*6,y:shoulder.y-7},72,10,color,t,portrait);this.ribbon(r,f,st,1,{x:shoulder.x-side*6,y:shoulder.y-4},55,7,bright,t+.4,portrait);}
  else if(f.kind==='knight'){this.ribbon(r,f,st,0,{x:shoulder.x-side*13,y:shoulder.y-2},65,27,color,t,portrait);}
  else if(f.kind==='reaper'){this.ribbon(r,f,st,0,{x:shoulder.x-side*12,y:shoulder.y-9},77,24,color,t,portrait);this.ribbon(r,f,st,1,{x:hip.x+side*12,y:hip.y-18},44,16,color,t+.5,portrait,-side*.5);}
  else if(f.kind==='swordsman'){this.ribbon(r,f,st,0,{x:hip.x-side*12,y:hip.y-7},48,20,color,t,portrait);this.ribbon(r,f,st,1,{x:hip.x+side*10,y:hip.y-4},42,15,shade,t+.4,portrait,side);}
  else{this.ribbon(r,f,st,0,{x:hip.x-side*8,y:hip.y-2},33,10,color,t,portrait);this.ribbon(r,f,st,1,{x:head.x-side*10,y:head.y-17},38,13,dark,t,portrait);}
  // Asymmetric leg targets and two-bone joints keep planted feet and bent knees.
  for(const i of[0,1]){const root={x:hip.x+(i?6:-6),y:hip.y},knee=ik(root,feet[i],26,28,-side);this.limb(r,root,knee,feet[i],i?11:10,i?mid:dark,i?dark:ink,light);const foot=feet[i];r.path([[foot.x-6,foot.y-5],[foot.x+5,foot.y-6],[foot.x+side*13,foot.y+1],[foot.x+side*13,foot.y+4],[foot.x-6,foot.y+4]],ink);r.line({x:foot.x-4,y:foot.y+2},{x:foot.x+side*11,y:foot.y+2},f.kind==='knight'?metalDark:color,3);if(f.kind==='knight'){r.line(knee,{x:lerp(knee.x,foot.x,.8),y:lerp(knee.y,foot.y,.8)},metalDark,9);r.line({x:knee.x-2,y:knee.y},{x:lerp(knee.x,foot.x,.8)-2,y:lerp(knee.y,foot.y,.8)},metal,4);r.path([[knee.x-6,knee.y-4],[knee.x+5,knee.y-5],[knee.x+7,knee.y+2],[knee.x-3,knee.y+5]],metal);r.line({x:knee.x-4,y:knee.y-3},{x:knee.x+4,y:knee.y-4},metalLight,2);}else{r.line({x:lerp(knee.x,foot.x,.8),y:lerp(knee.y,foot.y,.8)},{x:lerp(knee.x,foot.x,.93),y:lerp(knee.y,foot.y,.93)},f.kind==='lancer'?gold:color,5);}}
  const hand={x:(w.hand.x-f.x)/C.scale,y:(w.hand.y-f.y)/C.scale},two=['lancer','swordsman','reaper'].includes(f.kind),free={x:shoulder.x-side*19-Math.sin(cycle)*run*11,y:shoulder.y+32+Math.cos(cycle)*run*7},second=two?{x:hand.x-Math.cos(w.angle)*16,y:hand.y-Math.sin(w.angle)*16}:free;
  const arm=(target,front)=>{const root={x:shoulder.x+(front?side*15:-side*15),y:shoulder.y+8},j=ik(root,target,25,25,(front?1:-1)*side);this.limb(r,root,j,target,front?9:8,(f.kind==='lancer'||f.kind==='boxer'&&f.skin!=='yuji')?skin:dark,(f.kind==='lancer'||f.kind==='boxer'&&f.skin!=='yuji')?skinDark:shade,(f.kind==='lancer'||f.kind==='boxer'&&f.skin!=='yuji')?skinLight:mid);if(f.kind==='knight'){r.line(root,j,metalDark,9);r.line(root,{x:lerp(root.x,j.x,.65),y:lerp(root.y,j.y,.65)},metal,6);r.line({x:lerp(j.x,target.x,.25),y:lerp(j.y,target.y,.25)},target,metal,7);}else if(f.kind!=='lancer'){r.line(j,{x:lerp(j.x,target.x,.7),y:lerp(j.y,target.y,.7)},mid,7);r.line({x:lerp(j.x,target.x,.62),y:lerp(j.y,target.y,.62)},{x:lerp(j.x,target.x,.74),y:lerp(j.y,target.y,.74)},f.kind==='assassin'?color:gold,6);}r.ellipse(target.x,target.y,4,4,ink);r.ellipse(target.x,target.y-1,3,3,skin);};
  if(f.kind==='boxer'){second.x=shoulder.x+side*17+Math.sin(t*6)*2;second.y=shoulder.y+8+Math.cos(t*5)*2;if(f.punch){const saved={...hand};hand.x=second.x;hand.y=second.y;second.x=saved.x;second.y=saved.y;}}
  arm(second,false);if(f.kind==='boxer'&&f.punch){r.ellipse(second.x,second.y,5,5,f.skin==='yuji'?'#6acfe0':'#89929b');}
  r.path([[shoulder.x-18,shoulder.y],[shoulder.x+18,shoulder.y],[hip.x+14,hip.y],[hip.x-13,hip.y]],ink,ink,3);
  const torso=f.kind==='assassin'?dark:color;r.path([[shoulder.x-15,shoulder.y+3],[shoulder.x+15,shoulder.y+3],[hip.x+10,hip.y-7],[hip.x-10,hip.y-7]],torso);r.path([[shoulder.x-15,shoulder.y+4],[shoulder.x-2,shoulder.y+9],[hip.x-2,hip.y-7],[hip.x-10,hip.y-7]],f.kind==='assassin'?mid:shade);
  if(f.kind==='knight'){r.path([[shoulder.x-12,shoulder.y+5],[shoulder.x+12,shoulder.y+5],[hip.x+10,hip.y-20],[hip.x,hip.y-12],[hip.x-10,hip.y-20]],metalDark,ink,2);r.path([[shoulder.x-10,shoulder.y+6],[shoulder.x+8,shoulder.y+6],[hip.x+7,hip.y-23],[hip.x-9,hip.y-20]],metal);r.line({x:shoulder.x-7,y:shoulder.y+8},{x:shoulder.x+8,y:shoulder.y+8},metalLight,3);r.path([[shoulder.x+side*10,shoulder.y],[shoulder.x+side*22,shoulder.y+5],[shoulder.x+side*21,shoulder.y+15],[shoulder.x+side*8,shoulder.y+13]],metal,ink,2);r.path([[hip.x-9,hip.y-3],[hip.x+7,hip.y-3],[hip.x+6,hip.y+19],[hip.x-10,hip.y+14]],color,ink,2);}
  else if(f.kind==='lancer'){r.path([[shoulder.x-8,shoulder.y],[shoulder.x+1,shoulder.y+13],[shoulder.x+10,shoulder.y],[shoulder.x+10,shoulder.y+6],[shoulder.x+1,shoulder.y+20],[shoulder.x-10,shoulder.y+7]],goldLight);r.line({x:shoulder.x-side*10,y:shoulder.y+10},{x:hip.x+side*8,y:hip.y-8},'#6e4e37',5);r.path([[hip.x-8,hip.y],[hip.x+6,hip.y],[hip.x+10,hip.y+21],[hip.x+1,hip.y+28],[hip.x-6,hip.y+19]],color,ink,2);r.line({x:hip.x-5,y:hip.y+2},{x:hip.x-2,y:hip.y+17},bright,3);}
  else if(f.kind==='swordsman'){r.path([[shoulder.x-13,shoulder.y-4],[shoulder.x-2,shoulder.y+12],[hip.x-3,hip.y-10],[shoulder.x-7,shoulder.y+8]],bright);r.path([[shoulder.x+13,shoulder.y-4],[shoulder.x+1,shoulder.y+12],[hip.x+4,hip.y-10],[shoulder.x+7,shoulder.y+8]],shade);r.line({x:shoulder.x+3,y:shoulder.y+13},{x:hip.x+4,y:hip.y-10},gold,2);}
  else if(f.kind==='reaper'){r.path([[shoulder.x-15,shoulder.y-7],[shoulder.x,shoulder.y+11],[shoulder.x+15,shoulder.y-7],[shoulder.x+15,shoulder.y+14],[hip.x,hip.y-5],[shoulder.x-15,shoulder.y+14]],color,ink,2);r.line({x:shoulder.x,y:shoulder.y+12},{x:hip.x,y:hip.y-8},gold,2);}
  else{r.line({x:shoulder.x-side*10,y:shoulder.y+4},{x:hip.x+side*10,y:hip.y-6},'#51525a',4);r.line({x:shoulder.x-12,y:shoulder.y-1},{x:shoulder.x+12,y:shoulder.y+2},color,9);}
  r.line({x:hip.x-14,y:hip.y-4},{x:hip.x+14,y:hip.y-4},ink,7);r.line({x:hip.x-12,y:hip.y-6},{x:hip.x+12,y:hip.y-6},f.kind==='assassin'?color:'#655141',4);ctx.fillStyle=f.kind==='assassin'?bright:gold;ctx.fillRect(hip.x-3,hip.y-9,6,6);
  if(f.kind==='assassin')this.ribbon(r,f,st,2,{x:hip.x+side*5,y:hip.y-4},35,9,color,t,portrait,side);
  DuelSkins.dress(r,f,{hip,shoulder,head,side,st,t,portrait});
  arm(hand,true);
  r.line({x:shoulder.x,y:shoulder.y+3},{x:head.x,y:head.y+8},f.kind==='reaper'?ink:skinDark,9);
  ctx.save();ctx.translate(head.x,head.y);ctx.rotate(clamp(Math.sin(f.aim)*side*.22,-.22,.22));ctx.scale(side,1);const rows=HEADS[f.kind]||HEADS.knight,pal={h:dark,i:ink,m:metalDark,w:metalLight,d:metal,k:skinDark,l:skinLight,c:color,C:bright,t:goldLight,b:'#343d65'};
  if(f.kind!=='knight'){pal.h=f.kind==='assassin'?'#292932':ink;pal.m=f.kind==='lancer'?'#655347':'#62616b';}if(!DuelSkins.head(r,f))sprite(ctx,rows,-rows[0].length, -rows.length,pal);ctx.restore();
  if(f.kind==='lancer'){r.line({x:head.x-side*9,y:head.y-13},{x:head.x-side*13,y:head.y-16},goldLight,4);}
  // Weapon poses snap on the active beat. Damage is exclusively the separate slash.
  const local=p=>({x:(p.x-f.x)/C.scale,y:(p.y-f.y)/C.scale}),lw={...w,hand:local(w.hand),a:local(w.a),b:local(w.b),segments:w.segments.map(s=>({a:local(s.a),b:local(s.b)})),shaft:w.shaft?{a:local(w.shaft.a),b:local(w.shaft.b)}:null};
  DuelWeapons.draw(r,{...f,x:0,y:0,dead:false,state:f.state==='parry'?'idle':f.state},lw,t,true);
  if(f.state==='stunned'){for(let i=0;i<3;i++){ctx.fillStyle=goldLight;ctx.fillRect(head.x+Math.cos(t*16+i*TAU/3)*18-1,head.y-28+Math.sin(t*16+i*TAU/3)*4,3,3);}}
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
  // Quantize the coverage of the small rig canvas before nearest-neighbor scaling.
  // Bone interpolation remains continuous; the final character has a crisp 2 px grid.
  const pixels=ctx.getImageData(0,0,280,280),data=pixels.data;for(let i=3;i<data.length;i+=4)data[i]=data[i]<112?0:255;ctx.putImageData(pixels,0,0);r.ctx=old;old.save();old.imageSmoothingEnabled=false;
  const left=f.x-280*C.scale,top=f.y-360*C.scale,size=560*C.scale;
  if(!portrait&&(f.dashRemaining>0||f.state==='ultCharge')&&!r.reduced){for(let i=3;i>=1;i--){old.globalAlpha=.045*(4-i);old.drawImage(c,left-(f.state==='ultCharge'?f.ultSide:f.dashX)*i*17,top-f.dashY*i*17,size,size);}}old.globalAlpha=1;old.drawImage(c,left,top,size,size);old.restore();
 }
}
window.DuelActors=DuelActors;
})();
