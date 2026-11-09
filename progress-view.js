/* ---------- Progress tab: weekly check-in form, charts and history ----------
   Uses globals from index.html (S, nav, render, save, toast, esc, num, I) and progress.js. */
const CHART_BOX = { w: 340, h: 190, left: 42, right: 16, top: 18, bottom: 30 };
const MEASURES = [
  { key: 'w', title: 'p_chart_weight', unit: 'kg', color: 'var(--blue)', input: 'p_weight' },
  { key: 'waist', title: 'p_chart_waist', unit: 'cm', color: 'var(--orange)', input: 'p_waist' },
];

const fmt1 = n => n.toLocaleString(locale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const signed = n => (n > 0 ? '+' : n < 0 ? '−' : '') + fmt1(Math.abs(n));
function fmtDate(ymd, withYear) {
  const [y, m, d] = ymd.split('-').map(Number);
  return `${d} ${monthShort(m - 1)}${withYear ? ` ${y}` : ''}`;
}
const checkins = () => (S.progress && S.progress.entries) || [];

function progressDraft() {
  if (!nav.pd) nav.pd = { date: todayStr(), w: '', waist: '', sync: true };
  return nav.pd;
}

/* The red dot on the tab: only once the person has started, and a week has passed. */
const checkinDue = () => checkins().length > 0 && weekStatus(checkins(), todayStr()).due;

/* ---------- Screens ---------- */
function statusCard(st) {
  if (!st.count) return `<div class="status due"><b>${t('p_first')}</b><span class="sub">${t('p_first_sub')}</span></div>`;
  if (st.due) return `<div class="status due"><b>${t('p_due')}</b><span class="sub">${t('p_due_sub', { n: st.daysSince })}</span></div>`;
  return `<div class="status ok"><b>${esc(t('p_next', { date: fmtDate(st.nextDate, false) }))}</b><span class="sub">${t('p_ok_sub')}</span></div>`;
}

/* The box showing what was recorded last time, for the date currently chosen in the form. */
function previousBox(prev) {
  if (!prev) return `<p class="fine prev-none">${t('p_prev_none')}</p>`;
  const item = (title, value, unit) => `<span><small>${t(title)}</small><b>${fmt1(value)}</b> ${unit}</span>`;
  return `<div class="prev"><span class="prev-label">${t('p_prev')} · ${fmtDate(prev.date, true)}</span>
    <div class="prev-vals">${item('p_chart_weight', prev.w, 'kg')}${item('p_chart_waist', prev.waist, 'cm')}</div></div>`;
}

/* Live change against the previous check-in while typing, only once the number is plausible. */
function deltaText(prev, d, m) {
  const v = num(d[m.key]);
  if (!prev || !(v >= CHECKIN_LIMITS[m.key][0])) return '';
  const diff = Math.round((v - prev[m.key]) * 10) / 10;
  return diff === 0 ? t('p_same_prev') : `${signed(diff)} ${m.unit} ${t('p_vs_last')}`;
}

function checkinForm(entries) {
  const d = progressDraft(), prev = previousCheckin(entries, d.date);
  const meals = S.meals && S.meals.profile;
  const field = m => `<label class="field"><span>${t(m.input)}</span>
    <input inputmode="decimal" data-pf="${m.key}" value="${esc(d[m.key])}" autocomplete="off">
    <em class="delta" data-delta="${m.key}" aria-live="polite">${esc(deltaText(prev, d, m))}</em></label>`;
  return `<section class="checkin"><h2 class="section-title">${t('p_form')}</h2>
    <div id="prev-slot">${previousBox(prev)}</div>
    <label class="field"><span>${t('p_date')}</span><input type="date" data-pf="date" value="${esc(d.date)}" max="${todayStr()}"></label>
    ${MEASURES.map(field).join('')}
    <p class="fine">${t('p_tip')}</p>
    ${meals ? `<label class="check"><input type="checkbox" data-pf="sync" ${d.sync ? 'checked' : ''}><span>${t('p_sync')}</span></label>` : ''}
    <button class="btn" data-act="p-save">${t('p_save')}</button></section>`;
}

function chartSvg(model, m, entries, s) {
  const { plot } = model, last = model.points.length - 1, many = model.points.length > 1;
  const grid = model.ticks.map(k => `<line class="c-grid" x1="${plot.x0}" x2="${plot.x1}" y1="${k.y.toFixed(1)}" y2="${k.y.toFixed(1)}"/>`
    + `<text class="c-axis" x="${plot.x0 - 6}" y="${(k.y + 4).toFixed(1)}" text-anchor="end">${fmt1(k.value)}</text>`).join('');
  const base = many ? `<line class="c-base" x1="${plot.x0}" x2="${plot.x1}" y1="${model.baselineY.toFixed(1)}" y2="${model.baselineY.toFixed(1)}"/>` : '';
  const line = `<polyline class="c-line" points="${model.line.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}"/>`;
  const dots = model.points.map((p, i) => `<circle class="c-dot${i === 0 || i === last ? ' end' : ''}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${i === 0 || i === last ? 5.5 : 4}"/>`).join('');
  const valueLabel = (p, anchor) => `<text class="c-val" x="${p.x.toFixed(1)}" y="${(p.y - 11).toFixed(1)}" text-anchor="${anchor}">${fmt1(p.value)}</text>`;
  const values = valueLabel(model.points[0], 'start') + (many ? valueLabel(model.points[last], 'end') : '');
  const dates = many
    ? `<text class="c-axis" x="${plot.x0}" y="${plot.y1 + 20}" text-anchor="start">${fmtDate(entries[0].date, true)}</text><text class="c-axis" x="${plot.x1}" y="${plot.y1 + 20}" text-anchor="end">${fmtDate(entries[last].date, true)}</text>`
    : `<text class="c-axis" x="${plot.x0}" y="${plot.y1 + 20}" text-anchor="start">${fmtDate(entries[0].date, true)}</text>`;
  const name = t(m.title);
  const label = many
    ? t('p_chart_aria', { name, a: fmt1(s.first), b: fmt1(s.last), unit: m.unit, d1: fmtDate(entries[0].date, true), d2: fmtDate(entries[last].date, true) })
    : t('p_chart_aria_one', { name, a: fmt1(s.first), unit: m.unit, d1: fmtDate(entries[0].date, true) });
  return `<svg viewBox="0 0 ${CHART_BOX.w} ${CHART_BOX.h}" style="--c:${m.color}" role="img" aria-label="${esc(label)}">${grid}${base}${line}${dots}${values}${dates}</svg>`;
}

function chartCard(entries, m) {
  const s = summarize(entries, m.key), model = chartModel(entries, m.key, CHART_BOX);
  let delta = t('p_need2');
  if (entries.length > 1) {
    delta = s.change === 0 ? t('p_nochange') : `${signed(s.change)} ${m.unit} (${signed(Math.round(s.pct * 10) / 10)}%) ${t('p_since')}`;
  }
  return `<article class="chart"><div class="chart-top"><h3>${t(m.title)}</h3><span class="chart-now"><b>${fmt1(s.last)}</b> ${m.unit}</span></div>
    <p class="sub chart-delta">${esc(delta)}</p>
    ${chartSvg(model, m, entries, s)}
    <div class="chart-foot"><span>${t('p_start')} ${fmt1(s.first)} ${m.unit}</span><span>${t('p_now')} ${fmt1(s.last)} ${m.unit}</span></div></article>`;
}

function entryList(entries) {
  const newestFirst = [...entries].reverse();
  return `<h2 class="section-title">${t('p_history')}</h2><ul class="entries">${newestFirst.map((e, i) => {
    const prev = newestFirst[i + 1];
    const diff = prev ? `<span class="sub">${signed(e.w - prev.w)} kg · ${signed(e.waist - prev.waist)} cm ${t('p_vs_prev')}</span>` : '';
    return `<li class="entry"><span class="entry-date">${fmtDate(e.date, true)}</span>
      <span class="entry-vals"><b>${fmt1(e.w)}</b> kg · <b>${fmt1(e.waist)}</b> cm</span>
      ${diff}<button class="del" data-act="p-del" data-date="${e.date}">${t('p_del')}</button></li>`;
  }).join('')}</ul>`;
}

function viewProgress() {
  const entries = checkins();
  return `<h1 class="screen-title">${t('p_title')}</h1>
    ${statusCard(weekStatus(entries, todayStr()))}
    ${checkinForm(entries)}
    ${entries.length ? MEASURES.map(m => chartCard(entries, m)).join('') + entryList(entries) : ''}`;
}

/* ---------- Actions ---------- */
function saveCheckin() {
  const d = progressDraft(), entry = { date: d.date, w: num(d.w), waist: num(d.waist) };
  const err = validateCheckin(entry, todayStr());
  if (err) { toast(t(err)); return; }
  const prev = checkins();
  const isNewest = !prev.length || entry.date >= prev[prev.length - 1].date;
  const replaced = prev.some(e => e.date === entry.date);
  S.progress = { entries: upsertCheckin(prev, entry) };
  // Meal portions are sized to bodyweight, so keep the Meals plan in step with the newest weight.
  const profile = S.meals && S.meals.profile;
  if (d.sync && isNewest && profile && validateProfile({ ...profile, w: entry.w }) === null) {
    S.meals = { ...S.meals, profile: { ...profile, w: entry.w } };
  }
  nav.pd = null;
  save(); render();
  toast(t(replaced ? 'p_updated' : 'p_saved'));
}

/* Update the Previous box and live changes in place. A full re-render would close the date picker mid-wheel. */
function refreshPreview() {
  const d = progressDraft(), prev = previousCheckin(checkins(), d.date);
  const slot = document.querySelector('#prev-slot');
  if (slot) slot.innerHTML = previousBox(prev);
  MEASURES.forEach(m => {
    const delta = document.querySelector(`[data-delta="${m.key}"]`);
    if (delta) delta.textContent = deltaText(prev, d, m);
  });
}

function progressInput(inp) {
  progressDraft()[inp.dataset.pf] = inp.type === 'checkbox' ? inp.checked : inp.value.trim();
  refreshPreview();
}

function progressAction(a, b) {
  if (a === 'p-save') saveCheckin();
  if (a === 'p-del') {
    if (!confirm(t('p_cdel'))) return;
    S.progress = { entries: removeCheckin(checkins(), b.dataset.date) };
    save(); render();
  }
}
