# UM CORTE V7 — CONTROLE

Autorizado em 25/09/2026. Fonte preservada: ../v63. Não alterar versões anteriores.

## Decisões aprovadas
- Somente dash aéreo muda para oito direções por movimento. Terrestre preservado.
- WASD/setas direcionam; Espaço pula. Remapeamento. Mira independente.
- Wall slide descendente; wall jump repetível após sair e reencostar; sem recarga de dash na parede.
- Parry lateral travado; eixo vertical exato protegido pelos dois lados. Altura somente visual.
- Host sai: encerra sala. Lutador sai: interrompe duelo, mantém sala. Trocas entre partidas; espectadores nunca bloqueiam combate.
- Parkour: contato OFF, respawn 0,5s, proteção contra chute 1s (chutar a remove), prazo pós-primeiro 30s configurável, local 2 câmeras lado a lado.
- Classes normais opcionais mantêm atributos, sem ataque/parry/especial. Corredor exclusivo da corrida.
- Taunt T / direcional digital livre, remapeável.
- Dia/noite visual compartilhado; preservar fundos personalizados.

## Escopo e sequência
1. Movimento, parry, pequenos ajustes das classes, testes de regressão.
2. Animações, taunts, dia/noite, quatro fundos antigos polidos.
3. Sala online com até oito membros, dois lutadores + espectadores; assentos e ADMIN.
4. Parkour usando Game.moveFighter, três pistas, checkpoints, ranking, IA, split-screen, online.
5. Editor de corrida, importação/exportação/teste, integração de menu e ADMIN.
6. Suítes, QA visual e online real; build normal/ADMIN, guia e entrega.

## Estado
- V7 implementada em work/v7; versões anteriores preservadas. Fechando QA e entrega em 26/09/2026.
- Concluídos: movimento/parry/taunts/balanceamento; dia/noite e fundos; sala 8; parkour com motor original, 3 pistas e IA; editor e ADMIN.
- Testes core/features/release/V5/V6/V6.3 e 22 chaves de torneio passaram. V7: 10 grupos iniciais passaram; expandindo bordas.
- Navegador: solo, split-screen com gamepad simulado, editor/teste e treino passaram sem erros.
- Online real PeerJS: 2 lutadores + espectador; sala cheia 2+6, host espectador, ADMIN convidado, troca de assentos e revanche passaram.
- Online real parkour: 8 corredores sincronizados, ADMIN convidado, desconexão DNF sem interromper corrida passaram.
- Corrigidos: pista perdida ao criar sala, cor bloqueada por oponente oculto, preview do menu ao sair de corrida, reconstrução de imagens de mapas em snapshots.
- QA visual: 20 variantes dia/noite, 6 vistas de pistas, 4 fundos e 27 poses. Luas/sol e paletas de noite corrigidas para manter identidade.
- Online late join + imagem de mapa personalizado + noite + auto início 10s + ADMIN quadro/tempo: PASSOU.
- Novos testes: V7 15 grupos, protocolo 5, controles/migração 3. Total esperado 124 grupos + 22 chaves. Test runner test-all.cjs salva logs.
- Guia outputs/LEIA-ME-V7.md criado. Última passada concluída: build + test-all (124 grupos e 22 chaves), browser-features (sem erros), browser-crowd --race (8 clientes sincronizados), browser-visual e file:// boot solo PASSARAM.
- Entrega pronta: outputs/um-corte-v7.html, outputs/um-corte-v7-admin.html, outputs/LEIA-ME-V7.md. Não houve publicação externa nem mudança nas versões anteriores.
- Limites da verificação: WebRTC real no mesmo PC com contextos isolados; gamepad simulado. Teste físico entre PCs/redes distintas permanece a cargo de uma sessão real de jogo.
- Servidor de testes: node work/v7/serve.cjs, porta 4187. HTMLs em outputs/um-corte-v7(-admin).html.
- Não usar subagentes sem autorização explícita.
- Node: C:/Users/Luiz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe
- Playwright: mesmo runtime, dependencies/node/node_modules/playwright. Chrome instalado.
- Build de HTML único preservado. Novos componentes somente quando necessários ao escopo de corrida/rede.
