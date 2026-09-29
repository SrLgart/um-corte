const A=require('node:assert/strict');require('./bootstrap.cjs');const D=global.DuelCore,L=global.DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(items=[]){const g=new D.Game({mode:'local',ai:false,random:L.rng(77),rules:{specials:false}});g.start({legacies:[items,[]]});g.phase='playing';g.map.walls=[];g.map.platforms=[{x:0,y:700,w:2400,stage:'solid'}];g.fighters.forEach((f,i)=>Object.assign(f,{x:300+i*900,y:700,state:'idle',grounded:true}));return g;}
function advance(g,seconds){for(let i=0;i<Math.round(seconds*600);i++){g.time+=1/600;L.worldStep(g,1/600);}}
function pair(g){const f=g.fighters[0];g.map.walls=[{x:500,y:200,w:40,h:500}];A(L.activate(g,f,'portals',{aim:0}));f.legacy.cd.portals=0;f.x=900;A(L.activate(g,f,'portals',{aim:Math.PI/2}));advance(g,.12);Object.assign(f,{x:300,y:700,portalUntil:0,vx:0,vy:0});return L.world(g).entities.filter(e=>e.type==='portal');}
test('repulsor only hits the aimed lane, respects walls and gives opposite recoil',()=>{
 for(const mode of ['front','behind','above','wall']){const g=game(['repulsor']),f=g.fighters[0],t=g.fighters[1];t.x=f.x+(mode==='behind'?-150:150);t.y=f.y+(mode==='above'?-150:0);if(mode==='wall')g.map.walls=[{x:370,y:300,w:25,h:400}];A(L.activate(g,f,'repulsor',{aim:0}));A.equal(f.vx,-650);advance(g,.01);if(mode==='front'){A(t.vx>750);A.equal(t.state,'pushed');}else A.equal(t.vx,0,mode);A(!t.dead);}
});
test('repulsor downward shot launches its owner upward even without a target',()=>{const g=game(['repulsor']),f=g.fighters[0];A(L.activate(g,f,'repulsor',{aim:Math.PI/2}));A(f.vy<-640);A(!f.grounded);});
test('portal aligns to wall/floor normals and transfers momentum and active dash',()=>{
 const g=game(['portals']),f=g.fighters[0],[entry,exit]=pair(g);A.equal(entry.nx,-1);A.equal(exit.ny,-1);Object.assign(f,{x:480,y:entry.y+D.body(f).center,vx:500,vy:70,dashRemaining:.1,dashX:1,dashY:0});advance(g,.002);A(Math.abs(f.x-900)<1);A(f.y<700);A(Math.abs(Math.hypot(f.vx,f.vy)-Math.hypot(500,70))<1e-6);A(f.vy<-490);A(f.dashY<-.99);const pos=[f.x,f.y];advance(g,.1);A.deepEqual([f.x,f.y],pos);A(L.free(g,f.x,f.y,f));
});
test('floor portal accepts actual feet contact and releases above destination',()=>{
 const g=game(['portals']),f=g.fighters[0],[entry,exit]=pair(g);f.x=exit.x;f.y=700;f.vx=0;f.vy=300;f.portalUntil=0;advance(g,.002);A(f.x<entry.x);A(f.vx<-290);A(L.free(g,f.x,f.y,f));
});
test('blocked portal exits cannot embed actors or physical objects',()=>{
 const g=game(['portals']),f=g.fighters[0],[entry,exit]=pair(g);g.map.walls.push({x:exit.x-70,y:exit.y-180,w:140,h:180});f.x=480;f.y=entry.y+D.body(f).center;f.vx=500;const p=L.projectile(g,f,'arrow',0,{x:490,y:entry.y,speed:100,life:3});advance(g,.002);A(f.x<600);A(p.x<600);A(!f.portalUntil);
});
test('projectiles and thrown weapons use portals without ownership changes or loops',()=>{
 const g=game(['portals']),f=g.fighters[0],[entry]=pair(g);const arrow=L.projectile(g,f,'arrow',0,{x:490,y:entry.y,speed:400,life:3}),weapon=L.entity(g,g.fighters[1],'weapon',{x:490,y:entry.y,originalOwner:1,mode:'flying',vx:400,vy:0,r:8,life:3});advance(g,.002);for(const p of [arrow,weapon]){A(p.x>800);A(p.vy<-390);A(p.portalUntil>g.time);}A.equal(weapon.originalOwner,1);A.equal(weapon.owner,1);A.equal(arrow.owner,0);advance(g,.1);A(arrow.x>800);
});
test('portal follows a moving platform and closes when its support collapses',()=>{
 const g=game(['portals']),[,exit]=pair(g);g.map.platforms[0].x+=50;g.map.platforms[0].y-=20;advance(g,.002);A.equal(exit.x,950);A.equal(exit.y,680);g.map.platforms[0].stage='gone';advance(g,.002);A(!L.world(g).entities.includes(exit));
});
test('portal rejects tiny surfaces and overlapping placements without spending charge',()=>{
 const g=game(['portals']),f=g.fighters[0];g.map.walls=[{x:450,y:630,w:20,h:30}];A(!L.activate(g,f,'portals',{aim:0}));A(!f.legacy.cd.portals);g.map.walls=[{x:450,y:300,w:20,h:400}];A(L.activate(g,f,'portals',{aim:0}));f.legacy.cd.portals=0;A(!L.activate(g,f,'portals',{aim:0}));A.equal(f.legacy.cd.portals,0);
});
test('The Hand sweeps ahead after warning, preserving scenery, stationary zones and ownership',()=>{
 const g=game(['thehand']),f=g.fighters[0],t=g.fighters[1];t.x=480;const zone=L.entity(g,f,'portal',{x:450,y:L.center(f).y,zone:true,lethal:false,life:4}),weapon=L.entity(g,t,'weapon',{x:490,y:L.center(f).y,mode:'flying',vx:0,vy:0,originalOwner:1,life:4});A(L.activate(g,f,'thehand',{aim:0}));advance(g,.1);A.equal(t.x,480);advance(g,.04);A(t.x<400);A(weapon.x<400);A.equal(weapon.originalOwner,1);A.equal(zone.x,450);A.equal(g.map.platforms[0].w,2400);A(!t.dead);
});
test('The Hand cannot grab behind the user or through scene walls',()=>{
 for(const wall of [false,true]){const g=game(['thehand']),f=g.fighters[0],t=g.fighters[1];t.x=wall?480:140;if(wall)g.map.walls=[{x:370,y:200,w:25,h:500}];const x=t.x;A(L.activate(g,f,'thehand',{aim:0}));advance(g,.2);A.equal(t.x,x);}
});
test('Domain cuts cover multiple fixed warned regions inside its original boundary',()=>{
 const g=game(['domain']),f=g.fighters[0],t=g.fighters[1];t.x=450;A(L.activate(g,f,'domain'));const center=L.clone(f.legacy.domainCenter);L.beforeStep(g,[D.neutral(),D.neutral()],.11);const cuts=L.world(g).entities.filter(e=>e.type==='domaincut');A.equal(cuts.length,2);A(cuts.every(e=>e.warn>=.4&&Math.hypot(e.x-center.x,e.y-center.y)<=365.001));const target=cuts[0];t.x+=170;f.x+=650;advance(g,.49);A(!t.dead);A.equal(target.x,450);f.legacy.effects.domainPulse=0;L.beforeStep(g,[D.neutral(),D.neutral()],.01);A(L.world(g).entities.filter(e=>e.type==='domaincut').every(e=>Math.hypot(e.x-center.x,e.y-center.y)<=365.001));
});
test('spatial powers restore deterministically through the full shared simulation',()=>{
 for(const power of ['portals','repulsor','thehand','domain']){const g=new D.Game({mode:'local',ai:false,random:L.rng(777),rules:{specials:false}});g.start({legacies:[[power],[]]});g.phase='playing';const f=g.fighters[0],t=g.fighters[1];t.x=f.x+170;t.y=f.y;A(L.activate(g,f,power,{aim:power==='portals'?Math.PI/2:0}));if(power==='portals'){f.x+=220;f.legacy.cd.portals=0;A(L.activate(g,f,power,{aim:Math.PI/2}));}for(let i=0;i<15;i++)g.step(1/600,[D.neutral(),D.neutral()]);const h=new D.Game();A(h.loadSnapshot(g.snapshot()));for(let i=0;i<650;i++){g.step(1/600,[D.neutral(),D.neutral()]);h.step(1/600,[D.neutral(),D.neutral()]);}A.deepEqual(h.snapshot(),g.snapshot(),power);}
});
console.log(count+' V8 spatial powers groups passed');
