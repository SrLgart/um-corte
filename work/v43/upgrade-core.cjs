const fs=require('fs'),path=require('path');const file=n=>path.join(__dirname,n);
function edit(name,fn){let s=fs.readFileSync(file(name),'utf8');const rep=(a,b)=>{if(!s.includes(a))throw Error(name+': '+a.slice(0,70));s=s.replace(a,b);};fn(rep,()=>s,v=>s=v);fs.writeFileSync(file(name),s);}
edit('engine.js',(r)=>{
 r("default:15,unbounded:true","default:7,unbounded:true");
 r('const DEFAULT_RULES=',"Object.assign(RULES,{winningScore:{name:'Pontos para vencer',min:1,max:25,step:1,unit:'pontos',default:5,integer:true,unbounded:true,numeric:true},attackRecovery:{name:'Recuperação dos ataques',min:.1,max:5,step:.1,default:1,numeric:true}});\nconst DEFAULT_RULES=");
 r("['specials',false]","['specials',true],['persistSpecial',false]");
 r("const MAPS={",`const COMBAT_KEYS=['attackSpeed','attackRecovery','speed','gravity','jump','dashDistance','dashCount','dashRecovery','dashCooldown','parryWindow','parryRecovery','stun','airDash'];
const combatDefaults=Object.fromEntries(COMBAT_KEYS.map(k=>[k,DEFAULT_RULES[k]]));
const PRESETS={classic:{name:'CLÁSSICO',description:'O ritmo padrão da V4.3.',rules:{...combatDefaults}},turbo:{name:'TURBO',description:'Movimento 1,6× · ataque 1,4× · dash recarrega em 600 ms.',rules:{...combatDefaults,speed:1.6,attackSpeed:1.4,dashCooldown:600}},lowGravity:{name:'BAIXA GRAVIDADE',description:'Gravidade 0,65× · pulo 1,1× · mais espaço para duelos aéreos.',rules:{...combatDefaults,gravity:.65,jump:1.1}},merciless:{name:'SEM PIEDADE',description:'Parry de 180 ms · falha de parry: 500 ms · recuperação dos ataques 1,2×.',rules:{...combatDefaults,parryWindow:180,parryRecovery:500,attackRecovery:1.2}}};
function applyPreset(r,id){return cleanRules({...r,...PRESETS[id]?.rules});}
function detectPreset(r){return Object.keys(PRESETS).find(id=>COMBAT_KEYS.every(k=>r[k]===PRESETS[id].rules[k]))||'custom';}
const MAPS={`);
 r("k==='dashCount'?1:","['dashCount','winningScore'].includes(k)?1:");
 r("o[k]=k==='dashCount'?Math.floor(n):n;","o[k]=k==='dashCount'||v.integer?Math.min(Number.MAX_SAFE_INTEGER,Math.floor(n)):n;");
 r("o.specials=r.specials===true;return o;","o.specials=r.specials!==false;o.persistSpecial=r.persistSpecial===true;return o;");
 // Only these three assignments implement Knight/Swordsman parry penalties.
 for(let i=0;i<3;i++)r('f.parryLock=10','f.parryLock=4');
 r('if(this.rules.specials&&!f.ultMode',"if(this.phase==='playing'&&this.rules.specials&&!f.ultMode");
 r('resetFighters(){for','resetFighters(preserve=false){const charges=preserve&&this.rules.specials&&this.rules.persistSpecial?this.fighters?.map(f=>f.specialCharge)||[]:[];for');
 r('f.skin=this.skins[f.id];this.resetSpecial(f);','f.skin=this.skins[f.id];this.resetSpecial(f);f.specialCharge=clamp(charges[f.id]||0,0,this.rules.specialCooldown);');
 r("s.recovery/this.rules.attackSpeed)","s.recovery/this.rules.attackSpeed*this.rules.attackRecovery)");
 r('n>=C.winningScore','n>=this.rules.winningScore');
 r("this.resetFighters();this.emit('round');","this.resetFighters(true);this.emit('round');");
 r("this.emit('adminReset');","this.emit('adminReset');const winner=this.score.findIndex(n=>n>=this.rules.winningScore);if(winner>=0&&this.mode!=='training'){this.phase='matchEnd';this.emit('matchEnd',{winner});}");
 r('version:42','version:43');r('s.version!==42','s.version!==43');
 r('const api={SKINS','const api={PRESETS,COMBAT_KEYS,applyPreset,detectPreset,SKINS');
});
edit('special-ui.js',(r,g,s)=>{s(g().replaceAll('fica 10 segundos sem parry','fica 4 segundos sem parry').replace('ratio:f.parryLock/10','ratio:f.parryLock/4'));});
edit('lab.js',(r)=>{r('resetTraining(g){','resetTraining(g,preserve=false){const charges=preserve&&g.rules.persistSpecial?g.fighters.map(f=>f.specialCharge):null;');r("g.loadSnapshot(this.checkpoint);g.mode='training'","g.loadSnapshot(this.checkpoint);if(charges)g.fighters.forEach((f,i)=>f.specialCharge=Math.min(g.rules.specialCooldown,charges[i]));g.mode='training'");});
edit('build.cjs',(r,g,s)=>{s(g().replaceAll('um-corte-v42','um-corte-v43').replaceAll('UM-CORTE-V42','UM-CORTE-V43').replace("'v42.css'","'v42.css','v43.css'"));});
edit('network.js',(r,g,s)=>{
 s(g().replaceAll('umcorte-v42','umcorte-v43').replaceAll('um-corte-v42','um-corte-v43').replaceAll('V4.2','V4.3').replace('VERSION = 42','VERSION = 43').replace('das cinco classes','das seis classes'));
 r('this.role = null; this.seat = 0;', 'this.adminBuild = !!options.adminBuild; this.remoteAdmin = false;\n      this.role = null; this.seat = 0;');
 r("{ k: 'hello', character: this.character }","{ k: 'hello', character: this.character, admin: this.adminBuild }");
 r('CHARACTERS.has(packet.character) && !gotHello','CHARACTERS.has(packet.character) && typeof packet.admin === \'boolean\' && !gotHello');
 r('gotHello = true; this.remoteCharacter = packet.character;','gotHello = true; this.remoteCharacter = packet.character; this.remoteAdmin = packet.admin;');
 r("{ k: 'welcome', character: this.character }","{ k: 'welcome', character: this.character, admin: this.adminBuild }");
 r("packet.k === 'welcome' && CHARACTERS.has(packet.character)","packet.k === 'welcome' && CHARACTERS.has(packet.character) && typeof packet.admin === 'boolean'");
 r("this.remoteCharacter = packet.character; this._raw", "this.remoteCharacter = packet.character; this.remoteAdmin = packet.admin; this._raw");
 r('remoteCharacter: this.remoteCharacter };','remoteCharacter: this.remoteCharacter, remoteAdmin: this.remoteAdmin };');
 r('this.latency = null; this.remoteCharacter = null;','this.latency = null; this.remoteCharacter = null; this.remoteAdmin = false;');
});
