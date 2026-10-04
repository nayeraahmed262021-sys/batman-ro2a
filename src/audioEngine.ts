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
  | 'audio-perfect';

interface TrackMeta {
  id: TrackId;
  title: string;
  subtitle: string;
}

export const TRACKS: Record<TrackId, TrackMeta> = {
  'audio-happy-birthday': {
    id: 'audio-happy-birthday',
    title: 'Happy Birthday To You (هدوء)',
    subtitle: 'بيانو دافي واحتفال هادي عشانك'
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
    title: 'عليا النعمة بحبك — مهرجان وضحك',
    subtitle: 'فقرة الهبل والبهجة والمولد'
  },
  'audio-tul8te': {
    id: 'audio-tul8te',
    title: 'أغاني Tul8te — تفاصيل اللحظات',
    subtitle: 'إيقاع هادي وكلام بنوصف بيه حالنا'
  },
  'audio-perfect': {
    id: 'audio-perfect',
    title: 'Perfect — Ed Sheeran (آخر أغنية)',
    subtitle: 'الرومانسية والنهاية الهادية اللي في القلب'
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

  // Melodic tracks
  private playHappyBirthday() {
    // C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00, B4=493.88, C5=523.25
    const notes = [
      { f: 261.63, d: 0.35, t: 0.0 },
      { f: 261.63, d: 0.35, t: 0.4 },
      { f: 293.66, d: 0.7, t: 0.8 },
      { f: 261.63, d: 0.7, t: 1.6 },
      { f: 349.23, d: 0.7, t: 2.4 },
      { f: 329.63, d: 1.2, t: 3.2 },

      { f: 261.63, d: 0.35, t: 4.6 },
      { f: 261.63, d: 0.35, t: 5.0 },
      { f: 293.66, d: 0.7, t: 5.4 },
      { f: 261.63, d: 0.7, t: 6.2 },
      { f: 392.00, d: 0.7, t: 7.0 },
      { f: 349.23, d: 1.2, t: 7.8 },

      { f: 261.63, d: 0.35, t: 9.2 },
      { f: 261.63, d: 0.35, t: 9.6 },
      { f: 523.25, d: 0.8, t: 10.0 },
      { f: 440.00, d: 0.8, t: 10.9 },
      { f: 349.23, d: 0.8, t: 11.8 },
      { f: 329.63, d: 0.8, t: 12.7 },
      { f: 293.66, d: 1.2, t: 13.6 },

      { f: 466.16, d: 0.35, t: 15.0 },
      { f: 466.16, d: 0.35, t: 15.4 },
      { f: 440.00, d: 0.7, t: 15.8 },
      { f: 349.23, d: 0.7, t: 16.6 },
      { f: 392.00, d: 0.7, t: 17.4 },
      { f: 349.23, d: 1.5, t: 18.2 }
    ];

    const loopLen = 20;
    const playRound = () => {
      notes.forEach(n => {
        // Soft chime / sine
        this.playTone(n.f, 'sine', n.d, n.t, 0.16);
        this.playTone(n.f * 0.5, 'triangle', n.d * 1.2, n.t, 0.08); // warm bass octave
      });
    };
    playRound();
    this.intervalTimer = window.setInterval(playRound, loopLen * 1000);
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
    // Ed Sheeran Perfect waltz (12/8 gentle acoustic guitar feel)
    // Bb, Gm, Eb, F progression
    const arp = [
      233.08, 293.66, 349.23, 466.16, // Bb
      196.00, 233.08, 293.66, 392.00, // Gm
      155.56, 196.00, 233.08, 311.13, // Eb
      174.61, 220.00, 261.63, 349.23  // F
    ];
    let noteIndex = 0;
    this.intervalTimer = window.setInterval(() => {
      const f = arp[noteIndex % arp.length];
      this.playTone(f, 'triangle', 0.6, 0, 0.16);
      this.playTone(f * 2, 'sine', 0.4, 0.02, 0.08);
      noteIndex++;
    }, 280);
  }
}

export const audioEngine = new AudioEngine();
