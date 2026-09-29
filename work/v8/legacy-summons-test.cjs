const A=require('node:assert/strict');require('./bootstrap.cjs');const D=global.DuelCore,L=global.DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(ids,other=[]){const g=new D.Game({mode:'local',ai:false,seed:38,random:L.rng(38),rules:{specials:false}});g.start({legacies:[ids,other]});g.phase='playing';g.map.platforms=[{x:0,y:700,w:1800,baseX:0,baseY:700,stage:'solid',solid:true}];g.map.walls=[];g.fighters.forEach((f,i)=>{f.x=300+i*700;f.y=700;f.grounded=true;f.aim=i?Math.PI:0;});g.legacyWorld={entities:[],effects:[],serial:0,time:0};g.fighters.forEach(f=>L.spawnCompanions(g,f));return g;}
function advance(g,t){for(let i=0;i<Math.ceil(t*600);i++){g.time+=1/600;L.worldStep(g,1/600);}}
test('support companions never turn into lethal attackers',()=>{
 const g=game(['beetle','fairy','lantern']),target=g.fighters[1];target.x=330;advance(g,8);A(!target.dead);A.equal(target.state,'idle');for(const e of L.world(g).entities){A.equal(e.attack,0);A.equal(e.lethal,false);}
});
test('terrestrial companions settle on the floor instead of hovering after their owner',()=>{
 for(const id of ['slime','hound','monkey','toad','skeleton','mimic','mahoraga','slimeking','legion']){const g=game([id]);for(const e of L.world(g).entities)e.due=100;advance(g,1);for(const e of L.world(g).entities){A(e.grounded,id);A(Math.abs(e.y+e.r-700)<.01,id);}}
});
test('ground pursuit cannot walk through a tall wall',()=>{
 const g=game(['hound']);g.map.walls=[{x:600,y:0,w:50,h:700}];advance(g,7);const e=L.world(g).entities.find(e=>e.type==='hound');A(e);A(e.x+e.r<=600.01);A(!g.fighters[1].dead);
});
test('Falcon telegraphs its dive, survives parry and must return before another command',()=>{
 const g=game(['falcon']),[f,t]=g.fighters,e=L.world(g).entities[0];e.x=f.x-55;e.y=f.y-D.body(f).center-85;t.x=e.x+100;t.y=e.y+D.body(t).center;t.aim=Math.PI;f.aim=0;A(g.parry(1));A(L.activate(g,f,'falcon'));const x=e.x;advance(g,.2);A.equal(e.x,x);advance(g,.3);A(!t.dead);A.equal(e.phase,'return');A(e.life>e.age);f.legacy.cd.falcon=0;A(!L.activate(g,f,'falcon'));advance(g,2);A.equal(e.phase,'follow');
});
test('a nonlethal hound bite returns home and does not repeatedly shove',()=>{
 const g=game(['hound']),[f,t]=g.fighters,e=L.world(g).entities[0];t.x=430;e.x=400;e.y=685;e.due=0;advance(g,.45);A(!t.dead);A.equal(e.phase,'return');A.equal(e.hits.length,1);const vx=t.vx;advance(g,.2);A.equal(t.vx,vx);
});
test('monkey transports a dropped enemy weapon without changing inventory ownership',()=>{
 const g=game(['monkey'],['sword','weaponmaster']),[owner,enemy]=g.fighters,e=L.world(g).entities[0];A(L.throwWeapon(g,enemy));const weapon=L.world(g).entities.find(e=>e.type==='weapon');Object.assign(weapon,{x:450,y:680,vx:0,vy:0,mode:'dropped'});e.x=450;e.y=680;advance(g,.05);A.equal(weapon.carrier,e.id);advance(g,1.5);A.equal(weapon.originalOwner,enemy.id);A(!L.has(owner,'sword'));A(L.has(enemy,'sword'));A(enemy.legacy.effects.weaponAway);A(Math.abs(weapon.x-owner.x)<100);
});
test('striking a monkey releases the carried weapon physically',()=>{
 const g=game(['monkey'],['sword']),[owner,enemy]=g.fighters,e=L.world(g).entities[0];const weapon=L.entity(g,enemy,'weapon',{x:500,y:650,mode:'dropped',originalOwner:1,weapon:'sword',carrier:e.id,life:120});e.carry=weapon.id;enemy.x=600;enemy.y=700;g.setState(enemy,'active',D.stats(enemy).active);enemy.attackAim=Math.PI;enemy.stateTime=enemy.duration*.5;const points=D.slash(enemy,[]).points;e.x=points.reduce((n,p)=>n+p.x,0)/points.length;e.y=points.reduce((n,p)=>n+p.y,0)/points.length;advance(g,.002);A(!L.world(g).entities.includes(e));A.equal(weapon.carrier,null);A.equal(weapon.mode,'dropped');A.equal(weapon.originalOwner,1);
});
test('physical summon state resumes deterministically from snapshots',()=>{
 const g=game(['hound','monkey','beetle']),e=L.world(g).entities.find(e=>e.type==='hound');advance(g,.6);const h=new D.Game();A(h.loadSnapshot(g.snapshot()));h.map=L.clone(g.map);advance(g,.7);advance(h,.7);A.deepEqual(h.legacyWorld,g.legacyWorld);
});
console.log(count+' V8 summon groups passed');
