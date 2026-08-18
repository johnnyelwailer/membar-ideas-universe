const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
for (const [base, versioned] of [['timeline-state.js', 'timeline-state-v17.js'], ['timeline-handoff.js', 'timeline-handoff-v17.js'], ['correction-reading-state.js', 'correction-reading-state-v17.js'], ['timeline.css', 'timeline-v17.css'], ['timeline-mobile.css', 'timeline-mobile-v17.css']]) {
  assert.equal(fs.readFileSync(path.join(root, base), 'utf8'), fs.readFileSync(path.join(root, versioned), 'utf8'), `${versioned} must match its tested source`);
}
assert.match(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), /timeline-v17\.js/);
assert.match(fs.readFileSync(path.join(root, 'rehearsal-reading-v18.html'), 'utf8'), /rehearsal-reading-state-v18\.js/);
console.log('versioned asset coverage tests passed');
