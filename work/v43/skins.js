(function(){
'use strict';
const ink='#19232c',bone='#eeeadd';
const between=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
// Clothing follows the existing joints. These shapes never participate in combat collision.
function band(r,a,b,t,width,color,length=.12){r.line(between(a,b,t),between(a,b,Math.min(1,t+length)),color,width);}
function plate(r,a,b,width,base,light){const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,n={x:-dy/d,y:dx/d},p=(v,k)=>[v.x+n.x*k,v.y+n.y*k];r.path([p(a,-width*.5),p(a,width*.5),p(b,width*.34),p(b,-width*.34)],base,ink,2);r.line({x:a.x-n.x*width*.25,y:a.y-n.y*width*.25},{x:b.x-n.x*width*.2,y:b.y-n.y*width*.2},light,2);}
class DuelSkins{
 static active(f){return f.skin!=='default'&&DuelCore.SKINS[f.kind]?.id===f.skin;}
 static cloth(r,f,p){if(!this.active(f))return false;const{hip:h,shoulder:b,head,st,t,portrait,side}=p,s=f.skin;
  const ribbon=(idx,a,len,width,col,back=-side)=>DuelActors.ribbon(r,f,st,idx,a,len,width,col,t+idx*.2,portrait,back,null);
  if(s==='hollow'){ribbon(0,{x:b.x-side*11,y:b.y+1},61,32,'#3d4659');ribbon(1,{x:b.x+side*10,y:b.y+4},52,21,'#4b576b',-side*.5);ribbon(2,{x:b.x-side*16,y:b.y+11},48,14,'#30394d');}
  if(s==='thorfinn'){ribbon(0,{x:h.x-side*9,y:h.y-9},27,19,'#796445');ribbon(1,{x:h.x+side*8,y:h.y-8},23,15,'#918060',side*.25);}
  if(s==='katakuri'){ribbon(0,{x:b.x-side*13,y:b.y-6},43,17,'#c6b5b3');ribbon(1,{x:h.x-side*9,y:h.y-11},26,13,'#4d303e');}
  if(s==='guts'){ribbon(0,{x:b.x-side*12,y:b.y-4},77,31,'#222733');ribbon(1,{x:b.x-side*17,y:b.y+5},61,19,'#2e3440');}
  if(s==='kite'){ribbon(0,{x:head.x-side*10,y:head.y-7},66,19,'#c9c9c6');ribbon(1,{x:head.x-side*5,y:head.y+4},55,9,'#e2dfd5');ribbon(2,{x:h.x-side*9,y:h.y-8},18,15,'#cfc9b4');}
  if(s==='yuji'){ribbon(0,{x:b.x-side*9,y:b.y-6},18,14,'#923c48');ribbon(1,{x:h.x-side*9,y:h.y-10},12,12,'#26324b');}
  return true;
 }
 static leg(r,f,p){if(!this.active(f))return false;const{root,knee,foot,side,i}=p,s=f.skin;
  const colors={hollow:['#202832','#121b25','#3a4653'],thorfinn:['#625540','#443d33','#8d7b58'],katakuri:['#473142','#2f2633','#6b485c'],guts:['#333a43','#202831','#66717a'],kite:['#7e9aab','#526e83','#b3c5c7'],yuji:['#2c374e','#20293d','#4b5b74']}[s];
  DuelActors.limb(r,root,knee,foot,s==='hollow'?8:s==='kite'?13:11,colors[0],colors[1],colors[2]);
  let boot='#313239',sole='#7c7370';
  if(s==='hollow'){boot='#17202b';sole='#424958';}
  if(s==='thorfinn'){boot='#493a2e';sole='#a08a65';r.line(between(knee,foot,.35),foot,'#9b8a68',9);for(const t of[.4,.6,.8])band(r,knee,foot,t,10,'#c3b28e',.065);r.line(between(knee,foot,.78),foot,boot,10);}
  if(s==='katakuri'){boot='#28252f';sole='#96888c';plate(r,between(knee,foot,.3),foot,12,boot,'#655560');band(r,root,knee,.75,12,'#ae8c93',.055);for(const t of[.36,.58,.8])band(r,knee,foot,t,13,'#a79592',.055);band(r,root,knee,.36,12,ink,.09);}
  if(s==='guts'){boot='#303945';sole='#90999d';plate(r,between(root,knee,.18),between(root,knee,.85),13,'#424b55','#77828b');plate(r,between(knee,foot,.15),foot,12,'#3c4652','#899397');r.path([[knee.x-7,knee.y-5],[knee.x+5,knee.y-6],[knee.x+8,knee.y+1],[knee.x,knee.y+6],[knee.x-7,knee.y+2]],'#636d75',ink,2);}
  if(s==='kite'){boot='#59483e';sole='#a18a6d';r.line(between(knee,foot,.63),foot,boot,12);band(r,knee,foot,.59,13,'#b3a084',.12);band(r,root,knee,.6,13,colors[1],.06);}
  if(s==='yuji'){boot='#a74950';sole='#d0ad9b';r.line(between(knee,foot,.7),foot,boot,11);band(r,knee,foot,.7,12,'#de746e',.1);band(r,root,knee,.25,10,'#3b4a64',.06);}
  r.path([[foot.x-side*6,foot.y-7],[foot.x+side*5,foot.y-7],[foot.x+side*13,foot.y-1],[foot.x+side*13,foot.y+4],[foot.x-side*7,foot.y+4]],boot,ink,2);r.line({x:foot.x-side*5,y:foot.y+2},{x:foot.x+side*11,y:foot.y+2},sole,2);
  if(s==='yuji'||s==='thorfinn')r.line({x:foot.x,y:foot.y-4},{x:foot.x+side*5,y:foot.y-2},s==='yuji'?'#eed0b9':'#b6a083',2);
  return true;
 }
 static fist(r,f,a,t=0){r.ellipse(a.x,a.y,4,4,ink);r.ellipse(a.x,a.y-1,3,3,'#e5b381');if(f.skin!=='yuji')return;const c=r.ctx;for(let i=0;i<4;i++){const ang=i*Math.PI/2+t*7,radius=7+Math.sin(t*11+i)*1.5;c.fillStyle=i%2?'#479dbc':'#79d6de';c.fillRect(Math.round(a.x+Math.cos(ang)*radius)-1,Math.round(a.y+Math.sin(ang)*radius)-1,3,4);}r.line({x:a.x-3,y:a.y+2},{x:a.x+3,y:a.y+2},'#64bfcf',2);}
 static arm(r,f,p){if(!this.active(f))return false;const{root,j,target,front,t}=p,s=f.skin,col=DuelCore.COLORS[f.color].hex;
  const colors={hollow:['#252e3b','#1b2531','#495364'],thorfinn:['#9c8a67','#756547','#c2ad81'],katakuri:['#ce957b','#a96c62','#edb599'],guts:['#414b55','#313c49','#7e8993'],kite:['#d9d5c4','#b9b6a4','#f0ecd9'],yuji:['#2b374f','#202b40','#53617b']}[s];
  DuelActors.limb(r,root,j,target,s==='kite'?12:s==='hollow'?8:10,...colors);
  if(s==='thorfinn'){band(r,j,target,.56,12,'#c9b994',.21);band(r,j,target,.8,10,'#634e39',.13);r.line(between(root,j,.23),between(root,j,.57),'#b4a07a',2);}
  if(s==='katakuri'){band(r,root,j,.26,11,'#8d3e59',.22);band(r,root,j,.7,11,'#83394f',.12);band(r,j,target,.15,11,'#8d3e59',.12);band(r,j,target,.7,12,ink,.22);band(r,j,target,.74,13,'#9d8b92',.065);}
  if(s==='guts'){plate(r,root,between(root,j,.72),13,'#4d5762','#94a0a5');plate(r,between(j,target,.12),between(j,target,.91),front?12:14,front?'#4f5a67':'#697881','#a4acaa');band(r,j,target,.65,13,ink,.07);band(r,j,target,.83,13,'#87908e',.065);}
  if(s==='kite'){band(r,j,target,.78,13,'#efebd6',.16);band(r,root,j,.22,12,'#b5b3a2',.05);}
  if(s==='yuji'){band(r,j,target,.72,11,'#a04b51',.2);band(r,root,j,.22,10,col,.1);}
  r.ellipse(target.x,target.y,4,4,ink);r.ellipse(target.x,target.y-1,3,3,s==='hollow'?'#303b48':s==='guts'?'#73808a':'#e5b381');if(s==='yuji')this.fist(r,f,target,t);return true;
 }
 static neck(f){return f.skin==='hollow'?'#1d2632':f.skin==='yuji'?'#9a454c':f.skin==='katakuri'?'#d5c6bc':'#ab7555';}
 static head(r,f){const c=r.ctx,s=f.skin;if(s==='hollow'){
  // Broad ivory mask, curved horns and deep eye sockets; no human chin or helmet.
  r.path([[-12,-10],[-19,-17],[-22,-27],[-20,-38],[-16,-45],[-16,-32],[-13,-25],[-8,-21],[8,-21],[13,-25],[16,-32],[16,-45],[20,-38],[22,-27],[19,-17],[12,-10]],'#e5e3d4',ink,2);
  r.path([[-12,-21],[-19,-13],[-19,0],[-15,11],[-8,16],[8,16],[15,11],[19,0],[19,-13],[12,-21]],bone,ink,2);r.path([[-17,-12],[-17,0],[-12,11],[-5,14],[-10,7],[-12,-8]],'#c6cbbb');r.path([[-12,-16],[11,-16],[15,-10],[11,-12],[-10,-12]],'#fffae9');
  r.ellipse(-8,-1,4.5,7,'#111a24');r.ellipse(8,-1,4.5,7,'#111a24');return true;}
  if(f.kind!=='boxer'&&(!s||s==='default'))return false;
  // Small block clusters use the same two-pixel grid as the animated body rig.
  r.path([[-11,-10],[10,-10],[12,6],[6,12],[-6,11],[-12,3]],'#e5b381',ink,2);r.path([[-11,-9],[-5,-6],[-6,7],[3,11],[-7,11],[-12,2]],'#ab7555');c.fillStyle=ink;c.fillRect(4,-1,5,2);c.fillStyle='#f2c998';c.fillRect(1,3,9,4);
  const hair=s==='thorfinn'?'#d4ad61':s==='yuji'?'#d18a88':s==='kite'?'#d4d3cf':s==='katakuri'?'#873d57':'#30313a';
  r.path([[-13,3],[-15,-11],[-10,-19],[-5,-17],[-1,-22],[3,-17],[10,-20],[9,-14],[15,-12],[10,-6],[6,-9],[0,-3],[-4,-9],[-10,-3]],hair,ink,2);
  if(s==='yuji'){c.fillStyle='#774f62';c.fillRect(-12,-8,5,10);c.fillStyle='#e9a39a';c.fillRect(-6,-17,8,4);}
  if(s==='thorfinn'){r.path([[-13,-6],[-15,7],[-10,10],[-8,-1]],hair);c.fillStyle='#ecd096';c.fillRect(-7,-15,6,4);}
  if(s==='guts'){c.fillStyle=ink;c.fillRect(4,-1,6,3);r.line({x:3,y:4},{x:10,y:5},'#995e4b',2);}
  if(s==='katakuri'){r.path([[-14,3],[15,3],[14,15],[-11,14]],'#ddd2c2',ink,2);r.line({x:-10,y:8},{x:13,y:8},'#ad9894',3);}
  if(s==='kite'){r.path([[-17,-11],[-12,-21],[11,-21],[15,-10],[19,-6],[-20,-6]],'#e1c99e',ink,2);c.fillStyle='#8e674d';c.fillRect(-13,-12,29,4);}
  return true;
 }
 static dress(r,f,p){const s=f.skin,{hip:h,shoulder:b,side,t}=p,col=DuelCore.COLORS[f.color].hex;
  const torso=(base,shadow,highlight,width=16)=>{r.path([[b.x-width,b.y],[b.x+width,b.y],[h.x+13,h.y+1],[h.x-13,h.y+1]],base,ink,2);r.path([[b.x-width+1,b.y+2],[b.x-4,b.y+6],[h.x-2,h.y-4],[h.x-12,h.y-1]],shadow);r.line({x:b.x+width-5,y:b.y+7},{x:h.x+8,y:h.y-8},highlight,2);};
  const belt=(base,width=6)=>{r.line({x:h.x-14,y:h.y-7},{x:h.x+14,y:h.y-7},base,width);r.ctx.fillStyle='#bfad89';r.ctx.fillRect(h.x-3,h.y-10,6,6);r.ctx.fillStyle=base;r.ctx.fillRect(h.x-1,h.y-8,2,2);};
  if(!this.active(f)){if(f.kind==='boxer'){r.path([[b.x-15,b.y+1],[b.x+15,b.y+1],[h.x+12,h.y-7],[h.x-11,h.y-7]],'#30343b',ink,2);r.line({x:b.x-side*10,y:b.y+3},{x:h.x+side*5,y:h.y-8},'#535861',4);r.line({x:h.x-13,y:h.y-5},{x:h.x+12,y:h.y-5},col,6);}return;}
  if(s==='hollow'){
   torso('#303b4e','#263245','#58657a');const wave=Math.sin(t*4)*2;
   r.path([[b.x-20,b.y-3],[b.x+19,b.y-3],[b.x+22,b.y+15],[h.x+22,h.y+12],[h.x+12,h.y+7],[h.x+4,h.y+17+wave],[h.x-4,h.y+10],[h.x-14,h.y+16-wave],[h.x-23,h.y+8],[b.x-23,b.y+17]],'#455268',ink,2);
   r.path([[b.x-18,b.y+2],[b.x-5,b.y+7],[h.x-6,h.y+8],[h.x-14,h.y+16-wave],[h.x-23,h.y+8]],'#313d53');r.path([[b.x+4,b.y+7],[b.x+14,b.y+3],[h.x+14,h.y+5],[h.x+4,h.y+17+wave]],'#526077');
   r.path([[b.x-20,b.y-4],[b.x-8,b.y-8],[b.x,b.y-2],[b.x+9,b.y-8],[b.x+19,b.y-3],[b.x+9,b.y+9],[b.x,b.y+6],[b.x-11,b.y+10]],'#69768a',ink,2);r.line({x:b.x-10,y:b.y+5},{x:b.x+8,y:b.y+4},col,3);
  }
  if(s==='thorfinn'){
   torso('#918064','#6b5c44','#c1ad84',17);r.path([[h.x-14,h.y-9],[h.x+14,h.y-9],[h.x+17,h.y+13],[h.x+6,h.y+16],[h.x+1,h.y+8],[h.x-4,h.y+15],[h.x-18,h.y+13]],'#8c7858',ink,2);r.line({x:h.x+5,y:h.y-1},{x:h.x+9,y:h.y+12},'#bca57a',2);
   r.path([[b.x-19,b.y-3],[b.x-10,b.y-8],[b.x,b.y+1],[b.x+11,b.y-8],[b.x+19,b.y-1],[b.x+19,b.y+9],[b.x+13,b.y+5],[b.x+9,b.y+12],[b.x+5,b.y+8],[b.x,b.y+16],[b.x-5,b.y+9],[b.x-11,b.y+12],[b.x-14,b.y+5],[b.x-20,b.y+8]],'#d1c3a2',ink,2);r.line({x:b.x-13,y:b.y-1},{x:b.x-3,y:b.y+6},'#eee0bc',3);
   r.line({x:b.x-side*11,y:b.y+9},{x:h.x+side*10,y:h.y-6},'#4a3b2e',5);belt('#524130');r.line({x:h.x-side*10,y:h.y-8},{x:h.x-side*10,y:h.y+5},col,4);r.line({x:b.x,y:b.y+14},{x:b.x,y:b.y+22},'#493e31',2);
  }
  if(s==='katakuri'){
   torso('#c78e77','#965f56','#e7b493',18);r.path([[b.x-19,b.y],[b.x-10,b.y+3],[h.x-6,h.y-2],[h.x-16,h.y+7]],'#402b3c',ink,2);r.path([[b.x+10,b.y+3],[b.x+19,b.y],[h.x+16,h.y+7],[h.x+6,h.y-2]],'#513142',ink,2);
   r.line({x:b.x-2,y:b.y+12},{x:h.x+5,y:h.y-16},'#943e5a',4);r.line({x:b.x+3,y:b.y+16},{x:h.x-4,y:h.y-20},'#a64b63',3);
   for(const side of[-1,1])for(let i=0;i<3;i++)r.ellipse(b.x+side*(15-i),b.y+10+i*9,2,2,'#c5b2b0');belt('#252630',8);r.line({x:h.x-12,y:h.y-6},{x:h.x-5,y:h.y-6},col,3);
   r.path([[b.x-23,b.y-7],[b.x-11,b.y-13],[b.x+13,b.y-11],[b.x+23,b.y-5],[b.x+18,b.y+6],[b.x+9,b.y+10],[b.x-16,b.y+7],[b.x-24,b.y+1]],'#dbcec5',ink,2);r.line({x:b.x-17,y:b.y-3},{x:b.x+16,y:b.y-2},'#a99094',3);r.line({x:b.x-12,y:b.y+3},{x:b.x+10,y:b.y+5},'#b8a5a2',2);
  }
  if(s==='guts'){
   torso('#3b444e','#242d39','#697680',18);r.path([[b.x-15,b.y+6],[b.x,b.y+11],[b.x+15,b.y+6],[h.x+11,h.y-20],[h.x,h.y-13],[h.x-12,h.y-20]],'#535f68',ink,2);r.line({x:b.x-11,y:b.y+9},{x:b.x-3,y:b.y+14},'#8f9b9f',2);
   for(let i=0;i<3;i++)r.path([[h.x-12,h.y-21+i*6],[h.x,h.y-18+i*6],[h.x+12,h.y-21+i*6]],null,'#8a9599',2);
   for(const a of[-1,1])r.path([[b.x+a*10,b.y-3],[b.x+a*23,b.y],[b.x+a*25,b.y+11],[b.x+a*17,b.y+15],[b.x+a*9,b.y+10]],a===side?'#69747d':'#46525e',ink,2);
   r.line({x:b.x-side*10,y:b.y+6},{x:h.x+side*9,y:h.y-6},'#3b3030',5);belt('#554b42');r.line({x:h.x-13,y:h.y-8},{x:h.x-5,y:h.y-8},col,3);r.path([[h.x-13,h.y-2],[h.x-1,h.y+1],[h.x-4,h.y+14],[h.x-16,h.y+10]],'#454f5a',ink,2);r.path([[h.x+1,h.y+1],[h.x+13,h.y-2],[h.x+16,h.y+10],[h.x+5,h.y+14]],'#5c6771',ink,2);
  }
  if(s==='kite'){
   torso('#e2ddc9','#b5b29f','#f6eed7',18);r.path([[h.x-14,h.y-10],[h.x+14,h.y-10],[h.x+18,h.y+9],[h.x+3,h.y+11],[h.x,h.y+5],[h.x-3,h.y+11],[h.x-18,h.y+8]],'#d7d0bb',ink,2);
   r.path([[b.x-9,b.y-3],[b.x,b.y+12],[b.x+10,b.y-3],[b.x+5,b.y+16],[b.x-3,b.y+18]],'#6c6251');r.path([[b.x-9,b.y-3],[b.x-1,b.y+8],[b.x-5,b.y+12],[b.x-14,b.y+3]],'#f5edd6');r.line({x:b.x,y:b.y+16},{x:h.x,y:h.y-8},'#a09b87',2);belt('#78624b',5);r.line({x:h.x-13,y:h.y-7},{x:h.x-5,y:h.y-7},col,3);
  }
  if(s==='yuji'){
   torso('#303d58','#202c42','#566783',18);r.path([[h.x-14,h.y-16],[h.x+13,h.y-16],[h.x+16,h.y+2],[h.x+3,h.y+5],[h.x,h.y],[h.x-14,h.y+3]],'#29354d',ink,2);r.line({x:b.x+5,y:b.y+12},{x:h.x+5,y:h.y-2},'#192337',2);r.ellipse(b.x+5,b.y+15,2,2,'#c6ab79');
   r.path([[b.x-19,b.y-5],[b.x-11,b.y-11],[b.x,b.y-3],[b.x+12,b.y-11],[b.x+19,b.y-4],[b.x+15,b.y+6],[b.x+6,b.y+12],[b.x-2,b.y+7],[b.x-13,b.y+10],[b.x-20,b.y+3]],'#ad4c54',ink,2);r.line({x:b.x-13,y:b.y-4},{x:b.x-2,y:b.y+3},'#e17872',3);r.line({x:b.x+12,y:b.y-4},{x:b.x+7,y:b.y+5},'#d46361',3);r.line({x:h.x-side*12,y:h.y-4},{x:h.x-side*5,y:h.y-3},col,3);
  }
 }
 static weapon(r,f,w){const s=f.skin,c=r.ctx,u={x:Math.cos(w.angle),y:Math.sin(w.angle)},n={x:-u.y,y:u.x},at=(d,v=0)=>({x:w.hand.x+u.x*d+n.x*v,y:w.hand.y+u.y*d+n.y*v});
  if(f.kind==='boxer'){const a=w.hand;if(s==='yuji'){for(let i=0;i<5;i++){const angle=i*Math.PI*2/5+(f.anim||0)*.1;r.path([[a.x+Math.cos(angle)*6,a.y+Math.sin(angle)*6],[a.x+Math.cos(angle+.4)*11,a.y+Math.sin(angle+.4)*11],[a.x+Math.cos(angle+.7)*6,a.y+Math.sin(angle+.7)*6]],'#55cbe0');}r.ellipse(a.x,a.y,5,5,'#e5b381');}else{r.path([[a.x-6,a.y-6],[a.x+5,a.y-6],[a.x+7,a.y+4],[a.x-5,a.y+5]],'#7c8790',ink,2);r.line({x:a.x-4,y:a.y-4},{x:a.x+3,y:a.y-4},bone,2);}return true;}
  if(!s||s==='default')return false;
  const line=(a,b,col,width)=>r.line(a,b,col,width),len=Math.hypot(w.b.x-w.a.x,w.b.y-w.a.y);
  if(s==='hollow'||s==='guts'||s==='thorfinn'){line(at(-17),w.a,'#614f42',6);const width=s==='guts'?11:s==='hollow'?5:3;const tip=w.b,start=w.a;r.path([[start.x+n.x*width,start.y+n.y*width],[tip.x-u.x*9+n.x*width,tip.y-u.y*9+n.y*width],[tip.x,tip.y],[tip.x-u.x*9-n.x*width,tip.y-u.y*9-n.y*width],[start.x-n.x*width,start.y-n.y*width]],s==='guts'?'#7a8187':bone,ink,2);line(start,tip,s==='guts'?'#d2d7cd':'#939faf',2);line(at(8,-8),at(8,8),'#a28e65',3);return true;}
  if(s==='katakuri'){line(w.shaft.a,w.a,'#593b49',6);for(const lateral of[-10,0,10]){const tip={x:w.b.x+n.x*lateral,y:w.b.y+n.y*lateral},base={x:w.a.x+n.x*lateral,y:w.a.y+n.y*lateral};DuelWeapons.steel(r,base,tip,3,'spear');}line({x:w.a.x-n.x*10,y:w.a.y-n.y*10},{x:w.a.x+n.x*10,y:w.a.y+n.y*10},'#d4b3bb',3);return true;}
  if(s==='kite'){line(w.shaft.a,w.shaft.b,'#bca486',6);DuelWeapons.crescent(r,w.segments);const pivot=w.segments[0].a;r.ellipse(pivot.x,pivot.y,9,10,'#e6d3ba');r.ellipse(pivot.x-3,pivot.y-2,2,3,'#bc626a');r.ellipse(pivot.x+3,pivot.y-2,2,3,ink);c.font='bold 9px monospace';c.fillStyle=ink;c.textAlign='center';c.fillText('2',pivot.x,pivot.y+7);return true;}return false;
 }
}
window.DuelSkins=DuelSkins;
})();
