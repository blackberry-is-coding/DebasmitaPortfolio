"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [displayText, setDisplayText] = useState("Blackberry")

  useEffect(() => {
    // Set visible immediately to work with our animation system
    setIsVisible(true)

    // Text animation interval
    const interval = setInterval(() => {
      setDisplayText((current) => (current === "Blackberry" ? "dsmita.pro" : "Blackberry"))
    }, 5000)
    
    // Add animation classes to hero section elements
    const animateElements = () => {
      const elements = document.querySelectorAll('[data-animate]')
      elements.forEach((element) => {
        // Force immediate animation for hero section
        if (element.closest('#home')) {
          element.classList.add('has-animated')
        }
      })
    }
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(animateElements, 100)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [])

  return (
    <section 
      id="home" 
      className="min-h-screen pt-16 md:pt-20 flex items-center justify-center relative overflow-hidden"
    >
      {/* Background gradient blobs - optimized for mobile */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute top-20 right-5 md:right-10 w-48 h-48 md:w-64 md:h-64 bg-purple-600 
                    rounded-full filter blur-3xl opacity-20 animate-pulse will-change-transform"
          style={{ animationDuration: '3s' }}
        ></div>
        <div 
          className="absolute bottom-20 left-5 md:left-10 w-56 h-56 md:w-72 md:h-72 bg-pink-600 
                    rounded-full filter blur-3xl opacity-20 animate-pulse will-change-transform"
          style={{ animationDuration: '4s', animationDelay: '1s' }}
        ></div>
      </div>

      <div className="container mx-auto px-4 z-10 text-center max-w-3xl">
        <div className="space-y-4 md:space-y-6">
          <h1 
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-3 md:mb-4 text-white neon-text leading-tight"
            data-animate
            data-animate-direction="down"
          >
            Debasmita Behera
          </h1>
          <h2 
            className="text-xl sm:text-2xl md:text-3xl text-purple-300 mb-4 md:mb-6 animated-text"
            data-animate
            data-animate-delay="100"
          >
            {displayText}
          </h2>
          <p 
            className="text-gray-300 text-base md:text-lg mb-6 md:mb-8 mx-auto max-w-md md:max-w-2xl"
            data-animate
            data-animate-delay="200"
          >
            Passionate about SEO, SMO, and digital marketing strategies that drive results. Turning data into actionable
            insights and brands into digital success stories.
          </p>
          
          {/* Mobile-optimized buttons with better touch targets */}
          <div 
            className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center items-center"
            data-animate
            data-animate-delay="300"
          >
            <a
              href="#projects"
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 
                      rounded-full text-white font-medium hover:opacity-90 active:opacity-100 
                      transition-opacity flex items-center justify-center select-none"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              View Projects
            </a>
            <a
              href="#experience"
              className="w-full sm:w-auto px-6 py-3.5 border border-purple-500 rounded-full 
                      text-purple-300 font-medium hover:bg-purple-900/30 active:bg-purple-900/50 
                      transition-colors select-none"
            >
              View Experience
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
