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
    burpee: {
      name: 'Burpee', cat: 'kardio', equip: 'Tanpa alat', bw: true,
      muscles: ['Seluruh tubuh', 'Dada', 'Paha depan', 'Core'],
      steps: [
        'Berdiri tegak dengan kaki selebar bahu.',
        'Turun ke posisi jongkok dan letakkan kedua tangan di lantai di depan kaki.',
        'Lompatkan atau langkahkan kedua kaki ke belakang sampai posisi plank tinggi.',
        'Kembalikan kaki ke arah tangan, lalu berdiri. Tambahkan lompatan kecil di atas kalau mau lebih berat.',
      ],
      avoid: ['Pinggul turun saat di posisi plank.', 'Punggung membulat saat berdiri.'],
      note: 'Belum kuat? Langkahkan kaki satu per satu dan tanpa lompat.',
      anim: {
        dur: 3200,
        anchor: { joint: 'ankle', x: 70, y: A },
        poses: [
          { t: 180, ua: 5, fa: 5, th: 0, sh: 0, ft: 90 }, // standing
          { t: 130, ua: 15, fa: 15, th: 95, sh: -50, ft: 90 }, // squat, hands on the floor
          { t: 111, ua: 0, fa: 0, th: -69, sh: -69, ft: 15, x: -77.6, y: -9.6 }, // feet back, high plank (hands stay where they were)
        ],
      },
    },
    thruster: {
      name: 'Dumbbell Thruster', cat: 'kardio', equip: 'Dumbbell', bw: false,
      muscles: ['Paha depan', 'Bokong', 'Bahu', 'Core'],
      steps: [
        'Pegang satu dumbbell di tiap tangan setinggi bahu. Kaki selebar bahu.',
        'Turun ke posisi squat dengan dada tegak sampai paha sejajar lantai.',
        'Dorong lantai dengan kuat dan, sambil berdiri, dorong kedua dumbbell lurus ke atas kepala dalam satu gerakan.',
        'Turunkan dumbbell ke bahu sambil langsung turun ke squat berikutnya.',
      ],
      avoid: ['Berdiri dulu baru menekan. Gerakannya harus satu aliran.', 'Punggung melengkung ke belakang saat menekan.'],
      note: 'Pakai beban ringan sampai gerakannya lancar.',
      anim: {
        dur: 2400, still: 0,
        anchor: { joint: 'ankle', x: 108, y: A },
        poses: [
          { t: 140, ua: 25, fa: 150, th: 84, sh: -28 },
          { t: 180, ua: 178, fa: 180, th: 0, sh: 0 },
        ],
        props: [{ type: 'db', at: 'hand' }],
      },
    },
    dbswing: {
      name: 'Dumbbell Swing', cat: 'kardio', equip: 'Dumbbell atau kettlebell', bw: false,
      muscles: ['Bokong', 'Paha belakang', 'Punggung bawah', 'Bahu'],
      steps: [
        'Berdiri selebar bahu, pegang satu dumbbell dengan dua tangan di depan paha.',
        'Bungkuk dari pinggul, dorong pinggul ke belakang, dan ayunkan dumbbell ke antara kaki.',
        'Dorong pinggul ke depan dengan kuat sampai berdiri tegak. Dumbbell terayun ke depan setinggi dada oleh dorongan pinggul, bukan diangkat lengan.',
        'Biarkan dumbbell jatuh kembali dan ulangi dengan ritme tetap.',
      ],
      avoid: ['Mengangkat dumbbell dengan lengan.', 'Punggung membulat saat membungkuk.', 'Menekuk lutut sampai seperti squat.'],
      anim: {
        dur: 1900,
        anchor: { joint: 'ankle', x: 112, y: A },
        poses: [
          { t: 125, ua: -20, fa: -35, th: 40, sh: -12 },
          { t: 178, ua: 88, fa: 88, th: 4, sh: 0 },
        ],
        props: [{ type: 'db', at: 'hand' }],
      },
    },
    ballslam: {
      name: 'Ball Slam', cat: 'kardio', equip: 'Medicine ball (slam ball)', bw: false,
      muscles: ['Core', 'Bahu', 'Punggung atas', 'Paha depan'],
      steps: [
        'Pegang slam ball setinggi dada, kaki selebar bahu.',
        'Angkat bola tinggi ke atas kepala sambil berjinjit dan regangkan badan.',
        'Banting bola ke lantai sekuat tenaga di depan kaki sambil menurunkan badan dan menekuk pinggul.',
        'Ambil bola kembali dengan punggung lurus dan ulangi.',
      ],
      avoid: ['Hanya melempar dengan lengan tanpa memakai badan.', 'Punggung membulat saat mengambil bola.'],
      note: 'Pakai slam ball (tidak memantul) dan beri jarak dari orang lain.',
      anim: {
        dur: 1800, still: 0,
        anchor: { joint: 'ankle', x: 108, y: A },
        poses: [
          { t: 180, ua: 175, fa: 178, th: 0, sh: 0, ft: 75 },
          { t: 130, ua: 30, fa: 30, th: 95, sh: -50 },
        ],
        props: [{ type: 'db', at: 'hand', r: 9 }],
      },
    },
    treadmill: {
      name: 'Treadmill Intervals', cat: 'kardio', equip: 'Treadmill', bw: true, timed: true,
      muscles: ['Paha depan', 'Betis', 'Paru-paru dan jantung'],
      steps: [
        'Pemanasan 3–5 menit dengan berjalan cepat di treadmill.',
        'Naikkan kecepatan sampai berlari cepat selama waktu interval (misalnya 30 detik), yang terasa berat tapi masih terkendali.',
        'Turunkan ke kecepatan jalan sampai napas pulih, lalu ulangi.',
        'Berlarilah tegak dengan langkah ringan dan tangan mengayun santai.',
      ],
      avoid: ['Berpegangan pada pegangan treadmill saat berlari.', 'Melompat naik atau turun saat sabuk masih berjalan cepat.'],
      note: 'Belum biasa berlari? Ganti dengan jalan cepat di tanjakan (incline) 6–10%.',
      anim: {
        dur: 1100,
        anchor: { joint: 'hip', x: 112, y: 95 },
        statics: [{ type: 'treadmill', x1: 40, x2: 190, y: GROUND - 14 }],
        poses: [
          { t: 172, ...RUN_ARM_BACK, ua2: RUN_ARM_FWD.ua, fa2: RUN_ARM_FWD.fa, th: 60, sh: 10, ft: 60, th2: -30, sh2: -35, ft2: 40 },
          { t: 172, ua: RUN_ARM_FWD.ua, fa: RUN_ARM_FWD.fa, ua2: RUN_ARM_BACK.ua, fa2: RUN_ARM_BACK.fa, th: -30, sh: -35, ft: 40, th2: 60, sh2: 10, ft2: 60 },
        ],
      },
    },
  };
}

/* Two fat-loss programs, three days a week each: one with no equipment at all, one for the gym. */
const FATLOSS_PROGRAM = {
  id: 'fatloss', name: 'Bakar Lemak: Tanpa Alat', freq: 3, level: 'Semua level',
  desc: 'Tanpa alat sama sekali, bisa di rumah. Tiga hari seminggu: sirkuit seluruh tubuh, kardio dan perut, lalu sirkuit kaki. Istirahat singkat (30–45 detik) supaya detak jantung tetap tinggi. Padukan dengan menu di tab Makan dan jalan kaki setiap hari.',
  days: [
    { name: 'Burn A', items: [['airsquat', 3, '15'], ['pushup', 3, 'max'], ['burpee', 3, '8'], ['jumpingjack', 3, '40', 'sec'], ['plank', 3, '30', 'sec']] },
    { name: 'Burn B', items: [['squatjump', 3, '12'], ['mountainclimber', 3, '30', 'sec'], ['highknees', 3, '30', 'sec'], ['legraise', 3, '12'], ['crunch', 3, '15']] },
    { name: 'Burn C', items: [['lunge', 3, '10', 'repLeg'], ['bridge', 3, '15'], ['calf', 3, '20'], ['buttkick', 3, '30', 'sec'], ['plank', 3, '30', 'sec']] },
  ],
};

const FATLOSS_GYM_PROGRAM = {
  id: 'fatlossgym', name: 'Bakar Lemak: Gym', freq: 3, level: 'Semua level',
  desc: 'Tiga hari seminggu di gym: badan bawah, badan atas, lalu sirkuit seluruh tubuh. Pakai beban sedang (10–15 repetisi, sisakan 2 repetisi sebelum gagal), istirahat singkat (45–60 detik), dan tutup dengan latihan kardio. Tambahkan jalan kaki 20–30 menit di hari lain.',
  days: [
    { name: 'Gym A', items: [['squat', 3, '10'], ['rdl', 3, '12'], ['stepup', 3, '10', 'repLeg'], ['calf', 3, '15'], ['treadmill', 5, '30', 'sec']] },
    { name: 'Gym B', items: [['bench', 3, '10'], ['row', 3, '10'], ['ohp', 3, '10'], ['pullup', 3, 'max'], ['ballslam', 3, '12']] },
    { name: 'Gym C', items: [['deadlift', 3, '8'], ['thruster', 3, '12'], ['dbswing', 3, '15'], ['plank', 3, '40', 'sec'], ['treadmill', 6, '30', 'sec']] },
  ],
};
