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

interface SakuraAnimationProps {
  isScrolling?: boolean
}

export default function SakuraAnimation({ isScrolling = false }: SakuraAnimationProps) {
  const [petals, setPetals] = useState<Petal[]>([])
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  })
  const petalIdRef = useRef(0) // Unique ID generator
  const animationRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMobile = useMemo(() => dimensions.width <= 768, [dimensions.width])
  
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
    if (area < 500000) return { initial: 12, max: 30 } // Mobile - reduced for better performance
    if (area < 1000000) return { initial: 18, max: 50 } // Tablet
    return { initial: 25, max: 70 } // Desktop
  }, [dimensions])

  // Create a new petal with responsive sizing
  const createPetal = useCallback((): Petal => {
    const id = petalIdRef.current++
    // Responsive scale based on screen size
    const baseScale = isMobile ? 0.5 : 0.6
    const scaleVariation = isMobile ? 0.3 : 0.5
    const scale = baseScale + Math.random() * scaleVariation
    
    // Responsive size based on screen size
    const baseSize = isMobile ? 22 : 32
    const sizeVariation = isMobile ? 12 : 22
    
    // Faster speed for smoother animation
    const baseSpeed = isMobile ? 1.0 : 1.2
    const speedVariation = isMobile ? 1.5 : 2.0
    
    return {
      id,
      x: Math.random() * dimensions.width,
      y: -30 - Math.random() * 100,
      size: baseSize + Math.random() * sizeVariation,
      rotation: Math.random() * 360,
      rotationSpeed: 0.8 + Math.random() * 1.8,
      speed: baseSpeed + Math.random() * speedVariation,
      opacity: 0.6 + Math.random() * 0.4,
      zIndex: Math.floor(Math.random() * 10),
      scale,
      imageIndex: Math.floor(Math.random() * petalImages.length),
    }
  }, [dimensions.width, isMobile, petalImages])

  // Animate the petals with improved performance
  const animatePetals = useCallback(() => {
    // Skip animation frames during scrolling on mobile for better performance
    if (isScrolling && isMobile) {
      animationRef.current = requestAnimationFrame(animatePetals)
      return
    }
    
    setPetals((currentPetals) => {
      // Use a simpler animation during scrolling
      const swayAmount = isScrolling ? 1.0 : 2.8
      const rotationSpeed = isScrolling ? 0.5 : 1.0
      
      return currentPetals
        .map((petal) => {
          // Enhanced floating motion with more pronounced swaying
          // Simplified calculation during scrolling
          const x = petal.x + Math.sin(petal.y / 50) * swayAmount
          const y = petal.y + petal.speed
          const rotation = petal.rotation + (petal.rotationSpeed * rotationSpeed)

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
  }, [dimensions.height, isScrolling, isMobile])

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
      window.addEventListener('resize', handleResize, { passive: true })
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

    // Periodically add new petals - pause during scrolling
    const addNewPetals = () => {
      if (isScrolling && isMobile) return
      
      setPetals((currentPetals) => {
        // Add fewer petals at a time on mobile
        const newPetals = []
        const count = isMobile ? 1 : Math.floor(Math.random() * 3) + 1
        for (let i = 0; i < count; i++) {
          newPetals.push(createPetal())
        }
        
        // Limit total flowers to prevent performance issues
        return [...currentPetals, ...newPetals].slice(-max)
      })
    }
    
    // Use different intervals for mobile vs desktop
    const intervalTime = isMobile ? 1200 : 800
    intervalRef.current = setInterval(addNewPetals, intervalTime)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [animatePetals, createPetal, getOptimalPetalCount, isMobile, isScrolling])

  // Optimize rendering during scrolling
  const containerStyle = useMemo(() => ({
    opacity: isScrolling && isMobile ? 0.7 : 1, // Reduce opacity during scrolling on mobile
    transition: `opacity ${isScrolling ? '0ms' : '300ms'} ease-out`,
  }), [isScrolling, isMobile])

  // Optimize petal rendering
  const renderPetal = useCallback((petal: Petal) => {
    // Simplified transforms during scrolling
    const useSimpleTransforms = isScrolling && isMobile
    
    return (
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
          transition: useSimpleTransforms ? 'none' : "transform 0.05s linear",
          filter: useSimpleTransforms ? 'none' : `drop-shadow(0 0 2px rgba(255, 255, 255, 0.3)) blur(${(1 - petal.scale) * 0.5}px)`,
          zIndex: petal.zIndex,
        }}
      >
        <img 
          src={petalImages[petal.imageIndex]} 
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain"
          style={{
            transform: useSimpleTransforms 
              ? `rotateZ(${petal.rotation * 0.5}deg)`
              : `perspective(800px) rotateX(${Math.sin(petal.rotation * 0.01) * 15}deg) rotateY(${Math.cos(petal.rotation * 0.01) * 15}deg) rotateZ(${petal.rotation * 0.5}deg)`,
            filter: useSimpleTransforms ? 'none' : `drop-shadow(0 0 4px rgba(255, 192, 203, 0.4))`,
            transition: useSimpleTransforms ? 'none' : "transform 0.03s linear",
            willChange: "transform",
          }}
        />
      </div>
    )
  }, [isScrolling, isMobile, petalImages])

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={containerStyle}
    >
      {petals.map(renderPetal)}
    </div>
  )
}
