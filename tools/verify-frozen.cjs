'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),base=path.join(root,'archive/V8_FINAL_MONOLITHIC');
const manifest=JSON.parse(fs.readFileSync(path.join(base,'manifest.json'),'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const name of ['um-corte-v8.html','um-corte-v8-admin.html']){
 const expected=manifest.files['outputs/'+name].sha256;
 for(const folder of [base,path.join(root,'outputs'),path.join(root,'build')])assert.equal(hash(path.join(folder,name)),expected,'V8 congelada difere: '+path.join(folder,name));
 console.log('PASS SHA-256 original / outputs / build:',name);
}
// Only generation/tooling documentation may differ in this handoff.
const permitted=new Set(['work/v8/integrate.cjs','work/v8/build.cjs','work/v8/README.md','work/v8/PROGRESS.md']);
for(const [name,entry] of Object.entries(manifest.files))if(!permitted.has(name))assert.equal(hash(path.join(root,name)),entry.sha256,'Arquivo congelado alterado: '+name);
console.log('PASS fontes de runtime, testes e base V7.2 preservados byte a byte');
