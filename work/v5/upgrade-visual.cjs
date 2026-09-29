const fs=require('fs'),path=require('path'),p=f=>path.join(__dirname,f);function edit(file,fn){let s=fs.readFileSync(p(file),'utf8');const r=(a,b)=>{if(!s.includes(a))throw Error(file+' missing '+a.slice(0,90));s=s.replace(a,b);};fn(r,()=>s,v=>s=v);fs.writeFileSync(p(file),s);}
edit('renderer.js',(r,get,set)=>{
 r("this.reduced=matchMedia", "this.lighting=new DuelLighting();this.reduced=matchMedia");
 const start=get().indexOf('  this.slashTrails??='),end=get().indexOf("  if(f.state==='startup')",start);
 set(get().slice(0,start)+fs.readFileSync(p('slash.inc'),'utf8')+get().slice(end));
 r("const alive=game.fighters.filter(f=>!f.dead)","this.effects=effects;const alive=effects.fatal?game.fighters:game.fighters.filter(f=>!f.dead)");
 r('this.background(game,t);c.save();','this.background(game,t);this.lighting.backdrop(this,game,t);c.save();');
 r('c.scale(this.camera.zoom,this.camera.zoom);c.translate(-this.camera.x,-this.camera.y);this.platforms',"const kick=effects.fatal&&!this.reduced?1+.045*Math.sin(Math.min(1,effects.fatal.age/.48)*Math.PI):1;c.scale(this.camera.zoom*kick,this.camera.zoom*kick);c.translate(-this.camera.x,-this.camera.y);this.platforms");
 const oldStart=get().indexOf('this.drawWalls(game);for(const f of game.fighters){'),oldEnd=get().indexOf('for(const f of game.fighters)this.sword',oldStart);
 set(get().slice(0,oldStart)+"this.drawWalls(game);this.lighting.environment(this,game,t);for(const fighter of game.fighters){this.lighting.shadow(this,game,fighter);const age=effects.fatal?.age||0,f=effects.fatal&&fighter.dead?{...fighter,deathTime:age<.085?0:age<.305?(age-.085)*.2:.044+age-.305}:fighter;this.fighter(f,t,blade(f));}"+get().slice(oldEnd));
 r('this.specials(game,t);if(this.debug)', 'this.specials(game,t);this.lighting.combat(this,game,effects,t);this.fatalFrame(game,effects);if(this.debug)');
 r(' specials(game,t){',fs.readFileSync(p('fatal.inc'),'utf8')+'\n specials(game,t){');
 r("c.globalAlpha=this.reduced?.1:.93", "c.globalAlpha=this.reduced?.08:.62");
 r('const rays=this.reduced?4:12','const rays=this.reduced?3:8');
});
edit('actors.js',(r)=>r('  const pixels=ctx.getImageData','  if(!portrait)r.lighting?.shadeActor(ctx,f);\n  const pixels=ctx.getImageData'));
edit('skins.js',(r)=>r("  if(s==='hollow'||s==='guts'||s==='thorfinn'){",`  if(s==='hollow'){const len=Math.hypot(w.b.x-w.a.x,w.b.y-w.a.y),base={x:w.a.x,y:w.a.y},pt=(d,v=0)=>[base.x+u.x*d+n.x*v,base.y+u.y*d+n.y*v];line(at(-17),w.a,'#303a4a',6);r.path([pt(0,7),pt(len*.68,5.5),pt(len,0),pt(len*.68,-5.5),pt(0,-7)],'#d9e4e5',ink,2);r.path([pt(0,0),pt(len,0),pt(len*.68,-5.5),pt(0,-7)],'#f7f3d9');r.path([pt(0,0),pt(len,0)],null,'#8295a7',1.5);for(let d=12;d<len*.65;d+=18){const a=pt(d,0),b=pt(d-6,5);r.line({x:a[0],y:a[1]},{x:b[0],y:b[1]},'#718399',1.5);const q=pt(d-6,-5);r.line({x:a[0],y:a[1]},{x:q[0],y:q[1]},'#92a3b5',1);}line(at(8,-8),at(8,8),'#9ba9b5',3);return true;}\n  if(s==='guts'||s==='thorfinn'){`));
