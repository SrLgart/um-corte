const fs=require('node:fs'),file='work/v8/v8-visuals.js';let s=fs.readFileSync(file,'utf8');const marker='function world(r,g,t)';const art=`
function krakenBody(r,e,t,color){const c=r.ctx;c.save();c.translate(e.x,e.y);c.scale(e.r/145,e.r/145);const ink='#192c3d',breathe=Math.sin(t*1.8)*3;
 for(let i=0;i<5;i++){const x=-90+i*45,sway=Math.sin(t*1.5+i)*16;r.path([[x,-4],[x+24,40],[x+36+sway,96],[x+15+sway,149],[x-18+sway,178]],null,ink,28);r.path([[x,-4],[x+24,40],[x+36+sway,96],[x+15+sway,149],[x-18+sway,178]],null,i%2?'#3c6670':'#31545f',20);for(let j=0;j<3;j++)r.ellipse(x+25+sway*.7-j*7,104+j*20,4,6,'#86a7a0');}
 r.path([[-112,32],[-129,-42],[-101,-116],[-57,-180],[0,-216-breathe],[57,-180],[101,-116],[129,-42],[112,32],[57,67],[0,77],[-57,67]],'#315362',ink,4);
 r.path([[-92,-42],[-87,-109],[-44,-171],[-7,-197],[-26,-97],[-38,-23],[-31,38],[-74,29]],'#496d78');r.path([[18,-185],[64,-143],[100,-68],[93,-17],[65,-35],[49,-114]],'#3e6370');
 for(const sign of[-1,1]){r.path([[sign*18,-36],[sign*56,-48],[sign*99,-35],[sign*91,-17],[sign*58,-7],[sign*28,-17]],ink);r.ellipse(sign*59,-28,23,9,color);r.ellipse(sign*63,-28,4,10,ink);r.line({x:sign*26,y:-44},{x:sign*90,y:-50},'#7b9b9f',4);}
 r.path([[-22,27],[0,15],[22,27],[12,55],[0,67],[-12,55]],'#19313e',ink,2);r.path([[-14,27],[0,21],[14,27],[0,40]],'#849c9d');
 c.restore();}
function royalSlime(r,e,t,color){const c=r.ctx,rad=e.r||38,gen=e.generation||0,bob=Math.sin(t*3.5+e.id)*.035;c.save();c.scale(rad/38,rad/38);c.scale(1+bob,1-bob);
 r.path([[-37,17],[-37,-5],[-29,-25],[-13,-35],[7,-37],[26,-28],[36,-12],[38,16],[29,29],[10,35],[-11,34],[-29,29]],'#547f91','#20394a',2);
 r.path([[-31,0],[-25,-20],[-10,-29],[10,-30],[23,-19],[27,-2],[18,12],[-5,17],[-24,12]],'#76b4b8');r.path([[-24,-12],[-17,-22],[-7,-25]],null,'#d0eee0',4);r.path([[-29,21],[-9,27],[12,27],[29,20]],null,color,3);
 for(const sign of[-1,1]){r.ellipse(sign*12,-1,3,5,'#17343e');r.ellipse(sign*12-1,-3,1,1,'#edf4d3');}r.path([[-5,9],[0,12],[5,9]],null,'#284e5b',2);
 if(!gen){const lift=e.phase==='leap'?5:Math.sin(t*3)*1.5;r.path([[-20,-29-lift],[-23,-46-lift],[-12,-39-lift],[0,-54-lift],[12,-39-lift],[23,-46-lift],[20,-29-lift]],'#c2a45c','#51483f',2);r.line({x:-19,y:-30-lift},{x:19,y:-30-lift},'#f2d899',3);r.path([[-4,-35-lift],[0,-42-lift],[4,-35-lift],[0,-31-lift]],color,'#746343',1);}
 else{for(const sign of[-1,1])r.path([[sign*8,-29],[sign*15,-37],[sign*17,-28]],'#d7bb76','#51483f',1);}
 c.restore();}
`;
s=s.replace(marker,art+'\n'+marker);s=s.replace("if(e.type==='kraken'){c.globalAlpha=.6;r.ellipse(e.x,e.y,e.r,e.r*1.5,'#223a49');for(const side of [-1,1])r.ellipse(e.x+side*e.r*.5,e.y-20,12,5,color);c.restore();continue;}","if(e.type==='kraken'){c.globalAlpha=.6;krakenBody(r,e,t,color);c.restore();continue;}");const a=s.indexOf('if(smallCreature(r,e,t,color)||largeCreature(r,g,e,t,color)){}'),b=s.indexOf('if(warning){c.setLineDash([3,4]);',a);if(a<0||b<0)throw Error('fallback boundaries');s=s.slice(0,a)+"if(smallCreature(r,e,t,color)||largeCreature(r,g,e,t,color)){}else if(e.type==='slimeking'){royalSlime(r,e,t,color);}else{r.ellipse(0,-13,8,9,color);r.path([[-7,-5],[7,-5],[13,19],[-12,19]],'#475b69');r.line({x:9,y:4},{x:28,y:-25},color,3);r.line({x:-5,y:18},{x:-9,y:29},color,4);r.line({x:5,y:18},{x:12,y:29},color,4);}"+s.slice(b);fs.writeFileSync(file,s);
