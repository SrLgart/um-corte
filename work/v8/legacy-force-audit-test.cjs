const A=require('node:assert/strict');require('./bootstrap.cjs');const D=DuelCore,L=DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(ids=[]){const g=new D.Game({mode:'local',ai:false,rules:{specials:false},random:L.rng(92)});g.start({legacies:[ids,[]]});g.phase='playing';g.map.walls=[];g.map.platforms=[{x:0,y:900,baseX:0,baseY:900,w:g.map.width,stage:'solid',solid:true}];g.fighters.forEach((f,i)=>Object.assign(f,{x:400+i*800,y:600,state:'idle',grounded:false,platform:-1,coyote:0,vx:0,vy:0,aim:0}));return g;}
test('Pulse is nonlethal, short ranged, occluded by walls and scales knockback only',()=>{
 for(const mode of ['near','far','wall','talisman']){const g=game(['pulse']),f=g.fighters[0],t=g.fighters[1];t.x=f.x+(mode==='far'?200:120);if(mode==='wall')g.map.walls=[{x:450,y:200,w:20,h:700}];if(mode==='talisman')L.add(t,'irontalisman');A(L.activate(g,f,'pulse'));A(!t.dead);A.deepEqual(g.score,[0,0]);if(['near','talisman'].includes(mode)){A.equal(t.state,'pushed');A(Math.abs(t.vx)>300&&Math.abs(t.vx)<660);if(mode==='talisman')A(t.vx<350);}else A.equal(t.vx,0);A(!L.activate(g,f,'pulse'));}
});
test('Pulse pushes loose objects without altering companions, held weapons or zones',()=>{
 const g=game(['pulse']),f=g.fighters[0],pos={x:450,y:L.center(f).y,life:10,lethal:false};const arrow=L.entity(g,f,'arrow',pos),weapon=L.entity(g,f,'weapon',{...pos,mode:'dropped',originalOwner:0}),held=L.entity(g,f,'weapon',{...pos,carrier:100}),zone=L.entity(g,f,'well',{...pos,zone:true}),summon=L.entity(g,f,'slime',{...pos,kind:'companion'});
 L.activate(g,f,'pulse');A(arrow.vx>0&&weapon.vx>0);for(const e of[held,zone,summon])A.equal(e.vx,0);A.equal(weapon.originalOwner,0);
});
test('Blink crosses a thin wall without tracing a damaging path, preserving momentum',()=>{
 const g=game(['blink']),f=g.fighters[0];g.map.walls=[{x:460,y:200,w:30,h:650}];f.vx=150;A(L.activate(g,f,'blink',{aim:0}));A.equal(f.x,630);A.equal(f.vx,150);A(!f.grounded);A.equal(f.platform,-1);A.equal(g.score[0],0);A(!L.activate(g,f,'blink',{aim:0}));
});
test('Blink cannot embed the body in a wall or slice through a platform at its destination',()=>{
 for(const mode of ['wall','platform','radius']){const g=game(['blink']),f=g.fighters[0],b=D.body(f);if(mode==='wall')g.map.walls=[{x:500,y:200,w:500,h:600}];if(mode==='platform')g.map.platforms.push({x:540,y:f.y-55,w:250,stage:'solid'});if(mode==='radius')g.map.walls=[{x:600,y:f.y-b.top-b.radius+2,w:120,h:5}];A(L.activate(g,f,'blink',{aim:0}));A(f.x<600,mode);A(L.free(g,f.x,f.y,f));}
});
test('Blink with no valid displacement does not spend the cooldown',()=>{
 const g=game(['blink']),f=g.fighters[0],b=D.body(f);g.map.walls=[{x:f.x+b.radius+.1,y:100,w:500,h:900}];A(!L.activate(g,f,'blink',{aim:0}));A.equal(f.x,400);A(!(f.legacy.cd.blink>0));
});
test('Well warns first and pulls bodies without dealing damage',()=>{
 const g=game(['well']),f=g.fighters[0],t=g.fighters[1];t.x=540;L.activate(g,f,'well',{aim:0});const x=t.x;L.worldStep(g,.1);A.equal(t.x,x);L.worldStep(g,.2);A(t.x>x);A(!t.dead);A.deepEqual(g.score,[0,0]);
});
test('Well cannot pull fighters through narrow walls or their supporting floor',()=>{
 for(const floor of [false,true]){const g=game(),f=g.fighters[0];g.fighters[1].x=1400;if(floor){f.y=900;f.grounded=true;f.platform=0;}else g.map.walls=[{x:430,y:100,w:8,h:800}];const e=L.entity(g,f,'well',{x:floor?f.x:500,y:floor?950:L.center(f).y,zone:true,r:250,life:3,warn:0,lethal:false});for(let n=0;n<50;n++)L.worldStep(g,.01);if(floor){A.equal(f.y,900);A(f.grounded);}else A(f.x+D.body(f).radius<=430+.01);A(!f.dead);}
});
test('Well respects an inverted supporting surface too',()=>{
 const g=game(['gravitycloak']),f=g.fighters[0];g.map.platforms.push({x:200,y:300,baseX:200,baseY:300,w:500,solid:true,stage:'solid'});f.legacy.effects.inverted=true;f.y=300+D.body(f).center*2;f.grounded=true;f.platform=1;
 L.entity(g,f,'well',{x:f.x,y:200,zone:true,r:250,life:3,warn:0,lethal:false});for(let n=0;n<30;n++)L.worldStep(g,.01);A.equal(f.y,300+D.body(f).center*2);A(f.grounded);
});
test('Well curves loose projectiles but does not accelerate attached objects or summons',()=>{
 const g=game(),f=g.fighters[0],pos={x:510,y:L.center(f).y,life:10,lethal:false};const held=L.entity(g,f,'weapon',{...pos,carrier:100}),zone=L.entity(g,f,'ice',{...pos,zone:true}),summon=L.entity(g,f,'dummy',{...pos,kind:'companion'});
 L.entity(g,f,'well',{x:600,y:pos.y,zone:true,r:200,life:3,lethal:false});const arrow=L.entity(g,f,'arrow',{...pos,vy:40});const control=new D.Game();control.loadSnapshot(L.clone(g.snapshot()));control.map=L.clone(g.map);L.world(control).entities=L.world(control).entities.filter(e=>e.type!=='well');L.worldStep(control,.01);L.worldStep(g,.01);A(arrow.vx>0);A.equal(held.vx,0);A.equal(zone.vx,0);A.equal(summon.vx,L.world(control).entities.find(e=>e.id===summon.id).vx);
});
test('a hostile well cannot bypass time stop or multiply overlapping slowdowns',()=>{
 const g=game(),f=g.fighters[0],t=g.fighters[1];t.x=550;L.entity(g,f,'well',{x:650,y:L.center(t).y,zone:true,r:200,life:3,lethal:false});L.effect(g,f,'timeStop',0,0,{life:2});const x=t.x;L.worldStep(g,.01);A.equal(t.x,x);L.world(g).effects=[];L.effect(g,f,'slowTime',0,0,{life:2,factor:.4});L.effect(g,t,'slowTime',0,0,{life:2,factor:.4});L.worldStep(g,.01);A(Math.abs(t.x-x-100*.01*.4*1.6)<1e-8);
});
test('force effects, target orientation and cooldowns resume from snapshots',()=>{
 const g=game(['well','pulse','blink']),f=g.fighters[0];L.activate(g,f,'well',{aim:0});L.activate(g,f,'pulse');L.activate(g,f,'blink',{aim:.2});for(let i=0;i<90;i++)g.step(1/240,[D.neutral(),D.neutral()]);const h=new D.Game();h.loadSnapshot(L.clone(g.snapshot()));h.map=L.clone(g.map);for(let i=0;i<180;i++){g.step(1/240,[D.neutral(),D.neutral()]);h.step(1/240,[D.neutral(),D.neutral()]);A.deepEqual(h.snapshot(),g.snapshot());}
});
console.log(count+' V8 force/spatial audit groups passed');
