(function(root){
'use strict';
// Reuse the existing PeerJS room connection, handshake, capacity and validation.
// Only snapshots travel to guests; no participant/ADMIN commands are accepted.
class DuelPathWatch extends root.DuelRoom{
 // A viewer never simulates rewind or resumes the host's run. Send the visible
 // game once, without the checkpoint/round anchor copies required by real saves.
 static frame(game,run,view={}){const snapshot=game.snapshot();delete snapshot.legacyRoundStart;return{...view,game:snapshot,run:run?.serialize({spectator:true})};}
 constructor(hooks){super({status:hooks.status,state:s=>hooks.status?.('ESPECTADORES · '+this.code+' · '+Math.max(0,s.members.length-1)+' / 7'),closed:reason=>{hooks.status?.(reason);hooks.closed?.(reason);}});this.viewHooks=hooks;this.streamAccum=0;}
 async open(create,code){await super.open(create,code,{name:create?'ERRANTE':'ESPECTADOR',kind:'boxer',color:create?'jade':'coral',admin:false});if(create){this.config={mode:'path',version:8};this.playing=true;this.publish();}else{this.lastViewAt=performance.now();this.watchdog=setInterval(()=>{if(!this.closed&&performance.now()-this.lastViewAt>8000)this.close('A transmissão do Caminho foi interrompida. A run continua com o anfitrião.');},1000);}return this;}
 receive(id,m){if(this.host){if(!['join','ping','pong'].includes(m.t))return;super.receive(id,m);if(m.t==='join'){const member=this.members.find(p=>p.id===id);if(member)member.seat=-1;this.publish();}}else if(m.t==='pathView'&&id===this.links.keys().next().value){this.lastViewAt=performance.now();this.viewHooks.receive?.(m.state);}else super.receive(id,m);}
 publish(){if(!this.host)return;super.publish();if(this.viewHooks?.get&&this.members.length>1){const state=this.viewHooks.get();if(state.run)this.broadcast({t:'pathView',state});}}
 tick(dt){if(!this.host||this.closed)return;this.streamAccum+=dt;if(this.streamAccum>=.08){this.streamAccum=0;if(this.members.length>1){const state=this.viewHooks.get();if(state.run)this.broadcast({t:'pathView',state});}}}
 close(reason){clearInterval(this.watchdog);return super.close(reason);}
}
root.DuelPathWatch=DuelPathWatch;
})(globalThis);
