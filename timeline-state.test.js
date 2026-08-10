const assert = require('node:assert/strict');
const test = require('node:test');
const state = require('./timeline-state.js');

const moments = [{ index: 0, id: 'first' }, { index: 1, id: 'second' }, { index: 2, id: 'third' }];

test('moves the thumb without leaving the timeline bounds', () => {
  assert.equal(state.moveIndex({ index: 0 }, -1, moments.length).index, 0);
  assert.equal(state.moveIndex({ index: 1 }, 1, moments.length).index, 2);
  assert.equal(state.moveIndex({ index: 2 }, 8, moments.length).index, 2);
});

test('play is a reversible state transition', () => {
  assert.equal(state.togglePlaying({ playing: false }).playing, true);
  assert.equal(state.togglePlaying({ playing: true }).playing, false);
});

test('holding a moment persists its identity and restore clamps stale indexes', () => {
  const held = state.holdMoment({ index: 1 }, moments);
  assert.deepEqual(held, { index: 1, heldId: 'second' });
  assert.deepEqual(state.restore({ index: 99, heldId: 'second' }, moments.length), { index: 2, playing: false, heldId: 'second' });
  assert.deepEqual(state.restore(null, moments.length), { index: 0, playing: false, heldId: null });
});
