# UM CORTE V6.2 — Um caminho até o título

## Torneio eliminatório contra IA

1. Escolha **TORNEIO**, seu personagem, skin e cor.
2. Defina de **1 a 5 duelos até o título**: isso forma uma chave com 2, 4, 8, 16 ou 32 participantes.
3. Escolha a dificuldade: Fácil, Normal, Adaptativo ou Impossível. Cada duelo usa a quantidade de pontos e as regras configuradas antes do torneio.
4. Escolha como as arenas funcionam: selecionar antes de cada duelo, manter uma arena fixa ou sortear arenas sem repetição até esgotar a lista. Seus mapas personalizados também participam.
5. Entre no torneio. O personagem fica fixo até o fim. Se escolher Aleatório, a classe é sorteada uma única vez.

Uma derrota elimina você. Ao conquistar o título ou ser eliminado, aparece a classificação completa, do primeiro ao último. A chave também pode ser consultada antes de cada duelo. Os outros confrontos entre bots têm resultados simulados; os seus duelos são jogados normalmente.

A classificação considera a fase alcançada. Entre eliminados na mesma fase, usa saldo de rounds, rounds vencidos e o sorteio inicial como último desempate. Cada duelo é uma partida nova: a carga especial começa vazia e pode ser preservada entre os rounds dessa partida.

O torneio desta versão é local, contra IA. Sair para o menu encerra a tentativa; não há salvamento de torneio em andamento.

## O que mudou no visual

- **Ponte Quebrada:** cânion ensolarado, penhascos terracota, rio ao fundo, madeira, cordas e bandeiras.
- **Ruínas:** arenito, arcos antigos, dunas e detalhes turquesa.
- **Santuário Suspenso:** céu azul, nuvens brancas e jardins verdes nas alturas.
- As três arenas mantêm suas plataformas, paredes e colisões anteriores.
- Finalizações ganharam movimentos do vencedor, cortes em deslocamento, arcos e ondas que se expandem e se dissipam. Continuam exclusivas do ponto que encerra a partida, com o mesmo acréscimo de 0,65 segundo.
- O cursor do sistema fica invisível na tela inicial. O rastro agora tem pontas afiladas; clique normal e gesto de corte continuam separados. A mira do combate permanece igual.
- Mapa Aleatório ganhou miniatura neutra e continua por último, inclusive depois de criar ou importar mapas.

## Personalização e Perfect Parry

**Manter carga do especial entre rounds** agora começa ligado. Pode ser desativado normalmente; presets importados mantêm a escolha que foi salva neles. Efeitos temporários e penalidades não atravessam o round.

O impact frame do **Perfect Parry** passou de 75 para **110 ms**. Essa mudança é visual: a janela de precisão de 80 ms, a defesa, o hitstop real e o atordoamento continuam iguais. A opção de reduzir flashes e movimento continua funcionando.

**Salvar, carregar, exportar e importar presets** agora ficam no final de **PERSONALIZAR PARTIDA**. Digite o nome que quiser em “Nome do preset”. A exportação usa um arquivo pequeno `.umcorte-preset.json`; para carregar, importe e confirme em APLICAR REGRAS.

## ADMIN

Durante a partida na edição ADMIN, pressione **\***. Funciona também no asterisco do teclado numérico. O atalho não é acionado enquanto você está digitando em um campo.

O painel mantém edição de regras, mapas, posições e prévias de animação. No torneio, a troca de classe fica bloqueada para preservar a regra de personagem fixo. Baixar a meta de pontos em um placar empatado espera o próximo ponto para decidir o vencedor.

As prévias visuais devem ser usadas com a simulação pausada. No offline, abrir o painel pausa automaticamente; no online, use PAUSAR / RETOMAR. ADMIN continua funcionando como anfitrião, convidado ou nos dois lados, com comandos sincronizados.

## Controles e modos

- A / D ou setas: mover. Mouse: mirar.
- Espaço / W: pular; segurar aumenta a altura.
- Mouse esquerdo / J: atacar. Mouse direito / K: parry.
- Shift: dash. Baixo + dash: deslizar.
- E / L: chute. F: especial.
- Parry durante o início do ataque: finta.
- R no treino: restaurar a posição salva.

Mapeamento em OPÇÕES. PvE, treino, local com teclado/mouse + controle, online, editor, skins, Caos, estatísticas, replay e as quatro qualidades gráficas continuam disponíveis. Um golpe limpo sempre mata.

## Online

Os dois jogadores precisam abrir **a V6.2**, comum ou ADMIN. Um cria a sala e compartilha o código; o outro entra, escolhe personagem e cor e confirma. A revanche mantém a escolha de personagem.

Precisa de internet para a conexão PeerJS/WebRTC. As salas V6.2 são separadas das anteriores. Não precisa contratar hospedagem para abrir esses arquivos. Redes restritivas podem bloquear a conexão direta.

## Verificação desta entrega

Passaram 83 grupos de testes do combate e regras, além de 22 chaves de torneio cobrindo todos os tamanhos, vitória e eliminação em cada fase. No Chrome, foram verificados o torneio completo e a eliminação precoce, menu, presets, editor, ADMIN, arenas e finalizações sem alteração do estado do combate ao desenhar.

Online verificado com PeerJS/WebRTC real em dois contextos isolados do Chrome no mesmo PC: ADMIN em qualquer lado, dois administradores, revanche, mapa personalizado, Caos Ultra e qualidades gráficas diferentes. Não equivale a um teste entre dois computadores em redes externas distintas.

As versões anteriores continuam preservadas.
