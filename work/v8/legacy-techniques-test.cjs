const A=require('node:assert/strict');require('./bootstrap.cjs');const D=global.DuelCore,L=global.DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(items=[]){const g=new D.Game({mode:'local',ai:false,rules:{specials:false}});g.start({legacies:[items,[]]});g.phase='playing';g.map.walls=[];g.map.platforms=[{x:0,y:700,w:2000,stage:'solid'}];g.fighters.forEach((f,i)=>Object.assign(f,{x:400+i*500,y:700,grounded:true,state:'idle'}));return g;}
function command(g,fields,dt=.01){const inp={...D.neutral(),...fields};L.command(g,g.fighters[0],inp,dt);return inp;}
test('stun and kick cooldown forbid technique side effects',()=>{
 for(const blocked of ['stun','cooldown'])for(const id of ['throw','flyingkick','stomp','roundhouse']){const g=game([id]),f=g.fighters[0],t=g.fighters[1];t.x=f.x+40;if(id!=='throw')f.grounded=false;if(blocked==='stun')g.setState(f,'stunned',.5);else f.kickCooldown=.6;const state=JSON.stringify([f.vx,f.vy,t.x,t.y,t.vx,t.vy]);command(g,{kick:true,kickHeld:true,down:['throw','stomp'].includes(id)},.3);A.equal(JSON.stringify([f.vx,f.vy,t.x,t.y,t.vx,t.vy]),state,id);A(!f.legacy.effects.stomp);A(!f.legacy.effects.impulse);A(f.legacy.kickHold===undefined);}
});
test('throw moves an adjacent opponent to the other side, never through a wall',()=>{
 for(const blocked of [false,true]){const g=game(['throw']),f=g.fighters[0],t=g.fighters[1];t.x=445;if(blocked)g.map.walls=[{x:418,y:400,w:10,h:300}];command(g,{kick:true,down:true});if(blocked){A.equal(t.x,445);A.equal(f.kickCooldown,0);}else{A(t.x<f.x);A(t.vx<0);A(t.vy<0);A(f.kickCooldown>0);A.equal(f.state,'kickRecovery');}A(!t.dead);}
});
test('roundhouse hits both sides once, respects walls and is not overwritten by normal kick',()=>{
 for(const blocked of [false,true]){const g=game(['roundhouse']),f=g.fighters[0],t=g.fighters[1];t.x=f.x-60;f.legacy.effects.roundhouse=.4;f.legacy.roundhouseHits=[];f.state='kickActive';if(blocked)g.map.walls=[{x:370,y:300,w:10,h:400}];L.afterMove(g,f,D.neutral(),.01);if(blocked)A.equal(t.vx,0);else{A(t.vx<-600);t.vx=0;L.afterMove(g,f,D.neutral(),.01);A.equal(t.vx,0);}A(f.kickHit);A(!t.dead);}
});
test('throw cannot cross a wall behind the thrower even when the landing position is clear',()=>{
 const g=game(['throw']),f=g.fighters[0],t=g.fighters[1];t.x=445;g.map.walls=[{x:370,y:300,w:10,h:400}];command(g,{kick:true,down:true});A.equal(t.x,445);A.equal(f.kickCooldown,0);
});
test('interrupted roundhouse preparation cannot become a delayed kick during stun',()=>{
 const g=game(['roundhouse']),f=g.fighters[0];command(g,{kick:true,kickHeld:true},.1);A(f.legacy.kickHold>0);g.setState(f,'stunned',.4);const inp=command(g,{kickHeld:false},.2);A(f.legacy.kickHold===undefined);A(!inp.kick);A(!f.legacy.effects.roundhouse);
});
test('stomp needs a real open downward path and bounces only once',()=>{
 for(const blocked of [false,true]){const g=game(['stomp']),f=g.fighters[0],t=g.fighters[1];f.grounded=false;f.y=500;t.x=f.x;t.y=590;if(blocked)g.map.walls=[{x:f.x-50,y:490,w:100,h:20}];command(g,{kick:true,down:true});L.afterMove(g,f,D.neutral(),.01);if(blocked){A.equal(t.vy,0);A(f.vy>0);}else{A(t.vy>500);A.equal(f.vy,-650);A.equal(f.legacy.effects.stomp,0);}A(!t.dead);}
});
test('failed dash cancel leaves recovery intact; success spends an actual charge',()=>{
 for(const blocked of ['lock','air','none']){const g=game(['dashcancel']),f=g.fighters[0];g.setState(f,'recovery',.4);f.stateTime=.2;if(blocked==='lock')f.dashLock=1;if(blocked==='air'){f.grounded=false;g.rules.airDash=false;}const charges=f.dashCharges;command(g,{dash:true,move:1});if(blocked==='none'){A.equal(f.state,'dash');A.equal(f.dashCharges,charges-1);}else{A.equal(f.state,'recovery');A.equal(f.stateTime,.2);A.equal(f.dashCharges,charges);}}
});
test('backstep has a startup window, consumes charge and retreats horizontally',()=>{
 for(const time of [.03,.18]){const g=game(['backstep']),f=g.fighters[0];g.setState(f,'startup',.3);f.attackAim=0;f.aim=-.7;f.stateTime=time;command(g,{dash:true,move:-1});if(time<.1){A.equal(f.state,'dash');A(f.dashX<-.99);A(Math.abs(f.dashY)<1e-9);A(f.dashRemaining<D.stats(f).dash);}else A.equal(f.state,'startup');}
});
test('Sem Saque consumes the stance and increases recovery only if that attack misses',()=>{
 for(const hit of [false,true]){const g=game(['nodraw']),f=g.fighters[0],base=D.stats(f);L.beforeStep(g,[D.neutral(),D.neutral()],1.1);A(f.legacy.effects.nodraw>0);A(g.attack(0));A.equal(f.duration,base.startup*.5/g.rules.attackSpeed);A.equal(f.legacy.effects.nodraw,0);f.attackHit=hit;A.equal(D.stats(f).recovery,base.recovery*(hit?1:1.7));}
});
test('directional techniques set charged weapon aim before preparation and cannot move a stunned actor',()=>{
 const g=game(['yamato','downstrike','iaijutsu']),f=g.fighters[0];f.grounded=false;command(g,{attack:true,attackHeld:true,down:true,aim:0});A.equal(f.legacy.weaponHold.aim,Math.PI/2);g.setState(f,'stunned',.5);f.grounded=true;f.legacy.lastDashGround=true;f.legacy.groundDashEnds=g.time;const x=f.x;command(g,{attack:true,aim:0});A.equal(f.x,x);
});
console.log(count+' V8 technique commitment groups passed');
