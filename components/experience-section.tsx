"use client"

import { useEffect, useRef, useState } from "react"
import { Briefcase, Calendar, CheckCircle } from "lucide-react"

const experienceData = [
  {
    company: "Hemprava Softsonic",
    location: "Bhubaneswar",
    position: "Digital Marketing Intern",
    period: "Jan 2025 - Jun 2025",
    responsibilities: [
      "Executed on-page SEO strategies including content optimization, meta tags improvement, keyword targeting, and internal linking to boost organic search visibility.",
      "Carried out off-page optimization efforts by building high-quality backlinks, contributing to an increase in website domain authority.",
      "Managed social media optimization (SMO) campaigns to strengthen brand presence and engagement across major platforms.",
      "Assisted in planning and executing targeted email marketing campaigns, helping to improve open and click-through rates.",
      "Monitored performance metrics and supported reporting using SEO and analytics tools to guide ongoing digital strategy.",
    ],
  },
]

export default function ExperienceSection() {
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
    <section id="experience" ref={sectionRef} className="py-20 relative bg-gray-900/50">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 right-10 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2
          className={`text-3xl md:text-4xl font-bold mb-12 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
            Professional Experience
          </span>
        </h2>

        <div className="max-w-4xl mx-auto">
          {experienceData.map((exp, index) => (
            <div
              key={index}
              className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-purple-500/30 shadow-xl mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="p-3 bg-purple-900/50 rounded-lg mr-4">
                    <Briefcase className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{exp.position}</h3>
                    <h4 className="text-lg text-purple-300">{exp.company}</h4>
                  </div>
                </div>

                <div className="flex items-center bg-gray-900/50 px-4 py-2 rounded-full">
                  <Calendar className="h-4 w-4 text-purple-400 mr-2" />
                  <span className="text-gray-300">{exp.period}</span>
                </div>
              </div>

              <p className="text-gray-400 mb-6">{exp.location}</p>

              <h5 className="text-white font-medium mb-4">Key Responsibilities:</h5>
              <ul className="space-y-4">
                {exp.responsibilities.map((resp, respIndex) => (
                  <li key={respIndex} className="flex text-gray-300">
                    <CheckCircle className="h-5 w-5 text-purple-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
