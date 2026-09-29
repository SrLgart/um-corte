# Multiplayer e espectadores

Fontes: `room.js`, `legacy-online.js`, `path-watch.js`, `v7-ui.js`, `network.js` (infraestrutura anterior ainda empacotada). A interface V8 usa a sala estendida; não deduzir protocolo atual só pelo network.js antigo.

## Transporte e sala

PeerJS incorporado ao HTML; conexão WebRTC entre browsers, sinalização via PeerJS. Prefixo de sala `umcorte-v8-`, VERSION=8, até oito membros. Host organiza sessão e ticks. Cliente tardio entra como espectador enquanto partida acontece. Duelo tem dois lutadores; Parkour até oito corredores; Caminho um dono mais sete espectadores. Não há servidor autoritativo dedicado, conta, autenticação de ADMIN nem migração de host.

Handshake/open/join tem timeout15 s. Pings a cada300 ms. Desconexão da sinalização não encerra necessariamente WebRTC já conectado. Rede pública/NAT/ambiente restritivo podem impedir conectar; testes com sinalização local não provam acesso universal.

## Simulação online

`DELAY=8` frames, aproximadamente133 ms a60 Hz. Host só produz tick quando tem inputs dos participantes para aquele frame. Pacote tick traz frame, inputs e ops; todos os jogadores aplicam a mesma ordem. Backlog limitado a150 ms e até seis ticks por chamada. Stall avisa após250 ms e aborta sessão após oito segundos; sala permanece aberta.

Input é saneado (move, aim e booleanos), ações Legado são IDs ativos, no máximo16 por lista. Não se transmite tecla física. Inputs locais são colocados em frame+DELAY. Snapshots a cada três frames ou fim; espectadores recebem estado/eventos. Clientes combatentes com frame correspondente e digest divergente são ressincronizados. Isso não é rollback de baixa latência nem previsão completa de cliente.

`validData` limita profundidade16, 40 mil nós, arrays800 e JSON menor que2,3 milhões de caracteres; rejeita números não finitos e chaves de prototype pollution. Há mensagens de configuração maiores por imagens do editor. Limites de payload fazem parte do protocolo e do orçamento de entidades/históricos.

## Legados online

`startLegacyDraft` só para legacyMode match/round e fora de Parkour. Host cria padrão de raridade compartilhado, mas opções dependem do inventário de cada lado. Oferta é enviada **somente ao dono**; não é broadcast para o rival. Choices só são reveladas ao completar. Prazo30 s; ao expirar usa carta selecionada/default. Gate suspende ticks e go até conclusão. Dois confirmando encerram antes.

Reroll/mark/peek/replace passam pelo host e validam session ID/draft ID/side. Orbe e D20 não podem ser aplicados duas vezes pela reconstrução da UI. Ao concluir, host adiciona itens, recria companions, captura âncora e envia snapshot. `networkSnapshot` remove bindings, inclusive das transformações/âncora; `restoreLocalBindings` reconcilia códigos de cada cliente. Binds não devem afetar hash da simulação.

Edição de inventário usa legacyEdit → ops de tick. Não-admin só edita escolhas permitidas do próprio slot; ADMIN pode intervir nos dois. Troca de arma normal respeita fase; ADMIN força fase de equipamento. Não deve ser confundido com trocar arma gratuitamente no meio de qualquer ataque.

## ADMIN

Perfil informa admin; host valida operações segundo esse sinal e serializa alterações recebidas. Privilégio não depende de ser anfitrião ou P1. Dois ADMIN podem operar: ordem do host determina última alteração aplicada. Pause/step/refill/regras/atores usam o protocolo, não congelamento só da UI de um lado.

**Limitação confirmada:** flag ADMIN é capacidade declarada pelo cliente, não credencial autenticada. Um cliente modificado pode se declarar ADMIN. Adequado ao escopo de amigos/desenvolvimento, não segurança competitiva. Não prometer que ocultar atalho impede acesso malicioso.

## Caminho transmitido

`DuelPathWatch` reutiliza sala/handshake, mas host só aceita join/ping/pong de convidados. Não aceita input, escolha de draft nem ADMIN remoto. Envia aproximadamente a cada80 ms, e em mudanças de tela: jogo visível e run sem random/gameSave/entryInventory; também remove legacyRoundStart. Espectador desenha fight/draft/inventário/intro/resultado, não simula a run. Watchdog de oito segundos avisa interrupção; run do dono continua.

## Matriz e riscos

Duelo/Parkour online e seus espectadores estão integrados. Caminho é solo com espectadores. Torneio continua PvE, sem torneio online. Replay assistido ao fim não transmite “tentativa alternativa” como novo resultado oficial. Abrir TAB online não concede pausa unilateral.

Riscos conhecidos: perda do host, latência imposta pelo input delay, conexões públicas não verificadas nesta etapa, payloads crescentes com muitas entidades e ausência de anti-cheat. Não há alegação de paridade sob todos os browsers/hardwares. Ver testes locais e limites em VALIDATION.
