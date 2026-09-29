# Legados — catálogo mecânico completo

115 IDs reais, auditados contra legacies.js, legacy-combat.js, v8-detail.js e path.js. Segundos são tempo de simulação, salvo indicação em ms. Texto de uso é L.describe; a nota técnica abaixo registra parâmetros e limites lidos no código. Descrições congeladas de intenção estão em [runtime.json](data/runtime.json), não devem substituir estas notas.

## Regras comuns de todas as fichas

- Aquisição: draft de partida/duelo quando habilitado, recompensas do Caminho e laboratório de treino/ADMIN. NPCs também podem receber builds fixas/aleatórias; isso não significa elegibilidade idêntica ao draft humano.
- Sem pilhas do mesmo ID. add rejeita item original ou efetivo já possuído; drafts excluem ambos. Remover item pelo ADMIN pode torná-lo elegível novamente. Múltiplos itens distintos podem combinar efeitos; uma arma equipada por vez.
- Ativo recebe primeiro bind livre Digit1..9; extras precisam bind manual. TAB permite remapear teclado/mouse/gamepad e detecta conflitos. Armas usam o input de ataque, técnicas usam gestos; active:false não significa “sem ação”.
- Duração contextual significa enquanto possui item/condição descrita; não existe timer universal de cinco segundos para passivos. scope=cooldown é metadado genérico, não prova de uma recarga.
- Reset duel conserva posse/transformações/usos de match/run, limpa cd/efeitos e recria companions; match reverte transformações e memórias. Ver SAVE_AND_STATE. Uma invocação em geral existe até morrer, dono morrer ou reset; life1e9 é sentinela, não duração de habilidade prometida.
- Entidades/effects são dados serializáveis, não VFX que decidem dano. Fichas sem entidade própria modificam atributos/hooks/estado. Mecânicas de combate não são automaticamente liberadas no Parkour.

## Armas

### VASSOURA — `broom`

Arma improvisada de alcance razoável e arco amplo. O golpe lento exige antecipação.

- **Categoria / raridade:** weapon / common.
- **Acionamento / bind:** M1 · atacar; consulte a descrição para o gesto específico.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Perfil staff: alcance148/min25, tempos260/140/360 ms. Arco de bastão; sem entidade adicional ou cooldown independente.
- **Override de arma:** `{"kind":"staff","reach":148,"minRange":25,"startup":0.26,"active":0.14,"recovery":0.36}`. Campos omitidos herdam classe processada; tempos em segundos antes de attackSpeed.

**Localizar:** `broom` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### ESPADA — `sword`

Espada equilibrada, com comportamento semelhante à do Cavaleiro.

- **Categoria / raridade:** weapon / common.
- **Acionamento / bind:** M1 · atacar; consulte a descrição para o gesto específico.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Herda o perfil processado do Cavaleiro, incluindo arco/tempos. Não muda mobilidade ou especial da classe portadora. Sem entidade adicional.
- **Override de arma:** `{"kind":"knight"}`. Campos omitidos herdam classe processada; tempos em segundos antes de attackSpeed.

**Localizar:** `sword` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### ARCO — `bow`

Dispara uma flecha após uma breve puxada. Ela colide com o cenário e pode ser refletida por parry. Aguarde a recarga entre tiros.

- **Categoria / raridade:** weapon / common.
- **Acionamento / bind:** M1 · atacar; consulte a descrição para o gesto específico.
- **Recarga:** 3 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** arrow a1150 u/s, raio4, vida2,5 s; cooldown de arma3 s. Não há slash melee (reach0). Flecha para no cenário e pode ser refletida.
- **Override de arma:** `{"kind":"lancer","reach":0,"length":65,"startup":0.25,"active":0.02,"recovery":0.38,"shot":"arrow","cooldown":3}`. Campos omitidos herdam classe processada; tempos em segundos antes de attackSpeed.

**Localizar:** `bow` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### SOCO-INGLÊS — `knuckles`

Socos muito rápidos de alcance mínimo. Equipar as manoplas não concede o especial nem o restante da classe Pugilista.

- **Categoria / raridade:** weapon / common.
- **Acionamento / bind:** M1 · atacar; consulte a descrição para o gesto específico.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Perfil boxer: alcance55, tempos90/75/150 ms; alterna punhos. Não concede boxerRush/especial da classe. Sem entidade extra.
- **Override de arma:** `{"kind":"boxer","reach":55,"startup":0.09,"active":0.075,"recovery":0.15}`. Campos omitidos herdam classe processada; tempos em segundos antes de attackSpeed.

**Localizar:** `knuckles` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### MACHADO — `axe`

Machado de arco amplo e alcance médio. Preparação e recuperação mais longas deixam o golpe bem anunciado.

- **Categoria / raridade:** weapon / common.
- **Acionamento / bind:** M1 · atacar; consulte a descrição para o gesto específico.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Perfil swordsman: alcance139/min25;280/140/410 ms. Corte de arco amplo sem projétil.
- **Override de arma:** `{"kind":"swordsman","reach":139,"minRange":25,"startup":0.28,"active":0.14,"recovery":0.41}`. Campos omitidos herdam classe processada; tempos em segundos antes de attackSpeed.

**Localizar:** `axe` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### KUNAI — `kunai`

Arremessa uma lâmina em linha reta, de alcance limitado. Pode ser aparada e precisa recarregar entre lançamentos.

- **Categoria / raridade:** weapon / common.
- **Acionamento / bind:** M1 · atacar; consulte a descrição para o gesto específico.
- **Recarga:** 1.3 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** kunai a880 u/s, raio5, alcance500, cooldown1,3 s. Ataque90/20/190 ms; não deixa portador permanentemente desarmado a cada disparo.
- **Override de arma:** `{"kind":"assassin","reach":0,"length":50,"startup":0.09,"active":0.02,"recovery":0.19,"shot":"kunai","cooldown":1.3}`. Campos omitidos herdam classe processada; tempos em segundos antes de attackSpeed.

**Localizar:** `kunai` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### MACHADO LEVIATÃ — `leviathan`

Toque em atacar para golpear; segure para arremessar. Enquanto o machado estiver longe, atacar o chama de volta. Ele é letal na ida e no retorno, mas você fica sem arma até recuperá-lo.

- **Categoria / raridade:** weapon / rare.
- **Acionamento / bind:** M1 · atacar; consulte a descrição para o gesto específico.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Segurar ataque por320/attackSpeed ms arremessa weapon (1000 u/s); toque é melee. Enquanto fora, M1 chama retorno a1100. Letal ida/retorno; parede o derruba. Recuperável, mantém originalOwner.
- **Override de arma:** `{"kind":"swordsman","reach":145,"minRange":30,"startup":0.22,"active":0.13,"recovery":0.32}`. Campos omitidos herdam classe processada; tempos em segundos antes de attackSpeed.

**Localizar:** `leviathan` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### AGULHA — `needle`

Mire para baixo e ataque no ar para quicar em inimigos ou superfícies válidas, inclusive o chão. O contato devolve impulso vertical.

- **Categoria / raridade:** weapon / rare.
- **Acionamento / bind:** M1 · atacar; consulte a descrição para o gesto específico.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Perfil duelist alcance141/min20;130/110/230 ms. Active mirando para baixo (sin>0,65) em corpo ou superfície válida aplica vy−780 e restaura saltos. Não é pulo infinito sem contato.
- **Override de arma:** `{"kind":"duelist","reach":141,"minRange":20,"startup":0.13,"active":0.11,"recovery":0.23}`. Campos omitidos herdam classe processada; tempos em segundos antes de attackSpeed.

**Localizar:** `needle` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### GUNBLADE — `gunblade`

Durante a parte ativa do corte, pressione atacar novamente no momento certo para acrescentar um disparo curto. A extensão também pode ser defendida.

- **Categoria / raridade:** weapon / rare.
- **Acionamento / bind:** M1 · atacar; consulte a descrição para o gesto específico.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Perfil knight alcance132. Novo pressionamento em active até70 ms, uma vez por attackId, cria trigger:1200 u/s, raio7, range62, life60 ms. Exige timing, não dano extra em alvo com HP.
- **Override de arma:** `{"kind":"knight","reach":132}`. Campos omitidos herdam classe processada; tempos em segundos antes de attackSpeed.

**Localizar:** `gunblade` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### BACAMARTE — `blunderbuss`

Disparo de alcance muito curto e espalhamento largo. É rápido de soltar, mas exige uma recarga longa.

- **Categoria / raridade:** weapon / rare.
- **Acionamento / bind:** M1 · atacar; consulte a descrição para o gesto específico.
- **Recarga:** 2.4 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Cinco pellets, ângulos−0,24..0,24 rad,1550 u/s, raio4, range160, life150 ms. Cooldown2,4 s; pequeno recuo aéreo120. Não é projétil de longo alcance.
- **Override de arma:** `{"kind":"lancer","reach":0,"length":62,"startup":0.08,"active":0.035,"recovery":0.45,"shot":"pellet","cooldown":2.4}`. Campos omitidos herdam classe processada; tempos em segundos antes de attackSpeed.

**Localizar:** `blunderbuss` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### IOIÔ — `yoyo`

Segure atacar para lançar e controlar o ioiô com a mira, dentro do alcance. Solte para recolher. Ele não atravessa paredes, pode ser aparado e tem duração limitada.

- **Categoria / raridade:** weapon / rare.
- **Acionamento / bind:** M1 · atacar; consulte a descrição para o gesto específico.
- **Recarga:** 1 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Projétil piercing, raio13; alcance controlado185, manutenção de ataque até1,3 s antes de retorno. Cooldown1 s; paredes/parry interrompem, não atravessa cenário.
- **Override de arma:** `{"kind":"assassin","reach":0,"length":25,"startup":0.08,"active":0.02,"recovery":0.18,"shot":"yoyo","cooldown":1}`. Campos omitidos herdam classe processada; tempos em segundos antes de attackSpeed.

**Localizar:** `yoyo` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### YAMATO — `yamato`

Toque em atacar para cortar. Segure para preparar e solte para abrir um corte distante na direção escolhida, sem projétil viajando até o alvo.

- **Categoria / raridade:** weapon / legendary.
- **Acionamento / bind:** M1 · atacar; consulte a descrição para o gesto específico.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Carga320/attackSpeed ms fixa mira; cria spatialcut distante300, raio70, life180 ms/warn40 ms. Recovery300/attackSpeed×attackRecovery ms. Não viaja como projétil entre origem e destino.
- **Override de arma:** `{"kind":"knight","reach":152,"startup":0.12,"active":0.105,"recovery":0.23}`. Campos omitidos herdam classe processada; tempos em segundos antes de attackSpeed.

**Localizar:** `yamato` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### RUYI JINGU BANG — `ruyi`

Toque em atacar para golpear. Segure para estender o bastão; contra o chão, a extensão também pode impulsionar você para cima.

- **Categoria / raridade:** weapon / legendary.
- **Acionamento / bind:** M1 · atacar; consulte a descrição para o gesto específico.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Carga320/attackSpeed ms; beam até620 recortado por superfície, raio12, life160 ms. Apontar ao chão com contato dá vy−1100. Recovery300/attackSpeed×attackRecovery ms.
- **Override de arma:** `{"kind":"staff","reach":160,"startup":0.14,"active":0.12,"recovery":0.23}`. Campos omitidos herdam classe processada; tempos em segundos antes de attackSpeed.

**Localizar:** `ruyi` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### ZENITH — `zenith`

O golpe principal é acompanhado por lâminas espectrais que percorrem trajetórias adicionais na região do ataque.

- **Categoria / raridade:** weapon / legendary.
- **Acionamento / bind:** M1 · atacar; consulte a descrição para o gesto específico.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Melee acompanhado por três spectralBlade com trajetórias curvas. Avisos90/115/140 ms, vida ativa280 ms, distâncias210/245. Parryable; não são três novas entidades de lutador.
- **Override de arma:** `{"kind":"knight","reach":139,"startup":0.16,"active":0.12,"recovery":0.29}`. Campos omitidos herdam classe processada; tempos em segundos antes de attackSpeed.

**Localizar:** `zenith` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### LÂMINA DO ECO — `echo`

Seu corte se repete cerca de 0,6 segundo depois, no mesmo lugar do mundo. A fissura avisa onde ele voltará; o eco não acompanha você.

- **Categoria / raridade:** weapon / legendary.
- **Acionamento / bind:** M1 · atacar; consulte a descrição para o gesto específico.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Captura geometria/pose/contorno da parede do ataque real. Espera600 ms e reexecuta no lugar original, com aviso. Não recalcula com arma atual nem persegue alvo; echo conserva perfil histórico.
- **Override de arma:** `{"kind":"knight","reach":144,"startup":0.17,"active":0.12,"recovery":0.29}`. Campos omitidos herdam classe processada; tempos em segundos antes de attackSpeed.

**Localizar:** `echo` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

## Vestimentas

### BOTA ALADA — `wingboot`

Concede mais um salto no ar, além dos saltos normais.

- **Categoria / raridade:** clothing / common.
- **Acionamento / bind:** Passivo · efeitos de voo podem receber tecla ou gesto no TAB.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** airJumps base1 passa a2 ao pousar/reset/refill. Passivo enquanto equipado, sem cooldown/timer ou entidade independente.

**Localizar:** `wingboot` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### SANDÁLIAS DO VENTO — `sandals`

Aumenta a velocidade de corrida.

- **Categoria / raridade:** clothing / common.
- **Acionamento / bind:** Passivo · efeitos de voo podem receber tecla ou gesto no TAB.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Multiplica speed por1,2 em weaponStats. Não multiplica dashSpeed; sem timer ou entidade.

**Localizar:** `sandals` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### JOELHEIRAS — `kneepads`

Seu deslize percorre uma distância maior.

- **Categoria / raridade:** clothing / common.
- **Acionamento / bind:** Passivo · efeitos de voo podem receber tecla ou gesto no TAB.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Ao iniciar slide, multiplica dashRemaining e slideRemaining por1,3. Passivo, não cria dash gratuito ou invulnerabilidade.

**Localizar:** `kneepads` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### LUVAS DE ESCALADA — `climbing`

Segure a direção contra a parede para ficar preso nela, sem deslizar. Solte para desgrudar ou pule para executar wall jump.

- **Categoria / raridade:** clothing / common.
- **Acionamento / bind:** Passivo · efeitos de voo podem receber tecla ou gesto no TAB.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Pressionar contra parede no ar zera vy, fora de locks/dash/técnica. Soltar libera. Duração contextual, sem entidade e sem recarga própria.

**Localizar:** `climbing` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### CAPA LEVE — `lightcape`

Segure pulo durante a queda para cair mais devagar. Não concede voo.

- **Categoria / raridade:** clothing / common.
- **Acionamento / bind:** Passivo · efeitos de voo podem receber tecla ou gesto no TAB.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Segurar pulo limita queda a160 u/s; impulso explícito e estados incompatíveis têm prioridade. Passivo sem consumo de fuel.

**Localizar:** `lightcape` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### FAIXA DO DUELISTA — `duelistband`

Reduz a recuperação de uma tentativa de parry que falhou.

- **Categoria / raridade:** clothing / common.
- **Acionamento / bind:** Passivo · efeitos de voo podem receber tecla ou gesto no TAB.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** setState(parryRecovery) multiplica duração por0,65; wrapper de parry recalcula cooldown como janela ativa + recovery×0,65. Janela ativa fica igual. Sem entidade.

**Localizar:** `duelistband` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### MANTO SOMBRIO — `shadowcloak`

Durante um breve trecho do dash, você atravessa adversários e fica intangível contra ataques. Paredes sólidas continuam bloqueando a passagem.

- **Categoria / raridade:** clothing / rare.
- **Acionamento / bind:** Passivo · efeitos de voo podem receber tecla ou gesto no TAB.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Início do dash aplica effects.shadow80 ms; permite atravessar corpos durante dash e absorver golpe nessa janela. Paredes permanecem sólidas.

**Localizar:** `shadowcloak` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### CAPA PLANADORA — `glider`

Segure pulo no ar para planar, preservando deslocamento horizontal e reduzindo a queda. Solte para fechar. Se houver outros equipamentos de voo, escolha o gesto no inventário.

- **Categoria / raridade:** clothing / rare.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 0.2 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Gesto jumpHeld ou toggle de até60 s; fecha por gesto solto se não houver toggle. Queda limitada90; horizontal speed×regra+75, preserva drift sem input. Não consome fuel; dash/jump/baixo interrompem a atuação naquele passo.

**Localizar:** `glider` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### ARMADURA DE CRISTAL — `crystal`

Bloqueia um golpe mortal por partida e se estilhaça. A proteção volta no próximo confronto, não a cada duelo.

- **Categoria / raridade:** clothing / rare.
- **Acionamento / bind:** Passivo · efeitos de voo podem receber tecla ou gesto no TAB.
- **Recarga:** Limitado pelo escopo, sem cooldown de recast comum.
- **Uso/reset:** Um uso por partida/confronto; não restaura a cada ponto.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Primeiro golpe fatal da partida é absorvido; used.match.crystal e efeito crystalBreak. Não salva queda, não renova no próximo duelo.

**Localizar:** `crystal` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### BOTAS MAGNÉTICAS — `magnetic`

Segure a direção contra uma parede para correr por ela brevemente. Não permite caminhar livremente pelo teto.

- **Categoria / raridade:** clothing / rare.
- **Acionamento / bind:** Passivo · efeitos de voo podem receber tecla ou gesto no TAB.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Contra parede sobe a240 por até1,4 s; reserva restaura no chão. Depois cai ou usa climbing/stonemask se houver. Não caminha livremente no teto.

**Localizar:** `magnetic` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### MANTO DO ESPELHO — `mirrorcloak`

O dash deixa uma imagem sua na origem para confundir o adversário. A imagem não ataca nem possui colisão.

- **Categoria / raridade:** clothing / rare.
- **Acionamento / bind:** Passivo · efeitos de voo podem receber tecla ou gesto no TAB.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Dash cria afterimage com pose clonada por400 ms. Puramente imagem, sem corpo ofensivo/colisão ou clone de IA.

**Localizar:** `mirrorcloak` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### BOTAS-FOGUETE — `rockets`

Segure pulo no ar para subir com propulsores. O combustível é limitado e recarrega ao pousar. Escolha o gesto no inventário se tiver outros equipamentos de voo.

- **Categoria / raridade:** clothing / rare.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 0.2 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Fuel compartilhado inicia1; consumo0,6/s, refill0,7/s no chão. Aceleração vertical3000 até−590; toggle/gesto, sem voo ao dash/impulso/jump. Cooldown de ativação não substitui limite de combustível.

**Localizar:** `rockets` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### ARMADURA DO BERSERKER — `berserker`

Uma vez por partida, um golpe mortal inicia dois segundos de fúria. Mate um inimigo nesse intervalo para sobreviver; caso contrário, você morre ao final.

- **Categoria / raridade:** clothing / legendary.
- **Acionamento / bind:** Passivo · efeitos de voo podem receber tecla ou gesto no TAB.
- **Recarga:** Limitado pelo escopo, sem cooldown de recast comum.
- **Uso/reset:** Um uso por partida/confronto; não restaura a cada ponto.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Absorve morte uma vez por match e abre berserk por2 s. Kill cancela dívida; expirar sem kill causa morte forçada. Dívida ignora Cristal/Barreira, mas ADMIN/Anel ainda podem impedir.

**Localizar:** `berserker` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### ASAS DE ÍCARO — `icarus`

Permite voo controlado com energia limitada, recuperada ao pousar. Use a ação própria ou selecione o gesto de pulo no inventário.

- **Categoria / raridade:** clothing / legendary.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 0.2 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Fuel1, consumo0,4/s e refill0,7/s apoiado; comando vertical±350, horizontal continua controlado. Toggle/gesto; sem entidade ofensiva. Gravidade invertida usa referencial próprio.

**Localizar:** `icarus` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### TRAJE FANTASMA — `ghostsuit`

O dash pode atravessar partes da geometria. O destino precisa ser válido; os limites laterais fechados do Caminho continuam bloqueados.

- **Categoria / raridade:** clothing / legendary.
- **Acionamento / bind:** Passivo · efeitos de voo podem receber tecla ou gesto no TAB.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Dash marca phasing e origem segura, ignora geometria elegível/corpos; ao terminar, destino inválido volta à origem. Paredes fechadas do Caminho continuam obrigatórias.

**Localizar:** `ghostsuit` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### MÁSCARA DE PEDRA — `stonemask`

Transformação vampírica: melhora a corrida e os saltos, permite agarrar paredes e restaura recursos de mobilidade ao matar um inimigo.

- **Categoria / raridade:** clothing / legendary.
- **Acionamento / bind:** Passivo · efeitos de voo podem receber tecla ou gesto no TAB.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Speed×1,08, jump×1,12, aderência à parede; kill restaura dash/airJumps/fuel. Passivo, não drena HP de vítima nem cria barra de vida.

**Localizar:** `stonemask` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### MANTO DA GRAVIDADE — `gravitycloak`

Ative para inverter sua própria gravidade. Ative novamente para voltar ao normal. Os outros combatentes não são invertidos.

- **Categoria / raridade:** clothing / legendary.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 1 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Alterna effects.inverted até nova ativação/reset. Zera vy, solta apoio; movimento usa mapa/ator refletidos temporariamente. Cooldown1 s; não inverte demais jogadores.

**Localizar:** `gravitycloak` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

## Relíquias

### SINO DE GUERRA — `warbell`

Um Perfect Parry recarrega imediatamente seu dash.

- **Categoria / raridade:** relic / common.
- **Acionamento / bind:** Passivo · usos e escolhas especiais aparecem no TAB.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Evento Perfect Parry enche cargas do dash e zera sua recarga. Sem janela/cooldown adicional; não aumenta duração do parry.

**Localizar:** `warbell` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### AMPULHETA RACHADA — `crackedglass`

Matar um inimigo restaura seus recursos de dash e saltos aéreos.

- **Categoria / raridade:** relic / common.
- **Acionamento / bind:** Passivo · usos e escolhas especiais aparecem no TAB.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Kill creditado restaura dashCharges/cooldown/airDashes/airJumps/fuel. Não aciona por whiff nem duplica crédito de morte em grupo.

**Localizar:** `crackedglass` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### OLHO DE VIDRO — `glasseye`

Um brilho avisa quando o inimigo começa a preparar um ataque. O aviso não aumenta sua janela de defesa.

- **Categoria / raridade:** relic / common.
- **Acionamento / bind:** Passivo · usos e escolhas especiais aparecem no TAB.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Em windup inimigo, cria tell sobre ele por170 ms para observador possuidor. Informação visual, não alteração de reação/hitbox.

**Localizar:** `glasseye` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### MOEDA VICIADA — `coin`

Permite sortear novamente todas as cartas uma vez em cada escolha, antes de confirmar qualquer carta. Preserva a opção extra do Trevo.

- **Categoria / raridade:** relic / common.
- **Acionamento / bind:** Interface de draft, não botão de combate.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Draft com futureDraft!==false; laboratório pode forçar.
- **Mecânica, duração, entidades e limites:** Uma rerrolagem de todas as opções antes da primeira escolha de cada draft. Estado rerolled pertence ao draft; preserva quantidade do Trevo. Não é ativo de combate.

**Localizar:** `coin` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Fluxo de recompensa em [path.js](../work/v8/path.js) e [v8-ui.js](../work/v8/v8-ui.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### DENTE DE LOBO — `wolftooth`

Escape de um golpe por pouco usando dash para ampliar levemente seu próximo corte. Ataque logo para aproveitar a abertura.

- **Categoria / raridade:** relic / common.
- **Acionamento / bind:** Passivo · usos e escolhas especiais aparecem no TAB.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Near miss durante dash ativa wolf450 ms; próximo attackId conserva alcance×1,2. Contato aproximado usa cápsula expandida em10, sem conceder hitbox ao golpe esquivado.

**Localizar:** `wolftooth` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### TALISMÃ DE FERRO — `irontalisman`

Reduz bastante o deslocamento recebido de chutes, empurrões e impulsos não letais.

- **Categoria / raridade:** relic / common.
- **Acionamento / bind:** Passivo · usos e escolhas especiais aparecem no TAB.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** knockbackScale=0,55 para empurrões que consultam esse helper. Não reduz dano letal nem garante proteção contra quedas.

**Localizar:** `irontalisman` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### INCENSO DA CALMA — `incense`

Fique parado brevemente para preparar uma janela maior no próximo parry. Depois de usá-la, pare novamente para preparar outra.

- **Categoria / raridade:** relic / common.
- **Acionamento / bind:** Passivo · usos e escolhas especiais aparecem no TAB.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Parado/idle mais de1 s prepara incenseReady. Próximo parry válido recebe janela×1,25 e cooldown ajustado; flag consumida e still zerado na ativação. Não reativa enquanto andando.

**Localizar:** `incense` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### TREVO DE QUATRO FOLHAS — `clover`

As escolhas de Legados oferecem quatro cartas em vez de três.

- **Categoria / raridade:** relic / rare.
- **Acionamento / bind:** Interface de draft, não botão de combate.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Draft com futureDraft!==false; laboratório pode forçar.
- **Mecânica, duração, entidades e limites:** Número de opções do draft passa3→4. Não dá duas escolhas; esse é Contrato. Sem timer/entidade.

**Localizar:** `clover` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Fluxo de recompensa em [path.js](../work/v8/path.js) e [v8-ui.js](../work/v8/v8-ui.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### D6 — `d6`

Uma vez por partida, transforme um Legado próprio elegível em outro aleatório da mesma raridade. Escolha o alvo no inventário antes de ativar. O original volta ao fim da partida.

- **Categoria / raridade:** relic / rare.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** Limitado pelo escopo, sem cooldown de recast comum.
- **Uso/reset:** Um uso por partida/confronto; não restaura a cada ponto.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Escolha target no TAB; se ausente/inválido, usa primeiro elegível. Transformação mesma raridade, categoria pode mudar. Até fim do match, um uso/match; exclui próprio D6, duplicatas e incompatíveis.

**Localizar:** `d6` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### RELÓGIO PARADO — `stoppedclock`

Perfect Parry desacelera brevemente as ameaças hostis. Você permanece em velocidade normal; existe uma recarga interna entre ativações.

- **Categoria / raridade:** relic / rare.
- **Acionamento / bind:** Passivo · usos e escolhas especiais aparecem no TAB.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Perfect Parry cria slowTime por280 ms com factor0,4; cd interno3 s. Hostis afetados, dono normal. Não paralisa mundo inteiro.

**Localizar:** `stoppedclock` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### ESPELHO PARTIDO — `brokenmirror`

Memoriza uma habilidade ou especial compatível usado por um adversário próximo. Ative para executar uma cópia, uma vez por partida.

Memoriza uma habilidade ou especial compatível usado a até 480 px. A tecla executa uma cópia por partida, sem gastar sua carga própria. Especiais copiados mantêm suas penalidades e não podem ser sobrepostos. A forma temporária da arma não altera sua classe, skin ou inventário.

- **Categoria / raridade:** relic / rare.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** Limitado pelo escopo, sem cooldown de recast comum.
- **Uso/reset:** Um uso por partida/confronto; não restaura a cada ponto.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Memoriza última habilidade compatível até480 de distância. Um cast/match, limpa memória após sucesso. Cópia de especial exige specials ligado/estado válido e mantém penalidades; poderes usam whitelist, sem recursão.

**Localizar:** `brokenmirror` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### CARTA MARCADA — `markedcard`

Marque uma carta durante a escolha para encontrá-la novamente em uma seleção futura válida. A marca é consumida quando ela reaparece.

- **Categoria / raridade:** relic / rare.
- **Acionamento / bind:** Interface de draft, não botão de combate.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Draft com futureDraft!==false; laboratório pode forçar.
- **Mecânica, duração, entidades e limites:** Marcação de uma opção não escolhida no draft; reaparece em seleção futura elegível e consome marca. Não substitui slot necessário de raridade garantida.

**Localizar:** `markedcard` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Fluxo de recompensa em [path.js](../work/v8/path.js) e [v8-ui.js](../work/v8/v8-ui.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### AMPULHETA DO SOBREVIVENTE — `survivorglass`

Uma vez por partida, passar muito perto de um golpe letal sem ser atingido provoca uma breve desaceleração automática.

- **Categoria / raridade:** relic / rare.
- **Acionamento / bind:** Passivo · usos e escolhas especiais aparecem no TAB.
- **Recarga:** Limitado pelo escopo, sem cooldown de recast comum.
- **Uso/reset:** Um uso por partida/confronto; não restaura a cada ponto.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Uma vez/match, near miss de golpe melee cria slowTime250 ms factor0,18. Não absorve um contato fatal já ocorrido.

**Localizar:** `survivorglass` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### ÍMÃ DA FORTUNA — `magnet`

Quando uma seleção contém uma carta Lendária, outra opção também será Rara ou melhor.

- **Categoria / raridade:** relic / rare.
- **Acionamento / bind:** Interface de draft, não botão de combate.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Draft com futureDraft!==false; laboratório pode forçar.
- **Mecânica, duração, entidades e limites:** Quando draft inclui lendária, promove outra opção a rara ou superior. Não aumenta isoladamente chance base de lendária; sem timer.

**Localizar:** `magnet` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Fluxo de recompensa em [path.js](../work/v8/path.js) e [v8-ui.js](../work/v8/v8-ui.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### PEDRA FILOSOFAL — `philosopher`

Uma vez por run, transforma um Legado próprio aleatório em outro da mesma categoria e raridade superior. A transformação dura a partida; a Pedra permanece consumida depois.

- **Categoria / raridade:** relic / legendary.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** Limitado pelo escopo, sem cooldown de recast comum.
- **Uso/reset:** Um uso por run; não restaura no confronto seguinte.
- **Consumo / acúmulo:** Permanece consumed na run após uso. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Transforma item aleatório comum→raro/raro→lendário da mesma categoria até fim do match. Marca consumed além de used.run; original volta, Pedra continua gasta. Falha sem alvo/pool válido não gasta.

**Localizar:** `philosopher` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### COROA DO CONQUISTADOR — `crown`

No Caminho, derrotar um miniboss permite escolher um Legado dele para sua build. Essa recompensa é extra, além da escolha normal.

- **Categoria / raridade:** relic / legendary.
- **Acionamento / bind:** Interface de draft, não botão de combate.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Draft só Caminho, nível<45; laboratório pode forçar.
- **Mecânica, duração, entidades e limites:** Só Caminho com miniboss futuro. Vitória de miniboss oferece roubo extra de um ID da build inimiga não possuído. Não rouba classe, stats ou todos os itens.

**Localizar:** `crown` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Fluxo de recompensa em [path.js](../work/v8/path.js) e [v8-ui.js](../work/v8/v8-ui.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### CONTRATO DO DIABO — `contract`

Depois de um miniboss, escolha duas cartas em vez de uma. Não se aplica a encontros comuns nem a bosses.

- **Categoria / raridade:** relic / legendary.
- **Acionamento / bind:** Interface de draft, não botão de combate.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Draft só Caminho, nível<45; laboratório pode forçar.
- **Mecânica, duração, entidades e limites:** Draft de miniboss passa choices1→2. Não duplica recompensa de boss/comum. Persistente na build, sem entidade.

**Localizar:** `contract` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Fluxo de recompensa em [path.js](../work/v8/path.js) e [v8-ui.js](../work/v8/v8-ui.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### ORBE DO DESTINO — `destinyorb`

Uma vez por run, veja outra seleção de cartas e decida se quer substituir a atual. Olhar já consome o uso, mesmo se você mantiver as cartas antigas.

- **Categoria / raridade:** relic / legendary.
- **Acionamento / bind:** Interface de draft, não botão de combate.
- **Recarga:** Limitado pelo escopo, sem cooldown de recast comum.
- **Uso/reset:** Um uso por run; não restaura no confronto seguinte.
- **Consumo / acúmulo:** Uso de run gasto ao visualizar; item continua na lista. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Draft com futureDraft!==false; laboratório pode forçar.
- **Mecânica, duração, entidades e limites:** Ação na tela de draft; activate em combate retorna false. Preview já marca used.run e avança RNG; aceitar troca seleção, recusar mantém anterior sem devolver uso.

**Localizar:** `destinyorb` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Fluxo de recompensa em [path.js](../work/v8/path.js) e [v8-ui.js](../work/v8/v8-ui.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### ANEL DA SEGUNDA CHANCE — `secondchance`

Uma vez por partida, uma morte rebobina o duelo ao início sem conceder o ponto. Usos limitados já gastos, incluindo o próprio Anel, não são devolvidos.

- **Categoria / raridade:** relic / legendary.
- **Acionamento / bind:** Passivo · usos e escolhas especiais aparecem no TAB.
- **Recarga:** Limitado pelo escopo, sem cooldown de recast comum.
- **Uso/reset:** Um uso por partida/confronto; não restaura a cada ponto.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Morte ou queda solicita rewind para legacyRoundStart sem ponto. Uma vez/match. Rewind preserva usos/consumidos/binds gastos, inclusive próprio Anel. Não cria checkpoint arbitrário.

**Localizar:** `secondchance` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### DADO DE 20 FACES — `d20`

Uma vez por partida, role de 1 a 20. Antes de ativar, escolha no inventário: alterar seu personagem nesta partida ou a raridade da próxima seleção. Números baixos prejudicam; altos favorecem. As garantias de recompensa são preservadas.

- **Categoria / raridade:** relic / legendary.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** Limitado pelo escopo, sem cooldown de recast comum.
- **Uso/reset:** Um uso por partida/confronto; não restaura a cada ponto.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Um uso/match. Destino character aplica bônus por face:1=.58;2–5=.8;6–9=.93;10–11=1;12–15=1.12;16–19=1.25;20=1.45. Speed multiplica, startup/recovery dividem. Destino draft altera próximo sorteio mantendo garantias.

**Localizar:** `d20` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### OLHO DO DESTINO — `destinyeye`

Uma vez por partida, um golpe fatal iminente abre uma curtíssima chance de reagir. Pule, use dash ou parry para escapar; a sobrevivência não é automática.

- **Categoria / raridade:** relic / legendary.
- **Acionamento / bind:** Passivo · usos e escolhas especiais aparecem no TAB.
- **Recarga:** Limitado pelo escopo, sem cooldown de recast comum.
- **Uso/reset:** Um uso por partida/confronto; não restaura a cada ponto.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Uma vez/match, fatal guarda shape/origin e abre220 ms de reação; hostis factor0,05. Ao fim, colisão pendente é reavaliada e pode ser aparada. Não é escudo automático permanente.

**Localizar:** `destinyeye` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

## Técnicas

### GOLPE DESCENDENTE — `downstrike`

No ar, segure baixo e ataque para golpear nessa direção. Sem arma, o movimento vira uma pisada corporal.

- **Categoria / raridade:** technique / common.
- **Acionamento / bind:** Combinação de movimento e combate indicada na descrição.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Baixo+ataque no ar fixa direção descendente; forma depende de arma. Desarmado converte para plunge/pisada conforme hook. Sem tecla ativa independente.

**Localizar:** `downstrike` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### GOLPE ASCENDENTE — `upstrike`

Segure cima e ataque para orientar o golpe verticalmente. A forma acompanha a arma equipada.

- **Categoria / raridade:** technique / common.
- **Acionamento / bind:** Combinação de movimento e combate indicada na descrição.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Cima+ataque orienta mira para−π/2. Usa timings/forma da arma; sem entidade/cooldown adicional.

**Localizar:** `upstrike` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### CHUTE VOADOR — `flyingkick`

Chute no ar para avançar em diagonal e empurrar o adversário. Não mata diretamente.

- **Categoria / raridade:** technique / common.
- **Acionamento / bind:** Combinação de movimento e combate indicada na descrição.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Chute aéreo recebe vx650 na direção frontal, vy−260 e impulso180 ms. Mantém natureza não letal, usa cooldown do chute.

**Localizar:** `flyingkick` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### CHUTE GIRATÓRIO — `roundhouse`

Segure chute brevemente para executar um golpe amplo, com maior empurrão. Não mata diretamente.

- **Categoria / raridade:** technique / common.
- **Acionamento / bind:** Combinação de movimento e combate indicada na descrição.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Segurar chute220 ms arma roundhouse420 ms. Contato radial próximo86 empurra630, uma vez por vítima/ação. Não cria golpe letal.

**Localizar:** `roundhouse` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### PISADA — `stomp`

No ar, segure baixo e chute para despencar. Atingir um inimigo o empurra para baixo e faz você quicar.

- **Categoria / raridade:** technique / common.
- **Acionamento / bind:** Combinação de movimento e combate indicada na descrição.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Baixo+chute aéreo aplica vy950; enquanto descendo, inimigo abaixo dentro da faixa é empurrado620, dono quica−650. Usa efeito stomp450 ms e colisão de cenário.

**Localizar:** `stomp` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### SALTO DE PAREDE OFENSIVO — `wallstrike`

Ataque junto do wall jump para sair da parede golpeando.

- **Categoria / raridade:** technique / common.
- **Acionamento / bind:** Combinação de movimento e combate indicada na descrição.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Wall jump junto do ataque prepara counter180 ms para saída ofensiva. Depende do contato real com parede, não teleporta ao alvo.

**Localizar:** `wallstrike` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### CONTRA-ATAQUE — `counter`

Ataque logo após um parry bem-sucedido para responder com preparação mais rápida. O contra-ataque exige seu comando.

- **Categoria / raridade:** technique / rare.
- **Acionamento / bind:** Combinação de movimento e combate indicada na descrição.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Após parry bem-sucedido, effects.counter260 ms reduz startup à metade. Precisa comando de ataque; sem contra-golpe automático.

**Localizar:** `counter` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### CANCELAMENTO DE DASH — `dashcancel`

Depois do início da recuperação do ataque, use dash para cancelá-la. Consome uma carga disponível; não cancela qualquer fase do golpe.

- **Categoria / raridade:** technique / rare.
- **Acionamento / bind:** Combinação de movimento e combate indicada na descrição.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Pode cancelar recovery depois de35% da duração em dash normal com carga. Não cancela startup/active, não ignora lock/limite aéreo.

**Localizar:** `dashcancel` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### CORTE DE PROJÉTEIS — `projectilecut`

Acerte um projétil com seu ataque no momento certo para destruí-lo ou rebatê-lo, sem usar parry.

- **Categoria / raridade:** technique / rare.
- **Acionamento / bind:** Combinação de movimento e combate indicada na descrição.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Slash ativo intercepta trajeto de projétil não-zone. Projétil comum é destruído, arma recuperável cai. Não corta qualquer área de poder ou invocação inteira.

**Localizar:** `projectilecut` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### ARREMESSO — `throw`

Perto do inimigo, segure baixo e chute para agarrá-lo e lançá-lo para o outro lado. Não mata diretamente, mas pode provocar uma queda.

- **Categoria / raridade:** technique / rare.
- **Acionamento / bind:** Combinação de movimento e combate indicada na descrição.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Baixo+chute no chão próximo (<65) projeta inimigo para destino livre atrás e empurra650. Cooldown700/recovery350 ms; não mata diretamente, queda pode matar.

**Localizar:** `throw` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### PASSO DE RECUO — `backstep`

No começo da preparação do ataque, segure a direção contrária ao golpe e use dash para cancelar em um recuo curto. Exige uma carga disponível.

- **Categoria / raridade:** technique / rare.
- **Acionamento / bind:** Combinação de movimento e combate indicada na descrição.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Startup até min(140 ms,65% da duração), input contrário ao golpe +dash. Consome carga; duração do dash×0,65. Não pode cancelar golpe que já acertou.

**Localizar:** `backstep` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### INVESTIDA OFENSIVA — `lunge`

Ataque logo no início do dash para convertê-lo em uma investida comprometida com aquela direção. Errar deixa uma recuperação maior.

- **Categoria / raridade:** technique / rare.
- **Acionamento / bind:** Combinação de movimento e combate indicada na descrição.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Ataque até70 ms após início do dash converte para técnica comprometida; distância130, startup×0,65, active140 ms, recovery×1,35. Direção fixa, sem parry/dash/pulo para cancelar.

**Localizar:** `lunge` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### IAIJUTSU — `iaijutsu`

Logo após terminar um dash terrestre, ataque para executar um corte de saque horizontal que atravessa a linha ofensiva. Exige uma arma corpo a corpo compatível.

- **Categoria / raridade:** technique / rare.
- **Acionamento / bind:** Combinação de movimento e combate indicada na descrição.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Ataque até220 ms após dash terrestre com melee elegível. Distância155, startup×0,6, active130 ms, recovery×1,4. Atravessa corpos no active, não paredes.

**Localizar:** `iaijutsu` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### MIKIRI — `mikiri`

Use dash na direção de uma estocada ou investida linear no instante certo para neutralizá-la. Não funciona contra qualquer tipo de golpe.

- **Categoria / raridade:** technique / legendary.
- **Acionamento / bind:** Combinação de movimento e combate indicada na descrição.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Dash para estocada ativa dentro dos primeiros100 ms, alinhamento>0,65 e bodyContact. Atordoamento450 ms, hitstop45; emite perfect parry. Exclui corte de quebra/ult e ataques não lineares.

**Localizar:** `mikiri` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### DESARMAMENTO — `disarm`

Um Perfect Parry derruba a arma elegível do inimigo automaticamente. Ele precisa recuperá-la para voltar a usá-la.

- **Categoria / raridade:** technique / legendary.
- **Acionamento / bind:** Combinação de movimento e combate indicada na descrição.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Perfect melee parry com disarmEligible derruba weapon original. Punhos, técnicas sem arma e projéteis não contam. Recolher é necessário; item não é removido permanentemente do inventário.

**Localizar:** `disarm` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### PASSO PERFEITO — `perfectstep`

Um dash no último instante antes do contato pode gerar uma esquiva perfeita e uma breve oportunidade de resposta.

- **Categoria / raridade:** technique / legendary.
- **Acionamento / bind:** Combinação de movimento e combate indicada na descrição.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Ao dash, se hitbox melee inimiga ativa já ameaça corpo, aplica shadow100 ms. Não lê botão do inimigo; oportunidade é intangibilidade curta, sem buff adicional de dano.

**Localizar:** `perfectstep` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### SEM SAQUE — `nodraw`

Fique parado no chão para assumir a postura de saque. O próximo ataque começa muito rápido, mas errar aumenta sua recuperação.

- **Categoria / raridade:** technique / legendary.
- **Acionamento / bind:** Combinação de movimento e combate indicada na descrição.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Idle no chão por>1 s prepara nodraw300 ms; próximo golpe startup×0,5. Marca attackId; whiff aumenta recovery×1,7. Movimento quebra preparo.

**Localizar:** `nodraw` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### MESTRE DAS ARMAS — `weaponmaster`

Ative para arremessar a arma equipada como um projétil físico e letal. Ela pode ser aparada e colide com o cenário. Você fica sem arma até recuperá-la; Leviatã conserva seu chamado de volta.

- **Categoria / raridade:** technique / legendary.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 1 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Arremessa arma física a1000, raio12, entidade weapon piercing recuperável. Fica weaponAway; não troca classe/posse. Rejeita arma fora, punhos, especiais incompatíveis.

**Localizar:** `weaponmaster` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

## Invocações

### CORVO — `raven`

Acompanha você e faz rasantes periódicos que interrompem e empurram levemente inimigos, sem matar.

- **Categoria / raridade:** summon / common.
- **Acionamento / bind:** Companheiro automático; invocações ativas recebem tecla.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Companion não letal, rasante periódico (intervalo3 s, aviso350 ms, ataque1,1 s), empurra/interrompe e retorna. Pode ser destruído por golpe; não é projétil infinito.

**Localizar:** `raven` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### SLIME — `slime`

Segue pelo chão e gruda brevemente em inimigos para reduzir seu movimento, sem paralisá-los completamente.

- **Categoria / raridade:** summon / common.
- **Acionamento / bind:** Companheiro automático; invocações ativas recebem tecla.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Companion terrestre velocidade120. Ao tocar alvo cola por900 ms e renova slimeSlow (speed×0,7); depois retorna e espera ao menos2 s. Não paralisa completamente/não mata.

**Localizar:** `slime` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### BESOURO-ESCUDO — `beetle`

Orbita você e intercepta um projétil hostil. Precisa recarregar antes de proteger novamente; não bloqueia golpes corpo a corpo.

- **Categoria / raridade:** summon / common.
- **Acionamento / bind:** Companheiro automático; invocações ativas recebem tecla.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Companion orbital intercepta um projétil letal não-zone próximo45, cooldown interno4 s. Não bloqueia ataque melee como escudo universal.

**Localizar:** `beetle` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### FADA — `fairy`

Depois de um período sem pousar, concede um pequeno impulso vertical automático. Não é um salto sob comando nem voo contínuo.

- **Categoria / raridade:** summon / common.
- **Acionamento / bind:** Companheiro automático; invocações ativas recebem tecla.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Após1,1 s sem pousar, se descendo e pronta aplica vy−560; cooldown5 s. Impulso automático, não salto sob comando; não é vulnerável como summon físico comum.

**Localizar:** `fairy` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### CÃO DE CAÇA — `hound`

Persegue o adversário, morde para empurrar e retorna para recuperar. A mordida não mata diretamente.

- **Categoria / raridade:** summon / common.
- **Acionamento / bind:** Companheiro automático; invocações ativas recebem tecla.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Companion terrestre persegue/morde sem matar; ciclo base3 s, aviso350 ms. Segue apoio/parede; não ignora geometria para alcançar jogador.

**Localizar:** `hound` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### ESPÍRITO-LANTERNA — `lantern`

Marca periodicamente o inimigo com um brilho, ajudando a acompanhar sua posição entre fumaça e efeitos.

- **Categoria / raridade:** summon / common.
- **Acionamento / bind:** Companheiro automático; invocações ativas recebem tecla.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Marca alvo a até700 durante2 s, varredura280 ms, intervalo4,5 s. É indicação visual de posição, sem dano/rastreamento através de input privado.

**Localizar:** `lantern` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### MACAQUINHO LADRÃO — `monkey`

Busca armas caídas e as carrega até você. Não equipa automaticamente a arma roubada; atingir o macaco faz a arma cair.

- **Categoria / raridade:** summon / common.
- **Acionamento / bind:** Companheiro automático; invocações ativas recebem tecla.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Busca entidade weapon dropped, carrega até dono a280 e larga próximo32. Arma mantém proprietário; macaco atingido larga. Não equipa automaticamente arma alheia.

**Localizar:** `monkey` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### FALCÃO DE GUERRA — `falcon`

Ative para ordenar um mergulho na direção da mira. O ataque é letal, possui aviso e pode ser aparado. O falcão precisa retornar antes de atacar novamente.

- **Categoria / raridade:** summon / rare.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 5 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Comando ativo requer estar retornado perto do dono. Aviso350 ms, janela de ataque1,5 s, velocidade880; letal/parryable. Cooldown5 s não dispensa retorno físico.

**Localizar:** `falcon` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### ESPADACHIM ESPECTRAL — `spectral`

Materializa-se periodicamente no flanco inimigo, anuncia um corte próprio e desaparece. Não repete seu último ataque.

- **Categoria / raridade:** summon / rare.
- **Acionamento / bind:** Companheiro automático; invocações ativas recebem tecla.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Oculto, materializa em flanco±110 válido; startup380/AS, active130/AS, recovery220/AS ms, intervalo3,5 s. Ataque próprio, não cópia. Vulnerável enquanto materializado.

**Localizar:** `spectral` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### SAPO-GIGANTE — `toad`

Estica a língua para puxar inimigos, armas ou objetos ao alcance. Não funciona como gancho para mover você.

A língua anuncia e fixa a direção antes de esticar. Puxa o primeiro inimigo ou objeto que realmente alcançar, sem atravessar superfícies. Pode ser aparada; não funciona como gancho para mover você.

- **Categoria / raridade:** summon / rare.
- **Acionamento / bind:** Companheiro automático; invocações ativas recebem tecla.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Língua mira/fixa direção, aviso300 ms, extensão120 e retração160 ms, alcance240, cooldown4 s. Primeiro contato efetivo puxa ator/objeto; parryable/não letal, não move o dono como gancho.

**Localizar:** `toad` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### CAVALEIRO ESQUELETO — `skeleton`

Aliado com espada: ataca devagar, pode matar e pode ser aparado. Se atingido, desmonta e precisa de tempo para se reconstruir.

- **Categoria / raridade:** summon / rare.
- **Acionamento / bind:** Companheiro automático; invocações ativas recebem tecla.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Companion melee com startup400/active150/recovery550 ms ajustados pelas regras, speed220. Um golpe desmonta; reconstrói após6 s. Pode matar/aparar/clash, não possui múltiplos HP de lutador.

**Localizar:** `skeleton` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### MÍMICO — `mimic`

Acompanha você como um baú e tenta agarrar inimigos próximos. Também pode engolir certos projéteis e objetos antes de recuperar.

O baú avisa antes de abrir a boca. Agarra por um instante ou engole um projétil vindo pela frente; depois precisa recuperar. Armas recuperáveis ficam presas brevemente e caem de volta, mantendo o dono original.

- **Categoria / raridade:** summon / rare.
- **Acionamento / bind:** Companheiro automático; invocações ativas recebem tecla.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Alvo perto95 ou projétil frontal aproximando até260. Windup250, boca400, intervalo5 s. Agarra220 ms; arma recuperável é carregada650 ms e largada. Só tipos comestíveis explícitos, respeita frente/linha.

**Localizar:** `mimic` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### MEDUSA ABISSAL — `medusa`

Entidade flutuante que carrega eletricidade e cria uma zona circular perigosa ao redor de si. O aviso permite sair da área.

- **Categoria / raridade:** summon / rare.
- **Acionamento / bind:** Companheiro automático; invocações ativas recebem tecla.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Companion lento75, electriczone raio115, warn600 ms/life1,65 s, intervalo4,8 s. Zona acompanha fonte, letal/não parryable; sair da área é resposta.

**Localizar:** `medusa` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### DOPPELGÄNGER — `doppel`

Cópia fantasmagórica que repete seus movimentos, saltos e ataques físicos com atraso. Não copia poderes nem novas invocações.

- **Categoria / raridade:** summon / rare.
- **Acionamento / bind:** Companheiro automático; invocações ativas recebem tecla.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Histórico de movimento/pose/arma atrasado550 ms, sem body collision normal. Copia melee físico, não poderes/summons; perfil histórico evita trocar geometria retroativamente. Pode clash/parry/morrer.

**Localizar:** `doppel` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### NECROMANTE MIRIM — `necromancer`

No Caminho, reanima um inimigo que você matou como aliado temporário. Mantém apenas um servo por vez, até morrer, ser substituído ou terminar a partida.

- **Categoria / raridade:** summon / rare.
- **Acionamento / bind:** Companheiro automático; invocações ativas recebem tecla.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Draft só Caminho; laboratório pode adicionar fora dele, mas reanimação exige pathEncounter.
- **Mecânica, duração, entidades e limites:** Só elegível no Caminho. Kill recria um servant da classe morta, substituindo anterior. Sem build/Legados inimigos; dura até morte/substituição/reset de match. Entidade suporte não é o servo ofensivo.

**Localizar:** `necromancer` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### DRAGÃO ANCESTRAL — `dragon`

Ative para ordenar uma enorme rajada na região da mira após um aviso. Ela é letal e também pode atingir você: saia da área.

- **Categoria / raridade:** summon / legendary.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 16 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Comando cria dragonbreath raio210, aviso1,2 s/life2 s, posição na direção da mira; cooldown16 s. Letal, não parryable e friendly (atinge dono). Corpo de fundo não é alvo comum.

**Localizar:** `dragon` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### MAHORAGA — `mahoraga`

Aprende a responder às ameaças que enfrenta durante a partida, ajustando defesa, flancos e ataques aéreos. A roda indica a adaptação; ele continua vulnerável.

- **Categoria / raridade:** summon / legendary.
- **Acionamento / bind:** Companheiro automático; invocações ativas recebem tecla.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Companion físico; memória front/ranged/air por match. Aprende cada categoria após2 observações, roda marca adaptação. Front cria flanco550 ms/cd2,4 s; air salta−850/cd1,5 s; defesa ranged condicionada. Continua mortal.

**Localizar:** `mahoraga` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### STAR PLATINUM — `star`

Acompanha alguns ataques com golpes curtos. Sua ação ativa para brevemente o tempo hostil após um aviso, uma vez por duelo.

- **Categoria / raridade:** summon / legendary.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** Limitado pelo escopo, sem cooldown de recast comum.
- **Uso/reset:** Um uso por duelo; restaura no próximo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Acompanha active do dono com starPunch raio28, warn70/life170 ms, um por attackId. Ativo THE WORLD: life1,25 s incluindo350 ms de aviso (900 ms de parada hostil), uma vez/duelo.

**Localizar:** `star` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### KRAKEN — `kraken`

Ative para ordenar tentáculos na região da mira. Os comandos alternam entre esmagar, agarrar e bloquear uma rota, sempre com aviso.

A tecla ordena a região na mira. Os comandos alternam: Esmagar → Agarrar → Bloquear rota. O HUD indica o próximo. O bloqueio é uma zona perigosa temporária; contorne-a ou salte por cima.

- **Categoria / raridade:** summon / legendary.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 13 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Companion colossal fora da arena. Comando ancora krakenArm e alterna smash/grab/block, cooldown13 s. Avisos800/600/900 ms; duração após aviso240/350/2400 ms. Smash/block letais, grab não letal/parryable; contornos recortados por paredes.

**Localizar:** `kraken` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### REI SLIME — `slimeking`

Slime gigante que salta para atacar. Ao morrer, divide-se em dois menores; eles ainda podem formar quatro pequenos antes de desaparecer.

- **Categoria / raridade:** summon / legendary.
- **Acionamento / bind:** Companheiro automático; invocações ativas recebem tecla.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Companion terrestre, compressão480 ms menos60 por geração; salto vertical680−65×geração, vx limitado410. Letal na descida, recovery650 ms, ciclo3,4 s. Morte divide em2 e depois4; geração2 termina.

**Localizar:** `slimeking` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### LEGIÃO — `legion`

Três guerreiros espectrais: um de combate próximo, um arqueiro e um protetor. Cada um que morrer só volta no próximo duelo.

- **Categoria / raridade:** summon / legendary.
- **Acionamento / bind:** Companheiro automático; invocações ativas recebem tecla.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Três slots: melee, arqueiro, protetor. Melee perfil reach100/startup340/active130/recovery500 ms. Arqueiro startup520/AS, projétil590, cd2,2 s. Escudo frontal cd2,8 s; morto fica fallen até duelo seguinte.

**Localizar:** `legion` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### CAÇADOR DO ABISMO — `hunter`

Marca uma presa e anuncia a caçada antes de entrar na arena por um período curto. Depois recua para recuperar.

- **Categoria / raridade:** summon / legendary.
- **Acionamento / bind:** Companheiro automático; invocações ativas recebem tecla.
- **Recarga:** Sem recarga ativa única; condições/timers internos na nota técnica.
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Observa fora, marca presa por1 s, caça a710 por2,5 s, retira a850 e cooldown6 s. Só presa marcada recebe contato; parede pode abortar. Não é alvo vulnerável comum.

**Localizar:** `hunter` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

## Poderes

### BOLA DE FOGO — `fireball`

Lança uma bola de fogo letal na direção da mira. Sua trajetória é legível e pode ser aparada.

- **Categoria / raridade:** power / common.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 2.7 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** fireball a590 u/s, raio12, life2 s. Letal/parryable, colisão com cenário; cd2,7 s.

**Localizar:** `fireball` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### PULSO CINÉTICO — `pulse`

Uma onda ao seu redor empurra inimigos e objetos próximos. Não mata diretamente e respeita paredes.

- **Categoria / raridade:** power / common.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 4 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Onda imediata raio175 sem cruzar paredes; push650 em hostis e desloca objetos soltos. Effect pulse, não entidade de dano; cd4 s.

**Localizar:** `pulse` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### IMPULSO — `impulse`

Lança seu próprio corpo na direção da mira. Serve para mobilidade, sem causar dano direto.

- **Categoria / raridade:** power / common.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 3 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Velocidade na mira800, effects.impulse180 ms. Integra gravidade/colisão e cancela por ação incompatível. Não letal; cd3 s.

**Localizar:** `impulse` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### BARREIRA ARCANA — `barrier`

Cria uma defesa frontal temporária que quebra ao bloquear um ataque. Não conta como Perfect Parry nem contra-ataca.

- **Categoria / raridade:** power / common.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 7 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** effects.barrier3 s ou um bloqueio frontal; exige origem no lado facing. Não Perfect Parry, não protege automaticamente costas/queda; cd7 s.

**Localizar:** `barrier` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### TELECINESE — `telekinesis`

Mire em uma arma caída ou objeto elegível e ative para puxá-lo até você. Não puxa jogadores diretamente.

- **Categoria / raridade:** power / common.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 2 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** aimHit até650, apenas objeto elegível; arma usa mode fetch, outros pulledBy. Tether200 ms visual. Não puxa jogador; cd2 s, falha sem alvo não gasta.

**Localizar:** `telekinesis` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### RAJADA DE VENTO — `gust`

Cria uma corrente de ar que empurra continuamente inimigos, objetos e projéteis compatíveis.

- **Categoria / raridade:** power / common.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 5 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Zona a130 na mira, raio115, life850 ms; empurra continuamente atores/objetos/projéteis elegíveis. Não letal; cd5 s.

**Localizar:** `gust` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### TROCA — `swap`

Ative para marcar sua posição. Ative novamente dentro de quatro segundos para voltar, se o destino estiver livre. Não restaura o estado anterior do duelo.

- **Categoria / raridade:** power / common.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 5 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Marca4 s, recast liberado após200 ms. Segundo uso valida destino, teleporta e cd5 s. Não restaura velocidade/estado do passado nem rebobina mundo.

**Localizar:** `swap` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### WEB SHOOTERS — `web`

Mire e ative para lançar uma teia. Em superfícies válidas, ela prende um fio para puxar ou balançar seu corpo; em inimigos e objetos, provoca um puxão.

- **Categoria / raridade:** power / rare.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 2 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** aimHit até650. Ator recebe webhit não letal warn100/life220 ms, objeto fetch, superfície grapple2,2 s. Pulo solta, distância35 encerra; compartilhado com colisões. Cd2 s.

**Localizar:** `web` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### BLINK — `blink`

Teleporta uma curta distância na direção da mira até um destino válido. Pode transpor obstáculos finos, mas não sair pelos limites fechados do Caminho.

- **Categoria / raridade:** power / rare.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 3.5 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Busca destino livre a até230 na direção, em passos de6. Não percorre trajetória nem pode terminar em collider/fora da contenção. Cd3,5 s; falha sem deslocar não gasta.

**Localizar:** `blink` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### POÇO GRAVITACIONAL — `well`

Cria uma área temporária que atrai combatentes, projéteis e objetos para o centro. Não mata diretamente.

- **Categoria / raridade:** power / rare.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 8 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Zona a200 na mira, raio160, warn250 ms/life2,6 s; puxa atores inclusive dono e objetos. Não dano; cd8 s.

**Localizar:** `well` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### CORPO DE NÉVOA — `mist`

Transforma você brevemente em névoa, permitindo atravessar adversários e evitar ataques físicos. Você não pode atacar nesse estado.

- **Categoria / raridade:** power / rare.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 7 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** effects.mist1,1 s, permite atravessar corpos e bloqueia ataque do usuário. protect absorve eventos letais que chegam a ele, sem filtro por fonte física; queda segue via própria. Cd7 s.

**IMPLEMENTAÇÃO ATUAL DIFERE DA ESPECIFICAÇÃO ORIGINAL:** A descrição limita a intangibilidade a ataques físicos. L.protect não filtra a fonte para effects.mist: absorve também poderes/projéteis que passam por esse hook. Queda não passa por ele.

**Localizar:** `mist` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### CORRENTE ELÉTRICA — `lightning`

Mire em um inimigo ao alcance para anunciar um raio. O acerto pode saltar para outro alvo próximo.

- **Categoria / raridade:** power / rare.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 5 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** aimHit ator até350; raio inicial warn250/life380 ms, raio9. Encadeia até3 vítimas, próximas até200 com linha livre; avisos seguintes140 ms. Cd5 s.

**Localizar:** `lightning` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### CRIOCINESE — `ice`

Mire no chão para criar gelo escorregadio, em uma parede para criar uma plataforma temporária ou no inimigo para travar brevemente seu movimento.

- **Categoria / raridade:** power / rare.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 6 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** aimHit até330. Ator: frost warn120 ms, freeze120. Chão: atrito×0,055 em faixa±95 por4 s após200 ms. Parede: plataforma130 temporária indexada; cd6 s.

**Localizar:** `ice` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### BOMBA DE SOMBRA — `shadowbomb`

Ative para lançar a esfera. Ative novamente para detoná-la e criar fumaça escura no local. A fumaça prejudica a visão, sem tornar você invisível.

- **Categoria / raridade:** power / rare.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 6 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Primeiro uso projétil560/life6 s não letal, recast250 ms. Detonar cria smoke raio150/life2,8 s e inicia cd6 s. Não invisibilidade mecânica.

**Localizar:** `shadowbomb` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### REPULSOR — `repulsor`

Dispara um empurrão na direção da mira e lança você no sentido oposto. Mire para baixo para ganhar impulso aéreo.

- **Categoria / raridade:** power / rare.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 4 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Recuo próprio−650 na mira/impulso180 ms e feixe repulse até210, raio22/life120 ms, força800 no alvo. Não letal/parryable; cd4 s.

**Localizar:** `repulsor` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### SANDEVISTAN — `sandevistan`

Uma vez por duelo, desacelera fortemente as ameaças hostis por um período curto. Você continua agindo, mas ainda pode morrer.

- **Categoria / raridade:** power / legendary.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** Limitado pelo escopo, sem cooldown de recast comum.
- **Uso/reset:** Um uso por duelo; restaura no próximo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** slowTime life1,7 s incluindo aviso200 ms; fator hostil0,25 por1,5 s efetivos. Um uso/duelo. Dono normal; plataformas/cenário não usam esse fator.

**IMPLEMENTAÇÃO ATUAL DIFERE DA ESPECIFICAÇÃO ORIGINAL:** A descrição congelada diz “mundo inteiro”. L.timeScale afeta hostis e entidades pelo relógio do dono; plataformas e efeitos globais continuam com tempo do mundo.

**Localizar:** `sandevistan` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### ROOM — `room`

Ative para criar a esfera. Com ela ativa, mire em um alvo válido e ative novamente para anunciar a troca de posições. Você e o alvo precisam estar dentro da área, com destinos livres.

- **Categoria / raridade:** power / legendary.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 9 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Esfera fixa centro da ativação, raio280/life5 s; recast350 ms. Shambles alvo até560 dentro da esfera, warn300/life360 ms, troca validada no momento. Segundo cast cd9 s. Não troca qualquer decoração.

**IMPLEMENTAÇÃO ATUAL DIFERE DA ESPECIFICAÇÃO ORIGINAL:** A descrição fala em troca instantânea. Há aviso de300 ms antes de Shambles, e validação de área/suporte/destino no instante da execução. A troca de posição em si é instantânea após o aviso.

**Localizar:** `room` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### PORTAIS — `portals`

Ative mirando superfícies válidas para criar os dois portais. Eles transportam combatentes e objetos compatíveis, preservando o movimento. Uma nova dupla substitui a anterior.

- **Categoria / raridade:** power / legendary.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 1 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** raySurface até850, dois portais por dono, raio38/life12 s, cd1 s. Superfície precisa caber abertura76; pares distam≥80. Rotaciona momentum, lock250 ms evita loop; companions exigem flag não usada atualmente.

**Localizar:** `portals` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### AMATERASU — `amaterasu`

Marca uma região com chamas negras letais e temporárias, que se espalham um pouco por superfícies conectadas.

- **Categoria / raridade:** power / legendary.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 12 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** blackfire raio55, warn600 ms/life3,8 s. Após aviso+350 ms espalha uma vez±65 sobre superfície conectada, filhos raio28 sem recursão. Letal/não parryable; cd12 s.

**Localizar:** `amaterasu` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### KAMEHAMEHA — `kamehameha`

Segure a tecla da habilidade para carregar e solte para disparar. Antes de dois segundos, o feixe pode ser aparado; a partir daí, rompe o parry. Você fica vulnerável durante a carga, e o feixe ainda pode ser evitado.

- **Categoria / raridade:** power / legendary.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 12 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** Canal fixa mira, movimento×0,3. Soltar dispara; ≥2 s torna feixe não parryable e aumenta raio12→22..28; máximo3,2 s. Ray até1100 recortado, life250..334 ms. Cd12 s no disparo; cancelamento impõe≥800 ms.

**Localizar:** `kamehameha` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### THE HAND / APAGAR ESPAÇO — `thehand`

Uma varrida curta aproxima adversários e objetos ao remover uma faixa de distância. Não destrói permanentemente o cenário.

- **Categoria / raridade:** power / legendary.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 8 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** erase raio240, warn120/life300 ms; faixa angular frontal desloca atores/objetos até110 para perto, destino validado. Não letal/não apaga estruturas; cd8 s.

**Localizar:** `thehand` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

### EXPANSÃO DE DOMÍNIO — `domain`

Cria uma área temporária de cortes letais anunciados. Você continua lutando enquanto o adversário pode escapar dos cortes por movimentação.

- **Categoria / raridade:** power / legendary.
- **Acionamento / bind:** Ativo; bind configurável no TAB.
- **Recarga:** 18 s (ativa/arma).
- **Uso/reset:** Sem limite de usos por escopo; recarga ou condição descrita abaixo. cd/efeitos temporários limpam no novo duelo.
- **Consumo / acúmulo:** Não é removido do inventário ao acionar; usos/estados limitam disponibilidade. Sem duplicata/pilha do mesmo ID; aplica aquisição comum acima.
- **Modos/elegibilidade:** Duelo com Legados (PvE/local/online), Caminho, treino/ADMIN; fora de Parkour.
- **Mecânica, duração, entidades e limites:** effects.domain4 s; centro fixo/raio430. Pulsa após100 ms e depois600 ms: dois cortes radius65, aviso480/life650 ms; um procura alvo, outro aleatório. Letais evitáveis, sem morte automática; cd18 s.

**Localizar:** `domain` em [legacies.js](../work/v8/legacies.js), [legacy-combat.js](../work/v8/legacy-combat.js) e [v8-detail.js](../work/v8/v8-detail.js). Interações compartilhadas em [LEGACY_INTERACTIONS](LEGACY_INTERACTIONS.md).

