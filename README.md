# Gym Program (PWA)

A gym app for iPhone: animated exercise demos, weight and rep logging, rest timer, workout history, and a daily meal plan with calories and protein. English and Bahasa Indonesia. Everything runs on the phone, with no account and no server.

## Features

- **Programs and exercises**: five programs and 24 animated exercises with step-by-step instructions, including a **Fat Loss Circuit** (three days a week: a full-body circuit, a cardio and core day, and a legs circuit) built from cardio moves like jumping jacks, high knees, mountain climbers and step-ups.
- **Workout logger**: weight and reps per set, rest timer, personal bests, history.
- **Languages**: switch between English (EN) and Bahasa Indonesia (ID) with the toggle at the top of the main screens. The app picks your phone's language the first time.
- **Meals tab**: a daily menu where every meal shows calories and protein, with portions sized to your bodyweight and height.
  - **Set it up for me**: answer a few questions (body, goal, activity, diet, vegetables, allergies, food style, meals per day) and get a 7-day menu. Choose 1 to 5 meals a day: 1 meal is served as three plates in one sitting, 2 meals are two big meals, and 4 or 5 add snacks.
  - **I will build it myself**: pick your own meal for every slot. Portions are still sized for you.

### How the meal portions are worked out

1. Daily calories come from the Mifflin-St Jeor estimate (age, sex, height, weight), times an activity factor, then adjusted for the goal (about 20% less to lose fat, 10% more to build muscle).
2. Protein is 1.6 to 2.0 g per kg of bodyweight depending on the goal. For very heavy people it uses a height-based weight, so the target stays sensible.
3. Each meal gets a share of the day (for example 28% breakfast, 38% lunch, 34% dinner). Every recipe is scaled up or down so that meal hits its calories and protein, and amounts are rounded to weights and counts you can actually use (grams, eggs, slices).
4. Nothing leaves your phone. These are estimates, not medical advice. Under 18, pregnant, or with a medical condition? Check with a doctor or dietitian first.

No pork is used in any menu. Amounts are cooked weights, except oats and whey protein (dry).

## Upload to GitHub Pages

1. Create a new GitHub repository, for example `gym`, set to **Public**.
2. Upload every file in this folder (`index.html`, `sw.js`, `manifest.webmanifest`, `features.css`, all `.js` files, and the 3 PNG files). Commit.
3. Open **Settings → Pages**. Under *Branch*, select `main` and the `/ (root)` folder, then **Save**.
4. Wait 1–2 minutes. The app address is `https://USERNAME.github.io/gym/`

## Install on iPhone

1. Open the address above in **Safari**.
2. Tap the **Share** button, then **Add to Home Screen**.
3. Launch the app from its Home Screen icon. After opening it once while online, the app keeps working offline.

## Updating the app

Whenever you change any app file (`index.html`, `*.js`, `features.css`), bump the version in `sw.js` (for example `gym-v2` to `gym-v3`) and commit both. If you add a new file, add it to the `SHELL` list in `sw.js` too. On the iPhone, close and reopen the app 1–2 times.

## Tests

The meal logic (targets, portion scaling, diet and allergy filtering, plan generation) and the exercise animations (every pose must stand on the floor or a step) have tests:

```
node --test tests/*.test.js
```

## Notes

- Workout data and your menu are stored on each iPhone. Removing the icon from the Home Screen also deletes the data.
- The timer sound is not audible when the iPhone is in silent mode.
- Programs and exercises can be edited in the `EX` and `PROGRAMS` sections inside `index.html`. The cardio exercises and the Fat Loss Circuit are in `cardio.js`. English text for all of them lives in `i18n-ex.js`.
- An exercise is two or more keyframe poses (joint angles) that the stick figure moves between. `y` lifts the whole body for jumps.
- Recipes and ingredients (with calories and protein per 100 g) are in `meals-data.js`.
