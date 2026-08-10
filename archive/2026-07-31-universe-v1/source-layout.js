(function mountSourceLayout(global) {
  if (!global.document || !global.MembarSourceLayoutState) return;
  const S = global.MembarSourceLayoutState;
  const $ = (id) => global.document.getElementById(id);
  const model = S.MODEL;
  let seconds = Number(new URLSearchParams(global.location.search).get('at')) || 47.3;
  let playing = false;
  let timer = null;
  let compare = true;
  let keptMoment = S.read(global.localStorage);

  function render() {
    const moment = S.momentAtTime(seconds);
    const scene = $('sourceFrame');
    global.document.body.dataset.scene = moment.scene;
    scene.dataset.scene = moment.scene;
    $('frameSection').textContent = moment.label;
    $('frameTitle').textContent = moment.scene === 'rain' ? 'weather in the room' : moment.scene === 'window' ? 'leave a light on' : moment.scene === 'kitchen' ? 'after the kettle' : 'blue hour';
    $('frameTime').textContent = moment.time;
    $('frameSource').textContent = moment.source + ' · source frame';
    $('readoutSection').textContent = moment.label.toUpperCase();
    $('readoutTime').textContent = moment.time;
    $('readoutChord').textContent = moment.chord;
    $('readoutBars').textContent = moment.bars;
    $('readoutProvenance').textContent = moment.source + ' · ' + moment.time;
    $('readoutLyric').textContent = moment.lyric;
    $('readoutNote').textContent = moment.note + ' · performed line';
    $('timeline').value = String(moment.seconds);
    $('timelineValue').textContent = moment.time;
    $('playState').textContent = playing ? 'source preview moving · reading follows' : 'source evidence stays authoritative';
    $('playButton').textContent = playing ? '■ Pause source' : '▶ Play source';
    $('playButton').setAttribute('aria-pressed', String(playing));
    $('compareButton').textContent = compare ? 'Reading layer on' : 'Source only';
    $('compareButton').setAttribute('aria-pressed', String(compare));
    $('deck').classList.toggle('source-only', !compare);
    global.document.querySelectorAll('[data-section]').forEach((button) => button.classList.toggle('is-active', button.dataset.section === moment.id));
    const kept = keptMoment || S.read(global.localStorage);
    const isKept = kept && kept.id === moment.id && kept.seconds === moment.seconds;
    $('keepButton').textContent = isKept ? '✓ Moment kept' : '+ Keep this section';
    $('keepButton').classList.toggle('is-kept', Boolean(isKept));
    $('keepStatus').textContent = isKept ? 'This exact source-backed moment is ready to revisit.' : 'Keep the exact section and timestamp as a return point.';
    const returnCard = $('returnCard');
    if (kept) {
      returnCard.hidden = false;
      $('returnText').textContent = kept.label + ' · ' + kept.time + ' · ' + kept.chord;
    } else returnCard.hidden = true;
  }

  function stop() { playing = false; global.clearInterval(timer); timer = null; render(); }
  $('timeline').addEventListener('input', (event) => { seconds = Number(event.target.value); render(); });
  $('playButton').addEventListener('click', () => {
    playing = !playing;
    if (playing) timer = global.setInterval(() => { seconds = seconds >= model.duration ? 0 : seconds + .6; render(); }, 250);
    else stop();
    render();
  });
  $('compareButton').addEventListener('click', () => { compare = !compare; render(); });
  $('keepButton').addEventListener('click', () => { const moment = S.momentAtTime(seconds); keptMoment = S.write(global.localStorage, moment) || moment; $('keepStatus').textContent = 'Kept · return point created below.'; render(); });
  $('returnButton').addEventListener('click', () => { const kept = keptMoment || S.read(global.localStorage); if (kept) { seconds = kept.seconds; $('restoreStatus').textContent = 'Restored · source, lyric, chord, and section rejoined.'; render(); } });
  global.document.querySelectorAll('[data-section]').forEach((button) => button.addEventListener('click', () => { seconds = Number(button.dataset.at); $('restoreStatus').textContent = ''; render(); }));
  global.addEventListener('beforeunload', stop);
  render();
})(typeof window === 'undefined' ? globalThis : window);
