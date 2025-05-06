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
  color: string
}

export default function SakuraAnimation() {
  const [petals, setPetals] = useState<Petal[]>([])
  const petalIdRef = useRef(0) // Unique ID generator

  useEffect(() => {
    // Create initial petals
    const initialPetals: Petal[] = []
    for (let i = 0; i < 30; i++) {
      initialPetals.push(createPetal())
    }
    setPetals(initialPetals)

    // Animation loop
    let animationFrame = requestAnimationFrame(animatePetals)

    // Periodically add new petals
    const interval = setInterval(() => {
      setPetals((currentPetals) => {
        const newPetal = createPetal()
        return [...currentPetals, newPetal]
      })
    }, 1000)

    return () => {
      cancelAnimationFrame(animationFrame)
      clearInterval(interval)
    }
  }, [])

  const createPetal = (): Petal => {
    const colors = ["#ffb7c5", "#ffc0cb", "#f8bbd0", "#e1bee7", "#d1c4e9"]
    const id = petalIdRef.current++
    return {
      id,
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * 100,
      size: 10 + Math.random() * 15,
      rotation: Math.random() * 360,
      rotationSpeed: 0.2 + Math.random() * 1,
      speed: 0.5 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
    }
  }

  const animatePetals = () => {
    setPetals((currentPetals) => {
      return currentPetals
        .map((petal) => {
          const x = petal.x + Math.sin(petal.y / 50) * 2
          const y = petal.y + petal.speed
          const rotation = petal.rotation + petal.rotationSpeed

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
            transform: `rotate(${petal.rotation}deg)`,
            transition: "transform 0.1s linear",
          }}
        >
          <svg viewBox="0 0 30 30" fill={petal.color} xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M15 0C15 0 15 15 0 15C0 15 15 15 15 30C15 30 15 15 30 15C30 15 15 15 15 0Z" />
          </svg>
        </div>
      ))}
    </div>
  )
}
