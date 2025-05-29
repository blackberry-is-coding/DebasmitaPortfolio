"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Mail, Phone, Linkedin, Github, Globe } from "lucide-react"

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // We don't need the old intersection observer anymore since we're using our new animation system
  useEffect(() => {
    // Just set visible state for backward compatibility
    setIsVisible(true)
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-4">
        <h2
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
          data-animate
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">About Me</span>
        </h2>

        <div
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-purple-500/30 shadow-xl"
          data-animate
          data-animate-delay="100"
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <p 
                className="text-gray-300 mb-6"
                data-animate
                data-animate-delay="200"
                data-animate-direction="right"
              >
                I'm a Digital Marketing Specialist with a strong foundation in SEO, SMO, and email marketing, 
                content strategy, and social media, focused on increasing web traffic and improving keyword rankings, with a background in Botany.
              </p>  
              <p 
                className="text-gray-300"
                data-animate
                data-animate-delay="300"
                data-animate-direction="right"
              >
                Skilled in front-end development with a focus on UI/UX design, using HTML, CSS, JavaScript, React, and Figma to create responsive,
                user-friendly websites, and leveraging generative AI tools for content and design enhancement.
              </p>
            </div>

            <div className="md:w-1/3 space-y-4">
              <div 
                className="flex items-center"
                data-animate
                data-animate-delay="200"
                data-animate-direction="left"
              >
                <MapPin className="h-5 w-5 text-purple-400 mr-3" />
                <span className="text-gray-300">Dhenkanal, Odisha 759001</span>
              </div>
              <div 
                className="flex items-center"
                data-animate
                data-animate-delay="250"
                data-animate-direction="left"
              >
                <Mail className="h-5 w-5 text-purple-400 mr-3" />
                <a
                  href="mailto:debasmitabehera0509@gmail.com"
                  className="text-gray-300 hover:text-purple-400 transition-colors"
                >
                  debasmitabehera0509@gmail.com
                </a>
              </div>
              <div 
                className="flex items-center"
                data-animate
                data-animate-delay="300"
                data-animate-direction="left"
              >
                <Phone className="h-5 w-5 text-purple-400 mr-3" />
                <a href="#contact" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Contact Me
                </a>
              </div>
              <div 
                className="flex items-center"
                data-animate
                data-animate-delay="350"
                data-animate-direction="left"
              >
                <Linkedin className="h-5 w-5 text-purple-400 mr-3" />
                <a href="https://www.linkedin.com/in/debasmita-behera-19a168362/" className="text-gray-300 hover:text-purple-400 transition-colors">
                  LinkedIn
                </a>
              </div>
              <div 
                className="flex items-center"
                data-animate
                data-animate-delay="400"
                data-animate-direction="left"
              >
                <Github className="h-5 w-5 text-purple-400 mr-3" />
                <a href="https://github.com/blackberry-is-coding" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Github
                </a>
              </div>
              <div 
                className="flex items-center"
                data-animate
                data-animate-delay="450"
                data-animate-direction="left"
              >
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
