const A=require('node:assert/strict');require('./bootstrap.cjs');const D=global.DuelCore,L=global.DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(items=[]){const g=new D.Game({mode:'local',ai:false,rules:{specials:false}});g.start({legacies:[items,[]]});g.phase='playing';g.map.walls=[];g.map.platforms=[{x:0,y:700,baseX:0,baseY:700,w:2000,stage:'solid',solid:true}];g.fighters.forEach((f,i)=>Object.assign(f,{x:500+i*800,y:700,grounded:true,state:'idle',aim:0}));return g;}
function step(g,t){for(let i=0;i<Math.round(t*1000);i++){g.time+=.001;L.worldStep(g,.001);}}
function zenith(g){const f=g.fighters[0];f.attackId=++g.attackCounter;g.setState(f,'active',.12);f.attackAim=0;g.emit('swing',{id:0});return L.world(g).entities.filter(e=>e.type==='spectralblade');}
test('Zenith warns three fixed distinct curves, does not home, and has bounded lifetime',()=>{
 const g=game(['zenith']),shots=zenith(g),origin=L.center(g.fighters[0]);A.equal(shots.length,3);step(g,.07);A(shots.every(e=>e.x===origin.x&&e.y===origin.y));g.fighters[0].x+=500;g.fighters[0].aim=Math.PI;step(g,.18);A.equal(new Set(shots.map(e=>Math.round(e.y))).size,3);A(shots.every(e=>e.x<origin.x+250));step(g,.3);A(!L.world(g).entities.some(e=>e.type==='spectralblade'));
});
test('Zenith blades stop at terrain and can be reflected out of their scripted path',()=>{
 for(const wall of [false,true]){const g=game(['zenith']),t=g.fighters[1],shots=zenith(g),e=shots[1];for(const s of [shots[0],shots[2]])s.life=0;if(wall){g.map.walls=[{x:570,y:300,w:20,h:400}];step(g,.3);A(!L.world(g).entities.includes(e));}else{t.x=620;t.aim=Math.PI;g.parry(1);step(g,.25);A(e.reflected);A.equal(e.owner,1);A.equal(e.path,null);A(e.vx<0);A(!t.dead);}}
});
test('Amaterasu spreads once to two neighboring surface patches, each with warning',()=>{
 const g=game(['amaterasu']);L.activate(g,g.fighters[0],'amaterasu',{aim:Math.PI/4});step(g,.96);let fires=L.world(g).entities.filter(e=>e.type==='blackfire');A.equal(fires.length,3);A(fires.slice(1).every(e=>e.age<e.warn&&e.r===28));const lo=Math.min(...fires.map(e=>e.x)),hi=Math.max(...fires.map(e=>e.x));A.equal(hi-lo,130);step(g,1.5);A.equal(L.world(g).entities.filter(e=>e.type==='blackfire').length,3);step(g,2);A(!L.world(g).entities.some(e=>e.type==='blackfire'));
});
test('black fire crosses connected platform edges, never empty gaps',()=>{
 for(const connected of [false,true]){const g=game(['amaterasu']);g.map.platforms=[{x:540,y:700,w:65,stage:'solid'},{x:connected?605:625,y:700,w:120,stage:'solid'}];L.activate(g,g.fighters[0],'amaterasu',{aim:Math.PI/4});step(g,.96);const fires=L.world(g).entities.filter(e=>e.type==='blackfire');A.equal(fires.some(e=>e.index===1),connected);}
});
test('surface flames follow moving supports and vanish if the support collapses',()=>{
 const g=game(['amaterasu']);L.activate(g,g.fighters[0],'amaterasu',{aim:Math.PI/4});const e=L.world(g).entities[0],x=e.x,y=e.y;g.map.platforms[0].x+=20;g.map.platforms[0].y-=15;step(g,.1);A.equal(e.x,x+20);A.equal(e.y,y-15);g.map.platforms[0].stage='gone';step(g,.01);A(!L.world(g).entities.includes(e));
});
test('curves and spreading regions reproduce identically after snapshot restoration',()=>{
 const g=game(['zenith','amaterasu']);zenith(g);L.activate(g,g.fighters[0],'amaterasu',{aim:Math.PI/4});step(g,.16);const h=new D.Game();h.loadSnapshot(g.snapshot());h.map=L.clone(g.map);for(let i=0;i<140;i++){step(g,.01);step(h,.01);A.deepEqual(h.snapshot(),g.snapshot());}
});
console.log(count+' V8 spectral trajectories/surface fire groups passed');
