'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MUSEUM_ITEMS } from '@/lib/museumData'
import Image from 'next/image'

export default function MuseumGallery() {
  return (
    <section id="collection" className="bg-gallery py-32 px-8">
      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-body text-xs tracking-widest3 uppercase mb-4"
          style={{ color: 'var(--color-accent-2)' }}
        >
          Permanent Collection
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="font-display text-[clamp(2.2rem,5.5vw,5.5rem)] leading-[1.05] font-light max-w-2xl tracking-tight"
          style={{ color: 'var(--color-gallery-text)' }}
        >
          A Century of<br />
          <span className="font-semibold" style={{ WebkitTextStroke: '0.6px rgba(26,26,24,0.35)' }}>Masterworks</span>
        </motion.h2>
      </div>

      {/* Artwork grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {MUSEUM_ITEMS.map((item, i) => (
          <ArtworkCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}

function ArtworkCard({ item, index }: { item: (typeof MUSEUM_ITEMS)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 3) * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
      className="group"
      aria-label={`${item.title}, ${item.year}`}
    >
      {/* Frame */}
      <div
        className="relative overflow-hidden border-8 mb-6"
        style={{ borderColor: '#b8a98a', boxShadow: '0 20px 60px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.15)' }}
      >
        {/* Image */}
        <div className="aspect-[4/3] relative overflow-hidden">
          {item.imageSrc ? (
            <Image
              src={item.imageSrc}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-900/30 to-amber-700/10 transition-transform duration-700 group-hover:scale-105" />
          )}
        </div>

        {/* Gold inner frame line */}
        <div className="absolute inset-2 border border-accent/30 pointer-events-none z-10" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 z-10" />
      </div>

      {/* Text */}
      <div>
        <p className="font-body text-xs tracking-widest2 uppercase mb-1"
           style={{ color: 'var(--color-accent-2)' }}>
          {item.halfTitle}
        </p>
        <h3 className="font-display text-2xl font-light mb-3 leading-snug"
            style={{ color: 'var(--color-gallery-text)' }}>
          {item.title}
        </h3>
        <p className="font-body text-sm leading-relaxed"
           style={{ color: 'rgba(26,26,24,0.65)', maxWidth: '38ch' }}>
          {item.paragraph}
        </p>

        {/* Year & medium */}
        <div className="flex items-center gap-4 mt-4">
          <span className="font-body text-xs" style={{ color: 'var(--color-muted)' }}>
            {item.year}
          </span>
          <span className="w-4 h-px" style={{ background: 'var(--color-accent-2)' }} />
          <span className="font-body text-xs" style={{ color: 'var(--color-muted)' }}>
            {item.medium}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
