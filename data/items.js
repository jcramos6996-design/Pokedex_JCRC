/* Cartas de objeto (46). Textos copiados de las cartas.
   kind: ball (captura) · action (acción: se usa y se tira) · equip (equipamiento: se une a un Pokémon) · perm (permanente)
   img: assets/objetos/<img>.webp (grande) y <img>_s.webp (miniatura)
   ballId: id de la tabla BALLS de captura.js
   use (acciones): 'revive' | 'revive4' | 'level' | 'cure' | 'info'  → lo que automatiza la Mochila */
window.ITEMS = [
 /* --- Captura --- */
 {id:'pokeball',name:'Poké Ball',kind:'ball',img:'pokeball',ballId:'poke',text:'+1 a la tirada de captura.'},
 {id:'superball',name:'Super Ball',kind:'ball',img:'superball',ballId:'super',text:'+2 a la tirada de captura.'},
 {id:'ultra_ball',name:'Ultra Ball',kind:'ball',img:'ultra_ball',ballId:'ultra',text:'+3 a la tirada de captura.'},
 {id:'master_ball',name:'Master Ball',kind:'ball',img:'master_ball',ballId:'master',text:'Captura automática.'},
 {id:'rapid_ball',name:'Rapid Ball',kind:'ball',img:'rapid_ball',ballId:'rapid',text:'Si fallas, puedes repetir la tirada de captura.'},
 {id:'safari_ball',name:'Safari Ball',kind:'ball',img:'safari_ball',ballId:'safari',text:'+1 (+2 si es de clase Amarilla).'},
 {id:'sana_ball',name:'Sana Ball',kind:'ball',img:'sana_ball',ballId:'sana',text:'Si capturas, revive a un Pokémon de tu equipo.'},
 {id:'turno_ball',name:'Turno Ball',kind:'ball',img:'turno_ball',ballId:'turno',text:'+1 (+3 si la batalla duró más de 1 ronda).'},
 {id:'veloz_ball',name:'Veloz Ball',kind:'ball',img:'veloz_ball',ballId:'veloz',text:'+1 (+3 si no has combatido contra él).'},
 {id:'acopio_ball',name:'Acopio Ball',kind:'ball',img:'acopio_ball',ballId:'acopio',text:'+1 (+3 si tienes uno de su tipo en el equipo).'},
 {id:'amigo_ball',name:'Amigo Ball',kind:'ball',img:'amigo_ball',ballId:'amigo',text:'El Pokémon capturado gana 1 nivel.'},
 {id:'buceo_ball',name:'Buceo Ball',kind:'ball',img:'buceo_ball',ballId:'buceo',text:'+1 (+3 en zona de Surf).'},
 {id:'gloria_ball',name:'Gloria Ball',kind:'ball',img:'gloria_ball',ballId:'gloria',text:'Se tira un D8 con +2.'},
 {id:'love_ball',name:'Love Ball',kind:'ball',img:'love_ball',ballId:'amor',text:'Si capturas, roba una carta de objeto.'},
 {id:'lujo_ball',name:'Lujo Ball',kind:'ball',img:'lujo_ball',ballId:'lujo',text:'+2. Si capturas, el Pokémon sube 1 nivel.'},
 {id:'nido_ball',name:'Nido Ball',kind:'ball',img:'nido_ball',ballId:'nido',text:'+1 (+3 si es de nivel 3 o menos).'},
 {id:'nivel_ball',name:'Nivel Ball',kind:'ball',img:'nivel_ball',ballId:'nivel',text:'+1 (+3 si luchaste con un Pokémon de nivel superior).'},
 {id:'ocaso_ball',name:'Ocaso Ball',kind:'ball',img:'ocaso_ball',ballId:'ocaso',text:'+1 (+3 con un número par de medallas).'},
 {id:'peso_ball',name:'Peso Ball',kind:'ball',img:'peso_ball',ballId:'peso',text:'+1 (+3 si es un Pokémon evolucionado).'},
 /* --- Acción --- */
 {id:'revivir',name:'Revivir',kind:'action',img:'revivir',use:'revive',text:'Revive a un Pokémon de tu equipo.'},
 {id:'max_revivir',name:'Max Revivir',kind:'action',img:'max_revivir',use:'revive4',text:'Revive hasta 4 Pokémon de tu equipo.'},
 {id:'cura_total',name:'Cura Total',kind:'action',img:'cura_total',use:'cure',text:'Elimina una condición de estado de 1 de tus Pokémon.'},
 {id:'caramelo_raro',name:'Caramelo Raro',kind:'action',img:'caramelo_raro',use:'level',text:'Sube un nivel de un Pokémon de tu equipo.'},
 {id:'bicicleta',name:'Bicicleta',kind:'action',img:'bicicleta',use:'info',text:'Puedes jugar esta carta después de tirar el dado de movimiento. Duplica el resultado y podrás terminar tu movimiento en cualquier casilla en la que entres.'},
 {id:'deportivas',name:'Deportivas',kind:'action',img:'deportivas',use:'info',text:'Puedes jugar esta carta después de tirar el dado de movimiento para sumar 1 o 2 a tu tirada de movimiento.'},
 {id:'cuerda_huida',name:'Cuerda Huida',kind:'action',img:'cuerda_huida',use:'info',text:'Mueve tu ficha de entrenador al mismo espacio que tu ficha de hogar actual. Tu fase de movimiento no se ve afectada.'},
 {id:'bonguri',name:'Bonguri',kind:'action',img:'bonguri',use:'info',draw:3,text:'Toma 3 cartas del mazo de objetos. Añade 1 a tu mano y coloca el resto en la parte inferior del mazo.'},
 {id:'tesoro',name:'Tesoro',kind:'action',img:'tesoro',use:'info',draw:2,text:'Mientras estés en un espacio de ciudad o en la Poké Tienda, puedes jugar esta carta para robar 2 objetos.'},
 {id:'pokeradar',name:'PokéRadar',kind:'action',img:'pokeradar',use:'info',text:'Busca cualquier Pokémon del color de la casilla en la que te encuentres y comienza un combate para capturar el Pokémon. Esta acción no afecta a las fases de tu turno.'},
 {id:'repelente',name:'Repelente',kind:'action',img:'repelente',use:'info',text:'Cuando reveles un Pokémon salvaje, puedes jugar esta carta para robar 2 fichas más del mismo color y sustituir el Pokémon revelado por cualquiera de ellas.'},
 {id:'flauta_negra',name:'Flauta Negra',kind:'action',img:'flauta_negra',use:'info',text:'Puedes jugar esta carta al comienzo de un combate salvaje para aumentar el nivel del Pokémon salvaje y que coincida con el nivel de tu Pokémon activo. Su nivel vuelve a la normalidad al final del combate.'},
 /* --- Equipamiento --- */
 {id:'restos',name:'Restos',kind:'equip',img:'restos',text:'Una vez por combate, puedes volver a tirar el dado del ataque del Pokémon adjunto. Si lo haces, resta 1 de su total.',auto:'Recordatorio en combate (repite el dado con «dado físico» y −1 con el ajuste manual)'},
 {id:'baya',name:'Baya',kind:'equip',img:'baya',text:'Descarta esta carta para eliminar una condición de estado del Pokémon al que está unida o para volver a tirar su dado de ataque.',auto:'Botón «Quitar un estado» en la Mochila'},
 {id:'vitamina',name:'Vitamina',kind:'equip',img:'vitamina',text:'Añade 1 al resultado final de la tirada de ataque del Pokémon equipado.',auto:'Automático en combate (+1 al total)'},
 {id:'telescopio',name:'Telescopio',kind:'equip',img:'telescopio',text:'Los movimientos utilizados por el Pokémon equipado obtienen Ventaja 5+. Si ya tienen un movimiento que puede causar ventaja, reduce el valor de activación en 1.',auto:'Automático en combate'},
 {id:'roca_del_rey',name:'Roca del Rey',kind:'equip',img:'roca_del_rey',text:'Los movimientos utilizados por el Pokémon equipado obtienen Desventaja 5+ (al rival). Si ya tienen un movimiento que puede causar desventaja, reduce el valor de activación en 1.',auto:'Automático en combate'},
 {id:'garra_afilada',name:'Garra Afilada',kind:'equip',img:'garra_afilada',text:'Mejora los dados de ataque utilizados para este movimiento en esta ronda de combate (D4 → D6, D6 → D8).',auto:'Casilla al elegir ataque'},
 {id:'garra_rapida',name:'Garra Rápida',kind:'equip',img:'garra_rapida',text:'Una vez por combate, al seleccionar un movimiento, puedes otorgar Prioridad al Pokémon vinculado para esta ronda de combate.',auto:'Casilla al elegir ataque (1 vez por combate)'},
 {id:'mineral_evolutivo',name:'Mineral Evolutivo',kind:'equip',img:'mineral_evolutivo',text:'Una vez por combate, al seleccionar un movimiento, puedes dar Desventaja al Pokémon rival para esta ronda de combate si el Pokémon adjunto no está completamente evolucionado.',auto:'Casilla al elegir ataque (1 vez por combate)'},
 {id:'lupa',name:'Lupa',kind:'equip',img:'lupa',text:'Antes de tirar el dado de efecto, puedes optar por sumar 1 a la tirada del dado de efecto del Pokémon equipado. Esto no se puede utilizar para movimientos KO.',auto:'Casilla al elegir ataque'},
 {id:'pocion_maxima',name:'Poción Máxima',kind:'equip',img:'pocion_maxima',text:'Si el Pokémon adjunto queda fuera de combate, descarta esta carta y revívelo inmediatamente. También puedes descartar esta carta de tu mano para revivir un Pokémon en cualquier momento.',auto:'Botón «Usar» en la Mochila'},
 {id:'repartir_exp',name:'Repartir Exp',kind:'equip',img:'repartir_exp',text:'Cuando un Pokémon de tu equipo suba de nivel en combate, si ese Pokémon tiene un nivel superior al del Pokémon adjunto, coloca un contador en esta carta. Cuando tenga 3 contadores, retíralos todos y dale un nivel al Pokémon adjunto.',auto:'Contador 0-3 en la Mochila'},
 {id:'huevo_suerte',name:'Huevo Suerte',kind:'equip',img:'huevo_suerte',text:'Cuando este Pokémon suba de nivel en combate, tira un D6. Si sale un 6, tu Pokémon sube un nivel adicional.',auto:'Botón «Subió de nivel» en la Mochila (tira el dado)'},
 {id:'amuleto',name:'Amuleto',kind:'equip',img:'amuleto',text:'Cuando consigas cartas de objeto como recompensa de combate, si el Pokémon equipado participó en el combate, puedes robar un objeto adicional del mazo de objetos (no se roba de otros jugadores).',auto:'Recordatorio'},
 /* --- Permanentes --- */
 {id:'poke_flauta',name:'Poké Flauta',kind:'perm',img:'poke_flauta',text:'Puedes pasar por las casillas Catch\'em con una ficha de Snorlax. Cada vez que uno de tus Pokémon entre en estado de sueño, puedes tirar inmediatamente un D4. Si sale un 4, descarta el estado.',auto:'La app te ofrece tirar el D4 cuando un Pokémon se duerme'},
 {id:'ss_anne_ticket',name:'SS Anne Ticket',kind:'perm',img:'ss_anne_ticket',text:'Ahora puedes coger el ferry SS Anne.'}
];
window.ITEM_KINDS = { ball: 'Captura', action: 'Acción', equip: 'Equipamiento', perm: 'Permanentes' };
