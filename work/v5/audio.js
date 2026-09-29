(function(){
class DuelAudio{
 constructor(){this.muted=false;this.duckUntil=0;}
 unlock(){try{if(!this.ctx){const c=this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.master=c.createGain();const compressor=c.createDynamicsCompressor();compressor.threshold.value=-15;compressor.ratio.value=5;this.master.connect(compressor);compressor.connect(c.destination);this.ambience=c.createGain();this.ambience.gain.value=0;this.ambience.connect(this.master);for(const hz of[55,82.41]){const o=c.createOscillator();o.type='sine';o.frequency.value=hz;o.connect(this.ambience);o.start();}}if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});}catch{}}
 setMuted(value){this.muted=value;if(this.master)this.master.gain.setTargetAtTime(value?0:.75,this.ctx.currentTime,.02);}
 ambient(active){if(!this.ctx)return;this.ambience.gain.setTargetAtTime(active&&this.ctx.currentTime>this.duckUntil?.008:0,this.ctx.currentTime,.06);}
 tone(hz,duration,volume,type='sine',end){if(!this.ctx||this.muted)return;const c=this.ctx,t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(hz,t);if(end)o.frequency.exponentialRampToValueAtTime(end,t+duration);g.gain.setValueAtTime(Math.max(.0001,volume),t);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(this.master);o.start();o.stop(t+duration);o.onended=()=>{o.disconnect();g.disconnect();};}
 noise(duration,volume,hz){if(!this.ctx||this.muted)return;const c=this.ctx,n=Math.ceil(c.sampleRate*duration),b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n)**2;const s=c.createBufferSource(),g=c.createGain(),f=c.createBiquadFilter();s.buffer=b;f.type='bandpass';f.frequency.value=hz;f.Q.value=.8;g.gain.value=volume;s.connect(f);f.connect(g);g.connect(this.master);s.start();s.onended=()=>{s.disconnect();g.disconnect();f.disconnect();};}
 play(type,ev={}){if(!this.ctx||this.muted)return;const tone=(...a)=>this.tone(...a),noise=(...a)=>this.noise(...a),pitch={knight:1100,lancer:1800,assassin:2900,swordsman:700,reaper:1400,boxer:420}[ev.kind]||1300;
 if(type==='kill'){this.duckUntil=this.ctx.currentTime+.48;this.ambience.gain.cancelScheduledValues(this.ctx.currentTime);this.ambience.gain.setValueAtTime(0,this.ctx.currentTime);tone(82,.19,.38,'sine',29);noise(.11,.58,pitch);tone(180,.065,.11,'triangle',48);}
 else if(type==='parry'||type==='clash'){for(const[h,v]of[[840,.14],[1271,.085],[2463,.045]])tone(h,type==='parry'?.25:.17,v);noise(.045,.22,4500);}
 else if(type==='nearMiss'){noise(.055,.17,3700);tone(690,.055,.018,'sine',260);}
 else if(type==='special'){const h={knight:196,lancer:147,assassin:740,swordsman:294,reaper:110,boxer:370}[ev.kind]||220;tone(h,.3,.11,'triangle',h*1.5);tone(h*2,.2,.06);noise(.09,.08,pitch);}
 else if(type==='matchPoint'){tone(392,.35,.07);tone(587,.45,.035);}
 else if(type==='swing')noise(.11,.13,pitch);
 else if(['dash','slide','wallJump','daggerThrow','chargeStart'].includes(type))noise(type==='chargeStart'?.2:.10,.09,type==='daggerThrow'?2700:650);
 else if(['kick','shieldBreak','chargeStop'].includes(type)){tone(125,.13,.14,'triangle',45);noise(.08,.15,800);}
 else if(type==='feint')noise(.04,.05,900);
 else if(type==='roundGo'||type==='round'){tone(480,.1,.035);tone(720,.15,.02);}
 }
}
window.DuelAudio=DuelAudio;
})();
