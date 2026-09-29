// Optional browser smoke directly against distribution files, not the dev server.
const fs=require('node:fs'),path=require('node:path'),A=require('node:assert/strict'),{pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..');
const {chromium}=require(process.env.UMCORTE_PLAYWRIGHT||'C:/Users/Luiz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.UMCORTE_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results=[];
 try{for(const admin of [false,true]){
  const page=await browser.newPage({viewport:{width:1440,height:960}}),errors=[];
  page.on('pageerror',e=>errors.push(e.stack));
  await page.goto(pathToFileURL(path.join(root,'build/um-corte-v8'+(admin?'-admin':'')+'.html')).href);
  await page.locator('#title-play').click();
  await page.locator('[data-mode="training"]').click();
  await page.locator('#rules-details summary').click();
  await page.locator('#specials-enabled').uncheck();
  await page.locator('#start').click();
  await page.waitForFunction(()=>duelSnapshot().phase==='playing'&&duelSnapshot().countdown===0);
  A.equal((await page.evaluate(()=>duelSnapshot())).world.width,1920);
  await page.keyboard.down('Space');await page.waitForTimeout(170);await page.keyboard.up('Space');
  await page.keyboard.down('KeyW');await page.waitForFunction(()=>duelSnapshot().fighters[0].airJumps===0);await page.keyboard.up('KeyW');
  if(admin){await page.keyboard.press('*');A(await page.locator('#admin-console').isVisible());A.equal(await page.locator('#admin-rule-dashCooldown').inputValue(),'320');}
  else A.equal(await page.locator('#admin-console').count(),0);
  await page.screenshot({path:path.join(root,'outputs/handoff-'+(admin?'admin':'normal')+'.png')});
  A.deepEqual(errors,[]);results.push({edition:admin?'admin':'normal',url:'file://build',errors,checks:['startup','training','arena baseline','Space jump','W double jump','ADMIN separation']});await page.close();
 }
 for(const mode of ['pve','local']){
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.stack));
  if(mode==='local')await page.addInitScript(()=>{navigator.getGamepads=()=>[{connected:true,mapping:'standard',buttons:Array.from({length:17},()=>({pressed:false})),axes:[0,0,0,0]}];});
  await page.goto(pathToFileURL(path.join(root,'build/um-corte-v8.html')).href);
  await page.locator('#title-play').click();await page.locator('button[data-mode="'+mode+'"]').click();
  await page.locator('#rules-details summary').click();await page.locator('#specials-enabled').uncheck();await page.locator('#start').click();
  await page.waitForFunction(()=>duelSnapshot().phase==='playing'&&duelSnapshot().countdown===0);
  A.equal(await page.evaluate(()=>duelSnapshot().mode),mode);
  await page.keyboard.press('KeyJ');await page.waitForTimeout(400);A.deepEqual(errors,[]);
  results.push({edition:'normal',mode,errors,checks:['startup','attack input',mode==='local'?'simulated gamepad':'AI enabled']});await page.close();
 }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(root,'docs/data/browser-smoke.json'),JSON.stringify({date:new Date().toISOString(),results},null,2)+'\n');
 console.log('PASS build/ normal + ADMIN file://; training, PvE, local; no pageerror');
})().catch(e=>{console.error(e);process.exitCode=1;});
