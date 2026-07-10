import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, 
  BookOpen, 
  Calculator, 
  TrendingUp, 
  Bot, 
  Sparkles, 
  Trophy, 
  Flame, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Lock, 
  Unlock, 
  DollarSign, 
  Send, 
  HelpCircle,
  GraduationCap,
  Percent,
  Check,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

import { CourseModule, UserProgress, ChatMessage, SimplifiedTaxEstimate, UserBadge } from './types';
import { COURSE_MODULES, BADGES, DAILY_CHALLENGE, LEADERBOARD } from './courseData';

export default function App() {
  // --- Persistent State ---
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('manulife_literacy_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved progress, resetting.', e);
      }
    }
    return {
      xp: 0,
      streak: 3, // start with a small realistic streak to entice the user!
      level: 1,
      completedModules: [],
      completedLessons: [],
      unlockedBadges: [],
      dailyChallengeDone: false,
      score: 0,
    };
  });

  useEffect(() => {
    localStorage.setItem('manulife_literacy_progress', JSON.stringify(progress));
  }, [progress]);

  // --- UI Navigation State ---
  const [activeTab, setActiveTab] = useState<'course' | 'calculators' | 'coach' | 'dashboard'>('course');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- Course Module State ---
  const [activeModule, setActiveModule] = useState<CourseModule | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [quizActive, setQuizActive] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState<{ score: number; passed: boolean } | null>(null);

  // --- Calculator Selector State ---
  const [activeCalc, setActiveCalc] = useState<'matching' | 'tfsa' | 'rrsp' | 'compounding'>('matching');

  // --- Calculator 1: Employer Matching State ---
  const [matchSalary, setMatchSalary] = useState(75000);
  const [matchContributionPercent, setMatchContributionPercent] = useState(3);
  const [matchMatchPercent, setMatchMatchPercent] = useState(100);
  const [matchLimitPercent, setMatchLimitPercent] = useState(5);

  // --- Calculator 2: TFSA Room State ---
  const [tfsaBirthYear, setTfsaBirthYear] = useState(1995);
  const [tfsaYearsResident, setTfsaYearsResident] = useState(18); // max since 2009 is 18
  const [tfsaContributions, setTfsaContributions] = useState(15000);
  const [tfsaWithdrawals, setTfsaWithdrawals] = useState(2000);
  const [tfsaCalculated, setTfsaCalculated] = useState<{ limit: number; roomLeft: number } | null>(null);

  // --- Calculator 3: RRSP Tax Refund State ---
  const [rrspSalary, setRrspSalary] = useState(85000);
  const [rrspContribution, setRrspContribution] = useState(8000);

  // --- Calculator 4: Compound Interest State ---
  const [compoundMonthly, setCompoundMonthly] = useState(300);
  const [compoundYears, setCompoundYears] = useState(25);
  const [compoundRate, setCompoundRate] = useState(7);
  const [compoundInitial, setCompoundInitial] = useState(5000);

  // --- AI Coach Chat State ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: "Hello! I am your AI Financial Literacy Coach, developed by the Manulife Academy. I can help you understand Group Pensions, RRSPs, TFSAs, Canadian tax brackets, or how to maximize your employer's matching program. What is on your mind today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // --- AI personalized planning wizard ---
  const [roadmapWizard, setRoadmapWizard] = useState(false);
  const [wizardAge, setWizardAge] = useState(30);
  const [wizardIncome, setWizardIncome] = useState(75000);
  const [wizardSavings, setWizardSavings] = useState(15000);
  const [wizardPension, setWizardPension] = useState(true);
  const [wizardGoal, setWizardGoal] = useState('Buying my first home');
  const [wizardResult, setWizardResult] = useState<string | null>(null);
  const [wizardLoading, setWizardLoading] = useState(false);

  // --- Sorting Game State (TFSA vs RRSP) ---
  const [sortingGameActive, setSortingGameActive] = useState(false);
  const [sortingIndex, setSortingIndex] = useState(0);
  const [sortingScore, setSortingScore] = useState(0);
  const [sortingFeedback, setSortingFeedback] = useState<{ correct: boolean; text: string } | null>(null);
  const [sortingCompleted, setSortingCompleted] = useState(false);

  // --- Daily Challenge State ---
  const [dailyAnswer, setDailyAnswer] = useState<number | null>(null);
  const [dailySubmitted, setDailySubmitted] = useState(false);
  const [dailyCorrect, setDailyCorrect] = useState<boolean | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- Auto-scroll Chat ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // --- Level Up logic ---
  const addXP = (amount: number, badgeIdToUnlock?: string) => {
    setProgress(prev => {
      const newXp = prev.xp + amount;
      // 1000 XP per level
      const newLevel = Math.floor(newXp / 1000) + 1;
      const leveledUp = newLevel > prev.level;

      let updatedBadges = [...prev.unlockedBadges];
      if (badgeIdToUnlock && !updatedBadges.includes(badgeIdToUnlock)) {
        updatedBadges.push(badgeIdToUnlock);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        unlockedBadges: updatedBadges,
      };
    });
  };

  // --- TFSA room calculation effect ---
  useEffect(() => {
    // Current year: 2026
    const annualLimits = [
      { year: 2009, limit: 5000 },
      { year: 2010, limit: 5000 },
      { year: 2011, limit: 5000 },
      { year: 2012, limit: 5000 },
      { year: 2013, limit: 5500 },
      { year: 2014, limit: 5500 },
      { year: 2015, limit: 10000 },
      { year: 2016, limit: 5500 },
      { year: 2017, limit: 5500 },
      { year: 2018, limit: 5500 },
      { year: 2019, limit: 6000 },
      { year: 2020, limit: 6000 },
      { year: 2021, limit: 6000 },
      { year: 2022, limit: 6000 },
      { year: 2023, limit: 6500 },
      { year: 2024, limit: 7000 },
      { year: 2025, limit: 7000 },
      { year: 2026, limit: 7000 },
    ];

    let totalLimit = 0;
    for (const item of annualLimits) {
      if (tfsaBirthYear <= item.year - 18) {
        totalLimit += item.limit;
      }
    }

    // Apply resident proportion
    const maxYears = 2026 - Math.max(2009, tfsaBirthYear + 18) + 1;
    const activeYears = Math.min(maxYears, tfsaYearsResident);
    if (maxYears > 0 && activeYears < maxYears) {
      totalLimit = Math.round(totalLimit * (activeYears / maxYears));
    }

    const roomLeft = totalLimit - tfsaContributions + tfsaWithdrawals;
    setTfsaCalculated({
      limit: totalLimit,
      roomLeft: Math.max(0, roomLeft)
    });
  }, [tfsaBirthYear, tfsaYearsResident, tfsaContributions, tfsaWithdrawals]);

  // --- RRSP Tax Estimations (Ontario combined rates) ---
  const estimateOntarioRefund = (income: number, contribution: number): SimplifiedTaxEstimate => {
    let marginalRate = 0.2005;
    if (income > 220000) {
      marginalRate = 0.5353;
    } else if (income > 150000) {
      marginalRate = 0.4797;
    } else if (income > 100000) {
      marginalRate = 0.4341;
    } else if (income > 50000) {
      marginalRate = 0.2965;
    } else {
      marginalRate = 0.2005;
    }
    const estimatedRefund = contribution * marginalRate;
    return {
      salary: income,
      contribution,
      estimatedRefund: Math.round(estimatedRefund),
      marginalRate: Math.round(marginalRate * 1000) / 10
    };
  };

  const rrspTaxData = estimateOntarioRefund(rrspSalary, rrspContribution);

  // --- Compound Interest Data Generation ---
  const generateCompoundData = () => {
    const data = [];
    let principal = compoundInitial;
    let totalInvested = compoundInitial;
    const monthlyRate = (compoundRate / 100) / 12;

    data.push({
      year: 0,
      'Deposits Only': Math.round(totalInvested),
      'With Compounding': Math.round(principal),
    });

    for (let year = 1; year <= compoundYears; year++) {
      for (let month = 0; month < 12; month++) {
        principal = (principal + compoundMonthly) * (1 + monthlyRate);
        totalInvested += compoundMonthly;
      }
      data.push({
        year,
        'Deposits Only': Math.round(totalInvested),
        'With Compounding': Math.round(principal),
      });
    }
    return data;
  };

  const compoundData = generateCompoundData();

  // --- Sorting Game Scenarios ---
  const SORTING_SCENARIOS = [
    {
      id: 'sc-1',
      text: "Arjun earns $135,000 annually and wants to immediately decrease his hefty annual tax bill while saving for his future retirement.",
      correct: 'rrsp',
      explanation: "RRSP contributions reduce your taxable income dollar-for-dollar. For high earners like Arjun, this triggers a massive tax refund at his high marginal tax bracket, saving him thousands in taxes today!"
    },
    {
      id: 'sc-2',
      text: "Elena is 19 years old, working a part-time retail job earning $16,000 a year, and is saving to buy her first car in about 18 months.",
      correct: 'tfsa',
      explanation: "Since Elena's income is very low, an RRSP deduction offers almost zero tax benefit. A TFSA is perfect because her money can be withdrawn at any time completely tax-free to buy the car, and her contribution room will be restored next year."
    },
    {
      id: 'sc-3',
      text: "Marcus is saving a liquid $12,000 'Emergency Fund' to cover expenses in case of sudden layoffs or a broken household appliance.",
      correct: 'tfsa',
      explanation: "Emergency funds should always reside in a TFSA rather than an RRSP. Withdrawing from an RRSP early triggers heavy withholding taxes and permanent loss of contribution room, whereas TFSA withdrawals are free and room is fully restored next year."
    },
    {
      id: 'sc-4',
      text: "Pierre is 68, fully retired, and wants to draw extra funds for vacation without increasing his net taxable income, which could trigger a clawback on his OAS (Old Age Security) government benefits.",
      correct: 'tfsa',
      explanation: "TFSA withdrawals are 100% tax-free and do NOT count as income for the CRA. This makes TFSA withdrawals invisible to government benefit calculations, avoiding OAS clawbacks completely."
    },
    {
      id: 'sc-5',
      text: "Sarah expects her income to jump from $50,000 to $120,000 in three years. She has extra cash today but wants to defer claiming her tax deductions until she hits that higher-earning period.",
      correct: 'rrsp',
      explanation: "While Sarah contributes to her RRSP today, she can legally defer claiming the deduction on her tax return until future years when she is in a much higher bracket, maximizing her refund value!"
    }
  ];

  const handleSortingAnswer = (choice: 'tfsa' | 'rrsp') => {
    const current = SORTING_SCENARIOS[sortingIndex];
    const isCorrect = choice === current.correct;
    
    if (isCorrect) {
      setSortingScore(prev => prev + 1);
      addXP(25);
    }
    setSortingFeedback({
      correct: isCorrect,
      text: current.explanation
    });
  };

  const nextSortingScenario = () => {
    setSortingFeedback(null);
    if (sortingIndex < SORTING_SCENARIOS.length - 1) {
      setSortingIndex(prev => prev + 1);
    } else {
      setSortingCompleted(true);
      // Give a big bonus if they got all correct
      if (sortingScore === SORTING_SCENARIOS.length - 1 && sortingFeedback?.correct) {
        // perfect score (since state is updated asynchronously, we check mathematically)
        addXP(100);
      } else {
        addXP(50);
      }
    }
  };

  const restartSortingGame = () => {
    setSortingIndex(0);
    setSortingScore(0);
    setSortingFeedback(null);
    setSortingCompleted(false);
    setSortingGameActive(true);
  };

  // --- Daily Challenge Submit ---
  const handleDailySubmit = (index: number) => {
    if (dailySubmitted) return;
    setDailyAnswer(index);
    setDailySubmitted(true);
    const isCorrect = index === DAILY_CHALLENGE.correctAnswerIndex;
    setDailyCorrect(isCorrect);
    if (isCorrect) {
      addXP(50);
    }
    setProgress(prev => ({
      ...prev,
      dailyChallengeDone: true
    }));
  };

  // --- AI Coach Custom Request ---
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentMessage.trim() || isGenerating) return;

    const userMsg = currentMessage.trim();
    setCurrentMessage('');
    setAiError(null);

    const updatedMessages = [
      ...chatMessages,
      {
        sender: 'user' as const,
        text: userMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];

    setChatMessages(updatedMessages);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error. Please verify server connection.');
      }

      const data = await response.json();
      
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      addXP(15, 'badge-coach'); // unlock AI advisor badge on first custom message
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Failed to contact the AI Coach. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // --- AI Roadmap Planner Request ---
  const handleGenerateRoadmap = async () => {
    setWizardLoading(true);
    setAiError(null);
    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: wizardAge,
          income: wizardIncome,
          currentSavings: wizardSavings,
          pensionMatch: wizardPension,
          primaryGoal: wizardGoal
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan. Please try again.');
      }

      const data = await response.json();
      setWizardResult(data.plan);
      addXP(50, 'badge-coach'); // unlock badge
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Failed to generate financial plan.');
    } finally {
      setWizardLoading(false);
    }
  };

  // --- Course Lesson Progression ---
  const handleNextLesson = () => {
    if (!activeModule) return;
    if (currentLessonIndex < activeModule.lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
      // Earn a small amount of XP for micro-learning read
      const lessonKey = `${activeModule.id}:${currentLessonIndex}`;
      if (!progress.completedLessons.includes(lessonKey)) {
        setProgress(prev => ({
          ...prev,
          completedLessons: [...prev.completedLessons, lessonKey]
        }));
        addXP(20);
      }
    } else {
      setQuizActive(true);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
    }
  };

  // --- Module Quiz Handling ---
  const handleSelectQuizOption = (questionIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    if (!activeModule) return;
    let score = 0;
    activeModule.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswerIndex) {
        score++;
      }
    });

    const passed = score >= 2; // Pass if 2 or more correct
    setQuizResults({ score, passed });
    setQuizSubmitted(true);

    if (passed) {
      addXP(activeModule.xpReward, activeModule.badgeId);
      setProgress(prev => {
        const completed = [...prev.completedModules];
        if (!completed.includes(activeModule.id)) {
          completed.push(activeModule.id);
        }
        return {
          ...prev,
          completedModules: completed
        };
      });
    }
  };

  const handleCloseModule = () => {
    setActiveModule(null);
    setQuizActive(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResults(null);
    setCurrentLessonIndex(0);
  };

  const handleSelectModule = (mod: CourseModule) => {
    setActiveModule(mod);
    setCurrentLessonIndex(0);
    setQuizActive(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResults(null);
  };

  // Simulated peer leaderboard
  const updatedLeaderboard = LEADERBOARD.map(item => {
    if (item.current) {
      return { ...item, xp: progress.xp, name: `You (Level ${progress.level})` };
    }
    return item;
  }).sort((a, b) => b.xp - a.xp);

  // Match calculator Free Money calculations
  const matchAnnualContribution = Math.round(matchSalary * (matchContributionPercent / 100));
  const maxMatchContribution = Math.round(matchSalary * (matchLimitPercent / 100));
  const employerMatchMultiplier = matchMatchPercent / 100;
  
  const matchedContribution = Math.min(
    matchAnnualContribution * employerMatchMultiplier,
    maxMatchContribution * employerMatchMultiplier
  );
  
  const leaveOnTable = Math.max(
    0,
    (maxMatchContribution * employerMatchMultiplier) - matchedContribution
  );

  const matchedSavingsTotal = matchAnnualContribution + matchedContribution;
  const matchSavingsAt30Years = Math.round(matchedSavingsTotal * 79.058); // rough compounding over 30 years at 6% annual growth

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F7F5] font-sans selection:bg-[#006F3D]/20">
      {/* --- HEADER BAR (Manulife inspired Design) --- */}
      <header className="sticky top-0 z-40 bg-[#006F3D] text-white shadow-md border-b border-[#00562F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo / Brand */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('course')}>
              <div className="bg-white text-[#006F3D] p-2 rounded-lg font-bold text-xl flex items-center justify-center tracking-tight font-display shadow-sm">
                III
              </div>
              <div>
                <h1 className="font-display font-bold text-lg leading-tight tracking-tight">Manulife</h1>
                <p className="text-xs text-[#10B981] font-mono uppercase tracking-widest font-semibold">Literacy Academy</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <button 
                id="nav-course"
                onClick={() => { setActiveTab('course'); setMobileMenuOpen(false); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${activeTab === 'course' ? 'bg-white text-[#006F3D] font-bold shadow-sm' : 'text-white/90 hover:bg-white/10'}`}
              >
                🎓 Learn Modules
              </button>
              <button 
                id="nav-calculators"
                onClick={() => { setActiveTab('calculators'); setMobileMenuOpen(false); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${activeTab === 'calculators' ? 'bg-white text-[#006F3D] font-bold shadow-sm' : 'text-white/90 hover:bg-white/10'}`}
              >
                🎛️ Simulators
              </button>
              <button 
                id="nav-coach"
                onClick={() => { setActiveTab('coach'); setMobileMenuOpen(false); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${activeTab === 'coach' ? 'bg-white text-[#006F3D] font-bold shadow-sm' : 'text-white/90 hover:bg-white/10'}`}
              >
                💬 AI Coach
              </button>
              <button 
                id="nav-dashboard"
                onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${activeTab === 'dashboard' ? 'bg-white text-[#006F3D] font-bold shadow-sm' : 'text-white/90 hover:bg-white/10'}`}
              >
                🏆 Cabinet & Stats
              </button>
            </nav>

            {/* Gamification Stats Header pill */}
            <div className="flex items-center space-x-3">
              <div className="bg-[#00562F] border border-[#008044] rounded-2xl px-3 py-1.5 flex items-center space-x-4 shadow-inner text-xs sm:text-sm">
                <div className="flex items-center space-x-1 text-amber-400 font-bold" title="XP (Experience Points)">
                  <Trophy className="w-4 h-4" />
                  <span>{progress.xp} <span className="text-xs text-white/70 font-normal">XP</span></span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center space-x-1 text-orange-400 font-bold" title="Streaks">
                  <Flame className="w-4 h-4" />
                  <span>{progress.streak} <span className="text-xs text-white/70 font-normal">Days</span></span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center space-x-1 font-bold text-[#10B981]">
                  <span>Lvl {progress.level}</span>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-[#00562F] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#00562F] border-t border-[#004A28] px-4 py-4 space-y-2"
            >
              <button 
                onClick={() => { setActiveTab('course'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center space-x-3 ${activeTab === 'course' ? 'bg-[#006F3D] text-white font-bold' : 'text-white/80 hover:bg-[#006F3D]/50'}`}
              >
                <span>🎓 Learn Modules</span>
              </button>
              <button 
                onClick={() => { setActiveTab('calculators'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center space-x-3 ${activeTab === 'calculators' ? 'bg-[#006F3D] text-white font-bold' : 'text-white/80 hover:bg-[#006F3D]/50'}`}
              >
                <span>🎛️ Interactive Simulators</span>
              </button>
              <button 
                onClick={() => { setActiveTab('coach'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center space-x-3 ${activeTab === 'coach' ? 'bg-[#006F3D] text-white font-bold' : 'text-white/80 hover:bg-[#006F3D]/50'}`}
              >
                <span>💬 AI Financial Coach</span>
              </button>
              <button 
                onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center space-x-3 ${activeTab === 'dashboard' ? 'bg-[#006F3D] text-white font-bold' : 'text-white/80 hover:bg-[#006F3D]/50'}`}
              >
                <span>🏆 Cabinet & Stats</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- HERO SPLASH --- */}
      <section className="bg-gradient-to-b from-[#006F3D] to-[#F3F7F5] text-white py-12 px-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-[#10B981] text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full font-bold shadow-sm">
              🇨🇦 100% Free Canadian Wealth Guide
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-bold mt-4 tracking-tight text-white drop-shadow-sm">
              Save Taxes & Build Wealth
            </h2>
            <p className="text-base sm:text-lg text-emerald-100/95 mt-4 max-w-2xl mx-auto leading-relaxed">
              Master the financial rules of Canada. Access bite-sized learning pathways, try real matching simulators, and request custom roadmaps from our Gemini-powered AI coach.
            </p>
          </motion.div>

          {/* Micro Progress Bar on Hero removed */}
        </div>
      </section>

      {/* --- MAIN PAGE CONTENT CONTAINER --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        {/* --- TAB 1: LEARN MODULES --- */}
        {activeTab === 'course' && (
          <div className="space-y-8">
            {/* Sorting Game teaser banner */}
            {!sortingGameActive && (
              <div className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-50 p-4 rounded-full text-[#006F3D]">
                    <Layers className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-800">Challenge: The TFSA vs. RRSP Decider</h3>
                    <p className="text-sm text-slate-500">Test your mastery with our drag-and-drop scenario sorter! Earn bonus XP and badges.</p>
                  </div>
                </div>
                <button 
                  id="btn-play-game"
                  onClick={() => setSortingGameActive(true)}
                  className="bg-[#006F3D] hover:bg-[#00562F] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all flex items-center space-x-2"
                >
                  <span>Play Sorting Game</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Sorting Game Interface */}
            {sortingGameActive && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-200 p-6 sm:p-8 rounded-3xl shadow-sm"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2 text-[#006F3D]">
                    <Trophy className="w-6 h-6 text-amber-500" />
                    <h3 className="font-display font-bold text-lg">TFSA vs. RRSP Scenario Matching Game</h3>
                  </div>
                  <button 
                    onClick={() => setSortingGameActive(false)}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {!sortingCompleted ? (
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="flex justify-between text-xs font-mono text-slate-500">
                      <span>Scenario {sortingIndex + 1} of {SORTING_SCENARIOS.length}</span>
                      <span>Correct: {sortingScore} / {sortingIndex}</span>
                    </div>

                    <div className="w-full bg-white border-2 border-dashed border-emerald-200 rounded-2xl p-6 shadow-sm text-center">
                      <p className="text-base sm:text-lg font-medium text-slate-700 leading-relaxed italic">
                        "{SORTING_SCENARIOS[sortingIndex].text}"
                      </p>
                    </div>

                    {sortingFeedback === null ? (
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => handleSortingAnswer('tfsa')}
                          className="bg-white hover:bg-emerald-50 border-2 border-emerald-600 hover:border-emerald-700 text-[#006F3D] font-bold py-4 px-6 rounded-2xl shadow-sm transition-all text-center flex flex-col items-center justify-center space-y-2 group"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform">🛡️</span>
                          <span className="font-display text-base uppercase tracking-wider">TFSA Bin</span>
                          <span className="text-xs text-slate-400 font-normal">Withdraw tax-free</span>
                        </button>
                        <button 
                          onClick={() => handleSortingAnswer('rrsp')}
                          className="bg-white hover:bg-emerald-50 border-2 border-emerald-600 hover:border-emerald-700 text-[#006F3D] font-bold py-4 px-6 rounded-2xl shadow-sm transition-all text-center flex flex-col items-center justify-center space-y-2 group"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform">🚀</span>
                          <span className="font-display text-base uppercase tracking-wider">RRSP Bin</span>
                          <span className="text-xs text-slate-400 font-normal">Deduct taxes today</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className={`p-5 rounded-2xl border ${sortingFeedback.correct ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                          <div className="flex items-center space-x-2 font-bold mb-2">
                            {sortingFeedback.correct ? (
                              <>
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                <span>Correct Match! (+25 XP)</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-5 h-5 text-red-600" />
                                <span>Incorrect Choice</span>
                              </>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed">{sortingFeedback.text}</p>
                        </div>
                        <button 
                          onClick={nextSortingScenario}
                          className="w-full bg-[#006F3D] hover:bg-[#00562F] text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                        >
                          <span>{sortingIndex < SORTING_SCENARIOS.length - 1 ? 'Next Scenario' : 'Finish Challenge'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center max-w-md mx-auto space-y-6 py-4">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto shadow-sm text-4xl">
                      🏆
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-2xl text-slate-800">Challenge Completed!</h4>
                      <p className="text-slate-500 mt-2">
                        You matched <span className="font-bold text-[#006F3D]">{sortingScore} out of {SORTING_SCENARIOS.length}</span> correctly. Awesome effort toward financial freedom!
                      </p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-xl text-xs text-[#006F3D] font-semibold">
                      🎁 Awarded +50 XP and registered in your stats!
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={restartSortingGame}
                        className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-2.5 rounded-xl font-semibold transition-all text-sm"
                      >
                        Try Again
                      </button>
                      <button 
                        onClick={() => setSortingGameActive(false)}
                        className="flex-1 bg-[#006F3D] hover:bg-[#00562F] text-white py-2.5 rounded-xl font-semibold transition-all text-sm"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Courses Matrix */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="font-display font-bold text-2xl text-slate-800">Canadian Literacy Modules</h3>
                  <p className="text-slate-500 text-sm mt-1">Bite-sized visual lessons. Finish quizzes to level-up and secure badges.</p>
                </div>
                <span className="text-xs font-semibold text-[#006F3D] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  {progress.completedModules.length} / {COURSE_MODULES.length} Completed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COURSE_MODULES.map((mod) => {
                  const isCompleted = progress.completedModules.includes(mod.id);
                  const isLocked = false; // keep all open so they can explore freely!
                  
                  return (
                    <div 
                      key={mod.id}
                      className="bg-white border border-slate-100 hover:border-emerald-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full relative overflow-hidden group"
                    >
                      {/* Top accent bar */}
                      <div className={`h-1.5 w-full ${isCompleted ? 'bg-[#10B981]' : 'bg-[#006F3D]/20 group-hover:bg-[#006F3D]/60'}`}></div>
                      
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 font-bold">
                              {mod.category === 'pension' ? 'Pensions & Matching' : mod.category === 'tfsa' ? 'TFSA Rules' : mod.category === 'rrsp' ? 'RRSP Optimization' : 'Canadian Wealth'}
                            </span>
                            {isCompleted && (
                              <span className="bg-emerald-50 text-[#006F3D] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-emerald-100">
                                <Check className="w-3 h-3" />
                                <span>Finished</span>
                              </span>
                            )}
                          </div>

                          <h4 className="font-display font-bold text-base text-slate-800 leading-snug group-hover:text-[#006F3D] transition-colors">
                            {mod.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                            {mod.shortDescription}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-amber-600 flex items-center space-x-1">
                            <Trophy className="w-3.5 h-3.5" />
                            <span>+{mod.xpReward} XP</span>
                          </span>
                          <button 
                            id={`btn-start-${mod.id}`}
                            onClick={() => handleSelectModule(mod)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${isCompleted ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-[#006F3D] text-white hover:bg-[#00562F]'}`}
                          >
                            <span>{isCompleted ? 'Review' : 'Start Lesson'}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: INTERACTIVE CALCULATORS --- */}
        {activeTab === 'calculators' && (
          <div className="space-y-8">
            {/* Calculator Selectors */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
              <button 
                id="calc-tab-matching"
                onClick={() => setActiveCalc('matching')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all ${activeCalc === 'matching' ? 'bg-[#006F3D] text-white shadow-sm' : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600'}`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Pension Matching ("Free Money")</span>
              </button>
              <button 
                id="calc-tab-tfsa"
                onClick={() => setActiveCalc('tfsa')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all ${activeCalc === 'tfsa' ? 'bg-[#006F3D] text-white shadow-sm' : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600'}`}
              >
                <Layers className="w-4 h-4" />
                <span>TFSA Room Estimator</span>
              </button>
              <button 
                id="calc-tab-rrsp"
                onClick={() => setActiveCalc('rrsp')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all ${activeCalc === 'rrsp' ? 'bg-[#006F3D] text-white shadow-sm' : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600'}`}
              >
                <Percent className="w-4 h-4" />
                <span>RRSP Tax Refund</span>
              </button>
              <button 
                id="calc-tab-compounding"
                onClick={() => setActiveCalc('compounding')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all ${activeCalc === 'compounding' ? 'bg-[#006F3D] text-white shadow-sm' : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600'}`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Compound Interest Simulator</span>
              </button>
            </div>

            {/* CALCULATOR 1: MATCHING POWER */}
            {activeCalc === 'matching' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#006F3D]">DC Pension Match Configuration</h3>
                    <p className="text-xs text-slate-500 mt-1">Configure your current Canadian salary and employer benefit matching rules.</p>
                  </div>

                  {/* Salary slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <label className="font-medium text-slate-700">Annual Gross Salary</label>
                      <span className="font-mono font-bold text-[#006F3D]">${matchSalary.toLocaleString()} CAD</span>
                    </div>
                    <input 
                      type="range" 
                      min="30000" 
                      max="200000" 
                      step="5000"
                      value={matchSalary}
                      onChange={(e) => setMatchSalary(Number(e.target.value))}
                      className="w-full accent-[#006F3D] h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Contribution percent */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <label className="font-medium text-slate-700">Your Contribution %</label>
                      <span className="font-mono font-bold text-[#006F3D]">{matchContributionPercent}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="15" 
                      step="1"
                      value={matchContributionPercent}
                      onChange={(e) => setMatchContributionPercent(Number(e.target.value))}
                      className="w-full accent-[#006F3D] h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Matching percent */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <label className="font-medium text-slate-700">Employer Matching Ratio</label>
                      <span className="font-mono font-bold text-[#006F3D]">{matchMatchPercent}% (dollar-for-dollar)</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="150" 
                      step="10"
                      value={matchMatchPercent}
                      onChange={(e) => setMatchMatchPercent(Number(e.target.value))}
                      className="w-full accent-[#006F3D] h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400 leading-normal">Standard Canadian employers match dollar-for-dollar (100%), while some high-benefit tech/finance match 150%.</p>
                  </div>

                  {/* Match limit percent */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <label className="font-medium text-slate-700">Employer Match Limit</label>
                      <span className="font-mono font-bold text-[#006F3D]">{matchLimitPercent}% of salary</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      step="1"
                      value={matchLimitPercent}
                      onChange={(e) => setMatchLimitPercent(Number(e.target.value))}
                      className="w-full accent-[#006F3D] h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Outputs & Graph */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-800">Your Annual Match Breakdown</h3>
                    <p className="text-xs text-slate-400">Matched employer funds are legally considered deferred salary.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">Your Annual Contribution</p>
                      <p className="text-xl font-bold text-slate-800 mt-1">${matchAnnualContribution.toLocaleString()}</p>
                    </div>
                    <div className="bg-emerald-50/50 p-4 rounded-xl text-center border border-emerald-100 relative overflow-hidden">
                      <span className="absolute top-0 right-0 bg-[#006F3D] text-white text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-bl-lg font-mono font-semibold">Free Money</span>
                      <p className="text-xs text-slate-500 font-medium">Employer Matched Cash</p>
                      <p className="text-xl font-bold text-[#006F3D] mt-1">${matchedContribution.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#006F3D]/5 col-span-2 sm:col-span-1 p-4 rounded-xl text-center border border-[#006F3D]/10">
                      <p className="text-xs text-slate-600 font-medium">Total Saved per Year</p>
                      <p className="text-xl font-bold text-[#006F3D] mt-1">${matchedSavingsTotal.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Matching alert notifications */}
                  {leaveOnTable > 0 ? (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start space-x-3 text-xs sm:text-sm">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Match Deficit Detected!</p>
                        <p className="mt-1 leading-relaxed">
                          You are leaving <span className="font-bold underline">${leaveOnTable.toLocaleString()} CAD</span> of completely free employer money on the table annually. Increase your contribution to at least <span className="font-bold">{matchLimitPercent}%</span> to capture 100% of your benefits.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-start space-x-3 text-xs sm:text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Matching Maxed Out!</p>
                        <p className="mt-1 leading-relaxed">
                          Fantastic! You are claiming 100% of your employer's matching capability, extracting the maximum possible compensation package.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-4 text-center">
                    <p className="text-xs text-slate-500">
                      If you let just this match invest in a diversified fund at 6% growth, in 30 years it could grow to:
                    </p>
                    <p className="text-3xl font-display font-black text-[#006F3D] mt-1">
                      ${matchSavingsAt30Years.toLocaleString()} CAD
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Estimations assume standard long-term Canadian compounding conditions and annual additions.</p>
                  </div>
                </div>
              </div>
            )}

            {/* CALCULATOR 2: TFSA CUMULATIVE ROOM */}
            {activeCalc === 'tfsa' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#006F3D]">TFSA Room Calculator</h3>
                    <p className="text-xs text-slate-500 mt-1">Provide your details to calculate your estimated maximum CRA lifetime contribution limits.</p>
                  </div>

                  {/* Year turned 18 */}
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-slate-700 block">Year you turned 18</label>
                    <select 
                      value={tfsaBirthYear}
                      onChange={(e) => setTfsaBirthYear(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-sm"
                    >
                      {Array.from({ length: 40 }, (_, i) => 1970 + i).map(y => (
                        <option key={y} value={y}>{y} (Turned 18 in {y + 18})</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-400 leading-normal">TFSA contribution room began accumulating in 2009. You only accumulate room for years you were at least 18 years old.</p>
                  </div>

                  {/* Residency */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <label className="font-medium text-slate-700">Years Resident in Canada since 2009</label>
                      <span className="font-mono font-bold text-[#006F3D]">{tfsaYearsResident} Years</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="18" 
                      step="1"
                      value={tfsaYearsResident}
                      onChange={(e) => setTfsaYearsResident(Number(e.target.value))}
                      className="w-full accent-[#006F3D] h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400 leading-normal">You must be a tax resident of Canada to earn annual TFSA room.</p>
                  </div>

                  {/* Contributions made */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <label className="font-medium text-slate-700">Total Contributions Ever Made</label>
                      <span className="font-mono font-bold text-[#006F3D]">${tfsaContributions.toLocaleString()} CAD</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="95000" 
                      step="1000"
                      value={tfsaContributions}
                      onChange={(e) => setTfsaContributions(Number(e.target.value))}
                      className="w-full accent-[#006F3D] h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Withdrawals made */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <label className="font-medium text-slate-700">Total Withdrawals Ever Made</label>
                      <span className="font-mono font-bold text-[#006F3D]">${tfsaWithdrawals.toLocaleString()} CAD</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="40000" 
                      step="1000"
                      value={tfsaWithdrawals}
                      onChange={(e) => setTfsaWithdrawals(Number(e.target.value))}
                      className="w-full accent-[#006F3D] h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Outputs */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-800">Your TFSA Cumulative Standing</h3>
                    <p className="text-xs text-slate-400">TFSA room carries forward indefinitely and is restored upon withdrawal next year.</p>
                  </div>

                  {tfsaCalculated && (
                    <div className="space-y-6 flex-grow flex flex-col justify-center">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-500 font-medium">Estimated Lifetime Max Limit</p>
                          <p className="text-2xl font-bold text-slate-800 mt-1">${tfsaCalculated.limit.toLocaleString()}</p>
                        </div>
                        <div className="bg-emerald-50/50 p-4 rounded-xl border border-[#10B981]/20">
                          <p className="text-xs text-[#006F3D] font-bold">Estimated Contribution Room Left</p>
                          <p className="text-2xl font-black text-[#006F3D] mt-1">${tfsaCalculated.roomLeft.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Over contribution warning logic */}
                      {tfsaContributions > tfsaCalculated.limit ? (
                        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start space-x-3 text-xs sm:text-sm">
                          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold">Over-Contribution Hazard!</p>
                            <p className="mt-1 leading-relaxed">
                              Your total contributions (${tfsaContributions.toLocaleString()}) exceed your estimated lifetime limit (${tfsaCalculated.limit.toLocaleString()}). The CRA levies a severe **1% monthly penalty tax** on over-contributions. Withdraw the excess immediately!
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-emerald-50/50 border border-emerald-100 text-[#006F3D] p-4 rounded-xl flex items-start space-x-3 text-xs sm:text-sm">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold">Compliant Status Approved</p>
                            <p className="mt-1 leading-relaxed text-slate-600">
                              Your contributions are comfortably within your lifetime cumulative room. You have <span className="font-bold text-[#006F3D]">${tfsaCalculated.roomLeft.toLocaleString()} CAD</span> of tax-sheltered investment capacity remaining.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-4 text-xs text-slate-500 space-y-2">
                    <p className="font-bold text-slate-600">💡 Critical TFSA Rule Reminder:</p>
                    <p className="leading-relaxed">
                      If you withdraw funds from your TFSA, do NOT re-contribute them in the same calendar year if you are already maxed out. That room is not restored until **January 1st of the next year**.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CALCULATOR 3: RRSP REFUND & BRACKETS */}
            {activeCalc === 'rrsp' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#006F3D]">RRSP Refund Configurator</h3>
                    <p className="text-xs text-slate-500 mt-1">Deducting income today deferring tax to retirement.</p>
                  </div>

                  {/* Salary slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <label className="font-medium text-slate-700">Gross Annual Income</label>
                      <span className="font-mono font-bold text-[#006F3D]">${rrspSalary.toLocaleString()} CAD</span>
                    </div>
                    <input 
                      type="range" 
                      min="30000" 
                      max="250000" 
                      step="5000"
                      value={rrspSalary}
                      onChange={(e) => setRrspSalary(Number(e.target.value))}
                      className="w-full accent-[#006F3D] h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Contribution slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <label className="font-medium text-slate-700">Intended RRSP Contribution</label>
                      <span className="font-mono font-bold text-[#006F3D]">${rrspContribution.toLocaleString()} CAD</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={Math.min(30000, rrspSalary * 0.18)} 
                      step="500"
                      value={rrspContribution}
                      onChange={(e) => setRrspContribution(Number(e.target.value))}
                      className="w-full accent-[#006F3D] h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400">RRSP contribution limit is capped at 18% of your income up to the annual limit of ~$32,490.</p>
                  </div>
                </div>

                {/* Outputs */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-800">Your Calculated Refund Multiplier</h3>
                    <p className="text-xs text-slate-400">Based on standard Ontario tax brackets combining Federal & Provincial rates.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">Marginal Tax Bracket</p>
                      <p className="text-2xl font-bold text-slate-800 mt-1">{rrspTaxData.marginalRate}%</p>
                    </div>
                    <div className="bg-emerald-50/50 p-4 rounded-xl text-center border border-emerald-100">
                      <p className="text-xs text-slate-500 font-medium">Estimated Tax Refund</p>
                      <p className="text-2xl font-black text-[#006F3D] mt-1">${rrspTaxData.estimatedRefund.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#006F3D]/5 p-4 rounded-xl text-center border border-[#006F3D]/10">
                      <p className="text-xs text-slate-600 font-medium">Net Pocket Outlay</p>
                      <p className="text-2xl font-bold text-[#006F3D] mt-1">${(rrspContribution - rrspTaxData.estimatedRefund).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Refund supercharge tips */}
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start space-x-3 text-xs sm:text-sm">
                    <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#006F3D]">Supercharge Tip: The Reinvestment Cycle</p>
                      <p className="mt-1 leading-relaxed text-slate-600">
                        If you take your estimated tax refund of <span className="font-bold text-[#006F3D]">${rrspTaxData.estimatedRefund.toLocaleString()}</span> and reinvest it directly back into your TFSA or RRSP instead of spending it, you leverage compound interest on the government's deferred cash!
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 text-xs text-slate-500">
                    <p className="font-bold text-slate-600">Tax Bracket Explanation:</p>
                    <p className="leading-relaxed mt-1">
                      Because you earn ${rrspSalary.toLocaleString()} CAD, your top dollars are taxed at {rrspTaxData.marginalRate}%. Contributing ${rrspContribution.toLocaleString()} allows you to legally 'erase' that income from taxes, yielding an instant tax credit.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CALCULATOR 4: COMPOUND INTEREST SIMULATOR */}
            {activeCalc === 'compounding' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#006F3D]">Compound Configuration</h3>
                    <p className="text-xs text-slate-500 mt-1">See the exponential power of time on your savings.</p>
                  </div>

                  {/* Initial balance */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <label className="font-medium text-slate-700">Initial Balance</label>
                      <span className="font-mono font-bold text-[#006F3D]">${compoundInitial.toLocaleString()} CAD</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100000" 
                      step="5000"
                      value={compoundInitial}
                      onChange={(e) => setCompoundInitial(Number(e.target.value))}
                      className="w-full accent-[#006F3D] h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Monthly contribution */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <label className="font-medium text-slate-700">Monthly Contribution</label>
                      <span className="font-mono font-bold text-[#006F3D]">${compoundMonthly.toLocaleString()}/mo</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="2000" 
                      step="50"
                      value={compoundMonthly}
                      onChange={(e) => setCompoundMonthly(Number(e.target.value))}
                      className="w-full accent-[#006F3D] h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <label className="font-medium text-slate-700">Years of Growth</label>
                      <span className="font-mono font-bold text-[#006F3D]">{compoundYears} Years</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="40" 
                      step="1"
                      value={compoundYears}
                      onChange={(e) => setCompoundYears(Number(e.target.value))}
                      className="w-full accent-[#006F3D] h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Rate of return */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <label className="font-medium text-slate-700">Annual Return Rate</label>
                      <span className="font-mono font-bold text-[#006F3D]">{compoundRate}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="12" 
                      step="0.5"
                      value={compoundRate}
                      onChange={(e) => setCompoundRate(Number(e.target.value))}
                      className="w-full accent-[#006F3D] h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Chart Area */}
                <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-800">Compounding Curve vs. Flat Deposits</h3>
                    <p className="text-xs text-slate-400">See where compound interest takes off and outpaces your total contributions.</p>
                  </div>

                  {/* Recharts AreaChart */}
                  <div className="h-64 sm:h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={compoundData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#006F3D" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#006F3D" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorDep" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${(v/1000)}k`} />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                        <Area type="monotone" dataKey="With Compounding" stroke="#006F3D" strokeWidth={3} fillOpacity={1} fill="url(#colorComp)" />
                        <Area type="monotone" dataKey="Deposits Only" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorDep)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4 text-xs sm:text-sm">
                    <div>
                      <p className="text-slate-500">Total Money Deposited:</p>
                      <p className="text-lg font-bold text-slate-700">${compoundData[compoundData.length - 1]['Deposits Only'].toLocaleString()} CAD</p>
                    </div>
                    <div>
                      <p className="text-[#006F3D] font-bold">Total Compounded Value:</p>
                      <p className="text-2xl font-black text-[#006F3D]">${compoundData[compoundData.length - 1]['With Compounding'].toLocaleString()} CAD</p>
                    </div>
                    <div className="bg-[#10B981]/10 px-4 py-2 rounded-xl border border-[#10B981]/20">
                      <p className="text-[#00562F] font-bold text-xs">Compound Earnings Contribution:</p>
                      <p className="text-sm font-bold text-[#006F3D]">
                        ${(compoundData[compoundData.length - 1]['With Compounding'] - compoundData[compoundData.length - 1]['Deposits Only']).toLocaleString()} CAD
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: AI COACH --- */}
        {activeTab === 'coach' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Sidebar: personalized roadmap trigger */}
              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center space-x-2 text-[#006F3D]">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-display font-bold text-lg">Instant Canadian Savings Plan</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fill in your simplified details and let Gemini generate a personalized, structured tax & pension savings strategy tailored for you.
                </p>

                {/* Form inputs */}
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Your Age</label>
                    <input 
                      type="number"
                      value={wizardAge}
                      onChange={(e) => setWizardAge(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Gross Annual Salary (CAD)</label>
                    <input 
                      type="number"
                      value={wizardIncome}
                      onChange={(e) => setWizardIncome(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Current Retirement Savings (CAD)</label>
                    <input 
                      type="number"
                      value={wizardSavings}
                      onChange={(e) => setWizardSavings(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm font-medium"
                    />
                  </div>
                  <div className="flex items-center space-x-3 py-1">
                    <input 
                      type="checkbox"
                      id="wizard-pension"
                      checked={wizardPension}
                      onChange={(e) => setWizardPension(e.target.checked)}
                      className="w-4 h-4 text-[#006F3D] accent-[#006F3D]"
                    />
                    <label htmlFor="wizard-pension" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
                      Employer matches pension/RRSP contributions
                    </label>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">What is your primary savings goal?</label>
                    <select 
                      value={wizardGoal}
                      onChange={(e) => setWizardGoal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm font-medium"
                    >
                      <option>Buying my first home (HBP/FHSA)</option>
                      <option>Maximizing tax refund savings</option>
                      <option>Retiring early (Financial Independence)</option>
                      <option>Establishing a solid Emergency Fund</option>
                    </select>
                  </div>

                  <button 
                    id="btn-generate-roadmap"
                    onClick={handleGenerateRoadmap}
                    disabled={wizardLoading}
                    className="w-full bg-[#006F3D] hover:bg-[#00562F] text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                  >
                    {wizardLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Calculating Roadmap...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Generate My Canadian Roadmap</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Chat Panel / Output Roadmap */}
              <div className="lg:col-span-8 flex flex-col space-y-4">
                
                {/* Switch between Chat view and Generated Roadmap */}
                <div className="flex space-x-2 bg-white/50 border border-slate-200/50 p-1.5 rounded-2xl max-w-xs self-start text-xs font-bold shadow-sm">
                  <button 
                    onClick={() => { setRoadmapWizard(false); }}
                    className={`px-4 py-2 rounded-xl transition-all ${!roadmapWizard ? 'bg-white text-[#006F3D] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    💬 Ask Advisor Anything
                  </button>
                  <button 
                    onClick={() => { setRoadmapWizard(true); }}
                    className={`px-4 py-2 rounded-xl transition-all ${roadmapWizard ? 'bg-white text-[#006F3D] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    📃 My Custom Savings Plan
                  </button>
                </div>

                {/* CHAT INTERFACE */}
                {!roadmapWizard && (
                  <div className="bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col h-[500px]">
                    {/* Header */}
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-3xl flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-[#006F3D] p-2 rounded-full text-white">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-slate-800 text-sm">Manulife AI Advisor</h4>
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                            <span>Powered by Gemini 3.5 Flash</span>
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setChatMessages([
                            {
                              sender: 'ai',
                              text: "Hello! I am your AI Financial Literacy Coach, developed by the Manulife Academy. I can help you understand Registered Retirement Savings Plans (RRSPs), Tax-Free Savings Accounts (TFSAs), Canadian tax brackets, or how to maximize your employer's matching program. What is on your mind today?",
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }
                          ]);
                        }}
                        className="text-xs text-slate-400 hover:text-slate-600 hover:underline flex items-center space-x-1 font-semibold"
                        title="Reset conversations"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Clear chat</span>
                      </button>
                    </div>

                    {/* Message Log */}
                    <div className="flex-grow overflow-y-auto p-6 space-y-4">
                      {chatMessages.map((msg, idx) => (
                        <div 
                          key={idx}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-[#006F3D] text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}
                          >
                            <p className="whitespace-pre-line">{msg.text}</p>
                            <span className={`block text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                              {msg.timestamp}
                            </span>
                          </div>
                        </div>
                      ))}
                      {isGenerating && (
                        <div className="flex justify-start">
                          <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-sm shadow-sm flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef}></div>
                    </div>

                    {/* Inputs */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex items-center space-x-2">
                      <input 
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Ask about cumulative TFSA room, pension matching, tax refunds..."
                        className="flex-grow bg-white border border-slate-200 p-3 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#006F3D]"
                        disabled={isGenerating}
                      />
                      <button 
                        id="btn-send-message"
                        type="submit"
                        disabled={isGenerating || !currentMessage.trim()}
                        className="bg-[#006F3D] hover:bg-[#00562F] text-white p-3 rounded-2xl transition-all disabled:opacity-40 shadow-sm"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>

                    {aiError && (
                      <div className="p-3 bg-red-50 text-red-800 text-xs text-center font-semibold border-t border-red-100 rounded-b-3xl flex items-center justify-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span>{aiError}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* PERSONLIZED ROADMAP OUTPUT VIEW */}
                {roadmapWizard && (
                  <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm min-h-[500px] flex flex-col justify-between">
                    {wizardResult ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                          <div className="flex items-center space-x-2 text-[#006F3D]">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            <h4 className="font-display font-bold text-slate-800 text-lg">Your Personalized Roadmap</h4>
                          </div>
                          <button 
                            onClick={() => { setWizardResult(null); }}
                            className="text-xs text-[#006F3D] hover:underline font-semibold"
                          >
                            Re-configure parameters
                          </button>
                        </div>
                        <div className="prose prose-sm prose-emerald max-w-none text-slate-700 leading-relaxed space-y-4">
                          {/* Parse markdown simply for presentation */}
                          {wizardResult.split('\n\n').map((para, pIdx) => {
                            if (para.startsWith('###')) {
                              return <h5 key={pIdx} className="font-display font-bold text-[#006F3D] text-lg mt-6">{para.replace('###', '')}</h5>;
                            }
                            if (para.startsWith('##')) {
                              return <h4 key={pIdx} className="font-display font-bold text-[#006F3D] text-xl mt-6 border-b border-slate-100 pb-2">{para.replace('##', '')}</h4>;
                            }
                            if (para.startsWith('* ') || para.startsWith('- ')) {
                              return (
                                <ul key={pIdx} className="list-disc pl-5 space-y-2 text-slate-600 my-2">
                                  {para.split('\n').map((li, lIdx) => (
                                    <li key={lIdx}>{li.replace(/^[\*\-]\s+/, '')}</li>
                                  ))}
                                </ul>
                              );
                            }
                            return <p key={pIdx} className="text-sm">{para}</p>;
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center space-y-4 py-16 flex-grow">
                        <div className="bg-emerald-50 p-6 rounded-full text-[#006F3D] shadow-inner">
                          <Sparkles className="w-12 h-12 text-amber-500 animate-pulse" />
                        </div>
                        <h4 className="font-display font-bold text-xl text-slate-800">Your Action Guide Awaits</h4>
                        <p className="text-sm text-slate-500 max-w-md">
                          Configure your age, salary, and savings targets on the left, then click 'Generate' to receive a comprehensive, strategic wealth roadmap directly from Gemini.
                        </p>
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

        {/* --- TAB 4: MY DASHBOARD & BADGES --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Leaderboard & Daily Trivia */}
              <div className="lg:col-span-5 space-y-8">
                
                {/* Trivia Daily Challenge */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 text-orange-600 font-bold">
                    <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                    <h3 className="font-display text-slate-800 text-lg">Daily Streak Challenge</h3>
                  </div>
                  <p className="text-xs text-slate-500">Answer today's financial literacy question to maintain your 🔥 streak and earn +50 XP!</p>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-sm font-semibold text-slate-800 leading-normal">
                      {DAILY_CHALLENGE.question}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {DAILY_CHALLENGE.options.map((opt, oIdx) => {
                      const isChosen = dailyAnswer === oIdx;
                      const isCorrect = oIdx === DAILY_CHALLENGE.correctAnswerIndex;
                      
                      let btnStyle = "w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex justify-between items-center bg-white ";
                      if (dailySubmitted) {
                        if (isCorrect) {
                          btnStyle += "bg-emerald-50 border-emerald-300 text-emerald-800";
                        } else if (isChosen) {
                          btnStyle += "bg-red-50 border-red-300 text-red-800";
                        } else {
                          btnStyle += "bg-slate-50 border-slate-200 text-slate-400";
                        }
                      } else {
                        btnStyle += "hover:bg-slate-50 border-slate-200 text-slate-700 active:bg-slate-100";
                      }

                      return (
                        <button 
                          key={oIdx}
                          disabled={dailySubmitted}
                          onClick={() => handleDailySubmit(oIdx)}
                          className={btnStyle}
                        >
                          <span>{opt}</span>
                          {dailySubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                          {dailySubmitted && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {dailySubmitted && (
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs text-slate-600 leading-relaxed">
                      <p className="font-bold mb-1">{dailyCorrect ? '🎉 Correct Answer! (+50 XP)' : '❌ Incorrect Selection'}</p>
                      <p>{DAILY_CHALLENGE.explanation}</p>
                    </div>
                  )}
                </div>

                {/* Scoreboard / Leaderboard */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 text-[#006F3D] font-bold">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <h3 className="font-display text-slate-800 text-lg">National Peer Leaderboard</h3>
                  </div>
                  <p className="text-xs text-slate-500">Compete with other Canadian adults learning how to max out tax shelters!</p>

                  <div className="space-y-2">
                    {updatedLeaderboard.map((user, uIdx) => (
                      <div 
                        key={uIdx}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${user.current ? 'bg-emerald-50/50 border-emerald-300 shadow-sm' : 'bg-slate-50/50 border-slate-100'}`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${uIdx === 0 ? 'bg-amber-100 text-amber-700' : uIdx === 1 ? 'bg-slate-200 text-slate-700' : uIdx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                            {user.rank}
                          </span>
                          <span className={`text-xs font-semibold ${user.current ? 'text-[#006F3D] font-black' : 'text-slate-700'}`}>
                            {user.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-800 font-mono">
                          {user.xp.toLocaleString()} XP
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Badges Drawer */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-slate-800 flex items-center space-x-2">
                    <Award className="w-6 h-6 text-[#006F3D]" />
                    <span>My Achievement Cabinet</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Acquire specialized credentials as you expand your Canadian financial literacy.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {BADGES.map((badge) => {
                    const isUnlocked = progress.unlockedBadges.includes(badge.id);
                    return (
                      <div 
                        key={badge.id}
                        className={`p-4 rounded-2xl border text-center relative transition-all-custom flex flex-col items-center justify-between h-40 ${isUnlocked ? 'bg-emerald-50/20 border-[#10B981]/30 shadow-sm hover:shadow' : 'bg-slate-50/50 border-slate-100 opacity-60'}`}
                      >
                        {isUnlocked && (
                          <span className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-0.5" title="Credential Unlocked">
                            <Check className="w-3 h-3" />
                          </span>
                        )}

                        <span className={`text-4xl my-2 block ${isUnlocked ? 'animate-pulse' : 'grayscale'}`}>
                          {badge.icon}
                        </span>

                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-800 leading-tight">
                            {badge.title}
                          </p>
                          <p className="text-[10px] text-slate-400 leading-normal max-w-[120px] mx-auto">
                            {badge.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 flex items-start space-x-3">
                  <GraduationCap className="w-5 h-5 text-[#006F3D] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-600">Secure Your Digital Certification</p>
                    <p className="mt-1 leading-relaxed">
                      Complete all 5 core modules and securing their quiz badges. Doing so entitles you to download a formal self-study Financial Literacy micro-credential certificate.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* --- IN-LESSON MODAL SCREEN VIEW (Immersive micro learning container) --- */}
      <AnimatePresence>
        {activeModule && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-3xl rounded-3xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col justify-between"
            >
              {/* Header */}
              <div className="bg-[#006F3D] text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-300 font-bold">Module learning path</span>
                  <h4 className="font-display font-bold text-base sm:text-lg leading-tight mt-0.5">{activeModule.title}</h4>
                </div>
                <button 
                  onClick={handleCloseModule}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#004A28] h-1.5">
                <div 
                  className="bg-[#10B981] h-full transition-all duration-300"
                  style={{ 
                    width: `${quizActive 
                      ? 100 
                      : ((currentLessonIndex + 1) / activeModule.lessons.length) * 100}%` 
                  }}
                ></div>
              </div>

              {/* Main Immersive content area */}
              <div className="p-6 sm:p-8 flex-grow overflow-y-auto min-h-[300px]">
                
                {/* 1. LESSON TEXT SLIDES */}
                {!quizActive && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-bold uppercase">
                      <span>Lesson {currentLessonIndex + 1} of {activeModule.lessons.length}</span>
                      <span>{activeModule.lessons[currentLessonIndex].title}</span>
                    </div>

                    <div className="prose prose-sm prose-emerald max-w-none text-slate-700 leading-relaxed">
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-800 leading-snug">
                        {activeModule.lessons[currentLessonIndex].title}
                      </h3>
                      <p className="whitespace-pre-line text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
                        {activeModule.lessons[currentLessonIndex].content}
                      </p>
                    </div>

                    <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl space-y-2 mt-6">
                      <h5 className="font-display font-bold text-xs text-[#006F3D] uppercase tracking-wider">Key Takeaways:</h5>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {activeModule.lessons[currentLessonIndex].bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start space-x-2">
                            <span className="text-[#006F3D] font-bold mt-0.5">•</span>
                            <span className="leading-relaxed">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 2. QUIZ CHALLENGE PANEL */}
                {quizActive && !quizSubmitted && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 text-[#006F3D] font-bold text-xs uppercase font-mono">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>Module Quiz Challenge</span>
                    </div>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-slate-800">
                      Answer {activeModule.quiz.length} questions to secure your badge!
                    </h3>

                    <div className="space-y-6 pt-2">
                      {activeModule.quiz.map((q, qIdx) => (
                        <div key={q.id} className="space-y-3 border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                          <p className="text-sm font-semibold text-slate-700">
                            {qIdx + 1}. {q.question}
                          </p>
                          <div className="grid grid-cols-1 gap-2">
                            {q.options.map((opt, oIdx) => {
                              const isSelected = quizAnswers[qIdx] === oIdx;
                              return (
                                <button 
                                  key={oIdx}
                                  onClick={() => handleSelectQuizOption(qIdx, oIdx)}
                                  className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${isSelected ? 'bg-emerald-50 border-emerald-500 text-[#006F3D]' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. QUIZ RESULTS PANEL */}
                {quizActive && quizSubmitted && quizResults && (
                  <div className="text-center py-6 max-w-md mx-auto space-y-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm text-3xl ${quizResults.passed ? 'bg-emerald-100' : 'bg-red-100'}`}>
                      {quizResults.passed ? '🎉' : '⏳'}
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-xl sm:text-2xl text-slate-800">
                        {quizResults.passed ? 'Congratulations! You Passed!' : 'Study Up and Try Again'}
                      </h4>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                        You answered <span className="font-bold text-[#006F3D]">{quizResults.score} out of {activeModule.quiz.length}</span> questions correctly.
                      </p>
                    </div>

                    {quizResults.passed ? (
                      <div className="bg-emerald-50 p-4 border border-emerald-100 rounded-xl text-xs text-[#006F3D] font-bold">
                        🎁 Awarded +{activeModule.xpReward} XP! Credential added to your Dashboard.
                      </div>
                    ) : (
                      <div className="bg-amber-50 p-4 border border-amber-100 rounded-xl text-xs text-amber-800">
                        You need at least 2 correct answers to pass. Let's review the materials and retry.
                      </div>
                    )}

                    {/* Show explanation reviews */}
                    <div className="text-left space-y-4 pt-2 border-t border-slate-100">
                      <p className="text-xs uppercase font-mono text-slate-400 font-semibold">Review Questions Explanation:</p>
                      {activeModule.quiz.map((q, idx) => (
                        <div key={q.id} className="text-xs bg-slate-50 p-3 rounded-lg leading-relaxed">
                          <p className="font-bold text-slate-700">{q.question}</p>
                          <p className="text-slate-500 mt-1"><span className="text-[#006F3D] font-bold">Correct answer:</span> {q.options[q.correctAnswerIndex]}</p>
                          <p className="text-slate-400 mt-0.5 italic">{q.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                {!quizActive ? (
                  <>
                    <button 
                      onClick={handlePrevLesson}
                      disabled={currentLessonIndex === 0}
                      className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all text-slate-600 flex items-center space-x-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <span className="text-xs font-semibold text-slate-400 font-mono">
                      {currentLessonIndex + 1} / {activeModule.lessons.length}
                    </span>
                    <button 
                      onClick={handleNextLesson}
                      className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#006F3D] hover:bg-[#00562F] text-white transition-all flex items-center space-x-1 shadow-sm"
                    >
                      <span>{currentLessonIndex === activeModule.lessons.length - 1 ? 'Go to Quiz' : 'Continue'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    {!quizSubmitted ? (
                      <>
                        <button 
                          onClick={() => setQuizActive(false)}
                          className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-slate-600"
                        >
                          Review Lesson
                        </button>
                        <button 
                          onClick={handleSubmitQuiz}
                          disabled={Object.keys(quizAnswers).length < activeModule.quiz.length}
                          className="px-5 py-2 rounded-xl text-xs font-bold bg-[#006F3D] hover:bg-[#00562F] text-white transition-all shadow-sm disabled:opacity-50"
                        >
                          Submit Answers
                        </button>
                      </>
                    ) : (
                      <>
                        {!quizResults?.passed && (
                          <button 
                            onClick={() => {
                              setQuizSubmitted(false);
                              setQuizResults(null);
                              setQuizAnswers({});
                              setQuizActive(true);
                            }}
                            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-slate-600 flex items-center space-x-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Retry Quiz</span>
                          </button>
                        )}
                        <button 
                          onClick={handleCloseModule}
                          className="px-5 py-2 rounded-xl text-xs font-bold bg-[#006F3D] hover:bg-[#00562F] text-white transition-all ml-auto"
                        >
                          Close Module
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FOOTER (Standard legal clean notes) --- */}
      <footer className="bg-slate-900 text-white/60 py-8 border-t border-slate-800 text-xs text-center mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex justify-center space-x-2 text-[#10B981] font-bold">
            <span>Manulife Financial Literacy Academy</span>
            <span>•</span>
            <span>Self-Study Micro-Credential</span>
          </div>
          <p className="max-w-2xl mx-auto leading-relaxed">
            Disclaimer: This application is a prototype created using artificial intelligence for educational and demonstration purposes. It is not a real financial product and has no association with or endorsement by the Manulife brand. All calculations, simulators, and AI roadmap guides generated within this prototype are simulated and should not be relied upon as formal tax, legal, or investment advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
