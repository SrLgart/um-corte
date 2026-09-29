// Actual finite matches with a scripted player; this is not human balance testing.
const fs=require('node:fs'),path=require('node:path'),A=require('node:assert/strict');require('./bootstrap.cjs');const D=DuelCore,L=DuelLegacy,P=DuelPath;
const builds=[
 ['gravitycloak','wingboot','echo','toad','well'],['yamato','mist','mirrorcloak','doppel','pulse'],
 ['leviathan','weaponmaster','mimic','telekinesis','barrier'],['bow','legion','kraken','falcon','ice'],
 ['ruyi','slimeking','medusa','gravitycloak','gust'],['yoyo','spectral','hunter','lantern','swap'],
 ['gunblade','rockets','slime','shadowbomb','fireball'],['knuckles','icarus','skeleton','sandevistan','repulsor'],
 ['zenith','wingboot','amaterasu','portals','kamehameha'],['needle','perfectstep','lunge','web','brokenmirror'],
 ['broom','ghostsuit','incense','mikiri','thehand'],['blunderbuss','stonemask','destinyeye','survivorglass','dragon']
];
const results=[],classes=Object.keys(D.CLASSES),maps=['dojo','bridge','ruins','bamboo','frost','forge'];
function command(g,n){const f=g.fighters[0],t=g.fighters.slice(1).filter(t=>!t.dead).sort((a,b)=>Math.hypot(a.x-f.x,a.y-f.y)-Math.hypot(b.x-f.x,b.y-f.y))[0],inp=D.neutral();if(!t||f.dead||g.phase!=='playing')return inp;
 const dx=t.x-f.x,dy=t.y-f.y,dist=Math.hypot(dx,dy),sign=f.legacy?.effects.inverted?-1:1,profile=L.WEAPONS[L.weaponId(f)],range=profile?.shot?400:D.stats(f).reach;
 inp.aim=Math.atan2(dy,dx);inp.move=dist>range*.8?Math.sign(dx):dist<50?-Math.sign(dx):0;inp.jumpHeld=f.vy*sign<0;
 if(n%83===0&&(dy*sign<-70||f.wallSide||!f.grounded))inp.jump=true;
 if(n%61===0&&g.canAct(f)&&dist<range+25)inp.attack=true;
 inp.attackHeld=['yamato','ruyi','leviathan','yoyo'].includes(L.weaponId(f))&&n%240<70;
 if(n%113===0&&dist<180)inp.parry=true;
 if(n%97===0&&dist>range+70){inp.dash=true;inp.up=dy<-80;inp.down=dy>120;inp.jump=false;}
 if(n%47===0){const ids=L.items(f).filter(id=>L.catalog[id].active&&L.scopeReady(f,id));if(ids.length)inp.legado=[ids[Math.floor(n/47)%ids.length]];}
 if(f.legacy?.channel)inp.legadoHeld=f.legacy.channel.age<2.1?[f.legacy.channel.id]:[];
 if(n%131===0)inp.special=true;return inp;
}
for(let k=0;k<builds.length+3;k++){
 const own=builds[k%builds.length],enemy=builds[(k+3)%builds.length];for(const id of [...own,...enemy])A(L.catalog[id],'unknown '+id);
 let g;if(k<builds.length){const map=maps[k%maps.length];A(D.MAPS[map],'unknown map '+map);g=new D.Game({mode:'pve',ai:true,difficulty:['normal','hard','master'][k%3],mapId:map,characters:[classes[k%classes.length],classes[(k+2)%classes.length]],rules:{specials:true,winningScore:7},random:L.rng(413+k)});g.start({legacies:[own,enemy]});}
 else{const run=new P.Run({seed:631+k});run.level=[26,36,46][k-builds.length];for(const id of own)L.add({legacy:run.inventory},id);g=run.game();}
 g.phase='playing';let h=null,checked=0,peakBytes=0,peakEntities=0,frames=0;const events={};
 for(;frames<5400&&g.phase!=='matchEnd';frames++){
  if(frames%600===300){h=new D.Game();A(h.loadSnapshot(L.clone(g.snapshot())));h.map=L.clone(g.map);}
  const inp=command(g,frames),copy=L.clone(inp);g.step(1/120,[inp]);if(h){h.step(1/120,[copy]);A.deepEqual(h.snapshot(),g.snapshot(),'resume '+k+' frame '+frames);checked++;if(checked%30===0)h=null;}
  for(const f of g.fighters){for(const prop of ['x','y','vx','vy'])A(Number.isFinite(f[prop]),k+':'+prop);if(f.legacy){A(f.legacy.fuel>=0&&f.legacy.fuel<=1);for(const cd of Object.values(f.legacy.cd))A(Number.isFinite(cd)&&cd>=0);}}
  const w=L.world(g);peakEntities=Math.max(peakEntities,w.entities.length);A(w.entities.length<250,'unbounded entities');for(const e of w.entities){A(Number.isFinite(e.x)&&Number.isFinite(e.y));A(Number.isFinite(e.age)&&Number.isFinite(e.life));}
  if(frames%120===0){const bytes=Buffer.byteLength(JSON.stringify(g.snapshot()));peakBytes=Math.max(peakBytes,bytes);A(bytes<750000,'snapshot growth');}
  for(const e of g.events.splice(0))events[e.type]=(events[e.type]||0)+1;if(h)h.events.splice(0);
 }
 A(checked>0,'no resume coverage');results.push({scenario:k,mode:g.pathEncounter?'path':'duel',map:g.mapId,build:own,opponents:g.fighters.slice(1).map(f=>L.items(f)),seconds:frames/120,phase:g.phase,score:g.score,resumedFrames:checked,peakBytes,peakEntities,events});console.log('PASS mixed build',k,frames/120+'s',g.phase,g.score,'resumed',checked);
}
fs.writeFileSync(path.join(__dirname,'../../outputs/v8-build-soak.json'),JSON.stringify({note:'Finite seeded encounters; scripted inputs, real damage, no forced wins or invincibility. Not human balance validation.',results},null,2));console.log('PASS '+results.length+' varied-build encounters and deterministic resumptions');
