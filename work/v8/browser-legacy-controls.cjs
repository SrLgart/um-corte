const {chromium}=require('C:/Users/Luiz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),A=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 const page=await browser.newPage({viewport:{width:1500,height:1000}}),errors=[];page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.stack));
 await page.goto('http://127.0.0.1:4189/um-corte-v8.html');await page.locator('#title-play').click();await page.locator('[data-mode="training"]').click();await page.locator('#rules-details summary').click();await page.locator('#specials-enabled').uncheck();await page.locator('#start').click();await page.waitForFunction(()=>duelSnapshot().phase==='playing');await page.keyboard.press('Tab');await page.waitForTimeout(100);await page.locator('#legacy-lab').click();
 await page.locator('#legacy-catalogue [data-legacy="barrier"] button').click();const binding=page.locator('#legacy-inventory [data-legacy-bind="barrier"]');
 await binding.click();await page.keyboard.press('KeyJ');A((await page.locator('#legacy-message').innerText()).includes('Já usado'));await page.keyboard.press('KeyZ');A.equal(await binding.innerText(),'KeyZ');
 await page.keyboard.press('Tab');await page.waitForTimeout(100);await page.keyboard.press('KeyZ');await page.waitForFunction(()=>duelSnapshot().fighters[0].legacy.cd.barrier>0);
 await page.keyboard.press('Tab');await page.waitForTimeout(100);await page.locator('#legacy-refill').click();await binding.click();await page.mouse.click(750,160,{button:'middle'});A.equal(await binding.innerText(),'Mouse1');
 await page.keyboard.press('Tab');await page.waitForTimeout(100);const canvas=page.locator('#arena canvas').first();await canvas.click({button:'middle',position:{x:300,y:300}});await page.waitForFunction(()=>duelSnapshot().fighters[0].legacy.cd.barrier>0);
 await page.keyboard.press('Tab');await page.waitForTimeout(100);await page.locator('#legacy-refill').click();await binding.click();
 await page.evaluate(()=>{window.testPad={connected:true,mapping:'standard',axes:[0,0,0,0],buttons:Array.from({length:20},()=>({pressed:false,value:0}))};navigator.getGamepads=()=>[window.testPad];window.testPad.buttons[16]={pressed:true,value:1};});
 await page.waitForFunction(()=>duelSnapshot().fighters[0].legacy.bindings.barrier==='Pad16');
 await page.evaluate(()=>{testPad.buttons[16]={pressed:false,value:0};const s=document.querySelector('#input-source');s.value='pad';s.dispatchEvent(new Event('change'));});
 await page.keyboard.press('Tab');await page.waitForTimeout(100);await page.waitForTimeout(100);await page.evaluate(()=>testPad.buttons[16]={pressed:true,value:1});await page.waitForFunction(()=>duelSnapshot().fighters[0].legacy.cd.barrier>0);
 A.deepEqual(errors,[]);console.log('PASS legacy keyboard, mouse and gamepad remapping, conflict checks and in-game activation');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
