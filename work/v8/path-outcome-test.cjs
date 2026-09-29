const A=require('node:assert/strict');require('./bootstrap.cjs');
const D=global.DuelCore,L=global.DuelLegacy,P=global.DuelPath;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function group(){const run=new P.Run({seed:271,points:1});run.level=36;const game=run.game();game.aiEnabled=false;game.phase='playing';for(const f of game.fighters)f.legacy.items=[];return{run,game};}
test('three group eliminations count separately while the duel counts once',()=>{
 const {run,game:g}=group();for(const f of g.fighters.slice(1))g.lethal(g.fighters[0],f,'audit');
 A.deepEqual(g.pathStats,{kills:3,deaths:0,duels:1});A.deepEqual(g.score,[1,0]);
 g.finish(0,'duplicate');g.lethal(g.fighters[0],g.fighters[1],'duplicate');A.equal(g.pathStats.duels,1);A.equal(g.pathStats.kills,3);
 g.phase='matchEnd';run.reward(g);A.equal(run.stats.kills,3);A.equal(run.stats.duels,1);run.reward(g);A.equal(run.stats.kills,3);
});
test('snapshot continuation retains completed duels and does not duplicate deaths',()=>{
 const {game:g}=group();g.rules.winningScore=g.baseRules.winningScore=3;
 g.lethal(g.fighters[2],g.fighters[0],'audit');A.equal(g.pathStats.deaths,1);
 const h=new D.Game();A(h.loadSnapshot(g.snapshot()));A.deepEqual(h.pathStats,g.pathStats);
 h.setState(h.fighters[0],'dead');A.equal(h.pathStats.deaths,1);
 h.resetFighters(true);h.phase='playing';h.lethal(h.fighters[1],h.fighters[0],'again');A.equal(h.pathStats.deaths,2);A.equal(h.pathStats.duels,2);
});
test('second-chance rewind restores the statistics of the safe round',()=>{
 const {game:g}=group();L.add(g.fighters[0],'secondchance');L.captureRound(g);
 g.lethal(g.fighters[0],g.fighters[1],'audit');A.equal(g.pathStats.kills,1);
 g.lethal(g.fighters[2],g.fighters[0],'rewind');L.worldStep(g,0);
 A.equal(g.pathStats.kills,0);A.equal(g.pathStats.deaths,0);A.equal(g.pathStats.duels,0);A(g.fighters[0].legacy.used.match.secondchance);
});
test('encountered bosses are run-specific and survive save and retry',()=>{
 const run=new P.Run({seed:29,seen:['ronin']});run.level=10;run.bosses[10]='executioner';run.game();
 A.deepEqual(run.encountered,['executioner']);const restored=P.Run.restore(run.serialize());restored.game();A.deepEqual(restored.encountered,['executioner']);
 restored.phase='lost';A(restored.retry());restored.game();A.deepEqual(restored.encountered,['executioner']);
});
test('local records count terminal saves once and keep the best winning time',()=>{
 const memory=new Map(),saves=new P.Saves({getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)});
 const r=new P.Run({seed:31,id:'first'});r.level=19;r.phase='lost';A(saves.write(r));A(saves.write(r));
 A.equal(saves.history().records.bestLevel,19);A.equal(saves.history().records.wins,0);A.equal(saves.history().records.bestTime,null);
 r.phase='won';r.level=50;r.stats.time=450;A(saves.write(r));A(saves.write(r));A.equal(saves.history().records.wins,1);
 const next=new P.Run({seed:32,id:'second'});next.phase='won';next.level=50;next.stats.time=600;A(saves.write(next));
 A.equal(saves.history().records.wins,2);A.equal(saves.history().records.bestTime,450);A.equal(saves.read(),null);
 const third=new P.Run({seed:33,id:'third'});third.phase='won';third.level=50;third.stats.time=400;saves.write(third);A.equal(saves.history().records.bestTime,400);
});
test('late rewards exclude relics with no future miniboss and preserve the legendary floor',()=>{
 for(const id of ['crown','contract']){A(L.eligible(id,{mode:'path',level:44,futureDraft:true}));A(!L.eligible(id,{mode:'path',level:45,futureDraft:true}));A(!L.eligible(id,{mode:'path',futureDraft:false}));}
 for(let seed=0;seed<150;seed++){const draft=L.draft({}, {mode:'path',level:49,reward:'last',futureDraft:false},L.rng(seed));A(!draft.cards.some(id=>['crown','contract','coin','clover','magnet','markedcard','destinyorb'].includes(id)));A(draft.cards.some(id=>L.catalog[id].rarity==='legendary'));}
});
test('Crown does not ask for a duplicate when the normal choice grants the last stealable item',()=>{
 const run=new P.Run({seed:42});run.level=5;L.add({legacy:run.inventory},'crown');const g=run.game();g.score=[3,0];run.reward(g);const item=run.steal[0];run.draft.cards[0]=item;
 A(run.pick(item));A.equal(run.phase,'between');A.equal(run.level,6);A.equal(run.inventory.items.filter(id=>id===item).length,1);
});
console.log(count+' V8 Path outcome audit groups passed');
