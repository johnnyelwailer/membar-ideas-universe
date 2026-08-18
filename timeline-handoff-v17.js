(function exposeTimelineHandoff(global) {
  const VERSION = 1;
  const REQUIRED = ['id', 'song', 'artist', 'source', 'section', 'time', 'chord', 'lyric'];
  const SAFE_TEXT = /^[^<>]{1,160}$/u;

  function contextFor(moment) {
    const context = moment && moment.context ? moment.context : {};
    return {
      v: VERSION,
      id: String(moment.id),
      song: String(context.song || 'North Window'),
      artist: String(context.artist || 'Jo Sable'),
      source: String(context.source || 'north-window_take-02.mp4'),
      section: String(context.section || 'Chorus'),
      time: String(context.time || '01:00.0'),
      seconds: Number.isFinite(Number(context.seconds)) ? Number(context.seconds) : 60,
      chord: String(context.chord || 'G'),
      bars: String(context.bars || '8 bars'),
      lyric: String(context.lyric || 'We are the weather in the room'),
      provenance: String(context.provenance || 'performed source · synthetic fixture'),
    };
  }

  function isValid(payload) {
    return Boolean(payload && payload.v === VERSION && REQUIRED.every((key) => typeof payload[key] === 'string' && SAFE_TEXT.test(payload[key])) && SAFE_TEXT.test(String(payload.bars || '')) && SAFE_TEXT.test(String(payload.provenance || '')) && Number.isFinite(Number(payload.seconds)));
  }

  function encode(payload) {
    return `v${VERSION}.${encodeURIComponent(JSON.stringify(payload))}`;
  }

  function decode(value) {
    try {
      if (typeof value !== 'string' || !value.startsWith(`v${VERSION}.`)) return null;
      const payload = JSON.parse(decodeURIComponent(value.slice(3)));
      return isValid(payload) ? payload : null;
    } catch (_) {
      return null;
    }
  }

  function routeHref(route, moment) {
    const joiner = route.includes('?') ? '&' : '?';
    return `${route}${joiner}moment=${encode(contextFor(moment))}`;
  }

  function returnHref(payload) {
    const context = typeof payload === 'string' ? { id: payload } : payload;
    return context && context.id ? `../../index.html?returnMoment=${encodeURIComponent(String(context.id))}#timeline` : '../../index.html#timeline';
  }

  const api = Object.freeze({ VERSION, contextFor, encode, decode, routeHref, returnHref, isValid });
  global.MembarTimelineHandoff = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window === 'undefined' ? globalThis : window);
