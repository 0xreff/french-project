'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

const INNOVATIONS = [
  {
    icon: '🌞',
    title: 'Cellules solaires pérovskite',
    description: 'En superposant des matériaux pérovskite au silicium traditionnel, ces panneaux de nouvelle génération dépassent 30 % d\'efficacité — au-delà des limites du silicium. Flexibles, légers et moins chers à produire à grande échelle.',
    stat: '30 %+ d\'efficacité',
    image: '/museum/solar-panels.png',
    color: '#f7c948',
  },
  {
    icon: '🌱',
    title: 'Agriculture verticale',
    description: 'Les fermes intérieures contrôlées par IA utilisent 95 % d\'eau en moins que l\'agriculture conventionnelle. Des spectres LED personnalisés optimisent chaque phase de croissance tandis que des systèmes robotiques permettent une récolte 24h/24.',
    stat: '95 % d\'eau en moins',
    image: '/museum/vertical-farm.png',
    color: '#4ecdc4',
  },
  {
    icon: '💨',
    title: 'Capture directe de l\'air',
    description: 'Des installations comme l\'usine Stratos au Texas utilisent de gigantesques ventilateurs pour extraire le CO₂ directement de l\'atmosphère. De nouveaux matériaux MOF rendent le processus bien plus efficace.',
    stat: 'Élimine le CO₂ de l\'air',
    image: '/museum/carbon-capture.png',
    color: '#7c9bff',
  },
  {
    icon: '🔋',
    title: 'Batteries à l\'état solide',
    description: 'Le remplacement des électrolytes liquides par des matériaux solides double la densité énergétique, permet une charge en minutes et élimine le risque d\'incendie. La clé pour démocratiser les véhicules électriques d\'ici 2030.',
    stat: '2× la densité énergétique',
    image: '/museum/green-city.png',
    color: '#ff6b9d',
  },
  {
    icon: '🏗️',
    title: 'Minéralisation du carbone',
    description: 'Le CO₂ capturé est transformé en matériaux solides stables comme le calcaire synthétique, puis utilisé dans la construction. Le carbone est littéralement emprisonné dans les bâtiments — retiré définitivement de l\'atmosphère.',
    stat: 'CO₂ → matériau de construction',
    image: '/museum/carbon-capture.png',
    color: '#a78bfa',
  },
  {
    icon: '🪟',
    title: 'Fenêtres solaires (BIPV)',
    description: 'Le verre photovoltaïque transparent produit de l\'électricité tout en laissant passer la lumière. Des façades entières de gratte-ciels deviennent des centrales électriques — sans terrain supplémentaire nécessaire.',
    stat: 'Fenêtres = centrales',
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
      <div className={`relative aspect-[4/3] md:aspect-auto overflow-hidden ${isEven ? '' : 'md:order-2'}`}>
        <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/30 to-transparent" />
      </div>
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
      <div className="absolute top-0 left-0 w-[600px] h-[600px] opacity-[0.03] pointer-events-none"
           style={{ background: 'radial-gradient(circle, #4ecdc4 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-4">Salle 04 — Galerie d&apos;Innovation</p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,6rem)] font-light leading-[1.05] tracking-tight mb-6">
            La technologie qui<br />
            <span className="font-semibold" style={{ color: '#4ecdc4' }}>guérit la planète</span>
          </h2>
          <p className="font-body text-base text-muted max-w-2xl mx-auto leading-relaxed">
            Des cellules solaires plus fines qu&apos;une feuille de papier aux fermes qui cultivent en intérieur — ces innovations
            prouvent qu&apos;un avenir durable n&apos;est pas de la science-fiction. Il se construit maintenant.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative w-full aspect-[21/9] rounded-sm overflow-hidden mb-24 shadow-2xl"
        >
          <Image src="/museum/green-city.png" alt="Ville durable du futur" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-2">Vision</p>
            <p className="font-display text-2xl md:text-4xl font-light text-text">
              Les villes de <span className="font-semibold text-accent">demain.</span>
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col gap-10">
          {INNOVATIONS.map((item, i) => (
            <InnovationCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
