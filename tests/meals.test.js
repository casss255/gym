// Run with: node --test tests/
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// The app files are plain browser scripts, so load them into one shared context.
const root = path.join(__dirname, '..');
const code = ['meals-data.js', 'meals.js'].map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n');
const api = new Function(`${code}
return { ING, RECIPES, RECIPE_BY_ID, DIET_RANK, MEAL_PLANS, validateProfile, calcTargets, slotTargets, scaleRecipe, generatePlan, sizeDay, eligibleRecipes, emptyPlan };`)();
const { ING, RECIPES, RECIPE_BY_ID, DIET_RANK, MEAL_PLANS, validateProfile, calcTargets, scaleRecipe, generatePlan, sizeDay, eligibleRecipes, emptyPlan } = api;

const MALE = { sex: 'm', age: 25, h: 175, w: 70, act: 'mod', goal: 'maintain' };
const FEMALE = { sex: 'f', age: 25, h: 160, w: 55, act: 'light', goal: 'lose' };
const BASE_PREFS = { diet: 'omni', veg: 'yes', allergies: [], cuisine: 'both', count: 4 };

const PROFILES = [
  MALE, FEMALE,
  { sex: 'm', age: 40, h: 190, w: 100, act: 'high', goal: 'gain' },
  { sex: 'f', age: 60, h: 150, w: 48, act: 'sed', goal: 'maintain' },
  { sex: 'm', age: 30, h: 170, w: 130, act: 'light', goal: 'lose' },
];

test('calcTargets: maintenance for a 70 kg, 175 cm man', () => {
  const t = calcTargets(MALE);
  assert.strictEqual(t.bmr, 1674);
  assert.ok(Math.abs(t.kcal - 2594) <= 10);
  assert.strictEqual(t.protein, 112); // 1.6 g/kg
});

test('calcTargets: protein and calories scale with bodyweight', () => {
  const light = calcTargets({ ...MALE, w: 60 });
  const heavy = calcTargets({ ...MALE, w: 90 });
  assert.ok(heavy.protein > light.protein);
  assert.ok(heavy.kcal > light.kcal);
});

test('calcTargets: taller people get more calories at the same weight', () => {
  assert.ok(calcTargets({ ...MALE, h: 190 }).kcal > calcTargets({ ...MALE, h: 160 }).kcal);
});

test('calcTargets: goal moves calories and protein', () => {
  const lose = calcTargets({ ...MALE, goal: 'lose' });
  const gain = calcTargets({ ...MALE, goal: 'gain' });
  assert.ok(lose.kcal < calcTargets(MALE).kcal && calcTargets(MALE).kcal < gain.kcal);
  assert.strictEqual(lose.protein, 140); // 2.0 g/kg
});

test('calcTargets: never goes below the calorie floor', () => {
  const t = calcTargets({ sex: 'f', age: 70, h: 145, w: 40, act: 'sed', goal: 'lose' });
  assert.strictEqual(t.kcal, 1200);
  assert.strictEqual(t.floorApplied, true);
});

test('calcTargets: under 18 never gets a deficit', () => {
  const t = calcTargets({ ...MALE, age: 17, goal: 'lose' });
  assert.strictEqual(t.goal, 'maintain');
  assert.strictEqual(t.minorAdjusted, true);
});

test('calcTargets: protein for a very heavy person uses a height-based weight', () => {
  const t = calcTargets({ sex: 'm', age: 30, h: 170, w: 130, act: 'light', goal: 'maintain' });
  assert.ok(t.protein < 130 * 1.6);
  assert.strictEqual(t.basisAdjusted, true);
});

test('calcTargets: macros add up to the calorie target', () => {
  PROFILES.forEach(p => {
    const t = calcTargets(p);
    const kcal = t.protein * 4 + t.carbs * 4 + t.fat * 9;
    assert.ok(Math.abs(kcal - t.kcal) / t.kcal < 0.04, `${JSON.stringify(p)} -> ${kcal} vs ${t.kcal}`);
  });
});

test('validateProfile: rejects missing or out-of-range values', () => {
  assert.strictEqual(validateProfile(MALE), null);
  assert.strictEqual(validateProfile({ ...MALE, sex: null }), 'e_sex');
  assert.strictEqual(validateProfile({ ...MALE, age: 12 }), 'e_age');
  assert.strictEqual(validateProfile({ ...MALE, h: 50 }), 'e_h');
  assert.strictEqual(validateProfile({ ...MALE, w: 0 }), 'e_w');
  assert.strictEqual(validateProfile({ ...MALE, w: NaN }), 'e_w');
});

test('recipes: every ingredient exists and every recipe has a name in both languages', () => {
  RECIPES.forEach(r => {
    assert.ok(r.n[0] && r.n[1], r.id);
    r.comps.forEach(c => assert.ok(ING[c.ing], `${r.id} -> ${c.ing}`));
  });
  Object.entries(ING).forEach(([id, i]) => assert.ok(i.n[0] && i.n[1] && i.k.length === 4, id));
});

test('recipes: diet and allergens are derived from ingredients', () => {
  assert.strictEqual(RECIPE_BY_ID.m_chicken_rice.diet, 'omni');
  assert.strictEqual(RECIPE_BY_ID.m_salmon_rice.diet, 'pesc');
  assert.strictEqual(RECIPE_BY_ID.m_telur_dadar.diet, 'veg');
  assert.strictEqual(RECIPE_BY_ID.m_lentil_rice.diet, 'vegan');
  assert.ok(RECIPE_BY_ID.m_gado_gado.al.includes('nuts') && RECIPE_BY_ID.m_gado_gado.al.includes('egg'));
});

test('scaleRecipe: hits the calorie target within 12% for typical meals', () => {
  PROFILES.forEach(p => {
    const slots = api.slotTargets(calcTargets(p), 4);
    slots.forEach(slot => {
      eligibleRecipes(BASE_PREFS, slot.type).forEach(r => {
        const s = scaleRecipe(r, slot.kcal, slot.protein, false);
        const off = Math.abs(s.kcal - slot.kcal) / slot.kcal;
        // meals outside the scaling range are allowed to miss; they are ranked down by the planner
        const base = r.comps.reduce((a, c) => a + ING[c.ing].k[0] * c.g / 100, 0);
        const k = slot.kcal / base;
        // foods sold in whole units (eggs, bread slices) can only round to the nearest unit
        // (each such item can be off by up to half a unit, so the worst case is the sum)
        const wholeUnitKcal = r.comps.filter(c => ING[c.ing].u && !ING[c.ing].u.half).reduce((a, c) => a + ING[c.ing].u.g * ING[c.ing].k[0] / 100, 0);
        const allowed = 0.12 + (0.5 * wholeUnitKcal) / slot.kcal;
        // a recipe held back by a per-meal maximum is allowed to undershoot; the planner picks a better fit instead
        const capped = s.items.some(i => ING[i.ing].m && i.g >= ING[i.ing].m);
        if (k >= 0.6 && k <= 2.3 && !capped) assert.ok(off < allowed, `${r.id} ${JSON.stringify(p)} ${s.kcal} vs ${slot.kcal}`);
      });
    });
  });
});

test('scaleRecipe: larger bodies get larger portions of the same meal', () => {
  const r = RECIPE_BY_ID.m_chicken_rice;
  const small = api.slotTargets(calcTargets({ ...FEMALE, goal: 'maintain' }), 3)[1];
  const big = api.slotTargets(calcTargets({ sex: 'm', age: 30, h: 190, w: 95, act: 'mod', goal: 'maintain' }), 3)[1];
  const a = scaleRecipe(r, small.kcal, small.protein, false);
  const b = scaleRecipe(r, big.kcal, big.protein, false);
  assert.ok(b.kcal > a.kcal && b.p > a.p);
  assert.ok(b.items.find(i => i.ing === 'rice_white').g > a.items.find(i => i.ing === 'rice_white').g);
});

test('scaleRecipe: no portion is unrealistic, even for the largest targets', () => {
  const big = { sex: 'm', age: 30, h: 195, w: 120, act: 'high', goal: 'gain' };
  [big, ...PROFILES].forEach(p => {
    api.slotTargets(calcTargets(p), 5).forEach(slot => {
      RECIPES.filter(r => r.slot === slot.type).forEach(r => {
        const s = scaleRecipe(r, slot.kcal, slot.protein, false);
        s.items.forEach(i => {
          const cap = ING[i.ing].m;
          if (cap) assert.ok(i.g <= cap + 30, `${r.id}: ${i.g} g ${i.ing} (max ${cap})`); // +30 allows for rounding to a whole unit
        });
        const eggs = s.items.find(i => i.ing === 'egg');
        if (eggs) assert.ok(eggs.count <= 5, `${r.id}: ${eggs.count} eggs`);
      });
    });
  });
});

test('scaleRecipe: amounts are whole units for countable foods', () => {
  const s = scaleRecipe(RECIPE_BY_ID.b_eggs_toast, 600, 40, false);
  const eggs = s.items.find(i => i.ing === 'egg');
  assert.strictEqual(eggs.count, Math.round(eggs.count));
  assert.strictEqual(eggs.g, eggs.count * 50);
});

test('scaleRecipe: dropping vegetables removes them and keeps calories on target', () => {
  const s = scaleRecipe(RECIPE_BY_ID.m_chicken_rice, 700, 45, true);
  assert.ok(!s.items.some(i => i.role === 'V'));
  assert.ok(Math.abs(s.kcal - 700) / 700 < 0.1);
});

test('generatePlan: fills every slot of every day', () => {
  PROFILES.forEach(p => {
    const plan = generatePlan(p, BASE_PREFS, 0);
    assert.strictEqual(plan.length, 7);
    plan.forEach(day => {
      assert.strictEqual(day.length, MEAL_PLANS[4].length);
      day.forEach(id => assert.ok(RECIPE_BY_ID[id]));
    });
  });
});

test('generatePlan: daily calories land within 10% and protein within 15% of target', () => {
  PROFILES.forEach(p => {
    const t = calcTargets(p);
    generatePlan(p, BASE_PREFS, 0).forEach((ids, d) => {
      const day = sizeDay(ids, p, BASE_PREFS);
      assert.ok(Math.abs(day.total.kcal - t.kcal) / t.kcal < 0.1, `${JSON.stringify(p)} day ${d}: ${Math.round(day.total.kcal)} vs ${t.kcal}`);
      assert.ok(day.total.p >= t.protein * 0.85, `${JSON.stringify(p)} day ${d}: protein ${Math.round(day.total.p)} vs ${t.protein}`);
    });
  });
});

test('generatePlan: protein stays close to the bodyweight-based target, not far above it', () => {
  const typical = PROFILES.filter(p => p.w < 110);
  ['omni', 'pesc', 'veg'].forEach(diet => {
    typical.forEach(p => {
      const prefs = { ...BASE_PREFS, diet };
      const t = calcTargets(p);
      generatePlan(p, prefs, 0).forEach(ids => {
        const ratio = sizeDay(ids, p, prefs).total.p / t.protein;
        assert.ok(ratio >= 0.8 && ratio <= 1.35, `${diet} ${JSON.stringify(p)}: protein ${ratio.toFixed(2)}x target`);
      });
    });
  });
});

test('generatePlan: respects diet and allergies', () => {
  const cases = [
    { ...BASE_PREFS, diet: 'vegan' },
    { ...BASE_PREFS, diet: 'veg' },
    { ...BASE_PREFS, diet: 'pesc' },
    { ...BASE_PREFS, allergies: ['egg', 'dairy'] },
    { ...BASE_PREFS, allergies: ['fish', 'shellfish', 'nuts', 'soy', 'gluten'] },
    { ...BASE_PREFS, diet: 'vegan', allergies: ['soy', 'nuts', 'gluten'] },
  ];
  cases.forEach(prefs => {
    generatePlan(MALE, prefs, 3).flat().forEach(id => {
      assert.ok(id, `a slot was left empty for ${JSON.stringify(prefs)}`);
      const r = RECIPE_BY_ID[id];
      assert.ok(DIET_RANK[r.diet] <= DIET_RANK[prefs.diet], `${r.id} breaks diet ${prefs.diet}`);
      assert.ok(!r.al.some(a => prefs.allergies.includes(a)), `${r.id} has an avoided allergen`);
    });
  });
});

test('generatePlan: no-vegetable preference leaves out vegetables and dishes built on them', () => {
  const prefs = { ...BASE_PREFS, veg: 'no' };
  const plan = generatePlan(MALE, prefs, 1);
  plan.flat().forEach(id => assert.notStrictEqual(id, 'm_gado_gado'));
  plan.forEach(ids => sizeDay(ids, MALE, prefs).meals.forEach(m => assert.ok(!m.items.some(i => i.role === 'V'))));
});

test('generatePlan: the week has variety and the cuisine preference is followed', () => {
  const plan = generatePlan(MALE, { ...BASE_PREFS, cuisine: 'id' }, 0);
  const lunches = new Set(plan.map(d => d[1]));
  assert.ok(lunches.size >= 4, `only ${lunches.size} different lunches`);
  const mains = plan.flatMap(d => [d[1], d[3]]);
  const share = mains.filter(id => RECIPE_BY_ID[id].cuisine === 'id').length / mains.length;
  assert.ok(share > 0.6, `Indonesian-style share was ${share}`);
});

test('generatePlan: omnivores mostly get meat or fish mains, pescatarians get fish mains', () => {
  const mainsFor = diet => generatePlan(MALE, { ...BASE_PREFS, diet }, 0).flatMap(d => [d[1], d[3]]).map(id => RECIPE_BY_ID[id]);
  const omni = mainsFor('omni');
  const animal = omni.filter(r => r.diet === 'omni' || r.diet === 'pesc').length / omni.length;
  assert.ok(animal >= 0.7, `omni: only ${Math.round(animal * 100)}% meat or fish`);
  const pesc = mainsFor('pesc');
  const fish = pesc.filter(r => r.diet === 'pesc').length / pesc.length;
  assert.ok(fish >= 0.3, `pesc: only ${Math.round(fish * 100)}% fish`);
});

test('generatePlan: a different seed gives a different (still valid) plan; same seed is repeatable', () => {
  const a = generatePlan(MALE, BASE_PREFS, 0);
  assert.deepStrictEqual(generatePlan(MALE, BASE_PREFS, 0), a);
  assert.notDeepStrictEqual(generatePlan(MALE, BASE_PREFS, 7), a);
});

test('generatePlan: returns null slots, not a crash, when filters leave nothing', () => {
  // Eggs, dairy, fish, shellfish, soy, nuts and gluten all excluded for a vegan: still has legumes, so use an impossible diet value.
  const plan = generatePlan(MALE, { ...BASE_PREFS, diet: 'nope' }, 0);
  assert.ok(plan.flat().every(id => id === null));
});

test('emptyPlan: 7 days with one null per slot', () => {
  const plan = emptyPlan(5);
  assert.strictEqual(plan.length, 7);
  assert.ok(plan.every(d => d.length === 5 && d.every(x => x === null)));
});
