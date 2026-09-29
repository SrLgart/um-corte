# UM CORTE V6 — fonte de desenvolvimento

Os módulos `.js`, os estilos `.css`, `shell.html` e `admin.html` são a fonte atual. `build.cjs` gera os dois arquivos independentes em `outputs/`.

- `engine.js`: combate, snapshots, Perfect Parry, objetos determinísticos e validação de mapas/presets.
- `presentation.js`: poses cosméticas, objetos, clima, cenários adicionais e finalizações. Não altera fighters originais nem geometria de colisão.
- `menu-fx.js`: quatro ambientes iniciais, partículas cortáveis, letras recompostas e separação clique/arrasto.
- `post-fx.js`: bloom WebGL em resolução limitada e composição sobre o canvas 2D. Os efeitos adicionais do Ultra permanecem se WebGL não estiver disponível.
- `lighting.js`: qualidades e preferências locais. Alto continua padrão.
- `editor.js` e o bloco do editor em `shell.html`: edição de mapas. O `editor.html` é uma referência do bloco; o build utiliza o bloco já incorporado no shell.
- `app.js`: UI, presets pessoais, efeitos e integração do protocolo ADMIN.
- `network.js`: protocolo 60, salas `umcorte-v6-`, PeerJS/WebRTC.

`prepare.cjs`, `integrate.cjs`, arquivos `.inc` e scripts `*-fix*.cjs` / `*-finish.cjs` registram etapas já aplicadas da migração. **Não devem ser executados novamente.** Edite os módulos finais e use apenas `build.cjs` para remontar.

## Verificação

`node verify.cjs`: 82 grupos de regressão/motor e parsing dos scripts das duas edições.

`node serve.cjs`: prévia local na porta 4180.

`browser-v6.cjs`: interações reais, importação/exportação, todas as qualidades e arenas, poses por classe, ADMIN e capturas. Usa Chrome/Playwright locais.

`visual-check.cjs`: postura das armas, janela compacta e comparação Alto/Ultra sobre a mesma simulação (58% dos pixels mudaram na captura de teste).

`online-check.cjs`: salas reais, três combinações ADMIN, prévias sincronizadas, confirmação com limite, comandos concorrentes e revanche.

`online-chaos.cjs`: mapa personalizado com sino, golpe fatal que toca o sino nos dois clientes, Baixo/Ultra, Caos, replay e sessão. Os testes de rede precisam de acesso ao serviço público de sinalização. Foram executados em dois contextos isolados no mesmo computador, não em redes externas diferentes.

Resultados: `verification.json`, `browser-result.json`, `online-result.json`, `online-chaos-result.json`. `render-performance.json` mede tempo de submissão de desenho no ambiente de teste; não é uma promessa de FPS em outros computadores.

V5 e anteriores foram preservadas. Não copie o conteúdo da V6 sobre esses arquivos.
