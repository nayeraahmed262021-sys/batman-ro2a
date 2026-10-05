/**
 * Interactive Audio Engine for Batman & Ro2a Website.
 * Generates beautiful, recognizable synthesized melodies and ambient soundscapes
 * using the Web Audio API with robust iOS/Safari/Android unlocking and rich acoustics.
 */

export type TrackId =
  | 'audio-happy-birthday'
  | 'audio-childhood'
  | 'audio-batman'
  | 'audio-spacetoon'
  | 'audio-chaos'
  | 'audio-tul8te'
  | 'audio-perfect'
  | 'audio-nokia'
  | 'audio-fi-yom-w-leila';

export interface TrackMeta {
  id: TrackId;
  title: string;
  subtitle: string;
}

export const TRACKS: Record<TrackId, TrackMeta> = {
  'audio-happy-birthday': {
    id: 'audio-happy-birthday',
    title: 'Happy Birthday (نغمة هادية 15 ث)',
    subtitle: 'صندوق موسيقي هادي وبيانو دافي عشانك'
  },
  'audio-childhood': {
    id: 'audio-childhood',
    title: 'أغنية الطفولة',
    subtitle: 'نوستالجيا وصندوق موسيقي يرجعنا لأيام زمان'
  },
  'audio-batman': {
    id: 'audio-batman',
    title: 'ضوء لمع وسط المدينة (تراك باتمان)',
    subtitle: 'نغمات دارك نايت وسينماتيك هادية'
  },
  'audio-spacetoon': {
    id: 'audio-spacetoon',
    title: 'أبطال الديجيتال - سبيستون',
    subtitle: 'ذكريات الطفولة وبطلك المفضل'
  },
  'audio-chaos': {
    id: 'audio-chaos',
    title: 'عليا النعمة بحبك عليا النعمة بدوب (20 ث) 💃🔥',
    subtitle: 'فقرة الهبل والبهجة والمولد'
  },
  'audio-tul8te': {
    id: 'audio-tul8te',
    title: 'أغاني Tul8te — تفاصيل اللحظات',
    subtitle: 'إيقاع هادي وكلام بنوصف بيه حالنا'
  },
  'audio-perfect': {
    id: 'audio-perfect',
    title: 'Perfect — Ed Sheeran (من أول I found a love) 🎶',
    subtitle: 'الأغنية اللي كان نفسي نرقص عليها في فرحنا'
  },
  'audio-nokia': {
    id: 'audio-nokia',
    title: 'رنة نوكيا 3310 الكلاسيكية 📱',
    subtitle: 'نغمة المونوفونيك الشهيرة من زمن الألفينات'
  },
  'audio-fi-yom-w-leila': {
    id: 'audio-fi-yom-w-leila',
    title: 'في يوم وليلة — وردة (خدنا حلاوة الحب كله) 🎶',
    subtitle: 'الكلام على طول بدون مقدمة طويلة'
  }
};

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isUnlocked: boolean = false;
  private currentTrackId: TrackId | null = null;
  private isPlaying: boolean = false;
  private intervalTimer: number | null = null;
  private timeoutTimer: number | null = null;
  private activeNodes: (AudioNode | OscillatorNode)[] = [];
  private onStateChangeCallbacks: ((state: { isPlaying: boolean; trackId: TrackId | null; title: string }) => void)[] = [];

  constructor() {
    this.setupGlobalUnlock();
  }

  private setupGlobalUnlock() {
    if (typeof window === 'undefined') return;
    const unlockHandler = () => {
      this.unlock();
    };
    ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'].forEach(evt => {
      window.addEventListener(evt, unlockHandler, { once: true, passive: true });
    });
  }

  public async unlock(): Promise<AudioContext | null> {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      if (!this.masterGain && this.ctx) {
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.9, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx && !this.isUnlocked) {
        // Industry-standard iOS Web Audio unlocker (silent 1-sample buffer)
        const buffer = this.ctx.createBuffer(1, 1, 22050);
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.ctx.destination);
        source.start(0);
        this.isUnlocked = true;
      }
      return this.ctx;
    } catch (e) {
      console.warn('Audio unlock warning:', e);
      return null;
    }
  }

  public subscribe(cb: (state: { isPlaying: boolean; trackId: TrackId | null; title: string }) => void) {
    this.onStateChangeCallbacks.push(cb);
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter(c => c !== cb);
    };
  }

  private notify() {
    const meta = this.currentTrackId ? TRACKS[this.currentTrackId] : null;
    const data = {
      isPlaying: this.isPlaying,
      trackId: this.currentTrackId,
      title: meta ? meta.title : 'الموسيقى: متوقفة'
    };
    this.onStateChangeCallbacks.forEach(cb => cb(data));
  }

  public async playTrack(trackId: TrackId) {
    await this.unlock();

    // If already playing the same track, toggle pause
    if (this.isPlaying && this.currentTrackId === trackId) {
      this.stop();
      return;
    }

    this.stopInternal();
    this.currentTrackId = trackId;
    this.isPlaying = true;
    this.notify();

    if (!this.ctx) return;
    const startTime = this.ctx.currentTime + 0.08; // Safe future scheduling offset

    switch (trackId) {
      case 'audio-happy-birthday':
        this.playHappyBirthday(startTime);
        break;
      case 'audio-childhood':
        this.playChildhoodLullaby(startTime);
        break;
      case 'audio-batman':
        this.playBatmanTheme(startTime);
        break;
      case 'audio-spacetoon':
        this.playSpacetoonTheme(startTime);
        break;
      case 'audio-chaos':
        this.playChaosBeat(startTime);
        break;
      case 'audio-tul8te':
        this.playTul8teChill(startTime);
        break;
      case 'audio-perfect':
        this.playPerfectWaltz(startTime);
        break;
      case 'audio-nokia':
        this.playNokiaTune(startTime);
        break;
      case 'audio-fi-yom-w-leila':
        this.playFiYomWLeila(startTime);
        break;
    }
  }

  public stop() {
    this.stopInternal();
    this.currentTrackId = null;
    this.isPlaying = false;
    this.notify();
  }

  private stopInternal() {
    if (this.intervalTimer !== null) {
      window.clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
    if (this.timeoutTimer !== null) {
      window.clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    this.activeNodes.forEach(node => {
      try {
        if ('stop' in node && typeof (node as OscillatorNode).stop === 'function') {
          (node as OscillatorNode).stop();
        }
        node.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
  }

  public testSound() {
    this.unlock().then(() => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime + 0.05;
      this.playMusicBoxNote(523.25, 0.4, 0.00, 0.45, t); // C5
      this.playMusicBoxNote(659.25, 0.4, 0.15, 0.45, t); // E5
      this.playMusicBoxNote(783.99, 0.6, 0.30, 0.50, t); // G5
    });
  }

  private playTone(
    freq: number,
    type: OscillatorType,
    duration: number,
    delay: number,
    volume: number = 0.35,
    baseTime?: number
  ) {
    if (!this.ctx || !this.masterGain) return;
    const now = (baseTime ?? (this.ctx.currentTime + 0.05)) + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    // Warm, clear envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.05);

    this.activeNodes.push(osc, gain);
  }

  private playMusicBoxNote(
    freq: number,
    duration: number,
    delay: number,
    volume: number = 0.40,
    baseTime?: number
  ) {
    if (!this.ctx || !this.masterGain) return;
    const now = (baseTime ?? (this.ctx.currentTime + 0.05)) + delay;

    // 1. Fundamental warm bell-like sine
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.linearRampToValueAtTime(volume, now + 0.025);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(now);
    osc1.stop(now + duration + 0.05);

    // 2. Music-box overtone shimmer
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.linearRampToValueAtTime(volume * 0.35, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.6));

    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(now);
    osc2.stop(now + duration + 0.05);

    // 3. Body warmth
    const osc3 = this.ctx.createOscillator();
    const gain3 = this.ctx.createGain();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(freq * 0.5, now);

    gain3.gain.setValueAtTime(0.0001, now);
    gain3.gain.linearRampToValueAtTime(volume * 0.3, now + 0.03);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.85));

    osc3.connect(gain3);
    gain3.connect(this.masterGain);
    osc3.start(now);
    osc3.stop(now + duration + 0.05);

    this.activeNodes.push(osc1, gain1, osc2, gain2, osc3, gain3);
  }

  // 1. Happy Birthday (Finishes in under 15 seconds)
  private playHappyBirthday(startTime: number) {
    const notes = [
      // Phrase 1 (Happy birthday to you)
      { f: 261.63, d: 0.32, t: 0.00 },
      { f: 261.63, d: 0.32, t: 0.38 },
      { f: 293.66, d: 0.65, t: 0.76 },
      { f: 261.63, d: 0.65, t: 1.45 },
      { f: 349.23, d: 0.65, t: 2.15 },
      { f: 329.63, d: 1.05, t: 2.85 },

      // Phrase 2 (Happy birthday to you)
      { f: 261.63, d: 0.32, t: 4.05 },
      { f: 261.63, d: 0.32, t: 4.43 },
      { f: 293.66, d: 0.65, t: 4.81 },
      { f: 261.63, d: 0.65, t: 5.50 },
      { f: 392.00, d: 0.65, t: 6.20 },
      { f: 349.23, d: 1.05, t: 6.90 },

      // Phrase 3 (Happy birthday dear Batman)
      { f: 261.63, d: 0.32, t: 8.10 },
      { f: 261.63, d: 0.32, t: 8.48 },
      { f: 523.25, d: 0.75, t: 8.86 },
      { f: 440.00, d: 0.70, t: 9.65 },
      { f: 349.23, d: 0.60, t: 10.40 },
      { f: 329.63, d: 0.60, t: 11.05 },
      { f: 293.66, d: 0.85, t: 11.70 },

      // Phrase 4 (Happy birthday to you)
      { f: 466.16, d: 0.32, t: 12.65 },
      { f: 466.16, d: 0.32, t: 13.00 },
      { f: 440.00, d: 0.65, t: 13.35 },
      { f: 349.23, d: 0.60, t: 14.05 },
      { f: 392.00, d: 0.60, t: 14.70 },
      { f: 349.23, d: 1.20, t: 15.35 }
    ];

    const chords = [
      { f: 130.81, d: 1.4, t: 0.76 },
      { f: 196.00, d: 1.5, t: 2.15 },
      { f: 130.81, d: 1.4, t: 4.81 },
      { f: 174.61, d: 1.5, t: 6.20 },
      { f: 130.81, d: 1.6, t: 8.86 },
      { f: 174.61, d: 1.4, t: 10.40 },
      { f: 196.00, d: 1.5, t: 13.35 },
      { f: 174.61, d: 2.0, t: 14.05 }
    ];

    const speedRatio = 0.88;
    notes.forEach(n => {
      this.playMusicBoxNote(n.f, n.d * speedRatio, n.t * speedRatio, 0.42, startTime);
    });
    chords.forEach(c => {
      this.playTone(c.f, 'triangle', c.d * speedRatio, c.t * speedRatio, 0.25, startTime);
    });

    this.timeoutTimer = window.setTimeout(() => {
      this.stop();
    }, 14800);
  }

  // 2. Childhood Lullaby
  private playChildhoodLullaby(startTime: number) {
    const melody = [
      { f: 392.00, d: 0.8, t: 0 },
      { f: 440.00, d: 0.8, t: 0.7 },
      { f: 523.25, d: 1.0, t: 1.4 },
      { f: 659.25, d: 1.4, t: 2.3 },
      { f: 587.33, d: 1.0, t: 3.8 },
      { f: 523.25, d: 1.4, t: 4.8 },
      { f: 440.00, d: 1.0, t: 6.2 },
      { f: 392.00, d: 1.6, t: 7.2 }
    ];
    const playRound = (t: number) => {
      melody.forEach(m => {
        this.playMusicBoxNote(m.f, m.d, m.t, 0.45, t);
        this.playTone(m.f * 0.5, 'sine', m.d * 1.2, m.t, 0.20, t);
      });
    };
    playRound(startTime);
    this.intervalTimer = window.setInterval(() => {
      if (this.ctx) playRound(this.ctx.currentTime + 0.05);
    }, 9000);
  }

  // 3. Batman Theme (ضوء لمع وسط المدينة)
  private playBatmanTheme(startTime: number) {
    // Powerful, iconic Spacetoon Batman melody:
    // "Dooo' lama3a wasata al madina... rasama nida'an li munadina... bat-man!"
    const sequence = [
      // "Dooo' lama3a wasat"
      { f: 146.83, d: 0.45, t: 0.00 }, // D3
      { f: 174.61, d: 0.40, t: 0.45 }, // F3
      { f: 220.00, d: 0.50, t: 0.90 }, // A3
      { f: 196.00, d: 0.40, t: 1.45 }, // G3
      { f: 174.61, d: 0.60, t: 1.90 }, // F3
      // "al-madina"
      { f: 164.81, d: 0.45, t: 2.60 }, // E3
      { f: 146.83, d: 0.90, t: 3.10 }, // D3

      // "Rasama nida'an li-munadina"
      { f: 146.83, d: 0.45, t: 4.20 }, // D3
      { f: 174.61, d: 0.40, t: 4.65 }, // F3
      { f: 220.00, d: 0.50, t: 5.10 }, // A3
      { f: 261.63, d: 0.50, t: 5.65 }, // C4
      { f: 246.94, d: 0.45, t: 6.20 }, // B3
      { f: 220.00, d: 0.90, t: 6.70 }, // A3

      // "Tilka isharatu Batman!"
      { f: 196.00, d: 0.40, t: 7.80 }, // G3
      { f: 220.00, d: 0.40, t: 8.25 }, // A3
      { f: 246.94, d: 0.45, t: 8.70 }, // B3
      { f: 293.66, d: 1.10, t: 9.20 }, // D4 (BATMAN!)
      { f: 146.83, d: 1.40, t: 10.40 } // Low D3 resolving
    ];

    const playRound = (t: number) => {
      sequence.forEach(s => {
        // Heroic brass lead
        this.playTone(s.f, 'sawtooth', s.d, s.t, 0.35, t);
        this.playTone(s.f * 2, 'square', s.d * 0.7, s.t, 0.12, t);
        // Cinematic sub-pulse
        this.playTone(s.f * 0.5, 'triangle', s.d * 1.2, s.t, 0.28, t);
      });
    };

    playRound(startTime);
    this.intervalTimer = window.setInterval(() => {
      if (this.ctx) playRound(this.ctx.currentTime + 0.05);
    }, 12500);
  }

  // 4. Digimon Spacetoon Theme (أبطال الديجيتال)
  private playSpacetoonTheme(startTime: number) {
    // Spacetoon Digimon upbeat adventures:
    // "Fi fada'in akram... abtalun yatahadon al-khatar"
    const notes = [
      { f: 329.63, d: 0.30, t: 0.00 }, // E4
      { f: 392.00, d: 0.30, t: 0.30 }, // G4
      { f: 440.00, d: 0.35, t: 0.60 }, // A4
      { f: 493.88, d: 0.35, t: 0.95 }, // B4
      { f: 587.33, d: 0.45, t: 1.30 }, // D5
      { f: 523.25, d: 0.35, t: 1.75 }, // C5
      { f: 440.00, d: 0.55, t: 2.10 }, // A4
      { f: 493.88, d: 0.85, t: 2.70 }, // B4

      { f: 587.33, d: 0.35, t: 3.70 }, // D5
      { f: 659.25, d: 0.35, t: 4.10 }, // E5
      { f: 587.33, d: 0.40, t: 4.50 }, // D5
      { f: 493.88, d: 0.40, t: 4.95 }, // B4
      { f: 440.00, d: 1.10, t: 5.40 }  // A4
    ];

    const playRound = (t: number) => {
      notes.forEach(n => {
        this.playTone(n.f, 'square', n.d, n.t, 0.28, t);
        this.playTone(n.f * 0.5, 'triangle', n.d * 1.1, n.t, 0.32, t);
        this.playTone(n.f * 2, 'sine', n.d * 0.5, n.t, 0.15, t);
      });
    };

    playRound(startTime);
    this.intervalTimer = window.setInterval(() => {
      if (this.ctx) playRound(this.ctx.currentTime + 0.05);
    }, 7000);
  }

  // 5. Chaos Shaabi Beat (عليا النعمة بحبك عليا النعمة بدوب - 20 ث)
  private playChaosBeat(startTime: number) {
    let step = 0;
    const baseInterval = 230;

    this.intervalTimer = window.setInterval(() => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime + 0.02;
      const beat = step % 8;

      // Baladi / Shaabi rhythm: DUM - TAK - TAK
      if (beat === 0) {
        // Deep Tabla Dum
        this.playTone(75, 'sine', 0.25, 0, 0.55, t);
        this.playTone(150, 'triangle', 0.15, 0, 0.30, t);
      } else if (beat === 3 || beat === 6) {
        // Sharp Tabla Tak
        this.playTone(380, 'triangle', 0.10, 0, 0.40, t);
        this.playTone(750, 'square', 0.05, 0, 0.20, t);
      }

      // Playful Mizmar lead synth
      const mizmarScale = [440, 466.16, 523.25, 554.37, 523.25, 466.16, 440, 392];
      this.playTone(mizmarScale[step % mizmarScale.length], 'sawtooth', 0.18, 0.01, 0.25, t);

      step++;
    }, baseInterval);

    this.timeoutTimer = window.setTimeout(() => {
      if (this.currentTrackId === 'audio-chaos') {
        this.stop();
      }
    }, 20000);
  }

  // 6. Tul8te Chill
  private playTul8teChill(startTime: number) {
    const chords = [
      [220, 277.18, 329.63, 415.30],
      [174.61, 220, 261.63, 329.63],
      [196, 246.94, 293.66, 369.99],
      [146.83, 185, 220, 277.18]
    ];
    let chordIndex = 0;
    const playChord = (t: number) => {
      const current = chords[chordIndex % chords.length];
      current.forEach(f => {
        this.playTone(f, 'sine', 2.6, 0, 0.25, t);
        this.playTone(f * 2, 'triangle', 2.0, 0.04, 0.10, t);
      });
      this.playTone(current[0] * 0.5, 'sine', 2.6, 0, 0.35, t);
      chordIndex++;
    };
    playChord(startTime);
    this.intervalTimer = window.setInterval(() => {
      if (this.ctx) playChord(this.ctx.currentTime + 0.05);
    }, 3000);
  }

  // 7. Perfect - Ed Sheeran
  private playPerfectWaltz(startTime: number) {
    const vocalNotes = [
      { f: 196.00, d: 0.28, t: 0.00 },
      { f: 196.00, d: 0.28, t: 0.35 },
      { f: 196.00, d: 0.28, t: 0.70 },
      { f: 196.00, d: 0.35, t: 1.05 },
      { f: 220.00, d: 0.35, t: 1.45 },
      { f: 246.94, d: 1.10, t: 1.85 },

      { f: 196.00, d: 0.28, t: 3.20 },
      { f: 196.00, d: 0.28, t: 3.55 },
      { f: 196.00, d: 0.28, t: 3.90 },
      { f: 220.00, d: 0.35, t: 4.25 },
      { f: 246.94, d: 0.35, t: 4.65 },
      { f: 261.63, d: 0.55, t: 5.05 },

      { f: 246.94, d: 0.28, t: 5.75 },
      { f: 220.00, d: 0.28, t: 6.05 },
      { f: 196.00, d: 0.35, t: 6.40 },
      { f: 220.00, d: 0.35, t: 6.80 },
      { f: 246.94, d: 1.20, t: 7.20 }
    ];

    const guitarChords = [
      { f: 98.00, d: 2.8, t: 0.00 },
      { f: 82.41, d: 2.8, t: 3.20 },
      { f: 65.41, d: 2.8, t: 5.75 },
      { f: 73.42, d: 2.8, t: 7.20 }
    ];

    const playRound = (t: number) => {
      vocalNotes.forEach(n => {
        this.playMusicBoxNote(n.f, n.d, n.t, 0.45, t);
        this.playTone(n.f * 2, 'triangle', n.d * 0.7, n.t, 0.12, t);
      });
      guitarChords.forEach(c => {
        this.playTone(c.f, 'triangle', c.d, c.t, 0.25, t);
        this.playTone(c.f * 1.5, 'sine', c.d * 0.8, c.t + 0.1, 0.18, t);
      });
    };

    playRound(startTime);
    this.intervalTimer = window.setInterval(() => {
      if (this.ctx) playRound(this.ctx.currentTime + 0.05);
    }, 10000);
  }

  // 8. Fi Yom W Leila - Warda (خدنا حلاوة الحب كله)
  private playFiYomWLeila(startTime: number) {
    const notes = [
      // "Fi yom w leila"
      { f: 261.63, d: 0.35, t: 0.00 }, // Fi
      { f: 293.66, d: 0.40, t: 0.40 }, // yom
      { f: 329.63, d: 0.40, t: 0.85 }, // w
      { f: 349.23, d: 0.50, t: 1.30 }, // lei-
      { f: 392.00, d: 1.10, t: 1.85 }, // la

      // "khedna halawet el hob kollo"
      { f: 392.00, d: 0.35, t: 3.10 }, // khed-
      { f: 440.00, d: 0.40, t: 3.50 }, // na
      { f: 392.00, d: 0.35, t: 3.95 }, // ha-
      { f: 349.23, d: 0.35, t: 4.35 }, // la-
      { f: 329.63, d: 0.45, t: 4.75 }, // wet
      { f: 293.66, d: 0.35, t: 5.25 }, // el
      { f: 329.63, d: 0.50, t: 5.65 }, // hob
      { f: 349.23, d: 0.45, t: 6.20 }, // kol-
      { f: 329.63, d: 0.70, t: 6.70 }, // lo

      // "fi yom w leila"
      { f: 293.66, d: 0.35, t: 7.55 }, // fi
      { f: 261.63, d: 0.40, t: 7.95 }, // yom
      { f: 293.66, d: 0.45, t: 8.40 }, // w
      { f: 261.63, d: 1.40, t: 8.90 }, // lei-la

      // "w bein yom w leila"
      { f: 261.63, d: 0.35, t: 10.60 },
      { f: 293.66, d: 0.35, t: 11.00 },
      { f: 329.63, d: 0.40, t: 11.40 },
      { f: 349.23, d: 0.45, t: 11.85 },
      { f: 392.00, d: 1.10, t: 12.35 },

      // "dawwa'na halawet el hob kollo"
      { f: 392.00, d: 0.35, t: 13.60 },
      { f: 440.00, d: 0.40, t: 14.00 },
      { f: 392.00, d: 0.35, t: 14.45 },
      { f: 349.23, d: 0.35, t: 14.85 },
      { f: 329.63, d: 0.45, t: 15.25 },
      { f: 293.66, d: 0.35, t: 15.75 },
      { f: 349.23, d: 0.45, t: 16.15 },
      { f: 329.63, d: 0.70, t: 16.65 },

      // "fi yom w leila"
      { f: 293.66, d: 0.35, t: 17.50 },
      { f: 261.63, d: 0.40, t: 17.90 },
      { f: 293.66, d: 0.45, t: 18.35 },
      { f: 261.63, d: 1.50, t: 18.85 }
    ];

    const chords = [
      { f: 130.81, d: 2.2, t: 0.00 },
      { f: 196.00, d: 2.5, t: 1.85 },
      { f: 174.61, d: 2.5, t: 4.75 },
      { f: 130.81, d: 2.5, t: 7.55 },
      { f: 130.81, d: 2.0, t: 10.60 },
      { f: 196.00, d: 2.5, t: 12.35 },
      { f: 174.61, d: 2.5, t: 15.25 },
      { f: 130.81, d: 2.5, t: 17.50 }
    ];

    const playRound = (t: number) => {
      notes.forEach(n => {
        this.playTone(n.f, 'triangle', n.d, n.t, 0.38, t);
        this.playMusicBoxNote(n.f * 2, n.d * 0.8, n.t + 0.01, 0.22, t);
      });
      chords.forEach(c => {
        this.playTone(c.f, 'sine', c.d, c.t, 0.26, t);
      });
    };

    playRound(startTime);
    this.intervalTimer = window.setInterval(() => {
      if (this.ctx) playRound(this.ctx.currentTime + 0.05);
    }, 21500);
  }

  // 9. Nokia 3310 Monophonic Tune
  private playNokiaTune(startTime: number) {
    const notes = [
      { f: 659.25, d: 0.16, t: 0.00 },
      { f: 587.33, d: 0.16, t: 0.18 },
      { f: 369.99, d: 0.32, t: 0.36 },
      { f: 415.30, d: 0.32, t: 0.72 },
      { f: 554.37, d: 0.16, t: 1.08 },
      { f: 493.88, d: 0.16, t: 1.26 },
      { f: 293.66, d: 0.32, t: 1.44 },
      { f: 329.63, d: 0.32, t: 1.80 },
      { f: 493.88, d: 0.16, t: 2.16 },
      { f: 440.00, d: 0.16, t: 2.34 },
      { f: 277.18, d: 0.32, t: 2.52 },
      { f: 329.63, d: 0.32, t: 2.88 },
      { f: 440.00, d: 0.75, t: 3.24 }
    ];

    notes.forEach(n => {
      this.playTone(n.f, 'square', n.d, n.t, 0.30, startTime);
    });

    this.timeoutTimer = window.setTimeout(() => {
      this.stop();
    }, 4500);
  }
}

export const audioEngine = new AudioEngine();
