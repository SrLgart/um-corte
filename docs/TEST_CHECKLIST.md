# Validação e manutenção

## Comandos locais

```powershell
node tools/build.cjs
node work/v8/build.cjs
node tools/verify-frozen.cjs
node work/v8/test-all.cjs
node tools/document-data.cjs
node tools/document-catalog.cjs
node tools/check-docs.cjs
node tools/smoke-build.cjs
```

Build/lógica/documentação usam Node nativo. Browser precisa Playwright e Chrome; scripts históricos apontam para runtime Codex e Chrome desta máquina. `smoke-build` aceita UMCORTE_PLAYWRIGHT (caminho do módulo) e UMCORTE_CHROME. Para HTTP, `node work/v8/serve.cjs` na porta4189; ele serve outputs, não build.

`test-all.cjs` executa53 suítes, registra outputs/v8-<teste>.log e analisa22 scripts de cada HTML histórico. Falha tem exit code não zero. `verify-frozen` compara fontes/base e archive/outputs/build por SHA256, com exceções explícitas só para tooling/docs alterados. Não reutilizar a conclusão desta entrega depois de editar gameplay.

## Mapa de testes existentes

| Área | Suítes / scripts |
|---|---|
| Base/movimento/combate/especiais | test-core, features-test, release-test, v5/v6/v63/v7/v72-test |
| Controles e sala | controls-test, room-test |
| Torneio | tournament-test; browser-tournament-v8 |
| Catálogo/combinações | legacy-test, legacy-interactions-test, legacy-survival-test, legacy-resource-test |
| IA/mobilidade | legacy-ai-test, legacy-ai-intent-test, legacy-ai-danger-test, legacy-inverted-ai-test, legacy-mobility-test, legacy-flight-test |
| Técnicas/armas | legacy-charge/echo/techniques/strikes/regions/channel/equipment-audit-test |
| Invocações | legacy-summons/companion-ai/physical-summons/control-summons/hunting-summons/legion/kraken/grab-summons-test |
| Espaço/tempo/proteção | legacy-spatial/powers/motion-combo/defense-combo/force-audit/relic-precision/mirror-test |
| Saves/Admin/replay/rede | legacy-save/admin/lab/online/watch-payload-test |
| Caminho | path-boundary/outcome/full-run/endurance-test |
| Browser/menu/Parkour/editor | browser-file, browser-v72, browser-features |
| Browser/rede | browser-online-v8, browser-crowd, browser-latejoin, browser-path-watch |
| Browser/Caminho | browser-path-save, browser-path-intro-flow, browser-path-outcome, browser-path-boundaries, browser-path-camera |
| Browser/apresentação | browser-copy-check, browser-boss-intro-art, browser-legacy-replay, browser-late-game-stress |

Nomes acima omitem extensão .cjs em parte da tabela. Lista autoritativa da suíte lógica: test-all.cjs. Logs da auditoria anterior em work/v8/AUDIT-V8.md são evidência histórica; execução atual em VALIDATION.

## Checklist prática

- [ ] Normal/ADMIN abrem por arquivo e HTTP; menu/logo/cursor/corte, botão Jogar, download e console.
- [ ] PvE, local, online, treino, Parkour, torneio e Caminho iniciam/encerram/voltam ao menu.
- [ ] Todas as oito classes, Corredor/Errante; aleatório, skin/cor, revanche.
- [ ] W/Espaço, buffer/coyote/variable/double jump, terceiro salto negado, reset no pouso, fast fall.
- [ ] Dash de chão com mira/movimento, aéreo independente do cursor, W+dash sem gasto involuntário de salto, cargas/recarga320 ms, slide, parede/slide/jump.
- [ ] Ataque durante dash/mira para trás, startup/active/recovery, alcance mínimo da lança/foice, hitbox estreita da rapieira, corpo baixo do slide.
- [ ] Parry lateral e cross-up, Perfect≤80 ms, finta não defende, clash antes da morte, trocas/quedas, cooldowns.
- [ ] Especiais das oito classes, penalidades, persistência só de carga e popup com timeout online.
- [ ] Caos temporário/Ultra acumulado, presets somente combate, pontos/HUD dinâmicos.
- [ ] Mapas oficiais/custom, chão, móveis/frágeis, objetos, import/export/pasta, imagens e day/night.
- [ ] Parkour checkpoints/respawn/ranking, três pistas, bots, oito online, dois local/split-screen, câmera individual e editor.
- [ ] Torneio: classe fixa, eliminação em todas as fases, políticas de mapa, pódio até clique e ranking completo.
- [ ] Treino: padrões/intervalos, parry constante, pausa/quadro, R e save de posição; replay assistir/tentar outra resposta.
- [ ] TAB: adicionar/remover/equipar/binds/conflitos/gesto; selecionar cada combatente; ativos e held respeitam replay/rede.
- [ ] Drafts: raridades/garantias, Trevo/Moeda/Orbe/Carta/Ímã/Contrato/Coroa; escolhas privadas e timeout30 s online.
- [ ] Consumíveis e scopes duel/match/run; D6/Pedra revertem; D20 personagem/próximo draft; Anel não duplica uso.
- [ ] Armas fora/recall/desarmamento/macaco/mímico; Portal/ROOM/gravidade/tempo/canalização; invocações mortas/recriadas sem entidade órfã.
- [ ] Caminho: níveis1,5,10,21,35,36,45,49,50; três inimigos, kills parciais, empate, save/continue/draft, vitória/derrota/records e retry ADMIN.
- [ ] Cinco arenas fechadas: tentar salto/voo/blink/fantasma/portal lateral; wall jump continua; não pular por cima.
- [ ] Online: host/guest ADMIN, pausa/ops, espectadores tardios, mapa com imagem, desconexão/timeout; Caminho espectador nunca controla run.

## REGRESSION CHECK PARA ALTERAÇÕES VISUAIS / VISUAL REGRESSION CHECK

- [ ] Mesmo snapshot/seed/input produz mesmas posições, estados, score, RNG e contatos antes/depois.
- [ ] Body/slash/guard, alcance, timing, cooldown, física e colisão idênticos; overlay acompanha desenho.
- [ ] Startup/active/recovery e avisos de poder continuam legíveis, sem luz ocultando ameaça.
- [ ] Idle/entrada/taunt/finalização não movem corpos nem atrasam input real.
- [ ] Câmera/zoom/shake não mudam mira em screenToWorld ou lógica de colisão.
- [ ] Mapas/caminhos continuam navegáveis; parallax/foreground não parecem nova plataforma sólida.
- [ ] Save antigo válido, replay e multiplayer sincronizados; efeitos não consomem RNG mecânico.
- [ ] Testar 1280×720,1440×960 e tela estreita; low/medium/high/ultra; sombras on/off/reduced motion/fallback WebGL.
- [ ] Avaliar manualmente som/impacto/visibilidade e performance em máquina real; registrar ambiente, não prometer FPS universal.
