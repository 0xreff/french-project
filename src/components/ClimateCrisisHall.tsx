'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

/* ── Verified climate data (UN, NASA, Copernicus 2024) ── */
const HERO_STATS = [
  { value: '+1.55°C', label: 'Record temp rise in 2024', sub: 'Above pre-industrial levels' },
  { value: '57.1 Gt', label: 'CO₂ emitted in 2023', sub: 'A new global record' },
  { value: '3.1°C',   label: 'Projected warming', sub: 'If current policies continue' },
]

const INFO_CARDS = [
  {
    icon: '🌊',
    title: 'Oceans in Danger',
    text: 'Oceans absorb over 90% of the heat trapped by greenhouse gases. In 2025, ocean heat content reached record levels, threatening marine ecosystems worldwide.',
    source: 'NASA / Copernicus',
  },
  {
    icon: '🔥',
    title: '11 Warmest Years',
    text: 'The years 2015–2025 are the eleven warmest ever recorded. The rate of warming is unprecedented: 0.27°C per decade over the last 10 years.',
    source: 'WMO / Copernicus',
  },
  {
    icon: '📉',
    title: '7.5% Annual Cut Needed',
    text: 'To limit warming to 1.5°C, global emissions must fall by 7.5% every year through 2035. Current national plans are far from sufficient.',
    source: 'UNEP Emissions Gap Report',
  },
  {
    icon: '❄️',
    title: 'Ice Is Vanishing',
    text: 'Arctic sea ice is at near-record lows. Antarctic sea ice reached the third-lowest level ever recorded. Glaciers are retreating at alarming rates globally.',
    source: 'NASA / NSIDC',
  },
]

function AnimatedCounter({ value, label, sub, delay }: { value: string; label: string; sub: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="text-center"
    >
      <p className="font-display text-[clamp(3rem,7vw,6rem)] font-bold leading-none mb-3 text-transparent bg-clip-text"
         style={{ backgroundImage: 'linear-gradient(135deg, #ff6b35, #f7c948, #ff6b35)' }}>
        {value}
      </p>
      <p className="font-body text-sm text-text font-medium mb-1">{label}</p>
      <p className="font-body text-xs text-muted">{sub}</p>
    </motion.div>
  )
}

function InfoCard({ card, index }: { card: typeof INFO_CARDS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative bg-surface border border-border rounded-sm p-8 hover:border-accent/40 transition-all duration-500"
    >
      <span className="text-4xl mb-5 block">{card.icon}</span>
      <h3 className="font-display text-xl font-semibold mb-3 text-text">{card.title}</h3>
      <p className="font-body text-sm text-muted leading-relaxed mb-4">{card.text}</p>
      <p className="font-body text-[10px] tracking-widest3 uppercase text-accent/60">
        Source: {card.source}
      </p>

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
           style={{ background: 'radial-gradient(circle at center, rgba(255,107,53,0.04) 0%, transparent 70%)' }} />
    </motion.div>
  )
}

export default function ClimateCrisisHall() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="climate" ref={sectionRef} className="relative bg-bg py-32 px-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-[0.04] pointer-events-none"
           style={{ background: 'radial-gradient(circle, #ff6b35 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-4">Hall 02 — Climate Crisis</p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,6rem)] font-light leading-[1.05] tracking-tight mb-6">
            The Planet Is<br />
            <span className="font-semibold" style={{ color: '#ff6b35' }}>Speaking</span>
          </h2>
          <p className="font-body text-base text-muted max-w-2xl mx-auto leading-relaxed">
            SDG 13 calls for urgent action to combat climate change and its impacts.
            The data is clear — and the window for action is closing rapidly.
          </p>
        </motion.div>

        {/* Hero stat counters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          {HERO_STATS.map((stat, i) => (
            <AnimatedCounter key={stat.value} {...stat} delay={i * 0.15} />
          ))}
        </div>

        {/* Earth split image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative w-full aspect-[21/9] rounded-sm overflow-hidden mb-24 shadow-2xl"
        >
          <Image
            src="/museum/earth-split.png"
            alt="Split Earth — lush green vs burning dry"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-2">Our Choice</p>
            <p className="font-display text-2xl md:text-4xl font-light text-text">
              Two futures. <span className="font-semibold text-accent">One decision.</span>
            </p>
          </div>
        </motion.div>

        {/* Video embed */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-3">Watch</p>
            <h3 className="font-display text-3xl font-light">Climate Change 101</h3>
            <p className="font-body text-sm text-muted mt-2">By Bill Nye × National Geographic</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative w-full max-w-4xl mx-auto aspect-video rounded-sm overflow-hidden shadow-2xl border border-border"
          >
            <iframe
              src="https://www.youtube.com/embed/EtW2rrLHs08"
              title="Climate Change 101 — Bill Nye × National Geographic"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </motion.div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INFO_CARDS.map((card, i) => (
            <InfoCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
