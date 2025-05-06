"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Mail, Phone, Linkedin, Github, Globe } from "lucide-react"

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-4">
        <h2
          className={`text-3xl md:text-4xl font-bold mb-12 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">About Me</span>
        </h2>

        <div
          className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-purple-500/30 shadow-xl transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <p className="text-gray-300 mb-6">
                I'm a Digital Marketing Specialist with a strong foundation in SEO, SMO, and email marketing, 
                content strategy, and social media, focused on increasing web traffic and improving keyword rankings, with a background in Botany.
                </p>  
              <p className="text-gray-300">
                My approach combines data-driven insights with creative problem-solving to boost brand visibility and
                engagement. I'm passionate about optimizing digital presence and delivering measurable results.
              </p>
            </div>

            <div className="md:w-1/3 space-y-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-purple-400 mr-3" />
                <span className="text-gray-300">Dhenkanal, Odisha 759001</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-purple-400 mr-3" />
                <a
                  href="mailto:debasmitabehera0509@gmail.com"
                  className="text-gray-300 hover:text-purple-400 transition-colors"
                >
                  debasmitabehera0509@gmail.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-purple-400 mr-3" />
                <a href="#contact" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Contact Me
                </a>
              </div>
              <div className="flex items-center">
                <Linkedin className="h-5 w-5 text-purple-400 mr-3" />
                <a href="https://www.linkedin.com/in/debasmita-behera-19a168362/" className="text-gray-300 hover:text-purple-400 transition-colors">
                  LinkedIn
                </a>
              </div>
              <div className="flex items-center">
                <Github className="h-5 w-5 text-purple-400 mr-3" />
                <a href="https://github.com/blackberry-is-coding" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Github
                </a>
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-purple-400 mr-3" />
                <a href="https://dsmita.pro" className="text-gray-300 hover:text-purple-400 transition-colors">
                  dsmita.pro
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
