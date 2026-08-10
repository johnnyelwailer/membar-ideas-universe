const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'moment-store.js'), 'utf8');
const values = new Map();
const context = { window: { localStorage: {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: key => values.delete(key),
} } };
vm.runInNewContext(source, context);
const store = context.window.MembarMomentStore;
const moment = { sectionId: 'chorus', label: 'Chorus', time: '00:54.4', chord: 'G', lyric: 'We are the weather in the room' };

assert.equal(store.read(), null);
assert.equal(JSON.stringify(store.write(moment)), JSON.stringify(moment));
assert.equal(JSON.stringify(store.read()), JSON.stringify(moment));
assert.equal(values.get(store.STORAGE_KEY), JSON.stringify(moment));
store.clear();
assert.equal(store.read(), null);
