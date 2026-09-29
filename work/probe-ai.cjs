const {Game}=require('./engine.js');
function rng(seed){return()=>{seed=(1664525*seed+1013904223)>>>0;return seed/2**32}}
for(const seed of [1,2,3,4,5,6,7,8,9,10]) {
 const game=new Game({random:rng(seed)}); game.start();
 let elapsed=0, attacks=0, parries=0, clashes=0;
 while(game.phase!=='matchEnd'&&elapsed<90){game.step(1/600);elapsed+=1/600;for(const e of game.events){if(e.type==='windup'&&e.id===1) attacks++;if(e.type==='parry')parries++;if(e.type==='clash')clashes++;}game.events=[];}
 console.log(JSON.stringify({seed,elapsed:+elapsed.toFixed(2),phase:game.phase,score:game.score,attacks,parries,clashes}));
}
