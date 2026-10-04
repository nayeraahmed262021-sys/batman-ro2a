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
  baliLandscape: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  meme: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj-6g9k6J0Q5BuI5p7irUiRQu9an7UuVQA7ojo8hJmVHKKbXvQNZN1Z0D5uWA_i4_T1qQntI2XWMXqFQwQDgnZzTifR9raKyxK5d5XmrNrRWwDUjt0zj66bytwNOY0-YmTMrAQw4wHAjAW3lKnda3bN8CVRHZ9t3eTIDlUG5LSUoFNCZ8A8LJDcrUJ0RBirVqyeavJVQgZ7uaUXPy8ZqEPK00w1FIf1Nbhc2wfG9dA_DtvDTyeoxClBQ',
  childhood: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIYfehwMvsdO-D7HzgW4CTAG4iRL3QCA6fx8fdNM40NqyGn6TZ3ZH56j0e9uzraZOS_PjTy8Oeo0eFoku-WYc2flnugEvby-u4bvsnBGwws4FKlHHYhyRzmkqX7k63kJpjQeIW4EI4vrB-6la8mNsM0Gji7KqrmgLG10xxiI9fmiWvs6CYl7Oa3d3hnEaqfBrxoPzYY4kJ5ZxsfOa3cCAyJtqDhZ_CAFrib4beRnlTNSbh8Bg8o9bA4Q',
  batmanStation: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_DtLIMg-mMFly21USDod_NTefmA0MGa8vjQQYmwjbL8z16jwSyhLgL8bkwun231yDrU1jKd2wHyxH2wxnAZzPaWJ0QIuOTcWnkeUstkDJgCuHYNd2ixGPT4l3hP424nGRmUcKkFreMtRA5WmtAiPHI6PVTphF7Z-6xVIIH9n88rqd6ULKeTMVQ9P2OfdL4-wPOL9W00UkNubg7-sRXKQsd4eL-mxZ73nlsAyPF07Itg7MatxSQNMouQ',
  spacetoon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL245MxpDaQYS-iwahne09lnLew5QfRQ0rGNEUQ6MBoWxjrtHfid_wODzbwXe4elMdN2wUuSfgUVxkeQT-a2snEw_pt1XK_2ub34w6lConNsMTfs8oc4MCXgh6EjnK041nnaScKrE7f-KGV9vKPfA7tlVu-90ChrSLLOlcAr5JwUvnxRaz0pQisQEG96bpx6LNxMLkDJR8hvE-HsvPGvZxk3VqhSd76dxgrP4v0L30HJQFs9aR1sVMVw'
};

// 5 Sarcastic Creative Signal Questions for Developer Batman
const SIGNAL_QUESTIONS = [
  {
    id: 1,
    q: 'لو الكود ضرب Runtime Error على برودكشن الساعة 4 الفجر، الإشارة الكرييتف المنطقية هي: 💻',
    options: [
      'أعمل git commit -m "يارب تستر" وأقفل اللاب وأنام في هدوء 😴',
      'أرن على روءة أقولها جعان وعايز سندوتش جبنة رومي مشعوطة 🧀',
      'ألوم سيرفرات جوثام وأقول باتمان هو اللي داس ع السلك بالغلط 🦇',
      'ولا إجابة صح.. بس روءة بتحبك بكل لغبطتك ومشاكلك ❤️'
    ],
    correct: 3,
    memeImg: '/images/warda_sheikh.jpg',
    memeTitle: 'المهندس وهو ماسك وردة بعد ما السيرفر وقع بكل شياكة 🌹'
  },
  {
    id: 2,
    q: 'لو الـ API رجع 404 Not Found لقلب روءة، إزاي تعالج الـ Exception كمهندس برمجيات محترف؟ 🔌',
    options: [
      'أزود الـ Timeout وأستنى لحد ما تحن عليا ⏳',
      'أشغل كشاف باتمان في السما استغاثة في المعادي 🦇',
      'أعمل Restart للمشاعر بكلمة حلوة وكوباية نسكافيه ☕',
      'Error: القلب محجوز ومحمي لـ عبدالرحمن فقط ولا يمكن الوصول لغيره 🔒'
    ],
    correct: 3,
    memeImg: '/images/completely_layes.jpg',
    memeTitle: 'كومبليتلي لايص.. بس وربنا بحبك! 💐'
  },
  {
    id: 3,
    q: 'في لغة البرمجة لو كتبنا: if (batman.loves_ro2a == true) الناتج المنطقي هيكون: 🧠',
    options: [
      'Infinite Loop من الحنية والكلام الحلو بالليل 🌙',
      'Stack Overflow في القلب والمشاعر اللي مش بتخلص 📈',
      'Memory Leak لذيذ بس شكلنا قمر سوا 💙',
      'Syntax Error لأن مفيش مقارنة أصلاً.. دي حقيقة كونية مثبتة! ✨'
    ],
    correct: 3,
    memeImg: '/images/nesreen_heart.jpg',
    memeTitle: 'يا جارحني بلقمة ناشفة.. وأنا قلبي مش مستحمل هيبتك ❤️'
  },
  {
    id: 4,
    q: 'الإشارة اللي بتثبت بالدليل القاطع إنك أجدع وأشطر مبرمج في تاريخ البشرية: 🚀',
    options: [
      'بتصلح الـ Bug ومبتعرفش أصلاً كانت شغالة غلط إزاي 💻',
      'بتفهم كلام روءة حتى وهي مش عارفة تعبر من غير ما تتكلم 👀',
      'بتعمل Deploy يوم الخميس بالليل والمصنع ميولعش 🔥',
      'كل ما سبق صحيح وشهادة الآيزو معتمدة ومختومة من نون 🏅'
    ],
    correct: 3,
    memeImg: '/images/warda_sheikh.jpg',
    memeTitle: 'اتفضل الوردة دي عشان أنت عبقري ومفيش منك اتنين 🌹'
  },
  {
    id: 5,
    q: 'إشارة الإنذار الأحمر والأخطر: لو روءة فجأة قالتلك "براحتك يا بوني".. التصرف السليم: ⚠️',
    options: [
      'اهرب فوراً بالبايك على سرعة 200 كم/س 🏍️💨',
      'لا براحتك ولا نيلة.. اعتذر فوراً وهات شوكولاتة ووردة 🍫🌹',
      'اكتب سكريبت يحلل نبرة الصوت ويعرف الغلط فين 🔍',
      'استسلم لمصيرك واطلب الحماية من باتمان شخصياً 🦇'
    ],
    correct: 1,
    memeImg: '/images/eid_milad_garhy.jpg',
    memeTitle: 'سنة حلوة يا جميل.. يا خوخ وتقيل ومالكش مثيل! 🎂'
  }
];

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

  // 1. لعبة الإشارات state
  const [signalIndex, setSignalIndex] = useState<number>(0);
  const [signalSelected, setSignalSelected] = useState<number | null>(null);
  const [signalShowFeedback, setSignalShowFeedback] = useState<boolean>(false);
  const [signalDone, setSignalDone] = useState<boolean>(false);

  // 2. فاصل الكرتون الصغنن (الولد والبنت والكرش)
  const [isBoyRunning, setIsBoyRunning] = useState<boolean>(false);
  const [girlGiggling, setGirlGiggling] = useState<boolean>(false);
  const [tickleCount, setTickleCount] = useState<number>(0);

  // 3. لعبة الكروت (من 1 لـ 4)
  const [selectedCard, setSelectedCard] = useState<number>(1);

  // 4. بازل بالي (كارت 4)
  const [puzzleTiles, setPuzzleTiles] = useState<number[]>([1, 2, 0, 4, 3, 5, 7, 6, 8]);
  const [puzzleSelectedTile, setPuzzleSelectedTile] = useState<number | null>(null);
  const [puzzleWon, setPuzzleWon] = useState<boolean>(false);
  const [puzzleMoves, setPuzzleMoves] = useState<number>(0);

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

  // Tacky Love Rain (Red hearts & ribbons falling)
  const triggerTackyLoveRain = () => {
    handlePlayAudio('audio-chaos');
    const end = Date.now() + 20 * 1000;
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

  // Signal Quiz Handlers
  const handleSelectSignalOption = (optionIndex: number) => {
    if (signalShowFeedback) return;
    setSignalSelected(optionIndex);
    setSignalShowFeedback(true);
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#EF4444', '#38BDF8']
      });
    } catch {
      // ignore
    }
  };

  const handleNextSignalQuestion = () => {
    if (signalIndex < SIGNAL_QUESTIONS.length - 1) {
      setSignalIndex(prev => prev + 1);
      setSignalSelected(null);
      setSignalShowFeedback(false);
    } else {
      setSignalDone(true);
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#FF1493', '#F59E0B', '#3B82F6', '#10B981']
        });
      } catch {
        // ignore
      }
    }
  };

  const handleResetSignal = () => {
    setSignalIndex(0);
    setSignalSelected(null);
    setSignalShowFeedback(false);
    setSignalDone(false);
  };

  // Cartoon Interlude Tickle Handler
  const handleBoyTickle = () => {
    if (isBoyRunning) return;
    setIsBoyRunning(true);
    setGirlGiggling(false);

    setTimeout(() => {
      setGirlGiggling(true);
      setTickleCount(prev => prev + 1);
      try {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#FF1493', '#38BDF8', '#F59E0B', '#EC4899']
        });
      } catch {
        // ignore
      }
    }, 700);

    setTimeout(() => {
      setIsBoyRunning(false);
    }, 2400);
  };

  // Bali Puzzle Tile Click Handler
  const handlePuzzleTileClick = (index: number) => {
    if (puzzleWon) return;
    if (puzzleSelectedTile === null) {
      setPuzzleSelectedTile(index);
    } else {
      // Swap tiles
      const nextTiles = [...puzzleTiles];
      const temp = nextTiles[puzzleSelectedTile];
      nextTiles[puzzleSelectedTile] = nextTiles[index];
      nextTiles[index] = temp;
      setPuzzleTiles(nextTiles);
      setPuzzleSelectedTile(null);
      setPuzzleMoves(prev => prev + 1);

      // Check if solved (0 to 8)
      const isSolved = nextTiles.every((val, i) => val === i);
      if (isSolved) {
        setPuzzleWon(true);
        try {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#10B981', '#38BDF8', '#F59E0B', '#FFFFFF']
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const handleResetPuzzle = () => {
    setPuzzleTiles([1, 2, 0, 4, 3, 5, 7, 6, 8]);
    setPuzzleSelectedTile(null);
    setPuzzleWon(false);
    setPuzzleMoves(0);
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

          {isPlaying && (
            <button
              onClick={handleStopAudio}
              className="text-[#94A3B8] hover:text-rose-400 text-xs px-1.5 transition ml-1"
              title="كتم الصوت"
            >
              <i className="fa-solid fa-volume-xmark" />
            </button>
          )}
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
                    <div className="absolute bottom-2 inset-x-2 bg-black/85 text-amber-300 text-xs font-bold py-1.5 px-3 rounded-xl">
                      "لما روءة تعمل قلب لباتمان بس لسه تقلان عليها 😂❤️"
                    </div>
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
                      <div className="absolute bottom-2 inset-x-2 bg-black/85 text-yellow-300 text-xs font-bold py-1.5 px-3 rounded-xl">
                        "يا خوخ وتـقـيل ومالكش مثيل.. وفي عيني أمير خطير! 🎂🦆"
                      </div>
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
                  <p className="text-xs text-amber-300 mt-2 font-medium">
                    (اضغط واسمع المهرجان مع مطر القلوب والشرايط الملعلعة 20 ثانية! 🎉)
                  </p>
                </div>
              </div>

              {/* Game 1: لعبة الإشارات */}
              <div className="my-14 p-6 sm:p-10 rounded-3xl bg-black/50 border-2 border-amber-400/40 shadow-2xl text-right">
                <div className="text-center mb-8 pb-4 border-b border-white/10">
                  <span className="text-xs font-code text-amber-400 font-bold uppercase tracking-widest block mb-1">
                    Special Developer Challenge
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-2">
                    <span>لعبة الإشارات الكرييتف</span>
                    <span className="text-2xl">🚦💻</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 max-w-lg mx-auto">
                    بما إنك مبرمج عبقري وذكي جداً.. فدي إشارات عشوائية عبيطة جداً ولا واحدة منهم صح، بس معمولة عشان تضحك من قلبك! 😂
                  </p>
                </div>

                {!signalDone ? (
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 text-xs font-code">
                      <span className="text-amber-400 font-bold">
                        الإشارة {signalIndex + 1} من {SIGNAL_QUESTIONS.length}
                      </span>
                      <span className="text-[#38BDF8]">
                        مستوى الذكاء: خارق كالعادة 🧠
                      </span>
                    </div>

                    <h5 className="text-base sm:text-lg font-bold text-white mb-6 leading-relaxed">
                      {SIGNAL_QUESTIONS[signalIndex].q}
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {SIGNAL_QUESTIONS[signalIndex].options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectSignalOption(oIdx)}
                          disabled={signalShowFeedback}
                          className={`p-4 rounded-xl border text-right text-xs sm:text-sm font-medium transition cursor-pointer flex items-start gap-2.5 ${
                            signalSelected === oIdx
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                              : 'bg-black/40 border-white/10 text-[#F1F4F9] hover:bg-white/10'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs font-code shrink-0">
                            {oIdx + 1}
                          </span>
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>

                    {/* Feedback with Meme */}
                    {signalShowFeedback && (
                      <div className="pt-6 border-t border-white/10 animate-fadeIn">
                        <div className="max-w-xs mx-auto mb-4 p-2 bg-white/10 rounded-2xl border border-white/20">
                          <img
                            src={SIGNAL_QUESTIONS[signalIndex].memeImg}
                            alt="Meme"
                            className="w-full aspect-[4/3] object-cover rounded-xl"
                          />
                          <p className="text-xs text-amber-300 font-bold text-center mt-2">
                            {SIGNAL_QUESTIONS[signalIndex].memeTitle}
                          </p>
                        </div>
                        <div className="text-center">
                          <button
                            onClick={handleNextSignalQuestion}
                            className="px-7 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-sm shadow-lg cursor-pointer transition"
                          >
                            {signalIndex < SIGNAL_QUESTIONS.length - 1 ? 'الإشارة اللي بعدها ➡️' : 'عرض النتيجة والاعتذار 🏆'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Apology & Duck Meme at the end of signals */
                  <div className="text-center bg-gradient-to-br from-rose-950/40 via-amber-950/30 to-black/60 p-8 rounded-3xl border-2 border-rose-400/50 shadow-2xl animate-fadeIn">
                    <h4 className="text-2xl sm:text-3xl font-black text-rose-300 mb-3">
                      سوري ع العبط دا 😂
                    </h4>
                    <p className="text-sm text-[#F1F4F9] max-w-md mx-auto mb-6 leading-relaxed">
                      حقك عليا يا بوني.. بس مقدرتش أقاوم فقرة العباطة دي مع أشطر وأذكى باشمهندس في الدنيا! 💙
                    </p>
                    <div className="max-w-xs mx-auto mb-6 p-2 bg-white/10 rounded-2xl border border-white/20 shadow-2xl">
                      <img
                        src={IMAGES.bataE3tezar}
                        alt="وردة اعتذار عما بضر منى"
                        className="w-full aspect-[4/3] object-cover rounded-xl"
                      />
                      <p className="text-xs text-yellow-300 font-bold text-center mt-2">
                        "وردة اعتذار عما بضر منى 🦆🌹"
                      </p>
                    </div>
                    <button
                      onClick={handleResetSignal}
                      className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer border border-white/20 transition"
                    >
                      إعادة لعبة الإشارات 🔄
                    </button>
                  </div>
                )}
              </div>

              {/* Cartoon Interlude: الولد والبنت والكرش */}
              <div className="my-14 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950/30 via-pink-950/30 to-blue-950/30 border-2 border-pink-400/40 shadow-2xl text-center">
                <span className="text-xs font-code text-pink-300 uppercase tracking-widest block mb-1">
                  Cute Interactive Interlude
                </span>
                <h4 className="text-2xl sm:text-3xl font-black text-white mb-2 flex items-center justify-center gap-2">
                  <span>فاصل لطيف: عبدالرحمن وروءة الصغننين</span>
                  <span className="text-2xl">👶👧💖</span>
                </h4>
                <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto mb-8">
                  اضغط على الولد عشان يجري يدغدغ كرش البنوتة الصغننة وهي تضحك من قلبها!
                </p>

                {/* Animated Cartoon Playground */}
                <div className="relative max-w-md mx-auto h-44 bg-black/40 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-between px-8 mb-6">
                  {/* Floating hearts */}
                  {girlGiggling && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-3xl animate-ping text-pink-400">💖</span>
                      <span className="text-2xl animate-bounce text-yellow-300 mx-3">😂</span>
                      <span className="text-3xl animate-pulse text-rose-400">✨</span>
                    </div>
                  )}

                  {/* Little Boy (Abd El-Rahman) */}
                  <div
                    onClick={handleBoyTickle}
                    className={`cursor-pointer transition-transform duration-700 flex flex-col items-center ${
                      isBoyRunning ? 'translate-x-[160px] scale-110' : 'hover:scale-110'
                    }`}
                  >
                    <div className="text-5xl animate-bounce">👦</div>
                    <span className="text-[11px] font-bold text-[#38BDF8] bg-black/60 px-2 py-0.5 rounded-full mt-1">
                      عبدالرحمن
                    </span>
                  </div>

                  {/* Action prompt if idle */}
                  <div className="text-center pointer-events-none">
                    <span className="text-xs text-pink-300 font-sans animate-pulse">
                      {isBoyRunning ? 'بيجري يدغدغها! 🏃‍♂️💨' : 'اضغط على الولد 👈'}
                    </span>
                  </div>

                  {/* Little Girl (Ro2a with round tummy) */}
                  <div className={`flex flex-col items-center ${girlGiggling ? 'animate-bounce' : ''}`}>
                    <div className="text-5xl relative">
                      👧
                      <span className="absolute -bottom-1 left-2 text-base">🤰</span>
                    </div>
                    <span className="text-[11px] font-bold text-pink-300 bg-black/60 px-2 py-0.5 rounded-full mt-1">
                      كرش روءة الصغنن
                    </span>
                  </div>
                </div>

                {/* Speech bubble / status */}
                <div className="min-h-12 flex items-center justify-center mb-4">
                  {girlGiggling ? (
                    <div className="p-3 bg-pink-500/20 border border-pink-400/50 rounded-2xl text-pink-200 text-xs sm:text-sm font-bold animate-fadeIn">
                      "ههههههه بطل شقاوة ودغدغة يا بوني.. بطني وجعتني من الضحك بس بموت فيك! 😂💖"
                    </div>
                  ) : (
                    <div className="text-xs text-[#94A3B8]">
                      عدد مرات الدغدغة: <span className="text-amber-400 font-bold">{tickleCount}</span> مرة ومبسوطين هما الاتنين سوا! 🥰
                    </div>
                  )}
                </div>

                <button
                  onClick={handleBoyTickle}
                  className="px-7 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold text-xs sm:text-sm shadow-xl transition cursor-pointer flex items-center gap-2 mx-auto active:scale-95"
                >
                  <i className="fa-solid fa-hand text-yellow-200" />
                  <span>دغدغ كرش البنوتة 🏃‍♂️✨</span>
                </button>
              </div>

              {/* Game 2: لعبة الكروت (من 1 لـ 4) */}
              <div className="my-14 p-6 sm:p-10 rounded-3xl bg-black/50 border-2 border-[#2563EB]/40 shadow-2xl text-right">
                <div className="text-center mb-8 pb-4 border-b border-white/10">
                  <span className="text-xs font-code text-[#38BDF8] uppercase tracking-widest block mb-1">
                    Card Lottery Game
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-2">
                    <span>لعبة الكروت السحرية</span>
                    <span className="text-2xl">🃏✨</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 max-w-md mx-auto">
                    اختر رقم كارت من 1 لـ 4.. كل كارت مخبي صورة مختلفة وأغنية مميزة!
                  </p>

                  {/* 4 Cards Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                    {[1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        onClick={() => setSelectedCard(num)}
                        className={`w-14 h-20 sm:w-16 sm:h-24 rounded-2xl border-2 font-black text-xl sm:text-2xl transition-all cursor-pointer flex flex-col items-center justify-center shadow-lg transform hover:-translate-y-1 ${
                          selectedCard === num
                            ? 'bg-gradient-to-b from-[#2563EB] to-blue-700 border-white text-white scale-105 ring-2 ring-blue-400'
                            : 'bg-black/60 border-white/20 text-[#94A3B8] hover:text-white hover:border-[#2563EB]'
                        }`}
                      >
                        <span className="text-xs font-code opacity-70">كارت</span>
                        <span>{num}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card 1: باتمان */}
                {selectedCard === 1 && (
                  <div className="glass-card rounded-2xl p-6 border border-[#2563EB]/40 text-center animate-fadeIn max-w-lg mx-auto">
                    <span className="text-xs font-code text-[#38BDF8] font-bold block mb-2">
                      كارت رقم 1 // The Dark Knight 🦇
                    </span>
                    <div className="relative aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden bg-black mb-4 border border-white/10">
                      <img
                        src={IMAGES.batmanStation}
                        alt="باتمان"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h5 className="text-lg font-bold text-white mb-2">ضوء لمع وسط المدينة</h5>
                    <p className="text-xs sm:text-sm text-[#94A3B8] mb-4">
                      أنت باتمان الحقيقي اللي بينقذني في كل مرة.. بطل القصة للأبد 🖤
                    </p>
                    <button
                      onClick={() => handlePlayAudio('audio-batman')}
                      className="px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#0052FF] text-white font-bold text-xs sm:text-sm cursor-pointer shadow-lg transition flex items-center gap-2 mx-auto"
                    >
                      <i className="fa-solid fa-play text-xs" />
                      <span>شغل أغنية باتمان (ضوء لمع وسط المدينة) 🦇</span>
                    </button>
                  </div>
                )}

                {/* Card 2: البحر */}
                {selectedCard === 2 && (
                  <div className="glass-card rounded-2xl p-6 border border-[#38BDF8]/40 text-center animate-fadeIn max-w-lg mx-auto">
                    <span className="text-xs font-code text-[#38BDF8] font-bold block mb-2">
                      كارت رقم 2 // Sea &amp; Sunshine 🌊
                    </span>
                    <div className="relative aspect-[4/5] max-w-xs mx-auto rounded-2xl overflow-hidden bg-black mb-4 border border-white/10">
                      <img
                        src={IMAGES.photo2}
                        alt="صورتك ع البحر"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h5 className="text-lg font-bold text-white mb-2">صورتك وأنت على البحر</h5>
                    <p className="text-base sm:text-lg font-bold text-[#38BDF8] my-3 leading-relaxed">
                      "نفسي في بيبي شبهك كدا 🌊👶💙"
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      بنفس ضحكتك وعيونك الطيبة وحنيتك اللي بالدنيا كلها.
                    </p>
                  </div>
                )}

                {/* Card 3: أبطال الديجيتال */}
                {selectedCard === 3 && (
                  <div className="glass-card rounded-2xl p-6 border border-emerald-400/40 text-center animate-fadeIn max-w-lg mx-auto">
                    <span className="text-xs font-code text-emerald-400 font-bold block mb-2">
                      كارت رقم 3 // Digimon Heroes 👾
                    </span>
                    <div className="relative aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden bg-black mb-4 border border-white/10">
                      <img
                        src={IMAGES.spacetoon}
                        alt="أبطال الديجيتال"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h5 className="text-lg font-bold text-white mb-2">أبطال الديجيتال وسبيستون</h5>
                    <p className="text-base font-bold text-emerald-300 my-2">
                      "أنت البطل الحقيقي بتاعي 💙"
                    </p>
                    <p className="text-xs text-[#94A3B8] mb-4">
                      ذكريات الطفولة وبطلي المفضل في الواقع والخيال.
                    </p>
                    <button
                      onClick={() => handlePlayAudio('audio-spacetoon')}
                      className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-lg transition flex items-center gap-2 mx-auto"
                    >
                      <i className="fa-solid fa-wand-magic-sparkles text-xs" />
                      <span>شغل أغنية أبطال الديجيتال 🎶</span>
                    </button>
                  </div>
                )}

                {/* Card 4: بازل الـ 1000 قطعة في بالي */}
                {selectedCard === 4 && (
                  <div className="glass-card rounded-3xl p-6 sm:p-8 border-2 border-amber-400/50 text-center animate-fadeIn max-w-2xl mx-auto">
                    <span className="text-xs font-code text-amber-300 font-bold tracking-widest uppercase block mb-2">
                      كارت رقم 4 // The Grand Finale Puzzle 🌴
                    </span>
                    <h5 className="text-xl sm:text-2xl font-black text-white mb-3">
                      أكبر لعبة: بازل الـ 1000 قطعة في بالي 🧩✨
                    </h5>
                    <div className="p-4 rounded-2xl bg-black/50 border border-amber-300/30 text-right mb-6 text-xs sm:text-sm text-[#F1F4F9] leading-relaxed">
                      "دا آخر كارت وهنا أكبر لعبة بما إنك استحملت العبث اللي فات دا كله! بازل مكون من 1000 قطعة عشان تلعبها في أي وقت وندخل نلعبها سوا أنا وأنت.. المنظر ده في بالي خضار وبحر وشمس خفيفة وكل حاجة جميلة.. نفسي نكون هناك سوا 🌴🌊☀️"
                    </div>

                    {/* Interactive Bali Jigsaw Mini-Game */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-xs text-[#94A3B8] font-code mb-3 px-2">
                        <span>الحركات: {puzzleMoves} 🔄</span>
                        <span className="text-amber-300 font-bold">
                          {puzzleWon ? '🎉 مبروك حليت البازل!' : 'اضغط على قطعتين لتبديل أماكنهم'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 max-w-xs mx-auto aspect-square p-2 bg-black/80 rounded-2xl border-2 border-amber-400/60 shadow-2xl">
                        {puzzleTiles.map((tileIndex, slotIndex) => {
                          const isSelected = puzzleSelectedTile === slotIndex;
                          const row = Math.floor(tileIndex / 3);
                          const col = tileIndex % 3;
                          return (
                            <button
                              key={slotIndex}
                              onClick={() => handlePuzzleTileClick(slotIndex)}
                              className={`relative w-full h-full rounded-lg overflow-hidden border transition transform active:scale-95 cursor-pointer ${
                                isSelected ? 'ring-4 ring-amber-400 scale-105 z-10' : 'border-black'
                              }`}
                              style={{
                                backgroundImage: `url(${IMAGES.baliLandscape})`,
                                backgroundSize: '300% 300%',
                                backgroundPosition: `${col * 50}% ${row * 50}%`
                              }}
                            >
                              <span className="absolute bottom-1 right-1 text-[10px] font-code bg-black/70 text-white px-1 rounded">
                                {tileIndex + 1}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {puzzleWon && (
                        <div className="mt-4 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-center animate-bounce">
                          <p className="text-sm font-bold text-emerald-300">
                            🏆 عبقري وحليت البازل! وعقبال ما نروح بالي ونشوف المنظر ده سوا بجد 🌴✈️💙
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-center gap-3">
                        <button
                          onClick={handleResetPuzzle}
                          className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer border border-white/20 transition"
                        >
                          إعادة ترتيب البازل 🔄
                        </button>
                      </div>
                    </div>

                    {/* Full 1000 Pieces Landscape Preview */}
                    <div className="pt-4 border-t border-white/10">
                      <span className="text-xs text-[#94A3B8] font-code block mb-2">
                        [ معاينة منظر بالي الأصلي الكامل - 1000 Pieces ]
                      </span>
                      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/20 shadow-xl max-w-md mx-auto">
                        <img
                          src={IMAGES.baliLandscape}
                          alt="Bali Landscape"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                          <p className="text-xs text-white font-medium text-right">
                            🌴 جزيرة بالي — خضار وبحر وشمس خفيفة ونفسي نكون هناك سوا.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
