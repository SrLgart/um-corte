(function(root){
'use strict';
const D=root.DuelCore,L=root.DuelLegacy,P=D.Game.prototype,{has,ensure,world,effect,entity,projectile,center,clone}=L;
const previous={};for(const key of ['moveFighter','snapshot','loadSnapshot','lethal','setState','emit','attack','absorb','resolveCombat','feint','deathInfo'])previous[key]=P[key];
P.deathInfo=function(a,d){const info=previous.deathInfo.call(this,a,d),threat=this.legacyThreat;if(!threat)return a&&L.mirrorWeapon(a)?{...info,kind:L.mirrorWeapon(a)}:info;return{...info,kind:threat.kind||info.kind,angle:threat.angle??info.angle,contours:clone(threat.shape?.points||[]),source:threat.source,...(d.state==='parry'?{cause:threat.parryable?'FORA DA GUARDA':'GUARDA ROMPIDA'}:{})};};
P.resolveCombat=function(){L.resolveTechniques(this);return previous.resolveCombat.call(this);};
P.feint=function(id){return L.attackTechnique(this.fighters[id])?false:previous.feint.call(this,id);};
P.moveFighter=function(f,input,dt){if(!f.legacy?.effects.inverted)return previous.moveFighter.call(this,f,input,dt);const map=this.map,H=map.height,offset=D.body(f).center*2;
 // Reflect coordinates, then run exactly the same collision/jump implementation.
 this.map={...map,platforms:map.platforms.map(p=>({...p,y:H-p.y,baseY:H-p.baseY,dy:-(p.dy||0)})),walls:map.walls.map(w=>({...w,y:H-w.y-w.h}))};
 f.y=H-f.y+offset;f.vy=-f.vy;f.dashY=-f.dashY;const aim=f.aim,technique=L.attackTechnique(f);if(technique)technique.angle=-technique.angle;f.aim=-f.aim;f.legacy.effects.inverted=false;
 try{previous.moveFighter.call(this,f,{...input,aim:-input.aim,legacyInverted:true},dt);}finally{f.y=H-f.y+offset;f.vy=-f.vy;f.dashY=-f.dashY;f.aim=aim;if(technique)technique.angle=-technique.angle;f.legacy.effects.inverted=true;this.map=map;}
};
P.snapshot=function(){return{...previous.snapshot.call(this),legacyRngState:Number.isInteger(this.random.state)?this.random.state:null};};
P.loadSnapshot=function(s){const ok=previous.loadSnapshot.call(this,s);if(ok&&Number.isInteger(s.legacyRngState))this.random=L.rng(s.legacyRngState);return ok;};
P.setState=function(f,state,duration){if(state==='parryRecovery'&&has(f,'duelistband'))duration*=.65;if(state!=='idle'&&f.legacy?.channel)L.cancelChannel(this,f);if(f.legacy?.technique&&!['startup','active','recovery'].includes(state)){delete f.legacy.technique;f.dashRemaining=f.slideRemaining=0;}return previous.setState.call(this,f,state,duration);};
function killed(g,a,d){if(!a||!a.legacy||d.legacyCredited===a.id)return;d.legacyCredited=a.id;const l=ensure(a);if(has(a,'crackedglass')||has(a,'stonemask'))L.refill(g,a);if(l.effects.berserk>0){l.effects.berserk=0;l.berserkThreat=null;}if(has(a,'necromancer')&&g.pathEncounter){for(const e of world(g).entities)if(e.owner===a.id&&e.type==='servant')e.life=0;l.servantKind=d.kind;L.spawnServant(g,a,d.kind,d.x,d.y);}}
P.lethal=function(a,d,reason){const died=previous.lethal.call(this,a,d,reason);if(died)killed(this,a,d);return died;};
P.emit=function(type,data={}){previous.emit.call(this,type,data);const f=this.fighters?.[data.id];if(type==='windup'&&f){for(const observer of L.enemies(this,f))if(has(observer,'glasseye'))effect(this,f,'tell',f.x,f.y-D.body(f).top-10,{life:.17});}if(type==='kill'&&data.winner>=0){const a=this.fighters[data.winner],d=this.fighters.find(f=>f.dead);if(d)killed(this,a,d);}if(type==='parry'&&f)f.lastPerfect=data.perfect?this.time:f.lastPerfect;};
P.absorb=function(f,a){if(this.legacyFatalDebt===f.id)return!!f.admin?.invincible||L.tryRewind(this,f);if(!f.legacy)return previous.absorb.call(this,f,a);return previous.absorb.call(this,f,a);};
const before=L.beforeStep;L.beforeStep=function(g,commands,dt){before(g,commands,dt);for(const f of g.fighters){if(!f.legacy)continue;const l=ensure(f),fx=l.effects;
 // Holding an attack never requires frame-perfect taps for charge weapons.
 if(l.channel&&l.channel.age>=3.2)commands[f.id].legadoHeld=[];
 if(L.weaponId(f)==='needle'&&f.state==='active'&&Math.sin(f.attackAim)>.65){for(const t of L.enemies(g,f))if(g.bodyContact(f,t)){f.vy=-780;f.grounded=false;f.airJumps=1+(has(f,'wingboot')?1:0);}}
 }};
// Summons are unique per identity/slot even when the lab adds another item.

L.friction=(g,f)=>f.grounded&&world(g).entities.some(e=>e.type==='ice'&&e.iceKind==='ground'&&e.age>=e.warn&&e.age<e.life&&Math.abs(f.y-e.y)<7&&Math.abs(f.x-e.x)<95)?.055:1;
const oldWorld=L.worldStep;L.worldStep=function(g,dt){const w=world(g);for(const e of w.entities){
 if(e.type==='ice'&&e.iceKind==='ground'){const support=g.map.platforms[e.support];if(!support||support.stage==='gone')e.life=0;else{e.x=support.x+e.offsetX;e.y=support.y;}}
 if(e.type==='ice'&&e.iceKind!=='ground'&&!e.created&&e.age>=e.warn&&e.age<e.life){e.created=true;const p={x:e.x-65,y:e.y,w:130,solid:false,baseX:e.x-65,baseY:e.y,stage:'solid',crumbleAt:null,goneAt:null,legacyEntity:e.id},reuse=g.map.platforms.findIndex(p=>p.legacyEntity&&p.stage==='gone'&&!g.fighters.some(f=>f.platform===g.map.platforms.indexOf(p)));if(reuse>=0)g.map.platforms[reuse]=p;else g.map.platforms.push(p);g.routeCache.clear();}
 if(e.type==='echo'&&e.points)e.noCircle=true;
 }
 oldWorld(g,dt);const active=new Set(world(g).entities.filter(e=>e.type==='ice').map(e=>e.id));for(let i=0;i<g.map.platforms.length;i++){const p=g.map.platforms[i];if(p.legacyEntity&&p.stage!=='gone'&&!active.has(p.legacyEntity)){p.stage='gone';for(const f of g.fighters)if(f.platform===i){f.platform=-1;f.grounded=false;f.coyote=.06;}g.routeCache.clear();}}
};
// Snapshot dynamic geometry explicitly. Original map data remains immutable.
const snapshot=P.snapshot,load=P.loadSnapshot;P.snapshot=function(){return{...snapshot.call(this),legacyPlatforms:this.map.platforms.filter(p=>p.legacyEntity).map(p=>clone(p))};};P.loadSnapshot=function(s){const ok=load.call(this,s);if(ok&&Array.isArray(s.legacyPlatforms))for(const p of s.legacyPlatforms)this.map.platforms.push(clone(p));return ok;};
L.fallRescue=(g,f)=>{if(!has(f,'secondchance')||ensure(f).used.match.secondchance||!g.legacyRoundStart)return false;f.legacy.used.match.secondchance=true;g.legacyRewind=true;L.worldStep(g,0);return true;};
root.DuelV8Detail={killed};
L.helpText={brokenmirror:'Memoriza uma habilidade ou especial compatível usado a até 480 px. A tecla executa uma cópia por partida, sem gastar sua carga própria. Especiais copiados mantêm suas penalidades e não podem ser sobrepostos. A forma temporária da arma não altera sua classe, skin ou inventário.',kraken:'A tecla ordena a região na mira. Os comandos alternam: Esmagar → Agarrar → Bloquear rota. O HUD indica o próximo. O bloqueio é uma zona perigosa temporária; contorne-a ou salte por cima.',toad:'A língua anuncia e fixa a direção antes de esticar. Puxa o primeiro inimigo ou objeto que realmente alcançar, sem atravessar superfícies. Pode ser aparada; não funciona como gancho para mover você.',mimic:'O baú avisa antes de abrir a boca. Agarra por um instante ou engole um projétil vindo pela frente; depois precisa recuperar. Armas recuperáveis ficam presas brevemente e caem de volta, mantendo o dono original.'};
// Player-facing copy stays separate from the frozen specification catalogue.
L.descriptionText={
broom:'Arma improvisada de alcance razoável e arco amplo. O golpe lento exige antecipação.',
sword:'Espada equilibrada, com comportamento semelhante à do Cavaleiro.',
bow:'Dispara uma flecha após uma breve puxada. Ela colide com o cenário e pode ser refletida por parry. Aguarde a recarga entre tiros.',
knuckles:'Socos muito rápidos de alcance mínimo. Equipar as manoplas não concede o especial nem o restante da classe Pugilista.',
axe:'Machado de arco amplo e alcance médio. Preparação e recuperação mais longas deixam o golpe bem anunciado.',
kunai:'Arremessa uma lâmina em linha reta, de alcance limitado. Pode ser aparada e precisa recarregar entre lançamentos.',
leviathan:'Toque em atacar para golpear; segure para arremessar. Enquanto o machado estiver longe, atacar o chama de volta. Ele é letal na ida e no retorno, mas você fica sem arma até recuperá-lo.',
needle:'Mire para baixo e ataque no ar para quicar em inimigos ou superfícies válidas, inclusive o chão. O contato devolve impulso vertical.',
gunblade:'Durante a parte ativa do corte, pressione atacar novamente no momento certo para acrescentar um disparo curto. A extensão também pode ser defendida.',
blunderbuss:'Disparo de alcance muito curto e espalhamento largo. É rápido de soltar, mas exige uma recarga longa.',
yoyo:'Segure atacar para lançar e controlar o ioiô com a mira, dentro do alcance. Solte para recolher. Ele não atravessa paredes, pode ser aparado e tem duração limitada.',
yamato:'Toque em atacar para cortar. Segure para preparar e solte para abrir um corte distante na direção escolhida, sem projétil viajando até o alvo.',
ruyi:'Toque em atacar para golpear. Segure para estender o bastão; contra o chão, a extensão também pode impulsionar você para cima.',
zenith:'O golpe principal é acompanhado por lâminas espectrais que percorrem trajetórias adicionais na região do ataque.',
echo:'Seu corte se repete cerca de 0,6 segundo depois, no mesmo lugar do mundo. A fissura avisa onde ele voltará; o eco não acompanha você.',
wingboot:'Concede mais um salto no ar, além dos saltos normais.',
sandals:'Aumenta a velocidade de corrida.',
kneepads:'Seu deslize percorre uma distância maior.',
climbing:'Segure a direção contra a parede para ficar preso nela, sem deslizar. Solte para desgrudar ou pule para executar wall jump.',
lightcape:'Segure pulo durante a queda para cair mais devagar. Não concede voo.',
duelistband:'Reduz a recuperação de uma tentativa de parry que falhou.',
shadowcloak:'Durante um breve trecho do dash, você atravessa adversários e fica intangível contra ataques. Paredes sólidas continuam bloqueando a passagem.',
glider:'Segure pulo no ar para planar, preservando deslocamento horizontal e reduzindo a queda. Solte para fechar. Se houver outros equipamentos de voo, escolha o gesto no inventário.',
crystal:'Bloqueia um golpe mortal por partida e se estilhaça. A proteção volta no próximo confronto, não a cada duelo.',
magnetic:'Segure a direção contra uma parede para correr por ela brevemente. Não permite caminhar livremente pelo teto.',
mirrorcloak:'O dash deixa uma imagem sua na origem para confundir o adversário. A imagem não ataca nem possui colisão.',
rockets:'Segure pulo no ar para subir com propulsores. O combustível é limitado e recarrega ao pousar. Escolha o gesto no inventário se tiver outros equipamentos de voo.',
berserker:'Uma vez por partida, um golpe mortal inicia dois segundos de fúria. Mate um inimigo nesse intervalo para sobreviver; caso contrário, você morre ao final.',
icarus:'Permite voo controlado com energia limitada, recuperada ao pousar. Use a ação própria ou selecione o gesto de pulo no inventário.',
ghostsuit:'O dash pode atravessar partes da geometria. O destino precisa ser válido; os limites laterais fechados do Caminho continuam bloqueados.',
stonemask:'Transformação vampírica: melhora a corrida e os saltos, permite agarrar paredes e restaura recursos de mobilidade ao matar um inimigo.',
gravitycloak:'Ative para inverter sua própria gravidade. Ative novamente para voltar ao normal. Os outros combatentes não são invertidos.',
warbell:'Um Perfect Parry recarrega imediatamente seu dash.',
crackedglass:'Matar um inimigo restaura seus recursos de dash e saltos aéreos.',
glasseye:'Um brilho avisa quando o inimigo começa a preparar um ataque. O aviso não aumenta sua janela de defesa.',
coin:'Permite sortear novamente todas as cartas uma vez em cada escolha, antes de confirmar qualquer carta. Preserva a opção extra do Trevo.',
wolftooth:'Escape de um golpe por pouco usando dash para ampliar levemente seu próximo corte. Ataque logo para aproveitar a abertura.',
irontalisman:'Reduz bastante o deslocamento recebido de chutes, empurrões e impulsos não letais.',
incense:'Fique parado brevemente para preparar uma janela maior no próximo parry. Depois de usá-la, pare novamente para preparar outra.',
clover:'As escolhas de Legados oferecem quatro cartas em vez de três.',
d6:'Uma vez por partida, transforme um Legado próprio elegível em outro aleatório da mesma raridade. Escolha o alvo no inventário antes de ativar. O original volta ao fim da partida.',
stoppedclock:'Perfect Parry desacelera brevemente as ameaças hostis. Você permanece em velocidade normal; existe uma recarga interna entre ativações.',
brokenmirror:'Memoriza uma habilidade ou especial compatível usado por um adversário próximo. Ative para executar uma cópia, uma vez por partida.',
markedcard:'Marque uma carta durante a escolha para encontrá-la novamente em uma seleção futura válida. A marca é consumida quando ela reaparece.',
survivorglass:'Uma vez por partida, passar muito perto de um golpe letal sem ser atingido provoca uma breve desaceleração automática.',
magnet:'Quando uma seleção contém uma carta Lendária, outra opção também será Rara ou melhor.',
philosopher:'Uma vez por run, transforma um Legado próprio aleatório em outro da mesma categoria e raridade superior. A transformação dura a partida; a Pedra permanece consumida depois.',
crown:'No Caminho, derrotar um miniboss permite escolher um Legado dele para sua build. Essa recompensa é extra, além da escolha normal.',
contract:'Depois de um miniboss, escolha duas cartas em vez de uma. Não se aplica a encontros comuns nem a bosses.',
destinyorb:'Uma vez por run, veja outra seleção de cartas e decida se quer substituir a atual. Olhar já consome o uso, mesmo se você mantiver as cartas antigas.',
secondchance:'Uma vez por partida, uma morte rebobina o duelo ao início sem conceder o ponto. Usos limitados já gastos, incluindo o próprio Anel, não são devolvidos.',
d20:'Uma vez por partida, role de 1 a 20. Antes de ativar, escolha no inventário: alterar seu personagem nesta partida ou a raridade da próxima seleção. Números baixos prejudicam; altos favorecem. As garantias de recompensa são preservadas.',
destinyeye:'Uma vez por partida, um golpe fatal iminente abre uma curtíssima chance de reagir. Pule, use dash ou parry para escapar; a sobrevivência não é automática.',
downstrike:'No ar, segure baixo e ataque para golpear nessa direção. Sem arma, o movimento vira uma pisada corporal.',
upstrike:'Segure cima e ataque para orientar o golpe verticalmente. A forma acompanha a arma equipada.',
flyingkick:'Chute no ar para avançar em diagonal e empurrar o adversário. Não mata diretamente.',
roundhouse:'Segure chute brevemente para executar um golpe amplo, com maior empurrão. Não mata diretamente.',
stomp:'No ar, segure baixo e chute para despencar. Atingir um inimigo o empurra para baixo e faz você quicar.',
wallstrike:'Ataque junto do wall jump para sair da parede golpeando.',
counter:'Ataque logo após um parry bem-sucedido para responder com preparação mais rápida. O contra-ataque exige seu comando.',
dashcancel:'Depois do início da recuperação do ataque, use dash para cancelá-la. Consome uma carga disponível; não cancela qualquer fase do golpe.',
projectilecut:'Acerte um projétil com seu ataque no momento certo para destruí-lo ou rebatê-lo, sem usar parry.',
throw:'Perto do inimigo, segure baixo e chute para agarrá-lo e lançá-lo para o outro lado. Não mata diretamente, mas pode provocar uma queda.',
backstep:'No começo da preparação do ataque, segure a direção contrária ao golpe e use dash para cancelar em um recuo curto. Exige uma carga disponível.',
lunge:'Ataque logo no início do dash para convertê-lo em uma investida comprometida com aquela direção. Errar deixa uma recuperação maior.',
iaijutsu:'Logo após terminar um dash terrestre, ataque para executar um corte de saque horizontal que atravessa a linha ofensiva. Exige uma arma corpo a corpo compatível.',
mikiri:'Use dash na direção de uma estocada ou investida linear no instante certo para neutralizá-la. Não funciona contra qualquer tipo de golpe.',
disarm:'Um Perfect Parry derruba a arma elegível do inimigo automaticamente. Ele precisa recuperá-la para voltar a usá-la.',
perfectstep:'Um dash no último instante antes do contato pode gerar uma esquiva perfeita e uma breve oportunidade de resposta.',
nodraw:'Fique parado no chão para assumir a postura de saque. O próximo ataque começa muito rápido, mas errar aumenta sua recuperação.',
weaponmaster:'Ative para arremessar a arma equipada como um projétil físico e letal. Ela pode ser aparada e colide com o cenário. Você fica sem arma até recuperá-la; Leviatã conserva seu chamado de volta.',
raven:'Acompanha você e faz rasantes periódicos que interrompem e empurram levemente inimigos, sem matar.',
slime:'Segue pelo chão e gruda brevemente em inimigos para reduzir seu movimento, sem paralisá-los completamente.',
beetle:'Orbita você e intercepta um projétil hostil. Precisa recarregar antes de proteger novamente; não bloqueia golpes corpo a corpo.',
fairy:'Depois de um período sem pousar, concede um pequeno impulso vertical automático. Não é um salto sob comando nem voo contínuo.',
hound:'Persegue o adversário, morde para empurrar e retorna para recuperar. A mordida não mata diretamente.',
lantern:'Marca periodicamente o inimigo com um brilho, ajudando a acompanhar sua posição entre fumaça e efeitos.',
monkey:'Busca armas caídas e as carrega até você. Não equipa automaticamente a arma roubada; atingir o macaco faz a arma cair.',
falcon:'Ative para ordenar um mergulho na direção da mira. O ataque é letal, possui aviso e pode ser aparado. O falcão precisa retornar antes de atacar novamente.',
spectral:'Materializa-se periodicamente no flanco inimigo, anuncia um corte próprio e desaparece. Não repete seu último ataque.',
toad:'Estica a língua para puxar inimigos, armas ou objetos ao alcance. Não funciona como gancho para mover você.',
skeleton:'Aliado com espada: ataca devagar, pode matar e pode ser aparado. Se atingido, desmonta e precisa de tempo para se reconstruir.',
mimic:'Acompanha você como um baú e tenta agarrar inimigos próximos. Também pode engolir certos projéteis e objetos antes de recuperar.',
medusa:'Entidade flutuante que carrega eletricidade e cria uma zona circular perigosa ao redor de si. O aviso permite sair da área.',
doppel:'Cópia fantasmagórica que repete seus movimentos, saltos e ataques físicos com atraso. Não copia poderes nem novas invocações.',
necromancer:'No Caminho, reanima um inimigo que você matou como aliado temporário. Mantém apenas um servo por vez, até morrer, ser substituído ou terminar a partida.',
dragon:'Ative para ordenar uma enorme rajada na região da mira após um aviso. Ela é letal e também pode atingir você: saia da área.',
mahoraga:'Aprende a responder às ameaças que enfrenta durante a partida, ajustando defesa, flancos e ataques aéreos. A roda indica a adaptação; ele continua vulnerável.',
star:'Acompanha alguns ataques com golpes curtos. Sua ação ativa para brevemente o tempo hostil após um aviso, uma vez por duelo.',
kraken:'Ative para ordenar tentáculos na região da mira. Os comandos alternam entre esmagar, agarrar e bloquear uma rota, sempre com aviso.',
slimeking:'Slime gigante que salta para atacar. Ao morrer, divide-se em dois menores; eles ainda podem formar quatro pequenos antes de desaparecer.',
legion:'Três guerreiros espectrais: um de combate próximo, um arqueiro e um protetor. Cada um que morrer só volta no próximo duelo.',
hunter:'Marca uma presa e anuncia a caçada antes de entrar na arena por um período curto. Depois recua para recuperar.',
fireball:'Lança uma bola de fogo letal na direção da mira. Sua trajetória é legível e pode ser aparada.',
pulse:'Uma onda ao seu redor empurra inimigos e objetos próximos. Não mata diretamente e respeita paredes.',
impulse:'Lança seu próprio corpo na direção da mira. Serve para mobilidade, sem causar dano direto.',
barrier:'Cria uma defesa frontal temporária que quebra ao bloquear um ataque. Não conta como Perfect Parry nem contra-ataca.',
telekinesis:'Mire em uma arma caída ou objeto elegível e ative para puxá-lo até você. Não puxa jogadores diretamente.',
gust:'Cria uma corrente de ar que empurra continuamente inimigos, objetos e projéteis compatíveis.',
swap:'Ative para marcar sua posição. Ative novamente dentro de quatro segundos para voltar, se o destino estiver livre. Não restaura o estado anterior do duelo.',
web:'Mire e ative para lançar uma teia. Em superfícies válidas, ela prende um fio para puxar ou balançar seu corpo; em inimigos e objetos, provoca um puxão.',
blink:'Teleporta uma curta distância na direção da mira até um destino válido. Pode transpor obstáculos finos, mas não sair pelos limites fechados do Caminho.',
well:'Cria uma área temporária que atrai combatentes, projéteis e objetos para o centro. Não mata diretamente.',
mist:'Transforma você brevemente em névoa, permitindo atravessar adversários e evitar ataques físicos. Você não pode atacar nesse estado.',
lightning:'Mire em um inimigo ao alcance para anunciar um raio. O acerto pode saltar para outro alvo próximo.',
ice:'Mire no chão para criar gelo escorregadio, em uma parede para criar uma plataforma temporária ou no inimigo para travar brevemente seu movimento.',
shadowbomb:'Ative para lançar a esfera. Ative novamente para detoná-la e criar fumaça escura no local. A fumaça prejudica a visão, sem tornar você invisível.',
repulsor:'Dispara um empurrão na direção da mira e lança você no sentido oposto. Mire para baixo para ganhar impulso aéreo.',
sandevistan:'Uma vez por duelo, desacelera fortemente as ameaças hostis por um período curto. Você continua agindo, mas ainda pode morrer.',
room:'Ative para criar a esfera. Com ela ativa, mire em um alvo válido e ative novamente para anunciar a troca de posições. Você e o alvo precisam estar dentro da área, com destinos livres.',
portals:'Ative mirando superfícies válidas para criar os dois portais. Eles transportam combatentes e objetos compatíveis, preservando o movimento. Uma nova dupla substitui a anterior.',
amaterasu:'Marca uma região com chamas negras letais e temporárias, que se espalham um pouco por superfícies conectadas.',
kamehameha:'Segure a tecla da habilidade para carregar e solte para disparar. Antes de dois segundos, o feixe pode ser aparado; a partir daí, rompe o parry. Você fica vulnerável durante a carga, e o feixe ainda pode ser evitado.',
thehand:'Uma varrida curta aproxima adversários e objetos ao remover uma faixa de distância. Não destrói permanentemente o cenário.',
domain:'Cria uma área temporária de cortes letais anunciados. Você continua lutando enquanto o adversário pode escapar dos cortes por movimentação.'
};
L.describe=id=>[L.descriptionText[id]||L.catalog[id]?.description||'',L.helpText[id]||''].filter(Boolean).join('\n\n');
L.usageText=id=>{const c=L.catalog[id];if(!c)return'';if(c.scope!=='cooldown')return'1 uso por '+({duel:'duelo',match:'partida',run:'run'})[c.scope];const seconds=L.WEAPONS[id]?.cooldown??L.cooldown[id];return seconds?'Recarga: '+String(seconds).replace('.',',')+' s':'';};
})(globalThis);
