const fs=require('fs'),path=require('path'),p=n=>path.join(__dirname,n);function edit(n,f){fs.writeFileSync(p(n),f(fs.readFileSync(p(n),'utf8')));}
edit('renderer.js',s=>s.replace('this.scale=Math.min(w/1280,h/720);',"this.scale=document.documentElement.classList.contains('immersive')?Math.max(w/1280,h/720):Math.min(w/1280,h/720);this.viewWidth=w/this.scale;this.viewHeight=h/this.scale;")
 .replace('Math.min(1280/(maxX-minX),720/(maxY-minY)),.32','Math.min(this.viewWidth/(maxX-minX),this.viewHeight/(maxY-minY)),.00001')
 .replace('half=640/z','half=this.viewWidth/2/z').replace('game.map.height-210/z','game.map.height-(this.viewHeight/2-150)/z')
 .replace('if(this.debug)this.hitboxes(game);', 'this.specials(game,t);if(this.debug)this.hitboxes(game);')
 .replace("c.globalAlpha=1;}}\n drawWalls", "c.globalAlpha=1;}this.impact(game,effects);}\n drawWalls")
 .replace(' drawWalls(game){',fs.readFileSync(p('renderer-specials.txt'),'utf8')+'\n drawWalls(game){')
 .replace('y+=30){this.line','y+=Math.max(30,w.h/160)){this.line')
 .replace("color=COLORS[f.color]?.hex||'#80b6ae'", "color=f.ultMode==='edgeStrike'?'#dfb34b':f.state==='ultCharge'?'#e5b870':COLORS[f.color]?.hex||'#80b6ae'"));
edit('weapons.js',s=>s.replace('if(f.dead)return;',"if(f.dead||f.kind==='assassin'&&f.ultMode==='unarmed')return;").replace("at=(d,side=0)=>({x:w.hand.x+u.x*d+n.x*side,y:w.hand.y+u.y*d+n.y*side})", "weaponScale=DuelCore.stats(f).weaponScale||1,at=(d,side=0)=>({x:w.hand.x+(u.x*d+n.x*side)*weaponScale,y:w.hand.y+(u.y*d+n.y*side)*weaponScale})"));
edit('actors.js',s=>s.replaceAll("f.dashRemaining>0?1:0", "f.dashRemaining>0||f.state==='ultCharge'?1:0").replace("wind=f.state==='startup'?", "wind=['startup','ultWindup','throwWindup'].includes(f.state)?").replace("stroke=f.state==='active'?1:", "stroke=f.state==='active'||f.state==='ultCharge'?1:")
 .replace("if(!portrait&&f.dashRemaining>0&&!r.reduced)", "if(!portrait&&(f.dashRemaining>0||f.state==='ultCharge')&&!r.reduced)")
 .replace('left-f.dashX*i*17,top-f.dashY*i*17',"left-(f.state==='ultCharge'?f.ultSide:f.dashX)*i*17,top-f.dashY*i*17"));
edit('scenery.js',s=>s.replace('x+=56)','x+=Math.max(56,p.w/150))').replace("x+=game.mapId==='bamboo'?22:46)","x+=Math.max(game.mapId==='bamboo'?22:46,p.w/150))").replace('x+=31)','x+=Math.max(31,p.w/150))').replace('i<p.w/30;i++','i<Math.min(150,p.w/30);i++').replace('x+=40)','x+=Math.max(40,p.w/150))'));
edit('app.js',s=>s.replace("if(type==='feint')", "if(type==='special'){tone(220,.28,.1,'triangle',680);tone(440,.25,.08);}else if(type==='shieldBreak'){noise(.18,.2,1200);tone(340,.2,.1,'triangle',110);}else if(type==='daggerThrow'){noise(.12,.13,2400);}else if(type==='daggerPickup'){tone(850,.1,.08);}else if(type==='chargeStart'){noise(.3,.18,500);}else if(type==='chargeStop'){tone(100,.16,.13);}else if(type==='feint')")
 .replace("!$('settings').open?input.read", "!$('settings').open&&!admin?.opened?input.read")
 .replace('Number(number.value);selected.rules[k]=','Number(number.value);selected.rules[k]=')
 .replace("if(!inMenu&&selected.mode!=='online'", "if(!inMenu&&!$('special-intro').open&&!admin?.opened&&selected.mode!=='online'"));
edit('engine.js',s=>s.replace('this.score=score;this.round=round;this.emit',"this.score=score;this.round=round;if(Array.isArray(change.positions))for(let i=0;i<2;i++)for(const k of['x','y'])if(Number.isFinite(change.positions[i]?.[k])){this.fighters[i][k]=change.positions[i][k];this.fighters[i].grounded=false;this.fighters[i].platform=-1;}this.emit")
 .replace("if(duration===0&&['recovery'", "if(duration===0&&state==='parry'){f.state='parryRecovery';f.duration=this.rules.parryRecovery/1000;}if(duration===0&&['recovery'"));
