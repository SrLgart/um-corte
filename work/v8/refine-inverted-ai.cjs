// One-time source migration. Do not rerun after applying.
const fs=require('node:fs'),p=__dirname+'/path.js';let s=fs.readFileSync(p,'utf8');
function edit(a,b){if(!s.includes(a))throw Error('Missing: '+a);s=s.replace(a,b);}
edit('f.y-150)){inp.jump','f.y-150*(f.legacy?.effects.inverted?-1:1))){inp.jump');
edit("Math.abs(q.y-dropped.y)<15),oldAI=g.ai;g.ai=b;try{g.navigateAI(f,{x:dropped.x,y:dropped.y+3,platform,grounded:platform>=0},inp);}finally{g.ai=oldAI;}if(dropped.y<f.y-90)","Math.abs(q.y-dropped.y)<15);L.navigate(g,f,{x:dropped.x,y:dropped.y+3,platform,grounded:platform>=0,inverted:false},inp);if((dropped.y-f.y)*(l.effects.inverted?-1:1)<-90)");
edit('platform:live.platform,facing:live.facing','platform:live.platform,inverted:!!live.legacy?.effects.inverted,facing:live.facing');
edit('ranged=!!L.WEAPONS[L.weaponId(f)]?.shot','ranged=!L.mirrorWeapon(f)&&!!L.WEAPONS[L.weaponId(f)]?.shot');
edit('inp.aim=Math.atan2(dy,dx);inp.jumpHeld=f.vy<0;', 'const nav=L.navigationFrame(g,f,p),nf=nav.actor,ndy=dy*nav.sign;inp.aim=Math.atan2(dy,dx);inp.jumpHeld=nf.vy<0;');
edit('const oldAI=g.ai;g.ai=b;let navigating=false;if(dist>reach+25||Math.abs(dy)>100||b.navTarget>=0){try{navigating=g.navigateAI(f,p,inp);}finally{g.ai=oldAI;}}else g.ai=oldAI;', 'let navigating=false;if(dist>reach+25||Math.abs(dy)>100||b.navTarget>=0)navigating=L.navigate(g,f,p,inp);');
edit('f.vy>-120&&dy<-140','nf.vy>-120&&ndy<-140');
edit('!f.grounded&&dy>160&&!threat','!f.grounded&&ndy>160&&!threat');
edit('if(f.grounded&&dy<-90','if(f.grounded&&ndy<-90');
edit("gravitycloak:l.effects.inverted?dy>50||l.airTime>1.2:dy<-150&&g.map.platforms.some(q=>q.stage!=='gone'&&f.x>q.x+30&&f.x<q.x+q.w-30&&q.y<f.y-100&&q.y>f.y-340)", 'gravitycloak:gravityIntent(g,f,p)');
edit("supported=g.map.platforms.some(q=>q.stage!=='gone'&&ahead>=q.x+8&&ahead<=q.x+q.w-8&&Math.abs(q.y-f.y)<35)","supported=nav.map.platforms.some(q=>q.stage!=='gone'&&ahead>=q.x+8&&ahead<=q.x+q.w-8&&Math.abs(q.y-nf.y)<35)");
edit("b.jump<=0&&g.map.platforms.some(q=>q.stage!=='gone'&&Math.abs(q.x+q.w/2-f.x)<420&&q.y>f.y-230)","b.jump<=0&&nav.map.platforms.some(q=>q.stage!=='gone'&&Math.abs(q.x+q.w/2-f.x)<420&&q.y>nf.y-230)");
edit("if(!f.grounded&&f.vy>0&&!navigating){const below=g.map.platforms.filter(q=>q.stage!=='gone'&&q.y>=f.y-10)","if(!f.grounded&&nf.vy>0&&!navigating){const below=nav.map.platforms.filter(q=>q.stage!=='gone'&&q.y>=nf.y-10)");
fs.writeFileSync(p,s);
