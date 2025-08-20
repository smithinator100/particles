'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
  triggerOnScroll?: boolean
}

export function AnimatedText({ 
  text, 
  className = '', 
  delay = 0, 
  stagger = 0.05,
  triggerOnScroll = false 
}: AnimatedTextProps) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!textRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    // Split text into individual characters
    const chars = textRef.current.querySelectorAll('.char')
    
    gsap.set(chars, { opacity: 0, y: 50 })

    if (triggerOnScroll) {
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: stagger,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      })
    } else {
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: stagger,
        ease: "back.out(1.7)",
        delay: delay
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [delay, stagger, triggerOnScroll])

  const renderText = () => {
    return text.split('').map((char, index) => (
      <span key={index} className="char inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }

  return (
    <div ref={textRef} className={className}>
      {renderText()}
    </div>
  )
} 