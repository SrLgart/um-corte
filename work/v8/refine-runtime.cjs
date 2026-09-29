const fs=require('fs'),p=__dirname;function edit(file,fn){const s=fs.readFileSync(p+'/'+file,'utf8');fs.writeFileSync(p+'/'+file,fn(s));}
edit('legacy-combat.js',s=>s.replace(/ if\(fx\.inverted\)\{const b=body\(f\),ceiling=.*?if\(f\.y<-120\)f\.y=-120;\}\r?\n/,'').replace('else abilityHit(g,e,t,old);','else if(e.type!==\'echo\')abilityHit(g,e,t,old);').replace("const l=ensure(f),fx=l.effects,p=center(f),a=f.aim,target=", "const l=ensure(f),fx=l.effects,p=center(f),a=Number.isFinite(inp.aim)?inp.aim:f.aim,target="));
edit('v8-detail.js',s=>s.replace("has(f,'needle')&&f.state", "L.weaponId(f)==='needle'&&f.state"));
edit('path.js',s=>s.replace("L.effect(this,d,'defeat');if(has(a", "L.effect(this,d,'defeat');root.DuelV8Detail?.killed(this,a,d);if(has(a"));
edit('room-test.cjs',s=>s.replaceAll('umcorte-v7-','umcorte-v8-').replaceAll('v:72','v:8'));
edit('v72-test.cjs',s=>s.replace('Object.keys(D.MAPS)', 'Object.keys(D.MAPS).filter(id=>!id.startsWith(\'path_\'))'));
edit('test-all.cjs',s=>s.replace("'tournament-test.cjs'", "'tournament-test.cjs','legacy-test.cjs','legacy-online-test.cjs'").replace('[path.join(__dirname,file)]',"['--require',path.join(__dirname,'bootstrap.cjs'),path.join(__dirname,file)]").replaceAll("'v72-'","'v8-'").replaceAll('um-corte-v7.2','um-corte-v8'));
console.log('Runtime refinements and V8 regression runner updated.');
