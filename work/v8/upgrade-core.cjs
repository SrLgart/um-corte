const fs=require('fs'),path=require('path'),p=f=>path.join(__dirname,f);
let s=fs.readFileSync(p('../v72/engine.js'),'utf8');
function swap(a,b){if(!s.includes(a))throw Error('Missing core anchor '+a.slice(0,100));s=s.replace(a,b);}
swap("speed:395,dashSpeed:1120","speed:445,dashSpeed:1120");
swap("const source=(typeof f", "const originalSource=(typeof f");
swap(",as=typeof f==='object'?",",source=root.DuelLegacy?.weaponStats(f,originalSource)||originalSource,as=typeof f==='object'?");
for(const name of ['slash','blade']){const start=s.indexOf('function '+name+'('),end=s.indexOf('\nfunction ',start+10);let block=s.slice(start,end);block=block.replace("const s=stats(f)","const kind=root.DuelLegacy?.weaponKind(f)||f.kind,s=stats(f)").replaceAll("f.kind===","kind===");s=s.slice(0,start)+block+s.slice(end);}
swap("function slash(f,walls=[]){if", "function slash(f,walls=[]){if(f.legacyNoSlash)return{points:[]};if");
swap("if(f.ultMode==='unarmed')return false;","if(f.ultMode==='unarmed'||f.legacy?.effects?.mist>0)return false;");
// Clean pre-hit hook is used by every fatal weapon/ability, including trade handling.
swap("absorb(f,a){if", "absorb(f,a){if(root.DuelLegacy?.protect(this,f,a))return true;if");
// Optional integrations never run in vanilla games.
swap("const commands=[inputs[0]||neutral(),this.aiEnabled?this.updateAI(dt):inputs[1]||neutral()];", "const commands=this.fighters.map((f,i)=>this.aiEnabled&&i>0?(root.DuelLegacy?.ai(this,i,dt)||this.updateAI(dt)):inputs[i]||neutral());this.legacyFrame=commands;root.DuelLegacy?.beforeStep(this,commands,dt);if(this.legacyRewind){root.DuelLegacy?.worldStep(this,0);return;}if(this.phase!=='playing')return;");
swap("for(let i=0;i<2;i++){const f=this.fighters[i],inp=commands[i];this.tickState(f,dt);", "for(let i=0;i<this.fighters.length;i++){const f=this.fighters[i],inp=commands[i],actorDt=dt*(root.DuelLegacy?.timeScale(this,f)??1);if(!actorDt)continue;this.tickState(f,actorDt);root.DuelLegacy?.command(this,f,inp,actorDt);");
swap("this.moveFighter(f,inp,dt);}","this.moveFighter(f,inp,actorDt);root.DuelLegacy?.afterMove(this,f,inp,actorDt);}");
swap("this.resolveCombat();if(this.phase!=='playing')return;this.updateDaggers(dt);", "this.resolveCombat();if(this.legacyRewind){root.DuelLegacy?.worldStep(this,0);return;}if(this.phase!=='playing')return;root.DuelLegacy?.worldStep(this,dt);if(this.phase!=='playing')return;this.updateDaggers(dt);");
swap("if(f.grounded){f.airJumps=1;", "if(f.grounded){f.airJumps=1+(root.DuelLegacy?.has(f,'wingboot')?1:0);");
// Direct access keeps the same acceleration, coyote, buffer and collision implementation.
swap("f.vy+=1980*r.gravity*(inp.down", "f.vy+=1980*r.gravity*(f.legacy?.effects?.inverted?-1:1)*(inp.down");
swap("this.collideWalls(f,oldX,oldY);", "if(!f.legacy?.effects?.phasing)this.collideWalls(f,oldX,oldY);");
swap("for(const f of this.fighters)if(!f.dead)this.collideWalls(f);", "for(const f of this.fighters)if(!f.dead&&!f.legacy?.effects?.phasing)this.collideWalls(f);");
// Extension callbacks are semantic actions, never physical bindings.
swap("const neutral=()=>({move:0", "const neutral=()=>({legado:[],legadoHeld:[],kickHeld:false,move:0");
swap("const api={RUNNER", "const api={wallFraction,wallContour,RUNNER");
swap("s.fighters.length!==2", "(s.pathEncounter?s.fighters.length<2||s.fighters.length>4:s.fighters.length!==2)");
swap("this.fighters[1-f.id].x-f.x", "(this.fighters[f.id?0:1]?.x??f.x)-f.x");
swap("const d=this.fighters[1-owner.id];", "const d=this.fighters.find(t=>!t.dead&&t.id!==owner.id&&(!this.pathEncounter||!!t.id!==!!owner.id));if(!d)continue;");
swap("Object.assign(f,this.map.spawns[f.id],", "Object.assign(f,this.map.spawns[f.id?1:0],");
swap("dead.length===2||this.fallTimer<=0", "(this.pathEncounter?this.fighters[0].dead||this.fighters.slice(1).every(f=>f.dead):dead.length===2)||this.fallTimer<=0");
swap("this.deathInfo(null,f);this.metrics", "if(root.DuelLegacy?.fallRescue(this,f))return;this.deathInfo(null,f);this.metrics");
swap("if(f.vy>=0){for(let i=0;i<this.map.platforms.length;i++)", "if(f.vy>=0&&!f.legacy?.effects?.phasing){for(let i=0;i<this.map.platforms.length;i++)");
swap("if(!f.dead&&f.y>this.map.deathY)", "if(!f.dead&&(f.y>this.map.deathY||f.legacy?.effects?.inverted&&f.y-body(f).top<-(this.map.deathY-this.map.height)))");
// Delayed cuts reuse the original slash algorithm with the recorded geometry.
swap("function slash(f,walls=[]){", "function slash(f,walls=[],geometry=null){");
swap("const kind=root.DuelLegacy?.weaponKind(f)||f.kind,s=stats(f),size=f.admin?.attackScale||1,aim=f.attackAim,origin={x:f.x,y:f.y-body(f).center}", "const kind=geometry?.kind||root.DuelLegacy?.weaponKind(f)||f.kind,s=geometry?.stats||stats(f),size=geometry?.size||f.admin?.attackScale||1,aim=f.attackAim,origin={x:f.x,y:f.y-(geometry?.center??body(f).center)}");
swap("if(kind==='boxer'){const extension", "if((geometry?.technique??root.DuelLegacy?.attackTechnique(f)?.type)==='lunge'){const lo=Math.min(s.minRange,25*size),hi=s.reach*(.82+.18*Math.sin(progress*Math.PI)),half=7*size;points=[[lo,-half*.35],[hi-16*size,-half],[hi,0],[hi-16*size,half],[lo,half*.35]].map(p=>at(...p));}\n else if(kind==='boxer'){const extension");
swap("if(f.ultMode==='fenceStrike'&&f.fenceRemaining>0)", "if(root.DuelLegacy?.techniqueVelocity(this,f,dt)){}else if(root.DuelLegacy?.impulseVelocity(this,f,inp,dt)){}else if(f.ultMode==='fenceStrike'&&f.fenceRemaining>0)");
swap("moveFighter(f,inp,dt){if(f.dead)return;", "moveFighter(f,inp,dt){if(f.dead)return;if(root.DuelLegacy?.attackTechnique(f)){inp={...inp,move:0,jump:false,jumpHeld:true};f.jumpBuffer=0;}");
swap("f.wallSliding=!f.grounded", "root.DuelLegacy?.flightVelocity(this,f,inp,dt);root.DuelLegacy?.wallClothingVelocity(this,f,inp,dt);f.wallSliding=!f.grounded");
swap("if(a.state==='ultCharge'||b.state==='ultCharge'||a.dead", "if(root.DuelLegacy?.crossing(a)||root.DuelLegacy?.crossing(b)||a.state==='ultCharge'||b.state==='ultCharge'||a.dead");
swap("if(valid){d.guardVisual=", "if(valid){const disarmEligible=root.DuelLegacy?.canDisarm(a)??false;d.guardVisual=");
swap("attackerKind:a.kind,height:incoming.sector", "attacker:a.id,attackerKind:a.kind,disarmEligible,height:incoming.sector");
swap("const s=stats(f),r=this.rules,oldX=f.x,wasGrounded=f.grounded;", "const s=stats(f),r=root.DuelLegacy?.movementRules(this,f)||this.rules,oldX=f.x,wasGrounded=f.grounded;");
swap("d.vx=a.kickSide*570;d.vy=Math.min(d.vy,-85);", "d.vx=a.kickSide*570*(root.DuelLegacy?.knockbackScale(d)??1);d.vy=Math.min(d.vy,-85*(root.DuelLegacy?.knockbackScale(d)??1));");
swap("a.vx=(a.x<d.x?-1:1)*120;", "a.vx=(a.x<d.x?-1:1)*120*(root.DuelLegacy?.knockbackScale(a)??1);");
swap("?-1:1)*170;", "?-1:1)*170*(root.DuelLegacy?.knockbackScale(f)??1);");
// Native Assassin dagger keeps its original state/pickup system; companion hooks
// intercept before fighter damage and never create a second copy of the weapon.
swap("const p=owner.dagger;if(!p||owner.dead)continue;", "const p=owner.dagger;if(!p||owner.dead)continue;if(root.DuelLegacy?.daggerCarry(this,owner,p,dt))continue;");
swap("if(p.mode==='flying'&&!d.dead){", "if(root.DuelLegacy?.daggerIntercept(this,owner,p,from,to))continue;\n   if(p.mode==='flying'&&!d.dead){");
// A copied special shares the existing execution rules, not the fighter identity
// or charge. The mirror owns only its source kind and once-per-match resource.
swap('const clamp=(v,a,b)', 'const specialKind=f=>root.DuelLegacy?.specialKind(f)||f.kind;\nconst clamp=(v,a,b)');
{const begin=s.indexOf(' special(id){'),end=s.indexOf('\n endEdge(',begin);if(begin<0||end<0)throw Error('special source block');let block=s.slice(begin,end).replaceAll('f.kind','kind');block=block.replace('special(id){const f=this.fighters[id];','special(id,copyKind=null){const f=this.fighters[id],kind=copyKind||f.kind;').replace('f.specialCharge+1e-6<this.rules.specialCooldown','!copyKind&&f.specialCharge+1e-6<this.rules.specialCooldown').replace('f.specialCharge=0;','if(!copyKind)f.specialCharge=0;');s=s.slice(0,begin)+block+s.slice(end);}
s=s.replaceAll("f.kind==='reaper'","specialKind(f)==='reaper'").replaceAll("f.kind==='boxer'","specialKind(f)==='boxer'").replaceAll("f.kind==='staff'","specialKind(f)==='staff'");
swap("if(specialKind(f)==='boxer')f.punch=", "if((root.DuelLegacy?.weaponKind(f)||f.kind)==='boxer')f.punch=");
swap("this.emit('special',{id:f.id,kind:f.kind", "this.emit('special',{id:f.id,kind:specialKind(f)");
swap('resetSpecial(f){f.specialCharge=0;', 'resetSpecial(f){if(f.legacy)delete f.legacy.mirrorSpecial;f.specialCharge=0;');
swap("if(this.phase==='playing'&&this.rules.specials&&!f.ultMode", "root.DuelLegacy?.finishMirrorSpecial(f);if(this.phase==='playing'&&this.rules.specials&&!f.legacy?.mirrorSpecial&&!f.ultMode");
swap('function makeMap(id,scale=1,source){',`function sealPathMap(map){if(!map?.path||map.pathEnclosed)return map;const sorted=[...map.walls].sort((a,b)=>a.x-b.x),left=sorted[0],right=sorted.at(-1);if(!left||!right||left===right)return map;const low=left.x+left.w,high=right.x;for(const [w,isLeft]of[[left,true],[right,false]]){w.boundaryBottom=w.y+w.h;w.pathBoundary=true;w.x=isLeft?0:high;w.w=isLeft?low:map.width-high;w.y=-10000000;w.h=w.boundaryBottom-w.y;}for(const p of map.platforms)if(p.wallTop){p.y=p.baseY=-10000000;}map.pathEnclosed=true;return map;}
function makeMap(id,scale=1,source){`);
swap('return{...base,walls,platforms,spawns:', 'return sealPathMap({...base,walls,platforms,spawns:');
swap('deathY:(base.deathY||C.deathY)*scale,scale};','deathY:(base.deathY||C.deathY)*scale,scale});');
swap('const api={wallFraction,', 'const api={sealPathMap,wallFraction,');
swap('if(!f.legacy?.effects?.phasing)this.collideWalls(f,oldX,oldY);',"if(this.map.path||!f.legacy?.effects?.phasing)this.collideWalls(f,oldX,oldY);");
swap('collideWalls(f,oldX=f.x,oldY=f.y){f.wallSide=0;',"collideWalls(f,oldX=f.x,oldY=f.y){if(this.map.pathEnclosed){const ws=this.map.walls.filter(w=>w.pathBoundary).sort((a,b)=>a.x-b.x),b=body(f);if(ws.length===2)f.x=clamp(f.x,ws[0].x+ws[0].w+b.radius,ws[1].x-b.radius);}f.wallSide=0;");
fs.writeFileSync(p('engine.js'),s);
console.log('Shared engine hooks installed; vanilla data and timings preserved.');

// Ground ice changes acceleration through the shared motor, including AI/replay/online.
{const file=require('path').join(__dirname,'engine.js');let code=fs.readFileSync(file,'utf8');const anchor="*(locked?0:1);";if(!code.includes(anchor))throw Error("ground acceleration hook");code=code.replace(anchor,"*(locked?0:1)*(root.DuelLegacy?.friction(this,f)??1);");fs.writeFileSync(file,code);}

