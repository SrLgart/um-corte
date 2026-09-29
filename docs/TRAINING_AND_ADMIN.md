# Treino, ADMIN e laboratório

## Treino comum

`lab.js` conserva checkpoint, dummy config e replay. Painel de ajustes só abre sob comando. Movimento do boneco: parado, esquerda, direita, aproximar, recuar, patrulhar. Mira: seguir jogador, direita/esquerda/cima/baixo. Ação: idle, ataque, parry, parry constante, finta, alternar ataque/parry, chute. Intervalos independentes de ataque/parry, variação aleatória e velocidade de simulação.

Parry constante é ferramenta de teste: força idle/cooldown pronto fora de stun/push/clash; não é comportamento legal padrão de PvP. Salvar posição exige fighters vivos/playing, limpa velocidades/ações/cooldowns e especiais no checkpoint. R restaura. Morte não encerra treino nem acumula placar competitivo. Hitboxes e avanço de quadro ajudam verificar fase/contato.

Replay: assistir, buscar frame, velocidade, tentar outra resposta e repetir. Tentativa usa snapshot de início escolhido e comandos gravados por subpasso; rival não ganha nova inteligência reativa. `patchLegacy/patchAdmin` atualizam checkpoint para R não descartar alterações de laboratório.

## Inventário e Legacy Lab

TAB abre painel; modo offline pausa, online não pausa a sala. Busca por nome/efeito, filtros categoria/raridade e escolha de combatente. Arma, gesto de voo, alvo do D6 e destino do D20 são escolhas normais de inventário. Binds próprios podem ser alterados com detecção de conflito com controles base; primeiro ativo recebe Digit1, depois próximos até9. Ativos adicionais exigem mapeamento manual.

Laboratório disponível no treino e ADMIN: adicionar/remover, limpar build, randomizar quantidade de itens únicos com filtros, recarregar/resetar usos. Ações por item incluem ready, consume, restore, spawn/despawn de summon. Randomize adiciona, não necessariamente substitui a build inteira; removeTodos é separado. Spawn não ressuscita automaticamente um slot da Legião ainda marcado fallen sem reset correspondente.

`L.validEdit/applyEdit` em legacy-online.js são o contrato comum usado tanto offline quanto online. `despawn` solta armas de carriers removidos. Filtros e IDs são validados. Ajustes no Caminho geram checkpoint/save; espectador nunca edita.

## Painel ADMIN `*`

Só a edição ADMIN inclui UI. Tecla asterisco ou NumpadMultiply, ignorada dentro de campos de texto. Botões principais no topo: aplicar, pausar/retomar, avançar um frame pausado, refill, reset e carregar padrões no formulário. Carregar padrões não aplica sozinho.

Regras experimentais admitem valores maiores que limites da UI comum, mas ainda exigem finitos e mínimos válidos. Não há promessa de estabilidade física/performance para valor arbitrário enorme. Controle de tempo de simulação separado de attackSpeed. Troca de atores/classe/skin/cor sem reiniciar partida usa caminho próprio; troca de mapa/regras pode reconstruir arena/rodada preservando score conforme adminApply. Inspeção por ator: bodyScale, attackScale, invincible, fly. Invencibilidade resgata de queda; voo ainda respeita contenção final do Caminho.

Overlays: corpos, slash/clash, guarda, geometria, spawns, mira/dash/velocidade, projéteis, timers e decisão IA. Previews de animação/Perfect/finalização exigem simulação pausada e não concedem efeito mecânico. No online, alterações e pausa são ops sincronizadas, independente de quem criou sala.

**Limite:** cleanAdminOptions normaliza dois slots [0,1]. Não descreva esse painel base como editor ilimitado de todos os quatro atores do Caminho. Legacy Lab tem seletor de todos os fighters existentes; são superfícies diferentes. Parkour possui extensão `admin-race.js` própria.

## Debug V8

- Seed inteira 0..4294967295: substitui RNG da simulação; no Caminho atualiza RNG/seed da run via integração.
- D20 fixo0..20: zero aleatório,1..20 força face; não muda por si só alvo character/draft.
- Forçar Pedra Filosofal: chama transformação com critérios reais (item elegível, categoria/raridade superior), pode falhar sem candidato; não inventa resultado impossível.
- Dificuldade: aplica e remove brains para recalcular observações/política.
- Prévia de draft normal/miniboss/boss: seed e filtros, não consome inventário/RNG real nem avança run; clicar adiciona à build.
- Caminho: nível1..50, arena, boss, miniboss e dificuldade; debugEncounter limpa draft/save/resultado atual e reconstrói encontro com build atual. Não usar como prova de progressão natural.
- Retry de derrota: entryInventory do confronto. Não volta ao começo de toda run nem concede novo item de recompensa.

## Roteiro de reprodução para redesign futuro

Abra ADMIN, inicie treino, pause, escolha ator e fundo, adicione os itens desejados no TAB, fixe seed/face e salve posição. Use overlay e quadro a quadro para separar pose de contato real. Para boss, inicie Caminho e selecione encontro no debug; registre seed/build/mapa/regras e screenshot. Para comparar com V8 congelada, abra os HTMLs do archive em contexto de navegador separado para não misturar save.
