"use client"

import { useEffect, useRef, useState } from "react"
import { Brain, LineChart, Code } from "lucide-react"

const skillCategories = [
  {
    title: "Functional",
    icon: <Brain className="h-6 w-6" />,
    skills: [
      "Strong analytical thinking for interpreting SEO data",
      "Effective verbal and written communication",
      "Problem-solving abilities for visibility issues",
      "Campaign performance analysis",
    ],
  },
  {
    title: "Technical",
    icon: <Code className="h-6 w-6" />,
    skills: ["HTML", "CSS", "JavaScript", "Email Marketing", "SEO & Analytics Tools"],
  },
  {
    title: "Digital Marketing",
    icon: <LineChart className="h-6 w-6" />,
    skills: [
      "Search Engine Optimization (SEO)",
      "Social Media Optimization (SMO)",
      "Email Marketing",
      "Analytics & Reporting",
      "Digital Tools",
    ],
  },
]

export default function SkillsSection() {
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
    <section id="skills" ref={sectionRef} className="py-20 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-600 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2
          className={`text-3xl md:text-4xl font-bold mb-12 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">My Skills</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-xl transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-900/50 rounded-lg mr-4 text-purple-400">{category.icon}</div>
                <h3 className="text-xl font-semibold text-white">{category.title}</h3>
              </div>

              <ul className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <li key={skillIndex} className="flex items-center text-gray-300">
                    <span className="h-2 w-2 bg-purple-500 rounded-full mr-3"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className={`mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {["SEO", "SMO", "HTML", "CSS", "JavaScript", "Analytics"].map((skill, index) => (
            <div
              key={index}
              className="bg-gray-800/30 border border-purple-500/20 rounded-lg py-3 px-4 text-center hover:bg-purple-900/30 transition-colors"
            >
              <span className="text-purple-300 font-medium">{skill}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
