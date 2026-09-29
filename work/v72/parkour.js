(function(root){
'use strict';
const D=typeof module!=='undefined'?require('./engine.js'):root.DuelCore,{clamp,neutral,body,stats}=D,copy=o=>JSON.parse(JSON.stringify(o));
const TRACKS={};
function track(id,name,theme,width,height,platforms,walls,start,checkpoints,finish,routes){const m=D.cleanMap({format:'um-corte-map',version:1,id:'custom_race_'+id,type:'parkour',name,description:{wind:'Ventos da costa. Passagens baixas, saltos e atalhos sobre os portais.',spire:'Suba o pagode. Paredes, patamares e quedas com retorno rápido.',foundry:'Uma travessia sobre brasas. Elevadores e caminhos de risco.'}[id],width,height,theme,platforms,walls,spawns:[start,{x:start.x+40,y:start.y}],race:{start,checkpoints:checkpoints.map((p,i)=>({...p,order:i+1})),finish,routes},ground:theme==='forge'?'#716068':'#6e907c',weather:theme==='forge'?'embers':'leaves',decor:[],background:{layers:[],tint:'#17323b',shade:.12}});m.builtinRace=true;TRACKS[m.id]=m;D.MAPS[m.id]=m;return m;}
const ground=(x,y,w)=>({x,y,w,solid:true});
// Courses are authored as playable legs; checkpoint routes follow those same legs.
// Optional upper lines are shortcuts, never required to recover from a fall.
function course(id,name,theme,width,height,legs,checkpointIndices,walls=[],extras=[]){
 const primary=legs.map(([x,y,w,solid=true])=>({x,y,w,solid}));
 const points=primary.map(p=>({x:p.x+p.w/2,y:p.y}));
 const start={x:primary[0].x+130,y:primary[0].y},finish={x:primary.at(-1).x+primary.at(-1).w-100,y:primary.at(-1).y};
 const checkpoints=checkpointIndices.map(i=>points[i]),routes=[];let from=0,anchor=start;
 for(const i of [...checkpointIndices,primary.length-1]){const end=i===primary.length-1?finish:points[i];routes.push([anchor,...points.slice(from+1,i),end]);anchor=end;from=i;}
 return track(id,name,theme,width,height,[...primary,...extras],walls,start,checkpoints,finish,routes);
}
course('wind','Caminho dos Ventos','sanctuary',16400,1280,[
 [30,770,750],[925,710,570],[1675,770,650],[2490,670,600],[3240,770,720],[4150,710,580],[4900,770,650],[5720,680,1100],
 // Coastal gateways: fast low passages with an upper bypass.
 [6990,770,740],[7900,710,550],[8640,650,700],[9520,770,630],
 // Broken causeway: broad gaps reward a second impulse or a timed air dash.
 [10350,710,450],[11030,650,460],[11720,770,820],
 // The final ascent and a downhill run through the last gate.
 [12730,620,430],[13360,450,470],[14040,610,590],[14820,770,560],[15570,680,700]
 ],[2,4,6,9,11,14,17],[
 {x:550,y:500,w:180,h:204},{x:3600,y:485,w:190,h:219},{x:6090,y:410,w:190,h:204},
 {x:7250,y:480,w:220,h:224},{x:8980,y:385,w:180,h:199},{x:12070,y:485,w:190,h:219},{x:15000,y:485,w:160,h:219}
 ],[{x:1250,y:530,w:240},{x:2110,y:555,w:240},{x:3500,y:560,w:230},{x:5190,y:560,w:230},
 {x:6750,y:490,w:220},{x:7540,y:490,w:240},{x:8290,y:460,w:250},{x:9210,y:440,w:230},
 {x:10030,y:475,w:250},{x:10720,y:400,w:200},{x:11410,y:420,w:240},{x:13720,y:270,w:210}]);

// Four connected pagodes, each with its own rhythm and a horizontal terrace.
const spireLegs=[[120,8050,1180]],spireWalls=[],spireExtras=[];
const sections=[
 {base:8050,left:300,right:640,heights:[165,165,180,180,280,155,180,170,180,170]},
 {base:6225,left:810,right:1150,heights:[175,180,160,280,180,170,180,160,180,170]},
 {base:4390,left:390,right:750,heights:[180,170,290,170,180,180,170,180,170,180]},
 {base:2520,left:950,right:1280,heights:[170,180,170,290,170,180,180,170,180,180]}
],spireCP=[];
for(let k=0;k<sections.length;k++){
 const q=sections[k];let y=q.base;
 for(let n=0;n<q.heights.length;n++){y-=q.heights[n];const x=n%2?q.right:q.left;
 spireLegs.push([x,y,n===q.heights.length-1?380:270,false]);
 if(n===4||n===9)spireCP.push(spireLegs.length-1);
 }
 const low=q.base-650,top=y+260;spireWalls.push({x:q.left-75,y:top,w:28,h:low-top},{x:q.right+410,y:top,w:28,h:low-top});
 if(k<3){const next=sections[k+1];spireLegs.push([Math.min(q.right,next.left),next.base,Math.abs(next.left-q.right)+340,false]);}
 // Small ledges near the walls make an alternate wall-jump route possible.
 for(let n=1;n<5;n++)spireExtras.push({x:q.left-45,y:q.base-n*345,w:115});
}
spireCP.pop();
course('spire','Escadaria do Céu','tower',1900,8400,spireLegs,spireCP,spireWalls,spireExtras);

course('foundry','Rota das Brasas','forge',19400,2920,[
 [30,1640,650],[800,1480,260,false],[1220,1320,260,false],[1610,1160,510],[2260,1000,240,false],[2650,840,240,false],[3050,680,600],
 [3810,840,220,false],[4200,1000,400],[4740,1160,240,false],[5140,1320,430],[5720,1160,250,false],[6110,1000,510],[6760,840,260,false],[7180,680,590],
 // Furnace galleries: a descent, low beam and two climbing shafts.
 [7940,940,430],[8540,1230,470],[9200,1510,540],[9930,1340,270,false],[10390,1060,300,false],[10870,800,480],
 [11530,980,280,false],[12020,1250,380],[12580,1530,400],[13160,1790,450],[13800,1590,260,false],[14260,1320,270,false],
 [14730,1060,550],[15450,850,310,false],[15940,590,410],[16550,810,410],[17140,1050,440],
 // Safe lower route versus a chain of fragile shelves over the final furnace.
 [17770,1270,420],[18380,1040,260,false],[18820,790,450]
 ],[3,6,10,12,15,17,20,24,27,31],[
 {x:3060,y:410,w:30,h:140},{x:7600,y:310,w:30,h:235},{x:9600,y:1210,w:100,h:234},
 {x:10340,y:660,w:28,h:160},{x:14700,y:1060,w:28,h:580},{x:17260,y:770,w:170,h:214}
 ],[{x:2220,y:1180,w:220,motion:{x:530,y:-340,period:3.5,pause:.6,route:true}},
 {x:3590,y:680,w:170,fragile:{delay:.6,respawn:3}},{x:3870,y:620,w:180,fragile:{delay:.6,respawn:3}},{x:4170,y:720,w:210},
 {x:5580,y:1330,w:170,motion:{x:410,y:-220,period:3,pause:.5,route:true}},
 {x:8230,y:730,w:200,fragile:{delay:.55,respawn:3}},{x:8590,y:830,w:180,fragile:{delay:.55,respawn:3}},{x:8910,y:1020,w:190},
 {x:10230,y:1320,w:180,motion:{x:500,y:-500,period:4,pause:.7,route:true}},
 {x:11880,y:770,w:190,fragile:{delay:.55,respawn:3}},{x:12220,y:960,w:170,fragile:{delay:.55,respawn:3}},
 {x:14030,y:1710,w:170,motion:{x:360,y:-510,period:3.8,pause:.5,route:true}},
 {x:17740,y:790,w:190,fragile:{delay:.5,respawn:3}},{x:18090,y:720,w:180,fragile:{delay:.5,respawn:3}},{x:18430,y:610,w:190,fragile:{delay:.5,respawn:3}}]);
function cleanOptions(o={}){return{contact:!!o.contact,allClasses:!!o.allClasses,afterFirst:clamp(Number.isFinite(+o.afterFirst)?+o.afterFirst:30,5,180)};}
function crossed(a,b,g){const left=g.x-g.w/2,right=g.x+g.w/2,top=g.y-g.h,bottom=g.y+10;let lo=0,hi=1;for(const [p,d,min,max]of[[a.x,b.x-a.x,left,right],[a.y-40,b.y-a.y,top,bottom]]){if(Math.abs(d)<1e-9){if(p<min||p>max)return false;}else{const t1=(min-p)/d,t2=(max-p)/d;lo=Math.max(lo,Math.min(t1,t2));hi=Math.min(hi,Math.max(t1,t2));}}return lo<=hi;}
function segmentProgress(p,points){let best=Infinity,progress=0,total=0,walk=0;for(let i=1;i<points.length;i++)total+=Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y);for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy),u=clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/(len*len||1),0,1),dist=Math.hypot(p.x-a.x-dx*u,p.y-a.y-dy*u);if(dist<best){best=dist;progress=walk+len*u;}walk+=len;}return clamp(progress/(total||1),0,.99999);}
class Race extends D.Game{
 constructor(o={}){super({mode:'local',ai:false,mapId:'dojo'});this.setup(o);}
 setup(o){this.mode='parkour';this.mapSource=D.cleanMap(o.mapData||D.MAPS[o.mapId]||Object.values(TRACKS)[0]);if(this.mapSource.type!=='parkour')throw Error('Escolha uma pista de Parkour.');this.mapId=this.mapSource.id;this.map=D.makeMap(this.mapId,1,this.mapSource);this.rules=D.cleanRules({...o.rules,specials:false,chaos:'off',mapSize:1});this.baseRules={...this.rules};this.options=cleanOptions(o.options);this.timeOfDay=o.timeOfDay||'day';this.difficulty=D.DIFFICULTIES[o.difficulty]?o.difficulty:'normal';this.members=(o.members?.length?o.members:[{name:'Você',kind:'runner',color:'jade'}]).slice(0,8).map((p,i)=>({name:String(p.name||'Corredor '+(i+1)).slice(0,24),kind:this.options.allClasses&&D.CLASSES[p.kind]?p.kind:'runner',color:D.COLORS[p.color]?p.color:Object.keys(D.COLORS)[i],skin:D.cleanSkin(p.kind,p.skin),bot:!!p.bot}));this.characters=this.members.map(p=>p.kind);this.colors=this.members.map(p=>p.color);this.skins=this.members.map(p=>p.skin);this.start();}
 emit(type,data={}){this.events??=[];this.events.push({type,...data});}
 start(){if(!this.members)return;this.phase='countdown';this.countTicks=1800;this.ticks=0;this.time=0;this.round=1;this.score=this.members.map(()=>0);this.hitstop=0;this.events=[];this.deadline=null;this.results=[];this.routeCache=new Map();this.propStates=[];this.fighters=this.members.map((p,id)=>{const f=D.makeFighter(id,p.kind,p.color,this.mapSource.race.start);this.resetSpecial(f);Object.assign(f,{parkour:true,skin:p.skin,name:p.name,bot:p.bot,admin:{},dashCharges:this.rules.dashCount,airDashes:0,checkpoint:0,progress:0,respawn:0,protection:1,finished:false,dnf:false,falls:0,aiRace:{}});return f;});this.map=D.makeMap(this.mapId,1,this.mapSource);this.updatePlatforms(0,false);this.emit('raceStart');}
 attack(){return false;}parry(){return false;}special(){return false;}tickSpecial(){}resolveCombat(){}separateBodies(){}
 kick(id){const f=this.fighters[id];if(!this.options.contact||!this.canAct(f)||f.kickCooldown>0)return false;f.protection=0;return super.kick(id);}
 respawnRunner(f){const cp=f.checkpoint?this.mapSource.race.checkpoints[f.checkpoint-1]:this.mapSource.race.start;Object.assign(f,{x:cp.x,y:cp.y,vx:0,vy:0,grounded:true,platform:this.map.platforms.findIndex(p=>cp.x>=p.x&&cp.x<=p.x+p.w&&Math.abs(cp.y-p.y)<3),dead:false,state:'idle',stateTime:0,duration:0,dashRemaining:0,slideRemaining:0,wallSide:0,lastWall:-1,wallReleased:true,wallLock:0,dashCharges:this.rules.dashCount,dashCooldown:0,airDashes:0,airUsed:false,airJumps:1,doubleJumpTime:0,jumping:false,protection:1,aiRace:{},tauntTime:0});this.emit('respawn',{id:f.id,x:f.x,y:f.y});}
 fall(f){if(f.respawn||f.finished||f.dnf)return;f.falls++;f.respawn=.5;f.dead=true;f.deathTime=0;f.vx=f.vy=0;this.emit('raceFall',{id:f.id,x:f.x,y:f.y});}
 finishRunner(f){if(f.finished||f.dnf)return;f.finished=true;f.finishMs=Math.round(this.ticks*1000/600);f.place=this.results.length+1;this.results.push(f.id);f.state='idle';f.vx=f.vy=0;if(this.deadline===null)this.deadline=this.ticks+Math.round(this.options.afterFirst*600);this.emit('raceFinish',{id:f.id,place:f.place,time:f.finishMs});}
 drop(id){const f=this.fighters[id];if(f&&!f.finished){f.dnf=true;f.dead=true;}this.checkEnd();}
 checkEnd(){if(this.deadline!==null&&this.ticks>=this.deadline)for(const f of this.fighters)if(!f.finished)f.dnf=true;if(this.fighters.every(f=>f.finished||f.dnf)){this.phase='raceEnd';this.emit('raceEnd');}}
 step(dt,inputs=[]){if(!(dt>0)||this.phase==='raceEnd')return;if(this.phase==='countdown'){this.countTicks--;if(this.countTicks<=0){this.phase='playing';this.emit('raceGo');}return;}if(this.phase!=='playing')return;this.ticks++;this.time=this.ticks/600;this.updatePlatforms(this.time);const before=this.fighters.map(f=>({x:f.x,y:f.y}));
  for(const f of this.fighters){if(f.finished||f.dnf)continue;if(f.respawn>0){f.respawn=Math.max(0,f.respawn-dt);if(!f.respawn)this.respawnRunner(f);continue;}let c=f.bot?this.botInput(f,dt):{...neutral(),...inputs[f.id]};c.attack=c.parry=c.special=c.attackHeld=false;f.protection=Math.max(0,f.protection-dt);this.tickState(f,dt);f.aim=Number.isFinite(c.aim)?c.aim:f.aim;f.facing=D.aimSide(f.aim,f.facing);if(c.dash)this.command(f.id,'dash',c);if(c.kick)this.kick(f.id);if(f.queued&&this.canAct(f)){const q=f.queued;this.command(f.id,q.action,q);}if(c.move||c.jump||c.dash||c.kick||f.state!=='idle'||!f.grounded)f.tauntTime=0;else if(c.taunt)f.tauntTime=.9;else f.tauntTime=Math.max(0,(f.tauntTime||0)-dt);this.moveFighter(f,c,dt);if(f.y>this.map.deathY){this.fall(f);continue;}const cp=this.mapSource.race.checkpoints[f.checkpoint];if(cp&&crossed(before[f.id],f,cp)){f.checkpoint++;this.emit('checkpoint',{id:f.id,index:f.checkpoint,x:f.x,y:f.y});f.aiRace={};}else if(!cp&&crossed(before[f.id],f,this.mapSource.race.finish))this.finishRunner(f);f.progress=segmentProgress(f,this.mapSource.race.routes[Math.min(f.checkpoint,this.mapSource.race.routes.length-1)]);}
  if(this.options.contact)for(const a of this.fighters){if(a.state!=='kickActive'||a.kickHit||a.finished||a.dnf)continue;for(const b of this.fighters){if(a===b||b.dead||b.finished||b.dnf||b.protection>0)continue;if((b.x-a.x)*a.kickSide<0||Math.abs(b.x-a.x)>72||Math.abs(b.y-a.y)>65)continue;if(this.map.walls.some(w=>a.y-50>w.y&&a.y-50<w.y+w.h&&Math.min(a.x,b.x)<w.x+w.w&&Math.max(a.x,b.x)>w.x))continue;a.kickHit=true;this.setState(b,'pushed',.10);b.vx=a.kickSide*330;b.vy=Math.min(b.vy,-70);b.grounded=false;this.emit('kick',{id:a.id,x:b.x,y:b.y-50});}}
  this.checkEnd();
 }
 ranking(){return[...this.fighters].sort((a,b)=>a.finished&&b.finished?a.place-b.place:a.finished?-1:b.finished?1:a.dnf!==b.dnf?(a.dnf?1:-1):b.checkpoint-a.checkpoint||b.progress-a.progress||a.id-b.id).map((f,i)=>({id:f.id,name:f.name,place:f.place||i+1,checkpoint:f.checkpoint,progress:f.progress,finished:f.finished,dnf:f.dnf,time:f.finishMs??Math.round(this.ticks*1000/600),falls:f.falls}));}
 botInput(f,dt){const c=neutral(),a=f.aiRace||(f.aiRace={}),difficulty=this.difficulty,skill=Math.min(1,({easy:.74,normal:.82,adaptive:.87,impossible:.97,master:1}[difficulty]||.82)+(f.falls>0?.12:0)-(f.id%3)*.007);c.jumpHeld=true;const gate=this.mapSource.race.checkpoints[f.checkpoint]||this.mapSource.race.finish;
  // Plan only at a landing. Every edge describes a physical jump, never a teleport.
  if(f.grounded&&(!a.path||a.platform!==f.platform||a.age>.6)){a.path=this.path(f,gate,skill);a.platform=f.platform;a.age=0;}a.age=(a.age||0)+dt;
  let target=a.path?.[0];if(target&&f.grounded&&f.platform===target.id){a.path.shift();target=a.path[0];}const p=target?this.map.platforms[target.id]:null,tx=p?clamp(f.x,p.x+35,p.x+p.w-35):gate.x,ty=p?p.y:gate.y,dx=tx-f.x,dy=ty-f.y,dir=Math.sign(dx)||Math.sign(gate.x-f.x)||1;c.move=Math.abs(dx)>12?dir*skill:0;c.aim=dir<0?Math.PI:0;
  const floor=this.map.platforms[f.platform],edge=floor?(dir>0?floor.x+floor.w-f.x:f.x-floor.x):999;
  if(f.grounded){const gap=p&&floor&&(p.x>floor.x+floor.w||p.x+p.w<floor.x),rising=dy<-35;if(rising&&Math.abs(dx)<300||gap&&edge<75||!floor||edge<35)c.jump=true;if(!rising&&!gap&&Math.abs(dx)>230&&edge>230&&skill>.8)c.dash=true;const overhead=this.map.walls.find(w=>w.x<f.x+dir*140+40&&w.x+w.w>f.x+dir*140-40&&w.y+w.h>f.y-115&&w.y+w.h<f.y-40);if(overhead){c.down=true;c.dash=true;c.jump=false;}else{const barrier=this.map.walls.find(w=>w.x<f.x+dir*70+16&&w.x+w.w>f.x+dir*70-16&&w.y<f.y-45&&w.y+w.h>f.y-45);if(barrier&&dy<-30)c.jump=true;if(p&&floor&&dy>60&&f.x>p.x&&f.x<p.x+p.w){if(!floor.solid){c.down=true;c.jump=true;c.jumpHeld=false;c.dash=false;}else{c.move=(Math.abs(f.x-floor.x)<Math.abs(f.x-floor.x-floor.w)?-1:1)*skill;}}}}
  else{if(p){const near=f.x>p.x+20&&f.x<p.x+p.w-20;if(near){c.move=clamp((p.x+p.w/2-f.x)/65,-1,1)*skill;if(f.y<=p.y&&f.vy>0)c.down=skill>.8;}if(f.airJumps>0&&f.vy>-130&&f.dashRemaining<=0&&(f.y>p.y-45||!near&&Math.abs(dx)>100)){c.jump=true;c.down=false;c.jumpHeld=true;}else if(f.vy>-80&&f.vy<300&&!near&&Math.abs(dx)>85&&skill>.75){c.dash=true;c.up=dy<-100;}}if(f.wallSide&&dy>35){c.move=-f.wallSide*skill;c.down=true;c.jump=false;c.dash=false;}if(f.wallSide&&dy<-50){c.move=f.wallSide;c.up=true;if(f.wallLock<=0&&(f.wallId!==f.lastWall||f.wallReleased)){c.jump=true;a.wallAt=this.time;}}}
  if(a.launch&&this.time-a.launch<.12)c.jump=false; // one edge per landing; held jump controls height
  if(c.jump){a.launch=this.time;c.dash=false;}
  return c;
 }
 path(f,gate,skill,allowMoving=false){const ps=this.map.platforms,n=ps.length,start=f.platform,target=ps.findIndex(p=>gate.x>=p.x&&gate.x<=p.x+p.w&&Math.abs(gate.y-p.y)<4);if(start<0||target<0||start===target)return[];const cost=Array(n).fill(Infinity),prev=Array(n).fill(-1),open=new Set([start]);cost[start]=0;while(open.size){let u=-1;for(const v of open)if(u<0||cost[v]<cost[u])u=v;open.delete(u);if(u===target)break;const p=ps[u];for(let v=0;v<n;v++){const q=ps[v];if(v===u||q.stage==='gone'||q.motion&&!allowMoving)continue;const gap=Math.max(0,q.x-(p.x+p.w),p.x-(q.x+q.w)),dy=q.y-p.y,maxGap=dy<-230?215:dy<-80?240:dy>50?450:400;if(dy<-370||dy>760||gap>maxGap)continue;if(this.map.walls.some(w=>w.y<Math.min(p.y,q.y)-55&&w.y+w.h>Math.max(p.y,q.y)-55&&w.x>p.x+p.w-12&&w.x+w.w<q.x+12))continue;const c=cost[u]+Math.abs(q.x+q.w/2-p.x-p.w/2)*.002+Math.abs(dy)*.003+1+(q.fragile?(1-skill)*8:.0)+(q.motion?2:0);if(c<cost[v]){cost[v]=c;prev[v]=u;open.add(v);}}}if(prev[target]<0)return allowMoving?[]:this.path(f,gate,skill,true);const result=[];for(let v=target;v!==start&&v>=0;v=prev[v]){result.unshift({id:v});if(result.length>n)return[];}return result;}
 snapshot(){return copy({version:72,type:'parkour',mapId:this.mapId,mapData:this.mapSource,options:this.options,rules:this.rules,members:this.members,difficulty:this.difficulty,timeOfDay:this.timeOfDay,ticks:this.ticks,time:this.time,countTicks:this.countTicks,phase:this.phase,deadline:this.deadline,results:this.results,fighters:this.fighters,adminSpeed:this.adminSpeed||1,platformStates:this.map.platforms.map(p=>({stage:p.stage,crumbleAt:p.crumbleAt,goneAt:p.goneAt}))});}
 loadSnapshot(s){if(s?.version!==72||s.type!=='parkour'||!Array.isArray(s.fighters)||s.fighters.length<1||s.fighters.length>8)return false;this.setup(s);for(const k of['ticks','time','countTicks','phase','deadline','results','fighters','adminSpeed'])this[k]=copy(s[k]);s.platformStates?.forEach((p,i)=>Object.assign(this.map.platforms[i]||{},p));this.rules=D.cleanRules(s.rules,true);this.baseRules={...this.rules};this.characters=this.fighters.map(f=>f.kind);this.colors=this.fighters.map(f=>f.color);this.skins=this.fighters.map(f=>f.skin);this.updatePlatforms(this.time,false);this.events=[];return true;}
}
const api={Race,TRACKS,cleanOptions,crossed,segmentProgress,formatTime:ms=>{const n=Math.max(0,Math.floor(ms));return String(Math.floor(n/60000)).padStart(2,'0')+':'+String(Math.floor(n/1000)%60).padStart(2,'0')+'.'+String(n%1000).padStart(3,'0');}};if(typeof module!=='undefined')module.exports=api;root.DuelParkour=api;
})(typeof globalThis!=='undefined'?globalThis:this);
