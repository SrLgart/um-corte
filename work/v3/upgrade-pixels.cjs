const fs=require('node:fs'),path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8'),write=(f,s)=>fs.writeFileSync(path.join(__dirname,f),s);
let s=read('engine.js');
function sub(a,b){if(!s.includes(a))throw Error('Missing engine anchor '+a.slice(0,80));s=s.replace(a,b);}
sub('const C={width:1280,height:720,ground:610,radius:17,bladeWidth:3,','const SCALE=.9;\nconst C={scale:SCALE,bodyTop:121*SCALE,bodyBottom:25*SCALE,bodyCenter:79*SCALE,width:1280,height:720,ground:610,radius:17*SCALE,bladeWidth:3*SCALE,');
sub('for(const s of Object.values(CLASSES))Object.assign(s,','for(const s of Object.values(CLASSES)){for(const k of [\'reach\',\'minRange\',\'length\'])s[k]*=SCALE;}\nfor(const s of Object.values(CLASSES))Object.assign(s,');
sub("const RULES={gravity:","const RULES={attackSpeed:{name:'Velocidade de ataque',min:.5,max:2,step:.5,options:['Lenta','Normal','Rápida','Super rápida']},mapSize:{name:'Tamanho da arena',min:.5,max:2,step:.5,options:['Pequeno','Normal','Grande','Gigante']},gravity:");
sub('o[k]=Number.isFinite(r[k])?clamp(r[k],v.min,v.max):1;','o[k]=Number.isFinite(r[k])?(v.options?Math.round(clamp(r[k],v.min,v.max)*2)/2:clamp(r[k],v.min,v.max)):1;');
sub("function blade(f){",`// Scale both axes of the arena. Large layouts receive intermediate stepping stones
// along existing routes so increasing space never removes the basic jump route.
function makeMap(id,scale=1){const base=MAPS[id]||MAPS.dojo,platforms=base.platforms.map(p=>({...p,x:p.x*scale,y:p.y*scale,w:p.w*scale}));
 if(scale>1){const original=[...platforms];for(let i=0;i<original.length;i++)for(let j=i+1;j<original.length;j++){const a=original[i],b=original[j],gap=Math.max(0,Math.max(a.x,b.x)-Math.min(a.x+a.w,b.x+b.w)),rise=Math.abs(a.y-b.y);if(rise<1||rise>240*scale||gap>150*scale||rise<=205&&gap<=180)continue;
  const left=Math.max(a.x,b.x),right=Math.min(a.x+a.w,b.x+b.w),x=right>=left?(left+right)/2:(a.x<b.x?(a.x+a.w+b.x)/2:(b.x+b.w+a.x)/2),steps=Math.max(Math.ceil(rise/190),Math.ceil(gap/180));
  for(let n=1;n<steps;n++){const y=lerp(a.y,b.y,n/steps),w=110;if(!platforms.some(p=>Math.abs(p.y-y)<55&&x>=p.x-25&&x<=p.x+p.w+25))platforms.push({x:x-w/2,y,w,step:true});}
 }}
 return{...base,platforms,spawns:base.spawns.map(p=>({x:p.x*scale,y:p.y*scale})),width:C.width*scale,height:C.height*scale,deathY:C.deathY*scale,scale};
}
function pointInPolygon(p,poly){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)inside=!inside;}return inside;}
function polygonSegment(poly,a,b,r=0){if(!poly.length)return false;if(pointInPolygon(a,poly)||pointInPolygon(b,poly))return true;return poly.some((p,i)=>segmentDistance(p,poly[(i+1)%poly.length],a,b)<=r);}
function polygonsIntersect(a,b){return a.length&&b.length&&(pointInPolygon(a[0],b)||pointInPolygon(b[0],a)||a.some((p,i)=>polygonSegment(b,p,a[(i+1)%a.length])));}
// The same polygon is filled by the renderer and used by hit, guard and clash tests.
// No separate enlarged hitbox and no damage from the weapon model or its handle.
function slash(f){if(f.state!=='active'||f.dead)return{points:[]};const s=stats(f),aim=f.attackAim,origin={x:f.x,y:f.y-C.bodyCenter},at=(x,y)=>({x:origin.x+Math.cos(aim)*x-Math.sin(aim)*y,y:origin.y+Math.sin(aim)*x+Math.cos(aim)*y});let points=[];
 if(f.kind==='lancer'){const lo=s.minRange,hi=s.reach;points=[[lo,0],[lo+12,-5*SCALE],[hi-18,-10*SCALE],[hi,0],[hi-18,10*SCALE],[lo+12,5*SCALE]].map(p=>at(...p));}
 else{const steps=18,arc=f.kind==='reaper'?1.2:f.kind==='swordsman'?1.12:f.kind==='assassin'?.8:.95,outer=[],inner=[];for(let i=0;i<=steps;i++){const t=i/steps,a=lerp(-arc,arc,t),r=s.reach*(.83+.17*Math.sin(t*Math.PI)),thickness=(s.reach-s.minRange)*Math.pow(Math.sin(t*Math.PI),.8);outer.push(at(Math.cos(a)*r,Math.sin(a)*r));inner.push(at(Math.cos(a)*(r-thickness),Math.sin(a)*(r-thickness)));}points=[...outer,...inner.reverse()];}
 return{points,origin,aim};
}
function blade(f){`);
sub('offset=24,start=12,end=s.length;','offset=24*SCALE,start=12*SCALE,end=s.length;');
sub("if(s.sweep){if(f.state==='startup')angle=aim-side*s.sweep*.5*clamp(p*2,0,1);else if(f.state==='active')angle=aim+side*s.sweep*(p-.5);else if(f.state==='recovery')angle=aim+side*lerp(s.sweep*.5,-.18,p*p);}","if(s.sweep){if(f.state==='startup')angle=aim-side*s.sweep*.48*Math.sin(p*Math.PI/2);else if(f.state==='active')angle=aim+side*s.sweep*.46;else if(f.state==='recovery')angle=aim+side*lerp(s.sweep*.46,-.18,1-Math.pow(1-p,3));}");
sub('extend=-20*p','extend=-20*SCALE*p');sub('extend=lerp(-20,18,Math.sin(p*Math.PI))','extend=18*SCALE');sub('extend=-20*(1-p);start=s.length-44;','extend=-20*SCALE*(1-p);start=s.length-44*SCALE;');
s=s.replaceAll('f.y-79','f.y-C.bodyCenter');
sub('Math.cos(ga)*37','Math.cos(ga)*37*SCALE');sub('Math.sin(ga)*48','Math.sin(ga)*48*SCALE');
sub("at(-45)","at(-45*SCALE)");sub("at(-34)","at(-34*SCALE)");
sub('const pts=[at(139,-4),at(167,7),at(174,29),at(166,53),at(145,73),at(119,84)]','const pts=[[139,-4],[167,7],[174,29],[166,53],[145,73],[119,84]].map(p=>at(p[0]*SCALE,p[1]*SCALE))');
sub('a:at(-12),b:at(Math.min(120,s.length))','a:at(-12*SCALE),b:at(Math.min(120*SCALE,s.length))');
sub('dashX:0,dashY:0,','dashX:0,dashY:0,dashRemaining:0,');
sub('this.map=MAPS[this.mapId];','this.map=makeMap(this.mapId,this.rules.mapSize);');
sub('f.state=state;f.stateTime=0;f.duration=duration;',"f.state=state;f.stateTime=0;f.duration=duration;if(['stunned','clash','dead'].includes(state))f.dashRemaining=0;");
sub("attack(id){const f=this.fighters[id];if(!this.canAct(f))return false;","attack(id){const f=this.fighters[id];if(!this.canAct(f)&&!(f.state==='dash'&&!f.dead&&this.phase==='playing'))return false;");
sub("this.setState(f,'startup',stats(f).startup)","this.setState(f,'startup',stats(f).startup/this.rules.attackSpeed)");
sub('f.dashX=x;f.dashY=y;','f.dashX=x;f.dashY=y;f.dashRemaining=s.dash;');
sub('if(f.dead){f.deathTime+=dt;return;}','if(f.dead){f.deathTime+=dt;return;}\n  if(f.dashRemaining>0){f.dashRemaining=Math.max(0,f.dashRemaining-dt);if(!f.dashRemaining){f.vx*=.45;f.vy*=.55;if(f.state===\'dash\')this.setState(f,\'dashRecovery\',stats(f).dashRecovery*this.rules.dashRecovery);}}');
sub("this.setState(f,'active',s.active)","this.setState(f,'active',s.active/this.rules.attackSpeed)");sub("this.setState(f,'recovery',s.recovery)","this.setState(f,'recovery',s.recovery/this.rules.attackSpeed)");
sub("else if(old==='dash'){this.setState(f,'dashRecovery',s.dashRecovery*this.rules.dashRecovery);f.vx*=.45;f.vy*=.55;}","else if(old==='dash'){this.setState(f,'dashRecovery',s.dashRecovery*this.rules.dashRecovery);}");
sub("f.jumpBuffer>0&&!['dash'","f.jumpBuffer>0&&f.dashRemaining<=0&&!['dash'");
sub("if(f.state==='dash'){f.vx=","if(f.dashRemaining>0){f.vx=");
s=s.replaceAll("f.state!=='dash')f.airUsed=false","f.dashRemaining<=0)f.airUsed=false");
s=s.replaceAll(',24,1256)',',24*SCALE,this.map.width-24*SCALE)');
const begin=s.indexOf(' bodyContact(a,d)'),end=s.indexOf(' finish(winner',begin);
s=s.slice(0,begin)+` bodyContact(a,d){return polygonSegment(slash(a).points,{x:d.x,y:d.y-C.bodyTop},{x:d.x,y:d.y-C.bodyBottom},C.radius);}
 incomingSector(a,d){const poly=slash(a).points,center={x:d.x,y:d.y-C.bodyCenter};let best=center,dist=Infinity;for(let i=0;i<poly.length;i++){const p=nearest(center,poly[i],poly[(i+1)%poly.length]),n=Math.hypot(p.x-center.x,p.y-center.y);if(n<dist){best=p;dist=n;}}const dx=a.x-d.x,dy=a.y-d.y;return{sector:guardSector(Math.atan2(dy,dx),false),side:Math.sign(dx)||1,point:best};}
 resolveCombat(){const[p,e]=this.fighters;if(p.dead||e.dead)return;const ps=slash(p),es=slash(e);
  if(polygonsIntersect(ps.points,es.points)){for(const f of[p,e]){f.attackHit=true;this.setState(f,'clash',.16);f.vx=(f.x<(f===p?e:p).x?-1:1)*170;}this.hitstop=.055;this.emit('clash',{x:(p.x+e.x)/2,y:(p.y+e.y)/2-C.bodyCenter});return;}
  const hits=[];for(const[a,d]of[[p,e],[e,p]]){if(a.state!=='active'||a.attackHit)continue;const body=this.bodyContact(a,d),g=blade(d).guard,guardTouch=d.state==='parry'&&polygonSegment(slash(a).points,g.a,g.b,C.bladeWidth);if(!body&&!guardTouch)continue;const incoming=this.incomingSector(a,d),valid=d.state==='parry'&&incoming.sector===d.guard&&(d.guard!=='normal'||incoming.side===d.guardFacing);
   if(valid){a.attackHit=true;this.setState(a,'stunned',stats(a).stun*this.rules.stun);a.vx=(a.x<d.x?-1:1)*120;this.setState(d,'idle');d.parryCooldown=Math.min(d.parryCooldown,.22);this.hitstop=.07;this.emit('parry',{id:d.id,...incoming.point});return;}if(body)hits.push([a,d]);
  }
  if(hits.length){const trade=hits.length===2,winner=trade?-1:hits[0][0].id;for(const[,d]of hits){d.dead=true;d.deathTime=0;this.setState(d,'dead');}const d=hits[0][1];const reason=trade?'Os dois cortes chegaram juntos.':d.stateBefore==='recovery'?'O golpe errado abriu sua recuperação.':d.stateBefore==='parryRecovery'?'O parry terminou antes de o corte chegar.':d.stateBefore==='parry'?'O corte veio por fora da direção protegida.':d.stateBefore==='dash'?'O dash entrou no alcance do corte.':d.stateBefore==='stunned'?'O parry abriu espaço para o contra-ataque.':'O corte encontrou uma abertura.';this.finish(winner,reason,{x:d.x,y:d.y-C.bodyCenter,trade});}
 }
`+s.slice(end);
sub('Math.abs(a.y-b.y)>126','Math.abs(a.y-b.y)>126*SCALE');sub('overlap=35-Math.abs(dx)','overlap=35*SCALE-Math.abs(dx)');
sub("duration:stats(p).active,","duration:stats(p).active/this.rules.attackSpeed,");
sub("if(inp.attack)this.attack(i);else if(inp.parry)this.parry(i);else if(inp.dash)this.dash(i,inp.move);","if(inp.dash)this.dash(i,inp.move);if(inp.attack)this.attack(i);else if(inp.parry)this.parry(i);");
sub('f.y>C.deathY','f.y>this.map.deathY');
sub('const api={C,','const api={SCALE,slash,makeMap,pointInPolygon,polygonSegment,polygonsIntersect,C,');
write('engine.js',s);
s=read('controls.js').replace('f.y-79','f.y-DuelCore.C.bodyCenter');write('controls.js',s);
s=read('app.js').replace("release:'3.1'","release:'3.2'").replace('q(f.dashX),q(f.dashY),','q(f.dashX),q(f.dashY),q(f.dashRemaining),');
s=s.replace("function ruleValue(key,value){return key===", "function ruleValue(key,value){if(RULES[key]?.options)return RULES[key].options[Math.round(value*2)-1]+' · '+value.toFixed(1)+'×';return key===");
s=s.replace("const el=document.createElement('input');el.type='range';", "const el=document.createElement(r.options?'select':'input');if(r.options){for(let i=0;i<r.options.length;i++){const option=document.createElement('option');option.value=(i+1)*.5;option.textContent=ruleValue(k,(i+1)*.5);el.append(option);}}else el.type='range';");
s=s.replace("&&c.rules[k]<=RULES[k].max)","&&c.rules[k]<=RULES[k].max&&(!RULES[k].options||Number.isInteger(c.rules[k]*2)))");
s=s.replace("function showGame(){inMenu=false;","function showGame(){renderer.snapCamera=true;inMenu=false;");
s=s.replace("renderer.previousBlades=[[],[]];}","renderer.previousBlades=[[],[]];renderer.actorHistory=[];}");
s=s.replace("mapId:game.mapId,rules:","mapId:game.mapId,world:{width:game.map.width,height:game.map.height,platforms:game.map.platforms},rules:");
write('app.js',s);
s=read('network.js').replace('VERSION = 31','VERSION = 32').replaceAll('umcorte-v3-1-','umcorte-v3-2-').replaceAll('um-corte-v3-1','um-corte-v3-2');write('network.js',s);
s=read('shell.html').replaceAll('V3.1','V3.2').replaceAll('V3 ·','V3.2 ·');write('shell.html',s);
