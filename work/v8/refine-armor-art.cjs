const fs=require('node:fs'),file='work/v8/v8-actors.js';let s=fs.readFileSync(file,'utf8');const marker=" if(has(f,'duelistband'))";const i=s.indexOf(marker);s=s.slice(0,i)+`
 // Faceted shoulder guards and a shared chest inlay keep both armours readable.
 if(has(f,'crystal')){const broken=l.used.match.crystal,edge=broken?'#788e96':'#d7f3e9';for(const sign of[-1,1]){const x=b.x+sign*16,y=b.y+6;r.path([[x-sign*5,y],[x+sign*4,y-7],[x+sign*12,y],[x+sign*8,y+12],[x-sign*2,y+9]],broken?'#5b7785':'#81b5c6',ink,1.5);r.path([[x+sign*4,y-6],[x+sign*10,y],[x,y+7]],edge);if(broken)r.line({x,y:y+2},{x:x+sign*8,y:y+9},ink,2);}
  if(has(f,'berserker'))r.path([[b.x-5,b.y+17],[b.x+5,b.y+17],[h.x+4,h.y-16],[h.x,h.y-10],[h.x-4,h.y-16]],broken?'#536e78':'#92c7d2',ink,1);
  if(!broken){const q=.5+.5*Math.sin(t*2.5);r.line({x:b.x-6,y:b.y+10},{x:b.x+4+q*3,y:b.y+7},'#e9ffeb',1.5);}
 }
 if(has(f,'berserker')){for(let i=0;i<3;i++){const y=h.y-18+i*5;r.path([[h.x-11,y],[h.x,y+3],[h.x+11,y]],null,'#88909a',1.5);}if(l.effects.berserk>0){r.line({x:b.x-7,y:b.y+10},{x:h.x-5,y:h.y-20},'#e57365',2);r.line({x:b.x+7,y:b.y+10},{x:h.x+5,y:h.y-20},'#e57365',2);}}
`+s.slice(i);s=s.replace("r.ellipse(foot.x*.5+h.x*.5,foot.y*.5+h.y*.5,7,6,'#84989c');","const k={x:foot.x*.5+h.x*.5,y:foot.y*.5+h.y*.5};r.path([[k.x-7,k.y-5],[k.x+5,k.y-6],[k.x+8,k.y],[k.x+3,k.y+7],[k.x-6,k.y+4]],'#718792',ink,1.5);r.line({x:k.x-4,y:k.y-3},{x:k.x+4,y:k.y-3},'#bfcecc',2);");fs.writeFileSync(file,s);
