'use client'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const QUIZ_QUESTIONS = [
  {
    question: 'Que signifie l\'ODD 13 ?',
    options: ['Eau propre', 'Action climatique', 'Vie aquatique', 'Énergie abordable'],
    correct: 1,
  },
  {
    question: 'Combien de nourriture est gaspillée chaque année dans le monde ?',
    options: ['250 millions de tonnes', '931 millions de tonnes', '500 millions de tonnes', '1,5 milliard de tonnes'],
    correct: 1,
  },
  {
    question: 'Quel pourcentage de l\'économie mondiale est circulaire ?',
    options: ['25 %', '15,2 %', '8,6 %', '42 %'],
    correct: 2,
  },
  {
    question: 'Au rythme actuel, combien de planètes faudrait-il d\'ici 2050 ?',
    options: ['1,5', '2', '3', '5'],
    correct: 2,
  },
  {
    question: 'De combien la température a-t-elle augmenté en 2024 (par rapport à l\'ère préindustrielle) ?',
    options: ['+0,8°C', '+1,2°C', '+1,55°C', '+2,1°C'],
    correct: 2,
  },
]

const CHALLENGES = [
  { day: 1, task: 'Refuser tout plastique à usage unique aujourd\'hui', icon: '🚫' },
  { day: 2, task: 'Marcher ou pédaler au lieu de conduire', icon: '🚶' },
  { day: 3, task: 'Manger un repas 100 % végétal', icon: '🥗' },
  { day: 4, task: 'Débrancher les appareils inutilisés', icon: '🔌' },
  { day: 5, task: 'Réparer quelque chose au lieu d\'acheter du neuf', icon: '🔧' },
  { day: 6, task: 'Partager ce musée avec 3 amis', icon: '📤' },
  { day: 7, task: 'Planter une graine ou arroser une plante', icon: '🌱' },
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
            ? 'Excellent ! Vous êtes un véritable expert du climat.'
            : score >= 2
            ? 'Bon effort ! Continuez à apprendre sur notre planète.'
            : 'Chaque expert a été débutant. Réessayez !'}
        </p>
        <button
          onClick={resetQuiz}
          className="px-8 py-3 bg-accent text-bg font-body text-xs tracking-widest2 uppercase hover:bg-accent-2 transition-colors duration-300"
        >
          Réessayer
        </button>
      </motion.div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-sm p-10 md:p-14">
      <div className="flex items-center justify-between mb-8">
        <p className="font-body text-xs tracking-widest3 uppercase text-accent">
          Question {current + 1} / {QUIZ_QUESTIONS.length}
        </p>
        <p className="font-body text-xs text-muted">Score : {score}</p>
      </div>

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
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-2">Défi 7 jours</p>
          <h3 className="font-display text-2xl md:text-3xl font-semibold">Semaine Verte</h3>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-bold text-accent">{completed}/7</p>
          <p className="font-body text-xs text-muted">accomplis</p>
        </div>
      </div>

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
              <p className="font-body text-xs text-accent mb-0.5">Jour {ch.day}</p>
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
          <p className="font-display text-xl font-semibold text-emerald-400 mb-2">Défi accompli !</p>
          <p className="font-body text-sm text-muted">Vous avez fait une vraie différence cette semaine. Continuez !</p>
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
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-[0.04] pointer-events-none"
           style={{ background: 'radial-gradient(circle, #c9a96e 0%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-4">Salle 05 — Zone d&apos;Action</p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,6rem)] font-light leading-[1.05] tracking-tight mb-6">
            À votre tour —<br />
            <span className="font-semibold text-accent">Agissez maintenant</span>
          </h2>
          <p className="font-body text-base text-muted max-w-2xl mx-auto leading-relaxed">
            Le savoir sans action est inutile. Testez ce que vous avez appris,
            puis relevez le défi de 7 jours pour avoir un vrai impact.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <QuizSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <ChallengeCard />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-6">En savoir plus</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://sdgs.un.org/goals/goal12"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-4 border border-border text-text font-body text-xs tracking-widest2 uppercase hover:border-accent hover:text-accent transition-all duration-300"
            >
              ODD 12 — Consommation Responsable
            </a>
            <a
              href="https://sdgs.un.org/goals/goal13"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-4 bg-accent text-bg font-body text-xs tracking-widest2 uppercase hover:bg-accent-2 transition-colors duration-300"
            >
              ODD 13 — Action Climatique
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
