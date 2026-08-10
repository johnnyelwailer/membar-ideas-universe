const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(require('node:path').join(__dirname, 'source-strip.js'), 'utf8');
const context = { window: {} };
vm.runInNewContext(source, context);

const state = context.window.MembarSourceStripState;
const model = {
  duration: 72,
  song: 'North Window',
  artist: 'Jo Sable',
  source: 'north-window_take-02.mp4',
  sections: [
    { id: 'cold-open', start: 0, label: 'Cold open', chord: 'Am', lyric: 'Harbor light, do not let me go', scene: 'sea' },
    { id: 'verse', start: 18.6, label: 'Verse 1', chord: 'F', lyric: 'I kept the kettle singing low', scene: 'kitchen' },
    { id: 'pre', start: 42, label: 'Pre-chorus', chord: 'C', lyric: 'If I leave, leave a light on', scene: 'window' },
    { id: 'chorus', start: 54.4, label: 'Chorus', chord: 'G', lyric: 'We are the weather in the room', scene: 'rain' },
  ],
};

assert.equal(state.sectionAtTime(model.sections, 47.3).id, 'pre');
assert.equal(state.momentAtTime(model, 47.3).time, '00:47.3');
assert.equal(state.momentAtTime(model, 47.3).chord, 'C');

const kept = state.momentAtTime(model, 47.3);
const restored = state.restoreMoment(model, kept);
assert.deepEqual(
  { time: restored.time, chord: restored.chord, lyric: restored.lyric },
  { time: '00:47.3', chord: 'C', lyric: 'If I leave, leave a light on' },
);

console.log('source-strip state tests passed');
