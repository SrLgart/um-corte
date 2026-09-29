const fs=require('fs'),path=require('path'),p=f=>path.join(__dirname,f),base=f=>fs.readFileSync(p('../v72/'+f),'utf8');
function edit(file,fn){fs.writeFileSync(p(file),fn(base(file)));}
edit('app.js',s=>s.replace('let v7=null;','let v7=null,v8=null;').replace("function returnMenu(message=''){","function returnMenu(message=''){v8?.cleanup();")
 .replace("showGame();presentSpecials(()=>{});}","showGame();if(!v8?.afterStart())presentSpecials(()=>{});}")
 .replace("for(const ev of game.events.splice(0)){","for(const ev of game.events.splice(0)){if(v8?.events(ev))continue;")
 .replace("input.poll(dt);v7?.roomTick(dt);","v8?.frame(dt);input.poll(dt);v7?.roomTick(dt);")
 .replace("for(let id=0;id<2;id++){for(const k", "for(let id=0;id<2;id++){buffers[id].legado=[...new Set([...(buffers[id].legado||[]),...(inputs[id].legado||[])])];buffers[id].legadoHeld=[...(inputs[id].legadoHeld||[])];for(const k")
 .replace("if(!frozen)for(const b of buffers)b.attack=b.parry=b.dash=b.jump=b.kick=b.special=b.taunt=false;", "if(!frozen)for(const b of buffers){b.attack=b.parry=b.dash=b.jump=b.kick=b.special=b.taunt=false;b.legado=[];}")
 .replace('/* V7_INTEGRATION */','/* V7_INTEGRATION */\n/* V8_INTEGRATION */')
 .replace('v7=makeV7();refreshMenu();','v7=makeV7();v8=makeV8();refreshMenu();')
 .replace("function config(){return{mapId", "function config(){return{legacyMode:$('legacy-mode')?.value||'off',mapId")
 .replace("window.duelSnapshot", "window.duelSnapshot")
 .replace("for(let i=0;i<2;i++)$(i?'right-class':'left-class').textContent=CLASSES[drawn.fighters[i].kind].name;", "for(let i=0;i<2;i++)$(i?'right-class':'left-class').textContent=drawn.fighters[i].wanderer?'ERRANTE':drawn.fighters[i].boss?DuelPath.BOSSES.find(b=>b.id===drawn.fighters[i].boss)?.name:CLASSES[drawn.fighters[i].kind].name;")
 .replace("canvas.focus({preventScroll:true});presentSpecials(()=>{});}","canvas.focus({preventScroll:true});if(!v8?.afterStart())presentSpecials(()=>{});}"));
edit('controls.js',s=>s.replace("if(r.dash)r.jump=false;if(consume)","Object.assign(r,window.DuelLegacyInput?.read(source,f,consume)||{});if(r.dash)r.jump=false;if(consume)"));
edit('renderer.js',s=>s.replace('const trail=this.slashTrails[f.id];','const trail=this.slashTrails[f.id]??=[];').replace("const p=f.dagger;if(p){", "const p=f.dagger;if(p&&!p.carrier){").replace("const fencing=f.kind==='duelist'","const fencing=DuelLegacy.specialKind(f)==='duelist'")
 .replace('minX=Math.min(...fs.map(f=>f.x))-210',"cameraWidth=game.mapId.startsWith('path_')?Math.min(1280,this.viewWidth):this.viewWidth,cameraHeight=game.mapId.startsWith('path_')?Math.min(720,this.viewHeight):this.viewHeight,minX=Math.min(...fs.map(f=>f.x))-210")
 .replace('this.viewWidth/(maxX-minX),this.viewHeight/(maxY-minY)','cameraWidth/(maxX-minX),cameraHeight/(maxY-minY)')
 .replace('half=this.viewWidth/2/z','half=cameraWidth/2/z')
 .replace('game.map.height-(this.viewHeight/2-150)/z','game.map.height-(cameraHeight/2-150)/z'));
edit('room.js',s=>s.replace("VERSION=72,PREFIX='umcorte-v72-'","VERSION=8,PREFIX='umcorte-v8-'").replaceAll('V7.2','V8').replace("return o;}\nfunction validData", "for(const key of ['legado','legadoHeld'])o[key]=Array.isArray(c[key])?[...new Set(c[key].filter(id=>typeof id==='string'&&root.DuelLegacy?.catalog[id]?.active))].slice(0,16):[];return o;}\nfunction validData"));
// Preserve the previous changelog; only the current title and download identity change.
edit('shell.html',s=>s.replaceAll('UM CORTE V7.2','UM CORTE V8').replaceAll('UM-CORTE-V7.2','UM-CORTE-V8').replaceAll('VII.2','VIII').replace('V7.2 · MOVIMENTO LIVRE','V8 · CAMINHO DO GUERREIRO').replace('V7.2 · Movimento livre','V8 · Caminho do Guerreiro').replace('/* ENGINE */','/* ENGINE */\n/* LEGACY_CATALOG */\n/* LEGACIES */\n/* LEGACY_COMBAT */\n/* PATH */\n/* V8_DETAIL */').replace('/* ROOM */','/* ROOM */\n/* PATH_WATCH */').replace('/* V7_VISUALS */','/* V7_VISUALS */\n/* V8_VISUALS */').replace('<details open><summary>V7.2','<details open><summary>V8 · Caminho do Guerreiro</summary><p>Uma jornada solo de 50 níveis, com encontros em grupo, bosses e amigos como espectadores. Monte sua build com 115 Legados entre armas, vestimentas, relíquias, técnicas, invocações e poderes. Consulte a build com Tab; experimente o catálogo no laboratório do treino. As arenas do Caminho têm paredes laterais contínuas, com wall jump e wall slide. Continuação e recordes salvos no navegador. Doze bosses com identidade própria, cinco arenas exclusivas, IA preparada para as novas habilidades, cortes mais legíveis e corrida do Corredor renovada. Legados opcionais nos duelos, PvE, local, online e torneio; ferramentas completas no treino e na edição ADMIN.</p></details><details><summary>V7.2'));
edit('build.cjs',s=>s.replace("['ENGINE','engine.js']","['ENGINE','engine.js'],['LEGACY_CATALOG','legacy-catalog.js'],['LEGACIES','legacies.js'],['LEGACY_COMBAT','legacy-combat.js'],['PATH','path.js'],['V8_DETAIL','v8-detail.js']").replace("['ROOM','room.js']","['ROOM','room.js'],['PATH_WATCH','path-watch.js']").replace("['APP','app.js']","['V8_VISUALS','v8-visuals.js'],['APP','app.js']").replace("text=text.replace('/* V7_INTEGRATION */',()=>fs.readFileSync(p('v7-ui.js'),'utf8'))", "text=text.replace('/* V7_INTEGRATION */',()=>fs.readFileSync(p('v7-ui.js'),'utf8')).replace('/* V8_INTEGRATION */',()=>fs.readFileSync(p('v8-ui.js'),'utf8'))").replace("'v7.css']","'v7.css','v8.css']").replaceAll('V7.2','V8').replaceAll('v7.2','v8'));
edit('serve.cjs',s=>s.replaceAll('v7.2','v8').replaceAll('V7.2','V8').replaceAll('4188','4189'));
// Keep integration changes reproducible from the preserved V7.2 sources.
edit('v7-ui.js',s=>s.replace('return snap;},snapshot:', 'return DuelLegacy.networkSnapshot(snap);},snapshot:')
 .replace('game=new Game({...cfg,mapId,characters:', 'game=new Game({...cfg,seed:init.seed,mapId,characters:')
 .replace('random:seeded(init.seed)', 'random:DuelLegacy.rng(init.seed)')
 .replace('game.loadSnapshot(snap);state.watchBlend', 'game.loadSnapshot(DuelLegacy.restoreLocalBindings(game,snap));state.watchBlend')
 .replace('admin:change=>{if(state.raceActive)', "legacyOffer:packet=>v8?.onlineOffer(packet),legacyDone:packet=>v8?.onlineDone(packet),admin:change=>{if(change.action==='legacy'){DuelLegacy.applyEdit(game,change);return;}if(state.raceActive)")
 .replace('state.matchPlayers=players;',"state.matchPlayers=players;if($('legacy-mode'))$('legacy-mode').value=cfg.legacyMode||'off';")
 .replace('if(snapshot)game.loadSnapshot(state.restoreImages(snapshot));state.watchEvents=[];', 'if(snapshot)game.loadSnapshot(DuelLegacy.restoreLocalBindings(game,state.restoreImages(snapshot)));state.watchEvents=[];if(!watch&&cfg.mode!==\'parkour\'&&state.room.host)state.room.startLegacyDraft(game);')
 .replace('selected.rules={...s.config.rules};', "selected.rules={...s.config.rules};if($('legacy-mode'))$('legacy-mode').value=s.config.legacyMode||'off';")
 .replace("intro.showModal();}else if(!watch)","if(cfg.legacyMode==='off'||!cfg.legacyMode)intro.showModal();}else if(!watch)"));
const revise=(f,fn)=>fs.writeFileSync(p(f),fn(fs.readFileSync(p(f),'utf8')));
revise('room.js',s=>s.replace('if(this.h.ended()){this.playing=false;', 'if(this.legacyGate)break;if(this.h.ended()){this.playing=false;'));
revise('shell.html',s=>s.replace('/* PATH_WATCH */','/* LEGACY_ONLINE */\n/* PATH_WATCH */'));
revise('build.cjs',s=>s.replace("['PATH_WATCH','path-watch.js']","['LEGACY_ONLINE','legacy-online.js'],['PATH_WATCH','path-watch.js']"));
edit('actors.js',s=>s.replace('cycle=f.anim*1.55','cycle=f.anim*(f.kind===\'runner\'?1.95:1.55)')
 .replace('const stride=backwalk?26:36','if(f.kind===\'runner\'){hip.y+=run*6;shoulder.x+=side*run*11;shoulder.y+=run*4;head.x=shoulder.x+side*5;head.y=shoulder.y-17;}const stride=backwalk?26:f.kind===\'runner\'?45:36')
 .replace('Math.cos(a))*14*run','Math.cos(a))*(f.kind===\'runner\'?29:14)*run')
 .replace("two=['lancer','swordsman','reaper','staff'].includes(f.kind)","two=['lancer','swordsman','reaper','staff'].includes(DuelLegacy.weaponKind(f)||f.kind)")
 .replace("if(f.kind==='boxer'){second.x=", "if((DuelLegacy.weaponKind(f)||f.kind)==='boxer'&&(!DuelLegacy.weaponId(f)||DuelLegacy.mirrorWeapon(f))){second.x=")
 .replace('side*(13-a*20)','side*(23-a*33)').replace('27-a*12','22-a*20').replace('side*(14-a*18)','side*(20-a*30)').replace('29+a*12','24+a*19')
 .replace('if(DuelSkins.cloth(r,f,', 'DuelV8Actors.back(r,f,{hip,shoulder,head,side,st,t,portrait});if(DuelSkins.cloth(r,f,')
 .replace('arm(hand,true);', 'arm(hand,true);DuelV8Actors.front(r,f,{hip,shoulder,head,hand,second,feet,side,st,t,portrait});')
 .replace("if(f.kind==='lancer'&&!custom)", "DuelV8Actors.headgear(r,f,{hip,shoulder,head,side,st,t,portrait});if(f.kind==='lancer'&&!custom)"));
revise('shell.html',s=>s.replace('/* V8_VISUALS */','/* V8_VISUALS */\n/* V8_ACTORS */'));
revise('build.cjs',s=>s.replace("['V8_VISUALS','v8-visuals.js']","['V8_VISUALS','v8-visuals.js'],['V8_ACTORS','v8-actors.js']"));
revise('controls.js',s=>s.replaceAll("r.attackHeld=held('attack');", "r.attackHeld=held('attack');r.kickHeld=held('kick');"));
revise('app.js',s=>s.replace("'up','attackHeld'", "'up','attackHeld','kickHeld'"));
revise('v7-ui.js',s=>s.replaceAll("!MAPS[k].custom&&MAPS[k].type!=='parkour'", "!MAPS[k].custom&&!MAPS[k].path&&MAPS[k].type!=='parkour'"));
revise('app.js',s=>s.replaceAll("m.type!=='parkour'", "m.type!=='parkour'&&!m.path").replaceAll("MAPS[k].type!=='parkour'", "MAPS[k].type!=='parkour'&&!MAPS[k].path"));
revise('shell.html',s=>s.replace('<option value="adaptive">Adaptativo</option>', '<option value="hard">Difícil</option><option value="adaptive">Adaptativo</option>'));
console.log('V8 integration generated without changing V7.2 sources.');
edit('audio.js',s=>s.replace("if(type==='propHit'){", "if(type==='legacyChargeReady'){tone(180,.22,.06,'triangle',720);tone(1440,.24,.04);noise(.10,.045,3400);return;}if(type==='legacyBeam'){tone(ev.strong?90:160,.22,.14,'sine',40);noise(ev.strong?.26:.15,.16,ev.strong?1100:2200);return;}if(type==='propHit'){"));
// Handoff tooling: optional destination, preserving the historical default.
revise('build.cjs',s=>s.replace("p=n=>path.join(__dirname,n);", "p=n=>path.join(__dirname,n);\nconst outDir=process.argv[2]?path.resolve(process.argv[2]):p('../../outputs');fs.mkdirSync(outDir,{recursive:true});")
 .replace("const out=p('../../outputs/um-corte-v8'+(admin?'-admin':'')+'.html')", "const out=path.join(outDir,'um-corte-v8'+(admin?'-admin':'')+'.html')"));
