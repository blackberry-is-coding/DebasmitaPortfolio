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

  // For mobile devices, use a simpler approach for better performance
  const isMobile = window.innerWidth <= 768
  if (isMobile) {
    // On mobile, use a simpler approach with fewer animation frames
    simpleSmoothScrollMobile(currentPosition, targetPosition, duration, callback)
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
  if (Math.abs(distance) < 150) {
    window.scrollTo(0, targetPosition)
    finishScroll(callback)
    return
  }
  
  // For mobile, use a stepped approach with fewer frames
  // This reduces the rendering load significantly
  const steps = Math.min(Math.floor(duration / 40), 6) // Reduced to 6 steps for better performance
  const timePerStep = duration / steps
  let currentStep = 0
  let isScrolling = true
  
  // Create a more natural easing function
  const easeOutQuint = (x: number): number => {
    return 1 - Math.pow(1 - x, 3)
  }
  
  const doStep = () => {
    // Check if the scroll has been interrupted by user
    if (!isProgrammaticScroll || !isScrolling) {
      finishScroll(callback)
      return
    }
    
    currentStep++
    
    // Calculate progress (0 to 1)
    const progress = currentStep / steps
    
    // Use a smoother easing function
    const easedProgress = easeOutQuint(progress)
    
    // Calculate new position
    const newPosition = Math.round(startPosition + distance * easedProgress)
    
    // Scroll to new position
    window.scrollTo(0, newPosition)
    
    // Continue if we have more steps
    if (currentStep < steps) {
      setTimeout(doStep, timePerStep)
    } else {
      // Final position
      window.scrollTo(0, targetPosition)
      finishScroll(callback)
    }
  }
  
  // Allow user to interrupt the scroll
  const interruptScroll = () => {
    if (isProgrammaticScroll) {
      isScrolling = false
    }
  }
  
  // Listen for user scroll events that might interrupt our animation
  window.addEventListener('wheel', interruptScroll, { passive: true, once: true })
  window.addEventListener('touchmove', interruptScroll, { passive: true, once: true })
  
  // Start the stepped animation
  setTimeout(doStep, 10) // Start almost immediately for better responsiveness
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
  
  smoothScrollTo(targetPosition, duration)
}

/**
 * Initialize smooth scrolling for all anchor links
 */
export const initSmoothScrolling = (headerOffset: number = 0): void => {
  // Only initialize on client-side
  if (typeof window === 'undefined') return
  
  // Detect if device is mobile
  const isMobile = window.innerWidth <= 768
  
  // Use shorter duration on mobile for snappier response
  const scrollDuration = isMobile ? 300 : 600
  
  // Handle all anchor links
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement
    
    if (anchor) {
      e.preventDefault()
      
      const targetId = anchor.getAttribute('href')?.substring(1)
      if (targetId) {
        scrollToElement(targetId, headerOffset, scrollDuration)
      }
    }
  })
  
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
        // Use a higher threshold for mobile devices to prevent flickering
        const isMobile = window.innerWidth <= 768
        const speedThreshold = isMobile ? 50 : 30
        
        if (scrollSpeed > speedThreshold) {
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
    // Determine if we're on mobile
    const isMobile = window.innerWidth <= 768
    
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      // Only remove classes if we're not in a programmatic scroll
      if (!isProgrammaticScroll) {
        document.documentElement.classList.remove('is-scrolling')
        document.documentElement.classList.remove('is-fast-scrolling')
        scrollSpeed = 0
      }
      
      // Check if the page has unexpectedly jumped from the user's last position
      // This prevents the mysterious scroll-back issue
      if (!isUserScrolling && !isProgrammaticScroll) {
        const currentPosition = window.scrollY
        const timeSinceUserScroll = performance.now() - userScrollTimestamp
        
        // If it's been less than 1 second since the user scrolled and
        // the position has changed significantly without user or programmatic action,
        // restore the user's last position
        if (
          timeSinceUserScroll < 1000 && 
          Math.abs(currentPosition - lastUserScrollPosition) > 100
        ) {
          // Restore the user's last scroll position
          window.scrollTo({
            top: lastUserScrollPosition,
            behavior: 'auto'
          })
        }
      }
    }, isMobile ? 300 : 150) // Use a longer delay on mobile to prevent flickering
  }
  
  window.addEventListener('scroll', cleanupScroll, { passive: true })
}