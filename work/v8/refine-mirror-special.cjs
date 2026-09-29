// One-shot integration; engine generation changes are in upgrade-core.cjs.
const fs=require('node:fs'),path=require('node:path'),p=f=>path.join(__dirname,f);let s=fs.readFileSync(p('legacy-combat.js'),'utf8');
function swap(a,b){if(!s.includes(a))throw Error('Missing '+a.slice(0,90));s=s.replace(a,b);}
swap("else if(id==='brokenmirror'){const copied=l.copied;if(!mirrorPowers.has(copied))return false;", "else if(id==='brokenmirror'){const copied=l.copied;if(typeof copied==='string'&&copied.startsWith('class:')){if(!copySpecial(g,f,copied.slice(6),inp))return false;l.copied=null;}else{if(!mirrorPowers.has(copied))return false;");
swap('let ok=false;try{if(!l.items.includes(copied))', 'let ok=false;const previousCast=g.legacyMirrorCast;g.legacyMirrorCast=true;try{if(!l.items.includes(copied))');
swap('}finally{Object.assign(l,saved);}if(!ok)return false;l.copied=null;}', '}finally{Object.assign(l,saved);g.legacyMirrorCast=previousCast;}if(!ok)return false;l.copied=null;}}');
swap("for(const t of enemies(g,f))if(L.scopeReady(t,'brokenmirror')&&Math.hypot(t.x-f.x,t.y-f.y)<480&&mirrorPowers.has(id))ensure(t).copied=id;", "if(mirrorPowers.has(id))rememberMirror(g,f,id);");
swap("P.special=function(id){if(this.fighters[id].wanderer)return false;return old.special.call(this,id);};", "P.special=function(id){const f=this.fighters[id];if(f.wanderer||f.legacy?.mirrorSpecial)return false;const ok=old.special.call(this,id);if(ok)rememberMirror(this,f,'class:'+f.kind);return ok;};");
swap("if(profile?.shot&&!l.effects.weaponAway)","if(profile?.shot&&!l.effects.weaponAway&&!originalSpecial(f))");
swap("if(w==='needle'&&Math.sin(f.attackAim)>.65)","if(w==='needle'&&!originalSpecial(f)&&Math.sin(f.attackAim)>.65)");
fs.writeFileSync(p('legacy-combat.js'),s);
