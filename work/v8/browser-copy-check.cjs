const {chromium}=require('C:/Users/Luiz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{for(const admin of [false,true]){
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4189/um-corte-v8'+(admin?'-admin':'')+'.html');
  const data=await page.evaluate(()=>{const L=DuelLegacy;return{missing:Object.keys(L.catalog).filter(id=>!L.descriptionText[id]),extra:Object.keys(L.descriptionText).filter(id=>!L.catalog[id]),count:Object.keys(L.descriptionText).length,orb:L.describe('destinyorb')};});
  assert.deepEqual(data.missing,[]);assert.deepEqual(data.extra,[]);assert.equal(data.count,115);assert.match(data.orb,/Olhar já consome/);
  await page.locator('#title-play').click();await page.locator('#path-new').click();await page.keyboard.press('Tab');
  assert(await page.locator('#legacy-panel').isVisible());
  if(admin){
   await page.locator('#legacy-lab').click();
   assert.equal(await page.locator('#legacy-catalogue .legacy-card').count(),115);
   await page.locator('#legacy-search').fill('destinos livres');
   assert.equal(await page.locator('#legacy-catalogue .legacy-card').count(),1);
   assert.equal(await page.locator('#legacy-catalogue .legacy-card').getAttribute('data-legacy'),'room');
   await page.locator('#legacy-search').fill('Olhar já consome');
   assert.equal(await page.locator('#legacy-catalogue .legacy-card').getAttribute('data-legacy'),'destinyorb');
   await page.setViewportSize({width:390,height:844});
   await page.locator('#legacy-catalogue .legacy-card').scrollIntoViewIfNeeded();
   await page.screenshot({path:'outputs/v8-copy-mobile.png'});
   const bounds=await page.locator('#legacy-catalogue .legacy-card').boundingBox();
   assert(bounds.width<=390&&bounds.x>=0&&bounds.x+bounds.width<=391);
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS normal/ADMIN: 115 descriptions, inventory, displayed-text search and mobile card bounds');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
