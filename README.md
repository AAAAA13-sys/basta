# 🧭 Daily Compass

> **The Zero-Overwhelm Cognitive Grounding & Daily Life Cockpit**  
> *Engineered for ADHD, time blindness, executive dysfunction, and sensory sensitivity.*
>
> 🇵🇭 **v3.0.0 Flutter Pinoy Edition:** Mobile Phone Application (Dart 3.x / Flutter 3.x) tailored for the Filipino student & salaryman lived experience.  
> 🌐 **v2.2.0 Web / PWA Edition:** Zero-dependency, offline-first web cockpit deployable to GitHub Pages.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Flutter Version](https://img.shields.io/badge/Flutter-3.47.9%20Stable-02569B.svg?logo=flutter)](daily_compass_app/)
[![Dart Version](https://img.shields.io/badge/Dart-3.13.7-0175C2.svg?logo=dart)](daily_compass_app/)
[![Flutter Tests](https://img.shields.io/badge/Flutter%20Tests-10%2F10%20Pass-brightgreen.svg)](daily_compass_app/test/)
[![Web Tests](https://img.shields.io/badge/Web%20Tests-61%2F61%20Pass-brightgreen.svg)](tests/test_full_suite.js)

---

## 📱 v3.0.0 Pinoy Navigator (Flutter & Dart Mobile App)

Located in `daily_compass_app/`. Built specifically for Filipino college students (U-Belt, Diliman, Taft, Katipunan) and young corporate/BPO salary workers (Ortigas, Ayala Makati, BGC, Eastwood) dealing with multi-leg commutes, quincena cash flow, and executive dysfunction.

### 🌟 Core Pinoy Mobile Features

1. **💰 "Petsa de Peligro" Survival Engine:**
   - Countdown to 15th/30th sahod cutoff or weekly baon.
   - **Untouchable Pamasahe Reserve:** Strict mathematical protection ($N_{\text{days}} \times \text{DailyFare}$) locking commute money away in a vault with a padlock icon so you are never stranded.
   - **"Pwede Gastusin Ngayon":** Real-time safe daily allowance for food and personal spending.
   - 1-Tap Quick Log Pills: `₱15 Jeep`, `₱25 Trike`, `₱60 Jollijeep meal`, `₱35 Canteen snack`.

2. **🚐 Multi-Leg Commute ("Byahe") & Beep Card Telemetry:**
   - Sequential leg tracking (Tricycle $\rightarrow$ Jeepney $\rightarrow$ MRT-3/LRT-1/LRT-2 $\rightarrow$ Walking) with 1-tap fare deduction.
   - Beep Card Balance with automatic low-balance alert ($< ₱50.00$) and ride-equivalency readout.
   - **Byahe EDC Survival Kit:** Quick checklist for *Payong ☂️*, *Bimpo 🧖*, *Barya 🪙*, *Powerbank 🔋*, *Alcohol 🧴*, and *Earphones 🎧*.

3. **🤝 KKB ("Kanya-Kanyang Bayad") & Abono Splitter:**
   - Eliminates social awkwardness when paying upfront for group lunches or coffee runs (*"Ako muna"*).
   - Generates friendly, copyable reminders for Messenger/Viber with your GCash/Maya number.

4. **🏪 Sari-Sari Store & Canteen Lista:**
   - Informal credit tracker for neighborhood sari-sari store purchases (*Aling Nena tab*) with itemized notes and payday settlement dates.

5. **🌿 "Pahinga Muna" 3-Question Brain Fog SOS:**
   - Somatic emergency de-escalation for tropical heat, Manila traffic, and sensory overwhelm:
     - *Step 1 (Katawan):* Cold water and sweat wiping.
     - *Step 2 (Paligid):* Noise shielding and finding a quiet corner.
     - *Step 3 (Isang Hakbang):* Single 2-minute micro-action into a 30-minute demand-free Safe Harbor.

### 🚀 Running the Flutter Mobile App

```powershell
# Navigate to the mobile app directory
cd daily_compass_app

# Run all automated tests (unit + widget)
flutter test

# Build for Web release (ready for github.io)
flutter build web --release

# When your Android Studio emulator is running or phone is mirrored:
flutter run
```

---

## 🌟 Web / PWA Edition (v2.2.0 Pro Max Ultra)

Most productivity suites fail the people who need them most. When you live with ADHD, chronic time blindness, executive dysfunction, or sensory overwhelm:
- **Red overdue badges** trigger guilt spirals and app abandonment.
- **Deep multi-screen forms** create cognitive friction and decision paralysis.
- **Jarring klaxon alarms** induce cortisol spikes and panic.
- **Fragmented tools** (separate apps for alarms, habits, hydration, meds, spending, notes) force constant context-switching, evaporating your fragile working memory.
- **Falling asleep without logging habits** shatters streaks on traditional apps, provoking morning defeat.
- **Shoulder-surfing anxiety in public** (coffee shops, public transit, shared offices) prevents you from opening financial ledgers and private brain dumps.

**Daily Compass v2.2.0 Pro Max Ultra** is an all-in-one cognitive prosthetic and daily life dashboard. Built from the ground up as an unshakeable ground truth, it anchors you into the present moment within 500 milliseconds of looking at the screen.

```
+-----------------------------------------------------------------------------------------------+
| [🧭 Daily Compass]  14:23:10 Wed, Nov 5  [⚡ 60% Spoon]  [🎙️ Voice]  [🧩 Cockpits]  [Cmd+K]     |
| 📅 7-DAY CHRONO-STRIP: [Thu 30] [Fri 31] [Sat 1] [Sun 2] [Mon 3] [Tue 4] [★ Wed 5 (TODAY)]    |
| CURRENT BLOCK: Afternoon Deep Focus (Ends in 37m)   [NEXT: Stretch & Hydrate]                 |
| [⏳ Shift Schedule:  +15m  |  +30m  |  +1h  |  Snap to Now ]   [✏️ Edit Routine Blocks]        |
+-----------------------------------------------------------------------------------------------+
| [ 1. Today ]  [ 2. Cash ]  [ 3. Debts ]  [ 4. Habits ]  [ 5. Notes ]  [ 6. Settings ]         |
+-----------------------------------------------------------------------------------------------+
|  💧 Hydration: 1250/2000ml   💊 Meds: 2/3 Taken   🎯 Sprint: 25:00 [Pink Rain]   💰 Safe: $34 |
+-----------------------------------------------------------------------------------------------+
```

---

## ✨ What's New in v2.2.0 Pro Max Ultra

Daily Compass v2.2.0 introduces **Sensory Audio Dictation ("Voice Scratchpad")**, a **7-Day Rolling Chrono-Strip Runway with Retrospective Day Inspection**, and **Curated Life-Setup Archetype Templates** with automatic snapshot rollback protection:

### 1. 🎙️ Native Web Speech Recognition Audio Dictation ("Voice Scratchpad")
- **100% Client-Side Voice Capture:** Zero audio leaves your computer or phone; powered entirely by native browser `SpeechRecognition` / `webkitSpeechRecognition` with zero cloud subscriptions or API keys.
- **Smart Punctuation & Normalization Pipeline (`normalizeSpokenTranscript`):** Converts spoken keywords (*"period"*, *"comma"*, *"question mark"*, *"exclamation point"*, *"new line"*) into proper typographic marks and capitalizes sentences and the standalone pronoun *"I"*.
- **Semantic Intent Auto-Tagger (`inferScratchpadTag`):** Accurately categorizes voice dumps into `#To-Buy`, `#To-Do`, `#Idea`, `#Later`, and `#Thought` based on conversational intent.
- **Sensory Ergonomics:** Calming breathing lavender/mint sine pulse animation (`@keyframes calm-voice-breath`) completely replaces anxiety-provoking red recording dots.
- **Instant Shortcuts:** Quick access via header microphone icon, Scratchpad modal button, `Alt + V` global hotkey, or `+voice` in the Omnibar.

### 2. 📅 7-Day Rolling Chrono-Strip Runway & Retrospective Day Inspection
- **Continuous 7-Day Temporal Strip:** Horizontal runway displaying the rolling window ($T-6 \dots T_0$) with completion micro-dots and historical daily spend badges.
- **Non-Punitive Retrospective Day Inspection:** Tap yesterday or any past day to review historical metrics under an amber notification banner (`#retro-inspection-banner`).
- **Unbroken Habit Streak Self-Healing (`toggleHabitForDate`):** Fell asleep without checking your evening habits? Tap yesterday, check the habit, and your streak automatically recalculates and self-heals backwards from today—without consuming a Streak Shield!
- **1-Click Return to Today:** Click "Return to Today" or use the `+today` Omnibar command to snap back to the live anchor.

### 3. 🧩 Curated Life-Setup Archetype Templates
- **3 Turnkey Cognitive Cockpits Grounded in Research:**
  - **ADHD Focus Navigator:** Paced for low-dopamine mornings, 50m Pomodoro sprints, mid-day sensory walks, 432 Hz Zen Bowl audio, 5 core habits, and a $45 daily budget cap.
  - **Remote Freelancer:** Boundary defense for work-from-home pros: virtual commute walks, deep client execution blocks, gentle triad audio, and 17:00 hard work-tab shutdowns.
  - **Gentle Recovery (Low Spoon):** Burnout and chronic fatigue pacing: 20% Gentle Mode by default, 432 Hz Tibetan Drone audio, and zero-guilt restorative micro-actions.
- **Safe Merge Protocol (`applyLifeTemplate`):** Non-destructive merge imports archetype blocks and habits while strictly preserving all your existing transactions, debts, scratchpad notes, and medications.
- **Automatic Snapshot Checkpoints:** The system automatically saves a checkpoint snapshot (`pre_archetype_install`) before applying, enabling instant 1-click rollback.

---

## ✨ What's New in v2.1.0 Pro Max Plus

Daily Compass v2.1.0 introduced **Temporal Sculpting**, **Sanctuary Privacy**, **Markdown Day Journals**, and **7-Day Rolling Trend Archiving**:

### 1. ✏️ Interactive Routine Block & Micro-Step Editor
- **Tactile Temporal Sculpting:** Directly create, edit, reorder, and delete daily routine blocks without touching raw JSON.
- **Live Duration Telemetry:** Start and end time inputs compute real-time durations (e.g. `⏱ 1h 30m`), eliminating mental math.
- **Cross-Midnight Overnight Support:** Seamlessly schedules blocks that span past midnight (e.g. `23:15` to `01:45` = `2h 30m`) with automatic crescent badge indicators (`🌙 Overnight`).
- **Category Mode Pills:** Choose from 6 sensory modes: **Focus** (`#4a7bb0`), **Rest** (`#60cd9b`), **Nourishment** (`#e5a960`), **Routine** (`#9aa5b5`), **Creative** (`#bc8cff`), and **Movement** (`#38bdf8`).
- **Ordered Micro-Steps Builder:** Break down overwhelming blocks into atomic micro-actions with drag-and-drop grips (`⋮⋮`) and touch-ergonomic `[↑]` / `[↓]` move buttons.
- **1-Tap Auto-Balance Durations:** The `🪄 Auto-Balance` button automatically divides total block duration evenly across all micro-steps.
- **Non-Punitive Soft Guidance:** Overlapping routines or step overflows display gentle amber notices rather than disabled buttons.
- **Safe Anchor Fallback:** Deleting an active routine automatically transitions Anchor to the next chronological routine without crashing.

### 2. 🛡️ Sanctuary Privacy Vault & Balance Masking
- **1-Keystroke "Peek Privacy" (`Alt + M`):** Instantly obscures all financial figures (Daily Cap, Safe-to-Spend, Cash Transactions, Debts, Subscriptions) and private journal notes behind a frosted slate Gaussian blur (`backdrop-filter: blur(8px)`).
- **Hover-to-Peek:** Hovering over a masked value temporarily clarifies it without unmasking the entire screen.
- **Local Numeric PIN Vault (Web Crypto SHA-256):** Secure sensitive views behind a 4-to-8 digit PIN hashed with a cryptographically random 16-byte salt via the native Web Crypto API. The plaintext PIN is never stored.
- **Auto-Lock on Tab Switch:** Automatically locks or masks the dashboard as soon as you switch tabs or minimize the browser (`visibilitychange`).
- **Compassionate Exponential Backoff:** Non-punitive rate limiting (15s cooldown at 3 fails, 60s at 5 fails, 300s at 7 fails) with gentle card shake animations instead of loud sirens.
- **Emergency Reset Guarantee:** If you forget your PIN, typing `"reset vault"` removes the PIN lock **without erasing your data**. You are never punished with data loss.

### 3. 📝 Daily Scratchpad Markdown Journal & CSV Exporter
- **1-Click Markdown Day Journal (`.md`):** Exports a beautifully formatted, structured Markdown day log ready to paste into **Obsidian**, **Notion**, **Logseq**, or **Roam Research**. Includes energy levels, hydration, medications checklist, routine completion tallies, safe-to-spend balance, and scratchpad thoughts.
- **Standard Financial CSV Export (`.csv`):** 1-click export of all cash transactions formatted to RFC-4180 (`Date,Time,Type,Category,Amount,Note`) for Excel, Google Sheets, or ledger tools.

### 4. 📊 7-Day Rolling Trend Archive & Adherence Metrics
- **Automated Summary Archiving:** Daily metrics (water intake, medications taken, habit adherence, and spending) are automatically archived into a rolling 14-day history.
- **Weekly Trend Telemetry:** Real-time averages compute:
  - 💧 Average daily water consumption (`avgWaterMl`).
  - 💳 Average daily spend (`avgDailySpend`).
  - 🌿 Overall habit adherence percentage (`habitAdherenceRate`).

---

## ✨ v2.0 Pro Max Foundational Features

### ⚡ Energy Battery Gauge (Spoon Theory & Gentle Mode)
- **Visual Spoon Battery:** Direct visual biofeedback tracking energetic reserves across three discrete states: **100% High**, **60% Medium**, and **20% Low / Depleted**.
- **Automatic Gentle Mode:** Dropping to $\le 20\%$ automatically engages **Gentle Mode**—hiding aggressive goals, stripping away non-essential routine blocks, softening UI contrast, and automatically deploying streak shields.
- **Quick Keyboard Cycle:** Press `E` anywhere outside text fields to cycle energy states in 1 tap.

### 💧 Pure SVG Hydration Ring & Droplet Logger
- **Circular SVG Progress Gauge:** Real-time visual representation of daily water intake towards your target (e.g. 2,000ml).
- **1-Tap Quick-Log Pills:** Instantly record $+250\text{ml}$ or $+500\text{ml}$ with a single tap.
- **Synthesized Water Droplet Chime:** Tactile acoustic confirmation with custom pitch-swept droplet frequency modulation ($600\text{Hz} \to 1400\text{Hz} \to 800\text{Hz}$).
- **Boundary Capping & Undo:** Includes 1-tap **Undo** for mis-taps and safety clamping at $6,000\text{ml}$.

### 💊 Medication Checklist with Double-Dose Safety Lock
- **Visual Ingestion Record:** Chronological slots (Morning, Afternoon, Evening) with dosage notes and food indicators.
- **Double-Dose Prevention:** When marked taken, the medication card visually locks with a persistent timestamp (`Taken at HH:MM`) and dimmed styling, eliminating the frantic *"Did I take my meds 5 minutes ago?"* panic.
- **1-Tap Safe Reversal:** Toggleable if checked by error, cleanly clearing timestamp and resetting status.

### ⏳ Schedule Quick-Shift Elastic Engine
- **Anti-Derailment Control:** Running late often causes an "all-or-nothing" psychological surrender where the entire day is abandoned.
- **Elastic Shifting:** 1-tap buttons (`+15m`, `+30m`, `+1h`, `Snap to Now`) push all remaining routine blocks forward in time.
- **Bedtime Boundary Protection:** Times automatically clamp at $23:59$ to safeguard sleep hygiene.
- **Toast Undo:** Includes a 5-second undo toast allowing instantaneous reversal if clicked accidentally.

### 🎯 Focus Sprint Timer & Procedural Ambient Soundscapes
- **Adjustable Sprint Blocks:** 15-minute quick sprint, 25-minute Pomodoro, or 50-minute deep-work session.
- **Zero MP3 / Zero Asset Audio:** Continuous ambient soundscapes procedurally synthesized in real time via the Web Audio API:
  - 🌧️ **Pink Rain:** Paul Kellet's $-3\text{dB}/\text{octave}$ 6-pole filter paired with an $1100\text{Hz}$ biquad lowpass filter and $0.08\text{Hz}$ LFO wind swell.
  - 🧠 **10Hz Alpha Waves:** Binaural beat generator ($200\text{Hz}$ Left ear / $210\text{Hz}$ Right ear with $-0.9/+0.9$ stereo panning) targeting relaxed cortical alpha rhythm ($8\text{–}12\text{Hz}$) for ADHD focus.
  - 🧘 **Tibetan Drone:** Quad-layer harmonic singing bowl drone ($108\text{Hz}, 216\text{Hz}, 324\text{Hz}, 432\text{Hz}$) with subtle acoustic detuning.

### ⌨️ Global Omnibar Command Palette (`Cmd+K` / `Ctrl+K`)
- **Instant Keyboard Navigation:** Press `Cmd + K` (Mac) or `Ctrl + K` (Windows/Linux) from any view.
- **Prefix Command Handlers:**
  - `$ 14 lunch` $\to$ Instantly logs a $\$14.00$ lunch expense.
  - `+h 500` $\to$ Logs $500\text{ml}$ hydration.
  - `+shift 30` $\to$ Advances schedule routines by 30 minutes.
  - `+bat low` / `+bat med` / `+bat high` $\to$ Sets Energy Battery.
  - `+mask` $\to$ Toggles Peek Privacy balance masking.
  - `+zen` $\to$ Opens 4-7-8 Breathing Grounding Calmer.
- **Fuzzy Cross-Module Search:** Instant search across habits, debt counterparties, notes, and routine schedules.

### 💳 Recurring Subscriptions & End-of-Month Cash Buffer
- **Fixed Overhead Tracker:** Manage monthly recurring subscriptions (Cloud, Gym, Broadband, Software) with renewal dates and 1-tap "Log Paid" markers.
- **Buffer Forecast Algorithm:** Real-time equation calculating your projected surplus or deficit:
  $$\text{Buffer} = \text{Monthly Pool} - \text{Spent So Far} - \text{Pending Subs} - (\text{Remaining Days} \times \text{Daily Cap})$$
- **Semantic Posture:** Color-coded status badges: **Comfort** (surplus projected), **Tight** ($\le 1\text{ day allowance}$), or **Deficit** (burn rate exceeds monthly pool).

### 📊 Pure SVG Activity Heatmap & Category Donut Chart
- **7-Day Rolling Habit Heatmap:** Zero-dependency inline SVG weekly consistency grid showing individual habit completions across the past 7 days.
- **Expense Breakdown Donut:** Pure SVG circle dash-array graphic displaying category percentages (Food, Coffee, Transit, Groceries, Bills, Misc) without chart libraries.

### 🛡️ 7-Day Rolling Snapshots (Time-Machine Recovery)
- **Local Automated Safety Net:** Automatically creates daily baseline checkpoints at midnight and pre-mutation checkpoints before deleting routines.
- **FIFO Rotation:** Capped at 12 rolling snapshots (7 daily baselines + 5 user-created checkpoints) to ensure compact local storage.
- **1-Click Rollback:** Preview and restore previous snapshots with zero data loss.

---

## 🎨 Eye-Friendly & Sensory-Safe Design System

The Daily Compass user interface is intentionally engineered to prevent sensory overload and eye fatigue:

| Design Dimension | Implementation Detail | Cognitive / Sensory Benefit |
| :--- | :--- | :--- |
| **Nordic Twilight Palette** | Canvas: `#181c24`, Cards: `#222734`, Elevated: `#2b3242`, Borders: `#2d3546` | Low-luminance dark canvas eliminates optical strain and prevents evening blue-light melatonin suppression. |
| **Muted Semantic Accents** | Cobalt (`#4a7bb0`), Sage (`#60cd9b`), Amber (`#e5a960`), Rose (`#d9777f`), Violet (`#bc8cff`), Cyan (`#38bdf8`) | Vibrant enough for instant visual scanning; desaturated enough to avoid sensory alarm. |
| **Peek Privacy Blurs** | Frosted slate Gaussian blur (`backdrop-filter: blur(8px)`) with hover-to-peek | Complete freedom to open the app in public without shoulder-surfing anxiety. |
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
git commit -m "Release Daily Compass v2.1.0 Pro Max Plus"
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
- **Sanctuary Privacy Vault:** Optional 4-to-8 digit PIN with Web Crypto SHA-256 + 16-byte random salt.
- **Full JSON Backup & Restore:**
  - Export your entire database anytime via **Settings $\rightarrow$ Export Backup JSON**.
  - Restore on another device via **Settings $\rightarrow$ Import Backup JSON** with support for clean overwrite or non-destructive merge.
- **Markdown & CSV Portability:** Export your daily journal to Markdown and transactions to CSV anytime.

---

## 🧪 Automated Testing

Daily Compass includes **61 automated unit and integration tests** executing natively on Node.js using `node:test` (zero testing dependencies like Jest or Mocha required):

```bash
# Execute comprehensive full test suite
node --test tests/test_subsystems.js tests/test_full_suite.js
```

### Test Suite Summary (54/54 Passing Across 10 Suites)
- ✅ **Suite 1: Store Initialization & Schemas (5 tests):** Validates top-level modules, settings/profile synchronization, routine bounds, alarm schemas, and state immutability.
- ✅ **Suite 2: CRUD Operations & Reactivity (5 tests):** Validates item additions with UUID generation, targeted updates, deletions, and subscriber state notifications.
- ✅ **Suite 3: Calculation Logic (7 tests):** Validates daily safe-to-spend calculations, overspend calculations, bilateral debt balances, partial and full debt settlements, habit streak math, alarm trigger matching, and routine block time matching.
- ✅ **Suite 4: Export & Import Portability (3 tests):** Validates JSON serialization against schema, full state Overwrite mode, and ID-keyed Merge mode.
- ✅ **Suite 5: Edge Cases & Resilience (6 tests):** Validates zero division protection ($cap = 0$), LocalStorage quota exhaustion fallback, corrupt JSON import rejection, missing field auto-sanitization, timezone/daylight saving boundaries, and debt over-settlement zero-clamping.
- ✅ **Suite 6: Web Audio API Sound Synthesizer (4 tests):** Validates harmonic preset availability, error-free preset execution, alarm loop lifecycle tracking, and master volume bounds clamping ($[0.0, 1.0]$).
- ✅ **Suite 7: v2.0 Pro Max Expansion Subsystems (7 tests):** Validates hydration additions, undo, and $6000\text{ml}$ boundary capping; medication toggle and timestamp recording; Energy Battery Spoon level and auto Gentle Mode trigger; Schedule Quick-Shift chronological advancing and undo; End-of-Month cash buffer projection formula; rolling snapshot creation, FIFO rotation, and restoration; procedural ambient soundscape generation and tracking.
- ✅ **Suite 8: v2.1 Pro Max Plus Subsystems (6 tests):** Validates Routine Editor standard and cross-midnight duration calculations; Routine creation, updating, and deletion with Anchor fallback; Micro-step CRUD, reordering, and auto-balance; Privacy Vault PIN setup, verification, locking, and emergency reset; Scratchpad item addition and Markdown Day Journal / CSV Transaction exports; Daily Summary metric archiving and 7-day rolling trend metrics.
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
