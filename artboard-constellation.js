(function mountConstellation(global) {
  if (!global.document || !global.MembarConstellationState) return;
  const S = global.MembarConstellationState;
  const $ = (id) => global.document.getElementById(id);
  const body = global.document.body;
  let state = S.restore(S.read(global.localStorage)) || S.initialState();
  let dragging = false;
  let dragMoved = false;
  let ghost = null;

  function overOrbit(event) {
    const bounds = $('orbitZone').getBoundingClientRect();
    return event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
  }
  function moveGhost(event) {
    ghost.style.transform = 'translate(' + event.clientX + 'px,' + event.clientY + 'px) translate(-50%,-58%) rotate(-2deg)';
  }
  function startDrag(event) {
    if (state.placed || (event.pointerType === 'mouse' && event.button !== 0)) return;
    dragging = true;
    dragMoved = false;
    try { $('momentTile').setPointerCapture(event.pointerId); } catch (_) { /* older browsers */ }
  }
  function moveDrag(event) {
    if (!dragging) return;
    if (!dragMoved) {
      dragMoved = true;
      ghost = $('momentTile').cloneNode(true);
      ghost.classList.add('drag-ghost');
      ghost.removeAttribute('id');
      ghost.setAttribute('aria-hidden', 'true');
      body.appendChild(ghost);
      body.classList.add('is-dragging');
    }
    moveGhost(event);
    $('orbitZone').classList.toggle('is-over', overOrbit(event));
  }
  function endDrag(event) {
    if (!dragging) return;
    dragging = false;
    const dropped = dragMoved && overOrbit(event);
    if (ghost) { ghost.remove(); ghost = null; }
    body.classList.remove('is-dragging');
    $('orbitZone').classList.remove('is-over');
    if (dropped) state = S.place(state);
    else if (dragMoved) $('trayHint').textContent = 'Missed the orbit — drag again, or press the tile to place.';
    render();
  }
  function placeFromTray() {
    if (state.placed) return;
    state = S.place(state);
    render();
  }
  function chooseTreatment(id) {
    state = S.selectTreatment(state, id);
    render();
  }
  function pinCurrent() {
    state = S.pin(state);
    const record = S.pinRecord(state);
    if (record) S.write(global.localStorage, record);
    render();
  }
  function releasePin() {
    state = S.release(state);
    S.clear(global.localStorage);
    render();
  }

  function render() {
    const sky = global.document.querySelector('.sky');
    const tile = $('momentTile');
    const placed = $('placedTile');
    const panel = $('treatmentPanel');
    const card = $('pinnedCard');
    sky.classList.toggle('is-placed', state.placed);
    sky.classList.toggle('is-pinned', state.pinned);
    tile.hidden = state.placed;
    $('trayHint').hidden = state.placed;
    $('skyKicker').textContent = state.pinned ? 'CONSTELLATION PINNED' : state.placed ? 'MOMENT IN ORBIT' : 'EMPTY ORBIT';
    placed.hidden = !state.placed;
    placed.dataset.treatment = state.treatment || '';
    $('pinMark').hidden = !state.pinned;
    $('threadLabel').textContent = state.pinned ? 'thread pinned' : state.placed ? 'thread active' : 'threads idle';
    panel.hidden = !state.placed;
    if (state.placed) {
      global.document.querySelectorAll('.treatment-card').forEach((button) => {
        const selected = button.dataset.treatment === state.treatment;
        button.classList.toggle('is-selected', selected);
        button.classList.toggle('is-pinned', selected && state.pinned);
        button.setAttribute('aria-pressed', String(selected));
      });
      const treatment = S.treatmentFor(state);
      $('treatmentStatus').textContent = state.pinned && treatment
        ? treatment.label + ' pinned · restores on reload.'
        : treatment ? 'Reading: ' + treatment.label + ' · ' + treatment.desc : 'Choose a reading to preview it.';
      const pinButton = $('pinButton');
      pinButton.disabled = !state.treatment;
      pinButton.textContent = state.pinned ? '✓ Pinned' : 'Pin this reading';
      pinButton.classList.toggle('is-pinned', state.pinned);
    }
    const record = state.pinned ? S.pinRecord(state) : null;
    card.hidden = !record;
    if (record) {
      $('pinnedTitle').textContent = record.momentLabel + ' · ' + record.time + ' · ' + record.chord;
      $('pinnedTreatment').textContent = record.treatmentLabel + ' · ' + record.lyric;
    }
  }

  $('momentTile').addEventListener('pointerdown', startDrag);
  $('momentTile').addEventListener('pointermove', moveDrag);
  $('momentTile').addEventListener('pointerup', endDrag);
  $('momentTile').addEventListener('pointercancel', endDrag);
  $('momentTile').addEventListener('click', () => { if (!dragMoved) placeFromTray(); });
  global.document.querySelectorAll('.treatment-card').forEach((button) => button.addEventListener('click', () => chooseTreatment(button.dataset.treatment)));
  $('pinButton').addEventListener('click', pinCurrent);
  $('releaseButton').addEventListener('click', releasePin);
  render();
})(typeof window === 'undefined' ? globalThis : window);
