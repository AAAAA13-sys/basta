/* ==========================================================================
   DAILY COMPASS - APPLICATION CONTROLLER (js/app.js)
   Anti-overwhelm life tracker, audio triggers, and local-first UI
   ========================================================================== */

import { store } from './store.js';
import { soundEngine } from './audio.js';

// --- State Variables ---
let currentView = 'today';
let currentDebtTab = 'they_owe_me';
let currentTxFilter = 'all';
let currentScratchTag = 'All';
let isFocusMode = false;
let firedAlarmsToday = new Set(); // Prevent duplicate alarm rings in the same minute
let breathingInterval = null;

// --- Helper Utilities ---
function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  // Views
  views: document.querySelectorAll('.view-section'),
  sidebarNavItems: document.querySelectorAll('.nav-menu .nav-item'),
  mobileDockBtns: document.querySelectorAll('.mobile-dock-btn'),
  
  // Headers & Clocks
  headerTime: document.getElementById('header-time-clock'),
  headerDate: document.getElementById('header-date-text'),
  heroClock: document.getElementById('hero-master-clock'),
  heroDate: document.getElementById('hero-master-date'),
  dayProgressPercent: document.getElementById('day-progress-percent'),
  dayProgressBar: document.getElementById('day-progress-bar'),

  // Anchor / Today
  anchorRoutineChip: document.getElementById('anchor-routine-chip'),
  anchorTimeRemaining: document.getElementById('anchor-time-remaining'),
  anchorImmediateTask: document.getElementById('anchor-immediate-task'),
  btnCompleteImmediate: document.getElementById('btn-complete-immediate-step'),
  todayRoutineStream: document.getElementById('today-routine-stream'),

  // Quick Metrics
  metricSafeSpend: document.getElementById('metric-safe-spend'),
  metricSpentToday: document.getElementById('metric-spent-today'),
  metricHabitsRatio: document.getElementById('metric-habits-ratio'),
  metricNextAlarm: document.getElementById('metric-next-alarm'),
  metricNextAlarmLabel: document.getElementById('metric-next-alarm-label'),
  metricNetDebt: document.getElementById('metric-net-debt'),

  // Badges in Sidebar
  sidebarStepBadge: document.getElementById('sidebar-step-badge'),
  sidebarSafeBadge: document.getElementById('sidebar-safe-badge'),
  sidebarHabitBadge: document.getElementById('sidebar-habit-badge'),

  // Focus Mode
  btnFocusToggle: document.getElementById('btn-focus-toggle'),
  focusToggleLabel: document.getElementById('focus-toggle-label'),
  focusExitBanner: document.getElementById('focus-exit-banner'),
  btnExitFocus: document.getElementById('btn-exit-focus'),

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

  // Debt & Credit
  tabDebtLent: document.getElementById('tab-debt-lent'),
  tabDebtBorrowed: document.getElementById('tab-debt-borrowed'),
  summaryTotalLent: document.getElementById('summary-total-lent'),
  summaryTotalBorrowed: document.getElementById('summary-total-borrowed'),
  summaryNetDebt: document.getElementById('summary-net-debt'),
  debtCardsGrid: document.getElementById('debt-cards-grid'),
  btnOpenAddDebt: document.getElementById('btn-open-add-debt'),

  // Habits & Alarms
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
  btnQuickNote: document.getElementById('btn-quick-note'),

  // Settings & Sound
  prefCurrency: document.getElementById('pref-currency'),
  prefTimeFormat: document.getElementById('pref-time-format'),
  prefBudgetCap: document.getElementById('pref-budget-cap'),
  prefSoundPreset: document.getElementById('pref-sound-preset'),
  btnExportBackup: document.getElementById('btn-export-backup'),
  fileImportBackup: document.getElementById('file-import-backup'),
  btnLoadSampleData: document.getElementById('btn-load-sample-data'),
  btnResetData: document.getElementById('btn-reset-data'),
  previewZenBowl: document.getElementById('preview-zen-bowl'),
  previewTriad: document.getElementById('preview-triad'),
  previewBell: document.getElementById('preview-bell'),
  previewTick: document.getElementById('preview-tick'),

  // Modals
  modalGrounding: document.getElementById('modal-grounding'),
  btnSidebarGrounding: document.getElementById('btn-sidebar-grounding'),
  btnHeaderGrounding: document.getElementById('btn-header-grounding'),
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
  habitTimeOfDay: document.getElementById('habit-time-of-day')
};

// ==========================================================================
// VIEW ROUTING
// ==========================================================================
function switchView(viewName) {
  currentView = viewName;

  dom.views.forEach(v => {
    v.classList.remove('active');
    if (v.id === `view-${viewName}`) {
      v.classList.add('active');
    }
  });

  dom.sidebarNavItems.forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });

  dom.mobileDockBtns.forEach(btn => {
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
      // Calculate remaining minutes
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
    return; // Already triggered this minute
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

  // Open ringing modal overlay
  dom.modalAlarmRinging.classList.add('open');

  // Start continuous chime loop via Web Audio API
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
  let phase = 0; // 0: Inhale (4s), 1: Hold (7s), 2: Exhale (8s)
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
    alert('⏳ 15-Minute Breather Activated.\nAlarms delayed. Take your time to reset.');
  } else if (actionType === 'catchup') {
    switchView('today');
    alert('⚡ Schedule Re-Aligned to Now.\nPast incomplete routine blocks are gently cleared. Start fresh with this hour.');
  } else if (actionType === 'rest') {
    alert('🌿 Rest Mode Enabled.\nTake it easy today. Only essential self-care is highlighted.');
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
// RENDER & UPDATE VIEWS
// ==========================================================================
function renderAll() {
  const state = store.getState();
  renderAnchorAndToday(state);
  renderFinance(state);
  renderDebt(state);
  renderHabitsAndAlarms(state);
  renderScratchpad(state);
  renderSettings(state);
}

// 1. Render Anchor & Today View
function renderAnchorAndToday(state) {
  const habits = state.habits || [];
  const todayStr = getTodayDateString();
  const completedCount = habits.filter(h => h.completedDates && h.completedDates.includes(todayStr)).length;

  if (dom.metricHabitsRatio) {
    dom.metricHabitsRatio.textContent = `${completedCount} / ${habits.length}`;
  }
  if (dom.sidebarHabitBadge) {
    dom.sidebarHabitBadge.textContent = `${completedCount}/${habits.length}`;
  }

  // Safe to Spend Metric
  const safeSpend = store.getSafeToSpendToday ? store.getSafeToSpendToday() : 34.50;
  if (dom.metricSafeSpend) dom.metricSafeSpend.textContent = formatCurrency(safeSpend);
  if (dom.sidebarSafeBadge) dom.sidebarSafeBadge.textContent = formatCurrency(safeSpend);

  // Spent Today
  const txs = state.cashTransactions || [];
  const spentToday = txs
    .filter(t => t.date === todayStr && t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const cap = state.profile?.dailyBudgetCap || 50;
  if (dom.metricSpentToday) {
    dom.metricSpentToday.textContent = `${formatCurrency(spentToday)} spent of ${formatCurrency(cap)} cap`;
  }

  // Next Alarm
  const alarms = state.alarms || [];
  const enabledAlarms = alarms.filter(a => a.enabled);
  if (enabledAlarms.length > 0) {
    const nextA = enabledAlarms[0];
    if (dom.metricNextAlarm) dom.metricNextAlarm.textContent = formatTimeString(nextA.time, state.profile?.timeFormat);
    if (dom.metricNextAlarmLabel) dom.metricNextAlarmLabel.textContent = nextA.label;
  } else {
    if (dom.metricNextAlarm) dom.metricNextAlarm.textContent = 'None';
    if (dom.metricNextAlarmLabel) dom.metricNextAlarmLabel.textContent = 'No alarms active';
  }

  // Debt Net Balance
  const debts = state.debts || [];
  let totalLent = 0;
  let totalBorrowed = 0;
  debts.forEach(d => {
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
    dom.todayRoutineStream.innerHTML = routines.map(r => {
      const stepsHtml = (r.steps || []).map(s => `<li>${s.title}</li>`).join('');
      return `
        <div class="timeline-item" data-id="${r.id}">
          <div class="timeline-dot">${r.icon || '⏰'}</div>
          <div class="timeline-card">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <strong style="color: var(--text-primary); font-size: 15px;">${r.title}</strong>
              <span style="font-family: var(--font-mono); font-size: 12px; color: var(--accent-sky);">
                ${formatTimeString(r.start, state.profile?.timeFormat)} &ndash; ${formatTimeString(r.end, state.profile?.timeFormat)}
              </span>
            </div>
            ${stepsHtml ? `<ul style="margin-top: 6px; padding-left: 18px; font-size: 13px; color: var(--text-secondary);">${stepsHtml}</ul>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }
}

// 2. Render Finance & Cash View
function renderFinance(state) {
  const cap = state.profile?.dailyBudgetCap || 50;
  const todayStr = getTodayDateString();
  const txs = state.cashTransactions || [];

  const spentToday = txs
    .filter(t => t.date === todayStr && t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const safeLeft = Math.max(0, cap - spentToday);
  const percentUsed = Math.min(100, Math.round((spentToday / cap) * 100));

  if (dom.statDailyLimit) dom.statDailyLimit.textContent = formatCurrency(cap);
  if (dom.statTodaySpent) dom.statTodaySpent.textContent = formatCurrency(spentToday);
  if (dom.statSafeLeft) dom.statSafeLeft.textContent = formatCurrency(safeLeft);

  if (dom.budgetProgressFill) {
    dom.budgetProgressFill.style.width = `${percentUsed}%`;
    dom.budgetProgressFill.className = 'progress-fill ' + 
      (percentUsed > 100 ? 'fill-rose' : percentUsed > 80 ? 'fill-amber' : 'fill-sage');
  }

  // Transactions list
  if (dom.transactionsList) {
    let filtered = [...txs];
    if (currentTxFilter === 'expense') filtered = filtered.filter(t => t.type === 'expense');
    if (currentTxFilter === 'income') filtered = filtered.filter(t => t.type === 'income');

    filtered.sort((a, b) => (b.timestamp || b.date).localeCompare(a.timestamp || a.date));

    if (filtered.length === 0) {
      dom.transactionsList.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-muted);">No transactions logged yet.</div>`;
    } else {
      dom.transactionsList.innerHTML = filtered.map(t => {
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

// 3. Render Debt View
function renderDebt(state) {
  const debts = state.debts || [];
  let totalLent = 0;
  let totalBorrowed = 0;

  debts.forEach(d => {
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

  // Filter by active tab
  const filtered = debts.filter(d => {
    const isLent = d.type === 'they_owe_me' || d.direction === 'lent';
    return currentDebtTab === 'they_owe_me' ? isLent : !isLent;
  });

  if (dom.debtCardsGrid) {
    if (filtered.length === 0) {
      dom.debtCardsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 32px; color: var(--text-muted);">No records in this ledger.</div>`;
    } else {
      dom.debtCardsGrid.innerHTML = filtered.map(d => {
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

// 4. Render Habits & Alarms View
function renderHabitsAndAlarms(state) {
  const habits = state.habits || [];
  const todayStr = getTodayDateString();

  if (dom.habitsListGrid) {
    if (habits.length === 0) {
      dom.habitsListGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 24px; color: var(--text-muted);">No habits added yet.</div>`;
    } else {
      dom.habitsListGrid.innerHTML = habits.map(h => {
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
      dom.alarmsListContainer.innerHTML = alarms.map(a => {
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

// 5. Render Scratchpad / Brain Dump View
function renderScratchpad(state) {
  const notes = state.scratchpad || [];
  let filtered = [...notes];
  if (currentScratchTag !== 'All') {
    filtered = filtered.filter(n => (n.tag || n.category) === currentScratchTag);
  }

  if (dom.scratchpadNotesGrid) {
    if (filtered.length === 0) {
      dom.scratchpadNotesGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 32px; color: var(--text-muted);">No notes in this category. Write anything above!</div>`;
    } else {
      dom.scratchpadNotesGrid.innerHTML = filtered.map(n => {
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

// 6. Render Settings View
function renderSettings(state) {
  const p = state.profile || {};
  if (dom.prefCurrency) dom.prefCurrency.value = p.currency || '$';
  if (dom.prefTimeFormat) dom.prefTimeFormat.value = p.timeFormat || '12h';
  if (dom.prefBudgetCap) dom.prefBudgetCap.value = p.dailyBudgetCap || 50;
  if (dom.prefSoundPreset) dom.prefSoundPreset.value = p.soundPreset || 'zen-bowl';
}

// ==========================================================================
// EVENT LISTENERS & CRUD OPERATIONS
// ==========================================================================
function setupEventListeners() {
  // Navigation: Desktop Sidebar
  dom.sidebarNavItems.forEach(item => {
    item.addEventListener('click', () => {
      switchView(item.dataset.view);
      soundEngine.playPreset('micro-tick');
    });
  });

  // Navigation: Mobile Bottom Dock
  dom.mobileDockBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchView(btn.dataset.view);
      soundEngine.playPreset('micro-tick');
    });
  });

  // Focus Mode Toggle
  if (dom.btnFocusToggle) {
    dom.btnFocusToggle.addEventListener('click', () => toggleFocusMode());
  }
  if (dom.btnExitFocus) {
    dom.btnExitFocus.addEventListener('click', () => toggleFocusMode(false));
  }

  // Grounding Engine
  if (dom.btnSidebarGrounding) {
    dom.btnSidebarGrounding.addEventListener('click', openGroundingModal);
  }
  if (dom.btnHeaderGrounding) {
    dom.btnHeaderGrounding.addEventListener('click', openGroundingModal);
  }
  if (dom.btnCloseGrounding) {
    dom.btnCloseGrounding.addEventListener('click', closeGroundingModal);
  }
  if (dom.btnGroundBreather) {
    dom.btnGroundBreather.addEventListener('click', () => applyGroundingAction('breather'));
  }
  if (dom.btnGroundCatchup) {
    dom.btnGroundCatchup.addEventListener('click', () => applyGroundingAction('catchup'));
  }
  if (dom.btnGroundRest) {
    dom.btnGroundRest.addEventListener('click', () => applyGroundingAction('rest'));
  }

  // Alarm Ringing Modal
  if (dom.btnDismissAlarm) {
    dom.btnDismissAlarm.addEventListener('click', dismissRingingAlarm);
  }
  if (dom.btnSnooze5) {
    dom.btnSnooze5.addEventListener('click', () => snoozeAlarm(5));
  }
  if (dom.btnSnooze10) {
    dom.btnSnooze10.addEventListener('click', () => snoozeAlarm(10));
  }
  if (dom.btnSnooze15) {
    dom.btnSnooze15.addEventListener('click', () => snoozeAlarm(15));
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

  // Cash: Transaction Filters
  if (dom.filterTxAll) {
    dom.filterTxAll.addEventListener('click', () => {
      currentTxFilter = 'all';
      renderFinance(store.getState());
    });
  }
  if (dom.filterTxExpense) {
    dom.filterTxExpense.addEventListener('click', () => {
      currentTxFilter = 'expense';
      renderFinance(store.getState());
    });
  }
  if (dom.filterTxIncome) {
    dom.filterTxIncome.addEventListener('click', () => {
      currentTxFilter = 'income';
      renderFinance(store.getState());
    });
  }

  // Cash: Add Transaction Modal & Form
  if (dom.btnOpenAddTx) {
    dom.btnOpenAddTx.addEventListener('click', () => dom.modalTransaction.classList.add('open'));
  }
  if (dom.btnCloseTx) {
    dom.btnCloseTx.addEventListener('click', () => dom.modalTransaction.classList.remove('open'));
  }
  if (dom.btnCancelTx) {
    dom.btnCancelTx.addEventListener('click', () => dom.modalTransaction.classList.remove('open'));
  }
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

  // Debt: Tabs
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

  // Debt: Add Modal & Form
  if (dom.btnOpenAddDebt) {
    dom.btnOpenAddDebt.addEventListener('click', () => dom.modalDebt.classList.add('open'));
  }
  if (dom.btnCloseDebt) {
    dom.btnCloseDebt.addEventListener('click', () => dom.modalDebt.classList.remove('open'));
  }
  if (dom.btnCancelDebt) {
    dom.btnCancelDebt.addEventListener('click', () => dom.modalDebt.classList.remove('open'));
  }
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

  // Debt: Settle / Pay Actions
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
      const item = (state.debts || []).find(d => d.id === id);

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
  if (dom.btnCloseSettle) {
    dom.btnCloseSettle.addEventListener('click', () => dom.modalSettleDebt.classList.remove('open'));
  }
  if (dom.btnCancelSettle) {
    dom.btnCancelSettle.addEventListener('click', () => dom.modalSettleDebt.classList.remove('open'));
  }

  // Habits: Check Toggle
  if (dom.habitsListGrid) {
    dom.habitsListGrid.addEventListener('click', (e) => {
      const checkBtn = e.target.closest('.btn-check-habit');
      if (!checkBtn) return;
      const id = checkBtn.dataset.id;
      const todayStr = getTodayDateString();
      const state = store.getState();
      const habit = (state.habits || []).find(h => h.id === id);

      if (habit) {
        let dates = habit.completedDates ? [...habit.completedDates] : [];
        let streak = habit.streak || 0;

        if (dates.includes(todayStr)) {
          dates = dates.filter(d => d !== todayStr);
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

  // Habits: Add Modal & Form
  if (dom.btnOpenAddHabit) {
    dom.btnOpenAddHabit.addEventListener('click', () => dom.modalHabit.classList.add('open'));
  }
  if (dom.btnCloseHabit) {
    dom.btnCloseHabit.addEventListener('click', () => dom.modalHabit.classList.remove('open'));
  }
  if (dom.btnCancelHabit) {
    dom.btnCancelHabit.addEventListener('click', () => dom.modalHabit.classList.remove('open'));
  }
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

  // Alarms: Add Modal & Form
  if (dom.btnOpenAddAlarm) {
    dom.btnOpenAddAlarm.addEventListener('click', () => dom.modalAlarm.classList.add('open'));
  }
  if (dom.btnCloseAlarm) {
    dom.btnCloseAlarm.addEventListener('click', () => dom.modalAlarm.classList.remove('open'));
  }
  if (dom.btnCancelAlarm) {
    dom.btnCancelAlarm.addEventListener('click', () => dom.modalAlarm.classList.remove('open'));
  }
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

  // Alarms: Toggle, Test, Delete
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

  // Scratchpad: Save Note
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

  // Scratchpad: Tag Filter
  if (dom.scratchTagFilters) {
    dom.scratchTagFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.tag-filter-pill');
      if (!btn) return;
      dom.scratchTagFilters.querySelectorAll('.tag-filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentScratchTag = btn.dataset.tag;
      renderScratchpad(store.getState());
    });
  }

  // Scratchpad: 1-Click Convert Actions
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

  // Header Quick Note Button
  if (dom.btnQuickNote) {
    dom.btnQuickNote.addEventListener('click', () => {
      switchView('scratchpad');
      if (dom.scratchpadInput) dom.scratchpadInput.focus();
    });
  }

  // Settings: Preferences Changes
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
  if (dom.prefSoundPreset) {
    dom.prefSoundPreset.addEventListener('change', () => {
      store.updateModule('profile', { soundPreset: dom.prefSoundPreset.value });
      soundEngine.playPreset(dom.prefSoundPreset.value);
    });
  }

  // Settings: Sound Preview Board
  if (dom.previewZenBowl) dom.previewZenBowl.addEventListener('click', () => soundEngine.playPreset('zen-bowl'));
  if (dom.previewTriad) dom.previewTriad.addEventListener('click', () => soundEngine.playPreset('gentle-triad'));
  if (dom.previewBell) dom.previewBell.addEventListener('click', () => soundEngine.playPreset('attentive-bell'));
  if (dom.previewTick) dom.previewTick.addEventListener('click', () => soundEngine.playPreset('micro-tick'));

  // Settings: Export & Import JSON Backup
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
          scratchpad: []
        });
        soundEngine.playPreset('micro-tick');
      }
    });
  }

  // Keyboard Navigation & Shortcuts
  window.addEventListener('keydown', (e) => {
    // If typing in input or textarea, don't trigger global shortcuts
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
      }
      return;
    }

    if (e.key === 'f' || e.key === 'F') {
      toggleFocusMode();
    } else if (e.key === 'Escape') {
      if (isFocusMode) toggleFocusMode(false);
      document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
    } else if ((e.altKey || e.metaKey) && (e.key === 'n' || e.key === 'N')) {
      e.preventDefault();
      switchView('scratchpad');
      if (dom.scratchpadInput) dom.scratchpadInput.focus();
    }
  });
}

// ==========================================================================
// PWA SERVICE WORKER REGISTRATION
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

// ==========================================================================
// APPLICATION BOOTSTRAP
// ==========================================================================
function init() {
  // Subscribe UI to store mutations
  store.subscribe((newState) => {
    renderAll();
  });

  // Initial UI Render
  renderAll();

  // Setup Clocks, Routines & Alarms
  initClockAndRoutines();

  // Setup DOM Event Listeners
  setupEventListeners();

  // Initialize PWA Service Worker
  initServiceWorker();

  console.log('Daily Compass Application initialized with zero dependencies.');
}

// Start app once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
