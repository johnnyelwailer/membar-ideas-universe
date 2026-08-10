(function exposeMomentStore(global) {
  const STORAGE_KEY = 'membar:last-kept-moment';

  function read() {
    try {
      const value = global.localStorage?.getItem(STORAGE_KEY);
      return value ? JSON.parse(value) : null;
    } catch (_) {
      return null;
    }
  }

  function write(moment) {
    try {
      global.localStorage?.setItem(STORAGE_KEY, JSON.stringify(moment));
      return moment;
    } catch (_) {
      return null;
    }
  }

  function clear() {
    try { global.localStorage?.removeItem(STORAGE_KEY); } catch (_) { /* private browsing */ }
  }

  global.MembarMomentStore = Object.freeze({ STORAGE_KEY, read, write, clear });
})(window);
