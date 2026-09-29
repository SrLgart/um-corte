const A=require('node:assert/strict');require('./bootstrap.cjs');const D=DuelCore,L=DuelLegacy;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(ids=[],other=[]){const g=new D.Game({mode:'local',ai:false,rules:{specials:false},random:L.rng(32)});g.start({legacies:[ids,other]});g.phase='playing';g.map.walls=[];g.map.platforms=[{x:0,y:700,w:g.map.width,baseX:0,baseY:700,stage:'solid',solid:true}];g.fighters.forEach((f,i)=>Object.assign(f,{x:500+i*180,y:700,grounded:true,platform:0,state:'idle',aim:i?Math.PI:0}));return g;}
test('Mirror failed copy retains memory and use; success consumes exactly once',()=>{
 const g=game(['brokenmirror']),f=g.fighters[0];f.legacy.copied='lightning';A(!L.activate(g,f,'brokenmirror',{aim:Math.PI}));A.equal(f.legacy.copied,'lightning');A(!f.legacy.used.match.brokenmirror);A(L.activate(g,f,'brokenmirror',{aim:0}));A(f.legacy.used.match.brokenmirror);A.equal(f.legacy.copied,null);A(!L.has(f,'lightning'));A(!L.activate(g,f,'brokenmirror'));
});
test('Mirror borrows a power without altering owned resources or transformed inventory',()=>{
 const g=game(['brokenmirror','fireball']),f=g.fighters[0],l=f.legacy;l.copied='fireball';l.cd.fireball=2;l.bindings.fireball='KeyQ';l.consumed.push('fireball');l.transforms.push({from:'fireball',to:'ice'});const saved=L.clone({items:l.items,transforms:l.transforms,consumed:l.consumed,bindings:l.bindings,cd:l.cd});A(L.activate(g,f,'brokenmirror'));for(const k of Object.keys(saved))A.deepEqual(l[k],saved[k]);A(L.world(g).entities.some(e=>e.type==='fireball'&&e.owner===0));
});
test('Mirror rejects recursive or unknown copies, survives rounds and clears on new match',()=>{
 const g=game(['brokenmirror']),f=g.fighters[0];for(const id of ['brokenmirror','bad','philosopher']){f.legacy.copied=id;A(!L.activate(g,f,'brokenmirror'));}f.legacy.copied='fireball';g.resetFighters(true);A.equal(g.fighters[0].legacy.copied,'fireball');g.start();A.equal(g.fighters[0].legacy.copied,null);
});
test('Only nearby unused Mirrors memorize successful supported abilities',()=>{
 const g=game(['brokenmirror'],['ice','fireball']),f=g.fighters[0],t=g.fighters[1];A(!L.activate(g,t,'ice',{aim:-Math.PI/2}));A(!f.legacy.copied);A(L.activate(g,t,'fireball'));A.equal(f.legacy.copied,'fireball');f.legacy.copied=null;f.legacy.used.match.brokenmirror=true;t.legacy.cd.fireball=0;L.activate(g,t,'fireball');A.equal(f.legacy.copied,null);
});
test('Swap blocked destination does not consume mark; retry teleports position only',()=>{
 const g=game(['swap']),f=g.fighters[0];A(L.activate(g,f,'swap'));f.x=850;f.legacy.cd.swap=0;f.vx=150;f.airJumps=0;f.dashCharges=0;g.map.walls=[{x:480,y:400,w:40,h:300}];A(!L.activate(g,f,'swap'));A.equal(f.x,850);A(f.legacy.mark);A.equal(f.legacy.cd.swap,0);g.map.walls=[];A(L.activate(g,f,'swap'));A.equal(f.x,500);A.equal(f.platform,-1);A.equal(f.vx,150);A.equal(f.airJumps,0);A.equal(f.dashCharges,0);A.equal(f.legacy.cd.swap,5);
});
test('Swap refuses moving platform through body and expired mark starts fresh',()=>{
 const g=game(['swap']),f=g.fighters[0];L.activate(g,f,'swap');f.x=850;f.legacy.cd.swap=0;g.map.platforms.push({x:400,y:665,w:200,stage:'solid'});A(!L.activate(g,f,'swap'));g.time=5;A(L.activate(g,f,'swap'));A.equal(f.legacy.mark.x,850);A.equal(f.x,850);
});
test('D20 extremes preserve boss floors and improve every card on 20',()=>{
 for(const roll of [1,20])for(const reward of ['normal','mini','boss','last']){const f=game(['d20','clover']).fighters[0];f.legacy.draftBoost=roll;const d=L.draft(f,{mode:'path',reward},L.rng(65),['legendary','rare','legendary','common']),q=d.cards.map(id=>L.catalog[id].rarity);A.equal(d.cards.length,4);A.equal(new Set(d.cards).size,4);A.equal(f.legacy.draftBoost,0);if(roll===20){A(q.includes('legendary'));A(q.every(x=>x!=='common'));}else{const good=q.filter(x=>x!=='common');A.equal(good.length,reward==='normal'?0:1);if(['boss','last'].includes(reward))A(q.includes('legendary'));}}
});
test('Marked card preserves actual boss guarantee and Magnet partner in every slot',()=>{
 for(let slot=0;slot<3;slot++){const f=game(['markedcard','magnet']).fighters[0];f.legacy.marked='broom';const pattern=['common','common','common'];pattern[slot]='legendary';const d=L.draft(f,{mode:'path',reward:'boss'},L.rng(22),pattern),q=d.cards.map(id=>L.catalog[id].rarity);A(d.cards.includes('broom'));A.equal(f.legacy.marked,null);A(q.includes('legendary'));A(q.filter(x=>x!=='common').length>=2);}
});
test('Marked common waits rather than spoiling exceptional D20; naturally drawn mark is consumed',()=>{
 const f=game(['markedcard']).fighters[0];f.legacy.marked='broom';f.legacy.draftBoost=20;const d=L.draft(f,{mode:'path'},L.rng(8));A(!d.cards.includes('broom'));A.equal(f.legacy.marked,'broom');const sample=L.draft({legacy:L.inventory()},{mode:'path'},L.rng(19));f.legacy.marked=sample.cards[0];const d2=L.draft(f,{mode:'path'},L.rng(19));A(d2.cards.includes(sample.cards[0]));A.equal(f.legacy.marked,null);
});
test('Chosen or now ineligible marked cards are safely cleared',()=>{
 const f=game(['markedcard']).fighters[0];f.legacy.marked='sword';L.add(f,'sword');A.equal(f.legacy.marked,null);for(const id of ['invalid','crown','sword']){f.legacy.marked=id;const d=L.draft(f,{mode:'local'},L.rng(5));A.equal(f.legacy.marked,null);A(!d.cards.includes(id));}
});
test('Orb rejected preview consumes only Orb; accepted preview commits draft resources',()=>{
 for(const accept of [false,true]){const f=game(['markedcard','destinyorb']).fighters[0],d={cards:['sword','axe','sandals'],ctx:{mode:'path'},pattern:['common','common','common']};f.legacy.marked='broom';const next=L.peekDraft(f,d,L.rng(88));A(next.cards.includes('broom'));A(f.legacy.used.run.destinyorb);A.equal(f.legacy.marked,'broom');A(!L.peekDraft(f,d,L.rng(88)));if(accept){L.acceptDraft(f,next);A.equal(f.legacy.marked,null);A(!next.resourceCommit);}A.deepEqual(d.cards,['sword','axe','sandals']);}
});
test('Orb cannot reopen partial Contract draft; pending preview survives serialization',()=>{
 const f=game(['destinyorb','coin','contract','markedcard']).fighters[0],d={cards:['sword'],picked:['sword'],ctx:{mode:'path',reward:'mini'}};A(!L.peekDraft(f,d,L.rng(1)));A(!L.reroll(f,d,L.rng(1)));A(!f.legacy.used.run.destinyorb);d.picked=[];f.legacy.marked='broom';const next=L.clone(L.peekDraft(f,d,L.rng(1)));A.equal(next.choices,2);L.acceptDraft(f,next);A.equal(f.legacy.marked,null);
});
console.log(count+' V8 resource transaction groups passed');
