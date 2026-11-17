# EDUARD.OS — Updated Portfolio

## Run on Windows
1. Extract the ZIP.
2. Open the `eduard-os` folder in VS Code.
3. Open Terminal and run `npm install` (requires Node.js).
4. Run `npm run dev`, then open the local URL shown.

You can also double-click `START_WINDOWS.bat` if Node.js is installed.

## Edit your information
- `src/data.js` — profile, project order, project details, certification URLs and skills.
- `public/project-*.png` — project mockups.
- `public/badges/` — badge graphics. The included graphics are **custom placeholders**, not official badge assets. Replace them with your real downloaded issuer badges and adjust the `image` path in `src/data.js` if necessary.
- `src/main.jsx` — page and interaction code.
- `src/style.css` — design and responsive styling.

Add a new project at the **top** of the `projects` array to display it first in the carousel. The arrows, dots, and touch swipe work automatically.

ECHO is a locally scripted portfolio guide, not an external AI model. No API key required.
