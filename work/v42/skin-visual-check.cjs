const fs=require('fs'),path=require('path'),A=require('node:assert/strict'),{pathToFileURL}=require('url');
const {chromium}=require('C:/Users/Luiz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true}),p=await b.newPage({viewport:{width:1440,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));try{
 await p.goto(pathToFileURL(path.resolve(__dirname,'../../outputs/um-corte-v42.html')).href);await p.waitForFunction(()=>window.duelSnapshot);
 const data=await p.evaluate(({oldSkins,oldActors})=>{
  const newSkins=DuelSkins,newActors=DuelActors,entries=Object.entries(DuelCore.SKINS);
  const sheet=document.createElement('canvas');sheet.width=1440;sheet.height=790;const c=sheet.getContext('2d');c.fillStyle='#111b27';c.fillRect(0,0,1440,790);c.font='bold 23px monospace';c.fillStyle='#e9e4ce';c.fillText('UM CORTE IV  /  FIGURINOS DAS SKINS',32,38);
  const renderer=new DuelRenderer(document.createElement('canvas')),defaults=[[],[]];
  for(let row=0;row<2;row++){
   if(row===0){(0,eval)(oldSkins);(0,eval)(oldActors);}else{window.DuelSkins=newSkins;window.DuelActors=newActors;}
   for(const [kind]of entries)for(const pose of['idle','run','attack','parry','special']){const baseline=document.createElement('canvas');baseline.width=230;baseline.height=285;renderer.drawPortrait(baseline,kind,0,'jade',.3,'default',pose);defaults[row].push(baseline.toDataURL());}
   c.font='14px monospace';c.fillStyle=row?'#98cab7':'#8d9ca9';c.fillText(row?'AGORA  /  ROUPAS COMPLETAS':'ANTES',32,76+row*347);
   entries.forEach(([kind,skin],i)=>{const portrait=document.createElement('canvas');portrait.width=230;portrait.height=285;renderer.drawPortrait(portrait,kind,0,'jade',.3,skin.id,'idle');c.drawImage(portrait,i*240+5,87+row*347);c.font='bold 15px monospace';c.textAlign='center';c.fillStyle='#dcdccc';c.fillText(skin.reference.replace(' · Crazy Slots Nº 2',''),i*240+120,386+row*347);c.textAlign='left';});
  }
  window.DuelSkins=newSkins;window.DuelActors=newActors;
  if(defaults[0].some((img,i)=>img!==defaults[1][i]))throw Error('Original costume changed');
  const poster=sheet.toDataURL();
  // Exercise the actual animated actor renderer in both directions and every action.
  const motion=document.createElement('canvas');motion.width=1680;motion.height=1190;const m=motion.getContext('2d');m.fillStyle='#e0dac7';m.fillRect(0,0,motion.width,motion.height);const r=new DuelRenderer(document.createElement('canvas'));r.ctx=m;
  const states=['idle','startup','active','recovery','parry','dash','air','slide','kickActive','stunned','clash','dead'];let frames=0;
  for(const[k,skin]of entries){const g=new DuelCore.Game({characters:[k,k],skins:[skin.id,skin.id]});g.start();for(const facing of[-1,1])for(const state of states)for(let angle=0;angle<8;angle++)for(let step=0;step<5;step++){
   const f=g.fighters[0];Object.assign(f,{x:0,y:0,facing,aim:angle*Math.PI/4,attackAim:angle*Math.PI/4,state:['air','dash','slide','dead'].includes(state)?'idle':state,stateTime:step*.02,duration:.1,anim:step*1.3,vx:state==='dash'?facing*1000:state==='idle'?250:0,vy:state==='air'?-200:0,grounded:state!=='air',dashRemaining:state==='dash'?.1:0,dashX:facing,dashY:0,slideRemaining:state==='slide'?.1:0,dead:state==='dead',deathTime:state==='dead'?step*.1:0,move:facing,punch:step%2,guard:['normal','high','low'][step%3]});
   r.ctx=m;r.actorHistory=[];for(let warm=0;warm<4;warm++)DuelActors.state(r,f,step*.1+warm*.016,false);m.save();m.translate(140,190);r.fighter(f,step*.1+.05,DuelCore.blade(f));m.restore();frames++;
  }}
  m.fillStyle='#e0dac7';m.fillRect(0,0,motion.width,motion.height);
  entries.forEach(([k,skin],col)=>{const g=new DuelCore.Game({characters:[k,k],skins:[skin.id,skin.id]});g.start();const f=g.fighters[0];for(let row=0;row<5;row++){Object.assign(f,{x:0,y:0,facing:row===3?-1:1,aim:[-.15,-.8,1,-2.4,0][row],attackAim:[-.15,-.8,1,-2.4,0][row],state:row===0?'idle':row===4?'parry':'active',stateTime:.05,duration:.13,grounded:row!==2,anim:row*2,vx:row===1?300:0,vy:row===2?-250:0,dashRemaining:row===3?.1:0,dashX:-1,dashY:-.5,move:row===3?-1:1,guard:'high'});r.actorHistory=[];for(let warm=0;warm<30;warm++)DuelActors.state(r,f,warm*.016,false);m.save();m.translate(col*280+140,row*230+200);m.scale(1.25,1.25);r.fighter(f,.48,DuelCore.blade(f));m.restore();}m.fillStyle='#293b42';m.textAlign='center';m.font='14px monospace';m.fillText(skin.reference.replace(' · Crazy Slots Nº 2',''),col*280+140,1172);});
  const check=new DuelRenderer(document.createElement('canvas')),f={...duelSnapshot().fighters[0],skin:'default'};const a=DuelActors.state(check,f,0,false);f.skin='hollow';const z=DuelActors.state(check,f,.016,false);if(a===z)throw Error('skin change did not reset cloth');
  return{poster,motion:motion.toDataURL(),frames};
 },{oldSkins:fs.readFileSync(path.join(__dirname,'archive-before-skin-refinement/skins.js'),'utf8'),oldActors:fs.readFileSync(path.join(__dirname,'archive-before-skin-refinement/actors.js'),'utf8')});
 fs.writeFileSync(path.join(__dirname,'skin-comparison.png'),Buffer.from(data.poster.split(',')[1],'base64'));fs.writeFileSync(path.join(__dirname,'skin-motion.png'),Buffer.from(data.motion.split(',')[1],'base64'));A.deepEqual(errors,[]);console.log(data.frames+' rendered skin/action/direction frames; cloth reset verified; no browser errors');
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
