# Visão geral da V8

UM CORTE é um jogo 2D lateral de morte em um golpe limpo. Não há HP oculto em lutadores. Proteções explícitas (especial do Cavaleiro, Legados de sobrevivência, ADMIN) podem impedir um evento letal; isso não equivale a reduzir uma barra de vida. Chutes e alguns poderes empurram sem matar diretamente; quedas continuam letais.

## Modos

| Modo | Comportamento atual |
|---|---|
| PvE | Um jogador contra IA; regras, arena, classes, skins e dificuldade configuráveis |
| Local | Dois jogadores, teclado/mouse e controle |
| Online | Sala PeerJS de até oito pessoas; duelo de dois combatentes e espectadores; revanche volta à seleção |
| Treino | Boneco configurável, resets rápidos, posições salvas, velocidade, colisões e laboratório de Legados |
| Torneio | Eliminatório contra IA, personagem fixo até o fim, escolha/fixação/sorteio de arenas, pódio sem timeout e classificação |
| Parkour | Corrida com checkpoints, ranking por progresso, classes opcionais, até oito participantes online; local com duas câmeras |
| Caminho do Guerreiro | Run solo de 50 confrontos, Errante e build de Legados; amigos podem assistir, sem controlar a run |

Um duelo concede ponto. Primeiro a cinco por padrão encerra uma partida comum; Caminho usa primeiro a três. Empates não concedem ponto. O intervalo comum entre duelos é curto; só o último golpe tem finalização de partida. Entradas, explicações de especiais, Caos e apresentações de boss têm fases próprias.

## Personagens e combate

Oito classes: Cavaleiro, Lanceiro, Assassino, Espadachim, Ceifador, Pugilista, Duelista e Monge (`staff`, antigo nome Bastonista). Corredor é o padrão de Parkour. Errante é um fighter com flag `wanderer`, não uma nona entrada de CLASSES; usa Legados para construir sua identidade.

Movimento inclui W/Espaço, salto variável, segundo salto, coyote time, buffer, air dash direcional independente da mira, slide, wall slide/jump e fast fall. O ataque fixa sua mira na preparação; o slash é área real de colisão. Pode atacar no dash. Parry atualmente protege um **lado**, não exige escolher alto/baixo; essas alturas continuam orientando animação. Perfect Parry usa o início da janela, sem bônus base de dano. Finta é cancelamento com recuperação, não defesa instantânea.

Especiais ligados por padrão, recarga sete segundos, carga preservada entre duelos por padrão. Os efeitos temporários não persistem. No Caminho os especiais de classe e Caos são desligados por construção da Run.

## Sistemas transversais

Legados são itens únicos divididos em armas, vestimentas, relíquias, técnicas, invocações e poderes. Podem alterar regras explicitamente. Drafts, binds próprios, usos por duelo/partida/run e transformações são parte do estado mecânico. Fora do Caminho existe seleção de Legados por partida/duelo, além do laboratório. Parkour não recebe esse draft.

Mapas customizados são documentos JSON validados, com plataformas, paredes, objetos, imagens incorporadas e configuração de corrida. O editor salva/exporta/importa/testa; não usa banco de dados remoto. Presets de regras também podem ser nomeados e exportados/importados.

Replay retém os últimos frames e permite assistir ou tentar uma resposta alternativa. Estatísticas da sessão e prêmios são locais à sessão, sem ranking de contas. Caos sorteia um modificador temporário por duelo; Ultra acumula modificadores compatíveis. Configuração gráfica possui Baixo/Médio/Alto/Ultra e sombras independentes.

ADMIN é uma edição separada com painel `*`, inspeção e mudanças em tempo real, laboratório e controle do Caminho. É ferramenta de desenvolvimento/partidas de confiança; não é autenticação por IP. Persistência principal: run/histórico no navegador, controles, gráficos, presets e arquivos de mapas. Consulte SAVE_AND_STATE antes de mudar qualquer formato.
