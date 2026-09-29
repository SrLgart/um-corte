const A=require('node:assert/strict');require('./bootstrap.cjs');require('./room');require('./legacy-online');
const D=global.DuelCore,L=global.DuelLegacy,P=global.DuelPath;
let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(items=[],other=[]){const g=new D.Game({mode:'local',ai:false,seed:83,random:L.rng(83),rules:{specials:false}});g.start({legacies:[items,other]});g.phase='playing';g.fighters.forEach((f,i)=>{f.x=400+i*400;f.y=600;f.grounded=false;f.aim=i?Math.PI:0;});L.captureRound(g);return g;}
function neutral(g){return g.fighters.map(()=>D.neutral());}
test('D20 modifies this match, survives rounds and expires at next match',()=>{
 const g=game(['d20']),f=g.fighters[0],base=D.stats(f).speed;f.legacy.forcedDie=20;
 A(L.activate(g,f,'d20'));A(D.stats(f).speed>base*1.4);
 L.beforeStep(g,neutral(g),200);A.equal(f.legacy.effects.d20,true);
 g.resetFighters(true);A.equal(g.fighters[0].legacy.effects.d20Bonus,1.45);A(!L.scopeReady(g.fighters[0],'d20'));
 g.start();A.equal(D.stats(g.fighters[0]).speed,base);A(L.scopeReady(g.fighters[0],'d20'));
});
test('new round clears pending attacks, grapples and fatal timers, not consumptions',()=>{
 const g=game(['kamehameha','berserker','secondchance']),f=g.fighters[0];
 Object.assign(f.legacy,{channel:{id:'kamehameha',age:1.5},weaponHold:{age:1},pendingFatal:{attacker:1},berserkThreat:1,grapple:{x:99,y:99},kickHold:.1});
 f.legacy.used.match.berserker=true;f.legacy.used.run.philosopher=true;g.resetFighters(true);
 const l=g.fighters[0].legacy;for(const key of ['channel','weaponHold','pendingFatal','berserkThreat','grapple','kickHold'])A.equal(l[key],undefined,key);
 A(l.used.match.berserker);A(l.used.run.philosopher);
});
test('Philosopher transforms a random eligible item temporarily and remains consumed',()=>{
 const g=game(['philosopher','sword','lightcape']),f=g.fighters[0];f.legacy.target='sword';g.random=()=>.99;
 A(L.activate(g,f,'philosopher'));const tr=f.legacy.transforms[0];A.equal(tr.from,'lightcape');A.equal(L.catalog[tr.to].category,'clothing');A.equal(L.catalog[tr.to].rarity,'rare');
 g.resetFighters(true);A(L.has(g.fighters[0],tr.to));g.start();A(L.has(g.fighters[0],'lightcape'));A(!L.has(g.fighters[0],tr.to));A(!L.scopeReady(g.fighters[0],'philosopher'));
});
test('RNG snapshots preserve subsequent transformations including RNG state zero',()=>{
 const g=game(['d6','sword']);g.random.state=0;const s=g.snapshot(),h=new D.Game();A(h.loadSnapshot(s));A.equal(h.random.state,0);
 A(L.activate(g,g.fighters[0],'d6'));A(L.activate(h,h.fighters[0],'d6'));
 A.deepEqual(h.fighters[0].legacy.transforms,g.fighters[0].legacy.transforms);A.equal(h.random(),g.random());
});
test('temporary active transformation transfers its key and restores the original next match',()=>{
 const g=game(['d6','fireball']),f=g.fighters[0];f.legacy.bindings.fireball='KeyZ';g.random=()=>.999;
 A(L.activate(g,f,'d6'));A.equal(f.legacy.transforms[0].to,'swap');A.equal(f.legacy.bindings.swap,'KeyZ');A.equal(f.legacy.bindings.fireball,undefined);A(L.activate(g,f,'swap'));A(!L.add(f,'swap'));
 g.start();A.equal(g.fighters[0].legacy.bindings.fireball,'KeyZ');A.equal(g.fighters[0].legacy.bindings.swap,undefined);A(L.has(g.fighters[0],'fireball'));
});
test('removing a temporary transformation removes its inventory source and controls',()=>{
 const g=game(['d6','fireball']),f=g.fighters[0];g.random=()=>.999;A(L.activate(g,f,'d6'));L.remove(f,'swap');
 A(!L.has(f,'swap'));A(!L.has(f,'fireball'));A(!f.legacy.items.includes('fireball'));A(!f.legacy.bindings.swap);
});
test('online snapshots retain local keys for transformed powers without sending physical bindings',()=>{
 const g=game(['d6','fireball']),h=new D.Game();h.loadSnapshot(g.snapshot());h.fighters[0].legacy.bindings.fireball='KeyZ';g.random=()=>.999;A(L.activate(g,g.fighters[0],'d6'));L.captureRound(g);
 const packet=L.networkSnapshot(g.snapshot());A(!JSON.stringify(packet).includes('"binding"'));h.loadSnapshot(L.restoreLocalBindings(h,packet));
 A.equal(h.fighters[0].legacy.bindings.swap,'KeyZ');h.loadSnapshot(L.restoreLocalBindings(h,packet));A.equal(h.fighters[0].legacy.bindings.swap,'KeyZ');h.start();A.equal(h.fighters[0].legacy.bindings.fireball,'KeyZ');
});
test('Ring rewinds duel and summons but never returns consumed match/run uses',()=>{
 const g=game(['secondchance','crystal','philosopher','sword','raven']),start=g.snapshot();
 g.fighters[0].legacy.bindings.philosopher='KeyZ';g.fighters[0].legacy.used.match.crystal=true;g.fighters[0].legacy.used.run.philosopher=true;g.fighters[0].legacy.consumed.push('philosopher');
 g.fighters[0].x+=150;L.projectile(g,g.fighters[1],'fireball');
 A(!g.lethal(g.fighters[1],g.fighters[0],'hit'));L.worldStep(g,0);
 A.equal(g.fighters[0].x,start.fighters[0].x);A.deepEqual(g.score,start.score);A.equal(g.legacyWorld.entities.length,start.legacyWorld.entities.length);
 A(g.fighters[0].legacy.used.match.secondchance);A(g.fighters[0].legacy.used.match.crystal);A(g.fighters[0].legacy.used.run.philosopher);A(!L.has(g.fighters[0],'philosopher'));A.equal(g.fighters[0].legacy.bindings.philosopher,'KeyZ');
 A(g.lethal(g.fighters[1],g.fighters[0],'second hit'));
});
test('Ring fall rescue works after save/load and never grows nested snapshots',()=>{
 const g=game(['secondchance']);g.fighters[0].x+=50;const s=g.snapshot(),h=new D.Game();A(h.loadSnapshot(s));
 h.fighters[0].y=h.map.deathY+100;A(L.fallRescue(h,h.fighters[0]));A.equal(h.fighters[0].x,s.legacyRoundStart.fighters[0].x);A(!L.fallRescue(h,h.fighters[0]));
 for(let i=0;i<30;i++)L.captureRound(h);A(!h.snapshot().legacyRoundStart.legacyRoundStart);A(JSON.stringify(h.snapshot()).length<150000);
});
test('network snapshots also strip physical bindings from the rewind anchor',()=>{
 const g=game(['fireball','secondchance']);g.fighters[0].legacy.bindings.fireball='KeyZ';L.captureRound(g);
 A(!JSON.stringify(L.networkSnapshot(g.snapshot())).includes('"bindings"'));
});
test('online legacy edits cannot inject administrative actions or privileges',()=>{
 const r=new global.DuelRoom({}),ids=['host','guest'];r.host=true;r.s={id:'duel',ids};r.members=ids.map(id=>({id,admin:false}));
 r.receive('guest',{t:'legacyEdit',sid:'duel',change:{side:1,op:'diceTarget',value:'character',action:'pause',paused:true,administrator:true}});
 A.deepEqual(r.ops,[{action:'legacy',side:1,op:'diceTarget',value:'character',administrator:false}]);
 r.receive('guest',{t:'legacyEdit',sid:'duel',change:{side:0,op:'diceTarget',value:'draft'}});A.equal(r.ops.length,1);
});
for(const charge of [1.9,2,2.2])test('Kamehameha charge '+charge+' seconds respects parry threshold',()=>{
 const g=game(['kamehameha']),[f,t]=g.fighters;A(g.parry(1));A(L.activate(g,f,'kamehameha'));
 f.legacy.channel.age=charge;L.command(g,f,D.neutral(),0);const beam=L.world(g).entities.find(e=>e.type==='beam');A(beam);A.equal(beam.parryable,charge<2);
 L.worldStep(g,1/600);A.equal(t.dead,charge>=2);
 if(charge<2){A(g.events.some(e=>e.type==='parry'));A(!L.world(g).entities.some(e=>e.type==='beam'));}
});
test('projectile cutting intercepts at the visible slash before touching the body',()=>{
 const g=game([],['projectilecut']),[a,f]=g.fighters;g.setState(f,'active',D.stats(f).active);f.attackAim=Math.PI;f.stateTime=f.duration*.5;
 const points=D.slash(f,g.map.walls).points;A(points.length>2);const p=points.reduce((a,p)=>({x:a.x+p.x/points.length,y:a.y+p.y/points.length}),{x:0,y:0});
 A(Math.abs(p.x-f.x)>D.body(f).radius+8);L.entity(g,a,'arrow',{x:p.x,y:p.y,r:3});L.worldStep(g,1/600);
 A(!f.dead);A.equal(L.world(g).entities.length,0);A(g.events.some(e=>e.type==='clash'));
});
test('Mikiri requires advancing into a thrust, not retreating',()=>{
 for(const move of [-1,1]){const g=game(['mikiri']),[f,t]=g.fighters;t.kind='lancer';t.x=f.x+155;t.state='active';t.attackAim=Math.PI;A(g.bodyContact(t,f));
  A(g.dash(0,move,false,false));A.equal(t.state==='stunned',move>0);
 }
});
test('Caminho resume preserves ADMIN retry build from encounter entry',()=>{
 const r=new P.Run({seed:42});L.add({legacy:r.inventory},'sword');const g=r.game();L.add(g.fighters[0],'fireball');r.checkpoint(g);
 const resumed=P.Run.restore(r.serialize()),h=resumed.game();A(L.has(h.fighters[0],'fireball'));h.score=[0,3];resumed.reward(h);A(resumed.retry());A.deepEqual(resumed.inventory.items,['sword']);
});
test('all fifty encounter transitions, reward gates, saves and final victory',()=>{
 let run=new P.Run({seed:197,points:1});
 for(let level=1;level<=50;level++){
  A.equal(run.level,level);const g=run.game();A.equal(g.fighters.length,run.encounter.fighters.length+1);g.score=[1,0];g.runTime=3;run.reward(g);
  run=P.Run.restore(run.serialize());while(run.phase==='draft'){A(run.pick(run.draft.cards.find(id=>!run.draft.picked?.includes(id))));}
 }
 A.equal(run.phase,'won');A.equal(run.stats.time,150);A.equal(run.defeated.length,5);A.equal(run.level,50);
});
console.log(count+' V8 interaction groups passed');
