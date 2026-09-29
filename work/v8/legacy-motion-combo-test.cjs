const A=require('node:assert/strict');require('./bootstrap.cjs');const D=global.DuelCore,L=global.DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(ids=[]){const g=new D.Game({mode:'local',ai:false,rules:{specials:false},random:L.rng(55)});g.start({legacies:[ids,[]]});g.phase='playing';g.map.walls=[];g.map.platforms=[{x:0,y:700,baseX:0,baseY:700,w:g.map.width,stage:'solid',solid:true}];g.fighters.forEach((f,i)=>Object.assign(f,{x:300+i*900,y:700,grounded:true,state:'idle',aim:0}));return g;}
test('tap released in the final dash recovery is buffered with its original aim',()=>{
 const g=game(['yamato']),f=g.fighters[0];g.setState(f,'dashRecovery',.05);f.legacy.weaponHold={weapon:'yamato',age:.05,aim:Math.PI};const inp={...D.neutral(),attackHeld:false,aim:0};L.command(g,f,inp,.01);A.equal(f.queued?.action,'attack');A.equal(f.queued?.aim,Math.PI);for(let i=0;i<14;i++)g.step(1/240,[D.neutral(),D.neutral()]);A.equal(f.state,'startup');A.equal(f.attackAim,Math.PI);
});
test('portal rotates a committed cut, and the next movement step preserves the new direction',()=>{
 for(const type of ['lunge','iaijutsu']){const g=game(['portals',type]),f=g.fighters[0];g.map.walls=[{x:500,y:200,w:40,h:500}];L.activate(g,f,'portals',{aim:0});f.legacy.cd.portals=0;f.x=900;L.activate(g,f,'portals',{aim:Math.PI/2});for(let i=0;i<80;i++){g.time+=1/600;L.worldStep(g,1/600);}const entry=L.world(g).entities.find(e=>e.type==='portal'&&e.surface==='wall');Object.assign(f,{x:480,y:entry.y+D.body(f).center,vx:900,vy:0,portalUntil:0,attackAim:0,attackId:1,grounded:true});g.setState(f,'active',.14);f.legacy.technique={type,attack:1,angle:0,distance:150,from:L.center(f)};L.worldStep(g,.001);A(Math.abs(Math.sin(f.attackAim)+1)<1e-8);const y=f.y,x=f.x;g.moveFighter(f,D.neutral(),.005);A(f.y<y);A(Math.abs(f.x-x)<.01);A.equal(L.attackTechnique(f).type,type);}
});
test('time stop freezes held weapon and beam charge; slow time scales both identically',()=>{
 for(const power of ['timeStop','slowTime']){const g=game(['yamato','kamehameha']),f=g.fighters[0],t=g.fighters[1];f.legacy.weaponHold={weapon:'yamato',age:0,aim:0};L.effect(g,t,power,t.x,t.y,{life:2,factor:.25});for(let i=0;i<60;i++)g.step(1/600,[{...D.neutral(),attackHeld:true},D.neutral()]);const age=f.legacy.weaponHold.age;A(Math.abs(age-(power==='timeStop'?0:.025))<1e-8);f.legacy.weaponHold=null;f.legacy.channel={id:'kamehameha',age:0,aim:0};for(let i=0;i<60;i++)g.step(1/600,[{...D.neutral(),legadoHeld:['kamehameha']},D.neutral()]);A(Math.abs(f.legacy.channel.age-age)<1e-8);}
});
test('portal cut snapshots and remaining commitment survive save/replay restoration',()=>{
 const g=game(['lunge','echo']),f=g.fighters[0];g.dash(0,1);g.attack(0);for(let i=0;i<12;i++)g.step(1/240,[D.neutral(),D.neutral()]);const h=new D.Game();h.loadSnapshot(g.snapshot());h.map=L.clone(g.map);for(let i=0;i<240;i++){g.step(1/240,[D.neutral(),D.neutral()]);h.step(1/240,[D.neutral(),D.neutral()]);A.deepEqual(h.snapshot(),g.snapshot());}
});
console.log(count+' V8 motion/time combination groups passed');
