"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Mail, MessageSquare } from "lucide-react"

export default function ContactSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic would go here
    alert("Thank you for your message! This is a demo form.")
    setFormState({ name: "", email: "", message: "" })
  }

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
    <section id="contact" ref={sectionRef} className="py-20 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-pink-600 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2
          className={`text-3xl md:text-4xl font-bold mb-12 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
            Get In Touch
          </span>
        </h2>

        <div className="max-w-4xl mx-auto">
          <div
            className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-purple-500/30 shadow-xl transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 text-purple-400 mr-2" />
                  Send Me a Message
                </h3>
                <p className="text-gray-300 mb-6">Have a question or want to work together? Feel free to reach out!</p>

                <div className="bg-gray-900/50 p-6 rounded-lg mb-6">
                  <div className="flex items-center mb-4">
                    <Mail className="h-5 w-5 text-purple-400 mr-3" />
                    <a
                      href="mailto:debasmitabehera0509@gmail.com"
                      className="text-gray-300 hover:text-purple-400 transition-colors"
                    >
                      debasmitabehera0509@gmail.com
                    </a>
                  </div>
                </div>

                <div className="hidden md:block">
                  <div className="relative w-full h-48">
                    <div className="absolute top-0 left-0 w-full h-full bg-purple-900/20 rounded-lg overflow-hidden">
                      <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500 rounded-full filter blur-xl opacity-30 animate-float"></div>
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-500 rounded-full filter blur-xl opacity-30 animate-float-delay"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-gray-300 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg px-6 py-3 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
