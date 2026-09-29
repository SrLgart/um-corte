const fs=require('node:fs'),path=require('node:path');
let s=fs.readFileSync(path.join(__dirname,'online-check.cjs'),'utf8');
s=s.replace("await host.check('#air-dash');await host.click('#create-room');",`await host.check('#air-dash');await host.click('[data-parry="4"]');await host.click('[data-map="bamboo"]');await host.click('#create-room');`);
s=s.replace("console.log('jump/dash synchronized');",`console.log('jump/dash synchronized');assert.equal(await guest.evaluate(()=>duelSnapshot().mapId),'bamboo');assert.equal(await guest.evaluate(()=>duelSnapshot().rules.parryWindow),4);await guest.keyboard.press('KeyK');await guest.waitForTimeout(260);assert.equal((await guest.evaluate(()=>duelSnapshot())).fighters[1].state,'parry');await guest.waitForTimeout(500);console.log('new map and 600 ms parry synchronized');`);
s=s.replace('online-result.json','online-arenas-result.json');fs.writeFileSync(path.join(__dirname,'online-arenas-check.cjs'),s);
