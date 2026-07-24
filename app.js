const universe = document.getElementById('universe');
const focusView = document.getElementById('correction');
const themeButton = document.getElementById('themeButton');
const homeAction = document.getElementById('homeAction');
const homeStatus = document.getElementById('homeStatus');
const homeNodeState = document.getElementById('homeNodeState');
const selectedLine = { index: 1, time: '00:43.8', word: 'tide', performedWord: 'tide' };
let selectedCandidate = 'tide';
let isPlaying = false;
let playTimer;

function renderHomeAffordance() {
  const moment = window.MembarMomentStore.read();
  if (!moment || !moment.sectionId) {
    homeStatus.textContent = 'Nothing kept yet · choose a source-backed moment to make this home useful.';
    homeNodeState.textContent = 'continuity test';
    homeAction.innerHTML = '<a class="home-start" href="source-video-workbench.html">Start with Source Workbench <span>→</span></a>';
    return;
  }
  const href = 'source-video-workbench.html?moment=' + encodeURIComponent(moment.sectionId);
  homeStatus.textContent = 'Ready to resume · the last source-backed place is waiting.';
  homeNodeState.textContent = 'ready to resume';
  homeAction.innerHTML = '<div class="home-resume"><div><span class="home-resume-label">Resume last kept moment</span><strong>' + moment.label + ' · ' + moment.time + ' · ' + moment.chord + '</strong><em>“' + moment.lyric + '”</em><small>' + moment.song + ' · ' + moment.artist + ' · source-backed</small></div><a class="home-resume-button" href="' + href + '">Resume in Workbench <span>→</span></a><a class="return-chip" href="' + href + '">return chip ↗</a></div>';
}

const candidates = {
  tide: { confidence: '0.62', note: 'performed wording' },
  time: { confidence: '0.24', note: 'phonetic match · context' },
  side: { confidence: '0.14', note: 'phonetic match' },
};

function showFocus() {
  universe.classList.add('is-hidden');
  focusView.classList.add('is-visible');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelectorAll('.map-node, .list-item').forEach((item) => item.classList.toggle('is-selected', item.dataset.node === 'correction'));
}

function showUniverse() {
  focusView.classList.remove('is-visible');
  universe.classList.remove('is-hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateLine(line) {
  document.querySelectorAll('.lyric-line').forEach((item) => item.classList.remove('is-active'));
  line.classList.add('is-active');
  selectedLine.index = Number(line.dataset.line);
  selectedLine.time = line.dataset.time;
  selectedLine.word = line.querySelector('strong')?.textContent.trim() || 'tide';
  selectedLine.performedWord = MembarCorrectionState.performedWordForLine(line);
  document.getElementById('sourceTime').textContent = selectedLine.time;
  document.getElementById('heardWord').textContent = selectedLine.word;
  selectedCandidate = selectedLine.word;
  const matching = candidates[selectedCandidate] || candidates.tide;
  document.querySelector('.source-confidence').textContent = matching.confidence;
  document.querySelectorAll('.candidate').forEach((item) => item.classList.toggle('is-selected', item.dataset.candidate === selectedCandidate));
  document.getElementById('savedNote').classList.remove('is-visible');
  const seconds = Number.parseFloat(selectedLine.time.split(':')[1]);
  const progress = Math.min(86, Math.max(16, (seconds / 60) * 100));
  document.getElementById('playhead').style.left = progress + '%';
}

function chooseCandidate(button) {
  selectedCandidate = button.dataset.candidate;
  document.querySelectorAll('.candidate').forEach((item) => item.classList.toggle('is-selected', item === button));
  const matching = candidates[selectedCandidate] || candidates.tide;
  document.querySelector('.source-confidence').textContent = matching.confidence;
  document.getElementById('savedNote').classList.remove('is-visible');
}

function applyCandidate(word) {
  const activeLine = document.querySelector('.lyric-line.is-active strong');
  if (!activeLine) return;
  const original = activeLine.textContent.trim();
  const nextWord = word || selectedCandidate;
  MembarCorrectionState.restorePerformedWord(activeLine.closest('.lyric-line'), nextWord);
  activeLine.dataset.original = original;
  activeLine.classList.toggle('uncertain', nextWord === 'tide');
  document.getElementById('heardWord').textContent = nextWord;
  document.getElementById('savedText').textContent = original + ' → ' + nextWord + ' · source ' + selectedLine.time + ' preserved';
  document.getElementById('savedNote').classList.add('is-visible');
}

function restorePerformed() {
  applyCandidate(selectedLine.performedWord);
  const activeLine = document.querySelector('.lyric-line.is-active strong');
  if (activeLine) activeLine.classList.add('uncertain');
}

function toggleSource() {
  const icon = document.getElementById('playIcon');
  const label = document.getElementById('playLabel');
  isPlaying = !isPlaying;
  icon.textContent = isPlaying ? '■' : '▶';
  label.textContent = isPlaying ? 'Stop source preview' : 'Play 4 sec source';
  document.getElementById('waveform').classList.toggle('is-playing', isPlaying);
  if (isPlaying) {
    playTimer = window.setTimeout(() => { if (isPlaying) toggleSource(); }, 4000);
  } else {
    window.clearTimeout(playTimer);
  }
  document.getElementById('playSource').setAttribute('aria-pressed', String(isPlaying));
}

document.querySelectorAll('[data-node]').forEach((item) => item.addEventListener('click', () => {
  if (item.dataset.node === 'correction') showFocus();
  if (item.dataset.node === 'source' || item.dataset.node === 'source-strip') window.location.href = 'source-video-workbench.html';
  if (item.dataset.node === 'home') document.getElementById('home').scrollIntoView({ behavior: 'smooth', block: 'start' });
}));
document.getElementById('focusNewButton').addEventListener('click', showFocus);
document.getElementById('backButton').addEventListener('click', showUniverse);
document.getElementById('closeLens').addEventListener('click', showUniverse);
document.querySelectorAll('.lyric-line').forEach((line) => line.addEventListener('click', () => updateLine(line)));
document.querySelectorAll('.candidate').forEach((button) => button.addEventListener('click', () => chooseCandidate(button)));
document.getElementById('applyButton').addEventListener('click', () => applyCandidate());
document.getElementById('restoreButton').addEventListener('click', restorePerformed);
document.getElementById('playSource').addEventListener('click', toggleSource);
document.getElementById('resetButton').addEventListener('click', () => window.location.reload());

document.getElementById('waveform').addEventListener('click', (event) => {
  const bounds = event.currentTarget.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
  const seconds = 42 + ratio * 4;
  selectedLine.time = '00:' + seconds.toFixed(1).padStart(4, '0');
  document.getElementById('sourceTime').textContent = selectedLine.time;
  document.getElementById('playhead').style.left = ratio * 100 + '%';
  document.getElementById('savedNote').classList.remove('is-visible');
});

document.getElementById('searchInput').addEventListener('input', (event) => {
  const query = event.target.value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll('.list-item').forEach((item) => {
    const match = item.textContent.toLowerCase().includes(query);
    item.hidden = !match;
    if (match) visible += 1;
  });
  document.getElementById('visibleCount').textContent = visible + ' visible';
});

document.querySelectorAll('.filter').forEach((filter) => filter.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('is-active', item === filter));
  const category = filter.dataset.filter;
  let visible = 0;
  document.querySelectorAll('.list-item').forEach((item) => {
    const match = category === 'all' || item.dataset.category.includes(category);
    item.hidden = !match;
    if (match) visible += 1;
  });
  document.querySelectorAll('.map-node').forEach((item) => { item.hidden = category !== 'all' && !item.dataset.category.includes(category); });
  document.getElementById('visibleCount').textContent = visible + ' visible';
}));

themeButton.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeButton.textContent = document.body.classList.contains('light') ? '◑' : '◐';
});

renderHomeAffordance();
