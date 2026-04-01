'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Climate', href: '#climate' },
  { label: 'Consumption', href: '#consumption' },
  { label: 'Innovation', href: '#innovation' },
  { label: 'Act Now', href: '#actnow' },
]

/* Soft glassy shadow — readable on both light and dark frames */
const NAV_SHADOW = '0 1px 3px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.22)'

export default function Navbar() {
  const { scrollY } = useScroll()

  /*
    At top    : fully transparent — the canvas gradient handles legibility
    On scroll : glassmorphism (frosted glass) — NOT solid black
  */
  const bgOpacity   = useTransform(scrollY, [0, 80], [0, 1])

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between"
    >
      {/* Glassmorphism panel — sits behind content, animated opacity */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: bgOpacity,
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          background: 'rgba(10, 10, 8, 0.35)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      />

      {/* Logo */}
      <Link
        href="/"
        className="relative font-display text-xl tracking-widest2 uppercase z-10"
        style={{
          color: '#c9a96e',
          textShadow: NAV_SHADOW,
        }}
      >
        GreenMind
      </Link>

      {/* Nav links */}
      <nav className="relative hidden md:flex gap-10 z-10">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="font-body text-xs tracking-widest3 uppercase transition-colors duration-300"
            style={{
              color: 'rgba(255,255,255,0.88)',
              textShadow: NAV_SHADOW,
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* CTA */}
      <Link
        href="#visit"
        className="relative hidden md:inline-flex items-center gap-2 text-xs tracking-widest2 uppercase px-5 py-2.5 transition-all duration-300 z-10"
        style={{
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          background: 'rgba(255,255,255,0.06)',
          textShadow: NAV_SHADOW,
        }}
      >
        Book a Visit
      </Link>
    </motion.header>
  )
}
