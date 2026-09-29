# Limitações e pendências conhecidas

Esta lista separa código observado, feedback do usuário e cobertura ainda necessária. Não é uma lista de bugs hipotéticos. Resultado de testes desta entrega em VALIDATION.

## Técnico

- Não existe Git nesta pasta. Checkpoint é archive com hashes e ZIP; histórico Git não foi fabricado.
- Engine/app e vários arquivos são gerados por substituições ancoradas sobre V7.2. Editá-los diretamente pode perder mudança na regeneração. Fonte/gerador estão mapeados em ARCHITECTURE.
- Formatos herdados usam version72 para snapshots enquanto release é8. Alterar número isoladamente quebra loaders.
- Run.restore valida parte do schema, não todos os campos profundamente. Não tratar save arbitrário como formato autenticado.
- Testes de browser antigos têm caminhos absolutos de Playwright/Chrome e alguns nomes de versões anteriores. Verificar URL/release dentro de cada arquivo antes de contar cobertura.

## Gameplay

- Proteções explícitas impedem evento fatal; isso é regra real da V8, não HP escondido. Texto original de “qualquer golpe” precisa ser lido com essas exceções.
- Sandevistan não desacelera literalmente plataformas/cenário; Corpo de Névoa protege eventos letais além de físicos; ROOM possui aviso antes da troca. Divergências marcadas nas fichas.
- Companions atuais não têm flag portalCompatible; portais não transportam indiscriminadamente todas as invocações.
- Parry alto/baixo do histórico não é o sistema atual: guarda é lateral, alturas são visuais. Não restaurar o design antigo por interpretar conversa velha como fonte executável.
- ADMIN base bodyScale/attackScale/invincible/fly normaliza dois slots, embora Caminho possa ter quatro fighters. Legacy Lab e controles de Parkour têm escopos próprios.

## IA

- Labels de boss, exceto patient no espaçamento, não representam controladores exclusivos completos. Classe/build/dificuldade explicam a maior parte da diferença.
- Navegação é heurística; não garante resolver toda geometria customizada ou regra ADMIN extrema.
- Teste de cinquenta níveis com vitórias forçadas prova progressão/saves/recompensas, não dificuldade humana, tempo natural de run ou ausência de estratégia dominante.

## Networking

- ADMIN é flag declarada por cliente. Não existe autenticação/anti-cheat de produção.
- Host é coordenador sem migração; saída dele encerra a conexão/sessão dos demais.
- Input delay8 frames e espera por todos afetam responsividade sob latência. Não há rollback competitivo.
- Caminho não é coop; convidados só assistem. Torneio online não está implementado.
- Testes locais/RTC fixture não equivalem a teste em redes públicas/NATs diferentes.

## Performance

- Snapshots incluem entidades/históricos. Há limites de payload e otimizações (remoção de imagens/âncora na transmissão), mas não garantia para combinação irrestrita de todos os itens e valores ADMIN enormes.
- Tempos de teste headless não são medição de FPS da máquina do jogador. Sem benchmark universal de GPU/memória.
- WebGL/bloom pode usar fallback; qualidade Ultra não garante shader disponível em todo navegador.

## Visual / apresentação

Feedback do usuário: slash, profundidade/parallax, plateia da Rua, paredes laterais, roupas rígidas, summons simples, ROOM e poderes com pouca presença. Referências e critérios estão em VISUAL_HANDOFF. Nenhum desses pontos foi redesenhado nesta etapa; não afirmar que todos foram reproduzidos como defeitos técnicos.

## Necessita teste manual

Rede pública em dois PCs, controle físico, escuta humana de áudio/balanceamento, quota/permissões reais de pastas, longa sessão em hardware do jogador e comparação artística solicitada. Testes automatizados não substituem esses itens. V8.5 permanece fora deste trabalho.
