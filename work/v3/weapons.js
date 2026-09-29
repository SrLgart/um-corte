(function(){
'use strict';
const {clamp}=DuelCore;
class DuelWeapons{
 static steel(r,a,b,width,style='sword'){
  const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len,nx=-uy,ny=ux,pt=(d,n=0)=>[a.x+ux*d+nx*n,a.y+uy*d+ny*n];
  const shoulder=style==='dagger'?len*.24:style==='spear'?len*.19:Math.min(9,len*.1),tip=style==='spear'?len*.37:style==='dagger'?len*.6:len-13;
  r.path([pt(0,-width*.65),pt(shoulder,-width),pt(tip,-width*.7),pt(len),pt(tip,width*.7),pt(shoulder,width),pt(0,width*.65)],'#cbd9d7','#223744',1);
  r.path([pt(0),pt(shoulder,-width),pt(tip,-width*.7),pt(len)],'#f4f5df');
  r.path([pt(0),pt(shoulder,width),pt(tip,width*.7),pt(len)],'#849caa');
  r.line({x:a.x+ux*3,y:a.y+uy*3},{x:b.x-ux*9,y:b.y-uy*9},'#eaf2e7',.8);
  if(style==='long')r.line({x:a.x+ux*12,y:a.y+uy*12},{x:b.x-ux*27,y:b.y-uy*27},'#658293',.8);
 }
 static crescent(r,segments){const pts=[segments[0].a,...segments.map(s=>s.b)],left=[],right=[];for(let i=0;i<pts.length;i++){const prev=pts[Math.max(0,i-1)],next=pts[Math.min(pts.length-1,i+1)],dx=next.x-prev.x,dy=next.y-prev.y,len=Math.hypot(dx,dy)||1,width=i===pts.length-1?0:i===0?2.2:3;left.push([pts[i].x-dy/len*width,pts[i].y+dx/len*width]);right.push([pts[i].x+dy/len*width,pts[i].y-dx/len*width]);}
  r.path([...left,...right.slice().reverse()],'#b4c8ce','#233d47',1);r.path([...left,...pts.slice().reverse().map(p=>[p.x,p.y])],'#edf3df');r.path(right,null,'#718f9f',1);r.path(pts.map(p=>[p.x,p.y]),null,'#f7f5df',.8);
 }
 static draw(r,f,w,t,portrait=false){const c=r.ctx;if(f.dead)return;
  if(!portrait){const trail=r.previousBlades[f.id];if(f.state==='active'){if(!r.reduced)for(let i=0;i<trail.length;i++){c.globalAlpha=(i+1)/(trail.length+1)*.12;for(const s of trail[i].segments)r.line(s.a,s.b,'#fff9d5',9);}c.globalAlpha=1;trail.push(w);if(trail.length>4)trail.shift();}else trail.length=0;}
  c.save();c.lineCap='round';c.lineJoin='round';const u={x:Math.cos(w.angle),y:Math.sin(w.angle)},n={x:-u.y,y:u.x},at=(d,side=0)=>({x:w.hand.x+u.x*d+n.x*side,y:w.hand.y+u.y*d+n.y*side}),ink='#243746',gold='#c3a36b',lightGold='#efcea0',grip=f.kind==='assassin'?'#444850':'#695340';
  if(w.shaft){r.line(w.shaft.a,w.shaft.b,ink,7);r.line(w.shaft.a,w.shaft.b,f.kind==='reaper'?'#69564b':'#9e7851',4.6);r.line({x:w.shaft.a.x+n.x*.8,y:w.shaft.a.y+n.y*.8},{x:w.shaft.b.x+n.x*.8,y:w.shaft.b.y+n.y*.8},'#cfad7890',1.1);
   for(let d=-26;d<=20;d+=5)r.line(at(d,-2.5),at(d+2,2.5),'#293d43',1.7);
   for(const d of(f.kind==='reaper'?[-32,77,133,151]:[-43,53,145])){r.line(at(d,-3.3),at(d,3.3),ink,4);r.line(at(d+1,-2.7),at(d+1,2.7),gold,2);}
   if(f.kind==='lancer'){this.steel(r,w.a,w.b,3,'spear');r.line(at(146,-3),at(146,3),lightGold,2);const tie=at(133),sway=portrait?0:Math.sin(t*9)*2;r.path([[tie.x,tie.y],[tie.x-u.x*18+n.x*(10+sway),tie.y-u.y*18+n.y*(10+sway)],[tie.x-u.x*28+n.x*(9+sway),tie.y-u.y*28+n.y*(9+sway)],[tie.x-u.x*19+n.x*5,tie.y-u.y*19+n.y*5]],DuelCore.COLORS[f.color]?.hex||'#9e6a50');}
   else{this.crescent(r,w.segments);const bolt=at(141);r.ellipse(bolt.x,bolt.y,4.3,4.3,ink);r.ellipse(bolt.x,bolt.y,2.6,2.6,gold);r.ellipse(bolt.x-.7,bolt.y-.7,1,1,lightGold);r.line(at(125,-3),at(138,-3),gold,1.5);}
  }else{
   const long=f.kind==='swordsman',dagger=f.kind==='assassin',back=long?-21:dagger?-13:-16;r.line(at(back),at(10),ink,long?8:7);r.line(at(back+2),at(9),grip,long?5:4.5);for(let d=back+4;d<8;d+=4)r.line(at(d,-2),at(d+2,2),gold,.9);
   const pommel=at(back-2);r.ellipse(pommel.x,pommel.y,long?4:3.2,long?4:3.2,ink);if(dagger){c.beginPath();c.arc(pommel.x,pommel.y,3,0,Math.PI*2);c.strokeStyle=gold;c.lineWidth=1.4;c.stroke();}else{r.ellipse(pommel.x,pommel.y,long?3:2.3,long?3:2.3,gold);r.ellipse(pommel.x-.7,pommel.y-.7,1,1,lightGold);}
   const span=long?15:dagger?7:11,pts=[at(4,-span),at(9,-span*.58),at(10,0),at(9,span*.58),at(4,span)];r.path(pts.map(p=>[p.x,p.y]),null,ink,5);r.path(pts.map(p=>[p.x,p.y]),null,gold,3);r.line(at(10,-3),at(10,3),lightGold,2);
   this.steel(r,w.a,w.b,long?3:dagger?2.9:2.6,long?'long':dagger?'dagger':'sword');
   if(long){r.line(at(29,-3),at(27,-7),ink,2.5);r.line(at(29,3),at(27,7),ink,2.5);r.line(at(29,-3),at(27,-7),gold,1);r.line(at(29,3),at(27,7),gold,1);}
  }
  // The front hand overlaps the grip; ornament and shaft never extend damage geometry.
  r.ellipse(w.hand.x,w.hand.y,4.2,4.2,'#263a33');r.ellipse(w.hand.x+.4,w.hand.y-.5,3.1,3.1,'#d3b590');c.restore();
  if(f.state==='parry'){const a=f.guard==='high'?-Math.PI/2:f.guard==='low'?Math.PI/2:f.guardFacing>0?0:Math.PI,remaining=clamp(1-f.stateTime/f.duration,0,1);c.beginPath();c.arc(f.x,f.y-79,52,a-.66,a+.66);c.strokeStyle='#9e895c88';c.lineWidth=3;c.stroke();c.beginPath();c.arc(f.x,f.y-79,52,a-.66,a-.66+1.32*remaining);c.strokeStyle='#fff0af';c.lineWidth=3.2;c.stroke();c.font='9px monospace';c.textAlign='center';c.fillStyle=DuelScenery.THEMES[r.lastTheme]?.dark?'#f4e6bc':'#6e5733';const label=f.guard==='high'?'ALTO':f.guard==='low'?'BAIXO':'NORMAL';c.fillText(label+(f.duration>.3?' · '+Math.max(0,f.duration-f.stateTime).toFixed(1).replace('.',',')+' s':''),f.x,f.y-157);}
 }
}
window.DuelWeapons=DuelWeapons;
})();
