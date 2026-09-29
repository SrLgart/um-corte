const A=require('node:assert/strict');require('./bootstrap.cjs');const D=DuelCore,L=DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(ids=[]){const g=new D.Game({mode:'local',ai:false,rules:{specials:false},random:L.rng(72)});g.start({legacies:[ids,[]]});g.phase='playing';g.map.walls=[];g.map.platforms=[{x:0,y:700,baseX:0,baseY:700,w:g.map.width,stage:'solid',solid:true}];g.fighters.forEach((f,i)=>Object.assign(f,{x:450+i*1100,y:700,grounded:true,platform:0,state:'idle',aim:i?Math.PI:0}));g.legacyWorld={entities:[],effects:[],serial:0,time:0};L.spawnCompanions(g,g.fighters[0]);return g;}
function step(g,dt=.01){g.time+=dt;L.worldStep(g,dt);}
function advance(g,t){for(let i=0;i<Math.round(t*600);i++)step(g,1/600);}
function summon(g,type){return L.world(g).entities.find(e=>e.type===type);}
test('Doppel replays changing real contours and positions after exactly its delay',()=>{
 const g=game(['doppel','needle']),f=g.fighters[0],e=summon(g,'doppel'),cuts=[];f.state='active';f.duration=.15;f.attackId=1;
 for(let i=0;i<10;i++){f.x+=3;f.y-=2;f.stateTime=i*.01;f.attackAim=-.4;cuts.push(L.clone(D.slash(f,g.map.walls).points));step(g);A(!e.points.length);}
 g.setState(f,'idle');f.x=1200;f.y=450;L.remove(f,'needle');for(let i=0;i<45;i++)step(g);A(!e.fighter);step(g);A.deepEqual(e.points,cuts[0]);for(let i=1;i<10;i++){step(g);A.deepEqual(e.points,cuts[i],String(i));}A(e.x<500);A(e.fighter.vy===0);
});
test('Doppel preserves old reach, body/attack scale and punch; it clips against current walls',()=>{
 const g=game(['doppel','knuckles']),f=g.fighters[0],e=summon(g,'doppel');f.punch=1;f.admin.attackScale=1.4;f.legacy.effects.wolf=.4;f.attackId=1;f.attackAim=0;g.setState(f,'active',.1);f.stateTime=.05;const pts=D.slash(f,[]).points;step(g);f.legacy.effects.wolf=0;f.admin.attackScale=1;g.setState(f,'idle');advance(g,.55);A.deepEqual(e.points,pts);A.equal(e.fighter.punch,1);A.equal(e.geometry.kind,'boxer');
});
test('Doppel repeats jump/motion without normal body collision or recursive summons',()=>{
 const g=game(['doppel','echo']),f=g.fighters[0],e=summon(g,'doppel');f.y=430;f.vy=-500;f.grounded=false;step(g);f.y=200;advance(g,.55);A.equal(e.fighter.y,430);A.equal(e.fighter.vy,-500);A.equal(e.fighter.grounded,false);A.equal(g.fighters.length,2);A.equal(L.world(g).entities.filter(e=>e.kind==='companion').length,1);A(!L.world(g).entities.some(e=>e.type==='echo'));
});
test('Doppel does not reproduce projectiles, original specials or unarmed lost-weapon attacks',()=>{
 for(const weapon of ['bow','kunai','zenith']){const g=game(['doppel',weapon]),f=g.fighters[0],e=summon(g,'doppel');f.state='active';f.duration=.1;f.stateTime=.05;f.attackId=1;if(weapon==='zenith')f.ultMode='reaperBoost';step(g);g.setState(f,'idle');advance(g,.55);A.equal(e.points.length,0,weapon);A.equal(L.world(g).entities.length,1,weapon);}
 const g=game(['doppel','sword']),f=g.fighters[0];f.legacy.effects.weaponAway=true;f.state='active';f.attackId=1;step(g);g.setState(f,'idle');advance(g,.55);A.equal(summon(g,'doppel').points.length,0);
});
test('Doppel contact uses the recorded slash, not the owner or an invisible circle',()=>{
 const g=game(['doppel','needle']),f=g.fighters[0],t=g.fighters[1];f.state='active';f.stateTime=.05;f.duration=.1;f.attackId=1;f.attackAim=0;step(g);g.setState(f,'idle');f.x=1300;t.x=550;advance(g,.54);A(!t.dead);advance(g,.012);A(t.dead);A.equal(g.score[0],1);
});
test('Parrying a Doppel cut cancels that copied attack and does not stun its owner',()=>{
 const g=game(['doppel','needle']),f=g.fighters[0],t=g.fighters[1],e=summon(g,'doppel');f.state='active';f.stateTime=.05;f.duration=1;f.attackId=1;f.attackAim=0;advance(g,.54);t.x=550;t.aim=Math.PI;g.parry(1);advance(g,.02);A(!t.dead);A(e.blockedAttack===1);A(e.stunned>0);A.equal(f.state,'active');t.state='idle';advance(g,.4);A(!t.dead);A.equal(e.points.length,0);
});
test('Spectral materializes on a valid flank, locks aim there and cuts after warning',()=>{
 const g=game(['spectral']),e=summon(g,'spectral'),t=g.fighters[1];t.x=800;t.facing=1;e.due=0;step(g,.001);A.equal(e.fighter.state,'startup');A.equal(e.x,690);A.equal(e.fighter.attackAim,0);A(e.warnLeft>.2);advance(g,.2);A(!t.dead);advance(g,.24);A(t.dead);A(e.points.length>0);
});
test('Spectral uses a real directional slash and can be escaped during telegraph',()=>{
 const g=game(['spectral']),e=summon(g,'spectral'),t=g.fighters[1];t.x=800;t.facing=1;e.due=0;step(g);t.x=570;advance(g,.6);A(!t.dead);A(!L.world(g).entities.some(e=>e.type==='spectralcut'));A(['recovery','hidden'].includes(e.fighter.state));advance(g,.4);A.equal(e.phase,'hidden');
});
test('Spectral checks walls/platforms before materializing; hidden form cannot be destroyed',()=>{
 const g=game(['spectral']),e=summon(g,'spectral'),t=g.fighters[1];t.x=800;t.facing=1;g.map.walls=[{x:650,y:400,w:100,h:300},{x:860,y:400,w:100,h:300}];e.due=0;step(g);A.equal(e.phase,'hidden');A(e.life>e.age);A(e.due>0);g.map.walls=[];e.due=0;step(g);A.equal(e.fighter.state,'startup');t.x=e.x+80;t.attackAim=Math.PI;g.setState(t,'active',.1);t.stateTime=.05;step(g);A(!L.world(g).entities.includes(e));A.deepEqual(g.score,[0,0]);
});
test('Skeleton uses slower sword startup and recovery, not lethal body touch',()=>{
 const g=game(['skeleton']),e=summon(g,'skeleton'),t=g.fighters[1];Object.assign(e,{x:650,y:685,grounded:true,due:0});t.x=750;step(g);A.equal(e.fighter.state,'startup');A.equal(e.fighter.duration,.4/g.rules.attackSpeed);advance(g,.20);A(!t.dead);advance(g,.26);A(t.dead);A(e.points.length>0);t.dead=false;t.x=1600;advance(g,.15);A.equal(e.fighter.state,'recovery');A.equal(e.fighter.duration,.55/g.rules.attackSpeed*g.rules.attackRecovery);
});
test('Skeleton parry and reconstruction clear old attacks without granting a score',()=>{
 const g=game(['skeleton']),e=summon(g,'skeleton'),f=g.fighters[0],t=g.fighters[1];Object.assign(e,{x:650,y:685,grounded:true,due:0});t.x=750;t.aim=Math.PI;g.parry(1);advance(g,.47);A.equal(e.fighter.state,'stunned');A(!t.dead);A.equal(f.state,'idle');g.setState(t,'active',.1);t.attackAim=Math.PI;t.stateTime=.05;step(g);A(e.deadUntil>g.time);A(!e.fighter);A(!e.points.length);A.deepEqual(g.score,[0,0]);g.setState(t,'idle');t.x=1700;advance(g,6.1);A(!e.deadUntil);A(e.fighter);A(!e.points.length);
});
test('Doppel active history is bounded and full trio resumes deterministically',()=>{
 const g=game(['doppel','skeleton','spectral']),f=g.fighters[0],e=summon(g,'doppel');for(const s of L.world(g).entities)if(s!==e)s.due=100;f.state='active';f.stateTime=.04;f.duration=10;f.attackId=1;for(let i=0;i<900;i++){f.legacy.effects.wolf=i%2?.1:0;step(g,1/600);}A(e.history.length<=333);A(Object.keys(e.profiles).length<=2);A(JSON.stringify(e).length<80000);const h=new D.Game();A(h.loadSnapshot(g.snapshot()));h.map=L.clone(g.map);advance(g,.4);advance(h,.4);A.deepEqual(g.legacyWorld,h.legacyWorld);
});
test('Doppel slash clashes without killing either combatant or mutating the source attack',()=>{
 const g=game(['doppel']),f=g.fighters[0],t=g.fighters[1],e=summon(g,'doppel');f.attackId=1;f.attackAim=0;g.setState(f,'active',1);f.stateTime=.05;advance(g,.54);Object.assign(t,{x:600,state:'active',stateTime:.05,duration:.1,attackAim:Math.PI});advance(g,.02);A.equal(t.state,'clash');A.equal(e.blockedAttack,1);A(!t.dead);A.equal(f.state,'active');
});
test('Spectral slash can be parried without stunning its owner',()=>{
 const g=game(['spectral']),e=summon(g,'spectral'),f=g.fighters[0],t=g.fighters[1];t.x=800;t.facing=1;e.due=0;step(g);t.aim=Math.PI;g.parry(1);advance(g,.46);A(!t.dead);A(e.blockedAttack===e.fighter.attackId);A.equal(f.state,'idle');advance(g,.5);A.equal(e.phase,'hidden');
});
test('Delayed slash cannot pass through a wall added before playback',()=>{
 const g=game(['doppel','needle']),f=g.fighters[0],e=summon(g,'doppel');f.state='active';f.attackId=1;f.stateTime=.05;f.duration=.1;f.attackAim=0;step(g);g.setState(f,'idle');f.x=1200;g.map.walls=[{x:500,y:300,w:20,h:400}];advance(g,.55);A(e.points.length>0);A(e.points.every(p=>p.x<=500.01));
});
test('Older development-save Doppel buffers reset safely; stopped owner time does not record',()=>{
 const g=game(['doppel']),e=summon(g,'doppel');e.history=[{at:0,x:450,y:700,state:'idle'}];step(g);A(Array.isArray(e.history[0]));const state=L.clone(e);L.effect(g,g.fighters[1],'timeStop',500,500,{life:1});step(g,.02);A.deepEqual(e,state);
});
test('Directional barrier checks the summon side, not its distant owner',()=>{
 const g=game(['spectral']),e=summon(g,'spectral'),t=g.fighters[1];t.x=800;t.facing=-1;t.aim=Math.PI;t.legacy.effects.barrier=3;e.due=0;step(g);A(e.x>t.x);advance(g,.48);A(t.dead);A.equal(t.legacy.effects.barrier,3);
});
test('Fatal presentation records the copied contour and angle instead of owner slash',()=>{
 const g=game(['doppel','needle']),f=g.fighters[0],t=g.fighters[1];f.attackId=1;f.attackAim=0;g.setState(f,'active',.1);f.stateTime=.05;step(g);g.setState(f,'idle');f.x=1400;t.x=550;advance(g,.56);const result=g.events.find(e=>e.type==='kill');A(t.dead);A(result);A.equal(result.source,'doppel');A(result.contours.length>0);A(result.contours.every(p=>p.x<700));
});
test('Real movement/attack frames with all three summons continue identically after save',()=>{
 const g=game(['doppel','skeleton','spectral','needle']);for(let i=0;i<120;i++)g.step(1/240,[{...D.neutral(),move:i<60?1:0,jump:i===5,jumpHeld:i<40,attack:i===70,aim:-.3},D.neutral()]);const h=new D.Game();A(h.loadSnapshot(L.clone(g.snapshot())));h.map=L.clone(g.map);for(let i=0;i<240;i++){const input=[{...D.neutral(),move:i<50?-1:0,dash:i===10,attack:i===30,aim:0},D.neutral()];g.step(1/240,L.clone(input));h.step(1/240,L.clone(input));}A.deepEqual(h.fighters,g.fighters);A.deepEqual(h.legacyWorld,g.legacyWorld);A.deepEqual(h.score,g.score);
});
console.log(count+' V8 physical summon identity groups passed');
