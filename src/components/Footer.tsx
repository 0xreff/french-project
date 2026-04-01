export default function Footer() {
  return (
    <footer id="visit" className="bg-surface border-t border-border py-20 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <p className="font-display text-2xl tracking-widest2 text-accent uppercase mb-4">GreenMind</p>
          <p className="font-body text-sm text-muted leading-relaxed max-w-xs mb-4">
            A virtual eco-technological museum dedicated to educating and inspiring action against climate change — built around SDG 12 & SDG 13.
          </p>
          <p className="font-body text-xs text-muted italic">
            &ldquo;Comment la technologie et une consommation responsable peuvent-elles aider à lutter contre le changement climatique ?&rdquo;
          </p>
        </div>

        {/* Museum Halls */}
        <div>
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-5">Museum Halls</p>
          <ul className="space-y-2 font-body text-sm text-muted">
            {[
              { label: 'Home & Mission', href: '#about' },
              { label: 'Climate Crisis Hall', href: '#climate' },
              { label: 'Consumption Lab', href: '#consumption' },
              { label: 'Innovation Gallery', href: '#innovation' },
              { label: 'Act Now Zone', href: '#actnow' },
            ].map((l) => (
              <li key={l.label}>
                <a href={l.href} className="hover:text-text transition-colors duration-200">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* SDG & Sources */}
        <div>
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-5">Sources & SDGs</p>
          <ul className="space-y-2 font-body text-sm text-muted">
            {[
              { label: 'UN SDG 12', href: 'https://sdgs.un.org/goals/goal12' },
              { label: 'UN SDG 13', href: 'https://sdgs.un.org/goals/goal13' },
              { label: 'NASA Climate', href: 'https://climate.nasa.gov' },
              { label: 'UNEP Reports', href: 'https://www.unep.org' },
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

      {/* Team */}
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
          <p className="font-body text-xs text-muted">© 2025 GreenMind Museum — SDG 12 & SDG 13</p>
          <p className="font-body text-xs text-muted">Designed with intention — Built with care</p>
        </div>
      </div>
    </footer>
  )
}
