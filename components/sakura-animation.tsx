"use client"

import { useEffect, useRef, useState } from "react"

interface Petal {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  rotationSpeed: number
  speed: number
  opacity: number
  zIndex: number
  scale: number
  imageIndex: number
}

export default function SakuraAnimation() {
  const [petals, setPetals] = useState<Petal[]>([])
  const petalIdRef = useRef(0) // Unique ID generator
  const petalImages = [
    "/images/cherry1.svg",
    "/images/cherry2.svg",
    "/images/cherry3.svg",
    "/images/cherry4.svg",
    "/images/cherry5.svg",
  ]

  useEffect(() => {
    // Create initial petals - fewer flowers for better performance and visibility
    const initialPetals: Petal[] = []
    for (let i = 0; i < 25; i++) {
      initialPetals.push(createPetal())
    }
    setPetals(initialPetals)

    // Animation loop
    let animationFrame = requestAnimationFrame(animatePetals)

    // Periodically add new petals - slower for flowers as they're more visible
    const interval = setInterval(() => {
      setPetals((currentPetals) => {
        // Add 1-2 flowers at a time
        const newPetals = []
        const count = Math.floor(Math.random() * 5) + 1
        for (let i = 0; i < count; i++) {
          newPetals.push(createPetal())
        }
        
        // Limit total flowers to prevent performance issues
        const maxPetals = 70 // Fewer flowers since they're more detailed
        return [...currentPetals, ...newPetals].slice(-maxPetals)
      })
    }, 1200) // Slower generation for flowers

    return () => {
      cancelAnimationFrame(animationFrame)
      clearInterval(interval)
    }
  }, [])

  const createPetal = (): Petal => {
    const id = petalIdRef.current++
    const scale = 0.6 + Math.random() * 0.6 // Increased scale factor for bigger flowers
    return {
      id,
      x: Math.random() * window.innerWidth,
      y: -30 - Math.random() * 100,
      size: 35 + Math.random() * 25, // Increased size for bigger flowers
      rotation: Math.random() * 360,
      rotationSpeed: 0.5 + Math.random() * 1.5, // Faster rotation for more spinning
      speed: 0.4 + Math.random() * 1.5, // Maintained falling speed
      opacity: 0.6 + Math.random() * 0.4, // Maintained opacity
      zIndex: Math.floor(Math.random() * 10), // Random z-index for 3D layering effect
      scale, // Scale factor for 3D effect
      imageIndex: Math.floor(Math.random() * petalImages.length),
    }
  }

  const animatePetals = () => {
    setPetals((currentPetals) => {
      return currentPetals
        .map((petal) => {
          // Enhanced floating motion with more pronounced swaying
          const x = petal.x + Math.sin(petal.y / 60) * 2.2
          const y = petal.y + petal.speed
          // Faster rotation for more visible spinning
          const rotation = petal.rotation + petal.rotationSpeed

          // Remove petals that have fallen below the screen
          if (y > window.innerHeight + 50) {
            return null
          }

          return {
            ...petal,
            x,
            y,
            rotation,
          }
        })
        .filter((petal): petal is Petal => petal !== null)
    })

    requestAnimationFrame(animatePetals)
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}px`,
            top: `${petal.y}px`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            opacity: petal.opacity,
            transform: `rotate(${petal.rotation}deg) scale(${petal.scale})`,
            transition: "transform 0.1s linear, opacity 0.5s ease",
            filter: `drop-shadow(0 0 2px rgba(255, 255, 255, 0.3)) blur(${(1 - petal.scale) * 0.5}px)`,
            zIndex: petal.zIndex,
          }}
        >
          <img 
            src={petalImages[petal.imageIndex]} 
            alt="Cherry blossom" 
            className="w-full h-full object-contain"
            style={{
              transform: `perspective(800px) rotateX(${Math.sin(petal.rotation * 0.01) * 15}deg) rotateY(${Math.cos(petal.rotation * 0.01) * 15}deg) rotateZ(${petal.rotation * 0.5}deg)`,
              filter: `drop-shadow(0 0 4px rgba(255, 192, 203, 0.4))`,
              transition: "transform 0.05s linear", // Smoother spinning animation
            }}
          />
        </div>
      ))}
    </div>
  )
}
