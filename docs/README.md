# Handoff técnico — UM CORTE V8

Estado auditado em 28/09/2026. A revisão do usuário mantém `work/v8` como base: as responsabilidades já estavam separadas; não foi necessária uma nova extração do HTML nem uma árvore `/src` duplicada. CSS permanece separado nas fontes. HTML único permanece o formato de distribuição.

## Ordem de leitura

1. [GAME_OVERVIEW](GAME_OVERVIEW.md) — o jogo e seus modos.
2. [ARCHITECTURE](ARCHITECTURE.md) — fontes, geradores, integração e build.
3. [COMBAT_AND_MOVEMENT](COMBAT_AND_MOVEMENT.md) — contratos mecânicos e valores.
4. [CHARACTERS](CHARACTERS.md) — classes, Corredor e Errante.
5. [LEGACIES](LEGACIES.md) — os 115 Legados, parâmetros e limites reais.
6. [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md) — precedências e combinações sensíveis.
7. [CAMINHO_DO_GUERREIRO](CAMINHO_DO_GUERREIRO.md) — progressão, encontros e recompensas.
8. [BOSSES](BOSSES.md) — doze bosses e sua implementação.
9. [AI](AI.md) — percepção, decisões e navegação.
10. [MAPS](MAPS.md) — arenas, pistas e editor.
11. [SAVE_AND_STATE](SAVE_AND_STATE.md) — persistência, snapshots, resets e seeds.
12. [NETWORKING](NETWORKING.md) — salas, sincronização, drafts e espectadores.
13. [TRAINING_AND_ADMIN](TRAINING_AND_ADMIN.md) — ferramentas de reprodução.
14. [VISUAL_HANDOFF](VISUAL_HANDOFF.md) — fronteiras para um futuro redesign.
15. [KNOWN_ISSUES](KNOWN_ISSUES.md) — limitações confirmadas e pendências manuais.
16. [TEST_CHECKLIST](TEST_CHECKLIST.md) — validação técnica e visual.
17. [VALIDATION](VALIDATION.md) — execução realizada nesta entrega e hashes.

## Como usar esta documentação

O código executável é a fonte da verdade. `SPEC-V8.txt`, `DECISIONS.md` e as descrições congeladas em `legacy-catalog.js` são histórico de intenção. O catálogo não substitui `legacy-combat.js`, `path.js` e `v8-detail.js`.

As referências a funções são âncoras de busca; evite depender de números de linha em fontes geradas. Os dados extraídos em [data](data/runtime.json) incluem classes, regras, raridades e bosses; [maps.json](data/maps.json) contém a geometria completa, original e processada. Regere com `node tools/document-data.cjs` após uma futura mudança deliberada. As explicações humanas precisam de revisão separada.

Uma **partida/confronto** contém vários **duelos/rounds**. Uma **run** do Caminho contém até 50 confrontos. Essa distinção determina resets de usos e transformações.

## Entrega e organização

Nenhum arquivo de runtime foi movido. `tools/build.cjs` oferece uma entrada estável na raiz e `work/v8/build.cjs` aceita um diretório de saída opcional. A alteração está também no gerador `integrate.cjs`, para sobreviver à regeneração. Não há framework/bundler/dependência nova.

O checkpoint original está em `archive/V8_FINAL_MONOLITHIC`; nunca o use como pasta de edição. Para recuperar, extraia o ZIP em outra pasta e compare com seu manifesto antes de substituir trabalho atual. Os hashes dos HTMLs atuais devem coincidir com os originais nesta entrega. Após uma futura atualização intencional, esse verificador naturalmente acusará diferenças: não rebatize o checkpoint para ocultá-las.
