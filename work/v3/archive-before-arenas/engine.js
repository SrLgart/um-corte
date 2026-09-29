(function(root){
'use strict';
const C={width:1280,height:720,ground:610,radius:17,bladeWidth:3,winningScore:5,deathY:890,roundPause:1.05};
const CLASSES={
 knight:{name:'Cavaleiro',weapon:'Espada',description:'Equilíbrio. Cortes precisos e recuperação confiável.',speed:310,startup:.19,active:.12,recovery:.32,reach:142,minRange:30,length:112,sweep:2.1,dashSpeed:990},
 lancer:{name:'Lanceiro',weapon:'Lança',description:'Controle de distância. Só a ponta fere; aproxime-se para vencê-lo.',speed:290,startup:.23,active:.12,recovery:.39,reach:222,minRange:157,length:194,sweep:0,dashSpeed:930},
 assassin:{name:'Assassino',weapon:'Adaga',description:'Mobilidade e velocidade. Precisa entrar muito perto.',speed:360,startup:.14,active:.105,recovery:.25,reach:92,minRange:28,length:62,sweep:2.2,dashSpeed:1080},
 swordsman:{name:'Espadachim',weapon:'Espada longa',description:'Duas mãos, arco amplo. O alcance cobra comprometimento.',speed:300,startup:.245,active:.14,recovery:.40,reach:187,minRange:34,length:153,sweep:2.55,dashSpeed:970},
 reaper:{name:'Ceifador',weapon:'Foice',description:'A lâmina curva envolve o rival. Dentro do arco há uma abertura.',speed:305,startup:.24,active:.14,recovery:.40,reach:208,minRange:116,length:156,sweep:2.55,dashSpeed:975}
};
for(const s of Object.values(CLASSES))Object.assign(s,{parry:.15,parryRecovery:.4,parryCooldown:.55,dash:.14,dashRecovery:.075,dashCooldown:.80,stun:.49});
const COLORS={jade:{name:'Jade',hex:'#367f75'},coral:{name:'Coral',hex:'#b75640'},indigo:{name:'Índigo',hex:'#5a64a7'},gold:{name:'Ouro',hex:'#af842e'},plum:{name:'Ameixa',hex:'#995879'},ice:{name:'Gelo',hex:'#5796b4'}};
const RULES={gravity:{name:'Gravidade',min:.6,max:1.5,step:.1},jump:{name:'Força do pulo',min:.8,max:1.3,step:.1},speed:{name:'Velocidade',min:.7,max:1.4,step:.1},dashDistance:{name:'Distância do dash',min:.6,max:1.5,step:.1},dashRecovery:{name:'Recuperação do dash',min:.5,max:2,step:.1},dashCooldown:{name:'Cooldown do dash',min:.5,max:2,step:.1},parryWindow:{name:'Janela de parry',min:.7,max:1.5,step:.1},parryRecovery:{name:'Recuperação do parry',min:.5,max:1.5,step:.1},stun:{name:'Atordoamento após parry',min:.7,max:1.4,step:.1}};
const DEFAULT_RULES=Object.fromEntries([...Object.keys(RULES).map(k=>[k,1]),['airDash',false]]);
const MAPS={
 dojo:{name:'Dojo elevado',description:'Chão seguro. Duas plataformas para ataques por cima.',platforms:[{x:40,y:610,w:1200,solid:true},{x:220,y:405,w:270},{x:790,y:405,w:270}],spawns:[{x:385,y:610},{x:895,y:610}]},
 bridge:{name:'Ponte quebrada',description:'Distância, saltos e vãos fatais. Não recue sem olhar.',platforms:[{x:55,y:590,w:360,solid:true},{x:490,y:525,w:300},{x:865,y:590,w:360,solid:true}],spawns:[{x:290,y:590},{x:990,y:590}]},
 ruins:{name:'Ruínas',description:'Três alturas, rotas aéreas e uma abertura no centro.',platforms:[{x:45,y:620,w:460,solid:true},{x:775,y:620,w:460,solid:true},{x:430,y:460,w:420},{x:90,y:400,w:200},{x:990,y:400,w:200},{x:510,y:265,w:260}],spawns:[{x:315,y:620},{x:965,y:620}]}
};
const DIFFICULTIES={easy:{name:'Fácil',description:'Mais hesitação e erros. Reação de 260–400 ms.',reaction:[.26,.40],parry:.24,attack:.48},normal:{name:'Normal',description:'Lê distância e aberturas, mas pode ser enganada.',reaction:[.16,.26],parry:.57,attack:.72},adaptive:{name:'Adaptativo',description:'Ajusta defesa, pressão e fintas aos seus hábitos nesta partida.',reaction:[.15,.25],parry:.53,attack:.68},impossible:{name:'Impossível',description:'Prevê golpes e reage quase instantaneamente. Mesmas regras físicas.',reaction:[.005,.018],parry:1,attack:.96}};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,stats=f=>CLASSES[typeof f==='string'?f:f.kind]||CLASSES.knight;
function cleanRules(r={}){const o={};for(const[k,v]of Object.entries(RULES))o[k]=Number.isFinite(r[k])?clamp(r[k],v.min,v.max):1;o.airDash=r.airDash===true;return o;}
const neutral=()=>({move:0,aim:0,jump:false,jumpHeld:false,down:false,attack:false,parry:false,dash:false});
function nearest(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1),0,1);return{x:a.x+dx*t,y:a.y+dy*t};}
const pointSegment=(p,a,b)=>{const n=nearest(p,a,b);return Math.hypot(p.x-n.x,p.y-n.y);};
function segmentDistance(a,b,c,d){const cross=(p,q,r)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x),v1=cross(a,b,c),v2=cross(a,b,d),v3=cross(c,d,a),v4=cross(c,d,b);if(v1*v2<0&&v3*v4<0)return 0;return Math.min(pointSegment(a,c,d),pointSegment(b,c,d),pointSegment(c,a,b),pointSegment(d,a,b));}
function guardSector(angle,grounded){const s=Math.sin(angle);return s<-.7071?'high':s>.7071&&!grounded?'low':'normal';}
function blade(f){
 const s=stats(f),p=clamp(f.stateTime/Math.max(.001,f.duration),0,1),attack=['startup','active','recovery'].includes(f.state),aim=attack?f.attackAim:f.aim,side=Math.cos(aim)>=0?1:-1;
 let angle=aim-.18*side,extend=0,offset=24,start=12,end=s.length;
 if(s.sweep){if(f.state==='startup')angle=aim-side*s.sweep*.5*clamp(p*2,0,1);else if(f.state==='active')angle=aim+side*s.sweep*(p-.5);else if(f.state==='recovery')angle=aim+side*lerp(s.sweep*.5,-.18,p*p);}
 else{angle=aim;if(f.state==='startup')extend=-20*p;else if(f.state==='active')extend=lerp(-20,18,Math.sin(p*Math.PI));else if(f.state==='recovery')extend=-20*(1-p);start=s.length-44;}
 if(f.state==='parry'){const ga=f.guard==='high'?-Math.PI/2:f.guard==='low'?Math.PI/2:(f.guardFacing>0?0:Math.PI);angle=ga+Math.PI/2;offset=0;}
 if(f.state==='stunned')angle=aim+side*1.2;
 const hand={x:f.x+Math.cos(aim)*(offset+extend),y:f.y-79+Math.sin(aim)*(offset+extend)};
 if(f.state==='parry'){const ga=f.guard==='high'?-Math.PI/2:f.guard==='low'?Math.PI/2:(f.guardFacing>0?0:Math.PI);hand.x=f.x+Math.cos(ga)*37-Math.cos(angle)*s.length*.33;hand.y=f.y-79+Math.sin(ga)*48-Math.sin(angle)*s.length*.33;}
 const at=(n,l=0)=>({x:hand.x+Math.cos(angle)*n-Math.sin(angle)*l,y:hand.y+Math.sin(angle)*n+Math.cos(angle)*l});
 let segments=[{a:at(start),b:at(end)}],shaft=null;
 if(f.kind==='lancer')shaft={a:at(-45),b:at(start)};
 if(f.kind==='reaper'){
  shaft={a:at(-34),b:at(s.length)};const pts=[at(139,-4),at(167,7),at(174,29),at(166,53),at(145,73),at(119,84)];segments=pts.slice(1).map((p,i)=>({a:pts[i],b:p}));
 }
 return{hand,angle,a:segments[0].a,b:segments[segments.length-1].b,segments,shaft,guard:{a:at(-12),b:at(Math.min(120,s.length))}};
}
function makeFighter(id,kind,color,spawn){return{id,kind,color,...spawn,vx:0,vy:0,facing:id?-1:1,aim:id?Math.PI:0,attackAim:0,grounded:true,platform:-1,coyote:.085,jumpBuffer:0,jumping:false,airUsed:false,dropTimer:0,move:0,state:'idle',stateTime:0,duration:0,dead:false,deathTime:0,dashCooldown:0,parryCooldown:0,dashX:0,dashY:0,attackId:0,attackHit:false,guard:'normal',guardFacing:id?-1:1,anim:0,landing:0};}
class Game{
 constructor(o={}){this.random=o.random||Math.random;this.mode='pve';this.difficulty='normal';this.characters=['knight','knight'];this.colors=['jade','coral'];this.mapId='dojo';this.rules=cleanRules();this.configure(o);this.events=[];this.time=0;this.round=1;this.score=[0,0];this.phase='title';this.hitstop=0;this.roundTimer=0;this.attackCounter=0;this.lastReason='';this.fallTimer=0;this.habits={attacks:0,parries:0,whiffs:0,jumps:0,retreat:0};this.resetFighters();}
 configure(o={}){if(['pve','local','online'].includes(o.mode))this.mode=o.mode;if(DIFFICULTIES[o.difficulty])this.difficulty=o.difficulty;if(o.characters)this.characters=[0,1].map(i=>CLASSES[o.characters[i]]?o.characters[i]:'knight');if(o.colors)this.colors=[0,1].map(i=>COLORS[o.colors[i]]?o.colors[i]:(i?'coral':'jade'));if(this.colors[0]===this.colors[1])this.colors[1]=Object.keys(COLORS).find(c=>c!==this.colors[0]);if(MAPS[o.mapId])this.mapId=o.mapId;if(o.rules)this.rules=cleanRules(o.rules);this.aiEnabled=o.ai===undefined?this.mode==='pve':!!o.ai;this.map=MAPS[this.mapId];}
 resetFighters(){this.fighters=[0,1].map(i=>makeFighter(i,this.characters[i],this.colors[i],this.map.spawns[i]));for(const f of this.fighters)f.platform=this.map.platforms.findIndex(p=>f.x>=p.x&&f.x<=p.x+p.w&&f.y===p.y);this.ai={timer:.3,intent:0,seen:0,reaction:-1,answer:0,attackDelay:.5,jumpDelay:.6,bait:false};this.fallTimer=0;}
 start(o){if(o)this.configure(o);this.time=0;this.round=1;this.score=[0,0];this.phase='playing';this.hitstop=0;this.roundTimer=0;this.attackCounter=0;this.lastReason='';this.habits={attacks:0,parries:0,whiffs:0,jumps:0,retreat:0};this.events=[];this.resetFighters();this.emit('start');}
 emit(type,data={}){this.events.push({type,...data});}
 between(a,b){return lerp(a,b,this.random());}
 setState(f,state,duration=0){f.state=state;f.stateTime=0;f.duration=duration;}
 canAct(f){return!f.dead&&f.state==='idle'&&this.phase==='playing';}
 attack(id){const f=this.fighters[id];if(!this.canAct(f))return false;f.attackAim=f.aim;f.attackId=++this.attackCounter;f.attackHit=false;this.setState(f,'startup',stats(f).startup);if(!id)this.habits.attacks++;this.emit('windup',{id});return true;}
 parry(id){const f=this.fighters[id],s=stats(f);if(!this.canAct(f)||f.parryCooldown>0)return false;f.guard=guardSector(f.aim,f.grounded);f.guardFacing=f.facing;this.setState(f,'parry',s.parry*this.rules.parryWindow);f.parryCooldown=f.duration+s.parryRecovery*this.rules.parryRecovery;if(!id)this.habits.parries++;this.emit('guard',{id});return true;}
 dash(id,move=0){const f=this.fighters[id],s=stats(f);if(!this.canAct(f)||f.dashCooldown>0||(!f.grounded&&(!this.rules.airDash||f.airUsed)))return false;
  let x=Math.cos(f.aim),y=Math.sin(f.aim);if(Math.abs(move)>.1){const slope=Math.min(Math.PI/3,Math.asin(Math.abs(y)));x=Math.sign(move)*Math.cos(slope);y=Math.sign(y)*Math.sin(slope);}if(f.grounded&&y>0){x=Math.sign(x)||f.facing;y=0;}
  f.dashX=x;f.dashY=y;f.airUsed=true;f.dashCooldown=s.dashCooldown*this.rules.dashCooldown;this.setState(f,'dash',s.dash);this.emit('dash',{id});return true;
 }
 tickState(f,dt){f.dashCooldown=Math.max(0,f.dashCooldown-dt);f.parryCooldown=Math.max(0,f.parryCooldown-dt);f.dropTimer=Math.max(0,f.dropTimer-dt);f.landing=Math.max(0,f.landing-dt);f.stateTime+=dt;
  if(f.dead){f.deathTime+=dt;return;}
  if(f.duration&&f.stateTime>=f.duration){const s=stats(f),old=f.state;if(old==='startup'){this.setState(f,'active',s.active);this.emit('swing',{id:f.id});}else if(old==='active'){this.setState(f,'recovery',s.recovery);if(!f.attackHit){if(!f.id)this.habits.whiffs++;this.emit('whiff',{id:f.id});}}else if(old==='parry'){this.setState(f,'parryRecovery',s.parryRecovery*this.rules.parryRecovery);this.emit('parryMiss',{id:f.id});}else if(old==='dash'){this.setState(f,'dashRecovery',s.dashRecovery*this.rules.dashRecovery);f.vx*=.45;f.vy*=.55;}else this.setState(f,'idle');}
 }
 moveFighter(f,inp,dt){if(f.dead)return;const s=stats(f),r=this.rules,oldY=f.y,wasGrounded=f.grounded;
  f.aim=Number.isFinite(inp.aim)?inp.aim:f.aim;f.facing=Math.cos(f.aim)>=0?1:-1;f.move=clamp(inp.move||0,-1,1);f.coyote=f.grounded?.085:Math.max(0,f.coyote-dt);f.jumpBuffer=inp.jump?.09:Math.max(0,f.jumpBuffer-dt);
  if(f.jumpBuffer>0&&!['dash','stunned','clash','dead'].includes(f.state)&&this.phase==='playing'&&(f.grounded||f.coyote>0)){
   const platform=this.map.platforms[f.platform];if(inp.down&&platform&&!platform.solid){f.dropTimer=.22;f.y+=3;f.grounded=false;f.coyote=0;}else{f.vy=-940*r.jump;f.grounded=false;f.jumping=true;f.coyote=0;this.emit('jump',{id:f.id});if(!f.id)this.habits.jumps++;}f.jumpBuffer=0;
  }
  if(f.jumping&&!inp.jumpHeld&&f.vy<-250){f.vy*=.48;f.jumping=false;}
  if(f.state==='dash'){f.vx=f.dashX*s.dashSpeed*r.dashDistance;f.vy=f.dashY*s.dashSpeed*r.dashDistance;if(f.vy<0)f.grounded=false;}
  else{
   const attacking=['startup','active','recovery'].includes(f.state),locked=['stunned','clash'].includes(f.state),target=f.move*s.speed*r.speed*(attacking&&f.grounded?.7:1),accel=(f.grounded?3800:1100)*(locked?0:1);
   if(!locked)f.vx+=clamp(target-f.vx,-accel*dt,accel*dt);else f.vx*=Math.exp(-5*dt);
   f.vy+=1980*r.gravity*(inp.down&&f.vy>0?1.7:1)*dt;
  }
  f.x=clamp(f.x+f.vx*dt,24,1256);f.y+=f.vy*dt;f.grounded=false;f.platform=-1;
  if(f.vy>=0){for(let i=0;i<this.map.platforms.length;i++){const p=this.map.platforms[i];if(f.dropTimer>0&&!p.solid)continue;if(f.x+C.radius*.7>p.x&&f.x-C.radius*.7<p.x+p.w&&oldY<=p.y+.5&&f.y>=p.y){f.y=p.y;f.vy=0;f.grounded=true;f.platform=i;f.jumping=false;if(!wasGrounded){f.landing=.15;if(f.state!=='dash')f.airUsed=false;this.emit('land',{id:f.id});}break;}}}
  if(f.grounded&&f.state!=='dash')f.airUsed=false;
  if(f.grounded&&f.state==='parry'&&f.guard==='low')this.setState(f,'parryRecovery',s.parryRecovery*r.parryRecovery);
  f.anim+=Math.abs(f.vx)*dt*.026;
 }
 bodyContact(a,d){const w=blade(a),top={x:d.x,y:d.y-121},bottom={x:d.x,y:d.y-25};return w.segments.some(s=>segmentDistance(s.a,s.b,top,bottom)<=C.radius+C.bladeWidth);}
 incomingSector(a,d){const w=blade(a),center={x:d.x,y:d.y-79};let best=w.a,dist=Infinity;for(const s of w.segments){const p=nearest(center,s.a,s.b),n=Math.hypot(p.x-center.x,p.y-center.y);if(n<dist){best=p;dist=n;}}
  // Direction of the incoming weapon at first contact determines the guard, including dives.
  let dx=best.x-center.x,dy=best.y-center.y;if(Math.hypot(dx,dy)<8){dx=a.x-d.x;dy=a.y-d.y;}return{sector:guardSector(Math.atan2(dy,dx),false),side:Math.sign(dx)||Math.sign(a.x-d.x)||1,point:best};
 }
 resolveCombat(){const[p,e]=this.fighters;if(p.dead||e.dead)return;const pb=blade(p),eb=blade(e);
  if(p.state==='active'&&e.state==='active'&&pb.segments.some(a=>eb.segments.some(b=>segmentDistance(a.a,a.b,b.a,b.b)<=C.bladeWidth*2))){for(const f of[p,e]){f.attackHit=true;this.setState(f,'clash',.16);f.vx=(f.x<(f===p?e:p).x?-1:1)*170;}this.hitstop=.055;this.emit('clash',{x:(pb.b.x+eb.b.x)/2,y:(pb.b.y+eb.b.y)/2});return;}
  const hits=[];for(const[a,d]of[[p,e],[e,p]]){if(a.state!=='active'||a.attackHit)continue;const body=this.bodyContact(a,d),w=blade(a),g=blade(d).guard,guardTouch=d.state==='parry'&&w.segments.some(s=>segmentDistance(s.a,s.b,g.a,g.b)<7);if(!body&&!guardTouch)continue;const incoming=this.incomingSector(a,d),valid=d.state==='parry'&&incoming.sector===d.guard&&(d.guard!=='normal'||incoming.side===d.guardFacing);
   if(valid){a.attackHit=true;this.setState(a,'stunned',stats(a).stun*this.rules.stun);a.vx=(a.x<d.x?-1:1)*120;this.setState(d,'idle');d.parryCooldown=Math.min(d.parryCooldown,.22);this.hitstop=.07;this.emit('parry',{id:d.id,...incoming.point});return;}if(body)hits.push([a,d]);
  }
  if(hits.length){const trade=hits.length===2,winner=trade?-1:hits[0][0].id;for(const[,d]of hits){d.dead=true;d.deathTime=0;this.setState(d,'dead');}const d=hits[0][1];const reason=trade?'Os dois golpes chegaram juntos.':d.stateBefore==='recovery'?'O golpe errado abriu sua recuperação.':d.stateBefore==='parryRecovery'?'O parry terminou antes de o golpe chegar.':d.stateBefore==='parry'?'O golpe veio por fora da direção protegida.':d.stateBefore==='dash'?'O dash entrou no alcance da lâmina.':d.stateBefore==='stunned'?'O parry deixou uma abertura para o contra-ataque.':'A lâmina encontrou uma abertura.';this.finish(winner,reason,{x:d.x,y:d.y-75,trade});}
 }
 finish(winner,reason,data={}){if(this.phase!=='playing')return;if(winner>=0)this.score[winner]++;this.phase='roundEnd';this.roundTimer=C.roundPause;this.hitstop=.095;this.lastReason=reason;this.emit('kill',{winner,reason,trade:winner<0,...data});}
 separateBodies(){const[a,b]=this.fighters;if(a.dead||b.dead||Math.abs(a.y-b.y)>126)return;const dx=b.x-a.x,overlap=35-Math.abs(dx);if(overlap>0){const sign=dx>=0?1:-1;a.x=clamp(a.x-overlap*.5*sign,24,1256);b.x=clamp(b.x+overlap*.5*sign,24,1256);if(a.vx*sign>0)a.vx=0;if(b.vx*sign<0)b.vx=0;}}
 getAIPolicy(){const base=DIFFICULTIES[this.difficulty],h=this.habits,total=h.attacks+h.parries+1,confidence=clamp(total/14,0,1);return{...base,attack:clamp(base.attack+(this.difficulty==='adaptive'?Math.min(.12,h.retreat/100):0),0,1),parry:clamp(base.parry+(this.difficulty==='adaptive'?confidence*(h.attacks/total-.4)*.5:0),0,1),bait:this.difficulty==='adaptive'?.14+confidence*h.parries/total*.55:.15,punish:this.difficulty==='easy'?.4:this.difficulty==='adaptive'?.65+Math.min(.3,h.whiffs/total*.4):.85,learned:this.difficulty==='adaptive'&&total>6};}
 updateAI(dt){const p=this.fighters[0],e=this.fighters[1],ai=this.ai,s=stats(e),policy=this.getAIPolicy(),dx=p.x-e.x,dy=p.y-e.y,dist=Math.hypot(dx,dy),toward=Math.sign(dx)||1,impossible=this.difficulty==='impossible';const inp=neutral();inp.aim=Math.atan2(dy,dx);inp.move=ai.intent;inp.jumpHeld=e.vy<0;ai.timer-=dt;ai.attackDelay-=dt;ai.jumpDelay-=dt;
  if(p.dead||e.dead)return inp;
  if(p.state==='startup'&&p.attackId!==ai.seen){ai.seen=p.attackId;ai.reaction=this.between(...policy.reaction);ai.answer=this.random();}
  if(ai.reaction>=0){ai.reaction-=dt;if(ai.reaction<=0&&['startup','active'].includes(p.state)&&dist<stats(p).reach+55&&this.canAct(e)){if(ai.answer<policy.parry){const from=Math.atan2(p.y-e.y,p.x-e.x);inp.aim=from;inp.parry=true;}else if(ai.answer<.92){ai.intent=-toward;inp.move=-toward;inp.dash=this.random()<.3;}ai.reaction=-1;}}
  if(impossible&&this.canAct(e)&&['startup','active'].includes(p.state)){const probe={...p,state:'active',duration:stats(p).active,stateTime:Math.max(0,p.state==='active'?p.stateTime:p.stateTime-p.duration)+.025};if(this.bodyContact(probe,e)){const incoming=this.incomingSector(probe,e);inp.aim=incoming.sector==='high'?-Math.PI/2:incoming.sector==='low'?Math.PI/2:incoming.side>0?0:Math.PI;inp.parry=true;}}
  if(ai.timer<=0){ai.timer=this.between(.09,.19);const roll=this.random(),inRange=dist<s.reach-9&&dist>s.minRange;
   if(inRange&&ai.attackDelay<=0&&p.state!=='parry'&&((['recovery','parryRecovery','stunned'].includes(p.state)&&p.stateTime>(impossible?0:.11)&&roll<policy.punish)||roll<policy.attack)){inp.attack=true;ai.attackDelay=this.between(.38,.85)*(this.difficulty==='easy'?1.4:1);ai.intent=0;}
   else if(dist<s.minRange+15)ai.intent=-toward;
   else if(dist>s.reach-28)ai.intent=toward;
   else if(roll<policy.bait){ai.intent=-toward;ai.bait=true;}
   else ai.intent=roll<.5?0:toward;
   if(ai.bait&&roll>.55){ai.bait=false;ai.intent=toward;}
   if(e.grounded&&ai.jumpDelay<=0&&(dy<-110||(dist<320&&roll<.16))){inp.jump=true;inp.jumpHeld=true;ai.jumpDelay=this.between(.6,1.3);}
   if(e.grounded&&dy>130&&!this.map.platforms[e.platform]?.solid&&Math.abs(dx)<170){inp.down=true;inp.jump=true;}
  }
  inp.move=ai.intent;
  if(e.grounded&&Math.abs(inp.move)>.1){const edge=e.x+inp.move*65,support=this.map.platforms.some(q=>edge>=q.x&&edge<=q.x+q.w&&Math.abs(q.y-e.y)<35);if(!support){const landing=this.map.platforms.some(q=>(q.x+q.w-e.x)*inp.move>0&&Math.abs(q.x+q.w*.5-e.x)<430&&q.y>e.y-240);if(landing&&ai.jumpDelay<=0){inp.jump=true;inp.jumpHeld=true;ai.jumpDelay=.65;}else inp.move=0;}}
  if(!e.grounded&&e.vy>0){const below=this.map.platforms.filter(q=>q.y>=e.y-10);if(below.length&&!below.some(q=>e.x>q.x+12&&e.x<q.x+q.w-12)){const target=below.reduce((a,b)=>Math.abs(clamp(e.x,a.x+24,a.x+a.w-24)-e.x)<Math.abs(clamp(e.x,b.x+24,b.x+b.w-24)-e.x)?a:b);inp.move=Math.sign(clamp(e.x,target.x+24,target.x+target.w-24)-e.x);}}
  return inp;
 }
 step(dt,inputs=[]){if(!Number.isFinite(dt)||dt<=0)return;if(this.hitstop>0){this.hitstop=Math.max(0,this.hitstop-dt);return;}if(this.phase==='title'||this.phase==='matchEnd')return;this.time+=dt;
  if(this.phase==='roundEnd'){for(const f of this.fighters)if(f.dead)f.deathTime+=dt;this.roundTimer-=dt;if(this.roundTimer<=0){const winner=this.score.findIndex(n=>n>=C.winningScore);if(winner>=0){this.phase='matchEnd';this.emit('matchEnd',{winner});}else{this.round++;this.phase='playing';this.resetFighters();this.emit('round');}}return;}
  const commands=[inputs[0]||neutral(),this.aiEnabled?this.updateAI(dt):inputs[1]||neutral()];if(commands[0].move*(this.fighters[1].x-this.fighters[0].x)<0)this.habits.retreat+=dt;
  for(let i=0;i<2;i++){const f=this.fighters[i],inp=commands[i];this.tickState(f,dt);if(f.dead)continue;f.aim=Number.isFinite(inp.aim)?inp.aim:f.aim;f.facing=Math.cos(f.aim)>=0?1:-1;f.stateBefore=f.state;if(inp.attack)this.attack(i);else if(inp.parry)this.parry(i);else if(inp.dash)this.dash(i,inp.move);this.moveFighter(f,inp,dt);}
  this.separateBodies();this.resolveCombat();if(this.phase!=='playing')return;
  for(const f of this.fighters)if(!f.dead&&f.y>C.deathY){f.dead=true;f.deathTime=0;this.setState(f,'dead');if(!this.fallTimer)this.fallTimer=.15;}
  if(this.fallTimer){this.fallTimer-=dt;const dead=this.fighters.filter(f=>f.dead);if(dead.length===2||this.fallTimer<=0){const loser=dead[0],winner=dead.length===2?-1:1-loser.id;this.finish(winner,winner<0?'Os dois caíram na mesma janela.':'Queda fora da arena.',{x:loser.x,y:710});}}
 }
 snapshot(){return JSON.parse(JSON.stringify({version:3,mode:this.mode,difficulty:this.difficulty,characters:this.characters,colors:this.colors,mapId:this.mapId,rules:this.rules,phase:this.phase,time:this.time,score:this.score,round:this.round,hitstop:this.hitstop,roundTimer:this.roundTimer,attackCounter:this.attackCounter,fallTimer:this.fallTimer,lastReason:this.lastReason,fighters:this.fighters,habits:this.habits,ai:this.ai}));}
 loadSnapshot(s){if(!s||s.version!==3||!Array.isArray(s.fighters)||s.fighters.length!==2)return false;this.configure(s);for(const key of['phase','time','score','round','hitstop','roundTimer','attackCounter','fallTimer','lastReason','fighters','habits','ai'])this[key]=JSON.parse(JSON.stringify(s[key]));this.events=[];return true;}
}
const api={C,CLASSES,COLORS,RULES,DEFAULT_RULES,MAPS,DIFFICULTIES,Game,stats,blade,guardSector,cleanRules,neutral,clamp,lerp,segmentDistance};if(typeof module!=='undefined')module.exports=api;root.DuelCore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
