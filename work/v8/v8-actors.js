(function(root){
'use strict';
const D=root.DuelCore,L=root.DuelLegacy,S=root.DuelSkins,W=root.DuelWeapons,A=root.DuelActors,{has}=L;
const ink='#1d2630',skin='#c99068',light='#ecc29a',shade='#895947',bone='#e5d8ad',metal='#a0b7bc';
const old={};for(const k of ['active','cloth','leg','arm','dress','neck','head'])old[k]=S[k];
S.active=function(f){return f.summonType==='skeleton'||f.wanderer||old.active.call(this,f);};
S.cloth=function(r,f,p){if(f.summonType==='skeleton')return true;if(!f.wanderer)return old.cloth.call(this,r,f,p);return true;};
S.neck=function(f){return f.summonType==='skeleton'?bone:f.wanderer?skin:old.neck.call(this,f);};
S.leg=function(r,f,p){if(f.summonType==='skeleton'){A.limb(r,p.root,p.knee,p.foot,6,bone,'#8d9183','#f2e8c8');r.ellipse(p.knee.x,p.knee.y,4,4,bone);r.line(p.foot,{x:p.foot.x+(f.facing||1)*10,y:p.foot.y},bone,4);return true;}if(!f.wanderer)return old.leg.call(this,r,f,p);const {root,knee,foot}=p;A.limb(r,root,knee,foot,9,skin,shade,light);r.line({x:foot.x-5,y:foot.y},{x:foot.x+(f.facing||1)*11,y:foot.y},shade,6);r.line({x:foot.x-4,y:foot.y-2},{x:foot.x+(f.facing||1)*10,y:foot.y-2},skin,3);return true;};
S.arm=function(r,f,p){if(f.summonType==='skeleton'){A.limb(r,p.root,p.j,p.target,5,bone,'#8d9183','#f2e8c8');r.ellipse(p.j.x,p.j.y,3,3,bone);return true;}if(!f.wanderer)return old.arm.call(this,r,f,p);A.limb(r,p.root,p.j,p.target,8,skin,shade,light);r.ellipse(p.target.x,p.target.y,3.5,4,skin);return true;};
S.dress=function(r,f,p){if(f.summonType==='skeleton'){const {hip:h,shoulder:b}=p;r.line(b,h,ink,10);r.line(b,h,bone,5);for(let i=0;i<4;i++){const y=b.y+8+i*6,x=b.x+(h.x-b.x)*(i+1)/5;r.path([[x-13+i,y],[x-9,y+4],[x+9,y+4],[x+13-i,y]],null,bone,3);}r.line({x:h.x-11,y:h.y},{x:h.x+11,y:h.y},metal,7);r.path([[h.x-10,h.y+2],[h.x+9,h.y+2],[h.x+7,h.y+17],[h.x,h.y+11],[h.x-9,h.y+18]],'#536f72',ink,1);return;}if(!f.wanderer)return old.dress.call(this,r,f,p);const {hip:h,shoulder:b}=p;
 r.path([[b.x-16,b.y],[b.x+16,b.y],[h.x+10,h.y-3],[h.x-10,h.y-3]],skin,ink,2);
 r.path([[b.x-15,b.y+3],[b.x-5,b.y+9],[h.x-3,h.y-3],[h.x-10,h.y-3]],shade);
 r.line({x:b.x-8,y:b.y+9},{x:b.x-1,y:b.y+11},light,2);r.line({x:b.x+2,y:b.y+11},{x:b.x+11,y:b.y+8},light,2);
 r.line({x:b.x+1,y:b.y+16},{x:h.x,y:h.y-12},shade,1.5);
 r.path([[h.x-12,h.y-7],[h.x+12,h.y-7],[h.x+11,h.y+4],[h.x+2,h.y+14],[h.x-6,h.y+9],[h.x-12,h.y+3]],'#918673',ink,2);
 r.line({x:h.x-12,y:h.y-7},{x:h.x+12,y:h.y-7},bone,3);
};
S.head=function(r,f){const c=r.ctx;if(f.summonType==='skeleton'){r.path([[-11,-20],[7,-23],[13,-16],[12,-3],[6,0],[7,8],[-5,10],[-9,4],[-8,-2],[-13,-7]],bone,ink,2);c.fillStyle=ink;c.fillRect(-7,-12,6,6);c.fillRect(4,-13,6,6);c.fillStyle=f.summonTint||'#a5d8ce';c.fillRect(6,-11,2,2);r.path([[-3,-21],[-5,-17],[-1,-15]],null,'#8b978c',1.5);r.path([[0,-7],[3,-1],[-2,0]],ink);r.line({x:-5,y:4},{x:6,y:3},ink,2);for(let x=-4;x<7;x+=4)r.line({x,y:3},{x,y:8},shade,1);return true;}if(!f.wanderer)return old.head.call(this,r,f);
 r.path([[-11,-20],[8,-20],[12,-14],[10,5],[3,11],[-7,7],[-11,-1]],skin,ink,2);
 r.path([[-13,-19],[-9,-26],[-3,-24],[0,-28],[5,-23],[10,-24],[13,-16],[7,-15],[3,-18],[-3,-12],[-7,-14],[-11,-6]],'#363234',ink,2);
 c.fillStyle=light;c.fillRect(4,-7,6,5);c.fillStyle=ink;c.fillRect(6,-7,4,2);c.fillStyle=shade;c.fillRect(5,3,4,2);c.fillRect(-8,-3,3,6);return true;
};
function ribbon(r,f,p,index,anchor,length,width,color){A.ribbon(r,f,p.st,10+index,anchor,length,width,color,p.t+index*.13,p.portrait,-p.side,null);}
function highlight(r,id,point){if(r.legacyHighlight!==id)return;const c=r.ctx;c.save();c.strokeStyle='#fff6bd';c.lineWidth=2;c.setLineDash([4,3]);c.beginPath();c.arc(point.x,point.y,16,0,Math.PI*2);c.stroke();c.restore();}
function back(r,f,p){if(!f.legacy)return;const {shoulder:b,hip:h,side,st,t}=p;

 // One main mantle, with visible trims for overlapping garments. Inventory is untouched.
 const cloaks=[['lightcape','#83937e',49,24],['shadowcloak','#393348',64,29],['mirrorcloak','#789fa9',65,30],['ghostsuit','#a9c7c7',57,25],['gravitycloak','#554e88',76,31]].filter(([id])=>has(f,id));
 if(cloaks.length){const [id,color,len,width]=cloaks.at(-1),index=10,anchor={x:b.x-side*14,y:b.y+2};
  const c=r.ctx;c.save();if(id==='ghostsuit')c.globalAlpha*=.68;ribbon(r,f,p,0,anchor,len,width,color);
  const points=st.cloth[index]?.map(q=>({x:(q.x-f.x)/D.C.scale,y:(q.y-f.y)/D.C.scale}))||[];
  for(let i=1;i<points.length;i++){const q=points[i],prev=points[i-1],dx=q.x-prev.x,dy=q.y-prev.y,d=Math.hypot(dx,dy)||1,n={x:-dy/d,y:dx/d};
   r.line({x:prev.x+n.x*width*.22,y:prev.y+n.y*width*.22},{x:q.x+n.x*width*.18,y:q.y+n.y*width*.18},id==='gravitycloak'?'#a69acf':id==='shadowcloak'?'#695579':'#c7d8c5',1.5);
   if(id==='mirrorcloak'&&i%2)r.path([[q.x,q.y-5],[q.x+5,q.y],[q.x,q.y+7],[q.x-4,q.y]],'#d9f1de',ink,1);
   if(id==='gravitycloak'&&i===3){r.ellipse(q.x,q.y,5,5,'#9387ba');r.ellipse(q.x+2,q.y-1,4,4,color);}
   if(id==='ghostsuit'&&i>3)r.line({x:q.x,y:q.y},{x:q.x-side*5,y:q.y+7+Math.sin(t*5+i)*3},'#d6e8df',2);
  }
  c.restore();for(const [j,[other,col]]of cloaks.slice(0,-1).entries()){ribbon(r,f,p,1+j,{x:b.x-side*(12+j*2),y:b.y+3+j*2},35+j*7,4,col);highlight(r,other,{x:b.x-side*20,y:b.y+10+j*6});}highlight(r,id,{x:b.x-side*22,y:h.y-4});
 }
 if(has(f,'glider')){const fly=f.legacy.flight==='glider',spread=fly?88:24,flutter=Math.sin(t*10)* (fly?3:1),tip={x:b.x-side*spread,y:b.y+17+flutter};
  r.path([[b.x-side*8,b.y],[tip.x,tip.y],[h.x-side*spread*.72,h.y+10],[h.x-side*8,h.y+1]],'#ba8d57',ink,2);
  r.path([[b.x-side*8,b.y],[tip.x,tip.y],[h.x-side*spread*.5,h.y-5]],'#e0bc7f');
  for(const k of[.35,.7,1])r.line({x:b.x-side*8,y:b.y},{x:h.x-side*spread*k*.72,y:h.y+10*k},'#735438',2);
  r.line({x:b.x-side*8,y:b.y},tip,bone,3);highlight(r,'glider',b);
 }
 if(has(f,'icarus')){const flying=f.legacy.flight==='icarus',spread=f.grounded?.38:flying?1:.72,beat=Math.sin(t*(flying?12:4))*(flying?10:2);
  for(const sign of [-1,1]){const x=b.x+sign*10,y=b.y+9;for(let i=5;i>=0;i--){const end={x:x+sign*(28+i*7)*spread,y:y-39+i*10+beat*(i/5)};r.path([[x,y],[end.x-sign*9,end.y-12],[end.x+sign*4,end.y],[end.x-sign*3,end.y+14],[x,y+10]],i%2?'#eddfb9':'#bcab85',ink,1.5);r.line({x:x+sign*8,y:y+2},end,'#f7eccb',1);}
   r.path([[x,y-7],[x+sign*19*spread,y-24],[x+sign*25*spread,y-16],[x+sign*12*spread,y+5]],'#d4b974',ink,2);
  }highlight(r,'icarus',{x:b.x,y:b.y-20});
 }
 if(f.boss){const palette={guardian:'#9d684b',weaver:'#818bba',executioner:'#985546',specter:'#a3c9d4',tamer:'#9b8950',artificer:'#58adae',vampire:'#942e43',witch:'#8b70ba',legionlord:'#b89b62',twins:'#a581b0',timekeeper:'#779c99',first:'#c4ba9e'};ribbon(r,f,p,8,{x:b.x-side*15,y:b.y-4},f.boss==='first'?87:64,22,palette[f.boss]||bone);}
}

function summonDress(r,f,p){const type=f.summonType;if(!['skeleton','spectral','legion','servant'].includes(type))return;const {shoulder:b,hip:h,side}=p,col=f.summonTint||'#a5d8ce';
 if(type==='skeleton'){r.path([[b.x-side*9,b.y-1],[b.x-side*22,b.y+2],[b.x-side*21,b.y+14],[b.x-side*12,b.y+10]],'#697f82',ink,1.5);r.line({x:b.x-side*18,y:b.y+2},{x:b.x-side*15,y:b.y+9},'#acbcb2',2);r.line({x:b.x+side*5,y:b.y+9},{x:h.x-side*6,y:h.y-4},'#6f6452',3);r.ellipse(h.x-side*5,h.y-6,3,3,col);}
 if(type==='spectral'){r.path([[b.x-9,b.y+11],[b.x,b.y+5],[b.x+9,b.y+11],[b.x,b.y+24]],'#304653',col,1.5);r.line({x:b.x,y:b.y+9},{x:b.x,y:b.y+20},'#e0f3d5',2);r.line({x:b.x-4,y:b.y+15},{x:b.x+4,y:b.y+15},'#e0f3d5',1.5);}
 if(type==='legion'){const slot=f.summonSlot||0;r.line({x:b.x-side*11,y:b.y+3},{x:h.x+side*8,y:h.y-9},'#354b58',7);r.line({x:b.x-side*11,y:b.y+3},{x:h.x+side*8,y:h.y-9},col,2);const x=b.x+side*5,y=b.y+17;r.path([[x-7,y-7],[x+7,y-7],[x+7,y+6],[x,y+11],[x-7,y+6]],'#394c5b','#c7c7a0',1.5);
  if(slot===0){r.line({x:x-3,y:y+5},{x:x+3,y:y-4},col,2);r.line({x:x-4,y:y+1},{x:x+1,y:y+5},col,1.5);}else if(slot===1){r.path([[x-3,y-4],[x+4,y],[x-3,y+5]],null,col,1.5);r.line({x:x-3,y:y-4},{x:x-3,y:y+5},col,1);}else r.path([[x-4,y-4],[x+4,y-4],[x+3,y+3],[x,y+6],[x-3,y+3]],null,col,1.5);
  r.path([[h.x-8,h.y-2],[h.x+8,h.y-2],[h.x+7,h.y+16],[h.x,h.y+12],[h.x-7,h.y+16]],'#4b656b',ink,1.5);r.line({x:h.x,y:h.y},{x:h.x,y:h.y+10},col,2);
 }if(type==='servant'){r.line({x:b.x-6,y:b.y+4},{x:b.x+5,y:b.y+15},'#aa9bc6',1.5);r.path([[b.x+5,b.y+11],[b.x+9,b.y+16],[b.x+5,b.y+21],[b.x+1,b.y+16]],'#796b91',col,1);}
}

function front(r,f,p){summonDress(r,f,p);if(!f.legacy)return;const{shoulder:b,hip:h,hand,second,feet,side,t}=p,l=f.legacy;

 if(has(f,'lightcape'))r.line({x:b.x-side*13,y:b.y+2},{x:b.x+side*7,y:b.y+10},'#bfd0b0',4);
 if(has(f,'shadowcloak'))r.path([[b.x-side*18,b.y+3],[b.x-side*10,b.y-5],[b.x+side*5,b.y+1],[b.x-side*5,b.y+12]],'#4c405d',ink,1.5);
 if(has(f,'mirrorcloak')){r.path([[b.x-3,b.y+4],[b.x+3,b.y+8],[b.x,b.y+15],[b.x-5,b.y+9]],'#d4efe2',ink,1);}
 if(has(f,'ghostsuit')){const c=r.ctx;c.save();c.globalAlpha*=.6;for(const q of[hand,second]){r.line({x:b.x,y:b.y+7},q,'#b2d3ce',3);r.ellipse(q.x,q.y,4,4,'#dceee2');}c.restore();}
 if(has(f,'gravitycloak'))r.path([[b.x+side*8,b.y+1],[b.x+side*14,b.y+7],[b.x+side*9,b.y+14],[b.x+side*3,b.y+8]],'#b9a7dc',ink,1);
 if(has(f,'crystal')){const broken=l.used.match.crystal;r.path([[b.x-17,b.y+5],[b.x,b.y-1],[b.x+18,b.y+6],[h.x+13,h.y-14],[h.x,h.y-5],[h.x-12,h.y-14]],broken?'#627781':'#8abcc9',ink,2);r.path([[b.x-15,b.y+6],[b.x,b.y-1],[h.x,h.y-6]],broken?'#8ba3a1':'#d9f3e7');r.line({x:b.x,y:b.y+1},{x:h.x,y:h.y-7},'#ffffff',2);if(broken)r.path([[b.x+5,b.y+7],[h.x-2,h.y-25],[h.x+6,h.y-14]],null,ink,2);highlight(r,'crystal',b);}
 if(has(f,'berserker')){r.path([[b.x-20,b.y-2],[b.x-9,b.y-8],[b.x+18,b.y-3],[h.x+16,h.y-12],[h.x,h.y-3],[h.x-15,h.y-13]],'#303945',ink,3);r.path([[b.x-12,b.y+4],[b.x+8,b.y+4],[h.x,h.y-11]],'#53616c');r.line({x:b.x,y:b.y+7},{x:h.x,y:h.y-12},l.effects.berserk>0?'#ff5e66':'#8c3948',3);for(const sign of[-1,1])r.path([[b.x+sign*11,b.y],[b.x+sign*25,b.y-8],[b.x+sign*24,b.y+14]],'#596574',ink,2);highlight(r,'berserker',b);}

 // Faceted shoulder guards and a shared chest inlay keep both armours readable.
 if(has(f,'crystal')){const broken=l.used.match.crystal,edge=broken?'#788e96':'#d7f3e9';for(const sign of[-1,1]){const x=b.x+sign*16,y=b.y+6;r.path([[x-sign*5,y],[x+sign*4,y-7],[x+sign*12,y],[x+sign*8,y+12],[x-sign*2,y+9]],broken?'#5b7785':'#81b5c6',ink,1.5);r.path([[x+sign*4,y-6],[x+sign*10,y],[x,y+7]],edge);if(broken)r.line({x,y:y+2},{x:x+sign*8,y:y+9},ink,2);}
  if(has(f,'berserker'))r.path([[b.x-5,b.y+17],[b.x+5,b.y+17],[h.x+4,h.y-16],[h.x,h.y-10],[h.x-4,h.y-16]],broken?'#536e78':'#92c7d2',ink,1);
  if(!broken){const q=.5+.5*Math.sin(t*2.5);r.line({x:b.x-6,y:b.y+10},{x:b.x+4+q*3,y:b.y+7},'#e9ffeb',1.5);}
 }
 if(has(f,'berserker')){for(let i=0;i<3;i++){const y=h.y-18+i*5;r.path([[h.x-11,y],[h.x,y+3],[h.x+11,y]],null,'#88909a',1.5);}if(l.effects.berserk>0){r.line({x:b.x-7,y:b.y+10},{x:h.x-5,y:h.y-20},'#e57365',2);r.line({x:b.x+7,y:b.y+10},{x:h.x+5,y:h.y-20},'#e57365',2);}}
 if(has(f,'duelistband')){r.line({x:second.x-6,y:second.y-5},{x:second.x+5,y:second.y-2},'#bb5558',6);ribbon(r,f,p,7,{x:second.x,y:second.y-4},23,4,'#d88578');highlight(r,'duelistband',second);}
 if(has(f,'climbing'))for(const handPoint of[hand,second]){r.ellipse(handPoint.x,handPoint.y,5,5,'#776849');r.line({x:handPoint.x+side*2,y:handPoint.y-4},{x:handPoint.x+side*4,y:handPoint.y+3},bone,2);highlight(r,'climbing',handPoint);}
 for(const foot of feet){if(has(f,'sandals')){r.line({x:foot.x-6,y:foot.y+3},{x:foot.x+side*12,y:foot.y+3},'#c8ad74',4);r.line({x:foot.x-3,y:foot.y-5},{x:foot.x+4,y:foot.y+2},'#546d67',3);highlight(r,'sandals',foot);}
 if(has(f,'kneepads')){const k={x:foot.x*.5+h.x*.5,y:foot.y*.5+h.y*.5};r.path([[k.x-7,k.y-5],[k.x+5,k.y-6],[k.x+8,k.y],[k.x+3,k.y+7],[k.x-6,k.y+4]],'#718792',ink,1.5);r.line({x:k.x-4,y:k.y-3},{x:k.x+4,y:k.y-3},'#bfcecc',2);}
 if(has(f,'magnetic')||has(f,'rockets')||has(f,'wingboot')){r.path([[foot.x-6,foot.y-17],[foot.x+5,foot.y-17],[foot.x+6,foot.y-5],[foot.x+side*14,foot.y],[foot.x+side*14,foot.y+4],[foot.x-7,foot.y+4]],has(f,'rockets')?'#926949':has(f,'magnetic')?'#63798e':'#c8ad78',ink,2);r.line({x:foot.x-5,y:foot.y-13},{x:foot.x+4,y:foot.y-13},metal,3);}

 if(has(f,'magnetic')){r.line({x:foot.x-6,y:foot.y+4},{x:foot.x+side*13,y:foot.y+4},'#81bdc7',3);r.line({x:foot.x-side*4,y:foot.y-12},{x:foot.x-side*4,y:foot.y-5},'#c2e3dc',2);}
 if(has(f,'rockets')){r.path([[foot.x-side*8,foot.y-14],[foot.x-side*14,foot.y-12],[foot.x-side*14,foot.y],[foot.x-side*7,foot.y+2]],'#6d7478',ink,1.5);r.line({x:foot.x-side*13,y:foot.y-10},{x:foot.x-side*9,y:foot.y-10},'#d8b781',2);}
 if(has(f,'wingboot'))for(let i=0;i<3;i++)r.path([[foot.x-side*3,foot.y-8],[foot.x-side*(14+i*4),foot.y-21+i*5],[foot.x-side*(13+i*3),foot.y-8+i*3]],bone,ink,1);
 if(has(f,'rockets')&&!f.grounded&&l.flight==='rockets'){r.path([[foot.x-5,foot.y+4],[foot.x+5,foot.y+4],[foot.x+Math.sin(t*65)*3,foot.y+22+Math.sin(t*50)*6]],'#e5a156');r.line({x:foot.x,y:foot.y+5},{x:foot.x,y:foot.y+15},'#fff2b8',3);}
 }
 const badges=L.items(f).filter(id=>L.catalog[id]?.category==='relic').slice(0,8);for(let i=0;i<badges.length;i++){const x=h.x-14+i*4,y=h.y-3+(i%2)*2;r.ellipse(x,y,2,3,i%2?'#d5b275':'#8bc9c1');highlight(r,badges[i],{x,y});}
}
function headgear(r,f,p){if(!f.legacy)return;const{head:h,side}=p;if(has(f,'stonemask')){r.path([[h.x-side*8,h.y-21],[h.x+side*13,h.y-16],[h.x+side*14,h.y+1],[h.x+side*5,h.y+8],[h.x-side*4,h.y+2]],'#d3cead',ink,2);r.line({x:h.x+side*4,y:h.y-8},{x:h.x+side*12,y:h.y-8},ink,3);r.line({x:h.x+side*8,y:h.y-3},{x:h.x+side*5,y:h.y+1},'#817a66',2);highlight(r,'stonemask',h);}if(f.boss==='first'){r.line({x:h.x-side*11,y:h.y-20},{x:h.x+side*11,y:h.y-15},'#ece6d2',5);}if(has(f,'gravitycloak'))r.ellipse(h.x,h.y-35,4,4,'#b3a0e9');}
const originalWeapon=W.draw;
W.draw=function(r,f,w,t,portrait){const copy=L.mirrorWeapon(f);if(copy){const c=r.ctx;c.save();c.globalAlpha*=.85;try{return originalWeapon.call(this,r,{...f,kind:copy,skin:'default',wanderer:false},w,t,portrait);}finally{c.restore();}}const id=L.weaponId(f);if(f.legacy?.effects.weaponAway||f.wanderer&&!id)return;
 if(!id||L.weaponKind(f)===null)return originalWeapon.call(this,r,f,w,t,portrait);
 const c=r.ctx,u={x:Math.cos(w.angle),y:Math.sin(w.angle)},n={x:-u.y,y:u.x},at=(d,s=0)=>({x:w.hand.x+u.x*d+n.x*s,y:w.hand.y+u.y*d+n.y*s}),line=(a,b,color,width)=>r.line(at(...a),at(...b),color,width),poly=(pts,fill,stroke=ink,width=1.5)=>r.path(pts.map(p=>{const q=at(...p);return[q.x,q.y];}),fill,stroke,width);
 c.save();c.lineCap='butt';c.lineJoin='bevel';

 if(id==='bow'){const draw=f.state==='startup'?Math.min(1,f.stateTime/f.duration):0;
  c.strokeStyle='#573e34';c.lineWidth=7;c.beginPath();const a=at(3,-36),mid=at(34-draw*4,0),b=at(3,36);c.moveTo(a.x,a.y);c.quadraticCurveTo(mid.x,mid.y,b.x,b.y);c.stroke();c.strokeStyle='#bc965d';c.lineWidth=3;c.stroke();
  line([3,-36],[-12-draw*14,0],bone,1);line([-12-draw*14,0],[3,36],bone,1);for(const sign of[-1,1])line([3,sign*34],[6,sign*29],'#e0c79a',3);
  if(!(f.legacy.cd.weapon>0)){const tail=-16-draw*14,tip=54-draw*12;line([tail,0],[tip,0],'#bda87b',2);poly([[tip-5,-3],[tip+2,0],[tip-5,3]],metal,ink,1);for(const sign of[-1,1])poly([[tail,0],[tail-5,sign*4],[tail+5,sign*4],[tail+10,0]],'#d5e0ce',null);}
 }
 else if(id==='knuckles'){poly([[-5,-8],[9,-9],[13,-4],[13,7],[8,11],[-5,8]],'#b9a172',ink,2);for(const s of[-5,0,5]){const p=at(7,s);r.ellipse(p.x,p.y,2,2,ink);}line([-4,-7],[7,-8],'#f0d7a1',2);}
 else if(id==='yoyo'){const p=at(7,0);r.ellipse(p.x,p.y,10,10,'#597c93');r.ellipse(p.x,p.y,7,7,'#cbd9c8');r.ellipse(p.x,p.y,4,4,'#4c8796');r.ellipse(p.x,p.y,1.5,1.5,bone);for(let i=0;i<3;i++){const a=t*2+i*Math.PI*2/3;r.line({x:p.x+Math.cos(a)*5,y:p.y+Math.sin(a)*5},{x:p.x+Math.cos(a)*9,y:p.y+Math.sin(a)*9},'#e5c881',2);}line([-10,-3],[2,0],bone,1);}
 else if(id==='blunderbuss'){poly([[-20,6],[-12,-2],[16,-5],[18,6],[-4,8],[-11,16]],'#79513e');line([-16,7],[-9,2],'#c09661',2);poly([[6,-5],[46,-9],[51,-15],[55,-15],[55,13],[49,13],[46,8],[6,5]],'#627d85');poly([[8,-4],[45,-8],[50,-10],[50,-5],[10,0]],'#afbeb6',null);line([52,-11],[52,10],ink,4);line([47,-10],[47,9],'#d4b67c',3);line([18,-5],[18,6],'#b39764',3);poly([[1,-5],[2,-13],[7,-14],[7,-10],[5,-7]],'#b7afa0',ink,1);line([0,8],[1,13],'#cbb987',2);line([1,13],[8,8],'#cbb987',2);}
 else if(id==='broom'){line([-26,0],[103,0],'#6a503b',6);line([-24,-1],[97,-1],'#b09360',2);poly([[83,-7],[112,-15],[130,-13],[136,-8],[132,0],[137,9],[125,14],[111,14],[82,7]],'#bba56f');for(let i=-3;i<=3;i++)line([87,i*2],[130+(i%2)*4,i*3],'#e4d2a0',1);for(const d of[87,91])line([d,-8],[d,8],'#755544',2);line([30,-2],[36,1],'#725238',1);}
 else if(id==='ruyi'){line([-36,0],[125,0],'#713639',8);line([-20,-2],[107,-2],'#bd5951',2);for(const d of[-36,109]){line([d,0],[d+16,0],'#b18a42',10);for(let k=0;k<3;k++)line([d+3+k*5,-5],[d+3+k*5,5],'#f5dca0',1);poly([[d+3,0],[d+8,-3],[d+13,0],[d+8,3]],'#735534',null);}for(const d of[18,70])poly([[d,-3],[d+7,0],[d,3],[d-3,0]],'#d7b16a',null);}
 else if(['axe','leviathan'].includes(id)){const ice=id==='leviathan';line([-20,0],[98,0],'#594338',7);line([-18,-2],[95,-2],'#a77b50',2);for(let d=-10;d<16;d+=5)line([d,-3],[d+2,3],'#c9b68b',2);
  poly(ice?[[82,-7],[90,-25],[107,-33],[126,-27],[134,-10],[133,9],[122,12],[107,6],[103,-2],[90,9]]:[[85,-6],[91,-24],[109,-29],[128,-20],[134,-7],[130,12],[116,9],[106,2],[90,7]],ice?'#698f9e':'#788c90');
  poly(ice?[[121,-27],[131,-12],[132,7],[124,9],[121,-8],[113,-23]]:[[120,-23],[130,-13],[133,-6],[129,11],[124,8],[125,-5],[117,-17]],'#e1e9dc',null);line([88,-7],[91,7],'#c1a46d',4);
  if(ice){for(const d of[97,108,118]){line([d,-17],[d+3,-7],'#b6e9e5',1.5);line([d,-12],[d+5,-15],'#b6e9e5',1);}poly([[34,-3],[40,0],[34,3],[28,0]],'#aacccd',null);}else{line([105,-16],[114,-14],'#bbc7ba',2);line([117,0],[123,3],'#4d626d',2);}
 }
 else if(id==='kunai'){poly([[8,0],[23,-7],[45,0],[23,7]],'#738c9b');poly([[9,0],[23,-5],[45,0]],'#e5ecdc',null);line([-9,0],[10,0],'#665952',5);for(const d of[-7,-2,3])line([d,-2],[d+2,2],'#c6b69a',1);const p=at(-13);c.beginPath();c.arc(p.x,p.y,5,0,Math.PI*2);c.strokeStyle=metal;c.lineWidth=2;c.stroke();}
 else{const long=id==='yamato'?140:id==='needle'?137:120;
  line([-17,0],[10,0],id==='yamato'?'#26374a':'#655344',6);for(let d=-12;d<5;d+=5)line([d,-3],[d+2,3],bone,1);
  if(id==='needle'){poly([[10,-4],[long-12,-4],[long,0],[long-12,4],[10,4]],'#becdca');line([24,0],[long-8,0],'#647e8e',1);poly([[-9,-8],[4,-8],[12,-3],[12,3],[4,8],[-9,8],[-15,3],[-15,-3]],'#b8c5bf');poly([[-8,-4],[3,-4],[7,0],[3,4],[-8,4],[-11,0]],ink,null);line([12,-3],[23,-3],'#ecf2dd',2);}
  else if(id==='yamato'){line([7,-8],[7,8],'#d4b46e',3);poly([[13,-3],[long-16,-4],[long+2,-10],[long-3,2],[13,4]],'#839ba7');poly([[13,1],[long-5,-2],[long+2,-10],[long-3,2],[13,4]],'#eff2df',null);line([14,-2],[29,-2],'#c9a95b',3);}
  else if(id==='sword'){poly([[12,-5],[long-13,-5],[long+2,0],[long-13,5],[12,5]],'#91a7ad');poly([[13,0],[long+2,0],[long-13,5],[13,5]],'#e0e7d5',null);line([17,0],[long-14,0],'#596f7d',1);poly([[4,-11],[9,-11],[11,11],[6,11]],'#c8ac72');const q=at(-20);r.ellipse(q.x,q.y,4,4,'#bca779');}
  else if(id==='zenith'){poly([[12,-6],[34,-9],[50,-5],[69,-8],[83,-4],[105,-6],[long+2,-2],[long-9,6],[85,7],[67,4],[48,8],[30,5],[12,5]],'#6b849f');poly([[14,0],[34,-5],[50,0],[69,-4],[84,0],[105,-3],[long+2,-2],[long-9,3],[83,3],[68,1],[49,4],[30,2]],'#cbe8df',null);poly([[1,-13],[8,-10],[16,-6],[12,7],[3,12],[-2,9],[5,3],[5,-4]],'#d3ad65');for(let j=0;j<3;j++){const x=35+j*22;poly([[x-3,0],[x,-3],[x+3,0],[x,3]],['#73d6ba','#d5b1e5','#f1cd84'][j],null);}}
  else if(id==='echo'){poly([[13,-4],[long-12,-4],[long+2,-9],[long-3,3],[13,5]],'#80a9ac');line([18,3],[long-5,2],'#d8efda',2);poly([[2,-9],[10,-9],[14,-3],[8,1],[14,6],[8,11],[2,9],[6,2]],'#83b6ad');const alpha=c.globalAlpha;c.globalAlpha*=.55+.15*Math.sin(t*4);for(const pair of[[24,41],[49,68],[77,96],[103,116]])line([pair[0],-1],[pair[1],-1],'#d0fff0',1.5);c.globalAlpha=alpha;}
  else{poly([[13,-5],[long-15,-5],[long+2,-11],[long-4,5],[13,7]],'#899da9');line([18,5],[long-4,3],'#e8ebd9',2);}
  if(id==='gunblade'){poly([[-5,-10],[30,-10],[32,-4],[3,-4]],'#526673');line([3,-8],[28,-8],'#c4d0c4',2);poly([[0,5],[13,5],[9,16],[3,16]],'#7a5743');const p=at(4,0);r.ellipse(p.x,p.y,8,8,'#b6a278');r.ellipse(p.x,p.y,5,5,'#506471');for(let j=0;j<4;j++){const a=j*Math.PI/2;r.ellipse(p.x+Math.cos(a)*4,p.y+Math.sin(a)*4,1,1,bone);}line([16,5],[16,11],metal,2);line([16,11],[10,13],metal,2);}
 }
 if(!w.detached){r.ellipse(w.hand.x,w.hand.y,4,4,shade);r.ellipse(w.hand.x,w.hand.y-1,3,3,skin);}c.restore();
};
// Gravity changes the rendered pose, never the collision capsule.
const drawActor=root.DuelRenderer.prototype.fighter;
root.DuelRenderer.prototype.fighter=function(f,t,w,portrait){if(f.legacy?.effects.inverted&&!portrait){const c=this.ctx;c.save();c.translate(0,2*(f.y-D.body(f).center));c.scale(1,-1);const reflected={...f,aim:-f.aim,attackAim:-f.attackAim,vy:-f.vy,dashY:-f.dashY};drawActor.call(this,reflected,t,D.blade(reflected),portrait);c.restore();}else drawActor.call(this,f,t,w,portrait);};

// Uses the same model for a dropped/thrown weapon. Transform and scale are visual only.
function projectileArt(r,e,t){const c=r.ctx;if(e.type==='weapon'||e.type==='yoyo'||e.type==='kunai'){
 const id=e.type==='weapon'?(L.WEAPONS[e.weapon]?e.weapon:'sword'):e.type,inventory={...L.inventory(),items:[id],weapon:id},f={kind:'knight',state:'idle',legacy:inventory};
 c.save();if(e.type==='weapon'){c.rotate((e.age||0)*10);c.scale(.34,.34);}else if(e.type==='kunai')c.scale(.65,.65);else c.rotate((e.age||0)*14);
 W.draw(r,f,{hand:{x:e.type==='weapon'?-48:e.type==='kunai'?-18:-7,y:0},angle:0,detached:true},t,false);c.restore();return true;
 }if(e.type==='arrow'||e.type==='spectralArrow'){const color=e.type==='spectralArrow'?'#add8de':'#cab88c';r.line({x:-22,y:0},{x:16,y:0},color,2);r.path([[12,-3],[20,0],[12,3]],'#e1e8d8',ink,1);for(const sign of[-1,1])r.path([[-21,0],[-25,sign*4],[-15,sign*4],[-10,0]],color,ink,1);return true;}return false;
}
root.DuelV8Actors={back,front,headgear,projectileArt};
})(globalThis);
