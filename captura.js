/* ============================================================
   Captura: animación de la Poké Ball y calculadora de captura.

   DATO DE CADA POKÉMON: la columna "captura" de data/cards.csv (o del Excel), por ejemplo "4+"
   = número que hay que sacar en el dado con una Poké Ball. Si está vacía, la calculadora te
   deja escribirlo a mano.

   REGLAS DE LAS BOLAS (cartas de captura): están en la tabla BALLS de aquí abajo; edítala si cambian.
   Fórmula: tirada + bonus de la bola + 2 si vences al Pokémon antes  ≥  número de captura.
   ============================================================ */
(function () {
'use strict';
const P = window.PMTU;
const { el, esc } = P;

/* ---------- Bolas (cartas de captura) ----------
   bonus : se SUMA a la tirada de captura al jugar la carta
   cond  : si se cumple, el bonus pasa a ser cond.bonus ("suma 3 en lugar de 1")
           test: 'auto' (la app lo comprueba) o 'manual' (casilla que marcas tú)
   Para cambiar una regla, edita solo esta tabla. */
const DIE = 6;                  // dado de captura
const GLORIA_DIE = 8;           // dado que usa la Gloria Ball (el de la carta); cámbialo si no es un D8
const FIGHT_BONUS = 2;          // bonus por vencer al Pokémon antes de lanzar la bola
const BALLS = [
  { id: 'poke',   name: 'Poké Ball',    bonus: 1, c1: '#e63946', c2: '#f4f4f4' },
  { id: 'super',  name: 'Super Ball',   bonus: 2, c1: '#2f6fe0', c2: '#f4f4f4' },
  { id: 'ultra',  name: 'Ultra Ball',   bonus: 3, c1: '#26262b', c2: '#f4c20d' },
  { id: 'master', name: 'Master Ball',  auto: true, c1: '#7b3fc4', c2: '#f4f4f4', note: 'Captura automática: no hace falta tirar el dado.' },
  { id: 'rapid',  name: 'Rapid Ball',   bonus: 0, c1: '#ee6b6b', c2: '#f4d03f', note: 'Si fallas, puedes repetir la tirada de captura (2 intentos).', retry: true },
  { id: 'safari', name: 'Safari Ball',  bonus: 1, c1: '#8a8a4a', c2: '#f4f4f4', cond: { key: 'yellow', test: 'auto', bonus: 2, label: 'Es un Pokémon de clase Amarilla' } },
  { id: 'sana',   name: 'Sana Ball',    bonus: 1, c1: '#d9b6e8', c2: '#f3e7c4', note: 'Si tienes éxito, puedes revivir a un Pokémon de tu equipo.' },
  { id: 'turno',  name: 'Turno Ball',   bonus: 1, c1: '#3a3a3a', c2: '#f4f4f4', cond: { key: 'long', test: 'auto', bonus: 3, label: 'Has luchado contra él y la batalla duró más de 1 ronda' } },
  { id: 'veloz',  name: 'Veloz Ball',   bonus: 1, c1: '#4a90d9', c2: '#f2d03b', cond: { key: 'nofight', test: 'auto', bonus: 3, label: 'No has combatido contra él' } },
  { id: 'acopio', name: 'Acopio Ball',  bonus: 1, c1: '#e63946', c2: '#f4f4f4', cond: { key: 'sametype', test: 'auto', bonus: 3, label: 'Tienes un Pokémon de su mismo tipo en tu equipo' } },
  { id: 'amigo',  name: 'Amigo Ball',   bonus: 1, c1: '#3aa76d', c2: '#f4f4f4', note: 'El Pokémon capturado gana 1 nivel.' },
  { id: 'buceo',  name: 'Buceo Ball',   bonus: 1, c1: '#6ab7ee', c2: '#e8f3fb', cond: { key: 'surf', test: 'manual', bonus: 3, label: 'Apareció en una zona solo accesible con Surf' } },
  { id: 'gloria', name: 'Gloria Ball',  bonus: 2, c1: '#e04b3a', c2: '#2b2b2b', die: GLORIA_DIE, note: `Se tira un D${GLORIA_DIE} en lugar del dado de seis caras, con +2.` },
  { id: 'amor',   name: 'Amor Ball',    bonus: 1, c1: '#f06ca8', c2: '#f4f4f4', note: 'Si tienes éxito, roba una Carta de Objeto.' },
  { id: 'lujo',   name: 'Lujo Ball',    bonus: 2, c1: '#222222', c2: '#d9b04a', note: 'Si tienes éxito, el Pokémon capturado sube 1 nivel.' },
  { id: 'nido',   name: 'Nido Ball',    bonus: 1, c1: '#7fae6a', c2: '#f4f4f4', cond: { key: 'lowlevel', test: 'auto', bonus: 3, label: 'El Pokémon es de nivel 3 o inferior' } },
  { id: 'nivel',  name: 'Nivel Ball',   bonus: 1, c1: '#f4c20d', c2: '#f4f4f4', cond: { key: 'higher', test: 'auto', bonus: 3, label: 'Has luchado contra él con un Pokémon de nivel superior' } },
  { id: 'ocaso',  name: 'Ocaso Ball',   bonus: 1, c1: '#2e7d32', c2: '#26302a', cond: { key: 'evenmedals', test: 'auto', bonus: 3, label: 'Tienes un número par de medallas (con 0 o impar cuenta +1)' }, medals: true },
  { id: 'peso',   name: 'Peso Ball',    bonus: 1, c1: '#7a7a7a', c2: '#f4f4f4', cond: { key: 'evolved', test: 'auto', bonus: 3, label: 'Es un Pokémon evolucionado' } }
];
const KEY = 'pmtu.ball', KEY_MEDALS = 'pmtu.medals';

/* ---------- Animación de captura (CSS puro, 2,8 s) ---------- */
function catchAnim(host) {
  if (!host) return;
  host.querySelectorAll('.pball').forEach(n => n.remove());
  const ball = el('div', 'pball', '<i class="pb-ring"></i><i class="pb-spark"></i>');
  ball.setAttribute('aria-hidden', 'true');
  host.appendChild(ball);
  const art = host.querySelector('.dart');
  if (art) { art.classList.remove('absorbed'); void art.offsetWidth; art.classList.add('absorbed'); }
  const end = () => { ball.remove(); if (art) art.classList.remove('absorbed'); };
  ball.addEventListener('animationend', e => { if (e.target === ball && e.animationName === 'pbMain') end(); });
  setTimeout(end, 3200);                                   // por si el navegador no anima (movimiento reducido)
}

/* ---------- Calculadora ---------- */
const baseOf = c => { const m = /(\d+)/.exec(c && c.captura || ''); return m ? parseInt(m[1], 10) : null; };
const isEvolved = c => P.CARDS.some(x => (x.evolvesTo || []).includes(c.id));
const rd = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (_) { return d; } };
const wr = (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} };

function ballMini(b) {
  const s = el('span', 'ballico'); s.style.setProperty('--b1', b.c1); s.style.setProperty('--b2', b.c2); return s;
}
function teamSharesType(c) {
  if (!P.team) return false;
  return P.team.list().some(t => { const tc = P.byId.get(t.id); return tc && tc.types.some(x => c.types.includes(x)); });
}

function catchSection(c, onCaught) {
  const sec = el('div', 'dsec catchsec');
  sec.appendChild(el('h3', null, 'Captura'));
  const base0 = baseOf(c);
  const S = {
    ball: BALLS.some(b => b.id === rd(KEY)) ? rd(KEY) : 'poke',
    fight: 'none',                       // none | won | lost
    long: false, higher: false, surf: false,
    medals: parseInt(rd(KEY_MEDALS, '0'), 10) || 0,
    manual: ''
  };

  const fightBox = el('div', 'fightbox');
  const picker = el('div', 'ballpick'); picker.setAttribute('role', 'radiogroup'); picker.setAttribute('aria-label', 'Carta de captura que vas a jugar');
  const out = el('div', 'catchout');
  sec.append(fightBox, el('p', 'hint', 'Carta de captura que vas a jugar:'), picker, out);

  /* 1 · Combate previo */
  function drawFight() {
    fightBox.innerHTML = '';
    fightBox.appendChild(el('p', 'hint', '¿Has combatido contra este Pokémon antes de lanzar la bola? Si lo vences, +' + FIGHT_BONUS + ' a la tirada.'));
    const seg = el('div', 'seg wide');
    [['none', 'Sin combate'], ['won', 'Gané'], ['lost', 'Perdí']].forEach(([k, l]) => {
      const b = el('button', S.fight === k ? 'on' : '', l); b.type = 'button';
      b.onclick = () => { S.fight = k; if (k === 'none') { S.long = S.higher = false; } drawFight(); renderOut(); };
      seg.appendChild(b);
    });
    fightBox.appendChild(seg);
    if (S.fight !== 'none') {
      const l1 = chk('La batalla duró más de 1 ronda', S.long, v => { S.long = v; renderOut(); });
      const l2 = chk('Luché con un Pokémon de nivel superior al suyo', S.higher, v => { S.higher = v; renderOut(); });
      fightBox.append(l1, l2);
    }
    const n = P.team ? P.team.list().length : 0;
    const go = el('button', 'btn wide', '⚔️ Luchar contra ' + esc(c.name) + ' con mi equipo'); go.type = 'button';
    go.disabled = !n || !P.battle;
    go.onclick = () => P.battle.wild(c.id, res => {
      if (res) { S.fight = res.won ? 'won' : 'lost'; S.long = res.rounds > 1; S.higher = res.higher; P.toast(res.won ? '¡Vencido! +' + FIGHT_BONUS + ' a la captura' : c.name + ' ha resistido', res.won ? 'ok' : 'info'); }
      drawFight(); renderOut();
    });
    fightBox.appendChild(go);
    if (!n) fightBox.appendChild(el('p', 'hint', 'Para luchar necesitas al menos 1 Pokémon en Mi Equipo.'));
  }
  function chk(label, val, fn) {
    const l = el('label', 'chk'); const i = el('input'); i.type = 'checkbox'; i.checked = val;
    i.onchange = () => fn(i.checked); l.append(i, document.createTextNode(' ' + label)); return l;
  }

  /* 2 · Elegir bola */
  function drawPicker() {
    picker.innerHTML = '';
    BALLS.forEach(b => {
      const bt = el('button', 'ballbtn' + (b.id === S.ball ? ' on' : '')); bt.type = 'button';
      bt.setAttribute('role', 'radio'); bt.setAttribute('aria-checked', b.id === S.ball);
      bt.appendChild(ballMini(b)); bt.appendChild(el('span', null, esc(b.name.replace(' Ball', '')) + '<br>Ball'));
      bt.onclick = () => { S.ball = b.id; wr(KEY, S.ball); drawPicker(); renderOut(); };
      picker.appendChild(bt);
    });
  }

  /* 3 · Cálculo */
  function condState(b) {
    if (!b.cond) return null;
    const k = b.cond.key, fought = S.fight !== 'none';
    let met = false, why = '';
    if (k === 'yellow') { met = [].concat(c.color || []).includes('yellow'); why = met ? 'es de clase Amarilla' : 'no es de clase Amarilla'; }
    else if (k === 'long') { met = fought && S.long; why = !fought ? 'no has combatido' : met ? 'la batalla duró más de 1 ronda' : 'la batalla duró 1 ronda'; }
    else if (k === 'nofight') { met = !fought; why = met ? 'no has combatido' : 'has combatido'; }
    else if (k === 'sametype') { met = teamSharesType(c); why = met ? 'tienes uno de su tipo en el equipo' : 'ninguno de tu equipo comparte su tipo'; }
    else if (k === 'surf') { met = S.surf; why = met ? 'zona solo accesible con Surf' : 'no es zona de Surf'; }
    else if (k === 'lowlevel') { const lv = c.level || 1; met = lv <= 3; why = 'su nivel es ' + lv; }
    else if (k === 'higher') { met = fought && S.higher; why = !fought ? 'no has combatido' : met ? 'luchaste con nivel superior' : 'sin nivel superior'; }
    else if (k === 'evenmedals') { met = S.medals > 0 && S.medals % 2 === 0; why = S.medals + ' medalla' + (S.medals === 1 ? '' : 's') + (S.medals === 0 ? ' (ninguna)' : met ? ' (par)' : ' (impar)'); }
    else if (k === 'evolved') { met = isEvolved(c); why = met ? 'es un Pokémon evolucionado' : 'no es evolucionado'; }
    return { met, why };
  }

  function row(label, val, note, cls) {
    return `<div class="tk-row ${cls || ''}"><span class="l">${label}${note ? `<small>${note}</small>` : ''}</span><i></i><b>${val}</b></div>`;
  }

  function renderOut() {
    const b = BALLS.find(x => x.id === S.ball);
    out.innerHTML = '';
    // controles extra de la bola elegida
    if (b.cond && b.cond.test === 'manual') out.appendChild(chk(b.cond.label, S[b.cond.key], v => { S[b.cond.key] = v; renderOut(); }));
    if (b.medals) {
      const r = el('div', 'adjrow'); const mi = el('button', 'ibtn', '−'), pl = el('button', 'ibtn', '＋'), val = el('b', null, String(S.medals));
      const set = n => { S.medals = Math.max(0, Math.min(8, n)); wr(KEY_MEDALS, S.medals); renderOut(); };
      mi.onclick = () => set(S.medals - 1); pl.onclick = () => set(S.medals + 1);
      r.append(el('span', null, 'Tus medallas'), mi, val, pl); out.appendChild(r);
    }
    let base = base0;
    if (base == null) {
      const f = el('label', 'field', 'Esta carta aún no tiene tasa de captura. Escribe el número de la carta:');
      const inp = el('input'); inp.type = 'number'; inp.inputMode = 'numeric'; inp.min = 1; inp.max = 12; inp.placeholder = 'p. ej. 4'; inp.value = S.manual;
      inp.oninput = () => { S.manual = inp.value; paint(b, parseInt(inp.value, 10) || null, box); };
      f.appendChild(inp); out.appendChild(f);
      base = parseInt(S.manual, 10) || null;
    }
    const box = el('div', 'ticket cap');
    out.appendChild(box);
    paint(b, base, box);
  }

  function paint(b, base, box) {
    const faces = b.die || DIE;
    let h = `<div class="tk-head">🧾 Captura de ${esc(c.name)}<small>${esc(b.name)}</small></div>`;
    if (b.auto) {
      h += `<div class="tk-final"><span>→ Resultado</span><b>¡Captura automática!</b><small>${esc(b.note)}</small></div>`;
    } else if (base == null) {
      h += '<p class="tk-note">Escribe la tasa de captura para calcular.</p>';
    } else {
      let add = b.bonus, rows = row('Captura de ' + esc(c.name), base + '+', 'número que hay que alcanzar');
      const cs = condState(b);
      if (cs) {
        rows += row('Condición de la ' + esc(b.name), cs.met ? '✔' : '✘', esc(b.cond.label) + ' · ' + esc(cs.why), cs.met ? 'plus' : '');
        if (cs.met) add = b.cond.bonus;
      }
      rows += row(esc(b.name), '+' + add, cs && cs.met ? 'en lugar de +' + b.bonus : (b.id === 'gloria' ? 'y se tira un D' + faces : ''), add ? 'plus' : '');
      const fb = S.fight === 'won' ? FIGHT_BONUS : 0;
      if (S.fight !== 'none') rows += row('Combate previo', S.fight === 'won' ? '+' + FIGHT_BONUS : '+0', S.fight === 'won' ? 'has vencido a ' + esc(c.name) : 'perdiste el combate', fb ? 'plus' : '');
      const total = add + fb, need = Math.max(1, base - total);
      rows += row('Bonificación total a la tirada', '+' + total, '', '');
      h += `<div class="tk-rows">${rows}</div>`;
      const auto = need <= 1, impossible = need > faces;
      const pct1 = auto ? 100 : impossible ? 0 : Math.round(((faces - need + 1) / faces) * 100);
      const pct = b.retry ? Math.round((1 - Math.pow(1 - pct1 / 100, 2)) * 100) : pct1;
      h += `<div class="tk-final"><span>→ Tira 1 D${faces} y necesitas sacar</span><b class="${impossible ? 'hard' : ''}">${auto ? '1 o más' : need + ' o más'}</b>
        <small>${base} − ${total} = ${String(base - total).replace('-', '−')}${base - total < 1 ? ' → cualquier resultado captura' : ''}${impossible ? ' · con un D' + faces + ' no llega: usad vuestra regla' : ' · aprox. ' + pct + ' % de éxito' + (b.retry ? ' (con la repetición)' : '')}</small></div>`;
    }
    if (b.note && !b.auto) h += `<p class="tk-note">ℹ️ ${esc(b.note)}</p>`;
    box.innerHTML = h;
    const caught = el('button', 'btn wide', '✔ ¡Capturado! Añadir a Mi Equipo'); caught.type = 'button'; caught.dataset.nosound = '1';
    caught.onclick = () => onCaught && onCaught();
    box.appendChild(caught);
  }

  drawFight(); drawPicker(); renderOut();
  return sec;
}

P.fx = Object.assign(P.fx || {}, { catchAnim });
P.catchSection = catchSection;
P.BALLS = BALLS;
})();
