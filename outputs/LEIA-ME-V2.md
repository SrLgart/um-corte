# UM CORTE — V2

Abra **um-corte-v2.html** no Chrome, Edge ou Firefox em um computador. O arquivo já inclui o jogo, personagens e biblioteca de conexão. Não é necessário instalar um programa ou iniciar um servidor.

A V1 continua preservada em `um-corte.html`.

## Escolha seu modo

- **PvE:** escolha seu personagem, o adversário e a dificuldade.
- **Local:** duas pessoas no mesmo computador, com controles separados no teclado.
- **Online:** duas pessoas, cada uma em seu computador, conectadas por um código de sala.

### Jogar online com um amigo

1. Envie o mesmo arquivo **um-corte-v2.html** ao seu amigo. Cada um abre o arquivo no próprio navegador, com internet.
2. Os dois escolhem **Online** e seu personagem.
3. Um jogador seleciona **Criar sala** e envia o código de seis caracteres ao outro.
4. O outro digita o código e seleciona **Entrar**. O duelo começa com uma contagem curta.
5. Depois da partida, ambos precisam confirmar **Revanche** para jogar novamente.

O código funciona pela internet; os computadores não precisam estar na mesma rede. Mantenham as duas abas visíveis durante a partida. Abrir o painel de controles não pausa o online. Sair para o menu encerra a conexão.

O endereço `127.0.0.1` usado na prévia é apenas deste computador: para um amigo, compartilhe o arquivo HTML e o código de sala.

O online usa o serviço público de sinalização do PeerJS e uma conexão WebRTC direta entre os jogadores. Não exige câmera ou microfone. Redes corporativas, VPNs ou roteadores com bloqueios podem impedir a conexão; nesse caso, tente outra rede. Esta versão não inclui um servidor TURN próprio para retransmitir conexões bloqueadas. Local e PvE funcionam sem internet.

## Personagens

| Personagem | Arma e vantagem | Risco |
|---|---|---|
| Cavaleiro | Espada equilibrada; alcance e ritmo intermediários | Não domina os extremos de distância |
| Lanceiro | Longo alcance com a ponta da lança | Haste não mata; distância muito curta e recuperação longa são vulneráveis |
| Assassino | Adaga, caminhada e dash mais ágeis, preparação curta | Precisa atravessar o alcance adversário |

**Todos morrem com um único golpe limpo.** Armadura não absorve dano; dash não dá invencibilidade; nenhuma classe tem vida oculta. A seleção dos jogadores é independente, incluindo duelos entre personagens iguais.

## Dificuldades do PvE

| Nível | Comportamento |
|---|---|
| Fácil | Reação lenta, hesitação e mais oportunidades de punição |
| Normal | Reação humana variável, parry, recuo e punições |
| Adaptativo | Observa ataques, tentativas de parry, golpes errados e recuos; muda escolhas durante a partida |
| Impossível | Reações sobre-humanas e leitura precisa de contato iminente; mantém as mesmas armas e vulnerabilidades |

O aprendizado do adaptativo é reiniciado a cada nova partida. A dificuldade não altera dano, alcance, velocidade ou cooldown das armas.

## Controles

### PvE e online

| Ação | Tecla ou botão |
|---|---|
| Mover | A / D ou setas esquerda / direita |
| Atacar | J ou clique esquerdo |
| Parry | K ou clique direito |
| Dash | Shift + direção; sem direção, avança |
| Controles / pausa offline | Esc ou botão ? |
| Som | M ou botão SOM |

### Local

| Ação | Jogador 1 | Jogador 2 |
|---|---|---|
| Mover | A / D | ← / → |
| Atacar | F | J |
| Parry | G | K |
| Dash | H | L |

As ações respondem a cada pressionamento, sem repetição automática ao segurar a tecla. Primeiro a cinco pontos vence. Cada morte produz uma pausa curta antes da próxima tentativa.

## Estado do protótipo

- 21 testes do núcleo de combate passaram: classes, nove combinações de armas, morte em um golpe, parry, clash, vulnerabilidade do dash, inputs locais, placar, aprendizado e física igual entre dificuldades.
- Interface testada no Chrome: seleção de classes e dificuldades, PvE, controles locais independentes, pausa, formulário online e telas menores.
- Online testado com sinalização pública e WebRTC real entre contextos separados do Chrome: partida completa até cinco pontos, placares sincronizados, revanche, desconexão e bloqueio de terceiro jogador.
- Ainda não houve teste humano em dois PCs/redes distintos. Firefox e Edge não foram usados na validação desta versão.
- Balanceamento inicial. Em 40 simulações de primeira rodada contra um bot que aproxima e ataca, a IA venceu 2 no Fácil, 21 no Normal, 20 no Adaptativo sem histórico e 40 no Impossível. Esses números distinguem as políticas; não estimam a dificuldade para jogadores humanos.

### Como o online mantém os resultados consistentes

Os dois computadores simulam os mesmos comandos, em etapas sincronizadas, com aproximadamente 100 ms de antecedência para absorver variação da rede. Ao faltar um comando, a simulação espera; não inventa um acerto local. O jogo compara estados periodicamente e encerra uma partida que perder a sincronização. Uma conexão lenta pode causar espera visível. Esta versão para duelos entre amigos não possui servidor competitivo nem sistema antitrapaça.

PeerJS 1.5.5 é distribuído sob licença MIT, incluída no HTML.
