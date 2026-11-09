/* ---------- Language: English / Bahasa Indonesia ---------- */
const LANGS = ['en', 'id'];

function detectLang() {
  const l = String((typeof navigator !== 'undefined' && navigator.language) || '').toLowerCase();
  return l.startsWith('id') ? 'id' : 'en';
}

let currentLang = detectLang();

function setLang(l) {
  currentLang = LANGS.includes(l) ? l : 'en';
  if (typeof document !== 'undefined') document.documentElement.lang = currentLang;
}

const STR = {
  en: {
    navMain: 'Main menu', language: 'Language',
    tabProgram: 'Program', tabMoves: 'Exercises', tabMeals: 'Meals', tabHistory: 'History',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    // home
    inProgress: 'Workout in progress', inProgressMeta: '{prog}. Exercise {n} of {total}: {name}', resume: 'Resume workout',
    nextWorkout: 'Next workout', nextMeta: '{prog}. {n} exercises, about {min} min',
    startDay: 'Start {day}', viewProgram: 'View program contents',
    pickProgram: 'Choose a program', newbieHint: 'New to the gym? Start with Beginner Full Body.',
    allPrograms: 'All programs', yourProgram: 'Your program', perWeek: '{n}× per week, {level}', programBack: 'Programs',
    // library
    exercises: 'Exercises', all: 'All',
    // history
    history: 'History', emptyHistory: 'No workouts logged yet. Finish one and it shows up here.',
    monthWorkouts: 'Workouts this month', monthVolume: 'Total weight this month',
    minSets: '{min} min, {sets} sets', deleteLog: 'Delete this entry',
    // workout
    exOf: 'Exercise {n} of {total}', finish: 'Finish', leaveWorkout: 'Leave workout', howTo: 'How to do it',
    last: 'Last: {sets}', setCol: 'Set', weightCol: 'Weight (kg)', plusWeightCol: '+ Weight (kg)', secCol: 'Sec', repCol: 'Reps',
    weightAria: 'Weight, set {n}', secAria: 'Seconds, set {n}', repAria: 'Reps, set {n}', tickAria: 'Mark set {n} as done',
    addSet: 'Add set', prev: 'Previous', nextEx: 'Next exercise', finishWorkout: 'Finish workout',
    target: '{sets} sets × {reps} {unit}', u_rep: 'reps', u_sec: 'sec', u_repLeg: 'reps/leg', max: 'max', secShort: 'sec', repShort: 'reps',
    // messages
    needSec: 'Enter the seconds first.', needReps: 'Enter the reps first.',
    exDone: 'Exercise done. On to the next one.', allDone: 'All sets done. Tap "Finish workout" to save.', saved: 'Workout saved.',
    cNoSets: 'No sets are ticked yet. Leave without saving?', cUnticked: 'There are still {n} unticked sets. Save the workout now?',
    cReplace: 'A workout is still in progress. Start a new one and discard it?', cQuit: 'Leave and discard this workout? To save it, tap Finish.',
    cDelete: 'Delete this workout entry?',
    // rest timer
    rest: 'Rest', restNow: 'Time for the next set', restDefault: 'Default {n} s', minus15: '−15 s', plus15: '+15 s', skip: 'Skip',
    // exercise sheet
    close: 'Close', muscles: 'Muscles: {list}', best: 'Best', lastStat: 'Last', nSets: '{n} sets', avoid: 'Avoid',
  },
  id: {
    navMain: 'Menu utama', language: 'Bahasa',
    tabProgram: 'Program', tabMoves: 'Gerakan', tabMeals: 'Makan', tabHistory: 'Riwayat',
    days: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    inProgress: 'Latihan sedang berjalan', inProgressMeta: '{prog}. Gerakan {n} dari {total}: {name}', resume: 'Lanjutkan latihan',
    nextWorkout: 'Latihan berikutnya', nextMeta: '{prog}. {n} gerakan, sekitar {min} menit',
    startDay: 'Mulai {day}', viewProgram: 'Lihat isi program',
    pickProgram: 'Pilih program', newbieHint: 'Belum pernah ke gym? Mulai dari Full Body Pemula.',
    allPrograms: 'Semua program', yourProgram: 'Program kamu', perWeek: '{n}× seminggu, {level}', programBack: 'Program',
    exercises: 'Gerakan', all: 'Semua',
    history: 'Riwayat', emptyHistory: 'Belum ada latihan tercatat. Selesaikan satu latihan dan hasilnya muncul di sini.',
    monthWorkouts: 'Latihan bulan ini', monthVolume: 'Total beban bulan ini',
    minSets: '{min} menit, {sets} set', deleteLog: 'Hapus catatan ini',
    exOf: 'Gerakan {n} dari {total}', finish: 'Selesai', leaveWorkout: 'Keluar dari latihan', howTo: 'Cara melakukan',
    last: 'Terakhir: {sets}', setCol: 'Set', weightCol: 'Beban (kg)', plusWeightCol: '+ Beban (kg)', secCol: 'Detik', repCol: 'Rep',
    weightAria: 'Beban set {n}', secAria: 'Detik set {n}', repAria: 'Repetisi set {n}', tickAria: 'Tandai set {n} selesai',
    addSet: 'Tambah set', prev: 'Sebelumnya', nextEx: 'Gerakan berikutnya', finishWorkout: 'Selesai latihan',
    target: '{sets} set × {reps} {unit}', u_rep: 'rep', u_sec: 'detik', u_repLeg: 'rep/kaki', max: 'maks', secShort: 'dtk', repShort: 'rep',
    needSec: 'Isi berapa detik dulu.', needReps: 'Isi jumlah repetisi dulu.',
    exDone: 'Gerakan ini selesai. Lanjut ke gerakan berikutnya.', allDone: 'Semua set selesai. Tekan "Selesai latihan" untuk menyimpan.', saved: 'Latihan tersimpan.',
    cNoSets: 'Belum ada set yang dicentang. Keluar tanpa menyimpan?', cUnticked: 'Masih ada {n} set yang belum dicentang. Simpan latihan sekarang?',
    cReplace: 'Ada latihan yang belum selesai. Mulai baru dan buang yang lama?', cQuit: 'Keluar dan buang latihan ini? Untuk menyimpan, tekan Selesai.',
    cDelete: 'Hapus catatan latihan ini?',
    rest: 'Istirahat', restNow: 'Waktunya set berikutnya', restDefault: 'Default {n} dtk', minus15: '−15 dtk', plus15: '+15 dtk', skip: 'Lewati',
    close: 'Tutup', muscles: 'Otot: {list}', best: 'Terbaik', lastStat: 'Terakhir', nSets: '{n} set', avoid: 'Hindari',
  },
};

/* t('key', { name: value }) -> text in the current language, falling back to English, then to the key. */
function t(key, vars) {
  const s = (STR[currentLang] && STR[currentLang][key]) ?? STR.en[key] ?? key;
  if (!vars || typeof s !== 'string') return s;
  return s.replace(/\{(\w+)\}/g, (m, n) => (n in vars ? vars[n] : m));
}

const locale = () => (currentLang === 'id' ? 'id-ID' : 'en-US');
const dayShort = i => t('days')[i];
const monthShort = i => t('months')[i];

/* EN / ID switch shown at the top of the main screens. */
function langBar() {
  const names = { en: 'English', id: 'Bahasa Indonesia' };
  return `<div class="langbar" role="group" aria-label="${t('language')}">${LANGS.map(l =>
    `<button data-act="lang" data-l="${l}" lang="${l}" aria-pressed="${l === currentLang}" aria-label="${names[l]}">${l.toUpperCase()}</button>`).join('')}</div>`;
}
