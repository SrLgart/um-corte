const A=require('node:assert/strict');require('./bootstrap.cjs');const D=DuelCore,L=DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(items=[],other=[],rules={}){const g=new D.Game({mode:'local',ai:false,rules:{specials:false,...rules},random:L.rng(81)});g.start({legacies:[items,other]});g.phase='playing';g.map.walls=[];g.map.platforms=[{x:0,y:1000,baseX:0,baseY:1000,w:g.map.width,stage:'solid',solid:true}];g.fighters.forEach((f,i)=>Object.assign(f,{x:400+i*850,y:700,grounded:false,platform:-1,state:'idle',coyote:0,vx:0,vy:0,aim:i?Math.PI:0}));return g;}
function steps(g,n,input=D.neutral()){for(let i=0;i<n;i++)g.step(1/240,[{...input},D.neutral()]);}
function wall(g){const f=g.fighters[0];g.map.walls=[{x:500,y:100,w:35,h:900}];Object.assign(f,{x:500-D.body(f).radius,wallSide:1,wallId:0,lastWall:-1,wallLock:0,wallReleased:true});return f;}
test('climbing gloves hold against a wall without drift and release immediately',()=>{
 const g=game(['climbing']),f=wall(g);f.vy=400;const y=f.y;steps(g,180,{...D.neutral(),move:1});A.equal(f.y,y);A.equal(f.vy,0);A(!f.wallSliding);steps(g,1,{...D.neutral(),move:-1});A(f.y>y);A(f.vy>0);
});
test('climbing cannot cancel wall jump, dash or stun and respects inverted gravity',()=>{
 for(const inverted of [false,true]){const g=game(['climbing','gravitycloak']),f=wall(g);f.legacy.effects.inverted=inverted;steps(g,1,{...D.neutral(),move:1,jump:true,jumpHeld:true});A(f.vx<0);A(f.vy*(inverted?-1:1)<-750);
  f.wallLock=0;f.wallSide=1;g.setState(f,'stunned',1);f.vy=inverted?-250:250;const y=f.y;steps(g,1,{...D.neutral(),move:1});A((f.y-y)*(inverted?-1:1)>0);
 }
 const g=game(['climbing']),f=wall(g);g.dash(0,-1,false,true);const y=f.y;steps(g,1,{...D.neutral(),move:1});A(f.y<y);A(f.dashRemaining>0);
});
test('magnetic boots run only for a bounded wall contact budget and restore on landing',()=>{
 const g=game(['magnetic']),f=wall(g);f.legacy.airTime=9;const y=f.y;steps(g,120,{...D.neutral(),move:1});A(Math.abs(f.y-(y-120))<.01);A(f.legacy.wallRunLeft<1);const left=f.legacy.wallRunLeft;
 steps(g,20,{...D.neutral(),move:-1});A.equal(f.legacy.wallRunLeft,left);f.wallSide=1;f.x=500-D.body(f).radius;steps(g,320,{...D.neutral(),move:1});A.equal(f.legacy.wallRunLeft,0);A(f.vy>0);
 Object.assign(f,{grounded:true,y:1000,platform:0});steps(g,1);A.equal(f.legacy.wallRunLeft,1.4);
});
test('magnetic and climbing compose: run, then hold; wing boot charge is preserved',()=>{
 const g=game(['magnetic','climbing','wingboot','rockets']),f=wall(g);f.airJumps=2;f.legacy.wallRunLeft=.05;steps(g,60,{...D.neutral(),move:1});A.equal(f.legacy.wallRunLeft,0);const y=f.y;steps(g,60,{...D.neutral(),move:1});A.equal(f.y,y);A.equal(f.airJumps,2);steps(g,1,{...D.neutral(),move:1,jump:true,jumpHeld:true});A(f.vy<-800);A.equal(f.airJumps,2);
});
test('magnetic wall run cannot bypass a solid ceiling',()=>{
 const g=game(['magnetic']),f=wall(g),b=D.body(f);g.map.walls.push({x:300,y:380,w:300,h:30});f.y=410+b.top+b.radius+8;steps(g,80,{...D.neutral(),move:1});A(f.y-b.top-b.radius>=410-.01);
});
test('light cape clamps falling velocity before movement and never breaks a dash',()=>{
 const g=game(['lightcape']),f=g.fighters[0];f.vy=700;const y=f.y;steps(g,1,{...D.neutral(),jumpHeld:true});A(Math.abs(f.y-y-160/240)<1e-8);A.equal(f.vy,160);
 g.dash(0,0,true,false);steps(g,1,{...D.neutral(),jumpHeld:true});A(f.vy>500);
});
test('Impulse integrates displacement exactly once and keeps normal collision',()=>{
 const g=game(['impulse']),f=g.fighters[0];L.activate(g,f,'impulse',{aim:0});const x=f.x;steps(g,1);A(Math.abs(f.x-x-800/240)<1e-8);A(f.legacy.effects.impulse>0);A(!g.fighters[1].dead);
 g.map.walls=[{x:f.x+18,y:300,w:12,h:600}];steps(g,10);A(f.x+D.body(f).radius<=g.map.walls[0].x+.01);
});
test('downward Impulse lands on platforms instead of performing an extra post-collision step',()=>{
 const g=game(['impulse']),f=g.fighters[0];f.y=996;L.activate(g,f,'impulse',{aim:Math.PI/2});steps(g,4);A.equal(f.y,1000);A(f.grounded);A.equal(f.vy,0);
});
test('Impulse direction, inversion, double jump and interruption remain controllable',()=>{
 const g=game(['impulse','gravitycloak']),f=g.fighters[0];L.activate(g,f,'gravitycloak');L.activate(g,f,'impulse',{aim:-Math.PI/2});const y=f.y;steps(g,1);A(f.y<y);A(f.vy<-800);
 steps(g,1,{...D.neutral(),jump:true,jumpHeld:true});A(f.vy>800);A.equal(f.airJumps,0);A.equal(f.legacy.effects.impulse,0);
 f.legacy.cd.impulse=0;L.activate(g,f,'impulse',{aim:0});g.setState(f,'stunned',1);steps(g,1);A.equal(f.legacy.effects.impulse,0);
});
test('Faixa reduces missed recovery proportionally to custom settings without changing active parry',()=>{
 for(const ms of [0,100,400,1200]){const g=game(['duelistband'],[],{parryRecovery:ms}),f=g.fighters[0];A(g.parry(0));A.equal(f.duration,g.rules.parryWindow/1000);A(Math.abs(f.parryCooldown-(f.duration+g.rules.parryRecovery*.65/1000))<1e-9);
  g.tickState(f,f.duration+.00001);A.equal(f.state,g.rules.parryRecovery?'parryRecovery':'idle');A(Math.abs(f.duration-g.rules.parryRecovery*.65/1000)<1e-9);
 }
});
test('Faixa and Incense retain the longer active window and scale only recovery',()=>{
 const g=game(['duelistband','incense']),f=g.fighters[0];f.legacy.incenseReady=true;g.parry(0);A.equal(f.duration,.5);A(Math.abs(f.parryCooldown-.76)<1e-9);g.tickState(f,.51);A.equal(f.duration,.26);
});
test('counter is manual, expires, consumes one successful attack and keeps the current weapon',()=>{
 for(const expired of [false,true]){const g=game(['counter','needle']),f=g.fighters[0],base=D.stats(f).startup;g.emit('parry',{id:0,attacker:1,perfect:false});A.equal(f.state,'idle');if(expired)L.beforeStep(g,[D.neutral(),D.neutral()],.3);
  A(g.attack(0));A(Math.abs(f.duration-base*(expired?1:.5)/g.rules.attackSpeed)<1e-9);A.equal(L.weaponKind(f),'duelist');A.equal(f.legacy.effects.counter,0);g.setState(f,'idle');g.attack(0);A.equal(f.duration,base/g.rules.attackSpeed);
 }
});
test('failed attack input does not spend counter opportunity',()=>{const g=game(['counter']),f=g.fighters[0];g.emit('parry',{id:0,attacker:1});g.setState(f,'stunned',.05);A(!g.attack(0));A(f.legacy.effects.counter>0);});
test('upstrike directs blade and ranged attack upward while recovery remains committed',()=>{
 for(const weapon of ['needle','sword','blunderbuss']){const g=game(['upstrike',weapon]),f=g.fighters[0];steps(g,1,{...D.neutral(),attack:true,up:true,aim:0});A.equal(f.attackAim,-Math.PI/2);A.equal(f.state,'startup');g.setState(f,'recovery',.3);steps(g,1,{...D.neutral(),attack:true,up:true,aim:Math.PI});A.equal(f.state,'recovery');}
});
test('Bacamarte emits five short pellets, no invisible melee blade and a real reload',()=>{
 const g=game(['blunderbuss']),f=g.fighters[0];g.attack(0);g.tickState(f,f.duration+.001);const shots=L.world(g).entities.filter(e=>e.type==='pellet');A.equal(shots.length,5);A(shots[0].angle<0&&shots[4].angle>0);A.equal(D.slash(f).points.length,0);A.equal(f.legacy.cd.weapon,2.4);g.setState(f,'idle');A(!g.attack(0));L.worldStep(g,.11);A(!L.world(g).entities.some(e=>e.type==='pellet'));
});
test('one shotgun pellet kills at close range, misses outside range and respects walls',()=>{
 for(const mode of ['close','far','wall']){const g=game(['blunderbuss']),f=g.fighters[0],t=g.fighters[1];t.x=f.x+(mode==='far'?230:105);if(mode==='wall')g.map.walls=[{x:f.x+45,y:300,w:16,h:600}];g.attack(0);g.tickState(f,f.duration+.001);for(let i=0;i<40&&g.phase==='playing';i++)L.worldStep(g,1/240);A.equal(t.dead,mode==='close',mode);if(mode==='close')A.equal(g.score[0],1);}
});
test('Glass Eye telegraphs enemy startup without changing combat timing',()=>{
 const g=game(['glasseye']),f=g.fighters[0],t=g.fighters[1];const base=D.stats(t).startup/g.rules.attackSpeed;g.attack(1);A.equal(t.duration,base);A.equal(L.world(g).effects.filter(e=>e.type==='tell').length,1);A.equal(L.timeScale(g,t),1);A.equal(f.state,'idle');g.attack(0);A.equal(L.world(g).effects.filter(e=>e.type==='tell').length,1);
});
test('Stopped Clock only follows Perfect Parry, has cooldown and does not slow its owner',()=>{
 const g=game(['stoppedclock']),f=g.fighters[0],t=g.fighters[1];g.emit('parry',{id:0,perfect:false});A.equal(L.timeScale(g,t),1);g.emit('parry',{id:0,perfect:true});A.equal(L.timeScale(g,t),.4);A.equal(L.timeScale(g,f),1);g.emit('parry',{id:0,perfect:true});A.equal(L.world(g).effects.filter(e=>e.type==='slowTime').length,1);L.worldStep(g,.3);A.equal(L.timeScale(g,t),1);A(f.legacy.cd.stoppedclock>0);
});
test('Cracked Hourglass restores mobility only after a real kill, not a blocked fatal hit',()=>{
 for(const protectedTarget of [false,true]){const g=game(['crackedglass','wingboot'],protectedTarget?['crystal']:[]),f=g.fighters[0],t=g.fighters[1];f.dashCharges=0;f.dashCooldown=1;f.airDashes=1;f.airJumps=0;A.equal(g.lethal(f,t,'audit'),!protectedTarget);A.equal(f.airJumps,protectedTarget?0:2);A.equal(f.dashCharges,protectedTarget?0:g.rules.dashCount);A.equal(f.airDashes,protectedTarget?1:0);}
});
test('Perfect Step requires a live hitbox and successful dash, never just a startup or spent cut',()=>{
 for(const mode of ['contact','startup','spent','far','nocharge']){const g=game(['perfectstep']),f=g.fighters[0],t=g.fighters[1];t.x=f.x+100;t.attackAim=Math.PI;t.attackId=1;g.setState(t,mode==='startup'?'startup':'active',.14);t.stateTime=.07;if(mode==='spent')t.attackHit=true;if(mode==='far')t.x+=500;if(mode==='nocharge')f.dashCharges=0;g.dash(0,-1);A.equal(!!f.legacy.effects.shadow,mode==='contact',mode);}
});
test('wall budget and impulse resume identically from snapshots with real movement',()=>{
 for(const id of ['magnetic','impulse']){const g=game([id]),f=id==='magnetic'?wall(g):g.fighters[0];if(id==='impulse')L.activate(g,f,id,{aim:-.3});const inp={...D.neutral(),move:1};steps(g,10,inp);const h=new D.Game();h.loadSnapshot(L.clone(g.snapshot()));h.map=L.clone(g.map);for(let i=0;i<240;i++){g.step(1/240,[{...inp},D.neutral()]);h.step(1/240,[{...inp},D.neutral()]);A.deepEqual(h.snapshot(),g.snapshot());}}
});
console.log(count+' V8 equipment audit groups passed');
