# UM CORTE VI — Cada corte tem uma história

Abra **UM-CORTE-V6.html** no Chrome ou Edge. O jogo está completo nesse arquivo: não precisa instalar nem contratar hospedagem. Para jogar online, ambos precisam de internet e da V6.

## Experimente primeiro

1. Na tela inicial, segure o mouse esquerdo e faça um movimento rápido sobre as letras ou partículas. Elas se cortam; as letras se recompõem. Um clique normal em **JOGAR** abre a seleção.
2. Em **OPÇÕES → QUALIDADE GRÁFICA**, escolha **Ultra**. O Alto continua como padrão. Ultra acrescenta bloom por shader, fachos de luz, reflexos e sombras suaves. Sombras e redução de flashes/movimento são opções independentes, salvas no navegador.
3. Entre no treino no **Pátio dos Sinos** e acerte o sino. Experimente também **Telhados da Chuva**, com lanternas, bandeiras, bambu e um vão fatal.
4. Faça um parry no instante do impacto: os primeiros **80 ms** de uma guarda válida ativam o **Perfect Parry**. Uma janela personalizada menor também limita esse tempo. O stun e a vantagem são os mesmos do parry normal; o impacto visual e o som são diferentes.

## Personalidade e apresentação

A tela inicial sorteia um dos quatro ambientes ao abrir/recarregar: dojo com pétalas, bosque noturno, chuva nos telhados ou forja com brasas. O cenário permanece ao voltar pelo botão INÍCIO. O cursor especial só aparece nos menus; durante o duelo, a mira continua igual.

As seis classes receberam entrada e retorno de guarda, gestos de espera, postura mais tensa no ponto decisivo e retorno estilizado após Perfect Parry. Os gestos secundários aparecem de tempos em tempos enquanto o personagem está parado; ações e mudanças de mira interrompem a espera. São animações cosméticas, sem alterar hitboxes ou atributos.

Somente o golpe que encerra a partida ganha uma assinatura por classe: corte pesado, estocada, corte curto, risco de espada longa, meia-lua ou onda de impacto. A apresentação acrescenta **0,65 segundo**. Quedas têm um tratamento próprio. Os rounds intermediários mantêm seu ritmo.

## Editor de mapas V2

Em **CRIAR MAPA**, escolha **Sino / Lanterna / Bambu / Bandeira / Vaso** e clique na arena para colocar. Use SELECIONAR para mover ou alterar coordenadas; EXCLUIR PEÇA remove. DESFAZER e REFAZER continuam disponíveis.

Escolha também o clima: folhas, pétalas, chuva, neve ou brasas. Os objetos são decorativos: não bloqueiam ataques, não geram clash e não consomem o golpe. O sino balança e toca; lanternas, bambu e vasos se quebram; bandeiras se rasgam. Eles voltam ao estado inicial em cada round.

Salvar no navegador/pasta, exportar, importar e testar continuam disponíveis. Mapas anteriores sem esses campos são aceitos. Os arquivos incluem objetos e clima e são compartilhados com o adversário online. Arena aleatória continua sendo a última opção.

## Presets pessoais

Ajuste as regras, digite um nome como **TURBO DO LUIZ** e clique em **SALVAR PRESET**. CARREGAR mostra uma revisão antes de aplicar. EXPORTAR cria um pequeno arquivo `.umcorte-preset.json` com o nome digitado e as regras atuais. Seu amigo usa IMPORTAR e confirma em APLICAR REGRAS.

Os presets pessoais incluem todas as regras da partida: pontos, especiais, Caos, movimento, ataque etc. Não incluem personagens, skins, arena escolhida, controles ou qualidade gráfica. Os quatro presets de combate anteriores continuam alterando somente o combate. Os presets pessoais ficam salvos neste navegador; exporte para levar a outro PC.

## Controles e modos preservados

- A / D ou setas: mover. Mouse: mirar.
- Espaço / W: pular; segurar aumenta a altura.
- Mouse esquerdo / J: atacar. Mouse direito / K: parry.
- Shift: dash. Baixo + dash: deslizar.
- E / L: chute. F: especial.
- Parry durante o início do ataque: finta.
- R no treino: restaurar a posição salva.

O mapeamento fica em OPÇÕES. PvE com dificuldades, treino, local com teclado/mouse + controle, online, skins, Caos, estatísticas e replays continuam disponíveis. Um golpe limpo sempre mata.

## Online

Um jogador usa **ONLINE → CRIAR SALA** e compartilha o código. O outro usa ENTRAR. Escolham personagens e cores diferentes; ambos confirmam. Os objetos, as regras e os resultados se sincronizam. A qualidade visual é individual: Baixo e Ultra podem jogar juntos.

As salas da V6 são separadas das versões anteriores. A conexão usa PeerJS/WebRTC e precisa de internet; redes que bloqueiam conexão direta podem impedir uma sala. Na revanche, a seleção de personagens continua disponível.

## Edição ADMIN

Abra **UM-CORTE-V6-ADMIN.html** e use **Ctrl + Shift + F10** durante a partida.

O ADMIN mantém todas as opções anteriores, inclusive nos dois lados de uma sala. Agora também oferece prévias de **IDLE / TENSÃO / PARRY / PERFECT / FINALIZAÇÃO** e seleção do personagem que será exibido. Pause a simulação para usar essas prévias; no offline, abrir o painel já pausa automaticamente. No online, use PAUSAR / RETOMAR e aguarde a sincronização.

Ao escolher uma prévia, o painel se recolhe para deixar a arena visível. **PARAR / PAINEL** cancela a prévia e devolve o formulário. Elas não causam mortes, pontos, recarga ou mudanças nas estatísticas. No online, a prévia aparece nos dois clientes. FECHAR volta ao jogo; se você pausou manualmente, retome antes de fechar.

## Validação

Passaram 82 grupos de testes do motor, verificações no Chrome das quatro qualidades e dez arenas, importação/exportação, presets, gestos do menu e prévias ADMIN. Os testes conferem que desenhar as animações não altera o estado da simulação.

Online testado com PeerJS/WebRTC real entre dois contextos isolados do Chrome no mesmo computador: ADMIN anfitrião/convidado/ambos, comandos simultâneos, limite de confirmação, revanches, mapa personalizado com sino, Baixo versus Ultra, Caos, estatísticas e replay. Ainda não é uma validação entre dois computadores em redes externas diferentes.

A V5 foi preservada. O histórico do jogo contém a entrada V6.
