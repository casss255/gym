/* ---------- Meals tab: screens and actions ----------
   Uses globals from index.html (S, nav, render, save, toast, esc, num, I, closeSheet, $) and meals.js. */
const STEPS_AUTO = ['body', 'goal', 'act', 'diet', 'veg', 'allergy', 'cuisine', 'count'];
const STEPS_MANUAL = ['body', 'goal', 'act', 'count'];
const DEFAULT_PROFILE = { sex: '', age: '', h: '', w: '', act: 'light', goal: 'maintain' };
const DEFAULT_PREFS = { diet: 'omni', veg: 'yes', allergies: [], cuisine: 'both', count: 3 };
const OPTION_VALUES = {
  goal: ['lose', 'maintain', 'gain'],
  act: ['sed', 'light', 'mod', 'high'],
  diet: ['omni', 'pesc', 'veg', 'vegan'],
  veg: ['yes', 'no'],
  cuisine: ['id', 'intl', 'both'],
  count: [1, 2, 3, 4, 5],
};
const OPTION_OWNER = { goal: 'profile', act: 'profile', diet: 'prefs', veg: 'prefs', cuisine: 'prefs', count: 'prefs' };

const hasText = key => STR.en[key] !== undefined;
const fmtInt = n => Math.round(n).toLocaleString(locale());
const todayIdx = () => (new Date().getDay() + 6) % 7; // plan days run Monday to Sunday
const planDayLabel = i => dayShort((i + 1) % 7);
const recipeName = r => r.n[currentLang === 'id' ? 1 : 0];
const ingName = id => ING[id].n[currentLang === 'id' ? 1 : 0];
const stepsOf = w => (w.mode === 'auto' ? STEPS_AUTO : STEPS_MANUAL);

function readProfile(d) {
  return { sex: d.sex, age: num(d.age), h: num(d.h), w: num(d.w), act: d.act, goal: d.goal };
}

function newWizard(mode) {
  const M = S.meals || {};
  const p = M.profile;
  const profile = p ? { sex: p.sex, age: String(p.age), h: String(p.h), w: String(p.w), act: p.act, goal: p.goal } : {};
  const prefs = { ...DEFAULT_PREFS, ...(M.prefs || {}) };
  return { mode, step: 0, draft: { profile: { ...DEFAULT_PROFILE, ...profile }, prefs: { ...prefs, allergies: [...(prefs.allergies || [])] } } };
}

/* ---------- Screens ---------- */
function viewMeals() {
  if (nav.m) return viewWizard();
  return S.meals && S.meals.plan ? viewPlan() : viewIntro();
}

function viewIntro() {
  return `<h1 class="screen-title">${t('m_title')}</h1>
    <p class="lead">${t('m_lead')}</p>
    <button class="choice" data-act="m-start" data-mode="auto"><b>${t('m_auto')}</b><span class="sub">${t('m_auto_sub')}</span></button>
    <button class="choice" data-act="m-start" data-mode="manual"><b>${t('m_manual')}</b><span class="sub">${t('m_manual_sub')}</span></button>
    <p class="fine">${t('m_fine')}</p>`;
}

function optionList(key, current) {
  return `<div class="opts">${OPTION_VALUES[key].map(v => {
    const sub = hasText(`${key}_${v}_sub`) ? `<span class="sub">${t(`${key}_${v}_sub`)}</span>` : '';
    return `<button class="opt" aria-pressed="${String(current) === String(v)}" data-act="m-opt" data-k="${key}" data-v="${v}"><b>${t(`${key}_${v}`)}</b>${sub}</button>`;
  }).join('')}</div>`;
}

function stepBody(id, d) {
  if (id === 'body') {
    const field = (k, label, ph) => `<label class="field"><span>${t(label)}</span><input inputmode="decimal" data-mf="${k}" value="${esc(d.profile[k])}" placeholder="${ph}" autocomplete="off"></label>`;
    return `<div class="field"><span>${t('f_sex')}</span>
        <div class="pair">${['m', 'f'].map(v => `<button class="opt" aria-pressed="${d.profile.sex === v}" data-act="m-opt" data-k="sex" data-v="${v}"><b>${t('sex_' + v)}</b></button>`).join('')}</div></div>
      ${field('age', 'f_age', '25')}${field('h', 'f_h', '170')}${field('w', 'f_w', '65')}`;
  }
  if (id === 'allergy') {
    const none = !d.prefs.allergies.length;
    return `<div class="opts"><button class="opt" aria-pressed="${none}" data-act="m-allergy" data-v=""><b>${t('al_none')}</b></button>
      ${ALLERGY_KEYS.map(a => `<button class="opt" aria-pressed="${d.prefs.allergies.includes(a)}" data-act="m-allergy" data-v="${a}"><b>${t('al_' + a)}</b></button>`).join('')}</div>`;
  }
  return optionList(id, d[OPTION_OWNER[id]][id]);
}

function viewWizard() {
  const w = nav.m, steps = stepsOf(w), id = steps[w.step], last = w.step === steps.length - 1;
  return `<div class="topbar"><button class="back" data-act="m-back">${I.back}${t('m_back')}</button>
      <span class="sub">${t('m_step', { n: w.step + 1, total: steps.length })}</span></div>
    <div class="progress">${steps.map((s, i) => `<i class="${i < w.step ? 'done' : i === w.step ? 'now' : ''}"></i>`).join('')}</div>
    <h1 class="q-title">${t('q_' + id)}</h1>
    ${hasText(`q_${id}_sub`) ? `<p class="sub q-sub">${t(`q_${id}_sub`)}</p>` : ''}
    ${stepBody(id, w.draft)}
    <button class="btn next" data-act="m-next">${last ? t(w.mode === 'auto' ? 'm_done_auto' : 'm_done_manual') : t('m_next')}</button>`;
}

/* One ingredient row: "150 g Chicken breast", or "2 eggs (100 g)" when the unit already names the food. */
function ingredientLine(item) {
  const name = ingName(item.ing);
  if (!item.count) return `<b>${item.g} g</b> ${esc(name)}`;
  const u = ING[item.ing].u, n = item.count;
  const count = `${Math.floor(n) || ''}${n % 1 ? '½' : ''}`;
  const label = u[currentLang][n === 1 ? 0 : 1];
  const grams = `(${item.g} g)`;
  const redundant = name.toLowerCase().includes(u[currentLang][0].toLowerCase());
  return redundant ? `<b>${count} ${esc(label)}</b> ${grams}` : `<b>${count} ${esc(label)} ${grams}</b> ${esc(name)}`;
}

function recipeTags(r) {
  const tags = [];
  if (r.diet !== 'omni') tags.push(t('d_' + r.diet));
  if (r.al.length) tags.push(t('m_contains', { list: r.al.map(a => t('al_' + a).toLowerCase()).join(', ') }));
  return tags.join(' · ');
}

function mealCard(slot, meal, i) {
  const label = t('slot_' + slot.key);
  if (!meal) {
    return `<article class="meal empty"><div class="meal-top"><span class="slot">${label}</span></div>
      <p class="sub">${t('m_aim', { kcal: fmtInt(slot.kcal), p: slot.protein })}</p>
      <button class="btn small" data-act="m-change" data-slot="${i}">${t('m_choose')}</button></article>`;
  }
  const r = RECIPE_BY_ID[meal.id];
  return `<article class="meal">
    <div class="meal-top"><span class="slot">${label}</span>
      <span class="nums"><b>${fmtInt(meal.kcal)}</b> ${t('kcalUnit')} · <b>${fmtInt(meal.p)}</b> ${t('grams')} ${t('protein').toLowerCase()}</span></div>
    <h3>${esc(recipeName(r))}</h3>
    <ul class="ings">${meal.items.map(it => `<li>${ingredientLine(it)}</li>`).join('')}</ul>
    <div class="meal-foot"><span class="sub">${t('carbs')} ${fmtInt(meal.c)} ${t('grams')} · ${t('fat')} ${fmtInt(meal.f)} ${t('grams')}</span>
      <button class="link" data-act="m-change" data-slot="${i}">${t('m_change')}</button></div>
    ${recipeTags(r) ? `<p class="tags">${esc(recipeTags(r))}</p>` : ''}
  </article>`;
}

function totalBar(label, value, target, unit, color) {
  const pct = target ? Math.min(100, (value / target) * 100) : 0;
  return `<div class="tot"><div class="tot-top"><span>${label}</span><b>${fmtInt(value)} <small>${t('m_of', { target: `${fmtInt(target)} ${unit}` })}</small></b></div>
    <div class="tbar" style="--c:${color}"><i style="width:${pct}%"></i></div></div>`;
}

function viewPlan() {
  const M = S.meals, tg = calcTargets(M.profile);
  const d = nav.mday == null ? todayIdx() : nav.mday;
  const day = sizeDay(M.plan[d] || [], M.profile, M.prefs);
  const gap = day.meals.every(Boolean) ? calorieShortfall(day.total, tg) : 0;
  const notes = [tg.floorApplied && t('m_floor'), tg.minorAdjusted && t('m_minor'), tg.basisAdjusted && t('m_basis_cap'), M.prefs.count <= 2 && t('m_few_note')].filter(Boolean);
  const goalLabel = t('goal_' + tg.goal);
  return `<h1 class="screen-title">${t('m_your_menu')}</h1>
    <p class="sub plan-basis">${t('m_basis', { w: M.profile.w, h: M.profile.h, goal: goalLabel })} ${t(M.mode === 'auto' ? 'm_mode_auto' : 'm_mode_manual')}.</p>
    <section class="targets" aria-label="${t('m_target')}">
      <div class="stat"><small>${t('kcal')}</small><strong>${fmtInt(tg.kcal)} <em>${t('kcalUnit')}</em></strong></div>
      <div class="stat"><small>${t('protein')}</small><strong>${tg.protein} <em>${t('grams')}</em></strong></div>
    </section>
    ${notes.map(n => `<p class="fine">${n}</p>`).join('')}
    <div class="chips days" role="group" aria-label="${t('m_day_aria')}">${Array.from({ length: 7 }, (_, i) =>
      `<button class="chip" aria-pressed="${i === d}" data-act="m-day" data-i="${i}">${planDayLabel(i)}</button>`).join('')}</div>
    ${day.slots.map((slot, i) => mealCard(slot, day.meals[i], i)).join('')}
    <section class="totals"><h2 class="section-title">${t('m_total')}</h2>
      ${totalBar(t('kcal'), day.total.kcal, tg.kcal, t('kcalUnit'), 'var(--blue)')}
      ${totalBar(t('protein'), day.total.p, tg.protein, t('grams'), 'var(--green)')}
      <p class="sub">${t('carbs')} ${fmtInt(day.total.c)} ${t('grams')} · ${t('fat')} ${fmtInt(day.total.f)} ${t('grams')}</p>
    </section>
    ${gap ? `<p class="fine warn">${t('m_short', { pct: Math.round(gap * 100) })}</p>` : ''}
    <p class="fine">${t('m_weights')}</p>
    <div class="plan-actions">
      <button class="link" data-act="m-edit">${t('m_edit')}</button>
      ${M.mode === 'auto' ? `<button class="link" data-act="m-regen">${t('m_regen')}</button>` : ''}
      <button class="link" data-act="m-reset">${t('m_reset')}</button>
    </div>
    <p class="fine">${t('m_fine')}</p>`;
}

/* ---------- Meal picker (bottom sheet) ---------- */
function openMealPicker(slotIdx) {
  const M = S.meals, d = nav.mday == null ? todayIdx() : nav.mday;
  const s = slotTargets(calcTargets(M.profile), M.prefs.count)[slotIdx];
  const current = (M.plan[d] || [])[slotIdx];
  const pool = M.mode === 'auto' ? eligibleRecipes(M.prefs, s.types) : RECIPES.filter(r => s.types.includes(r.slot));
  const rows = pool
    .map(r => ({ r, sz: scaleRecipe(r, s.kcal, s.protein, M.prefs.veg === 'no') }))
    .sort((a, b) => fitError(a.sz, s) - fitError(b.sz, s));
  nav.pick = { d, slot: slotIdx };
  const sh = $('#sheet');
  sh.innerHTML = `<div class="sheet-inner">
    <div class="topbar"><span></span><button class="close" data-act="close-sheet" aria-label="${t('close')}">${I.close}</button></div>
    <h1>${t('m_pick', { slot: t('slot_' + s.key) })}</h1>
    <p class="sub">${t('m_aim', { kcal: fmtInt(s.kcal), p: s.protein })}</p>
    ${current ? `<button class="link" data-act="m-remove">${t('m_remove')}</button>` : ''}
    ${rows.length ? `<div class="picks">${rows.map(({ r, sz }) => `
      <button class="pick" aria-pressed="${r.id === current}" data-act="m-pick" data-id="${r.id}">
        <b>${esc(recipeName(r))}</b>
        <span class="sub">${t('m_fits', { kcal: fmtInt(sz.kcal), p: fmtInt(sz.p) })}</span>
        ${recipeTags(r) ? `<span class="tags">${esc(recipeTags(r))}</span>` : ''}
      </button>`).join('')}</div>` : `<p class="empty">${t('m_none')}</p>`}
  </div>`;
  sh.hidden = false; sh.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function setPlanSlot(slot, id) {
  const M = S.meals, d = nav.pick.d;
  const plan = M.plan.map((row, i) => (i === d ? row.map((x, j) => (j === slot ? id : x)) : row));
  S.meals = { ...M, plan };
  save(); closeSheet(); nav.pick = null; render();
}

/* ---------- Wizard flow ---------- */
function finishWizard() {
  const { mode, draft } = nav.m, prev = S.meals || {};
  const profile = readProfile(draft.profile);
  const prefs = mode === 'auto' ? { ...draft.prefs } : { ...DEFAULT_PREFS, count: draft.prefs.count };
  const seed = prev.seed || 0;
  const keepPlan = mode === 'manual' && prev.mode === 'manual' && prev.plan && prev.plan[0].length === MEAL_PLANS[prefs.count].length;
  const plan = mode === 'auto' ? generatePlan(profile, prefs, seed) : keepPlan ? prev.plan : emptyPlan(prefs.count);
  S.meals = { mode, profile, prefs, plan, seed };
  nav.m = null; nav.mday = todayIdx();
  save(); render(); window.scrollTo(0, 0);
}

function wizardNext() {
  const w = nav.m, steps = stepsOf(w);
  if (steps[w.step] === 'body') {
    const err = validateProfile(readProfile(w.draft.profile));
    if (err) { toast(t(err)); return; }
  }
  if (w.step === steps.length - 1) { finishWizard(); return; }
  w.step += 1; render(); window.scrollTo(0, 0);
}

function wizardBack() {
  const w = nav.m;
  if (w.step === 0) nav.m = null; else w.step -= 1;
  render(); window.scrollTo(0, 0);
}

function setOption(k, v) {
  const d = nav.m.draft;
  if (k === 'sex') d.profile.sex = v;
  else d[OPTION_OWNER[k]][k] = k === 'count' ? +v : v;
  render();
}

function toggleAllergy(v) {
  const prefs = nav.m.draft.prefs;
  prefs.allergies = !v ? [] : prefs.allergies.includes(v) ? prefs.allergies.filter(a => a !== v) : [...prefs.allergies, v];
  render();
}

function mealsInput(inp) {
  if (nav.m) nav.m.draft.profile[inp.dataset.mf] = inp.value.trim();
}

function mealsAction(a, b) {
  switch (a) {
    case 'm-start': nav.m = newWizard(b.dataset.mode); render(); window.scrollTo(0, 0); break;
    case 'm-opt': setOption(b.dataset.k, b.dataset.v); break;
    case 'm-allergy': toggleAllergy(b.dataset.v); break;
    case 'm-next': wizardNext(); break;
    case 'm-back': wizardBack(); break;
    case 'm-day': nav.mday = +b.dataset.i; render(); break;
    case 'm-change': openMealPicker(+b.dataset.slot); break;
    case 'm-pick': setPlanSlot(nav.pick.slot, b.dataset.id); break;
    case 'm-remove': setPlanSlot(nav.pick.slot, null); break;
    case 'm-edit': nav.m = newWizard(S.meals.mode); render(); window.scrollTo(0, 0); break;
    case 'm-regen': {
      if (!confirm(t('c_regen'))) return;
      const seed = (S.meals.seed || 0) + 1;
      S.meals = { ...S.meals, seed, plan: generatePlan(S.meals.profile, S.meals.prefs, seed) };
      save(); render(); break;
    }
    case 'm-reset':
      if (!confirm(t('c_reset'))) return;
      S.meals = { ...S.meals, mode: null, plan: null };
      save(); render(); break;
  }
}
