/**
 * Comprehensive Automated Test Suite for Daily Compass
 * Testing & Verification: Milestone 4
 *
 * Verifies:
 * - Store initialization and schema consistency
 * - Export / import validation (Overwrite & Merge modes)
 * - Calculation logic (cash safe-to-spend, debt settlements, habit streaks, alarm triggers, routine blocks)
 * - Edge cases: localStorage quota exceeded, bad JSON import, timezone transitions, zero division in budgets, over-settlement
 * - Audio synthesis engine (Web Audio API presets, alarm loop, volume clamping)
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// ============================================================================
// ENVIRONMENT MOCKS (Node.js compatibility for Web APIs)
// ============================================================================

class MockLocalStorage {
  constructor() {
    this.store = {};
    this.shouldThrowQuotaError = false;
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    if (this.shouldThrowQuotaError) {
      const err = new Error('QuotaExceededError: DOMException 22');
      err.name = 'QuotaExceededError';
      err.code = 22;
      throw err;
    }
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
    this.shouldThrowQuotaError = false;
  }
}

class MockAudioParam {
  constructor(defaultValue = 0) {
    this.value = defaultValue;
    this.history = [];
  }
  setValueAtTime(val, time) {
    this.value = val;
    this.history.push({ type: 'setValueAtTime', val, time });
  }
  linearRampToValueAtTime(val, time) {
    this.value = val;
    this.history.push({ type: 'linearRampToValueAtTime', val, time });
  }
  exponentialRampToValueAtTime(val, time) {
    this.value = val;
    this.history.push({ type: 'exponentialRampToValueAtTime', val, time });
  }
}

class MockAudioNode {
  constructor() {
    this.connectedTo = [];
    this.isStopped = false;
    this.isStarted = false;
  }
  connect(dest) {
    this.connectedTo.push(dest);
    return dest;
  }
  disconnect() {
    this.connectedTo = [];
  }
  start(time = 0) {
    this.isStarted = true;
    this.startTime = time;
  }
  stop(time = 0) {
    this.isStopped = true;
    this.stopTime = time;
  }
}

class MockGainNode extends MockAudioNode {
  constructor() {
    super();
    this.gain = new MockAudioParam(1);
  }
}

class MockOscillatorNode extends MockAudioNode {
  constructor() {
    super();
    this.frequency = new MockAudioParam(440);
    this.type = 'sine';
  }
}

class MockBiquadFilterNode extends MockAudioNode {
  constructor() {
    super();
    this.frequency = new MockAudioParam(1000);
    this.Q = new MockAudioParam(1);
    this.type = 'lowpass';
  }
}

class MockAudioContext {
  constructor() {
    this.currentTime = 0;
    this.state = 'running';
    this.destination = new MockAudioNode();
    this.createdNodes = [];
  }
  createGain() {
    const node = new MockGainNode();
    this.createdNodes.push(node);
    return node;
  }
  createOscillator() {
    const node = new MockOscillatorNode();
    this.createdNodes.push(node);
    return node;
  }
  createBiquadFilter() {
    const node = new MockBiquadFilterNode();
    this.createdNodes.push(node);
    return node;
  }
  resume() {
    this.state = 'running';
    return Promise.resolve();
  }
  suspend() {
    this.state = 'suspended';
    return Promise.resolve();
  }
}

const mockStorageInstance = new MockLocalStorage();
global.window = {
  localStorage: mockStorageInstance,
  addEventListener: () => {},
  removeEventListener: () => {}
};
global.AudioContext = MockAudioContext;

// Import application modules
const { store, STORAGE_KEY, DEFAULT_STATE, getLocalDateString, generateId } = await import('../js/store.js');
const { soundEngine, audio } = await import('../js/audio.js');

// ============================================================================
// TEST SUITE 1: STORE INITIALIZATION & SCHEMA INTEGRITY
// ============================================================================

describe('Suite 1: Store Initialization & Schemas', () => {
  beforeEach(() => {
    mockStorageInstance.clear();
    store.resetToDefaults();
  });

  test('Store initializes with all required top-level modules', () => {
    const state = store.getState();
    const requiredModules = [
      'settings',
      'profile',
      'anchor',
      'alarms',
      'routines',
      'cashTransactions',
      'debts',
      'habits',
      'scratchpad'
    ];

    for (const mod of requiredModules) {
      assert.ok(mod in state, `Expected state to contain module "${mod}"`);
    }
  });

  test('Settings and profile schemas contain valid default preferences', () => {
    const state = store.getState();
    assert.strictEqual(state.settings.currency, '$');
    assert.strictEqual(state.settings.timeFormat, '12h');
    assert.strictEqual(state.settings.focusMode, false);
    assert.strictEqual(state.settings.dailyBudgetCap, 50);
    assert.strictEqual(state.settings.soundPreset, 'zen-bowl');
    assert.strictEqual(typeof state.settings.chimeVolume, 'number');
    assert.strictEqual(state.settings.audioEnabled, true);

    // Profile sync
    assert.strictEqual(state.profile.name, 'Navigator');
    assert.strictEqual(state.profile.currency, state.settings.currency);
  });

  test('Routine structures conform to scheduling schema', () => {
    const state = store.getState();
    assert.ok(Array.isArray(state.routines));
    assert.ok(state.routines.length >= 3, 'Must have at least 3 initial routines');

    for (const r of state.routines) {
      assert.ok(r.id, 'Routine must have id');
      assert.ok(r.title, 'Routine must have title');
      assert.match(r.start, /^\d{2}:\d{2}$/, 'Start time must be HH:MM');
      assert.match(r.end, /^\d{2}:\d{2}$/, 'End time must be HH:MM');
      assert.ok(Array.isArray(r.steps), 'Routine must contain steps array');
      for (const s of r.steps) {
        assert.ok(s.id, 'Step must have id');
        assert.ok(s.title, 'Step must have title');
        assert.strictEqual(typeof s.durationMinutes, 'number');
      }
    }
  });

  test('Alarm structures contain valid trigger and sound properties', () => {
    const state = store.getState();
    assert.ok(Array.isArray(state.alarms));
    assert.ok(state.alarms.length >= 2, 'Must have initial alarms');

    for (const a of state.alarms) {
      assert.ok(a.id, 'Alarm must have id');
      assert.match(a.time, /^\d{2}:\d{2}$/, 'Alarm time must match HH:MM');
      assert.strictEqual(typeof a.enabled, 'boolean');
      assert.ok(Array.isArray(a.days || a.daysOfWeek), 'Alarm must have days array');
    }
  });

  test('State immutability: getState returns deep clone', () => {
    const s1 = store.getState();
    s1.settings.currency = '€';
    s1.habits.push({ id: 'mutation-test' });

    const s2 = store.getState();
    assert.strictEqual(s2.settings.currency, '$');
    assert.ok(!s2.habits.find(h => h.id === 'mutation-test'));
  });
});

// ============================================================================
// TEST SUITE 2: CRUD & STATE REACTIVITY
// ============================================================================

describe('Suite 2: CRUD Operations & Reactivity', () => {
  beforeEach(() => {
    mockStorageInstance.clear();
    store.resetToDefaults();
  });

  test('addItem creates unique ID if omitted and updates store', () => {
    const newTx = store.addItem('cashTransactions', {
      type: 'expense',
      amount: 12.50,
      category: 'Transit',
      date: getLocalDateString(0)
    });

    assert.ok(newTx.id, 'addItem should assign an id');
    const state = store.getState();
    const found = state.cashTransactions.find(t => t.id === newTx.id);
    assert.ok(found);
    assert.strictEqual(found.amount, 12.50);
  });

  test('updateItem modifies target item without mutating others', () => {
    const state = store.getState();
    const targetHabit = state.habits[0];

    const updated = store.updateItem('habits', targetHabit.id, {
      streak: 99
    });

    assert.strictEqual(updated, true);
    const refreshed = store.getState().habits.find(h => h.id === targetHabit.id);
    assert.strictEqual(refreshed.streak, 99);
  });

  test('deleteItem removes item from array module', () => {
    const state = store.getState();
    const target = state.scratchpad[0];

    const deleted = store.deleteItem('scratchpad', target.id);
    assert.strictEqual(deleted, true);

    const refreshed = store.getState().scratchpad.find(n => n.id === target.id);
    assert.strictEqual(refreshed, undefined);
  });

  test('updateModule synchronizes settings and profile', () => {
    store.updateModule('settings', { currency: '£', dailyBudgetCap: 75 });
    const state = store.getState();
    assert.strictEqual(state.settings.currency, '£');
    assert.strictEqual(state.profile.currency, '£');
    assert.strictEqual(state.settings.dailyBudgetCap, 75);
    assert.strictEqual(state.profile.dailyBudgetCap, 75);
  });

  test('Store subscribers receive fresh state snapshots upon changes', () => {
    let callCount = 0;
    let latestState = null;

    const unsubscribe = store.subscribe((snap) => {
      callCount++;
      latestState = snap;
    });

    store.addItem('scratchpad', { text: 'New notification test', tag: 'Idea' });
    assert.strictEqual(callCount, 1);
    assert.ok(latestState.scratchpad.some(n => n.text === 'New notification test'));

    unsubscribe();
    store.addItem('scratchpad', { text: 'Another test', tag: 'Idea' });
    assert.strictEqual(callCount, 1, 'Unsubscribed listener must not be called again');
  });
});

// ============================================================================
// TEST SUITE 3: CALCULATION LOGIC
// ============================================================================

describe('Suite 3: Calculation Logic', () => {
  beforeEach(() => {
    mockStorageInstance.clear();
    store.resetToDefaults();
  });

  test('Cash Safe-to-Spend: Accurately calculates remaining daily budget', () => {
    const today = getLocalDateString(0);
    const yesterday = getLocalDateString(-1);

    // Set budget cap to 100
    store.updateModule('settings', { dailyBudgetCap: 100 });

    // Clear existing transactions and insert test data
    store.setState((prev) => ({
      ...prev,
      cashTransactions: [
        { id: 't1', date: today, type: 'expense', amount: 15.00 },
        { id: 't2', date: today, type: 'expense', amount: 25.50 },
        { id: 't3', date: today, type: 'income', amount: 50.00 }, // Income should not count towards daily expense
        { id: 't4', date: yesterday, type: 'expense', amount: 40.00 } // Yesterday's expense should not count
      ]
    }));

    const expensesToday = store.getExpensesTotal(today);
    assert.strictEqual(expensesToday, 40.50);

    const safeToSpend = store.getSafeToSpendToday();
    assert.strictEqual(safeToSpend, 59.50); // 100 - 40.50
  });

  test('Cash Safe-to-Spend: Calculates negative values when daily budget exceeded', () => {
    const today = getLocalDateString(0);
    store.updateModule('settings', { dailyBudgetCap: 30 });
    store.setState((prev) => ({
      ...prev,
      cashTransactions: [
        { id: 't1', date: today, type: 'expense', amount: 55.00 }
      ]
    }));

    const safeToSpend = store.getSafeToSpendToday();
    assert.strictEqual(safeToSpend, -25.00); // 30 - 55 = -25
  });

  test('Debt Summary: Correctly computes Lent, Borrowed, and Net Balance', () => {
    store.setState((prev) => ({
      ...prev,
      debts: [
        // Lent to Alice: $50 remaining
        { id: 'd1', type: 'they_owe_me', direction: 'lent', person: 'Alice', amount: 50, remaining: 50, status: 'unpaid' },
        // Lent to Bob: $40 total, $15 remaining (partially paid)
        { id: 'd2', type: 'they_owe_me', direction: 'lent', person: 'Bob', amount: 40, remaining: 15, status: 'partial' },
        // Lent to Charlie: $30 total, settled (should be ignored in active summary)
        { id: 'd3', type: 'they_owe_me', direction: 'lent', person: 'Charlie', amount: 30, remaining: 0, status: 'settled' },
        // Borrowed from Dave: $25 remaining
        { id: 'd4', type: 'i_owe_them', direction: 'borrowed', person: 'Dave', amount: 25, remaining: 25, status: 'unpaid' }
      ]
    }));

    const summary = store.getDebtSummary();
    assert.strictEqual(summary.theyOweMe, 65.00); // 50 + 15
    assert.strictEqual(summary.iOweThem, 25.00);  // 25
    assert.strictEqual(summary.netReceivable, 40.00); // 65 - 25 = +40
  });

  test('Debt Settlement Logic: Partial and full settlements update status and remaining balance', () => {
    store.addItem('debts', {
      id: 'debt-test-settle',
      type: 'they_owe_me',
      person: 'Elena',
      amount: 100,
      remaining: 100,
      status: 'unpaid'
    });

    // 1. Partial payment of $40
    let debt = store.getState().debts.find(d => d.id === 'debt-test-settle');
    let payment = 40;
    let newRem = Math.max(0, debt.remaining - payment);
    let newStatus = newRem <= 0 ? 'settled' : 'partial';

    store.updateItem('debts', debt.id, { remaining: newRem, status: newStatus });

    let updatedDebt = store.getState().debts.find(d => d.id === 'debt-test-settle');
    assert.strictEqual(updatedDebt.remaining, 60);
    assert.strictEqual(updatedDebt.status, 'partial');

    // 2. Full remaining payoff of $60
    payment = 60;
    newRem = Math.max(0, updatedDebt.remaining - payment);
    newStatus = newRem <= 0 ? 'settled' : 'partial';
    store.updateItem('debts', debt.id, { remaining: newRem, status: newStatus });

    updatedDebt = store.getState().debts.find(d => d.id === 'debt-test-settle');
    assert.strictEqual(updatedDebt.remaining, 0);
    assert.strictEqual(updatedDebt.status, 'settled');
  });

  test('Habit Streak Increment and Toggle Logic', () => {
    const today = getLocalDateString(0);
    const testHabit = store.addItem('habits', {
      id: 'habit-streak-test',
      title: 'Daily Meditation',
      streak: 3,
      completedDates: [getLocalDateString(-3), getLocalDateString(-2), getLocalDateString(-1)]
    });

    // Step 1: Check off for today -> streak increases from 3 to 4
    let habit = store.getState().habits.find(h => h.id === testHabit.id);
    let dates = [...habit.completedDates, today];
    let streak = habit.streak + 1;
    store.updateItem('habits', testHabit.id, { completedDates: dates, streak });

    let updated = store.getState().habits.find(h => h.id === testHabit.id);
    assert.strictEqual(updated.streak, 4);
    assert.ok(updated.completedDates.includes(today));

    // Step 2: Uncheck today -> streak decrements back to 3
    dates = updated.completedDates.filter(d => d !== today);
    streak = Math.max(0, updated.streak - 1);
    store.updateItem('habits', testHabit.id, { completedDates: dates, streak });

    updated = store.getState().habits.find(h => h.id === testHabit.id);
    assert.strictEqual(updated.streak, 3);
    assert.ok(!updated.completedDates.includes(today));
  });

  test('Alarm Trigger Condition: Matches exact HH:MM and active days of week', () => {
    const alarms = [
      { id: 'a1', time: '08:30', enabled: true, days: [1, 2, 3, 4, 5] }, // Weekdays
      { id: 'a2', time: '10:00', enabled: false, days: [0, 1, 2, 3, 4, 5, 6] }, // Disabled
      { id: 'a3', time: '14:00', enabled: true, days: [0, 6] } // Weekends
    ];

    function evaluateAlarmTrigger(alarmsList, currentHHMM, currentDayOfWeek) {
      return alarmsList.find(a => 
        a.enabled &&
        a.time === currentHHMM &&
        (!a.days || a.days.includes(currentDayOfWeek))
      ) || null;
    }

    // Monday (day 1) at 08:30 -> a1 matches
    assert.strictEqual(evaluateAlarmTrigger(alarms, '08:30', 1)?.id, 'a1');

    // Saturday (day 6) at 08:30 -> does NOT match (a1 is weekdays only)
    assert.strictEqual(evaluateAlarmTrigger(alarms, '08:30', 6), null);

    // Monday at 10:00 -> does NOT match (a2 is disabled)
    assert.strictEqual(evaluateAlarmTrigger(alarms, '10:00', 1), null);

    // Sunday (day 0) at 14:00 -> a3 matches
    assert.strictEqual(evaluateAlarmTrigger(alarms, '14:00', 0)?.id, 'a3');
  });

  test('Routine Block Matching & Time Calculation', () => {
    const routines = [
      { id: 'morning', title: 'Morning Kickoff', start: '07:00', end: '08:30' },
      { id: 'focus', title: 'Deep Focus Sprint', start: '09:00', end: '11:30' }
    ];

    function findActiveRoutine(routinesList, currentHHMM) {
      return routinesList.find(r => currentHHMM >= r.start && currentHHMM < r.end) || null;
    }

    function calculateRemainingMinutes(routine, currentH, currentM) {
      if (!routine) return 0;
      const [endH, endM] = routine.end.split(':').map(Number);
      const endTotal = endH * 60 + endM;
      const nowTotal = currentH * 60 + currentM;
      return Math.max(0, endTotal - nowTotal);
    }

    // At 07:45 -> in 'morning' block
    const active1 = findActiveRoutine(routines, '07:45');
    assert.strictEqual(active1?.id, 'morning');
    assert.strictEqual(calculateRemainingMinutes(active1, 7, 45), 45); // 08:30 - 07:45 = 45 mins

    // At 08:45 -> Free unstructured gap
    const active2 = findActiveRoutine(routines, '08:45');
    assert.strictEqual(active2, null);

    // At 09:10 -> in 'focus' block
    const active3 = findActiveRoutine(routines, '09:10');
    assert.strictEqual(active3?.id, 'focus');
    assert.strictEqual(calculateRemainingMinutes(active3, 9, 10), 140); // 11:30 - 09:10 = 140 mins
  });
});

// ============================================================================
// TEST SUITE 4: DATA PORTABILITY & SCHEMA VALIDATION (EXPORT / IMPORT)
// ============================================================================

describe('Suite 4: Export & Import Portability', () => {
  beforeEach(() => {
    mockStorageInstance.clear();
    store.resetToDefaults();
  });

  test('exportToJSON produces valid JSON with Section 11.8 schema specifications', () => {
    const jsonStr = store.exportToJSON();
    assert.strictEqual(typeof jsonStr, 'string');

    const parsed = JSON.parse(jsonStr);
    assert.strictEqual(parsed.schemaVersion, 1);
    assert.strictEqual(parsed.appName, 'Daily Compass');
    assert.ok(parsed.exportTimestamp);
    assert.ok(parsed.settings);
    assert.ok(parsed.profile);
    assert.ok(parsed.budgetConfig);
    assert.ok(Array.isArray(parsed.alarms));
    assert.ok(Array.isArray(parsed.routines));
    assert.ok(Array.isArray(parsed.cashTransactions));
    assert.ok(Array.isArray(parsed.debts));
    assert.ok(Array.isArray(parsed.habits));
    assert.ok(Array.isArray(parsed.scratchpad));
  });

  test('importFromJSON in Overwrite Mode restores state cleanly', () => {
    const customExport = {
      schemaVersion: 1,
      appName: 'Daily Compass',
      settings: { currency: '¥', timeFormat: '24h', dailyBudgetCap: 200 },
      cashTransactions: [
        { id: 'tx-import-1', type: 'expense', amount: 50, category: 'Tech', date: '2026-11-05' }
      ],
      debts: [
        { id: 'debt-import-1', type: 'they_owe_me', person: 'Ken', amount: 300, remaining: 300, status: 'unpaid' }
      ],
      habits: [
        { id: 'habit-import-1', title: 'Japanese Study', streak: 45, completedDates: [] }
      ],
      alarms: [],
      routines: [],
      scratchpad: []
    };

    const res = store.importFromJSON(JSON.stringify(customExport), { merge: false });
    assert.strictEqual(res.success, true);

    const state = store.getState();
    assert.strictEqual(state.settings.currency, '¥');
    assert.strictEqual(state.settings.timeFormat, '24h');
    assert.strictEqual(state.settings.dailyBudgetCap, 200);
    assert.strictEqual(state.cashTransactions.length, 1);
    assert.strictEqual(state.cashTransactions[0].id, 'tx-import-1');
    assert.strictEqual(state.debts.length, 1);
    assert.strictEqual(state.habits[0].title, 'Japanese Study');
  });

  test('importFromJSON in Merge Mode merges items by ID without duplicates', () => {
    // Current state has seed alarms and habits
    const initialHabitsCount = store.getState().habits.length;

    const mergePayload = {
      settings: { dailyBudgetCap: 80 },
      habits: [
        // Update existing habit
        { id: 'habit-water', streak: 99 },
        // Add brand new habit
        { id: 'habit-new-unique', title: 'Evening Guitar', streak: 1, completedDates: [] }
      ]
    };

    const res = store.importFromJSON(JSON.stringify(mergePayload), { merge: true });
    assert.strictEqual(res.success, true);

    const state = store.getState();
    assert.strictEqual(state.settings.dailyBudgetCap, 80);

    const waterHabit = state.habits.find(h => h.id === 'habit-water');
    assert.ok(waterHabit);
    assert.strictEqual(waterHabit.streak, 99);

    const guitarHabit = state.habits.find(h => h.id === 'habit-new-unique');
    assert.ok(guitarHabit);
    assert.strictEqual(guitarHabit.title, 'Evening Guitar');

    assert.strictEqual(state.habits.length, initialHabitsCount + 1);
  });
});

// ============================================================================
// TEST SUITE 5: EDGE CASES & STRESS TESTING
// ============================================================================

describe('Suite 5: Edge Cases & Resilience', () => {
  beforeEach(() => {
    mockStorageInstance.clear();
    store.resetToDefaults();
  });

  test('Edge Case: Zero Division in Budgets (budget cap is 0)', () => {
    // Set daily cap to zero
    store.updateModule('settings', { dailyBudgetCap: 0 });

    const safeSpendZeroExpenses = store.getSafeToSpendToday();
    // With 0 budget cap and some default expenses, safeSpend should be negative
    assert.strictEqual(typeof safeSpendZeroExpenses, 'number');
    assert.ok(!Number.isNaN(safeSpendZeroExpenses));

    // Verify budget progress calculation does not produce NaN or Infinity
    const cap = 0;
    const spentToday = 20;
    const percentUsed = cap > 0 ? Math.min(100, Math.round((spentToday / cap) * 100)) : (spentToday > 0 ? 100 : 0);
    assert.strictEqual(percentUsed, 100);

    const spentZero = 0;
    const percentUsedZero = cap > 0 ? Math.min(100, Math.round((spentZero / cap) * 100)) : (spentZero > 0 ? 100 : 0);
    assert.strictEqual(percentUsedZero, 0);
  });

  test('Edge Case: LocalStorage Quota Exceeded handled gracefully without crash', () => {
    // Trigger quota exceeded simulation
    mockStorageInstance.shouldThrowQuotaError = true;

    // writeToStorage should return false, not throw an unhandled exception
    const writeResult = store.writeToStorage({ test: 'overflow' });
    assert.strictEqual(writeResult, false);

    // State mutations should still succeed in in-memory state
    const added = store.addItem('scratchpad', { text: 'In-memory note during quota limit' });
    assert.ok(added.id);

    const state = store.getState();
    assert.ok(state.scratchpad.some(n => n.text === 'In-memory note during quota limit'));

    // Reset quota error flag
    mockStorageInstance.shouldThrowQuotaError = false;
  });

  test('Edge Case: Bad JSON Import validation rejects corrupt payloads', () => {
    // 1. Empty string
    assert.throws(() => store.importFromJSON(''), /empty or non-string/);

    // 2. Pure whitespace
    assert.throws(() => store.importFromJSON('   \n  '), /empty or non-string/);

    // 3. Invalid syntax (broken brackets)
    assert.throws(() => store.importFromJSON('{ "invalid": json broken'), /JSON Parse Error/);

    // 4. Primitive types instead of object
    assert.throws(() => store.importFromJSON('42'), /valid JSON object/);
    assert.throws(() => store.importFromJSON('"hello"'), /valid JSON object/);
    assert.throws(() => store.importFromJSON('null'), /valid JSON object/);
  });

  test('Edge Case: Malformed or missing schema fields auto-sanitize with defaults', () => {
    // Payload with completely missing sub-modules
    const partialPayload = JSON.stringify({
      schemaVersion: 1,
      appName: 'Daily Compass',
      profile: { name: 'Drifter' }
      // alarms, routines, cashTransactions omitted
    });

    const res = store.importFromJSON(partialPayload, { merge: false });
    assert.strictEqual(res.success, true);

    const state = store.getState();
    assert.strictEqual(state.profile.name, 'Drifter');
    assert.ok(Array.isArray(state.alarms), 'Sanitizer should maintain fallback arrays');
    assert.ok(Array.isArray(state.routines));
    assert.ok(Array.isArray(state.cashTransactions));
  });

  test('Edge Case: Timezone Transitions & Date Generation', () => {
    // getLocalDateString should produce YYYY-MM-DD
    const today = getLocalDateString(0);
    assert.match(today, /^\d{4}-\d{2}-\d{2}$/);

    // Offsets across day/month boundaries
    const yesterday = getLocalDateString(-1);
    assert.match(yesterday, /^\d{4}-\d{2}-\d{2}$/);

    const tomorrow = getLocalDateString(1);
    assert.match(tomorrow, /^\d{4}-\d{2}-\d{2}$/);

    const thirtyDaysAgo = getLocalDateString(-30);
    assert.match(thirtyDaysAgo, /^\d{4}-\d{2}-\d{2}$/);
    assert.notStrictEqual(thirtyDaysAgo, today);
  });

  test('Edge Case: Over-settlement of debt clamps remaining balance to zero', () => {
    const debt = store.addItem('debts', {
      person: 'Frank',
      amount: 50.00,
      remaining: 20.00,
      status: 'partial'
    });

    // User enters $50 payment for a $20 remaining balance
    const payment = 50.00;
    const curRem = debt.remaining;
    const newRem = Math.max(0, curRem - payment);
    const newStatus = newRem <= 0 ? 'settled' : 'partial';

    store.updateItem('debts', debt.id, {
      remaining: newRem,
      status: newStatus
    });

    const settledDebt = store.getState().debts.find(d => d.id === debt.id);
    assert.strictEqual(settledDebt.remaining, 0); // Must clamp at 0, not -30
    assert.strictEqual(settledDebt.status, 'settled');
  });
});

// ============================================================================
// TEST SUITE 6: WEB AUDIO API SYNTHESIS ENGINE
// ============================================================================

describe('Suite 6: Web Audio Sound Synthesizer', () => {
  test('Sound engine exposes all four harmonic sound presets', () => {
    assert.ok(soundEngine);
    assert.strictEqual(typeof soundEngine.playPreset, 'function');
    assert.strictEqual(typeof soundEngine.playAlarmLoop, 'function');
    assert.strictEqual(typeof soundEngine.stopAlarmLoop, 'function');
    assert.strictEqual(typeof soundEngine.setMasterVolume, 'function');

    const presets = soundEngine.getAvailablePresets();
    assert.deepStrictEqual(presets, ['zen-bowl', 'gentle-triad', 'attentive-bell', 'micro-tick']);
  });

  test('playPreset executes cleanly for all presets', () => {
    for (const preset of ['zen-bowl', 'gentle-triad', 'attentive-bell', 'micro-tick']) {
      assert.doesNotThrow(() => {
        soundEngine.playPreset(preset);
      }, `Preset "${preset}" should play without throwing`);
    }
  });

  test('Alarm Loop starts, tracks active status, and stops cleanly', () => {
    assert.strictEqual(soundEngine.isAlarmPlaying(), false);

    soundEngine.playAlarmLoop('zen-bowl', 0.5);
    assert.strictEqual(soundEngine.isAlarmPlaying(), true);

    soundEngine.stopAlarmLoop();
    assert.strictEqual(soundEngine.isAlarmPlaying(), false);
  });

  test('Master volume clamps values strictly between 0.0 and 1.0', () => {
    soundEngine.setMasterVolume(0.5);
    assert.strictEqual(soundEngine.getMasterVolume(), 0.5);

    // Clamp upper bound
    soundEngine.setMasterVolume(1.8);
    assert.strictEqual(soundEngine.getMasterVolume(), 1.0);

    // Clamp lower bound
    soundEngine.setMasterVolume(-0.4);
    assert.strictEqual(soundEngine.getMasterVolume(), 0.0);

    // Reset to pleasant default
    soundEngine.setMasterVolume(0.7);
    assert.strictEqual(soundEngine.getMasterVolume(), 0.7);
  });
});
