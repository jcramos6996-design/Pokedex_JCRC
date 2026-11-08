/* ============================================================
   Nodo «Gimnasio» (pestaña Combate de Mi Equipo): desafiar a un líder.
   El líder lo juega la CPU (que estudia tu equipo y elige sus 3 Pokémon y cada ataque) o un jugador
   sorteado entre los de la partida, que elige sus 3 Pokémon del equipo del gimnasio desde cero.
   Equipos: data/gimnasios.js · medallas y líderes: data/trainer.js
   ============================================================ */
(function () {
'use strict';
const P = window.PMTU;
const $ = (s, r = document) => r.querySelector(s);
const { el, esc } = P;
const PKEY = 'pmtu.players.v1';
const MAXLV = 10;

const cfgGym = g => {                                     // une datos del gimnasio + líder/medalla + niveles
  const reg = (window.TRAINER_CONFIG.regions || []).find(r => r.id === g.region) || { gyms: [] };
  const info = reg.gyms.find(x => x.id === g.id) || {};
  return {
    id: g.id, region: g.region || 'kanto', leader: g.leader || info.leader || g.id, city: g.city || info.city || '', medal: g.medal || info.medal || '', quote: g.quote || '',
    missing: (g.roster || []).filter(r => !P.byId.get(r.id)).map(r => r.id),           // cartas que aún no existen en cards.js
    roster: (g.roster || []).filter(r => P.byId.get(r.id)).map(r => { const c = P.byId.get(r.id); return { id: r.id, level: Math.max(1, Math.min(MAXLV, r.lv || (c.level || 1) + (g.bonus || 0))), hidden: !!r.hidden }; })
  };
};
const gyms = () => (window.GYMS || []).map(cfgGym).filter(g => g.roster.length >= 1);
if (window.GYMS) (window.GYMS || []).map(cfgGym).forEach(g => { if (g.missing.length) console.warn('Gimnasio ' + g.id + ': faltan las cartas ' + g.missing.join(', ')); });
const owned = g => !!(P.trainer && P.trainer.state().badges[g.region + ':' + g.id]);

let players = [];
try { players = JSON.parse(localStorage.getItem(PKEY)) || []; } catch (_) {}
const savePlayers = () => { try { localStorage.setItem(PKEY, JSON.stringify(players)); } catch (_) {} };

function dialog(build) {
  const dlg = $('#teamDlg'), body = $('#teamDlgBody');
  body.innerHTML = '';
  const close = () => { if (dlg.open) dlg.close(); };
  dlg.classList.add('sheet');
  if (!dlg._sheetHook) { dlg._sheetHook = true; dlg.addEventListener('close', () => { if (!dlg.open) dlg.classList.remove('sheet'); }); }
  build(body, close);
  if (!dlg.open) dlg.showModal();
}
const btn = (label, cls, fn) => { const b = el('button', 'btn ' + (cls || ''), label); b.type = 'button'; b.onclick = fn; return b; };
const sound = k => { if (window.AudioManager) AudioManager.play(k); };
const medalImg = g => { const i = el('img', 'gymmini'); i.src = 'assets/medallas/' + g.id + '.png'; i.alt = ''; i.onerror = () => { i.replaceWith(el('span', 'gymmini emoji', '🏅')); }; return i; };

/* ---------- 1. Elegir gimnasio ---------- */
function open() {
  dialog((body, close) => {
    body.innerHTML = '<h2>🏟️ Gimnasios</h2><p class="hint">Elige a qué líder desafías. Cada líder escoge 3 Pokémon de su equipo para el combate.</p>';
    const list = el('div', 'gymlist');
    gyms().forEach(g => {
      const r = el('button', 'gymrow' + (owned(g) ? ' done' : '')); r.type = 'button';
      r.appendChild(medalImg(g));
      r.appendChild(el('span', 'gtxt', `<b>${esc(g.leader)}</b><small>${esc(g.city)} · ${esc(g.medal)}</small>`));
      r.appendChild(el('span', 'gst', owned(g) ? '✔ Medalla' : 'Desafiar'));
      r.onclick = () => detail(g);
      list.appendChild(r);
    });
    body.appendChild(list);
    body.appendChild(btn('Cerrar', 'wide', close));
  });
}

/* ---------- 2. Equipo del líder y quién lo controla ---------- */
function detail(g) {
  dialog((body, close) => {
    body.innerHTML = `<h2>${esc(g.leader)} · ${esc(g.city)}</h2><p class="quote">«${esc(g.quote || '')}»</p>`;
    const gr = el('div', 'gymgrid');
    g.roster.forEach(r => {
      const c = P.byId.get(r.id), x = el('div', 'gymcell');
      if (r.hidden) { x.appendChild(el('div', 'gmystery', '❓')); x.appendChild(el('em', null, 'Pokémon sorpresa')); gr.appendChild(x); return; }
      const th = el('div', 'bthumb s'); th.appendChild(P.artEl(c)); x.appendChild(th); x.appendChild(el('em', null, esc(c.name) + ' · Nv ' + r.level));
      const t = el('span', 'ticons'); c.types.forEach(ty => t.appendChild(P.typeBadge(ty, 'sm'))); x.appendChild(t);
      gr.appendChild(x);
    });
    body.appendChild(gr);
    body.appendChild(el('h3', null, '¿Quién controla al líder?'));
    body.appendChild(btn('🤖 La CPU', 'primary wide', () => {
      const me = (P.team.name() || '').trim();
      close(); P.team.show('team', 'battle'); P.battle.gym.cpu(g, me || 'Retador');
    }));
    body.appendChild(el('p', 'hint', 'La CPU estudia tu equipo antes de elegir a sus 3 Pokémon y analiza cada ronda para escoger su mejor ataque.'));
    body.appendChild(btn('🎲 Un jugador (sorteo)', 'wide', () => draw(g)));
    body.appendChild(btn('← Otros gimnasios', 'wide', open));
  });
}

/* ---------- 3. Sorteo del jugador que hace de líder ---------- */
function draw(g, state) {
  const st = state || { me: (P.team.name() || '').trim(), pick: null };
  dialog((body, close) => {
    body.innerHTML = `<h2>Líder ${esc(g.leader)}: sorteo</h2>
      <p class="hint">Escribe el nombre de todos los jugadores de la partida. Se sortea entre todos menos el retador; el elegido hace de líder desde que escoge su equipo hasta el final del combate.</p>`;
    const meL = el('label', 'field', 'Retador (tú)');
    const me = el('input'); me.value = st.me; me.maxLength = 20; me.placeholder = 'Tu nombre'; me.oninput = () => { st.me = me.value.trim(); st.pick = null; }; meL.appendChild(me); body.appendChild(meL);
    const chips = el('div', 'chips');
    const norm = s => s.trim().toLowerCase();
    const paint = () => {
      chips.innerHTML = '';
      players.forEach((n, i) => {
        const c = el('span', 'chip' + (norm(n) === norm(st.me) ? ' me' : ''), esc(n) + (norm(n) === norm(st.me) ? ' (retador)' : ''));
        const x = el('button', null, '✕'); x.type = 'button'; x.setAttribute('aria-label', 'Quitar ' + n); x.onclick = () => { players.splice(i, 1); savePlayers(); st.pick = null; paint(); res(); };
        c.appendChild(x); chips.appendChild(c);
      });
      if (!players.length) chips.appendChild(el('span', 'hint', 'Aún no hay jugadores.'));
    };
    body.appendChild(el('h3', null, 'Jugadores'));
    body.appendChild(chips);
    const row = el('div', 'inrow');
    const inp = el('input'); inp.maxLength = 20; inp.placeholder = 'Nombre del jugador'; inp.autocomplete = 'off';
    const add = btn('Añadir', 'primary', () => {
      const v = inp.value.trim(); if (!v) return;
      if (players.some(p => norm(p) === norm(v))) return P.toast('Ya está en la lista', 'error');
      players.push(v); savePlayers(); inp.value = ''; st.pick = null; paint(); res();
    });
    inp.onkeydown = e => { if (e.key === 'Enter') add.click(); };
    row.append(inp, add); body.appendChild(row);
    const resBox = el('div', 'drawres'); body.appendChild(resBox);
    const others = () => players.filter(p => norm(p) !== norm(st.me));
    function res() {
      resBox.innerHTML = '';
      if (!st.me) { resBox.appendChild(el('p', 'hint', 'Escribe tu nombre de retador arriba.')); return; }
      if (!others().length) { resBox.appendChild(el('p', 'hint', 'Añade al menos un jugador distinto del retador.')); return; }
      if (!st.pick) {
        resBox.appendChild(btn('🎲 Sortear líder', 'primary wide big', () => {
          const pool = others(); let n = 0;
          const final = pool[Math.floor(Math.random() * pool.length)];
          const disp = el('div', 'bigname', '…'); resBox.innerHTML = ''; resBox.appendChild(disp);
          const t = setInterval(() => { disp.textContent = pool[n++ % pool.length]; sound('tick'); }, 90);
          setTimeout(() => { clearInterval(t); st.pick = final; sound('ok'); res(); }, 1400);
        }));
      } else {
        resBox.appendChild(el('div', 'bigname win', '🏟️ ' + esc(st.pick)));
        resBox.appendChild(el('p', 'hint', `${esc(st.pick)} será el líder ${esc(g.leader)}.`));
        resBox.appendChild(btn('📱 Un solo móvil', 'primary wide', () => { close(); P.team.show('team', 'battle'); P.battle.gym.local(g, st.me, st.pick); }));
        resBox.appendChild(btn('🌐 Cada uno en su móvil (sala)', 'wide', () => { close(); P.team.show('team', 'battle'); P.battle.gym.host(g, st.me, st.pick); }));
        resBox.appendChild(btn('🔁 Volver a sortear', 'wide', () => { st.pick = null; res(); }));
      }
    }
    paint(); res();
    body.appendChild(btn('← Volver', 'wide', () => detail(g)));
  });
}

P.gym = { open };
})();
