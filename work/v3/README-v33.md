# UM CORTE III · V3.3 — Segunda leitura

Abra **um-corte-v3.html** no navegador. O jogo inteiro está nesse arquivo. PvE, local e treino funcionam sem internet; o online precisa de conexão. Não é necessário pagar hospedagem.

Esta versão acrescenta tela cheia, treino configurável, replay com tentativa jogável, finta, chute, deslize, wall jump, paredes, Torre do Sino com elevador, sorteio de classes/mapas e nova seleção na revanche online. Um corte limpo continua fatal. Não existe HP.

## Começar

1. Escolha **PvE**, **Treino**, **Local** ou **Online**.
2. Escolha personagem e cor, ou personagem aleatório. As cores dos dois adversários devem ser diferentes; classes iguais são permitidas.
3. Escolha a arena, ou mapa aleatório. O sorteio acontece ao começar cada partida e revanche.
4. Em **Personalizar partida**, arraste as barras ou digite os multiplicadores.
5. Entre no duelo. Primeiro a cinco vence, exceto no treino livre.

O botão **Tela cheia**, no cabeçalho, amplia o jogo. Clique novamente para sair. Quando o navegador não permite tela cheia, o jogo usa uma visualização ampliada dentro da janela.

## Controles padrão

| Ação | Teclado e mouse | Controle |
|---|---|---|
| Mover | A / D ou ← / → | Analógico esquerdo / direcional |
| Mirar | Mouse | Analógico direito |
| Pular | Espaço / W | A / ✕ |
| Queda rápida | S / ↓ | Analógico para baixo / ↓ |
| Descer de plataforma | Baixo + pulo | Baixo + pulo |
| Atacar | Clique esquerdo / J | RB / R1 |
| Parry | Clique direito / K | LB / L1 |
| Dash | Shift | B / ○ |
| Deslizar | Baixo + dash, no chão | Baixo + dash, no chão |
| Chutar | E / L | X / □ |
| Reiniciar treino/tentativa | R | View |
| Pausa / controles | Esc | Menu |

Segure o pulo para subir mais; solte para encurtar. Pular encostado em uma parede lança o personagem para o lado oposto. A mira continua livre. Um wall jump não devolve o dash aéreo nem permite repetir saltos infinitamente na mesma parede sem aterrissar; tocar outra parede permite outro salto.

No **local**, jogador 1 usa teclado e mouse, jogador 2 usa controle. No PvE, treino e online, escolha seu dispositivo no menu. Conecte um controle e pressione um botão para o navegador reconhecê-lo. Em **Controles**, remapeie ações, ajuste a zona morta e a resposta da mira, ou troque os analógicos. As preferências ficam salvas no navegador.

## Combate

- **Ataque durante dash:** mantém a trajetória e o tempo restantes do dash, com ataque na direção da mira. É possível atacar para trás enquanto recua.
- **Finta:** pressione parry durante a preparação de um golpe. Cancela o ataque em uma recuperação de 150 ms, com cooldown de 450 ms. A finta não protege o corpo. A fase ativa e a recuperação do golpe não podem ser canceladas.
- **Chute:** tem alcance curto, preparação e recuperação. Empurra e interrompe parry, sem matar diretamente. Pode provocar queda fatal. Perde para um golpe de lâmina e não garante um ataque gratuito depois.
- **Deslize:** abaixa a colisão real do corpo e compartilha o cooldown do dash. Permite atacar, mas não dá invencibilidade. Cortes baixos ou descendentes ainda podem acertar.
- **Buffer curto:** comandos nos últimos 80 ms da recuperação podem sair assim que ela acabar. Isso não encurta a recuperação nem guarda comandos durante um golpe inteiro.
- **Slash:** a área luminosa do corte avança e muda de forma ao longo da fase ativa. Essa mesma forma determina acertos, parries e clash. Rastros fracos que desaparecem depois não causam dano. Paredes interrompem o corte.

A direção do ataque fica definida no início. Movimento e gravidade continuam atuando durante golpes e parries aéreos. O dash prioriza o movimento lateral e usa a altura da mira; sem movimento lateral, segue a mira.

Parry **alto** protege de ataques vindos de cima; **normal**, a direção lateral escolhida; **baixo**, ataques de baixo somente no ar. A postura fica travada durante a tentativa. Aterrissar encerra o parry baixo.

Para uma defesa mais longa, use os presets **Preciso (150 ms)**, **Confortável (300 ms)**, **Longo (600 ms)** ou **Estendido (1.200 ms)**, ou ajuste a barra. Basta apertar e soltar. Um bloqueio bem-sucedido libera o contra-ataque; uma tentativa errada impõe recuperação.

## Treino livre

O boneco começa parado. Em **Ajustar treino**, configure movimento, ação e mira separadamente:

- Ficar parado, aproximar, recuar, andar para um lado ou ir e voltar.
- Atacar, fintar, chutar, alternar ataque/parry, fazer parry em intervalos ou manter guarda contínua.
- Acompanhar sua posição ou mirar numa direção fixa.
- Intervalos entre ações e variação aleatória de tempo.

Os intervalos respeitam a recuperação normal. **Guarda contínua** é uma assistência exclusiva do treino que remove a pausa entre tentativas; a direção protegida ainda importa.

Ative as colisões para visualizar corpo, corte, chute e guarda. Reduza o tempo para metade ou um quarto, pause e avance quadro a quadro. **Salvar posição** registra onde reiniciar. **R / Reiniciar** restaura essa posição e os cooldowns. O boneco continua morrendo com um golpe, reaparece rapidamente e o treino não termina em cinco pontos.

## Replay e outra resposta

Depois de um ponto, **Último replay** mostra até os últimos 2,5 segundos. A gravação é temporária e fica somente na memória desta aba. Não atrasa o reinício automático das tentativas.

Escolha um instante na barra, pause, avance um quadro e mude a velocidade. **Tentar outra resposta** devolve o controle do seu personagem naquele instante, restaurando posições, velocidades, cooldowns e fases dos golpes. O rival repete os comandos gravados; colisões, parry, clash e quedas são simulados novamente. No local, a tentativa controla o jogador 1.

**R / Repetir** volta ao instante escolhido. **Voltar / Esc** retorna ao jogo. Esse exercício não altera o placar oficial. No online, o replay só fica disponível depois do encerramento da partida, mantendo a sala conectada enquanto você estuda a jogada.

## Online e revanche

1. Os dois jogadores abrem o mesmo arquivo atualizado **V3.3**, cada um no próprio computador.
2. Escolham **Online**. Um cria a sala e envia o código de seis caracteres ao amigo.
3. O amigo digita o código e entra. Cada um escolhe sua classe e cor; o anfitrião define mapa e regras.
4. Confiram as regras e cliquem em **Confirmar e ficar pronto**. Os dois precisam confirmar.
5. Depois da partida, **Revanche** abre a seleção de personagens dentro da mesma sala. Troquem classe/cor e confirmem novamente. Mapa e regras são preservados; escolhas aleatórias são sorteadas outra vez.

Durante o duelo, mantenham as abas visíveis. O painel de controles não pausa o adversário. A simulação espera comandos ausentes; uma interrupção longa encerra o duelo com uma mensagem. A espera na seleção de revanche não tem esse limite de dez segundos.

O serviço público PeerJS conecta os jogadores e os comandos seguem por WebRTC. Não há conta nem servidor de jogo próprio. Redes restritivas, VPNs ou firewalls podem impedir a conexão direta; não há relay TURN incluído. Salas V3.3 são separadas das versões anteriores.

## Classes, arenas e personalização

As cinco classes mantêm suas diferenças: **Cavaleiro** equilibrado, **Lanceiro** com estocada longa e espaço seguro junto ao cabo, **Assassino** rápido e curto, **Espadachim** de alcance amplo e maior comprometimento, **Ceifador** com arco curvo e espaço seguro interno.

Sete arenas: Dojo elevado, Ponte quebrada, Ruínas, Bosque da Lua, Fortaleza Nevada, Forja de Cinzas e **Torre do Sino**. Dojo e Ruínas ganharam paredes físicas. A Torre traz pilares, paredes e um elevador central de movimento previsível. Vãos continuam fatais; duas quedas dentro de 150 ms empatam a tentativa.

| Ajuste contínuo | Limites |
|---|---|
| Velocidade de ataque | 0,1× a 3× |
| Velocidade de movimento | 0,1× a 3× |
| Tamanho da arena | 0,5× a 3× |

Os multiplicadores são iguais para ambos e aplicados à base de cada classe. Ataque 2× divide preparação, fase ativa e recuperação por dois. Mapa maior escala largura, altura, plataformas e posições iniciais; personagens não crescem. Rotas grandes recebem apoios intermediários.

Também há gravidade, pulo, distância/recuperação/cooldown do dash, duração/recuperação do parry, atordoamento e dash aéreo opcional. Dash aéreo permite uma utilização por voo, respeitando o cooldown. Dash que sai do chão já consome essa utilização; aterrissar devolve o uso, sem zerar o cooldown.

PvE mantém Fácil, Normal, Adaptativo e Impossível. O Adaptativo observa hábitos durante a partida. O Impossível antecipa ataques e reage rapidamente, com as mesmas colisões e vulnerabilidades. Valores extremos na personalização alteram bastante o equilíbrio e o comportamento da IA.

## Verificação desta entrega

- 81 testes de combate, física, precisão, regras, determinismo, treino e replay.
- 28 cenários de navegação e 273 simulações envolvendo classes, mapas e dificuldades.
- Navegador: entradas numéricas, treino, pausa/quadro, finta, chute, deslize, replay jogável, preservação do jogo original, tela cheia e sorteios.
- Online real via PeerJS/WebRTC em dois contextos isolados do Chrome no mesmo computador: partida até cinco, replay pós-partida, espera, seleção de novos personagens/cores, mapa aleatório, confirmação dos dois, mesma sala e desconexão. Dois PCs em redes diferentes ainda precisam de teste.
- Controle padrão simulado pela Gamepad API: movimento independente, pulo, parry aéreo, remapeamento, conflitos, persistência e reconexão. Controle físico ainda precisa de teste.

V1 e V2 preservadas. O estado anterior V3.2 está em `work/v3/archive-before-v33`. Fontes em `work/v3`; `build.cjs` gera o HTML independente.
