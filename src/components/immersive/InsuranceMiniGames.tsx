"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ── GAME 1: Insurance Quiz ──
const quizQuestions = [
  { q: "What does CSR stand for in insurance?", options: ["Customer Service Rating", "Claim Settlement Ratio", "Coverage Safety Report", "Cash Surrender Rate"], answer: 1 },
  { q: "Which insurance is mandatory for vehicles in India?", options: ["Comprehensive", "Third-party liability", "Zero depreciation", "Personal accident"], answer: 1 },
  { q: "What is the maximum tax deduction under Section 80D?", options: ["₹25,000", "₹50,000", "₹75,000", "₹1,00,000"], answer: 2 },
  { q: "What does IDV stand for in motor insurance?", options: ["Insurance Declared Value", "Insured Damage Value", "Initial Deposit Value", "Insured Declared Value"], answer: 3 },
  { q: "Pre-existing disease waiting period is typically?", options: ["30 days", "6 months", "24-48 months", "5 years"], answer: 2 },
  { q: "Which body regulates insurance in India?", options: ["RBI", "SEBI", "IRDAI", "NABARD"], answer: 2 },
  { q: "No Claim Bonus (NCB) in motor insurance max is?", options: ["20%", "35%", "50%", "75%"], answer: 2 },
  { q: "Minimum travel insurance for Schengen visa?", options: ["€10,000", "€20,000", "€30,000", "€50,000"], answer: 2 },
  { q: "What is a family floater health plan?", options: ["Individual plan for family head", "One policy covers entire family", "Separate policies bundled together", "Plan only for children"], answer: 1 },
  { q: "Term insurance provides coverage for?", options: ["Whole life", "A specific period", "Until age 50", "5 years only"], answer: 1 },
];

function InsuranceQuiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === quizQuestions[current].answer;
    if (correct) {
      setScore((s) => s + 10 + streak * 5);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    setShowResult(true);
    setTimeout(() => {
      if (current + 1 < quizQuestions.length) {
        setCurrent((c) => c + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        setGameOver(true);
      }
    }, 1500);
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setGameOver(false);
    setStreak(0);
  };

  if (gameOver) {
    const maxScore = quizQuestions.length * 10 + 45 * 5;
    const pct = Math.round((score / (quizQuestions.length * 10)) * 100);
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
        <div className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 50 ? "⭐" : "📚"}</div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {pct >= 80 ? "Insurance Expert!" : pct >= 50 ? "Well Done!" : "Keep Learning!"}
        </h3>
        <p className="text-white/60 mb-1">Score: <span className="text-[var(--accent)] font-bold">{score}</span> points</p>
        <p className="text-white/40 text-sm mb-6">{Math.round(score / 10)}/{quizQuestions.length} correct answers</p>
        <button onClick={restart} className="px-6 py-3 bg-[var(--accent)] text-white rounded-xl font-semibold hover:brightness-110 transition-all">
          Play Again 🔄
        </button>
      </motion.div>
    );
  }

  const q = quizQuestions[current];
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/40 text-sm">Question {current + 1}/{quizQuestions.length}</span>
        <div className="flex items-center gap-3">
          {streak > 1 && <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full">🔥 {streak}x Streak</span>}
          <span className="text-[var(--accent)] font-bold">{score} pts</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1.5 mb-6">
        <motion.div className="bg-[var(--accent)] h-1.5 rounded-full" animate={{ width: `${((current + 1) / quizQuestions.length) * 100}%` }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
          <h3 className="text-lg font-semibold text-white mb-5">{q.q}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.answer;
              const isSelected = i === selected;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={cn(
                    "p-4 rounded-xl text-left text-sm font-medium transition-all border",
                    selected === null && "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20",
                    showResult && isCorrect && "bg-emerald-500/20 border-emerald-500 text-emerald-400",
                    showResult && isSelected && !isCorrect && "bg-red-500/20 border-red-500 text-red-400",
                    showResult && !isSelected && !isCorrect && "opacity-40"
                  )}
                >
                  <span className="mr-2 text-xs opacity-50">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── GAME 2: Coverage Calculator Challenge ──
function CoverageChallenge() {
  const [age, setAge] = useState(30);
  const [income, setIncome] = useState(10);
  const [dependents, setDependents] = useState(2);
  const [showAnswer, setShowAnswer] = useState(false);

  const idealHealth = Math.max(5, income * 3);
  const idealTerm = income * 15;
  const score = Math.min(100, Math.round((age < 35 ? 90 : age < 45 ? 75 : 60) + dependents * 5));

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">💡 What&apos;s Your Ideal Coverage?</h3>
      <p className="text-white/50 text-sm mb-6">Input your details and discover the recommended coverage!</p>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60">Your Age</span>
            <span className="text-[var(--accent)] font-bold">{age} years</span>
          </div>
          <input type="range" min={18} max={65} value={age} onChange={(e) => { setAge(+e.target.value); setShowAnswer(false); }}
            className="w-full h-2 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent)] [&::-webkit-slider-thumb]:cursor-pointer" />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60">Annual Income</span>
            <span className="text-[var(--accent)] font-bold">₹{income}L/yr</span>
          </div>
          <input type="range" min={3} max={100} value={income} onChange={(e) => { setIncome(+e.target.value); setShowAnswer(false); }}
            className="w-full h-2 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent)] [&::-webkit-slider-thumb]:cursor-pointer" />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60">Dependents</span>
            <span className="text-[var(--accent)] font-bold">{dependents}</span>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => { setDependents(n); setShowAnswer(false); }}
                className={cn("w-10 h-10 rounded-lg text-sm font-medium transition-all",
                  dependents === n ? "bg-[var(--accent)] text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
                )}>{n}</button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={() => setShowAnswer(true)}
        className="w-full mt-6 py-3 bg-gradient-to-r from-[var(--accent)] to-[var(--health)] text-white rounded-xl font-semibold hover:brightness-110 transition-all">
        Calculate My Coverage 🎯
      </button>

      <AnimatePresence>
        {showAnswer && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="mt-5 overflow-hidden">
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-3xl">🛡️</div>
                <div>
                  <p className="text-white font-semibold">Your Protection Score</p>
                  <p className="text-[var(--accent)] text-2xl font-bold">{score}/100</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--health)]/10 rounded-lg p-3 border border-[var(--health)]/20">
                  <p className="text-xs text-white/50">Health Insurance</p>
                  <p className="text-white font-bold text-lg">₹{idealHealth}L+</p>
                  <p className="text-xs text-white/40">recommended cover</p>
                </div>
                <div className="bg-[var(--term)]/10 rounded-lg p-3 border border-[var(--term)]/20">
                  <p className="text-xs text-white/50">Term Insurance</p>
                  <p className="text-white font-bold text-lg">₹{idealTerm >= 100 ? `${(idealTerm / 100).toFixed(1)}Cr` : `${idealTerm}L`}</p>
                  <p className="text-xs text-white/40">recommended cover</p>
                </div>
              </div>
              <p className="text-[10px] text-white/30 mt-3">*Illustrative calculation. Consult a financial advisor for personalized advice.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── GAME 3: Quick Math Challenge ──
function MathChallenge() {
  const [question, setQuestion] = useState({ text: "", answer: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameActive, setGameActive] = useState(false);
  const [totalRounds] = useState(8);

  const generateQuestion = useCallback(() => {
    const types = [
      () => {
        const premium = Math.round((Math.random() * 20 + 5) * 100) * 10;
        const years = Math.floor(Math.random() * 4) + 2;
        return { text: `Premium ₹${premium.toLocaleString()}/yr for ${years} years. Total cost?`, answer: premium * years };
      },
      () => {
        const total = Math.round((Math.random() * 5 + 1) * 100000);
        const copay = [10, 15, 20][Math.floor(Math.random() * 3)];
        return { text: `Hospital bill ₹${(total / 1000).toFixed(0)}K with ${copay}% co-pay. You pay?`, answer: Math.round(total * copay / 100) };
      },
      () => {
        const ncb = [20, 25, 35, 45, 50][Math.floor(Math.random() * 5)];
        const base = Math.round((Math.random() * 10 + 5) * 1000);
        return { text: `Base premium ₹${base.toLocaleString()} with ${ncb}% NCB. You pay?`, answer: Math.round(base * (100 - ncb) / 100) };
      },
      () => {
        const monthly = Math.round((Math.random() * 3 + 1) * 500);
        return { text: `Monthly premium ₹${monthly.toLocaleString()}. Annual cost?`, answer: monthly * 12 };
      },
      () => {
        const si = [5, 10, 15, 25, 50][Math.floor(Math.random() * 5)];
        const rate = [1.5, 2, 2.5, 3][Math.floor(Math.random() * 4)];
        return { text: `${rate}% premium rate on ₹${si}L cover. Annual premium?`, answer: Math.round(si * 100000 * rate / 100) };
      },
    ];
    const gen = types[Math.floor(Math.random() * types.length)]();
    const wrongAnswers = [
      Math.round(gen.answer * (0.7 + Math.random() * 0.2)),
      Math.round(gen.answer * (1.1 + Math.random() * 0.3)),
      Math.round(gen.answer * (0.5 + Math.random() * 0.3)),
    ];
    const allOptions = [gen.answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    setQuestion(gen);
    setOptions(allOptions);
    setSelected(null);
    setTimeLeft(10);
  }, []);

  useEffect(() => {
    if (!gameActive || selected !== null) return;
    if (timeLeft <= 0) {
      setSelected(-1);
      setTimeout(() => {
        if (round + 1 < totalRounds) {
          setRound((r) => r + 1);
          generateQuestion();
        } else {
          setGameActive(false);
        }
      }, 1500);
      return;
    }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, gameActive, selected, round, totalRounds, generateQuestion]);

  const startGame = () => {
    setScore(0);
    setRound(0);
    setGameActive(true);
    generateQuestion();
  };

  const handleAnswer = (val: number) => {
    if (selected !== null) return;
    setSelected(val);
    if (val === question.answer) {
      setScore((s) => s + timeLeft * 10 + 50);
    }
    setTimeout(() => {
      if (round + 1 < totalRounds) {
        setRound((r) => r + 1);
        generateQuestion();
      } else {
        setGameActive(false);
      }
    }, 1200);
  };

  if (!gameActive && round === 0) {
    return (
      <div className="text-center py-6">
        <div className="text-5xl mb-4">🧮</div>
        <h3 className="text-xl font-bold text-white mb-2">Insurance Math Challenge</h3>
        <p className="text-white/50 text-sm mb-6">Solve premium calculations before time runs out!</p>
        <button onClick={startGame} className="px-8 py-3 bg-gradient-to-r from-[var(--motor)] to-emerald-500 text-white rounded-xl font-semibold hover:brightness-110 transition-all">
          Start Challenge ⚡
        </button>
      </div>
    );
  }

  if (!gameActive && round > 0) {
    const maxPossible = totalRounds * 150;
    const pct = Math.round((score / maxPossible) * 100);
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
        <div className="text-5xl mb-3">{pct >= 70 ? "🧠" : pct >= 40 ? "💪" : "📖"}</div>
        <h3 className="text-xl font-bold text-white mb-1">{pct >= 70 ? "Math Wizard!" : pct >= 40 ? "Good Try!" : "Keep Practicing!"}</h3>
        <p className="text-[var(--accent)] text-3xl font-bold mb-1">{score} pts</p>
        <p className="text-white/40 text-sm mb-5">Speed + Accuracy bonus</p>
        <button onClick={startGame} className="px-6 py-3 bg-[var(--accent)] text-white rounded-xl font-semibold hover:brightness-110 transition-all">
          Play Again 🔄
        </button>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/40 text-sm">Round {round + 1}/{totalRounds}</span>
        <span className="text-[var(--accent)] font-bold">{score} pts</span>
      </div>
      <div className="flex items-center gap-2 mb-5">
        <div className="flex-1 bg-white/10 rounded-full h-2">
          <motion.div className={cn("h-2 rounded-full", timeLeft > 5 ? "bg-emerald-500" : timeLeft > 2 ? "bg-amber-500" : "bg-red-500")}
            animate={{ width: `${(timeLeft / 10) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
        <span className={cn("text-sm font-mono font-bold w-6 text-center", timeLeft <= 3 ? "text-red-400" : "text-white/60")}>{timeLeft}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={round} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
          <p className="text-white text-base font-medium mb-5">{question.text}</p>
          <div className="grid grid-cols-2 gap-3">
            {options.map((opt, i) => {
              const isCorrect = opt === question.answer;
              const isChosen = opt === selected;
              return (
                <button key={i} onClick={() => handleAnswer(opt)} disabled={selected !== null}
                  className={cn("p-3.5 rounded-xl text-center font-semibold transition-all border",
                    selected === null && "bg-white/5 border-white/10 text-white hover:bg-white/10",
                    selected !== null && isCorrect && "bg-emerald-500/20 border-emerald-500 text-emerald-400",
                    selected !== null && isChosen && !isCorrect && "bg-red-500/20 border-red-500 text-red-400",
                    selected !== null && !isChosen && !isCorrect && "opacity-30"
                  )}>
                  ₹{opt.toLocaleString()}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── MAIN COMPONENT ──
type GameType = "quiz" | "coverage" | "math";

export default function InsuranceMiniGames() {
  const [activeGame, setActiveGame] = useState<GameType>("quiz");

  const games: { id: GameType; name: string; icon: string; desc: string }[] = [
    { id: "quiz", name: "Insurance Quiz", icon: "🧠", desc: "Test your knowledge" },
    { id: "coverage", name: "Coverage Finder", icon: "🛡️", desc: "Find ideal coverage" },
    { id: "math", name: "Math Challenge", icon: "🧮", desc: "Solve premium math" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Game selector tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGame(g.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeGame === g.id
                ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
            )}
          >
            <span>{g.icon}</span>
            <span>{g.name}</span>
          </button>
        ))}
      </div>

      {/* Active game */}
      <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <AnimatePresence mode="wait">
          <motion.div key={activeGame} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {activeGame === "quiz" && <InsuranceQuiz />}
            {activeGame === "coverage" && <CoverageChallenge />}
            {activeGame === "math" && <MathChallenge />}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="text-center text-white/20 text-[10px] mt-3">Games are for educational entertainment only.</p>
    </div>
  );
}
