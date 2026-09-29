'use strict';
const { Game } = require('./engine.js');
const DT = 1/600, FRAME = 1/60;
function rng(seed) { return () => {seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;} }
const policies = {
  stationary: () => ({}),
  aggressive: (g) => {
    const [p,e]=g.fighters, d=e.x-p.x;
    return {move:d>118?1:0, attack:d<132};
  },
  earlyParry: (g) => {
    const [p,e]=g.fighters, d=e.x-p.x;
    return {move:d>145?1:0,parry:e.state==='startup'&&d<175,attack:e.state==='stunned'&&d<150};
  },
  timedParry: (g) => {
    const [p,e]=g.fighters, d=e.x-p.x;
    return {move:d>145?1:0,parry:e.state==='startup'&&e.stateTime>=.15&&d<170,attack:e.state==='stunned'&&d<150};
  },
  baitAndPunish: (g, mem) => {
    const [p,e]=g.fighters, d=e.x-p.x;
    if(mem.round!==g.round){mem.round=g.round;mem.punish=false;}
    if(e.state==='startup'||e.state==='active')return {move:d<164?-1:0};
    if(e.state==='recovery') {
      mem.punish=true;
      if(d>145&&e.stateTime<.065)return {dash:true,move:1};
      return {move:d>126?1:0,attack:d<148};
    }
    if(mem.punish&&p.state==='idle'&&d<140){mem.punish=false;return {attack:true};}
    if(e.state==='stunned')return {attack:d<150,move:d>130?1:0};
    return {move:d>147?1:d<138?-1:0};
  }
};
const results={};
for(const [name,policy]of Object.entries(policies)){
 let matches=0,wins=0,losses=0,timeouts=0,playerPoints=0,enemyPoints=0,totalSeconds=0,playerAttacks=0,enemyParries=0,playerParries=0,clashes=0;
 const rows=[];
 for(let seed=1;seed<=24;seed++){
  const g=new Game({random:rng(seed)});g.start();const mem={};let elapsed=0;const tally={playerAttacks:0,enemyParries:0,playerParries:0,clashes:0};
  while(g.phase!=='matchEnd'&&elapsed<120){
   const input=policy(g,mem);
   for(let i=0;i<10;i++){
    g.step(DT,input);elapsed+=DT;
    for(const event of g.events){if(event.type==='windup'&&event.id===0)tally.playerAttacks++;if(event.type==='parry')tally[event.id===0?'playerParries':'enemyParries']++;if(event.type==='clash')tally.clashes++;}
    g.events=[];
   }
  }
  matches++;if(g.phase!=='matchEnd')timeouts++;else if(g.score[0]===5)wins++;else losses++;
  playerPoints+=g.score[0];enemyPoints+=g.score[1];totalSeconds+=elapsed;
  playerAttacks+=tally.playerAttacks;enemyParries+=tally.enemyParries;playerParries+=tally.playerParries;clashes+=tally.clashes;
  rows.push({seed,score:g.score,seconds:+elapsed.toFixed(2),phase:g.phase,...tally});
 }
 results[name]={summary:{matches,wins,losses,timeouts,playerPoints,enemyPoints,roundWinRate:+(playerPoints/(playerPoints+enemyPoints)).toFixed(3),meanSeconds:+(totalSeconds/matches).toFixed(2),playerAttacks,enemyParries,playerParries,clashes},rows};
 console.log(name,JSON.stringify(results[name].summary));
}
require('node:fs').writeFileSync(require('node:path').join(__dirname,'balance-results.json'),JSON.stringify(results,null,2));
