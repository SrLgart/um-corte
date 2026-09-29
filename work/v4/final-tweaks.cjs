const fs=require('fs'),path=require('path'),p=n=>path.join(__dirname,n);
let engine=fs.readFileSync(p('engine.js'),'utf8');
engine=engine.replace("if(duration===0&&['recovery','parryRecovery','dashRecovery','stunned'].includes(state))f.state='idle';", "if(f.duration===0&&['recovery','parryRecovery','dashRecovery','slideRecovery','stunned'].includes(f.state))f.state='idle';");
engine=engine.replace('f.parryCooldown=f.duration+this.rules.parryRecovery/1000;', 'f.parryCooldown=(this.rules.parryWindow+this.rules.parryRecovery)/1000;');
fs.writeFileSync(p('engine.js'),engine);
let app=fs.readFileSync(p('app.js'),'utf8');
app=app.replace("number.step='any';", "number.step=k==='dashCount'?'1':'any';").replace("r.name+' em multiplicador'", "r.name+(r.unit?' em '+r.unit:' em multiplicador')");
fs.writeFileSync(p('app.js'),app);
let admin=fs.readFileSync(p('admin.html'),'utf8').replace('.admin-console .secondary{color:#dedec9;', '.admin-console .secondary{background:#304650;color:#f0e7d0;');
fs.writeFileSync(p('admin.html'),admin);
for(const name of['local-check.cjs','navigation-check.cjs','stress-pixels-check.cjs']){
 let s=fs.readFileSync(p('../v3/'+name),'utf8').replaceAll('um-corte-v3.html','um-corte-v4.html');
 if(name==='stress-pixels-check.cjs')s=s.replace('dash:i%1700===0','dash:i%1700===0,special:i%100===0').replace("for(const map of Object.keys(MAPS))for(const a", "for(const k of Object.keys(CLASSES))for(const map of Object.keys(MAPS))run(k,k,map,'normal',{specials:true,specialCooldown:.25,dashCount:5});for(const map of Object.keys(MAPS))for(const a");
 fs.writeFileSync(p(name),s);
}
