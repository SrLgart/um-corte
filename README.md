# UM CORTE V — O instante que decide

Abra **UM-CORTE-V5.html** no Chrome ou Edge. É um arquivo completo: não precisa instalar nem contratar hospedagem. Para jogar online, os dois precisam estar conectados à internet e usar a V5.

## O que mudou

- Golpes fatais: pausa de impacto, queda em micro câmera lenta, pequeno zoom, flash, abalo curto, corte residual e som seco. O ambiente silencia por cerca de meio segundo.
- A causa aparece junto do impacto: abertura na recuperação, direção errada da guarda, parry tarde demais, punição após parry, guarda rompida por especial, queda ou troca.
- Slash mais fluido, com faixas de movimento e uma borda luminosa. O contorno preenchido continua sendo a área real de dano. Rastros apagados não acertam.
- Iluminação com cores próprias por cenário, lanternas, cristais e braseiros, sombras estilizadas, brilho leve e reação aos golpes. Especiais têm sinais visuais e sonoros por classe.
- Som de passou raspando somente quando um ataque realmente erra por pouco.
- Novo ferrão para a skin Cavaleiro Vazio; atributos e alcance preservados.
- Arena aleatória sempre no fim da seleção, inclusive depois de criar ou importar um mapa.

## Caos e Caos Ultra

Abra **PERSONALIZAR PARTIDA → MODO CAOS**. O padrão continua desligado.

**Caos** sorteia um modificador por round, sem repetir o anterior. Ele desaparece no round seguinte. **Caos Ultra** acrescenta um modificador compatível por round e mantém os anteriores; empates também avançam o sorteio. Quando as combinações acabam, o conjunto permanece, sem duplicações. Uma revanche começa um conjunto novo.

Há mudanças de gravidade, pulo, cargas de dash, ataque, movimento, tamanho da arena, parry, recuperação do dash, plataformas frágeis e especiais. Suportes seguros de início são preservados. A apresentação do modificador vem antes de 3, 2, 1. A lista ativa aparece discretamente acima da arena.

Os modificadores se aplicam sobre as regras escolhidas. Com persistência do especial ligada, sua porcentagem de carga é preservada mesmo quando a recarga muda; efeitos temporários terminam entre rounds. No online, ambos recebem exatamente o mesmo sorteio.

## Momentos e sessão

**★ MOMENTO DECISIVO** guarda o melhor destaque da sessão, sem reprodução automática. O botão **ÚLTIMO REPLAY** continua disponível para o ponto mais recente. O replay permite assistir à queda, avançar quadros, ver colisões e tentar outra resposta.

No online, assistir fica disponível entre partidas e mantém a sala conectada. Na revanche, os dois continuam confirmando personagem e regras antes do próximo duelo.

**SESSÃO** mostra vitórias, rounds, classes usadas, sequências, parries, ataques, erros, quedas, clashes, especiais e outras medidas. Os registros atravessam revanches; uma nova sala ou troca de modo inicia outra sessão. O botão de zerar limpa estatísticas e destaque. Treino e tentativas de replay não contam. Os prêmios aparecem quando há dados suficientes.

## Visual

Em **OPÇÕES**, escolha **Baixo / Médio / Alto** e ligue ou desligue **Sombras** separadamente. Alto e sombras ligadas são o padrão. As preferências ficam neste navegador, inclusive ao reabrir o arquivo. Ajustes visuais são individuais e não mudam física, alcance, timing ou sincronização.

## Controles padrão

| Ação | Teclado e mouse |
| --- | --- |
| Mover | A / D ou setas |
| Mirar | Mouse |
| Pular | Espaço / W; segurar aumenta a altura |
| Atacar | Mouse esquerdo / J |
| Parry | Mouse direito / K |
| Dash | Shift |
| Chutar | E / L |
| Especial | F |
| Deslizar | Baixo + dash |
| Fintar | Parry durante o início do ataque |

O mapeamento fica em **OPÇÕES**. No modo local, um jogador usa teclado e mouse e o outro usa controle. A tela de treino continua fechada até você abrir seus ajustes. Um golpe limpo continua fatal; não há vida escondida.

## Online

Um jogador escolhe **ONLINE → CRIAR SALA** e envia o código ao outro. O segundo usa **ENTRAR**. Escolham cores diferentes, personagens e confirmem. As regras e mapas personalizados são compartilhados. Redes que bloqueiam conexão direta podem impedir o PeerJS/WebRTC; a conexão depende de internet, mesmo com o jogo salvo no PC.

## Edição ADMIN

Abra **UM-CORTE-V5-ADMIN.html**. Durante a partida, use **Ctrl + Shift + F10**. O menu permite mudar mapa, personagens, skins, regras, Caos, posições, pausar, avançar quadros e recarregar recursos. Os campos editam as regras base; o painel também informa os valores efetivos com os modificadores.

A edição ADMIN funciona como anfitrião ou convidado. Se os dois usarem essa edição, ambos têm acesso. As alterações são ordenadas e sincronizadas entre os clientes. Compartilhe a edição comum com quem deve jogar sem esse painel.

As versões anteriores foram preservadas. O histórico dentro do jogo contém a entrada **V5**.

## Validação desta entrega

Testes do motor cobrem combate, classes, especiais, plataformas, regras, Caos, estatísticas e replays. Verificação visual nas oito arenas e em mapa personalizado; qualidades gráficas sem alteração do estado da simulação. Online validado por PeerJS/WebRTC real entre dois contextos isolados do Chrome no mesmo computador, incluindo ADMIN nos dois lados, revanche e Caos Ultra. Esse teste não representa todas as combinações de redes de dois PCs remotos.
