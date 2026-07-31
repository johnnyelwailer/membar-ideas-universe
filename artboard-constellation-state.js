(function exposeConstellationState(global) {
  const STORAGE_KEY = 'membar:constellation-pin:v01';
  const MODEL = Object.freeze({
    song: 'North Window',
    artist: 'Jo Sable',
    source: 'north-window_take-02.mp4',
    moment: Object.freeze({
      id: 'chorus',
      label: 'Chorus',
      chord: 'G',
      seconds: 60,
      time: '00:60.0',
      lyric: 'We are the weather in the room',
      note: 'hook candidate',
    }),
    treatments: Object.freeze([
      Object.freeze({ id: 'ember', label: 'Ember drift', desc: 'warm particles · slow pull' }),
      Object.freeze({ id: 'tide', label: 'Tide glass', desc: 'cool rings · breathing' }),
    ]),
  });
  const TREATMENT_IDS = MODEL.treatments.map((treatment) => treatment.id);

  function initialState() {
    return { placed: false, treatment: null, pinned: false };
  }
  function place(state) {
    return { placed: true, treatment: null, pinned: false };
  }
  function selectTreatment(state, id) {
    if (!state.placed || TREATMENT_IDS.indexOf(id) === -1) return state;
    return { placed: true, treatment: id, pinned: false };
  }
  function pin(state) {
    if (!state.placed || !state.treatment) return state;
    return { placed: true, treatment: state.treatment, pinned: true };
  }
  function release(state) {
    return { placed: state.placed, treatment: state.treatment, pinned: false };
  }
  function treatmentFor(state) {
    return MODEL.treatments.find((treatment) => treatment.id === state.treatment) || null;
  }
  function pinRecord(state) {
    if (!state.pinned || !state.treatment) return null;
    const treatment = treatmentFor(state);
    return {
      version: 1,
      song: MODEL.song,
      artist: MODEL.artist,
      source: MODEL.source,
      momentId: MODEL.moment.id,
      momentLabel: MODEL.moment.label,
      chord: MODEL.moment.chord,
      seconds: MODEL.moment.seconds,
      time: MODEL.moment.time,
      lyric: MODEL.moment.lyric,
      treatment: treatment.id,
      treatmentLabel: treatment.label,
      pinnedAt: '31 Jul 2026',
    };
  }
  function restore(record) {
    if (!record || record.version !== 1 || TREATMENT_IDS.indexOf(record.treatment) === -1) return null;
    return { placed: true, treatment: record.treatment, pinned: true };
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

  global.MembarConstellationState = Object.freeze({
    STORAGE_KEY, MODEL, TREATMENT_IDS,
    initialState, place, selectTreatment, pin, release,
    treatmentFor, pinRecord, restore, read, write, clear,
  });
})(typeof window === 'undefined' ? globalThis : window);
