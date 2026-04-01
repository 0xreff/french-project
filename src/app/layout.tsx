import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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

export const metadata: Metadata = {
  title: 'GreenMind Museum — SDG 12 & 13 Virtual Eco-Museum',
  description:
    'A virtual eco-technological museum exploring responsible consumption (SDG 12) and climate action (SDG 13). Discover verified climate data, green innovations, and take action.',
  openGraph: {
    title: 'GreenMind Museum — Éduquer et inspirer à agir contre le changement climatique',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-bg text-text overflow-x-hidden">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
