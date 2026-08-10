const universe = document.getElementById('universe');
const focusView = document.getElementById('correction');
const themeButton = document.getElementById('themeButton');
const homeAction = document.getElementById('homeAction');
const homeStatus = document.getElementById('homeStatus');
const homeNodeState = document.getElementById('homeNodeState');
const mapCanvas = document.getElementById('mapCanvas');
const focusDrawer = document.getElementById('focusDrawer');
const scaleState = document.getElementById('scaleState');
const focusMemoryKey = 'membar:last-universe-focus';

const recentNodes = MembarUniverseData.recentNodes;
const generatedNodes = MembarUniverseData.generatedNodes;
const universeData = MembarUniverseData.universe;
const nodeById = new Map(universeData.map((node) => [node.id, node]));
let activeFilter = 'all';
let activeQuery = '';
let selectedNodeId = 'source-strip';
let mapZoom = 100;

const rail = window.MembarRecencyRailState;
const railStorage = (() => {
  try { return window.localStorage; } catch (_) { return null; }
})();
const restoredRailState = rail.restore(rail.read(railStorage));
let railState = restoredRailState || rail.initialState();
if (restoredRailState?.nodeId && nodeById.has(restoredRailState.nodeId)) selectedNodeId = restoredRailState.nodeId;
let lastScaleLabel = 'Rail · Full universe';
let showingDensity = false;
const railTrack = document.getElementById('railTrack');
const railHandle = document.getElementById('railHandle');
const railClusters = [];

function nodeWindowId(node) {
  return node.day ? rail.windowForDay(node.day) : null;
}

function inRailScope(node) {
  const windowId = nodeWindowId(node);
  if (!windowId) return true;
  return rail.inScope(rail.windowIndex(windowId), railState.horizon);
}

function matchingNodes() {
  return universeData.filter((node) => {
    const queryMatch = !activeQuery || [node.title, node.hypothesis, node.category, node.state].join(' ').toLowerCase().includes(activeQuery);
    const filterMatch = activeFilter === 'all' || node.change_type === activeFilter || node.category.includes(activeFilter);
    return queryMatch && filterMatch && inRailScope(node);
  });
}

function buildRail() {
  rail.WINDOWS.forEach((windowEntry) => {
    const members = universeData.filter((node) => nodeWindowId(node) === windowEntry.id);
    const cluster = document.createElement('button');
    cluster.type = 'button';
    cluster.className = 'rail-cluster';
    cluster.dataset.window = windowEntry.id;
    cluster.setAttribute('aria-label', `${windowEntry.label} · ${windowEntry.range} 2026 · ${members.length} ideas`);
    cluster.innerHTML = `<span class="cluster-meta"><span>${windowEntry.short}</span><span class="cluster-count">${members.length}</span></span><span class="cluster-ticks" aria-hidden="true">${members.map((node) => `<i class="${node.change_type === 'stable' ? 'tick-stable' : 'tick-live'}" title="${node.title} · ${node.state}"></i>`).join('')}</span><span class="cluster-label">${windowEntry.label}<small>${windowEntry.range} 2026</small></span>`;
    cluster.addEventListener('click', () => setHorizon(rail.windowIndex(cluster.dataset.window)));
    railTrack.appendChild(cluster);
    railClusters.push(cluster);
  });
}

function setHorizon(index) {
  const clamped = Math.max(0, Math.min(rail.WINDOWS.length - 1, index));
  railState = rail.scrubTo(railState, rail.WINDOW_IDS[clamped]);
  updateUniverse();
}

function railHorizonLabel() {
  const windowEntry = rail.windowForIndex(railState.horizon);
  return railState.horizon >= rail.WINDOWS.length - 1 ? 'Full universe' : `${windowEntry.label} + newer`;
}

function refreshRailVisuals() {
  if (!railClusters.length) return;
  railClusters.forEach((cluster, index) => {
    cluster.classList.toggle('is-inscope', rail.inScope(index, railState.horizon));
    cluster.classList.toggle('is-active', index === railState.horizon);
    cluster.setAttribute('aria-pressed', String(index === railState.horizon));
  });
  const activeCluster = railClusters[railState.horizon];
  if (activeCluster) railHandle.style.left = `${activeCluster.offsetLeft + activeCluster.offsetWidth / 2 - 6}px`;
  const windowEntry = rail.windowForIndex(railState.horizon);
  const total = universeData.filter((node) => inRailScope(node)).length;
  const full = railState.horizon >= rail.WINDOWS.length - 1;
  document.getElementById('railState').textContent = full ? `Full universe · ${total} ideas · 1–31 Jul 2026` : `${windowEntry.label} · ${total} ideas · ${windowEntry.from}–31 Jul 2026`;
  const chip = document.getElementById('railPinChip');
  chip.hidden = !railState.pinned;
  if (railState.pinned) chip.textContent = `● pinned · ${(nodeById.get(railState.nodeId) || {}).title || 'focus'}`;
}

function clusterIndexAt(clientX) {
  let best = 0;
  let bestDistance = Infinity;
  railClusters.forEach((cluster, index) => {
    const rect = cluster.getBoundingClientRect();
    const distance = Math.abs(clientX - (rect.left + rect.width / 2));
    if (distance < bestDistance) { bestDistance = distance; best = index; }
  });
  return best;
}

let isScrubbingRail = false;
function setHorizonFromPointer(clientX) {
  if (!Number.isFinite(clientX)) return;
  setHorizon(clusterIndexAt(clientX));
}

railTrack.addEventListener('pointerdown', (event) => {
  isScrubbingRail = true;
  railTrack.setPointerCapture?.(event.pointerId);
  setHorizonFromPointer(event.clientX);
});
railTrack.addEventListener('pointermove', (event) => {
  if (isScrubbingRail) setHorizonFromPointer(event.clientX);
});
['pointerup', 'pointercancel', 'pointerleave'].forEach((eventName) => {
  railTrack.addEventListener(eventName, () => { isScrubbingRail = false; });
});
railTrack.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); setHorizon(railState.horizon - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); setHorizon(railState.horizon + 1); }
  if (event.key === 'Home') { event.preventDefault(); setHorizon(0); }
  if (event.key === 'End') { event.preventDefault(); setHorizon(rail.WINDOWS.length - 1); }
});

function renderHomeAffordance() {
  const moment = window.MembarMomentStore?.read();
  if (!moment || !moment.sectionId) {
    homeStatus.textContent = 'Nothing kept yet · choose a source-backed moment to make this home useful.';
    homeNodeState.textContent = 'continuity test';
    homeAction.innerHTML = '<a class="home-start" href="source-layout.html">Try Evidence Deck <span>→</span></a>';
    return;
  }
  const href = 'source-layout.html?at=' + encodeURIComponent(moment.seconds || 47.3);
  homeStatus.textContent = 'Ready to resume · the last source-backed place is waiting.';
  homeNodeState.textContent = 'ready to resume';
  homeAction.innerHTML = '<div class="home-resume"><div><span class="home-resume-label">Resume last kept moment</span><strong>' + moment.label + ' · ' + moment.time + ' · ' + moment.chord + '</strong><em>“' + moment.lyric + '”</em><small>' + moment.song + ' · ' + moment.artist + ' · source-backed</small></div><a class="home-resume-button" href="' + href + '">Resume in Workbench <span>→</span></a><a class="return-chip" href="' + href + '">return chip ↗</a></div>';
}

function renderEdges(node) {
  document.getElementById('drawerEdges').innerHTML = node.edges.map((edge) => `<span class="edge-chip">→ ${edge}</span>`).join('');
}

function renderFocus(nodeId) {
  const node = nodeById.get(nodeId) || nodeById.get('source-strip');
  selectedNodeId = node.id;
  railState = rail.selectNode(railState, node.id);
  refreshRailVisuals();
  document.querySelectorAll('.map-node, .list-item').forEach((item) => item.classList.toggle('is-selected', item.dataset.node === node.id));
  document.getElementById('drawerChange').textContent = node.change_type.replace('-', ' ').toUpperCase();
  document.getElementById('drawerTitle').textContent = node.title;
  document.getElementById('drawerHypothesis').textContent = node.hypothesis;
  document.getElementById('drawerStatus').textContent = node.state;
  document.getElementById('drawerVersion').textContent = node.version;
  document.getElementById('drawerTouched').textContent = node.last_touched;
  document.getElementById('drawerOpen').href = node.link;
  document.getElementById('drawerOpen').innerHTML = node.link === '#universe' ? 'Keep exploring <span>↗</span>' : 'Open experiment <span>↗</span>';
  renderEdges(node);
  focusDrawer.hidden = false;
  focusDrawer.classList.add('is-open');
  document.getElementById('drawerStatusMessage').textContent = `${node.title} focused · ${node.edges.length} relationships visible.`;
  if (node.id === 'correction') {
    universe.classList.add('is-hidden');
    focusView.classList.add('is-visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    focusDrawer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function closeFocus() {
  focusDrawer.hidden = true;
  focusDrawer.classList.remove('is-open');
  focusView.classList.remove('is-visible');
  universe.classList.remove('is-hidden');
}

function renderDynamicResults(nodes) {
  let container = document.getElementById('generatedResults');
  if (!container) {
    container = document.createElement('div');
    container.id = 'generatedResults';
    container.className = 'generated-results';
    document.querySelector('.ideas-list').insertBefore(container, document.querySelector('.list-note'));
  }
  const existingIds = new Set(recentNodes.map((node) => node.id));
  const results = nodes.filter((node) => !existingIds.has(node.id)).slice(0, 8);
  container.innerHTML = results.map((node) => `<button class="list-item generated-item" type="button" data-node="${node.id}" data-category="${node.category}"><span class="list-swatch" style="--accent:${node.change_type === 'needs-review' ? '#e0a27f' : '#7da9a1'}"></span><span><strong>${node.title} <em class="list-badge">${node.change_type.replace('-', ' ').toUpperCase()}</em></strong><small>${node.category} · ${node.state}</small></span><span class="list-arrow">↗</span></button>`).join('');
  container.querySelectorAll('.list-item').forEach((item) => item.addEventListener('click', () => renderFocus(item.dataset.node)));
}

function renderScaleState(label) {
  let remembered = null;
  try { remembered = localStorage.getItem(focusMemoryKey); } catch (_) { /* private browsing */ }
  remembered = remembered || (railState.pinned ? railState.nodeId : null);
  if (remembered && nodeById.has(remembered)) {
    scaleState.innerHTML = `<button class="focus-revisit" id="resumeFocus" type="button">Return to ${nodeById.get(remembered).title} ↗</button><span class="scale-mode">${label}</span>`;
    document.getElementById('resumeFocus').addEventListener('click', () => renderFocus(remembered));
  } else scaleState.textContent = label;
}

function updateUniverse() {
  const matches = matchingNodes();
  const ids = new Set(matches.map((node) => node.id));
  const recentIds = new Set(recentNodes.map((node) => node.id));
  const mappedCount = matches.filter((node) => recentIds.has(node.id)).length;
  document.querySelectorAll('.list-item[data-node]').forEach((item) => { item.hidden = !ids.has(item.dataset.node); });
  document.querySelectorAll('.map-node[data-node]').forEach((item) => { item.hidden = !ids.has(item.dataset.node); });
  renderDynamicResults(matches);
  document.getElementById('visibleCount').textContent = `${matches.length} indexed · ${mappedCount} mapped`;
  document.getElementById('universeCount').textContent = universeData.length;
  document.getElementById('scaleLabel').textContent = `${mappedCount} on the map`;
  document.getElementById('archiveCount').textContent = `${Math.max(0, matches.length - mappedCount)} quieter archive nodes`;
  document.querySelectorAll('.filter').forEach((filter) => { const count = universeData.filter((node) => filter.dataset.filter === 'all' || node.change_type === filter.dataset.filter || node.category.includes(filter.dataset.filter)).length; const countLabel = filter.querySelector('span'); if (countLabel) countLabel.textContent = count; });
  lastScaleLabel = activeQuery ? `Search · ${matches.length} matches` : activeFilter === 'all' ? railHorizonLabel() : `${activeFilter.replace('-', ' ')} only`;
  renderScaleState(lastScaleLabel);
  refreshRailVisuals();
}

function saveFocus() {
  try { localStorage.setItem(focusMemoryKey, selectedNodeId); } catch (_) { /* private browsing */ }
  railState = rail.pin(railState, selectedNodeId);
  rail.write(railStorage, rail.focusRecord(railState, '03 Aug 2026'));
  renderScaleState('Focus pinned');
  refreshRailVisuals();
  document.getElementById('rememberFocus').textContent = 'Pinned focus';
  document.getElementById('drawerStatusMessage').textContent = 'Focus pinned · return from the scale strip or rail chip any time.';
}

document.querySelectorAll('[data-node]').forEach((item) => item.addEventListener('click', () => renderFocus(item.dataset.node)));
document.getElementById('focusNewButton').addEventListener('click', () => renderFocus('constellation'));
document.getElementById('recentButton').addEventListener('click', () => renderFocus('constellation'));
document.getElementById('closeDrawer').addEventListener('click', closeFocus);
document.getElementById('rememberFocus').addEventListener('click', saveFocus);
document.getElementById('searchInput').addEventListener('input', (event) => { activeQuery = event.target.value.trim().toLowerCase(); updateUniverse(); });
document.querySelectorAll('.filter').forEach((filter) => filter.addEventListener('click', () => {
  activeFilter = filter.dataset.filter;
  document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('is-active', item === filter));
  updateUniverse();
}));
document.getElementById('densityButton').addEventListener('click', (event) => {
  const dense = mapCanvas.classList.toggle('is-dense');
  event.currentTarget.setAttribute('aria-pressed', String(dense));
  event.currentTarget.textContent = dense ? 'Show recent' : 'Show density';
  document.getElementById('scaleLabel').textContent = dense ? '100 in the field' : '12 on the map';
  document.getElementById('scaleState').textContent = dense ? 'Full density' : 'Recent thread';
});
document.getElementById('zoomOut').addEventListener('click', () => { mapZoom = Math.max(85, mapZoom - 15); mapCanvas.style.transform = `scale(${mapZoom / 100})`; mapCanvas.style.transformOrigin = 'top center'; document.getElementById('zoomLabel').textContent = `${mapZoom}%`; });
document.getElementById('zoomIn').addEventListener('click', () => { mapZoom = Math.min(125, mapZoom + 15); mapCanvas.style.transform = `scale(${mapZoom / 100})`; mapCanvas.style.transformOrigin = 'top center'; document.getElementById('zoomLabel').textContent = `${mapZoom}%`; });
themeButton.addEventListener('click', () => { document.body.classList.toggle('light'); themeButton.textContent = document.body.classList.contains('light') ? '◑' : '◐'; });

buildRail();

const selectedLine = { index: 1, time: '00:43.8', word: 'tide', performedWord: 'tide' };
let selectedCandidate = 'tide';
let isPlaying = false;
let playTimer;
const candidates = { tide: { confidence: '0.62' }, time: { confidence: '0.24' }, side: { confidence: '0.14' } };

function showUniverse() { focusView.classList.remove('is-visible'); universe.classList.remove('is-hidden'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function updateLine(line) {
  document.querySelectorAll('.lyric-line').forEach((item) => item.classList.remove('is-active'));
  line.classList.add('is-active'); selectedLine.index = Number(line.dataset.line); selectedLine.time = line.dataset.time; selectedLine.word = line.querySelector('strong')?.textContent.trim() || 'tide'; selectedLine.performedWord = MembarCorrectionState.performedWordForLine(line);
  document.getElementById('sourceTime').textContent = selectedLine.time; document.getElementById('heardWord').textContent = selectedLine.word; selectedCandidate = selectedLine.word;
  document.querySelector('.source-confidence').textContent = (candidates[selectedCandidate] || candidates.tide).confidence;
  document.querySelectorAll('.candidate').forEach((item) => item.classList.toggle('is-selected', item.dataset.candidate === selectedCandidate)); document.getElementById('savedNote').classList.remove('is-visible');
  document.getElementById('playhead').style.left = Math.min(86, Math.max(16, (Number.parseFloat(selectedLine.time.split(':')[1]) / 60) * 100)) + '%';
}
function chooseCandidate(button) { selectedCandidate = button.dataset.candidate; document.querySelectorAll('.candidate').forEach((item) => item.classList.toggle('is-selected', item === button)); document.querySelector('.source-confidence').textContent = (candidates[selectedCandidate] || candidates.tide).confidence; document.getElementById('savedNote').classList.remove('is-visible'); }
function applyCandidate(word) { const activeLine = document.querySelector('.lyric-line.is-active strong'); if (!activeLine) return; const original = activeLine.textContent.trim(); const nextWord = word || selectedCandidate; MembarCorrectionState.restorePerformedWord(activeLine.closest('.lyric-line'), nextWord); activeLine.dataset.original = original; activeLine.classList.toggle('uncertain', nextWord === 'tide'); document.getElementById('heardWord').textContent = nextWord; document.getElementById('savedText').textContent = original + ' → ' + nextWord + ' · source ' + selectedLine.time + ' preserved'; document.getElementById('savedNote').classList.add('is-visible'); }
function restorePerformed() { applyCandidate(selectedLine.performedWord); const activeLine = document.querySelector('.lyric-line.is-active strong'); if (activeLine) activeLine.classList.add('uncertain'); }
function toggleSource() { const icon = document.getElementById('playIcon'); const label = document.getElementById('playLabel'); isPlaying = !isPlaying; icon.textContent = isPlaying ? '■' : '▶'; label.textContent = isPlaying ? 'Stop source preview' : 'Play 4 sec source'; document.getElementById('waveform').classList.toggle('is-playing', isPlaying); if (isPlaying) playTimer = window.setTimeout(() => { if (isPlaying) toggleSource(); }, 4000); else window.clearTimeout(playTimer); document.getElementById('playSource').setAttribute('aria-pressed', String(isPlaying)); }

document.getElementById('backButton').addEventListener('click', showUniverse);
document.getElementById('closeLens').addEventListener('click', showUniverse);
document.querySelectorAll('.lyric-line').forEach((line) => line.addEventListener('click', () => updateLine(line)));
document.querySelectorAll('.candidate').forEach((button) => button.addEventListener('click', () => chooseCandidate(button)));
document.getElementById('applyButton').addEventListener('click', () => applyCandidate()); document.getElementById('restoreButton').addEventListener('click', restorePerformed); document.getElementById('playSource').addEventListener('click', toggleSource); document.getElementById('resetButton').addEventListener('click', () => window.location.reload());
document.getElementById('waveform').addEventListener('click', (event) => { const bounds = event.currentTarget.getBoundingClientRect(); const ratio = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width)); selectedLine.time = '00:' + (42 + ratio * 4).toFixed(1).padStart(4, '0'); document.getElementById('sourceTime').textContent = selectedLine.time; document.getElementById('playhead').style.left = ratio * 100 + '%'; document.getElementById('savedNote').classList.remove('is-visible'); });

renderHomeAffordance();
updateUniverse();
