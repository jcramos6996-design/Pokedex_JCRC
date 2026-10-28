/* ============================================================
   Conexión entre dos móviles por código de sala.
   - Transporte "peer": WebRTC directo con PeerJS (sin servidor propio; PeerJS solo
     ayuda a que los dos móviles se encuentren y después hablan directamente).
   - Transporte "bc": BroadcastChannel (dos pestañas del mismo navegador; sirve para pruebas).
   Se elige con ?net=bc en la dirección; por defecto "peer".
   ============================================================ */
(function () {
'use strict';
const PEERJS_SRC = 'https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js';
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';   // sin 0/O/1/I/L para no confundir al dictar
const newCode = () => Array.from({ length: 5 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');
const normCode = c => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const mode = () => (new URLSearchParams(location.search).get('net') || (window.PMTU_NET_MODE || 'peer'));
const rid = () => Math.random().toString(36).slice(2, 10);

function loadPeerJS() {
  if (window.Peer) return Promise.resolve();
  return new Promise((ok, ko) => {
    const s = document.createElement('script');
    s.src = PEERJS_SRC; s.onload = ok;
    s.onerror = () => ko(new Error('No se pudo cargar PeerJS (¿sin internet?)'));
    document.head.appendChild(s);
  });
}
const peerOpts = () => window.PMTU_PEER_OPTS || {};        // permite apuntar a otro servidor de señalización

/* ---------- Interfaz común ----------
   const link = PMTU_NET.open({role:'host'|'guest', code, onMsg(msg), onStatus(status, detail)})
   link.send(msg) · link.close()
   status: 'wait' (host esperando) · 'up' (rival conectado) · 'down' (rival caído, reintentando) · 'error'
*/
function openPeer(o) {
  let peer = null, conn = null, closed = false, retry = null;
  const id = 'pmtu-' + o.code;
  const setConn = c => {
    if (conn && conn !== c) { try { conn.close(); } catch (_) {} }
    conn = c;
    c.on('open', () => { o.onStatus('up'); o.onMsg({ t: '_open' }); });
    c.on('data', m => o.onMsg(m));
    c.on('close', () => { if (conn === c) { conn = null; if (!closed) { o.onStatus('down'); if (o.role === 'guest') later(); } } });
    c.on('error', () => { if (conn === c) { conn = null; if (!closed) { o.onStatus('down'); if (o.role === 'guest') later(); } } });
  };
  const later = () => { clearTimeout(retry); if (!closed) retry = setTimeout(dial, 2000); };
  const dial = () => {
    if (closed || !peer || peer.destroyed || (conn && conn.open)) return;
    if (peer.disconnected) { try { peer.reconnect(); } catch (_) {} }
    const c = peer.connect(id, { reliable: true });
    setConn(c);
    clearTimeout(retry);
    retry = setTimeout(() => { if (!closed && !(conn && conn.open)) { try { c.close(); } catch (_) {} conn = null; o.onStatus('down'); dial(); } }, 7000);
  };
  loadPeerJS().then(() => {
    if (closed) return;
    peer = o.role === 'host' ? new Peer(id, peerOpts()) : new Peer(peerOpts());
    peer.on('open', () => {
      if (o.role === 'host') { o.onStatus('wait'); o.onMsg({ t: '_ready' }); } else dial();
    });
    peer.on('connection', c => setConn(c));
    peer.on('disconnected', () => { if (!closed) { try { peer.reconnect(); } catch (_) {} } });
    peer.on('error', e => {
      if (closed) return;
      if (e.type === 'unavailable-id') o.onStatus('error', 'taken');
      else if (e.type === 'peer-unavailable') { o.onStatus('down', 'nohost'); later(); }
      else if (e.type === 'network' || e.type === 'server-error' || e.type === 'socket-error' || e.type === 'socket-closed') o.onStatus('error', 'network');
      else o.onStatus('down', e.type);
    });
  }).catch(e => o.onStatus('error', 'load:' + e.message));
  return {
    send: m => { if (conn && conn.open) { try { conn.send(m); return true; } catch (_) {} } return false; },
    isUp: () => !!(conn && conn.open),
    close: () => { closed = true; clearTimeout(retry); try { conn && conn.close(); } catch (_) {} try { peer && peer.destroy(); } catch (_) {} }
  };
}

function openBC(o) {
  const me = rid();
  const ch = new BroadcastChannel('pmtu-' + o.code);
  let up = false, last = 0, closed = false, tick = null, hostSeen = false;
  const mark = () => { last = Date.now(); if (!up) { up = true; o.onStatus('up'); o.onMsg({ t: '_open' }); } };
  ch.onmessage = ev => {
    const d = ev.data;
    if (!d || d.src === me || d.role === o.role) return;
    if (d.k === 'hi') { mark(); ch.postMessage({ src: me, role: o.role, k: 'hi' }); return; }
    if (d.k === 'msg') { mark(); o.onMsg(JSON.parse(JSON.stringify(d.m))); }
  };
  if (o.role === 'host') setTimeout(() => { o.onStatus('wait'); o.onMsg({ t: '_ready' }); }, 0);
  tick = setInterval(() => { if (!closed) ch.postMessage({ src: me, role: o.role, k: 'hi' }); }, 700);
  ch.postMessage({ src: me, role: o.role, k: 'hi' });
  return {
    send: m => { ch.postMessage({ src: me, role: o.role, k: 'msg', m: JSON.parse(JSON.stringify(m)) }); return true; },
    isUp: () => up,
    close: () => { closed = true; clearInterval(tick); ch.close(); }
  };
}

window.PMTU_NET = {
  newCode, normCode,
  mode,
  open: o => (mode() === 'bc' ? openBC(o) : openPeer(o))
};
})();
