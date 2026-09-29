const fs=require('fs'),root='work/v6/';
function edit(file,old,next){let s=fs.readFileSync(root+file,'utf8');if(!s.includes(old))throw Error(file+' missing '+old.slice(0,70));fs.writeFileSync(root+file,s.replace(old,next));}
edit('engine.js','s?.version!==50','s?.version!==60');
edit('engine.js',"Game.prototype.finish=function(winner,reason,data={}){const finisher=", "Game.prototype.finish=function(winner,reason,data={}){if(this.phase!=='playing')return;const finisher=");
edit('engine.js',"return v6original.adminApply.call(this,change);};", "const out=v6original.adminApply.call(this,change);if(change.action!=='refill')this.propStates=(this.map.decor||[]).map(()=>({hitAt:-100,side:1,broken:false,attacks:[-1,-1]}));return out;};");
edit('renderer.js',"c.globalAlpha=this.reduced?.08:.62;c.fillStyle='#f4efd9';", "const perfect=effects.perfect>0;c.globalAlpha=this.reduced?.08:perfect?.98:.62;c.fillStyle=perfect?'#081b30':'#f4efd9';");
edit('renderer.js',"c.filter='brightness(0)';", "c.filter=perfect?'brightness(0) invert(1)':'brightness(0)';");
edit('renderer.js',"const rays=this.reduced?3:8;", "const rays=this.reduced?3:perfect?16:8;");
edit('renderer.js',"i%2?'#263640':'#b99249'", "perfect?(i%2?'#efffff':'#72d7ff'):(i%2?'#263640':'#b99249')");
edit('app.js',"burst(ev.x,ev.y,12,'#fff2b6');", "burst(ev.x,ev.y,ev.perfect?20:12,ev.perfect?'#c1f3ff':'#fff2b6');");
edit('menu-fx.js',"this.blockUntil=0;", "this.suppressClick=false;");
edit('menu-fx.js',"pointerup',()=>{this.pressed=false;}", "pointerup',()=>{this.pressed=false;this.cutting=false;}");
edit('menu-fx.js',"if(performance.now()<this.blockUntil&&e.detail!==0){e.preventDefault();e.stopImmediatePropagation();}", "if(this.suppressClick&&e.detail!==0){this.suppressClick=false;e.preventDefault();e.stopImmediatePropagation();}");
edit('menu-fx.js',"down(e){if(e.button", "down(e){this.suppressClick=false;if(e.button");
edit('menu-fx.js',"this.blockUntil=now+400;", "this.suppressClick=true;");
// Environmental particles stay on their own layer, behind menu content.
edit('menu-fx.js',"this.canvas=document.getElementById('menu-trail');", "this.canvas=document.getElementById('menu-trail');this.environment=document.createElement('canvas');this.environment.id='menu-environment';document.getElementById('menu').prepend(this.environment);");
edit('menu-fx.js',"for(const c of[this.canvas,this.art])", "for(const c of[this.canvas,this.art,this.environment])");
edit('menu-fx.js',"if(active){if(this.objects.length", "const env=this.title.hidden?this.environment.getContext('2d'):this.art.getContext('2d');if(this.title.hidden)env.clearRect(0,0,w,h);if(active){if(this.objects.length");
let menu=fs.readFileSync(root+'menu-fx.js','utf8');const start=menu.indexOf('for(const p of this.objects){if(!this.hooks.reduced())'),end=menu.indexOf('this.trail=this.trail.filter',start);menu=menu.slice(0,start)+menu.slice(start,end).replace(/\bc\./g,'env.')+menu.slice(end);fs.writeFileSync(root+'menu-fx.js',menu);
edit('presentation.js',"const tense=r.gameView?.score.some", "const tense=r.gameView?.score.some"); // checked below
edit('presentation.js',"if(quiet&&r.gameView.time-", "if(quiet&&r.gameView&&r.gameView.time-");
edit('presentation.js',"if(e.animation==='tense')f.visualCrouch=4;", "if(e.animation==='tense')f.visualCrouch=4;w=D.blade(f);");
edit('presentation.js',"if(kind==='reaper')c.arc", "if(p.cause==='QUEDA'){c.moveTo(640,260);c.lineTo(640,260+u*220);c.moveTo(620,460+u*20);c.lineTo(640,480+u*20);c.lineTo(660,460+u*20);}else if(kind==='reaper')c.arc");
edit('presentation.js',"c.fillText('O ÚLTIMO CORTE',640,590)", "c.fillText(p.cause==='QUEDA'?'A ÚLTIMA QUEDA':'O ÚLTIMO CORTE',640,590)");
// Random cosmetic gestures: different delay and variant after each rest, reset on input.
edit('presentation.js',"still:0,aim:f.aim", "still:0,aim:f.aim,next:4+Math.random()*3,variant:0,gesture:-10");
edit('presentation.js',"h.still=quiet?h.still+dt:0;h.aim", "h.still=quiet?h.still+dt:0;if(!quiet){h.next=4+Math.random()*3;h.gesture=-10;}h.aim");
edit('presentation.js',"if(quiet&&!tense&&h.still>4){const cycle=(h.still-4)%(6+f.id*.7),phase=cycle/1.15;if(phase<1){const v=Math.sin(phase*Math.PI),variant=Math.floor((h.still-4)/(6+f.id*.7))%2;", "if(quiet&&!tense){if(h.still>=(h.next??4)){h.gesture=h.still;h.next=h.still+4+Math.random()*3;h.variant=1-(h.variant||0);}const phase=(h.still-(h.gesture??-10))/1.15;if(phase>=0&&phase<1){const v=Math.sin(phase*Math.PI),variant=h.variant;");
edit('presentation.js',"still:4+age%1.2,aim:f.aim", "still:4+age%1.2,aim:f.aim,next:100,gesture:4,variant:0");
edit('editor.js',"for(const[k,v]of Object.entries(DuelScenery.THEMES)){", "for(const[k,v]of Object.entries(DuelScenery.THEMES)){if(['bells','rooftops'].includes(k))continue;");
edit('editor.js',"ctx.fillStyle=this.picked?.list==='decor'&&this.picked.index===i?'#ffc788':'#91acbf';ctx.fillRect(p.x-d.w/2,p.y,d.w,d.h);ctx.font='12px monospace';ctx.fillStyle='#0c1929';ctx.fillText(d.name,p.x-d.w/2+2,p.y+16);", "this.decorRenderer??=new DuelRenderer(c);this.decorRenderer.ctx=ctx;DuelPresentation.prop(this.decorRenderer,p,null,0);if(this.picked?.list==='decor'&&this.picked.index===i){ctx.strokeStyle='#ffc788';ctx.lineWidth=2/sx;ctx.strokeRect(p.x-d.w/2-4,p.y-4,d.w+8,d.h+8);}ctx.font='12px monospace';ctx.fillStyle='#f0d5b4';ctx.fillText(d.name,p.x-d.w/2,p.y-10);");
fs.appendFileSync(root+'v6.css','\n#menu{isolation:isolate}#menu-environment{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:-1}\n');
