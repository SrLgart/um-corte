const A=require('node:assert/strict');require('./bootstrap.cjs');
const D=DuelCore,L=DuelLegacy,P=DuelPath;
// Full progression, not a balance test: enemy protection is removed before
// resolving fatal hits. Real match scoring, rewards, saves and restores run.
for(const seed of [1,19,58,113,272,441,701,2026]){
 const memory=new Map(),saves=new P.Saves({getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)});
 let run=new P.Run({seed,points:3}),expectedKills=0,offers=0;
 for(let level=1;level<=50;level++){
  A.equal(run.level,level);A.equal(run.phase,'between');A(saves.write(run));run=saves.read();
  let g=run.game();g.aiEnabled=false;
  const opponents=g.fighters.length-1;expectedKills+=opponents*3;
  for(let round=0;round<3;round++){
   g.phase='playing';g.entryRemaining=0;
   for(const f of g.fighters.slice(1)){f.legacy.items=[];f.legacy.effects={};}
   L.world(g).entities=[];
   for(const f of g.fighters.slice(1))A(g.lethal(g.fighters[0],f,'progression fixture'));
   A.equal(g.score[0],round+1);A.equal(g.score[1],0);
   if(round<2){g.resetFighters(true);run.checkpoint(g);A(saves.write(run));run=saves.read();g=run.game();g.aiEnabled=false;}
  }
  g.phase='matchEnd';g.runTime=10;run.reward(g);A(saves.write(run));
  if(level===50){A.equal(run.phase,'won');A.equal(saves.read(),null);break;}
  run=saves.read();
  if(run.phase==='draft'){
   offers++;A(level<=20||level%5===0||level===49,'unexpected normal reward after 20');
   const d=run.draft;
   if(level%10===0||level===49)A(d.cards.some(id=>L.catalog[id].rarity==='legendary'));
   let choices=0;
   while(run.phase==='draft'){
    A(++choices<=5,'draft did not advance');
    const before=L.clone(run.inventory.items),draft=run.draft;
    if(draft.picked?.length>=draft.choices&&run.steal?.length)A(run.stealPick(run.steal[0]));
    else{const ids=draft.cards.filter(id=>!draft.picked?.includes(id)),pick=ids.find(id=>['crown','contract'].includes(id))||ids[0];A(run.pick(pick));}
    A(before.every(id=>run.inventory.items.includes(id)));A.equal(new Set(run.inventory.items).size,run.inventory.items.length);
    A(saves.write(run));run=saves.read();
   }
  }
 }
 A.equal(offers,26);A.equal(run.stats.duels,150);A.equal(run.stats.kills,expectedKills);A.equal(run.stats.deaths,0);A.equal(run.stats.time,500);A.equal(run.defeated.length,5);A.equal(new Set(run.defeated).size,5);A(run.defeated.includes('first'));A.equal(saves.history().records.wins,1);
 console.log('PASS full run',seed,{kills:expectedKills,duels:run.stats.duels,legacies:run.inventory.items.length,offers});
}
console.log('8 complete 50-level runs with match scoring, all rewards, checkpoint reloads and terminal records passed');
