const A=require('node:assert/strict');require('./bootstrap.cjs');const D=global.DuelCore,L=global.DuelLegacy,P=global.DuelPath;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(difficulty='normal'){const g=new D.Game({mode:'pve',difficulty,seed:72,random:L.rng(72)});g.start({legacies:[[],[]]});g.phase='playing';return g;}
test('classic modes retain the V7.2 AI when Legados are disabled',()=>{const g=new D.Game({mode:'pve',difficulty:'adaptive'});g.start();A.equal(L.ai(g,1,1/600),null);});
test('projectile response waits for observation delay and rolls only once per threat',()=>{
 const g=game(),[p,f]=g.fighters;p.x=f.x-500;g.time=0;L.ai(g,1,1/600);f.brain.abilityAt=999;f.brain.seenAttack=p.attackId;f.brain.delay=f.brain.decision=100;const reaction=f.brain.reaction;
 L.projectile(g,p,'fireball',0,{x:f.x-180,y:f.y-65,speed:500});g.time=.03;A(!L.ai(g,1,1/600).parry);
 g.time=.03+reaction+.001;let rolls=0;g.random=()=>{rolls++;return .01;};A(L.ai(g,1,1/600).parry);
 for(let i=0;i<45;i++){g.time+=1/600;L.ai(g,1,1/600);}A.equal(rolls,1);
});
test('allies in a group are never interpreted as hostile projectile threats',()=>{
 const r=new P.Run({seed:7});r.level=36;const g=r.game();g.phase='playing';const f=g.fighters[1];L.projectile(g,g.fighters[2],'arrow',0,{x:f.x-30,y:f.y-65});L.ai(g,1,.01);A.equal(f.brain.observations[0].shots.length,0);
});
test('adaptive legacy AI still responds to the player habits policy',()=>{
 const g=game('adaptive');let calls=0;const policy=g.getAIPolicy.bind(g);g.getAIPolicy=()=>{calls++;return policy();};const base=g.getAIPolicy();g.habits.attacks=50;g.habits.whiffs=30;g.habits.retreat=100;const learned=g.getAIPolicy();A(learned.parry>base.parry);A(learned.attack>base.attack);L.ai(g,1,.01);A.equal(calls,3);
});
test('a falling bot steers toward a safe landing instead of blindly pursuing',()=>{
 const g=game('hard'),[p,f]=g.fighters;g.map.platforms=[{x:100,y:600,w:350,stage:'solid'}];g.map.walls=[];p.x=950;p.y=450;p.platform=-1;p.grounded=false;f.x=510;f.y=500;f.vy=200;f.grounded=false;L.ai(g,1,.01);g.time=.4;const inp=L.ai(g,1,.01);A.equal(inp.move,-1);
});
test('each fixed boss build and three-enemy encounter can simulate and resume deterministically',()=>{
 for(const boss of P.BOSSES){const r=new P.Run({seed:24});r.level=boss.levels[0];r.bosses[r.level]=boss.id;r.encounter=null;const g=r.game();g.phase='playing';g.adminOptions[0].invincible=true;g.fighters[0].admin={...g.adminOptions[0]};for(let i=0;i<900;i++)g.step(1/600,g.fighters.map(()=>D.neutral()));const h=new D.Game();A(h.loadSnapshot(g.snapshot()));for(let i=0;i<120;i++){g.step(1/600,g.fighters.map(()=>D.neutral()));h.step(1/600,h.fighters.map(()=>D.neutral()));}A.deepEqual(L.clone(h.fighters),L.clone(g.fighters),boss.id);A.deepEqual(h.legacyWorld,g.legacyWorld,boss.id);for(const f of g.fighters)A(Number.isFinite(f.x)&&Number.isFinite(f.y),boss.id);}
 const r=new P.Run({seed:37});r.level=36;const g=r.game();g.phase='playing';for(let i=0;i<1200;i++)g.step(1/600,g.fighters.map(()=>D.neutral()));A.equal(g.fighters.length,4);for(const f of g.fighters)A(Number.isFinite(f.x)&&Number.isFinite(f.y));
});
console.log(count+' V8 AI groups passed');
