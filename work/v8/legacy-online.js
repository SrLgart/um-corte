(function(root){
'use strict';
const Room=root.DuelRoom,L=root.DuelLegacy,old={};
for(const k of ['receive','tick','go','close','abort'])old[k]=Room.prototype[k];
const defer=fn=>typeof queueMicrotask==='function'?queueMicrotask(fn):Promise.resolve().then(fn);
Room.prototype.startLegacyDraft=function(game){
 if(!this.host||this.legacyGate||!this.s||this.config?.mode==='parkour'||!['match','round'].includes(this.config?.legacyMode))return false;
 game.legacyEnabled=true;game.fighters.forEach(L.ensure);
 const pattern=L.draftPattern(game.random),ctx={mode:'online',futureDraft:this.config.legacyMode==='round'};
 this.legacyGate=true;
 const state=this.legacyState={id:this.s.id+':'+game.round,game,pattern,drafts:game.fighters.map(f=>L.draft(f,ctx,game.random,pattern)),choices:[null,null],deadline:Date.now()+30000};
 // Send after the tick/begin packet which caused this draft, never before it.
 defer(()=>{if(this.legacyState!==state)return;for(let i=0;i<2;i++)this.publishLegacyOffer(i);});
 return true;
};
Room.prototype.publishLegacyOffer=function(side){
 const state=this.legacyState;if(!state)return;
 const packet={t:'legacyOffer',sid:this.s.id,id:state.id,side,draft:L.clone(state.drafts[side]),inventory:L.clone(state.game.fighters[side].legacy),deadline:state.deadline};
 delete packet.inventory.bindings;
 if(this.s.ids[side]===this.id)this.h.legacyOffer?.(packet);else this.sendTo(this.s.ids[side],packet);
};
Room.prototype.legacyChoose=function(legacy){this.legacyAction('pick',{legacy});};
Room.prototype.legacyAction=function(action,values={}){
 if(!this.s||!this.legacyOfferId&&!this.legacyState)return;
 this.send({t:'legacyChoice',sid:this.s.id,id:this.legacyState?.id||this.legacyOfferId,action,...values});
};
Room.prototype.completeLegacyDraft=function(){
 const state=this.legacyState;if(!this.host||!state)return;
 for(let i=0;i<2;i++){const d=state.drafts[i],id=state.choices[i]||d.cards[d.selected||0];if(id)L.add(state.game.fighters[i],id);state.choices[i]=id;}
 state.game.legacyWorld={entities:[],effects:[],serial:0,time:0};state.game.fighters.forEach(f=>L.spawnCompanions(state.game,f));
 L.captureRound(state.game);const snapshot=L.networkSnapshot(state.game.snapshot()),packet={t:'legacyDone',sid:this.s.id,id:state.id,snapshot,choices:state.choices};
 this.lastSnapshot=snapshot;this.legacyState=null;this.legacyGate=false;this.legacyOfferId=null;
 this.broadcast(packet);this.h.legacyDone?.(packet);if(!this.s.running)this.go();
};
Room.prototype.receive=function(id,m){
 if(m.t==='legacyChoice'){
  const state=this.legacyState,side=this.s?.ids.indexOf(id);
  if(!this.host||!state||m.sid!==this.s?.id||m.id!==state.id||side<0||state.choices[side])return;
  const f=state.game.fighters[side],d=state.drafts[side];
  if(m.action==='pick'){
   if(!d.cards.includes(m.legacy))return;state.choices[side]=m.legacy;
   if(state.choices.every(Boolean))this.completeLegacyDraft();return;
  }
  if(m.action==='highlight'){if(Number.isInteger(m.index)&&m.index>=0&&m.index<d.cards.length)d.selected=m.index;return;}
  if(m.action==='reroll'){const next=L.reroll(f,d,state.game.random);if(next)state.drafts[side]=next;}
  else if(m.action==='mark'){if(L.has(f,'markedcard')&&d.cards.includes(m.legacy))f.legacy.marked=m.legacy;}
  else if(m.action==='peek'){const next=L.peekDraft(f,d,state.game.random,state.pattern);if(next){state.previews??={};state.previews[side]=next;d.preview=L.clone(next.cards);}}
  else if(m.action==='replace'&&state.previews?.[side]){state.drafts[side]=L.acceptDraft(f,state.previews[side]);delete state.previews[side];}
  this.publishLegacyOffer(side);return;
 }
 if(m.t==='legacyEdit'){
  if(!this.host||!this.s||m.sid!==this.s.id)return;
  const member=this.members.find(p=>p.id===id),side=this.s.ids.indexOf(id),change=m.change;
  if(!member||!change||!Number.isInteger(change.side)||change.side<0||change.side>1||(!member.admin&&side!==change.side))return;
  if(L.validEdit(change,!!member.admin))this.ops.push({action:'legacy',side:change.side,op:change.op,...(change.value!==undefined?{value:change.value}:{}),administrator:!!member.admin});return;
 }
 const host=id===this.links.keys().next().value;
 if(m.t==='legacyOffer'&&!this.host&&host&&m.sid===this.s?.id){this.legacyGate=true;this.legacyOfferId=m.id;this.h.legacyOffer?.(m);return;}
 if(m.t==='legacyDone'&&!this.host&&host&&m.sid===this.s?.id){this.legacyGate=false;this.legacyOfferId=null;this.h.legacyDone?.(m);return;}
 return old.receive.call(this,id,m);
};
Room.prototype.go=function(){if(this.legacyGate)return;return old.go.call(this);};
Room.prototype.tick=function(dt){if(this.legacyGate){if(this.host&&this.legacyState&&Date.now()>=this.legacyState.deadline)this.completeLegacyDraft();return;}return old.tick.call(this,dt);};
for(const key of ['close','abort'])Room.prototype[key]=function(...args){this.legacyState=null;this.legacyGate=false;this.legacyOfferId=null;return old[key].apply(this,args);};
L.networkSnapshot=s=>{const copy=L.clone(s);for(const snap of [copy,copy.legacyRoundStart])for(const f of snap?.fighters||[])if(f.legacy){delete f.legacy.bindings;for(const t of f.legacy.transforms||[])delete t.binding;}return copy;};
L.restoreLocalBindings=(game,snapshot)=>{const s=L.clone(snapshot);for(const snap of [s,s.legacyRoundStart])for(let i=0;i<(snap?.fighters.length||0);i++){const f=snap.fighters[i],l=f.legacy;if(!l)continue;const local=game.fighters[i]?.legacy,bindings=local?.bindings||{};l.bindings={};for(const id of L.items(f)){if(!L.catalog[id]?.active)continue;const tr=l.transforms.find(t=>t.to===id),old=local?.transforms?.find(t=>t.from===id);const code=bindings[id]||bindings[tr?.from]||bindings[old?.to]||old?.binding;if(code&&!Object.values(l.bindings).includes(code))l.bindings[id]=code;else{const n=Array.from({length:9},(_,k)=>k+1).find(n=>!Object.values(l.bindings).includes('Digit'+n));if(n)l.bindings[id]='Digit'+n;}}for(const t of l.transforms){const binding=bindings[t.from]||local?.transforms?.find(k=>k.from===t.from)?.binding||l.bindings[t.to];if(binding)t.binding=binding;}}return s;};

const ownId=id=>typeof id==='string'&&Object.hasOwn(L.catalog,id),ranks=['common','rare','legendary'],cats=['weapon','clothing','relic','technique','summon','power'];
L.validEdit=(c,admin)=>{
 if(!c||typeof c!=='object')return false;
 if(['equip','gesture','target'].includes(c.op))return ownId(c.value);
 if(c.op==='diceTarget')return ['character','draft'].includes(c.value);
 if(!admin)return false;
 if(['refill','clear','philosopher'].includes(c.op))return c.value===undefined;
 if(['add','remove','ready','consume','restore','spawn','despawn'].includes(c.op))return ownId(c.value)&&(!['spawn','despawn'].includes(c.op)||L.catalog[c.value].category==='summon');
 if(c.op==='die')return Number.isInteger(c.value)&&c.value>=0&&c.value<=20;
 if(c.op==='seed')return Number.isInteger(c.value)&&c.value>=0&&c.value<=4294967295;
 if(c.op==='difficulty')return typeof c.value==='string'&&Object.hasOwn(root.DuelCore.DIFFICULTIES,c.value);
 if(c.op==='randomize')return !!c.value&&Number.isInteger(c.value.count)&&c.value.count>=1&&c.value.count<=Object.keys(L.catalog).length&&(!c.value.category||cats.includes(c.value.category))&&(!c.value.rarity||ranks.includes(c.value.rarity));
 return false;
};
// Remove companions without leaving a physical weapon attached to a deleted carrier.
L.despawn=(game,f,id)=>{const w=L.world(game),removed=new Set(w.entities.filter(e=>e.owner===f.id&&(!id||e.type===id||id==='necromancer'&&e.type==='servant')).map(e=>e.id));for(const e of w.entities)if(removed.has(e.carrier)){e.carrier=null;e.mode='dropped';e.vx=e.vy=0;}w.entities=w.entities.filter(e=>!removed.has(e.id));};
L.applyEdit=(game,c)=>{
 if(!Number.isInteger(c?.side)||!L.validEdit(c,c.administrator))return false;
 const f=game.fighters[c.side];if(!f)return false;const l=L.ensure(f),id=c.value;
 if(c.op==='equip')return L.equip(f,id,c.administrator?'between':game.phase);
 if(c.op==='gesture'){if(!L.has(f,id)||!['glider','rockets','icarus'].includes(id))return false;l.gesture=id;}
 if(c.op==='target'){if(!L.has(f,id))return false;l.target=id;}
 if(c.op==='diceTarget')l.diceTarget=id;
 if(c.op==='add'){game.legacyEnabled=true;if(!L.add(f,id))return false;L.spawnCompanions(game,f);}
 if(c.op==='remove'){const t=l.transforms.find(t=>t.from===id||t.to===id);L.despawn(game,f,id);if(t)L.despawn(game,f,t.to);L.remove(f,id);}
 if(['ready','consume','restore','spawn','despawn'].includes(c.op)){
  if(!l.items.includes(id)&&!l.transforms.some(t=>t.to===id))return false;
  if(c.op==='ready'){delete l.cd[id];if(L.weaponId(f)===id)delete l.cd.weapon;}
  if(c.op==='consume'){if(!l.consumed.includes(id))l.consumed.push(id);delete l.effects[id];L.despawn(game,f,id);}
  if(c.op==='restore'){if((l.transforms.find(t=>t.from===l.weapon)?.to||l.weapon)===id)delete l.cd.weapon;l.consumed=l.consumed.filter(k=>k!==id);delete l.cd[id];for(const u of Object.values(l.used))delete u[id];L.spawnCompanions(game,f,id);}
  if(c.op==='spawn'){if(!L.has(f,id))return false;L.despawn(game,f,id);L.spawnCompanions(game,f,id);}
  if(c.op==='despawn')L.despawn(game,f,id);
 }
 if(c.op==='die')l.forcedDie=id;
 if(c.op==='seed'){game.random=L.rng(id);if(game.legacyRoundStart)game.legacyRoundStart.legacyRngState=id;}
 if(c.op==='difficulty'){game.difficulty=id;for(const actor of game.fighters)delete actor.brain;}
 if(c.op==='philosopher'){if(!L.transform(game,f,'philosopher'))return false;game.legacyEnabled=true;}
 if(c.op==='randomize'){
  const pool=Object.keys(L.catalog).filter(k=>!l.items.includes(k)&&!L.has(f,k)&&(!id.category||L.catalog[k].category===id.category)&&(!id.rarity||L.catalog[k].rarity===id.rarity));
  if(!pool.length)return false;for(let n=0;n<id.count&&pool.length;n++)L.add(f,pool.splice(Math.floor(game.random()*pool.length),1)[0]);game.legacyEnabled=true;L.spawnCompanions(game,f);
 }
 if(c.op==='refill'){l.cd={};l.used={duel:{},match:{},run:{}};l.consumed=[];L.refill(game,f);L.spawnCompanions(game,f);}
 if(c.op==='clear'){L.reset(f,null);L.despawn(game,f);}
 return true;
};
// Preview uses a copy: no reroll resources, RNG or run progress are consumed.
L.previewDraft=(f,{seed=1,rarity='',reward='normal',level=1,mode='path'}={})=>L.draft({legacy:L.clone(L.ensure(f))},{mode,level,reward,futureDraft:true},L.rng(seed),ranks.includes(rarity)?[rarity,rarity,rarity,rarity]:undefined);
})(globalThis);
