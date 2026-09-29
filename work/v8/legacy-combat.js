(function(root){
'use strict';
const D=root.DuelCore,L=root.DuelLegacy;if(!D||!L)throw Error('Load engine and legacies first');
const {clamp,body,slash,polygonSegment,polygonsIntersect,segmentDistance,wallFraction}=D,{has,ensure,items,clone}=L,TAU=Math.PI*2;
const center=f=>({x:f.x,y:f.y-body(f).center}),enemies=(g,f)=>g.fighters.filter(t=>t!==f&&!t.dead&&(g.pathEncounter?!!t.id!==!!f.id:true));
const hostile=(g,owner,target)=>owner!==target.id&&(g.pathEncounter?!!owner!==!!target.id:true);
function weaponId(f){const l=f?.legacy;if(!l?.weapon)return null;const id=l.transforms.find(t=>t.from===l.weapon)?.to||l.weapon;return has(f,id)?id:null;}
L.specialKind=f=>f?.legacy?.mirrorSpecial?.kind||f?.kind;
L.mirrorWeapon=f=>f?.legacy?.mirrorSpecial&&(f.ultMode||['recovery','ultRecovery'].includes(f.state))&&f.legacy.mirrorSpecial.kind!=='knight'?f.legacy.mirrorSpecial.kind:null;
function originalSpecial(f){return !!L.mirrorWeapon(f)||['ultWindup','ultCharge','throwWindup'].includes(f.state)||['sweepStrike','fenceStrike','reaperBoost','reaperWeak'].includes(f.ultMode);}
L.attackTechnique=f=>f.legacy?.technique&&f.legacy.technique.attack===f.attackId&&['startup','active','recovery'].includes(f.state)?f.legacy.technique:null;
L.crossing=f=>!f.dead&&(L.attackTechnique(f)?.type==='iaijutsu'&&f.state==='active'||has(f,'shadowcloak')&&f.legacy?.effects.shadow>0&&f.dashRemaining>0);
L.techniqueVelocity=(g,f,dt)=>{const t=L.attackTechnique(f);if(!t||!['startup','active'].includes(f.state))return false;const active=f.state==='active',speed=active?t.distance/Math.max(.001,f.duration):t.type==='lunge'?180:0;f.vx=Math.cos(t.angle)*speed;f.vy=Math.sin(t.angle)*speed;if(f.vy<0)f.grounded=false;return true;};
function physicalWeapon(f){return !!f&&!f.dead&&!f.legacy?.effects.weaponAway&&f.ultMode!=='unarmed'&&!originalSpecial(f)&&(!!weaponId(f)?L.WEAPONS[weaponId(f)]?.kind!=='boxer':!f.wanderer&&!['boxer','runner'].includes(f.kind));}
function meleeTechnique(f){return !!f&&!f.dead&&!f.legacy?.effects.weaponAway&&f.ultMode!=='unarmed'&&!originalSpecial(f)&&!L.WEAPONS[weaponId(f)]?.shot&&f.kind!=='runner';}
L.canDisarm=physicalWeapon;
L.movementRules=(g,f)=>has(f,'stonemask')?{...g.rules,jump:g.rules.jump*1.12}:g.rules;
function mikiri(g,f){const l=f.legacy;if(!has(f,'mikiri')||l.mikiriDone||g.time-(l.lastDash??-100)>.10||f.dashRemaining<=0||!['dash','slide'].includes(f.state))return false;const p=center(f),t=enemies(g,f).find(a=>{if(a.attackHit||a.state!=='active'||!meleeTechnique(a)&&a.ultMode!=='fenceStrike'||a.breakAttackId&&a.breakAttackId===a.attackId)return false;const kind=L.weaponKind(a)||a.kind,linear=['lancer','duelist'].includes(kind)||L.attackTechnique(a)?.type==='lunge';if(!linear)return false;const q=center(a),dx=q.x-p.x,dy=q.y-p.y,n=Math.hypot(dx,dy)||1;return (dx*f.dashX+dy*f.dashY)/n>.65&&g.bodyContact(a,f);});if(!t)return false;l.mikiriDone=true;t.attackHit=true;t.dashRemaining=t.slideRemaining=0;g.setState(t,'stunned',.45);g.boxerParry(f);g.hitstop=.045;effect(g,f,'mikiri',p.x,p.y,{life:.22,angle:Math.atan2(t.y-f.y,t.x-f.x)});g.emit('parry',{id:f.id,attacker:t.id,perfect:true,technique:'mikiri',x:p.x,y:p.y});return true;}
L.resolveTechniques=g=>{for(const f of g.fighters)if(!f.dead)mikiri(g,f);};
L.weaponKind=f=>typeof f==='object'?(L.mirrorWeapon(f)||(originalSpecial(f)?null:f.legacy?.effects?.weaponAway?'boxer':L.WEAPONS[weaponId(f)]?.kind)):null;
L.weaponStats=(f,source)=>{if(typeof f!=='object')return null;const l=f.legacy,w=originalSpecial(f)?null:L.WEAPONS[weaponId(f)];if(f.summonType==='legion')return{...source,speed:225,reach:100,length:90,startup:.34,active:.13,recovery:.5};let out=f.wanderer?{...D.CLASSES.boxer,speed:325,reach:42,length:24,minRange:10,startup:.17,active:.08,recovery:.3}:source;
 if(L.mirrorWeapon(f))out={...D.CLASSES[L.mirrorWeapon(f)],speed:out.speed,dashSpeed:out.dashSpeed};
 if(w)out={...D.CLASSES[w.kind],...w,speed:out.speed,dashSpeed:out.dashSpeed,reach:w.reach??D.CLASSES[w.kind].reach,minRange:w.minRange??D.CLASSES[w.kind].minRange};
 if(l?.effects.weaponAway)out={...out,reach:40,length:20,minRange:10,startup:.2,active:.08,recovery:.34};
 if(!l)return out===source?null:out;out={...out};const technique=L.attackTechnique(f);if(technique){out.startup*=technique.type==='lunge'?.65:.6;out.active=technique.type==='lunge'?.14:.13;out.recovery*=technique.type==='lunge'?1.35:1.4;if(technique.type==='lunge'){out.sweep=0;out.reach*=1.08;}}if(l.channel)out.speed*=.3;if(has(f,'sandals'))out.speed*=1.2;if(has(f,'stonemask'))out.speed*=1.08;if(l.effects.slow>0)out.speed*=.65;if(l.effects.slimeSlow>0)out.speed*=.7;if(l.effects.d20>0){const b=l.effects.d20Bonus||1;out.speed*=b;out.startup/=b;out.recovery/=b;}if(l.effects.counter>0||l.effects.nodraw>0)out.startup*=.5;if(l.effects.wolf>0||l.wolfAttackId&&l.wolfAttackId===f.attackId)out.reach*=1.2;if(l.nodrawAttack===f.attackId&&!f.attackHit)out.recovery*=1.7;return out;};
function world(g){return g.legacyWorld??={entities:[],effects:[],serial:0,time:0};}
function effect(g,f,type,x=f.x,y=f.y-body(f).center,opts={}){const w=world(g),e={id:++w.serial,owner:f.id,type,x,y,age:0,life:opts.life??.5,...opts};w.effects.push(e);return e;}
function entity(g,f,type,opts={}){const w=world(g),p=center(f),e={id:++w.serial,owner:f.id,type,x:p.x,y:p.y,vx:0,vy:0,age:0,life:5,warn:0,r:8,lethal:true,parryable:true,hits:[],...opts};w.entities.push(e);return e;}
function projectile(g,f,type,angle=f.aim,opts={}){const speed=opts.speed??800;return entity(g,f,type,{vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,angle,life:2.5,...opts});}
L.spectralPoint=(path,t)=>{const x=path.range*t,y=path.lane*90*4*t*(1-t),a=path.angle;return{x:path.x+Math.cos(a)*x-Math.sin(a)*y,y:path.y+Math.sin(a)*x+Math.cos(a)*y};};
function blackfire(g,f,hit,opts={}){const support=hit.surface==='platform'?g.map.platforms[hit.index]:hit.surface==='wall'?g.map.walls[hit.index]:null;return entity(g,f,'blackfire',{...hit,zone:true,r:55,life:3.8,warn:.6,parryable:false,...(support?{offsetX:hit.x-support.x,offsetY:hit.y-support.y}:{}),...opts});}
L.cancelChannel=(g,f)=>{const l=f.legacy;if(!l?.channel)return;l.channel=null;l.cd.kamehameha=Math.max(l.cd.kamehameha||0,.8);world(g).effects=world(g).effects.filter(e=>e.owner!==f.id||e.type!=='charge');};
function channelEnd(g,f){const l=ensure(f),h=l.channel;if(!h)return;const from=center(f),end=raySurface(g,from,h.aim,1100)||{x:from.x+Math.cos(h.aim)*1100,y:from.y+Math.sin(h.aim)*1100},strong=h.age>=2,r=strong?22+Math.min(1.2,h.age-2)*5:12;l.channel=null;entity(g,f,'beam',{...from,to:end,zone:true,r,life:strong?.25+Math.min(1.2,h.age-2)*.07:.25,parryable:!strong,angle:h.aim,weapon:'kamehameha'});L.spend(f,'kamehameha');world(g).effects=world(g).effects.filter(e=>e.owner!==f.id||e.type!=='charge');g.setState(f,'recovery',.22/g.rules.attackSpeed);g.emit('legacyBeam',{id:f.id,strong,x:from.x,y:from.y});}
function tickBlackfire(g,e,f){const support=e.surface==='platform'?g.map.platforms[e.index]:e.surface==='wall'?g.map.walls[e.index]:null;if(e.surface){if(!support||support.stage==='gone'){e.life=0;return;}e.x=support.x+e.offsetX;e.y=support.y+e.offsetY;}if(!support||e.spread||e.age<e.warn+.35)return;e.spread=true;for(const dir of [-1,1]){let hit;if(e.surface==='platform'){const x=e.x+dir*65;const index=g.map.platforms.findIndex(p=>p.stage!=='gone'&&Math.abs(p.y-e.y)<5&&x>=p.x&&x<=p.x+p.w&&p.x<=support.x+support.w+4&&p.x+p.w>=support.x-4);if(index>=0)hit={surface:'platform',index,x,y:g.map.platforms[index].y};}else{const vertical=e.offsetX<1||e.offsetX>support.w-1,x=vertical?e.x:e.x+dir*65,y=vertical?e.y+dir*65:e.y;if(x>=support.x&&x<=support.x+support.w&&y>=support.y&&y<=support.y+support.h)hit={surface:'wall',index:e.index,x,y};}if(hit)blackfire(g,f,hit,{r:28,warn:.28,life:Math.max(.3,e.life-e.age),spread:true});}}
function refill(g,f){f.dashCharges=g.rules.dashCount;f.dashCooldown=0;f.airDashes=0;f.airJumps=1+(has(f,'wingboot')?1:0);ensure(f).fuel=1;}
L.knockbackScale=f=>has(f,'irontalisman')?.55:1;
function push(g,f,dx,dy,power=430){const n=Math.hypot(dx,dy)||1,m=L.knockbackScale(f);g.setState(f,'pushed',.10);f.vx=dx/n*power*m;f.vy=dy/n*power*m-60;f.grounded=false;}
function free(g,x,y,f=g.fighters[0]){const b=D.body(f);if(g.map.pathEnclosed){const walls=g.map.walls.filter(w=>w.pathBoundary).sort((a,b)=>a.x-b.x);if(walls.length===2&&(x-b.radius<walls[0].x+walls[0].w||x+b.radius>walls[1].x))return false;}return Number.isFinite(x)&&Number.isFinite(y)&&x>b.radius&&x<g.map.width-b.radius&&y>b.top&&y<g.map.deathY-50&&!g.map.walls.some(w=>x+b.radius>w.x&&x-b.radius<w.x+w.w&&y-b.bottom>w.y&&y-b.top<w.y+w.h);}
function destination(g,f,angle,distance,through=false){const from=center(f),to={x:from.x+Math.cos(angle)*distance,y:from.y+Math.sin(angle)*distance};const t=through?1:Math.min(1,...g.map.walls.map(w=>wallFraction(from,to,w)));for(let k=Math.floor(distance*t);k>=0;k-=6){const x=f.x+Math.cos(angle)*k,y=f.y+Math.sin(angle)*k;if(free(g,x,y,f))return{x,y};}return{x:f.x,y:f.y};}
function blinkDestination(g,f,a){const b=body(f);for(let n=230;n>0;n-=6){const x=f.x+Math.cos(a)*n,y=f.y+Math.sin(a)*n;if(!free(g,x,y,f))continue;
 if(g.map.walls.some(w=>x+b.radius>w.x&&x-b.radius<w.x+w.w&&y-b.bottom+b.radius>w.y&&y-b.top-b.radius<w.y+w.h))continue;
 if(g.map.platforms.some(p=>p.stage!=='gone'&&x+b.radius>p.x&&x-b.radius<p.x+p.w&&p.y>y-b.top-b.radius+1&&p.y<y-2))continue;
 return{x,y};}return{x:f.x,y:f.y};}
const looseForceObject=e=>!e.zone&&e.kind!=='companion'&&!e.carrier&&e.age<e.life;
function pullFighter(g,f,dx,dy){const oldX=f.x,oldY=f.y,inverted=!!f.legacy?.effects.inverted,offset=inverted?body(f).center*2:0;
 f.x=clamp(f.x+dx,body(f).radius,g.map.width-body(f).radius);f.y+=dy;f.grounded=false;f.platform=-1;
 // Fields may move a body, but cannot move its feet through a supporting surface.
 if(dy*(inverted?-1:1)>0)for(let i=0;i<g.map.platforms.length;i++){const p=g.map.platforms[i];if(p.stage==='gone'||f.dropTimer>0&&!p.solid||f.x<p.x||f.x>p.x+p.w)continue;
  if((oldY-offset-p.y)*(inverted?-1:1)<=.5&&(f.y-offset-p.y)*(inverted?-1:1)>=0){f.y=p.y+offset;f.vy=0;f.grounded=true;f.platform=i;break;}}
 g.collideWalls(f,oldX,oldY);
}
function touch(g,e,f,old={x:e.x,y:e.y}){const b=body(f);return segmentDistance(old,e,{x:f.x,y:f.y-b.top},{x:f.x,y:f.y-b.bottom})<b.radius+(e.r||6);}
// Recoverable weapons remain physical objects when intercepted, never deleted ammo.
function stopProjectile(g,e){if(e.type==='weapon'){e.mode='dropped';e.vx=e.vy=0;e.path=null;e.life=Math.max(e.life,e.age+10);}else e.life=0;}
function abilityHit(g,e,f,old,contact=false){if(e.life<=e.age||f.dead||!hostile(g,e.owner,f)&&!e.friendly||e.hits.includes(f.id))return false;const a=g.fighters[e.owner];if(!a)return false;
 if(has(f,'projectilecut')&&f.state==='active'&&!e.zone&&e.kind!=='companion'&&polygonSegment(slash(f,g.map.walls).points,old||e,e,e.r)){stopProjectile(g,e);g.emit('clash',{kind:f.kind,x:e.x,y:e.y});return true;}
 if(!contact&&!touch(g,e,f,old))return false;
 if(e.parryable&&f.state==='parry'&&(Math.sign((old?.x??e.x)-f.x)||-Math.sign(e.vx))===f.guardFacing){const perfect=f.stateTime<=Math.min(.08,f.duration);e.blocked=true;g.setState(f,'idle');f.parryCooldown=Math.min(f.parryCooldown,.18);g.boxerParry(f);g.emit('parry',{id:f.id,attacker:e.owner,perfect,projectile:true,x:e.x,y:e.y});g.hitstop=.045;if(e.kind==='companion'){e.hits.push(f.id);e.attack=0;e.phase='return';e.stunned=.3;e.due=Math.max(e.due,2);}else if(e.zone){e.hits.push(f.id);e.life=0;}else{e.path=null;e.owner=f.id;e.vx=-e.vx;e.vy=-e.vy;e.angle=Math.atan2(e.vy,e.vx);e.x=f.x+f.guardFacing*(body(f).radius+e.r+3);e.hits=[];e.reflected=true;}return true;}
 if(!e.lethal){if(e.type==='slime'){e.attachedTo=f.id;e.attachLeft=.9;e.attachSide=Math.sign(e.x-f.x)||-f.facing;e.attack=0;e.phase='attached';e.due=3;e.hits.push(f.id);ensure(f).effects.slimeSlow=.08;effect(g,a,'slimeAttach',e.x,e.y,{life:.2});return true;}if(e.freeze){g.setState(f,'pushed',e.freeze);f.vx=0;ensure(f).effects.frost=e.freeze;}else if(e.type==='toad')push(g,f,e.x-f.x,e.y-center(f).y,370);else push(g,f,e.type==='repulse'?e.vx:(e.vx||f.x-e.x),e.type==='repulse'?e.vy:(e.vy||-70),e.force||300);if(e.slow)ensure(f).effects.slow=e.slow;e.hits.push(f.id);if(e.kind==='companion'){e.attack=0;e.phase='return';}return true;}
 e.hits.push(f.id);if(e.kind==='companion'){e.attack=0;e.phase='return';}else if(!e.piercing)e.life=0;const previousThreat=g.legacyThreat;g.legacyThreat={attacker:a.id,disarmEligible:false,kind:e.geometry?.kind??e.fighter?.kind,angle:e.fighter?.attackAim??e.angle??Math.atan2(e.vy,e.vx),source:e.type,origin:clone(old||e),parryable:e.parryable,shape:e.points?{points:clone(e.points)}:e.to?{from:{x:e.x,y:e.y},to:clone(e.to),r:e.r}:{from:clone(old||e),to:{x:e.x,y:e.y},r:e.r}};let hit;try{hit=g.lethal(a,f,'Um Legado encontrou uma abertura.');}finally{g.legacyThreat=previousThreat;}if(hit&&has(a,'crackedglass'))refill(g,a);return true;
}
function pendingStrike(g,f,a){if(g.legacyThreat)return clone(g.legacyThreat);const points=a?slash(a,g.map.walls).points:[];return{attacker:a?.id??(f.id?0:1),disarmEligible:physicalWeapon(a),origin:a?center(a):center(f),parryable:!!a&&a.state!=='ultCharge'&&!(a.breakAttackId&&a.breakAttackId===a.attackId),shape:points.length?{points:clone(points)}:{from:center(f),to:center(f),r:12}};}
function pendingTouches(p,f){const b=body(f),a={x:f.x,y:f.y-b.top},z={x:f.x,y:f.y-b.bottom};return p.shape.points?polygonSegment(p.shape.points,a,z,b.radius):segmentDistance(p.shape.from,p.shape.to,a,z)<=b.radius+p.shape.r;}
L.tryRewind=(g,f)=>{const l=ensure(f);if(!has(f,'secondchance')||l.used.match.secondchance||!g.legacyRoundStart)return false;l.used.match.secondchance=true;g.legacyRewind=true;effect(g,f,'rewind');return true;};
L.protect=(g,f,a)=>{if(!f.legacy)return false;const l=ensure(f),fx=l.effects;
 if(legionProtect(g,f,a))return true;
 if(fx.mist>0||fx.shadow>0||fx.phasing||fx.berserk>0||fx.eye>0)return true;
 if(fx.barrier>0&&a&&(Math.sign((g.legacyThreat?.origin.x??a.x)-f.x)||f.guardFacing)===f.facing){fx.barrier=0;effect(g,f,'barrierBreak');return true;}
 // Eye is a reaction opportunity. Invulnerability ends before the pending strike is resolved.
 if(has(f,'destinyeye')&&!l.used.match.destinyeye){l.used.match.destinyeye=true;fx.eye=.22;l.pendingFatal=pendingStrike(g,f,a);effect(g,f,'destinyeye',f.x,f.y-70,{life:.22});return true;}
 if(has(f,'crystal')&&!l.used.match.crystal){l.used.match.crystal=true;effect(g,f,'crystalBreak');g.emit('shieldBreak',{id:f.id});return true;}
 if(has(f,'berserker')&&!l.used.match.berserker){l.used.match.berserker=true;fx.berserk=2;l.berserkThreat=a?.id??(f.id?0:1);effect(g,f,'berserker',f.x,f.y-70,{life:2});return true;}
 if(L.tryRewind(g,f))return true;
 return false;
};
L.timeScale=(g,f)=>{let scale=g.fighters.some(t=>!t.dead&&hostile(g,t.id,f)&&t.legacy?.effects.eye>0)?.05:1;for(const e of world(g).effects){if(e.age<e.warn||e.age>=e.life||!hostile(g,e.owner,f))continue;if(e.type==='timeStop')scale=0;if(e.type==='slowTime')scale=Math.min(scale,e.factor??.25);}return scale;};
function transform(g,f,id){const l=ensure(f),eligible=l.items.filter(k=>k!==id&&!l.consumed.includes(k)&&!l.transforms.some(t=>t.from===k)&&(id!=='philosopher'||L.catalog[k].rarity!=='legendary'));
 const from=id==='philosopher'?eligible[Math.floor(g.random()*eligible.length)]:l.target&&eligible.includes(l.target)?l.target:eligible[0];if(!from)return false;const old=L.catalog[from],rarity=id==='philosopher'?L.catalog[from].rarity==='common'?'rare':'legendary':old.rarity,pool=Object.values(L.catalog).filter(c=>c.id!==id&&!l.items.includes(c.id)&&!l.transforms.some(t=>t.to===c.id)&&c.rarity===rarity&&(id!=='philosopher'||c.category===old.category)&&L.eligible(c.id,{mode:g.pathEncounter?'path':g.mode}));if(!pool.length)return false;const to=pool[Math.floor(g.random()*pool.length)].id;const binding=l.bindings[from];l.transforms.push({from,to,...(binding?{binding}:{})});delete l.bindings[from];if(L.catalog[to].active){const key=binding||Array.from({length:9},(_,i)=>'Digit'+(i+1)).find(k=>!Object.values(l.bindings).includes(k));if(key)l.bindings[to]=key;}if(l.gesture===from)l.gesture=['glider','rockets','icarus'].includes(to)?to:null;if(L.catalog[from].category==='summon')world(g).entities=world(g).entities.filter(e=>e.owner!==f.id||e.type!==from&&!(from==='necromancer'&&e.type==='servant'));if(L.catalog[to].category==='summon')L.spawnCompanions(g,f);if(l.weapon===from&&L.catalog[to].category!=='weapon')l.weapon=l.items.find(k=>k!==from&&L.catalog[k].category==='weapon')||null;if(id==='philosopher')l.consumed.push(id);effect(g,f,'transform');return true;}
const mirrorPowers=new Set(['fireball','pulse','impulse','barrier','blink','gust','lightning','repulsor','telekinesis','web','well','mist','ice','amaterasu','thehand']);
function rememberMirror(g,f,id){if(g.legacyMirrorCast)return;for(const t of enemies(g,f))if(L.scopeReady(t,'brokenmirror')&&Math.hypot(t.x-f.x,t.y-f.y)<480){ensure(t).copied=id;effect(g,t,'mirrorMemory',t.x,t.y-body(t).top-12,{life:.3});}}
function copySpecial(g,f,kind,inp){const l=ensure(f);if(!Object.hasOwn(D.CLASSES,kind)||!g.rules.specials||!g.canAct(f)||l.mirrorSpecial||f.ultMode||f.parryLock>0||f.dashLock>0||l.channel||l.weaponHold||L.attackTechnique(f)||l.effects.mist>0||kind!=='knight'&&(l.effects.weaponAway||f.dagger))return false;
 if(kind==='staff'&&!f.grounded)return false;
 const aim=f.aim,facing=f.facing;l.mirrorSpecial={kind};if(Number.isFinite(inp.aim)){f.aim=inp.aim;f.facing=Math.sign(Math.cos(inp.aim))||f.facing;}let ok=false;
 try{ok=L._vanilla.special.call(g,f.id,kind);}finally{f.aim=aim;f.facing=facing;if(!ok)delete l.mirrorSpecial;}
 if(ok){f.legacyNoSlash=false;}if(ok)effect(g,f,'mirrorCast',f.x,f.y-body(f).center,{life:.4});return ok;
}
L.finishMirrorSpecial=f=>{if(f.legacy?.mirrorSpecial&&!f.ultMode&&!f.dagger&&!(f.parryLock>0)&&!(f.dashLock>0)&&!['startup','active','recovery','ultRecovery','ultWindup','ultCharge','throwWindup'].includes(f.state))delete f.legacy.mirrorSpecial;};
L.mirrorName=id=>typeof id==='string'&&id.startsWith('class:')?D.SPECIALS?.[id.slice(6)]?.name||D.CLASSES[id.slice(6)]?.name||id.slice(6):L.catalog[id]?.name||'SEM MEMÓRIA';
L.activate=(g,f,id,inp={})=>{if(!L.catalog[id]||!L.scopeReady(f,id)||f.dead||g.phase!=='playing'||L.timeScale(g,f)===0)return false;const l=ensure(f),fx=l.effects,p=center(f),a=Number.isFinite(inp.aim)?inp.aim:f.aim,target=enemies(g,f).sort((a,b)=>Math.hypot(a.x-f.x,a.y-f.y)-Math.hypot(b.x-f.x,b.y-f.y))[0];
 if(['glider','rockets','icarus'].includes(id)){fx[id]=fx[id]>0?0:60;L.spend(f,id);return true;}
 if(id==='gravitycloak'){fx.inverted=!fx.inverted;f.grounded=false;f.platform=-1;f.vy=0;}
 else if(id==='weaponmaster'){if(!throwWeapon(g,f))return false;}
 else if(id==='d6'||id==='philosopher'){if(!transform(g,f,id))return false;}
 else if(id==='d20'){const roll=l.forcedDie||1+Math.floor(g.random()*20);if(l.diceTarget==='draft')l.draftBoost=roll;else{fx.d20=true;fx.d20Bonus=roll===1?.58:roll<=5?.8:roll<=9?.93:roll<=11?1:roll<=15?1.12:roll<=19?1.25:1.45;l.matchEffects={d20:true,d20Bonus:fx.d20Bonus};}effect(g,f,'dice',p.x,p.y,{value:roll,life:1.2});}
 else if(id==='brokenmirror'){const copied=l.copied;if(typeof copied==='string'&&copied.startsWith('class:')){if(!copySpecial(g,f,copied.slice(6),inp))return false;l.copied=null;}else{if(!mirrorPowers.has(copied))return false;const saved={items:[...l.items],transforms:clone(l.transforms),consumed:[...l.consumed],cd:{...l.cd},used:clone(l.used)};let ok=false;const previousCast=g.legacyMirrorCast;g.legacyMirrorCast=true;try{if(!l.items.includes(copied))l.items.push(copied);l.transforms=l.transforms.filter(t=>t.from!==copied);l.consumed=l.consumed.filter(k=>k!==copied);delete l.cd[copied];for(const v of Object.values(l.used))delete v[copied];ok=L.activate(g,f,copied,inp);}finally{Object.assign(l,saved);g.legacyMirrorCast=previousCast;}if(!ok)return false;l.copied=null;}}
 else if(id==='destinyorb')return false; // Handled by the draft transaction, never silently consumed here.
 else if(id==='fireball')projectile(g,f,'fireball',a,{speed:590,r:12,life:2});
 else if(id==='pulse'){const exposed=q=>Math.hypot(q.x-p.x,q.y-p.y)<175&&!g.map.walls.some(w=>wallFraction(p,q,w)<1);for(const t of enemies(g,f))if(exposed(center(t)))push(g,t,t.x-f.x,t.y-f.y-60,650);for(const e of world(g).entities)if(looseForceObject(e)&&exposed(e)){e.vx=(e.x<p.x?-1:1)*500;e.vy=-180;}effect(g,f,'pulse',p.x,p.y,{r:175});}
 else if(id==='impulse'||id==='repulsor'){f.vx=Math.cos(a)*(id==='impulse'?800:-650);f.vy=Math.sin(a)*(id==='impulse'?800:-650);f.grounded=false;f.platform=-1;fx.impulse=.18;if(id==='repulsor'){const end=raySurface(g,p,a,210)||{x:p.x+Math.cos(a)*210,y:p.y+Math.sin(a)*210};entity(g,f,'repulse',{...p,to:end,angle:a,zone:true,r:22,life:.12,lethal:false,force:800,vx:Math.cos(a),vy:Math.sin(a),parryable:true});}effect(g,f,id,p.x,p.y,{angle:a});}
 else if(id==='barrier'){fx.barrier=3;effect(g,f,'barrier');}
 else if(id==='telekinesis'){const hit=aimHit(g,f,a,650,{actors:false,objects:true});if(hit?.type!=='object')return false;pullObject(world(g).entities.find(e=>e.id===hit.id),f);effect(g,f,'tether',p.x,p.y,{to:{x:hit.x,y:hit.y},life:.2});}
 else if(id==='gust')entity(g,f,'gust',{x:p.x+Math.cos(a)*130,y:p.y+Math.sin(a)*130,angle:a,zone:true,r:115,life:.85,lethal:false,force:430,vx:Math.cos(a)*200,vy:Math.sin(a)*200});
 else if(id==='swap'){if(l.mark&&g.time-l.mark.at<4){if(!portalClear(g,l.mark.x,l.mark.y-body(f).center,f))return false;Object.assign(f,{x:l.mark.x,y:l.mark.y,grounded:false,platform:-1});l.mark=null;world(g).effects=world(g).effects.filter(e=>e.owner!==f.id||e.type!=='mark');effect(g,f,'swap');}else{l.mark={x:f.x,y:f.y,at:g.time};world(g).effects=world(g).effects.filter(e=>e.owner!==f.id||e.type!=='mark');effect(g,f,'mark',p.x,p.y,{life:4});l.cd[id]=.2;return true;}}
 else if(id==='blink'){const dest=blinkDestination(g,f,a);if(dest.x===f.x&&dest.y===f.y)return false;effect(g,f,'blink');Object.assign(f,dest,{grounded:false,platform:-1});}
 else if(id==='web'){const hit=aimHit(g,f,a,650,{actors:true,objects:true});if(!hit)return false;effect(g,f,'tether',p.x,p.y,{to:{x:hit.x,y:hit.y},life:.16});if(hit.type==='actor'){entity(g,f,'webhit',{x:hit.x,y:hit.y,r:22,zone:true,lethal:false,force:260,vx:p.x-hit.x,vy:p.y-hit.y,life:.22,warn:.1});}else if(hit.type==='object')pullObject(world(g).entities.find(e=>e.id===hit.id),f);else l.grapple={...hit,life:2.2};}
 else if(id==='well')entity(g,f,'well',{x:p.x+Math.cos(a)*200,y:p.y+Math.sin(a)*200,zone:true,r:160,life:2.6,warn:.25,lethal:false});
 else if(id==='mist'){fx.mist=1.1;effect(g,f,'mist',p.x,p.y,{life:1.1});}
 else if(id==='lightning'){const hit=aimHit(g,f,a,350,{actors:true,objects:false});if(hit?.type!=='actor')return false;const t=g.fighters[hit.id];entity(g,f,'lightning',{...p,to:center(t),target:t.id,visited:[],zone:true,r:9,life:.38,warn:.25});}
 else if(id==='ice'){const hit=aimHit(g,f,a,330,{actors:true,objects:false});if(!hit)return false;if(hit.type==='actor')entity(g,f,'frost',{x:hit.x,y:hit.y,r:24,zone:true,lethal:false,freeze:.12,life:.25,warn:.12});else if(hit.type==='wall'){const wall=g.map.walls[hit.index],left=p.x<wall.x+wall.w/2,x=left?wall.x-65:wall.x+wall.w+65;if(x<65||x>g.map.width-65)return false;entity(g,f,'ice',{x,y:hit.y,r:0,zone:true,lethal:false,iceKind:'wall',life:4,warn:.2});}else{const q=g.map.platforms[hit.index];entity(g,f,'ice',{x:hit.x,y:q.y,r:0,zone:true,lethal:false,iceKind:'ground',support:hit.index,offsetX:hit.x-q.x,life:4,warn:.2});}}
 else if(id==='shadowbomb'){const bomb=world(g).entities.find(e=>e.type==='shadowbomb'&&e.owner===f.id);if(bomb){bomb.life=0;entity(g,f,'smoke',{x:bomb.x,y:bomb.y,zone:true,r:150,life:2.8,lethal:false});}else{projectile(g,f,'shadowbomb',a,{speed:560,lethal:false,life:6});l.cd[id]=.25;return true;}}
 else if(id==='sandevistan')effect(g,f,'slowTime',p.x,p.y,{life:1.7,warn:.2,factor:.25});
 else if(id==='star')effect(g,f,'timeStop',p.x,p.y,{life:1.25,warn:.35});
 else if(id==='room'){if(fx.room>0){const hit=aimHit(g,f,a,560,{actors:true,objects:true});if(!hit||!['actor','object'].includes(hit.type)||Math.hypot(p.x-l.roomCenter.x,p.y-l.roomCenter.y)>l.roomRadius||Math.hypot(hit.x-l.roomCenter.x,hit.y-l.roomCenter.y)>l.roomRadius)return false;entity(g,f,'shambles',{x:hit.x,y:hit.y,target:{type:hit.type,id:hit.id},roomCenter:clone(l.roomCenter),roomRadius:l.roomRadius,zone:true,lethal:false,life:.36,warn:.3});}else{fx.room=5;l.roomCenter={...p};l.roomRadius=280;effect(g,f,'room',p.x,p.y,{life:5,r:280});l.cd[id]=.35;return true;}}
 else if(id==='portals'){const hit=raySurface(g,p,a,850),dest=hit&&portalSurface(g,hit,p);if(!dest)return false;const portals=world(g).entities.filter(e=>e.owner===f.id&&e.type==='portal'&&e.age<e.life);if(portals.some(e=>Math.hypot(e.x-dest.x,e.y-dest.y)<80))return false;if(portals.length>=2)for(const e of portals)e.life=0;entity(g,f,'portal',{...dest,slot:portals.length===1?1:0,life:12,r:38,zone:true,lethal:false});}
 else if(id==='amaterasu'){const dest=raySurface(g,p,a,650)||{x:clamp(p.x+Math.cos(a)*240,20,g.map.width-20),y:f.y-15};blackfire(g,f,dest);}
 else if(id==='kamehameha'){if(l.channel||!g.canAct(f)||f.dashRemaining>0||l.weaponHold||fx.mist>0)return false;l.channel={id,age:0,aim:a};effect(g,f,'charge',p.x,p.y,{life:3.25});return true;}
 else if(id==='thehand'){entity(g,f,'erase',{...p,angle:a,zone:true,lethal:false,life:.3,warn:.12,r:240});}
 else if(id==='domain'){fx.domain=4;fx.domainPulse=.1;l.domainCenter={...p};l.domainRadius=430;l.domainTurn=0;effect(g,f,'domain',p.x,p.y,{life:4,r:430});}
 else if(['falcon','dragon','kraken'].includes(id)){const summons=world(g).entities.filter(e=>e.owner===f.id&&e.type===id);if(id==='falcon'){const e=summons[0];if(!e||e.phase==='return'||e.attack>0||Math.hypot(e.x-(p.x-55),e.y-(p.y-85))>70)return false;e.attack=1.5;e.warnLeft=.35;e.phase='attack';e.hits=[];e.aim=a;}else if(id==='dragon')entity(g,f,'dragonbreath',{x:p.x+Math.cos(a)*230,y:p.y+Math.sin(a)*160,angle:a,zone:true,r:210,warn:1.2,life:2,friendly:true,parryable:false});else if(!krakenCommand(g,f,a))return false;}
 else return false;
 L.spend(f,id);g.emit('legacyUse',{id:f.id,legacy:id,x:p.x,y:p.y});if(mirrorPowers.has(id))rememberMirror(g,f,id);return true;
};
function krakenAnchor(g,p,angle){const target=raySurface(g,p,angle,330)||{x:clamp(p.x+Math.cos(angle)*330,0,g.map.width),y:p.y+Math.sin(angle)*330},candidates=[];
 for(let i=0;i<g.map.platforms.length;i++){const s=g.map.platforms[i];if(s.stage==='gone')continue;candidates.push({x:clamp(target.x,s.x+2,s.x+s.w-2),y:s.y,nx:0,ny:target.y<=s.y?-1:1,surface:'platform',index:i});}
 for(let i=0;i<g.map.walls.length;i++){const s=g.map.walls[i],x=clamp(target.x,s.x,s.x+s.w),y=clamp(target.y,s.y,s.y+s.h);for(const q of [{x:s.x,y,nx:-1,ny:0},{x:s.x+s.w,y,nx:1,ny:0},{x,y:s.y,nx:0,ny:-1},{x,y:s.y+s.h,nx:0,ny:1}])candidates.push({...q,surface:'wall',index:i});}
 for(const side of [-1,1])candidates.push({x:side<0?0:g.map.width,y:clamp(target.y,40,g.map.deathY-100),nx:-side,ny:0,surface:'edge'});
 const hit=candidates.filter(q=>Math.hypot(q.x-target.x,q.y-target.y)<370&&Math.hypot(q.x-p.x,q.y-p.y)<650&&!g.map.walls.some(w=>wallFraction(p,{x:q.x+q.nx*2,y:q.y+q.ny*2},w)<1)).sort((a,b)=>Math.hypot(a.x-target.x,a.y-target.y)-Math.hypot(b.x-target.x,b.y-target.y))[0];if(!hit)return null;const s=hit.surface==='wall'?g.map.walls[hit.index]:hit.surface==='platform'?g.map.platforms[hit.index]:null;return{...hit,offsetX:s?hit.x-s.x:0,offsetY:s?hit.y-s.y:0};
}
function krakenCommand(g,f,angle){const source=world(g).entities.find(e=>e.type==='kraken'&&e.owner===f.id&&e.age<e.life),anchor=krakenAnchor(g,center(f),angle);if(!source||!anchor)return false;const l=ensure(f),index=l.krakenForm||0,form=['smash','grab','block'][index],warn=[.8,.6,.9][index],duration=[.24,.35,2.4][index];const e=entity(g,f,'krakenArm',{...anchor,source:source.id,form,piercing:true,zone:true,r:0,lethal:form!=='grab',parryable:form==='grab',freeze:form==='grab'?.24:0,warn,life:warn+duration,length:[200,170,225][index],halfWidth:[30,20,22][index],points:[]});krakenGeometry(g,e);l.krakenForm=(index+1)%3;return true;}
function krakenGeometry(g,e){const s=e.surface==='wall'?g.map.walls[e.index]:e.surface==='platform'?g.map.platforms[e.index]:null;if(e.surface!=='edge'){if(!s||s.stage==='gone'){e.life=0;e.points=[];return false;}e.x=s.x+e.offsetX;e.y=s.y+e.offsetY;}
 const origin={x:e.x+e.nx*2,y:e.y+e.ny*2},at=(along,side)=>({x:origin.x+e.nx*along-e.ny*side,y:origin.y+e.ny*along+e.nx*side}),r=e.halfWidth,len=e.length,points=[at(0,-r*.8),at(len*.72,-r),at(len,-r*.3),at(len+7,0),at(len,r*.3),at(len*.72,r),at(0,r*.8)];e.points=D.wallContour(points,origin,g.map.walls,len+r);return true;
}
function tickKrakenArm(g,e,f){if(f.dead||!has(f,'kraken')||!world(g).entities.some(s=>s.id===e.source&&s.age<s.life)||!krakenGeometry(g,e)){e.life=0;return;}if(e.age<e.warn||e.age>=e.life)return;
 for(const t of enemies(g,f)){const b=body(t);if(!polygonSegment(e.points,{x:t.x,y:t.y-b.top},{x:t.x,y:t.y-b.bottom},b.radius))continue;abilityHit(g,e,t,{x:e.x,y:e.y},true);if(e.life<=e.age)break;}
}
function raySurface(g,p,a,d){const to={x:p.x+Math.cos(a)*d,y:p.y+Math.sin(a)*d};let hit=1,meta=null;for(let i=0;i<g.map.walls.length;i++){const t=wallFraction(p,to,g.map.walls[i]);if(t<hit){hit=t;meta={surface:'wall',index:i};}}for(let i=0;i<g.map.platforms.length;i++){const q=g.map.platforms[i];if(q.stage==='gone')continue;const t=(q.y-p.y)/(to.y-p.y);if(t>0&&t<hit&&p.x+(to.x-p.x)*t>=q.x&&p.x+(to.x-p.x)*t<=q.x+q.w){hit=t;meta={surface:'platform',index:i,offsetX:p.x+(to.x-p.x)*t-q.x};}}return meta?{...meta,x:p.x+(to.x-p.x)*hit,y:p.y+(to.y-p.y)*hit,fraction:hit}:null;}
function looseObject(e){return e.age<e.life&&!e.carrier&&(e.type==='weapon'||e.type==='shadowbomb'||e.physical&&e.fetchable);}
function aimHit(g,f,a,range,{actors=true,objects=false}={}){const p=center(f),to={x:p.x+Math.cos(a)*range,y:p.y+Math.sin(a)*range};const surface=raySurface(g,p,a,range);let hit=surface?{...surface,type:surface.surface}:null,limit=hit?.fraction??1;
 const consider=(type,id,x,y,w,h)=>{const t=wallFraction(p,to,{x,y,w,h});if(t<limit&&t>=0){limit=t;hit={type,id,x:p.x+(to.x-p.x)*t,y:p.y+(to.y-p.y)*t,fraction:t};}};
 if(actors)for(const t of enemies(g,f)){const b=body(t);consider('actor',t.id,t.x-b.radius-4,t.y-b.top-b.radius,b.radius*2+8,b.top-b.bottom+b.radius*2);}
 if(objects)for(const e of world(g).entities)if(looseObject(e)){const r=(e.r||6)+5;consider('object',e.id,e.x-r,e.y-r,r*2,r*2);}
 return hit;
}
function pullObject(e,f){if(e.type==='weapon'){e.mode='fetch';e.fetch=f.id;}else e.pulledBy=f.id;}
function portalSurface(g,hit,from){const s=hit.surface==='wall'?g.map.walls[hit.index]:g.map.platforms[hit.index];if(!s||s.stage==='gone')return null;let x=hit.x,y=hit.y,nx=0,ny=0;if(hit.surface==='platform'){if(s.w<76)return null;x=clamp(x,s.x+38,s.x+s.w-38);ny=from.y<s.y?-1:1;}else{const faces=[{d:Math.abs(x-s.x),nx:-1,ny:0},{d:Math.abs(x-s.x-s.w),nx:1,ny:0},{d:Math.abs(y-s.y),nx:0,ny:-1},{d:Math.abs(y-s.y-s.h),nx:0,ny:1}].sort((a,b)=>a.d-b.d);({nx,ny}=faces[0]);if(nx){if(s.h<76)return null;y=clamp(y,s.y+38,s.y+s.h-38);}else{if(s.w<76)return null;x=clamp(x,s.x+38,s.x+s.w-38);}}return{...hit,x,y,nx,ny,angle:Math.atan2(ny,nx),offsetX:x-s.x,offsetY:y-s.y};}
function portalExtent(f,nx,ny){const b=body(f);return Math.abs(nx)*b.radius+Math.abs(ny)*Math.max(b.center,b.top-b.center+b.radius);}
function portalClear(g,x,y,f,r=8){if(f){if(!free(g,x,y+body(f).center,f))return false;const b=body(f);return !g.map.platforms.some(p=>p.stage!=='gone'&&x+b.radius>p.x&&x-b.radius<p.x+p.w&&p.y>y+b.center-b.top+1&&p.y<y+b.center-b.bottom-1);}return x>r&&x<g.map.width-r&&y>r&&y<g.map.deathY-r&&!g.map.walls.some(w=>x+r>w.x&&x-r<w.x+w.w&&y+r>w.y&&y-r<w.y+w.h)&&!g.map.platforms.some(p=>p.stage!=='gone'&&x+r>p.x&&x-r<p.x+p.w&&Math.abs(y-p.y)<r);}
function eraseSpace(g,e){if(e.done)return;e.done=true;const dx=Math.cos(e.angle),dy=Math.sin(e.angle),inside=p=>{const x=p.x-e.x,y=p.y-e.y,along=x*dx+y*dy;return along>60&&Math.hypot(x,y)<e.r&&Math.abs(-x*dy+y*dx)<along*.7&&!g.map.walls.some(w=>wallFraction(e,p,w)<1);};for(const f of g.fighters)if(!f.dead&&hostile(g,e.owner,f)&&inside(center(f))){const p=destination(g,f,e.angle+Math.PI,Math.min(110,(f.x-e.x)*dx+(center(f).y-e.y)*dy-55));Object.assign(f,p,{grounded:false,platform:-1});g.collideWalls(f);}for(const p of world(g).entities)if(!p.zone&&p.kind!=='companion'&&!p.carrier&&p.age<p.life&&inside(p)){const distance=Math.min(110,(p.x-e.x)*dx+(p.y-e.y)*dy-55);for(let n=distance;n>0;n-=6){const x=p.x-dx*n,y=p.y-dy*n;if(portalClear(g,x,y,null,p.r||8)){p.x=x;p.y=y;break;}}}}
function safeDestination(g,f,x,y){if(!free(g,x,y,f))return false;const b=body(f),p={x,y:y-b.center};if(!g.map.platforms.some(q=>q.stage!=='gone'&&x>=q.x+b.radius&&x<=q.x+q.w-b.radius&&q.y>=y-1&&q.y<g.map.deathY))return false;
 return !world(g).entities.some(e=>e.zone&&e.lethal&&e.age>=e.warn&&e.age<e.life&&(e.friendly||hostile(g,e.owner,f))&&(e.to?segmentDistance(e,e.to,{x,y:y-b.top},{x,y:y-b.bottom})<b.radius+e.r:Math.hypot(e.x-p.x,e.y-p.y)<(e.r||0)+b.radius));
}
function shambles(g,e,f){if(e.done||e.age<e.warn)return;e.done=true;const ref=typeof e.target==='number'?{type:'actor',id:e.target}:e.target,t=ref.type==='actor'?g.fighters[ref.id]:world(g).entities.find(p=>p.id===ref.id&&looseObject(p));if(!t||t.dead)return;const from=center(f),point=ref.type==='actor'?center(t):{x:t.x,y:t.y},room=e.roomCenter||ensure(f).roomCenter,r=e.roomRadius||280;if(!room||Math.hypot(from.x-room.x,from.y-room.y)>r||Math.hypot(point.x-room.x,point.y-room.y)>r)return;const dest={x:point.x,y:point.y+body(f).center};if(ref.type==='object'){const support=g.map.platforms.filter(q=>q.stage!=='gone'&&point.x>=q.x+body(f).radius&&point.x<=q.x+q.w-body(f).radius&&q.y>=point.y-4&&q.y<=dest.y+4).sort((a,b)=>a.y-b.y)[0];if(support)dest.y=support.y;}if(!safeDestination(g,f,dest.x,dest.y))return;
 if(ref.type==='actor'){const otherY=from.y+body(t).center;if(!safeDestination(g,t,from.x,otherY))return;Object.assign(t,{x:from.x,y:otherY,grounded:false,platform:-1});}else{Object.assign(t,from);t.carrier=null;}
 Object.assign(f,dest,{grounded:false,platform:-1});effect(g,f,'swap');
}
L.aimHit=aimHit;L.safeDestination=safeDestination;
function throwWeapon(g,f,aim=f.aim){if(!physicalWeapon(f))return false;const l=ensure(f),weapon=weaponId(f)||'sword';l.effects.weaponAway=true;projectile(g,f,'weapon',aim,{speed:1000,weapon,originalOwner:f.id,mode:'flying',life:120,r:12,piercing:true,returning:false});g.emit('legacyThrow',{id:f.id});return true;}
function shoot(g,f,w){if(w==='bow')projectile(g,f,'arrow',f.attackAim,{speed:1150,r:4});if(w==='kunai')projectile(g,f,'kunai',f.attackAim,{speed:880,r:5,range:500});if(w==='blunderbuss'){for(let i=-2;i<=2;i++)projectile(g,f,'pellet',f.attackAim+i*.12,{speed:1550,r:4,range:160,life:.15});if(!f.grounded){f.vx-=Math.cos(f.attackAim)*120;f.vy-=Math.sin(f.attackAim)*120;}}if(w==='yoyo')projectile(g,f,'yoyo',f.attackAim,{speed:780,r:13,piercing:true,life:1.5,anchor:clone(center(f))});}
L.command=(g,f,input,dt)=>{if(!f.legacy)return;const l=ensure(f),fx=l.effects;let w=originalSpecial(f)?null:weaponId(f);l.lastInput={...input,legado:[...(input.legado||[])],legadoHeld:[...(input.legadoHeld||[])]};
 const attackReady=!f.dead&&(g.canAct(f)||['dash','slide'].includes(f.state))&&f.ultMode!=='unarmed'&&!(fx.mist>0),kickReady=g.canAct(f)&&f.kickCooldown<=0;
 if(input.attack&&attackReady){if(has(f,'downstrike')&&!f.grounded&&input.down){input.aim=Math.PI/2;fx.plunge=.3;}else if(has(f,'upstrike')&&input.up)input.aim=-Math.PI/2;}
 if(input.attack&&attackReady&&has(f,'wallstrike')&&(f.wallSide||f.wallJumpTime>0)){if(f.wallSide)input.jump=true;fx.counter=.18;}
 if(L.attackTechnique(f)){input.jump=false;input.jumpHeld=true;input.move=0;input.dash=false;input.parry=false;input.special=false;f.jumpBuffer=0;}
 for(const id of(input.legado||[]).slice(0,16))L.activate(g,f,id,input);if(originalSpecial(f))w=null;
 if(l.channel){if(f.dead||!has(f,l.channel.id)||!g.canAct(f)||input.attack||input.parry||input.kick||input.dash||input.special||input.jump||fx.mist>0)L.cancelChannel(g,f);else{l.channel.age=Math.min(3.2,l.channel.age+dt);const p=center(f),h=l.channel;h.to=raySurface(g,p,h.aim,1100)||{x:p.x+Math.cos(h.aim)*1100,y:p.y+Math.sin(h.aim)*1100};if(h.age>=2&&!h.ready){h.ready=true;g.emit('legacyChargeReady',{id:f.id,x:p.x,y:p.y});effect(g,f,'channelReady',p.x,p.y,{life:.3});}if(h.age>=3.2||!(input.legadoHeld||[]).includes(h.id)&&!(input.legado||[]).includes(h.id))channelEnd(g,f);}}
 if(input.attack&&w==='leviathan'&&fx.weaponAway){const e=world(g).entities.find(e=>e.type==='weapon'&&e.originalOwner===f.id);if(e){e.returning=true;e.mode='return';e.owner=f.id;e.hits=[];}input.attack=false;}
 if(input.attack&&w==='gunblade'&&f.state==='active'&&f.stateTime<=.07&&!l.triggered){projectile(g,f,'trigger',f.attackAim,{x:f.x+Math.cos(f.attackAim)*D.stats(f).reach,y:f.y-body(f).center+Math.sin(f.attackAim)*D.stats(f).reach,range:62,speed:1200,r:7,life:.06});l.triggered=true;input.attack=false;}
 const chargeFree=g.canAct(f)||!f.dead&&(['dash','slide'].includes(f.state)||l.weaponHold&&['dashRecovery','slideRecovery'].includes(f.state)),chargeTime=.32/g.rules.attackSpeed;
 if(l.weaponHold&&(!chargeFree||input.parry||input.kick||input.special||fx.weaponAway||l.weaponHold.weapon&&l.weaponHold.weapon!==w)){l.weaponHold=null;world(g).effects=world(g).effects.filter(e=>e.owner!==f.id||e.type!=='weaponCharge');}
 if(input.attack&&['leviathan','yamato','ruyi'].includes(w)&&chargeFree&&!input.parry&&!input.kick&&!input.special&&!fx.weaponAway){l.weaponHold??={weapon:w,age:0,aim:Number.isFinite(input.aim)?input.aim:f.aim};input.attack=false;}
 if(l.weaponHold){const h=l.weaponHold;h.age+=dt;const ready=h.age>=chargeTime,p=center(f),x=p.x+Math.cos(h.aim)*300,y=p.y+Math.sin(h.aim)*300;
  if(w==='yamato'){let tell=world(g).effects.find(e=>e.owner===f.id&&e.type==='weaponCharge');if(!tell)tell=effect(g,f,'weaponCharge',x,y,{life:.08,angle:h.aim,r:70});Object.assign(tell,{x,y,age:0,ready,angle:h.aim});}
  if(ready&&(w==='leviathan'||w==='ruyi')||!input.attackHeld){l.weaponHold=null;world(g).effects=world(g).effects.filter(e=>e.owner!==f.id||e.type!=='weaponCharge');f.attackAim=h.aim;
   if(!ready){const aim=f.aim;f.aim=h.aim;g.command(f.id,'attack',{...input,aim:h.aim});f.aim=aim;}
   else if(w==='leviathan'){throwWeapon(g,f,h.aim);g.setState(f,'recovery',.22/g.rules.attackSpeed*g.rules.attackRecovery);}
   else if(w==='yamato'){entity(g,f,'spatialcut',{x,y,zone:true,angle:h.aim,r:70,life:.18,warn:.04});g.setState(f,'recovery',.3/g.rules.attackSpeed*g.rules.attackRecovery);}
   else if(w==='ruyi'){const surface=raySurface(g,p,h.aim,620),end=surface||{x:p.x+Math.cos(h.aim)*620,y:p.y+Math.sin(h.aim)*620};entity(g,f,'beam',{...p,to:end,zone:true,r:12,life:.16,angle:h.aim,weapon:'ruyi'});if(surface?.surface==='platform'&&Math.sin(h.aim)>.5){f.vy=-1100;f.grounded=false;f.platform=-1;effect(g,f,'pogo',end.x,end.y);}g.setState(f,'recovery',.3/g.rules.attackSpeed*g.rules.attackRecovery);}
  }
 }
 if(input.dash&&f.state==='recovery'&&has(f,'dashcancel')&&f.stateTime>f.duration*.35&&f.dashCharges>0){const saved={state:f.state,stateTime:f.stateTime,duration:f.duration};g.setState(f,'idle');if(g.dash(f.id,input.move,input.down,input.up))input.dash=false;else Object.assign(f,saved);}
 if(input.dash&&has(f,'backstep')&&f.state==='startup'&&f.stateTime<=Math.min(.14,f.duration*.65)&&input.move*(Math.sign(Math.cos(f.attackAim))||f.facing)<0&&f.dashCharges>0){const saved={state:f.state,stateTime:f.stateTime,duration:f.duration},aim=f.aim;g.setState(f,'idle');f.aim=input.move<0?Math.PI:0;const ok=g.dash(f.id,input.move,false,false);f.aim=aim;if(ok){input.dash=false;f.dashRemaining*=.65;f.duration=f.dashRemaining;}else Object.assign(f,saved);}
 if(l.kickHold!==undefined&&(!kickReady||input.parry||input.attack||input.dash||input.special))delete l.kickHold;
 if(input.kick&&kickReady&&has(f,'throw')&&input.down&&f.grounded){const t=enemies(g,f).find(t=>Math.hypot(t.x-f.x,t.y-f.y)<65&&!g.map.walls.some(w=>wallFraction(center(f),center(t),w)<1));if(t){const side=Math.sign(t.x-f.x)||f.facing,x=f.x-side*46,y=f.y-65;if(free(g,x,y,t)&&!g.map.walls.some(w=>wallFraction(center(t),{x,y:y-body(t).center},w)<1)){Object.assign(t,{x,y,platform:-1});push(g,t,-side,-.5,650);input.kick=false;f.kickCooldown=.7;g.setState(f,'kickRecovery',.35);g.emit('kick',{id:f.id,x:t.x,y:t.y-body(t).center,technique:'throw'});}}}
 if(input.kick&&kickReady&&has(f,'roundhouse')&&!input.down){l.kickHold??=0;input.kick=false;}if(l.kickHold!==undefined){l.kickHold+=dt;if(!input.kickHeld||l.kickHold>=.22){if(l.kickHold>=.22){fx.roundhouse=.42;l.roundhouseHits=[];effect(g,f,'roundhouse',f.x,f.y-45,{r:88,life:.25});}delete l.kickHold;input.kick=true;}}
 if(input.kick&&kickReady&&has(f,'flyingkick')&&!f.grounded&&!input.down&&!(fx.roundhouse>0)){f.vx=f.facing*650;f.vy=-260;fx.impulse=.18;}
 if(input.kick&&kickReady&&has(f,'stomp')&&!f.grounded&&input.down){fx.stomp=.45;f.vy=950;}
};
L.beforeStep=(g,commands,dt)=>{const w=world(g);w.time+=dt;for(const f of g.fighters){if(!f.legacy)continue;const l=ensure(f),fx=l.effects,td=dt*L.timeScale(g,f);for(const k of Object.keys(l.cd))l.cd[k]=Math.max(0,l.cd[k]-td);for(const k of Object.keys(fx))if(typeof fx[k]==='number'&&!['d20Bonus','weaponAway'].includes(k))fx[k]=Math.max(0,fx[k]-td);
 if(l.pendingFatal&&fx.eye<=0){const p=l.pendingFatal;l.pendingFatal=null;const a=g.fighters[p.attacker]||g.fighters[f.id?0:1];if(pendingTouches(p,f)){const side=Math.sign(p.origin.x-f.x),valid=p.parryable&&f.state==='parry'&&(!side||side===f.guardFacing);if(valid){const perfect=f.stateTime<=Math.min(.08,f.duration)+1e-8;g.setState(f,'idle');f.parryCooldown=Math.min(f.parryCooldown,.22);if(a&&!a.dead){a.attackHit=true;g.setState(a,'stunned',g.rules.stun/1000);}g.boxerParry(f);g.hitstop=.045;g.emit('parry',{id:f.id,attacker:a?.id,perfect,x:f.x,y:f.y-body(f).center,legacy:'destinyeye',disarmEligible:p.disarmEligible===true});}else g.lethal(a,f,'A última oportunidade passou.');}}
 if(l.berserkThreat!=null&&fx.berserk<=0){const a=g.fighters[l.berserkThreat]||g.fighters[f.id?0:1];l.berserkThreat=null;g.legacyFatalDebt=f.id;try{g.lethal(a,f,'A armadura cobrou o seu preço.');}finally{g.legacyFatalDebt=null;}}
 if(f.grounded){l.fuel=Math.min(1,l.fuel+td*.7);l.airTime=0;}else l.airTime=(l.airTime||0)+td;
 if(Math.abs(f.vx)<8&&f.grounded&&f.state==='idle'){l.still=(l.still||0)+td;if(has(f,'nodraw')&&l.still>1)fx.nodraw=.3;if(has(f,'incense')&&l.still>1)l.incenseReady=true;}else l.still=0;
 if(fx.domain>0&&fx.domainPulse<=0){fx.domainPulse=.6;const p=l.domainCenter||center(f),radius=l.domainRadius||430,targets=enemies(g,f).filter(t=>Math.hypot(t.x-p.x,t.y-body(t).center-p.y)<radius-65),turn=l.domainTurn||0;l.domainTurn=turn+1;for(let i=0;i<2;i++){const t=i===0?targets[turn%Math.max(1,targets.length)]:null,angle=g.random()*TAU,r=Math.sqrt(g.random())*(radius-65),q=t?center(t):{x:p.x+Math.cos(angle)*r,y:p.y+Math.sin(angle)*r};entity(g,f,'domaincut',{...q,zone:true,r:65,warn:.48,life:.65,angle:g.random()*TAU});}}
 
 }};
// Impulses and wall clothing feed the shared integrator; no second position step.
L.impulseVelocity=(g,f,inp,dt)=>{const fx=f.legacy?.effects;if(!(fx?.impulse>0))return false;
 if(f.dead||f.dashRemaining>0||inp.jump||L.attackTechnique(f)||['stunned','clash','pushed','ultCharge','ultWindup','throwWindup'].includes(f.state)){fx.impulse=0;return false;}
 f.vy+=1980*(L.movementRules(g,f)||g.rules).gravity*dt;return true;
};
L.wallClothingVelocity=(g,f,inp,dt)=>{const l=f.legacy;if(!l)return;
 if(f.grounded)l.wallRunLeft=1.4;
 if(f.dead||f.grounded||inp.jump||f.wallLock>0||f.dashRemaining>0||L.attackTechnique(f)||['stunned','clash','pushed','ultCharge','ultWindup','throwWindup'].includes(f.state))return;
 if(has(f,'lightcape')&&inp.jumpHeld&&!(l.effects.impulse>0))f.vy=Math.min(f.vy,160);
 if(!f.wallSide||inp.move*f.wallSide<=0)return;
 if(has(f,'magnetic')&&(l.wallRunLeft??1.4)>0){const remaining=l.wallRunLeft??1.4;f.vy=-240*Math.min(1,remaining/dt);l.wallRunLeft=Math.max(0,remaining-dt);}
 else if(has(f,'climbing')||has(f,'stonemask'))f.vy=0;
};
// Apply flight to velocity BEFORE shared integration/collision, never move twice.
L.flightVelocity=(g,f,inp,dt)=>{if(!f.legacy)return;const l=f.legacy,fx=l.effects,fly=l.gesture&&inp.jumpHeld?l.gesture:['icarus','rockets','glider'].find(id=>fx[id]>0);
 l.flight=null;
 if(f.grounded||f.dead||f.dashRemaining>0||fx.impulse>0||inp.dash||inp.jump||inp.down&&fly!=='icarus'||L.attackTechnique(f)||['stunned','clash','pushed','ultCharge','ultWindup','throwWindup'].includes(f.state)||!has(f,fly)){delete l.glideVelocity;return;}
 if(fly!=='glider'&&l.fuel<=0)return;
 if(fly==='rockets'){f.vy=Math.min(f.vy,Math.max(-590,f.vy-3000*dt));l.fuel=Math.max(0,l.fuel-dt*.6);}
 if(fly==='icarus'){f.vy=((inp.down?1:0)-(inp.up||inp.jumpHeld?1:0))*350*(inp.legacyInverted?-1:1);l.fuel=Math.max(0,l.fuel-dt*.4);}
 if(fly==='glider'){f.vy=Math.min(f.vy,90);const speed=D.stats(f).speed*g.rules.speed+75;l.glideVelocity=inp.move?inp.move*speed:l.glideVelocity??f.vx;f.vx=l.glideVelocity;}
 l.flight=fly;
};
L.afterMove=(g,f,inp,dt)=>{if(!f.legacy||f.dead)return;const l=ensure(f),fx=l.effects;
 if(has(f,'survivorglass')||has(f,'wolftooth')){const b=body(f),near=enemies(g,f).find(t=>t.state==='active'&&!t.attackHit&&!g.bodyContact(t,f)&&polygonSegment(slash(t,g.map.walls).points,{x:f.x,y:f.y-b.top},{x:f.x,y:f.y-b.bottom},b.radius+10));if(near){if(has(f,'survivorglass')&&!l.used.match.survivorglass){l.used.match.survivorglass=true;effect(g,f,'slowTime',f.x,f.y-b.center,{life:.25,factor:.18});}if(has(f,'wolftooth')&&f.dashRemaining>0&&l.lastWolfThreat!==near.id+':'+near.attackId){l.lastWolfThreat=near.id+':'+near.attackId;fx.wolf=.45;effect(g,f,'perfectStep');}}}
 const technique=L.attackTechnique(f);if(technique&&f.state==='active'&&g.time-(technique.lastTrail??-1)>.025){technique.lastTrail=g.time;effect(g,f,'techniqueTrail',f.x,f.y-body(f).center,{points:slash(f,g.map.walls).points,life:.10});}
 if(fx.roundhouse>0&&f.state==='kickActive'){f.kickHit=true;for(const t of enemies(g,f)){if(Math.hypot(t.x-f.x,t.y-f.y)>86||l.roundhouseHits?.includes(t.id)||g.map.walls.some(w=>wallFraction(center(f),center(t),w)<1))continue;(l.roundhouseHits??=[]).push(t.id);push(g,t,Math.sign(t.x-f.x)||f.facing,-.16,630);g.emit('kick',{id:f.id,x:t.x,y:t.y-body(t).center,technique:'roundhouse'});}}
 if(l.grapple){const q=l.grapple.type==='platform'?g.map.platforms[l.grapple.index]:null;if(l.grapple.type==='platform'&&(!q||q.stage==='gone'))l.grapple=null;else if(q){l.grapple.x=q.x+l.grapple.offsetX;l.grapple.y=q.y;}}if(l.grapple){l.grapple.life-=dt;const dx=l.grapple.x-f.x,dy=l.grapple.y-(f.y-body(f).center),len=Math.hypot(dx,dy);if(l.grapple.life<=0||inp.jump||len<35)l.grapple=null;else{f.vx+=dx/(len||1)*1300*dt;f.vy+=dy/(len||1)*1900*dt;f.x+=dx/(len||1)*250*dt;f.y+=dy/(len||1)*250*dt;f.grounded=false;g.collideWalls(f);}}
 if(fx.plunge>0&&!f.grounded)f.vy=Math.max(f.vy,700);
 if(fx.stomp>0){if(f.grounded||['stunned','pushed','clash','dead'].includes(f.state))fx.stomp=0;else for(const t of enemies(g,f))if(Math.abs(t.x-f.x)<45&&t.y>=f.y&&t.y-f.y<100&&!g.map.walls.some(w=>wallFraction(center(f),center(t),w)<1)&&!g.map.platforms.some(p=>p.stage!=='gone'&&p.y>f.y&&p.y<t.y-body(t).top&&t.x>=p.x&&t.x<=p.x+p.w)){push(g,t,0,1,620);f.vy=-650;fx.stomp=0;g.emit('kick',{id:f.id,x:t.x,y:t.y-body(t).center,technique:'stomp'});break;}}
 if(fx.phasing&&f.dashRemaining<=0){fx.phasing=false;if(!free(g,f.x,f.y)&&l.phaseStart)Object.assign(f,l.phaseStart);}
 // Record poses, not hundreds of contour vertices per simulation tick. The
 // original slash routine reconstructs exactly the same geometry on playback.
 if(f.state==='active')for(const e of world(g).entities)if(e.type==='echo'&&e.owner===f.id&&e.sourceAttack===f.attackId&&!e.sourceDone){const s=D.stats(f),profile={kind:L.weaponKind(f)||f.kind,stats:{reach:s.reach,minRange:s.minRange},size:f.admin?.attackScale||1,center:body(f).center,technique:L.attackTechnique(f)?.type||null},key=JSON.stringify(profile);let index=e.profiles.findIndex(p=>JSON.stringify(p)===key);if(index<0){index=e.profiles.length;e.profiles.push(profile);}e.frames.push({at:e.age,x:f.x,y:f.y,aim:f.attackAim,progress:f.stateTime/Math.max(.001,f.duration),profile:index});if(e.age<e.warn)e.points=slash(f,g.map.walls).points;}
};
L.worldStep=(g,dt)=>{const w=world(g);for(const e of w.effects)e.age+=dt;w.effects=w.effects.filter(e=>e.age<e.life);for(const e of [...w.entities]){const f=g.fighters[e.owner];if(!f||e.life<=0)continue;const td=dt*L.timeScale(g,f);e.age+=td;if(e.kind==='companion'){tickCompanion(g,e,f,td);continue;}if(e.type==='portal'){tickPortal(g,e,td);continue;}if(e.type==='weapon'){tickWeapon(g,e,td);continue;}if(e.type==='shambles'){shambles(g,e,f);continue;}
 if(e.type==='krakenArm'){tickKrakenArm(g,e,f);continue;}
 if(e.type==='electriczone'&&e.source!=null){const source=w.entities.find(s=>s.id===e.source&&s.type==='medusa'&&s.age<s.life);if(!source||f.dead||source.stunned>0){e.life=0;continue;}e.x=source.x;e.y=source.y;}
 if(e.type==='blackfire')tickBlackfire(g,e,f);const old={x:e.x,y:e.y};if(!e.zone){if(e.path){const t=clamp((e.age-e.warn)/e.path.duration,0,1),q=L.spectralPoint(e.path,t),previous=L.spectralPoint(e.path,clamp((e.age-td-e.warn)/e.path.duration,0,1));e.vx=td?(q.x-previous.x)/td:0;e.vy=td?(q.y-previous.y)/td:0;e.angle=Math.atan2(e.vy,e.vx);e.x=q.x;e.y=q.y;}if(e.pulledBy!=null){const t=g.fighters[e.pulledBy],p=t&&center(t),n=p&&Math.hypot(p.x-e.x,p.y-e.y);if(!p||n<24){e.pulledBy=null;e.vx=e.vy=0;}else{e.vx=(p.x-e.x)/n*700;e.vy=(p.y-e.y)/n*700;}}if(e.type==='yoyo'){const l=ensure(f),held=l.lastInput?.attackHeld,angle=f.aim,target={x:f.x+Math.cos(angle)*185,y:f.y-body(f).center+Math.sin(angle)*185};if(!held||e.age>1.3)e.life=0;else{e.vx=(target.x-e.x)*10;e.vy=(target.y-e.y)*10;}}if(!e.path){e.x+=e.vx*td;e.y+=e.vy*td;}
 const wall=Math.min(1,...g.map.walls.map(q=>wallFraction(old,e,q)));let terrain=wall<1;for(const q of g.map.platforms)if(q.stage!=='gone'&&(old.y-q.y)*(e.y-q.y)<=0&&Math.abs(e.y-old.y)>.01){const t=(q.y-old.y)/(e.y-old.y),x=old.x+(e.x-old.x)*t;if(x>=q.x&&x<=q.x+q.w)terrain=true;}
 if(terrain||e.range&&e.age*Math.hypot(e.vx,e.vy)>e.range){if(e.type==='shadowbomb'){e.x=old.x;e.y=old.y;e.vx=e.vy=0;}else e.life=0;}if(e.x<0||e.x>g.map.width||e.y>g.map.deathY)e.life=0;
 }if(e.type==='echo'&&e.frames){if(!e.sourceDone&&(f.state!=='active'||f.attackId!==e.sourceAttack)){e.sourceDone=true;e.life=Math.min(e.life,e.warn+e.age);}if(e.age>=e.warn&&e.frames.length){const at=e.age-e.warn;while(e.frames.length>1&&e.frames[1].at<=at+1e-8)e.frames.shift();const frame=e.frames[0];e.x=frame.x;e.y=frame.y-e.profiles[frame.profile].center;e.points=slash({x:frame.x,y:frame.y,attackAim:frame.aim,state:'active',stateTime:frame.progress,duration:1,kind:e.profiles[frame.profile].kind,admin:{}},e.walls,e.profiles[frame.profile]).points;}}
 if(e.life<=0||e.age<e.warn)continue;
 if(e.type==='well'){for(const t of g.fighters)if(!t.dead&&Math.hypot(t.x-e.x,t.y-body(t).center-e.y)<e.r){const tick=dt*Math.min(L.timeScale(g,f),L.timeScale(g,t));if(tick)pullFighter(g,t,(e.x-t.x)*tick*1.6,(e.y-center(t).y)*tick*.7);}for(const p of w.entities)if(p!==e&&looseForceObject(p)&&Math.hypot(p.x-e.x,p.y-e.y)<e.r){const owner=g.fighters[p.owner],tick=dt*Math.min(L.timeScale(g,f),owner?L.timeScale(g,owner):1);p.vx+=(e.x-p.x)*tick*6;p.vy+=(e.y-p.y)*tick*6;}continue;}
 if(e.type==='gust'){const ax=Math.cos(e.angle)*e.force*8*td,ay=Math.sin(e.angle)*e.force*8*td,exposed=p=>Math.hypot(p.x-e.x,p.y-e.y)<e.r&&!g.map.walls.some(q=>wallFraction(e,p,q)<1);for(const t of enemies(g,f))if(exposed(center(t))){t.vx=clamp(t.vx+ax,-700,700);t.vy=clamp(t.vy+ay,-900,1100);if(ay<0){t.grounded=false;t.platform=-1;}}for(const p of w.entities)if(p!==e&&!p.zone&&p.kind!=='companion'&&!p.carrier&&p.age<p.life&&exposed(p)){p.vx+=ax;p.vy+=ay;}continue;}
 if(e.type==='erase'){eraseSpace(g,e);continue;}
 if(mimicIntercept(g,e,old))continue;if(['smoke','shadowbomb','ice'].includes(e.type))continue;projectileSummons(g,e,old);if(e.life<=e.age)continue;
 for(const t of g.fighters){if(['beam','lightning','repulse'].includes(e.type)){const b=body(t),blocked=e.type==='repulse'&&g.map.walls.some(w=>wallFraction(e,center(t),w)<1);if(!blocked&&segmentDistance(e,e.to,{x:t.x,y:t.y-b.top},{x:t.x,y:t.y-b.bottom})<=b.radius+e.r)abilityHit(g,e,t,{x:e.x,y:e.y},true);}else if(e.type!=='echo'&&!(e.type==='electriczone'&&g.map.walls.some(w=>wallFraction(e,center(t),w)<1)))abilityHit(g,e,t,e.type==='electriczone'?{x:e.x,y:e.y}:old);}
 if(e.type==='lightning'&&e.hits.length&&!e.arcShown){e.arcShown=true;effect(g,f,'lightningArc',e.x,e.y,{to:e.to,life:.16});}
 if(e.type==='lightning'&&!e.chainDone&&!e.blocked&&e.hits.length){e.chainDone=true;const from=g.fighters[e.hits[0]],visited=[...(e.visited||[]),from.id];if(visited.length<3){const p=center(from),next=enemies(g,f).filter(t=>!visited.includes(t.id)&&Math.hypot(t.x-p.x,t.y-body(t).center-p.y)<200).sort((a,b)=>Math.hypot(a.x-p.x,a.y-body(a).center-p.y)-Math.hypot(b.x-p.x,b.y-body(b).center-p.y)).find(t=>{const q=center(t);return !raySurface(g,p,Math.atan2(q.y-p.y,q.x-p.x),Math.hypot(q.x-p.x,q.y-p.y));});if(next)entity(g,f,'lightning',{...p,to:center(next),target:next.id,visited,zone:true,r:9,life:.25,warn:.14});}}
 if(e.type==='echo'&&e.points)for(const t of g.fighters){if(t.dead||!hostile(g,e.owner,t)||e.hits.includes(t.id))continue;const b=body(t);if(polygonSegment(e.points,{x:t.x,y:t.y-b.top},{x:t.x,y:t.y-b.bottom},b.radius))abilityHit(g,e,t,{x:e.x,y:e.y},true);}
 }w.entities=w.entities.filter(e=>e.age<e.life);if(g.legacyRewind){g.legacyRewind=false;const kept=g.fighters.map(f=>f.legacy?{used:clone(f.legacy.used),consumed:[...f.legacy.consumed],bindings:clone(f.legacy.bindings||{})}:null);const snap=g.legacyRoundStart;g.loadSnapshot(snap);g.legacyRoundStart=snap;g.fighters.forEach((f,i)=>{if(kept[i]&&f.legacy)Object.assign(f.legacy,kept[i]);});g.emit('legacyRewind');}
};
function tickPortal(g,e,dt){const sync=p=>{if(!p.surface)return true;const s=p.surface==='wall'?g.map.walls[p.index]:g.map.platforms[p.index];if(!s||s.stage==='gone'){p.life=0;return false;}p.offsetX??=p.x-s.x;p.offsetY??=p.y-s.y;p.x=s.x+p.offsetX;p.y=s.y+p.offsetY;return true;};if(!sync(e)||e.age<.1||e.age>=e.life)return;const pair=world(g).entities.find(t=>t!==e&&t.type==='portal'&&t.owner===e.owner&&t.age>=.1&&t.life>t.age);if(!pair||!sync(pair))return;const nx=Math.cos(e.angle),ny=Math.sin(e.angle),ox=Math.cos(pair.angle),oy=Math.sin(pair.angle),rotation=pair.angle-e.angle+Math.PI;
 const enters=(p,extent,tangent)=>{const x=p.x-e.x,y=p.y-e.y,n=x*nx+y*ny;return (p.vx||0)*nx+(p.vy||0)*ny<=.01&&n>=-4&&n<=extent+6&&Math.abs(-x*ny+y*nx)<=38+tangent;},rotate=p=>{const vx=p.vx||0,vy=p.vy||0;p.vx=vx*Math.cos(rotation)-vy*Math.sin(rotation);p.vy=vx*Math.sin(rotation)+vy*Math.cos(rotation);if(Number.isFinite(p.angle))p.angle=Math.atan2(p.vy,p.vx);p.portalUntil=g.time+.25;};
 for(const f of g.fighters){if(f.dead||(f.portalUntil||0)>g.time||!enters({...center(f),vx:f.vx,vy:f.vy},portalExtent(f,nx,ny),body(f).radius))continue;const gap=portalExtent(f,ox,oy)+9,x=pair.x+ox*gap,y=pair.y+oy*gap;if(!portalClear(g,x,y,f))continue;f.x=x;f.y=y+body(f).center;f.grounded=false;f.platform=-1;rotate(f);const technique=L.attackTechnique(f);if(technique){technique.angle+=rotation;f.attackAim+=rotation;technique.from=center(f);technique.lastTrail=g.time;}if(f.dashRemaining>0){const x=f.dashX,y=f.dashY;f.dashX=x*Math.cos(rotation)-y*Math.sin(rotation);f.dashY=x*Math.sin(rotation)+y*Math.cos(rotation);}effect(g,f,'portalTransit',x,y,{life:.2});}
 for(const p of world(g).entities){if(p.zone||p.kind==='companion'&&!p.portalCompatible||p.carrier||p.age>=p.life||(p.portalUntil||0)>g.time||!enters(p,p.r||8,p.r||8))continue;const gap=(p.r||8)+9,x=pair.x+ox*gap,y=pair.y+oy*gap;if(!portalClear(g,x,y,null,p.r||8))continue;p.x=x;p.y=y;p.path=null;rotate(p);if(p.type==='weapon'&&p.mode==='dropped')p.mode='flying';}
}
function tickWeapon(g,e,dt){const owner=g.fighters[e.originalOwner];if(!owner)return;const old={x:e.x,y:e.y};if(e.carrier){const c=world(g).entities.find(t=>t.id===e.carrier);if(c&&c.life>c.age){e.x=c.x;e.y=c.y+18;return;}e.carrier=null;e.mode='dropped';}
 if(e.mode==='fetch'||e.mode==='return'){const f=e.mode==='fetch'?g.fighters[e.fetch]:owner,p=center(f),dx=p.x-e.x,dy=p.y-e.y,n=Math.hypot(dx,dy);if(n<28){if(f.id===owner.id){ensure(owner).effects.weaponAway=false;e.life=0;}else{e.mode='dropped';e.vx=e.vy=0;}return;}e.vx=dx/n*1100;e.vy=dy/n*1100;}
 if(e.mode==='dropped')e.vy+=1980*g.rules.gravity*dt;e.x+=e.vx*dt;e.y+=e.vy*dt;const wall=Math.min(1,...g.map.walls.map(w=>wallFraction(old,e,w)));if(wall<1){e.x=old.x;e.y=old.y;e.vx=0;e.vy=80;e.mode='dropped';}for(const p of g.map.platforms)if(p.stage!=='gone'&&e.x>=p.x&&e.x<=p.x+p.w&&old.y<=p.y&&e.y>=p.y){e.y=p.y-3;e.vy=e.vx=0;e.mode='dropped';}
 if(['flying','return'].includes(e.mode)){if(mimicIntercept(g,e,old))return;projectileSummons(g,e,old);if(['flying','return'].includes(e.mode))for(const t of g.fighters){abilityHit(g,e,t,old);if(e.mode==='dropped')break;}}
 if(e.mode==='dropped'&&Math.hypot(owner.x-e.x,owner.y-35-e.y)<55&&e.age>.35){ensure(owner).effects.weaponAway=false;e.life=0;g.emit('daggerPickup',{id:owner.id});}
 if(e.y>g.map.deathY||e.x<0||e.x>g.map.width){const p=g.daggerSafe(e.x,e.y);e.x=p.x;e.y=p.y;e.mode='dropped';e.vx=e.vy=0;}
}
// Companions are physical, serializable entities; each identity has a distinct behaviour.
const summonIds=Object.values(L.catalog).filter(c=>c.category==='summon').map(c=>c.id);
function spawnCompanions(g,f,only){for(const id of summonIds){if(!has(f,id)||only&&id!==only)continue;const count=id==='legion'?3:1;for(let n=0;n<count;n++){if(id==='legion'&&ensure(f).legionFallen?.includes(n))continue;if(world(g).entities.some(e=>e.owner===f.id&&e.type===id&&e.kind==='companion'&&e.slot===n&&e.age<e.life))continue;entity(g,f,id,{kind:'companion',slot:n,life:1e9,r:id==='slimeking'?38:id==='mahoraga'?29:15,lethal:!(id==='legion'&&n>0)&&!['raven','slime','beetle','fairy','hound','lantern','monkey','toad','mimic','necromancer'].includes(id),phase:id==='spectral'?'hidden':'follow',due:.8+n*.6,attack:0,health:1,history:[],parryable:true,...(id==='kraken'?{x:-115,y:g.map.height*.55,r:145,lethal:false}:{})});}}if((!only||only==='necromancer')&&has(f,'necromancer')&&ensure(f).servantKind&&!world(g).entities.some(e=>e.owner===f.id&&e.type==='servant'&&e.age<e.life))spawnServant(g,f,ensure(f).servantKind,f.x-60,f.y);}
const groundCompanions=new Set(['slime','hound','monkey','toad','skeleton','mimic','mahoraga','slimeking','legion','servant']);
function dropCarried(g,e){for(const w of [...world(g).entities,...g.fighters.map(f=>f.dagger).filter(Boolean)])if(w.carrier===e.id){w.carrier=null;w.mode='dropped';w.x=e.x;w.y=e.y;w.vx=0;w.vy=0;}e.carry=null;}
function companionMove(g,e,x,y,speed,dt){const ground=groundCompanions.has(e.type),old={x:e.x,y:e.y};e.hopWait=Math.max(0,(e.hopWait||0)-dt);e.vx=clamp((x-e.x)*5,-speed,speed);
 if(ground){const support=g.map.platforms[e.platform];if(e.grounded&&support?.stage!=='gone'){e.x+=support?.dx||0;e.y+=support?.dy||0;}const dir=Math.sign(x-e.x),ahead=e.x+dir*(e.r+35),ledge=e.grounded&&!g.map.platforms.some(p=>p.stage!=='gone'&&ahead>=p.x&&ahead<=p.x+p.w&&Math.abs(p.y-e.y-e.r)<12),wall=g.map.walls.some(w=>Math.abs((dir>0?w.x:w.x+w.w)-e.x)<e.r+25&&e.y+e.r>w.y&&e.y-e.r<w.y+w.h);
 if(e.grounded&&e.hopWait<=0&&(y<e.y-28||ledge||wall)){e.vy=-(e.type==='slime'?370:e.type==='monkey'?720:600);e.grounded=false;e.hopWait=.7;}e.vy+=1980*g.rules.gravity*dt;
 }else e.vy=clamp((y-e.y)*5,-speed,speed);
 e.x=clamp(e.x+e.vx*dt,e.r,g.map.width-e.r);e.y+=e.vy*dt;e.grounded=false;e.platform=-1;
 if(ground&&e.vy>=0)for(let i=0;i<g.map.platforms.length;i++){const p=g.map.platforms[i];if(p.stage==='gone'||e.x+e.r<p.x||e.x-e.r>p.x+p.w||old.y+e.r>p.y+.8||e.y+e.r<p.y)continue;e.y=p.y-e.r;e.vy=0;e.grounded=true;e.platform=i;break;}
 for(const w of g.map.walls){if(e.x+e.r<=w.x||e.x-e.r>=w.x+w.w||e.y+e.r<=w.y||e.y-e.r>=w.y+w.h)continue;if(old.x+e.r<=w.x+.1){e.x=w.x-e.r;e.vx=0;}else if(old.x-e.r>=w.x+w.w-.1){e.x=w.x+w.w+e.r;e.vx=0;}else if(old.y+e.r<=w.y+.1){e.y=w.y-e.r;e.vy=0;e.grounded=ground;}else if(old.y-e.r>=w.y+w.h-.1){e.y=w.y+w.h+e.r;e.vy=0;}else{e.x=Math.abs(e.x-w.x)<Math.abs(e.x-w.x-w.w)?w.x-e.r:w.x+w.w+e.r;e.vx=0;}}
 if(e.y>g.map.deathY){dropCarried(g,e);if(e.type==='skeleton'){e.deadUntil=g.time+6;e.x=g.fighters[e.owner].x;e.y=g.fighters[e.owner].y-e.r;e.vy=0;}else{if(e.type==='legion'){const fallen=ensure(g.fighters[e.owner]).legionFallen??=[];if(!fallen.includes(e.slot))fallen.push(e.slot);}e.life=0;}}
 return old;
}

function clearLine(g,from,to){const d=Math.hypot(to.x-from.x,to.y-from.y);return d<.001||!raySurface(g,from,Math.atan2(to.y-from.y,to.x-from.x),d-.01);}
function toadObjects(g){return [...world(g).entities.filter(o=>looseObject(o)&&o.pulledBy==null&&(o.type!=='weapon'||o.mode==='dropped')),...g.fighters.filter(f=>f.dagger?.mode==='dropped'&&!f.dagger.carrier).map(f=>({...f.dagger,type:'classdagger',nativeOwner:f.id,r:5}))];}
function toadFetch(g,o,f){if(o.type==='classdagger'){const p=g.fighters[o.nativeOwner]?.dagger;if(p){p.mode='fetch';p.fetchOwner=f.id;}}else pullObject(o,f);}
function toadTongue(g,e,preview=false){if(!['tongueWindup','tongueOut','tongueBack'].includes(e.phase))return null;const from={x:e.x,y:e.y-3},length=240*(preview?1:clamp(e.extension||0,0,1)),a=e.aim||0,to=raySurface(g,from,a,length)||{x:from.x+Math.cos(a)*length,y:from.y+Math.sin(a)*length};return{from,to,r:4};}
function tickToad(g,e,f,dt){
 if(e.stunned>0){e.phase='follow';e.extension=0;e.due=Math.max(e.due,2);}
 const engaged=['tongueWindup','tongueOut','tongueBack'].includes(e.phase);companionMove(g,e,engaged?e.x:f.x-f.facing*65,engaged?e.y:f.y-e.r,engaged?0:130,dt);
 if(e.life<=e.age||e.stunned>0)return;
 if(e.phase==='tongueWindup'){e.warnLeft=Math.max(0,e.warnLeft-dt);if(!e.warnLeft){e.phase='tongueOut';e.extension=0;}return;}
 if(e.phase==='tongueBack'){e.extension=Math.max(0,e.extension-dt/.16);if(!e.extension)e.phase='follow';return;}
 if(e.phase==='tongueOut'){
  e.extension=Math.min(1,e.extension+dt/.12);const line=toadTongue(g,e),candidates=[];
  for(const t of enemies(g,f)){const b=body(t);if(segmentDistance(line.from,line.to,{x:t.x,y:t.y-b.top},{x:t.x,y:t.y-b.bottom})<=b.radius+line.r&&clearLine(g,line.from,center(t)))candidates.push({actor:t,d:Math.hypot(t.x-e.x,center(t).y-e.y)});}
  for(const o of toadObjects(g))if(segmentDistance(line.from,line.to,o,o)<=line.r+(o.r||6)&&clearLine(g,line.from,o))candidates.push({object:o,d:Math.hypot(o.x-e.x,o.y-e.y)});
  const hit=candidates.sort((a,b)=>a.d-b.d)[0];if(hit){if(hit.object)toadFetch(g,hit.object,f);else{const t=hit.actor;e.blocked=false;abilityHit(g,e,t,line.from,true);if(!e.blocked){e.phase='tongueBack';}else{e.extension=0;return;}}
   e.phase='tongueBack';effect(g,f,'tongueCatch',line.to.x,line.to.y,{life:.16});
  }else if(e.extension===1)e.phase='tongueBack';return;
 }
 if(e.due>0)return;const from={x:e.x,y:e.y-3},object=toadObjects(g).filter(o=>Math.hypot(o.x-from.x,o.y-from.y)<=240&&clearLine(g,from,o)).sort((a,b)=>Math.hypot(a.x-from.x,a.y-from.y)-Math.hypot(b.x-from.x,b.y-from.y))[0],target=object||enemies(g,f).map(center).find(p=>Math.hypot(p.x-from.x,p.y-from.y)<=240&&clearLine(g,from,p));
 if(target){e.aim=Math.atan2(target.y-from.y,target.x-from.x);e.phase='tongueWindup';e.warnLeft=.3;e.extension=0;e.hits=[];e.due=4;}
}
const mimicFood=new Set(['arrow','spectralArrow','kunai','pellet','trigger','fireball','shadowbomb','weapon']);
function daggerProxy(f,to=f.dagger){return{...f.dagger,x:to.x,y:to.y,type:'weapon',id:'dagger:'+f.id,owner:f.id,originalOwner:f.id,age:0,life:1e9,r:5,lethal:true,parryable:true,hits:[]};}
function mimicMouth(e){const side=e.facing||1;return{from:{x:e.x+side*20,y:e.y-4},to:{x:e.x+side*46,y:e.y-4},r:12};}
function edible(e){return !e.zone&&e.kind!=='companion'&&!e.carrier&&e.age<e.life&&mimicFood.has(e.type)&&(e.type!=='weapon'||['flying','return'].includes(e.mode));}
function mimicIntercept(g,p,old){if(!edible(p))return false;const candidates=[];
 for(const e of world(g).entities){const owner=g.fighters[e.owner];if(e.type!=='mimic'||e.age>=e.life||!owner||owner.dead||!hostile(g,p.owner,owner)||e.phase!=='mouthOpen'||e.stunned>0||e.fired||L.timeScale(g,owner)<=0)continue;const m=mimicMouth(e);
  if((old.x-e.x)*(e.facing||1)<0||segmentDistance(old,p,m.from,m.to)>m.r+(p.r||6)||!clearLine(g,old,m.from))continue;
  const r=m.r+(p.r||6),fraction=wallFraction(old,p,{x:Math.min(m.from.x,m.to.x)-r,y:m.from.y-r,w:Math.abs(m.to.x-m.from.x)+r*2,h:r*2});candidates.push({e,fraction});
 }
 const e=candidates.sort((a,b)=>a.fraction-b.fraction)[0]?.e;if(!e)return false;e.fired=true;e.phase='chew';e.releaseLeft=.65;e.warnLeft=0;
 if(p.type==='weapon'){p.carrier=e.id;e.carry=p.id;p.mode='carried';p.x=e.x;p.y=e.y;p.vx=p.vy=0;p.path=null;}else p.life=0;
 effect(g,g.fighters[e.owner],'mimicCatch',e.x,e.y,{life:.2});return true;
}
L.daggerCarry=(g,owner,p,dt)=>{
 if(!g.legacyEnabled)return false;
 if(p.carrier){const e=world(g).entities.find(e=>e.id===p.carrier&&e.age<e.life&&!g.fighters[e.owner]?.dead);if(e){p.x=e.x;p.y=e.y;p.vx=p.vy=0;return true;}p.carrier=null;p.mode='dropped';p.pickup=.2;}
 if(p.mode!=='fetch')return false;const f=g.fighters[p.fetchOwner];if(!f||f.dead){p.mode='dropped';p.vx=p.vy=0;return false;}const q=center(f),dx=q.x-p.x,dy=q.y-p.y,n=Math.hypot(dx,dy);
 if(n<24){if(f.id===owner.id){owner.dagger=null;owner.ultMode='';g.emit('daggerPickup',{id:owner.id,x:owner.x,y:owner.y});}else{p.mode='dropped';p.vx=p.vy=0;p.pickup=.2;}return true;}
 p.vx=dx/n*700;p.vy=dy/n*700;const hit=raySurface(g,p,Math.atan2(dy,dx),Math.min(n,700*dt));if(hit){p.x=hit.x-Math.sign(dx)*2;p.y=hit.y-Math.sign(dy)*2;p.mode='dropped';p.vx=p.vy=0;p.pickup=.2;return true;}return false;
};
L.daggerIntercept=(g,owner,p,from,to)=>{if(!g.legacyEnabled||p.mode!=='flying')return false;const proxy=daggerProxy(owner,to);
 if(mimicIntercept(g,proxy,from)){Object.assign(p,{x:proxy.x,y:proxy.y,carrier:proxy.carrier,mode:'carried',vx:0,vy:0,pickup:.2});return true;}
 projectileSummons(g,proxy,from);if(proxy.mode==='dropped'){p.mode='dropped';p.vx=p.vy=0;p.pickup=.2;}return false;
};
function tickMimic(g,e,f,dt){
 if(e.carry){e.releaseLeft=Math.max(0,(e.releaseLeft||0)-dt);if(!e.releaseLeft||e.stunned>0)dropCarried(g,e);}
 if(e.stunned>0){e.phase='follow';e.due=Math.max(e.due,2);e.warnLeft=0;}
 const engaged=['mouthWindup','mouthOpen','chew'].includes(e.phase);companionMove(g,e,engaged?e.x:f.x-f.facing*60,engaged?e.y:f.y-e.r,engaged?0:180,dt);if(e.life<=e.age||e.stunned>0)return;
 if(e.phase==='chew'){if(!e.carry){e.releaseLeft=Math.max(0,(e.releaseLeft||0)-dt);if(!e.releaseLeft)e.phase='follow';}return;}
 if(e.phase==='mouthWindup'){e.warnLeft=Math.max(0,e.warnLeft-dt);if(!e.warnLeft){e.phase='mouthOpen';e.openLeft=.4;}return;}
 if(e.phase==='mouthOpen'){e.openLeft=Math.max(0,e.openLeft-dt);if(!e.openLeft){e.phase='follow';return;}const m=mimicMouth(e);for(const t of enemies(g,f)){const b=body(t);if((t.x-e.x)*(e.facing||1)<0||segmentDistance(m.from,m.to,{x:t.x,y:t.y-b.top},{x:t.x,y:t.y-b.bottom})>m.r+b.radius||!clearLine(g,e,center(t)))continue;e.freeze=.22;e.hits=[];e.blocked=false;abilityHit(g,e,t,e,true);e.fired=true;if(!e.blocked){e.phase='chew';e.releaseLeft=.35;}break;}return;}
 if(e.due>0)return;const target=enemies(g,f).map(center).find(p=>Math.hypot(p.x-e.x,p.y-e.y)<95&&clearLine(g,e,p))||[...world(g).entities,...g.fighters.filter(f=>f.dagger).map(f=>daggerProxy(f))].find(p=>edible(p)&&hostile(g,p.owner,f)&&Math.hypot(p.x-e.x,p.y-e.y)<260&&(e.x-p.x)*p.vx+(e.y-p.y)*p.vy>0&&clearLine(g,e,p));
 if(target){e.facing=Math.sign(target.x-e.x)||f.facing;e.phase='mouthWindup';e.warnLeft=.25;e.fired=false;e.hits=[];e.due=5;}
}
function tickSlimeKing(g,e,f,target,dt){const generation=e.generation||0;
 if(e.phase==='compress'){companionMove(g,e,e.x,e.y,0,dt);e.warnLeft=Math.max(0,e.warnLeft-dt);if(e.warnLeft<=0){const impulse=680-generation*65,gravity=Math.max(1,1980*g.rules.gravity),flight=2*impulse/gravity;e.jumpVx=clamp((e.smashX-e.x)/flight,-410,410);e.vy=-impulse;e.grounded=false;e.platform=-1;e.hopWait=2;e.phase='leap';e.airLeft=5;e.hits=[];}return;}
 if(e.phase==='leap'){e.airLeft-=dt;const old=companionMove(g,e,e.x+e.jumpVx/5,e.y,Math.abs(e.jumpVx),dt),descending=e.vy>=0;
  if(descending&&e.stunned<=0)for(const t of enemies(g,f)){if(g.map.walls.some(w=>wallFraction(e,center(t),w)<1))continue;if(abilityHit(g,e,t,old)){e.phase='recover';e.recoverLeft=.65;break;}}
  if(e.grounded||e.airLeft<=0||e.stunned>0){if(e.grounded)effect(g,f,'slimeLanding',e.x,e.y+e.r,{r:e.r*1.2,life:.2});e.phase='recover';e.recoverLeft=.65;e.attack=0;e.jumpVx=0;}return;}
 if(e.phase==='recover'||e.phase==='return'||e.stunned>0){e.recoverLeft=Math.max(0,(e.recoverLeft||0)-dt);companionMove(g,e,e.x,e.y,0,dt);if(e.recoverLeft<=0&&e.stunned<=0)e.phase='follow';return;}
 const dist=Math.hypot(target.x-e.x,target.y-e.y-e.r);companionMove(g,e,dist<420?e.x:f.x-f.facing*(70+generation*25),f.y-e.r,170+generation*30,dt);
 if(e.grounded&&e.due<=0&&dist<420){e.phase='compress';e.warnLeft=.48-generation*.06;e.smashX=clamp(target.x,e.r,g.map.width-e.r);e.smashY=target.y;e.due=3.4;e.attack=0;}
}
function hunterRetreat(e){e.phase='retreat';e.prey=null;e.warnLeft=0;e.attack=0;e.huntLeft=0;e.due=6;}
function tickHunter(g,e,f,target,dt){e.r=45;const home=()=>({x:e.entrySide<0?-70:g.map.width+70,y:clamp(e.homeY??center(f).y-120,70,g.map.deathY-150)});
 if(!['watch','mark','hunt','retreat'].includes(e.phase)){e.phase='watch';e.entrySide=target.x<g.map.width/2?-1:1;e.homeY=center(target).y-120;Object.assign(e,home());}
 if(e.phase==='retreat'){const p=home(),dx=p.x-e.x,dy=p.y-e.y,n=Math.hypot(dx,dy),distance=Math.min(n,850*dt);if(n>0){e.x+=dx/n*distance;e.y+=dy/n*distance;}if(n<12)e.phase='watch';return;}
 if(e.phase==='watch'){if(e.due>0)return;e.prey=target.id;e.entrySide=target.x<g.map.width/2?-1:1;e.homeY=center(target).y-120;Object.assign(e,home());e.phase='mark';e.warnLeft=1;e.hits=[];return;}
 const prey=g.fighters[e.prey];if(!prey||prey.dead||!hostile(g,e.owner,prey)){hunterRetreat(e);return;}
 if(e.phase==='mark'){e.warnLeft=Math.max(0,e.warnLeft-dt);if(e.warnLeft<=0){e.phase='hunt';e.huntLeft=2.5;}return;}
 if(e.stunned>0||e.huntLeft<=0){hunterRetreat(e);return;}e.huntLeft-=dt;const old={x:e.x,y:e.y},p=center(prey),a=Math.atan2(p.y-e.y,p.x-e.x),distance=Math.min(Math.hypot(p.x-e.x,p.y-e.y),710*dt);e.vx=Math.cos(a)*710;e.vy=Math.sin(a)*710;e.x+=Math.cos(a)*distance;e.y+=Math.sin(a)*distance;
 if(g.map.walls.some(w=>wallFraction(old,e,w)<1)){e.x=old.x;e.y=old.y;hunterRetreat(e);return;}
 if(!g.map.walls.some(w=>wallFraction(e,center(prey),w)<1)&&abilityHit(g,e,prey,old))hunterRetreat(e);
}
function syncSlime(g,e,dt){if(e.attachedTo==null)return false;const t=g.fighters[e.attachedTo];e.attachLeft=Math.max(0,(e.attachLeft||0)-dt);if(!t||t.dead||e.attachLeft<=0){e.attachedTo=null;e.phase='return';e.due=Math.max(e.due,2);e.vx=e.vy=0;return false;}const b=body(t);e.x=t.x+e.attachSide*(b.radius+5);e.y=t.y-b.bottom-8;e.grounded=false;e.platform=-1;ensure(t).effects.slimeSlow=Math.max(ensure(t).effects.slimeSlow||0,.08);return true;}
function tickSlime(g,e,f,dt){if(e.attachedTo!=null)return;const p={x:f.x-f.facing*45,y:f.y-e.r},old=companionMove(g,e,p.x,p.y,120,dt);if(e.phase==='return'&&Math.hypot(e.x-p.x,e.y-p.y)<45)e.phase='follow';if(e.due>0||e.stunned>0)return;for(const t of enemies(g,f))if(touch(g,e,t,old)&&!g.map.walls.some(w=>wallFraction(e,center(t),w)<1)){e.hits=[];abilityHit(g,e,t,old,true);break;}}
function tickMedusa(g,e,f,dt){const p=center(f);companionMove(g,e,p.x+f.facing*100,p.y-32+Math.sin(e.age*1.4)*12,75,dt);let pulse=world(g).entities.find(p=>p.id===e.pulse&&p.age<p.life);if(!pulse&&e.due<=0&&e.stunned<=0){pulse=entity(g,f,'electriczone',{x:e.x,y:e.y,source:e.id,zone:true,r:115,warn:.6,life:1.65,piercing:true,parryable:false});e.pulse=pulse.id;e.due=4.8;}
 e.attack=0;e.warnLeft=pulse?Math.max(0,pulse.warn-pulse.age):0;e.phase=!pulse?'follow':e.warnLeft>0?'charging':'discharging';}
function tickLantern(g,e,f,target,dt){e.markLeft=Math.max(0,(e.markLeft||0)-dt);e.scan=Math.max(0,(e.scan||0)-dt);if(e.markLeft<=0||g.fighters[e.markTarget]?.dead)e.markTarget=null;
 if(e.due<=0&&Math.hypot(target.x-e.x,target.y-body(target).center-e.y)<700){e.markTarget=target.id;e.markLeft=2;e.scan=.28;e.due=4.5;}
 const p=center(f),a=e.age*1.8+e.id;companionMove(g,e,p.x+Math.cos(a)*48,p.y-25+Math.sin(a)*28,160,dt);}

function legionShield(e){if(e.type!=='legion'||e.slot!==2||e.age>=e.life||e.shieldCd>0||e.stunned>0||!e.fighter)return null;const a=e.fighter,p=center(a),x=a.x+a.facing*25;return{from:{x,y:p.y-37},to:{x,y:p.y+37},side:a.facing};}
function legionBlock(g,e,threat,attacker){const shield=legionShield(e);if(!shield||!threat.parryable||Math.sign(threat.origin.x-shield.from.x)!==shield.side)return false;const s=threat.shape,hit=s.points?polygonSegment(s.points,shield.from,shield.to,5):segmentDistance(s.from,s.to,shield.from,shield.to)<=5+s.r;if(!hit)return false;e.shieldCd=2.8;e.shieldFlash=.18;effect(g,g.fighters[e.owner],'legionBlock',shield.from.x,(shield.from.y+shield.to.y)/2,{life:.2});g.emit('clash',{kind:'knight',x:shield.from.x,y:(shield.from.y+shield.to.y)/2});if(attacker&&!g.legacyThreat){attacker.attackHit=true;g.setState(attacker,'clash',.12);}return true;}
function legionProtect(g,f,a){if(!a)return false;const threat=pendingStrike(g,f,a);return world(g).entities.some(e=>e.owner===f.id&&e.type==='legion'&&e.slot===2&&Math.hypot(e.x-f.x,e.y-f.y)<165&&legionBlock(g,e,threat,g.legacyThreat?null:a));}
function tickLegion(g,e,f,target,dt){const a=summonActor(e,f);a.summonType='legion';a.summonRole=e.slot;e.lethal=e.slot===0;e.shieldCd=Math.max(0,(e.shieldCd||0)-dt);e.shieldFlash=Math.max(0,(e.shieldFlash||0)-dt);
 if(e.slot===0){tickServant(g,e,f,target,dt);return;}
 a.anim+=dt;a.stateTime+=dt;e.observe=(e.observe||0)-dt;if(e.observe<=0){e.observe=.18;e.seen={x:target.x,y:target.y,state:target.state};}const seen=e.seen||target,p=center(a),q={x:seen.x,y:seen.y-body(target).center},dx=q.x-p.x,dy=q.y-p.y,dist=Math.hypot(dx,dy),side=Math.sign(dx)||a.facing;
 a.aim=Math.atan2(dy,dx);a.facing=side;
 if(e.slot===2){a.state=e.stunned>0?'stunned':'idle';e.phase=e.shieldCd>0?'shieldRecovery':'guard';e.attack=0;e.points=[];companionMove(g,e,f.x+side*85,f.y-e.r,e.stunned>0?0:210*g.rules.speed,dt);summonActor(e,f);return;}
 if(e.stunned>0&&a.state!=='stunned')servantState(e,'stunned',e.stunned);
 if(a.duration&&a.stateTime>=a.duration){if(a.state==='startup'){const from=center(a);projectile(g,f,'spectralArrow',a.attackAim,{...from,speed:590,r:5,life:1.25,source:e.id});e.due=2.2;servantState(e,'recovery',.55/g.rules.attackSpeed);}else servantState(e,'idle');}
 const idle=a.state==='idle',desired=dist>350?seen.x-side*280:dist<180?a.x-side*80:a.x;companionMove(g,e,idle?desired:e.x,idle?target.y-e.r:e.y,idle?185*g.rules.speed:0,dt);summonActor(e,f);
 if(idle&&e.due<=0&&dist>80&&dist<570&&!g.map.walls.some(w=>wallFraction(center(a),q,w)<1)){a.attackAim=a.aim;e.hits=[];servantState(e,'startup',.52/g.rules.attackSpeed);}
 e.warnLeft=a.state==='startup'?Math.max(0,a.duration-a.stateTime):0;e.attack=0;e.points=[];
}
function spawnServant(g,f,kind,x=f.x-60,y=f.y){const r=body(f).radius;return entity(g,f,'servant',{kind:'companion',fighterKind:kind,x,y:y-r,r,life:1e9,attack:0,due:.3,lethal:true,health:1,history:[],phase:'follow'});}
function summonActor(e,f){const a=e.fighter??=Object.assign(D.makeFighter(10000+e.id,e.fighterKind||'knight',f.color,{x:e.x,y:e.y+e.r}),{skin:'default',admin:{},ultMode:'',specialCharge:0});Object.assign(a,{x:e.x,y:e.y+e.r,vx:e.vx,vy:e.vy,grounded:!!e.grounded});return a;}
function servantState(e,state,duration=0){e.fighter.state=state;e.fighter.duration=duration;e.fighter.stateTime=0;e.phase=state==='active'?'attack':'follow';e.attack=state==='active'?duration:0;}
function tickServant(g,e,f,target,dt){
 const a=summonActor(e,f),s=e.type==='skeleton'?{...D.stats(a),speed:220,startup:.40,active:.15,recovery:.55}:D.stats(a);a.summonType=e.type;a.anim+=dt;a.stateTime+=dt;e.observe=(e.observe||0)-dt;
 if(e.observe<=0){e.observe=.16;e.seen={x:target.x,y:target.y,state:target.state};}
 const seen=e.seen||target,dx=seen.x-a.x,dy=seen.y-a.y,dist=Math.hypot(dx,dy);a.aim=Math.atan2(dy,dx);a.facing=Math.cos(a.aim)<0?-1:1;
 if(e.stunned>0){if(a.state!=='stunned')servantState(e,'stunned',e.stunned);}
 if(a.duration&&a.stateTime>=a.duration){if(a.state==='startup')servantState(e,'active',s.active/g.rules.attackSpeed);else if(a.state==='active')servantState(e,'recovery',s.recovery/g.rules.attackSpeed*g.rules.attackRecovery);else servantState(e,'idle');}
 const idle=a.state==='idle',desired=dist>s.reach*.85?target.x:a.x;
 companionMove(g,e,idle?desired:e.x,target.y-e.r,idle?s.speed*.8*g.rules.speed:0,dt);summonActor(e,f);
 if(idle&&e.due<=0&&dist<s.reach+8&&Math.abs(dy)<s.reach){a.attackAim=a.aim;a.attackId=(a.attackId||0)+1;a.punch=1-(a.punch||0);e.hits=[];e.due=.25;servantState(e,'startup',s.startup/g.rules.attackSpeed);}
 e.warnLeft=a.state==='startup'?Math.max(0,a.duration-a.stateTime):0;e.points=a.state==='active'?slash(a,g.map.walls).points:[];
 if(e.type==='legion'){companionCut(g,e,f);if(e.stunned>0){servantState(e,'stunned',e.stunned);e.points=[];}return;}
 if(e.points.length)for(const t of enemies(g,f)){const b=body(t);if(!polygonSegment(e.points,{x:t.x,y:t.y-b.top},{x:t.x,y:t.y-b.bottom},b.radius))continue;abilityHit(g,e,t,center(a),true);if(e.stunned>0){e.stunned=g.rules.stun/1000;servantState(e,'stunned',e.stunned);e.points=[];break;}}
}
function companionCut(g,e,f,geometry=null){
 const a=e.fighter;e.points=a?.state==='active'&&e.stunned<=0?slash(a,g.map.walls,geometry).points:[];if(!e.points.length)return;
 for(const t of enemies(g,f))if(t.state==='active'&&polygonsIntersect(e.points,slash(t,g.map.walls).points)){e.blockedAttack=a.attackId;e.stunned=.16;e.points=[];g.setState(t,'clash',.16);t.attackHit=true;g.emit('clash',{kind:t.kind,kinds:[t.kind,a.kind],x:e.x,y:e.y});g.hitstop=.04;return;}
 for(const t of enemies(g,f)){const b=body(t);if(!polygonSegment(e.points,{x:t.x,y:t.y-b.top},{x:t.x,y:t.y-b.bottom},b.radius))continue;abilityHit(g,e,t,center(a),true);if(e.stunned>0){e.blockedAttack=a.attackId;e.points=[];break;}}
}
// Movement is sampled at 60 Hz, but every active cut/state transition is retained.
// Profiles are shared across samples and pruned with the half-second queue.
function tickDoppel(g,e,f,dt){
 if(e.history.length&&!Array.isArray(e.history[0])){e.history=[];delete e.fighter;delete e.profiles;delete e.profileKey;e.clock=0;}
 e.clock=(e.clock||0)+dt;const now=e.clock,last=e.history.at(-1),physical=meleeTechnique(f),s=D.stats(f),weapon=weaponId(f),profile={kind:L.weaponKind(f)||f.kind,bodyKind:f.kind,skin:f.skin||'default',color:f.color,wanderer:!!f.wanderer,weapon:physical?weapon:null,physical,stats:{reach:s.reach,minRange:s.minRange},size:f.admin?.attackScale||1,bodyScale:f.admin?.bodyScale||1,center:body(f).center,technique:L.attackTechnique(f)?.type||null},key=JSON.stringify(profile);
 e.profiles??={};if(e.profileKey!==key){e.profileKey=key;const known=Object.keys(e.profiles).find(id=>JSON.stringify(e.profiles[id])===key);if(known)e.profileSerial=+known;else{e.profileNext=(e.profileNext||0)+1;e.profileSerial=e.profileNext;e.profiles[e.profileSerial]=profile;}}
 if(!last||f.state==='active'||last[10]!==f.state||last[9]!==f.attackId||now-last[0]>=1/60-1e-8||last[14]!==e.profileSerial)e.history.push([now,f.x,f.y,f.vx,f.vy,f.aim,f.attackAim,f.stateTime,f.duration,f.attackId,f.state,!!f.grounded,f.anim,f.punch||0,e.profileSerial,f.slideRemaining||0,f.dashRemaining||0,f.dashX||0,f.dashY||0,!!f.wallSliding,f.wallSide||0,f.wallJumpTime||0,f.landing||0]);
 const at=now-.55;while(e.history.length>1&&e.history[1][0]<=at+1e-8)e.history.shift();
 if(now>=(e.pruneAt||0)){e.pruneAt=now+.25;const used=new Set(e.history.map(h=>String(h[14])));used.add(String(e.profileSerial));for(const id of Object.keys(e.profiles))if(!used.has(id))delete e.profiles[id];}
 const h=e.history[0];if(!h||h[0]>at+1e-8){e.points=[];return;}const p=e.profiles[h[14]],next=e.history[1],mix=at-h[0]>1e-8&&next&&Math.hypot(next[1]-h[1],next[2]-h[2])<160?clamp((at-h[0])/(next[0]-h[0]),0,1):0;
 const a=e.fighter??=D.makeFighter(10000+e.id,p.bodyKind,p.color,{x:h[1],y:h[2]});Object.assign(a,{kind:p.bodyKind,skin:p.skin,color:p.color,wanderer:p.wanderer,x:h[1]+((next?.[1]??h[1])-h[1])*mix,y:h[2]+((next?.[2]??h[2])-h[2])*mix,vx:h[3],vy:h[4],aim:h[5],attackAim:h[6],stateTime:h[7],duration:h[8],attackId:h[9],state:h[10],grounded:h[11],anim:h[12],punch:h[13],slideRemaining:h[15],dashRemaining:h[16],dashX:h[17],dashY:h[18],wallSliding:h[19],wallSide:h[20],wallJumpTime:h[21],landing:h[22],facing:Math.cos(h[5])<0?-1:1,admin:{attackScale:p.size,bodyScale:p.bodyScale},ultMode:'',summonType:'doppel'});
 a.legacy={...L.inventory(),items:p.weapon?[p.weapon]:[],weapon:p.weapon};e.x=a.x;e.y=a.y-body(a).center;e.geometry=p;e.attack=a.state==='active'&&p.physical?.1:0;e.phase=e.attack?'attack':'follow';
 if(e.lastAttack!==a.attackId){e.lastAttack=a.attackId;e.hits=[];e.blockedAttack=null;}
 if(e.stunned>0){a.state='stunned';e.points=[];}else e.points=p.physical&&a.state==='active'&&e.blockedAttack!==a.attackId?slash(a,g.map.walls,p).points:[];
}
function tickSpectral(g,e,f,target,dt){
 const a=summonActor(e,f);a.summonType='spectral';a.stateTime+=dt;e.points=[];
 if(e.stunned>0){a.state='stunned';e.attack=0;return;}
 if(a.state==='idle'||a.state==='hidden'){
  a.state='hidden';e.attack=0;e.phase='hidden';if(e.due>0)return;
  const side=target.facing||1,y=target.y,x=[target.x-side*110,target.x+side*110].find(x=>portalClear(g,x,y-body(a).center,a));
  if(x===undefined){e.due=.5;return;}e.x=x;e.y=y-e.r;summonActor(e,f);a.aim=a.attackAim=Math.atan2(center(target).y-center(a).y,target.x-a.x);a.facing=Math.cos(a.aim)<0?-1:1;a.attackId=(a.attackId||0)+1;e.hits=[];e.blockedAttack=null;e.due=3.5;servantState(e,'startup',.38/g.rules.attackSpeed);effect(g,f,'spectralArrival',a.x,a.y-body(a).center,{life:.2});
 }else if(a.stateTime>=a.duration){if(a.state==='startup')servantState(e,'active',.13/g.rules.attackSpeed);else if(a.state==='active')servantState(e,'recovery',.22/g.rules.attackSpeed);else{servantState(e,'hidden');e.phase='hidden';}}
 e.warnLeft=a.state==='startup'?Math.max(0,a.duration-a.stateTime):0;
 if(e.blockedAttack!==a.attackId)companionCut(g,e,f);e.attack=a.state==='active'?Math.max(.001,a.duration-a.stateTime):0;
}
function adaptation(g,e,f,target,dt){
 const memory=ensure(f).summonMemory??={},m=memory.mahoraga??={counts:{front:0,ranged:0,air:0},learned:{},airTime:0};
 const learn=key=>{m.counts[key]++;if(m.counts[key]>=2&&!m.learned[key]){m.learned[key]=true;e.wheelPulse=.7;e.adapted=key;effect(g,f,'adapt',e.x,e.y-45,{life:.7,mode:key});}};
 const nearby=Math.hypot(target.x-e.x,target.y-e.y)<500,attackKey=g.round+':'+target.id+':'+target.attackId;
 if(nearby&&['startup','active'].includes(target.state)&&m.attackKey!==attackKey){m.attackKey=attackKey;learn('front');}
 const shot=world(g).entities.find(p=>p.kind!=='companion'&&!p.zone&&p.lethal&&p.life>p.age&&hostile(g,p.owner,f)&&Math.hypot(p.x-e.x,p.y-e.y)<500&&(e.x-p.x)*p.vx+(e.y-p.y)*p.vy>0);
 if(shot&&m.shotKey!==g.round+':'+shot.id){m.shotKey=g.round+':'+shot.id;learn('ranged');}
 if(nearby&&!target.grounded&&target.y<f.y-60){m.airTime+=dt;while(m.airTime>=.9){m.airTime-=.9;learn('air');}}else m.airTime=Math.max(0,m.airTime-dt);
 e.wheelPulse=Math.max(0,(e.wheelPulse||0)-dt);e.adaptations=Object.keys(m.learned);e.wheelAngle=(e.wheelAngle||0)+dt*(e.wheelPulse>0?8:.4+e.adaptations.length*.3);
 if(m.learned.front&&nearby&&target.state==='startup'&&(e.flankReady||0)<=g.time){e.flankReady=g.time+2.4;e.flankUntil=g.time+.55;e.flankX=target.x-target.facing*105;e.vy=e.grounded?-650:e.vy;e.grounded=false;e.attack=0;e.due=.6;}
 if(e.flankUntil>g.time){companionMove(g,e,e.flankX,target.y-e.r-140,480,dt);return true;}
 if(m.learned.air&&e.grounded&&nearby&&target.y<f.y-85&&(e.airReady||0)<=g.time){e.vy=-850;e.grounded=false;e.airReady=g.time+1.5;}
 return false;
}
function meleeSummonActor(e,f){return e.type==='doppel'?e.fighter:['servant','skeleton','spectral','legion'].includes(e.type)?summonActor(e,f):null;}
function vulnerableSummon(e){return !(e.type==='doppel'&&!e.fighter)&&!['lantern','fairy','dragon','kraken','hunter','star','necromancer'].includes(e.type)&&!(e.type==='spectral'&&(!e.fighter||['idle','hidden'].includes(e.fighter.state)));}
function breakSummon(g,e,f){if(e.type==='legion'){const fallen=ensure(f).legionFallen??=[];if(!fallen.includes(e.slot))fallen.push(e.slot);}if(e.type==='servant')delete ensure(f).servantKind;if(e.type==='slimeking'&&(e.generation||0)<2)for(const sign of[-1,1]){const {id,...child}=e;entity(g,f,'slimeking',{...child,x:e.x+sign*22,r:e.r*.63,generation:(e.generation||0)+1,age:0,hits:[],life:1e9,phase:'follow',attack:0,warnLeft:0,due:.8,grounded:false,platform:-1,vx:0,vy:-180,jumpVx:0,airLeft:0,recoverLeft:0,stunned:0,blocked:false});}if(e.type==='skeleton'){delete e.fighter;e.points=[];e.warnLeft=0;e.deadUntil=g.time+6;e.attack=0;e.phase='follow';e.x=f.x-60;e.y=f.y-35;e.due=6;}else e.life=0;dropCarried(g,e);effect(g,f,'summonBreak',e.x,e.y);}
function projectileSummons(g,p,old){if(p.zone||!p.lethal)return;for(const e of world(g).entities){const f=g.fighters[e.owner];if(e.kind!=='companion'||e.age>=e.life||e.deadUntil>g.time||!f||!hostile(g,p.owner,f)||!vulnerableSummon(e))continue;const a=meleeSummonActor(e,f),b=a&&body(a),from=a?{x:a.x,y:a.y-b.top}:e,to=a?{x:a.x,y:a.y-b.bottom}:e;
 if(e.type==='legion'&&e.slot===2&&legionBlock(g,e,{parryable:p.parryable,origin:old,shape:{from:old,to:p,r:p.r||6}},null)){stopProjectile(g,p);return;}
 if(segmentDistance(old,p,from,to)>(p.r||6)+(b?.radius||e.r))continue;
 if(e.type==='mahoraga'&&ensure(f).summonMemory?.mahoraga?.learned.ranged&&(e.deflectUntil||0)<=g.time&&p.parryable){e.deflectUntil=g.time+2;effect(g,f,'adapt',e.x,e.y,{life:.3,mode:'ranged'});}else breakSummon(g,e,f);
 if(!p.piercing||p.type==='weapon'){stopProjectile(g,p);return;}
}}
function tickCompanion(g,e,f,dt){if(dt<=0)return;if(f.dead){dropCarried(g,e);e.life=0;return;}const target=enemies(g,f).sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y))[0],p=center(f);e.due-=dt;const attacking=e.attack>0;e.attack=Math.max(0,e.attack-dt);e.stunned=Math.max(0,(e.stunned||0)-dt);if(attacking&&!e.attack)e.phase='return';if(!target){if(e.type==='mimic')tickMimic(g,e,f,dt);if(e.type==='toad')tickToad(g,e,f,dt);if(e.type==='slime')syncSlime(g,e,dt);if(e.type==='hunter'&&['mark','hunt'].includes(e.phase))hunterRetreat(e);if(e.type==='lantern'){e.markTarget=null;e.markLeft=0;}return;}if(e.deadUntil>g.time)return;if(e.deadUntil){delete e.deadUntil;delete e.fighter;effect(g,f,'summonRebuild',e.x,e.y);}if(e.type==='doppel')tickDoppel(g,e,f,dt);if(e.type==='slime')syncSlime(g,e,dt);const q=center(target),dist=Math.hypot(q.x-e.x,q.y-e.y);
 // One clean slash destroys a vulnerable summon; respawn rules are per identity.
 const adapting=e.type==='mahoraga'&&adaptation(g,e,f,target,dt);
 const actor=meleeSummonActor(e,f),actorBody=actor&&body(actor);
 if(!vulnerableSummon(e)){}else for(const a of enemies(g,f))if(a.state==='active'){
  const incoming=slash(a,g.map.walls).points;if(e.type==='legion'&&e.slot===2&&legionBlock(g,e,pendingStrike(g,e.fighter,a),a))continue;
  if(actor?.state==='active'&&polygonsIntersect(incoming,slash(actor,g.map.walls,e.type==='doppel'?e.geometry:null).points)){e.blockedAttack=actor.attackId;if(e.type==='doppel')e.stunned=.16;servantState(e,'clash',.16);e.points=[];g.setState(a,'clash',.16);a.attackHit=true;g.emit('clash',{kind:a.kind,kinds:[a.kind,actor.kind],x:e.x,y:e.y});g.hitstop=.04;return;}
  const from=actor?{x:actor.x,y:actor.y-actorBody.top}:{x:e.x,y:e.y-8},to=actor?{x:actor.x,y:actor.y-actorBody.bottom}:{x:e.x,y:e.y+8};
  if(polygonSegment(incoming,from,to,actorBody?.radius||e.r)){breakSummon(g,e,f);return;}
 }
 if(e.type==='doppel'){if(e.geometry?.physical&&e.blockedAttack!==e.fighter?.attackId)companionCut(g,e,f,e.geometry);return;}if(e.type==='spectral'){tickSpectral(g,e,f,target,dt);return;}if(e.type==='legion'){tickLegion(g,e,f,target,dt);return;}if(actor){tickServant(g,e,f,target,dt);return;}if(adapting)return;
 if(e.deadUntil>g.time)return;
 if(e.type==='toad'){tickToad(g,e,f,dt);return;}if(e.type==='mimic'){tickMimic(g,e,f,dt);return;}
 if(e.type==='slimeking'){tickSlimeKing(g,e,f,target,dt);return;}if(e.type==='hunter'){tickHunter(g,e,f,target,dt);return;}if(e.type==='slime'){tickSlime(g,e,f,dt);return;}if(e.type==='medusa'){tickMedusa(g,e,f,dt);return;}if(e.type==='lantern'){tickLantern(g,e,f,target,dt);return;}
 if(e.type==='beetle'){for(const a of world(g).entities)if(a.owner!==f.id&&!a.zone&&a.kind!=='companion'&&a.lethal&&Math.hypot(a.x-e.x,a.y-e.y)<45&&e.due<=0){stopProjectile(g,a);e.due=4;effect(g,f,'barrierBreak',e.x,e.y);break;}}
 if(e.type==='fairy'&&ensure(f).airTime>1.1&&e.due<=0&&f.vy>0){f.vy=-560;e.due=5;effect(g,f,'fairy',f.x,f.y);}
 if(['beetle','fairy'].includes(e.type)){const a=g.time*1.8+e.id;companionMove(g,e,p.x+Math.cos(a)*48,p.y-25+Math.sin(a)*28,200,dt);return;}
 if(e.type==='monkey'){if(e.carry){const w=world(g).entities.find(w=>w.id===e.carry&&w.carrier===e.id);if(!w)e.carry=null;else{companionMove(g,e,f.x,f.y-e.r,280,dt);if(Math.hypot(e.x-f.x,e.y-(f.y-e.r))<32)dropCarried(g,e);return;}}const weapon=world(g).entities.filter(t=>t.type==='weapon'&&t.mode==='dropped'&&!t.carrier).sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y))[0];companionMove(g,e,weapon?.x??(p.x-65),weapon?.y??(f.y-e.r),280,dt);if(weapon&&Math.hypot(weapon.x-e.x,weapon.y-e.y)<e.r+22){weapon.carrier=e.id;e.carry=weapon.id;}return;}

 if(e.type==='kraken'){e.x=f.x<g.map.width/2?-115:g.map.width+115;e.y=clamp(p.y-100,150,g.map.height-50);e.r=145;e.lethal=false;return;}
 if(['dragon','necromancer'].includes(e.type)){e.x=p.x+(e.type==='dragon'?-120:80);e.y=p.y-90;return;}
 if(e.type==='star'){e.x=p.x-f.facing*36;e.y=p.y-15;if(f.state==='active'&&e.lastAttack!==f.attackId){e.lastAttack=f.attackId;entity(g,f,'starPunch',{x:p.x+Math.cos(f.attackAim)*92,y:p.y+Math.sin(f.attackAim)*92,zone:true,r:28,warn:.07,life:.17});}return;}
 if(e.phase==='return'||e.stunned>0||e.type==='falcon'&&!e.attack){const x=p.x-55,y=groundCompanions.has(e.type)?f.y-e.r:p.y-85;companionMove(g,e,x,y,430,dt);if(Math.hypot(e.x-x,e.y-y)<35&&e.stunned<=0){e.phase='follow';e.fired=false;}return;}
 if(e.due<=0&&!e.attack){e.due=({raven:3,slime:2,hound:3,toad:4,mimic:5,medusa:4,spectral:3.5,skeleton:3,mahoraga:2,slimeking:3,legion:2.7,hunter:8})[e.type]||4;e.attack=e.type==='hunter'?2.5:1.1;e.phase='attack';e.hits=[];e.warnLeft=e.type==='hunter'?1:.35;e.aim=Math.atan2(q.y-e.y,q.x-e.x);if(e.type==='spectral'){e.x=q.x-target.facing*110;e.y=q.y;}}
 if(e.attack){e.warnLeft=Math.max(0,(e.warnLeft||0)-dt);if(e.warnLeft>0){if(groundCompanions.has(e.type))companionMove(g,e,e.x,e.y,0,dt);return;}
  const speed=e.type==='slime'?120:e.type==='skeleton'?180:e.type==='hunter'?710:e.type==='falcon'?880:360,old={x:e.x,y:e.y},angle=e.type==='falcon'?e.aim:Math.atan2(q.y-e.y,q.x-e.x);if(groundCompanions.has(e.type))companionMove(g,e,target.x,target.y-e.r,speed,dt);else{e.vx=Math.cos(angle)*speed;e.vy=Math.sin(angle)*speed;e.x+=e.vx*dt;e.y+=e.vy*dt;if(g.map.walls.some(w=>wallFraction(old,e,w)<1)){e.x=old.x;e.y=old.y;e.attack=0;e.phase='return';return;}}e.lethal=!['raven','slime','hound'].includes(e.type);e.slow=e.type==='slime'?.8:0;abilityHit(g,e,target,old);
 }else{e.fired=false;const n=e.slot||0,dx=p.x-f.facing*(55+n*35)-e.x,dy=p.y+(e.type==='slime'||e.type==='slimeking'?40:-40+n*24)-e.y;companionMove(g,e,e.x+dx,groundCompanions.has(e.type)?f.y-e.r:e.y+dy,260,dt);}
}
Object.assign(L,{toadTongue,mimicMouth,legionShield,spawnServant,summonActor,world,effect,entity,projectile,enemies,hostile,weaponId,spawnCompanions,refill,free,throwWeapon,shoot,center,transform});
// Hooks share the existing Game class; no alternative physics loop is introduced.
const P=D.Game.prototype,old={};for(const k of ['resetFighters','start','attack','dash','parry','emit','snapshot','loadSnapshot','special','step','adminApply'])old[k]=P[k];
P.resetFighters=function(...args){const saved=this.fighters?.map(f=>f.legacy?clone(f.legacy):null)||[];old.resetFighters.apply(this,args);if(this.legacyEnabled){this.legacyWorld={entities:[],effects:[],serial:0,time:0};this.fighters.forEach((f,i)=>{L.reset(f,saved[i],'duel');spawnCompanions(this,f);});}};
P.start=function(o){old.start.call(this,o);if(o?.legacies||this.legacyEnabled){this.legacyEnabled=true;for(let i=0;i<this.fighters.length;i++){L.reset(this.fighters[i],o?.legacies?null:this.fighters[i].legacy,'match');for(const id of(o?.legacies?.[i]||[]))L.add(this.fighters[i],id);}this.legacyWorld={entities:[],effects:[],serial:0,time:0};for(const f of this.fighters)spawnCompanions(this,f);L.captureRound(this);}};
P.attack=function(id){const f=this.fighters[id],l=f.legacy,w=originalSpecial(f)?null:L.WEAPONS[weaponId(f)];if(l&&w?.shot&&(l.cd.weapon||0)>0)return false;
 const eligible=l&&meleeTechnique(f)&&!['fenceReady','sweepReady','edge'].includes(f.ultMode),lunge=eligible&&has(f,'lunge')&&f.dashRemaining>0&&this.time-(l.lastDash??-100)<.07,iai=eligible&&!lunge&&has(f,'iaijutsu')&&f.grounded&&l.lastDashGround&&f.dashRemaining<=0&&this.time>=(l.groundDashEnds??Infinity)&&this.time-l.groundDashEnds<.22,aim=f.aim;
 if(lunge)f.aim=Math.atan2(f.dashY,f.dashX);const ok=old.attack.call(this,id);if(ok&&l){if(l.effects.wolf>0){l.wolfAttackId=f.attackId;l.effects.wolf=0;}if(lunge||iai){const type=lunge?'lunge':'iaijutsu',angle=lunge?f.attackAim:Math.cos(f.attackAim)>=0?0:Math.PI;l.technique={type,attack:f.attackId,angle,distance:lunge?130:155,from:center(f)};f.attackAim=angle;f.dashRemaining=f.slideRemaining=0;f.jumpBuffer=0;l.lastDashGround=false;f.duration=D.stats(f).startup/this.rules.attackSpeed;effect(this,f,'techniqueTell',f.x,f.y-body(f).center,{angle,technique:type,life:f.duration,r:D.stats(f).reach});}if(l.effects.nodraw>0){l.nodrawAttack=f.attackId;l.effects.nodraw=0;l.still=0;}l.effects.counter=0;l.triggered=false;f.legacyNoSlash=!!w?.shot&&!l.effects.weaponAway;}f.aim=aim;return ok;};
P.special=function(id){const f=this.fighters[id];if(f.wanderer||f.legacy?.mirrorSpecial)return false;const ok=old.special.call(this,id);if(ok)rememberMirror(this,f,'class:'+f.kind);return ok;};
P.adminApply=function(change){const rebuild=this.legacyEnabled&&['apply','reset'].includes(change.action),saved=rebuild?this.fighters.map(f=>f.legacy?clone(f.legacy):null):null,result=old.adminApply.call(this,change);if(rebuild){this.legacyWorld={entities:[],effects:[],serial:0,time:0};for(const f of this.fighters){L.reset(f,saved[f.id],'duel');spawnCompanions(this,f);}L.captureRound(this);}return result;};
P.parry=function(id){const f=this.fighters[id];if(L.attackTechnique(f))return false;const ok=old.parry.call(this,id);if(ok&&f.state==='parry'&&f.legacy){if(has(f,'incense')&&f.legacy.incenseReady){f.parryCooldown+=f.duration*.25;f.duration*=1.25;f.legacy.incenseReady=false;f.legacy.still=0;}if(has(f,'duelistband'))f.parryCooldown=f.duration+this.rules.parryRecovery/1000*.65;}return ok;};
P.dash=function(id,...args){const f=this.fighters[id];if(L.attackTechnique(f))return false;const grounded=f.grounded,pose=has(f,'mirrorcloak')?clone(f):null,ok=old.dash.call(this,id,...args);if(ok&&f.legacy){const l=ensure(f);l.lastDash=this.time;l.lastDashGround=grounded;l.groundDashEnds=this.time+f.dashRemaining;if(has(f,'shadowcloak'))l.effects.shadow=.08;if(has(f,'ghostsuit')){l.effects.phasing=true;l.phaseStart={x:f.x,y:f.y};}if(has(f,'kneepads')&&f.slideRemaining>0){f.slideRemaining*=1.3;f.dashRemaining*=1.3;f.duration=f.dashRemaining;l.groundDashEnds=this.time+f.dashRemaining;}if(pose){delete pose.brain;delete pose.nav;delete pose.legacy.lastInput;effect(this,f,'afterimage',pose.x,pose.y,{life:.4,pose,poseTime:this.time});}if(has(f,'perfectstep')){const threat=enemies(this,f).find(t=>t.state==='active'&&!t.attackHit&&this.bodyContact(t,f));if(threat){l.effects.shadow=.10;effect(this,f,'perfectStep');}}l.mikiriDone=false;mikiri(this,f);}return ok;};
P.emit=function(type,data={}){old.emit.call(this,type,data);const f=this.fighters?.[data.id];if(type==='roundGo'&&this.legacyEnabled)L.captureRound(this);if(!f?.legacy)return;const l=ensure(f);
 if(type==='swing'){const w=weaponId(f),profile=L.WEAPONS[w];if(profile?.shot&&!l.effects.weaponAway&&!originalSpecial(f)){shoot(this,f,w);l.cd.weapon=profile.cooldown;}
 if(w==='echo'&&!l.effects.weaponAway&&!originalSpecial(f)){entity(this,f,'echo',{x:f.x,y:f.y-body(f).center,points:[],frames:[],profiles:[],walls:clone(this.map.walls),sourceAttack:f.attackId,zone:true,r:0,warn:.6,life:.6+f.duration+.01});}
 if(w==='zenith'&&!l.effects.weaponAway&&!originalSpecial(f))for(let i=-1;i<=1;i++){const warn=.09+(i+1)*.025,path={...center(f),angle:f.attackAim,lane:i,range:i===0?245:210,duration:.28};projectile(this,f,'spectralblade',f.attackAim,{speed:0,path,life:warn+path.duration,r:7,warn});}
 if(w==='needle'&&!originalSpecial(f)&&Math.sin(f.attackAim)>.65){const p=raySurface(this,center(f),f.attackAim,D.stats(f).reach+20);if(p){f.vy=-780;f.grounded=false;f.airJumps=1+(has(f,'wingboot')?1:0);effect(this,f,'pogo',p.x,p.y);}}
 }
 if(type==='parry'){if(has(f,'counter'))l.effects.counter=.26;if(data.perfect&&has(f,'warbell')){f.dashCharges=this.rules.dashCount;f.dashCooldown=0;f.airDashes=0;}if(data.perfect&&has(f,'stoppedclock')&&!(l.cd.stoppedclock>0)){effect(this,f,'slowTime',f.x,f.y-60,{life:.28,factor:.4});l.cd.stoppedclock=3;}if(data.perfect&&has(f,'disarm')){const t=this.fighters[data.attacker];if(t&&data.disarmEligible!==false&&!data.projectile&&!data.technique&&!data.summon&&throwWeapon(this,t,Math.atan2(-120,t.x-f.x))){const e=world(this).entities.at(-1);e.mode='dropped';e.vx*=.18;e.vy=-220;}}}
};
P.snapshot=function(){return{...old.snapshot.call(this),legacyVersion:1,legacyEnabled:!!this.legacyEnabled,legacyWorld:clone(world(this)),legacyRoundStart:this.legacyRoundStart?clone(this.legacyRoundStart):null};};
P.loadSnapshot=function(s){if(!old.loadSnapshot.call(this,s))return false;D.sealPathMap(this.map);this.legacyEnabled=!!s.legacyEnabled;this.legacyRoundStart=s.legacyRoundStart?clone(s.legacyRoundStart):null;this.legacyWorld=clone(s.legacyWorld||{entities:[],effects:[],serial:0,time:0});return true;};
L.captureRound=g=>{const previous=g.legacyRoundStart;g.legacyRoundStart=null;try{const snapshot=g.snapshot();delete snapshot.legacyRoundStart;g.legacyRoundStart=snapshot;}catch(e){g.legacyRoundStart=previous;throw e;}};
L._vanilla=old;
})(globalThis);

