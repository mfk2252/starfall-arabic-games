// Rich Dynamic Hybrid Audio Engine for Children (Aged 3+)
// Provides varied, motivating, non-monotonous sound effects and praise voices

class SoundEffects {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private speechSynth: SpeechSynthesis | null = null;

  // Counters to cycle smoothly through varied audio profiles
  private clickIndex: number = 0;
  private matchIndex: number = 0;
  private wrongIndex: number = 0;
  private winIndex: number = 0;

  private praiseWordsAr = ['أحسنت!', 'رائع!', 'ممتاز!', 'يا لك من بطل!', 'إجابة صحيحة!', 'عظيم!'];
  private praiseWordsEn = ['Well done!', 'Awesome!', 'Excellent!', 'Super star!', 'Great job!', 'Fantastic!'];

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('starfall_sound_enabled');
      if (saved !== null) {
        this.soundEnabled = saved === 'true';
      }
      if ('speechSynthesis' in window) {
        this.speechSynth = window.speechSynthesis;
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('starfall_sound_enabled', String(this.soundEnabled));
    if (!this.soundEnabled && this.speechSynth) {
      this.speechSynth.cancel();
    }
    return this.soundEnabled;
  }

  // -------------------------------------------------------------
  // 1. DYNAMIC CLICK & POP VARIATIONS (5 Profiles)
  // -------------------------------------------------------------
  public playFlip() {
    this.playPop();
  }

  public playClick() {
    this.playPop();
  }

  public playPop() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const profile = this.clickIndex % 5;
      this.clickIndex++;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (profile === 0) {
        // Profile 0: Bubble Pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.07);
        gain.gain.setValueAtTime(0.22, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      } else if (profile === 1) {
        // Profile 1: Wooden Toy Tap
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      } else if (profile === 2) {
        // Profile 2: Water Drop Pluck
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1050, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      } else if (profile === 3) {
        // Profile 3: Cute Marimba Ping
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      } else {
        // Profile 4: Cartoon Whistle Tap
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(380, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(920, ctx.currentTime + 0.07);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Ignore
    }
  }

  // -------------------------------------------------------------
  // 2. DYNAMIC SUCCESS & MATCH VARIATIONS (5 Profiles + Voice Praise)
  // -------------------------------------------------------------
  public playMatch(withPraiseVoice: boolean = true) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const profile = this.matchIndex % 5;
      this.matchIndex++;

      if (profile === 0) {
        // Profile 0: Classic Major Arpeggio (C5 - E5 - G5 - C6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
          gain.gain.setValueAtTime(0.26, ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.08);
          osc.stop(ctx.currentTime + i * 0.08 + 0.3);
        });
      } else if (profile === 1) {
        // Profile 1: Upward Glissando Sparkle (G4 - B4 - D5 - G5 - B5 - D6)
        const notes = [392.00, 493.88, 587.33, 783.99, 987.77, 1174.66];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
          gain.gain.setValueAtTime(0.22, ctx.currentTime + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.05);
          osc.stop(ctx.currentTime + i * 0.05 + 0.25);
        });
      } else if (profile === 2) {
        // Profile 2: Fanfare Chime (F5 - A5 - C6 - F6)
        const notes = [698.46, 880.00, 1046.50, 1396.91];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.09);
          gain.gain.setValueAtTime(0.28, ctx.currentTime + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.09);
          osc.stop(ctx.currentTime + i * 0.09 + 0.35);
        });
      } else if (profile === 3) {
        // Profile 3: Double Bounce Joy (E5 - G5 - B5 - C6)
        const notes = [659.25, 783.99, 987.77, 1046.50];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
          gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.28);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.07);
          osc.stop(ctx.currentTime + i * 0.07 + 0.28);
        });
      } else {
        // Profile 4: Rich Marimba Joy (D5 - F#5 - A5 - D6)
        const notes = [587.33, 739.99, 880.00, 1174.66];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
          gain.gain.setValueAtTime(0.26, ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.32);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.08);
          osc.stop(ctx.currentTime + i * 0.08 + 0.32);
        });
      }

      // Optionally speak a random encouraging praise phrase every 2 matches
      if (withPraiseVoice && this.matchIndex % 2 === 0) {
        setTimeout(() => {
          this.playPraise('ar');
        }, 350);
      }
    } catch {
      // Ignore
    }
  }

  // -------------------------------------------------------------
  // 3. MAGICAL SPARKLE / STAR COLLECT
  // -------------------------------------------------------------
  public playSparkle() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const freqs = [1046.50, 1318.51, 1567.98, 2093.00, 2637.02];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + i * 0.05 + 0.22);
      });
    } catch {
      // Ignore
    }
  }

  // -------------------------------------------------------------
  // 4. DYNAMIC NON-PUNITIVE TRY AGAIN VARIATIONS (4 Profiles)
  // -------------------------------------------------------------
  public playWrong() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const profile = this.wrongIndex % 4;
      this.wrongIndex++;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (profile === 0) {
        // Profile 0: Cartoon Spring Bounce
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.22);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);
      } else if (profile === 1) {
        // Profile 1: Gentle "Oops" Slide
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(190, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.16, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      } else if (profile === 2) {
        // Profile 2: Playful Marimba Double Tap
        osc.type = 'sine';
        osc.frequency.setValueAtTime(280, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      } else {
        // Profile 3: Soft Pillow Tap
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Ignore
    }
  }

  // -------------------------------------------------------------
  // 5. DYNAMIC CELEBRATION & VICTORY FANFARES (3 Variations)
  // -------------------------------------------------------------
  public playWin() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const profile = this.winIndex % 3;
      this.winIndex++;

      if (profile === 0) {
        // Profile 0: Grand Victory Fanfare + Applause Harmonics
        const melody = [
          { f: 523.25, t: 0.00, d: 0.12 }, // C5
          { f: 659.25, t: 0.12, d: 0.12 }, // E5
          { f: 783.99, t: 0.24, d: 0.12 }, // G5
          { f: 1046.50, t: 0.36, d: 0.18 }, // C6
          { f: 880.00, t: 0.54, d: 0.12 }, // A5
          { f: 1046.50, t: 0.66, d: 0.45 }  // C6
        ];

        melody.forEach(item => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(item.f, ctx.currentTime + item.t);
          gain.gain.setValueAtTime(0.32, ctx.currentTime + item.t);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + item.t + item.d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + item.t);
          osc.stop(ctx.currentTime + item.t + item.d);
        });

        this.synthesizeApplause(ctx, 0.4, 0.4);
      } else if (profile === 1) {
        // Profile 1: Superhero March Fanfare
        const melody = [
          { f: 392.00, t: 0.00, d: 0.12 }, // G4
          { f: 523.25, t: 0.12, d: 0.12 }, // C5
          { f: 659.25, t: 0.24, d: 0.12 }, // E5
          { f: 783.99, t: 0.36, d: 0.15 }, // G5
          { f: 1046.50, t: 0.52, d: 0.50 }  // C6
        ];

        melody.forEach(item => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(item.f, ctx.currentTime + item.t);
          gain.gain.setValueAtTime(0.3, ctx.currentTime + item.t);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + item.t + item.d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + item.t);
          osc.stop(ctx.currentTime + item.t + item.d);
        });

        this.synthesizeApplause(ctx, 0.5, 0.4);
      } else {
        // Profile 2: Carnival Xylophone Celebration
        const melody = [
          { f: 587.33, t: 0.00, d: 0.10 },
          { f: 739.99, t: 0.10, d: 0.10 },
          { f: 880.00, t: 0.20, d: 0.10 },
          { f: 1174.66, t: 0.30, d: 0.20 },
          { f: 1046.50, t: 0.52, d: 0.45 }
        ];

        melody.forEach(item => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(item.f, ctx.currentTime + item.t);
          gain.gain.setValueAtTime(0.28, ctx.currentTime + item.t);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + item.t + item.d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + item.t);
          osc.stop(ctx.currentTime + item.t + item.d);
        });

        this.synthesizeApplause(ctx, 0.4, 0.4);
      }

      // Spoken Celebration
      setTimeout(() => {
        this.speakText('أحسنت يا بطل! إنها نتيجة رائعة جداً!', 'ar');
      }, 700);
    } catch {
      // Ignore
    }
  }

  private synthesizeApplause(ctx: AudioContext, delaySec: number, durationSec: number) {
    try {
      const bufferSize = ctx.sampleRate * durationSec;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, ctx.currentTime + delaySec);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delaySec + durationSec);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(ctx.currentTime + delaySec);
    } catch {
      // Ignore
    }
  }

  // -------------------------------------------------------------
  // 6. RANDOM MOTIVATIONAL VOICE PRAISE
  // -------------------------------------------------------------
  public playPraise(lang: 'ar' | 'en' = 'ar') {
    if (!this.soundEnabled || !this.speechSynth) return;

    try {
      const phrases = lang === 'ar' ? this.praiseWordsAr : this.praiseWordsEn;
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      this.speakText(randomPhrase, lang);
    } catch {
      // Ignore
    }
  }

  // -------------------------------------------------------------
  // 7. SPEECH SYNTHESIS FOR VOCABULARY & LETTERS
  // -------------------------------------------------------------
  public speakText(text: string, lang: 'ar' | 'en' = 'ar') {
    if (!this.soundEnabled || !this.speechSynth) return;

    try {
      this.speechSynth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      utterance.rate = 0.9; // Clear, friendly pace for children
      utterance.pitch = 1.15; // Warm, enthusiastic pitch

      this.speechSynth.speak(utterance);
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundEffects();
