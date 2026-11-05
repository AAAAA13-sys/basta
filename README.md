# 🧭 Daily Compass

> **The Zero-Overwhelm Cognitive Grounding & Daily Life Cockpit**  
> *Engineered for ADHD, time blindness, executive dysfunction, and sensory sensitivity.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Runtime%20Dependencies-0-success.svg)](package.json)
[![Offline First](https://img.shields.io/badge/Architecture-Local--First%20PWA-brightgreen.svg)](sw.js)
[![Tests Passing](https://img.shields.io/badge/Node.js%20Tests-41%2F41%20Pass-brightgreen.svg)](tests/test_full_suite.js)

---

## 🌟 Overview

Most productivity suites fail the people who need them most. When you live with ADHD, chronic time blindness, executive dysfunction, or sensory overwhelm:
- **Red overdue badges** trigger guilt spirals and app abandonment.
- **Deep multi-screen forms** create cognitive friction and decision paralysis.
- **Jarring klaxon alarms** induce cortisol spikes and panic.
- **Fragmented tools** (separate apps for alarms, habits, spending, notes) force constant context-switching, evaporating your working memory.

**Daily Compass** is an all-in-one cognitive prosthetic and daily life dashboard. Built from the ground up as an unshakeable ground truth, it anchors you into the present moment within 500 milliseconds of looking at the screen.

```
+-----------------------------------------------------------------------------------+
|  [🧭 Daily Compass]   14:23:10 Wed, Nov 5   [QUICK RESET]   [BRAIN DUMP]          |
|  CURRENT BLOCK: Afternoon Deep Focus (Ends in 37m)   [NEXT: Stretch & Hydrate]    |
+-----------------------------------------------------------------------------------+
|  [ 1. Today ]  [ 2. Cash ]  [ 3. Debts ]  [ 4. Habits ]  [ 5. Notes ]  [ 6. Set ] |
+-----------------------------------------------------------------------------------+
```

---

## ✨ Key Features

### 1. 🕒 "Where Am I Right Now?" Master Anchor
- **Live Master Clock:** High-legibility precision clock toggleable between 12-hour (with AM/PM) and 24-hour military formats, accompanied by full weekday and date display.
- **Active Routine Block Detection:** Dynamically calculates which schedule block you are currently in (e.g. *Morning Kickoff*, *Deep Focus Sprint*, *Mid-Day Lunch Reset*, *Evening Wind-Down*) and calculates the remaining minutes.
- **Immediate Micro-Step:** Highlights the single next physical action to eliminate choice paralysis.
- **Day Progress Bar:** Visual indicator showing the elapsed percentage of the 24-hour cycle.

### 2. 🫁 4-7-8 Grounding Engine ("Lost? Click to Center")
- One-click emergency cognitive reset accessible from both header and sidebar.
- **Diaphragmatic Breathing Pacer:** Real-time visual and text guidance for 4-second Inhale, 7-second Gentle Hold, and 8-second Slow Exhale to down-regulate the nervous system during panic or paralysis.
- **Compassionate Re-Entry:** 1-tap options:
  - **15-Minute Breather:** Delays upcoming notifications so you can regroup without guilt.
  - **Re-Align Schedule:** Gently clears past unfinished routine steps and anchors your focus to the current hour.
  - **Rest Mode:** Strips away non-essential tasks for low-energy recovery days.

### 3. 💳 Daily Cash Compass & Safe-to-Spend
- **Safe-to-Spend Today Gauge:** Instant calculation of daily spending allowance minus expenses logged today.
- **Visual Budget Fill:** Real-time color-coded bar (Sage Green $< 80\%$, Warm Amber $80\text{–}100\%$, Rose Red $> 100\%$).
- **Zero-Friction 1-Tap Expense Pills:** Log common expenses ($3 Coffee, $8 Lunch, $15 Dinner, $5 Transit) in a single tap without opening modal dialogues.
- **Clean Transaction Ledger:** Filter by All, Expenses, or Income with instant search and one-click deletion.

### 4. 🤝 "Who Owes Who?" Bilateral Debt Ledger
- **Lent & Borrowed Separation:** Distinct tabs for *"They Owe Me"* (Receivables) and *"I Owe Them"* (Payables).
- **Net Balance Banner:** Instant calculation showing your net financial posture ($+\$40.00$ or $-\$25.00$).
- **Partial & Full Settlement Modal:** Input partial payback amounts; remaining balance recalculates automatically, clamping to $0 and updating status to `settled`.

### 5. 🛡️ Micro-Habits & Zero-Shame Streak Shields
- **Zero-Shame Consistency:** Missing a day does not delete your hard-earned progress. 
- **Streak Shields:** Protects streaks during illness, travel, or sensory exhaustion.
- **Time-of-Day Filter:** Group habits into Morning, Afternoon, Evening, or Anytime to keep lists compact.
- **1-Tap Check:** Immediate auditory micro-tick feedback upon completion.

### 6. 📝 Scratchpad & Brain Dump Wall
- **Working Memory Safeguard:** Instant capture field for fleeting thoughts, to-dos, shopping needs, or random ideas before they derail current tasks.
- **Tag Filtering:** Filter by `All`, `Idea`, `To-Buy`, `To-Do`, or `Later`.
- **1-Click Conversions:** Convert any raw note directly into a tracked **Habit** or a **Cash Expense** with one click.

### 7. 🔔 Synthesized Web Audio Chimes (100% Self-Contained)
- **Zero External Audio Files:** Synthesized entirely in code via the browser's native **Web Audio API**.
- **4 Harmonic Presets:**
  - 🧘 **Zen Singing Bowl:** 432 Hz fundamental with acoustic overtone beating (warm, grounding).
  - 🎵 **Gentle Triad:** C-major arpeggio (C5, E5, G5) with bell envelopes.
  - 🛎️ **Attentive Bell:** Crisp two-stage harmonic ping for timely reminders.
  - 🪵 **Micro-Tick:** 20ms wooden percussive snap for tactile UI click feedback.
- **Smooth Volume Clamping:** Safe envelope gain ramping eliminates startle reflexes.

### 8. 🎯 Focus Mode ("One Thing at a Time")
- Press `F` or tap the **Focus** button to collapse navigation chrome, headers, and secondary modules.
- Leaves only the active routine block, current micro-step, and safe-to-spend gauge visible on screen.

---

## 🎨 Eye-Friendly & Sensory-Safe Design System

The Daily Compass user interface is intentionally engineered to prevent sensory overload and eye fatigue:

| Design Dimension | Implementation Detail | Cognitive / Sensory Benefit |
| :--- | :--- | :--- |
| **Dark Calm Palette** | Background: `#0d1117`, Cards: `#161b22`, Borders: `#30363d` | Low-luminance dark canvas minimizes optical strain and evening blue-light melatonin suppression. |
| **Muted Semantic Accents** | Sky (`#58a6ff`), Sage (`#3fb950`), Amber (`#d29922`), Rose (`#f85149`), Lavender (`#bc8cff`) | Vibrant enough for instant visual scanning; desaturated enough to avoid sensory alarm. |
| **Typography Hierarchy** | Inter / System UI paired with JetBrains Mono for financial & time figures | High-legibility tabular numbers prevent digit hopping when scanning budgets. |
| **Generous Hit Targets** | Minimum $44 \times 44\text{px}$ touch targets on mobile and desktop | Reduces mis-taps and frustration during motor fatigue or trembling. |
| **Soft Motion** | $200\text{ms}$ cubic-bezier transitions; respects `prefers-reduced-motion` | Smooth visual transitions without dizzying parallax or jarring flashes. |

---

## 🚀 Quickstart Guide

### Option 1: Direct File Launch (No Server Needed)
1. Download or clone this repository:
   ```bash
   git clone https://github.com/your-username/daily-tracker.git
   cd daily-tracker
   ```
2. Double-click [index.html](file:///c:/Users/Ivan/Pictures/Daily%20Tracker/index.html) in your browser (Chrome, Edge, Safari, Firefox).
3. The app is completely functional! All data persists locally in your browser's `localStorage`.

### Option 2: Local HTTP Server (Recommended for PWA features)
Running on a local web server enables offline Service Worker caching:
```bash
# Using Node.js npx:
npx serve .

# Using Python 3:
python -m http.server 8080

# Using PHP:
php -S localhost:8080
```
Open `http://localhost:8080` in your browser.

---

## 📱 Mobile "Add to Home Screen" (PWA Installation)

Daily Compass is a Progressive Web App (PWA). It runs standalone without browser URL bars, works 100% offline, and feels like a native app.

### 🍏 iOS (iPhone & iPad via Safari)
1. Open your deployed URL (e.g. `https://<username>.github.io/<repo>/`) in **Safari**.
2. Tap the **Share** button (the square with an arrow pointing upward at the bottom of the screen).
3. Scroll down the share sheet and tap **Add to Home Screen**.
4. Confirm the name *"Daily Compass"* and tap **Add** in the top-right corner.
5. Launch Daily Compass from your Home Screen icon for a full-screen, distraction-free experience.

### 🤖 Android (Chrome / Samsung Internet / Firefox)
1. Open the URL in **Google Chrome**.
2. Tap the **Three Dots menu (⋮)** in the top right corner.
3. Tap **Install app** or **Add to Home screen**.
4. Tap **Install** on the prompt. The app icon will appear in your app drawer and home screen.

### 💻 Desktop (Chrome / Edge / Brave)
1. Open the URL in Chrome or Edge.
2. Click the **Install** icon (a monitor with a down arrow) located on the right side of the URL address bar.
3. Click **Install**. The dashboard now opens in its own focused desktop window.

---

## 🌐 GitHub Pages Deployment Guide

Deploy your own private, free, permanent copy of Daily Compass in under 2 minutes:

### Step 1: Initialize Git Repository
In your local project folder:
```bash
git init
git add .
git commit -m "Initial release of Daily Compass v1.0.0"
```

### Step 2: Push to GitHub
1. Create a new public or private repository on [GitHub](https://github.com/new) named `daily-compass` (or `username.github.io`).
2. Link and push your local commits:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/daily-compass.git
   git push -u origin main
   ```

### Step 3: Enable GitHub Pages
1. On GitHub, navigate to your repository's **Settings** tab.
2. In the left navigation menu, click **Pages** (under the "Code and automation" section).
3. Under **Build and deployment**:
   - **Source:** Select `Deploy from a branch`.
   - **Branch:** Choose `main` and set the folder to `/ (root)`.
   - Click **Save**.
4. Wait approximately 30–60 seconds. Refresh the page until the green banner displays:  
   `Your site is live at https://<your-username>.github.io/daily-compass/`

> [!NOTE]
> All paths in Daily Compass are relative (`./css/styles.css`, `./js/app.js`, `./icons/icon.svg`), ensuring seamless hosting at both repository subpaths (`https://username.github.io/repo-name/`) and root user pages (`https://username.github.io/`).

---

## 🔒 Privacy & Local-First Architecture

- **100% Client-Side:** No accounts, no email signups, no analytics trackers, no advertising beacons.
- **Zero Third-Party Cloud Dependencies:** Your finances, habits, notes, and schedules never leave your device.
- **Full JSON Backup & Restore:**
  - Export your entire database anytime via **Settings $\rightarrow$ Export Backup JSON**.
  - Restore on another device via **Settings $\rightarrow$ Import Backup JSON** with support for clean overwrite or non-destructive merge.

---

## 🧪 Automated Testing

Daily Compass includes a full suite of automated unit and integration tests executing natively on Node.js using `node:test` (zero testing dependencies like Jest or Mocha required):

```bash
# Execute comprehensive full test suite
node --test tests/test_full_suite.js

# Execute all subsystem test suites
node --test tests/*.js
```

### Test Coverage Highlights
- ✅ **Store initialization & schema validity** (all modules, defaults, seed data).
- ✅ **State immutability & reactivity** (subscribers notified, state cloned safely).
- ✅ **CRUD helper operations** (`addItem`, `updateItem`, `deleteItem`, ID auto-generation).
- ✅ **Safe-to-spend financial calculations** (date filtering, income exclusion, negative overspend calculations).
- ✅ **Debt settlement arithmetic** (partial settlements, over-settlement zero clamping, net balance).
- ✅ **Habit streak math** (daily check/uncheck, shield protections).
- ✅ **Alarm triggers & day-of-week matching** (HH:MM evaluation, active day masks).
- ✅ **Edge case handling:**
  - Zero division protection when daily budget cap is $0.
  - LocalStorage quota exceeded recovery (in-memory fallback without crashing).
  - Malformed and corrupt JSON import rejection.
  - Missing field auto-sanitization and schema migration.
  - Daylight savings & timezone transitions across ISO date boundaries.
- ✅ **Web Audio API synthesis engine** (all 4 presets, alarm loop cycle, master volume clamp).

---

## 🌿 The Ponytail Simplicity Rationale

This project was built following the **Ponytail Senior Engineering Mindset**:
1. **The best code is the code you never had to write.**
2. **Zero Framework Overhead:** No React, Vue, Angular, or build tools like Webpack/Vite. Native ES6 modules run directly in every modern browser.
3. **No External Audio Assets:** Audio files (MP3/WAV) fail to load on spotty connections and add megabytes of bloat. The Web Audio API synthesizes lush soundwaves directly on the device using $< 10$ kilobytes of JavaScript code.
4. **Maintenance Horizon:** This app has zero dependencies that will break in 5 years. It will run identically in 2035 as it does today.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
