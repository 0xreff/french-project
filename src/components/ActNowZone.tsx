'use client'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

/* ── Quiz questions on SDG 12 & 13 ── */
const QUIZ_QUESTIONS = [
  {
    question: 'What does SDG 13 stand for?',
    options: ['Clean Water', 'Climate Action', 'Life Below Water', 'Affordable Energy'],
    correct: 1,
  },
  {
    question: 'How much food is wasted globally each year?',
    options: ['250 million tonnes', '931 million tonnes', '500 million tonnes', '1.5 billion tonnes'],
    correct: 1,
  },
  {
    question: 'What percentage of the global economy is circular?',
    options: ['25%', '15.2%', '8.6%', '42%'],
    correct: 2,
  },
  {
    question: 'At current consumption rates, how many planets would we need by 2050?',
    options: ['1.5', '2', '3', '5'],
    correct: 2,
  },
  {
    question: 'By how much did global temperature rise in 2024 (above pre-industrial)?',
    options: ['+0.8°C', '+1.2°C', '+1.55°C', '+2.1°C'],
    correct: 2,
  },
]

const CHALLENGES = [
  { day: 1, task: 'Refuse all single-use plastic today', icon: '🚫' },
  { day: 2, task: 'Walk or bike instead of driving', icon: '🚶' },
  { day: 3, task: 'Eat a fully plant-based meal', icon: '🥗' },
  { day: 4, task: 'Unplug unused electronics', icon: '🔌' },
  { day: 5, task: 'Repair something instead of buying new', icon: '🔧' },
  { day: 6, task: 'Share this museum with 3 friends', icon: '📤' },
  { day: 7, task: 'Plant a seed or water a plant', icon: '🌱' },
]

function QuizSection() {
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)

  const q = QUIZ_QUESTIONS[current]

  const handleSelect = (idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    setShowResult(true)
    if (idx === q.correct) setScore((s) => s + 1)

    setTimeout(() => {
      if (current < QUIZ_QUESTIONS.length - 1) {
        setCurrent((c) => c + 1)
        setSelected(null)
        setShowResult(false)
      } else {
        setFinished(true)
      }
    }, 1500)
  }

  const resetQuiz = () => {
    setCurrent(0)
    setScore(0)
    setSelected(null)
    setShowResult(false)
    setFinished(false)
  }

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface border border-border rounded-sm p-12 text-center"
      >
        <span className="text-6xl mb-6 block">{score >= 4 ? '🏆' : score >= 2 ? '👏' : '💪'}</span>
        <h3 className="font-display text-4xl font-semibold mb-4">
          {score} / {QUIZ_QUESTIONS.length}
        </h3>
        <p className="font-body text-base text-muted mb-8">
          {score >= 4
            ? 'Excellent! You\'re a true climate scholar.'
            : score >= 2
            ? 'Good effort! Keep learning about our planet.'
            : 'Every expert was once a beginner. Try again!'}
        </p>
        <button
          onClick={resetQuiz}
          className="px-8 py-3 bg-accent text-bg font-body text-xs tracking-widest2 uppercase hover:bg-accent-2 transition-colors duration-300"
        >
          Try Again
        </button>
      </motion.div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-sm p-10 md:p-14">
      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        <p className="font-body text-xs tracking-widest3 uppercase text-accent">
          Question {current + 1} / {QUIZ_QUESTIONS.length}
        </p>
        <p className="font-body text-xs text-muted">Score: {score}</p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-border rounded-full mb-10 overflow-hidden">
        <motion.div
          className="h-full bg-accent rounded-full"
          animate={{ width: `${((current + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="font-display text-2xl md:text-3xl font-semibold mb-8">{q.question}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {q.options.map((opt, idx) => {
              let bgClass = 'bg-bg border-border hover:border-accent/40'
              if (showResult && idx === q.correct) bgClass = 'bg-emerald-500/10 border-emerald-500/50'
              if (showResult && idx === selected && idx !== q.correct) bgClass = 'bg-red-500/10 border-red-500/50'

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                  className={`text-left p-5 border rounded-sm font-body text-sm transition-all duration-300 ${bgClass} ${
                    selected === null ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <span className="text-accent font-semibold mr-3">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function ChallengeCard() {
  const [checked, setChecked] = useState<boolean[]>(new Array(7).fill(false))

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })
  }

  const completed = checked.filter(Boolean).length

  return (
    <div className="bg-surface border border-border rounded-sm p-10 md:p-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-2">7-Day Challenge</p>
          <h3 className="font-display text-2xl md:text-3xl font-semibold">Green Week Challenge</h3>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-bold text-accent">{completed}/7</p>
          <p className="font-body text-xs text-muted">completed</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-border rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #4ecdc4, #44a08d)' }}
          animate={{ width: `${(completed / 7) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="space-y-3">
        {CHALLENGES.map((ch, i) => (
          <button
            key={ch.day}
            onClick={() => toggle(i)}
            className={`w-full flex items-center gap-4 p-4 rounded-sm border text-left transition-all duration-300 ${
              checked[i]
                ? 'bg-emerald-500/10 border-emerald-500/30 line-through'
                : 'bg-bg border-border hover:border-accent/30'
            }`}
          >
            <div className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
              checked[i] ? 'bg-emerald-500 border-emerald-500' : 'border-muted'
            }`}>
              {checked[i] && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-xl">{ch.icon}</span>
            <div>
              <p className="font-body text-xs text-accent mb-0.5">Day {ch.day}</p>
              <p className={`font-body text-sm ${checked[i] ? 'text-muted' : 'text-text'}`}>{ch.task}</p>
            </div>
          </button>
        ))}
      </div>

      {completed === 7 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-center"
        >
          <span className="text-4xl mb-3 block">🌍</span>
          <p className="font-display text-xl font-semibold text-emerald-400 mb-2">Challenge Complete!</p>
          <p className="font-body text-sm text-muted">You&apos;ve made a real difference this week. Keep going!</p>
        </motion.div>
      )}
    </div>
  )
}

export default function ActNowZone() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="actnow" ref={sectionRef} className="relative bg-bg py-32 px-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-[0.04] pointer-events-none"
           style={{ background: 'radial-gradient(circle, #c9a96e 0%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-4">Hall 05 — Act Now Zone</p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,6rem)] font-light leading-[1.05] tracking-tight mb-6">
            Your Turn —<br />
            <span className="font-semibold text-accent">Act Now</span>
          </h2>
          <p className="font-body text-base text-muted max-w-2xl mx-auto leading-relaxed">
            Knowledge without action is meaningless. Test what you&apos;ve learned,
            then take the 7-day challenge to make a real impact.
          </p>
        </motion.div>

        {/* Quiz */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <QuizSection />
        </motion.div>

        {/* Challenge */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <ChallengeCard />
        </motion.div>

        {/* CTA links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-6">Learn More</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://sdgs.un.org/goals/goal12"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-4 border border-border text-text font-body text-xs tracking-widest2 uppercase hover:border-accent hover:text-accent transition-all duration-300"
            >
              SDG 12 — Responsible Consumption
            </a>
            <a
              href="https://sdgs.un.org/goals/goal13"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-4 bg-accent text-bg font-body text-xs tracking-widest2 uppercase hover:bg-accent-2 transition-colors duration-300"
            >
              SDG 13 — Climate Action
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
