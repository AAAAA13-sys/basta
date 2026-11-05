/**
 * Daily Compass — Web Audio API Synthesizer (v2.0 Pro Max)
 * Zero external audio files or MP3 dependencies.
 * Provides:
 *  - 5 soothing harmonic presets (Zen Bowl, Triad, Bell, Woodblock, Water Drop)
 *  - Procedural continuous focus soundscapes (Pink Rain, 10Hz Alpha Waves, Tibetan Drone)
 *  - Alarm loop engine with user-gesture auto-unlock.
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

    // Ambient Soundscape state
    this._activeSoundscape = null;
    this._soundscapeNodes = [];
    this._soundscapeGainNode = null;

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
   * Explicitly resumes or initializes AudioContext
   */
  async unlock() {
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
        this.isUnlocked = true;
      } catch (err) {
        console.warn('AudioContext resume prevented:', err);
      }
    } else if (ctx && ctx.state === 'running') {
      this.isUnlocked = true;
    }
    return this.isUnlocked;
  }

  /**
   * Returns list of available presets
   */
  getAvailablePresets() {
    return ['zen-bowl', 'gentle-triad', 'attentive-bell', 'micro-tick'];
  }

  /**
   * Sets the master volume (0.0 to 1.0)
   */
  setMasterVolume(vol) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    const ctx = this.getContext();
    if (ctx && this.masterGainNode && this.masterGainNode.gain) {
      if (typeof this.masterGainNode.gain.setTargetAtTime === 'function') {
        this.masterGainNode.gain.setTargetAtTime(this.masterVolume, ctx.currentTime, 0.05);
      } else if (typeof this.masterGainNode.gain.setValueAtTime === 'function') {
        this.masterGainNode.gain.setValueAtTime(this.masterVolume, ctx.currentTime);
      } else {
        this.masterGainNode.gain.value = this.masterVolume;
      }
    }
  }

  getMasterVolume() {
    return this.masterVolume;
  }

  /**
   * Play any sound preset by key
   */
  playPreset(presetName = 'zen-bowl') {
    const ctx = this.getContext();
    if (!ctx) return;
    this.unlock();

    switch (presetName) {
      case 'zen-bowl':
        this._playZenSingingBowl();
        break;
      case 'gentle-triad':
        this._playGentleMajorTriad();
        break;
      case 'attentive-bell':
      case 'attentive-wakeup':
        this._playAttentiveBell();
        break;
      case 'micro-tick':
        this._playMicroWoodblockTick();
        break;
      case 'water-drop':
        this._playWaterDrop();
        break;
      default:
        this._playZenSingingBowl();
        break;
    }
  }

  // ==========================================================================
  // DISCRETE SOUND PRESETS
  // ==========================================================================

  /**
   * 1. Zen Singing Bowl (432 Hz + 866.5 Hz harmonic with natural 2.5Hz acoustic beating)
   */
  _playZenSingingBowl() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const fundamental = ctx.createOscillator();
    fundamental.type = 'sine';
    fundamental.frequency.setValueAtTime(432.0, now);

    const harmonic = ctx.createOscillator();
    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(866.5, now);

    const gainFund = ctx.createGain();
    gainFund.gain.setValueAtTime(0.0001, now);
    gainFund.gain.exponentialRampToValueAtTime(0.45, now + 0.08);
    gainFund.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

    const gainHarm = ctx.createGain();
    gainHarm.gain.setValueAtTime(0.0001, now);
    gainHarm.gain.exponentialRampToValueAtTime(0.2, now + 0.06);
    gainHarm.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    fundamental.connect(gainFund);
    harmonic.connect(gainHarm);
    gainFund.connect(filter);
    gainHarm.connect(filter);
    filter.connect(this.masterGainNode);

    fundamental.start(now);
    harmonic.start(now);
    fundamental.stop(now + 2.9);
    harmonic.stop(now + 2.9);
  }

  /**
   * 2. Gentle Major Triad (Ascending C5, E5, G5 arpeggio)
   */
  _playGentleMajorTriad() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [
      { freq: 523.25, timeOffset: 0.0 },   // C5
      { freq: 659.25, timeOffset: 0.12 },  // E5
      { freq: 783.99, timeOffset: 0.24 }   // G5
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, now + note.timeOffset);

      const startTime = now + note.timeOffset;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.35, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.6);

      osc.connect(gain);
      gain.connect(this.masterGainNode);

      osc.start(startTime);
      osc.stop(startTime + 1.7);
    });
  }

  /**
   * 3. Attentive Bell (880 Hz clear chime with 1.5s exponential decay)
   */
  _playAttentiveBell() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const oscPrimary = ctx.createOscillator();
    oscPrimary.type = 'sine';
    oscPrimary.frequency.setValueAtTime(880.0, now);

    const oscOvertone = ctx.createOscillator();
    oscOvertone.type = 'sine';
    oscOvertone.frequency.setValueAtTime(1760.0, now);

    const gainPrimary = ctx.createGain();
    gainPrimary.gain.setValueAtTime(0.0001, now);
    gainPrimary.gain.exponentialRampToValueAtTime(0.4, now + 0.015);
    gainPrimary.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

    const gainOvertone = ctx.createGain();
    gainOvertone.gain.setValueAtTime(0.0001, now);
    gainOvertone.gain.exponentialRampToValueAtTime(0.15, now + 0.01);
    gainOvertone.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    oscPrimary.connect(gainPrimary);
    oscOvertone.connect(gainOvertone);
    gainPrimary.connect(this.masterGainNode);
    gainOvertone.connect(this.masterGainNode);

    oscPrimary.start(now);
    oscOvertone.start(now);
    oscPrimary.stop(now + 1.6);
    oscOvertone.stop(now + 1.6);
  }

  /**
   * 4. Micro Woodblock Tick (1200 Hz short 20ms tactile tick for habit check & UI feedback)
   */
  _playMicroWoodblockTick() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.02);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain);
    gain.connect(this.masterGainNode);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  /**
   * 5. Water Drop (Synthesized droplet pitch bend 600Hz -> 1400Hz -> 900Hz for Hydration logging)
   */
  _playWaterDrop() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';

    // Characteristic water droplet frequency curve
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, now);
    filter.Q.setValueAtTime(4.0, now);

    osc.connect(gain);
    gain.connect(filter);
    filter.connect(this.masterGainNode);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // ==========================================================================
  // PROCEDURAL AMBIENT SOUNDSCAPES (Focus & Calming Streams)
  // ==========================================================================

  /**
   * Start an infinite procedural ambient soundscape
   * @param {'pink-rain' | 'alpha-waves' | 'tibetan-drone'} soundscapeType
   * @param {number} volume - Volume factor between 0.1 and 1.0
   */
  startSoundscape(soundscapeType = 'pink-rain', volume = 0.5) {
    const ctx = this.getContext();
    if (!ctx) return;
    this.unlock();

    // Stop current soundscape if playing
    this.stopSoundscape();

    const now = ctx.currentTime;
    const soundscapeGain = ctx.createGain();
    soundscapeGain.gain.setValueAtTime(0.0001, now);
    soundscapeGain.gain.linearRampToValueAtTime(Math.min(1.0, Math.max(0.1, volume)) * 0.45, now + 1.5);
    soundscapeGain.connect(this.masterGainNode);

    this._soundscapeGainNode = soundscapeGain;
    this._activeSoundscape = soundscapeType;
    this._soundscapeNodes = [];

    if (soundscapeType === 'pink-rain') {
      this._startPinkRain(ctx, soundscapeGain);
    } else if (soundscapeType === 'alpha-waves') {
      this._startAlphaBinaural(ctx, soundscapeGain);
    } else if (soundscapeType === 'tibetan-drone') {
      this._startTibetanDrone(ctx, soundscapeGain);
    }
  }

  /**
   * Procedural Pink Noise Rain Simulation
   * Generated with Paul Kellet's -3dB/oct filter algorithm
   */
  _startPinkRain(ctx, outputNode) {
    const bufferSize = ctx.sampleRate * 2; // 2-second looped noise
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoiseSource = ctx.createBufferSource();
    whiteNoiseSource.buffer = noiseBuffer;
    whiteNoiseSource.loop = true;

    // Resonant lowpass for soft rainfall
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1100, ctx.currentTime);

    // Subtle LFO for wind modulation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // Gentle swell
    lfoGain.gain.setValueAtTime(250, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);

    whiteNoiseSource.connect(lowpass);
    lowpass.connect(outputNode);

    lfo.start();
    whiteNoiseSource.start();

    this._soundscapeNodes.push(whiteNoiseSource, lfo, lfoGain, lowpass);
  }

  /**
   * 10 Hz Alpha Wave Binaural Generator for ADHD Calm Focus
   * Left Ear: 200 Hz Sine | Right Ear: 210 Hz Sine
   */
  _startAlphaBinaural(ctx, outputNode) {
    const leftOsc = ctx.createOscillator();
    const rightOsc = ctx.createOscillator();
    leftOsc.type = 'sine';
    rightOsc.type = 'sine';
    leftOsc.frequency.setValueAtTime(200.0, ctx.currentTime);
    rightOsc.frequency.setValueAtTime(210.0, ctx.currentTime); // 10Hz differential

    // Panners if available
    let leftPan = null, rightPan = null;
    if (ctx.createStereoPanner) {
      leftPan = ctx.createStereoPanner();
      rightPan = ctx.createStereoPanner();
      leftPan.pan.setValueAtTime(-0.9, ctx.currentTime);
      rightPan.pan.setValueAtTime(0.9, ctx.currentTime);

      leftOsc.connect(leftPan);
      rightOsc.connect(rightPan);
      leftPan.connect(outputNode);
      rightPan.connect(outputNode);
      this._soundscapeNodes.push(leftPan, rightPan);
    } else {
      leftOsc.connect(outputNode);
      rightOsc.connect(outputNode);
    }

    leftOsc.start();
    rightOsc.start();

    this._soundscapeNodes.push(leftOsc, rightOsc);
  }

  /**
   * Continuous Quad-Layer Tibetan Singing Bowl Drone
   */
  _startTibetanDrone(ctx, outputNode) {
    const droneFreqs = [108.0, 216.0, 324.0, 432.0];
    droneFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      // Subtle detuning for harmonic warmth
      const detune = idx % 2 === 0 ? 0.35 : -0.35;
      osc.frequency.setValueAtTime(freq + detune, ctx.currentTime);

      gain.gain.setValueAtTime(0.18 / (idx + 1), ctx.currentTime);

      osc.connect(gain);
      gain.connect(outputNode);
      osc.start();

      this._soundscapeNodes.push(osc, gain);
    });
  }

  /**
   * Stop active focus soundscape
   */
  stopSoundscape() {
    this._activeSoundscape = null;
    const ctx = this.getContext();
    if (ctx && this._soundscapeGainNode) {
      const now = ctx.currentTime;
      this._soundscapeGainNode.gain.linearRampToValueAtTime(0.0001, now + 0.6);
      setTimeout(() => {
        this._soundscapeNodes.forEach((node) => {
          try {
            if (node.stop) node.stop();
            if (node.disconnect) node.disconnect();
          } catch (_) {}
        });
        this._soundscapeNodes = [];
        this._soundscapeGainNode = null;
      }, 650);
    } else {
      this._soundscapeNodes = [];
      this._soundscapeGainNode = null;
    }
  }

  isSoundscapePlaying() {
    return this._activeSoundscape !== null;
  }

  getActiveSoundscape() {
    return this._activeSoundscape;
  }

  // ==========================================================================
  // ALARM LOOP CONTROLLER
  // ==========================================================================

  playAlarmLoop(presetName = 'zen-bowl', intervalSeconds = 3.2) {
    this.stopAlarmLoop();
    this._isAlarmPlaying = true;
    this._alarmPreset = presetName;

    this.playPreset(this._alarmPreset);

    const ms = Math.max(1000, intervalSeconds * 1000);
    this._alarmIntervalId = setInterval(() => {
      if (this._isAlarmPlaying) {
        this.playPreset(this._alarmPreset);
      }
    }, ms);
  }

  stopAlarmLoop() {
    this._isAlarmPlaying = false;
    if (this._alarmIntervalId) {
      clearInterval(this._alarmIntervalId);
      this._alarmIntervalId = null;
    }
  }

  isAlarmPlaying() {
    return this._isAlarmPlaying;
  }
}

// Singleton audio instance
export const audio = new AudioSynthesizer();
export const soundEngine = audio; // spec alias

// Attach to window for script-tag vanilla access
if (typeof window !== 'undefined') {
  window.DailyCompassAudio = audio;
  window.soundEngine = audio;
}

export default audio;
