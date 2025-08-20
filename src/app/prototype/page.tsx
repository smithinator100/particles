'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ProfileAnimationDemo } from '../../components/profile-animation-demo'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export default function PrototypePage() {
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const scrollSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const header = headerRef.current
    const cards = cardsRef.current
    const scrollSection = scrollSectionRef.current

    if (!header || !cards || !scrollSection) return

    // Header animation
    gsap.fromTo(header, 
      { 
        opacity: 0, 
        y: 50 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.5, 
        ease: "power3.out" 
      }
    )

    // Cards stagger animation
    gsap.fromTo(cards.children,
      { 
        opacity: 0, 
        y: 100, 
        scale: 0.8 
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 1, 
        stagger: 0.2, 
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: cards,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    )

    // Scroll-triggered section
    gsap.fromTo(scrollSection,
      { 
        backgroundColor: "rgba(59, 130, 246, 0.1)" 
      },
      { 
        backgroundColor: "rgba(168, 85, 247, 0.2)", 
        duration: 2,
        scrollTrigger: {
          trigger: scrollSection,
          start: "top center",
          end: "bottom center",
          scrub: true
        }
      }
    )

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header Section */}
      <div ref={headerRef} className="text-center py-20 px-4">
        <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
          GSAP Animation Demo
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Exploring the power of GSAP with scroll-triggered animations, parallax effects, and smooth transitions
        </p>
        <div className="mt-8">
          <a 
            href="/tracker-test" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            🎯 Test Tracker Alignment
          </a>
        </div>
      </div>

      {/* Profile Animation Demo */}
      <ProfileAnimationDemo />

      {/* Cards Section */}
      <div ref={cardsRef} className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Smooth Animations", icon: "🚀", desc: "Buttery smooth 60fps animations" },
            { title: "Scroll Triggers", icon: "📜", desc: "Animations triggered by scroll position" },
            { title: "Parallax Effects", icon: "🌟", desc: "Beautiful depth and movement" }
          ].map((item, index) => (
            <div key={index} className="card bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll-triggered Section */}
      <div ref={scrollSectionRef} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Scroll-Triggered Magic
          </h2>
          <p className="text-xl text-gray-300 max-w-lg mx-auto">
            Watch as elements respond to your scroll position with buttery smooth animations powered by GSAP ScrollTrigger
          </p>
        </div>
      </div>
    </div>
  )
} 