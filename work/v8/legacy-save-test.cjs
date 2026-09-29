const A=require('node:assert/strict');require('./bootstrap.cjs');const D=global.DuelCore,L=global.DuelLegacy,P=global.DuelPath;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function store(){const m=new Map();return new P.Saves({getItem:k=>m.get(k),setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)});}
test('reloading a boss reward preserves scene, cards, seed, progress and entry build',()=>{
 const r=new P.Run({seed:88});r.level=10;L.add({legacy:r.inventory},'crystal');const g=r.game();g.score=[3,0];g.phase='matchEnd';g.fighters[0].x=333;r.reward(g);A.equal(r.phase,'draft');const restored=P.Run.restore(r.serialize()),before=restored.serialize(),scene=restored.resumeDraftGame();A.equal(scene.mapId,g.mapId);A.equal(scene.fighters[0].x,333);A.deepEqual(scene.score,[3,0]);A.deepEqual(restored.serialize(),before);A.deepEqual(restored.draft.cards,r.draft.cards);A.equal(scene.pathEncounter.boss,r.encounter.boss);
 restored.pick(restored.draft.cards[0]);A.equal(restored.level,11);A.equal(restored.gameSave,null);A.equal(restored.game().score[0],0);
});
test('older V8 reward saves reconstruct their original arena and keep draft immutable',()=>{
 const r=new P.Run({seed:37});r.level=25;const g=r.game();g.score=[3,0];r.reward(g);r.gameSave=null;const restored=P.Run.restore(r.serialize()),before=restored.serialize(),scene=restored.resumeDraftGame();A.equal(scene.mapId,'path_temple');A(scene.pathEncounter.mini);A.equal(scene.phase,'matchEnd');A.deepEqual(restored.serialize(),before);
});
test('inventory checkpoint returns to safe round position, keeps edited build and spent match protections',()=>{
 const r=new P.Run({seed:6});const g=r.game();g.phase='playing';g.fighters[0].x=450;L.captureRound(g);const start=g.fighters[0].x;g.fighters[0].x=900;g.fighters[0].vy=-500;g.fighters[0].state='active';L.add(g.fighters[0],'crystal');L.add(g.fighters[0],'hound');g.fighters[0].legacy.used.match.crystal=true;g.fighters[0].legacy.effects.counter=.2;r.checkpoint(g);
 const restored=P.Run.restore(r.serialize()).game(),f=restored.fighters[0];A.equal(f.x,start);A.notEqual(f.state,'active');A(L.has(f,'crystal'));A(f.legacy.used.match.crystal);A(!f.legacy.effects.counter);A.equal(L.world(restored).entities.filter(e=>e.type==='hound').length,1);A(restored.legacyRoundStart);A(!restored.legacyRoundStart.legacyRoundStart);
});
test('continuation keeps round, score, local keybindings and enemy inventory edits',()=>{
 const r=new P.Run({seed:7});const g=r.game();g.round=3;g.score=[1,1];g.phase='playing';L.captureRound(g);L.add(g.fighters[0],'fireball');L.bind(g.fighters[0],'fireball','KeyZ');L.add(g.fighters[1],'hound');r.checkpoint(g);const restored=P.Run.restore(r.serialize()).game();A.equal(restored.round,3);A.deepEqual(restored.score,[1,1]);A.equal(restored.fighters[0].legacy.bindings.fireball,'KeyZ');A(L.has(restored.fighters[1],'hound'));
});
test('boss intro history persists across runs without granting items or permanent stats',()=>{
 const saves=store(),r=new P.Run({seed:4});r.seen=['ronin','first'];r.introCompleted='10:ronin';A(saves.write(r));A.deepEqual(saves.history().seen,['ronin','first']);A.equal(saves.read().introCompleted,'10:ronin');r.phase='lost';A(saves.write(r));A.equal(saves.read(),null);const next=new P.Run({...saves.history(),seed:5});A.deepEqual(next.seen,r.seen);A.deepEqual(next.inventory.items,[]);A.equal(next.level,1);A.equal(next.stats.kills,0);A.deepEqual(next.lastBosses,Object.values(r.bosses));
});
test('Crown second choice survives reload without duplicate reward or level advance',()=>{
 const r=new P.Run({seed:82});r.level=15;L.add({legacy:r.inventory},'crown');const g=r.game();g.score=[3,0];r.reward(g);r.pick(r.draft.cards[0]);r.draft={...r.draft,cards:[...r.steal],selected:0,picked:[],choices:1,stealing:true};const restored=P.Run.restore(r.serialize());restored.resumeDraftGame();A.equal(restored.level,15);A.equal(restored.phase,'draft');A(restored.stealPick(restored.draft.cards[0]));A.equal(restored.level,16);A.equal(restored.phase,'between');
});
test('ending a run invalidates continuation even if writing history hits storage quota',()=>{
 const memory=new Map(),saves=new P.Saves({getItem:k=>memory.get(k),setItem:(k,v)=>{if(k.endsWith('-last'))throw Error('quota');memory.set(k,v);},removeItem:k=>memory.delete(k)}),r=new P.Run({seed:1});A(saves.write(r));r.phase='lost';A(!saves.write(r));A.equal(saves.read(),null);
});
test('cooldown status follows actual weapon, consumption and transformations',()=>{
 const r=new P.Run({seed:9}),g=r.game(),f=g.fighters[0];L.add(f,'bow');f.legacy.cd.weapon=1.5;const bow=L.status(f,'bow');A.equal(bow.remaining,1.5);A.equal(bow.progress,.5);A(!bow.ready);L.add(f,'fireball');f.legacy.cd.fireball=2.7;A.equal(L.status(f,'fireball').progress,0);f.legacy.cd.fireball=0;A(L.status(f,'fireball').ready);f.legacy.consumed.push('fireball');A(!L.status(f,'fireball').ready);A.equal(L.status(f,'fireball').label,'CONSUMIDO');
 L.add(f,'sword');f.legacy.transforms.push({from:'sword',to:'yamato'});f.legacy.weapon='sword';f.legacy.effects.weaponAway=true;A(L.status(f,'yamato').away);
});
console.log(count+' V8 save/continuation groups passed');
