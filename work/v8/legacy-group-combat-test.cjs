const A=require('node:assert/strict');require('./bootstrap.cjs');const D=global.DuelCore,L=global.DuelLegacy,P=global.DuelPath;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(){const run=new P.Run({seed:52});run.level=40;run.encounter={level:40,arena:'path_imperial',seed:52,fighters:Array.from({length:3},()=>({kind:'knight',build:[]}))};const g=run.game();g.phase='playing';g.time=2;g.map.walls=[];g.fighters.forEach((f,i)=>Object.assign(f,{x:i?1000+i*200:500,y:600,state:'idle',grounded:false}));g.events=[];return g;}
function strike(g,id=2){const a=g.fighters[id],d=g.fighters[0];a.x=d.x+80;a.attackAim=Math.PI;a.attackId=++g.attackCounter;a.attackHit=false;g.setState(a,'active',D.stats(a).active);a.stateTime=a.duration*.5;A(g.bodyContact(a,d),'fixture must contact real body');return a;}
test('group Perfect Parry activates boxer rush, recoil, sector and correct attacker callbacks',()=>{
 const g=game(),d=g.fighters[0];d.kind='boxer';d.wanderer=false;d.ultMode='boxerGuard';d.aim=0;L.add(d,'disarm');const at=strike(g);L.add(at,'sword');A(g.parry(0));g.resolveCombat();A(!d.dead);A.equal(at.state,'stunned');A(at.vx>0);A.equal(d.ultMode,'boxerRush');A.equal(d.lastPerfect,g.time);A(d.guardVisualUntil>g.time);A(at.legacy.effects.weaponAway);A(!g.fighters[1].legacy.effects.weaponAway);const event=g.events.find(e=>e.type==='parry');A.equal(event.attacker,2);A.equal(event.side,1);A.equal(event.perfect,true);
});
test('group intercept works at the guard before reaching the body',()=>{
 const g=game(),d=g.fighters[0],at=strike(g);d.aim=0;A(g.parry(0));let found=false;for(let dist=70;dist<220;dist++){at.x=d.x+dist;const guard=D.blade(d).guard;if(!g.bodyContact(at,d)&&D.polygonSegment(D.slash(at,[]).points,guard.a,guard.b,D.C.bladeWidth)){found=true;break;}}A(found,'fixture has guard-only intersection');g.resolveCombat();A.equal(at.state,'stunned');A(!d.dead);
});
test('wrong-facing parry and sovereign strike remain fatal in groups',()=>{
 for(const mode of ['back','break']){const g=game(),d=g.fighters[0],at=strike(g);d.aim=mode==='back'?Math.PI:0;A(g.parry(0));if(mode==='break')at.breakAttackId=at.attackId;g.resolveCombat();A(d.dead,mode);A.equal(g.score[1],1);}
});
test('group kick respects frozen kick direction, walls and range',()=>{
 for(const mode of ['hit','back','wall','far']){const g=game(),a=g.fighters[0],d=g.fighters[2];a.state='kickActive';a.kickSide=1;a.facing=-1;d.x=a.x+(mode==='back'?-45:mode==='far'?90:45);if(mode==='wall')g.map.walls=[{x:a.x+20,y:400,w:10,h:250}];g.resolveCombat();if(mode==='hit'){A.equal(d.state,'pushed');A.equal(d.vx,570);A.equal(g.hitstop,.035);}else A.equal(d.state,'idle',mode);A(!d.dead);}
});
test('group attack credit and recovery statistics occur once per victim',()=>{
 const g=game(),d=g.fighters[0];g.setState(d,'recovery',.3);strike(g);strike(g,3);g.resolveCombat();A(d.dead);A.equal(g.metrics.players[0].recoveryDeaths,1);A.equal(g.events.filter(e=>e.type==='kill').length,1);A.equal(g.events.find(e=>e.type==='kill').cause,'ABERTURA');
});
test('eliminating one group member does not end the duel or award a point',()=>{
 const g=game(),a=g.fighters[0],d=g.fighters[1];L.add(a,'sword');a.attackAim=0;a.attackId=++g.attackCounter;g.setState(a,'active',D.stats(a).active);a.stateTime=a.duration*.5;d.x=a.x+80;A(g.bodyContact(a,d));g.resolveCombat();A(d.dead);A.equal(g.phase,'playing');A.deepEqual(g.score,[0,0]);
});
console.log(count+' V8 group combat parity groups passed');
