'use client'
import { useEffect, useRef, useCallback, useState } from 'react'
import { useScroll, useTransform, motion, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { useImagePreloader } from '@/hooks/useImagePreloader'

// ─── Config ──────────────────────────────────────────────────────────────────
const SEQ5_FRAMES       = 175        // frames 001–175 (176–240 deleted)
const SCROLL_MULTIPLIER = 8          // 900vh total — same pacing as Salle 04
const ACCENT            = '#c9a96e'

// When scroll would advance past the last frame → lock & show quiz
const QUIZ_TRIGGER_FRAME = SEQ5_FRAMES - 1   // index 174 (file ezgif-frame-175)

type Mode = 'scroll' | 'quiz' | 'done'

// ─── Quiz / challenge data ────────────────────────────────────────────────────
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

// ─── Shared liquid glass card ─────────────────────────────────────────────────
function GlassCard({
  children,
  maxWidth = '820px',
  accentColor = ACCENT,
}: {
  children: React.ReactNode
  maxWidth?: string
  accentColor?: string
}) {
  return (
    <div
      style={{
        width: '100%', maxWidth,
        background: 'rgba(14, 22, 12, 0.70)',
        backdropFilter: 'blur(40px) saturate(200%) brightness(1.08)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(1.08)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 'clamp(18px, 2.5vw, 26px)',
        boxShadow: `0 0 0 1px ${accentColor}18, 0 30px 80px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.10)`,
        overflow: 'hidden', position: 'relative',
        padding: 'clamp(2rem, 4vw, 3.2rem)',
      }}
    >
      {/* Top sheen */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px', pointerEvents: 'none',
        background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.22) 30%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0.22) 70%, transparent)',
      }} />
      {children}
    </div>
  )
}

// ─── Intro panel (scroll-driven, through-glass effect like Salle 04) ──────────
function IntroPanel({ scrollFraction }: { scrollFraction: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const lo = 0.05; const hi = 0.55
  const span = hi - lo
  const p1end = lo + span * 0.30
  const p2end = hi - span * 0.30

  const opacity       = useTransform(scrollFraction, [lo, lo + span * 0.15, p2end, hi], [0, 1, 1, 0])
  const scale         = useTransform(scrollFraction, [lo, p1end, p2end, hi], [0.78, 1.0, 1.0, 1.55])
  const y             = useTransform(scrollFraction, [lo, p1end, p2end, hi], [50, 0, 0, -60])
  const filterBlurVal = useTransform(scrollFraction, [lo, p1end, p2end, hi], [6, 0, 0, 8])
  const filter        = useTransform(filterBlurVal, (b) => `blur(${b}px)`)
  const pointerEvts   = useTransform(opacity, (o) => (o > 0.1 ? 'auto' : 'none'))

  const bgOpacity = useTransform(scrollFraction, [lo, lo + span * 0.18, p2end, hi], [0, 1, 1, 0])
  const bgBlurVal = useTransform(scrollFraction, [lo, p1end, p2end, hi], [0, 3, 3, 0])
  const bgBlur    = useTransform(bgBlurVal, (b) => `blur(${b}px) saturate(120%)`)

  return (
    <motion.div
      style={{ opacity, pointerEvents: pointerEvts }}
      className="absolute inset-0 flex items-center justify-center z-30 px-4 md:px-10"
    >
      {/* Full-screen liquid frost */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: bgOpacity, backdropFilter: bgBlur, WebkitBackdropFilter: bgBlur,
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
          <p className="font-body text-center mx-auto leading-relaxed mb-7"
            style={{ color: 'rgba(255,255,255,0.60)', fontSize: 'clamp(0.8rem,1.4vw,0.95rem)', maxWidth: '400px' }}>
            Testez ce que vous avez appris, puis relevez le défi de 7 jours pour avoir un vrai impact.
          </p>
          <div className="flex flex-col items-center gap-3">
            <p className="font-body text-xs tracking-widest3 uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Défiler pour commencer
            </p>
            <motion.div className="w-px h-8" style={{ backgroundColor: ACCENT, opacity: 0.6 }}
              animate={{ scaleY: [1, 0.4, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

// ─── Quiz overlay (mode-driven — appears on white background) ─────────────────
function QuizOverlay({ onAnswer, onComplete }: { onAnswer: () => void; onComplete: () => void }) {
  const [current,    setCurrent]    = useState(0)
  const [score,      setScore]      = useState(0)
  const [selected,   setSelected]   = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [finished,   setFinished]   = useState(false)
  const q = QUIZ_QUESTIONS[current]

  const handleSelect = (idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    setShowResult(true)
    if (idx === q.correct) setScore((s) => s + 1)
    onAnswer()   // each answer advances the experience

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
      key="quiz"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
      className="absolute inset-0 flex items-center justify-center z-30 px-4 md:px-10"
    >
      <motion.div
        initial={{ scale: 0.90, y: 32 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: -20 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex justify-center"
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
              <div className="flex items-center justify-center font-display text-xl font-bold"
                style={{ width: 48, height: 48, borderRadius: '50%', background: `${ACCENT}20`, border: `2px solid ${ACCENT}50`, color: ACCENT }}>
                {score}
              </div>
            )}
          </div>

          {/* Progress bar */}
          {!finished && (
            <div className="w-full h-0.5 mb-6 overflow-hidden" style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 2 }}>
              <motion.div className="h-full" style={{ background: `linear-gradient(90deg, ${ACCENT}, #e8c87e)` }}
                animate={{ width: `${((current + 1) / QUIZ_QUESTIONS.length) * 100}%` }} transition={{ duration: 0.4 }} />
            </div>
          )}

          <AnimatePresence mode="wait">
            {finished ? (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-2">
                <span className="text-5xl mb-4 block">{score >= 4 ? '🏆' : score >= 2 ? '👏' : '💪'}</span>
                <p className="font-display text-4xl font-semibold text-white mb-3">{score} / {QUIZ_QUESTIONS.length}</p>
                <p className="font-body text-sm mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {score >= 4 ? 'Excellent ! Vous êtes un véritable expert du climat.' :
                   score >= 2 ? 'Bon effort ! Continuez à apprendre sur notre planète.' :
                                'Chaque expert a été débutant. Continuez à apprendre !'}
                </p>
                <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>Chargement du défi…</p>
              </motion.div>
            ) : (
              <motion.div key={current}
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28 }}
              >
                <h3 className="font-display text-xl md:text-2xl font-semibold text-white mb-5 leading-snug">{q.question}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, idx) => {
                    let border = 'rgba(255,255,255,0.12)'
                    let bg     = 'rgba(255,255,255,0.04)'
                    let color  = 'rgba(255,255,255,0.75)'
                    if (showResult && idx === q.correct)                        { border = 'rgba(78,205,196,0.60)'; bg = 'rgba(78,205,196,0.12)'; color = '#4ecdc4' }
                    if (showResult && idx === selected && idx !== q.correct)    { border = 'rgba(255,107,107,0.60)'; bg = 'rgba(255,107,107,0.10)'; color = 'rgba(255,107,107,0.9)' }
                    return (
                      <button key={idx} onClick={() => handleSelect(idx)} disabled={selected !== null}
                        className="text-left p-4 font-body text-sm transition-all duration-300"
                        style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, color, cursor: selected !== null ? 'default' : 'pointer' }}
                      >
                        <span className="font-semibold mr-2" style={{ color: ACCENT }}>{String.fromCharCode(65 + idx)}.</span>{opt}
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

// ─── Challenge overlay (mode-driven, appears after quiz) ──────────────────────
function ChallengeOverlay() {
  const [checked, setChecked] = useState<boolean[]>(new Array(7).fill(false))
  const toggle = (i: number) => setChecked((p) => { const n = [...p]; n[i] = !n[i]; return n })
  const done = checked.filter(Boolean).length

  return (
    <motion.div
      key="challenge"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
      className="absolute inset-0 flex items-center justify-center z-30 px-4 md:px-10 overflow-y-auto py-8"
    >
      <motion.div
        initial={{ scale: 0.90, y: 32 }} animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col items-center gap-6"
      >
        <GlassCard maxWidth="860px">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-body text-[9px] tracking-widest3 uppercase mb-1" style={{ color: ACCENT, letterSpacing: '0.2em' }}>
                Défi 7 jours — Salle 05
              </p>
              <h3 className="font-display text-xl font-semibold text-white">Semaine Verte</h3>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl font-bold" style={{ color: ACCENT }}>{done}/7</p>
              <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>accomplis</p>
            </div>
          </div>
          <div className="w-full h-0.5 mb-5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 2 }}>
            <motion.div className="h-full" style={{ background: `linear-gradient(90deg, #4ecdc4, ${ACCENT})` }}
              animate={{ width: `${(done / 7) * 100}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div className="space-y-2">
            {CHALLENGES.map((ch, i) => (
              <button key={ch.day} onClick={() => toggle(i)}
                className="w-full flex items-center gap-4 p-3 text-left transition-all duration-300"
                style={{
                  background: checked[i] ? 'rgba(78,205,196,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${checked[i] ? 'rgba(78,205,196,0.30)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 10,
                }}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0 transition-all duration-300"
                  style={{ background: checked[i] ? '#4ecdc4' : 'transparent', border: `2px solid ${checked[i] ? '#4ecdc4' : 'rgba(255,255,255,0.25)'}`, borderRadius: 5 }}>
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
          {done === 7 && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 text-center"
              style={{ background: 'rgba(78,205,196,0.10)', border: '1px solid rgba(78,205,196,0.30)', borderRadius: 12 }}>
              <span className="text-3xl mb-1 block">🌍</span>
              <p className="font-display text-lg font-semibold" style={{ color: '#4ecdc4' }}>Défi accompli !</p>
              <p className="font-body text-xs mt-1" style={{ color: 'rgba(255,255,255,0.50)' }}>Vous avez fait une vraie différence. Continuez !</p>
            </motion.div>
          )}
        </GlassCard>

        {/* CTA links */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="flex gap-4 items-center">
          <a href="https://sdgs.un.org/goals/goal12" target="_blank" rel="noopener noreferrer"
            className="font-body text-[10px] tracking-widest3 uppercase px-5 py-2.5 transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.20)', color: 'rgba(255,255,255,0.55)', borderRadius: 8, backdropFilter: 'blur(10px)' }}>
            ODD 12
          </a>
          <a href="https://sdgs.un.org/goals/goal13" target="_blank" rel="noopener noreferrer"
            className="font-body text-[10px] tracking-widest3 uppercase px-5 py-2.5 transition-all"
            style={{ background: `${ACCENT}22`, border: `1px solid ${ACCENT}55`, color: ACCENT, borderRadius: 8, backdropFilter: 'blur(10px)' }}>
            ODD 13
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ─── Mode progress dots ───────────────────────────────────────────────────────
function ModeDots({ mode }: { mode: Mode }) {
  const items = [
    { id: 'scroll', active: mode === 'scroll', color: ACCENT },
    { id: 'quiz',   active: mode === 'quiz',   color: '#4ecdc4' },
    { id: 'done',   active: mode === 'done',   color: '#a78bfa' },
  ]
  return (
    <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-3 items-center pointer-events-none z-40">
      {items.map((d) => (
        <motion.div key={d.id} className="w-[2px] rounded-full"
          animate={{ height: d.active ? 22 : 5, backgroundColor: d.active ? d.color : 'rgba(255,255,255,0.20)' }}
          transition={{ duration: 0.4 }} />
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ActNowZone() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const mouseRef     = useRef({ x: 0, y: 0 })
  const rafRef       = useRef<number>(0)
  const scrollLockY  = useRef(0)

  const [mode, setMode] = useState<Mode>('scroll')

  const seq5 = useImagePreloader('/sequence-5/ezgif-frame-', SEQ5_FRAMES, 3, 'jpg')
  const { scrollY } = useScroll()

  // ── drawFrame — identical to HeroScroll ─────────────────────────────────
  const drawFrame = useCallback(
    (index: number) => {
      if (isNaN(index) || index < 0) index = 0
      if (index >= SEQ5_FRAMES) index = SEQ5_FRAMES - 1

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

  // ── Scroll lock helpers ─────────────────────────────────────────────────
  const lockScroll = useCallback(() => {
    scrollLockY.current     = window.scrollY
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

  // ── Scroll fraction (0→1 within this section) ───────────────────────────
  const scrollFraction = useTransform(scrollY, (latest) => {
    if (!containerRef.current) return 0
    const el        = containerRef.current
    const offsetTop = el.getBoundingClientRect().top + window.scrollY
    const maxScroll = el.offsetHeight - window.innerHeight
    if (maxScroll <= 0) return 0
    return Math.min(Math.max((latest - offsetTop) / maxScroll, 0), 1)
  })

  // Entry is seamless — same frame continues from sequence-4 (no fade needed)
  // z-index: 2 on section ensures ActNowZone sits ON TOP during sticky overlap

  // ── Scroll mode: drive frames normally until last frame ─────────────────
  useMotionValueEvent(scrollFraction, 'change', (frac) => {
    if (mode !== 'scroll') return
    const frame = Math.round(frac * (SEQ5_FRAMES - 1))
    drawFrame(frame)
    if (frame >= QUIZ_TRIGGER_FRAME) {
      // Cinematic sequence complete → lock scroll, switch to quiz
      setMode('quiz')
      lockScroll()
    }
  })

  // Draw first available frame immediately (smooth entry after Salle 04)
  useEffect(() => {
    const img = seq5.images[0]
    if (img && mode === 'scroll') drawFrame(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seq5.images[0]])

  useEffect(() => {
    if (seq5.loaded && mode === 'scroll') drawFrame(0)
  }, [seq5.loaded, drawFrame, mode])

  // Resize
  useEffect(() => {
    const onResize = () => {
      if (mode !== 'scroll') return
      drawFrame(Math.round(scrollFraction.get() * (SEQ5_FRAMES - 1)))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [mode, drawFrame, scrollFraction])

  // Mouse parallax
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 }
    }
    const loop = () => {
      const canvas = canvasRef.current
      if (canvas && mode === 'scroll') {
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
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current) }
  }, [mode])

  // Cleanup scroll lock on unmount
  useEffect(() => {
    return () => {
      document.body.style.position = ''
      document.body.style.top      = ''
      document.body.style.width    = ''
    }
  }, [])

  // ── Quiz callbacks ──────────────────────────────────────────────────────
  const handleAnswer  = useCallback(() => { /* each answer = one step of progress, handled in overlay */ }, [])
  const handleComplete = useCallback(() => {
    setTimeout(() => {
      setMode('done')
      unlockScroll()
    }, 1600)
  }, [unlockScroll])

  return (
    <section
      id="actnow"
      ref={containerRef}
      className="relative"
      style={{
        height: `${(SCROLL_MULTIPLIER + 1) * 100}vh`,
        // White background once cinematic sequence is done (quiz / challenge)
        background: mode === 'scroll' ? '#000000' : '#ffffff',
        transition: 'background 0.6s ease',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden" style={{ contain: 'layout style paint' }}>

        {/* ── Loading screen — disappears as soon as first frame is ready ── */}
        {!seq5.images[0] && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 gap-5">
            <p className="font-body text-[10px] tracking-widest3 uppercase" style={{ color: ACCENT, letterSpacing: '0.2em' }}>
              Salle 05 — Zone d&apos;Action
            </p>
            <p className="font-display text-2xl text-white">GreenMind</p>
            <div className="w-52 h-px bg-white/10 relative overflow-hidden">
              <motion.div className="absolute left-0 top-0 h-full" style={{ width: `${seq5.progress * 100}%`, backgroundColor: ACCENT }} />
            </div>
            <p className="font-body text-xs text-white/40">{Math.round(seq5.progress * 100)} %</p>
          </div>
        )}

        {/* ── Canvas (scroll mode only) ─────────────────────────────────── */}
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Zone d'Action — séquence cinématique"
          className="absolute inset-0 w-full h-full"
          style={{ willChange: 'transform', display: mode !== 'scroll' ? 'none' : 'block' }}
        />

        {/* ── Dark vignettes (scroll mode) ──────────────────────────────── */}
        {mode === 'scroll' && (
          <>
            <div className="absolute top-0 left-0 right-0 h-36 pointer-events-none z-10"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 65%, transparent 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)' }} />
          </>
        )}

        {/* ── Entry is seamless (same frame as sequence-4 last frame) ────── */}

        {/* ── Content panels ────────────────────────────────────────────── */}

        {/* Intro — scroll-driven, same through-glass effect as Salle 04 */}
        {mode === 'scroll' && <IntroPanel scrollFraction={scrollFraction} />}

        {/* Quiz — appears once canvas cinematic is complete */}
        <AnimatePresence>
          {mode === 'quiz' && <QuizOverlay onAnswer={handleAnswer} onComplete={handleComplete} />}
        </AnimatePresence>

        {/* Challenge + CTA — after quiz */}
        <AnimatePresence>
          {mode === 'done' && <ChallengeOverlay />}
        </AnimatePresence>

        {/* ── Progress dots ─────────────────────────────────────────────── */}
        <ModeDots mode={mode} />

        {/* ── Section label ─────────────────────────────────────────────── */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none z-40">
          <p className="font-body text-[9px] tracking-widest3 uppercase text-center"
            style={{ color: mode !== 'scroll' ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.22)', letterSpacing: '0.2em' }}>
            Zone d&apos;Action · ODD 12 &amp; 13
          </p>
        </div>
      </div>
    </section>
  )
}
