'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={ref} className="bg-bg py-40 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left: large display text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-6">Hall 01 — Our Mission</p>
          <h2 className="font-display text-[clamp(2.5rem,5.5vw,6.5rem)] leading-[1.05] font-light tracking-tight">
            Éduquer et inspirer<br />
            à agir contre le<br />
            <span className="font-semibold text-accent" style={{ WebkitTextStroke: '0.6px rgba(201,169,110,0.6)' }}>
              changement climatique.
            </span>
          </h2>
        </motion.div>

        {/* Right: body copy + stat bar */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="space-y-8"
        >
          <p className="font-body text-base leading-[1.8] text-muted">
            GreenMind Museum is a virtual eco-technological museum dedicated to the Sustainable Development Goals 12 and 13. Our mission is to educate visitors about responsible consumption and climate action — through verified data, compelling stories, and innovative technology.
          </p>
          <p className="font-body text-base leading-[1.8] text-muted">
            <strong className="text-text">Problématique :</strong> Comment la technologie et une consommation responsable peuvent-elles aider à lutter contre le changement climatique ?
          </p>
          <p className="font-body text-base leading-[1.8] text-muted">
            Explore five immersive halls — from the Climate Crisis to Green Tech Innovation — and discover how individual and collective action can shape a sustainable future for our planet.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
            {[
              { number: '2', label: 'SDGs Covered (12 & 13)' },
              { number: '5', label: 'Interactive Halls' },
              { number: '1', label: 'Planet to Protect' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl text-accent mb-1">{s.number}</p>
                <p className="font-body text-xs text-muted leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
