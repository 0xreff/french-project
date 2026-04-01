export default function Footer() {
  return (
    <footer id="visit" className="bg-surface border-t border-border py-20 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Marque */}
        <div className="md:col-span-2">
          <p className="font-display text-2xl tracking-widest2 text-accent uppercase mb-4">GreenMind</p>
          <p className="font-body text-sm text-muted leading-relaxed max-w-xs mb-4">
            Un musée virtuel écotechnologique dédié à l&apos;éducation et à l&apos;action contre le changement climatique — construit autour de l&apos;ODD 12 & l&apos;ODD 13.
          </p>
          <p className="font-body text-xs text-muted italic">
            &laquo; Comment la technologie et une consommation responsable peuvent-elles aider à lutter contre le changement climatique ? &raquo;
          </p>
        </div>

        {/* Salles du musée */}
        <div>
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-5">Salles du musée</p>
          <ul className="space-y-2 font-body text-sm text-muted">
            {[
              { label: 'Accueil & Mission', href: '#about' },
              { label: 'Crise Climatique', href: '#climate' },
              { label: 'Labo Consommation', href: '#consumption' },
              { label: 'Galerie d\'Innovation', href: '#innovation' },
              { label: 'Zone d\'Action', href: '#actnow' },
            ].map((l) => (
              <li key={l.label}>
                <a href={l.href} className="hover:text-text transition-colors duration-200">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sources & ODD */}
        <div>
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-5">Sources & ODD</p>
          <ul className="space-y-2 font-body text-sm text-muted">
            {[
              { label: 'ODD 12 — ONU', href: 'https://sdgs.un.org/goals/goal12' },
              { label: 'ODD 13 — ONU', href: 'https://sdgs.un.org/goals/goal13' },
              { label: 'NASA Climat', href: 'https://climate.nasa.gov' },
              { label: 'Rapports PNUE', href: 'https://www.unep.org' },
              { label: 'Our World in Data', href: 'https://ourworldindata.org' },
            ].map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-text transition-colors duration-200">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Équipe */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border">
        <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-4">Groupe GreenMind — Terminale</p>
        <div className="flex flex-wrap gap-x-8 gap-y-2 font-body text-sm text-muted mb-8">
          <span>Asser Ben Belgacem</span>
          <span>Rayen Benour</span>
          <span>Mohamed Dhia Brahmia</span>
          <span>Ayouba Djida Adams</span>
          <span>Malek Bargougui</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-muted">© 2025 Musée GreenMind — ODD 12 & ODD 13</p>
          <p className="font-body text-xs text-muted">Conçu avec intention — Construit avec soin</p>
        </div>
      </div>
    </footer>
  )
}
