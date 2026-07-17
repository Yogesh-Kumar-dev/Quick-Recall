/**
 * EventEmitter — with once() and unsubscribe handles
 *
 * Two production upgrades interviewers ask for as follow-ups:
 * 1. on() returns an unsubscribe function (no need to keep the listener reference)
 * 2. once() — listener auto-removes after its first call
 */
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);

    // Return an unsubscribe handle — the pattern every store/library uses
    return () => this.off(event, listener);
  }

  once(event, listener) {
    // Wrap the listener so it removes itself right before running
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };
    return this.on(event, wrapper);
  }

  off(event, listener) {
    const listeners = this.events[event];
    if (!listeners) return;
    this.events[event] = listeners.filter((fn) => fn !== listener);
  }

  emit(event, ...args) {
    const listeners = this.events[event];
    if (!listeners) return;
    // Copy before iterating so a listener that unsubscribes mid-emit doesn't skip others
    for (const fn of [...listeners]) {
      fn(...args);
    }
  }
}

// ── Usage ────────────────────────────────────────────────────────────────────

const emitter = new EventEmitter();

const unsubscribe = emitter.on('data', (x) => console.log('data:', x));
emitter.once('ready', () => console.log('ready fires once'));

emitter.emit('ready'); // ready fires once
emitter.emit('ready'); // (nothing)
emitter.emit('data', 42); // data: 42
unsubscribe();
emitter.emit('data', 43); // (nothing)
