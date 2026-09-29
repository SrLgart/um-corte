const {chromium}=require('C:/Users/Luiz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const A=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.stack));await page.goto('http://127.0.0.1:4189/um-corte-v8.html');
  const result=await page.evaluate(async()=>{
   const D=DuelCore,L=DuelLegacy,P=DuelPath,run=new P.Run({seed:4317});run.level=46;
   const ids=['echo','wingboot','sandals','kneepads','climbing','lightcape','duelistband','mirrorcloak','crystal','rockets','warbell','crackedglass','wolftooth','irontalisman','incense','counter','projectilecut','raven','beetle','fairy','hound','lantern','falcon','spectral','skeleton','doppel','legion','kraken','fireball','well','barrier','room','domain'];
   for(const id of ids){if(!L.catalog[id])throw Error('Unknown stress legacy '+id);L.add({legacy:run.inventory},id);}
   const g=run.game();g.phase='playing';g.entryRemaining=0;
   const floor=g.map.platforms.find(p=>p.solid&&!p.wallTop);
   for(const f of g.fighters){f.x=g.map.width/2-240+f.id*150;f.y=floor.y;f.grounded=true;f.platform=g.map.platforms.indexOf(floor);f.state='idle';}
   // The three opponents retain their generated late-game builds and normal AI.
   // Suppress fatal resolution in both fixtures to sustain load for 15 seconds.
   // Damage/second-chance semantics are covered by the dedicated combat suites.
   L.captureRound(g);const copy=new D.Game();copy.loadSnapshot(g.snapshot());
   function difference(a,b,path='snapshot'){if(a===b)return null;if(!a||!b||typeof a!=='object'||typeof b!=='object')return{path,a,b};const keys=new Set([...Object.keys(a),...Object.keys(b)]);for(const key of keys){const diff=difference(a[key],b[key],path+'.'+key);if(diff)return diff;}return null;}
   const initialDiff=difference(g.snapshot(),copy.snapshot());if(initialDiff)throw Error('Initial restore differs: '+JSON.stringify(initialDiff));
   g.lethal=copy.lethal=()=>false;
   const panel=document.createElement('div'),canvas=document.createElement('canvas');panel.id='stress-check';panel.style.cssText='position:fixed;inset:0;z-index:99999;background:#09101b;display:grid;place-items:center';canvas.style.cssText='width:100%;height:100%;display:block';panel.append(canvas);document.body.append(panel);
   const r=new DuelRenderer(canvas),effects={wallJumps:[],lights:[],signatures:[],particles:[],cuts:[],shake:0,flash:0,impact:0};r.snapCamera=true;r.lighting.settings.quality='high';
   let maxEntities=0,maxEffects=0,maxHistory=0,maxPayload=0,peak=null,casts=0;const stepMs=[],renderMs=[];
   function commands(frame){const t=frame/240;return[{...D.neutral(),move:Math.sin(t*.9)>.1?1:-1,aim:Math.sin(t*.7)*.9,attack:frame%113===0,jump:frame%439===0,jumpHeld:frame%439<50,dash:frame%197===0,up:frame%480<100},...g.fighters.slice(1).map(()=>D.neutral())];}
   for(let frame=0;frame<3600;frame++){
    const cmd=commands(frame);
    if(frame%180===0){const id=['fireball','well','barrier','falcon','room','domain','kraken'][Math.floor(frame/180)%7];for(const game of [g,copy]){const ok=L.activate(game,game.fighters[0],id,{aim:frame%360===0?.12:-.2});if(game===g&&ok)casts++;}}
    const start=performance.now();g.step(1/240,L.clone(cmd));stepMs.push(performance.now()-start);copy.step(1/240,L.clone(cmd));
    g.events=[];copy.events=[];const w=L.world(g);
    for(const f of g.fighters)if(![f.x,f.y,f.vx,f.vy].every(Number.isFinite))throw Error('Non-finite fighter');
    for(const e of w.entities){if(![e.x,e.y,e.age].every(Number.isFinite))throw Error('Non-finite entity '+e.type);maxHistory=Math.max(maxHistory,e.history?.length||0);}
    if(w.entities.length>maxEntities){maxEntities=w.entities.length;peak=L.clone(g.snapshot());}
    maxEffects=Math.max(maxEffects,w.effects.length);
    if(frame%4===0){const before=performance.now();r.render(g,effects,frame/240);if(frame>240)renderMs.push(performance.now()-before);}
    if(frame%240===0){const diff=difference(g.snapshot(),copy.snapshot());if(diff)throw Error('Continuation differs at '+frame+': '+JSON.stringify(diff));const payload=DuelPathWatch.frame(g,run);if(payload.game.legacyRoundStart)throw Error('Private round anchor sent to watcher');maxPayload=Math.max(maxPayload,JSON.stringify(payload).length);await new Promise(resolve=>setTimeout(resolve,0));}
   }
   const finalDiff=difference(g.snapshot(),copy.snapshot());if(finalDiff)throw Error('Rendered simulation diverged: '+JSON.stringify(finalDiff));
   // Compare presentation settings against exactly the same combat snapshot.
   g.loadSnapshot(peak);const qualities={},frozen=JSON.stringify(g.snapshot());
   const percentile=(a,p)=>[...a].sort((a,b)=>a-b)[Math.floor((a.length-1)*p)];
   for(const quality of ['low','high','ultra']){r.lighting.settings.quality=quality;const times=[];for(let i=0;i<90;i++){const at=performance.now();r.render(g,effects,i/60);if(i>=10)times.push(performance.now()-at);}if(frozen!==JSON.stringify(g.snapshot()))throw Error(quality+' mutated combat');qualities[quality]={p50:percentile(times,.5),p95:percentile(times,.95)};}
   r.lighting.settings.quality='high';r.render(g,effects,2);
   return{legacies:ids.length,fighters:g.fighters.length,simulatedSeconds:15,casts,maxEntities,maxEffects,maxHistory,maxPayload,types:[...new Set(g.legacyWorld.entities.map(e=>e.type))],stepMs:{p50:percentile(stepMs,.5),p95:percentile(stepMs,.95)},renderMs:{p50:percentile(renderMs,.5),p95:percentile(renderMs,.95)},qualities};
  });
  A.equal(result.fighters,4);A(result.legacies>30);A(result.casts>=8);A(result.maxEntities>=15);A(result.maxEntities<200);A(result.maxEffects<100);A(result.maxHistory<200);A(result.maxPayload<250000);A.deepEqual(errors,[]);
  await page.screenshot({path:'outputs/v8-late-game-stress.png'});fs.writeFileSync('outputs/v8-late-game-stress.json',JSON.stringify(result,null,2));console.log('PASS sustained browser stress',result);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
