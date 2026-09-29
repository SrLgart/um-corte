const A=require('node:assert/strict');require('./bootstrap.cjs');const D=global.DuelCore,L=global.DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(items=[]){const g=new D.Game({mode:'local',ai:false,seed:19,random:L.rng(19),rules:{specials:false}});g.start({legacies:[items,[]]});g.phase='playing';g.map.platforms=[{x:0,y:700,w:2400,baseX:0,baseY:700,stage:'solid',solid:true}];g.map.walls=[];g.fighters.forEach((f,i)=>{f.x=200+i*1400;f.y=700;f.grounded=true;f.aim=i?Math.PI:0;});g.legacyWorld={entities:[],effects:[],serial:0,time:0};g.fighters.forEach(f=>L.spawnCompanions(g,f));return g;}
function advance(g,t){for(let i=0;i<Math.ceil(t*600);i++){g.time+=1/600;L.worldStep(g,1/600);}}
function servant(kind){const g=game(),e=L.spawnServant(g,g.fighters[0],kind,500,700),a=L.summonActor(e,g.fighters[0]);e.grounded=true;e.due=0;return{g,e,a};}
test('servants retain startup, active, recovery and weapon contour of each of eight classes',()=>{
 for(const kind of Object.keys(D.CLASSES)){const{g,e,a}=servant(kind),t=g.fighters[1],s=D.stats(a);t.x=500+s.reach*.8;advance(g,.002);A.equal(a.state,'startup',kind);A.equal(a.duration,s.startup/g.rules.attackSpeed,kind);advance(g,a.duration+.002);A.equal(a.state,'active',kind);A(e.points.length>0,kind);A(t.dead,kind+' clean slash');A(!g.fighters[0].dead);t.dead=false;t.x=1800;advance(g,s.active/g.rules.attackSpeed+.005);A.equal(a.state,'recovery',kind);A.equal(a.duration,s.recovery/g.rules.attackSpeed*g.rules.attackRecovery,kind);}
});
test('servant parry stuns the servant and does not stun its owner',()=>{
 const{g,e,a}=servant('duelist'),t=g.fighters[1];t.x=600;t.aim=Math.PI;A(g.parry(1));advance(g,.3);A(!t.dead);A.equal(a.state,'stunned');A.equal(g.fighters[0].state,'idle');A(e.life>e.age);
});
test('servants clash with a real slash before body damage',()=>{
 const{g,e,a}=servant('knight'),t=g.fighters[1];t.x=650;t.attackAim=Math.PI;Object.assign(t,{state:'active',stateTime:.05,duration:.1});Object.assign(a,{state:'active',stateTime:.05,duration:.1,attackAim:0});e.due=100;advance(g,.002);A.equal(a.state,'clash');A.equal(t.state,'clash');A(!t.dead);A(e.life>e.age);
});
test('one slash kills a servant, clears its memory, and never grants a round point',()=>{
 const{g,e}=servant('lancer'),t=g.fighters[1];t.x=620;g.fighters[0].legacy.servantKind='lancer';Object.assign(t,{state:'active',stateTime:.05,duration:.1,attackAim:Math.PI});advance(g,.002);A(!L.world(g).entities.includes(e));A(!g.fighters[0].legacy.servantKind);A.deepEqual(g.score,[0,0]);A.equal(g.phase,'playing');
});
test('necromancer servant survives between rounds but not between matches',()=>{
 const g=game(['necromancer']),f=g.fighters[0];f.legacy.servantKind='staff';L.spawnCompanions(g,f);A(L.world(g).entities.some(e=>e.type==='servant'));g.resetFighters(true);A.equal(g.fighters[0].legacy.servantKind,'staff');A.equal(L.world(g).entities.filter(e=>e.type==='servant').length,1);g.start();A(!g.fighters[0].legacy.servantKind);A(!L.world(g).entities.some(e=>e.type==='servant'));
});
test('Mahoraga learns distinct threats progressively, not each simulation frame',()=>{
 const g=game(['mahoraga']),e=L.world(g).entities[0],t=g.fighters[1];Object.assign(e,{x:500,y:671,due:100,grounded:true});t.x=800;t.state='startup';t.attackId=1;advance(g,.2);let m=g.fighters[0].legacy.summonMemory.mahoraga;A.equal(m.counts.front,1);A(!m.learned.front);t.attackId=2;advance(g,.002);A(m.learned.front);A(e.flankUntil>g.time);A(e.vy<0);A(e.wheelPulse>0);
 t.state='idle';t.grounded=false;t.y=300;advance(g,2);A(m.learned.air);g.resetFighters(true);A(g.fighters[0].legacy.summonMemory.mahoraga.learned.front);g.start();A(!g.fighters[0].legacy.summonMemory.mahoraga);
});
test('adapted Mahoraga can deflect a projectile, but another during cooldown kills it',()=>{
 const g=game(['mahoraga']),e=L.world(g).entities[0],f=g.fighters[0],t=g.fighters[1];Object.assign(e,{x:500,y:671,due:100,grounded:true});t.x=900;advance(g,.002);const m=f.legacy.summonMemory.mahoraga;
 for(let i=0;i<2;i++){const p=L.projectile(g,t,'arrow',Math.PI,{x:800,y:630,speed:300,life:2});advance(g,.01);p.life=0;}A(m.learned.ranged);
 let p=L.projectile(g,t,'arrow',Math.PI,{x:e.x+e.r+5,y:e.y,speed:600,r:6,life:2});advance(g,.01);A(e.life>e.age);A(p.life===0);A(e.deflectUntil>g.time);
 p=L.projectile(g,t,'arrow',Math.PI,{x:e.x+e.r+5,y:e.y,speed:600,r:6,life:2});advance(g,.01);A(!L.world(g).entities.includes(e));A(!f.dead);A.deepEqual(g.score,[0,0]);
});
test('companion combat and adaptation resume deterministically after a snapshot',()=>{
 const g=game(['mahoraga','necromancer']);g.fighters[0].legacy.servantKind='assassin';L.spawnCompanions(g,g.fighters[0]);advance(g,.5);const h=new D.Game();A(h.loadSnapshot(g.snapshot()));h.map=L.clone(g.map);advance(g,.5);advance(h,.5);A.deepEqual(g.legacyWorld,h.legacyWorld);A.deepEqual(g.fighters.map(f=>f.legacy),h.fighters.map(f=>f.legacy));
});
console.log(count+' V8 companion moveset/adaptation groups passed');
