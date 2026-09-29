const fs=require('node:fs'),path=require('node:path'),p=path.join(__dirname,'engine.js');let s=fs.readFileSync(p,'utf8');
s=s.replace('inp.move=Math.abs(dx)>9?Math.sign(dx):0;','inp.jump=false;inp.down=false;inp.move=Math.abs(dx)>9?Math.sign(dx):0;');
s=s.replace('ai.navTarget=next;ai.jumpDelay=.25;}','ai.navTarget=next;ai.jumpDelay=.25;}else if(Math.abs(dx)<=launch)inp.move=0;return true;');
s=s.replace('inp.move=Math.abs(dx)>12?Math.sign(dx):0;inp.jumpHeld=e.vy<0;','inp.move=clamp(dx*.025-e.vx*.002,-1,1);inp.jumpHeld=e.vy<0;return true;');
s=s.replace('  inp.move=ai.intent;\n  if(e.grounded','  inp.move=ai.intent;\n  const navigating=(dist>s.reach-15||Math.abs(dy)>85)&&this.navigateAI(e,p,inp);\n  if(!navigating&&e.grounded');
s=s.replace('  if(!e.grounded&&e.vy>0)','  if(!navigating&&!e.grounded&&e.vy>0)');
s=s.replace('  if(dist>s.reach-15||Math.abs(dy)>85)this.navigateAI(e,p,inp);\n','');
fs.writeFileSync(p,s);
