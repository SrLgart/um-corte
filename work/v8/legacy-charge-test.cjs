const A=require('node:assert/strict');require('./bootstrap.cjs');const D=global.DuelCore,L=global.DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(weapon){const g=new D.Game({mode:'local',ai:false,rules:{specials:false}});g.start({legacies:[[weapon],[]]});g.phase='playing';g.map.walls=[];g.map.platforms=[{x:0,y:700,w:2400,stage:'solid'}];g.fighters.forEach((f,i)=>Object.assign(f,{x:400+i*900,y:700,grounded:true,state:'idle'}));return g;}
function input(g,fields,dt=.01){const c={...D.neutral(),...fields};L.command(g,g.fighters[0],c,dt);return c;}
function hold(g,aim=0,seconds=.4){input(g,{attack:true,attackHeld:true,aim});for(let i=0;i<seconds/.01;i++)input(g,{attackHeld:true,aim});}
test('charge-weapon quick tap uses press aim and executes its ordinary attack',()=>{
 for(const weapon of ['yamato','ruyi','leviathan']){const g=game(weapon),f=g.fighters[0];f.aim=Math.PI;input(g,{attack:true,attackHeld:false,aim:0});A.equal(f.state,'startup',weapon);A.equal(f.attackAim,0);A(!L.world(g).entities.length);}
});
test('Yamato marks the actual distant region and releases a stationary spatial cut',()=>{
 const g=game('yamato'),f=g.fighters[0];hold(g,0,1);const effects=L.world(g).effects.filter(e=>e.type==='weaponCharge');A.equal(effects.length,1);const tell=effects[0];A.equal(tell.x,700);A.equal(tell.r,70);A(tell.ready);A(!L.world(g).entities.length);input(g,{attackHeld:false,aim:Math.PI});const cut=L.world(g).entities.find(e=>e.type==='spatialcut');A.equal(cut.x,tell.x);A.equal(cut.y,tell.y);A.equal(cut.r,tell.r);A.equal(cut.vx,0);A.equal(f.state,'recovery');A(!L.world(g).effects.some(e=>e.type==='weaponCharge'));
});
test('holding Ruyi extends once without release; recoil requires actual floor contact',()=>{
 for(const groundedTarget of [false,true]){const g=game('ruyi'),f=g.fighters[0];if(!groundedTarget)g.map.platforms=[];hold(g,Math.PI/2);const beams=L.world(g).entities.filter(e=>e.type==='beam');A.equal(beams.length,1);A.equal(beams[0].weapon,'ruyi');A.equal(f.vy,groundedTarget?-1100:0);A(!f.legacy.weaponHold);input(g,{attackHeld:true},1);A.equal(L.world(g).entities.filter(e=>e.type==='beam').length,1);}
});
test('Ruyi extension stops at walls; charge thresholds and recovery follow speed rules',()=>{
 const g=game('ruyi');g.map.walls=[{x:600,y:0,w:30,h:700}];g.rules.attackSpeed=2;hold(g,0,.18);const e=L.world(g).entities.find(e=>e.type==='beam');A.equal(e.to.x,600);A.equal(g.fighters[0].duration,.15*g.rules.attackRecovery);
});
test('interrupted charges cannot fire while stunned or with a removed weapon',()=>{
 for(const action of ['stunned','parry','removed']){const g=game('yamato'),f=g.fighters[0];hold(g);if(action==='stunned')g.setState(f,'stunned',.4);if(action==='removed')L.remove(f,'yamato');input(g,{attackHeld:false,parry:action==='parry'});A(!L.world(g).entities.length,action);A(!f.legacy.weaponHold);}
});
test('charge preparation is available during dash without changing its trajectory',()=>{
 const g=game('yamato'),f=g.fighters[0];A(g.dash(0,1));const direction=[f.dashX,f.dashY];input(g,{attack:true,attackHeld:true,aim:Math.PI});A(f.legacy.weaponHold);input(g,{attackHeld:false});A.equal(f.attackAim,Math.PI);A.deepEqual([f.dashX,f.dashY],direction);A(f.dashRemaining>0);
});
test('gust continuously pushes enemies and light objects but cannot reach through walls',()=>{
 for(const blocked of [false,true]){const g=game('gust'),f=g.fighters[0],t=g.fighters[1];t.x=f.x+150;t.vx=0;A(L.activate(g,f,'gust',{aim:0}));const gust=L.world(g).entities[0],shot=L.projectile(g,t,'arrow',0,{x:gust.x+20,y:gust.y,speed:0,lethal:false,life:3});if(blocked)g.map.walls=[{x:gust.x+5,y:0,w:10,h:700}];L.worldStep(g,.01);const first=t.vx;L.worldStep(g,.01);if(blocked){A.equal(t.vx,0);A.equal(shot.vx,0);}else{A(first>0);A(t.vx>first);A(shot.vx>0);}A(!t.dead);A.equal(t.state,'idle');}
});
console.log(count+' V8 charged weapons/wind groups passed');
