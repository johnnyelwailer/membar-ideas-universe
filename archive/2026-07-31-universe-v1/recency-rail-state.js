(function exposeRecencyRailState(global) {
  const STORAGE_KEY = 'membar:recency-focus:v01';
  const WINDOWS = Object.freeze([
    Object.freeze({ id: 'w7', label: 'Last 7 days', short: '7 days', range: '25–31 Jul', from: 25, to: 31 }),
    Object.freeze({ id: 'w14', label: 'Past two weeks', short: '2 weeks', range: '18–24 Jul', from: 18, to: 24 }),
    Object.freeze({ id: 'w30', label: 'Past month', short: '1 month', range: '11–17 Jul', from: 11, to: 17 }),
    Object.freeze({ id: 'deep', label: 'Deep archive', short: 'older', range: '1–10 Jul', from: 1, to: 10 }),
  ]);
  const WINDOW_IDS = WINDOWS.map((windowEntry) => windowEntry.id);

  function windowIndex(windowId) {
    return WINDOW_IDS.indexOf(windowId);
  }

  function windowForIndex(index) {
    return WINDOWS[index] || null;
  }

  function windowForDay(day) {
    const value = Number(day);
    if (!Number.isFinite(value)) return null;
    const found = WINDOWS.find((entry) => value >= entry.from && value <= entry.to);
    return found ? found.id : null;
  }

  function inScope(index, horizon) {
    return index >= 0 && index <= horizon;
  }

  function initialState() {
    return { horizon: WINDOWS.length - 1, nodeId: null, pinned: false };
  }

  function scrubTo(state, windowId) {
    const index = windowIndex(windowId);
    if (index === -1) return state;
    return { horizon: index, nodeId: state.nodeId, pinned: state.pinned };
  }

  function selectNode(state, nodeId) {
    if (typeof nodeId !== 'string' || !nodeId) return state;
    return { horizon: state.horizon, nodeId, pinned: state.pinned };
  }

  function pin(state, nodeId) {
    const id = nodeId || state.nodeId;
    if (!id) return state;
    return { horizon: state.horizon, nodeId: id, pinned: true };
  }

  function release(state) {
    return { horizon: state.horizon, nodeId: state.nodeId, pinned: false };
  }

  function focusRecord(state, pinnedAt) {
    if (!state.pinned || !state.nodeId) return null;
    return { version: 1, nodeId: state.nodeId, windowId: WINDOW_IDS[state.horizon], pinnedAt: pinnedAt || '' };
  }

  function restore(record) {
    if (!record || record.version !== 1) return null;
    const horizon = windowIndex(record.windowId);
    if (horizon === -1 || typeof record.nodeId !== 'string' || !record.nodeId) return null;
    return { horizon, nodeId: record.nodeId, pinned: true };
  }

  function read(storage) {
    try { return JSON.parse(storage?.getItem(STORAGE_KEY) || 'null'); } catch (_) { return null; }
  }

  function write(storage, record) {
    try { storage?.setItem(STORAGE_KEY, JSON.stringify(record)); return record; } catch (_) { return null; }
  }

  function clear(storage) {
    try { storage?.removeItem(STORAGE_KEY); } catch (_) { /* private browsing */ }
  }

  global.MembarRecencyRailState = Object.freeze({
    STORAGE_KEY, WINDOWS, WINDOW_IDS,
    windowIndex, windowForIndex, windowForDay, inScope,
    initialState, scrubTo, selectNode, pin, release,
    focusRecord, restore, read, write, clear,
  });
})(typeof window === 'undefined' ? globalThis : window);
