const A=require('node:assert/strict');require('./bootstrap.cjs');const D=global.DuelCore,L=global.DuelLegacy,P=global.DuelPath;let count=0;
function test(name,fn){try{fn();console.log('PASS',name);count++;}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1;}}
function game(items=[]){const g=new D.Game({mode:'local',ai:false,seed:52,random:L.rng(52),rules:{specials:false}});g.start({legacies:[items,[]]});g.phase='playing';g.map.platforms=[{x:0,y:700,w:2400,baseX:0,baseY:700,stage:'solid',solid:true}];g.map.walls=[];g.fighters.forEach((f,i)=>Object.assign(f,{x:300+i*700,y:700,grounded:true,platform:0,aim:i?Math.PI:0}));g.legacyWorld={entities:[],effects:[],serial:0,time:0};return g;}
function advance(g,t){for(let i=0;i<Math.ceil(t*600);i++){g.time+=1/600;L.worldStep(g,1/600);}}
test('web respects aim and nearest wall, cannot grab an arbitrary nearby enemy',()=>{
 const g=game(['web']),f=g.fighters[0],t=g.fighters[1];t.x=450;A(!L.activate(g,f,'web',{aim:Math.PI}));A(!f.legacy.cd.web);g.map.walls=[{x:380,y:0,w:30,h:700}];A(L.activate(g,f,'web',{aim:0}));A.equal(f.legacy.grapple.type,'wall');A.equal(f.legacy.grapple.x,380);advance(g,.3);A.equal(t.vx,0);
});
test('web pulls a hit enemy after telegraph and can be parried',()=>{
 for(const parry of [false,true]){const g=game(['web']),f=g.fighters[0],t=g.fighters[1];t.x=450;if(parry){t.aim=Math.PI;A(g.parry(1));}A(L.activate(g,f,'web',{aim:0}));advance(g,.05);A.equal(t.vx,0);advance(g,.1);if(parry){A.equal(t.state,'idle');A.equal(t.vx,0);}else A(t.vx<0);A(!t.dead);}
});
test('moving grapple follows its platform and releases on collapse',()=>{
 const g=game(['web']),f=g.fighters[0];g.map.platforms.push({x:200,y:400,w:300,stage:'solid'});A(L.activate(g,f,'web',{aim:-Math.PI/2}));const anchor=f.legacy.grapple;A.equal(anchor.index,1);g.map.platforms[1].x+=40;g.map.platforms[1].y-=20;L.afterMove(g,f,D.neutral(),.01);A.equal(anchor.x,340);A.equal(anchor.y,380);g.map.platforms[1].stage='gone';L.afterMove(g,f,D.neutral(),.01);A.equal(f.legacy.grapple,null);
});
test('web and telekinesis retrieve a physical weapon without changing ownership',()=>{
 for(const power of ['web','telekinesis']){const g=game([power]),f=g.fighters[0],t=g.fighters[1],p=L.entity(g,t,'weapon',{x:460,y:L.center(f).y,mode:'dropped',weapon:'sword',originalOwner:1,life:120});A(L.activate(g,f,power,{aim:0}));A.equal(p.mode,'fetch');A.equal(p.fetch,0);A.equal(p.originalOwner,1);A(!L.has(f,'sword'));advance(g,.2);A(Math.abs(p.x-f.x)<50);}
});
test('telekinesis does not pull players or reach through walls',()=>{
 const g=game(['telekinesis']),f=g.fighters[0];g.fighters[1].x=430;A(!L.activate(g,f,'telekinesis',{aim:0}));L.entity(g,g.fighters[1],'weapon',{x:500,y:L.center(f).y,mode:'dropped',life:120});g.map.walls=[{x:380,y:0,w:30,h:700}];A(!L.activate(g,f,'telekinesis',{aim:0}));
});
test('ice empty-air casts fail; floor creates slick ground without an extra platform',()=>{
 const g=game(['ice']),f=g.fighters[0];A(!L.activate(g,f,'ice',{aim:-Math.PI/2}));A(!f.legacy.cd.ice);A(L.activate(g,f,'ice',{aim:Math.PI/2}));advance(g,.3);A.equal(g.map.platforms.length,1);A.equal(L.world(g).entities[0].iceKind,'ground');A(L.friction(g,f)<.1);const ordinary=game();f.vx=ordinary.fighters[0].vx=300;g.moveFighter(f,D.neutral(),.01);ordinary.moveFighter(ordinary.fighters[0],D.neutral(),.01);A(f.vx>ordinary.fighters[0].vx+100);advance(g,4);A.equal(L.friction(g,f),1);
});
test('wall ice appears after warning, supports feet, expires and survives snapshots',()=>{
 const g=game(['ice']),f=g.fighters[0];g.map.walls=[{x:500,y:0,w:40,h:700}];A(L.activate(g,f,'ice',{aim:0}));advance(g,.1);A.equal(g.map.platforms.length,1);advance(g,.15);A.equal(g.map.platforms.length,2);const platform=g.map.platforms[1];A.equal(platform.x,370);A.equal(platform.w,130);const h=new D.Game();A(h.loadSnapshot(g.snapshot()));A(h.map.platforms.some(p=>p.legacyEntity===platform.legacyEntity));f.platform=1;f.grounded=true;advance(g,4);A.equal(platform.stage,'gone');A.equal(f.grounded,false);A.equal(f.platform,-1);
});
test('ice directly hitting a body briefly roots without killing or spawning geometry',()=>{
 const g=game(['ice']),f=g.fighters[0],t=g.fighters[1];t.x=450;t.vx=200;A(L.activate(g,f,'ice',{aim:0}));advance(g,.15);A(!t.dead);A.equal(t.vx,0);A.equal(t.duration,.12);A.equal(g.map.platforms.length,1);A(!g.fighters[0].legacy.effects.frost);
});
test('lightning chains through distinct nearby group enemies with separate warnings',()=>{
 const run=new P.Run({seed:5});run.level=40;run.encounter={level:40,arena:'path_imperial',seed:5,fighters:Array.from({length:3},()=>({kind:'knight',build:[]}))};const g=run.game(),f=g.fighters[0];g.phase='playing';g.map.walls=[];g.map.platforms=[];g.fighters.forEach((t,i)=>Object.assign(t,{x:300+i*145,y:600,state:'idle'}));L.add(f,'lightning');A(L.activate(g,f,'lightning',{aim:0}));advance(g,.24);A(g.fighters.slice(1).every(t=>!t.dead));advance(g,.03);A(g.fighters[1].dead);A(!g.fighters[2].dead);advance(g,.4);A(g.fighters.slice(1).every(t=>t.dead));A.equal(g.score[0],1);
});
test('parry prevents lightning propagation and scene walls stop initial targeting',()=>{
 const g=game(['lightning']),f=g.fighters[0],t=g.fighters[1];t.x=450;g.map.walls=[{x:370,y:0,w:30,h:700}];A(!L.activate(g,f,'lightning',{aim:0}));g.map.walls=[];t.aim=Math.PI;A(g.parry(1));A(L.activate(g,f,'lightning',{aim:0}));advance(g,.3);A(!t.dead);A.equal(t.state,'idle');A(!L.world(g).entities.some(e=>e.type==='lightning'));
});
test('ROOM exchanges with a thrown weapon in its sphere, with telegraph and retained ownership',()=>{
 const g=game(['room']),f=g.fighters[0],t=g.fighters[1],from=L.center(f);A(L.activate(g,f,'room'));f.legacy.cd.room=0;const w=L.entity(g,t,'weapon',{x:480,y:from.y,mode:'dropped',weapon:'sword',originalOwner:1,life:120});A(L.activate(g,f,'room',{aim:0}));advance(g,.2);A.equal(f.x,300);advance(g,.11);A.equal(f.x,480);A.equal(w.x,300);A.equal(w.originalOwner,1);A(!L.has(f,'sword'));
});
test('ROOM refuses hazards, void destinations and targets leaving the sphere during warning',()=>{
 for(const scenario of ['hazard','void','escape']){const g=game(['room']),f=g.fighters[0],t=g.fighters[1];t.x=500;A(L.activate(g,f,'room'));f.legacy.cd.room=0;A(L.activate(g,f,'room',{aim:0}));if(scenario==='hazard')L.entity(g,t,'blackfire',{x:500,y:L.center(f).y,zone:true,lethal:true,parryable:false,r:80,life:3,warn:0});if(scenario==='void')g.map.platforms[0].w=380;if(scenario==='escape')t.x=950;advance(g,.31);A.equal(f.x,300,scenario);}
});
test('portal and surface fire retain their entity identity after shared targeting changes',()=>{
 const g=game(['portals','amaterasu']),f=g.fighters[0];g.map.walls=[{x:500,y:0,w:40,h:700}];A(L.activate(g,f,'portals',{aim:0}));A(L.world(g).entities.some(e=>e.type==='portal'));A(L.activate(g,f,'amaterasu',{aim:0}));A(L.world(g).entities.some(e=>e.type==='blackfire'));
});
test('active power timelines resume identically from snapshots through the real motor',()=>{
 for(const power of ['web','ice','lightning','room']){const g=new D.Game({mode:'local',ai:false,seed:72,random:L.rng(72),rules:{specials:false}});g.start({legacies:[[power],[]]});g.phase='playing';const f=g.fighters[0],t=g.fighters[1];t.x=f.x+150;t.y=f.y;f.aim=0;A(L.activate(g,f,power,{aim:power==='ice'?Math.PI/2:0}));if(power==='room'){f.legacy.cd.room=0;A(L.activate(g,f,power,{aim:0}));}for(let i=0;i<8;i++)g.step(1/600,[D.neutral(),D.neutral()]);const h=new D.Game();A(h.loadSnapshot(g.snapshot()));for(let i=0;i<480;i++){g.step(1/600,[D.neutral(),D.neutral()]);h.step(1/600,[D.neutral(),D.neutral()]);}A.deepEqual(h.snapshot(),g.snapshot(),power);}
});
console.log(count+' V8 contextual powers groups passed');
