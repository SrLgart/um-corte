(function(root){
'use strict';
const D=root.DuelCore,L=root.DuelLegacy,{clone,has,ensure}=L;
const ARENAS={
 street:{name:'Arena da Rua',description:'Cordas, lampiões e um círculo de espectadores. Todo caminho começa pequeno.',width:1280,height:720,platforms:[{x:30,y:610,w:1220,solid:true},{x:140,y:410,w:230},{x:890,y:425,w:240}],walls:[{x:35,y:430,w:24,h:180},{x:1221,y:430,w:24,h:180}],spawns:[{x:360,y:610},{x:850,y:610}],decor:[{type:'lantern',x:170,y:345},{type:'lantern',x:1060,y:360}]},
 coliseum:{name:'Coliseu de Pedra',description:'Areia dourada, arquibancadas e corredores elevados.',width:1560,height:800,platforms:[{x:35,y:680,w:1490,solid:true},{x:170,y:450,w:330},{x:1070,y:450,w:320},{x:610,y:530,w:340}],walls:[{x:40,y:390,w:32,h:290},{x:1488,y:390,w:32,h:290}],spawns:[{x:420,y:680},{x:1100,y:680}],decor:[{type:'flag',x:120,y:380},{type:'flag',x:1400,y:380}]},
 temple:{name:'Pátio do Templo',description:'Jardim seco, incenso e três caminhos entre os pilares.',width:1840,height:850,platforms:[{x:35,y:735,w:1770,solid:true},{x:170,y:525,w:310},{x:670,y:510,w:480},{x:1350,y:520,w:310},{x:785,y:315,w:250}],walls:[{x:90,y:520,w:30,h:215},{x:1720,y:520,w:30,h:215}],spawns:[{x:470,y:735},{x:1340,y:735}],decor:[{type:'bell',x:910,y:220},{type:'bamboo',x:130,y:600},{type:'lantern',x:1560,y:460}]},
 imperial:{name:'Grande Arena Imperial',description:'Uma arena monumental. Plataformas largas e espaço para flanquear.',width:2160,height:920,platforms:[{x:30,y:800,w:2100,solid:true},{x:190,y:590,w:410},{x:780,y:590,w:600},{x:1560,y:590,w:410},{x:900,y:360,w:360}],walls:[{x:50,y:500,w:35,h:300},{x:2075,y:500,w:35,h:300}],spawns:[{x:540,y:800},{x:1540,y:800}],decor:[{type:'flag',x:225,y:500},{type:'flag',x:1810,y:500},{type:'vase',x:2020,y:758}]},
 judgment:{name:'Arena do Juízo',description:'O eclipse observa. Chão contínuo, rotas amplas, nenhum acaso no último corte.',width:2500,height:1000,platforms:[{x:30,y:875,w:2440,solid:true},{x:180,y:650,w:460},{x:920,y:650,w:660},{x:1860,y:650,w:460},{x:1100,y:435,w:300}],walls:[{x:50,y:565,w:35,h:310},{x:2415,y:565,w:35,h:310}],spawns:[{x:650,y:875},{x:1840,y:875}],decor:[]}
};
for(const [id,a]of Object.entries(ARENAS)){a.path=true;a.theme='dojo';a.deathY=a.height+200;D.MAPS['path_'+id]=a;}
// Final containment also covers direct displacement powers and ADMIN flight.
const pathStep=D.Game.prototype.step;
D.Game.prototype.step=function(...args){const result=pathStep.apply(this,args);if(this.map?.pathEnclosed){const walls=this.map.walls.filter(w=>w.pathBoundary).sort((a,b)=>a.x-b.x);if(walls.length===2)for(const f of this.fighters){const radius=D.body(f).radius,lo=walls[0].x+walls[0].w+radius,hi=walls[1].x-radius,x=D.clamp(f.x,lo,hi);if(x!==f.x){f.x=x;f.vx=0;f.dashRemaining=f.slideRemaining=0;}}}return result;};
const BOSSES=[
 ['ronin','O RONIN','A Lâmina que Espera','knight',[10,20],['sword','nodraw','perfectstep'],'patient'],
 ['spider','A ARANHA','Filha dos Telhados','assassin',[10,20],['web','wingboot','kunai','downstrike'],'aerial'],
 ['executioner','O CARRASCO','O Peso da Sentença','swordsman',[10,20],['axe','crystal','pulse'],'heavy'],
 ['specter','O ESPECTRO','Ninguém Está Ali','assassin',[10,20,30],['kunai','shadowcloak','mist','blink'],'flank'],
 ['tamer','O DOMADOR','Senhor das Feras','lancer',[20,30],['bow','hound','falcon','mimic'],'ranged'],
 ['artificer','O ARTÍFICE','O Impossível é Ferramenta','duelist',[20,30,40],['blunderbuss','portals','telekinesis','weaponmaster'],'tools'],
 ['vampire','O VAMPIRO','A Fome','boxer',[20,30],['knuckles','stonemask','perfectstep','impulse'],'aggressive'],
 ['witch','A BRUXA DA GRAVIDADE','Acima e Abaixo','reaper',[30,40],['gravitycloak','well','ice','fireball'],'aerial'],
 ['legionlord','O SENHOR DA LEGIÃO','Muitos em Um','knight',[30,40],['sword','legion','barrier','counter'],'patient'],
 ['twins','OS GÊMEOS','Dois Cortes','knight',[30,40],['gunblade','backstep'],'twins'],
 ['timekeeper','O HOMEM DO TEMPO','Um Segundo Basta','knight',[40],['sword','sandevistan','destinyeye','nodraw'],'patient'],
 ['first','O PRIMEIRO ERRANTE','O caminho termina onde o dele terminou.','knight',[50],['echo','mirrorcloak','perfectstep','weaponmaster','doppel','room'],'master']
].map(([id,name,subtitle,kind,levels,build,style])=>({id,name,subtitle,kind,levels,build,style}));
const KEYS=Object.keys(D.CLASSES),ARENA_IDS=Object.keys(ARENAS).map(k=>'path_'+k);
function choose(rng,pool){return pool[Math.floor(rng()*pool.length)];}
function ownBuild(rng,ranks){const result=[];for(const rarity of ranks){const pool=Object.keys(L.catalog).filter(id=>L.catalog[id].rarity===rarity&&L.eligible(id,{mode:'path',futureDraft:false})&&!result.includes(id)&&!['philosopher','d6','d20','destinyorb','secondchance','markedcard'].includes(id));result.push(choose(rng,pool));}return result;}
class Run{
 constructor(options={}){this.version=8;this.id=options.id||'run-'+Date.now().toString(36);this.seed=options.seed??(Math.random()*4294967296)>>>0;this.random=L.rng(this.seed);this.level=1;this.points=D.clamp(Math.floor(options.points||3),1,25);this.rules=D.cleanRules({...options.rules,winningScore:this.points,specials:false,chaos:'off'});this.inventory=L.inventory();this.phase='between';this.encounter=null;this.gameSave=null;this.draft=null;this.bosses={};this.defeated=[];this.seen=[...(options.seen||[])];this.lastBosses=options.lastBosses||[];this.stats={duels:0,deaths:0,kills:0,time:0,drafts:0};this.color=options.color||'jade';this.entryInventory=null;this.result=null;this.rollBosses();}
 rollBosses(){const used=[];for(const level of[10,20,30,40]){let pool=BOSSES.filter(b=>b.levels.includes(level)&&!used.includes(b.id));const fresh=pool.filter(b=>!this.lastBosses.includes(b.id));if(fresh.length)pool=fresh;const b=choose(this.random,pool);this.bosses[level]=b.id;used.push(b.id);}this.bosses[50]='first';}
 makeEncounter(){if(this.encounter)return this.encounter;const level=this.level,boss=level%10===0?BOSSES.find(b=>b.id===this.bosses[level]):null,mini=level%10===5;let fighters=[];
 if(boss){fighters=[{kind:boss.kind,build:[...boss.build],style:boss.style,boss:boss.id}];if(boss.id==='twins')fighters.push({kind:'assassin',build:['yoyo','well'],style:'ranged',boss:'twins'});}
 else if(mini){const ranks=level===5?['common']:level===15?['common','common']:level===25?['rare','common']:level===35?['rare','rare']:['legendary','rare'];fighters=[{kind:choose(this.random,KEYS),build:ownBuild(this.random,ranks),elite:true,style:'aggressive'}];}
 else{const n=level<=10?1:level<=35?2:3;for(let i=0;i<n;i++){let ranks=level<=10?[]:level<=20?['common']:level<=25?['common',...(i===1&&this.random()<.35?['rare']:[])]:level<=30?['rare']:level<=35?['rare','common']:level<=40?['rare']:['rare','rare'];fighters.push({kind:choose(this.random,KEYS),build:ownBuild(this.random,ranks),style:i===0?'aggressive':i===1?'flank':'ranged'});}}
 this.encounter={level,boss:boss?.id||null,mini,fighters,arena:ARENA_IDS[Math.min(4,Math.floor((level-1)/10))],seed:this.random.state};return this.encounter;
 }
 game(){const e=this.makeEncounter(),game=new D.Game({mode:'pve',ai:true,timeOfDay:['path_street','path_imperial','path_judgment'].includes(e.arena)?'night':'day',difficulty:e.difficulty||(this.level<=10?'normal':this.level<=30?'hard':'master'),mapId:e.arena,rules:this.rules,characters:['boxer',e.fighters[0].kind],colors:[this.color,this.color==='coral'?'jade':'coral'],roundEntries:true,random:L.rng(e.seed)});game.pathEncounter=clone(e);game.legacyEnabled=true;game.start();L.reset(game.fighters[0],this.inventory,'match');game.fighters[0].wanderer=true;game.legacyWorld={entities:[],effects:[],serial:0,time:0};game.fighters.forEach(f=>L.spawnCompanions(game,f));L.captureRound(game);if(!this.gameSave)this.entryInventory=clone(this.inventory);this.phase='fight';if(this.gameSave)game.loadSnapshot(this.gameSave);return game;}

 debugEncounter(options={}){
  const {level=this.level,boss='',mini='',arena='',difficulty='',seed}=options;
  if(!Number.isInteger(level)||level<1||level>50||boss&&!BOSSES.some(b=>b.id===boss)||mini&&!KEYS.includes(mini)||arena&&!ARENA_IDS.includes(arena)||difficulty&&!Object.hasOwn(D.DIFFICULTIES,difficulty)||seed!==undefined&&(!Number.isInteger(seed)||seed<0||seed>4294967295))return false;
  if(seed!==undefined){this.seed=seed;this.random=L.rng(seed);}
  this.level=level;this.introCompleted=null;this.encounter=null;this.gameSave=null;this.draft=null;this.steal=null;this.result=null;this.phase='between';
  const e=this.makeEncounter();if(boss){const b=BOSSES.find(b=>b.id===boss);e.boss=b.id;e.mini=false;e.fighters=[{kind:b.kind,build:[...b.build],style:b.style,boss:b.id}];if(b.id==='twins')e.fighters.push({kind:'assassin',build:['yoyo','well'],style:'ranged',boss:b.id});}
  else if(mini){e.boss=null;e.mini=true;e.fighters=[{kind:mini,build:ownBuild(this.random,level<20?['common']:level<40?['rare','common']:['legendary','rare']),elite:true,style:'aggressive'}];}
  if(arena)e.arena=arena;if(difficulty)e.difficulty=difficulty;e.seed=this.random.state;return true;
 }
 checkpoint(game){
  this.inventory=clone(game.fighters[0].legacy);
  // Inventory changes save the safe start of this round, never a mid-air combat frame.
  if(game.phase==='playing'&&game.legacyRoundStart?.round===game.round){
   const safe=clone(game.legacyRoundStart);delete safe.legacyRoundStart;safe.legacyWorld={entities:[],effects:[],serial:0,time:0};
   for(let i=0;i<safe.fighters.length;i++){L.reset(safe.fighters[i],game.fighters[i].legacy,'duel');L.spawnCompanions(safe,safe.fighters[i]);}
   safe.legacyRngState=game.legacyRoundStart.legacyRngState;safe.legacyRoundStart=clone(safe);this.gameSave=safe;
  }else this.gameSave=game.snapshot();
 }
 resumeDraftGame(){
  if(this.phase!=='draft')return this.game();
  const saved={phase:this.phase,entryInventory:clone(this.entryInventory),gameSave:this.gameSave},game=this.game();
  this.phase=saved.phase;this.entryInventory=saved.entryInventory;this.gameSave=saved.gameSave;
  // Older V8 drafts had no scene snapshot. Reconstruct their encounter without rerolling rewards.
  game.phase='matchEnd';game.fighters[0].legacy=clone(this.inventory);game.events=[];return game;
 }
 reward(game){if(this.phase!=='fight')return;this.stats.time+=game.runTime||0;for(const key of ['kills','deaths','duels'])this.stats[key]+=(game.pathStats?.[key]||0);this.inventory=clone(game.fighters[0].legacy);this.gameSave=game.snapshot();if(game.score[1]>=this.points){this.phase='lost';this.result='CAMINHO INTERROMPIDO';return;}
 const e=this.makeEncounter();if(e.boss&&!this.defeated.includes(e.boss))this.defeated.push(e.boss);if(this.level===50){this.phase='won';this.result='CAMINHO CONCLUÍDO';return;}
 const reward=this.level===49?'last':this.level%10===0?'boss':e.mini?'mini':'normal',offer=this.level<=20||e.mini||e.boss||this.level===49;
 if(offer){const f={legacy:this.inventory};this.draft=L.draft(f,{mode:'path',level:this.level,reward,futureDraft:this.level<49},this.random);this.phase='draft';if(e.mini&&has(f,'crown'))this.steal=[...e.fighters[0].build].filter(id=>!this.inventory.items.includes(id));if(!this.draft.cards.length)this.advance();}else this.advance();
 }
 pick(id){if(this.phase!=='draft'||!this.draft.cards.includes(id)||this.draft.picked?.includes(id))return false;const f={legacy:this.inventory};if(!L.add(f,id))return false;this.draft.picked??=[];this.draft.picked.push(id);if(this.steal)this.steal=this.steal.filter(k=>!this.inventory.items.includes(k)&&!has(f,k));if(this.draft.picked.length>=this.draft.choices){this.stats.drafts++;if(!this.steal?.length)this.advance();}return true;}
 stealPick(id){if(!this.steal?.includes(id))return false;L.add({legacy:this.inventory},id);this.steal=null;if(this.draft?.stealing||this.draft?.picked?.length>=this.draft.choices)this.advance();return true;}
 reroll(){if(this.phase!=='draft'||this.draft.picked?.length)return false;const d=L.reroll({legacy:this.inventory},this.draft,this.random);if(!d)return false;this.draft=d;return true;}
 advance(){this.level++;this.introCompleted=null;this.encounter=null;this.draft=null;this.gameSave=null;this.phase='between';}
 retry(){if(this.phase!=='lost')return false;this.inventory=clone(this.entryInventory);this.phase='between';this.gameSave=null;return true;}
 serialize({spectator=false}={}){const omit=spectator?new Set(['random','gameSave','entryInventory']):new Set(['random']);return{...clone(Object.fromEntries(Object.entries(this).filter(([k])=>!omit.has(k)))),randomState:this.random.state};}
 static restore(data){if(data?.version!==8||!Number.isInteger(data.level)||data.level<1||data.level>50||!['between','fight','draft','won','lost'].includes(data.phase)||!data.inventory?.items.every(id=>L.catalog[id])||new Set(data.inventory.items).size!==data.inventory.items.length)throw Error('Save do Caminho inválido.');const run=Object.create(Run.prototype);Object.assign(run,clone(data));run.random=L.rng(data.randomState);return run;}
}
// Track actual encounters, independently from previously seen intro history.
const runGame=Run.prototype.game;
Run.prototype.game=function(){const game=runGame.call(this);this.encountered??=[];const boss=this.encounter?.boss;if(boss&&!this.encountered.includes(boss))this.encountered.push(boss);return game;};
function records(value={}){return{wins:Number.isSafeInteger(value.wins)&&value.wins>=0?value.wins:0,bestLevel:Number.isInteger(value.bestLevel)?D.clamp(value.bestLevel,0,50):0,bestTime:Number.isFinite(value.bestTime)&&value.bestTime>0?value.bestTime:null,lastOutcome:value.lastOutcome&&typeof value.lastOutcome.id==='string'?{id:value.lastOutcome.id,won:!!value.lastOutcome.won}:null};}
class Saves{
 constructor(storage){this.storage=storage;this.key='um-corte-v8-path';this.lastError='';}
 history(){try{const h=JSON.parse(this.storage.getItem(this.key+'-history')||'{}');return{seen:[...new Set((Array.isArray(h.seen)?h.seen:[]).filter(id=>BOSSES.some(b=>b.id===id)))],lastBosses:(Array.isArray(h.lastBosses)?h.lastBosses:[]).filter(id=>BOSSES.some(b=>b.id===id)),records:records(h.records)};}catch{return{seen:[],lastBosses:[],records:records()};}}
 write(run){try{
  const ended=['lost','won'].includes(run.phase);
  if(ended)this.storage.removeItem(this.key);
  this.storage.setItem(ended?this.key+'-last':this.key,JSON.stringify(run.serialize()));
  const h=this.history(),r=h.records;r.bestLevel=Math.max(r.bestLevel,run.level);
  if(ended){const won=run.phase==='won';if(won){if(r.lastOutcome?.id!==run.id||!r.lastOutcome.won)r.wins++;if(run.stats.time>0)r.bestTime=r.bestTime===null?run.stats.time:Math.min(r.bestTime,run.stats.time);}r.lastOutcome={id:run.id,won};}
  this.storage.setItem(this.key+'-history',JSON.stringify({version:1,seen:[...new Set([...h.seen,...run.seen])],lastBosses:ended?Object.values(run.bosses):h.lastBosses,records:r}));this.lastError='';return true;
 }catch(e){this.lastError='Não foi possível salvar: '+e.message;return false;}}
 read(){const text=this.storage.getItem(this.key);return text?Run.restore(JSON.parse(text)):null;}
}
// Reuse Game.moveFighter, tickState, platform updates, attacks and cooldowns for every actor.
const P=D.Game.prototype,old={};for(const k of ['resetFighters','resolveCombat','separateBodies','finish','snapshot','loadSnapshot','step','setState'])old[k]=P[k];
const pathStats=g=>g.pathStats??={kills:0,deaths:0,duels:0};
P.setState=function(f,state,...args){if(this.pathEncounter&&state==='dead'&&f.state!=='dead')pathStats(this)[f.id===0?'deaths':'kills']++;return old.setState.call(this,f,state,...args);};
P.resetFighters=function(...args){const saved=this.fighters?.map(f=>f.legacy?clone(f.legacy):null)||[];old.resetFighters.apply(this,args);if(!this.pathEncounter)return;const es=this.pathEncounter.fighters;this.fighters[0].wanderer=true;L.reset(this.fighters[0],saved[0],'duel');for(let i=0;i<es.length;i++){const id=i+1,def=es[i],spawn={...this.map.spawns[1],x:this.map.spawns[1].x+(i-1)*125};let f=this.fighters[id];if(!f){f=D.makeFighter(id,def.kind,['coral','gold','plum'][i],spawn);this.resetSpecial(f);f.dashCharges=this.rules.dashCount;f.airDashes=0;f.skin='default';this.fighters.push(f);}f.admin??={};f.kind=def.kind;f.style=def.style;f.boss=def.boss;f.elite=def.elite;f.platform=this.map.platforms.findIndex(p=>f.x>=p.x&&f.x<=p.x+p.w&&Math.abs(f.y-p.y)<3);L.reset(f,saved[id],'duel');for(const item of def.build)L.add(f,item);if(this.metrics&&!this.metrics.players[id])this.metrics.players[id]=D.metricPlayer();}
 this.legacyWorld={entities:[],effects:[],serial:0,time:0};this.fighters.forEach(f=>L.spawnCompanions(this,f));};
P.resolveCombat=function(){if(!this.pathEncounter)return old.resolveCombat.call(this);this.touchProps();const hits=[];for(let i=0;i<this.fighters.length;i++)for(let j=i+1;j<this.fighters.length;j++){const a=this.fighters[i],b=this.fighters[j];if(a.dead||b.dead||!L.hostile(this,a.id,b))continue;const sa=slash(a,this.map.walls),sb=slash(b,this.map.walls);if(a.state!=='ultCharge'&&b.state!=='ultCharge'&&D.polygonsIntersect(sa.points,sb.points)){for(const f of[a,b]){f.attackHit=true;this.setState(f,'clash',.16);f.vx=(f.x<(f===a?b:a).x?-1:1)*170*L.knockbackScale(f);}this.hitstop=.055;this.emit('clash',{kind:a.kind,kinds:[a.kind,b.kind],x:(a.x+b.x)/2,y:(a.y+b.y)/2-70});continue;}
 for(const [at,de]of[[a,b],[b,a]]){if(!['active','ultCharge'].includes(at.state)||at.attackHit)continue;
  const body=this.bodyContact(at,de),guard=D.blade(de).guard,points=slash(at,this.map.walls).points,guardTouch=de.state==='parry'&&D.polygonSegment(points,guard.a,guard.b,D.C.bladeWidth);
  if(!body&&!guardTouch){const db=D.body(de);if(D.polygonSegment(points,{x:de.x,y:de.y-db.top},{x:de.x,y:de.y-db.bottom},db.radius+9))at.nearCandidate={id:de.id,x:de.x,y:de.y-db.center};continue;}
  const incoming=this.incomingSector(at,de);if(at.ultMode==='sweepStrike'){incoming.sector=de.grounded?'normal':'low';incoming.side=Math.sign(at.x-de.x)||at.facing;}
  const valid=at.state!=='ultCharge'&&!(at.breakAttackId&&at.breakAttackId===at.attackId)&&de.state==='parry'&&(Math.abs(at.x-de.x)<.001||incoming.side===de.guardFacing);
  if(valid){const disarmEligible=L.canDisarm(at);de.guardVisual=incoming.sector;de.guardVisualUntil=this.time+.18;at.attackHit=true;this.setState(at,'stunned',this.rules.stun/1000);at.vx=(at.x<de.x?-1:1)*120*L.knockbackScale(at);const perfect=de.stateTime<=Math.min(.08,de.duration)+1e-8;this.setState(de,'idle');de.lastPerfect=perfect?this.time:(de.lastPerfect??-100);this.boxerParry(de);de.parryCooldown=Math.min(.22,de.parryCooldown);this.hitstop=.07;this.emit('parry',{id:de.id,attacker:at.id,attackerKind:at.kind,disarmEligible,perfect,height:incoming.sector,side:incoming.side,...incoming.point});}
  else if(body){at.attackHit=true;if(!this.absorb(de,at))hits.push([at,de]);if(this.legacyRewind)return;}
 }
 }
 // Kicks use the same directed capsule and wall occlusion as an ordinary duel.
 if(!hits.length)for(const at of this.fighters)for(const de of L.enemies(this,at)){if(at.dead||at.state!=='kickActive'||at.kickHit)continue;const y=at.y-D.body(at).center+12,from={x:at.x+at.kickSide*18,y},to={x:at.x+at.kickSide*56,y},db=D.body(de);if(!this.map.walls.some(w=>D.wallFraction({x:at.x,y},{x:de.x,y},w)<1)&&D.segmentDistance(from,to,{x:de.x,y:de.y-db.top},{x:de.x,y:de.y-db.bottom})<=db.radius+9){at.kickHit=true;this.setState(de,'pushed',.12);de.vx=at.kickSide*570*L.knockbackScale(de);de.vy=Math.min(de.vy,-85*L.knockbackScale(de));de.grounded=false;this.hitstop=.035;this.emit('kick',{id:at.id,x:de.x,y:de.y-db.center});}}
 let lastImpact=null;for(const [a,d]of hits){if(d.dead)continue;lastImpact=this.deathInfo(a,d);d.dead=true;d.deathTime=0;this.setState(d,'dead');L.effect(this,d,'defeat');root.DuelV8Detail?.killed(this,a,d);}
 if(lastImpact){const p=this.fighters[0],dead=this.fighters.slice(1).every(f=>f.dead);if(p.dead||dead){const d=this.fighters[lastImpact.victim],trade=p.dead&&dead;this.finish(p.dead?(dead?-1:1):0,trade?'Os dois cortes chegaram juntos.':'O corte encontrou uma abertura.',{x:d.x,y:d.y-D.body(d).center,...lastImpact,trade,cause:trade?'TROCA':lastImpact.cause});}}
};
const slash=D.slash;
P.separateBodies=function(){if(!this.pathEncounter)return old.separateBodies.call(this);for(let i=0;i<this.fighters.length;i++)for(let j=i+1;j<this.fighters.length;j++)old.separateBodies.call({...this,fighters:[this.fighters[i],this.fighters[j]]});};
P.finish=function(winner,reason,data={}){if(!this.pathEncounter)return old.finish.call(this,winner,reason,data);const playerDead=this.fighters[0].dead,enemiesDead=this.fighters.slice(1).every(f=>f.dead);if(!playerDead&&!enemiesDead)return;if(this.phase==='playing')pathStats(this).duels++;return old.finish.call(this,playerDead?(enemiesDead?-1:1):0,reason,data);};
P.snapshot=function(){return{...old.snapshot.call(this),pathEncounter:this.pathEncounter?clone(this.pathEncounter):null,runTime:this.runTime||0,...(this.pathEncounter?{pathStats:clone(pathStats(this))}:{})};};
P.loadSnapshot=function(s){this.pathEncounter=s.pathEncounter?clone(s.pathEncounter):null;const ok=old.loadSnapshot.call(this,s);this.runTime=s.runTime||0;this.pathStats=clone(s.pathStats||{kills:0,deaths:0,duels:0});return ok;};
P.step=function(dt,inputs){if(this.pathEncounter&&this.phase==='playing')this.runTime=(this.runTime||0)+dt;return old.step.call(this,dt,inputs);};
D.DIFFICULTIES.hard={name:'Difícil',description:'Domina o espaço aéreo e pune erros; ainda hesita.',reaction:[.12,.2],parry:.73,attack:.85};
// AI perceives delayed snapshots of public world state, never input commands.
// Navigation uses feet in the actor's gravity frame. Aim and dash remain world-space.
L.navigationFrame=function(g,f,p){
 const inverted=!!f.legacy?.effects.inverted,sign=inverted?-1:1,H=g.map.height,offset=D.body(f).center*2;
 const actor=inverted?{...f,y:H-f.y+offset,vy:-f.vy}:f;
 const map=inverted?{...g.map,platforms:g.map.platforms.map(q=>({...q,y:H-q.y})),walls:g.map.walls.map(q=>({...q,y:H-q.y-q.h}))}:g.map;
 const target=p?{...p,...(inverted?{y:H-p.y+offset,vy:-(p.vy||0)}:{})}:null;
 if(target&&!!p.inverted!==inverted){target.grounded=false;target.platform=-1;}
 return{actor,map,target,sign,inverted};
};
L.navigate=function(g,f,p,inp){
 const frame=L.navigationFrame(g,f,p),b=f.brain,view=Object.create(g);
 if(b.navInverted!==frame.inverted||frame.map.platforms[b.navTarget]?.stage==='gone')b.navTarget=-1;
 b.navInverted=frame.inverted;view.ai=b;view.map=frame.map;
 // A per-decision cache cannot retain paths through moved/collapsed platforms,
 // or confuse the top and underside of the same platform.
 view.routeCache=new Map();const result=g.navigateAI.call(view,frame.actor,frame.target,inp),e=frame.actor,q=frame.map.platforms[b.navTarget];
 // Do not spend a second jump toward a ceiling while already able to fall
 // onto the intended lower platform (notably while recovering a weapon).
 if(result&&!e.grounded&&q&&q.y>e.y+45&&inp.jump){
  const fall=(Math.sqrt(e.vy*e.vy+2*1980*g.rules.gravity*(q.y-e.y))-e.vy)/(1980*g.rules.gravity);
  const dx=Math.abs(D.clamp(e.x,q.x+24,q.x+q.w-24)-e.x);
  if(dx<D.stats(f).speed*g.rules.speed*fall*.75){inp.jump=false;inp.jumpHeld=e.vy<0;}
 }
 return result;
};
function gravityIntent(g,f,p){
 const inverted=!!f.legacy?.effects.inverted,offset=D.body(f).center*2;
 const ceiling=g.map.platforms.some(q=>q.stage!=='gone'&&f.x>q.x+24&&f.x<q.x+q.w-24&&q.y<=f.y-offset+16);
 if(inverted){
  const weapon=f.legacy.effects.weaponAway&&L.world(g).entities.some(e=>e.type==='weapon'&&e.originalOwner===f.id&&e.mode==='dropped'&&e.y>f.y);
  return !!weapon||!ceiling||p.y>f.y+130&&!p.inverted;
 }
 if(f.legacy.effects.weaponAway)return false;
 return p.y<f.y-150&&g.map.platforms.some(q=>q.stage!=='gone'&&f.x>q.x+30&&f.x<q.x+q.w-30&&q.y<f.y-offset-25&&q.y>f.y-340);
}
function observeZones(g,f){return L.world(g).entities.filter(e=>e.zone&&(e.lethal||e.type==='krakenArm')&&e.age<e.life&&(e.friendly||L.hostile(g,e.owner,f))&&Math.hypot(e.x-f.x,e.y-L.center(f).y)<850).slice(0,8).map(e=>({id:e.id,x:e.x,y:e.y,r:e.r||0,to:e.to?{x:e.to.x,y:e.to.y}:null,bounds:e.points?.length?{x:Math.min(...e.points.map(p=>p.x)),y:Math.min(...e.points.map(p=>p.y)),w:Math.max(...e.points.map(p=>p.x))-Math.min(...e.points.map(p=>p.x)),h:Math.max(...e.points.map(p=>p.y))-Math.min(...e.points.map(p=>p.y))}:null,activeAt:g.time+Math.max(0,(e.warn||0)-e.age),expires:g.time+e.life-e.age}));}
function avoidZones(g,f,inp,seen){const zones=(seen.zones||[]).filter(e=>e.expires>g.time&&e.activeAt<=g.time+.20);if(!zones.length)return;const b=D.body(f),risk=(x,y)=>zones.some(e=>{const top={x,y:y-b.top},bottom={x,y:y-b.bottom};return e.bounds?D.wallFraction(top,bottom,{x:e.bounds.x-b.radius-8,y:e.bounds.y-b.radius-8,w:e.bounds.w+2*b.radius+16,h:e.bounds.h+2*b.radius+16})<1:D.segmentDistance(e,e.to||e,top,bottom)<=b.radius+8+e.r;}),pathRisk=(x,y)=>[.25,.5,.75,1].some(t=>risk(f.x+(x-f.x)*t,f.y+(y-f.y)*t)),step=Math.max(65,D.stats(f).speed*g.rules.speed*.22),desired=inp.move||0;
 if(!risk(f.x,f.y)&&!pathRisk(f.x+desired*(inp.dash?step*2:step),f.y))return;
 // Avoidance is based on a previously observed telegraph. It cannot grant
 // protection; an attack that arrives before reaction time can still kill.
 inp.dash=inp.attack=inp.attackHeld=inp.special=false;inp.legado=[];const candidates=[-1,1,0].map(move=>({move,risk:Number(pathRisk(f.x+move*step,f.y)),cost:Math.abs(move-desired)})).sort((a,b)=>a.risk-b.risk||a.cost-b.cost);inp.move=candidates[0].move;
 if(f.brain.jump<=0&&(f.grounded||f.airJumps>0)&&!risk(f.x+inp.move*step,f.y-150*(f.legacy?.effects.inverted?-1:1))){inp.jump=inp.jumpHeld=true;inp.parry=false;f.brain.jump=.4;}
}
function legacyIntent(g,f,p,inp,{threat,shot,free,advanced,dist,reach,navigating}){
 const l=f.legacy;if(!l)return;const b=f.brain,w=L.weaponId(f),profile=L.WEAPONS[w],now=g.time,origin=L.center(f),target={x:p.x,y:p.y-D.body(f).center},angle=Math.atan2(target.y-origin.y,target.x-origin.x),clear=!g.map.walls.some(q=>D.wallFraction(origin,target,q)<1),defending=inp.parry||inp.dash&&threat||inp.jump&&!!shot;
 // A held gesture is an intention, not a one-frame attack pulse. Own charge
 // progress is current; target position is still the delayed observation.
 if(l.channel){inp.legado=[];inp.attack=inp.attackHeld=false;if(defending||threat)return;inp.dash=inp.jump=inp.special=inp.kick=false;inp.move=0;const aligned=Math.abs(Math.sin(angle-l.channel.aim))*dist<55;inp.legadoHeld=clear&&aligned&&l.channel.age<2.1?['kamehameha']:[];return;}
 if(l.weaponHold){inp.attack=false;inp.legado=[];if(defending||threat){inp.attackHeld=false;return;}inp.dash=inp.jump=inp.special=inp.kick=false;inp.move=0;const h=l.weaponHold,goal=b.holdWeapon===h.weapon?b.holdGoal:0;inp.attackHeld=h.age<goal;return;}
 if(l.effects.weaponAway){inp.attack=inp.attackHeld=false;inp.legado=(inp.legado||[]).filter(id=>id==='gravitycloak');const dropped=L.world(g).entities.find(e=>e.type==='weapon'&&e.originalOwner===f.id&&e.life>e.age);if(dropped&&!defending){if(w==='leviathan'&&dropped.mode!=='return'){inp.attack=true;}else if(dropped.mode==='dropped'){if(b.recoverWeapon!==dropped.id){b.recoverWeapon=dropped.id;b.navTarget=-1;}inp.move=Math.sign(dropped.x-f.x);inp.dash=inp.jump=inp.up=inp.down=false;inp.jumpHeld=f.vy*(l.effects.inverted?-1:1)<0;const platform=g.map.platforms.findIndex(q=>q.stage!=='gone'&&dropped.x>=q.x&&dropped.x<=q.x+q.w&&Math.abs(q.y-dropped.y)<15);L.navigate(g,f,{x:dropped.x,y:dropped.y+3,platform,grounded:platform>=0,inverted:false},inp);if((dropped.y-f.y)*(l.effects.inverted?-1:1)<-90)inp.jump=inp.jumpHeld=true;}}return;}
 if(b.recoverWeapon){delete b.recoverWeapon;b.navTarget=-1;}if(profile?.shot&&(l.cd.weapon||0)>0)inp.attack=inp.attackHeld=false;
 if(w==='yoyo'&&L.world(g).entities.some(e=>e.type==='yoyo'&&e.owner===f.id&&e.age<1.1)){inp.attackHeld=!defending&&!threat&&dist<260;}
 if(w==='gunblade'&&f.state==='active'&&f.stateTime<=.07&&!l.triggered&&clear&&dist<reach+60){inp.attack=true;inp.attackHeld=false;}
 if(free&&!defending&&!threat&&!inp.jump&&clear&&['yamato','ruyi','leviathan'].includes(w)&&(b.chargeAt||0)<=now){const range=w==='yamato'?dist>220&&dist<365:w==='ruyi'?dist>200&&dist<540:dist>200&&dist<620;if(range){b.chargeAt=now+1.1+g.random()*.6;b.holdWeapon=w;b.holdGoal=.32/g.rules.attackSpeed+(w==='yamato'?.06:0);inp.attack=inp.attackHeld=true;inp.dash=false;inp.aim=angle;inp.move=0;inp.legado=[];return;}}
 if(inp.attack&&['yamato','ruyi','leviathan'].includes(w)){b.holdWeapon=w;b.holdGoal=0;inp.attackHeld=false;}
 if(advanced&&has(f,'lunge')&&f.dashRemaining>0&&now-(l.lastDash??-100)<.07&&!threat&&clear&&dist<reach+140&&Math.cos(angle-Math.atan2(f.dashY,f.dashX))>.9){inp.attack=true;inp.attackHeld=false;}
 if(advanced&&free&&has(f,'iaijutsu')&&l.lastDashGround&&f.grounded&&f.dashRemaining<=0&&now>=(l.groundDashEnds??Infinity)&&now-l.groundDashEnds<.22&&!threat&&clear&&dist<reach+100){inp.attack=true;inp.attackHeld=false;inp.dash=false;}
 if(inp.legado?.includes('kamehameha')){if(threat||!clear||!free){inp.legado=[];}else{inp.attack=inp.attackHeld=inp.dash=inp.jump=inp.parry=inp.special=inp.kick=false;inp.move=0;inp.legadoHeld=['kamehameha'];}}
}
L.ai=(g,id,dt)=>{if(!g.legacyEnabled&&!g.pathEncounter)return null;const f=g.fighters[id],live=g.fighters[0];if(!f||f.dead)return D.neutral();const b=f.brain??={observations:[],decision:0,jump:0,jumpDelay:0,navTarget:-1,delay:0,parryRoll:1};const pol=g.getAIPolicy(),reaction=b.reaction??=pol.reaction[0]+g.random()*(pol.reaction[1]-pol.reaction[0]),now=g.time;
 if(!b.observations.length||now-b.observations.at(-1).at>.025)b.observations.push({at:now,x:live.x,y:live.y,vx:live.vx,vy:live.vy,state:live.state,grounded:live.grounded,platform:live.platform,inverted:!!live.legacy?.effects.inverted,facing:live.facing,reach:D.stats(live).reach,attackId:live.attackId,zones:observeZones(g,f),shots:L.world(g).entities.filter(e=>L.hostile(g,e.owner,f)&&e.lethal&&!e.zone&&e.life>e.age&&e.type!=='medusa'&&(e.type!=='hunter'||e.phase==='hunt'&&e.prey===f.id)&&(e.type!=='slimeking'||e.phase==='leap'&&e.vy>=0)&&Math.hypot(e.x-f.x,e.y-(f.y-65))<500).slice(0,8).map(e=>({id:e.id,x:e.x,y:e.y,vx:e.vx,vy:e.vy,parryable:e.parryable}))});while(b.observations.length>32)b.observations.shift();const seen=b.observations.filter(o=>o.at<=now-reaction).at(-1),inp=D.neutral();if(!seen)return inp;
 const p={...seen,x:seen.x+seen.vx*reaction*.65,y:seen.y+seen.vy*reaction*.65},dx=p.x-f.x,dy=p.y-f.y,dist=Math.hypot(dx,dy),side=Math.sign(dx)||1,s=D.stats(f),ranged=!L.mirrorWeapon(f)&&!!L.WEAPONS[L.weaponId(f)]?.shot,reach=ranged?L.weaponId(f)==='blunderbuss'?150:480:s.reach,advanced=['hard','master','impossible'].includes(g.difficulty),free=g.canAct(f),targetRange=f.style==='patient'?reach*.95:reach*.82;
 const nav=L.navigationFrame(g,f,p),nf=nav.actor,ndy=dy*nav.sign;inp.aim=Math.atan2(dy,dx);inp.jumpHeld=nf.vy<0;inp.move=dist>targetRange+35?side:dist<Math.max(48,s.minRange+12)?-side:0;b.decision-=dt;b.jump-=dt;b.delay-=dt;b.jumpDelay=(b.jumpDelay||0)-dt;
 if(g.pathEncounter&&id>1){const role=Math.floor(now/4+id)%3;if(role===1&&Math.sign(f.x-live.x)===Math.sign(g.fighters[1].x-live.x)&&dist<400){inp.move=side;if(f.grounded&&b.jump<=0){inp.jump=true;b.jump=.65;}}if(role===2&&dist<reach*.8)inp.move=-side;}
 if(p.attackId!==b.seenAttack){b.seenAttack=p.attackId;b.parryRoll=g.random();}
 const attacking=['startup','active','ultCharge'].includes(p.state),threat=attacking&&dist<p.reach+65,open=['recovery','parryRecovery','stunned','feintRecovery'].includes(p.state);
 if(threat&&free){if(b.parryRoll<pol.parry&&dist<p.reach+18&&p.state==='active'){inp.parry=true;inp.move=0;}else if(advanced&&f.dashCharges&&dist<p.reach+45){inp.dash=true;inp.move=-side;inp.up=!f.grounded&&dy>0;}else inp.move=-side;}
 if(p.state==='parry'&&f.state==='startup'&&advanced&&b.parryRoll<.65)inp.parry=true;
 if(free&&!inp.parry&&!inp.dash&&b.delay<=0&&dist<reach&&(!attacking||open)&&p.state!=='parry'){if(g.random()<pol.attack){inp.attack=true;inp.attackHeld=true;b.delay=.2+g.random()*.35;}else b.delay=.2;}
 if(b.decision<=0){b.decision=.22+g.random()*.3;b.bait=g.random()<(pol.bait||.13);}if(b.bait&&!threat&&!open&&dist<reach+80)inp.move=-side;
 let navigating=false;if(!f.legacy?.effects.weaponAway&&(dist>reach+25||Math.abs(dy)>100||b.navTarget>=0))navigating=L.navigate(g,f,p,inp);
 if(advanced&&!f.grounded&&nf.vy>-120&&ndy<-140&&f.airJumps>0&&b.jump<=0){inp.jump=true;inp.jumpHeld=true;b.jump=.45;}
 if(advanced&&!f.grounded&&ndy>160&&!threat)inp.down=true;
 if(advanced&&f.wallSide&&b.jump<=0){inp.jump=true;inp.move=-f.wallSide;inp.up=dy<0;b.jump=.35;}
 if(advanced&&free&&!inp.attack&&!inp.parry&&f.dashCharges>0&&dist>reach+100&&dist<reach+290){inp.dash=true;inp.up=!f.grounded&&dy<-70;inp.down=!f.grounded&&dy>120;}
 if(f.grounded&&ndy<-90&&b.jump<=0){inp.jump=inp.jumpHeld=true;b.jump=.65;}
 const shot=(seen.shots||[]).find(e=>Math.hypot(e.x-f.x,e.y-(f.y-65))<260&&(f.x-e.x)*e.vx+(f.y-65-e.y)*e.vy>0);if(shot&&free){if(b.shotId!==shot.id){b.shotId=shot.id;b.shotRoll=g.random();}inp.aim=Math.atan2(shot.y-(f.y-65),shot.x-f.x);if(shot.parryable&&b.shotRoll<pol.parry)inp.parry=true;else if(advanced){inp.jump=inp.jumpHeld=true;}}
 if(f.legacy&&free){const l=ensure(f);if(l.channel){inp.legadoHeld=[l.channel.id];if(l.channel.age>=2.1||threat)inp.legadoHeld=[];inp.attack=false;inp.move=0;}else if((b.abilityAt||0)<=now){b.abilityAt=now+.45+g.random()*.45;const w=L.world(g),own=e=>e.owner===f.id,ready=L.items(f).filter(k=>L.catalog[k].active&&L.scopeReady(f,k)),conditions={brokenmirror:!!l.copied&&!l.mirrorSpecial&&!f.ultMode&&dist<400,fireball:dist>130&&dist<650,falcon:dist>170&&dist<650,lightning:dist<330,pulse:dist<165,well:dist<450,star:dist<240,sandevistan:dist<340,room:dist<270,domain:dist<430,barrier:threat||dist<260,blink:threat||dist<80,impulse:dist>reach+60&&dist<400,dragon:dist>300,kraken:dist>170&&dist<550,mist:threat,web:dy<-100&&dist>150,telekinesis:w.entities.some(e=>e.type==='weapon'&&e.mode==='dropped'),weaponmaster:dist>reach+70&&dist<550&&!l.effects.weaponAway,portals:dist>200&&w.entities.filter(e=>own(e)&&e.type==='portal'&&e.life>e.age).length<2,kamehameha:dist>300,ice:dist>140&&dist<320,gust:dist>80&&dist<250,repulsor:threat&&dist<210,thehand:dist>90&&dist<230,amaterasu:p.grounded&&dist>180&&dist<450,shadowbomb:dist>170&&dist<450,swap:threat||dist>350,gravitycloak:gravityIntent(g,f,p)};const ability=ready.find(k=>conditions[k]);if(ability&&g.random()<(advanced?.8:.38)){inp.legado=[ability];if(ability==='blink')inp.aim=Math.atan2(-60,-side*180);if(ability==='portals')inp.aim=Math.atan2(150,side*240);if(ability==='amaterasu')inp.aim=Math.atan2(dy+D.body(f).center,dx);}}}
 if(g.rules.specials&&free&&f.specialCharge>=g.rules.specialCooldown&&dist<reach+160)inp.special=true;legacyIntent(g,f,p,inp,{threat,shot,free,advanced,dist,reach,navigating});avoidZones(g,f,inp,seen);
 if(!navigating&&f.grounded&&Math.abs(inp.move)>.1){const ahead=f.x+inp.move*(inp.dash?150:65),supported=nav.map.platforms.some(q=>q.stage!=='gone'&&ahead>=q.x+8&&ahead<=q.x+q.w-8&&Math.abs(q.y-nf.y)<35);if(!supported){inp.dash=false;if(b.jump<=0&&nav.map.platforms.some(q=>q.stage!=='gone'&&Math.abs(q.x+q.w/2-f.x)<420&&q.y>nf.y-230)){inp.jump=inp.jumpHeld=true;b.jump=.45;}else inp.move=0;}}
 if(!f.grounded&&nf.vy>0&&!navigating){const below=nav.map.platforms.filter(q=>q.stage!=='gone'&&q.y>=nf.y-10);if(below.length&&!below.some(q=>f.x>q.x+12&&f.x<q.x+q.w-12)){const near=below.sort((a,b)=>Math.abs(D.clamp(f.x,a.x+24,a.x+a.w-24)-f.x)-Math.abs(D.clamp(f.x,b.x+24,b.x+b.w-24)-f.x))[0];inp.move=Math.sign(D.clamp(f.x,near.x+24,near.x+near.w-24)-f.x);}}
 if(inp.legado?.includes('gravitycloak')){inp.jump=inp.jumpHeld=inp.dash=inp.up=inp.down=false;}if(inp.dash)inp.jump=false;return inp;
};
root.DuelPath={Run,Saves,ARENAS,BOSSES,ARENA_IDS};if(typeof module!=='undefined')module.exports=root.DuelPath;
})(globalThis);

