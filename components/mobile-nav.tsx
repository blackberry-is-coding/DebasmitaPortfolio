"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { scrollToElement } from "@/utils/smoothScroll"

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const [animationClass, setAnimationClass] = useState("")
  
  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setAnimationClass("translate-x-0")
      // Prevent scrolling when menu is open
      document.body.style.overflow = "hidden"
    } else {
      setAnimationClass("translate-x-full")
      // Restore scrolling when menu is closed
      document.body.style.overflow = ""
    }
    
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])
  
  // Handle navigation item click with optimized scrolling
  const handleNavClick = (sectionId: string) => {
    onClose()
    
    // Use optimized smooth scroll with a slight delay to allow menu to close
    setTimeout(() => {
      // Use 60px offset to account for the fixed header
      scrollToElement(sectionId, 60, 400)
    }, 300)
  }
  
  const navItems = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Education", id: "education" },
    { name: "Skills", id: "skills" },
    { name: "Experience", id: "experience" },
    { name: "Projects", id: "projects" },
    { name: "Contact", id: "contact" }
  ]

  return (
    <>
      {/* Overlay - optimized with reduced backdrop-filter for better performance */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 touch-none"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Mobile menu - optimized transitions */}
      <div 
        className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-gray-900/95 z-50 
                   shadow-xl transform transition-transform duration-250 ease-out ${animationClass}
                   flex flex-col overflow-y-auto overscroll-contain touch-pan-y`}
        style={{ willChange: 'transform' }}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            dsmita<span className="text-purple-400">.pro</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 pt-4">
          <ul className="px-2 space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className="w-full text-left px-4 py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-purple-900/30 
                           active:bg-purple-900/50 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 
                           focus:ring-purple-500 focus:ring-opacity-50"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-800 mt-auto">
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => handleNavClick("projects")}
              className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white font-medium 
                       hover:opacity-90 transition-opacity text-center active:scale-[0.98] transform"
            >
              View Projects
            </button>
            <button
              onClick={() => handleNavClick("contact")}
              className="px-4 py-3 border border-purple-500 rounded-lg text-purple-300 font-medium 
                       hover:bg-purple-900/30 transition-colors text-center active:scale-[0.98] transform"
            >
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </>
  )
}