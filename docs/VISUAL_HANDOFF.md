# Handoff visual — sem redesign nesta entrega

## Estrutura atual

| Área | Onde localizar |
|---|---|
| Composição/câmera/mundo/HUD canvas | renderer.js e integração em integrate.cjs |
| Corpo/poses/classe/roupa | actors.js, skins.js, v8-actors.js |
| Arma e slash | weapons.js, renderer.js, v8-visuals.js; geometria real em engine.slash |
| Arenas/cenário/base/paletas | scenery.js, scenery-extra.js, daylight.js |
| Caminho/plateia/limites/VFX Legados | v8-visuals.js, v8-actors.js |
| Ícones/cartas/inventário/intros | v8-visuals.js, v8-ui.js, v8.css |
| Tela inicial/cursor cortante/chuva | menu-fx.js, presentation.js, estilos V6/V7 |
| Luz/sombra/bloom | lighting.js, post-fx.js |
| Impacto/finalização/movimento | finishers.js, movement-fx.js, v7-visuals.js e renderer |
| Áudio | audio.js; funções de evento e pathIntro |
| Menus/controles/ADMIN | shell.html, app.js, v7-ui.js, v8-ui.js, admin.html/js, CSS em camadas |

Generated files devem ser alterados pelo gerador indicado em ARCHITECTURE. O renderer usa Canvas2D, DPR limitado a2 e câmera em coordenadas de mundo. Bloom Ultra usa WebGL em buffer reduzido (até1024 de largura / escala≤0,65); se indisponível, fallback visual. Não é motor 3D ou pipeline pesado de assets.

`renderer.screenToWorld` converte mira; mudanças na escala/câmera precisam preservar essa transformação. Parkour segue um corredor, local usa split-screen; duelo enquadra luta, Caminho tem limites/câmera próprios. Física não deve receber shake/zoom visual de volta.

## Pode ser redesenhado futuramente

Sprites/formas, proporções desenhadas, roupas, poses/animações, armas visuais, Legados, summons, bosses, ícones, UI/HUD/menus, cenários, arenas visualmente, camadas/parallax, iluminação, VFX/SFX, slash, intros e apresentação de poderes. Não há declaração no código de que todo asset seja “definitivo” ou “placeholder”; não impor esses rótulos.

Modificar level design é decisão mecânica deliberada, separada de pintar o cenário. O usuário admite revisão futura nas arenas do Caminho, mantendo função fechada/legível/espaçosa, escala crescente e poucos obstáculos/buracos obrigatórios.

## Contratos que não podem mudar acidentalmente

- body/slash/guard e seus contornos; alcance e offsets de contato.
- startup/active/recovery/feint/Perfect e cooldowns.
- física, salto, impulso, gravidade, parede e plataformas.
- tempo de aviso de entidades e começo real da área letal.
- efeitos mecânicos, usos/transformações e morte em um golpe.
- vitória, progressão, AI navigation/roles, snapshot/save, protocolo e RNG.

Desenho deve consumir estado, não alterá-lo. Não mover fighter.x/y para fazer uma animação “ficar bonita”. Poses secundárias cancelam visualmente ao input sem esperar animação terminar. Não usar Math.random do jogo para partículas: isso altera sorteios de combate. Não usar um flash mais longo para ampliar parry.

## Problemas de apresentação relatados pelo usuário

Os itens abaixo são feedback explícito nos pedidos de handoff, **não novos bugs reproduzidos automaticamente nesta etapa**. Foram preservados para avaliação visual da V8.5:

| Feedback | Local de revisão futuro | Contrato a manter |
|---|---|---|
| Slash ainda não entrega “corte materializado no ar” | weapons/renderer/visuals | Slash visível precisa continuar comunicando área real |
| Profundidade/parallax/composição estranhos em arenas | scenery/daylight/v8-visuals | Câmera, geometria e spawns |
| Plateia da Rua aparece/desaparece conforme câmera vertical | desenho path_street | Limites de desenho coerentes sem alterar colisão |
| Laterais parecem pouco naturais | walls do Caminho e decoração | Fechamento físico incontornável e wall interactions |
| Roupas/equipamentos parecem rígidos presos ao corpo | v8-actors/actors | Sem mover hitboxes com tecido |
| Summons simples, em especial Mahoraga | v8-visuals/actors | Forma de contato/estado/roda de adaptação |
| ROOM comunica área mas tem pouca presença | room effect | Centro/raio/aviso/troca validada |
| The World, Sandevistan, Kamehameha, Domain e lendários com VFX/SFX básicos | efeitos/áudio | Leitura de telegraph, clock e lethality |

Asas de Ícaro, demais equipamentos e ícones também pertencem à futura revisão de arte; nenhuma substituição foi feita aqui. O feedback não implica que a mecânica esteja ausente. Exemplo: ROOM possui seleção/validação/troca reais mesmo com apresentação simples.

## Como comparar

Use archive e build em contexts separados com mesma seed/mapa/regras/qualidade/resolução. ADMIN preview só para apresentação; treino/Legacy Lab para execução real. Capture idle, startup, active, recovery, guarda lateral, Perfect, morte e câmera nos extremos. Inclua presets gráficos low/high/ultra, sombras on/off e prefer-reduced-motion. Hash idêntico do HTML prova preservação nesta entrega; redesign futuro exigirá comparar comportamento além da imagem.
