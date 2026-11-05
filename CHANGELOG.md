# 📋 Changelog

All notable changes to the **Daily Compass** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-05

### 🚀 Initial Production Release

Daily Compass 1.0.0 is the foundational release of the zero-dependency, local-first daily life tracker and cognitive grounding cockpit designed for individuals with ADHD, time blindness, executive dysfunction, and cognitive fatigue.

### Added

#### 1. Core Anchor & Orientation Engine
- **Live Master Clock:** High-legibility typography with real-time second ticks, toggleable 12-hour (with AM/PM) and 24-hour formats.
- **24-Hour Day Progress Gauge:** Real-time visual progress percentage indicating elapsed portion of the current day.
- **Dynamic Routine Block Matching:** Automatically identifies the active schedule block (e.g. *Morning Anchor*, *Deep Focus*, *Lunch Reset*, *Execution Block*, *Evening Wind-Down*) based on local time and displays remaining duration in minutes.
- **Immediate Micro-Step Focus:** Prominently displays the single upcoming physical action with a 1-tap completion button to eliminate choice paralysis.

#### 2. 4-7-8 Grounding Engine ("Lost? Click to Center")
- **Emergency Centering Modal:** Accessible via persistent header and sidebar buttons.
- **Diaphragmatic Breathing Pacer:** Real-time automated state machine guiding 4-second Inhale, 7-second Gentle Hold, and 8-second Slow Exhale to stimulate the vagus nerve and alleviate task paralysis or panic.
- **Compassionate Re-Entry Actions:**
  - *15-Minute Breather:* Delays upcoming notifications to allow safe decompression.
  - *Re-Align Schedule to Now:* Forgives missed morning blocks and realigns the routine timeline to the current hour without guilt or backlogs.
  - *Rest Mode:* Activates high-fatigue self-care pacing.

#### 3. Daily Cash Compass & Safe-to-Spend Ledger
- **Safe-to-Spend Today Meter:** Instantly computes $\text{Daily Spending Cap} - \text{Expenses Logged Today}$.
- **Zero-Division Budget Protection:** Prevents `NaN` or `Infinity` edge cases when daily cap is configured to $0.
- **1-Tap Quick Expense Pills:** Single-click logging for everyday essentials (Coffee $3, Lunch $8, Dinner $15, Transit $5) without modal friction.
- **Transaction Ledger:** Chronological financial log with real-time filtering for All, Expense, and Income transactions, complete with one-click deletion.

#### 4. Bilateral Debt & Credit Ledger ("Who Owes Who?")
- **Split Ledger Views:** Dedicated tabs for *"They Owe Me"* (Receivables / Lent) and *"I Owe Them"* (Payables / Borrowed).
- **Net Receivable Banner:** Real-time calculation displaying net financial posture.
- **Settlement Engine:** Interactive modal supporting both partial and full payback entries, automatically clamping remaining balances to $0 and updating record status to `settled`.

#### 5. Micro-Habits & Zero-Shame Streak Shields
- **Low-Friction Checklist:** Grouped by time of day (Morning, Afternoon, Evening, Anytime).
- **Zero-Shame Continuity:** Missed days do not erase user history; **Streak Shields** protect streaks during illness, travel, or sensory exhaustion.
- **Interactive Check Toggling:** Checkoff increments streak and registers ISO date string; unchecking decrements streak bounded at 0.

#### 6. Distraction-Free Brain Dump Wall & Scratchpad
- **Instant Thought Capture:** Quick-entry input field to offload fleeting thoughts from working memory before task derailment occurs.
- **Categorization Tags:** Filter notes by `All`, `Idea`, `To-Buy`, `To-Do`, or `Later`.
- **1-Click Converters:** Transform any captured note directly into an active **Habit** or a cash **Expense** in one click.

#### 7. Procedural Web Audio API Synthesis Engine
- **Zero External Audio Dependencies:** Synthesizes all sounds and chimes mathematically via native browser `AudioContext`.
- **4 Harmonic Presets:**
  - `zen-bowl`: Grounding 432 Hz fundamental with 864 Hz harmonic overtone and 2.5 Hz natural acoustic beating.
  - `gentle-triad`: Polyphonic ascending C-major arpeggio (C5, E5, G5) with bell envelopes.
  - `attentive-bell`: Dual-oscillator A5 (880 Hz) and A6 (1760 Hz) alert chime.
  - `micro-tick`: 20ms woodblock acoustic snap with fast pitch envelope descent for UI tactile feedback.
- **Alarm Loop Manager:** Repeating chime loop with instant dismiss, snooze offsets (5, 10, 15 minutes), and active node cleanup.
- **Master Volume Control:** Gain ramping with bounds clamping strictly between 0.0 and 1.0.
- **Autoplay Compliance:** Lazy AudioContext initialization and automatic user-gesture unlock.

#### 8. Cognitive Accessibility & Design System
- **Dark Calm Palette:** `#0d1117` background with `#161b22` cards and `#30363d` borders designed to eliminate optical strain and minimize blue-light melatonin suppression.
- **Muted Semantic Accents:** Sky Blue (`#58a6ff`), Sage Green (`#3fb950`), Warm Amber (`#d29922`), Rose Red (`#f85149`), and Lavender (`#bc8cff`).
- **Focus Mode ("One Thing at a Time"):** Keyboard shortcut `F` collapses all navigation chrome, leaving only the active clock, immediate step, and budget gauge.
- **Touch Ergonomics:** Generous hit targets ($\ge 44 \times 44\text{px}$) across desktop and mobile.

#### 9. Progressive Web App & Offline Execution
- **PWA Service Worker (`sw.js`):** Cache-first strategy for zero-latency offline loading.
- **Web App Manifest (`manifest.json`):** Full standalone mobile installation support for iOS Safari and Android Chrome.

#### 10. Data Portability & Storage Architecture
- **Local-First Persistence:** Stored in `localStorage` under `daily_compass_state_v1` with in-memory fallback if quota is exceeded.
- **Full Backup Export:** Conforms to Section 11.8 specification schema.
- **Intelligent JSON Import:** Supports clean full state Overwrite mode as well as non-destructive ID-keyed Merge mode.

#### 11. Verification & Testing
- Automated Node.js test suite (`tests/test_full_suite.js`) executing across 6 test suites and 30 assertion specs with 0 failures:
  - Store initialization & schema integrity.
  - CRUD helper operations & subscriber reactivity.
  - Calculation logic (Safe-to-spend, debts, habits, alarms, routine block matching).
  - Data portability export/import validation.
  - Edge cases (budget cap = 0, localStorage quota exceeded, corrupt JSON import, timezone transitions, debt over-settlement).
  - Web Audio synthesis presets, alarm loops, and volume control.
- Subsystem test suite (`tests/test_subsystems.js`) with 11 assertion specs with 0 failures.

---

### Security & Privacy
- Zero user tracking, cookies, or remote analytics beacons.
- Zero server-side database requirements; 100% client-side execution.
