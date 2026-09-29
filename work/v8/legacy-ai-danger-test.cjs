const A=require('node:assert/strict');require('./bootstrap.cjs');const D=DuelCore,L=DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(){const g=new D.Game({mode:'pve',ai:true,difficulty:'normal',rules:{specials:false},random:L.rng(191)});g.start({legacies:[[],['sword']]});g.phase='playing';g.map.walls=[];g.map.platforms=[{x:0,y:700,baseX:0,baseY:700,w:g.map.width,stage:'solid',solid:true}];g.fighters.forEach((f,i)=>Object.assign(f,{x:i?700:1150,y:700,grounded:true,platform:0,state:'idle',aim:i?0:Math.PI}));L.ai(g,1,.01);const b=g.fighters[1].brain;b.delay=b.decision=b.jump=10;b.abilityAt=100;b.bait=false;return g;}
function danger(g,{friendly=false,owner=0,x=760,y=680,type='blackfire',warn=.4,life=3,...rest}={}){return L.entity(g,g.fighters[owner],type,{x,y,zone:true,lethal:true,r:45,warn,life,friendly,...rest});}
function observe(g){g.time=.03;L.ai(g,1,.01);g.time=.03+g.fighters[1].brain.reaction+.001;return L.ai(g,1,.01);}
test('zone reactions wait for delayed observations and then avoid the telegraphed region',()=>{
 const g=game();danger(g);g.time=.03;let inp=L.ai(g,1,.01);A(!inp.jump);A.equal(inp.move,0);g.time=.03+g.fighters[1].brain.reaction+.15;inp=L.ai(g,1,.01);A(inp.jump||inp.move<=0);A(!inp.attack&&!inp.dash);
});
test('expired hazards and harmless allied zones do not provoke evasions',()=>{
 for(const mode of ['expired','allied']){const g=game();danger(g,mode==='expired'?{warn:0,life:.05}:{owner:1,warn:0});const inp=observe(g);A(!inp.jump,mode);A.equal(inp.move,1,mode);}
});
test('friendly fire zones and beam capsules are recognized instead of parried blindly',()=>{
 for(const beam of [false,true]){const g=game();danger(g,beam?{type:'beam',x:720,y:550,r:12,to:{x:720,y:730},warn:0}:{owner:1,friendly:true,warn:0});const inp=observe(g);A(inp.jump||inp.move<=0);A(!inp.dash);}
});
test('a bot routes to its dropped weapon even when its enemy is in the opposite direction',()=>{
 const g=game(),f=g.fighters[1];f.legacy.effects.weaponAway=true;const e=L.entity(g,f,'weapon',{x:450,y:697,originalOwner:1,weapon:'sword',mode:'dropped',lethal:true,life:120,age:1});const inp=observe(g);A(inp.move<0);A(!inp.attack);A.equal(f.brain.recoverWeapon,e.id);for(let i=0;i<600&&f.legacy.effects.weaponAway;i++)g.step(1/240,[D.neutral()]);A(!f.legacy.effects.weaponAway);A(!L.world(g).entities.includes(e));
});
test('retrieval cannot override ledge safety and run off an unsupported edge',()=>{
 const g=game(),f=g.fighters[1];g.map.platforms=[{x:620,y:700,baseX:620,baseY:700,w:105,stage:'solid'}];f.legacy.effects.weaponAway=true;L.entity(g,f,'weapon',{x:1100,y:600,originalOwner:1,weapon:'sword',mode:'dropped',life:120});const inp=observe(g);A(!inp.dash);A(inp.jump||inp.move<=0);
});
test('zone observation and avoidance survive restoration with the same RNG and commands',()=>{
 const g=game();danger(g);for(let i=0;i<30;i++)g.step(1/240,[D.neutral()]);const h=new D.Game();h.loadSnapshot(g.snapshot());h.map=L.clone(g.map);for(let i=0;i<180;i++){g.step(1/240,[D.neutral()]);h.step(1/240,[D.neutral()]);A.deepEqual(h.snapshot(),g.snapshot());}
});
console.log(count+' V8 AI danger/retrieval groups passed');
