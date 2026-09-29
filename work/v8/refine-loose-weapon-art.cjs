const fs=require('node:fs'),file='work/v8/v8-actors.js';let s=fs.readFileSync(file,'utf8');s=s.replace(' r.ellipse(w.hand.x,w.hand.y,4,4,shade);r.ellipse(w.hand.x,w.hand.y-1,3,3,skin);c.restore();',' if(!w.detached){r.ellipse(w.hand.x,w.hand.y,4,4,shade);r.ellipse(w.hand.x,w.hand.y-1,3,3,skin);}c.restore();');const marker='root.DuelV8Actors={back,front,headgear};';if(!s.includes(marker))throw Error('export marker');s=s.replace(marker,`
// Uses the same model for a dropped/thrown weapon. Transform and scale are visual only.
function projectileArt(r,e,t){const c=r.ctx;if(e.type==='weapon'||e.type==='yoyo'||e.type==='kunai'){
 const id=e.type==='weapon'?(L.WEAPONS[e.weapon]?e.weapon:'sword'):e.type,inventory={...L.inventory(),items:[id],weapon:id},f={kind:'knight',state:'idle',legacy:inventory};
 c.save();if(e.type==='weapon'){c.rotate((e.age||0)*10);c.scale(.34,.34);}else if(e.type==='kunai')c.scale(.65,.65);else c.rotate((e.age||0)*14);
 W.draw(r,f,{hand:{x:e.type==='weapon'?-48:e.type==='kunai'?-18:-7,y:0},angle:0,detached:true},t,false);c.restore();return true;
 }if(e.type==='arrow'||e.type==='spectralArrow'){const color=e.type==='spectralArrow'?'#add8de':'#cab88c';r.line({x:-22,y:0},{x:16,y:0},color,2);r.path([[12,-3],[20,0],[12,3]],'#e1e8d8',ink,1);for(const sign of[-1,1])r.path([[-21,0],[-25,sign*4],[-15,sign*4],[-10,0]],color,ink,1);return true;}return false;
}
root.DuelV8Actors={back,front,headgear,projectileArt};`);fs.writeFileSync(file,s);
const v='work/v8/v8-visuals.js';let q=fs.readFileSync(v,'utf8');const old="else if(e.type==='weapon'){c.rotate(e.age*10);r.line({x:-18,y:0},{x:20,y:0},'#eee6ce',4);r.path([[10,-3],[22,-14],[29,-7],[25,4]],color);}else if(e.type==='yoyo'){r.ellipse(0,0,12,12,color);}";if(!q.includes(old))throw Error('projectile branch');q=q.replace(old,"else if(root.DuelV8Actors.projectileArt(r,e,t)){}");fs.writeFileSync(v,q);
