const A=require('node:assert/strict');require('./bootstrap.cjs');const D=global.DuelCore,L=global.DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(ids=[],dist=300){const g=new D.Game({mode:'pve',ai:true,difficulty:'hard',random:L.rng(23),rules:{specials:false}});g.start({legacies:[[],ids]});g.phase='playing';g.map.walls=[];g.map.platforms=[{x:0,y:700,baseX:0,baseY:700,w:g.map.width,stage:'solid',solid:true}];g.fighters.forEach((f,i)=>Object.assign(f,{x:900+(i?0:-dist),y:700,grounded:true,platform:0,state:'idle',aim:i?Math.PI:0}));L.ai(g,1,.01);g.time=.5;return g;}
test('AI chooses sustained ranged preparation for all three charge weapons',()=>{
 for(const w of ['yamato','ruyi','leviathan']){const g=game([w]),f=g.fighters[1];const inp=L.ai(g,1,.01);A(inp.attack&&inp.attackHeld,w);A(!inp.dash,w);L.command(g,f,inp,.01);A.equal(f.legacy.weaponHold.weapon,w);let used=false;for(let i=0;i<60;i++){g.time+=.01;const c=L.ai(g,1,.01);L.command(g,f,c,.01);if(L.world(g).entities.some(e=>['spatialcut','beam','weapon'].includes(e.type)))used=true;}A(used,w);}
});
test('AI uses a tap for nearby charge-weapon attacks and cancels a hold to defend',()=>{
 const g=game(['yamato'],100),f=g.fighters[1];g.random=()=>0;f.brain.delay=0;let inp=L.ai(g,1,.01);A(inp.attack);A(!inp.attackHeld);L.command(g,f,inp,.01);A.equal(f.state,'startup');g.setState(f,'idle');f.legacy.weaponHold={weapon:'yamato',age:.2,aim:Math.PI};f.brain.observations=[{at:0,x:f.x-100,y:f.y,vx:0,vy:0,state:'active',grounded:true,platform:0,reach:200,attackId:9,shots:[]}];f.brain.parryRoll=0;inp=L.ai(g,1,.01);A(inp.parry||inp.dash);L.command(g,f,inp,.01);A(!f.legacy.weaponHold);A(!L.world(g).entities.some(e=>e.type==='spatialcut'));
});
test('AI Kamehameha activation has no competing dash or attack and holds until release',()=>{
 const g=game(['kamehameha'],450),f=g.fighters[1];g.random=()=>0;let inp=L.ai(g,1,.01);A(inp.legado.includes('kamehameha'));A(!inp.dash&&!inp.attack&&!inp.jump);L.command(g,f,inp,.01);A(f.legacy.channel);for(let i=0;i<220;i++){g.time+=.01;inp=L.ai(g,1,.01);L.command(g,f,inp,.01);}A(!f.legacy.channel);A(L.world(g).entities.some(e=>e.type==='beam'&&!e.parryable));
});
test('AI cannot start a distant charge through a wall',()=>{
 const g=game(['yamato']),f=g.fighters[1];g.map.walls=[{x:750,y:300,w:30,h:400}];const inp=L.ai(g,1,.01);A(!(inp.attack&&inp.attackHeld));A(!f.brain.holdGoal);
});
test('AI recalls Leviathan and does not try ordinary fatal attacks while its weapon is away',()=>{
 const g=game(['leviathan'],250),f=g.fighters[1];A(L.throwWeapon(g,f));const inp=L.ai(g,1,.01);A(inp.attack);L.command(g,f,inp,.01);A.equal(L.world(g).entities[0].mode,'return');A(!inp.attack);A.equal(f.state,'idle');
});
test('charge intention and AI decisions restore deterministically mid-preparation',()=>{
 const g=game(['ruyi']),f=g.fighters[1];for(let i=0;i<12;i++)g.step(1/240,[D.neutral()]);A(f.legacy.weaponHold);const h=new D.Game();h.loadSnapshot(g.snapshot());h.map=L.clone(g.map);for(let i=0;i<240;i++){g.step(1/240,[D.neutral()]);h.step(1/240,[D.neutral()]);A.deepEqual(h.snapshot(),g.snapshot());}
});
test('AI holds the yo-yo after deployment and uses the gunblade trigger once',()=>{
 const g=game(['yoyo'],180),f=g.fighters[1];L.projectile(g,f,'yoyo',Math.PI,{life:1.5});f.legacy.cd.weapon=.7;A(L.ai(g,1,.01).attackHeld);const h=game(['gunblade'],120),t=h.fighters[1];h.setState(t,'active',.12);t.stateTime=.03;const c=L.ai(h,1,.01);A(c.attack);L.command(h,t,c,.01);A(t.legacy.triggered);A.equal(L.world(h).entities.filter(e=>e.type==='trigger').length,1);L.command(h,t,L.ai(h,1,.01),.01);A.equal(L.world(h).entities.filter(e=>e.type==='trigger').length,1);
});
test('gravity cloak AI refuses an empty ceiling and can choose contextual ice',()=>{
 const g=game(['gravitycloak']),f=g.fighters[1];g.random=()=>0;g.fighters[0].y=400;f.brain.observations=[];g.time=0;L.ai(g,1,.01);g.time=.5;A(!L.ai(g,1,.01).legado.includes('gravitycloak'));const h=game(['ice'],220);h.random=()=>0;A(L.ai(h,1,.01).legado.includes('ice'));
});
console.log(count+' V8 AI held-intention groups passed');
