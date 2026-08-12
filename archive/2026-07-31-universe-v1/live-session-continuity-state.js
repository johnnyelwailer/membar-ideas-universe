(function exposeLiveSessionState(global) {
  const STORAGE_KEY = 'membar:live-session-continuity:v01';
  const SOURCE_MOMENT = Object.freeze({
    song: 'North Window',
    artist: 'Jo Sable',
    source: 'north-window_take-02.mp4',
    section: 'Chorus',
    time: '01:00.0',
    seconds: 60,
    chord: 'G',
    bars: '8 bars',
    lyric: 'We are the weather in the room',
    provenance: 'performed source · synthetic fixture',
  });

  function initialState(sourceMoment = SOURCE_MOMENT) {
    return { version: 1, status: 'ready', sourceMoment, takes: [], selectedTakeId: null, returnPoint: null };
  }

  function capture(state, take) {
    if (!take || !take.id || state.takes.some((item) => item.id === take.id) || state.takes.length >= 2) return state;
    return { ...state, status: 'captured', takes: [...state.takes, { ...take, sourceMoment: state.sourceMoment || SOURCE_MOMENT }] };
  }

  function selectTake(state, takeId) {
    const take = state.takes.find((item) => item.id === takeId);
    if (!take) return state;
    return {
      ...state,
      status: 'selected',
      selectedTakeId: takeId,
      returnPoint: { version: 1, takeId, sourceMoment: state.sourceMoment || SOURCE_MOMENT, note: take.note },
    };
  }

  function restore(record, sourceMoment = SOURCE_MOMENT) {
    if (!record || record.version !== 1 || !Array.isArray(record.takes)) return initialState(sourceMoment);
    const takes = record.takes.filter((take) => take && typeof take.id === 'string').slice(0, 2);
    const selected = takes.some((take) => take.id === record.selectedTakeId) ? record.selectedTakeId : null;
    return { ...initialState(sourceMoment), status: selected ? 'selected' : takes.length ? 'captured' : 'ready', takes, selectedTakeId: selected, returnPoint: selected ? { ...record.returnPoint, sourceMoment } : null };
  }

  function read(storage, sourceMoment = SOURCE_MOMENT) {
    try { return restore(JSON.parse(storage?.getItem(STORAGE_KEY) || 'null'), sourceMoment); } catch (_) { return initialState(sourceMoment); }
  }

  function write(storage, state) {
    try { storage?.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* browser storage can be unavailable */ }
    return state;
  }

  function clear(storage) {
    try { storage?.removeItem(STORAGE_KEY); } catch (_) { /* browser storage can be unavailable */ }
  }

  global.MembarLiveSessionState = Object.freeze({ STORAGE_KEY, SOURCE_MOMENT, initialState, capture, selectTake, restore, read, write, clear });
})(typeof window === 'undefined' ? globalThis : window);
