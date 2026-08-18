(function exposeLiveSessionStateV18(global) {
  const STORAGE_KEY = 'membar:live-session-continuity:v02';
  const SOURCE_MOMENT = Object.freeze({ song: 'North Window', artist: 'Jo Sable', source: 'north-window_take-02.mp4', section: 'Chorus', time: '01:00.0', seconds: 60, chord: 'G', bars: '8 bars', lyric: 'We are the weather in the room', provenance: 'performed source · synthetic fixture' });
  function sourceKey(moment) { return ['song', 'artist', 'source', 'section', 'time'].map((key) => String(moment?.[key] || '')).join('|'); }
  function initialState(sourceMoment = SOURCE_MOMENT) { return { version: 2, status: 'ready', sourceMoment, sourceKey: sourceKey(sourceMoment), takes: [], selectedTakeId: null, returnPoint: null }; }
  function sameSourceMoment(left, right) { return Boolean(left && right && sourceKey(left) === sourceKey(right)); }
  function capture(state, take) { if (!take || !take.id || state.takes.some((item) => item.id === take.id) || state.takes.length >= 2) return state; return { ...state, status: 'captured', takes: [...state.takes, { ...take, sourceMoment: state.sourceMoment || SOURCE_MOMENT }] }; }
  function selectTake(state, takeId) { const take = state.takes.find((item) => item.id === takeId); return take ? { ...state, status: 'selected', selectedTakeId: takeId, returnPoint: { version: 2, takeId, sourceMoment: state.sourceMoment || SOURCE_MOMENT, note: take.note } } : state; }
  function restore(record, sourceMoment = SOURCE_MOMENT) { if (!record || record.version !== 2 || !Array.isArray(record.takes) || record.sourceKey !== sourceKey(sourceMoment)) return initialState(sourceMoment); const takes = record.takes.filter((take) => take && typeof take.id === 'string' && sameSourceMoment(take.sourceMoment, sourceMoment)).slice(0, 2); const selected = takes.some((take) => take.id === record.selectedTakeId) ? record.selectedTakeId : null; const returnPoint = selected && record.returnPoint && sameSourceMoment(record.returnPoint.sourceMoment, sourceMoment) ? { ...record.returnPoint, sourceMoment } : null; return { ...initialState(sourceMoment), status: selected ? 'selected' : takes.length ? 'captured' : 'ready', takes, selectedTakeId: selected, returnPoint }; }
  function read(storage, sourceMoment = SOURCE_MOMENT) { try { return restore(JSON.parse(storage?.getItem(STORAGE_KEY) || 'null'), sourceMoment); } catch (_) { return initialState(sourceMoment); } }
  function write(storage, state) { try { storage?.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {} return state; }
  function clear(storage) { try { storage?.removeItem(STORAGE_KEY); } catch (_) {} }
  global.MembarLiveSessionStateV18 = Object.freeze({ STORAGE_KEY, SOURCE_MOMENT, sourceKey, sameSourceMoment, initialState, capture, selectTake, restore, read, write, clear });
  if (typeof module !== 'undefined' && module.exports) module.exports = global.MembarLiveSessionStateV18;
})(typeof window === 'undefined' ? globalThis : window);
