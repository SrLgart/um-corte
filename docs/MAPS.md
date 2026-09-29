# Mapas e geometria

18 mapas registrados: dez arenas de duelo, cinco do Caminho e três pistas oficiais. [data/maps.json](data/maps.json) guarda todos os arrays completos de plataformas, paredes, spawns, decor, checkpoints e routes: source (autoria) e normal (makeMap, mapSize=1). Não confundir medidas de autoria com medidas jogadas.

Duelo/Caminho/custom duelo: escala efetiva1,5×mapSize. Parkour:1×mapSize. Personagens não escalam com arena. makeMap pode acrescentar apoios intermediários em mapas oficiais aumentados e wallTop; portanto contagens processadas diferem da autoria. Mapas customizados não recebem esses apoios automáticos.

## Arenas de duelo

### Dojo elevado (`dojo`)

Chão seguro, plataformas e pilares para saltar pelas paredes.

- Modo: duel. Autoria 1280×720; normal 1920×1080; deathY 1335.
- Plataformas: 3 autorais / 15 processadas; paredes: 4. 
- Spawns normais: `[{"x":577.5,"y":915},{"x":1342.5,"y":915}]`.
- Paredes normais: `[{"x":82.5,"y":420,"w":39,"h":495},{"x":1798.5,"y":420,"w":39,"h":495},{"x":285,"y":585,"w":39,"h":330},{"x":1596,"y":585,"w":39,"h":330}]`.
- Objetos autorais: `[]`.
- Plataformas/rotas completas: entrada `dojo` em [maps.json](data/maps.json).

### Ponte quebrada (`bridge`)

Distância, saltos e vãos fatais. Não recue sem olhar.

- Modo: duel. Autoria 1280×720; normal 1920×1080; deathY 1335.
- Plataformas: 3 autorais / 3 processadas; paredes: 0. 
- Spawns normais: `[{"x":435,"y":885},{"x":1485,"y":885}]`.
- Paredes normais: `[]`.
- Objetos autorais: `[]`.
- Plataformas/rotas completas: entrada `bridge` em [maps.json](data/maps.json).

### Ruínas (`ruins`)

Rotas aéreas, paredes e um vão no centro. Cuidado ao recuar.

- Modo: duel. Autoria 1280×720; normal 1920×1080; deathY 1335.
- Plataformas: 6 autorais / 21 processadas; paredes: 4. 
- Spawns normais: `[{"x":472.5,"y":930},{"x":1447.5,"y":930}]`.
- Paredes normais: `[{"x":97.5,"y":472.5,"w":42,"h":457.5},{"x":1780.5,"y":472.5,"w":42,"h":457.5},{"x":720,"y":750,"w":37.5,"h":180},{"x":1162.5,"y":750,"w":37.5,"h":180}]`.
- Objetos autorais: `[]`.
- Plataformas/rotas completas: entrada `ruins` em [maps.json](data/maps.json).

### Bosque da Lua (`bamboo`)

Bambu, lanternas e luar. Rotas laterais acima de um chão seguro.

- Modo: duel. Autoria 1280×720; normal 1920×1080; deathY 1335.
- Plataformas: 4 autorais / 6 processadas; paredes: 0. 
- Spawns normais: `[{"x":577.5,"y":922.5},{"x":1342.5,"y":922.5}]`.
- Paredes normais: `[]`.
- Objetos autorais: `[{"type":"bamboo","x":600,"y":480},{"type":"lantern","x":1090,"y":548}]`.
- Plataformas/rotas completas: entrada `bamboo` em [maps.json](data/maps.json).

### Fortaleza Nevada (`frost`)

Torres congeladas e um vão central. Avance pelos bastiões.

- Modo: duel. Autoria 1280×720; normal 1920×1080; deathY 1335.
- Plataformas: 5 autorais / 9 processadas; paredes: 0. 
- Spawns normais: `[{"x":450,"y":915},{"x":1470,"y":915}]`.
- Paredes normais: `[]`.
- Objetos autorais: `[]`.
- Plataformas/rotas completas: entrada `frost` em [maps.json](data/maps.json).

### Forja de Cinzas (`forge`)

Correntes sobre lava. Dispute a ilha e as passarelas centrais.

- Modo: duel. Autoria 1280×720; normal 1920×1080; deathY 1335.
- Plataformas: 5 autorais / 11 processadas; paredes: 0. 
- Spawns normais: `[{"x":352.5,"y":885},{"x":1567.5,"y":885}]`.
- Paredes normais: `[]`.
- Objetos autorais: `[]`.
- Plataformas/rotas completas: entrada `forge` em [maps.json](data/maps.json).

### Torre do Sino (`tower`)

Paredes, pilares e um elevador central. O terreno também se move.

- Modo: duel. Autoria 1280×720; normal 1920×1080; deathY 1335.
- Plataformas: 5 autorais / 23 processadas; paredes: 4. Tem móveis. 
- Spawns normais: `[{"x":705,"y":945},{"x":1215,"y":945}]`.
- Paredes normais: `[{"x":105,"y":247.5,"w":52.5,"h":697.5},{"x":1762.5,"y":247.5,"w":52.5,"h":697.5},{"x":510,"y":675,"w":45,"h":270},{"x":1365,"y":675,"w":45,"h":270}]`.
- Objetos autorais: `[{"type":"bell","x":640,"y":480}]`.
- Plataformas/rotas completas: entrada `tower` em [maps.json](data/maps.json).

### Santuário Suspenso (`sanctuary`)

Ruínas nas nuvens. O caminho central desaba; as rotas altas permanecem.

- Modo: duel. Autoria 1280×720; normal 1920×1080; deathY 1335.
- Plataformas: 8 autorais / 15 processadas; paredes: 0. Tem frágeis. 
- Spawns normais: `[{"x":262.5,"y":915},{"x":1657.5,"y":915}]`.
- Paredes normais: `[]`.
- Objetos autorais: `[]`.
- Plataformas/rotas completas: entrada `sanctuary` em [maps.json](data/maps.json).

### Pátio dos Sinos (`bells`)

Um sino ancestral entre passarelas e pilares. Cada golpe ecoa.

- Modo: duel. Autoria 1280×720; normal 1920×1080; deathY 1335.
- Plataformas: 4 autorais / 12 processadas; paredes: 2. 
- Spawns normais: `[{"x":510,"y":922.5},{"x":1410,"y":922.5}]`.
- Paredes normais: `[{"x":105,"y":375,"w":42,"h":547.5},{"x":1773,"y":375,"w":42,"h":547.5}]`.
- Objetos autorais: `[{"type":"bell","x":640,"y":467},{"type":"lantern","x":270,"y":335},{"type":"lantern","x":1010,"y":335},{"type":"vase","x":1150,"y":573}]`.
- Plataformas/rotas completas: entrada `bells` em [maps.json](data/maps.json).

### Telhados da Chuva (`rooftops`)

Telhas molhadas, lanternas e bandeiras sobre um vão fatal.

- Modo: duel. Autoria 1280×720; normal 1920×1080; deathY 1335.
- Plataformas: 5 autorais / 13 processadas; paredes: 2. 
- Spawns normais: `[{"x":420,"y":892.5},{"x":1500,"y":892.5}]`.
- Paredes normais: `[{"x":97.5,"y":637.5,"w":33,"h":255},{"x":1789.5,"y":637.5,"w":33,"h":255}]`.
- Objetos autorais: `[{"type":"lantern","x":400,"y":535},{"type":"lantern","x":870,"y":535},{"type":"flag","x":510,"y":365},{"type":"flag","x":1060,"y":270},{"type":"bamboo","x":165,"y":460}]`.
- Plataformas/rotas completas: entrada `rooftops` em [maps.json](data/maps.json).

## Caminho do Guerreiro

### Arena da Rua (`path_street`)

Cordas, lampiões e um círculo de espectadores. Todo caminho começa pequeno.

- Modo: path. Autoria 1280×720; normal 1920×1080; deathY 1380.
- Plataformas: 3 autorais / 9 processadas; paredes: 2. 
- Spawns normais: `[{"x":540,"y":915},{"x":1275,"y":915}]`.
- Paredes normais: `[{"x":0,"y":-10000000,"w":88.5,"h":10000915,"boundaryBottom":915,"pathBoundary":true},{"x":1831.5,"y":-10000000,"w":88.5,"h":10000915,"boundaryBottom":915,"pathBoundary":true}]`.
- Objetos autorais: `[{"type":"lantern","x":170,"y":345},{"type":"lantern","x":1060,"y":360}]`.
- Plataformas/rotas completas: entrada `path_street` em [maps.json](data/maps.json).

### Coliseu de Pedra (`path_coliseum`)

Areia dourada, arquibancadas e corredores elevados.

- Modo: path. Autoria 1560×800; normal 2340×1200; deathY 1500.
- Plataformas: 4 autorais / 13 processadas; paredes: 2. 
- Spawns normais: `[{"x":630,"y":1020},{"x":1650,"y":1020}]`.
- Paredes normais: `[{"x":0,"y":-10000000,"w":108,"h":10001020,"boundaryBottom":1020,"pathBoundary":true},{"x":2232,"y":-10000000,"w":108,"h":10001020,"boundaryBottom":1020,"pathBoundary":true}]`.
- Objetos autorais: `[{"type":"flag","x":120,"y":380},{"type":"flag","x":1400,"y":380}]`.
- Plataformas/rotas completas: entrada `path_coliseum` em [maps.json](data/maps.json).

### Pátio do Templo (`path_temple`)

Jardim seco, incenso e três caminhos entre os pilares.

- Modo: path. Autoria 1840×850; normal 2760×1275; deathY 1575.
- Plataformas: 5 autorais / 13 processadas; paredes: 2. 
- Spawns normais: `[{"x":705,"y":1102.5},{"x":2010,"y":1102.5}]`.
- Paredes normais: `[{"x":0,"y":-10000000,"w":180,"h":10001102.5,"boundaryBottom":1102.5,"pathBoundary":true},{"x":2580,"y":-10000000,"w":180,"h":10001102.5,"boundaryBottom":1102.5,"pathBoundary":true}]`.
- Objetos autorais: `[{"type":"bell","x":910,"y":220},{"type":"bamboo","x":130,"y":600},{"type":"lantern","x":1560,"y":460}]`.
- Plataformas/rotas completas: entrada `path_temple` em [maps.json](data/maps.json).

### Grande Arena Imperial (`path_imperial`)

Uma arena monumental. Plataformas largas e espaço para flanquear.

- Modo: path. Autoria 2160×920; normal 3240×1380; deathY 1680.
- Plataformas: 5 autorais / 15 processadas; paredes: 2. 
- Spawns normais: `[{"x":810,"y":1200},{"x":2310,"y":1200}]`.
- Paredes normais: `[{"x":0,"y":-10000000,"w":127.5,"h":10001200,"boundaryBottom":1200,"pathBoundary":true},{"x":3112.5,"y":-10000000,"w":127.5,"h":10001200,"boundaryBottom":1200,"pathBoundary":true}]`.
- Objetos autorais: `[{"type":"flag","x":225,"y":500},{"type":"flag","x":1810,"y":500},{"type":"vase","x":2020,"y":758}]`.
- Plataformas/rotas completas: entrada `path_imperial` em [maps.json](data/maps.json).

### Arena do Juízo (`path_judgment`)

O eclipse observa. Chão contínuo, rotas amplas, nenhum acaso no último corte.

- Modo: path. Autoria 2500×1000; normal 3750×1500; deathY 1800.
- Plataformas: 5 autorais / 15 processadas; paredes: 2. 
- Spawns normais: `[{"x":975,"y":1312.5},{"x":2760,"y":1312.5}]`.
- Paredes normais: `[{"x":0,"y":-10000000,"w":127.5,"h":10001312.5,"boundaryBottom":1312.5,"pathBoundary":true},{"x":3622.5,"y":-10000000,"w":127.5,"h":10001312.5,"boundaryBottom":1312.5,"pathBoundary":true}]`.
- Objetos autorais: `[]`.
- Plataformas/rotas completas: entrada `path_judgment` em [maps.json](data/maps.json).

## Parkour

### Caminho dos Ventos (`custom_race_wind`)

Ventos da costa. Passagens baixas, saltos e atalhos sobre os portais.

- Modo: parkour. Autoria 16400×1280; normal 16400×1280; deathY 1450.
- Plataformas: 32 autorais / 39 processadas; paredes: 7. 
- Spawns normais: `[{"x":160,"y":770},{"x":200,"y":770}]`.
- Paredes normais: `[{"x":550,"y":500,"w":180,"h":204},{"x":3600,"y":485,"w":190,"h":219},{"x":6090,"y":410,"w":190,"h":204},{"x":7250,"y":480,"w":220,"h":224},{"x":8980,"y":385,"w":180,"h":199},{"x":12070,"y":485,"w":190,"h":219},{"x":15000,"y":485,"w":160,"h":219}]`.
- Objetos autorais: `[]`.
- Plataformas/rotas completas: entrada `custom_race_wind` em [maps.json](data/maps.json).

### Escadaria do Céu (`custom_race_spire`)

Suba o pagode. Paredes, patamares e quedas com retorno rápido.

- Modo: parkour. Autoria 1900×8400; normal 1900×8400; deathY 8570.
- Plataformas: 60 autorais / 68 processadas; paredes: 8. 
- Spawns normais: `[{"x":250,"y":8050},{"x":290,"y":8050}]`.
- Paredes normais: `[{"x":225,"y":6485,"w":28,"h":915},{"x":1050,"y":6485,"w":28,"h":915},{"x":735,"y":4650,"w":28,"h":925},{"x":1560,"y":4650,"w":28,"h":925},{"x":315,"y":2780,"w":28,"h":960},{"x":1160,"y":2780,"w":28,"h":960},{"x":875,"y":910,"w":28,"h":960},{"x":1690,"y":910,"w":28,"h":960}]`.
- Objetos autorais: `[]`.
- Plataformas/rotas completas: entrada `custom_race_spire` em [maps.json](data/maps.json).

### Rota das Brasas (`custom_race_foundry`)

Uma travessia sobre brasas. Elevadores e caminhos de risco.

- Modo: parkour. Autoria 19400×2920; normal 19400×2920; deathY 3090.
- Plataformas: 50 autorais / 56 processadas; paredes: 6. Tem móveis. Tem frágeis. 
- Spawns normais: `[{"x":160,"y":1640},{"x":200,"y":1640}]`.
- Paredes normais: `[{"x":3060,"y":410,"w":30,"h":140},{"x":7600,"y":310,"w":30,"h":235},{"x":9600,"y":1210,"w":100,"h":234},{"x":10340,"y":660,"w":28,"h":160},{"x":14700,"y":1060,"w":28,"h":580},{"x":17260,"y":770,"w":170,"h":214}]`.
- Objetos autorais: `[]`.
- Plataformas/rotas completas: entrada `custom_race_foundry` em [maps.json](data/maps.json).

## Limites e editor

Aresta global comum limita x, mas não significa parede desenhada em toda arena. Somente paredes reais dão interação de wall jump/slide. Quedas usam deathY. Caminho usa sealPathMap: preserva faces internas, prolonga laterais até y=−10.000.000, retira antigos topos jogáveis e aplica clamp final inclusive a deslocamentos diretos/ADMIN. Não é possível pular para fora dessas laterais. Renderer recorta desenho à câmera, não itera dez milhões de unidades.

As cinco arenas do Caminho podem ter direção de arte e level design revistos futuramente. Preservar função: fechadas, legíveis, escala crescente, espaço de combate, poucos buracos e sem exigir parkour excessivo.

Custom: cleanMap exige format um-corte-map/version1. Duelo width640–3840/height360–2160, até80 plataformas/60 paredes. Parkour até24000 em cada dimensão, até300 plataformas/200 paredes. Dois spawns no schema; Race distribui participantes. Até40 objetos (bell, lantern, flag, bamboo, vase). Imagens PNG/JPEG/WebP em data URL, até duas camadas/900000 caracteres cada; parallax0..0,5, opacity0..1. Sem SVG ou URL remota arbitrária. Importador limita arquivo a2100000 bytes.

Corrida:1–40 checkpoints ordenados, routes2–100 pontos por segmento validados; apoios e conexões precisam ser seguros. Ranking usa checkpoint+progresso da rota; câmera segue corredor individual e split-screen local. Editar pista exige atualizar checkpoints/routes, não só dimensions.

Plataformas móveis calculam deslocamento por tempo/motion; fragile solid→cracking→gone→solid, com atraso/respawn e prevenção de reaparecer dentro do corpo. collapseSpeed/respawnSpeed multiplicam duração (valor maior demora mais), apesar do nome speed. Objetos decorativos recebem eventos de golpe e feedback, não viram obstáculos letais automaticamente.
