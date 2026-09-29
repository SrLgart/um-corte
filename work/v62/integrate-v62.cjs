const fs=require('fs'),r=__dirname;
let s=fs.readFileSync(r+'/scenery-extra.js','utf8'),a=s.indexOf("if(id==='sanctuary'){"),b=s.indexOf('}else draw.call(this,r,{...g,mapId:id},t);',a);if(a<0||b<0)throw Error('sanctuary markers');s=s.slice(0,a)+"if(id==='sanctuary'){DuelScenery.sanctuary(r,t,(640-r.camera.x)*.09);"+s.slice(b);fs.writeFileSync(r+'/scenery-extra.js',s);
s=fs.readFileSync(r+'/scenery.js','utf8').replace("else if(game.mapId==='ruins'||game.mapId==='bamboo')", "else if(game.mapId==='bamboo')");fs.writeFileSync(r+'/scenery.js',s);
function edit(a,b){let s=fs.readFileSync(r+'/app.js','utf8');if(!s.includes(a))throw Error('app missing '+a.slice(0,100));fs.writeFileSync(r+'/app.js',s.replace(a,b));}
edit('let introState=null,presetOverride=false;', 'let introState=null,presetOverride=false,tournament=null;');
edit("function returnMenu(message=''){", "function returnMenu(message=''){tournament=null;$('tournament-screen').close();");
edit("function refreshMenu(){", "function refreshMenu(){$('tournament-setup').hidden=selected.mode!=='tournament';$('start').innerHTML=selected.mode==='tournament'?'ENTRAR NO TORNEIO <span>↗</span>':'ENTRAR NO DUELO <span>↗</span>';");
edit("$('opponent-side').hidden=selected.mode==='online';", "$('opponent-side').hidden=['online','tournament'].includes(selected.mode);");
edit("$('difficulty-area').hidden=selected.mode!=='pve';", "$('difficulty-area').hidden=!['pve','tournament'].includes(selected.mode);");
edit("selected.mode==='pve'?'RIVAL'", "['pve','tournament'].includes(selected.mode)?'RIVAL'");
edit("(selected.mode==='pve'?DIFFICULTIES[selected.difficulty].name", "(['pve','tournament'].includes(selected.mode)?DIFFICULTIES[selected.difficulty].name");
edit("function startOffline(){unlockAudio();", "function startOffline(){if(selected.mode==='tournament')return startTournament();unlockAudio();");
edit("else if(ev.type==='matchEnd'){session.sync(game);", "else if(ev.type==='matchEnd'){session.sync(game);if(tournament){finishTournamentMatch();continue;}");
edit("function requestRematch(){", "function requestRematch(){if(tournament)return;");
edit("!$('session-stats').open&&$('title-screen').hidden", "!$('session-stats').open&&!$('tournament-screen').open&&$('title-screen').hidden");
edit("function requestAdmin(change){if(!admin||inMenu||lab.viewGame)return false;", "function requestAdmin(change){if(!admin||inMenu||lab.viewGame)return false;if(tournament&&change.action==='apply'&&change.characters.some((k,i)=>k!==game.characters[i])){$('admin-status').textContent='As classes permanecem fixas durante o torneio.';return false;}");
edit("game.adminApply(change);selected.characters=", "game.adminApply(change);if(tournament)tournament.rules={...game.baseRules};selected.characters=");
edit("version:60,release:'6',", "version:62,release:'6.2',tournament:tournament?.snapshot()||null,");
let app=fs.readFileSync(r+'/app.js','utf8');app=app.replace("b.onclick=()=>{selected.mapId=k;rulesChanged();};", "b.onclick=()=>{selected.mapId=k;if(selected.mode==='tournament'&&k==='random')$('tournament-map-mode').value='random';rulesChanged();};");fs.writeFileSync(r+'/app.js',app);
