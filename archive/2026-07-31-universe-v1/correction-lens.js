(function exposeCorrectionLens(global) {
  function activeWordAt(words, seconds) {
    const safeSeconds = Number(seconds) || 0;
    return (words || []).reduce((active, word) => {
      const distance = Math.abs(safeSeconds - word.at);
      if (distance <= word.window && (!active || distance < active.distance)) {
        return { word, distance };
      }
      return active;
    }, null)?.word || null;
  }

  function displayFor(word, entry) {
    return entry?.status === 'corrected' && entry.display ? entry.display : word.word;
  }

  function buildEntry(word, candidate, moment, status = 'corrected') {
    return {
      id: word.id,
      performed: word.word,
      display: candidate.word,
      confidence: candidate.confidence,
      seconds: word.at,
      time: moment.time,
      section: moment.label,
      chord: moment.chord,
      song: moment.song,
      artist: moment.artist,
      source: moment.source,
      status,
    };
  }

  global.MembarCorrectionLens = Object.freeze({ activeWordAt, displayFor, buildEntry });
})(window);
