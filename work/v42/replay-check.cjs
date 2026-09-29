const A=require('node:assert/strict'),{Game,neutral}=require('./engine.js'),Lab=require('./lab.js');
const g=new Game({mode:'local',characters:['assassin','knight'],mapId:'bamboo',rules:{specials:true,specialCooldown:.1}});g.start();
const lab=new Lab();let shot=false;
for(let i=0;i<180&&g.phase==='playing';i++){
 const before=g.snapshot(),commands=[];
 for(let sub=0;sub<10;sub++){
  const fire=!shot&&g.fighters[0].specialCharge>=.1;
  if(fire)shot=true;
  const ins=[{...neutral(),special:fire}, {...neutral(),aim:Math.PI}];commands.push(ins);g.step(1/600,ins);
 }
 lab.record(g,before,commands);g.events=[];
}
A(lab.clip);A.equal(g.score[0],1);const official=JSON.stringify(g.snapshot());
A(lab.open());A.equal(lab.viewGame.rules.specials,true);
const projectileFrame=lab.clip.frames.findIndex(f=>f.before.fighters[0].dagger?.mode==='flying');A(projectileFrame>=0);
lab.seek(projectileFrame);A.deepEqual(lab.viewGame.fighters[0].dagger,lab.clip.frames[projectileFrame].before.fighters[0].dagger);
lab.loadFrame(lab.clip.frames.length-1);A(lab.viewGame.fighters[1].dead);
// Play as the defender before the recorded throw and jump over it.
lab.clip.seat=1;lab.seek(0);A(lab.tryAgain());lab.speed=1;
for(let i=0;i<60;i++)lab.tick(1/60,{...neutral(),aim:Math.PI,jump:i===0,jumpHeld:i<23,move:0});
A(lab.viewGame.events.every(e=>e.type!=='error'));A.equal(lab.viewGame.fighters[1].dead,false);A.equal(lab.viewGame.score[0],0);
A.equal(JSON.stringify(g.snapshot()),official);lab.close();
const t=new Game({mode:'training',characters:['reaper','assassin'],rules:{specials:true}});t.start();lab.startTraining(t);t.fighters[0].specialCharge=15;t.special(0);A(lab.savePosition(t));lab.resetTraining(t);A.equal(t.fighters[0].ultMode,'');A.equal(t.fighters[0].specialCharge,0);
for(const [window,recovery,state]of[[0,0,'idle'],[0,400,'parryRecovery'],[400,0,'parry']]){
 const z=new Game({mode:'local',experimental:true,rules:{parryWindow:window,parryRecovery:recovery}});z.start();A(z.parry(0));A.equal(z.fighters[0].state,state);A.equal(z.fighters[0].parryCooldown,(window+recovery)/1000);
 for(let i=0;i<301;i++)z.step(1/600,[neutral(),neutral()]);A.equal(z.fighters[0].state,'idle');
}
console.log('Special replay, interactive projectile dodge, unchanged official score, training reset and zero-duration admin rules passed.');
