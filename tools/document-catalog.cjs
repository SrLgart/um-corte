// Human-reviewed mechanical notes + data extracted from the frozen runtime.
// This generates documentation only. Review notes if gameplay changes later.
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
require(path.join(root,'work/v8/bootstrap.cjs'));require(path.join(root,'work/v8/parkour.js'));
const D=globalThis.DuelCore,L=globalThis.DuelLegacy,P=globalThis.DuelPath;
const notes={
broom:'Perfil staff: alcance148/min25, tempos260/140/360 ms. Arco de bastão; sem entidade adicional ou cooldown independente.',
sword:'Herda o perfil processado do Cavaleiro, incluindo arco/tempos. Não muda mobilidade ou especial da classe portadora. Sem entidade adicional.',
bow:'arrow a1150 u/s, raio4, vida2,5 s; cooldown de arma3 s. Não há slash melee (reach0). Flecha para no cenário e pode ser refletida.',
knuckles:'Perfil boxer: alcance55, tempos90/75/150 ms; alterna punhos. Não concede boxerRush/especial da classe. Sem entidade extra.',
axe:'Perfil swordsman: alcance139/min25;280/140/410 ms. Corte de arco amplo sem projétil.',
kunai:'kunai a880 u/s, raio5, alcance500, cooldown1,3 s. Ataque90/20/190 ms; não deixa portador permanentemente desarmado a cada disparo.',
leviathan:'Segurar ataque por320/attackSpeed ms arremessa weapon (1000 u/s); toque é melee. Enquanto fora, M1 chama retorno a1100. Letal ida/retorno; parede o derruba. Recuperável, mantém originalOwner.',
needle:'Perfil duelist alcance141/min20;130/110/230 ms. Active mirando para baixo (sin>0,65) em corpo ou superfície válida aplica vy−780 e restaura saltos. Não é pulo infinito sem contato.',
gunblade:'Perfil knight alcance132. Novo pressionamento em active até70 ms, uma vez por attackId, cria trigger:1200 u/s, raio7, range62, life60 ms. Exige timing, não dano extra em alvo com HP.',
blunderbuss:'Cinco pellets, ângulos−0,24..0,24 rad,1550 u/s, raio4, range160, life150 ms. Cooldown2,4 s; pequeno recuo aéreo120. Não é projétil de longo alcance.',
yoyo:'Projétil piercing, raio13; alcance controlado185, manutenção de ataque até1,3 s antes de retorno. Cooldown1 s; paredes/parry interrompem, não atravessa cenário.',
yamato:'Carga320/attackSpeed ms fixa mira; cria spatialcut distante300, raio70, life180 ms/warn40 ms. Recovery300/attackSpeed×attackRecovery ms. Não viaja como projétil entre origem e destino.',
ruyi:'Carga320/attackSpeed ms; beam até620 recortado por superfície, raio12, life160 ms. Apontar ao chão com contato dá vy−1100. Recovery300/attackSpeed×attackRecovery ms.',
zenith:'Melee acompanhado por três spectralBlade com trajetórias curvas. Avisos90/115/140 ms, vida ativa280 ms, distâncias210/245. Parryable; não são três novas entidades de lutador.',
echo:'Captura geometria/pose/contorno da parede do ataque real. Espera600 ms e reexecuta no lugar original, com aviso. Não recalcula com arma atual nem persegue alvo; echo conserva perfil histórico.',
wingboot:'airJumps base1 passa a2 ao pousar/reset/refill. Passivo enquanto equipado, sem cooldown/timer ou entidade independente.',
sandals:'Multiplica speed por1,2 em weaponStats. Não multiplica dashSpeed; sem timer ou entidade.',
kneepads:'Ao iniciar slide, multiplica dashRemaining e slideRemaining por1,3. Passivo, não cria dash gratuito ou invulnerabilidade.',
climbing:'Pressionar contra parede no ar zera vy, fora de locks/dash/técnica. Soltar libera. Duração contextual, sem entidade e sem recarga própria.',
lightcape:'Segurar pulo limita queda a160 u/s; impulso explícito e estados incompatíveis têm prioridade. Passivo sem consumo de fuel.',
duelistband:'setState(parryRecovery) multiplica duração por0,65; wrapper de parry recalcula cooldown como janela ativa + recovery×0,65. Janela ativa fica igual. Sem entidade.',
shadowcloak:'Início do dash aplica effects.shadow80 ms; permite atravessar corpos durante dash e absorver golpe nessa janela. Paredes permanecem sólidas.',
glider:'Gesto jumpHeld ou toggle de até60 s; fecha por gesto solto se não houver toggle. Queda limitada90; horizontal speed×regra+75, preserva drift sem input. Não consome fuel; dash/jump/baixo interrompem a atuação naquele passo.',
crystal:'Primeiro golpe fatal da partida é absorvido; used.match.crystal e efeito crystalBreak. Não salva queda, não renova no próximo duelo.',
magnetic:'Contra parede sobe a240 por até1,4 s; reserva restaura no chão. Depois cai ou usa climbing/stonemask se houver. Não caminha livremente no teto.',
mirrorcloak:'Dash cria afterimage com pose clonada por400 ms. Puramente imagem, sem corpo ofensivo/colisão ou clone de IA.',
rockets:'Fuel compartilhado inicia1; consumo0,6/s, refill0,7/s no chão. Aceleração vertical3000 até−590; toggle/gesto, sem voo ao dash/impulso/jump. Cooldown de ativação não substitui limite de combustível.',
berserker:'Absorve morte uma vez por match e abre berserk por2 s. Kill cancela dívida; expirar sem kill causa morte forçada. Dívida ignora Cristal/Barreira, mas ADMIN/Anel ainda podem impedir.',
icarus:'Fuel1, consumo0,4/s e refill0,7/s apoiado; comando vertical±350, horizontal continua controlado. Toggle/gesto; sem entidade ofensiva. Gravidade invertida usa referencial próprio.',
ghostsuit:'Dash marca phasing e origem segura, ignora geometria elegível/corpos; ao terminar, destino inválido volta à origem. Paredes fechadas do Caminho continuam obrigatórias.',
stonemask:'Speed×1,08, jump×1,12, aderência à parede; kill restaura dash/airJumps/fuel. Passivo, não drena HP de vítima nem cria barra de vida.',
gravitycloak:'Alterna effects.inverted até nova ativação/reset. Zera vy, solta apoio; movimento usa mapa/ator refletidos temporariamente. Cooldown1 s; não inverte demais jogadores.',
warbell:'Evento Perfect Parry enche cargas do dash e zera sua recarga. Sem janela/cooldown adicional; não aumenta duração do parry.',
crackedglass:'Kill creditado restaura dashCharges/cooldown/airDashes/airJumps/fuel. Não aciona por whiff nem duplica crédito de morte em grupo.',
glasseye:'Em windup inimigo, cria tell sobre ele por170 ms para observador possuidor. Informação visual, não alteração de reação/hitbox.',
coin:'Uma rerrolagem de todas as opções antes da primeira escolha de cada draft. Estado rerolled pertence ao draft; preserva quantidade do Trevo. Não é ativo de combate.',
wolftooth:'Near miss durante dash ativa wolf450 ms; próximo attackId conserva alcance×1,2. Contato aproximado usa cápsula expandida em10, sem conceder hitbox ao golpe esquivado.',
irontalisman:'knockbackScale=0,55 para empurrões que consultam esse helper. Não reduz dano letal nem garante proteção contra quedas.',
incense:'Parado/idle mais de1 s prepara incenseReady. Próximo parry válido recebe janela×1,25 e cooldown ajustado; flag consumida e still zerado na ativação. Não reativa enquanto andando.',
clover:'Número de opções do draft passa3→4. Não dá duas escolhas; esse é Contrato. Sem timer/entidade.',
d6:'Escolha target no TAB; se ausente/inválido, usa primeiro elegível. Transformação mesma raridade, categoria pode mudar. Até fim do match, um uso/match; exclui próprio D6, duplicatas e incompatíveis.',
stoppedclock:'Perfect Parry cria slowTime por280 ms com factor0,4; cd interno3 s. Hostis afetados, dono normal. Não paralisa mundo inteiro.',
brokenmirror:'Memoriza última habilidade compatível até480 de distância. Um cast/match, limpa memória após sucesso. Cópia de especial exige specials ligado/estado válido e mantém penalidades; poderes usam whitelist, sem recursão.',
markedcard:'Marcação de uma opção não escolhida no draft; reaparece em seleção futura elegível e consome marca. Não substitui slot necessário de raridade garantida.',
survivorglass:'Uma vez/match, near miss de golpe melee cria slowTime250 ms factor0,18. Não absorve um contato fatal já ocorrido.',
magnet:'Quando draft inclui lendária, promove outra opção a rara ou superior. Não aumenta isoladamente chance base de lendária; sem timer.',
philosopher:'Transforma item aleatório comum→raro/raro→lendário da mesma categoria até fim do match. Marca consumed além de used.run; original volta, Pedra continua gasta. Falha sem alvo/pool válido não gasta.',
crown:'Só Caminho com miniboss futuro. Vitória de miniboss oferece roubo extra de um ID da build inimiga não possuído. Não rouba classe, stats ou todos os itens.',
contract:'Draft de miniboss passa choices1→2. Não duplica recompensa de boss/comum. Persistente na build, sem entidade.',
destinyorb:'Ação na tela de draft; activate em combate retorna false. Preview já marca used.run e avança RNG; aceitar troca seleção, recusar mantém anterior sem devolver uso.',
secondchance:'Morte ou queda solicita rewind para legacyRoundStart sem ponto. Uma vez/match. Rewind preserva usos/consumidos/binds gastos, inclusive próprio Anel. Não cria checkpoint arbitrário.',
d20:'Um uso/match. Destino character aplica bônus por face:1=.58;2–5=.8;6–9=.93;10–11=1;12–15=1.12;16–19=1.25;20=1.45. Speed multiplica, startup/recovery dividem. Destino draft altera próximo sorteio mantendo garantias.',
destinyeye:'Uma vez/match, fatal guarda shape/origin e abre220 ms de reação; hostis factor0,05. Ao fim, colisão pendente é reavaliada e pode ser aparada. Não é escudo automático permanente.',
downstrike:'Baixo+ataque no ar fixa direção descendente; forma depende de arma. Desarmado converte para plunge/pisada conforme hook. Sem tecla ativa independente.',
upstrike:'Cima+ataque orienta mira para−π/2. Usa timings/forma da arma; sem entidade/cooldown adicional.',
flyingkick:'Chute aéreo recebe vx650 na direção frontal, vy−260 e impulso180 ms. Mantém natureza não letal, usa cooldown do chute.',
roundhouse:'Segurar chute220 ms arma roundhouse420 ms. Contato radial próximo86 empurra630, uma vez por vítima/ação. Não cria golpe letal.',
stomp:'Baixo+chute aéreo aplica vy950; enquanto descendo, inimigo abaixo dentro da faixa é empurrado620, dono quica−650. Usa efeito stomp450 ms e colisão de cenário.',
wallstrike:'Wall jump junto do ataque prepara counter180 ms para saída ofensiva. Depende do contato real com parede, não teleporta ao alvo.',
counter:'Após parry bem-sucedido, effects.counter260 ms reduz startup à metade. Precisa comando de ataque; sem contra-golpe automático.',
dashcancel:'Pode cancelar recovery depois de35% da duração em dash normal com carga. Não cancela startup/active, não ignora lock/limite aéreo.',
projectilecut:'Slash ativo intercepta trajeto de projétil não-zone. Projétil comum é destruído, arma recuperável cai. Não corta qualquer área de poder ou invocação inteira.',
throw:'Baixo+chute no chão próximo (<65) projeta inimigo para destino livre atrás e empurra650. Cooldown700/recovery350 ms; não mata diretamente, queda pode matar.',
backstep:'Startup até min(140 ms,65% da duração), input contrário ao golpe +dash. Consome carga; duração do dash×0,65. Não pode cancelar golpe que já acertou.',
lunge:'Ataque até70 ms após início do dash converte para técnica comprometida; distância130, startup×0,65, active140 ms, recovery×1,35. Direção fixa, sem parry/dash/pulo para cancelar.',
iaijutsu:'Ataque até220 ms após dash terrestre com melee elegível. Distância155, startup×0,6, active130 ms, recovery×1,4. Atravessa corpos no active, não paredes.',
mikiri:'Dash para estocada ativa dentro dos primeiros100 ms, alinhamento>0,65 e bodyContact. Atordoamento450 ms, hitstop45; emite perfect parry. Exclui corte de quebra/ult e ataques não lineares.',
disarm:'Perfect melee parry com disarmEligible derruba weapon original. Punhos, técnicas sem arma e projéteis não contam. Recolher é necessário; item não é removido permanentemente do inventário.',
perfectstep:'Ao dash, se hitbox melee inimiga ativa já ameaça corpo, aplica shadow100 ms. Não lê botão do inimigo; oportunidade é intangibilidade curta, sem buff adicional de dano.',
nodraw:'Idle no chão por>1 s prepara nodraw300 ms; próximo golpe startup×0,5. Marca attackId; whiff aumenta recovery×1,7. Movimento quebra preparo.',
weaponmaster:'Arremessa arma física a1000, raio12, entidade weapon piercing recuperável. Fica weaponAway; não troca classe/posse. Rejeita arma fora, punhos, especiais incompatíveis.',
raven:'Companion não letal, rasante periódico (intervalo3 s, aviso350 ms, ataque1,1 s), empurra/interrompe e retorna. Pode ser destruído por golpe; não é projétil infinito.',
slime:'Companion terrestre velocidade120. Ao tocar alvo cola por900 ms e renova slimeSlow (speed×0,7); depois retorna e espera ao menos2 s. Não paralisa completamente/não mata.',
beetle:'Companion orbital intercepta um projétil letal não-zone próximo45, cooldown interno4 s. Não bloqueia ataque melee como escudo universal.',
fairy:'Após1,1 s sem pousar, se descendo e pronta aplica vy−560; cooldown5 s. Impulso automático, não salto sob comando; não é vulnerável como summon físico comum.',
hound:'Companion terrestre persegue/morde sem matar; ciclo base3 s, aviso350 ms. Segue apoio/parede; não ignora geometria para alcançar jogador.',
lantern:'Marca alvo a até700 durante2 s, varredura280 ms, intervalo4,5 s. É indicação visual de posição, sem dano/rastreamento através de input privado.',
monkey:'Busca entidade weapon dropped, carrega até dono a280 e larga próximo32. Arma mantém proprietário; macaco atingido larga. Não equipa automaticamente arma alheia.',
falcon:'Comando ativo requer estar retornado perto do dono. Aviso350 ms, janela de ataque1,5 s, velocidade880; letal/parryable. Cooldown5 s não dispensa retorno físico.',
spectral:'Oculto, materializa em flanco±110 válido; startup380/AS, active130/AS, recovery220/AS ms, intervalo3,5 s. Ataque próprio, não cópia. Vulnerável enquanto materializado.',
toad:'Língua mira/fixa direção, aviso300 ms, extensão120 e retração160 ms, alcance240, cooldown4 s. Primeiro contato efetivo puxa ator/objeto; parryable/não letal, não move o dono como gancho.',
skeleton:'Companion melee com startup400/active150/recovery550 ms ajustados pelas regras, speed220. Um golpe desmonta; reconstrói após6 s. Pode matar/aparar/clash, não possui múltiplos HP de lutador.',
mimic:'Alvo perto95 ou projétil frontal aproximando até260. Windup250, boca400, intervalo5 s. Agarra220 ms; arma recuperável é carregada650 ms e largada. Só tipos comestíveis explícitos, respeita frente/linha.',
medusa:'Companion lento75, electriczone raio115, warn600 ms/life1,65 s, intervalo4,8 s. Zona acompanha fonte, letal/não parryable; sair da área é resposta.',
doppel:'Histórico de movimento/pose/arma atrasado550 ms, sem body collision normal. Copia melee físico, não poderes/summons; perfil histórico evita trocar geometria retroativamente. Pode clash/parry/morrer.',
necromancer:'Só elegível no Caminho. Kill recria um servant da classe morta, substituindo anterior. Sem build/Legados inimigos; dura até morte/substituição/reset de match. Entidade suporte não é o servo ofensivo.',
dragon:'Comando cria dragonbreath raio210, aviso1,2 s/life2 s, posição na direção da mira; cooldown16 s. Letal, não parryable e friendly (atinge dono). Corpo de fundo não é alvo comum.',
mahoraga:'Companion físico; memória front/ranged/air por match. Aprende cada categoria após2 observações, roda marca adaptação. Front cria flanco550 ms/cd2,4 s; air salta−850/cd1,5 s; defesa ranged condicionada. Continua mortal.',
star:'Acompanha active do dono com starPunch raio28, warn70/life170 ms, um por attackId. Ativo THE WORLD: life1,25 s incluindo350 ms de aviso (900 ms de parada hostil), uma vez/duelo.',
kraken:'Companion colossal fora da arena. Comando ancora krakenArm e alterna smash/grab/block, cooldown13 s. Avisos800/600/900 ms; duração após aviso240/350/2400 ms. Smash/block letais, grab não letal/parryable; contornos recortados por paredes.',
slimeking:'Companion terrestre, compressão480 ms menos60 por geração; salto vertical680−65×geração, vx limitado410. Letal na descida, recovery650 ms, ciclo3,4 s. Morte divide em2 e depois4; geração2 termina.',
legion:'Três slots: melee, arqueiro, protetor. Melee perfil reach100/startup340/active130/recovery500 ms. Arqueiro startup520/AS, projétil590, cd2,2 s. Escudo frontal cd2,8 s; morto fica fallen até duelo seguinte.',
hunter:'Observa fora, marca presa por1 s, caça a710 por2,5 s, retira a850 e cooldown6 s. Só presa marcada recebe contato; parede pode abortar. Não é alvo vulnerável comum.',
fireball:'fireball a590 u/s, raio12, life2 s. Letal/parryable, colisão com cenário; cd2,7 s.',
pulse:'Onda imediata raio175 sem cruzar paredes; push650 em hostis e desloca objetos soltos. Effect pulse, não entidade de dano; cd4 s.',
impulse:'Velocidade na mira800, effects.impulse180 ms. Integra gravidade/colisão e cancela por ação incompatível. Não letal; cd3 s.',
barrier:'effects.barrier3 s ou um bloqueio frontal; exige origem no lado facing. Não Perfect Parry, não protege automaticamente costas/queda; cd7 s.',
telekinesis:'aimHit até650, apenas objeto elegível; arma usa mode fetch, outros pulledBy. Tether200 ms visual. Não puxa jogador; cd2 s, falha sem alvo não gasta.',
gust:'Zona a130 na mira, raio115, life850 ms; empurra continuamente atores/objetos/projéteis elegíveis. Não letal; cd5 s.',
swap:'Marca4 s, recast liberado após200 ms. Segundo uso valida destino, teleporta e cd5 s. Não restaura velocidade/estado do passado nem rebobina mundo.',
web:'aimHit até650. Ator recebe webhit não letal warn100/life220 ms, objeto fetch, superfície grapple2,2 s. Pulo solta, distância35 encerra; compartilhado com colisões. Cd2 s.',
blink:'Busca destino livre a até230 na direção, em passos de6. Não percorre trajetória nem pode terminar em collider/fora da contenção. Cd3,5 s; falha sem deslocar não gasta.',
well:'Zona a200 na mira, raio160, warn250 ms/life2,6 s; puxa atores inclusive dono e objetos. Não dano; cd8 s.',
mist:'effects.mist1,1 s, permite atravessar corpos e bloqueia ataque do usuário. protect absorve eventos letais que chegam a ele, sem filtro por fonte física; queda segue via própria. Cd7 s.',
lightning:'aimHit ator até350; raio inicial warn250/life380 ms, raio9. Encadeia até3 vítimas, próximas até200 com linha livre; avisos seguintes140 ms. Cd5 s.',
ice:'aimHit até330. Ator: frost warn120 ms, freeze120. Chão: atrito×0,055 em faixa±95 por4 s após200 ms. Parede: plataforma130 temporária indexada; cd6 s.',
shadowbomb:'Primeiro uso projétil560/life6 s não letal, recast250 ms. Detonar cria smoke raio150/life2,8 s e inicia cd6 s. Não invisibilidade mecânica.',
repulsor:'Recuo próprio−650 na mira/impulso180 ms e feixe repulse até210, raio22/life120 ms, força800 no alvo. Não letal/parryable; cd4 s.',
sandevistan:'slowTime life1,7 s incluindo aviso200 ms; fator hostil0,25 por1,5 s efetivos. Um uso/duelo. Dono normal; plataformas/cenário não usam esse fator.',
room:'Esfera fixa centro da ativação, raio280/life5 s; recast350 ms. Shambles alvo até560 dentro da esfera, warn300/life360 ms, troca validada no momento. Segundo cast cd9 s. Não troca qualquer decoração.',
portals:'raySurface até850, dois portais por dono, raio38/life12 s, cd1 s. Superfície precisa caber abertura76; pares distam≥80. Rotaciona momentum, lock250 ms evita loop; companions exigem flag não usada atualmente.',
amaterasu:'blackfire raio55, warn600 ms/life3,8 s. Após aviso+350 ms espalha uma vez±65 sobre superfície conectada, filhos raio28 sem recursão. Letal/não parryable; cd12 s.',
kamehameha:'Canal fixa mira, movimento×0,3. Soltar dispara; ≥2 s torna feixe não parryable e aumenta raio12→22..28; máximo3,2 s. Ray até1100 recortado, life250..334 ms. Cd12 s no disparo; cancelamento impõe≥800 ms.',
thehand:'erase raio240, warn120/life300 ms; faixa angular frontal desloca atores/objetos até110 para perto, destino validado. Não letal/não apaga estruturas; cd8 s.',
domain:'effects.domain4 s; centro fixo/raio430. Pulsa após100 ms e depois600 ms: dois cortes radius65, aviso480/life650 ms; um procura alvo, outro aleatório. Letais evitáveis, sem morte automática; cd18 s.'
};
const differences={
sandevistan:'A descrição congelada diz “mundo inteiro”. L.timeScale afeta hostis e entidades pelo relógio do dono; plataformas e efeitos globais continuam com tempo do mundo.',
mist:'A descrição limita a intangibilidade a ataques físicos. L.protect não filtra a fonte para effects.mist: absorve também poderes/projéteis que passam por esse hook. Queda não passa por ele.',
room:'A descrição fala em troca instantânea. Há aviso de300 ms antes de Shambles, e validação de área/suporte/destino no instante da execução. A troca de posição em si é instantânea após o aviso.'
};
const cats={weapon:'Armas',clothing:'Vestimentas',relic:'Relíquias',technique:'Técnicas',summon:'Invocações',power:'Poderes'};
const scopeText={cooldown:'Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.',duel:'Um uso por duelo; restaura no próximo duelo.',match:'Um uso por partida/confronto; não restaura a cada ponto.',run:'Um uso por run; não restaura no confronto seguinte.'};
const draftOnly=new Set(['coin','clover','markedcard','magnet','crown','contract','destinyorb']);
let md='# Legados — catálogo mecânico completo\n\n115 IDs reais, auditados contra legacies.js, legacy-combat.js, v8-detail.js e path.js. Segundos são tempo de simulação, salvo indicação em ms. Texto de uso é L.describe; a nota técnica abaixo registra parâmetros e limites lidos no código. Descrições congeladas de intenção estão em [runtime.json](data/runtime.json), não devem substituir estas notas.\n\n## Regras comuns de todas as fichas\n\n- Aquisição: draft de partida/duelo quando habilitado, recompensas do Caminho e laboratório de treino/ADMIN. NPCs também podem receber builds fixas/aleatórias; isso não significa elegibilidade idêntica ao draft humano.\n- Sem pilhas do mesmo ID. add rejeita item original ou efetivo já possuído; drafts excluem ambos. Remover item pelo ADMIN pode torná-lo elegível novamente. Múltiplos itens distintos podem combinar efeitos; uma arma equipada por vez.\n- Ativo recebe primeiro bind livre Digit1..9; extras precisam bind manual. TAB permite remapear teclado/mouse/gamepad e detecta conflitos. Armas usam o input de ataque, técnicas usam gestos; active:false não significa “sem ação”.\n- Duração contextual significa enquanto possui item/condição descrita; não existe timer universal de cinco segundos para passivos. scope=cooldown é metadado genérico, não prova de uma recarga.\n- Reset duel conserva posse/transformações/usos de match/run, limpa cd/efeitos e recria companions; match reverte transformações e memórias. Ver SAVE_AND_STATE. Uma invocação em geral existe até morrer, dono morrer ou reset; life1e9 é sentinela, não duração de habilidade prometida.\n- Entidades/effects são dados serializáveis, não VFX que decidem dano. Fichas sem entidade própria modificam atributos/hooks/estado. Mecânicas de combate não são automaticamente liberadas no Parkour.\n\n';
for(const [cat,title]of Object.entries(cats)){
 md+='## '+title+'\n\n';
 for(const c of Object.values(L.catalog).filter(c=>c.category===cat)){
  if(!notes[c.id])throw Error('Missing mechanical note '+c.id);
  const mode=['crown','contract'].includes(c.id)?'Draft só Caminho, nível<45; laboratório pode forçar.':c.id==='necromancer'?'Draft só Caminho; laboratório pode adicionar fora dele, mas reanimação exige pathEncounter.':['coin','clover','markedcard','magnet','destinyorb'].includes(c.id)?'Draft com futureDraft!==false; laboratório pode forçar.':'Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.';
  const cd=L.WEAPONS[c.id]?.cooldown??L.cooldown[c.id];
  md+='### '+c.name+' — `'+c.id+'`\n\n'+L.describe(c.id)+'\n\n';
  md+='- **Categoria / raridade:** '+cat+' / '+c.rarity+'.\n';
  md+='- **Acionamento / bind:** '+(draftOnly.has(c.id)?'Interface de draft, não botão de combate.':c.active?'Ativo; bind configurável no TAB.':L.useText[cat])+'\n';
  md+='- **Recarga:** '+(cd!=null?cd+' s (ativa/arma).':c.scope!=='cooldown'?'Limitado pelo escopo, sem cooldown de recast comum.':'Sem recarga ativa única; condições/timers internos na nota técnica.')+'\n';
  md+='- **Uso/reset:** '+scopeText[c.scope]+'\n';
  md+='- **Consumo / acúmulo:** '+(c.id==='philosopher'?'Permanece consumed na run após uso.':c.id==='destinyorb'?'Uso de run gasto ao visualizar; item continua na lista.':'Não é removido do inventário ao acionar; usos/estados limitam disponibilidade.')+' Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.\n';
  md+='- **Modos/elegibilidade:** '+mode+'\n';
  md+='- **Mecânica, duração, entidades e limites:** '+notes[c.id]+'\n';
  if(L.WEAPONS[c.id])md+='- **Override de arma:** `'+JSON.stringify(L.WEAPONS[c.id])+'`. Campos omitidos herdam classe processada; tempos em segundos antes de attackSpeed.\n';
  if(differences[c.id])md+='\n**IMPLEMENTAÇÃO ATUAL DIFERE DA ESPECIFICAÇÃO ORIGINAL:** '+differences[c.id]+'\n';
  md+='\n**Localizar:** `'+c.id+'` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). '+(draftOnly.has(c.id)?'Fluxo de recompensa em [path.js](../work/v8/path.js) e [v8-ui.js](../work/v8/v8-ui.js). ':'')+'Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).\n\n';
 }
}
fs.writeFileSync(path.join(root,'docs/LEGACIES.md'),md);
let bosses='# Bosses\n\nFonte: path.js/BOSSES, Run.makeEncounter e L.ai; apresentação em v8-ui.js e v8-visuals.js. Bosses obedecem morte em um golpe, salvo proteções explícitas de sua build. Não possuem barras de vida nem fases por HP. Builds usam os mesmos Legados documentados no catálogo.\n\n**Lógica real:** a maioria é classe + build fixa + dificuldade + label de estilo. Somente patient tem ajuste específico de distância na IA V8; demais labels não implementam uma árvore exclusiva. Gêmeos é exceção estrutural: dois inimigos. Intros são vinhetas, não habilidades de combate. Não tratar texto narrativo como mecânica.\n\n';
for(const b of P.BOSSES){bosses+='## '+b.name+' (`'+b.id+'`)\n\n'+b.subtitle+'\n\n- Níveis elegíveis: '+b.levels.join(', ')+'.\n- Classe base: '+b.kind+' ('+D.CLASSES[b.kind].name+').\n- Build fixa: '+b.build.map(id=>L.catalog[id].name+' (`'+id+'`)').join('; ')+'.\n- IA/style: `'+b.style+'`; '+(b.style==='patient'?'distância alvo95% do alcance.':'usa controlador V8 genérico e ações disponíveis da build.')+'\n- Intro: '+(b.id==='first'?'7':'3,2')+' s, pulável se visto; marca seen/introCompleted.\n- Particularidade: '+(b.id==='twins'?'Segundo ator assassin com yoyo + well, estilo ranged; ambos precisam morrer para conceder ponto. Sem dano entre aliados.':b.id==='first'?'Fixo no nível50; vencer conclui run sem novo draft. Eco/Doppel/ROOM vêm dos módulos compartilhados, não versões secretas exclusivas.':'Não há ramo exclusivo de combate identificado para este ID. A combinação de sua build define seus recursos e limitações.')+'\n\n';}
bosses+='## Seleção e representação\n\nRun.rollBosses evita ID repetido nos níveis10–40 e prefere opções fora de lastBosses. Nível50 é fixo. Todos usam confronto de points duelos para vencer. A arte de intro e os títulos são próprios, mas atores reaproveitam classes/camadas de equipamentos. Visual pode ser refeito sem trocar a build ou a condição de vitória.\n';
fs.writeFileSync(path.join(root,'docs/BOSSES.md'),bosses);
let maps='# Mapas e geometria\n\n18 mapas registrados: dez arenas de duelo, cinco do Caminho e três pistas oficiais. [data/maps.json](data/maps.json) guarda todos os arrays completos de plataformas, paredes, spawns, decor, checkpoints e routes: source (autoria) e normal (makeMap, mapSize=1). Não confundir medidas de autoria com medidas jogadas.\n\nDuelo/Caminho/custom duelo: escala efetiva1,5×mapSize. Parkour:1×mapSize. Personagens não escalam com arena. makeMap pode acrescentar apoios intermediários em mapas oficiais aumentados e wallTop; portanto contagens processadas diferem da autoria. Mapas customizados não recebem esses apoios automáticos.\n\n';
for(const group of ['duel','path','parkour']){
 maps+='## '+({duel:'Arenas de duelo',path:'Caminho do Guerreiro',parkour:'Parkour'})[group]+'\n\n';
 for(const [id,m]of Object.entries(D.MAPS).filter(([,m])=>(m.path?'path':m.type==='parkour'?'parkour':'duel')===group)){
  const n=D.makeMap(id,1);
  maps+='### '+m.name+' (`'+id+'`)\n\n'+(m.description||'')+'\n\n- Modo: '+group+'. Autoria '+(m.width||D.C.width)+'×'+(m.height||D.C.height)+'; normal '+n.width+'×'+n.height+'; deathY '+n.deathY+'.\n- Plataformas: '+m.platforms.length+' autorais / '+n.platforms.length+' processadas; paredes: '+n.walls.length+'. '+(m.platforms.some(p=>p.motion)?'Tem móveis. ':'')+(m.platforms.some(p=>p.fragile)?'Tem frágeis. ':'')+'\n- Spawns normais: `'+JSON.stringify(n.spawns)+'`.\n- Paredes normais: `'+JSON.stringify(n.walls)+'`.\n- Objetos autorais: `'+JSON.stringify(m.decor||[])+'`.\n- Plataformas/rotas completas: entrada `'+id+'` em [maps.json](data/maps.json).\n\n';
 }
}
maps+='## Limites e editor\n\nAresta global comum limita x, mas não significa parede desenhada em toda arena. Somente paredes reais dão interação de wall jump/slide. Quedas usam deathY. Caminho usa sealPathMap: preserva faces internas, prolonga laterais até y=−10.000.000, retira antigos topos jogáveis e aplica clamp final inclusive a deslocamentos diretos/ADMIN. Não é possível pular para fora dessas laterais. Renderer recorta desenho à câmera, não itera dez milhões de unidades.\n\nAs cinco arenas do Caminho podem ter direção de arte e level design revistos futuramente. Preservar função: fechadas, legíveis, escala crescente, espaço de combate, poucos buracos e sem exigir parkour excessivo.\n\nCustom: cleanMap exige format um-corte-map/version1. Duelo width640–3840/height360–2160, até80 plataformas/60 paredes. Parkour até24000 em cada dimensão, até300 plataformas/200 paredes. Dois spawns no schema; Race distribui participantes. Até40 objetos (bell, lantern, flag, bamboo, vase). Imagens PNG/JPEG/WebP em data URL, até duas camadas/900000 caracteres cada; parallax0..0,5, opacity0..1. Sem SVG ou URL remota arbitrária. Importador limita arquivo a2100000 bytes.\n\nCorrida:1–40 checkpoints ordenados, routes2–100 pontos por segmento validados; apoios e conexões precisam ser seguros. Ranking usa checkpoint+progresso da rota; câmera segue corredor individual e split-screen local. Editar pista exige atualizar checkpoints/routes, não só dimensions.\n\nPlataformas móveis calculam deslocamento por tempo/motion; fragile solid→cracking→gone→solid, com atraso/respawn e prevenção de reaparecer dentro do corpo. collapseSpeed/respawnSpeed multiplicam duração (valor maior demora mais), apesar do nome speed. Objetos decorativos recebem eventos de golpe e feedback, não viram obstáculos letais automaticamente.\n';
fs.writeFileSync(path.join(root,'docs/MAPS.md'),maps);
console.log('Generated 115 reviewed legacy entries, 12 bosses, 18 map entries.');
