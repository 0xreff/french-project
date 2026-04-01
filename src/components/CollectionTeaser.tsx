'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CollectionTeaser() {
  return (
    <section className="relative overflow-hidden bg-surface py-40 px-8 text-center">
      {/* Decorative arch SVG */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none">
        <svg width="600" height="400" viewBox="0 0 600 400" fill="none">
          <path d="M60 400 Q60 0 300 0 Q540 0 540 400" stroke="#c9a96e" strokeWidth="1.5" fill="none" />
          <path d="M90 400 Q90 30 300 30 Q510 30 510 400" stroke="#c9a96e" strokeWidth="0.8" fill="none" opacity="0.5" />
        </svg>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-body text-xs tracking-widest3 uppercase text-accent mb-6"
      >
        Explorer davantage
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7 }}
        viewport={{ once: true }}
        className="font-display text-[clamp(2.2rem,5.5vw,6.5rem)] font-light leading-[1.05] tracking-tight mb-12 max-w-3xl mx-auto"
      >
        Le Musée<br />
        <span className="font-semibold text-accent" style={{ WebkitTextStroke: '0.6px rgba(201,169,110,0.6)' }}>vous attend</span>
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link
          href="#climate"
          className="inline-flex items-center justify-center px-10 py-4 bg-accent text-bg font-body text-xs tracking-widest2 uppercase hover:bg-accent-2 transition-colors duration-300"
        >
          Découvrir les salles
        </Link>
        <Link
          href="#visit"
          className="inline-flex items-center justify-center px-10 py-4 border border-border text-text font-body text-xs tracking-widest2 uppercase hover:border-accent hover:text-accent transition-all duration-300"
        >
          Planifier votre visite
        </Link>
      </motion.div>
    </section>
  )
}
