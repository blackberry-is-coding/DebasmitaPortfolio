/**
 * Utility for smooth reveal animations when scrolling
 * Uses Intersection Observer for better performance than scroll events
 */

// Track if we're on a mobile device
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

// Options for the intersection observer
const defaultOptions = {
  threshold: 0.1, // Trigger when 10% of the element is visible
  rootMargin: '0px 0px -10% 0px', // Slightly before the element comes into view
}

// Animation options
const defaultAnimationOptions = {
  duration: isMobile ? 600 : 800,
  delay: 0,
  easing: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)', // Smooth ease-out
  once: true, // Only animate once
  distance: '30px', // How far elements move when animating in
  opacity: 0, // Starting opacity
  scale: isMobile ? 0.97 : 0.95, // Starting scale
}

/**
 * Initialize smooth reveal animations for elements
 * @param selector CSS selector for elements to animate
 * @param options Animation options
 */
export const initSmoothReveal = (
  selector: string = '[data-animate]',
  options: Partial<typeof defaultAnimationOptions> = {}
): void => {
  // Only run on client
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return
  }

  // Merge default options with provided options
  const animationOptions = { ...defaultAnimationOptions, ...options }

  // Get all elements to animate
  const elements = document.querySelectorAll(selector)
  if (elements.length === 0) return

  // Create an observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Skip if we're scrolling fast (for performance)
      const isScrollingFast = document.documentElement.classList.contains('is-fast-scrolling')
      if (isScrollingFast && isMobile) return

      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement
        
        // Get animation direction from data attribute or default to 'up'
        const direction = element.dataset.animateDirection || 'up'
        
        // Get animation delay from data attribute or use default
        const delay = element.dataset.animateDelay 
          ? parseInt(element.dataset.animateDelay, 10) 
          : animationOptions.delay
        
        // Apply the animation
        animateElement(element, direction, {
          ...animationOptions,
          delay,
        })
        
        // Stop observing if we only animate once
        if (animationOptions.once) {
          observer.unobserve(element)
        }
      }
    })
  }, defaultOptions)

  // Start observing elements
  elements.forEach((element) => {
    // Set initial styles
    const el = element as HTMLElement
    const direction = el.dataset.animateDirection || 'up'
    
    // Skip if already animated
    if (el.classList.contains('has-animated')) return
    
    // Set initial styles
    setInitialStyles(el, direction, animationOptions)
    
    // Start observing
    observer.observe(el)
  })
}

/**
 * Set initial styles for an element before animation
 */
const setInitialStyles = (
  element: HTMLElement,
  direction: string,
  options: typeof defaultAnimationOptions
): void => {
  // Set initial opacity
  element.style.opacity = options.opacity.toString()
  
  // Set initial transform based on direction
  let transform = `scale(${options.scale})`
  
  switch (direction) {
    case 'up':
      transform += ` translateY(${options.distance})`
      break
    case 'down':
      transform += ` translateY(-${options.distance})`
      break
    case 'left':
      transform += ` translateX(${options.distance})`
      break
    case 'right':
      transform += ` translateX(-${options.distance})`
      break
  }
  
  element.style.transform = transform
  element.style.transition = 'none'
  element.style.willChange = 'opacity, transform'
}

/**
 * Animate an element into view
 */
const animateElement = (
  element: HTMLElement,
  direction: string,
  options: typeof defaultAnimationOptions
): void => {
  // Force a reflow to ensure the initial styles are applied
  void element.offsetWidth
  
  // Set transition properties
  element.style.transition = `opacity ${options.duration}ms ${options.easing} ${options.delay}ms, transform ${options.duration}ms ${options.easing} ${options.delay}ms`
  
  // Animate to final state
  element.style.opacity = '1'
  element.style.transform = 'scale(1) translate(0, 0)'
  
  // Mark as animated
  element.classList.add('has-animated')
  
  // Clean up styles after animation completes
  setTimeout(() => {
    element.style.willChange = 'auto'
  }, options.duration + options.delay + 100)
}