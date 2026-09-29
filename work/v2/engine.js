(function(root){
'use strict';
const C=Object.freeze({width:1280,height:720,ground:560,speed:158,startup:.22,active:.13,recovery:.38,parry:.16,parryRecovery:.40,parryCooldown:.62,dash:.14,dashCooldown:.85,dashSpeed:640,stun:.50,clash:.19,roundPause:1.08,radius:16,bladeWidth:2.5,winningScore:5});
const CLASSES=Object.freeze({
knight:Object.freeze({name:'Cavaleiro',weapon:'Espada',description:'Equilíbrio entre alcance, ritmo e defesa.',speed:158,startup:.22,active:.13,recovery:.38,parry:.16,parryRecovery:.40,parryCooldown:.62,dash:.14,dashCooldown:.85,dashSpeed:640,reach:145,minRange:40}),
lancer:Object.freeze({name:'Lanceiro',weapon:'Lança',description:'A ponta domina a distância. De perto, recue e recupere espaço.',speed:146,startup:.28,active:.14,recovery:.44,parry:.16,parryRecovery:.40,parryCooldown:.65,dash:.14,dashCooldown:.95,dashSpeed:590,reach:225,minRange:137}),
assassin:Object.freeze({name:'Assassino',weapon:'Adaga',description:'Ágil e veloz, mas precisa atravessar o alcance inimigo.',speed:190,startup:.16,active:.11,recovery:.34,parry:.15,parryRecovery:.40,parryCooldown:.62,dash:.14,dashCooldown:.75,dashSpeed:715,reach:99,minRange:40})});
const DIFFICULTIES=Object.freeze({
easy:Object.freeze({name:'Fácil',description:'Reações lentas, mais hesitação e erros.',reactionMin:.28,reactionMax:.43,parryChance:.25,retreatChance:.24,punishChance:.35,attackChance:.35,decisionMin:.16,decisionMax:.27,cadenceMin:.85,cadenceMax:1.40}),
normal:Object.freeze({name:'Normal',description:'Duelos com reação humana, aproximações falsas e erros.',reactionMin:.155,reactionMax:.28,parryChance:.59,retreatChance:.26,punishChance:.73,attackChance:.57,decisionMin:.09,decisionMax:.18,cadenceMin:.50,cadenceMax:.99}),
adaptive:Object.freeze({name:'Adaptativo',description:'Aprende seus ataques, parries e recuos durante a partida.',reactionMin:.15,reactionMax:.27,parryChance:.55,retreatChance:.25,punishChance:.68,attackChance:.53,decisionMin:.085,decisionMax:.18,cadenceMin:.50,cadenceMax:.99}),
impossible:Object.freeze({name:'Impossível',description:'Reflexos sobrenaturais; mesmas armas, alcance e vulnerabilidade.',reactionMin:0,reactionMax:.012,parryChance:1,retreatChance:1,punishChance:1,attackChance:.88,decisionMin:.008,decisionMax:.018,cadenceMin:.25,cadenceMax:.45})});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
const stats=f=>CLASSES[typeof f==='string'?f:f.kind]||CLASSES.knight;
function pointSegment(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy,t=l?clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/l,0,1):0;return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);}
function segmentDistance(a,b,c,d){const cross=(p,q,r)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x),v1=cross(a,b,c),v2=cross(a,b,d),v3=cross(c,d,a),v4=cross(c,d,b);if(((v1>0&&v2<0)||(v1<0&&v2>0))&&((v3>0&&v4<0)||(v3<0&&v4>0)))return 0;return Math.min(pointSegment(a,c,d),pointSegment(b,c,d),pointSegment(c,a,b),pointSegment(d,a,b));}
function blade(f){
 const kind=f.kind||'knight',p=clamp(f.stateTime/Math.max(.001,f.duration),0,1);let angle=-.35,handX=22,handY=485,start=13,end=112,shaft;
 if(kind==='lancer'){
  angle=-.09;handX=12;handY=483;start=128;end=167;
  if(f.state==='startup'){handX=lerp(12,-13,p);angle=lerp(-.09,-.015,p);}
  else if(f.state==='active'){handX=lerp(-13,40,Math.sin(p*Math.PI*.5));angle=-.015;}
  else if(f.state==='recovery'){handX=lerp(40,12,p*p);angle=lerp(-.015,-.09,p);}
  else if(f.state==='parry'){handX=20;handY=506;angle=-1.27;start=106;end=145;}
  else if(f.state==='parryRecovery'){angle=lerp(-1.27,-.09,p);handY=lerp(506,483,p);}
  else if(f.state==='stunned'){handX=-5;angle=-.50;}
  else if(f.state==='clash'){handX=8;angle=lerp(-.50,-.09,p);}
  else if(f.state==='dash'){handX=8;handY=490;angle=-.03;}
  shaft=true;
 }else{
  if(kind==='assassin'){start=10;end=62;handY=491;angle=-.25;}
  if(f.state==='startup'){angle=lerp(-.35,-1.48,Math.min(1,p*1.7));handY=lerp(485,474,p);}
  else if(f.state==='active'){angle=lerp(-1.48,.92,p);handY=lerp(474,490,p);}
  else if(f.state==='recovery'){angle=lerp(.92,-.35,p*p);handY=lerp(490,485,p);}
  else if(f.state==='parry'){angle=-1.12;handX=30;handY=486;}
  else if(f.state==='parryRecovery'){angle=lerp(-1.12,-.35,p);}
  else if(f.state==='stunned'){angle=1.27;handX=12;handY=493;}
  else if(f.state==='clash'){angle=lerp(-1.25,-.35,p);}
  else if(f.state==='dash'){angle=-.14;handY=493;}
 }
 const hand={x:f.x+f.facing*handX,y:handY},at=n=>({x:hand.x+f.facing*Math.cos(angle)*n,y:hand.y+Math.sin(angle)*n}),result={hand,angle,a:at(start),b:at(end)};
 if(shaft){result.shaft={a:at(-48),b:at(start)};result.tip=result.b;}
 // The lance shaft can defend during parry, but never inflicts damage.
 result.guard={a:shaft?at(-22):result.a,b:result.b};return result;
}
function fighter(id,x,facing,kind){return{id,kind,x,y:C.ground,facing,state:'idle',stateTime:0,duration:0,dead:false,deathTime:0,move:0,vx:0,dashDir:facing,dashCooldown:0,parryCooldown:0,attackId:0,attackHit:false,lastWhiff:0};}
class Game{
 constructor(options={}){this.random=options.random||Math.random;this.mode='pve';this.difficulty='normal';this.characters=['knight','knight'];this.aiEnabled=true;this.configure(options);this.events=[];this.time=0;this.score=[0,0];this.round=1;this.phase='title';this.roundTimer=0;this.attackCounter=0;this.lastReason='';this.hitstop=0;this.resetLearning();this.resetFighters();}
 configure(options={}){if(['pve','local','online'].includes(options.mode))this.mode=options.mode;if(DIFFICULTIES[options.difficulty])this.difficulty=options.difficulty;if(Array.isArray(options.characters))this.characters=[0,1].map(i=>CLASSES[options.characters[i]]?options.characters[i]:'knight');this.aiEnabled=options.ai!==undefined?!!options.ai:this.mode==='pve';}
 resetLearning(){this.habits={attacks:0,parries:0,dashes:0,whiffs:0,retreatSeconds:0,closeSeconds:0,attackDistanceTotal:0};}
 emit(type,data={}){this.events.push({type,...data});}
 between(a,b){return a+(b-a)*this.random();}
 getAIPolicy(){
  const base=DIFFICULTIES[this.difficulty],policy={...base,baitChance:.15,pressure:0,learned:false};
  if(this.difficulty==='adaptive'){
   const h=this.habits,total=h.attacks+h.parries+h.dashes,confidence=clamp(total/12,0,1),attackRate=h.attacks/Math.max(1,total),parryRate=h.parries/Math.max(1,total);
   policy.parryChance=clamp(base.parryChance+confidence*(attackRate-.35)*.40,.42,.80);policy.baitChance=.15+confidence*parryRate*.52;policy.punishChance=clamp(base.punishChance+h.whiffs/Math.max(1,h.attacks)*confidence*.20,.68,.88);policy.pressure=clamp(h.retreatSeconds/Math.max(1,h.closeSeconds),0,1)*confidence;policy.attackChance=clamp(base.attackChance-parryRate*confidence*.20+policy.pressure*.10,.30,.65);policy.learned=total>=4;
  }return policy;
 }
 resetFighters(){this.fighters=[fighter(0,436,1,this.characters[0]),fighter(1,844,-1,this.characters[1])];const policy=this.getAIPolicy();this.ai={timer:this.between(.22,.45),intent:0,intentTime:0,noticedAttack:0,reaction:-1,answer:0,attackDelay:this.between(policy.cadenceMin,policy.cadenceMax),riposteDelay:this.difficulty==='impossible'?.01:.12,baitStage:0};}
 start(options){if(options)this.configure(options);this.score=[0,0];this.round=1;this.phase='playing';this.time=0;this.hitstop=0;this.roundTimer=0;this.attackCounter=0;this.lastReason='';this.events=[];this.resetLearning();this.resetFighters();this.emit('start');}
 setState(f,state,duration=0){f.state=state;f.stateTime=0;f.duration=duration;f.move=0;}
 canAct(f){return!!f&&!f.dead&&f.state==='idle'&&this.phase==='playing';}
 attack(id){const f=this.fighters[id];if(!this.canAct(f))return false;this.setState(f,'startup',stats(f).startup);f.attackId=++this.attackCounter;f.attackHit=false;if(id===0){this.habits.attacks++;this.habits.attackDistanceTotal+=Math.abs(f.x-this.fighters[1].x);}this.emit('windup',{id});return true;}
 parry(id){const f=this.fighters[id];if(!this.canAct(f)||f.parryCooldown>0)return false;this.setState(f,'parry',stats(f).parry);f.parryCooldown=stats(f).parryCooldown;if(id===0)this.habits.parries++;this.emit('guard',{id});return true;}
 dash(id,direction=0){const f=this.fighters[id];if(!this.canAct(f)||f.dashCooldown>0)return false;f.dashDir=Math.sign(direction)||f.facing;f.dashCooldown=stats(f).dashCooldown;this.setState(f,'dash',stats(f).dash);if(id===0)this.habits.dashes++;this.emit('dash',{id});return true;}
 tickFighter(f,dt){f.dashCooldown=Math.max(0,f.dashCooldown-dt);f.parryCooldown=Math.max(0,f.parryCooldown-dt);f.stateTime+=dt;if(f.dead){f.deathTime+=dt;f.vx=0;return;}if(f.duration>0&&f.stateTime>=f.duration){const old=f.state,s=stats(f);if(old==='startup'){this.setState(f,'active',s.active);this.emit('swing',{id:f.id});}else if(old==='active'){this.setState(f,'recovery',s.recovery);if(!f.attackHit){f.lastWhiff=this.time;if(f.id===0)this.habits.whiffs++;this.emit('whiff',{id:f.id});}}else if(old==='parry'){this.setState(f,'parryRecovery',s.parryRecovery);this.emit('parryMiss',{id:f.id});}else this.setState(f,'idle');}}
 attackRange(f,dist,margin=0){const s=stats(f);return dist>=s.minRange+margin&&dist<=s.reach-margin;}
 updateAI(dt){
  const p=this.fighters[0],e=this.fighters[1],ai=this.ai,s=stats(e),ps=stats(p),policy=this.getAIPolicy(),dist=Math.abs(p.x-e.x),toward=Math.sign(p.x-e.x)||-1,impossible=this.difficulty==='impossible';e.move=0;ai.timer-=dt;ai.intentTime-=dt;ai.attackDelay-=dt;
  const cadence=()=>{ai.attackDelay=this.between(policy.cadenceMin,policy.cadenceMax);},move=(direction,duration)=>{ai.intent=direction;ai.intentTime=duration;e.move=direction;};
  if(p.state==='stunned'&&p.stateTime>=ai.riposteDelay&&this.canAct(e)){if(this.attackRange(e,dist,3)){this.attack(1);cadence();return;}const dir=dist<s.minRange+3?-toward:toward;if(e.dashCooldown===0&&Math.abs(dist-(s.reach+s.minRange)/2)>60){this.dash(1,dir);return;}move(dir,.13);return;}
  if(p.state==='startup'&&p.attackId!==ai.noticedAttack){ai.noticedAttack=p.attackId;ai.reaction=this.between(policy.reactionMin,policy.reactionMax);ai.answer=this.random();}
  if(impossible&&this.canAct(e)&&(p.state==='startup'||p.state==='active')){
   // Explicit supernatural difficulty predicts imminent blade contact; weapon physics are unchanged.
   const probe={...p,state:'active',duration:ps.active},untilActive=p.state==='startup'?Math.max(0,p.duration-p.stateTime):0;let threatened=false;
   for(let t=0;t<=.035;t+=.005){if(t<untilActive)continue;probe.stateTime=p.state==='active'?p.stateTime+t:t-untilActive;if(probe.stateTime<=ps.active&&this.bodyContact(probe,e)){threatened=true;break;}}
   if(threatened){if(this.parry(1))return;if(e.dashCooldown===0){this.dash(1,-toward);return;}move(-toward,.14);}
  }else if(ai.reaction>=0){ai.reaction-=dt;if(ai.reaction<=0&&this.canAct(e)&&(p.state==='startup'||p.state==='active')&&dist<ps.reach+35&&dist>ps.minRange-20){if(ai.answer<policy.parryChance)this.parry(1);else if(ai.answer<policy.parryChance+policy.retreatChance){move(-toward,this.between(.15,.29));if(dist<ps.reach-15&&this.random()<.32)this.dash(1,-toward);}else if(ai.answer>.97&&this.attackRange(e,dist))this.attack(1);}}
  if(!this.canAct(e))return;if(ai.intentTime>0)e.move=ai.intent;if(ai.timer>0)return;ai.timer=this.between(policy.decisionMin,policy.decisionMax);
  const roll=this.random(),inRange=this.attackRange(e,dist,4),punishDelay=impossible?0:this.difficulty==='easy'?.22:.11;
  if((p.state==='recovery'||p.state==='parryRecovery')&&p.stateTime>=punishDelay&&ai.attackDelay<=0&&roll<policy.punishChance){if(inRange){this.attack(1);cadence();return;}if(dist<s.reach+65){const dir=dist<s.minRange?-toward:toward;move(dir,.18);if(e.dashCooldown===0&&dist>s.reach+25)this.dash(1,dir);return;}}
  if(p.state==='parry'&&roll<(impossible?1:.84)){move(0,.18);return;}
  if(dist<s.minRange+7){move(-toward,.18);if(e.kind==='lancer'&&e.dashCooldown===0&&roll<.55)this.dash(1,-toward);return;}
  if(inRange&&ai.attackDelay<=0&&roll<policy.attackChance&&(p.state==='idle'||p.state==='dash'||!impossible)){this.attack(1);cadence();return;}
  if(ai.intentTime>0)return;const ideal=s.reach-15;
  if(ai.baitStage===1){ai.baitStage=0;move(-toward,this.between(.12,.24));}
  else if(dist>s.reach+35)move(toward,this.between(.22,.39));
  else if(roll<policy.baitChance&&dist>ideal-18){ai.baitStage=1;move(toward,this.between(.10,.17));}
  else if(dist<ideal-35&&roll<.75)move(-toward,this.between(.12,.24));
  else if(roll<.28-policy.pressure*.15)move(-toward,this.between(.13,.25));
  else if(roll<.75+policy.pressure*.18)move(toward,this.between(.14,.26));
  else move(0,this.between(.14,.28));
 }
 bodyContact(attacker,defender){const b=blade(attacker);return segmentDistance(b.a,b.b,{x:defender.x,y:446},{x:defender.x,y:523})<=C.radius+C.bladeWidth;}
 resolveCombat(){const[p,e]=this.fighters;if(p.dead||e.dead)return;const pa=p.state==='active',ea=e.state==='active';if(!pa&&!ea)return;const pb=blade(p),eb=blade(e);
  if(pa&&ea&&segmentDistance(pb.a,pb.b,eb.a,eb.b)<=C.bladeWidth*2){p.attackHit=e.attackHit=true;this.setState(p,'clash',C.clash);this.setState(e,'clash',C.clash);p.x-=p.facing*5;e.x-=e.facing*5;this.hitstop=.065;this.emit('clash',{x:(pb.b.x+eb.b.x)/2,y:(pb.b.y+eb.b.y)/2});return;}
  const hits=[];for(const[a,d]of[[p,e],[e,p]]){if(a.state!=='active'||a.attackHit)continue;const ab=blade(a),db=blade(d),body=this.bodyContact(a,d),guard=d.state==='parry'&&(a.x-d.x)*d.facing>0,guardTouch=guard&&segmentDistance(ab.a,ab.b,db.guard.a,db.guard.b)<=C.bladeWidth*2;
   if(guard&&(body||guardTouch)){a.attackHit=true;this.setState(a,'stunned',C.stun);this.setState(d,'idle');if(d.id===1)this.ai.riposteDelay=this.difficulty==='impossible'?.008:this.between(.085,.15);this.hitstop=.08;this.emit('parry',{id:d.id,x:(ab.b.x+db.guard.a.x)/2,y:478});return;}if(body)hits.push([a,d]);}
  if(hits.length===2){this.defeat(p,e,true);return;}if(hits.length===1)this.defeat(hits[0][1],hits[0][0],false);
 }
 defeat(loser,winner,trade=false){const prior=loser.state;loser.dead=true;loser.deathTime=0;this.setState(loser,'dead');winner.attackHit=true;if(trade){winner.dead=true;winner.deathTime=0;this.setState(winner,'dead');}else this.score[winner.id]++;
  this.lastReason=trade?'Troca simultânea. Nenhum ponto.':prior==='parryRecovery'?'Parry cedo demais. A guarda já estava aberta.':prior==='recovery'?'Golpe no vazio. A recuperação abriu a guarda.':prior==='stunned'?'Parry confirmado. O contra-ataque encontrou a abertura.':prior==='dash'?'O dash cruzou a lâmina. Não há invencibilidade.':prior==='startup'?'O golpe chegou durante a preparação.':'A lâmina alcançou o corpo. Distância decidida.';this.phase='roundEnd';this.roundTimer=C.roundPause;this.hitstop=.115;this.emit('kill',{id:loser.id,winner:winner.id,trade,x:loser.x,y:481,reason:this.lastReason});
 }
 snapshot(){return{version:2,mode:this.mode,difficulty:this.difficulty,characters:[...this.characters],aiEnabled:this.aiEnabled,time:this.time,score:[...this.score],round:this.round,phase:this.phase,roundTimer:this.roundTimer,attackCounter:this.attackCounter,lastReason:this.lastReason,hitstop:this.hitstop,fighters:this.fighters.map(f=>({...f})),events:this.events.map(e=>({...e}))};}
 loadSnapshot(snapshot){if(!snapshot||snapshot.version!==2||!Array.isArray(snapshot.fighters)||snapshot.fighters.length!==2)return false;this.mode=snapshot.mode;this.difficulty=snapshot.difficulty;this.characters=[...snapshot.characters];this.aiEnabled=!!snapshot.aiEnabled;for(const key of['time','round','phase','roundTimer','attackCounter','lastReason','hitstop'])this[key]=snapshot[key];this.score=[...snapshot.score];this.fighters=snapshot.fighters.map(f=>({...f}));this.events=(snapshot.events||[]).map(e=>({...e}));return true;}
 applyInput(id,input={}){const f=this.fighters[id];f.move=clamp(Number(input.move)||0,-1,1);if(input.attack)this.attack(id);else if(input.parry)this.parry(id);else if(input.dash)this.dash(id,input.move);}
 step(dt,input={}){if(!Number.isFinite(dt)||dt<=0)return;dt=Math.min(dt,.025);if(this.phase==='title'||this.phase==='matchEnd')return;if(this.hitstop>0){this.hitstop=Math.max(0,this.hitstop-dt);return;}this.time+=dt;
  if(this.phase==='roundEnd'){for(const f of this.fighters)if(f.dead)f.deathTime+=dt;this.roundTimer-=dt;if(this.roundTimer<=0){if(Math.max(...this.score)>=C.winningScore){this.phase='matchEnd';this.emit('matchEnd',{winner:this.score[0]>=C.winningScore?0:1});}else{this.round++;this.resetFighters();this.phase='playing';this.emit('round',{round:this.round});}}return;}
  for(const f of this.fighters)this.tickFighter(f,dt);const[p,e]=this.fighters;for(const f of this.fighters)if(f.state==='idle')f.facing=Math.sign(this.fighters[1-f.id].x-f.x)||f.facing;const inputs=Array.isArray(input)?input:[input,{move:input.enemyMove||0}];this.applyInput(0,inputs[0]||{});if(this.aiEnabled)this.updateAI(dt);else this.applyInput(1,inputs[1]||{});
  const distance=Math.abs(p.x-e.x);if(distance<stats(p).reach+110){this.habits.closeSeconds+=dt;if(p.move*p.facing<0)this.habits.retreatSeconds+=dt;}
  for(const f of this.fighters){const s=stats(f),scale=f.state==='idle'?1:f.state==='startup'?.15:f.state==='recovery'?.24:0,retreat=f.move*f.facing<0?.88:1;f.vx=f.state==='dash'?f.dashDir*s.dashSpeed:f.move*s.speed*scale*retreat;f.x=clamp(f.x+f.vx*dt,95,1185);}
  if(e.x-p.x<40){const mid=clamp((p.x+e.x)/2,115,1165);p.x=mid-20;e.x=mid+20;}this.resolveCombat();
 }
}
root.DuelCore={C,CLASSES,DIFFICULTIES,Game,blade,stats,segmentDistance,clamp,lerp};if(typeof module!=='undefined'&&module.exports)module.exports=root.DuelCore;
})(typeof globalThis!=='undefined'?globalThis:window);
