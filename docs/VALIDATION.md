# Entrega técnica e evidências — 28/09/2026

## Resultado

V8 funcional preservada. Nenhum runtime de combate, física, rede, IA, renderização, áudio, mapa ou UI foi alterado. Nenhum arquivo de runtime foi movido. A organização adotada mantém `work/v8` como base, conforme esclarecimento posterior do usuário, e explicita seus geradores/dependências. Não foi criada uma cópia paralela em `/src`.

## Alterações técnicas realizadas

- `work/v8/build.cjs` aceita diretório de saída opcional, mantendo outputs como padrão. A mesma mudança está na fonte `integrate.cjs` para sobreviver à regeneração.
- `tools/build.cjs` chama o build existente com destino build; package.json oferece atalhos sem novas dependências.
- README raiz e de work/v8 apontam para fontes/documentação. PROGRESS recebeu nota de handoff sem apagar o histórico.
- Ferramentas document-data/document-catalog extraem dados e geram catálogos documentais; não participam da execução do jogo. check-docs verifica cobertura/links. smoke-build testa os HTMLs de distribuição diretamente.
- Nenhuma correção de gameplay foi necessária ou aplicada. Uma falha inicial do novo smoke era seletor ambíguo de teste (`data-mode=pve` também existe na section do menu); foi corrigido para `button[data-mode]`, sem tocar a UI.

## Preservação por SHA-256

| Artefato | SHA-256 idêntico em archive, outputs e build |
|---|---|
| Normal | `6f29be4ddec7236d83f0f11b04a45a075ddf53ca6345f9cc8e9268c87644b782` |
| ADMIN | `7a1040258935b10ff24ccdf19b89d1ac98ccc268572a2b03c6831826dd71a836` |

Essa igualdade byte a byte é evidência mais forte de ausência de mudança nesta etapa que uma comparação visual isolada. `tools/verify-frozen.cjs` também compara cada arquivo original de work/v8 e work/v72; exceções explícitas são somente integrate/build/README/PROGRESS. O checkpoint não é Git: contém os dois HTMLs, manifesto original de release, novo manifesto de arquivos e development-snapshot.zip.

ZIP original: SHA-256 `3e5cf9da32c8a8b3d13bfc13599829bde11f9cc565a7edee68e8f97cdaed4499`. Não foi sobrescrito durante o trabalho.

## Testes executados nesta entrega

| Verificação | Resultado / cobertura |
|---|---|
| test-all.cjs | 53 suítes passaram; inclui oito runs completas de50 níveis,12 encontros de boss prolongados, combate, IA, saves, técnicas, todos os grupos de Legados e protocolo |
| Parser dos HTMLs | 22 scripts analisados por edição, sem erro de sintaxe |
| tools/smoke-build.cjs | build/ via file://: normal e ADMIN, treino, Space/W double jump, arena1920, separação ADMIN; também PvE e duelo local com gamepad simulado; sem pageerror |
| browser-features.cjs | Parkour local/split-screen, ADMIN de corrida, editor/teste/retorno e treino; sem pageerror |
| browser-tournament-v8.cjs | Arenas exclusivas filtradas, build nova por confronto, drafts, pódio/ranking de quatro |
| browser-path-save.cjs | Intro persistida, recompensa real de boss, reload do draft sem mudança e próximo encontro |
| browser-online-v8.cjs | RTC local: draft privado, espectador, ADMIN visitante, pause e alterações sincronizadas, desconexões |
| browser-path-watch.cjs | RTC local: espectador tardio de draft, inventário read-only, pausa, isolamento do save, reentrada/saída |
| check-docs.cjs | 18 documentos,115 fichas,12 bosses,18 mapas e links locais válidos |
| Inspeção de screenshots | Treino normal e painel ADMIN abertos e legíveis nas capturas de1440×960; sem redesign |

Dados atuais do browser em [browser-smoke.json](data/browser-smoke.json) e [browser-regressions.json](data/browser-regressions.json). Logs detalhados: `outputs/handoff-browser-*.cjs.log`; lógica: `outputs/v8-*.log`. Capturas: [normal](../outputs/handoff-normal.png), [ADMIN](../outputs/handoff-admin.png). Ambiente: Windows, Node do runtime local e Chrome headless/Playwright. HTTP servido por4189 de outputs; identidade dos hashes cobre equivalência com build.

Testes automatizados usam fixtures/simulação onde indicado. Runs forçadas não medem balanceamento. RTC em processos locais não valida NAT/rede pública. Não foram repetidos todos os scripts de navegador históricos; a seleção acima é a efetivamente executada nesta etapa.

## Arquivos criados

Documentação (18): README.md, GAME_OVERVIEW.md, ARCHITECTURE.md, COMBAT_AND_MOVEMENT.md, CHARACTERS.md, LEGACIES.md, LEGACY_INTERACTIONS.md, CAMINHO_DO_GUERREIRO.md, BOSSES.md, AI.md, MAPS.md, SAVE_AND_STATE.md, NETWORKING.md, TRAINING_AND_ADMIN.md, VISUAL_HANDOFF.md, KNOWN_ISSUES.md, TEST_CHECKLIST.md e este VALIDATION.md, todos em docs/.

Dados em docs/data/: runtime.json, maps.json, source-files.json, browser-smoke.json e browser-regressions.json. Os três primeiros são regeneráveis pelo document-data; LEGACIES/BOSSES/MAPS pelo document-catalog com notas humanas revisadas. Os dois últimos são evidência de execução, não dados de gameplay.

Raiz: README.md, package.json. Tools: build.cjs, verify-frozen.cjs, document-data.cjs, document-catalog.cjs, check-docs.cjs, smoke-build.cjs. Distribuição: build/um-corte-v8.html e build/um-corte-v8-admin.html. Archive: um-corte-v8.html, um-corte-v8-admin.html, v8-release-manifest.json, manifest.json, development-snapshot.zip. Evidências adicionais em outputs conforme seção acima.

Arquivos existentes alterados: work/v8/integrate.cjs, build.cjs, README.md e PROGRESS.md. **Arquivos movidos: nenhum.** Outputs foram lidos/testados; os HTMLs continuam com hashes originais.

## Divergências e trabalho deixado para depois

LEGACIES marca a diferença entre descrição congelada e implementação: Sandevistan não afeta todo o cenário; Névoa absorve além de fontes físicas; ROOM possui aviso antes da troca (este aviso já consta das decisões aprovadas em DECISIONS.md, portanto é refinamento deliberado do texto inicial). BOSSES/AI explicam a ausência de controladores exclusivos profundos para a maioria dos estilos. Portais não incluem companions atuais indiscriminadamente.

Nenhum desses comportamentos foi silenciosamente “corrigido”. ADMIN continua sem autenticação segura; save não tem validação profunda de todos os campos; rede pública, controle físico, audição/balanceamento humanos e performance em hardware do usuário permanecem pendentes. Feedback visual sobre slash, cenários, plateia, paredes, roupas, summons e poderes foi documentado em VISUAL_HANDOFF, não redesenhado. V8.5 não foi iniciada.

## Próximo desenvolvimento

Começar por README/ARCHITECTURE, manter o archive intacto e editar fontes corretas. Gerar com `node tools/build.cjs`; usar TEST_CHECKLIST para regressão. Não interpretar esta auditoria congelada como aprovação automática de futuras mudanças.
