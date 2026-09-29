// One-shot source migration for the V8 toad/mimic audit.
const fs=require('node:fs'),path=require('node:path'),file=path.join(__dirname,'legacy-combat.js');let s=fs.readFileSync(file,'utf8');
function swap(a,b){if(!s.includes(a))throw Error('Missing source: '+a.slice(0,100));s=s.replace(a,b);}
swap("}else push(g,f,e.type==='repulse'?e.vx:","}else if(e.type==='toad')push(g,f,e.x-f.x,e.y-center(f).y,370);else push(g,f,e.type==='repulse'?e.vx:");
swap("e.blocked=false;e.vx=e.x-t.x;e.vy=e.y-center(t).y;e.force=370;abilityHit(g,e,t,line.from,true);e.vx=0;","e.blocked=false;abilityHit(g,e,t,line.from,true);");
swap("if(['smoke','shadowbomb','ice'].includes(e.type))continue;projectileSummons(g,e,old);","if(mimicIntercept(g,e,old))continue;if(['smoke','shadowbomb','ice'].includes(e.type))continue;projectileSummons(g,e,old);");
swap("if(['flying','return'].includes(e.mode))for(const t of g.fighters)abilityHit(g,e,t,old);","if(['flying','return'].includes(e.mode)){if(mimicIntercept(g,e,old))return;projectileSummons(g,e,old);if(['flying','return'].includes(e.mode))for(const t of g.fighters){abilityHit(g,e,t,old);if(e.mode==='dropped')break;}}");
swap("if(e.type==='legion'&&e.slot===2&&legionBlock(g,e,{parryable:p.parryable,origin:old,shape:{from:old,to:p,r:p.r||6}},null)){p.life=0;return;}","if(e.type==='legion'&&e.slot===2&&legionBlock(g,e,{parryable:p.parryable,origin:old,shape:{from:old,to:p,r:p.r||6}},null)){stopProjectile(g,p);return;}");
swap("if(!p.piercing){p.life=0;return;}","if(!p.piercing||p.type==='weapon'){stopProjectile(g,p);return;}");
swap("if(!target){if(e.type==='slime')", "if(!target){if(e.type==='mimic')tickMimic(g,e,f,dt);if(e.type==='toad')tickToad(g,e,f,dt);if(e.type==='slime')");
swap("if(e.type==='slimeking'){tickSlimeKing", "if(e.type==='toad'){tickToad(g,e,f,dt);return;}if(e.type==='mimic'){tickMimic(g,e,f,dt);return;}\n if(e.type==='slimeking'){tickSlimeKing");
swap("{a.life=0;e.due=4;effect(g,f,'barrierBreak'", "{stopProjectile(g,a);e.due=4;effect(g,f,'barrierBreak'");
s=s.split('\n').filter(l=>!l.startsWith("  if(e.type==='toad'){companionMove")&&!l.startsWith("  if(e.type==='mimic'){companionMove")).join('\n');
swap('Object.assign(L,{legionShield,','Object.assign(L,{toadTongue,mimicMouth,legionShield,');fs.writeFileSync(file,s);
