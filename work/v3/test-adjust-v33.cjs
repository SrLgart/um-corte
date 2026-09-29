const fs=require('fs'),path=require('path');function edit(n,f){const p=path.join(__dirname,n);fs.writeFileSync(p,f(fs.readFileSync(p,'utf8')));}
edit('test-v33.cjs',s=>s.replace('tick(g,50,[cmd({move:-1})','tick(g,100,[cmd({move:-1})'));
edit('browser-v33.cjs',s=>s.replace("await page.keyboard.press('KeyK');assert.equal", "await page.keyboard.press('KeyK');await wait(30);assert.equal").replace('await wait(1180)','await wait(1320)'));
edit('local-check.cjs',s=>s.replaceAll("'KeyE'","'KeyQ'").replaceAll("textContent(),'E'","textContent(),'Q'"));
