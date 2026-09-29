// Test-only signaling adapter. Traffic uses actual ordered browser RTCDataChannels.
// It replaces the public PeerJS signaling server, not DuelRoom or game transport logic.
module.exports=async function rtcFixture(context,registry){
 await context.exposeBinding('__rtcSignal',async({page},m)=>{
  if(m.kind==='register'){registry.set(m.id,page);return;}
  const target=registry.get(m.to);if(!target||target.isClosed())return;
  await target.evaluate(m=>window.__rtcReceive(m),m);
 });
 await context.addInitScript(()=>{
  class Events{constructor(){this.listeners={};}on(k,f){(this.listeners[k]??=[]).push(f);return this;}emit(k,...a){for(const f of this.listeners[k]||[])f(...a);}}
  class Connection extends Events{
   constructor(owner,peer){super();this.owner=owner;this.peer=peer;this.open=false;this.pc=new RTCPeerConnection({iceServers:[]});this.pending=[];this.pc.onicecandidate=e=>{if(e.candidate)owner.signal({kind:'ice',to:peer,candidate:e.candidate.toJSON()});};this.pc.ondatachannel=e=>this.attach(e.channel);}
   attach(ch){this.channel=ch;ch.onopen=()=>{this.open=true;this.emit('open');};ch.onclose=()=>{this.open=false;this.emit('close');};ch.onmessage=e=>this.emit('data',JSON.parse(e.data));ch.onerror=e=>this.emit('error',e);}
   send(data){this.channel.send(JSON.stringify(data));}close(){this.channel?.close();this.pc.close();}
  }
  class LocalRTCPeer extends Events{
   constructor(id){super();this.id=id||'test-'+crypto.randomUUID();this.links=new Map();LocalRTCPeer.instances.set(this.id,this);window.__rtcSignal({kind:'register',id:this.id}).then(()=>this.emit('open',this.id));}
   signal(m){return window.__rtcSignal({...m,from:this.id});}
   connect(id){const c=new Connection(this,id);this.links.set(id,c);c.attach(c.pc.createDataChannel('duel',{ordered:true}));(async()=>{await c.pc.setLocalDescription(await c.pc.createOffer());await this.signal({kind:'offer',to:id,sdp:c.pc.localDescription.toJSON()});})().catch(e=>this.emit('error',e));return c;}
   async receive(m){let c=this.links.get(m.from);if(m.kind==='offer'){c=new Connection(this,m.from);this.links.set(m.from,c);this.emit('connection',c);await c.pc.setRemoteDescription(m.sdp);await c.pc.setLocalDescription(await c.pc.createAnswer());await this.signal({kind:'answer',to:m.from,sdp:c.pc.localDescription.toJSON()});}else if(m.kind==='answer')await c.pc.setRemoteDescription(m.sdp);else if(m.kind==='ice'){if(!c){(this.earlyIce??={})[m.from]??=[];this.earlyIce[m.from].push(m.candidate);return;}if(c.pc.remoteDescription)await c.pc.addIceCandidate(m.candidate);else c.pending.push(m.candidate);}
    if(c?.pc.remoteDescription)for(const ice of [...c.pending.splice(0),...(this.earlyIce?.[m.from]||[])])await c.pc.addIceCandidate(ice);if(this.earlyIce)delete this.earlyIce[m.from];
   }
   destroy(){for(const c of this.links.values())c.close();LocalRTCPeer.instances.delete(this.id);}
  }
  LocalRTCPeer.instances=new Map();window.LocalRTCPeer=LocalRTCPeer;window.__rtcReceive=m=>LocalRTCPeer.instances.get(m.to)?.receive(m);
 });
};
