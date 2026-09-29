# Caminho do Guerreiro

Fonte: `path.js` (`Run`, `Saves`, wrappers Game); integração de tela, saves e intros em `v8-ui.js`. Solo, com transmissão opcional para até sete espectadores. Não há coop nem controle remoto da run.

## Run e confrontos

Run version=8, seed uint32, nível inicial 1, fase `between`, inventário vazio. `points` padrão 3, limitado a 1–25; um confronto é primeiro a N, e não um único golpe. Regras da Run forçam specials=false e chaos=off. Errante luta contra classes com builds. Vitória avança; perder um duelo concede ponto inimigo; perder o confronto encerra a run (`lost`). Nível 50 vencido encerra em `won`, sem draft final.

Fases: between → fight → draft (quando houver recompensa) → between; lost/won são terminais para jogador normal. ADMIN retry restaura inventário de entrada do confronto, mantém encontro/seed e reinicia seus duelos. Não é uma vida extra normal.

## Encontros exatos

Boss nos múltiplos de dez; miniboss nos níveis 5/15/25/35/45. Eles substituem a regra comum abaixo.

| Níveis comuns | Inimigos | Build por inimigo |
|---|---|---|
| 1–10 | 1 | Sem Legados |
| 11–20 | 2 | Um comum |
| 21–25 | 2 | Um comum; segundo tem 35% de receber também um raro |
| 26–30 | 2 | Um raro |
| 31–35 | 2 | Um raro + um comum |
| 36–40 | 3 | Um raro |
| 41–49 | 3 | Dois raros |

Classe sorteada em CLASSES; papéis por índice aggressive/flank/ranged. Build gerada por `ownBuild` com raridades fixadas, sem duplicata na mesma build; exclui philosopher/d6/d20/destinyorb/secondchance/markedcard e aplica `eligible(mode:path,futureDraft:false)`. Não garante que uma arma sorteada corresponda à classe; arma modifica o perfil ofensivo. Não há escalonamento de HP.

| Miniboss | Build |
|---|---|
| 5 | Um comum |
| 15 | Dois comuns |
| 25 | Um raro + comum |
| 35 | Dois raros |
| 45 | Um lendário + raro |

Miniboss: um ator elite, classe aleatória, estilo aggressive. Boss: build fixa, exceto Gêmeos com dois atores. Detalhes em BOSSES. Dificuldade normal até 10, hard até 30, master depois; ADMIN pode substituir. Arenas mudam a cada dez níveis: Rua, Coliseu, Templo, Imperial, Juízo. Rua/Imperial/Juízo usam night; demais day. Todos têm fechamento lateral físico, inclusive teleporte/voo.

`makeEncounter` memoiza encontro; não ressorteia a cada round. Bosses 10/20/30/40 são pré-sorteados de pools permitidos sem repetição na run; preferem IDs fora de lastBosses quando há alternativa. Nível 50 sempre Primeiro Errante. Esse filtro reduz repetição entre runs, não garante variedade infinita.

## Recompensas e drafts

Oferta após cada vitória até nível20; depois somente minibosses, bosses e nível49. Uma run completa sem extras tem 26 telas de draft antes da vitória final. Comuns posteriores não dão sempre uma carta.

| Nível da recompensa | Pesos comum / raro / lendário |
|---|---|
| <5 | 86 / 13 / 1 |
| 5–9 | 78 / 20 / 2 |
| 10–14 | 68 / 28 / 4 |
| ≥15 | 58 / 35 / 7 |

Três opções; Trevo quatro. Miniboss garante uma Rara ou superior; boss e última recompensa garantem Lendária. Contrato dá duas escolhas no miniboss. Coroa abre seleção extra de um item da build do miniboss que ainda não é próprio. As garantias são aplicadas depois dos ajustes do D20 e protegidas de Carta Marcada.

Itens possuídos/efetivamente transformados não reaparecem na oferta. Coroa/Contrato só elegíveis no Caminho antes de45; relíquias ligadas a drafts precisam de futureDraft. No49 esse flag é false. Moeda rerrola uma vez antes da primeira escolha. Orbe gasta o uso ao espiar; só aceitar confirma a nova seleção. DraftBoost do D20 é consumido pela seleção, não deve ser reaplicado a cada redraw da UI.

## Save e continuidade

`Run.checkpoint` salva uma âncora segura do início do round durante luta, atualizada com inventário atual e RNG da âncora. Não promete continuar exatamente no frame aéreo do fechamento. Entre fases salva snapshot/seleção. `resumeDraftGame` reconstrói uma cena de rascunho antiga sem ressorteio de cartas. `Run.restore` valida version/nivel/fase/IDs únicos; não é validador completo de arquivo hostil.

Save ativo, última run e histórico ficam no localStorage do dono. Fim remove continuação ativa e registra resultado; records guardam vitórias, melhor nível e melhor tempo. seen controla intro pulável; encountered rastreia encontros efetivamente abertos; lastBosses usa a seleção da run encerrada. kills/deaths/duels/time/drafts são contadores de run, não ranking online.

Intros: 3,2 segundos por boss, sete para Primeiro Errante, puláveis se já visto; não confundem com entradas curtas de round. São vinhetas visuais sobre combate pausado, não movimento real dos atores. `introCompleted` impede reapresentar ao continuar o mesmo encontro. ADMIN pode saltar para nível/arena/boss/miniboss; isso escreve um novo checkpoint, não conserva progressão anterior como se nada tivesse mudado.
