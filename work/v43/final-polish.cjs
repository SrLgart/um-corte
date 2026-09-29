const fs=require('fs'),path=require('path'),p=n=>path.join(__dirname,n);let s=fs.readFileSync(p('app.js'),'utf8');s=s.replace('el.max=r.max;el.step=r.step','el.max=r.unbounded?Math.max(r.max,selected.rules[k]):r.max;el.step=r.step');fs.writeFileSync(p('app.js'),s);
const guide=p('../../outputs/LEIA-ME-V43.md');s=fs.readFileSync(guide,'utf8').replace('- Resultados dos testes online e demais verificações desta entrega ficam em work/v43/.',`- 72 simulações dos quatro presets, com seis classes e três tipos de arena.
- Online real PeerJS/WebRTC em sessões isoladas do Chrome no mesmo PC: anfitrião ADMIN, convidado ADMIN e ambos ADMIN; confirmações antecipadas, só um pronto e ninguém pronto; alterações simultâneas, pausa, passo a passo, skins, pontuação, carga entre rodadas e revanche.
- Desconexão durante a apresentação fecha a tela corretamente. Especiais desligados continuam funcionando no online.
- ADMIN convidado transferiu um mapa personalizado de 1,5 MB com duas imagens para o anfitrião comum. Plataformas móveis e desabamentos mantiveram estados iguais.
- Não foi um teste em dois computadores ou redes diferentes. Os resultados ficam em work/v43/.`);fs.writeFileSync(guide,s);
