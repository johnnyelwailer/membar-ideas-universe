const assert = require('node:assert/strict');
const handoff = require('./timeline-handoff.js');

const moment = {
  id: 'timeline',
  context: {
    song: 'North Window', artist: 'Jo Sable', source: 'north-window_take-02.mp4',
    section: 'Bridge', time: '01:14.2', seconds: 74.2, chord: 'Am', bars: '8 bars',
    lyric: 'The room keeps turning blue', provenance: 'performed source · synthetic fixture',
  },
};

const encoded = handoff.encode(handoff.contextFor(moment));
const decoded = handoff.decode(encoded);
assert.equal(decoded.id, 'timeline');
assert.equal(decoded.section, 'Bridge');
assert.equal(decoded.time, '01:14.2');
assert.equal(decoded.chord, 'Am');
assert.equal(decoded.lyric, 'The room keeps turning blue');
assert.equal(decoded.source, 'north-window_take-02.mp4');
assert.equal(handoff.decode('v2.invalid'), null);
assert.equal(handoff.returnHref(decoded), '../../index.html?returnMoment=timeline#timeline');
assert.equal(handoff.returnHref({ song: 'North Window' }), '../../index.html#timeline');
assert.match(handoff.routeHref('archive/live-session.html', moment), /\?moment=v1\./);
console.log('timeline handoff tests passed');
