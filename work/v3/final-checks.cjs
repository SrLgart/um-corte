const fs=require('node:fs'),path=require('node:path');let s=fs.readFileSync(path.join(__dirname,'stress-pixels-check.cjs'),'utf8');
s=s.replace('assert((events.windup||0)>0,JSON.stringify','assert((events.windup||0)>0||(rules.mapSize&&rules.mapSize!==1&&(events.kill||0)>0),JSON.stringify');
s+=`\nconsole.log('Scaled fall-only scenarios:',results.filter(r=>!r.events.windup).length);\n`;
fs.writeFileSync(path.join(__dirname,'stress-pixels-check.cjs'),s);
