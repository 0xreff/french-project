'use client'
import { useEffect, useRef } from 'react'
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion'
import { useImagePreloader } from '@/hooks/useImagePreloader'

const SEQ1_FRAMES = 91
const SEQ2_FRAMES = 91
const TOTAL_FRAMES = SEQ1_FRAMES + SEQ2_FRAMES
// Since we have twice the frames, double the scroll length for an identical speed
const SCROLL_MULTIPLIER = 8

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function HeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)

  // Preload both sequences
  const seq1 = useImagePreloader('/sequence-1/', SEQ1_FRAMES, 4, 'jpg')
  // Sequence 2 has naming ezgif-frame-001.jpg
  const seq2 = useImagePreloader('/sequence-2/ezgif-frame-', SEQ2_FRAMES, 3, 'jpg')

  const loaded = seq1.loaded && seq2.loaded
  // Average progress
  const progress = (seq1.progress + seq2.progress) / 2

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (!loaded || !canvasRef.current || !containerRef.current) return
    if (prefersReduced) return
    const container = containerRef.current
    const maxScroll = container.offsetHeight - window.innerHeight
    const scrollFraction = Math.min(Math.max(latest / maxScroll, 0), 1)
    drawFrame(Math.floor(scrollFraction * (TOTAL_FRAMES - 1)))
  })

  function drawFrame(index: number) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Choose which sequence array to pull from
    let img: HTMLImageElement | undefined
    if (index < SEQ1_FRAMES) {
      img = seq1.images[index]
    } else {
      img = seq2.images[index - SEQ1_FRAMES]
    }
    
    if (!img) return

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
    const w = img.naturalWidth  * scale
    const h = img.naturalHeight * scale
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)
  }

  useEffect(() => {
    if (loaded) prefersReduced ? drawFrame(TOTAL_FRAMES - 1) : drawFrame(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  useEffect(() => {
    const onResize = () => {
      const latest = scrollY.get()
      if (!containerRef.current) return
      const maxScroll = containerRef.current.offsetHeight - window.innerHeight
      const scrollFraction = Math.min(Math.max(latest / maxScroll, 0), 1)
      drawFrame(Math.floor(scrollFraction * (TOTAL_FRAMES - 1)))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, seq1.images, seq2.images])

  return (
    <section ref={containerRef} className="relative" style={{ height: `${(SCROLL_MULTIPLIER + 1) * 100}vh` }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden" style={{ contain: 'layout style paint' }}>

        {/* Loading */}
        {!loaded && (
          <div className="absolute inset-0 bg-bg flex flex-col items-center justify-center z-20 gap-6">
            <p className="font-display text-2xl text-accent tracking-widest2">GreenMind</p>
            <div className="w-48 h-px bg-surface relative overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-accent"
                style={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="font-body text-xs text-muted tracking-widest3 uppercase">
              {Math.round(progress * 100)}%
            </p>
          </div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Cinematic gallery entrance — doors opening to reveal the GreenMind Museum"
          className="absolute inset-0 w-full h-full"
        />

        {/* Top gradient — keeps navbar readable on every frame */}
        <div
          className="absolute top-0 left-0 right-0 h-36 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 65%, transparent 100%)',
          }}
        />

        {/* Bottom vignette — frames hero text */}
        <div
          className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)',
          }}
        />

        {/* Hero text (fades at scroll start) */}
        <HeroOverlay scrollY={scrollY} />

        {/* Musée credits (fades in at scrollY ~916) */}
        <MuseeCredits scrollY={scrollY} />

        {/* Collection title for sequence-2 */}
        <CollectionOverlay scrollY={scrollY} />
      </div>
    </section>
  )
}

/* ─── Hero "Where Art Breathes" ─────────────────────────────────── */
function HeroOverlay({ scrollY }: { scrollY: any }) {
  const opacity = useTransform(scrollY, [0, 320], [1, 0])
  const y       = useTransform(scrollY, [0, 320], [0, -36])

  /* Glassy, soft shadow — not heavy black */
  const textShadow = [
    '0 1px 2px rgba(0,0,0,0.55)',
    '0 3px 12px rgba(0,0,0,0.30)',
    '0 0 40px rgba(0,0,0,0.18)',
  ].join(', ')

  const labelShadow = '0 1px 3px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.25)'

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-end pb-24 text-center pointer-events-none z-20"
    >
      {/* Eyebrow — fine black stroke + soft shadow */}
      <p
        className="font-body text-xs tracking-widest3 uppercase text-accent mb-6"
        style={{
          textShadow: labelShadow,
          WebkitTextStroke: '0.4px rgba(0,0,0,0.55)',
        }}
      >
        Est. 1923 — Tunis, Tunisia
      </p>

      {/* Main title — white, glassy shadow */}
      <h1
        className="font-display text-[clamp(3rem,8vw,8rem)] leading-[1.0] font-light mb-8 max-w-4xl tracking-tight"
        style={{
          color: '#ffffff',
          textShadow,
          WebkitTextStroke: '0.4px rgba(255,255,255,0.12)',
        }}
      >
        Where Art<br />
        <span
          className="font-semibold"
          style={{
            color: '#c9a96e',
            textShadow,
            WebkitTextStroke: '0.5px rgba(201,169,110,0.35)',
          }}
        >
          Breathes
        </span>
      </h1>

      {/* Scroll cue */}
      <div className="flex flex-col items-center gap-3">
        <p
          className="font-body text-xs tracking-widest3 uppercase"
          style={{ color: 'rgba(255,255,255,0.75)', textShadow: labelShadow }}
        >
          Scroll to Enter
        </p>
        <motion.div
          className="w-px h-12 bg-white/40"
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}

/* ─── Musée credits — fixed overlay, appears at scrollY ≈ 916 ────── */
function MuseeCredits({ scrollY }: { scrollY: any }) {
  /*  0   → 850 : invisible
      850 → 960 : fade in
      960 → 2800: fully visible (fixed above sequence)
      2800→ 3000: fade out                                */
  const opacity = useTransform(
    scrollY,
    [1080, 1200, 2800, 3000],
    [0,    1,    1,    0]
  )

  const creditsLines = [
    'Asser Ben Belgacem',
    'Rayen Benour',
    'Mohamed Dhia Brahmia',
    'Ayouba Djida Adams',
    'Malek Bargougui',
  ]

  return (
    <motion.div
      style={{ opacity }}
      className="fixed inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-30"
    >
      {/* "Musée" */}
      <p
        className="font-display font-semibold mb-1"
        style={{
          color: '#ffffff',
          fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
          letterSpacing: '-0.01em',
          textShadow: '0 1px 3px rgba(0,0,0,0.5), 0 3px 14px rgba(0,0,0,0.25)',
        }}
      >
        Musée
      </p>

      {/* "présenté par" */}
      <p
        className="font-body font-medium text-xs tracking-widest3 uppercase mb-5"
        style={{
          color: 'rgba(255,255,255,0.75)',
          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
        }}
      >
        présenté par
      </p>

      {/* Thin gold divider */}
      <div className="w-10 h-px bg-accent/60 mx-auto mb-5" />

      {/* Names — bold, center-aligned, evenly spaced */}
      <div className="flex flex-col items-center gap-2">
        {creditsLines.map((name) => (
          <p
            key={name}
            className="font-display font-semibold"
            style={{
              color: '#ffffff',
              fontSize: 'clamp(1rem, 1.8vw, 1.4rem)',
              letterSpacing: '0.03em',
              textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 2px 10px rgba(0,0,0,0.25)',
            }}
          >
            {name}
          </p>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Collection overlay — appears during Sequence 2 ────── */
function CollectionOverlay({ scrollY }: { scrollY: any }) {
  // SCROLL_MULTIPLIER = 8 means total scroll is 800vh.
  // Sequence 1 ends around 400vh. Sequence 2 starts around 400vh.
  // We fade in the "Collection" text around 4500px, keeping it visible until ~7500px.
  const opacity = useTransform(
    scrollY,
    [4500, 5000, 7500, 8000],
    [0,    1,    1,    0]
  )
  const y = useTransform(scrollY, [4500, 5000], [40, 0])

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-30"
    >
      <p
        className="font-body text-xs tracking-widest3 uppercase mb-4"
        style={{
          color: 'var(--color-accent)',
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          WebkitTextStroke: '0.4px rgba(0,0,0,0.55)',
        }}
      >
        Permanent Collection
      </p>
      <h2
        className="font-display text-[clamp(2.5rem,6vw,6rem)] leading-[1.05] font-light tracking-tight"
        style={{
          color: '#ffffff',
          textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 10px 40px rgba(0,0,0,0.3)',
        }}
      >
        A Century of<br />
        <span
          className="font-semibold"
          style={{
            color: '#c9a96e',
            WebkitTextStroke: '0.6px rgba(26,26,24,0.35)',
          }}
        >
          Masterworks
        </span>
      </h2>
    </motion.div>
  )
}
