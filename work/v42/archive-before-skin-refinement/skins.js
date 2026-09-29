(function(){
'use strict';
const ink='#19232c',bone='#eeeadd';
class DuelSkins{
 static head(r,f){const c=r.ctx,s=f.skin;if(s==='hollow'){r.path([[-13,-4],[-18,-22],[-13,-34],[-9,-18],[9,-18],[13,-34],[18,-22],[13,-4],[7,11],[-7,11]],bone,ink,2);r.ellipse(-6,-3,3,6,ink);r.ellipse(6,-3,3,6,ink);return true;}
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
 static dress(r,f,p){const s=f.skin,{hip:h,shoulder:b,head,side,st,t,portrait}=p,col=DuelCore.COLORS[f.color].hex;
  const vest=(base,trim)=>{r.path([[b.x-15,b.y+1],[b.x+15,b.y+1],[h.x+12,h.y-7],[h.x-11,h.y-7]],base,ink,2);r.line({x:b.x-side*10,y:b.y+3},{x:h.x+side*5,y:h.y-8},trim,4);};
  if(f.kind==='boxer'){vest(s==='yuji'?'#26324a':'#30343b',s==='yuji'?'#40516b':'#535861');r.line({x:h.x-13,y:h.y-5},{x:h.x+12,y:h.y-5},col,6);if(s==='yuji'){r.path([[b.x-16,b.y-5],[b.x,b.y+6],[b.x+16,b.y-5],[b.x+12,b.y+10],[b.x,b.y+14],[b.x-13,b.y+7]],'#a54448',ink,2);}return;}
  if(!s||s==='default')return;
  if(s==='hollow'){vest('#303941','#525666');r.line({x:b.x-16,y:b.y+2},{x:b.x+16,y:b.y+2},col,5);}
  if(s==='thorfinn'){vest('#807452','#b4a781');r.line({x:b.x-15,y:b.y-1},{x:b.x+14,y:b.y+1},'#c5bc9b',8);r.path([[h.x-13,h.y-7],[h.x+11,h.y-7],[h.x+13,h.y+12],[h.x-15,h.y+12]],'#716549',ink,2);r.line({x:h.x-14,y:h.y-5},{x:h.x+12,y:h.y-5},col,4);}
  if(s==='katakuri'){vest('#473a46','#ab6779');r.path([[b.x-8,b.y+2],[b.x+8,b.y+2],[h.x+5,h.y-15],[h.x-6,h.y-15]],'#d29875');r.line({x:b.x-7,y:b.y+8},{x:h.x+5,y:h.y-18},'#964f5b',4);for(let i=0;i<3;i++)r.ellipse(b.x-13+i*12,b.y+1,2,2,bone);r.line({x:h.x-13,y:h.y-6},{x:h.x+13,y:h.y-6},col,5);}
  if(s==='guts'){vest('#363b44','#717b83');r.path([[b.x+side*8,b.y],[b.x+side*22,b.y+4],[b.x+side*20,b.y+15],[b.x+side*8,b.y+12]],'#5b646c',ink,2);for(let i=0;i<3;i++)r.line({x:b.x-9,y:b.y+15+i*7},{x:b.x+9,y:b.y+13+i*7},'#7c8486',2);r.line({x:h.x-13,y:h.y-5},{x:h.x+12,y:h.y-5},col,4);}
  if(s==='kite'){vest('#ded7c5','#aea28c');r.line({x:b.x,y:b.y+8},{x:h.x,y:h.y-6},'#735b4b',2);r.line({x:h.x-12,y:h.y-5},{x:h.x+12,y:h.y-5},col,5);}
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
