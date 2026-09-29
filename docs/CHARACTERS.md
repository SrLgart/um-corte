# Classes, Corredor e Errante

## Identidade mecânica — preservar

Stats são os valores efetivos de `DuelCore.CLASSES` depois de `SCALE=.9` e divisão de timings por 1,25. AttackSpeed=1 e attackRecovery=1 nesta tabela. O minRange é parâmetro do formato do slash, não promessa de uma faixa retangular inteira atingível. Ver `slash` para contorno exato.

| ID / classe | Velocidade / dash | Alcance / minRange | Startup / active / recovery (ms) | Identidade |
|---|---|---|---|---|
| knight / Cavaleiro | 310 / 990 | 127,8 / 27 | 152 / 96 / 256 | Corte equilibrado em arco |
| lancer / Lanceiro | 290 / 930 | 199,8 / 141,3 | 184 / 96 / 312 | Ponta longa, espaço morto próximo |
| assassin / Assassino | 360 / 1080 | 82,8 / 25,2 | 112 / 84 / 200 | Arco curto, mobilidade |
| swordsman / Espadachim | 300 / 970 | 168,3 / 30,6 | 209,6 / 120 / 342,4 | Espada pesada, comprometimento |
| reaper / Ceifador | 305 / 975 | 187,2 / 104,4 | 232 / 120 / 372 | Arco curvo com abertura interna |
| boxer / Pugilista | 378 / 1100 | 62,1 / 10,8 | 95,2 / 71,4 / 170 | Punhos alternados, mínimo alcance |
| duelist / Duelista | 350 / 1060 | 147,6 / 26,1 | 120 / 80 / 204 | Linha estreita de rapieira |
| staff / Monge | 305 / 970 | 129,6 / 25,2 | 224 / 116 / 324 | Bastão em arco amplo |

O nome interno `staff` permanece compatível com saves da época “Bastonista”. Equipar arma Legado troca o perfil ofensivo, não concede a classe inteira/especial/mobilidade. `stats(f)` combina arma, técnicas, efeitos, especial e ADMIN; números dessa tabela não se aplicam cegamente a builds modificadas.

## Especiais reais

| Classe | Execução e consequência |
|---|---|
| Cavaleiro | Última Guarda: `shield`, dez segundos ou um evento absorvido. Depois, parryLock=4 s. Não protege automaticamente de queda |
| Lanceiro | Preparação 300 ms, investida horizontal 2200 até parede/parada; gravidade continua. Rompe parry/clash comum. Ao parar, ultRecovery=400 ms |
| Assassino | Preparação 180 ms, adaga 1350; recuperação 240 ms. `unarmed` impede ataque até recolher; parry/dash/chute continuam. Adaga perdida retorna a apoio seguro após dois segundos |
| Espadachim | Próximo ataque ativo recebe breakAttackId. Rompe parry, mas clash continua possível. Ao sair do active: perde bônus e bloqueia parry por quatro segundos, inclusive erro |
| Ceifador | Dez segundos reach/minRange/length ×1,4, depois dez segundos ×0,6. Em seguida volta ao normal |
| Pugilista | Janela boxerGuard padrão cinco segundos. Um parry bem-sucedido libera boxerRush por dois segundos: startup 24 ms, active 40 ms, recovery zero antes dos multiplicadores. Falhar a janela bloqueia dash por três segundos |
| Duelista | Próximo ataque converte para fenceStrike: direção travada, impulso 980 por 135 ms, recovery 620 ms ajustado pelas regras. Sem finta/cancelamento livre |
| Monge | Só arma no chão. Próximo ataque sweepStrike: startup 240, active 210, recovery 620 ms antes dos multiplicadores; varrida baixa, sem deslocamento/pulo. Pode ser saltada |

Clash durante fenceStrike/sweepStrike impõe recuperação 720/attackSpeed×attackRecovery ms. A carga padrão é sete segundos; penalidades interrompem recarga. Especiais copiados por Espelho usam `mirrorSpecial.kind`, inclusive representação de arma e locks próprios.

## Corredor

`RUNNER`, id `runner`, separado de CLASSES. Velocidade 445, dashSpeed 1120, sem alcance ofensivo. É a única seleção inicial do Parkour; “todas as classes” acrescenta o elenco sem removê-lo. Race bloqueia ataque, parry e especial conforme as regras do modo; contato/chute é opção da corrida. Não transformar a seleção de classe normal em autorização automática para duelo no Parkour.

## Errante

Flag `wanderer=true` num fighter cuja classe base inicial é boxer. `L.weaponStats` aplica velocidade 325, alcance 42, minRange 10, length 24, startup 170/active 80/recovery 300 ms. Não é um Pugilista com especial: `Run` desliga especiais, e hook de special recusa o Errante. Armas Legado substituem seu perfil ofensivo; ausência/arma fora usa perfil desarmado. Inventário, bindings, transformações e summons acompanham a run conforme escopos.

## Representação visual atual — redesenhável

`actors.js`, `skins.js`, `weapons.js`, `v8-actors.js` e `v8-visuals.js` desenham formas/pixels procedurais, poses e acessórios. As classes possuem idle, preparação/golpe/recuperação, parry, movimento aéreo, entrada, postura decisiva e finalização. Skins de referência são cosméticas (Cavaleiro/Hollow Knight, Assassino/Thorfinn, Lanceiro/Katakuri, Espadachim/Guts, Ceifador/Kite, Pugilista/Yuji); tabela exata de IDs em [runtime.json](data/runtime.json). Duelista e Monge mantêm representação padrão.

A identidade mecânica não depende de rosto, roupa, proporção desenhada ou fidelidade da referência. Redesign pode trocar esses elementos; não alterar `body`, `slash`, tempos ou o alcance para fazer a nova arte caber. O Errante recebe camadas de equipamento, e bosses têm vinhetas, títulos e builds; isso não significa sprites exclusivos completos para cada boss.
