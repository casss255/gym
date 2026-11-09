// Run with: node --test tests/*.test.js
// The body-measurement forms must show empty boxes. A grey example number (70, 170...) looks like a
// real saved value and confuses people, so no placeholder is allowed in these screens.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const read = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');

['progress-view.js', 'meals-view.js'].forEach(file => {
  test(`${file}: weight, waist, height and age boxes show no example numbers`, () => {
    const lines = read(file).split('\n').map((text, i) => ({ text, line: i + 1 })).filter(l => /placeholder/i.test(l.text));
    assert.deepStrictEqual(lines, [], `placeholder found in ${file}: ${lines.map(l => `line ${l.line}`).join(', ')}`);
  });
});
