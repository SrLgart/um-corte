const A=require('node:assert/strict');require('./bootstrap.cjs');const D=DuelCore,L=DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(ids=[]){const g=new D.Game({mode:'local',ai:false,rules:{specials:false},random:L.rng(2)});g.start({legacies:[ids,[]]});g.phase='playing';g.map.walls=[];g.map.platforms=[{x:0,y:900,w:g.map.width,baseX:0,baseY:900,stage:'solid',solid:true}];Object.assign(g.fighters[0],{x:500,y:600,vx:0,vy:0,grounded:false,platform:-1,coyote:0,state:'idle'});g.fighters[1].x=1500;return g;}
test('Icarus hover integrates once; descent has exact controlled speed',()=>{
 const g=game(['icarus']),f=g.fighters[0];L.activate(g,f,'icarus');const y=f.y;g.moveFighter(f,D.neutral(),.05);A.equal(f.y,y);g.moveFighter(f,{...D.neutral(),down:true},.05);A.equal(f.y,y+17.5);A(f.legacy.fuel<1);
});
test('Icarus and glide obey walls through shared physics, not after-move teleport',()=>{
 for(const id of ['icarus','glider']){const g=game([id]),f=g.fighters[0];g.map.walls=[{x:530,y:300,w:20,h:500}];L.activate(g,f,id);for(let n=0;n<20;n++)g.moveFighter(f,{...D.neutral(),move:1},.02);A(f.x+D.body(f).radius<=530+.01);}
});
test('Rocket fuel clamps to zero, falls when exhausted and restores only grounded',()=>{
 const g=game(['rockets']),f=g.fighters[0];f.legacy.fuel=.001;g.moveFighter(f,{...D.neutral(),jumpHeld:true},.02);A.equal(f.legacy.fuel,0);f.vy=0;g.moveFighter(f,{...D.neutral(),jumpHeld:true},.02);A(f.vy>0);L.beforeStep(g,[D.neutral(),D.neutral()],.2);A.equal(f.legacy.fuel,0);f.grounded=true;L.beforeStep(g,[D.neutral(),D.neutral()],.2);A(f.legacy.fuel>0);
});
test('Glide stays usable after other equipment exhausts fuel and closes on release',()=>{
 const g=game(['glider','rockets','icarus']),f=g.fighters[0];f.legacy.fuel=0;f.vy=300;g.moveFighter(f,{...D.neutral(),jumpHeld:true,move:1},.02);A.equal(f.vy,90);const speed=f.vx;g.moveFighter(f,{...D.neutral(),jumpHeld:true},.02);A.equal(f.vx,speed);g.moveFighter(f,D.neutral(),.02);A(f.vy>90);A.equal(f.legacy.flight,null);
});
test('Dash direction wins throughout dash, not just the activation frame',()=>{
 const g=game(['icarus','rockets']),f=g.fighters[0];L.activate(g,f,'icarus');A(g.dash(0,1));const fuel=f.legacy.fuel;g.moveFighter(f,{...D.neutral(),jumpHeld:true,up:true},.02);A.equal(f.vy,0);A.equal(f.legacy.fuel,fuel);A.equal(f.legacy.flight,null);
});
test('Double jump remains immediate and fast fall overrides glide/rockets',()=>{
 for(const id of ['glider','rockets']){const g=game([id]),f=g.fighters[0];g.moveFighter(f,{...D.neutral(),jump:true,jumpHeld:true},.001);A.equal(f.airJumps,0);A(f.vy<-800);f.vy=400;g.moveFighter(f,{...D.neutral(),down:true,jumpHeld:true},.02);A(f.vy>400);A(f.fastFalling);}
});
test('Flight cannot cancel stun and snapshots preserve energy/control',()=>{
 const g=game(['icarus']),f=g.fighters[0];L.activate(g,f,'icarus');g.setState(f,'stunned',1);f.vy=200;g.moveFighter(f,{...D.neutral(),jumpHeld:true},.02);A(f.vy>200);A.equal(f.legacy.fuel,1);g.setState(f,'idle');g.moveFighter(f,{...D.neutral(),jumpHeld:true},.02);const snap=g.snapshot(),copy=new D.Game({ai:false});copy.loadSnapshot(L.clone(snap));A.deepEqual(copy.fighters[0].legacy,f.legacy);
});
test('Kneepads extends slide state and Iaijutsu anchor by the actual extra duration',()=>{
 const g=game(['kneepads']),f=g.fighters[0];f.y=900;f.grounded=true;A(g.dash(0,1,true));A(Math.abs(f.dashRemaining-.364)<1e-9);A.equal(f.duration,f.dashRemaining);A.equal(f.legacy.groundDashEnds,g.time+f.dashRemaining);g.tickState(f,.30);A.equal(f.state,'slide');g.tickState(f,.07);A.notEqual(f.state,'slide');
});
test('Icarus world up stays up under inverted gravity and energy is exposed in HUD status',()=>{
 const g=game(['icarus','gravitycloak']),f=g.fighters[0];L.activate(g,f,'icarus');L.activate(g,f,'gravitycloak');const y=f.y;g.moveFighter(f,{...D.neutral(),up:true},.02);A.equal(f.vy,-350);A(f.y<y);A.equal(L.status(f,'icarus').energy,f.legacy.fuel);A.equal(L.status(f,'gravitycloak').energy,null);
});
test('Mirror Cloak stores a stationary harmless pose, isolated from later actor changes',()=>{
 const g=game(['mirrorcloak']),f=g.fighters[0],start={x:f.x,y:f.y};A(g.dash(0,1));const e=L.world(g).effects.find(e=>e.type==='afterimage');A(e.pose);A.equal(e.pose.x,start.x);f.x+=100;f.legacy.items.push('sword');A.equal(e.pose.x,start.x);A(!e.pose.legacy.items.includes('sword'));A.equal(L.world(g).entities.length,0);const copy=new D.Game({ai:false});copy.loadSnapshot(L.clone(g.snapshot()));A.deepEqual(L.world(copy).effects.find(e=>e.type==='afterimage'),e);
});
console.log(count+' V8 flight integration groups passed');
