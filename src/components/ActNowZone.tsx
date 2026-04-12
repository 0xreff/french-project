'use client'
import { useEffect, useRef, useCallback, useState } from 'react'
import { useScroll, useTransform, motion, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { useImagePreloader } from '@/hooks/useImagePreloader'

// ─── Config ──────────────────────────────────────────────────────────────────
const SEQ5_FRAMES       = 240
const SCROLL_MULTIPLIER = 8          // 900vh total
const WHITE_FRAME_START = 175        // frames ≥175 are near-white → CSS bg
const ACCENT            = '#c9a96e'

// scrollFraction at which the quiz kicks in (≈ WHITE_FRAME_START/SEQ5_FRAMES)
const QUIZ_LOCK_FRAC = (WHITE_FRAME_START - 1) / (SEQ5_FRAMES - 1)  // ≈ 0.732

// ─── Quiz data ──────────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    question: "Que signifie l'ODD 13 ?",
    options: ['Eau propre', 'Action climatique', 'Vie aquatique', 'Énergie abordable'],
    correct: 1,
  },
  {
    question: 'Combien de nourriture est gaspillée chaque année dans le monde ?',
    options: ['250 millions de tonnes', '931 millions de tonnes', '500 millions de tonnes', '1,5 milliard de tonnes'],
    correct: 1,
  },
  {
    question: "Quel pourcentage de l'économie mondiale est circulaire ?",
    options: ['25 %', '15,2 %', '8,6 %', '42 %'],
    correct: 2,
  },
  {
    question: "Au rythme actuel, combien de planètes faudrait-il d'ici 2050 ?",
    options: ['1,5', '2', '3', '5'],
    correct: 2,
  },
  {
    question: "De combien la température a-t-elle augmenté en 2024 (par rapport à l'ère préindustrielle) ?",
    options: ['+0,8°C', '+1,2°C', '+1,55°C', '+2,1°C'],
    correct: 2,
  },
]

const CHALLENGES = [
  { day: 1, task: "Refuser tout plastique à usage unique aujourd'hui", icon: '🚫' },
  { day: 2, task: 'Marcher ou pédaler au lieu de conduire',             icon: '🚶' },
  { day: 3, task: 'Manger un repas 100 % végétal',                      icon: '🥗' },
  { day: 4, task: 'Débrancher les appareils inutilisés',                icon: '🔌' },
  { day: 5, task: "Réparer quelque chose au lieu d'acheter du neuf",    icon: '🔧' },
  { day: 6, task: 'Partager ce musée avec 3 amis',                      icon: '📤' },
  { day: 7, task: 'Planter une graine ou arroser une plante',           icon: '🌱' },
]

type Mode = 'scroll' | 'quiz' | 'done'

// ─── Shared glass card shell ──────────────────────────────────────────────────
function GlassCard({
  children,
  maxWidth = '820px',
  accentColor = ACCENT,
  style = {},
}: {
  children: React.ReactNode
  maxWidth?: string
  accentColor?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth,
        background: 'rgba(14, 22, 12, 0.70)',
        backdropFilter: 'blur(40px) saturate(200%) brightness(1.08)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(1.08)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 'clamp(18px, 2.5vw, 26px)',
        boxShadow: `
          0 0 0 1px ${accentColor}18,
          0 30px 80px rgba(0,0,0,0.40),
          inset 0 1px 0 rgba(255,255,255,0.10),
          inset 0 -1px 0 rgba(0,0,0,0.20)
        `,
        overflow: 'hidden',
        position: 'relative',
        padding: 'clamp(2rem, 4vw, 3.2rem)',
        ...style,
      }}
    >
      {/* Top sheen */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px', pointerEvents: 'none',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.20) 30%, rgba(255,255,255,0.30) 50%, rgba(255,255,255,0.20) 70%, transparent)',
        }}
      />
      {children}
    </div>
  )
}

// ─── Intro panel — scroll-driven, three-phase through-glass ──────────────────
function IntroPanel({ scrollFraction }: { scrollFraction: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const lo = 0.04; const hi = 0.50
  const span = hi - lo
  const p1end = lo + span * 0.30
  const p2end = hi - span * 0.30

  const opacity = useTransform(scrollFraction, [lo, lo + span * 0.15, p2end, hi], [0, 1, 1, 0])
  const scale   = useTransform(scrollFraction, [lo, p1end, p2end, hi], [0.78, 1.0, 1.0, 1.55])
  const y       = useTransform(scrollFraction, [lo, p1end, p2end, hi], [50, 0, 0, -60])
  const filterBlur = useTransform(scrollFraction, [lo, p1end, p2end, hi], [6, 0, 0, 8])
  const filter  = useTransform(filterBlur, (b) => `blur(${b}px)`)
  const pointerEvents = useTransform(opacity, (o) => (o > 0.1 ? 'auto' : 'none'))

  const bgOpacity = useTransform(scrollFraction, [lo, lo + span * 0.18, p2end, hi], [0, 1, 1, 0])
  const bgBlurVal = useTransform(scrollFraction, [lo, p1end, p2end, hi], [0, 3, 3, 0])
  const bgBlur    = useTransform(bgBlurVal, (b) => `blur(${b}px) saturate(120%)`)

  return (
    <motion.div
      style={{ opacity, pointerEvents }}
      className="absolute inset-0 flex items-center justify-center z-30 px-4 md:px-10"
    >
      {/* Full-screen liquid frost */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: bgOpacity,
          backdropFilter: bgBlur,
          WebkitBackdropFilter: bgBlur,
          background: `radial-gradient(ellipse at 50% 50%, ${ACCENT}06 0%, rgba(10,16,10,0.15) 55%, rgba(4,8,4,0.06) 100%)`,
        }}
      />
      <motion.div style={{ scale, y, filter }} className="w-full flex justify-center relative z-10">
        <GlassCard maxWidth="720px">
          <p className="font-body text-center uppercase mb-4" style={{ color: ACCENT, fontSize: '10px', letterSpacing: '0.22em' }}>
            Salle 05 — Zone d&apos;Action
          </p>
          <h2
            className="font-display font-light text-center leading-[1.08] tracking-tight text-white mb-5"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 5rem)', textShadow: '0 2px 30px rgba(0,0,0,0.3)' }}
          >
            À votre tour —<br />
            <span className="font-semibold" style={{ color: ACCENT }}>Agissez maintenant</span>
          </h2>
          <div className="mx-auto mb-5" style={{ width: '40px', height: '1px', background: `${ACCENT}80` }} />
          <p
            className="font-body text-center mx-auto leading-relaxed mb-7"
            style={{ color: 'rgba(255,255,255,0.60)', fontSize: 'clamp(0.8rem,1.4vw,0.95rem)', maxWidth: '420px' }}
          >
            Testez ce que vous avez appris, puis relevez le défi de 7 jours pour avoir un vrai impact.
          </p>
          <div className="flex flex-col items-center gap-3">
            <p className="font-body text-xs tracking-widest3 uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Défiler pour commencer
            </p>
            <motion.div
              className="w-px h-8"
              style={{ backgroundColor: ACCENT, opacity: 0.6 }}
              animate={{ scaleY: [1, 0.4, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

// ─── Quiz overlay — mode-driven, not scroll-driven ───────────────────────────
function QuizOverlay({
  onAnswer,
  onComplete,
}: {
  onAnswer: (frameAdvance: number) => void
  onComplete: () => void
}) {
  const [current,    setCurrent]    = useState(0)
  const [score,      setScore]      = useState(0)
  const [selected,   setSelected]   = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [finished,   setFinished]   = useState(false)

  const framesPerAnswer = Math.floor((SEQ5_FRAMES - WHITE_FRAME_START) / QUIZ_QUESTIONS.length)
  const q = QUIZ_QUESTIONS[current]

  const handleSelect = (idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    setShowResult(true)
    if (idx === q.correct) setScore((s) => s + 1)

    onAnswer(framesPerAnswer) // advance canvas by one step

    setTimeout(() => {
      if (current < QUIZ_QUESTIONS.length - 1) {
        setCurrent((c) => c + 1)
        setSelected(null)
        setShowResult(false)
      } else {
        setFinished(true)
        onComplete()
      }
    }, 1300)
  }

  return (
    <motion.div
      key="quiz-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex items-center justify-center z-30 px-4 md:px-10"
    >
      {/* Full-screen liquid frost over white bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(8,12,8,0.18)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
      />

      <motion.div
        initial={{ scale: 0.92, y: 30 }}
        animate={{ scale: 1,    y: 0 }}
        exit={{ scale: 0.95,    y: -20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex justify-center relative z-10"
      >
        <GlassCard maxWidth="860px">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-body text-[9px] tracking-widest3 uppercase mb-1" style={{ color: ACCENT, letterSpacing: '0.2em' }}>
                Quiz — Salle 05
              </p>
              <p className="font-display text-lg font-semibold text-white">
                {finished ? 'Résultats' : `Question ${current + 1} / ${QUIZ_QUESTIONS.length}`}
              </p>
            </div>
            {!finished && (
              <div
                className="flex items-center justify-center font-display text-xl font-bold"
                style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: `${ACCENT}20`, border: `2px solid ${ACCENT}50`, color: ACCENT,
                }}
              >
                {score}
              </div>
            )}
          </div>

          {/* Progress bar */}
          {!finished && (
            <div className="w-full h-0.5 mb-6 overflow-hidden" style={{ background: 'rgba(255,255,255,0.10)', borderRadius: '2px' }}>
              <motion.div
                className="h-full"
                style={{ background: `linear-gradient(90deg, ${ACCENT}, #e8c87e)`, borderRadius: '2px' }}
                animate={{ width: `${((current + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            {finished ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-2"
              >
                <span className="text-5xl mb-4 block">{score >= 4 ? '🏆' : score >= 2 ? '👏' : '💪'}</span>
                <p className="font-display text-4xl font-semibold text-white mb-3">
                  {score} / {QUIZ_QUESTIONS.length}
                </p>
                <p className="font-body text-sm mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {score >= 4 ? 'Excellent ! Vous êtes un véritable expert du climat.' :
                   score >= 2 ? 'Bon effort ! Continuez à apprendre sur notre planète.' :
                                'Chaque expert a été débutant. Continuez à apprendre !'}
                </p>
                <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Défilez pour continuer…
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28 }}
              >
                <h3 className="font-display text-xl md:text-2xl font-semibold text-white mb-5 leading-snug">
                  {q.question}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, idx) => {
                    let borderColor = 'rgba(255,255,255,0.12)'
                    let bg = 'rgba(255,255,255,0.04)'
                    let textColor = 'rgba(255,255,255,0.75)'
                    if (showResult && idx === q.correct) {
                      borderColor = 'rgba(78,205,196,0.60)'; bg = 'rgba(78,205,196,0.12)'; textColor = '#4ecdc4'
                    }
                    if (showResult && idx === selected && idx !== q.correct) {
                      borderColor = 'rgba(255,107,107,0.60)'; bg = 'rgba(255,107,107,0.10)'; textColor = 'rgba(255,107,107,0.9)'
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        disabled={selected !== null}
                        className="text-left p-4 font-body text-sm transition-all duration-300"
                        style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: '10px', color: textColor, cursor: selected !== null ? 'default' : 'pointer' }}
                      >
                        <span className="font-semibold mr-2" style={{ color: ACCENT }}>{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

// ─── Challenge overlay — mode-driven ──────────────────────────────────────────
function ChallengeOverlay() {
  const [checked, setChecked] = useState<boolean[]>(new Array(7).fill(false))
  const toggle = (i: number) => setChecked((p) => { const n = [...p]; n[i] = !n[i]; return n })
  const completed = checked.filter(Boolean).length

  return (
    <motion.div
      key="challenge-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex items-center justify-center z-30 px-4 md:px-10 overflow-y-auto py-6"
    >
      <motion.div
        initial={{ scale: 0.92, y: 30 }}
        animate={{ scale: 1,    y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col items-center gap-6 relative z-10"
      >
        <GlassCard maxWidth="860px">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-body text-[9px] tracking-widest3 uppercase mb-1" style={{ color: ACCENT, letterSpacing: '0.2em' }}>
                Défi 7 jours — Salle 05
              </p>
              <h3 className="font-display text-xl font-semibold text-white">Semaine Verte</h3>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl font-bold" style={{ color: ACCENT }}>{completed}/7</p>
              <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>accomplis</p>
            </div>
          </div>
          {/* Progress */}
          <div className="w-full h-0.5 mb-5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.10)', borderRadius: '2px' }}>
            <motion.div className="h-full" style={{ background: `linear-gradient(90deg, #4ecdc4, ${ACCENT})` }}
              animate={{ width: `${(completed / 7) * 100}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div className="space-y-2">
            {CHALLENGES.map((ch, i) => (
              <button
                key={ch.day}
                onClick={() => toggle(i)}
                className="w-full flex items-center gap-4 p-3 text-left transition-all duration-300"
                style={{
                  background: checked[i] ? 'rgba(78,205,196,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${checked[i] ? 'rgba(78,205,196,0.30)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '10px',
                }}
              >
                <div
                  className="w-5 h-5 flex items-center justify-center shrink-0 transition-all duration-300"
                  style={{ background: checked[i] ? '#4ecdc4' : 'transparent', border: `2px solid ${checked[i] ? '#4ecdc4' : 'rgba(255,255,255,0.25)'}`, borderRadius: '5px' }}
                >
                  {checked[i] && (
                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-lg shrink-0">{ch.icon}</span>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-widest2 mb-0.5" style={{ color: ACCENT }}>Jour {ch.day}</p>
                  <p className="font-body text-sm" style={{ color: checked[i] ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.75)', textDecoration: checked[i] ? 'line-through' : 'none' }}>
                    {ch.task}
                  </p>
                </div>
              </button>
            ))}
          </div>
          {completed === 7 && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 text-center"
              style={{ background: 'rgba(78,205,196,0.10)', border: '1px solid rgba(78,205,196,0.30)', borderRadius: '12px' }}
            >
              <span className="text-3xl mb-1 block">🌍</span>
              <p className="font-display text-lg font-semibold" style={{ color: '#4ecdc4' }}>Défi accompli !</p>
              <p className="font-body text-xs mt-1" style={{ color: 'rgba(255,255,255,0.50)' }}>Vous avez fait une vraie différence. Continuez !</p>
            </motion.div>
          )}
        </GlassCard>

        {/* CTA links */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 items-center"
        >
          <a href="https://sdgs.un.org/goals/goal12" target="_blank" rel="noopener noreferrer"
            className="font-body text-[10px] tracking-widest3 uppercase px-5 py-2.5 transition-all duration-300"
            style={{ border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.55)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}
          >ODD 12</a>
          <a href="https://sdgs.un.org/goals/goal13" target="_blank" rel="noopener noreferrer"
            className="font-body text-[10px] tracking-widest3 uppercase px-5 py-2.5 transition-all duration-300"
            style={{ background: `${ACCENT}22`, border: `1px solid ${ACCENT}55`, color: ACCENT, borderRadius: '8px', backdropFilter: 'blur(10px)' }}
          >ODD 13</a>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ─── Mode progress dots ───────────────────────────────────────────────────────
function ModeDots({ mode }: { mode: Mode }) {
  const dots: { m: Mode; color: string }[] = [
    { m: 'scroll', color: ACCENT },
    { m: 'quiz',   color: '#4ecdc4' },
    { m: 'done',   color: '#a78bfa' },
  ]
  return (
    <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-3 items-center pointer-events-none z-40">
      {dots.map((d, i) => {
        const active = mode === d.m || (mode === 'done' && i < 3) || (mode === 'quiz' && i < 2)
        return (
          <motion.div
            key={d.m}
            className="w-[2px] rounded-full"
            animate={{ height: active ? 22 : 5, backgroundColor: active ? d.color : 'rgba(255,255,255,0.18)' }}
            transition={{ duration: 0.4 }}
          />
        )
      })}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ActNowZone() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const mouseRef      = useRef({ x: 0, y: 0 })
  const rafRef        = useRef<number>(0)
  const scrollLockY   = useRef(0)
  const quizFrameRef  = useRef(WHITE_FRAME_START)

  const [frameIndex,  setFrameIndex]  = useState(0)
  const [mode,        setMode]        = useState<Mode>('scroll')

  const seq5 = useImagePreloader('/sequence-5/ezgif-frame-', SEQ5_FRAMES, 3, 'jpg')
  const { scrollY } = useScroll()

  const isWhiteZone = frameIndex >= WHITE_FRAME_START

  // ── drawFrame — identical to HeroScroll ────────────────────────────────────
  const drawFrame = useCallback(
    (index: number) => {
      if (isNaN(index) || index < 0) index = 0
      if (index >= SEQ5_FRAMES) index = SEQ5_FRAMES - 1
      setFrameIndex(index)
      if (index >= WHITE_FRAME_START) return   // white zone → CSS bg handles it

      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const img = seq5.images[index]
      if (!img || img.naturalWidth === 0 || img.naturalHeight === 0) return

      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
      const w = img.naturalWidth  * scale
      const h = img.naturalHeight * scale
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)
    },
    [seq5.images]
  )

  // ── Scroll lock helpers ────────────────────────────────────────────────────
  const lockScroll = useCallback(() => {
    scrollLockY.current = window.scrollY
    document.body.style.top      = `-${scrollLockY.current}px`
    document.body.style.position = 'fixed'
    document.body.style.width    = '100%'
  }, [])

  const unlockScroll = useCallback(() => {
    const y = scrollLockY.current
    document.body.style.position = ''
    document.body.style.top      = ''
    document.body.style.width    = ''
    window.scrollTo(0, y)
  }, [])

  // ── Scroll → frame (scroll mode only) ────────────────────────────────────
  const scrollFraction = useTransform(scrollY, (latest) => {
    if (!containerRef.current) return 0
    const el        = containerRef.current
    const offsetTop = el.getBoundingClientRect().top + window.scrollY
    const maxScroll = el.offsetHeight - window.innerHeight
    if (maxScroll <= 0) return 0
    return Math.min(Math.max((latest - offsetTop) / maxScroll, 0), 1)
  })

  useMotionValueEvent(scrollFraction, 'change', (frac) => {
    // Only drive frames in scroll mode
    if (mode !== 'scroll') return
    // Draw as soon as images are available (don't wait for seq5.loaded)
    const frame = Math.round(frac * (SEQ5_FRAMES - 1))
    if (frame >= WHITE_FRAME_START) {
      // Reached the white zone → lock scroll and activate quiz
      setMode('quiz')
      lockScroll()
      quizFrameRef.current = WHITE_FRAME_START
      drawFrame(WHITE_FRAME_START)
      return
    }
    drawFrame(frame)
  })

  // ── Draw first available frame immediately (smooth Salle04→05 transition) ─
  useEffect(() => {
    const img = seq5.images[0]
    if (img && frameIndex === 0 && mode === 'scroll') drawFrame(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seq5.images[0]])

  // ── Fallback: draw when fully loaded ──────────────────────────────────────
  useEffect(() => {
    if (seq5.loaded && mode === 'scroll') drawFrame(0)
  }, [seq5.loaded, drawFrame, mode])

  // ── Resize ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      if (mode !== 'scroll') return
      drawFrame(Math.round(scrollFraction.get() * (SEQ5_FRAMES - 1)))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [mode, drawFrame, scrollFraction])

  // ── Mouse parallax (only when canvas is visible) ──────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    const loop = () => {
      const canvas = canvasRef.current
      if (canvas && !isWhiteZone) {
        const targetX = -mouseRef.current.x * 12
        const targetY = -mouseRef.current.y * 8
        const px = parseFloat(canvas.dataset.px ?? '0')
        const py = parseFloat(canvas.dataset.py ?? '0')
        const nx = px + (targetX - px) * 0.07
        const ny = py + (targetY - py) * 0.07
        canvas.dataset.px = String(nx)
        canvas.dataset.py = String(ny)
        canvas.style.transform = `scale(1.05) translate(${nx * (1 / 1.05)}px, ${ny * (1 / 1.05)}px)`
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isWhiteZone])

  // ── Cleanup scroll lock on unmount ────────────────────────────────────────
  useEffect(() => {
    return () => {
      document.body.style.position = ''
      document.body.style.top      = ''
      document.body.style.width    = ''
    }
  }, [])

  // ── Quiz callbacks ────────────────────────────────────────────────────────
  const framesPerAnswer = Math.floor((SEQ5_FRAMES - WHITE_FRAME_START) / QUIZ_QUESTIONS.length)

  const handleAnswer = useCallback(() => {
    quizFrameRef.current = Math.min(quizFrameRef.current + framesPerAnswer, SEQ5_FRAMES - 1)
    drawFrame(quizFrameRef.current)
  }, [drawFrame, framesPerAnswer])

  const handleQuizComplete = useCallback(() => {
    drawFrame(SEQ5_FRAMES - 1)
    // Brief pause before unlocking so user reads the result
    setTimeout(() => {
      unlockScroll()
      setMode('done')
    }, 1800)
  }, [drawFrame, unlockScroll])

  return (
    <section
      id="actnow"
      ref={containerRef}
      className="relative"
      style={{ height: `${(SCROLL_MULTIPLIER + 1) * 100}vh`, background: '#000000' }}
    >
      <div
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{ contain: 'layout style paint' }}
      >
        {/* ── Loading screen — hidden as soon as first frame is drawable ── */}
        {!seq5.images[0] && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 gap-5">
            <p className="font-body text-[10px] tracking-widest3 uppercase" style={{ color: ACCENT, letterSpacing: '0.2em' }}>
              Salle 05 — Zone d&apos;Action
            </p>
            <p className="font-display text-2xl text-white">GreenMind</p>
            <div className="w-52 h-px bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full"
                style={{ width: `${seq5.progress * 100}%`, backgroundColor: ACCENT }}
              />
            </div>
            <p className="font-body text-xs tracking-widest3 uppercase text-white/40">
              {Math.round(seq5.progress * 100)} %
            </p>
          </div>
        )}

        {/* ── Canvas — hidden in white zone ───────────────────────────────── */}
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Zone d'Action — séquence cinématique"
          className="absolute inset-0 w-full h-full"
          style={{ willChange: 'transform', display: isWhiteZone ? 'none' : 'block' }}
        />

        {/* ── White zone: solid white CSS background (zero canvas memory) ── */}
        {isWhiteZone && <div className="absolute inset-0 bg-white" />}

        {/* ── Dark frame vignettes ─────────────────────────────────────────── */}
        {!isWhiteZone && (
          <>
            <div className="absolute top-0 left-0 right-0 h-36 pointer-events-none z-10"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 65%, transparent 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)' }} />
          </>
        )}

        {/* ── Panels ──────────────────────────────────────────────────────── */}

        {/* Intro — scroll-driven, visible only in scroll mode */}
        {mode === 'scroll' && (
          <IntroPanel scrollFraction={scrollFraction} />
        )}

        {/* Quiz — mode-driven */}
        <AnimatePresence>
          {mode === 'quiz' && (
            <QuizOverlay onAnswer={handleAnswer} onComplete={handleQuizComplete} />
          )}
        </AnimatePresence>

        {/* Challenge + CTA — mode-driven */}
        <AnimatePresence>
          {mode === 'done' && <ChallengeOverlay />}
        </AnimatePresence>

        {/* ── Mode progress dots ───────────────────────────────────────────── */}
        <ModeDots mode={mode} />

        {/* ── Section label ────────────────────────────────────────────────── */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none z-40">
          <p
            className="font-body text-[9px] tracking-widest3 uppercase text-center"
            style={{ color: isWhiteZone ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.22)', letterSpacing: '0.2em' }}
          >
            Zone d&apos;Action · ODD 12 &amp; 13
          </p>
        </div>
      </div>
    </section>
  )
}
