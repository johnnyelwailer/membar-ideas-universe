(function exposeCueStore(global) {
  const STORAGE_KEY = 'membar:last-live-cue';
  const MAX_ENTRIES = 6;

  function read() {
    try {
      const value = global.localStorage?.getItem(STORAGE_KEY);
      const parsed = value ? JSON.parse(value) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function write(entry) {
    try {
      const next = [entry, ...read().filter((item) => item?.id !== entry.id)].slice(0, MAX_ENTRIES);
      global.localStorage?.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    } catch (_) {
      return read();
    }
  }

  function clear() {
    try { global.localStorage?.removeItem(STORAGE_KEY); } catch (_) { /* private browsing */ }
  }

  global.MembarCueStore = Object.freeze({ STORAGE_KEY, MAX_ENTRIES, read, write, clear });
})(window);
