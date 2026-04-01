'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

const SHOCK_STATS = [
  { value: '931M', unit: 'tonnes', label: 'Nourriture gaspillée par an', icon: '🗑️' },
  { value: '8,6%', unit: '', label: 'De l\'économie mondiale est circulaire', icon: '♻️' },
  { value: '3', unit: 'planètes', label: 'Nécessaires d\'ici 2050 au rythme actuel', icon: '🌍' },
  { value: '7,8 kg', unit: '/pers.', label: 'Déchets électroniques (22 % seulement recyclés)', icon: '📱' },
  { value: '113,6 Md', unit: 'tonnes', label: 'Consommation matérielle intérieure (2022)', icon: '⛏️' },
  { value: '1 100 Md$', unit: '', label: 'Subventions aux combustibles fossiles (2023)', icon: '⛽' },
]

function ShockStat({ stat, index }: { stat: typeof SHOCK_STATS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      className="group bg-white/[0.03] border border-white/[0.06] rounded-sm p-8 text-center hover:bg-white/[0.06] hover:border-accent/30 transition-all duration-500"
    >
      <span className="text-3xl mb-4 block">{stat.icon}</span>
      <p className="font-display text-4xl md:text-5xl font-bold mb-1 text-transparent bg-clip-text"
         style={{ backgroundImage: 'linear-gradient(135deg, #4ecdc4, #44a08d)' }}>
        {stat.value}<span className="text-xl font-light text-muted">{stat.unit}</span>
      </p>
      <p className="font-body text-sm text-muted mt-3 leading-snug">{stat.label}</p>
    </motion.div>
  )
}

export default function ConsumptionLab() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="consumption" ref={sectionRef} className="relative bg-surface py-32 px-8 overflow-hidden">
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] opacity-[0.03] pointer-events-none"
           style={{ background: 'radial-gradient(circle, #4ecdc4 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-4">Salle 03 — Labo Consommation</p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,6rem)] font-light leading-[1.05] tracking-tight mb-6">
            Et si on continuait<br />
            <span className="font-semibold" style={{ color: '#4ecdc4' }}>à consommer ainsi ?</span>
          </h2>
          <p className="font-body text-base text-muted max-w-2xl mx-auto leading-relaxed">
            L&apos;ODD 12 exige une refonte fondamentale de nos modes de production et de consommation.
            Les chiffres sont alarmants — mais le changement est possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {SHOCK_STATS.map((stat, i) => (
            <ShockStat key={stat.value} stat={stat} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative w-full aspect-[21/9] rounded-sm overflow-hidden mb-24 shadow-2xl"
        >
          <Image src="/museum/waste-contrast.png" alt="Gaspillage vs mode de vie durable" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-2">Le Choix</p>
            <p className="font-display text-2xl md:text-4xl font-light text-text">
              Gaspillage ou <span className="font-semibold" style={{ color: '#4ecdc4' }}>sagesse ?</span>
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-bg border border-border rounded-sm p-10"
          >
            <p className="font-body text-[10px] tracking-widest3 uppercase text-accent mb-6">Étude de cas</p>
            <h3 className="font-display text-3xl md:text-4xl font-semibold mb-6 leading-tight">
              &laquo; N&apos;achetez pas<br />cette veste &raquo;
            </h3>
            <p className="font-body text-base text-muted leading-relaxed mb-6">
              En 2011, Patagonia a publié une publicité pleine page dans le New York Times le Black Friday, exhortant les consommateurs à <em>ne pas</em> acheter leur veste. La campagne a mis en lumière le coût environnemental de chaque produit — 135 litres d&apos;eau, 9 kg de CO₂ — et a remis en question la culture de la surconsommation.
            </p>
            <p className="font-body text-base text-muted leading-relaxed mb-6">
              Loin de nuire aux ventes, la campagne a augmenté le chiffre d&apos;affaires de Patagonia de 30 % l&apos;année suivante. Elle a prouvé que la transparence radicale et la durabilité peuvent être <em>rentables</em>.
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <span className="font-display text-2xl text-accent">+30%</span>
              <span className="font-body text-xs text-muted">Hausse du chiffre d&apos;affaires après la campagne</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="font-body text-[10px] tracking-widest3 uppercase text-accent mb-4">Regarder</p>
            <h3 className="font-display text-2xl font-light mb-3">Les Énergies Renouvelables</h3>
            <p className="font-body text-sm text-muted mb-6">National Geographic</p>
            <div className="relative flex-1 min-h-[300px] rounded-sm overflow-hidden shadow-2xl border border-border">
              <iframe
                src="https://www.youtube.com/embed/1kUE0BZtTRc"
                title="Énergies Renouvelables 101 — National Geographic"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
