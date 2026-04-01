'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

const INNOVATIONS = [
  {
    icon: '🌞',
    title: 'Perovskite Solar Cells',
    description: 'By layering perovskite materials over traditional silicon, these next-gen panels push efficiency beyond 30% — exceeding silicon limits. Flexible, lightweight, and cheaper to produce at scale.',
    stat: '30%+ efficiency',
    image: '/museum/solar-panels.png',
    color: '#f7c948',
  },
  {
    icon: '🌱',
    title: 'Vertical Farming',
    description: 'AI-controlled indoor farms use 95% less water than conventional agriculture. Custom LED spectrums optimize each crop\'s growth phase while robotic systems enable 24/7 zero-waste harvesting.',
    stat: '95% less water',
    image: '/museum/vertical-farm.png',
    color: '#4ecdc4',
  },
  {
    icon: '💨',
    title: 'Direct Air Capture',
    description: 'Facilities like the Stratos plant in Texas use massive fan arrays to pull CO₂ directly from the atmosphere. New metal-organic framework (MOF) materials make the process dramatically more efficient.',
    stat: 'Removes CO₂ from air',
    image: '/museum/carbon-capture.png',
    color: '#7c9bff',
  },
  {
    icon: '🔋',
    title: 'Solid-State Batteries',
    description: 'Replacing liquid electrolytes with solid materials doubles energy density, charges in minutes, and eliminates fire risk. The key to making electric vehicles truly mainstream by 2030.',
    stat: '2× energy density',
    image: '/museum/green-city.png',
    color: '#ff6b9d',
  },
  {
    icon: '🏗️',
    title: 'Carbon Mineralization',
    description: 'Captured CO₂ is transformed into stable solid materials like synthetic limestone, then used in construction. Carbon is literally locked into buildings — permanently removed from the atmosphere.',
    stat: 'CO₂ → building material',
    image: '/museum/carbon-capture.png',
    color: '#a78bfa',
  },
  {
    icon: '🪟',
    title: 'Solar Windows (BIPV)',
    description: 'Transparent photovoltaic glass generates electricity while letting light pass through. Entire skyscraper facades become power plants — no extra land needed, seamlessly integrated into architecture.',
    stat: 'Windows = power plants',
    image: '/museum/solar-panels.png',
    color: '#34d399',
  },
]

function InnovationCard({ item, index }: { item: typeof INNOVATIONS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, x: isEven ? -30 : 30 }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative grid grid-cols-1 md:grid-cols-2 gap-0 bg-surface border border-border rounded-sm overflow-hidden hover:border-accent/30 transition-all duration-500"
    >
      {/* Image */}
      <div className={`relative aspect-[4/3] md:aspect-auto overflow-hidden ${isEven ? '' : 'md:order-2'}`}>
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/30 to-transparent" />
      </div>

      {/* Content */}
      <div className={`flex flex-col justify-center p-10 md:p-14 ${isEven ? '' : 'md:order-1'}`}>
        <span className="text-4xl mb-5 block">{item.icon}</span>
        <h3 className="font-display text-2xl md:text-3xl font-semibold mb-4 text-text">{item.title}</h3>
        <p className="font-body text-sm text-muted leading-relaxed mb-6">{item.description}</p>
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-sm w-fit"
             style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}30` }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="font-body text-xs font-medium tracking-widest2 uppercase" style={{ color: item.color }}>
            {item.stat}
          </span>
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
           style={{ background: `radial-gradient(circle at center, ${item.color}06 0%, transparent 70%)` }} />
    </motion.div>
  )
}

export default function InnovationGallery() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="innovation" ref={sectionRef} className="relative bg-bg py-32 px-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] opacity-[0.03] pointer-events-none"
           style={{ background: 'radial-gradient(circle, #4ecdc4 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-4">Hall 04 — Innovation Gallery</p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,6rem)] font-light leading-[1.05] tracking-tight mb-6">
            Technology That<br />
            <span className="font-semibold" style={{ color: '#4ecdc4' }}>Heals the Planet</span>
          </h2>
          <p className="font-body text-base text-muted max-w-2xl mx-auto leading-relaxed">
            From solar cells thinner than paper to farms that grow food indoors — these innovations
            prove that a sustainable future isn&apos;t science fiction. It&apos;s being built right now.
          </p>
        </motion.div>

        {/* Green city hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative w-full aspect-[21/9] rounded-sm overflow-hidden mb-24 shadow-2xl"
        >
          <Image src="/museum/green-city.png" alt="Sustainable futuristic city" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-2">Vision</p>
            <p className="font-display text-2xl md:text-4xl font-light text-text">
              The cities of <span className="font-semibold text-accent">tomorrow.</span>
            </p>
          </div>
        </motion.div>

        {/* Innovation cards */}
        <div className="flex flex-col gap-10">
          {INNOVATIONS.map((item, i) => (
            <InnovationCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
