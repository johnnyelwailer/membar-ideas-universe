(function exposeSourceStripState(global) {
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function formatTime(seconds) {
    const safeSeconds = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(safeSeconds / 60);
    const remainder = (safeSeconds - minutes * 60).toFixed(1).padStart(4, '0');
    return String(minutes).padStart(2, '0') + ':' + remainder;
  }

  function ratioToTime(ratio, duration) {
    return clamp(Number(ratio) || 0, 0, 1) * duration;
  }

  function timeToRatio(seconds, duration) {
    return clamp((Number(seconds) || 0) / duration, 0, 1);
  }

  function sectionAtTime(sections, seconds) {
    const safeSeconds = Math.max(0, Number(seconds) || 0);
    let active = sections[0];
    sections.forEach((section) => {
      if (safeSeconds >= section.start) active = section;
    });
    return active;
  }

  function momentAtTime(model, seconds) {
    const safeSeconds = clamp(seconds, 0, model.duration);
    const section = sectionAtTime(model.sections, safeSeconds);
    return {
      id: section.id,
      sectionId: section.id,
      label: section.label,
      seconds: Number(safeSeconds.toFixed(1)),
      time: formatTime(safeSeconds),
      chord: section.chord,
      lyric: section.lyric,
      scene: section.scene,
      song: model.song,
      artist: model.artist,
      source: model.source,
    };
  }

  function restoreMoment(model, moment) {
    const restored = momentAtTime(model, moment.seconds);
    return { ...restored, time: moment.time };
  }

  global.MembarSourceStripState = Object.freeze({
    clamp,
    formatTime,
    ratioToTime,
    timeToRatio,
    sectionAtTime,
    momentAtTime,
    restoreMoment,
  });
})(window);
