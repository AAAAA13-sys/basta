/**
 * Automated Test Suite for Daily Compass Store & Audio Subsystems
 */

import { test, describe, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Mock Browser Environment for Node.js
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
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

// Setup Global Environment before importing subsystems
global.window = {
  localStorage: new MockLocalStorage(),
  addEventListener: () => {},
  removeEventListener: () => {}
};
global.AudioContext = MockAudioContext;

// Dynamically import subsystems after setting up global mocks
const { store, STORAGE_KEY, DEFAULT_STATE } = await import('../js/store.js');
const { audio } = await import('../js/audio.js');

describe('Daily Compass: Store Subsystem Tests', () => {
  beforeEach(() => {
    global.window.localStorage.clear();
    store.resetToDefaults();
  });

  test('Store initializes with valid schemas and complete seed data', () => {
    const state = store.getState();

    // 1. Settings & Profile
    assert.ok(state.settings, 'state.settings must exist');
    assert.strictEqual(state.settings.currency, '$');
    assert.strictEqual(state.settings.timeFormat, '12h');
    assert.strictEqual(state.settings.focusMode, false);
    assert.strictEqual(state.settings.dailyBudgetCap, 50);
    assert.strictEqual(state.settings.soundPreset, 'zen-bowl');
    assert.strictEqual(state.settings.streakShields, 2);

    // Profile parity
    assert.ok(state.profile, 'state.profile must exist');
    assert.strictEqual(state.profile.currency, '$');
    assert.strictEqual(state.profile.timeFormat, '12h');
    assert.strictEqual(state.profile.dailyBudgetCap, 50);

    // 2. Anchor
    assert.ok(state.anchor, 'state.anchor must exist');
    assert.strictEqual(state.anchor.activeTaskId, null);
    assert.ok('currentRoutineId' in state.anchor);
    assert.ok(state.anchor.groundingState, 'groundingState must exist');
    assert.strictEqual(typeof state.anchor.groundingState.isInGroundingMode, 'boolean');

    // 3. Alarms
    assert.ok(Array.isArray(state.alarms), 'alarms must be an array');
    assert.ok(state.alarms.length >= 1, 'must contain at least 1 seed alarm');
    const alarm = state.alarms[0];
    assert.ok(alarm.id);
    assert.ok(alarm.time);
    assert.ok(alarm.label);
    assert.strictEqual(typeof alarm.enabled, 'boolean');
    assert.ok(alarm.sound || alarm.soundPreset);
    assert.ok(Array.isArray(alarm.days || alarm.daysOfWeek));
    assert.ok('preChime' in alarm || 'preAlarmWarningMinutes' in alarm);

    // 4. Routines
    assert.ok(Array.isArray(state.routines), 'routines must be an array');
    assert.ok(state.routines.length >= 1);
    const routine = state.routines[0];
    assert.ok(routine.id);
    assert.ok(routine.title || routine.name);
    assert.ok(routine.start || routine.startTime);
    assert.ok(routine.end || routine.endTime);
    assert.ok(routine.category);
    assert.ok(routine.icon);
    assert.ok(Array.isArray(routine.steps));

    // 5. Cash Transactions
    assert.ok(Array.isArray(state.cashTransactions), 'cashTransactions must be an array');
    assert.ok(state.cashTransactions.length >= 1);
    const tx = state.cashTransactions[0];
    assert.ok(tx.id);
    assert.ok(tx.date);
    assert.ok(tx.time);
    assert.ok(['expense', 'income'].includes(tx.type));
    assert.strictEqual(typeof tx.amount, 'number');
    assert.ok(tx.category);

    // 6. Debts
    assert.ok(Array.isArray(state.debts), 'debts must be an array');
    assert.ok(state.debts.length >= 1);
    const debt = state.debts[0];
    assert.ok(debt.id);
    assert.ok(['they_owe_me', 'i_owe_them'].includes(debt.type));
    assert.ok(debt.person || debt.counterpartyName);
    assert.strictEqual(typeof debt.amount, 'number');
    assert.strictEqual(typeof debt.remaining, 'number');
    assert.ok(debt.dueDate);
    assert.ok(['unpaid', 'partial', 'settled'].includes(debt.status));
    assert.ok(Array.isArray(debt.history || debt.settlements));

    // 7. Habits
    assert.ok(Array.isArray(state.habits), 'habits must be an array');
    assert.ok(state.habits.length >= 1);
    const habit = state.habits[0];
    assert.ok(habit.id);
    assert.ok(habit.title);
    assert.ok(habit.category);
    assert.ok(habit.frequency);
    assert.ok(habit.timeOfDay);
    assert.strictEqual(typeof habit.streak, 'number');
    assert.ok(Array.isArray(habit.completedDates));
    assert.strictEqual(typeof habit.streakShieldUsed, 'boolean');

    // 8. Scratchpad
    assert.ok(Array.isArray(state.scratchpad), 'scratchpad must be an array');
    assert.ok(state.scratchpad.length >= 1);
    const note = state.scratchpad[0];
    assert.ok(note.id);
    assert.ok(note.text || note.content);
    assert.ok(note.tag || note.category);
    assert.ok(note.createdAt);
    assert.strictEqual(note.convertedTo, null);
  });

  test('Subscribing and state reactivity', () => {
    let callCount = 0;
    let latestState = null;

    const unsubscribe = store.subscribe((newState) => {
      callCount++;
      latestState = newState;
    });

    store.updateModule('settings', { focusMode: true });
    assert.strictEqual(callCount, 1);
    assert.strictEqual(latestState.settings.focusMode, true);

    // Test unsubscribe
    unsubscribe();
    store.updateModule('settings', { focusMode: false });
    assert.strictEqual(callCount, 1, 'Should not fire callback after unsubscribe');
  });

  test('updateModule for both object and array updates', () => {
    // Object update
    store.updateModule('settings', { dailyBudgetCap: 75 });
    assert.strictEqual(store.getState().settings.dailyBudgetCap, 75);
    assert.strictEqual(store.getState().profile.dailyBudgetCap, 75);

    // Array update with updater function
    const originalAlarmsCount = store.getState().alarms.length;
    store.updateModule('alarms', (list) => [
      ...list,
      {
        id: 'new-alarm',
        time: '18:00',
        label: 'Evening Stretch',
        enabled: true,
        sound: 'zen-bowl',
        days: [1, 2, 3, 4, 5],
        preChime: true
      }
    ]);
    assert.strictEqual(store.getState().alarms.length, originalAlarmsCount + 1);
  });

  test('addItem, updateItem, deleteItem convenience helpers', () => {
    const newItem = store.addItem('scratchpad', {
      text: 'Buy organic almond milk',
      tag: 'To-Buy'
    });
    assert.ok(newItem.id, 'New item must have an auto-assigned ID');
    assert.strictEqual(newItem.text, 'Buy organic almond milk');

    // Update item
    const updated = store.updateItem('scratchpad', newItem.id, {
      text: 'Buy organic oat milk'
    });
    assert.strictEqual(updated, true);
    const fetched = store.getState().scratchpad.find((n) => n.id === newItem.id);
    assert.strictEqual(fetched.text, 'Buy organic oat milk');

    // Delete item
    store.deleteItem('scratchpad', newItem.id);
    const afterDelete = store.getState().scratchpad.find((n) => n.id === newItem.id);
    assert.strictEqual(afterDelete, undefined);
  });

  test('exportToJSON and importFromJSON (Overwrite Mode)', () => {
    store.updateModule('settings', { currency: '€', dailyBudgetCap: 80 });
    const exportedJSON = store.exportToJSON();
    assert.strictEqual(typeof exportedJSON, 'string');

    const parsed = JSON.parse(exportedJSON);
    assert.strictEqual(parsed.schemaVersion, 1);
    assert.strictEqual(parsed.settings.currency, '€');
    assert.strictEqual(parsed.settings.dailyBudgetCap, 80);

    // Mutate state
    store.updateModule('settings', { currency: '¥', dailyBudgetCap: 200 });
    assert.strictEqual(store.getState().settings.currency, '¥');

    // Restore from exported JSON
    const result = store.importFromJSON(exportedJSON, { merge: false });
    assert.strictEqual(result.success, true);
    assert.strictEqual(store.getState().settings.currency, '€');
    assert.strictEqual(store.getState().settings.dailyBudgetCap, 80);
  });

  test('importFromJSON (Merge Mode)', () => {
    const customJSON = JSON.stringify({
      scratchpad: [
        {
          id: 'imported-note-1',
          text: 'External brain dump synced from phone',
          tag: 'Idea',
          createdAt: new Date().toISOString(),
          status: 'active',
          convertedTo: null
        }
      ]
    });

    const preCount = store.getState().scratchpad.length;
    store.importFromJSON(customJSON, { merge: true });
    const postCount = store.getState().scratchpad.length;

    assert.strictEqual(postCount, preCount + 1);
    const found = store.getState().scratchpad.find((n) => n.id === 'imported-note-1');
    assert.ok(found);
    assert.strictEqual(found.text, 'External brain dump synced from phone');
  });

  test('Budget and Debt financial calculations', () => {
    const safeSpend = store.getSafeToSpendToday();
    assert.strictEqual(typeof safeSpend, 'number');

    const debtSummary = store.getDebtSummary();
    assert.strictEqual(typeof debtSummary.theyOweMe, 'number');
    assert.strictEqual(typeof debtSummary.iOweThem, 'number');
    assert.strictEqual(typeof debtSummary.netReceivable, 'number');
  });
});

describe('Daily Compass: Audio Subsystem Tests', () => {
  beforeEach(() => {
    audio.stopAlarmLoop();
  });

  test('Audio synthesizer exposes required methods and presets', () => {
    assert.strictEqual(typeof audio.playPreset, 'function');
    assert.strictEqual(typeof audio.playAlarmLoop, 'function');
    assert.strictEqual(typeof audio.stopAlarmLoop, 'function');
    assert.strictEqual(typeof audio.isAlarmPlaying, 'function');

    const presets = audio.getAvailablePresets();
    assert.ok(presets.includes('zen-bowl'));
    assert.ok(presets.includes('gentle-triad'));
    assert.ok(presets.includes('attentive-bell'));
    assert.ok(presets.includes('micro-tick'));
  });

  test('playPreset executes without error for all 4 sound presets', async () => {
    await audio.playPreset('zen-bowl');
    await audio.playPreset('gentle-triad');
    await audio.playPreset('attentive-bell');
    await audio.playPreset('micro-tick');
    // Also test alias
    await audio.playPreset('attentive-wakeup');

    const ctx = audio.getContext();
    assert.ok(ctx.createdNodes.length > 0, 'Nodes must be generated in AudioContext');
  });

  test('playAlarmLoop and stopAlarmLoop manage active state', () => {
    assert.strictEqual(audio.isAlarmPlaying(), false);

    audio.playAlarmLoop('zen-bowl', 2);
    assert.strictEqual(audio.isAlarmPlaying(), true);

    audio.stopAlarmLoop();
    assert.strictEqual(audio.isAlarmPlaying(), false);
  });

  test('Master volume get and set', () => {
    audio.setMasterVolume(0.5);
    assert.strictEqual(audio.getMasterVolume(), 0.5);

    audio.setMasterVolume(1.5); // Should clamp to 1
    assert.strictEqual(audio.getMasterVolume(), 1);

    audio.setMasterVolume(-0.2); // Should clamp to 0
    assert.strictEqual(audio.getMasterVolume(), 0);

    audio.setMasterVolume(0.7); // Restore default
  });
});
