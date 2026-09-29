const fs=require('node:fs'),path=require('node:path');const rd=f=>fs.readFileSync(path.join(__dirname,f),'utf8'),wr=(f,s)=>fs.writeFileSync(path.join(__dirname,f),s);let s=rd('engine.js');
const sub=(a,b)=>{if(!s.includes(a))throw Error('Missing '+a.slice(0,100));s=s.replace(a,b);};
sub("attackSpeed:{name:'Velocidade de ataque',min:.5,max:2,step:.5,options:['Lenta','Normal','Rápida','Super rápida']},mapSize:{name:'Tamanho da arena',min:.5,max:2,step:.5,options:['Pequeno','Normal','Grande','Gigante']}","attackSpeed:{name:'Velocidade de ataque',min:.1,max:3,step:.01,numeric:true},mapSize:{name:'Tamanho da arena',min:.5,max:3,step:.1,numeric:true}");
sub("speed:{name:'Velocidade',min:.7,max:1.4,step:.1}","speed:{name:'Velocidade de movimento',min:.1,max:3,step:.01,numeric:true}");
sub("const DIFFICULTIES=",`MAPS.dojo.walls=[{x:55,y:280,w:26,h:330},{x:1199,y:280,w:26,h:330},{x:190,y:390,w:26,h:220},{x:1064,y:390,w:26,h:220}];
MAPS.ruins.walls=[{x:65,y:315,w:28,h:305},{x:1187,y:315,w:28,h:305},{x:480,y:500,w:25,h:120},{x:775,y:500,w:25,h:120}];
MAPS.tower={name:'Torre do Sino',description:'Paredes, pilares e um elevador central. O terreno também se move.',platforms:[{x:50,y:630,w:1180,solid:true},{x:180,y:430,w:240},{x:860,y:430,w:240},{x:470,y:240,w:340},{x:540,y:450,w:200,motion:{y:115,period:5.6}}],walls:[{x:70,y:165,w:35,h:465},{x:1175,y:165,w:35,h:465},{x:340,y:450,w:30,h:180},{x:910,y:450,w:30,h:180}],spawns:[{x:470,y:630},{x:810,y:630}]};
const DIFFICULTIES=`);
sub('parry:false,dash:false','parry:false,dash:false,kick:false');
sub('return{...base,platforms,spawns:',"const walls=(base.walls||[]).map(w=>({x:w.x*scale,y:w.y*scale,w:w.w*scale,h:w.h*scale}));for(const w of walls)platforms.push({x:w.x,y:w.y,w:w.w,solid:true,wallTop:true});for(const p of platforms){p.baseX=p.x;p.baseY=p.y;if(p.motion)p.motion={...p.motion,y:p.motion.y*scale};}\n return{...base,walls,platforms,spawns:");
sub('function slash(f){',`function body(f){const low=clamp((f.slideRemaining||0)/.12,0,1);return{top:lerp(C.bodyTop,44,low),bottom:lerp(C.bodyBottom,13,low),radius:lerp(C.radius,11,low),center:lerp(C.bodyCenter,27,low)};}
function clipPlane(poly,key,edge,sign){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=(a[key]-edge)*sign,db=(b[key]-edge)*sign;if(da>=0)out.push(a);if((da>=0)!==(db>=0)){const t=da/(da-db);out.push({x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t)});}}return out;}
function slash(f,walls=[]){`);
sub('origin={x:f.x,y:f.y-C.bodyCenter}', 'origin={x:f.x,y:f.y-body(f).center}');
sub("if(f.kind==='lancer'){const lo=s.minRange,hi=s.reach;", "const progress=clamp(f.stateTime/Math.max(.001,f.duration),0,1),sweep=lerp(-.28,.28,progress)*(Math.cos(aim)>=0?1:-1);\n if(f.kind==='lancer'){const lo=s.minRange,hi=lerp(s.reach*.82,s.reach,Math.sin(progress*Math.PI));");
sub('a=lerp(-arc,arc,t),r=', 'a=lerp(-arc,arc,t)+sweep,r=');
sub('return{points,origin,aim};','for(const w of walls){if(origin.y>w.y&&origin.y<w.y+w.h){if(f.x<w.x)points=clipPlane(points,\'x\',w.x,-1);else if(f.x>w.x+w.w)points=clipPlane(points,\'x\',w.x+w.w,1);}}return{points,origin,aim,progress};');
s=s.replaceAll('f.y-C.bodyCenter','f.y-body(f).center');
sub("dashRemaining:0,attackId:","dashRemaining:0,slideRemaining:0,wallSide:0,wallId:-1,lastWall:-1,wallLock:0,wallJumpTime:0,feintCooldown:0,kickCooldown:0,kickHit:false,queued:null,attackId:");
sub("['pve','local','online']","['pve','local','online','training']");
sub("['stunned','clash','dead'].includes(state))f.dashRemaining=0;","['stunned','clash','pushed','dead'].includes(state)){f.dashRemaining=0;f.slideRemaining=0;f.queued=null;}");
sub("f.state==='dash'&&!f.dead","['dash','slide'].includes(f.state)&&!f.dead");
sub("parry(id){const f=this.fighters[id],s=stats(f);","parry(id){const f=this.fighters[id],s=stats(f);if(f.state==='startup')return this.feint(id);");
sub(' dash(id,move=0){',` feint(id){const f=this.fighters[id];if(f.dead||f.state!=='startup'||f.feintCooldown>0)return false;this.setState(f,'feintRecovery',.15);f.feintCooldown=.45;f.queued=null;this.emit('feint',{id});return true;}
 kick(id){const f=this.fighters[id];if(!this.canAct(f)||f.kickCooldown>0)return false;f.kickHit=false;f.kickSide=f.facing;f.kickCooldown=.7;this.setState(f,'kickStartup',.16);this.emit('kickWindup',{id});return true;}
 command(id,action,inp){const f=this.fighters[id],ok=action==='dash'?this.dash(id,inp.move,inp.down):this[action](id);if(ok){f.queued=null;return true;}if(['recovery','parryRecovery','dashRecovery','slideRecovery','kickRecovery','feintRecovery','stunned','clash','pushed'].includes(f.state)&&f.duration-f.stateTime<=.08)f.queued={action,ttl:.085,move:inp.move,down:inp.down,aim:inp.aim};return false;}
 dash(id,move=0,down=false){`);
sub('f.dashX=x;f.dashY=y;f.dashRemaining=s.dash;','const slide=down&&f.grounded;if(slide){x=Math.sign(move)||f.facing;y=0;}f.dashX=x;f.dashY=y;f.dashRemaining=slide?.28:s.dash;f.slideRemaining=slide?.42:0;');
sub("this.setState(f,'dash',s.dash);this.emit('dash',{id});","this.setState(f,slide?'slide':'dash',f.dashRemaining);this.emit(slide?'slide':'dash',{id});");
sub('tickState(f,dt){f.dashCooldown=',"tickState(f,dt){for(const k of['slideRemaining','wallLock','wallJumpTime','feintCooldown','kickCooldown'])f[k]=Math.max(0,(f[k]||0)-dt);if(f.queued){f.queued.ttl-=dt;if(f.queued.ttl<=0)f.queued=null;}f.dashCooldown=");
sub("if(f.state==='dash')this.setState(f,'dashRecovery',stats(f).dashRecovery*this.rules.dashRecovery);","if(['dash','slide'].includes(f.state))this.setState(f,f.state==='slide'?'slideRecovery':'dashRecovery',f.state==='slide'?.14:stats(f).dashRecovery*this.rules.dashRecovery);");
sub("if(old==='startup'){", "if(old==='kickStartup'){this.setState(f,'kickActive',.10);}else if(old==='kickActive'){this.setState(f,'kickRecovery',.27);}else if(old==='startup'){");
sub("r=this.rules,oldY=f.y,wasGrounded=f.grounded;","r=this.rules,oldX=f.x,wasGrounded=f.grounded;if(f.grounded&&f.platform>=0){const platform=this.map.platforms[f.platform];if(platform?.motion){f.x+=platform.dx||0;f.y+=platform.dy||0;}}const oldY=f.y;");
sub("  if(f.jumpBuffer>0&&f.dashRemaining<=0", "  if(f.jumpBuffer>0&&!f.grounded&&f.wallSide&&f.wallId!==f.lastWall&&!['stunned','clash','pushed','dead'].includes(f.state)&&f.dashRemaining<=0){f.vx=-f.wallSide*430;f.vy=-850*r.jump;f.wallLock=.15;f.wallJumpTime=.23;f.lastWall=f.wallId;f.jumpBuffer=0;f.jumping=true;f.coyote=0;this.emit('wallJump',{id:f.id});}\n  if(f.jumpBuffer>0&&f.dashRemaining<=0");
s=s.replaceAll("['dash','stunned','clash','dead']","['dash','slide','stunned','clash','pushed','dead']");
sub('f.vx=f.dashX*s.dashSpeed*r.dashDistance;','f.vx=f.dashX*s.dashSpeed*r.dashDistance*(f.slideRemaining>0?.55:1);');
sub("locked=['stunned','clash'].includes(f.state)","locked=['stunned','clash','pushed'].includes(f.state)");
sub('if(!locked)f.vx+=','if(!locked&&f.wallLock<=0)f.vx+=');
sub('else f.vx*=Math.exp(-5*dt);','else if(locked)f.vx*=Math.exp(-5*dt);');
sub("  if(f.grounded&&f.dashRemaining<=0)f.airUsed=false;","  this.collideWalls(f,oldX,oldY);\n  if(f.grounded){f.lastWall=-1;if(f.dashRemaining<=0)f.airUsed=false;}");
const marker=' bodyContact(a,d)';
sub(marker,` updatePlatforms(time,carry=true){for(const p of this.map.platforms){const y=p.motion?p.baseY+Math.sin(time*Math.PI*2/p.motion.period)*p.motion.y:p.baseY;p.dy=carry?y-p.y:0;p.dx=0;p.y=y;}}
 collideWalls(f,oldX=f.x,oldY=f.y){f.wallSide=0;f.wallId=-1;const b=body(f);for(let i=0;i<this.map.walls.length;i++){const w=this.map.walls[i];if(f.x+b.radius<w.x||f.x-b.radius>w.x+w.w||f.y-b.bottom-b.radius<=w.y||f.y-b.top-b.radius>=w.y+w.h)continue;
   if(oldY-b.top-b.radius>=w.y+w.h&&f.vy<0){f.y=w.y+w.h+b.top+b.radius;f.vy=0;continue;}
   if(oldX<=w.x||f.x<w.x+w.w/2){f.x=w.x-b.radius;f.wallSide=1;if(f.vx>0)f.vx=0;}else{f.x=w.x+w.w+b.radius;f.wallSide=-1;if(f.vx<0)f.vx=0;}f.wallId=i;if(f.dashRemaining>0){f.dashRemaining=0;if(['dash','slide'].includes(f.state))this.setState(f,'dashRecovery',.09);}
  }}
`+marker);
sub('polygonSegment(slash(a).points,{x:d.x,y:d.y-C.bodyTop},{x:d.x,y:d.y-C.bodyBottom},C.radius)', 'polygonSegment(slash(a,this.map.walls).points,{x:d.x,y:d.y-body(d).top},{x:d.x,y:d.y-body(d).bottom},body(d).radius)');
s=s.replaceAll('slash(a).points','slash(a,this.map.walls).points').replaceAll('ps=slash(p),es=slash(e)','ps=slash(p,this.map.walls),es=slash(e,this.map.walls)');
sub("  if(hits.length){",`  if(!hits.length)for(const[a,d]of[[p,e],[e,p]]){if(a.state!=='kickActive'||a.kickHit)continue;const y=a.y-body(a).center+12,from={x:a.x+a.kickSide*18,y},to={x:a.x+a.kickSide*56,y},db=body(d);if(segmentDistance(from,to,{x:d.x,y:d.y-db.top},{x:d.x,y:d.y-db.bottom})<=db.radius+9){a.kickHit=true;this.setState(d,'pushed',.12);d.vx=a.kickSide*570;d.vy=Math.min(d.vy,-85);d.grounded=false;this.hitstop=.035;this.emit('kick',{id:a.id,x:d.x,y:d.y-db.center});}}
  if(hits.length){`);
sub('if(winner>=0)this.score[winner]++;','if(winner>=0&&this.mode!==\'training\')this.score[winner]++;');
sub('this.roundTimer=C.roundPause;','this.roundTimer=this.mode===\'training\'?.6:C.roundPause;');
sub('Math.abs(a.y-b.y)>126*SCALE','a.y-body(a).bottom+body(a).radius<b.y-body(b).top-body(b).radius||b.y-body(b).bottom+body(b).radius<a.y-body(a).top-body(a).radius');
sub('  return inp;\n }\n step','  if(e.wallSide&&inp.move*e.wallSide>0&&ai.jumpDelay<=0){inp.jump=true;inp.jumpHeld=true;ai.jumpDelay=.3;}if(p.state===\'parry\'&&dist<62&&this.canAct(e))inp.kick=true;\n  return inp;\n }\n step');
sub("this.time+=dt;","this.time+=dt;this.updatePlatforms(this.time);");
sub('if(winner>=0){this.phase=',"if(winner>=0&&this.mode!=='training'){this.phase=");
sub('if(commands[0].move*','this.lastCommands=commands.map(c=>({...c}));if(commands[0].move*');
sub("if(inp.dash)this.dash(i,inp.move);if(inp.attack)this.attack(i);else if(inp.parry)this.parry(i);", "if(f.queued&&this.canAct(f)){const q=f.queued;f.aim=q.aim;this.command(i,q.action,q);f.aim=inp.aim;}if(inp.dash)this.command(i,'dash',inp);if(inp.attack)this.command(i,'attack',inp);if(inp.parry)this.command(i,'parry',inp);if(inp.kick)this.command(i,'kick',inp);");
sub('this.separateBodies();this.resolveCombat();','this.separateBodies();for(const f of this.fighters)if(!f.dead)this.collideWalls(f);this.resolveCombat();');
sub('this.events=[];return true;','this.updatePlatforms(this.time,false);this.events=[];return true;');
sub('const api={SCALE,','const api={body,SCALE,');
wr('engine.js',s);
s=rd('controls.js').replace("dash:'Dash',pause:","dash:'Dash / deslizar',kick:'Chutar',reset:'Reiniciar treino',pause:").replace("dash:['ShiftLeft','ShiftRight'],pause:","dash:['ShiftLeft','ShiftRight'],kick:['KeyE','KeyL'],reset:['KeyR'],pause:").replace('dash:[1],pause:','dash:[1],kick:[2],reset:[8],pause:').replace('parry:false,dash:false','parry:false,dash:false,kick:false,reset:false').replace('f.y-DuelCore.C.bodyCenter','f.y-DuelCore.body(f).center').replace("1:'B / ○',4:","1:'B / ○',2:'X / □',8:'VIEW',4:");wr('controls.js',s);
s=rd('network.js').replace('VERSION = 32','VERSION = 33').replaceAll('umcorte-v3-2-','umcorte-v3-3-').replaceAll('um-corte-v3-2','um-corte-v3-3').replace("'swordsman', 'reaper'","'swordsman', 'reaper', 'random'");wr('network.js',s);
