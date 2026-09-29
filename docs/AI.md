# IA

Fontes: `engine.js` (`getAIPolicy`, `updateAI`, `navigateAI`, `nextPlatform` e wrappers posteriores), `path.js` (`L.ai`, `legacyIntent`, `observeZones`, `avoidZones`, `navigationFrame`), `parkour.js` (Race), `legacy-combat.js` (companions).

## Políticas

| Dificuldade | Reação configurada (ms) | Probabilidade parry / ataque |
|---|---|---|
| Fácil | 260–400 | 0,24 / 0,48 |
| Normal | 160–260 | 0,57 / 0,72 |
| Adaptativo | 150–250 | 0,53 / 0,68, ajustados por hábitos |
| Difícil (`hard`, V8) | 120–200 | 0,73 / 0,85 |
| Mestre | 85–120 | 0,94 / 0,98 |
| Impossível | 5–18 | 1 / 0,96 |

Valores não são taxa garantida de bloqueio: posicionamento, estado, contato, erros sorteados e janelas continuam valendo. Os nomes Mestre/Impossível não estabelecem ordenação matemática de força. IA base inclui previsão especial no Impossível; a IA V8 não reutiliza todos os ramos da IA base.

## IA genérica e caminho V8

Sem legacyEnabled/pathEncounter, motor usa updateAI herdado e suas extensões. Com V8, `L.ai` substitui os inputs dos inimigos. Cada brain retém até32 observações, amostradas com intervalo maior que25 ms. Sorteia reação por brain e consulta a última observação anterior a now−reaction. Extrapola posição usando velocidade observada × reação ×0,65. Não lê comandos futuros do jogador.

Distância usa centros/posições observadas e alcance da arma. Armas de tiro usam distância desejada480, Bacamarte150. Mantém espaço, recua dentro do alcance mínimo, provoca aproximações e tenta punir recovery/parryRecovery/stunned/feintRecovery. Parry é tentativa quando observa active ameaçador e o sorteio da reação permite; Perfect acontece se o contato cair no início da janela, não é garantia de um ramo “sempre perfect”. Evita atacar guarda frontal; pode fintar startup contra parry em dificuldade avançada.

Política adaptativa conta ataques/parries/erros/recuo da partida (`habits`); ajusta defesa, bait/punição. Não há aprendizado persistente ou modelo treinado. Oponentes V8 usam decisões de 220–520 ms e tentativas de poder a cada450–900 ms, além de timers de ataque/jump.

## Navegação e ameaças

`nextPlatform` procura rota de apoios por custos, altura, gravidade, velocidade e alcance dos dois pulos. `navigateAI` escolhe lançamento, corrige horizontal no ar, usa double jump perto do ápice e desce plataformas não sólidas. IA avançada usa wall jump, air dash vertical/diagonal e fast fall. Não ignora custos/cargas do personagem.

`L.navigate` cria uma visão de mapa no referencial de gravidade do ator; não confunde teto/chão invertidos. Cache é por decisão para não reaproveitar plataformas móveis/desabadas ou faces invertidas. Checagem de apoio evita andar cegamente para buracos. Arma perdida muda objetivo para recuperar.

Observa até oito projéteis letais hostis próximos (500 unidades), diferenciando zonas e fases de Hunter/SlimeKing; tenta parry ou salto conforme trajetória. `observeZones/avoidZones` considera área e aviso de perigos para desviar/escapar. Isso é heurística local, não solver perfeito de toda sequência futura.

## Grupos, estilos e bosses

No Caminho, inimigos sempre têm jogador0 como alvo hostil. A partir do segundo inimigo, alterna papéis em ciclos de aproximadamente quatro segundos: flanquear/saltar ou recuar para não ocupar todos o mesmo espaço. Não são três IAs coordenadas por planejamento global.

**Limitação confirmada:** somente `style==='patient'` tem desvio explícito no controlador V8, ampliando targetRange de 82% para95% do alcance. Labels aggressive/flank/ranged/aerial/heavy/tools/twins/master identificam intenção e builds, mas não correspondem cada um a uma árvore exclusiva. Diferença prática dos bosses vem principalmente de classe, equipamentos, poderes, dificuldade e número de inimigos. Não atribuir “IA exclusiva de boss” sem um ramo real.

## Legados e companheiros

Uso ativo considera distância/ameaça/contexto: barreira/névoa defensivas, projéteis e invocações à distância, ROOM perto, portal com superfície, gelo e fogo com mira apropriada, Kamehameha com manutenção de tecla. `legacyIntent` gerencia arma carregável, técnicas, voo, troca de gravidade e recuperação de arma. `avoidZones` vem depois para corrigir comando inseguro. Não usa ativamente toda relíquia de sorte de maneira estratégica; builds automáticas já excluem várias.

Companions têm controladores próprios: summons físicos seguem apoios, skeleton/servo usam sequência de ataque, doppel histórico atrasado, spectral flanqueamento, legion papéis, hunter presa, mahoraga memória de front/ranged/air por partida. Memória de Mahoraga aprende após duas observações por categoria; não concede invulnerabilidade universal.

## Parkour

Race usa rotas/checkpoints e grafo de plataformas próprios, tolerâncias de gaps/subida/descida e custo extra de móveis/frágeis. Tenta rotas sem móveis primeiro, depois com elas. Incorpora double jump/dash/parede e recuperação por checkpoint. Ranking não é “quem está mais à direita”: checkpoint alcançado e progresso no segmento, importante na pista vertical.

## Limitações

Não há garantia de solver para qualquer mapa customizado ou parâmetros ADMIN extremos. Aumento de dimensão sem novos apoios pode tornar rotas inviáveis. Controle por observações finitas pode errar diante de múltiplas zonas e teleporte. Tests de progressão com mortes forçadas demonstram fluxo, não capacidade da IA de vencer cinquenta encontros humanos. Balanceamento humano permanece separado da validação técnica.
