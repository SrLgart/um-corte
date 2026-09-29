# UM CORTE V7 — CONTROLE

Fonte da versão V7. A base V6.3 permanece em `../v63`.

## Build

`node work/v7/build.cjs` a partir da raiz do projeto gera os HTMLs normal e ADMIN em `outputs/`.

O fluxo de arquivo único foi preservado. `v7-ui.js` é inserido no marcador V7_INTEGRATION dentro de app.js; depende desse escopo. `parkour.js` reutiliza o motor de movimento do Game. `room.js` gerencia a sala PeerJS com protocolo 70; prefixo de sala exclusivo da V7.

## Verificação

`node work/v7/test-all.cjs` executa 124 grupos de teste e 22 cenários de torneio, verifica os scripts das duas builds e salva logs em outputs.

`node work/v7/serve.cjs` serve as builds em http://127.0.0.1:4187. Os scripts browser-*.cjs usam Playwright e Chrome instalados no runtime local; seus caminhos ficam no cabeçalho dos arquivos.

Testes de navegador: smoke, features (local/editor/ADMIN/treino), room (três clientes), crowd (dois lutadores + seis espectadores, assentos e revanche), crowd --race (oito corredores), latejoin (mapa personalizado com imagem, prazo de especiais, ADMIN), visual (arenas, pistas, fundos e poses).

## Entrega

- outputs/um-corte-v7.html
- outputs/um-corte-v7-admin.html
- outputs/LEIA-ME-V7.md

QA concluído em 26/09/2026. Online testado com conexões WebRTC reais em contextos isolados do mesmo Chrome; controle local simulado. Não foram utilizados serviços de publicação nem alteradas as versões anteriores.
