'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const filename=path.join(__dirname,'engine.js');
const original=fs.readFileSync(filename,'utf8');
const marker="const roll=this.random();";
const code=original.replace(marker,marker+"\n      if(p.state==='stunned'&&p.stateTime>.12&&dist<150){this.attack(1);ai.attackDelay=.55;return;}");
const context={module:{exports:{}},console};vm.runInNewContext(code,context,{filename:'engine-candidate-memory-only.js'});
const Game=context.module.exports.Game;const DT=1/600;
function rng(seed){return()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296}}
let wins=0,losses=0,player=0,enemy=0,parries=0;
for(let seed=1;seed<=24;seed++){
 const g=new Game({random:rng(seed)});g.start();let elapsed=0;
 while(g.phase!=='matchEnd'&&elapsed<120){
  const d=g.fighters[1].x-g.fighters[0].x,input={move:d>118?1:0,attack:d<132};
  for(let k=0;k<10;k++){g.step(DT,input);elapsed+=DT;for(const event of g.events)if(event.type==='parry'&&event.id===1)parries++;g.events=[];}
 }
 player+=g.score[0];enemy+=g.score[1];if(g.score[0]===5)wins++;else losses++;
}
console.log(JSON.stringify({variant:'memory-only counter after parry at p.stunTime>.12 and dist<150',wins,losses,player,enemy,roundWinRate:player/(player+enemy),parries}));
