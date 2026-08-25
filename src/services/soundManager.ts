/**
 * Web Audio API synthesizer for all train, math and UI sound effects.
 * 100% self-contained, works offline, zero network dependencies.
 */

class SoundManager {
  private audioCtx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private speechEnabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private getAudioContext(): AudioContext | null {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setSpeechEnabled(enabled: boolean) {
    this.speechEnabled = enabled;
    if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
  }

  public isSpeechEnabled(): boolean {
    return this.speechEnabled;
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
  }

  // --- Sound Effects ---

  /**
   * Train Whistle (توت توت / Choo-Choo)
   */
  public playTrainWhistle() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const playSingleWhistle = (startTime: number, duration: number) => {
      const freqs = [440, 554.37, 659.25]; // A major chord for realistic steam train whistle
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, startTime + duration * 0.3);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.98, startTime + duration);

        // Low-pass filter for steam warmth
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.08, startTime + 0.05);
        gain.gain.setValueAtTime(0.08, startTime + duration - 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    };

    const now = ctx.currentTime;
    playSingleWhistle(now, 0.35);
    playSingleWhistle(now + 0.45, 0.55);
  }

  /**
   * Train Chug sound (تشك تشك)
   */
  public playTrainChug() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
    filter.Q.setValueAtTime(3, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  }

  /**
   * Correct Answer Chime (إجابة صحيحة)
   */
  public playCorrect() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, index) => {
      const startTime = now + index * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  /**
   * Friendly Wrong Answer Tone (حاول مرة أخرى)
   */
  public playWrong() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.28);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Button / Tap Click
   */
  public playClick() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Star Award Sound (نجمة)
   */
  public playStarEarned(index: number = 0) {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const baseNotes = [659.25, 830.61, 987.77]; // E5, G#5, B5
    const freq = baseNotes[index % baseNotes.length] || 880;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.15);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  /**
   * Victory Fanfare (إكمال المحطة بنجاح)
   */
  public playLevelWin() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [
      { freq: 523.25, time: 0, dur: 0.15 },    // C5
      { freq: 523.25, time: 0.15, dur: 0.15 }, // C5
      { freq: 523.25, time: 0.3, dur: 0.15 },  // C5
      { freq: 659.25, time: 0.45, dur: 0.3 },  // E5
      { freq: 587.33, time: 0.75, dur: 0.15 }, // D5
      { freq: 659.25, time: 0.9, dur: 0.15 },  // E5
      { freq: 783.99, time: 1.05, dur: 0.6 },  // G5
    ];

    const now = ctx.currentTime;
    notes.forEach((n) => {
      const startTime = now + n.time;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.03);
      gain.gain.setValueAtTime(0.18, startTime + n.dur - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + n.dur);
    });
  }

  /**
   * Badge Unlock Shimmer
   */
  public playBadgeUnlock() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    freqs.forEach((freq, idx) => {
      const startTime = now + idx * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  /**
   * Arabic Voice Text-to-Speech
   */
  public speakArabic(text: string, force: boolean = false) {
    if ((!this.speechEnabled && !force) || typeof window === 'undefined') return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop current speech
      const cleanText = text.replace(/<[^>]*>?/gm, ''); // Strip html if any
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.95; // Slightly slower for clear child learning
      utterance.pitch = 1.1; // Friendly warm pitch

      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech errors gracefully
    }
  }
}

export const soundManager = new SoundManager();
