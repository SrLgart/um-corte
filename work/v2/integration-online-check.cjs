const {chromium}=require('C:/Users/Luiz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('node:url');
const path=require('node:path'),assert=require('node:assert/strict'),fs=require('node:fs');
const pause=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--allow-file-access-from-files','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
 const errors=[],log=[];
 try{
  const host=await(await browser.newContext({viewport:{width:1440,height:1000}})).newPage();
  const guest=await(await browser.newContext({viewport:{width:1440,height:1000}})).newPage();
  const pages=[host,guest];
  for(const [i,page]of pages.entries()){
   page.on('pageerror',e=>errors.push('seat'+i+': '+e.message));
   await page.goto(pathToFileURL(path.join(__dirname,'../../outputs/um-corte-v2.html')).href);
   await page.locator('[data-mode="online"]').click();
  }
  await host.locator('#player-characters [data-kind="lancer"]').click();
  await guest.locator('#player-characters [data-kind="assassin"]').click();
  await host.locator('#create-room').click();
  await host.waitForFunction(()=>/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/.test(document.getElementById('room-display').textContent));
  const room=await host.locator('#room-display').innerText();
  console.log('UI room',room);
  await guest.locator('#room-code').fill(room.toLowerCase());
  await guest.locator('#join-room').click();
  await Promise.all(pages.map(p=>p.locator('#menu').waitFor({state:'hidden',timeout:25000})));
  await Promise.all(pages.map(p=>p.locator('#countdown').waitFor({state:'hidden',timeout:12000})));
  // duelSnapshot is read-only observability; every game command below is a UI key/button.
  const initial=await Promise.all(pages.map(p=>p.evaluate(()=>duelSnapshot())));
  assert.deepEqual(initial[0].fighters.map(f=>f.kind),['lancer','assassin']);
  assert.deepEqual(initial[1].fighters.map(f=>f.kind),['lancer','assassin']);
  assert.equal(initial[0].online.seat,0);assert.equal(initial[1].online.seat,1);
  for(let point=1;point<=5;point++){
   await host.locator('#game').focus();
   await host.keyboard.down('KeyD');await pause(1390);await host.keyboard.up('KeyD');
   await pause(180);
   const before=await Promise.all(pages.map(p=>p.evaluate(()=>duelSnapshot())));
   log.push({point,before:before.map(s=>({frame:s.online.frame,x:s.fighters.map(f=>f.x),phase:s.phase}))});
   await host.keyboard.press('KeyJ');
   await Promise.all(pages.map(p=>p.waitForFunction(expected=>document.getElementById('player-score').textContent===String(expected),point,{timeout:8000})));
   const snapshots=await Promise.all(pages.map(p=>p.evaluate(()=>duelSnapshot())));
   assert.deepEqual(snapshots[0].score,snapshots[1].score);
   assert.equal(snapshots[0].score[0],point);
   assert.ok(Math.abs(snapshots[0].online.frame-snapshots[1].online.frame)<=7);
   log.push({point,score:snapshots[0].score,frames:snapshots.map(s=>s.online.frame),ping:snapshots.map(s=>s.online.latency)});
   console.log('Point',point,'frames',snapshots.map(s=>s.online.frame),'ping',snapshots.map(s=>s.online.latency));
   if(point<5){await Promise.all(pages.map(p=>p.waitForFunction(()=>!document.getElementById('round-feedback').classList.contains('visible'))));await pause(100);}
  }
  await Promise.all(pages.map(p=>p.locator('#match').waitFor({state:'visible',timeout:5000})));
  assert.equal(await host.locator('#match-title').innerText(),'A vitória é sua.');
  assert.equal(await guest.locator('#match-title').innerText(),'O oponente levou o duelo.');
  await host.screenshot({path:path.join(__dirname,'online-host-match.png')});
  await guest.screenshot({path:path.join(__dirname,'online-guest-match.png')});
  await host.locator('#restart').click();
  await pause(300);
  assert.equal(await host.locator('#match').isVisible(),true);
  assert.equal(await guest.locator('#match').isVisible(),true);
  await guest.locator('#restart').click();
  await Promise.all(pages.map(p=>p.locator('#match').waitFor({state:'hidden',timeout:8000})));
  await Promise.all(pages.map(p=>p.locator('#countdown').waitFor({state:'hidden',timeout:8000})));
  assert.equal(await host.locator('#player-score').innerText(),'0');
  assert.equal(await guest.locator('#player-score').innerText(),'0');
  // The controls overlay does not pause the online simulation for either player.
  await host.locator('#game').focus();await host.keyboard.press('Escape');
  const frameBefore=await guest.evaluate(()=>duelSnapshot().online.frame);
  await guest.locator('#game').focus();await guest.keyboard.down('ArrowLeft');await pause(350);await guest.keyboard.up('ArrowLeft');
  await pause(220);
  const after=await guest.evaluate(()=>duelSnapshot());
  assert.ok(after.online.frame>frameBefore+15);
  assert.ok(after.fighters[1].x<820);
  assert.equal(await host.locator('#online-pause-note').isVisible(),true);
  await host.locator('#resume').click();
  await host.screenshot({path:path.join(__dirname,'online-host-play.png')});
  await guest.screenshot({path:path.join(__dirname,'online-guest-play.png')});
  await guest.locator('#menu-button').click();
  await host.locator('#menu').waitFor({state:'visible',timeout:8000});
  assert.match(await host.locator('#online-status').innerText(),/saiu|desconectou/);
  assert.deepEqual(errors,[]);
  console.log('PASS real standalone UI: rooms, two classes, five clean kills, synchronized scores, completed match, two-vote rematch, online overlay does not pause, disconnect.');
 }finally{
  fs.writeFileSync(path.join(__dirname,'integration-online-results.json'),JSON.stringify({log,errors},null,2));
  await browser.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1});
