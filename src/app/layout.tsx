import type { Metadata } from 'next'
import { Inter, Caveat } from 'next/font/google'
import './globals.css'
import LenisProvider from '@/components/LenisProvider'

/* ── Inter — the closest open-source match to Apple SF Pro ── */
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

/* ── Caveat — chalkboard / handwriting feel for Salle 05 ── */
const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-caveat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Musée GreenMind — Musée Virtuel Écotechnologique ODD 12 & 13',
  description:
    "Un musée virtuel écotechnologique explorant la consommation responsable (ODD 12) et l'action climatique (ODD 13). Découvrez des données climatiques vérifiées, des innovations vertes et passez à l'action.",
  openGraph: {
    title: 'Musée GreenMind — Éduquer et inspirer à agir contre le changement climatique',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${caveat.variable}`}>
      <body className="bg-bg text-text overflow-x-hidden">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
