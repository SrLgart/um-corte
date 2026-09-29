const fs=require('fs'),p=__dirname+'/v8-ui.js';let s=fs.readFileSync(p,'utf8');
function change(a,b){if(!s.includes(a))throw Error('Missing UI anchor: '+a);s=s.replace(a,b);}
change("function currentDraft(){return state.run?.phase==='draft'?state.run.draft:state.offlineDraft?.draft;}","function currentDraft(){return state.onlineDraft?.draft||(state.run?.phase==='draft'?state.run.draft:state.offlineDraft?.draft);}");
change("function draftFighter(){return state.run?{legacy:state.run.inventory}:game.fighters[state.offlineDraft?.side||0];}","function draftFighter(){return state.onlineDraft?{legacy:state.onlineDraft.inventory}:state.run?{legacy:state.run.inventory}:game.fighters[state.offlineDraft?.side||0];}");
change("((state.offlineDraft?.side||0)+1)","((state.onlineDraft?.side??state.offlineDraft?.side??0)+1)");
change("c.onclick=()=>{d.selected=i;drawDraft();}","c.onclick=()=>{d.selected=i;if(state.onlineDraft)v7.room.legacyAction('highlight',{index:i});drawDraft();}");
change("$('draft-confirm').disabled=state.watching;","$('draft-confirm').disabled=state.watching||!!state.onlineDraft?.waiting;");
change("const id=d.cards[d.selected];if(state.run)","const id=d.cards[d.selected];if(state.onlineDraft){if(!state.onlineDraft.waiting){state.onlineDraft.waiting=true;v7.room.legacyChoose(id);if(state.onlineDraft)drawDraft();}return;}if(state.run)");
change("$('draft-reroll').onclick=()=>{if(state.run)","$('draft-reroll').onclick=()=>{if(state.onlineDraft){v7.room.legacyAction('reroll');return;}if(state.run)");
change("$('draft-mark').onclick=()=>{const d=currentDraft(),f=draftFighter();", "$('draft-mark').onclick=()=>{const d=currentDraft(),f=draftFighter();if(state.onlineDraft){v7.room.legacyAction('mark',{legacy:d.cards[d.selected]});return;}");
change("$('draft-orb').onclick=()=>{const d=currentDraft(),f=draftFighter();", "$('draft-orb').onclick=()=>{const d=currentDraft(),f=draftFighter();if(state.onlineDraft){v7.room.legacyAction('peek');return;}");
change("state.offlineDraft=null;state.intro=null;", "state.offlineDraft=null;state.onlineDraft=null;state.intro=null;");
change("state.frame=dt=>{state.clock+=dt;", "state.frame=dt=>{state.clock+=dt;if(state.onlineDraft){$('draft-note').textContent=(state.onlineDraft.waiting?'ESCOLHA CONFIRMADA · aguardando o rival. ':'ESCOLHA SECRETA · ')+Math.max(0,Math.ceil((state.onlineDraft.deadline-Date.now())/1000))+' s';}");
change("d.selected=(d.selected+(e.code==='ArrowRight'?1:d.cards.length-1))%d.cards.length;drawDraft();", "d.selected=(d.selected+(e.code==='ArrowRight'?1:d.cards.length-1))%d.cards.length;if(state.onlineDraft)v7.room.legacyAction('highlight',{index:d.selected});drawDraft();");
change("state.events=ev=>{if(state.watching)return false;", "state.events=ev=>{if(state.watching)return false;if(ev.type==='round'&&v7?.room?.host&&v7.room.config?.legacyMode==='round')v7.room.startLegacyDraft(game);");
change("state.run.stats.time+=game.runTime||0;state.run.reward(game);", "state.run.reward(game);");
// All edits affecting shared combat travel as semantic operations. Bindings stay local.
change("function notice(t){", `function editBuild(op,value){if(state.watching)return false;const c={side:state.inventorySide,op,value};if(v7?.room){if(v7.watching&&!admin)return false;v7.room.send({t:'legacyEdit',sid:v7.room.s.id,change:c});notice('Alteração enviada à partida.');return true;}return L.applyEdit(game,{...c,administrator:!!admin||selected.mode==='training'});}
 function notice(t){`);
change("if(L.equip(f,id,game.phase))", "if(editBuild('equip',id))");
change("l.gesture=id;inventory();", "editBuild('gesture',id);inventory();");
change("select.onchange=()=>l.target=select.value", "select.onchange=()=>editBuild('target',select.value)");
change("select.onchange=()=>l.diceTarget=select.value", "select.onchange=()=>editBuild('diceTarget',select.value)");
change("L.remove(f,id);inventory();", "editBuild('remove',id);inventory();");
change("game.legacyEnabled=true;L.add(f,id);if(c.category==='summon')L.spawnCompanions(game,f);", "editBuild('add',id);");
change("l.cd={};l.used={duel:{},match:{},run:{}};l.consumed=[];L.refill(game,f);", "editBuild('refill');");
change("L.reset(game.fighters[state.inventorySide],null);game.legacyWorld.entities=game.legacyWorld.entities.filter(e=>e.owner!==state.inventorySide);", "editBuild('clear');");
// Crown's extra reward is an actual choice, not an automatic first entry.
change("state.run.pick(id);save();", "if(state.run.draft.stealing)state.run.stealPick(id);else state.run.pick(id);save();");
change("const id=state.run.steal[0];state.run.stealPick(id);notice('Coroa conquistou '+L.catalog[id].name);save();draft.close();nextLevel();", "state.run.draft={...d,cards:[...state.run.steal],selected:0,picked:[],choices:1,stealing:true};save();drawDraft();");
// Drawing the two sides from a fresh neutral pattern prevents borrowed clover/magnet bonuses.
change("state.offlineDraft={side:0,pattern:null,draft:L.draft(game.fighters[0],{mode:selected.mode,futureDraft:true})};state.offlineDraft.pattern=state.offlineDraft.draft.cards.map(id=>L.catalog[id].rarity);", "const pattern=L.draftPattern();state.offlineDraft={side:0,pattern,draft:L.draft(game.fighters[0],{mode:selected.mode,futureDraft:true},Math.random,pattern)};");
change("state.offlineDraft={side:0,pattern:null,draft:L.draft(game.fighters[0],{mode:selected.mode,futureDraft:$('legacy-mode').value==='round'})};state.offlineDraft.pattern=state.offlineDraft.draft.cards.map(id=>L.catalog[id].rarity);", "const pattern=L.draftPattern();state.offlineDraft={side:0,pattern,draft:L.draft(game.fighters[0],{mode:selected.mode,futureDraft:$('legacy-mode').value==='round'},Math.random,pattern)};");
change("updateContinue();return state;", `state.onlineOffer=packet=>{state.onlineDraft=packet;state.inventorySide=packet.side;$('room-intro').close();drawDraft();if(packet.draft.preview){const text=packet.draft.preview.map(id=>L.catalog[id].name).join(' · ');if(confirm('Destino possível: '+text+'\\nSubstituir as cartas atuais?'))v7.room.legacyAction('replace');}};
 state.onlineDone=packet=>{state.onlineDraft=null;draft.close();game.loadSnapshot(L.restoreLocalBindings(game,packet.snapshot));game.legacyRoundStart=game.snapshot();paused=false;state.hash='';clearInputs();};
 $('legacy-mode').onchange=()=>v7?.configChanged();
 updateContinue();return state;`);
fs.writeFileSync(p,s);console.log('V8 UI connected to shared online protocol.');
