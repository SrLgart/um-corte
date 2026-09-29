const {chromium}=require('C:/Users/Luiz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),A=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 const page=await browser.newPage({viewport:{width:1500,height:1000}}),errors=[];page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.stack));await page.goto('http://127.0.0.1:4189/um-corte-v8.html');await page.locator('#title-play').click();
 A.equal(await page.locator('#map-choices [data-map^="path_"]').count(),0);await page.locator('[data-mode="training"]').click();await page.locator('#rules-details summary').click();await page.locator('#specials-enabled').uncheck();await page.locator('#start').click();await page.waitForFunction(()=>duelSnapshot().phase==='playing');await page.keyboard.press('Tab');await page.locator('#legacy-lab').click();
 for(const id of ['dragon','mahoraga','hunter','star','necromancer','gravitycloak'])await page.locator('#legacy-catalogue [data-legacy="'+id+'"] button').click();
 await page.keyboard.press('Tab');await page.waitForTimeout(800);const snap=await page.evaluate(()=>duelSnapshot());A.equal(snap.legacyWorld.entities.filter(e=>e.kind==='companion').length,5);for(const e of snap.legacyWorld.entities.filter(e=>['hound','monkey'].includes(e.type)))A(e.grounded);
 await page.screenshot({path:'outputs/v8-large-summon-lab.png'});await page.keyboard.press(snap.fighters[0].legacy.bindings.gravitycloak);await page.waitForFunction(()=>duelSnapshot().fighters[0].legacy.effects.inverted);await page.waitForTimeout(200);A((await page.evaluate(()=>duelSnapshot())).fighters[0].y<snap.fighters[0].y);A.deepEqual(errors,[]);
 console.log('PASS browser summon lab, inverted movement, exclusive arenas, zero render errors');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});


