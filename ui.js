/* ============================================================
   Utilidades de interfaz: avisos (toast) y pantalla siempre encendida (Wake Lock).
   Se carga la primera: lo usan app.js, team.js y battle.js.
   ============================================================ */
(function () {
'use strict';

/* ---------- Avisos ----------
   showToast(mensaje, tipo)   tipo: 'ok' | 'error' | 'info' (por defecto 'info')
   Aparece abajo (por encima del menú) y se va solo a los 3 segundos. */
const TOAST_MS = 3000;
const ICON = { ok: '✔', error: '⚠', info: 'ℹ' };
let box = null, timer = null, hideT = null;
function showToast(msg, tipo) {
  tipo = ICON[tipo] ? tipo : 'info';
  if (!box) {
    box = document.getElementById('toast') || document.body.appendChild(document.createElement('div'));
    box.id = 'toast';
    box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite');
  }
  clearTimeout(timer); clearTimeout(hideT);
  box.hidden = false;
  box.className = 'toast ' + tipo;
  box.textContent = '';
  const i = document.createElement('span'); i.className = 'ti'; i.textContent = ICON[tipo];
  const t = document.createElement('span'); t.textContent = msg;
  box.append(i, t);
  void box.offsetWidth;                         // reinicia la transición si ya había uno
  box.classList.add('show');
  timer = setTimeout(() => {
    box.classList.remove('show');
    hideT = setTimeout(() => { box.hidden = true; }, 400);   // tras la transición de salida
  }, TOAST_MS);
}
window.showToast = showToast;

/* ---------- Pantalla siempre activa ----------
   Pide el bloqueo mientras la app está visible y lo vuelve a pedir al volver a ella
   (el navegador lo suelta solo al minimizar). Si el navegador no lo soporta, avisa una vez. */
const KEY = 'pmtu.wake';
let want = true;
try { want = localStorage.getItem(KEY) !== '0'; } catch (_) {}
let sentinel = null, state = 'off', warned = false;
const supported = 'wakeLock' in navigator;

function paint() {
  document.querySelectorAll('[data-wake]').forEach(b => {
    b.dataset.state = state;
    b.textContent = state === 'on' ? '🔆' : state === 'unsupported' ? '⚠️' : '🌙';
    b.title = b.ariaLabel = state === 'on' ? 'Pantalla siempre encendida (toca para desactivar)'
      : state === 'unsupported' ? 'Tu navegador no puede mantener la pantalla encendida'
      : 'La pantalla se apagará sola (toca para mantenerla encendida)';
  });
}
async function request() {
  if (!want || document.visibilityState !== 'visible') return;
  if (!supported) {
    state = 'unsupported'; paint();
    if (!warned) { warned = true; showToast('Tu navegador no puede mantener la pantalla encendida. Ajusta el tiempo de bloqueo en el móvil.', 'info'); }
    return;
  }
  if (sentinel && !sentinel.released) return;
  try {
    sentinel = await navigator.wakeLock.request('screen');
    state = 'on'; paint();
    sentinel.addEventListener('release', () => { state = 'off'; paint(); });
  } catch (e) {                                  // p. ej. ahorro de batería activado
    state = 'off'; paint();
  }
}
async function release() {
  try { if (sentinel) await sentinel.release(); } catch (_) {}
  sentinel = null; state = supported ? 'off' : 'unsupported'; paint();
}
function toggle() {
  want = !want;
  try { localStorage.setItem(KEY, want ? '1' : '0'); } catch (_) {}
  if (want) { request().then(() => { if (state === 'on') showToast('Pantalla siempre encendida', 'ok'); }); }
  else { release(); showToast('La pantalla podrá apagarse sola', 'info'); }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') request(); });
// Algunos navegadores solo conceden el bloqueo tras un toque del usuario
['pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, () => request(), { passive: true }));
document.addEventListener('click', e => { if (e.target.closest('[data-wake]')) toggle(); });
window.addEventListener('DOMContentLoaded', () => { paint(); request(); });
window.PMTU_WAKE = { request, release, toggle, get state() { return state; } };
})();
