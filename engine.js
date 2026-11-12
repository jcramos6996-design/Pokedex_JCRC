/* ============================================================
   Motor de combate (sin pantalla): reglas, cálculo de rondas y estado del combate.
   Se usa desde el navegador (window.PMTU_ENGINE) y desde Node (para pruebas).

   Reglas implementadas (según el ejemplo del juego):
   1. Cada entrenador elige ataque en secreto y tira el dado de ese ataque a la vez.
   2. Total = Nivel + Potencia + Dado ± Tipo (×2=+2, ×4=+4, ×½=−2, ×¼=−4) + Habilidad
              + Estados (Quemado −1) + ajuste manual.
   3. Gana la ronda el total más alto. Un Pokémon gana el duelo con 2 rondas ganadas.
   4. Tras la ronda se resuelven los efectos: un efecto con número se activa si el dado
      natural sacado es igual o superior a ese número.
   5. Combate de entrenadores: 3 duelos (1 vs 1, 2 vs 2, 3 vs 3); gana quien gane 2.
   ============================================================ */
(function (root) {
'use strict';
const E = {};

/* ---------- Tabla de tipos: ATK[atacante][defensor] = multiplicador (solo los distintos de 1) ---------- */
const ATK = {
  normal: { rock: .5, ghost: 0, steel: .5 },
  fire: { fire: .5, water: .5, grass: 2, ice: 2, bug: 2, rock: .5, dragon: .5, steel: 2 },
  water: { fire: 2, water: .5, grass: .5, ground: 2, rock: 2, dragon: .5 },
  electric: { water: 2, electric: .5, grass: .5, ground: 0, flying: 2, dragon: .5 },
  grass: { fire: .5, water: 2, grass: .5, poison: .5, ground: 2, flying: .5, bug: .5, rock: 2, dragon: .5, steel: .5 },
  ice: { fire: .5, water: .5, grass: 2, ice: .5, ground: 2, flying: 2, dragon: 2, steel: .5 },
  fighting: { normal: 2, ice: 2, poison: .5, flying: .5, psychic: .5, bug: .5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: .5 },
  poison: { grass: 2, poison: .5, ground: .5, rock: .5, ghost: .5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: .5, poison: 2, flying: 0, bug: .5, rock: 2, steel: 2 },
  flying: { electric: .5, grass: 2, fighting: 2, bug: 2, rock: .5, steel: .5 },
  psychic: { fighting: 2, poison: 2, psychic: .5, dark: 0, steel: .5 },
  bug: { fire: .5, grass: 2, fighting: .5, poison: .5, flying: .5, psychic: 2, ghost: .5, dark: 2, steel: .5, fairy: .5 },
  rock: { fire: 2, ice: 2, fighting: .5, ground: .5, flying: 2, bug: 2, steel: .5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: .5 },
  dragon: { dragon: 2, steel: .5, fairy: 0 },
  dark: { fighting: .5, psychic: 2, ghost: 2, dark: .5, fairy: .5 },
  steel: { fire: .5, water: .5, electric: .5, ice: 2, rock: 2, steel: .5, fairy: 2 },
  fairy: { fire: .5, fighting: 2, poison: .5, dragon: 2, dark: 2, steel: .5 }
};
E.ATK = ATK;
E.mult = (atk, defTypes) => {
  let m = 1;
  (defTypes || []).forEach(d => { const v = ATK[atk] && ATK[atk][d]; m *= v === undefined ? 1 : v; });
  return m;
};

/* ---------- Configuración editable ---------- */
// Modificador al total por estado (solo Quemado está definido en las reglas conocidas)
E.STATUS_MOD = { quemado: -1 };
E.MAX_ROUNDS_WIN = 2;      // rondas para ganar un duelo
E.MAX_DUEL_WIN = 2;        // duelos para ganar el combate
E.IMMUNE_MODES = { falla: 'El ataque falla (total 0)', menos4: 'Cuenta como −4', ignorar: 'Se ignora' };

/* ---------- Utilidades ---------- */
const norm = s => String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const key = s => norm(s).replace(/\s+/g, '');
const other = s => (s === 'A' ? 'B' : 'A');
const clone = o => JSON.parse(JSON.stringify(o));
E.other = other;
E.faces = die => { const m = /d(\d+)/i.exec(die || ''); return m ? +m[1] : 6; };
E.power = p => { const n = parseInt(p, 10); return Number.isNaN(n) ? null : n; };
E.key = key;

/* ---------- Base de datos (la inyecta la app) ---------- */
let DB = { card: () => null, fx: () => null };
E.setDB = d => { DB = Object.assign({}, DB, d); };

// Ataque de reserva para cartas sin ataques definidos
const BASIC = { name: 'Ataque básico', type: 'normal', die: 'D6', power: '1', effects: [] };
E.movesOf = card => (card && card.moves && card.moves.length ? card.moves : [BASIC]);

function fxInfo(code) {
  const f = DB.fx(code);
  if (!f) return { code, name: code, lado: '', thr: null, known: false };
  const thr = f.t === '' || f.t == null ? null : parseInt(f.t, 10);
  return { code, name: f.n, lado: f.l, thr: Number.isNaN(thr) ? null : thr, known: !!f.l, desc: f.d, icon: f.i, confirmed: !!f.c };
}
E.fxInfo = fxInfo;

/* ---------- Habilidades con efecto automático (clave = nombre sin acentos) ----------
   own  : bono propio   {bonus, dieMax?, moveType?}   (se cumple si el dado natural <= dieMax)
   alw  : bono al atacar con un tipo
   rec  : bono al RECIBIR un ataque de ese tipo
   shield: resta al atacante que use esos tipos
   immune: tipos de ataque a los que es inmune
   Las demás habilidades se muestran como recordatorio para aplicarlas a mano. */
const ABIL = {
  torrente: { own: { bonus: 1, dieMax: 2, moveType: 'water' } },
  enjambre: { own: { bonus: 1, dieMax: 2, moveType: 'bug' } },
  espesura: { own: { bonus: 1, dieMax: 2, moveType: 'grass' } },
  marllamas: { own: { bonus: 1, dieMax: 2, moveType: 'fire' } },
  velodearena: { own: { bonus: 2, dieMax: 2 } },
  velaarena: { own: { bonus: 2, dieMax: 2 } },
  experto: { own: { bonus: 2, dieMax: 2 } },
  adaptable: { alw: { bonus: 1, moveType: 'normal' } },
  agallas: { ifStatus: 2 },
  francotirador: { top: 2 },
  absorbefuego: { rec: { type: 'fire', bonus: 1, dieMax: 2 } },
  absorbeagua: { rec: { type: 'water', bonus: 2 }, immune: ['water'] },
  sebo: { shield: { types: ['ice', 'fire'], minus: 2 } },
  levitacion: { immune: ['ground'] },
  filtro: { capWeak: 2 },
  polvoescudo: { noDisadv: true }, cuerpopuro: { noDisadv: true }, cortefuerte: { noDisadv: true },
  fuerzamental: { noDisadv: true },
  hedor: { onHit: 'disadv' },
  robustez: { noKO: true },
  flexibilidad: { noStatus: ['Paralizado'] },
  espiritualvital: { noStatus: ['Dormido'] }, insomnio: { noStatus: ['Dormido'] },
  ritmopropio: { noStatus: ['Confuso'] }
};
E.abilityRule = name => ABIL[key(name)] || null;

/* ---------- Efectos: nombre canónico -> tratamiento ---------- */
const STATUS_FX = ['Quemado', 'Congelado', 'Paralizado', 'Envenenado', 'Dormido', 'Confuso', 'Maldito'];

/* ---------- Estados alterados (según las tarjetas físicas del juego) ----------
   max   : contadores con los que se debilita (null = sin límite)
   faces : textos de cada cara de la tarjeta (1 o 2 caras)  */
E.STATUS_INFO = {
  par: { key: 'par', abbr: 'PAR', name: 'Paralizado', emoji: '⚡', color: '#e6c229', max: null, faces: [
    'Al paralizarse, o antes de seleccionar un movimiento, tira un D4. Si sacas 1, da la vuelta al estado.',
    'No puede seleccionar un movimiento: su tirada de ataque no tiene tipo y su fuerza es 0. Al final del turno, da la vuelta al estado.'] },
  ven: { key: 'ven', abbr: 'VEN', name: 'Envenenado', emoji: '☠️', color: '#9b4fd8', max: 4, faces: [
    'Al final del turno, o tras recorrer 3 casillas durante tu turno, añade un contador. Con 4 contadores se debilita. Los envenenados siempre pierden los empates; si ambos están envenenados y empatan, se debilitan ambos.'] },
  dor: { key: 'dor', abbr: 'DOR', name: 'Dormido', emoji: '💤', color: '#3aa6a6', max: null, faces: [
    'Tira un D4 y añade tantos contadores como el resultado. Da la vuelta al estado.',
    'No puede seleccionar un movimiento: su tirada de ataque no tiene tipo y su fuerza es 0. Antes de elegir movimiento, quita un contador. Si no quedan contadores o se debilita, descarta el estado.'] },
  que: { key: 'que', abbr: 'QUE', name: 'Quemado', emoji: '🔥', color: '#e0561f', max: 4, faces: [
    'La Fuerza de Ataque de este Pokémon se reduce en 1. Al final de su turno añade un contador. Con 4 contadores se debilita.'] },
  con: { key: 'con', abbr: 'CON', name: 'Confuso', emoji: '❓', color: '#6d7f95', max: null, faces: [
    'Si este Pokémon saca un número impar en su tirada de ataque, añade la fuerza del ataque seleccionado a la fuerza de ataque del oponente. Se descarta si sale del combate o se debilita.'] },
  cgl: { key: 'cgl', abbr: 'CGL', name: 'Congelado', emoji: '❄️', color: '#6fb8ee', max: null, faces: [
    'No puede seleccionar un movimiento: su tirada de ataque no tiene tipo y su fuerza es 0. Antes de seleccionar movimiento tira un D4: con un 4 se descarta el estado. Se descarta si se debilita.'] },
  mal: { key: 'mal', abbr: 'MAL', name: 'Maldito', emoji: '👻', color: '#6a5a9a', max: 2, faces: [
    'Al final del turno añade un contador. Con 2 contadores se debilita. Se descarta si sale del combate o se debilita. Solo un Pokémon por equipo puede estar Maldito en un combate.'] }
};
E.STATUS_ORDER = ['par', 'ven', 'dor', 'que', 'con', 'cgl', 'mal'];
E.statusByName = name => { const k = norm(name); return Object.values(E.STATUS_INFO).find(i => norm(i.name) === k) || null; };


/* ============================================================
   Estado del combate
   ============================================================ */
/* ---------- Objetos de equipamiento que intervienen en el combate ----------
   Pasivos (automáticos): vitamina (+1 al total), telescopio (Ventaja 5+), roca_del_rey (Desventaja 5+).
   Se activan al elegir ataque (casilla): garra_afilada (dado mejor), garra_rapida (Prioridad, 1 vez por combate),
   mineral_evolutivo (Desventaja al rival, 1 vez por combate, solo si no está del todo evolucionado), lupa (+1 al dado de efecto).
   El resto (restos, baya, poción máxima, repartir exp, huevo suerte, amuleto) se gestionan a mano / desde la Mochila. */
E.ITEM_IDS = ['vitamina', 'telescopio', 'roca_del_rey', 'garra_afilada', 'garra_rapida', 'mineral_evolutivo', 'lupa', 'restos', 'baya', 'pocion_maxima', 'repartir_exp', 'huevo_suerte', 'amuleto'];
E.ITEM_ACTIVE = ['garra_afilada', 'garra_rapida', 'mineral_evolutivo', 'lupa'];
const UPGRADE = { 4: 6, 6: 8, 8: 10, 10: 12 };
E.itemUsable = (S, side, mvIdx) => {                      // ¿puede usar su objeto activo ahora?
  const f = S.fighters[side]; if (!f || !f.item || !E.ITEM_ACTIVE.includes(f.item)) return { ok: false };
  const card = DB.card(f.id), mv = E.movesOf(card)[mvIdx == null ? S.choice[side] : mvIdx];
  if (f.item === 'garra_rapida' && f.iu.garra_rapida) return { ok: false, why: 'Ya la usaste en este combate' };
  if (f.item === 'mineral_evolutivo') {
    if (f.iu.mineral_evolutivo) return { ok: false, why: 'Ya lo usaste en este combate' };
    if (!((card.evolvesTo || []).length)) return { ok: false, why: 'Ya está completamente evolucionado' };
  }
  if (f.item === 'lupa' && mv && (mv.effects || []).some(c => fxInfo(c).name === 'KO')) return { ok: false, why: 'No sirve con movimientos KO' };
  return { ok: true };
};
E.rollFaces = (S, side) => {
  const f = S.fighters[side], mv = E.movesOf(DB.card(f.id))[S.choice[side]], base = E.faces(mv.die);
  return (S.use && S.use[side] || []).includes('garra_afilada') && UPGRADE[base] ? UPGRADE[base] : base;
};
E.create = (opts) => ({
  v: 1, size: 3, need: 2, phase: 'lobby',                       // lobby -> pick -> duel -> done
  names: { A: '', B: '' }, joined: { A: false, B: false },
  opts: Object.assign({ immune: 'falla' }, opts || {}),
  picks: { A: null, B: null }, locked: { A: false, B: false },
  duel: 0, duelWins: { A: 0, B: 0 }, duels: [],
  fighters: null, round: 1, rw: { A: 0, B: 0 },
  step: 'choose',                             // choose -> roll -> result -> (duelEnd)
  choice: { A: null, B: null }, use: { A: [], B: [] }, rolls: { A: null, B: null }, adj: { A: 0, B: 0 },
  result: null, ack: { A: false, B: false }, log: []
});

function newFighter(spec) {
  return { id: spec.id, level: spec.level, item: spec.item || null, iu: {}, statuses: (spec.st || []).slice(), adv: 0, advPerm: 0, cool: {}, spent: {}, last: -1, streak: 0, dead: false };
}
function setupDuel(S) {
  S.fighters = { A: newFighter(S.picks.A[S.duel]), B: newFighter(S.picks.B[S.duel]) };
  S.round = 1; S.rw = { A: 0, B: 0 };
  S.step = 'choose'; S.choice = { A: null, B: null }; S.rolls = { A: null, B: null };
  S.adj = { A: 0, B: 0 }; S.result = null; S.ack = { A: false, B: false }; S.use = { A: [], B: [] };
}

// ¿Qué ataques puede usar este lado en la ronda actual?
E.availableMoves = (S, s) => {
  const f = S.fighters[s], card = DB.card(f.id), mv = E.movesOf(card);
  const res = mv.map((m, i) => ({ i, m, ok: !(f.cool[i] > 0) && !f.spent[i], why: f.spent[i] ? 'Recarga: ya no se puede usar' : f.cool[i] > 0 ? 'Espera: descansa este turno' : '' }));
  if (!res.some(r => r.ok)) res.forEach(r => { r.ok = true; r.why = ''; });
  return res;
};

/* ============================================================
   Acciones (el anfitrión las aplica; en un solo móvil se aplican directamente)
   ============================================================ */
E.apply = (S, side, a, rng) => {
  rng = rng || Math.random;
  const err = m => ({ ok: false, err: m });
  switch (a.type) {
    case 'hello':
      S.names[side] = String(a.name || (side === 'A' ? 'Entrenador A' : 'Entrenador B')).slice(0, 20);
      S.joined[side] = true;
      return { ok: true };
    case 'opts':
      if (side !== 'A' || S.phase !== 'lobby') return err('Solo el anfitrión puede cambiar las opciones');
      Object.assign(S.opts, a.opts);
      return { ok: true };
    case 'start':
      if (S.phase !== 'lobby' || !S.joined.A || !S.joined.B) return err('Faltan entrenadores');
      S.phase = 'pick';
      return { ok: true };
    case 'lock': {
      if (S.phase !== 'pick') return err('No es el momento de elegir');
      if (S.opts.wild) {                       // combate contra un Pokémon salvaje: 1 contra n de tu equipo
        if (side !== 'A') return err('Solo juega el entrenador');
        const ps = (a.picks || []).slice(0, 6);
        if (!ps.length || ps.some(p => !DB.card(p.id))) return err('Elige al menos 1 Pokémon');
        S.picks.A = ps.map(p => ({ id: p.id, level: Math.max(1, +p.level || 1), item: E.ITEM_IDS.includes(p.item) ? p.item : null, st: (p.st || []).filter(n => E.statusByName(n)) }));
        S.picks.B = S.picks.A.map(pa => ({ id: S.opts.wild.id, level: S.opts.wild.match ? pa.level : Math.max(1, +S.opts.wild.level || 1), item: null, st: [] }));   // match = Flauta Negra: mismo nivel que tu Pokémon
        S.locked.A = S.locked.B = true; S.size = ps.length; S.need = 1; S.phase = 'duel'; S.duel = 0; setupDuel(S);
        return { ok: true };
      }
      let picks = (a.picks || []).slice(0, 3);
      if (picks.length < 1 || picks.length > 3 || picks.some(p => !DB.card(p.id))) return err('Elige de 1 a 3 Pokémon');
      const gym = S.opts.gym;
      if (gym && side === 'B') {                 // líder de gimnasio: solo de su equipo y con los niveles del gimnasio
        const need = Math.min(3, gym.roster.length);
        if (picks.length !== need) return err('El líder elige ' + need + ' Pokémon de su equipo');
        const ids = picks.map(p => p.id); if (new Set(ids).size !== ids.length) return err('No repitas Pokémon');
        const ent = picks.map(p => gym.roster.find(r => r.id === p.id));
        if (ent.some(x => !x)) return err('Ese Pokémon no es del gimnasio');
        picks = ent.map(x => ({ id: x.id, level: x.level, st: [], item: null }));
      }
      S.picks[side] = picks.map(p => ({ id: p.id, level: Math.max(1, +p.level || 1), item: E.ITEM_IDS.includes(p.item) ? p.item : null, st: (p.st || []).filter(n => E.statusByName(n)) }));
      S.locked[side] = true;
      if (S.locked.A && S.locked.B) {
        S.size = Math.min(S.picks.A.length, S.picks.B.length);      // se juegan tantos duelos como Pokémon lleve el que menos lleva
        S.need = Math.floor(S.size / 2) + 1;                         // duelos para ganar (1→1, 2→2, 3→2)
        S.phase = 'duel'; S.duel = 0; setupDuel(S);
      }
      return { ok: true };
    }
    case 'unlock':
      if (S.phase !== 'pick' || (S.locked.A && S.locked.B)) return err('Ya no se puede cambiar');
      S.locked[side] = false; S.picks[side] = null;
      return { ok: true };
    case 'choose': {
      if (S.phase !== 'duel' || S.step !== 'choose' || S.choice[side] !== null) return err('No puedes elegir ahora');
      const av = E.availableMoves(S, side)[a.idx];
      if (!av || !av.ok) return err('Ese ataque no está disponible');
      S.choice[side] = a.idx;
      S.use = S.use || { A: [], B: [] };
      S.use[side] = [];
      if (a.use) {                                         // objeto activo de este Pokémon, si se puede
        const fs = S.fighters[side], u = E.itemUsable(S, side, a.idx);
        if (u.ok && a.use === true || (u.ok && a.use && a.use.includes && a.use.includes(fs.item))) {
          S.use[side] = [fs.item];
          if (fs.item === 'garra_rapida' || fs.item === 'mineral_evolutivo') fs.iu[fs.item] = true;
        }
      }
      if (S.choice.A !== null && S.choice.B !== null) {
        S.step = 'roll';
        ['A', 'B'].forEach(x => {                          // Mineral Evolutivo: el rival tira con Desventaja esta ronda
          if (!S.use[x].includes('mineral_evolutivo')) return;
          const r = S.fighters[other(x)], rule = DB.card(r.id) && E.abilityRule(DB.card(r.id).ability);
          if (!(rule && rule.noDisadv)) r.adv = Math.max(-2, r.adv - 1);
        });
      }
      return { ok: true };
    }
    case 'roll': {
      if (S.phase !== 'duel' || S.step !== 'roll' || S.rolls[side]) return err('No puedes tirar ahora');
      const f = S.fighters[side], card = DB.card(f.id), mv = E.movesOf(card)[S.choice[side]];
      const faces = E.rollFaces(S, side);
      const adv = Math.max(-2, Math.min(2, f.adv + f.advPerm));
      const n = 1 + Math.abs(adv);
      let dice;
      if (Array.isArray(a.manual) && a.manual.length === n && a.manual.every(d => d >= 1 && d <= faces)) dice = a.manual.map(Number);
      else dice = Array.from({ length: n }, () => 1 + Math.floor(rng() * faces));
      const kept = adv > 0 ? Math.max(...dice) : adv < 0 ? Math.min(...dice) : dice[0];
      S.rolls[side] = { dice, kept, val: kept, faces, adv, manual: !!a.manual };
      f.adv = 0;                                   // la ventaja/desventaja puntual se gasta
      S.adj[side] = Math.max(-9, Math.min(9, +a.adj || 0));
      if (S.rolls.A && S.rolls.B) resolveRound(S, rng);
      return { ok: true };
    }
    case 'ack': {
      if (S.step !== 'result' && S.step !== 'duelEnd') return err('Nada que confirmar');
      S.ack[side] = true;
      if (S.ack.A && S.ack.B) advance(S);
      return { ok: true };
    }
    default: return err('Acción desconocida');
  }
};

/* ============================================================
   Resolución de una ronda
   ============================================================ */
function sideInfo(S, s) {
  const f = S.fighters[s], card = DB.card(f.id), idx = S.choice[s], mv = E.movesOf(card)[idx];
  let effs = (mv.effects || []).map(fxInfo);
  const roll = S.rolls[s];
  const use = (S.use && S.use[s]) || [];
  const hasKO = effs.some(e => e.name === 'KO');
  const lupa = use.includes('lupa') && !hasKO ? 1 : 0;
  const nat = roll.kept + lupa;
  const syn = (name, lado, thr, label) => {           // efecto que aporta el objeto: si el movimiento ya lo tiene, baja 1 su umbral
    const mine = effs.find(e => (e.name === name || e.name === 'Doble ' + name) && e.lado === lado);
    if (mine) { if (mine.thr != null) { mine.thr = Math.max(1, mine.thr - 1); mine.item = label; } }
    else effs.push({ code: 'item_' + name, name, lado, thr, known: true, desc: label, item: label });
  };
  if (f.item === 'telescopio') syn('Ventaja', 'usuario', 5, 'Telescopio');
  if (f.item === 'roca_del_rey') syn('Desventaja', 'rival', 5, 'Roca del Rey');
  if (use.includes('garra_rapida')) effs.push({ code: 'item_Prioridad', name: 'Prioridad', lado: 'usuario', thr: null, known: true, desc: 'Garra Rápida', item: 'Garra Rápida' });
  const fired = effs.filter(e => e.thr == null || nat >= e.thr);
  return {
    s, f, card, idx, mv, effs, roll, fired, nat, use,
    abil: E.abilityRule(card.ability),
    has: name => fired.some(e => e.name === name)
  };
}

function resolveRound(S, rng) {
  const info = { A: sideInfo(S, 'A'), B: sideInfo(S, 'B') };
  const out = {};

  ['A', 'B'].forEach(s => {
    const me = info[s], op = info[other(s)];
    const rows = []; const notes = [];
    const add = (k, label, v, note) => rows.push({ k, label, v, note: note || '' });
    let miss = false;

    add('nivel', 'Nivel', me.f.level);

    // Potencia
    let pw = E.power(me.mv.power), pnote = '';
    if (pw === null) { pnote = 'Potencia especial (*): usa el ajuste manual'; pw = 0; }
    const base = pw;
    if (op.has('Protección')) { pw = 0; pnote = 'Protección del rival'; }
    add('potencia', 'Potencia · ' + me.mv.name, pw, pnote);
    if (me.has('Repetición') && me.f.last === me.idx && me.f.streak > 0) add('repeticion', 'Repetición', me.f.streak, 'ronda ' + (me.f.streak + 1) + ' seguida');
    if (me.has('Rebote')) add('rebote', 'Rebote', Math.max(0, E.power(op.mv.power) || 0), 'potencia del rival');

    // Dado
    const r = me.roll;
    add('dado', 'Dado ' + (me.mv.die || 'D6'), r.val,
      r.dice.length > 1 ? 'tiradas ' + r.dice.join(', ') + (r.adv > 0 ? ' · Ventaja (el mayor)' : ' · Desventaja (el menor)') : (r.manual ? 'dado físico' : ''));
    if (me.has('2d6 +')) { const x = 1 + Math.floor(rng() * r.faces); add('extra', 'Dado extra', x, '2d6 +'); }

    // Tipo
    let typeShown = null;
    if (me.mv.type && !me.has('Ignore Type') && (base > 0 || E.power(me.mv.power) === null)) {
      let m = E.mult(me.mv.type, op.card.types);
      if (op.abil && op.abil.immune && op.abil.immune.includes(me.mv.type)) m = 0;
      if (m === 0) {
        const mode = S.opts.immune;
        if (mode === 'falla') { miss = true; add('tipo', 'Tipo', 0, 'Inmune: el ataque falla'); }
        else if (mode === 'menos4') add('tipo', 'Tipo', -4, 'Inmune (cuenta como −4)');
        else add('tipo', 'Tipo', 0, 'Inmune (se ignora)');
        typeShown = 0;
      } else if (m > 1) {
        let v = m, note = '×' + m + ' supereficaz';
        if (op.abil && op.abil.capWeak && v > op.abil.capWeak) { v = op.abil.capWeak; note += ' · Filtro del rival'; }
        add('tipo', 'Tipo', v, note); typeShown = v;
      } else if (m < 1) {
        add('tipo', 'Tipo', -(1 / m), (m === 0.5 ? '×½' : '×¼') + ' resistencia'); typeShown = -(1 / m);
      } else add('tipo', 'Tipo', 0, 'efectividad normal');
    }
    if (op.abil && op.abil.shield && op.abil.shield.types.includes(me.mv.type)) add('sebo', 'Habilidad del rival', -op.abil.shield.minus, 'reduce ataques ' + me.mv.type);

    // Habilidad propia
    const a = me.abil;
    if (a) {
      let v = 0, why = '';
      if (a.own) { const ok = r.kept <= a.own.dieMax && (!a.own.moveType || me.mv.type === a.own.moveType); v += ok ? a.own.bonus : 0; why = ok ? 'se cumple' : 'condición no cumplida'; }
      if (a.alw) { const ok = me.mv.type === a.alw.moveType; v += ok ? a.alw.bonus : 0; why = ok ? 'se cumple' : 'condición no cumplida'; }
      if (a.ifStatus) { const ok = me.f.statuses.length > 0; v += ok ? a.ifStatus : 0; why = ok ? 'tiene un estado' : 'sin estados'; }
      if (a.top) { const ok = r.kept === r.faces; v += ok ? a.top : 0; why = ok ? 'dado máximo' : 'dado no máximo'; }
      if (a.rec) { const ok = op.mv.type === a.rec.type && (a.rec.dieMax === undefined || r.kept <= a.rec.dieMax); v += ok ? a.rec.bonus : 0; why = ok ? 'recibe ataque ' + a.rec.type : 'condición no cumplida'; }
      if (a.own || a.alw || a.ifStatus || a.top || a.rec) add('habilidad', 'Habilidad · ' + me.card.ability, v, why);
    }
    if (me.has('Corazón')) add('corazon', 'Corazón', Math.floor(r.val / 3), '⅓ del dado');

    // Objeto equipado
    if (me.f.item === 'vitamina') add('objeto', 'Objeto · Vitamina', 1, '+1 al total');
    if (me.use.includes('garra_afilada')) notes.push('Garra Afilada: el dado de este ataque sube de tamaño esta ronda.');
    if (me.use.includes('lupa')) notes.push(me.nat > me.roll.kept ? 'Lupa: +1 a la tirada para activar efectos (sacaste ' + me.roll.kept + ' → cuenta ' + me.nat + ').' : 'Lupa: no se puede usar con movimientos KO.');
    if (me.use.includes('garra_rapida')) notes.push('Garra Rápida: Prioridad esta ronda (gana empates y anula los efectos del rival; si el rival también tiene Prioridad, se anulan).');
    if (me.use.includes('mineral_evolutivo')) notes.push('Mineral Evolutivo: el rival tira con Desventaja esta ronda.');
    if (me.f.item === 'restos' || me.f.item === 'baya') notes.push((me.f.item === 'restos' ? 'Restos: una vez por combate puedes repetir el dado de ataque (resta 1 al total con el ajuste manual).' : 'Baya: puedes descartarla para repetir el dado de ataque o quitar un estado.'));

    // Estados
    if (me.f.statuses.length) {
      const sum = me.f.statuses.reduce((t, st) => t + (E.STATUS_MOD[norm(st)] || 0), 0);
      if (sum !== 0) add('estado', 'Estado · ' + me.f.statuses.join(', '), sum);
      me.f.statuses.forEach(st => { if (!(norm(st) in E.STATUS_MOD)) { const si = E.statusByName(st); notes.push(st + ' (a mano): ' + (si ? si.faces.join(' · Cara 2: ') : 'aplica su regla')); } });
    }
    if (S.adj[s]) add('manual', 'Ajuste manual', S.adj[s]);

    let total = rows.reduce((t, x) => t + x.v, 0);
    if (miss) total = 0;
    if (a === null && me.card.ability) notes.push('Habilidad ' + me.card.ability + ': aplícala a mano si corresponde.');
    else if (a && !(a.own || a.alw || a.ifStatus || a.top || a.rec) && me.card.ability && !a.immune && !a.shield && !a.capWeak) notes.push('Habilidad ' + me.card.ability + ': ' + (a.noDisadv ? 'inmune a Desventaja (automático)' : 'aplícala a mano si corresponde.'));
    out[s] = { rows, total, miss, notes, move: me.mv.name, moveIdx: me.idx, roll: r };
  });

  // Prioridad: si solo uno la tiene, anula los efectos del rival; si la tienen los dos, se anulan entre sí
  const prioOnly = s => info[s].has('Prioridad') && !info[other(s)].has('Prioridad');
  // Ganador de la ronda
  let winner = null;
  let tieBreak = '';
  if (out.A.total > out.B.total) winner = 'A'; else if (out.B.total > out.A.total) winner = 'B';
  else if (prioOnly('A') !== prioOnly('B')) { winner = prioOnly('A') ? 'A' : 'B'; tieBreak = 'Empate: gana el ataque con Prioridad'; }
  else {
    const pa = S.fighters.A.statuses.includes('Envenenado'), pb = S.fighters.B.statuses.includes('Envenenado');
    if (pa && !pb) { winner = 'B'; tieBreak = 'Empate: el envenenado pierde'; }
    else if (pb && !pa) { winner = 'A'; tieBreak = 'Empate: el envenenado pierde'; }
    else if (pa && pb) { out.A.notes.push('Ambos envenenados y empatados: los dos se debilitan (regla de Envenenado).'); }
  }
  if (winner) S.rw[winner]++;

  // Efectos (se resuelven tras comparar totales; no dependen de quién gane)
  const effects = [];
  ['A', 'B'].forEach(s => {
    const me = info[s], op = info[other(s)], fo = S.fighters[other(s)], fm = S.fighters[s];
    me.effs.forEach(e => {
      const fired = e.thr == null || me.nat >= e.thr;
      const item = { fromItem: e.item || '', side: s, name: e.name, code: e.code, lado: e.lado, thr: e.thr, fired, outcome: '', text: '' };
      if (!fired) { item.outcome = 'no'; item.text = 'No se activa (sacaste ' + me.nat + ', hacía falta ' + e.thr + ')' + (e.item ? ' · ' + e.item : ''); effects.push(item); return; }
      const toOpp = e.lado === 'rival';
      const target = toOpp ? fo : fm;
      const tInfo = toOpp ? op : me;
      const ignored = (toOpp && op.has('Protección')) || prioOnly(other(s));
      if (ignored) { item.outcome = 'ignorado'; item.text = 'El rival lo anula (' + (toOpp && op.has('Protección') ? 'Protección' : 'Prioridad: su ataque es más rápido') + ')'; effects.push(item); return; }
      const n = e.name;
      if (STATUS_FX.includes(n)) {
        const rule = tInfo.abil;
        if (rule && rule.noStatus && rule.noStatus.includes(n)) { item.outcome = 'bloqueado'; item.text = 'Bloqueado por la habilidad ' + tInfo.card.ability; }
        else if (target.statuses.includes(n)) { item.outcome = 'ya'; item.text = 'Ya tenía ' + n; }
        else { target.statuses.push(n); item.outcome = 'aplicado'; item.text = (toOpp ? 'El rival' : 'Tu Pokémon') + ' queda ' + n; }
      } else if (n === 'Ventaja' || n === 'Doble Ventaja') {
        const k = n === 'Ventaja' ? 1 : 2; target.adv = Math.min(2, target.adv + k); item.outcome = 'aplicado'; item.text = 'Próxima ronda: ' + n + ' (' + (k + 1) + ' dados, se queda el mayor)';
      } else if (n === 'Desventaja' || n === 'Doble Desventaja') {
        if (tInfo.abil && tInfo.abil.noDisadv) { item.outcome = 'bloqueado'; item.text = 'Inmune por la habilidad ' + tInfo.card.ability; }
        else { const k = n === 'Desventaja' ? 1 : 2; target.adv = Math.max(-2, target.adv - k); item.outcome = 'aplicado'; item.text = 'Próxima ronda: ' + n + ' (' + (k + 1) + ' dados, se queda el menor)'; }
      } else if (n === 'Stat. Down') {
        target.advPerm = Math.max(-2, target.advPerm - 1); item.outcome = 'aplicado'; item.text = 'Desventaja desde la próxima ronda hasta el final del duelo';
      } else if (n === 'KO') {
        if (tInfo.abil && tInfo.abil.noKO) { item.outcome = 'bloqueado'; item.text = 'Inmune por la habilidad ' + tInfo.card.ability; }
        else { target.dead = true; item.outcome = 'aplicado'; item.text = (toOpp ? 'El rival' : 'Tu Pokémon') + ' se debilita'; }
      } else if (n === 'Espera') {
        fm.cool[me.idx] = 1; item.outcome = 'aplicado'; item.text = 'No podrás usar este ataque la próxima ronda';
      } else if (n === 'Recarga') {
        fm.spent[me.idx] = true; item.outcome = 'aplicado'; item.text = 'No podrás volver a usar este ataque en este duelo';
      } else if (['Corazón', 'Ignore Type', 'Rebote', 'Repetición', 'Protección', 'Prioridad', '2d6 +'].includes(n)) {
        item.outcome = 'auto'; item.text = 'Ya incluido en el cálculo';
      } else {
        item.outcome = 'manual'; item.text = 'Resuélvelo a mano' + (e.desc ? ': ' + e.desc : '');
      }
      effects.push(item);
    });
    // Habilidades que reaccionan al ser atacado
    if (op.abil && op.abil.onHit === 'disadv' && (E.power(me.mv.power) || 0) > 0) {
      if (!(me.abil && me.abil.noDisadv)) { fm.adv = Math.max(-2, fm.adv - 1); effects.push({ side: other(s), name: 'Hedor', fired: true, outcome: 'aplicado', text: 'El atacante recibe Desventaja la próxima ronda', lado: 'rival' }); }
    }
  });

  // Enfriamientos y rachas
  ['A', 'B'].forEach(s => {
    const f = S.fighters[s], i = S.choice[s];
    Object.keys(f.cool).forEach(k => { if (+k !== i || !effects.some(e => e.side === s && e.name === 'Espera' && e.outcome === 'aplicado')) { if (f.cool[k] > 0) f.cool[k]--; } });
    f.streak = f.last === i ? f.streak + 1 : 1; f.last = i;
  });

  S.result = {
    round: S.round, winner, tie: !winner, tieBreak, A: out.A, B: out.B, effects,
    rw: { A: S.rw.A, B: S.rw.B }, dead: { A: S.fighters.A.dead, B: S.fighters.B.dead },
    statuses: { A: S.fighters.A.statuses.slice(), B: S.fighters.B.statuses.slice() }
  };
  S.step = 'result'; S.ack = { A: false, B: false };
  S.log.push({ duel: S.duel, round: S.round, winner });
}

/* ¿Ha terminado el duelo? y avance de estado tras confirmar los dos */
function duelWinner(S) {
  const F = S.fighters;
  if (F.A.dead && !F.B.dead) return 'B';
  if (F.B.dead && !F.A.dead) return 'A';
  if (F.A.dead && F.B.dead) return S.result && S.result.winner ? S.result.winner : 'A';
  if (S.rw.A >= E.MAX_ROUNDS_WIN) return 'A';
  if (S.rw.B >= E.MAX_ROUNDS_WIN) return 'B';
  return null;
}
E.duelWinner = duelWinner;

function advance(S) {
  if (S.step === 'result') {
    const w = duelWinner(S);
    if (w) {
      S.duels[S.duel] = { winner: w, rw: { A: S.rw.A, B: S.rw.B }, ko: S.fighters.A.dead || S.fighters.B.dead, ids: { A: S.fighters.A.id, B: S.fighters.B.id } };
      S.duelWins[w]++;
      S.step = 'duelEnd'; S.ack = { A: false, B: false };
    } else {
      S.round++; S.use = { A: [], B: [] }; S.step = 'choose'; S.choice = { A: null, B: null }; S.rolls = { A: null, B: null }; S.adj = { A: 0, B: 0 };
      S.result = null; S.ack = { A: false, B: false };
    }
  } else if (S.step === 'duelEnd') {
    const decided = E.matchOver(S);
    if (decided) { S.phase = 'done'; S.step = 'done'; S.ack = { A: false, B: false }; }
    else { S.duel++; setupDuel(S); }
  }
}

/* ¿Se acabó el combate completo? (en el salvaje: cuando uno de tus Pokémon gana un duelo, o ya han peleado todos) */
E.matchOver = S => S.opts.wild
  ? (S.duelWins.A >= 1 || S.duel >= (S.picks.A ? S.picks.A.length : 1) - 1)
  : (S.duelWins.A >= (S.need || E.MAX_DUEL_WIN) || S.duelWins.B >= (S.need || E.MAX_DUEL_WIN) || S.duel >= (S.size || 3) - 1);
E.matchWinner = S => S.opts.wild ? (S.duelWins.A >= 1 ? 'A' : 'B')
  : (S.duelWins.A > S.duelWins.B ? 'A' : S.duelWins.B > S.duelWins.A ? 'B' : null);

/* ============================================================
   Líder de gimnasio controlado por la CPU (lado B).
   Estudia el equipo del retador (ya confirmado) para elegir a sus 3 Pokémon y su orden, y en cada ronda
   calcula con qué ataque tiene más probabilidades de ganar (nunca mira el ataque que ha elegido el rival).
   ============================================================ */
const dieP = (fa, fb, da, db) => {            // P(tirada A + da > tirada B + db) y P(empate), dados de fa y fb caras
  let w = 0, t = 0;
  for (let x = 1; x <= fa; x++) for (let y = 1; y <= fb; y++) { const d = x + da - (y + db); if (d > 0) w++; else if (d === 0) t++; }
  const n = fa * fb; return { w: w / n, t: t / n };
};
function typeModOf(S, moveType, defCard, ability) {
  if (!moveType) return 0;
  let m = E.mult(moveType, defCard.types);
  const ar = E.abilityRule(ability);
  if (ar && ar.immune && ar.immune.includes(moveType)) m = 0;
  if (m === 0) return S.opts.immune === 'falla' ? -99 : S.opts.immune === 'menos4' ? -4 : 0;
  return m > 1 ? m : m < 1 ? -(1 / m) : 0;
}
function moveEst(S, atkCard, atkLevel, mv, defCard) {         // total esperado de un ataque (sin dado)
  const pw = E.power(mv.power);
  return { faces: E.faces(mv.die), base: atkLevel + (pw === null ? 2 : pw) + typeModOf(S, mv.type, defCard, atkCard.ability), mv };
}
const EFF_W = { KO: 3, Prioridad: 1.2, Ventaja: 1, Desventaja: 1, Protección: 1.2 };
function effValue(mv, faces) {
  return (mv.effects || []).reduce((t, c) => {
    const e = fxInfo(c), pr = e.thr == null ? 1 : Math.max(0, (faces - e.thr + 1) / faces);
    if (e.name === 'Recarga') return t - 0.5;
    if (e.name === 'Espera') return t - 0.4;
    const w = (EFF_W[e.name] || 0.7) * pr;
    const malo = ['KO', 'Confuso', 'Paralizado', 'Dormido', 'Quemado', 'Envenenado', 'Congelado', 'Desventaja', 'Doble Desventaja', 'Stat. Down', 'Maldito'].includes(e.name);
    return t + (malo && e.lado === 'usuario' ? -1.2 * w : w);     // un efecto malo que cae sobre su propio Pokémon (p. ej. Explosión) resta
  }, 0) * 0.6;
}
const bestEst = (S, atk, atkLv, def) => E.movesOf(atk).map(m => moveEst(S, atk, atkLv, m, def)).sort((a, b) => (b.base + b.faces / 2) - (a.base + a.faces / 2))[0];
const duelWinP = p => p * p * (3 - 2 * p);                     // ganar un duelo al mejor de 3 rondas

E.cpuPickTeam = (S, rng) => {
  rng = rng || Math.random;
  const gym = S.opts.gym, opp = S.picks.A, n = Math.min(3, gym.roster.length);
  const ros = gym.roster.map(r => ({ r, c: DB.card(r.id) }));
  const pw = (me, o) => {                                       // prob. de ganar una ronda: mi mejor ataque contra su mejor ataque
    const oc = DB.card(o.id), a = bestEst(S, me.c, me.r.level, oc), b = bestEst(S, oc, o.level, me.c);
    const d = dieP(a.faces, b.faces, a.base, b.base); return d.w + d.t / 2;
  };
  const M = ros.map(me => opp.map(o => pw(me, o)));
  let best = null;
  const rec = (chosen, used) => {
    if (chosen.length === n) {
      const ps = chosen.map((ri, pos) => opp[pos] ? duelWinP(M[ri][pos]) : 0.5), need = Math.floor(ps.length / 2) + 1;
      let dp = [1]; ps.forEach(p => { const nx = new Array(dp.length + 1).fill(0); dp.forEach((v, k) => { nx[k + 1] += v * p; nx[k] += v * (1 - p); }); dp = nx; });
      const win = dp.slice(need).reduce((t, v) => t + v, 0) + (rng() - 0.5) * 0.03 + chosen.filter(ri => ros[ri].r.hidden).length * 0.01;   // desempate: prefiere sacar su trampa
      if (!best || win > best.win) best = { win, chosen: chosen.slice() };
      return;
    }
    ros.forEach((_, i) => { if (!used.has(i)) { used.add(i); chosen.push(i); rec(chosen, used); chosen.pop(); used.delete(i); } });
  };
  rec([], new Set());
  return best.chosen.map(i => ({ id: ros[i].r.id, level: ros[i].r.level }));
};

E.cpuChoose = (S, side, rng) => {
  rng = rng || Math.random;
  const me = S.fighters[side], opp = S.fighters[other(side)];
  const mc = DB.card(me.id), oc = DB.card(opp.id);
  const mine = E.availableMoves(S, side).filter(x => x.ok);
  const theirs = E.availableMoves(S, other(side)).filter(x => x.ok).map(x => moveEst(S, oc, opp.level, x.m, mc));
  const tBest = theirs.slice().sort((a, b) => (b.base + b.faces / 2) - (a.base + a.faces / 2))[0];
  const scored = mine.map(x => {
    const a = moveEst(S, mc, me.level, x.m, oc);
    let p = 0;
    theirs.forEach(t => {                                        // el rival suele jugar su mejor ataque, pero no siempre
      const w = (theirs.length === 1 ? 1 : t === tBest ? 0.6 : 0.4 / (theirs.length - 1));
      const d = dieP(a.faces, t.faces, a.base, t.base); p += w * (d.w + d.t / 2);
    });
    const hasPrio = (x.m.effects || []).some(c => fxInfo(c).name === 'Prioridad');
    const selfKO = (x.m.effects || []).some(c => { const e = fxInfo(c); return e.name === 'KO' && e.lado === 'usuario' && (e.thr == null); });   // Explosión/Autodestrucción: su Pokémon se debilita y pierde el duelo
    return { i: x.i, s: (selfKO ? -50 : 0) + p * 10 + effValue(x.m, a.faces) + (hasPrio ? 0.3 : 0) + rng() * 0.05 };
  }).sort((a, b) => b.s - a.s);
  return scored[0].i;
};

E.autoGym = (S, rng) => {
  rng = rng || Math.random;
  const g = S.opts.gym; if (!g || !g.cpu) return;
  if (S.phase === 'pick' && S.locked.A && !S.locked.B) E.apply(S, 'B', { type: 'lock', picks: E.cpuPickTeam(S, rng) }, rng);
  if (S.phase !== 'duel') return;
  if (S.step === 'choose' && S.choice.B === null) E.apply(S, 'B', { type: 'choose', idx: E.cpuChoose(S, 'B', rng) }, rng);
  if (S.step === 'roll' && !S.rolls.B) E.apply(S, 'B', { type: 'roll', adj: 0 }, rng);
  if ((S.step === 'result' || S.step === 'duelEnd') && !S.ack.B) E.apply(S, 'B', { type: 'ack' }, rng);
};

/* Salvaje: el lado B lo juega la app (ataque al azar, tira solo y confirma solo) */
E.autoWild = (S, rng) => {
  rng = rng || Math.random;
  if (!S.opts.wild || S.phase !== 'duel') return;
  if (S.step === 'choose' && S.choice.B === null) {
    const ok = E.availableMoves(S, 'B').filter(x => x.ok);
    E.apply(S, 'B', { type: 'choose', idx: ok[Math.floor(rng() * ok.length)].i }, rng);
  }
  if (S.step === 'roll' && !S.rolls.B) E.apply(S, 'B', { type: 'roll', adj: 0 }, rng);
  if ((S.step === 'result' || S.step === 'duelEnd') && !S.ack.B) E.apply(S, 'B', { type: 'ack' }, rng);
};

/* ¿Debe actuar este lado ahora? (sirve para "esperando al rival…" y para el modo de un solo móvil) */
E.pending = (S, s) => {
  if (S.phase === 'lobby') return false;
  if (S.phase === 'pick') return !S.locked[s];
  if (S.phase === 'done') return false;
  if (S.step === 'choose') return S.choice[s] === null;
  if (S.step === 'roll') return !S.rolls[s];
  if (S.step === 'result' || S.step === 'duelEnd') return !S.ack[s];
  return false;
};

/* Vista de un jugador: oculta lo que el rival aún no debe ver */
E.view = (S, side) => {
  const V = clone(S), o = other(side);
  if (!(S.locked.A && S.locked.B)) V.picks[o] = null;
  if (S.phase === 'duel' && S.step === 'choose') V.choice[o] = S.choice[o] === null ? null : -1;
  if (S.phase === 'duel' && S.step === 'roll') V.rolls[o] = S.rolls[o] ? { hidden: true } : null;
  return V;
};

/* Ventaja de tipo orientativa de un ataque contra un defensor (para mostrar antes de elegir) */
E.typePreview = (moveType, defTypes) => {
  if (!moveType) return null;
  const m = E.mult(moveType, defTypes);
  return m === 0 ? { mult: 0, mod: 0, label: 'Inmune' } : m > 1 ? { mult: m, mod: m, label: '+' + m } : m < 1 ? { mult: m, mod: -(1 / m), label: '−' + (1 / m) } : { mult: 1, mod: 0, label: '±0' };
};

/* Desglose de la efectividad de un tipo de ataque contra los tipos del defensor (para el "ticket") */
E.explainType = (moveType, defTypes) => {
  const parts = (defTypes || []).map(d => { const v = ATK[moveType] && ATK[moveType][d]; return { def: d, m: v === undefined ? 1 : v }; });
  const mult = parts.reduce((t, x) => t * x.m, 1);
  const mod = mult === 0 ? 0 : mult > 1 ? mult : mult < 1 ? -(1 / mult) : 0;
  const label = mult === 0 ? 'Inmune' : mult >= 4 ? 'Superefectivo' : mult > 1 ? 'Eficaz' : mult === 1 ? 'Normal' : mult <= .25 ? 'Muy poco eficaz' : 'Poco eficaz';
  const txt = mult === 0 ? '×0' : mult >= 1 ? '×' + mult : mult === .5 ? '×½' : '×¼';
  return { parts, mult, mod, label, txt };
};

if (typeof module !== 'undefined' && module.exports) module.exports = E;
root.PMTU_ENGINE = E;
})(typeof window !== 'undefined' ? window : globalThis);
