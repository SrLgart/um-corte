const fs=require('fs'),path=require('path');function edit(n,f){const p=path.join(__dirname,n);fs.writeFileSync(p,f(fs.readFileSync(p,'utf8')));}
edit('lab.js',s=>s.replace("if(e.state!=='parry'){g.setState(e,'idle');e.parryCooldown=0;inp.parry=true;}","g.setState(e,'idle');e.parryCooldown=0;inp.parry=true;")
 .replace("this.history.push({before,commands:copy(commands),after:g.snapshot()})", "this.history.push({before,commands:copy(commands),after:g.snapshot(),constantGuard:g.mode==='training'&&this.config.action==='constant'})")
 .replace("g=this.viewGame;for(let sub=0;sub<10;sub++){", "g=this.viewGame;const dummy=g.fighters[1],constant=frame?.constantGuard&&this.clip.seat===0&&!dummy.dead&&!['stunned','pushed','clash'].includes(dummy.state);if(constant){g.setState(dummy,'idle');dummy.parryCooldown=0;}for(let sub=0;sub<10;sub++){")
 .replace("commands[this.clip.seat]={...this.control};", "commands[this.clip.seat]={...this.control};if(constant&&sub===0)commands[1].parry=true;"));
edit('app.js',s=>s.replace("k('dash')+' dash.'", "k('dash')+' dash · '+k('kick')+' chute · baixo + dash desliza.'")
 .replace("simulate([neutral(),lab.dummy(game)]);$('training-pause')", "simulate([readInput(0),lab.dummy(game)]);$('training-pause')")
 .replace("input.poll(dt);if(!paused", "input.poll(dt);if(!inMenu&&!lab.viewGame&&selected.mode==='training'&&lab.trainingPaused&&input.read(selected.source,game.fighters[0],renderer,false).reset)resetTraining();if(!paused")
 .replace("menu-button').textContent=selected.mode==='online'?'CONTROLES':'PAUSAR';", "menu-button').textContent=selected.mode==='online'?'CONTROLES':'PAUSAR';"));
// A rendered frame is sufficient for a physical input to enter the fixed-step engine.
edit('browser-v33.cjs',s=>s.replace("await page.keyboard.press('KeyE');await wait(35)","await page.keyboard.press('KeyE');await wait(40)"));
