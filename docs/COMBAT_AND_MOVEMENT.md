# Combate e movimento

Fontes de leitura: `engine.js` (gerado por `upgrade-core.cjs`), `controls.js` (integrate), `legacy-combat.js`, `v8-detail.js`. Valores em segundos no motor salvo campos de regra explicitamente em ms; distâncias em unidades do mundo.

## Movimento padrão

| Regra | Implementação |
|---|---|
| Input | W e Espaço geram jump e jumpHeld; W também up. Dash suprime jump no mesmo input |
| Coyote / buffer | 85 ms após apoio / 90 ms para pulo |
| Salto inicial | vy = −940 × jump |
| Segundo salto | Uma carga aérea; vy = −875 × jump; limita vx à velocidade da classe, limpa fast fall |
| Restauração | Pouso restaura airJumps = 1; Bota Alada acrescenta um. Wall jump não recarrega isso |
| Variable jump | Soltar enquanto subindo a mais de 250 reduz vy para 48%; não reinicia a queda |
| Gravidade | 1980 × gravity; fast fall multiplica por 1,7 quando descendo |
| Wall slide | Segurar contra parede ao descer limita vy a 155 × gravity |
| Wall jump | Alto: vx para fora 280, vy −940×jump; afastamento: 470/−810×jump. Lock 100 ms, pose 230 ms |
| Drop-through | Baixo+pulo em plataforma não sólida: ignora por 220 ms; chão sólido permanece |

Controle horizontal responde ao input e usa fatores de estado/frenagem em `moveFighter`; não é movimento de velocidade constante durante stun/dash/técnicas. O sprite usa `SCALE=.9`; cápsula ereta tem centro 71,1, extremos 108,9/22,5 acima dos pés e raio 15,3. Slide interpola para centro 27, extremos 44/13 e raio 11. Corpo visual não deve redefinir essa cápsula.

Aceleração horizontal normal no chão: 9800 com direção e15000 para parar; no ar2600. GroundDashTail aplica3800 no chão/1100 no ar; recuperação de dash/slide3800. Durante ataque no chão a velocidade alvo é70% da classe; no ar permanece controle normal, salvo técnicas comprometidas. Stun/clash/push amortecem vx sem aceitar aceleração normal. Gelo modifica atrito pelo hook V8.

Dash dura 140 ms, recarga padrão 320 ms por carga, recovery 75 ms. Regras permitem até cinco cargas normais; recarga sequencial. No ar há ainda limite `airDashes` por saída do chão, restaurado ao pousar após terminar dash. No chão, direção horizontal prioriza movimento e inclinação usa mira (até 60° com movimento); inclinação para baixo vira horizontal. No ar, direção vem de move/up/down normalizados, sem cursor; sem direção usa facing. Baixo+dash no chão faz slide: impulso 280 ms e perfil baixo por 420 ms. Colisão com parede interrompe dash.

Dash não dá invulnerabilidade base. Ataque pode começar durante dash/slide e fixa sua própria mira sem redirecionar o deslocamento. W sozinho pula; W+dash no mesmo comando não gasta double jump. Apertar W antes e somente depois dash não desfaz um pulo que já foi executado.

## Ataques, colisões e comprometimento

`idle → startup → active → recovery → idle`. Tempos em CHARACTERS já incluem o baseline 1,25×; a regra attackSpeed divide startup, active e recovery. attackRecovery multiplica somente a recuperação. Armas Legado têm overrides próprios; não aplicar a normalização das classes duas vezes.

`slash(f,walls)` calcula o polígono ativo, transformado pela mira fixada em `attackAim` e recortado pelo cenário (`wallContour`). Contato é polígono contra cápsula corporal. A lança usa ponta, rapieira faixa estreita, foice arco com abertura interna, punho volume curto. A animação da arma não substitui esse polígono. O ataque armazena ID e flag `attackHit` para não acertar repetidamente.

Dois polígonos ativos que se cruzam provocam clash **antes** de avaliar mortes: estados de 160 ms, repulsão 170 e hitstop 55 ms. Investida do especial da lança não entra nesse clash. Se ambos acertarem corpos sem clash no mesmo passo, resolve TROCA. Chute base: startup 160 ms, active 100, recovery 270, cooldown 700; cápsula curta frontal, empurrão 570, sem dano direto.

## Parry, Perfect e finta

Parry fixa `guardFacing` pelo lado da mira ao iniciar. Janela padrão 400 ms, recuperação de erro 400 ms, cooldown inicial soma ambos. Um contato válido atordoa atacante por 490 ms padrão, volta defensor a idle e reduz seu cooldown restante (220 ms em melee; 180 ms em projéteis). Acertar pelas costas atravessa a guarda: cross-up é intencional. Setores alto/normal/baixo em `guardVisual` são apresentação da interceptação, não três defesas mecânicas.

Perfect: contato nos primeiros min(80 ms, duração do parry). O estado mecânico base usa a mesma punição; feedback é mais forte. Legados como Sino, Relógio e Desarmamento adicionam consequências próprias. Não aumentar janela de Perfect ao estender o impact frame visual.

Parry durante startup, ou nos primeiros 60 ms do active sem contato, executa **finta**: feintRecovery 150 ms e cooldown 450 ms. Não cria guarda. Passo de Esgrima/Varredura em execução bloqueiam finta. Buffers de ação guardam um comando perto do fim de recuperação (80 ms, TTL 85 ms); não são cancelamento livre. Dash Cancel/Backstep são exceções concedidas por Legados.

## Morte, fases e especiais

Um contato letal aprovado por `absorb` marca `dead`; não há subtração de HP. Hitstop fatal base 95 ms; roundPause 1,05 s (treino 0,6). Quedas têm janela de 150 ms para empate. VFX/slow motion/zoom e finalização são apresentação em módulos próprios; fases de rodada/partida controlam a liberação do jogo.

Especiais: ver tabela em CHARACTERS. Carga sete segundos, cresce enquanto playing sem efeito/penalidade ativa; começa vazia na partida e persiste entre duelos por padrão. Reset limpa efeitos, arma do especial e locks; preserva somente a carga quando configurado. Não confundir isso com reset de Legados (duel/match/run).

No Caminho, hostilidade separa jogador 0 de inimigos 1–3. Aliados inimigos não se matam. É preciso matar todos para pontuar; morte do Errante encerra o duelo. O Anel pode abortar a resolução antes de conceder ponto. Física, técnicas e poderes têm hooks; consultar LEGACY_INTERACTIONS antes de alterar a precedência.

Todas as regras, mínimos/máximos/passos/defaults e presets estão em [data/runtime.json](data/runtime.json), campos rules/defaults/presets. Turbo mantém speed1,6, attackSpeed1,4 e dashCooldown240 ms. Gravidade/pulo/velocidade padrão1; mapSize1 corresponde à base1,5 antiga; airDash, specials e persistSpecial são true. winningScore5; regras de tempo do dash/parry/stun usam milissegundos, specialCooldown usa segundos.
