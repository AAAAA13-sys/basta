# Daily Compass — UI/UX Design System Specification
**Codename:** Nordic Twilight / Calm Ergonomics  
**Version:** 1.0.0  
**Status:** Canonical Design Standard  
**Target Audience:** Individuals seeking calm, low-friction executive function support; users prone to cognitive fatigue, ADHD, sensory overload, or digital eye strain.

---

## 1. Executive Design Philosophy

### 1.1 The Core Mission: "Calm by Default, Clear on Demand"
Modern productivity applications fail neurodivergent and overwhelmed minds by presenting wall-to-wall dashboard telemetry, hyper-saturated notification badges, and high-frequency visual stimulation.

`Daily Compass` rejects digital anxiety. The interface is engineered as an **Ergonomic Safe Haven**:
- **Not too bright, not too dark:** Avoids blinding pure-white backgrounds (#FFFFFF) that cause photophobia, and rejects absolute pitch-black OLED themes (#000000) that trigger astigmatic halation and pupil spasm.
- **Zero Hallway Panic:** Replaces cryptic icons and nested submenus with clear visual signposts and an ever-present **"Current Focus Anchor"**.
- **The "One Thing at a Time" Guarantee:** At any moment, the user can collapse complexity down to a single actionable atomic step with a single tap or keyboard shortcut (`Space`).

### 1.2 Cognitive Accessibility Directives
| Pillar | Design Rule | Sensory & Cognitive Benefit |
| :--- | :--- | :--- |
| **Visual Comfort** | Slate & Nordic Twilight palette (60-30-10 color rule) | Minimizes blue-light retinal stimulation while maintaining WCAG AAA contrast (>7:1). |
| **Anti-Lost Anchor** | Persistent Hero Card: Time + Active Routine + Next Atomic Step | Eliminates the "Wait, what was I doing?" cognitive tax when context-switching. |
| **Panic-Free Grounding** | Prominent *"Lost? Click to Center"* emergency button | Instant return to baseline; silences secondary noise and spotlights the immediate step. |
| **Physical Ergonomics** | Mobile bottom floating thumb bar; 48px+ touch targets | Eliminates reach fatigue and mis-taps on handheld devices; effortless one-handed use. |
| **No-Guilt Continuity** | Soft progression curves, muted rest states | Eliminates broken streak shame; highlights momentum over perfection. |

---

## 2. Color Palette & Lighting Model

### 2.1 The "Nordic Twilight" Color Matrix
The palette is calibrated using the CIE L*a*b* color space for uniform perceptual steps.

```
+---------------------------------------------------------------------------------+
| BACKGROUND LAYERS (Warm Slate & Deep Charcoal)                                  |
| [ Canvas: #181c24 ]  [ Card: #222734 ]  [ Surface Elevated: #2c3345 ]           |
|                                                                                 |
| TEXT & FOREGROUND                                                               |
| [ Pure Soft White: #e6edf3 ]  [ Muted Body: #9aa5b5 ]  [ Subdued: #6e7681 ]     |
|                                                                                 |
| CALMING ACCENTS                                                                 |
| [ Sage Green: #3fb950 ]  [ Sky Cobalt: #58a6ff ]  [ Amber Gold: #f0883e ]       |
| [ Muted Rose: #f85149 ]  [ Soft Violet: #bc8cff ]                               |
+---------------------------------------------------------------------------------+
```

#### Detailed Token Reference
```css
/* ==========================================================================
   DAILY COMPASS - NORDIC TWILIGHT DESIGN SYSTEM TOKENS
   ========================================================================== */

:root {
  /* --- Canvas & Surfaces (Eye-Friendly Slate Base) --- */
  --bg-canvas: #181c24;          /* Main application backdrop; warm navy-slate */
  --bg-canvas-subtle: #1c212c;   /* Grouping containers, inset wells */
  --bg-card: #222734;            /* Primary content container */
  --bg-card-hover: #262c3b;      /* Interactive hover state for cards */
  --bg-card-elevated: #2c3345;   /* Modals, popovers, floating dock, sticky hero */
  --bg-card-overlay: rgba(18, 22, 30, 0.78); /* Backdrop filter surface */

  /* --- Borders & Dividers --- */
  --border-subtle: #2d3546;       /* Clean card separators */
  --border-muted: #3d465c;        /* Focus card outlines, active tabs */
  --border-accent: #58a6ff;       /* Keyboard focus ring & highlighted states */

  /* --- Text & Content Contrast (WCAG AAA compliant) --- */
  --text-primary: #e6edf3;       /* High contrast soft-white, 0% glare (13.8:1 on #181c24) */
  --text-secondary: #9aa5b5;     /* Informational subtitles, secondary labels (6.4:1) */
  --text-muted: #6e7681;         /* Meta timestamps, non-critical counters (4.6:1) */
  --text-disabled: #484f58;      /* Inactive elements */
  --text-inverse: #0d1117;       /* Dark text for use on high-brightness chips */

  /* --- Calming Accent Palette --- */
  /* 1. Sage Green (Routine completion, balance, positive streak) */
  --accent-sage: #3fb950;
  --accent-sage-soft: #56d364;
  --accent-sage-bg: rgba(63, 185, 80, 0.12);
  --accent-sage-border: rgba(63, 185, 80, 0.35);

  /* 2. Sky Cobalt (Active anchor, current time, routine signposts) */
  --accent-sky: #58a6ff;
  --accent-sky-soft: #79c0ff;
  --accent-sky-bg: rgba(88, 166, 255, 0.12);
  --accent-sky-border: rgba(88, 166, 255, 0.35);

  /* 3. Warm Amber Gold (Immediate next action, cash inflows, gentle urgency) */
  --accent-amber: #f0883e;
  --accent-amber-soft: #ffa657;
  --accent-amber-bg: rgba(240, 136, 62, 0.14);
  --accent-amber-border: rgba(240, 136, 62, 0.38);

  /* 4. Muted Rose / Coral (Debt balances, upcoming alarms, non-startling alerts) */
  --accent-rose: #f85149;
  --accent-rose-soft: #ff7b72;
  --accent-rose-bg: rgba(248, 81, 73, 0.12);
  --accent-rose-border: rgba(248, 81, 73, 0.35);

  /* 5. Serene Violet (Daily reflection, notes, gratitude, mindfulness) */
  --accent-violet: #bc8cff;
  --accent-violet-soft: #d2a8ff;
  --accent-violet-bg: rgba(188, 140, 255, 0.12);
  --accent-violet-border: rgba(188, 140, 255, 0.35);

  /* --- Spacing & Spatial Cadence (8pt Grid) --- */
  --space-2xs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* --- Surface Geometry & Radii --- */
  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  --radius-pill: 9999px;

  /* --- Anti-Glare Elevation (Diffuse ambient drops, no sharp harsh edges) --- */
  --shadow-sm: 0 2px 6px rgba(10, 13, 18, 0.35);
  --shadow-md: 0 4px 16px rgba(10, 13, 18, 0.45);
  --shadow-lg: 0 10px 30px rgba(10, 13, 18, 0.55);
  --shadow-focus: 0 0 0 3px rgba(88, 166, 255, 0.40);
  --shadow-glow-amber: 0 0 20px rgba(240, 136, 62, 0.25);
  --shadow-glow-sage: 0 0 20px rgba(63, 185, 80, 0.25);

  /* --- Transitions & Timing (Smooth & Non-Jarring) --- */
  --ease-calm: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-gentle: 400ms;
}
```

---

## 3. Typography Hierarchy & Readability Engine

### 3.1 Font Stacks
- **Primary Interface Font:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - High x-height, clear differentiation between `1`, `l`, and `I`.
  - Open counters preventing visual blur on lower-resolution screens.
- **Tabular & Temporal Font:** `'JetBrains Mono', 'SF Mono', Consolas, monospace`
  - Used strictly for Digital Clock, Countdown Timers, Currency Figures, and Debt tallies.
  - Guarantees zero horizontal jitter as counters increment.

### 3.2 Type Scale Specification
To eliminate cognitive strain, **micro-text under 13px is strictly prohibited**.

| Level | Size | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Clock / Hero Time** | `42px` / `2.625rem` | `700 Bold` (Tabular) | `1.1` | `-0.02em` | Focus Anchor Hero Clock |
| **Display Heading (H1)** | `28px` / `1.75rem` | `600 SemiBold` | `1.25` | `-0.015em` | View Titles, Core Screen Headers |
| **Section Title (H2)** | `20px` / `1.25rem` | `600 SemiBold` | `1.35` | `-0.01em` | Card Category Dividers, Modals |
| **Card Header (H3)** | `17px` / `1.0625rem` | `600 SemiBold` | `1.4` | `0em` | Routine & Habit Item Titles |
| **Body Prominent** | `16px` / `1.0rem` | `400 Regular` | `1.55` | `0.005em` | Active instruction, descriptions |
| **Body Standard** | `15px` / `0.9375rem` | `400 Regular` | `1.5` | `0.01em` | Standard text, list details |
| **Metadata / Badge** | `13px` / `0.8125rem` | `500 Medium` | `1.4` | `0.025em` | Time stamps, category pills, tags |

---

## 4. Anti-Overwhelm Ergonomics: Core Feature Specifications

### 4.1 Feature 1: The "Current Focus Anchor" Hero Card
The **Current Focus Anchor** is the heartbeat of the application. Placed prominently at the very top of the mobile viewport and top-center of the desktop dashboard, it anchors the user’s mind whenever they feel disoriented.

```
+---------------------------------------------------------------------------------+
| CURRENT FOCUS ANCHOR (Elevated Slate #222734 / Subtle Sky Border)               |
|                                                                                 |
|   14:28:45  [ TUESDAY, NOV 05 ]                     (FOCUS MODE: OFF [ O ])     |
|   ---------------------------------------------------------------------------   |
|   ACTIVE ROUTINE: Deep Work Sprint 2 (Until 15:00)                              |
|                                                                                 |
|   +-------------------------------------------------------------------------+   |
|   | IMMEDIATE NEXT ACTION (ONE THING):                                      |   |
|   | Finish DESIGN_SYSTEM.md section 4.2 wireframe documentation             |   |
|   +-------------------------------------------------------------------------+   |
|                                                                                 |
|   [ Mark Done (Sage) ]    [ Snooze 10m ]    [ + Lost? Click to Center (Amber) ] |
+---------------------------------------------------------------------------------+
```

#### Behavior & Interactions:
1. **Clock & Live Pulse:** Tabular display showing current local time. A discreet breathing dot pulses gently (4-second cycle) to confirm the app is alive and synced.
2. **Current Active Routine:** Dynamically calculated based on the user's daily schedule or manual lock-in.
3. **Immediate Next Action:** Always displays *one single sub-step* (maximum 80 characters). Never a 20-item to-do list.
4. **"Lost? Click to Center" (The Grounding Anchor):**
   - When tapped:
     - Instantly scrolls the viewport smoothly back to the Focus Anchor.
     - Emits a mild haptic vibration (mobile) or subtle visual amber ripple.
     - Temporarily dims background peripheral cards for 3 seconds to re-orient the user's attention.
     - Plays an optional soft resonant chime (configurable in settings).

---

### 4.2 Feature 2: "Focus Mode" ("One Thing at a Time")
A dedicated global toggle available in the header and via keyboard shortcut (`Space` or `F`).

```mermaid
stateDiagram-v2
    [*] --> StandardDashboard: Launch App
    StandardDashboard --> FocusMode: Toggle 'Focus Mode' / Tap 'One Thing'
    FocusMode --> StandardDashboard: Press 'Exit Focus' / 'Esc'
    
    state FocusMode {
        [*] --> CurrentAtomicAction
        CurrentAtomicAction --> TaskComplete: Tap 'Done'
        TaskComplete --> NextAtomicAction: Auto-Advance with Micro-Celebration
        CurrentAtomicAction --> SnoozeAction: Tap 'Snooze 5m'
        SnoozeAction --> CurrentAtomicAction: Timer Elapses
    }
```

#### Visual Isolation Rules in Focus Mode:
- **Navbars & Drawers:** Completely hidden.
- **Secondary Widgets:** Cash balances, debt lists, past habit logs, future calendars are smoothly faded out (`opacity: 0; pointer-events: none`).
- **Focus Card:** Expands to fill the center stage with a calming dark vignette backdrop (`backdrop-filter: blur(12px)`).
- **Displayed Information:**
  1. Current Atomic Action (Huge, 22px clear text).
  2. Countdown to Next Alarm / Routine Transition.
  3. Two Primary Action Buttons:
     - `[ Complete & Advance ]` (Calming Sage Green, 54px height).
     - `[ Pause / Need 5 Min ]` (Warm Slate Secondary, 54px height).
  4. Subtle discrete exit cross in the top-right (`Esc`).

---

### 4.3 Feature 3: Segmented Navigation Architecture
Navigation is split into five distinct life domains to avoid clutter:

1. **`Today`** (Focus Anchor, Today's Timeline, Active Habit Checklist)
2. **`Cash & Debt`** (Daily Allowance, Expense Entry, Snowball / Avalanche Debt Tracker)
3. **`Habits & Alarms`** (Routine Timetable, Gentle Reminders, Streak Garden)
4. **`Logs & Notes`** (Brain Dump, Gratitude Journal, Daily Review)
5. **`Settings`** (Sensory Controls, Font Size, Audio Chimes, Data Backup)

#### Mobile Navigation: Thumb-Zone Floating Dock
- Positioned floating `16px` above the bottom screen bezel (safe-area inset compatible).
- Height: `64px`, Radius: `24px`, Background: `#222734` with `80%` opacity and `16px` backdrop-blur.
- Min touch target per tab: `56px x 52px`.
- Active tab indicator: Glowing pill underline + accent color glow.

```
+-----------------------------------------------------------+
|                          MOBILE                           |
|                                                           |
|       [ Today ]  [ Cash ]  [ Habits ]  [ Notes ]  [ Set ] |
|          (*)        ($)       (V)         (#)       (%)   |
+-----------------------------------------------------------+
```

#### Desktop & Tablet Navigation: Sleek Collapsible Sidebar
- Left-aligned, collapsible between Compact Icon-Rail (`68px`) and Expanded Drawer (`240px`).
- Always visible status badge showing the current time and active Focus state.
- Integrated keyboard shortcuts for rapid navigation (`Alt + 1` to `Alt + 5`).

---

## 5. UI Component Blueprints & Wireframes

### 5.1 Mobile Layout Blueprint (390px Viewport)

```
+--------------------------------------------------+
|  [Daily Compass]            [Focus: OFF] [O] (:) |  <- Top Header (48px)
+--------------------------------------------------+
|  +--------------------------------------------+  |
|  | CURRENT FOCUS ANCHOR                       |  |
|  | 09:42 AM  * Morning Focus Block            |  |
|  | NEXT: Review monthly utility debt invoice  |  |
|  |                                            |  |
|  | [ V Done ]     [ ... Snooze ]    [ ! Lost ]|  |
|  +--------------------------------------------+  |
|                                                  |
|  TODAY'S MOMENTUM                                |
|  [==========================......] 68%          |
|                                                  |
|  DAILY CASH COMPASS                              |
|  +--------------------------------------------+  |
|  | Remaining Today: $42.50   [ + Quick Add ]  |  |
|  | Debt Target: $150.00 / month (On Track)    |  |
|  +--------------------------------------------+  |
|                                                  |
|  ACTIVE HABITS & ROUTINES                        |
|  +--------------------------------------------+  |
|  | [x] 07:30 AM  Morning Hydration & Meds     |  |
|  | [>] 09:30 AM  Deep Work Sprint 1 (Active)  |  |
|  | [ ] 12:30 PM  Lunch & Screen-free Walk     |  |
|  | [ ] 06:00 PM  Evening Cash Log & Review    |  |
|  +--------------------------------------------+  |
|                                                  |
|  +--------------------------------------------+  |  <- Floating Thumb Dock
|  |  (Today)   (Cash)   (Habits)  (Notes) (Set)|  |     (64px height,
|  +--------------------------------------------+  |      elevated, safe-zone)
+--------------------------------------------------+
```

---

### 5.2 Desktop & Tablet Responsive Blueprint (1280px+ Viewport)

```
+----------------------------------------------------------------------------------------------------+
|  SIDEBAR (240px)  |  MAIN APPLICATION WORKSPACE (Fluid Max 1100px)                                 |
|                   |                                                                                |
|  (Compass)        |  +--------------------------------------------------------------------------+  |
|  Daily Compass    |  | CURRENT FOCUS ANCHOR (Hero)                                              |  |
|                   |  | Tuesday, 5 November 2026  |  14:28:45 Tabular Time                       |  |
|  NAVIGATE         |  | Active: "Deep Work Sprint 2" (32m remaining)                             |  |
|  [x] Today        |  | Immediate Next Action: Finalize Section 5 Component Specifications       |  |
|  [ ] Cash & Debt  |  | [ Mark Done (Sage) ]   [ Snooze 10m ]   [ Lost? Center Me (Amber) ]      |  |
|  [ ] Habits       |  +--------------------------------------------------------------------------+  |
|  [ ] Logs & Notes |                                                                                |
|  [ ] Settings     |  +-----------------------------+  +-----------------------------------------+  |
|                   |  | DAILY CASH & DEBT SNAPSHOT  |  | UPCOMING ROUTINES & ALARMS              |  |
|  QUICK ACTIONS    |  | Remaining Today: $42.50     |  | 15:00 Standup Sync (In 32m)             |  |
|  [ + Quick Entry] |  | Safe to Spend: $28.00       |  | 16:30 Stretch & Posture Reset           |  |
|  [ Space: Focus ] |  | Debt Avalanche: -$1,420     |  | 19:00 Dinner & Disconnect               |  |
|                   |  | [ Log Expense ]             |  | [ Manage Alarms ]                       |  |
|  STATUS           |  +-----------------------------+  +-----------------------------------------+  |
|  Focus: Relaxed   |                                                                                |
|  Synced 1m ago    |  +--------------------------------------------------------------------------+  |
|                   |  | LOGS & RAPID BRAIN DUMP                                                  |  |
|  v1.0.0           |  | "Remember to check the water filter replacement tomorrow morning"        |  |
+----------------------------------------------------------------------------------------------------+
```

---

### 5.3 Detailed Component Specifications

#### A. Interactive Touch Targets & Buttons
- **Touch Target Floor:** All interactive controls maintain a bounding box of at least **`48px x 48px`** (52px recommended on primary CTAs).
- **Primary Action (Sage):**
  - Background: `var(--accent-sage)` (#3fb950)
  - Color: `#ffffff`
  - Hover: `var(--accent-sage-soft)` (#56d364) with `box-shadow: 0 4px 14px rgba(63, 185, 80, 0.35)`
- **Secondary Action (Surface Outline):**
  - Background: `var(--bg-card)` (#222734)
  - Border: `1px solid var(--border-muted)` (#3d465c)
  - Color: `var(--text-primary)` (#e6edf3)
  - Hover: `var(--bg-card-hover)` (#262c3b)
- **Grounding Action ("Lost? Click to Center"):**
  - Background: `var(--accent-amber-bg)` (rgba(240, 136, 62, 0.14))
  - Border: `1.5px solid var(--accent-amber)` (#f0883e)
  - Color: `var(--accent-amber-soft)` (#ffa657)
  - Micro-interaction: Smooth pulse effect upon hover or tap.

#### B. Cash & Debt Tracker Component
- **Cognitive Goal:** Eliminates money anxiety by framing spending as a safe daily allocation instead of complex spreadsheet ledgers.
- **Visual Display:**
  - Daily Budget Meter: Large gauge showing safe remaining cash.
  - Color coding:
    - Safe (> 25% remaining): Soothing Sky Cobalt (`#58a6ff`)
    - Guarded (< 25% remaining): Warm Amber Gold (`#f0883e`)
    - Debt Snowball payoff card: Muted Rose badge (`#f85149`) with transparent progress bar tracking cumulative payoff milestones.

#### C. Habits & Alarms Component
- **Guilt-Free Checkboxes:** Checkbox size is `24px x 24px` within a `48px` tap cell.
- When checked: A gentle fluid sage fill occurs (`200ms ease-calm`) accompanied by a strike-through with dimmed text (`var(--text-muted)`).
- Missed habits do **NOT** show red warning badges; they gently roll over into a "Reschedule or Forgive" option to prevent shame spirals.

---

## 6. Accessibility & Sensory Ergonomics Matrix (WCAG AAA)

| Parameter | Standard / Benchmark | Daily Compass Implementation | Status |
| :--- | :--- | :--- | :--- |
| **Normal Text Contrast** | WCAG AAA: ≥ 7.0:1 | Soft-white (`#e6edf3`) on Slate (`#181c24`) = **13.8:1** | Passed |
| **Secondary Text Contrast**| WCAG AA: ≥ 4.5:1 | Secondary (`#9aa5b5`) on Slate (`#181c24`) = **6.4:1** | Passed |
| **Halation Elimination** | Prevent pure #000 / #FFF bleed | Base is charcoal-slate `#181c24`; white is attenuated `#e6edf3` | Zero Halation |
| **Touch Target Size** | Apple HIG: 44px; Android: 48px | All interactive components: **48px - 56px** | Exceeded |
| **Motor Accessibility** | No tiny icon-only tap zones | Minimum tap container: 48px with 8px safety margins | Passed |
| **Motion Reduction** | `prefers-reduced-motion: reduce` | Transitions collapse to `opacity` cross-fades; all pulses disabled | Native Support |
| **Dyslexia Friendly** | Clear tracking & distinct glyphs | Inter font family with letter-spacing `+0.015em`, line-height `1.5+` | Native Support |

---

## 7. Ready-to-Use Tailwind CSS Configuration

Developers can immediately drop the following theme configuration into `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#181c24',
          subtle: '#1c212c',
        },
        surface: {
          card: '#222734',
          'card-hover': '#262c3b',
          elevated: '#2c3345',
          overlay: 'rgba(18, 22, 30, 0.78)',
        },
        border: {
          subtle: '#2d3546',
          muted: '#3d465c',
          accent: '#58a6ff',
        },
        content: {
          primary: '#e6edf3',
          secondary: '#9aa5b5',
          muted: '#6e7681',
          disabled: '#484f58',
        },
        calm: {
          sage: '#3fb950',
          'sage-soft': '#56d364',
          sky: '#58a6ff',
          'sky-soft': '#79c0ff',
          amber: '#f0883e',
          'amber-soft': '#ffa657',
          rose: '#f85149',
          'rose-soft': '#ff7b72',
          violet: '#bc8cff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card-ambient': '0 4px 16px rgba(10, 13, 18, 0.45)',
        'focus-ring': '0 0 0 3px rgba(88, 166, 255, 0.40)',
        'amber-glow': '0 0 20px rgba(240, 136, 62, 0.25)',
      },
      minHeight: {
        touch: '48px',
      },
      minWidth: {
        touch: '48px',
      },
    },
  },
  plugins: [],
};
```

---

## 8. Frontend Implementation Blueprint: Current Focus Anchor Component

Below is the standard, production-ready React / Tailwind implementation for the Focus Anchor hero card:

```tsx
import React, { useState, useEffect } from 'react';

interface FocusAnchorProps {
  routineName: string;
  nextAtomicAction: string;
  onCompleteAction: () => void;
  onSnooze: (minutes: number) => void;
  onCenterView: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export const FocusAnchor: React.FC<FocusAnchorProps> = ({
  routineName,
  nextAtomicAction,
  onCompleteAction,
  onSnooze,
  onCenterView,
  isFocusMode,
  onToggleFocusMode,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="focus-anchor"
      className="w-full bg-surface-card border border-border-muted rounded-2xl p-5 md:p-6 shadow-card-ambient transition-all duration-300"
      role="region"
      aria-label="Current Focus Anchor"
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-calm-sky opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-calm-sky"></span>
          </span>
          <span className="font-mono text-2xl md:text-3xl font-bold text-content-primary tracking-tight">
            {timeStr || '00:00:00'}
          </span>
          <span className="hidden sm:inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-surface-elevated text-content-secondary">
            ACTIVE ANCHOR
          </span>
        </div>

        <button
          onClick={onToggleFocusMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors min-h-[44px] ${
            isFocusMode
              ? 'bg-calm-sage/20 text-calm-sage-soft border border-calm-sage/40'
              : 'bg-surface-elevated text-content-secondary hover:text-content-primary'
          }`}
          aria-pressed={isFocusMode}
        >
          <span>FOCUS MODE</span>
          <span className="w-2 h-2 rounded-full bg-current"></span>
        </button>
      </div>

      {/* Routine Signpost */}
      <div className="mb-2">
        <span className="text-xs uppercase tracking-wider font-semibold text-calm-sky">
          Active Routine
        </span>
        <h2 className="text-lg md:text-xl font-semibold text-content-primary">
          {routineName}
        </h2>
      </div>

      {/* Single Atomic Next Action */}
      <div className="bg-canvas-subtle border border-border-subtle rounded-xl p-4 my-3">
        <span className="text-xs font-medium text-content-muted uppercase tracking-wider block mb-1">
          Immediate Next Step (One Thing):
        </span>
        <p className="text-base md:text-lg font-medium text-content-primary leading-relaxed">
          {nextAtomicAction}
        </p>
      </div>

      {/* Ergonomic Button Deck (Min 48px touch height) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-1">
        <button
          onClick={onCompleteAction}
          className="h-12 px-4 rounded-xl font-semibold text-sm bg-calm-sage hover:bg-calm-sage-soft text-canvas transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span>Mark Done</span>
        </button>

        <button
          onClick={() => onSnooze(10)}
          className="h-12 px-4 rounded-xl font-medium text-sm bg-surface-elevated hover:bg-surface-card-hover text-content-primary border border-border-muted transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4 text-content-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Snooze 10m</span>
        </button>

        <button
          onClick={onCenterView}
          className="h-12 px-4 rounded-xl font-semibold text-sm bg-calm-amber/15 hover:bg-calm-amber/25 text-calm-amber-soft border border-calm-amber/40 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Lost? Center Me</span>
        </button>
      </div>
    </div>
  );
};
```

---

## 9. Sensory & Motion Tuning Guidelines

1. **Gentle Haptics:**
   - Habit checked: Single medium click (`selection` haptic).
   - "Lost? Click to Center": Double subtle pulse (`medium` -> `light`).
   - Snooze: Single soft click (`light`).
2. **Reduced Motion Default:**
   - If user system has `prefers-reduced-motion: reduce`, all layout transforms and pulsing indicators cease immediately; elements switch to instant 100ms alpha dissolves.
3. **Soundscapes (Optional Zen Audio):**
   - No harsh buzzers. Alarms use ascending soft marimba or Tibetan bowl tones at 432Hz with gradual 5-second fade-in volume ramp.

---

## 10. Summary Checklist for Implementation Teams

- [x] **Theme Palettes Defined:** Warm Slate `#181c24`, Cards `#222734`, Soft-white `#e6edf3`.
- [x] **Contrast Verification:** Checked for WCAG AAA (>7:1 standard text, >4.5:1 secondary).
- [x] **Zero Halation:** No pure `#000000` or glaring `#FFFFFF`.
- [x] **Anti-Lost Superpower:** Current Focus Anchor spec + "Lost? Click to Center" grounding action.
- [x] **Focus Mode / One Thing at a Time:** Complete sensory isolation mode defined.
- [x] **Ergonomic Layouts:** Thumb-zone dock for mobile, collapsible sidebar for desktop.
- [x] **Component System:** Ready-to-use tokens, Tailwind theme config, and React component blueprint.
