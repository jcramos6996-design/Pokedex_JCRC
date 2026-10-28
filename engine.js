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
E.create = (opts) => ({
  v: 1, phase: 'lobby',                       // lobby -> pick -> duel -> done
  names: { A: '', B: '' }, joined: { A: false, B: false },
  opts: Object.assign({ immune: 'falla' }, opts || {}),
  picks: { A: null, B: null }, locked: { A: false, B: false },
  duel: 0, duelWins: { A: 0, B: 0 }, duels: [],
  fighters: null, round: 1, rw: { A: 0, B: 0 },
  step: 'choose',                             // choose -> roll -> result -> (duelEnd)
  choice: { A: null, B: null }, rolls: { A: null, B: null }, adj: { A: 0, B: 0 },
  result: null, ack: { A: false, B: false }, log: []
});

function newFighter(spec) {
  return { id: spec.id, level: spec.level, statuses: (spec.st || []).slice(), adv: 0, advPerm: 0, cool: {}, spent: {}, last: -1, streak: 0, dead: false };
}
function setupDuel(S) {
  S.fighters = { A: newFighter(S.picks.A[S.duel]), B: newFighter(S.picks.B[S.duel]) };
  S.round = 1; S.rw = { A: 0, B: 0 };
  S.step = 'choose'; S.choice = { A: null, B: null }; S.rolls = { A: null, B: null };
  S.adj = { A: 0, B: 0 }; S.result = null; S.ack = { A: false, B: false };
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
      const picks = (a.picks || []).slice(0, 3);
      if (picks.length !== 3 || picks.some(p => !DB.card(p.id))) return err('Elige 3 Pokémon');
      S.picks[side] = picks.map(p => ({ id: p.id, level: Math.max(1, +p.level || 1), st: (p.st || []).filter(n => E.statusByName(n)) }));
      S.locked[side] = true;
      if (S.locked.A && S.locked.B) { S.phase = 'duel'; S.duel = 0; setupDuel(S); }
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
      if (S.choice.A !== null && S.choice.B !== null) S.step = 'roll';
      return { ok: true };
    }
    case 'roll': {
      if (S.phase !== 'duel' || S.step !== 'roll' || S.rolls[side]) return err('No puedes tirar ahora');
      const f = S.fighters[side], card = DB.card(f.id), mv = E.movesOf(card)[S.choice[side]];
      const faces = E.faces(mv.die);
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
  const effs = (mv.effects || []).map(fxInfo);
  const roll = S.rolls[s];
  const fired = effs.filter(e => e.thr == null || roll.kept >= e.thr);
  return {
    s, f, card, idx, mv, effs, roll, fired, nat: roll.kept,
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

  // Ganador de la ronda
  let winner = null;
  let tieBreak = '';
  if (out.A.total > out.B.total) winner = 'A'; else if (out.B.total > out.A.total) winner = 'B';
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
      const item = { side: s, name: e.name, code: e.code, lado: e.lado, thr: e.thr, fired, outcome: '', text: '' };
      if (!fired) { item.outcome = 'no'; item.text = 'No se activa (sacaste ' + me.nat + ', hacía falta ' + e.thr + ')'; effects.push(item); return; }
      const toOpp = e.lado === 'rival';
      const target = toOpp ? fo : fm;
      const tInfo = toOpp ? op : me;
      const ignored = toOpp && (op.has('Protección') || op.has('Prioridad'));
      if (ignored) { item.outcome = 'ignorado'; item.text = 'El rival lo ignora (' + (op.has('Protección') ? 'Protección' : 'Prioridad') + ')'; effects.push(item); return; }
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
      S.round++; S.step = 'choose'; S.choice = { A: null, B: null }; S.rolls = { A: null, B: null }; S.adj = { A: 0, B: 0 };
      S.result = null; S.ack = { A: false, B: false };
    }
  } else if (S.step === 'duelEnd') {
    const decided = S.duelWins.A >= E.MAX_DUEL_WIN || S.duelWins.B >= E.MAX_DUEL_WIN || S.duel >= 2;
    if (decided) { S.phase = 'done'; S.step = 'done'; S.ack = { A: false, B: false }; }
    else { S.duel++; setupDuel(S); }
  }
}

E.matchWinner = S => (S.duelWins.A > S.duelWins.B ? 'A' : S.duelWins.B > S.duelWins.A ? 'B' : null);

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
