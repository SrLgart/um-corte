# Arquitetura real

## Fontes e arquivos gerados

| Local | Papel | Edição |
|---|---|---|
| `work/v8/upgrade-core.cjs` | Aplica alterações V8 ao motor V7.2 | Fonte do motor V8 |
| `work/v8/engine.js` | Física, estados, colisões, classes, regras, mapas de duelo, IA base | **Gerado** por upgrade-core |
| `work/v8/integrate.cjs` | Integra V8 sobre arquivos V7.2 | Fonte das alterações de integração |
| `work/v8/app.js`, `controls.js`, `renderer.js`, `actors.js`, `room.js`, `shell.html`, `audio.js`, `v7-ui.js`, `build.cjs`, `serve.cjs` | Resultados da integração | **Gerados**; editar a transformação no integrate |
| `work/v72/` | Base de entrada dos dois geradores | Dependência necessária; congelada nesta entrega |
| `legacy-catalog.js` | IDs/metadados de 115 cartas | Fonte direta, descrições históricas |
| `legacies.js` | Inventário, armas, binds, usos, drafts, RNG | Fonte direta |
| `legacy-combat.js` | Ativações, projéteis, técnicas, proteção, invocações | Fonte direta |
| `path.js` | Run, encontros, saves, arenas, combate em grupo e IA V8 | Fonte direta |
| `v8-detail.js` | Complementos mecânicos, gravidade, gelo, morte e textos atuais | Fonte direta |
| `legacy-online.js`, `path-watch.js` | Draft/edição sincronizada e transmissão solo | Fontes diretas |
| `v8-ui.js`, `v8-visuals.js`, `v8-actors.js`, `v8.css` | Integração lexical de UI, desenho V8 e estilos | Fontes diretas |
| `parkour.js`, `lab.js`, `tournament.js`, `admin.js` | Corrida, replay/treino, torneio, painel ADMIN | Fontes diretas nesta árvore |
| Demais JS/CSS de runtime em `work/v8` | Sistemas herdados ainda utilizados | Fontes diretas salvo lista de geração acima |
| `build/*.html`, `outputs/*.html` | Artefatos de distribuição | Nunca editar como fonte |
| `refine-*.cjs`, migrations históricas | Transformações já aplicadas | Não são etapas rotineiras de build |

O [inventário de arquivos](data/source-files.json) classifica todos os arquivos de primeiro nível de `work/v8`. Não há empacotador de ES modules: o projeto usa scripts clássicos e globais/IIFEs (`DuelCore`, `DuelLegacy`, `DuelPath`, etc.). Alguns arquivos estão formatados em linhas longas; esta etapa não os reformata para preservar a referência.

## Build e ordem

Build normal: `node tools/build.cjs`. Internamente chama `work/v8/build.cjs <raiz>/build`. O comando histórico sem destino continua gerando `outputs`. Para regenerar código após editar suas fontes:

```powershell
node work/v8/upgrade-core.cjs
node work/v8/integrate.cjs
node tools/build.cjs
node work/v8/build.cjs
```

Não é necessário regenerar engine/integração a cada empacotamento. O build concatena CSS, substitui marcadores do shell e incorpora scripts; inclui PeerJS e remove comentários sourceMappingURL. Produz normal e ADMIN; só a segunda inclui painel/recursos administrativos de UI. O HTML único não elimina a necessidade de Internet para sinalização online.

A ordem do empacotamento está em `build.cjs`: engine → catálogo → inventário → combate Legado → Caminho → detalhes V8 → Parkour → controles/cenários/skins/editor/armas/atores/iluminação/áudio/sessão/renderer → rede/sala → legacy-online/path-watch → lab/UI/apresentação/torneio/efeitos → V8 visuals/actors → app. A integração V7/V8 da UI é inserida **dentro do escopo lexical de app**. Transformá-la em script solto perde acesso a `game`, `selected`, `paused`, `admin` e `v7`.

## Fluxo da simulação

`app.js` mantém requestAnimationFrame, acumulador e input. Um frame lógico de 1/60 s executa dez subpassos de 1/600 s (`simulate`). Bordas de botão são acumuladas e consumidas uma vez; durante hitstop ficam preservadas. `controls.read` transforma teclado/mouse/gamepad em input semântico. A renderização lê o estado, sem decidir contato.

`Game.step`: hitstop/fases → plataformas → comandos humanos/IA → `DuelLegacy.beforeStep` → por ator, relógio próprio/estados/comandos/movimento/afterMove → separação de corpos/paredes → combate → entidades Legado → adagas → quedas. Wrappers posteriores acrescentam intro, Caos, métricas, Caminho, contenção e detalhes. **A ordem de carregamento desses wrappers é parte do comportamento.** Guardam métodos anteriores antes de substituí-los; não há uma segunda física para o Errante.

`Game.emit` produz eventos. `app.consumeEvents` alimenta áudio, efeitos, HUD, métricas e replay. Áudio/efeitos visuais não devem ser usados como relógio para dano. `renderer`, `actors`, `weapons`, `scenery`, `lighting`, `postfx` e extensões V8 desenham Canvas; pós-processamento possui caminho WebGL/fallback. UI usa DOM/CSS.

## Dependências sensíveis

- `slash` produz o polígono usado em contato, clash, debug e representação. Alterar desenho dentro desse cálculo muda gameplay.
- `path.js` amplia fighters para até quatro e resolve hostilidade por equipe. Sistemas antigos de dois jogadores não devem ser copiados para o Caminho sem revisão.
- `legacy-combat.js` guarda a implementação original em `L._vanilla`; `v8-detail.js` envolve absorção, snapshots, movimento e mortes. Trocar a ordem muda a precedência.
- `Run.checkpoint` depende de `legacyRoundStart` e do estado do RNG, não apenas do inventário.
- `room.js` organiza ticks/ops; `legacy-online.js` suspende ticks durante drafts, envia oferta privada e restaura binds locais.
- `lab.js` grava snapshots **e** comandos por subpasso; o replay pode reexecutar uma resposta. Não é apenas vídeo.
- Parkour reutiliza Game/movimento, mas tem seu próprio Race, ranking, portões, respawns e snapshots. Não criar Legados de duelo ali por acidente.
- ADMIN chama as mesmas operações na simulação e rede; preview visual não é ativação real de poder.

## Critério de organização adotado

O HTML já era um artefato gerado de módulos por sistema. Mover tudo para `/src` ou separar cada método agora adicionaria risco sem resolver a necessidade do usuário. Foi criada uma entrada de build na raiz, uma referência congelada e documentação/inventário claros. Nenhum sistema de combate, estado ou rede foi reescrito.
