/* ---------- English text for exercises and programs ----------
   index.html keeps the original Indonesian text and stable keys (saved history uses the Indonesian day names).
   Needs EX, CATS and PROGRAMS from index.html, but only reads them when called. */
const CAT_EN = { kaki: 'Legs', dorong: 'Push', tarik: 'Pull', perut: 'Core' };
const DAY_EN = { 'Hari A': 'Day A', 'Hari B': 'Day B', 'Sirkuit': 'Circuit' };

const PROG_EN = {
  fullbody: { name: 'Beginner Full Body', level: 'Beginner', desc: 'Three times a week, alternating Day A and Day B. Great for your first 3 months in the gym.' },
  upperlower: { name: 'Upper / Lower', level: 'Intermediate', desc: 'Four times a week: upper body, lower body, rest, repeat.' },
  ppl: { name: 'Push Pull Legs', level: 'Intermediate', desc: 'Push, pull, legs. Run it 3 days a week, or 6 days once you are used to it.' },
  homeworkout: { name: 'No Equipment', level: 'All levels', desc: 'For home or travel. No equipment needed.' },
};

const EX_EN = {
  squat: {
    equip: 'Barbell + rack', muscles: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
    steps: [
      'Rest the barbell on your upper back (not your neck). Feet shoulder-width apart, toes turned slightly out.',
      'Breathe in, brace your abs, then push your hips back and down as if sitting into a chair.',
      'Lower until your thighs are at least parallel to the floor. Your knees track in line with your toes.',
      'Drive through your whole foot to stand back up.',
    ],
    avoid: ['Knees caving in on the way up.', 'Heels lifting off the floor.', 'Lower back rounding at the bottom.'],
  },
  airsquat: {
    equip: 'No equipment', muscles: ['Quads', 'Glutes'],
    steps: [
      'Stand with your feet shoulder-width apart, toes turned slightly out.',
      'Reach your arms forward for balance, then push your hips back and down.',
      'Lower until your thighs are parallel to the floor, keeping your chest up.',
      'Push through the floor and stand back up.',
    ],
    avoid: ['Knees caving in.', 'Heels lifting.', 'Dropping too fast without control.'],
  },
  bench: {
    equip: 'Barbell + bench', muscles: ['Chest', 'Front delts', 'Triceps'],
    steps: [
      'Lie back with your eyes directly under the barbell. Feet flat on the floor.',
      'Grip the bar slightly wider than shoulder-width and pull your shoulder blades together into the bench.',
      'Lower the bar slowly to your lower chest, elbows about 45° from your body.',
      'Press up until your arms are straight.',
    ],
    avoid: ['Elbows flaring out to 90°.', 'Hips lifting off the bench.', 'Bouncing the bar off your chest.'],
    note: 'Use a spotter or safety bars when the weight is heavy.',
  },
  pushup: {
    equip: 'No equipment', muscles: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    steps: [
      'Hands on the floor slightly wider than your shoulders. Body in a straight line from head to heels.',
      'Brace your abs and glutes.',
      'Lower your chest until it almost touches the floor, elbows angled slightly back.',
      'Push the floor away until your arms are straight again.',
    ],
    avoid: ['Hips sagging or piking up.', 'Leading with your head.'],
    note: 'Not strong enough yet? Do them with your knees on the floor.',
  },
  deadlift: {
    equip: 'Barbell', muscles: ['Hamstrings', 'Glutes', 'Lower back', 'Upper back'],
    steps: [
      'Stand with the barbell over the middle of your feet.',
      'Hinge at the hips and grip the bar just outside your shins, then bend your knees until your shins touch the bar.',
      'Straighten your back, lift your chest, breathe in and brace your abs.',
      'Push the floor away until you stand tall, keeping the bar against your legs. Lower in reverse order.',
    ],
    avoid: ['Rounding your back.', 'Letting the bar drift away from your legs.', 'Pulling with your arms instead of driving with your legs.'],
  },
  rdl: {
    equip: 'Barbell or dumbbells', muscles: ['Hamstrings', 'Glutes', 'Lower back'],
    steps: [
      'Stand holding the barbell in front of your thighs, knees slightly bent.',
      'Push your hips back. The bar slides down close to your thighs.',
      'Lower until you feel a stretch in your hamstrings, usually around knee height. Keep your back straight.',
      'Return to standing by driving your hips forward.',
    ],
    avoid: ['Bending your knees so much it turns into a squat.', 'Rounding your back.'],
  },
  row: {
    equip: 'Barbell', muscles: ['Upper back', 'Lats', 'Biceps'],
    steps: [
      'Grip the barbell and hinge at the hips until your torso is about 45° or lower. Knees slightly bent.',
      'Pull the bar to your lower stomach, driving your elbows back.',
      'Squeeze your shoulder blades together at the top.',
      'Lower slowly until your arms are straight.',
    ],
    avoid: ['Swinging your torso up and down.', 'Pulling the bar toward your chest.'],
  },
  ohp: {
    equip: 'Barbell', muscles: ['Shoulders', 'Triceps', 'Core'],
    steps: [
      'Hold the bar at shoulder height with a shoulder-width grip, elbows slightly in front of the bar.',
      'Brace your abs and glutes.',
      'Press straight up. Move your head back slightly so the bar can pass, then push your head forward under the bar.',
      'Lower slowly back to your shoulders.',
    ],
    avoid: ['Leaning back too far.', 'Pressing forward instead of straight up.'],
  },
  pullup: {
    equip: 'Pull-up bar', muscles: ['Lats', 'Upper back', 'Biceps'],
    steps: [
      'Grip the bar slightly wider than your shoulders and hang with straight arms.',
      'Pull your shoulders down first, then pull yourself up until your chin clears the bar.',
      'Lower slowly until your arms are straight again.',
    ],
    avoid: ['Swinging your legs to help.', 'Only doing half reps.'],
    note: 'Can\'t do one yet? Use a resistance band, an assisted pull-up machine, or lat pulldowns.',
  },
  curl: {
    equip: 'Dumbbells', muscles: ['Biceps', 'Forearms'],
    steps: [
      'Stand tall with dumbbells at your sides, palms facing forward.',
      'Keep your elbows against your sides and curl the dumbbells toward your shoulders.',
      'Pause briefly, then lower slowly until your arms are straight.',
    ],
    avoid: ['Swinging your body to lift.', 'Elbows drifting forward.'],
  },
  triceps: {
    equip: 'Dumbbell', muscles: ['Triceps'],
    steps: [
      'Hold one dumbbell with both hands and press it straight overhead.',
      'Keep your elbows pointing up and lower the dumbbell behind your head.',
      'Straighten your arms back up.',
    ],
    avoid: ['Elbows flaring out to the sides.', 'Arching your back.'],
  },
  latraise: {
    equip: 'Dumbbells', muscles: ['Side delts'],
    steps: [
      'Stand tall with dumbbells at your sides, elbows slightly bent.',
      'Raise both dumbbells out to the sides to shoulder height.',
      'Lower slowly.',
    ],
    avoid: ['Using weights so heavy that your body swings.', 'Shrugging your shoulders up to your ears.'],
  },
  lunge: {
    equip: 'No equipment or dumbbells', muscles: ['Quads', 'Glutes'],
    steps: [
      'Step one foot forward. Your back foot rests on its toes.',
      'Lower straight down until both knees are at about 90°.',
      'Your back knee almost touches the floor.',
      'Push through your front foot to stand up. Finish all reps, then switch legs.',
    ],
    avoid: ['Leaning far forward.', 'Front knee caving in.'],
  },
  bridge: {
    equip: 'No equipment', muscles: ['Glutes', 'Hamstrings'],
    steps: [
      'Lie on your back, knees bent, feet flat on the floor hip-width apart.',
      'Brace your abs, press your heels into the floor and lift your hips.',
      'At the top, your shoulders, hips and knees form a straight line. Squeeze your glutes for 1 second.',
      'Lower slowly.',
    ],
    avoid: ['Overarching your lower back at the top.', 'Pushing through your toes instead of your heels.'],
  },
  calf: {
    equip: 'No equipment or dumbbells', muscles: ['Calves'],
    steps: [
      'Stand tall. You can use the edge of a step for a longer range of motion.',
      'Raise your heels as high as you can.',
      'Hold for 1 second at the top, then lower slowly.',
    ],
    avoid: ['Bouncing too quickly.'],
  },
  plank: {
    equip: 'No equipment', muscles: ['Core', 'Shoulders'],
    steps: [
      'Elbows directly under your shoulders, forearms on the floor.',
      'Lift your body, supported on your elbows and toes.',
      'Keep a straight line from head to heels. Brace your abs and glutes.',
      'Hold while breathing normally.',
    ],
    avoid: ['Hips sagging.', 'Hips too high.'],
  },
  crunch: {
    equip: 'No equipment', muscles: ['Abs'],
    steps: [
      'Lie on your back, knees bent, feet flat on the floor.',
      'Brace your abs and lift your head and shoulders off the floor. Reach your hands toward your knees.',
      'Lower slowly.',
    ],
    avoid: ['Pulling on your neck with your hands.', 'Moving too fast.'],
  },
};

const isEn = () => currentLang === 'en';
const catName = k => (isEn() ? CAT_EN[k] : CATS[k].name);
const dayLabel = name => (isEn() && DAY_EN[name]) || name;
const progName = p => (isEn() && PROG_EN[p.id] ? PROG_EN[p.id].name : p.name);
const progLevel = p => (isEn() && PROG_EN[p.id] ? PROG_EN[p.id].level : p.level);
const progDesc = p => (isEn() && PROG_EN[p.id] ? PROG_EN[p.id].desc : p.desc);
/* Exercise record in the current language (name, animation and flags are shared). */
const exInfo = id => (isEn() && EX_EN[id] ? { ...EX[id], ...EX_EN[id] } : EX[id]);
