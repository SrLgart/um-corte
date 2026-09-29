const {chromium}=require('C:/Users/Luiz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),A=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']}),errors=[],registry=new Map();
 async function page(admin){const context=await browser.newContext({viewport:{width:1280,height:900}});await require('./rtc-fixture.cjs')(context,registry);const p=await context.newPage();p.setDefaultTimeout(20000);p.on('pageerror',e=>errors.push(e.stack));await p.goto('http://127.0.0.1:4189/um-corte-v8'+(admin?'-admin':'')+'.html');await p.evaluate(()=>window.Peer=LocalRTCPeer);await p.locator('#title-play').click();return p;}
 try{
  for(const admin of [false,true]){
   const p=await page(admin);
   // Damaged local data must not prevent the explicit New Run action.
   await p.evaluate(()=>localStorage.setItem('um-corte-v8-path','{broken'));
   await p.locator('#path-new').click();await p.waitForFunction(()=>!!duelSnapshot().path);
   // Start an authentic saved encounter, keeping the UI's reward/result pipeline.
   await p.evaluate(admin=>{const run=new DuelPath.Run({seed:15,points:1,seen:['first']});run.level=admin?50:36;for(const id of ['echo','wingboot','destinyorb'])DuelLegacy.add({legacy:run.inventory},id);new DuelPath.Saves(localStorage).write(run);},admin);
   await p.reload();await p.evaluate(()=>window.Peer=LocalRTCPeer);await p.locator('#title-play').click();await p.locator('#path-continue').click();
   if(admin)await p.locator('#path-skip').click();
   await p.waitForFunction(()=>duelSnapshot().phase==='playing');
   let viewer;
   if(admin){
    await p.locator('#path-invite').click();await p.waitForFunction(()=>/ESPECTADORES.*[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}/.test(document.querySelector('#path-room').textContent));
    const code=(await p.locator('#path-room').innerText()).match(/[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}(?!.*[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6})/)[0];
    viewer=await page(false);viewer.once('dialog',d=>d.accept(code));await viewer.locator('#path-watch').click();await viewer.waitForFunction(()=>duelSnapshot().path?.level===50);
    // A viewer must leave the result overlay when the ADMIN retries the encounter.
    await p.evaluate(()=>{const old=DuelCore.Game.prototype.step;DuelCore.Game.prototype.step=function(dt,inputs){if(this.pathEncounter&&this.phase==='playing'){DuelCore.Game.prototype.step=old;this.lethal(this.fighters[1],this.fighters[0],'retry audit');}return old.call(this,dt,inputs);};});
    await p.waitForFunction(()=>document.querySelector('.path-result').open);await viewer.waitForFunction(()=>document.querySelector('.path-result').open);
    A(await p.locator('#path-retry').isVisible());A(await viewer.locator('#path-retry').isHidden());
    await p.locator('#path-retry').click();await viewer.waitForFunction(()=>duelSnapshot().path?.phase==='fight'&&!document.querySelector('.path-result').open);
    await p.waitForFunction(()=>duelSnapshot().phase==='playing');
   }
   await p.evaluate(win=>{const old=DuelCore.Game.prototype.step;DuelCore.Game.prototype.step=function(dt,inputs){if(this.pathEncounter&&this.phase==='playing'){DuelCore.Game.prototype.step=old;this.runTime=125;for(const f of this.fighters.slice(1))f.legacy.items=[];if(win){for(const f of this.fighters.slice(1))this.lethal(this.fighters[0],f,'outcome audit');}else{for(const f of this.fighters.slice(1,3))this.lethal(this.fighters[0],f,'outcome audit');this.lethal(this.fighters.at(-1),this.fighters[0],'outcome audit');}}return old.call(this,dt,inputs);};},admin);
   await p.waitForFunction(()=>document.querySelector('.path-result').open);
   const result=await p.evaluate(()=>({run:duelSnapshot().path,history:new DuelPath.Saves(localStorage).history(),save:localStorage.getItem('um-corte-v8-path')}));
   A.equal(result.run.phase,admin?'won':'lost');A.equal(result.run.stats.kills,admin?1:2);A.equal(result.run.stats.deaths,1);A.equal(result.run.stats.duels,admin?2:1);A.equal(result.save,null);A.equal(result.run.inventory.items.length,3);
   A.equal(result.history.records.wins,admin?1:0);A.equal(result.history.records.bestLevel,admin?50:36);
   A.match(await p.locator('.path-outcome').innerText(),/Inimigos derrotados/);A(await p.locator('#path-retry').isHidden());
   if(viewer){
    await viewer.waitForFunction(()=>document.querySelector('.path-result').open);
    A.equal(await viewer.locator('.path-outcome').innerText(),(await p.locator('.path-outcome').innerText()).replace('Recordes neste navegador','Recordes do anfitrião'));
    A.equal(await viewer.evaluate(()=>localStorage.getItem('um-corte-v8-path-history')),null);
    await viewer.close();
   }
   await p.setViewportSize({width:390,height:844});await p.screenshot({path:'outputs/v8-path-'+(admin?'victory':'defeat')+'-mobile.png'});
   await p.locator('#path-result-menu').click();A(await p.locator('#path-continue').isDisabled());await p.close();
  }
  A.deepEqual(errors,[]);console.log('PASS normal/ADMIN: damaged save recovery, group totals, defeat/victory, local records, spectator result and save isolation');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
