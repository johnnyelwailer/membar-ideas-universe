const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const stateSource = fs.readFileSync(path.join(__dirname, 'correction-state.js'), 'utf8');
const markup = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const context = { window: {} };
vm.runInNewContext(stateSource, context);
const { performedWordForLine, restorePerformedWord } = context.window.MembarCorrectionState;

assert.match(markup, /data-time="00:48\.1" data-performed-word="flame"/);
assert.match(markup, /data-time="00:53\.6" data-performed-word="name"/);

function line(performedWord, displayedWord = performedWord) {
  const strong = { textContent: ' ' + displayedWord };
  return {
    dataset: performedWord ? { performedWord } : {},
    querySelector: () => strong,
    strong,
  };
}

for (const word of ['flame', 'name']) {
  const fixtureLine = line(word, 'time');
  assert.equal(performedWordForLine(fixtureLine), word);
  assert.equal(restorePerformedWord(fixtureLine, word), word);
  assert.equal(fixtureLine.strong.textContent, ' ' + word);
}
