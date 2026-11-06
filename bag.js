/* ============================================================
   Mochila: las 46 cartas de objeto (data/items.js).
   - Captura: se anotan las que tienes; la calculadora de captura gasta una al capturar.
   - Acción: se usan y se tiran (algunas se automatizan: Revivir, Max Revivir, Cura Total, Caramelo Raro).
   - Equipamiento: se unen a un Pokémon (se ve en Mi Equipo y se aplican en el combate).
   - Permanentes: Poké Flauta y SS Anne Ticket, se tienen o no.
   El mazo es físico: la Mochila solo anota lo que tú robas, usas o gastas.
   Se guarda en este móvil (localStorage, clave pmtu.bag.v1) y entra en la copia de seguridad.
   ============================================================ */
(function () {
'use strict';
const P = window.PMTU;
const $ = (s, r = document) => r.querySelector(s);
const { el, esc } = P;
const ITEMS = window.ITEMS || [];
const byId = new Map(ITEMS.map(i => [i.id, i]));
const KEY = 'pmtu.bag.v1';

let B = { q: {} };
try { const raw = localStorage.getItem(KEY); if (raw) B = Object.assign(B, JSON.parse(raw)); } catch (_) {}
B.q = B.q || {};
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(B)); } catch (_) {} };

const qty = id => B.q[id] || 0;
const equipped = id => (P.team ? P.team.itemCount(id) : 0);
const free = id => Math.max(0, qty(id) - equipped(id));
const img = (i, small) => 'assets/objetos/' + i.img + (small ? '_s' : '') + '.webp';
function setQty(id, n) {
  const i = byId.get(id); if (!i) return;
  const max = i.kind === 'perm' ? 1 : 99;
  const min = i.kind === 'equip' ? equipped(id) : 0;            // no puedes tener menos que las que llevan puestas
  B.q[id] = Math.max(min, Math.min(max, n));
  if (!B.q[id]) delete B.q[id];
  save(); updateBadge();
}
function updateBadge() {
  const n = ITEMS.reduce((t, i) => t + qty(i.id), 0), b = $('#bagCount');
  if (b) { b.textContent = n; b.hidden = !n; }
}

/* ---------- Diálogos ---------- */
function dialog(build) {
  const dlg = $('#teamDlg'), body = $('#teamDlgBody');
  body.innerHTML = '';
  const close = () => { if (dlg.open) dlg.close(); };
  build(body, close);
  if (!dlg.open) dlg.showModal();
}
function pickPokemon(title, list, onPick, note) {
  dialog((body, close) => {
    body.innerHTML = `<h2>${esc(title)}</h2>` + (note ? `<p>${esc(note)}</p>` : '');
    if (!list.length) body.appendChild(el('p', 'hint', 'No hay ningún Pokémon que cumpla esto.'));
    const grid = el('div', 'pickgrid');
    list.forEach(x => {
      const e = x.e || x, c = P.byId.get(e.id);
      const b = el('button', 'pickitem'); b.type = 'button';
      b.appendChild(P.artEl(c));
      b.appendChild(el('em', null, esc(c.name) + ' · Nv ' + P.team.levelOf(e) + (x.where === 'pc' ? ' · PC' : '') + (e.item ? ' · ' + esc(byId.get(e.item).name) : '')));
      b.onclick = () => { close(); onPick(e); };
      grid.appendChild(b);
    });
    body.appendChild(grid);
    const no = el('button', 'btn wide', 'Cancelar'); no.onclick = close; body.appendChild(no);
  });
}
function cardDialog(i, text, buttons) {
  dialog((body, close) => {
    body.innerHTML = `<h2>${esc(i.name)}</h2>`;
    const im = el('img', 'bagdlgimg'); im.src = img(i); im.alt = i.name; body.appendChild(im);
    body.appendChild(el('p', null, esc(text || i.text)));
    const row = el('div', 'dlgrow');
    buttons(close).forEach(b => row.appendChild(b));
    body.appendChild(row);
  });
}
const btn = (label, cls, fn) => { const b = el('button', 'btn ' + (cls || ''), label); b.type = 'button'; b.onclick = fn; return b; };
const sound = k => { if (window.AudioManager) AudioManager.play(k); };

/* ---------- Equipar ---------- */
function equipTo(i, e) {
  const had = e.item;
  e.item = i.id; if (i.id === 'repartir_exp') e.exp = e.exp || 0;
  P.team.save();
  P.toast(i.name + ' → ' + P.team.nameOf(e) + (had && had !== i.id ? ' (' + byId.get(had).name + ' vuelve a la mochila)' : ''), 'ok');
  render();
}
function unequip(e) {
  const i = byId.get(e.item); if (!i) return;
  delete e.item; delete e.exp;
  P.team.save(); P.toast(i.name + ' vuelve a la mochila', 'info'); render();
}
function equipFlow(i) {
  if (!free(i.id)) return P.toast('No tienes ' + i.name + ' libre: súmala con ＋ o quítala de otro Pokémon', 'error');
  pickPokemon('¿Quién lleva ' + i.name + '?', P.team.all(), e => equipTo(i, e), 'Cada Pokémon lleva un solo objeto; si ya lleva uno, vuelve a la mochila.');
}
function consume(id) { setQty(id, qty(id) - 1); }
/* Descarta el objeto que lleva un Pokémon (se gasta de verdad) */
function discardEquipped(e) {
  const id = e.item; delete e.item; delete e.exp;
  B.q[id] = Math.max(0, (B.q[id] || 0) - 1); if (!B.q[id]) delete B.q[id];
  save(); updateBadge(); P.team.save();
}

/* ---------- Usar cartas de Acción ---------- */
function useAction(i) {
  if (!qty(i.id)) return P.toast('No tienes ' + i.name + '. Súmala con ＋', 'error');
  const done = msg => { consume(i.id); sound('capture'); P.toast(msg || i.name + ' usada y descartada', 'ok'); render(); };
  const T = P.team;
  if (i.use === 'revive') {
    const f = T.all().filter(x => x.e.fainted);
    return pickPokemon('¿A quién revives?', f, e => { T.revive(e); done(T.nameOf(e) + ' ha sido revivido'); }, f.length ? '' : 'Ahora mismo no tienes ningún Pokémon debilitado.');
  }
  if (i.use === 'revive4') {
    const f = T.all().filter(x => x.e.fainted);
    if (!f.length) return P.toast('No tienes ningún Pokémon debilitado', 'info');
    return dialog((body, close) => {
      body.innerHTML = '<h2>Max Revivir</h2><p>Marca hasta 4 Pokémon para revivir.</p>';
      const chosen = new Set(f.slice(0, 4).map(x => x.e));
      const ok = btn('Revivir', 'primary', () => {
        if (!chosen.size) return; close(); chosen.forEach(e => { e.fainted = false; }); T.save(); done(chosen.size + ' Pokémon revividos');
      });
      f.forEach(x => {
        const l = el('label', 'chk'), c = document.createElement('input'); c.type = 'checkbox'; c.checked = chosen.has(x.e);
        c.onchange = () => {
          if (c.checked) { if (chosen.size >= 4) { c.checked = false; return P.toast('Máximo 4', 'error'); } chosen.add(x.e); } else chosen.delete(x.e);
          ok.disabled = !chosen.size;
        };
        l.append(c, document.createTextNode(' ' + T.nameOf(x.e) + (x.where === 'pc' ? ' (PC)' : '')));
        body.appendChild(l);
      });
      const row = el('div', 'dlgrow'); row.append(btn('Cancelar', '', close), ok); body.appendChild(row);
    });
  }
  if (i.use === 'level') {
    return pickPokemon('¿A quién subes un nivel?', T.teamEntries().map(e => ({ e, where: 'team' })), e => {
      if (T.levelOf(e) >= T.maxLevel) return P.toast(T.nameOf(e) + ' ya está en el nivel máximo', 'error');
      T.levelUp(e, 1); done(T.nameOf(e) + ' sube a nivel ' + T.levelOf(e));
    });
  }
  if (i.use === 'cure') {
    const sick = T.all().filter(x => T.stKeys(x.e).length);
    return pickPokemon('¿A quién curas?', sick, e => cureStatus(e, () => done()), sick.length ? '' : 'Ningún Pokémon tiene un estado alterado ahora mismo.');
  }
  // cartas de tablero: la app solo lleva la cuenta
  cardDialog(i, i.text, close => [
    btn('Cancelar', '', close),
    btn('Usar y descartar', 'primary', () => {
      close(); consume(i.id); sound('capture'); render();
      P.toast(i.name + ' usada' + (i.draw ? '. Añade las cartas que robes con ＋' : ''), 'ok');
    })
  ]);
}
function cureStatus(e, then) {
  const ks = P.team.stKeys(e), SI = window.PMTU_ENGINE.STATUS_INFO;
  const apply = k => { P.team.clearStatus(e, k); P.toast(SI[k].name + ' eliminado de ' + P.team.nameOf(e), 'ok'); then(); };
  if (ks.length === 1) return apply(ks[0]);
  dialog((body, close) => {
    body.innerHTML = '<h2>¿Qué estado quitas?</h2>';
    ks.forEach(k => body.appendChild(btn(SI[k].emoji + ' ' + SI[k].name, 'wide', () => { close(); apply(k); })));
    body.appendChild(btn('Cancelar', 'wide', close));
  });
}

/* ---------- Extras de equipamiento ---------- */
function usePocion(e) {
  const i = byId.get('pocion_maxima');
  discardEquipped(e); P.team.revive(e); sound('heal');
  P.toast(i.name + ' usada: ' + P.team.nameOf(e) + ' revive', 'ok'); render();
}
function useBaya(e) {
  const ks = P.team.stKeys(e);
  if (!ks.length) return P.toast(P.team.nameOf(e) + ' no tiene ningún estado que quitar', 'info');
  cureStatus(e, () => { discardEquipped(e); P.team.save(); render(); });
}
function repartirExp(e, d) {
  e.exp = Math.max(0, (e.exp || 0) + d);
  if (e.exp >= 3) {
    e.exp = 0; P.team.save();
    if (P.team.levelOf(e) < P.team.maxLevel) { P.team.levelUp(e, 1); P.toast('Repartir Exp: 3 contadores → ' + P.team.nameOf(e) + ' sube de nivel', 'ok'); }
    else P.toast('Repartir Exp llegó a 3, pero ya está en el nivel máximo', 'info');
  } else P.team.save();
  render();
}
function huevoSuerte(e) {
  const d = 1 + Math.floor(Math.random() * 6);
  dialog((body, close) => {
    body.innerHTML = `<h2>🥚 Huevo Suerte</h2><div class="bigdie">${d}</div><p>${d === 6 ? '¡Un 6! ' + esc(P.team.nameOf(e)) + ' sube un nivel adicional.' : 'No ha salido 6: ningún nivel extra.'}</p>`;
    body.appendChild(btn('Vale', 'primary wide', () => { close(); if (d === 6) { P.team.levelUp(e, 1); sound('capture'); } }));
  });
}

/* ---------- API para otras pantallas ---------- */
/* Chip del objeto en la ficha de Mi Equipo */
function chip(e) {
  const i = e.item && byId.get(e.item);
  const wrap = el('div', 'itemchip' + (i ? ' on' : ''));
  if (!i) {
    const anyFree = ITEMS.some(x => x.kind === 'equip' && free(x.id));
    if (!anyFree) return null;
    const b = el('button', 'btn small', '🎒 Equipar objeto'); b.type = 'button';
    b.onclick = () => pickItem(e);
    wrap.appendChild(b); return wrap;
  }
  const im = el('img'); im.src = img(i, true); im.alt = ''; im.onclick = () => P.zoomImg && P.zoomImg(img(i));
  wrap.appendChild(im);
  const t = el('div', 'it'); t.appendChild(el('b', null, esc(i.name)));
  t.appendChild(el('small', null, esc(i.auto || '')));
  wrap.appendChild(t);
  const acts = el('div', 'ia');
  if (i.id === 'pocion_maxima') { const b = btn(e.fainted ? 'Revivir ya' : 'Usar', e.fainted ? 'primary small' : 'small', () => usePocion(e)); acts.appendChild(b); }
  if (i.id === 'baya') acts.appendChild(btn('Usar', 'small', () => useBaya(e)));
  if (i.id === 'huevo_suerte') acts.appendChild(btn('🎲 Subió de nivel', 'small', () => huevoSuerte(e)));
  if (i.id === 'repartir_exp') {
    const n = e.exp || 0, c = el('span', 'xpc');
    for (let k = 0; k < 3; k++) c.appendChild(el('i', k < n ? 'on' : ''));
    acts.append(c, btn('＋', 'small', () => repartirExp(e, 1)), btn('−', 'small', () => repartirExp(e, -1)));
  }
  acts.appendChild(btn('Quitar', 'small', () => unequip(e)));
  wrap.appendChild(acts);
  return wrap;
}
function pickItem(e) {
  const avail = ITEMS.filter(x => x.kind === 'equip' && free(x.id));
  dialog((body, close) => {
    body.innerHTML = `<h2>Equipar a ${esc(P.team.nameOf(e))}</h2>`;
    const grid = el('div', 'pickgrid');
    avail.forEach(i => {
      const b = el('button', 'pickitem'); b.type = 'button';
      const im = el('img'); im.src = img(i, true); im.alt = ''; b.appendChild(im);
      b.appendChild(el('em', null, esc(i.name)));
      b.onclick = () => { close(); equipTo(i, e); };
      grid.appendChild(b);
    });
    body.appendChild(grid);
    body.appendChild(btn('Cancelar', 'wide', close));
  });
}
function fightChip(id, used) {
  const i = byId.get(id), s = el('div', 'fitem' + (used ? ' used' : ''));
  if (!i) return s;
  const im = el('img'); im.src = img(i, true); im.alt = ''; s.appendChild(im);
  s.appendChild(el('span', null, esc(i.name) + (used ? ' · en uso' : '')));
  s.title = i.text;
  return s;
}
function onSleep(e) {
  if (!qty('poke_flauta')) return;
  const i = byId.get('poke_flauta');
  dialog((body, close) => {
    body.innerHTML = `<h2>🎶 Poké Flauta</h2><p>${esc(P.team.nameOf(e))} se ha dormido. Tira un D4: si sale 4, se descarta el estado.</p><div class="bigdie" id="fluteDie">?</div>`;
    const row = el('div', 'dlgrow');
    const go = btn('🎲 Tirar D4', 'primary', () => {
      const d = 1 + Math.floor(Math.random() * 4), die = $('#fluteDie');
      die.textContent = d; go.disabled = true;
      if (d === 4) { P.team.clearStatus(e, 'dor'); sound('heal'); P.toast('¡Un 4! ' + P.team.nameOf(e) + ' se despierta', 'ok'); }
      else P.toast('Sale ' + d + ': sigue dormido', 'info');
      go.textContent = d === 4 ? '¡Despierto!' : 'Sigue dormido';
    });
    row.append(btn('Cerrar', '', close), go); body.appendChild(row);
  });
}
/* Efectos al capturar con una bola (la llama la calculadora de captura) */
function catchEffects(ballItemId, cardId) {
  const i = byId.get(ballItemId); if (!i) return;
  if (qty(i.id) > 0) { consume(i.id); P.toast(i.name + ': te quedan ' + qty(i.id), 'info'); }
  const T = P.team;
  if (i.id === 'amigo_ball' || i.id === 'lujo_ball') { T.setBonus(cardId, 1); P.toast(i.name + ': el Pokémon capturado sube 1 nivel', 'ok'); }
  if (i.id === 'sana_ball') setTimeout(() => {
    const f = T.all().filter(x => x.e.fainted);
    if (!f.length) return P.toast('Sana Ball: no hay Pokémon debilitados que revivir', 'info');
    pickPokemon('Sana Ball: ¿a quién revives?', f, e => { T.revive(e); P.toast(T.nameOf(e) + ' revive', 'ok'); }, 'Puedes revivir a un Pokémon de tu equipo.');
  }, 700);
  if (i.id === 'love_ball') setTimeout(() => P.toast('Love Ball: roba una carta de objeto y anótala en la Mochila', 'info'), 900);
}

/* ---------- Pantalla ---------- */
let tab = 'mine', q = '';
const TABS = [['mine', 'Mis cartas'], ['ball', 'Captura'], ['action', 'Acción'], ['equip', 'Equipo'], ['perm', 'Permanentes']];
function holders(id) { return P.team.all().filter(x => x.e.item === id).map(x => x.e); }

function itemCard(i) {
  const n = qty(i.id), card = el('div', 'icard ' + i.kind + (n ? ' have' : ''));
  const im = el('button', 'iimg'); im.type = 'button'; im.setAttribute('aria-label', 'Ver ' + i.name);
  const g = el('img'); g.src = img(i, true); g.alt = i.name; g.loading = 'lazy'; im.appendChild(g);
  im.onclick = () => { const z = $('#zoom'); z.querySelector('img').src = img(i); z.hidden = false; };
  card.appendChild(im);
  const info = el('div', 'iinfo');
  info.appendChild(el('b', null, esc(i.name)));
  info.appendChild(el('small', null, esc(window.ITEM_KINDS[i.kind])));
  info.appendChild(el('p', null, esc(i.text)));
  if (i.kind === 'equip' && i.auto) info.appendChild(el('p', 'iauto', '⚙️ ' + esc(i.auto)));
  const ctl = el('div', 'ictl');
  if (i.kind === 'perm') {
    const b = el('button', 'seg1' + (n ? ' on' : ''), n ? '✔ La tengo' : 'No la tengo'); b.type = 'button';
    b.onclick = () => { setQty(i.id, n ? 0 : 1); render(); };
    ctl.appendChild(b);
  } else {
    const m = el('button', 'ibtn', '−'), p = el('button', 'ibtn', '＋'); m.type = p.type = 'button';
    m.disabled = n <= (i.kind === 'equip' ? equipped(i.id) : 0); m.setAttribute('aria-label', 'Quitar una');
    p.setAttribute('aria-label', 'Añadir una');
    m.onclick = () => { setQty(i.id, n - 1); render(); };
    p.onclick = () => { setQty(i.id, n + 1); render(); };
    ctl.append(m, el('span', 'qn', '×' + n), p);
    if (i.kind === 'action') ctl.appendChild(btn('Usar', 'small primary', () => useAction(i)));
    if (i.kind === 'equip') ctl.appendChild(btn('Equipar', 'small primary', () => equipFlow(i)));
  }
  info.appendChild(ctl);
  if (i.kind === 'equip' && n) {
    const hs = holders(i.id);
    hs.forEach(e => {
      const r = el('div', 'holder', '🎒 Lo lleva <b>' + esc(P.team.nameOf(e)) + '</b>');
      r.appendChild(btn('Quitar', 'small', () => unequip(e))); info.appendChild(r);
    });
    if (!hs.length) info.appendChild(el('small', 'hint', 'Libre en la mochila'));
  }
  card.appendChild(info);
  return card;
}

function render() {
  updateBadge();
  const body = $('#bagBody'); if (!body) return;
  const keep = window.scrollY;
  body.innerHTML = '';
  const bar = el('div', 'subtabs scroll'); bar.setAttribute('role', 'tablist');
  TABS.forEach(([k, l]) => {
    const n = k === 'mine' ? ITEMS.filter(i => qty(i.id)).length : ITEMS.filter(i => i.kind === k && qty(i.id)).length;
    const b = el('button', tab === k ? 'on' : '', esc(l) + ' <span class="pill">' + n + '</span>'); b.type = 'button'; b.setAttribute('role', 'tab');
    b.onclick = () => { tab = k; render(); window.scrollTo(0, 0); };
    bar.appendChild(b);
  });
  body.appendChild(bar);
  const sr = el('input', 'bagq'); sr.type = 'search'; sr.placeholder = 'Buscar carta…'; sr.value = q; sr.setAttribute('aria-label', 'Buscar carta');
  sr.oninput = () => { q = sr.value; const pos = sr.selectionStart; list(); };
  body.appendChild(sr);
  const box = el('div', 'iclist'); body.appendChild(box);
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  function list() {
    box.innerHTML = '';
    let items = tab === 'mine' ? ITEMS.filter(i => qty(i.id)) : ITEMS.filter(i => i.kind === tab);
    if (q.trim()) items = (tab === 'mine' ? ITEMS : items).filter(i => norm(i.name).includes(norm(q.trim())));
    if (!items.length) {
      box.appendChild(el('p', 'empty', tab === 'mine'
        ? 'Tu mochila está vacía.<br>Ve a <b>Captura</b>, <b>Acción</b>, <b>Equipo</b> o <b>Permanentes</b> y toca ＋ en las cartas que consigas.'
        : 'Ninguna carta coincide.'));
      return;
    }
    if (tab === 'mine') {
      Object.keys(window.ITEM_KINDS).forEach(k => {
        const g = items.filter(i => i.kind === k); if (!g.length) return;
        box.appendChild(el('h3', 'igroup', esc(window.ITEM_KINDS[k])));
        g.forEach(i => box.appendChild(itemCard(i)));
      });
    } else {
      const sorted = items.slice().sort((a, b) => (qty(b.id) > 0) - (qty(a.id) > 0));
      sorted.forEach(i => box.appendChild(itemCard(i)));
    }
  }
  list();
  body.appendChild(el('p', 'hint', 'El mazo de objetos es físico: aquí anotas las cartas que robas, usas o gastas. Toca la miniatura para ver la carta en grande.'));
  window.scrollTo(0, keep);
}

P.zoomImg = src => { const z = $('#zoom'); z.querySelector('img').src = src; z.hidden = false; };
P.bag = {
  render, qty, free, chip, fightChip, onSleep, catchEffects,
  ballItemFor: ballId => (ITEMS.find(i => i.ballId === ballId) || {}).id,
  ballStock: ballId => { const i = ITEMS.find(x => x.ballId === ballId); return i ? qty(i.id) : 0; },
  count: id => qty(id),
  use: id => { if (qty(id) > 0) { consume(id); return true; } return false; }
};
updateBadge();
})();
