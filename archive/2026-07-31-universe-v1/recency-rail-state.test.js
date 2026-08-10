const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'recency-rail-state.js'), 'utf8');
const values = new Map();
const storage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: (key) => values.delete(key),
};
const context = { globalThis: {}, window: {} };
context.globalThis = context.window;
vm.runInNewContext(source, context);
const rail = context.window.MembarRecencyRailState;
// state objects come from the vm realm, so compare JSON snapshots, not prototypes
const snap = (value) => JSON.stringify(value);

// versioned browser-local key and the four recency windows, newest first
assert.equal(rail.STORAGE_KEY, 'membar:recency-focus:v01');
assert.equal(rail.WINDOWS.length, 4);
assert.equal(snap(rail.WINDOW_IDS), snap(['w7', 'w14', 'w30', 'deep']));

// day → window boundaries cover every July day exactly once
assert.equal(rail.windowForDay(31), 'w7');
assert.equal(rail.windowForDay(25), 'w7');
assert.equal(rail.windowForDay(24), 'w14');
assert.equal(rail.windowForDay(18), 'w14');
assert.equal(rail.windowForDay(17), 'w30');
assert.equal(rail.windowForDay(11), 'w30');
assert.equal(rail.windowForDay(10), 'deep');
assert.equal(rail.windowForDay(1), 'deep');
assert.equal(rail.windowForDay(0), null);
assert.equal(rail.windowForDay('nope'), null);

// initial state opens on the full universe, unpinned
assert.equal(snap(rail.initialState()), snap({ horizon: 3, nodeId: null, pinned: false }));

// scrubbing validates window ids and keeps focus state intact
let state = rail.scrubTo(rail.initialState(), 'w14');
assert.equal(state.horizon, 1);
assert.equal(snap(rail.scrubTo(state, 'bogus')), snap(state));
assert.equal(rail.inScope(0, state.horizon), true);
assert.equal(rail.inScope(2, state.horizon), false);

// node selection is recorded without implying a pin
state = rail.selectNode(state, 'constellation');
assert.equal(state.nodeId, 'constellation');
assert.equal(state.pinned, false);
assert.equal(snap(rail.selectNode(state, '')), snap(state));

// pinning needs a node and produces a compact versioned record
assert.equal(snap(rail.pin({ horizon: 1, nodeId: null, pinned: false }, null)), snap({ horizon: 1, nodeId: null, pinned: false }));
state = rail.pin(state);
assert.equal(state.pinned, true);
const record = rail.focusRecord(state, '3 Aug 2026');
assert.equal(snap(record), snap({ version: 1, nodeId: 'constellation', windowId: 'w14', pinnedAt: '3 Aug 2026' }));
assert.equal(rail.focusRecord(rail.release(state), '3 Aug 2026'), null);

// persistence round trip: write, read, restore
rail.write(storage, record);
assert.equal(values.get(rail.STORAGE_KEY), snap(record));
assert.equal(snap(rail.read(storage)), snap(record));
assert.equal(snap(rail.restore(rail.read(storage))), snap({ horizon: 1, nodeId: 'constellation', pinned: true }));

// malformed or foreign records are ignored
assert.equal(rail.restore(null), null);
assert.equal(rail.restore({ version: 2, nodeId: 'constellation', windowId: 'w7' }), null);
assert.equal(rail.restore({ version: 1, nodeId: '', windowId: 'w7' }), null);
assert.equal(rail.restore({ version: 1, nodeId: 'constellation', windowId: 'nope' }), null);

// release keeps the place and focus but drops the pin; clear empties storage
assert.equal(snap(rail.release(state)), snap({ horizon: 1, nodeId: 'constellation', pinned: false }));
rail.clear(storage);
assert.equal(rail.read(storage), null);

console.log('recency-rail state tests passed');
