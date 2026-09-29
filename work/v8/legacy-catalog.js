(function(root){'use strict';
const list=[
 {
  "id": "broom",
  "name": "VASSOURA",
  "category": "weapon",
  "rarity": "common",
  "description": "- alcance razoavelmente bom\n- ataque relativamente lento\n- cobertura ampla\n- arma improvisada\n- fácil de entender",
  "active": false,
  "icon": 1,
  "scope": "cooldown"
 },
 {
  "id": "sword",
  "name": "ESPADA",
  "category": "weapon",
  "rarity": "common",
  "description": "- comportamento base semelhante à espada do Cavaleiro\n- equilibrada\n- referência vanilla da categoria",
  "active": false,
  "icon": 2,
  "scope": "cooldown"
 },
 {
  "id": "bow",
  "name": "ARCO",
  "category": "weapon",
  "rarity": "common",
  "description": "- ataque à distância\n- pequeno tempo de puxada\n- aproximadamente 3 segundos entre tiros\n- flecha legível\n- flecha colide com paredes/plataformas\n- flecha pode ser aparada\n- parry deve desviar/refletir adequadamente",
  "active": false,
  "icon": 3,
  "scope": "cooldown"
 },
 {
  "id": "knuckles",
  "name": "SOCO-INGLÊS",
  "category": "weapon",
  "rarity": "common",
  "description": "- alcance extremamente curto\n- ataques muito rápidos\n- sensação semelhante ao Pugilista\n- NÃO concede automaticamente o kit completo do Pugilista",
  "active": false,
  "icon": 4,
  "scope": "cooldown"
 },
 {
  "id": "axe",
  "name": "MACHADO",
  "category": "weapon",
  "rarity": "common",
  "description": "- ataque pesado\n- arco amplo\n- alcance médio\n- startup/recovery maiores que espada\n- leitura forte",
  "active": false,
  "icon": 5,
  "scope": "cooldown"
 },
 {
  "id": "kunai",
  "name": "KUNAI",
  "category": "weapon",
  "rarity": "common",
  "description": "- projétil de curto/médio alcance\n- cooldown aproximadamente 1–1.5s\n- trajetória reta\n- parryable\n- para/cai após distância razoável",
  "active": false,
  "icon": 6,
  "scope": "cooldown"
 },
 {
  "id": "leviathan",
  "name": "MACHADO LEVIATÃ",
  "category": "weapon",
  "rarity": "rare",
  "description": "Referência God of War.\n\nM1:\nataque melee normal.\n\nSegurar M1:\narremessa o machado.\n\nQuando o machado está longe:\nM1 chama o machado de volta.\n\nO machado:\n- mata indo\n- mata voltando\n- colide com cenário quando adequado\n- é fisicamente visível\n\nEnquanto está longe:\njogador fica desarmado.",
  "active": false,
  "icon": 7,
  "scope": "cooldown"
 },
 {
  "id": "needle",
  "name": "AGULHA",
  "category": "weapon",
  "rarity": "rare",
  "description": "Inspiração Hollow Knight / Silksong.\n\nIdentidade principal:\nPOGO.\n\nPermitir pogo:\n- em inimigos\n- em superfícies válidas\n- inclusive no chão\n\nPogo deve devolver impulso vertical.\n\nÉ híbrido de combate e mobilidade.",
  "active": false,
  "icon": 8,
  "scope": "cooldown"
 },
 {
  "id": "gunblade",
  "name": "GUNBLADE",
  "category": "weapon",
  "rarity": "rare",
  "description": "Inspiração FFVIII.\n\nAtaque normal:\ncorte de espada.\n\nDurante janela específica no impacto:\ninput adicional de trigger cria disparo/impacto extra.\n\nO valor mecânico vem do timing dentro do timing.",
  "active": false,
  "icon": 9,
  "scope": "cooldown"
 },
 {
  "id": "blunderbuss",
  "name": "BACAMARTE",
  "category": "weapon",
  "rarity": "rare",
  "description": "- tiro muito curto\n- espalhamento largo\n- quase instantâneo\n- um disparo muito perigoso\n- reload/cooldown longo\n- possível pequeno recoil aéreo",
  "active": false,
  "icon": 10,
  "scope": "cooldown"
 },
 {
  "id": "yoyo",
  "name": "IOIÔ",
  "category": "weapon",
  "rarity": "rare",
  "description": "Inspiração Terraria.\n\nSegurar M1:\nlança e mantém ioiô ativo.\n\nControle:\nposição/direção influenciada pela mira dentro de raio máximo.\n\nSoltar M1:\nretorna.\n\nRegras:\n- não atravessa parede\n- medium range\n- tempo ativo limitado\n- cooldown curto após retorno\n- ameaça persistente\n- parryable",
  "active": false,
  "icon": 11,
  "scope": "cooldown"
 },
 {
  "id": "yamato",
  "name": "YAMATO",
  "category": "weapon",
  "rarity": "legendary",
  "description": "Referência Devil May Cry.\n\nM1:\ncorte rápido.\n\nSegurar M1:\nbreve postura de bainha/preparação.\n\nDurante preparação:\nmarcar direção/área.\n\nSoltar:\ngera corte instantâneo à distância.\n\nNÃO é projétil viajando.\n\nÉ literalmente um corte espacial aparecendo na região.",
  "active": false,
  "icon": 12,
  "scope": "cooldown"
 },
 {
  "id": "ruyi",
  "name": "RUYI JINGU BANG",
  "category": "weapon",
  "rarity": "legendary",
  "description": "Bastão do Rei Macaco.\n\nM1:\nataque normal rápido.\n\nSegurar M1:\nbastão se estende violentamente a enorme distância.\n\nSe apontado contra o chão:\nextensão pode lançar o jogador para cima.\n\nMistura:\narma\ncontrole de espaço\nmobilidade",
  "active": false,
  "icon": 13,
  "scope": "cooldown"
 },
 {
  "id": "zenith",
  "name": "ZENITH",
  "category": "weapon",
  "rarity": "legendary",
  "description": "Inspiração Terraria.\n\nAtaque:\ngolpe principal + 2 ou 3 lâminas espectrais adicionais atravessando trajetórias ao redor da região ofensiva.\n\nNão copiar exatamente Terraria.\nAdaptar ao UM CORTE.",
  "active": false,
  "icon": 14,
  "scope": "cooldown"
 },
 {
  "id": "echo",
  "name": "LÂMINA DO ECO",
  "category": "weapon",
  "rarity": "legendary",
  "description": "Original.\n\nAtaque acontece normalmente.\n\nAproximadamente 0.6s depois:\no EXATO MESMO CORTE reaparece no MESMO ESPAÇO DO MUNDO onde ocorreu originalmente.\n\nNão seguir o jogador.\n\nMostrar fissura/eco visual discreto avisando onde o segundo corte acontecerá.",
  "active": false,
  "icon": 15,
  "scope": "cooldown"
 },
 {
  "id": "wingboot",
  "name": "BOTA ALADA",
  "category": "clothing",
  "rarity": "common",
  "description": "+1 salto aéreo adicional.",
  "active": false,
  "icon": 1,
  "scope": "cooldown"
 },
 {
  "id": "sandals",
  "name": "SANDÁLIAS DO VENTO",
  "category": "clothing",
  "rarity": "common",
  "description": "aumento perceptível de velocidade base de corrida.",
  "active": false,
  "icon": 2,
  "scope": "cooldown"
 },
 {
  "id": "kneepads",
  "name": "JOELHEIRAS",
  "category": "clothing",
  "rarity": "common",
  "description": "slide:\n- percorre distância maior\n- mantém fluidez\n- melhora eficiência",
  "active": false,
  "icon": 3,
  "scope": "cooldown"
 },
 {
  "id": "climbing",
  "name": "LUVAS DE ESCALADA",
  "category": "clothing",
  "rarity": "common",
  "description": "Ao segurar direção contra a parede:\npersonagem trava completamente na parede.\n\nNão desliza.\n\nSoltar direção:\ndesgruda.\n\nPular:\nwall jump normal.\n\nNão usar stamina inicialmente.",
  "active": false,
  "icon": 4,
  "scope": "cooldown"
 },
 {
  "id": "lightcape",
  "name": "CAPA LEVE",
  "category": "clothing",
  "rarity": "common",
  "description": "Segurar pulo enquanto cai:\nreduz velocidade de queda.\n\nNão é glide completo.",
  "active": false,
  "icon": 5,
  "scope": "cooldown"
 },
 {
  "id": "duelistband",
  "name": "FAIXA DO DUELISTA",
  "category": "clothing",
  "rarity": "common",
  "description": "reduz recovery de um parry errado/missed parry.",
  "active": false,
  "icon": 6,
  "scope": "cooldown"
 },
 {
  "id": "shadowcloak",
  "name": "MANTO SOMBRIO",
  "category": "clothing",
  "rarity": "rare",
  "description": "Dash vira Shadow Dash.\n\nDurante parte curta do dash:\n- intangível contra ataques\n- atravessa inimigos\n\nÓtimo para cross-up.\n\nNÃO atravessa paredes sólidas.\nIsso pertence ao Traje Fantasma.",
  "active": false,
  "icon": 7,
  "scope": "cooldown"
 },
 {
  "id": "glider",
  "name": "CAPA PLANADORA",
  "category": "clothing",
  "rarity": "rare",
  "description": "Segurar pulo no ar:\nglide verdadeiro.\n\n- mantém deslocamento horizontal\n- queda lenta\n- soltar fecha\n- controle claro",
  "active": true,
  "icon": 8,
  "scope": "cooldown"
 },
 {
  "id": "crystal",
  "name": "ARMADURA DE CRISTAL",
  "category": "clothing",
  "rarity": "rare",
  "description": "Bloqueia 1 golpe mortal por PARTIDA.\n\nAo bloquear:\n- estilhaça visualmente\n- perde proteção até próxima partida\n\nNo próximo nível/confronto:\nreconstrói.",
  "active": false,
  "icon": 9,
  "scope": "match"
 },
 {
  "id": "magnetic",
  "name": "BOTAS MAGNÉTICAS",
  "category": "clothing",
  "rarity": "rare",
  "description": "Ao segurar contra parede:\npermite correr ao longo dela por período curto.\n\nNão permitir andar livremente no teto.",
  "active": false,
  "icon": 10,
  "scope": "cooldown"
 },
 {
  "id": "mirrorcloak",
  "name": "MANTO DO ESPELHO",
  "category": "clothing",
  "rarity": "rare",
  "description": "Ao dar dash:\ndeixa afterimage convincente na posição inicial.\n\nAfterimage:\n- não ataca\n- não colide\n- serve como distração visual",
  "active": false,
  "icon": 11,
  "scope": "cooldown"
 },
 {
  "id": "rockets",
  "name": "BOTAS-FOGUETE",
  "category": "clothing",
  "rarity": "rare",
  "description": "No ar:\nsegurar pulo aciona pequenos propulsores.\n\nUsa combustível curto.\n\nCombustível:\n- recarrega somente ao tocar chão/plataforma\n\nPermitir controle vertical.\n\nNão virar voo ilimitado.\n\nIntegrar com:\n- double jump\n- air dash\n- fast fall",
  "active": true,
  "icon": 12,
  "scope": "cooldown"
 },
 {
  "id": "berserker",
  "name": "ARMADURA DO BERSERKER",
  "category": "clothing",
  "rarity": "legendary",
  "description": "1x por PARTIDA.\n\nQuando o jogador recebe golpe mortal:\nnão morre imediatamente.\n\nEntra em estado de fúria por aproximadamente 2 segundos.\n\nSe matar um inimigo dentro desse período:\nsobrevive.\n\nSe não matar:\nmorre ao terminar o período.\n\nVisualmente:\narmadura ativa/fecha e personagem entra em estado agressivo.",
  "active": false,
  "icon": 13,
  "scope": "match"
 },
 {
  "id": "icarus",
  "name": "ASAS DE ÍCARO",
  "category": "clothing",
  "rarity": "legendary",
  "description": "Voo real limitado.\n\nAo ativar:\npermitir deslocamento aéreo controlado.\n\nUsar barra de energia curta.\n\nEnergia recupera ao pousar.\n\nNão permitir voo infinito.",
  "active": true,
  "icon": 14,
  "scope": "cooldown"
 },
 {
  "id": "ghostsuit",
  "name": "TRAJE FANTASMA",
  "category": "clothing",
  "rarity": "legendary",
  "description": "Dash atravessa GEOMETRIA do mapa.\n\nPode passar:\n- paredes\n- plataformas válidas\n\nPrecisa de proteção contra:\n- softlock\n- sair permanentemente da arena\n- ficar preso em collider",
  "active": false,
  "icon": 15,
  "scope": "cooldown"
 },
 {
  "id": "stonemask",
  "name": "MÁSCARA DE PEDRA",
  "category": "clothing",
  "rarity": "legendary",
  "description": "Referência JoJo.\n\nTransformação vampírica.\n\nConcede:\n- movimentação mais predatória\n- wall cling natural\n- saltos mais agressivos\n- matar inimigo restaura imediatamente recursos de mobilidade como dash/air dash/pulos relevantes\n\nNão adicionar HP.",
  "active": false,
  "icon": 16,
  "scope": "cooldown"
 },
 {
  "id": "gravitycloak",
  "name": "MANTO DA GRAVIDADE",
  "category": "clothing",
  "rarity": "legendary",
  "description": "Ação ativa.\n\nInverte a gravidade SOMENTE do próprio personagem.\n\nChão vira teto.\n\nNova ativação:\nvolta gravidade ao normal.\n\nIntegrar corretamente com:\n- plataformas\n- dash\n- wall systems\n- ataques\n- câmera\n- fatal fall logic",
  "active": true,
  "icon": 17,
  "scope": "cooldown"
 },
 {
  "id": "warbell",
  "name": "SINO DE GUERRA",
  "category": "relic",
  "rarity": "common",
  "description": "Perfect Parry:\nrecarrega imediatamente dash.",
  "active": false,
  "icon": 1,
  "scope": "cooldown"
 },
 {
  "id": "crackedglass",
  "name": "AMPULHETA RACHADA",
  "category": "relic",
  "rarity": "common",
  "description": "Ao matar inimigo:\nrestaurar recursos de movimentação:\n- dash\n- air dash\n- saltos aéreos",
  "active": false,
  "icon": 2,
  "scope": "cooldown"
 },
 {
  "id": "glasseye",
  "name": "OLHO DE VIDRO",
  "category": "relic",
  "rarity": "common",
  "description": "Quando inimigo entra em startup de ataque:\npequeno flash/brilho informativo.\n\nNão aumentar mecanicamente reaction window.\nÉ apenas clareza visual.",
  "active": false,
  "icon": 3,
  "scope": "cooldown"
 },
 {
  "id": "coin",
  "name": "MOEDA VICIADA",
  "category": "relic",
  "rarity": "common",
  "description": "Em cada draft:\npermite 1 reroll da seleção inteira.\n\nSe Trevo de Quatro Folhas estiver ativo:\nreroll continua mostrando 4 cartas.",
  "active": false,
  "icon": 4,
  "scope": "cooldown"
 },
 {
  "id": "wolftooth",
  "name": "DENTE DE LOBO",
  "category": "relic",
  "rarity": "common",
  "description": "Depois de evitar um ataque perigosamente próximo através de dash:\npróximo ataque dentro de janela curta recebe área/slash levemente maior.\n\nNão aumenta “dano”, porque UM CORTE é one-hit.",
  "active": false,
  "icon": 5,
  "scope": "cooldown"
 },
 {
  "id": "irontalisman",
  "name": "TALISMÃ DE FERRO",
  "category": "relic",
  "rarity": "common",
  "description": "Reduz fortemente deslocamento recebido por:\n- chutes\n- knockbacks\n- impulsos não-letais",
  "active": false,
  "icon": 6,
  "scope": "cooldown"
 },
 {
  "id": "incense",
  "name": "INCENSO DA CALMA",
  "category": "relic",
  "rarity": "common",
  "description": "Depois de permanecer parado brevemente:\narma o próximo parry.\n\nO próximo parry recebe uma janela levemente maior.\n\nDepois de usado:\nprecisa ficar parado novamente para rearmar.",
  "active": false,
  "icon": 7,
  "scope": "cooldown"
 },
 {
  "id": "clover",
  "name": "TREVO DE QUATRO FOLHAS",
  "category": "relic",
  "rarity": "rare",
  "description": "Drafts mostram 4 opções em vez de 3.",
  "active": false,
  "icon": 8,
  "scope": "cooldown"
 },
 {
  "id": "d6",
  "name": "D6",
  "category": "relic",
  "rarity": "rare",
  "description": "1x por PARTIDA.\n\nJogador escolhe UM Legado próprio elegível.\n\nEsse Legado é temporariamente rerrolado para outro Legado ALEATÓRIO da MESMA raridade durante aquela partida.\n\nNo fim da partida:\nLegado original volta.\n\nExcluir:\n- o próprio D6\n- Legados incompatíveis com modo\n- Legados já possuídos",
  "active": true,
  "icon": 9,
  "scope": "match"
 },
 {
  "id": "stoppedclock",
  "name": "RELÓGIO PARADO",
  "category": "relic",
  "rarity": "rare",
  "description": "Perfect Parry:\ngera breve slow-motion dos inimigos/mundo hostil.\n\nJogador permanece praticamente normal.\n\nUsar cooldown interno pequeno para não ficar permanente em cadeias absurdas.",
  "active": false,
  "icon": 10,
  "scope": "cooldown"
 },
 {
  "id": "brokenmirror",
  "name": "ESPELHO PARTIDO",
  "category": "relic",
  "rarity": "rare",
  "description": "1x por PARTIDA.\n\nQuando adversário usa uma habilidade/especial próximo:\nEspelho pode memorizar aquela habilidade.\n\nPróxima ativação do slot do Espelho:\nexecuta UMA cópia da habilidade.\n\nDepois:\nEspelho fica gasto até próxima partida.\n\nNão copiar:\n- transformações persistentes impossíveis\n- recursos exclusivos de boss que não façam sentido\n- efeitos que quebrariam estado do jogo",
  "active": true,
  "icon": 11,
  "scope": "match"
 },
 {
  "id": "markedcard",
  "name": "CARTA MARCADA",
  "category": "relic",
  "rarity": "rare",
  "description": "Durante um draft:\njogador pode marcar uma das opções rejeitadas.\n\nA carta marcada é garantida em um draft futuro válido da mesma run.\n\nQuando reaparece:\nmarca é consumida.\n\nSe ela deixar de ser elegível:\nrerrolar de maneira segura.",
  "active": false,
  "icon": 12,
  "scope": "cooldown"
 },
 {
  "id": "survivorglass",
  "name": "AMPULHETA DO SOBREVIVENTE",
  "category": "relic",
  "rarity": "rare",
  "description": "1x por PARTIDA.\n\nSe o jogador passar extremamente perto de um ataque letal sem ser atingido:\nacionar micro slow-motion automático por alguns décimos.",
  "active": false,
  "icon": 13,
  "scope": "match"
 },
 {
  "id": "magnet",
  "name": "ÍMÃ DA FORTUNA",
  "category": "relic",
  "rarity": "rare",
  "description": "Se um draft contiver uma carta Lendária:\npelo menos UMA das outras opções deve ser Rara ou melhor.",
  "active": false,
  "icon": 14,
  "scope": "cooldown"
 },
 {
  "id": "philosopher",
  "name": "PEDRA FILOSOFAL",
  "category": "relic",
  "rarity": "legendary",
  "description": "USO ÚNICO POR RUN.\n\nAo ativar:\n\n- escolher ALEATORIAMENTE um Legado próprio que possa subir de raridade;\n- jogador NÃO escolhe qual;\n- transformar ALEATORIAMENTE esse Legado em outro da categoria/raridade superior adequada;\n- transformação dura apenas a PARTIDA atual;\n- ao terminar a partida, Legado original volta;\n- Pedra Filosofal permanece consumida pelo resto da run.\n\nCommon -> Rare\nRare -> Legendary\n\nNão selecionar Legendary como alvo, pois não há tier acima.\n\nAo usar:\nPedra deve quebrar/desintegrar visualmente.",
  "active": true,
  "icon": 15,
  "scope": "run"
 },
 {
  "id": "crown",
  "name": "COROA DO CONQUISTADOR",
  "category": "relic",
  "rarity": "legendary",
  "description": "No Caminho do Guerreiro:\n\nao derrotar Miniboss:\npermitir roubar UM dos Legados que ele possuía.\n\nEsse Legado é adicionado permanentemente à build daquela run.\n\nNão substituir o draft normal.\n\nÉ uma recompensa extra.\n\nEm modos sem Miniboss:\nnão oferecer a Coroa no pool normal, salvo Admin.",
  "active": false,
  "icon": 16,
  "scope": "cooldown"
 },
 {
  "id": "contract",
  "name": "CONTRATO DO DIABO",
  "category": "relic",
  "rarity": "legendary",
  "description": "Funciona SOMENTE em drafts após Miniboss.\n\nNormal:\nescolhe 1 carta.\n\nCom Contrato:\npode escolher 2 cartas.\n\nNão funciona em Boss normal.\nNão funciona em drafts comuns.",
  "active": false,
  "icon": 17,
  "scope": "cooldown"
 },
 {
  "id": "destinyorb",
  "name": "ORBE DO DESTINO",
  "category": "relic",
  "rarity": "legendary",
  "description": "1x por RUN.\n\nDurante um draft:\npermite visualizar uma futura seleção válida de Legados.\n\nJogador pode:\n- manter draft atual\nOU\n- substituir o draft atual pela seleção futura mostrada\n\nRespeitar Trevo, pools, garantias e exclusões.\n\nDepois:\nOrbe fica consumido.",
  "active": true,
  "icon": 18,
  "scope": "run"
 },
 {
  "id": "secondchance",
  "name": "ANEL DA SEGUNDA CHANCE",
  "category": "relic",
  "rarity": "legendary",
  "description": "1x por PARTIDA.\n\nQuando jogador morrer em um duelo:\nem vez de registrar imediatamente aquela derrota,\nrebobinar TODO O DUELO para o estado inicial.\n\nResetar:\n- posições\n- projéteis\n- summons\n- cooldowns do início daquele duelo\n- estados transitórios\n\nNÃO resetar o próprio consumo do Anel.\n\nOu seja:\nnão criar loop infinito.\n\nPlacar da partida permanece como estava antes daquele duelo.",
  "active": false,
  "icon": 19,
  "scope": "match"
 },
 {
  "id": "d20",
  "name": "DADO DE 20 FACES",
  "category": "relic",
  "rarity": "legendary",
  "description": "1x por PARTIDA.\n\nAntes de rolar:\njogador escolhe um dos dois modos:\n\nA) PERSONAGEM\nB) PRÓXIMO DRAFT\n\nDepois:\nrolar visualmente 1–20.\n\nMODO PERSONAGEM:\nefeito dura aquela partida.\n\n1:\npenalidade severa.\n\n2–5:\npenalidade moderada.\n\n6–9:\npequena penalidade.\n\n10–11:\nefeito quase neutro.\n\n12–15:\nbenefício moderado.\n\n16–19:\nbenefício forte.\n\n20:\nbenefício excepcional.\n\nPossíveis parâmetros:\n- velocidade de corrida\n- tamanho/alcance ofensivo\n- dash cooldown\n- recovery\n- mobilidade aérea\n\nNão alterar HP.\n\nMODO PRÓXIMO DRAFT:\n\nresultado baixo:\npiora raridade das cartas não-garantidas.\n\nresultado alto:\nmelhora raridade.\n\n20:\ngarantir pelo menos uma Lendária e fazer outras opções terem qualidade alta.\n\n1:\ndraft extremamente ruim, mas NUNCA violar garantias obrigatórias de Miniboss/Boss.",
  "active": true,
  "icon": 20,
  "scope": "match"
 },
 {
  "id": "destinyeye",
  "name": "OLHO DO DESTINO",
  "category": "relic",
  "rarity": "legendary",
  "description": "1x por PARTIDA.\n\nQuando um golpe fatal está prestes a conectar:\nmicro-freeze dramático.\n\nJogador recebe uma curtíssima última janela para:\n- dash\n- parry\n- pular\n- escapar de alguma forma válida\n\nNão salva automaticamente.\n\nSe não reagir:\nmorre normalmente.",
  "active": false,
  "icon": 21,
  "scope": "match"
 },
 {
  "id": "downstrike",
  "name": "GOLPE DESCENDENTE",
  "category": "technique",
  "rarity": "common",
  "description": "No ar:\n↓ + ataque\n\nExecuta ataque direcionado para baixo usando arma atual.\n\nDesarmado:\nvira golpe/pisada corporal.",
  "active": false,
  "icon": 1,
  "scope": "cooldown"
 },
 {
  "id": "upstrike",
  "name": "GOLPE ASCENDENTE",
  "category": "technique",
  "rarity": "common",
  "description": "↑ + ataque\n\nAtaque orientado verticalmente para ameaças acima.\n\nAdaptar geometria conforme arma.",
  "active": false,
  "icon": 2,
  "scope": "cooldown"
 },
 {
  "id": "flyingkick",
  "name": "CHUTE VOADOR",
  "category": "technique",
  "rarity": "common",
  "description": "Chute no ar:\nprojeta personagem diagonalmente para frente.\n\nNão mata diretamente.\nEmpurra significativamente.",
  "active": false,
  "icon": 3,
  "scope": "cooldown"
 },
 {
  "id": "roundhouse",
  "name": "CHUTE GIRATÓRIO",
  "category": "technique",
  "rarity": "common",
  "description": "Segurar chute brevemente:\nexecuta roundhouse amplo.\n\nMaior área e knockback.\nNão letal por si.",
  "active": false,
  "icon": 4,
  "scope": "cooldown"
 },
 {
  "id": "stomp",
  "name": "PISADA",
  "category": "technique",
  "rarity": "common",
  "description": "No ar:\n↓ + chute\n\nPersonagem despenca rapidamente.\n\nAcertando inimigo:\nempurra para baixo e dá pequeno bounce ao jogador.",
  "active": false,
  "icon": 5,
  "scope": "cooldown"
 },
 {
  "id": "wallstrike",
  "name": "SALTO DE PAREDE OFENSIVO",
  "category": "technique",
  "rarity": "common",
  "description": "Durante wall state:\natacar junto do wall jump cria saída ofensiva.\n\nJogador salta para fora da parede atacando simultaneamente.",
  "active": false,
  "icon": 6,
  "scope": "cooldown"
 },
 {
  "id": "counter",
  "name": "CONTRA-ATAQUE",
  "category": "technique",
  "rarity": "rare",
  "description": "Depois de parry bem-sucedido:\njanela curta para ataque.\n\nExecuta resposta muito rápida com arma atual.\n\nNão automático.",
  "active": false,
  "icon": 7,
  "scope": "cooldown"
 },
 {
  "id": "dashcancel",
  "name": "CANCELAMENTO DE DASH",
  "category": "technique",
  "rarity": "rare",
  "description": "Permite gastar carga/recurso de dash para cancelar parte do recovery de ataque.\n\nUso:\nataque -> percebe risco -> dash cancel.",
  "active": false,
  "icon": 8,
  "scope": "cooldown"
 },
 {
  "id": "projectilecut",
  "name": "CORTE DE PROJÉTEIS",
  "category": "technique",
  "rarity": "rare",
  "description": "Com timing correto:\natingir projétil com ataque destrói ou rebate o projétil.\n\nDiferente de parry.",
  "active": false,
  "icon": 9,
  "scope": "cooldown"
 },
 {
  "id": "throw",
  "name": "ARREMESSO",
  "category": "technique",
  "rarity": "rare",
  "description": "Próximo do inimigo:\ncombinação como ↓ + chute.\n\nAgarra e joga adversário para o outro lado.\n\nNão mata diretamente.\n\nPode:\n- reposicionar\n- jogar em hazard\n- jogar de plataforma",
  "active": false,
  "icon": 10,
  "scope": "cooldown"
 },
 {
  "id": "backstep",
  "name": "PASSO DE RECUO",
  "category": "technique",
  "rarity": "rare",
  "description": "Durante startup de ataque:\ndireção oposta + dash em janela curta.\n\nCancela ataque e executa pequeno retreat.",
  "active": false,
  "icon": 11,
  "scope": "cooldown"
 },
 {
  "id": "lunge",
  "name": "INVESTIDA OFENSIVA",
  "category": "technique",
  "rarity": "rare",
  "description": "Atacar imediatamente no início do dash:\nconverte em ataque de investida próprio.\n\nNão apenas “ataque comum durante dash”.\n\nPossui:\n- trajetória específica\n- commitment\n- leitura própria",
  "active": false,
  "icon": 12,
  "scope": "cooldown"
 },
 {
  "id": "iaijutsu",
  "name": "IAIJUTSU",
  "category": "technique",
  "rarity": "rare",
  "description": "NÃO usar a antiga versão de “ficar parado carregando”.\nIsso repetia Sem Saque.\n\nNova versão:\n\ndepois de um dash terrestre:\ndurante pequena janela,\npressionar ataque executa um corte de saque atravessando a linha ofensiva.\n\nQuando possível:\njogador termina do outro lado do alvo/linha.\n\nVisual:\nsaque extremamente rápido.\n\nAdaptar ao tipo de arma atual.",
  "active": false,
  "icon": 13,
  "scope": "cooldown"
 },
 {
  "id": "mikiri",
  "name": "MIKIRI",
  "category": "technique",
  "rarity": "legendary",
  "description": "Contra ataques identificados como:\n- estocada\n- investida linear\n\nDar dash NA DIREÇÃO do golpe em timing difícil:\nneutraliza a ameaça e coloca jogador em posição favorável.\n\nNão exigir janela impossível.\nDeve ser difícil, mas aprendível.",
  "active": false,
  "icon": 14,
  "scope": "cooldown"
 },
 {
  "id": "disarm",
  "name": "DESARMAMENTO",
  "category": "technique",
  "rarity": "legendary",
  "description": "Perfect Parry:\nautomaticamente desarma adversário quando ele estiver usando arma elegível.\n\nArma cai fisicamente no cenário.\n\nInimigo fica desarmado até recuperá-la.\n\nNão exigir segundo input.\n\nO Perfect Parry já é o teste de habilidade.",
  "active": false,
  "icon": 15,
  "scope": "cooldown"
 },
 {
  "id": "perfectstep",
  "name": "PASSO PERFEITO",
  "category": "technique",
  "rarity": "legendary",
  "description": "Dash no último instante antes de um golpe acertar:\ngera Perfect Dodge.\n\nJogador escapa e recebe pequena oportunidade de resposta.\n\nNão ler input inimigo.\nUsar estado real da hitbox/ameaça.",
  "active": false,
  "icon": 16,
  "scope": "cooldown"
 },
 {
  "id": "nodraw",
  "name": "SEM SAQUE",
  "category": "technique",
  "rarity": "legendary",
  "description": "No chão:\nficar parado brevemente permite entrar em postura.\n\nEnquanto em postura:\nataque executa golpe extremamente rápido.\n\nSe errar:\nrecovery alto.\n\nFantasia:\nduelo de nervos.",
  "active": false,
  "icon": 17,
  "scope": "cooldown"
 },
 {
  "id": "weaponmaster",
  "name": "MESTRE DAS ARMAS",
  "category": "technique",
  "rarity": "legendary",
  "description": "Permite arremessar QUALQUER arma equipada.\n\nArma:\n- vira projétil físico\n- pode matar\n- pode ser aparada\n- colide com cenário\n- cai fisicamente onde terminar\n\nJogador fica desarmado até recuperar.\n\nInterações emergentes devem funcionar.\n\nExemplos:\nMestre das Armas + Macaquinho Ladrão\nMestre das Armas + Telecinese\nMestre das Armas + Desarmamento\nMestre das Armas + Portais\n\nMachado Leviatã mantém seu recall específico.",
  "active": true,
  "icon": 18,
  "scope": "cooldown"
 },
 {
  "id": "raven",
  "name": "CORVO",
  "category": "summon",
  "rarity": "common",
  "description": "Voa perto do jogador.\n\nPeriodicamente:\nrasante contra adversário.\n\nNão mata.\nCausa pequeno empurrão/interrupção.",
  "active": false,
  "icon": 1,
  "scope": "cooldown"
 },
 {
  "id": "slime",
  "name": "SLIME",
  "category": "summon",
  "rarity": "common",
  "description": "Segue jogador lentamente pelo chão.\n\nAo tocar inimigo:\ngruda por curto período e reduz movimento.\n\nNão paralisar completamente.",
  "active": false,
  "icon": 2,
  "scope": "cooldown"
 },
 {
  "id": "beetle",
  "name": "BESOURO-ESCUDO",
  "category": "summon",
  "rarity": "common",
  "description": "Orbita jogador.\n\nPode interceptar UM projétil hostil.\n\nDepois:\ncooldown antes de voltar a proteger.\n\nNão bloqueia melee.",
  "active": false,
  "icon": 3,
  "scope": "cooldown"
 },
 {
  "id": "fairy",
  "name": "FADA",
  "category": "summon",
  "rarity": "common",
  "description": "Segue jogador.\n\nSe jogador passar certo tempo sem tocar chão:\ndá pequeno impulso vertical automático.\n\nNão é voo.\nNão é salto extra sob comando.",
  "active": false,
  "icon": 4,
  "scope": "cooldown"
 },
 {
  "id": "hound",
  "name": "CÃO DE CAÇA",
  "category": "summon",
  "rarity": "common",
  "description": "Corre atrás do adversário.\n\nQuando alcança:\nmordida não letal com knockback.\n\nDepois:\nretorna e entra em cooldown.",
  "active": false,
  "icon": 5,
  "scope": "cooldown"
 },
 {
  "id": "lantern",
  "name": "ESPÍRITO-LANTERNA",
  "category": "summon",
  "rarity": "common",
  "description": "Flutua próximo.\n\nPeriodicamente:\nmarca inimigo com brilho claro.\n\nServe para acompanhar posição em meio a:\n- fumaça\n- efeitos\n- cenários escuros\n- confusão visual",
  "active": false,
  "icon": 6,
  "scope": "cooldown"
 },
 {
  "id": "monkey",
  "name": "MACAQUINHO LADRÃO",
  "category": "summon",
  "rarity": "common",
  "description": "Corre atrás de armas caídas.\n\nQuando encontra:\npega e leva até o jogador.\n\nPode pegar:\n- arma própria arremessada\n- arma desarmada de adversário\n\nCriar animação clara carregando arma.",
  "active": false,
  "icon": 7,
  "scope": "cooldown"
 },
 {
  "id": "falcon",
  "name": "FALCÃO DE GUERRA",
  "category": "summon",
  "rarity": "rare",
  "description": "Circula acima.\n\nPossui ação ativa.\n\nAo ativar:\nmergulha na direção da mira/alvo.\n\nPode matar.\n\nAtaque:\n- telegráfico\n- parryable\n\nDepois:\nprecisa retornar ao jogador antes de novo ataque.",
  "active": true,
  "icon": 8,
  "scope": "cooldown"
 },
 {
  "id": "spectral",
  "name": "ESPADACHIM ESPECTRAL",
  "category": "summon",
  "rarity": "rare",
  "description": "NÃO copiar o último ataque do jogador.\nIsso repetia Lâmina do Eco/Doppelgänger.\n\nNova versão:\n\nfica intangível/invisível na maior parte do tempo.\n\nPeriodicamente:\n- escolhe flanco do adversário\n- materializa\n- mostra aviso curto\n- executa um corte independente\n- desaparece novamente\n\nÉ uma ameaça autônoma de flanco.",
  "active": false,
  "icon": 9,
  "scope": "cooldown"
 },
 {
  "id": "toad",
  "name": "SAPO-GIGANTE",
  "category": "summon",
  "rarity": "rare",
  "description": "Usa língua.\n\nPode atingir:\n- inimigos\n- armas\n- objetos\n\nInimigo:\npuxa em direção ao sapo/jogador.\n\nObjeto:\ntraz de volta.\n\nIMPORTANTE:\nNÃO funciona como grappling hook para o jogador.",
  "active": false,
  "icon": 10,
  "scope": "cooldown"
 },
 {
  "id": "skeleton",
  "name": "CAVALEIRO ESQUELETO",
  "category": "summon",
  "rarity": "rare",
  "description": "Aliado autônomo com espada.\n\nAtaca adversários.\n\nGolpes:\n- lentos\n- legíveis\n- podem matar\n- podem ser aparados\n\nSe for atingido:\ndesmonta em ossos.\n\nDepois de cooldown grande:\nreconstrói.",
  "active": false,
  "icon": 11,
  "scope": "cooldown"
 },
 {
  "id": "mimic",
  "name": "MÍMICO",
  "category": "summon",
  "rarity": "rare",
  "description": "Segue jogador como baú.\n\nQuando inimigo entra perto:\nabre e tenta agarrar por curto instante.\n\nDepois:\ncooldown.\n\nTambém pode tentar engolir certos projéteis/objetos que cruzem sua área.",
  "active": false,
  "icon": 12,
  "scope": "cooldown"
 },
 {
  "id": "medusa",
  "name": "MEDUSA ABISSAL",
  "category": "summon",
  "rarity": "rare",
  "description": "Substitui completamente o antigo Polvo do Vazio.\n\nÁgua-viva/entidade flutuante.\n\nMove lentamente.\n\nPeriodicamente:\ncarrega eletricidade e cria zona circular perigosa ao redor.\n\nA zona transforma a Medusa numa área móvel de controle.\n\nNão usar tentáculos.",
  "active": false,
  "icon": 13,
  "scope": "cooldown"
 },
 {
  "id": "doppel",
  "name": "DOPPELGÄNGER",
  "category": "summon",
  "rarity": "rare",
  "description": "Cópia fantasmagórica do jogador.\n\nRepete com pequeno atraso:\n- movimentação\n- saltos\n- ataques físicos\n\nNão possui body collision normal.\n\nNão copia:\n- poderes absurdos\n- summons\n- ativações que causariam recursão\n\nÉ um replay atrasado do comportamento.",
  "active": false,
  "icon": 14,
  "scope": "cooldown"
 },
 {
  "id": "necromancer",
  "name": "NECROMANTE MIRIM",
  "category": "summon",
  "rarity": "rare",
  "description": "Pequeno espírito/criatura.\n\nQuando jogador mata inimigo no Caminho:\npode reanimar aquele inimigo como servo temporário.\n\nMáximo:\n1 cadáver reanimado por vez.\n\nServo dura até:\n- morrer\n- terminar partida\n- ser substituído\n\nUsar classe/moveset do inimigo morto com IA aliada simplificada.",
  "active": false,
  "icon": 15,
  "scope": "cooldown"
 },
 {
  "id": "dragon",
  "name": "DRAGÃO ANCESTRAL",
  "category": "summon",
  "rarity": "legendary",
  "description": "Entidade gigante circulando fundo/acima.\n\nAção ativa:\njogador marca direção/região.\n\nDepois de telegraph claro:\ndragão atravessa/ataca com enorme rajada de fogo.\n\nRajada é letal.\n\nPode atingir o próprio invocador se ele permanecer na área.",
  "active": true,
  "icon": 16,
  "scope": "cooldown"
 },
 {
  "id": "mahoraga",
  "name": "MAHORAGA",
  "category": "summon",
  "rarity": "legendary",
  "description": "Referência JJK.\n\nInvocação baseada em ADAPTAÇÃO.\n\nDurante a partida:\nobserva/interage com ameaças e progressivamente melhora respostas.\n\nExemplos:\n- projéteis -> passa a defender/esquivar melhor\n- ataques frontais -> procura flanco\n- inimigo aéreo -> adapta ataques verticais\n\nNão virar invencível.\n\nA adaptação deve ser perceptível através da roda/efeito visual.\n\nResetar adaptação conforme regra apropriada de partida.",
  "active": false,
  "icon": 17,
  "scope": "cooldown"
 },
 {
  "id": "star",
  "name": "STAR PLATINUM",
  "category": "summon",
  "rarity": "legendary",
  "description": "Referência JoJo.\n\nManifestado próximo do jogador.\n\nPassivamente:\nacompanha alguns ataques com golpes curtos e rápidos.\n\nAção ativa:\nTHE WORLD.\n\nThe World:\n- uso muito limitado\n- aproximadamente 1x por duelo\n- para o tempo por intervalo BEM curto\n- não criar cutscene longa\n\nRepresentar visualmente com forte efeito temporal.",
  "active": true,
  "icon": 18,
  "scope": "duel"
 },
 {
  "id": "kraken",
  "name": "KRAKEN",
  "category": "summon",
  "rarity": "legendary",
  "description": "Entidade colossal fora da arena.\n\nTentáculos gigantes surgem:\n- bordas\n- chão\n- paredes\n\nJogador pode ordenar ataques em regiões.\n\nVariações:\n- esmagar\n- agarrar\n- bloquear rota\n\nTelegraph obrigatório.",
  "active": true,
  "icon": 19,
  "scope": "cooldown"
 },
 {
  "id": "slimeking",
  "name": "REI SLIME",
  "category": "summon",
  "rarity": "legendary",
  "description": "Slime gigantesco.\n\nAtaca pulando/esmagando.\n\nAo morrer:\ndivide em 2 slimes menores.\n\nEsses podem se dividir novamente em 4 menores.\n\nDepois da última camada:\ndesaparecem.",
  "active": false,
  "icon": 20,
  "scope": "cooldown"
 },
 {
  "id": "legion",
  "name": "LEGIÃO",
  "category": "summon",
  "rarity": "legendary",
  "description": "Invoca três guerreiros espectrais:\n\n1 melee\n1 ranged\n1 defensivo/protetor\n\nIndividualmente são menos fortes que uma Invocação Lendária única.\n\nForça vem do grupo.\n\nQuando um morre:\nfica morto até próximo duelo.",
  "active": false,
  "icon": 21,
  "scope": "cooldown"
 },
 {
  "id": "hunter",
  "name": "CAÇADOR DO ABISMO",
  "category": "summon",
  "rarity": "legendary",
  "description": "Criatura gigantesca que observa fora da arena.\n\nPeriodicamente:\nmarca um adversário como presa.\n\nDepois de aviso claro:\nentra na arena especificamente para caçar aquele alvo por período curto.\n\nO jogador marcado deve perceber claramente:\n“fui escolhido”.\n\nDepois:\ncriatura recua e entra em cooldown.",
  "active": false,
  "icon": 22,
  "scope": "cooldown"
 },
 {
  "id": "fireball",
  "name": "BOLA DE FOGO",
  "category": "power",
  "rarity": "common",
  "description": "Projétil relativamente lento.\n\nLetal.\n\nLegível.\n\nParryable.\n\nCooldown razoável.",
  "active": true,
  "icon": 1,
  "scope": "cooldown"
 },
 {
  "id": "pulse",
  "name": "PULSO CINÉTICO",
  "category": "power",
  "rarity": "common",
  "description": "Onda curta ao redor/frente do personagem.\n\nNão mata diretamente.\n\nEmpurra fortemente:\n- inimigos\n- objetos",
  "active": true,
  "icon": 2,
  "scope": "cooldown"
 },
 {
  "id": "impulse",
  "name": "IMPULSO",
  "category": "power",
  "rarity": "common",
  "description": "Explosão de força aplicada no próprio personagem.\n\nLança jogador na direção da mira.\n\nNão causa dano diretamente.",
  "active": true,
  "icon": 3,
  "scope": "cooldown"
 },
 {
  "id": "barrier",
  "name": "BARREIRA ARCANA",
  "category": "power",
  "rarity": "common",
  "description": "Cria pequena barreira frontal temporária.\n\nBloqueia um ataque/projétil e quebra.\n\nCooldown relativamente alto.\n\nNão funciona como Perfect Parry.\n\nNão contra-ataca automaticamente.",
  "active": true,
  "icon": 4,
  "scope": "cooldown"
 },
 {
  "id": "telekinesis",
  "name": "TELECINESE",
  "category": "power",
  "rarity": "common",
  "description": "Puxa para o jogador:\n- arma caída\n- objeto físico elegível\n\nNão puxa diretamente jogadores.",
  "active": true,
  "icon": 5,
  "scope": "cooldown"
 },
 {
  "id": "gust",
  "name": "RAJADA DE VENTO",
  "category": "power",
  "rarity": "common",
  "description": "Corrente de ar durante curto período.\n\nEmpurra continuamente:\n- inimigos\n- objetos\n- projéteis leves quando apropriado",
  "active": true,
  "icon": 6,
  "scope": "cooldown"
 },
 {
  "id": "swap",
  "name": "TROCA",
  "category": "power",
  "rarity": "common",
  "description": "Primeira ativação:\nmarca posição atual.\n\nSegunda ativação dentro de janela:\nteleporta jogador de volta para marca.\n\nNão rebobina mundo.\n\nNão restaura estado anterior.",
  "active": true,
  "icon": 7,
  "scope": "cooldown"
 },
 {
  "id": "web",
  "name": "WEB SHOOTERS",
  "category": "power",
  "rarity": "rare",
  "description": "Referência Spider-Man.\n\nDisparar teia para direção da mira.\n\nSe acertar parede/teto:\ncria fio e permite swing/pull.\n\nMovimentação deve depender de geometria.\n\nNÃO virar voo grátis.\n\nSe atingir inimigo:\nprende brevemente ou puxa levemente conforme contexto.\n\nSe atingir objeto/arma:\npuxa até jogador.\n\nEsta é a principal mecânica de grappling hook da V8.",
  "active": true,
  "icon": 8,
  "scope": "cooldown"
 },
 {
  "id": "blink",
  "name": "BLINK",
  "category": "power",
  "rarity": "rare",
  "description": "Teleporte curto na direção da mira.\n\nPode atravessar:\n- inimigos\n- pequenas paredes/plataformas finas válidas\n\nCooldown considerável.\n\nDiferença para dash:\nnão existe trajetória física entre origem e destino.",
  "active": true,
  "icon": 9,
  "scope": "cooldown"
 },
 {
  "id": "well",
  "name": "POÇO GRAVITACIONAL",
  "category": "power",
  "rarity": "rare",
  "description": "Cria esfera/área temporária.\n\nPuxa:\n- jogadores\n- projéteis\n- objetos soltos\n\nPara centro.\n\nNão mata diretamente.",
  "active": true,
  "icon": 10,
  "scope": "cooldown"
 },
 {
  "id": "mist",
  "name": "CORPO DE NÉVOA",
  "category": "power",
  "rarity": "rare",
  "description": "Por período curto:\npersonagem vira névoa.\n\nIntangível contra ataques físicos.\n\nPode atravessar adversário.\n\nEnquanto em névoa:\nnão pode atacar.",
  "active": true,
  "icon": 11,
  "scope": "cooldown"
 },
 {
  "id": "lightning",
  "name": "CORRENTE ELÉTRICA",
  "category": "power",
  "rarity": "rare",
  "description": "Raio de curto/médio alcance.\n\nAo acertar:\npode saltar para outro inimigo próximo.\n\nMuito útil contra grupos.\n\nTelegraph suficiente para defesa.",
  "active": true,
  "icon": 12,
  "scope": "cooldown"
 },
 {
  "id": "ice",
  "name": "CRIOCINESE",
  "category": "power",
  "rarity": "rare",
  "description": "Permite criar gelo.\n\nNo chão:\nfaixa escorregadia temporária.\n\nNa parede:\npequena plataforma de gelo.\n\nAcertando diretamente inimigo:\npequena travada de movimento.\n\nNÃO congelar por vários segundos.",
  "active": true,
  "icon": 13,
  "scope": "cooldown"
 },
 {
  "id": "shadowbomb",
  "name": "BOMBA DE SOMBRA",
  "category": "power",
  "rarity": "rare",
  "description": "Arremessa esfera em superfície.\n\nReativar:\nexplode criando região escura/fumaça.\n\nDificulta visão local.\n\nNão torna usuário literalmente invisível.",
  "active": true,
  "icon": 14,
  "scope": "cooldown"
 },
 {
  "id": "repulsor",
  "name": "REPULSOR",
  "category": "power",
  "rarity": "rare",
  "description": "Dispara explosão direcional.\n\nEmpurra alvo.\n\nTambém empurra o próprio jogador em direção oposta.\n\nPermite:\n- recoil aéreo\n- impulso mirando para baixo\n- reposicionamento",
  "active": true,
  "icon": 15,
  "scope": "cooldown"
 },
 {
  "id": "sandevistan",
  "name": "SANDEVISTAN",
  "category": "power",
  "rarity": "legendary",
  "description": "Referência Cyberpunk / David.\n\nAção ativa.\n\nDurante período curto:\no mundo inteiro desacelera violentamente.\n\nJogador continua quase em velocidade normal.\n\nNÃO é stop total.\n\nAinda pode morrer.\n\nAproximadamente 1 uso por duelo.\n\nVisual:\n- distorção\n- afterimages\n- sensação extrema de velocidade",
  "active": true,
  "icon": 16,
  "scope": "duel"
 },
 {
  "id": "room",
  "name": "ROOM",
  "category": "power",
  "rarity": "legendary",
  "description": "Referência Law / One Piece.\n\nCria esfera grande ao redor.\n\nDentro dela:\nhabilita Shambles.\n\nShambles:\ntroca posição instantaneamente entre jogador e alvo válido.\n\nAlvos possíveis:\n- objetos\n- armas\n- certas entidades\n- adversário quando regra permitir\n\nPermitir combinações emergentes.\n\nExemplo:\narremessar arma e trocar posição com ela.",
  "active": true,
  "icon": 17,
  "scope": "cooldown"
 },
 {
  "id": "portals",
  "name": "PORTAIS",
  "category": "power",
  "rarity": "legendary",
  "description": "Permite criar Portal A e Portal B em superfícies válidas.\n\nEntrar em um:\nsair pelo outro.\n\nPreservar momentum/velocidade.\n\nPermitir passar:\n- jogadores\n- projéteis\n- armas arremessadas\n- entidades compatíveis\n\nPrecisa de proteção contra loops infinitos e softlocks.",
  "active": true,
  "icon": 18,
  "scope": "cooldown"
 },
 {
  "id": "amaterasu",
  "name": "AMATERASU",
  "category": "power",
  "rarity": "legendary",
  "description": "Referência Naruto.\n\nMarca pequena região/superfície.\n\nCria chamas negras persistentes.\n\nRegião se torna mortal temporariamente.\n\nPode se espalhar LEVEMENTE por superfícies conectadas.\n\nNão permitir fogo tomar mapa inteiro.",
  "active": true,
  "icon": 19,
  "scope": "cooldown"
 },
 {
  "id": "kamehameha",
  "name": "KAMEHAMEHA",
  "category": "power",
  "rarity": "legendary",
  "description": "Segurar botão:\ncarrega.\n\nCarga menor que 2 segundos:\n- feixe menor\n- pode ser aparado\n\nA partir de 2 segundos:\n- muda claramente som/VFX\n- feixe se torna NÃO-PARRYABLE\n\nAinda pode:\n- ser desviado por movimentação\n- ser evitado usando cenário\n- ser escapado por Blink/Portal/etc.\n\nDurante carga:\njogador fica vulnerável e telegraph deve ser óbvio.\n\nDepois de 2 segundos:\nmais carga pode aumentar:\n- largura\n- duração visual\n- presença\n\nNão precisa escalar infinitamente.",
  "active": true,
  "icon": 20,
  "scope": "cooldown"
 },
 {
  "id": "thehand",
  "name": "THE HAND / APAGAR ESPAÇO",
  "category": "power",
  "rarity": "legendary",
  "description": "Referência JoJo.\n\nAtaque curto de varrida.\n\nApaga trecho do espaço.\n\nElementos depois do trecho são puxados para perto porque aquela distância foi removida.\n\nPode servir:\n- ofensivamente\n- para puxar adversário\n\nNão permitir apagar estruturas essenciais permanentemente.",
  "active": true,
  "icon": 21,
  "scope": "cooldown"
 },
 {
  "id": "domain",
  "name": "EXPANSÃO DE DOMÍNIO",
  "category": "power",
  "rarity": "legendary",
  "description": "Poder Lendário de grande presença.\n\nImplementação inicial inspirada em Santuário Malevolente.\n\nAo ativar:\narena entra temporariamente em estado especial.\n\nCortes aparecem em diversas regiões.\n\nCada corte:\n- possui micro telegraph visual\n- é letal\n- pode ser evitado por movimentação correta\n\nUsuário continua lutando normalmente durante o caos.\n\nNÃO fazer:\nativou -> cutscene -> inimigo morreu automaticamente.\n\nJogador adversário deve poder sobreviver com habilidade.",
  "active": true,
  "icon": 22,
  "scope": "cooldown"
 }
];
const catalog=Object.freeze(Object.fromEntries(list.map(x=>[x.id,Object.freeze(x)])));
root.DuelLegacyCatalog=catalog;if(typeof module!=='undefined')module.exports=catalog;
})(globalThis);
