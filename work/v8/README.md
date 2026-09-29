# UM CORTE V8 — Caminho do Guerreiro

Handoff técnico atual: [../../docs/README.md](../../docs/README.md). A base de desenvolvimento continua aqui; não edite os HTMLs como fonte. `node tools/build.cjs`, executado na raiz, gera os dois HTMLs em `build/`; o comando histórico abaixo continua usando `outputs/`. Referência original e ZIP das fontes em `archive/V8_FINAL_MONOLITHIC/`. A documentação nova distingue limitações técnicas de feedback visual reservado à V8.5.

Implementação V8 entregue após auditoria automatizada e visual local. Evidências e limites em AUDIT-V8.md. A V7.2 permanece em ../v72 e nos respectivos HTMLs em outputs.

## Gerar e executar

Da raiz do projeto:

    node work/v8/build.cjs
    node work/v8/serve.cjs

Gera outputs/um-corte-v8.html e outputs/um-corte-v8-admin.html. Servidor: http://127.0.0.1:4189/um-corte-v8.html. Para ADMIN, use o sufixo -admin.html. Se já estiver servindo, basta reconstruir e atualizar a página.

## Fontes

- SPEC-V8.txt e DECISIONS.md: escopo e decisões aprovadas.
- PROGRESS.md: andamento, evidências e pendências.
- upgrade-core.cjs: fonte das alterações no motor; gera engine.js.
- integrate.cjs: regenera integração e arquivos herdados, incluindo app.js, renderer.js, actors.js, controls.js, room.js, shell.html, audio.js, build.cjs e serve.cjs. Altere o gerador, não seus resultados.
- path.js, path-watch.js, legacies.js, legacy-combat.js, v8-detail.js, v8-ui.js, v8-visuals.js, v8-actors.js e v8.css: fontes diretas.
- legacy-catalog.js: catálogo congelado de 115 Legados; explicações complementares em L.helpText, no v8-detail.js.

Depois de alterar o motor, execute node work/v8/upgrade-core.cjs. Depois de alterar a integração, execute node work/v8/integrate.cjs. Por último, gere os HTMLs com build.cjs. Não reaplique automaticamente migrations ou refine-*.cjs: já foram executados.

## Caminho e limites

Solo com espectadores, 50 níveis, primeiro a 3 por padrão. Perder a partida encerra a run; perder um duelo não. Em grupo, todos os adversários precisam ser derrotados para pontuar. A continuação fica no navegador do dono.

sealPathMap preserva faces internas e índices de plataformas, prolonga as paredes laterais para cima e retira seus antigos topos da área jogável. Contenção horizontal cobre deslocamentos especiais e voo administrativo. Wall jump e wall slide permanecem disponíveis. O desenho recorta as paredes à região visível, sem percorrer sua altura física inteira.

## Verificação

    node work/v8/test-all.cjs

Inclui regressões herdadas, testes V8 e análise dos scripts de ambas as builds. Testes de navegador são separados e usam Playwright/Chrome; consulte cada arquivo para caminhos e opções.

Limites: path-boundary-test.cjs e browser-path-boundaries.cjs. Continuação: browser-path-save.cjs. Apresentações/espectadores: browser-boss-intro-art.cjs, browser-path-intro-flow.cjs e browser-path-watch.cjs. Câmera: browser-path-camera.cjs.

RTC foi testado com clientes locais e sinalização de teste; Internet pública, balanceamento humano e avaliação sonora humana permanecem pendentes. Entradas de bosses são vinhetas sobrepostas, sem deslocar atores reais.

Auditoria de entrega: AUDIT-V8.md. A suíte inclui path-full-run-test.cjs (oito progressões completas de 50 níveis), path-outcome-test.cjs (contadores/recordes) e path-endurance-test.cjs (12 encontros prolongados). browser-late-game-stress.cjs exercita 33 Legados, três oponentes, renderização e snapshots; números de tempo headless não são uma promessa de FPS.

Regressões de navegador executadas contra a V8: browser-file.cjs, browser-v72.cjs, browser-features.cjs, browser-crowd.cjs e browser-latejoin.cjs. O nome browser-v72 identifica o conjunto herdado, mas a URL e a release esperada são da V8. Outros scripts antigos não devem ser contabilizados como testes da V8 sem revisar suas URLs.

Guia: outputs/LEIA-ME-V8.md na raiz do projeto.

Textos das cartas: L.descriptionText e L.describe em v8-detail.js, separados do catálogo congelado. Verificação da UI/busca: node work/v8/browser-copy-check.cjs.
