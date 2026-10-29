/* ============================================================
   Captura: animación de la Poké Ball y calculadora de captura.

   DATO DE CADA POKÉMON: la columna "captura" de data/cards.csv (o del Excel), por ejemplo "4+"
   = número que hay que sacar en el dado con una Poké Ball. Si está vacía, la calculadora te
   deja escribirlo a mano.

   AJUSTE DE LAS BOLAS: se cambia aquí abajo. "mod" se suma al número necesario (negativo = más fácil).
   ============================================================ */
(function () {
'use strict';
const P = window.PMTU;
const { el, esc } = P;

const BALLS = [
  { id: 'poke',   name: 'Poké Ball',   mod: 0,  c1: '#e63946', c2: '#ffffff' },
  { id: 'super',  name: 'Super Ball',  mod: -1, c1: '#2f6fe0', c2: '#ffffff' },
  { id: 'ultra',  name: 'Ultra Ball',  mod: -2, c1: '#26262b', c2: '#f4c20d' },
  { id: 'master', name: 'Master Ball', auto: true, c1: '#7b3fc4', c2: '#ffffff' }
];
const DIE = 6;                  // dado que se usa para capturar
const KEY = 'pmtu.ball';

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

function ballMini(b) {
  const s = el('span', 'ballico'); s.style.setProperty('--b1', b.c1); s.style.setProperty('--b2', b.c2); return s;
}

function catchSection(c, onCaught) {
  const sec = el('div', 'dsec catchsec');
  sec.appendChild(el('h3', null, 'Captura'));
  const base0 = baseOf(c);
  let ballId = 'poke';
  try { const v = localStorage.getItem(KEY); if (BALLS.some(b => b.id === v)) ballId = v; } catch (_) {}
  let manual = '';

  const picker = el('div', 'ballpick', ''); picker.setAttribute('role', 'radiogroup'); picker.setAttribute('aria-label', 'Bola que vas a lanzar');
  const out = el('div', 'catchout');
  sec.append(el('p', 'hint', '¿Qué bola vas a lanzar?'), picker, out);

  function draw() {
    picker.innerHTML = '';
    BALLS.forEach(b => {
      const bt = el('button', 'ballbtn' + (b.id === ballId ? ' on' : '')); bt.type = 'button';
      bt.setAttribute('role', 'radio'); bt.setAttribute('aria-checked', b.id === ballId);
      bt.appendChild(ballMini(b)); bt.appendChild(el('span', null, esc(b.name)));
      bt.onclick = () => { ballId = b.id; try { localStorage.setItem(KEY, ballId); } catch (_) {} draw(); };
      picker.appendChild(bt);
    });
    renderOut();
  }

  function renderOut() {
    const ball = BALLS.find(b => b.id === ballId);
    out.innerHTML = '';
    let base = base0;
    if (base == null) {
      const f = el('label', 'field', 'Esta carta aún no tiene tasa de captura. Escribe el número de la carta (Poké Ball):');
      const inp = el('input'); inp.type = 'number'; inp.inputMode = 'numeric'; inp.min = 1; inp.max = 12; inp.placeholder = 'p. ej. 4'; inp.value = manual;
      inp.oninput = () => { manual = inp.value; renderResult(ball, parseInt(inp.value, 10) || null); };
      f.appendChild(inp); out.appendChild(f);
      out.appendChild(el('div', 'catchres'));
      renderResult(ball, parseInt(manual, 10) || null);
    } else {
      out.appendChild(el('div', 'catchres'));
      renderResult(ball, base);
    }
  }

  function renderResult(ball, base) {
    const box = out.querySelector('.catchres');
    box.innerHTML = '';
    box.className = 'catchres ticket-lite';
    if (ball.auto) {
      box.classList.add('auto');
      box.innerHTML = `<div class="cr-line">${esc(ball.name)}: no falla</div><div class="cr-big auto">¡Captura<br>automática!</div><div class="cr-sub">No hace falta tirar el dado.</div>`;
    } else if (base == null) {
      box.innerHTML = '<div class="cr-sub">Escribe la tasa de captura para calcular.</div>';
    } else {
      const need = Math.max(1, base + ball.mod);
      const bits = [`Base ${base}+ (Poké Ball)`];
      if (ball.mod) bits.push(`${esc(ball.name)} ${ball.mod > 0 ? '+' : '−'}${Math.abs(ball.mod)}`);
      const auto = need <= 1, impossible = need > DIE;
      const pct = auto ? 100 : impossible ? 0 : Math.round(((DIE - need + 1) / DIE) * 100);
      box.innerHTML = `<div class="cr-line">${bits.join(' · ')}${ball.mod ? ` = <b>${need}+</b>` : ''}</div>
        <div class="cr-lbl">${auto ? 'Cualquier resultado captura' : 'Tira 1 dado y necesitas sacar'}</div>
        <div class="cr-big${impossible ? ' hard' : ''}">${auto ? '1+' : need + '<span>o más</span>'}</div>
        <div class="cr-sub">${impossible ? `Con un D${DIE} no llega: usad vuestra regla para números altos (p. ej. 2D${DIE}).` : `D${DIE} · aprox. ${pct} % de probabilidad`}</div>`;
    }
    const caught = el('button', 'btn wide', '✔ ¡Capturado! Añadir a Mi Equipo'); caught.type = 'button'; caught.dataset.nosound = '1';
    caught.onclick = () => onCaught && onCaught();
    box.appendChild(caught);
  }

  draw();
  return sec;
}

P.fx = Object.assign(P.fx || {}, { catchAnim });
P.catchSection = catchSection;
P.BALLS = BALLS;
})();
