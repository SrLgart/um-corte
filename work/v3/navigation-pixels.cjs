const fs=require('node:fs'),path=require('node:path');let s=fs.readFileSync(path.join(__dirname,'engine.js'),'utf8');
s=s.replace('this.map=makeMap(this.mapId,this.rules.mapSize);','this.map=makeMap(this.mapId,this.rules.mapSize);this.routeCache=new Map();');
s=s.replace('jumpDelay:.6,bait:false','jumpDelay:.6,bait:false,navTarget:-1');
const marker=' updateAI(dt)';
s=s.replace(marker,` nextPlatform(f,goal){const key=f.kind+':'+f.platform+':'+goal;if(this.routeCache.has(key))return this.routeCache.get(key);const ps=this.map.platforms,start=f.platform,cost=ps.map(()=>Infinity),prev=ps.map(()=>-1),open=new Set(ps.map((_,i)=>i));cost[start]=0;const speed=stats(f).speed*this.rules.speed,jump=940*this.rules.jump,gravity=1980*this.rules.gravity;
  while(open.size){let i=-1;for(const j of open)if(i<0||cost[j]<cost[i])i=j;if(!Number.isFinite(cost[i])||i===goal)break;open.delete(i);const a=ps[i];for(const j of open){const b=ps[j],rise=a.y-b.y,disc=jump*jump-2*gravity*rise;if(disc<0)continue;const gap=Math.max(0,Math.max(a.x,b.x)-Math.min(a.x+a.w,b.x+b.w)),flight=(jump+Math.sqrt(disc))/gravity;if(gap+38>speed*flight*.88)continue;const candidate=cost[i]+gap+Math.abs(rise)*.3+65;if(candidate<cost[j]){cost[j]=candidate;prev[j]=i;}}}
  let next=goal;if(prev[next]<0)next=-1;else while(prev[next]!==start&&prev[next]>=0)next=prev[next];this.routeCache.set(key,next);return next;
 }
 navigateAI(e,p,inp){const ai=this.ai,ps=this.map.platforms,s=stats(e);if(e.grounded){ai.navTarget=-1;if(e.platform<0)return;const goal=p.grounded?p.platform:ps.findIndex(q=>p.y<=q.y+20&&p.x>=q.x&&p.x<=q.x+q.w);if(goal<0||goal===e.platform)return;const next=this.nextPlatform(e,goal);if(next<0)return;const q=ps[next],target=clamp(e.x,q.x+30,q.x+q.w-30),dx=target-e.x,rise=e.y-q.y,disc=(940*this.rules.jump)**2-2*1980*this.rules.gravity*rise;if(disc<0)return;const flight=(940*this.rules.jump+Math.sqrt(disc))/(1980*this.rules.gravity),launch=Math.min(190,s.speed*this.rules.speed*flight*.67);inp.move=Math.abs(dx)>9?Math.sign(dx):0;
   if(Math.abs(dx)<=launch&&ai.jumpDelay<=0&&!['stunned','clash'].includes(e.state)){inp.jump=true;inp.jumpHeld=true;inp.down=false;ai.navTarget=next;ai.jumpDelay=.25;}
  }else if(ai.navTarget>=0){const q=ps[ai.navTarget];if(!q||e.y>q.y+30&&e.vy>0){ai.navTarget=-1;return;}const target=clamp(p.x,q.x+38,q.x+q.w-38),dx=target-e.x;inp.move=Math.abs(dx)>12?Math.sign(dx):0;inp.jumpHeld=e.vy<0;}
 }
`+marker);
s=s.replace('  return inp;\n }\n step', '  if(dist>s.reach-15||Math.abs(dy)>85)this.navigateAI(e,p,inp);\n  return inp;\n }\n step');
fs.writeFileSync(path.join(__dirname,'engine.js'),s);
