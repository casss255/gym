// Run with: node --test tests/
// Checks the stick-figure exercises: data is complete, and every pose stands on the floor (or a step)
// instead of floating or sinking through it.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const inline = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const engine = inline.slice(inline.indexOf('/* ---------- Pictogram engine'), inline.indexOf('/* ---------- Animation loop'));
const catsAndData = inline.slice(inline.indexOf('/* ---------- Kategori'), inline.indexOf('/* ---------- Penyimpanan'));
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

// The app files are plain browser scripts, so load the pieces we need into one shared scope.
const api = new Function(`${read('cardio.js')}\n${engine}\n${catsAndData}\n${read('i18n-ex.js').replace(/const isEn[\s\S]*$/, '')}
return { EX, EX_EN, CATS, CAT_EN, PROGRAMS, PROG_EN, GROUND, solveAt, cardioExercises };`)();
const { EX, EX_EN, CATS, CAT_EN, PROGRAMS, PROG_EN, GROUND, solveAt } = api;

const NEW_IDS = ['jumpingjack', 'highknees', 'buttkick', 'mountainclimber', 'squatjump', 'stepup', 'legraise', 'burpee', 'thruster', 'dbswing', 'ballslam', 'treadmill'];
// How far a resting point may sit from its surface. Standing figures rest ~4 px above the floor line,
// lying figures (existing crunch and bridge too) ~8 px, because their body has thickness.
const REST_FEET = 9;
const CONTACT_JOINTS = ['toe', 'toe2', 'ankle', 'ankle2', 'hand', 'hand2', 'elbow', 'elbow2'];

function surfaces(anim) {
  return [GROUND, ...(anim.statics || []).filter(s => s.type === 'bench' || s.type === 'treadmill').map(s => s.y)];
}

test('every exercise has both languages, a category, and valid poses', () => {
  Object.entries(EX).forEach(([id, ex]) => {
    assert.ok(CATS[ex.cat], `${id}: unknown category`);
    assert.ok(EX_EN[id], `${id}: missing English text`);
    ['equip', 'muscles', 'steps', 'avoid'].forEach(k => assert.ok(EX_EN[id][k] && EX_EN[id][k].length, `${id}: EN ${k}`));
    assert.strictEqual(EX_EN[id].steps.length, ex.steps.length, `${id}: EN and ID step counts differ`);
    assert.ok(ex.anim.poses.length >= 2, id);
    ex.anim.poses.forEach(p => ['t', 'ua', 'fa', 'th', 'sh'].forEach(k => assert.ok(Number.isFinite(p[k]), `${id}: pose ${k}`)));
  });
  Object.keys(CATS).forEach(k => assert.ok(CAT_EN[k], `category ${k} needs an English name`));
});

test('every program only uses known exercises and has English text', () => {
  PROGRAMS.forEach(p => {
    assert.ok(PROG_EN[p.id], `${p.id}: missing English text`);
    p.days.forEach(d => d.items.forEach(it => assert.ok(EX[it[0]], `${p.id}/${d.name}: unknown exercise ${it[0]}`)));
  });
});

const usedIn = p => new Set(p.days.flatMap(d => d.items.map(it => it[0])));
const needsNoGear = id => /^Tanpa alat/.test(EX[id].equip); // 'Tanpa alat' = no equipment ('Tanpa alat atau dumbbell' = optional dumbbells)

test('Fat Loss: No Equipment uses only exercises that need no equipment', () => {
  const p = PROGRAMS.find(x => x.id === 'fatloss');
  assert.ok(p, 'fatloss program missing');
  assert.ok(p.days.length >= 3);
  usedIn(p).forEach(id => assert.ok(needsNoGear(id), `${id} needs equipment (${EX[id].equip}) but is in the no-equipment program`));
  ['burpee', 'jumpingjack', 'highknees', 'mountainclimber', 'squatjump'].forEach(id => assert.ok(usedIn(p).has(id), `${id} should be in the no-equipment program`));
});

test('Fat Loss: Gym is a real gym program: lifts with equipment plus gym conditioning moves', () => {
  const p = PROGRAMS.find(x => x.id === 'fatlossgym');
  assert.ok(p, 'fatlossgym program missing');
  assert.ok(p.days.length >= 3);
  const used = usedIn(p);
  ['thruster', 'dbswing', 'ballslam', 'treadmill'].forEach(id => assert.ok(used.has(id), `${id} is not in the gym program`));
  const withGear = [...used].filter(id => !needsNoGear(id));
  assert.ok(withGear.length >= 8, `only ${withGear.length} exercises use gym equipment`);
  p.days.forEach(d => assert.ok(d.items.some(it => !needsNoGear(it[0])), `${d.name} has no equipment exercise`));
});

test('the two fat-loss programs have different day names (history is kept per day name)', () => {
  const names = ['fatloss', 'fatlossgym'].flatMap(id => PROGRAMS.find(x => x.id === id).days.map(d => d.name));
  assert.strictEqual(new Set(names).size, names.length);
});

test('timed cardio moves are logged in seconds', () => {
  ['jumpingjack', 'highknees', 'buttkick', 'mountainclimber', 'treadmill'].forEach(id => assert.strictEqual(EX[id].timed, true, id));
});

test('new exercises: each pose rests on the floor or a step (no floating, no sinking)', () => {
  NEW_IDS.forEach(id => {
    const anim = EX[id].anim, ground = surfaces(anim);
    [0, 1].forEach(u => {
      if (u === 1 && anim.airborne) return; // mid-jump frames are meant to be off the floor
      const J = solveAt(anim, u);
      const lowest = Math.max(...CONTACT_JOINTS.map(k => J[k][1]) );
      const nearest = Math.min(...ground.map(g => Math.abs(lowest - g)));
      assert.ok(nearest <= REST_FEET, `${id} u=${u}: lowest contact y=${lowest.toFixed(1)}, surfaces ${ground}`);
    });
  });
});

test('new exercises: no joint ever goes below the floor, at any point of the motion', () => {
  NEW_IDS.forEach(id => {
    const anim = EX[id].anim;
    for (let i = 0; i <= 20; i++) {
      const J = solveAt(anim, i / 20);
      Object.entries(J).forEach(([k, [, y]]) => assert.ok(y <= GROUND + 3, `${id} u=${i / 20}: ${k} is at y=${y.toFixed(1)}, below the floor`));
    }
  });
});

test('new exercises: the animation actually moves', () => {
  NEW_IDS.forEach(id => {
    const a = solveAt(EX[id].anim, 0), b = solveAt(EX[id].anim, 1);
    const moved = Object.keys(a).reduce((m, k) => Math.max(m, Math.hypot(a[k][0] - b[k][0], a[k][1] - b[k][1])), 0);
    assert.ok(moved > 15, `${id}: only moves ${moved.toFixed(1)} px`);
  });
});

test('existing exercises are unchanged by the vertical-offset support (y defaults to 0)', () => {
  ['squat', 'bench', 'pushup', 'plank', 'latraise'].forEach(id => {
    [0, 1].forEach(u => {
      const J = solveAt(EX[id].anim, u);
      const a = EX[id].anim.anchor;
      assert.ok(Math.abs(J[a.joint][1] - a.y) < 1e-6, `${id}: anchor moved`);
    });
  });
});
