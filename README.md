# 🧭 Daily Compass

> **The Zero-Overwhelm Cognitive Grounding & Daily Life Cockpit (v2.0.0 Pro Max)**  
> *Engineered for ADHD, time blindness, executive dysfunction, and sensory sensitivity.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version: v2.0.0 Pro Max](https://img.shields.io/badge/Version-v2.0.0%20Pro%20Max-indigo.svg)](CHANGELOG.md)
[![Zero Dependencies](https://img.shields.io/badge/Runtime%20Dependencies-0-success.svg)](package.json)
[![Offline First](https://img.shields.io/badge/Architecture-Local--First%20PWA-brightgreen.svg)](sw.js)
[![Tests Passing](https://img.shields.io/badge/Node.js%20Tests-48%2F48%20Pass-brightgreen.svg)](tests/test_full_suite.js)

---

## 🌟 Overview

Most productivity suites fail the people who need them most. When you live with ADHD, chronic time blindness, executive dysfunction, or sensory overwhelm:
- **Red overdue badges** trigger guilt spirals and app abandonment.
- **Deep multi-screen forms** create cognitive friction and decision paralysis.
- **Jarring klaxon alarms** induce cortisol spikes and panic.
- **Fragmented tools** (separate apps for alarms, habits, hydration, meds, spending, notes) force constant context-switching, evaporating your fragile working memory.

**Daily Compass v2.0 Pro Max** is an all-in-one cognitive prosthetic and daily life dashboard. Built from the ground up as an unshakeable ground truth, it anchors you into the present moment within 500 milliseconds of looking at the screen.

```
+-----------------------------------------------------------------------------------------------+
| [🧭 Daily Compass]  14:23:10 Wed, Nov 5  [⚡ 60% Spoon]  [Cmd+K Omnibar]  [🧘 Lost? Reset]   |
| CURRENT BLOCK: Afternoon Deep Focus (Ends in 37m)   [NEXT: Stretch & Hydrate]                 |
| [⏳ Shift Schedule:  +15m  |  +30m  |  +1h  |  Snap to Now ]                                   |
+-----------------------------------------------------------------------------------------------+
| [ 1. Today ]  [ 2. Cash ]  [ 3. Debts ]  [ 4. Habits ]  [ 5. Notes ]  [ 6. Settings ]         |
+-----------------------------------------------------------------------------------------------+
|  💧 Hydration: 1250/2000ml   💊 Meds: 2/3 Taken   🎯 Sprint: 25:00 [Pink Rain]   💰 Safe: $34 |
+-----------------------------------------------------------------------------------------------+
```

---

## ✨ What's New in v2.0 Pro Max

Daily Compass v2.0 Pro Max introduces **10 powerful neurodivergent-tailored modules** while strictly preserving its zero-dependency, local-first, lightweight architecture:

### 1. ⚡ Energy Battery Gauge (Spoon Theory & Gentle Mode)
- **Visual Spoon Battery:** Direct visual biofeedback tracking energetic reserves across three discrete states: **100% High**, **60% Medium**, and **20% Low / Depleted**.
- **Automatic Gentle Mode:** Dropping to $\le 20\%$ automatically engages **Gentle Mode**—hiding aggressive goals, stripping away non-essential routine blocks, softening UI contrast, and automatically deploying streak shields.
- **Quick Keyboard Cycle:** Press `E` anywhere outside text fields to cycle energy states in 1 tap.

### 2. 💧 Pure SVG Hydration Ring & Droplet Logger
- **Circular SVG Progress Gauge:** Real-time visual representation of daily water intake towards your target (e.g. 2,000ml).
- **1-Tap Quick-Log Pills:** Instantly record $+250\text{ml}$ or $+500\text{ml}$ with a single tap.
- **Synthesized Water Droplet Chime:** Tactile acoustic confirmation with custom pitch-swept droplet frequency modulation ($600\text{Hz} \to 1400\text{Hz} \to 800\text{Hz}$).
- **Boundary Capping & Undo:** Includes 1-tap **Undo** for mis-taps and safety clamping at $6,000\text{ml}$ to avoid input errors.

### 3. 💊 Medication Checklist with Double-Dose Safety Lock
- **Visual Ingestion Record:** Chronological slots (Morning, Afternoon, Evening) with dosage notes and food indicators.
- **Double-Dose Prevention:** When marked taken, the medication card visually locks with a persistent timestamp (`Taken at HH:MM`) and dimmed styling. This eliminates the frantic *"Did I take my meds 5 minutes ago?"* working-memory panic.
- **1-Tap Safe Reversal:** Toggleable if checked by error, cleanly clearing timestamp and resetting status.

### 4. ⏳ Schedule Quick-Shift Elastic Engine
- **Anti-Derailment Control:** Running 20 minutes late often causes an "all-or-nothing" psychological surrender where the entire day is abandoned.
- **Elastic Shifting:** 1-tap buttons (`+15m`, `+30m`, `+1h`, `Snap to Now`) push all remaining routine blocks forward in time.
- **Bedtime Boundary Protection:** Times automatically clamp at $23:59$ to safeguard sleep hygiene.
- **Toast Undo:** Includes a 5-second undo toast allowing instantaneous reversal if clicked accidentally.

### 5. 🎯 Focus Sprint Timer & Procedural Ambient Soundscapes
- **Adjustable Sprint Blocks:** 15-minute quick sprint, 25-minute Pomodoro, or 50-minute deep-work session.
- **Zero MP3 / Zero Asset Audio:** Continuous ambient soundscapes procedurally synthesized in real time via the Web Audio API:
  - 🌧️ **Pink Rain:** Paul Kellet's $-3\text{dB}/\text{octave}$ 6-pole filter paired with an $1100\text{Hz}$ biquad lowpass filter and $0.08\text{Hz}$ LFO wind swell.
  - 🧠 **10Hz Alpha Waves:** Binaural beat generator ($200\text{Hz}$ Left ear / $210\text{Hz}$ Right ear with $-0.9/+0.9$ stereo panning) targeting relaxed cortical alpha rhythm ($8\text{–}12\text{Hz}$) for ADHD focus.
  - 🧘 **Tibetan Drone:** Quad-layer harmonic singing bowl drone ($108\text{Hz}, 216\text{Hz}, 324\text{Hz}, 432\text{Hz}$) with subtle acoustic detuning.

### 6. ⌨️ Global Omnibar Command Palette (`Cmd+K` / `Ctrl+K`)
- **Instant Keyboard Navigation:** Press `Cmd + K` (Mac) or `Ctrl + K` (Windows/Linux) from any view.
- **Prefix Command Handlers:**
  - `$ 14 lunch` $\to$ Instantly logs a $\$14.00$ lunch expense.
  - `+h 500` $\to$ Logs $500\text{ml}$ hydration.
  - `+shift 30` $\to$ Advances schedule routines by 30 minutes.
  - `+bat low` / `+bat med` / `+bat high` $\to$ Sets Energy Battery.
  - `+zen` $\to$ Opens 4-7-8 Breathing Grounding Calmer.
- **Fuzzy Cross-Module Search:** Instant search across habits, debt counterparties, notes, and routine schedules.

### 7. 💳 Recurring Subscriptions & End-of-Month Cash Buffer
- **Fixed Overhead Tracker:** Manage monthly recurring subscriptions (Cloud, Gym, Broadband, Software) with renewal dates and 1-tap "Log Paid" markers.
- **Buffer Forecast Algorithm:** Real-time equation calculating your projected surplus or deficit:
  $$\text{Buffer} = \text{Monthly Pool} - \text{Spent So Far} - \text{Pending Subs} - (\text{Remaining Days} \times \text{Daily Cap})$$
- **Semantic Posture:** Color-coded status badges: **Comfort** (surplus projected), **Tight** ($\le 1\text{ day allowance}$), or **Deficit** (burn rate exceeds monthly pool).

### 8. 📊 Pure SVG Activity Heatmap & Category Donut Chart
- **7-Day Rolling Habit Heatmap:** Zero-dependency inline SVG weekly consistency grid showing individual habit completions across the past 7 days.
- **Expense Breakdown Donut:** Pure SVG circle dash-array graphic displaying category percentages (Food, Coffee, Transit, Groceries, Bills, Misc) without chart libraries.

### 9. 🛡️ 7-Day Rolling Snapshots (Time-Machine Recovery)
- **Local Automated Safety Net:** Automatically creates daily baseline checkpoints at midnight and during critical mutations.
- **FIFO Rotation:** Capped at 12 rolling snapshots (7 daily baselines + 5 user-created checkpoints) to ensure compact local storage.
- **1-Click Rollback:** Preview and restore previous snapshots with zero data loss.

---

## ✨ Core Foundational Features

### 🕒 "Where Am I Right Now?" Master Anchor
- **Live Master Clock:** High-legibility precision clock toggleable between 12-hour (with AM/PM) and 24-hour military formats, accompanied by full weekday and date display.
- **Active Routine Block Detection:** Dynamically calculates which schedule block you are currently in and displays remaining minutes.
- **Immediate Micro-Step:** Highlights the single next physical action to eliminate choice paralysis.
- **Day Progress Bar:** Visual indicator showing elapsed percentage of the 24-hour cycle.

### 🫁 4-7-8 Grounding Engine ("Lost? Click to Center")
- One-click emergency cognitive reset accessible from both header and sidebar.
- **Diaphragmatic Breathing Pacer:** Real-time visual and text guidance for 4-second Inhale, 7-second Gentle Hold, and 8-second Slow Exhale to down-regulate the nervous system during panic or paralysis.
- **Compassionate Re-Entry:** 1-tap options:
  - **15-Minute Breather:** Delays upcoming notifications so you can regroup without guilt.
  - **Re-Align Schedule:** Gently clears past unfinished routine steps and anchors your focus to the current hour.
  - **Rest Mode:** Strips away non-essential tasks for low-energy recovery days.

### 💳 Daily Cash Compass & Safe-to-Spend
- **Safe-to-Spend Today Gauge:** Instant calculation of daily spending allowance minus expenses logged today.
- **Visual Budget Fill:** Real-time color-coded bar (Sage Green $< 80\%$, Warm Amber $80\text{–}100\%$, Rose Red $> 100\%$).
- **Zero-Friction 1-Tap Expense Pills:** Log common expenses ($3 Coffee, $8 Lunch, $15 Dinner, $5 Transit) in a single tap without opening modal dialogues.
- **Clean Transaction Ledger:** Filter by All, Expenses, or Income with instant search and one-click deletion.

### 🤝 "Who Owes Who?" Bilateral Debt Ledger
- **Lent & Borrowed Separation:** Distinct tabs for *"They Owe Me"* (Receivables) and *"I Owe Them"* (Payables).
- **Net Balance Banner:** Instant calculation showing your net financial posture ($+\$40.00$ or $-\$25.00$).
- **Partial & Full Settlement Modal:** Input partial payback amounts; remaining balance recalculates automatically, clamping to $0 and updating status to `settled`.

### 🛡️ Micro-Habits & Zero-Shame Streak Shields
- **Zero-Shame Consistency:** Missing a day does not delete your hard-earned progress. 
- **Streak Shields:** Protects streaks during illness, travel, or sensory exhaustion.
- **Time-of-Day Filter:** Group habits into Morning, Afternoon, Evening, or Anytime to keep lists compact.
- **1-Tap Check:** Immediate auditory micro-tick feedback upon completion.

### 📝 Scratchpad & Brain Dump Wall
- **Working Memory Safeguard:** Instant capture field for fleeting thoughts, to-dos, shopping needs, or random ideas before they derail current tasks.
- **Tag Filtering:** Filter by `All`, `Idea`, `To-Buy`, `To-Do`, or `Later`.
- **1-Click Conversions:** Convert any raw note directly into a tracked **Habit** or a **Cash Expense** with one click.

### 🔔 Synthesized Web Audio Chimes (100% Self-Contained)
- **Zero External Audio Files:** Synthesized entirely in code via the browser's native **Web Audio API**.
- **Soothing Harmonic Presets:**
  - 🧘 **Zen Singing Bowl:** 432 Hz fundamental with acoustic overtone beating (warm, grounding).
  - 🎵 **Gentle Triad:** C-major arpeggio (C5, E5, G5) with bell envelopes.
  - 🛎️ **Attentive Bell:** Crisp two-stage harmonic ping for timely reminders.
  - 🪵 **Micro-Tick:** 20ms wooden percussive snap for tactile UI click feedback.
  - 💧 **Water Drop:** Frequency-modulated pitch droplet for hydration logging.
- **Smooth Volume Clamping:** Safe envelope gain ramping eliminates startle reflexes.

### 🎯 Focus Mode ("One Thing at a Time")
- Press `F` or tap the **Focus** button to collapse navigation chrome, headers, and secondary modules.
- Leaves only the active routine block, current micro-step, and safe-to-spend gauge visible on screen.

---

## 🎨 Eye-Friendly & Sensory-Safe Design System

The Daily Compass user interface is intentionally engineered to prevent sensory overload and eye fatigue:

| Design Dimension | Implementation Detail | Cognitive / Sensory Benefit |
| :--- | :--- | :--- |
| **Dark Calm Palette** | Canvas: `#0d1117`, Cards: `#161b22`, Borders: `#30363d` | Low-luminance dark canvas minimizes optical strain and evening blue-light melatonin suppression. |
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
git commit -m "Release Daily Compass v2.0.0 Pro Max"
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
- **7-Day Rolling Snapshots:** Automated local snapshots retain 12 historical states for 1-click time-machine recovery.

---

## 🧪 Automated Testing

Daily Compass includes 48 automated unit and integration tests executing natively on Node.js using `node:test` (zero testing dependencies like Jest or Mocha required):

```bash
# Execute comprehensive full test suite
node --test tests/test_subsystems.js tests/test_full_suite.js
```

### Test Suite Summary (48/48 Passing)
- ✅ **Suite 1: Store Initialization & Schemas (5 tests):** Validates top-level modules, settings/profile synchronization, routine bounds, alarm schemas, and state immutability.
- ✅ **Suite 2: CRUD Operations & Reactivity (5 tests):** Validates item additions with UUID generation, targeted updates, deletions, and subscriber state notifications.
- ✅ **Suite 3: Calculation Logic (7 tests):** Validates daily safe-to-spend calculations, overspend calculations, bilateral debt balances, partial and full debt settlements, habit streak math, alarm trigger matching, and routine block time matching.
- ✅ **Suite 4: Export & Import Portability (3 tests):** Validates JSON serialization against schema, full state Overwrite mode, and ID-keyed Merge mode.
- ✅ **Suite 5: Edge Cases & Resilience (6 tests):** Validates zero division protection ($cap = 0$), LocalStorage quota exhaustion fallback, corrupt JSON import rejection, missing field auto-sanitization, timezone/daylight saving boundaries, and debt over-settlement zero-clamping.
- ✅ **Suite 6: Web Audio API Sound Synthesizer (4 tests):** Validates harmonic preset availability, error-free preset execution, alarm loop lifecycle tracking, and master volume bounds clamping ($[0.0, 1.0]$).
- ✅ **Suite 7: v2.0 Pro Max Expansion Subsystems (7 tests):** Validates hydration additions, undo, and $6000\text{ml}$ boundary capping; medication toggle and timestamp recording; Energy Battery Spoon level and auto Gentle Mode trigger at $\le 20\%$; Schedule Quick-Shift chronological advancing and undo; End-of-Month cash buffer projection formula; rolling snapshot creation, FIFO rotation, and restoration; procedural ambient soundscape generation and tracking.
- ✅ **Subsystem Suites (11 tests):** Deep store and audio unit specifications.

---

## 🌿 The Ponytail Simplicity Rationale

This project was built following the **Ponytail Senior Engineering Mindset**:
1. **The best code is the code you never had to write.**
2. **Zero Framework Overhead:** No React, Vue, Angular, or build tools like Webpack/Vite. Native ES6 modules run directly in every modern browser.
3. **No External Audio Assets:** Audio files (MP3/WAV) fail to load on spotty connections and add megabytes of bloat. The Web Audio API synthesizes lush soundwaves directly on the device using $< 15$ kilobytes of JavaScript code.
4. **Maintenance Horizon:** This app has zero dependencies that will break in 5 years. It will run identically in 2035 as it does today.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
