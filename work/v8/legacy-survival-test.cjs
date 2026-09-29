const A=require('node:assert/strict');require('./bootstrap.cjs');
const D=global.DuelCore,L=global.DuelLegacy,Path=global.DuelPath;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(ids){const g=new D.Game({mode:'local',ai:false,seed:83,random:L.rng(83),rules:{specials:false}});g.start({legacies:[ids,[]]});g.phase='playing';g.fighters.forEach((f,i)=>{f.x=400+i*70;f.y=600;f.grounded=false;f.aim=i?Math.PI:0;});L.captureRound(g);return g;}
function hit(g){const [d,a]=g.fighters;g.setState(a,'active',D.stats(a).active);a.attackAim=Math.PI;a.stateTime=a.duration*.5;A(g.bodyContact(a,d),'fixture strike must physically touch');return g.lethal(a,d,'test');}
function tick(g,dt=.23){L.beforeStep(g,g.fighters.map(()=>D.neutral()),dt);}
test('Eye slows hostile fighters and requires a real response',()=>{
 const g=game(['destinyeye']);A(!hit(g));A.equal(L.timeScale(g,g.fighters[0]),1);A.equal(L.timeScale(g,g.fighters[1]),.05);tick(g);A(g.fighters[0].dead);
});
test('Eye rejects a parry facing away and a dash without actual escape',()=>{
 for(const response of ['wrongGuard','fakeDash']){const g=game(['destinyeye']),f=g.fighters[0];A(!hit(g));if(response==='wrongGuard'){f.aim=Math.PI;A(g.parry(0));}else f.dashRemaining=.15;tick(g);A(f.dead,response);}
});
test('Eye accepts matching guard or movement outside the captured slash',()=>{
 for(const response of ['guard','jump','retreat']){const g=game(['destinyeye']),f=g.fighters[0];A(!hit(g));if(response==='guard'){f.aim=0;A(g.parry(0));}else if(response==='jump')f.y-=180;else f.x-=240;tick(g);A(!f.dead,response);if(response==='guard')A(g.events.some(e=>e.type==='parry'&&e.legacy==='destinyeye'));}
});
test('Eye cannot turn an unparryable ability into a parryable strike',()=>{
 const g=game(['destinyeye']),[d,a]=g.fighters;L.entity(g,a,'beam',{x:a.x,y:a.y-D.body(a).center,to:{x:d.x-50,y:d.y-D.body(d).center},zone:true,r:22,life:.4,parryable:false});L.worldStep(g,.01);A(d.legacy.pendingFatal);A(g.parry(0));tick(g);A(d.dead);
});
test('Eye pending geometry and reaction outcome survive snapshot/load',()=>{
 const g=game(['destinyeye']);A(!hit(g));const h=new D.Game();A(h.loadSnapshot(g.snapshot()));tick(g);tick(h);A.equal(h.fighters[0].dead,true);A.deepEqual(h.score,g.score);
});
test('survival order is Eye, Crystal, Berserker, then Ring without refund',()=>{
 const g=game(['destinyeye','crystal','berserker','secondchance']);A(!hit(g));tick(g);let f=g.fighters[0];A(f.legacy.used.match.crystal);A(!f.legacy.used.match.berserker);A(!hit(g));A(f.legacy.effects.berserk>0);tick(g,2.01);A(g.legacyRewind);L.worldStep(g,0);f=g.fighters[0];A(!f.dead);for(const id of ['destinyeye','crystal','berserker','secondchance'])A(f.legacy.used.match[id],id);A(hit(g));
});
test('Berserker debt cannot be dodged using mist or a late barrier',()=>{
 const g=game(['berserker','mist','barrier']),f=g.fighters[0];A(!hit(g));tick(g,1.8);A(L.activate(g,f,'mist'));A(L.activate(g,f,'barrier'));tick(g,.21);A(f.dead);
});
test('Berserker survives on a real group elimination, not merely a blocked hit',()=>{
 const r=new Path.Run({seed:55});r.level=36;const g=r.game();g.phase='playing';g.aiEnabled=false;g.fighters.forEach(f=>f.legacy=L.inventory());const f=g.fighters[0];L.add(f,'berserker');A(!g.lethal(g.fighters[1],f,'hit'));L.add(g.fighters[1],'crystal');A(!g.lethal(f,g.fighters[1],'blocked'));A(f.legacy.effects.berserk>0);A(g.lethal(f,g.fighters[1],'kill'));A.equal(f.legacy.effects.berserk,0);tick(g,3);A(!f.dead);A.equal(g.phase,'playing');
});
test('one kill creates only one servant even when lethal and kill event both fire',()=>{
 const r=new Path.Run({seed:9}),g=r.game();g.phase='playing';g.fighters.forEach(f=>f.legacy=L.inventory());L.add(g.fighters[0],'necromancer');let created=0;const initial=g.legacyWorld.serial;A(g.lethal(g.fighters[0],g.fighters[1],'hit'));const servants=L.world(g).entities.filter(e=>e.type==='servant');A.equal(servants.length,1);A.equal(g.legacyWorld.serial-initial,1);
});
console.log(count+' V8 survival groups passed');
