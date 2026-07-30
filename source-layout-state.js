(function exposeSourceLayoutState(global) {
  const STORAGE_KEY = 'membar:source-layout-moment:v01';
  const MODEL = Object.freeze({
    duration: 72,
    song: 'North Window',
    artist: 'Jo Sable',
    source: 'north-window_take-02.mp4',
    sections: Object.freeze([
      Object.freeze({ id: 'cold-open', start: 0, end: 18.6, label: 'Cold open', chord: 'Am', bars: '4 bars', scene: 'sea', lyric: 'Harbor light, do not let me go', note: 'room tone' }),
      Object.freeze({ id: 'verse', start: 18.6, end: 42, label: 'Verse 1', chord: 'F', bars: '8 bars', scene: 'kitchen', lyric: 'I kept the kettle singing low', note: 'close vocal' }),
      Object.freeze({ id: 'pre', start: 42, end: 54.4, label: 'Pre-chorus', chord: 'C', bars: '4 bars', scene: 'window', lyric: 'If I leave, leave a light on', note: 'lift' }),
      Object.freeze({ id: 'chorus', start: 54.4, end: 72, label: 'Chorus', chord: 'G', bars: '8 bars', scene: 'rain', lyric: 'We are the weather in the room', note: 'hook candidate' }),
    ]),
  });

  function clamp(value, min, max) { return Math.min(max, Math.max(min, Number(value) || 0)); }
  function formatTime(seconds) {
    const safe = clamp(seconds, 0, MODEL.duration);
    return '00:' + safe.toFixed(1).padStart(4, '0');
  }
  function sectionAtTime(seconds) {
    const safe = clamp(seconds, 0, MODEL.duration);
    return MODEL.sections.reduce((active, section) => safe >= section.start ? section : active, MODEL.sections[0]);
  }
  function momentAtTime(seconds) {
    const safe = clamp(seconds, 0, MODEL.duration);
    const section = sectionAtTime(safe);
    return { seconds: Number(safe.toFixed(1)), time: formatTime(safe), ...section, song: MODEL.song, artist: MODEL.artist, source: MODEL.source };
  }
  function read(storage) {
    try { return JSON.parse(storage?.getItem(STORAGE_KEY) || 'null'); } catch (_) { return null; }
  }
  function write(storage, moment) {
    try { storage?.setItem(STORAGE_KEY, JSON.stringify(moment)); return moment; } catch (_) { return null; }
  }
  function clear(storage) {
    try { storage?.removeItem(STORAGE_KEY); } catch (_) { /* private browsing */ }
  }

  global.MembarSourceLayoutState = Object.freeze({ STORAGE_KEY, MODEL, clamp, formatTime, sectionAtTime, momentAtTime, read, write, clear });
})(typeof window === 'undefined' ? globalThis : window);
