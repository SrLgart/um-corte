(function(){
'use strict';
const THEMES={
 dojo:{tag:'PÔR DO SOL',sky:['#e9e5d9','#edd9bd','#a4b4a6'],hills:['#c7c6b6','#afb8a7','#91a595'],surface:'#858573',side:'#7c816d',edge:'#344d40',top:'#e5d9b9',detail:'#566b52',mist:'#d5d4bd',dark:false},
 bridge:{tag:'DESFILADEIRO',sky:['#d2cfcc','#dbb59a','#b98973'],hills:['#b79f95','#a5877a','#796e68'],surface:'#8b6d57',side:'#735849',edge:'#403c35',top:'#dab991',detail:'#4e4c3e',mist:'#bea18d',dark:false},
 ruins:{tag:'VALE ESQUECIDO',sky:['#d5e0cc','#c3d3b0','#8da990'],hills:['#afc2a4','#91ad93','#749b87'],surface:'#8e9980',side:'#72816c',edge:'#385846',top:'#c7d3ac',detail:'#426c4b',mist:'#b9ceb0',dark:false},
 bamboo:{tag:'NOITE DE LUAR',sky:['#172d46','#476078','#6d8f8b'],hills:['#344d64','#3b5c6b','#426d71'],surface:'#607266',side:'#465c55',edge:'#1f393e',top:'#adc9b1',detail:'#2d514b',mist:'#779d9a',dark:true},
 frost:{tag:'INVERNO',sky:['#a8c6d9','#dce9ea','#b1c5d2'],hills:['#b1c8d5','#91abba','#7794a7'],surface:'#849ba9',side:'#657e91',edge:'#3c5b72',top:'#f3f6ea',detail:'#425d76',mist:'#d4e7ea',dark:false},
 forge:{tag:'CINZAS E BRASAS',sky:['#342f40','#795454','#cc8760'],hills:['#58424d','#69484b','#624848'],surface:'#665c5b',side:'#453e46',edge:'#282b36',top:'#d0a78b',detail:'#2d303b',mist:'#bf7e60',dark:true}
};
class DuelScenery{
 static tower(r,s,t,off){const c=r.ctx;this.sky(r,s);r.ellipse(990+off,180,80,80,'#eac895');this.hills(r,s,t,off);for(const x of[120,280,1000,1160]){r.path([[x+off,600],[x+off,170],[x+60+off,120],[x+110+off,170],[x+110+off,600]],'#46405766');for(let y=220;y<550;y+=80)r.path([[x+35+off,y+30],[x+35+off,y],[x+55+off,y-18],[x+75+off,y],[x+75+off,y+30]],'#262c4444');}for(const x of[574,706])r.line({x,y:0},{x,y:620},'#63584f55',2);r.path([[599,90],[606,52],[623,32],[657,32],[674,52],[681,90],[690,102],[590,102]],'#a78964');r.line({x:640,y:0},{x:640,y:32},'#47434e',4);r.ellipse(640,109,8,8,'#534957');this.mist(r,s.mist,.3);}
 static sky(r,theme){const c=r.ctx,g=c.createLinearGradient(0,0,0,720);g.addColorStop(0,theme.sky[0]);g.addColorStop(.58,theme.sky[1]);g.addColorStop(1,theme.sky[2]);c.fillStyle=g;c.fillRect(0,0,1280,720);}
 static hills(r,theme,t,offset=0){for(let layer=0;layer<3;layer++){const pts=[[-30,740]],shift=offset*(.18+layer*.12);for(let x=-90;x<1420;x+=70)pts.push([x+shift,350+layer*76+Math.sin(x*.01+layer*2)*24+Math.sin(x*.023+layer)*15]);pts.push([1360,740]);r.path(pts,theme.hills[layer]);}}
 static mist(r,color,alpha=.45){const c=r.ctx,g=c.createLinearGradient(0,510,0,720);g.addColorStop(0,color+'00');g.addColorStop(1,color);c.globalAlpha=alpha;c.fillStyle=g;c.fillRect(0,510,1280,210);c.globalAlpha=1;}
 static draw(r,game,t){const theme=THEMES[game.mapId]||THEMES.dojo,c=r.ctx,offset=(640-r.camera.x)*.12,time=r.reduced?0:t;this.sky(r,theme);
  if(game.mapId==='tower')this.tower(r,theme,time,offset);
  else if(game.mapId==='bamboo')this.bamboo(r,theme,time,offset);
  else if(game.mapId==='frost')this.frost(r,theme,time,offset);
  else if(game.mapId==='forge')this.forge(r,theme,time,offset);
  else if(game.mapId==='bridge')this.bridge(r,theme,time,offset);
  else if(game.mapId==='ruins')this.ruins(r,theme,time,offset);
  else this.dojo(r,theme,time,offset);
  c.globalAlpha=1;
 }
 static dojo(r,s,t,off){const c=r.ctx;r.ellipse(974+off,225,72,72,'#c97655');c.fillStyle='#ecdbc4';c.fillRect(880,244,180,3);c.fillRect(930,265,140,2);this.hills(r,s,t,off);for(let i=0;i<4;i++){const x=700+i*28+Math.sin(t*.1)*20,y=175+i%2*15;r.path([[x-6,y-3-Math.sin(t*2+i)*2],[x,y],[x+6,y-3-Math.sin(t*2+i)*2]],null,'#768373',1.2);}this.mist(r,s.mist);r.path([[0,0],[1280,0],[1280,17],[900,14],[620,22],[100,14],[0,24]],'#344c40');r.path([[0,0],[17,0],[12,480],[0,540]],'#405949');r.path([[1267,0],[1280,0],[1280,540],[1271,460]],'#405949');
  // Cropped cherry branches frame the action; petals stay behind the fighters.
  for(const side of[0,1]){c.save();c.translate(side?1280:0,0);c.scale(side?-1:1,1);r.path([[0,120],[57,167],[137,184],[232,178]],null,'#6c6960',8);r.path([[58,168],[104,122],[155,108]],null,'#6c6960',4);for(let i=0;i<18;i++)r.ellipse(30+(i*41)%194,124+(i*29)%70,12+i%4,5,'#d6aa98');c.restore();}for(let i=0;i<10;i++){c.globalAlpha=.3;r.ellipse((i*133+t*12)%1310,230+(i*37+t*8)%330,3,1.5,'#f4ceb5');}c.globalAlpha=1;
 }
 static bridge(r,s,t,off){const c=r.ctx;c.globalAlpha=.45;for(let i=0;i<6;i++)r.ellipse((i*251+t*3)%1470-90,125+(i%3)*34,150,13,'#ede0d1');c.globalAlpha=1;
  for(let layer=0;layer<3;layer++){const shade=s.hills[layer],base=330+layer*90,spread=250-layer*40;r.path([[-40,190+layer*60],[130+off,base-130],[270+off,base-70],[420+layer*35,base],[430-spread*.3,760],[-40,760]],shade);r.path([[1320,210+layer*50],[1120+off,base-155],[975+off,base-78],[875-layer*33,base+10],[915+spread*.3,760],[1320,760]],shade);}
  c.globalAlpha=.26;for(let i=0;i<22;i++){const y=270+i*18;r.line({x:60,y},{x:320-i%4*14,y:y+22},'#efd4b1',1);r.line({x:970+i%3*20,y:y+40},{x:1260,y:y+22},'#efd4b1',1);}c.globalAlpha=1;this.mist(r,s.mist,.6);
  // A distant broken rope bridge reinforces the depth of the gorge.
  c.globalAlpha=.35;for(const y of[480,493]){c.beginPath();c.moveTo(275,y);c.quadraticCurveTo(600,y+85,648,y+44);c.strokeStyle='#4d5047';c.lineWidth=2;c.stroke();c.beginPath();c.moveTo(690,y+40);c.quadraticCurveTo(895,y+52,1020,y-3);c.stroke();}for(let i=0;i<26;i++){const x=295+i*27;if(x>610&&x<730)continue;const y=490+Math.sin((x-270)/760*Math.PI)*41;r.line({x,y},{x:x-4,y:y+17},'#4d5047',4);}c.globalAlpha=1;
 }
 static ruins(r,s,t,off){const c=r.ctx;this.hills(r,s,t,off);c.globalAlpha=.35;for(const[x,y,w,h]of[[70,230,270,300],[520,150,230,365],[960,250,220,295]]){const xx=x+off;c.fillStyle='#607d68';c.fillRect(xx,y+55,24,h);c.fillRect(xx+w-24,y+55,24,h);c.beginPath();c.arc(xx+w/2,y+70,w/2,Math.PI,0);c.lineWidth=20;c.strokeStyle='#607d68';c.stroke();for(let yy=y+100;yy<y+h;yy+=40){r.line({x:xx,y:yy},{x:xx+24,y:yy+2},'#ced2b1',1);r.line({x:xx+w-24,y:yy},{x:xx+w,y:yy+2},'#ced2b1',1);}}
  c.globalAlpha=.3;for(let i=0;i<18;i++){const x=i*83+off;r.path([[x,570],[x+7,210+i%5*30],[x+23,205+i%5*30],[x+30,570]],'#3c7057');r.ellipse(x+15,215+i%5*30,67,22,'#5f8e65');}c.globalAlpha=1;this.mist(r,s.mist,.5);for(let i=0;i<18;i++){const x=(i*79+t*9)%1280,y=300+(i*31)%320+Math.sin(t+i)*7;c.globalAlpha=.24;r.path([[x-3,y],[x+2,y-2],[x+5,y+1],[x,y+2]],'#d1dcb1');}c.globalAlpha=1;
 }
 static bamboo(r,s,t,off){const c=r.ctx;for(let i=0;i<55;i++){c.globalAlpha=.18+(i%4)*.1;r.ellipse((i*197)%1280,40+(i*43)%250,i%3?.8:1.3,i%3?.8:1.3,'#dfecdf');}c.globalAlpha=1;r.ellipse(963+off,171,54,54,'#dde5c9');r.ellipse(943+off,157,51,51,s.sky[0]);this.hills(r,s,t,off);
  for(let layer=0;layer<2;layer++){c.globalAlpha=layer?.52:.28;for(let i=0;i<17;i++){const x=i*89+(layer?24:-15)+off*(layer+1),height=270+(i*47)%190,top=620-height,bend=Math.sin(t*.45+i)*3;c.fillStyle=layer?'#24494c':'#3e6468';c.fillRect(x,top,7+layer*3,height);for(let y=top+25;y<630;y+=48){r.line({x:x-1,y},{x:x+10,y:y+1},'#82aaa0',2);if((i+Math.floor(y))%3===0){const dir=i%2?1:-1;r.path([[x+4,y],[x+dir*37+bend,y-22],[x+dir*65+bend,y-25]],null,'#315b57',2);for(let j=0;j<4;j++)r.path([[x+dir*(19+j*10),y-12-j*3],[x+dir*(30+j*10),y-38-j*2],[x+dir*(33+j*10),y-14-j*2]],'#305b55');}}}}c.globalAlpha=1;this.mist(r,s.mist,.27);
  for(const[x,y]of[[110,265],[1170,302],[718,220]]){r.line({x,y:0},{x,y},'#405b62',1);const glow=c.createRadialGradient(x,y+13,1,x,y+13,54);glow.addColorStop(0,'#ffc77a38');glow.addColorStop(1,'#ffc77a00');c.fillStyle=glow;c.fillRect(x-54,y-42,108,108);r.ellipse(x,y+13,10,15,'#dca86a');r.line({x:x-10,y:y+2},{x:x+10,y:y+2},'#6b6560',3);r.line({x:x-10,y:y+25},{x:x+10,y:y+25},'#6b6560',3);r.line({x,y:y+29},{x:x+Math.sin(t)*2,y:y+41},'#c58d5b',1);}
  for(let i=0;i<17;i++){c.globalAlpha=.18+Math.max(0,Math.sin(t*1.1+i))*.4;r.ellipse(70+(i*137)%1160+Math.sin(t*.6+i)*8,350+(i*39)%255+Math.cos(t*.4+i)*9,1.6,1.6,'#dfeb9f');}c.globalAlpha=1;
 }
 static frost(r,s,t,off){const c=r.ctx;for(let layer=0;layer<3;layer++){const pts=[[-30,740]];for(let i=0;i<8;i++){const x=i*210-120+off*(layer*.5+1),y=170+layer*98+(i%3)*21;pts.push([x-120,y+180],[x,y],[x+110,y+180]);}pts.push([1380,740]);r.path(pts,s.hills[layer]);if(layer<2)for(let i=0;i<7;i++){const x=i*210-120+off*(layer*.5+1),y=170+layer*98+(i%3)*21;r.path([[x-32,y+48],[x,y],[x+37,y+57],[x+10,y+35],[x-3,y+44],[x-13,y+29]],'#e7eeea');}}
  c.globalAlpha=.32;for(const[x,y,h]of[[40,305,300],[160,348,240],[965,298,300],[1100,330,250]]){c.fillStyle='#435f77';c.fillRect(x+off,y,98,h);for(let i=0;i<5;i++)c.fillRect(x+off+i*22,y-13,12,19);for(let yy=y+42;yy<y+h;yy+=65){c.fillStyle='#b1c8d2';c.fillRect(x+off+42,yy,11,25);c.fillStyle='#435f77';}}c.globalAlpha=1;this.mist(r,s.mist,.45);
  for(let i=0;i<65;i++){const x=((i*193+t*(8+i%4*2))%1360)-40,y=(i*79+t*(12+i%5*3))%740;c.globalAlpha=.22+i%4*.12;r.ellipse(x+Math.sin(t*.3+i)*8,y,1+i%3*.4,1+i%3*.4,'#f6f8ef');}c.globalAlpha=1;
 }
 static forge(r,s,t,off){const c=r.ctx;r.ellipse(924+off,214,79,79,'#c58260');c.globalAlpha=.25;r.ellipse(922+off,202,113,82,'#a66d5d');c.globalAlpha=1;this.hills(r,s,t,off);
  c.globalAlpha=.36;for(const[x,y,w]of[[70,240,58],[195,310,44],[870,285,60],[1130,235,51]]){c.fillStyle='#302f3c';c.fillRect(x+off,y,w,330);c.fillRect(x+off-6,y,w+12,14);r.path([[x+off-7,y-14],[x+off+w*.3,y-54],[x+off+w*.8,y-33],[x+off+w+10,y-72],[x+off+w+7,y-16]],'#584653');}c.globalAlpha=1;
  for(const x of[80,1210]){c.strokeStyle='#493b41';c.lineWidth=4;for(let y=-15;y<420;y+=21){c.beginPath();c.ellipse(x+Math.sin(t*.35)*3,y,5,13,.15,0,Math.PI*2);c.stroke();}}
  const lava=c.createLinearGradient(0,628,0,720);lava.addColorStop(0,'#cc7954');lava.addColorStop(.6,'#d99259');lava.addColorStop(1,'#f0b36b');c.fillStyle=lava;c.fillRect(0,628,1280,92);for(let i=0;i<35;i++){const x=(i*83+t*13)%1370-40,y=640+i%6*13;r.line({x,y},{x:x+22+i%4*13,y:y+Math.sin(t+i)*2},i%3?'#edb37b66':'#fff0b66e',1.5);}this.mist(r,s.mist,.2);
  for(let i=0;i<25;i++){const x=(i*149+Math.sin(t*.4+i)*21)%1280,y=740-((i*43+t*(17+i%3*4))%560);c.globalAlpha=.1+i%5*.1;r.line({x,y},{x:x+1,y:y-3},i%3?'#ffc27c':'#ffdf9f',1+i%2);}c.globalAlpha=1;
 }
 static platforms(r,game,t){const c=r.ctx,s=THEMES[game.mapId]||THEMES.dojo;for(const p of game.map.platforms){const h=p.solid?130:20;if(p.wallTop)continue;if(p.motion){for(const x of[p.x+12,p.x+p.w-12])r.line({x,y:50},{x,y:p.y},'#4c485e88',2);r.line({x:p.x,y:p.y+12},{x:p.x+p.w,y:p.y+12},'#e2bc71',4);}if(game.mapId==='forge'&&!p.solid){for(const x of[p.x+10,p.x+p.w-10]){c.globalAlpha=.65;for(let y=p.y-115;y<p.y-4;y+=15){c.beginPath();c.ellipse(x,y,3,8,0,0,Math.PI*2);c.strokeStyle=s.detail;c.lineWidth=2;c.stroke();}c.globalAlpha=1;}}
   r.path([[p.x,p.y],[p.x+p.w,p.y],[p.x+p.w-5,p.y+h],[p.x+6,p.y+h]],p.solid?s.surface:s.side);r.line({x:p.x,y:p.y},{x:p.x+p.w,y:p.y},s.edge,4);r.line({x:p.x+2,y:p.y+5},{x:p.x+p.w-2,y:p.y+5},s.top,2);
   if(['frost','ruins','forge'].includes(game.mapId)){for(let y=p.y+24,row=0;y<p.y+h;y+=24,row++){r.line({x:p.x+5,y},{x:p.x+p.w-5,y},s.detail+'65',1);for(let x=p.x+20+(row%2)*28;x<p.x+p.w-10;x+=Math.max(56,p.w/150))r.line({x,y:y-23},{x,y},s.detail+'65',1);}}else for(let x=p.x+19;x<p.x+p.w;x+=Math.max(game.mapId==='bamboo'?22:46,p.w/150))r.line({x,y:p.y+8},{x:x+3,y:p.y+h},s.detail+'75',1);
   if(game.mapId==='frost'){r.line({x:p.x+1,y:p.y+1},{x:p.x+p.w-1,y:p.y+1},'#f4f6ed',5);for(let x=p.x+13;x<p.x+p.w;x+=Math.max(31,p.w/150))r.path([[x-3,p.y+7],[x+4,p.y+7],[x+1,p.y+19+x%8]],'#c4e4e9');}
   else if(game.mapId==='bamboo'){for(let i=0;i<Math.min(150,p.w/30);i++){const x=p.x+12+i*29;r.line({x,y:p.y+3},{x:x+8,y:p.y+3},game.mapId==='ruins'?'#6e914e':'#80a084',3);}if(!p.solid&&game.mapId==='ruins'){for(const x of[p.x+20,p.x+p.w-30]){r.path([[x,p.y+15],[x-3,p.y+39],[x+7,p.y+57]],null,'#4d7954',2);r.ellipse(x+3,p.y+38,5,2,'#6c915e');}}}
   else if(game.mapId==='forge'){for(let x=p.x+13;x<p.x+p.w;x+=Math.max(40,p.w/150))r.ellipse(x,p.y+12,2,2,'#b3967a');if(p.solid){r.path([[p.x+22,p.y+55],[p.x+38,p.y+67],[p.x+26,p.y+91]],null,'#b96d4e',1.5);}}
   if(!p.solid&&game.mapId!=='forge')for(const x of[p.x+12,p.x+p.w-12])r.line({x,y:p.y+20},{x:x+(x<p.x+p.w/2?27:-27),y:p.y+42},s.detail,4);
  }
 }
}
THEMES.tower={tag:'O SINO E O VENTO',sky:['#34354f','#988095','#dfae88'],hills:['#8c7890','#736780','#5e5670'],surface:'#8e7770',side:'#625762',edge:'#353442',top:'#d9b689',detail:'#494151',mist:'#ac8d91',dark:true};
DuelScenery.THEMES=THEMES;window.DuelScenery=DuelScenery;
})();
