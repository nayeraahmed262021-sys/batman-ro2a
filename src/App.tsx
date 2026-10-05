import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { audioEngine, TRACKS } from './audioEngine';

// Real photos & memes for Ro2a & Batman
const IMAGES = {
  hero: '/batman-ro2a.jpg',
  photo1: '/images/photo1.jpg',
  photo2: '/images/photo2.jpg',
  photo3: '/images/photo3.jpg',
  photo4: '/images/photo4.jpg',
  photo5: '/images/photo5.jpg',
  photo6: '/images/photo6.jpg',
  photo7: '/images/photo7.jpg',
  nesreenHeart: '/images/nesreen_heart.jpg',
  eidMiladGarhy: '/images/eid_milad_garhy.jpg',
  wardaSheikh: '/images/warda_sheikh.jpg',
  completelyLayes: '/images/completely_layes.jpg',
  bataE3tezar: '/images/bata_e3tezar.jpg',
  cardBatman: '/images/card_batman.jpg',
  cardBaby: '/images/card_baby.jpg',
  cardDigimon: '/images/card_digimon.jpg',
  baliLandscape: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  meme: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj-6g9k6J0Q5BuI5p7irUiRQu9an7UuVQA7ojo8hJmVHKKbXvQNZN1Z0D5uWA_i4_T1qQntI2XWMXqFQwQDgnZzTifR9raKyxK5d5XmrNrRWwDUjt0zj66bytwNOY0-YmTMrAQw4wHAjAW3lKnda3bN8CVRHZ9t3eTIDlUG5LSUoFNCZ8A8LJDcrUJ0RBirVqyeavJVQgZ7uaUXPy8ZqEPK00w1FIf1Nbhc2wfG9dA_DtvDTyeoxClBQ',
  childhood: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIYfehwMvsdO-D7HzgW4CTAG4iRL3QCA6fx8fdNM40NqyGn6TZ3ZH56j0e9uzraZOS_PjTy8Oeo0eFoku-WYc2flnugEvby-u4bvsnBGwws4FKlHHYhyRzmkqX7k63kJpjQeIW4EI4vrB-6la8mNsM0Gji7KqrmgLG10xxiI9fmiWvs6CYl7Oa3d3hnEaqfBrxoPzYY4kJ5ZxsfOa3cCAyJtqDhZ_CAFrib4beRnlTNSbh8Bg8o9bA4Q',
  batmanStation: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_DtLIMg-mMFly21USDod_NTefmA0MGa8vjQQYmwjbL8z16jwSyhLgL8bkwun231yDrU1jKd2wHyxH2wxnAZzPaWJ0QIuOTcWnkeUstkDJgCuHYNd2ixGPT4l3hP424nGRmUcKkFreMtRA5WmtAiPHI6PVTphF7Z-6xVIIH9n88rqd6ULKeTMVQ9P2OfdL4-wPOL9W00UkNubg7-sRXKQsd4eL-mxZ73nlsAyPF07Itg7MatxSQNMouQ',
  spacetoon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL245MxpDaQYS-iwahne09lnLew5QfRQ0rGNEUQ6MBoWxjrtHfid_wODzbwXe4elMdN2wUuSfgUVxkeQT-a2snEw_pt1XK_2ub34w6lConNsMTfs8oc4MCXgh6EjnK041nnaScKrE7f-KGV9vKPfA7tlVu-90ChrSLLOlcAr5JwUvnxRaz0pQisQEG96bpx6LNxMLkDJR8hvE-HsvPGvZxk3VqhSd76dxgrP4v0L30HJQFs9aR1sVMVw'
};

// سؤال اشخلع (سؤال واحد اختار من متعدد)
const SHAKHLA3_QUESTION = {
  title: 'اختار من متعدد',
  q: 'اشخلع ....',
  options: [
    'الحبهان',
    'الكابوريا',
    'البطاطس المقلية في الزيت الغزير',
    'السبيط'
  ],
  correct: 3 // السبيط (0-indexed: 3)
};

const GALLERY_ITEMS = [
  {
    src: IMAGES.photo1,
    tag: '[الشتاء والدفا]',
    title: 'سقعة إيدينا والقهوة والدفا وسط الشتا ☕🧣',
    file: 'images/photo1.jpg',
    duration: '0:24'
  },
  {
    src: IMAGES.photo2,
    tag: '[ضحكة من القلب]',
    title: 'ضحكتك في الشمس اللي بتنور أي مكان ☀️❤️',
    file: 'images/photo2.jpg',
    duration: '0:35'
  },
  {
    src: IMAGES.photo3,
    tag: '[هزارنا العبثي]',
    title: 'لما نفصل ضحك وعبط ومحدش يفهمنا غيرنا 😂✨',
    file: 'images/photo3.jpg',
    duration: '0:42'
  },
  {
    src: IMAGES.photo4,
    tag: '[شكلنا سوا]',
    title: 'شكلنا حلو أوي سوا.. لايقين على بعض أوي 💙',
    file: 'images/photo4.jpg',
    duration: '0:28'
  },
  {
    src: IMAGES.photo5,
    tag: '[الأمان والحنية]',
    title: 'سندتنا لبعض والإحساس بالأمان جنبك 🤍',
    file: 'images/photo5.jpg',
    duration: '0:50'
  },
  {
    src: IMAGES.photo6,
    tag: '[مكالماتنا وسهرنا]',
    title: 'ضحكتنا في المكالمات وكلامنا اللي مبيخلصش 📱✨',
    file: 'images/photo6.jpg',
    duration: '0:31'
  },
  {
    src: IMAGES.photo7,
    tag: '[مشاويرنا سوا]',
    title: 'مشاوير العربية وحكايات الطريق والأغاني 🚗🎶',
    file: 'images/photo7.jpg',
    duration: '0:45'
  }
];

export default function App() {
  // Audio state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [currentTrackTitle, setCurrentTrackTitle] = useState<string>('الموسيقى: متوقفة');

  // Chaos mode gate state
  const [isChaosOpen, setIsChaosOpen] = useState<boolean>(false);

  // سؤال اشخلع (سؤال واحد اختار من متعدد)
  const [shakhla3Selected, setShakhla3Selected] = useState<number | null>(null);

  // 2. فاصل الكرتون الصغنن (الولد والبنت والكرش)
  const [isBoyRunning, setIsBoyRunning] = useState<boolean>(false);
  const [girlGiggling, setGirlGiggling] = useState<boolean>(false);

  // 3. لعبة الكروت الثلاثة (كلهم ع ضهرهم في البداية)
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false
  });

  // Secret final message revealed state
  const [isFinalRevealed, setIsFinalRevealed] = useState<boolean>(false);

  // Modals
  const [showBirthdayModal, setShowBirthdayModal] = useState<boolean>(false);
  const [showSpecialDateModal, setShowSpecialDateModal] = useState<boolean>(false);
  const [showBonyAlert, setShowBonyAlert] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; caption: string; tag: string } | null>(null);

  // Terminal state
  const [terminalOutput, setTerminalOutput] = useState<Array<{ text: string; color?: string }>>([]);
  const [terminalInputVal, setTerminalInputVal] = useState<string>('');
  const terminalInputRef = useRef<HTMLInputElement>(null);

  // Cursor glow
  const cursorRef = useRef<HTMLDivElement>(null);
  // Scroll progress bar
  const [scrollPercent, setScrollPercent] = useState<number>(0);

  // Subscribe to audio engine
  useEffect(() => {
    const unsubscribe = audioEngine.subscribe(state => {
      setIsPlaying(state.isPlaying);
      setCurrentTrackId(state.trackId);
      setCurrentTrackTitle(state.title);
    });
    return () => unsubscribe();
  }, []);

  // Window scroll & mouse tracker
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        setScrollPercent(Math.min(100, Math.max(0, (winScroll / height) * 100)));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    // Secret date key sequence listener
    let keyBuffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in terminal
      if (document.activeElement === terminalInputRef.current) return;

      keyBuffer += e.key;
      if (keyBuffer.length > 10) keyBuffer = keyBuffer.slice(-10);

      if (keyBuffer.includes('17/9') || keyBuffer.includes('17-9')) {
        triggerSpecialDate();
        keyBuffer = '';
      } else if (keyBuffer.includes('5/10') || keyBuffer.includes('5-10')) {
        triggerBirthdayEgg();
        keyBuffer = '';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Play audio helper
  const handlePlayAudio = (trackId: keyof typeof TRACKS) => {
    audioEngine.playTrack(trackId);
  };

  const handleStopAudio = () => {
    audioEngine.stop();
  };

  // Trigger 5/10 birthday modal
  const triggerBirthdayEgg = () => {
    setShowBirthdayModal(true);
    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#F59E0B', '#38BDF8', '#FFFFFF', '#2563EB']
      });
    } catch {
      // ignore
    }
  };

  // Trigger 17/9 special date modal
  const triggerSpecialDate = () => {
    setShowSpecialDateModal(true);
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#0052FF', '#38BDF8', '#FFFFFF']
      });
    } catch {
      // ignore
    }
  };

  // Open Chaos Mode
  const enterChaosMode = () => {
    setIsChaosOpen(true);
    try {
      confetti({
        particleCount: 85,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']
      });
    } catch {
      // ignore
    }
    handlePlayAudio('audio-chaos');
  };

  // Exit Chaos Mode
  const exitChaosMode = () => {
    setIsChaosOpen(false);
    handleStopAudio();
  };

  // Tacky Love Rain (Red hearts & ribbons falling for 5 seconds)
  const triggerTackyLoveRain = () => {
    handlePlayAudio('audio-chaos');
    const end = Date.now() + 5 * 1000; // 5 seconds and stops
    const interval: any = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }
      try {
        confetti({
          particleCount: 8,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.1 },
          colors: ['#FF0000', '#FF1493', '#FF4500', '#FFD700']
        });
        confetti({
          particleCount: 8,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.1 },
          colors: ['#FF0000', '#FF69B4', '#DC143C', '#00FFFF']
        });
      } catch {
        // ignore
      }
    }, 280);
  };

  // Shakhla3 Multiple Choice Question Handler
  const handleSelectShakhla3 = (index: number) => {
    setShakhla3Selected(index);
    if (index === 3) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  };

  // Cartoon Interlude Tickle Handler
  const handleBoyTickle = () => {
    if (isBoyRunning) return;
    setIsBoyRunning(true);
    setGirlGiggling(false);

    setTimeout(() => {
      setGirlGiggling(true);
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#FF1493', '#38BDF8', '#F59E0B', '#EC4899']
        });
      } catch {
        // ignore
      }
    }, 600);

    setTimeout(() => {
      setIsBoyRunning(false);
      setGirlGiggling(false);
    }, 2800);
  };

  // Flip Card Handler
  const handleToggleCard = (cardNum: number) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardNum]: !prev[cardNum]
    }));
    try {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#38BDF8', '#2563EB', '#F59E0B']
      });
    } catch {
      // ignore
    }
  };

  // Terminal command handler
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = terminalInputVal.trim().toLowerCase();
    if (!val) return;

    setTerminalInputVal('');

    if (val === 'clear') {
      setTerminalOutput([]);
      return;
    }

    if (val === '5/10' || val === '5-10') {
      triggerBirthdayEgg();
      setTerminalOutput(prev => [
        ...prev,
        { text: '> 5/10 عيد ميلاد بوني الجميل 🎂💙', color: 'text-amber-400' }
      ]);
    } else if (val === '17/9' || val === '17-9') {
      triggerSpecialDate();
      setTerminalOutput(prev => [
        ...prev,
        { text: '> 17/9 unlocked: التاريخ اللي في القلب علطول 💙', color: 'text-[#38BDF8]' }
      ]);
    } else if (val === 'secret' || val === 'ro2a') {
      setTerminalOutput(prev => [
        ...prev,
        { text: '> Secret: "انا بحبك بكل لغبطتنا يا عبدالرحمن."', color: 'text-rose-400' }
      ]);
    } else if (val === 'batman') {
      setTerminalOutput(prev => [
        ...prev,
        { text: '> Batman status: Respected Dark Knight forever. Protected by code.', color: 'text-yellow-400' }
      ]);
    } else if (val === 'music') {
      setTerminalOutput(prev => [
        ...prev,
        { text: '> Playing: ' + currentTrackTitle, color: 'text-emerald-400' }
      ]);
    } else if (val === 'help') {
      setTerminalOutput(prev => [
        ...prev,
        { text: '> commands available: 5/10, 17/9, secret, batman, music, clear, help', color: 'text-gray-400' }
      ]);
    } else {
      setTerminalOutput(prev => [
        ...prev,
        { text: `> Unknown command: "${val}". Type "help" for options.`, color: 'text-rose-400' }
      ]);
    }
  };

  const focusTerminal = () => {
    const el = document.getElementById('terminal-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      terminalInputRef.current?.focus();
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-[#07080B] text-[#F1F4F9] selection:bg-[#2563EB] selection:text-white">
      {/* Ambient mouse glow follower */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed w-[380px] h-[380px] rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 z-0"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(37, 99, 235, 0) 70%)'
        }}
      />

      {/* Top scroll progress indicator */}
      <div className="fixed top-0 inset-x-0 h-[3px] bg-transparent z-50">
        <div
          className="h-full bg-gradient-to-r from-[#0052FF] via-[#38BDF8] to-[#2563EB] transition-all duration-75 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      {/* Global Floating Music Controller */}
      <div className="fixed bottom-6 left-6 z-40 transition-all duration-300">
        <div className="glass-card px-4 py-2.5 rounded-full flex items-center space-x-3 space-x-reverse shadow-2xl border border-[#1E2536]/80 hover:border-[#2563EB]/60 transition bg-[#0F1218]/90">
          {/* Animated visualizer bars */}
          {isPlaying && (
            <div className="flex items-end gap-1 h-4 w-4">
              <span className="w-1 bg-[#38BDF8] rounded-full vis-bar h-2" />
              <span className="w-1 bg-[#2563EB] rounded-full vis-bar h-3" />
              <span className="w-1 bg-[#38BDF8] rounded-full vis-bar h-4" />
              <span className="w-1 bg-[#2563EB] rounded-full vis-bar h-1" />
            </div>
          )}

          <button
            onClick={() => {
              if (isPlaying) handleStopAudio();
              else handlePlayAudio('audio-happy-birthday');
            }}
            className="text-xs font-medium text-[#94A3B8] hover:text-white transition flex items-center gap-2"
          >
            <i
              className={`fa-solid fa-compact-disc text-[#2563EB] text-base transition-transform duration-500 ${
                isPlaying ? 'animate-spin' : ''
              }`}
            />
            <span className="font-sans font-medium">{currentTrackTitle}</span>
          </button>

          <button
            onClick={() => audioEngine.testSound()}
            className="text-[11px] text-amber-300 hover:text-amber-200 bg-amber-400/15 hover:bg-amber-400/25 px-2.5 py-1 rounded-full border border-amber-400/30 transition flex items-center gap-1 cursor-pointer shrink-0"
            title="جرب الصوت للتأكد من تشغيله في متصفحك أو موبايلك"
          >
            <span>🔊 جرب الصوت</span>
          </button>
        </div>
      </div>

      {/* Sticky Minimal Navbar */}
      <nav className="fixed top-0 inset-x-0 z-40 bg-[#07080B]/85 backdrop-blur-md border-b border-[#1E2536]/60 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand Name */}
          <a href="#hero" className="flex items-center space-x-3 space-x-reverse group">
            <span className="font-display font-extrabold tracking-tight text-lg sm:text-xl text-white group-hover:text-[#2563EB] transition">
              BATMAN &amp; RO2A
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#1E2536]/90 text-[#94A3B8] font-code">
              v2025.final
            </span>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-7 space-x-reverse text-xs sm:text-sm font-medium text-[#94A3B8]">
            <a className="hover:text-white transition" href="#intro">
              قبل ما نبدأ
            </a>
            <a
              className="hover:text-amber-400 transition flex items-center gap-1.5"
              href="#fun-chaos-section"
            >
              <span>عبثيات وفاعليات نونية</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </a>
            <a className="hover:text-white transition" href="#moments">
              قسم اللحظات
            </a>
            <a className="hover:text-white transition" href="#gallery">
              المعرض
            </a>
            <a className="hover:text-white transition" href="#final-message">
              آخر حاجة
            </a>
          </div>

          {/* Birthday Quick Trigger (5/10) & Console */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={triggerBirthdayEgg}
              className="relative text-xs text-[#94A3B8] hover:text-white hover:border-[#2563EB] transition font-code px-2.5 py-1 rounded-md border border-[#1E2536] flex items-center gap-1.5 group bg-[#0F1218]/60 cursor-pointer"
              title="تاريخ ميلاد بوني 🎂"
            >
              <i className="fa-solid fa-cake-candles text-[11px] text-amber-400 group-hover:scale-110 transition" />
              <span className="font-semibold tracking-wider text-white">5/10</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </button>

            <button
              onClick={focusTerminal}
              className="w-8 h-8 rounded-lg bg-[#0F1218] border border-[#1E2536] text-[#94A3B8] hover:text-white hover:border-[#2563EB]/50 flex items-center justify-center transition cursor-pointer"
              title="Developer Console"
            >
              <i className="fa-solid fa-terminal text-xs" />
            </button>
          </div>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section
        id="hero"
        className="min-h-screen relative pt-28 pb-20 flex flex-col justify-center items-center px-6 hero-glow grid-pattern"
      >
        <div className="max-w-4xl w-full mx-auto text-center flex flex-col items-center">
          {/* Subtle Interactive Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#131720]/90 border border-[#1E2536] text-xs text-[#94A3B8] mb-7 shadow-sm">
            <i className="fa-solid fa-envelope text-[#38BDF8]" />
            <span className="font-display font-medium hidden sm:inline">A quiet tribute for a special mind</span>
            <button
              onClick={() => setShowBonyAlert(true)}
              className="text-xs text-[#38BDF8] hover:text-white font-medium flex items-center gap-1.5 cursor-pointer transition bg-[#2563EB]/15 hover:bg-[#2563EB]/30 px-3 py-1 rounded-full border border-[#2563EB]/30"
            >
              <span className="font-bold tracking-wide">message to batman</span>
              <span className="text-sm">✉️</span>
            </button>
          </div>

          {/* Large Hero Title */}
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-white mb-6 leading-tight">
            BATMAN &amp; RO2A
          </h1>

          {/* Main Hero Photo Frame with 3D Tilt */}
          <div className="tilt-card relative w-full max-w-sm sm:max-w-md aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden glass-card p-2.5 mb-8 group shadow-2xl border border-white/10 ring-1 ring-blue-500/20">
            <div className="w-full h-full rounded-2xl overflow-hidden relative bg-[#0F1218]">
              <img
                src={IMAGES.hero}
                alt="BATMAN & RO2A"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700 cursor-pointer"
                onClick={() =>
                  setLightboxImage({
                    src: IMAGES.hero,
                    caption: 'BATMAN & RO2A ❤️',
                    tag: 'batman_ro2a.jpg'
                  })
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080B]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-xs text-[#94A3B8]/90 font-code pointer-events-none">
                <span>[batman_ro2a.jpg]</span>
                <span className="text-[#F1F4F9]/90 font-sans font-medium">خاص بينا ❤️</span>
              </div>
            </div>
          </div>

          {/* Subtitle & Words */}
          <p className="text-base sm:text-xl font-medium text-white max-w-2xl mx-auto mb-6 leading-relaxed">
            الويبسايت دا اتعمل علشانك و فيه تفاصيل كتير حاولت تكون شبهنا مع بعض(معقدة بس مختلفة و لذيذة) خد وقتك و استكشفه يارب يعجبك حبيبي كل سنة و عيوني طيب 💙
          </p>

          {/* Music Start Control (15s Song) */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <button
              onClick={() => handlePlayAudio('audio-happy-birthday')}
              className={`px-7 py-3 rounded-full text-black font-semibold text-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg flex items-center gap-2.5 cursor-pointer ${
                currentTrackId === 'audio-happy-birthday' && isPlaying
                  ? 'bg-amber-300 ring-2 ring-amber-400'
                  : 'bg-white hover:bg-[#F1F4F9]'
              }`}
            >
              <i
                className={`fa-solid ${
                  currentTrackId === 'audio-happy-birthday' && isPlaying ? 'fa-pause' : 'fa-play'
                } text-xs text-[#07080B]`}
              />
              <span>
                {currentTrackId === 'audio-happy-birthday' && isPlaying
                  ? 'أوقف الأغنية'
                  : 'أغنية هادية (Happy Birthday 🎂)'}
              </span>
              <span className="text-[11px] bg-black/10 px-2 py-0.5 rounded-full font-mono font-normal">
                15s
              </span>
            </button>
            <a
              href="#intro"
              className="px-7 py-3 rounded-full bg-[#0F1218] border border-[#1E2536] text-[#F1F4F9] text-sm font-medium hover:border-[#2563EB]/50 transition"
            >
              يلا بينا نستكشف
            </a>
          </div>

          {/* Road Map Placeholder */}
          <div className="w-full max-w-md glass-card rounded-2xl p-6 mb-8 text-center border border-[#1E2536] bg-[#0F1218]/90 shadow-xl">
            <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2 mb-2">
              <span>خريطة الطريق</span>
              <span className="text-xl">😂</span>
            </h3>
            <p className="text-xs text-[#94A3B8]/70 font-sans">
              (سيبنا مكان الخريطة فاضي هنعملها سوا في الآخر 😉🗺️)
            </p>
          </div>


          {/* Scroll Down Chevron */}
          <a
            href="#intro"
            className="mt-14 flex flex-col items-center opacity-60 hover:opacity-100 transition"
          >
            <span className="text-[11px] font-code tracking-widest text-[#94A3B8] mb-2">
              SCROLL DOWN
            </span>
            <i className="fa-solid fa-chevron-down text-[#2563EB] animate-bounce text-xs" />
          </a>
        </div>
      </section>

      {/* 2. Intro Section: The Core Message */}
      <section id="intro" className="py-24 px-6 border-t border-[#1E2536]/40 relative">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-white/5">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#2563EB]/10 rounded-full blur-3xl -z-10" />
            <div className="w-10 h-10 rounded-full bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mb-6">
              <i className="fa-solid fa-quote-right text-lg" />
            </div>

            {/* Core Message Text */}
            <p className="text-xl sm:text-2xl font-medium text-white leading-relaxed mb-6">
              ملقتش حاجة تجمع ذكريات لينا و اعبرلك بيها عن كلام جوايا ولعب و فاعليات في يوم كان نفسي اكون معاك فيه و نعمل دا غير بالطريقة دي
            </p>

            <div className="border-t border-[#1E2536]/80 pt-6 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-lg font-bold text-[#2563EB] mb-1">بحبك 💙</p>
              </div>
              <div className="text-left font-code text-xs text-[#94A3B8]/70">
                <span>from: ro2a</span>
                <br />
                <span>to: batman</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. عبثيات و فاعليات نونية */}
      <section id="fun-chaos-section" className="py-24 px-6 border-t border-[#1E2536]/40 relative">
        <div className="max-w-5xl mx-auto">
          {!isChaosOpen ? (
            /* Banner / Gate before opening the activities */
            <div className="glass-card rounded-2xl p-8 sm:p-12 border-amber-500/30 shadow-2xl relative overflow-hidden text-center">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 text-amber-400 text-2xl mb-4 animate-bounce">
                <i className="fa-solid fa-masks-theater" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                عبثيات و فاعليات نونية
              </h3>
              <div className="text-sm sm:text-base text-[#F1F4F9]/90 max-w-lg mx-auto mb-7 leading-relaxed space-y-1">
                <p>ادخل العالم العبثي دا و ارجو عدم التريقة</p>
                <p>اي حاجة هتلاقيها دمها تقيل جوا ف هي بهدف العباطي 😂</p>
              </div>
              <button
                onClick={enterChaosMode}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-500 text-white font-bold text-sm sm:text-base shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center gap-3 mx-auto cursor-pointer"
              >
                <span>ادخل العالم العبثي 🥳</span>
                <i className="fa-solid fa-wand-magic-sparkles text-yellow-200" />
              </button>
            </div>
          ) : (
            /* Expanded Chaos Box: Full rich activities as requested */
            <div className="rounded-3xl p-6 sm:p-10 my-4 relative overflow-hidden transition-all duration-500 shadow-2xl glass-card border-2 border-amber-400/50 bg-[#0F1218]/95 text-center">
              {/* Marquee & Headline 1 */}
              <div className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 py-3 px-4 mb-8 rounded-2xl font-black text-black text-base sm:text-xl shadow-lg animate-pulse tracking-wide">
                <span>🌹 يا جارحني بلقمة ناشفة و العيش عندك طري تقلان عليا ليه ما تحن يا مفتري 🌹</span>
              </div>

              {/* Meme 1: Nesreen Amin Heart */}
              <div className="max-w-md mx-auto mb-10 tilt-card">
                <div className="p-3 bg-white/10 rounded-3xl border border-white/20 shadow-2xl">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black">
                    <img
                      src={IMAGES.nesreenHeart}
                      alt="يا جارحني بلقمة ناشفة"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Meme 2: عيد ميلاد جرحي أنا & 20s Shaabi Song */}
              <div className="my-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-rose-950/40 to-black/60 border-2 border-rose-500/40 shadow-2xl">
                <div className="max-w-md mx-auto mb-6">
                  <div className="p-3 bg-white/10 rounded-3xl border border-white/20 shadow-2xl">
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black">
                      <img
                        src={IMAGES.eidMiladGarhy}
                        alt="عيد ميلاد جرحي أنا"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* 20s Shaabi Song CTA with tacky hearts shower */}
                <div className="text-center">
                  <button
                    onClick={triggerTackyLoveRain}
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 hover:scale-105 active:scale-95 text-white font-black text-sm sm:text-base shadow-2xl transition cursor-pointer flex items-center justify-center gap-3 mx-auto border-2 border-yellow-300"
                  >
                    <i
                      className={`fa-solid fa-compact-disc text-lg ${
                        isPlaying && currentTrackId === 'audio-chaos' ? 'animate-spin' : ''
                      }`}
                    />
                    <span>
                      {isPlaying && currentTrackId === 'audio-chaos'
                        ? 'أوقف تراك المهرجان'
                        : 'شغل: عليا النعمة بحبك.. عليا النعمة بدوب (20 ث) 💃🔥'}
                    </span>
                    <span className="text-xl">❤️🎊</span>
                  </button>
                </div>
              </div>

              {/* Question: اشخلع .... */}
              <div className="my-12 p-6 sm:p-10 rounded-3xl bg-black/50 border-2 border-amber-400/40 shadow-2xl text-right max-w-xl mx-auto">
                <div className="text-center mb-6 pb-3 border-b border-white/10">
                  <span className="text-xs font-code text-amber-400 font-bold uppercase tracking-widest block mb-1">
                    {SHAKHLA3_QUESTION.title}
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-black text-white">
                    {SHAKHLA3_QUESTION.q}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {SHAKHLA3_QUESTION.options.map((opt, oIdx) => {
                    const isSelected = shakhla3Selected === oIdx;
                    const isCorrect = oIdx === SHAKHLA3_QUESTION.correct;
                    const showResult = shakhla3Selected !== null;

                    let btnStyle = 'bg-black/40 border-white/10 text-[#F1F4F9] hover:bg-white/10';
                    if (showResult && isCorrect) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold';
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectShakhla3(oIdx)}
                        className={`p-4 rounded-xl border text-right text-xs sm:text-sm font-medium transition cursor-pointer flex items-center gap-2.5 ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-code shrink-0">
                          {oIdx + 1}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Duck Meme Result */}
                {shakhla3Selected !== null && (
                  <div className="text-center pt-6 border-t border-white/10 animate-fadeIn">
                    <p className="text-sm font-bold text-amber-300 mb-4">
                      {shakhla3Selected === 3
                        ? 'الاختيار الصح هو السبيط طبعاً! 😂'
                        : 'الاختيار الصح هو السبيط! 😂'}
                    </p>
                    <div className="max-w-xs mx-auto p-2 bg-white/10 rounded-2xl border border-white/20 shadow-2xl">
                      <img
                        src={IMAGES.bataE3tezar}
                        alt="وردة عما بضر مني"
                        className="w-full aspect-[4/3] object-cover rounded-xl"
                      />
                      <p className="text-xs text-yellow-300 font-bold text-center mt-2">
                        وردة عما بضر مني
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Cartoon Interlude: الولد والبنت والكرش */}
              <div className="my-14 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950/20 via-pink-950/20 to-blue-950/20 border-2 border-pink-400/30 shadow-2xl text-center">
                {/* The ONLY text in this entire section: "الكروشة" */}
                <div className="mb-8">
                  <span className="inline-block text-2xl sm:text-3xl font-black text-pink-400 bg-pink-500/10 px-8 py-2 rounded-full border border-pink-500/30 shadow-lg tracking-wider">
                    الكروشة
                  </span>
                </div>

                {/* Full-body cartoon interactive playground in LTR so Boy moves left-to-right towards Girl */}
                <div
                  dir="ltr"
                  onClick={handleBoyTickle}
                  className="relative max-w-lg mx-auto h-64 bg-black/40 rounded-3xl border border-white/10 overflow-hidden flex items-end justify-between px-8 sm:px-14 pb-4 cursor-pointer select-none group"
                >
                  {/* Boy Character (Abd El-Rahman as Batman) */}
                  <div
                    className={`transition-all duration-700 ease-out z-10 flex flex-col items-center ${
                      isBoyRunning
                        ? 'translate-x-[115px] sm:translate-x-[175px] scale-105'
                        : 'group-hover:scale-105'
                    } ${girlGiggling ? 'animate-bounce' : ''}`}
                  >
                    <svg viewBox="0 0 100 160" className="w-24 sm:w-28 h-auto drop-shadow-xl">
                      {/* Dark Batman Bat-Cowl Cape trailing behind */}
                      <path d="M26 64 Q16 92 18 116 Q28 98 30 78 Z" fill="#09090B" />

                      {/* Head */}
                      <circle cx="50" cy="40" r="22" fill="#FCD7B6" />

                      {/* Abd El-Rahman's Curly Dark Hair */}
                      <circle cx="34" cy="22" r="8" fill="#111827" />
                      <circle cx="44" cy="18" r="9" fill="#0F172A" />
                      <circle cx="56" cy="18" r="9" fill="#111827" />
                      <circle cx="66" cy="22" r="8" fill="#0F172A" />
                      <circle cx="50" cy="16" r="8.5" fill="#111827" />
                      <path d="M26 36 C24 20, 76 20, 74 36 C70 28, 30 28, 26 36 Z" fill="#111827" />

                      {/* Trimmed Beard along Jawline */}
                      <path d="M30 42 C30 58, 70 58, 70 42 C70 52, 64 61, 50 61 C36 61, 30 52, 30 42 Z" fill="#18181B" opacity="0.9" />

                      {/* Trimmed Mustache */}
                      <path d="M42 47 Q50 44 58 47 Q50 50 42 47 Z" fill="#18181B" />

                      {/* Eyebrows */}
                      <path d="M38 31 Q44 28 48 31" stroke="#18181B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path d="M52 31 Q56 28 62 31" stroke="#18181B" strokeWidth="2.5" fill="none" strokeLinecap="round" />

                      {/* Eyes */}
                      {girlGiggling ? (
                        <>
                          <path d="M40 37 Q44 33 48 37" stroke="#18181B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                          <path d="M52 37 Q56 33 60 37" stroke="#18181B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        </>
                      ) : (
                        <>
                          <circle cx="44" cy="37" r="3" fill="#18181B" />
                          <circle cx="56" cy="37" r="3" fill="#18181B" />
                          <circle cx="45" cy="36" r="1.2" fill="#FFFFFF" />
                          <circle cx="57" cy="36" r="1.2" fill="#FFFFFF" />
                        </>
                      )}

                      {/* Warm Smile under mustache */}
                      <path d="M44 53 Q50 59 56 53" stroke="#991B1B" strokeWidth="2" fill={girlGiggling ? '#991B1B' : 'none'} strokeLinecap="round" />

                      {/* Batman Suit Torso */}
                      <path d="M30 62 L70 62 L68 106 L32 106 Z" fill="#18181B" />

                      {/* Batman Chest Insignia (Yellow Bat) */}
                      <ellipse cx="50" cy="74" rx="10" ry="6" fill="#FACC15" />
                      <path d="M43 74 Q46 71 50 73 Q54 71 57 74 Q55 77 50 75 Q45 77 43 74 Z" fill="#09090B" />

                      {/* Utility Belt */}
                      <rect x="32" y="98" width="36" height="8" rx="2" fill="#EAB308" />
                      <rect x="46" y="96" width="8" height="12" rx="2" fill="#CA8A04" />

                      {/* Left Arm (Resting) */}
                      <path d="M30 64 Q22 80 26 96" stroke="#18181B" strokeWidth="8" strokeLinecap="round" fill="none" />
                      <circle cx="26" cy="96" r="5" fill="#18181B" />

                      {/* Right Arm (Reaching forward & squeezing) */}
                      {isBoyRunning ? (
                        <g>
                          <path d="M68 66 Q88 74 104 84" stroke="#18181B" strokeWidth="8" strokeLinecap="round" fill="none" />
                          <circle cx="106" cy="85" r="5.5" fill="#FCD7B6" />
                          <path d="M104 81 Q110 83 108 87" stroke="#FCD7B6" strokeWidth="3" strokeLinecap="round" fill="none" />
                          <path d="M103 88 Q108 90 106 93" stroke="#FCD7B6" strokeWidth="3" strokeLinecap="round" fill="none" />
                        </g>
                      ) : (
                        <g>
                          <path d="M68 64 Q76 80 72 96" stroke="#18181B" strokeWidth="8" strokeLinecap="round" fill="none" />
                          <circle cx="72" cy="96" r="5" fill="#18181B" />
                        </g>
                      )}

                      {/* Legs & Batman Boots */}
                      <path d="M36 106 L36 142 L46 142 L48 106 Z" fill="#27272A" />
                      <path d="M52 106 L54 142 L64 142 L64 106 Z" fill="#27272A" />
                      <rect x="32" y="140" width="16" height="10" rx="3" fill="#09090B" />
                      <rect x="52" y="140" width="16" height="10" rx="3" fill="#09090B" />
                    </svg>
                  </div>

                  {/* Girl Character (Ro2a with Long Wavy Dark Hair & Squeezed Tummy) */}
                  <div className={`z-10 flex flex-col items-center ${girlGiggling ? 'animate-bounce' : ''}`}>
                    <svg viewBox="0 0 100 160" className="w-24 sm:w-28 h-auto drop-shadow-xl">
                      {/* Long Wavy Hair (Back) */}
                      <path d="M20 40 C12 65, 12 105, 22 124 C28 95, 30 68, 28 40 Z" fill="#2D1B14" />
                      <path d="M80 40 C88 65, 88 105, 78 124 C72 95, 70 68, 72 40 Z" fill="#2D1B14" />

                      {/* Head */}
                      <circle cx="50" cy="40" r="21" fill="#FCD7B6" />

                      {/* Wavy Hair (Front & Bangs) */}
                      <path d="M26 35 C24 15, 76 15, 74 35 C66 22, 34 22, 26 35 Z" fill="#3E2419" />
                      <path d="M26 36 C24 50, 28 65, 32 75 C30 60, 28 48, 28 36 Z" fill="#3E2419" />
                      <path d="M74 36 C76 50, 72 65, 68 75 C70 60, 72 48, 72 36 Z" fill="#3E2419" />

                      {/* Eyes */}
                      {girlGiggling ? (
                        <>
                          <path d="M40 38 Q45 33 50 38" stroke="#3E2419" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                          <path d="M56 38 Q61 33 66 38" stroke="#3E2419" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        </>
                      ) : (
                        <>
                          <circle cx="43" cy="38" r="3.2" fill="#3E2419" />
                          <circle cx="61" cy="38" r="3.2" fill="#3E2419" />
                          <circle cx="44.5" cy="36.5" r="1.2" fill="#FFFFFF" />
                          <circle cx="62.5" cy="36.5" r="1.2" fill="#FFFFFF" />
                          {/* Eyelashes */}
                          <path d="M40 35 L38 33" stroke="#3E2419" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M64 35 L66 33" stroke="#3E2419" strokeWidth="1.5" strokeLinecap="round" />
                        </>
                      )}

                      {/* Rosy Cheeks */}
                      <circle cx="36" cy="45" r="4" fill="#FB7185" opacity="0.8" />
                      <circle cx="68" cy="45" r="4" fill="#FB7185" opacity="0.8" />

                      {/* Laugh / Smile */}
                      <path d="M45 46 Q52 56 60 46" stroke="#BE123C" strokeWidth="2.2" fill={girlGiggling ? '#BE123C' : 'none'} strokeLinecap="round" />

                      {/* Cute Cropped Pink Top */}
                      <path d="M34 60 L66 60 L64 76 L36 76 Z" fill="#F472B6" />

                      {/* THE CUTE ROUND TUMMY ("الكروشة") WITH SQUISH ANIMATION */}
                      <g className={`transition-transform duration-300 origin-[50px_84px] ${girlGiggling ? 'scale-x-125 scale-y-80' : 'scale-100'}`}>
                        <path d="M36 76 Q50 94 64 76 Z" fill="#FCD7B6" />
                        {/* Soft belly curve & highlight */}
                        <ellipse cx="50" cy="83" rx="10" ry="5" fill="#FEE2E2" opacity="0.5" />
                        {/* Belly Button */}
                        <ellipse cx="50" cy="84" rx="1.5" ry="1.2" fill="#D97706" />
                      </g>

                      {/* Skirt */}
                      <path d="M32 87 L68 87 L72 110 L28 110 Z" fill="#818CF8" />

                      {/* Arms */}
                      {girlGiggling ? (
                        <g>
                          <path d="M34 64 Q18 50 22 36" stroke="#F472B6" strokeWidth="7" strokeLinecap="round" fill="none" />
                          <circle cx="22" cy="34" r="4.5" fill="#FCD7B6" />
                          <path d="M66 64 Q82 50 78 36" stroke="#F472B6" strokeWidth="7" strokeLinecap="round" fill="none" />
                          <circle cx="78" cy="34" r="4.5" fill="#FCD7B6" />
                        </g>
                      ) : (
                        <g>
                          <path d="M34 64 Q26 78 30 92" stroke="#F472B6" strokeWidth="7" strokeLinecap="round" fill="none" />
                          <circle cx="30" cy="94" r="4.5" fill="#FCD7B6" />
                          <path d="M66 64 Q74 78 70 92" stroke="#F472B6" strokeWidth="7" strokeLinecap="round" fill="none" />
                          <circle cx="70" cy="94" r="4.5" fill="#FCD7B6" />
                        </g>
                      )}

                      {/* Legs & Cute Shoes */}
                      <path d="M38 110 L40 142 L48 142 L46 110 Z" fill="#FCD7B6" />
                      <path d="M54 110 L52 142 L60 142 L62 110 Z" fill="#FCD7B6" />
                      <rect x="36" y="142" width="14" height="8" rx="4" fill="#FB7185" />
                      <rect x="50" y="142" width="14" height="8" rx="4" fill="#FB7185" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Game 2: لعبة الكروت الثلاثة */}
              <div className="my-14 p-6 sm:p-10 rounded-3xl bg-black/50 border-2 border-[#2563EB]/40 shadow-2xl text-center">
                <div className="mb-8">
                  <span className="text-xs font-code text-[#38BDF8] uppercase tracking-widest block mb-1">
                    Card Reveal Game
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-2">
                    <span>لعبة الكروت</span>
                    <span className="text-2xl">🃏✨</span>
                  </h4>
                </div>

                {/* 3 Face-Down Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {/* Card 1: باتمان */}
                  <div
                    onClick={() => handleToggleCard(1)}
                    className="min-h-[380px] rounded-3xl cursor-pointer transition-all duration-500 transform hover:-translate-y-2"
                  >
                    {!flippedCards[1] ? (
                      /* Face Down (Card Back) */
                      <div className="w-full h-full p-6 rounded-3xl bg-gradient-to-b from-[#111827] via-[#0F172A] to-[#1E293B] border-2 border-blue-500/50 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-400/40 flex items-center justify-center text-3xl mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                          🦇
                        </div>
                        <span className="text-3xl font-black text-white mb-2 font-code">1</span>
                        <div className="w-12 h-0.5 bg-blue-500/40 my-2" />
                        <span className="text-xs font-bold text-blue-300 mt-2 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
                          اضغط لفتح الكارت ✨
                        </span>
                      </div>
                    ) : (
                      /* Face Up */
                      <div className="w-full h-full p-6 rounded-3xl bg-[#0F1218] border-2 border-blue-500 shadow-2xl text-center flex flex-col justify-between animate-fadeIn">
                        <div>
                          <div className="relative aspect-square max-w-[200px] mx-auto rounded-2xl overflow-hidden bg-black mb-4 border border-white/10 shadow-lg">
                            <img
                              src={IMAGES.cardBatman}
                              alt="باتمان"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h5 className="text-base font-bold text-white mb-2">ضوء لمع وسط المدينة</h5>
                          <p className="text-xs text-[#94A3B8] mb-4 leading-relaxed">
                            أنت باتمان الحقيقي اللي بينقذني في كل مرة.. بطل القصة للأبد 🖤
                          </p>
                        </div>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handlePlayAudio('audio-batman');
                          }}
                          className="px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#0052FF] text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 mx-auto cursor-pointer"
                        >
                          <i
                            className={`fa-solid ${
                              isPlaying && currentTrackId === 'audio-batman' ? 'fa-pause' : 'fa-play'
                            } text-xs`}
                          />
                          <span>ضوء لمع وسط المدينة 🦇</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card 2: وهو بيبي ع البحر */}
                  <div
                    onClick={() => handleToggleCard(2)}
                    className="min-h-[380px] rounded-3xl cursor-pointer transition-all duration-500 transform hover:-translate-y-2"
                  >
                    {!flippedCards[2] ? (
                      /* Face Down (Card Back) */
                      <div className="w-full h-full p-6 rounded-3xl bg-gradient-to-b from-[#111827] via-[#0F172A] to-[#1E293B] border-2 border-cyan-500/50 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors" />
                        <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-3xl mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
                          👶
                        </div>
                        <span className="text-3xl font-black text-white mb-2 font-code">2</span>
                        <div className="w-12 h-0.5 bg-cyan-500/40 my-2" />
                        <span className="text-xs font-bold text-cyan-300 mt-2 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/30">
                          اضغط لفتح الكارت ✨
                        </span>
                      </div>
                    ) : (
                      /* Face Up */
                      <div className="w-full h-full p-6 rounded-3xl bg-[#0F1218] border-2 border-[#38BDF8] shadow-2xl text-center flex flex-col justify-between animate-fadeIn">
                        <div>
                          <div className="relative aspect-square max-w-[200px] mx-auto rounded-2xl overflow-hidden bg-black mb-4 border border-white/10 shadow-lg">
                            <img
                              src={IMAGES.cardBaby}
                              alt="وهو بيبي"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm font-bold text-[#38BDF8] my-3 leading-relaxed">
                            "بنفس ضحكتك و عيونك الحنينة دي بحبك"
                          </p>
                        </div>
                        <p className="text-xs text-[#94A3B8]">
                          نفسي في بيبي شبهك كدا 🌊👶💙
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card 3: أبطال الديجيتال */}
                  <div
                    onClick={() => handleToggleCard(3)}
                    className="min-h-[380px] rounded-3xl cursor-pointer transition-all duration-500 transform hover:-translate-y-2"
                  >
                    {!flippedCards[3] ? (
                      /* Face Down (Card Back) */
                      <div className="w-full h-full p-6 rounded-3xl bg-gradient-to-b from-[#111827] via-[#0F172A] to-[#1E293B] border-2 border-emerald-500/50 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-3xl mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                          👾
                        </div>
                        <span className="text-3xl font-black text-white mb-2 font-code">3</span>
                        <div className="w-12 h-0.5 bg-emerald-500/40 my-2" />
                        <span className="text-xs font-bold text-emerald-300 mt-2 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
                          اضغط لفتح الكارت ✨
                        </span>
                      </div>
                    ) : (
                      /* Face Up */
                      <div className="w-full h-full p-6 rounded-3xl bg-[#0F1218] border-2 border-emerald-400 shadow-2xl text-center flex flex-col justify-between animate-fadeIn">
                        <div>
                          <div className="relative aspect-square max-w-[200px] mx-auto rounded-2xl overflow-hidden bg-black mb-4 border border-white/10 shadow-lg">
                            <img
                              src={IMAGES.cardDigimon}
                              alt="أبطال الديجيتال"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h5 className="text-base font-bold text-white mb-1">أبطال الديجيتال</h5>
                          <p className="text-sm font-bold text-emerald-300 my-2">
                            "انت البطل الحقيقي بتاعي 💙"
                          </p>
                        </div>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handlePlayAudio('audio-spacetoon');
                          }}
                          className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 mx-auto cursor-pointer"
                        >
                          <i
                            className={`fa-solid ${
                              isPlaying && currentTrackId === 'audio-spacetoon' ? 'fa-pause' : 'fa-play'
                            } text-xs`}
                          />
                          <span>شغل أغنية أبطال الديجيتال 🎶</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Exit Button back to quiet state */}
              <div className="mt-14 text-center">
                <button
                  onClick={exitChaosMode}
                  className="px-10 py-4 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 hover:opacity-95 text-white font-black text-base shadow-2xl transition flex items-center gap-3 mx-auto cursor-pointer transform hover:scale-105 active:scale-95"
                >
                  <i className="fa-solid fa-door-open text-base" />
                  <span>يلا نخرج بقا 😂🚪</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Moments Section: "ويلكم باك بوني 😂" + اغنية في يوم وليلة + المشاعر */}
      <section id="moments" className="py-24 px-6 border-t border-[#1E2536]/40 relative">
        <div className="max-w-5xl mx-auto">
          {/* Moments Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/30 text-white font-bold text-sm mb-4">
              <span>ويلكم باك بوني 😂</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              ضحكنا و لعبنا و عبطنا
            </h3>
            <p className="text-base sm:text-lg text-[#38BDF8] max-w-xl mx-auto leading-relaxed font-medium">
              ندخل في المشاعر و الحاجات اللي هي الحاجات دي يعني انت فاهم يعني 😉
            </p>

            {/* Fi Yom W Leila Track Button */}
            <div className="mt-7 flex justify-center">
              <button
                onClick={() => handlePlayAudio('audio-fi-yom-w-leila')}
                className={`px-7 py-3 rounded-full text-sm font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg flex items-center gap-2.5 cursor-pointer ${
                  currentTrackId === 'audio-fi-yom-w-leila' && isPlaying
                    ? 'bg-rose-500 text-white ring-2 ring-rose-400'
                    : 'bg-white text-black hover:bg-[#F1F4F9]'
                }`}
              >
                <i
                  className={`fa-solid ${
                    currentTrackId === 'audio-fi-yom-w-leila' && isPlaying ? 'fa-pause' : 'fa-play'
                  } text-xs`}
                />
                <span>
                  {currentTrackId === 'audio-fi-yom-w-leila' && isPlaying
                    ? 'أوقف أغنية في يوم وليلة'
                    : 'في يوم و ليلة (خدنا حلاوة الحب كله) 🎶'}
                </span>
              </button>
            </div>
          </div>

          {/* Section: الحاجات اللي هفضل بفتكرها */}
          <div className="mb-8 text-center">
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
              عاوزة اقول الحاجات اللي مهما عدا عليها الوقت هفضل بفتكرها ما بينا و بحبها اوي في علاقتنا
            </h4>
          </div>

          {/* Moments Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {/* Card 1 */}
            <div className="glass-card p-6 rounded-2xl tilt-card border-[#1E2536]/70">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mb-4">
                <i className="fa-solid fa-hand-holding-heart text-lg" />
              </div>
              <h5 className="text-white font-semibold text-base mb-2">حنيتك في اللحظات الصعبة</h5>
              <p className="text-sm text-[#F1F4F9]/90 leading-relaxed">
                حنيتك في اللحظات الصعبة لم بتخبط او لم بيحصلي حاجة
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-card p-6 rounded-2xl tilt-card border-[#1E2536]/70">
              <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center mb-4">
                <i className="fa-regular fa-eye text-lg" />
              </div>
              <h5 className="text-white font-semibold text-base mb-2">الـ Eye Contact</h5>
              <p className="text-sm text-[#F1F4F9]/90 leading-relaxed">
                الاي كونتاكت اللي بيبقى ف وسط الناس كلها
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-card p-6 rounded-2xl tilt-card border-[#1E2536]/70">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mb-4">
                <i className="fa-solid fa-moon text-lg" />
              </div>
              <h5 className="text-white font-semibold text-base mb-2">كلامنا ونومنا سوا</h5>
              <p className="text-sm text-[#F1F4F9]/90 leading-relaxed">
                كلامنا مع بعض بالليل قبل ما ننام و لم بننام سوا
              </p>
            </div>

            {/* Card 4 */}
            <div className="glass-card p-6 rounded-2xl tilt-card border-[#1E2536]/70">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4">
                <i className="fa-solid fa-utensils text-lg" />
              </div>
              <h5 className="text-white font-semibold text-base mb-2">أكلنا سوا</h5>
              <p className="text-sm text-[#F1F4F9]/90 leading-relaxed">
                لم بنقعد ناكل سوا و بأكلك
              </p>
            </div>

            {/* Card 5 */}
            <div className="glass-card p-6 rounded-2xl tilt-card border-[#1E2536]/70">
              <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center mb-4">
                <i className="fa-solid fa-motorcycle text-lg" />
              </div>
              <h5 className="text-white font-semibold text-base mb-2">البايك</h5>
              <p className="text-sm text-[#F1F4F9]/90 leading-relaxed">
                واحنا على البايك سوا
              </p>
            </div>

            {/* Card 6 */}
            <div className="glass-card p-6 rounded-2xl tilt-card border-[#1E2536]/70">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                <i className="fa-solid fa-heart text-lg" />
              </div>
              <h5 className="text-white font-semibold text-base mb-2">وغيرها كتير</h5>
              <p className="text-sm text-[#F1F4F9]/90 leading-relaxed">
                حاجات كتير كتير كتير ممكن اكتبها...
              </p>
            </div>
          </div>

          {/* Emotional Love Letter (Placed directly under moments) */}
          <div className="max-w-3xl mx-auto">
            <div className="glass-card rounded-2xl p-8 sm:p-14 border border-[#1E2536]/90 relative shadow-2xl">
              <div className="flex items-center justify-between pb-6 border-b border-[#1E2536]/60 mb-8">
                <div className="font-code text-xs text-[#94A3B8]">
                  <span className="text-[#2563EB]">from:</span> روءة
                  <br />
                  <span className="text-[#2563EB]">to:</span> batman (عبدالرحمن)
                </div>
                <div className="font-display font-semibold text-lg italic text-[#F1F4F9]/80">
                  Dear Batman,
                </div>
              </div>

              <div className="space-y-6 text-base sm:text-lg leading-relaxed text-[#F1F4F9]/90 font-sans">
                <p className="font-medium text-white">
                  انا بحبك عشان انت عبدالرحمن بكل مشاكلنا وكل لغبطتنا.. انا حبيتك اوي وهفضل بحبك اوي.. انت اغلى انسان في الدنيا عندي، وبحب اوي صورنا دي سوا.
                </p>
                <p className="text-[#38BDF8] font-medium">
                  عبدالرحمن.. انت تستاهل الحب وتستاهل تكون في مكان شبهك ومرتاح فيه.
                </p>
                <p className="text-[#94A3B8]">
                  كان نفسي اكون جنبك فيه دايما، بس ملناش نصيب غير في ان نكون في حياة بعض من بعيد.. بس اتمنالك دايما تكون كويس ومبسوط ومرتاح، وتحقق كل حاجة حلمنا بيها سوا واكتر.
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-[#1E2536]/60 flex items-center justify-between">
                <div className="font-handwritten text-3xl text-[#38BDF8]">- روءة 💙</div>
                <span className="text-xs text-[#94A3B8]/40 font-code">always in my heart</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Photo Gallery: "شكلنا حلو اوي سوا اوي اوي سوا صورنا بتبهرني و هحط صور لينا" */}
      <section id="gallery" className="py-24 px-6 max-w-6xl mx-auto border-t border-[#1E2536]/40">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-code text-[#2563EB] tracking-widest uppercase block mb-1">
              Visual Archive
            </span>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug">
              شكلنا حلو اوي سوا اوي اوي سوا صورنا بتبهرني و هحط صور لينا
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#38BDF8] max-w-sm text-right leading-relaxed font-sans font-medium">
            صورنا سوا وتحت كل صورة ريكورد بصوت روءة 🎙️💙
          </p>
        </div>

        {/* Gallery Grid with 3D Tilt Cards & Voice Record Placeholders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-2.5 group tilt-card transition cursor-pointer flex flex-col justify-between border border-white/10 hover:border-[#2563EB]/50"
              onClick={() =>
                setLightboxImage({
                  src: item.src,
                  caption: item.title,
                  tag: item.tag
                })
              }
            >
              <div>
                <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#0F1218] relative">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-4 flex flex-col justify-end">
                    <span className="text-xs text-[#38BDF8] font-code mb-1">{item.tag}</span>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                  </div>
                </div>
                <div className="p-3 text-xs text-[#94A3B8] flex justify-between items-center font-code">
                  <span>{item.file}</span>
                  <span className="font-sans text-[#F1F4F9] font-medium">{item.tag}</span>
                </div>
              </div>

              {/* Voice record placeholder */}
              <div className="px-1.5 pb-1.5">
                <div className="flex items-center justify-between bg-black/50 rounded-xl px-3 py-2 border border-white/10 hover:border-[#2563EB]/40 transition">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#2563EB]/25 text-[#38BDF8] flex items-center justify-center text-xs">
                      <i className="fa-solid fa-microphone text-[11px]" />
                    </div>
                    <span className="text-xs font-medium text-white">ريكورد بصوت روءة 🎙️</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-2 bg-[#38BDF8] rounded-full animate-pulse" />
                    <span className="w-1 h-3.5 bg-[#2563EB] rounded-full animate-pulse" />
                    <span className="w-1 h-2 bg-[#38BDF8] rounded-full animate-pulse" />
                    <span className="text-[10px] font-code text-[#94A3B8] mr-1">{item.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Developer Terminal Easter Egg Section */}
      <section id="terminal-section" className="py-12 px-6 max-w-4xl mx-auto">
        <div className="rounded-xl bg-[#0F1218] border border-[#1E2536] overflow-hidden shadow-2xl">
          {/* Terminal Header */}
          <div className="bg-[#13161F] px-4 py-3 flex items-center justify-between border-b border-[#1E2536]/60">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span
                onClick={() => setTerminalOutput([])}
                className="w-3 h-3 rounded-full bg-rose-500/80 inline-block cursor-pointer hover:opacity-100"
                title="Clear screen"
              />
              <span
                onClick={() =>
                  setTerminalOutput(prev => [
                    ...prev,
                    {
                      text: '> commands available: 5/10, 17/9, secret, batman, music, clear, help',
                      color: 'text-gray-400'
                    }
                  ])
                }
                className="w-3 h-3 rounded-full bg-amber-500/80 inline-block cursor-pointer hover:opacity-100"
                title="Help"
              />
              <span
                onClick={triggerBirthdayEgg}
                className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block cursor-pointer hover:opacity-100"
                title="5/10 birthday"
              />
              <span className="text-xs text-[#94A3B8] font-code mr-2">batman-core-system ~ zsh</span>
            </div>
            <span className="text-[11px] font-code text-[#2563EB]">developer_easter_egg.sh</span>
          </div>

          {/* Terminal Body */}
          <div
            className="p-6 font-code text-xs sm:text-sm text-[#F1F4F9]/90 space-y-3 leading-relaxed text-left"
            dir="ltr"
          >
            <p className="text-[#94A3B8]">// System diagnostic run by Ro2a for the best researcher &amp; dev</p>

            <div>
              <span className="text-emerald-400 font-bold">&gt;</span>{' '}
              <span className="text-white">system.status</span>
              <div className="text-[#94A3B8] pl-4 mt-1">
                BATMAN: <span className="text-emerald-400 font-semibold">ONLINE</span>
                <br />
                RO2A: <span className="text-amber-400 font-semibold">ABSOLUTELY NOT NORMAL</span>
              </div>
            </div>

            <div>
              <span className="text-emerald-400 font-bold">&gt;</span>{' '}
              <span className="text-white">relationship.status</span>
              <div className="text-[#2563EB] pl-4 mt-1">"it's complicated."</div>
            </div>

            <div>
              <span className="text-emerald-400 font-bold">&gt;</span>{' '}
              <span className="text-white">birthday.mode</span>
              <div className="text-[#F1F4F9] pl-4 mt-1">
                [OK] 5/10 loaded successfully with boundless respect &amp; love.
              </div>
            </div>

            {/* Custom Terminal Outputs */}
            {terminalOutput.map((item, idx) => (
              <div key={idx} className={item.color || 'text-white'}>
                {item.text}
              </div>
            ))}

            {/* Interactive Terminal Prompt */}
            <form onSubmit={handleTerminalSubmit} className="pt-3 border-t border-[#1E2536]/50 flex items-center gap-2">
              <span className="text-emerald-400 font-bold">&gt;</span>
              <input
                ref={terminalInputRef}
                type="text"
                value={terminalInputVal}
                onChange={e => setTerminalInputVal(e.target.value)}
                placeholder="try typing: 5/10, 17/9, secret, batman, help, or clear"
                className="bg-transparent border-none text-xs sm:text-sm font-code text-[#38BDF8] focus:outline-none w-full"
              />
            </form>
          </div>
        </div>
      </section>

      {/* 7. Final Climax Section: Secret Message & Perfect Track */}
      <section id="final-message" className="py-32 px-6 relative border-t border-[#1E2536]/40">
        <div className="max-w-2xl mx-auto text-center">
          {!isFinalRevealed ? (
            /* Envelope Trigger */
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#2563EB]/15 text-[#2563EB] mx-auto flex items-center justify-center text-2xl mb-5 shadow-inner animate-pulse">
                <i className="fa-solid fa-envelope-open-text" />
              </div>
              <h4 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-3">
                دي اخر حاجة في الويبسايت سيكريت مسدج
              </h4>
              <p className="text-sm text-[#94A3B8] mb-6 max-w-md mx-auto leading-relaxed">
                ممكن اغيرهالك كل شوية.. اضغط هنا عشان تفتحها ✉️
              </p>
              <button
                onClick={() => {
                  setIsFinalRevealed(true);
                  handlePlayAudio('audio-perfect');
                }}
                className="px-8 py-3.5 rounded-full bg-[#2563EB] text-white hover:bg-[#0052FF] text-sm font-semibold transition shadow-lg hover:shadow-[#2563EB]/30 flex items-center gap-2.5 mx-auto active:scale-95 cursor-pointer"
              >
                <i className="fa-solid fa-key text-xs" />
                <span>افتح السيكريت مسدج</span>
              </button>
            </div>
          ) : (
            /* Final Revealed Message Card */
            <div className="glass-card rounded-3xl p-8 sm:p-14 border-[#2563EB]/40 text-center relative overflow-hidden shadow-2xl transition-all duration-700 animate-fadeIn">
              <div className="absolute -top-12 inset-x-0 h-28 bg-[#2563EB]/15 blur-2xl" />

              <p className="text-base sm:text-lg font-medium text-[#F1F4F9]/90 mb-6 leading-relaxed">
                دي اخر حاجة في الويبسايت سيكريت مسدج ممكن اغيرهالك كل شوية اقراها وانت بتسمع الاغنية اللي كان نفسي نرقص عليها سوا في فرحنا perfect
              </p>

              {/* Play Final Song CTA */}
              <div className="my-8">
                <button
                  onClick={() => handlePlayAudio('audio-perfect')}
                  className={`px-8 py-3.5 rounded-full text-white font-semibold text-sm sm:text-base shadow-xl transition flex items-center gap-2.5 mx-auto active:scale-95 cursor-pointer ${
                    currentTrackId === 'audio-perfect' && isPlaying
                      ? 'bg-rose-600 hover:bg-rose-500'
                      : 'bg-[#2563EB] hover:bg-[#0052FF] hover:shadow-[#2563EB]/30'
                  }`}
                >
                  <i
                    className={`fa-solid ${
                      currentTrackId === 'audio-perfect' && isPlaying ? 'fa-pause' : 'fa-play'
                    } text-xs`}
                  />
                  <span>
                    {currentTrackId === 'audio-perfect' && isPlaying
                      ? 'أوقف أغنية Perfect'
                      : 'شغل أغنية Perfect (من أول I found a love 🎶)'}
                  </span>
                </button>
              </div>

              {/* Final Goodnight Sign-off */}
              <div className="pt-8 border-t border-[#1E2536]/60">
                <p className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                  نايتي نايت بيب
                </p>
                <span className="text-xs text-[#94A3B8]/60 font-code block mt-2">
                  🤍 روءة &amp; باتمان 🤍
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Developer Footer */}
      <footer className="py-12 px-6 border-t border-[#1E2536]/30 text-center text-xs text-[#94A3B8]/50 font-code">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-2">
          <p>made with HTML, CSS, JavaScript &amp; an unreasonable amount of feelings.</p>
          <div className="flex items-center gap-4 text-[11px] text-[#94A3B8]/40">
            <span>BATMAN &amp; RO2A</span>
            <span>•</span>
            <span>NO TRACKING</span>
            <span>•</span>
            <span>NO REGRETS</span>
          </div>
        </div>
      </footer>

      {/* 5/10 Birthday Modal Dialog */}
      {showBirthdayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 transition-all duration-300">
          <div className="glass-card max-w-md w-full rounded-2xl p-8 border-[#2563EB]/60 text-center relative shadow-2xl bg-[#0F1218]/95">
            <button
              onClick={() => setShowBirthdayModal(false)}
              className="absolute top-4 left-4 text-[#94A3B8] hover:text-white text-sm cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg" />
            </button>
            <div className="w-14 h-14 rounded-full bg-amber-400/15 text-amber-400 flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              <i className="fa-solid fa-cake-candles" />
            </div>
            <h3 className="text-3xl font-bold font-display text-white mb-2 tracking-wide">5 / 10</h3>
            <p className="text-base text-[#F1F4F9] font-medium leading-relaxed my-4">
              اليوم اللي اتولد فيه أحلى وأجدع بوني وباتمان في العالم 🎂💙
            </p>
            <p className="text-xs text-[#94A3B8] leading-relaxed mb-6">
              كل سنة وأنت طيب وناجح ومحقق كل اللي نفسك فيه، ومكانك دايماً محفوظ في القلب.
            </p>
            <button
              onClick={() => setShowBirthdayModal(false)}
              className="px-7 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#0052FF] text-white text-xs font-semibold transition shadow-lg cursor-pointer"
            >
              إغلاق بهدوء
            </button>
          </div>
        </div>
      )}

      {/* Hidden 17/9 Easter Egg Modal Dialog */}
      {showSpecialDateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 transition-all duration-300">
          <div className="glass-card max-w-md w-full rounded-2xl p-8 border-[#2563EB]/60 text-center relative shadow-2xl bg-[#0F1218]/95">
            <button
              onClick={() => setShowSpecialDateModal(false)}
              className="absolute top-4 left-4 text-[#94A3B8] hover:text-white text-sm cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg" />
            </button>
            <div className="w-14 h-14 rounded-full bg-[#2563EB]/15 text-[#2563EB] flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              <i className="fa-regular fa-calendar-check" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-2 tracking-wide">17 / 9</h3>
            <p className="text-base text-[#F1F4F9] font-medium leading-relaxed my-4">
              17/9 — بعض التواريخ مبتحتاجش شرح، مكانها في القلب علطول 💙
            </p>
            <p className="text-xs text-[#94A3B8] leading-relaxed mb-6">
              اليوم اللي كل حاجة بيننا اتغيرت فيه للأبد.. واللي حسيت فيه إنك أقرب حد ليا في الكون ده.
            </p>
            <button
              onClick={() => setShowSpecialDateModal(false)}
              className="px-7 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#0052FF] text-white text-xs font-semibold transition shadow-lg cursor-pointer"
            >
              إغلاق بهدوء
            </button>
          </div>
        </div>
      )}

      {/* Batman Message Modal */}
      {showBonyAlert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="glass-card max-w-md w-full rounded-3xl p-7 sm:p-8 border-blue-500/30 text-center relative bg-[#0F1218]/95 shadow-2xl">
            <div className="text-3xl mb-3">🦇❤️</div>
            <h4 className="text-xl font-bold text-white mb-4 tracking-wider uppercase font-display text-[#38BDF8]">
              message to batman
            </h4>
            <div className="bg-white/5 rounded-2xl p-5 sm:p-6 mb-6 border border-white/10 text-right">
              <p className="text-base sm:text-lg text-[#F1F4F9] leading-relaxed font-normal whitespace-pre-line">
                انت ممكن تكون شخص عادي مش خارق و مش كل يوم بتنقذ الناس ولا المدينة بس شكرا على كل مرة انقذتني فيها
                {'\n\n'}
                انا بحبك ❤️
              </p>
            </div>
            <button
              onClick={() => setShowBonyAlert(false)}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white text-base font-bold cursor-pointer shadow-lg transition transform hover:scale-105 active:scale-95"
            >
              موووااااااه
            </button>
          </div>
        </div>
      )}

      {/* Image Lightbox View */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="max-w-3xl w-full max-h-[90vh] flex flex-col items-center cursor-default"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.caption}
                className="w-full max-h-[75vh] object-contain mx-auto"
              />
            </div>
            <div className="mt-4 flex items-center justify-between w-full text-xs text-[#94A3B8] px-2 font-code">
              <span>{lightboxImage.tag}</span>
              <span className="text-[#F1F4F9] font-sans text-sm font-medium">
                {lightboxImage.caption}
              </span>
              <button
                onClick={() => setLightboxImage(null)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition text-xs font-sans cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
