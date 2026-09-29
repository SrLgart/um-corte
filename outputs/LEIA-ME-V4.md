# UM CORTE IV · 4.0 — O preço do poder

Abra **UM-CORTE-V4.html** no Chrome ou Edge. O jogo cabe inteiro nesse arquivo. PvE, treino e duelo local funcionam sem internet; o online precisa de conexão. A V3 continua preservada em seu próprio arquivo.

Há duas edições com as mesmas regras, personagens e animações:

- **UM-CORTE-V4.html:** versão comum, para compartilhar.
- **UM-CORTE-V4-ADMIN.html:** sua edição, que também inclui o menu de administração. Guarde esse arquivo para seu uso; quem receber uma cópia também terá acesso ao menu. Não usa senha nem identificação por IP.

## O que mudou

- Finta aceita durante toda a preparação e nos primeiros 60 ms da fase ativa, desde que o golpe ainda não tenha tocado em nada. Pressione ataque e depois parry. A finta tem recuperação de 150 ms e intervalo de 450 ms; cancelar não concede defesa.
- Novo ataque padrão: **1× equivale a 1,25× da V3**. Preparação, fase ativa e recuperação ficam mais rápidas na mesma proporção para cada classe. Na V4, 2× equivale a 2,5× da V3.
- Parry padrão de **400 ms**, acionado com um toque. Acertos de parry recebem um breve quadro de impacto de alto contraste. A opção de reduzir movimento suaviza esse efeito.
- Dash aéreo ligado por padrão, com opção de desativar. De uma a cinco cargas configuráveis para encadear dashes, inclusive para cima. Cada dash precisa terminar antes do seguinte; a última carga impõe a recuperação escolhida. As cargas recarregam uma por vez. Aterrissar reinicia o limite por salto, sem devolver cargas gastas.
- Tela cheia ocupa o visor durante a luta, escondendo cabeçalho, rodapé e margens. Use **Tela cheia** no menu; durante a partida, **Pausar → Sair da tela cheia** permite retornar. Esc também segue o comportamento do navegador.
- Treino começa com o painel fechado; clique em **Ajustar treino** para abri-lo.
- Botão **+** ao lado das cores: 16 cores disponíveis, sem repetir entre adversários.
- **Atualizações** mostra V1, V2, V3, V3.2, V3.3 e V4.

## Controles padrão

| Ação | Teclado e mouse | Controle |
|---|---|---|
| Mover | A / D ou ← / → | Analógico esquerdo / direcional |
| Mirar | Mouse | Analógico direito |
| Pular | Espaço / W | A / ✕ |
| Queda rápida | S / ↓ | Analógico para baixo / ↓ |
| Descer de plataforma | Baixo + pulo | Baixo + pulo |
| Atacar | Clique esquerdo / J | RB / R1 |
| Parry / finta | Clique direito / K | LB / L1 |
| Dash | Shift | B / ○ |
| Deslizar | Baixo + dash, no chão | Baixo + dash, no chão |
| Chutar | E / L | X / □ |
| Especial, quando habilitado | F | Y / △ |
| Reiniciar treino / tentativa | R | View |
| Pausa / controles | Esc | Menu |

No modo local, jogador 1 usa teclado e mouse; jogador 2 usa controle. As ações podem ser remapeadas em **Controles**. Preferências da V3 no mesmo navegador são reaproveitadas.

Ataques durante o dash mantêm sua trajetória e seguem a mira definida no início do golpe. A área luminosa do slash é a área real de acerto; os rastros que desaparecem depois não causam dano. Chutes empurram, sem matar diretamente. Paredes interrompem os cortes e permitem wall jump. Parry baixo só existe no ar.

## Personalizar partida

Todas as opções numéricas têm barra e campo para digitar. As regras valem para os dois jogadores.

| Opção | Faixa normal | Padrão |
|---|---|---|
| Velocidade de ataque | 0,1× a 3× | 1×, com a nova base |
| Velocidade de movimento | 0,1× a 3× | 1× |
| Tamanho da arena | 0,5× a 3× | 1× |
| Gravidade | 0,1× a 5× | 1× |
| Força do pulo | 0,1× a 5× | 1× |
| Distância do dash | 0,1× a 5× | 1× |
| Dashes consecutivos | 1 a 5 cargas inteiras | 1 |
| Recuperação do dash | 0 a 2.000 ms | 75 ms |
| Recarga de cada dash | 0 a 5.000 ms | 800 ms |
| Duração do parry | 50 a 2.000 ms | 400 ms |
| Recuperação do parry | 0 a 3.000 ms | 400 ms |
| Atordoamento após parry | 0 a 3.000 ms | 490 ms |
| Recarga do especial | A partir de 0,1 s | 15 s |

A barra de recarga do especial vai até 120 segundos; o campo aceita durações maiores. Recuperação é o período em que o personagem ainda não pode agir após a ação. Recarga é o tempo para recuperar uma utilização.

## Especiais opcionais

Marque **Habilitar especiais** na personalização. Antes da partida, uma janela explica os poderes e as desvantagens dos personagens escolhidos. No online, ambos precisam confirmar. Indicadores discretos nos dois cantos inferiores mostram recarga, efeito ou penalidade; ficam escondidos quando os especiais estão desativados.

A barra começa **vazia a cada rodada**. A recarga só avança durante o combate e começa novamente após terminar o efeito e sua penalidade. O poder não é ativado automaticamente: use **F / Y / △** quando estiver pronto e o personagem puder agir.

| Classe | Especial | Consequência |
|---|---|---|
| Cavaleiro — Última guarda | Absorve um ataque recebido ou expira em 10 s. A proteção também bloqueia especiais. | Ao terminar, fica 10 s sem parry. Chutes ainda empurram; quedas continuam fatais. |
| Lanceiro — Sem retorno | Após 300 ms de preparação visível, dispara horizontalmente. Ignora parry e clash. | Não pode frear, mudar de direção, saltar ou dar dash até atingir uma parede ou cair. Pode ser evitado saltando ou saindo da trajetória. |
| Assassino — Última adaga | Arremessa a adaga na direção da mira, após 180 ms de preparação. Um acerto mata. | Fica sem ataque até buscar a adaga. Pode usar parry, dash e chute. Parry inimigo derruba a adaga perto do defensor. Se cair no vazio, retorna a uma superfície segura depois de 2 s. |
| Espadachim — Corte soberano | O próximo corte ignora parry. Esquiva e clash ainda funcionam. | O golpe consome o poder mesmo se errar ou sofrer clash; depois, 10 s sem parry. Fintar na preparação conserva o poder; fintar na fase ativa o consome. |
| Ceifador — Lua crescente | Arma e alcance real aumentam 40% por 10 s. | Em seguida, ficam 40% menores que o tamanho normal por 10 s. |

Todos os efeitos e penalidades reiniciam entre rodadas. O escudo opcional do Cavaleiro é uma defesa explícita contra um ataque; não existe vida escondida. Sem essa proteção, um acerto letal continua encerrando a tentativa.

## Treino e replay

O treino mantém o boneco configurável: movimento, mira, ataque, finta, chute, guarda contínua ou parries em intervalos. O painel só abre quando solicitado. É possível salvar posições, reiniciar, mostrar colisões, reduzir o tempo e avançar quadro a quadro.

**Último replay** guarda os últimos instantes de um ponto. **Tentar outra resposta** permite jogar novamente a partir do instante escolhido, enquanto o adversário repete os comandos gravados. Especiais, projéteis, efeitos e penalidades também são restaurados. Esse exercício não altera o placar oficial. No online, o replay fica disponível após o fim da partida.

## Online

1. Cada jogador abre uma edição da **V4**, no próprio computador.
2. Um escolhe **Online → Criar sala** e envia o código ao outro.
3. O outro digita o código e entra. Cada um escolhe classe e cor; o anfitrião define mapa e regras.
4. Ambos confirmam que estão prontos. Com especiais habilitados, também confirmam a explicação dos poderes.
5. Primeiro a cinco vence. **Revanche** volta à seleção de personagens na mesma sala, sem trocar o código.

As edições comum e admin são compatíveis entre si. Salas V4 são separadas das versões anteriores. Não é necessário pagar hospedagem para abrir o arquivo ou criar uma sala: o serviço público PeerJS faz o encontro inicial, e os comandos seguem por WebRTC. A conexão depende da disponibilidade desse serviço e da rede; redes que bloqueiam comunicação direta podem exigir um relay TURN, não incluído no protótipo. Mantenham as abas visíveis durante o duelo.

## Seu menu admin

Abra **UM-CORTE-V4-ADMIN.html**, entre em uma partida e pressione **Ctrl + Shift + F10**.

O menu permite trocar mapa, personagens, cores e todas as regras numéricas, além de definir posições. Os limites máximos da personalização comum não se aplicam: valores como 10×, 100× e 200× são aceitos. São exigidos números finitos válidos; mapa e velocidade de ataque devem ser positivos, e cargas devem ser inteiras. Valores extremos podem deixar a partida impraticável.

- **Aplicar na rodada:** reinicia a tentativa com os novos ajustes, preservando o placar.
- **Pausar / retomar:** controla a simulação. Offline, abrir o painel já pausa e fechar restaura o estado anterior, salvo se você alterar a pausa manualmente.
- **+1 quadro:** avança um quadro com a simulação pausada.
- **Recarregar habilidades:** devolve cargas e especial, remove as penalidades dos especiais e os cooldowns de dash/parry.
- **Restaurar padrão:** carrega os padrões no formulário; clique em Aplicar para usá-los.
- **Reposicionar no início:** reinicia a rodada nas posições do mapa atual.

Para usar administração online, o anfitrião deve marcar **Criar sala de testes com administração** antes de criar a sala. O outro jogador vê essa condição antes de confirmar. Somente o anfitrião administra; as alterações e pausas são aplicadas nos dois jogos no mesmo quadro. A edição admin também joga em salas comuns, mas o menu não controla essas partidas. Ajustes experimentais são normalizados aos limites públicos quando se retorna à seleção para outra partida.

## Verificação desta entrega

- 40 grupos de testes das regras, incluindo golpes fatais em oito direções, especiais, finta, dashes, parry, clash e colisão da adaga com paredes.
- 308 simulações com as 25 combinações de classes, sete arenas, quatro dificuldades e regras alteradas; 28 cenários adicionais de navegação da IA.
- Navegador: interface, campos numéricos, cores, tela cheia sem margens, treino fechado, efeitos visuais e menu admin com valores de 100× e 200×.
- Teclado e controle simulado pela Gamepad API, remapeamento, desconexão/reconexão e replay interativo com projétil.
- Online real PeerJS/WebRTC em duas sessões isoladas do Chrome no mesmo computador: especiais, administração sincronizada, rodada, partida até cinco, revanche com novas classes e desconexão. Não foi um teste em dois computadores ou duas redes diferentes, nem com controle físico.

Fontes e scripts de teste ficam em `work/v4/`. O build gera os dois arquivos autônomos; a versão comum não contém o formulário nem o módulo do menu admin.
