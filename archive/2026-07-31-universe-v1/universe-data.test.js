const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const load = (file) => fs.readFileSync(path.join(__dirname, file), 'utf8');
const context = { globalThis: {}, window: {} };
context.globalThis = context.window;
vm.runInNewContext(load('recency-rail-state.js'), context);
vm.runInNewContext(load('universe-data.js'), context);
const rail = context.window.MembarRecencyRailState;
const data = context.window.MembarUniverseData;
const snap = (value) => JSON.stringify(value);

// The archived shell retains the carried-forward run-13 node: 15 recent mapped records + 88 quiet archive records.
assert.equal(data.recentNodes.length, 15);
assert.equal(data.generatedNodes.length, 88);
assert.equal(data.universe.length, 103);
assert.equal(data.recentIds.length, 15);

// every node carries explicit status, change type, edges, date, and a route
const CHANGE_TYPES = ['new', 'updated', 'stable', 'needs-review'];
for (const node of data.universe) {
  assert.ok(node.id && node.title && node.hypothesis, `identity fields on ${node.id}`);
  assert.ok(typeof node.state === 'string' && node.state.length > 0, `explicit status on ${node.id}`);
  assert.ok(CHANGE_TYPES.includes(node.change_type), `change type on ${node.id}`);
  assert.ok(Array.isArray(node.edges) && node.edges.length > 0 && node.edges.every((edge) => typeof edge === 'string'), `edges on ${node.id}`);
  assert.ok(typeof node.link === 'string' && node.link.length > 0, `route on ${node.id}`);
  assert.ok(Number.isInteger(node.day) && node.day >= 1 && node.day <= 31, `recency day on ${node.id}`);
}

// status mix matches the shell filters: 4 new, 3 updated, 2 needs review
const count = (type) => data.universe.filter((node) => node.change_type === type).length;
assert.equal(count('new'), 4);
assert.equal(count('updated'), 3);
assert.equal(count('needs-review'), 2);
assert.equal(count('stable'), 94);

// rail clustering over the fixture: 15 + 24 + 28 + 36 = 103 ideas
const windowCounts = rail.WINDOW_IDS.map((id) => data.universe.filter((node) => rail.windowForDay(node.day) === id).length);
assert.equal(snap(windowCounts), snap([15, 24, 28, 36]));
assert.equal(windowCounts.reduce((sum, value) => sum + value, 0), 103);

// cumulative horizons: 15 → 39 → 67 → 103
const cumulativeExpected = [15, 39, 67, 103];
let cumulative = 0;
windowCounts.forEach((value, index) => {
  cumulative += value;
  assert.equal(cumulative, cumulativeExpected[index]);
});

// anchor routes and dates from prior runs stay untouched
const byId = new Map(data.universe.map((node) => [node.id, node]));
assert.equal(byId.get('constellation').link, 'artboard-constellation.html');
assert.equal(byId.get('constellation').day, 31);
assert.equal(byId.get('source-layout').link, 'source-layout.html');
assert.equal(byId.get('source-strip').link, 'source-video-workbench.html');
assert.equal(byId.get('artboard').link, 'artboard-constellation.html');
assert.equal(byId.get('correction').day, 27);
assert.equal(byId.get('workbench').day, 10);

console.log('universe fixture tests passed');
