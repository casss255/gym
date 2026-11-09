# Gym Program (PWA)

A gym program app for iPhone: animated exercise demos, weight and rep logging, rest timer, and workout history. All files total less than 100 KB.

## Upload to GitHub Pages

1. Create a new GitHub repository, for example `gym`, set to **Public**.
2. Click **Add file → Upload files**, then upload every file in this folder (index.html, sw.js, manifest.webmanifest, and the 3 PNG files). Click **Commit changes**.
3. Open **Settings → Pages**. Under *Branch*, select `main` and the `/ (root)` folder, then **Save**.
4. Wait 1–2 minutes. The app address is `https://USERNAME.github.io/gym/`

## Install on iPhone

1. Open the address above in **Safari**.
2. Tap the **Share** button, then **Add to Home Screen**.
3. Launch the app from its Home Screen icon. After opening it once while online, the app keeps working offline.

## Updating the app

Edit `index.html`, then bump the version in `sw.js` (for example `gym-v1` to `gym-v2`). Upload both files again. On the iPhone, close and reopen the app 1–2 times.

## Notes

- Workout data is stored on each iPhone. Removing the icon from the Home Screen also deletes the data.
- The timer sound is not audible when the iPhone is in silent mode.
- Programs and exercises can be edited in the `EX` and `PROGRAMS` sections inside `index.html`.
