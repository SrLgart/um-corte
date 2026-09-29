(function(root){
const D=typeof module!=='undefined'?require('./engine.js'):DuelCore,copy=o=>JSON.parse(JSON.stringify(o));
class DuelSession{
 constructor(){this.reset();}
 reset(){this.players=[0,1].map(()=>({...D.metricPlayer(),wins:0,streak:0,bestStreak:0}));this.baseline=null;this.match=null;this.winnerRecorded=false;}
 begin(game,key){const fresh=this.key!==key;if(fresh)this.reset();else this.sync(this.match);this.key=key;this.match=game;this.baseline=null;this.winnerRecorded=false;this.sync(game);return fresh;}
 sync(game=this.match){if(!game?.metrics||game.mode==='training')return;const old=this.baseline;game.metrics.players.forEach((m,i)=>{const p=this.players[i];for(const[k,v]of Object.entries(m)){if(k==='classes'){for(const[c,n]of Object.entries(v))p.classes[c]=(p.classes[c]||0)+Math.max(0,n-(old?.players[i].classes[c]||0));}else p[k]+=Math.max(0,v-(old?.players[i][k]||0));}});this.baseline=copy(game.metrics);if(game.metrics.winner!==null&&!this.winnerRecorded){const winner=game.metrics.winner;this.players[winner].wins++;this.players[winner].streak++;this.players[1-winner].streak=0;this.players[winner].bestStreak=Math.max(this.players[winner].bestStreak,this.players[winner].streak);this.winnerRecorded=true;}}
 clear(game){this.reset();this.match=game;this.baseline=game?.metrics?copy(game.metrics):null;this.winnerRecorded=game?.metrics?.winner!==null;}
 awards(){const definitions=[['whiffs',3,'MESTRE DO VENTO','cortes no ar'],['falls',1,'INIMIGO DO CHÃO','quedas'],['retreat',5,'COVARDE PROFISSIONAL','segundos recuando'],['dashDeaths',1,'SÓ MAIS UM DASH','mortes durante dash'],['parryMisses',3,'ISSO ERA PRA SER PARRY?','parries sem contato'],['attacks',10,'SEM MEDO DE ERRAR','ataques']];return definitions.map(([k,min,title,unit])=>{const values=this.players.map(p=>p[k]),n=Math.max(...values);return n>=min?{title,value:Math.round(n),unit,player:values[0]===values[1]?'OS DOIS':'JOGADOR '+(values[0]>values[1]?1:2),weight:n/min}:null;}).filter(Boolean).sort((a,b)=>b.weight-a.weight).slice(0,3);}
}
if(typeof module!=='undefined')module.exports=DuelSession;root.DuelSession=DuelSession;
})(typeof globalThis!=='undefined'?globalThis:this);
