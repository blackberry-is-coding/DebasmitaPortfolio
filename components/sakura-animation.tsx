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
  horizontalDrift: number // For sideways movement
  acceleration: number // For realistic falling physics
  rotationDirection: number // Direction of rotation (1 or -1)
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
    // Further increased counts for all device types to ensure petals reach the bottom
    if (area < 500000) return { initial: 25, max: 60 } // Mobile - balanced for performance and visuals
    if (area < 1000000) return { initial: 35, max: 90 } // Tablet
    return { initial: 45, max: 120 } // Desktop - more petals for a richer effect
  }, [dimensions])

  // Create a new petal with responsive sizing and realistic physics
  const createPetal = useCallback((): Petal => {
    const id = petalIdRef.current++
    
    // Responsive scale based on screen size - slightly smaller for better performance
    const baseScale = isMobile ? 0.5 : 0.6
    const scaleVariation = isMobile ? 0.3 : 0.5
    const scale = baseScale + Math.random() * scaleVariation
    
    // Responsive size based on screen size
    const baseSize = isMobile ? 22 : 32
    const sizeVariation = isMobile ? 12 : 22
    
    // More realistic physics - variable speeds based on size (smaller petals fall slower)
    // This simulates air resistance effects
    const sizeRatio = (baseSize + Math.random() * sizeVariation) / (baseSize + sizeVariation)
    
    // Reduced base speed for slower falling
    const baseSpeed = isMobile ? 0.5 : 0.6  // Reduced by 50%
    const speedVariation = isMobile ? 0.4 : 0.6  // Reduced variation for more consistent slow falling
    
    // Maintain rotation speeds for good spinning effect
    const baseRotationSpeed = 0.8 + Math.random() * 1.8
    const rotationDirection = Math.random() > 0.5 ? 1 : -1 // Random direction
    
    // Add horizontal drift for more realistic movement
    const horizontalDrift = (Math.random() - 0.5) * 0.5  // Reduced for less horizontal movement
    
    // Reduced acceleration for slower falling
    const acceleration = 0.002 + Math.random() * 0.005  // Significantly reduced
    
    return {
      id,
      x: Math.random() * dimensions.width,
      y: -50 - Math.random() * 500, // Start much higher up for longer falling time and better distribution
      size: baseSize + Math.random() * sizeVariation,
      rotation: Math.random() * 360,
      rotationSpeed: baseRotationSpeed * rotationDirection * (1 / sizeRatio), // Smaller petals spin faster
      speed: (baseSpeed + Math.random() * speedVariation) * sizeRatio, // Larger petals fall faster
      opacity: 0.6 + Math.random() * 0.4,
      zIndex: Math.floor(Math.random() * 10),
      scale,
      imageIndex: Math.floor(Math.random() * petalImages.length),
      horizontalDrift, // New property for sideways movement
      acceleration, // New property for realistic acceleration
      rotationDirection, // Store rotation direction
    }
  }, [dimensions.width, isMobile, petalImages])

  // Track last animation time for throttling
  const lastAnimationTimeRef = useRef<number>(0)
  const scrollSpeedRef = useRef<number>(0)
  
  // Store the last scroll position to calculate scroll delta
  const lastScrollYRef = useRef(0);
  
  // Use a ref to track scrolling state to prevent animation restart
  const isScrollingRef = useRef(isScrolling);
  
  // Update the ref when the prop changes
  useEffect(() => {
    isScrollingRef.current = isScrolling;
  }, [isScrolling]);
  
  // Animate the petals with improved performance and realistic physics
  const animatePetals = useCallback((timestamp: number = 0) => {
    // Use the ref instead of the prop to prevent animation restart
    const currentIsScrolling = isScrollingRef.current;
    
    // Never completely freeze animation, just throttle during fast scrolling
    const isFastScrolling = currentIsScrolling && isMobile && scrollSpeedRef.current > 30
    
    // Calculate scroll delta for this frame
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollYRef.current;
    lastScrollYRef.current = currentScrollY;
    
    // Throttle animation frames for better performance
    // Use different frame rates based on scrolling state
    if (isMobile) {
      const elapsed = timestamp - lastAnimationTimeRef.current
      // Adjust frame intervals: 
      // - 16ms (~60fps) for normal viewing
      // - 33ms (~30fps) for normal scrolling
      // - 50ms (~20fps) for fast scrolling
      const frameInterval = isFastScrolling ? 50 : (currentIsScrolling ? 33 : 16)
      
      if (elapsed < frameInterval) {
        animationRef.current = requestAnimationFrame(animatePetals)
        return
      }
      
      lastAnimationTimeRef.current = timestamp
    }
    
    setPetals((currentPetals) => {
      // Use a simpler animation during scrolling
      const swayAmount = currentIsScrolling ? 0.5 : 2.8
      const rotationSpeed = currentIsScrolling ? 0.2 : 1.0
      
      return currentPetals
        .map((petal) => {
          // When scrolling, move petals with the scroll
          if (currentIsScrolling) {
            // Move petals with scroll (80% of scroll speed) plus their natural falling motion
            const y = petal.y + petal.speed + (scrollDelta * 0.8);
            const x = petal.x + (petal.horizontalDrift * 0.3); // Reduced horizontal movement during scrolling
            
            // Remove petals that have fallen far below the screen
            if (y > dimensions.height + 800) {
              return null
            }
            
            // Update rotation slightly even during scrolling for more natural movement
            const newRotation = petal.rotation + (petal.rotationSpeed * 0.1)
            
            return {
              ...petal,
              x,
              y,
              rotation: newRotation,
            }
          }
          
          // Apply realistic physics for normal animation
          
          // Calculate scroll delta effect for non-scrolling state too (for consistency)
          // This ensures petals move consistently whether scrolling or not
          const scrollEffect = currentIsScrolling ? (scrollDelta * 0.8) : 0;
          
          // 1. Apply acceleration to speed (gravity effect)
          const newSpeed = petal.speed + petal.acceleration
          
          // 2. Apply horizontal drift with sine wave for natural swaying
          // The horizontal movement is affected by the petal's vertical position
          // creating a more natural falling pattern - using a longer wavelength for gentler swaying
          const windEffect = Math.sin(petal.y / 200) * (swayAmount * 0.7) // Gentler wind effect
          const horizontalMovement = petal.horizontalDrift * 0.8 + windEffect // Reduced horizontal drift
          
          // 3. Calculate new position with physics and scroll effect
          const x = petal.x + horizontalMovement
          const y = petal.y + newSpeed + scrollEffect // Add scroll effect to normal animation too
          
          // 4. Calculate rotation with enhanced spinning even with slower falling
          // Maintain good spinning effect regardless of fall speed
          const spinFactor = 1 + (newSpeed / 5) // Increased spin factor to compensate for slower falling
          const newRotation = petal.rotation + (petal.rotationSpeed * rotationSpeed * spinFactor * 1.2) // Boosted rotation
          
          // 5. Add slight wobble to rotation for more natural movement
          // This simulates air resistance affecting the petal's orientation
          const wobble = Math.sin(y / 30) * 2 * petal.rotationDirection
          const finalRotation = newRotation + wobble
          
          // Remove petals only if they've drifted too far horizontally
          // or fallen significantly below the viewport (to ensure they reach the footer)
          if (y > dimensions.height + 1500 || // Allow petals to fall much further down to reach the bottom of the contact section
              x < -100 || 
              x > dimensions.width + 100) {
            return null
          }

          return {
            ...petal,
            x,
            y,
            rotation: finalRotation,
            speed: newSpeed, // Update speed with acceleration
          }
        })
        .filter((petal): petal is Petal => petal !== null)
    })

    animationRef.current = requestAnimationFrame(animatePetals)
  }, [dimensions.height, dimensions.width, isMobile])

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

  // Initialize and manage the animation - only run once on component mount
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

    // Periodically add new petals - continue during scrolling but at a reduced rate
    const addNewPetals = () => {
      // Don't completely stop adding petals during scrolling, just reduce the number
      const isScrollingOnMobile = isScrolling && isMobile
      
      setPetals((currentPetals) => {
        // Add more petals at a time for a richer effect
        const newPetals = []
        
        // Vary the number of petals added each time for a more natural effect
        // Reduce the number of petals added during scrolling but don't stop completely
        const baseCount = isScrollingOnMobile ? 1 : (isMobile ? 2 : 3)
        const randomVariation = isScrollingOnMobile ? 1 : (isMobile ? 1 : 2)
        const count = baseCount + Math.floor(Math.random() * randomVariation)
        
        // Create new petals with varied positions
        for (let i = 0; i < count; i++) {
          // Distribute petals across the width of the screen
          const petal = createPetal()
          
          // Adjust starting position to spread petals across the screen width
          // This creates a more even distribution
          petal.x = (dimensions.width / count) * i + (Math.random() * dimensions.width / count)
          
          // Vary the starting height more dramatically for a more distributed falling effect
          petal.y = -50 - Math.random() * 800 // Increased range for better vertical distribution
          
          newPetals.push(petal)
        }
        
        // Limit total flowers to prevent performance issues
        return [...currentPetals, ...newPetals].slice(-max)
      })
    }
    
    // Use different intervals for mobile vs desktop
    // Slightly shorter interval to ensure more petals are added consistently
    const intervalTime = isMobile ? 1000 : 800
    intervalRef.current = setInterval(addNewPetals, intervalTime)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  // Remove isScrolling dependency to prevent reinitialization during scrolling
  }, [animatePetals, createPetal, getOptimalPetalCount, isMobile])

  // Optimize rendering during scrolling
  const containerStyle = useMemo(() => {
    // Use the ref instead of the prop to prevent animation restart
    const currentIsScrolling = isScrollingRef.current;
    
    // Never completely hide animation during scrolling, just reduce opacity
    const isFastScrolling = currentIsScrolling && isMobile && scrollSpeedRef.current > 30
    
    return {
      opacity: isFastScrolling ? 0.2 : currentIsScrolling && isMobile ? 0.6 : 1,
      transition: `opacity 300ms ease-out`, // Always use smooth transition
      visibility: 'visible', // Always keep visible
      // Use transform: translateZ(0) to force GPU acceleration
      transform: 'translateZ(0)',
    }
  }, [isMobile])

  // Optimize petal rendering with enhanced 3D effects
  const renderPetal = useCallback((petal: Petal) => {
    // Use the ref instead of the prop to prevent animation restart
    const currentIsScrolling = isScrollingRef.current;
    
    // Use simplified transforms during scrolling for better performance
    const useSimpleTransforms = currentIsScrolling && isMobile
    
    // During scrolling, render all petals within a much larger viewport range
    // This prevents the popping effect when scrolling
    if (currentIsScrolling) {
      // Use a much larger range during scrolling to prevent disappearing
      const extendedViewportHeight = dimensions.height * 2;
      if (petal.y < -500 || petal.y > extendedViewportHeight) {
        return null
      }
    }
    
    // Calculate 3D rotation angles based on movement
    // This creates a more realistic spinning effect as petals fall
    const rotationX = useSimpleTransforms ? 0 : Math.sin(petal.rotation * 0.01) * 25
    const rotationY = useSimpleTransforms ? 0 : Math.cos(petal.rotation * 0.01) * 25
    
    // Add slight wobble based on horizontal movement
    const wobbleAmount = useSimpleTransforms ? 0 : Math.sin(petal.y / 50) * 10
    
    // Calculate shadow opacity based on height - creates a sense of depth
    const shadowOpacity = useSimpleTransforms ? 0 : Math.min(0.2, (petal.y / dimensions.height) * 0.3)
    
    return (
      <div
        key={petal.id}
        className="absolute will-change-transform"
        style={{
          left: `${petal.x}px`,
          top: `${petal.y}px`,
          width: `${petal.size}px`,
          height: `${petal.size}px`,
          opacity: petal.opacity * (currentIsScrolling && isMobile ? 0.7 : 1),
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
              : `perspective(800px) 
                 rotateX(${rotationX + wobbleAmount}deg) 
                 rotateY(${rotationY}deg) 
                 rotateZ(${petal.rotation * 0.5}deg)`,
            filter: useSimpleTransforms 
              ? 'none' 
              : `drop-shadow(0 ${petal.speed * 2}px ${petal.speed}px rgba(0,0,0,${shadowOpacity}))`,
            transition: 'none',
            willChange: useSimpleTransforms ? 'auto' : 'transform', // Only use willChange when needed
          }}
        />
      </div>
    )
  }, [isMobile, petalImages, dimensions.height])

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
    // Use the ref instead of the prop to prevent animation restart
    const currentIsScrolling = isScrollingRef.current;
    
    // During fast scrolling, still render petals but limit the number for performance
    if (currentIsScrolling && scrollSpeedRef.current > 30) {
      // Instead of showing no petals, show a subset for better performance
      return petals
        .slice(0, Math.min(petals.length, 40)) // Limit to 40 petals during fast scrolling
        .map(renderPetal)
        .filter(Boolean)
    }
    
    // During normal scrolling, render all petals
    // The filtering is now handled in the renderPetal function
    return petals
      .map(renderPetal)
      .filter(Boolean) // Filter out null values
  }, [petals, renderPetal, scrollSpeedRef])

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        ...containerStyle,
        height: '300vh', // Make the container much taller to extend beyond viewport
        overflow: 'visible', // Allow content to overflow
        willChange: 'transform', // Optimize for animations
      }}
      aria-hidden="true"
    >
      {visiblePetals}
    </div>
  )
}
