# UM CORTE V7 — CONTROLE

Abra **um-corte-v7.html** no Chrome ou Edge. O jogo inteiro está nesse arquivo, sem instalação. Para o painel administrativo, abra **um-corte-v7-admin.html**.

## Movimento e defesa

- **A/D ou setas:** andar. **Espaço:** pular; segure para ganhar altura, solte para encurtar.
- **WASD / quatro setas:** direção do dash aéreo. O mouse não muda essa trajetória. Diagonais têm a mesma velocidade das direções retas. Sem direção pressionada, o dash aéreo vai horizontalmente para o lado em que você olha.
- **Shift:** dash. O dash que começa no chão preserva a direção lateral e a altura da mira da V6.3.
- **Baixo + dash no chão:** slide. **Baixo no ar:** queda rápida. **Baixo + pulo:** atravessar plataforma de mão única.
- **Parede:** mantenha a direção contra ela enquanto cai para deslizar devagar. Soltar a direção encerra o apoio. Pule pressionando para cima/contra a parede para ganhar mais altura; pressione para fora para se afastar mais. É possível usar a mesma parede novamente depois de sair e reencostar. Isso não devolve dashes.
- **Mouse esquerdo/J:** atacar. **Mouse direito/K:** parry. A defesa trava na esquerda ou direita da mira ao apertar; protege todas as alturas desse lado. Passar por cima e atacar pelo outro lado vence a guarda. A interceptação muda de altura visualmente.
- **E/L:** chute. **F:** especial. **T:** provocação. A provocação é cosmética e qualquer ação a cancela.
- No controle: analógico esquerdo move/direciona o dash, direito mira; A/✕ pula, B/○ dá dash, RB/R1 ataca, LB/L1 defende, X/□ chuta, Y/△ usa especial, L3 provoca. Tudo pode ser remapeado em **OPÇÕES**.

O pulo padrão deixou de usar W: **W aponta o dash para cima; Espaço pula**. Seus mapeamentos anteriores são aproveitados, com migração dos padrões e sem ocupar uma tecla de combate personalizada.

Um golpe limpo continua fatal. Perfect Parry, finta, ataques durante dash, clash, especiais, treino e replay permanecem. Espadachim e Ceifador atacam um pouco mais devagar; a estocada do Lanceiro ficou ligeiramente mais larga. Bastonista agora se chama **Monge**: o ataque comum cobra um pouco mais de cuidado, e a Varredura ganhou alcance e tempo ativo.

## Parkour

Escolha a aba **PARKOUR**. O Corredor é exclusivo desse modo e usa o mesmo motor de movimento do duelo.

- **Solo / contra IA:** escolha de 1 a 8 corredores totais. 1 significa correr sozinho. A dificuldade determina o ritmo e as escolhas dos bots.
- **Local:** dois jogadores, teclado/mouse + controle, com câmeras independentes lado a lado.
- **Online:** até oito participantes, cada um com sua câmera.

As pistas são **Caminho dos Ventos** (horizontal), **Escadaria do Céu** (vertical) e **Rota das Brasas** (mista, com plataformas móveis e frágeis). Procure rotas altas e atalhos; os portais de checkpoint precisam ser atravessados em ordem.

A contagem 3, 2, 1 bloqueia movimento; o cronômetro começa no VAI. Cair retorna ao último checkpoint após 0,5 s. Há proteção contra chutes durante 1 s após respawn; usar seu próprio chute encerra a proteção.

**Contato** começa desligado. Quando ligado, o chute empurra levemente. Os corpos se atravessam; armas, parry e especiais continuam desativados. **Permitir todas as classes** libera os personagens do duelo com seus atributos de movimento.

A classificação considera checkpoints e progresso no trecho, inclusive nas subidas. A chegada fixa sua posição e seu tempo. Depois do primeiro colocado, os demais têm 30 s por padrão (configurável de 5 a 180 s). Quem não conclui recebe DNF. Quem chegou pode clicar em **ASSISTIR OUTRO CORREDOR**.

## Sala online

Todos devem abrir a **V7**. A edição normal e a ADMIN são compatíveis entre si; salas antigas não são compatíveis.

1. Selecione **ONLINE** para duelo, ou **PARKOUR → Online** para corrida. Digite seu nome e escolha sua cor.
2. Uma pessoa cria a sala e compartilha os seis caracteres. As demais entram com esse código.
3. No duelo, o anfitrião ou um ADMIN escolhe os assentos **Jogador 1 / Jogador 2 / Espectador**. São dois lutadores e até seis espectadores. O anfitrião também pode assistir.
4. Os participantes escolhem cores diferentes e clicam em **ESTOU PRONTO**. Espectadores não precisam confirmar. O anfitrião ou ADMIN clica em **COMEÇAR**.
5. Entre partidas, a sala continua aberta: é possível trocar os lutadores e escolher personagens para a revanche. Na corrida, todos os membros presentes na largada correm.

Entrar durante a partida coloca você como espectador até a próxima. Se um lutador sair, o duelo é interrompido e a sala permite substituí-lo. Na corrida, a saída marca DNF e os demais continuam. Se o anfitrião sair, a sala encerra com aviso.

Abrir controles/menu não pausa a partida online. O ADMIN pode pausar globalmente. Mantenham as abas visíveis durante a partida.

Não é necessário contratar hospedagem para jogar com esses arquivos. O online precisa de internet para sinalização PeerJS e conexão direta WebRTC; algumas redes podem bloquear essa conexão.

## Dia/noite e apresentação

Escolha **DIA / NOITE** junto às arenas. Layout, colisões e física são idênticos; mudam o céu, a iluminação e a atmosfera. A escolha é compartilhada online. Fundos personalizados são preservados.

As quatro telas iniciais antigas receberam ambientação adicional; Jardins Suspensos e Cerejeiras foram preservados. Todas as classes e o Corredor têm provocações. Novas poses acompanham apoio na parede, salto, queda rápida e mudança de direção. Baixo, Médio, Alto, Ultra e sombras independentes continuam disponíveis.

## Editor de pistas

Em **CRIAR MAPA**, selecione o tipo **Parkour** e clique em **NOVO**, ou abra uma das três pistas como modelo. Modelos geram uma cópia editável.

- Coloque **LARGADA**, **CHEGADA** e **CHECKPOINTS** em pisos fixos e seguros.
- Selecione um checkpoint para editar posição/tamanho ou movê-lo antes/depois na ordem.
- Use **PONTO DA ROTA** no trecho escolhido para desenhar o caminho de referência da classificação, principalmente em voltas e subidas. Esses pontos não criam paredes nem obrigam uma trajetória física.
- Plataformas, paredes, peças móveis/frágeis, imagens, clima e decoração continuam disponíveis.
- Use zoom e rolagem para editar percursos grandes; **TESTAR CORRIDA** abre uma tentativa solo com retorno ao editor.
- Salve, exporte e importe como antes. O arquivo preserva o tipo, portais, ordem e rotas. O editor informa dados essenciais ausentes ou inválidos.

Salvar mantém uma cópia no navegador e baixa um arquivo quando não há pasta escolhida. Em navegadores compatíveis, **ESCOLHER PASTA** permite gravar diretamente nela. Faça uma exportação para levar seu mapa a outro computador.

## ADMIN

Pressione **\*** durante a partida na edição ADMIN. Funciona como anfitrião, convidado ou espectador; os comandos são sincronizados. No duelo, mantém todas as ferramentas anteriores, além de dia/noite.

No Parkour: editar regras de movimento, trocar pista, mudar classe ao vivo, voar, alterar tamanho do corpo, repor dashes, retornar ao checkpoint, pausar, avançar um quadro e alterar a velocidade da simulação. Os campos administrativos de movimento permitem valores além dos limites do menu comum.

## Verificação

124 grupos de testes de combate, movimento, corrida, controles e protocolo, mais 22 cenários de chave de torneio. As duas builds têm seus scripts verificados.

No Chrome: treino, editor/teste, corrida solo, tela dividida, ADMIN, vinte variantes de arena, três pistas, poses e fundos. O controle local foi simulado nos testes; não foi testado com um controle físico nesta entrega.

Online real PeerJS/WebRTC em contextos isolados do Chrome no mesmo computador: dupla, espectadores, sala cheia 2+6, oito corredores, anfitrião assistindo, ADMIN convidado, revanche, desconexões, entrada durante a partida, mapa com imagem personalizada e prazo dos especiais. Isso não substitui teste entre PCs em redes externas diferentes.

As fontes da V7 estão em **work/v7**. Versões anteriores foram preservadas.
