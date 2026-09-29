const A=require('node:assert/strict');require('./bootstrap.cjs');const D=DuelCore,L=DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(ids=[]){const g=new D.Game({mode:'local',ai:false,rules:{specials:false},random:L.rng(24)});g.start({legacies:[ids,[]]});g.phase='playing';g.map.walls=[];g.map.platforms=[{x:0,y:700,baseX:0,baseY:700,w:g.map.width,stage:'solid',solid:true}];g.fighters.forEach((f,i)=>Object.assign(f,{x:500+i*100,y:700,grounded:true,state:'idle',aim:i?Math.PI:0}));return g;}
test('Shadow Dash crosses bodies only in its brief window and never solid walls',()=>{
 const g=game(['shadowcloak']),f=g.fighters[0],t=g.fighters[1];g.dash(0,1);t.x=f.x+10;const before=[f.x,t.x];g.separateBodies();A.deepEqual([f.x,t.x],before);f.legacy.effects.shadow=0;g.separateBodies();A(Math.abs(t.x-f.x)>20);f.legacy.effects.shadow=.08;g.map.walls=[{x:f.x+35,y:300,w:20,h:400}];g.moveFighter(f,D.neutral(),.08);A(f.x+D.body(f).radius<=g.map.walls[0].x+.01);
});
test('Stone Mask adds wall cling and stronger jumps without changing other actors',()=>{
 const g=game(['stonemask']),f=g.fighters[0],t=g.fighters[1];g.moveFighter(f,{...D.neutral(),jump:true,jumpHeld:true},.001);g.moveFighter(t,{...D.neutral(),jump:true,jumpHeld:true},.001);A(f.vy<t.vy-90);f.wallSide=1;f.y=500;f.vy=100;f.grounded=false;g.moveFighter(f,{...D.neutral(),move:1},.01);A.equal(f.vy,0);f.vy=100;g.moveFighter(f,{...D.neutral(),move:0},.01);A(f.vy>100);
});
test('Incense remains armed while moving and consumes exactly one successful parry',()=>{
 const g=game(['incense']),f=g.fighters[0];L.beforeStep(g,[D.neutral(),D.neutral()],1.1);A(f.legacy.incenseReady);f.vx=300;L.beforeStep(g,[D.neutral(),D.neutral()],.1);A(f.legacy.incenseReady);A(g.parry(0));A.equal(f.duration,g.rules.parryWindow/1000*1.25);A(!f.legacy.incenseReady);const cd=(g.rules.parryWindow*1.25+g.rules.parryRecovery)/1000;A(Math.abs(f.parryCooldown-cd)<1e-9);g.setState(f,'idle');f.parryCooldown=0;g.parry(0);A.equal(f.duration,g.rules.parryWindow/1000);
});
test('War Bell refills dash without gifting jumps or flight fuel',()=>{
 const g=game(['warbell']),f=g.fighters[0];f.airJumps=0;f.airDashes=1;f.dashCharges=0;f.dashCooldown=.2;f.legacy.fuel=.15;g.emit('parry',{id:0,attacker:1,perfect:true});A.equal(f.dashCharges,g.rules.dashCount);A.equal(f.airDashes,0);A.equal(f.dashCooldown,0);A.equal(f.airJumps,0);A.equal(f.legacy.fuel,.15);
});
function near(g){const f=g.fighters[0],t=g.fighters[1];t.kind='duelist';t.x=f.x+150;t.attackAim=Math.PI;g.setState(t,'active',.11);t.stateTime=.055;t.attackId=1;for(let x=130;x<220;x++){f.x=t.x-x;const b=D.body(f);if(!g.bodyContact(t,f)&&D.polygonSegment(D.slash(t).points,{x:f.x,y:f.y-b.top},{x:f.x,y:f.y-b.bottom},b.radius+10))return;}throw Error('no near-miss geometry');}
test('Survivor Glass activates on a real near miss, not distance or an incoming fatal hit',()=>{
 for(const mode of ['near','far','hit']){const g=game(['survivorglass']),f=g.fighters[0],t=g.fighters[1];near(g);if(mode==='far')t.attackAim=0;if(mode==='hit')f.x=t.x-90;L.afterMove(g,f,D.neutral(),.01);A.equal(!!f.legacy.used.match.survivorglass,mode==='near',mode);}
});
test('Wolf Tooth needs a near miss during dash and buffs only the next complete attack',()=>{
 const g=game(['wolftooth']),f=g.fighters[0];near(g);f.dashRemaining=.1;L.afterMove(g,f,D.neutral(),.01);A(f.legacy.effects.wolf>0);A(!f.legacy.effects.shadow);g.fighters[1].x+=900;f.dashRemaining=0;g.setState(f,'idle');const reach=D.CLASSES[f.kind].reach;g.attack(0);A.equal(f.legacy.effects.wolf,0);const boosted=D.stats(f).reach;L.beforeStep(g,[D.neutral(),D.neutral()],1);A.equal(D.stats(f).reach,boosted);g.setState(f,'idle');g.attack(0);A(D.stats(f).reach<boosted);
});
test('Iron Talisman reduces the real base kick and nonlethal power knockback once',()=>{
 for(const power of [false,true]){const speeds=[];for(const equipped of [false,true]){const g=game(equipped?['irontalisman']:[]),f=g.fighters[0],t=g.fighters[1];t.x=f.x+45;if(power){const e=L.entity(g,t,'repulse',{x:L.center(f).x,y:L.center(f).y,to:L.center(f),zone:true,lethal:false,force:400,vx:-1,vy:0,life:.2});L.worldStep(g,.001);}else{t.kickSide=-1;g.setState(t,'kickActive',.1);g.resolveCombat();}A.equal(f.state,'pushed');speeds.push(Math.abs(f.vx));}A(Math.abs(speeds[1]/speeds[0]-.55)<1e-8);}
});
test('stopped time cannot refill flight fuel or prepare idle-based relics',()=>{
 const g=game(['incense','nodraw']),f=g.fighters[0],t=g.fighters[1];f.legacy.fuel=0;L.effect(g,t,'timeStop',t.x,t.y,{life:2});L.beforeStep(g,[D.neutral(),D.neutral()],1.2);A.equal(f.legacy.fuel,0);A(!f.legacy.incenseReady);A(!f.legacy.effects.nodraw);L.world(g).effects=[];L.beforeStep(g,[D.neutral(),D.neutral()],1.2);A(f.legacy.fuel>0);A(f.legacy.incenseReady);
});
console.log(count+' V8 relic/clothing precision groups passed');
