import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { audioEngine, TRACKS } from './audioEngine';

// Images hotlinked from the user's HTML specification
const IMAGES = {
  hero: '/batman-ro2a.jpg',
  meme: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj-6g9k6J0Q5BuI5p7irUiRQu9an7UuVQA7ojo8hJmVHKKbXvQNZN1Z0D5uWA_i4_T1qQntI2XWMXqFQwQDgnZzTifR9raKyxK5d5XmrNrRWwDUjt0zj66bytwNOY0-YmTMrAQw4wHAjAW3lKnda3bN8CVRHZ9t3eTIDlUG5LSUoFNCZ8A8LJDcrUJ0RBirVqyeavJVQgZ7uaUXPy8ZqEPK00w1FIf1Nbhc2wfG9dA_DtvDTyeoxClBQ',
  childhood: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIYfehwMvsdO-D7HzgW4CTAG4iRL3QCA6fx8fdNM40NqyGn6TZ3ZH56j0e9uzraZOS_PjTy8Oeo0eFoku-WYc2flnugEvby-u4bvsnBGwws4FKlHHYhyRzmkqX7k63kJpjQeIW4EI4vrB-6la8mNsM0Gji7KqrmgLG10xxiI9fmiWvs6CYl7Oa3d3hnEaqfBrxoPzYY4kJ5ZxsfOa3cCAyJtqDhZ_CAFrib4beRnlTNSbh8Bg8o9bA4Q',
  batmanStation: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_DtLIMg-mMFly21USDod_NTefmA0MGa8vjQQYmwjbL8z16jwSyhLgL8bkwun231yDrU1jKd2wHyxH2wxnAZzPaWJ0QIuOTcWnkeUstkDJgCuHYNd2ixGPT4l3hP424nGRmUcKkFreMtRA5WmtAiPHI6PVTphF7Z-6xVIIH9n88rqd6ULKeTMVQ9P2OfdL4-wPOL9W00UkNubg7-sRXKQsd4eL-mxZ73nlsAyPF07Itg7MatxSQNMouQ',
  spacetoon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL245MxpDaQYS-iwahne09lnLew5QfRQ0rGNEUQ6MBoWxjrtHfid_wODzbwXe4elMdN2wUuSfgUVxkeQT-a2snEw_pt1XK_2ub34w6lConNsMTfs8oc4MCXgh6EjnK041nnaScKrE7f-KGV9vKPfA7tlVu-90ChrSLLOlcAr5JwUvnxRaz0pQisQEG96bpx6LNxMLkDJR8hvE-HsvPGvZxk3VqhSd76dxgrP4v0L30HJQFs9aR1sVMVw',
  gallery1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2wyi9ZklVRxC-YaAFo0r64iYiZN5aDnRTDJ1dEEOvRI7POuHUrGlyT0umzGjGE_4CeaYGSeMwXgmnUG2YyYJwN7hwCnU8cn8YDgIdqvRDG4xOiHXb4YPgegzWRuPWMK-SwJQL9ue6ghrANibcPnWgTv0Xs-K62oM5WPCd9VzlQlOEBok4F2NKAMFk7VHlUEg8yfyvgG3aDNdQf-xKKTtn4gD_dw1qrWPM26gHvDbThJpEvlwYZRlx0A',
  gallery2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzst6cCnp_BHLFpGubay5eW7F0f_8r4KBDtu3YKaCrMuMIn4fbcFXOux8NSMcFyGYSVmVhSEAXO09ca2KOub4M08O0NmrCbVY19YaFx71iXyUuacO7zmL5SfrpZyxDe1QTRXzKkgjANgSzwJBkvkEjy7LbJ2wZuQ54sfRjNcaHrsgmw3TchCHJF5cZv1YwWRXWmdTswB4ADMGbNZxoPqhjGzs8o1KOhvS04dm5D3lvGCT3V8Yg3er8fg',
  gallery3: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTUQoSlz42bCriviXe2SrT0P-8QvGNNBqw-sYrHJSSRVknfhN0c0wsNt-kxspSe2tgpdJ84Cuf7EiC5SUCZnE_85tM6_g67CWtv0MGfZ8Q1qbOeb7adbXaRiFxXeKuDc294e43PtwvgdMZjsi1tDTSs-a4vn0TfBQ7nqTH9bPVx5DEnkWMyOSv9C3yY0Nk1LY2kgCpNVY9HcT3fsbpOSdLE9C0uUS2-xFW4fDmze2hDBB71GOGo7cUlA',
  gallery4: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0JAAZgleNucg9MSzyJQHqwJ2JSzYK1gFhotBeSA1kGCD6Cidy3n7mc0JvC66peUn9XNC789C17nRyvh-dwId9oM9RBkDmgzcy_reljuwL40W5uRhQMywcHA1u-qjEj2s03PQp6hYCwIWhUCWIsBpTpw4Eo6duU0p5Yw1S2oZ9kj5-5wwGyBplqo_CVYT_4H2iJ4x21ry6LASVgZGIAOcuCaV3VVPqH47v1SMZrjV5Df2DbWOYsuwvAQ',
  gallery5: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgxsnBtZjEOcPLPsbdcHvYLf2Th8okLIYfD9WJCX25jciJ24FJ8UmT2mVY-u53V7Ao1t4juCwfmvCf_gArC4Tg9dnAqVM5izZkbT87Tl5uD3iYD3SqDdD4x40viL2wsOlThgxGrICeSu8zIZ7T0kU-nymsaA2Qs_0qPEcIeFPPnIKUmXxlnj4b9vK5LuCVBRgqOULlbrTDi1lPa2Zx016eyF1yoYK2hWPFrozwCPfELKtxDnQOJcJrZQ',
  gallery6: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9O7PZdEsEmYUPQGPQn3YGiFoORx4052ougXoRDNooJLv1UR0DL7Ie16_xKHQPuagPqppxs0ZOIrXwBfMb2CRloqrxyUYJZIAnyBVgxq7P63NXd_ch3Ht2ZPiED2f69qZLdEar1SaVDfhtfPlcdYqYIMbTIlwqPgbPt_QhYCSe-Yn9T_BdZ9Nl_utuRZL5ebhApVVQzjnmNlxi-U3p-WUYuaUUGWP3zrQnPiXrcaHx9wpVflvmoxUDag'
};

// 2000s Nostalgia & Fino Quiz Data
const FINO_QUIZ_QUESTIONS = [
  {
    q: 'السندوتش الفينو اللي كان بيقعد في كيس نايلون من 7 الصبح لحد الحصة الأخيرة.. كان بيبقى إيه وسره إيه؟ 🥖',
    options: [
      'جبنة بيضا دمياطي مع خيار دبلان مبلول (ساندوتش كلاسيك معصور)',
      'حلاوة طحينية سايحة ملزقة في سقف الحلق',
      'لانشون حلواني بايت من يوم الخميس وريحته واصلة لحوش المدرسة',
      'كل ما سبق، وده كان سر المناعة القومية لجيل الألفينات 🛡️'
    ],
    correct: 3,
    comment: 'بالظبط! ميكس المناعة الخارق اللي خلى الجيل يقف على رجليه ضد أي برد أو زعل!'
  },
  {
    q: 'لما كارت نت الـ 10 جنيه كان بيقرب يخلص في شات الياهو ماسنجر سنة 2005.. الجملة الرسمية كانت: 💬',
    options: [
      'brb tyt ya basha w tc (هقوم اتعشى وراجع على مهلك وخلي بالك من نفسك)',
      'مسألة جبر للثانوية العامة',
      'شفرة سرية بيفتحوا بيها سايبر الفرسان بعد العشا',
      'ألو حول يا جوثام كارت الشحن طار'
    ],
    correct: 0,
    comment: 'لغة عصر العمالقة! tyt و brb و tc و w8 و cya.. اختصارات أعظم من الذكاء الاصطناعي!'
  },
  {
    q: 'اسم الفولدر السري اللي كان محطوط على كمبيوتر البيت جواه كليب عمرو دياب وحلقات سبيستون؟ 📁',
    options: [
      'New Folder (2) جواه New Folder (3) مستخبي في ملفات الويندوز',
      'أحدث أغاني وكليبات صيف 2004',
      'ملفات هامة لشغل بابا ممنوع اللمس ⚠️',
      'clip_final_amr_diab_حقيقي_بلوتوث.3gp'
    ],
    correct: 0,
    comment: 'طبعاً! الفولدر المستخبي جوا C:\\WINDOWS عشان محدش من البيت يدخل يمسحه بالغلط!'
  },
  {
    q: 'فك الشفرة الفرانكو الذكية دي: "3ala fekra enta a7la batman w ba7ebak gdn 2"؟ 🔢',
    options: [
      'على فكرة أنت أحلى باتمان وبحبك جداً جداً 💙',
      'معادلة كيمياء لتحضير الجبنة الرومي المقلية',
      'كود كول تون إيهاب توفيق سنة 2006',
      'باسورد شبكة واي فاي السايبر'
    ],
    correct: 0,
    comment: 'صح 100%! شفرة فرانكو أصلية بتعترف بأعلى درجات الحب لباتمان!'
  },
  {
    q: 'لو خالتك شافت باتمان لابس الكاب الأسود وماشي فوق السطوح الساعة 7 الصبح في طوبة.. هتقوله إيه؟ 👵🦇',
    options: [
      'انزل يا ابني هتسقع.. خدلك سندوتش جبنة رومي في إيدك! 🥖',
      'إيه الشياكة دي يا جوثام.. ما شاء الله تبارك الله',
      'متنساش تصبح على طنط ميرفت في جروب العيلة 🌹',
      'هو أنت ابن الحاج عبدالرحمن؟ الشبه باين سبحان الله'
    ],
    correct: 0,
    comment: 'مستحيل الست المصرية تسيبك تنزل تحارب الجريمة ومعدتك فاضية من غير فينو وشاي بلبن!'
  }
];

// Family WhatsApp Cards Data
const FAMILY_GROUP_CARDS = [
  {
    greeting: '🌹 صباح الورد والياسمين والفل 🌹',
    body: 'أجمل صباح على عيون الغالي بوني.. نهارك أبيض ومشرق زي رغيف الفينو الطازة الخارج من الفرن، وربنا يبعد عنك عيون الحاسدين وعصابات جوثام! 🧿🥖',
    dua: 'اللهم ارزق بوني راحة البال وسندوتشات جبنة رومي لا تنتهي.. أرسلها لـ 7 تضمن الروقان اليوم! ✨',
    sticker: '☕ صباح الفل مع شاي بلبن',
    bg: 'from-amber-900/40 via-rose-950/40 to-yellow-950/40'
  },
  {
    greeting: '💖 جمعة مباركة يا غاليين 💖',
    body: 'نصيحة صباحية من جروب العيلة لباتمان: لا تخرج لمحاربة الأشرار ومعدتك فارغة، فإن سندوتش الفينو سلاح لا يستهان به! 🥖🦇',
    dua: 'اللهم اجعل أيام بوني كلها عسل وضحك ومحبة.. ولا ترنا فيه سوءاً أبداً 🤲',
    sticker: '🕊️ جمعة طيبة ومعطرة بذكر الله',
    bg: 'from-emerald-950/40 via-teal-950/40 to-slate-900/40'
  },
  {
    greeting: '🌸 ورود وأزهار لقلب بوني 🌸',
    body: 'تنبيه عاجل من خالتك: تم رصد كائن وسيم وقمور لابس كاب أسود، يرجى تقديم كوباية شاي بلبن سخنة وبسكوت فيري له فوراً! ☕🍪',
    dua: 'من يقرأ هذه الرسالة يبتسم ويكتب تم في التعليقات فوراً! 🌹',
    sticker: '💐 باقة ورد من بستان العائلة',
    bg: 'from-purple-950/40 via-pink-950/40 to-slate-900/40'
  },
  {
    greeting: '✨ حكمة الألفينات الخالدة ✨',
    body: 'إذا كان حبيبك باتمان، فاعمليله سندوتش حلاوة بالقشطة ومتقلقيش من الجريمة في المدينة! الفينو أساس البناء والمناعة 💪🥖',
    dua: 'دمت لنا فخراً وسنداً يا أجدع بوني في الدنيا 💙',
    sticker: '🥖 وسام الفينو الذهبي',
    bg: 'from-amber-950/40 via-orange-950/40 to-slate-900/40'
  },
  {
    greeting: '💌 رسالة متداولة عبر البلوتوث 2004 💌',
    body: 'رسالة خاصة لـ BATMAN: أرسلها لعشرة أشخاص وستسمع خبراً جميلاً خلال ساعتين، وإذا تجاهلتها سيفرغ شحن موبايلك النوكيا الليلة! 📱⚡',
    dua: 'ربنا يحفظك ويسعدك يا حبيب قلوبنا 🤍',
    sticker: '📲 نوكيا 3310 لا ينكسر',
    bg: 'from-blue-950/40 via-indigo-950/40 to-slate-900/40'
  }
];

export default function App() {
  // Audio state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [currentTrackTitle, setCurrentTrackTitle] = useState<string>('الموسيقى: متوقفة');

  // 2000s & Fino Hub State
  const [finoTab, setFinoTab] = useState<'quiz' | 'family' | 'sandwich'>('quiz');

  // Quiz state
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizShowFeedback, setQuizShowFeedback] = useState<boolean>(false);
  const [quizDone, setQuizDone] = useState<boolean>(false);

  // Family WhatsApp cards
  const [familyIndex, setFamilyIndex] = useState<number>(0);
  const [familyCopied, setFamilyCopied] = useState<boolean>(false);

  // Sandwich builder
  const [sandwichBread, setSandwichBread] = useState<string>('فينو طازة بينقط سمسم 🥖');
  const [sandwichFilling, setSandwichFilling] = useState<string>('جبنة رومي قديمة مشعوطة 🧀');
  const [sandwichExtra, setSandwichExtra] = useState<string>('كيس شيبسي طماطم مفروم جواه 🥔');
  const [sandwichMade, setSandwichMade] = useState<boolean>(false);

  // Chaos mode gate state
  const [isChaosOpen, setIsChaosOpen] = useState<boolean>(false);

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

  // Quiz Handlers
  const handleSelectQuizOption = (optionIndex: number) => {
    if (quizShowFeedback) return;
    setQuizSelected(optionIndex);
    setQuizShowFeedback(true);
    const isCorrect = optionIndex === FINO_QUIZ_QUESTIONS[quizIndex].correct;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#FBBF24']
        });
      } catch {
        // ignore
      }
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex < FINO_QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(prev => prev + 1);
      setQuizSelected(null);
      setQuizShowFeedback(false);
    } else {
      setQuizDone(true);
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#F59E0B', '#3B82F6', '#EC4899', '#10B981']
        });
      } catch {
        // ignore
      }
    }
  };

  const handleResetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizSelected(null);
    setQuizShowFeedback(false);
    setQuizDone(false);
  };

  // Family Card Next Handler
  const handleNextFamilyCard = () => {
    setFamilyIndex(prev => (prev + 1) % FAMILY_GROUP_CARDS.length);
    setFamilyCopied(false);
  };

  const handleCopyFamilyDua = (text: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setFamilyCopied(true);
    setTimeout(() => setFamilyCopied(false), 2500);
  };

  // Sandwich Builder Handler
  const handleMakeSandwich = () => {
    setSandwichMade(true);
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#F97316', '#EAB308']
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
            /* Inside Chaos Box: Kept empty for them to build together as requested */
            <div className="glass-card rounded-3xl p-8 sm:p-14 my-4 relative overflow-hidden transition-all duration-500 shadow-2xl border border-amber-400/40 text-center bg-[#0F1218]/95">
              <div className="text-5xl mb-4 animate-bounce">🎪🥖😂</div>
              <h3 className="text-2xl sm:text-3xl font-black text-amber-300 mb-3">
                العالم العبثي لروءة وبوني 😂
              </h3>
              <p className="text-base text-[#F1F4F9] max-w-lg mx-auto mb-2 leading-relaxed">
                ادخل العالم العبثي دا و ارجو عدم التريقة
              </p>
              <p className="text-sm text-amber-200/90 max-w-lg mx-auto mb-6">
                اي حاجة هتلاقيها دمها تقيل جوا ف هي بهدف العباطي 😂
              </p>
              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 max-w-md mx-auto mb-8">
                <p className="text-xs sm:text-sm text-[#94A3B8] font-sans">
                  (سيبنا الصفحة اللي جوا العالم دا فاضية وهنبنيها سوا مع بعض خطوة بخطوة بكل الألعاب والتفاصيل 😉✨)
                </p>
              </div>

              {/* Exit Button back to quiet state */}
              <button
                onClick={exitChaosMode}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-white font-bold text-sm sm:text-base shadow-2xl transition flex items-center gap-2 mx-auto cursor-pointer"
              >
                <i className="fa-solid fa-arrow-rotate-left text-xs" />
                <span>الخروج من العالم العبثي 🚪</span>
              </button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Gallery Item 1 */}
          <div
            className="glass-card rounded-2xl p-2 group tilt-card transition cursor-pointer flex flex-col justify-between"
            onClick={() =>
              setLightboxImage({
                src: IMAGES.hero,
                caption: 'أول المشوار والبدايات الرايقة',
                tag: '[بداية القرب]'
              })
            }
          >
            <div>
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#0F1218] relative">
                <img
                  src={IMAGES.hero}
                  alt="بداية القرب"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-4 flex flex-col justify-end">
                  <span className="text-xs text-[#2563EB] font-code">2025.10</span>
                  <p className="text-sm font-medium text-white">أول المشوار والبدايات الرايقة</p>
                </div>
              </div>
              <div className="p-3 text-xs text-[#94A3B8] flex justify-between items-center font-code">
                <span>images/gallery-1.jpg</span>
                <span className="font-sans text-[#F1F4F9]">[بداية القرب]</span>
              </div>
            </div>
            {/* Voice record placeholder */}
            <div className="px-2 pb-2">
              <div className="flex items-center justify-between bg-black/40 rounded-xl px-3 py-2 border border-white/10 hover:border-[#2563EB]/40 transition">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#2563EB]/20 text-[#38BDF8] flex items-center justify-center text-xs">
                    <i className="fa-solid fa-microphone text-[11px]" />
                  </div>
                  <span className="text-xs font-medium text-white">ريكورد بصوت روءة 🎙️</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-2 bg-[#38BDF8] rounded-full animate-pulse" />
                  <span className="w-1 h-3.5 bg-[#2563EB] rounded-full animate-pulse" />
                  <span className="w-1 h-2 bg-[#38BDF8] rounded-full animate-pulse" />
                  <span className="text-[10px] font-code text-[#94A3B8] mr-1">0:24</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Item 2 */}
          <div
            className="glass-card rounded-2xl p-2 group tilt-card transition cursor-pointer flex flex-col justify-between"
            onClick={() =>
              setLightboxImage({
                src: IMAGES.hero,
                caption: 'ضحكة طالعة من القلب بجد',
                tag: '[هزارنا سوا]'
              })
            }
          >
            <div>
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#0F1218] relative">
                <img
                  src={IMAGES.hero}
                  alt="هزارنا سوا"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-4 flex flex-col justify-end">
                  <span className="text-xs text-[#2563EB] font-code">Private</span>
                  <p className="text-sm font-medium text-white">ضحكة طالعة من القلب بجد</p>
                </div>
              </div>
              <div className="p-3 text-xs text-[#94A3B8] flex justify-between items-center font-code">
                <span>images/gallery-2.jpg</span>
                <span className="font-sans text-[#F1F4F9]">[هزارنا سوا]</span>
              </div>
            </div>
            {/* Voice record placeholder */}
            <div className="px-2 pb-2">
              <div className="flex items-center justify-between bg-black/40 rounded-xl px-3 py-2 border border-white/10 hover:border-[#2563EB]/40 transition">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#2563EB]/20 text-[#38BDF8] flex items-center justify-center text-xs">
                    <i className="fa-solid fa-microphone text-[11px]" />
                  </div>
                  <span className="text-xs font-medium text-white">ريكورد بصوت روءة 🎙️</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-2 bg-[#38BDF8] rounded-full animate-pulse" />
                  <span className="w-1 h-3.5 bg-[#2563EB] rounded-full animate-pulse" />
                  <span className="w-1 h-2 bg-[#38BDF8] rounded-full animate-pulse" />
                  <span className="text-[10px] font-code text-[#94A3B8] mr-1">0:31</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Item 3 */}
          <div
            className="glass-card rounded-2xl p-2 group tilt-card transition cursor-pointer flex flex-col justify-between"
            onClick={() =>
              setLightboxImage({
                src: IMAGES.hero,
                caption: 'سقعة إيدينا والدفا',
                tag: '[الشتاء]'
              })
            }
          >
            <div>
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#0F1218] relative">
                <img
                  src={IMAGES.hero}
                  alt="الشتاء"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-4 flex flex-col justify-end">
                  <span className="text-xs text-[#2563EB] font-code">Winter Walk</span>
                  <p className="text-sm font-medium text-white">سقعة إيدينا والدفا</p>
                </div>
              </div>
              <div className="p-3 text-xs text-[#94A3B8] flex justify-between items-center font-code">
                <span>images/gallery-3.jpg</span>
                <span className="font-sans text-[#F1F4F9]">[الشتاء]</span>
              </div>
            </div>
            {/* Voice record placeholder */}
            <div className="px-2 pb-2">
              <div className="flex items-center justify-between bg-black/40 rounded-xl px-3 py-2 border border-white/10 hover:border-[#2563EB]/40 transition">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#2563EB]/20 text-[#38BDF8] flex items-center justify-center text-xs">
                    <i className="fa-solid fa-microphone text-[11px]" />
                  </div>
                  <span className="text-xs font-medium text-white">ريكورد بصوت روءة 🎙️</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-2 bg-[#38BDF8] rounded-full animate-pulse" />
                  <span className="w-1 h-3.5 bg-[#2563EB] rounded-full animate-pulse" />
                  <span className="w-1 h-2 bg-[#38BDF8] rounded-full animate-pulse" />
                  <span className="text-[10px] font-code text-[#94A3B8] mr-1">0:18</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Item 4 */}
          <div
            className="glass-card rounded-2xl p-2 group tilt-card transition cursor-pointer flex flex-col justify-between"
            onClick={() =>
              setLightboxImage({
                src: IMAGES.hero,
                caption: 'نظرة عين كانت تكفي',
                tag: '[مكاننا الهادي]'
              })
            }
          >
            <div>
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#0F1218] relative">
                <img
                  src={IMAGES.hero}
                  alt="مكاننا الهادي"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-4 flex flex-col justify-end">
                  <span className="text-xs text-[#2563EB] font-code">Unspoken</span>
                  <p className="text-sm font-medium text-white">نظرة عين كانت تكفي</p>
                </div>
              </div>
              <div className="p-3 text-xs text-[#94A3B8] flex justify-between items-center font-code">
                <span>images/gallery-4.jpg</span>
                <span className="font-sans text-[#F1F4F9]">[مكاننا الهادي]</span>
              </div>
            </div>
            {/* Voice record placeholder */}
            <div className="px-2 pb-2">
              <div className="flex items-center justify-between bg-black/40 rounded-xl px-3 py-2 border border-white/10 hover:border-[#2563EB]/40 transition">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#2563EB]/20 text-[#38BDF8] flex items-center justify-center text-xs">
                    <i className="fa-solid fa-microphone text-[11px]" />
                  </div>
                  <span className="text-xs font-medium text-white">ريكورد بصوت روءة 🎙️</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-2 bg-[#38BDF8] rounded-full animate-pulse" />
                  <span className="w-1 h-3.5 bg-[#2563EB] rounded-full animate-pulse" />
                  <span className="w-1 h-2 bg-[#38BDF8] rounded-full animate-pulse" />
                  <span className="text-[10px] font-code text-[#94A3B8] mr-1">0:45</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Item 5 */}
          <div
            className="glass-card rounded-2xl p-2 group tilt-card transition cursor-pointer flex flex-col justify-between"
            onClick={() =>
              setLightboxImage({
                src: IMAGES.hero,
                caption: 'الأكل التقيل والمزاج العالي',
                tag: '[الممبار والروقان]'
              })
            }
          >
            <div>
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#0F1218] relative">
                <img
                  src={IMAGES.hero}
                  alt="الممبار والروقان"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-4 flex flex-col justify-end">
                  <span className="text-xs text-[#2563EB] font-code">Food Trips</span>
                  <p className="text-sm font-medium text-white">الأكل التقيل والمزاج العالي</p>
                </div>
              </div>
              <div className="p-3 text-xs text-[#94A3B8] flex justify-between items-center font-code">
                <span>images/gallery-5.jpg</span>
                <span className="font-sans text-[#F1F4F9]">[الممبار والروقان]</span>
              </div>
            </div>
            {/* Voice record placeholder */}
            <div className="px-2 pb-2">
              <div className="flex items-center justify-between bg-black/40 rounded-xl px-3 py-2 border border-white/10 hover:border-[#2563EB]/40 transition">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#2563EB]/20 text-[#38BDF8] flex items-center justify-center text-xs">
                    <i className="fa-solid fa-microphone text-[11px]" />
                  </div>
                  <span className="text-xs font-medium text-white">ريكورد بصوت روءة 🎙️</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-2 bg-[#38BDF8] rounded-full animate-pulse" />
                  <span className="w-1 h-3.5 bg-[#2563EB] rounded-full animate-pulse" />
                  <span className="w-1 h-2 bg-[#38BDF8] rounded-full animate-pulse" />
                  <span className="text-[10px] font-code text-[#94A3B8] mr-1">0:28</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Item 6 */}
          <div
            className="glass-card rounded-2xl p-2 group tilt-card transition cursor-pointer flex flex-col justify-between"
            onClick={() =>
              setLightboxImage({
                src: IMAGES.hero,
                caption: 'حكايات الفجرية والكلام الصادق',
                tag: '[آخر الليل]'
              })
            }
          >
            <div>
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#0F1218] relative">
                <img
                  src={IMAGES.hero}
                  alt="آخر الليل"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-4 flex flex-col justify-end">
                  <span className="text-xs text-[#2563EB] font-code">Late Nights</span>
                  <p className="text-sm font-medium text-white">حكايات الفجرية والكلام الصادق</p>
                </div>
              </div>
              <div className="p-3 text-xs text-[#94A3B8] flex justify-between items-center font-code">
                <span>images/gallery-6.jpg</span>
                <span className="font-sans text-[#F1F4F9]">[آخر الليل]</span>
              </div>
            </div>
            {/* Voice record placeholder */}
            <div className="px-2 pb-2">
              <div className="flex items-center justify-between bg-black/40 rounded-xl px-3 py-2 border border-white/10 hover:border-[#2563EB]/40 transition">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#2563EB]/20 text-[#38BDF8] flex items-center justify-center text-xs">
                    <i className="fa-solid fa-microphone text-[11px]" />
                  </div>
                  <span className="text-xs font-medium text-white">ريكورد بصوت روءة 🎙️</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-2 bg-[#38BDF8] rounded-full animate-pulse" />
                  <span className="w-1 h-3.5 bg-[#2563EB] rounded-full animate-pulse" />
                  <span className="w-1 h-2 bg-[#38BDF8] rounded-full animate-pulse" />
                  <span className="text-[10px] font-code text-[#94A3B8] mr-1">0:52</span>
                </div>
              </div>
            </div>
          </div>
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
