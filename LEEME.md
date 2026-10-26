# Pokédex de Cartas

Buscador de cartas para el juego de mesa, con diseño pensado para el móvil
(filtros a pantalla completa, rejilla táctil, ficha con deslizamiento, zoom).

## Estructura

```
index.html          La página
style.css           Estilos
app.js              Buscador, filtros y fichas
data/cards.csv      TU LISTA de Pokémon (se edita en Excel / Google Sheets)
data/cards.js       Se genera desde el CSV (no tocar)
cards/              Aquí van las imágenes de tus cartas
tools/csv_a_cartas.py   Convierte el CSV en cards.js
```

## Añadir tus cartas

1. Guarda la imagen de cada carta en `cards/` con el número de Pokédex como nombre:
   `cards/025.webp` (también vale `.png`, `.jpg` o `.jpeg`).
   Si una carta tiene otro nombre de archivo, ponlo en la columna `image` del CSV.
2. Añade o edita una fila en `data/cards.csv`. Las listas van separadas por `;`
   (por ejemplo `types` = `grass;poison`). Las evoluciones se indican con `evolvesTo`
   y la web calcula sola las etapas, las líneas evolutivas y las evoluciones ramificadas.
3. Ejecuta `python3 tools/csv_a_cartas.py` para regenerar `data/cards.js`.

Las 25 filas que trae el CSV son solo un ejemplo para que veas cómo funciona.
Mientras una carta no tenga imagen, se muestra un marcador con su nombre y número.

### Formas alternativas (opcional)

En `data/cards.js` puedes añadir a una carta un campo `forms`, por ejemplo:
`forms: [{ label: 'Variocolor', image: '025-shiny.webp' }]`
y en la ficha aparecerán botones para cambiar de imagen.

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
