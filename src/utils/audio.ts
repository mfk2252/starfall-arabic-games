// Rich Dynamic Hybrid Audio Engine for Children (Aged 1-7+)
// Combines curated CC0 open-source sound packs (Kenney Interface Sounds, Freesound/SoundBible CC0),
// ZzFX (MIT open-source procedural synth), Web Audio harmonics, and child-friendly motivational speech.

export const CC0_SOUND_PATHS = {
  // Tactile clicks & pops
  clicks: [
    '/sounds/pop-drop-1.wav',
    '/sounds/pop-drop-2.wav',
    '/sounds/pluck-1.wav',
    '/sounds/pluck-2.wav',
  ],
  // Motivating achievement & correct answer chimes
  achievements: [
    '/sounds/success-chime-1.wav',
    '/sounds/achievement-chime-1.mp3',
    '/sounds/success-chime-2.wav',
    '/sounds/magic-sparkle.mp3',
    '/sounds/success-chime-3.wav',
    '/sounds/achievement-chime-2.mp3',
    '/sounds/success-chime-4.wav',
    '/sounds/achievement-chime-3.mp3',
  ],
  // Magical star & bonus sparkles
  sparkles: [
    '/sounds/sparkle-rise-1.wav',
    '/sounds/magic-sparkle.mp3',
    '/sounds/sparkle-rise-2.wav',
    '/sounds/music-box-win.mp3',
  ],
  // Grand level completion & victory celebrations
  victories: [
    '/sounds/victory-jingle.mp3',
    '/sounds/music-box-win.mp3',
  ],
  // Gentle, non-punitive, encouraging try-again cues
  tryAgain: [
    '/sounds/try-again-1.wav',
    '/sounds/cartoon-boing-1.mp3',
    '/sounds/try-again-2.wav',
    '/sounds/soft-oops-1.wav',
    '/sounds/try-again-3.wav',
    '/sounds/cartoon-boing-2.mp3',
    '/sounds/try-again-4.wav',
    '/sounds/soft-oops-2.wav',
  ],
} as const;

type ZzfxParams = (number | undefined)[];

// Curated child-friendly ZzFX presets (warm sine/triangle waves, zero harsh square buzzers)
const ZZFX_PRESETS = {
  pop: [
    [0.45, 0.04, 420, 0.005, 0.02, 0.06, 0, 1, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0.7, 0.01],
    [0.4, 0.04, 540, 0.005, 0.02, 0.05, 1, 1, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0.65, 0.01],
  ] as ZzfxParams[],
  achievement: [
    // Bright rising chime (C5 -> G5)
    [0.6, 0.02, 523.25, 0.01, 0.05, 0.2, 1, 1.1, 0, 0, 261.63, 0.05, 0, 0, 0, 0, 0.04, 0.75, 0.04],
    // Sparkle star coin (D5 -> A5)
    [0.58, 0.02, 587.33, 0.01, 0.06, 0.22, 0, 1.2, 2, 0, 293.66, 0.06, 0, 0, 0, 0, 0.05, 0.8, 0.04],
    // Cheerful double chime (E5 -> B5)
    [0.58, 0.02, 659.25, 0.01, 0.05, 0.24, 1, 1, 4, 0.2, 329.63, 0.06, 0, 0, 0, 0, 0.05, 0.7, 0.05],
  ] as ZzfxParams[],
  sparkle: [
    [0.55, 0.02, 783.99, 0.01, 0.08, 0.25, 0, 1, 12, 0.6, 261.63, 0.06, 0.05, 0, 0, 0, 0.06, 0.8, 0.04],
  ] as ZzfxParams[],
  tryAgain: [
    // Playful gentle cartoon spring bounce (encouraging, non-harsh)
    [0.48, 0.02, 250, 0.01, 0.05, 0.18, 0, 1, 3, 1.2, -45, 0.07, 0, 0, 10, 0, 0, 0.75, 0.03],
    // Soft wooden marimba "uh-oh, try again!"
    [0.45, 0.02, 320, 0.01, 0.04, 0.15, 1, 1, -2, 0, -55, 0.06, 0, 0, 0, 0, 0.03, 0.7, 0.02],
  ] as ZzfxParams[],
};

type ZzfxModule = typeof import('zzfx');

class SoundEffects {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private speechSynth: SpeechSynthesis | null = null;
  private bufferCache: Map<string, AudioBuffer> = new Map();
  private loadingPromises: Map<string, Promise<AudioBuffer | null>> = new Map();
  private preloadStarted: boolean = false;
  private zzfxMod: ZzfxModule | null = null;
  private zzfxLoading: Promise<void> | null = null;
  private lastDirectSpeechTime: number = 0;

  // Counters to cycle smoothly through varied audio profiles
  private clickIndex: number = 0;
  private matchIndex: number = 0;
  private sparkleIndex: number = 0;
  private wrongIndex: number = 0;
  private winIndex: number = 0;

  private praiseWordsAr = [
    'أحسنت!',
    'رائع!',
    'ممتاز!',
    'يا لك من بطل!',
    'إجابة صحيحة!',
    'عظيم!',
    'مبدع!',
  ];
  private praiseWordsEn = [
    'Well done!',
    'Awesome!',
    'Excellent!',
    'Super star!',
    'Great job!',
    'Fantastic!',
    'Amazing!',
  ];

  private tryAgainWordsAr = [
    'حاول مرة أخرى يا بطل!',
    'اقتربت! جرّب خياراً آخر!',
    'لا بأس، أنت تستطيع!',
  ];
  private tryAgainWordsEn = [
    'Nice try! Try again!',
    'Almost there! Pick another one!',
    'You can do it!',
  ];

  private muteListeners: Set<(enabled: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      let saved = localStorage.getItem('taleen_sound_enabled');
      if (saved === null) {
        const legacy = localStorage.getItem('starfall_sound_enabled');
        if (legacy !== null) {
          localStorage.setItem('taleen_sound_enabled', legacy);
          saved = legacy;
        }
      }
      if (saved !== null) {
        this.soundEnabled = saved === 'true';
      }
      if ('speechSynthesis' in window) {
        this.speechSynth = window.speechSynthesis;
      }
    }
  }

  private getActiveLang(): 'ar' | 'en' {
    if (typeof document !== 'undefined' && document.documentElement.lang === 'en') {
      return 'en';
    }
    return 'ar';
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (this.ctx && !this.preloadStarted) {
      this.preloadStarted = true;
      this.preloadAllCC0Sounds();
      this.ensureZzfxLoaded();
    }
    return this.ctx;
  }

  private ensureZzfxLoaded() {
    if (this.zzfxMod || this.zzfxLoading || typeof window === 'undefined') return;
    if (typeof AudioContext === 'undefined' && !(window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext) {
      return;
    }
    this.zzfxLoading = import('zzfx')
      .then((mod) => {
        if (this.ctx) {
          mod.ZZFX.audioContext = this.ctx;
          mod.ZZFX.volume = 0.25;
        }
        this.zzfxMod = mod;
      })
      .catch(() => {
        // Fallback Web Audio synth remains available
      });
  }

  private preloadAllCC0Sounds() {
    if (typeof fetch !== 'function') return;
    const allPaths = [
      ...CC0_SOUND_PATHS.achievements,
      ...CC0_SOUND_PATHS.tryAgain,
      ...CC0_SOUND_PATHS.sparkles,
      ...CC0_SOUND_PATHS.victories,
      ...CC0_SOUND_PATHS.clicks,
    ];
    allPaths.forEach((path) => {
      void this.loadBuffer(path);
    });
  }

  private loadBuffer(path: string): Promise<AudioBuffer | null> {
    if (this.bufferCache.has(path)) {
      return Promise.resolve(this.bufferCache.get(path)!);
    }
    if (this.loadingPromises.has(path)) {
      return this.loadingPromises.get(path)!;
    }
    const ctx = this.ctx;
    if (!ctx || typeof fetch !== 'function') {
      return Promise.resolve(null);
    }

    const promise = fetch(path)
      .then((res) => {
        if (!res.ok) return null;
        return res.arrayBuffer();
      })
      .then((arrayBuffer) => {
        if (!arrayBuffer || !this.ctx) return null;
        return this.ctx.decodeAudioData(arrayBuffer);
      })
      .then((audioBuffer) => {
        if (audioBuffer) {
          this.bufferCache.set(path, audioBuffer);
        }
        return audioBuffer;
      })
      .catch(() => null);

    this.loadingPromises.set(path, promise);
    return promise;
  }

  private playCachedBuffer(path: string, volume: number = 0.45): boolean {
    const ctx = this.getContext();
    if (!ctx) return false;

    const buffer = this.bufferCache.get(path);
    if (!buffer) {
      // Trigger background preload for next time while returning false so instant fallback plays now
      void this.loadBuffer(path);
      return false;
    }

    try {
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);

      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      return true;
    } catch {
      return false;
    }
  }

  private playZzfxPreset(params: ZzfxParams): boolean {
    try {
      if (this.zzfxMod && this.ctx) {
        if (this.zzfxMod.ZZFX.audioContext !== this.ctx) {
          this.zzfxMod.ZZFX.audioContext = this.ctx;
        }
        this.zzfxMod.zzfx(...params);
        return true;
      }
    } catch {
      // Ignore and use built-in Web Audio fallback
    }
    return false;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public onSoundChange(listener: (enabled: boolean) => void): () => void {
    this.muteListeners.add(listener);
    return () => {
      this.muteListeners.delete(listener);
    };
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('taleen_sound_enabled', String(this.soundEnabled));
    }
    if (!this.soundEnabled && this.speechSynth) {
      this.speechSynth.cancel();
    }
    this.muteListeners.forEach((listener) => {
      try {
        listener(this.soundEnabled);
      } catch {
        // Ignore listener errors
      }
    });
    return this.soundEnabled;
  }

  // -------------------------------------------------------------
  // 1. DYNAMIC CLICK & POP VARIATIONS (CC0 Drops/Plucks + ZzFX)
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

      const profile = this.clickIndex;
      this.clickIndex++;

      const cc0Path = CC0_SOUND_PATHS.clicks[profile % CC0_SOUND_PATHS.clicks.length];
      if (this.playCachedBuffer(cc0Path, 0.32)) {
        return;
      }

      const preset = ZZFX_PRESETS.pop[profile % ZZFX_PRESETS.pop.length];
      if (this.playZzfxPreset(preset)) {
        return;
      }

      // Built-in Web Audio synthesis fallback
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const variant = profile % 5;

      if (variant === 0) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.07);
        gain.gain.setValueAtTime(0.22, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      } else if (variant === 1) {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      } else if (variant === 2) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1050, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      } else if (variant === 3) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      } else {
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
  // 2. MOTIVATIONAL ACHIEVEMENT & MATCH VARIATIONS (CC0 + ZzFX + Voice Praise)
  // -------------------------------------------------------------
  public playMatch(withPraiseVoice: boolean = true) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const idx = this.matchIndex;
      this.matchIndex++;

      // Layer 1: Play curated CC0 studio achievement sound (Kenney confirmation / Freesound chime / magic scale)
      const cc0Path = CC0_SOUND_PATHS.achievements[idx % CC0_SOUND_PATHS.achievements.length];
      const playedCC0 = this.playCachedBuffer(cc0Path, 0.48);

      // Layer 2: Subtle ZzFX sparkle accent every 3rd achievement OR full ZzFX/WebAudio fallback if not yet cached
      if (!playedCC0) {
        const preset = ZZFX_PRESETS.achievement[idx % ZZFX_PRESETS.achievement.length];
        if (!this.playZzfxPreset(preset)) {
          this.playSynthMatch(ctx, idx % 5);
        }
      } else if (idx % 3 === 0) {
        // Gentle harmonic shimmer over the CC0 bell
        this.playZzfxPreset(ZZFX_PRESETS.achievement[idx % ZZFX_PRESETS.achievement.length]);
      }

      // Layer 3: Speak motivational praise every 2 matches without interrupting game-specific speech
      if (withPraiseVoice && this.matchIndex % 2 === 0) {
        const triggerTime = Date.now();
        setTimeout(() => {
          // Only speak generic praise if the game didn't already trigger specific speech right after playMatch()
          if (
            this.soundEnabled &&
            this.lastDirectSpeechTime < triggerTime &&
            (!this.speechSynth || !this.speechSynth.speaking)
          ) {
            this.playPraise(this.getActiveLang(), true);
          }
        }, 380);
      }
    } catch {
      // Ignore
    }
  }

  public playAchievement() {
    this.playMatch(true);
  }

  private playSynthMatch(ctx: AudioContext, profile: number) {
    if (profile === 0) {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.24, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.3);
      });
    } else if (profile === 1) {
      const notes = [392.0, 493.88, 587.33, 783.99, 987.77, 1174.66];
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
      const notes = [698.46, 880.0, 1046.5, 1396.91];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.09);
        gain.gain.setValueAtTime(0.26, ctx.currentTime + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.09);
        osc.stop(ctx.currentTime + i * 0.09 + 0.35);
      });
    } else if (profile === 3) {
      const notes = [659.25, 783.99, 987.77, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
        gain.gain.setValueAtTime(0.24, ctx.currentTime + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.07);
        osc.stop(ctx.currentTime + i * 0.07 + 0.28);
      });
    } else {
      const notes = [587.33, 739.99, 880.0, 1174.66];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.24, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.32);
      });
    }
  }

  // -------------------------------------------------------------
  // 3. MAGICAL SPARKLE / STAR COLLECT (CC0 + Glockenspiel)
  // -------------------------------------------------------------
  public playSparkle() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const idx = this.sparkleIndex;
      this.sparkleIndex++;

      const cc0Path = CC0_SOUND_PATHS.sparkles[idx % CC0_SOUND_PATHS.sparkles.length];
      const playedCC0 = this.playCachedBuffer(cc0Path, 0.45);

      if (!playedCC0) {
        if (!this.playZzfxPreset(ZZFX_PRESETS.sparkle[0])) {
          const freqs = [1046.5, 1318.51, 1567.98, 2093.0, 2637.02];
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
        }
      }
    } catch {
      // Ignore
    }
  }

  // -------------------------------------------------------------
  // 4. MOTIVATING, NON-PUNITIVE TRY AGAIN VARIATIONS (CC0 + ZzFX + Gentle Voice)
  // -------------------------------------------------------------
  public playWrong(withGentleEncouragement: boolean = true) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const idx = this.wrongIndex;
      this.wrongIndex++;

      const cc0Path = CC0_SOUND_PATHS.tryAgain[idx % CC0_SOUND_PATHS.tryAgain.length];
      const playedCC0 = this.playCachedBuffer(cc0Path, 0.42);

      if (!playedCC0) {
        const preset = ZZFX_PRESETS.tryAgain[idx % ZZFX_PRESETS.tryAgain.length];
        if (!this.playZzfxPreset(preset)) {
          this.playSynthTryAgain(ctx, idx % 4);
        }
      }

      // Gentle spoken encouragement every 3 misses (never harsh, never interrupts active speech)
      if (withGentleEncouragement && this.wrongIndex % 3 === 0) {
        const triggerTime = Date.now();
        setTimeout(() => {
          if (
            this.soundEnabled &&
            this.lastDirectSpeechTime < triggerTime &&
            (!this.speechSynth || !this.speechSynth.speaking)
          ) {
            this.playTryAgain(this.getActiveLang(), true);
          }
        }, 320);
      }
    } catch {
      // Ignore
    }
  }

  private playSynthTryAgain(ctx: AudioContext, profile: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (profile === 0) {
      // Cartoon Spring Bounce
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
      osc.frequency.exponentialRampToValueAtTime(195, ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);
    } else if (profile === 1) {
      // Gentle "Oops" Slide
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(190, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.16, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    } else if (profile === 2) {
      // Playful Marimba Tap
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    } else {
      // Soft Pillow Tap
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
  }

  // -------------------------------------------------------------
  // 5. GRAND CELEBRATION & VICTORY FANFARES (CC0 Jingle + Applause + Voice)
  // -------------------------------------------------------------
  public playWin() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const idx = this.winIndex;
      this.winIndex++;

      const cc0Path = CC0_SOUND_PATHS.victories[idx % CC0_SOUND_PATHS.victories.length];
      const playedCC0 = this.playCachedBuffer(cc0Path, 0.52);

      if (!playedCC0) {
        this.playSynthWin(ctx, idx % 3);
      } else {
        // Layer festive applause sparkles slightly after the victory jingle begins
        this.synthesizeApplause(ctx, 0.35, 0.45);
      }

      // Spoken Celebration in active UI language
      const triggerTime = Date.now();
      setTimeout(() => {
        if (this.soundEnabled && this.lastDirectSpeechTime < triggerTime) {
          const lang = this.getActiveLang();
          const msg =
            lang === 'ar'
              ? 'أحسنت يا بطل! إنها نتيجة رائعة جداً!'
              : 'Amazing job, superstar! You did it!';
          this.speakInternal(msg, lang);
        }
      }, 750);
    } catch {
      // Ignore
    }
  }

  private playSynthWin(ctx: AudioContext, profile: number) {
    if (profile === 0) {
      const melody = [
        { f: 523.25, t: 0.0, d: 0.12 },
        { f: 659.25, t: 0.12, d: 0.12 },
        { f: 783.99, t: 0.24, d: 0.12 },
        { f: 1046.5, t: 0.36, d: 0.18 },
        { f: 880.0, t: 0.54, d: 0.12 },
        { f: 1046.5, t: 0.66, d: 0.45 },
      ];
      melody.forEach((item) => {
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
      this.synthesizeApplause(ctx, 0.4, 0.4);
    } else if (profile === 1) {
      const melody = [
        { f: 392.0, t: 0.0, d: 0.12 },
        { f: 523.25, t: 0.12, d: 0.12 },
        { f: 659.25, t: 0.24, d: 0.12 },
        { f: 783.99, t: 0.36, d: 0.15 },
        { f: 1046.5, t: 0.52, d: 0.5 },
      ];
      melody.forEach((item) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, ctx.currentTime + item.t);
        gain.gain.setValueAtTime(0.28, ctx.currentTime + item.t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + item.t + item.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + item.t);
        osc.stop(ctx.currentTime + item.t + item.d);
      });
      this.synthesizeApplause(ctx, 0.5, 0.4);
    } else {
      const melody = [
        { f: 587.33, t: 0.0, d: 0.1 },
        { f: 739.99, t: 0.1, d: 0.1 },
        { f: 880.0, t: 0.2, d: 0.1 },
        { f: 1174.66, t: 0.3, d: 0.2 },
        { f: 1046.5, t: 0.52, d: 0.45 },
      ];
      melody.forEach((item) => {
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
      noiseGain.gain.setValueAtTime(0.11, ctx.currentTime + delaySec);
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
  // 6. RANDOM MOTIVATIONAL VOICE PRAISE & TRY-AGAIN ENCOURAGEMENT
  // -------------------------------------------------------------
  public playPraise(lang: 'ar' | 'en' = 'ar', internal: boolean = false) {
    if (!this.soundEnabled || !this.speechSynth) return;

    try {
      const phrases = lang === 'ar' ? this.praiseWordsAr : this.praiseWordsEn;
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      if (internal) {
        this.speakInternal(randomPhrase, lang);
      } else {
        this.speakText(randomPhrase, lang);
      }
    } catch {
      // Ignore
    }
  }

  public playTryAgain(lang: 'ar' | 'en' = 'ar', internal: boolean = false) {
    if (!this.soundEnabled || !this.speechSynth) return;

    try {
      const phrases = lang === 'ar' ? this.tryAgainWordsAr : this.tryAgainWordsEn;
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      if (internal) {
        this.speakInternal(randomPhrase, lang);
      } else {
        this.speakText(randomPhrase, lang);
      }
    } catch {
      // Ignore
    }
  }

  // -------------------------------------------------------------
  // 7. SPEECH SYNTHESIS FOR VOCABULARY & LETTERS
  // -------------------------------------------------------------
  private selectPreferredVoice(lang: 'ar' | 'en'): SpeechSynthesisVoice | null {
    if (!this.speechSynth || typeof this.speechSynth.getVoices !== 'function') return null;
    try {
      const voices = this.speechSynth.getVoices();
      if (!voices || voices.length === 0) return null;

      if (lang === 'ar') {
        return (
          voices.find((v) => v.lang.toLowerCase() === 'ar-sa') ||
          voices.find((v) => v.lang.toLowerCase() === 'ar-eg') ||
          voices.find((v) => v.lang.toLowerCase().startsWith('ar')) ||
          null
        );
      }

      return (
        voices.find((v) => v.lang.toLowerCase() === 'en-us') ||
        voices.find((v) => v.lang.toLowerCase() === 'en-gb') ||
        voices.find((v) => v.lang.toLowerCase().startsWith('en')) ||
        null
      );
    } catch {
      return null;
    }
  }

  private speakInternal(text: string, lang: 'ar' | 'en' = 'ar') {
    if (!this.soundEnabled || !this.speechSynth || typeof SpeechSynthesisUtterance === 'undefined') return;

    try {
      this.speechSynth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      const preferredVoice = this.selectPreferredVoice(lang);
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      utterance.rate = 0.9;
      utterance.pitch = 1.15;

      this.speechSynth.speak(utterance);
    } catch {
      // Ignore
    }
  }

  public stopSpeech() {
    try {
      this.speechSynth?.cancel();
    } catch {
      // Ignore
    }
  }

  public speakText(text: string, lang: 'ar' | 'en' = 'ar') {
    this.lastDirectSpeechTime = Date.now();
    this.speakInternal(text, lang);
  }
}

export const sound = new SoundEffects();
