"use client"

import { useEffect, useRef, useState } from "react"
import { GraduationCap, Calendar } from "lucide-react"

const educationData = [
  {
    school: "Dhenkanal Autonomous",
    location: "Dhenkanal, Odisha",
    degree: "BSc in Botany",
    period: "Sep 2021 - Apr 2024",
    gpa: "7.05",
    courses: "Botany",
  },
  {
    school: "Delhi Public School",
    location: "Dhenkanal, Odisha",
    degree: "Intermediate",
    period: "Aug 2019 - Mar 2021",
    gpa: "7.89",
    courses: "",
  },
  {
    school: "St. Xavier's High School",
    location: "Dhenkanal, Odisha",
    degree: "High School",
    period: "Apr 2017 - May 2019",
    gpa: "8",
    courses: "",
  },
]

export default function EducationSection() {
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
    <section id="education" ref={sectionRef} className="py-20 relative bg-gray-900/50">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-600 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2
          className={`text-3xl md:text-4xl font-bold mb-12 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">Education</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {educationData.map((edu, index) => (
            <div
              key={index}
              className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-xl transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-900/50 rounded-lg mr-4">
                  <GraduationCap className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">{edu.degree}</h3>
              </div>

              <h4 className="text-lg font-medium text-purple-300 mb-2">{edu.school}</h4>
              <p className="text-gray-400 mb-4">{edu.location}</p>

              <div className="flex items-center text-gray-400 mb-3">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{edu.period}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">GPA</span>
                <span className="text-white font-medium">{edu.gpa}</span>
              </div>

              {edu.courses && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-gray-400 text-sm">
                    <span className="font-medium text-purple-300">Relevant coursework:</span> {edu.courses}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
