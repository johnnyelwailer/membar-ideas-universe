(function exposeCorrectionStore(global) {
  const STORAGE_KEY = 'membar:strip-corrections';
  const MAX_ENTRIES = 6;

  function read() {
    try {
      const parsed = JSON.parse(global.localStorage?.getItem(STORAGE_KEY) || '[]');
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

  global.MembarCorrectionStore = Object.freeze({ STORAGE_KEY, MAX_ENTRIES, read, write, clear });
})(window);
