const A=require('node:assert/strict');require('./bootstrap.cjs');const D=DuelCore,L=DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
const platform=(x,y,w,more={})=>({x,y,w,baseX:x,baseY:y,stage:'solid',solid:true,...more});
function game(inverted=true){
 const g=new D.Game({mode:'pve',ai:true,difficulty:'hard',rules:{specials:false},random:L.rng(53)});g.start({legacies:[[],['gravitycloak','sword']]});g.phase='playing';
 g.map.width=1800;g.map.height=1100;g.map.deathY=1450;g.map.walls=[];g.map.platforms=[platform(0,1000,1800),platform(200,250,1000)];
 const f=g.fighters[1],p=g.fighters[0],off=D.body(f).center*2;
 Object.assign(f,{x:350,y:inverted?250+off:1000,vx:0,vy:0,grounded:true,platform:inverted?1:0,state:'idle'});f.legacy.effects.inverted=inverted;
 Object.assign(p,{x:1050,y:250+off,vx:0,vy:0,grounded:true,platform:1,state:'idle'});L.ensure(p).effects.inverted=true;
 L.ai(g,1,.01);f.brain.abilityAt=1e6;f.brain.delay=1e6;f.brain.decision=1e6;f.brain.bait=false;
 return g;
}
function observed(g){g.time=.04;L.ai(g,1,.01);g.time+=g.fighters[1].brain.reaction+.01;return L.ai(g,1,.01);}
function target(f){return{x:f.x,y:f.y,vy:f.vy,grounded:f.grounded,platform:f.platform,inverted:!!f.legacy?.effects.inverted};}
test('navigation reflects feet, velocity and surfaces without mutating world or aim',()=>{
 const g=game(),f=g.fighters[1],p=g.fighters[0],before=L.clone(g.snapshot()),map=L.clone(g.map),inp={...D.neutral(),aim:-.7};f.brain.navInverted=true;
 const frame=L.navigationFrame(g,f,target(p));A.equal(frame.actor.y,850);A.equal(frame.map.platforms[1].y,850);A.equal(frame.target.y,850);
 L.navigate(g,f,target(p),inp);A.equal(inp.aim,-.7);A.deepEqual(g.map,map);A.equal(f.y,before.fighters[1].y);A.equal(f.legacy.effects.inverted,true);
 const opposite=L.navigationFrame(g,f,{...target(p),inverted:false});A.equal(opposite.target.grounded,false);A.equal(opposite.target.platform,-1);
});
test('ordinary gravity keeps the existing navigation decision',()=>{
 const g=game(false),f=g.fighters[1],p=g.fighters[0];L.ensure(p).effects.inverted=false;Object.assign(p,{x:900,y:800,platform:2});g.map.platforms.push(platform(800,800,300));
 const a=D.neutral(),b=D.neutral();g.ai=f.brain;g.navigateAI(f,p,a);f.brain.navTarget=-1;f.brain.jumpDelay=0;L.navigate(g,f,{...target(p),inverted:false},b);A.deepEqual(a,b);
});
test('route caches cannot confuse opposite gravities, moving or collapsed supports',()=>{
 const g=game(),f=g.fighters[1];g.map.platforms.push(platform(1200,450,400));g.routeCache.set(f.kind+':1:2',-1);
 const p={x:1300,y:450+D.body(f).center*2,platform:2,grounded:true,inverted:true};A(L.navigate(g,f,p,D.neutral()));
 g.map.platforms[2].stage='gone';f.grounded=false;f.brain.navTarget=2;L.navigate(g,f,p,D.neutral());A.equal(f.brain.navTarget,-1);
 f.brain.navTarget=1;f.legacy.effects.inverted=false;L.navigate(g,f,p,D.neutral());A.equal(f.brain.navTarget,-1);
});
test('inverted jump and double jump push down, restore on ceiling and preserve world dash',()=>{
 const g=game(),f=g.fighters[1];g.aiEnabled=false;
 g.step(1/240,[D.neutral(),{...D.neutral(),jump:true,jumpHeld:true}]);A(f.vy>800);A(!f.grounded);
 g.step(1/240,[D.neutral(),{...D.neutral(),jump:true,jumpHeld:true}]);A.equal(f.airJumps,0);A(f.vy>800);
 f.vy=-200;g.step(1/240,[D.neutral(),{...D.neutral(),jump:true,jumpHeld:true}]);A(f.vy<0);
 for(let i=0;i<400&&!f.grounded;i++)g.step(1/240,[D.neutral(),D.neutral()]);A(f.grounded);A.equal(f.airJumps,1);
 g.step(1/240,[D.neutral(),{...D.neutral(),jump:true,jumpHeld:true}]);for(let i=0;i<24;i++)g.step(1/240,[D.neutral(),{...D.neutral(),jumpHeld:true}]);g.step(1/240,[D.neutral(),{...D.neutral(),dash:true,up:true}]);A(f.vy<0);A.equal(f.airJumps,1);
});
test('bot waits for observations, then walks on a ceiling without false edge panic',()=>{
 const g=game(),f=g.fighters[1];A.equal(L.ai(g,1,.001).move,0);const inp=observed(g);A.equal(inp.move,1);A(!inp.jump);A.equal(inp.aim,0);
 const start=f.x;for(let i=0;i<360;i++)g.step(1/240,[D.neutral()]);A(f.x>start+180);A(f.grounded);A.equal(f.platform,1);A(f.legacy.effects.inverted);
});
test('variable jump, second jump and fast fall decisions follow personal gravity',()=>{
 const g=game(),f=g.fighters[1],p=g.fighters[0];f.grounded=false;f.platform=-1;f.vy=100;f.y=500;p.y=760;p.grounded=false;f.dashCharges=0;let inp=observed(g);A(inp.jump);A(inp.jumpHeld);
 f.brain.observations=[];f.brain.jump=10;f.vy=-300;p.y=260;L.ai(g,1,.01);g.time+=.3;inp=L.ai(g,1,.01);A(inp.down);A(!inp.jumpHeld);
});
test('pursuit dash retains world-space vertical input while inverted',()=>{
 const g=game(),f=g.fighters[1],p=g.fighters[0];f.grounded=false;f.platform=-1;f.y=600;p.x=f.x+210;p.y=f.y-150;p.grounded=false;
 const inp=observed(g);A(inp.dash);A(inp.up);A(!inp.down);A(!inp.jump);
});
test('gravity cloak stays on with a ceiling, and turns off without one',()=>{
 for(const safe of [true,false]){const g=game(),f=g.fighters[1];f.brain.abilityAt=0;f.legacy.airTime=5;g.random=()=>0;if(!safe)g.map.platforms.splice(1);const inp=observed(g);A.equal(inp.legado?.includes('gravitycloak')||false,!safe);}
});
test('dropped weapon can request normal gravity without stealing or attacking',()=>{
 const g=game(),f=g.fighters[1];f.legacy.effects.weaponAway=true;f.brain.abilityAt=0;g.random=()=>0;L.entity(g,f,'weapon',{x:550,y:997,weapon:'sword',originalOwner:1,mode:'dropped',life:120});
 const inp=observed(g);A(inp.legado.includes('gravitycloak'));A(!inp.attack);A(!inp.dash);
});
test('bot completes the ceiling-to-floor weapon recovery without flipping back mid-fall',()=>{
 const g=game(),f=g.fighters[1];f.legacy.effects.weaponAway=true;f.brain.abilityAt=0;g.random=()=>0;
 const e=L.entity(g,f,'weapon',{x:650,y:997,weapon:'sword',originalOwner:1,mode:'dropped',life:120,age:1});
 let released=false;for(let i=0;i<2400&&f.legacy.effects.weaponAway;i++){g.step(1/240,[D.neutral()]);if(!f.legacy.effects.inverted)released=true;if(released)A(!f.legacy.effects.inverted);A(!f.dead);}
 A(released);A(!f.legacy.effects.weaponAway,JSON.stringify({x:f.x,y:f.y,vy:f.vy,state:f.state,platform:f.platform,nav:f.brain.navTarget,weapon:{x:e.x,y:e.y,mode:e.mode},inp:g.lastCommands[1]}));A(!L.world(g).entities.includes(e));
});
test('real movement navigates successive inverted platforms with no teleport or rescue',()=>{
 const g=game(),f=g.fighters[1];g.aiEnabled=false;g.map.platforms=[platform(100,230,300),platform(450,420,300),platform(820,280,380),platform(1350,1000,400)];Object.assign(f,{x:230,y:230+D.body(f).center*2,platform:0});Object.assign(g.fighters[0],{x:1500,y:1000,platform:3});g.fighters[0].legacy.effects.inverted=false;
 const visited=new Set([0]);for(const goal of [1,2,0]){const q=g.map.platforms[goal],p={x:q.x+q.w/2,y:q.y+D.body(f).center*2,platform:goal,grounded:true,inverted:true};let reached=false;
  for(let i=0;i<2400&&!f.dead;i++){const inp=D.neutral();f.brain.jumpDelay-=1/240;L.navigate(g,f,p,inp);g.step(1/240,[D.neutral(),inp]);if(f.grounded)visited.add(f.platform);if(f.grounded&&f.platform===goal){reached=true;break;}}
  A(reached,'failed platform '+goal+' at '+f.x+','+f.y);
 }A.deepEqual([...visited].sort(),[0,1,2]);A(!g.events.some(e=>e.type==='adminRescue'));
});
test('inverted AI state and decisions resume identically from a snapshot',()=>{
 const g=game();for(let i=0;i<130;i++)g.step(1/240,[D.neutral()]);const h=new D.Game();h.loadSnapshot(L.clone(g.snapshot()));h.map=L.clone(g.map);
 for(let i=0;i<480;i++){g.step(1/240,[D.neutral()]);h.step(1/240,[D.neutral()]);A.deepEqual(h.snapshot(),g.snapshot());}
});
test('drop-through uses the same one-way platform rule upside down',()=>{
 const g=game(),f=g.fighters[1];g.aiEnabled=false;g.map.platforms[1].solid=false;g.map.platforms.push(platform(200,100,1000));
 const inp=D.neutral(),p={x:500,y:100+D.body(f).center*2,platform:2,grounded:true,inverted:true};L.navigate(g,f,p,inp);A(inp.jump&&inp.down);A(!inp.jumpHeld);
 g.step(1/240,[D.neutral(),inp]);A(f.dropTimer>0);for(let i=0;i<200&&!f.grounded;i++)g.step(1/240,[D.neutral(),D.neutral()]);A.equal(f.platform,2);
});
test('moving ceiling carries actor and navigation observes the current surface',()=>{
 const g=game(),f=g.fighters[1];g.aiEnabled=false;g.map.platforms[1].motion={period:3,y:45};
 for(let i=0;i<480;i++){g.step(1/240,[D.neutral(),D.neutral()]);A(f.grounded);A(Math.abs(f.y-g.map.platforms[1].y-D.body(f).center*2)<1e-6);const frame=L.navigationFrame(g,f);A(Math.abs(frame.actor.y-frame.map.platforms[1].y)<1e-6);}
});
test('wall jump under inverted gravity pushes away from the wall and ceiling',()=>{
 const g=game(),f=g.fighters[1];g.aiEnabled=false;Object.assign(f,{y:600,grounded:false,platform:-1,wallSide:1,wallId:0,lastWall:-1,wallReleased:true,wallLock:0});
 g.step(1/240,[D.neutral(),{...D.neutral(),jump:true,jumpHeld:true,move:1,up:true}]);A(f.vx<0);A(f.vy>800);A(f.wallJumpTime>0);A.equal(f.airJumps,1);
});
test('full AI pursues a moving rival on a long ceiling for twenty seconds',()=>{
 const g=game(),f=g.fighters[1],p=g.fighters[0];g.map.platforms[1].x=g.map.platforms[1].baseX=80;g.map.platforms[1].w=1640;Object.assign(p,{x:1100});
 let min=Infinity,max=-Infinity,move=-1;for(let i=0;i<4800;i++){if(p.x<400)move=1;if(p.x>1300)move=-1;g.step(1/240,[{...D.neutral(),move}]);min=Math.min(min,f.x);max=Math.max(max,f.x);A(!f.dead);A.equal(g.phase,'playing');A(Number.isFinite(f.x)&&Number.isFinite(f.y));}
 A(max-min>350);A(f.grounded);A(f.legacy.effects.inverted);A(!g.events.some(e=>e.type==='adminRescue'));
});
console.log(count+' V8 inverted navigation groups passed');
