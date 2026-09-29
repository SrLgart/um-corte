const A=require('node:assert/strict');require('./bootstrap.cjs');const D=global.DuelCore,L=global.DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(){const g=new D.Game({mode:'local',ai:false,rules:{specials:false}});g.start({legacies:[['kamehameha'],[]]});g.phase='playing';g.map.walls=[];g.map.platforms=[{x:0,y:700,baseX:0,baseY:700,w:g.map.width,stage:'solid'}];g.fighters.forEach((f,i)=>Object.assign(f,{x:500+i*800,y:700,state:'idle',grounded:true,aim:0}));return g;}
function command(g,fields,dt=.01){L.command(g,g.fighters[0],{...D.neutral(),...fields},dt);}
test('channel cannot start in stun, during a dash or while preparing another attack',()=>{
 for(const blocked of ['stunned','dash','weaponHold']){const g=game(),f=g.fighters[0];if(blocked==='weaponHold')f.legacy.weaponHold={weapon:'yamato'};else if(blocked==='dash')g.dash(0,1);else g.setState(f,'stunned',.4);A(!L.activate(g,f,'kamehameha'));A(!f.legacy.channel);}
});
test('interruption and death cancel immediately, cannot emit a delayed beam',()=>{
 for(const state of ['stunned','pushed','dead','parry']){const g=game(),f=g.fighters[0];A(L.activate(g,f,'kamehameha'));f.legacy.channel.age=2.2;g.setState(f,state,.5);A(!f.legacy.channel);command(g,{},.01);A(!L.world(g).entities.some(e=>e.type==='beam'));A(f.legacy.cd.kamehameha>0);}
});
test('movement stays available but slower; another deliberate action abandons the charge',()=>{
 const g=game(),f=g.fighters[0],speed=D.stats(f).speed;A(L.activate(g,f,'kamehameha'));A.equal(D.stats(f).speed,speed*.3);command(g,{legadoHeld:['kamehameha'],move:1},.5);A(f.legacy.channel);command(g,{legadoHeld:['kamehameha'],dash:true});A(!f.legacy.channel);A.equal(D.stats(f).speed,speed);A(!L.world(g).entities.length);
});
test('two-second signal happens once, guide stops at a wall, release locks its angle',()=>{
 const g=game(),f=g.fighters[0];g.map.walls=[{x:850,y:200,w:20,h:500}];A(L.activate(g,f,'kamehameha',{aim:0}));for(let i=0;i<240;i++)command(g,{legadoHeld:['kamehameha'],aim:Math.PI});A.equal(g.events.filter(e=>e.type==='legacyChargeReady').length,1);A.equal(f.legacy.channel.to.x,850);command(g,{aim:Math.PI});const beam=L.world(g).entities[0];A.equal(beam.to.x,850);A.equal(beam.angle,0);A(!beam.parryable);A(beam.r>22&&beam.r<=28);A.equal(f.state,'recovery');A(g.events.some(e=>e.type==='legacyBeam'&&e.strong));
});
test('maximum charge fires once even when input remains held',()=>{
 const g=game(),f=g.fighters[0];L.activate(g,f,'kamehameha');for(let i=0;i<400;i++)command(g,{legadoHeld:['kamehameha']});A(!f.legacy.channel);A.equal(L.world(g).entities.filter(e=>e.type==='beam').length,1);A(f.legacy.cd.kamehameha>0);
});
test('channel is vulnerable to an ordinary clean hit and never grants protection',()=>{
 const g=game(),f=g.fighters[0],t=g.fighters[1];L.activate(g,f,'kamehameha');A(g.lethal(t,f,'test'));A(f.dead);A(!f.legacy.channel);
});
console.log(count+' V8 channel interruption/telegraph groups passed');
