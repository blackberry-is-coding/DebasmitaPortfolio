"use client"

import { useState, useEffect, useRef } from "react"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import EducationSection from "@/components/education-section"
import SkillsSection from "@/components/skills-section"
import ExperienceSection from "@/components/experience-section"
import ProjectsSection from "@/components/projects-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import SakuraAnimation from "@/components/sakura-animation"
import MobileNav from "@/components/mobile-nav"
import { Menu } from "lucide-react"
import { initSmoothScrolling } from "@/utils/smoothScroll"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Initialize smooth scrolling and reveal animations
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return
    
    // Import the smooth reveal utility
    import('@/utils/smoothReveal').then(({ initSmoothReveal }) => {
      // Initialize smooth scrolling with header offset
      initSmoothScrolling(60)
      
      // Initialize smooth reveal animations with a small delay to ensure DOM is ready
      setTimeout(() => {
        initSmoothReveal('[data-animate]', {
          duration: window.innerWidth <= 768 ? 600 : 800,
          distance: window.innerWidth <= 768 ? '20px' : '30px',
        })
      }, 100)
    })
    
    const handleScroll = () => {
      // Update header appearance
      setScrolled(window.scrollY > 10)
      
      // Track scrolling state for animation optimization
      if (!isScrolling) {
        setIsScrolling(true)
        document.documentElement.classList.add('is-scrolling')
      }
      
      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      // Set timeout to detect when scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
        document.documentElement.classList.remove('is-scrolling')
      }, 150)
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [isScrolling])

  return (
    <div 
      className="min-h-screen text-white relative hardware-accelerated"
      style={{
        backgroundColor: 'rgb(var(--background-start-rgb))',
        backgroundImage: isScrolling && window.innerWidth <= 768 
          ? 'none' 
          : 'linear-gradient(to bottom, rgb(var(--background-start-rgb)), rgb(17, 24, 39, 1), rgb(88, 28, 135, 0.8), rgb(17, 24, 39, 1))'
      }}
    >
      {/* Pass isScrolling state to SakuraAnimation to optimize during scroll */}
      <SakuraAnimation isScrolling={isScrolling} />
      
      <header 
        className={`fixed top-0 left-0 right-0 z-50 hardware-accelerated ${
          scrolled 
            ? "bg-gray-950/90 shadow-lg shadow-purple-900/10" 
            : "bg-transparent"
        }`}
        style={{ 
          backdropFilter: isScrolling ? 'none' : 'blur(8px)',
          transitionProperty: 'none',
        }}
      >
        <nav className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            dsmita<span className="text-purple-400">.pro</span>
          </div>
          <div className="hidden md:flex space-x-6">
            {["Home", "About", "Education", "Skills", "Experience", "Projects", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <button 
            className="md:hidden text-white p-2 rounded-full hover:bg-gray-800/50 active:bg-gray-800/70 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </header>

      {/* Mobile Navigation */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="overflow-hidden hardware-accelerated">
        <HeroSection />
        <AboutSection />
        <EducationSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}
