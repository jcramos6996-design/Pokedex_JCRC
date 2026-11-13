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

## Captura con las cartas de bola

- Las 19 cartas de captura están en la tabla `BALLS` de `captura.js` (bonus, condiciones, notas). Fórmula: tirada + bonus de la bola + 2 si vences al Pokémon antes ≥ número de captura. Se muestra el cálculo paso a paso.
- Combate previo ("Luchar contra X con mi equipo"): 1 Pokémon salvaje contra 1 a 6 de tu equipo, en orden. Cada duelo es al mejor de 3 rondas. En cuanto uno gana un duelo, has vencido (+2). El salvaje lo juega la app (ataque al azar y tira solo).

## Release 4.1

- **Debilitado**: botón ❤️/💔 en cada Pokémon del equipo. Se pone en gris, no se puede elegir para combatir y pierde sus estados alterados. Se guarda en el móvil.
- **Centro Pokémon**: botón en la cabecera de Mi Equipo (con confirmación). Cura estados y Debilitado de todo el equipo y del PC, con melodía propia.
- **Combate flexible**: de 1 a 3 Pokémon por entrenador. Se juegan tantos duelos como Pokémon lleve el que menos lleva (1 duelo: gana quien lo gane; 2 duelos: hay que ganar los 2, si no es empate; 3 duelos: gana quien gane 2).
- **Identificadores únicos** por Pokémon (`uid`): dos iguales no se mezclan. Al evolucionar se conservan estados y Debilitado.
- **Pantalla activa**: se vuelve a pedir al volver a la app (`visibilitychange` y `pageshow`). **Audio**: toda llamada que el navegador pueda bloquear está protegida.

## Fondo

El fondo de hexágonos está en `assets/fondo.jpg` (escritorio) y `assets/fondo-movil.jpg` (móvil vertical). Se aplica en `style.css`, al final, en el bloque "Fondo de hexágonos". Para cambiarlo, sustituye esas dos imágenes.

## Tarjeta de Entrenador (pestaña 🪪)

- `trainer.js` + `data/trainer.js`. Perfil (nombre, foto o icono, ID, rango), Pokédex personal (por región y tipo, qué te falta), medallas y Liga, ciudades visitadas y dónde estás, estadísticas de combate y capturas, logros, notas, guardar la tarjeta como imagen y copia de seguridad (descargar / restaurar).
- Se rellena sola: cada Pokémon que entra en tu equipo cuenta en la Pokédex, "capturado" cuenta como captura, evolucionar suma evolución y los combates en línea y contra salvajes suman victorias/derrotas. Medallas y ciudades se marcan a mano.
- Regiones, gimnasios y ciudades (Kanto y Johto de ejemplo) se cambian en `data/trainer.js`.


## Mochila (cartas de objeto)
- Nueva pestaña **Mochila** con las 46 cartas (`data/items.js`, imágenes en `assets/objetos/`). Subir a GitHub: `bag.js`, `data/items.js`, `assets/objetos/` (92 ficheros), y reemplazar `index.html`, `style.css`, `engine.js`, `battle.js`, `captura.js`, `team.js`.
- Captura: se anota cuántas tienes; la calculadora muestra el stock y gasta una al capturar. Amigo/Lujo Ball suben 1 nivel al capturado, Sana Ball te deja revivir, Love Ball avisa de robar objeto. Flauta Negra: casilla en el combate salvaje previo.
- Acción: Revivir, Max Revivir, Cura Total y Caramelo Raro se aplican solos; el resto (Bicicleta, Deportivas…) se «usan y descartan» llevando la cuenta.
- Equipamiento: se equipa a un Pokémon (se ve en Mi Equipo). En combate: Vitamina, Telescopio y Roca del Rey son automáticos; Garra Afilada, Garra Rápida, Mineral Evolutivo y Lupa tienen casilla al elegir ataque; Poción Máxima, Baya, Repartir Exp y Huevo Suerte tienen botones en Mi Equipo/Mochila. Restos y Baya (repetir dado) y Amuleto son recordatorios.
- Permanentes: Poké Flauta ofrece tirar el D4 cuando un Pokémon se duerme.
- Se guarda en `pmtu.bag.v1` y entra en la copia de seguridad.

## Prioridad (regla actualizada)
Un ataque con Prioridad (símbolo o Garra Rápida) gana los empates del total final y anula los efectos del movimiento rival esa ronda. Si los dos usan Prioridad, se anulan entre sí y la ronda es normal. Está en `engine.js` (resolveRound) y descrita en `data/efectos.csv`.

## Tipos y medallas con imagen
- Etiquetas de tipo (`assets/tipos_pill/<tipo>.png`, 18 tipos): se ven en la ficha de la carta, Mi Equipo, combate y fortalezas/debilidades. Los iconos pequeños de los ataques siguen igual.
- Medallas de Kanto (`assets/medallas/<id>.png`): en la tarjeta de entrenador, la lista de medallas y la imagen PNG de la tarjeta. Las de Johto siguen con emoji hasta que haya imágenes (mismo nombre que su id, p. ej. `cefiro.png`, y añadir el id en MEDAL_IMG de trainer.js, y cambiar la condición de región).

## Mochila v2 (lista + menú inferior) e InventoryManager
- La Mochila es una lista: icono · nombre · ×cantidad · [＋]. El ＋ solo añade botín/compras. Tocar la fila abre el menú inferior: **Usar / Equipar · Tirar · Cancelar**. «＋ Añadir objeto» abre el catálogo completo.
- Usar Revivir/Cura Total/Caramelo Raro abre la lista de Mi Equipo; los Pokémon que no valen salen apagados con el motivo (Revivir solo con Debilitado). Al usarlo se resta 1, se guarda y suena el SFX de curación.
- `window.InventoryManager` (en bag.js): `defaultInventory` (vacío; ej. `{ pokeball: 5 }`), `addItem(id, n)`, `discard(id)`, `useItem(id, uid, estado?)`, `qty(id)`. Guarda en `pmtu.bag.v1` en cada cambio.
- Entrenador: el nombre se guarda al teclear. Medallas apagadas en gris con opacidad .3; al tocarlas se iluminan, hacen zoom ×1.1 y suena el SFX `medal`.

## Gimnasios (Combate → 🏟️ Gimnasio)
**Los equipos de los líderes se definen en `data/gimnasios.csv`** (una fila por Pokémon; ábrelo con Excel o cualquier editor) y se convierten con:

    python3 tools/csv_a_gimnasios.py

Eso valida las cartas y genera `data/gimnasios.js`. Columnas: `gimnasio` (id de data/trainer.js: roca, cascada…), `region`, `lider`, `ciudad`, `medalla`, `frase` (en una sola fila por gimnasio; vacíos = los de trainer.js), `carta` (id: 074, 037, 074_alola, 058_hisui…), `nivel` (1-10; vacío = nivel base de la carta, así graduas la dificultad), `oculto` (si = **trampa**: el retador la ve como «❓ Pokémon sorpresa»), `nota` (libre).
- El número de Pokémon por líder es libre; el líder elige 3 (o todos si tiene menos).
- Una carta que aún no existe en data/cards.js se avisa al convertir y se ignora en la app hasta que la añadas.
- El archivo actual es PROVISIONAL, salvo la idea de Brock (Geodude de Alola, Graveler, Onix y Vulpix oculto).
- **CPU**: tras confirmar tú tus 3 Pokémon, el líder estudia tu equipo y elige sus 3 y su orden; cada ronda calcula su mejor ataque sin mirar el tuyo. Si hay empate de valoración prefiere sacar su trampa (`E.cpuPickTeam`, `E.cpuChoose`).
- **Jugador**: lista de jugadores (`pmtu.players.v1`), sorteo entre todos menos el retador; el elegido controla al líder desde que escoge sus Pokémon hasta el final, en un móvil o en sala.
- Al ganar se concede la medalla automáticamente en la tarjeta de entrenador.

## Cartas de líder (Surge y Misty)
- Ids: `081_surge, 101_surge, 100_hisuisurge, 026_surge, 120_misty, 121_misty, 116_misty, 054_misty` (imagen en `cards/<id>.webp`).
- Llevan `props: gym`: no aparecen en la Pokédex, solo en los gimnasios (`data/gimnasios.csv`).
- `nivel` vacío = nivel de la carta. `oculto` = Pokémon trampa.
- La CPU evita los ataques con KO sobre sí misma (Explosión/Autodestrucción), porque el Pokémon se debilita y pierde el duelo.

## Combate: suma animada y relevo (v16)
- Tras tirar, ya no sale el resultado de golpe: sumas **tú** el ataque línea a línea (botón ➕ Sumar), luego el del rival y por último se enfrentan los dos totales con cuenta animada. «⏩ Sumar todo» salta el paso y «Sumar solo» lo hace automático (se recuerda en `pmtu.sumauto`).
- Si tu Pokémon pierde el duelo y el combate sigue, aparece una ventana: eliges con cuál sigues (se muestra a quién te enfrentarás) o **🏳️ Retirarte** (se da el combate por perdido, con confirmación). Motor: acciones `next` y `forfeit`, campos `repl` y `forfeit`.
- La CPU del líder mantiene el orden de equipo que ya eligió.

## Equipo del líder oculto (v17)
La ficha del gimnasio solo muestra cuántos Pokémon lleva el líder (Poké Balls, `assets/pokeball.png`), no cuáles. Los rivales humanos tampoco ven tu equipo hasta que los dos confirman.
