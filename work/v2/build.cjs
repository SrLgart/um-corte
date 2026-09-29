const fs=require('node:fs'),path=require('node:path');
let html=fs.readFileSync(path.join(__dirname,'shell.html'),'utf8');
for(const [marker,file]of [['STYLES','styles.css'],['PEER','peerjs.min.js'],['ENGINE','engine.js'],['RENDERER','renderer.js'],['NETWORK','network.js'],['APP','app.js']])html=html.replace('/* '+marker+' */',()=>fs.readFileSync(path.join(__dirname,file),'utf8').replace(/<\/script/gi,'<\\/script').replace(/\/\/# sourceMappingURL=.*$/gm,''));
html=html.replace('/* '+ 'LICENSE'+' */',()=>'/*\n'+fs.readFileSync(path.join(__dirname,'PEERJS-LICENSE.txt'),'utf8')+'\n*/');
const out=path.join(__dirname,'../../outputs/um-corte-v2.html');fs.writeFileSync(out,html);console.log(out);
