import Navbar             from '@/components/Navbar'
import HeroScroll         from '@/components/HeroScroll'
import AboutSection       from '@/components/AboutSection'
import ClimateCrisisHall  from '@/components/ClimateCrisisHall'
import ConsumptionLab     from '@/components/ConsumptionLab'
import InnovationGallery  from '@/components/InnovationGallery'
import ActNowZone         from '@/components/ActNowZone'
import Footer             from '@/components/Footer'

export default function HomePage() {
  return (
    <main>
      <div className="hidden" aria-hidden="true" data-version="prod-final-fixed" />
      <Navbar />
      <HeroScroll />
      <AboutSection />
      <ClimateCrisisHall />
      <ConsumptionLab />
      <InnovationGallery />
      <ActNowZone />
      <Footer />
    </main>
  )
}
