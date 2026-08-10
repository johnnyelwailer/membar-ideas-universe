const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'source-layout-state.js'), 'utf8');
const values = new Map();
const storage = { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
const context = { globalThis: {}, window: {} };
context.globalThis = context.window;
vm.runInNewContext(source, context);
const state = context.window.MembarSourceLayoutState;

assert.equal(state.sectionAtTime(47.3).id, 'pre');
assert.equal(state.momentAtTime(47.3).time, '00:47.3');
assert.equal(state.momentAtTime(47.3).chord, 'C');
assert.equal(state.momentAtTime(60).label, 'Chorus');
const kept = state.momentAtTime(47.3);
state.write(storage, kept);
assert.equal(state.read(storage).lyric, 'If I leave, leave a light on');
assert.equal(state.read(storage).source, 'north-window_take-02.mp4');
state.clear(storage);
assert.equal(state.read(storage), null);
console.log('source-layout state tests passed');
