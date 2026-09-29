const {chromium}=require('C:/Users/Luiz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),A=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:980}}),errors=[];page.on('pageerror',e=>errors.push(e.stack));await page.goto('http://127.0.0.1:4189/um-corte-v8.html');
 const result=await page.evaluate(()=>{
  const D=DuelCore,L=DuelLegacy,panel=document.createElement('div');panel.id='power-check';panel.style.cssText='position:fixed;inset:0;z-index:99999;background:#121e2a;display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:16px;color:#f7edda;overflow:auto';document.body.append(panel);const checked=[];
  for(const [id,label]of [['room','ROOM'],['domain','DOMÍNIO'],['sandevistan','DESACELERAÇÃO'],['star','TEMPO PARADO']]){
   const card=document.createElement('section'),title=document.createElement('h3'),canvas=document.createElement('canvas');title.textContent=label;title.style.cssText='font:13px monospace;letter-spacing:2px;margin:6px';canvas.style.cssText='width:100%;height:380px;display:block';card.append(title,canvas);panel.append(card);
   const g=new D.Game({mode:'local',ai:false,rules:{specials:false},characters:['knight','lancer']});g.start({legacies:[[id],[]]});g.phase='playing';g.map.walls=[];g.map.platforms=[{x:0,y:700,w:g.map.width,stage:'solid',solid:true}];g.fighters.forEach((f,i)=>Object.assign(f,{x:800+i*240,y:700,state:'idle',grounded:true,aim:i?Math.PI:0}));const f=g.fighters[0],t=g.fighters[1];
   if(!L.activate(g,f,id,{aim:0}))throw Error('Activation failed '+id);for(let i=0;i<240;i++)L.worldStep(g,1/600);
   const r=new DuelRenderer(canvas),effects={wallJumps:[],lights:[],signatures:[],particles:[],cuts:[],shake:0,flash:0,impact:0};r.snapCamera=true;const before=JSON.stringify(g.snapshot());for(let i=0;i<30;i++)r.render(g,effects,1+i/60);if(before!==JSON.stringify(g.snapshot()))throw Error('Renderer changed '+id+' gameplay');checked.push({id,entities:g.legacyWorld.entities.map(e=>e.type),effects:g.legacyWorld.effects.map(e=>e.type)});
  }return checked;
 });
 A.equal(result.length,4);for(const [i,type]of ['room','domain','slowTime','timeStop'].entries())A(result[i].effects.includes(type));await page.screenshot({path:'outputs/v8-temporal-gameplay.png'});await page.setViewportSize({width:800,height:1100});await page.locator('#power-check').evaluate(e=>e.style.gridTemplateColumns='1fr');await page.screenshot({path:'outputs/v8-temporal-gameplay-narrow.png'});A.deepEqual(errors,[]);console.log('PASS browser: four activated temporal/field scenes, full renderer, 30 immutable frames each, wide/narrow screenshots');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

