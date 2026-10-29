# Pokédex de Cartas

Buscador de cartas para el juego de mesa, con diseño pensado para el móvil
(filtros a pantalla completa, rejilla táctil, ficha con deslizamiento, zoom).

## Estructura

```
index.html          La página
style.css           Estilos
app.js              Buscador, filtros y fichas
data/cards.csv      Se genera desde tu Excel (tools/excel_a_csv.py)
data/efectos.csv    Diccionario de efectos de ataque (editable a mano)
data/extras.csv     Variantes y cartas que no están en el Excel (se edita a mano)
data/cards.js       Se genera desde los CSV (no tocar)
cards/              Aquí van las imágenes de tus cartas
tools/excel_a_csv.py    Excel -> cards.csv y efectos.csv
tools/extraer_iconos.py Iconos de efectos y de tipos del Excel -> assets/
assets/                 Iconos (efectos y tipos)
tools/csv_a_cartas.py   CSV -> cards.js
```

## Actualizar desde tu Excel

```
pip install openpyxl                      # solo la primera vez
python3 tools/excel_a_csv.py PKMTUE.xlsx  # lee las hojas "Pokemon Gen ..." y crea data/cards.csv
python3 tools/csv_a_cartas.py             # crea data/cards.js
```
Toma del Excel: nombre, tipos, color, evolución, megaevolución, Surf / Teletransporte / Vuelo,
y para la ficha: habilidad (con su descripción), captura y ataques. La generación y la región
se deducen del número de Pokédex. Una hoja nueva (p. ej. «Pokemon Gen II») se procesa sola.
Las variantes van en `data/extras.csv`, que el script nunca sobrescribe.

## La ficha de cada carta

- **Flechas** `‹ ›` a los lados de la carta (y arriba), o deslizar el dedo: pasan al Pokémon siguiente o anterior *según la búsqueda y los filtros activos*.
- **Habilidad**: nombre y descripción.
- **Ataques**: nombre, tipo, dado, potencia y los iconos de efecto. Tocar un icono abre una ventana con qué hace, a quién afecta y cuándo se activa (número rojo = tirada de efecto mínima).
- **Fortalezas y debilidades**: dos desplegables con el tipo, el multiplicador y el modificador (débil ×2 = +2, ×4 = +4; fuerte ×½ = −2, ×¼ = −4; inmune). Se calculan solas a partir de los tipos del Pokémon.
- El buscador también encuentra por nombre de habilidad o de ataque (`espesura`, `ascuas`).

### Efectos de ataque (data/efectos.csv)

Cada código que aparece en el Excel («Quemado 6», «N-D6 +5»…) tiene una fila con su nombre, a quién afecta
(`usuario` / `rival`), la tirada mínima (`umbral`), la descripción y el icono. Las filas con `confirmado = no`
son interpretaciones provisionales: corrígelas ahí y pon `si`. El script del Excel **solo añade códigos nuevos**,
nunca pisa lo que hayas editado. Para añadir iconos nuevos, ponlos en `assets/efectos/` con el nombre
`usuario_<nombre>.png` o `rival_<nombre>.png`.

### Ataques y habilidad en las variantes (data/extras.csv)

Rellena `ability`, `abilityDesc`, `captura` y `move1`..`move3` con el formato
`Nombre|tipo|dado|potencia|efecto1|efecto2`, por ejemplo `Ascuas|fire|D6|2|Quemado 6`.

## Añadir tus cartas

1. Guarda la imagen de cada carta en `cards/` con el número de Pokédex como nombre:
   `cards/025.webp` (también vale `.png`, `.jpg` o `.jpeg`).
   Si una carta tiene otro nombre de archivo, ponlo en la columna `image` del CSV.
2. Añade o edita una fila en `data/extras.csv` (o en el Excel). Las listas van separadas por `;`
   (por ejemplo `types` = `grass;poison`). Las evoluciones se indican con `evolvesTo`
   y la web calcula sola las etapas, las líneas evolutivas y las evoluciones ramificadas.
3. Ejecuta `python3 tools/csv_a_cartas.py` para regenerar `data/cards.js`.

Mientras una carta no tenga imagen, se muestra un marcador con su nombre y número.

### Variantes (cada una es una carta propia)

Una variante es otra carta del mismo Pokémon: Pikachu de Ash, Growlithe de Hisui,
Meowth de Alola, Meowth del Team Rocket... Se identifica añadiendo un sufijo al id:

| id | name | imagen |
|---|---|---|
| `025` | Pikachu | `cards/025.png` |
| `025_ash` | Pikachu de Ash | `cards/025_ash.png` |
| `058_hisui` | Growlithe de Hisui | `cards/058_hisui.webp` |
| `052_rocket` | Meowth del Team Rocket | `cards/052_rocket.png` |

- Cada variante tiene sus propios tipos, regiones y etiquetas (por ejemplo `props` = `starter`).
- Para que una variante evolucione a otra variante, usa su id completo en `evolvesTo`
  (`058_hisui` → `059_hisui`).
- Una variante **sin** `evolvesTo` propio hereda la línea de su carta base
  (Pikachu de Ash cuenta como Pikachu: etapa, "puede evolucionar", etc.).
- Todas llevan automáticamente la etiqueta `variant` (filtro «Variante»).
- Buscar `025` muestra la base y todas sus variantes; `025_ash` solo esa carta;
  `meowth` muestra todas las versiones de Meowth y su línea.
- En la ficha aparece una sección «Otras versiones» para saltar entre ellas.
- Puedes mezclar `.png`, `.webp` y `.jpg` libremente.

### Imágenes alternativas de una misma carta (opcional)

Para reversos o versiones brillantes de la MISMA carta, usa la columna `forms`:
`Reverso:025_back.png;Brillante:025_shiny.png`. En la ficha salen como botones.

## Consejos para que vaya fluida en el móvil

- Exporta las cartas en **WebP** (unos 400–600 px de ancho bastan para la rejilla).
- Con cientos de cartas, la web carga las imágenes poco a poco según haces scroll.

## Publicarla (gratis)

Subid la carpeta a un repositorio de GitHub y activad **Settings → Pages**
(rama `main`, carpeta raíz). Quedará en `https://TU-USUARIO.github.io/NOMBRE-REPO/`.
También funciona abriendo `index.html` directamente en el navegador del ordenador.

## Búsqueda

| Escribes | Significa |
|---|---|
| `agua gen1` | Y (secciones distintas) |
| `agua/tierra` | O |
| `agua+tierra` | Y dentro del mismo término (doble tipo) |
| `-fuego` | excluir |
| `025` | por número de Pokédex |
| `eevee` | muestra toda su línea evolutiva |

Los botones de filtro: toca = activar, mantén pulsado = excluir. Los tipos se pueden
escribir en español (`agua`, `fuego`, `planta`…).

## Mi Equipo y Combate (novedades)

- **Mi Equipo** (pestaña inferior): equipo de 6, PC, niveles (nivel base de la carta + los que ganes), aviso y cinemática de evolución. Se guarda en el propio móvil, así que equipo y PC son individuales de cada jugador. Si borras los datos del navegador se pierde.
- **Combate** (dentro de Mi Equipo): crear sala (código de 5 letras), unirse con código/enlace, o un solo móvil. Elección secreta de 3 Pokémon (de tu equipo o del Pokédex para líderes), 3 duelos al mejor de 3 rondas.
- Reglas implementadas en `engine.js` (Total = Nivel + Potencia + Dado ± Tipo + Habilidad − Quemado ± ajuste manual). Ahí se cambian: Quemado, inmunidades, habilidades automáticas (tabla `ABIL`).
- La conexión online usa PeerJS (carga desde unpkg y usa su servidor público solo para que los móviles se encuentren). Los efectos sin regla automática salen como "resuélvelo a mano" con un ajuste manual al total.
- Archivos nuevos: `engine.js`, `team.js`, `net.js`, `battle.js`.

## Fase 3: comodidad de uso

- **Pantalla siempre activa** (`ui.js`): usa la Wake Lock API mientras la app está visible y la vuelve a pedir al volver a abrirla. Botón 🔆/🌙 en las cabeceras para desactivarla. Si el navegador no la soporta, avisa una vez.
- **Avisos** (`showToast(mensaje, tipo)` con tipo `ok`, `error` o `info`): salen sobre el menú inferior y se van solos a los 3 s. El icono de Mi Equipo hace una animación al añadir.
- **Estados alterados** en cada Pokémon del equipo: PAR, VEN, DOR, QUE, CON, CGL (Congelado) y MAL (Maldito), con los contadores y caras de las tarjetas físicas. Se guardan por Pokémon en el móvil. Al guardar en el PC se quitan. Los estados del equipo pasan al combate al elegirlos.
- **Ticket de cálculo** en el combate: enfrentamiento de tipos, efectividad, desglose y total, antes de tirar y en el resultado de cada ronda.

## Fase 4: sonido, captura y animaciones

- **Sonido** (`audio.js`, `AudioManager`): todo sintetizado con Web Audio, sin archivos. Botón 🔔/🎵/🔇 en las cabeceras: solo efectos (por defecto), música y efectos, silencio. Se guarda en el móvil. Suena un clic en filtros, pestañas y botones, un error al intentar un 7.º Pokémon y un sonido de captura al añadir.
- **Poké Ball** al añadir a Mi Equipo: animación CSS (cae, 3 oscilaciones, se cierra y desaparece), sincronizada con el sonido.
- **Calculadora de captura** (`captura.js`): en cada ficha, eliges la bola y sale el número que hay que sacar. El dato es la columna `captura` del CSV/Excel ("4+" = número con Poké Ball). Los modificadores de bola (Super −1, Ultra −2, Master automática) están al inicio de `captura.js`: ajústalos a vuestras reglas.
