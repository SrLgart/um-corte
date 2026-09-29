# UM CORTE

Abra `um-corte.html` no Chrome, Edge ou Firefox. O jogo funciona offline, sem instalação, servidor ou dependências externas. Use teclado e mouse em um computador.

## Controles

| Ação | Controle |
|---|---|
| Mover | A / D ou setas esquerda / direita |
| Atacar | J ou clique esquerdo |
| Parry | K ou clique direito |
| Dash | Shift + direção; sem direção, avança para o rival |
| Pausar / controles | Esc ou botão ? |
| Ativar / desativar som | M ou botão SOM |
| Começar / nova partida | Enter |

Um contato limpo da lâmina durante o golpe mata. Não existe vida ou dano acumulado. Primeiro a cinco pontos vence; cada tentativa reinicia cerca de 1,2 segundo após o impacto, incluindo o hitstop.

Provoque um ataque perto do limite da espada e recue. Um ataque errado deixa uma abertura; confirmar um parry atordoa o atacante e libera seu contra-ataque imediatamente. Segurar J não repete golpes. Dash não concede invencibilidade. Um clash interrompe ambos os ataques, sem mortes. Uma rara troca simultânea de golpes limpos sem clash reinicia a tentativa sem ponto.

## Ajustes do protótipo

- Ataque: 220 ms de preparação, 130 ms ativos, 380 ms de recuperação.
- Parry: 160 ms ativos, 400 ms de recuperação após erro, 620 ms entre tentativas.
- Dash: 140 ms, aproximadamente 90 unidades de avanço, cooldown de 850 ms.
- Atordoamento após parry: 500 ms; clash: 190 ms.
- Reação da IA à preparação: 155–285 ms, com escolhas falíveis.
- Colisão: segmentos da lâmina visível contra lâmina/corpo, verificados a 600 passos por segundo.

O arquivo HTML inclui o código, desenho em Canvas e sons sintetizados com Web Audio. A simulação de combate fica em `DuelCore`, o desenho em `DuelRenderer` e os controles no último bloco de script.

Validação: 14 testes das regras de combate; teste no Chrome de movimento, ataque, dash, parry por mouse, pausa, som, partida completa e reinício; simulações da IA com 24 sementes por estratégia. O balanceamento é inicial e ainda pode ser refinado com partidas humanas.
