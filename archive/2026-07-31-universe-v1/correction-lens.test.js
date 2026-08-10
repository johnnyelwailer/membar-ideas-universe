const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'correction-lens.js'), 'utf8');
const context = { window: {} };
vm.runInNewContext(source, context);
const lens = context.window.MembarCorrectionLens;
const words = [{ id: 'light', at: 47.3, window: 2, word: 'light' }, { id: 'weather', at: 58.2, window: 2, word: 'weather' }];

assert.equal(lens.activeWordAt(words, 47.3).id, 'light');
assert.equal(lens.activeWordAt(words, 52), null);
assert.equal(lens.displayFor(words[0], { status: 'corrected', display: 'night' }), 'night');
assert.equal(lens.displayFor(words[0], { status: 'restored', display: 'night' }), 'light');
assert.equal(JSON.stringify(lens.buildEntry(words[0], { word: 'night', confidence: 0.27 }, { time: '00:47.3', label: 'Pre-chorus', chord: 'C', song: 'North Window', artist: 'Jo Sable', source: 'north-window_take-02.mp4' })), JSON.stringify({
  id: 'light', performed: 'light', display: 'night', confidence: 0.27, seconds: 47.3, time: '00:47.3', section: 'Pre-chorus', chord: 'C', song: 'North Window', artist: 'Jo Sable', source: 'north-window_take-02.mp4', status: 'corrected',
}));
