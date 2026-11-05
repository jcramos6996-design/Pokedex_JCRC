/* ============================================================
   Datos de la Tarjeta de Entrenador: regiones, gimnasios (medallas) y ciudades.
   Puedes editarlo a mano: añade regiones, cambia nombres o el orden.
   - id debe ser único y sin espacios (se guarda en el móvil de cada jugador; si lo cambias
     después, las medallas y ciudades marcadas con el id anterior se pierden).
   - icon: cualquier emoji.
   ============================================================ */
window.TRAINER_CONFIG = {
  regions: [
    {
      id: 'kanto', name: 'Kanto', league: 'Liga Pokémon · Meseta Añil',
      gyms: [
        { id: 'roca',     medal: 'Medalla Roca',     leader: 'Brock',           city: 'Ciudad Plateada', icon: '🪨' },
        { id: 'cascada',  medal: 'Medalla Cascada',  leader: 'Misty',           city: 'Ciudad Celeste',  icon: '💧' },
        { id: 'trueno',   medal: 'Medalla Trueno',   leader: 'Teniente Surge',  city: 'Ciudad Carmín',   icon: '⚡' },
        { id: 'arcoiris', medal: 'Medalla Arcoíris', leader: 'Erika',           city: 'Ciudad Azulona',  icon: '🌈' },
        { id: 'alma',     medal: 'Medalla Alma',     leader: 'Koga',            city: 'Ciudad Fucsia',   icon: '☠️' },
        { id: 'pantano',  medal: 'Medalla Pantano',  leader: 'Sabrina',         city: 'Ciudad Azafrán',  icon: '🔮' },
        { id: 'volcan',   medal: 'Medalla Volcán',   leader: 'Blaine',          city: 'Isla Canela',     icon: '🌋' },
        { id: 'tierra',   medal: 'Medalla Tierra',   leader: 'Giovanni',        city: 'Ciudad Verde',    icon: '🌍' }
      ],
      cities: [
        { id: 'paleta',   name: 'Pueblo Paleta' },
        { id: 'verde',    name: 'Ciudad Verde' },
        { id: 'plateada', name: 'Ciudad Plateada' },
        { id: 'celeste',  name: 'Ciudad Celeste' },
        { id: 'carmin',   name: 'Ciudad Carmín' },
        { id: 'lavanda',  name: 'Pueblo Lavanda' },
        { id: 'azulona',  name: 'Ciudad Azulona' },
        { id: 'azafran',  name: 'Ciudad Azafrán' },
        { id: 'fucsia',   name: 'Ciudad Fucsia' },
        { id: 'canela',   name: 'Isla Canela' },
        { id: 'meseta',   name: 'Meseta Añil' }
      ]
    },
    {
      id: 'johto', name: 'Johto', league: 'Liga Pokémon · Meseta Añil',
      gyms: [
        { id: 'cefiro',   medal: 'Medalla Céfiro',   leader: 'Falkner',  city: 'Ciudad Cerezo',   icon: '🪽' },
        { id: 'colmena',  medal: 'Medalla Colmena',  leader: 'Bugsy',    city: 'Pueblo Azalea',   icon: '🐝' },
        { id: 'llanura',  medal: 'Medalla Llanura',  leader: 'Whitney',  city: 'Ciudad Trigal',   icon: '🐄' },
        { id: 'niebla',   medal: 'Medalla Niebla',   leader: 'Morty',    city: 'Ciudad Iris',     icon: '👻' },
        { id: 'tormenta', medal: 'Medalla Tormenta', leader: 'Chuck',    city: 'Ciudad Cian',     icon: '🥊' },
        { id: 'mineral',  medal: 'Medalla Mineral',  leader: 'Jasmine',  city: 'Ciudad Olivo',    icon: '🔩' },
        { id: 'glaciar',  medal: 'Medalla Glaciar',  leader: 'Pryce',    city: 'Pueblo Caoba',    icon: '❄️' },
        { id: 'ascenso',  medal: 'Medalla Ascenso',  leader: 'Clair',    city: 'Ciudad Endrino',  icon: '🐉' }
      ],
      cities: [
        { id: 'primavera', name: 'Pueblo Primavera' },
        { id: 'cerezo',    name: 'Ciudad Cerezo' },
        { id: 'malva',     name: 'Ciudad Malva' },
        { id: 'azalea',    name: 'Pueblo Azalea' },
        { id: 'trigal',    name: 'Ciudad Trigal' },
        { id: 'iris',      name: 'Ciudad Iris' },
        { id: 'olivo',     name: 'Ciudad Olivo' },
        { id: 'orquidea',  name: 'Ciudad Orquídea' },
        { id: 'cian',      name: 'Ciudad Cian' },
        { id: 'caoba',     name: 'Pueblo Caoba' },
        { id: 'endrino',   name: 'Ciudad Endrino' }
      ]
    }
  ]
};
