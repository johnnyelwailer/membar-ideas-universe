(function exposeRehearsalReadingState(global) {
  const STORAGE_KEY = 'membar:rehearsal-reading:v01';
  function sourceKey(moment) { return ['song', 'artist', 'source', 'section', 'time'].map((key) => String(moment?.[key] || '')).join('|'); }
  function initialState(payload) { return { version: 1, momentId: String(payload?.id || 'moment'), sourceKey: sourceKey(payload), selectedPassId: 'pass-a', keptPassId: null }; }
  function normalize(raw, payload, passes) {
    const base = initialState(payload); const valid = (value) => passes.some((pass) => pass.id === value);
    if (!raw || raw.version !== 1 || raw.momentId !== base.momentId || raw.sourceKey !== base.sourceKey) return base;
    const selectedPassId = valid(raw.selectedPassId) ? raw.selectedPassId : base.selectedPassId;
    return { ...base, selectedPassId, keptPassId: valid(raw.keptPassId) ? raw.keptPassId : null };
  }
  function select(state, passId, passes) { return passes.some((pass) => pass.id === passId) ? { ...state, selectedPassId: passId } : state; }
  function keep(state) { return { ...state, keptPassId: state.selectedPassId }; }
  function read(storage, payload, passes) { try { return normalize(JSON.parse(storage?.getItem(STORAGE_KEY) || 'null'), payload, passes); } catch (_) { return initialState(payload); } }
  function write(storage, state) { try { storage?.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {} return state; }
  function clear(storage) { try { storage?.removeItem(STORAGE_KEY); } catch (_) {} }
  global.MembarRehearsalReadingState = Object.freeze({ STORAGE_KEY, sourceKey, initialState, normalize, select, keep, read, write, clear });
  if (typeof module !== 'undefined' && module.exports) module.exports = global.MembarRehearsalReadingState;
})(typeof window === 'undefined' ? globalThis : window);
