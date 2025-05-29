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

  // Track last animation time for throttling
  const lastAnimationTimeRef = useRef<number>(0)
  const scrollSpeedRef = useRef<number>(0)
  
  // Animate the petals with improved performance
  const animatePetals = useCallback((timestamp: number = 0) => {
    // Completely freeze animation during fast scrolling on mobile
    if (isScrolling && isMobile && scrollSpeedRef.current > 30) {
      animationRef.current = requestAnimationFrame(animatePetals)
      return
    }
    
    // Throttle animation frames on mobile for better performance
    // Only update every 2-3 frames during normal scrolling
    if (isMobile) {
      const elapsed = timestamp - lastAnimationTimeRef.current
      const frameInterval = isScrolling ? 50 : 16 // ~60fps normally, ~20fps during scroll
      
      if (elapsed < frameInterval) {
        animationRef.current = requestAnimationFrame(animatePetals)
        return
      }
      
      lastAnimationTimeRef.current = timestamp
    }
    
    setPetals((currentPetals) => {
      // Use a simpler animation during scrolling
      const swayAmount = isScrolling ? 0.5 : 2.8
      const rotationSpeed = isScrolling ? 0.2 : 1.0
      
      return currentPetals
        .map((petal) => {
          // Skip complex calculations during scrolling
          if (isScrolling && isMobile) {
            // Just move petals down during scrolling without side movement
            const y = petal.y + petal.speed
            
            // Remove petals that have fallen below the screen
            if (y > dimensions.height + 50) {
              return null
            }
            
            return {
              ...petal,
              y,
            }
          }
          
          // Normal animation when not scrolling
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
  const containerStyle = useMemo(() => {
    // Hide animation completely during fast scrolling
    const isFastScrolling = isScrolling && isMobile && scrollSpeedRef.current > 30
    
    return {
      opacity: isFastScrolling ? 0 : isScrolling && isMobile ? 0.4 : 1,
      transition: `opacity ${isScrolling ? '0ms' : '300ms'} ease-out`,
      visibility: isFastScrolling ? 'hidden' : 'visible',
      // Use transform: translateZ(0) to force GPU acceleration
      transform: 'translateZ(0)',
    }
  }, [isScrolling, isMobile])

  // Optimize petal rendering
  const renderPetal = useCallback((petal: Petal) => {
    // Simplified transforms during scrolling
    const useSimpleTransforms = isScrolling && isMobile
    
    // During scrolling, don't render petals that are off-screen to reduce workload
    if (isScrolling && isMobile) {
      if (petal.y < -100 || petal.y > dimensions.height + 50) {
        return null
      }
    }
    
    return (
      <div
        key={petal.id}
        className="absolute will-change-transform"
        style={{
          left: `${petal.x}px`,
          top: `${petal.y}px`,
          width: `${petal.size}px`,
          height: `${petal.size}px`,
          opacity: petal.opacity * (isScrolling && isMobile ? 0.7 : 1),
          transform: `rotate(${petal.rotation}deg) scale(${petal.scale})`,
          transition: 'none', // Disable all transitions during any state for better performance
          filter: useSimpleTransforms ? 'none' : `blur(${(1 - petal.scale) * 0.5}px)`,
          zIndex: petal.zIndex,
          // Disable pointer events for better performance
          pointerEvents: 'none',
        }}
      >
        <img 
          src={petalImages[petal.imageIndex]} 
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain"
          style={{
            transform: useSimpleTransforms 
              ? 'none' // No transform during scrolling
              : `perspective(800px) rotateX(${Math.sin(petal.rotation * 0.01) * 15}deg) rotateY(${Math.cos(petal.rotation * 0.01) * 15}deg) rotateZ(${petal.rotation * 0.5}deg)`,
            filter: useSimpleTransforms ? 'none' : 'none', // Remove all filters for better performance
            transition: 'none',
            willChange: useSimpleTransforms ? 'auto' : 'transform', // Only use willChange when needed
          }}
        />
      </div>
    )
  }, [isScrolling, isMobile, petalImages, dimensions.height])

  // Add scroll speed detection
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    let lastScrollY = window.scrollY
    let lastScrollTime = performance.now()
    
    const detectScrollSpeed = () => {
      const currentTime = performance.now()
      const currentScrollY = window.scrollY
      const timeDelta = currentTime - lastScrollTime
      
      if (timeDelta > 0) {
        // Calculate scroll speed in pixels per 100ms
        const scrollDelta = Math.abs(currentScrollY - lastScrollY)
        scrollSpeedRef.current = (scrollDelta / timeDelta) * 100
      }
      
      lastScrollTime = currentTime
      lastScrollY = currentScrollY
    }
    
    window.addEventListener('scroll', detectScrollSpeed, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', detectScrollSpeed)
    }
  }, [])
  
  // Conditionally render petals based on scroll state
  const visiblePetals = useMemo(() => {
    // During fast scrolling on mobile, don't process petals at all
    if (isScrolling && isMobile && scrollSpeedRef.current > 30) {
      return []
    }
    
    // During normal scrolling on mobile, only render visible petals
    if (isScrolling && isMobile) {
      return petals
        .filter(petal => petal.y >= -100 && petal.y <= dimensions.height + 50)
        .map(renderPetal)
        .filter(Boolean) // Filter out null values
    }
    
    // Normal rendering
    return petals.map(renderPetal).filter(Boolean)
  }, [petals, renderPetal, isScrolling, isMobile, dimensions.height])

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={containerStyle}
      aria-hidden="true"
    >
      {visiblePetals}
    </div>
  )
}
