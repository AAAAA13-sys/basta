/**
 * Daily Compass — Foundational State Store (v2.0 Pro Max)
 * Manages local persistence, schema validation, event subscriptions, data portability,
 * and advanced modules (Hydration, Medications, Energy Battery, Schedule Shift, Subscriptions, Snapshots).
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
 * Pure JS SHA-256 fallback engine (RFC 6234 standard)
 * Ensures zero-dependency cryptographic hashing even in non-HTTPS / local file test contexts
 */
export function pureJsSha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const maxWord = Math.pow(2, 32);
  let i, j;
  let result = '';

  const words = [];
  const asciiBitLength = ascii.length * 8;

  const hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  ascii += '\x80';
  while ((ascii.length % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii.length; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << ((3 - (i % 4)) * 8);
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;

  for (j = 0; j < words.length;) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp1 = (hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0)) | 0;
      const temp2 = ((rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj) | 0;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + temp1) | 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (temp1 + temp2) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >>> (j * 8)) & 255;
      result += ((b < 16 ? '0' : '') + b.toString(16));
    }
  }
  return result;
}

/**
 * Standard SHA-256 Hex Digest helper
 * Uses Web Crypto API when available, seamlessly falling back to pureJsSha256
 */
export async function sha256Hex(text) {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.digest === 'function') {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // Graceful fallback to pureJsSha256
  }
  return pureJsSha256(String(text || ''));
}

/**
 * Normalizes speech dictation transcripts
 * Converts spoken punctuation words, cleans boundary whitespace, and capitalizes sentences
 */
export function normalizeSpokenTranscript(transcript = '') {
  if (!transcript || typeof transcript !== 'string') return '';
  let text = transcript.trim();

  // Spoken punctuation replacement
  text = text
    .replace(/\b(period|full stop)\b/gi, '.')
    .replace(/\b(comma)\b/gi, ',')
    .replace(/\b(question mark)\b/gi, '?')
    .replace(/\b(exclamation mark|exclamation point)\b/gi, '!')
    .replace(/\b(new line|next line)\b/gi, '\n');

  // Fix spaces before punctuation (e.g. "milk ." -> "milk.")
  text = text.replace(/\s+([.,!?:;])/g, '$1');

  // Clean conversational filler words at boundary
  text = text.replace(/\b(um|uh|like)\s+/gi, '');

  // Capitalize first letter of each sentence
  text = text.replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, prefix, char) => prefix + char.toUpperCase());

  // Capitalize standalone "i"
  text = text.replace(/\bi\b/g, 'I');

  return text.trim();
}

/**
 * Semantic Tag Inferencing Heuristic
 * Automatically detects whether a thought is a To-Do, To-Buy, Idea, Later, or Reflection
 */
export function inferScratchpadTag(text = '') {
  const lower = String(text || '').toLowerCase().trim();

  // 1. To-Buy Intent
  if (/^(buy|purchase|order|get|pick up|need to get)\b/.test(lower) ||
      lower.includes('grocery') || lower.includes('store') || lower.includes('supermarket') ||
      lower.includes('milk') || lower.includes('eggs') || lower.includes('bread') || lower.includes('cartridge')) {
    return { tag: 'To-Buy', category: 'to-buy' };
  }

  // 2. To-Do Intent
  if (/^(call|email|text|send|submit|finish|pay|schedule|book|fix|clean|cancel)\b/.test(lower) ||
      lower.includes('remember to') || lower.includes('need to') || lower.includes('don\'t forget') ||
      lower.includes('deadline') || lower.includes('appointment')) {
    return { tag: 'To-Do', category: 'to-do' };
  }

  // 3. Idea Intent
  if (/^(idea|what if|maybe|concept|project|think about|brainstorm)\b/.test(lower)) {
    return { tag: 'Idea', category: 'idea' };
  }

  // 4. Later / Someday Intent
  if (/^(later|someday|eventually|next week|down the road)\b/.test(lower)) {
    return { tag: 'Later', category: 'later' };
  }

  // 5. Emotional / Somatic Reflection
  if (/^(feeling|felt|tired|overwhelmed|happy|grateful|anxious|vent|today was)\b/.test(lower)) {
    return { tag: 'Reflection', category: 'thought' };
  }

  return { tag: 'Thought', category: 'idea' };
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
  ],

  // =========================================================================
  // v2.0 PRO MAX EXPANSION MODULES
  // =========================================================================

  // 1. Hydration Module
  hydration: {
    targetMl: 2000,
    currentMl: 750,
    history: [
      { id: 'hyd-1', amount: 250, time: '07:30', timestamp: new Date().toISOString() },
      { id: 'hyd-2', amount: 500, time: '11:00', timestamp: new Date().toISOString() }
    ]
  },

  // 2. Medication & Supplement Checklist with Safety Lock
  medications: [
    {
      id: 'med-1',
      name: 'Multivitamin & Zinc',
      dosage: '1 capsule',
      timeSlot: 'morning',
      withFood: true,
      takenToday: true,
      lastTakenAt: getLocalDateString(0) + 'T07:15:00.000Z'
    },
    {
      id: 'med-2',
      name: 'Omega-3 Fish Oil',
      dosage: '1 softgel',
      timeSlot: 'morning',
      withFood: true,
      takenToday: true,
      lastTakenAt: getLocalDateString(0) + 'T07:15:00.000Z'
    },
    {
      id: 'med-3',
      name: 'Magnesium Glycinate',
      dosage: '200mg',
      timeSlot: 'evening',
      withFood: false,
      takenToday: false,
      lastTakenAt: null
    }
  ],

  // 3. Energy & Sensory Battery Gauge (Spoon Theory & Gentle Mode)
  energyBattery: {
    level: 80, // 20, 60, or 100
    isGentleMode: false,
    sensoryDrainers: [],
    lastUpdated: new Date().toISOString()
  },

  // 4. Focus Sprint Timer & Ambient Soundscape State
  focusSprint: {
    active: false,
    mode: 'pomodoro',
    durationMinutes: 25,
    remainingSeconds: 1500,
    soundscape: 'pink-rain',
    isPaused: false
  },

  // 5. Recurring Subscriptions & Monthly Cash Buffer Projection
  subscriptions: [
    {
      id: 'sub-1',
      name: 'Cloud Storage & Workspace',
      amount: 9.99,
      billingDay: 15,
      cycle: 'monthly',
      category: 'Digital',
      isPaidThisMonth: false
    },
    {
      id: 'sub-2',
      name: 'Gym & Bouldering Membership',
      amount: 35.00,
      billingDay: 1,
      cycle: 'monthly',
      category: 'Health',
      isPaidThisMonth: true
    },
    {
      id: 'sub-3',
      name: 'Home Fiber Broadband',
      amount: 45.00,
      billingDay: 20,
      cycle: 'monthly',
      category: 'Bills',
      isPaidThisMonth: false
    }
  ],

  // 6. Rolling Automated Snapshots
  snapshots: [],

  // 7. Privacy Vault & Sensitive Data Masking (v2.1 Pro Max Plus)
  privacy: {
    pinHash: null,
    salt: null,
    cryptoEngine: 'web-crypto-native',
    isLocked: false,
    isMasked: false,
    autoLockMinutes: 5,
    lockOnTabHidden: true,
    failedAttempts: 0,
    lockedUntilTimestamp: null,
    hint: null,
    maskCashBalances: true,
    maskDebts: true,
    maskSubscriptions: true,
    maskPrivateNotes: true
  },

  // 8. 7-Day Rolling History & Daily Metric Archives (v2.1 Pro Max Plus)
  dailyArchives: []
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
    this._lastShiftBackup = null;
    this.selectedViewDate = getLocalDateString(0);
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

    // v2 Object Modules
    if (loadedState.hydration) {
      base.hydration = {
        ...base.hydration,
        ...loadedState.hydration,
        history: Array.isArray(loadedState.hydration.history) ? loadedState.hydration.history : base.hydration.history
      };
    }
    if (loadedState.energyBattery) {
      base.energyBattery = { ...base.energyBattery, ...loadedState.energyBattery };
    }
    if (loadedState.focusSprint) {
      base.focusSprint = { ...base.focusSprint, ...loadedState.focusSprint };
    }
    if (loadedState.privacy) {
      base.privacy = { ...base.privacy, ...loadedState.privacy };
    }

    // Arrays: use loaded if valid array, otherwise base
    const arrayKeys = ['alarms', 'routines', 'cashTransactions', 'debts', 'habits', 'scratchpad', 'medications', 'subscriptions', 'snapshots', 'dailyArchives'];
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
   * Selectively updates a specific module.
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
      scratchpadItems: snapshot.scratchpad, // spec alias
      hydration: snapshot.hydration,
      medications: snapshot.medications,
      energyBattery: snapshot.energyBattery,
      focusSprint: snapshot.focusSprint,
      subscriptions: snapshot.subscriptions,
      snapshots: snapshot.snapshots
    };

    return JSON.stringify(payload, null, 2);
  }

  /**
   * Imports application state from a JSON string.
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
      this.state = this.sanitizeAndMigrate(parsed);
    } else {
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
      mergeArray('medications');
      mergeArray('subscriptions');

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
        scratchpad: this.state.scratchpad.length,
        medications: (this.state.medications || []).length,
        subscriptions: (this.state.subscriptions || []).length
      }
    };
  }

  // =========================================================================
  // v2.0 PRO MAX EXTENSION METHODS
  // =========================================================================

  /**
   * Log water intake in ml (capped at 6000ml max)
   */
  addWater(amountMl = 250) {
    const cur = this.state.hydration || { targetMl: 2000, currentMl: 0, history: [] };
    const newMl = Math.min(6000, Math.max(0, (cur.currentMl || 0) + Number(amountMl)));
    const entry = {
      id: generateId('hyd'),
      amount: Number(amountMl),
      time: new Date().toTimeString().slice(0, 5),
      timestamp: new Date().toISOString()
    };
    const newHistory = [...(cur.history || []), entry];

    this.updateModule('hydration', {
      ...cur,
      currentMl: newMl,
      history: newHistory
    });
    return newMl;
  }

  /**
   * Undo last water log
   */
  undoWater() {
    const cur = this.state.hydration || { targetMl: 2000, currentMl: 0, history: [] };
    if (!cur.history || cur.history.length === 0) return cur.currentMl;

    const lastEntry = cur.history[cur.history.length - 1];
    const newHistory = cur.history.slice(0, -1);
    const newMl = Math.max(0, (cur.currentMl || 0) - (lastEntry.amount || 0));

    this.updateModule('hydration', {
      ...cur,
      currentMl: newMl,
      history: newHistory
    });
    return newMl;
  }

  /**
   * Toggle medication taken status with timestamp recording
   */
  toggleMedication(medId) {
    const list = this.state.medications || [];
    let updatedMed = null;

    const updatedList = list.map((m) => {
      if (m.id === medId) {
        const nextTaken = !m.takenToday;
        updatedMed = {
          ...m,
          takenToday: nextTaken,
          lastTakenAt: nextTaken ? new Date().toISOString() : null
        };
        return updatedMed;
      }
      return m;
    });

    this.updateModule('medications', updatedList);
    return updatedMed;
  }

  /**
   * Set energy battery level (20, 60, 100) with auto Gentle-Mode trigger at <= 20%
   */
  setEnergyLevel(level) {
    const numLevel = Math.max(0, Math.min(100, Number(level)));
    const shouldGentle = numLevel <= 20;

    this.updateModule('energyBattery', {
      level: numLevel,
      isGentleMode: shouldGentle,
      lastUpdated: new Date().toISOString()
    });

    return { level: numLevel, isGentleMode: shouldGentle };
  }

  /**
   * Explicitly toggle Gentle Mode
   */
  toggleGentleMode(forceState) {
    const cur = this.state.energyBattery || { level: 80, isGentleMode: false };
    const nextState = typeof forceState === 'boolean' ? forceState : !cur.isGentleMode;
    this.updateModule('energyBattery', {
      ...cur,
      isGentleMode: nextState
    });
    return nextState;
  }

  /**
   * Schedule Quick-Shift Engine: Shifts remaining routines chronologically
   * Clamps end boundary to 23:59 to protect sleep.
   */
  quickShiftSchedule(minutes = 15) {
    this._lastShiftBackup = deepClone(this.state.routines);
    const shiftMins = Number(minutes);
    const now = new Date();
    const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const toMinutes = (hhmm) => {
      const [h, m] = hhmm.split(':').map(Number);
      return h * 60 + m;
    };

    const toHHMM = (totalMins) => {
      const clamped = Math.min(1439, Math.max(0, totalMins));
      const h = Math.floor(clamped / 60);
      const m = clamped % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const updatedRoutines = this.state.routines.map((r) => {
      const routineEndMins = toMinutes(r.end);
      const currentMins = toMinutes(currentHHMM);

      // Only shift active or upcoming routines
      if (routineEndMins >= currentMins) {
        const newStartMins = toMinutes(r.start) + shiftMins;
        const newEndMins = routineEndMins + shiftMins;
        return {
          ...r,
          start: toHHMM(newStartMins),
          startTime: toHHMM(newStartMins),
          end: toHHMM(newEndMins),
          endTime: toHHMM(newEndMins)
        };
      }
      return r;
    });

    this.updateModule('routines', updatedRoutines);
    return updatedRoutines;
  }

  /**
   * Undo last schedule shift
   */
  undoQuickShift() {
    if (this._lastShiftBackup) {
      const restored = deepClone(this._lastShiftBackup);
      this._lastShiftBackup = null;
      this.updateModule('routines', restored);
      return true;
    }
    return false;
  }

  /**
   * Create an automated local snapshot (retains up to 12 snapshots: 7 daily + 5 action)
   */
  createAutoSnapshot(label = 'Manual Checkpoint') {
    const curSnaps = this.state.snapshots || [];
    const newSnapshot = {
      id: generateId('snap'),
      timestamp: new Date().toISOString(),
      label,
      state: this.getState()
    };

    // FIFO rotation: cap at 12
    const rotated = [newSnapshot, ...curSnaps].slice(0, 12);
    this.updateModule('snapshots', rotated);
    return newSnapshot;
  }

  /**
   * Restore state from a snapshot
   */
  restoreAutoSnapshot(snapshotId) {
    const curSnaps = this.state.snapshots || [];
    const snap = curSnaps.find((s) => s.id === snapshotId);
    if (!snap || !snap.state) {
      throw new Error(`[DailyCompass:Store] Snapshot not found: "${snapshotId}"`);
    }
    this.setState(snap.state);
    return true;
  }

  /**
   * End-of-Month Cash Buffer calculation
   */
  getEndMonthCashBuffer() {
    const cap = Number(this.state.settings.dailyBudgetCap ?? 50);
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const currentDay = now.getDate();
    const remainingDays = Math.max(0, daysInMonth - currentDay);

    const monthlyPool = cap * daysInMonth;
    const currentMonthPrefix = getLocalDateString(0).slice(0, 7);

    // Sum expenses this month
    const spentThisMonth = (this.state.cashTransactions || [])
      .filter((tx) => tx.type === 'expense' && (tx.date || '').startsWith(currentMonthPrefix))
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    // Sum unpaid subscriptions this month
    const pendingSubs = (this.state.subscriptions || [])
      .filter((s) => !s.isPaidThisMonth)
      .reduce((sum, s) => sum + Number(s.amount || 0), 0);

    const projectedFutureDailySpend = remainingDays * cap;
    const projectedBuffer = monthlyPool - spentThisMonth - pendingSubs - projectedFutureDailySpend;

    let status = 'comfort'; // > 0
    if (projectedBuffer < 0) status = 'deficit';
    else if (projectedBuffer <= cap) status = 'tight';

    return {
      monthlyPool: Number(monthlyPool.toFixed(2)),
      spentThisMonth: Number(spentThisMonth.toFixed(2)),
      pendingSubscriptions: Number(pendingSubs.toFixed(2)),
      remainingDays,
      projectedBuffer: Number(projectedBuffer.toFixed(2)),
      status
    };
  }

  // --- Convenience Helpers for UI Components ---

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

  deleteItem(moduleKey, itemId) {
    if (!Array.isArray(this.state[moduleKey])) {
      throw new Error(`[DailyCompass:Store] Module "${moduleKey}" is not an array.`);
    }
    this.updateModule(moduleKey, (list) => list.filter((item) => item.id !== itemId));
    return true;
  }

  getExpensesTotal(dateString = getLocalDateString(0)) {
    return (this.state.cashTransactions || [])
      .filter((tx) => tx.type === 'expense' && tx.date === dateString)
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  }

  getSafeToSpendToday() {
    const cap = Number(this.state.settings.dailyBudgetCap ?? 50);
    const spentToday = this.getExpensesTotal(getLocalDateString(0));
    return Number((cap - spentToday).toFixed(2));
  }

  getDebtSummary() {
    let theyOweMe = 0;
    let iOweThem = 0;

    for (const d of this.state.debts || []) {
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

  // =========================================================================
  // v2.1 PRO MAX PLUS — ROUTINE EDITOR & TEMPORAL SCULPTING
  // =========================================================================

  /**
   * Validate and compute duration in minutes for routine start/end bounds
   * Handles cross-midnight wrapping seamlessly without punitive errors
   */
  validateRoutineTimeBounds(startTime, endTime, isCrossMidnight = false) {
    const parseM = (t) => {
      if (!t || typeof t !== 'string' || !t.includes(':')) return 0;
      const [h, m] = t.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };

    const mStart = parseM(startTime);
    const mEnd = parseM(endTime);
    let cross = Boolean(isCrossMidnight);

    if (mEnd < mStart) {
      cross = true;
    }

    let deltaMinutes = 0;
    if (cross || mEnd < mStart) {
      deltaMinutes = (1440 - mStart) + mEnd;
    } else {
      deltaMinutes = mEnd - mStart;
    }

    if (deltaMinutes <= 0) {
      deltaMinutes = 60; // compassionate fallback default
    }

    const hours = Math.floor(deltaMinutes / 60);
    const mins = deltaMinutes % 60;
    let durationFormatted = '';
    if (hours > 0 && mins > 0) durationFormatted = `${hours}h ${mins}m`;
    else if (hours > 0) durationFormatted = `${hours}h`;
    else durationFormatted = `${mins}m`;

    return {
      isValid: true,
      durationMinutes: deltaMinutes,
      durationFormatted,
      isCrossMidnight: cross,
      warnings: deltaMinutes > 720 ? ['Routine block exceeds 12 hours. Consider dividing into sub-blocks.'] : []
    };
  }

  /**
   * Create a new Routine Block
   */
  createRoutine(payload = {}) {
    const start = payload.startTime || payload.start || '09:00';
    const end = payload.endTime || payload.end || '10:00';
    const timeInfo = this.validateRoutineTimeBounds(start, end, payload.isCrossMidnight);

    const steps = (Array.isArray(payload.steps) ? payload.steps : []).map((step, idx) => ({
      id: step.id || generateId('step'),
      order: idx + 1,
      title: String(step.title || step.name || `Step ${idx + 1}`).trim(),
      durationMinutes: Number(step.durationMinutes || 10),
      isCompleted: Boolean(step.isCompleted),
      completedAt: step.completedAt || null
    }));

    const routineId = payload.id || generateId('routine');
    const title = String(payload.title || payload.name || 'New Routine Block').trim();

    const newRoutine = {
      id: routineId,
      title,
      name: title,
      start,
      startTime: start,
      end,
      endTime: end,
      category: payload.category || 'work',
      icon: payload.icon || '🎯',
      color: payload.color || '#4a7bb0',
      isCrossMidnight: timeInfo.isCrossMidnight,
      durationMinutes: timeInfo.durationMinutes,
      steps
    };

    this.createAutoSnapshot('auto_pre_routine_create');
    this.addItem('routines', newRoutine);
    return newRoutine;
  }

  /**
   * Update an existing Routine Block
   */
  updateRoutine(routineId, partial = {}) {
    const routines = this.state.routines || [];
    const existing = routines.find((r) => r.id === routineId);
    if (!existing) {
      throw new Error(`[DailyCompass:Store] Routine "${routineId}" not found.`);
    }

    const start = partial.startTime || partial.start || existing.startTime || existing.start;
    const end = partial.endTime || partial.end || existing.endTime || existing.end;
    const isCross = partial.isCrossMidnight !== undefined ? partial.isCrossMidnight : existing.isCrossMidnight;
    const timeInfo = this.validateRoutineTimeBounds(start, end, isCross);

    const updated = {
      ...existing,
      ...partial,
      start,
      startTime: start,
      end,
      endTime: end,
      isCrossMidnight: timeInfo.isCrossMidnight,
      durationMinutes: timeInfo.durationMinutes
    };

    if (partial.title) {
      updated.title = String(partial.title).trim();
      updated.name = updated.title;
    }

    if (Array.isArray(partial.steps)) {
      updated.steps = partial.steps.map((st, i) => ({
        id: st.id || generateId('step'),
        order: i + 1,
        title: String(st.title || st.name || `Step ${i + 1}`).trim(),
        durationMinutes: Number(st.durationMinutes || 10),
        isCompleted: Boolean(st.isCompleted),
        completedAt: st.completedAt || null
      }));
    }

    this.updateItem('routines', routineId, updated);
    return updated;
  }

  /**
   * Delete a Routine Block with pre-deletion snapshot and anchor fallback
   */
  deleteRoutine(routineId) {
    this.createAutoSnapshot('auto_pre_routine_delete');
    this.deleteItem('routines', routineId);

    // If deleted routine was active in anchor, smoothly transition to next
    if (this.state.anchor?.currentRoutineId === routineId || this.state.anchor?.activeRoutineId === routineId) {
      const remaining = this.state.routines || [];
      const nextRoutine = remaining.length > 0 ? remaining[0] : null;
      this.updateModule('anchor', (anchor) => ({
        ...anchor,
        currentRoutineId: nextRoutine ? nextRoutine.id : null,
        activeRoutineId: nextRoutine ? nextRoutine.id : null,
        activeStepId: nextRoutine && nextRoutine.steps?.[0]?.id ? nextRoutine.steps[0].id : null
      }));
    }
    return true;
  }

  /**
   * Add a Micro-Step to a Routine Block
   */
  addRoutineStep(routineId, stepPayload, insertAtIndex = null) {
    const routine = (this.state.routines || []).find((r) => r.id === routineId);
    if (!routine) {
      throw new Error(`[DailyCompass:Store] Routine "${routineId}" not found.`);
    }

    const steps = [...(routine.steps || [])];
    const newStep = {
      id: stepPayload?.id || generateId('step'),
      title: String(stepPayload?.title || stepPayload?.name || `Step ${steps.length + 1}`).trim(),
      durationMinutes: Number(stepPayload?.durationMinutes || 10),
      isCompleted: Boolean(stepPayload?.isCompleted),
      completedAt: stepPayload?.completedAt || null
    };

    if (insertAtIndex !== null && insertAtIndex >= 0 && insertAtIndex <= steps.length) {
      steps.splice(insertAtIndex, 0, newStep);
    } else {
      steps.push(newStep);
    }

    // Renumber 1..N
    const renumbered = steps.map((s, idx) => ({ ...s, order: idx + 1 }));
    this.updateItem('routines', routineId, { steps: renumbered });
    return renumbered.find((s) => s.id === newStep.id);
  }

  /**
   * Update a Micro-Step in a Routine Block
   */
  updateRoutineStep(routineId, stepId, partial = {}) {
    const routine = (this.state.routines || []).find((r) => r.id === routineId);
    if (!routine) {
      throw new Error(`[DailyCompass:Store] Routine "${routineId}" not found.`);
    }

    let found = null;
    const updatedSteps = (routine.steps || []).map((step) => {
      if (step.id === stepId) {
        found = { ...step, ...partial };
        if (partial.isCompleted && !step.isCompleted) {
          found.completedAt = new Date().toISOString();
        } else if (partial.isCompleted === false) {
          found.completedAt = null;
        }
        return found;
      }
      return step;
    });

    if (!found) {
      throw new Error(`[DailyCompass:Store] Step "${stepId}" not found in routine "${routineId}".`);
    }

    this.updateItem('routines', routineId, { steps: updatedSteps });
    return found;
  }

  /**
   * Delete a Micro-Step from a Routine Block
   */
  deleteRoutineStep(routineId, stepId) {
    const routine = (this.state.routines || []).find((r) => r.id === routineId);
    if (!routine) {
      throw new Error(`[DailyCompass:Store] Routine "${routineId}" not found.`);
    }

    const filtered = (routine.steps || []).filter((s) => s.id !== stepId);
    const renumbered = filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
    this.updateItem('routines', routineId, { steps: renumbered });
    return true;
  }

  /**
   * Reorder Micro-Steps in a Routine Block
   */
  reorderRoutineSteps(routineId, orderedStepIds = []) {
    const routine = (this.state.routines || []).find((r) => r.id === routineId);
    if (!routine) {
      throw new Error(`[DailyCompass:Store] Routine "${routineId}" not found.`);
    }

    const currentMap = new Map((routine.steps || []).map((s) => [s.id, s]));
    const reordered = [];

    for (const sid of orderedStepIds) {
      if (currentMap.has(sid)) {
        reordered.push(currentMap.get(sid));
        currentMap.delete(sid);
      }
    }
    // Append any steps not specified in orderedStepIds
    for (const leftover of currentMap.values()) {
      reordered.push(leftover);
    }

    const renumbered = reordered.map((s, idx) => ({ ...s, order: idx + 1 }));
    this.updateItem('routines', routineId, { steps: renumbered });
    return renumbered;
  }

  /**
   * 1-Tap Auto-Balance helper: splits routine duration evenly across steps
   */
  autoBalanceRoutineSteps(routineId) {
    const routine = (this.state.routines || []).find((r) => r.id === routineId);
    if (!routine || !routine.steps || routine.steps.length === 0) return false;

    const totalMin = routine.durationMinutes || 60;
    const n = routine.steps.length;
    const perStep = Math.max(1, Math.floor(totalMin / n));
    const remainder = totalMin - (perStep * n);

    const balanced = routine.steps.map((st, idx) => ({
      ...st,
      durationMinutes: idx === n - 1 ? perStep + remainder : perStep
    }));

    this.updateItem('routines', routineId, { steps: balanced });
    return balanced;
  }

  // =========================================================================
  // v2.1 PRO MAX PLUS — PRIVACY VAULT & BALANCE MASKING
  // =========================================================================

  /**
   * Setup or change Privacy PIN
   */
  async setupPrivacyPin(pinString, options = {}) {
    const cleanPin = String(pinString || '').trim();
    if (!/^\d{4,8}$/.test(cleanPin)) {
      throw new Error('[DailyCompass:Store] PIN must be between 4 and 8 digits.');
    }

    const salt = (typeof crypto !== 'undefined' && crypto.getRandomValues)
      ? Array.from(crypto.getRandomValues(new Uint8Array(16))).map((b) => b.toString(16).padStart(2, '0')).join('')
      : `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;

    const pinHash = await sha256Hex(`${salt}:${cleanPin}`);

    this.updateModule('privacy', (priv) => ({
      ...priv,
      pinHash,
      salt,
      hint: options.hint ? String(options.hint).trim() : null,
      failedAttempts: 0,
      lockedUntilTimestamp: null,
      isLocked: false
    }));

    return true;
  }

  /**
   * Verify an entered PIN against stored salt and hash
   */
  async verifyPrivacyPin(pinString) {
    const priv = this.state.privacy || {};
    if (!priv.pinHash || !priv.salt) {
      return true; // No PIN configured
    }

    // Check rate-limiting lockout
    if (priv.lockedUntilTimestamp && Date.now() < priv.lockedUntilTimestamp) {
      const remainingSec = Math.ceil((priv.lockedUntilTimestamp - Date.now()) / 1000);
      throw new Error(`[DailyCompass:Store] Vault locked. Cooldown remaining: ${remainingSec}s`);
    }

    const cleanPin = String(pinString || '').trim();
    const hashAttempt = await sha256Hex(`${priv.salt}:${cleanPin}`);

    if (hashAttempt === priv.pinHash) {
      // Success: reset failed attempts and unlock
      this.updateModule('privacy', (p) => ({
        ...p,
        failedAttempts: 0,
        lockedUntilTimestamp: null,
        isLocked: false
      }));
      return true;
    } else {
      // Failed attempt
      const attempts = (priv.failedAttempts || 0) + 1;
      let lockoutDurationMs = 0;
      if (attempts >= 7) lockoutDurationMs = 300000; // 5 mins
      else if (attempts >= 5) lockoutDurationMs = 60000; // 1 min
      else if (attempts >= 3) lockoutDurationMs = 15000; // 15 sec

      const lockedUntil = lockoutDurationMs > 0 ? Date.now() + lockoutDurationMs : null;

      this.updateModule('privacy', (p) => ({
        ...p,
        failedAttempts: attempts,
        lockedUntilTimestamp: lockedUntil
      }));
      return false;
    }
  }

  /**
   * Remove PIN security from the Vault
   */
  async removePrivacyPin(currentPinString) {
    const verified = await this.verifyPrivacyPin(currentPinString);
    if (!verified) {
      return false;
    }

    this.updateModule('privacy', (priv) => ({
      ...priv,
      pinHash: null,
      salt: null,
      hint: null,
      isLocked: false,
      failedAttempts: 0,
      lockedUntilTimestamp: null
    }));

    return true;
  }

  /**
   * Toggle or set the balance masking mode (instant visual blur)
   */
  toggleMaskMode(forceState = undefined) {
    let nextState;
    this.updateModule('privacy', (priv) => {
      nextState = forceState !== undefined ? Boolean(forceState) : !priv.isMasked;
      return { ...priv, isMasked: nextState };
    });
    return nextState;
  }

  /**
   * Instantly lock vault screen
   */
  lockVault() {
    const priv = this.state.privacy || {};
    if (priv.pinHash) {
      this.updateModule('privacy', (p) => ({ ...p, isLocked: true, isMasked: true }));
    } else {
      // If no PIN is configured, lock just enables masking
      this.updateModule('privacy', (p) => ({ ...p, isMasked: true }));
    }
  }

  /**
   * Unlock vault with PIN
   */
  async unlockVault(pinString) {
    const valid = await this.verifyPrivacyPin(pinString);
    if (valid) {
      this.updateModule('privacy', (p) => ({ ...p, isLocked: false }));
    }
    return valid;
  }

  /**
   * Emergency reset: compassionate zero data-loss reset for forgotten PINs
   */
  emergencyResetPin(confirmationPhrase = '') {
    if (String(confirmationPhrase).trim().toLowerCase() !== 'reset vault') {
      return false;
    }

    this.updateModule('privacy', (priv) => ({
      ...priv,
      pinHash: null,
      salt: null,
      hint: null,
      isLocked: false,
      failedAttempts: 0,
      lockedUntilTimestamp: null
    }));

    return true;
  }

  /**
   * Get public status of privacy vault without exposing hashes
   */
  getPrivacyStatus() {
    const priv = this.state.privacy || {};
    const now = Date.now();
    const isUnderLockout = Boolean(priv.lockedUntilTimestamp && now < priv.lockedUntilTimestamp);
    const cooldownSeconds = isUnderLockout ? Math.ceil((priv.lockedUntilTimestamp - now) / 1000) : 0;

    return {
      hasPin: Boolean(priv.pinHash),
      isLocked: Boolean(priv.isLocked),
      isMasked: Boolean(priv.isMasked),
      failedAttempts: priv.failedAttempts || 0,
      isUnderLockout,
      cooldownSeconds,
      hint: priv.hint || null
    };
  }

  // =========================================================================
  // v2.1 PRO MAX PLUS — SCRATCHPAD JOURNAL & EXPORT ENGINE
  // =========================================================================

  /**
   * Add a quick thought or reflection note to the scratchpad
   */
  addScratchpadItem({ text, tag = 'Thought', category = 'idea' }) {
    const cleanText = String(text || '').trim();
    if (!cleanText) return null;

    const item = {
      id: generateId('note'),
      text: cleanText,
      content: cleanText,
      tag: String(tag).trim() || 'Thought',
      category: String(category).trim().toLowerCase() || 'idea',
      createdAt: new Date().toISOString(),
      status: 'active',
      convertedTo: null
    };

    this.updateModule('scratchpad', (notes) => [item, ...(notes || [])]);
    return item;
  }

  /**
   * Delete a scratchpad note
   */
  deleteScratchpadItem(id) {
    this.deleteItem('scratchpad', id);
    return true;
  }

  /**
   * Export today's full day journal as a formatted Markdown document
   */
  exportMarkdownDayJournal(dateString = getLocalDateString(0)) {
    const state = this.getState();
    const safeToSpend = this.getSafeToSpendToday();
    const spentToday = this.getExpensesTotal(dateString);
    const debtSummary = this.getDebtSummary();
    const buffer = this.getEndMonthCashBuffer();

    const hydrationCurrent = state.hydration?.currentMl || 0;
    const hydrationTarget = state.hydration?.targetMl || 2000;
    const hydrationPct = Math.round((hydrationCurrent / hydrationTarget) * 100);

    const meds = state.medications || [];
    const medsTaken = meds.filter((m) => m.takenToday).length;

    const habits = state.habits || [];
    const habitsDone = habits.filter((h) => (h.completedDates || []).includes(dateString)).length;

    const routines = state.routines || [];
    let routineStepsTotal = 0;
    let routineStepsDone = 0;
    routines.forEach((r) => {
      (r.steps || []).forEach((st) => {
        routineStepsTotal++;
        if (st.isCompleted) routineStepsDone++;
      });
    });

    const notes = state.scratchpad || [];

    const lines = [
      `# 🧭 Daily Compass — Day Log: ${dateString}`,
      `*Generated on ${new Date().toLocaleString()}*`,
      '',
      '## ⚡ Energy & Grounding State',
      `- **Energy Battery:** ${state.energyBattery?.level ?? 100}% (${state.energyBattery?.isGentleMode ? 'Gentle Sensory Mode Active' : 'Optimal Capacity'})`,
      `- **Active Anchor:** ${state.anchor?.activeRoutineId || 'None'}`,
      '',
      '## 💧 Hydration & Medications',
      `- **Hydration:** ${hydrationCurrent}ml / ${hydrationTarget}ml (${hydrationPct}%)`,
      `- **Medications:** ${medsTaken} of ${meds.length} taken today`,
      ...meds.map((m) => `  - [${m.takenToday ? 'x' : ' '}] **${m.name}** (${m.dosage}) — *${m.timeSlot}*`),
      '',
      '## 📋 Routines & Schedule Blocks',
      `- **Overall Progress:** ${routineStepsDone} / ${routineStepsTotal} micro-actions completed`,
      ...routines.map((r) => {
        const stepCount = (r.steps || []).length;
        const doneCount = (r.steps || []).filter((s) => s.isCompleted).length;
        return `### ${r.icon || '🎯'} ${r.title} (${r.start} - ${r.end}) [${doneCount}/${stepCount}]\n` +
          (r.steps || []).map((s) => `  - [${s.isCompleted ? 'x' : ' '}] ${s.title} (${s.durationMinutes}m)`).join('\n');
      }),
      '',
      '## 🌿 Habits & Activities',
      `- **Habits Completed:** ${habitsDone} / ${habits.length}`,
      ...habits.map((h) => {
        const isDone = (h.completedDates || []).includes(dateString);
        return `  - [${isDone ? 'x' : ' '}] **${h.title}** (🔥 Streak: ${h.streak || 0} days)`;
      }),
      '',
      '## 💳 Financial Ledger & Safety Buffer',
      `- **Daily Budget Cap:** $${state.settings?.dailyBudgetCap ?? 50}`,
      `- **Spent Today:** $${spentToday.toFixed(2)}`,
      `- **Safe-to-Spend Balance:** $${safeToSpend.toFixed(2)} (${safeToSpend >= 0 ? 'Surplus' : 'Deficit'})`,
      `- **End-of-Month Projected Buffer:** $${buffer.projectedBuffer.toFixed(2)} (${buffer.status.toUpperCase()})`,
      `- **Debts:** Lent: $${debtSummary.theyOweMe} | Borrowed: $${debtSummary.iOweThem} | Net: $${debtSummary.netReceivable}`,
      '',
      '## 📝 Scratchpad & Brain Dump Entries',
      ...(notes.length > 0
        ? notes.map((n) => `- **[${n.tag || 'Note'}]** ${n.text || n.content} *(logged ${new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})*`)
        : ['*No scratchpad notes recorded today.*']),
      '',
      '---',
      '*Daily Compass — Zero-distraction calm daily companion.*'
    ];

    return lines.join('\n');
  }

  /**
   * Export cash transactions as standard CSV
   */
  exportCSVTransactions() {
    const transactions = this.state.cashTransactions || [];
    const headers = ['Date', 'Time', 'Type', 'Category', 'Amount', 'Note'];
    const rows = transactions.map((tx) => [
      tx.date || '',
      tx.time || '',
      tx.type || 'expense',
      `"${String(tx.category || '').replace(/"/g, '""')}"`,
      Number(tx.amount || 0).toFixed(2),
      `"${String(tx.note || '').replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Archive today's summary metrics into the 7-day rolling archive
   */
  archiveDailySummary(dateString = getLocalDateString(0)) {
    const state = this.getState();
    const waterMl = state.hydration?.currentMl || 0;
    const meds = state.medications || [];
    const medsCompleted = meds.filter((m) => m.takenToday).length;
    const habits = state.habits || [];
    const habitsCompleted = habits.filter((h) => (h.completedDates || []).includes(dateString)).length;
    const spent = this.getExpensesTotal(dateString);
    const budgetCap = Number(state.settings?.dailyBudgetCap ?? 50);

    const record = {
      date: dateString,
      waterMl,
      medsCompleted,
      medsTotal: meds.length,
      habitsCompleted,
      habitsTotal: habits.length,
      spent: Number(spent.toFixed(2)),
      budgetCap,
      archivedAt: new Date().toISOString()
    };

    this.updateModule('dailyArchives', (archives) => {
      const list = (archives || []).filter((a) => a.date !== dateString);
      list.push(record);
      // Keep last 14 days sorted chronologically
      return list.sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
    });

    return record;
  }

  /**
   * Compute 7-day rolling trend metrics
   */
  getWeeklyTrendMetrics() {
    const archives = this.state.dailyArchives || [];
    const last7 = archives.slice(-7);

    const totalDays = last7.length || 1;
    const avgWater = Math.round(last7.reduce((sum, d) => sum + (d.waterMl || 0), 0) / totalDays);
    const avgSpend = Number((last7.reduce((sum, d) => sum + (d.spent || 0), 0) / totalDays).toFixed(2));
    const totalHabitsDone = last7.reduce((sum, d) => sum + (d.habitsCompleted || 0), 0);
    const totalHabitsPossible = last7.reduce((sum, d) => sum + (d.habitsTotal || 0), 0);
    const habitAdherence = totalHabitsPossible > 0 ? Math.round((totalHabitsDone / totalHabitsPossible) * 100) : 100;

    return {
      daysLogged: last7.length,
      avgWaterMl: avgWater,
      avgDailySpend: avgSpend,
      habitAdherenceRate: habitAdherence,
      dailyRecords: last7
    };
  }

  // =========================================================================
  // v2.2 PRO MAX ULTRA — RETROSPECTIVE CHRONO-STRIP & LIFE TEMPLATES
  // =========================================================================

  /**
   * Set the currently inspected view date (for retrospective day browsing)
   */
  setSelectedViewDate(dateString) {
    this.selectedViewDate = dateString || getLocalDateString(0);
    this.notify();
    return this.selectedViewDate;
  }

  /**
   * Get the currently inspected view date
   */
  getSelectedViewDate() {
    return this.selectedViewDate || getLocalDateString(0);
  }

  /**
   * Toggle completion of a habit for a specific date (enables retrospective logging)
   */
  toggleHabitForDate(habitId, targetDateString = getLocalDateString(0)) {
    const habits = this.state.habits || [];
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) {
      throw new Error(`[DailyCompass:Store] Habit "${habitId}" not found.`);
    }

    const completed = new Set(habit.completedDates || []);
    if (completed.has(targetDateString)) {
      completed.delete(targetDateString);
    } else {
      completed.add(targetDateString);
    }

    const sortedDates = Array.from(completed).sort();

    // Recalculate streak
    let streak = 0;
    let checkOffset = 0;
    while (true) {
      const checkDate = getLocalDateString(-checkOffset);
      if (completed.has(checkDate)) {
        streak++;
        checkOffset++;
      } else {
        if (checkOffset === 0) {
          checkOffset++;
          continue;
        }
        break;
      }
    }

    const updated = {
      ...habit,
      completedDates: sortedDates,
      streak
    };

    this.updateItem('habits', habitId, updated);
    return updated;
  }

  /**
   * Compute metrics for a specific historical date
   */
  getMetricsForDate(targetDateString) {
    const state = this.getState();
    const today = getLocalDateString(0);
    const isToday = targetDateString === today;

    const txs = state.cashTransactions || [];
    const spent = txs
      .filter((t) => t.date === targetDateString && t.type === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const habits = state.habits || [];
    const habitsDone = habits.filter((h) => (h.completedDates || []).includes(targetDateString)).length;

    const archives = state.dailyArchives || [];
    const archived = archives.find((a) => a.date === targetDateString);
    const waterMl = archived ? archived.waterMl : isToday ? (state.hydration?.currentMl || 0) : 0;

    return {
      date: targetDateString,
      isToday,
      spent: Number(spent.toFixed(2)),
      habitsDone,
      habitsTotal: habits.length,
      waterMl
    };
  }

  /**
   * Apply one of three research-backed Life-Setup Archetype Templates
   */
  applyLifeTemplate(templateId, mode = 'merge') {
    const snapshot = this.createAutoSnapshot(`pre_template_${templateId}`);

    const ARCHETYPES = {
      'adhd-navigator': {
        name: 'ADHD Focus Navigator',
        settings: { dailyBudgetCap: 45, soundPreset: 'zen-bowl', streakShields: 3 },
        batteryLevel: 60,
        routines: [
          {
            id: 'routine-morning-adhd',
            title: 'Morning Somatic Awakening',
            start: '07:30',
            startTime: '07:30',
            end: '08:30',
            endTime: '08:30',
            category: 'wellness',
            icon: '🌅',
            color: '#60cd9b',
            steps: [
              { id: 'adhd-s1', order: 1, title: 'Drink 500ml water & take morning meds', durationMinutes: 10, isCompleted: false },
              { id: 'adhd-s2', order: 2, title: '10-min sunlight exposure & gentle stretch', durationMinutes: 15, isCompleted: false },
              { id: 'adhd-s3', order: 3, title: 'High-protein nourishing breakfast', durationMinutes: 30, isCompleted: false },
              { id: 'adhd-s4', order: 4, title: 'Review today’s Focus Anchor', durationMinutes: 5, isCompleted: false }
            ]
          },
          {
            id: 'routine-deep-1',
            title: 'Deep Focus Sprint 1',
            start: '09:30',
            startTime: '09:30',
            end: '11:30',
            endTime: '11:30',
            category: 'work',
            icon: '🎯',
            color: '#4a7bb0',
            steps: [
              { id: 'adhd-f1', order: 1, title: 'Clear desktop & open primary focus doc', durationMinutes: 5, isCompleted: false },
              { id: 'adhd-f2', order: 2, title: 'Pomodoro Sprint 1 (Pink Rain ambient)', durationMinutes: 50, isCompleted: false },
              { id: 'adhd-f3', order: 3, title: '15-min screen-free pacing break', durationMinutes: 15, isCompleted: false },
              { id: 'adhd-f4', order: 4, title: 'Pomodoro Sprint 2 (Deep Execution)', durationMinutes: 50, isCompleted: false }
            ]
          },
          {
            id: 'routine-lunch-reset',
            title: 'Mid-Day Fuel & Brain Reset',
            start: '12:30',
            startTime: '12:30',
            end: '13:30',
            endTime: '13:30',
            category: 'nourish',
            icon: '🍲',
            color: '#e5a960',
            steps: [
              { id: 'adhd-l1', order: 1, title: 'Mindful lunch away from screens', durationMinutes: 30, isCompleted: false },
              { id: 'adhd-l2', order: 2, title: 'Screen-free walk in daylight', durationMinutes: 30, isCompleted: false }
            ]
          },
          {
            id: 'routine-winddown-adhd',
            title: 'Night Wind-Down & Magnesium',
            start: '21:00',
            startTime: '21:00',
            end: '22:30',
            endTime: '22:30',
            category: 'wellness',
            icon: '🌙',
            color: '#bc8cff',
            steps: [
              { id: 'adhd-w1', order: 1, title: 'Dim blue lighting & take magnesium', durationMinutes: 15, isCompleted: false },
              { id: 'adhd-w2', order: 2, title: 'Evening scratchpad gratitude dump', durationMinutes: 15, isCompleted: false },
              { id: 'adhd-w3', order: 3, title: 'Calm reading & 4-7-8 breathing', durationMinutes: 60, isCompleted: false }
            ]
          }
        ],
        habits: [
          { id: 'adhd-h1', title: '500ml Water Upon Waking', icon: '💧', category: 'wellness', frequency: 'daily', streak: 2, completedDates: [getLocalDateString(-1)] },
          { id: 'adhd-h2', title: '15-min Outdoor Sunlight Exposure', icon: '☀️', category: 'wellness', frequency: 'daily', streak: 4, completedDates: [getLocalDateString(-1)] },
          { id: 'adhd-h3', title: 'Take Daily Meds & Supplements', icon: '💊', category: 'wellness', frequency: 'daily', streak: 5, completedDates: [getLocalDateString(-1)] },
          { id: 'adhd-h4', title: '4-7-8 Breath Calmer Check', icon: '🧘', category: 'wellness', frequency: 'daily', streak: 1, completedDates: [] },
          { id: 'adhd-h5', title: 'Evening Ledger & Reflection Check', icon: '💳', category: 'finance', frequency: 'daily', streak: 3, completedDates: [getLocalDateString(-1)] }
        ]
      },
      'freelance-pro': {
        name: 'Remote Freelancer / Deep Worker',
        settings: { dailyBudgetCap: 60, soundPreset: 'gentle-triad', streakShields: 2 },
        batteryLevel: 100,
        routines: [
          {
            id: 'routine-commute',
            title: 'Virtual Commute & Coffee Walk',
            start: '08:30',
            startTime: '08:30',
            end: '09:15',
            endTime: '09:15',
            category: 'movement',
            icon: '🚶',
            color: '#38bdf8',
            steps: [
              { id: 'free-c1', order: 1, title: 'Morning fresh air walk', durationMinutes: 25, isCompleted: false },
              { id: 'free-c2', order: 2, title: 'Brew pour-over coffee & set top 3', durationMinutes: 20, isCompleted: false }
            ]
          },
          {
            id: 'routine-client-deep',
            title: 'Deep Client Delivery Block',
            start: '09:45',
            startTime: '09:45',
            end: '12:45',
            endTime: '12:45',
            category: 'work',
            icon: '💻',
            color: '#4a7bb0',
            steps: [
              { id: 'free-d1', order: 1, title: 'Client milestone deep execution', durationMinutes: 120, isCompleted: false },
              { id: 'free-d2', order: 2, title: 'Commit code & draft review notes', durationMinutes: 60, isCompleted: false }
            ]
          },
          {
            id: 'routine-shutdown',
            title: 'Hard Shutdown & Desk Clearance',
            start: '17:00',
            startTime: '17:00',
            end: '17:30',
            endTime: '17:30',
            category: 'routine',
            icon: '🛑',
            color: '#e5a960',
            steps: [
              { id: 'free-s1', order: 1, title: 'Close all browser work tabs', durationMinutes: 10, isCompleted: false },
              { id: 'free-s2', order: 2, title: 'Clear workspace desk surface', durationMinutes: 10, isCompleted: false },
              { id: 'free-s3', order: 3, title: 'Log billable expenses & close', durationMinutes: 10, isCompleted: false }
            ]
          }
        ],
        habits: [
          { id: 'free-h1', title: 'Log All Billable Expenses', icon: '🧾', category: 'finance', frequency: 'daily', streak: 3, completedDates: [getLocalDateString(-1)] },
          { id: 'free-h2', title: 'Stand & Hydrate Every 90m', icon: '💧', category: 'wellness', frequency: 'daily', streak: 6, completedDates: [getLocalDateString(-1)] },
          { id: 'free-h3', title: 'Review Invoices & Debts', icon: '💳', category: 'finance', frequency: 'daily', streak: 2, completedDates: [] }
        ]
      },
      'gentle-recovery': {
        name: 'Gentle Recovery / Low Spoon',
        settings: { dailyBudgetCap: 30, soundPreset: 'zen-bowl', streakShields: 5 },
        batteryLevel: 20,
        routines: [
          {
            id: 'routine-soft-awake',
            title: 'Soft Awakening & Warm Tea',
            start: '08:30',
            startTime: '08:30',
            end: '09:30',
            endTime: '09:30',
            category: 'wellness',
            icon: '☕',
            color: '#60cd9b',
            steps: [
              { id: 'rec-a1', order: 1, title: 'Warm herbal tea in bed', durationMinutes: 30, isCompleted: false },
              { id: 'rec-a2', order: 2, title: 'Gentle breath & zero-rush morning', durationMinutes: 30, isCompleted: false }
            ]
          },
          {
            id: 'routine-rest-hour',
            title: 'Restorative Afternoon Pause',
            start: '14:30',
            startTime: '14:30',
            end: '16:00',
            endTime: '16:00',
            category: 'rest',
            icon: '🌿',
            color: '#bc8cff',
            steps: [
              { id: 'rec-r1', order: 1, title: 'Tibetan singing bowls calm audio', durationMinutes: 45, isCompleted: false },
              { id: 'rec-r2', order: 2, title: 'Cozy weighted blanket pause', durationMinutes: 45, isCompleted: false }
            ]
          }
        ],
        habits: [
          { id: 'rec-h1', title: 'Gentle 1.5L Hydration Pace', icon: '💧', category: 'wellness', frequency: 'daily', streak: 1, completedDates: [] },
          { id: 'rec-h2', title: 'Zero-Guilt Rest Interval', icon: '🌿', category: 'wellness', frequency: 'daily', streak: 5, completedDates: [getLocalDateString(-1)] },
          { id: 'rec-h3', title: 'Gentle 5-min Somatic Stretch', icon: '🌸', category: 'wellness', frequency: 'daily', streak: 2, completedDates: [getLocalDateString(-1)] }
        ]
      }
    };

    const template = ARCHETYPES[templateId];
    if (!template) {
      throw new Error(`[DailyCompass:Store] Unknown template archetype: "${templateId}"`);
    }

    if (mode === 'replace') {
      this.updateModule('settings', (s) => ({ ...s, ...template.settings }));
      this.updateModule('routines', template.routines);
      this.updateModule('habits', template.habits);
      this.setEnergyLevel(template.batteryLevel);
    } else {
      // Non-destructive merge
      this.updateModule('settings', (s) => ({ ...s, ...template.settings }));
      this.setEnergyLevel(template.batteryLevel);

      const curRoutines = this.state.routines || [];
      const curRoutineIds = new Set(curRoutines.map((r) => r.id));
      const newRoutines = [...curRoutines];
      template.routines.forEach((r) => {
        if (!curRoutineIds.has(r.id)) {
          newRoutines.push(r);
        }
      });
      this.updateModule('routines', newRoutines);

      const curHabits = this.state.habits || [];
      const curHabitTitles = new Set(curHabits.map((h) => h.title.toLowerCase()));
      const newHabits = [...curHabits];
      template.habits.forEach((h) => {
        if (!curHabitTitles.has(h.title.toLowerCase())) {
          newHabits.push(h);
        }
      });
      this.updateModule('habits', newHabits);
    }

    return {
      success: true,
      templateId,
      templateName: template.name,
      snapshotId: snapshot.id
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
