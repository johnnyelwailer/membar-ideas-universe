(function bootLiveSessionContinuity(global) {
  const S = global.MembarLiveSessionState;
  const H = global.MembarTimelineHandoff;
  const $ = (id) => document.getElementById(id);
  const storage = (() => { try { return global.localStorage; } catch (_) { return null; } })();
  const handoff = H.decode(new URLSearchParams(global.location.search).get('moment'));
  const sourceMoment = handoff || S.SOURCE_MOMENT;
  let state = S.read(storage, sourceMoment);
  let entered = state.takes.length > 0;
  let capturing = false;
  let timer = null;
  let captureStartedAt = 0;
  const takeCards = { 'take-a': $('takeA'), 'take-b': $('takeB') };
  $('meterBars').innerHTML = Array.from({ length: 34 }, (_, index) => `<i style="--h:${28 + (index * 17) % 58}%"></i>`).join('');
  function renderSource() {
    $('frameSection').textContent = sourceMoment.section; $('frameTime').textContent = sourceMoment.time; $('frameChord').textContent = sourceMoment.chord;
    $('performedLine').textContent = `“${sourceMoment.lyric}”`; $('readSection').textContent = sourceMoment.section; $('readTime').textContent = sourceMoment.time; $('readBars').textContent = `${sourceMoment.bars} · ${sourceMoment.chord}`;
    $('sourceProvenance').textContent = `${sourceMoment.song} · ${sourceMoment.artist} · ${sourceMoment.source} · ${sourceMoment.provenance}`;
    $('fixtureSong').textContent = sourceMoment.song; $('fixtureArtist').textContent = sourceMoment.artist;
    document.querySelector('.source-context strong').textContent = `${sourceMoment.song} · source moment`; document.querySelector('.source-context small').textContent = `${sourceMoment.artist} · ${sourceMoment.source} · ${sourceMoment.provenance}`;
    document.title = `Membar ${sourceMoment.song} · ${sourceMoment.section} ${sourceMoment.time}`;
    $('timelineBack').href = H.returnHref(sourceMoment);
  }

  function setStatus(text) { $('statusLine').textContent = text; }
  function render() {
    const selected = state.selectedTakeId;
    $('sessionState').classList.toggle('is-live', capturing);
    $('sessionStateText').textContent = capturing ? 'capturing synthetic take' : entered ? state.takes.length ? 'session passes ready' : 'session open' : 'ready to rehearse';
    $('meter').classList.toggle('is-live', capturing);
    $('meterLabel').textContent = capturing ? 'listening · capture for 8 sec' : entered ? 'source anchor held · compare below' : 'standby · source anchor held';
    $('enterButton').disabled = entered;
    $('captureButton').disabled = !entered || capturing || state.takes.length >= 2;
    $('captureButton').textContent = capturing ? '■ Stop and keep pass' : `● Capture Take ${state.takes.length === 0 ? 'A' : 'B'}`;
    $('takeCount').textContent = `${state.takes.length} of 2 captured`;
    if (state.status === 'selected') setStatus('A chosen pass is ready · reopen its Workbench return point below.');
    else if (state.status === 'captured') setStatus('Session passes restored · tap either one to compare and choose.');
    Object.entries(takeCards).forEach(([id, card]) => {
      const take = state.takes.find((item) => item.id === id);
      card.hidden = !take;
      card.classList.toggle('is-selected', selected === id);
      card.querySelector('.selected-mark').hidden = selected !== id;
    });
    if (selected) {
      const take = state.takes.find((item) => item.id === selected);
      $('returnText').innerHTML = `<strong>${take.label} chosen.</strong> ${take.note} · source moment ${sourceMoment.time} is still the anchor.`;
      $('workbenchButton').hidden = false;
      $('workbenchButton').textContent = `Return ${take.label} to Workbench ↗`;
    } else {
      $('returnText').innerHTML = state.takes.length === 2 ? '<strong>Compare the two passes.</strong> Tap one to choose a return point.' : '<strong>No take chosen yet.</strong> Capture two passes, then choose one to make a return point.';
      $('workbenchButton').hidden = true;
    }
  }

  function persist(next) { state = S.write(storage, next); render(); }
  function enterSession() { entered = true; $('rehearsalTitle').textContent = 'Make a small pass'; $('rehearsalHint').textContent = 'The source moment stays pinned while you try the line.'; setStatus('Live Session entered · the performed source remains untouched.'); render(); }
  function finishCapture() {
    const id = state.takes.length === 0 ? 'take-a' : 'take-b';
    const take = id === 'take-a' ? { id, label: 'Take A', note: 'held the final word open', duration: '00:08' } : { id, label: 'Take B', note: 'leaned into the room tone', duration: '00:08' };
    entered = true; capturing = false; clearInterval(timer); timer = null;
    persist(S.capture(state, take));
    setStatus(`${take.label} kept as a synthetic session pass. Capture one more, then compare.`);
  }
  function startCapture() { if (!entered || state.takes.length >= 2) return; capturing = true; captureStartedAt = Date.now(); setStatus('Capturing a synthetic pass · stop when the phrase lands.'); render(); timer = setInterval(() => { if (Date.now() - captureStartedAt > 1500) finishCapture(); }, 120); }
  function selectTake(id) { const next = S.selectTake(state, id); if (next === state) return; persist(next); setStatus(`${next.takes.find((take) => take.id === id).label} selected · the source timestamp remains 01:00.0.`); }
  $('enterButton').addEventListener('click', enterSession);
  $('captureButton').addEventListener('click', () => capturing ? finishCapture() : startCapture());
  $('takeA').addEventListener('click', () => selectTake('take-a'));
  $('takeB').addEventListener('click', () => selectTake('take-b'));
  $('resetButton').addEventListener('click', () => { clearInterval(timer); timer = null; capturing = false; entered = false; persist(S.initialState(sourceMoment)); $('rehearsalTitle').textContent = 'Try the line again'; $('rehearsalHint').textContent = 'The source stays visible while you rehearse.'; setStatus('Passes reset · choose Enter to bring this source moment into a session.'); });
  $('workbenchButton').addEventListener('click', () => { setStatus(`Return point reopened · Workbench restores ${sourceMoment.song} · ${sourceMoment.section} · ${sourceMoment.time}.`); $('workbenchButton').textContent = 'Workbench return point reopened ✓'; });
  renderSource();
  render();
})(typeof window === 'undefined' ? globalThis : window);
