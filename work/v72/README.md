# UM CORTE V7.2 — MOVIMENTO LIVRE

Fonte da V7.2. A V7 foi preservada em ../v7. Arquivos únicos normal e ADMIN, sem mudança de framework.

## Build e execução

- node work/v72/build.cjs gera outputs/um-corte-v7.2.html e outputs/um-corte-v7.2-admin.html.
- node work/v72/serve.cjs serve as duas builds em http://127.0.0.1:4188.
- Os HTMLs também funcionam diretamente no Chrome/Edge, sem instalação.
- v7-ui.js continua inserido no escopo existente de app.js. Não renomear o marcador V7_INTEGRATION isoladamente.

## Regras da V7.2

W e Espaço compartilham jump e jumpHeld. W continua sendo up para o dash. O leitor de comandos suprime jump no mesmo quadro do dash; o motor limpa o buffer durante dash. Um pulo já executado em quadro anterior não é desfeito.

airJumps começa em 1, é gasto pelo impulso aéreo e volta a 1 ao aterrissar. Wall jump não gasta nem restaura. doubleJumpTime é apenas pose/efeito. Ambos entram nos snapshots. Parkour herda moveFighter, sem motor paralelo.

makeMap aplica 1,5 × rules.mapSize somente a duelos. Geometria, spawns, objetos e movimento de plataformas usam a escala; personagens não. Dados de mapa permanecem nas unidades originais. Parkour continua em escala física 1.

Dash: 320 ms / Turbo 240 ms. Ceifador: startup 0,29 / recovery 0,465 antes do multiplicador-base de ataque 1,25. Lança: meia largura máxima 15 × SCALE, alcance final preservado e zona próxima ainda fraca. Monge conserva ataque e especial.

Controle salvo em um-corte-v72-controls, com migração de V7/V3 que respeita teclas personalizadas. Rede e replay usam versão 72, prefixo umcorte-v72-. Normal e ADMIN são compatíveis entre si; V7 não entra nesta sala.

## Testes

node work/v72/test-all.cjs executa 144 grupos mais 22 cenários de torneio e analisa os scripts das duas builds. Os testes antigos com coordenadas fixas usam mapSize 2/3 para conservar a geometria original; v72-test verifica separadamente a nova escala real 1,5.

browser-v72: teclas reais, seleção 1/9, prioridades e chuva em 1600×1000, 1280×720 e 390×844.
browser-features: tela dividida, controle simulado, editor, ADMIN e treino.
browser-visual: arenas dia/noite, pistas, poses e fundos.
browser-crowd [--race]: PeerJS/WebRTC real com 8 clientes, W + dash, double jump, sincronização e ADMIN. Sem --race também assentos, espectadores e revanche; com --race também seleção Corredor e DNF.
browser-latejoin: prazo dos especiais, imagem de mapa personalizado, espectador tardio, ADMIN frame/tempo.
browser-smoke e browser-room preservados.

Os testes de navegador usam Playwright e Chrome cujos caminhos estão nos arquivos. Online requer rede. Testado em contextos isolados no mesmo PC; redes externas distintas e controle físico não foram testados.

Guia do jogador: outputs/LEIA-ME-V7.2.md.

