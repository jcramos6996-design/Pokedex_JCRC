/* ============================================================
   Árbitro de combate (pantallas). La lógica está en engine.js y la conexión en net.js.
   Modos:  host  = anfitrión (guarda el estado y hace los cálculos)
           guest = invitado (solo envía sus acciones y pinta lo que recibe)
           local = un solo móvil, pasándoselo entre los dos entrenadores
   ============================================================ */
(function () {
'use strict';
const P = window.PMTU, E = window.PMTU_ENGINE, N = window.PMTU_NET;
const $ = (s, r = document) => r.querySelector(s);
const { el, esc } = P;
E.setDB({ card: id => P.byId.get(id) || null, fx: code => P.EFFECTS[P.effKey(code)] || null });

const SAVE = 'pmtu.battle.v1';
const MAX_LV = 10;
const other = E.other;
const sgn = v => (v > 0 ? '+' + v : v < 0 ? '−' + Math.abs(v) : '0');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const cardOf = id => P.byId.get(id);

let M = null;           // sesión de combate actual
let wake = null;

/* ---------- Persistencia (para recuperar el combate si se recarga la página) ---------- */
const store = {
  get() { try { return JSON.parse(localStorage.getItem(SAVE)); } catch (_) { return null; } },
  set(o) { try { localStorage.setItem(SAVE, JSON.stringify(o)); } catch (_) {} },
  clear() { try { localStorage.removeItem(SAVE); } catch (_) {} }
};
function persist() {
  if (!M) return;
  if (M.mode === 'host') store.set({ mode: 'host', code: M.code, S: M.S });
  else if (M.mode === 'local') store.set({ mode: 'local', S: M.S });
  else if (M.mode === 'guest') store.set({ mode: 'guest', code: M.code, name: M.name });
}

/* ---------- Pantalla completa de combate ---------- */
async function lockScreen(on) {
  try {
    if (on && 'wakeLock' in navigator) wake = await navigator.wakeLock.request('screen');
    else if (!on && wake) { await wake.release(); wake = null; }
  } catch (_) {}
}
document.addEventListener('visibilitychange', () => { if (M && document.visibilityState === 'visible') lockScreen(true); });

function openOverlay() {
  $('#battle').hidden = false;
  document.body.classList.add('noscroll');
  lockScreen(true);
}
function closeOverlay() {
  $('#battle').hidden = true;
  document.body.classList.remove('noscroll');
  lockScreen(false);
}
async function leave(ask) {
  if (ask) {
    const ok = await new Promise(res => {
      const dlg = $('#teamDlg'), body = $('#teamDlgBody');
      body.innerHTML = '<h2>¿Salir del combate?</h2><p>Se perderá el combate en curso.</p>';
      const row = el('div', 'dlgrow');
      const no = el('button', 'btn', 'Seguir'); const yes = el('button', 'btn danger', 'Salir');
      no.onclick = () => { dlg.close(); res(false); }; yes.onclick = () => { dlg.close(); res(true); };
      row.append(no, yes); body.appendChild(row); dlg.showModal();
    });
    if (!ok) return;
  }
  if (M && M.link) M.link.close();
  M = null; store.clear(); closeOverlay();
  P.team.refresh();
}
$('#bExit').addEventListener('click', () => leave(!(M && M.S && M.S.phase === 'done')));

/* ============================================================
   Menú (pestaña "Combate" de Mi Equipo)
   ============================================================ */
let joinPrefill = '';
function menu(body) {
  const saved = store.get();
  const name = P.team.name();
  body.appendChild(el('div', 'bmenu', `
    <h2>Combate contra entrenador</h2>
    <p class="hint">3 contra 3. Cada duelo entre dos Pokémon es al mejor de 3 rondas. Gana el combate quien gane 2 duelos. La app hace las cuentas; tú solo eliges y tiras.</p>
    <label class="field">Tu nombre<input id="bName" maxlength="20" placeholder="Ash" value="${esc(name)}" autocomplete="off"></label>
    <div class="bcard"><h3>Crear sala</h3><p>Tú serás el anfitrión. Te sale un código para que tu rival lo escriba en su móvil.</p><button class="btn primary wide" id="bHost">Crear sala</button></div>
    <div class="bcard"><h3>Unirme a una sala</h3><p>Escribe el código que te da tu rival.</p>
      <div class="inrow"><input id="bCode" maxlength="5" placeholder="CÓDIGO" autocapitalize="characters" autocomplete="off" value="${esc(joinPrefill)}"><button class="btn primary" id="bJoin">Unirme</button></div></div>
    <div class="bcard"><h3>Un solo móvil</h3><p>Os pasáis el móvil: la app tapa la pantalla para que no veáis lo que elige el otro.</p>
      <label class="field">Nombre del rival<input id="bName2" maxlength="20" placeholder="Brock" autocomplete="off"></label>
      <button class="btn wide" id="bLocal">Empezar con un móvil</button></div>
    <div id="bResume"></div>`));
  const nm = () => { const v = $('#bName').value.trim() || 'Entrenador'; P.team.setName($('#bName').value.trim()); return v; };
  $('#bHost').onclick = () => startHost(nm());
  $('#bJoin').onclick = () => { const c = N.normCode($('#bCode').value); if (c.length < 4) return P.toast('Escribe el código de la sala'); startGuest(c, nm()); };
  $('#bLocal').onclick = () => startLocal(nm(), $('#bName2').value.trim() || 'Rival');
  if (saved && saved.S !== undefined || (saved && saved.mode === 'guest')) {
    const lbl = saved.mode === 'local' ? 'un móvil' : 'sala ' + saved.code;
    const r = el('div', 'bcard resume', `<h3>Combate sin terminar</h3><p>${esc(lbl)}</p>`);
    const go = el('button', 'btn primary wide', 'Reanudar'); const del = el('button', 'btn wide', 'Descartar');
    go.onclick = () => resume(saved); del.onclick = () => { store.clear(); P.team.refresh(); };
    r.append(go, del); $('#bResume').appendChild(r);
  }
}

/* ---------- Arranque de sesiones ---------- */
const newM = o => Object.assign({ pickBy: { A: [], B: [] }, ui: {}, uiKey: '', status: '', err: '', takenTries: 0, cur: 'A', covered: null }, o);

function startHost(name, code, S) {
  M = newM({ mode: 'host', side: 'A', code: code || N.newCode(), S: S || E.create() });
  if (!S) E.apply(M.S, 'A', { type: 'hello', name });
  openOverlay(); connectHost(); sync();
}
function connectHost() {
  if (M.link) M.link.close();
  const mine = M;
  M.link = N.open({
    role: 'host', code: M.code,
    onMsg: m => { if (M === mine) hostMsg(m); },
    onStatus: (s, d) => { if (M === mine) hostStatus(s, d); }
  });
}
function hostStatus(s, d) {
  if (s === 'error' && d === 'taken') {
    if (M.takenTries++ < 4) { setTimeout(() => { if (M && M.mode === 'host') connectHost(); }, 2500); M.status = 'wait'; }
    else if (M.S.phase === 'lobby' && !M.S.joined.B) { M.code = N.newCode(); M.takenTries = 0; connectHost(); }
    else { M.status = 'error'; M.err = 'No se pudo recuperar la sala. Sal y crea una nueva.'; }
  } else if (s === 'error') { M.status = 'error'; M.err = d === 'network' ? 'No hay conexión con el servicio de salas. Revisa tu internet.' : 'No se pudo abrir la sala (' + d + ').'; }
  else { M.status = s; M.err = ''; }
  render();
}
function hostMsg(m) {
  if (m.t === '_open') { sendState(); return; }
  if (m.t !== 'act' || !m.a) return;
  if (m.a.type === 'start') return;                        // solo el anfitrión arranca
  const r = E.apply(M.S, 'B', m.a);
  if (!r.ok) M.link.send({ t: 'err', err: r.err });
  sync();
}
function sendState() { if (M.link) M.link.send({ t: 'state', S: E.view(M.S, 'B') }); }
function sync() { persist(); if (M.mode === 'host') sendState(); render(); }

function startGuest(code, name) {
  M = newM({ mode: 'guest', side: 'B', code, name, V: null });
  openOverlay(); persist();
  const mine = M;
  M.link = N.open({
    role: 'guest', code,
    onMsg: m => {
      if (M !== mine) return;
      if (m.t === '_open') M.link.send({ t: 'act', a: { type: 'hello', name: M.name } });
      else if (m.t === 'state') { M.V = m.S; M.err = ''; render(); }
      else if (m.t === 'err') P.toast(m.err);
    },
    onStatus: (s, d) => {
      if (M !== mine) return;
      M.status = s;
      if (s === 'error') M.err = d === 'network' ? 'No hay conexión con el servicio de salas. Revisa tu internet.' : 'No se pudo conectar (' + d + ').';
      else if (d === 'nohost') M.err = 'No encuentro la sala ' + code + '. Revisa el código y que tu rival la haya creado.';
      else if (s === 'up') M.err = '';
      render();
    }
  });
  render();
}

function startLocal(n1, n2) {
  M = newM({ mode: 'local', S: E.create() });
  E.apply(M.S, 'A', { type: 'hello', name: n1 });
  E.apply(M.S, 'B', { type: 'hello', name: n2 });
  E.apply(M.S, 'A', { type: 'start' });
  M.cur = localCur();
  openOverlay(); persist(); render();
}
function resume(s) {
  if (s.mode === 'host') startHost('', s.code, s.S);
  else if (s.mode === 'guest') startGuest(s.code, s.name);
  else { M = newM({ mode: 'local', S: s.S }); M.cur = localCur(); openOverlay(); render(); }
}

/* ---------- Enviar acciones ---------- */
function localCur() {
  const S = M.S, pa = E.pending(S, 'A'), pb = E.pending(S, 'B');
  if (pa && !pb) return 'A';
  if (pb && !pa) return 'B';
  return M.cur && E.pending(S, M.cur) ? M.cur : 'A';
}
function dispatch(a) {
  if (M.mode === 'guest') {
    if (!M.link || !M.link.send({ t: 'act', a })) P.toast('Sin conexión con el rival. Reintentando…');
    return;
  }
  const side = M.mode === 'host' ? 'A' : M.cur;
  const r = E.apply(M.S, side, a);
  if (!r.ok) { P.toast(r.err); return; }
  if (M.mode === 'local') M.cur = localCur();
  sync();
}
function ackBoth() {
  if (M.mode === 'local') { E.apply(M.S, 'A', { type: 'ack' }); E.apply(M.S, 'B', { type: 'ack' }); M.cur = localCur(); sync(); }
  else dispatch({ type: 'ack' });
}
function rematch() {
  const old = M.S, S = E.create(old.opts);
  S.names = old.names; S.joined = old.joined; S.phase = 'pick';
  M.S = S; M.pickBy = { A: [], B: [] }; M.cur = 'A'; M.covered = null; sync();
}

/* ============================================================
   Pintado
   ============================================================ */
const nameOf = (V, s) => V.names[s] || (s === 'A' ? 'Entrenador A' : 'Entrenador B');
function fightName(V, s) { const f = V.fighters && V.fighters[s]; return f && cardOf(f.id) ? cardOf(f.id).name : ''; }

function connBadge() {
  const c = $('#bConn');
  if (!M) { c.textContent = ''; return; }
  const m = { wait: ['🟡', M.mode === 'host' ? 'Esperando rival' : 'Conectando'], up: ['🟢', 'Conectado'], down: ['🔴', M.mode === 'host' ? 'Rival desconectado' : 'Reconectando…'], error: ['🔴', 'Sin conexión'] }[M.status];
  c.textContent = M.mode === 'local' ? '📱 1 móvil' : (m ? m[0] + ' ' + m[1] : '');
}

function render() {
  if (!M) return;
  const body = $('#bBody');
  connBadge();
  $('#bTitle').textContent = M.mode === 'local' ? 'Combate · un móvil' : 'Combate · sala ' + M.code;
  let side, V;
  if (M.mode === 'guest') {
    side = 'B'; V = M.V;
    if (!V) {
      body.innerHTML = '';
      body.appendChild(el('div', 'bwait', `<div class="spin"></div><h2>Conectando con la sala ${esc(M.code)}…</h2><p>${esc(M.err || 'Un momento.')}</p>`));
      return;
    }
  } else if (M.mode === 'host') { side = 'A'; V = E.view(M.S, 'A'); }
  else { side = M.cur; V = E.view(M.S, side); }
  M.side = side;

  const key = [V.phase, V.duel, V.round, V.step, side].join('|');
  if (key !== M.uiKey) { M.uiKey = key; M.ui = { adj: 0, phys: false, vals: [], sel: null, anim: false }; }

  body.innerHTML = '';
  const scroll = body.scrollTop;
  const secret = V.phase === 'pick' || (V.phase === 'duel' && V.step === 'choose');
  if (M.mode === 'local' && secret && M.covered !== side) { viewCover(body, V, side); return; }
  if (!secret) M.covered = null;

  if (V.phase === 'lobby') viewLobby(body, V, side);
  else if (V.phase === 'pick') viewPick(body, V, side);
  else if (V.phase === 'duel') viewDuel(body, V, side);
  else viewDone(body, V, side);
  if (M.err) body.prepend(el('div', 'berr', esc(M.err)));
  body.scrollTop = key === M.lastKey ? scroll : 0;
  M.lastKey = key;
}

/* ---------- Pantalla de relevo (un solo móvil) ---------- */
function viewCover(body, V, side) {
  const w = el('div', 'bcover', `<div class="lock">🔒</div><h2>Turno de ${esc(nameOf(V, side))}</h2><p>Pasa el móvil a <b>${esc(nameOf(V, side))}</b>. El otro entrenador, que no mire.</p>`);
  const b = el('button', 'btn primary wide', 'Soy ' + esc(nameOf(V, side)));
  b.onclick = () => { M.covered = side; render(); };
  w.appendChild(b); body.appendChild(w);
}

/* ---------- Sala de espera ---------- */
function viewLobby(body, V, side) {
  const w = el('div', 'blobby');
  if (M.mode === 'host') {
    const link = location.origin + location.pathname + '?sala=' + M.code + (N.mode() === 'bc' ? '&net=bc' : '');
    w.innerHTML = `<h2>Sala creada</h2><p>Dile a tu rival que pulse <b>Combate → Unirme</b> y escriba este código:</p>
      <div class="bigcode" id="bCodeBig">${esc(M.code)}</div>`;
    const row = el('div', 'dlgrow');
    const cp = el('button', 'btn', '📋 Copiar enlace'); cp.onclick = async () => {
      try { if (navigator.share) await navigator.share({ title: 'Combate Pokémon', text: 'Únete a mi combate: código ' + M.code, url: link }); else { await navigator.clipboard.writeText(link); P.toast('Enlace copiado'); } } catch (_) { }
    };
    row.appendChild(cp); w.appendChild(row);
    w.appendChild(el('div', 'who', `<div class="${V.joined.A ? 'ok' : ''}">${V.joined.A ? '✔' : '…'} ${esc(nameOf(V, 'A'))} <small>(tú)</small></div>
      <div class="${V.joined.B ? 'ok' : ''}">${V.joined.B ? '✔ ' + esc(nameOf(V, 'B')) : '⏳ Esperando a tu rival…'}</div>`));
    const opt = el('label', 'field', 'Si un ataque no hace efecto por tipo (inmune)');
    const sel = el('select'); Object.entries(E.IMMUNE_MODES).forEach(([k, v]) => { const o = el('option', null, esc(v)); o.value = k; if (V.opts.immune === k) o.selected = true; sel.appendChild(o); });
    sel.onchange = () => dispatch({ type: 'opts', opts: { immune: sel.value } });
    opt.appendChild(sel); w.appendChild(opt);
    const go = el('button', 'btn primary wide', 'Empezar combate'); go.disabled = !(V.joined.A && V.joined.B);
    go.onclick = () => dispatch({ type: 'start' }); w.appendChild(go);
  } else {
    w.innerHTML = `<h2>¡Conectado!</h2><p>Estás en la sala <b>${esc(M.code)}</b>.</p>
      <div class="who"><div class="ok">✔ ${esc(nameOf(V, 'A'))} <small>(anfitrión)</small></div><div class="ok">✔ ${esc(nameOf(V, 'B'))} <small>(tú)</small></div></div>
      <div class="bwait"><div class="spin"></div><p>Esperando a que el anfitrión empiece el combate…</p></div>`;
  }
  body.appendChild(w);
}

/* ---------- Elección secreta de 3 Pokémon ---------- */
function thumbCard(c, small) {
  const d = el('div', 'bthumb' + (small ? ' s' : ''));
  d.appendChild(P.artEl(c)); return d;
}
function typesRow(c) { const s = el('span', 'ticons'); c.types.forEach(t => s.appendChild(P.typeIcon(t))); return s; }

function openDexPicker(onPick) {
  const dlg = $('#teamDlg'), body = $('#teamDlgBody');
  body.innerHTML = '<h2>Elegir del Pokédex</h2><p class="hint">Para líderes de gimnasio o Pokémon que no estén en tu equipo.</p>';
  const inp = el('input', 'dsearch'); inp.placeholder = 'Nombre o número'; inp.autocomplete = 'off'; body.appendChild(inp);
  const list = el('div', 'dlist'); body.appendChild(list);
  const draw = () => {
    const q = inp.value.trim().toLowerCase();
    const res = P.CARDS.filter(c => !q || c.name.toLowerCase().includes(q) || c.id.includes(q)).slice(0, 40);
    list.innerHTML = '';
    res.forEach(c => {
      const b = el('button', 'dopt'); b.type = 'button';
      b.appendChild(thumbCard(c, true));
      b.appendChild(el('span', 'dn', `<b>${esc(c.name)}</b><small>#${esc(c.id)} · Nv ${c.level || 1}</small>`));
      b.onclick = () => { dlg.close(); onPick(c); };
      list.appendChild(b);
    });
    if (!res.length) list.appendChild(el('p', 'empty', 'Sin resultados'));
  };
  inp.oninput = draw; draw();
  const no = el('button', 'btn wide', 'Cerrar'); no.onclick = () => dlg.close(); body.appendChild(no);
  dlg.showModal();
}

function viewPick(body, V, side) {
  const o = other(side), w = el('div', 'bpick');
  const myLocked = V.locked[side];
  const oppLine = el('div', 'oppline ' + (V.locked[o] ? 'ok' : ''), V.locked[o] ? `✔ ${esc(nameOf(V, o))} ya ha elegido` : `⏳ ${esc(nameOf(V, o))} está eligiendo…`);
  if (M.mode === 'local') oppLine.hidden = true;
  w.appendChild(el('h2', null, myLocked ? 'Equipo confirmado' : 'Elige tus 3 Pokémon'));
  w.appendChild(el('p', 'hint', 'Es en secreto: tu rival no verá tu elección hasta que los dos confirméis. El 1.º lucha en el duelo 1, el 2.º en el duelo 2 y el 3.º en el duelo 3.'));
  w.appendChild(oppLine);

  if (myLocked) {
    const l = el('div', 'slots'); V.picks[side].forEach((p, i) => l.appendChild(slotRow(p, i, null)));
    w.appendChild(l);
    if (M.mode !== 'local') {
      w.appendChild(el('div', 'bwait', '<div class="spin"></div><p>Esperando a que tu rival confirme…</p>'));
      const b = el('button', 'btn wide', 'Cambiar mi elección'); b.onclick = () => dispatch({ type: 'unlock' }); w.appendChild(b);
    }
    body.appendChild(w); return;
  }

  const sel = M.pickBy[side];
  const slots = el('div', 'slots');
  for (let i = 0; i < 3; i++) {
    const p = sel[i];
    if (p) slots.appendChild(slotRow(p, i, {
      up: () => { if (i > 0) { [sel[i - 1], sel[i]] = [sel[i], sel[i - 1]]; render(); } },
      down: () => { if (i < sel.length - 1) { [sel[i + 1], sel[i]] = [sel[i], sel[i + 1]]; render(); } },
      del: () => { sel.splice(i, 1); render(); },
      lv: d => { p.level = clamp(p.level + d, 1, MAX_LV); render(); }
    }));
    else slots.appendChild(el('div', 'trow empty', `<span>Hueco ${i + 1}: elige abajo</span>`));
  }
  w.appendChild(slots);

  const addable = sel.length < 3;
  const team = P.team.list();
  const sec = el('div', 'bsec'); sec.appendChild(el('h3', null, M.mode === 'local' ? 'Equipo guardado en este móvil' : 'De Mi Equipo'));
  if (!team.length) sec.appendChild(el('p', 'hint', 'Tu equipo está vacío. Añade Pokémon desde la Pokédex o elige del Pokédex abajo.'));
  const grid = el('div', 'pickgrid');
  team.forEach(t => {
    const used = sel.some(p => p.uid === t.uid);
    const b = el('button', 'pickitem'); b.type = 'button'; b.disabled = used || !addable;
    b.appendChild(thumbCard(cardOf(t.id), true));
    b.appendChild(el('em', null, esc(t.name) + ' · Nv ' + t.level));
    b.onclick = () => { sel.push({ id: t.id, level: t.level, uid: t.uid, src: 'team' }); render(); };
    grid.appendChild(b);
  });
  sec.appendChild(grid); w.appendChild(sec);

  const dex = el('button', 'btn wide', '📖 Elegir del Pokédex (líder de gimnasio)'); dex.disabled = !addable;
  dex.onclick = () => openDexPicker(c => { sel.push({ id: c.id, level: c.level || 1, src: 'dex' }); render(); });
  w.appendChild(dex);

  const ok = el('button', 'btn primary wide big', '🔒 Confirmar en secreto (' + sel.length + '/3)'); ok.disabled = sel.length !== 3;
  ok.onclick = () => dispatch({ type: 'lock', picks: sel.map(p => ({ id: p.id, level: p.level })) });
  w.appendChild(ok);
  body.appendChild(w);
}
function slotRow(p, i, ctl) {
  const c = cardOf(p.id);
  const r = el('div', 'trow');
  r.appendChild(el('div', 'slotn', String(i + 1)));
  r.appendChild(thumbCard(c, true));
  const info = el('div', 'tinfo', `<div class="tname"><b>${esc(c.name)}</b> <span>#${esc(c.id)}</span></div>`);
  info.firstChild.appendChild(typesRow(c));
  const lv = el('div', 'tlvl');
  if (ctl && p.src === 'dex') {
    const m = el('button', 'ibtn', '−'), pl = el('button', 'ibtn', '＋'); m.onclick = () => ctl.lv(-1); pl.onclick = () => ctl.lv(1);
    lv.append(m, el('span', 'lvnum', 'Nivel <b>' + p.level + '</b>'), pl);
  } else lv.appendChild(el('span', 'lvnum', 'Nivel <b>' + p.level + '</b>'));
  info.appendChild(lv); r.appendChild(info);
  if (ctl) {
    const a = el('div', 'tact');
    [['▲', 'Subir', ctl.up], ['▼', 'Bajar', ctl.down], ['✕', 'Quitar', ctl.del]].forEach(([t, l, f]) => { const b = el('button', 'ibtn', t); b.setAttribute('aria-label', l); b.onclick = f; a.appendChild(b); });
    r.appendChild(a);
  }
  return r;
}

/* ============================================================
   Duelo
   ============================================================ */
function fighterPanel(V, s, mine) {
  const f = V.fighters[s], c = cardOf(f.id);
  const d = el('div', 'fgt ' + (mine ? 'mine' : 'opp') + (f.dead ? ' dead' : ''));
  d.appendChild(thumbCard(c, true));
  const info = el('div', 'fi');
  info.appendChild(el('div', 'fn', `<b>${esc(c.name)}</b> · Nv ${f.level}`));
  info.firstChild.appendChild(typesRow(c));
  info.appendChild(el('div', 'ft', esc(nameOf(V, s)) + (mine ? ' (tú)' : '')));
  const st = el('div', 'fst');
  f.statuses.forEach(x => st.appendChild(el('span', 'stp', esc(x))));
  const adv = clamp(f.adv + f.advPerm, -2, 2);
  if (adv > 0) st.appendChild(el('span', 'stp good', adv > 1 ? 'Doble Ventaja' : 'Ventaja'));
  if (adv < 0) st.appendChild(el('span', 'stp bad', adv < -1 ? 'Doble Desventaja' : 'Desventaja'));
  if (f.dead) st.appendChild(el('span', 'stp bad', 'Debilitado'));
  info.appendChild(st);
  if (c.ability) info.appendChild(el('div', 'fab', `<b>${esc(c.ability)}</b>${c.abilityDesc ? ': ' + esc(c.abilityDesc) : ''}`));
  d.appendChild(info);
  return d;
}

function scoreBar(V, side) {
  const o = other(side);
  const dots = s => [0, 1].map(i => `<i class="${V.duelWins[s] > i ? 'on' : ''}"></i>`).join('');
  const rd = s => [0, 1].map(i => `<i class="${V.rw[s] > i ? 'on' : ''}"></i>`).join('');
  return el('div', 'score', `
    <div class="sc"><span>Duelo ${V.duel + 1} de 3</span><div class="pts"><em>${esc(nameOf(V, side))}</em>${dots(side)}<em>${esc(nameOf(V, o))}</em>${dots(o)}</div></div>
    <div class="sc"><span>Ronda ${V.round}</span><div class="pts rnd"><em>${esc(fightName(V, side))}</em>${rd(side)}<em>${esc(fightName(V, o))}</em>${rd(o)}</div></div>`);
}

function viewDuel(body, V, side) {
  const o = other(side), w = el('div', 'bduel');
  w.appendChild(scoreBar(V, side));
  const arena = el('div', 'arena');
  arena.append(fighterPanel(V, o, false), el('div', 'vs', 'VS'), fighterPanel(V, side, true));
  w.appendChild(arena);
  if (V.step === 'choose') viewChoose(w, V, side);
  else if (V.step === 'roll') viewRoll(w, V, side);
  else if (V.step === 'result') viewResult(w, V, side);
  else if (V.step === 'duelEnd') viewDuelEnd(w, V, side);
  body.appendChild(w);
}

function effChips(mv) {
  const d = el('span', 'mfx');
  (mv.effects || []).forEach(code => d.appendChild(P.effectChip(code, mv.name)));
  return d;
}

function viewChoose(w, V, side) {
  const o = other(side), oc = cardOf(V.fighters[o].id), mine = V.choice[side];
  w.appendChild(el('h2', null, mine !== null ? 'Ataque elegido' : 'Elige tu ataque'));
  const av = E.availableMoves(V, side);
  const list = el('div', 'moves');
  av.forEach(a => {
    const m = a.m, pv = E.typePreview(m.type, oc.types), chosen = mine === a.i, sel = M.ui.sel === a.i;
    const b = el('button', 'mv' + (chosen || sel ? ' sel' : '') + (!a.ok ? ' off' : '')); b.type = 'button';
    b.disabled = mine !== null || !a.ok;
    const top = el('div', 'mvtop');
    if (m.type) top.appendChild(P.typeIcon(m.type));
    top.appendChild(el('b', null, esc(m.name)));
    top.appendChild(el('span', 'mdie', esc(m.die || 'D6') + ' · Pot. ' + esc(m.power == null || m.power === '' ? '0' : m.power)));
    b.appendChild(top);
    const bot = el('div', 'mvbot');
    if (pv && E.power(m.power) !== 0) bot.appendChild(el('span', 'pv ' + (pv.mult > 1 ? 'up' : pv.mult < 1 ? 'down' : ''), 'Tipo ' + esc(pv.label)));
    bot.appendChild(effChips(m));
    if (!a.ok) bot.appendChild(el('small', 'why', esc(a.why)));
    b.appendChild(bot);
    b.onclick = e => { if (e.target.closest('.fx')) { P.openEffect(e.target.closest('.fx').dataset.code, m.name); return; } M.ui.sel = a.i; render(); };
    list.appendChild(b);
  });
  w.appendChild(list);
  if (mine === null) {
    const ok = el('button', 'btn primary wide big', 'Confirmar ataque'); ok.disabled = M.ui.sel == null;
    ok.onclick = () => dispatch({ type: 'choose', idx: M.ui.sel });
    w.appendChild(ok);
    w.appendChild(el('p', 'hint', 'Toca un icono de efecto para ver qué hace. Tu rival no sabrá tu ataque hasta que los dos tiréis el dado.'));
  } else if (M.mode !== 'local') {
    w.appendChild(el('div', 'bwait', `<div class="spin"></div><p>${V.choice[o] === null ? 'Esperando a que ' + esc(nameOf(V, o)) + ' elija…' : '¡Todo listo!'}</p>`));
  }
}

function viewRoll(w, V, side) {
  const o = other(side), f = V.fighters[side], mv = E.movesOf(cardOf(f.id))[V.choice[side]];
  const faces = E.faces(mv.die), adv = clamp(f.adv + f.advPerm, -2, 2), n = 1 + Math.abs(adv);
  const mine = V.rolls[side];
  w.appendChild(el('h2', null, mine ? 'Dado lanzado' : 'Tira el dado'));
  const mc = el('div', 'mychoice'); if (mv.type) mc.appendChild(P.typeIcon(mv.type));
  mc.appendChild(el('span', null, `<b>${esc(mv.name)}</b> · ${esc(mv.die || 'D6')} · Pot. ${esc(mv.power == null || mv.power === '' ? '0' : mv.power)}`));
  mc.appendChild(effChips(mv)); w.appendChild(mc);
  mc.onclick = e => { const b = e.target.closest('.fx'); if (b) P.openEffect(b.dataset.code, mv.name); };

  const tray = el('div', 'dice');
  if (mine) {
    mine.dice.forEach(d => tray.appendChild(el('div', 'die' + (mine.dice.length > 1 && d === mine.kept ? ' kept' : ''), String(d))));
    w.appendChild(tray);
    if (mine.dice.length > 1) w.appendChild(el('p', 'hint', (mine.adv > 0 ? 'Ventaja: cuenta el mayor.' : 'Desventaja: cuenta el menor.') + ' Cuenta el ' + mine.kept + '.'));
    if (M.mode !== 'local') w.appendChild(el('div', 'bwait', `<div class="spin"></div><p>Esperando a que ${esc(nameOf(V, o))} tire su dado…</p>`));
    return;
  }
  if (adv !== 0) w.appendChild(el('p', 'advnote ' + (adv > 0 ? 'good' : 'bad'), adv > 0 ? `Ventaja: tira ${n} dados y cuenta el mayor.` : `Desventaja: tira ${n} dados y cuenta el menor.`));
  for (let i = 0; i < n; i++) tray.appendChild(el('div', 'die ghost', '?'));
  w.appendChild(tray);

  const phys = el('label', 'chk'); const cb = el('input'); cb.type = 'checkbox'; cb.checked = M.ui.phys;
  cb.onchange = () => { M.ui.phys = cb.checked; render(); };
  phys.append(cb, document.createTextNode(' Voy a usar mi dado físico'));
  w.appendChild(phys);
  if (M.ui.phys) {
    const row = el('div', 'physrow');
    for (let i = 0; i < n; i++) {
      const inp = el('input'); inp.type = 'number'; inp.inputMode = 'numeric'; inp.min = 1; inp.max = faces; inp.placeholder = 'D' + faces;
      inp.value = M.ui.vals[i] || ''; inp.oninput = () => { M.ui.vals[i] = inp.value; go.disabled = !valid(); };
      row.appendChild(inp);
    }
    w.appendChild(row);
  }
  const adjRow = el('div', 'adjrow');
  const mi = el('button', 'ibtn', '−'), pl = el('button', 'ibtn', '＋'), val = el('b', null, sgn(M.ui.adj));
  mi.onclick = () => { M.ui.adj = clamp(M.ui.adj - 1, -9, 9); val.textContent = sgn(M.ui.adj); };
  pl.onclick = () => { M.ui.adj = clamp(M.ui.adj + 1, -9, 9); val.textContent = sgn(M.ui.adj); };
  adjRow.append(el('span', null, 'Ajuste manual al total<small>para efectos que la app no calcula</small>'), mi, val, pl);
  w.appendChild(adjRow);

  const valid = () => !M.ui.phys || (M.ui.vals.length >= n && Array.from({ length: n }, (_, i) => +M.ui.vals[i]).every(x => Number.isInteger(x) && x >= 1 && x <= faces));
  const go = el('button', 'btn primary wide big', '🎲 Tirar dado'); go.disabled = !valid();
  go.onclick = () => {
    const manual = M.ui.phys ? Array.from({ length: n }, (_, i) => +M.ui.vals[i]) : undefined;
    if (manual) return dispatch({ type: 'roll', adj: M.ui.adj, manual });
    go.disabled = true;
    const dice = tray.querySelectorAll('.die'); let k = 0;
    dice.forEach(d => d.classList.add('rolling'));
    const iv = setInterval(() => { dice.forEach(d => { d.textContent = String(1 + Math.floor(Math.random() * faces)); }); if (++k > 9) { clearInterval(iv); dispatch({ type: 'roll', adj: M.ui.adj }); } }, 70);
  };
  w.appendChild(go);
}

/* ---------- Resultado de la ronda ---------- */
function sideCard(V, s, mine) {
  const R = V.result[s], f = V.fighters[s], c = cardOf(f.id);
  const d = el('div', 'rcard ' + (V.result.winner === s ? 'win' : V.result.winner ? 'lose' : 'tie'));
  d.appendChild(el('div', 'rhead', `<b>${esc(c.name)}</b><span>${esc(nameOf(V, s))}${mine ? ' (tú)' : ''}</span><em>${esc(R.move)}</em>`));
  const t = el('table', 'rows');
  R.rows.forEach((r, i) => {
    const plain = ['nivel', 'potencia', 'dado'].includes(r.k);
    const tr = el('tr', r.v < 0 ? 'neg' : r.v > 0 && !plain ? 'plus' : '');
    tr.appendChild(el('td', null, esc(r.label) + (r.note ? `<small>${esc(r.note)}</small>` : '')));
    tr.appendChild(el('td', 'v', plain ? String(r.v) : sgn(r.v)));
    t.appendChild(tr);
  });
  d.appendChild(t);
  d.appendChild(el('div', 'total', `<span>Total</span><b>${R.total}</b>`));
  return d;
}
function fxText(V, it) {
  const tgt = it.lado === 'rival' ? other(it.side) : it.side;
  const nm = fightName(V, tgt);
  return it.text.replace(/^(El rival|Tu Pokémon)/, nm);
}
function viewResult(w, V, side) {
  const o = other(side), R = V.result;
  const banner = R.winner ? `¡Ronda para ${esc(fightName(V, R.winner))}!` : 'Empate: nadie suma ronda';
  w.appendChild(el('div', 'banner ' + (R.winner === side ? 'win' : R.winner ? 'lose' : 'tie'), banner + `<small>${R.winner ? esc(nameOf(V, R.winner)) : ''}</small>`));
  w.appendChild(sideCard(V, side, true));
  w.appendChild(sideCard(V, o, false));
  if (R.effects.length) {
    const sec = el('div', 'bsec'); sec.appendChild(el('h3', null, 'Efectos'));
    R.effects.forEach(it => {
      const row = el('div', 'fxrow ' + it.outcome);
      const who = fightName(V, it.side);
      row.innerHTML = `<b>${esc(it.name)}${it.thr ? ' ' + it.thr + '+' : ''}</b><span class="by">${esc(who)}</span><p>${esc(fxText(V, it))}</p>`;
      sec.appendChild(row);
    });
    w.appendChild(sec);
  }
  const notes = [].concat(R.A.notes.map(n => [fightName(V, 'A'), n]), R.B.notes.map(n => [fightName(V, 'B'), n]));
  if (notes.length) {
    const sec = el('div', 'bsec'); sec.appendChild(el('h3', null, 'Ojo: a mano'));
    notes.forEach(([n, t]) => sec.appendChild(el('p', 'note', `<b>${esc(n)}:</b> ${esc(t)}`)));
    w.appendChild(sec);
  }
  ['A', 'B'].forEach(s => { if (R.dead[s]) w.appendChild(el('div', 'ko', `${esc(fightName(V, s))} se ha debilitado`)); });
  w.appendChild(ackBtn(V, side, R.winner && (V.rw.A >= 2 || V.rw.B >= 2) || R.dead.A || R.dead.B ? 'Ver resultado del duelo' : 'Siguiente ronda'));
}
function ackBtn(V, side, label) {
  const frag = el('div', 'ackwrap');
  const done = M.mode !== 'local' && V.ack[side];
  const b = el('button', 'btn primary wide big', esc(label)); b.disabled = done;
  b.onclick = () => ackBoth();
  frag.appendChild(b);
  if (done) frag.appendChild(el('div', 'bwait', `<div class="spin"></div><p>Esperando a ${esc(nameOf(V, other(side)))}…</p>`));
  return frag;
}

function viewDuelEnd(w, V, side) {
  const d = V.duels[V.duel], o = other(side);
  w.appendChild(el('div', 'banner ' + (d.winner === side ? 'win' : 'lose'),
    `¡${esc(fightName(V, d.winner))} gana el duelo ${V.duel + 1}!<small>${esc(nameOf(V, d.winner))} · rondas ${d.rw[side]}–${d.rw[o]}${d.ko ? ' · KO' : ''}</small>`));
  w.appendChild(el('div', 'bigscore', `<div><em>${esc(nameOf(V, side))}</em><b>${V.duelWins[side]}</b></div><span>duelos</span><div><em>${esc(nameOf(V, o))}</em><b>${V.duelWins[o]}</b></div>`));
  const over = V.duelWins.A >= 2 || V.duelWins.B >= 2 || V.duel >= 2;
  if (!over && V.picks.A && V.picks.B) {
    const n = V.duel + 1, a = cardOf(V.picks[side][n].id), b = cardOf(V.picks[o][n].id);
    w.appendChild(el('p', 'hint', `Siguiente duelo: ${esc(a.name)} contra ${esc(b.name)}.`));
  }
  w.appendChild(ackBtn(V, side, over ? 'Ver resultado final' : 'Siguiente duelo'));
}

/* ---------- Final ---------- */
function viewDone(body, V, side) {
  const o = other(side), win = E.matchWinner(V), w = el('div', 'bdone');
  w.appendChild(el('div', 'banner big ' + (win === side ? 'win' : win ? 'lose' : 'tie'),
    win ? `¡Gana ${esc(nameOf(V, win))}!<small>${V.duelWins.A}–${V.duelWins.B} en duelos</small>` : 'Combate empatado'));
  const l = el('div', 'bsec'); l.appendChild(el('h3', null, 'Duelos'));
  V.duels.forEach((d, i) => {
    const a = cardOf(d.ids[side]), b = cardOf(d.ids[o]);
    l.appendChild(el('div', 'duelrow ' + (d.winner === side ? 'win' : 'lose'), `<span>${i + 1}</span><b>${esc(a.name)}</b><em>${d.rw[side]}–${d.rw[o]}</em><b>${esc(b.name)}</b><i>${d.winner === side ? '✔' : '✘'}</i>`));
  });
  w.appendChild(l);
  const row = el('div', 'dlgrow');
  if (M.mode !== 'guest') { const r = el('button', 'btn', '🔁 Revancha'); r.onclick = rematch; row.appendChild(r); }
  const x = el('button', 'btn primary', 'Terminar'); x.onclick = () => leave(false); row.appendChild(x);
  w.appendChild(row);
  if (M.mode === 'guest') w.appendChild(el('p', 'hint', 'La revancha la inicia el anfitrión.'));
  body.appendChild(w);
  store.clear();
}

/* ---------- API y arranque ---------- */
P.battle = { menu };
const sala = N.normCode(new URLSearchParams(location.search).get('sala'));
if (sala) { joinPrefill = sala; P.team.show('team', 'battle'); }
})();
