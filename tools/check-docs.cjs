'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'docs');
const required=['README','GAME_OVERVIEW','ARCHITECTURE','COMBAT_AND_MOVEMENT','CHARACTERS','LEGACIES','LEGACY_INTERACTIONS','CAMINHO_DO_GUERREIRO','BOSSES','AI','MAPS','SAVE_AND_STATE','NETWORKING','TRAINING_AND_ADMIN','VISUAL_HANDOFF','KNOWN_ISSUES','TEST_CHECKLIST','VALIDATION'];
const data=JSON.parse(fs.readFileSync(path.join(dir,'data/runtime.json'),'utf8'));
for(const n of required)assert(fs.statSync(path.join(dir,n+'.md')).size>600,'Missing/empty doc '+n);
let links=0;
for(const file of [path.join(root,'README.md'),...required.map(n=>path.join(dir,n+'.md'))]){
 const text=fs.readFileSync(file,'utf8');assert(!text.includes('undefined×'),'Unresolved dimensions in '+file);
 for(const m of text.matchAll(/\[[^\]\n]+\]\(([^)]+)\)/g)){
  const target=m[1].replace(/^<|>$/g,'').split('#')[0];if(!target||/^[a-z]+:\/\//i.test(target))continue;
  assert(fs.existsSync(path.resolve(path.dirname(file),target)),'Broken link '+file+' -> '+target);links++;
 }
}
const catalog=fs.readFileSync(path.join(dir,'LEGACIES.md'),'utf8');
assert.equal((catalog.match(/^### /gm)||[]).length,115);
for(const c of Object.values(data.legacies))assert(catalog.includes('— `'+c.id+'`'),'Missing legacy '+c.id);
for(const b of data.bosses)assert(fs.readFileSync(path.join(dir,'BOSSES.md'),'utf8').includes('(`'+b.id+'`)'),'Missing boss '+b.id);
for(const id of Object.keys(JSON.parse(fs.readFileSync(path.join(dir,'data/maps.json'),'utf8'))))assert(fs.readFileSync(path.join(dir,'MAPS.md'),'utf8').includes('(`'+id+'`)'),'Missing map '+id);
assert.equal(Object.keys(data.legacies).length,115);assert.equal(data.bosses.length,12);
console.log('PASS 18 documentation files, 115 Legados, 12 bosses, 18 maps; '+links+' local links resolve.');
