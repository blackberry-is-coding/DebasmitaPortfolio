/**
 * Optimized smooth scroll utility for mobile devices
 * Uses requestAnimationFrame for better performance than CSS scroll-behavior
 */

// Track scroll speed for performance optimizations
let lastScrollY = 0
let lastScrollTime = 0
let scrollSpeed = 0

// Track if we're in a programmatic scroll
let isProgrammaticScroll = false

// Track the last user scroll position to prevent unwanted jumps
let lastUserScrollPosition = 0
let userScrollTimestamp = 0
let isUserScrolling = false
let userScrollTimeout: NodeJS.Timeout | null = null

/**
 * Optimized smooth scroll with adaptive performance
 */
export const smoothScrollTo = (
  targetPosition: number,
  duration: number = 500,
  callback?: () => void
): void => {
  // Don't animate extremely short distances
  const currentPosition = window.scrollY
  if (Math.abs(targetPosition - currentPosition) < 50) {
    window.scrollTo(0, targetPosition)
    if (callback) callback()
    return
  }

  // For mobile devices, use native scrolling only
  const isMobile = window.innerWidth <= 768
  if (isMobile) {
    // On mobile, just use native scrolling - no animation
    window.scrollTo({
      top: targetPosition,
      behavior: 'auto'
    })
    
    // Call the callback after a short delay
    if (callback) {
      setTimeout(callback, 100)
    }
    return
  }

  // Desktop devices can handle more complex animations
  const startPosition = currentPosition
  const distance = targetPosition - startPosition
  let startTime: number | null = null

  // Mark that we're doing a programmatic scroll
  isProgrammaticScroll = true
  
  // Add scrolling class to optimize animations during scroll
  document.documentElement.classList.add('is-scrolling')
  document.body.style.pointerEvents = 'none' // Disable interactions during scroll

  // Easing function for smoother acceleration/deceleration
  const easeInOutQuad = (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  const animateScroll = (currentTime: number): void => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    const easedProgress = easeInOutQuad(progress)
    
    window.scrollTo({
      top: startPosition + distance * easedProgress,
      behavior: 'auto' // Use 'auto' instead of 'smooth' for better control
    })
    
    if (timeElapsed < duration && progress < 1) {
      requestAnimationFrame(animateScroll)
    } else {
      // Ensure we end exactly at the target position
      window.scrollTo({
        top: targetPosition,
        behavior: 'auto'
      })
      
      // Clean up
      finishScroll(callback)
    }
  }
  
  requestAnimationFrame(animateScroll)
}

/**
 * Simpler scroll function for mobile devices
 * Uses fewer animation frames for better performance
 */
const simpleSmoothScrollMobile = (
  startPosition: number,
  targetPosition: number,
  duration: number,
  callback?: () => void
): void => {
  // Mark that we're doing a programmatic scroll
  isProgrammaticScroll = true
  
  // Store the target position to prevent unwanted jumps
  lastUserScrollPosition = targetPosition
  
  // Add scrolling class to optimize animations during scroll
  document.documentElement.classList.add('is-scrolling')
  
  // Calculate total distance
  const distance = targetPosition - startPosition
  
  // For very short distances, just jump there
  if (Math.abs(distance) < 200) {
    window.scrollTo(0, targetPosition)
    finishScroll(callback)
    return
  }
  
  // For mobile, use a simpler approach with minimal steps
  // This significantly reduces the chance of jank or back-and-forth behavior
  const steps = 3 // Use only 3 steps for mobile to minimize jank
  const timePerStep = Math.min(duration / steps, 100) // Cap each step at 100ms max
  let currentStep = 0
  let isScrolling = true
  
  // Use a simple linear easing for mobile - less fancy but more reliable
  const doStep = () => {
    // Check if the scroll has been interrupted by user
    if (!isProgrammaticScroll || !isScrolling) {
      finishScroll(callback)
      return
    }
    
    currentStep++
    
    // Calculate progress (0 to 1)
    const progress = currentStep / steps
    
    // Calculate new position - use simple linear interpolation for reliability
    const newPosition = Math.round(startPosition + distance * progress)
    
    // Scroll to new position
    window.scrollTo(0, newPosition)
    
    // Continue if we have more steps
    if (currentStep < steps) {
      setTimeout(doStep, timePerStep)
    } else {
      // Final position - ensure we end exactly at the target
      window.scrollTo(0, targetPosition)
      finishScroll(callback)
    }
  }
  
  // Allow user to interrupt the scroll
  const interruptScroll = () => {
    if (isProgrammaticScroll) {
      isScrolling = false
      // Immediately go to final position if interrupted
      window.scrollTo(0, targetPosition)
    }
  }
  
  // Listen for user scroll events that might interrupt our animation
  window.addEventListener('wheel', interruptScroll, { passive: true, once: true })
  window.addEventListener('touchmove', interruptScroll, { passive: true, once: true })
  
  // Start the animation immediately
  doStep()
}

/**
 * Clean up after scrolling finishes
 */
const finishScroll = (callback?: () => void): void => {
  // Update the last user scroll position to the current position
  // This prevents unwanted jumps after programmatic scrolling
  lastUserScrollPosition = window.scrollY
  userScrollTimestamp = performance.now()
  
  // Determine if we're on mobile
  const isMobile = window.innerWidth <= 768
  
  // Use a longer delay on mobile before removing scrolling classes
  setTimeout(() => {
    document.documentElement.classList.remove('is-scrolling')
    document.documentElement.classList.remove('is-fast-scrolling')
    document.body.style.pointerEvents = '' // Re-enable interactions
    isProgrammaticScroll = false
    scrollSpeed = 0
    
    if (callback) callback()
    
    // Add a small delay to allow the browser to settle
    setTimeout(() => {
      // Check if the scroll position has unexpectedly changed
      const currentPosition = window.scrollY
      if (Math.abs(currentPosition - lastUserScrollPosition) > 50) {
        // Restore to the expected position
        window.scrollTo({
          top: lastUserScrollPosition,
          behavior: 'auto'
        })
      }
    }, isMobile ? 100 : 50)
  }, isMobile ? 200 : 100)
}

/**
 * Scroll to a specific element with optimized animation
 */
export const scrollToElement = (
  elementId: string,
  offset: number = 0,
  duration: number = 500
): void => {
  const element = document.getElementById(elementId)
  if (!element) return
  
  const elementPosition = element.getBoundingClientRect().top + window.scrollY
  const targetPosition = elementPosition - offset
  
  // Check if we're on mobile
  const isMobile = window.innerWidth <= 768
  
  if (isMobile) {
    // On mobile, just use native scrolling directly to the element
    window.scrollTo({
      top: targetPosition,
      behavior: 'auto'
    })
  } else {
    // On desktop, use the smooth scrolling animation
    smoothScrollTo(targetPosition, duration)
  }
}

/**
 * Initialize smooth scrolling for all anchor links
 */
export const initSmoothScrolling = (headerOffset: number = 0): void => {
  // Only initialize on client-side
  if (typeof window === 'undefined') return
  
  // Detect if device is mobile
  const isMobile = window.innerWidth <= 768
  
  // Use different duration based on device type
  const scrollDuration = isMobile ? 0 : 600 // No duration for mobile (instant)
  
  // Handle all anchor links
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement
    
    if (anchor) {
      e.preventDefault()
      
      const targetId = anchor.getAttribute('href')?.substring(1)
      if (targetId) {
        // If on mobile, use native scrolling
        if (isMobile) {
          const element = document.getElementById(targetId)
          if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.scrollY
            const targetPosition = elementPosition - headerOffset
            
            // Use native scrolling on mobile
            window.scrollTo({
              top: targetPosition,
              behavior: 'auto'
            })
          }
        } else {
          // On desktop, use our custom smooth scrolling
          scrollToElement(targetId, headerOffset, scrollDuration)
        }
      }
    }
  })
  
  // Only add scroll tracking on desktop
  if (!isMobile) {
    // Track scroll speed and prevent unwanted scroll jumps
    window.addEventListener('scroll', () => {
      const now = performance.now()
      const currentScrollY = window.scrollY
      
      // If this is a programmatic scroll, just update tracking variables
      if (isProgrammaticScroll) {
        lastScrollY = currentScrollY
        lastScrollTime = now
        return
      }
      
      // This is a user-initiated scroll
      isUserScrolling = true
      
      // Update the last user scroll position
      lastUserScrollPosition = currentScrollY
      userScrollTimestamp = now
      
      // Clear any existing timeout
      if (userScrollTimeout) {
        clearTimeout(userScrollTimeout)
      }
      
      // Set a timeout to mark the end of user scrolling
      userScrollTimeout = setTimeout(() => {
        isUserScrolling = false
      }, 200)
      
      // Add scrolling class
      if (!document.documentElement.classList.contains('is-scrolling')) {
        document.documentElement.classList.add('is-scrolling')
      }
      
      // Calculate scroll speed
      if (lastScrollTime > 0) {
        const deltaTime = now - lastScrollTime
        if (deltaTime > 0) {
          const deltaY = Math.abs(currentScrollY - lastScrollY)
          scrollSpeed = (deltaY / deltaTime) * 100 // px per 100ms
          
          // Add fast-scrolling class if speed exceeds threshold
          if (scrollSpeed > 30) {
            document.documentElement.classList.add('is-fast-scrolling')
          } else {
            document.documentElement.classList.remove('is-fast-scrolling')
          }
        }
      }
      
      lastScrollY = currentScrollY
      lastScrollTime = now
    }, { passive: true })
    
    // Clean up scroll classes after scrolling stops
    let scrollTimeout: NodeJS.Timeout
    const cleanupScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        // Only remove classes if we're not in a programmatic scroll
        if (!isProgrammaticScroll) {
          document.documentElement.classList.remove('is-scrolling')
          document.documentElement.classList.remove('is-fast-scrolling')
          scrollSpeed = 0
        }
      }, 150)
    }
    
    window.addEventListener('scroll', cleanupScroll, { passive: true })
  }
  
  // For mobile devices, add a resize listener to handle orientation changes
  if (isMobile) {
    window.addEventListener('resize', () => {
      // Reset any scroll-related classes
      document.documentElement.classList.remove('is-scrolling')
      document.documentElement.classList.remove('is-fast-scrolling')
    }, { passive: true })
  }
}