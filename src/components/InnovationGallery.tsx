'use client'
import { useEffect, useRef, useCallback, useState } from 'react'
import { useScroll, useTransform, motion, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { useImagePreloader } from '@/hooks/useImagePreloader'

// ─── Config ──────────────────────────────────────────────────────────────────
const SEQ4_FRAMES      = 240
const SEQ5_FRAMES      = 175
const SEQ5_START_FRAME = 2     // skip frames 0-1 (start at file 003)
const SCROLL_MULTIPLIER = 8    // each sequence ≈ 900vh → 1700vh section total

// ─── Fonts / Colours ─────────────────────────────────────────────────────────
const CHALK   = "var(--font-caveat), 'Caveat', cursive"
const ACCENT4 = '#4ecdc4'
const ACCENT5 = '#c9a96e'

// ─── Innovation data (Salle 04) ──────────────────────────────────────────────
const INNOVATIONS = [
  { icon: '🌞', label: 'Énergie Solaire',     title: 'Cellules solaires\npérovskite',  description: "En superposant des matériaux pérovskite au silicium traditionnel, ces panneaux de nouvelle génération dépassent 30 % d'efficacité — bien au-delà des limites du silicium seul. Flexibles, légers et moins chers à produire à grande échelle.", stat: "30 %+ d'efficacité",             color: '#f7c948', image: '/museum/solar-panels.png',  range: [0.05, 0.22] as [number, number] },
  { icon: '🌱', label: 'Agriculture Durable',  title: 'Agriculture\nverticale',         description: "Les fermes intérieures contrôlées par IA utilisent 95 % d'eau en moins que l'agriculture conventionnelle. Des spectres LED personnalisés optimisent chaque phase de croissance, 365 jours par an, sans pesticides.", stat: "95 % d'eau en moins",             color: '#4ecdc4', image: '/museum/vertical-farm.png',  range: [0.22, 0.38] as [number, number] },
  { icon: '💨', label: 'Captage Carbone',      title: "Capture directe\nde l'air",      description: "Des installations comme Stratos au Texas extraient le CO₂ directement de l'atmosphère. De nouveaux matériaux MOF rendent le processus exponentiellement plus efficace et économique.", stat: "Élimine le CO₂ atmosph.",         color: '#7c9bff', image: '/museum/carbon-capture.png', range: [0.38, 0.55] as [number, number] },
  { icon: '🔋', label: 'Mobilité Électrique',  title: "Batteries à\nl'état solide",     description: "Remplacer l'électrolyte liquide par un solide double la densité énergétique, autorise une charge en minutes et élimine le risque d'incendie — la clé des véhicules électriques abordables d'ici 2030.", stat: '2× la densité énergétique',     color: '#ff6b9d', image: '/museum/green-city.png',   range: [0.55, 0.70] as [number, number] },
  { icon: '🏗️', label: 'Construction Verte',   title: 'Minéralisation\ndu carbone',     description: "Le CO₂ capturé est transformé en calcaire synthétique puis utilisé dans la construction. Le carbone est littéralement emprisonné dans les bâtiments — retiré définitivement de l'atmosphère.", stat: 'CO₂ → matériau de construction', color: '#a78bfa', image: '/museum/earth-split.png',   range: [0.70, 0.85] as [number, number] },
  { icon: '🪟', label: 'Architecture Solaire', title: 'Fenêtres\nsolaires (BIPV)',      description: "Le verre photovoltaïque transparent produit de l'électricité tout en laissant passer la lumière. Des façades entières de gratte-ciels deviennent des centrales électriques, sans terrain supplémentaire.", stat: 'Fenêtres = centrales',           color: '#34d399', image: '/museum/solar-panels.png',  range: [0.85, 1.0]  as [number, number] },
]

// ─── Quiz ranges in seq5Fraction (0→1) ────────────────────────────────────────
// Intro is very short [0.01, 0.09] — user goes directly to Q1
// Scroll DOWN cap = midpoint of current unanswered Q range, scroll UP always free
const QUIZ_RANGES: [number, number][] = [
  [0.09, 0.25],   // Q1
  [0.25, 0.41],   // Q2
  [0.41, 0.57],   // Q3
  [0.57, 0.73],   // Q4
  [0.73, 0.88],   // Q5
]
// Cap = midpoint of range (card is fully visible, centered on screen)
const QUIZ_CAP_FRACS = QUIZ_RANGES.map(([lo, hi]) => (lo + hi) / 2)
// → [0.17, 0.33, 0.49, 0.65, 0.805]

const WHITE_SEQ5_FRAC = 0.88   // canvas → white CSS at this point

const QUIZ_QUESTIONS = [
  { question: "Que signifie l'ODD 13 ?",                               options: ['Eau propre', 'Action climatique', 'Vie aquatique', 'Énergie abordable'], correct: 1 },
  { question: 'Quelle quantité de nourriture est gaspillée chaque année ?', options: ['250 M de tonnes', '931 M de tonnes', '500 M de tonnes', '1,5 Md de tonnes'], correct: 1 },
  { question: "Quel % de l'économie mondiale est circulaire ?",         options: ['25 %', '15,2 %', '8,6 %', '42 %'],          correct: 2 },
  { question: "Combien de planètes faudrait-il d'ici 2050 ?",          options: ['1,5', '2', '3', '5'],                        correct: 2 },
  { question: "Hausse de température en 2024 vs. ère préindustrielle ?", options: ['+0,8°C', '+1,2°C', '+1,55°C', '+2,1°C'], correct: 2 },
]

const CHALLENGES = [
  { day: 1, task: "Refuser tout plastique à usage unique",    icon: '🚫' },
  { day: 2, task: 'Marcher ou pédaler au lieu de conduire',   icon: '🚶' },
  { day: 3, task: 'Manger un repas 100 % végétal',           icon: '🥗' },
  { day: 4, task: 'Débrancher les appareils inutilisés',      icon: '🔌' },
  { day: 5, task: "Réparer plutôt qu'acheter du neuf",        icon: '🔧' },
  { day: 6, task: 'Partager ce musée avec 3 amis',           icon: '📤' },
  { day: 7, task: 'Planter une graine ou arroser une plante', icon: '🌱' },
]

type Innovation = (typeof INNOVATIONS)[0]
type Answer = { selected: number; correct: boolean }

// ─────────────────────────────────────────────────────────────────────────────
// Salle 04 sub-components (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

function ExpandedModal({ item, onClose }: { item: Innovation; onClose: () => void }) {
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = '' } }, [])
  return (
    <motion.div key="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }} className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={onClose}
    >
      <motion.div className="absolute inset-0"
        initial={{ backdropFilter: 'blur(0px)', background: 'rgba(0,0,0,0)' }}
        animate={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.65)' }}
        exit={{ backdropFilter: 'blur(0px)', background: 'rgba(0,0,0,0)' }} transition={{ duration: 0.4 }} />
      <motion.div initial={{ scale: 0.82, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 20 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl mx-4" style={{ maxHeight: '90vh', borderRadius: 24, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ height: '55vh', position: 'relative', overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(8,12,8,0.95) 100%)' }} />
          <div className="absolute top-6 left-7">
            <p style={{ color: item.color, background: `${item.color}18`, border: `1px solid ${item.color}40`, letterSpacing: '0.18em', fontSize: 10, textTransform: 'uppercase', padding: '4px 12px' }}>{item.label}</p>
          </div>
          <button onClick={onClose} className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center text-white/70 hover:text-white"
            style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l12 12M13 1L1 13" /></svg>
          </button>
        </div>
        <div style={{ background: 'rgba(8,12,8,0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderTop: `2px solid ${item.color}`, padding: '2.5rem 3rem 3rem' }}>
          <div className="flex items-start gap-5 mb-5">
            <span className="text-4xl mt-1">{item.icon}</span>
            <h2 className="font-display font-semibold" style={{ color: '#fff', fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', whiteSpace: 'pre-line' }}>{item.title}</h2>
          </div>
          <div className="mb-6" style={{ height: 1, background: `linear-gradient(to right, ${item.color}50, transparent)` }} />
          <p className="font-body text-base leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.72)' }}>{item.description}</p>
          <div className="inline-flex items-center gap-3 px-5 py-2.5" style={{ background: `${item.color}18`, border: `1px solid ${item.color}55` }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}80` }} />
            <span className="font-body text-sm font-semibold tracking-widest2 uppercase" style={{ color: item.color }}>{item.stat}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function InnovationOverlay({ item, scrollFraction, onOpen }: { item: Innovation; scrollFraction: any; onOpen: () => void }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const [lo, hi] = item.range; const span = hi - lo
  const p1end = lo + span * 0.30; const p2end = hi - span * 0.30
  const opacity   = useTransform(scrollFraction, [lo, lo + span * 0.15, p2end, hi], [0, 1, 1, 0])
  const scale     = useTransform(scrollFraction, [lo, p1end, p2end, hi], [0.72, 1.0, 1.0, 1.65])
  const y         = useTransform(scrollFraction, [lo, p1end, p2end, hi], [55, 0, 0, -70])
  const blurV     = useTransform(scrollFraction, [lo, p1end, p2end, hi], [8, 0, 0, 12])
  const filter    = useTransform(blurV, (b) => `blur(${b}px)`)
  const ptrEvts   = useTransform(opacity, (o) => (o > 0.1 ? 'auto' : 'none'))
  const bgOpacity = useTransform(scrollFraction, [lo, lo + span * 0.18, p2end, hi], [0, 1, 1, 0])
  const bgBlurV   = useTransform(scrollFraction, [lo, p1end, p2end, hi], [0, 3, 3, 0])
  const bgBlur    = useTransform(bgBlurV, (b) => `blur(${b}px) saturate(120%)`)
  return (
    <motion.div style={{ opacity, pointerEvents: ptrEvts }} className="absolute inset-0 flex items-center justify-center z-30 px-6 md:px-16">
      <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: bgOpacity, backdropFilter: bgBlur, WebkitBackdropFilter: bgBlur, background: `radial-gradient(ellipse at 50% 50%, ${item.color}06 0%, rgba(10,16,10,0.18) 55%, rgba(4,8,4,0.08) 100%)` }} />
      <motion.div style={{ scale, y, filter, maxWidth: '820px' }} className="w-full relative z-10">
        <motion.div className="relative overflow-hidden cursor-pointer group" onClick={onOpen}
          style={{ background: 'rgba(14,22,12,0.68)', backdropFilter: 'blur(40px) saturate(200%) brightness(1.08)', WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(1.08)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 'clamp(18px,2.8vw,28px)', padding: 'clamp(2.2rem,5vw,3.5rem) clamp(2rem,6vw,4rem)', boxShadow: `0 0 0 1px ${item.color}18, 0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.10)` }}
          whileHover={{ scale: 1.012, transition: { duration: 0.3 } }}>
          <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.28) 50%, transparent)' }} />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${item.color}12 0%, transparent 72%)`, borderRadius: 'inherit' }} />
          <p style={{ color: item.color, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 12 }} className="font-body">{item.label}</p>
          <h3 className="font-display font-semibold text-white mb-5 leading-[1.12]" style={{ fontSize: 'clamp(1.8rem,4vw,3.2rem)', whiteSpace: 'pre-line' }}>{item.title}</h3>
          <div style={{ height: 1, background: `linear-gradient(to right, ${item.color}60, transparent)`, marginBottom: '1.5rem' }} />
          <p className="font-body leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.68)', fontSize: 'clamp(0.82rem,1.4vw,0.98rem)', maxWidth: 520 }}>{item.description}</p>
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2.5 px-4 py-2" style={{ background: `${item.color}16`, border: `1px solid ${item.color}45` }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }} />
              <span className="font-body text-xs font-semibold tracking-widest2 uppercase" style={{ color: item.color }}>{item.stat}</span>
            </div>
            <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
              <span className="font-body text-xs tracking-widest2 uppercase text-white/60">En savoir plus</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2"><path d="M1 6h10M7 2l4 4-4 4" /></svg>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function SectionHeader({ scrollFraction }: { scrollFraction: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const opacity = useTransform(scrollFraction, [0.0, 0.04, 0.08, 0.14], [1, 1, 1, 0])
  const y       = useTransform(scrollFraction, [0.0, 0.14], [0, -30])
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 flex flex-col items-center justify-end pb-28 text-center pointer-events-none z-30 px-6">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 55%, transparent 80%)' }} />
      <div className="relative flex flex-col items-center gap-2">
        <p className="font-body text-xs uppercase mb-4" style={{ color: ACCENT4, letterSpacing: '0.2em' }}>Salle 04 — Galerie d&apos;Innovation</p>
        <h2 className="font-display text-[clamp(2.5rem,7vw,7rem)] font-light leading-[1.05] tracking-tight mb-6 text-white" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
          La technologie qui<br /><span className="font-semibold" style={{ color: ACCENT4 }}>guérit la planète</span>
        </h2>
        <p className="font-body text-sm max-w-xl mx-auto leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.72)' }}>
          Des cellules solaires plus fines qu&apos;une feuille de papier aux fermes qui cultivent en intérieur — ces innovations prouvent qu&apos;un avenir durable se construit maintenant.
        </p>
        <div className="flex flex-col items-center gap-3">
          <p className="font-body text-xs uppercase" style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.18em' }}>Défiler pour explorer</p>
          <motion.div className="w-px h-10" style={{ backgroundColor: ACCENT4, opacity: 0.7 }} animate={{ scaleY: [1, 0.4, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
      </div>
    </motion.div>
  )
}

function ProgressDot({ item, scrollFraction }: { item: Innovation; scrollFraction: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const active = useTransform(scrollFraction, [item.range[0], item.range[0] + 0.02, item.range[1] - 0.02, item.range[1]], [0, 1, 1, 0])
  const h = useTransform(active, [0, 1], [5, 22])
  const bg = useTransform(active, [0, 1], ['rgba(255,255,255,0.18)', item.color])
  return <motion.div className="w-[2px] rounded-full" style={{ height: h, backgroundColor: bg }} />
}
function ProgressBar({ scrollFraction }: { scrollFraction: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const opacity = useTransform(scrollFraction, [0.04, 0.09], [0, 1])
  return (
    <motion.div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-3 items-center pointer-events-none z-40" style={{ opacity }}>
      {INNOVATIONS.map((item) => <ProgressDot key={item.title} item={item} scrollFraction={scrollFraction} />)}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Salle 05 sub-components
// ─────────────────────────────────────────────────────────────────────────────

function GlassCard5({ children, maxWidth = '860px', accent = ACCENT5 }: { children: React.ReactNode; maxWidth?: string; accent?: string }) {
  return (
    <div style={{ width: '100%', maxWidth, background: 'rgba(14,22,12,0.72)', backdropFilter: 'blur(40px) saturate(200%) brightness(1.08)', WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(1.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'clamp(18px,2.5vw,26px)', boxShadow: `0 0 0 1px ${accent}18, 0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)`, overflow: 'hidden', position: 'relative', padding: 'clamp(1.8rem,3.5vw,2.8rem)' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, pointerEvents: 'none', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.32) 50%, transparent)' }} />
      {children}
    </div>
  )
}

// Intro card — very short range, passes quickly before Q1
function Salle05Intro({ seq5Fraction }: { seq5Fraction: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const lo = 0.01; const hi = 0.09; const span = hi - lo
  const p1end = lo + span * 0.30; const p2end = hi - span * 0.30
  const opacity   = useTransform(seq5Fraction, [lo, lo + span * 0.25, p2end, hi], [0, 1, 1, 0])
  const scale     = useTransform(seq5Fraction, [lo, p1end, p2end, hi], [0.82, 1.0, 1.0, 1.45])
  const y         = useTransform(seq5Fraction, [lo, p1end, p2end, hi], [35, 0, 0, -45])
  const blurV     = useTransform(seq5Fraction, [lo, p1end, p2end, hi], [5, 0, 0, 7])
  const filter    = useTransform(blurV, (b) => `blur(${b}px)`)
  const ptrEvts   = useTransform(opacity, (o) => (o > 0.1 ? 'auto' : 'none'))
  const bgOpacity = useTransform(seq5Fraction, [lo, lo + span * 0.25, p2end, hi], [0, 0.7, 0.7, 0])
  return (
    <motion.div style={{ opacity, pointerEvents: ptrEvts }} className="absolute inset-0 flex items-center justify-center z-30 px-4 md:px-10">
      <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: bgOpacity, backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }} />
      <motion.div style={{ scale, y, filter }} className="w-full flex justify-center relative z-10">
        <GlassCard5 maxWidth="640px">
          <p className="text-center uppercase mb-3" style={{ fontFamily: CHALK, color: ACCENT5, fontSize: 13, letterSpacing: '0.22em' }}>Salle 05 — Zone d&apos;Action</p>
          <h2 className="text-center text-white mb-3" style={{ fontFamily: CHALK, fontSize: 'clamp(2rem,5.5vw,4rem)', fontWeight: 700, lineHeight: 1.1 }}>
            À votre tour —<br /><span style={{ color: ACCENT5 }}>Agissez maintenant</span>
          </h2>
          <div className="mx-auto mb-3" style={{ width: 40, height: 1, background: `${ACCENT5}80` }} />
          <p className="text-center mx-auto" style={{ fontFamily: CHALK, color: 'rgba(255,255,255,0.60)', fontSize: 'clamp(1rem,1.7vw,1.1rem)', maxWidth: 340, lineHeight: 1.5 }}>
            5 questions vous attendent.<br />Répondez pour avancer ↓
          </p>
        </GlassCard5>
      </motion.div>
    </motion.div>
  )
}

// Quiz card — scroll-driven passthrough, same physics as InnovationOverlay
// Each card stays visible when scroll is blocked at its midpoint cap
function QuizCard({ qIndex, seq5Fraction, answer, onAnswer }: {
  qIndex: number
  seq5Fraction: any // eslint-disable-line @typescript-eslint/no-explicit-any
  answer: Answer | null
  onAnswer: (selected: number, correct: boolean) => void
}) {
  const q = QUIZ_QUESTIONS[qIndex]
  const [lo, hi] = QUIZ_RANGES[qIndex]; const span = hi - lo
  const p1end = lo + span * 0.28; const p2end = hi - span * 0.28

  const opacity   = useTransform(seq5Fraction, [lo, lo + span * 0.22, p2end, hi], [0, 1, 1, 0])
  const scale     = useTransform(seq5Fraction, [lo, p1end, p2end, hi], [0.80, 1.0, 1.0, 1.50])
  const y         = useTransform(seq5Fraction, [lo, p1end, p2end, hi], [40, 0, 0, -50])
  const blurV     = useTransform(seq5Fraction, [lo, p1end, p2end, hi], [6, 0, 0, 8])
  const filter    = useTransform(blurV, (b) => `blur(${b}px)`)
  const ptrEvts   = useTransform(opacity, (o) => (o > 0.1 ? 'auto' : 'none'))
  const bgOpacity = useTransform(seq5Fraction, [lo, lo + span * 0.22, p2end, hi], [0, 1, 1, 0])
  const bgBlurV   = useTransform(seq5Fraction, [lo, p1end, p2end, hi], [0, 3, 3, 0])
  const bgBlur    = useTransform(bgBlurV, (b) => `blur(${b}px) saturate(120%)`)

  // Local state for interaction feedback; merges with parent answer (for re-visits)
  const [localSel, setLocalSel] = useState<number | null>(answer?.selected ?? null)
  const [localRes, setLocalRes] = useState(answer !== null)

  // Sync if parent answer changes (e.g. component doesn't unmount between visits)
  useEffect(() => {
    if (answer !== null && localSel === null) {
      setLocalSel(answer.selected); setLocalRes(true)
    }
  }, [answer, localSel])

  const displaySel = localSel
  const displayRes = localRes

  const handleSelect = (idx: number) => {
    if (displaySel !== null) return
    setLocalSel(idx); setLocalRes(true)
    setTimeout(() => onAnswer(idx, idx === q.correct), 900)
  }

  return (
    <motion.div style={{ opacity, pointerEvents: ptrEvts }} className="absolute inset-0 flex items-center justify-center z-30 px-6 md:px-16">
      <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: bgOpacity, backdropFilter: bgBlur, WebkitBackdropFilter: bgBlur, background: `radial-gradient(ellipse at 50% 50%, ${ACCENT5}06 0%, rgba(10,16,10,0.20) 60%, transparent 100%)` }} />
      <motion.div style={{ scale, y, filter, maxWidth: '860px' }} className="w-full relative z-10">
        <GlassCard5>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p style={{ fontFamily: CHALK, color: ACCENT5, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>
                Question {qIndex + 1} / {QUIZ_QUESTIONS.length}
              </p>
              {displayRes && (
                <p style={{ fontFamily: CHALK, fontSize: 14, color: displaySel === q.correct ? '#4ecdc4' : '#ff6b9d' }}>
                  {displaySel === q.correct ? '✓ Bonne réponse !' : `✗ Mauvaise — bonne : ${q.options[q.correct]}`}
                </p>
              )}
            </div>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: `${ACCENT5}20`, border: `2px solid ${ACCENT5}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: CHALK, color: ACCENT5, fontWeight: 700, fontSize: 18 }}>{qIndex + 1}</span>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ width: '100%', height: 2, background: 'rgba(255,255,255,0.10)', borderRadius: 2, marginBottom: '1.2rem', overflow: 'hidden' }}>
            <div style={{ width: `${((qIndex + (displayRes ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${ACCENT5}, #e8c87e)`, transition: 'width 0.4s' }} />
          </div>
          <h3 style={{ fontFamily: CHALK, color: '#fff', fontSize: 'clamp(1.3rem,3vw,2rem)', fontWeight: 600, marginBottom: '1.2rem', lineHeight: 1.3 }}>{q.question}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((opt, idx) => {
              let border = 'rgba(255,255,255,0.12)', bg = 'rgba(255,255,255,0.04)', color = 'rgba(255,255,255,0.78)'
              if (displayRes && idx === q.correct)                          { border = 'rgba(78,205,196,0.60)'; bg = 'rgba(78,205,196,0.12)'; color = '#4ecdc4' }
              if (displayRes && idx === displaySel && idx !== q.correct)    { border = 'rgba(255,107,107,0.60)'; bg = 'rgba(255,107,107,0.10)'; color = '#ff6b9d' }
              return (
                <button key={idx} onClick={() => handleSelect(idx)} disabled={displaySel !== null}
                  className="text-left transition-all duration-300"
                  style={{ padding: '0.9rem 1.1rem', background: bg, border: `1px solid ${border}`, borderRadius: 10, color, cursor: displaySel !== null ? 'default' : 'pointer' }}>
                  <span style={{ fontFamily: CHALK, fontWeight: 700, marginRight: 8, color: ACCENT5, fontSize: 16 }}>{String.fromCharCode(65 + idx)}.</span>
                  <span style={{ fontFamily: CHALK, fontSize: 'clamp(0.95rem,1.6vw,1.1rem)' }}>{opt}</span>
                </button>
              )
            })}
          </div>
        </GlassCard5>
      </motion.div>
    </motion.div>
  )
}

// Persistent quiz zone banner — fades in as Q1 appears, shows current progress
// UP scroll always free — this is just a reminder
function QuizBanner({ seq5Fraction, answeredCount }: { seq5Fraction: any; answeredCount: number }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const opacity = useTransform(seq5Fraction, [0.07, 0.11], [0, 1])
  if (answeredCount >= QUIZ_QUESTIONS.length) return null
  return (
    <motion.div style={{ opacity }} className="absolute bottom-12 left-0 right-0 flex justify-center pointer-events-none z-50">
      <div className="flex items-center gap-3 px-5 py-2.5"
        style={{ background: 'rgba(14,22,12,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: `1px solid ${ACCENT5}50`, borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.35)' }}>
        {/* Progress dots */}
        <div className="flex gap-1.5 items-center">
          {QUIZ_QUESTIONS.map((_, i) => (
            <div key={i} style={{ width: i < answeredCount ? 18 : 8, height: 8, borderRadius: 4, background: i < answeredCount ? ACCENT5 : 'rgba(255,255,255,0.20)', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)' }} />
          ))}
        </div>
        <p style={{ fontFamily: CHALK, color: '#fff', fontSize: 15 }}>
          <strong style={{ color: ACCENT5 }}>Question {answeredCount + 1}/{QUIZ_QUESTIONS.length}</strong>
          {' '}— répondez pour avancer ↓
        </p>
      </div>
    </motion.div>
  )
}

// Défi card — scroll-driven, appears in white zone at end of seq5
function DefiCard({ seq5Fraction, allDone }: { seq5Fraction: any; allDone: boolean }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const [checked, setChecked] = useState<boolean[]>(new Array(7).fill(false))
  const toggle = (i: number) => setChecked((p) => { const n = [...p]; n[i] = !n[i]; return n })
  const done = checked.filter(Boolean).length

  // Card enters only after all 5 answered (scroll cap released)
  // Fade in as user scrolls into white zone
  const opacity = useTransform(seq5Fraction, [0.89, 0.93], [0, 1])
  const scale   = useTransform(seq5Fraction, [0.89, 0.93], [0.88, 1.0])
  const ptrEvts = useTransform(opacity, (o) => ((o > 0.1 && allDone) ? 'auto' : 'none'))

  return (
    <motion.div style={{ opacity, pointerEvents: ptrEvts }} className="absolute inset-0 flex items-center justify-center z-30 px-4 md:px-10 overflow-y-auto py-6">
      <motion.div style={{ scale, maxWidth: '860px' }} className="w-full">
        <GlassCard5>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p style={{ fontFamily: CHALK, color: ACCENT5, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>Défi 7 jours — Zone d&apos;Action</p>
              <h3 style={{ fontFamily: CHALK, color: '#fff', fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 700 }}>Semaine Verte 🌿</h3>
            </div>
            <div className="text-right">
              <p style={{ fontFamily: CHALK, color: ACCENT5, fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{done}/7</p>
              <p style={{ fontFamily: CHALK, color: 'rgba(255,255,255,0.40)', fontSize: 13 }}>accomplis</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 2, background: 'rgba(255,255,255,0.10)', borderRadius: 2, marginBottom: '1rem', overflow: 'hidden' }}>
            <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #4ecdc4, #c9a96e)' }} animate={{ width: `${(done / 7) * 100}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div className="space-y-2">
            {CHALLENGES.map((ch, i) => (
              <button key={ch.day} onClick={() => toggle(i)} className="w-full flex items-center gap-3 p-3 text-left transition-all duration-300"
                style={{ background: checked[i] ? 'rgba(78,205,196,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${checked[i] ? 'rgba(78,205,196,0.30)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10 }}>
                <div className="flex items-center justify-center shrink-0 transition-all duration-300"
                  style={{ width: 20, height: 20, background: checked[i] ? '#4ecdc4' : 'transparent', border: `2px solid ${checked[i] ? '#4ecdc4' : 'rgba(255,255,255,0.25)'}`, borderRadius: 5 }}>
                  {checked[i] && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-base shrink-0">{ch.icon}</span>
                <div>
                  <p style={{ fontFamily: CHALK, color: ACCENT5, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 1 }}>Jour {ch.day}</p>
                  <p style={{ fontFamily: CHALK, color: checked[i] ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.80)', fontSize: 'clamp(0.9rem,1.4vw,1rem)', textDecoration: checked[i] ? 'line-through' : 'none' }}>{ch.task}</p>
                </div>
              </button>
            ))}
          </div>
          {done === 7 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 text-center" style={{ background: 'rgba(78,205,196,0.10)', border: '1px solid rgba(78,205,196,0.30)', borderRadius: 12 }}>
              <p style={{ fontFamily: CHALK, color: '#4ecdc4', fontSize: 22, fontWeight: 700 }}>🌍 Défi accompli !</p>
            </motion.div>
          )}
          <div className="flex gap-3 mt-5 justify-center">
            <a href="https://sdgs.un.org/goals/goal12" target="_blank" rel="noopener noreferrer" style={{ fontFamily: CHALK, fontSize: 13, padding: '8px 20px', border: '1px solid rgba(255,255,255,0.20)', color: 'rgba(255,255,255,0.55)', borderRadius: 8 }}>ODD 12</a>
            <a href="https://sdgs.un.org/goals/goal13" target="_blank" rel="noopener noreferrer" style={{ fontFamily: CHALK, fontSize: 13, padding: '8px 20px', background: `${ACCENT5}22`, border: `1px solid ${ACCENT5}55`, color: ACCENT5, borderRadius: 8 }}>ODD 13</a>
          </div>
        </GlassCard5>
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function InnovationGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const mouseRef     = useRef({ x: 0, y: 0 })
  const rafRef       = useRef<number>(0)

  // Use ref for answeredCount in wheel handler to avoid stale closure
  const answeredCountRef = useRef(0)
  const isWhiteRef       = useRef(false)  // avoid repeated setIsWhiteZone calls

  const [answers,     setAnswers]     = useState<(Answer | null)[]>(new Array(5).fill(null))
  const [isWhiteZone, setIsWhiteZone] = useState(false)
  const [expanded,    setExpanded]    = useState<Innovation | null>(null)

  const answeredCount = answers.filter(Boolean).length
  const allDone       = answeredCount >= QUIZ_QUESTIONS.length

  // Keep ref in sync
  useEffect(() => { answeredCountRef.current = answeredCount }, [answeredCount])

  const seq4 = useImagePreloader('/sequence-4/ezgif-frame-', SEQ4_FRAMES, 3, 'jpg')
  const seq5 = useImagePreloader('/sequence-5/ezgif-frame-', SEQ5_FRAMES, 3, 'jpg')
  const { scrollY } = useScroll()

  // ── Fractions ─────────────────────────────────────────────────────────────
  const rawFraction = useTransform(scrollY, (latest) => {
    if (!containerRef.current) return 0
    const el = containerRef.current
    const offsetTop = el.getBoundingClientRect().top + window.scrollY
    const maxScroll  = el.offsetHeight - window.innerHeight
    if (maxScroll <= 0) return 0
    return Math.min(Math.max((latest - offsetTop) / maxScroll, 0), 1)
  })
  // seq4Fraction: 0→1 over rawFraction 0→0.5
  const seq4Fraction = useTransform(rawFraction, (f) => Math.min(f * 2, 1))
  // seq5Fraction: 0→1 over rawFraction 0.5→1.0
  const seq5Fraction = useTransform(rawFraction, (f) => Math.min(Math.max((f - 0.5) * 2, 0), 1))

  // ── Canvas draw helpers ───────────────────────────────────────────────────
  const drawImage = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    if (!img || img.naturalWidth === 0) return
    canvas.width = window.innerWidth; canvas.height = window.innerHeight
    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
    const w = img.naturalWidth * scale; const h = img.naturalHeight * scale
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)
  }, [])

  const drawSeq4 = useCallback((index: number) => {
    const img = seq4.images[Math.max(0, Math.min(index, SEQ4_FRAMES - 1))]
    if (img) drawImage(img)
  }, [seq4.images, drawImage])

  const drawSeq5 = useCallback((index: number) => {
    const img = seq5.images[Math.max(0, Math.min(index, SEQ5_FRAMES - 1))]
    if (img) drawImage(img)
  }, [seq5.images, drawImage])

  // ── Drive canvas from scroll ──────────────────────────────────────────────
  useMotionValueEvent(rawFraction, 'change', (raw) => {
    if (raw <= 0.5) {
      drawSeq4(Math.round(raw * 2 * (SEQ4_FRAMES - 1)))
      if (isWhiteRef.current) { isWhiteRef.current = false; setIsWhiteZone(false) }
    } else {
      const s5f = (raw - 0.5) * 2
      const white = s5f >= WHITE_SEQ5_FRAC
      if (white !== isWhiteRef.current) { isWhiteRef.current = white; setIsWhiteZone(white) }
      if (!white) {
        const effectiveFrames = SEQ5_FRAMES - 1 - SEQ5_START_FRAME  // 172
        drawSeq5(SEQ5_START_FRAME + Math.round(s5f * effectiveFrames))
      }
    }
  })

  useEffect(() => { if (seq4.images[0]) drawSeq4(0) }, [seq4.images[0]]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (seq4.loaded) drawSeq4(0) }, [seq4.loaded, drawSeq4])

  useEffect(() => {
    const onResize = () => {
      const raw = rawFraction.get()
      if (raw <= 0.5) drawSeq4(Math.round(raw * 2 * (SEQ4_FRAMES - 1)))
      else            drawSeq5(SEQ5_START_FRAME + Math.round((raw - 0.5) * 2 * (SEQ5_FRAMES - 1 - SEQ5_START_FRAME)))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [drawSeq4, drawSeq5, rawFraction])

  // ── Scroll cap — downward only, walks forward as answers come in ──────────
  // Scroll UP is ALWAYS permitted (e.deltaY <= 0: no block)
  // When user has answered N questions, cap is at Q(N+1) midpoint
  // After all 5 answered: no cap
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY <= 0) return                             // UP always free
      if (answeredCountRef.current >= QUIZ_QUESTIONS.length) return  // all done
      if (!containerRef.current) return

      const capSeq5Frac = QUIZ_CAP_FRACS[answeredCountRef.current]
      const offsetTop   = containerRef.current.getBoundingClientRect().top + window.scrollY
      const maxScroll   = containerRef.current.offsetHeight - window.innerHeight
      // rawFrac at cap = 0.5 + capSeq5Frac * 0.5  (seq5 is in second half of section)
      const capScrollY  = offsetTop + (0.5 + capSeq5Frac * 0.5) * maxScroll

      if (window.scrollY >= capScrollY - 5) e.preventDefault()
    }
    const onTouch = (e: TouchEvent) => {
      if (answeredCountRef.current >= QUIZ_QUESTIONS.length) return
      // Basic touch block (no direction check — simplified)
      if (!containerRef.current) return
      const capSeq5Frac = QUIZ_CAP_FRACS[answeredCountRef.current]
      const offsetTop   = containerRef.current.getBoundingClientRect().top + window.scrollY
      const maxScroll   = containerRef.current.offsetHeight - window.innerHeight
      const capScrollY  = offsetTop + (0.5 + capSeq5Frac * 0.5) * maxScroll
      if (window.scrollY >= capScrollY - 5) e.preventDefault()
    }
    window.addEventListener('wheel',     onWheel, { passive: false })
    window.addEventListener('touchmove', onTouch, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])  // stable — uses only refs

  // ── Mouse parallax ────────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 } }
    const loop = () => {
      const canvas = canvasRef.current
      if (canvas && !isWhiteZone) {
        const tx = -mouseRef.current.x * 14; const ty = -mouseRef.current.y * 9
        const px = parseFloat(canvas.dataset.px ?? '0'); const py = parseFloat(canvas.dataset.py ?? '0')
        const nx = px + (tx - px) * 0.07; const ny = py + (ty - py) * 0.07
        canvas.dataset.px = String(nx); canvas.dataset.py = String(ny)
        canvas.style.transform = `scale(1.05) translate(${nx / 1.05}px, ${ny / 1.05}px)`
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current) }
  }, [isWhiteZone])

  // ── Answer handler ────────────────────────────────────────────────────────
  const handleAnswer = useCallback((qIndex: number, selected: number, correct: boolean) => {
    setAnswers(prev => {
      if (prev[qIndex] !== null) return prev
      const next = [...prev]; next[qIndex] = { selected, correct }; return next
    })
  }, [])

  return (
    <>
      <section id="innovation" ref={containerRef} className="relative"
        style={{ height: `${(SCROLL_MULTIPLIER * 2 + 1) * 100}vh`, background: isWhiteZone ? '#ffffff' : '#000000', transition: 'background 0.5s ease' }}
      >
        <div className="sticky top-0 w-full h-screen overflow-hidden" style={{ contain: 'layout style paint' }}>

          {/* Loading */}
          {!seq4.images[0] && (
            <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 gap-5">
              <p style={{ color: ACCENT4, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Salles 04 &amp; 05</p>
              <p className="font-display text-2xl text-white">GreenMind</p>
              <div className="w-52 h-px bg-white/10 relative overflow-hidden">
                <motion.div className="absolute left-0 top-0 h-full" style={{ width: `${seq4.progress * 100}%`, backgroundColor: ACCENT4 }} />
              </div>
              <p className="font-body text-xs text-white/40">{Math.round(seq4.progress * 100)} %</p>
            </div>
          )}

          {/* Canvas */}
          <canvas ref={canvasRef} role="img" aria-label="Séquence cinématique" className="absolute inset-0 w-full h-full"
            style={{ willChange: 'transform', display: isWhiteZone ? 'none' : 'block' }} />

          {/* White zone bg */}
          {isWhiteZone && <div className="absolute inset-0 bg-white" />}

          {/* Dark vignettes */}
          {!isWhiteZone && (
            <>
              <div className="absolute top-0 left-0 right-0 h-36 pointer-events-none z-10" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 65%, transparent 100%)' }} />
              <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)' }} />
            </>
          )}

          {/* ── Salle 04 ─────────────────────────────────────────────────── */}
          <SectionHeader scrollFraction={seq4Fraction} />
          {INNOVATIONS.map((item) => (
            <InnovationOverlay key={item.title} item={item} scrollFraction={seq4Fraction} onOpen={() => setExpanded(item)} />
          ))}
          <ProgressBar scrollFraction={seq4Fraction} />

          {/* ── Salle 05 intro (very short, leads directly into Q1) ────── */}
          <Salle05Intro seq5Fraction={seq5Fraction} />

          {/* ── 5 scroll-driven quiz cards ────────────────────────────── */}
          {QUIZ_QUESTIONS.map((_, i) => (
            <QuizCard
              key={i}
              qIndex={i}
              seq5Fraction={seq5Fraction}
              answer={answers[i]}
              onAnswer={(sel, ok) => handleAnswer(i, sel, ok)}
            />
          ))}

          {/* ── Quiz progress banner ──────────────────────────────────── */}
          <QuizBanner seq5Fraction={seq5Fraction} answeredCount={answeredCount} />

          {/* ── Défi (white zone, scroll-driven, visible only after allDone) */}
          <DefiCard seq5Fraction={seq5Fraction} allDone={allDone} />

          {/* ── Bottom label ───────────────────────────────────────────── */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none z-40">
            <p className="text-center" style={{ fontFamily: isWhiteZone ? CHALK : undefined, color: isWhiteZone ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.22)', fontSize: 9, letterSpacing: '0.20em', textTransform: 'uppercase' }}>
              {isWhiteZone ? "Zone d'Action · ODD 12 & 13" : "Galerie · Zone d'Action · ODD 12 & 13"}
            </p>
          </div>
        </div>
      </section>

      <div id="actnow" style={{ height: 0, overflow: 'hidden' }} aria-hidden="true" />

      <AnimatePresence>
        {expanded && <ExpandedModal item={expanded} onClose={() => setExpanded(null)} />}
      </AnimatePresence>
    </>
  )
}
