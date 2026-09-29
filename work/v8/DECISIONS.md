# V8 — decisões aprovadas

Especificação integral: SPEC-V8.txt. A V7.2 permanece em ../v72 e outputs/um-corte-v7.2*.html.

- Caminho 100% solo, 50 níveis. Cada nível é partida primeiro a 3 por padrão; pontos configuráveis antes da run. Perder partida encerra run, perder um duelo não. Em grupo é preciso matar todos para pontuar. Todos voltam no duelo seguinte.
- Amigos podem assistir via sala PeerJS, inclusive entrando durante run: combate, intros, drafts, inventário e resultado. Sem comandos de combate/ADMIN; dono continua pausando e escolhendo sem prazo. Desconexão do espectador não interrompe run. Save só do dono; sala nova ao continuar.
- Classe mantém especial e movimento; arma determina ataque. Especial dependente de arma materializa temporariamente arma original. Errante sem especial.
- Habilidades com mesmo gesto: uma escolhida no TAB, outras por teclas próprias. Passivos compatíveis coexistem.
- Segunda chance: Olho antes do impacto, Cristal bloqueia, Berserker adia, Anel reinicia se morrer. Consumos por partida/run não são restituídos pelo Anel.
- Macaquinho carrega arma roubada, não equipa para dono. Golpe no macaco solta arma. Armas voltam ao dono no próximo duelo; inventário não é roubado.
- Parada do tempo: aviso, no máximo 1 segundo, uma vez por duelo; usuário e ataques próprios funcionam. Slowdowns não multiplicam; mais forte prevalece.
- PvP: mesmo padrão base de raridades. Vantagens de draft de Legados pertencem só ao dono. Draft online 30s, auto-confirma destaque; Caminho sem prazo.
- Gunblade trigger dá pequena extensão defensável, não mais dano.
- ROOM troca inimigo com telegraph/cooldown/destinos válidos; nunca coloca alvo dentro de parede/hazard.
- Save local invalida continuação normal após derrota; não promete impedir manipulação externa dos dados.

Não declarar V8 concluída com catálogo/UI apenas. Mecânicas, integração e testes reais são requisitos.
