// Extract current runtime data. Does not build or modify game sources.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/data');
require(path.join(root,'work/v8/bootstrap.cjs'));require(path.join(root,'work/v8/parkour.js'));
const D=globalThis.DuelCore,L=globalThis.DuelLegacy,P=globalThis.DuelPath;
fs.mkdirSync(out,{recursive:true});
const write=(file,value)=>fs.writeFileSync(path.join(out,file),JSON.stringify(value,null,2)+'\n');
write('runtime.json',{classes:D.CLASSES,runner:D.RUNNER,rules:D.RULES,defaults:D.DEFAULT_RULES,presets:D.PRESETS,difficulties:D.DIFFICULTIES,skins:D.SKINS,bosses:P.BOSSES,legacies:L.catalog,weapons:L.WEAPONS,cooldowns:L.cooldown,descriptions:L.descriptionText,help:L.helpText});
write('maps.json',Object.fromEntries(Object.entries(D.MAPS).map(([id,source])=>[id,{source,normal:D.makeMap(id,1)}])));
const generated=new Set(['engine.js','app.js','controls.js','renderer.js','actors.js','room.js','shell.html','audio.js','v7-ui.js','build.cjs','serve.cjs']);
const build=fs.readFileSync(path.join(root,'work/v8/build.cjs'),'utf8');
write('source-files.json',fs.readdirSync(path.join(root,'work/v8'),{withFileTypes:true}).filter(e=>e.isFile()).map(e=>({file:'work/v8/'+e.name,role:generated.has(e.name)?'generated':/^(upgrade-core|integrate)\.cjs$/.test(e.name)?'generator':e.name==='peerjs.min.js'||e.name==='PEERJS-LICENSE.txt'?'vendor':/test|^browser-|fixture/.test(e.name)?'test':build.includes("'"+e.name+"'")||['v7-ui.js','v8-ui.js','admin-race.js'].includes(e.name)?'runtime-source':/\.cjs$/.test(e.name)?'historical-tool-review-before-running':'documentation-or-support'})));
console.log('Extracted '+Object.keys(L.catalog).length+' Legados, '+Object.keys(D.MAPS).length+' maps and source inventory.');
