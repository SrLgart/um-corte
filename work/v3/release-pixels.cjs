const fs=require('node:fs'),path=require('node:path');const root=path.resolve(__dirname,'../..');
let s=fs.readFileSync(path.join(__dirname,'engine.js'),'utf8');s=s.replace("for(const f of this.fighters)if(f.dead)f.deathTime+=dt;this.roundTimer-=dt;","for(const f of this.fighters){if(f.dead)f.deathTime+=dt;else{this.tickState(f,dt);f.vx*=Math.exp(-12*dt);f.move=0;}}this.roundTimer-=dt;");fs.writeFileSync(path.join(__dirname,'engine.js'),s);
s=fs.readFileSync(path.join(root,'outputs/LEIA-ME-V3.md'),'utf8').replaceAll('V3.1','V3.2').replace('Novas fronteiras','Corpo em movimento');
s=s.replace(/A V3\.2 adiciona[^\n]+/, 'A V3.2 adapta os cinco personagens da referência para um visual em pixel art com articulações, roupas e cabelo reagindo ao movimento. Acrescenta ataque durante o dash, personagens/armas/colisões em 90% da escala anterior, velocidade de ataque e tamanho das arenas configuráveis. O slash visível é a área real de acerto. Os seis mapas, os três modos, as cores, o remapeamento e o parry prolongado continuam disponíveis.');
s=s.replace('O ataque trava a direção quando começa.', 'É possível iniciar um ataque durante o dash: o dash mantém a direção e o tempo restantes; o ataque segue a mira escolhida, inclusive para trás. Preparação, parte ativa e recuperação continuam valendo, então um golpe lento pode terminar depois do avanço.\n\nO ataque trava a direção quando começa.');
s=s.replace('A direção de chegada da lâmina precisa encontrar a defesa certa.','A direção de chegada do corte precisa encontrar a defesa certa.');
s=s.replace('Lança longa; só a ponta causa dano. Vulnerável quando o adversário entra perto.','Estocada longa e estreita. A área de acerto começa perto da ponta; o cabo não causa dano.');
s=s.replace('Foice de arco amplo; apenas a lâmina curva é letal, com espaço seguro dentro do arco.','Slash curvo de longo alcance, com espaço seguro dentro do arco.');
s=s.replace('Não existe HP,','Espada e espada longa desenham arcos; a adaga usa um corte curto; lança e foice mantêm formatos e zonas de alcance próprios. A mesma forma desenhada do slash participa das colisões com corpos, parries e outros slashes. O modelo da arma, o cabo e rastros decorativos não causam dano.\n\nNão existe HP,');
s=s.replace('**Personalizar partida** ajusta gravidade,','**Velocidade de ataque:** Lenta (0,5×), Normal (1×), Rápida (1,5×) e Super rápida (2×). O multiplicador divide a preparação, a parte ativa e a recuperação de cada classe por esse valor. Em 2×, cada fase dura metade do tempo original daquela classe. A opção vale igualmente para os jogadores e para a IA.\n\n**Tamanho da arena:** Pequeno (0,5×), Normal (1×), Grande (1,5×) e Gigante (2×). Escala largura, altura, plataformas, posições iniciais e limite de queda. O tamanho dos personagens e suas velocidades não mudam com essa opção. Arenas maiores recebem apoios intermediários para manter rotas acessíveis ao salto padrão. A câmera acompanha o espaço entre os jogadores e a IA busca caminhos pelas plataformas.\n\n**Personalizar partida** também ajusta gravidade,');
const start=s.indexOf('## Verificação desta versão');s=s.slice(0,start)+`## Animações e verificação

O corpo usa pernas e braços articulados, transferência de peso e poses direcionais. Há respiração, corrida, recuo, desaceleração, subida/ápice/queda do salto, compressão na aterrissagem, dash com inclinação e pós-imagens, preparação/corte/recuperação, três guardas, reação ao clash, atordoamento e queda de derrota. Capas, echarpes, abas e rabo de cavalo acompanham o movimento. A mira e os cortes funcionam em 360 graus. Os retratos selecionados também respiram no menu.

- 60 verificações de combate, direções, tamanho, regras, dash/ataque e determinismo.
- 24 cenários de navegação da IA: seis mapas em quatro tamanhos, alcançando e atacando um adversário parado.
- 234 simulações com classes, mapas, dificuldades e regras variadas. Incluem tentativas decididas por queda.
- Chrome: quatro tamanhos, enquadramento dos personagens, controles de personalização, combinação dash/ataque e menu em tela pequena.
- Animações: cinco personagens, 14 movimentos e 30 amostras de direção/fase por movimento, sem coordenadas inválidas; 60 quadros diferentes em 60 amostras consecutivas de corrida.
- Local: teclado/mouse e controle padrão simulado pela Gamepad API, incluindo remapeamento, conflitos, persistência, desconexão e reconexão. Um controle físico ainda não foi validado neste computador.
- Online: dois contextos independentes do Chrome, arena 1,5×, ataques 1,5×, parry de 600 ms, cores exclusivas, partida até 5, revanche confirmada pelos dois e desconexão. Ainda falta teste entre dois computadores em redes diferentes.

O vídeo **um-corte-v3-animacoes.webm** mostra as animações do renderizador em uma demonstração; não é uma gravação de partida.

A V1 e a V2 foram preservadas. Uma cópia da V3.1 está em work/v3/archive-before-pixels.
`;fs.writeFileSync(path.join(root,'outputs/LEIA-ME-V3.md'),s);
