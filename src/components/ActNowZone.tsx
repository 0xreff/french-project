'use client'
import { useEffect, useRef, useCallback, useState } from 'react'
import { useScroll, useTransform, motion, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { useImagePreloader } from '@/hooks/useImagePreloader'

// ─── Config — mirrors InnovationGallery / HeroScroll exactly ──────────────
const SEQ5_FRAMES       = 240
const SCROLL_MULTIPLIER = 8          // 900vh total
// Frames that are essentially solid white (tiny file size ~12KB)
// Switch to CSS white background for this range to save GPU memory
const WHITE_FRAME_START = 175        // first mostly-white frame
const WHITE_FRAME_END   = 240        // last frame

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

// ─── 7-day challenges ────────────────────────────────────────────────────────
const CHALLENGES = [
  { day: 1, task: "Refuser tout plastique à usage unique aujourd'hui", icon: '🚫' },
  { day: 2, task: 'Marcher ou pédaler au lieu de conduire',             icon: '🚶' },
  { day: 3, task: 'Manger un repas 100 % végétal',                      icon: '🥗' },
  { day: 4, task: 'Débrancher les appareils inutilisés',                icon: '🔌' },
  { day: 5, task: "Réparer quelque chose au lieu d'acheter du neuf",    icon: '🔧' },
  { day: 6, task: 'Partager ce musée avec 3 amis',                      icon: '📤' },
  { day: 7, task: 'Planter une graine ou arroser une plante',           icon: '🌱' },
]

// accent color of this section
const ACCENT = '#c9a96e'

// ─── Which content panels to show at which scroll fractions ──────────────────
// Each panel occupies a window of the full 0-1 scroll range.
// The white‑frame zone (frames 175+) maps to frac ≥ 175/240 ≈ 0.73
//  → put interactive content (quiz/challenges) in the white zone, over a white bg.
const PANELS = [
  // Intro title panel — shown before white zone
  { id: 'intro',      range: [0.04, 0.20] as [number, number] },
  // Quiz panel — in white zone
  { id: 'quiz',       range: [0.76, 0.92] as [number, number] },
  // Challenge panel — near end
  { id: 'challenge',  range: [0.92, 1.00] as [number, number] },
]

// ─── Liquid glass panel wrapper (same as InnovationGallery style) ────────────
function GlassPanel({
  scrollFraction,
  range,
  accentColor,
  children,
  size = 'md',
}: {
  scrollFraction: any // eslint-disable-line @typescript-eslint/no-explicit-any
  range: [number, number]
  accentColor: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}) {
  const [lo, hi] = range
  const span = hi - lo
  const p1end  = lo + span * 0.30
  const p2end  = hi - span * 0.30

  const opacity = useTransform(
    scrollFraction,
    [lo,  lo + span * 0.15, p2end, hi],
    [0,   1,                1,     0]
  )
  const scale = useTransform(scrollFraction, [lo, p1end, p2end, hi], [0.78, 1.0, 1.0, 1.55])
  const y     = useTransform(scrollFraction, [lo, p1end, p2end, hi], [50,   0,   0,   -60])
  const filterBlur = useTransform(scrollFraction, [lo, p1end, p2end, hi], [6, 0, 0, 8])
  const filter = useTransform(filterBlur, (b) => `blur(${b}px)`)
  const pointerEvents = useTransform(opacity, (o) => (o > 0.1 ? 'auto' : 'none'))

  // Full-screen liquid glass overlay
  const bgOpacity = useTransform(scrollFraction, [lo, lo + span * 0.18, p2end, hi], [0, 1, 1, 0])
  const bgBlurVal = useTransform(scrollFraction, [lo, p1end, p2end, hi], [0, 3, 3, 0])
  const bgBlur    = useTransform(bgBlurVal, (b) => `blur(${b}px) saturate(120%)`)

  const maxW = size === 'lg' ? '900px' : size === 'sm' ? '520px' : '760px'

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
          background: `radial-gradient(ellipse at 50% 50%,
            ${accentColor}06 0%,
            rgba(10,16,10,0.15) 55%,
            rgba(4,8,4,0.06) 100%)`,
        }}
      />

      {/* Card panel — olive glass */}
      <motion.div
        style={{ scale, y, filter, maxWidth: maxW }}
        className="w-full relative z-10"
      >
        <div
          style={{
            background: 'rgba(14, 22, 12, 0.70)',
            backdropFilter: 'blur(40px) saturate(200%) brightness(1.08)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(1.08)',
            border: `1px solid rgba(255,255,255,0.10)`,
            borderRadius: 'clamp(18px, 2.5vw, 26px)',
            boxShadow: `
              0 0 0 1px ${accentColor}18,
              0 30px 80px rgba(0,0,0,0.40),
              inset 0 1px 0 rgba(255,255,255,0.10),
              inset 0 -1px 0 rgba(0,0,0,0.20)
            `,
            overflow: 'hidden',
          }}
        >
          {/* Top sheen */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: '1px',
              background: `linear-gradient(to right, transparent, rgba(255,255,255,0.20) 30%, rgba(255,255,255,0.30) 50%, rgba(255,255,255,0.20) 70%, transparent)`,
            }}
          />
          <div style={{ padding: 'clamp(2rem, 4vw, 3.2rem)' }}>
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Section intro overlay ────────────────────────────────────────────────────
function IntroPanel({ scrollFraction }: { scrollFraction: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <GlassPanel scrollFraction={scrollFraction} range={PANELS[0].range} accentColor={ACCENT} size="md">
      <p
        className="font-body text-center uppercase mb-4"
        style={{ color: ACCENT, fontSize: '10px', letterSpacing: '0.22em' }}
      >
        Salle 05 — Zone d&apos;Action
      </p>
      <h2
        className="font-display font-light text-center leading-[1.08] tracking-tight text-white mb-6"
        style={{ fontSize: 'clamp(2.2rem, 6vw, 5rem)', whiteSpace: 'pre-line', textShadow: '0 2px 30px rgba(0,0,0,0.3)' }}
      >
        À votre tour —{'\n'}
        <span className="font-semibold" style={{ color: ACCENT }}>Agissez maintenant</span>
      </h2>
      <div className="mx-auto mb-6" style={{ width: '48px', height: '1px', background: `${ACCENT}80` }} />
      <p
        className="font-body text-center mx-auto leading-relaxed mb-8"
        style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(0.82rem, 1.4vw, 1rem)', maxWidth: '480px' }}
      >
        Le savoir sans action est inutile. Testez ce que vous avez appris,
        puis relevez le défi de 7 jours pour avoir un vrai impact.
      </p>
      <div className="flex flex-col items-center gap-3">
        <p className="font-body text-xs tracking-widest3 uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Défiler pour commencer
        </p>
        <motion.div
          className="w-px h-10"
          style={{ backgroundColor: ACCENT, opacity: 0.7 }}
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </GlassPanel>
  )
}

// ─── Quiz — glass style ───────────────────────────────────────────────────────
function QuizPanel({ scrollFraction }: { scrollFraction: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
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
    setTimeout(() => {
      if (current < QUIZ_QUESTIONS.length - 1) {
        setCurrent((c) => c + 1)
        setSelected(null)
        setShowResult(false)
      } else {
        setFinished(true)
      }
    }, 1400)
  }

  const resetQuiz = () => {
    setCurrent(0); setScore(0)
    setSelected(null); setShowResult(false); setFinished(false)
  }

  return (
    <GlassPanel scrollFraction={scrollFraction} range={PANELS[1].range} accentColor={ACCENT} size="lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-body text-[9px] tracking-widest3 uppercase mb-1" style={{ color: ACCENT, letterSpacing: '0.2em' }}>
            Quiz — Salle 05
          </p>
          <p className="font-display text-lg font-semibold text-white">
            {finished ? 'Résultats' : `Question ${current + 1} / ${QUIZ_QUESTIONS.length}`}
          </p>
        </div>
        {!finished && (
          <p className="font-body text-sm" style={{ color: ACCENT }}>
            Score : <span className="font-semibold">{score}</span>
          </p>
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
            exit={{ opacity: 0 }}
            className="text-center py-4"
          >
            <span className="text-6xl mb-5 block">{score >= 4 ? '🏆' : score >= 2 ? '👏' : '💪'}</span>
            <p className="font-display text-4xl font-semibold text-white mb-3">
              {score} / {QUIZ_QUESTIONS.length}
            </p>
            <p className="font-body text-sm mb-8" style={{ color: 'rgba(255,255,255,0.60)' }}>
              {score >= 4 ? 'Excellent ! Vous êtes un véritable expert du climat.' :
               score >= 2 ? 'Bon effort ! Continuez à apprendre sur notre planète.' :
                            'Chaque expert a été débutant. Réessayez !'}
            </p>
            <button
              onClick={resetQuiz}
              className="px-8 py-3 font-body text-xs tracking-widest2 uppercase transition-all duration-300"
              style={{
                background: `${ACCENT}22`,
                border: `1px solid ${ACCENT}60`,
                color: ACCENT,
                borderRadius: '8px',
              }}
            >
              Réessayer
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3
              className="font-display text-xl md:text-2xl font-semibold text-white mb-6 leading-snug"
            >
              {q.question}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt, idx) => {
                let borderColor = 'rgba(255,255,255,0.12)'
                let bg = 'rgba(255,255,255,0.04)'
                let textColor = 'rgba(255,255,255,0.75)'
                if (showResult && idx === q.correct) {
                  borderColor = 'rgba(78,205,196,0.60)'
                  bg = 'rgba(78,205,196,0.12)'
                  textColor = '#4ecdc4'
                }
                if (showResult && idx === selected && idx !== q.correct) {
                  borderColor = 'rgba(255,107,107,0.60)'
                  bg = 'rgba(255,107,107,0.10)'
                  textColor = 'rgba(255,107,107,0.9)'
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={selected !== null}
                    className="text-left p-4 font-body text-sm transition-all duration-300"
                    style={{
                      background: bg,
                      border: `1px solid ${borderColor}`,
                      borderRadius: '10px',
                      color: textColor,
                      cursor: selected !== null ? 'default' : 'pointer',
                    }}
                  >
                    <span className="font-semibold mr-2" style={{ color: ACCENT }}>
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassPanel>
  )
}

// ─── 7-day challenge — glass style ───────────────────────────────────────────
function ChallengePanel({ scrollFraction }: { scrollFraction: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const [checked, setChecked] = useState<boolean[]>(new Array(7).fill(false))
  const toggle = (i: number) => setChecked((prev) => { const n = [...prev]; n[i] = !n[i]; return n })
  const completed = checked.filter(Boolean).length

  return (
    <GlassPanel scrollFraction={scrollFraction} range={PANELS[2].range} accentColor={ACCENT} size="lg">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-body text-[9px] tracking-widest3 uppercase mb-1" style={{ color: ACCENT, letterSpacing: '0.2em' }}>
            Défi 7 jours — Salle 05
          </p>
          <h3 className="font-display text-xl font-semibold text-white">Semaine Verte</h3>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-bold" style={{ color: ACCENT }}>{completed}/7</p>
          <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>accomplis</p>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-0.5 mb-6 overflow-hidden" style={{ background: 'rgba(255,255,255,0.10)', borderRadius: '2px' }}>
        <motion.div
          className="h-full"
          style={{ background: `linear-gradient(90deg, #4ecdc4, ${ACCENT})`, borderRadius: '2px' }}
          animate={{ width: `${(completed / 7) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
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
              style={{
                background: checked[i] ? '#4ecdc4' : 'transparent',
                border: `2px solid ${checked[i] ? '#4ecdc4' : 'rgba(255,255,255,0.25)'}`,
                borderRadius: '5px',
              }}
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
              <p className="font-body text-sm" style={{ color: checked[i] ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.75)', textDecoration: checked[i] ? 'line-through' : 'none' }}>
                {ch.task}
              </p>
            </div>
          </button>
        ))}
      </div>

      {completed === 7 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 p-5 text-center"
          style={{ background: 'rgba(78,205,196,0.10)', border: '1px solid rgba(78,205,196,0.30)', borderRadius: '12px' }}
        >
          <span className="text-3xl mb-2 block">🌍</span>
          <p className="font-display text-lg font-semibold" style={{ color: '#4ecdc4' }}>Défi accompli !</p>
          <p className="font-body text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Vous avez fait une vraie différence cette semaine. Continuez !
          </p>
        </motion.div>
      )}
    </GlassPanel>
  )
}

// ─── Links panel (CTA) — bottom of the white zone ────────────────────────────
function LinksPanel({ scrollFraction }: { scrollFraction: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const opacity = useTransform(scrollFraction, [0.04, 0.09], [0, 1])
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-auto"
      style={{ opacity, whiteSpace: 'nowrap' }}
    >
      <div className="flex gap-4 items-center">
        <a
          href="https://sdgs.un.org/goals/goal12"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-[10px] tracking-widest3 uppercase px-5 py-2.5 transition-all duration-300"
          style={{
            border: '1px solid rgba(255,255,255,0.18)',
            color: 'rgba(255,255,255,0.60)',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
          }}
        >
          ODD 12
        </a>
        <a
          href="https://sdgs.un.org/goals/goal13"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-[10px] tracking-widest3 uppercase px-5 py-2.5 transition-all duration-300"
          style={{
            background: `${ACCENT}22`,
            border: `1px solid ${ACCENT}55`,
            color: ACCENT,
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
          }}
        >
          ODD 13
        </a>
      </div>
    </motion.div>
  )
}

// ─── Right-side progress dots ─────────────────────────────────────────────────
function ProgressDot({
  range,
  scrollFraction,
  color,
}: { range: [number, number]; scrollFraction: any; color: string }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const active = useTransform(
    scrollFraction,
    [range[0], range[0] + 0.02, range[1] - 0.02, range[1]],
    [0, 1, 1, 0]
  )
  const h  = useTransform(active, [0, 1], [5, 22])
  const bg = useTransform(active, [0, 1], ['rgba(255,255,255,0.18)', color])
  return <motion.div className="w-[2px] rounded-full" style={{ height: h, backgroundColor: bg }} />
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ActNowZone() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const mouseRef     = useRef({ x: 0, y: 0 })
  const rafRef       = useRef<number>(0)
  const [frameIndex, setFrameIndex] = useState(0)

  const seq5 = useImagePreloader('/sequence-5/ezgif-frame-', SEQ5_FRAMES, 3, 'jpg')
  const { scrollY } = useScroll()

  // Is the current frame in the white zone? → solid white bg, hide canvas
  const isWhiteZone = frameIndex >= WHITE_FRAME_START

  const scrollFraction = useTransform(scrollY, (latest) => {
    if (!containerRef.current) return 0
    const el        = containerRef.current
    const offsetTop = el.getBoundingClientRect().top + window.scrollY
    const maxScroll = el.offsetHeight - window.innerHeight
    if (maxScroll <= 0) return 0
    return Math.min(Math.max((latest - offsetTop) / maxScroll, 0), 1)
  })

  // ── drawFrame — identical to HeroScroll ─────────────────────────────────
  const drawFrame = useCallback(
    (index: number) => {
      if (isNaN(index) || index < 0) index = 0
      if (index >= SEQ5_FRAMES) index = SEQ5_FRAMES - 1

      setFrameIndex(index)

      // Skip canvas draw in the white zone — solid CSS background handles it
      if (index >= WHITE_FRAME_START) return

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
    [seq5.images, isWhiteZone]
  )

  useMotionValueEvent(scrollFraction, 'change', (frac) => {
    if (!seq5.loaded) return
    drawFrame(Math.round(frac * (SEQ5_FRAMES - 1)))
  })

  useEffect(() => {
    if (seq5.loaded) drawFrame(0)
  }, [seq5.loaded, drawFrame])

  useEffect(() => {
    const onResize = () => {
      if (!seq5.loaded) return
      drawFrame(Math.round(scrollFraction.get() * (SEQ5_FRAMES - 1)))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [seq5.loaded, drawFrame, scrollFraction])

  // Mouse parallax — applied only to canvas (not white zone)
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

  const dotsOpacity = useTransform(scrollFraction, [0.04, 0.09], [0, 1])

  return (
    <section
      id="actnow"
      ref={containerRef}
      className="relative"
      style={{
        height: `${(SCROLL_MULTIPLIER + 1) * 100}vh`,
        // White zone: solid white bg avoids GPU canvas work for blank frames
        background: isWhiteZone ? '#ffffff' : '#000000',
        transition: 'background 0.4s ease',
      }}
    >
      <div
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{ contain: 'layout style paint' }}
      >
        {/* ── Loading screen ───────────────────────────────────────────── */}
        {!seq5.loaded && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 gap-5">
            <p
              className="font-body text-[10px] tracking-widest3 uppercase"
              style={{ color: ACCENT, letterSpacing: '0.2em' }}
            >
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

        {/* ── Canvas — hidden during white zone ────────────────────────── */}
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Zone d'Action — séquence cinématique"
          className="absolute inset-0 w-full h-full"
          style={{
            willChange: 'transform',
            display: isWhiteZone ? 'none' : 'block',
          }}
        />

        {/* ── White zone background (replaces canvas) ───────────────────── */}
        {isWhiteZone && (
          <div className="absolute inset-0 bg-white" />
        )}

        {/* ── Cinematic vignettes (dark frames only) ────────────────────── */}
        {!isWhiteZone && (
          <>
            <div
              className="absolute top-0 left-0 right-0 h-36 pointer-events-none z-10"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 65%, transparent 100%)' }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)' }}
            />
          </>
        )}

        {/* ── Overlays ─────────────────────────────────────────────────── */}
        <IntroPanel   scrollFraction={scrollFraction} />
        <QuizPanel    scrollFraction={scrollFraction} />
        <ChallengePanel scrollFraction={scrollFraction} />

        {/* ── Links CTA ─────────────────────────────────────────────────── */}
        <LinksPanel scrollFraction={scrollFraction} />

        {/* ── Progress dots ─────────────────────────────────────────────── */}
        <motion.div
          className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-3 items-center pointer-events-none z-40"
          style={{ opacity: dotsOpacity }}
        >
          {PANELS.map((p) => (
            <ProgressDot key={p.id} range={p.range} scrollFraction={scrollFraction} color={ACCENT} />
          ))}
        </motion.div>

        {/* ── Footer label ──────────────────────────────────────────────── */}
        <motion.div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none z-40"
          style={{ opacity: useTransform(scrollFraction, [0.04, 0.09], [0, 1]) }}
        >
          <p
            className="font-body text-[9px] tracking-widest3 uppercase text-center"
            style={{
              color: isWhiteZone ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)',
              letterSpacing: '0.2em',
            }}
          >
            Zone d&apos;Action · ODD 12 &amp; 13
          </p>
        </motion.div>
      </div>
    </section>
  )
}
