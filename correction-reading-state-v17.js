(function exposeCorrectionReadingState(global) {
  const STORAGE_KEY = 'membar:correction-reading:v01';
  function candidateFor(context) {
    const lyric = String(context?.lyric || '');
    const options = lyric.includes('weather') ? ['weather', 'whether', 'feather'] : lyric.includes('light') ? ['light', 'night', 'right'] : lyric.includes('room') ? ['room', 'roam', 'bloom'] : [lyric.split(/\s+/).filter(Boolean)[0] || 'word', 'heard', 'hold'];
    return { id: `${context?.id || 'moment'}-${options[0]}`, word: options[0], candidates: options.map((word, index) => ({ word, confidence: [0.61, 0.24, 0.15][index] || 0.1, note: index === 0 ? 'performed wording' : index === 1 ? 'phonetic match · context' : 'phonetic match' })) };
  }
  function normalize(raw, context) {
    const word = candidateFor(context); const sameMoment = raw?.momentId === context?.id; const display = sameMoment && word.candidates.some((candidate) => candidate.word === raw?.display) ? raw.display : word.word;
    return { version: 1, momentId: String(context?.id || raw?.momentId || 'moment'), wordId: word.id, display, status: display === word.word ? 'performed' : 'corrected', payload: context };
  }
  function apply(state, candidate) { const display = String(candidate || state.display); return { ...state, display, status: display === candidateFor(state.payload).word ? 'performed' : 'corrected' }; }
  function restore(state) { return { ...state, display: candidateFor(state.payload).word, status: 'restored' }; }
  function displayLyric(context, state) { const word = candidateFor(context).word; return String(context?.lyric || '').replace(word, state?.display || word); }
  function read(storage, context) { try { return normalize(JSON.parse(storage?.getItem(STORAGE_KEY) || 'null'), context); } catch (_) { return normalize(null, context); } }
  function write(storage, state) { try { storage?.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* private browsing */ } return state; }
  const api = Object.freeze({ STORAGE_KEY, candidateFor, normalize, apply, restore, displayLyric, read, write });
  global.MembarCorrectionReadingState = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window === 'undefined' ? globalThis : window);
