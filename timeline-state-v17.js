(function exposeTimelineState(global) {
  const STORAGE_KEY = 'membar:chronological-timeline:v01';

  function clampIndex(index, length) {
    const max = Math.max(0, length - 1);
    return Math.min(max, Math.max(0, Number.isFinite(Number(index)) ? Number(index) : 0));
  }

  function moveIndex(state, delta, length) {
    return { ...state, index: clampIndex(state.index + delta, length) };
  }

  function togglePlaying(state) {
    return { ...state, playing: !state.playing };
  }

  function holdMoment(state, moments) {
    const moment = moments[clampIndex(state.index, moments.length)];
    return { ...state, index: moment ? moment.index : 0, heldId: moment ? moment.id : null };
  }

  function restore(raw, length) {
    if (!raw || typeof raw !== 'object') return { index: 0, playing: false, heldId: null };
    return {
      index: clampIndex(raw.index, length),
      playing: false,
      heldId: typeof raw.heldId === 'string' ? raw.heldId : null,
    };
  }

  const api = Object.freeze({ STORAGE_KEY, clampIndex, moveIndex, togglePlaying, holdMoment, restore });
  global.MembarTimelineState = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window === 'undefined' ? globalThis : window);
