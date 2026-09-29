const fs=require('node:fs'),file='work/v8/v8-actors.js';let s=fs.readFileSync(file,'utf8');const a=s.indexOf(' const cloaks='),b=s.indexOf(" if(f.boss)",a);s=s.slice(0,a)+`
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
`+s.slice(b);
// Neck fasteners and secondary garments remain visible even under armour.
const pos=s.indexOf(" if(has(f,'crystal'))");s=s.slice(0,pos)+`
 if(has(f,'lightcape'))r.line({x:b.x-side*13,y:b.y+2},{x:b.x+side*7,y:b.y+10},'#bfd0b0',4);
 if(has(f,'shadowcloak'))r.path([[b.x-side*18,b.y+3],[b.x-side*10,b.y-5],[b.x+side*5,b.y+1],[b.x-side*5,b.y+12]],'#4c405d',ink,1.5);
 if(has(f,'mirrorcloak')){r.path([[b.x-3,b.y+4],[b.x+3,b.y+8],[b.x,b.y+15],[b.x-5,b.y+9]],'#d4efe2',ink,1);}
 if(has(f,'ghostsuit')){const c=r.ctx;c.save();c.globalAlpha*=.6;for(const q of[hand,second]){r.line({x:b.x,y:b.y+7},q,'#b2d3ce',3);r.ellipse(q.x,q.y,4,4,'#dceee2');}c.restore();}
 if(has(f,'gravitycloak'))r.path([[b.x+side*8,b.y+1],[b.x+side*14,b.y+7],[b.x+side*9,b.y+14],[b.x+side*3,b.y+8]],'#b9a7dc',ink,1);
`+s.slice(pos);
s=s.replace("if(has(f,'magnetic')||has(f,'rockets')||has(f,'wingboot'))", "if(has(f,'magnetic')||has(f,'rockets')||has(f,'wingboot'))");
const needle=" if(has(f,'wingboot'))for";const j=s.indexOf(needle);s=s.slice(0,j)+`
 if(has(f,'magnetic')){r.line({x:foot.x-6,y:foot.y+4},{x:foot.x+side*13,y:foot.y+4},'#81bdc7',3);r.line({x:foot.x-side*4,y:foot.y-12},{x:foot.x-side*4,y:foot.y-5},'#c2e3dc',2);}
 if(has(f,'rockets')){r.path([[foot.x-side*8,foot.y-14],[foot.x-side*14,foot.y-12],[foot.x-side*14,foot.y],[foot.x-side*7,foot.y+2]],'#6d7478',ink,1.5);r.line({x:foot.x-side*13,y:foot.y-10},{x:foot.x-side*9,y:foot.y-10},'#d8b781',2);}
`+s.slice(j);fs.writeFileSync(file,s);
