const A=require('node:assert/strict');require('./bootstrap.cjs');const Lab=require('./lab'),D=global.DuelCore,L=global.DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(items=[]){const g=new D.Game({mode:'training',ai:false,random:L.rng(53),rules:{specials:false}});g.start({legacies:[items,[]]});g.phase='playing';return g;}
function replay(items){const g=game(items),lab=new Lab(),s=g.snapshot();lab.clip={round:1,seat:0,reason:'Test',frames:Array.from({length:180},()=>({before:L.clone(s),after:L.clone(s),commands:Array.from({length:10},()=>[D.neutral(),D.neutral()])}))};lab.index=0;lab.tryAgain();lab.speed=1;return{g,lab};}
test('training reset keeps edited items, equipped weapon and bindings at the saved position',()=>{
 const g=game(),lab=new Lab();lab.startTraining(g);const x=g.fighters[0].x;L.add(g.fighters[0],'fireball');L.add(g.fighters[0],'ruyi');L.add(g.fighters[0],'hound');L.bind(g.fighters[0],'fireball','KeyZ',[]);g.legacyEnabled=true;g.fighters[0].x+=100;lab.patchLegacy(g);g.fighters[0].legacy.cd.fireball=2;lab.resetTraining(g);const f=g.fighters[0];A.equal(f.x,x);A(L.has(f,'ruyi'));A.equal(L.weaponId(f),'ruyi');A.equal(f.legacy.bindings.fireball,'KeyZ');A(!f.legacy.cd.fireball);A.equal(g.legacyWorld.entities.filter(e=>e.type==='hound').length,1);L.remove(f,'hound');lab.patchLegacy(g);lab.resetTraining(g);A(!L.has(g.fighters[0],'hound'));A(!g.legacyWorld.entities.some(e=>e.type==='hound'));
});
test('interactive replay forwards an active power once and leaves source clip immutable',()=>{
 const {lab}=replay(['fireball']),before=JSON.stringify(lab.clip);lab.tick(1/60,{...D.neutral(),legado:['fireball'],aim:-Math.PI/2});A.equal(lab.viewGame.legacyWorld.entities.filter(e=>e.type==='fireball').length,1);lab.tick(1/60,D.neutral());A.equal(lab.viewGame.legacyWorld.entities.filter(e=>e.type==='fireball').length,1);A.equal(JSON.stringify(lab.clip),before);
});
test('interactive replay carries held channels until release and preserves pending input over hitstop',()=>{
 const{lab}=replay(['kamehameha']);lab.viewGame.hitstop=.04;lab.tick(1/60,{...D.neutral(),aim:-Math.PI/2,legado:['kamehameha'],legadoHeld:['kamehameha']});A(!lab.viewGame.fighters[0].legacy.channel);for(let i=0;i<6;i++)lab.tick(1/60,{...D.neutral(),aim:-Math.PI/2,legadoHeld:['kamehameha']});A(lab.viewGame.fighters[0].legacy.channel.age>.02);lab.tick(1/60,D.neutral());A(!lab.viewGame.fighters[0].legacy.channel);A(lab.viewGame.legacyWorld.entities.some(e=>e.type==='beam'));
});
test('replay retry restores used powers and weapon geometry from its own starting snapshot',()=>{
 const{lab}=replay(['sandevistan','echo']);lab.tick(1/60,{...D.neutral(),legado:['sandevistan']});A(!L.scopeReady(lab.viewGame.fighters[0],'sandevistan'));L.remove(lab.viewGame.fighters[0],'echo');lab.tryAgain(true);A(L.scopeReady(lab.viewGame.fighters[0],'sandevistan'));A.equal(L.weaponId(lab.viewGame.fighters[0]),'echo');
});
console.log(count+' V8 laboratory/replay groups passed');
