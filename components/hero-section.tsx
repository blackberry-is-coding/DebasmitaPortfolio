"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [displayText, setDisplayText] = useState("Blackberry")

  useEffect(() => {
    setIsVisible(true)

    // Text animation interval
    const interval = setInterval(() => {
      setDisplayText((current) => (current === "Blackberry" ? "dsmita.pro" : "Blackberry"))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="home" className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 right-10 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-pink-600 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 z-10 text-center max-w-3xl">
        <div
          className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white neon-text">Debasmita Behera</h1>
          <h2 className="text-2xl md:text-3xl text-purple-300 mb-6 animated-text">{displayText}</h2>
          <p className="text-gray-300 text-lg mb-8 mx-auto">
            Passionate about SEO, SMO, and digital marketing strategies that drive results. Turning data into actionable
            insights and brands into digital success stories.
          </p>
          <div className="flex space-x-4 justify-center">
            <a
              href="#projects"
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-medium hover:opacity-90 transition-opacity flex items-center"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              View Projects
            </a>
            <a
              href="#experience"
              className="px-6 py-3 border border-purple-500 rounded-full text-purple-300 font-medium hover:bg-purple-900/30 transition-colors"
            >
              View Experience
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
