# Fontes da V5

O assembler é `build.cjs`. Execute com Node para gerar `outputs/um-corte-v5.html` e `outputs/um-corte-v5-admin.html`. Os arquivos HTML resultantes incluem todos os scripts, estilos e PeerJS.

`serve.cjs` oferece a prévia em `http://127.0.0.1:4179`. Abrir o HTML diretamente também funciona.

Os arquivos `upgrade-*.cjs`, `fix-*.cjs`, `polish.cjs`, `replay-polish.cjs` e `safe-spawns.cjs` registram migrações já aplicadas: **não os execute novamente**. O runtime final está nos `.js`, `.css` e `shell.html`. Os `.inc` são registros das inserções originais; não são montados pelo build.

Verificações do motor: `test-core.cjs`, `features-test.cjs`, `release-test.cjs`, `v5-test.cjs`.

Verificações de navegador: `ui-check.cjs`, `browser-v5.cjs`; a segunda precisa do servidor na porta 4179. Ambas usam Playwright e Chrome nos caminhos configurados neste computador.

Verificações online: `online-check.cjs` e `online-chaos.cjs`. Precisam de acesso de rede para PeerJS; a segunda também usa a prévia na porta 4179. Os testes rodam dois contextos separados do Chrome e registram resultados em JSON.

Regras de combate e dados reproduzíveis ficam em `engine.js`. `lighting.js`, `renderer.js`, `actors.js` e `audio.js` são apresentação. `session.js` agrega dados fora da simulação; `lab.js` grava quadros e guarda o melhor destaque. Protocolo online e snapshots da V5 usam versão 50.
