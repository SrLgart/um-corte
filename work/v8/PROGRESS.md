# V8 — passagem de trabalho e blocos por esforço

## Handoff técnico — 28/09/2026

Documentação consolidada em `../../docs/README.md`. O histórico abaixo permanece como registro cronológico, não status atual. V8 funcional preservada em `archive/V8_FINAL_MONOLITHIC/`; desenvolvimento continua em `work/v8`, com a base geradora `work/v72`. Nenhum runtime foi movido ou refatorado. Build na raiz gera normal/ADMIN em `build/` e preserva o fluxo antigo de `outputs/`. Não houve redesign nem mudança de gameplay. Resultados desta etapa estão em `../../docs/VALIDATION.md`.

## Estado em 27/09/2026
V8 em desenvolvimento. Não é uma entrega final. Fontes em work/v8; V7.2 preservada em work/v72. SPEC-V8.txt e DECISIONS.md são fontes de requisitos.

Implementado até aqui: catálogo de 115, runtime inicial dos Legados, Caminho de 50 níveis, equipes de até 3 inimigos, save/draft/TAB/laboratório, protocolo de escolhas privadas online, espectadores do Caminho, primeira passagem de arte de armas/vestimentas/Errante/arenas e sprint do Corredor.

Verificado: 13 grupos de fundação V8 e 7 grupos online/save; regressões antigas passaram exceto um teste de double jump da IA que foi corrigido e os 20 grupos V7.2 passaram depois. Navegador abriu Caminho/TAB/save sem erros. Teste online com 3 navegadores usando RTCDataChannels reais e sinalização local passou: draft privado, sincronização, ADMIN visitante, espectador, saída. Sinalização pública PeerJS falhou com network neste ambiente; internet real entre PCs NÃO foi verificada.

## Atenção ao retomar
Builds normal e ADMIN reconstruídas com todas as alterações atuais. Suíte completa passando (test-all.cjs), incluindo 18 grupos novos em legacy-interactions-test.cjs. Isso não valida ainda cada um dos 115 comportamentos individualmente.

Geradores: upgrade-core.cjs regenera engine.js a partir de V7.2. integrate.cjs regenera app/controls/renderer/room/actors/v7-ui/shell/build/serve. Não editar esses arquivos gerados sem atualizar geradores. Scripts refine-*.cjs são migrações já executadas, NÃO executar novamente indiscriminadamente.

Node: C:/Users/Luiz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe
Reconstruir na ordem: upgrade-core.cjs, integrate.cjs, build.cjs. Testes: test-all.cjs; browser-v8.cjs; browser-online-v8.cjs.
Servidor local V8: work/v8/serve.cjs, porta 4189. browser-v8.cjs corrigido: espera playing, verifica pulo real, TAB e continuação; zero erros. browser-online-v8.cjs agora também espera playing antes de verificar sincronização.

## Próximo bloco recomendado — ALTO
1. Reconstruir e validar alterações recentes. Revisar 115 comportamentos contra descrições, não apenas existência no catálogo.
2. Ajustar interações/proteções (Eye/Berserk/Ring), transformação/D20 por partida, técnicas especiais, companheiros físicos e projéteis.
3. Completar controles mouse/gamepad dos Legados, edição online autoritativa e saves após alterações de build.
4. Completar laboratório/ADMIN (raridade, seed, D20, bosses, nível, drafts/recompensas, entidades).
5. Validar fluxo de 50 níveis, derrotas, retry ADMIN, Crown e Contrato, intros persistentes e espectadores tardios.

## MÉDIO — apresentação após contratos estáveis
Polir ícones individuais, cartas, roupas, armas e identidade dos bosses; animações, slash limitado à área real, cenários e layouts. Verificações visuais em desktop/telas menores. Preservar hitboxes/timing.

## BAIXO — tarefas delimitadas
Textos, dicas de uso extraídas de comportamento confirmado, rótulos, guia, histórico fiel ao entregue, correções simples de espaçamento e organização de evidências.

## EXTRA ALTO — auditoria e falhas transversais
Revisar combinações e invariantes de física/combate/replay/save/online. Diagnosticar falhas envolvendo vários sistemas; regressão final e testes extremos. Não refazer sistemas já bons.

## Protocolo de troca sugerido pelo usuário
Trabalhar em blocos com escopo explícito. Ao terminar cada bloco, informar concluído/testado/pendente e recomendar o esforço seguinte. Usuário troca capacidade no seletor e continua neste chat. Não assumir que podemos alterar o esforço do chat automaticamente. Não abrir chats/agentes por conta própria.

## Alto — avanço confirmado nesta continuação
- D20 mantém efeito pela partida, sem timer acidental de 120s; expira na partida seguinte.
- Reset de rodada limpa canalização, preparação de arma, grapple e mortes pendentes; preserva consumos corretos.
- Anel salva sua âncora de início de duelo no snapshot, funciona após save/load e em quedas, preserva consumos e atalhos; snapshots não aninham infinitamente.
- Transformações transferem atalhos, mostram identidade efetiva no TAB e retornam à original; pools excluem identidades efetivas já possuídas. Remoção ADMIN resolve a origem transformada.
- Kamehameha testado em 1.9 / 2.0 / 2.2 segundos; parry cancela feixe real. Corte de projéteis intercepta no slash antes de atingir corpo.
- Corrigida referência inexistente no Mikiri; só funciona avançando contra a estocada.
- Online usa RNG serializável na simulação; comandos de edição usam campos explícitos, sem injetar ações/privilegios; atalhos ficam locais também na âncora do Anel e nas transformações.
- Save/retry ADMIN preserva build de entrada do encontro. Teste percorre todas as 50 transições/recompensas/saves até vitória (vitórias induzidas no motor; não é playtest de IA de 50 níveis).
- Mouse e gamepad no remapeamento TAB, verificação de conflito com controles base, ativação real no navegador. Controle simulado via navigator.getGamepads; teclado/mouse via Playwright.
- Espectador do Caminho acompanha TAB em modo somente leitura, sem gravar save local. Timeout de transmissão de 8s evita imagem congelada indefinida. Teste RTC: entrada durante draft, confirmação bloqueada, inventário/pausa, saída e reentrada, anfitrião desconectado.
- Cenário da Rua inspecionado em outputs/v8-path.png. Identidade visual ainda precisa do bloco Médio.

Testes adicionais: browser-path-watch.cjs e browser-legacy-controls.cjs. RTC usa conexões nativas reais, sinalização local de teste; conexão PeerJS pública entre PCs continua NÃO verificada.

## Pendências para continuar no ALTO (não trocar ainda)
- Auditoria funcional do restante dos 115; especialmente Olho/Berserker (reação válida, ordem, ataque vindo do lado correto), summons terrestres/retorno/colisão e gravidade invertida/phasing.
- IA adaptativa, navegação em grupo e bosses usando builds; verificar Path arena/seleção exclusiva, salvamento seguro durante drafts, arquivos anteriores e intros persistentes.
- ADMIN/laboratório completos conforme SPEC, HUD com cooldowns/atalhos; controles ativos em contextos locais/replay/online prolongado.
- Testar composições complexas e tamanho dos snapshots da transmissão. Não declarar V8 completa.

Capacidade atual definida pelo usuário: ALTO. Avisar quando o bloco de mecânicas e integrações estiver realmente concluído; MÉDIO recomendado depois para apresentação.

## Alto — segunda continuação confirmada
- Olho do Destino captura geometria/direção/parryability do golpe adiado. Sem resposta, morre; parry no lado errado não salva; desviar de fato salva; golpes imparáveis continuam imparáveis. Hostis desaceleram durante a janela.
- Berserker exige eliminação real; névoa/barreira tardia não anulam a cobrança. Anel continua sendo a última chance. Crédito de eliminação não duplica servo do Necromante.
- IA original preservada sem Legados. Com Legados usa política adaptativa existente, observações atrasadas de projéteis e um sorteio de resposta por ameaça; proteção de bordas/pousos, mais poderes dos bosses. 12 builds fixas + grupo de 3 simulados e restaurados deterministicamente. Isso ainda não é playtest de dificuldade completo.
- Invocações de apoio não entram mais no ataque genérico. Terrestres têm queda, apoio em plataformas, saltos curtos e colisão com paredes; Falcão possui aviso e retorno após parry, sem desaparecer; cão retorna após mordida. Macaco transporta e solta arma sem transferir inventário. Sapo recolhe armas; Mímico intercepta objetos próximos.
- Manto: Space/W saltam afastando-se do teto, dash mantém direção no mundo, sair pelo limite superior aciona queda fatal. Traje Fantasma também atravessa plataformas e retorna ao início do dash se termina em parede.
- Arenas exclusivas do Caminho removidas da seleção normal/aleatório. Difícil incluído na seleção já existente.
- Testes novos: legacy-survival-test.cjs (9), legacy-ai-test.cjs (6), legacy-summons-test.cjs (8), legacy-mobility-test.cjs (5). Todos na suíte completa, que passou. Total desta continuação: 28 grupos adicionais.
- browser-v8.cjs e browser-online-v8.cjs passaram. browser-v8-lab.cjs verifica 6 invocações, movimento invertido e ausência de arenas exclusivas no menu; screenshot outputs/v8-summon-lab.png, sem erros de renderização. Normal e ADMIN reconstruídos.

Próximo ALTO: completar ferramentas ADMIN/laboratório do item 78 da SPEC, HUD de cooldown/atalhos, save/intro/draft seguro; continuar auditoria das técnicas/poderes/invocações restantes (incluindo servo com moveset próprio, adaptação Mahoraga e combinações complexas). Depois, Médio para arte/ícones/slash/identidade. Ainda não avisar que o bloco Alto inteiro ou a V8 terminou.

## Alto — laboratório, continuação e companheiros (27/09)
- Laboratório: filtro por raridade + categoria, sorteio filtrado de quantidades de Legados distintos (até o catálogo completo, sem limite artificial de slots), pronto/consumir/restaurar por item, spawn/despawn de invocações, recarga real das armas de projétil. Equipar ao vivo só treino/ADMIN. Itens transformados consumidos deixam de conceder efeito.
- ADMIN: atalho no topo do painel para Legados/Caminho, D20 0 aleatório ou 1–20 fixo, seed uint32 incluindo zero, Pedra Filosofal real, dificuldade, prévia de draft/miniboss/boss com garantia de raridade. Prévia não gasta recursos nem avança a run; clicar adiciona via comando autoritativo normal. Seleção de nível, boss (incluindo dupla), miniboss por classe, arena exclusiva e IA usa Run.debugEncounter -> Run.game, preservando build atual.
- Comandos novos passam por validação central. Visitante ADMIN edita ambos os lados no mesmo quadro. Espectador do Caminho com build ADMIN também não pode abrir/aplicar painel. UI do inventário acompanha alterações recebidas online. Nenhum comando de ADMIN é aceito por PathWatch.
- Spawn de companheiros agora é idempotente na origem; removida camada que criava e descartava duplicatas. Despawn solta armas carregadas. Remover Necromante também remove servo.
- Saves: reward guarda cena do encontro; resumeDraftGame preserva draft/seed/arena/placar/entry build. Saves de drafts mais antigos sem cena reconstroem o mesmo encontro. Checkpoint após editar build durante combate usa início seguro do duelo, com build/usos persistentes atualizados; não salva posição no meio da ação. Derrota invalida continuação antes de gravar histórico, inclusive quando gravação seguinte falha por quota.
- Intros: chave do encontro concluído salva, sem repetir intro ao continuar o mesmo boss; histórico de bosses/intros vistas entre runs, sem atributos permanentes. Fim da intro respeita inventário/ADMIN abertos. Nova run restaura botão de convidar espectadores.
- HUD: ordem de aquisição, identidades transformadas, consumidos, recarga real (incluindo armas), indicação de arma fora; somente ícones pequenos, tooltip com estado/atalho. TAB mostra recarga viva. Ícones individuais e arte continuam pendentes do Médio.
- Servo do Necromante: usa classe original, velocidade/timings e slash do motor para oito classes; parry atordoa servo (não dono), clash real, corpo da classe vulnerável a um golpe; morte não pontua. Memória do servo preservada entre duelos, apagada ao morrer/substituir/remover/começar outra partida. Renderiza pelo personagem existente, na cor do dono. Render nunca cria/muta estado do servo.
- Mahoraga: aprende após ameaças distintas/repetidas (sem contar cada subframe), flanqueia ataques frontais, melhora salto contra alvo aéreo, deflete projétil com intervalo de 2s. Segundo golpe durante intervalo pode matá-lo. Memória dura a partida e reinicia na próxima; roda gira/pulsa e marca tipos aprendidos. Projéteis agora atingem invocações vulneráveis; companheiros continuam sem HP extra.

Testes adicionais: legacy-admin-test.cjs (10), legacy-save-test.cjs (8), legacy-companion-ai-test.cjs (8): 26 grupos nesta continuação. Integrados em test-all.cjs. Navegador: browser-admin-v8.cjs, browser-path-save.cjs, browser-companions.cjs. Reexecutados browser-legacy-controls.cjs, browser-online-v8.cjs (ADMIN visitante muda build) e browser-path-watch.cjs (espectador ADMIN bloqueado). Sinalização RTC é local de teste; PeerJS público entre PCs continua não verificado.
Screenshots inspecionados: outputs/v8-admin-lab.png, outputs/v8-path-continue.png (800px), outputs/v8-necromancer-mahoraga.png. Arte de invocações ainda provisória, exceto servo reusando classe.

## Próximos passos ainda no ALTO
- Auditoria individual das técnicas e poderes: comparar cada descrição da SPEC com comportamento real (grappling inimigo/objeto, criocinese contextual, relâmpago em cadeia, ROOM/destinos, Ruyi/Yamato/Zenith/Echo e gestos). Não supor que existir no catálogo equivale a completar a mecânica.
- Revisar resolução do grupo no Path para callbacks de parry/Perfect Parry, especiais e chutes compartilhados; evitar duas semânticas diferentes de duelo/grupo.
- Mais playtest da IA/bosses e interações de builds; teste de 50 transições induz vitórias, não demonstra balanceamento de 50 encontros jogados.
- Replay e treino completos com Legados (bindings/contexto, retomada, troca de arma). Servos/adaptação já determinísticos em snapshot, mas ainda não testados num duelo longo online real com todos os tipos de Legado.
- Otimizar payload de PathWatch: transmite game + run.gameSave + âncora, redundantes. Preservar entrada tardia/draft/intro/TAB sem estado editável do espectador.
- Depois MÉDIO: 115 ícones reconhecíveis, arte das invocações/roupas/armas, linguagem de slash, intros/bosses/cenários. Depois BAIXO para descrições finais e histórico fiel. EXTRA ALTO para auditoria transversal final.

Normal e ADMIN continuam builds de desenvolvimento V8, não release final. Permanecer no ALTO por enquanto; ainda não avisar troca de capacidade.

## Alto — poderes contextuais, combate em grupo e cortes gravados (28/09)
- Teia usa a linha da mira e a primeira superfície/alvo: não puxa inimigo fora da mira. Acerto em ator tem aviso, puxão não letal e parry; objetos físicos preservam dono. Âncora acompanha plataforma móvel e se solta quando ela desaba. Telecinese mira somente objetos, respeitando paredes.
- Gelo é contextual: chão vira trecho escorregadio pelo motor compartilhado; parede cria apoio temporário após aviso; inimigo recebe imobilização breve não letal. Atirar no ar vazio não cria plataforma. Apoios temporários têm snapshot, expiração/soltura de quem está em cima e reutilização de slots expirados.
- Relâmpago visa um ator, avisa antes de atingir e salta para até dois inimigos próximos distintos com avisos separados. Parede bloqueia a mira/cadeia e parry encerra a propagação.
- ROOM fixa sua esfera no mundo. Recaste troca com ator/objeto visado, após aviso; revalida presença, esfera, paredes, chão e zonas letais ativas no destino. Não troca alguém para o vazio; arma no chão mantém dono e posiciona pés do usuário sobre o apoio. Metadados de superfície não sobrescrevem mais o tipo de Portais/Amaterasu.
- Rajada de Vento empurra continuamente inimigos e objetos/projéteis leves expostos durante sua duração, sem travar ator repetidamente em stun nem atravessar paredes.
- Path/grupos usa os mesmos primitvos de contato, interceptação na guarda, direção lateral, parry perfeito, recuo e boxerParry do duelo. Evento identifica agressor correto para Desarme. Chute usa cápsula direcional e oclusão de parede, não raio/facing atual. Estatística/crédito de morte é registrado uma vez; matar um de três não encerra rodada.
- Espectadores: frame envia uma única cena e metadados da run, omitindo gameSave, entryInventory e âncora de rewind redundantes. Saves reais permanecem completos. Fixture com build e checkpoint caiu para 29% do payload anterior; não é uma estimativa universal de banda. Entrada tardia durante draft, TAB, pausas, saída/reentrada e desconexão passaram novamente com RTC nativo e sinalização local.
- Armas carregáveis: tap normal usa mira do comando de pressão; preparação funciona durante dash preservando trajetória. Atordoamento/parry/troca ou perda da arma cancelam preparação. Tempos de preparo/recovery acompanham velocidade de ataque. Yamato mantém um único aviso da área real, e corte aparece parado à distância ao soltar. Ruyi estende ao completar o hold e só impulsiona para cima se atingir chão/plataforma, nunca ar vazio; paredes limitam extensão.
- Eco agora grava poses/perfis geométricos do ataque real, incluindo movimento, progresso do arco, buffs e recorte por paredes. Após 0,6 s reconstrói pelo MESMO algoritmo slash do motor nas posições originais; não segue usuário nem sua arma/buff atual. Fila descarta frames já reproduzidos e não guarda centenas de vértices por frame. Snapshots preservam gravação/reprodução. Echo/Zenith não criam ataques extras quando a arma está fora nem em especiais que materializam arma original.
- Avisos de Yamato, teia e relâmpago receberam contorno de contraste para funcionarem também em arena clara. Arte final continua no Médio; isso é legibilidade funcional, não finalização dos 115 assets.

Testes desta continuação: legacy-powers-test.cjs (14), legacy-group-combat-test.cjs (6), legacy-watch-payload-test.cjs (2), legacy-charge-test.cjs (7), legacy-echo-test.cjs (6): **35 grupos adicionais**, todos no test-all.cjs. Suíte completa passou após regenerar engine/integrar/reconstruir normal e ADMIN (22 scripts em cada). Browser: browser-contextual-powers.cjs (quatro cenas pelo renderer, 30 frames imutáveis cada), browser-online-v8.cjs (draft, visitante ADMIN, espectador, sincronização e desconexão), browser-path-save.cjs e browser-path-watch.cjs passaram. Screenshot largo inspecionado: outputs/v8-contextual-powers.png; variante estreita gerada em outputs/v8-contextual-powers-narrow.png. RTC ainda usa sinalização local de teste; conexão pública entre PCs não foi validada.

### Próximo trabalho no ALTO
- Continuar auditoria individual: Zenith (trajetórias e interação), técnicas de chute/gestos/roubos, repulsor mirando em vez de escolher alvo fora da mira, Portais (normal da superfície/saída segura e objetos), The Hand, Domínio (fronteiras e avisos). Existem simplificações ainda; não declarar todos os poderes concluídos.
- Validar replay/treino via UI: retomar, bindings, troca de arma e Legados ativos. Snapshots determinísticos já cobrem os poderes novos e Eco, mas não substituem todos os fluxos da interface.
- IA/bosses usando carregamentos/combinações e mais playtest real de encontros; teste de 50 transições segue usando vitórias induzidas.
- Depois Médio para ícones/arte/poses/slashes/intros/cenários; Baixo para texto final; Extra Alto para auditoria transversal.

**Continuar no ALTO. V8 ainda em desenvolvimento; não anunciar release final nem pedir troca de esforço ainda.**

## Alto — poderes espaciais, treino/replay e comprometimento das técnicas (28/09, continuação)
- Repulsor deixou de escolher o inimigo mais próximo: explosão é um segmento na mira, respeita paredes, aceita parry e empurra sem matar. Recoil oposto continua funcionando no vazio e mirando para baixo.
- Portais são alinhados à normal da parede/plataforma, com abertura que cabe na superfície. Rejeitam superfícies pequenas/sobrepostas sem gastar recarga. Entrada usa contato real do corpo (inclusive pés no portal de chão); saída valida corpo inteiro, plataformas e paredes. Velocidade é rotacionada conservando módulo/componente tangencial; dash ativo também muda direção. Armas/projéteis preservam dono e orientação; cooldown impede loops. Portais acompanham plataforma móvel e fecham quando apoio some. Entidades não compatíveis e armas carregadas não são teleportadas.
- The Hand agora possui varrida direcional curta com aviso; puxa atores e objetos elegíveis depois da faixa apagada, sem afetar paredes, plataformas, portais ou áreas persistentes. Não alcança para trás nem atravessa parede. Sem dano automático.
- Domínio fixa centro/radius na ativação. Pulsos geram regiões distintas, alternando alvo dentro da região e posição sorteada; telegraph fica parado após aparecer. Mover usuário/alvo não faz os avisos perseguirem ninguém. RNG e timelines dos quatro poderes foram comparados após snapshot usando motor completo.
- Treino: lab.patchLegacy atualiza build/arma/bindings do checkpoint sem deslocar posição salva. Reinício mantém alterações feitas no laboratório, recria companheiros uma vez e restaura recargas. lab.js é fonte direta V8, não é regenerado por integrate.cjs.
- Replay interativo: comandos legado/legadoHeld e kickHeld passam pelo buffer existente; ações aguardam hitstop e não repetem indevidamente. TAB usa personagem/build do replay, pausa reprodução enquanto aberto; remap e edição ficam isolados da partida/run original. HUD acompanha ator do replay. Repetir restaura o snapshot original, incluindo usos e arma. Cena de replay aberto apenas para assistir não aceita alterações de build.
- Técnicas: chute voador/pisada/arremesso/preparo de giratório não disparam efeitos em stun ou cooldown; preparo de giratório é cancelado por outra ação/interrupção. Giratório roda antes da resolução normal, acerta radialmente uma vez por alvo e respeita parede. Pisada exige caminho aberto e dá um único bounce. Arremesso joga para o outro lado somente quando destino E trajetória estão livres, sem morte direta.
- Dash Cancel só remove recovery ao conseguir executar um dash real, consumindo carga; dash bloqueado preserva o recovery. Passo de Recuo tem janela inicial e retreat horizontal mais curto. Iaijutsu verifica dash terrestre terminado, uma ativação por janela; ainda precisa segunda passagem de apresentação/corte de travessia (ver pendências).
- Sem Saque consome postura no ataque, concede startup rápido e cobra 1,7x recovery se esse golpe errar. Direções ascendente/descendente são decididas antes da preparação de arma carregável. Correções preservam regras base sem Legados.

Novos testes: legacy-spatial-test.cjs (12), legacy-lab-test.cjs (4), legacy-techniques-test.cjs (10): **26 grupos** nesta continuação. Incluídos no test-all.cjs. Browser novo: browser-legacy-replay.cjs usa menu de treino, laboratório, reset, replay real, TAB, remap e ativação; screenshot outputs/v8-replay-legacies.png inspecionado. Reexecutados browser-admin-v8.cjs, browser-legacy-controls.cjs, browser-online-v8.cjs e browser-path-watch.cjs; todos passaram. RTC continua com sinalização local, sem validação pública entre PCs.

### Ainda no ALTO, próximo bloco
- Investida Ofensiva precisa geometria própria de verdade: alterar apenas campo sweep não muda slash atual. Iaijutsu ainda usa reposicionamento curto, precisa corte de travessia/commitment legíveis sem teleporte ofensivo gratuito. Verificar combinação dessas técnicas com armas carregáveis; wallstrike/lunge hoje são processados depois da supressão de input do hold.
- Mikiri precisa conferir ameaça geométrica e janela, não só classe/distância; Desarme precisa elegibilidade (punhos não são arma física). Zenith precisa passagem própria de trajetórias/interações. Amaterasu ainda não espalha levemente em superfícies conectadas.
- Interrupção/telegraph dos demais poderes (inclusive canalização Kame) e artifícios de proteção; terminar checklist individual de 115 contra SPEC.
- IA de chefes usando os carregamentos e combinações, playtests reais de encontros. Depois Médio para arte e animações; Baixo para texto; Extra Alto para auditoria final.

**Builds normal e ADMIN ainda são V8 em desenvolvimento. Manter ALTO.**

## Alto — técnicas de precisão, trajetórias e canalização (28/09, nova continuação)
- Investida Ofensiva: ataque no início do dash (incluindo dash + ataque no mesmo frame) agora usa polígono estreito próprio no slash compartilhado. Trajetória travada, avanço contínuo durante startup/active, recovery maior e sem cancelamento por dash/parry/finta. Interrupção encerra o movimento. Colisão visual, parry, clash e Eco usam a mesma geometria. Armas de projétil mantêm seu ataque original.
- Iaijutsu: substituído reposicionamento instantâneo por avanço contínuo no active, após dash terrestre concluído. Janela de 220 ms, uma utilização por dash. Mantém corte da arma atual, permite atravessar corpos durante a parte ativa, respeita paredes e mantém vulnerabilidade/recovery. Não concede invencibilidade. A animação artística final ainda é trabalho do Médio; o movimento real e a colisão já estão implementados.
- Wallstrike é processado antes de armas de hold suprimirem attack. Tap curto de Yamato/Ruyi/Leviatã pode usar a técnica da janela; hold completo preserva o ataque carregado. Carga iniciada no dash não se perde simplesmente ao entrar em dashRecovery. Eco grava também o perfil da Investida e se restaura com o mesmo contorno; corrigido fallback em atores sem inventory/attackId (ecos e proxies).
- Mikiri: dash em direção ao atacante + contato real com slash ativo de estocada/Investida nos primeiros 100 ms. Não dispara por proximidade, cabo da lança, startup, mira oposta, parede ou golpe imparável. Pode interceptar estocada que começa após o comando de dash, antes da resolução do combate. Atordoa o atacante sem conceder invulnerabilidade geral ao defensor. Teste antigo usava distância dentro do cabo sem contato e foi corrigido para testar ponta real.
- Desarme: punhos/manoplas, projéteis e ações sem arma elegível não geram arma física. Arma lançada conserva sua identidade antes de marcar weaponAway (antes, arma equipada podia virar sword por consultar depois de desarmar). Dono e recolhimento permanecem iguais.
- Zenith: três trajetórias distintas, fixadas ao espaço/mira do ataque, com avisos em curva e duração limitada; não perseguem inimigo/usuário. Parry e passagem por portal soltam a trajetória programada e usam a velocidade refletida/rotacionada, sem voltar ao caminho antigo. Terrain e slash defensivo continuam interceptando projéteis.
- Amaterasu: no máximo dois focos adicionais, uma geração, apenas na mesma superfície ou plataforma realmente conectada; avisos próprios e expiração junto do foco original. Não pula vãos nem toma o mapa inteiro. Acompanha suporte móvel e desaparece com plataforma desabada. Arte de chamas ainda provisória (não confundir conclusão mecânica com asset final).
- Kamehameha: início exige estado disponível; stun/morte/ação alternativa interrompem sem feixe atrasado. Cancelamento tem recarga curta de 0,8 s, disparo mantém recarga completa. Movimento durante carga a 30%, personagem vulnerável. Sinal visual/sonoro único aos 2 s, linha da mira limitada pelo cenário, largura/duração limitadas, disparo automático aos 3,2 s. Ataque lançado é seguido por recovery curto. audio.js agora é regenerado via integrate.cjs a partir de V7.2 com dois eventos de áudio V8.

Testes novos: legacy-strikes-test.cjs (12), legacy-regions-test.cjs (6), legacy-channel-test.cjs (6): **24 grupos**, incluídos em test-all.cjs. Suíte completa passou, normal e ADMIN reconstruídos. Browser novo browser-precision-legacies.cjs renderiza quatro cenas, verifica que 30 renders não alteram snapshot; imagens larga/estreita geradas, larga inspecionada e contraste dos avisos da Zenith corrigido. Screenshot: outputs/v8-precision-legacies.png. browser-legacy-replay.cjs e browser-online-v8.cjs reexecutados e passaram (draft, visitante ADMIN, espectador, sincronização/desconexão). Online usa RTC nativo com sinalização local de teste; conexão pública entre PCs permanece não verificada.

### Próximo ALTO
- Terminar checklist individual dos 115 e auditoria das combinações. Não declarar que todos estão completos por passarem a suíte atual. Rever técnicas com punhos/armas de projétil, gesto de carregar quando tap é solto durante recuperação de dash, portais durante técnicas comprometidas, duração de cargas com poderes temporais e Desarme em especiais/summons.
- IA de chefes precisa usar holds/combinações conscientemente; playtests reais de encontros (teste das 50 transições ainda usa vitórias induzidas).
- Validar fluxo prolongado com várias composições no Caminho/online, sinais sonoros no uso real e balanceamento das novas janelas. Estados estão em snapshots, mas isso não substitui playtest entre PCs.
- Depois Médio: ícones individuais, arte das roupas/armas/invocações, poses/técnicas, fogo/efeitos, intros/bosses/cenários. Baixo para textos e histórico fiel. Extra Alto para auditoria transversal.

**Continuar no ALTO. V8 em desenvolvimento, sem anunciar release final.**

## Alto — IA com intenção de carga e combinações de movimento (28/09, continuação)
- IA mantém intenção de segurar ataque para Yamato/Ruyi/Leviatã quando a distância favorece carga; de perto usa tap. Segura/solta de acordo com o progresso real da própria arma e abandona preparo ao precisar defender. Continua usando a observação atrasada do adversário, sem ler inputs.
- Kamehameha da IA não compete mais com dash/ataque/pulo no mesmo comando de ativação; mantém carga enquanto a linha observada for válida, solta aos 2,1 s e pode abandonar para defender. Guia/estado continuam pertencendo ao motor compartilhado.
- Ioiô mantido pela IA durante a janela útil; Gunblade usa gatilho uma vez na janela real; Leviatã é chamado de volta quando lançado. Outras armas no chão são procuradas pelo dono, sem fingir que ainda estão equipadas. IA respeita cooldown de armas de projétil.
- Investida e Iaijutsu possuem intenções explícitas na IA quando suas janelas e direção favorecem o golpe. Poderes contextuais adicionais (gelo, rajada, repulsor, The Hand, Amaterasu, bomba, marca/troca e manto) têm critérios de uso. Manto não é ativado rumo a um teto vazio; o planejamento da navegação invertida ainda merece playtest específico.
- Tap de arma carregável solto nos últimos frames de dashRecovery agora passa pelo command/buffer existente, preservando a mira do pressionamento; deixa de desaparecer silenciosamente por chamar attack em estado indisponível.
- Portais rotacionam direção da técnica comprometida e attackAim, além da velocidade: o próximo passo da Investida/Iaijutsu continua na orientação da saída. Sem teleporte extra, reset da duração ou invulnerabilidade. Verificado junto de snapshots.
- Testes explícitos de parada/desaceleração temporal em cargas de arma e Kamehameha: ambos seguem o delta do ator, não relógios paralelos.

Novos testes: legacy-ai-intent-test.cjs (8) e legacy-motion-combo-test.cjs (4): **12 grupos**, integrados em test-all.cjs. Suíte completa passou. Normal e ADMIN reconstruídos com 22 scripts válidos cada. browser-online-v8.cjs, browser-legacy-replay.cjs e browser-path-save.cjs passaram (incluindo visitante ADMIN, espectador, continuação de boss/draft e isolamento do replay). RTC usa sinalização local de teste; conexão pública entre PCs continua não verificada.

Novo legacy-boss-soak.cjs executou os **12 encontros de chefes até matchEnd**, com controlador de jogador por script, ataques/colisões reais, sem induzir mortes, forçar placares ou dar invencibilidade. Resultados em outputs/v8-boss-soak.json. Isso verifica execução dos encontros, não prova dificuldade adequada para humanos nem completa uma run de 50 encontros com escolhas reais. O script é separado da suíte determinística; pode ser reexecutado após alterações na IA.

### Próximo ALTO
- Fazer fechamento do checklist individual dos 115 contra SPEC, começando por restrições e combos restantes: punhos com técnicas, Desarme em especiais/servos, Mikiri contra especial de esgrima, proteção/roubos/transformações e gestos de vestimentas.
- Playtests mais variados da IA (incluindo teto/gravidade invertida, zonas letais persistentes, armas perdidas e builds completas), além de conexões prolongadas. O controlador scripted atual é simples e não deve virar prova de balanceamento.
- Depois Médio para 115 ícones/arte e apresentação; Baixo para textos; Extra Alto para auditoria transversal. Ainda manter Alto e não declarar a V8 pronta.

## Alto — origem das defesas, relíquias e IA diante de perigos (28/09, continuação)
- Técnicas melee (Investida/Iaijutsu) agora aceitam punhos/manoplas sem transformar o Pugilista em portador de lâmina ou aumentar seu alcance para o de espadas. Arma perdida não concede técnica de arma. Mikiri aceita contato real do Passo de Esgrima, interrompendo seu avanço; a carga imparável do Lanceiro continua excluída.
- Desarme captura elegibilidade ANTES do stun limpar ultMode. Tanto duelo quanto Path emitem attacker e disarmEligible explícitos. Parry de especial não descarta o Legado equipado que nem produziu aquele golpe. Sem atacante conhecido não escolhe mais um inimigo próximo arbitrariamente. Parry de servo/projétil não desarma invocador. Olho do Destino preserva a origem não desarmável de projéteis na ameaça adiada.
- IA observa até oito zonas letais com atraso, incluindo avisos, feixes, fogo, ecos e friendly fire. Respeita tempo de ativação/expiração; tenta mudar rota/saltar em vez de dar parry em perigo não aparável. Áreas poligonais são resumidas por bounds para percepção aproximada e snapshots leves; hitboxes reais não mudaram. Saltos de evasão respeitam intervalo de decisão.
- Arma caída passa a ser destino de navegação do dono, mesmo que o adversário esteja do outro lado ou em outra rota. Recuperação de arma ocorre antes da proteção de bordas, evitando sobrescrever a decisão de segurança. Retorno do Leviatã permanece por comando de ataque.
- Shadow Dash atravessa corpos somente durante sua janela curta, sem atravessar parede sólida. Máscara de Pedra ganhou wall cling natural e multiplicador de salto 1,12 no motor compartilhado (inclui saltos aéreos/wall jump); velocidade/refill por eliminação já existiam.
- Incenso armazena preparação ao ficar parado e não a perde por andar; consome no próximo parry válido, ajustando também cooldown ao aumento da duração. Sininho recarrega dash/air dash, sem oferecer gratuitamente salto/combustível.
- Ampulheta e Dente do Lobo agora exigem near miss geométrico: corte não atinge corpo, mas passa pela margem de 10 px. Dente exige dash e não dá invencibilidade; benefício é consumido por um ataque e acompanha todo seu contorno, sem encolher no meio do golpe. Ampulheta continua uma vez por partida.
- Talismã de Ferro atua sobre chute base, recuo de parry/clash e poderes não letais, com o mesmo multiplicador 0,55 no duelo e no Path. Removida redução incorreta na rotina de absorver golpe fatal. Combustível e preparo por idle passam a respeitar timeScale do ator durante parada/desaceleração temporal.

Testes novos: legacy-defense-combo-test.cjs (8), legacy-ai-danger-test.cjs (6), legacy-relic-precision-test.cjs (8): **22 grupos** incluídos na suíte. Suíte completa passou após últimas alterações e reconstrução das duas builds (22 scripts cada). browser-online-v8.cjs, browser-legacy-replay.cjs e browser-path-save.cjs passaram. RTC permanece com sinalização local de teste, não conexão pública entre PCs. legacy-boss-soak.cjs reexecutado: 12 encontros terminaram sem vitórias forçadas/invencibilidade; continua sendo simulação por controlador, não playtest humano de dificuldade.

### Próximo ALTO (fechamento funcional ainda pendente)
- Revisar restantes de relíquias/vestimentas/ativos contra texto: Espelho Quebrado (falha de cópia e consumo/escopo), Marcação/Troca e destinos, D20/drafts extremos, gestos/fuel de voo, Joelheiras e afterimage real. Revisar também todas as invocações para diferenças que ainda sejam só aproximações, antes de fechar o catálogo de 115.
- Testar IA em navegação invertida de verdade e hazards/armas perdidas durante partidas longas com builds variadas; não usar o soak atual como prova de balanceamento.
- Depois Médio para arte/ícones/roupas/invocações/poses/intros/efeitos finais; Baixo para texto e histórico; Extra Alto para auditoria transversal. **Ainda Alto; V8 não é release final.**

## Alto — transações de relíquias, âncora e voo integrado (28/09, nova continuação)
- Espelho Partido: cópia inválida/sem alvo não gasta uso nem apaga memória. Lista explícita evita recursão; ampliada para poderes independentes de invocação/estado persistente (15 poderes). Empréstimo temporário restaura inventário, transformação, consumo, teclas e cooldown próprio. Memória atravessa rounds e limpa ao trocar de partida; espelho gasto não continua memorizando. Ainda NÃO copia especiais de classe: isso precisa integração própria, não fingir que a cobertura atual satisfaz toda a descrição.
- Troca: segunda ativação valida corpo contra paredes E plataformas antes de teleportar. Destino obstruído conserva marca para outra tentativa dentro da janela. Limpa platform/grounded, mas preserva velocidade, usos, saltos e estado; não rebobina mundo. Marca continua âncora espacial, não segue plataforma móvel nem garante suporte contra queda.
- D20: resultado 1 deixa opções não garantidas comuns; 20 garante lendário + demais opções raras ou melhores. Pisos de miniboss/boss preservados. Carta Marcada não substitui a única garantia nem a segunda opção do Ímã; marca naturalmente sorteada é consumida, marca escolhida/adquirida ou inelegível é limpa. Comum marcado aguarda outro draft se inseri-lo destruir a qualidade de um D20 20.
- Orbe: peekDraft/acceptDraft compartilhados por solo e online. Prévia avança RNG/consome Orbe, mas só aceita consumo de Carta Marcada/D20 ao substituir de fato o draft. Cancelar não perde esses recursos. Snapshots conservam transação pendente; recursos modificados depois da prévia não são sobrescritos. Orbe/reroll não reabrem seleção parcialmente escolhida de Contrato.
- Voo: glider/rockets/icarus agora alteram velocidade ANTES da integração/colisão do motor, removendo deslocamento duplicado e atravessamento após colisão. Dash tem prioridade por toda a duração; stun/ações comprometidas não são cancelados pelo voo; primeiro frame de salto conserva impulso. Fast fall desliga glide/propulsão. Glide conserva deslocamento horizontal e funciona mesmo com combustível esgotado. Propulsores não cortam velocidade ascendente maior que seu limite. Combustível limitado a zero, reposto somente ao pousar. Ícaro mantém comandos em coordenadas do mundo mesmo com gravidade invertida.
- HUD: pequena barra de energia em Asas/Foguetes, valor acessível via role=meter e tooltip. Capa aberta/chama dos propulsores refletem flight real, não apenas botão pressionado. Joelheiras prolongam estado de slide e timestamp real usado pelo Iaijutsu, além dos timers físicos.
- Manto do Espelho: deixa pose completa capturada no início do dash, incluindo aparência/arma; não entidade ofensiva. Render em canvas auxiliar com fade, pois desenho do ator redefine alpha internamente. Estado visual não se move junto do dono e não modifica snapshots. Arte final dos equipamentos continua para Médio.

Testes novos: legacy-resource-test.cjs (12), legacy-flight-test.cjs (10), mais 1 cenário em legacy-online-test.cjs: **23 grupos novos**, suíte completa passou. Normal/ADMIN reconstruídos. browser-flight-resources.cjs usa teclado real na página de treino, valida medidor de energia e renderiza quatro cenários sem mutar snapshots; imagens larga/estreita, larga inspecionada após corrigir fade. Artefatos outputs/v8-flight-resources.png, outputs/v8-flight-resources-narrow.png, outputs/v8-flight-hud.png. browser-online-v8.cjs, browser-path-save.cjs e browser-legacy-replay.cjs passaram. Online continua RTC nativo com sinalização LOCAL de teste, não conexão pública entre PCs.

### Próximo ALTO — gaps confirmados na leitura da SPEC e implementação
- Fechar cópia de especiais de classe do Espelho Partido com estado e identidade próprios (P.special só chama original, sem captura hoje); não trocar f.kind permanentemente para simular especial emprestado.
- Invocações: Doppelgänger hoje guarda posição/attackId mas reconstrói slash usando build/estado atuais do dono e um frame fixo, não trajetória real atrasada; deveria registrar perfil/poses físicas sem copiar projéteis/poderes e sem inflar payload. Espadachim Espectral calcula aim antes de mudar para flanco e usa círculo genérico, além de não desaparecer visualmente. Esqueleto usa dano por contato genérico em vez de corte lento próprio. Usar sistema de servo existente como referência, preservando identidades.
- Medusa atualmente dispara círculo fixo de 0,28 s, não zona móvel de controle. Slime não fica grudado ao alvo. Lanterna aplica effects.marked constantemente, sem ciclo/marca visual específica. Rei Slime divide corretamente, mas ainda não possui salto/esmagamento próprio. Legião defensiva ainda entra no ataque de contato genérico; Caçador recalcula alvo mais próximo em vez de presa travada. Kraken ainda precisa formas de ataque mais distintas. Reavaliar cada um contra SPEC 14; existência no catálogo e testes genéricos não provam conclusão individual.
- IA invertida ainda precisa navegar em combate prolongado; não confundir teste de Ícaro com teste dessa IA. Restantes de integração dos 115 + runs/combinações variadas antes de Médio; depois ícones/arte/apresentação, textos e auditoria Extra Alto.

**Continuar no ALTO. V8 em desenvolvimento; não anunciar release concluída.**

## Alto — Doppelgänger, Espectral e Cavaleiro Esqueleto (28/09, continuação)
- Doppelgänger agora grava pose/movimento e perfil físico no momento original; reproduz após 550 ms. Preserva arma, alcance, escala, punch, animação aérea, slide e direção do golpe mesmo após o dono mudar de arma/perder buff. Sem body collision normal. Não copia projéteis, efeitos extras de Zenith/Eco, especiais originais ou arma perdida. Recorta slash no cenário atual para não atingir por dentro de uma parede surgida depois da gravação.
- Histórico usa amostras de movimento a 60 Hz com interpolação, mas retém cada frame ativo e transição de estado. Perfis são deduplicados e descartados junto da fila; teste de active prolongado a 600 Hz ficou abaixo de 80 KB, inclusive alternando perfil. Relógio segue delta do dono, não avança em time stop. Buffers antigos de desenvolvimento (objetos em vez de arrays) reiniciam a pequena gravação sem quebrar o save.
- Espectral: valida posição do flanco contra paredes/plataformas, materializa, anuncia startup e fixa mira a partir da NOVA posição. Tem corte real de espada, recovery e desaparecimento; deixou de criar círculo letal genérico. Pode ser atingido enquanto materializado; invisível não bloqueia ataques/projéteis. Se ambos os flancos estiverem obstruídos, adia a entrada em vez de nascer dentro da geometria.
- Esqueleto: reutiliza motor do servo com identidade/timings próprios (startup 400 ms, active 150 ms, recovery 550 ms antes dos multiplicadores), velocidade menor, contorno real de espada e postura correspondente. Não mata por simples contato do corpo. Um golpe o desmonta; após 6 s reconstrói sem ataque/contorno antigo. Morte do aliado não dá ponto. Visual provisório de ossos/crânio, usando animação existente; acabamento artístico continua para Médio.
- Parry/clash dos novos ataques atuam na própria invocação e interrompem o golpe copiado, sem stun indevido no dono. Barreira direcional usa origem real do ataque da invocação/projétil em vez da posição distante do invocador. Dados do impacto fatal usam contorno/ângulo/arma da ameaça real, mantendo crédito de eliminação no dono.
- Render: Doppel e Espectral aparecem com corpo/arma/poses reais e transparência em canvas auxiliar; Espectral oculto e Esqueleto desmontado não são desenhados. Aviso do corte e slash exibidos a partir do mesmo estado/contorno de combate. Sem alteração do snapshot por render.

Novos testes: legacy-physical-summons-test.cjs, **19 grupos**, incluído em test-all.cjs. Suíte completa passou com os 18 primeiros e o último caso adicional de save + inputs reais passou em seguida; não houve mudança no código de produção depois da suíte. Normal/ADMIN reconstruídos, 22 scripts cada. browser-physical-summons.cjs passou em largura desktop/estreita, imagem outputs/v8-physical-summons.png inspecionada; o fixture recoloca o defensor vivo apenas para enquadrar a pose sem câmera de fim de round (não é teste de balanceamento). browser-online-summons.cjs ampliou o teste online: ADMIN visitante adiciona o trio, histórico/poses/world coincidem em host, guest e espectador após pausa sincronizada. RTC nativo com sinalização LOCAL; Internet pública entre PCs continua não validada. browser-legacy-replay.cjs e browser-companions.cjs passaram, preservando servo do Necromante/Mahoraga.

### Próximo ALTO
- Continuar invocações de controle: Medusa (zona móvel), Slime (grudar temporário), Lanterna (ciclo/marca visível), Rei Slime (salto/esmagamento), Legião defensiva/ranged/melee distintos, Caçador (presa travada + aviso) e Kraken (formas de ataque). Ver gaps da leitura da SPEC no bloco anterior.
- Cópia de especiais de classe pelo Espelho Partido ainda pendente; não basta lista atual de poderes seguros. IA invertida e combinações prolongadas ainda precisam testes próprios.
- Depois completar auditoria individual dos 115; Médio para arte/ícones/poses/efeitos/intros, Baixo para textos e Extra Alto para revisão final. **Manter ALTO; V8 ainda em desenvolvimento.**

## Alto — invocações de controle e perseguição (28/09, continuação)
- Slime: segue lentamente pelo chão; contato físico gruda por 900 ms e reduz velocidade comum a 70%, sem stun, empurrão, dano, corte de salto/dash/ataque ou empilhamento de lentidão entre vários slimes. Acompanha o alvo no ar/teleporte; parry impede a aderência. Intervalo entre contatos e refresh residual de até 80 ms; morte/desaparecimento encerra a penalidade. Corpo aderido fica visível junto da perna.
- Medusa: flutua lentamente e emite campo circular de raio 115 após aviso de 600 ms. Zona permanece por 1,05 s ativa, acompanha sua origem viva e repete em ciclo de 4,8 s. Sem varredura invisível entre posições de teleporte; paredes bloqueiam dano e recortam o desenho. Destruir/remover/atordoar a fonte cancela o campo. Corpo sozinho não mata. Forma provisória de água-viva sem tentáculos, com núcleo de carga e arcos elétricos; acabamento artístico final continua para Médio.
- Lanterna: detecta inimigo até 700 px, trava uma marca por 2 s e só renova no ciclo de 4,5 s. Não altera stats nem cria ataque. Marca desenhada depois da fumaça com contorno/diamante; corpo de lanterna e pequeno pulso de detecção. Não muda de alvo no meio da marca nem mantém marca num alvo morto.
- Rei Slime: compressão anunciada, impulso balístico com direção horizontal fixada ao lançar, contato letal apenas na descida, recovery ao aterrissar. Usa colisão existente de plataformas/parede/queda; não cria explosão invisível no pouso. Pode ser aparado. Divisão 1 → 2 → 4 limpa ataque/velocidade/cooldowns antigos, evitando filhos que já nascem atacando; última camada desaparece. Coroa, compressão/alongamento e impacto de pouso provisórios.
- Caçador: espera fora da arena, escolhe uma presa, exibe marca/aviso de 1 s, entra por até 2,5 s e recua com cooldown. Alvo fixo durante o ciclo, sem dano a espectadores da caçada/inimigos não marcados. Morte do alvo cancela perseguição em vez de transferi-la; parry força recuo. Paredes impedem atravessamento e acerto por proximidade através da geometria. IA diferencia fase ofensiva do Caçador/Rei Slime de fases inofensivas; Medusa é percebida por seu campo, não como projétil de contato.

Novos testes: legacy-control-summons-test.cjs (16) + legacy-hunting-summons-test.cjs (14): **30 grupos**, incluídos em test-all.cjs. Suíte completa passou com todos os testes atuais, inclusive os 19 do bloco anterior. Builds normal/ADMIN reconstruídas, 22 scripts cada.
- browser-control-summons.cjs e browser-hunting-summons.cjs: warning/active/aderência/marca/caçada; 30 renders sem mutar snapshot por cenário, capturas desktop e estreita. Imagens desktop inspecionadas: outputs/v8-control-summons.png e outputs/v8-hunting-summons.png. As capturas são fixtures de apresentação; a da perseguição reposiciona o Caçador para enquadrá-lo, não é prova de trajetória ou dificuldade.
- browser-online-control-summons.cjs: visitante ADMIN adiciona as cinco invocações, retoma e pausa; legacyWorld completo igual em host, visitante e espectador, com desconexão segura. RTC nativo com sinalização LOCAL de teste, não Internet pública entre PCs.
- browser-legacy-replay.cjs passou. legacy-boss-soak.cjs passou 12 encontros com controlador e golpes reais, sem forced kills/invencibilidade; não valida balanceamento humano ou run completa de 50 níveis.

### Próximo ALTO
- Invocações restantes: Legião com papéis realmente distintos (melee/ranged/protetor, sem contato genérico do protetor); Kraken com esmagar/agarrar/bloquear e regiões telegráficas; auditar Sapo/Mímico e interceptação de objetos/projéteis contra SPEC 14. Os cinco deste bloco têm mecânica própria, mas arte final não está fechada.
- Espelho Partido ainda NÃO copia especiais de classe; integrar estado/identidade temporários sem mudar permanentemente f.kind. IA invertida em navegação prolongada e combinações variadas continuam pendentes.
- Depois fechar auditoria individual dos 115 e integrações restantes. Médio para ícones/arte/roupas/poses/intros/efeitos; Baixo para textos e histórico; Extra Alto para auditoria transversal.
- **Continuar no ALTO. V8 permanece em desenvolvimento; não anunciar versão final.**

Verificação final deste bloco: browser-path-save.cjs também passou (intro persistida, recompensa de boss, draft/arena preservados e próximo encontro).

## Alto — Legião e comandos regionais do Kraken (28/09, continuação)
- Legião deixou o ataque genérico por contato. Melee usa ator/espada com contorno real, startup 340 ms, active 130 ms e recovery 500 ms antes dos multiplicadores, alcance 100. Clash/parry afetam o próprio aliado. Arqueiro mantém distância, observa alvo a cada 180 ms, fixa mira na preparação de 520 ms, dispara projétil físico e recupera; não mata pelo corpo. Suporte respeita paredes, gravidade e plataformas.
- Guardião acompanha o invocador e exibe escudo direcional físico (segmento visível à frente do corpo). Intercepta uma lâmina/projétil parryable que realmente cruze esse segmento; recarga 2,8 s com sinal visual. Proteção do dono usa o hook compartilhado de pré-impacto, então não depende de o worldStep acontecer antes da resolução do golpe. Não oferece escudo remoto, proteção nas costas ou parry contra ataque que explicitamente rompe defesa. Não entra em ataque de contato nem concede buffs de Perfect Parry ao invocador.
- Integrantes da Legião derrotados por golpe, projétil ou queda registram o slot em legionFallen (estado da rodada). Acrescentar outro Legado/recriar lista de summons não os ressuscita. Próximo duelo restaura o trio. Snapshots preservam as baixas. Render usa atores espectrais, arco e escudo distintos; arte definitiva ainda para Médio.
- Kraken sai do corpo pequeno que seguia o jogador: representação colossal fora da arena, sem dano de contato. Comando usa a mira para escolher região próxima e suporte real (chão/plataforma, face de parede ou borda). Tentáculo compartilha exatamente o polígono desenhado/colidido, recortado por paredes, acompanha suporte móvel e desaparece se suporte/fonte forem removidos.
- Escolha de implementação comunicada nesta continuação: a tecla alterna Esmagar → Agarrar → Bloquear rota, próximo comando indicado no status/HUD e explicado no TAB. Ciclo mantém entre rounds, reinicia na partida. Comando sem suporte válido não gasta cooldown nem avança ciclo. Mantido cooldown existente de 13 s.
- Esmagar: aviso 800 ms + área letal curta de 240 ms. Agarrar: aviso 600 ms + janela de contato 350 ms; prende por 240 ms sem matar, não reaplica no mesmo alvo e pode ser aparado do lado correto. Bloquear: aviso 900 ms + zona perigosa por 2,4 s, pode ser contornada/saltada; é controle de área, não uma parede sólida adicionada ao mapa. Nenhuma forma altera permanentemente geometria. IA observa também o aviso do agarrão não letal. Formas com hitboxes/telegrafia próprios; tentáculos/colosso ainda precisam acabamento artístico de Médio.

Testes novos: legacy-legion-test.cjs (12) e legacy-kraken-test.cjs (12), **24 grupos**, incluídos em test-all.cjs. Suíte completa passou após todas as alterações de produção; normal/ADMIN reconstruídos (22 scripts cada).
- browser-legion-kraken.cjs: três papéis + três formas, 30 renders imutáveis por cenário, desktop/estreita. Fixture de agarrar corrigido para capturar a janela ativa antes de o tentáculo expirar, com assert de entidade viva. outputs/v8-legion-kraken.png, outputs/v8-legion-kraken-narrow.png e outputs/v8-legion-kraken-narrow-bottom.png; imagens desktop e parte inferior estreita inspecionadas.
- browser-online-legion-kraken.cjs: visitante ADMIN adiciona ambos; host usa tecla real vinculada ao Kraken; legacyWorld com trio e tentáculo comandado igual em host/guest/espectador após pausa. Desconexão segura. RTC nativo com sinalização LOCAL de teste; Internet pública entre PCs não validada.
- browser-legacy-replay.cjs e browser-path-save.cjs passaram. legacy-boss-soak.cjs passou 12 encontros com controlador e golpes reais (não é playtest humano nem run completa de 50 níveis).

### Próximo ALTO — ainda não trocar de esforço
- Auditar Sapo/Mímico e interceptações de objetos/projéteis. Gaps visíveis no código: Sapo ainda puxa alvo por distância sem checagem de linha/contorno de língua; só busca armas. Mímico ainda tem agarre genérico e pode engolir via life=0 tipos que não deveriam sumir (arma recuperável precisa ser preservada/devolvida). Não marcar catálogo de summons inteiro como pronto antes dessa revisão.
- Espelho Partido ainda precisa copiar especiais de classe com estado próprio. IA sob gravidade invertida em navegação prolongada e combinações variadas pendentes.
- Auditoria dos 115, apresentação e ícones finais no Médio, textos/histórico no Baixo e revisão transversal no Extra Alto. **V8 segue em desenvolvimento; manter ALTO.**

## Alto — Sapo/Mímico, agarrões físicos e armas recuperáveis (28/09, continuação)
- Sapo: segue pelo chão, anuncia por 300 ms e fixa a direção da língua. Extensão em 120 ms e recolhimento em 160 ms, raio físico 4, alcance máximo 240. Render e colisão usam o mesmo segmento, recortado pela primeira parede/plataforma. O primeiro alvo/objeto realmente interceptado é puxado; saltar/desviar da linha funciona. Parry atordoa o Sapo, não o invocador. Ciclo 4 s, sem puxar/teleportar o próprio jogador.
- Busca armas caídas, bomba de sombra e objetos físicos explicitamente recuperáveis. Mantém propriedade dos objetos e não detona bombas. Não rouba uma arma inimiga para o inventário do dono do Sapo: ela cai perto dele, ainda pertencendo ao jogador original.
- Mímico: baú com abertura anunciada em 250 ms, janela de boca de 400 ms, direção travada e alcance curto frontal. Pode agarrar por 220 ms ou engolir UM projétil elegível, recuperando depois (ciclo 5 s). Contato exige o segmento visível da boca, respeita parede e aceita parry; pular/passagem por trás evita o agarrão. Fechado, preparando ou recuperando continua destruível com um golpe.
- Interceptação varre a trajetória do projétil (inclui disparos rápidos), não só posição final. Lista explícita de tipos: flecha, flecha espectral, kunai, pellets/tiro, bola de fogo, bomba de sombra e armas recuperáveis. Não engole beams/zonas, yoyo ou companions. Uma segunda ameaça pode destruir o baú após a primeira captura.
- Armas arremessadas ficam carregadas por 650 ms e são devolvidas ao chão, sem apagar originalOwner/weaponAway. Destruição, remoção, morte do invocador, queda ou ausência de alvos libera a arma. Arma oculta enquanto dentro do baú; desenhos distintos de sapo/baú e estados, ainda provisórios para o passe artístico Médio.
- Corrigida também a preservação de armas recuperáveis no corte de projétil, Escaravelho e escudo/colisão de companion. As interceptações derrubam a arma em vez de apagar a entidade e deixar o dono permanentemente desarmado.
- Caso separado integrado: adaga NATIVA do especial do Assassino. Hooks mínimos em upgrade-core.cjs interceptam antes do dano e preservam o estado/pickup original, sem duplicar como entidade Legado. Sapo pode buscar; Mímico pode capturar/devolver. Snapshot/online transportam carrier/fetch dentro da própria adaga. integrate.cjs oculta o desenho enquanto carregada. Hooks não atuam quando legacyEnabled está desligado.
- Ajuda no TAB descreve direção, parry e devolução de armas, sem modificar catálogo congelado.

Testes: legacy-grab-summons-test.cjs, **28 grupos**, registrado em test-all.cjs. Inclui aviso, erro de mira, paredes/plataformas, parry, cooldown, objetos, propriedade, alta velocidade, captura única, destruição/queda/remoção, congelamento temporal, adaga nativa e snapshots com passos reais. Suíte completa passou DEPOIS dos hooks finais na engine; normal/ADMIN reconstruídos, 22 scripts cada.
- browser-grab-summons.cjs: 4 fixtures (aviso/língua/boca/arma guardada), 30 renders imutáveis por cenário, desktop/800 px. outputs/v8-grab-summons.png, v8-grab-summons-narrow.png e v8-grab-summons-narrow-bottom.png. Desktop e trecho inferior estreito inspecionados; arma deixou de aparecer girando abaixo do baú após ocultação cosmética.
- browser-online-grab-summons.cjs: ADMIN visitante adiciona ambos; estado completo de legacyWorld igual em host/visitante/espectador após pausa, desconexão segura. Este teste online cobriu acompanhamento/spawn e sincronização dos summons, NÃO uma captura dirigida no online. Captura, posse de arma e retomada de snapshots estão cobertas pela suíte de simulação. RTC nativo com sinalização LOCAL; Internet pública entre PCs não validada.
- browser-legacy-replay.cjs e browser-path-save.cjs passaram antes da extensão final de adaga nativa; depois dela passaram a suíte completa (incluindo snapshots de adaga carregada), visual e online acima.
- refine-grab-summons.cjs foi executado uma vez como migração; NÃO rerodar. make-grab-network-fixture.cjs gera apenas fixture de teste, não produção.

### Próximo ALTO — manter esforço atual
- Espelho Partido ainda precisa copiar especiais de CLASSE com estado próprio, sem substituir permanentemente f.kind. A allowlist atual de poderes não resolve isso. Retomar SPEC/DECISIONS antes de integrar; revisar interações com arma equipada, ultMode e estados temporários.
- IA com gravidade invertida e navegação prolongada, combinações variadas e auditoria restante dos 115 Legados ainda pendentes. Não declarar todas as invocações/arte final prontas apenas por este bloco.
- Médio depois para ícones exclusivos/arte/roupas/poses/intros/efeitos; Baixo para textos/histórico; Extra Alto na auditoria transversal final.
- **V8 permanece em desenvolvimento. Manter ALTO; não anunciar versão concluída.**

## Alto — Espelho Partido copia os oito especiais de classe (28/09, continuação)
- Memória agora aceita class:<kind> para as oito classes, além da allowlist de 15 poderes já suportada. Somente uso bem-sucedido a menos de 480 px por adversário pode ser registrado. Uso do próprio Espelho não alimenta cópia recursiva. Memória sobrevive às rodadas; uma execução gasta o item pela partida; partida nova limpa tudo.
- Estado serializável legacy.mirrorSpecial guarda a classe de origem. A execução usa o ciclo nativo de ultMode/penalidades, com hooks pequenos em upgrade-core.cjs, sem modificar f.kind, skin, cor, corpo ou inventário. Não cria uma segunda implementação das oito habilidades. Carga própria fica preservada e pausada enquanto a cópia/custo estiver em andamento; especial próprio não pode ser sobreposto.
- Especial copiado exige especiais habilitados, ação livre e ausência de especial/penalidade, canalização, gesto de arma ou técnica em andamento. Monge requer chão; formas ofensivas não podem contornar arma fora/adaga pendente. Falha não consome memória nem uso. Errante pode copiar sem ganhar permanentemente especial de classe.
- Forma de arma temporária para Ceifador, Monge, Duelista, Pugilista, Lanceiro, Assassino e Espadachim; Cavaleiro só aplica escudo e mantém a arma atual. Stats/corte seguem a forma do especial, preservando mobilidade do corpo. Desenho usa clone cosmético da arma com transparência leve, sem trocar roupa/personagem. Alcance do Ceifador inclui boost/weak; Pugilista inclui parry/rush/penalidade; Monge varrida baixa; Duelista avanço fixo/recovery; Lanceiro carga real; Assassino adaga nativa recuperável; Espadachim quebra-parry/clash/custo originais.
- Cópia não dispara projéteis da arma equipada, não inicia carregamento de Yamato/Ruyi/Leviathan e não gasta cooldown dessa arma. Preserva estoque/equipamento e restaura aparência ao terminar. Golpes fatais informam o tipo da arma copiada. Ajuste pontual do render de defesa/duas mãos/punhos para acompanhar a arma emprestada.
- HUD/TAB distinguem AGUARDANDO MEMÓRIA, classe/habilidade memorizada, CÓPIA EM USO e RECUPERANDO. Efeito discreto de fragmento ao memorizar/ativar. IA pode selecionar a cópia pelo fluxo normal de habilidade; teste com rolagem controlada confirma input e execução, não é avaliação de dificuldade humana.
- Correção encontrada pelo teste online: ADMIN Aplicar regras/Reposicionar passava por reset antigo que perdia Legados. Wrapper preserva builds, vínculos e usos por partida, limpa efeitos temporários da rodada e recria summons ao reconstruir. Refill e troca de atores continuam usando o fluxo próprio; refill cancela cópia como cancela especial normal.
- Consultas items/status/scopeReady e leitura do inventário na UI não criam mais estado em atores sem Legados. Antes, esse efeito colateral podia deixar inventário vazio extra só em um cliente. Os vínculos de teclas são propositalmente LOCAIS; comparação online usa networkSnapshot, que exclui apenas esses metadados conforme protocolo já existente.

Validação: legacy-mirror-test.cjs, **26 grupos**, registrado em test-all.cjs. Inclui os oito especiais, recursos/identidade, recusa segura, janela/custos, colisão fatal real, clash, arma equipada, Errante, ADMIN, IA e snapshots com passos reais. Suíte completa passou após as correções finais de produção; normal/ADMIN reconstruídos (22 scripts cada).
- browser-mirror.cjs: oito formas copiadas em Cavaleiro equipado com arco, 30 renders sem mutar snapshot por cenário, desktop/estreita; outputs/v8-mirror-specials.png, v8-mirror-specials-bottom.png, v8-mirror-specials-narrow.png. Desktop e trecho inferior inspecionados. São fixtures de apresentação, não balanceamento humano. Arte definitiva ainda pode ser polida no Médio.
- browser-online-mirror.cjs: RTC nativo com sinalização LOCAL, host normal + visitante ADMIN + espectador. Visitante altera regras/posições/classe via painel, adiciona Espelho ao host, usa KeyF de verdade como Ceifador; host memoriza e aciona a tecla vinculada. Após pausa, estados de combate dos lutadores e legacyWorld coincidem nos três; origem da cópia, consumo, carga própria preservada e classe real inalterada confirmados. Desconexão segura. Internet pública entre PCs não validada.
- Primeira falha desse browser expôs perda de build/mutação de leitura e foi corrigida. Segunda comparação detectou somente bindings locais diferentes; fixture passou a usar o networkSnapshot já existente, sem alterar o contrato de teclas pessoais.
- browser-legacy-replay.cjs e browser-path-save.cjs passaram após as últimas mudanças de produção.
- refine-mirror-special.cjs é migração já executada, NÃO rerodar. make-mirror-network-fixture.cjs gera apenas teste.

### Próximo ALTO
- Espelho Partido não é mais o bloqueio pendente: cópia dos oito especiais está integrada/testada. Continuar por IA sob gravidade invertida e navegação prolongada (manto já espelha física, mas AI ainda interpreta parte das rotas no referencial normal), depois combinações variadas e auditoria restante dos 115 Legados.
- Ainda não marcar V8 final: auditoria mecânica restante, runs variadas/prolongadas, ícones exclusivos/arte/roupas/poses/intros/efeitos no Médio, textos/histórico no Baixo e auditoria transversal no Extra Alto.
- **Manter ALTO. V8 continua em desenvolvimento.**

## Alto — navegação invertida e simulações com builds variadas (28/09, continuação)
- path.js agora calcula um referencial de navegação por ator. Pés, velocidade vertical, plataformas e paredes são refletidos para reutilizar navigateAI/nextPlatform; mundo, mira, projéteis e direção vertical do dash continuam em coordenadas reais. Não muda a física do manto nem a IA clássica sem Legados.
- Observação atrasada inclui a orientação visível do alvo. Um adversário no chão não é tratado como se estivesse apoiado na mesma face da plataforma de quem está no teto. Jump-held, segundo pulo, queda rápida, fuga de zonas, leitura de bordas e busca de apoio respeitam a gravidade pessoal.
- Rotas da IA Legado usam cache por decisão, evitando reaproveitar uma rota do chão para o teto ou através de plataforma movida/desabada. Mudança de orientação/suporte perdido limpa navTarget. Plataformas móveis permanecem carregadas pelo motor existente.
- Manto não é desligado cegamente após 1,2 s no ar: considera teto disponível, posição observada do adversário e arma própria caída. Recuperação de arma pode pedir retorno à gravidade normal; não volta a inverter no meio dessa busca.
- Corrigidos conflitos entre perseguição e recuperação: perseguir o oponente não sobrescreve a rota da arma; busca não apaga o comando de desligar o manto; não executa salto/dash do referencial anterior no frame da troca. Queda já capaz de atingir a plataforma inferior não gasta segundo pulo desnecessário. Perfil de alcance da IA também respeita arma temporária do Espelho.
- Nenhum teleporte, invencibilidade ou reflexo instantâneo foi adicionado ao bot. Mantidos atraso de observação/probabilidades existentes.

Validação:
- legacy-inverted-ai-test.cjs: **16 grupos**, registrado em test-all.cjs. Orientação/imutabilidade, paridade normal, cache/suporte perdido, salto/segundo salto/recarga/dash, atraso e marcha no teto, fast fall, decisão de manto, recuperação real de arma teto→chão, três travessias entre plataformas, snapshots, atravessar plataforma unilateral, plataforma móvel, wall jump e perseguição integral de 20 s. Fixtures de travessia controlam comandos de navegação; teste de perseguição usa L.ai completo. Sem resgates ADMIN.
- A primeira falha do teste de dash era colisão correta com teto imediatamente após pular: fixture agora deixa espaço antes do dash para testar a direção. A primeira travessia encerrava porque o ator-alvo caía da fixture; ele recebeu apoio próprio. O caso de recuperar arma revelou conflitos reais descritos acima, corrigidos antes do passe final.
- Suíte completa passou após as últimas mudanças de produção. Normal e ADMIN reconstruídos, **22 scripts** válidos cada.
- browser-inverted-ai.cjs: 10 s simulados na geometria oficial do Dojo, IA percorreu ~738 px; 30 renders sem alterar snapshot, telas 1440/800 px. outputs/v8-inverted-ai.png e v8-inverted-ai-narrow.png; imagem larga inspecionada. Apresentação ainda provisória para o passe Médio.
- browser-legacy-replay.cjs passou. browser-path-watch.cjs passou com RTC nativo e sinalização LOCAL: entrada tardia, draft somente leitura, pausa, isolamento do save, reconexão/saída. Esse teste de espectadores é regressão geral, NÃO uma prova de navegação invertida transmitida entre PCs. Internet pública não validada.
- legacy-boss-soak.cjs: os 12 encontros de chefes passaram novamente, comandos roteirizados e dano real, sem vitória forçada/invencibilidade. Não é avaliação humana de dificuldade.
- Novo legacy-build-soak.cjs: **15 encontros** (12 combinações de cinco Legados, seis mapas oficiais, dificuldades normal/difícil/master, mais grupos do Caminho nos níveis 26/36/46). Total **454,35 s simulados**, **2.779 frames** comparados após retomada; nenhum estado divergente, valor não finito ou crescimento descontrolado. Pico observado: 11 entidades e snapshot de 54.329 bytes. Três cenários chegaram ao limite de 45 s, os demais encerraram partidas. Resultados em outputs/v8-build-soak.json e .log. Não afirmar 15 partidas concluídas.
- Falhas iniciais desse soak eram da fixture: IDs de mapas/relíquia incorretos e clone do input depois de command já tê-lo consumido. Corrigida cópia ANTES do passo; não houve mudança de produção para mascarar divergência.
- refine-inverted-ai.cjs é migração já aplicada; NÃO rerodar. path.js é fonte direta, build.cjs inclui sem regenerá-la.

### Próximo ALTO — auditoria específica restante
- Gravidade invertida e cópia dos especiais não são mais os bloqueios anteriores. Continuar pela correspondência individual com SPEC-V8 e combinações ainda não exercitadas.
- Busca preliminar por IDs literais nos *test.cjs encontrou candidatos sem teste nominal: blunderbuss, climbing, duelistband, magnetic, crackedglass, glasseye, stoppedclock, upstrike, counter, perfectstep, pulse, impulse, blink, well. Isso NÃO significa que estejam ausentes/quebrados (há loops e cobertura indireta); ler especificação/implementação antes de decidir correção. Bom próximo lote para auditoria objetiva.
- Ainda faltam o passe artístico/115 ícones/roupas/armas/poses/intros/efeitos no Médio, textos no Baixo e auditoria transversal no Extra Alto. Não declarar V8 concluída.
- **Manter ALTO por enquanto. V8 continua em desenvolvimento.**

## Alto — auditoria de equipamentos, técnicas e forças (28/09, continuação)
- Conferidos os 14 candidatos do checkpoint anterior contra os trechos correspondentes da SPEC. Acrescentados testes nominais para Bacamarte, Luvas de Escalada, Faixa do Duelista, Botas Magnéticas, Ampulheta Rachada, Olho de Vidro, Relógio Parado, Golpe Ascendente, Contra-ataque, Passo Perfeito, Pulso, Impulso, Blink e Poço; cobertura adicional para Capa Leve e composições de mobilidade.
- Impulso, recuo do Repulsor e Chute Voador deixam de integrar posição duas vezes. Hook impulseVelocity atua na etapa normal da engine, com gravidade/colisão originais e curto impulso sem aceleração horizontal contrária. Salto, dash, técnicas comprometidas e atordoamento encerram/sobrepõem o impulso; voo não sobrescreve a explosão no mesmo frame. Plataformas/parede param o corpo normalmente.
- Roupas de parede e Capa Leve agora controlam velocidade ANTES da integração/colisão, via wallClothingVelocity. Luvas/Máscara seguram na parede sem deriva e sem cancelar salto/dash/stun. Magnéticas sobem a 240 px/s por até 1,4 s efetivamente gasto em contato; sair da parede pausa o gasto, aterrissar repõe. Não depende mais de ter tocado parede nos primeiros 1,4 s de voo. Magnéticas + Luvas: corre e depois segura; não ganha corrida infinita. Referencial invertido continua usando o wrapper já existente.
- Faixa: cooldown acompanha duração ativa real + 65% do recovery configurado, coerente com a duração do estado parryRecovery. Inclui Incenso e valores personalizados; retirado desconto fixo de 120 ms que discordava da recuperação.
- Contra-ataque: aceleração consumida no primeiro ataque aceito, sem disparar automaticamente; input recusado não gasta a oportunidade. Passo Perfeito ignora golpes que já foram resolvidos (attackHit).
- Blink continua com alcance 230 e pode atravessar obstáculos finos, mas valida o corpo completo e rejeita destino atravessado por plataforma. Procura ponto válido mais perto; sem deslocamento válido não consome cooldown. Limpa apoio anterior, preservando velocidade.
- Pulso: alcance visual/mecânico 175, não letal, bloqueado por parede e respeita Talismã no empurrão. Afeta apenas objetos soltos/projéteis elegíveis; não altera campos, companions ou armas carregadas.
- Poço: preserva aviso/raio/duração e atração não letal. Deslocamento de atores verifica colisão desde a posição anterior e apoio normal/invertido; não empurra através de piso/parede fina. Objetos carregados, summons e zonas excluídos da força. Não move alvo congelado; forças usam o menor fator de tempo entre fonte/alvo, sem multiplicar slows sobrepostos.
- Fontes: legacy-combat.js e upgrade-core.cjs. engine.js regenerada; integração/builds normal e ADMIN reconstruídos. V7.2 preservada.

Verificação:
- legacy-equipment-audit-test.cjs: **21 grupos**; legacy-force-audit-test.cjs: **11 grupos**. Ambos registrados em test-all.cjs. Total **32 novos grupos**, com física real, combinações, destino inválido/cooldown e retomada de snapshots.
- legacy-relic-precision-test.cjs atualizado para testar a Máscara com moveFighter real. A fixture antiga estava a ~1 px do piso e aterrissava ao soltar: foi elevada para testar queda livre, mantendo verificação separada de aterrissagem. Outros ajustes de fixture: dash afastando-se da parede (contato lateral cancela dash por regra existente), coyote zerado para exigir double jump, recovery zero retorna a idle como na engine, companion comparado ao controle sem Poço (sua própria IA movimenta vx).
- **Suíte completa passou** depois de todas as alterações. Normal/ADMIN: 22 scripts válidos cada.
- legacy-build-soak.cjs passou novamente: 15 encontros, **456,70 s simulados**, **2.774 frames** retomados idênticos; pico 11 entidades / snapshot 54.424 bytes. Três encontros atingiram limite de 45 s; não são 15 vitórias/partidas completas nem teste de balanceamento humano. Dados em outputs/v8-build-soak.json.
- browser-inverted-ai.cjs passou novamente (desktop/800 px, 10 s de navegação no teto e render imutável).
- browser-online-force.cjs: host normal + visitante ADMIN + espectador, RTC nativo com sinalização LOCAL. Visitante edita inventário; host usa teclas vinculadas reais de Impulso, Poço e Blink; cooldown, deslocamento e campo transmitidos. Após pausa, fighters/world coincidem nos três clientes via networkSnapshot. Saída/desconexão segura, sem erros. outputs/v8-online-force.png inspecionada. Internet pública entre computadores NÃO validada.
- browser-legacy-replay.cjs e browser-path-save.cjs passaram após as mudanças. make-force-network-fixture.cjs só gera fixture de teste a partir da de Espelho; pode ser rerodado, não modifica produção.

### Próxima etapa recomendada — MÉDIO
- O lote de mecânicas/integrações/auditoria nominal que mantinha o ALTO está encerrado neste checkpoint. Recomendar ao usuário trocar para MÉDIO na próxima continuação; não alterar esforço automaticamente.
- Entrar no passe de apresentação: ícones próprios dos 115 (hoje vários reutilizam símbolos genéricos), cartas/TAB/HUD, identidade de armas/roupas/invocações, efeitos/poses e arenas/intros do Caminho. Começar inspecionando v8-visuals.js, v8-actors.js, v8-ui.js e screenshots reais; manter fontes diretas vs geradores. Nenhuma alteração de física/hitbox/timing por estética.
- Textos/histórico/guia no BAIXO depois; auditoria transversal e regressão final no EXTRA ALTO. Na revisão final voltar a casos extremos/combinações, não assumir que presença nominal em teste prova cada variante dos 115.
- Ainda não declarar V8 concluída. Falta apresentação final e revisão integral; balanceamento humano e Internet pública continuam sem validação.

## Médio — ícones próprios e apresentação das cartas (28/09)
- Substituídos os símbolos genéricos por 115 desenhos próprios em v8-visuals.js. Silhuetas e detalhes distintos por Legado, cores por categoria e molduras/marcas por raridade. Paths Canvas locais, sem downloads/dependências; nenhuma mudança de catálogo congelado, física, timing ou colisões.
- Ícones exportam iconIds congelado para verificar correspondência com catálogo. Arte permanece apresentação somente. install-icon-art.cjs foi migração de instalação já aplicada: NÃO rerodar; editar v8-visuals.js diretamente.
- v8-ui.js usa backing de 96 px e canvas decorativo aria-hidden (nome/status continuam no texto e botão). Cartas de inventário com ícone 56 px, draft 80 px; HUD preserva 28/21 px. v8.css: hierarquia/contorno/foco, min-width corrigido, draft em uma coluna abaixo de 480 px para não esmagar descrição. Mantidos filtros, aquisição, seleção, bindings e controles do laboratório.
- browser-icon-art.cjs: todos os 115 presentes, sem imagens vazias/duplicadas a 21/28/48/96 px, estado de Canvas restaurado. Seis contact sheets outputs/v8-icons-{weapon,clothing,relic,technique,summon,power}.png geradas e TODAS inspecionadas. Isso valida ícones, não arte dos atores.
- browser-icon-ui.cjs (normal e --admin): catálogo 115, busca, adição de seis categorias, HUD, inventário e draft em 1440/800/390 px sem overflow horizontal. Escolha real da última carta e confirmação de aquisição no combate. Screenshots outputs/v8-inventory-*.png, v8-draft-*.png e v8-icons-hud.png; desktop/mobile/HUD inspecionados. Reexecução ADMIN sobrescreve as imagens com o mesmo nome. extend-icon-ui-test.cjs/parameterize-icon-ui-test.cjs são patches já aplicados ao teste, NÃO rerodar.
- Builds normal e ADMIN reconstruídos, 22 scripts válidos cada. Suíte completa test-all.cjs passou. Testes de navegador dos ícones são comandos separados; não estão em test-all.cjs.

### Próximo — continuar MÉDIO / arte dentro da arena
- Passe de ícones/cartas concluído neste checkpoint, NÃO o passe visual inteiro. Continuar v8-actors.js e v8-visuals.js: roupas com identidade/movimento, armas, summons, efeitos/poses, arenas/intros do Caminho. Já existem representações provisórias e hooks; aprimorar sem refatorar mecânicas nem mudar contornos de ataque.
- v8-actors.js back/front/headgear: capes por ribbon, asas/glider, crystal/berserker, botas/luvas/faixa/máscara; as relíquias no corpo hoje são pequenos pontos alternados. v8-visuals.js arena começa em ~132; cenários do Caminho ainda geométricos básicos. Fotografar estado atual antes de definir próximo lote artístico; browser fixtures de replay/mirror existentes ajudam a verificar render sem mutação.
- Manter MÉDIO. Depois textos/histórico/guia no BAIXO e auditoria transversal no EXTRA ALTO. V8 continua em desenvolvimento, sem lançamento final; Internet pública/balanceamento humano ainda não validados.

## Médio — vestimentas e composição de equipamentos (28/09, continuação)
- v8-actors.js: mantos deixam de ser apenas a mesma faixa em cores diferentes. Capa principal com costura acompanhando os nós da simulação visual existente; Espelho com facetas, Gravidade com bordado/lua, Fantasma com transparência/franjas e mangas, Sombrio com gola, Capa Leve com fecho. Ao combinar mantos, um fica principal e os demais aparecem em tiras/acabamentos; inventário e efeitos permanecem intactos.
- Capa Planadora ganhou varetas, painéis claros/escuros e oscilação curta. Ícaro: penas segmentadas, articulação e batida diferenciada entre voo ativo/repouso/aéreo. Nenhum efeito sobre impulso, gravidade, alcance ou hitbox.
- Botas combinadas mantêm solas magnéticas e propulsores visíveis junto das asas. Joelheiras com placas. Cristal ganhou ombreiras/facetas/fissuras no estado gasto; ao combinar com Berserker conserva uma incrustação no peito. Berserker ganhou placas e canais acesos durante seu efeito.
- Fontes diretas: v8-actors.js. refine-wardrobe-art.cjs e refine-armor-art.cjs são migrações JÁ aplicadas, NÃO rerodar. Build normal e ADMIN reconstruídos, 22 scripts válidos; não modificar actors.js gerado para estes detalhes.
- browser-wardrobe.cjs: galeria antes/depois, 17 vestimentas isoladas + 3 combinações, cada uma em idle/dash/aéreo, snapshot preservado. outputs/v8-wardrobe-before.png e after.png; ambas inspecionadas (primeiro after antes dos detalhes adicionais de armadura, rerender final feito em seguida).
- browser-wardrobe-motion.cjs: ADMIN, oito classes nativas com conjunto completo; 480 renders incluindo voo, Cristal gasto, Berserker ativo e gravidade invertida, snapshots sem mutação e sem erros de navegador. outputs/v8-wardrobe-classes.png inspecionada; essa galeria é vista de arena distante, não prova de detalhe de cada peça/skin.
- browser-mirror.cjs passou novamente: oito especiais copiados, estado/identidade imutáveis, tela larga/estreita. Suíte completa test-all.cjs passou após as alterações.

### Próximo MÉDIO
- Continuar o passe visual: armas (15), criaturas/invocações, efeitos de técnicas/poderes e arenas/intros do Caminho. Há arte provisória funcional em v8-actors.js (W.draw) e v8-visuals.js; inspecionar e aprimorar por lote mantendo geometria semântica e todos os testes mecânicos.
- Roupas receberam este primeiro refinamento/composição. Ainda vale revisão final em gameplay humano e skins; não afirmar aprovação visual definitiva de todas as combinações possíveis.
- Ainda faltam textos no BAIXO e revisão integral no EXTRA ALTO. Manter MÉDIO por enquanto. V8 não finalizada; não anunciar lançamento completo.

## Médio — identidade dos 15 modelos de armas (28/09, continuação)
- v8-actors.js: refinados os 15 modelos equipados. Espada reta com sulco/pomo, Yamato com perfil de katana/colar, Zenith facetada com guarda própria, Eco com fissura segmentada pulsante. Agulha com olho na empunhadura; machados comum/Leviatã têm recortes distintos, cunha/runa. Arco com extremidades, haste/ponta/penas na flecha; Bacamarte com ferragens e mecanismo; Gunblade com tambor/guarda; soqueira com furos, ioiô com disco rotativo, bastão ornamentado, vassoura/kunai com acabamentos.
- Mantidos comprimentos de referência e lógica de arma/contorno/alcance/timing. Alterações são apenas os caminhos desenhados. Não modificar WEAPONS nem o catálogo para este passe.
- projectileArt reutiliza o modelo equipado reduzido para armas arremessadas, substituindo o machado genérico anterior. Também desenha ioiô/kunai e flechas normal/espectral. W.draw aceita w.detached só para não desenhar uma mão junto ao objeto solto. v8-visuals.js chama helper dentro da transformação existente do projétil. Sem alteração de entidades/snapshots/colisões.
- refine-weapon-art.cjs e refine-loose-weapon-art.cjs são migrações JÁ aplicadas, NÃO rerodar. Fontes diretas agora v8-actors.js/v8-visuals.js.
- browser-weapon-art.cjs: 15 modelos × 3 direções/poses, snapshot e geometria blade preservados; galeria antes/depois inspecionada em outputs/v8-weapons-before.png e after.png.
- browser-weapon-states.cjs: ADMIN, 15 modelos em idle/startup/active/recovery, 4 rotações soltas por modelo, arma-away invisível; render real com cinco tipos de projétil e snapshots imutáveis (90 renders contabilizados, mais 60 desenhos soltos). outputs/v8-weapons-states.png inspecionada. Fixture também desenha algumas combinações de modelo/tipo solto só para exercitar o renderer, não significa que qualquer arma ganhe arremesso por padrão.
- browser-mirror.cjs e browser-legacy-replay.cjs passaram novamente. Suíte completa test-all.cjs passou; builds normal/ADMIN, 22 scripts válidos cada. Sem teste novo em Internet pública ou alteração de balanceamento.

### Próximo MÉDIO
- Ícones/cartas, roupas e primeiro refinamento de armas concluídos em lotes. Próximo: criaturas/invocações em v8-visuals.js (as entidades reais já têm comportamento/telegraphs; preservar tudo), depois poderes/técnicas/arenas/intros do Caminho.
- Não anunciar V8 concluída. Manter MÉDIO; textos BAIXO e revisão transversal EXTRA ALTO continuam pendentes. Inspeção de skins/combinações e gameplay humano ainda necessária na revisão final.

## Médio — primeiro lote de criaturas (28/09, continuação)
- Sete invocações pequenas redesenhadas em v8-visuals.js via smallCreature: Corvo, Falcão, Fada, Besouro-Escudo, Cão de Caça, Macaquinho e Slime. Antes Corvo/Falcão/Fada compartilhavam a mesma silhueta; Cão/Besouro caíam no humanoide genérico. Agora têm corpos/silhuetas próprios, contorno, camadas e detalhes de dono.
- Corvo/Falcão com penas e batida articulada (asas recolhem na investida efetiva); Fada com asas translúcidas/varinha; Besouro com antenas/patas/carapaça e detalhe de escudo pronto/recarga; Cão quadrúpede com passada/cauda/orelhas/postura de aviso; Macaco com face/cauda/membros e braços elevados ao carregar; Slime com deformação curta e reflexo. Orientação deriva da velocidade/mira existentes; animação só lê tempo/estado.
- Nenhuma mudança em regras, colisões, radii, ataques ou relógios. Mantidos aviso circular e alpha de warning, deformação de Slime preso ao alvo e pipeline já existente. Helpers só desenham localmente dentro do save/restore do renderer. Outros summons ainda usam suas representações anteriores.
- refine-small-summon-art.cjs é migração JÁ aplicada, NÃO rerodar; editar v8-visuals.js diretamente. A antiga ramificação genérica continua como fallback depois de smallCreature (alguns casos ficaram inalcançáveis; eventual limpeza localizada pode removê-los sem refatorar o pipeline).
- browser-small-summons.cjs: galeria de 7 criaturas × 3 estados/poses normal antes/depois, inspecionada outputs/v8-small-summons-before.png e after.png. Estendido para --admin: +210 frames, hashes de pixels mudam em todas as sete animações e snapshots ficam idênticos. A fixture inclui warning sintético em passivos para verificar que o renderer não perde o anel; isso não concede ataque ao Besouro/Fada. extend-small-summon-test.cjs JÁ aplicado, não rerodar.
- browser-v8-lab.cjs passou; screenshot outputs/v8-summon-lab.png inspecionada em arena real com várias criaturas. browser-legacy-replay.cjs passou. Suíte completa test-all.cjs passou; normal/ADMIN reconstruídos, 22 scripts válidos cada.

### Próximo MÉDIO — criaturas restantes
- Continuar visual de invocações maiores/raras/lendárias em v8-visuals.js: Dragão, Mahoraga, Star, Caçador ainda compartilham formas genéricas em parte; Kraken tem corpo simples e tentáculos já usam contorno mecânico real. Rei Slime, Necromante, espectrais/Legião/Skeleton e Sapo/Mímico/Lanterna/Medusa merecem inspeção, nem todos precisam de substituição completa.
- Não alterar geometria dos avisos/tentáculos/língua/boca/campos, nem mecânicas concluídas no Alto. Fazer galerias antes/depois e verificar render imutável. Depois efeitos de técnicas/poderes e arenas/intros do Caminho.
- Manter MÉDIO, V8 ainda em desenvolvimento. Textos BAIXO e auditoria final EXTRA ALTO pendentes; não declarar lançamento nem validação humana/Internet pública.

## Médio — Dragão, Mahoraga, Caçador, Star e Necromante (28/09)
- Novo helper cosmético largeCreature em v8-visuals.js, cinco modelos distintos substituindo formas genéricas. Dragão com corpo/cauda/asa/mandíbula, asas em ritmo lento e boca reagindo à entidade dragonbreath do mesmo dono; Caçador com corpo rasteiro, espinhos, patas, máscara/dentes e olhos de caça; Mahoraga com corpo articulado, tecido e roda; Star com postura/punhos e avanço curto do punho seguindo a fase ativa do dono; Necromante pequeno de capuz, cajado e livro.
- Roda usa wheelAngle/wheelPulse/adaptations originais; marcadores coloridos conservados. Detalhes de dono mantêm cor verde/coral. Não mudam posições, áreas, r, alcance, avisos, alpha ou lógica. Os modelos são visuais: movimentos de asa/cauda/roupa não arrastam colisões.
- refine-large-summon-art.cjs já aplicado, NÃO rerodar. Fonte direta v8-visuals.js. Build normal/ADMIN regenerados, 22 scripts válidos cada.
- browser-large-summons.cjs: 5 entidades reais instanciadas, 15 poses e 150 frames (pixels variam, snapshots não); normal e ADMIN. Galerias antes/depois inspecionadas. Fixture final com lados/donos alternados, Mahoraga adaptado/roda, Hunter watch/hunt/mark, Star com dono atacando e Dragon com rajada existente. make-large-summon-fixture.cjs gera versão inicial a partir do pequeno; NÃO rerodar pois apagaria melhorias. extend-large-summon-test.cjs já aplicado.
- browser-large-summon-lab.cjs: adiciona os cinco pela interface real do laboratório + Manto da Gravidade, confirma spawn e inversão, sem erro de renderer. outputs/v8-large-summon-lab.png inspecionada. Primeiro run falhou porque a fixture copiada usava Digit2 fixo; com novos ativos, essa tecla pertence a outro Legado. Teste agora consulta bindings.gravitycloak no snapshot e passou. Nenhuma correção de produção para esse timeout.
- browser-legacy-replay.cjs passou. Suíte completa test-all.cjs passou após a alteração. Internet pública/performance prolongada/balanceamento humano ainda não validados.

### Próximo MÉDIO — fechar invocações restantes
- Refinar corpo do Kraken e Rei Slime; inspecionar Sapo/Mímico/Lanterna/Medusa e espectrais/Legião/Skeleton/servo (já têm art/telegraphs melhores, não reconstruir sem necessidade). Preservar contornos reais dos tentáculos e zonas/língua/boca. Depois técnicas/poderes, arenas/intros do Caminho.
- Modelos pequenos e este lote maior refinados; isso NÃO encerra todo o passe de invocações nem a V8. Manter MÉDIO. Textos BAIXO e auditoria transversal EXTRA ALTO ainda pendentes.

## Médio — Kraken, Rei Slime e acabamento de controle (28/09)
- v8-visuals.js: Kraken agora possui cabeça facetada, olhos/pupilas, bico e cinco tentáculos COSMÉTICOS no corpo fora da arena, com oscilação lenta/ventosas. Mantido alpha .6 e escala pelo r original. krakenArm/contornos de ataque NÃO foram alterados: tentáculos de golpe continuam usando pontos reais da engine.
- Rei Slime: volume em camadas, reflexo, rosto e base, coroa com leve movimento; gerações menores usam fragmentos de coroa e o próprio r do estado. Mantida deformação preexistente de compress/leap, sem alterar pulo/split/área de impacto.
- Sapo recebeu manchas/dedos; Mímico veios/ferragens; Medusa cinco filamentos oscilantes; Lanterna barras/teto. Língua/boca/campos/scan permanecem calculados pelos helpers originais, sem alteração de duração ou colisão.
- Removidas ramificações de desenho genérico que ficaram inalcançáveis após smallCreature/largeCreature. Mantido fallback para tipos desconhecidos; sem refactor estrutural.
- refine-kraken-slime-art.cjs e refine-control-summon-art.cjs já aplicados: NÃO rerodar. Fonte direta v8-visuals.js. Normal/ADMIN reconstruídos (22 scripts).
- browser-remaining-summons.cjs: seis tipos, 16 vistas, gerações/estados de Slime, boca/aviso/scan/charging; 40 frames animados Kraken/Slime e snapshots imutáveis. Normal e ADMIN passaram. outputs/v8-remaining-summons.png inspecionada antes/depois dos detalhes menores (mesmo nome sobrescrito).
- browser-small-summons.cjs e browser-large-summons.cjs passaram após a limpeza (360 frames animados combinados, sem mutação). browser-legion-kraken.cjs passou (três papéis, três comandos reais, telas larga/estreita). browser-grab-summons.cjs passou (língua, aviso, boca e arma carregada). Suíte completa test-all.cjs passou.

### Próximo MÉDIO
- Revisão final de humanoides invocados (Skeleton, Spectral, Doppel, Legião/servo) para decidir se precisam de detalhes extras; já reutilizam poses/art da engine e têm transparência/armas/escudo específicos. Não mudar comportamento para arte.
- Depois passar aos efeitos/poses de técnicas e poderes e às arenas/intros do Caminho. Ainda há trabalho visual significativo; NÃO declarar V8 finalizada. Manter MÉDIO. Textos BAIXO e auditoria EXTRA ALTO pendentes.

## Médio — humanoides invocados / primeiro passe de invocações fechado (28/09)
- v8-actors.js: Esqueleto com fissura no crânio, olho luminoso, ombreira reparada e tirante; Espectral com selo central; Legião com faixa/insígnia por papel (espada, arco, proteção) e tecido na cintura; servo reanimado com pequeno talismã, preservando classe/skin/poses.
- Doppelgänger preservado: copiar aparência/movimento do dono faz parte de sua identidade. Não adicionar um corpo diferente só para diferenciá-lo; transparência já existente continua.
- v8-visuals.js adiciona summonTint/summonSlot apenas ao CLONE usado para desenho. Não adiciona campos ao estado autoritativo nem toca na sincronização. summonDress atua antes do retorno por falta de legacy, para funcionar também nos atores invocados sem inventário. Escudo real da Legião permanece no world renderer e não aparece na galeria isolada de torso.
- refine-humanoid-summon-art.cjs já aplicado: NÃO rerodar. Fontes diretas v8-actors.js/v8-visuals.js. Normal/ADMIN reconstruídos, 22 scripts válidos cada.
- browser-humanoid-details.cjs: ADMIN, seis variações (inclui três slots), dois lados/poses, ator imutável. outputs/v8-humanoid-details.png inspecionada. Fixture de arte usa tipos explícitos; testes de integração abaixo exercitam os clones reais.
- browser-physical-summons.cjs passou antes/depois: Doppel ativo, Esqueleto startup, Espectral startup/active, telas larga/estreita, snapshots imutáveis. browser-legion-kraken.cjs passou para os três papéis e três comandos de tentáculo. Suíte completa test-all.cjs passou.

### Próximo MÉDIO — efeitos de técnicas e poderes
- Primeiro passe de ícones/cartas, equipamentos e TODAS as famílias de invocações revisado; a revisão final em gameplay/skins/combinações ainda pode pedir ajustes. Não gastar próximas continuações repetindo essas galerias sem mudança/risco novo.
- Entrar no acabamento de técnicas/poderes: v8-visuals.js world() ainda tem círculos genéricos em vários efeitos/zonas e fallback de projétil. Identificar cada tipo real criado em legacy-combat.js, ler SPEC correspondente e fazer desenho próprio preservando contornos/telegraphs/tempo. Não mudar hitboxes nem adicionar brilho pesado.
- Depois arenas/intros do Caminho. Textos/histórico/guia BAIXO e auditoria final EXTRA ALTO continuam pendentes. Manter MÉDIO; V8 ainda não finalizada. Não declarar validação de Internet pública ou balanceamento humano.

## Médio — poderes de controle e projéteis (28/09)
- v8-visuals.js: Poço Gravitacional com espirais e núcleo orbital; Rajada de Vento com linhas animadas e direção; gelo com cristal radial; impacto de teia com trama. Contorno usa o raio real, aviso tracejado preservado e decoração interna recortada no círculo da zona.
- Bola de Fogo ganhou camadas de chama e núcleo oscilante; Bomba de Sombra ganhou corpo facetado/pavio/faísca. Só apresentação: sem mudança de física, duração, alvo, raio ou estado sincronizado.
- refine-control-power-art.cjs já aplicado: NÃO rerodar. Fonte direta v8-visuals.js. Normal/ADMIN reconstruídos, 22 scripts válidos cada.
- browser-control-power-art.cjs: seis efeitos, 12 vistas, 120 frames por build, snapshots imutáveis, movimento dos quatro efeitos animados e limite de desenho das quatro zonas. Normal e ADMIN passaram; outputs/v8-control-power-art.png inspecionada.
- Corrigida a fixture de limites: DuelRenderer pede contexto alpha:false; o teste interpretava fundo opaco como desenho fora do alcance. Canvas de medição agora obtém alpha:true antes de construir renderer. Não foi necessário alterar produção por essa falha.
- browser-contextual-powers.cjs passou: quatro cenas no renderer completo, 30 frames imutáveis por cena, telas larga/estreita. Suíte completa test-all.cjs passou.

### Próximo MÉDIO
- Continuar efeitos/poses de técnicas e poderes: ainda há fallback circular em world.effects (pulso, impulso/repulsor, barreira, blink/troca, névoa, efeitos temporais, Room/domínio e golpes especiais). Ler criação e SPEC antes de mudar desenhos, preservar avisos/área/duração. Este lote de seis NÃO fecha o passe de poderes.
- Depois arenas/intros do Caminho. Textos/histórico/guia BAIXO e auditoria final EXTRA ALTO pendentes. Manter MÉDIO. V8 ainda não finalizada.

## Médio — deslocamento, retorno e defesa (28/09)
- v8-visuals.js: mobilityEffectArt substitui o círculo genérico de nove efeitos: pulse (ondas concêntricas dentro do raio), impulse/repulsor (rastros direcionais opostos), barrier (selo), barrierBreak (fragmentos), mark (marcador persistente oscilante), swap/blink (fragmentação curta) e mist (filetes acompanhando o dono enquanto effects.mist está ativo).
- barrierArt substitui a linha frontal simples por painel facetado estreito, mantendo x=f.x+f.facing*35 e altura +/-40. Continua acompanhando o lado do personagem. Nenhuma mudança de bloqueio, alcance, tempo ou estado autoritativo.
- Edições DIRETAS em v8-visuals.js, sem script de migração. Normal/ADMIN reconstruídos, 22 scripts válidos cada.
- browser-mobility-power-art.cjs: nove efeitos transitórios + barreira mantida, dois lados, 240 frames animados por build, verificação de desenho não vazio, variação temporal, snapshots imutáveis e restauração de transform/alpha/dash do Canvas. Normal e ADMIN passaram. Galeria outputs/v8-mobility-power-art.png inspecionada (efeitos isolados, sem personagens).
- Suíte completa test-all.cjs passou. Testes de arte usam L.effect com estados representativos; não representam nova validação de Internet pública nem balanceamento humano.

### Próximo MÉDIO
- Continuar efeitos/poses restantes: temporais (slowTime/timeStop), Room/domínio, zonas de corte/blackfire/smoke, técnicas/golpes especiais. Ler criação e SPEC; preservar avisos/áreas/tempo. Não repetir galerias já verificadas sem motivo novo.
- Depois arenas/intros do Caminho. Textos/histórico/guia BAIXO e auditoria final EXTRA ALTO ainda pendentes. Manter MÉDIO; V8 NÃO finalizada.

## Médio — tempo, campos e zonas especiais (28/09)
- v8-visuals.js: temporalFieldArt diferencia slowTime/timeStop, com progresso do aviso real (e.warn), ponteiro lento versus parado, sem criar área de alcance fictícia para poderes globais. ROOM com malha esférica discreta e arco orbital; Domínio com marcas periféricas e motivo de santuário pulsante. Os dois campos mantêm o raio real e contorno durante a duração, esmaecendo só no final.
- regionZoneArt: fumaça em volumes móveis, chamas negras animadas, cortes spatial/domain/spectral com aviso tracejado e abertura/fechamento visual da lâmina, Shambles com marcas de troca. Tudo recortado ao círculo real; área ativa preenchida nos cortes, sem transformar a faixa desenhada em nova hitbox.
- Edições diretas em v8-visuals.js. Normal/ADMIN reconstruídos, 22 scripts válidos cada. Sem mudança na engine nem dados de sincronização.
- browser-temporal-region-art.cjs: dez tipos, aviso/ativo, 200 frames imutáveis por build, oito limites reais verificados pixel a pixel; normal/ADMIN passaram. Teste inicialmente identificou Domínio estático; acrescentada pulsação sutil no motivo central. Galeria outputs/v8-temporal-region-art.png inspecionada.
- browser-temporal-gameplay.cjs: ativa de verdade ROOM, domain, sandevistan, star; 30 frames por cena no renderer completo, sem mutação, screenshots larga/estreita. Vista larga outputs/v8-temporal-gameplay.png inspecionada. Fixture congela simulação após ativação para isolar desenho; não valida adversário humano nem toda a sequência de pulsos do Domínio.
- Suíte completa test-all.cjs passou. Nenhuma validação nova de Internet pública.

### Próximo MÉDIO
- Revisar técnicas/golpes especiais e seus efeitos restantes (roundhouse, Mikiri, lunge, feixes/raios/portais conforme necessidade). Conferir SPEC e telegraphs existentes antes de substituir, sem redesenhar o que já está bom. Depois arenas/intros do Caminho.
- Primeiro passe dos principais efeitos de controle, deslocamento, defesa, tempo e regiões realizado. Não declarar todos os visuais acabados: revisão transversal de contraste/combinações em gameplay ainda pendente.
- Textos/histórico/guia BAIXO e auditoria final EXTRA ALTO pendentes. Manter MÉDIO. V8 NÃO finalizada.

## Médio — técnicas, feixes e portais (28/09)
- v8-visuals.js: strikeEffectArt para roundhouse (arcos curtos), Mikiri (interceptação orientada), pogo (impulso no contato) e portalTransit (anéis dissipando). Só efeitos existentes; não inventa acertos/atordoamentos.
- linePowerArt: relâmpago segmentado durante parte ativa mantendo aviso tracejado; feixes com fluxo interno, núcleo/chevrons diferentes quando parryable=false; Ruyi agora desenhado como bastão extensível com faixas metálicas. Decoração recortada ao segmento de origem/destino e largura real 2*r. Repulse preserva seu fade original.
- portalArt mantém orientação, elipse 12x38 e cores dos slots, acrescentando interior escuro e arcos móveis. Não altera entrada/saída ou colisão.
- Preservados techniqueTell/techniqueTrail de lunge/iaijutsu: usam mira comprometida e pontos reais do slash, já apropriados. Não redesenhar sem evidência de problema. Poses ainda precisam de revisão transversal junto dos atores/combinações.
- Fontes diretas v8-visuals.js; normal/ADMIN reconstruídos, 22 scripts. browser-strike-power-art.cjs passou em ambos: dez variações, 240 frames por build, snapshots e Canvas preservados, limites dos cinco segmentos verificados na orientação horizontal. Galeria outputs/v8-strike-power-art.png inspecionada. Ruyi propositalmente rígido, não oscila a arma para fingir animação.
- browser-contextual-powers.cjs passou após alterações, incluindo raio real e renderer completo. Suíte completa test-all.cjs passou.

### Próximo MÉDIO — arenas e intros do Caminho
- Passe principal de efeitos agora inclui técnicas/feixes/portais. Avançar para revisão das arenas e entradas do Caminho (pathStyles/path renderer/intros), lendo SPEC e implementação atual; não continuar repetindo galerias isoladas sem necessidade.
- Auditoria visual transversal posterior ainda deve conferir contraste, poses e combinações em gameplay; testes isolados não equivalem a balanceamento humano ou Internet pública.
- Textos/histórico/guia BAIXO e auditoria final EXTRA ALTO pendentes. Manter MÉDIO; V8 NÃO finalizada.

## Médio — identidade ambiental das cinco arenas (28/09)
- v8-visuals.js: pathAtmosphere acrescenta detalhes ao detailedArena existente, sem substituir composição/paleta/geometria. Rua: cercas/caixas e flâmulas; Coliseu: braseiros com chama; Templo: pedras/jardim seco/incenso; Imperial: duas estátuas/brasões; Juízo: estátuas quebradas e inscrições pulsantes discretas.
- Elementos apenas no fundo; não entram em map.walls/platforms/decor nem física. Partículas extras e incenso omitidos em low; brilho dos braseiros também. Quantidade fixa pequena, sem criação de entidades por frame. Save/restore no helper.
- Fontes diretas, sem migração. Normal/ADMIN reconstruídos (22 scripts).
- browser-path-arena-art.cjs passou normal/ADMIN: cinco arenas, quatro qualidades, 600 frames de fundo + 100 frames no renderer completo por build, snapshots imutáveis. Galeria larga outputs/v8-path-arena-art.png inspecionada; galeria estreita também gerada (redimensionamento CSS, não nova simulação). Preservadas proporções/layout existentes. No enquadramento muito afastado da galeria, personagens do Juízo ficam pequenos/próximos das bordas: revisar câmera na auditoria transversal, não alterar física/layout por esta captura isolada.
- Suíte completa test-all.cjs passou.

### Próximo MÉDIO — apresentações do Caminho
- Revisar/aperfeiçoar intros de bosses/transições entre blocos conforme SPEC (v8-ui beginBossIntro/endIntro, path-intro CSS, estado persistido e path-watch). Ainda não alterados neste lote. Preservar pausa, botão pular para já vistos, duração e semântica de saves/watch; ler SPEC das entradas antes de mudar.
- Depois revisão visual transversal pontual de contraste/poses/combinações; não repetir todas as galerias automaticamente. Textos/histórico/guia BAIXO e auditoria final EXTRA ALTO pendentes. Manter MÉDIO. V8 NÃO finalizada.

## Médio — primeiro passe de apresentações dos bosses (28/09)
- v8-visuals.js exporta bossIntro(canvas,g,id,progress,t), com 12 vinhetas usando clones dos atores reais/equipamentos. Aranha desce por fio; Carrasco entra com pulso no chão; Espectro materializa; Artífice passa por portal/arma; Bruxa gira da inversão; Gêmeos entram dos lados; Tempo com afterimages; Domador com cão/falcão; Legião com três silhuetas; Primeiro Errante com círculo/duplicatas; Ronin eleva postura e Vampiro destaca máscara.
- É uma VINHETA no overlay, não encenação que move o boss real na arena. Não considerar toda direção cinematográfica da SPEC concluída: Ronin ainda não tem pose real ajoelhada, Carrasco não arrasta machado, Espectro não aparece atrás do jogador/câmera, áudio específico e transições de bloco ainda pendentes.
- v8-ui.js acrescenta canvas transparente à path-intro e desenho por frame; preserva duração 3200/7000 ms, semântica introCompleted/seen, pausa e skip. Spectator recebe progress normalizado e duration junto do payload intro, interpolando com relógio local; não usa until do host como relógio local. Nenhuma simulação adicional.
- v8.css acomoda canvas/títulos em viewport curto e define hidden explícito. Fontes diretas; normal/ADMIN reconstruídos, 22 scripts.
- browser-boss-intro-art.cjs: 12 encontros reais, 480 frames, snapshots imutáveis e imagem não vazia. Galeria inspecionada; corrigido alpha do ator (renderer.fighter redefine alpha): agora usa stamp intermediário e composita transparência corretamente. Teste/galeria passaram após correção.
- browser-path-save.cjs passou: intro persistida, reload recompensa e próximo nível. browser-path-watch.cjs passou RTC nativo local/sinalização fixture: espectador tardio no draft, inventário read-only, pausa, save isolado/rejoin/disconnect. NÃO cobre ainda especificamente espectador entrando no meio da nova vinheta.
- Suíte completa passou antes da correção estritamente visual do stamp; depois do stamp foi repetido teste dos 12 atores. Não há evidência nova de Internet pública.

### Próximo MÉDIO
- Terminar apresentações/transições: validar UI em viewport curto/estreito e espectador durante intro; respeitar reduced-motion; revisar encenação/áudio definidos na SPEC sem mover física real. Transição de arena nos níveis 11/21/31/41 ainda precisa de revisão/implementação (não houve mudança neste lote).
- Depois revisão visual transversal pontual; textos/histórico/guia BAIXO e auditoria final EXTRA ALTO pendentes. Manter MÉDIO. V8 NÃO finalizada.

## Médio — fluxo de intros, movimento reduzido e transição de arenas (28/09)
- bossIntro respeita prefers-reduced-motion: pose final/tempo fixo. Teste inicialmente detectou tecido mudando mesmo em t=0; reset do histórico visual no modo reduzido tornou saída estável pixel a pixel. Estado do jogo intacto.
- v8-ui: banner UM NOVO CÍRCULO + nome da arena por 1.8s ao iniciar 11/21/31/41 sem gameSave; não pausa, não repete no load. Cleanup remove; espectadores recebem duração restante usando relógio local. Sem nova fase de simulação/save.
- v8.css: oculta countdown somente enquanto intro visível (Em guarda vazava por trás); overlay acima do HUD; ajustes de canvas/título em largura <=500px e altura curta. Mantidos skip e tempos.
- browser-path-intro-flow.cjs passou após alterações: host ADMIN + watcher normal usando RTC nativo local/sinalização fixture; entra durante Primeiro Errante, desenha progresso recebido, skip oculto, save isolado, finaliza intro, banner Coliseu sincronizado e sem repetição ao carregar; testa caixas de conteúdo em 390x844 e 800x450 e reduced-motion estático. Capturas outputs/v8-intro-390.png / v8-intro-800.png. Inspeção motivou correções de countdown/z-index/mobile.
- Normal/ADMIN reconstruídos. Suíte completa passou; após ajustes finais só de CSS, repetido fluxo de intro/espectador. Internet pública não testada.

### Próximo MÉDIO
- Apresentações ainda precisam do áudio específico e revisão das poses encenadas versus SPEC (Ronin levantar, Carrasco arrastar, etc.). As vinhetas atuais são primeiro passe em overlay; não declarar direção cinematográfica totalmente concluída.
- Depois revisão visual transversal pontual, textos/histórico/guia BAIXO e auditoria final EXTRA ALTO. Manter MÉDIO; V8 NÃO finalizada.

## Médio — poses e sinais sonoros de entrada (28/09)
- bossIntro actor aceita overrides só no clone. Ronin usa visualCrouch/visualLean e mudança de mira para erguer corpo/arma, substituindo encolhimento uniforme. Carrasco entra andando com machado baixo e o eleva gradualmente. Nenhuma alteração de posição/estado real.
- DuelAudio.prototype.pathIntro definido na fonte direta v8-visuals.js, reutilizando tone/noise/master/mute do áudio existente, sem editar audio.js gerado. Doze perfis breves distintos, volumes contidos e até três cues (2%,32%,72%). Não são músicas novas; validação foi técnica, sem audição humana.
- v8-ui introSound dispara cada cue uma vez por apresentação; se espectador entra depois da janela, não reproduz cues antigos. Sem timers externos que continuem após skip/saída. Controle de mute e áudio ainda bloqueado respeitados.
- Normal/ADMIN reconstruídos, 22 scripts. browser-boss-intro-art.cjs passou: 480 frames/12 encontros imutáveis, galeria atualizada/inspecionada, 12 assinaturas sonoras distintas e gates mute/contexto. browser-path-intro-flow.cjs passou após acrescentar verificação dos três cues do host exatamente uma vez e ausência de duplicatas no espectador tardio. Suíte completa passou.

### Próximo MÉDIO — revisão visual transversal
- Primeiro passe de apresentações/áudio/transições existe. Conferir poucos casos reais de contraste e sobreposição com poderes/builds e câmera do Juízo. Não gastar outra rodada repetindo todas as galerias isoladas sem mudança.
- Ainda há distância entre vinheta e direção cinematográfica literal da SPEC: Espectro não surge atrás do jogador com câmera, Ronin agacha em vez de ajoelhar com pose dedicada, Carrasco baixa arma mas sem contato físico de arrasto; vinhetas ficam no overlay. Avaliar/fechar essas lacunas conscientemente antes de declarar visuais prontos.
- Textos/histórico/guia BAIXO e auditoria final EXTRA ALTO pendentes. Manter MÉDIO por enquanto. V8 NÃO finalizada. Internet pública e avaliação sonora humana não realizadas.

## Médio — revisão integrada e correção de enquadramento (28/09)
- Encontrado bug real no Caminho: renderer usava viewWidth/viewHeight incluindo áreas fora do clip 1280x720 em canvas com outra proporção. Teste reproduziu pés cortados no Coliseu em 390x420 (bottom=739 >720); galeria anterior indicava também extremos no Juízo.
- Corrigido na FONTE GERADORA integrate.cjs: câmera das arenas path_ usa min(viewWidth,1280)/min(viewHeight,720) para zoom, half-width e limite vertical. Demais mapas/Parkour mantêm fórmulas anteriores. Não altera física/mapa/spawn. Rodados integrate e build; não editar renderer.js gerado.
- browser-path-camera.cjs falhou antes e passou depois: 12 cenários = Coliseu/Juízo x 1280x720,720x300,390x420 x normal/immersivo. Verifica corpo inteiro dentro da interseção viewport/clip e snapshot imutável; outputs/v8-path-camera.png inspecionada.
- browser-path-mixed-art.cjs: ROOM/Domínio/desaceleração/tempo parado em quatro arenas reais com mirrorcloak+crystal e adversário com Legião. Geometria preservada, posições agrupadas no chão para revisão de leitura; 30 frames imutáveis por cena. Captura larga outputs/v8-path-mixed-gameplay.png inspecionada, estreita também gerada. São cenas controladas, não partida humana completa.
- Normal/ADMIN reconstruídos, suíte completa test-all.cjs passou, 22 scripts válidos.

### Próximo MÉDIO
- Fechar lacunas de direção das entradas em vez de repetir galerias: especialmente Espectro aparecendo atrás do jogador (hoje só materializa no centro da vinheta). Ronin agora agacha/ergue, Carrasco arma baixa; vinhetas permanecem em overlay e não movem física real.
- Revisão de contraste integrada já feita em quatro cenas; refinar apenas com problema demonstrável. Depois passar textos/histórico/guia para BAIXO e auditoria final EXTRA ALTO. Manter MÉDIO até fechar direção visual restante. V8 NÃO finalizada. Não afirmar Internet pública/balanceamento humano testados.

## Médio — solicitação de limites laterais + Espectro (28/09)
- Pedido novo do usuário: revisar paredes de TODAS as arenas do Caminho; manter o que já funciona, só reforçar leitura se fraca. As cinco já tinham dois retângulos físicos laterais; nenhuma geometria/tamanho/posição alterada.
- browser-path-boundaries.cjs verifica as dez laterais: collideWalls barra avanço pelo interior e retorna wallSide correto; step com jump em contato dispara wallJump. Normal e ADMIN passaram. Render imutável.
- Inspeção mostrou colunas legíveis mas todas com acabamento genérico. v8-visuals.js envolve drawWalls apenas para path_: detalhes recortados ao retângulo físico, preservando topo/contorno. Rua madeira/cintas/rebites, Coliseu juntas de pedra, Templo pilar verde com faixas, Imperial estrias/brasão, Juízo inscrições/fissura. Dois contornos verticais alinhados à colisão, sem ampliar decoração para fora das faces. Galeria outputs/v8-path-boundaries.png inspecionada antes/depois.
- Continuação autorizada: intro do Espectro agora inclui clone do Errante olhando para frente e Espectro materializando atrás após breve espera; pequeno pan LOCAL da vinheta. Não teleporta jogador/boss real, preserva input/snapshot. Galeria dos 12 bosses e 480 frames imutáveis passou/inspecionada.
- Normal/ADMIN reconstruídos, 22 scripts cada; suíte completa passou.

### Passagem de etapa — próximo BAIXO
- Primeiro passe MÉDIO de arte/UI, equipamentos, invocações, poderes/técnicas, arenas, entradas/sons e revisão integrada encerrado para avançar aos textos. Pode avisar usuário para trocar a BAIXO: textos/histórico/guia da V8 e revisão de rótulos/coerência das instruções. Não alterar catálogo congelado de 115 entradas/regerar migrations; explicações complementares em v8-detail.js/L.helpText.
- Ainda não é entrega final. Depois BAIXO, pedir EXTRA ALTO para auditoria transversal da SPEC, gaps, regressões, visual/gameplay/online. Entradas são vinhetas sobrepostas com poses procedurais, não cutscenes físicas; auditoria deve avaliar se falta direção adicional. Áudio sem audição humana, Internet pública e balanceamento humano não testados.
- Não repetir todas as galerias automaticamente. Work checkpoint atual, nenhuma sessão de teste pendente. V8 NÃO finalizada.

## Limites fechados do Caminho + início dos textos (28/09)
- Usuário confirmou que não deve ser possível saltar sobre as paredes laterais e pediu continuar depois. Implementado em upgrade-core.cjs/engine.js: sealPathMap preserva faces internas, prolonga paredes para cima, preenche faixa externa até borda do mapa e move wallTop para fora da área jogável SEM remover índices de plataformas.
- collideWalls contém x independentemente de altura; fase espectral não ignora laterais do Caminho. path.js faz contenção após step para deslocamentos diretos/voo ADMIN. legacy-combat.js valida destinos de Blink/troca/portais dentro das faces internas e sela mapa em loadSnapshot. Outros modos preservados.
- v8-visuals recorta paredes longas à janela visível antes do desenho e dos detalhes, preservando cinco acabamentos sem percorrer milhões de unidades. Galeria de paredes inspecionada; faces continuam visualmente para cima.
- path-boundary-test.cjs incluído na suíte: 30 combinações (5 arenas x 3 escalas x 2 lados), alturas extremas, movimento/fase, dash, contato de wall jump, Blink/destinos inválidos, voo ADMIN, reconstrução de save e migração preservando índices. Passou. Fixture de contato corrigida para raio exato; snapshot reconstrói por mapId, não salva map completo.
- browser-path-boundaries passou normal e ADMIN durante implementação; browser-path-save passou após contenção final. Suíte completa passou após código e novamente após regeneração da integração/textos. Normal e ADMIN: 22 scripts válidos.
- Iniciado bloco de textos: README antes era cópia V7.2, agora descreve V8, fontes/geradores e testes reais. Criado outputs/LEIA-ME-V8.md com controles conferidos no controls.js, run, saves, espectadores, laboratório e ADMIN. Histórico no GERADOR integrate.cjs expandido, mantendo aviso em desenvolvimento. Corrigido SORTear para SORTEAR em v8-ui.js. integrate/build executados.

### Próximo
- Continuar revisão BAIXO dos textos de cartas/instruções versus implementação e SPEC; guia é primeiro passe, não revisão textual completa. Catálogo congelado: complementos em v8-detail.js/L.helpText.
- Depois pedir EXTRA ALTO para auditoria final transversal e entrega. V8 NÃO concluída. Internet pública, controle físico, balanceamento humano e audição humana permanecem sem validação. Vinhetas procedurais em overlay ainda exigem avaliação final de direção versus SPEC.
- Nenhuma sessão de teste pendente ao encerrar este checkpoint.

## Baixo — descrições para o jogador e revisão textual (28/09)
- Revisadas as 115 descrições do catálogo: antes a UI mostrava bullets da SPEC e instruções de implementação (NÃO usar versão antiga, parryable, etc.). Catálogo congelado preservado. v8-detail.js agora define L.descriptionText para os 115 IDs e L.describe une descrição + helpText.
- Textos descrevem gestos, limites, usos e contrapartidas sem mudar combate. Conferidos pontos sensíveis no código: Orbe consome ao olhar, Anel não devolve usos limitados, ROOM exige ambos na área/destinos livres, marca retorna em quatro segundos, dashcancel só após início do recovery, recuo na preparação, voo selecionável e paredes do Caminho. Armas/companheiros/poderes restantes receberam resumo a partir da SPEC e implementação existente; auditoria final deve confrontar efeitos de ponta a ponta, sem considerar a reescrita prova de balanceamento.
- v8-ui usa L.describe tanto nas cartas (inventário, laboratório, draft/prévia) quanto na busca. Evita busca só nos textos antigos invisíveis. Corrigido comando de gravação PowerShell após erro de binding usando LiteralPath explícito; build final contém integração correta.
- browser-copy-check.cjs passou normal/ADMIN: todos os 115 IDs cobertos, sem IDs extras, inventário abre, busca pela descrição visível encontra ROOM/Orbe, carta cabe em 390px. Captura outputs/v8-copy-mobile.png com Orbe visível inspecionada: texto legível e sem corte horizontal.
- Normal/ADMIN reconstruídos. Suíte completa passou após alterações, 22 scripts válidos em cada HTML. Guia e histórico haviam sido atualizados no lote anterior; README complementado com localização da camada de texto.

### Passagem de etapa — próximo EXTRA ALTO
- Bloco BAIXO de textos/histórico/guia encerrado como primeiro passe. Avisar usuário para trocar a EXTRA ALTO para auditoria final transversal SPEC x implementação, gaps mecânicos/apresentação, regressões, saves/replay, grupos, online/espectadores e entrega.
- V8 NÃO concluída. Não declarar Internet pública, balanceamento humano, controle físico ou audição humana testados. Entradas em vinhetas procedurais sobrepostas ainda precisam julgamento final versus direção literal da SPEC.
- Não rerodar todas as galerias sem mudança. Auditar primeiro escopo e lacunas com evidência; priorizar testes que preencham evidência faltante. Nenhuma sessão de teste pendente.

## Auditoria final — progressão, resultados e regressões (28/09)
- Continuação autorizada pelo usuário após etapa BAIXO. Este bloco registra também o trabalho da auditoria interrompida antes de atualizar este arquivo.
- path.js: pathStats no próprio jogo conta cada inimigo morto e cada morte do jogador, mais um duelo por resolução. Antes a UI só contava o evento kill que encerrava o duelo, perdendo eliminações intermediárias de grupo. Snapshot carrega os contadores; Anel restaura o estado anterior. Run.reward incorpora totais uma única vez.
- Resultado em v8-ui.js/v8.css: tempo, duelos, mortes, inimigos, build final, bosses enfrentados/derrotados e recordes. Saves.history normaliza recordes; vitórias idempotentes por run, melhor nível e menor tempo vitorioso. Não há bônus permanente. Espectador recebe recordes do anfitrião sem gravá-los localmente.
- Corrigidos dois fluxos: save malformado não bloqueia NOVA RUN; resultado do espectador fecha quando ADMIN anfitrião usa retry.
- legacies.js: Coroa/Contrato não entram em drafts sem miniboss futuro, inclusive nível >=45. Run.pick remove opções de roubo da Coroa que já entraram na build pela escolha normal.
- integrate.cjs e tournament.js: arenas path não vazam para o torneio comum. Gerador corrigido, não só app.js resultante.
- Cartas mostram cooldown/limite via L.usageText. Ativos sem binding mostram SEM TECLA · MAPEAR.
- path-outcome-test.cjs: sete grupos passaram, incluindo contadores, rewind, save, registros terminais, elegibilidade e duplicata da Coroa.
- browser-path-outcome.cjs passou normal/ADMIN, derrota em grupo, vitória final, retry com espectador RTC, recordes isolados e layout estreito. Capturas outputs/v8-path-victory-mobile.png / v8-path-defeat-mobile.png.
- browser-tournament-v8.cjs passou: bracket quatro participantes, drafts, reset da build entre confrontos, arenas filtradas e pódio/classificação.
- path-endurance-test.cjs passou: 12 bosses x30s simulados, alvo programado independente, ações ofensivas, estado finito e continuação determinística de snapshot. É estabilidade/comportamento, não avaliação humana de dificuldade.
- browser-online-v8.cjs e browser-legacy-replay.cjs passaram: draft privado/ADMIN/espectador/desconexão e isolamento do laboratório/replay.
- Corrigidas URLs de testes herdados que ainda apontavam para V7.2: browser-file, browser-v72, browser-features, browser-crowd e browser-latejoin. Agora executam a V8; scripts herdados não adaptados não contam como evidência.
- browser-crowd passou nas duas variantes: oito corredores (--race), incluindo ADMIN visitante e DNF; dois duelistas/seis espectadores, assentos e revanche. browser-latejoin passou com mapa customizado/imagem/noite, entrada tardia, timeout do especial e pause/step/tempo ADMIN. Sinalização fixture e RTC nativo local.
- browser-features passou: Parkour local/split-screen, gamepad simulado, editor/teste/retorno, ADMIN e treino. browser-copy-check passou: 115 descrições, busca normal/ADMIN e mobile.

## Auditoria final — carga, legibilidade e progressão completa (28/09)
- browser-late-game-stress.cjs criado: build de 33 Legados, três inimigos normais de nível46, 15s a 240Hz, 14 ativações e até20 entidades. Suprime somente resolução fatal para sustentar o teste; não avalia proteção/morte nesse fixture. Uma segunda simulação sem renderizar recebe as mesmas entradas e permanece idêntica.
- Primeiro fixture tentava invencibilidade ADMIN em slots2/3, não suportados pelo sanitizador padrão. Corrigido o fixture para suprimir resolução fatal igualmente nas duas instâncias. Não confundir essa falha inicial de fixture com divergência real do renderer.
- Histórico máximo de clones:59 amostras; payload de espectador máximo ~122KB, sem duplicata do snapshot inicial do duelo. Carga limitada pelo comportamento normal, sem truncar mecânicas para ganhar FPS. Baixo/alto/ultra preservaram snapshot.
- Captura integrada revelou invocações sobrepondo o corpo do Errante. v8-visuals.js agora desenha corpos de companions após cenário/iluminação e antes dos combatentes; projéteis, cortes, escudos e avisos seguem na frente. Duas passagens só de desenho; não altera entidade/colisão/IA.
- Repetido stress após ajuste: passou. outputs/v8-late-game-stress.png inspecionada antes/depois; json registra medidas. Nesta máquina headless: render p50 ~8,8ms/p95 ~13,3ms durante simulação; cenário fixo alto p95~10,9ms, ultra~12ms. NÃO equivale a benchmark de FPS/GPU nem garantia em outro PC.
- path-full-run-test.cjs: oito seeds, cinquenta níveis cada, 150 duelos/run, 26 recompensas, persistência/reload entre pontos e escolhas, cinco bosses sem repetição e recorde de vitória. Contabiliza282–285 inimigos conforme Gêmeos. Golpes fatais forçados com proteções inimigas removidas; valida progressão, não dificuldade.

## Entrega V8 — implementação e auditoria local encerradas (28/09)
- V8 passa a release8; removido aviso de desenvolvimento do histórico/guia. Histórico descreve Caminho, catálogo, IA, arenas, espectadores, laboratório, recordes e integração dos modos. Versões V7.2 preservadas.
- README atualizado e AUDIT-V8.md consolida escopo, evidências e limites. outputs/LEIA-ME-V8.md explica controles, usos por duelo/partida/run, troca de arma, atalhos, espectadores e ADMIN.
- Entradas adotadas como vinhetas procedurais sobrepostas: preservam física e duração; incluem encenação do Espectro atrás do Errante, postura do Ronin, arma pesada do Carrasco e assinaturas dos demais. Não são cutscenes que movem corpos reais. Esta é a apresentação entregue, não uma tarefa oculta pendente.
- integrate.cjs e build.cjs executados após atualizar release/histórico. Normal/ADMIN reconstruídos, cada um com22 scripts válidos.
- Suíte completa test-all.cjs passou na build final, incluindo os novos testes de resultado, progressão completa e resistência dos bosses.
- Repetidos após geração final: browser-file (normal/ADMIN file://), browser-v72 (chuva/seleção/controles/treino) e browser-path-outcome (resultado normal/ADMIN + RTC). Todos passaram.
- Nenhum bloqueio reproduzido permanece aberto nesta auditoria. Internet pública entre PCs distintos, controle físico, sensação/balanceamento humano e audição humana permanecem NÃO verificados; documentados na entrega, sem promessa de ausência absoluta de bugs.
- Não há sessão de teste em andamento. Servidor4189 permanece disponível para o usuário. Nenhum commit/deploy realizado.
