const fs=require('fs'),path=require('path'),file=path.join(__dirname,'../../outputs/LEIA-ME-V43.md');let s=fs.readFileSync(path.join(__dirname,'../../outputs/LEIA-ME-V42.md'),'utf8');s=s.replaceAll('V42','V43').replaceAll('V4.2','V4.3').replace('— Sua arena, seu estilo','— Ajustes, balanceamento e QoL').replace('Os arquivos da V4 foram preservados.','Os arquivos da V4.2 foram preservados.');
s=s.replace('## Novidades',`## Novidades da V4.3

- Especiais ligados por padrão, recarga padrão de **7 segundos**. Desative em Personalizar partida se preferir.
- Cavaleiro e Espadachim: a penalidade após o especial passa a **4 segundos sem parry**. Os demais efeitos permanecem iguais.
- **Pontos para vencer**: padrão 5, atalhos 3 / 5 / 7 / 10 e campo para um inteiro positivo personalizado. O HUD acompanha a escolha.
- **Manter carga do especial entre rounds**: desligado por padrão. Ligado, preserva a carga dos dois jogadores, inclusive de quem perdeu. A pausa após o ponto não gera carga extra. Efeitos e penalidades terminam; um especial usado não é reembolsado. Toda partida nova, incluindo revanche, começa vazia.
- A descrição dos especiais começa automaticamente em **10 segundos**. No online, ambos confirmando antes iniciam imediatamente; ao esgotar o prazo, as duas telas são fechadas automaticamente. Desconexão encerra a espera com uma mensagem.
- ADMIN funciona como anfitrião ou convidado. Dois administradores podem usar o painel; os comandos são ordenados e aplicados no mesmo quadro. A última mudança nessa ordem prevalece.
- Log de atualizações inclui a V4.3.

## Presets de combate

| Preset | Valores |
|---|---|
| CLÁSSICO | Regras padrão de combate da V4.3 |
| TURBO | Movimento 1,6×; ataque 1,4×; recarga de dash de 600 ms (25% menor) |
| BAIXA GRAVIDADE | Gravidade 0,65×; força do pulo 1,1× |
| SEM PIEDADE | Parry de 180 ms; recuperação de parry de 500 ms; recuperação de ataque 1,2× |
| PERSONALIZADO | Mantém todos os valores atuais para ajuste manual |

Os presets alteram movimento, salto, gravidade, ataque, dash, parry e atordoamento. Preservam arena, tamanho e plataformas do mapa, personagens, cores, skins, pontos e todas as opções de especiais. Alterar um parâmetro de combate para fora dos valores de um preset identifica as regras como PERSONALIZADO.

**Recuperação dos ataques** é um novo multiplicador separado: afeta somente a recuperação, preservando a preparação e a parte ativa. Os ajustes continuam proporcionais às características de cada classe.

## Recursos mantidos da V4.2`);
s=s.replace('Histórico dentro do jogo atualizado com a V4.3.','Histórico completo dentro do jogo.').replace('A recarga padrão continua em 15 s, vazia a cada rodada,','A recarga padrão é de 7 s, vazia a cada rodada a menos que a persistência esteja ligada,').replace('As salas V4.3 são separadas da V4.','As salas V4.3 são separadas das versões anteriores.');
s=s.replace('## Novas opções no admin','## ADMIN').replace('Além dos ajustes anteriores, agora há:','Funciona na edição ADMIN independentemente de criar ou entrar na sala. A edição comum recebe as mudanças sincronizadas, mas não tem o painel. Também estão disponíveis:').replace('- Pugilista e skins dos dois jogadores.','- Pontos para vencer, persistência da carga e multiplicador separado de recuperação dos ataques.\n- Pugilista e skins dos dois jogadores.');
s=s.replace('No online, a administração continua exclusiva do anfitrião em uma **sala de testes com administração**, anunciada antes da confirmação do adversário. Mapas, skins e regras alterados são sincronizados nos dois jogos.','O lobby identifica quem usa a edição ADMIN. Não é mais necessário marcar sala de testes. As ações de ambos os administradores passam por uma sequência compartilhada: mapa, skins, regras, pausa, avanço de quadro e recarga permanecem sincronizados. Um aviso discreto indica qual jogador aplicou o comando. O privilégio pertence ao arquivo ADMIN; guarde essa edição para quem deve utilizá-la.');
s=s.slice(0,s.indexOf('## Testes da entrega'))+`## Verificação da V4.3

- 42 verificações de combate e especiais, atualizadas para os novos padrões.
- Nove grupos específicos: presets preservando regras fora do combate, recuperação separada, pontuação personalizada, empate, persistência exata, consumo dos especiais e restauração determinística de estado.
- Navegador: presets, ajustes manuais, HUD, início automático após 10 segundos, confirmação antecipada, histórico e novas opções ADMIN.
- Resultados dos testes online e demais verificações desta entrega ficam em work/v43/.

Fontes e scripts: work/v43/. Build: node work/v43/build.cjs. O build gera as duas edições autônomas em outputs/.
`;fs.writeFileSync(file,s);
