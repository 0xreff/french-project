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
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-6">Our Mission</p>
          <h2 className="font-display text-[clamp(2.5rem,5.5vw,6.5rem)] leading-[1.05] font-light tracking-tight">
            Art is not<br />
            displayed —<br />
            it is{' '}
            <span className="font-semibold text-accent" style={{ WebkitTextStroke: '0.6px rgba(201,169,110,0.6)' }}>revealed.</span>
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
            Founded in 1923 within the restored walls of a 19th-century beylical palace, GreenMind Museum has spent a century cultivating one of North Africa&apos;s most distinguished permanent collections — spanning classical Tunisian oil painting, Islamic geometric art, Berber textile traditions, and the most significant contemporary commissions on the continent.
          </p>
          <p className="font-body text-base leading-[1.8] text-muted">
            We do not merely preserve. We contextualise, interrogate, and celebrate — placing each work in dialogue with the living culture that produced it, and the ever-changing world that inherits it.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
            {[
              { number: '4,200+', label: 'Works in collection' },
              { number: '100 yr',  label: 'Of continuous curation' },
              { number: '62',      label: 'Artists represented' },
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
