'use client'
import { useEffect, useRef, useCallback, useState } from 'react'
import { useScroll, useTransform, motion, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { useImagePreloader } from '@/hooks/useImagePreloader'

// ─── Config ─────────────────────────────────────────────────────────────────
const SEQ4_FRAMES       = 240
const SCROLL_MULTIPLIER = 8   // 900vh total — same pace as HeroScroll

// ─── Innovation data ─────────────────────────────────────────────────────────
const INNOVATIONS = [
  {
    icon: '🌞',
    label: 'Énergie Solaire',
    title: 'Cellules solaires\npérovskite',
    description:
      "En superposant des matériaux pérovskite au silicium traditionnel, ces panneaux de nouvelle génération dépassent 30 % d'efficacité — bien au-delà des limites du silicium seul. Flexibles, légers et moins chers à produire à grande échelle.",
    stat: "30 %+ d'efficacité",
    color: '#f7c948',
    image: '/museum/solar-panels.png',
    range: [0.05, 0.22] as [number, number],
  },
  {
    icon: '🌱',
    label: 'Agriculture Durable',
    title: 'Agriculture\nverticale',
    description:
      "Les fermes intérieures contrôlées par IA utilisent 95 % d'eau en moins que l'agriculture conventionnelle. Des spectres LED personnalisés optimisent chaque phase de croissance, 365 jours par an, sans pesticides.",
    stat: "95 % d'eau en moins",
    color: '#4ecdc4',
    image: '/museum/vertical-farm.png',
    range: [0.22, 0.38] as [number, number],
  },
  {
    icon: '💨',
    label: 'Captage Carbone',
    title: "Capture directe\nde l'air",
    description:
      "Des installations comme Stratos au Texas extraient le CO₂ directement de l'atmosphère. De nouveaux matériaux MOF rendent le processus exponentiellement plus efficace et économique.",
    stat: "Élimine le CO₂ atmosph.",
    color: '#7c9bff',
    image: '/museum/carbon-capture.png',
    range: [0.38, 0.55] as [number, number],
  },
  {
    icon: '🔋',
    label: 'Mobilité Électrique',
    title: "Batteries à\nl'état solide",
    description:
      "Remplacer l'électrolyte liquide par un solide double la densité énergétique, autorise une charge en minutes et élimine le risque d'incendie — la clé des véhicules électriques abordables d'ici 2030.",
    stat: '2× la densité énergétique',
    color: '#ff6b9d',
    image: '/museum/green-city.png',
    range: [0.55, 0.70] as [number, number],
  },
  {
    icon: '🏗️',
    label: 'Construction Verte',
    title: 'Minéralisation\ndu carbone',
    description:
      "Le CO₂ capturé est transformé en calcaire synthétique puis utilisé dans la construction. Le carbone est littéralement emprisonné dans les bâtiments — retiré définitivement de l'atmosphère.",
    stat: 'CO₂ → matériau de construction',
    color: '#a78bfa',
    image: '/museum/earth-split.png',
    range: [0.70, 0.85] as [number, number],
  },
  {
    icon: '🪟',
    label: 'Architecture Solaire',
    title: 'Fenêtres\nsolaires (BIPV)',
    description:
      "Le verre photovoltaïque transparent produit de l'électricité tout en laissant passer la lumière. Des façades entières de gratte-ciels deviennent des centrales électriques, sans terrain supplémentaire.",
    stat: 'Fenêtres = centrales',
    color: '#34d399',
    image: '/museum/solar-panels.png',
    range: [0.85, 1.0] as [number, number],
  },
]

type Innovation = (typeof INNOVATIONS)[0]

// ─── Expanded fullscreen modal ───────────────────────────────────────────────
function ExpandedModal({ item, onClose }: { item: Innovation; onClose: () => void }) {
  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <motion.div
      key="expanded-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        initial={{ backdropFilter: 'blur(0px)', background: 'rgba(0,0,0,0)' }}
        animate={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.65)' }}
        exit={{ backdropFilter: 'blur(0px)', background: 'rgba(0,0,0,0)' }}
        transition={{ duration: 0.4 }}
      />

      {/* Modal panel */}
      <motion.div
        initial={{ scale: 0.82, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl mx-4 overflow-hidden"
        style={{ maxHeight: '90vh', borderRadius: '24px', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image — fills top */}
        <div className="w-full" style={{ height: '55vh', position: 'relative', overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          {/* Gradient overlay bottom of image */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, transparent 40%, rgba(8,12,8,0.95) 100%)',
            }}
          />
          {/* Label over image */}
          <div className="absolute top-6 left-7">
            <p
              className="font-body text-[10px] tracking-widest3 uppercase px-3 py-1"
              style={{
                color: item.color,
                background: `${item.color}18`,
                border: `1px solid ${item.color}40`,
                letterSpacing: '0.18em',
              }}
            >
              {item.label}
            </p>
          </div>
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 flex items-center justify-center w-9 h-9 text-white/70 hover:text-white transition-colors"
            style={{
              background: 'rgba(0,0,0,0.45)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        </div>

        {/* Text content — glass dark panel */}
        <div
          style={{
            background: 'rgba(8, 12, 8, 0.92)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderTop: `2px solid ${item.color}`,
            padding: '2.5rem 3rem 3rem',
          }}
        >
          <div className="flex items-start gap-5 mb-5">
            <span className="text-4xl mt-1">{item.icon}</span>
            <div>
              <h2
                className="font-display font-semibold leading-tight"
                style={{
                  color: '#ffffff',
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
                  whiteSpace: 'pre-line',
                }}
              >
                {item.title}
              </h2>
            </div>
          </div>

          <div
            className="mb-6"
            style={{ height: '1px', background: `linear-gradient(to right, ${item.color}50, transparent)` }}
          />

          <p className="font-body text-base leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.72)' }}>
            {item.description}
          </p>

          <div
            className="inline-flex items-center gap-3 px-5 py-2.5"
            style={{
              background: `${item.color}18`,
              border: `1px solid ${item.color}55`,
            }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}80` }}
            />
            <span
              className="font-body text-sm font-semibold tracking-widest2 uppercase"
              style={{ color: item.color }}
            >
              {item.stat}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Reference-style glass card — "passing through" scroll effect ────────────
function InnovationOverlay({
  item,
  scrollFraction,
  onOpen,
}: {
  item: Innovation
  scrollFraction: any // eslint-disable-line @typescript-eslint/no-explicit-any
  onOpen: () => void
}) {
  const [lo, hi] = item.range
  const span = hi - lo

  // ── Three scroll phases ──────────────────────────────────────────────────
  // Phase 1 — APPROACH  (lo → lo+35%): card comes from depth toward you
  // Phase 2 — AT GLASS  (lo+35% → hi-35%): you're right at the surface
  // Phase 3 — PASS-THRU (hi-35% → hi): card rushes past as you go through

  const p1end  = lo + span * 0.30   // end of approach
  const p2end  = hi - span * 0.30   // end of resting / start of exit
  // ─────────────────────────────────────────────────────────────────────────

  // Opacity: fade in on approach, full during glass, fade out on exit
  const opacity = useTransform(
    scrollFraction,
    [lo,  lo + span * 0.15,  p2end,  hi],
    [0,   1,                1,      0]
  )

  // Scale:
  //   approach  → 0.72 → 1.0  (coming from afar, growing toward you)
  //   pass-thru → 1.0 → 1.65  (you've passed through; it zooms past behind you)
  const scale = useTransform(
    scrollFraction,
    [lo,   p1end,  p2end,  hi],
    [0.72, 1.0,    1.0,    1.65]
  )

  // Y:
  //   approach  → +55px → 0    (rises up to meet you)
  //   pass-thru → 0    → -70px (shoots upward past you)
  const y = useTransform(
    scrollFraction,
    [lo,   p1end,  p2end,  hi],
    [55,   0,      0,      -70]
  )

  // Blur on the card wrapper — fogged at distance, clear at glass, fogged again after
  const filterBlur = useTransform(
    scrollFraction,
    [lo,   p1end,  p2end,  hi],
    [8,    0,      0,      10]
  )
  const filter = useTransform(filterBlur, (b) => `blur(${b}px)`)

  // ── Full-viewport liquid glass background ───────────────────────────────
  // The whole screen frosts over as you arrive at the glass pane
  const bgOpacity = useTransform(
    scrollFraction,
    [lo,  lo + span * 0.18,  p2end,  hi],
    [0,   1,                 1,      0]
  )
  const bgBlurVal = useTransform(
    scrollFraction,
    [lo,  p1end,  p2end,  hi],
    [0,   3,      3,      0]       // max 3px — images stay perfectly sharp
  )
  const bgBlur = useTransform(bgBlurVal, (b) => `blur(${b}px) saturate(120%)`)

  // Only the visible card should be clickable — disable pointer events when faded out
  const pointerEvents = useTransform(opacity, (o) => (o > 0.1 ? 'auto' : 'none'))

  return (
    <motion.div
      style={{ opacity, pointerEvents }}
      className="absolute inset-0 flex items-center justify-center z-30 px-6 md:px-16"
    >
      {/* ── Full-screen liquid glass frost — entire viewport becomes glass ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: bgOpacity,
          backdropFilter: bgBlur,
          WebkitBackdropFilter: bgBlur,
          background: `radial-gradient(ellipse at 50% 50%,
            ${item.color}06 0%,
            rgba(10, 16, 10, 0.18) 55%,
            rgba(4, 8, 4, 0.08) 100%)`,
        }}
      />

      {/* ── Card panel ── */}
      <motion.div style={{ scale, y, filter, maxWidth: '820px' }} className="w-full relative z-10">
        {/* Reference-style card: dark olive liquid glass, smooth radius */}
        <motion.div
          className="relative overflow-hidden cursor-pointer group"
          style={{
            background: 'rgba(14, 22, 12, 0.68)',
            backdropFilter: 'blur(40px) saturate(200%) brightness(1.08)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(1.08)',
            border: `1px solid rgba(255,255,255,0.10)`,
            borderRadius: 'clamp(18px, 2.8vw, 28px)',
            padding: 'clamp(2.2rem, 5vw, 3.5rem) clamp(2rem, 6vw, 4rem)',
            boxShadow: `
              0 0 0 1px ${item.color}18,
              0 30px 80px rgba(0,0,0,0.45),
              inset 0 1px 0 rgba(255,255,255,0.10),
              inset 0 -1px 0 rgba(0,0,0,0.20)
            `,
          }}
          whileHover={{ scale: 1.012, transition: { duration: 0.3, ease: 'easeOut' } }}
          onClick={onOpen}
        >
          {/* Inner glass sheen — top highlight */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: '1px',
              background: `linear-gradient(to right, transparent, rgba(255,255,255,0.18) 30%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.18) 70%, transparent)`,
              borderRadius: 'clamp(18px, 2.8vw, 28px) clamp(18px, 2.8vw, 28px) 0 0',
            }}
          />
          {/* Ambient color glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, ${item.color}12 0%, transparent 72%)`,
              borderRadius: 'inherit',
            }}
          />


          {/* Eyebrow */}
          <p
            className="font-body text-center uppercase mb-5"
            style={{ color: item.color, fontSize: '11px', letterSpacing: '0.22em' }}
          >
            {item.label}
          </p>

          {/* Main title — very large, like the photo */}
          <h3
            className="font-display font-light text-center leading-[1.08] tracking-tight mb-7 text-white"
            style={{
              fontSize: 'clamp(2.4rem, 6.5vw, 5.5rem)',
              whiteSpace: 'pre-line',
              textShadow: '0 2px 30px rgba(0,0,0,0.3)',
            }}
          >
            {item.title}
          </h3>

          {/* Thin colored rule */}
          <div
            className="mx-auto mb-7"
            style={{ width: '48px', height: '1px', background: `${item.color}80` }}
          />

          {/* Description — centered, gently muted */}
          <p
            className="font-body text-center mx-auto leading-relaxed mb-8"
            style={{
              color: 'rgba(255,255,255,0.65)',
              fontSize: 'clamp(0.82rem, 1.4vw, 1rem)',
              maxWidth: '520px',
            }}
          >
            {item.description}
          </p>

          {/* Stat + CTA row */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2"
              style={{
                background: `${item.color}16`,
                border: `1px solid ${item.color}45`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }}
              />
              <span
                className="font-body text-xs font-semibold tracking-widest2 uppercase"
                style={{ color: item.color }}
              >
                {item.stat}
              </span>
            </div>

            {/* Click cue */}
            <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <span className="font-body text-xs tracking-widest2 uppercase text-white/60">
                En savoir plus
              </span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2">
                <path d="M1 6h10M7 2l4 4-4 4" />
              </svg>
            </div>
          </div>

          {/* Bottom icon decoration */}
          <div className="flex justify-center mt-8 opacity-25">
            <span className="text-2xl">{item.icon}</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ─── Section intro header ────────────────────────────────────────────────────
function SectionHeader({ scrollFraction }: { scrollFraction: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const opacity = useTransform(scrollFraction, [0, 0.04, 0.09], [1, 1, 0])
  const y       = useTransform(scrollFraction, [0, 0.06], [0, -30])

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-end pb-28 text-center pointer-events-none z-30 px-6"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 55%, transparent 80%)',
        }}
      />
      <div className="relative flex flex-col items-center gap-2">
        <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-4">
          Salle 04 — Galerie d&apos;Innovation
        </p>
        <h2
          className="font-display text-[clamp(2.5rem,7vw,7rem)] font-light leading-[1.05] tracking-tight mb-6 text-white"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
        >
          La technologie qui<br />
          <span className="font-semibold" style={{ color: '#4ecdc4' }}>guérit la planète</span>
        </h2>
        <p
          className="font-body text-sm max-w-xl mx-auto leading-relaxed mb-6"
          style={{ color: 'rgba(255,255,255,0.72)', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
        >
          Des cellules solaires plus fines qu&apos;une feuille de papier aux fermes qui cultivent
          en intérieur — ces innovations prouvent qu&apos;un avenir durable se construit maintenant.
        </p>
        <div className="flex flex-col items-center gap-3">
          <p className="font-body text-xs tracking-widest3 uppercase" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Défiler pour explorer
          </p>
          <motion.div
            className="w-px h-10"
            style={{ backgroundColor: '#4ecdc4', opacity: 0.7 }}
            animate={{ scaleY: [1, 0.4, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// ─── Progress dots ──────────────────────────────────────────────────────────
function ProgressDot({ item, scrollFraction }: { item: Innovation; scrollFraction: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const active = useTransform(
    scrollFraction,
    [item.range[0], item.range[0] + 0.02, item.range[1] - 0.02, item.range[1]],
    [0, 1, 1, 0]
  )
  const h  = useTransform(active, [0, 1], [5, 22])
  const bg = useTransform(active, [0, 1], ['rgba(255,255,255,0.18)', item.color])
  return <motion.div className="w-[2px] rounded-full" style={{ height: h, backgroundColor: bg }} />
}

function ProgressBar({ scrollFraction }: { scrollFraction: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const opacity = useTransform(scrollFraction, [0.04, 0.09], [0, 1])
  return (
    <motion.div
      className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-3 items-center pointer-events-none z-40"
      style={{ opacity }}
    >
      {INNOVATIONS.map((item) => (
        <ProgressDot key={item.title} item={item} scrollFraction={scrollFraction} />
      ))}
    </motion.div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function InnovationGallery() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const mouseRef      = useRef({ x: 0, y: 0 })
  const rafRef        = useRef<number>(0)
  const [expanded, setExpanded] = useState<Innovation | null>(null)

  const seq4 = useImagePreloader('/sequence-4/ezgif-frame-', SEQ4_FRAMES, 3, 'jpg')
  const { scrollY } = useScroll()

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
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      if (isNaN(index) || index < 0) index = 0
      if (index >= SEQ4_FRAMES) index = SEQ4_FRAMES - 1

      const img = seq4.images[index]
      if (!img || img.naturalWidth === 0 || img.naturalHeight === 0) return

      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
      const w = img.naturalWidth  * scale
      const h = img.naturalHeight * scale
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)
    },
    [seq4.images]
  )

  useMotionValueEvent(scrollFraction, 'change', (frac) => {
    if (!seq4.loaded) return
    drawFrame(Math.round(frac * (SEQ4_FRAMES - 1)))
  })

  useEffect(() => {
    if (seq4.loaded) drawFrame(0)
  }, [seq4.loaded, drawFrame])

  useEffect(() => {
    const onResize = () => {
      if (!seq4.loaded) return
      drawFrame(Math.round(scrollFraction.get() * (SEQ4_FRAMES - 1)))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [seq4.loaded, drawFrame, scrollFraction])

  // Mouse parallax — canvas scaled 1.05 so edges never show
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    const loop = () => {
      const canvas = canvasRef.current
      if (canvas) {
        const targetX = -mouseRef.current.x * 14
        const targetY = -mouseRef.current.y * 9
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
  }, [])

  return (
    <>
      <section
        id="innovation"
        ref={containerRef}
        className="relative"
        style={{ height: `${(SCROLL_MULTIPLIER + 1) * 100}vh`, background: '#000' }}
      >
        <div
          className="sticky top-0 w-full h-screen overflow-hidden"
          style={{ contain: 'layout style paint' }}
        >
          {/* Loading */}
          {!seq4.loaded && (
            <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 gap-5">
              <p
                className="font-body text-[10px] tracking-widest3 uppercase"
                style={{ color: '#4ecdc4', letterSpacing: '0.2em' }}
              >
                Salle 04 — Galerie d&apos;Innovation
              </p>
              <p className="font-display text-2xl text-white">GreenMind</p>
              <div className="w-52 h-px bg-white/10 relative overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full"
                  style={{ width: `${seq4.progress * 100}%`, backgroundColor: '#4ecdc4' }}
                />
              </div>
              <p className="font-body text-xs tracking-widest3 uppercase text-white/40">
                {Math.round(seq4.progress * 100)} %
              </p>
            </div>
          )}

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Galerie d'Innovation — séquence cinématique"
            className="absolute inset-0 w-full h-full"
            style={{ willChange: 'transform' }}
          />

          {/* Top gradient */}
          <div
            className="absolute top-0 left-0 right-0 h-36 pointer-events-none z-10"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 65%, transparent 100%)',
            }}
          />
          {/* Bottom vignette */}
          <div
            className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)',
            }}
          />

          {/* Section header */}
          <SectionHeader scrollFraction={scrollFraction} />

          {/* Innovation glass cards */}
          {INNOVATIONS.map((item) => (
            <InnovationOverlay
              key={item.title}
              item={item}
              scrollFraction={scrollFraction}
              onOpen={() => setExpanded(item)}
            />
          ))}

          {/* Progress dots */}
          <ProgressBar scrollFraction={scrollFraction} />

          {/* Footer label */}
          <motion.div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none z-40"
            style={{ opacity: useTransform(scrollFraction, [0.04, 0.09], [0, 1]) }}
          >
            <p
              className="font-body text-[9px] tracking-widest3 uppercase text-center"
              style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em' }}
            >
              Galerie d&apos;Innovation · ODD 12 &amp; 13
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Expanded modal — outside section for correct stacking ── */}
      <AnimatePresence>
        {expanded && (
          <ExpandedModal item={expanded} onClose={() => setExpanded(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
