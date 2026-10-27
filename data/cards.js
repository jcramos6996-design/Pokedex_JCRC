// Generado por tools/csv_a_cartas.py a partir de data/cards.csv. No lo edites a mano.
window.CARD_CONFIG = { imageDir: 'cards/' };
window.CARDS = [
 {
  "id": "001",
  "name": "Bulbasaur",
  "gen": 1,
  "types": [
   "grass",
   "poison"
  ],
  "evolvesTo": [
   "002"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Espesura",
  "abilityDesc": "Gana +1 al total si usas un movimiento de tipo Planta y el resultado del dado de combate fue 2 o menos",
  "captura": "3+",
  "moves": [
   {
    "name": "Latigo Cepa",
    "type": "grass",
    "die": "D6",
    "power": "2",
    "effects": []
   },
   {
    "name": "Gruñido",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "N-D6"
    ]
   }
  ],
  "color": "pink"
 },
 {
  "id": "002",
  "name": "Ivysaur",
  "gen": 1,
  "types": [
   "grass",
   "poison"
  ],
  "evolvesTo": [
   "003"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Espesura",
  "abilityDesc": "Gana +1 al total si usas un movimiento de tipo Planta y el resultado del dado de combate fue 2 o menos",
  "captura": "5+",
  "moves": [
   {
    "name": "Hoja Afilada",
    "type": "grass",
    "die": "D6",
    "power": "2",
    "effects": [
     "D6 +5"
    ]
   },
   {
    "name": "Derribo",
    "type": "normal",
    "die": "D6",
    "power": "3",
    "effects": [
     "KO 5"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "003",
  "name": "Venusaur",
  "gen": 1,
  "types": [
   "grass",
   "poison"
  ],
  "regions": [
   "kanto"
  ],
  "canMega": true,
  "ability": "Espesura",
  "abilityDesc": "Gana +1 al total si usas un movimiento de tipo Planta y el resultado del dado de combate fue 2 o menos",
  "captura": "7+",
  "moves": [
   {
    "name": "Doble Filo",
    "type": "normal",
    "die": "D6",
    "power": "4",
    "effects": [
     "KO 5"
    ]
   },
   {
    "name": "Somnífero",
    "type": "grass",
    "die": "D6",
    "power": "0",
    "effects": [
     "Dormido",
     "Espera"
    ]
   },
   {
    "name": "Rayo Solar",
    "type": "grass",
    "die": "D6",
    "power": "4",
    "effects": [
     "Stat. Down"
    ]
   }
  ],
  "color": "red"
 },
 {
  "id": "004",
  "name": "Charmander",
  "gen": 1,
  "types": [
   "fire"
  ],
  "evolvesTo": [
   "005"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Mar Llamas",
  "abilityDesc": "Gana +1 al total si usas un movimiento de tipo fuego y el resultado del dado de combate fue 2 o menos",
  "captura": "3+",
  "moves": [
   {
    "name": "Ascuas",
    "type": "fire",
    "die": "D6",
    "power": "2",
    "effects": [
     "Quemado 6"
    ]
   },
   {
    "name": "Gruñido",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "N-D6"
    ]
   }
  ],
  "color": "pink"
 },
 {
  "id": "005",
  "name": "Charmeleon",
  "gen": 1,
  "types": [
   "fire"
  ],
  "evolvesTo": [
   "006"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Mar Llamas",
  "abilityDesc": "Gana +1 al total si usas un movimiento de tipo fuego y el resultado del dado de combate fue 2 o menos",
  "captura": "5+",
  "moves": [
   {
    "name": "Colmillo Ígneo",
    "type": "fire",
    "die": "D8",
    "power": "2",
    "effects": [
     "Quemado 6",
     "N-D6 +6"
    ]
   },
   {
    "name": "Cuchillada",
    "type": "normal",
    "die": "D8",
    "power": "2",
    "effects": [
     "B-D6 +5"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "006",
  "name": "Charizard",
  "gen": 1,
  "types": [
   "fire",
   "flying"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "fly"
  ],
  "canMega": true,
  "ability": "Mar Llamas",
  "abilityDesc": "Gana +1 al total si usas un movimiento de tipo fuego y el resultado del dado de combate fue 2 o menos",
  "captura": "7+",
  "moves": [
   {
    "name": "Tajo Aéreo",
    "type": "flying",
    "die": "D8",
    "power": "2",
    "effects": []
   },
   {
    "name": "Onda ígnea",
    "type": "fire",
    "die": "D6",
    "power": "3",
    "effects": [
     "Quemado 6"
    ]
   },
   {
    "name": "Envite Ígneo",
    "type": "fire",
    "die": "D6",
    "power": "4",
    "effects": [
     "B-KO +5"
    ]
   }
  ],
  "color": "red"
 },
 {
  "id": "007",
  "name": "Squirtle",
  "gen": 1,
  "types": [
   "water"
  ],
  "evolvesTo": [
   "008"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Torrente",
  "abilityDesc": "Gana +1 al total si usas un movimiento de tipo agua y el resultado del dado de combate fue 2 o menos",
  "captura": "3+",
  "moves": [
   {
    "name": "Pistola Agua",
    "type": "water",
    "die": "D6",
    "power": "2",
    "effects": []
   },
   {
    "name": "Látigo",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "D6 +1"
    ]
   }
  ],
  "color": "pink"
 },
 {
  "id": "008",
  "name": "Wartortle",
  "gen": 1,
  "types": [
   "water"
  ],
  "evolvesTo": [
   "009"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Torrente",
  "abilityDesc": "Gana +1 al total si usas un movimiento de tipo agua y el resultado del dado de combate fue 2 o menos",
  "captura": "5+",
  "moves": [
   {
    "name": "Hidropulso",
    "type": "water",
    "die": "D6",
    "power": "2",
    "effects": [
     "Confuso 5"
    ]
   },
   {
    "name": "Mordisco",
    "type": "dark",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6 +5"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "009",
  "name": "Blastoise",
  "gen": 1,
  "types": [
   "water"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "canMega": true,
  "ability": "Torrente",
  "abilityDesc": "Gana +1 al total si usas un movimiento de tipo agua y el resultado del dado de combate fue 2 o menos",
  "captura": "7+",
  "moves": [
   {
    "name": "Protección",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "Protección",
     "No repite"
    ]
   },
   {
    "name": "Cabezazo",
    "type": "steel",
    "die": "D6",
    "power": "3",
    "effects": [
     "N-D6 +4",
     "No repite"
    ]
   },
   {
    "name": "Hidrobomba",
    "type": "water",
    "die": "D8",
    "power": "3",
    "effects": []
   }
  ],
  "color": "red"
 },
 {
  "id": "010",
  "name": "Caterpie",
  "gen": 1,
  "types": [
   "bug"
  ],
  "evolvesTo": [
   "011"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Polvo Escudo",
  "abilityDesc": "Inmune a N-D6 de movimientos",
  "captura": "3+",
  "moves": [
   {
    "name": "Disparo Demora",
    "type": "bug",
    "die": "D6",
    "power": "0",
    "effects": [
     "N-D6"
    ]
   }
  ],
  "color": "pink"
 },
 {
  "id": "011",
  "name": "Metapod",
  "gen": 1,
  "types": [
   "bug"
  ],
  "evolvesTo": [
   "012"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Mudar",
  "abilityDesc": "Si sufre algún estado. Al final de cada turno tira un dado y si saca 4 o más, cura el estado.",
  "captura": "4+",
  "moves": [
   {
    "name": "Fortaleza",
    "type": "bug",
    "die": "D6",
    "power": "0",
    "effects": [
     "N-D6"
    ]
   }
  ],
  "color": "pink"
 },
 {
  "id": "012",
  "name": "Butterfree",
  "gen": 1,
  "types": [
   "bug",
   "flying"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Ojo Compuesto",
  "abilityDesc": "Si sacas 1 en el dado de combate, puedes repetir tirada con un D4",
  "captura": "5+",
  "moves": [
   {
    "name": "Zumbido",
    "type": "bug",
    "die": "D6",
    "power": "3",
    "effects": [
     "D6 +6"
    ]
   },
   {
    "name": "Somnífero",
    "type": "grass",
    "die": "D6",
    "power": "0",
    "effects": [
     "Dormido",
     "Espera"
    ]
   },
   {
    "name": "Viento Afín",
    "type": "flying",
    "die": "D6",
    "power": "0*",
    "effects": [
     "D6 +1"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "013",
  "name": "Weedle",
  "gen": 1,
  "types": [
   "bug",
   "poison"
  ],
  "evolvesTo": [
   "014"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Polvo Escudo",
  "abilityDesc": "Inmune a N-D6 de movimientos",
  "captura": "3+",
  "moves": [
   {
    "name": "Picotazo Venenoso",
    "type": "poison",
    "die": "D6",
    "power": "1",
    "effects": [
     "Veneno 5"
    ]
   }
  ],
  "color": "pink"
 },
 {
  "id": "014",
  "name": "Kakuna",
  "gen": 1,
  "types": [
   "bug",
   "poison"
  ],
  "evolvesTo": [
   "015"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Mudar",
  "abilityDesc": "Si sufre algún estado. Al final de cada turno tira un dado y si saca 4 o más, cura el estado.",
  "captura": "4+",
  "moves": [
   {
    "name": "Fortaleza",
    "type": "bug",
    "die": "D6",
    "power": "0",
    "effects": [
     "N-D6"
    ]
   }
  ],
  "color": "pink"
 },
 {
  "id": "015",
  "name": "Beedrill",
  "gen": 1,
  "types": [
   "bug",
   "poison"
  ],
  "regions": [
   "kanto"
  ],
  "canMega": true,
  "ability": "Enjambre",
  "abilityDesc": "Gana +1 al total si usas un movimiento de tipo Bicho y el resultado del dado de combate fue 2 o menos",
  "captura": "5+",
  "moves": [
   {
    "name": "Doble Ataque",
    "type": "bug",
    "die": "D4",
    "power": "1",
    "effects": [
     "D+",
     "Veneno 5"
    ]
   },
   {
    "name": "Furia",
    "type": "normal",
    "die": "D6",
    "power": "1",
    "effects": [
     "D+puño"
    ]
   },
   {
    "name": "Puya Nociva",
    "type": "poison",
    "die": "D6",
    "power": "3",
    "effects": [
     "Veneno 5"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "016",
  "name": "Pidgey",
  "gen": 1,
  "types": [
   "normal",
   "flying"
  ],
  "evolvesTo": [
   "017"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "fly"
  ],
  "ability": "Vista Lince",
  "abilityDesc": "Siempre acierta sus ataques",
  "captura": "3+",
  "moves": [
   {
    "name": "Tornado",
    "type": "flying",
    "die": "D6",
    "power": "1",
    "effects": []
   },
   {
    "name": "Ataque Arena",
    "type": "ground",
    "die": "D6",
    "power": "0",
    "effects": [
     "N-D6"
    ]
   }
  ],
  "color": "pink"
 },
 {
  "id": "017",
  "name": "Pidgeotto",
  "gen": 1,
  "types": [
   "normal",
   "flying"
  ],
  "evolvesTo": [
   "018"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "fly"
  ],
  "ability": "Vista Lince",
  "abilityDesc": "Siempre acierta sus ataques",
  "captura": "5+",
  "moves": [
   {
    "name": "Ataque Ala",
    "type": "flying",
    "die": "D6",
    "power": "2",
    "effects": []
   },
   {
    "name": "Ciclón",
    "type": "dragon",
    "die": "D6",
    "power": "2",
    "effects": [
     "B-D6"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "018",
  "name": "Pidgeot",
  "gen": 1,
  "types": [
   "normal",
   "flying"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "fly"
  ],
  "canMega": true,
  "ability": "Vista Lince",
  "abilityDesc": "Siempre acierta sus ataques",
  "captura": "7+",
  "moves": [
   {
    "name": "Ataque Aéreo",
    "type": "flying",
    "die": "D8",
    "power": "4",
    "effects": [
     "N-D6 +5"
    ]
   },
   {
    "name": "Descanso",
    "type": "psychic",
    "die": "D6",
    "power": "0",
    "effects": [
     "Revivir"
    ]
   },
   {
    "name": "Autodestrucción",
    "type": "normal",
    "die": "D6",
    "power": "4",
    "effects": [
     "B-KO"
    ]
   }
  ],
  "color": "red"
 },
 {
  "id": "019",
  "name": "Rattata",
  "gen": 1,
  "types": [
   "normal"
  ],
  "evolvesTo": [
   "020"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Agallas",
  "abilityDesc": "Si el Pokemon sufre algún estado, su ataque se incrementa en +2",
  "captura": "3+",
  "moves": [
   {
    "name": "Látigo",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "B-D6"
    ]
   },
   {
    "name": "Ataque Rápido",
    "type": "normal",
    "die": "D6",
    "power": "2",
    "effects": [
     "Prioridad"
    ]
   }
  ],
  "color": "pink"
 },
 {
  "id": "020",
  "name": "Raticate",
  "gen": 1,
  "types": [
   "normal"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Agallas",
  "abilityDesc": "Si el Pokemon sufre algún estado, su ataque se incrementa en +2",
  "captura": "5+",
  "moves": [
   {
    "name": "Hipercolmillo",
    "type": "normal",
    "die": "D8",
    "power": "2",
    "effects": [
     "N-D6 +6"
    ]
   },
   {
    "name": "Triturar",
    "type": "dark",
    "die": "D8",
    "power": "2",
    "effects": []
   }
  ],
  "color": "blue"
 },
 {
  "id": "021",
  "name": "Spearow",
  "gen": 1,
  "types": [
   "normal",
   "flying"
  ],
  "evolvesTo": [
   "022"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "fly"
  ],
  "ability": "Vista Lince",
  "abilityDesc": "Siempre acierta sus ataques",
  "captura": "3+",
  "moves": [
   {
    "name": "Látigo",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "B-D6"
    ]
   },
   {
    "name": "Ataque Ala",
    "type": "flying",
    "die": "D6",
    "power": "2",
    "effects": []
   }
  ],
  "color": "pink"
 },
 {
  "id": "022",
  "name": "Fearow",
  "gen": 1,
  "types": [
   "normal",
   "flying"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "fly"
  ],
  "ability": "Vista Lince",
  "abilityDesc": "Siempre acierta sus ataques",
  "captura": "5+",
  "moves": [
   {
    "name": "Movimiento Espejo",
    "type": "flying",
    "die": "D6",
    "power": "0",
    "effects": [
     "Reflejo"
    ]
   },
   {
    "name": "Pico Taladro",
    "type": "flying",
    "die": "D8",
    "power": "2",
    "effects": []
   }
  ],
  "color": "blue"
 },
 {
  "id": "023",
  "name": "Ekans",
  "gen": 1,
  "types": [
   "poison"
  ],
  "evolvesTo": [
   "024"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Mudar",
  "abilityDesc": "Si sufre algún estado. Al final de cada turno tira un dado y si saca 4 o más, cura el estado.",
  "captura": "3+",
  "moves": [
   {
    "name": "Picotazo Venenoso",
    "type": "poison",
    "die": "D6",
    "power": "1",
    "effects": [
     "Veneno 5"
    ]
   },
   {
    "name": "Mordisco",
    "type": "dark",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6 +5"
    ]
   }
  ],
  "color": "pink"
 },
 {
  "id": "024",
  "name": "Arbok",
  "gen": 1,
  "types": [
   "poison"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Mudar",
  "abilityDesc": "Si sufre algún estado. Al final de cada turno tira un dado y si saca 4 o más, cura el estado.",
  "captura": "5+",
  "moves": [
   {
    "name": "Puya Nociva",
    "type": "poison",
    "die": "D6",
    "power": "3",
    "effects": [
     "Veneno 5"
    ]
   },
   {
    "name": "Mordisco",
    "type": "dark",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6 +5"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "025",
  "name": "Pikachu",
  "gen": 1,
  "types": [
   "electric"
  ],
  "evolvesTo": [
   "026"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Electricidad Estática",
  "abilityDesc": "Al final de cada ronda lanza un dada de efecto Parálisis +5",
  "captura": "5+",
  "moves": [
   {
    "name": "Ataque Rápido",
    "type": "normal",
    "die": "D6",
    "power": "2",
    "effects": [
     "Prioridad"
    ]
   },
   {
    "name": "Impactrueno",
    "type": "electric",
    "die": "D6",
    "power": "1",
    "effects": [
     "Parálisis +6"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "026",
  "name": "Raichu",
  "gen": 1,
  "types": [
   "electric"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Electricidad Estática",
  "abilityDesc": "Al final de cada ronda lanza un dada de efecto Parálisis +5",
  "captura": "7+",
  "moves": [
   {
    "name": "Atizar",
    "type": "normal",
    "die": "D6",
    "power": "3",
    "effects": []
   },
   {
    "name": "Moflete Estático",
    "type": "electric",
    "die": "D6",
    "power": "1",
    "effects": [
     "Parálisis"
    ]
   },
   {
    "name": "Trueno",
    "type": "electric",
    "die": "D8",
    "power": "3",
    "effects": [
     "Parálisis +5"
    ]
   }
  ],
  "color": "red"
 },
 {
  "id": "027",
  "name": "Sandshrew",
  "gen": 1,
  "types": [
   "ground"
  ],
  "evolvesTo": [
   "028"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Velo Arena",
  "abilityDesc": "Gana +2 al total, si el resultado del dado de combate fue 2 o menos",
  "captura": "3+",
  "moves": [
   {
    "name": "Arañazo",
    "type": "normal",
    "die": "D6",
    "power": "1",
    "effects": []
   },
   {
    "name": "Ataque Arena",
    "type": "ground",
    "die": "D6",
    "power": "0",
    "effects": [
     "N-D6"
    ]
   }
  ],
  "color": "pink"
 },
 {
  "id": "028",
  "name": "Sandslash",
  "gen": 1,
  "types": [
   "ground"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Velo Arena",
  "abilityDesc": "Gana +2 al total, si el resultado del dado de combate fue 2 o menos",
  "captura": "5+",
  "moves": [
   {
    "name": "Cuchillada",
    "type": "normal",
    "die": "D8",
    "power": "2",
    "effects": []
   },
   {
    "name": "Excavar",
    "type": "ground",
    "die": "D8",
    "power": "2",
    "effects": []
   }
  ],
  "color": "blue"
 },
 {
  "id": "029",
  "name": "Nidoran♀",
  "gen": 1,
  "types": [
   "poison"
  ],
  "evolvesTo": [
   "030"
  ],
  "regions": [
   "kanto"
  ],
  "aliases": [
   "nidoran"
  ],
  "ability": "Punto Tóxico",
  "abilityDesc": "Si es atacado, tira un dado, si sale 4 o más el atacante queda envenenado",
  "captura": "3+",
  "moves": [
   {
    "name": "Picotazo Venenoso",
    "type": "poison",
    "die": "D6",
    "power": "1",
    "effects": [
     "Veneno 5"
    ]
   },
   {
    "name": "Látigo",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "B-D6"
    ]
   }
  ],
  "color": "pink"
 },
 {
  "id": "030",
  "name": "Nidorina",
  "gen": 1,
  "types": [
   "poison"
  ],
  "evolvesTo": [
   "031"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Punto Tóxico",
  "abilityDesc": "Si es atacado, tira un dado, si sale 4 o más el atacante queda envenenado",
  "captura": "5+",
  "moves": [
   {
    "name": "Picotazo Venenoso",
    "type": "poison",
    "die": "D6",
    "power": "1",
    "effects": [
     "Veneno 5"
    ]
   },
   {
    "name": "Drenadoras",
    "type": "grass",
    "die": "D6",
    "power": "1",
    "effects": [
     "Repetición",
     "Corazón"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "031",
  "name": "Nidoqueen",
  "gen": 1,
  "types": [
   "poison",
   "ground"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Punto Tóxico",
  "abilityDesc": "Si es atacado, tira un dado, si sale 4 o más el atacante queda envenenado",
  "captura": "7+",
  "moves": [
   {
    "name": "Puya Nociva",
    "type": "poison",
    "die": "D6",
    "power": "3",
    "effects": [
     "Veneno 5"
    ]
   },
   {
    "name": "Terratemblor",
    "type": "ground",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6"
    ]
   },
   {
    "name": "Roca Afilada",
    "type": "rock",
    "die": "D6",
    "power": "3",
    "effects": [
     "KO 6"
    ]
   }
  ],
  "color": "red"
 },
 {
  "id": "032",
  "name": "Nidoran♂",
  "gen": 1,
  "types": [
   "poison"
  ],
  "evolvesTo": [
   "033"
  ],
  "regions": [
   "kanto"
  ],
  "aliases": [
   "nidoran"
  ],
  "ability": "Punto Tóxico",
  "abilityDesc": "Si es atacado, tira un dado, si sale 4 o más el atacante queda envenenado",
  "captura": "3+",
  "moves": [
   {
    "name": "Picotazo Venenoso",
    "type": "poison",
    "die": "D6",
    "power": "1",
    "effects": [
     "Veneno 5"
    ]
   },
   {
    "name": "Látigo",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "B-D6"
    ]
   }
  ],
  "color": "pink"
 },
 {
  "id": "033",
  "name": "Nidorino",
  "gen": 1,
  "types": [
   "poison"
  ],
  "evolvesTo": [
   "034"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Punto Tóxico",
  "abilityDesc": "Si es atacado, tira un dado, si sale 4 o más el atacante queda envenenado",
  "captura": "5+",
  "moves": [
   {
    "name": "Picotazo Venenoso",
    "type": "poison",
    "die": "D6",
    "power": "1",
    "effects": [
     "Veneno 5"
    ]
   },
   {
    "name": "Doble Patada",
    "type": "fighting",
    "die": "D4",
    "power": "1",
    "effects": [
     "Repetición"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "034",
  "name": "Nidoking",
  "gen": 1,
  "types": [
   "poison",
   "ground"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Punto Tóxico",
  "abilityDesc": "Si es atacado, tira un dado, si sale 4 o más el atacante queda envenenado",
  "captura": "7+",
  "moves": [
   {
    "name": "Puya Nociva",
    "type": "poison",
    "die": "D6",
    "power": "3",
    "effects": [
     "Veneno 5"
    ]
   },
   {
    "name": "Movimiento Sísmico",
    "type": "fighting",
    "die": "D6",
    "power": "*",
    "effects": [
     "Ignore Type"
    ]
   },
   {
    "name": "Megacuerno",
    "type": "bug",
    "die": "D6",
    "power": "3",
    "effects": []
   }
  ],
  "color": "red"
 },
 {
  "id": "035",
  "name": "Clefairy",
  "gen": 1,
  "types": [
   "fairy"
  ],
  "evolvesTo": [
   "036"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "teleport"
  ],
  "ability": "Gran Encanto",
  "abilityDesc": "Cuando este Pokemon es atacado por otro, el atacante tira un dado y si el resultado es 5 o 6, queda confuso",
  "captura": "4+",
  "moves": [
   {
    "name": "Canto",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "Dormido"
    ]
   },
   {
    "name": "Voz Cautivadora",
    "type": "fairy",
    "die": "D6",
    "power": "2",
    "effects": [
     "B-D6"
    ]
   }
  ],
  "color": "pink"
 },
 {
  "id": "036",
  "name": "Clefable",
  "gen": 1,
  "types": [
   "fairy"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "teleport"
  ],
  "ability": "Gran Encanto",
  "abilityDesc": "Cuando este Pokemon es atacado por otro, el atacante tira un dado y si el resultado es 5 o 6, queda confuso",
  "captura": "5+",
  "moves": [
   {
    "name": "Metrónomo",
    "type": "normal",
    "die": "D6",
    "power": "*",
    "effects": []
   },
   {
    "name": "Luz Lunar",
    "type": "fairy",
    "die": "D6",
    "power": "0",
    "effects": [
     "Corazón"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "037",
  "name": "Vulpix",
  "gen": 1,
  "types": [
   "fire"
  ],
  "evolvesTo": [
   "038"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Absorbe Fuego",
  "abilityDesc": "Gana +1 al total, si recibe un ataque de tipo fuego y el resultado en el dado de combate fue 2 o menos",
  "captura": "4+",
  "moves": [
   {
    "name": "Ataque Rápido",
    "type": "normal",
    "die": "D6",
    "power": "2",
    "effects": [
     "Prioridad"
    ]
   },
   {
    "name": "Ascuas",
    "type": "fire",
    "die": "D6",
    "power": "2",
    "effects": [
     "Quemado 6"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "038",
  "name": "Ninetales",
  "gen": 1,
  "types": [
   "fire"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Absorbe Fuego",
  "abilityDesc": "Gana +1 al total, si recibe un ataque de tipo fuego y el resultado en el dado de combate fue 2 o menos",
  "captura": "6+",
  "moves": [
   {
    "name": "Ataque Rápido",
    "type": "normal",
    "die": "D6",
    "power": "2",
    "effects": [
     "Prioridad"
    ]
   },
   {
    "name": "Lanzallamas",
    "type": "fire",
    "die": "D6",
    "power": "3",
    "effects": [
     "Quemado 5"
    ]
   }
  ],
  "color": "yellow"
 },
 {
  "id": "039",
  "name": "Jigglypuff",
  "gen": 1,
  "types": [
   "normal",
   "fairy"
  ],
  "evolvesTo": [
   "040"
  ],
  "regions": [
   "kanto"
  ],
  "color": "pink"
 },
 {
  "id": "040",
  "name": "Wigglytuff",
  "gen": 1,
  "types": [
   "normal",
   "fairy"
  ],
  "regions": [
   "kanto"
  ],
  "color": "yellow"
 },
 {
  "id": "041",
  "name": "Zubat",
  "gen": 1,
  "types": [
   "poison",
   "flying"
  ],
  "evolvesTo": [
   "042"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "fly"
  ],
  "ability": "Fuerza Mental",
  "abilityDesc": "Inmune a N-DY y  a la habilidad de Intimidación.",
  "captura": "3+",
  "moves": [
   {
    "name": "Picotazo Venenoso",
    "type": "poison",
    "die": "D6",
    "power": "1",
    "effects": [
     "Veneno 5"
    ]
   },
   {
    "name": "Supersónico",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "Confuso"
    ]
   }
  ],
  "color": "pink"
 },
 {
  "id": "042",
  "name": "Golbat",
  "gen": 1,
  "types": [
   "poison",
   "flying"
  ],
  "evolvesTo": [
   "169"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "fly"
  ],
  "ability": "Fuerza Mental",
  "abilityDesc": "Inmune a N-DY y  a la habilidad de Intimidación.",
  "captura": "5+",
  "moves": [
   {
    "name": "Veneno X",
    "type": "poison",
    "die": "D6",
    "power": "2",
    "effects": [
     "Veneno 5"
    ]
   },
   {
    "name": "Chupavidas",
    "type": "bug",
    "die": "D6",
    "power": "1",
    "effects": [
     "Corazón"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "043",
  "name": "Oddish",
  "gen": 1,
  "types": [
   "grass",
   "poison"
  ],
  "evolvesTo": [
   "044"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Clorofila",
  "abilityDesc": "Gana +1 D6 si la carta de \"Dia Soleado\" está en el campo de batalla.",
  "captura": "4+",
  "moves": [
   {
    "name": "Absorber",
    "type": "grass",
    "die": "D6",
    "power": "1",
    "effects": [
     "Corazón"
    ]
   },
   {
    "name": "Polvo Veneno",
    "type": "poison",
    "die": "D6",
    "power": "0",
    "effects": [
     "Veneno 3"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "044",
  "name": "Gloom",
  "gen": 1,
  "types": [
   "grass",
   "poison"
  ],
  "evolvesTo": [
   "045"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Clorofila",
  "abilityDesc": "Gana +1 D6 si la carta de \"Dia Soleado\" está en el campo de batalla.",
  "captura": "4+",
  "moves": [
   {
    "name": "Paralizador",
    "type": "grass",
    "die": "D6",
    "power": "0",
    "effects": [
     "Paralizado 3"
    ]
   },
   {
    "name": "Ácido",
    "type": "poison",
    "die": "D6",
    "power": "2",
    "effects": [
     "D6 +6"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "045",
  "name": "Vileplume",
  "gen": 1,
  "types": [
   "grass",
   "poison"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Clorofila",
  "abilityDesc": "Gana +1 D6 si la carta de \"Dia Soleado\" está en el campo de batalla.",
  "captura": "6+",
  "moves": [
   {
    "name": "Tormenta Floral",
    "type": "grass",
    "die": "D6",
    "power": "3",
    "effects": []
   },
   {
    "name": "Polvo Veneno",
    "type": "poison",
    "die": "D6",
    "power": "0",
    "effects": [
     "Veneno 3"
    ]
   },
   {
    "name": "Rayo Solar",
    "type": "grass",
    "die": "D6",
    "power": "4",
    "effects": [
     "Stat. Down"
    ]
   }
  ],
  "color": "yellow"
 },
 {
  "id": "046",
  "name": "Paras",
  "gen": 1,
  "types": [
   "bug",
   "grass"
  ],
  "evolvesTo": [
   "047"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Efecto Espora",
  "abilityDesc": "Al terminar la ronda de batalla lanza un D6, si sale 6=Duerme, 3=Paraliza, 1=Envenena al Pokemon rival",
  "captura": "4+",
  "moves": [
   {
    "name": "Arañazo",
    "type": "normal",
    "die": "D6",
    "power": "1",
    "effects": []
   },
   {
    "name": "Paralizador",
    "type": "grass",
    "die": "D6",
    "power": "0",
    "effects": [
     "Parálisis"
    ]
   }
  ],
  "color": "pink"
 },
 {
  "id": "047",
  "name": "Parasect",
  "gen": 1,
  "types": [
   "bug",
   "grass"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Efecto Espora",
  "abilityDesc": "Al terminar la ronda de batalla lanza un D6, si sale 6=Duerme, 3=Paraliza, 1=Envenena al Pokemon rival",
  "captura": "5+",
  "moves": [
   {
    "name": "Somnífero",
    "type": "grass",
    "die": "D6",
    "power": "0",
    "effects": [
     "Dormido",
     "Espera"
    ]
   },
   {
    "name": "Cuchillada",
    "type": "normal",
    "die": "D8",
    "power": "2",
    "effects": [
     "B-D6 +5"
    ]
   },
   {
    "name": "Tijera X",
    "type": "bug",
    "die": "D6",
    "power": "3",
    "effects": []
   }
  ],
  "color": "blue"
 },
 {
  "id": "048",
  "name": "Venonat",
  "gen": 1,
  "types": [
   "bug",
   "poison"
  ],
  "evolvesTo": [
   "049"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Ojo Compuesto",
  "abilityDesc": "Si sacas 1 en el dado de combate, puedes repetir tirada con un D4",
  "captura": "5+",
  "moves": [
   {
    "name": "Paralizador",
    "type": "grass",
    "die": "D6",
    "power": "0",
    "effects": [
     "Paralizado 3"
    ]
   },
   {
    "name": "Rayo Señal",
    "type": "bug",
    "die": "D8",
    "power": "2",
    "effects": [
     "Confuso 6"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "049",
  "name": "Venomoth",
  "gen": 1,
  "types": [
   "bug",
   "poison"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Ojo Compuesto",
  "abilityDesc": "Si sacas 1 en el dado de combate, puedes repetir tirada con un D4",
  "captura": "6+",
  "moves": [
   {
    "name": "Psíquico",
    "type": "psychic",
    "die": "D8",
    "power": "2",
    "effects": [
     "3Dice +6",
     "Espera"
    ]
   },
   {
    "name": "Somnífero",
    "type": "grass",
    "die": "D6",
    "power": "0",
    "effects": [
     "Domrido",
     "Espera"
    ]
   },
   {
    "name": "Zumbido",
    "type": "bug",
    "die": "D6",
    "power": "3",
    "effects": [
     "B-D6 +6"
    ]
   }
  ],
  "color": "yellow"
 },
 {
  "id": "050",
  "name": "Diglett",
  "gen": 1,
  "types": [
   "ground"
  ],
  "evolvesTo": [
   "051"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Velo Arena",
  "abilityDesc": "Gana +2 al total, si el resultado del dado de combate fue 2 o menos",
  "captura": "4+",
  "moves": [
   {
    "name": "Arañazo",
    "type": "normal",
    "die": "D6",
    "power": "1",
    "effects": []
   },
   {
    "name": "Tormenta Arena",
    "type": "ground",
    "die": "D6",
    "power": "2",
    "effects": [
     "Add Dice6 +4"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "051",
  "name": "Dugtrio",
  "gen": 1,
  "types": [
   "ground"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Velo Arena",
  "abilityDesc": "Gana +2 al total, si el resultado del dado de combate fue 2 o menos",
  "captura": "6+",
  "moves": [
   {
    "name": "Fisura",
    "type": "ground",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-KO +5"
    ]
   },
   {
    "name": "Excavar",
    "type": "ground",
    "die": "D8",
    "power": "2",
    "effects": []
   }
  ],
  "color": "blue"
 },
 {
  "id": "052",
  "name": "Meowth",
  "gen": 1,
  "types": [
   "normal"
  ],
  "evolvesTo": [
   "053"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Experto",
  "abilityDesc": "Gana +2 al total, si el resultado del dado de combate fue 2 o menos",
  "captura": "4+",
  "moves": [
   {
    "name": "Día de Pago",
    "type": "normal",
    "die": "D6",
    "power": "2",
    "effects": [
     "Adicional 6"
    ]
   },
   {
    "name": "Mordisco",
    "type": "dark",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6 +5"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "053",
  "name": "Persian",
  "gen": 1,
  "types": [
   "normal"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Experto",
  "abilityDesc": "Gana +2 al total, si el resultado del dado de combate fue 2 o menos",
  "captura": "6+",
  "moves": [
   {
    "name": "Cuchillada",
    "type": "normal",
    "die": "D8",
    "power": "2",
    "effects": [
     "B-D6 +5"
    ]
   },
   {
    "name": "Carantoña",
    "type": "fairy",
    "die": "D6",
    "power": "3",
    "effects": [
     "N-D6 +3"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "054",
  "name": "Psyduck",
  "gen": 1,
  "types": [
   "water"
  ],
  "evolvesTo": [
   "055"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Humedad",
  "abilityDesc": "Ningun Pokemon en combate puede usar Autodestrucción ni Explosión. Si el Pokemon es sacado a combatir el turno en que uno de estos movimientos es elegido, este fallará.",
  "captura": "4+",
  "moves": [
   {
    "name": "Confusión",
    "type": "psychic",
    "die": "D6",
    "power": "2",
    "effects": [
     "Confuso 6"
    ]
   },
   {
    "name": "Anulación",
    "type": "normal",
    "die": "D6",
    "power": "0*",
    "effects": []
   },
   {
    "name": "Hidropulso",
    "type": "water",
    "die": "D6",
    "power": "2",
    "effects": [
     "Confuso 5"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "055",
  "name": "Golduck",
  "gen": 1,
  "types": [
   "water"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Humedad",
  "abilityDesc": "Ningun Pokemon en combate puede usar Autodestrucción ni Explosión. Si el Pokemon es sacado a combatir el turno en que uno de estos movimientos es elegido, este fallará.",
  "captura": "7+",
  "moves": [
   {
    "name": "Cabezazo Zen",
    "type": "psychic",
    "die": "D6",
    "power": "3",
    "effects": [
     "N-D6 +5"
    ]
   },
   {
    "name": "Acua Cola",
    "type": "water",
    "die": "D6",
    "power": "3",
    "effects": []
   },
   {
    "name": "Golpes Furia",
    "type": "water",
    "die": "D4",
    "power": "D4",
    "effects": []
   }
  ],
  "color": "yellow"
 },
 {
  "id": "056",
  "name": "Mankey",
  "gen": 1,
  "types": [
   "fighting"
  ],
  "evolvesTo": [
   "057"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Espíritu Vital",
  "abilityDesc": "Este Pokemon no puede quedar Dormido",
  "captura": "4+",
  "moves": [
   {
    "name": "Golpa Karate",
    "type": "fighting",
    "die": "D8",
    "power": "1",
    "effects": []
   },
   {
    "name": "Golpes Furia",
    "type": "normal",
    "die": "D6",
    "power": "D4 Amarillo",
    "effects": []
   }
  ],
  "color": "green"
 },
 {
  "id": "057",
  "name": "Primeape",
  "gen": 1,
  "types": [
   "fighting"
  ],
  "evolvesTo": [
   "979"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Espíritu Vital",
  "abilityDesc": "Este Pokemon no puede quedar Dormido",
  "captura": "6+",
  "moves": [
   {
    "name": "Movimiento Sísmico",
    "type": "fighting",
    "die": "D6",
    "power": "*",
    "effects": [
     "Ignore Type"
    ]
   },
   {
    "name": "Golpe Cuerpo",
    "type": "normal",
    "die": "D6",
    "power": "2",
    "effects": [
     "Parálisis 4+"
    ]
   },
   {
    "name": "Enfado",
    "type": "dragon",
    "die": "D6",
    "power": "3",
    "effects": [
     "B-Confuso 3"
    ]
   }
  ],
  "color": "yellow"
 },
 {
  "id": "058",
  "name": "Growlithe",
  "gen": 1,
  "types": [
   "fire"
  ],
  "evolvesTo": [
   "059"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Absorbe Fuego",
  "abilityDesc": "Gana +1 al total, si recibe un ataque de tipo fuego y el resultado en el dado de combate fue 2 o menos",
  "captura": "4+",
  "moves": [
   {
    "name": "Gruñido",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "N-D6"
    ]
   },
   {
    "name": "Ascuas",
    "type": "fire",
    "die": "D6",
    "power": "2",
    "effects": [
     "Quemado 6"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "059",
  "name": "Arcanine",
  "gen": 1,
  "types": [
   "fire"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Absorbe Fuego",
  "abilityDesc": "Gana +1 al total, si recibe un ataque de tipo fuego y el resultado en el dado de combate fue 2 o menos",
  "captura": "6+",
  "moves": [
   {
    "name": "Velocidad Extrema",
    "type": "normal",
    "die": "D6",
    "power": "3",
    "effects": [
     "Prioridad"
    ]
   },
   {
    "name": "Colmillo Ígneo",
    "type": "fire",
    "die": "D8",
    "power": "2",
    "effects": [
     "Quemado 6",
     "N-D6 +6"
    ]
   }
  ],
  "color": "yellow"
 },
 {
  "id": "060",
  "name": "Poliwag",
  "gen": 1,
  "types": [
   "water"
  ],
  "evolvesTo": [
   "061"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Absorbe Agua",
  "abilityDesc": "Inmune a movimientos tipo agua y sus efectos negativos. Si recibe ataque tipo agua gana + 2 en la tirada.",
  "captura": "4+",
  "moves": [
   {
    "name": "Pistola Agua",
    "type": "water",
    "die": "D6",
    "power": "2",
    "effects": []
   },
   {
    "name": "Hipnosis",
    "type": "psychic",
    "die": "D6",
    "power": "0",
    "effects": [
     "Dormido"
    ]
   }
  ],
  "color": "pink"
 },
 {
  "id": "061",
  "name": "Poliwhirl",
  "gen": 1,
  "types": [
   "water"
  ],
  "evolvesTo": [
   "062"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Absorbe Agua",
  "abilityDesc": "Inmune a movimientos tipo agua y sus efectos negativos. Si recibe ataque tipo agua gana + 2 en la tirada.",
  "captura": "6+",
  "moves": [
   {
    "name": "Burbuja",
    "type": "water",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6 +6"
    ]
   },
   {
    "name": "Doble Bofetón",
    "type": "normal",
    "die": "D4",
    "power": "D4",
    "effects": []
   }
  ],
  "color": "blue"
 },
 {
  "id": "062",
  "name": "Poliwrath",
  "gen": 1,
  "types": [
   "water",
   "fighting"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Absorbe Agua",
  "abilityDesc": "Inmune a movimientos tipo agua y sus efectos negativos. Si recibe ataque tipo agua gana + 2 en la tirada.",
  "captura": "7+",
  "moves": [
   {
    "name": "Golpe Cuerpo",
    "type": "normal",
    "die": "D6",
    "power": "3",
    "effects": [
     "Paralizado 5"
    ]
   },
   {
    "name": "Acua Jet",
    "type": "water",
    "die": "D6",
    "power": "2",
    "effects": [
     "Explamación"
    ]
   },
   {
    "name": "Puño Dinámico",
    "type": "fighting",
    "die": "D6",
    "power": "3",
    "effects": [
     "Confuso 4",
     "Espera"
    ]
   }
  ],
  "color": "red"
 },
 {
  "id": "063",
  "name": "Abra",
  "gen": 1,
  "types": [
   "psychic"
  ],
  "evolvesTo": [
   "064"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "teleport"
  ],
  "ability": "Sincronía",
  "abilityDesc": "Contagia el envenenamiento, las quemaduras o la parálisis al Pokémon que le cause ese estado.",
  "captura": "4+",
  "moves": [
   {
    "name": "Teletransporte",
    "type": "psychic",
    "die": "D6",
    "power": "0",
    "effects": []
   }
  ],
  "color": "green"
 },
 {
  "id": "064",
  "name": "Kadabra",
  "gen": 1,
  "types": [
   "psychic"
  ],
  "evolvesTo": [
   "065"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "teleport"
  ],
  "ability": "Sincronía",
  "abilityDesc": "Contagia el envenenamiento, las quemaduras o la parálisis al Pokémon que le cause ese estado.",
  "captura": "5+",
  "moves": [
   {
    "name": "Confusión",
    "type": "psychic",
    "die": "D6",
    "power": "2",
    "effects": [
     "Confuso 4"
    ]
   },
   {
    "name": "Recuperación",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "Corazón"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "065",
  "name": "Alakazam",
  "gen": 1,
  "types": [
   "psychic"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "teleport"
  ],
  "canMega": true,
  "ability": "Sincronía",
  "abilityDesc": "Contagia el envenenamiento, las quemaduras o la parálisis al Pokémon que le cause ese estado.",
  "captura": "7+",
  "moves": [
   {
    "name": "Psíquico",
    "type": "psychic",
    "die": "D8",
    "power": "2",
    "effects": [
     "3Dice +6",
     "Espera"
    ]
   },
   {
    "name": "Recuperación",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "Corazón"
    ]
   },
   {
    "name": "Tri-Ataque",
    "type": "normal",
    "die": "D4",
    "power": "3",
    "effects": [
     "Adicional 6"
    ]
   }
  ],
  "color": "red"
 },
 {
  "id": "066",
  "name": "Machop",
  "gen": 1,
  "types": [
   "fighting"
  ],
  "evolvesTo": [
   "067"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Agallas",
  "abilityDesc": "Si el Pokemon sufre algún estado, su ataque se incrementa en +2",
  "captura": "4+",
  "moves": [
   {
    "name": "Golpa Karate",
    "type": "fighting",
    "die": "D8",
    "power": "1",
    "effects": []
   },
   {
    "name": "Lanzarrocas",
    "type": "rock",
    "die": "D6",
    "power": "1",
    "effects": [
     "N-D6 +2"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "067",
  "name": "Machoke",
  "gen": 1,
  "types": [
   "fighting"
  ],
  "evolvesTo": [
   "068"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Agallas",
  "abilityDesc": "Si el Pokemon sufre algún estado, su ataque se incrementa en +2",
  "captura": "6+",
  "moves": [
   {
    "name": "Sumisión",
    "type": "fighting",
    "die": "D8",
    "power": "2",
    "effects": []
   },
   {
    "name": "Avalancha",
    "type": "rock",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6 +2"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "068",
  "name": "Machamp",
  "gen": 1,
  "types": [
   "fighting"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Agallas",
  "abilityDesc": "Si el Pokemon sufre algún estado, su ataque se incrementa en +2",
  "captura": "7+",
  "moves": [
   {
    "name": "Avalancha",
    "type": "rock",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6 +2"
    ]
   },
   {
    "name": "Puño Dinámico",
    "type": "fighting",
    "die": "D6",
    "power": "3",
    "effects": [
     "B-D6+2",
     "B-Confuso"
    ]
   },
   {
    "name": "Puño Trueno",
    "type": "electric",
    "die": "D6",
    "power": "2",
    "effects": [
     "Parálisis 2"
    ]
   }
  ],
  "color": "red"
 },
 {
  "id": "069",
  "name": "Bellsprout",
  "gen": 1,
  "types": [
   "grass",
   "poison"
  ],
  "evolvesTo": [
   "070"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Clorofila",
  "abilityDesc": "Gana +1 D6 si la carta de \"Dia Soleado\" está en el campo de batalla.",
  "captura": "4+",
  "moves": [
   {
    "name": "Latigo Cepa",
    "type": "grass",
    "die": "D6",
    "power": "2",
    "effects": []
   },
   {
    "name": "Polvo Veneno",
    "type": "poison",
    "die": "D6",
    "power": "0",
    "effects": [
     "Veneno 3"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "070",
  "name": "Weepinbell",
  "gen": 1,
  "types": [
   "grass",
   "poison"
  ],
  "evolvesTo": [
   "071"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Clorofila",
  "abilityDesc": "Gana +1 D6 si la carta de \"Dia Soleado\" está en el campo de batalla.",
  "captura": "5+",
  "moves": [
   {
    "name": "Somnífero",
    "type": "grass",
    "die": "D6",
    "power": "0",
    "effects": [
     "Dormido",
     "Espera"
    ]
   },
   {
    "name": "Ácido",
    "type": "poison",
    "die": "D6",
    "power": "2",
    "effects": [
     "D6 +6"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "071",
  "name": "Victreebel",
  "gen": 1,
  "types": [
   "grass",
   "poison"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Clorofila",
  "abilityDesc": "Gana +1 D6 si la carta de \"Dia Soleado\" está en el campo de batalla.",
  "captura": "7+",
  "moves": [
   {
    "name": "Hoja Aguda",
    "type": "grass",
    "die": "D6",
    "power": "3",
    "effects": [
     "D6 +5"
    ]
   },
   {
    "name": "Desarme",
    "type": "dark",
    "die": "D8",
    "power": "2",
    "effects": [
     "Carta Negra"
    ]
   },
   {
    "name": "Puya Nociva",
    "type": "poison",
    "die": "D6",
    "power": "3",
    "effects": [
     "Veneno 5"
    ]
   }
  ],
  "color": "yellow"
 },
 {
  "id": "072",
  "name": "Tentacool",
  "gen": 1,
  "types": [
   "water",
   "poison"
  ],
  "evolvesTo": [
   "073"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Cuerpo Puro",
  "abilityDesc": "Inmune a N-D6 de movimientos o habilidades de otro pokemon.",
  "captura": "4+",
  "moves": [
   {
    "name": "Hidropulso",
    "type": "water",
    "die": "D6",
    "power": "2",
    "effects": [
     "Confuso 5"
    ]
   },
   {
    "name": "Picotazo Venenoso",
    "type": "poison",
    "die": "D6",
    "power": "1",
    "effects": [
     "Veneno 5"
    ]
   }
  ],
  "color": "pink"
 },
 {
  "id": "073",
  "name": "Tentacruel",
  "gen": 1,
  "types": [
   "water",
   "poison"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Cuerpo Puro",
  "abilityDesc": "Inmune a N-D6 de movimientos o habilidades de otro pokemon.",
  "captura": "7+",
  "moves": [
   {
    "name": "Puya Nociva",
    "type": "poison",
    "die": "D6",
    "power": "3",
    "effects": [
     "Veneno 5"
    ]
   },
   {
    "name": "Supersónico",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "Confuso 3"
    ]
   },
   {
    "name": "Hidrobomba",
    "type": "water",
    "die": "D8",
    "power": "3",
    "effects": []
   }
  ],
  "color": "red"
 },
 {
  "id": "074",
  "name": "Geodude",
  "gen": 1,
  "types": [
   "rock",
   "ground"
  ],
  "evolvesTo": [
   "075"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Robustez",
  "abilityDesc": "Inmune a los efectos de movimientos \"KO\". Si es derrotado en la primera ronda de un combate, aguanta una ronda mas.",
  "captura": "3+",
  "moves": [
   {
    "name": "Rizo Defensa",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "N-D6 +1"
    ]
   },
   {
    "name": "Lanzarrocas",
    "type": "rock",
    "die": "D6",
    "power": "2",
    "effects": []
   }
  ],
  "color": "pink"
 },
 {
  "id": "075",
  "name": "Graveler",
  "gen": 1,
  "types": [
   "rock",
   "ground"
  ],
  "evolvesTo": [
   "076"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Robustez",
  "abilityDesc": "Inmune a los efectos de movimientos \"KO\". Si es derrotado en la primera ronda de un combate, aguanta una ronda mas.",
  "captura": "6+",
  "moves": [
   {
    "name": "Terratemblor",
    "type": "ground",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6 +1"
    ]
   },
   {
    "name": "Autodestrucción",
    "type": "normal",
    "die": "D6",
    "power": "5",
    "effects": [
     "B-KO",
     "Recarga"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "076",
  "name": "Golem",
  "gen": 1,
  "types": [
   "rock",
   "ground"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Robustez",
  "abilityDesc": "Inmune a los efectos de movimientos \"KO\". Si es derrotado en la primera ronda de un combate, aguanta una ronda mas.",
  "captura": "7+",
  "moves": [
   {
    "name": "Terremoto",
    "type": "ground",
    "die": "D6",
    "power": "3",
    "effects": []
   },
   {
    "name": "Autodestrucción",
    "type": "normal",
    "die": "D6",
    "power": "5",
    "effects": [
     "B-KO",
     "Recarga"
    ]
   },
   {
    "name": "Roca Afilada",
    "type": "rock",
    "die": "D6",
    "power": "3",
    "effects": [
     "KO 6"
    ]
   }
  ],
  "color": "red"
 },
 {
  "id": "077",
  "name": "Ponyta",
  "gen": 1,
  "types": [
   "fire"
  ],
  "evolvesTo": [
   "078"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Absorbe Fuego",
  "abilityDesc": "Gana +1 al total, si recibe un ataque de tipo fuego y el resultado en el dado de combate fue 2 o menos",
  "captura": "5+",
  "moves": [
   {
    "name": "Pisotón",
    "type": "normal",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6 +5"
    ]
   },
   {
    "name": "Nitrocarga",
    "type": "fire",
    "die": "D6",
    "power": "2",
    "effects": [
     "Prioridad"
    ]
   }
  ],
  "color": "yellow"
 },
 {
  "id": "078",
  "name": "Rapidash",
  "gen": 1,
  "types": [
   "fire"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Absorbe Fuego",
  "abilityDesc": "Gana +1 al total, si recibe un ataque de tipo fuego y el resultado en el dado de combate fue 2 o menos",
  "captura": "7+",
  "moves": [
   {
    "name": "Derribo",
    "type": "normal",
    "die": "D6",
    "power": "3",
    "effects": [
     "B-KO +3"
    ]
   },
   {
    "name": "Rueda Fuego",
    "type": "fire",
    "die": "D6",
    "power": "3",
    "effects": [
     "Quemado +"
    ]
   },
   {
    "name": "Envite Ígneo",
    "type": "fire",
    "die": "D6",
    "power": "4",
    "effects": [
     "B-KO 5"
    ]
   }
  ],
  "color": "red"
 },
 {
  "id": "079",
  "name": "Slowpoke",
  "gen": 1,
  "types": [
   "water",
   "psychic"
  ],
  "evolvesTo": [
   "080"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf",
   "teleport"
  ],
  "ability": "Ritmo Propio",
  "abilityDesc": "Inmune al estado Confuso y la habilidad Intimidación",
  "captura": "4+",
  "moves": [
   {
    "name": "Bostezo",
    "type": "normal",
    "die": "D6",
    "power": "0*",
    "effects": []
   },
   {
    "name": "Pistola Agua",
    "type": "water",
    "die": "D6",
    "power": "2",
    "effects": []
   },
   {
    "name": "Confusión",
    "type": "psychic",
    "die": "D6",
    "power": "2",
    "effects": [
     "Confuso 6"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "080",
  "name": "Slowbro",
  "gen": 1,
  "types": [
   "water",
   "psychic"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf",
   "teleport"
  ],
  "canMega": true,
  "ability": "Ritmo Propio",
  "abilityDesc": "Inmune al estado Confuso y la habilidad Intimidación",
  "captura": "7+",
  "moves": [
   {
    "name": "Relajo",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "Corazones"
    ]
   },
   {
    "name": "Psíquico",
    "type": "psychic",
    "die": "D6",
    "power": "3",
    "effects": [
     "D6 +6"
    ]
   },
   {
    "name": "Hidropulso",
    "type": "water",
    "die": "D6",
    "power": "2",
    "effects": [
     "Confuso 5"
    ]
   }
  ],
  "color": "red"
 },
 {
  "id": "081",
  "name": "Magnemite",
  "gen": 1,
  "types": [
   "electric",
   "steel"
  ],
  "evolvesTo": [
   "082"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Robustez",
  "abilityDesc": "Inmune a los efectos de movimientos \"KO\". Si es derrotado en la primera ronda de un combate, aguanta una ronda mas.",
  "captura": "4+",
  "moves": [
   {
    "name": "Impactrueno",
    "type": "electric",
    "die": "D6",
    "power": "2",
    "effects": [
     "Parálisis 6"
    ]
   },
   {
    "name": "Supersónico",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "CONFUSO"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "082",
  "name": "Magneton",
  "gen": 1,
  "types": [
   "electric",
   "steel"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Robustez",
  "abilityDesc": "Inmune a los efectos de movimientos \"KO\". Si es derrotado en la primera ronda de un combate, aguanta una ronda mas.",
  "captura": "6+",
  "moves": [
   {
    "name": "Onda Trueno",
    "type": "electric",
    "die": "D6",
    "power": "0",
    "effects": [
     "Parálisis"
    ]
   },
   {
    "name": "Bomba Imán",
    "type": "steel",
    "die": "D6",
    "power": "2",
    "effects": [
     "1 CAMBIO"
    ]
   },
   {
    "name": "Tri-Ataque",
    "type": "normal",
    "die": "D4",
    "power": "2",
    "effects": [
     "Adicional 3"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "083",
  "name": "Farfetch'd",
  "gen": 1,
  "types": [
   "normal",
   "flying"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "fly"
  ],
  "ability": "Vista Lince",
  "abilityDesc": "Siempre acierta sus ataques",
  "captura": "5+",
  "moves": [
   {
    "name": "Cortes Furia",
    "type": "bug",
    "die": "D6",
    "power": "1",
    "effects": [
     "Repetición"
    ]
   },
   {
    "name": "Ataque Ala",
    "type": "flying",
    "die": "D6",
    "power": "2",
    "effects": []
   }
  ],
  "color": "green"
 },
 {
  "id": "084",
  "name": "Doduo",
  "gen": 1,
  "types": [
   "normal",
   "flying"
  ],
  "evolvesTo": [
   "085"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "fly"
  ],
  "ability": "Madrugar",
  "abilityDesc": "Si este Pokemon se duerme, tardará la mitad de turnos en despertarse.",
  "captura": "5+",
  "moves": [
   {
    "name": "Doble Golpe",
    "type": "normal",
    "die": "D4",
    "power": "2",
    "effects": [
     "Add Dice"
    ]
   },
   {
    "name": "Ataque Ala",
    "type": "flying",
    "die": "D6",
    "power": "2",
    "effects": []
   }
  ],
  "color": "blue"
 },
 {
  "id": "085",
  "name": "Dodrio",
  "gen": 1,
  "types": [
   "normal",
   "flying"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "fly"
  ],
  "ability": "Madrugar",
  "abilityDesc": "Si este Pokemon se duerme, tardará la mitad de turnos en despertarse.",
  "captura": "6+",
  "moves": [
   {
    "name": "Tri-Ataque",
    "type": "normal",
    "die": "D4",
    "power": "2",
    "effects": [
     "Adicional 3"
    ]
   }
  ],
  "color": "yellow"
 },
 {
  "id": "086",
  "name": "Seel",
  "gen": 1,
  "types": [
   "water"
  ],
  "evolvesTo": [
   "087"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Hidratación",
  "abilityDesc": "Si la carta Lluvia está en el campo de batalla, es inmune a cualquier estado.",
  "captura": "5+",
  "moves": [
   {
    "name": "Canto Helado",
    "type": "ice",
    "die": "D6",
    "power": "2",
    "effects": [
     "Exclamación"
    ]
   },
   {
    "name": "Golpe Cabeza",
    "type": "normal",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6 +5"
    ]
   },
   {
    "name": "Salmuera",
    "type": "water",
    "die": "D8",
    "power": "2",
    "effects": []
   }
  ],
  "color": "green"
 },
 {
  "id": "087",
  "name": "Dewgong",
  "gen": 1,
  "types": [
   "water",
   "ice"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Hidratación",
  "abilityDesc": "Si la carta Lluvia está en el campo de batalla, es inmune a cualquier estado.",
  "captura": "7+",
  "moves": [
   {
    "name": "Acua Jet",
    "type": "water",
    "die": "D6",
    "power": "2",
    "effects": [
     "Exclamación"
    ]
   },
   {
    "name": "Rayo Hielo",
    "type": "ice",
    "die": "D6",
    "power": "3",
    "effects": [
     "Helado 6"
    ]
   },
   {
    "name": "Velo Sagrado",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "Escudo con picos"
    ]
   }
  ],
  "color": "yellow"
 },
 {
  "id": "088",
  "name": "Grimer",
  "gen": 1,
  "types": [
   "poison"
  ],
  "evolvesTo": [
   "089"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Hedor",
  "abilityDesc": "Si es atacado, el atacante recibe N-D6 (Desventaja)",
  "captura": "5+",
  "moves": [
   {
    "name": "Disparo Lodo",
    "type": "ground",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6 +2"
    ]
   },
   {
    "name": "Tóxico",
    "type": "poison",
    "die": "D6",
    "power": "0",
    "effects": [
     "Veneno"
    ]
   }
  ],
  "color": "yellow"
 },
 {
  "id": "089",
  "name": "Muk",
  "gen": 1,
  "types": [
   "poison"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Hedor",
  "abilityDesc": "Si es atacado, el atacante recibe N-D6 (Desventaja)",
  "captura": "7+",
  "moves": [
   {
    "name": "Puya Nociva",
    "type": "poison",
    "die": "D6",
    "power": "3",
    "effects": [
     "Veneno 5"
    ]
   },
   {
    "name": "Terremoto",
    "type": "ground",
    "die": "D6",
    "power": "3",
    "effects": []
   },
   {
    "name": "Legado",
    "type": "dark",
    "die": "D6",
    "power": "0",
    "effects": [
     "N-3Dice",
     "B-KO"
    ]
   }
  ],
  "color": "red"
 },
 {
  "id": "090",
  "name": "Shellder",
  "gen": 1,
  "types": [
   "water"
  ],
  "evolvesTo": [
   "091"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Caparazón",
  "abilityDesc": "Bloquea golpes críticos, no se acumula",
  "captura": "4+",
  "moves": [
   {
    "name": "Refugio",
    "type": "water",
    "die": "D6",
    "power": "0",
    "effects": [
     "N-D6"
    ]
   },
   {
    "name": "Carámbano",
    "type": "ice",
    "die": "D4",
    "power": "D4 Amarillo",
    "effects": []
   }
  ],
  "color": "green"
 },
 {
  "id": "091",
  "name": "Cloyster",
  "gen": 1,
  "types": [
   "water",
   "ice"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Caparazón",
  "abilityDesc": "Bloquea golpes críticos, no se acumula",
  "captura": "6+",
  "moves": [
   {
    "name": "Chuzos",
    "type": "ice",
    "die": "D6",
    "power": "3",
    "effects": [
     "N-D6 +5"
    ]
   },
   {
    "name": "Protección",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "Escudo"
    ]
   },
   {
    "name": "Hidrobomba",
    "type": "water",
    "die": "D8",
    "power": "3",
    "effects": []
   }
  ],
  "color": "yellow"
 },
 {
  "id": "092",
  "name": "Gastly",
  "gen": 1,
  "types": [
   "ghost",
   "poison"
  ],
  "evolvesTo": [
   "093"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Levitación",
  "abilityDesc": "Inmune a ataques de tipo Tierra",
  "captura": "4+",
  "moves": [
   {
    "name": "Lenguetazo",
    "type": "ghost",
    "die": "D8",
    "power": "1",
    "effects": [
     "Parálisis 5"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "093",
  "name": "Haunter",
  "gen": 1,
  "types": [
   "ghost",
   "poison"
  ],
  "evolvesTo": [
   "094"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Levitación",
  "abilityDesc": "Inmune a ataques de tipo Tierra",
  "captura": "6+",
  "moves": [
   {
    "name": "Puño Sombra",
    "type": "ghost",
    "die": "D6",
    "power": "2",
    "effects": [
     "1 CAMBIO"
    ]
   },
   {
    "name": "Vendetta",
    "type": "dark",
    "die": "D6",
    "power": "2*",
    "effects": []
   }
  ],
  "color": "blue"
 },
 {
  "id": "094",
  "name": "Gengar",
  "gen": 1,
  "types": [
   "ghost",
   "poison"
  ],
  "regions": [
   "kanto"
  ],
  "canMega": true,
  "ability": "Levitación",
  "abilityDesc": "Inmune a ataques de tipo Tierra",
  "captura": "7+",
  "moves": [
   {
    "name": "Bola Sombra",
    "type": "ghost",
    "die": "D6",
    "power": "3",
    "effects": [
     "B-D6 +5"
    ]
   },
   {
    "name": "Pulso Umbrío",
    "type": "dark",
    "die": "D6",
    "power": "3",
    "effects": [
     "N-D6 +5"
    ]
   },
   {
    "name": "Mismo Destino",
    "type": "ghost",
    "die": "D6",
    "power": "0*",
    "effects": []
   }
  ],
  "color": "red"
 },
 {
  "id": "095",
  "name": "Onix",
  "gen": 1,
  "types": [
   "rock",
   "ground"
  ],
  "evolvesTo": [
   "208"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Robustez",
  "abilityDesc": "Inmune a los efectos de movimientos \"KO\". Si es derrotado en la primera ronda de un combate, aguanta una ronda mas.",
  "captura": "4+",
  "moves": [
   {
    "name": "Terratemblor",
    "type": "ground",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6 +1"
    ]
   },
   {
    "name": "Avalancha",
    "type": "rock",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6 +2"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "096",
  "name": "Drowzee",
  "gen": 1,
  "types": [
   "psychic"
  ],
  "evolvesTo": [
   "097"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "teleport"
  ],
  "ability": "Insomnio",
  "abilityDesc": "Este Pokemon no puede quedar Dormido",
  "captura": "4+",
  "moves": [
   {
    "name": "Confusión",
    "type": "psychic",
    "die": "D6",
    "power": "2",
    "effects": [
     "Confuso 4"
    ]
   },
   {
    "name": "Anulación",
    "type": "normal",
    "die": "D6",
    "power": "0*",
    "effects": []
   }
  ],
  "color": "green"
 },
 {
  "id": "097",
  "name": "Hypno",
  "gen": 1,
  "types": [
   "psychic"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "teleport"
  ],
  "ability": "Insomnio",
  "abilityDesc": "Este Pokemon no puede quedar Dormido",
  "captura": "6+",
  "moves": [
   {
    "name": "Hipnosis",
    "type": "psychic",
    "die": "D6",
    "power": "0",
    "effects": [
     "Dormido"
    ]
   },
   {
    "name": "Cabezazo Zen",
    "type": "psychic",
    "die": "D6",
    "power": "3",
    "effects": [
     "N-D6 +5"
    ]
   },
   {
    "name": "Maquinación",
    "type": "dark",
    "die": "D6",
    "power": "0",
    "effects": [
     "B-3Dice"
    ]
   }
  ],
  "color": "yellow"
 },
 {
  "id": "098",
  "name": "Krabby",
  "gen": 1,
  "types": [
   "water"
  ],
  "evolvesTo": [
   "099"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Corte Fuerte",
  "abilityDesc": "Inmune a N-D6 de movimientos o habilidades de otro pokemon.",
  "captura": "4+",
  "moves": [
   {
    "name": "Agarre",
    "type": "normal",
    "die": "D6",
    "power": "2",
    "effects": []
   },
   {
    "name": "Chapoteo Lodo",
    "type": "ground",
    "die": "D6",
    "power": "0*",
    "effects": []
   },
   {
    "name": "Burbuja",
    "type": "water",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6 +6"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "099",
  "name": "Kingler",
  "gen": 1,
  "types": [
   "water"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Corte Fuerte",
  "abilityDesc": "Inmune a N-D6 de movimientos o habilidades de otro pokemon.",
  "captura": "7+",
  "moves": [
   {
    "name": "Disparo Lodo",
    "type": "ground",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6 +2"
    ]
   },
   {
    "name": "Guillotina",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "N-KO 5"
    ]
   },
   {
    "name": "Martillazo",
    "type": "water",
    "die": "D8",
    "power": "3",
    "effects": [
     "D6 +5"
    ]
   }
  ],
  "color": "red"
 },
 {
  "id": "100",
  "name": "Voltorb",
  "gen": 1,
  "types": [
   "electric"
  ],
  "evolvesTo": [
   "101"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Detonación",
  "abilityDesc": "Cuando es debilitado sin usar Autodest. Lanza el efecto KO +6",
  "captura": "4+",
  "moves": [
   {
    "name": "Onda Anómala",
    "type": "electric",
    "die": "D6",
    "power": "0",
    "effects": [
     "N-3Dice"
    ]
   },
   {
    "name": "Autodestrucción",
    "type": "normal",
    "die": "D6",
    "power": "4",
    "effects": [
     "B-KO"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "101",
  "name": "Electrode",
  "gen": 1,
  "types": [
   "electric"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Detonación",
  "abilityDesc": "Cuando es debilitado sin usar Autodest. Lanza el efecto KO +6",
  "captura": "6+",
  "moves": [
   {
    "name": "Rayo Carga",
    "type": "electric",
    "die": "D6",
    "power": "2",
    "effects": [
     "B-D6 +3"
    ]
   },
   {
    "name": "Rapidez",
    "type": "normal",
    "die": "D6",
    "power": "2",
    "effects": [
     "1 CAMBIO"
    ]
   },
   {
    "name": "Explosión",
    "type": "normal",
    "die": "D6",
    "power": "5",
    "effects": [
     "B-KO"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "102",
  "name": "Exeggcute",
  "gen": 1,
  "types": [
   "grass",
   "psychic"
  ],
  "evolvesTo": [
   "103"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Clorofila",
  "abilityDesc": "Gana +1 D6 si la carta de \"Dia Soleado\" está en el campo de batalla.",
  "captura": "5+",
  "moves": [
   {
    "name": "Recurrente",
    "type": "grass",
    "die": "D4",
    "power": "*",
    "effects": [
     "D4 Amarillo"
    ]
   },
   {
    "name": "Hipnosis",
    "type": "psychic",
    "die": "D6",
    "power": "0",
    "effects": [
     "Dormido"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "103",
  "name": "Exeggutor",
  "gen": 1,
  "types": [
   "grass",
   "psychic"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Clorofila",
  "abilityDesc": "Gana +1 D6 si la carta de \"Dia Soleado\" está en el campo de batalla.",
  "captura": "5+",
  "moves": [
   {
    "name": "Confusión",
    "type": "psychic",
    "die": "D6",
    "power": "2",
    "effects": [
     "Confuso 6"
    ]
   },
   {
    "name": "Bomba Huevo",
    "type": "normal",
    "die": "D8",
    "power": "3",
    "effects": []
   },
   {
    "name": "Mazazo",
    "type": "grass",
    "die": "D6",
    "power": "4",
    "effects": [
     "Stat. Down"
    ]
   }
  ],
  "color": "red"
 },
 {
  "id": "104",
  "name": "Cubone",
  "gen": 1,
  "types": [
   "ground"
  ],
  "evolvesTo": [
   "105"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Velo Arena",
  "abilityDesc": "Gana +2 al total, si el resultado del dado de combate fue 2 o menos",
  "captura": "4+",
  "moves": [
   {
    "name": "Arañazo",
    "type": "normal",
    "die": "D6",
    "power": "1",
    "effects": []
   },
   {
    "name": "Hueso Palo",
    "type": "ground",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6 +5"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "105",
  "name": "Marowak",
  "gen": 1,
  "types": [
   "ground"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Velo Arena",
  "abilityDesc": "Gana +2 al total, si el resultado del dado de combate fue 2 o menos",
  "captura": "6+",
  "moves": [
   {
    "name": "Movimiento Sísmico",
    "type": "fighting",
    "die": "D6",
    "power": "*",
    "effects": [
     "Ignore Type"
    ]
   },
   {
    "name": "Huesomerang",
    "type": "ground",
    "die": "D4",
    "power": "3",
    "effects": [
     "Add Dice"
    ]
   },
   {
    "name": "Saña",
    "type": "normal",
    "die": "D4",
    "power": "3",
    "effects": [
     "B-Confuso 2"
    ]
   }
  ],
  "color": "yellow"
 },
 {
  "id": "106",
  "name": "Hitmonlee",
  "gen": 1,
  "types": [
   "fighting"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Flexibilidad",
  "abilityDesc": "Este Pokemon no puede quedar Paralizado",
  "captura": "6+",
  "moves": [
   {
    "name": "Patada Salto",
    "type": "fighting",
    "die": "D6",
    "power": "3",
    "effects": []
   },
   {
    "name": "Patada ígnea",
    "type": "fire",
    "die": "D6",
    "power": "2",
    "effects": [
     "Quemado 3"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "107",
  "name": "Hitmonchan",
  "gen": 1,
  "types": [
   "fighting"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Vista Lince",
  "abilityDesc": "Siempre acierta sus ataques",
  "captura": "6+",
  "moves": [
   {
    "name": "Puño Certero",
    "type": "fighting",
    "die": "D6",
    "power": "4",
    "effects": []
   },
   {
    "name": "Puño Trueno",
    "type": "electric",
    "die": "D6",
    "power": "2",
    "effects": [
     "Parálisis 2"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "108",
  "name": "Lickitung",
  "gen": 1,
  "types": [
   "normal"
  ],
  "evolvesTo": [
   "463"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Ritmo Propio",
  "abilityDesc": "Inmune al estado Confuso y la habilidad Intimidación",
  "captura": "6+",
  "moves": [
   {
    "name": "Descanso",
    "type": "psychic",
    "die": "D6",
    "power": "0",
    "effects": [
     "Revivir"
    ]
   },
   {
    "name": "Doble Filo",
    "type": "normal",
    "die": "D8",
    "power": "3",
    "effects": [
     "B-KO +4"
    ]
   },
   {
    "name": "Rodar",
    "type": "ground",
    "die": "D6",
    "power": "1",
    "effects": [
     "Adicional 4"
    ]
   }
  ],
  "color": "yellow"
 },
 {
  "id": "109",
  "name": "Koffing",
  "gen": 1,
  "types": [
   "poison"
  ],
  "evolvesTo": [
   "110"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Gas Reactivo",
  "abilityDesc": "Mientras esté en el terreno de combate, anula las habilidades de los demás Pokemon activos",
  "captura": "5+",
  "moves": [
   {
    "name": "Gas Venenoso",
    "type": "poison",
    "die": "D6",
    "power": "0",
    "effects": [
     "Veneno 2"
    ]
   },
   {
    "name": "Niebla Clara",
    "type": "poison",
    "die": "D6",
    "power": "1",
    "effects": [
     "B-D6"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "110",
  "name": "Weezing",
  "gen": 1,
  "types": [
   "poison"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Gas Reactivo",
  "abilityDesc": "Mientras esté en el terreno de combate, anula las habilidades de los demás Pokemon activos",
  "captura": "6+",
  "moves": [
   {
    "name": "Residuos",
    "type": "poison",
    "die": "D6",
    "power": "2",
    "effects": [
     "Veneno 3"
    ]
   },
   {
    "name": "Legado",
    "type": "dark",
    "die": "D6",
    "power": "0",
    "effects": [
     "N-3Dice",
     "B-KO"
    ]
   },
   {
    "name": "Autodestrucción",
    "type": "normal",
    "die": "D6",
    "power": "4",
    "effects": [
     "B-KO"
    ]
   }
  ],
  "color": "red"
 },
 {
  "id": "111",
  "name": "Rhyhorn",
  "gen": 1,
  "types": [
   "ground",
   "rock"
  ],
  "evolvesTo": [
   "112"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Velo Arena",
  "abilityDesc": "Gana +2 al total, si el resultado del dado de combate fue 2 o menos",
  "captura": "6+",
  "moves": [
   {
    "name": "Avalancha",
    "type": "rock",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6 +2"
    ]
   },
   {
    "name": "Excavar",
    "type": "ground",
    "die": "D8",
    "power": "2",
    "effects": []
   }
  ],
  "color": "yellow"
 },
 {
  "id": "112",
  "name": "Rhydon",
  "gen": 1,
  "types": [
   "ground",
   "rock"
  ],
  "evolvesTo": [
   "464"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Velo Arena",
  "abilityDesc": "Gana +2 al total, si el resultado del dado de combate fue 2 o menos",
  "captura": "7+",
  "moves": [
   {
    "name": "Terremoto",
    "type": "ground",
    "die": "D6",
    "power": "3",
    "effects": []
   },
   {
    "name": "Megacuerno",
    "type": "bug",
    "die": "D6",
    "power": "3",
    "effects": []
   },
   {
    "name": "Roca Afilada",
    "type": "rock",
    "die": "D6",
    "power": "3",
    "effects": [
     "N-KO 6"
    ]
   }
  ],
  "color": "red"
 },
 {
  "id": "113",
  "name": "Chansey",
  "gen": 1,
  "types": [
   "normal"
  ],
  "evolvesTo": [
   "242"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Cura Natural",
  "abilityDesc": "Se cura cualquier estado al salir de la batalla",
  "captura": "6+",
  "moves": [
   {
    "name": "Descanso",
    "type": "psychic",
    "die": "D6",
    "power": "0",
    "effects": [
     "Revivir"
    ]
   },
   {
    "name": "Luz Lunar",
    "type": "fairy",
    "die": "D6",
    "power": "0",
    "effects": [
     "Corazón"
    ]
   },
   {
    "name": "Bomba Huevo",
    "type": "normal",
    "die": "D6",
    "power": "3",
    "effects": []
   }
  ],
  "color": "yellow"
 },
 {
  "id": "114",
  "name": "Tangela",
  "gen": 1,
  "types": [
   "grass"
  ],
  "evolvesTo": [
   "465"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Clorofila",
  "abilityDesc": "Gana +1 D6 si la carta de \"Dia Soleado\" está en el campo de batalla.",
  "captura": "5+",
  "moves": [
   {
    "name": "Drenadoras",
    "type": "grass",
    "die": "D6",
    "power": "1",
    "effects": [
     "Repetición",
     "Corazón"
    ]
   },
   {
    "name": "Poder Pasado",
    "type": "rock",
    "die": "D6",
    "power": "2",
    "effects": []
   }
  ],
  "color": "blue"
 },
 {
  "id": "115",
  "name": "Kangaskhan",
  "gen": 1,
  "types": [
   "normal"
  ],
  "regions": [
   "kanto"
  ],
  "canMega": true,
  "ability": "Intrépido",
  "abilityDesc": "Alcanza a Pokémon de tipo Fantasma con movimientos de tipo Normal o Lucha. Además, no sufre los efectos de Intimidación.",
  "captura": "6+",
  "moves": [
   {
    "name": "Enfado",
    "type": "dragon",
    "die": "D8",
    "power": "2",
    "effects": [
     "W-Confuso 2"
    ]
   },
   {
    "name": "Movimiento Sísmico",
    "type": "fighting",
    "die": "D6",
    "power": "*",
    "effects": [
     "Ignore Type"
    ]
   },
   {
    "name": "Última Baza",
    "type": "normal",
    "die": "D6",
    "power": "4*",
    "effects": []
   }
  ],
  "color": "yellow"
 },
 {
  "id": "116",
  "name": "Horsea",
  "gen": 1,
  "types": [
   "water"
  ],
  "evolvesTo": [
   "117"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Nado Rápido",
  "abilityDesc": "Gana +1 D6 si la carta de \"Lluvia\" está en el campo de batalla.",
  "captura": "4+",
  "moves": [
   {
    "name": "Pistola Agua",
    "type": "water",
    "die": "D6",
    "power": "2",
    "effects": []
   },
   {
    "name": "Pantalla Humo",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "N-D6"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "117",
  "name": "Seadra",
  "gen": 1,
  "types": [
   "water"
  ],
  "evolvesTo": [
   "230"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Francotirador",
  "abilityDesc": "Gana +2 de fuerza adicional si consigues el resultado mas alto en el dado de combate",
  "captura": "6+",
  "moves": [
   {
    "name": "Ciclón",
    "type": "dragon",
    "die": "D6",
    "power": "2",
    "effects": [
     "N-D6 +5"
    ]
   },
   {
    "name": "Agilidad",
    "type": "psychic",
    "die": "D6",
    "power": "0",
    "effects": [
     "D6 * 3"
    ]
   },
   {
    "name": "Rayo Burbuja",
    "type": "",
    "die": "D8",
    "power": "2",
    "effects": [
     "N-D6 +6"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "118",
  "name": "Goldeen",
  "gen": 1,
  "types": [
   "water"
  ],
  "evolvesTo": [
   "119"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Nado Rápido",
  "abilityDesc": "Gana +1 D6 si la carta de \"Lluvia\" está en el campo de batalla.",
  "captura": "4+",
  "moves": [
   {
    "name": "Picotazo",
    "type": "flying",
    "die": "D8",
    "power": "1",
    "effects": []
   },
   {
    "name": "Hidropulso",
    "type": "water",
    "die": "D6",
    "power": "2",
    "effects": [
     "Confuso 5"
    ]
   },
   {
    "name": "Cornada",
    "type": "normal",
    "die": "D8",
    "power": "2",
    "effects": []
   }
  ],
  "color": "pink"
 },
 {
  "id": "119",
  "name": "Seaking",
  "gen": 1,
  "types": [
   "water"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Nado Rápido",
  "abilityDesc": "Gana +1 D6 si la carta de \"Lluvia\" está en el campo de batalla.",
  "captura": "7+",
  "moves": [
   {
    "name": "Cascada",
    "type": "water",
    "die": "D6",
    "power": "3",
    "effects": [
     "N-D6 +5"
    ]
   },
   {
    "name": "Perforador",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "N-KO 5"
    ]
   },
   {
    "name": "Megacuerdo",
    "type": "bug",
    "die": "D8",
    "power": "3",
    "effects": []
   }
  ],
  "color": "yellow"
 },
 {
  "id": "120",
  "name": "Staryu",
  "gen": 1,
  "types": [
   "water"
  ],
  "evolvesTo": [
   "121"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Cura Natural",
  "abilityDesc": "Se cura cualquier estado al salir de la batalla",
  "captura": "4+",
  "moves": [
   {
    "name": "Rapidez",
    "type": "normal",
    "die": "D6",
    "power": "2",
    "effects": [
     "1 rotación"
    ]
   },
   {
    "name": "Psicoonda",
    "type": "psychic",
    "die": "D6",
    "power": "",
    "effects": [
     "1/2 LVL",
     "Viñeta"
    ]
   },
   {
    "name": "Rayo Burbuja",
    "type": "",
    "die": "D8",
    "power": "2",
    "effects": [
     "N-D6 +6"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "121",
  "name": "Starmie",
  "gen": 1,
  "types": [
   "water",
   "psychic"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Cura Natural",
  "abilityDesc": "Se cura cualquier estado al salir de la batalla",
  "captura": "7+",
  "moves": [
   {
    "name": "Psíquico",
    "type": "psychic",
    "die": "D6",
    "power": "3",
    "effects": [
     "N-D6 +6"
    ]
   },
   {
    "name": "Giro Rápido",
    "type": "normal",
    "die": "D6*2",
    "power": "2",
    "effects": [
     "Viento"
    ]
   },
   {
    "name": "Hidrobomba",
    "type": "water",
    "die": "D8",
    "power": "3",
    "effects": []
   }
  ],
  "color": "yellow"
 },
 {
  "id": "122",
  "name": "Mr. Mime",
  "gen": 1,
  "types": [
   "psychic",
   "fairy"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "teleport"
  ],
  "ability": "Filtro",
  "abilityDesc": "Mitiga el daño que le infligen los movimientos supereficaces, en lugar de +4 hacen +2",
  "captura": "5+",
  "moves": [
   {
    "name": "Barrera",
    "type": "psychic",
    "die": "D6",
    "power": "0",
    "effects": [
     "N-3Dice"
    ]
   },
   {
    "name": "Mimético",
    "type": "normal",
    "die": "D6",
    "power": "*",
    "effects": []
   }
  ],
  "color": "green"
 },
 {
  "id": "123",
  "name": "Scyther",
  "gen": 1,
  "types": [
   "bug",
   "flying"
  ],
  "evolvesTo": [
   "212"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Experto",
  "abilityDesc": "Gana +2 al total, si el resultado del dado de combate fue 2 o menos",
  "captura": "6+",
  "moves": [
   {
    "name": "Cuchillada",
    "type": "normal",
    "die": "D8",
    "power": "2",
    "effects": [
     "B-D6 +5"
    ]
   },
   {
    "name": "Corte Furia",
    "type": "bug",
    "die": "D6",
    "power": "2",
    "effects": [
     "Repetición"
    ]
   },
   {
    "name": "Tajo Umbrío",
    "type": "dark",
    "die": "D8",
    "power": "2",
    "effects": [
     "B-D6 +5"
    ]
   }
  ],
  "color": "yellow"
 },
 {
  "id": "124",
  "name": "Jynx",
  "gen": 1,
  "types": [
   "ice",
   "psychic"
  ],
  "regions": [
   "kanto"
  ],
  "captura": "6+",
  "color": "yellow"
 },
 {
  "id": "125",
  "name": "Electabuzz",
  "gen": 1,
  "types": [
   "electric"
  ],
  "regions": [
   "kanto"
  ],
  "color": "yellow"
 },
 {
  "id": "126",
  "name": "Magmar",
  "gen": 1,
  "types": [
   "fire"
  ],
  "regions": [
   "kanto"
  ],
  "color": "yellow"
 },
 {
  "id": "127",
  "name": "Pinsir",
  "gen": 1,
  "types": [
   "bug"
  ],
  "regions": [
   "kanto"
  ],
  "color": "yellow"
 },
 {
  "id": "128",
  "name": "Tauros",
  "gen": 1,
  "types": [
   "normal"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Intimidación",
  "abilityDesc": "Aplica N-D6 +4 al entrar en combate (solo al inicio, al ser intercambiado o al megaevolucionar)",
  "captura": "6+",
  "moves": [
   {
    "name": "Descanso",
    "type": "psychic",
    "die": "D6",
    "power": "0",
    "effects": [
     "Revivir"
    ]
   },
   {
    "name": "Terremoto",
    "type": "ground",
    "die": "D6",
    "power": "3",
    "effects": []
   },
   {
    "name": "Gigaimpacto",
    "type": "normal",
    "die": "D6",
    "power": "4",
    "effects": [
     "Espera"
    ]
   }
  ],
  "color": "yellow"
 },
 {
  "id": "129",
  "name": "Magikarp",
  "gen": 1,
  "types": [
   "water"
  ],
  "evolvesTo": [
   "130"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Nado Rápido",
  "abilityDesc": "Gana +1 D6 si la carta de \"Lluvia\" está en el campo de batalla.",
  "captura": "4+",
  "moves": [
   {
    "name": "Salpicadura",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": []
   },
   {
    "name": "Placaja",
    "type": "normal",
    "die": "D6",
    "power": "2",
    "effects": []
   }
  ],
  "color": "pink"
 },
 {
  "id": "130",
  "name": "Gyarados",
  "gen": 1,
  "types": [
   "water",
   "flying"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "canMega": true,
  "ability": "Intimidación",
  "abilityDesc": "Aplica N-D6 +4 al entrar en combate (solo al inicio, al ser intercambiado o al megaevolucionar)",
  "captura": "7+",
  "moves": [
   {
    "name": "Hidrobomba",
    "type": "water",
    "die": "D8",
    "power": "3",
    "effects": []
   },
   {
    "name": "Colmillo Hielo",
    "type": "ice",
    "die": "D8",
    "power": "2",
    "effects": [
     "Helado 6"
    ]
   },
   {
    "name": "Hiperrayo",
    "type": "normal",
    "die": "D6",
    "power": "4",
    "effects": [
     "Stat. Down"
    ]
   }
  ],
  "color": "red"
 },
 {
  "id": "131",
  "name": "Lapras",
  "gen": 1,
  "types": [
   "water",
   "ice"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Caparazón",
  "abilityDesc": "Bloquea golpes críticos, no se acumula",
  "captura": "6+",
  "moves": [
   {
    "name": "Canto Helado",
    "type": "ice",
    "die": "D6",
    "power": "2",
    "effects": [
     "Exclamación"
    ]
   },
   {
    "name": "Rayo Confuso",
    "type": "ghost",
    "die": "D6",
    "power": "0",
    "effects": [
     "Confuso"
    ]
   },
   {
    "name": "Hidrobomba",
    "type": "water",
    "die": "D8",
    "power": "3",
    "effects": []
   }
  ],
  "color": "blue"
 },
 {
  "id": "132",
  "name": "Ditto",
  "gen": 1,
  "types": [
   "normal"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Flexibilidad",
  "abilityDesc": "Este Pokemon no puede quedar Paralizado",
  "captura": "6+",
  "moves": [
   {
    "name": "Transformación",
    "type": "normal",
    "die": "D6",
    "power": "0*",
    "effects": []
   }
  ],
  "color": "yellow"
 },
 {
  "id": "133",
  "name": "Eevee",
  "gen": 1,
  "types": [
   "normal"
  ],
  "evolvesTo": [
   "134",
   "135",
   "136"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Adaptable",
  "abilityDesc": "Gana +1 en el total al atacar con movimientos de tipo normal.",
  "captura": "5+",
  "moves": [
   {
    "name": "Látigo",
    "type": "normal",
    "die": "D6",
    "power": "0",
    "effects": [
     "D6 +1"
    ]
   },
   {
    "name": "Última Baza",
    "type": "normal",
    "die": "D6",
    "power": "4*",
    "effects": []
   }
  ],
  "color": "green"
 },
 {
  "id": "134",
  "name": "Vaporeon",
  "gen": 1,
  "types": [
   "water"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "surf"
  ],
  "ability": "Absorbe Agua",
  "abilityDesc": "Inmune a movimientos tipo agua y sus efectos negativos. Si recibe ataque tipo agua gana + 2 en la tirada.",
  "captura": "7+",
  "moves": [
   {
    "name": "Ataque Rápido",
    "type": "normal",
    "die": "D6",
    "power": "2",
    "effects": [
     "Exclamación"
    ]
   },
   {
    "name": "Rayo Aurora",
    "type": "ice",
    "die": "D8",
    "power": "2",
    "effects": [
     "N-D6 +6"
    ]
   },
   {
    "name": "Hidrobomba",
    "type": "water",
    "die": "D8",
    "power": "3",
    "effects": []
   }
  ],
  "color": "yellow"
 },
 {
  "id": "135",
  "name": "Jolteon",
  "gen": 1,
  "types": [
   "electric"
  ],
  "regions": [
   "kanto"
  ],
  "color": "yellow"
 },
 {
  "id": "136",
  "name": "Flareon",
  "gen": 1,
  "types": [
   "fire"
  ],
  "regions": [
   "kanto"
  ],
  "color": "yellow"
 },
 {
  "id": "137",
  "name": "Porygon",
  "gen": 1,
  "types": [
   "normal"
  ],
  "evolvesTo": [
   "233"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "teleport"
  ],
  "ability": "Calco",
  "abilityDesc": "Copia la habilidad del rival al entrar en combate.",
  "captura": "4+",
  "moves": [
   {
    "name": "Poder Pasado",
    "type": "rock",
    "die": "D6",
    "power": "2",
    "effects": []
   },
   {
    "name": "Psicorayo",
    "type": "psychic",
    "die": "D8",
    "power": "2",
    "effects": [
     "Confuso 6"
    ]
   }
  ],
  "color": "green"
 },
 {
  "id": "138",
  "name": "Omanyte",
  "gen": 1,
  "types": [
   "rock",
   "water"
  ],
  "regions": [
   "kanto"
  ],
  "color": "blue"
 },
 {
  "id": "139",
  "name": "Omastar",
  "gen": 1,
  "types": [
   "rock",
   "water"
  ],
  "regions": [
   "kanto"
  ],
  "color": "red"
 },
 {
  "id": "140",
  "name": "Kabuto",
  "gen": 1,
  "types": [
   "rock",
   "water"
  ],
  "regions": [
   "kanto"
  ],
  "color": "blue"
 },
 {
  "id": "141",
  "name": "Kabutops",
  "gen": 1,
  "types": [
   "rock",
   "water"
  ],
  "regions": [
   "kanto"
  ],
  "color": "red"
 },
 {
  "id": "142",
  "name": "Aerodactyl",
  "gen": 1,
  "types": [
   "rock",
   "flying"
  ],
  "regions": [
   "kanto"
  ],
  "color": "yellow"
 },
 {
  "id": "143",
  "name": "Snorlax",
  "gen": 1,
  "types": [
   "normal"
  ],
  "regions": [
   "kanto"
  ],
  "ability": "Sebo",
  "abilityDesc": "Reduce en -2 la potencia de los ataques de tipo Hielo y Fuego que recibe este Pokemon.",
  "captura": "6+",
  "moves": [
   {
    "name": "Puño Dinámico",
    "type": "fighting",
    "die": "D6",
    "power": "3",
    "effects": [
     "D6 +2",
     "Confuso 1"
    ]
   },
   {
    "name": "Descanso",
    "type": "psychic",
    "die": "D6",
    "power": "0",
    "effects": [
     "Revivir"
    ]
   },
   {
    "name": "Gigaimpacto",
    "type": "normal",
    "die": "D6",
    "power": "4",
    "effects": [
     "Espera"
    ]
   }
  ],
  "color": "blue"
 },
 {
  "id": "144",
  "name": "Articuno",
  "gen": 1,
  "types": [
   "ice",
   "flying"
  ],
  "regions": [
   "kanto"
  ],
  "color": "legendary"
 },
 {
  "id": "145",
  "name": "Zapdos",
  "gen": 1,
  "types": [
   "electric",
   "flying"
  ],
  "regions": [
   "kanto"
  ],
  "color": "legendary"
 },
 {
  "id": "146",
  "name": "Moltres",
  "gen": 1,
  "types": [
   "fire",
   "flying"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "fly"
  ],
  "color": "legendary"
 },
 {
  "id": "147",
  "name": "Dratini",
  "gen": 1,
  "types": [
   "dragon"
  ],
  "regions": [
   "kanto"
  ],
  "color": "green"
 },
 {
  "id": "148",
  "name": "Dragonair",
  "gen": 1,
  "types": [
   "dragon"
  ],
  "regions": [
   "kanto"
  ],
  "color": "yellow"
 },
 {
  "id": "149",
  "name": "Dragonite",
  "gen": 1,
  "types": [
   "dragon",
   "flying"
  ],
  "regions": [
   "kanto"
  ],
  "color": "red"
 },
 {
  "id": "150",
  "name": "Mewtwo",
  "gen": 1,
  "types": [
   "psychic"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "teleport"
  ],
  "color": "legendary"
 },
 {
  "id": "151",
  "name": "Mew",
  "gen": 1,
  "types": [
   "psychic"
  ],
  "regions": [
   "kanto"
  ],
  "abilities": [
   "teleport"
  ],
  "color": "legendary"
 },
 {
  "id": "463",
  "name": "Lickilicky",
  "gen": 4,
  "types": [
   "normal"
  ],
  "regions": [
   "sinnoh"
  ],
  "color": "red"
 },
 {
  "id": "025_ash",
  "name": "Pikachu de Ash",
  "gen": 1,
  "types": [
   "electric"
  ],
  "regions": [
   "kanto"
  ],
  "props": [
   "starter"
  ]
 },
 {
  "id": "052_alola",
  "name": "Meowth de Alola",
  "gen": 7,
  "types": [
   "dark"
  ],
  "evolvesTo": [
   "053_alola"
  ],
  "regions": [
   "alola"
  ]
 },
 {
  "id": "052_rocket",
  "name": "Meowth del Team Rocket",
  "gen": 1,
  "types": [
   "normal"
  ],
  "regions": [
   "kanto"
  ],
  "props": [
   "starter"
  ]
 },
 {
  "id": "058_hisui",
  "name": "Growlithe de Hisui",
  "gen": 8,
  "types": [
   "fire",
   "rock"
  ],
  "evolvesTo": [
   "059_hisui"
  ],
  "regions": [
   "hisui"
  ]
 }
];
window.EFFECTS = {
 "1/2lvl": {
  "n": "1/2 LVL",
  "l": "usuario",
  "t": "",
  "d": "La Fuerza de Ataque de este movimiento es igual a la mitad del nivel del usuario (redondeado hacia abajo).",
  "i": "",
  "c": false,
  "k": "1/2 LVL"
 },
 "1cambio": {
  "n": "Cambio de Pokemon",
  "l": "usuario",
  "t": "",
  "d": "Cambia tu Pokémon por otro de tu equipo, pero usa el movimiento elegido para esta ronda de combate.",
  "i": "usuario_cambio_de_pokemon.png",
  "c": false,
  "k": "1 CAMBIO"
 },
 "1rotacion": {
  "n": "1 rotación",
  "l": "",
  "t": "",
  "d": "",
  "i": "",
  "c": false,
  "k": "1 rotación"
 },
 "3dice+6": {
  "n": "Doble Ventaja",
  "l": "usuario",
  "t": "6",
  "d": "Doble Ventaja - Tira 2 dados de ataque extra y descarta los dos resultados más bajos.",
  "i": "usuario_doble_ventaja.png",
  "c": false,
  "k": "3Dice +6"
 },
 "adddice": {
  "n": "2d6 +",
  "l": "usuario",
  "t": "",
  "d": "Tira un dado de ataque extra y suma los resultados.",
  "i": "usuario_2d6.png",
  "c": false,
  "k": "Add Dice"
 },
 "adddice6+4": {
  "n": "2d6 +",
  "l": "usuario",
  "t": "4",
  "d": "Tira un dado de ataque extra y suma los resultados.",
  "i": "usuario_2d6.png",
  "c": false,
  "k": "Add Dice6 +4"
 },
 "adicional3": {
  "n": "Adicional 3",
  "l": "",
  "t": "",
  "d": "",
  "i": "",
  "c": false,
  "k": "Adicional 3"
 },
 "adicional4": {
  "n": "Adicional 4",
  "l": "",
  "t": "",
  "d": "",
  "i": "",
  "c": false,
  "k": "Adicional 4"
 },
 "adicional6": {
  "n": "Adicional 6",
  "l": "",
  "t": "",
  "d": "",
  "i": "",
  "c": false,
  "k": "Adicional 6"
 },
 "b-3dice": {
  "n": "Doble Ventaja",
  "l": "usuario",
  "t": "",
  "d": "Doble Ventaja - Tira 2 dados de ataque extra y descarta los dos resultados más bajos.",
  "i": "usuario_doble_ventaja.png",
  "c": true,
  "k": "B-3Dice"
 },
 "b-confuso": {
  "n": "Confuso",
  "l": "usuario",
  "t": "",
  "d": "El Pokemon gana el estado Confuso.",
  "i": "usuario_confuso.png",
  "c": true,
  "k": "B-Confuso"
 },
 "b-confuso2": {
  "n": "Confuso",
  "l": "usuario",
  "t": "2",
  "d": "El Pokemon gana el estado Confuso.",
  "i": "usuario_confuso.png",
  "c": true,
  "k": "B-Confuso 2"
 },
 "b-confuso3": {
  "n": "Confuso",
  "l": "usuario",
  "t": "3",
  "d": "El Pokemon gana el estado Confuso.",
  "i": "usuario_confuso.png",
  "c": true,
  "k": "B-Confuso 3"
 },
 "b-d6": {
  "n": "Ventaja",
  "l": "usuario",
  "t": "",
  "d": "Ventaja - Tira 1 dado de ataque adicional y descarta el resultado más bajo.",
  "i": "usuario_ventaja.png",
  "c": true,
  "k": "B-D6"
 },
 "b-d6+2": {
  "n": "Ventaja",
  "l": "usuario",
  "t": "2",
  "d": "Ventaja - Tira 1 dado de ataque adicional y descarta el resultado más bajo.",
  "i": "usuario_ventaja.png",
  "c": true,
  "k": "B-D6+2"
 },
 "b-d6+3": {
  "n": "Ventaja",
  "l": "usuario",
  "t": "3",
  "d": "Ventaja - Tira 1 dado de ataque adicional y descarta el resultado más bajo.",
  "i": "usuario_ventaja.png",
  "c": true,
  "k": "B-D6 +3"
 },
 "b-d6+5": {
  "n": "Ventaja",
  "l": "usuario",
  "t": "5",
  "d": "Ventaja - Tira 1 dado de ataque adicional y descarta el resultado más bajo.",
  "i": "usuario_ventaja.png",
  "c": true,
  "k": "B-D6 +5"
 },
 "b-d6+6": {
  "n": "Ventaja",
  "l": "usuario",
  "t": "6",
  "d": "Ventaja - Tira 1 dado de ataque adicional y descarta el resultado más bajo.",
  "i": "usuario_ventaja.png",
  "c": true,
  "k": "B-D6 +6"
 },
 "b-ko": {
  "n": "KO",
  "l": "usuario",
  "t": "",
  "d": "El Pokémon se debilita al final de la ronda.",
  "i": "usuario_ko.png",
  "c": true,
  "k": "B-KO"
 },
 "b-ko+3": {
  "n": "KO",
  "l": "usuario",
  "t": "3",
  "d": "El Pokémon se debilita al final de la ronda.",
  "i": "usuario_ko.png",
  "c": true,
  "k": "B-KO +3"
 },
 "b-ko+4": {
  "n": "KO",
  "l": "usuario",
  "t": "4",
  "d": "El Pokémon se debilita al final de la ronda.",
  "i": "usuario_ko.png",
  "c": true,
  "k": "B-KO +4"
 },
 "b-ko+5": {
  "n": "KO",
  "l": "usuario",
  "t": "5",
  "d": "El Pokémon se debilita al final de la ronda.",
  "i": "usuario_ko.png",
  "c": true,
  "k": "B-KO +5"
 },
 "b-ko5": {
  "n": "KO",
  "l": "usuario",
  "t": "5",
  "d": "El Pokémon se debilita al final de la ronda.",
  "i": "usuario_ko.png",
  "c": true,
  "k": "B-KO 5"
 },
 "cartanegra": {
  "n": "Objeto Bloqueado",
  "l": "rival",
  "t": "",
  "d": "Los Pokémon no pueden hacer uso de su carta adjunta durante el resto del combate o hasta que sean cambiados.",
  "i": "rival_objeto_bloqueado.png",
  "c": false,
  "k": "Carta Negra"
 },
 "confuso": {
  "n": "Confuso",
  "l": "rival",
  "t": "",
  "d": "El Pokémon obtiene el estado Confuso.",
  "i": "rival_confuso.png",
  "c": true,
  "k": "CONFUSO"
 },
 "confuso1": {
  "n": "Confuso",
  "l": "rival",
  "t": "1",
  "d": "El Pokémon obtiene el estado Confuso.",
  "i": "rival_confuso.png",
  "c": true,
  "k": "Confuso 1"
 },
 "confuso3": {
  "n": "Confuso",
  "l": "rival",
  "t": "3",
  "d": "El Pokémon obtiene el estado Confuso.",
  "i": "rival_confuso.png",
  "c": true,
  "k": "Confuso 3"
 },
 "confuso4": {
  "n": "Confuso",
  "l": "rival",
  "t": "4",
  "d": "El Pokémon obtiene el estado Confuso.",
  "i": "rival_confuso.png",
  "c": true,
  "k": "Confuso 4"
 },
 "confuso5": {
  "n": "Confuso",
  "l": "rival",
  "t": "5",
  "d": "El Pokémon obtiene el estado Confuso.",
  "i": "rival_confuso.png",
  "c": true,
  "k": "Confuso 5"
 },
 "confuso6": {
  "n": "Confuso",
  "l": "rival",
  "t": "6",
  "d": "El Pokémon obtiene el estado Confuso.",
  "i": "rival_confuso.png",
  "c": true,
  "k": "Confuso 6"
 },
 "corazon": {
  "n": "Corazón",
  "l": "usuario",
  "t": "",
  "d": "Añade 1/3 de la tirada de Ataque del usuario (redondeando hacia abajo) al total final.",
  "i": "usuario_corazon.png",
  "c": true,
  "k": "Corazón"
 },
 "corazones": {
  "n": "Corazón",
  "l": "usuario",
  "t": "",
  "d": "Añade 1/3 de la tirada de Ataque del usuario (redondeando hacia abajo) al total final.",
  "i": "usuario_corazon.png",
  "c": false,
  "k": "Corazones"
 },
 "d+": {
  "n": "D+",
  "l": "",
  "t": "",
  "d": "",
  "i": "",
  "c": false,
  "k": "D+"
 },
 "d+puno": {
  "n": "D+puño",
  "l": "",
  "t": "",
  "d": "",
  "i": "",
  "c": false,
  "k": "D+puño"
 },
 "d4amarillo": {
  "n": "D4 Amarillo",
  "l": "usuario",
  "t": "",
  "d": "Este movimiento atacará tantas veces como resulte de la primera tirada y tendrá potencia de tanto como salga en una segunda tirada, si sale par es 2 y si sale impar es 1.",
  "i": "usuario_d4_amarillo.png",
  "c": true,
  "k": "D4 Amarillo"
 },
 "d6*3": {
  "n": "D6 * 3",
  "l": "",
  "t": "",
  "d": "",
  "i": "",
  "c": false,
  "k": "D6 * 3"
 },
 "d6+1": {
  "n": "Ventaja",
  "l": "usuario",
  "t": "1",
  "d": "Ventaja - Tira 1 dado de ataque adicional y descarta el resultado más bajo.",
  "i": "usuario_ventaja.png",
  "c": false,
  "k": "D6 +1"
 },
 "d6+2": {
  "n": "Ventaja",
  "l": "usuario",
  "t": "2",
  "d": "Ventaja - Tira 1 dado de ataque adicional y descarta el resultado más bajo.",
  "i": "usuario_ventaja.png",
  "c": false,
  "k": "D6 +2"
 },
 "d6+5": {
  "n": "Ventaja",
  "l": "usuario",
  "t": "5",
  "d": "Ventaja - Tira 1 dado de ataque adicional y descarta el resultado más bajo.",
  "i": "usuario_ventaja.png",
  "c": false,
  "k": "D6 +5"
 },
 "d6+6": {
  "n": "Ventaja",
  "l": "usuario",
  "t": "6",
  "d": "Ventaja - Tira 1 dado de ataque adicional y descarta el resultado más bajo.",
  "i": "usuario_ventaja.png",
  "c": false,
  "k": "D6 +6"
 },
 "domrido": {
  "n": "Dormido",
  "l": "rival",
  "t": "",
  "d": "El Pokémon obtiene el estado Dormido.",
  "i": "rival_dormido.png",
  "c": true,
  "k": "Domrido"
 },
 "dormido": {
  "n": "Dormido",
  "l": "rival",
  "t": "",
  "d": "El Pokémon obtiene el estado Dormido.",
  "i": "rival_dormido.png",
  "c": true,
  "k": "Dormido"
 },
 "escudo": {
  "n": "Protección",
  "l": "usuario",
  "t": "",
  "d": "Esta ronda, la Fuerza de Ataque del movimiento del rival pasa a ser 0 y todos los efectos de movimiento que tengan como objetivo a tu Pokémon son ignorados.",
  "i": "usuario_proteccion.png",
  "c": false,
  "k": "Escudo"
 },
 "escudoconpicos": {
  "n": "Escudo con picos",
  "l": "",
  "t": "",
  "d": "",
  "i": "",
  "c": false,
  "k": "Escudo con picos"
 },
 "espera": {
  "n": "Espera",
  "l": "usuario",
  "t": "",
  "d": "No puede ejecutar este movimiento dos turnos seguidos. Necesita, al menos, un turno de descanso.",
  "i": "usuario_espera.png",
  "c": true,
  "k": "Espera"
 },
 "exclamacion": {
  "n": "Prioridad",
  "l": "usuario",
  "t": "",
  "d": "Cualquier efecto usado por los Pokémon del rival que tenga como objetivo a tu Pokémon se ignora hasta el final de la ronda.",
  "i": "usuario_prioridad.png",
  "c": false,
  "k": "Exclamación"
 },
 "explamacion": {
  "n": "Prioridad",
  "l": "usuario",
  "t": "",
  "d": "Cualquier efecto usado por los Pokémon del rival que tenga como objetivo a tu Pokémon se ignora hasta el final de la ronda.",
  "i": "usuario_prioridad.png",
  "c": false,
  "k": "Explamación"
 },
 "helado6": {
  "n": "Congelado",
  "l": "rival",
  "t": "6",
  "d": "El Pokémon obtiene el estado Congelado.",
  "i": "rival_congelado.png",
  "c": true,
  "k": "Helado 6"
 },
 "ignoretype": {
  "n": "Ignore Type",
  "l": "usuario",
  "t": "",
  "d": "Este movimiento no es efectivo ni débil contra ningún tipo.",
  "i": "usuario_ignore_type.png",
  "c": true,
  "k": "Ignore Type"
 },
 "ko5": {
  "n": "KO",
  "l": "rival",
  "t": "5",
  "d": "El Pokémon se debilita al final de la ronda.",
  "i": "rival_ko.png",
  "c": false,
  "k": "KO 5"
 },
 "ko6": {
  "n": "KO",
  "l": "rival",
  "t": "6",
  "d": "El Pokémon se debilita al final de la ronda.",
  "i": "rival_ko.png",
  "c": false,
  "k": "KO 6"
 },
 "n-3dice": {
  "n": "Doble Desventaja",
  "l": "rival",
  "t": "",
  "d": "Doble desventaja - Tira 2 dados de ataque extra y descarta los dos resultados más altos.",
  "i": "rival_doble_desventaja.png",
  "c": true,
  "k": "N-3Dice"
 },
 "n-d6": {
  "n": "Desventaja",
  "l": "rival",
  "t": "",
  "d": "Desventaja - Tira 1 dado de ataque adicional y descarta el resultado más alto.",
  "i": "rival_desventaja.png",
  "c": true,
  "k": "N-D6"
 },
 "n-d6+1": {
  "n": "Desventaja",
  "l": "rival",
  "t": "1",
  "d": "Desventaja - Tira 1 dado de ataque adicional y descarta el resultado más alto.",
  "i": "rival_desventaja.png",
  "c": true,
  "k": "N-D6 +1"
 },
 "n-d6+2": {
  "n": "Desventaja",
  "l": "rival",
  "t": "2",
  "d": "Desventaja - Tira 1 dado de ataque adicional y descarta el resultado más alto.",
  "i": "rival_desventaja.png",
  "c": true,
  "k": "N-D6 +2"
 },
 "n-d6+3": {
  "n": "Desventaja",
  "l": "rival",
  "t": "3",
  "d": "Desventaja - Tira 1 dado de ataque adicional y descarta el resultado más alto.",
  "i": "rival_desventaja.png",
  "c": true,
  "k": "N-D6 +3"
 },
 "n-d6+4": {
  "n": "Desventaja",
  "l": "rival",
  "t": "4",
  "d": "Desventaja - Tira 1 dado de ataque adicional y descarta el resultado más alto.",
  "i": "rival_desventaja.png",
  "c": true,
  "k": "N-D6 +4"
 },
 "n-d6+5": {
  "n": "Desventaja",
  "l": "rival",
  "t": "5",
  "d": "Desventaja - Tira 1 dado de ataque adicional y descarta el resultado más alto.",
  "i": "rival_desventaja.png",
  "c": true,
  "k": "N-D6 +5"
 },
 "n-d6+6": {
  "n": "Desventaja",
  "l": "rival",
  "t": "6",
  "d": "Desventaja - Tira 1 dado de ataque adicional y descarta el resultado más alto.",
  "i": "rival_desventaja.png",
  "c": true,
  "k": "N-D6 +6"
 },
 "n-ko+5": {
  "n": "KO",
  "l": "rival",
  "t": "5",
  "d": "El Pokémon se debilita al final de la ronda.",
  "i": "rival_ko.png",
  "c": true,
  "k": "N-KO +5"
 },
 "n-ko5": {
  "n": "KO",
  "l": "rival",
  "t": "5",
  "d": "El Pokémon se debilita al final de la ronda.",
  "i": "rival_ko.png",
  "c": true,
  "k": "N-KO 5"
 },
 "n-ko6": {
  "n": "KO",
  "l": "rival",
  "t": "6",
  "d": "El Pokémon se debilita al final de la ronda.",
  "i": "rival_ko.png",
  "c": true,
  "k": "N-KO 6"
 },
 "norepite": {
  "n": "Espera",
  "l": "usuario",
  "t": "",
  "d": "No puede ejecutar este movimiento dos turnos seguidos. Necesita, al menos, un turno de descanso.",
  "i": "usuario_espera.png",
  "c": false,
  "k": "No repite"
 },
 "paralisis": {
  "n": "Paralizado",
  "l": "rival",
  "t": "",
  "d": "El Pokémon obtiene el estado Paralizado.",
  "i": "rival_paralizado.png",
  "c": true,
  "k": "Parálisis"
 },
 "paralisis+5": {
  "n": "Paralizado",
  "l": "rival",
  "t": "5",
  "d": "El Pokémon obtiene el estado Paralizado.",
  "i": "rival_paralizado.png",
  "c": true,
  "k": "Parálisis +5"
 },
 "paralisis+6": {
  "n": "Paralizado",
  "l": "rival",
  "t": "6",
  "d": "El Pokémon obtiene el estado Paralizado.",
  "i": "rival_paralizado.png",
  "c": true,
  "k": "Parálisis +6"
 },
 "paralisis2": {
  "n": "Paralizado",
  "l": "rival",
  "t": "2",
  "d": "El Pokémon obtiene el estado Paralizado.",
  "i": "rival_paralizado.png",
  "c": true,
  "k": "Parálisis 2"
 },
 "paralisis4+": {
  "n": "Paralizado",
  "l": "rival",
  "t": "4",
  "d": "El Pokémon obtiene el estado Paralizado.",
  "i": "rival_paralizado.png",
  "c": true,
  "k": "Parálisis 4+"
 },
 "paralisis5": {
  "n": "Paralizado",
  "l": "rival",
  "t": "5",
  "d": "El Pokémon obtiene el estado Paralizado.",
  "i": "rival_paralizado.png",
  "c": true,
  "k": "Parálisis 5"
 },
 "paralisis6": {
  "n": "Paralizado",
  "l": "rival",
  "t": "6",
  "d": "El Pokémon obtiene el estado Paralizado.",
  "i": "rival_paralizado.png",
  "c": true,
  "k": "Parálisis 6"
 },
 "paralizado3": {
  "n": "Paralizado",
  "l": "rival",
  "t": "3",
  "d": "El Pokémon obtiene el estado Paralizado.",
  "i": "rival_paralizado.png",
  "c": true,
  "k": "Paralizado 3"
 },
 "paralizado5": {
  "n": "Paralizado",
  "l": "rival",
  "t": "5",
  "d": "El Pokémon obtiene el estado Paralizado.",
  "i": "rival_paralizado.png",
  "c": true,
  "k": "Paralizado 5"
 },
 "prioridad": {
  "n": "Prioridad",
  "l": "usuario",
  "t": "",
  "d": "Cualquier efecto usado por los Pokémon del rival que tenga como objetivo a tu Pokémon se ignora hasta el final de la ronda.",
  "i": "usuario_prioridad.png",
  "c": true,
  "k": "Prioridad"
 },
 "proteccion": {
  "n": "Protección",
  "l": "usuario",
  "t": "",
  "d": "Esta ronda, la Fuerza de Ataque del movimiento del rival pasa a ser 0 y todos los efectos de movimiento que tengan como objetivo a tu Pokémon son ignorados.",
  "i": "usuario_proteccion.png",
  "c": true,
  "k": "Protección"
 },
 "quemado+": {
  "n": "Quemado",
  "l": "rival",
  "t": "",
  "d": "El Pokémon obtiene el estado Quemado.",
  "i": "rival_quemado.png",
  "c": false,
  "k": "Quemado +"
 },
 "quemado3": {
  "n": "Quemado",
  "l": "rival",
  "t": "3",
  "d": "El Pokémon obtiene el estado Quemado.",
  "i": "rival_quemado.png",
  "c": true,
  "k": "Quemado 3"
 },
 "quemado5": {
  "n": "Quemado",
  "l": "rival",
  "t": "5",
  "d": "El Pokémon obtiene el estado Quemado.",
  "i": "rival_quemado.png",
  "c": true,
  "k": "Quemado 5"
 },
 "quemado6": {
  "n": "Quemado",
  "l": "rival",
  "t": "6",
  "d": "El Pokémon obtiene el estado Quemado.",
  "i": "rival_quemado.png",
  "c": true,
  "k": "Quemado 6"
 },
 "recarga": {
  "n": "Recarga",
  "l": "usuario",
  "t": "",
  "d": "Una vez utilizado, este movimiento no se puede volver a utilizar durante el resto de la batalla o hasta que el Pokemon sea cambiado.",
  "i": "usuario_recarga.png",
  "c": true,
  "k": "Recarga"
 },
 "reflejo": {
  "n": "Rebote",
  "l": "usuario",
  "t": "",
  "d": "Añade la Fuerza de Ataque del movimiento seleccionado del oponente a este movimiento.",
  "i": "usuario_rebote.png",
  "c": false,
  "k": "Reflejo"
 },
 "repeticion": {
  "n": "Repetición",
  "l": "usuario",
  "t": "",
  "d": "La Fuerza de Ataque de este movimiento aumenta en 1 por cada ronda sucesiva en la que se haya utilizado en esta batalla.",
  "i": "usuario_repeticion.png",
  "c": true,
  "k": "Repetición"
 },
 "revivir": {
  "n": "Revivir",
  "l": "usuario",
  "t": "",
  "d": "Revive a un Pokémon del equipo del usuario inmediatamente después de la tirada de efecto. Solo se puede revivir a un Pokémon por combate y equipo.",
  "i": "usuario_revivir.png",
  "c": true,
  "k": "Revivir"
 },
 "stat.down": {
  "n": "Stat. Down",
  "l": "usuario",
  "t": "",
  "d": "A partir del siguiente asalto, el Pokémon gana Desventaja hasta el final de la batalla (o hasta que sea cambiado).",
  "i": "usuario_stat_down.png",
  "c": true,
  "k": "Stat. Down"
 },
 "veneno": {
  "n": "Envenenado",
  "l": "rival",
  "t": "",
  "d": "El Pokémon obtiene el estado Envenenado.",
  "i": "rival_envenenado.png",
  "c": true,
  "k": "Veneno"
 },
 "veneno2": {
  "n": "Envenenado",
  "l": "rival",
  "t": "2",
  "d": "El Pokémon obtiene el estado Envenenado.",
  "i": "rival_envenenado.png",
  "c": true,
  "k": "Veneno 2"
 },
 "veneno3": {
  "n": "Envenenado",
  "l": "rival",
  "t": "3",
  "d": "El Pokémon obtiene el estado Envenenado.",
  "i": "rival_envenenado.png",
  "c": true,
  "k": "Veneno 3"
 },
 "veneno5": {
  "n": "Envenenado",
  "l": "rival",
  "t": "5",
  "d": "El Pokémon obtiene el estado Envenenado.",
  "i": "rival_envenenado.png",
  "c": true,
  "k": "Veneno 5"
 },
 "viento": {
  "n": "Viento",
  "l": "",
  "t": "",
  "d": "",
  "i": "",
  "c": false,
  "k": "Viento"
 },
 "vineta": {
  "n": "Viñeta",
  "l": "",
  "t": "",
  "d": "",
  "i": "",
  "c": false,
  "k": "Viñeta"
 },
 "w-confuso2": {
  "n": "Confuso",
  "l": "usuario",
  "t": "2",
  "d": "El Pokemon gana el estado Confuso.",
  "i": "usuario_confuso.png",
  "c": true,
  "k": "W-Confuso 2"
 }
};
