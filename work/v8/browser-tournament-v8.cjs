const {chromium}=require('C:/Users/Luiz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),A=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 const p=await b.newPage({viewport:{width:1280,height:950}}),errors=[];p.setDefaultTimeout(15000);p.on('pageerror',e=>errors.push(e.stack));await p.goto('http://127.0.0.1:4189/um-corte-v8.html');await p.locator('#title-play').click();await p.locator('[data-mode="tournament"]').click();await p.selectOption('#tournament-stages','2');await p.locator('#rules-details summary').click();await p.locator('#specials-enabled').uncheck();await p.locator('#rule-winningScore').fill('1');await p.selectOption('#legacy-mode','match');await p.locator('#start').click();
 for(let match=0;match<2;match++){
  await p.waitForFunction(()=>document.querySelector('#tournament-screen').open);
  A(!(await p.locator('#tournament-arena option').evaluateAll(nodes=>nodes.map(n=>n.value))).some(id=>id.startsWith('path_')));
  A.equal(await p.evaluate(()=>duelSnapshot().fighters[0].legacy?.items.length||0),0,'new tournament encounter must reset the build');
  await p.locator('#tournament-fight').click();await p.waitForFunction(()=>document.querySelector('#legacy-draft').open);await p.locator('#draft-confirm').click();await p.waitForFunction(()=>!document.querySelector('#legacy-draft').open&&duelSnapshot().phase==='playing');
  A.equal(await p.evaluate(()=>duelSnapshot().fighters[0].legacy.items.length),1);
  await p.evaluate(()=>{const old=DuelCore.Game.prototype.step;DuelCore.Game.prototype.step=function(dt,commands){if(this.phase==='playing'){DuelCore.Game.prototype.step=old;this.fighters[1].legacy.items=[];this.lethal(this.fighters[0],this.fighters[1],'tournament audit');}return old.call(this,dt,commands);};});
 }
 await p.waitForFunction(()=>!document.querySelector('#tournament-podium').hidden);A(await p.locator('#tournament-results').isHidden());await p.locator('#tournament-show-ranking').click();A.equal(await p.locator('#tournament-ranking tr').count(),4);A.deepEqual(errors,[]);console.log('PASS V8 tournament: exclusive arenas excluded, fresh build per match, drafts, podium and four-player ranking');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
