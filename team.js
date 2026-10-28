/* ============================================================
   Mi Equipo: la "mano" del jugador (6 Pokémon), el PC, niveles y evolución.
   Todo se guarda en este móvil (localStorage): el equipo y el PC son individuales.
   ============================================================ */
(function () {
'use strict';
const P = window.PMTU;
const $ = (s, r = document) => r.querySelector(s);
const { el, esc } = P;

const MAX_TEAM = 6;
const MAX_LEVEL = 10;          // nivel máximo que permite subir la app
const KEY = 'pmtu.team.v1';

/* ---------- Estado y persistencia ---------- */
let S = { team: [], pc: [], name: '' };
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (_) {}
S.team = (S.team || []).filter(e => P.byId.has(e.id));
S.pc = (S.pc || []).filter(e => P.byId.has(e.id));
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (_) {} };
const uid = () => Math.random().toString(36).slice(2, 9);
const mk = id => ({ uid: uid(), id, extra: 0 });

/* ---------- Datos de una entrada ---------- */
const cardOf = e => P.byId.get(e.id);
const baseLevel = c => c.level || 1;
const levelOf = e => baseLevel(cardOf(e)) + e.extra;
const evoLevelOf = c => (c.evoLevel != null ? c.evoLevel : (c._inherit && c._inherit.evoLevel != null ? c._inherit.evoLevel : null));
const evoTargets = c => (c.evolvesTo || []).filter(id => P.byId.has(id)).map(id => P.byId.get(id));
const readyToEvolve = e => {
  const c = cardOf(e), lv = evoLevelOf(c);
  return evoTargets(c).length > 0 && lv != null && levelOf(e) >= lv;
};

/* ---------- Navegación inferior ---------- */
let view = 'dex', tab = 'team';
function showView(v) {
  view = v;
  const dex = v === 'dex';
  $('#top').hidden = !dex;
  $('.layout').hidden = !dex;
  $('#viewTeam').hidden = dex;
  document.body.classList.toggle('inteam', !dex);
  document.querySelectorAll('.bottomnav button').forEach(b => b.classList.toggle('on', b.dataset.view === v));
  if (!dex) renderTeamView();
  window.scrollTo(0, 0);
}
document.querySelectorAll('.bottomnav button').forEach(b => b.addEventListener('click', () => showView(b.dataset.view)));
document.querySelectorAll('.subtabs button').forEach(b => b.addEventListener('click', () => { tab = b.dataset.tab; renderTeamView(); }));

function updateCounters() {
  $('#tcount').textContent = S.team.length + '/' + MAX_TEAM;
  $('#pccount').textContent = S.pc.length;
  const n = S.team.filter(readyToEvolve).length;
  const nb = $('#navBadge');
  nb.textContent = n; nb.hidden = !n;
  document.querySelectorAll('.subtabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
}

/* ---------- Diálogos auxiliares ---------- */
function dialog(build) {
  const dlg = $('#teamDlg'), body = $('#teamDlgBody');
  body.innerHTML = '';
  const close = () => { if (dlg.open) dlg.close(); };
  build(body, close);
  if (!dlg.open) dlg.showModal();
}
$('#teamDlg').addEventListener('click', e => { if (e.target === $('#teamDlg')) $('#teamDlg').close(); });
function confirmDlg(title, text, okLabel, danger) {
  return new Promise(res => dialog((body, close) => {
    body.innerHTML = `<h2>${esc(title)}</h2><p>${esc(text)}</p>`;
    const row = el('div', 'dlgrow');
    const no = el('button', 'btn', 'Cancelar'); no.onclick = () => { close(); res(false); };
    const ok = el('button', 'btn ' + (danger ? 'danger' : 'primary'), esc(okLabel)); ok.onclick = () => { close(); res(true); };
    row.append(no, ok); body.appendChild(row);
    $('#teamDlg').addEventListener('close', () => res(false), { once: true });
  }));
}

/* ---------- Añadir al equipo ---------- */
function add(id) {
  const c = P.byId.get(id);
  if (!c) return;
  if (S.team.length < MAX_TEAM) {
    S.team.push(mk(id)); save(); updateCounters();
    P.toast(c.name + ' se une a tu equipo (' + S.team.length + '/' + MAX_TEAM + ')');
    if (view === 'team') renderTeamView();
    return;
  }
  fullDialog(id);
}

function pickFromTeam(title, onPick, back) {
  dialog((body, close) => {
    body.innerHTML = `<h2>${esc(title)}</h2>`;
    const grid = el('div', 'pickgrid');
    S.team.forEach(e => {
      const b = el('button', 'pickitem'); b.type = 'button';
      b.appendChild(P.artEl(cardOf(e)));
      b.appendChild(el('em', null, esc(cardOf(e).name) + ' · Nv ' + levelOf(e)));
      b.onclick = () => { close(); onPick(e); };
      grid.appendChild(b);
    });
    body.appendChild(grid);
    const back_ = el('button', 'btn wide', 'Volver'); back_.onclick = () => { close(); back(); };
    body.appendChild(back_);
  });
}

function fullDialog(id) {
  const c = P.byId.get(id);
  dialog((body, close) => {
    body.innerHTML = `<h2>Tu equipo está completo (6/6)</h2><p>¿Qué quieres hacer con <b>${esc(c.name)}</b>?</p>`;
    const opt = (label, sub, fn, cls) => {
      const b = el('button', 'bigopt ' + (cls || ''), `<b>${esc(label)}</b><small>${esc(sub)}</small>`); b.type = 'button';
      b.onclick = fn; body.appendChild(b);
    };
    opt('Guardarlo en el PC', 'Se queda en tu PC y tu equipo no cambia.', () => {
      S.pc.push(mk(id)); save(); updateCounters(); close();
      P.toast(c.name + ' guardado en el PC'); if (view === 'team') renderTeamView();
    });
    opt('Mandar uno de mi equipo al PC', 'Eliges cuál se va al PC y entra ' + c.name + '.', () => {
      pickFromTeam('¿Cuál va al PC?', e => {
        S.team.splice(S.team.indexOf(e), 1); S.pc.push(e); S.team.push(mk(id)); save(); updateCounters();
        P.toast(cardOf(e).name + ' va al PC y entra ' + c.name); if (view === 'team') renderTeamView();
      }, () => fullDialog(id));
    });
    opt('Liberar uno de mi equipo', 'Eliges cuál se libera para siempre y entra ' + c.name + '.', () => {
      pickFromTeam('¿A cuál liberas?', async e => {
        const ok = await confirmDlg('Liberar a ' + cardOf(e).name, 'Se liberará definitivamente. Esta acción no se puede deshacer.', 'Liberar', true);
        if (!ok) return fullDialog(id);
        S.team.splice(S.team.indexOf(e), 1); S.team.push(mk(id)); save(); updateCounters();
        P.toast(cardOf(e).name + ' liberado. Entra ' + c.name); if (view === 'team') renderTeamView();
      }, () => fullDialog(id));
    }, 'danger');
    const cancel = el('button', 'btn wide', 'Cancelar'); cancel.onclick = close; body.appendChild(cancel);
  });
}

/* ---------- Acciones sobre el equipo y el PC ---------- */
function changeLevel(e, d) {
  const was = readyToEvolve(e);
  const maxExtra = MAX_LEVEL - baseLevel(cardOf(e));
  e.extra = Math.max(0, Math.min(Math.max(0, maxExtra), e.extra + d));
  save();
  if (!was && readyToEvolve(e)) {
    P.toast('¡' + cardOf(e).name + ' puede evolucionar!');
    if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
  }
  renderTeamView();
}
function move(i, d) {
  const j = i + d;
  if (j < 0 || j >= S.team.length) return;
  [S.team[i], S.team[j]] = [S.team[j], S.team[i]];
  save(); renderTeamView();
}
async function release(list, e) {
  const ok = await confirmDlg('Liberar a ' + cardOf(e).name, 'Se liberará definitivamente. Esta acción no se puede deshacer.', 'Liberar', true);
  if (!ok) return;
  list.splice(list.indexOf(e), 1); save(); renderTeamView();
}
function toPC(e) {
  S.team.splice(S.team.indexOf(e), 1); S.pc.push(e); save();
  P.toast(cardOf(e).name + ' guardado en el PC'); renderTeamView();
}
function fromPC(e) {
  if (S.team.length >= MAX_TEAM) { P.toast('Tu equipo está completo: libera o guarda a uno primero'); return; }
  S.pc.splice(S.pc.indexOf(e), 1); S.team.push(e); save();
  P.toast(cardOf(e).name + ' vuelve a tu equipo'); renderTeamView();
}

/* ---------- Pantalla Mi Equipo ---------- */
function typeIcons(c) {
  const d = el('span', 'ticons');
  c.types.forEach(t => d.appendChild(P.typeIcon(t)));
  return d;
}
function thumb(e) {
  const b = el('button', 'tthumb'); b.type = 'button';
  b.appendChild(P.artEl(cardOf(e)));
  b.setAttribute('aria-label', 'Ver ' + cardOf(e).name);
  b.onclick = () => P.openDetail(e.id);
  return b;
}
function iconBtn(txt, label, fn, dis, cls) {
  const b = el('button', 'ibtn ' + (cls || ''), txt); b.type = 'button';
  b.setAttribute('aria-label', label); b.title = label; b.disabled = !!dis; b.onclick = fn;
  return b;
}

function teamRow(e, i) {
  const c = cardOf(e), lv = levelOf(e), ready = readyToEvolve(e);
  const row = el('div', 'trow' + (ready ? ' ready' : ''));
  row.appendChild(thumb(e));
  const info = el('div', 'tinfo');
  const name = el('div', 'tname', `<b>${esc(c.name)}</b> <span>#${esc(c.id)}</span>`);
  name.appendChild(typeIcons(c));
  info.appendChild(name);
  const lvl = el('div', 'tlvl');
  lvl.appendChild(iconBtn('−', 'Bajar nivel', () => changeLevel(e, -1), e.extra <= 0));
  lvl.appendChild(el('span', 'lvnum', 'Nivel <b>' + lv + '</b>'));
  lvl.appendChild(iconBtn('＋', 'Subir nivel', () => changeLevel(e, +1), lv >= MAX_LEVEL));
  lvl.appendChild(el('small', null, 'base ' + baseLevel(c) + (e.extra ? ' +' + e.extra : '')));
  info.appendChild(lvl);
  const targets = evoTargets(c), evl = evoLevelOf(c);
  if (ready) {
    const evo = el('div', 'tevo', '⚡ ¡Puede evolucionar!');
    const b = el('button', 'btn primary small', 'Evolucionar'); b.type = 'button'; b.onclick = () => startEvolution(e);
    evo.appendChild(b); info.appendChild(evo);
  } else if (targets.length && evl != null) {
    info.appendChild(el('div', 'thint', 'Evoluciona al nivel ' + evl + ' → ' + targets.map(t => esc(t.name)).join(' / ')));
  } else if (targets.length) {
    const evo = el('div', 'thint', 'Evolución manual ');
    const b = el('button', 'btn small', 'Evolucionar'); b.type = 'button'; b.onclick = () => startEvolution(e);
    evo.appendChild(b); info.appendChild(evo);
  } else if ((c.evolvesTo || []).length) {
    info.appendChild(el('div', 'thint', 'Su evolución aún no tiene carta en la app'));
  }
  row.appendChild(info);
  const act = el('div', 'tact');
  act.append(iconBtn('▲', 'Subir de posición', () => move(i, -1), i === 0),
    iconBtn('▼', 'Bajar de posición', () => move(i, +1), i === S.team.length - 1),
    iconBtn('💾', 'Guardar en el PC', () => toPC(e)),
    iconBtn('🕊️', 'Liberar', () => release(S.team, e), false, 'danger'));
  row.appendChild(act);
  return row;
}

function renderTeam(body) {
  const slots = el('div', 'slots');
  S.team.forEach((e, i) => slots.appendChild(teamRow(e, i)));
  for (let i = S.team.length; i < MAX_TEAM; i++) {
    const empty = el('div', 'trow empty', `<span>Hueco libre ${i + 1}</span>`);
    const b = el('button', 'btn small', 'Buscar en la Pokédex'); b.onclick = () => showView('dex');
    empty.appendChild(b); slots.appendChild(empty);
  }
  body.appendChild(slots);
  body.appendChild(el('p', 'hint', 'Toca una carta para verla. El nivel base sale de la carta; con ＋ y − anotas los niveles que ganas. Máximo ' + MAX_TEAM + ' Pokémon: el resto, al PC.'));
}

function renderPC(body) {
  if (!S.pc.length) { body.appendChild(el('p', 'empty', 'Tu PC está vacío.<br>Aquí se guardan los Pokémon que no caben en tu equipo.')); return; }
  const list = el('div', 'slots');
  S.pc.forEach(e => {
    const c = cardOf(e);
    const row = el('div', 'trow');
    row.appendChild(thumb(e));
    const info = el('div', 'tinfo');
    const name = el('div', 'tname', `<b>${esc(c.name)}</b> <span>#${esc(c.id)}</span>`);
    name.appendChild(typeIcons(c));
    info.appendChild(name);
    info.appendChild(el('div', 'thint', 'Nivel ' + levelOf(e)));
    row.appendChild(info);
    const act = el('div', 'tact');
    const to = el('button', 'btn small primary', 'Al equipo'); to.type = 'button'; to.disabled = S.team.length >= MAX_TEAM; to.onclick = () => fromPC(e);
    act.append(to, iconBtn('🕊️', 'Liberar', () => release(S.pc, e), false, 'danger'));
    row.appendChild(act);
    list.appendChild(row);
  });
  body.appendChild(list);
  if (S.team.length >= MAX_TEAM) body.appendChild(el('p', 'hint', 'Tu equipo está completo: para sacar a uno del PC, antes guarda o libera a otro.'));
}

function renderTeamView() {
  updateCounters();
  const body = $('#teamBody');
  body.innerHTML = '';
  if (tab === 'team') renderTeam(body);
  else if (tab === 'pc') renderPC(body);
  else if (P.battle) P.battle.menu(body);
}

/* ---------- Evolución ---------- */
function startEvolution(e) {
  const c = cardOf(e), targets = evoTargets(c);
  if (!targets.length) return;
  if (targets.length === 1) return playEvolution(e, targets[0]);
  dialog((body, close) => {
    body.innerHTML = `<h2>¿En qué evoluciona ${esc(c.name)}?</h2>`;
    const grid = el('div', 'pickgrid');
    targets.forEach(t => {
      const b = el('button', 'pickitem'); b.type = 'button';
      b.appendChild(P.artEl(t)); b.appendChild(el('em', null, esc(t.name)));
      b.onclick = () => { close(); playEvolution(e, t); };
      grid.appendChild(b);
    });
    body.appendChild(grid);
    const no = el('button', 'btn wide', 'Cancelar'); no.onclick = close; body.appendChild(no);
  });
}

function playEvolution(e, to) {
  const from = cardOf(e);
  const ov = $('#evo');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  ov.innerHTML = `<div class="evo-bg"></div><div class="evo-rays"></div>
    <div class="evo-stage"><div class="evo-card from"></div><div class="evo-card to"></div></div>
    <p class="evo-text" aria-live="polite"></p>
    <div class="evo-btns"></div><div class="evo-flash"></div>`;
  $('.evo-card.from', ov).appendChild(P.artEl(from, null, true));
  $('.evo-card.to', ov).appendChild(P.artEl(to, null, true));
  const text = $('.evo-text', ov), btns = $('.evo-btns', ov);
  ov.hidden = false; ov.className = 'evo';
  document.body.classList.add('noscroll');
  const timers = [];
  const at = (ms, fn) => timers.push(setTimeout(fn, reduced ? Math.min(ms, 400) : ms));
  const stop = el('button', 'btn', '¡Detener!'); stop.type = 'button'; btns.appendChild(stop);
  let finished = false;
  const close = () => { timers.forEach(clearTimeout); ov.hidden = true; ov.innerHTML = ''; document.body.classList.remove('noscroll'); };
  stop.onclick = () => { if (finished) return; close(); P.toast(from.name + ' deja de evolucionar'); };

  text.textContent = '¿Qué? ¡' + from.name + ' está evolucionando!';
  ov.classList.add('p1');
  at(1800, () => { ov.classList.add('p2'); });
  at(4800, () => { ov.classList.add('p3'); stop.disabled = true; });          // destello
  at(5300, () => {                                                         // se consuma la evolución
    finished = true;
    const lv = levelOf(e);
    e.id = to.id; e.extra = Math.max(0, lv - baseLevel(to));
    save(); updateCounters();
    ov.classList.add('p4');
    text.textContent = '¡Enhorabuena! Tu ' + from.name + ' se ha convertido en ' + to.name + '.';
  });
  at(6700, () => {
    btns.innerHTML = '';
    const see = el('button', 'btn', 'Ver carta'); see.type = 'button'; see.onclick = () => { close(); renderTeamView(); P.openDetail(to.id); };
    const ok = el('button', 'btn primary', 'Continuar'); ok.type = 'button'; ok.onclick = () => { close(); renderTeamView(); };
    btns.append(see, ok);
  });
}

/* ---------- API pública ---------- */
P.team = {
  add,
  count: id => S.team.filter(e => e.id === id).length + S.pc.filter(e => e.id === id).length,
  list: () => S.team.map(e => ({ uid: e.uid, id: e.id, level: levelOf(e), name: cardOf(e).name })),
  name: () => S.name || '',
  setName: n => { S.name = String(n || '').slice(0, 20); save(); },
  show: (v, t) => { if (t) tab = t; showView(v || 'team'); },
  refresh: renderTeamView
};
updateCounters();
})();
