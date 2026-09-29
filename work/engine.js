(function (root) {
  'use strict';
  const C = Object.freeze({ width: 1280, height: 720, ground: 560, speed: 158, startup: .22, active: .13, recovery: .38, parry: .16, parryRecovery: .40, parryCooldown: .62, dash: .14, dashCooldown: .85, dashSpeed: 640, stun: .50, clash: .19, roundPause: 1.08, radius: 16, bladeWidth: 2.5 });
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  function pointSegment(p, a, b) {
    const dx = b.x-a.x, dy = b.y-a.y, l = dx*dx+dy*dy;
    const t = l ? clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/l,0,1) : 0;
    return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);
  }
  function segmentDistance(a,b,c,d) {
    const cross = (p,q,r) => (q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);
    const v1=cross(a,b,c),v2=cross(a,b,d),v3=cross(c,d,a),v4=cross(c,d,b);
    if (((v1>0&&v2<0)||(v1<0&&v2>0))&&((v3>0&&v4<0)||(v3<0&&v4>0))) return 0;
    return Math.min(pointSegment(a,c,d),pointSegment(b,c,d),pointSegment(c,a,b),pointSegment(d,a,b));
  }
  function blade(f) {
    let angle=-.35, handX=22, handY=485;
    const p=clamp(f.stateTime/Math.max(.001,f.duration),0,1);
    if(f.state==='startup') { angle=lerp(-.35,-1.48,Math.min(1,p*1.7)); handY=lerp(485,474,p); }
    else if(f.state==='active') { angle=lerp(-1.48,.92,p); handY=lerp(474,490,p); }
    else if(f.state==='recovery') { angle=lerp(.92,-.35,p*p);handY=lerp(490,485,p); }
    else if(f.state==='parry') {angle=-1.12;handX=30;handY=486;}
    else if(f.state==='parryRecovery') {angle=lerp(-1.12,-.35,p);}
    else if(f.state==='stunned') {angle=1.27;handX=12;handY=493;}
    else if(f.state==='clash') {angle=lerp(-1.25,-.35,p);}
    else if(f.state==='dash') {angle=-.14;handY=493;}
    const hand={x:f.x+f.facing*handX,y:handY};
    return {hand,angle,a:{x:hand.x+f.facing*Math.cos(angle)*13,y:hand.y+Math.sin(angle)*13},b:{x:hand.x+f.facing*Math.cos(angle)*112,y:hand.y+Math.sin(angle)*112}};
  }
  function fighter(id,x,facing) {
    return {id,x,y:C.ground,facing,state:'idle',stateTime:0,duration:0,dead:false,deathTime:0,move:0,vx:0,dashDir:facing,dashCooldown:0,parryCooldown:0,attackId:0,attackHit:false,lastWhiff:0};
  }
  class Game {
    constructor(options={}) {
      this.random=options.random||Math.random;this.events=[];this.time=0;this.score=[0,0];this.round=1;this.phase='title';this.roundTimer=0;this.attackCounter=0;this.lastReason='';this.aiEnabled=options.ai!==false;this.hitstop=0;this.resetFighters();
    }
    emit(type,data={}) { this.events.push({type,...data}); }
    resetFighters() {
      this.fighters=[fighter(0,436,1),fighter(1,844,-1)];
      this.ai={timer:.25+this.random()*.25,intent:0,intentTime:0,noticedAttack:0,reaction:0,answer:0,attackDelay:.7+this.random()*.5,riposteDelay:.12};
    }
    start() {this.score=[0,0];this.round=1;this.phase='playing';this.time=0;this.hitstop=0;this.roundTimer=0;this.lastReason='';this.events=[];this.resetFighters();this.emit('start');}
    setState(f,state,duration=0) {f.state=state;f.stateTime=0;f.duration=duration;f.move=0;}
    canAct(f) {return !f.dead&&f.state==='idle'&&this.phase==='playing';}
    attack(id) {
      const f=this.fighters[id];if(!this.canAct(f))return false;
      this.setState(f,'startup',C.startup);f.attackId=++this.attackCounter;f.attackHit=false;this.emit('windup',{id});return true;
    }
    parry(id) {
      const f=this.fighters[id];if(!this.canAct(f)||f.parryCooldown>0)return false;
      this.setState(f,'parry',C.parry);f.parryCooldown=C.parryCooldown;this.emit('guard',{id});return true;
    }
    dash(id,direction=0) {
      const f=this.fighters[id];if(!this.canAct(f)||f.dashCooldown>0)return false;
      f.dashDir=Math.sign(direction)||f.facing;f.dashCooldown=C.dashCooldown;this.setState(f,'dash',C.dash);this.emit('dash',{id});return true;
    }
    tickFighter(f,dt) {
      f.dashCooldown=Math.max(0,f.dashCooldown-dt);f.parryCooldown=Math.max(0,f.parryCooldown-dt);
      f.stateTime+=dt;
      if(f.dead){f.deathTime+=dt;f.vx=0;return;}
      if(f.duration>0&&f.stateTime>=f.duration) {
        const old=f.state;
        if(old==='startup'){this.setState(f,'active',C.active);this.emit('swing',{id:f.id});}
        else if(old==='active'){
          this.setState(f,'recovery',C.recovery);
          if(!f.attackHit) {f.lastWhiff=this.time;this.emit('whiff',{id:f.id});}
        }
        else if(old==='parry'){this.setState(f,'parryRecovery',C.parryRecovery);this.emit('parryMiss',{id:f.id});}
        else this.setState(f,'idle');
      }
    }
    updateAI(dt) {
      const p=this.fighters[0],e=this.fighters[1],ai=this.ai,dist=Math.abs(p.x-e.x),toward=Math.sign(p.x-e.x)||-1;
      e.move=0;ai.timer-=dt;ai.intentTime-=dt;ai.attackDelay-=dt;
      // A confirmed parry is a visible opening, independent of the previous attack cadence.
      if(p.state==='stunned'&&p.stateTime>=ai.riposteDelay&&this.canAct(e)) {
        if(dist<151){this.attack(1);ai.attackDelay=.55+this.random()*.35;return;}
        if(e.dashCooldown===0){this.dash(1,toward);return;}
        e.move=toward;ai.intent=toward;ai.intentTime=.16;return;
      }
      if(p.state==='startup'&&p.attackId!==ai.noticedAttack) {
        ai.noticedAttack=p.attackId;ai.reaction=.155+this.random()*.13;ai.answer=this.random();
      }
      if(ai.reaction>0) {
        ai.reaction-=dt;
        if(ai.reaction<=0&&this.canAct(e)&&dist<190) {
          // Reacts after a human-scale delay to the observed windup; some reads are wrong.
          if(ai.answer<.65) this.parry(1);
          else if(ai.answer<.88) {ai.intent=-toward;ai.intentTime=.18+this.random()*.16;if(dist<124&&this.random()<.32)this.dash(1,-toward);}
          else if(ai.answer<.94)this.attack(1);
        }
      }
      if(!this.canAct(e))return;
      if(ai.intentTime>0)e.move=ai.intent;
      if(ai.timer>0)return;
      ai.timer=.095+this.random()*.105;
      const roll=this.random();
      // Punishment has a decision delay and can still be late or out of range.
      if(p.state==='recovery'&&p.stateTime>.10&&dist<175&&ai.attackDelay<0&&roll<.76) {
        if(dist<140){this.attack(1);ai.attackDelay=.45+this.random()*.45;}
        else {ai.intent=toward;ai.intentTime=.18;if(e.dashCooldown===0&&roll<.22)this.dash(1,toward);}
        return;
      }
      if(p.state==='parry'&&roll<.8) {ai.intent=0;ai.intentTime=.20;return;}
      if(p.state==='parryRecovery'&&dist<146&&ai.attackDelay<0&&roll<.72){this.attack(1);ai.attackDelay=.55;return;}
      if(dist<143&&ai.attackDelay<0&&roll<.56) {this.attack(1);ai.attackDelay=.48+this.random()*.64;return;}
      if(ai.intentTime>0)return;
      if(dist>215) {ai.intent=toward;ai.intentTime=.28+this.random()*.32;}
      else if(dist<110) {ai.intent=-toward;ai.intentTime=.12+this.random()*.21;}
      else if(roll<.22) {ai.intent=-toward;ai.intentTime=.16+this.random()*.2;}
      else if(roll<.68) {ai.intent=toward;ai.intentTime=.18+this.random()*.25;}
      else {ai.intent=0;ai.intentTime=.15+this.random()*.28;}
      e.move=ai.intent;
    }
    bodyContact(attacker,defender) {
      const b=blade(attacker);
      return segmentDistance(b.a,b.b,{x:defender.x,y:446},{x:defender.x,y:523})<=C.radius+C.bladeWidth;
    }
    resolveCombat() {
      const [p,e]=this.fighters;if(p.dead||e.dead)return;
      const pa=p.state==='active',ea=e.state==='active';
      if(!pa&&!ea)return;
      const pb=blade(p),eb=blade(e);
      // Blade against blade always resolves before body damage.
      if(pa&&ea&&segmentDistance(pb.a,pb.b,eb.a,eb.b)<=C.bladeWidth*2) {
        p.attackHit=e.attackHit=true;this.setState(p,'clash',C.clash);this.setState(e,'clash',C.clash);
        p.x-=p.facing*5;e.x-=e.facing*5;this.hitstop=.065;this.emit('clash',{x:(pb.b.x+eb.b.x)/2,y:(pb.b.y+eb.b.y)/2});return;
      }
      const hits=[];
      for(const [a,d] of [[p,e],[e,p]]) {
        if(a.state!=='active'||a.attackHit)continue;
        const ab=blade(a),db=blade(d),body=this.bodyContact(a,d);
        const guard=d.state==='parry'&&(a.x-d.x)*d.facing>0;
        const guardTouch=guard&&segmentDistance(ab.a,ab.b,db.a,db.b)<=C.bladeWidth*2;
        if(guard&&(body||guardTouch)) {
          a.attackHit=true;this.setState(a,'stunned',C.stun);this.setState(d,'idle');
          if(d.id===1)this.ai.riposteDelay=.085+this.random()*.065;
          this.hitstop=.08;this.emit('parry',{id:d.id,x:(ab.b.x+db.a.x)/2,y:478});return;
        }
        if(body)hits.push([a,d]);
      }
      if(hits.length===2) {this.defeat(p,e,true);return;}
      if(hits.length===1)this.defeat(hits[0][1],hits[0][0],false);
    }
    defeat(loser,winner,trade=false) {
      const prior=loser.state;
      loser.dead=true;loser.deathTime=0;this.setState(loser,'dead');winner.attackHit=true;
      if(trade){winner.dead=true;winner.deathTime=0;this.setState(winner,'dead');}
      else this.score[winner.id]++;
      this.lastReason=trade?'Troca simultânea. Nenhum ponto.':prior==='parryRecovery'?'Parry cedo demais. A guarda já estava aberta.':prior==='recovery'?'Golpe no vazio. A recuperação abriu a guarda.':prior==='stunned'?'Parry confirmado. O contra-ataque encontrou a abertura.':prior==='dash'?'O dash cruzou a lâmina. Não há invencibilidade.':prior==='startup'?'O golpe chegou durante a preparação.':'A lâmina alcançou o corpo. Distância decidida.';
      this.phase='roundEnd';this.roundTimer=C.roundPause;this.hitstop=.115;
      this.emit('kill',{id:loser.id,winner:winner.id,trade,x:loser.x,y:481,reason:this.lastReason});
    }
    step(dt,input={}) {
      dt=Math.min(dt,.025);if(this.phase==='title'||this.phase==='matchEnd')return;
      if(this.hitstop>0){this.hitstop=Math.max(0,this.hitstop-dt);return;}
      this.time+=dt;
      if(this.phase==='roundEnd') {
        for(const f of this.fighters)if(f.dead)f.deathTime+=dt;
        this.roundTimer-=dt;
        if(this.roundTimer<=0) {
          if(Math.max(...this.score)>=5){this.phase='matchEnd';this.emit('matchEnd',{winner:this.score[0]>=5?0:1});}
          else {this.round++;this.resetFighters();this.phase='playing';this.emit('round',{round:this.round});}
        }
        return;
      }
      for(const f of this.fighters)this.tickFighter(f,dt);
      const [p,e]=this.fighters;
      for(const f of this.fighters)if(f.state==='idle')f.facing=Math.sign(this.fighters[1-f.id].x-f.x)||f.facing;
      p.move=clamp(input.move||0,-1,1);
      if(input.attack)this.attack(0);
      else if(input.parry)this.parry(0);
      else if(input.dash)this.dash(0,input.move);
      if(this.aiEnabled)this.updateAI(dt);else e.move=input.enemyMove||0;
      for(const f of this.fighters) {
        let scale=f.state==='idle'?1:f.state==='startup'?.15:f.state==='recovery'?.24:0;
        f.vx=f.state==='dash'?f.dashDir*C.dashSpeed:f.move*C.speed*scale;
        f.x=clamp(f.x+f.vx*dt,95,1185);
      }
      // Bodies cannot pass through each other, including during a dash.
      if(e.x-p.x<40){const mid=clamp((p.x+e.x)/2,115,1165);p.x=mid-20;e.x=mid+20;}
      this.resolveCombat();
    }
  }
  root.DuelCore={C,Game,blade,segmentDistance,clamp,lerp};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.DuelCore;
})(typeof globalThis!=='undefined'?globalThis:window);
