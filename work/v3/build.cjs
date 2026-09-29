const fs=require('node:fs'),path=require('node:path');
let html=fs.readFileSync(path.join(__dirname,'shell.html'),'utf8');
for(const [marker,file]of [['STYLES','styles.css'],['PEER','peerjs.min.js'],['ENGINE','engine.js'],['CONTROLS','controls.js'],['SCENERY','scenery.js'],['WEAPONS','weapons.js'],['ACTORS','actors.js'],['RENDERER','renderer.js'],['NETWORK','network.js'],['LAB','lab.js'],['APP','app.js']])html=html.replace('/* '+marker+' */',()=>(fs.readFileSync(path.join(__dirname,file),'utf8')+(file==='styles.css'?'\n'+['v3.css','arenas.css','v33.css'].map(f=>fs.readFileSync(path.join(__dirname,f),'utf8')).join('\n'):'')).replace(/<\/script/gi,'<\\/script').replace(/\/\/# sourceMappingURL=.*$/gm,''));
html=html.replace('/* '+ 'LICENSE'+' */',()=>'/*\n'+fs.readFileSync(path.join(__dirname,'PEERJS-LICENSE.txt'),'utf8')+'\n*/');
const out=path.join(__dirname,'../../outputs/um-corte-v3.html');fs.writeFileSync(out,html);console.log(out);

