/**
 * Interactive Audio Engine for Batman & Ro2a Website.
 * Generates beautiful, recognizable synthesized melodies and ambient soundscapes
 * using the Web Audio API, so it works seamlessly in any browser environment without missing assets!
 */

type TrackId =
  | 'audio-happy-birthday'
  | 'audio-childhood'
  | 'audio-batman'
  | 'audio-spacetoon'
  | 'audio-chaos'
  | 'audio-tul8te'
  | 'audio-perfect'
  | 'audio-nokia'
  | 'audio-fi-yom-w-leila';

interface TrackMeta {
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
  private currentTrackId: TrackId | null = null;
  private isPlaying: boolean = false;
  private intervalTimer: number | null = null;
  private activeNodes: (AudioNode | OscillatorNode)[] = [];
  private onStateChangeCallbacks: ((state: { isPlaying: boolean; trackId: TrackId | null; title: string }) => void)[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
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

  public playTrack(trackId: TrackId) {
    this.initContext();

    // If already playing the same track, toggle pause
    if (this.isPlaying && this.currentTrackId === trackId) {
      this.stop();
      return;
    }

    this.stopInternal();
    this.currentTrackId = trackId;
    this.isPlaying = true;
    this.notify();

    switch (trackId) {
      case 'audio-happy-birthday':
        this.playHappyBirthday();
        break;
      case 'audio-childhood':
        this.playChildhoodLullaby();
        break;
      case 'audio-batman':
        this.playBatmanTheme();
        break;
      case 'audio-spacetoon':
        this.playSpacetoonTheme();
        break;
      case 'audio-chaos':
        this.playChaosBeat();
        break;
      case 'audio-tul8te':
        this.playTul8teChill();
        break;
      case 'audio-perfect':
        this.playPerfectWaltz();
        break;
      case 'audio-nokia':
        this.playNokiaTune();
        break;
      case 'audio-fi-yom-w-leila':
        this.playFiYomWLeila();
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

  private playTone(freq: number, type: OscillatorType, duration: number, delay: number, volume: number = 0.15) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    // Warm envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);

    this.activeNodes.push(osc, gain);
  }

  private playMusicBoxNote(freq: number, duration: number, delay: number, volume: number = 0.16) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime + delay;

    // 1. Fundamental warm bell-like sine
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.linearRampToValueAtTime(volume, now + 0.025);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + duration + 0.05);

    // 2. Music-box overtone shimmer (gentle higher harmonic)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.linearRampToValueAtTime(volume * 0.3, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.6));

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now);
    osc2.stop(now + duration + 0.05);

    // 3. Soft sub-bass warm body
    const osc3 = this.ctx.createOscillator();
    const gain3 = this.ctx.createGain();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(freq * 0.5, now);

    gain3.gain.setValueAtTime(0.0001, now);
    gain3.gain.linearRampToValueAtTime(volume * 0.25, now + 0.03);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.85));

    osc3.connect(gain3);
    gain3.connect(this.ctx.destination);
    osc3.start(now);
    osc3.stop(now + duration + 0.05);

    this.activeNodes.push(osc1, gain1, osc2, gain2, osc3, gain3);
  }

  // Melodic tracks
  private playHappyBirthday() {
    // Calm, gentle music-box Happy Birthday melody tailored to finish under 15 seconds (~14.5s)
    const notes = [
      // Phrase 1 (Happy birthday to you)
      { f: 261.63, d: 0.32, t: 0.00 }, // C4
      { f: 261.63, d: 0.32, t: 0.38 }, // C4
      { f: 293.66, d: 0.65, t: 0.76 }, // D4
      { f: 261.63, d: 0.65, t: 1.45 }, // C4
      { f: 349.23, d: 0.65, t: 2.15 }, // F4
      { f: 329.63, d: 1.05, t: 2.85 }, // E4

      // Phrase 2 (Happy birthday to you)
      { f: 261.63, d: 0.32, t: 4.05 }, // C4
      { f: 261.63, d: 0.32, t: 4.43 }, // C4
      { f: 293.66, d: 0.65, t: 4.81 }, // D4
      { f: 261.63, d: 0.65, t: 5.50 }, // C4
      { f: 392.00, d: 0.65, t: 6.20 }, // G4
      { f: 349.23, d: 1.05, t: 6.90 }, // F4

      // Phrase 3 (Happy birthday dear Batman)
      { f: 261.63, d: 0.32, t: 8.10 }, // C4
      { f: 261.63, d: 0.32, t: 8.48 }, // C4
      { f: 523.25, d: 0.75, t: 8.86 }, // C5
      { f: 440.00, d: 0.70, t: 9.65 }, // A4
      { f: 349.23, d: 0.60, t: 10.40 }, // F4
      { f: 329.63, d: 0.60, t: 11.05 }, // E4
      { f: 293.66, d: 0.85, t: 11.70 }, // D4

      // Phrase 4 (Happy birthday to you)
      { f: 466.16, d: 0.32, t: 12.65 }, // Bb4
      { f: 466.16, d: 0.32, t: 13.00 }, // Bb4
      { f: 440.00, d: 0.65, t: 13.35 }, // A4
      { f: 349.23, d: 0.60, t: 14.05 }, // F4
      { f: 392.00, d: 0.60, t: 14.70 }, // G4
      { f: 349.23, d: 1.20, t: 15.35 }  // F4
    ];

    // Harmony chords to add warmth
    const chords = [
      { f: 130.81, d: 1.4, t: 0.76 },  // C3
      { f: 196.00, d: 1.5, t: 2.15 },  // G3
      { f: 130.81, d: 1.4, t: 4.81 },  // C3
      { f: 174.61, d: 1.5, t: 6.20 },  // F3
      { f: 130.81, d: 1.6, t: 8.86 },  // C3
      { f: 174.61, d: 1.4, t: 10.40 }, // F3
      { f: 196.00, d: 1.5, t: 13.35 }, // G3
      { f: 174.61, d: 2.0, t: 14.05 }  // F3
    ];

    // Play melody with music box chimes scaled to finish in exactly ~14.5 seconds
    const speedRatio = 0.88; // Scales timings so the whole song finishes comfortably under 15 seconds
    notes.forEach(n => {
      this.playMusicBoxNote(n.f, n.d * speedRatio, n.t * speedRatio, 0.17);
    });
    chords.forEach(c => {
      this.playTone(c.f, 'triangle', c.d * speedRatio, c.t * speedRatio, 0.08);
    });

    // Auto-stop precisely at 14.8 seconds (under 15s limit)
    this.intervalTimer = window.setTimeout(() => {
      this.stop();
    }, 14800);
  }

  private playChildhoodLullaby() {
    // Nostalgic music box / celesta
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
    const loop = () => {
      melody.forEach(m => {
        this.playTone(m.f, 'sine', m.d, m.t, 0.18);
        this.playTone(m.f * 2, 'triangle', m.d * 0.5, m.t + 0.02, 0.06);
      });
    };
    loop();
    this.intervalTimer = window.setInterval(loop, 9000);
  }

  private playBatmanTheme() {
    // Hans Zimmer / Dark Knight pulse & heroic brass chord
    const sequence = [
      { f: 110.00, d: 0.3, t: 0.0 }, // A2
      { f: 110.00, d: 0.3, t: 0.3 },
      { f: 116.54, d: 0.3, t: 0.6 }, // Bb2
      { f: 110.00, d: 0.4, t: 0.9 },
      { f: 130.81, d: 0.6, t: 1.3 }, // C3
      { f: 116.54, d: 0.5, t: 2.0 },
      { f: 98.00, d: 0.8, t: 2.6 },  // G2
      { f: 110.00, d: 1.2, t: 3.5 }, // A2 long
    ];
    const loop = () => {
      sequence.forEach(s => {
        this.playTone(s.f, 'sawtooth', s.d, s.t, 0.12);
        this.playTone(s.f * 0.5, 'sine', s.d * 1.2, s.t, 0.2); // sub bass
        this.playTone(s.f * 2, 'triangle', s.d, s.t, 0.06);
      });
    };
    loop();
    this.intervalTimer = window.setInterval(loop, 5000);
  }

  private playSpacetoonTheme() {
    // Energetic synth adventure (Digimon / Spacetoon feel)
    const notes = [
      { f: 329.63, d: 0.25, t: 0.0 }, // E4
      { f: 392.00, d: 0.25, t: 0.25 }, // G4
      { f: 440.00, d: 0.3, t: 0.5 },  // A4
      { f: 493.88, d: 0.3, t: 0.8 },  // B4
      { f: 587.33, d: 0.4, t: 1.1 },  // D5
      { f: 523.25, d: 0.3, t: 1.5 },  // C5
      { f: 440.00, d: 0.5, t: 1.8 },  // A4
      { f: 493.88, d: 0.8, t: 2.4 },  // B4
    ];
    const loop = () => {
      notes.forEach(n => {
        this.playTone(n.f, 'square', n.d, n.t, 0.08);
        this.playTone(n.f * 0.5, 'triangle', n.d, n.t, 0.12);
      });
    };
    loop();
    this.intervalTimer = window.setInterval(loop, 3400);
  }

  private playChaosBeat() {
    // Egyptian Baladi / Shaaban rhythm & playful synth lead
    let step = 0;
    this.intervalTimer = window.setInterval(() => {
      if (!this.ctx) return;
      const beat = step % 8;
      // Baladi rhythm: DUM ... TAK ... TAK
      if (beat === 0) {
        // Heavy Dum
        this.playTone(80, 'sine', 0.2, 0, 0.3);
      } else if (beat === 3 || beat === 6) {
        // Sharp Tak
        this.playTone(350, 'triangle', 0.08, 0, 0.2);
        this.playTone(700, 'square', 0.04, 0, 0.08);
      }

      // Fun micro melodies
      const riff = [440, 466, 493, 523, 493, 466, 440, 392];
      this.playTone(riff[step % riff.length], 'sawtooth', 0.15, 0.02, 0.1);

      step++;
    }, 240);

    // Auto-stop at 20 seconds precisely as requested
    window.setTimeout(() => {
      if (this.currentTrackId === 'audio-chaos') {
        this.stop();
      }
    }, 20000);
  }

  private playTul8teChill() {
    // Dreamy retro synth chords & 80s drum groove
    const chords = [
      [220, 277.18, 329.63, 415.30], // A minor 9
      [174.61, 220, 261.63, 329.63], // F major 7
      [196, 246.94, 293.66, 369.99], // G
      [146.83, 185, 220, 277.18]     // Dm
    ];
    let chordIndex = 0;
    const playChord = () => {
      const current = chords[chordIndex % chords.length];
      current.forEach(f => {
        this.playTone(f, 'sine', 2.6, 0, 0.12);
        this.playTone(f * 2, 'triangle', 2.0, 0.05, 0.05);
      });
      // Soft bass note
      this.playTone(current[0] * 0.5, 'sine', 2.6, 0, 0.22);
      chordIndex++;
    };
    playChord();
    this.intervalTimer = window.setInterval(playChord, 3000);
  }

  private playPerfectWaltz() {
    // Ed Sheeran - Perfect (Starting immediately from vocal line: "I found a love for me...")
    const vocalNotes = [
      // "I found a love for me"
      { f: 196.00, d: 0.28, t: 0.00 }, // I
      { f: 196.00, d: 0.28, t: 0.35 }, // found
      { f: 196.00, d: 0.28, t: 0.70 }, // a
      { f: 196.00, d: 0.35, t: 1.05 }, // love
      { f: 220.00, d: 0.35, t: 1.45 }, // for
      { f: 246.94, d: 1.10, t: 1.85 }, // me

      // "Darling just dive right in"
      { f: 196.00, d: 0.28, t: 3.20 }, // Dar-
      { f: 196.00, d: 0.28, t: 3.55 }, // ling
      { f: 196.00, d: 0.28, t: 3.90 }, // just
      { f: 220.00, d: 0.35, t: 4.25 }, // dive
      { f: 246.94, d: 0.35, t: 4.65 }, // right
      { f: 261.63, d: 0.55, t: 5.05 }, // in

      // "and follow my lead"
      { f: 246.94, d: 0.28, t: 5.75 }, // and
      { f: 220.00, d: 0.28, t: 6.05 }, // fol-
      { f: 196.00, d: 0.35, t: 6.40 }, // low
      { f: 220.00, d: 0.35, t: 6.80 }, // my
      { f: 246.94, d: 1.20, t: 7.20 }, // lead

      // "Well I found a girl, beautiful and sweet"
      { f: 196.00, d: 0.28, t: 8.60 }, // Well
      { f: 196.00, d: 0.28, t: 8.95 }, // I
      { f: 196.00, d: 0.28, t: 9.30 }, // found
      { f: 220.00, d: 0.35, t: 9.65 }, // a
      { f: 246.94, d: 0.70, t: 10.05 }, // girl
      { f: 261.63, d: 0.35, t: 10.85 }, // beau-
      { f: 246.94, d: 0.35, t: 11.25 }, // ti-
      { f: 220.00, d: 0.35, t: 11.65 }, // ful
      { f: 196.00, d: 0.35, t: 12.05 }, // and
      { f: 196.00, d: 1.10, t: 12.45 }, // sweet

      // "I never knew you were the someone waiting for me"
      { f: 196.00, d: 0.28, t: 13.80 }, // I
      { f: 196.00, d: 0.28, t: 14.15 }, // ne-
      { f: 196.00, d: 0.28, t: 14.50 }, // ver
      { f: 220.00, d: 0.35, t: 14.85 }, // knew
      { f: 246.94, d: 0.35, t: 15.25 }, // you
      { f: 261.63, d: 0.35, t: 15.65 }, // were
      { f: 246.94, d: 0.35, t: 16.05 }, // the
      { f: 220.00, d: 0.35, t: 16.45 }, // some-
      { f: 196.00, d: 0.35, t: 16.85 }, // one
      { f: 220.00, d: 0.35, t: 17.25 }, // wai-
      { f: 196.00, d: 0.35, t: 17.65 }, // ting
      { f: 196.00, d: 0.35, t: 18.05 }, // for
      { f: 196.00, d: 1.40, t: 18.45 }  // me
    ];

    const guitarChords = [
      { f: 98.00, d: 2.8, t: 0.00 },
      { f: 82.41, d: 2.8, t: 3.20 },
      { f: 65.41, d: 2.8, t: 5.75 },
      { f: 73.42, d: 2.8, t: 7.20 },
      { f: 98.00, d: 2.8, t: 8.60 },
      { f: 82.41, d: 2.8, t: 11.25 },
      { f: 65.41, d: 2.8, t: 13.80 },
      { f: 73.42, d: 2.8, t: 16.85 }
    ];

    const playRound = () => {
      vocalNotes.forEach(n => {
        this.playTone(n.f, 'sine', n.d, n.t, 0.22);
        this.playTone(n.f * 2, 'triangle', n.d * 0.7, n.t, 0.06);
      });
      guitarChords.forEach(c => {
        this.playTone(c.f, 'triangle', c.d, c.t, 0.12);
        this.playTone(c.f * 1.5, 'sine', c.d * 0.8, c.t + 0.1, 0.08);
      });
    };

    playRound();
    this.intervalTimer = window.setInterval(playRound, 21000);
  }

  private playFiYomWLeila() {
    // Warda - Fi Yom W Leila (Starting straight into vocal melody without long intro)
    const notes = [
      // "Fi yom w leila"
      { f: 261.63, d: 0.35, t: 0.00 }, // Fi (C4)
      { f: 293.66, d: 0.40, t: 0.40 }, // yom (D4)
      { f: 329.63, d: 0.40, t: 0.85 }, // w (E4)
      { f: 349.23, d: 0.50, t: 1.30 }, // lei- (F4)
      { f: 392.00, d: 1.10, t: 1.85 }, // la (G4)

      // "khedna halawet el hob kollo"
      { f: 392.00, d: 0.35, t: 3.10 }, // khed- (G4)
      { f: 440.00, d: 0.40, t: 3.50 }, // na (A4)
      { f: 392.00, d: 0.35, t: 3.95 }, // ha- (G4)
      { f: 349.23, d: 0.35, t: 4.35 }, // la- (F4)
      { f: 329.63, d: 0.45, t: 4.75 }, // wet (E4)
      { f: 293.66, d: 0.35, t: 5.25 }, // el (D4)
      { f: 329.63, d: 0.50, t: 5.65 }, // hob (E4)
      { f: 349.23, d: 0.45, t: 6.20 }, // kol- (F4)
      { f: 329.63, d: 0.70, t: 6.70 }, // lo (E4)

      // "fi yom w leila"
      { f: 293.66, d: 0.35, t: 7.55 }, // fi (D4)
      { f: 261.63, d: 0.40, t: 7.95 }, // yom (C4)
      { f: 293.66, d: 0.45, t: 8.40 }, // w (D4)
      { f: 261.63, d: 1.40, t: 8.90 }, // lei-la (C4)

      // "w bein yom w leila"
      { f: 261.63, d: 0.35, t: 10.60 }, // w (C4)
      { f: 293.66, d: 0.35, t: 11.00 }, // bein (D4)
      { f: 329.63, d: 0.40, t: 11.40 }, // yom (E4)
      { f: 349.23, d: 0.45, t: 11.85 }, // w (F4)
      { f: 392.00, d: 1.10, t: 12.35 }, // lei-la (G4)

      // "dawwa'na halawet el hob kollo"
      { f: 392.00, d: 0.35, t: 13.60 }, // daw- (G4)
      { f: 440.00, d: 0.40, t: 14.00 }, // wa'- (A4)
      { f: 392.00, d: 0.35, t: 14.45 }, // na (G4)
      { f: 349.23, d: 0.35, t: 14.85 }, // ha-la- (F4)
      { f: 329.63, d: 0.45, t: 15.25 }, // wet (E4)
      { f: 293.66, d: 0.35, t: 15.75 }, // el hob (D4)
      { f: 349.23, d: 0.45, t: 16.15 }, // kol- (F4)
      { f: 329.63, d: 0.70, t: 16.65 }, // lo (E4)

      // "fi yom w leila"
      { f: 293.66, d: 0.35, t: 17.50 }, // fi (D4)
      { f: 261.63, d: 0.40, t: 17.90 }, // yom (C4)
      { f: 293.66, d: 0.45, t: 18.35 }, // w (D4)
      { f: 261.63, d: 1.50, t: 18.85 }  // lei-la (C4)
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

    const playRound = () => {
      notes.forEach(n => {
        this.playTone(n.f, 'triangle', n.d, n.t, 0.20);
        this.playTone(n.f * 2, 'sine', n.d * 0.8, n.t + 0.01, 0.07);
      });
      chords.forEach(c => {
        this.playTone(c.f, 'sine', c.d, c.t, 0.14);
      });
    };

    playRound();
    this.intervalTimer = window.setInterval(playRound, 21500);
  }

  private playNokiaTune() {
    // Classic Nokia Tune 3310 (Gran Vals) - Monophonic 8-bit retro sound
    const notes = [
      { f: 659.25, d: 0.16, t: 0.00 }, // E5
      { f: 587.33, d: 0.16, t: 0.18 }, // D5
      { f: 369.99, d: 0.32, t: 0.36 }, // F#4
      { f: 415.30, d: 0.32, t: 0.72 }, // G#4
      { f: 554.37, d: 0.16, t: 1.08 }, // C#5
      { f: 493.88, d: 0.16, t: 1.26 }, // B4
      { f: 293.66, d: 0.32, t: 1.44 }, // D4
      { f: 329.63, d: 0.32, t: 1.80 }, // E4
      { f: 493.88, d: 0.16, t: 2.16 }, // B4
      { f: 440.00, d: 0.16, t: 2.34 }, // A4
      { f: 277.18, d: 0.32, t: 2.52 }, // C#4
      { f: 329.63, d: 0.32, t: 2.88 }, // E4
      { f: 440.00, d: 0.75, t: 3.24 }  // A4
    ];

    notes.forEach(n => {
      this.playTone(n.f, 'square', n.d, n.t, 0.14);
    });

    this.intervalTimer = window.setTimeout(() => {
      this.stop();
    }, 4500);
  }
}

export const audioEngine = new AudioEngine();
