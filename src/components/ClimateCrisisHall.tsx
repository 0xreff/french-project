'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

const HERO_STATS = [
  { value: '+1,55°C', label: 'Hausse record en 2024', sub: 'Par rapport aux niveaux préindustriels' },
  { value: '57,1 Gt', label: 'CO₂ émis en 2023', sub: 'Un nouveau record mondial' },
  { value: '3,1°C',   label: 'Réchauffement prévu', sub: 'Si les politiques actuelles persistent' },
]

const INFO_CARDS = [
  {
    icon: '🌊',
    title: 'Océans en danger',
    text: 'Les océans absorbent plus de 90 % de la chaleur piégée par les gaz à effet de serre. En 2025, le contenu thermique des océans a atteint des niveaux records, menaçant les écosystèmes marins.',
    source: 'NASA / Copernicus',
  },
  {
    icon: '🔥',
    title: '11 années les plus chaudes',
    text: 'Les années 2015–2025 sont les onze plus chaudes jamais enregistrées. Le rythme du réchauffement est sans précédent : 0,27°C par décennie au cours des 10 dernières années.',
    source: 'OMM / Copernicus',
  },
  {
    icon: '📉',
    title: 'Réduction de 7,5 % par an',
    text: 'Pour limiter le réchauffement à 1,5°C, les émissions mondiales doivent baisser de 7,5 % chaque année jusqu\'en 2035. Les plans nationaux actuels sont loin d\'être suffisants.',
    source: 'PNUE — Rapport sur l\'écart des émissions',
  },
  {
    icon: '❄️',
    title: 'La glace disparaît',
    text: 'La banquise arctique est proche de ses niveaux les plus bas. La banquise antarctique a atteint son troisième niveau le plus bas jamais enregistré. Les glaciers reculent à un rythme alarmant.',
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
        Source : {card.source}
      </p>
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-[0.04] pointer-events-none"
           style={{ background: 'radial-gradient(circle, #ff6b35 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-4">Salle 02 — Crise Climatique</p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,6rem)] font-light leading-[1.05] tracking-tight mb-6">
            La Planète<br />
            <span className="font-semibold" style={{ color: '#ff6b35' }}>Nous Parle</span>
          </h2>
          <p className="font-body text-base text-muted max-w-2xl mx-auto leading-relaxed">
            L&apos;ODD 13 appelle à une action urgente pour lutter contre le changement climatique et ses impacts.
            Les données sont claires — et la fenêtre d&apos;action se referme rapidement.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          {HERO_STATS.map((stat, i) => (
            <AnimatedCounter key={stat.value} {...stat} delay={i * 0.15} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative w-full aspect-[21/9] rounded-sm overflow-hidden mb-24 shadow-2xl"
        >
          <Image src="/museum/earth-split.png" alt="Terre divisée — verdoyante vs aride" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-2">Notre Choix</p>
            <p className="font-display text-2xl md:text-4xl font-light text-text">
              Deux avenirs. <span className="font-semibold text-accent">Une seule décision.</span>
            </p>
          </div>
        </motion.div>

        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-3">Regarder</p>
            <h3 className="font-display text-3xl font-light">Le Changement Climatique en Bref</h3>
            <p className="font-body text-sm text-muted mt-2">Par Bill Nye × National Geographic</p>
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
              title="Le Changement Climatique 101 — Bill Nye × National Geographic"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INFO_CARDS.map((card, i) => (
            <InfoCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
