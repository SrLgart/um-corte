# Bosses

Fonte: path.js/BOSSES, Run.makeEncounter e L.ai; apresentação em v8-ui.js e v8-visuals.js. Bosses obedecem morte em um golpe, salvo proteções explícitas de sua build. Não possuem barras de vida nem fases por HP. Builds usam os mesmos Legados documentados no catálogo.

**Lógica real:** a maioria é classe + build fixa + dificuldade + label de estilo. Somente patient tem ajuste específico de distância na IA V8; demais labels não implementam uma árvore exclusiva. Gêmeos é exceção estrutural: dois inimigos. Intros são vinhetas, não habilidades de combate. Não tratar texto narrativo como mecânica.

## O RONIN (`ronin`)

A Lâmina que Espera

- Níveis elegíveis: 10, 20.
- Classe base: knight (Cavaleiro).
- Build fixa: ESPADA (`sword`); SEM SAQUE (`nodraw`); PASSO PERFEITO (`perfectstep`).
- IA/style: `patient`; distância alvo95% do alcance.
- Intro: 3,2 s, pulável se visto; marca seen/introCompleted.
- Particularidade: Não há ramo exclusivo de combate identificado para este ID. A combinação de sua build define seus recursos e limitações.

## A ARANHA (`spider`)

Filha dos Telhados

- Níveis elegíveis: 10, 20.
- Classe base: assassin (Assassino).
- Build fixa: WEB SHOOTERS (`web`); BOTA ALADA (`wingboot`); KUNAI (`kunai`); GOLPE DESCENDENTE (`downstrike`).
- IA/style: `aerial`; usa controlador V8 genérico e ações disponíveis da build.
- Intro: 3,2 s, pulável se visto; marca seen/introCompleted.
- Particularidade: Não há ramo exclusivo de combate identificado para este ID. A combinação de sua build define seus recursos e limitações.

## O CARRASCO (`executioner`)

O Peso da Sentença

- Níveis elegíveis: 10, 20.
- Classe base: swordsman (Espadachim).
- Build fixa: MACHADO (`axe`); ARMADURA DE CRISTAL (`crystal`); PULSO CINÉTICO (`pulse`).
- IA/style: `heavy`; usa controlador V8 genérico e ações disponíveis da build.
- Intro: 3,2 s, pulável se visto; marca seen/introCompleted.
- Particularidade: Não há ramo exclusivo de combate identificado para este ID. A combinação de sua build define seus recursos e limitações.

## O ESPECTRO (`specter`)

Ninguém Está Ali

- Níveis elegíveis: 10, 20, 30.
- Classe base: assassin (Assassino).
- Build fixa: KUNAI (`kunai`); MANTO SOMBRIO (`shadowcloak`); CORPO DE NÉVOA (`mist`); BLINK (`blink`).
- IA/style: `flank`; usa controlador V8 genérico e ações disponíveis da build.
- Intro: 3,2 s, pulável se visto; marca seen/introCompleted.
- Particularidade: Não há ramo exclusivo de combate identificado para este ID. A combinação de sua build define seus recursos e limitações.

## O DOMADOR (`tamer`)

Senhor das Feras

- Níveis elegíveis: 20, 30.
- Classe base: lancer (Lanceiro).
- Build fixa: ARCO (`bow`); CÃO DE CAÇA (`hound`); FALCÃO DE GUERRA (`falcon`); MÍMICO (`mimic`).
- IA/style: `ranged`; usa controlador V8 genérico e ações disponíveis da build.
- Intro: 3,2 s, pulável se visto; marca seen/introCompleted.
- Particularidade: Não há ramo exclusivo de combate identificado para este ID. A combinação de sua build define seus recursos e limitações.

## O ARTÍFICE (`artificer`)

O Impossível é Ferramenta

- Níveis elegíveis: 20, 30, 40.
- Classe base: duelist (Duelista).
- Build fixa: BACAMARTE (`blunderbuss`); PORTAIS (`portals`); TELECINESE (`telekinesis`); MESTRE DAS ARMAS (`weaponmaster`).
- IA/style: `tools`; usa controlador V8 genérico e ações disponíveis da build.
- Intro: 3,2 s, pulável se visto; marca seen/introCompleted.
- Particularidade: Não há ramo exclusivo de combate identificado para este ID. A combinação de sua build define seus recursos e limitações.

## O VAMPIRO (`vampire`)

A Fome

- Níveis elegíveis: 20, 30.
- Classe base: boxer (Pugilista).
- Build fixa: SOCO-INGLÊS (`knuckles`); MÁSCARA DE PEDRA (`stonemask`); PASSO PERFEITO (`perfectstep`); IMPULSO (`impulse`).
- IA/style: `aggressive`; usa controlador V8 genérico e ações disponíveis da build.
- Intro: 3,2 s, pulável se visto; marca seen/introCompleted.
- Particularidade: Não há ramo exclusivo de combate identificado para este ID. A combinação de sua build define seus recursos e limitações.

## A BRUXA DA GRAVIDADE (`witch`)

Acima e Abaixo

- Níveis elegíveis: 30, 40.
- Classe base: reaper (Ceifador).
- Build fixa: MANTO DA GRAVIDADE (`gravitycloak`); POÇO GRAVITACIONAL (`well`); CRIOCINESE (`ice`); BOLA DE FOGO (`fireball`).
- IA/style: `aerial`; usa controlador V8 genérico e ações disponíveis da build.
- Intro: 3,2 s, pulável se visto; marca seen/introCompleted.
- Particularidade: Não há ramo exclusivo de combate identificado para este ID. A combinação de sua build define seus recursos e limitações.

## O SENHOR DA LEGIÃO (`legionlord`)

Muitos em Um

- Níveis elegíveis: 30, 40.
- Classe base: knight (Cavaleiro).
- Build fixa: ESPADA (`sword`); LEGIÃO (`legion`); BARREIRA ARCANA (`barrier`); CONTRA-ATAQUE (`counter`).
- IA/style: `patient`; distância alvo95% do alcance.
- Intro: 3,2 s, pulável se visto; marca seen/introCompleted.
- Particularidade: Não há ramo exclusivo de combate identificado para este ID. A combinação de sua build define seus recursos e limitações.

## OS GÊMEOS (`twins`)

Dois Cortes

- Níveis elegíveis: 30, 40.
- Classe base: knight (Cavaleiro).
- Build fixa: GUNBLADE (`gunblade`); PASSO DE RECUO (`backstep`).
- IA/style: `twins`; usa controlador V8 genérico e ações disponíveis da build.
- Intro: 3,2 s, pulável se visto; marca seen/introCompleted.
- Particularidade: Segundo ator assassin com yoyo + well, estilo ranged; ambos precisam morrer para conceder ponto. Sem dano entre aliados.

## O HOMEM DO TEMPO (`timekeeper`)

Um Segundo Basta

- Níveis elegíveis: 40.
- Classe base: knight (Cavaleiro).
- Build fixa: ESPADA (`sword`); SANDEVISTAN (`sandevistan`); OLHO DO DESTINO (`destinyeye`); SEM SAQUE (`nodraw`).
- IA/style: `patient`; distância alvo95% do alcance.
- Intro: 3,2 s, pulável se visto; marca seen/introCompleted.
- Particularidade: Não há ramo exclusivo de combate identificado para este ID. A combinação de sua build define seus recursos e limitações.

## O PRIMEIRO ERRANTE (`first`)

O caminho termina onde o dele terminou.

- Níveis elegíveis: 50.
- Classe base: knight (Cavaleiro).
- Build fixa: LÂMINA DO ECO (`echo`); MANTO DO ESPELHO (`mirrorcloak`); PASSO PERFEITO (`perfectstep`); MESTRE DAS ARMAS (`weaponmaster`); DOPPELGÄNGER (`doppel`); ROOM (`room`).
- IA/style: `master`; usa controlador V8 genérico e ações disponíveis da build.
- Intro: 7 s, pulável se visto; marca seen/introCompleted.
- Particularidade: Fixo no nível50; vencer conclui run sem novo draft. Eco/Doppel/ROOM vêm dos módulos compartilhados, não versões secretas exclusivas.

## Seleção e representação

Run.rollBosses evita ID repetido nos níveis10–40 e prefere opções fora de lastBosses. Nível50 é fixo. Todos usam confronto de points duelos para vencer. A arte de intro e os títulos são próprios, mas atores reaproveitam classes/camadas de equipamentos. Visual pode ser refeito sem trocar a build ou a condição de vitória.
