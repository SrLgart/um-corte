const fs=require('fs'),path=require('path'),p=n=>path.join(__dirname,n);
function edit(name,fn){let s=fs.readFileSync(p(name),'utf8');const rep=(a,b)=>{if(!s.includes(a))throw Error(name+': '+a.slice(0,90));s=s.replace(a,b);};fn(rep,()=>s,v=>s=v);fs.writeFileSync(p(name),s);}
edit('shell.html',(r,g,s)=>{
 s(g().replaceAll('um-corte-v42','um-corte-v43').replaceAll('UM-CORTE-V42','UM-CORTE-V43').replaceAll('esta versão V4.2','esta versão V4.3').replace('V4.2 · SUA ARENA, SEU ESTILO.','V4.3 · AFINADO PARA O DUELO.'));
 r('<details id="rules-details"', '<section class="combat-presets"><div class="section-label">RITMO DO COMBATE</div><div id="combat-presets" role="group" aria-label="Presets de combate"></div><p id="preset-note" class="fine-print"></p></section><details id="rules-details"');
 r('Recarga vazia a cada rodada; regras explicadas antes da partida.','Ligados por padrão. Regras explicadas antes da partida, com início automático em 10 segundos.');
 r('<div class="rules-bottom">','<label class="check persist-special"><input id="persist-special" type="checkbox"> Manter carga do especial entre rounds <small>Preserva a carga, encerra efeitos e penalidades; uma partida nova começa vazia.</small></label><div class="rules-bottom">');
 r('<button id="special-understood"','<div id="special-countdown" class="special-countdown" role="timer" aria-live="off">COMEÇA EM 10</div><button id="special-understood"');
 r('<details open><summary>V4.2 · Sua arena, seu estilo — atual</summary>','<details open><summary>V4.3 · Ajustes, balanceamento e QoL — atual</summary><p>Especiais ligados por padrão e recarga de 7 segundos. Última Guarda e Corte Soberano agora deixam 4 segundos sem parry. Pontuação personalizável, opção de manter a carga entre rodadas e apresentação dos especiais com limite de 10 segundos.</p><p>Presets Clássico, Turbo, Baixa Gravidade e Sem Piedade, além dos ajustes manuais. Presets alteram apenas o combate. ADMIN funciona dos dois lados da sala, inclusive com dois administradores; comandos ordenados e sincronizados.</p></details><details><summary>V4.2 · Sua arena, seu estilo</summary>');
});
edit('admin.js',(r,g,s)=>{
 const a=g().indexOf("this.testRoom=false;"),b=g().indexOf("const tag=document.createElement",a);s(g().slice(0,a)+"this.opened=false;"+g().slice(b));
 r("alert('O menu só controla partidas offline ou salas de teste que você criou e o oponente aceitou.');", "$('admin-status').textContent='Aguarde o início da partida.';");
 r('Sala de testes: comandos aplicados nos dois jogos no mesmo quadro.','ADMIN ativo em qualquer lado da sala. Comandos aplicados nos dois jogos no mesmo quadro.');
 r("['specials','Especiais']","['specials','Especiais'],['persistSpecial','Manter carga entre rounds']");
 r("['airDash','specials']","['airDash','specials','persistSpecial']");
 r("k==='dashCount'&&(n<1||!Number.isInteger(n))","['dashCount','winningScore'].includes(k)&&(n<1||!Number.isSafeInteger(n))");
 r('Cargas precisam ser inteiras;','Cargas e pontos precisam ser inteiros positivos;');
 r("el.step='any';el.value", "el.step=['dashCount','winningScore'].includes(k)?'1':'any';el.value");
});
edit('app.js',(r,g,s)=>{
 s(g().replaceAll('V4.2','V4.3').replace('version:42,release:\'4.2\'',"version:43,release:'4.3'"));
 r('let game=new Game(selected)', 'let introState=null,presetOverride=false;\nlet game=new Game(selected)');
 r("typeof p.ready==='boolean'", "typeof p.ready==='boolean'&&typeof p.admin==='boolean'");
 r('adminSession:!!admin?.testRoom','adminSession:!!admin||!!net?.remoteAdmin');
 r("function renderRules(){",`function renderPresets(){const root=$('combat-presets');root.replaceChildren();const active=presetOverride?'custom':DuelCore.detectPreset(selected.rules);for(const[id,p]of Object.entries({...DuelCore.PRESETS,custom:{name:'PERSONALIZADO'}})){const b=document.createElement('button');b.type='button';b.dataset.preset=id;b.className='combat-preset'+(id===active?' selected':'');b.textContent=p.name;b.disabled=configLocked();b.setAttribute('aria-pressed',String(id===active));b.onclick=()=>{presetOverride=id==='custom';if(!presetOverride)selected.rules=DuelCore.applyPreset(selected.rules,id);rulesChanged();};root.append(b);}$('preset-note').textContent=(DuelCore.PRESETS[active]?.description||'Seus valores manuais, sem perder nenhum ajuste.')+' Mapa, pontos e especiais são preservados.';}
function renderRules(){renderPresets();`);
 r("number.step=k==='dashCount'?'1':'any'","number.step=k==='dashCount'||r.integer?'1':'any'");
 r("parent.append(label);\n }", "if(k==='winningScore'){const quick=document.createElement('div');quick.className='score-presets';for(const n of[3,5,7,10]){const b=document.createElement('button');b.type='button';b.textContent=n;b.dataset.score=n;b.disabled=configLocked();b.className=selected.rules.winningScore===n?'selected':'';b.onclick=()=>{selected.rules.winningScore=n;rulesChanged();};quick.append(b);}label.append(quick);}parent.append(label);\n }");
 r(" $('specials-enabled').checked=", " $('persist-special').checked=selected.rules.persistSpecial;$('persist-special').disabled=configLocked();$('specials-enabled').checked=");
 r("const player={kind:selected.characters[0],skin:","const player={admin:!!admin,kind:selected.characters[0],skin:");
 r("name.textContent=(i===seat?'VOCÊ':'OPONENTE')+", "name.textContent=(i===seat?'VOCÊ':'OPONENTE')+(p.admin?' · ADMIN':'')+");
 r("+' · Especiais '+(l.config.rules.specials?'ligados':'desligados')+(l.config.adminSession?' · SALA DE TESTE: o anfitrião pode mudar mapa, classes e regras durante o duelo.':'')", "+' · Especiais '+(l.config.rules.specials?'ligados':'desligados')+' · Carga entre rounds '+(l.config.rules.persistSpecial?'mantida':'zerada')+(l.config.adminSession?' · ADMIN: '+l.players.map((p,i)=>p.admin?'J'+(i+1):'').filter(Boolean).join(' e ')+' pode alterar o duelo; mudanças sincronizadas.':'')");
 r('function disconnect(){const previous','function disconnect(){closeSpecialIntro();const previous');
 r('countdown=1;showGame();presentSpecials','countdown=game.rules.specials?0:1;showGame();presentSpecials');
 r("lab.resetTraining(game);renderer.actorHistory=[];","lab.resetTraining(game,true);renderer.actorHistory=[];");
 r("typeof c.rules.specials==='boolean'", "typeof c.rules.specials==='boolean'&&typeof c.rules.persistSpecial==='boolean'");
 r("&&(!RULES[k].options||Number.isInteger(c.rules[k]*2))", "&&(!RULES[k].integer||Number.isSafeInteger(c.rules[k]))&&(!RULES[k].options||Number.isInteger(c.rules[k]*2))");
 r('votes:[false,false],packet','votes:[false,false],adminQueue:[],adminTokens:new Set(),adminSequence:0,lastAdmin:null,countdownFrames:packet.rules.specials?0:120,packet');
 r('countdown=2;showGame();presentSpecials','countdown=game.rules.specials?0:2;showGame();presentSpecials');
 r("l.players.every(validPlayer)||!validConfig(l.config)","l.players.every(validPlayer)||l.players[0].admin!==net.remoteAdmin||l.players[1].admin!==!!admin||!validConfig(l.config)");
 r("lobby.players[1]={kind:msg.kind", "lobby.players[1]={admin:!!net.remoteAdmin,kind:msg.kind");
 r("if(msg.type==='ready'&&seat===0&&!s.started){s.peerAccepted=true;if(s.introAccepted&&sendRequired({type:'go',id:s.id}))s.started=true;return;}if(msg.type==='go'&&seat===1){s.started=true;return;}",`if(msg.type==='introShown'&&seat===0&&!s.started){s.peerIntroShown=true;startIntroClock();return;}
 if(msg.type==='introClock'&&seat===1&&!s.started&&introState&&Number.isFinite(msg.remaining)&&msg.remaining>=0&&msg.remaining<=10000){introState.deadline=performance.now()+Math.max(0,msg.remaining-(net.latency||0)/2);paintIntro();return;}
 if(msg.type==='ready'&&seat===0&&!s.started){s.peerAccepted=true;if(s.introAccepted)finishOnlineIntro();return;}if(msg.type==='go'&&seat===1&&!s.started){s.started=true;closeSpecialIntro();accumulator=0;return;}`);
 r('(120-s.frame)/60','(s.countdownFrames-s.frame)/60');
 r('new DuelOnline({onStatus','new DuelOnline({adminBuild:!!admin,onStatus');
 r("players:[{kind:selected.characters[0]", "players:[{admin:!!admin,kind:selected.characters[0]");
 r("},{kind:net.remoteCharacter,skin:'default'", "},{admin:!!net.remoteAdmin,kind:net.remoteCharacter,skin:'default'");
 let a=g().indexOf('function presentSpecials('),b=g().indexOf('function updateSpecialHUD',a);s(g().slice(0,a)+fs.readFileSync(p('intro-functions.txt'),'utf8')+'\n'+g().slice(b));
 a=g().indexOf('function requestAdmin(');b=g().indexOf('function frame(ms)',a);s(g().slice(0,a)+fs.readFileSync(p('admin-sync.txt'),'utf8')+'\n'+g().slice(b));
 r("'SALA DE TESTE · PAUSADA PELO ANFITRIÃO'", "'PAUSA ADMIN · JOGADOR '+((onlineSession.lastAdmin?.actor??0)+1)");
 r("'PRIMEIRO A 5 · UM GOLPE DECIDE'", "'PRIMEIRO A '+drawn.rules.winningScore+' · UM GOLPE DECIDE'");
 r("$('specials-enabled').onchange=", "$('persist-special').onchange=()=>{selected.rules.persistSpecial=$('persist-special').checked;rulesChanged();};$('specials-enabled').onchange=");
 r("$('reset-rules').onclick=()=>{selected.rules=cleanRules();", "$('reset-rules').onclick=()=>{presetOverride=false;selected.rules=cleanRules();");
 r("allowed:selected.mode!=='online'||seat===0&&lobby?.config.adminSession", "allowed:selected.mode!=='online'||!!onlineSession?.started");
 r('adminPending:!!onlineSession?.pendingAdmin', "adminPending:!!onlineSession?.pendingAdmin||!!onlineSession?.adminQueue?.length,lastAdmin:onlineSession?.lastAdmin||null,intro:{open:$('special-intro').open,accepted:!!introState?.accepted,remaining:introState?.deadline?Math.max(0,(introState.deadline-performance.now())/1000):null},preset:presetOverride?'custom':DuelCore.detectPreset(selected.rules)");
});
