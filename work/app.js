(function(){
  'use strict';
  const $=id=>document.getElementById(id),canvas=$('game'),game=new DuelCore.Game(),renderer=new DuelRenderer(canvas);
  const effects={particles:[],cuts:[],shake:0,flash:0,hitstop:0,eventText:'',eventLife:0};
  const keys=new Set(),pending={attack:false,parry:false,dash:false};let paused=false,helpFromTitle=false,muted=false,context=null,accumulator=0,last=0,clock=0;
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function unlockAudio(){try{if(!context)context=new (window.AudioContext||window.webkitAudioContext)();if(context.state==='suspended')context.resume().catch(()=>{});}catch{}}
  function tone(freq,time,volume,type='sine',endFreq=0){if(!context||muted)return;const t=context.currentTime,o=context.createOscillator(),g=context.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);if(endFreq)o.frequency.exponentialRampToValueAtTime(endFreq,t+time);g.gain.setValueAtTime(volume,t);g.gain.exponentialRampToValueAtTime(.0001,t+time);o.connect(g);g.connect(context.destination);o.start(t);o.stop(t+time);}
  function noise(time,volume,frequency){if(!context||muted)return;const n=context.sampleRate*time,b=context.createBuffer(1,n,context.sampleRate),data=b.getChannelData(0);for(let i=0;i<n;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);const src=context.createBufferSource(),g=context.createGain(),f=context.createBiquadFilter();src.buffer=b;f.type='bandpass';f.frequency.value=frequency;f.Q.value=.65;g.gain.value=volume;src.connect(f);f.connect(g);g.connect(context.destination);src.start();}
  function sound(type){if(type==='swing')noise(.16,.18,1800);else if(type==='dash')noise(.12,.12,550);else if(type==='parry'||type==='clash'){for(const [f,v]of [[790,.12],[1183,.08],[2111,.055],[3457,.027]])tone(f,type==='parry'?.42:.26,v,'sine');noise(.06,.15,4500);}else if(type==='kill'){tone(92,.23,.32,'sine',35);tone(176,.12,.08,'triangle',50);noise(.22,.43,1300);}else if(type==='start'||type==='round'){tone(480,.15,.045);tone(722,.3,.028);}}
  function burst(x,y,count,color,power=1){for(let i=0;i<count;i++){const angle=Math.random()*Math.PI*2,speed=(70+Math.random()*310)*power,life=.18+Math.random()*.38;effects.particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-30,life,maxLife:life,color,size:1+Math.random()*2});}}
  function clearInputs(){keys.clear();pending.attack=pending.parry=pending.dash=false;}
  function start(){unlockAudio();paused=false;helpFromTitle=false;clearInputs();accumulator=0;game.start();effects.particles=[];effects.cuts=[];effects.eventLife=0;$('intro').hidden=true;$('match').hidden=true;$('pause').hidden=true;$('round-feedback').classList.remove('visible');canvas.focus({preventScroll:true});$('accessible-status').textContent='Duelo iniciado. Primeiro a cinco. Você controla o espadachim azul.';}
  function togglePause(force){if(game.phase==='matchEnd')return;paused=force===undefined?!paused:force;clearInputs();accumulator=0;helpFromTitle=game.phase==='title';$('pause').hidden=!paused;$('intro').hidden=paused||!helpFromTitle;$('resume').textContent=helpFromTitle?'VOLTAR':'RETOMAR';if(paused)$('resume').focus({preventScroll:true});else canvas.focus({preventScroll:true});}
  function events(){
    while(game.events.length){const ev=game.events.shift();sound(ev.type);
      if(ev.type==='kill'){
        effects.shake=reducedMotion?0:7;effects.flash=reducedMotion?.05:.16;effects.cuts.push({x:ev.x,y:ev.y,life:.35,maxLife:.35,angle:-.5});burst(ev.x,ev.y,22,'#eadeba',.75);burst(ev.x,ev.y,10,'#4b5147',.5);
        $('round-eyebrow').textContent=ev.trade?'EMPATE':ev.winner===0?'SEU PONTO':'PONTO DO RIVAL';$('round-title').textContent=ev.trade?'O mesmo instante.':ev.winner===0?'Um corte.':'Uma abertura.';$('round-reason').textContent=ev.reason;$('round-feedback').classList.add('visible');$('accessible-status').textContent=ev.reason+' Placar '+game.score[0]+' a '+game.score[1]+'.';
      } else if(ev.type==='parry'||ev.type==='clash'){
        effects.shake=reducedMotion?0:ev.type==='parry'?4:3;effects.flash=reducedMotion?0:.035;burst(ev.x,ev.y,ev.type==='parry'?28:21,'#fff2b6');effects.eventText=ev.type==='parry'?(ev.id===0?'PARRY · CONTRA-ATAQUE':'PARRY DO RIVAL'):'CLASH';effects.eventLife=.50;
      }else if(ev.type==='dash'){const f=game.fighters[ev.id];burst(f.x,555,6,'#b7a27d',.25);}
      else if(ev.type==='round'){clearInputs();$('round-feedback').classList.remove('visible');effects.eventLife=0;}
      else if(ev.type==='matchEnd'){$('round-feedback').classList.remove('visible');$('match').hidden=false;$('match-title').textContent=ev.winner===0?'A vitória é sua.':'O rival levou o duelo.';$('match-score').textContent=game.score[0]+' — '+game.score[1];$('restart').focus({preventScroll:true});clearInputs();}
    }
  }
  function updateEffects(dt){effects.shake=Math.max(0,effects.shake-dt*32);effects.flash=Math.max(0,effects.flash-dt);effects.eventLife=Math.max(0,effects.eventLife-dt);for(const p of effects.particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;p.vx*=Math.pow(.96,dt*60);}effects.particles=effects.particles.filter(p=>p.life>0);for(const c of effects.cuts)c.life-=dt;effects.cuts=effects.cuts.filter(c=>c.life>0);effects.hitstop=game.hitstop;}
  function frame(ms){
    const dt=Math.min((ms-(last||ms))/1000,.06);last=ms;
    if(!paused&&game.hitstop<=0)clock+=dt;
    if(!paused){
      accumulator=Math.min(accumulator+dt,.08);
      // 600 Hz keeps the fastest point of the blade within ~4 px per collision step.
      const step=1/600;
      while(accumulator>=step){
        const move=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0);
        const frozen=game.hitstop>0;
        game.step(step,{move,...pending});
        if(!frozen)pending.attack=pending.parry=pending.dash=false;
        accumulator-=step;events();
      }
      updateEffects(dt);
    }
    renderer.render(game,effects,clock);
    const p=game.fighters[0];$('player-score').textContent=game.score[0];$('enemy-score').textContent=game.score[1];$('dash-fill').style.transform='scaleX('+(1-p.dashCooldown/DuelCore.C.dashCooldown)+')';$('parry-fill').style.transform='scaleX('+(1-p.parryCooldown/DuelCore.C.parryCooldown)+')';$('combat-event').textContent=effects.eventText;$('combat-event').classList.toggle('visible',effects.eventLife>0&&game.phase==='playing');
    requestAnimationFrame(frame);
  }
  const recognized=new Set(['KeyA','KeyD','ArrowLeft','ArrowRight','KeyJ','KeyK','ShiftLeft','ShiftRight','Escape','Enter','KeyM']);
  window.addEventListener('keydown',ev=>{
    if(!recognized.has(ev.code)||ev.ctrlKey||ev.altKey||ev.metaKey)return;
    // Preserve normal keyboard activation for focused interface buttons.
    if(ev.code==='Enter'&&ev.target instanceof HTMLButtonElement)return;
    ev.preventDefault();unlockAudio();if(ev.repeat)return;
    if(ev.code==='KeyM'){$('sound').click();return;}
    if(ev.code==='Escape'){togglePause();return;}
    if(ev.code==='Enter'){if(paused)togglePause(false);else if(game.phase==='title'||game.phase==='matchEnd')start();return;}
    if(paused||game.phase!=='playing')return;
    keys.add(ev.code);if(ev.code==='KeyJ')pending.attack=true;if(ev.code==='KeyK')pending.parry=true;if(ev.code.startsWith('Shift'))pending.dash=true;
  });
  window.addEventListener('keyup',ev=>keys.delete(ev.code));
  canvas.addEventListener('contextmenu',ev=>ev.preventDefault());
  canvas.addEventListener('pointerdown',ev=>{ev.preventDefault();unlockAudio();canvas.focus({preventScroll:true});if(paused||game.phase!=='playing')return;if(ev.button===0)pending.attack=true;if(ev.button===2)pending.parry=true;});
  window.addEventListener('blur',()=>{clearInputs();if((game.phase==='playing'||game.phase==='roundEnd')&&!paused)togglePause(true);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInputs();if((game.phase==='playing'||game.phase==='roundEnd')&&!paused)togglePause(true);}});
  $('start').addEventListener('click',start);$('restart').addEventListener('click',start);$('resume').addEventListener('click',()=>togglePause(false));$('help').addEventListener('click',()=>togglePause());
  $('sound').addEventListener('click',()=>{muted=!muted;unlockAudio();$('sound-state').textContent=muted?'OFF':'ON';$('sound').setAttribute('aria-pressed',String(!muted));$('sound').setAttribute('aria-label',muted?'Ativar som':'Desativar som');canvas.focus({preventScroll:true});});
  // Read-only snapshot for local validation; no training or debug UI in the game.
  window.duelSnapshot=()=>({phase:game.phase,score:[...game.score],round:game.round,paused,fighters:game.fighters.map(f=>({x:f.x,state:f.state,dead:f.dead,dashCooldown:f.dashCooldown,parryCooldown:f.parryCooldown})),reason:game.lastReason});
  requestAnimationFrame(frame);
})();
