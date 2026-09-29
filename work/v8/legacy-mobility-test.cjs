const A=require('node:assert/strict');require('./bootstrap.cjs');const D=global.DuelCore,L=global.DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(items){const g=new D.Game({mode:'local',ai:false,seed:23,random:L.rng(23),rules:{specials:false}});g.start({legacies:[items,[]]});g.phase='playing';g.map.walls=[];g.map.platforms=[{x:0,y:700,w:g.map.width,baseX:0,baseY:700,stage:'solid',solid:true},{x:100,y:300,w:500,baseX:100,baseY:300,stage:'solid',solid:false}];g.fighters[0].x=300;g.fighters[0].y=600;g.fighters[0].grounded=false;g.fighters[1].x=1200;L.captureRound(g);return g;}
function move(g,n,input=D.neutral()){for(let i=0;i<n;i++)g.moveFighter(g.fighters[0],{...input,jump:i===0&&input.jump},1/600);}
test('gravity cloak lands on the underside of a platform without altering other fighters',()=>{
 const g=game(['gravitycloak']),[f,t]=g.fighters,otherY=t.y;A(L.activate(g,f,'gravitycloak'));move(g,500);A(f.grounded);A.equal(f.platform,1);A(Math.abs(f.y-(300+D.body(f).center*2))<.01);A.equal(t.y,otherY);
});
test('Space and W jump away from the ceiling instead of dropping through it',()=>{
 for(const up of [false,true]){const g=game(['gravitycloak']),f=g.fighters[0];L.activate(g,f,'gravitycloak');move(g,500);const y=f.y;move(g,1,{...D.neutral(),jump:true,jumpHeld:true,up});A(f.vy>800);A(f.y>y);A(!f.grounded);}
});
test('inverted dash keeps its world-space direction and cloak can be disabled',()=>{
 const g=game(['gravitycloak']),f=g.fighters[0];L.activate(g,f,'gravitycloak');A(g.dash(0,1,false,true));move(g,8);A(f.vx>0);A(f.vy<0);f.legacy.cd.gravitycloak=0;A(L.activate(g,f,'gravitycloak'));A.equal(f.legacy.effects.inverted,false);
});
test('leaving the arena upward under inverted gravity is a fatal fall, not an endless escape',()=>{
 const g=game(['gravitycloak']),f=g.fighters[0];L.activate(g,f,'gravitycloak');f.y=-1000;g.step(1/600,[D.neutral(),D.neutral()]);A(f.dead);for(let i=0;i<100;i++)g.step(1/600,[D.neutral(),D.neutral()]);A.equal(g.score[1],1);
});
test('ghost dash crosses platforms and safely returns if it ends inside a wall',()=>{
 const g=game(['ghostsuit']),f=g.fighters[0];f.y=650;A(g.dash(0,0,true,false));move(g,60);A(f.y>700);A(!f.grounded);
 const start=f.legacy.phaseStart;g.map.walls=[{x:450,y:0,w:200,h:950}];f.x=500;f.y=600;f.dashRemaining=0;L.afterMove(g,f,D.neutral(),1/600);A.equal(f.x,start.x);A.equal(f.y,start.y);A.equal(f.legacy.effects.phasing,false);
});
console.log(count+' V8 mobility groups passed');
