import Navbar           from '@/components/Navbar'
import HeroScroll       from '@/components/HeroScroll'
import AboutSection     from '@/components/AboutSection'
import CollectionTeaser from '@/components/CollectionTeaser'
import Footer           from '@/components/Footer'

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroScroll />
      <AboutSection />
      <CollectionTeaser />
      <Footer />
    </main>
  )
}
