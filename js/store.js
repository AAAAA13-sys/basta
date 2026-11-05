/**
 * Daily Compass — Foundational State Store
 * Manages local persistence, schema validation, event subscriptions, and data portability.
 * Storage Key: 'daily_compass_state_v1'
 * Zero external dependencies. 100% offline-first.
 */

export const STORAGE_KEY = 'daily_compass_state_v1';

/**
 * Returns today's ISO date string 'YYYY-MM-DD' in local time
 */
export function getLocalDateString(offsetDays = 0) {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns a robust unique ID string
 */
export function generateId(prefix = 'id') {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Deep clone helper
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Initial Seed Data for immediate, rich first-time user experience
 */
export const DEFAULT_STATE = {
  // Settings & Profile
  settings: {
    currency: '$',
    currencySymbol: '$',
    timeFormat: '12h',
    focusMode: false,
    dailyBudgetCap: 50,
    soundPreset: 'zen-bowl',
    streakShields: 2,
    chimeVolume: 0.7,
    audioEnabled: true,
    theme: 'calm-dark'
  },
  profile: {
    name: 'Navigator',
    currency: '$',
    timeFormat: '12h',
    focusMode: false,
    dailyBudgetCap: 50,
    soundPreset: 'zen-bowl',
    streakShields: 2
  },

  // Focus & Grounding Anchor
  anchor: {
    activeTaskId: null,
    currentRoutineId: 'routine-morning',
    activeRoutineId: 'routine-morning',
    activeStepId: 'step-m1',
    activeView: 'anchor',
    groundingState: {
      isInGroundingMode: false,
      lastGroundingTimestamp: null,
      extendedMinutes: 0
    }
  },

  // Alarms & Chimes
  alarms: [
    {
      id: 'alarm-morning',
      time: '07:00',
      label: 'Morning Wakeup',
      enabled: true,
      sound: 'zen-bowl',
      soundPreset: 'zen-bowl',
      days: [0, 1, 2, 3, 4, 5, 6],
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      preChime: true,
      preAlarmWarningMinutes: 5,
      snoozeMinutes: 10,
      lastTriggeredDate: null
    },
    {
      id: 'alarm-lunch',
      time: '12:30',
      label: 'Mid-Day Reset & Screen Break',
      enabled: true,
      sound: 'gentle-triad',
      soundPreset: 'gentle-triad',
      days: [1, 2, 3, 4, 5],
      daysOfWeek: [1, 2, 3, 4, 5],
      preChime: true,
      preAlarmWarningMinutes: 5,
      snoozeMinutes: 10,
      lastTriggeredDate: null
    },
    {
      id: 'alarm-evening',
      time: '21:30',
      label: 'Evening Wind-Down & Reflection',
      enabled: true,
      sound: 'zen-bowl',
      soundPreset: 'zen-bowl',
      days: [0, 1, 2, 3, 4, 5, 6],
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      preChime: false,
      preAlarmWarningMinutes: 0,
      snoozeMinutes: 15,
      lastTriggeredDate: null
    }
  ],

  // Daily Routines & Schedule Blocks
  routines: [
    {
      id: 'routine-morning',
      title: 'Morning Anchor',
      name: 'Morning Anchor',
      start: '07:00',
      startTime: '07:00',
      end: '08:30',
      endTime: '08:30',
      category: 'wellness',
      icon: '🌅',
      color: '#58a6ff',
      steps: [
        {
          id: 'step-m1',
          order: 1,
          title: 'Drink 500ml water & take morning meds',
          durationMinutes: 10,
          isCompleted: true,
          completedAt: '2026-11-05T07:15:00.000Z'
        },
        {
          id: 'step-m2',
          order: 2,
          title: 'Gentle somatic stretch & daylight exposure',
          durationMinutes: 15,
          isCompleted: false,
          completedAt: null
        },
        {
          id: 'step-m3',
          order: 3,
          title: 'Mindful breakfast & warm tea',
          durationMinutes: 30,
          isCompleted: false,
          completedAt: null
        },
        {
          id: 'step-m4',
          order: 4,
          title: 'Review today’s Focus Anchor',
          durationMinutes: 15,
          isCompleted: false,
          completedAt: null
        }
      ]
    },
    {
      id: 'routine-focus-1',
      title: 'Deep Focus Block 1',
      name: 'Deep Focus Block 1',
      start: '09:00',
      startTime: '09:00',
      end: '11:30',
      endTime: '11:30',
      category: 'work',
      icon: '🎯',
      color: '#bc8cff',
      steps: [
        {
          id: 'step-f1',
          order: 1,
          title: 'Silence tabs & open primary project doc',
          durationMinutes: 5,
          isCompleted: false,
          completedAt: null
        },
        {
          id: 'step-f2',
          order: 2,
          title: 'High-value creative implementation',
          durationMinutes: 100,
          isCompleted: false,
          completedAt: null
        },
        {
          id: 'step-f3',
          order: 3,
          title: 'Capture stray ideas to Scratchpad',
          durationMinutes: 15,
          isCompleted: false,
          completedAt: null
        }
      ]
    },
    {
      id: 'routine-lunch',
      title: 'Mid-Day Reset & Lunch',
      name: 'Mid-Day Reset & Lunch',
      start: '12:00',
      startTime: '12:00',
      end: '13:00',
      endTime: '13:00',
      category: 'wellness',
      icon: '🥗',
      color: '#3fb950',
      steps: [
        {
          id: 'step-l1',
          order: 1,
          title: 'Screen-free nourishing lunch',
          durationMinutes: 35,
          isCompleted: false,
          completedAt: null
        },
        {
          id: 'step-l2',
          order: 2,
          title: '15-minute sunshine decompression walk',
          durationMinutes: 15,
          isCompleted: false,
          completedAt: null
        }
      ]
    },
    {
      id: 'routine-focus-2',
      title: 'Execution Block 2',
      name: 'Execution Block 2',
      start: '14:00',
      startTime: '14:00',
      end: '16:30',
      endTime: '16:30',
      category: 'work',
      icon: '⚡',
      color: '#bc8cff',
      steps: [
        {
          id: 'step-e1',
          order: 1,
          title: 'Process quick reviews and incoming notes',
          durationMinutes: 30,
          isCompleted: false,
          completedAt: null
        },
        {
          id: 'step-e2',
          order: 2,
          title: 'Wrap core project milestones',
          durationMinutes: 90,
          isCompleted: false,
          completedAt: null
        }
      ]
    },
    {
      id: 'routine-evening',
      title: 'Evening Wind-Down',
      name: 'Evening Wind-Down',
      start: '21:00',
      startTime: '21:00',
      end: '22:30',
      endTime: '22:30',
      category: 'rest',
      icon: '🌙',
      color: '#f0883e',
      steps: [
        {
          id: 'step-w1',
          order: 1,
          title: '1-tap daily cash & habit check-in',
          durationMinutes: 10,
          isCompleted: false,
          completedAt: null
        },
        {
          id: 'step-w2',
          order: 2,
          title: 'Dim lighting & prep sleeping zone',
          durationMinutes: 15,
          isCompleted: false,
          completedAt: null
        },
        {
          id: 'step-w3',
          order: 3,
          title: 'Calm reading / audio meditation',
          durationMinutes: 35,
          isCompleted: false,
          completedAt: null
        }
      ]
    }
  ],

  // Cash Transactions & Daily Budget Ledger
  cashTransactions: [
    {
      id: 'tx-seed-1',
      date: getLocalDateString(0),
      time: '08:45',
      timestamp: new Date().toISOString(),
      type: 'expense',
      amount: 4.50,
      category: 'Coffee',
      note: 'Morning oat latte'
    },
    {
      id: 'tx-seed-2',
      date: getLocalDateString(0),
      time: '12:40',
      timestamp: new Date().toISOString(),
      type: 'expense',
      amount: 15.50,
      category: 'Food',
      note: 'Lunch grain bowl'
    },
    {
      id: 'tx-seed-3',
      date: getLocalDateString(-1),
      time: '17:30',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      type: 'expense',
      amount: 22.00,
      category: 'Groceries',
      note: 'Fresh greens and fruits'
    },
    {
      id: 'tx-seed-4',
      date: getLocalDateString(-2),
      time: '09:00',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      type: 'income',
      amount: 120.00,
      category: 'Freelance',
      note: 'UI design consulting milestone'
    }
  ],

  // Debts & Credits ("Who Owes Who?")
  debts: [
    {
      id: 'debt-seed-1',
      type: 'they_owe_me',
      direction: 'lent',
      person: 'Sarah',
      counterpartyName: 'Sarah',
      amount: 45.00,
      initialAmount: 45.00,
      remaining: 45.00,
      remainingAmount: 45.00,
      currencySymbol: '$',
      dateIncurred: getLocalDateString(-4),
      dueDate: getLocalDateString(10),
      note: 'Dinner split at Mario’s',
      notes: 'Dinner split at Mario’s',
      status: 'unpaid',
      history: [],
      settlements: []
    },
    {
      id: 'debt-seed-2',
      type: 'they_owe_me',
      direction: 'lent',
      person: 'David',
      counterpartyName: 'David',
      amount: 25.00,
      initialAmount: 25.00,
      remaining: 10.00,
      remainingAmount: 10.00,
      currencySymbol: '$',
      dateIncurred: getLocalDateString(-7),
      dueDate: getLocalDateString(5),
      note: 'Concert ticket advance',
      notes: 'Concert ticket advance',
      status: 'partial',
      history: [
        {
          id: 'settle-seed-1',
          settlementId: 'settle-seed-1',
          amountPaid: 15.00,
          paidAt: new Date(Date.now() - 259200000).toISOString(),
          note: 'Partial payback via bank transfer',
          receiptNote: 'Partial payback via bank transfer'
        }
      ],
      settlements: [
        {
          settlementId: 'settle-seed-1',
          amountPaid: 15.00,
          paidAt: new Date(Date.now() - 259200000).toISOString(),
          receiptNote: 'Partial payback via bank transfer'
        }
      ]
    },
    {
      id: 'debt-seed-3',
      type: 'i_owe_them',
      direction: 'borrowed',
      person: 'Alex',
      counterpartyName: 'Alex',
      amount: 30.00,
      initialAmount: 30.00,
      remaining: 30.00,
      remainingAmount: 30.00,
      currencySymbol: '$',
      dateIncurred: getLocalDateString(-2),
      dueDate: getLocalDateString(7),
      note: 'Hardware store supplies for home repair',
      notes: 'Hardware store supplies for home repair',
      status: 'unpaid',
      history: [],
      settlements: []
    }
  ],

  // Habits & Daily Activities
  habits: [
    {
      id: 'habit-water',
      title: 'Morning Hydration (500ml)',
      icon: '💧',
      category: 'health',
      frequency: 'daily',
      timeOfDay: 'morning',
      streak: 5,
      completedDates: [
        getLocalDateString(-4),
        getLocalDateString(-3),
        getLocalDateString(-2),
        getLocalDateString(-1),
        getLocalDateString(0)
      ],
      streakShieldUsed: false,
      shieldActive: true,
      history: {
        [getLocalDateString(-1)]: 'completed',
        [getLocalDateString(0)]: 'completed'
      }
    },
    {
      id: 'habit-meds',
      title: 'Take daily vitamins & meds',
      icon: '💊',
      category: 'health',
      frequency: 'daily',
      timeOfDay: 'morning',
      streak: 12,
      completedDates: [
        getLocalDateString(-2),
        getLocalDateString(-1),
        getLocalDateString(0)
      ],
      streakShieldUsed: false,
      shieldActive: true,
      history: {
        [getLocalDateString(-1)]: 'completed',
        [getLocalDateString(0)]: 'completed'
      }
    },
    {
      id: 'habit-walk',
      title: '15-min Screen-Free Walk',
      icon: '🌿',
      category: 'wellness',
      frequency: 'daily',
      timeOfDay: 'afternoon',
      streak: 3,
      completedDates: [
        getLocalDateString(-3),
        getLocalDateString(-2),
        getLocalDateString(-1)
      ],
      streakShieldUsed: false,
      shieldActive: true,
      history: {
        [getLocalDateString(-1)]: 'completed'
      }
    },
    {
      id: 'habit-review',
      title: 'Evening Cash & Habit Log',
      icon: '💳',
      category: 'finance',
      frequency: 'daily',
      timeOfDay: 'evening',
      streak: 8,
      completedDates: [
        getLocalDateString(-3),
        getLocalDateString(-2),
        getLocalDateString(-1)
      ],
      streakShieldUsed: false,
      shieldActive: true,
      history: {
        [getLocalDateString(-1)]: 'completed'
      }
    }
  ],

  // Scratchpad / Brain Dump Wall
  scratchpad: [
    {
      id: 'note-seed-1',
      text: 'Remember to pick up laundry',
      content: 'Remember to pick up laundry',
      tag: 'To-Do',
      category: 'to-do',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'active',
      convertedTo: null
    },
    {
      id: 'note-seed-2',
      text: 'Order replacement water filter cartridge',
      content: 'Order replacement water filter cartridge',
      tag: 'To-Buy',
      category: 'to-buy',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      status: 'active',
      convertedTo: null
    },
    {
      id: 'note-seed-3',
      text: 'Try 4-7-8 breathing pacer when afternoon focus slips',
      content: 'Try 4-7-8 breathing pacer when afternoon focus slips',
      tag: 'Idea',
      category: 'idea',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'active',
      convertedTo: null
    }
  ]
};

/**
 * Storage Layer with LocalStorage fallback to in-memory store
 */
class StateStore {
  constructor(storageKey = STORAGE_KEY, defaultState = DEFAULT_STATE) {
    this.storageKey = storageKey;
    this.defaultState = defaultState;
    this.listeners = new Set();
    this.state = null;
    this.isStorageAvailable = this.checkStorageAvailability();
    this.init();
  }

  checkStorageAvailability() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__dc_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  readFromStorage() {
    if (!this.isStorageAvailable) return null;
    try {
      const serialized = window.localStorage.getItem(this.storageKey);
      if (!serialized) return null;
      return JSON.parse(serialized);
    } catch (err) {
      console.warn('[DailyCompass:Store] Failed to read from LocalStorage:', err);
      return null;
    }
  }

  writeToStorage(data) {
    if (!this.isStorageAvailable) return false;
    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (err) {
      console.error('[DailyCompass:Store] Failed to write to LocalStorage:', err);
      return false;
    }
  }

  init() {
    const persisted = this.readFromStorage();
    if (persisted && typeof persisted === 'object') {
      this.state = this.sanitizeAndMigrate(persisted);
    } else {
      this.state = deepClone(this.defaultState);
      this.writeToStorage(this.state);
    }
  }

  /**
   * Ensures all required keys exist and formats match specifications
   */
  sanitizeAndMigrate(loadedState) {
    const base = deepClone(this.defaultState);

    // Merge settings
    if (loadedState.settings || loadedState.profile) {
      base.settings = {
        ...base.settings,
        ...(loadedState.settings || {}),
        ...(loadedState.profile || {})
      };
      base.profile = {
        ...base.profile,
        ...base.settings
      };
    }

    // Merge anchor
    if (loadedState.anchor) {
      base.anchor = {
        ...base.anchor,
        ...loadedState.anchor,
        groundingState: {
          ...base.anchor.groundingState,
          ...(loadedState.anchor.groundingState || {})
        }
      };
    }

    // Arrays: use loaded if valid array, otherwise base
    const arrayKeys = ['alarms', 'routines', 'cashTransactions', 'debts', 'habits', 'scratchpad'];
    for (const key of arrayKeys) {
      if (Array.isArray(loadedState[key])) {
        base[key] = loadedState[key];
      } else if (key === 'debts' && Array.isArray(loadedState.debtRecords)) {
        base.debts = loadedState.debtRecords;
      } else if (key === 'scratchpad' && Array.isArray(loadedState.scratchpadItems)) {
        base.scratchpad = loadedState.scratchpadItems;
      }
    }

    return base;
  }

  /**
   * Notifies all registered subscribers with fresh state snapshot
   */
  notify() {
    const snapshot = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (err) {
        console.error('[DailyCompass:Store] Listener callback threw an error:', err);
      }
    });
  }

  /**
   * Subscribes a listener to state changes.
   * Returns an unsubscribe function.
   */
  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('[DailyCompass:Store] Subscribe listener must be a function.');
    }
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Returns a deep clone of the current state.
   */
  getState() {
    return deepClone(this.state);
  }

  /**
   * Replaces or updates the entire state.
   * Supports both an object or an updater function: (prevState) => nextState.
   */
  setState(updaterOrNewState) {
    let nextState;
    if (typeof updaterOrNewState === 'function') {
      nextState = updaterOrNewState(deepClone(this.state));
    } else {
      nextState = deepClone(updaterOrNewState);
    }

    if (!nextState || typeof nextState !== 'object') {
      throw new TypeError('[DailyCompass:Store] setState argument must be an object or updater function.');
    }

    this.state = this.sanitizeAndMigrate(nextState);
    this.writeToStorage(this.state);
    this.notify();
    return this.getState();
  }

  /**
   * Selectively updates a specific module (e.g. 'settings', 'anchor', 'alarms', 'cashTransactions').
   * Supports values or updater functions: (prevModuleData) => nextModuleData.
   */
  updateModule(moduleKey, updaterOrNewData) {
    if (!(moduleKey in this.state)) {
      throw new Error(`[DailyCompass:Store] Unknown module key: "${moduleKey}"`);
    }

    const currentModuleData = deepClone(this.state[moduleKey]);
    let nextModuleData;

    if (typeof updaterOrNewData === 'function') {
      nextModuleData = updaterOrNewData(currentModuleData);
    } else if (
      currentModuleData &&
      typeof currentModuleData === 'object' &&
      !Array.isArray(currentModuleData) &&
      typeof updaterOrNewData === 'object' &&
      !Array.isArray(updaterOrNewData)
    ) {
      // Shallow merge for plain object modules like settings or anchor
      nextModuleData = { ...currentModuleData, ...updaterOrNewData };
    } else {
      nextModuleData = deepClone(updaterOrNewData);
    }

    this.state[moduleKey] = nextModuleData;

    // Keep settings and profile synchronized
    if (moduleKey === 'settings') {
      this.state.profile = { ...this.state.profile, ...this.state.settings };
    } else if (moduleKey === 'profile') {
      this.state.settings = { ...this.state.settings, ...this.state.profile };
    }

    this.writeToStorage(this.state);
    this.notify();
    return deepClone(this.state[moduleKey]);
  }

  /**
   * Resets entire application state to default seed data
   */
  resetToDefaults() {
    this.state = deepClone(this.defaultState);
    this.writeToStorage(this.state);
    this.notify();
    return this.getState();
  }

  /**
   * Exports the entire application state as a structured, formatted JSON string.
   * Conforms to Section 11.8 Full Backup Schema.
   */
  exportToJSON() {
    const snapshot = this.getState();
    const payload = {
      schemaVersion: 1,
      exportTimestamp: new Date().toISOString(),
      appName: 'Daily Compass',
      appSettings: {
        timeFormat: snapshot.settings.timeFormat || '12h',
        chimeVolume: snapshot.settings.chimeVolume ?? 0.7,
        audioEnabled: snapshot.settings.audioEnabled ?? true,
        theme: snapshot.settings.theme || 'calm-dark'
      },
      profile: snapshot.profile,
      settings: snapshot.settings,
      anchor: snapshot.anchor,
      alarms: snapshot.alarms,
      routines: snapshot.routines,
      budgetConfig: {
        dailySpendingCap: snapshot.settings.dailyBudgetCap ?? 50,
        currencySymbol: snapshot.settings.currency || '$',
        warningThresholdPercent: 80
      },
      cashTransactions: snapshot.cashTransactions,
      debts: snapshot.debts,
      debtRecords: snapshot.debts, // spec alias
      habits: snapshot.habits,
      scratchpad: snapshot.scratchpad,
      scratchpadItems: snapshot.scratchpad // spec alias
    };

    return JSON.stringify(payload, null, 2);
  }

  /**
   * Imports application state from a JSON string.
   * Validates structure and supports both clean overwrite and merge modes.
   */
  importFromJSON(jsonString, options = { merge: false }) {
    if (typeof jsonString !== 'string' || !jsonString.trim()) {
      throw new Error('[DailyCompass:Store] Invalid import payload: empty or non-string input.');
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (parseErr) {
      throw new Error(`[DailyCompass:Store] JSON Parse Error: ${parseErr.message}`);
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('[DailyCompass:Store] Imported payload must be a valid JSON object.');
    }

    const { merge = false } = options;

    if (!merge) {
      // Overwrite / Restore Clean
      this.state = this.sanitizeAndMigrate(parsed);
    } else {
      // Merge mode: combine arrays uniquely by ID, merge settings objects
      const current = this.getState();

      if (parsed.settings || parsed.profile || parsed.appSettings) {
        current.settings = {
          ...current.settings,
          ...(parsed.settings || {}),
          ...(parsed.profile || {}),
          ...(parsed.appSettings || {})
        };
        current.profile = { ...current.profile, ...current.settings };
      }

      if (parsed.anchor) {
        current.anchor = {
          ...current.anchor,
          ...parsed.anchor,
          groundingState: {
            ...current.anchor.groundingState,
            ...(parsed.anchor.groundingState || {})
          }
        };
      }

      const mergeArray = (key, altKey = null) => {
        const sourceArray = Array.isArray(parsed[key])
          ? parsed[key]
          : altKey && Array.isArray(parsed[altKey])
          ? parsed[altKey]
          : [];

        if (sourceArray.length === 0) return;

        const existingMap = new Map((current[key] || []).map((item) => [item.id, item]));
        for (const item of sourceArray) {
          if (item && item.id) {
            existingMap.set(item.id, { ...(existingMap.get(item.id) || {}), ...item });
          } else if (item) {
            const newId = generateId(key.slice(0, 3));
            existingMap.set(newId, { ...item, id: newId });
          }
        }
        current[key] = Array.from(existingMap.values());
      };

      mergeArray('alarms');
      mergeArray('routines');
      mergeArray('cashTransactions');
      mergeArray('debts', 'debtRecords');
      mergeArray('habits');
      mergeArray('scratchpad', 'scratchpadItems');

      this.state = this.sanitizeAndMigrate(current);
    }

    this.writeToStorage(this.state);
    this.notify();

    return {
      success: true,
      importTimestamp: new Date().toISOString(),
      itemCounts: {
        alarms: this.state.alarms.length,
        routines: this.state.routines.length,
        cashTransactions: this.state.cashTransactions.length,
        debts: this.state.debts.length,
        habits: this.state.habits.length,
        scratchpad: this.state.scratchpad.length
      }
    };
  }

  // --- Convenience Helpers for UI Components ---

  /**
   * Appends an item to an array module with auto-generated id if missing
   */
  addItem(moduleKey, item) {
    if (!Array.isArray(this.state[moduleKey])) {
      throw new Error(`[DailyCompass:Store] Module "${moduleKey}" is not an array.`);
    }
    const itemWithId = {
      id: item.id || generateId(moduleKey.slice(0, 4)),
      ...item
    };
    this.updateModule(moduleKey, (list) => [...list, itemWithId]);
    return itemWithId;
  }

  /**
   * Updates an item in an array module by ID
   */
  updateItem(moduleKey, itemId, updates) {
    if (!Array.isArray(this.state[moduleKey])) {
      throw new Error(`[DailyCompass:Store] Module "${moduleKey}" is not an array.`);
    }
    let found = false;
    this.updateModule(moduleKey, (list) =>
      list.map((item) => {
        if (item.id === itemId) {
          found = true;
          return typeof updates === 'function' ? updates(item) : { ...item, ...updates };
        }
        return item;
      })
    );
    return found;
  }

  /**
   * Removes an item from an array module by ID
   */
  deleteItem(moduleKey, itemId) {
    if (!Array.isArray(this.state[moduleKey])) {
      throw new Error(`[DailyCompass:Store] Module "${moduleKey}" is not an array.`);
    }
    this.updateModule(moduleKey, (list) => list.filter((item) => item.id !== itemId));
    return true;
  }

  /**
   * Computes total expenses for a specific date (defaults to today)
   */
  getExpensesTotal(dateString = getLocalDateString(0)) {
    return this.state.cashTransactions
      .filter((tx) => tx.type === 'expense' && tx.date === dateString)
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  }

  /**
   * Computes Safe-to-Spend cash remaining today
   */
  getSafeToSpendToday() {
    const cap = Number(this.state.settings.dailyBudgetCap ?? 50);
    const spentToday = this.getExpensesTotal(getLocalDateString(0));
    return Number((cap - spentToday).toFixed(2));
  }

  /**
   * Computes Debt Summary: Net Balance, Total Receivable, Total Payable
   */
  getDebtSummary() {
    let theyOweMe = 0;
    let iOweThem = 0;

    for (const d of this.state.debts) {
      if (d.status === 'settled') continue;
      const rem = Number(d.remaining ?? d.remainingAmount ?? d.amount ?? 0);
      if (d.type === 'they_owe_me' || d.direction === 'lent') {
        theyOweMe += rem;
      } else {
        iOweThem += rem;
      }
    }

    return {
      theyOweMe: Number(theyOweMe.toFixed(2)),
      iOweThem: Number(iOweThem.toFixed(2)),
      netReceivable: Number((theyOweMe - iOweThem).toFixed(2))
    };
  }
}

// Singleton Store instance
export const store = new StateStore();

// Attach to window for vanilla script tag compatibility
if (typeof window !== 'undefined') {
  window.DailyCompassStore = store;
}

export default store;
