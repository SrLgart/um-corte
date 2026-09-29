# UM CORTE V6.2 — fonte e validação

Entrada de build: `node work/v62/build.cjs`. Gera os dois HTML autocontidos em `outputs/`. Servidor local: `node work/v62/serve.cjs`, porta 4182.

`app.js`, `engine.js`, `shell.html` e os módulos/CSS listados em `build.cjs` são a fonte vigente. `tournament.js` é o modelo da chave; o código de interface já está integrado em `app.js`. `tournament-app.inc` é uma referência da integração inicial, não um include de build.

**Não executar novamente** os scripts de migração `upgrade.cjs`, `integrate-v62.cjs`, `tournament-integrate.cjs`, `finisher-integrate.cjs` e `test-adjust.cjs`. As alterações já foram aplicadas. `build.cjs` pode ser executado normalmente.

## Validação

- `test-core.cjs`: 42 grupos de combate.
- `release-test.cjs`: 10 grupos de regras, carga persistente e meta administrativa empatada.
- `features-test.cjs`: 8 grupos de classes, skins e mapas.
- `v5-test.cjs`: 15 grupos de Caos, sessão, métricas, replay e causas.
- `v6-test.cjs`: 8 grupos de Perfect Parry, decoração, animações e formatos.
- `tournament-test.cjs`: 22 chaves de 2 a 32 participantes, todos os pontos de eliminação, políticas de arena, ranking e rejeição de resultados duplicados.
- `browser-v62.cjs`: vitória por três partidas, eliminação precoce, classe/skin, ADMIN e renderização sem mutação da física. Resultado em `browser-result.json`, capturas PNG nesta pasta.
- `ui-check.cjs`: clique versus corte, configurações persistentes, roundtrip de presets/editor, mapa aleatório por último e atalho ADMIN com exclusão de campos de texto. Resultado em `ui-result.json`.
- `online-check.cjs`: três combinações de ADMIN, sincronização, introdução limitada a 10 segundos, revanche e persistência de carga. Resultado em `online-result.json`.
- `online-chaos.cjs`: mapa personalizado com sino, qualidades Baixo/Ultra independentes, Caos, replay e estatísticas. Resultado em `online-chaos-result.json`.

Os testes de navegador usam Playwright e Chrome instalados neste ambiente, com caminhos explícitos nos scripts. Os testes online precisam de acesso de rede à sinalização PeerJS; usam dois contextos isolados no mesmo PC, não duas redes externas.

## Decisões

O torneio é somente PvE. Cada derrota encerra a tentativa e resolve por simulação os confrontos restantes entre bots. O ranking diferencia eliminados na mesma fase por saldo de rounds, rounds vencidos e sorteio inicial. Classe humana e adversários são definidos no início. A edição ADMIN também bloqueia a troca de classe no torneio.

As mudanças de cenário são cosméticas; layouts físicos são preservados. O Perfect Parry recebe 110 ms de apresentação sem mudança no tempo simulado de hitstop. Finalizações animam cópias visuais dos personagens, mantendo intacto o estado do motor.

Protocolo online e snapshots usam versão 62, prefixo de sala `umcorte-v62-`. Arquivos de mapas e presets mantêm seus formatos compatíveis. As fontes e entregas V6 anteriores não foram substituídas.
