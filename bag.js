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
const sound = k => { if (window.AudioManager) AudioManager.play(k); };

/* ---------- InventoryManager: único dueño del inventario (localStorage 'pmtu.bag.v1') ---------- */
const InventoryManager = {
  defaultInventory: {},                       // inventario inicial si no hay nada guardado (id de objeto → cantidad). Ej.: { pokeball: 5 }
  state: { q: {} },
  load() {
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(KEY)); } catch (_) {}
    this.state = (raw && raw.q) ? { q: raw.q } : { q: Object.assign({}, this.defaultInventory) };
    if (!raw) this.save();
  },
  save() { try { localStorage.setItem(KEY, JSON.stringify(this.state)); } catch (_) {} updateBadge(); },   // se guarda en cada cambio
  qty(id) { return this.state.q[id] || 0; },
  /* Añade (o resta, con amount negativo) objetos: botín, compras… */
  addItem(itemId, amount = 1) {
    const i = byId.get(itemId); if (!i) return { ok: false, msg: 'Objeto desconocido' };
    const max = i.kind === 'perm' ? 1 : 99;
    const min = i.kind === 'equip' ? equipped(itemId) : 0;       // no puedes tener menos que las que llevan puestas
    const n = Math.max(min, Math.min(max, this.qty(itemId) + amount));
    if (n) this.state.q[itemId] = n; else delete this.state.q[itemId];
    this.save(); return { ok: true, qty: n };
  },
  /* Tira una copia (sin efecto) */
  discard(itemId) { return this.addItem(itemId, -1); },
  /* Usa un objeto de Acción sobre un Pokémon (instance_id = uid; array para Max Revivir). Devuelve { ok, msg, need? }.
     extra: estado a quitar con Cura Total ('par', 'ven'…). Si funciona, resta 1, guarda y suena el SFX de curación. */
  useItem(itemId, pokemonInstanceId, extra) {
    const i = byId.get(itemId), T = P.team;
    if (!i || i.kind !== 'action') return { ok: false, msg: 'Este objeto no se puede usar así' };
    if (!this.qty(itemId)) return { ok: false, msg: 'No te quedan ' + i.name };
    const uids = [].concat(pokemonInstanceId == null ? [] : pokemonInstanceId);
    const ents = uids.map(u => (T.all().find(x => x.e.uid === u) || {}).e).filter(Boolean);
    let msg = i.name + ' usada';
    if (i.use === 'revive' || i.use === 'revive4') {
      if (!ents.length) return { ok: false, msg: 'Elige un Pokémon' };
      if (ents.length > (i.use === 'revive4' ? 4 : 1)) return { ok: false, msg: 'Demasiados Pokémon' };
      const bad = ents.find(e => !e.fainted);
      if (bad) return { ok: false, msg: T.nameOf(bad) + ' no está debilitado' };    // Revivir solo funciona con Debilitado
      ents.forEach(e => { e.fainted = false; });
      msg = ents.map(e => T.nameOf(e)).join(', ') + (ents.length > 1 ? ' han sido revividos' : ' ha sido revivido');
    } else if (i.use === 'cure') {
      const e = ents[0]; if (!e) return { ok: false, msg: 'Elige un Pokémon' };
      const ks = T.stKeys(e); if (!ks.length) return { ok: false, msg: T.nameOf(e) + ' no tiene estados alterados' };
      const k = extra || (ks.length === 1 ? ks[0] : null);
      if (!k) return { ok: false, need: 'status', options: ks, msg: '¿Qué estado quitas?' };
      T.clearStatus(e, k); msg = 'Estado eliminado de ' + T.nameOf(e);
    } else if (i.use === 'level') {
      const e = ents[0]; if (!e) return { ok: false, msg: 'Elige un Pokémon' };
      if (T.levelOf(e) >= T.maxLevel) return { ok: false, msg: T.nameOf(e) + ' ya está en el nivel máximo' };
      T.levelUp(e, 1); msg = T.nameOf(e) + ' sube a nivel ' + T.levelOf(e);
    }                                          // 'info': cartas de tablero, sin objetivo
    this.addItem(itemId, -1);
    if (ents.length) T.save();
    sound(i.use === 'info' ? 'ok' : 'heal');
    return { ok: true, msg };
  }
};
window.InventoryManager = InventoryManager;
const qty = id => InventoryManager.qty(id);
const equipped = id => (P.team ? P.team.itemCount(id) : 0);
const free = id => Math.max(0, qty(id) - equipped(id));
const img = (i, small) => 'assets/objetos/' + i.img + (small ? '_s' : '') + '.webp';
function setQty(id, n) { InventoryManager.addItem(id, n - qty(id)); }
function updateBadge() {
  const n = ITEMS.reduce((t, i) => t + qty(i.id), 0), b = $('#bagCount');
  if (b) { b.textContent = n; b.hidden = !n; }
}

InventoryManager.load();

/* ---------- Diálogos ---------- */
function dialog(build) {
  const dlg = $('#teamDlg'), body = $('#teamDlgBody');
  body.innerHTML = '';
  const close = () => { if (dlg.open) dlg.close(); };
  dlg.classList.add('sheet');                                     // se abre como menú inferior
  if (!dlg._sheetHook) { dlg._sheetHook = true; dlg.addEventListener('close', () => { if (!dlg.open) dlg.classList.remove('sheet'); }); }
  build(body, close);
  if (!dlg.open) dlg.showModal();
}
/* Menú inferior con los Pokémon de Mi Equipo. reason(e) devuelve el motivo por el que NO se puede elegir (o '' si sí). */
function pickPokemon(title, list, onPick, note, reason) {
  dialog((body, close) => {
    body.innerHTML = `<h2>${esc(title)}</h2>` + (note ? `<p>${esc(note)}</p>` : '');
    if (!list.length) body.appendChild(el('p', 'hint', 'No tienes Pokémon en el equipo.'));
    const grid = el('div', 'pickgrid');
    list.forEach(x => {
      const e = x.e || x, c = P.byId.get(e.id), why = reason ? reason(e) : '';
      const b = el('button', 'pickitem' + (why ? ' off' : '') + (e.fainted ? ' fainted' : '')); b.type = 'button';
      b.appendChild(P.artEl(c));
      b.appendChild(el('em', null, esc(c.name) + ' · Nv ' + P.team.levelOf(e) + (x.where === 'pc' ? ' · PC' : '')));
      const sts = P.team.stKeys(e).map(k => window.PMTU_ENGINE.STATUS_INFO[k].emoji).join('') + (e.fainted ? '💀' : '');
      if (sts) b.appendChild(el('small', null, sts));
      if (why) b.appendChild(el('small', 'why', esc(why)));
      b.onclick = () => { if (why) { sound('error'); return P.toast(why, 'error'); } close(); onPick(e); };
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
  InventoryManager.addItem(id, -1); P.team.save();
}

/* ---------- Usar cartas de Acción (flujo: fila → Usar → elegir Pokémon) ---------- */
function useAction(i) {
  if (!qty(i.id)) return P.toast('No tienes ' + i.name, 'error');
  const T = P.team, all = T.all();
  const finish = r => { if (r.ok) P.toast(r.msg, 'ok'); else { sound('error'); P.toast(r.msg, 'error'); } render(); };
  if (i.use === 'revive')
    return pickPokemon('¿A quién revives?', all, e => finish(IM().useItem(i.id, e.uid)), 'Solo se puede usar con un Pokémon debilitado.', e => e.fainted ? '' : 'No está debilitado');
  if (i.use === 'level')
    return pickPokemon('¿A quién subes un nivel?', all.filter(x => x.where === 'team'), e => finish(IM().useItem(i.id, e.uid)), '', e => T.levelOf(e) >= T.maxLevel ? 'Nivel máximo' : '');
  if (i.use === 'cure')
    return pickPokemon('¿A quién curas?', all, e => {
      const r = IM().useItem(i.id, e.uid);
      if (!r.need) return finish(r);
      dialog((body, close) => {                                    // varios estados: elegir cuál quitar
        const SI = window.PMTU_ENGINE.STATUS_INFO;
        body.innerHTML = '<h2>¿Qué estado quitas?</h2>';
        r.options.forEach(k => body.appendChild(btn(SI[k].emoji + ' ' + SI[k].name, 'wide', () => { close(); finish(IM().useItem(i.id, e.uid, k)); })));
        body.appendChild(btn('Cancelar', 'wide', close));
      });
    }, 'Quita un estado alterado (VEN, PAR…).', e => T.stKeys(e).length ? '' : 'Sin estados');
  if (i.use === 'revive4') {
    const f = all.filter(x => x.e.fainted);
    if (!f.length) { sound('error'); return P.toast('No tienes ningún Pokémon debilitado', 'error'); }
    return dialog((body, close) => {
      body.innerHTML = '<h2>Max Revivir</h2><p>Marca hasta 4 Pokémon debilitados.</p>';
      const chosen = new Set(f.slice(0, 4).map(x => x.e.uid));
      const ok = btn('Revivir', 'primary', () => { if (!chosen.size) return; close(); finish(IM().useItem(i.id, [...chosen])); });
      f.forEach(x => {
        const l = el('label', 'chk'), c = document.createElement('input'); c.type = 'checkbox'; c.checked = chosen.has(x.e.uid);
        c.onchange = () => {
          if (c.checked) { if (chosen.size >= 4) { c.checked = false; return P.toast('Máximo 4', 'error'); } chosen.add(x.e.uid); } else chosen.delete(x.e.uid);
          ok.disabled = !chosen.size;
        };
        l.append(c, document.createTextNode(' ' + T.nameOf(x.e) + (x.where === 'pc' ? ' (PC)' : '')));
        body.appendChild(l);
      });
      const row = el('div', 'dlgrow'); row.append(btn('Cancelar', '', close), ok); body.appendChild(row);
    });
  }
  // cartas de tablero: la app solo lleva la cuenta
  cardDialog(i, i.text, close => [
    btn('Cancelar', '', close),
    btn('Usar y descartar', 'primary', () => { close(); finish(IM().useItem(i.id)); if (i.draw) P.toast('Añade con ＋ las cartas que robes', 'info'); })
  ]);
}
const IM = () => InventoryManager;
function cureStatus(e, then) {                                   // (Baya) quitar un estado al Pokémon que la lleva
  const ks = P.team.stKeys(e), SI = window.PMTU_ENGINE.STATUS_INFO;
  const apply = k => { P.team.clearStatus(e, k); sound('heal'); P.toast(SI[k].name + ' eliminado de ' + P.team.nameOf(e), 'ok'); then(); };
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

/* ---------- Pantalla: lista limpia (icono · nombre · ×cantidad · ＋) ---------- */
let tab = 'all';
const TABS = [['all', 'Todo'], ['ball', 'Captura'], ['action', 'Acción'], ['equip', 'Equipo'], ['perm', 'Permanentes']];
const norm = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function holders(id) { return P.team.all().filter(x => x.e.item === id).map(x => x.e); }

/* Menú inferior de un objeto: Usar | Tirar | Cancelar */
function itemSheet(i) {
  const n = qty(i.id);
  dialog((body, close) => {
    body.innerHTML = `<h2>${esc(i.name)} <small>×${n}</small></h2>`;
    const im = el('img', 'bagdlgimg'); im.src = img(i); im.alt = i.name; body.appendChild(im);
    body.appendChild(el('p', null, esc(i.text)));
    if (i.kind === 'equip') holders(i.id).forEach(e => body.appendChild(el('p', 'hint', '🎒 Lo lleva ' + esc(P.team.nameOf(e)))));
    const ctl = el('div', 'sheetbtns');
    if (i.kind === 'action') ctl.appendChild(btn('Usar', 'primary wide', () => { close(); useAction(i); }));
    else if (i.kind === 'equip') {
      ctl.appendChild(btn('Equipar a un Pokémon', 'primary wide', () => { close(); equipFlow(i); }));
      if (i.auto) body.appendChild(el('p', 'iauto', '⚙️ ' + esc(i.auto)));
    } else if (i.kind === 'ball') ctl.appendChild(el('p', 'hint', 'Se gasta sola al capturar en la calculadora de Captura.'));
    else if (i.auto) body.appendChild(el('p', 'iauto', '⚙️ ' + esc(i.auto)));
    ctl.appendChild(btn('Tirar', 'wide danger', () => {
      if (i.kind === 'equip' && !free(i.id)) { sound('error'); return P.toast('Primero quítasela al Pokémon que la lleva', 'error'); }
      close(); InventoryManager.discard(i.id); P.toast(i.name + ' tirada', 'info'); render();
    }));
    ctl.appendChild(btn('Cancelar', 'wide', close));
    body.appendChild(ctl);
  });
}
/* Catálogo para añadir botín o compras */
function addSheet() {
  dialog((body, close) => {
    body.innerHTML = '<h2>Añadir objeto</h2><p class="hint">Botín de combate o compras. Toca ＋ por cada carta que consigas.</p>';
    const sr = el('input', 'bagq'); sr.type = 'search'; sr.placeholder = 'Buscar…'; sr.setAttribute('aria-label', 'Buscar objeto'); body.appendChild(sr);
    const box = el('div', 'iclist addlist'); body.appendChild(box);
    const draw = () => {
      box.innerHTML = '';
      const t = norm(sr.value.trim());
      Object.keys(window.ITEM_KINDS).forEach(k => {
        const g = ITEMS.filter(i => i.kind === k && (!t || norm(i.name).includes(t))); if (!g.length) return;
        box.appendChild(el('h3', 'igroup', esc(window.ITEM_KINDS[k])));
        g.forEach(i => {
          const r = el('div', 'irow');
          const im = el('img'); im.src = img(i, true); im.alt = ''; im.loading = 'lazy'; r.appendChild(im);
          r.appendChild(el('b', null, esc(i.name)));
          r.appendChild(el('span', 'qn', qty(i.id) ? '×' + qty(i.id) : ''));
          const p = el('button', 'bplus', '＋'); p.type = 'button'; p.setAttribute('aria-label', 'Añadir ' + i.name);
          p.onclick = () => { InventoryManager.addItem(i.id, 1); sound('click'); draw(); render(); };
          r.appendChild(p); box.appendChild(r);
        });
      });
    };
    sr.oninput = draw; draw();
    body.appendChild(btn('Hecho', 'primary wide', close));
  });
}

function itemRow(i) {
  const n = qty(i.id), r = el('div', 'irow tap'); r.tabIndex = 0; r.setAttribute('role', 'button');
  const im = el('img'); im.src = img(i, true); im.alt = ''; im.loading = 'lazy'; r.appendChild(im);
  const nm = el('div', 'nm'); nm.appendChild(el('b', null, esc(i.name)));
  if (i.kind === 'equip') { const h = holders(i.id); nm.appendChild(el('small', null, h.length ? '🎒 ' + h.map(e => esc(P.team.nameOf(e))).join(', ') : 'Libre')); }
  else nm.appendChild(el('small', null, esc(window.ITEM_KINDS[i.kind])));
  r.appendChild(nm);
  r.appendChild(el('span', 'qn', i.kind === 'perm' ? '✔' : '×' + n));
  const p = el('button', 'bplus', '＋'); p.type = 'button'; p.setAttribute('aria-label', 'Añadir ' + i.name);
  p.disabled = i.kind === 'perm';
  p.onclick = ev => { ev.stopPropagation(); InventoryManager.addItem(i.id, 1); sound('click'); render(); };
  r.appendChild(p);
  const open = () => itemSheet(i);
  r.onclick = open; r.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); open(); } };
  return r;
}

function render() {
  updateBadge();
  const body = $('#bagBody'); if (!body) return;
  const keep = window.scrollY;
  body.innerHTML = '';
  const bar = el('div', 'subtabs scroll'); bar.setAttribute('role', 'tablist');
  TABS.forEach(([k, l]) => {
    const n = ITEMS.filter(i => (k === 'all' || i.kind === k) && qty(i.id)).length;
    const b = el('button', tab === k ? 'on' : '', esc(l) + ' <span class="pill">' + n + '</span>'); b.type = 'button'; b.setAttribute('role', 'tab');
    b.onclick = () => { tab = k; render(); window.scrollTo(0, 0); };
    bar.appendChild(b);
  });
  body.appendChild(bar);
  const items = ITEMS.filter(i => (tab === 'all' || i.kind === tab) && qty(i.id));
  const box = el('div', 'iclist'); body.appendChild(box);
  if (!items.length) box.appendChild(el('p', 'empty', 'Aquí no hay nada todavía.<br>Pulsa <b>＋ Añadir objeto</b> cuando consigas botín o compres en una ciudad.'));
  else if (tab === 'all') Object.keys(window.ITEM_KINDS).forEach(k => {
    const g = items.filter(i => i.kind === k); if (!g.length) return;
    box.appendChild(el('h3', 'igroup', esc(window.ITEM_KINDS[k])));
    g.forEach(i => box.appendChild(itemRow(i)));
  });
  else items.forEach(i => box.appendChild(itemRow(i)));
  body.appendChild(btn('＋ Añadir objeto', 'primary wide addbtn', addSheet));
  body.appendChild(el('p', 'hint', 'Toca un objeto para usarlo, equiparlo o tirarlo. ＋ solo sirve para añadir botín o compras. El mazo es físico: aquí anotas lo que robas, usas o gastas.'));
  window.scrollTo(0, keep);
}

P.zoomImg = src => { const z = $('#zoom'); z.querySelector('img').src = src; z.hidden = false; };
P.bag = {
  render, qty, free, chip, manager: InventoryManager, fightChip, onSleep, catchEffects,
  ballItemFor: ballId => (ITEMS.find(i => i.ballId === ballId) || {}).id,
  ballStock: ballId => { const i = ITEMS.find(x => x.ballId === ballId); return i ? qty(i.id) : 0; },
  count: id => qty(id),
  use: id => { if (qty(id) > 0) { consume(id); return true; } return false; }
};
updateBadge();
})();
