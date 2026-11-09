/* ---------- Meal planning: daily targets from bodyweight and height, portion scaling, plan generation ----------
   Pure functions only: no DOM, no app state. Needs meals-data.js. */
const ACTIVITY = { sed: 1.2, light: 1.375, mod: 1.55, high: 1.725 };
const GOAL_KCAL = { lose: 0.8, maintain: 1, gain: 1.1 };
const GOAL_PROTEIN = { lose: 2.0, maintain: 1.6, gain: 1.8 }; // g per kg
const MIN_KCAL = { m: 1500, f: 1200 };
const MAX_PROTEIN_SHARE = 0.35;
const MIN_FAT_SHARE = 0.25;
const MIN_FAT_PER_KG = 0.6;
const BMI_PROTEIN_CAP = 30;
const LIMITS = { age: [16, 90], h: [120, 230], w: [35, 250] };
const SCALE_RANGE = [0.5, 2.5];
const WEEK_DAYS = 7;
const MAX_FLEX_SHIFT = 0.4; // most of a meal's carbs and fats that may be traded against protein
const MAX_PROTEIN_GROWTH = 0.5; // the protein food may grow by at most half...
const MAX_PROTEIN_SHRINK = 0.5; // ...or shrink by at most half
const PROTEIN_TOLERANCE = 0.1; // overshoot up to 10% is left alone
const BOOST_SLACK = 0.05;
const DIET_GAP_PENALTY = 0.12; // per step a meal is more restrictive than the user's diet, so an omnivore mostly gets omnivore meals
const CUISINE_PENALTY = 0.4; // a bit more than one repeat of a meal, so the preferred style dominates but still rotates

const MEAL_PLANS = {
  3: [
    { key: 'breakfast', type: 'b', share: 0.28 },
    { key: 'lunch', type: 'm', share: 0.38 },
    { key: 'dinner', type: 'm', share: 0.34 },
  ],
  4: [
    { key: 'breakfast', type: 'b', share: 0.25 },
    { key: 'lunch', type: 'm', share: 0.33 },
    { key: 'snackPm', type: 's', share: 0.12 },
    { key: 'dinner', type: 'm', share: 0.30 },
  ],
  5: [
    { key: 'breakfast', type: 'b', share: 0.22 },
    { key: 'snackAm', type: 's', share: 0.10 },
    { key: 'lunch', type: 'm', share: 0.30 },
    { key: 'snackPm', type: 's', share: 0.10 },
    { key: 'dinner', type: 'm', share: 0.28 },
  ],
};

const sumBy = (arr, fn) => arr.reduce((a, x) => a + fn(x), 0);
const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

/* Returns an error key, or null when the profile is usable. */
function validateProfile(p) {
  if (p.sex !== 'm' && p.sex !== 'f') return 'e_sex';
  if (!(p.age >= LIMITS.age[0] && p.age <= LIMITS.age[1])) return 'e_age';
  if (!(p.h >= LIMITS.h[0] && p.h <= LIMITS.h[1])) return 'e_h';
  if (!(p.w >= LIMITS.w[0] && p.w <= LIMITS.w[1])) return 'e_w';
  return null;
}

/* Mifflin-St Jeor energy estimate, goal adjustment, and protein per kg of (height-capped) bodyweight. */
function calcTargets(p) {
  const hm = p.h / 100;
  const bmr = 10 * p.w + 6.25 * p.h - 5 * p.age + (p.sex === 'm' ? 5 : -161);
  const tdee = bmr * ACTIVITY[p.act];
  const minorAdjusted = p.age < 18 && p.goal === 'lose';
  const goal = minorAdjusted ? 'maintain' : p.goal;
  const wanted = tdee * GOAL_KCAL[goal];
  const kcal = Math.round(Math.max(wanted, MIN_KCAL[p.sex]) / 10) * 10;
  const basisW = Math.min(p.w, BMI_PROTEIN_CAP * hm * hm);
  const protein = Math.min(basisW * GOAL_PROTEIN[goal], (kcal * MAX_PROTEIN_SHARE) / 4);
  const fat = Math.max((kcal * MIN_FAT_SHARE) / 9, basisW * MIN_FAT_PER_KG);
  const carbs = Math.max(0, (kcal - protein * 4 - fat * 9) / 4);
  return {
    bmr: Math.round(bmr), tdee: Math.round(tdee), kcal, goal,
    protein: Math.round(protein), fat: Math.round(fat), carbs: Math.round(carbs),
    floorApplied: wanted < MIN_KCAL[p.sex], minorAdjusted, basisAdjusted: p.w > basisW,
  };
}

function slotTargets(targets, count) {
  return (MEAL_PLANS[count] || MEAL_PLANS[3]).map(s => ({
    key: s.key, type: s.type,
    kcal: Math.round(targets.kcal * s.share), protein: Math.round(targets.protein * s.share),
  }));
}

const gramsMacros = (ing, g) => {
  const k = ING[ing].k;
  return { kcal: (g * k[0]) / 100, p: (g * k[1]) / 100, c: (g * k[2]) / 100, f: (g * k[3]) / 100 };
};
const sumMacros = items => ({
  kcal: sumBy(items, i => i.kcal), p: sumBy(items, i => i.p), c: sumBy(items, i => i.c), f: sumBy(items, i => i.f),
});

/* Snap an amount to something a person can weigh or count. */
function roundAmount(ing, g) {
  const u = ING[ing].u;
  if (u) {
    const step = u.half ? 0.5 : 1;
    const count = Math.max(step, Math.round(g / u.g / step) * step);
    return { g: count * u.g, count };
  }
  const step = g < 25 ? 1 : 5;
  return { g: Math.max(step, Math.round(g / step) * step) };
}

const isFlex = it => it.role === 'C' || it.role === 'F';

/* Nudge the densest protein food up or down toward the meal's protein target, and trade the calories
   with the carbs and fats so the meal stays on its calorie target. */
function fitProtein(items, slotProtein) {
  const diff = slotProtein - sumBy(items, i => gramsMacros(i.ing, i.g).p);
  const proteins = items.map((it, idx) => ({ idx, dens: ING[it.ing].k[1] / 100 })).filter(x => items[x.idx].role === 'P' && x.dens > 0.06);
  const flexKcal = sumBy(items.filter(isFlex), i => gramsMacros(i.ing, i.g).kcal);
  if (!proteins.length || flexKcal <= 0) return items;
  const best = proteins.reduce((a, b) => (b.dens > a.dens ? b : a));
  const target = items[best.idx];
  const kcalPerG = ING[target.ing].k[0] / 100;
  // either way, only move what the carbs and fats can trade back (plus a small slack), so calories stay on target
  const totalKcal = sumBy(items, i => gramsMacros(i.ing, i.g).kcal);
  const maxMoveG = (flexKcal * MAX_FLEX_SHIFT + totalKcal * BOOST_SLACK) / kcalPerG;
  let delta; // grams of the protein food to add (negative removes)
  let flexScale; // multiplier for the carbs and fats
  if (diff > 2) {
    delta = Math.min(diff / best.dens, target.g * MAX_PROTEIN_GROWTH, maxMoveG);
    flexScale = 1 - Math.min((delta * kcalPerG) / flexKcal, MAX_FLEX_SHIFT);
  } else if (diff < -slotProtein * PROTEIN_TOLERANCE) {
    delta = -Math.min(-diff / best.dens, target.g * MAX_PROTEIN_SHRINK, maxMoveG);
    flexScale = 1 + Math.min((-delta * kcalPerG) / flexKcal, MAX_FLEX_SHIFT);
  } else return items;
  return items.map((it, idx) => (idx === best.idx ? { ...it, g: it.g + delta } : isFlex(it) ? { ...it, g: it.g * flexScale } : it));
}

/* Size one recipe to a meal's calorie and protein target. */
function scaleRecipe(recipe, slotKcal, slotProtein, noVeg) {
  const comps = noVeg ? recipe.comps.filter(c => c.role !== 'V') : recipe.comps;
  const baseKcal = sumBy(comps, c => gramsMacros(c.ing, c.g).kcal);
  const k = clamp(slotKcal / baseKcal, SCALE_RANGE[0], SCALE_RANGE[1]);
  const sized = fitProtein(comps.map(c => ({ ...c, g: c.g * k })), slotProtein);
  const items = sized.map(c => {
    const amt = roundAmount(c.ing, ING[c.ing].m ? Math.min(c.g, ING[c.ing].m) : c.g);
    return { ing: c.ing, role: c.role, ...amt, ...gramsMacros(c.ing, amt.g) };
  });
  return { id: recipe.id, items, ...sumMacros(items) };
}

function recipeFits(recipe, prefs) {
  if (DIET_RANK[prefs.diet] === undefined) return false;
  if (DIET_RANK[recipe.diet] > DIET_RANK[prefs.diet]) return false;
  if (recipe.al.some(a => (prefs.allergies || []).includes(a))) return false;
  return !(prefs.veg === 'no' && recipe.vegCore);
}
const eligibleRecipes = (prefs, type) => RECIPES.filter(r => r.slot === type && recipeFits(r, prefs));

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Lower is better: miss on calories, bigger penalty for falling short on protein. */
function fitError(sized, slot) {
  const kcalErr = Math.abs(sized.kcal - slot.kcal) / slot.kcal;
  const short = Math.max(0, slot.protein - sized.p) / slot.protein;
  const over = Math.max(0, sized.p - slot.protein) / slot.protein;
  return kcalErr + short + over * 0.3;
}

const emptyPlan = count => Array.from({ length: WEEK_DAYS }, () => MEAL_PLANS[count].map(() => null));

/* A 7-day plan of recipe ids (null where nothing fits). Rotates recipes so the week is not repetitive. */
function generatePlan(profile, prefs, seed) {
  const targets = calcTargets(profile);
  const slots = slotTargets(targets, prefs.count);
  const noVeg = prefs.veg === 'no';
  const rnd = mulberry32((seed || 0) + 1);
  const used = {};
  return Array.from({ length: WEEK_DAYS }, () => {
    const today = new Set();
    return slots.map(slot => {
      const pool = eligibleRecipes(prefs, slot.type);
      if (!pool.length) return null;
      const ranked = pool
        .map(r => {
          const penalty = (used[r.id] || 0) * 0.25 + (today.has(r.id) ? 1 : 0)
            + (prefs.cuisine !== 'both' && r.cuisine !== prefs.cuisine ? CUISINE_PENALTY : 0)
            + (DIET_RANK[prefs.diet] - DIET_RANK[r.diet]) * DIET_GAP_PENALTY + rnd() * 0.08;
          return { id: r.id, score: fitError(scaleRecipe(r, slot.kcal, slot.protein, noVeg), slot) + penalty };
        })
        .sort((a, b) => a.score - b.score);
      used[ranked[0].id] = (used[ranked[0].id] || 0) + 1;
      today.add(ranked[0].id);
      return ranked[0].id;
    });
  });
}

/* Sized meals for one day plus the day's totals. dayIds holds a recipe id or null per slot. */
function sizeDay(dayIds, profile, prefs) {
  const slots = slotTargets(calcTargets(profile), prefs.count);
  const meals = dayIds.map((id, i) => (id && RECIPE_BY_ID[id] ? scaleRecipe(RECIPE_BY_ID[id], slots[i].kcal, slots[i].protein, prefs.veg === 'no') : null));
  return { slots, meals, total: sumMacros(meals.filter(Boolean)) };
}
