(function (root) {
  'use strict';
  // PeerJS 1.5.5: public signaling only. Combat travels over a WebRTC data channel.
  // No account, camera or microphone. A restrictive NAT may require a TURN relay.
  const VERSION = 33;
  const PREFIX = 'umcorte-v3-3-';
  const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const CHARACTERS = new Set(['knight', 'lancer', 'assassin', 'swordsman', 'reaper', 'random']);
  const MAX_MESSAGE = 24576;
  const now = () => (root.performance ? root.performance.now() : Date.now());
  function code() {
    const bytes = new Uint8Array(6);
    root.crypto.getRandomValues(bytes);
    return Array.from(bytes, b => ALPHABET[b % ALPHABET.length]).join('');
  }
  function normalizeCode(value) {
    const result = String(value || '').trim().toUpperCase();
    if (!/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/.test(result)) {
      throw new Error('Use o código de 6 caracteres mostrado pelo anfitrião.');
    }
    return result;
  }
  function validJSON(value) {
    let count = 0;
    const walk = (v, depth) => {
      if (++count > 2400 || depth > 9) return false;
      if (v === null || typeof v === 'boolean') return true;
      if (typeof v === 'number') return Number.isFinite(v);
      if (typeof v === 'string') return v.length <= 2048;
      if (Array.isArray(v)) return v.length <= 256 && v.every(x => walk(x, depth + 1));
      if (typeof v !== 'object') return false;
      const keys = Object.keys(v);
      return keys.length <= 128 && keys.every(k => k.length <= 64 && !['__proto__', 'prototype', 'constructor'].includes(k) && walk(v[k], depth + 1));
    };
    if (!value || typeof value !== 'object' || Array.isArray(value) || !walk(value, 0)) return false;
    try { return JSON.stringify(value).length <= MAX_MESSAGE; } catch (_) { return false; }
  }
  function peerError(err) {
    switch (err && err.type) {
      case 'peer-unavailable': return 'Sala não encontrada. Confira o código e se o anfitrião está com o jogo aberto.';
      case 'unavailable-id': return 'Este código já está em uso. Crie uma nova sala.';
      case 'browser-incompatible': return 'Este navegador não oferece WebRTC. Use uma versão atual do Chrome, Edge ou Firefox.';
      case 'webrtc': return 'A conexão direta falhou. Tente outra rede; redes restritivas podem bloquear o duelo.';
      default: return 'O serviço de salas está indisponível ou foi bloqueado pela rede. Tente novamente.';
    }
  }
  class DuelOnline {
    constructor(options = {}) {
      this.onStatus = options.onStatus || (() => {});
      this.onConnected = options.onConnected || (() => {});
      this.onMessage = options.onMessage || (() => {});
      this.onDisconnected = options.onDisconnected || (() => {});
      this.role = null; this.seat = 0; this.roomCode = ''; this.latency = null;
      this.connected = false; this.remoteCharacter = null;
      this.peer = null; this.connection = null;
      this._generation = 0; this._timers = new Set(); this._pending = new Map();
      this._closing = false; this._roomReady = false;
    }
    _status(text, state) { this.onStatus(text, state); }
    _timer(callback, delay) {
      const timer = setTimeout(() => { this._timers.delete(timer); callback(); }, delay);
      this._timers.add(timer); return timer;
    }
    _clear(timer) { clearTimeout(timer); this._timers.delete(timer); }
    _prepare(role, character) {
      this.close();
      if (!CHARACTERS.has(character)) throw new Error('Escolha uma das cinco classes.');
      if (typeof root.Peer !== 'function') throw new Error('A biblioteca de conexão não foi carregada. Reabra o arquivo completo do jogo.');
      if (!root.RTCPeerConnection) throw new Error('WebRTC indisponível. Abra o jogo em um navegador atualizado.');
      this.role = role; this.seat = role === 'host' ? 0 : 1;
      this.character = character; this._closing = false;
      return this._generation;
    }
    _openPeer(id, generation) {
      this._status('Conectando ao serviço de salas…', 'connecting');
      return new Promise((resolve, reject) => {
        let ready = false;
        this._openReject = reject;
        const peer = this.peer = new root.Peer(id, {
          host: '0.peerjs.com', port: 443, path: '/', secure: true,
          key: 'peerjs', debug: 0, pingInterval: 5000,
          config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }] }
        });
        const timeout = this._timer(() => this._fail('Não foi possível abrir o serviço de salas. Confira sua conexão e tente novamente.'), 16000);
        peer.on('open', () => {
          if (generation !== this._generation || ready) return;
          ready = true; this._clear(timeout); this._openReject = null; resolve(peer);
        });
        peer.on('connection', conn => {
          if (generation !== this._generation) { conn.close(); return; }
          if (this.role !== 'host' || this.connection) { this._reject(conn, 'busy'); return; }
          this._attach(conn, generation);
        });
        // This game never accepts media calls.
        peer.on('call', call => call.close());
        peer.on('error', err => {
          if (generation !== this._generation) return;
          if (this.connected && ['network', 'socket-error', 'socket-closed', 'disconnected'].includes(err.type)) {
            this._status('Duelo conectado · serviço de salas temporariamente indisponível.', 'connected');
            return;
          }
          this._fail(peerError(err));
        });
        peer.on('disconnected', () => {
          if (generation !== this._generation || this._closing) return;
          if (this.connected) {
            this._status('Duelo conectado · serviço de salas temporariamente indisponível.', 'connected');
            return;
          }
          this._fail('A sala perdeu contato com o servidor. Crie ou entre em uma sala novamente.');
        });
        peer.on('close', () => {
          if (generation === this._generation && !this._closing) this._fail('A conexão foi encerrada. Crie uma nova sala para jogar novamente.');
        });
      });
    }
    async createRoom(character) {
      const generation = this._prepare('host', character);
      this.roomCode = code();
      await this._openPeer(PREFIX + this.roomCode, generation);
      if (generation !== this._generation) throw new Error('Conexão cancelada.');
      this._roomReady = true;
      this._status('Aguardando oponente · compartilhe o código da sala.', 'waiting');
      return this.roomCode;
    }
    async joinRoom(room, character) {
      const normalized = normalizeCode(room);
      const generation = this._prepare('guest', character);
      this.roomCode = normalized;
      await this._openPeer(PREFIX + 'guest-' + code() + code(), generation);
      if (generation !== this._generation) throw new Error('Conexão cancelada.');
      return new Promise((resolve, reject) => {
        this._joinResolve = resolve; this._joinReject = reject;
        const conn = this.peer.connect(PREFIX + this.roomCode, {
          reliable: true, serialization: 'json', label: 'um-corte-v3-3',
          metadata: { version: VERSION }
        });
        this._attach(conn, generation);
      });
    }
    _reject(conn, reason) {
      const finish = () => {
        try { conn.send({ v: VERSION, k: 'reject', reason }); } catch (_) {}
        this._timer(() => { try { conn.close(); } catch (_) {} }, 250);
      };
      conn.on('error', () => {});
      if (conn.open) finish(); else conn.on('open', finish);
      this._timer(() => { try { conn.close(); } catch (_) {} }, 6000);
    }
    _attach(conn, generation) {
      this.connection = conn;
      this._status('Negociando conexão direta com o oponente…', 'negotiating');
      let authenticated = false, gotHello = false;
      let count = 0, countStart = now();
      const handshake = this._timer(() => {
        if (this.connection !== conn) return;
        if (this.role === 'host' && !this.connected) {
          this.connection = null; try { conn.close(); } catch (_) {}
          this._status('A conexão do oponente expirou. Aguardando nova tentativa…', 'waiting');
        } else this._fail('A conexão direta expirou. Confira o código ou tente outra rede; alguns roteadores bloqueiam conexões diretas.');
      }, 18000);
      conn.on('open', () => {
        if (generation !== this._generation || conn !== this.connection) return;
        if (this.role === 'guest') this._raw({ k: 'hello', character: this.character });
      });
      conn.on('data', packet => {
        if (generation !== this._generation || conn !== this.connection) return;
        if (now() - countStart > 1000) { count = 0; countStart = now(); }
        if (++count > 200 || !validJSON(packet) || packet.v !== VERSION || typeof packet.k !== 'string') {
          this._fail('O oponente enviou dados inválidos ou incompatíveis. A conexão foi encerrada.'); return;
        }
        this._lastReceived = now();
        if (packet.k === 'reject') {
          this._fail(packet.reason === 'busy' ? 'Esta sala já tem dois jogadores. Peça um novo código ao seu amigo.' : 'Os jogos usam versões diferentes. Abram o mesmo arquivo da V2.'); return;
        }
        if (!authenticated) {
          if (this.role === 'host' && packet.k === 'hello' && CHARACTERS.has(packet.character) && !gotHello) {
            gotHello = true; this.remoteCharacter = packet.character;
            this._raw({ k: 'welcome', character: this.character }); return;
          }
          if (this.role === 'guest' && packet.k === 'welcome' && CHARACTERS.has(packet.character)) {
            this.remoteCharacter = packet.character; this._raw({ k: 'ready' });
            authenticated = true; this._clear(handshake); this._connected(); return;
          }
          if (this.role === 'host' && gotHello && packet.k === 'ready') {
            authenticated = true; this._clear(handshake); this._connected(); return;
          }
          this._fail('A identificação do oponente é inválida. Abram o mesmo arquivo da V2.'); return;
        }
        if (packet.k === 'ping' && Number.isInteger(packet.seq) && Number.isFinite(packet.t)) {
          this._raw({ k: 'pong', seq: packet.seq, t: packet.t });
        } else if (packet.k === 'pong' && Number.isInteger(packet.seq) && this._pending.has(packet.seq)) {
          const rtt = Math.max(0, now() - this._pending.get(packet.seq));
          this._pending.delete(packet.seq);
          this.latency = Math.round(this.latency === null ? rtt : this.latency * .65 + rtt * .35);
        } else if (packet.k === 'game' && validJSON(packet.data)) {
          this.onMessage(packet.data);
        } else if (packet.k === 'bye') {
          this._fail('O oponente saiu da sala. Crie outra sala para jogar novamente.');
        } else {
          this._fail('A conexão recebeu uma mensagem de jogo inválida.');
        }
      });
      conn.on('close', () => {
        this._clear(handshake);
        if (generation !== this._generation || this.connection !== conn || this._closing) return;
        if (!this.connected && this.role === 'host') {
          this.connection = null; this.remoteCharacter = null;
          this._status('O oponente saiu antes de conectar. Aguardando oponente…', 'waiting');
        } else this._fail('O oponente desconectou. Crie uma nova sala para continuar.');
      });
      conn.on('error', () => {
        if (generation === this._generation && this.connection === conn) this._fail('Falha no canal do duelo. Tente reconectar; redes restritivas podem bloquear a conexão direta.');
      });
    }
    _connected() {
      this.connected = true; this._lastReceived = now(); this._pingSequence = 0;
      this._status('Conectado · duelo pronto.', 'connected');
      const info = { role: this.role, seat: this.seat, remoteCharacter: this.remoteCharacter };
      const resolve = this._joinResolve; this._joinResolve = null; this._joinReject = null;
      if (resolve) resolve(info);
      const generation = this._generation;
      const heartbeat = () => {
        if (!this.connected || generation !== this._generation) return;
        if (now() - this._lastReceived > 12000) {
          this._fail('Sem resposta do oponente por 12 segundos. O duelo foi encerrado.'); return;
        }
        const seq = ++this._pingSequence, t = now();
        this._pending.set(seq, t);
        for (const [key, started] of this._pending) if (t - started > 10000) this._pending.delete(key);
        this._raw({ k: 'ping', seq, t });
        this._timer(heartbeat, 1000);
      };
      heartbeat(); this.onConnected(info);
    }
    _raw(packet) {
      if (!this.connection || !this.connection.open) return false;
      try { this.connection.send({ v: VERSION, ...packet }); return true; } catch (_) { return false; }
    }
    send(message) {
      if (!this.connected || !validJSON(message) || !validJSON({ v: VERSION, k: 'game', data: message })) return false;
      // Keep reliable transport from accumulating stale snapshots on a poor link.
      const channel = this.connection && this.connection.dataChannel;
      if ((channel && channel.bufferedAmount > 262144) || this.connection.bufferSize > 8) return false;
      return this._raw({ k: 'game', data: message });
    }
    _fail(reason) {
      if (this._closing) return;
      const notify = this.connected || this._roomReady;
      this._status(reason, 'error');
      this._dispose(reason);
      if (notify) this.onDisconnected(reason);
    }
    _dispose(reason) {
      this._closing = true; this._generation++;
      const openReject = this._openReject, joinReject = this._joinReject;
      this._openReject = null; this._joinResolve = null; this._joinReject = null;
      if (openReject) openReject(new Error(reason));
      if (joinReject) joinReject(new Error(reason));
      for (const timer of this._timers) clearTimeout(timer);
      this._timers.clear(); this._pending.clear();
      const connection = this.connection, peer = this.peer;
      this.connection = null; this.peer = null; this.connected = false; this._roomReady = false;
      this.latency = null; this.remoteCharacter = null;
      try { if (connection) connection.close(); } catch (_) {}
      try { if (peer) peer.destroy(); } catch (_) {}
    }
    close() {
      if (this.connected) this._raw({ k: 'bye' });
      this._dispose('Conexão cancelada.');
      this.role = null; this.seat = 0; this.roomCode = '';
    }
  }
  DuelOnline.normalizeCode = normalizeCode;
  DuelOnline.validJSON = validJSON;
  root.DuelOnline = DuelOnline;
  if (typeof module !== 'undefined' && module.exports) module.exports = { DuelOnline };
})(typeof globalThis !== 'undefined' ? globalThis : window);

