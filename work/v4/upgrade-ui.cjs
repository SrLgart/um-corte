const fs=require('fs'),path=require('path'),p=n=>path.join(__dirname,n);function edit(n,f){fs.writeFileSync(p(n),f(fs.readFileSync(p(n),'utf8')));}
edit('app.js',s=>{
 s=s.replaceAll("'special','special'","'special'").replace("const lab=new DuelLab();let replayUI=null;","const lab=new DuelLab();let replayUI=null;const expandedColors=[false,false];let admin=null;");
 s=s.replace(/function ruleValue\(key,value\)\{[^\n]+\}/,"function ruleValue(key,value){const unit=RULES[key]?.unit;return Number(value.toFixed(3)).toLocaleString('pt-BR')+(unit?' '+unit:'×');}")
 .replace("rules:cleanRules(selected.rules)};","rules:cleanRules(selected.rules),adminSession:!!admin?.testRoom};")
 .replace('for(const[k,v]of Object.entries(COLORS)){','for(const[k,v]of Object.entries(COLORS).filter(([k],i)=>i<6||expandedColors[side]||selected.colors[side]===k)){')
 .replace("colors.append(b);}if(side&&selected.mode==='pve')", "colors.append(b);}const more=document.createElement('button');more.className='more-colors';more.textContent=expandedColors[side]?'−':'+';more.setAttribute('aria-label','Mais cores');more.setAttribute('aria-expanded',String(expandedColors[side]));more.onclick=()=>{expandedColors[side]=!expandedColors[side];drawCharacters();};colors.append(more);if(side&&selected.mode==='pve')")
 .replace('number.max=r.max;','if(!r.unbounded)number.max=r.max;').replace('Math.min(r.max,value)','r.unbounded?value:Math.min(r.max,value)')
 .replace("[[1,'Preciso'],[2,'Confortável'],[4,'Longo'],[8,'Estendido']]","[[150,'Preciso'],[400,'Padrão IV'],[600,'Longo'],[1200,'Estendido']]")
 .replace("$('air-dash').checked=selected.rules.airDash;", "$('specials-enabled').checked=selected.rules.specials;$('specials-enabled').disabled=configLocked();$('air-dash').checked=selected.rules.airDash;")
 .replace("selected.mode!=='training';renderer.snapCamera", "true;renderer.snapCamera")
 .replace('countdown=1;showGame();}','countdown=1;showGame();presentSpecials(()=>{});}')
 .replace('countdown=2;showGame();return true;','countdown=2;showGame();presentSpecials(onlineIntroDone);return true;')
 .replace("else sendRequired({type:'ready',id:msg.id});return;",'return;')
 .replace("if(msg.type==='ready'&&seat===0&&!s.started){if(sendRequired({type:'go',id:s.id}))s.started=true;return;}","if(msg.type==='ready'&&seat===0&&!s.started){s.peerAccepted=true;if(s.introAccepted&&sendRequired({type:'go',id:s.id}))s.started=true;return;}")
 .replace('if(performance.now()-s.createdAt>12000)', 'if(!game.rules.specials&&performance.now()-s.createdAt>12000)')
 .replace("Object.keys(RULES).filter(k=>l.config.rules[k]!==1)","Object.keys(RULES).filter(k=>l.config.rules[k]!==DEFAULT_RULES[k])")
 .replace("+'. Ao ficar pronto, você confirma estas regras.'", "+' · Especiais '+(l.config.rules.specials?'ligados':'desligados')+(l.config.adminSession?' · SALA DE TESTE: o anfitrião pode mudar mapa, classes e regras durante o duelo.':'')+'. Ao ficar pronto, você aceita estas condições.'")
 .replace('c.rules[k]<=RULES[k].max','(RULES[k].unbounded||c.rules[k]<=RULES[k].max)')
 .replace("typeof c.rules.airDash==='boolean'", "typeof c.rules.airDash==='boolean'&&typeof c.rules.specials==='boolean'")
 .replace("if(!net?.connected||!msg)return;", "if(!net?.connected||!msg)return;if(receiveAdmin(msg))return;")
 .replace("function onlineTick(dt){if(game.phase==='matchEnd')return;", "function onlineTick(dt){if(adminBarrier())return;if(onlineSession?.adminPaused){accumulator=0;return;}if(game.phase==='matchEnd')return;")
 .replace("while(accumulator>=1/60&&steps++<6){", "while(accumulator>=1/60&&steps++<6){if(adminBarrier()||s.adminPaused)return;")
 .replace("const effects={particles:","const effects={impact:0,impactPoint:null,particles:")
 .replace('effects.shake=effects.flash=effects.eventLife=0;', 'effects.shake=effects.flash=effects.eventLife=effects.impact=0;')
 .replace("else if(ev.type==='parry'||ev.type==='clash'){effects.shake", "else if(ev.type==='special'||ev.type==='shieldBreak'||ev.type==='chargeStop'){effects.shake=reduced?0:4;burst(ev.x,ev.y,22,'#eaca82');effects.eventText=ev.type==='special'?DuelSpecialUI.info[game.fighters[ev.id].kind].name.toUpperCase():ev.type==='shieldBreak'?'PROTEÇÃO CONSUMIDA':'FIM DA ESTOCADA';effects.eventLife=.65;}else if(ev.type==='parry'||ev.type==='clash'){if(ev.type==='parry'){effects.impact=reduced?.025:.06;effects.impactPoint={x:ev.x,y:ev.y};}effects.shake")
 .replace('function updateEffects(dt){','function updateEffects(dt){effects.impact=Math.max(0,effects.impact-dt);')
 .replace("input.enabled=(!inMenu||!!lab.viewGame)&&!$('settings').open;", "document.documentElement.classList.toggle('immersive',!inMenu&&!!(document.fullscreenElement||document.documentElement.classList.contains('theater')));input.enabled=(!inMenu||!!lab.viewGame)&&!$('settings').open&&!$('special-intro').open&&!$('history').open&&!admin?.opened;")
 .replace("if(!inMenu&&!paused){", "if(!inMenu&&!paused&&!$('special-intro').open){")
 .replace("s.dashCooldown*drawn.rules.dashCooldown", "Math.max(.001,drawn.rules.dashCooldown/1000)")
 .replace("s.parry*drawn.rules.parryWindow+s.parryRecovery*drawn.rules.parryRecovery", "Math.max(.001,(drawn.rules.parryWindow+drawn.rules.parryRecovery)/1000)")
 .replace("const f=drawn.fighters[seat],g=guardSector", "updateSpecialHUD(drawn);$('dash-key').textContent=input.label(selected.source,'dash').split(' / ')[0]+' · '+drawn.fighters[seat].dashCharges+'/'+drawn.rules.dashCount;const f=drawn.fighters[seat],g=guardSector")
 .replace("$('air-dash').onchange=", "$('specials-enabled').onchange=()=>{selected.rules.specials=$('specials-enabled').checked;rulesChanged();};$('air-dash').onchange=")
 .replace("window.duelSnapshot=()=>({version:3,release:'3.3',", "window.duelSnapshot=()=>({version:4,release:'4.0',adminEdition:!!admin,experimental:!!game.experimental,adminPaused:!!onlineSession?.adminPaused,adminPending:!!onlineSession?.pendingAdmin,")
 .replace("$('download').href=location.href;returnMenu();", "$('download').href=location.href;admin=typeof DuelAdmin==='undefined'?null:new DuelAdmin({get:()=>({game,inMenu,paused:onlineSession?.adminPaused||paused,online:selected.mode==='online',allowed:selected.mode!=='online'||seat===0&&lobby?.config.adminSession}),apply:requestAdmin,changed:rulesChanged,clear:clearInputs});$('history-button').onclick=()=>{$('history').showModal();clearInputs();};$('history-close').onclick=()=>$('history').close();$('special-intro').addEventListener('cancel',e=>e.preventDefault());$('exit-fullscreen').onclick=()=>$('fullscreen').click();returnMenu();")
 .replace('function frame(ms){',fs.readFileSync(p('ui-functions.txt'),'utf8')+'\nfunction frame(ms){');
 s=s.replace("for(const ev of lab.tick(dt,command)||[]){sound(ev.type);", "for(const ev of lab.tick(dt,command)||[]){sound(ev.type);if(ev.type==='parry'){effects.impact=reduced?.025:.06;effects.impactPoint={x:ev.x,y:ev.y};}");return s;
});
edit('shell.html',s=>s.replaceAll('UM CORTE III','UM CORTE IV').replaceAll('<em>III</em>','<em>IV</em>').replaceAll('V3.3','V4').replaceAll('3.3 — Segunda leitura','4.0 — O preço do poder').replaceAll('SEGUNDA LEITURA.','O PREÇO DO PODER.').replaceAll('um-corte-v3.html','um-corte-v4.html').replaceAll('UM-CORTE-V3.html','UM-CORTE-V4.html')
 .replace('<button id="fullscreen"','<button id="history-button" class="quiet">ATUALIZAÇÕES</button><button id="fullscreen"')
 .replace('<div class="rules-bottom">','<div class="special-settings"><label class="check"><input id="specials-enabled" type="checkbox"> Habilitar especiais</label><small>Cada classe recebe um poder com uma desvantagem. Recarga vazia a cada rodada; regras explicadas antes da partida. Tecla F / Y / △.</small></div><div class="rules-bottom">')
 .replace('uma utilização por salto','cargas configuráveis · ligado por padrão')
 .replace('<button id="pause-settings"','<button id="exit-fullscreen" class="text-button">ALTERNAR TELA CHEIA</button><button id="pause-settings"')
 .replace('<div id="combat-event"', [0,1].map(i=>'<div id="special-'+i+'" class="special-meter'+(i?' second':'')+'" hidden><header><span id="special-name-'+i+'"></span><span id="special-key-'+i+'"></span></header><small id="special-status-'+i+'"></small><i><b id="special-fill-'+i+'"></b></i></div>').join('')+'<div id="combat-event"')
 .replace('<!-- PeerJS',`<dialog id="special-intro" class="special-dialog"><span class="eyebrow">UM PODER. UM PREÇO.</span><h2>Conheça seu especial.</h2><div id="special-cards"></div><p id="special-intro-note"></p><button id="special-understood" class="primary">ENTENDI · EM GUARDA ↗</button></dialog>
<dialog id="history" class="history-dialog"><button id="history-close" class="text-button">FECHAR</button><span class="eyebrow">A EVOLUÇÃO DO DUELO</span><h2>Atualizações.</h2>
<details open><summary>V4 · O preço do poder — atual</summary><p>Cinco especiais opcionais, consequências visíveis e indicadores discretos. Finta com mais margem, dashes em sequência, parry padrão de 400 ms e ataques 25% mais rápidos. Tela cheia sem bordas, mais cores e todos os ajustes com entrada numérica.</p></details>
<details><summary>V3.3 · Segunda leitura</summary><p>Treino configurável, replay jogável, chute, deslize, finta, wall jump, Torre do Sino, sorteios e seleção de personagens na revanche online.</p></details>
<details><summary>V3.2 · Corpo em movimento</summary><p>Cinco personagens em pixel art, roupas em movimento, ataques durante o dash e slash como área real de acerto. Escala dos personagens e arenas configuráveis.</p></details>
<details><summary>V3 · O chão já não é o limite</summary><p>Mira em todas as direções, salto, ataques aéreos, três guardas, Espadachim, Ceifador, cores, personalização e novos cenários. A atualização de arenas ampliou os temas e o parry prolongado.</p></details>
<details><summary>V2 · Escolha seu caminho</summary><p>Cavaleiro, Lanceiro e Assassino; modos local e online; dificuldades de IA.</p></details>
<details><summary>V1 · Um corte</summary><p>O primeiro duelo: posicionamento, golpe fatal, parry, clash e tentativas rápidas.</p></details></dialog>
<!-- ADMIN_HTML -->
<!-- PeerJS`)
 .replace('<script>/* APP */</script>','<script>/* SPECIAL_UI */</script><script>/* ADMIN */</script><script>/* APP */</script>'));
edit('network.js',s=>s.replace('VERSION = 33','VERSION = 4').replaceAll('umcorte-v3-3-','umcorte-v4-').replaceAll('um-corte-v3-3','um-corte-v4'));
edit('lab.js',s=>s.replaceAll("'special','special'","'special'").replace('f.queued=null;}this.note=',"f.queued=null;f.dashCharges=g.rules.dashCount;f.airDashes=0;g.resetSpecial(f);}this.note="));
edit('engine.js',s=>s.replace('a.breakAttackId!==a.attackId','!(a.breakAttackId&&a.breakAttackId===a.attackId)').replace("p.vx=0;p.vy=40;p.mode='dropped';", "to.x-=Math.sign(p.vx)*1.1;p.vx=0;p.vy=40;p.mode='dropped';"));
