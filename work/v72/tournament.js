(function(root){
'use strict';
const D=typeof module!=='undefined'?require('./engine.js'):DuelCore;
const names=['Akio','Nara','Ren','Sora','Kaede','Rin','Haru','Yuna','Iori','Aki','Tao','Mei','Ryo','Kira','Nao','Jin','Lian','Rei','Mika','Enzo','Aya','Kai','Yori','Tori','Hana','Rui','Yuki','Asha','Noa','Raiden','Koa'];
class DuelTournament{
 constructor(options={}){
  this.stages=Math.max(1,Math.min(5,Math.floor(options.stages||3)));
  this.seed=(options.seed??Math.floor(Math.random()*0xffffffff))>>>0||1;
  this.rules=D.cleanRules(options.rules);this.difficulty=D.DIFFICULTIES[options.difficulty]?options.difficulty:'normal';
  this.mapMode=['choose','fixed','random'].includes(options.mapMode)?options.mapMode:'choose';
  this.maps=(options.maps||Object.keys(D.MAPS)).filter(id=>D.MAPS[id]);if(!this.maps.length)this.maps=['dojo'];
  this.fixedMap=this.maps.includes(options.mapId)?options.mapId:this.maps[0];
  if(options.mapId==='random'&&this.mapMode==='fixed')this.mapMode='random';
  this.mapBag=[];this.lastMap=null;this.mapHistory=[];this.stage=0;this.finished=false;this.matches=[];this.pending=null;this.started=false;
  const kinds=Object.keys(D.CLASSES),colors=Object.keys(D.COLORS),chosen=options.player||{},kind=D.CLASSES[chosen.kind]?chosen.kind:kinds[this.pick(kinds.length)];
  this.player=Object.freeze({kind,skin:D.cleanSkin(kind,chosen.skin),color:D.COLORS[chosen.color]?chosen.color:'jade'});
  this.players=Array.from({length:2**this.stages},(_,id)=>({id,name:id?names[id-1]:'VOCÊ',kind:id?kinds[this.pick(kinds.length)]:kind,skin:id?'default':this.player.skin,color:id?colors.filter(c=>c!==this.player.color)[this.pick(colors.length-1)]:this.player.color,wins:0,roundsFor:0,roundsAgainst:0,eliminated:-1,tie:this.random()}));
  this.active=this.players.map(p=>p.id);this.prepare();
 }
 random(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
 pick(n){return Math.min(n-1,Math.floor(this.random()*n));}
 stageName(stage=this.stage){const left=this.stages-stage;return left===1?'FINAL':left===2?'SEMIFINAL':left===3?'QUARTAS DE FINAL':left===4?'OITAVAS DE FINAL':'FASE DOS 32';}
 decide(a,b,score){const winner=score[0]>score[1]?a:b,loser=winner===a?b:a;this.players[a].roundsFor+=score[0];this.players[a].roundsAgainst+=score[1];this.players[b].roundsFor+=score[1];this.players[b].roundsAgainst+=score[0];this.players[winner].wins++;this.players[loser].eliminated=this.stage;const result={stage:this.stage,a,b,score:[...score],winner,simulated:a!==0&&b!==0};this.matches.push(result);return winner;}
 botMatch(a,b){const target=this.rules.winningScore,loss=this.pick(target),score=this.random()<.5?[target,loss]:[loss,target];return this.decide(a,b,score);}
 prepare(){this.next=[];this.pending=null;for(let i=0;i<this.active.length;i+=2){const a=this.active[i],b=this.active[i+1];if(a===0||b===0){this.pending={a,b,opponent:a===0?b:a,slot:this.next.length};this.next.push(null);}else this.next.push(this.botMatch(a,b));}}
 begin(mapId){if(this.finished||!this.pending||this.started)throw Error('Não há uma partida aguardando início.');let arena;
  if(this.mapMode==='fixed')arena=this.fixedMap;
  else if(this.mapMode==='random'){if(!this.mapBag.length){this.mapBag=[...this.maps];for(let i=this.mapBag.length-1;i>0;i--){const j=this.pick(i+1);[this.mapBag[i],this.mapBag[j]]=[this.mapBag[j],this.mapBag[i]];}if(this.mapBag.length>1&&this.mapBag.at(-1)===this.lastMap)[this.mapBag[0],this.mapBag[this.mapBag.length-1]]=[this.mapBag.at(-1),this.mapBag[0]];}arena=this.mapBag.pop();}
  else arena=this.maps.includes(mapId)?mapId:this.fixedMap;
  this.lastMap=arena;this.mapHistory.push(arena);this.started=true;return arena;
 }
 complete(playerScore,enemyScore){if(this.finished||!this.pending||!this.started)throw Error('Partida já registrada ou não iniciada.');if(![playerScore,enemyScore].every(n=>Number.isSafeInteger(n)&&n>=0)||playerScore===enemyScore)throw Error('Resultado inválido.');
  const {a,b,slot}=this.pending,score=a===0?[playerScore,enemyScore]:[enemyScore,playerScore],winner=this.decide(a,b,score);this.next[slot]=winner;this.active=this.next;this.pending=null;this.started=false;this.stage++;
  if(winner!==0){while(this.active.length>1){const next=[];for(let i=0;i<this.active.length;i+=2)next.push(this.botMatch(this.active[i],this.active[i+1]));this.active=next;this.stage++;}}
  if(this.active.length===1){this.finished=true;this.champion=this.active[0];this.players[this.champion].eliminated=this.stages;}
  else this.prepare();return this.finished;
 }
 standings(){if(!this.finished)return[];return [...this.players].sort((a,b)=>b.eliminated-a.eliminated||b.wins-a.wins||(b.roundsFor-b.roundsAgainst)-(a.roundsFor-a.roundsAgainst)||b.roundsFor-a.roundsFor||a.tie-b.tie||a.id-b.id).map((p,i)=>({...p,rank:i+1,phase:p.id===this.champion?'CAMPEÃO':this.stageName(p.eliminated)}));}
 snapshot(){return{stages:this.stages,stage:this.stage,finished:this.finished,started:this.started,difficulty:this.difficulty,mapMode:this.mapMode,mapHistory:[...this.mapHistory],player:{...this.player},pending:this.pending?{...this.pending}:null,players:this.players.map(p=>({...p})),matches:this.matches.map(m=>({...m,score:[...m.score]})),standings:this.standings()};}
}
if(typeof module!=='undefined')module.exports=DuelTournament;root.DuelTournament=DuelTournament;
})(typeof globalThis!=='undefined'?globalThis:this);
