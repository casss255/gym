/* ---------- Cardio exercises and the weight-loss program ----------
   Same format as the exercises in index.html: two keyframe poses the figure moves between.
   Angles are degrees measured from straight down (0 = down, 90 = forward, 180 = up).
   y shifts the whole body (negative = up) for jumps. The text here is Indonesian, English is in i18n-ex.js. */
const CARDIO_CAT = { name: 'Kardio', color: 'var(--orange)' };

function cardioExercises(GROUND, A) {
  const RUN_ARM_FWD = { ua: 40, fa: 140 }; // elbow bent, hand up in front
  const RUN_ARM_BACK = { ua: -45, fa: 20 };
  // mountain climber legs: trailing straight behind (as in the push-up), heel folded up mid-swing, knee driven in
  const LEG_BACK = { th: -69, sh: -69, ft: 15 };
  const LEG_MID = { th: 5, sh: -125, ft: 30 };
  const LEG_KNEE = { th: 75, sh: -55, ft: 50 };
  const climber = (near, far) => ({ t: 111, ua: 0, fa: 0, ...near, th2: far.th, sh2: far.sh, ft2: far.ft });
  return {
    jumpingjack: {
      name: 'Jumping Jacks', cat: 'kardio', equip: 'Tanpa alat', bw: true, timed: true,
      muscles: ['Seluruh tubuh', 'Betis', 'Bahu'],
      steps: [
        'Berdiri tegak, kaki rapat, tangan di samping badan.',
        'Lompat kecil sambil membuka kaki lebih lebar dari bahu dan angkat kedua tangan ke atas kepala.',
        'Lompat lagi untuk kembali ke posisi awal.',
        'Mendarat pelan di bagian depan telapak kaki dan jaga napas tetap teratur.',
      ],
      avoid: ['Mendarat dengan lutut terkunci lurus.', 'Tangan tidak naik sampai atas kepala.'],
      note: 'Lutut atau pergelangan sakit? Langkahkan kaki ke samping bergantian tanpa melompat.',
      anim: {
        view: 'front', dur: 1500,
        anchor: { joint: 'hip', x: 120, y: A - 80 },
        poses: [
          { t: 180, ua: 10, fa: 8, th: 2, sh: 0, ft: 90 },
          { t: 180, ua: 150, fa: 165, th: 20, sh: 18, ft: 90, y: 5 },
        ],
      },
    },
    highknees: {
      name: 'High Knees', cat: 'kardio', equip: 'Tanpa alat', bw: true, timed: true,
      muscles: ['Paha depan', 'Pinggul', 'Core', 'Betis'],
      steps: [
        'Berdiri tegak, kaki selebar pinggul.',
        'Angkat satu lutut setinggi pinggul, lalu turunkan.',
        'Ganti kaki dengan cepat sambil mengayun tangan yang berlawanan seperti berlari.',
        'Mendarat di ujung kaki dan jaga badan tetap tegak.',
      ],
      avoid: ['Badan condong ke belakang.', 'Lutut hanya terangkat setengah.'],
      note: 'Mulai dengan berjalan di tempat sambil mengangkat lutut, lalu naikkan kecepatan pelan-pelan.',
      anim: {
        dur: 1300,
        anchor: { joint: 'hip', x: 112, y: A - 80 },
        poses: [
          { t: 178, ...RUN_ARM_BACK, ua2: RUN_ARM_FWD.ua, fa2: RUN_ARM_FWD.fa, th: 88, sh: 8, ft: 50, th2: 0, sh2: 0, ft2: 90 },
          { t: 178, ua: RUN_ARM_FWD.ua, fa: RUN_ARM_FWD.fa, ua2: RUN_ARM_BACK.ua, fa2: RUN_ARM_BACK.fa, th: 0, sh: 0, ft: 90, th2: 88, sh2: 8, ft2: 50 },
        ],
      },
    },
    buttkick: {
      name: 'Butt Kicks', cat: 'kardio', equip: 'Tanpa alat', bw: true, timed: true,
      muscles: ['Paha belakang', 'Betis', 'Pinggul'],
      steps: [
        'Berdiri tegak, kaki selebar pinggul.',
        'Tendang satu tumit ke arah bokong, lalu turunkan.',
        'Ganti kaki bergantian sambil mengayun tangan seperti berlari di tempat.',
      ],
      avoid: ['Badan condong ke depan.', 'Lutut ikut maju terlalu jauh.'],
      anim: {
        dur: 1300,
        anchor: { joint: 'hip', x: 112, y: A - 80 },
        poses: [
          { t: 178, ...RUN_ARM_BACK, ua2: RUN_ARM_FWD.ua, fa2: RUN_ARM_FWD.fa, th: 12, sh: -150, ft: 20, th2: 0, sh2: 0, ft2: 90 },
          { t: 178, ua: RUN_ARM_FWD.ua, fa: RUN_ARM_FWD.fa, ua2: RUN_ARM_BACK.ua, fa2: RUN_ARM_BACK.fa, th: 0, sh: 0, ft: 90, th2: 12, sh2: -150, ft2: 20 },
        ],
      },
    },
    mountainclimber: {
      name: 'Mountain Climbers', cat: 'kardio', equip: 'Tanpa alat', bw: true, timed: true,
      muscles: ['Core', 'Bahu', 'Paha depan', 'Pinggul'],
      steps: [
        'Mulai di posisi plank tinggi: tangan di bawah bahu, badan lurus dari kepala sampai tumit.',
        'Tarik satu lutut ke arah dada.',
        'Kembalikan kaki itu ke belakang sambil menarik lutut yang satunya, bergantian seperti berlari.',
        'Jaga pinggul tetap rendah dan perut kencang.',
      ],
      avoid: ['Pinggul terangkat tinggi.', 'Pinggul naik-turun mengayun.'],
      note: 'Belum kuat? Lakukan pelan satu per satu, atau tumpukan tangan di bangku.',
      anim: {
        dur: 1400,
        anchor: { joint: 'hip', x: 112, y: 144 },
        poses: [climber(LEG_KNEE, LEG_BACK), climber(LEG_MID, LEG_MID), climber(LEG_BACK, LEG_KNEE)],
      },
    },
    squatjump: {
      name: 'Squat Jump', cat: 'kardio', equip: 'Tanpa alat', bw: true,
      muscles: ['Paha depan', 'Bokong', 'Betis', 'Core'],
      steps: [
        'Berdiri dengan kaki selebar bahu.',
        'Turun ke posisi squat sampai paha hampir sejajar lantai, ayun tangan ke belakang.',
        'Dorong lantai sekuat tenaga dan lompat setinggi mungkin sambil mengayun tangan ke atas.',
        'Mendarat pelan dengan lutut menekuk, lalu langsung turun ke squat berikutnya.',
      ],
      avoid: ['Lutut masuk ke dalam saat mendarat.', 'Mendarat dengan kaki lurus dan keras.'],
      note: 'Gerakan ini berdampak tinggi. Kalau lutut atau pinggang bermasalah, ganti dengan Bodyweight Squat.',
      anim: {
        dur: 1900, airborne: true,
        anchor: { joint: 'ankle', x: 108, y: A },
        poses: [
          { t: 140, ua: -40, fa: -30, th: 84, sh: -28 },
          { t: 180, ua: 170, fa: 175, th: 0, sh: 0, ft: 30, y: -26 },
        ],
      },
    },
    stepup: {
      name: 'Step-up', cat: 'kardio', equip: 'Bangku atau tangga', bw: true,
      muscles: ['Paha depan', 'Bokong'],
      steps: [
        'Berdiri menghadap bangku yang kokoh. Letakkan satu kaki penuh di atas bangku.',
        'Dorong dengan kaki yang di atas bangku sampai berdiri tegak di atasnya, lalu angkat lutut kaki satunya.',
        'Turun perlahan dengan terkontrol. Selesaikan semua repetisi, lalu ganti kaki.',
      ],
      avoid: ['Mendorong dengan kaki yang masih di lantai.', 'Badan condong jauh ke depan.'],
      anim: {
        dur: 2400,
        anchor: { joint: 'ankle', x: 100, y: GROUND - 36 },
        statics: [{ type: 'bench', x1: 84, x2: 150, y: GROUND - 32 }],
        poses: [
          { t: 172, ua: 5, fa: 5, th: 77, sh: -13, ft: 90, th2: 0, sh2: 0, ft2: 90 },
          { t: 180, ua: 5, fa: 5, th: 0, sh: 0, ft: 90, th2: 85, sh2: -5, ft2: 60 },
        ],
      },
    },
    legraise: {
      name: 'Lying Leg Raise', cat: 'perut', equip: 'Tanpa alat', bw: true,
      muscles: ['Perut bawah', 'Pinggul'],
      steps: [
        'Berbaring telentang, kaki lurus, tangan di samping badan.',
        'Kencangkan perut dan tekan punggung bawah ke lantai.',
        'Angkat kedua kaki yang lurus sampai tegak lurus dengan lantai.',
        'Turunkan perlahan sampai hampir menyentuh lantai.',
      ],
      avoid: ['Punggung bawah melengkung dari lantai.', 'Menurunkan kaki terlalu cepat.'],
      note: 'Terlalu berat? Tekuk lutut sedikit.',
      anim: {
        dur: 3000,
        anchor: { joint: 'hip', x: 110, y: GROUND - 8 },
        poses: [
          { t: -90, h: -90, ua: 90, fa: 90, th: 92, sh: 90, ft: 170 },
          { t: -90, h: -90, ua: 90, fa: 90, th: 175, sh: 180, ft: -80 },
        ],
      },
    },
  };
}

/* Three days a week: full-body circuit, cardio and core, legs circuit. */
const FATLOSS_PROGRAM = {
  id: 'fatloss', name: 'Bakar Lemak', freq: 3, level: 'Semua level',
  desc: 'Tiga hari seminggu: sirkuit seluruh tubuh, kardio dan perut, lalu sirkuit kaki. Istirahat singkat (30–45 detik) supaya detak jantung tetap tinggi. Padukan dengan menu di tab Makan dan jalan kaki setiap hari.',
  days: [
    { name: 'Burn A', items: [['airsquat', 3, '15'], ['pushup', 3, 'max'], ['stepup', 3, '10', 'repLeg'], ['jumpingjack', 3, '40', 'sec'], ['plank', 3, '30', 'sec']] },
    { name: 'Burn B', items: [['squatjump', 3, '12'], ['mountainclimber', 3, '30', 'sec'], ['highknees', 3, '30', 'sec'], ['legraise', 3, '12'], ['crunch', 3, '15']] },
    { name: 'Burn C', items: [['lunge', 3, '10', 'repLeg'], ['bridge', 3, '15'], ['calf', 3, '20'], ['buttkick', 3, '30', 'sec'], ['plank', 3, '30', 'sec']] },
  ],
};
