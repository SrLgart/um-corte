# Save, estado e compatibilidade

## Formatos persistentes

| Armazenamento | Conteúdo |
|---|---|
| localStorage `um-corte-v8-path` | Run ativa serializada |
| `um-corte-v8-path-last` | Último resultado lost/won; não é continuação comum |
| `um-corte-v8-path-history` | seen, lastBosses e records (version1) |
| `um-corte-v72-controls` | Controles; migra fallback v7/v3 quando necessário |
| `um-corte-v5-graphics` | quality low/medium/high/ultra, shadows, reduced |
| `um-corte-presets` | Até30 presets validados, format um-corte-preset/version1 |
| `um-corte-name` | Nome de perfil da sala |
| IndexedDB `um-corte-maps` version1 | stores maps (keyPath id) e settings |
| Arquivos `.umcorte.json` | Mapa exportado, inclusive imagens incorporadas |

Origem do navegador importa: file:// e http://localhost podem ter persistências distintas; mudar porta/host também. Nenhum save em nuvem/conta existe. Falha de quota/permissão é tratada com aviso/exportação quando aplicável; não prometer que um save foi escrito se Saves.write retornou false.

Editor pode usar showDirectoryPicker e escrever na pasta autorizada; sem suporte, Salvar mantém IndexedDB quando disponível e baixa arquivo. Não salva em uma pasta arbitrária do PC sem seleção/permissão do navegador.

## Run

`Run.serialize` clona dados e acrescenta randomState; não serializa função random. Inclui seed, level, points, rules, inventory, phase, encounter, gameSave, draft, bosses, defeated, seen, lastBosses, stats, color, entryInventory, result e campos adicionais de fluxo. `Run.restore` exige version8, level1..50, fase válida e IDs de inventário únicos/conhecidos. Não é schema validator profundo; arquivo corrompido pode falhar em campos subsequentes.

Continuar reconstrói RNG LCG e encontro memoizado. Checkpoint durante fight usa início seguro de round com inventário atualizado; não captura posição perigosa como único ponto de retorno. Fase draft conserva cartas/escolhas. Fim da run remove save ativo e atualiza records com proteção contra contabilizar o mesmo resultado duas vezes. Retry ADMIN restaura entryInventory e mantém encontro; não refaz sorteio de bosses.

## Snapshot de simulação

Motor **version72**, apesar da release8. Isso é versão do formato herdado, não erro de UI a corrigir. Inclui mapa/regras, fighters, posição/velocidade/state/timers, score, phase, RNG acrescentado por V8, plataformas, métricas, especiais, Caos e extensões. V8 acrescenta legacyEnabled, legacyWorld, legacyRoundStart, pathEncounter, runTime/pathStats e plataformas de gelo. Consulte `snapshot/loadSnapshot` e wrappers na ordem de carregamento.

Game aceita dois fighters comuns ou 2–4 com pathEncounter; Race snapshot type=parkour/version72 aceita1–8. Imagens customizadas são removidas de snapshots comuns e recuperadas do mapa registrado, para evitar retransmitir base64 a cada frame. A configuração inicial precisa registrar o mapa completo antes de carregar um snapshot sem imagens.

`legacyWorld` serializa entities/effects/serial/time; entidades têm owner, tipo, posição, timers, hits, fases, alvos, referências a plataformas e histórico conforme tipo. Não introduzir referências circulares/funções/objetos DOM. Doppel usa arrays compactos e profiles históricos; Eco guarda geometria. Gelo preserva índices marcando gone.

## Inventário e resets

| Campo | Contrato |
|---|---|
| items / weapon | IDs possuídos e arma escolhida; um item não se duplica |
| bindings / gesture | Códigos locais e gesto de voo escolhido |
| cd / used | Cooldowns; dicionários duel/match/run |
| effects / matchEffects | Efeitos correntes; subset reaplicado ao próximo duelo |
| transforms | from/to e bind de origem para reversão |
| consumed | Item indisponível mesmo ainda listado na build |
| fuel / charge | Energia de voo e carga temporária |
| marked / draftBoost | Estado de próxima seleção |
| copied / summonMemory / servantKind / krakenForm | Espelho, adaptação, servo e rotação dos tentáculos |

Reset duel: conserva build/binds/transformações/usos match/run/consumed e metadados selecionados; limpa used.duel/cd/effects, restaura fuel e saltos, reaplica matchEffects e recria companions. Reset match: além disso limpa used.match, reverte transforms/binds, limpa cópia/memória/servo/rotação e matchEffects. Nova run começa inventory vazio. Refill ADMIN pode limpar até usos run e consumed: é intervenção deliberada, não reset normal.

Especial de classe é outro estado: persistSpecial preserva carga, não ultMode/locks/arma arremessada. Não confundir charge de inventário com specialCharge.

## RNG e replay

`L.rng(seed)` LCG uint32: imul(state,1664525)+1013904223; state acessível e serializável. Run guarda estado ao montar encontro; snapshots guardam legacyRngState. Previews ADMIN usam cópia/seed separada. Math.random ainda existe em escolhas/UI/treino e não equivale a um fluxo global determinístico.

Replay guarda before/after e inputs semânticos por subpasso. Assistir carrega frames; tentar outra resposta simula inputs gravados do rival com input novo do jogador. Binds físicos não precisam coincidir para reexecutar IDs de Legados. legacyRoundStart não deve ser serializado recursivamente; transmissões para espectadores removem essa cópia.

Compatibilidade exige preservar IDs, flags, unidades, versão do schema e ordem das extensões. Uma futura migração deve ter fixtures de save antigo, não apenas aceitar novo número de versão. Não limpar localStorage dos jogadores para mascarar erro de carregamento.
