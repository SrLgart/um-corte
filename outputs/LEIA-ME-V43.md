# UM CORTE IV · V4.3 — Ajustes, balanceamento e QoL

Abra **UM-CORTE-V43.html** no Chrome ou Edge. Sua edição com administração é **UM-CORTE-V43-ADMIN.html**. A versão comum não contém o menu admin. Os arquivos da V4.2 foram preservados.

## Novidades da V4.3

- Especiais ligados por padrão, recarga padrão de **7 segundos**. Desative em Personalizar partida se preferir.
- Cavaleiro e Espadachim: a penalidade após o especial passa a **4 segundos sem parry**. Os demais efeitos permanecem iguais.
- **Pontos para vencer**: padrão 5, atalhos 3 / 5 / 7 / 10 e campo para um inteiro positivo personalizado. O HUD acompanha a escolha.
- **Manter carga do especial entre rounds**: desligado por padrão. Ligado, preserva a carga dos dois jogadores, inclusive de quem perdeu. A pausa após o ponto não gera carga extra. Efeitos e penalidades terminam; um especial usado não é reembolsado. Toda partida nova, incluindo revanche, começa vazia.
- A descrição dos especiais começa automaticamente em **10 segundos**. No online, ambos confirmando antes iniciam imediatamente; ao esgotar o prazo, as duas telas são fechadas automaticamente. Desconexão encerra a espera com uma mensagem.
- ADMIN funciona como anfitrião ou convidado. Dois administradores podem usar o painel; os comandos são ordenados e aplicados no mesmo quadro. A última mudança nessa ordem prevalece.
- Log de atualizações inclui a V4.3.

## Presets de combate

| Preset | Valores |
|---|---|
| CLÁSSICO | Regras padrão de combate da V4.3 |
| TURBO | Movimento 1,6×; ataque 1,4×; recarga de dash de 600 ms (25% menor) |
| BAIXA GRAVIDADE | Gravidade 0,65×; força do pulo 1,1× |
| SEM PIEDADE | Parry de 180 ms; recuperação de parry de 500 ms; recuperação de ataque 1,2× |
| PERSONALIZADO | Mantém todos os valores atuais para ajuste manual |

Os presets alteram movimento, salto, gravidade, ataque, dash, parry e atordoamento. Preservam arena, tamanho e plataformas do mapa, personagens, cores, skins, pontos e todas as opções de especiais. Alterar um parâmetro de combate para fora dos valores de um preset identifica as regras como PERSONALIZADO.

**Recuperação dos ataques** é um novo multiplicador separado: afeta somente a recuperação, preservando a preparação e a parte ativa. Os ajustes continuam proporcionais às características de cada classe.

## Recursos mantidos da V4.2

- Editor de mapas: chão, paredes, plataformas, trajetos móveis, plataformas frágeis e dois pontos de nascimento.
- Fundos com até duas imagens, profundidade de movimento, opacidade, enquadramento e escurecimento.
- Salvar mapas em uma pasta escolhida, guardar uma cópia no navegador e importar/exportar arquivos com as imagens incluídas.
- Testar a arena no treino e voltar ao editor mantendo a edição.
- **Santuário Suspenso**, uma nova arena com plataformas que desabam. Os sete mapas anteriores mantêm sua geometria original.
- **Pugilista**, sexto personagem, com socos alternados, menor alcance e o especial Contra-golpe.
- Seis skins adaptadas ao pixel art, às proporções e à animação do jogo. Visualização animada de guarda, corrida, ataque, parry e especial.
- Figurinos completos das skins: mangas, luvas, calças, botas, armaduras e tecidos próprios de cada referência. Máscara do Cavaleiro Vazio redesenhada; mantos, cabelo, cachecol e barras de roupa acompanham o movimento.
- Skins e mapas personalizados sincronizados no online e na revanche.
- Novos ajustes de partida também disponíveis sem os limites públicos no admin.
- Histórico completo dentro do jogo.

## Criar e guardar mapas

1. No menu principal, clique em **Criar mapa**.
2. Comece com **Novo** ou escolha um modelo e clique em **Abrir / copiar**. Copiar um mapa oficial cria um mapa separado.
3. Escolha a ferramenta e arraste na arena para criar chão, plataforma, parede, plataforma móvel ou frágil.
4. Use **Selecionar** para mover peças. Os campos ao lado permitem digitar posição e medidas. **Excluir peça**, **Desfazer** e **Refazer** ajudam a ajustar o desenho.
5. Para uma plataforma móvel, arraste o contorno **B** para definir o destino. Escolha o tempo do percurso e a pausa em cada ponta. O movimento pode ser horizontal, vertical ou diagonal.
6. Para uma plataforma frágil, escolha o tempo entre pisar e cair, e o tempo para reaparecer. Reaparecimento **0** significa voltar somente na próxima rodada. A plataforma não reaparece atravessando um personagem.
7. Use **Início 1 / Início 2** para colocar os jogadores. O editor avisa quando um início está sem apoio, dentro de parede ou perto demais do outro.
8. Em **Fundo personalizado**, carregue PNG, JPEG ou WebP. Ajuste as camadas e a cor do chão. Imagens ficam atrás do combate e não têm colisão.
9. Clique em **Testar aqui**. O jogo abre um treino no mapa atual. **Voltar ao editor** restaura a tela de edição sem perder o mapa.
10. Clique em **Escolher pasta** e autorize uma pasta sua. **Salvar mapa** grava nela um arquivo `.umcorte.json`, incluindo as imagens. Escolher a pasta também carrega os mapas desse formato que já estiverem nela.

Sem pasta selecionada, **Salvar mapa** guarda a cópia do navegador e baixa o arquivo para Downloads. **Exportar** baixa outra cópia; **Importar arquivo** abre um mapa recebido de alguém. Não é necessário enviar imagens separadamente.

Os mapas salvos aparecem na seleção de arenas ao reabrir o jogo no mesmo navegador e endereço. A cópia do navegador depende de seus dados locais; o arquivo exportado é sua cópia portátil. Ao abrir uma nova sessão, escolha novamente a pasta para voltar a gravar diretamente nela. Navegadores que não oferecem o seletor de pasta continuam podendo importar e exportar arquivos.

O editor aceita arenas de 640–3.840 unidades de largura, 360–2.160 de altura, até 80 plataformas e 60 paredes. Imagens de até 15 MB são reduzidas para caber no arquivo e na transferência online. Cada imagem incorporada tem um limite de tamanho; arquivos de mapa importados podem ter até 2,1 MB. O sorteio de mapas inclui as oito arenas oficiais; mapas personalizados são escolhidos diretamente.

## Santuário Suspenso

Os dois jogadores começam em bases fixas. O caminho central usa três plataformas frágeis; o caminho alto oferece apoios estáveis.

Por padrão, uma plataforma começa a rachar no primeiro pisão, cai após **800 ms** e reaparece após **4 s**, se o espaço estiver livre. Sair dela não cancela a contagem. Rachaduras, fragmentos, mudança na borda e som avisam a queda. Todas retornam no início da próxima rodada.

## Pugilista

- Alcance 25% menor que o da adaga.
- Ciclo de ataque cerca de 15% mais rápido que o do Assassino; movimento 5% mais rápido.
- Socos esquerdo e direito alternados, com mira em todas as direções. Um soco limpo mata, como os outros ataques.
- O rastro curto do soco mostra a área de acerto. Skins não aumentam essa área.
- Ataque durante dash, finta, chute, salto e parries direcionais continuam disponíveis.

**Contra-golpe**, com especiais habilitados:

1. Carregue a barra e use **F / Y / △**.
2. Você tem **5 s** para acertar um parry, inclusive contra a adaga arremessada.
3. Ao conseguir, recebe **2 s de socos acelerados sem recuperação entre os golpes**. Pode segurar ataque para continuar socando, alternando os braços. Cada soco define sua mira ao começar.
4. Alcance, colisões e vulnerabilidade permanecem. O adversário pode desviar, aparar ou provocar clash. Ser atordoado não interrompe a contagem do efeito.
5. Se os 5 s acabarem sem um parry bem-sucedido, fica **3 s sem dash**.

Os tempos são personalizáveis. A recarga padrão é de 7 s, vazia a cada rodada a menos que a persistência esteja ligada, e volta a avançar quando o efeito ou a penalidade termina. Fora do especial, segurar ataque não dispara socos automaticamente.

## Skins

Escolha a classe e use o seletor **Visual** abaixo dos personagens. **Ver em movimento** abre a prévia animada. Cada lado escolhe sua própria skin; no PvE e treino, você escolhe também a do adversário.

| Classe | Referência adaptada | Arma / detalhe |
|---|---|---|
| Cavaleiro | Hollow Knight | Máscara com chifres, manto e arma inspirada no ferrão |
| Lanceiro | Katakuri | Gola cobrindo a boca e tridente |
| Assassino | Thorfinn jovem, época de Askeladd | Cabelo loiro, túnica terrosa e uma adaga nórdica funcional |
| Espadachim | Guts | Armadura escura, capa e espada larga inspirada na Dragon Slayer |
| Ceifador | Kite | Cabelo claro, chapéu e foice inspirada no Crazy Slots Nº 2 |
| Pugilista | Yuji Itadori | Cabelo rosado, gola vermelha e energia nos punhos |

As skins preservam corpo, alcance, velocidade e regras da classe. A cor de identificação do jogador permanece em faixas, mantos ou detalhes. Personagem aleatório usa o visual original da classe sorteada. O Assassino continua com uma arma funcional: arremessá-la deixa o personagem sem ataque até recuperá-la, também na skin Thorfinn.

## Online

Ambos precisam abrir a **V4.3**. As edições comum e admin são compatíveis entre si. Crie a sala, envie o código e confirme as escolhas dos dois jogadores.

O anfitrião pode selecionar um mapa personalizado da sua biblioteca. O mapa e suas imagens são enviados automaticamente ao adversário, que vê a arena selecionada antes de ficar pronto. A transmissão usa partes menores para suportar imagens maiores. O convidado pode guardar o mapa recebido: depois de sair da sala, abra-o no editor e use Salvar ou Exportar.

A revanche mantém a sala e permite escolher novamente classe e skin. As salas V4.3 são separadas das versões anteriores. Não há servidor de jogo próprio nem pagamento de hospedagem necessário para abrir o arquivo, mas a conexão inicial depende do serviço público PeerJS. Redes que impedem conexões diretas podem precisar de TURN, que não está incluído.

## ADMIN

Na edição admin, durante a partida, pressione **Ctrl + Shift + F10**. Funciona na edição ADMIN independentemente de criar ou entrar na sala. A edição comum recebe as mudanças sincronizadas, mas não tem o painel. Também estão disponíveis:

- Pontos para vencer, persistência da carga e multiplicador separado de recuperação dos ataques.
- Pugilista e skins dos dois jogadores.
- Seleção de mapas personalizados carregados e do Santuário Suspenso.
- Janela para conseguir o parry do Pugilista, duração dos socos livres e penalidade sem dash, em milissegundos.
- Multiplicadores da velocidade das plataformas, do tempo para desabar e do tempo para reaparecer.

Esses ajustes também aparecem na personalização normal, com limites. O admin aceita valores maiores, como antes. As medidas e os trajetos individuais de cada peça são editados no **Criar mapa**; depois, o mapa salvo pode ser selecionado no admin. Aplicar mapa, personagens ou regras reinicia a rodada preservando o placar.

O lobby identifica quem usa a edição ADMIN. Não é mais necessário marcar sala de testes. As ações de ambos os administradores passam por uma sequência compartilhada: mapa, skins, regras, pausa, avanço de quadro e recarga permanecem sincronizados. Um aviso discreto indica qual jogador aplicou o comando. O privilégio pertence ao arquivo ADMIN; guarde essa edição para quem deve utilizá-la.

## Verificação da V4.3

- 42 verificações de combate e especiais, atualizadas para os novos padrões.
- Nove grupos específicos: presets preservando regras fora do combate, recuperação separada, pontuação personalizada, empate, persistência exata, consumo dos especiais e restauração determinística de estado.
- Navegador: presets, ajustes manuais, HUD, início automático após 10 segundos, confirmação antecipada, histórico e novas opções ADMIN.
- 72 simulações dos quatro presets, com seis classes e três tipos de arena.
- Online real PeerJS/WebRTC em sessões isoladas do Chrome no mesmo PC: anfitrião ADMIN, convidado ADMIN e ambos ADMIN; confirmações antecipadas, só um pronto e ninguém pronto; alterações simultâneas, pausa, passo a passo, skins, pontuação, carga entre rodadas e revanche.
- Desconexão durante a apresentação fecha a tela corretamente. Especiais desligados continuam funcionando no online.
- ADMIN convidado transferiu um mapa personalizado de 1,5 MB com duas imagens para o anfitrião comum. Plataformas móveis e desabamentos mantiveram estados iguais.
- Não foi um teste em dois computadores ou redes diferentes. Os resultados ficam em work/v43/.

Fontes e scripts: work/v43/. Build: node work/v43/build.cjs. O build gera as duas edições autônomas em outputs/.
