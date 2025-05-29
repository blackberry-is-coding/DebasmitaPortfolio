/**
 * Optimized smooth scroll utility for mobile devices
 * Uses requestAnimationFrame for better performance than CSS scroll-behavior
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

  const startPosition = window.scrollY
  const distance = targetPosition - startPosition
  let startTime: number | null = null

  // Add scrolling class to optimize animations during scroll
  document.documentElement.classList.add('is-scrolling')

  // Easing function for smoother acceleration/deceleration
  const easeInOutQuad = (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  const animateScroll = (currentTime: number): void => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    const easedProgress = easeInOutQuad(progress)
    
    window.scrollTo(0, startPosition + distance * easedProgress)
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll)
    } else {
      // Ensure we end exactly at the target position
      window.scrollTo(0, targetPosition)
      
      // Remove scrolling class after a short delay
      setTimeout(() => {
        document.documentElement.classList.remove('is-scrolling')
        if (callback) callback()
      }, 100)
    }
  }
  
  requestAnimationFrame(animateScroll)
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
  const scrollDuration = isMobile ? 400 : 600
  
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
  
  // Optimize scroll performance
  let scrollTimeout: NodeJS.Timeout
  window.addEventListener('scroll', () => {
    if (!document.documentElement.classList.contains('is-scrolling')) {
      document.documentElement.classList.add('is-scrolling')
    }
    
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      document.documentElement.classList.remove('is-scrolling')
    }, 150)
  }, { passive: true })
}