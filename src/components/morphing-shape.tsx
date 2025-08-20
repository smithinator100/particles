'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

interface MorphingShapeProps {
  className?: string
  autoPlay?: boolean
  duration?: number
}

export function MorphingShape({ 
  className = '', 
  autoPlay = true, 
  duration = 2 
}: MorphingShapeProps) {
  const shapeRef = useRef<SVGPathElement>(null)

  // Define different path shapes for morphing
  const shapes = [
    "M50,30 Q20,60 50,90 Q80,60 50,30 Z", // Diamond
    "M20,50 Q50,20 80,50 Q50,80 20,50 Z", // Rounded square
    "M50,20 A30,30 0 1,1 50,80 A30,30 0 1,1 50,20 Z", // Circle
    "M30,30 L70,30 L60,70 L40,70 Z", // Trapezoid
  ]

  useEffect(() => {
    if (!shapeRef.current || !MorphSVGPlugin) return

    gsap.registerPlugin(MorphSVGPlugin)

    if (autoPlay) {
      // Create infinite morphing animation
      const tl = gsap.timeline({ repeat: -1 })
      
      shapes.forEach((shape, index) => {
        const nextShape = shapes[(index + 1) % shapes.length]
        tl.to(shapeRef.current, {
          morphSVG: nextShape,
          duration: duration,
          ease: "power2.inOut"
        })
      })
    }

    return () => {
      gsap.killTweensOf(shapeRef.current)
    }
  }, [autoPlay, duration])

  const handleMouseEnter = () => {
    if (!autoPlay) {
      gsap.to(shapeRef.current, {
        morphSVG: shapes[1],
        duration: 0.5,
        ease: "power2.out"
      })
    }
  }

  const handleMouseLeave = () => {
    if (!autoPlay) {
      gsap.to(shapeRef.current, {
        morphSVG: shapes[0],
        duration: 0.5,
        ease: "power2.out"
      })
    }
  }

  return (
    <svg 
      width="100" 
      height="100" 
      viewBox="0 0 100 100" 
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <path
        ref={shapeRef}
        d={shapes[0]}
        fill="url(#gradient)"
        stroke="none"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  )
} 