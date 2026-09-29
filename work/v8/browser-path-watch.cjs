const {chromium}=require('C:/Users/Luiz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),A=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows']}),registry=new Map(),errors=[];
 async function page(admin=false){const c=await browser.newContext({viewport:{width:1280,height:900}});await require('./rtc-fixture.cjs')(c,registry);const p=await c.newPage();p.setDefaultTimeout(15000);p.on('pageerror',e=>errors.push(e.stack));await p.goto('http://127.0.0.1:4189/um-corte-v8'+(admin?'-admin':'')+'.html');await p.evaluate(()=>window.Peer=window.LocalRTCPeer);await p.locator('#title-play').click();return p;}
 try{
  const host=await page();await host.locator('#path-points').fill('1');await host.locator('#path-new').click();await host.waitForFunction(()=>duelSnapshot().phase==='playing');
  // Finish a real encounter through the engine; only signaling is replaced by the fixture.
  await host.evaluate(()=>{const prior=DuelCore.Game.prototype.step;DuelCore.Game.prototype.step=function(dt,inputs){if(this.pathEncounter&&this.phase==='playing'){DuelCore.Game.prototype.step=prior;for(const f of this.fighters.slice(1)){f.legacy.items=[];this.lethal(this.fighters[0],f,'test finish');}}return prior.call(this,dt,inputs);};});
  await host.waitForFunction(()=>document.querySelector('#legacy-draft').open);
  // Invite was hidden behind a modal: invoke the same button handler while the draft is open.
  await host.locator('#path-invite').evaluate(e=>e.click());await host.waitForFunction(()=>/ESPECTADORES.*[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}/.test(document.querySelector('#path-room').textContent));
  const code=(await host.locator('#path-room').innerText()).match(/[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}(?!.*[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6})/)[0];
  console.log('HOST DRAFT ROOM',code);const watch=await page(true);watch.once('dialog',d=>d.accept(code));await watch.locator('#path-watch').click();await watch.waitForFunction(()=>document.querySelector('#legacy-draft').open);
  console.log('WATCH DRAFT');await watch.keyboard.press('*');A.equal(await watch.locator('#admin-console').evaluate(e=>e.open),false);A(await watch.locator('#draft-confirm').isDisabled());A.equal(await watch.evaluate(()=>localStorage.getItem('um-corte-v8-path')),null);
  A.deepEqual(await watch.evaluate(()=>duelSnapshot().legacyDraft.cards),await host.evaluate(()=>duelSnapshot().legacyDraft.cards));
  const before=await host.evaluate(()=>duelSnapshot().path.randomState);await watch.keyboard.press('Enter');await watch.keyboard.press('KeyJ');await watch.waitForTimeout(400);A.equal(await host.evaluate(()=>duelSnapshot().path.randomState),before);A(await host.locator('#legacy-draft').evaluate(e=>e.open));
  await host.locator('#draft-confirm').click();await watch.waitForFunction(()=>duelSnapshot().path?.level===2&&!document.querySelector('#legacy-draft').open);
  console.log('TOGGLE INVENTORY');await host.keyboard.press('Tab');await watch.waitForFunction(()=>document.querySelector('#legacy-panel').open);A(await watch.locator('#legacy-lab').isHidden());
  const frozen=await host.evaluate(()=>duelSnapshot().fighters[0].x);await watch.keyboard.press('KeyD');await watch.waitForTimeout(300);A.equal(await host.evaluate(()=>duelSnapshot().fighters[0].x),frozen);
  await host.keyboard.press('Tab');await watch.waitForFunction(()=>!document.querySelector('#legacy-panel').open);
  await watch.close();await host.waitForTimeout(300);A.equal(await host.evaluate(()=>duelSnapshot().path.level),2);A.equal(await host.evaluate(()=>duelSnapshot().inMenu),false);
  console.log('WATCH LEFT');const late=await page();late.once('dialog',d=>d.accept(code));await late.locator('#path-watch').click();await late.waitForFunction(()=>duelSnapshot().path?.level===2);
  console.log('LATE JOINED');await host.close();await late.waitForTimeout(2000);console.log('AFTER CLOSE',await late.evaluate(()=>({menu:duelSnapshot().inMenu,note:document.querySelector('#path-save-note').textContent,peers:[...LocalRTCPeer.instances.values()].map(p=>[...p.links.values()].map(c=>({open:c.open,rtc:c.pc.connectionState}))) })),errors);await late.waitForFunction(()=>duelSnapshot().inMenu);A.deepEqual(errors,[]);
  console.log('PASS real RTC Path: late draft spectator, read-only build, pause, save isolation, rejoin, disconnect');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
