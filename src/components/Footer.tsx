export default function Footer() {
  return (
    <footer id="visit" className="bg-bg border-t border-border py-20 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <p className="font-display text-2xl tracking-widest2 text-accent uppercase mb-4">GreenMind</p>
          <p className="font-body text-sm text-muted leading-relaxed max-w-xs">
            A singular space for art, contemplation, and discovery — housed within a century-old palace in the heart of Tunis.
          </p>
        </div>

        {/* Visit */}
        <div>
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-5">Visit</p>
          <ul className="space-y-2 font-body text-sm text-muted">
            <li>Avenue Habib Bourguiba</li>
            <li>Tunis, 1001 — Tunisia</li>
            <li className="pt-2">Tue–Sun: 09:00–18:00</li>
            <li>Closed Mondays</li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <p className="font-body text-xs tracking-widest3 uppercase text-accent mb-5">Explore</p>
          <ul className="space-y-2 font-body text-sm text-muted">
            {['Collection', 'Exhibitions', 'Events', 'Education', 'Press', 'Shop'].map((l) => (
              <li key={l}>
                <a href="#" className="hover:text-text transition-colors duration-200">{l}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="font-body text-xs text-muted">© 2025 GreenMind Museum. All rights reserved.</p>
        <p className="font-body text-xs text-muted">Designed with intention — Built with care</p>
      </div>
    </footer>
  )
}
