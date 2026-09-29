const {Game}=require('./engine.js');
function seed(s){return()=>{s=(Math.imul(1664525,s)+1013904223)>>>0;return s/4294967296;}}
for(const difficulty of ['easy','normal','adaptive','impossible']){
 let wins=0,losses=0,unfinished=0;
 for(let n=1;n<=40;n++){
  const g=new Game({mode:'pve',difficulty,random:seed(n)});g.start();
  for(let i=0;i<600*25&&!g.score[0]&&!g.score[1];i++){
   const d=g.fighters[1].x-g.fighters[0].x;
   g.step(1/600,[{move:d>112?1:0,attack:d<145&&i%120===0},{}]);
  }
  wins+=g.score[1];losses+=g.score[0];if(!g.score[0]&&!g.score[1])unfinished++;
 }
 console.log(difficulty,{AI:wins,bot:losses,unfinished});
}
