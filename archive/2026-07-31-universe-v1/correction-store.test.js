const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'correction-store.js'), 'utf8');
const values = new Map();
const context = { window: { localStorage: { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) } } };
vm.runInNewContext(source, context);
const store = context.window.MembarCorrectionStore;

assert.equal(JSON.stringify(store.read()), '[]');
store.write({ id: 'light', display: 'night', status: 'corrected' });
assert.equal(store.read()[0].display, 'night');
store.write({ id: 'light', display: 'light', status: 'restored' });
assert.equal(store.read()[0].status, 'restored');
store.clear();
assert.equal(JSON.stringify(store.read()), '[]');
