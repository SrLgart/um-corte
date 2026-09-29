const fs=require('node:fs'),path=require('node:path');
function read(file){return fs.readFileSync(path.join(__dirname,file),'utf8');}function save(file,s){fs.writeFileSync(path.join(__dirname,file),s);}function replace(file,a,b){const s=read(file);if(!s.includes(a))throw new Error('Missing in '+file+': '+a.slice(0,70));save(file,s.replace(a,b));}function between(file,start,end,text){const s=read(file),a=s.indexOf(start),b=s.indexOf(end,a);if(a<0||b<0)throw new Error('Missing section '+file);save(file,s.slice(0,a)+text+s.slice(b));}
replace('build.cjs',"['CONTROLS','controls.js'],['RENDERER','renderer.js']","['CONTROLS','controls.js'],['SCENERY','scenery.js'],['WEAPONS','weapons.js'],['RENDERER','renderer.js']");
replace('shell.html','<script>/* RENDERER */</script>','<script>/* SCENERY */</script><script>/* WEAPONS */</script><script>/* RENDERER */</script>');
replace('shell.html','UM CORTE III — O duelo ganha o ar','UM CORTE III · 3.1 — Novas fronteiras');
replace('shell.html','<span>O DUELO GANHA O AR.</span>','<span>V3.1 · NOVAS FRONTEIRAS.</span>');
replace('shell.html','Ambos abrem a V3.','Ambos abrem esta versão V3.1.');
replace('shell.html','<div id="rules-grid" class="rules-grid"></div>','<div class="parry-options"><div><strong>Quanto tempo o parry fica ativo?</strong><p>Um toque mantém a defesa pelo tempo escolhido. Não precisa segurar. Um bloqueio bem-sucedido libera seu contra-ataque.</p></div><div id="parry-presets" class="parry-presets" role="group" aria-label="Duração do parry"></div></div><div id="rules-grid" class="rules-grid"></div>');
between('renderer.js',' background(game,t){',' fighter(f,time,w,portrait=false){'," background(game,t){DuelScenery.draw(this,game,t);}\n platforms(game,t){DuelScenery.platforms(this,game,t);}\n");
between('renderer.js',' sword(f,w,t,portrait=false){',' render(game,effects,t){'," sword(f,w,t,portrait=false){DuelWeapons.draw(this,f,w,t,portrait);}\n");
replace('renderer.js',"render(game,effects,t){this.resize();", "render(game,effects,t){if(this.lastTheme!==game.mapId){this.lastTheme=game.mapId;if(this.canvas.parentElement){this.canvas.parentElement.dataset.theme=game.mapId;this.canvas.parentElement.classList.toggle('dark-arena',!!DuelScenery.THEMES[game.mapId]?.dark);}}this.resize();");
replace('renderer.js',"c.save();if(f.dead){", "c.save();if(DuelScenery.THEMES[this.lastTheme]?.dark&&!portrait){c.shadowColor='#c3ded088';c.shadowBlur=1.5;}if(f.dead){");
replace('app.js',"function config(){", "function ruleValue(key,value){return key==='parryWindow'?Math.round(value*150)+' ms':value.toFixed(1)+'×';}\nfunction config(){");
replace('app.js',"b.dataset.map=k;b.setAttribute", "b.dataset.map=k;b.dataset.theme=k;b.setAttribute");
replace('app.js',"preview.className='map-preview';for(const p of m.platforms)", "preview.className='map-preview';const theme=DuelScenery.THEMES[k];preview.style.background='linear-gradient('+theme.sky[0]+','+theme.sky[1]+')';preview.style.setProperty('--map-edge',theme.edge);preview.style.setProperty('--map-stone',theme.surface);const orb=document.createElement('b');orb.className='map-orb';preview.append(orb);for(const p of m.platforms)");
replace('app.js',"title.textContent=m.name;const desc", "title.textContent=m.name;const tag=document.createElement('em');tag.textContent=theme.tag;title.append(tag);const desc");
between('app.js','function renderRules(){','function preview(){',`function renderRules(){
 const parent=$('rules-grid');parent.replaceChildren();
 for(const[k,r]of Object.entries(RULES)){
  const label=document.createElement('label');label.textContent=r.name;label.htmlFor='rule-'+k;const out=document.createElement('output');out.textContent=ruleValue(k,selected.rules[k]);out.id='value-'+k;
  const el=document.createElement('input');el.type='range';el.min=r.min;el.max=r.max;el.step=r.step;el.value=selected.rules[k];el.id='rule-'+k;el.disabled=configLocked();el.setAttribute('aria-valuetext',ruleValue(k,selected.rules[k]));
  el.oninput=()=>{out.textContent=ruleValue(k,+el.value);el.setAttribute('aria-valuetext',out.textContent);};el.onchange=()=>{selected.rules[k]=+el.value;rulesChanged();};label.append(out,el);parent.append(label);
 }
 const presets=$('parry-presets');presets.replaceChildren();for(const[value,name]of[[1,'Preciso'],[2,'Confortável'],[4,'Longo'],[8,'Estendido']]){const b=document.createElement('button');b.type='button';b.className='parry-preset'+(selected.rules.parryWindow===value?' selected':'');b.dataset.parry=value;b.disabled=configLocked();b.setAttribute('aria-pressed',String(selected.rules.parryWindow===value));const title=document.createElement('strong');title.textContent=name;const time=document.createElement('span');time.textContent=ruleValue('parryWindow',value);b.append(title,time);b.onclick=()=>{selected.rules.parryWindow=value;rulesChanged();};presets.append(b);}
 $('air-dash').checked=selected.rules.airDash;$('air-dash').disabled=configLocked();$('reset-rules').disabled=configLocked();const count=Object.keys(DEFAULT_RULES).filter(k=>selected.rules[k]!==DEFAULT_RULES[k]).length;$('rules-summary').textContent=(count?count+' AJUSTES':'REGRAS PADRÃO')+' · PARRY '+ruleValue('parryWindow',selected.rules.parryWindow);$('host-note').textContent=lobby?'MAPA E REGRAS DO ANFITRIÃO':'SEIS ARENAS · SEIS ATMOSFERAS';
}
`);
replace('app.js',"RULES[k].name+' '+l.config.rules[k].toFixed(1)+'×'", "RULES[k].name+' '+ruleValue(k,l.config.rules[k])");
replace('app.js',"version:3,mode:selected.mode", "version:3,release:'3.1',mode:selected.mode");
replace('network.js',"label: 'um-corte-v3'", "label: 'um-corte-v3-1'");
replace('stress-check.cjs',"all 25 class pairings, 3 arenas, 4 difficulties", "all 25 class pairings, '+Object.keys(MAPS).length+' arenas, 4 difficulties");
console.log('Integrated themed arenas, weapon models and extended parry options.');
