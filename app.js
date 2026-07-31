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

const recentNodes = [
  { id: 'correction', title: 'Timestamp-linked correction', hypothesis: 'A display-only correction inside the source strip can preserve trust in the performed word.', state: 'in-strip test', date: '27 Jul 2026', version: 'v02', last_touched: '27 Jul 2026', change_type: 'updated', category: 'live memory', edges: ['Song Workbench', 'Source Workbench', 'Phonetic Memory', 'Direct source scrub'], link: '#correction' },
  { id: 'live', title: 'Cue as a quiet section', hypothesis: 'One adaptive Cue can offer the next useful thing without hijacking a performance.', state: 'canonical', date: '12 Jul 2026', version: 'v03', last_touched: '12 Jul 2026', change_type: 'stable', category: 'live', edges: ['Live Session', 'Rhyme Compass', 'Structure Lens'], link: '#universe' },
  { id: 'galaxy', title: 'Galaxy at hundreds of ideas', hypothesis: 'Spatial scale should create discovery while every node still leads to a concrete action.', state: 'exploration', date: '17 Jul 2026', version: 'v02', last_touched: '17 Jul 2026', change_type: 'stable', category: 'memory', edges: ['Memory Archive', 'Home', 'Source Workbench'], link: '#universe' },
  { id: 'artboard', title: 'Six visual worlds', hypothesis: 'Materially different artboard mechanics reveal the right role for taste and source imagery.', state: 'direction set', date: '17 Jul 2026', version: 'v01', last_touched: '17 Jul 2026', change_type: 'stable', category: 'visual', edges: ['Artboard', 'Memory Archive'], link: 'artboard-constellation.html' },
  { id: 'home', title: 'One calm invitation', hypothesis: 'A single source-backed invitation can balance progress, discovery, and memory.', state: 'continuity test', date: '22 Jul 2026', version: 'v02', last_touched: '22 Jul 2026', change_type: 'updated', category: 'memory', edges: ['Source Workbench', 'Memory Archive', 'Live Session'], link: 'source-video-workbench.html' },
  { id: 'source', title: 'Source + lyric chord layout', hypothesis: 'A source frame, lyric, chord, and section should stay legible on one persistent surface.', state: 'cue bridge', date: '23 Jul 2026', version: 'v03', last_touched: '23 Jul 2026', change_type: 'updated', category: 'live', edges: ['Source Workbench', 'Live Session', 'Structure Lens'], link: 'source-video-workbench.html' },
  { id: 'source-strip', title: 'Direct source scrub', hypothesis: 'A synchronized source strip can shorten the path from seeing a moment to revisiting it exactly.', state: 'exact retrieval', date: '24 Jul 2026', version: 'v04', last_touched: '24 Jul 2026', change_type: 'new', category: 'live', edges: ['Source Workbench', 'Memory Archive', 'Live Session'], link: 'source-video-workbench.html' },
  { id: 'source-layout', title: 'Evidence deck', hypothesis: 'A split source frame and reading lane can make whole-take section comparison faster.', state: 'section compare', date: '29 Jul 2026', version: 'v01', last_touched: '29 Jul 2026', change_type: 'new', category: 'live', edges: ['Source Workbench', 'Direct source scrub', 'Structure Lens'], link: 'source-layout.html' },
  { id: 'constellation', title: 'Audio-visual constellation', hypothesis: 'Dragging a source moment into orbit and pinning one synthetic reading makes visual direction feel like a reversible song-making action rather than a gallery.', state: 'orbit study', date: '31 Jul 2026', version: 'v01', last_touched: '31 Jul 2026', change_type: 'new', category: 'visual', edges: ['Six visual worlds', 'Memory Archive', 'Direct source scrub'], link: 'artboard-constellation.html' },
  { id: 'workbench', title: 'Song Workbench', hypothesis: 'Every performed word should remain editable without losing source evidence.', state: 'canonical flow', date: '10 Jul 2026', version: 'v03', last_touched: '10 Jul 2026', change_type: 'stable', category: 'live', edges: ['Live Session', 'Memory Archive', 'Timestamp-linked correction'], link: '#correction' },
  { id: 'archive', title: 'Memory Archive', hypothesis: 'Automatic indexing should resurface strong fragments without asking the artist to maintain a library.', state: 'source-backed', date: '14 Jul 2026', version: 'v02', last_touched: '14 Jul 2026', change_type: 'stable', category: 'memory', edges: ['Home', 'Galaxy at hundreds of ideas', 'Source Workbench'], link: '#universe' },
  { id: 'phonetics', title: 'Phonetic Memory', hypothesis: 'Remembered pronunciation evidence can improve future correction without rewriting past takes.', state: 'evidence layer', date: '15 Jul 2026', version: 'v01', last_touched: '15 Jul 2026', change_type: 'needs-review', category: 'live', edges: ['Timestamp-linked correction', 'Memory Archive'], link: '#correction' },
  { id: 'structure', title: 'Structure Lens', hypothesis: 'Sections should emerge from performed evidence rather than being imposed before a take.', state: 'section map', date: '16 Jul 2026', version: 'v01', last_touched: '16 Jul 2026', change_type: 'needs-review', category: 'live', edges: ['Live Session', 'Source Workbench', 'Cue as a quiet section'], link: '#universe' },
  { id: 'rhymes', title: 'Rhyme Compass', hypothesis: 'A single timely word offer is more useful than a wall of generated lines.', state: 'exploration', date: '11 Jul 2026', version: 'v02', last_touched: '11 Jul 2026', change_type: 'stable', category: 'visual', edges: ['Cue as a quiet section', 'Live Session'], link: '#universe' },
];

const generatedNodes = Array.from({ length: 88 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0');
  const clusters = ['archive', 'live', 'memory', 'visual'];
  const cluster = clusters[index % clusters.length];
  const changeType = 'stable';
  return {
    id: `archive-${number}`,
    title: `${cluster === 'live' ? 'Take' : cluster === 'visual' ? 'Texture' : 'Recovered'} thread ${number}`,
    hypothesis: `Synthetic ${cluster} thread ${number} waits for a source-backed relationship to become useful.`,
    state: changeType === 'needs-review' ? 'needs a decision' : changeType === 'new' ? 'new fragment' : 'quiet archive',
    date: '2026', version: `v${(index % 3) + 1}`, last_touched: `${String((index % 28) + 1).padStart(2, '0')} Jul 2026`, change_type: changeType, category: cluster,
    edges: [recentNodes[index % recentNodes.length].title, recentNodes[(index + 3) % recentNodes.length].title], link: '#universe',
  };
});

const universeData = [...recentNodes, ...generatedNodes];
const nodeById = new Map(universeData.map((node) => [node.id, node]));
let activeFilter = 'all';
let activeQuery = '';
let selectedNodeId = 'source-strip';
let mapZoom = 100;

function matchingNodes() {
  return universeData.filter((node) => {
    const queryMatch = !activeQuery || [node.title, node.hypothesis, node.category, node.state].join(' ').toLowerCase().includes(activeQuery);
    const filterMatch = activeFilter === 'all' || node.change_type === activeFilter || node.category.includes(activeFilter);
    return queryMatch && filterMatch;
  });
}

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
  if (remembered && nodeById.has(remembered)) {
    scaleState.innerHTML = `<button class="focus-revisit" id="resumeFocus" type="button">Return to ${nodeById.get(remembered).title} ↗</button><span class="scale-mode">${label}</span>`;
    document.getElementById('resumeFocus').addEventListener('click', () => renderFocus(remembered));
  } else scaleState.textContent = label;
}

function updateUniverse() {
  const matches = matchingNodes();
  const ids = new Set(matches.map((node) => node.id));
  document.querySelectorAll('.list-item[data-node]').forEach((item) => { item.hidden = !ids.has(item.dataset.node); });
  document.querySelectorAll('.map-node[data-node]').forEach((item) => { item.hidden = !ids.has(item.dataset.node); });
  renderDynamicResults(matches);
  document.getElementById('visibleCount').textContent = `${matches.length} indexed · ${Math.min(matches.length, 14)} mapped`;
  document.querySelectorAll('.filter').forEach((filter) => { const count = universeData.filter((node) => filter.dataset.filter === 'all' || node.change_type === filter.dataset.filter || node.category.includes(filter.dataset.filter)).length; const countLabel = filter.querySelector('span'); if (countLabel) countLabel.textContent = count; });
  renderScaleState(activeQuery ? `Search · ${matches.length} matches` : activeFilter === 'all' ? 'Recent thread' : `${activeFilter.replace('-', ' ')} only`);
}

function saveFocus() {
  try { localStorage.setItem(focusMemoryKey, selectedNodeId); } catch (_) { /* private browsing */ }
  renderScaleState('Focus remembered');
  document.getElementById('drawerStatusMessage').textContent = 'Focus remembered · return from the scale strip any time.';
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
