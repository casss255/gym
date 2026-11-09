// Run with: node --test tests/*.test.js
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const code = fs.readFileSync(path.join(__dirname, '..', 'progress.js'), 'utf8');
const api = new Function(`${code}
return { todayStr, dateMs, daysBetween, addDays, validateCheckin, upsertCheckin, removeCheckin, weekStatus, summarize, chartModel, CHECKIN_EVERY_DAYS };`)();
const { todayStr, daysBetween, addDays, validateCheckin, upsertCheckin, removeCheckin, weekStatus, summarize, chartModel } = api;

const entry = (date, w, waist) => ({ date, w, waist });
const WEEKS = [entry('2026-09-07', 82, 94), entry('2026-09-14', 81.4, 93), entry('2026-09-21', 80.9, 92.5), entry('2026-11-02', 78.6, 89)];
const BOX = { w: 340, h: 190, left: 36, right: 14, top: 14, bottom: 28 };

test('dates: todayStr, addDays and daysBetween agree, across month ends and leap days', () => {
  assert.strictEqual(todayStr(new Date(2026, 10, 9)), '2026-11-09');
  assert.strictEqual(addDays('2026-11-30', 1), '2026-12-01');
  assert.strictEqual(addDays('2028-02-28', 1), '2028-02-29');
  assert.strictEqual(addDays('2026-01-03', -7), '2025-12-27');
  assert.strictEqual(daysBetween('2026-11-02', '2026-11-09'), 7);
  assert.strictEqual(daysBetween('2026-03-01', '2026-04-01'), 31);
  assert.strictEqual(daysBetween('2026-10-20', '2026-11-05'), 16); // across the end of daylight saving in some regions
});

test('validateCheckin: accepts a normal check-in', () => {
  assert.strictEqual(validateCheckin(entry('2026-11-09', 78.6, 89), '2026-11-09'), null);
});

test('validateCheckin: rejects bad dates, weights and waists', () => {
  const today = '2026-11-09';
  assert.strictEqual(validateCheckin(entry('', 78, 89), today), 'pe_date');
  assert.strictEqual(validateCheckin(entry('2026-13-40', 78, 89), today), 'pe_date');
  assert.strictEqual(validateCheckin(entry('2026-11-10', 78, 89), today), 'pe_date'); // tomorrow
  assert.strictEqual(validateCheckin(entry('2026-11-09', 0, 89), today), 'pe_w');
  assert.strictEqual(validateCheckin(entry('2026-11-09', 500, 89), today), 'pe_w');
  assert.strictEqual(validateCheckin(entry('2026-11-09', NaN, 89), today), 'pe_w');
  assert.strictEqual(validateCheckin(entry('2026-11-09', 78, 10), today), 'pe_waist');
  assert.strictEqual(validateCheckin(entry('2026-11-09', 78, 250), today), 'pe_waist');
});

test('upsertCheckin: keeps entries sorted by date, replaces the same date, never mutates', () => {
  const before = [entry('2026-09-14', 81.4, 93), entry('2026-09-07', 82, 94)];
  const snapshot = JSON.stringify(before);
  const added = upsertCheckin(before, entry('2026-09-21', 80.9, 92.5));
  assert.deepStrictEqual(added.map(e => e.date), ['2026-09-07', '2026-09-14', '2026-09-21']);
  const replaced = upsertCheckin(added, entry('2026-09-14', 81.0, 92.8));
  assert.strictEqual(replaced.length, 3);
  assert.strictEqual(replaced[1].w, 81.0);
  assert.strictEqual(JSON.stringify(before), snapshot);
  assert.notStrictEqual(added, before);
});

test('removeCheckin: removes by date without mutating', () => {
  const after = removeCheckin(WEEKS, '2026-09-14');
  assert.strictEqual(after.length, 3);
  assert.ok(!after.some(e => e.date === '2026-09-14'));
  assert.strictEqual(WEEKS.length, 4);
});

test('weekStatus: no entries means a first check-in is due', () => {
  const s = weekStatus([], '2026-11-09');
  assert.deepStrictEqual([s.due, s.daysSince, s.nextDate, s.count], [true, null, '2026-11-09', 0]);
});

test('weekStatus: due only once 7 days have passed since the last check-in', () => {
  assert.strictEqual(weekStatus(WEEKS, '2026-11-08').due, false); // 6 days
  assert.strictEqual(weekStatus(WEEKS, '2026-11-09').due, true); // 7 days
  const late = weekStatus(WEEKS, '2026-11-30');
  assert.strictEqual(late.due, true);
  assert.strictEqual(late.daysSince, 28);
  assert.strictEqual(weekStatus(WEEKS, '2026-11-04').nextDate, '2026-11-09');
});

test('summarize: start, latest and change since the beginning', () => {
  const w = summarize(WEEKS, 'w');
  assert.deepStrictEqual([w.first, w.last, w.change, w.count], [82, 78.6, -3.4, 4]);
  assert.ok(Math.abs(w.pct - (-3.4 / 82) * 100) < 1e-9);
  assert.deepStrictEqual([w.min, w.max], [78.6, 82]);
  const waist = summarize(WEEKS, 'waist');
  assert.deepStrictEqual([waist.first, waist.last, waist.change], [94, 89, -5]);
  assert.strictEqual(summarize([], 'w'), null);
  assert.strictEqual(summarize([entry('2026-11-09', 80, 90)], 'w').change, 0);
});

test('chartModel: runs from the first check-in at the left edge to the newest at the right edge', () => {
  const m = chartModel(WEEKS, 'w', BOX);
  assert.strictEqual(m.points[0].x, BOX.left);
  assert.strictEqual(m.points[m.points.length - 1].x, BOX.w - BOX.right);
});

test('chartModel: x follows real time, so a 6-week gap looks wider than a 1-week gap', () => {
  const m = chartModel(WEEKS, 'w', BOX);
  const gaps = m.points.slice(1).map((p, i) => p.x - m.points[i].x);
  assert.ok(gaps[2] > gaps[0] * 5, `gaps ${gaps.map(g => g.toFixed(1))}`);
});

test('chartModel: lower values sit lower on the screen and everything stays inside the plot', () => {
  const m = chartModel(WEEKS, 'w', BOX);
  assert.ok(m.points[0].y < m.points[3].y, 'the heavier start should be drawn higher (smaller y)');
  m.points.forEach(p => {
    assert.ok(p.y >= BOX.top && p.y <= BOX.h - BOX.bottom, `y ${p.y}`);
    assert.ok(p.x >= BOX.left && p.x <= BOX.w - BOX.right, `x ${p.x}`);
  });
  assert.strictEqual(m.ticks.length, 3);
  assert.ok(m.ticks[0].value > m.ticks[2].value && m.ticks[0].y < m.ticks[2].y);
  assert.strictEqual(m.baselineY, m.points[0].y);
});

test('chartModel: a single check-in starts at the left edge with a flat line across the chart', () => {
  const one = chartModel([entry('2026-11-09', 80, 90)], 'w', BOX);
  assert.strictEqual(one.points.length, 1);
  assert.ok(Number.isFinite(one.points[0].x) && Number.isFinite(one.points[0].y));
  assert.strictEqual(one.points[0].x, BOX.left);
  assert.strictEqual(one.line.length, 2, 'one check-in still has a line to draw');
  assert.strictEqual(one.line[0].x, BOX.left);
  assert.strictEqual(one.line[1].x, BOX.w - BOX.right);
  assert.strictEqual(one.line[0].y, one.line[1].y, 'the line is horizontal');
});

test('chartModel: the next check-in extends the same line from the first one', () => {
  const first = entry('2026-11-02', 80, 90);
  const before = chartModel([first], 'w', BOX);
  const after = chartModel([first, entry('2026-11-09', 78, 88)], 'w', BOX);
  assert.strictEqual(after.points[0].x, before.points[0].x, 'the first point stays at the left edge');
  assert.strictEqual(after.points[1].x, BOX.w - BOX.right, 'the new point is at the right edge');
  assert.ok(after.points[1].y > after.points[0].y, 'a lower weight is drawn lower');
  assert.deepStrictEqual(after.line.map(p => [p.x, p.y]), after.points.map(p => [p.x, p.y]), 'with 2+ check-ins the line passes through every point');
});

test('chartModel: identical values do not divide by zero', () => {
  const flat = chartModel([entry('2026-11-02', 80, 90), entry('2026-11-09', 80, 90)], 'w', BOX);
  flat.points.forEach(p => assert.ok(Number.isFinite(p.y)));
  assert.ok(flat.yMax > flat.yMin);
});

test('chartModel: works for the waist series and for many weeks', () => {
  const many = Array.from({ length: 52 }, (_, i) => entry(addDays('2026-01-05', i * 7), 90 - i * 0.2, 100 - i * 0.25));
  const m = chartModel(many, 'waist', BOX);
  assert.strictEqual(m.points.length, 52);
  m.points.forEach(p => assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y)));
  assert.ok(m.points[0].y < m.points[51].y);
});
