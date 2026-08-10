const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'cue-store.js'), 'utf8');
const values = new Map();
const context = { window: { localStorage: {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: key => values.delete(key),
} } };
vm.runInNewContext(source, context);
const store = context.window.MembarCueStore;
const cue = { id: 'pre', label: 'Pre-chorus', time: '00:42.0', chord: 'C', lyric: 'If I leave, leave a light on', song: 'North Window', artist: 'Jo Sable', source: 'north-window_take-02.mp4', kind: 'armed' };
const prior = { id: 'verse', label: 'Verse 1', time: '00:18.6', chord: 'F', lyric: 'I kept the kettle singing low', song: 'North Window', artist: 'Jo Sable', source: 'north-window_take-02.mp4', kind: 'fixture' };

assert.equal(store.STORAGE_KEY, 'membar:last-live-cue');
assert.equal(JSON.stringify(store.read()), '[]');
assert.equal(JSON.stringify(store.write(cue)), JSON.stringify([cue]));
assert.equal(JSON.stringify(store.read()), JSON.stringify([cue]));
assert.equal(values.get(store.STORAGE_KEY), JSON.stringify([cue]));

assert.equal(JSON.stringify(store.write(prior)), JSON.stringify([prior, cue]));
assert.equal(JSON.stringify(store.write({ ...cue, kind: 'entered' })), JSON.stringify([{ ...cue, kind: 'entered' }, prior]));
assert.equal(values.get(store.STORAGE_KEY), JSON.stringify([{ ...cue, kind: 'entered' }, prior]));

const overflow = Array.from({ length: store.MAX_ENTRIES + 2 }, (_, index) => ({ ...cue, id: 'cue-' + index }));
for (const entry of overflow) store.write(entry);
const capped = store.read();
assert.equal(capped.length, store.MAX_ENTRIES);
assert.equal(capped[0].id, 'cue-' + (store.MAX_ENTRIES + 1));

store.clear();
assert.equal(JSON.stringify(store.read()), '[]');

const corrupt = new Map([[store.STORAGE_KEY, '{not json']]);
const corruptContext = { window: { localStorage: {
  getItem: key => corrupt.get(key) ?? null,
  setItem: (key, value) => corrupt.set(key, value),
  removeItem: key => corrupt.delete(key),
} } };
vm.runInNewContext(source, corruptContext);
assert.equal(JSON.stringify(corruptContext.window.MembarCueStore.read()), '[]');
assert.equal(JSON.stringify(corruptContext.window.MembarCueStore.write(cue)), JSON.stringify([cue]));
