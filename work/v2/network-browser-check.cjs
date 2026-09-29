const {chromium} = require('C:/Users/Luiz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL} = require('node:url');
const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
  const fixture = path.join(__dirname, 'network-fixture.html');
  fs.writeFileSync(fixture, '<!doctype html><meta charset="utf-8"><title>Network probe</title><script src="peerjs.min.js"></script><script src="network.js"></script>');
  const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--allow-file-access-from-files']});
  try {
    const contextA = await browser.newContext(), contextB = await browser.newContext(), contextC = await browser.newContext();
    const host = await contextA.newPage(), guest = await contextB.newPage(), extra = await contextC.newPage();
    const errors = [];
    for (const [name, page] of [['host',host],['guest',guest],['extra',extra]]) {
      page.on('pageerror', e => errors.push(name + ': ' + e.message));
      await page.goto(pathToFileURL(fixture).href);
      await page.evaluate(() => {
        window.log = []; window.messages = []; window.disconnections = [];
        window.network = new DuelOnline({
          onStatus:(text,state)=>log.push({text,state}),
          onConnected:info=>window.connectionInfo=info,
          onMessage:msg=>messages.push(msg),
          onDisconnected:reason=>disconnections.push(reason)
        });
      });
    }
    console.log('Opening real public signaling from file://…');
    const room = await host.evaluate(() => network.createRoom('lancer'));
    console.log('Room created:', room);
    assert.match(room,/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/);
    await guest.evaluate(code => network.joinRoom(code.toLowerCase(),'assassin'), room);
    await host.waitForFunction(() => network.connected);
    assert.equal((await host.evaluate(()=>connectionInfo)).remoteCharacter,'assassin');
    assert.equal((await guest.evaluate(()=>connectionInfo)).remoteCharacter,'lancer');
    assert.equal(await host.evaluate(()=>network.seat),0);
    assert.equal(await guest.evaluate(()=>network.seat),1);
    await guest.evaluate(()=>network.send({type:'input',move:1,actions:['attack'],seq:1}));
    await host.waitForFunction(()=>messages.length===1);
    assert.equal((await host.evaluate(()=>messages[0])).type,'input');
    await host.evaluate(()=>network.send({type:'snapshot',fighters:[{x:455},{x:780}],score:[2,1],seq:1}));
    await guest.waitForFunction(()=>messages.length===1);
    assert.deepEqual((await guest.evaluate(()=>messages[0])).score,[2,1]);
    assert.equal(await guest.evaluate(()=>network.send({invalid:Infinity})),false);
    const busy = await extra.evaluate(async code => {try {await network.joinRoom(code,'knight');return '';}catch(e){return e.message;}},room);
    assert.match(busy,/dois jogadores/);
    assert.equal(await host.evaluate(()=>network.connected),true);
    await host.waitForFunction(()=>network.latency!==null);
    await guest.waitForFunction(()=>network.latency!==null);
    console.log('RTT ms:',await host.evaluate(()=>network.latency),await guest.evaluate(()=>network.latency));
    // Verify sustained 60 Hz input/snapshot packets and reliable ordering.
    await host.evaluate(async()=>{
      for(let i=0;i<100;i++) {network.send({type:'snapshot',seq:10+i, fighters:[{x:436+i},{x:844-i}],score:[0,0]});await new Promise(r=>setTimeout(r,16));}
    });
    await guest.waitForFunction(()=>messages.length===101);
    assert.equal(await guest.evaluate(()=>messages.at(-1).seq),109);
    await guest.evaluate(()=>network.close());
    await host.waitForFunction(()=>!network.connected);
    assert.equal(await host.evaluate(()=>disconnections.length),1);
    const invalid = await extra.evaluate(async()=>{try{await network.joinRoom('bad','knight');return false;}catch(_){return true;}});
    assert.equal(invalid,true);
    const missing = await extra.evaluate(async()=>{try{await network.joinRoom('222222','knight');return '';}catch(e){return e.message;}});
    assert.match(missing,/não encontrada/);
    console.log(JSON.stringify({host:await host.evaluate(()=>log),guest:await guest.evaluate(()=>log),extra:await extra.evaluate(()=>log),errors},null,2));
    assert.deepEqual(errors,[]);
    console.log('PASS: actual PeerJS cloud + WebRTC file:// room, two browser contexts, handshake, character exchange, messages, RTT, third-player rejection, sustained snapshots, disconnect, invalid and missing room.');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
