const fs=require('fs'),path=require('path'),p=f=>path.join(__dirname,f);function edit(file,fn){let s=fs.readFileSync(p(file),'utf8');const r=(a,b)=>{if(!s.includes(a))throw Error(file+' missing '+a.slice(0,100));s=s.replace(a,b);};fn(r,()=>s,v=>s=v);fs.writeFileSync(p(file),s);}
edit('app.js',(r,get,set)=>{
 r('const effects={impact:', 'const session=new DuelSession(),sfx=new DuelAudio();\nconst effects={fatal:null,lights:[],signatures:[],impact:');
 const a=get().indexOf('function unlockAudio()'),b=get().indexOf('function burst(',a);set(get().slice(0,a)+"function unlockAudio(){sfx.unlock();}\nfunction noise(...args){sfx.noise(...args);}\nfunction sound(type,ev){sfx.play(type,ev);}\n"+get().slice(b));
 r("Object.entries(MAP_CHOICES)){", "Object.entries(MAP_CHOICES).filter(([k])=>k!=='random').concat([['random',MAP_CHOICES.random]])){");
 r("function renderRules(){renderPresets();", "function renderRules(){renderPresets();$('chaos-mode').value=selected.rules.chaos;$('chaos-mode').disabled=configLocked();");
 r('function resetEffects(){effects.particles=[];', 'function resetEffects(){effects.fatal=null;effects.lights=[];effects.signatures=[];effects.particles=[];');
 r('function showGame(){lab.trainingPaused=false;', "function showGame(){if(session.begin(game,selected.mode==='online'?net:selected.mode)){lab.bestReplay=null;lab.clip=null;}lab.trainingPaused=false;");
 r('lab.observe(ev,game);sound(ev.type);', "lab.observe(ev,game);sound(ev.type,ev);if(['kill','parry','clash','special','shieldBreak'].includes(ev.type))effects.lights.push({x:ev.x,y:ev.y,age:0,color:ev.type==='parry'?'#b8e9ff':'#ffdbad'});if(ev.type==='special')effects.signatures.push({...ev,age:0});if(ev.type==='matchPoint'){effects.eventText='PONTO DA PARTIDA';effects.eventLife=1.8;}if(ev.type==='kill')session.sync(game);");
 r("effects.shake=reduced?0:7;effects.flash=reduced?.025:.13;effects.cuts.push({x:ev.x,y:ev.y,life:.3,maxLife:.3});burst(ev.x,ev.y,22,'#eadeba',.75);", "effects.fatal={...ev,age:0};effects.shake=reduced?0:5;effects.flash=reduced?.015:.09;burst(ev.x,ev.y,7,'#eadeba',.5);");
 r("$('round-feedback').classList.add('visible');}","$('round-feedback').classList.remove('visible');}");
 r("burst(ev.x,ev.y,22,'#eaca82');","burst(ev.x,ev.y,9,'#eaca82');");
 r("burst(ev.x,ev.y,25,'#fff2b6');","burst(ev.x,ev.y,12,'#fff2b6');");
 r("if(game.mode==='training'){lab.resetTraining(game,true);", "effects.fatal=null;if(game.mode==='training'&&game.baseRules.chaos==='off'){lab.resetTraining(game,true);");
 r("else if(ev.type==='matchEnd'){$('round-feedback')", "else if(ev.type==='matchEnd'){session.sync(game);$('round-feedback')");
 r('function updateEffects(dt){effects.impact=',"function updateEffects(dt){for(const p of effects.lights)p.age+=dt;effects.lights=effects.lights.filter(p=>p.age<.4);for(const p of effects.signatures)p.age+=dt;effects.signatures=effects.signatures.filter(p=>p.age<.65);if(effects.fatal){effects.fatal.age+=dt;if(effects.fatal.age>.4&&game.phase==='roundEnd')$('round-feedback').classList.add('visible');}effects.impact=");
 r("typeof c.rules.persistSpecial==='boolean'&&Object.keys", "typeof c.rules.persistSpecial==='boolean'&&Object.hasOwn(DuelCore.MODES,c.rules.chaos)&&Object.keys");
 r("c.rules&&['airDash','specials'", "c.rules&&Object.hasOwn(DuelCore.MODES,c.rules.chaos)&&['airDash','specials'");
 r('selected.rules={...game.rules};', 'selected.rules={...game.baseRules};');r('rules:cleanRules(game.rules),adminSession:', 'rules:cleanRules(game.baseRules),adminSession:');
 r("if(!game.rules.specials){done();return;}","if(!game.baseRules.specials){done();return;}");
 r("if(!game.rules.specials&&performance.now()", "if(!game.baseRules.specials&&performance.now()");
 r("function closeReplay(){lab.close();", "function closeReplay(){lab.close();if(lab.savedClip){lab.clip=lab.savedClip;lab.savedClip=null;}");
 r("!$('skin-preview').open;input.poll", "!$('skin-preview').open&&!$('session-stats').open;input.poll");
 r("const drawn=lab.viewGame||game;renderer.debug", "const drawn=lab.viewGame||game;sfx.ambient(!inMenu&&!paused&&!lab.viewGame&&game.phase==='playing');updateV5UI(drawn);renderer.debug");
 r("$('combat-event').classList.toggle('visible',effects.eventLife>0&&drawn.phase==='playing');", "$('combat-event').classList.toggle('visible',effects.eventLife>0&&drawn.phase==='playing');");
 r("$('countdown').textContent=countdown>1?String(Math.ceil(countdown)):'Em guarda';", "$('countdown').textContent=countdown>1?String(Math.ceil(countdown)):'Em guarda';if(!inMenu&&drawn.phase==='roundIntro'){$('countdown').hidden=drawn.introRemaining>3;$('countdown').textContent=Math.ceil(drawn.introRemaining);} ");
 r("muted=!muted;unlockAudio();", "muted=!muted;unlockAudio();sfx.setMuted(muted);");
 r("$('persist-special').onchange=", "$('chaos-mode').onchange=()=>{selected.rules.chaos=$('chaos-mode').value;rulesChanged();};$('persist-special').onchange=");
 r('window.duelSnapshot=()=>({version:43,release:\'4.3\',', "window.duelSnapshot=()=>({version:50,release:'5',baseRules:{...game.baseRules},chaos:{stack:[...(game.chaosStack||[])],next:game.chaosNew,intro:game.introRemaining,state:game.chaosState},metrics:game.metrics,session:session.players,graphics:{...renderer.lighting.settings},highlight:lab.bestReplay?.highlight||null,");
 r("$('history-button').onclick=",fs.readFileSync(p('v5-ui.inc'),'utf8')+"\n$('history-button').onclick=");
 set(get().replaceAll('V4.3','V5'));
});
edit('lab.js',(r)=>{
 r("this.clip={frames:this.history.slice(),seat,reason:g.lastReason,characters:[...g.characters],mapId:g.mapId};", "this.clip={frames:this.history.slice(),seat,reason:g.lastReason,characters:[...g.characters],mapId:g.mapId,highlight:g.lastHighlight};if(g.lastHighlight&&(!this.bestReplay||g.lastHighlight.weight>=this.bestReplay.highlight.weight))this.bestReplay=this.clip;");
 // A training reset is a checkpoint operation, not a session-statistics reset.
 r("g.loadSnapshot(this.checkpoint);if(charges)","const metrics=g.metrics;g.loadSnapshot(this.checkpoint);g.metrics=metrics;if(charges)");
});
edit('admin.js',(r,get,set)=>{set(get().replaceAll('(rules||g.rules)','(rules||g.baseRules)'));r("select('admin-map','Mapa',MAPS,g.mapId);", "select('admin-map','Mapa',MAPS,g.mapId);select('admin-chaos','Modo Caos',Object.fromEntries(Object.entries(DuelCore.MODES).map(([id,name])=>[id,{name}])),(rules||g.baseRules).chaos);const effective=document.createElement('p');effective.className='admin-effective';effective.textContent='Edite as regras base. Modificadores ativos: '+(g.chaosStack.map(id=>DuelCore.CHAOS.find(m=>m.id===id).name).join(' · ')||'nenhum')+'. Efetivo: ataque '+g.rules.attackSpeed.toFixed(2)+'× · movimento '+g.rules.speed.toFixed(2)+'× · gravidade '+g.rules.gravity.toFixed(2)+'× · arena '+g.rules.mapSize.toFixed(2)+'× · parry '+Math.round(g.rules.parryWindow)+' ms · '+g.rules.dashCount+' dashes · especial '+(g.rules.specials?g.rules.specialCooldown.toFixed(2)+' s':'OFF');parent.append(effective);");r('apply(){const rules={};',"apply(){const rules={chaos:$('admin-chaos').value};");});
edit('network.js',(r,get,set)=>set(get().replace('VERSION = 43','VERSION = 50').replaceAll('v43','v5').replaceAll('V4.3','V5')));
edit('build.cjs',(r,get,set)=>{r("['RENDERER','renderer.js']","['LIGHTING','lighting.js'],['AUDIO','audio.js'],['SESSION','session.js'],['RENDERER','renderer.js']");r("'v43.css']","'v43.css','v5.css']");set(get().replaceAll('v43','v5').replaceAll('V43','V5'));});
