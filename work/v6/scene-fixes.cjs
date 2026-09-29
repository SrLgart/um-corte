const fs=require('fs'),r='work/v6/';
let s=fs.readFileSync(r+'presentation.js','utf8');
s=s.replace('const D=DuelCore,TAU=Math.PI*2;',`const D=DuelCore,TAU=Math.PI*2;
DuelScenery.THEMES.bells={...DuelScenery.THEMES.tower,tag:'ECO DO ÚLTIMO GOLPE'};
DuelScenery.THEMES.rooftops={...DuelScenery.THEMES.bamboo,tag:'SOBRE OS TELHADOS'};
const sceneryDraw=DuelScenery.draw;
DuelScenery.draw=function(r,g,t){sceneryDraw.call(this,r,g,t);if(!['bells','rooftops'].includes(g.mapId))return;const c=r.ctx,off=(640-r.camera.x)*.055;c.save();if(g.mapId==='rooftops'){for(let layer=0;layer<3;layer++)for(let i=0;i<6;i++){const x=i*270-100+off*(layer+1),y=350+layer*100+(i%2)*24;c.fillStyle=['#17233b','#18273c','#142136'][layer];c.fillRect(x+20,y,195,720-y);r.path([[x-18,y],[x+117,y-62],[x+251,y],[x+213,y-5],[x+20,y-5]],'#101c30','#62728a33',2);for(let n=0;n<6;n++)r.line({x:x+n*42,y:y-2},{x:x+117+(n-3)*10,y:y-55},'#7794aa16',1);if(layer===1)for(let k=0;k<3;k++)c.fillStyle='#e9bb7935',c.fillRect(x+50+k*45,y+25,16,32);}}else{for(const x of[145,1110]){r.path([[x+off,565],[x+off+8,220],[x+off+36,220],[x+off+44,565]],'#192139aa');r.line({x:x+off-20,y:218},{x:x+off+70,y:218},'#927a9477',7);}r.path([[100+off,218],[182+off,175],[1125+off,175],[1198+off,218]],'#172037aa','#927a9450',2);for(const x of[425,855]){r.line({x:x+off,y:194},{x:x+off,y:350},'#b2a6c533',2);r.path([[x+off-3,220],[x+off+26,230],[x+off+22,345],[x+off+4,333]],'#96547144');}}c.restore();};`);
fs.writeFileSync(r+'presentation.js',s);
fs.writeFileSync(r+'serve.cjs',fs.readFileSync('work/v5/serve.cjs','utf8').replaceAll('v5','v6').replaceAll('4179','4180').replace('UM CORTE V:','UM CORTE VI:'));
