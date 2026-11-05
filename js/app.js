/* ==========================================================================
   DAILY COMPASS — APPLICATION CONTROLLER (js/app.js)
   v2.0 Pro Max Operating System:
   - Anti-overwhelm focus anchor & live clock
   - Energy battery gauge (Spoon theory) & Gentle Mode
   - Hydration ring & Medication tracker with double-dose safety lock
   - Schedule elastic quick-shift engine (+15m, +30m, +1h, Snap to now)
   - Focus Sprint timer (15m, 25m, 50m) & Procedural ambient soundscapes (Pink Rain, 10Hz Alpha, Tibetan Drone)
   - Global Omnibar command palette (Cmd+K / Ctrl+K)
   - Recurring subscriptions & End-of-month cash buffer projection
   - Pure SVG Weekly habit heatmap & Category breakdown donut chart
   - 7-Day Rolling automated snapshots & time-machine recovery
   - Web Audio harmonic chimes and alarms loop
   ========================================================================== */

import { store, getLocalDateString } from './store.js';
import { soundEngine } from './audio.js';

// --- Global UI State Variables ---
let currentView = 'today';
let currentDebtTab = 'they_owe_me';
let currentTxFilter = 'all';
let currentScratchTag = 'All';
let isFocusMode = false;
let firedAlarmsToday = new Set();
let breathingInterval = null;

// Focus Sprint Timer State
let sprintTimerInterval = null;
let sprintSecondsRemaining = 25 * 60;
let sprintIsRunning = false;
let sprintModeMinutes = 25;

// Schedule Shift Undo Timeout
let shiftUndoTimeout = null;

// --- Helper Formatting Utilities ---
function getTodayDateString() {
  return getLocalDateString(0);
}

function formatCurrency(amount) {
  const state = store.getState();
  const symbol = state.profile?.currency || '$';
  return `${symbol}${Number(amount || 0).toFixed(2)}`;
}

function formatTimeString(hhmm, format = '12h') {
  if (!hhmm) return '--:--';
  if (format === '24h') return hhmm;
  const [hStr, mStr] = hhmm.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
}

// --- DOM References ---
const dom = {
  // Navigation & Views
  views: document.querySelectorAll('.view-section'),
  sidebarNavItems: document.querySelectorAll('.nav-menu .nav-item'),
  mobileDockBtns: document.querySelectorAll('.mobile-dock-btn'),

  // Header & Clock
  headerTime: document.getElementById('header-time-clock'),
  headerDate: document.getElementById('header-date-text'),
  heroClock: document.getElementById('hero-master-clock'),
  heroDate: document.getElementById('hero-master-date'),
  dayProgressPercent: document.getElementById('day-progress-percent'),
  dayProgressBar: document.getElementById('day-progress-bar'),

  // Energy Battery & Gentle Mode
  headerBatteryPill: document.getElementById('header-battery-pill'),
  batteryTextLevel: document.getElementById('battery-text-level'),
  batteryGentleBadge: document.getElementById('battery-gentle-badge'),
  gentleModeBanner: document.getElementById('gentle-mode-banner'),
  btnExitGentle: document.getElementById('btn-exit-gentle'),

  // Header Quick Action Buttons
  btnOpenOmnibar: document.getElementById('btn-open-omnibar'),
  btnOpenSprint: document.getElementById('btn-open-sprint'),
  btnHeaderGrounding: document.getElementById('btn-header-grounding'),
  btnSidebarGrounding: document.getElementById('btn-sidebar-grounding'),
  btnFocusToggle: document.getElementById('btn-focus-toggle'),
  focusToggleLabel: document.getElementById('focus-toggle-label'),
  focusExitBanner: document.getElementById('focus-exit-banner'),
  btnExitFocus: document.getElementById('btn-exit-focus'),
  btnQuickNote: document.getElementById('btn-quick-note'),

  // Anchor / Today
  anchorRoutineChip: document.getElementById('anchor-routine-chip'),
  anchorTimeRemaining: document.getElementById('anchor-time-remaining'),
  anchorImmediateTask: document.getElementById('anchor-immediate-task'),
  btnCompleteImmediate: document.getElementById('btn-complete-immediate-step'),
  todayRoutineStream: document.getElementById('today-routine-stream'),

  // Quick Metrics Row
  metricSafeSpend: document.getElementById('metric-safe-spend'),
  metricSpentToday: document.getElementById('metric-spent-today'),
  metricWaterRatio: document.getElementById('metric-water-ratio'),
  metricWaterSub: document.getElementById('metric-water-sub'),
  metricNextAlarm: document.getElementById('metric-next-alarm'),
  metricNextAlarmLabel: document.getElementById('metric-next-alarm-label'),
  metricNetDebt: document.getElementById('metric-net-debt'),

  // Sidebar Badges
  sidebarStepBadge: document.getElementById('sidebar-step-badge'),
  sidebarSafeBadge: document.getElementById('sidebar-safe-badge'),
  sidebarHabitBadge: document.getElementById('sidebar-habit-badge'),
  sidebarNotesBadge: document.getElementById('sidebar-notes-badge'),

  // Hydration & Medications
  waterProgressCircle: document.getElementById('water-progress-circle'),
  waterDisplayMl: document.getElementById('water-display-ml'),
  waterDisplayTarget: document.getElementById('water-display-target'),
  btnWater250: document.getElementById('btn-water-250'),
  btnWater500: document.getElementById('btn-water-500'),
  btnWater750: document.getElementById('btn-water-750'),
  btnWaterUndo: document.getElementById('btn-water-undo'),
  medicationsListContainer: document.getElementById('medications-list-container'),
  btnOpenAddMed: document.getElementById('btn-open-add-med'),

  // Schedule Quick-Shift Bar & Toast
  btnShift15: document.getElementById('btn-shift-15'),
  btnShift30: document.getElementById('btn-shift-30'),
  btnShift60: document.getElementById('btn-shift-60'),
  btnSnapNow: document.getElementById('btn-snap-now'),
  shiftToastUndo: document.getElementById('shift-toast-undo'),
  shiftToastText: document.getElementById('shift-toast-text'),
  btnUndoShift: document.getElementById('btn-undo-shift'),

  // Cash / Budget
  statDailyLimit: document.getElementById('stat-daily-limit'),
  statTodaySpent: document.getElementById('stat-today-spent'),
  statSafeLeft: document.getElementById('stat-safe-left'),
  budgetProgressFill: document.getElementById('budget-progress-fill'),
  quickExpensePills: document.getElementById('quick-expense-pills'),
  transactionsList: document.getElementById('transactions-list'),
  btnOpenAddTx: document.getElementById('btn-open-add-tx'),
  filterTxAll: document.getElementById('filter-tx-all'),
  filterTxExpense: document.getElementById('filter-tx-expense'),
  filterTxIncome: document.getElementById('filter-tx-income'),

  // Subscriptions & Month Buffer
  btnOpenAddSub: document.getElementById('btn-open-add-sub'),
  bufferForecastVal: document.getElementById('buffer-forecast-val'),
  bufferForecastDesc: document.getElementById('buffer-forecast-desc'),
  bufferGaugeCard: document.getElementById('buffer-gauge-card'),
  subscriptionsListGrid: document.getElementById('subscriptions-list-grid'),

  // Expense Donut Chart (Pure SVG)
  svgCategoryDonut: document.getElementById('svg-category-donut'),
  categoryLegendList: document.getElementById('category-legend-list'),

  // Debt & Credit
  tabDebtLent: document.getElementById('tab-debt-lent'),
  tabDebtBorrowed: document.getElementById('tab-debt-borrowed'),
  summaryTotalLent: document.getElementById('summary-total-lent'),
  summaryTotalBorrowed: document.getElementById('summary-total-borrowed'),
  summaryNetDebt: document.getElementById('summary-net-debt'),
  debtCardsGrid: document.getElementById('debt-cards-grid'),
  btnOpenAddDebt: document.getElementById('btn-open-add-debt'),

  // Habits & Alarms
  weeklyHeatmapContainer: document.getElementById('weekly-heatmap-container'),
  habitsListGrid: document.getElementById('habits-list-grid'),
  btnOpenAddHabit: document.getElementById('btn-open-add-habit'),
  alarmsListContainer: document.getElementById('alarms-list-container'),
  btnOpenAddAlarm: document.getElementById('btn-open-add-alarm'),

  // Scratchpad
  scratchpadInput: document.getElementById('scratchpad-input'),
  scratchpadTagSelect: document.getElementById('scratchpad-tag-select'),
  btnSaveScratchpad: document.getElementById('btn-save-scratchpad'),
  scratchTagFilters: document.getElementById('scratch-tag-filters'),
  scratchpadNotesGrid: document.getElementById('scratchpad-notes-grid'),

  // Settings & Snapshots
  prefCurrency: document.getElementById('pref-currency'),
  prefTimeFormat: document.getElementById('pref-time-format'),
  prefBudgetCap: document.getElementById('pref-budget-cap'),
  prefWaterGoal: document.getElementById('pref-water-goal'),
  prefSoundPreset: document.getElementById('pref-sound-preset'),
  snapshotsListContainer: document.getElementById('snapshots-list-container'),
  btnCreateSnapshot: document.getElementById('btn-create-snapshot'),
  btnExportBackup: document.getElementById('btn-export-backup'),
  fileImportBackup: document.getElementById('file-import-backup'),
  btnLoadSampleData: document.getElementById('btn-load-sample-data'),
  btnResetData: document.getElementById('btn-reset-data'),

  // Sound Preview Buttons
  previewZenBowl: document.getElementById('preview-zen-bowl'),
  previewTriad: document.getElementById('preview-triad'),
  previewBell: document.getElementById('preview-bell'),
  previewTick: document.getElementById('preview-tick'),
  previewWater: document.getElementById('preview-water'),
  previewRain: document.getElementById('preview-rain'),
  previewAlpha: document.getElementById('preview-alpha'),
  previewDrone: document.getElementById('preview-drone'),

  // Modals
  modalGrounding: document.getElementById('modal-grounding'),
  btnCloseGrounding: document.getElementById('btn-close-grounding'),
  breathingInstruction: document.getElementById('breathing-instruction'),
  groundingDateIndicator: document.getElementById('grounding-date-indicator'),
  btnGroundBreather: document.getElementById('btn-ground-breather'),
  btnGroundCatchup: document.getElementById('btn-ground-catchup'),
  btnGroundRest: document.getElementById('btn-ground-rest'),

  modalAlarmRinging: document.getElementById('modal-alarm-ringing'),
  ringingAlarmTime: document.getElementById('ringing-alarm-time'),
  ringingAlarmLabel: document.getElementById('ringing-alarm-label'),
  btnDismissAlarm: document.getElementById('btn-dismiss-alarm'),
  btnSnooze5: document.getElementById('btn-snooze-5'),
  btnSnooze10: document.getElementById('btn-snooze-10'),
  btnSnooze15: document.getElementById('btn-snooze-15'),

  modalOmnibar: document.getElementById('modal-omnibar'),
  omnibarSearchInput: document.getElementById('omnibar-search-input'),
  omnibarResultsList: document.getElementById('omnibar-results-list'),
  btnCloseOmnibar: document.getElementById('btn-close-omnibar'),

  modalSprint: document.getElementById('modal-sprint'),
  sprintTimerDisplay: document.getElementById('sprint-timer-display'),
  sprintStatusText: document.getElementById('sprint-status-text'),
  btnSprintToggle: document.getElementById('btn-sprint-toggle'),
  btnSprintReset: document.getElementById('btn-sprint-reset'),
  btnSprint15: document.getElementById('btn-sprint-15'),
  btnSprint25: document.getElementById('btn-sprint-25'),
  btnSprint50: document.getElementById('btn-sprint-50'),
  chipPinkRain: document.getElementById('chip-pink-rain'),
  chipAlphaWaves: document.getElementById('chip-alpha-waves'),
  chipTibetanDrone: document.getElementById('chip-tibetan-drone'),
  chipMuteSoundscape: document.getElementById('chip-mute-soundscape'),
  btnCloseSprint: document.getElementById('btn-close-sprint'),

  modalTransaction: document.getElementById('modal-transaction'),
  btnCloseTx: document.getElementById('btn-close-tx'),
  btnCancelTx: document.getElementById('btn-cancel-tx'),
  formTransaction: document.getElementById('form-transaction'),
  txAmount: document.getElementById('tx-amount'),
  txCategory: document.getElementById('tx-category'),
  txNote: document.getElementById('tx-note'),

  modalDebt: document.getElementById('modal-debt'),
  btnCloseDebt: document.getElementById('btn-close-debt'),
  btnCancelDebt: document.getElementById('btn-cancel-debt'),
  formDebt: document.getElementById('form-debt'),
  debtPerson: document.getElementById('debt-person'),
  debtAmount: document.getElementById('debt-amount'),
  debtDueDate: document.getElementById('debt-due-date'),
  debtNote: document.getElementById('debt-note'),

  modalSettleDebt: document.getElementById('modal-settle-debt'),
  btnCloseSettle: document.getElementById('btn-close-settle'),
  btnCancelSettle: document.getElementById('btn-cancel-settle'),
  formSettleDebt: document.getElementById('form-settle-debt'),
  settleDebtId: document.getElementById('settle-debt-id'),
  settleDebtPerson: document.getElementById('settle-debt-person'),
  settleDebtRemaining: document.getElementById('settle-debt-remaining'),
  settleAmount: document.getElementById('settle-amount'),

  modalAlarm: document.getElementById('modal-alarm'),
  btnCloseAlarm: document.getElementById('btn-close-alarm'),
  btnCancelAlarm: document.getElementById('btn-cancel-alarm'),
  formAlarm: document.getElementById('form-alarm'),
  alarmTime: document.getElementById('alarm-time'),
  alarmLabel: document.getElementById('alarm-label'),
  alarmSound: document.getElementById('alarm-sound'),

  modalHabit: document.getElementById('modal-habit'),
  btnCloseHabit: document.getElementById('btn-close-habit'),
  btnCancelHabit: document.getElementById('btn-cancel-habit'),
  formHabit: document.getElementById('form-habit'),
  habitName: document.getElementById('habit-name'),
  habitIcon: document.getElementById('habit-icon'),
  habitTimeOfDay: document.getElementById('habit-time-of-day'),

  modalMedication: document.getElementById('modal-medication'),
  btnCloseMed: document.getElementById('btn-close-med'),
  btnCancelMed: document.getElementById('btn-cancel-med'),
  formMedication: document.getElementById('form-medication'),
  medName: document.getElementById('med-name'),
  medDosage: document.getElementById('med-dosage'),
  medTimeslot: document.getElementById('med-timeslot'),

  modalSubscription: document.getElementById('modal-subscription'),
  btnCloseSub: document.getElementById('btn-close-sub'),
  btnCancelSub: document.getElementById('btn-cancel-sub'),
  formSubscription: document.getElementById('form-subscription'),
  subName: document.getElementById('sub-name'),
  subAmount: document.getElementById('sub-amount'),
  subBillingDay: document.getElementById('sub-billing-day'),
  subCategory: document.getElementById('sub-category'),

  // Routine Block Editor (v2.1 Pro Max Plus)
  btnOpenAddRoutine: document.getElementById('btn-open-add-routine'),
  modalRoutineEditor: document.getElementById('modal-routine-editor'),
  btnCloseRoutineEditor: document.getElementById('btn-close-routine-editor'),
  btnCancelRoutineEditor: document.getElementById('btn-cancel-routine-editor'),
  formRoutineEditor: document.getElementById('form-routine-editor'),
  routineEditorTitle: document.getElementById('routine-editor-title'),
  routineEditId: document.getElementById('routine-edit-id'),
  routineEditTitle: document.getElementById('routine-edit-title'),
  routineEditStart: document.getElementById('routine-edit-start'),
  routineEditEnd: document.getElementById('routine-edit-end'),
  routineEditDurationChip: document.getElementById('routine-edit-duration-chip'),
  routineCategoryPills: document.getElementById('routine-category-pills'),
  routineEditStepsContainer: document.getElementById('routine-edit-steps-container'),
  btnRoutineAddStep: document.getElementById('btn-routine-add-step'),
  btnRoutineAutoBalance: document.getElementById('btn-routine-auto-balance'),
  btnDeleteRoutine: document.getElementById('btn-delete-routine'),

  // Privacy Vault & Balance Masking (v2.1 Pro Max Plus)
  btnPeekPrivacy: document.getElementById('btn-peek-privacy'),
  privacySlashLine: document.getElementById('privacy-slash-line'),
  privacyToggleLabel: document.getElementById('privacy-toggle-label'),
  btnVaultLock: document.getElementById('btn-vault-lock'),
  modalPrivacyPin: document.getElementById('modal-privacy-pin'),
  btnClosePrivacyPin: document.getElementById('btn-close-privacy-pin'),
  vaultModalTitle: document.getElementById('vault-modal-title'),
  vaultModalSubtitle: document.getElementById('vault-modal-subtitle'),
  vaultNoticeBanner: document.getElementById('vault-notice-banner'),
  pinKeypadButtons: document.getElementById('pin-keypad-buttons'),
  pinDotsRow: document.getElementById('pin-dots-row'),
  dot1: document.getElementById('dot-1'),
  dot2: document.getElementById('dot-2'),
  dot3: document.getElementById('dot-3'),
  dot4: document.getElementById('dot-4'),
  linkEmergencyVaultReset: document.getElementById('link-emergency-vault-reset'),

  // Journal & CSV Export (v2.1 Pro Max Plus)
  btnOpenJournalExport: document.getElementById('btn-open-journal-export'),
  btnExportCsvDirect: document.getElementById('btn-export-csv-direct'),
  modalJournalExport: document.getElementById('modal-journal-export'),
  btnCloseJournalExport: document.getElementById('btn-close-journal-export'),
  journalPreviewText: document.getElementById('journal-preview-text'),
  btnCopyJournalClipboard: document.getElementById('btn-copy-journal-clipboard'),
  btnDownloadJournalMd: document.getElementById('btn-download-journal-md'),
  btnDownloadLedgerCsv: document.getElementById('btn-download-ledger-csv')
};

// ==========================================================================
// VIEW ROUTING
// ==========================================================================
function switchView(viewName) {
  currentView = viewName;

  dom.views.forEach((v) => {
    v.classList.remove('active');
    if (v.id === `view-${viewName}`) {
      v.classList.add('active');
    }
  });

  dom.sidebarNavItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });

  dom.mobileDockBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================================================
// REAL-TIME MASTER CLOCK & ROUTINE ENGINE
// ==========================================================================
function initClockAndRoutines() {
  function tick() {
    const now = new Date();
    const state = store.getState();
    const timeFormat = state.profile?.timeFormat || '12h';

    // Format current time
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentHHMM = `${String(hours).padStart(2, '0')}:${minutes}`;

    let clockDisplay = '';
    if (timeFormat === '24h') {
      clockDisplay = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
    } else {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      clockDisplay = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    }

    if (dom.headerTime) dom.headerTime.textContent = clockDisplay;
    if (dom.heroClock) dom.heroClock.textContent = clockDisplay;

    // Date formatting
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString(undefined, dateOptions);
    if (dom.headerDate) dom.headerDate.textContent = dateStr;
    if (dom.heroDate) dom.heroDate.textContent = dateStr;
    if (dom.groundingDateIndicator) dom.groundingDateIndicator.textContent = dateStr;

    // Day Progress Percentage
    const totalSecsToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const dayPercent = Math.min(100, Math.round((totalSecsToday / 86400) * 100));
    if (dom.dayProgressPercent) dom.dayProgressPercent.textContent = `${dayPercent}% of day completed`;
    if (dom.dayProgressBar) dom.dayProgressBar.style.width = `${dayPercent}%`;

    // Routine Anchor Detection
    const routines = state.routines || [];
    let currentRoutine = null;

    for (const r of routines) {
      if (currentHHMM >= r.start && currentHHMM < r.end) {
        currentRoutine = r;
        break;
      }
    }

    if (currentRoutine) {
      if (dom.anchorRoutineChip) {
        dom.anchorRoutineChip.textContent = `Routine: ${currentRoutine.title}`;
      }
      const [endH, endM] = currentRoutine.end.split(':').map(Number);
      const endTotalM = endH * 60 + endM;
      const nowTotalM = now.getHours() * 60 + now.getMinutes();
      const remainM = Math.max(0, endTotalM - nowTotalM);
      if (dom.anchorTimeRemaining) {
        dom.anchorTimeRemaining.textContent = `${remainM} mins`;
      }
    } else {
      if (dom.anchorRoutineChip) {
        dom.anchorRoutineChip.textContent = `Free Unstructured Time`;
      }
      if (dom.anchorTimeRemaining) {
        dom.anchorTimeRemaining.textContent = `No active block`;
      }
    }

    // Alarm Trigger Evaluation
    checkAlarms(currentHHMM, now.getDay());
  }

  tick();
  setInterval(tick, 1000);
}

// ==========================================================================
// ALARM SUBSYSTEM WITH WEB AUDIO CHIMES
// ==========================================================================
let activeRingingAlarm = null;

function checkAlarms(currentHHMM, currentDayIndex) {
  const state = store.getState();
  const alarms = state.alarms || [];
  const triggerKey = `${currentHHMM}-${currentDayIndex}`;

  if (firedAlarmsToday.has(triggerKey)) {
    return;
  }

  for (const alarm of alarms) {
    if (!alarm.enabled) continue;
    if (alarm.days && !alarm.days.includes(currentDayIndex)) continue;

    if (alarm.time === currentHHMM) {
      firedAlarmsToday.add(triggerKey);
      triggerAlarmRing(alarm);
      break;
    }
  }
}

function triggerAlarmRing(alarm) {
  activeRingingAlarm = alarm;
  const state = store.getState();
  const soundPreset = alarm.soundPreset || alarm.sound || state.profile?.soundPreset || 'zen-bowl';

  if (dom.ringingAlarmTime) {
    dom.ringingAlarmTime.textContent = formatTimeString(alarm.time, state.profile?.timeFormat);
  }
  if (dom.ringingAlarmLabel) {
    dom.ringingAlarmLabel.textContent = alarm.label || 'Alarm Notification';
  }

  dom.modalAlarmRinging.classList.add('open');
  soundEngine.playAlarmLoop(soundPreset, 3.2);
}

function dismissRingingAlarm() {
  soundEngine.stopAlarmLoop();
  dom.modalAlarmRinging.classList.remove('open');
  activeRingingAlarm = null;
  soundEngine.playPreset('micro-tick');
}

function snoozeAlarm(minutes) {
  soundEngine.stopAlarmLoop();
  dom.modalAlarmRinging.classList.remove('open');

  if (activeRingingAlarm) {
    const label = activeRingingAlarm.label;
    const sound = activeRingingAlarm.soundPreset || 'zen-bowl';
    activeRingingAlarm = null;

    setTimeout(() => {
      triggerAlarmRing({
        time: '--:--',
        label: `[Snoozed +${minutes}m] ${label}`,
        soundPreset: sound,
        enabled: true
      });
    }, minutes * 60 * 1000);
  }
}

// ==========================================================================
// GROUNDING ENGINE ("Lost? Click to Center")
// ==========================================================================
function openGroundingModal() {
  dom.modalGrounding.classList.add('open');
  startBreathingCycle();
  soundEngine.playPreset('zen-bowl');
}

function closeGroundingModal() {
  dom.modalGrounding.classList.remove('open');
  if (breathingInterval) {
    clearInterval(breathingInterval);
    breathingInterval = null;
  }
}

function startBreathingCycle() {
  if (breathingInterval) clearInterval(breathingInterval);
  let phase = 0;
  const instructions = [
    { text: 'Breathe In (4s)', duration: 4000 },
    { text: 'Hold Gentle (7s)', duration: 7000 },
    { text: 'Slow Exhale (8s)', duration: 8000 }
  ];

  function runPhase() {
    if (!dom.modalGrounding.classList.contains('open')) return;
    const current = instructions[phase];
    if (dom.breathingInstruction) {
      dom.breathingInstruction.textContent = current.text;
    }
    phase = (phase + 1) % instructions.length;
    breathingInterval = setTimeout(runPhase, current.duration);
  }

  runPhase();
}

function applyGroundingAction(actionType) {
  soundEngine.playPreset('micro-tick');
  closeGroundingModal();

  if (actionType === 'breather') {
    store.quickShiftSchedule(15);
    alert('⏳ 15-Minute Breather Activated.\nSchedule advanced by 15 mins. Take your time to reset.');
  } else if (actionType === 'catchup') {
    switchView('today');
    alert('⚡ Schedule Re-Aligned to Now.\nPast incomplete routine blocks are gently cleared. Start fresh with this hour.');
  } else if (actionType === 'rest') {
    store.setEnergyLevel(20);
    alert('🌿 Rest Mode Enabled.\nTake it easy today. Gentle Mode is active and streak shields are deployed.');
  }
}

// ==========================================================================
// FOCUS MODE ("One Thing at a Time")
// ==========================================================================
function toggleFocusMode(forceState) {
  isFocusMode = typeof forceState === 'boolean' ? forceState : !isFocusMode;
  document.body.classList.toggle('focus-mode-active', isFocusMode);
  if (dom.btnFocusToggle) {
    dom.btnFocusToggle.classList.toggle('active', isFocusMode);
  }
  if (dom.focusToggleLabel) {
    dom.focusToggleLabel.textContent = isFocusMode ? 'Focus Active' : 'Focus';
  }
  soundEngine.playPreset('micro-tick');
}

// ==========================================================================
// FOCUS SPRINT TIMER & AMBIENT SOUNDSCAPES
// ==========================================================================
function openFocusSprintModal() {
  dom.modalSprint.classList.add('open');
  soundEngine.playPreset('micro-tick');
}

function closeFocusSprintModal() {
  dom.modalSprint.classList.remove('open');
}

function setSprintMode(minutes) {
  sprintModeMinutes = minutes;
  sprintSecondsRemaining = minutes * 60;
  pauseSprintTimer();
  updateSprintDisplay();

  dom.btnSprint15.classList.toggle('active', minutes === 15);
  dom.btnSprint25.classList.toggle('active', minutes === 25);
  dom.btnSprint50.classList.toggle('active', minutes === 50);
}

function toggleSprintTimer() {
  if (sprintIsRunning) {
    pauseSprintTimer();
  } else {
    startSprintTimer();
  }
}

function startSprintTimer() {
  sprintIsRunning = true;
  dom.btnSprintToggle.textContent = '⏸ Pause Sprint';
  dom.sprintStatusText.textContent = `Focusing in ${sprintModeMinutes}m block...`;

  if (sprintTimerInterval) clearInterval(sprintTimerInterval);
  sprintTimerInterval = setInterval(() => {
    sprintSecondsRemaining -= 1;
    updateSprintDisplay();

    if (sprintSecondsRemaining <= 0) {
      clearInterval(sprintTimerInterval);
      sprintTimerInterval = null;
      sprintIsRunning = false;
      dom.btnSprintToggle.textContent = '▶ Start Sprint';
      dom.sprintStatusText.textContent = '🎉 Sprint complete! Take a breather.';
      soundEngine.playPreset('gentle-triad');
      soundEngine.stopSoundscape();
      alert(`🎉 Sprint finished! Great focus session. Drink water and stretch.`);
    }
  }, 1000);
}

function pauseSprintTimer() {
  sprintIsRunning = false;
  if (sprintTimerInterval) {
    clearInterval(sprintTimerInterval);
    sprintTimerInterval = null;
  }
  dom.btnSprintToggle.textContent = '▶ Start Sprint';
  dom.sprintStatusText.textContent = 'Sprint paused';
}

function resetSprintTimer() {
  pauseSprintTimer();
  sprintSecondsRemaining = sprintModeMinutes * 60;
  updateSprintDisplay();
  dom.sprintStatusText.textContent = 'Ready to enter flow state';
}

function updateSprintDisplay() {
  const m = Math.floor(sprintSecondsRemaining / 60);
  const s = sprintSecondsRemaining % 60;
  const str = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  dom.sprintTimerDisplay.textContent = str;
}

function setSoundscape(type) {
  const chips = [dom.chipPinkRain, dom.chipAlphaWaves, dom.chipTibetanDrone, dom.chipMuteSoundscape];
  chips.forEach((c) => c && c.classList.remove('active'));

  if (type === 'mute' || soundEngine.getActiveSoundscape() === type) {
    soundEngine.stopSoundscape();
    if (dom.chipMuteSoundscape) dom.chipMuteSoundscape.classList.add('active');
  } else {
    soundEngine.startSoundscape(type, 0.4);
    if (type === 'pink-rain' && dom.chipPinkRain) dom.chipPinkRain.classList.add('active');
    if (type === 'alpha-waves' && dom.chipAlphaWaves) dom.chipAlphaWaves.classList.add('active');
    if (type === 'tibetan-drone' && dom.chipTibetanDrone) dom.chipTibetanDrone.classList.add('active');
  }
}

// ==========================================================================
// GLOBAL OMNIBAR COMMAND PALETTE (Cmd+K / Ctrl+K)
// ==========================================================================
function openOmnibar() {
  dom.modalOmnibar.classList.add('open');
  dom.omnibarSearchInput.value = '';
  renderOmnibarResults('');
  setTimeout(() => dom.omnibarSearchInput.focus(), 50);
}

function closeOmnibar() {
  dom.modalOmnibar.classList.remove('open');
}

function renderOmnibarResults(query = '') {
  const q = query.trim().toLowerCase();
  const state = store.getState();
  const results = [];

  // Prefix Command Handlers
  if (q.startsWith('$ ')) {
    const raw = q.slice(2).trim();
    const [amtStr, ...noteParts] = raw.split(' ');
    const amt = parseFloat(amtStr);
    const note = noteParts.join(' ') || 'Quick expense';
    if (!isNaN(amt)) {
      results.push({
        title: `Log Expense: $${amt.toFixed(2)} (${note})`,
        badge: 'Enter to Log',
        action: () => {
          store.addItem('cashTransactions', {
            date: getTodayDateString(),
            time: new Date().toTimeString().slice(0, 5),
            timestamp: new Date().toISOString(),
            type: 'expense',
            amount: amt,
            category: 'Misc',
            note
          });
          soundEngine.playPreset('micro-tick');
        }
      });
    }
  }

  if (q.startsWith('+h ')) {
    const ml = parseInt(q.slice(3).trim(), 10);
    if (!isNaN(ml) && ml > 0) {
      results.push({
        title: `Log Hydration: +${ml} ml`,
        badge: 'Water',
        action: () => {
          store.addWater(ml);
          soundEngine.playPreset('water-drop');
        }
      });
    }
  }

  if (q.startsWith('+shift ')) {
    const mins = parseInt(q.slice(7).trim(), 10);
    if (!isNaN(mins)) {
      results.push({
        title: `Shift Schedule: +${mins} minutes`,
        badge: 'Time',
        action: () => {
          store.quickShiftSchedule(mins);
          soundEngine.playPreset('micro-tick');
          showShiftUndoToast(`Shifted schedule +${mins}m`);
        }
      });
    }
  }

  if (q.startsWith('+zen')) {
    results.push({
      title: 'Launch 4-7-8 Breathing Calmer',
      badge: 'Grounding',
      action: openGroundingModal
    });
  }

  if (q.startsWith('+bat ')) {
    const levelStr = q.slice(5).trim();
    const lvl = levelStr === 'low' ? 20 : levelStr === 'med' ? 60 : 100;
    results.push({
      title: `Set Energy Battery to ${lvl}%`,
      badge: 'Spoon',
      action: () => {
        store.setEnergyLevel(lvl);
        soundEngine.playPreset('micro-tick');
      }
    });
  }

  // v2.1 Pro Max Plus Omnibar Actions
  if (q.startsWith('+routine') || q === 'routine') {
    results.push({
      title: 'Add Routine Block',
      badge: 'Schedule',
      action: () => openRoutineEditor(null)
    });
  }

  if (q.startsWith('+mask') || q.startsWith('+priv') || q === 'privacy') {
    results.push({
      title: 'Toggle Privacy Balance Masking',
      badge: 'Privacy',
      action: togglePeekPrivacy
    });
  }

  if (q.startsWith('+lock') || q === 'lock') {
    results.push({
      title: 'Lock Privacy Vault',
      badge: 'Security',
      action: () => {
        const stat = store.getPrivacyStatus();
        if (stat.hasPin) {
          store.lockVault();
          openPrivacyPinModal('unlock');
        } else {
          openPrivacyPinModal('setup');
        }
      }
    });
  }

  if (q.startsWith('+journal') || q.startsWith('+export') || q === 'export') {
    results.push({
      title: 'Export Daily Journal & Markdown Summary',
      badge: 'Export',
      action: openJournalExportModal
    });
  }

  // Cross-Module Search: Habits, Debts, Scratchpad, Routines
  (state.habits || []).forEach((h) => {
    if (!q || h.title.toLowerCase().includes(q)) {
      results.push({
        title: `Habit: ${h.icon || '✨'} ${h.title}`,
        badge: `${h.streak}d streak`,
        action: () => {
          switchView('routines');
        }
      });
    }
  });

  (state.debts || []).forEach((d) => {
    const person = d.person || d.counterpartyName || '';
    if (!q || person.toLowerCase().includes(q) || (d.note || '').toLowerCase().includes(q)) {
      results.push({
        title: `Debt: ${person} ($${d.remaining ?? d.amount})`,
        badge: d.status || 'unpaid',
        action: () => {
          switchView('finance');
        }
      });
    }
  });

  (state.scratchpad || []).forEach((n) => {
    const txt = n.text || n.content || '';
    if (!q || txt.toLowerCase().includes(q)) {
      results.push({
        title: `Note: ${txt.slice(0, 40)}`,
        badge: n.tag || 'Scratch',
        action: () => {
          switchView('scratchpad');
        }
      });
    }
  });

  // Render list
  if (results.length === 0) {
    dom.omnibarResultsList.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-muted);">No matching actions or records found.</div>`;
    return;
  }

  dom.omnibarResultsList.innerHTML = results.slice(0, 8).map((r, i) => `
    <div class="omnibar-item ${i === 0 ? 'active' : ''}" data-idx="${i}">
      <div>
        <strong style="color: var(--text-primary); font-size: 14px;">${r.title}</strong>
      </div>
      <span class="omnibar-badge">${r.badge}</span>
    </div>
  `).join('');

  // Store actions in DOM nodes for click execution
  dom.omnibarResultsList.querySelectorAll('.omnibar-item').forEach((el, idx) => {
    el.addEventListener('click', () => {
      closeOmnibar();
      results[idx].action();
    });
  });
}

function showShiftUndoToast(msg) {
  if (shiftUndoTimeout) clearTimeout(shiftUndoTimeout);
  dom.shiftToastText.textContent = msg;
  dom.shiftToastUndo.classList.add('show');

  shiftUndoTimeout = setTimeout(() => {
    dom.shiftToastUndo.classList.remove('show');
  }, 60000);
}

// ==========================================================================
// RENDER & UPDATE VIEWS (v2.0 PRO MAX)
// ==========================================================================
function renderAll() {
  const state = store.getState();
  renderEnergyBattery(state);
  renderHydrationAndMeds(state);
  renderAnchorAndToday(state);
  renderFinanceAndSubscriptions(state);
  renderDebt(state);
  renderHabitsAndHeatmap(state);
  renderScratchpad(state);
  renderSettingsAndSnapshots(state);
}

// 1. Render Energy Battery & Gentle Mode
function renderEnergyBattery(state) {
  const bat = state.energyBattery || { level: 80, isGentleMode: false };
  const lvl = bat.level ?? 80;
  const isGentle = bat.isGentleMode || lvl <= 20;

  if (dom.batteryTextLevel) dom.batteryTextLevel.textContent = `${lvl}%`;
  if (dom.batteryGentleBadge) dom.batteryGentleBadge.style.display = isGentle ? 'inline-block' : 'none';

  if (dom.headerBatteryPill) {
    dom.headerBatteryPill.className = 'battery-pill ' + (lvl <= 20 ? 'battery-level-low' : lvl <= 60 ? 'battery-level-med' : 'battery-level-high');
  }

  document.body.classList.toggle('gentle-mode-active', isGentle);
}

// 2. Render Hydration & Medications
function renderHydrationAndMeds(state) {
  const hyd = state.hydration || { targetMl: 2000, currentMl: 0 };
  const target = hyd.targetMl || 2000;
  const cur = hyd.currentMl || 0;
  const percent = Math.min(100, Math.round((cur / target) * 100));

  if (dom.waterDisplayMl) dom.waterDisplayMl.textContent = `${cur} ml`;
  if (dom.waterDisplayTarget) dom.waterDisplayTarget.textContent = `/ ${target} ml`;
  if (dom.metricWaterRatio) dom.metricWaterRatio.textContent = `${cur} / ${target} ml`;
  if (dom.metricWaterSub) dom.metricWaterSub.textContent = `${percent}% of daily goal`;

  if (dom.waterProgressCircle) {
    const circumference = 339.29;
    const offset = circumference - (circumference * percent) / 100;
    dom.waterProgressCircle.style.strokeDashoffset = `${offset}`;
  }

  // Medications List
  if (dom.medicationsListContainer) {
    const meds = state.medications || [];
    if (meds.length === 0) {
      dom.medicationsListContainer.innerHTML = `<div style="text-align: center; padding: 12px; color: var(--text-muted); font-size: 13px;">No medications configured.</div>`;
    } else {
      dom.medicationsListContainer.innerHTML = meds.map((m) => {
        const isTaken = m.takenToday;
        return `
          <div class="med-card ${isTaken ? 'taken' : ''}" data-id="${m.id}">
            <div>
              <div class="med-name">${m.name}</div>
              <div class="med-meta">
                <span>${m.dosage}</span>
                <span>&bull;</span>
                <span style="text-transform: capitalize;">${m.timeSlot}</span>
                ${m.lastTakenAt ? `<span>&bull; Taken</span>` : ''}
              </div>
            </div>
            <button class="btn-take-med btn-toggle-med" data-id="${m.id}">
              ${isTaken ? '✓ Taken' : 'Mark Taken'}
            </button>
          </div>
        `;
      }).join('');
    }
  }
}

// 3. Render Anchor & Today View
function renderAnchorAndToday(state) {
  const habits = state.habits || [];
  const todayStr = getTodayDateString();
  const completedCount = habits.filter((h) => h.completedDates && h.completedDates.includes(todayStr)).length;

  if (dom.sidebarHabitBadge) {
    dom.sidebarHabitBadge.textContent = `${completedCount}/${habits.length}`;
  }

  const safeSpend = store.getSafeToSpendToday ? store.getSafeToSpendToday() : 34.50;
  if (dom.metricSafeSpend) dom.metricSafeSpend.textContent = formatCurrency(safeSpend);
  if (dom.sidebarSafeBadge) dom.sidebarSafeBadge.textContent = formatCurrency(safeSpend);

  const txs = state.cashTransactions || [];
  const spentToday = txs
    .filter((t) => t.date === todayStr && t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const cap = state.profile?.dailyBudgetCap ?? 50;
  if (dom.metricSpentToday) {
    dom.metricSpentToday.textContent = `${formatCurrency(spentToday)} spent of ${formatCurrency(cap)} cap`;
  }

  // Next Alarm
  const alarms = state.alarms || [];
  const enabledAlarms = alarms.filter((a) => a.enabled);
  if (enabledAlarms.length > 0) {
    const nextA = enabledAlarms[0];
    if (dom.metricNextAlarm) dom.metricNextAlarm.textContent = formatTimeString(nextA.time, state.profile?.timeFormat);
    if (dom.metricNextAlarmLabel) dom.metricNextAlarmLabel.textContent = nextA.label;
  } else {
    if (dom.metricNextAlarm) dom.metricNextAlarm.textContent = 'None';
    if (dom.metricNextAlarmLabel) dom.metricNextAlarmLabel.textContent = 'No alarms active';
  }

  // Net Debt Balance
  const debts = state.debts || [];
  let totalLent = 0;
  let totalBorrowed = 0;
  debts.forEach((d) => {
    const isLent = d.type === 'they_owe_me' || d.direction === 'lent';
    const rem = Number(d.remaining ?? d.amount ?? 0);
    if (isLent) totalLent += rem;
    else totalBorrowed += rem;
  });
  const netDebt = totalLent - totalBorrowed;
  const netPrefix = netDebt >= 0 ? '+' : '-';
  if (dom.metricNetDebt) {
    dom.metricNetDebt.textContent = `${netPrefix}${formatCurrency(Math.abs(netDebt))}`;
  }

  // Routine Stream
  if (dom.todayRoutineStream) {
    const routines = state.routines || [];
    dom.todayRoutineStream.innerHTML = routines.map((r) => {
      const stepsHtml = (r.steps || []).map((s) => `<li>${s.title} <span style="color: var(--text-muted); font-size: 11px;">(${s.durationMinutes || 10}m)</span></li>`).join('');
      return `
        <div class="timeline-item" data-id="${r.id}">
          <div class="timeline-dot" style="background-color: ${r.color || '#4a7bb0'}20; border-color: ${r.color || '#4a7bb0'};">${r.icon || '⏰'}</div>
          <div class="timeline-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong style="color: var(--text-primary); font-size: 15px;">${r.title}</strong>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-family: var(--font-mono); font-size: 12px; color: var(--accent-sky);">
                  ${formatTimeString(r.start, state.profile?.timeFormat)} &ndash; ${formatTimeString(r.end, state.profile?.timeFormat)}
                </span>
                <button class="btn-icon-action btn-edit-routine" data-id="${r.id}" title="Edit Routine Block" style="width: 26px; height: 26px; font-size: 11px; padding: 2px;">✏️</button>
              </div>
            </div>
            ${stepsHtml ? `<ul style="margin-top: 6px; padding-left: 18px; font-size: 13px; color: var(--text-secondary);">${stepsHtml}</ul>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }
}

// 4. Render Finance, Subscriptions & Pure SVG Donut Chart
function renderFinanceAndSubscriptions(state) {
  const cap = state.profile?.dailyBudgetCap ?? 50;
  const todayStr = getTodayDateString();
  const txs = state.cashTransactions || [];

  const spentToday = txs
    .filter((t) => t.date === todayStr && t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const safeLeft = Math.max(0, cap - spentToday);
  const percentUsed = cap > 0 ? Math.min(100, Math.round((spentToday / cap) * 100)) : (spentToday > 0 ? 100 : 0);

  if (dom.statDailyLimit) dom.statDailyLimit.textContent = formatCurrency(cap);
  if (dom.statTodaySpent) dom.statTodaySpent.textContent = formatCurrency(spentToday);
  if (dom.statSafeLeft) dom.statSafeLeft.textContent = formatCurrency(safeLeft);

  if (dom.budgetProgressFill) {
    dom.budgetProgressFill.style.width = `${percentUsed}%`;
    dom.budgetProgressFill.className = 'progress-fill ' + 
      (percentUsed > 100 ? 'fill-rose' : percentUsed > 80 ? 'fill-amber' : 'fill-sage');
  }

  // End-of-Month Buffer Gauge
  const bufferCalc = store.getEndMonthCashBuffer ? store.getEndMonthCashBuffer() : { projectedBuffer: 185, status: 'comfort' };
  if (dom.bufferForecastVal) {
    const prefix = bufferCalc.projectedBuffer >= 0 ? '+' : '-';
    dom.bufferForecastVal.textContent = `${prefix}${formatCurrency(Math.abs(bufferCalc.projectedBuffer))}`;
    dom.bufferForecastVal.className = bufferCalc.status === 'comfort' ? 'gauge-status-comfort' : bufferCalc.status === 'tight' ? 'gauge-status-tight' : 'gauge-status-deficit';
  }
  if (dom.bufferForecastDesc) {
    dom.bufferForecastDesc.textContent = bufferCalc.status === 'comfort'
      ? 'Comfort Zone: At current daily burn rate, you will close the month with a surplus.'
      : bufferCalc.status === 'tight'
      ? 'Tight Margin: Buffer is near zero. Watch non-essential purchases this week.'
      : 'Deficit Warning: Current trajectory exceeds monthly pool. Consider lowering daily cap.';
  }

  // Subscriptions List
  if (dom.subscriptionsListGrid) {
    const subs = state.subscriptions || [];
    if (subs.length === 0) {
      dom.subscriptionsListGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 16px; color: var(--text-muted); font-size: 13px;">No subscriptions configured.</div>`;
    } else {
      dom.subscriptionsListGrid.innerHTML = subs.map((s) => {
        return `
          <div class="sub-card" data-id="${s.id}">
            <div>
              <strong style="color: var(--text-primary); font-size: 14px;">${s.name}</strong>
              <div style="font-size: 12px; color: var(--text-muted);">Renews on ${s.billingDay}th &bull; ${s.category}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-family: var(--font-mono); font-weight: 700;">${formatCurrency(s.amount)}</div>
              ${!s.isPaidThisMonth ? `<button class="btn-primary btn-pay-sub" data-id="${s.id}" data-amt="${s.amount}" data-name="${s.name}" style="padding: 3px 8px; font-size: 11px; margin-top: 4px;">Log Paid</button>` : `<span style="font-size: 11px; color: var(--accent-sage);">Paid ✓</span>`}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Pure SVG Expense Donut & Legend
  renderExpenseDonut(txs);

  // Transactions list
  if (dom.transactionsList) {
    let filtered = [...txs];
    if (currentTxFilter === 'expense') filtered = filtered.filter((t) => t.type === 'expense');
    if (currentTxFilter === 'income') filtered = filtered.filter((t) => t.type === 'income');

    filtered.sort((a, b) => (b.timestamp || b.date).localeCompare(a.timestamp || a.date));

    if (filtered.length === 0) {
      dom.transactionsList.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-muted);">No transactions logged yet.</div>`;
    } else {
      dom.transactionsList.innerHTML = filtered.map((t) => {
        const isExpense = t.type === 'expense';
        const sign = isExpense ? '-' : '+';
        const amtClass = isExpense ? 'amount-expense' : 'amount-income';
        const icon = t.category === 'Food' ? '🍔' : t.category === 'Coffee' ? '☕' : t.category === 'Transit' ? '🚌' : t.category === 'Groceries' ? '🛒' : t.category === 'Income' ? '💰' : '💳';

        return `
          <div class="tx-row" data-id="${t.id}">
            <div class="tx-left">
              <div class="tx-cat-icon">${icon}</div>
              <div>
                <div class="tx-title">${t.note || t.category}</div>
                <div class="tx-meta">${t.date} &bull; ${t.category}</div>
              </div>
            </div>
            <div class="tx-right">
              <span class="tx-amount ${amtClass}">${sign}${formatCurrency(t.amount)}</span>
              <button class="btn-icon-action btn-delete-tx" data-id="${t.id}" title="Delete" style="width: 28px; height: 28px;">&times;</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

// Pure SVG Expense Donut Renderer
function renderExpenseDonut(txs) {
  if (!dom.svgCategoryDonut || !dom.categoryLegendList) return;

  const categories = {};
  let totalExpense = 0;

  txs.filter((t) => t.type === 'expense').forEach((t) => {
    const cat = t.category || 'Misc';
    const amt = Number(t.amount || 0);
    categories[cat] = (categories[cat] || 0) + amt;
    totalExpense += amt;
  });

  const catColors = {
    Food: '#3fb950',
    Coffee: '#58a6ff',
    Groceries: '#f0883e',
    Transit: '#bc8cff',
    Bills: '#f85149',
    Health: '#39d353',
    Misc: '#9aa5b5'
  };

  const entries = Object.entries(categories);
  if (entries.length === 0 || totalExpense === 0) {
    dom.svgCategoryDonut.innerHTML = `<circle cx="80" cy="80" r="50" fill="none" stroke="var(--border-subtle)" stroke-width="20" /><text x="80" y="85" text-anchor="middle" fill="var(--text-muted)" font-size="12">No data</text>`;
    dom.categoryLegendList.innerHTML = `<div style="color: var(--text-muted); font-size: 13px;">Log expenses to see category breakdown.</div>`;
    return;
  }

  // Build SVG segments
  const circumference = 2 * Math.PI * 50; // r = 50 -> ~314.159
  let accumulatedOffset = 0;
  let circlesHtml = `<circle cx="80" cy="80" r="50" fill="none" stroke="var(--bg-canvas)" stroke-width="20" />`;
  let legendHtml = '';

  entries.forEach(([cat, amt]) => {
    const pct = amt / totalExpense;
    const strokeDash = pct * circumference;
    const color = catColors[cat] || '#8b949e';

    circlesHtml += `
      <circle cx="80" cy="80" r="50" fill="none" stroke="${color}" stroke-width="20"
        stroke-dasharray="${strokeDash} ${circumference}"
        stroke-dashoffset="${-accumulatedOffset}"
        transform="rotate(-90 80 80)"
      />
    `;
    accumulatedOffset += strokeDash;

    legendHtml += `
      <div class="chart-legend-item">
        <div>
          <span class="chart-legend-color" style="background-color: ${color};"></span>
          <span>${cat}</span>
        </div>
        <div>
          <strong>${formatCurrency(amt)}</strong>
          <span style="color: var(--text-muted); font-size: 11px;">(${Math.round(pct * 100)}%)</span>
        </div>
      </div>
    `;
  });

  circlesHtml += `<text x="80" y="85" text-anchor="middle" fill="var(--text-primary)" font-family="var(--font-mono)" font-size="14" font-weight="700">${formatCurrency(totalExpense)}</text>`;

  dom.svgCategoryDonut.innerHTML = circlesHtml;
  dom.categoryLegendList.innerHTML = legendHtml;
}

// 5. Render Debt View
function renderDebt(state) {
  const debts = state.debts || [];
  let totalLent = 0;
  let totalBorrowed = 0;

  debts.forEach((d) => {
    const isLent = d.type === 'they_owe_me' || d.direction === 'lent';
    const rem = Number(d.remaining ?? d.amount ?? 0);
    if (isLent) totalLent += rem;
    else totalBorrowed += rem;
  });

  const net = totalLent - totalBorrowed;
  const netPrefix = net >= 0 ? '+' : '-';

  if (dom.summaryTotalLent) dom.summaryTotalLent.textContent = formatCurrency(totalLent);
  if (dom.summaryTotalBorrowed) dom.summaryTotalBorrowed.textContent = formatCurrency(totalBorrowed);
  if (dom.summaryNetDebt) dom.summaryNetDebt.textContent = `${netPrefix}${formatCurrency(Math.abs(net))}`;

  const filtered = debts.filter((d) => {
    const isLent = d.type === 'they_owe_me' || d.direction === 'lent';
    return currentDebtTab === 'they_owe_me' ? isLent : !isLent;
  });

  if (dom.debtCardsGrid) {
    if (filtered.length === 0) {
      dom.debtCardsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 32px; color: var(--text-muted);">No records in this ledger.</div>`;
    } else {
      dom.debtCardsGrid.innerHTML = filtered.map((d) => {
        const rem = Number(d.remaining ?? d.amount ?? 0);
        const status = rem <= 0 ? 'settled' : rem < d.amount ? 'partial' : 'unpaid';
        const badgeClass = status === 'settled' ? 'badge-settled' : status === 'partial' ? 'badge-partial' : 'badge-unpaid';
        const badgeText = status === 'settled' ? 'Settled ✓' : status === 'partial' ? 'Partial' : 'Unpaid';
        const person = d.person || d.counterpartyName || 'Unknown';

        return `
          <div class="debt-card" data-id="${d.id}">
            <div class="debt-card-header">
              <span class="debt-person">${person}</span>
              <span class="debt-badge ${badgeClass}">${badgeText}</span>
            </div>
            <div>
              <div style="font-size: 12px; color: var(--text-secondary);">${d.note || 'No notes'}</div>
              ${d.dueDate ? `<div style="font-size: 11px; color: var(--accent-amber); margin-top: 2px;">Due: ${d.dueDate}</div>` : ''}
            </div>
            <div class="debt-amount-row">
              <span class="debt-remaining">${formatCurrency(rem)}</span>
              <span style="font-size: 12px; color: var(--text-muted);">of ${formatCurrency(d.amount)}</span>
            </div>
            <div class="debt-actions">
              ${status !== 'settled' ? `<button class="btn-primary btn-settle-debt" data-id="${d.id}" data-person="${person}" data-rem="${rem}" style="padding: 6px 14px; font-size: 12px; flex: 1;">Log Payment</button>` : ''}
              <button class="btn-secondary btn-delete-debt" data-id="${d.id}" style="padding: 6px 10px; font-size: 12px;">Delete</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

// 6. Render Habits, Heatmap & Alarms
function renderHabitsAndHeatmap(state) {
  const habits = state.habits || [];
  const todayStr = getTodayDateString();

  // Weekly Heatmap (7 Days)
  if (dom.weeklyHeatmapContainer) {
    const days = [6, 5, 4, 3, 2, 1, 0].map((offset) => getLocalDateString(-offset));
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    dom.weeklyHeatmapContainer.innerHTML = habits.map((h) => {
      const cellsHtml = days.map((day) => {
        const isDone = h.completedDates && h.completedDates.includes(day);
        const dayIdx = new Date(day).getDay();
        return `
          <div class="heatmap-cell ${isDone ? 'done' : ''}" title="${day}: ${isDone ? 'Completed' : 'Rest'}">
            ${dayLabels[dayIdx][0]}
          </div>
        `;
      }).join('');

      return `
        <div class="heatmap-row">
          <div class="heatmap-label" title="${h.title}">${h.icon || '✨'} ${h.title}</div>
          <div class="heatmap-cells">${cellsHtml}</div>
          <span style="font-size: 11px; color: var(--accent-amber); font-weight: 600; margin-left: 6px;">🔥 ${h.streak}d</span>
        </div>
      `;
    }).join('');
  }

  // Habits Cards Grid
  if (dom.habitsListGrid) {
    if (habits.length === 0) {
      dom.habitsListGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 24px; color: var(--text-muted);">No habits added yet.</div>`;
    } else {
      dom.habitsListGrid.innerHTML = habits.map((h) => {
        const isCompleted = h.completedDates && h.completedDates.includes(todayStr);
        const streak = h.streak || 0;

        return `
          <div class="habit-card ${isCompleted ? 'completed' : ''}" data-id="${h.id}">
            <div class="habit-details">
              <div class="habit-name">${h.icon || '✨'} ${h.title}</div>
              <div class="habit-meta-row">
                <span class="streak-pill">🔥 ${streak}d streak</span>
                <span>&bull;</span>
                <span style="text-transform: capitalize;">${h.timeOfDay || 'anytime'}</span>
                ${h.shieldActive || h.streakShieldUsed ? `<span title="Streak Shield Protected">🛡️</span>` : ''}
              </div>
            </div>
            <button class="btn-check-habit" data-id="${h.id}" title="${isCompleted ? 'Mark Incomplete' : 'Complete Habit'}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
          </div>
        `;
      }).join('');
    }
  }

  // Alarms
  const alarms = state.alarms || [];
  if (dom.alarmsListContainer) {
    if (alarms.length === 0) {
      dom.alarmsListContainer.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-muted);">No alarms configured.</div>`;
    } else {
      dom.alarmsListContainer.innerHTML = alarms.map((a) => {
        return `
          <div class="alarm-card ${a.enabled ? '' : 'disabled'}" data-id="${a.id}">
            <div>
              <div class="alarm-time">${formatTimeString(a.time, state.profile?.timeFormat)}</div>
              <div class="alarm-meta">
                <strong>${a.label || 'Alarm'}</strong>
                <span>&bull;</span>
                <span class="alarm-days-pill">${a.soundPreset || a.sound || 'zen-bowl'}</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <button class="btn-secondary btn-test-alarm" data-sound="${a.soundPreset || a.sound || 'zen-bowl'}" style="padding: 6px 12px; font-size: 12px;">Test Chime</button>
              <label class="toggle-switch">
                <input type="checkbox" class="alarm-toggle" data-id="${a.id}" ${a.enabled ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
              <button class="btn-icon-action btn-delete-alarm" data-id="${a.id}" title="Delete" style="width: 32px; height: 32px;">&times;</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

// 7. Render Scratchpad
function renderScratchpad(state) {
  const notes = state.scratchpad || [];
  let filtered = [...notes];
  if (currentScratchTag !== 'All') {
    filtered = filtered.filter((n) => (n.tag || n.category) === currentScratchTag);
  }

  if (dom.scratchpadNotesGrid) {
    if (filtered.length === 0) {
      dom.scratchpadNotesGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 32px; color: var(--text-muted);">No notes in this category. Write anything above!</div>`;
    } else {
      dom.scratchpadNotesGrid.innerHTML = filtered.map((n) => {
        const text = n.text || n.content || '';
        const tag = n.tag || n.category || 'Note';

        return `
          <div class="scratch-card" data-id="${n.id}">
            <div class="scratch-content">${text}</div>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 8px;">
              <span class="tag-filter-pill active" style="font-size: 11px; padding: 2px 8px;">${tag}</span>
              <div class="scratch-convert-actions">
                <button class="btn-convert btn-convert-habit" data-text="${encodeURIComponent(text)}">+ Habit</button>
                <button class="btn-convert btn-convert-tx" data-text="${encodeURIComponent(text)}">+ Expense</button>
                <button class="btn-icon-action btn-delete-note" data-id="${n.id}" style="width: 24px; height: 24px; font-size: 14px;">&times;</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

// 8. Render Settings & Snapshots
function renderSettingsAndSnapshots(state) {
  const p = state.profile || {};
  if (dom.prefCurrency) dom.prefCurrency.value = p.currency || '$';
  if (dom.prefTimeFormat) dom.prefTimeFormat.value = p.timeFormat || '12h';
  if (dom.prefBudgetCap) dom.prefBudgetCap.value = p.dailyBudgetCap || 50;
  if (dom.prefWaterGoal && state.hydration) dom.prefWaterGoal.value = state.hydration.targetMl || 2000;
  if (dom.prefSoundPreset) dom.prefSoundPreset.value = p.soundPreset || 'zen-bowl';

  // Snapshots list
  if (dom.snapshotsListContainer) {
    const snaps = state.snapshots || [];
    if (snaps.length === 0) {
      dom.snapshotsListContainer.innerHTML = `<div style="text-align: center; padding: 16px; color: var(--text-muted); font-size: 13px;">No checkpoints created yet. Click "+ Save Checkpoint" above!</div>`;
    } else {
      dom.snapshotsListContainer.innerHTML = snaps.map((s) => {
        const timeFormatted = new Date(s.timestamp).toLocaleString();
        return `
          <div class="snapshot-item" data-id="${s.id}">
            <div>
              <strong style="color: var(--text-primary); font-size: 14px;">${s.label || 'Automated Checkpoint'}</strong>
              <div style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono);">${timeFormatted}</div>
            </div>
            <button class="btn-secondary btn-restore-snapshot" data-id="${s.id}" style="padding: 6px 12px; font-size: 12px;">Restore Checkpoint</button>
          </div>
        `;
      }).join('');
    }
  }
}

// ==========================================================================
// v2.1 PRO MAX PLUS CONTROLLERS (Routine Editor, Privacy Vault, Journal Export)
// ==========================================================================
let currentEditingRoutine = null;

function openRoutineEditor(routineId = null) {
  const state = store.getState();
  const routines = state.routines || [];

  if (routineId) {
    currentEditingRoutine = routines.find((r) => r.id === routineId) || null;
  } else {
    currentEditingRoutine = null;
  }

  if (currentEditingRoutine) {
    dom.routineEditorTitle.textContent = 'Edit Routine Block';
    dom.routineEditId.value = currentEditingRoutine.id;
    dom.routineEditTitle.value = currentEditingRoutine.title || currentEditingRoutine.name || '';
    dom.routineEditStart.value = currentEditingRoutine.startTime || currentEditingRoutine.start || '09:00';
    dom.routineEditEnd.value = currentEditingRoutine.endTime || currentEditingRoutine.end || '10:00';
    if (dom.btnDeleteRoutine) dom.btnDeleteRoutine.style.display = 'block';

    highlightCategoryPill(currentEditingRoutine.category || 'work');
    renderStepBuilderRows(currentEditingRoutine.steps || []);
  } else {
    dom.routineEditorTitle.textContent = 'Add Routine Block';
    dom.routineEditId.value = '';
    dom.routineEditTitle.value = '';
    dom.routineEditStart.value = '14:00';
    dom.routineEditEnd.value = '15:30';
    if (dom.btnDeleteRoutine) dom.btnDeleteRoutine.style.display = 'none';

    highlightCategoryPill('work');
    renderStepBuilderRows([
      { title: 'Setup & Focus Alignment', durationMinutes: 15 },
      { title: 'Core Activity Session', durationMinutes: 60 },
      { title: 'Decompression & Wrap-Up', durationMinutes: 15 }
    ]);
  }

  updateLiveDurationChip();
  dom.modalRoutineEditor.classList.add('open');
  if (dom.routineEditTitle) dom.routineEditTitle.focus();
}

function closeRoutineEditor() {
  dom.modalRoutineEditor.classList.remove('open');
  currentEditingRoutine = null;
}

function highlightCategoryPill(cat) {
  if (!dom.routineCategoryPills) return;
  const pills = dom.routineCategoryPills.querySelectorAll('.category-pill');
  pills.forEach((p) => {
    p.classList.toggle('selected', p.dataset.cat === cat);
  });
}

function getSelectedCategory() {
  if (!dom.routineCategoryPills) return { cat: 'work', color: '#4a7bb0', icon: '🎯' };
  const sel = dom.routineCategoryPills.querySelector('.category-pill.selected');
  if (sel) {
    return {
      cat: sel.dataset.cat || 'work',
      color: sel.dataset.color || '#4a7bb0',
      icon: sel.dataset.icon || '🎯'
    };
  }
  return { cat: 'work', color: '#4a7bb0', icon: '🎯' };
}

function updateLiveDurationChip() {
  const start = dom.routineEditStart ? dom.routineEditStart.value : '09:00';
  const end = dom.routineEditEnd ? dom.routineEditEnd.value : '10:00';
  const bounds = store.validateRoutineTimeBounds(start, end);
  if (dom.routineEditDurationChip) {
    dom.routineEditDurationChip.textContent = `⏱ ${bounds.durationFormatted}`;
    if (bounds.isCrossMidnight) {
      dom.routineEditDurationChip.title = 'Overnight Routine (Cross-Midnight)';
      dom.routineEditDurationChip.style.borderColor = 'var(--accent-amber)';
    } else {
      dom.routineEditDurationChip.title = 'Standard Routine Duration';
      dom.routineEditDurationChip.style.borderColor = 'var(--accent-amber-border)';
    }
  }
}

function renderStepBuilderRows(steps = []) {
  if (!dom.routineEditStepsContainer) return;
  dom.routineEditStepsContainer.innerHTML = steps.map((s, idx) => `
    <div class="step-builder-row" data-idx="${idx}">
      <span class="step-drag-handle">⋮⋮</span>
      <input type="text" class="step-input-title" placeholder="Step ${idx + 1} action..." value="${s.title || ''}" required>
      <input type="number" class="step-input-duration" min="1" max="360" value="${s.durationMinutes || 10}" title="Duration in minutes">
      <span style="font-size: 11px; color: var(--text-muted);">m</span>
      <button type="button" class="step-delete-btn" title="Remove step">&times;</button>
    </div>
  `).join('');
}

function collectStepBuilderRows() {
  if (!dom.routineEditStepsContainer) return [];
  const rows = dom.routineEditStepsContainer.querySelectorAll('.step-builder-row');
  const collected = [];
  rows.forEach((row, idx) => {
    const titleInput = row.querySelector('.step-input-title');
    const durInput = row.querySelector('.step-input-duration');
    const title = titleInput ? titleInput.value.trim() : '';
    const durationMinutes = durInput ? parseInt(durInput.value, 10) || 10 : 10;
    if (title) {
      collected.push({
        order: idx + 1,
        title,
        durationMinutes
      });
    }
  });
  return collected;
}

// --- Privacy Vault Logic ---
let enteredPinDigits = [];
let vaultMode = 'unlock'; // 'unlock' | 'setup'

function initPrivacyState() {
  const priv = store.getState().privacy || {};
  const isMasked = Boolean(priv.isMasked);
  document.documentElement.setAttribute('data-privacy-masked', isMasked ? 'true' : 'false');
  if (dom.btnPeekPrivacy) {
    dom.btnPeekPrivacy.classList.toggle('active', isMasked);
  }
  if (dom.privacySlashLine) {
    dom.privacySlashLine.style.display = isMasked ? 'block' : 'none';
  }
  if (dom.privacyToggleLabel) {
    dom.privacyToggleLabel.textContent = isMasked ? 'Masked' : 'Privacy';
  }
}

function togglePeekPrivacy() {
  const next = store.toggleMaskMode();
  document.documentElement.setAttribute('data-privacy-masked', next ? 'true' : 'false');
  if (dom.btnPeekPrivacy) {
    dom.btnPeekPrivacy.classList.toggle('active', next);
  }
  if (dom.privacySlashLine) {
    dom.privacySlashLine.style.display = next ? 'block' : 'none';
  }
  if (dom.privacyToggleLabel) {
    dom.privacyToggleLabel.textContent = next ? 'Masked' : 'Privacy';
  }
  soundEngine.playPreset('micro-tick');
}

function openPrivacyPinModal(mode = 'unlock') {
  vaultMode = mode;
  enteredPinDigits = [];
  updatePinDots();
  if (dom.vaultNoticeBanner) dom.vaultNoticeBanner.style.display = 'none';

  const status = store.getPrivacyStatus();
  if (status.isUnderLockout) {
    if (dom.vaultNoticeBanner) {
      dom.vaultNoticeBanner.textContent = `Vault locked. Cooldown remaining: ${status.cooldownSeconds}s`;
      dom.vaultNoticeBanner.style.display = 'block';
    }
  } else if (status.hint && vaultMode === 'unlock') {
    if (dom.vaultNoticeBanner) {
      dom.vaultNoticeBanner.textContent = `Hint: ${status.hint}`;
      dom.vaultNoticeBanner.style.display = 'block';
    }
  }

  if (vaultMode === 'setup') {
    dom.vaultModalTitle.textContent = '🔒 Set Privacy PIN';
    dom.vaultModalSubtitle.textContent = 'Choose a 4-digit PIN to secure balances and sensitive notes';
  } else {
    dom.vaultModalTitle.textContent = '🔐 Privacy Vault';
    dom.vaultModalSubtitle.textContent = 'Enter your 4-digit PIN to unlock private data';
  }

  dom.modalPrivacyPin.classList.add('open');
}

function closePrivacyPinModal() {
  dom.modalPrivacyPin.classList.remove('open');
  enteredPinDigits = [];
  updatePinDots();
}

function updatePinDots() {
  const dots = [dom.dot1, dom.dot2, dom.dot3, dom.dot4];
  dots.forEach((dot, idx) => {
    if (!dot) return;
    dot.className = 'pin-dot ' + (idx < enteredPinDigits.length ? 'filled' : '');
  });
}

async function handlePinInput(val) {
  if (val === 'clear') {
    enteredPinDigits = [];
    updatePinDots();
    soundEngine.playPreset('micro-tick');
    return;
  }
  if (val === 'back') {
    enteredPinDigits.pop();
    updatePinDots();
    soundEngine.playPreset('micro-tick');
    return;
  }

  if (enteredPinDigits.length < 4) {
    enteredPinDigits.push(val);
    updatePinDots();
    soundEngine.playPreset('micro-tick');
  }

  if (enteredPinDigits.length === 4) {
    const pin = enteredPinDigits.join('');
    if (vaultMode === 'setup') {
      const hint = prompt('Optional PIN Hint (leave blank for none):', '');
      await store.setupPrivacyPin(pin, { hint });
      soundEngine.playPreset('zen-bowl');
      closePrivacyPinModal();
      alert('Privacy PIN configured successfully!');
    } else {
      try {
        const ok = await store.unlockVault(pin);
        if (ok) {
          soundEngine.playPreset('zen-bowl');
          closePrivacyPinModal();
          store.toggleMaskMode(false);
          initPrivacyState();
        } else {
          soundEngine.playPreset('attentive-bell');
          shakePinDots();
          const stat = store.getPrivacyStatus();
          if (stat.isUnderLockout && dom.vaultNoticeBanner) {
            dom.vaultNoticeBanner.textContent = `Too many failed attempts. Cooldown: ${stat.cooldownSeconds}s`;
            dom.vaultNoticeBanner.style.display = 'block';
          }
        }
      } catch (err) {
        soundEngine.playPreset('attentive-bell');
        shakePinDots();
        if (dom.vaultNoticeBanner) {
          dom.vaultNoticeBanner.textContent = err.message;
          dom.vaultNoticeBanner.style.display = 'block';
        }
      }
    }
  }
}

function shakePinDots() {
  if (!dom.pinDotsRow) return;
  dom.pinDotsRow.classList.add('shake-gentle');
  setTimeout(() => {
    dom.pinDotsRow.classList.remove('shake-gentle');
    enteredPinDigits = [];
    updatePinDots();
  }, 400);
}

// --- Journal & CSV Export Logic ---
function openJournalExportModal() {
  const md = store.exportMarkdownDayJournal();
  if (dom.journalPreviewText) {
    dom.journalPreviewText.value = md;
  }
  dom.modalJournalExport.classList.add('open');
}

function closeJournalExportModal() {
  dom.modalJournalExport.classList.remove('open');
}

function downloadFile(filename, content, type = 'text/markdown;charset=utf-8;') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==========================================================================
// EVENT LISTENERS & CRUD OPERATIONS (v2.0 PRO MAX)
// ==========================================================================
function setupEventListeners() {
  // Navigation: Desktop Sidebar
  dom.sidebarNavItems.forEach((item) => {
    item.addEventListener('click', () => {
      switchView(item.dataset.view);
      soundEngine.playPreset('micro-tick');
    });
  });

  // Navigation: Mobile Bottom Dock
  dom.mobileDockBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      switchView(btn.dataset.view);
      soundEngine.playPreset('micro-tick');
    });
  });

  // Energy Battery Gauge Click Cycle: 100% -> 60% -> 20% -> 100%
  if (dom.headerBatteryPill) {
    dom.headerBatteryPill.addEventListener('click', () => {
      const curLvl = store.getState().energyBattery?.level ?? 80;
      const nextLvl = curLvl > 60 ? 60 : curLvl > 20 ? 20 : 100;
      store.setEnergyLevel(nextLvl);
      soundEngine.playPreset('micro-tick');
    });
  }
  if (dom.btnExitGentle) {
    dom.btnExitGentle.addEventListener('click', () => {
      store.toggleGentleMode(false);
      soundEngine.playPreset('micro-tick');
    });
  }

  // Focus Mode Toggle
  if (dom.btnFocusToggle) {
    dom.btnFocusToggle.addEventListener('click', () => toggleFocusMode());
  }
  if (dom.btnExitFocus) {
    dom.btnExitFocus.addEventListener('click', () => toggleFocusMode(false));
  }

  // Grounding Engine
  if (dom.btnSidebarGrounding) dom.btnSidebarGrounding.addEventListener('click', openGroundingModal);
  if (dom.btnHeaderGrounding) dom.btnHeaderGrounding.addEventListener('click', openGroundingModal);
  if (dom.btnCloseGrounding) dom.btnCloseGrounding.addEventListener('click', closeGroundingModal);
  if (dom.btnGroundBreather) dom.btnGroundBreather.addEventListener('click', () => applyGroundingAction('breather'));
  if (dom.btnGroundCatchup) dom.btnGroundCatchup.addEventListener('click', () => applyGroundingAction('catchup'));
  if (dom.btnGroundRest) dom.btnGroundRest.addEventListener('click', () => applyGroundingAction('rest'));

  // Alarm Ringing Modal
  if (dom.btnDismissAlarm) dom.btnDismissAlarm.addEventListener('click', dismissRingingAlarm);
  if (dom.btnSnooze5) dom.btnSnooze5.addEventListener('click', () => snoozeAlarm(5));
  if (dom.btnSnooze10) dom.btnSnooze10.addEventListener('click', () => snoozeAlarm(10));
  if (dom.btnSnooze15) dom.btnSnooze15.addEventListener('click', () => snoozeAlarm(15));

  // Focus Sprint & Ambient Soundscapes
  if (dom.btnOpenSprint) dom.btnOpenSprint.addEventListener('click', openFocusSprintModal);
  if (dom.btnCloseSprint) dom.btnCloseSprint.addEventListener('click', closeFocusSprintModal);
  if (dom.btnSprintToggle) dom.btnSprintToggle.addEventListener('click', toggleSprintTimer);
  if (dom.btnSprintReset) dom.btnSprintReset.addEventListener('click', resetSprintTimer);
  if (dom.btnSprint15) dom.btnSprint15.addEventListener('click', () => setSprintMode(15));
  if (dom.btnSprint25) dom.btnSprint25.addEventListener('click', () => setSprintMode(25));
  if (dom.btnSprint50) dom.btnSprint50.addEventListener('click', () => setSprintMode(50));

  if (dom.chipPinkRain) dom.chipPinkRain.addEventListener('click', () => setSoundscape('pink-rain'));
  if (dom.chipAlphaWaves) dom.chipAlphaWaves.addEventListener('click', () => setSoundscape('alpha-waves'));
  if (dom.chipTibetanDrone) dom.chipTibetanDrone.addEventListener('click', () => setSoundscape('tibetan-drone'));
  if (dom.chipMuteSoundscape) dom.chipMuteSoundscape.addEventListener('click', () => setSoundscape('mute'));

  // Global Omnibar Command Palette
  if (dom.btnOpenOmnibar) dom.btnOpenOmnibar.addEventListener('click', openOmnibar);
  if (dom.btnCloseOmnibar) dom.btnCloseOmnibar.addEventListener('click', closeOmnibar);
  if (dom.omnibarSearchInput) {
    dom.omnibarSearchInput.addEventListener('input', (e) => {
      renderOmnibarResults(e.target.value);
    });
    dom.omnibarSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const firstAction = dom.omnibarResultsList.querySelector('.omnibar-item');
        if (firstAction) firstAction.click();
      }
    });
  }

  // Hydration Controls
  if (dom.btnWater250) {
    dom.btnWater250.addEventListener('click', () => {
      store.addWater(250);
      soundEngine.playPreset('water-drop');
    });
  }
  if (dom.btnWater500) {
    dom.btnWater500.addEventListener('click', () => {
      store.addWater(500);
      soundEngine.playPreset('water-drop');
    });
  }
  if (dom.btnWater750) {
    dom.btnWater750.addEventListener('click', () => {
      store.addWater(750);
      soundEngine.playPreset('water-drop');
    });
  }
  if (dom.btnWaterUndo) {
    dom.btnWaterUndo.addEventListener('click', () => {
      store.undoWater();
      soundEngine.playPreset('micro-tick');
    });
  }

  // Medications Toggle & Modal
  if (dom.medicationsListContainer) {
    dom.medicationsListContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-toggle-med');
      if (!btn) return;
      const id = btn.dataset.id;
      store.toggleMedication(id);
      soundEngine.playPreset('micro-tick');
    });
  }
  if (dom.btnOpenAddMed) dom.btnOpenAddMed.addEventListener('click', () => dom.modalMedication.classList.add('open'));
  if (dom.btnCloseMed) dom.btnCloseMed.addEventListener('click', () => dom.modalMedication.classList.remove('open'));
  if (dom.btnCancelMed) dom.btnCancelMed.addEventListener('click', () => dom.modalMedication.classList.remove('open'));
  if (dom.formMedication) {
    dom.formMedication.addEventListener('submit', (e) => {
      e.preventDefault();
      const newMed = {
        name: dom.medName.value.trim(),
        dosage: dom.medDosage.value.trim(),
        timeSlot: dom.medTimeslot.value,
        takenToday: false,
        lastTakenAt: null
      };
      store.addItem('medications', newMed);
      dom.formMedication.reset();
      dom.modalMedication.classList.remove('open');
      soundEngine.playPreset('micro-tick');
    });
  }

  // Schedule Quick-Shift Bar
  if (dom.btnShift15) {
    dom.btnShift15.addEventListener('click', () => {
      store.quickShiftSchedule(15);
      soundEngine.playPreset('micro-tick');
      showShiftUndoToast('Schedule shifted +15 minutes.');
    });
  }
  if (dom.btnShift30) {
    dom.btnShift30.addEventListener('click', () => {
      store.quickShiftSchedule(30);
      soundEngine.playPreset('micro-tick');
      showShiftUndoToast('Schedule shifted +30 minutes.');
    });
  }
  if (dom.btnShift60) {
    dom.btnShift60.addEventListener('click', () => {
      store.quickShiftSchedule(60);
      soundEngine.playPreset('micro-tick');
      showShiftUndoToast('Schedule shifted +1 hour.');
    });
  }
  if (dom.btnSnapNow) {
    dom.btnSnapNow.addEventListener('click', () => {
      store.quickShiftSchedule(0);
      soundEngine.playPreset('micro-tick');
      alert('⚡ Schedule snapped to current hour.');
    });
  }
  if (dom.btnUndoShift) {
    dom.btnUndoShift.addEventListener('click', () => {
      store.undoQuickShift();
      dom.shiftToastUndo.classList.remove('show');
      soundEngine.playPreset('micro-tick');
      alert('↶ Schedule shift undone.');
    });
  }

  // Anchor Done Immediate Step
  if (dom.btnCompleteImmediate) {
    dom.btnCompleteImmediate.addEventListener('click', () => {
      soundEngine.playPreset('micro-tick');
      alert('🎉 Step completed! Great job. Moving to next routine focus.');
    });
  }

  // Cash: Quick Expense 1-Tap Pills
  if (dom.quickExpensePills) {
    dom.quickExpensePills.addEventListener('click', (e) => {
      const btn = e.target.closest('.pill-expense');
      if (!btn) return;
      const amt = parseFloat(btn.dataset.amt);
      const cat = btn.dataset.cat;
      const icon = btn.dataset.icon;

      const newTx = {
        id: `tx-${Date.now()}`,
        date: getTodayDateString(),
        time: new Date().toTimeString().slice(0, 5),
        timestamp: new Date().toISOString(),
        type: 'expense',
        amount: amt,
        category: cat,
        note: `Quick ${icon} ${cat}`
      };

      store.addItem('cashTransactions', newTx);
      soundEngine.playPreset('micro-tick');
    });
  }

  // Cash: Filters
  if (dom.filterTxAll) dom.filterTxAll.addEventListener('click', () => { currentTxFilter = 'all'; renderFinanceAndSubscriptions(store.getState()); });
  if (dom.filterTxExpense) dom.filterTxExpense.addEventListener('click', () => { currentTxFilter = 'expense'; renderFinanceAndSubscriptions(store.getState()); });
  if (dom.filterTxIncome) dom.filterTxIncome.addEventListener('click', () => { currentTxFilter = 'income'; renderFinanceAndSubscriptions(store.getState()); });

  // Cash: Add Transaction Modal & Form
  if (dom.btnOpenAddTx) dom.btnOpenAddTx.addEventListener('click', () => dom.modalTransaction.classList.add('open'));
  if (dom.btnCloseTx) dom.btnCloseTx.addEventListener('click', () => dom.modalTransaction.classList.remove('open'));
  if (dom.btnCancelTx) dom.btnCancelTx.addEventListener('click', () => dom.modalTransaction.classList.remove('open'));
  if (dom.formTransaction) {
    dom.formTransaction.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = dom.formTransaction.elements['tx-type'].value;
      const amt = parseFloat(dom.txAmount.value);
      const cat = dom.txCategory.value;
      const note = dom.txNote.value.trim() || cat;

      const newTx = {
        id: `tx-${Date.now()}`,
        date: getTodayDateString(),
        time: new Date().toTimeString().slice(0, 5),
        timestamp: new Date().toISOString(),
        type,
        amount: amt,
        category: cat,
        note
      };

      store.addItem('cashTransactions', newTx);
      dom.formTransaction.reset();
      dom.modalTransaction.classList.remove('open');
      soundEngine.playPreset('micro-tick');
    });
  }

  // Cash: Delete Transaction
  if (dom.transactionsList) {
    dom.transactionsList.addEventListener('click', (e) => {
      const delBtn = e.target.closest('.btn-delete-tx');
      if (!delBtn) return;
      const id = delBtn.dataset.id;
      if (confirm('Delete this transaction?')) {
        store.deleteItem('cashTransactions', id);
        soundEngine.playPreset('micro-tick');
      }
    });
  }

  // Subscriptions Modal & Log Paid
  if (dom.btnOpenAddSub) dom.btnOpenAddSub.addEventListener('click', () => dom.modalSubscription.classList.add('open'));
  if (dom.btnCloseSub) dom.btnCloseSub.addEventListener('click', () => dom.modalSubscription.classList.remove('open'));
  if (dom.btnCancelSub) dom.btnCancelSub.addEventListener('click', () => dom.modalSubscription.classList.remove('open'));
  if (dom.formSubscription) {
    dom.formSubscription.addEventListener('submit', (e) => {
      e.preventDefault();
      const newSub = {
        name: dom.subName.value.trim(),
        amount: parseFloat(dom.subAmount.value),
        billingDay: parseInt(dom.subBillingDay.value, 10),
        category: dom.subCategory.value,
        cycle: 'monthly',
        isPaidThisMonth: false
      };
      store.addItem('subscriptions', newSub);
      dom.formSubscription.reset();
      dom.modalSubscription.classList.remove('open');
      soundEngine.playPreset('micro-tick');
    });
  }
  if (dom.subscriptionsListGrid) {
    dom.subscriptionsListGrid.addEventListener('click', (e) => {
      const payBtn = e.target.closest('.btn-pay-sub');
      if (!payBtn) return;
      const id = payBtn.dataset.id;
      const amt = parseFloat(payBtn.dataset.amt);
      const name = payBtn.dataset.name;

      // Add expense to cash ledger
      store.addItem('cashTransactions', {
        date: getTodayDateString(),
        time: new Date().toTimeString().slice(0, 5),
        timestamp: new Date().toISOString(),
        type: 'expense',
        amount: amt,
        category: 'Bills',
        note: `Subscription: ${name}`
      });

      // Mark subscription as paid
      store.updateItem('subscriptions', id, { isPaidThisMonth: true });
      soundEngine.playPreset('micro-tick');
    });
  }

  // Debt Tabs
  if (dom.tabDebtLent) {
    dom.tabDebtLent.addEventListener('click', () => {
      currentDebtTab = 'they_owe_me';
      dom.tabDebtLent.classList.add('active');
      dom.tabDebtBorrowed.classList.remove('active');
      renderDebt(store.getState());
    });
  }
  if (dom.tabDebtBorrowed) {
    dom.tabDebtBorrowed.addEventListener('click', () => {
      currentDebtTab = 'i_owe_them';
      dom.tabDebtBorrowed.classList.add('active');
      dom.tabDebtLent.classList.remove('active');
      renderDebt(store.getState());
    });
  }

  // Debt: Add Modal
  if (dom.btnOpenAddDebt) dom.btnOpenAddDebt.addEventListener('click', () => dom.modalDebt.classList.add('open'));
  if (dom.btnCloseDebt) dom.btnCloseDebt.addEventListener('click', () => dom.modalDebt.classList.remove('open'));
  if (dom.btnCancelDebt) dom.btnCancelDebt.addEventListener('click', () => dom.modalDebt.classList.remove('open'));
  if (dom.formDebt) {
    dom.formDebt.addEventListener('submit', (e) => {
      e.preventDefault();
      const dir = dom.formDebt.elements['debt-direction'].value;
      const person = dom.debtPerson.value.trim();
      const amt = parseFloat(dom.debtAmount.value);
      const dueDate = dom.debtDueDate.value || null;
      const note = dom.debtNote.value.trim();

      const newDebt = {
        id: `debt-${Date.now()}`,
        type: dir,
        direction: dir === 'they_owe_me' ? 'lent' : 'borrowed',
        person,
        counterpartyName: person,
        amount: amt,
        remaining: amt,
        dueDate,
        note,
        status: 'unpaid',
        history: []
      };

      store.addItem('debts', newDebt);
      dom.formDebt.reset();
      dom.modalDebt.classList.remove('open');
      soundEngine.playPreset('micro-tick');
    });
  }

  // Debt: Settle & Delete
  if (dom.debtCardsGrid) {
    dom.debtCardsGrid.addEventListener('click', (e) => {
      const settleBtn = e.target.closest('.btn-settle-debt');
      if (settleBtn) {
        const id = settleBtn.dataset.id;
        const person = settleBtn.dataset.person;
        const rem = settleBtn.dataset.rem;

        dom.settleDebtId.value = id;
        dom.settleDebtPerson.textContent = `Settling with: ${person}`;
        dom.settleDebtRemaining.textContent = `Remaining balance: ${formatCurrency(rem)}`;
        dom.settleAmount.value = rem;
        dom.modalSettleDebt.classList.add('open');
        return;
      }

      const delBtn = e.target.closest('.btn-delete-debt');
      if (delBtn) {
        const id = delBtn.dataset.id;
        if (confirm('Delete this debt record?')) {
          store.deleteItem('debts', id);
          soundEngine.playPreset('micro-tick');
        }
      }
    });
  }

  // Debt: Submit Settle Form
  if (dom.formSettleDebt) {
    dom.formSettleDebt.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = dom.settleDebtId.value;
      const payAmt = parseFloat(dom.settleAmount.value);
      const state = store.getState();
      const item = (state.debts || []).find((d) => d.id === id);

      if (item) {
        const curRem = Number(item.remaining ?? item.amount ?? 0);
        const newRem = Math.max(0, curRem - payAmt);
        const newStatus = newRem <= 0 ? 'settled' : 'partial';

        store.updateItem('debts', id, {
          remaining: newRem,
          status: newStatus
        });
      }

      dom.modalSettleDebt.classList.remove('open');
      soundEngine.playPreset('micro-tick');
    });
  }
  if (dom.btnCloseSettle) dom.btnCloseSettle.addEventListener('click', () => dom.modalSettleDebt.classList.remove('open'));
  if (dom.btnCancelSettle) dom.btnCancelSettle.addEventListener('click', () => dom.modalSettleDebt.classList.remove('open'));

  // Habits Check Toggle
  if (dom.habitsListGrid) {
    dom.habitsListGrid.addEventListener('click', (e) => {
      const checkBtn = e.target.closest('.btn-check-habit');
      if (!checkBtn) return;
      const id = checkBtn.dataset.id;
      const todayStr = getTodayDateString();
      const state = store.getState();
      const habit = (state.habits || []).find((h) => h.id === id);

      if (habit) {
        let dates = habit.completedDates ? [...habit.completedDates] : [];
        let streak = habit.streak || 0;

        if (dates.includes(todayStr)) {
          dates = dates.filter((d) => d !== todayStr);
          streak = Math.max(0, streak - 1);
        } else {
          dates.push(todayStr);
          streak += 1;
          soundEngine.playPreset('micro-tick');
        }

        store.updateItem('habits', id, {
          completedDates: dates,
          streak
        });
      }
    });
  }

  // Habits Add Modal
  if (dom.btnOpenAddHabit) dom.btnOpenAddHabit.addEventListener('click', () => dom.modalHabit.classList.add('open'));
  if (dom.btnCloseHabit) dom.btnCloseHabit.addEventListener('click', () => dom.modalHabit.classList.remove('open'));
  if (dom.btnCancelHabit) dom.btnCancelHabit.addEventListener('click', () => dom.modalHabit.classList.remove('open'));
  if (dom.formHabit) {
    dom.formHabit.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = dom.habitName.value.trim();
      const icon = dom.habitIcon.value.trim() || '✨';
      const timeOfDay = dom.habitTimeOfDay.value;

      const newHabit = {
        id: `habit-${Date.now()}`,
        title,
        icon,
        timeOfDay,
        category: 'wellness',
        frequency: 'daily',
        streak: 0,
        completedDates: [],
        shieldActive: true
      };

      store.addItem('habits', newHabit);
      dom.formHabit.reset();
      dom.modalHabit.classList.remove('open');
      soundEngine.playPreset('micro-tick');
    });
  }

  // Alarms Modal & Toggle
  if (dom.btnOpenAddAlarm) dom.btnOpenAddAlarm.addEventListener('click', () => dom.modalAlarm.classList.add('open'));
  if (dom.btnCloseAlarm) dom.btnCloseAlarm.addEventListener('click', () => dom.modalAlarm.classList.remove('open'));
  if (dom.btnCancelAlarm) dom.btnCancelAlarm.addEventListener('click', () => dom.modalAlarm.classList.remove('open'));
  if (dom.formAlarm) {
    dom.formAlarm.addEventListener('submit', (e) => {
      e.preventDefault();
      const time = dom.alarmTime.value;
      const label = dom.alarmLabel.value.trim();
      const sound = dom.alarmSound.value;

      const newAlarm = {
        id: `alarm-${Date.now()}`,
        time,
        label,
        soundPreset: sound,
        sound,
        enabled: true,
        days: [0, 1, 2, 3, 4, 5, 6]
      };

      store.addItem('alarms', newAlarm);
      dom.formAlarm.reset();
      dom.modalAlarm.classList.remove('open');
      soundEngine.playPreset('micro-tick');
    });
  }

  if (dom.alarmsListContainer) {
    dom.alarmsListContainer.addEventListener('change', (e) => {
      const toggle = e.target.closest('.alarm-toggle');
      if (toggle) {
        const id = toggle.dataset.id;
        store.updateItem('alarms', id, { enabled: toggle.checked });
        soundEngine.playPreset('micro-tick');
      }
    });

    dom.alarmsListContainer.addEventListener('click', (e) => {
      const testBtn = e.target.closest('.btn-test-alarm');
      if (testBtn) {
        soundEngine.playPreset(testBtn.dataset.sound || 'zen-bowl');
        return;
      }

      const delBtn = e.target.closest('.btn-delete-alarm');
      if (delBtn) {
        const id = delBtn.dataset.id;
        if (confirm('Delete this alarm?')) {
          store.deleteItem('alarms', id);
          soundEngine.playPreset('micro-tick');
        }
      }
    });
  }

  // Scratchpad
  if (dom.btnSaveScratchpad) {
    dom.btnSaveScratchpad.addEventListener('click', () => {
      const text = dom.scratchpadInput.value.trim();
      if (!text) return;
      const tag = dom.scratchpadTagSelect.value;

      const newNote = {
        id: `scratch-${Date.now()}`,
        text,
        content: text,
        tag,
        category: tag.toLowerCase(),
        createdAt: new Date().toISOString()
      };

      store.addItem('scratchpad', newNote);
      dom.scratchpadInput.value = '';
      soundEngine.playPreset('micro-tick');
    });
  }

  if (dom.scratchTagFilters) {
    dom.scratchTagFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.tag-filter-pill');
      if (!btn) return;
      dom.scratchTagFilters.querySelectorAll('.tag-filter-pill').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentScratchTag = btn.dataset.tag;
      renderScratchpad(store.getState());
    });
  }

  if (dom.scratchpadNotesGrid) {
    dom.scratchpadNotesGrid.addEventListener('click', (e) => {
      const delBtn = e.target.closest('.btn-delete-note');
      if (delBtn) {
        store.deleteItem('scratchpad', delBtn.dataset.id);
        soundEngine.playPreset('micro-tick');
        return;
      }

      const convertHabit = e.target.closest('.btn-convert-habit');
      if (convertHabit) {
        const text = decodeURIComponent(convertHabit.dataset.text);
        const newHabit = {
          id: `habit-${Date.now()}`,
          title: text.slice(0, 50),
          icon: '📝',
          timeOfDay: 'anytime',
          frequency: 'daily',
          streak: 0,
          completedDates: []
        };
        store.addItem('habits', newHabit);
        alert(`Converted into new Habit: "${text.slice(0, 50)}"`);
        soundEngine.playPreset('micro-tick');
        return;
      }

      const convertTx = e.target.closest('.btn-convert-tx');
      if (convertTx) {
        const text = decodeURIComponent(convertTx.dataset.text);
        dom.txNote.value = text;
        dom.modalTransaction.classList.add('open');
        return;
      }
    });
  }

  if (dom.btnQuickNote) {
    dom.btnQuickNote.addEventListener('click', () => {
      switchView('scratchpad');
      if (dom.scratchpadInput) dom.scratchpadInput.focus();
    });
  }

  // Preferences Changes
  if (dom.prefCurrency) {
    dom.prefCurrency.addEventListener('change', () => {
      store.updateModule('profile', { currency: dom.prefCurrency.value });
      soundEngine.playPreset('micro-tick');
    });
  }
  if (dom.prefTimeFormat) {
    dom.prefTimeFormat.addEventListener('change', () => {
      store.updateModule('profile', { timeFormat: dom.prefTimeFormat.value });
      soundEngine.playPreset('micro-tick');
    });
  }
  if (dom.prefBudgetCap) {
    dom.prefBudgetCap.addEventListener('change', () => {
      store.updateModule('profile', { dailyBudgetCap: parseFloat(dom.prefBudgetCap.value) || 50 });
      soundEngine.playPreset('micro-tick');
    });
  }
  if (dom.prefWaterGoal) {
    dom.prefWaterGoal.addEventListener('change', () => {
      store.updateModule('hydration', { targetMl: parseInt(dom.prefWaterGoal.value, 10) || 2000 });
      soundEngine.playPreset('micro-tick');
    });
  }
  if (dom.prefSoundPreset) {
    dom.prefSoundPreset.addEventListener('change', () => {
      store.updateModule('profile', { soundPreset: dom.prefSoundPreset.value });
      soundEngine.playPreset(dom.prefSoundPreset.value);
    });
  }

  // Sound Preview Buttons
  if (dom.previewZenBowl) dom.previewZenBowl.addEventListener('click', () => soundEngine.playPreset('zen-bowl'));
  if (dom.previewTriad) dom.previewTriad.addEventListener('click', () => soundEngine.playPreset('gentle-triad'));
  if (dom.previewBell) dom.previewBell.addEventListener('click', () => soundEngine.playPreset('attentive-bell'));
  if (dom.previewTick) dom.previewTick.addEventListener('click', () => soundEngine.playPreset('micro-tick'));
  if (dom.previewWater) dom.previewWater.addEventListener('click', () => soundEngine.playPreset('water-drop'));
  if (dom.previewRain) dom.previewRain.addEventListener('click', () => setSoundscape('pink-rain'));
  if (dom.previewAlpha) dom.previewAlpha.addEventListener('click', () => setSoundscape('alpha-waves'));
  if (dom.previewDrone) dom.previewDrone.addEventListener('click', () => setSoundscape('tibetan-drone'));

  // Snapshots & Recovery
  if (dom.btnCreateSnapshot) {
    dom.btnCreateSnapshot.addEventListener('click', () => {
      const snap = store.createAutoSnapshot('Manual User Checkpoint');
      alert(`Checkpoint saved! (${new Date(snap.timestamp).toLocaleTimeString()})`);
      soundEngine.playPreset('micro-tick');
    });
  }
  if (dom.snapshotsListContainer) {
    dom.snapshotsListContainer.addEventListener('click', (e) => {
      const restBtn = e.target.closest('.btn-restore-snapshot');
      if (!restBtn) return;
      const id = restBtn.dataset.id;
      if (confirm('Restore this checkpoint? Any unsaved changes made after will be rolled back.')) {
        store.restoreAutoSnapshot(id);
        soundEngine.playPreset('zen-bowl');
        alert('Checkpoint restored successfully!');
      }
    });
  }

  // Backup & Restore
  if (dom.btnExportBackup) {
    dom.btnExportBackup.addEventListener('click', () => {
      const jsonStr = store.exportToJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `daily-compass-backup-${getTodayDateString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      soundEngine.playPreset('micro-tick');
    });
  }

  if (dom.fileImportBackup) {
    dom.fileImportBackup.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const success = store.importFromJSON(event.target.result);
          if (success) {
            alert('Backup successfully restored!');
            soundEngine.playPreset('zen-bowl');
          } else {
            alert('Failed to parse backup JSON. Please check file formatting.');
          }
        } catch (err) {
          alert('Error importing JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    });
  }

  if (dom.btnLoadSampleData) {
    dom.btnLoadSampleData.addEventListener('click', () => {
      if (confirm('Reload realistic sample data? Any unsaved edits will be refreshed.')) {
        store.resetToDefaults();
        soundEngine.playPreset('zen-bowl');
      }
    });
  }

  if (dom.btnResetData) {
    dom.btnResetData.addEventListener('click', () => {
      if (confirm('Are you sure you want to completely erase all tracker data?')) {
        store.setState({
          profile: { currency: '$', timeFormat: '12h', focusMode: false, dailyBudgetCap: 50, soundPreset: 'zen-bowl' },
          cashTransactions: [],
          debts: [],
          habits: [],
          alarms: [],
          routines: [],
          scratchpad: [],
          medications: [],
          subscriptions: []
        });
        soundEngine.playPreset('micro-tick');
      }
    });
  }

  // ==========================================================================
  // v2.1 PRO MAX PLUS EVENT LISTENERS
  // ==========================================================================

  // Routine Block Editor
  if (dom.btnOpenAddRoutine) dom.btnOpenAddRoutine.addEventListener('click', () => openRoutineEditor(null));
  if (dom.btnCloseRoutineEditor) dom.btnCloseRoutineEditor.addEventListener('click', closeRoutineEditor);
  if (dom.btnCancelRoutineEditor) dom.btnCancelRoutineEditor.addEventListener('click', closeRoutineEditor);
  if (dom.routineEditStart) dom.routineEditStart.addEventListener('input', updateLiveDurationChip);
  if (dom.routineEditEnd) dom.routineEditEnd.addEventListener('input', updateLiveDurationChip);

  if (dom.routineCategoryPills) {
    dom.routineCategoryPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.category-pill');
      if (!pill) return;
      highlightCategoryPill(pill.dataset.cat);
    });
  }

  if (dom.btnRoutineAddStep) {
    dom.btnRoutineAddStep.addEventListener('click', () => {
      const rows = collectStepBuilderRows();
      rows.push({ title: '', durationMinutes: 15 });
      renderStepBuilderRows(rows);
    });
  }

  if (dom.btnRoutineAutoBalance) {
    dom.btnRoutineAutoBalance.addEventListener('click', () => {
      const rows = collectStepBuilderRows();
      if (rows.length === 0) return;
      const bounds = store.validateRoutineTimeBounds(dom.routineEditStart.value, dom.routineEditEnd.value);
      const per = Math.max(1, Math.floor(bounds.durationMinutes / rows.length));
      const rem = bounds.durationMinutes - (per * rows.length);
      rows.forEach((r, idx) => {
        r.durationMinutes = idx === rows.length - 1 ? per + rem : per;
      });
      renderStepBuilderRows(rows);
      soundEngine.playPreset('micro-tick');
    });
  }

  if (dom.routineEditStepsContainer) {
    dom.routineEditStepsContainer.addEventListener('click', (e) => {
      const del = e.target.closest('.step-delete-btn');
      if (!del) return;
      const row = del.closest('.step-builder-row');
      if (row) row.remove();
    });
  }

  if (dom.todayRoutineStream) {
    dom.todayRoutineStream.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.btn-edit-routine');
      if (!editBtn) return;
      const id = editBtn.dataset.id;
      openRoutineEditor(id);
    });
  }

  if (dom.formRoutineEditor) {
    dom.formRoutineEditor.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = dom.routineEditTitle.value.trim();
      const start = dom.routineEditStart.value;
      const end = dom.routineEditEnd.value;
      const catInfo = getSelectedCategory();
      const steps = collectStepBuilderRows();
      const editId = dom.routineEditId.value;

      if (editId) {
        store.updateRoutine(editId, {
          title,
          startTime: start,
          endTime: end,
          category: catInfo.cat,
          color: catInfo.color,
          icon: catInfo.icon,
          steps
        });
      } else {
        store.createRoutine({
          title,
          startTime: start,
          endTime: end,
          category: catInfo.cat,
          color: catInfo.color,
          icon: catInfo.icon,
          steps
        });
      }

      soundEngine.playPreset('zen-bowl');
      closeRoutineEditor();
    });
  }

  if (dom.btnDeleteRoutine) {
    dom.btnDeleteRoutine.addEventListener('click', () => {
      const editId = dom.routineEditId.value;
      if (!editId) return;
      if (confirm('Delete this routine block?')) {
        store.deleteRoutine(editId);
        soundEngine.playPreset('micro-tick');
        closeRoutineEditor();
      }
    });
  }

  // Privacy Vault & Balance Masking
  if (dom.btnPeekPrivacy) dom.btnPeekPrivacy.addEventListener('click', togglePeekPrivacy);
  if (dom.btnVaultLock) {
    dom.btnVaultLock.addEventListener('click', () => {
      const stat = store.getPrivacyStatus();
      if (stat.hasPin) {
        store.lockVault();
        openPrivacyPinModal('unlock');
      } else {
        openPrivacyPinModal('setup');
      }
    });
  }
  if (dom.btnClosePrivacyPin) dom.btnClosePrivacyPin.addEventListener('click', closePrivacyPinModal);
  if (dom.pinKeypadButtons) {
    dom.pinKeypadButtons.addEventListener('click', (e) => {
      const btn = e.target.closest('.pin-btn');
      if (!btn) return;
      handlePinInput(btn.dataset.val);
    });
  }
  if (dom.linkEmergencyVaultReset) {
    dom.linkEmergencyVaultReset.addEventListener('click', (e) => {
      e.preventDefault();
      const phrase = prompt('To reset your vault without losing any tracker data, type "reset vault":');
      if (phrase && store.emergencyResetPin(phrase)) {
        alert('Vault successfully reset! All data preserved.');
        closePrivacyPinModal();
        initPrivacyState();
      } else if (phrase) {
        alert('Phrase did not match "reset vault".');
      }
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && store.getPrivacyStatus().hasPin) {
      store.lockVault();
      initPrivacyState();
    }
  });

  // Journal & CSV Export
  if (dom.btnOpenJournalExport) dom.btnOpenJournalExport.addEventListener('click', openJournalExportModal);
  if (dom.btnCloseJournalExport) dom.btnCloseJournalExport.addEventListener('click', closeJournalExportModal);
  if (dom.btnCopyJournalClipboard) {
    dom.btnCopyJournalClipboard.addEventListener('click', () => {
      if (dom.journalPreviewText) {
        navigator.clipboard.writeText(dom.journalPreviewText.value).then(() => {
          alert('Journal markdown copied to clipboard!');
          soundEngine.playPreset('micro-tick');
        });
      }
    });
  }
  if (dom.btnDownloadJournalMd) {
    dom.btnDownloadJournalMd.addEventListener('click', () => {
      const content = store.exportMarkdownDayJournal();
      downloadFile(`Daily-Compass-Journal-${getTodayDateString()}.md`, content, 'text/markdown;charset=utf-8;');
      soundEngine.playPreset('micro-tick');
    });
  }
  if (dom.btnDownloadLedgerCsv) {
    dom.btnDownloadLedgerCsv.addEventListener('click', () => {
      const content = store.exportCSVTransactions();
      downloadFile(`Daily-Compass-Ledger-${getTodayDateString()}.csv`, content, 'text/csv;charset=utf-8;');
      soundEngine.playPreset('micro-tick');
    });
  }
  if (dom.btnExportCsvDirect) {
    dom.btnExportCsvDirect.addEventListener('click', () => {
      const content = store.exportCSVTransactions();
      downloadFile(`Daily-Compass-Ledger-${getTodayDateString()}.csv`, content, 'text/csv;charset=utf-8;');
      soundEngine.playPreset('micro-tick');
    });
  }

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // Quick Peek Privacy Toggle: Alt+P or Alt+M
    if ((e.altKey || e.metaKey) && (e.key === 'p' || e.key === 'P' || e.key === 'm' || e.key === 'M')) {
      e.preventDefault();
      togglePeekPrivacy();
      return;
    }

    // Omnibar Toggle: Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (dom.modalOmnibar.classList.contains('open')) {
        closeOmnibar();
      } else {
        openOmnibar();
      }
      return;
    }

    // Energy Battery Quick Cycle: Key E (when not in input)
    if (e.key === 'e' || e.key === 'E') {
      if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        const curLvl = store.getState().energyBattery?.level ?? 80;
        const nextLvl = curLvl > 60 ? 60 : curLvl > 20 ? 20 : 100;
        store.setEnergyLevel(nextLvl);
        soundEngine.playPreset('micro-tick');
        return;
      }
    }

    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.open').forEach((m) => m.classList.remove('open'));
      }
      return;
    }

    if (e.key === 'f' || e.key === 'F') {
      toggleFocusMode();
    } else if (e.key === 'Escape') {
      if (isFocusMode) toggleFocusMode(false);
      document.querySelectorAll('.modal-backdrop.open').forEach((m) => m.classList.remove('open'));
    } else if ((e.altKey || e.metaKey) && (e.key === 'n' || e.key === 'N')) {
      e.preventDefault();
      switchView('scratchpad');
      if (dom.scratchpadInput) dom.scratchpadInput.focus();
    }
  });
}

// ==========================================================================
// PWA SERVICE WORKER REGISTRATION & DAILY BASELINE SNAPSHOT
// ==========================================================================
function initServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      console.log('Daily Compass PWA ServiceWorker active:', reg.scope);
    }).catch((err) => {
      console.warn('ServiceWorker registration skipped:', err.message);
    });
  }
}

function initDailyBaselineSnapshot() {
  const state = store.getState();
  const snaps = state.snapshots || [];
  const todayPrefix = getTodayDateString();

  const hasTodayBaseline = snaps.some((s) => s.label.includes('Daily Baseline') && (s.timestamp || '').startsWith(todayPrefix));
  if (!hasTodayBaseline) {
    store.createAutoSnapshot(`Daily Baseline (${todayPrefix})`);
  }
}

// ==========================================================================
// APPLICATION BOOTSTRAP
// ==========================================================================
function init() {
  store.subscribe((newState) => {
    renderAll();
  });

  renderAll();
  initPrivacyState();
  initClockAndRoutines();
  setupEventListeners();
  initServiceWorker();
  initDailyBaselineSnapshot();

  console.log('Daily Compass v2.1 Pro Max Plus Operating System initialized.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
