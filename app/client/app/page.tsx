import Header from "./components/Header"
import HeroSection from "./components/HeroSection"
import HowItWorksSection from "./components/HowItWorksSection"
import BenefitsSection from "./components/BenefitsSection"
import AboutSection from "./components/AboutSection"
import TechSection from "./components/TechSection"
import CTASection from "./components/CTASection"
import Footer from "./components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <BenefitsSection />
        <AboutSection />
        <TechSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
