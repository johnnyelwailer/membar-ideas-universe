const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'artboard-constellation-state.js'), 'utf8');
const values = new Map();
const storage = { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
const context = { globalThis: {}, window: {} };
context.globalThis = context.window;
vm.runInNewContext(source, context);
const state = context.window.MembarConstellationState;
// state objects come from the vm realm, so compare JSON snapshots, not prototypes
const snap = (value) => JSON.stringify(value);

// initial state: nothing placed, no treatment, no pin, no stored record
assert.equal(snap(state.initialState()), snap({ placed: false, treatment: null, pinned: false }));
assert.equal(state.read(storage), null);

// source moment stays authoritative
assert.equal(state.MODEL.song, 'North Window');
assert.equal(state.MODEL.artist, 'Jo Sable');
assert.equal(state.MODEL.moment.time, '00:60.0');
assert.equal(state.MODEL.moment.label, 'Chorus');
assert.equal(state.MODEL.moment.chord, 'G');
assert.equal(state.MODEL.source, 'north-window_take-02.mp4');
assert.equal(snap(state.TREATMENT_IDS), snap(['ember', 'tide']));

// placement fills the orbit but selects nothing
const placed = state.place(state.initialState());
assert.equal(snap(placed), snap({ placed: true, treatment: null, pinned: false }));
assert.equal(state.pinRecord(placed), null);

// treatment selection: valid ids only, pin never implied
assert.equal(snap(state.selectTreatment(placed, 'ember')), snap({ placed: true, treatment: 'ember', pinned: false }));
assert.equal(snap(state.selectTreatment(placed, 'nope')), snap(placed));
assert.equal(snap(state.selectTreatment(state.initialState(), 'ember')), snap(state.initialState()));
const selected = state.selectTreatment(placed, 'tide');
assert.equal(state.treatmentFor(selected).label, 'Tide glass');

// pinning requires a placed moment with a treatment
assert.equal(snap(state.pin(placed)), snap(placed));
const pinned = state.pin(selected);
assert.equal(snap(pinned), snap({ placed: true, treatment: 'tide', pinned: true }));

// pin persistence shape is versioned and source-backed
const record = state.pinRecord(pinned);
state.write(storage, record);
assert.equal(snap(state.read(storage)), snap({
  version: 1,
  song: 'North Window',
  artist: 'Jo Sable',
  source: 'north-window_take-02.mp4',
  momentId: 'chorus',
  momentLabel: 'Chorus',
  chord: 'G',
  seconds: 60,
  time: '00:60.0',
  lyric: 'We are the weather in the room',
  treatment: 'tide',
  treatmentLabel: 'Tide glass',
  pinnedAt: '31 Jul 2026',
}));
assert.equal(state.STORAGE_KEY, 'membar:constellation-pin:v01');

// restore/revisit rebuilds the pinned constellation; bad records are ignored
assert.equal(snap(state.restore(state.read(storage))), snap(pinned));
assert.equal(state.restore({ version: 1, treatment: 'nope' }), null);
assert.equal(state.restore({ version: 9, treatment: 'tide' }), null);
assert.equal(state.restore(null), null);

// release unpins without touching the placed moment, and clears storage
assert.equal(snap(state.release(pinned)), snap({ placed: true, treatment: 'tide', pinned: false }));
state.clear(storage);
assert.equal(state.read(storage), null);

console.log('artboard-constellation state tests passed');
