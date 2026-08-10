(function exposeCorrectionState(global) {
  function performedWordForLine(line) {
    return line.dataset.performedWord || line.querySelector('strong')?.textContent.trim() || '';
  }

  function restorePerformedWord(line, performedWord) {
    const activeWord = line.querySelector('strong');
    const word = performedWord || performedWordForLine(line);
    if (!activeWord || !word) return '';
    activeWord.textContent = ' ' + word;
    return word;
  }

  global.MembarCorrectionState = Object.freeze({ performedWordForLine, restorePerformedWord });
})(window);
