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
  title: 'GreenMind Museum — Where Art Breathes',
  description:
    'A singular space for art, contemplation, and discovery. GreenMind Museum presents the finest curated collections in a setting of extraordinary beauty.',
  openGraph: {
    title: 'GreenMind Museum',
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
