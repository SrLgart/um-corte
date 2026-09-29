const fs = require('node:fs');
const path = require('node:path');
const base = __dirname;
let html=fs.readFileSync(path.join(base,'shell.html'),'utf8');
for(const [marker,file] of [['STYLES','styles.css'],['ENGINE','engine.js'],['RENDERER','renderer.js'],['APP','app.js']]){
  html=html.replace('/* '+marker+' */',()=>fs.readFileSync(path.join(base,file),'utf8'));
}
const out=path.join(base,'../outputs/um-corte.html');
fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,html);console.log(out);
