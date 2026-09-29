(function(){
const D=DuelCore,pose=DuelPresentation.pose;
DuelPresentation.pose=function(r,f,w,t){let q={...f};const v=f.guardVisualUntil>(r.gameView?.time||0)?f.guardVisual:null;if(v&&f.state==='idle'){q.state='parry';q.guard=v;q.stateTime=.08;q.duration=.3;w=D.blade(q);}const out=pose.call(this,r,q,w,t);q=out.f;
 if(f.wallSliding){q.visualLean=f.wallSide*8;q.visualCrouch=9;q.wallPose=true;q.wallPoseSide=f.wallSide;}
 else if(f.wallJumpTime>0){q.visualLean=-f.facing*4;q.visualCrouch=5*(f.wallJumpTime/.23);}
 if(f.doubleJumpTime>0){const u=f.doubleJumpTime/.20;q.visualCrouch=(q.visualCrouch||0)+Math.sin(u*Math.PI)*10;q.visualLean=(q.visualLean||0)-f.facing*Math.sin(u*Math.PI)*3;}
 if(f.fastFalling){q.visualLean=f.facing*3;q.visualCrouch=8;}
 r.turnHistory??=[];let h=r.turnHistory[f.id];if(!h||t<h.t)h={t,move:f.move,turn:0};const dt=Math.max(0,Math.min(.05,t-h.t));if(f.grounded&&f.move*h.move<-.1)h.turn=.13;h.turn=Math.max(0,h.turn-dt);h.t=t;if(f.move)h.move=f.move;r.turnHistory[f.id]=h;if(h.turn){q.visualCrouch=(q.visualCrouch||0)+Math.sin(h.turn/.13*Math.PI)*7;q.visualLean=(q.visualLean||0)-Math.sign(f.move)*h.turn*24;}
 if(f.tauntTime>0){const u=1-f.tauntTime/.9,a=Math.sin(u*Math.PI),angles={duelist:-1.1,staff:Math.PI*2,knight:-.65,lancer:2.5,assassin:4.5,swordsman:-.75,reaper:-1.3,boxer:.3,runner:.25};q.visualLean=a*f.facing*(f.kind==='runner'?8:3);q.visualCrouch=a*(f.kind==='boxer'?5:2);const temp={...q,aim:f.aim+angles[f.kind]*a*f.facing};out.w=D.blade(temp);}
 return{f:q,w:out.w};};
})();
