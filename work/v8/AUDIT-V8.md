# Auditoria da entrega V8

Data: 28/09/2026. Fontes preservadas da V7.2; alterações em work/v8. Arquivos de jogo: outputs/um-corte-v8.html e outputs/um-corte-v8-admin.html. Relatório atualizado ao concluir os testes finais.

## Escopo implementado

- Caminho solo de 50 níveis, primeiro a 3 por padrão, com encontros em grupo, minibosses, 12 bosses possíveis e um chefe final fixo.
- 115 Legados: 15 armas, 17 vestimentas, 21 relíquias, 18 técnicas, 22 invocações e 22 poderes. Catálogo, ícones, equipamento/efeitos visuais, inventário, usos e remapeamento.
- Motor de combate compartilhado entre modos; draft opcional no PvE, local, online e torneio. Laboratório no treino e controles adicionais na edição ADMIN.
- IA reage a observações atrasadas, navega com a movimentação existente e utiliza habilidades/contexto de perigo. Builds dos bosses permanecem fixas.
- Cinco arenas exclusivas com paredes laterais físicas contínuas, visuais próprios, entradas de bosses e transições de ambiente.
- Continuação local, escolhas persistidas, resultado com build/estatísticas e recordes sem progressão permanente de atributos.
- Amigos como espectadores do Caminho, sem comandos de combate/administração e sem gravação da run no navegador do visitante.
- Slash V8 e corrida do Corredor; física/tempos não dependem da qualidade gráfica.

## Evidências

| Área | Verificação |
| --- | --- |
| Regressões do motor | test-all.cjs: testes herdados V4.2–V7.2, controles, salas, torneio e grupos V8. Cada execução grava um log em outputs. |
| Legados | Suites legacy-*.cjs cobrem armas, colisões, defesa, projéteis, invocações, poderes, recursos, técnicas, voo/inversão, transformações e combinações. |
| Progressão | path-full-run-test.cjs: oito seeds atravessam os 50 níveis, 150 duelos por run, 26 recompensas, continuidade entre pontos e escolhas, cinco bosses e registro terminal. Golpes fatais são forçados por fixture; não é teste humano de dificuldade. |
| Bosses | path-endurance-test.cjs: 30 segundos por cada um dos 12 bosses contra movimento programado, seguidos de continuação determinística de snapshot. |
| Resultado | path-outcome-test.cjs e browser-path-outcome.cjs: contagem de grupos, Anel, recordes idempotentes, vitória/derrota normal/ADMIN, retry, espectador e tela estreita. |
| Saves | legacy-save-test.cjs e browser-path-save.cjs: posições seguras, score/build, intro vista, recompensa pendente, reload, invalidação após derrota e falha de armazenamento. |
| Online V8 | browser-online-v8.cjs: draft privado, confirmação, sincronização, ADMIN visitante e desconexão. |
| Até oito clientes | browser-crowd.cjs: duelo com espectadores, troca de assentos e revanche; --race: oito corredores, pausa sincronizada, ADMIN visitante e DNF por desconexão. |
| Entrada tardia | browser-latejoin.cjs: mapa customizado com imagem, noite, espectador tardio, prazo da explicação do especial, pausa/step/tempo ADMIN. |
| Espectador do Caminho | browser-path-watch.cjs e browser-path-intro-flow.cjs: combate/draft/inventário, reentrada, isolamento de save, intro em andamento e transição de arena. |
| Módulos antigos | browser-features.cjs: Parkour local em split-screen, controle simulado, edição/teste de pista, ADMIN e treino. browser-legacy-replay.cjs: laboratório/replay sem contaminar combate original. |
| Arquivos diretos | browser-file.cjs: normal/ADMIN por file://, scripts carregados, movimento e double jump. |
| Menu/movimento | browser-v72.cjs, agora direcionado à V8: chuva em três resoluções, corte/click, Corredor/elenco, prioridade W + dash e treino. |
| UI | browser-copy-check.cjs: 115 textos, busca na descrição visível, normal/ADMIN e viewport estreito. |
| Paredes/câmera | path-boundary-test.cjs, browser-path-boundaries.cjs e browser-path-camera.cjs: cinco arenas, escalas/alturas, colisão, wall jump, teleporte/fase, save e 12 enquadramentos. |
| Apresentação | Galerias browser-*-art.cjs de ícones, equipamentos, summons, poderes, técnicas, arenas e 12 entradas. Inspeção de imagens e checagem de estado imutável. |
| Carga integrada | browser-late-game-stress.cjs: 33 Legados, três adversários com IA, 15 segundos simulados, 14 ativações, até 20 entidades; renderização em baixo/alto/ultra. Simulação renderizada igual à continuação sem renderização. |

## Ajustes encontrados na auditoria final

- Mortes em encontros de grupo passaram a contar cada inimigo; o duelo continua contando uma única vez. Anel restaura os contadores do início do ponto.
- Resultado final apresenta estatísticas, build, bosses e recordes locais. Espectadores recebem os recordes do anfitrião; o overlay fecha quando ele usa retry ADMIN.
- Save local malformado não impede iniciar explicitamente uma nova run.
- Coroa/Contrato deixam de aparecer quando não existe mais miniboss futuro. Coroa não oferece novamente um item já recebido na escolha normal.
- Arenas exclusivas do Caminho saíram do sorteio do torneio comum.
- Corpos das invocações agora são desenhados atrás dos combatentes. Ataques, escudos e avisos permanecem na frente; nenhuma entidade ou colisão foi removida para ganhar desempenho.
- Scripts herdados de navegador foram corrigidos para testar a URL da V8; executar testes apontados para a V7.2 não seria evidência da versão atual.

## Limites da validação

- RTC usa conexões nativas entre navegadores locais e sinalização de teste. Não houve teste entre PCs em redes públicas distintas nem avaliação de latência real da Internet.
- Controle físico, balanceamento jogado por pessoas e audição humana dos sons não foram verificados. O controle dos testes é simulado.
- Tempos do Chrome headless medem custo de execução local; não representam FPS garantido nem comparação entre GPUs. Dados em outputs/v8-late-game-stress.json.
- Entradas são vinhetas animadas sobrepostas, com poses procedurais. Não são cutscenes que deslocam personagens físicos na arena.
- Testes cobrem cenários e combinações descritos, não todas as combinações possíveis de 115 Legados. Não há promessa de ausência absoluta de bugs.

Não há bloqueio conhecido reproduzido e sem correção nesta auditoria. Ajustes de sensação/balanceamento podem seguir o playtest do usuário.
