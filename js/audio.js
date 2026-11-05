/**
 * Daily Compass — Web Audio API Synthesizer
 * Zero external audio files or MP3 dependencies.
 * Provides 4 soothing harmonic presets and an alarm loop manager.
 */

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.masterGainNode = null;
    this.masterVolume = 0.7;
    this._isAlarmPlaying = false;
    this._alarmIntervalId = null;
    this._alarmPreset = 'zen-bowl';
    this._activeNodes = new Set();
    this.isUnlocked = false;

    // Auto-setup user gesture listener in browser
    this._setupUserGestureUnlock();
  }

  /**
   * Lazily initializes or returns the Web Audio AudioContext
   */
  getContext() {
    if (!this.ctx) {
      const AudioCtxClass =
        (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) ||
        (typeof global !== 'undefined' && global.AudioContext);

      if (!AudioCtxClass) {
        return null;
      }

      this.ctx = new AudioCtxClass();
      this.masterGainNode = this.ctx.createGain();
      this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGainNode.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  /**
   * Unlocks AudioContext upon first user interaction to comply with browser autoplay policies
   */
  _setupUserGestureUnlock() {
    if (typeof window === 'undefined') return;

    const unlockHandler = async () => {
      await this.unlock();
      if (this.isUnlocked) {
        window.removeEventListener('click', unlockHandler, true);
        window.removeEventListener('keydown', unlockHandler, true);
        window.removeEventListener('touchstart', unlockHandler, true);
      }
    };

    window.addEventListener('click', unlockHandler, true);
    window.addEventListener('keydown', unlockHandler, true);
    window.addEventListener('touchstart', unlockHandler, true);
  }

  /**
   * Resumes the AudioContext if suspended
   */
  async unlock() {
    const ctx = this.getContext();
    if (!ctx) return false;

    try {
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      this.isUnlocked = ctx.state === 'running';
      return this.isUnlocked;
    } catch (err) {
      console.warn('[DailyCompass:Audio] Could not unlock AudioContext:', err);
      return false;
    }
  }

  /**
   * Sets the master volume (0.0 to 1.0)
   */
  setMasterVolume(volume) {
    const clamped = Math.max(0, Math.min(1, Number(volume) || 0));
    this.masterVolume = clamped;
    const ctx = this.getContext();
    if (ctx && this.masterGainNode) {
      this.masterGainNode.gain.setValueAtTime(clamped, ctx.currentTime);
    }
  }

  /**
   * Returns current master volume
   */
  getMasterVolume() {
    return this.masterVolume;
  }

  /**
   * Returns list of supported preset names
   */
  getAvailablePresets() {
    return ['zen-bowl', 'gentle-triad', 'attentive-bell', 'micro-tick'];
  }

  /**
   * Presets synthesizer routing:
   * 1. 'zen-bowl': 432 Hz fundamental + 864 Hz harmonic, soft sine with slow decay (2.8s) and gentle lowpass filter.
   * 2. 'gentle-triad': Major triad arpeggio (C5: 523.25Hz, E5: 659.25Hz, G5: 783.99Hz), soft bell envelopes.
   * 3. 'attentive-bell': 880 Hz (A5) clear chime with bright overtone and 1.5s exponential decay.
   * 4. 'micro-tick': 1200 Hz short 20ms tactile woodblock tick for UI clicks and habit completion.
   */
  async playPreset(presetName = 'zen-bowl') {
    const ctx = this.getContext();
    if (!ctx) {
      console.warn('[DailyCompass:Audio] AudioContext not supported in this environment.');
      return;
    }

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        // Continue if browser allows
      }
    }

    const normalizedName = String(presetName).toLowerCase().trim();

    switch (normalizedName) {
      case 'zen-bowl':
      case 'zen':
      case 'bowl':
        this._synthesizeZenBowl(ctx);
        break;

      case 'gentle-triad':
      case 'triad':
      case 'chime':
        this._synthesizeGentleTriad(ctx);
        break;

      case 'attentive-bell':
      case 'attentive-wakeup':
      case 'bell':
      case 'wake':
        this._synthesizeAttentiveBell(ctx);
        break;

      case 'micro-tick':
      case 'tick':
      case 'click':
      case 'woodblock':
        this._synthesizeMicroTick(ctx);
        break;

      default:
        console.warn(`[DailyCompass:Audio] Unknown preset "${presetName}", falling back to "zen-bowl".`);
        this._synthesizeZenBowl(ctx);
        break;
    }
  }

  /**
   * Preset 1: Zen Singing Bowl
   * 432 Hz fundamental + 864 Hz harmonic (+2.5 Hz detune for natural beating),
   * soft sine with 2.8s decay and gentle 1200 Hz lowpass filter.
   */
  _synthesizeZenBowl(ctx) {
    const now = ctx.currentTime;
    const duration = 2.8;

    // Filter for acoustic warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(1.2, now);
    filter.connect(this.masterGainNode);

    // Main envelope gain
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.7, now + 0.08); // 80ms soft attack
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration); // 2.8s decay
    gainNode.connect(filter);

    // Fundamental: 432 Hz
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(432.0, now);
    osc1.connect(gainNode);

    // Harmonic overtone: 864 Hz + 2.5 Hz natural acoustic beating
    const harmonicGain = ctx.createGain();
    harmonicGain.gain.setValueAtTime(0.35, now);
    harmonicGain.connect(gainNode);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(866.5, now);
    osc2.connect(harmonicGain);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);

    this._trackNodes([osc1, osc2, gainNode, harmonicGain, filter], duration + 0.15);
  }

  /**
   * Preset 2: Gentle Triad
   * Major triad arpeggio (C5: 523.25Hz, E5: 659.25Hz, G5: 783.99Hz)
   * Staggered soft bell envelopes.
   */
  _synthesizeGentleTriad(ctx) {
    const now = ctx.currentTime;
    const notes = [
      { freq: 523.25, timeOffset: 0.0 },  // C5
      { freq: 659.25, timeOffset: 0.12 }, // E5
      { freq: 783.99, timeOffset: 0.24 }  // G5
    ];
    const noteDecay = 1.3;
    const totalDuration = 0.24 + noteDecay;

    const nodesToTrack = [];

    notes.forEach((note) => {
      const startTime = now + note.timeOffset;
      const osc = ctx.createOscillator();
      osc.type = 'triangle'; // Bell warmth
      osc.frequency.setValueAtTime(note.freq, startTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.45, startTime + 0.02); // 20ms attack
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDecay); // bell decay

      osc.connect(gain);
      gain.connect(this.masterGainNode);

      osc.start(startTime);
      osc.stop(startTime + noteDecay + 0.05);

      nodesToTrack.push(osc, gain);
    });

    this._trackNodes(nodesToTrack, totalDuration + 0.1);
  }

  /**
   * Preset 3: Attentive Bell
   * 880 Hz (A5) clear chime with bright harmonic overtone (1760 Hz) and 1.5s exponential decay.
   */
  _synthesizeAttentiveBell(ctx) {
    const now = ctx.currentTime;
    const duration = 1.5;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.65, now + 0.015); // Fast crisp attack
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration); // 1.5s exponential decay
    gainNode.connect(this.masterGainNode);

    // Fundamental A5 (880 Hz)
    const oscFund = ctx.createOscillator();
    oscFund.type = 'sine';
    oscFund.frequency.setValueAtTime(880.0, now);
    oscFund.connect(gainNode);

    // Bright overtone: Octave harmonic (1760 Hz)
    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.25, now);
    overtoneGain.connect(gainNode);

    const oscOver = ctx.createOscillator();
    oscOver.type = 'sine';
    oscOver.frequency.setValueAtTime(1760.0, now);
    oscOver.connect(overtoneGain);

    oscFund.start(now);
    oscOver.start(now);

    oscFund.stop(now + duration + 0.05);
    oscOver.stop(now + duration + 0.05);

    this._trackNodes([oscFund, oscOver, gainNode, overtoneGain], duration + 0.1);
  }

  /**
   * Preset 4: Micro Woodblock Tick
   * 1200 Hz short 20ms tactile woodblock tick for UI clicks and habit completion.
   * Features rapid pitch drop (1200 Hz -> 200 Hz) for an organic wooden snap.
   */
  _synthesizeMicroTick(ctx) {
    const now = ctx.currentTime;
    const duration = 0.02; // 20ms

    // Bandpass filter for authentic woodblock acoustic resonation
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(2.5, now);
    filter.connect(this.masterGainNode);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.8, now + 0.002); // 2ms click attack
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration); // Snap decay
    gain.connect(filter);

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    // Rapid pitch envelope drop creates realistic percussive tick
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + duration);

    osc.connect(gain);

    osc.start(now);
    osc.stop(now + duration + 0.01);

    this._trackNodes([osc, gain, filter], duration + 0.05);
  }

  /**
   * Safely cleans up Web Audio nodes after playback
   */
  _trackNodes(nodes, lifetimeSeconds) {
    nodes.forEach((node) => this._activeNodes.add(node));
    setTimeout(() => {
      nodes.forEach((node) => {
        try {
          if (node.disconnect) node.disconnect();
        } catch {
          // Node already disconnected
        }
        this._activeNodes.delete(node);
      });
    }, lifetimeSeconds * 1000);
  }

  /**
   * Plays an alarm preset repeatedly at given interval
   * @param {string} presetName
   * @param {number} intervalSeconds - default: 3
   */
  playAlarmLoop(presetName = 'zen-bowl', intervalSeconds = 3) {
    if (this._isAlarmPlaying) {
      this.stopAlarmLoop();
    }

    const intervalMs = Math.max(1000, Number(intervalSeconds || 3) * 1000);
    this._alarmPreset = presetName;
    this._isAlarmPlaying = true;

    // Play first strike immediately
    this.playPreset(this._alarmPreset);

    // Schedule subsequent strikes
    this._alarmIntervalId = setInterval(() => {
      if (this._isAlarmPlaying) {
        this.playPreset(this._alarmPreset);
      }
    }, intervalMs);

    return true;
  }

  /**
   * Stops the active alarm loop and silences ongoing alarms
   */
  stopAlarmLoop() {
    if (this._alarmIntervalId) {
      clearInterval(this._alarmIntervalId);
      this._alarmIntervalId = null;
    }
    this._isAlarmPlaying = false;

    // Disconnect active nodes immediately to silence ringing
    this._activeNodes.forEach((node) => {
      try {
        if (node.stop && typeof node.stop === 'function') {
          node.stop();
        }
        if (node.disconnect) {
          node.disconnect();
        }
      } catch {
        // Ignore
      }
    });
    this._activeNodes.clear();

    return true;
  }

  /**
   * Returns true if an alarm loop is currently active
   */
  isAlarmPlaying() {
    return this._isAlarmPlaying;
  }
}

// Singleton audio instance
export const audio = new AudioSynthesizer();

// Attach to window for script-tag vanilla access
if (typeof window !== 'undefined') {
  window.DailyCompassAudio = audio;
}

export default audio;
