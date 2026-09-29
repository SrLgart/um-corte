# Interações e precedência dos Legados

Leia junto de LEGACIES; fontes: `legacy-combat.js`, `v8-detail.js`, `path.js`, `legacy-online.js`. Estas regras são intencionais na build congelada; não “simplificar” durante redesign.

## Vida, morte e rewind

`L.protect` tenta: protetor da Legião → intangibilidade/névoa/fúria/Olho já ativo → barreira frontal → primeiro Olho do Destino → Cristal → Berserker → Anel. Em seguida a absorção do motor trata ADMIN invencível e escudo do Cavaleiro. Barreira não é Perfect Parry. Eventos letal/death não devem ser disparados de VFX.

Olho guarda a forma e origem do golpe fatal, dá 220 ms de reação e desacelera hostis; ao expirar reavalia o contato e parry. Não é resgate garantido. Berserker cria dívida fatal de dois segundos; matar cancela, expirar mata, passando por outras proteções, exceto ADMIN/Anel. Queda tem via própria: Anel pode salvar, Cristal/escudo não equivalem a chão invisível.

Anel restaura o início do **duelo** por snapshot e sinaliza legacyRewind para interromper o restante do passo. Conserva usos/consumidos/binds já gastos para não multiplicar recursos. Não copiar recursivamente legacyRoundStart dentro de si. Kill em grupo e por projétil precisa creditar uma única vez (`DuelV8Detail.killed`).

## Armas, poderes e entidades

Arma equipada controla ataque normal; o especial continua da classe e pode materializar sua arma original. Mestre só arremessa arma física elegível: não punho, Corredor, arma já fora ou execução especial incompatível. O objeto `weapon` mantém originalOwner mesmo após parry mudar owner ofensivo. Recuperação não concede ao adversário a propriedade da arma. Macaco/Mímico podem carregar; remoção/morte do carrier deve largar, não apagar a arma. Leviatã conserva recall.

Desarmamento exige Perfect Parry de golpe físico elegível; não remove “arma” de poder, invocação ou projétil. Corte de Projéteis intercepta projéteis não-zone; uma arma recuperável cai em vez de ser deletada. Parry de projétil comum reflete velocidade e atribuição; parry de zone/companion cancela ou atordoa sua execução, sem transformá-lo em projétil livre.

ROOM troca centros de dono/alvo após aviso de 300 ms; exige ambos dentro da esfera e destinos livres com suporte. Alvos: inimigo ou objeto elegível (arma/bomba/physical fetchable), não qualquer decoração. Gatilho inicial custa 350 ms; Shambles inicia cooldown de nove segundos. Não rebobina estado.

Portais são pares por dono, ancorados em superfície, 12 s, trava de reentrada 250 ms; passagem precisa atravessar frente, caber e ter saída livre. Rotacionam velocidade/dash/técnica com as normais. Nova dupla substitui antiga. Plataformas móveis carregam âncoras; desaparecimento invalida. Companions só passariam com portalCompatible; os atuais não recebem essa flag. Fechamento lateral do Caminho tem prioridade sobre escapes por teleporte/fase.

Poço atrai todos os lutadores, inclusive dono, e objetos soltos; push/pull não pode atravessar apoio/paredes. The Hand desloca faixa de distância, sem destruir mapa. Gelo em parede cria plataforma indexada: ao expirar marca gone, não remove índice e desloca todas as referências. Gravidade invertida reflete o referencial temporariamente para reutilizar física; always restore em finally. IA navega no mesmo referencial, mira segue coordenadas do mundo.

## Tempo, cópias e invocações

Sandevistan aplica fator 0,25 a hostis depois do aviso; The World fator zero. Combinados usam o menor fator, não multiplicação cumulativa. Entidades acompanham relógio do dono; efeitos temporais envelhecem no mundo para conseguirem terminar. Plataformas/cenário não são literalmente congelados pelo texto “mundo inteiro”. Hitstop global é outro mecanismo.

Doppel registra posições/poses/perfis por amostra, com atraso 550 ms. Copia ataques físicos, sem poderes/summons para evitar recursão. Eco registra geometria de um ataque e repete no lugar original após 600 ms; não acompanha atacante. Ambos usam perfil histórico, inclusive arma transformada/ADMIN size, em vez de recalcular usando arma atual.

Espelho memoriza especiais de classe e um conjunto explícito de poderes (fireball, pulse, impulse, barrier, blink, gust, lightning, repulsor, telekinesis, web, well, mist, ice, amaterasu, thehand) usados por inimigo a menos de480. Não copia qualquer Legado. Execução temporária restaura inventário/usos originais; flag anti-recursão evita espelhos se copiarem indefinidamente. Não permite sobrepor dois especiais copiados.

Companions usam entidades serializadas com owner, fase e timers. Necromante mantém um servo da classe morta, sem copiar build inteira. Legião guarda fallen slots até próximo duelo; skeleton reconstrói em seis segundos. Mahoraga conserva memória dentro da partida e limpa ao novo confronto. Dono morto encerra suas invocações. Dragonbreath é friendly e pode matar dono; isso é exceção explícita, não regra geral de friendly fire.

## Sorte, transformações e drafts

D6 troca um item elegível pela mesma raridade; pode mudar categoria. Pedra escolhe item não lendário aleatório e sobe raridade mantendo categoria; fica consumed pela run. Transformações persistem entre duelos e revertem no próximo match, inclusive binds. IDs originais e efetivos impedem duplicata. Equipamento/gesture precisa seguir a transformação, não ficar apontando para item ausente.

D20 “character” registra matchEffects, reaplicados no reset de duelo. “draft” escreve draftBoost, consumido pela próxima seleção. Multiplicadores de velocidade e startup/recovery não são HP. Orbe usa transação preview/accept; olhar gasta uso mesmo recusando. Carta Marcada nunca apaga uma garantia obrigatória. Coroa só rouba da build elegível de miniboss derrotado; Contrato não duplica cartas de qualquer vitória.

## Áreas sensíveis a regressão

Salvar durante canalização/arma fora; mover plataforma de portal/gelo; limpar summon carrier; efeitos simultâneos de tempo; trocar de classe com mirrorSpecial; terminar round entre morte e rewind; snapshot de quatro atores; draft privado após timeout/rejoin. Os testes dedicados constam em TEST_CHECKLIST. Não há alegação de teste exaustivo das combinações de 115 itens.
