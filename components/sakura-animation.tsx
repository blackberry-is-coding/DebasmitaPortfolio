"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

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
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  })
  const petalIdRef = useRef(0) // Unique ID generator
  const animationRef = useRef<number | null>(null)
  
  // Memoize the petal images to prevent unnecessary re-renders
  const petalImages = useMemo(() => [
    "/images/cherry1.svg",
    "/images/cherry2.svg",
    "/images/cherry3.svg",
    "/images/cherry4.svg",
    "/images/cherry5.svg",
  ], [])

  // Determine the optimal number of petals based on screen size
  const getOptimalPetalCount = useCallback(() => {
    const area = dimensions.width * dimensions.height
    // Fewer petals for smaller screens, more for larger screens
    if (area < 500000) return { initial: 15, max: 40 } // Mobile
    if (area < 1000000) return { initial: 20, max: 60 } // Tablet
    return { initial: 30, max: 80 } // Desktop
  }, [dimensions])

  // Create a new petal with responsive sizing
  const createPetal = useCallback((): Petal => {
    const id = petalIdRef.current++
    // Responsive scale based on screen size
    const baseScale = dimensions.width < 768 ? 0.5 : 0.6
    const scaleVariation = dimensions.width < 768 ? 0.4 : 0.6
    const scale = baseScale + Math.random() * scaleVariation
    
    // Responsive size based on screen size
    const baseSize = dimensions.width < 768 ? 25 : 35
    const sizeVariation = dimensions.width < 768 ? 15 : 25
    
    // Faster speed for smoother animation
    const baseSpeed = dimensions.width < 768 ? 0.8 : 1.0
    const speedVariation = dimensions.width < 768 ? 1.8 : 2.2
    
    return {
      id,
      x: Math.random() * dimensions.width,
      y: -30 - Math.random() * 100,
      size: baseSize + Math.random() * sizeVariation,
      rotation: Math.random() * 360,
      rotationSpeed: 0.8 + Math.random() * 2.0, // Increased rotation speed
      speed: baseSpeed + Math.random() * speedVariation, // Increased falling speed
      opacity: 0.6 + Math.random() * 0.4,
      zIndex: Math.floor(Math.random() * 10),
      scale,
      imageIndex: Math.floor(Math.random() * petalImages.length),
    }
  }, [dimensions, petalImages])

  // Animate the petals with improved performance
  const animatePetals = useCallback(() => {
    setPetals((currentPetals) => {
      return currentPetals
        .map((petal) => {
          // Enhanced floating motion with more pronounced swaying
          // Faster horizontal movement for more dynamic animation
          const x = petal.x + Math.sin(petal.y / 50) * 2.8
          const y = petal.y + petal.speed
          const rotation = petal.rotation + petal.rotationSpeed

          // Remove petals that have fallen below the screen
          if (y > dimensions.height + 50) {
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

    animationRef.current = requestAnimationFrame(animatePetals)
  }, [dimensions.height])

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    // Set initial dimensions
    if (typeof window !== 'undefined') {
      handleResize()
      window.addEventListener('resize', handleResize)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  // Initialize and manage the animation
  useEffect(() => {
    const { initial, max } = getOptimalPetalCount()
    
    // Create initial petals with responsive count
    const initialPetals: Petal[] = []
    for (let i = 0; i < initial; i++) {
      initialPetals.push(createPetal())
    }
    setPetals(initialPetals)

    // Start animation loop
    animationRef.current = requestAnimationFrame(animatePetals)

    // Periodically add new petals - faster generation for smoother appearance
    const interval = setInterval(() => {
      setPetals((currentPetals) => {
        // Add new petals at a time
        const newPetals = []
        const count = Math.floor(Math.random() * 3) + 1
        for (let i = 0; i < count; i++) {
          newPetals.push(createPetal())
        }
        
        // Limit total flowers to prevent performance issues
        // Use responsive max count
        return [...currentPetals, ...newPetals].slice(-max)
      })
    }, 800) // Faster generation for more continuous flow

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      clearInterval(interval)
    }
  }, [animatePetals, createPetal, getOptimalPetalCount])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute will-change-transform"
          style={{
            left: `${petal.x}px`,
            top: `${petal.y}px`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            opacity: petal.opacity,
            transform: `rotate(${petal.rotation}deg) scale(${petal.scale})`,
            transition: "transform 0.05s linear, opacity 0.3s ease", // Faster transitions for smoother animation
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
              transition: "transform 0.03s linear", // Even smoother spinning animation
              willChange: "transform", // Performance optimization hint
            }}
          />
        </div>
      ))}
    </div>
  )
}
