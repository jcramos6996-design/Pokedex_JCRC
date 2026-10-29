/* ============================================================
   AudioManager: efectos de sonido (SFX) y música de fondo (BGM).
   Todo se genera con Web Audio (sin archivos de sonido): son sonidos y una melodía
   propios, sencillos, que no dependen de ningún recurso externo.

   Modos (se guardan en localStorage 'pmtu.audio'):
     'sfx'  solo efectos (por defecto)   🔔
     'full' música y efectos             🎵
     'off'  silencio total               🔇
   Los navegadores no dejan sonar nada hasta que el usuario toca la pantalla:
   el audio se "desbloquea" solo en el primer toque.

   Uso:  AudioManager.play('click' | 'tick' | 'error' | 'ok' | 'capture' | 'evolve')
         AudioManager.setMode('full') · AudioManager.cycle() · AudioManager.mode
   Los botones con el atributo data-music hacen de interruptor.
   ============================================================ */
(function () {
'use strict';
const KEY = 'pmtu.audio';
const MODES = ['sfx', 'full', 'off'];
let mode = 'sfx';
try { const v = localStorage.getItem(KEY); if (MODES.includes(v)) mode = v; } catch (_) {}

let ctx = null, master = null, sfxG = null, bgmG = null;
const hz = m => 440 * Math.pow(2, (m - 69) / 12);

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    sfxG = ctx.createGain(); sfxG.gain.value = 1; sfxG.connect(master);
    bgmG = ctx.createGain(); bgmG.gain.value = 0.0; bgmG.connect(master);
  } catch (_) { ctx = null; }
  return ctx;
}

/* Una nota: oscilador + envolvente. opts: type, vol, slide (frecuencia final), dest */
function tone(freq, t, dur, o) {
  o = o || {};
  const osc = ctx.createOscillator(), g = ctx.createGain();
  osc.type = o.type || 'square';
  osc.frequency.setValueAtTime(freq, t);
  if (o.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.slide), t + dur);
  const v = o.vol == null ? 0.15 : o.vol;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g); g.connect(o.dest || sfxG);
  osc.start(t); osc.stop(t + dur + 0.03);
}

/* ---------- Efectos ---------- */
const SFX = {
  click: t => tone(900, t, 0.05, { vol: 0.08, slide: 1400 }),
  tick: t => tone(520, t, 0.07, { type: 'triangle', vol: 0.2, slide: 260 }),
  error: t => { tone(230, t, 0.16, { type: 'sawtooth', vol: 0.12, slide: 150 }); tone(170, t + 0.18, 0.26, { type: 'sawtooth', vol: 0.12, slide: 100 }); },
  ok: t => { tone(660, t, 0.08, { type: 'triangle', vol: 0.14 }); tone(990, t + 0.08, 0.14, { type: 'triangle', vol: 0.14 }); },
  // Captura: 3 golpes de la bola, "clic" al cerrarse y una melodía corta (sincronizado con la animación de 2,8 s)
  capture: t => {
    [0.7, 1.15, 1.6].forEach(o => SFX.tick(t + o));
    tone(1600, t + 1.9, 0.05, { vol: 0.12, slide: 900 });
    [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => {
      const s = t + 2.05 + i * 0.1;
      tone(f, s, i === 6 ? 0.45 : 0.12, { type: 'square', vol: 0.07 });
      tone(f / 2, s, i === 6 ? 0.45 : 0.12, { type: 'triangle', vol: 0.12 });
    });
  },
  evolve: t => { for (let i = 0; i < 14; i++) tone(400 + i * 70, t + i * 0.12, 0.14, { type: 'triangle', vol: 0.1 }); tone(1046, t + 1.8, 0.7, { type: 'square', vol: 0.08 }); }
};

function play(name) {
  if (mode === 'off' || !SFX[name]) return;
  const c = ensure(); if (!c) return;
  if (c.state === 'suspended') c.resume();
  SFX[name](c.currentTime + 0.01);
}

/* ---------- Música de fondo: bucle sencillo (La menor – Fa – Do – Sol) ---------- */
const BPM = 104, STEP = 60 / BPM / 2;
const CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];
const ARP = [0, 1, 2, 1, 0, 1, 2, 1];
// melodía (MIDI, null = silencio) 32 corcheas = 4 compases
const MEL = [76, null, 72, null, 74, null, 76, 79, 77, null, 76, null, 72, null, null, null,
             72, null, 76, null, 79, null, 76, null, 74, null, 71, null, 74, null, null, null];
let timer = null, nextT = 0, step = 0;
function sched() {
  if (!ctx || mode !== 'full') return;
  while (nextT < ctx.currentTime + 0.5) {
    const ch = CHORDS[Math.floor(step / 8) % 4], s8 = step % 8;
    tone(hz(ch[ARP[s8]] + 12), nextT, STEP * 0.9, { type: 'square', vol: 0.035, dest: bgmG });
    if (s8 === 0 || s8 === 4) tone(hz(ch[0] - 12), nextT, STEP * 1.8, { type: 'triangle', vol: 0.11, dest: bgmG });
    const m = MEL[step % 32];
    if (m) tone(hz(m), nextT, STEP * 1.7, { type: 'triangle', vol: 0.07, dest: bgmG });
    nextT += STEP; step++;
  }
}
function startBgm() {
  const c = ensure(); if (!c || timer) return;
  if (c.state === 'suspended') c.resume();
  bgmG.gain.cancelScheduledValues(c.currentTime);
  bgmG.gain.setValueAtTime(bgmG.gain.value, c.currentTime);
  bgmG.gain.linearRampToValueAtTime(0.9, c.currentTime + 1.2);       // entrada suave
  nextT = c.currentTime + 0.1; step = 0;
  timer = setInterval(sched, 120); sched();
}
function stopBgm() {
  clearInterval(timer); timer = null;
  if (ctx && bgmG) { bgmG.gain.cancelScheduledValues(ctx.currentTime); bgmG.gain.setValueAtTime(bgmG.gain.value, ctx.currentTime); bgmG.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4); }
}

/* ---------- Modo y botones ---------- */
const LABEL = { sfx: ['🔔', 'Solo efectos de sonido (toca para activar la música)'], full: ['🎵', 'Música y efectos (toca para silenciar la música)'], off: ['🔇', 'Todo en silencio (toca para activar los efectos)'] };
const MSG = { sfx: 'Efectos de sonido activados', full: 'Música y efectos activados', off: 'Sonido silenciado' };
function paint() {
  document.querySelectorAll('[data-music]').forEach(b => { b.textContent = LABEL[mode][0]; b.title = LABEL[mode][1]; b.setAttribute('aria-label', LABEL[mode][1]); b.dataset.state = mode; });
}
function setMode(m, quiet) {
  if (!MODES.includes(m)) return;
  mode = m;
  try { localStorage.setItem(KEY, m); } catch (_) {}
  paint();
  if (m === 'full') { ensure(); startBgm(); } else stopBgm();
  if (!quiet && window.showToast) window.showToast(MSG[m], 'info');
  if (m === 'sfx') play('ok');
}
const cycle = () => setMode(MODES[(MODES.indexOf(mode) + 1) % MODES.length]);

/* Desbloqueo con el primer toque (política de autoplay de los navegadores) */
function unlock() {
  const c = ensure(); if (!c) return;
  if (c.state === 'suspended') c.resume();
  if (mode === 'full') startBgm();
}
['pointerdown', 'touchend', 'keydown'].forEach(ev => document.addEventListener(ev, unlock, { passive: true }));
document.addEventListener('visibilitychange', () => {
  if (!ctx) return;
  if (document.visibilityState === 'hidden') { ctx.suspend(); }
  else { ctx.resume(); if (mode === 'full' && !timer) startBgm(); }
});

/* "Clic" al pulsar filtros, pestañas y botones */
const CLICK_SEL = '.tagbtn,.chip,.fctl button,.subtabs button,.bottomnav button,.forms button,.tags button,.seg button,.stchip,.ballbtn,.btn,.ibtn,.mv,summary';
document.addEventListener('click', e => {
  const t = e.target.closest(CLICK_SEL);
  if (!t || t.closest('[data-nosound]') || t.matches('[data-music],[data-wake]') || t.disabled) return;
  play('click');
}, true);
document.addEventListener('click', e => { if (e.target.closest('[data-music]')) cycle(); });
window.addEventListener('DOMContentLoaded', paint);

window.AudioManager = { play, setMode, cycle, unlock, get mode() { return mode; } };
})();
