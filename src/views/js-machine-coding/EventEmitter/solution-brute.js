/**
 * EventEmitter — core on / off / emit
 *
 * The data structure IS the answer: a plain object mapping
 * event name -> array of listeners. Everything else is array ops.
 */
class EventEmitter {
  constructor() {
    this.events = {}; // { eventName: [fn, fn, ...] }
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event, listener) {
    const listeners = this.events[event];
    if (!listeners) return;
    this.events[event] = listeners.filter((fn) => fn !== listener);
  }

  emit(event, ...args) {
    const listeners = this.events[event];
    if (!listeners) return;
    for (const fn of listeners) {
      fn(...args);
    }
  }
}

// ── Usage ────────────────────────────────────────────────────────────────────

const emitter = new EventEmitter();

function onLogin(user) {
  console.log('logged in:', user);
}

emitter.on('login', onLogin);
emitter.emit('login', 'yogesh'); // logged in: yogesh
emitter.off('login', onLogin);
emitter.emit('login', 'nobody'); // (nothing — listener removed)
