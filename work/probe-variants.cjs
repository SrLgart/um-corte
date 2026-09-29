'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');const src=fs.readFileSync(path.join(__dirname,'engine.js'),'utf8');const DT=1/600;
function rng(seed){return()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296}}
for(const variant of [{parry:.55,reaction:'.155+this.random()*.13'},{parry:.65,reaction:'.155+this.random()*.13'},{parry:.6,reaction:'.165+this.random()*.075'},{parry:.65,reaction:'.165+this.random()*.075'}]){
 let source=src.replace("const roll=this.random();","const roll=this.random();\n      if(p.state==='stunned'&&p.stateTime>.12&&dist<150){this.attack(1);ai.attackDelay=.55;return;}");
 source=source.replace('ai.answer<.45','ai.answer<'+variant.parry).replace('.155+this.random()*.13',variant.reaction);
 const context={module:{exports:{}},console};vm.runInNewContext(source,context);const Game=context.module.exports.Game;
 let wins=0,losses=0,player=0,enemy=0,parries=0;
 for(let seed=1;seed<=24;seed++){
  const g=new Game({random:rng(seed)});g.start();let elapsed=0;
  while(g.phase!=='matchEnd'&&elapsed<120){const d=g.fighters[1].x-g.fighters[0].x,input={move:d>118?1:0,attack:d<132};for(let k=0;k<10;k++){g.step(DT,input);elapsed+=DT;for(const event of g.events)if(event.type==='parry'&&event.id===1)parries++;g.events=[];}}
  player+=g.score[0];enemy+=g.score[1];if(g.score[0]===5)wins++;else losses++;
 }
 console.log(JSON.stringify({...variant,wins,losses,player,enemy,roundWinRate:player/(player+enemy),parries}));
}
