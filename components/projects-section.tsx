"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink, Github, Code } from "lucide-react"

const projectsData = [
  {
    title: "My Portfolio",
    description:
      "A responsive, dark-themed portfolio website with anime aesthetics featuring falling sakura animation, neon text effects, and smooth transitions. Built with Next.js and Tailwind CSS.",
    tags: ["Next.js", "Tailwind CSS", "Animation", "Responsive Design"],
    image: "/portfolio.png",
    liveLink: "https://dsmita.pro",
  },
  // {
  //   title: "E-commerce SEO Optimization",
  //   description:
  //     "Implemented comprehensive SEO strategies for an e-commerce platform, resulting in a 45% increase in organic traffic and improved search rankings for key product categories.",
  //   tags: ["SEO", "E-commerce", "Keyword Research", "Analytics"],
  //   image: "/placeholder.svg?height=300&width=500",
  // },
  // {
  //   title: "Social Media Campaign",
  //   description:
  //     "Designed and executed a cross-platform social media campaign that increased brand engagement by 60% and generated a 25% growth in follower base within three months.",
  //   tags: ["SMO", "Content Strategy", "Campaign Management"],
  //   image: "/placeholder.svg?height=300&width=500",
  // },
  // {
  //   title: "Email Marketing Automation",
  //   description:
  //     "Developed automated email marketing workflows that improved open rates by 32% and conversion rates by 15% through personalized content delivery and strategic segmentation.",
  //   tags: ["Email Marketing", "Automation", "Conversion Optimization"],
  //   image: "/placeholder.svg?height=300&width=500",
  // },
]

export default function ProjectsSection() {
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
    <section id="projects" ref={sectionRef} className="py-20 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-600 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2
          className={`text-3xl md:text-4xl font-bold mb-12 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
            Featured Projects
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project, index) => (
            <div
              key={index}
              className={`bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/30 shadow-xl transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="h-48 overflow-hidden relative group">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-end space-x-2">
                  <a
                    href="#"
                    className="p-2 bg-gray-800/80 rounded-full text-purple-400 hover:text-white hover:bg-purple-600/80 transition-colors"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href={project.liveLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800/80 rounded-full text-purple-400 hover:text-white hover:bg-purple-600/80 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                <p className="text-gray-300 mb-4 text-sm">{project.description}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-purple-900/40 text-purple-300 text-xs rounded-full flex items-center"
                    >
                      <Code className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
