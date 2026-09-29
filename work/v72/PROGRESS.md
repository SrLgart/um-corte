# UM CORTE V7.2 — CONCLUÍDA

Fonte work/v72; V7 preservada em work/v7. Sem refatoração de framework ou motor paralelo.

## Entrega

outputs/um-corte-v7.2.html
outputs/um-corte-v7.2-admin.html
outputs/LEIA-ME-V7.2.md

Servidor de revisão: http://127.0.0.1:4188/um-corte-v7.2.html (Node serve.cjs).

## Implementado

W + Espaço; prioridade do dash simultâneo sem gastar o segundo pulo.
Um pulo aéreo extra com pose e burst, restaurado ao aterrissar; parede não altera carga.
IA dupla e corrida; snapshots/replay/protocolo 72; padrões de teclado migrados respeitando remapeamentos.
Dash 320 ms / Turbo 240 ms. Ceifador .29/.465 bruto; lança mais consistente; Monge preservado.
Novo Normal de arena = antiga escala 1.5. Geometria/objetos/plataformas/spawns escalam; corpos não.
Corredor selecionável e visível, sozinho ou com oito classes. Perfil online acompanha a seleção.
Três pistas com percurso útil 2–3x, novas seções, atalhos e CP. Sem mudar câmera individual.
Respawn da corrida reconhece imediatamente a plataforma do checkpoint, evitando saltos cegos da IA.
Chuva em 3 camadas coerentes, respingos nos telhados, bordas molhadas, goteiras, reflexos e névoa; no máximo 210 gotas/48 respingos. Demais cenas preservadas.
Identificação e histórico atualizados. Normal e ADMIN incluem tudo.

## Verificado

test-all: 144 grupos + 22 cenários de torneio. Ambas builds: 22 scripts analisados.
v72-test: 20 grupos novos, incluindo controles reais em harness, variável/buffer/coyote, double jump, parede, dash, replay, física compartilhada, escala, props/móvel/frágil e IA.
27 combinações de corredor/pista completadas por IA Normal (todos os 9 corredores nas 3 pistas).
Runner também conclui todas as pistas em Fácil e Mestre nos testes legados.
browser-v72: W/Espaço e dash, cartões 1/9, retorno ao duelo, chuva 1600×1000 /1280×720 /390×844, corte/click.
browser-features: local com duas câmeras, gamepad simulado, ADMIN, editor/teste, treino.
browser-file: normal e ADMIN abertos por file:// sem servidor, movimento e padrões corretos.
browser-visual: 20 arenas dia/noite, 6 vistas de pistas, 4 fundos, 27 poses. Capturas finais em outputs/v72-*.png.
PeerJS/WebRTC real: browser-crowd --race, 8 corredores; browser-crowd, 2 lutadores +6 espectadores. W+dash, double jump, todos os estados/recargas iguais ao pausar via ADMIN; classe ao vivo, DNF, assentos e revanche.
browser-latejoin: limite dos especiais com 1 sem confirmar, imagem de mapa customizado, noite, espectador tardio, avanço de quadro e tempo ADMIN.
Sem erros JS nas verificações de navegador.

Limites da validação: rede em contextos Chrome isolados no mesmo computador; não em redes externas diferentes. Controle físico não disponível, API de gamepad simulada.

Node: C:/Users/Luiz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe
Playwright no runtime dependencies/node/node_modules/playwright. Chrome instalado.


