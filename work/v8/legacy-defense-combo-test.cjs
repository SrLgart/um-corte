const A=require('node:assert/strict');require('./bootstrap.cjs');const D=DuelCore,L=DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(ids=[],other=[]){const g=new D.Game({mode:'local',ai:false,rules:{specials:true},random:L.rng(47)});g.start({legacies:[ids,other]});g.phase='playing';g.map.walls=[];g.map.platforms=[{x:0,y:700,baseX:0,baseY:700,w:g.map.width,stage:'solid',solid:true}];g.fighters.forEach((f,i)=>Object.assign(f,{x:500+i*100,y:700,state:'idle',grounded:true,aim:i?Math.PI:0}));return g;}
test('Pugilist and gauntlets use lunge without becoming disarmable physical blades',()=>{
 for(const gloves of [false,true]){const g=game(gloves?['lunge','knuckles']:['lunge']),f=g.fighters[0];f.kind='boxer';A(g.dash(0,1));A(g.attack(0));A.equal(L.attackTechnique(f)?.type,'lunge');g.setState(f,'active',.12);f.stateTime=.06;A(D.slash(f).points.length);A(!L.canDisarm(f));A(D.stats(f).reach<75);}
});
test('bare hands can perform the post-dash technique but a lost weapon cannot',()=>{
 for(const away of [false,true]){const g=game(['iaijutsu']),f=g.fighters[0];f.kind='boxer';f.legacy.effects.weaponAway=away;f.legacy.lastDashGround=true;f.legacy.groundDashEnds=g.time;g.attack(0);A.equal(L.attackTechnique(f)?.type==='iaijutsu',!away);}
});
test('Mikiri counters the actual fencing special but never the unstoppable lancer charge',()=>{
 for(const kind of ['duelist','lancer']){const g=game(['mikiri']),f=g.fighters[0],t=g.fighters[1];t.kind=kind;t.specialCharge=g.rules.specialCooldown;A(g.special(1));if(kind==='duelist'){A(g.attack(1));g.setState(t,'active',.12);t.stateTime=.06;}else g.setState(t,'ultCharge',99);t.attackAim=Math.PI;A(g.bodyContact(t,f)||kind==='lancer');A(g.dash(0,1));A.equal(t.state==='stunned',kind==='duelist');if(kind==='duelist')A.equal(t.fenceRemaining,0);}
});
test('normal Perfect Parry disarms the exact attacker and preserves weapon identity',()=>{
 const g=game(['disarm'],['leviathan']),t=g.fighters[1];A(g.attack(1));g.setState(t,'active',.13);t.stateTime=.065;A(g.parry(0));g.resolveCombat();const ev=g.events.find(e=>e.type==='parry');A.equal(ev.attacker,1);A.equal(ev.disarmEligible,true);A(t.legacy.effects.weaponAway);A.equal(L.world(g).entities.find(e=>e.type==='weapon').weapon,'leviathan');
});
test('parrying the fencing special does not discard an unrelated equipped legacy',()=>{
 const g=game(['disarm'],['leviathan']),t=g.fighters[1];t.kind='duelist';t.specialCharge=g.rules.specialCooldown;g.special(1);g.attack(1);g.setState(t,'active',.12);t.stateTime=.06;g.parry(0);g.resolveCombat();A.equal(t.state,'stunned');A(!t.legacy.effects.weaponAway);A(!L.world(g).entities.some(e=>e.type==='weapon'));A.equal(g.events.find(e=>e.type==='parry').disarmEligible,false);
});
test('Perfect Parry against a servant never remotely disarms its summoner',()=>{
 const g=game(['disarm'],['sword']),f=g.fighters[0],t=g.fighters[1];t.x=1100;const e=L.spawnServant(g,t,'duelist',600,700),a=L.summonActor(e,t);Object.assign(a,{state:'active',duration:.12,stateTime:.04,attackAim:Math.PI});e.due=100;e.grounded=true;g.parry(0);L.worldStep(g,.001);A(!f.dead);A.equal(a.state,'stunned');A(!t.legacy.effects.weaponAway);A(!L.world(g).entities.some(e=>e.type==='weapon'));
});
test('Eye reaction to a projectile cannot turn its parry into a remote disarm',()=>{
 const g=game(['destinyeye','disarm'],['sword']),f=g.fighters[0],t=g.fighters[1];t.x=1000;L.projectile(g,t,'arrow',Math.PI,{x:f.x+20,y:L.center(f).y,speed:100});L.worldStep(g,.001);A(f.legacy.pendingFatal);A.equal(f.legacy.pendingFatal.disarmEligible,false);f.aim=0;g.parry(0);f.legacy.effects.eye=0;L.beforeStep(g,[D.neutral(),D.neutral()],.001);A(!f.dead);A(!t.legacy.effects.weaponAway);
});
test('parry without a known attacker cannot disarm the nearest bystander',()=>{
 const g=game(['disarm'],['sword']);g.emit('parry',{id:0,perfect:true});A(!g.fighters[1].legacy.effects.weaponAway);
});
console.log(count+' V8 defense/source combination groups passed');
