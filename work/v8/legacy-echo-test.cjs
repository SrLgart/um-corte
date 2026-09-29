const A=require('node:assert/strict');require('./bootstrap.cjs');const D=global.DuelCore,L=global.DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(items=['echo']){const g=new D.Game({mode:'local',ai:false,seed:21,random:L.rng(21),rules:{specials:false}});g.start({legacies:[items,[]]});g.phase='playing';g.fighters[0].x=400;g.fighters[1].x=1600;g.fighters.forEach(f=>f.y=700);return g;}
function start(g,aim=0){const f=g.fighters[0];f.attackAim=aim;f.attackId=++g.attackCounter;g.setState(f,'active',.12);g.emit('swing',{id:0});return L.world(g).entities.findLast(e=>e.type==='echo');}
function world(g,t){for(let i=0;i<Math.round(t*100);i++){g.time+=.01;L.worldStep(g,.01);}}
test('Echo replays the actual changing contour at its recorded world coordinates',()=>{
 const g=game(),f=g.fighters[0],e=start(g,-.4),original=[];for(let i=0;i<12;i++){f.x+=3;f.y-=2;f.stateTime=i*.01;L.afterMove(g,f,D.neutral(),.01);original.push(L.clone(D.slash(f,g.map.walls).points));world(g,.01);}g.setState(f,'recovery',.3);f.x=1200;f.y=400;L.remove(f,'echo');world(g,.48);A.deepEqual(e.points,original[0]);for(let i=1;i<12;i++){world(g,.01);A.deepEqual(e.points,original[i],String(i));}A(e.x<500);world(g,.04);A(!L.world(g).entities.includes(e));
});
test('Echo keeps captured wall clipping and stat modifiers after buffs expire',()=>{
 const g=game(),f=g.fighters[0];g.map.walls=[{x:480,y:0,w:24,h:900}];f.admin.attackScale=1.4;f.legacy.effects.wolf=.1;const e=start(g);f.stateTime=.05;L.afterMove(g,f,D.neutral(),.01);const original=L.clone(D.slash(f,g.map.walls).points);world(g,.01);g.setState(f,'idle');f.admin.attackScale=1;f.legacy.effects.wolf=0;world(g,.59);A.deepEqual(e.points,original);A(e.points.every(p=>p.x<=480.1));
});
test('Echo is harmless before its delay and kills only where the recorded cut was',()=>{
 const g=game(),f=g.fighters[0],t=g.fighters[1],e=start(g);f.stateTime=.06;L.afterMove(g,f,D.neutral(),.01);world(g,.01);g.setState(f,'idle');f.x=1300;t.x=500;world(g,.58);A(!t.dead);world(g,.01);A(t.dead);A.equal(g.score[0],1);A(e.x===400);
});
test('Echo survives save/replay restoration in the middle of recording and playback',()=>{
 const g=game();A(g.attack(0));for(let i=0;i<130;i++)g.step(1/600,[D.neutral(),D.neutral()]);A(L.world(g).entities.some(e=>e.type==='echo'));const h=new D.Game();A(h.loadSnapshot(g.snapshot()));for(let i=0;i<540;i++){g.step(1/600,[D.neutral(),D.neutral()]);h.step(1/600,[D.neutral(),D.neutral()]);}A.deepEqual(h.snapshot(),g.snapshot());
});
test('disarmed legendary weapons do not create spectral attacks from bare fists',()=>{
 for(const id of ['echo','zenith']){const g=game([id]),f=g.fighters[0];f.legacy.effects.weaponAway=true;start(g);A(!L.world(g).entities.some(e=>['echo','spectralblade'].includes(e.type)),id);}
});
test('long active frames keep only the replay queue, not unbounded past contours',()=>{
 const g=game(),f=g.fighters[0],e=start(g);f.duration=5;e.life=5.61;for(let i=0;i<1000;i++){f.stateTime=i/600;L.afterMove(g,f,D.neutral(),1/600);g.time+=1/600;L.worldStep(g,1/600);}A(e.frames.length<=362);A.equal(e.profiles.length,1);A(JSON.stringify(e).length<60000);
});
console.log(count+' V8 exact Echo groups passed');
