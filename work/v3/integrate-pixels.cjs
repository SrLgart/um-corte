const fs=require('node:fs'),path=require('node:path');const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8'),write=(f,s)=>fs.writeFileSync(path.join(__dirname,f),s);
let s=read('renderer.js'),a=s.indexOf(' fighter(f,'),b=s.indexOf(' render(game',a);
s=s.slice(0,a)+` fighter(f,time,w,portrait=false){DuelActors.draw(this,f,time,w,portrait);}
 sword(f,w,t,portrait=false){if(portrait||f.dead)return;const c=this.ctx,shape=DuelCore.slash(f),color=COLORS[f.color]?.hex||'#80b6ae';
  if(shape.points.length){const pts=shape.points.map(p=>[p.x,p.y]);this.path(pts,'#fff8d9');c.save();c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.clip();const gradient=c.createRadialGradient(shape.origin.x,shape.origin.y,stats(f).minRange,shape.origin.x,shape.origin.y,stats(f).reach);gradient.addColorStop(0,color);gradient.addColorStop(.58,color);gradient.addColorStop(.88,'#fff6bb');gradient.addColorStop(1,'#ffffff');c.globalAlpha=.78;c.fillStyle=gradient;c.fillRect(f.x-250,f.y-DuelCore.C.bodyCenter-250,500,500);c.restore();}
  if(f.state==='startup'){const aim=f.attackAim,rad=stats(f).reach,p=clamp(f.stateTime/f.duration,0,1);c.globalAlpha=.25+p*.5;this.line({x:f.x+Math.cos(aim)*30,y:f.y-DuelCore.C.bodyCenter+Math.sin(aim)*30},{x:f.x+Math.cos(aim)*Math.min(rad,53),y:f.y-DuelCore.C.bodyCenter+Math.sin(aim)*Math.min(rad,53)},'#fff2c4',2);c.globalAlpha=1;}
  if(f.state==='parry'){const a=f.guard==='high'?-Math.PI/2:f.guard==='low'?Math.PI/2:f.guardFacing>0?0:Math.PI,remaining=clamp(1-f.stateTime/f.duration,0,1);c.beginPath();c.arc(f.x,f.y-DuelCore.C.bodyCenter,47,a-.66,a+.66);c.strokeStyle='#9e895c88';c.lineWidth=3;c.stroke();c.beginPath();c.arc(f.x,f.y-DuelCore.C.bodyCenter,47,a-.66,a-.66+1.32*remaining);c.strokeStyle='#fff0af';c.lineWidth=3;c.stroke();c.font='9px monospace';c.textAlign='center';c.fillStyle=DuelScenery.THEMES[this.lastTheme]?.dark?'#f4e6bc':'#6e5733';const label=f.guard==='high'?'ALTO':f.guard==='low'?'BAIXO':'NORMAL';c.fillText(label+(f.duration>.3?' · '+Math.max(0,f.duration-f.stateTime).toFixed(1).replace('.',',')+' s':''),f.x,f.y-144);}
  if(!f.dead){c.globalAlpha=.65;this.ellipse(f.x+Math.cos(f.aim)*47,f.y-DuelCore.C.bodyCenter+Math.sin(f.aim)*47,1.8,1.8,color);c.globalAlpha=1;}
 }
`+s.slice(b);
s=s.replace('this.previousBlades=[[],[]];this.lastRound=game.round;','this.previousBlades=[[],[]];this.actorHistory=[];this.lastRound=game.round;');
const start=s.indexOf("z=game.phase==='title'"),end=s.indexOf('\n  c.setTransform',start);
s=s.slice(0,start)+`z=clamp(Math.min(1280/(maxX-minX),720/(maxY-minY)),.32,1.12),half=640/z,tx=game.map.width<half*2?game.map.width/2:clamp((minX+maxX)/2,half,game.map.width-half),ty=Math.min(game.map.height-210/z,(minY+maxY)/2),smooth=this.snapCamera?1:1-Math.exp(-dt*7);this.camera.zoom=lerp(this.camera.zoom,z,smooth);this.camera.x=lerp(this.camera.x,tx,smooth);this.camera.y=lerp(this.camera.y,ty,smooth);this.snapCamera=false;`+s.slice(end);
s=s.replace('this.fighter(f,t,w);this.sword(f,w,t);}','this.fighter(f,t,w);}for(const f of game.fighters)this.sword(f,blade(f),t);');
s=s.replace('this.fighter(f,0,w,true);this.sword(f,w,0,true);','this.fighter(f,0,w,true);');
write('renderer.js',s);
s=read('build.cjs').replace("['RENDERER','renderer.js']","['ACTORS','actors.js'],['RENDERER','renderer.js']");write('build.cjs',s);
s=read('shell.html').replace('/* RENDERER */','/* ACTORS */\n/* RENDERER */');
s=s.replace('Um golpe limpo mata.', 'Um golpe limpo mata.');
write('shell.html',s);
s=read('v3.css');s+=`\n/* V3.2 discrete match presets */\n#rules-grid select{display:block;width:100%;margin-top:12px;padding:10px 12px;border:1px solid #55705b55;border-radius:3px;background:#f4efe2;color:#243e34;font:600 13px inherit;cursor:pointer}#rules-grid select:disabled{opacity:.55;cursor:default}.character canvas{image-rendering:pixelated}\n`;write('v3.css',s);
s=read('test-engine.cjs').replace("x-g.fighters[0].x,35)","x-g.fighters[0].x,35*.9)");write('test-engine.cjs',s);
