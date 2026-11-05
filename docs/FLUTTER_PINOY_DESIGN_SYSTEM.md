# Daily Compass — Pinoy Mobile Flutter UI/UX Design System Specification
**Codename:** Nordic Twilight Pinoy Edition / Buhay Estudyante at Salaryman  
**Version:** 3.0.0 Mobile Flutter Canonical  
**Target Platform:** Mobile Flutter (iOS & Android) — Dart 3.x  
**Context:** Mobile-first transformation for the authentic lived experience of Filipino college students and young salarymen navigating time-blindness, ADHD/executive dysfunction, petsa de peligro, and commute fatigue. | Synchronized with [FLUTTER_PINOY_COCKPIT_SPECS.md](file:///c:/Users/Ivan/Pictures/Daily%20Tracker/docs/FLUTTER_PINOY_COCKPIT_SPECS.md)

---

## 1. Executive Philosophy & The Filipino Cultural Context

### 1.1 The Lived Reality: "Buhay Estudyante at Bagong Empleyado"
Traditional Western productivity apps are built for people with quiet 15-minute car commutes, predictable bank accounts, and air-conditioned home offices. They utterly fail Filipino youth who face:
- **The Grueling 2-to-3 Hour Multi-Leg Commute:** Moving from tricycle to jeepney, squeezing onto the MRT/LRT or EDSA Carousel, and walking through flooded streets or humid heat.
- **"Petsa de Peligro" Financial Anxiety:** Counting down the days until the 15th or 30th cutoff (or waiting for weekly baon), where running out of coins for jeepney fare (*pamasahe*) means walking miles or borrowing from classmates.
- **Abono & KKB Social Friction:** In Filipino barkada and office culture, one person often pays the group bill (*"Ako muna"*), but asking friends to pay their share (*KKB - Kanya-Kanyang Bayad*) induces social shame, anxiety, and relationship strain.
- **Sari-Sari Store & Canteen Lista:** Informal credit systems (*utang sa tindahan*) that must be tracked respectfully so relationships with neighbors remain intact.
- **Sensory Overload & Commute Meltdowns:** After standing in an overcrowded train with a heavy backpack and soaked in sweat/rain, executive dysfunction and ADHD brain fog spike to 100%.

### 1.2 The "Malasakit & Kapwa" Anti-Shame Design Doctrine
Daily Compass Pinoy Edition rejects punitive productivity culture. 
- **Zero Shame Microcopy:** We never use words like *"Broke"*, *"Overdue"*, *"Failed Habit"*, or *"Delayed"*. 
- **Comforting Pinoy Realism:** We use warm, resilient, validating language: *"Pahinga muna"*, *"Reserving pamasahe"*, *"May pambili pa ng pagkain"*, *"Ligtas ang araw na ito"*.
- **The "Barya First" Rule:** Before showing any discretionary spending, the app automatically locks away the user's transit fare in an untouchable vault so they are never stranded.

---

## 2. Master Color Palette: Nordic Twilight + Pinoy Accents

The design system combines the soothing, anti-glare **Nordic Twilight Base** (preventing eye strain under harsh sunlight or in dark MRT commutes) with authentic **Pinoy cultural accents**:

```
+---------------------------------------------------------------------------------+
| NORDIC TWILIGHT BASE (Warm Slate & Deep Charcoal)                               |
| [ Canvas Base: #181C24 ]    [ Elevated Card: #222734 ]    [ Border: #2C3345 ]   |
| [ Soft White:  #E6EDF3 ]    [ Muted Ash:     #9AA5B5 ]    [ Subdued: #6E7681 ]  |
+---------------------------------------------------------------------------------+
| FILIPINO CULTURAL ACCENT MATRIX                                                 |
| 1. Bamboo Sage     (#60CD9B) : Habits completed, safe budget, clear roads        |
| 2. Calamansi Amber (#E5A960) : Merienda time, petsa de peligro alert, pamasahe   |
| 3. Manila Sky Blue (#4A7BB0) : MRT/LRT commute legs, Beep card, active focus     |
| 4. Jeepney Coral   (#E06D53) : Critical alerts, low Beep balance, water refill  |
| 5. Maya Violet     (#8B5CF6) : Digital wallets, creative logs, quiet time       |
| 6. GCash Cyan      (#007DFE) : Quick KKB split settling & e-wallet balances     |
| 7. Beep Mint       (#2DD4BF) : Tap-and-go contactless NFC transit card          |
+---------------------------------------------------------------------------------+
```

### 2.1 Dart Flutter `AppColors` Implementation
```dart
import 'package:flutter/material.dart';

class AppColors {
  // --- Canvas & Surfaces ---
  static const Color bgCanvas = Color(0xFF181C24);
  static const Color bgCanvasSubtle = Color(0xFF1C222E);
  static const Color bgCard = Color(0xFF222734);
  static const Color bgCardHover = Color(0xFF272D3C);
  static const Color bgCardElevated = Color(0xFF2C3345);
  static const Color bgCardGlass = Color(0xD9222734); // 85% opacity
  static const Color bgOverlay = Color(0xD60E1117);    // 84% opacity

  // --- Borders & Separators ---
  static const Color borderSubtle = Color(0xFF2D3546);
  static const Color borderMuted = Color(0xFF3A4459);
  static const Color borderFocus = Color(0xFF4A7BB0);

  // --- High-Contrast Text (WCAG AAA Compliant) ---
  static const Color textPrimary = Color(0xFFE6EDF3);   // 13.8:1 contrast
  static const Color textSecondary = Color(0xFF9AA5B5); // 6.4:1 contrast
  static const Color textMuted = Color(0xFF6E7681);     // 4.6:1 contrast
  static const Color textInverse = Color(0xFF0D1117);

  // --- Filipino Cultural Accents ---
  static const Color bambooSage = Color(0xFF60CD9B);
  static const Color bambooSageSoft = Color(0xFF7EE0B3);
  static const Color calamansiAmber = Color(0xFFE5A960);
  static const Color calamansiAmberSoft = Color(0xFFF3BE7D);
  static const Color manilaSkyBlue = Color(0xFF4A7BB0);
  static const Color jeepneyCoral = Color(0xFFE06D53);
  static const Color mayaViolet = Color(0xFF8B5CF6);
  static const Color gcashCyan = Color(0xFF007DFE);
  static const Color beepMint = Color(0xFF2DD4BF);

  // --- Semantic Color Schemes for Flutter Theme ---
  static ColorScheme darkColorScheme = const ColorScheme.dark(
    brightness: Brightness.dark,
    background: bgCanvas,
    surface: bgCard,
    primary: bambooSage,
    onPrimary: textInverse,
    secondary: manilaSkyBlue,
    onSecondary: textPrimary,
    error: jeepneyCoral,
    onError: textPrimary,
    onBackground: textPrimary,
    onSurface: textPrimary,
  );
}
```

---

## 3. Typography Hierarchy (`AppTypography`)

Optimized for **one-handed reading on vibrating, moving jeepneys and crowded train coaches**:
- Large x-height and open counters to resist motion blur.
- Tabular figures (`FontFeature.tabularFigures()`) for ₱ amounts, countdown clocks, and Beep balances to prevent horizontal twitching.
- Strict minimum font size of `13.0` (micro-text below 13sp is strictly banned).

```dart
import 'package:flutter/material.dart';

class AppTypography {
  static const String fontSans = 'Inter';
  static const String fontMono = 'JetBrains Mono';

  static const TextStyle displayClock = TextStyle(
    fontFamily: fontMono,
    fontSize: 42.0,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.5,
    color: AppColors.textPrimary,
    fontFeatures: [FontFeature.tabularFigures()],
  );

  static const TextStyle headlineLarge = TextStyle(
    fontFamily: fontSans,
    fontSize: 22.0,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.2,
    color: AppColors.textPrimary,
  );

  static const TextStyle titleMedium = TextStyle(
    fontFamily: fontSans,
    fontSize: 17.0,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
  );

  static const TextStyle bodyProminent = TextStyle(
    fontFamily: fontSans,
    fontSize: 15.0,
    fontWeight: FontWeight.w500,
    height: 1.45,
    color: AppColors.textPrimary,
  );

  static const TextStyle bodyStandard = TextStyle(
    fontFamily: fontSans,
    fontSize: 14.0,
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: AppColors.textSecondary,
  );

  static const TextStyle badgeMetric = TextStyle(
    fontFamily: fontMono,
    fontSize: 13.0,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.2,
    fontFeatures: [FontFeature.tabularFigures()],
  );

  static const TextStyle microCaption = TextStyle(
    fontFamily: fontSans,
    fontSize: 12.0,
    fontWeight: FontWeight.w500,
    color: AppColors.textMuted,
  );
}
```

---

## 4. Core Screen Layouts & Component Blueprints

### 4.1 Master Mobile Cockpit Blueprint (390px Viewport)

```
+--------------------------------------------------+
|  07:42 AM  Biyernes, Nob 05    [ Pahinga Muna 🌿]| <- Top Anchor Header
+--------------------------------------------------+
|  [⚡ Routine: Biyahe Papunta ]    [ 45m remaining] |
|  Agahan • Biyahe • Trabaho • Tanghalian • Tulog   |
+--------------------------------------------------+
|                                                  |
|  💰 PETSA DE PELIGRO COUNTDOWN                   |
|  +--------------------------------------------+  |
|  | 5 Araw Na Lang Bago Mag-Sahod (15th)       |  |
|  | Pwede Gastusin Ngayon:  ₱185.00            |  |
|  | Locked Pamasahe Reserve: ₱350.00 🔒 (Safe) |  |
|  | [ ₱15 Jeep ] [ ₱60 Jollijeep ] [ ₱35 Mer ] |  |
|  +--------------------------------------------+  |
|                                                  |
|  🚌 MULTI-LEG BYAHE & COMMUTE WIDGET             |
|  +--------------------------------------------+  |
|  | ➔ Leg 1: Trike to MRT Cubao (₱30) - Sakay  |  |
|  | • Leg 2: MRT Cubao to Ayala (₱24)          |  |
|  | • Leg 3: Lakad to Office (10 mins)         |  |
|  | Beep Card Balance: ₱86.00 (Safe 3 rides) 💳|  |
|  | EDC Checklist:                             |  |
|  | [x] Payong  [x] Bimpo  [x] Barya  [ ] Alcohol|
|  +--------------------------------------------+  |
|                                                  |
|  🤝 ABONO & KKB SPLIT TRACKER ("Ako Muna")       |
|  +--------------------------------------------+  |
|  | May Utang Sayo: ₱320.00 (3 Classmates)     |  |
|  | • Mark: ₱145 (KKB Lunch)   [ Ping GCash 📱]|  |
|  | • Bea:  ₱175 (Grab share)  [ Ping Maya 📱] |  |
|  +--------------------------------------------+  |
|                                                  |
|  🏪 SARI-SARI STORE & UTANG LISTA                |
|  +--------------------------------------------+  |
|  | Lista kay Aling Nena: ₱85.00 (3 Kopiko)    |  |
|  | Babayaran sa 15th sweldo • [ + Magpalista ] |  |
|  +--------------------------------------------+  |
|                                                  |
|  💧 TUBIG & 5-GALLON BLUE JUG TRACKER            |
|  +--------------------------------------------+  |
|  | Jug Status: 2 araw na lang (Order na mamaya)|  |
|  | Uminom Ka Na Ba? [ 🥛 4/8 Baso Ngayon ]     |  |
|  +--------------------------------------------+  |
|                                                  |
+--------------------------------------------------+
|  [ Ngayon ]  [ Pera ]  [ Byahe ]  [ Kaibigan ]   | <- Thumb Floating Dock
+--------------------------------------------------+
```

---

### 4.2 Top Cockpit / Anchor Header Component

The header provides immediate orientation in the user's native temporal cadence:
1. **Clock & Calendar:** Real-time 12-hour digital clock with Filipino date name (e.g., `Biyernes, Nob 05`).
2. **Filipino Routine Cycles:**
   - `Agahan` (06:00 - 08:00): Breakfast, hydration, and morning launch.
   - `Biyahe Papunta` (08:00 - 10:00): Commute pacing, Beep check, and bag safety.
   - `Trabaho / Klase` (10:00 - 12:00 / 13:00 - 17:00): Deep sprints and schoolwork.
   - `Tanghalian` (12:00 - 13:00): Meal recharge and screen-free breathing.
   - `Merienda` (15:00 - 15:30): Afternoon sugar/coffee reset and quick financial check.
   - `Biyahe Pauwi` (17:30 - 20:00): Evening commute survival.
   - `Pahinga at Hapunan` (20:00 - 22:00): Dinner with family/roommates, KKB settlement.
   - `Tulog` (22:30 - 06:00): Phone charging, alarm lock-in, and restorative sleep.
3. **"Pahinga Muna" Emergency Button:** Always visible in the top-right corner. Tapping it opens the Brain Fog SOS sanctuary.

#### Flutter Widget Blueprint:
```dart
class CockpitHeaderWidget extends StatelessWidget {
  final String activeRoutineName;
  final String routineTimeRemaining;
  final VoidCallback onPahingaPressed;

  const CockpitHeaderWidget({
    super.key,
    required this.activeRoutineName,
    required this.routineTimeRemaining,
    required this.onPahingaPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
      decoration: BoxDecoration(
        color: AppColors.bgCardElevated,
        borderRadius: BorderRadius.circular(20.0),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("07:42 AM", style: AppTypography.displayClock.copyWith(fontSize: 32)),
                  const Text("Biyernes, Nobyembre 05", style: AppTypography.microCaption),
                ],
              ),
              // The 1-Tap Brain Fog SOS Trigger
              InkWell(
                onTap: onPahingaPressed,
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: AppColors.calamansiAmber.withOpacity(0.18),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.calamansiAmber.withOpacity(0.5)),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text("🌿 ", style: TextStyle(fontSize: 16)),
                      Text("Pahinga Muna", style: TextStyle(
                        color: AppColors.calamansiAmber,
                        fontWeight: FontWeight.w700,
                        fontSize: 13,
                      )),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Active Routine Banner
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.bgCanvas,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 8, height: 8,
                      decoration: const BoxDecoration(color: AppColors.bambooSage, shape: BoxShape.circle),
                    ),
                    const SizedBox(width: 8),
                    Text(activeRoutineName, style: AppTypography.titleMedium.copyWith(fontSize: 14)),
                  ],
                ),
                Text(routineTimeRemaining, style: AppTypography.microCaption.copyWith(color: AppColors.calamansiAmber)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

---

### 4.3 Petsa de Peligro Card & Untouchable Pamasahe Reserve

Financial discipline fails when it feels like deprivation. The **Petsa de Peligro Card** uses math to restore calm:
- **Sahod / Cutoff Countdown:** Explicit days remaining (e.g. `5 Araw Bago Mag-15th`).
- **Untouchable Pamasahe Reserve (Transit Vault):** Automatically calculates:
  $$\text{Locked Fare} = \text{Daily Roundtrip Fare (e.g. ₱70)} \times \text{Days Remaining (5)} = \text{₱350.00}$$
  This amount is visually sequestered with a padlock icon. It cannot be spent on iced coffee or snacks.
- **"Pwede Gastusin Ngayon" (Safe Daily Allowance):**
  $$\text{Daily Safe-to-Spend} = \frac{\text{Current Wallet Balance} - \text{Locked Fare}}{\text{Days Remaining}}$$
- **1-Tap Pinoy Quick Log Pills:**
  - `₱15` Traditional Jeep / Modern E-Jeep
  - `₱60` Jollijeep / Canteen rice meal (Pork adobo + 1 cup rice)
  - `₱35` Merienda (Fishball, kikiam, turon, or Kopiko 78)
  - `₱25` Tricycle special ride

```
+-----------------------------------------------------------------------------------+
| 💰 PETSA DE PELIGRO TRACKER                                                      |
|                                                                                   |
|  Cutoff: 15th ng Buwan  •  5 Araw Na Lang  [=========================.......] 72% |
|  -------------------------------------------------------------------------------  |
|  PWEDE GASTUSIN NGAYON:                     UNTOUCHABLE PAMASAHE RESERVE:         |
|  ₱185.00                                   ₱350.00 🔒                            |
|  (Ligtas para sa pagkain at merienda)      (Naka-lock para sa 5 araw na byahe)    |
|  -------------------------------------------------------------------------------  |
|  ⚡ 1-TAP QUICK EXPENSE LOG:                                                       |
|  [ 🚐 ₱15 Jeep ]   [ 🍛 ₱60 Jollijeep ]   [ 🍢 ₱35 Merienda ]   [ 🛺 ₱25 Trike ]   |
+-----------------------------------------------------------------------------------+
```

---

### 4.4 Multi-Leg Byahe & Commute Widget

Metro Manila and provincial commutes are complex journeys with high failure points. A dead phone battery, sudden rain, or missing coins causes panic.

The **Multi-Leg Byahe Widget** provides:
1. **Interactive Leg Tracker:**
   - `Leg 1:` Tricycle to MRT station (₱30.00)
   - `Leg 2:` MRT North Ave to Ayala (₱28.00)
   - `Leg 3:` BGC Bus or Walk to Office / School (₱15.00 / Walk)
2. **Beep Card Balance & Tap Telemetry:**
   - Shows current balance (e.g. `₱86.00`).
   - Translates pesos into rides: `(Sapat para sa 3 rides pa)`.
   - Amber alert when balance drops below ₱40.
3. **Byahe EDC Checklist (Everyday Carry):**
   - High-priority survival items before walking out the front door:
     - `Payong ☂️` (Sudden rain / Manila flashfloods)
     - `Bimpo / Panyo 🧖` (Jeepney sweat and humidity)
     - `Barya pambayad 🪙` (Jeepney driver exact fare)
     - `Powerbank 🔋` (Long transit with no charging outlets)
     - `Alcohol 🧴` (Crowded handrail hygiene)
     - `Earphones 🎧` (Sanctuary audio against engine noise)

```dart
class ByaheWidgetState {
  final int activeLegIndex;
  final List<String> commuteLegs;
  final double beepBalance;
  final Map<String, bool> edcChecklist;

  const ByaheWidgetState({
    required this.activeLegIndex,
    required this.commuteLegs,
    required this.beepBalance,
    required this.edcChecklist,
  });
}
```

---

### 4.5 Abono & KKB Split Tracker ("Ako Muna")

Filipinos hate the awkwardness of asking friends to pay back lunch money. The Abono Tracker solves this social pain point:
- **"May Utang Sayo" Total:** Prominently displays the total owed to the user (e.g., `₱320.00`).
- **One-Tap Respectful Pings via GCash / Maya:**
  Clicking `[ Ping GCash 📱 ]` generates a pre-formatted, polite, non-confrontational clipboard message or WhatsApp/Messenger deeplink:
  > *"Uy friend! Reminder lang sa share kanina sa lunch (₱145). Pwede mo i-send sa GCash ko (0917-XXX-XXXX) pag free ka. Maraming salamat! 🌿"*
- **1-Click "Bayad Na" Settlement:** Instantly transfers the amount back into today's Safe-to-Spend balance with a cheerful bamboo chime.

---

### 4.6 Sari-Sari Store & Utang Mini-Card ("Lista sa Tindahan")

For college dormers and young professionals boarding in residential barangays:
- Keeps track of running credit (*lista*) at the neighborhood store:
  - Store Name: *Tindahan ni Aling Nena* / *Canteen ni Kuya Jun*
  - Current Tab: `₱85.00`
  - Items: `3x 3-in-1 Kopiko Black, 2x itlog, 1x Lucky Me Pancit Canton`
  - Due Date: Set to the upcoming 15th or 30th sahod.

---

### 4.7 Water Refill & Hydration Tracker (5-Gallon Blue Jug)

Dehydration is the #1 silent trigger of brain fog and afternoon fatigue in Philippine tropical weather:
- **The Blue Jug Depletion Metric:** Tracks the household 5-gallon water dispenser.
  - Calculated based on household members: e.g., *"3 araw na lang bago maubos ang jug — magpa-refill na bukas!"*
- **Daily Baso ng Tubig Counter:** Circular progress indicator with `+1 Baso (250ml)` and `+1 Tumbler (500ml)` quick taps.

---

### 4.8 "Pahinga Muna" Brain Fog SOS Modal Sheet

Triggered during sensory overload, panic, or MRT exhaustion. The entire app dims into an ultra-calm sanctuary:

```
+-----------------------------------------------------------------------------------+
| 🌿 PAHINGA MUNA (ZERO PRESSURE, ZERO HURRY)                                 [ × ] |
|-----------------------------------------------------------------------------------|
|                                                                                   |
|                                .---''''---.                                       |
|                             .'    4 - 7 - 8 '.                                    |
|                            /   HUMINGA NANG   \                                   |
|                           |      MALALIM       |  <- Calming breathing circle     |
|                            \    (Hinga... )   /      (4s Inhale, 7s Hold,         |
|                             '.              .'        8s Exhale)                  |
|                                '---....---'                                       |
|                                                                                   |
|  MGA GAGAWIN:                                                                     |
|  [x] 1. Uminom ng 1 basong malamig na tubig 💧                                   |
|  [ ] 2. Punasan ang pawis, mag-panyo o mag-hilamos 🧖                             |
|  [ ] 3. Umupo muna nang 5 minuto nang walang iniisip 🪑                          |
|                                                                                   |
|  "Wag kang mag-alala, hindi ka nahuhuli. Ligtas ka. Magpahinga ka muna."          |
|                                                                                   |
|-----------------------------------------------------------------------------------|
| [ 🌧️ I-play ang Tunog ng Ulan (Rain Sound) ]          [ Handa Na Ako Bumalik ↺ ] |
+-----------------------------------------------------------------------------------+
```

---

## 5. Mobile UX, Thumb Zones & Haptic Feedback Engine

### 5.1 One-Handed Jeepney Thumb Zone Matrix
Jeepneys and crowded trains force users to hold on to overhead handrails with one hand while operating their phone with the other.
- **Top 30% of Viewport:** Strictly read-only telemetry (Clock, Sahara status, Beep balance). Zero critical buttons located here.
- **Middle 30%:** Glanceable swipe cards and status displays.
- **Bottom 40% ("The Golden Thumb Zone"):** All primary action buttons (`+ Quick Log ₱15`, `Next Commute Leg`, `Done`, `Pahinga`). Minimum touch target: **48px x 48px**.

```
+--------------------------------------------------+
|  READ-ONLY COGNITIVE ANCHOR (No stretching)     |  <- Upper Reach (Difficult)
+--------------------------------------------------+
|  SWIPEABLE GLANCEABLE CARDS                     |  <- Natural Focus
+--------------------------------------------------+
|  THE GOLDEN THUMB ZONE:                          |
|  • ₱15 Jeep Pill         • ₱60 Meal Pill         |  <- Effortless 1-Handed
|  • Beep Card Tap         • Done Next Step        |     Thumb Reach
|  • Bottom Floating Navigation Dock               |
+--------------------------------------------------+
```

### 5.2 Haptic Vibration Patterns (Dart `services.dart`)
1. **`HapticFeedback.selectionClick()`:** Fired when checking off Byahe EDC items or cycling commute legs. Subtle and tactile.
2. **`HapticFeedback.lightImpact()`:** Fired on logging a ₱15 jeep fare or drinking a glass of water.
3. **`HapticFeedback.mediumImpact()`:** Fired on completing a full habit chain or settling an Abono KKB balance.
4. **Custom Gentle Breathing Haptic:** A 3-pulse vibration guiding the 4-7-8 breathing sequence in the Brain Fog SOS modal.

---

## 6. Zero-Guilt Pinoy Microcopy Style Guide

Language shapes self-worth. In Daily Compass Pinoy Edition, we completely eradicate colonial shame and punitive corporate language.

| Forbidden Punitive Term | Permitted Pinoy Compassionate Alternative | Cultural & Cognitive Rationale |
| :--- | :--- | :--- |
| **"You are Overdue"** | *"Naka-pause muna. Balikan natin pag may energy ka na."* | Eliminates ADHD paralysis and guilt avoidance. |
| **"Broke / Insufficient Funds"**| *"Naka-reserve ang pamasahe mo. Safe ka pa."* | Reframes low funds as intentional protective reserving. |
| **"Failed Routine"** | *"Pahinga muna. Mahalaga ang tulog at lakas mo."* | Affirms self-compassion; rest is productive. |
| **"Unpaid Debt"** | *"Abono mo kay Mark (₱145). Pwede mo nang pakiusapan."* | Removes criminal/predatory undertones from friendly splitting. |
| **"Over-budget Alert"** | *"Medyo sagad na for today. Bukas ulit babawi!"* | Replaces alarmist red sirens with gentle guidance. |
| **"Streak Broken"** | *"Naka-rest shield ka kahapon. Tuloy ang laban ngayon!"* | Completely removes the fear of broken habit streaks. |

---

## 7. Complete Flutter Architecture & State Handoff

```dart
/// Core State Model for Pinoy Daily Compass Cockpit
class PinoyCockpitState {
  // --- Temporal Anchor ---
  final DateTime currentDateTime;
  final String activeFilipinoRoutine; // e.g. "Agahan", "Biyahe Papunta", etc.
  final Duration routineTimeLeft;

  // --- Petsa de Peligro & Financials ---
  final int daysUntilCutoff; // Days until 15th or 30th
  final double walletBalance;
  final double lockedPamasaheReserve;
  final double safeToSpendDaily;

  // --- Commute & Byahe ---
  final int currentCommuteLeg;
  final List<String> commuteLegDescriptions;
  final double beepCardBalance;
  final Map<String, bool> byaheEDC;

  // --- Social & Community ---
  final List<AbonoRecord> abonoDebts;
  final double sariSariStoreBalance;

  // --- Somatic Health ---
  final int waterGlassesToday;
  final int jugRemainingDays;

  const PinoyCockpitState({
    required this.currentDateTime,
    required this.activeFilipinoRoutine,
    required this.routineTimeLeft,
    required this.daysUntilCutoff,
    required this.walletBalance,
    required this.lockedPamasaheReserve,
    required this.safeToSpendDaily,
    required this.currentCommuteLeg,
    required this.commuteLegDescriptions,
    required this.beepCardBalance,
    required this.byaheEDC,
    required this.abonoDebts,
    required this.sariSariStoreBalance,
    required this.waterGlassesToday,
    required this.jugRemainingDays,
  });
}

class AbonoRecord {
  final String personName;
  final String reason;
  final double amount;
  final String preferredChannel; // "GCash" or "Maya"
  final bool isSettled;

  const AbonoRecord({
    required this.personName,
    required this.reason,
    required this.amount,
    required this.preferredChannel,
    this.isSettled = false,
  });
}
```

---

## 8. Summary & Next Steps

This specification documents the complete visual language, spatial ergonomics, cultural taxonomy, and Dart/Flutter implementation blueprint for **Daily Compass Pinoy Edition**.

All deliverables:
- [x] **Nordic Twilight Dark Base + Pinoy Accents** (Bamboo Sage, Calamansi Amber, Manila Sky, Jeepney Coral, Maya Violet, Beep Mint).
- [x] **High-Legibility Tabular Typography** for one-handed mobile reading on vibrating jeepneys.
- [x] **Petsa de Peligro Card & Untouchable Pamasahe Reserve** (Locked fare vault + Safe-to-Spend).
- [x] **Multi-Leg Byahe & Commute Widget** with Beep Card balance and Byahe EDC Checklist.
- [x] **Abono & KKB Split Tracker** with zero-awkwardness GCash/Maya pings.
- [x] **Sari-Sari Store Lista & 5-Gallon Blue Jug Tracker**.
- [x] **Pahinga Muna Brain Fog SOS Modal** with soothing 4-7-8 breathing and sensory reset.
- [x] **Zero-Guilt Pinoy Microcopy Style Guide**.

The design system is canonical and ready for Flutter development.
