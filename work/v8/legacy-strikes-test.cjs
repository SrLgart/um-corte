const A=require('node:assert/strict');require('./bootstrap.cjs');const D=global.DuelCore,L=global.DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(ids=[],other=[]){const g=new D.Game({mode:'local',ai:false,rules:{specials:false}});g.start({legacies:[ids,other]});g.phase='playing';g.map.walls=[];g.map.platforms=[{x:0,y:700,baseX:0,baseY:700,w:g.map.width,stage:'solid',solid:true}];g.fighters.forEach((f,i)=>Object.assign(f,{x:500+i*700,y:700,grounded:true,state:'idle',aim:i?Math.PI:0}));return g;}
function tick(g,fields={},dt=1/240){g.step(dt,[{...D.neutral(),...fields},D.neutral()]);}
function until(g,state){for(let i=0;i<240&&g.fighters[0].state!==state;i++)tick(g);A.equal(g.fighters[0].state,state);}
function iai(g){const f=g.fighters[0];A(g.dash(0,1));until(g,'idle');A(f.grounded);A(g.attack(0));A.equal(L.attackTechnique(f)?.type,'iaijutsu');}
function thrust(g,{distance=155,aim=Math.PI,state='active'}={}){const [f,t]=g.fighters;t.kind='lancer';t.x=f.x+distance;t.attackAim=aim;t.attackId=++g.attackCounter;t.attackHit=false;g.setState(t,state,state==='startup'?.2:.1);return t;}
test('same-frame dash and attack creates a committed linear slash instead of the normal arc',()=>{
 const g=game(['lunge']),f=g.fighters[0];tick(g,{dash:true,attack:true,move:1,aim:0});A.equal(L.attackTechnique(f)?.type,'lunge');const x=f.x;A(!g.parry(0));A(!g.feint(0));A(!g.dash(0,-1));until(g,'active');f.stateTime=f.duration*.5;const pts=D.slash(f,g.map.walls).points;A(pts.length===5);A(Math.max(...pts.map(p=>p.y))-Math.min(...pts.map(p=>p.y))<=15);const a=f.attackAim;tick(g,{move:-1,aim:Math.PI,jump:true});A.equal(f.attackAim,a);A(f.x>x);A(f.grounded);A(!f.legacy.effects.shadow);
});
test('late dash attacks and ranged weapons preserve their ordinary moves',()=>{
 const g=game(['lunge']),f=g.fighters[0];g.dash(0,1);g.time=.09;A(g.attack(0));A(!L.attackTechnique(f));const h=game(['lunge','bow']);h.dash(0,1);A(h.attack(0));A(!L.attackTechnique(h.fighters[0]));
});
test('Iaijutsu advances over time, crosses bodies, and never tunnels through a wall',()=>{
 for(const wall of [false,true]){const g=game(['iaijutsu']),f=g.fighters[0],t=g.fighters[1];iai(g);const start=f.x;A.equal(f.x,start);t.x=start+70;t.admin.invincible=true;if(wall)g.map.walls=[{x:start+95,y:400,w:20,h:300}];for(let i=0;i<120&&f.state!=='recovery';i++)tick(g,{move:-1});if(wall)A(f.x+D.body(f).radius<=start+95+.01);else A(f.x>t.x+20);A(f.x>start);A.equal(f.state,'recovery');A(!g.feint(0));}
});
test('Iaijutsu requires a completed ground dash and cannot be reused for free',()=>{
 for(const invalid of ['air','expired']){const g=game(['iaijutsu']),f=g.fighters[0];if(invalid==='air')f.grounded=false;g.dash(0,1);g.setState(f,'idle');f.dashRemaining=0;f.grounded=true;g.time=f.legacy.groundDashEnds+(invalid==='expired'?.3:.02);A(g.attack(0));A(!L.attackTechnique(f));}
 const g=game(['iaijutsu']),f=g.fighters[0];iai(g);g.setState(f,'idle');A(g.attack(0));A(!L.attackTechnique(f));
});
test('parry stops the moving technique and its movement does not survive stun',()=>{
 const g=game(['lunge']),f=g.fighters[0],t=g.fighters[1];g.dash(0,1);g.attack(0);until(g,'active');t.x=f.x+95;t.aim=Math.PI;A(g.parry(1));g.resolveCombat();A.equal(f.state,'stunned');A(!L.attackTechnique(f));A.equal(f.dashRemaining,0);A.equal(t.dead,false);
});
test('tap of a charge weapon supports lunge; a full hold keeps its charged attack',()=>{
 for(const full of [false,true]){const g=game(['yamato','lunge']),f=g.fighters[0];g.dash(0,1);tick(g,{attack:true,attackHeld:true,aim:0});A(f.legacy.weaponHold);if(full)for(let i=0;i<100;i++)tick(g,{attackHeld:true,aim:0});tick(g,{attackHeld:false,aim:Math.PI});if(full){A(!L.attackTechnique(f));A(L.world(g).entities.some(e=>e.type==='spatialcut'));}else{A.equal(L.attackTechnique(f)?.type,'lunge');A.equal(f.attackAim,0);}}
});
test('wall strike works before a charge weapon consumes the attack input',()=>{
 const g=game(['yamato','wallstrike']),f=g.fighters[0];f.grounded=false;f.wallSide=1;const inp={...D.neutral(),attack:true,attackHeld:true};L.command(g,f,inp,.01);A(inp.jump);A(f.legacy.weaponHold);A(f.legacy.effects.counter>0);
});
test('Mikiri checks actual tip contact, aim, walls, timing and committed direction',()=>{
 for(const mode of ['valid','shaft','away','early','late','wall','retreat','unparryable']){const g=game(['mikiri']),f=g.fighters[0],t=thrust(g,{distance:mode==='shaft'?60:155,aim:mode==='away'?0:Math.PI,state:mode==='early'?'startup':'active'});if(mode==='wall')g.map.walls=[{x:f.x+70,y:400,w:20,h:300}];if(mode==='unparryable')t.breakAttackId=t.attackId;if(mode==='late'){g.dash(0,-1);f.dashX=1;g.time=.11;L.resolveTechniques(g);}else g.dash(0,mode==='retreat'?-1:1);A.equal(t.state==='stunned',mode==='valid',mode);A(!f.legacy.effects.shadow,mode);}
});
test('Mikiri can intercept a thrust that becomes active just after the dash input',()=>{
 const g=game(['mikiri']),f=g.fighters[0],t=thrust(g,{state:'startup'});g.dash(0,1);A.equal(t.state,'startup');g.time=.045;g.setState(t,'active',.1);g.resolveCombat();A.equal(t.state,'stunned');A(!f.dead);A(g.events.some(e=>e.technique==='mikiri'));
});
test('Mikiri accepts a real lunge from a sword but not a wide sword arc',()=>{
 for(const linear of [false,true]){const g=game(['mikiri'],linear?['lunge']:[]),f=g.fighters[0],t=g.fighters[1];t.x=f.x+100;t.aim=Math.PI;if(linear)g.dash(1,-1);g.attack(1);g.setState(t,'active',.12);t.stateTime=.06;A(g.bodyContact(t,f));g.dash(0,1);A.equal(t.state==='stunned',linear);}
});
test('Disarm excludes bare fists, knuckles, projectiles and original-class specials',()=>{
 for(const mode of ['fists','knuckles','projectile','special','weapon']){const g=game(['disarm'],mode==='knuckles'?['knuckles']:mode==='weapon'?['leviathan']:[]),t=g.fighters[1];if(mode==='fists')t.kind='boxer';if(mode==='special')t.ultMode='sweepStrike';g.emit('parry',{id:0,attacker:1,perfect:true,projectile:mode==='projectile'});A.equal(!!t.legacy.effects.weaponAway,mode==='weapon',mode);const e=L.world(g).entities.find(e=>e.type==='weapon');if(mode==='weapon'){A.equal(e.weapon,'leviathan');A.equal(e.originalOwner,1);A.equal(e.mode,'dropped');}else A(!e);}
});
test('Echo captures the narrow technique geometry; snapshots reproduce movement and delayed cut',()=>{
 const g=game(['echo','lunge']);g.dash(0,1);g.attack(0);until(g,'active');tick(g);const e=L.world(g).entities.find(e=>e.type==='echo');A(e.frames.length);A.equal(e.profiles[0].technique,'lunge');const snap=g.snapshot(),h=new D.Game();A(h.loadSnapshot(snap));h.map=JSON.parse(JSON.stringify(g.map));for(let i=0;i<180;i++){tick(g);tick(h);A.deepEqual(h.snapshot(),g.snapshot());}
});
console.log(count+' V8 precision strike groups passed');
