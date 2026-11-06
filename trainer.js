/* ============================================================
   Tarjeta de Entrenador: perfil, Pokédex personal, medallas, ciudades,
   estadísticas, logros y copia de seguridad. Todo se guarda en este móvil.
   Los datos de regiones/gimnasios/ciudades están en data/trainer.js.
   ============================================================ */
(function () {
'use strict';
const P = window.PMTU;
const $ = (s, r = document) => r.querySelector(s);
const { el, esc } = P;
const CFG = window.TRAINER_CONFIG || { regions: [] };
const KEY = 'pmtu.trainer.v1';

/* ---------- Estado ---------- */
const fresh = () => ({
  v: 1,
  tid: String(Math.floor(10000 + Math.random() * 89999)),
  since: new Date().toISOString(),
  avatar: { kind: 'emoji', v: '🧢' },
  favorite: null,
  caught: [], seen: [],
  captures: 0, ballUse: {}, evolutions: 0,
  battles: { trainer: { w: 0, l: 0, t: 0 }, wild: { w: 0, l: 0 } },
  region: CFG.regions[0] ? CFG.regions[0].id : '',
  badges: {}, league: {}, cities: {}, where: '',
  ach: {}, notes: ''
});
let S = fresh();
try { const raw = JSON.parse(localStorage.getItem(KEY)); if (raw && raw.v === 1) S = Object.assign(fresh(), raw, { battles: Object.assign(fresh().battles, raw.battles || {}) }); } catch (_) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (_) {} };
const today = () => new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
const fmtDate = iso => { try { return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }); } catch (_) { return ''; } };

/* ---------- Cálculos ---------- */
const isForm = id => String(id).includes('_');
const num = id => parseInt(id, 10);
const SPECIES = [...new Set(P.CARDS.filter(c => !isForm(c.id)).map(c => num(c.id)))];
const cardByNum = n => P.CARDS.find(c => !isForm(c.id) && num(c.id) === n);
const caughtSpecies = () => new Set(S.caught.map(num));
const regionOf = id => CFG.regions.find(r => r.id === id) || CFG.regions[0];
const nBadges = () => Object.keys(S.badges).length;
const nCities = () => Object.keys(S.cities).length;
const allCities = () => CFG.regions.reduce((n, r) => n + r.cities.length, 0);
const allBadges = () => CFG.regions.reduce((n, r) => n + r.gyms.length, 0);
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const winRate = () => { const b = S.battles.trainer, n = b.w + b.l + b.t; return n ? Math.round((b.w / n) * 100) : 0; };
const teamList = () => (P.team && P.team.list ? P.team.list() : []);
function rank() {
  const n = nBadges(), champ = CFG.regions.some(r => S.league[r.id]);
  if (champ) return { name: 'Campeón de la Liga', icon: '👑' };
  if (n >= 8) return { name: 'Maestro Pokémon', icon: '🏆' };
  if (n >= 6) return { name: 'Entrenador Experto', icon: '🥇' };
  if (n >= 3) return { name: 'Entrenador', icon: '🎖️' };
  if (n >= 1) return { name: 'Aprendiz', icon: '🎒' };
  return { name: 'Novato', icon: '🌱' };
}
function distinctTypes() {
  const t = new Set();
  caughtSpecies().forEach(n => { const c = cardByNum(n); if (c) c.types.forEach(x => t.add(x)); });
  return t;
}

/* ---------- Logros ---------- */
const ACH = [
  { id: 'cap1',   icon: '⚾', name: 'Primera captura',     desc: 'Captura tu primer Pokémon.', t: () => S.captures >= 1 },
  { id: 'cap10',  icon: '🎯', name: 'Cazador',             desc: '10 capturas.', t: () => S.captures >= 10 },
  { id: 'cap50',  icon: '🥅', name: 'Cazador experto',     desc: '50 capturas.', t: () => S.captures >= 50 },
  { id: 'dex10',  icon: '📖', name: 'Pokédex 10',          desc: '10 especies en tu Pokédex.', t: () => caughtSpecies().size >= 10 },
  { id: 'dex50',  icon: '📚', name: 'Pokédex 50',          desc: '50 especies en tu Pokédex.', t: () => caughtSpecies().size >= 50 },
  { id: 'dexall', icon: '🌟', name: 'Pokédex completa',    desc: 'Consigue todas las especies.', t: () => SPECIES.length > 0 && caughtSpecies().size >= SPECIES.length },
  { id: 'types9', icon: '🎨', name: 'Coleccionista',       desc: '9 tipos distintos.', t: () => distinctTypes().size >= 9 },
  { id: 'types18',icon: '🌈', name: 'Todos los tipos',     desc: 'Los 18 tipos.', t: () => distinctTypes().size >= 18 },
  { id: 'team6',  icon: '🧑‍🤝‍🧑', name: 'Equipo completo',  desc: '6 Pokémon en tu equipo.', t: () => teamList().length >= 6 },
  { id: 'lv10',   icon: '💪', name: 'Nivel máximo',        desc: 'Un Pokémon de nivel 10.', t: () => teamList().some(p => p.level >= 10) },
  { id: 'evo1',   icon: '✨', name: 'Primera evolución',   desc: 'Evoluciona un Pokémon.', t: () => S.evolutions >= 1 },
  { id: 'evo5',   icon: '🦋', name: 'Evolucionista',       desc: '5 evoluciones.', t: () => S.evolutions >= 5 },
  { id: 'win1',   icon: '⚔️', name: 'Primera victoria',    desc: 'Gana un combate contra un entrenador.', t: () => S.battles.trainer.w >= 1 },
  { id: 'win5',   icon: '🔥', name: 'Duelista',            desc: '5 victorias contra entrenadores.', t: () => S.battles.trainer.w >= 5 },
  { id: 'wild1',  icon: '🌿', name: 'Cazador de salvajes', desc: 'Vence a un Pokémon salvaje.', t: () => S.battles.wild.w >= 1 },
  { id: 'wild10', icon: '🐾', name: 'Rey de la hierba',    desc: '10 salvajes vencidos.', t: () => S.battles.wild.w >= 10 },
  { id: 'bad1',   icon: '🥉', name: 'Primera medalla',     desc: 'Consigue una medalla.', t: () => nBadges() >= 1 },
  { id: 'bad4',   icon: '🥈', name: 'Medio camino',        desc: '4 medallas.', t: () => nBadges() >= 4 },
  { id: 'bad8',   icon: '🥇', name: 'Las ocho medallas',   desc: 'Las 8 medallas de una región.', t: () => CFG.regions.some(r => r.gyms.every(g => S.badges[r.id + ':' + g.id])) },
  { id: 'league', icon: '👑', name: 'Campeón',             desc: 'Gana la Liga Pokémon.', t: () => CFG.regions.some(r => S.league[r.id]) },
  { id: 'city5',  icon: '🧭', name: 'Viajero',             desc: '5 ciudades visitadas.', t: () => nCities() >= 5 },
  { id: 'cityall',icon: '🗺️', name: 'Explorador',          desc: 'Todas las ciudades de una región.', t: () => CFG.regions.some(r => r.cities.every(c => S.cities[r.id + ':' + c.id])) },
  { id: 'seen50', icon: '🔎', name: 'Curioso',             desc: 'Mira 50 cartas distintas.', t: () => S.seen.length >= 50 }
];
function checkAch(quiet) {
  let changed = false;
  ACH.forEach(a => {
    if (!S.ach[a.id] && a.t()) {
      S.ach[a.id] = new Date().toISOString(); changed = true;
      if (!quiet) { P.toast('🏆 Logro: ' + a.name, 'ok'); if (window.AudioManager) AudioManager.play('ok'); }
    }
  });
  if (changed) save();
}

/* ---------- Eventos (los llaman el equipo, la captura y el combate) ---------- */
function caught(id) {
  if (!P.byId.has(id)) return;
  if (!S.caught.includes(id)) S.caught.push(id);
  if (!S.seen.includes(id)) S.seen.push(id);
  save(); setTimeout(() => checkAch(), 0);
  if (!$('#viewTrainer').hidden) render();
}
function seen(id) {
  if (!P.byId.has(id) || S.seen.includes(id)) return;
  S.seen.push(id); save(); checkAch();
}
function captured(id, ballId) {
  S.captures++; if (ballId) S.ballUse[ballId] = (S.ballUse[ballId] || 0) + 1;
  save();
}
function evolved(fromId, toId) { S.evolutions++; caught(toId); }
function battle(r) {
  if (!r) return;
  const b = r.kind === 'wild' ? S.battles.wild : S.battles.trainer;
  if (r.kind === 'wild') { r.won ? b.w++ : b.l++; }
  else if (r.tie) b.t++; else if (r.won) b.w++; else b.l++;
  save(); checkAch();
}

/* ---------- Diálogo auxiliar ---------- */
function dialog(build) {
  const dlg = $('#teamDlg'), body = $('#teamDlgBody');
  body.innerHTML = '';
  build(body, () => { if (dlg.open) dlg.close(); });
  if (!dlg.open) dlg.showModal();
}
function confirmDlg(title, text, ok, danger) {
  return new Promise(res => dialog((body, close) => {
    body.innerHTML = `<h2>${esc(title)}</h2><p>${esc(text)}</p>`;
    const row = el('div', 'dlgrow');
    const n = el('button', 'btn', 'Cancelar'), y = el('button', 'btn ' + (danger ? 'danger' : 'primary'), esc(ok));
    n.onclick = () => { close(); res(false); }; y.onclick = () => { close(); res(true); };
    row.append(n, y); body.appendChild(row);
    $('#teamDlg').addEventListener('close', () => res(false), { once: true });
  }));
}

/* ---------- Avatar ---------- */
const EMOJIS = ['🧢', '👦', '👧', '🧑‍🎤', '🧙', '🥷', '🦸', '🧑‍🚀', '😎', '🤠', '👒', '🎩', '⚡', '🔥', '💧', '🌿', '🐱', '🐶', '🦊', '🐉'];
function avatarEl(size) {
  const d = el('div', 'tavatar' + (size ? ' ' + size : ''));
  if (S.avatar.kind === 'img') { const i = el('img'); i.src = S.avatar.v; i.alt = 'Foto del entrenador'; d.appendChild(i); }
  else d.textContent = S.avatar.v;
  return d;
}
function pickAvatar() {
  dialog((body, close) => {
    body.innerHTML = '<h2>Tu imagen</h2><p class="hint">Elige un icono o sube una foto (se guarda solo en este móvil).</p>';
    const grid = el('div', 'emojigrid');
    EMOJIS.forEach(e => { const b = el('button', 'emo' + (S.avatar.kind === 'emoji' && S.avatar.v === e ? ' on' : ''), e); b.type = 'button'; b.onclick = () => { S.avatar = { kind: 'emoji', v: e }; save(); close(); render(); }; grid.appendChild(b); });
    body.appendChild(grid);
    const f = el('label', 'btn wide', '📷 Subir foto'); const inp = el('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.hidden = true;
    inp.onchange = () => {
      const file = inp.files && inp.files[0]; if (!file) return;
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const s = 192, cv = document.createElement('canvas'); cv.width = cv.height = s;
        const m = Math.min(img.width, img.height), sx = (img.width - m) / 2, sy = (img.height - m) / 2;
        cv.getContext('2d').drawImage(img, sx, sy, m, m, 0, 0, s, s);
        S.avatar = { kind: 'img', v: cv.toDataURL('image/jpeg', 0.82) }; URL.revokeObjectURL(url); save(); close(); render();
      };
      img.onerror = () => P.toast('No se pudo leer esa imagen', 'error');
      img.src = url;
    };
    f.appendChild(inp); body.appendChild(f);
    const c = el('button', 'btn wide', 'Cerrar'); c.onclick = close; body.appendChild(c);
  });
}

/* ---------- Pantalla ---------- */
const bar = (a, b, label, cls) => {
  const d = el('div', 'pbar2 ' + (cls || ''));
  d.innerHTML = `<div class="pl"><span>${label}</span><b>${a}/${b} · ${pct(a, b)} %</b></div><div class="pt"><i style="width:${pct(a, b)}%"></i></div>`;
  return d;
};
const sec = (title, sub) => { const s = el('section', 'tsec'); s.appendChild(el('h3', null, title + (sub ? `<small>${sub}</small>` : ''))); return s; };
const stat = (v, l) => el('div', 'stat', `<b>${v}</b><span>${esc(l)}</span>`);

function heroCard() {
  const rk = rank(), card = el('div', 'idcard');
  card.appendChild(el('div', 'idtop', '<span>TARJETA DE ENTRENADOR</span><span>Maestro Entrenador</span>'));
  const body = el('div', 'idbody');
  const av = avatarEl(); av.onclick = pickAvatar; av.title = 'Cambiar imagen'; av.setAttribute('role', 'button'); av.tabIndex = 0;
  av.onkeydown = e => { if (e.key === 'Enter') pickAvatar(); };
  body.appendChild(av);
  const info = el('div', 'idinfo');
  const name = el('input', 'idname'); name.value = P.team.name(); name.placeholder = 'Tu nombre'; name.maxLength = 20; name.setAttribute('aria-label', 'Nombre del entrenador');
  name.onchange = () => { P.team.setName(name.value.trim()); P.toast('Nombre guardado', 'ok'); };
  info.appendChild(name);
  info.appendChild(el('div', 'idrank', `${rk.icon} ${esc(rk.name)}`));
  info.appendChild(el('div', 'idsub', `ID Nº ${esc(S.tid)}<br>Entrenador desde ${esc(fmtDate(S.since))}`));
  body.appendChild(info);
  card.appendChild(body);
  // medallas en miniatura de la región elegida
  const reg = regionOf(S.region), strip = el('div', 'idmedals');
  if (reg) reg.gyms.forEach(g => strip.appendChild(el('span', 'mini' + (S.badges[reg.id + ':' + g.id] ? ' on' : '') + (medalSrc(reg, g) ? ' img' : ''), medalHTML(reg, g))));
  card.appendChild(strip);
  const here = S.where && cityName(S.where);
  const chips = el('div', 'idchips');
  chips.innerHTML = `<span>📖 ${caughtSpecies().size}/${SPECIES.length}</span><span>🏅 ${nBadges()}/${allBadges()}</span><span>🗺️ ${nCities()}/${allCities()}</span><span>⚾ ${S.captures}</span>${here ? `<span>📍 ${esc(here)}</span>` : ''}`;
  card.appendChild(chips);
  const fav = S.favorite && P.byId.get(S.favorite);
  if (fav) { const f = el('div', 'idfav', `⭐ Favorito: <b>${esc(fav.name)}</b>`); card.appendChild(f); }
  return card;
}
function cityName(key) {
  const [rid, cid] = key.split(':'); const r = CFG.regions.find(x => x.id === rid); const c = r && r.cities.find(x => x.id === cid); return c ? c.name : '';
}

function teamSection() {
  const s = sec('Equipo actual', teamList().length + '/6');
  const list = teamList();
  if (!list.length) { s.appendChild(el('p', 'hint', 'Aún no tienes Pokémon en tu equipo.')); return s; }
  const row = el('div', 'tteam');
  list.forEach(t => {
    const c = P.byId.get(t.id), b = el('button', 'tmini' + (t.fainted ? ' ko' : '') + (S.favorite === t.id ? ' fav' : '')); b.type = 'button';
    b.appendChild(P.artEl(c)); b.appendChild(el('em', null, esc(c.name) + '<br>Nv ' + t.level));
    b.onclick = () => { S.favorite = S.favorite === t.id ? null : t.id; save(); P.toast(S.favorite ? c.name + ' es tu favorito' : 'Favorito quitado', 'info'); render(); };
    row.appendChild(b);
  });
  s.appendChild(row);
  s.appendChild(el('p', 'hint', 'Toca un Pokémon para marcarlo como tu favorito ⭐.'));
  return s;
}

function dexSection() {
  const cs = caughtSpecies(), s = sec('Pokédex personal');
  s.appendChild(bar(cs.size, SPECIES.length, 'Especies conseguidas'));
  const forms = S.caught.filter(isForm).length, totalForms = P.CARDS.filter(c => isForm(c.id)).length;
  if (totalForms) s.appendChild(bar(forms, totalForms, 'Formas especiales'));
  const regs = {};
  P.CARDS.filter(c => !isForm(c.id)).forEach(c => (c.regions || []).forEach(r => { (regs[r] = regs[r] || { t: new Set(), c: new Set() }).t.add(num(c.id)); if (cs.has(num(c.id))) regs[r].c.add(num(c.id)); }));
  const names = { kanto: 'Kanto', johto: 'Johto', hoenn: 'Hoenn', sinnoh: 'Sinnoh', unova: 'Teselia', kalos: 'Kalos', alola: 'Alola', galar: 'Galar', paldea: 'Paldea' };
  const rg = Object.keys(regs).sort();
  if (rg.length) { s.appendChild(el('h4', null, 'Por región')); rg.forEach(r => s.appendChild(bar(regs[r].c.size, regs[r].t.size, esc(names[r] || r), 'sm'))); }
  // por tipo
  const byType = {}; cs.forEach(n => { const c = cardByNum(n); if (c) c.types.forEach(t => { byType[t] = (byType[t] || 0) + 1; }); });
  const types = Object.entries(byType).sort((a, b) => b[1] - a[1]);
  if (types.length) {
    s.appendChild(el('h4', null, 'Por tipo'));
    const max = types[0][1], box = el('div', 'tbars');
    types.forEach(([t, n]) => {
      const r = el('div', 'tbar'); r.appendChild(P.typeIcon(t));
      r.appendChild(el('span', 'tl', esc((P.TYPE_ES && P.TYPE_ES[t]) || t)));
      r.appendChild(el('div', 'pt', `<i style="width:${pct(n, max)}%"></i>`)); r.appendChild(el('b', null, String(n)));
      box.appendChild(r);
    });
    s.appendChild(box);
  }
  const miss = SPECIES.length - cs.size;
  const det = el('details', 'tdet'); det.appendChild(el('summary', null, `Faltan ${miss} especies`));
  const list = el('div', 'missing');
  SPECIES.filter(n => !cs.has(n)).sort((a, b) => a - b).forEach(n => { const c = cardByNum(n); list.appendChild(el('span', null, '#' + String(n).padStart(3, '0') + ' ' + esc(c ? c.name : ''))); });
  if (!miss) list.appendChild(el('span', null, '¡Pokédex completa! 🌟'));
  det.appendChild(list); s.appendChild(det);
  return s;
}

function regionTabs() {
  const seg = el('div', 'seg wide');
  CFG.regions.forEach(r => { const b = el('button', S.region === r.id ? 'on' : '', esc(r.name)); b.type = 'button'; b.onclick = () => { S.region = r.id; save(); render(); }; seg.appendChild(b); });
  return seg;
}
function badgesSection() {
  const reg = regionOf(S.region), s = sec('Medallas', nBadges() + '/' + allBadges());
  if (!reg) return s;
  if (CFG.regions.length > 1) s.appendChild(regionTabs());
  const n = reg.gyms.filter(g => S.badges[reg.id + ':' + g.id]).length;
  s.appendChild(bar(n, reg.gyms.length, esc(reg.name)));
  const grid = el('div', 'medals');
  reg.gyms.forEach(g => {
    const k = reg.id + ':' + g.id, on = !!S.badges[k];
    const b = el('button', 'medal' + (on ? ' on' : '')); b.type = 'button'; b.setAttribute('aria-pressed', on);
    b.innerHTML = `<span class="mi${medalSrc(reg, g) ? ' img' : ''}">${medalHTML(reg, g)}</span><b>${esc(g.medal)}</b><small>${esc(g.leader)} · ${esc(g.city)}</small><em>${on ? '✔ ' + esc(S.badges[k]) : 'Sin conseguir'}</em>`;
    b.onclick = () => {
      if (on) delete S.badges[k]; else { S.badges[k] = today(); P.toast('🏅 ' + g.medal + ' conseguida', 'ok'); if (window.AudioManager) AudioManager.play('capture'); }
      save(); checkAch(); render();
    };
    grid.appendChild(b);
  });
  s.appendChild(grid);
  const lg = el('button', 'league' + (S.league[reg.id] ? ' on' : '')); lg.type = 'button';
  lg.innerHTML = S.league[reg.id] ? `👑 Campeón de la ${esc(reg.league)} · ${esc(S.league[reg.id])}` : `👑 ${esc(reg.league)}: toca si has ganado la Liga`;
  lg.onclick = () => { if (S.league[reg.id]) delete S.league[reg.id]; else { S.league[reg.id] = today(); P.toast('👑 ¡Campeón de ' + reg.name + '!', 'ok'); } save(); checkAch(); render(); };
  s.appendChild(lg);
  s.appendChild(el('p', 'hint', 'Toca una medalla para marcarla (o quitarla). La lista se puede cambiar en data/trainer.js.'));
  return s;
}

function citiesSection() {
  const reg = regionOf(S.region), s = sec('Ciudades visitadas', nCities() + '/' + allCities());
  if (!reg) return s;
  const n = reg.cities.filter(c => S.cities[reg.id + ':' + c.id]).length;
  s.appendChild(bar(n, reg.cities.length, esc(reg.name)));
  const grid = el('div', 'cities');
  reg.cities.forEach(c => {
    const k = reg.id + ':' + c.id, on = !!S.cities[k];
    const b = el('button', 'city' + (on ? ' on' : '') + (S.where === k ? ' here' : '')); b.type = 'button'; b.setAttribute('aria-pressed', on);
    b.innerHTML = `<span>${on ? '✔' : '○'}</span><b>${esc(c.name)}</b>${S.where === k ? '<em>📍 estoy aquí</em>' : ''}`;
    b.onclick = () => { if (on) delete S.cities[k]; else S.cities[k] = today(); save(); checkAch(); render(); };
    grid.appendChild(b);
  });
  s.appendChild(grid);
  const sel = el('label', 'field', '📍 ¿Dónde estás ahora?'); const dd = el('select');
  const o0 = el('option', null, '— sin indicar —'); o0.value = ''; dd.appendChild(o0);
  CFG.regions.forEach(r => r.cities.forEach(c => { const o = el('option', null, esc(c.name)); o.value = r.id + ':' + c.id; if (S.where === o.value) o.selected = true; dd.appendChild(o); }));
  dd.onchange = () => { S.where = dd.value; if (S.where && !S.cities[S.where]) S.cities[S.where] = today(); save(); checkAch(); render(); };
  sel.appendChild(dd); s.appendChild(sel);
  return s;
}

function statsSection() {
  const s = sec('Estadísticas'), g = el('div', 'stats');
  const b = S.battles.trainer, w = S.battles.wild;
  const fav = Object.entries(S.ballUse).sort((a, c) => c[1] - a[1])[0];
  const favBall = fav && (P.BALLS || []).find(x => x.id === fav[0]);
  g.append(stat(teamList().length, 'En el equipo'), stat(caughtSpecies().size, 'Especies'), stat(S.captures, 'Capturas'), stat(S.evolutions, 'Evoluciones'),
    stat(b.w + '-' + b.l + '-' + b.t, 'Victorias-derrotas-empates'), stat(winRate() + ' %', 'Victorias vs entrenadores'),
    stat(w.w, 'Salvajes vencidos'), stat(w.l, 'Salvajes que resistieron'),
    stat(favBall ? favBall.name : '—', 'Bola favorita'), stat(S.seen.length, 'Cartas vistas'));
  s.appendChild(g);
  return s;
}

function achSection() {
  const n = ACH.filter(a => S.ach[a.id]).length, s = sec('Logros', n + '/' + ACH.length);
  const grid = el('div', 'achs');
  ACH.forEach(a => {
    const on = !!S.ach[a.id];
    grid.appendChild(el('div', 'ach' + (on ? ' on' : ''), `<span>${a.icon}</span><b>${esc(a.name)}</b><small>${esc(a.desc)}</small>${on ? `<em>${esc(fmtDate(S.ach[a.id]))}</em>` : ''}`));
  });
  s.appendChild(grid);
  return s;
}

function notesSection() {
  const s = sec('Notas del entrenador');
  const ta = el('textarea', 'tnotes'); ta.rows = 4; ta.maxLength = 1000; ta.placeholder = 'Apuntes de tu aventura: rivales, objetivos, sitios…'; ta.value = S.notes;
  ta.oninput = () => { S.notes = ta.value; clearTimeout(ta._t); ta._t = setTimeout(save, 400); };
  s.appendChild(ta); return s;
}

/* ---------- Copia de seguridad ---------- */
function download(name, blob) {
  const a = el('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
function exportBackup() {
  const out = { app: 'pokedex-cartas', version: 1, date: new Date().toISOString(), data: {} };
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith('pmtu.') && k !== 'pmtu.battle.v1') out.data[k] = localStorage.getItem(k); } } catch (_) {}
  download('mi-pokedex-copia.json', new Blob([JSON.stringify(out)], { type: 'application/json' }));
  P.toast('Copia guardada', 'ok');
}
function importBackup(file) {
  const rd = new FileReader();
  rd.onload = async () => {
    let j; try { j = JSON.parse(rd.result); } catch (_) { return P.toast('Ese archivo no es una copia válida', 'error'); }
    if (!j || j.app !== 'pokedex-cartas' || typeof j.data !== 'object') return P.toast('Ese archivo no es una copia de esta app', 'error');
    const ok = await confirmDlg('Restaurar copia', 'Se sustituirán tu equipo, PC y tarjeta de entrenador de este móvil por los de la copia.', 'Restaurar', true);
    if (!ok) return;
    try { Object.entries(j.data).forEach(([k, v]) => { if (k.startsWith('pmtu.') && typeof v === 'string') localStorage.setItem(k, v); }); } catch (_) { return P.toast('No se pudo guardar', 'error'); }
    location.reload();
  };
  rd.readAsText(file);
}
async function resetTrainer() {
  const ok = await confirmDlg('Reiniciar tarjeta', 'Se borran medallas, ciudades, Pokédex personal, estadísticas y logros. Tu equipo y tu PC NO se tocan.', 'Reiniciar', true);
  if (!ok) return;
  const name = P.team.name(); S = fresh(); save(); P.team.setName(name); render(); P.toast('Tarjeta reiniciada', 'info');
}
function backupSection() {
  const s = sec('Tarjeta y copia de seguridad');
  const row = el('div', 'tbtns');
  const img = el('button', 'btn', '🖼️ Guardar tarjeta como imagen'); img.type = 'button'; img.onclick = saveCardImage;
  const ex = el('button', 'btn', '💾 Descargar copia'); ex.type = 'button'; ex.onclick = exportBackup;
  const im = el('label', 'btn', '📂 Restaurar copia'); const inp = el('input'); inp.type = 'file'; inp.accept = 'application/json,.json'; inp.hidden = true;
  inp.onchange = () => { if (inp.files[0]) importBackup(inp.files[0]); inp.value = ''; }; im.appendChild(inp);
  const rs = el('button', 'btn danger', '🗑️ Reiniciar tarjeta'); rs.type = 'button'; rs.onclick = resetTrainer;
  row.append(img, ex, im, rs); s.appendChild(row);
  s.appendChild(el('p', 'hint', 'Tus datos viven solo en este navegador. Descarga una copia de vez en cuando, o si cambias de móvil, y restáurala en el nuevo.'));
  return s;
}

/* ---------- Imágenes de medalla (assets/medallas/<id>.png; solo Kanto por ahora) ---------- */
const MEDAL_IMG = ['roca', 'cascada', 'trueno', 'arcoiris', 'alma', 'pantano', 'volcan', 'tierra'];
const medalSrc = (reg, g) => (reg.id === 'kanto' && MEDAL_IMG.includes(g.id)) ? 'assets/medallas/' + g.id + '.png' : null;
const medalHTML = (reg, g) => { const s = medalSrc(reg, g); return s ? `<img src="${s}" alt="" loading="lazy">` : g.icon; };

/* ---------- Tarjeta como imagen (canvas) ---------- */
function saveCardImage() {
  const W = 900, H = 560, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const g = cv.getContext('2d'), rk = rank(), reg = regionOf(S.region);
  const grad = g.createLinearGradient(0, 0, W, H); grad.addColorStop(0, '#c0272d'); grad.addColorStop(1, '#5c1015');
  const rr = (x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  rr(0, 0, W, H, 36); g.fillStyle = grad; g.fill();
  g.fillStyle = '#ffffff22'; g.fillRect(0, 90, W, 6);
  g.fillStyle = '#fff'; g.font = '700 28px system-ui,sans-serif'; g.fillText('TARJETA DE ENTRENADOR', 40, 62);
  g.font = '400 22px system-ui,sans-serif'; g.textAlign = 'right'; g.fillText('Maestro Entrenador', W - 40, 62); g.textAlign = 'left';
  const medalImgs = {};
  const finish = () => {                                      // carga las imágenes de medalla y luego pinta
    const todo = reg ? reg.gyms.filter(gm => medalSrc(reg, gm)) : [];
    let n = todo.length; if (!n) return finish0();
    const one = () => { if (--n === 0) finish0(); };
    todo.forEach(gm => { const im = new Image(); im.onload = () => { medalImgs[gm.id] = im; one(); }; im.onerror = one; im.src = medalSrc(reg, gm); });
  };
  const finish0 = () => {
    g.fillStyle = '#fff'; g.font = '800 56px system-ui,sans-serif'; g.fillText((P.team.name() || 'Entrenador').slice(0, 16), 290, 190);
    g.font = '600 30px system-ui,sans-serif'; g.fillText(rk.icon + ' ' + rk.name, 290, 240);
    g.font = '400 22px system-ui,sans-serif'; g.fillStyle = '#ffd9db'; g.fillText('ID Nº ' + S.tid + ' · desde ' + fmtDate(S.since), 290, 282);
    // medallas
    if (reg) reg.gyms.forEach((gm, i) => {
      const on = !!S.badges[reg.id + ':' + gm.id], x = 60 + i * 100, y = 380;
      if (medalImgs[gm.id]) { g.globalAlpha = on ? 1 : 0.3; g.drawImage(medalImgs[gm.id], x - 4, y - 34, 68, 68); g.globalAlpha = 1; return; }
      g.globalAlpha = on ? 1 : 0.28; g.fillStyle = on ? '#ffd84a' : '#ffffff'; g.beginPath(); g.arc(x + 30, y, 34, 0, 7); g.fill();
      g.globalAlpha = on ? 1 : 0.5; g.font = '34px system-ui,sans-serif'; g.textAlign = 'center'; g.fillStyle = '#000'; g.fillText(gm.icon, x + 30, y + 12); g.textAlign = 'left'; g.globalAlpha = 1;
    });
    g.fillStyle = '#fff'; g.font = '600 26px system-ui,sans-serif';
    g.fillText(`📖 ${caughtSpecies().size}/${SPECIES.length}    🏅 ${nBadges()}/${allBadges()}    🗺️ ${nCities()}/${allCities()}    ⚾ ${S.captures}`, 40, 500);
    cv.toBlob(b => { if (b) { download('tarjeta-entrenador.png', b); P.toast('Tarjeta guardada como imagen', 'ok'); } else P.toast('No se pudo crear la imagen', 'error'); }, 'image/png');
  };
  rr(40, 120, 220, 220, 28); g.fillStyle = '#ffffff30'; g.fill();
  if (S.avatar.kind === 'img') {
    const im = new Image(); im.onload = () => { g.save(); rr(40, 120, 220, 220, 28); g.clip(); g.drawImage(im, 40, 120, 220, 220); g.restore(); finish(); }; im.onerror = finish; im.src = S.avatar.v;
  } else { g.font = '130px system-ui,sans-serif'; g.textAlign = 'center'; g.fillStyle = '#fff'; g.fillText(S.avatar.v, 150, 262); g.textAlign = 'left'; finish(); }
}

/* ---------- Pintado ---------- */
function render() {
  const body = $('#trainerBody'); if (!body) return;
  const scroll = window.scrollY;
  body.innerHTML = '';
  body.append(heroCard(), teamSection(), statsSection(), dexSection(), badgesSection(), citiesSection(), achSection(), notesSection(), backupSection());
  window.scrollTo(0, scroll);
}

P.trainer = { caught, seen, captured, evolved, battle, render, state: () => S, checkAch };
checkAch(true);
})();
