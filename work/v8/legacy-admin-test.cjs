const A=require('node:assert/strict');require('./bootstrap.cjs');require('./room');require('./legacy-online');
const D=global.DuelCore,L=global.DuelLegacy,P=global.DuelPath;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(items=[]){const g=new D.Game({mode:'training',ai:false,seed:83,random:L.rng(83),rules:{specials:false}});g.start({legacies:[items,[]]});g.phase='playing';return g;}
function edit(g,op,value,side=0){return L.applyEdit(g,{side,op,value,administrator:true});}
test('debug operations require authority; malformed commands cannot enter simulation',()=>{
 for(const [op,value]of [['add','sword'],['ready','fireball'],['consume','crystal'],['restore','crystal'],['spawn','hound'],['despawn','hound'],['die',20],['seed',0],['difficulty','hard'],['philosopher',undefined],['randomize',{count:115}]]){A(L.validEdit({op,value},true),op);A(!L.validEdit({op,value},false),op);}
 for(const [op,value]of [['add','__proto__'],['add',{}],['die',21],['die',1.5],['seed',-1],['seed',Infinity],['spawn','sword'],['randomize',{count:1.5}],['randomize',{count:5,rarity:'admin'}],['difficulty','__proto__']])A(!L.validEdit({op,value},true));
 const g=game();A(!L.applyEdit(g,{side:0,op:'add',value:'sword',administrator:false}));A(!edit(g,'add','sword',-1));
});
test('all 115 distinct Legados fit, filtered randomization is deterministic and mode independent',()=>{
 const a=game(),b=game();for(const g of [a,b]){A(edit(g,'seed',0));A(edit(g,'randomize',{count:3,category:'summon',rarity:'legendary'}));}
 A.deepEqual(a.snapshot(),b.snapshot());A(a.fighters[0].legacy.items.every(id=>L.catalog[id].category==='summon'&&L.catalog[id].rarity==='legendary'));
 A(edit(a,'randomize',{count:115}));A.equal(a.fighters[0].legacy.items.length,115);A(!edit(a,'randomize',{count:1}));A(L.has(a.fighters[0],'contract'));
});
test('adding a passive preserves companion identity, phase, position and entity serial',()=>{
 const g=game(['hound']),e=L.world(g).entities[0];e.x=123;e.phase='return';const serial=L.world(g).serial;
 A(edit(g,'add','sandals'));A.equal(L.world(g).entities.length,1);A.equal(L.world(g).serial,serial);A.equal(L.world(g).entities[0],e);A.equal(e.phase,'return');
});
test('spawn and despawn only affect selected summon, releasing carried weapons',()=>{
 const g=game(['monkey','hound']),w=L.world(g),monkey=w.entities.find(e=>e.type==='monkey'),hound=w.entities.find(e=>e.type==='hound');L.throwWeapon(g,g.fighters[1]);const weapon=w.entities.find(e=>e.type==='weapon');weapon.carrier=monkey.id;
 A(edit(g,'despawn','monkey'));A.equal(weapon.carrier,null);A.equal(weapon.mode,'dropped');A(w.entities.includes(hound));A(L.has(g.fighters[0],'monkey'));
 A(edit(g,'spawn','monkey'));A.equal(w.entities.filter(e=>e.type==='monkey').length,1);A(w.entities.includes(hound));A(edit(g,'spawn','monkey'));A.equal(w.entities.filter(e=>e.type==='monkey').length,1);
});
test('ready clears only cooldown, restore clears the chosen use and consumption',()=>{
 const g=game(['fireball','crystal','hound']),f=g.fighters[0],l=f.legacy;l.cd.fireball=3;l.used.match.crystal=true;
 A(edit(g,'ready','fireball'));A(!l.cd.fireball);A(l.used.match.crystal);A(edit(g,'consume','hound'));A(!L.has(f,'hound'));A(!L.world(g).entities.some(e=>e.type==='hound'));
 A(edit(g,'restore','hound'));A(L.has(f,'hound'));A.equal(L.world(g).entities.filter(e=>e.type==='hound').length,1);A(edit(g,'restore','crystal'));A(!l.used.match.crystal);
 A(edit(g,'consume','crystal'));A(edit(g,'remove','crystal'));A(edit(g,'add','crystal'));A(L.has(f,'crystal'));
});
test('D20 and Philosopher forced actions use real mechanics and survive snapshots',()=>{
 const g=game(['d20','sword']);A(edit(g,'die',20));A(L.activate(g,g.fighters[0],'d20'));A.equal(g.fighters[0].legacy.effects.d20Bonus,1.45);
 A(edit(g,'philosopher'));const t=g.fighters[0].legacy.transforms[0];A(t);A.equal(L.catalog[t.to].category,L.catalog[t.from].category);A.equal(L.catalog[t.to].rarity,'rare');
 A(edit(g,'consume',t.to));A(!L.has(g.fighters[0],t.to));A(edit(g,'restore',t.to));A(L.has(g.fighters[0],t.to));
 const restored=game();restored.loadSnapshot(g.snapshot());A.deepEqual(restored.fighters[0].legacy,g.fighters[0].legacy);A.equal(restored.random.state,g.random.state);
});
test('draft previews leave run, inventory and RNG unchanged and honor reward guarantees',()=>{
 const g=game(['contract','coin']),f=g.fighters[0],before=JSON.stringify(g.snapshot());
 for(const [reward,rarity]of [['mini','rare'],['boss','legendary']]){const d=L.previewDraft(f,{seed:18,rarity:'common',reward});A(d.cards.some(id=>L.catalog[id].rarity===rarity));if(reward==='mini')A.equal(d.choices,2);}
 A.equal(JSON.stringify(g.snapshot()),before);A.deepEqual(L.previewDraft(f,{seed:0}),L.previewDraft(f,{seed:0}));
});
test('administrator equips live while ordinary player remains restricted',()=>{
 const g=game(['sword','bow']);A(!L.applyEdit(g,{side:0,op:'equip',value:'sword',administrator:false}));A(edit(g,'equip','sword'));A.equal(L.weaponId(g.fighters[0]),'sword');A(edit(g,'equip','bow'));g.fighters[0].legacy.cd.weapon=3;A(edit(g,'ready','bow'));A.equal(L.status(g.fighters[0],'bow').remaining,0);
});
test('Path debug selects boss, twins, miniboss, arena and difficulty through normal encounter engine',()=>{
 const r=new P.Run({seed:5});L.add({legacy:r.inventory},'crystal');A(r.debugEncounter({level:33,boss:'twins',arena:'path_temple',difficulty:'impossible',seed:0}));const g=r.game();A.equal(g.fighters.length,3);A.equal(g.mapId,'path_temple');A.equal(g.difficulty,'impossible');A(L.has(g.fighters[0],'crystal'));r.checkpoint(g);const restored=P.Run.restore(r.serialize());A.equal(restored.game().pathEncounter.boss,'twins');
 A(r.debugEncounter({level:25,mini:'duelist',arena:'path_street'}));const m=r.game();A.equal(m.fighters.length,2);A.equal(m.fighters[1].kind,'duelist');A(m.fighters[1].elite);A(r.encounter.mini);A.equal(r.encounter.boss,null);
 const before=r.serialize();A(!r.debugEncounter({level:51}));A.deepEqual(r.serialize(),before);
});
test('seed, AI difficulty and item operations reproduce across remote snapshot',()=>{
 const a=game(['fireball','hound']),b=game();b.loadSnapshot(L.restoreLocalBindings(b,L.networkSnapshot(a.snapshot())));for(const [op,value]of [['seed',0],['difficulty','hard'],['despawn','hound'],['spawn','hound'],['consume','fireball'],['restore','fireball'],['randomize',{count:4,rarity:'rare'}]]){A(edit(a,op,value));A(edit(b,op,value));}
 A.deepEqual(L.networkSnapshot(a.snapshot()),L.networkSnapshot(b.snapshot()));
});
console.log(count+' V8 admin/laboratory groups passed');
