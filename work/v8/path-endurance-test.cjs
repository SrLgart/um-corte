const A=require('node:assert/strict');require('./bootstrap.cjs');
const D=DuelCore,L=DuelLegacy,P=DuelPath;
// Scripted movement is independent of enemy input. Invincibility keeps each
// encounter running long enough to expose navigation/resource failures.
function command(t){return{...D.neutral(),move:Math.sin(t*.8)>.1?1:-1,jump:Math.floor(t*240)%480===0,jumpHeld:t%2<.3,dash:Math.floor(t*240)%197===0,up:t%5<1,down:t%5>4,aim:Math.sin(t)*Math.PI};}
for(const boss of P.BOSSES){
 const run=new P.Run({seed:531});run.level=boss.levels[0];run.bosses[run.level]=boss.id;
 const g=run.game();g.phase='playing';g.entryRemaining=0;g.adminOptions[0].invincible=true;g.fighters[0].admin.invincible=true;
 let maxEntities=0,attacks=0,uses=0,minDistance=Infinity;
 for(let frame=0;frame<7200;frame++){
  const t=frame/240;g.step(1/240,[command(t),...g.fighters.slice(1).map(()=>D.neutral())]);
  for(const e of g.events){if(e.type==='windup'&&e.id>0)attacks++;if(e.type==='legacyUse'&&e.id>0)uses++;}g.events=[];
  maxEntities=Math.max(maxEntities,L.world(g).entities.length);
  for(const f of g.fighters){A(Number.isFinite(f.x)&&Number.isFinite(f.y)&&Number.isFinite(f.vx)&&Number.isFinite(f.vy),boss.id+' finite actor');if(f.id)minDistance=Math.min(minDistance,Math.hypot(f.x-g.fighters[0].x,f.y-g.fighters[0].y));}
  A(maxEntities<200,boss.id+' unbounded world entities');
 }
 A(attacks>0,boss.id+' never attacked a moving target in 30 seconds');
 const h=new D.Game();A(h.loadSnapshot(g.snapshot()));
 for(let frame=0;frame<120;frame++){const inputs=[command(30+frame/240),...g.fighters.slice(1).map(()=>D.neutral())];g.step(1/240,L.clone(inputs));h.step(1/240,L.clone(inputs));}
 A.deepEqual(h.snapshot(),g.snapshot(),boss.id+' long encounter must resume deterministically');
 console.log('PASS',boss.id,{attacks,uses,maxEntities,minDistance:Math.round(minDistance)});
}
console.log('12 sustained boss encounters: 30 seconds each + snapshot continuation passed');
