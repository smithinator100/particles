'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

// Try to import Physics2D plugin - fallback to regular animation if not available
let Physics2DPlugin: any = null
try {
  const { Physics2DPlugin: Physics2D } = require('gsap/Physics2DPlugin')
  Physics2DPlugin = Physics2D
  gsap.registerPlugin(Physics2DPlugin)
} catch (e) {
  console.log('Physics2D plugin not available, using fallback animation')
}

type TrackerState = 'hidden' | 'intro' | 'blocked'

interface StarburstParams {
  dotCount: number
  dotSize: number
  travelDistance: number // In pixels
  scaleVariance: number // As ratio (0-1) for random scale variation
  distanceVariance: number // In pixels for random distance variation
  animationDuration: number
  staggerDelay: number
  scaleInDuration: number
  scaleInEase: string
  fadeOutDelay: number
  fadeOutDuration: number
  fadeOutScale: number
  fadeOutVariance: number // As ratio (0-1) for random fade out timing
  // Physics parameters
  physicsVelocityMultiplier: number
  physicsAngleVariance: number
  physicsGravity: number
  physicsFriction: number
  // Fallback animation parameters
  fallbackEase: string
  fallbackStagger: number
}

interface TrackerProps {
  className?: string
  size?: number
  burstColor?: string
  state?: TrackerState
  onStateChange?: (state: TrackerState) => void
  onExplode?: () => void
  showSettingsPanel?: boolean
  trackerType?: keyof typeof trackerLogos
}

// Tracker logo mapping with actual colors from SVG files
const trackerLogos = {
  'Facebook': { 
    file: 'Facebook-Round.svg', 
    name: 'Facebook', 
    color: '#1877F2' 
  },
  'Google': { 
    file: 'Google.svg', 
    name: 'Google', 
    color: '#4285F4' 
  },
  'Amazon': { 
    file: 'Amazon.svg', 
    name: 'Amazon', 
    color: '#FF9900' 
  },
  'Instagram': { 
    file: 'Instagram.svg', 
    name: 'Instagram', 
    color: '#E4405F' 
  },
  'Microsoft': { 
    file: 'Microsoft.svg', 
    name: 'Microsoft', 
    color: '#05A6F0' 
  },
  'Pinterest': { 
    file: 'Pinterest.svg', 
    name: 'Pinterest', 
    color: '#E60023' 
  },
  'Snap': { 
    file: 'Snap.svg', 
    name: 'Snap', 
    color: '#FFFC00' 
  },
  'Amplitude': { 
    file: 'Amplitude.svg', 
    name: 'Amplitude', 
    color: '#007FD2' 
  },
  'Mailchimp': { 
    file: 'Mailchimp.svg', 
    name: 'Mailchimp', 
    color: '#FFE01B' 
  },
  'Rubicon': { 
    file: 'Rubicon.svg', 
    name: 'Rubicon', 
    color: '#CF0A2C' 
  },
  'Sales-Force': { 
    file: 'Sales-Force.svg', 
    name: 'Salesforce', 
    color: '#00A1E0' 
  },
  'Smaato': { 
    file: 'Smaato.svg', 
    name: 'Smaato', 
    color: '#4CBBEB' 
  },
  'Tapad': { 
    file: 'Tapad.svg', 
    name: 'Tapad', 
    color: '#3D8DFD' 
  },
  'Adjust': { 
    file: 'Adjust.svg', 
    name: 'Adjust', 
    color: '#00BED5' 
  },
  'Cognitiv': { 
    file: 'Cognitiv.svg', 
    name: 'Cognitiv', 
    color: '#2E5BBA' 
  },
  'Inmar': { 
    file: 'Inmar.svg', 
    name: 'Inmar', 
    color: '#003D7A' 
  },
  'Intent-Iq': { 
    file: 'Intent-Iq.svg', 
    name: 'Intent IQ', 
    color: '#1B365D' 
  },
  'Liveintent': { 
    file: 'Liveintent.svg', 
    name: 'LiveIntent', 
    color: '#FF6B35' 
  },
  'Blocked': { 
    file: 'blocked-tracker.svg', 
    name: 'Blocked Tracker', 
    color: '#D1454A' 
  }
} as const

const defaultStarburstParams: StarburstParams = {
  dotCount: 12,
  dotSize: 0.26, // As ratio of tracker size
  travelDistance: 610, // In pixels
  scaleVariance: 0.3, // 30% scale variation
  distanceVariance: 300, // ±300px distance variation
  animationDuration: 1.2,
  staggerDelay: 0.028,
  scaleInDuration: 0.1,
  scaleInEase: "back.out(2)",
  fadeOutDelay: 0.6,
  fadeOutDuration: 0.8,
  fadeOutScale: 0.1,
  fadeOutVariance: 0.4, // 40% fade out timing variance
  // Physics parameters
  physicsVelocityMultiplier: 1.5,
  physicsAngleVariance: 90,
  physicsGravity: 50,
  physicsFriction: 0.1,
  // Fallback animation parameters
  fallbackEase: "power2.out",
  fallbackStagger: 0.02
}

export function Tracker({ 
  className = '', 
  size = 80,
  burstColor = '#1877F2',
  state = 'hidden',
  onStateChange,
  onExplode,
  showSettingsPanel = false,
  trackerType
}: TrackerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoContainerRef = useRef<HTMLDivElement>(null)
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const burstRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement[]>([])
  const circleStrokeRef = useRef<SVGCircleElement>(null)
  const lineRef = useRef<SVGLineElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentState, setCurrentState] = useState<TrackerState>(state)
  const [isInternalTransition, setIsInternalTransition] = useState(false)
  const [starburstParams, setStarburstParams] = useState<StarburstParams>(defaultStarburstParams)
  const [showPanel, setShowPanel] = useState(showSettingsPanel)
  const [selectedTracker, setSelectedTracker] = useState<keyof typeof trackerLogos>('Facebook')
  const autoPlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const explosionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastClickTimeRef = useRef<number>(0)

  // Get current tracker type and burst color
  const currentTrackerType = trackerType || selectedTracker
  const currentBurstColor = trackerLogos[currentTrackerType].color

  // Sync internal state with prop state
  useEffect(() => {
    if (state !== currentState && !isInternalTransition) {
      console.log('🔄 Syncing state prop:', state, '-> internal state:', currentState)
      const previousState = currentState
      setCurrentState(state)
      
      // For parent-controlled trackers, trigger the transition animation
      if (trackerType && state !== previousState) {
        transitionToState(state)
      }
    }
  }, [state, currentState, isInternalTransition, trackerType])

  const resetAllElements = () => {
    // Reset container
    if (containerRef.current) {
      gsap.set(containerRef.current, { 
        opacity: 1,
        visibility: 'visible',
        x: 0,
        y: 0,
        rotation: 0,
        rotationX: 0,
        rotationY: 0,
        transformPerspective: 'none',
        transformOrigin: 'center center'
      })
    }

    // Reset both containers with identical GSAP transforms
    if (logoContainerRef.current && svgContainerRef.current) {
      gsap.set([logoContainerRef.current, svgContainerRef.current], {
        scale: 1,
        opacity: 1,
        x: 0,
        y: 0,
        rotation: 0,
        transformOrigin: 'center center'
      })
    }

    // Reset stroke elements for drawing animation
    if (circleStrokeRef.current && lineRef.current && svgContainerRef.current) {
      const circleCircumference = 2 * Math.PI * 39 // radius is 39
      // Calculate line length for diagonal line from (12.4, 12.4) to (67.6, 67.6)
      const lineLength = Math.sqrt(Math.pow(67.6 - 12.4, 2) + Math.pow(67.6 - 12.4, 2))
      
      // Set up stroke drawing properties first
      gsap.set(circleStrokeRef.current, {
        strokeDasharray: circleCircumference,
        strokeDashoffset: circleCircumference
      })
      
      gsap.set(lineRef.current, {
        strokeDasharray: lineLength,
        strokeDashoffset: lineLength
      })
      
      // Then control SVG container visibility
      gsap.set(svgContainerRef.current, {
        opacity: currentState === 'blocked' ? 1 : 0
      })
    }

    // Reset dots
    const dots = dotsRef.current.filter(Boolean)
    gsap.set(dots, {
      scale: 0,
      opacity: 0,
      x: 0,
      y: 0,
      rotation: 0,
      transformOrigin: 'center center'
    })
  }

  useEffect(() => {
    console.log('🚀 Tracker component mounted')
    console.log('  - Initial state:', state)
    console.log('  - Initial current state:', currentState)
    resetAllElements()

    // Initialize container and both element containers based on current state
    if (containerRef.current && logoContainerRef.current && svgContainerRef.current) {
      switch (currentState) {
        case 'hidden':
          gsap.set(containerRef.current, { 
            opacity: 0,
            visibility: 'hidden'
          })
          gsap.set([logoContainerRef.current, svgContainerRef.current], {
            scale: 0,
            transformOrigin: 'center center'
          })
          break
        case 'intro':
        case 'blocked':
          gsap.set(containerRef.current, { 
            opacity: 1,
            visibility: 'visible'
          })
          gsap.set([logoContainerRef.current, svgContainerRef.current], {
            scale: 1,
            transformOrigin: 'center center'
          })
          break
      }
    }
  }, [])

  // Auto-play functionality - only when not controlled by parent
  useEffect(() => {
    // Skip auto-play if tracker is controlled by parent (trackerType prop provided)
    if (trackerType) {
      return
    }

    // Clear any existing timeout
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current)
    }
    
    // Start auto-play sequence from hidden state
    if (currentState === 'hidden' && !isAnimating) {
      console.log('🎬 Starting auto-play sequence from hidden')
      setIsInternalTransition(true)
      
      // Transition to intro immediately
      autoPlayTimeoutRef.current = setTimeout(() => {
        console.log('🎬 Auto-play: hidden -> intro')
        transitionToState('intro')
      }, 100) // Small delay to ensure component is ready
    }
    
    // Handle intro → blocked transition  
    if (currentState === 'intro' && !isAnimating && isInternalTransition) {
      console.log('🎬 Scheduling intro -> blocked transition')
      autoPlayTimeoutRef.current = setTimeout(() => {
        console.log('🎬 Auto-play: intro -> blocked')
        transitionToState('blocked')
      }, 800)
    }
    
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current)
      }
    }
  }, [currentState, isAnimating, isInternalTransition, trackerType])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current)
      }
      if (explosionTimeoutRef.current) {
        clearTimeout(explosionTimeoutRef.current)
      }
    }
  }, [])

  const transitionToState = (newState: TrackerState) => {
    if (isAnimating || newState === currentState) return
    
    setIsAnimating(true)
    setCurrentState(newState)

    if (!containerRef.current) {
      setIsAnimating(false)
      return
    }

    const container = containerRef.current

    // Only reset elements when transitioning TO visible states, not when hiding
    if (newState !== 'hidden') {
      resetAllElements()
    }

    switch (newState) {
      case 'hidden':
        if (logoContainerRef.current && svgContainerRef.current) {
          // Scale both containers down, then fade the main container
          gsap.to([logoContainerRef.current, svgContainerRef.current], {
            scale: 0,
            duration: 0.3,
            ease: "power2.in",
            transformOrigin: 'center center'
          })
          gsap.to(container, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              gsap.set(container, { visibility: 'hidden' })
              const wasInternalTransition = isInternalTransition
              setIsAnimating(false)
              setIsInternalTransition(false) // Clear internal transition flag
              // Only call onStateChange when transitioning to hidden after user explosion
              if (wasInternalTransition) {
                onStateChange?.(newState)
              }
            }
          })
        }
        break

      case 'intro':
        if (logoContainerRef.current && svgContainerRef.current) {
          gsap.set(container, { visibility: 'visible', opacity: 1, transformOrigin: 'center center' })
          // Hide SVG container for intro state
          gsap.set(svgContainerRef.current, { opacity: 0 })
          gsap.fromTo(logoContainerRef.current, 
            { 
              scale: 0,
              transformOrigin: 'center center'
            },
            {
              scale: 1,
              duration: 0.4,
              ease: "back.out(2.8)",
              transformOrigin: 'center center',
              onComplete: () => {
                setIsAnimating(false)
                // Don't call onStateChange for parent-controlled transitions
              }
            }
          )
        }
        break

      case 'blocked':
        playBlockedAnimation()
        break
    }
  }

  const playStarburstAnimation = () => {
    const dots = dotsRef.current.filter(Boolean)
    
    if (dots.length === 0) {
      return
    }

    // Kill any existing animations on the dots to allow restart
    gsap.killTweensOf(dots)

    // Reset dots to center position
    gsap.set(dots, {
      scale: 0,
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      transformOrigin: 'center center'
    })

    // Store scale variations for each dot
    const scaleVariations = dots.map(() => 1 + (Math.random() - 0.5) * starburstParams.scaleVariance * 2)

    // Animate dots appearing from center with individual scale targets
    dots.forEach((dot, index) => {
      gsap.to(dot, {
        scale: scaleVariations[index],
        duration: starburstParams.scaleInDuration,
        ease: starburstParams.scaleInEase
        // No delay - all start at once for explosion effect
      })
    })

    // Create starburst effect
    dots.forEach((dot, index) => {
      const angle = Math.random() * Math.PI * 2 // Random angle instead of evenly spaced
      const distance = starburstParams.travelDistance
      const randomDistance = distance + (Math.random() - 0.5) * starburstParams.distanceVariance * 2
      
      if (Physics2DPlugin) {
        // Use Physics2D plugin if available
        gsap.to(dot, {
          duration: starburstParams.animationDuration,
          physics2D: {
            velocity: randomDistance * starburstParams.physicsVelocityMultiplier,
            angle: (angle * 180) / Math.PI + (Math.random() - 0.5) * starburstParams.physicsAngleVariance,
            gravity: starburstParams.physicsGravity,
            friction: starburstParams.physicsFriction
          },
          ease: "none"
          // No delay - all start at once for explosion effect
        })
      } else {
        // Fallback animation without physics plugin
        const endX = Math.cos(angle) * randomDistance
        const endY = Math.sin(angle) * randomDistance
        
        gsap.to(dot, {
          x: endX,
          y: endY,
          duration: starburstParams.animationDuration * 0.6, // Shorter for fallback
          ease: starburstParams.fallbackEase
          // No delay - all start at once for explosion effect
        })
      }
      
      // Fade out dots with variance
      const fadeOutDelayVariance = starburstParams.fadeOutDelay * starburstParams.fadeOutVariance
      const fadeOutDurationVariance = starburstParams.fadeOutDuration * starburstParams.fadeOutVariance
      const randomFadeDelay = starburstParams.fadeOutDelay + (Math.random() - 0.5) * fadeOutDelayVariance * 2
      const randomFadeDuration = starburstParams.fadeOutDuration + (Math.random() - 0.5) * fadeOutDurationVariance * 2
      
      gsap.to(dot, {
        opacity: 0,
        scale: starburstParams.fadeOutScale,
        duration: Math.max(0.1, randomFadeDuration), // Ensure minimum duration
        delay: Math.max(0, randomFadeDelay), // Ensure non-negative delay
        ease: "power2.in"
      })
    })
  }

  const playBlockedAnimation = () => {
    if (!svgContainerRef.current || !logoContainerRef.current || !circleStrokeRef.current || !lineRef.current) {
      setIsAnimating(false)
      return
    }

    const svgContainer = svgContainerRef.current
    const logoContainer = logoContainerRef.current
    const circleStroke = circleStrokeRef.current
    const line = lineRef.current

    // Create drawing animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false)
        setIsInternalTransition(false) // Clear internal transition flag after blocked animation
        // Don't call onStateChange for parent-controlled transitions
      }
    })

    // First, show the SVG container
    tl.to(svgContainer, {
      opacity: 1,
      duration: 0.1,
      ease: "none"
    })

    // Then draw the circle stroke
    tl.to(circleStroke, {
      strokeDashoffset: 0,
      duration: 0.4,
      ease: "quad.out"
    }, "-=0.05")

    // Then draw the diagonal line
    tl.to(line, {
      strokeDashoffset: 0,
      duration: 0.4,
      ease: "quad.out"
    }, "+=0.2")

    // Animate both containers shrinking slightly and bouncing back
    tl.to([svgContainer, logoContainer], {
      scale: 0.95,
      duration: 0.15,
      ease: "power2.out",
      transformOrigin: 'center center'
    }, "-=0.2")

    // Both bounce back to normal size with overshoot
    tl.to([svgContainer, logoContainer], {
      scale: 1.05,
      duration: 0.2,
      ease: "back.out(1.5)",
      transformOrigin: 'center center'
    }, "-=0.05")

    // Settle back to normal
    tl.to([svgContainer, logoContainer], {
      scale: 1,
      duration: 0.3,
      ease: "elastic.out(1, 0.75)",
      transformOrigin: 'center center'
    }, "-=0.1")
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Debounce multiple rapid fire events (prevent double-clicking from multiple handlers)
    const now = Date.now()
    if (now - lastClickTimeRef.current < 100) { // 100ms debounce
      console.log('🚫 Click ignored - too soon after previous click')
      return
    }
    lastClickTimeRef.current = now
    
    console.log('=== TRACKER CLICKED ===')
    console.log('Current state:', currentState)
    
    // Allow clicking on any visible tracker - remove state restrictions for testing
    if (logoContainerRef.current && svgContainerRef.current) {
      console.log('✅ Triggering explosion sequence...')
      
      // Clear any existing explosion timeout
      if (explosionTimeoutRef.current) {
        clearTimeout(explosionTimeoutRef.current)
      }
      
      // Immediately hide logo and SVG on click
      gsap.to([logoContainerRef.current, svgContainerRef.current], {
        opacity: 0,
        duration: 0.1,
        ease: "power2.out",
        onComplete: () => {
          // After logo/SVG disappear, trigger starburst animation
          playStarburstAnimation()
          
          // Remove from parent list after allowing starburst to be visible
          explosionTimeoutRef.current = setTimeout(() => {
            console.log('💥 Calling onExplode to remove tracker from list')
            onExplode?.()
          }, 1400) // Give full time for the starburst animation to complete (1.2s + fade out)
        }
      })
    } else {
      console.log('❌ Click ignored - elements not found')
    }
  }

  const updateParam = (key: keyof StarburstParams, value: number | string) => {
    setStarburstParams(prev => ({ ...prev, [key]: value }))
  }

  const exportParams = () => {
    const dataStr = JSON.stringify(starburstParams, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'starburst-animation-params.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const resetParams = () => {
    setStarburstParams(defaultStarburstParams)
  }

  const easingOptions = [
    "none",
    "power1.out",
    "power2.out", 
    "power3.out",
    "power4.out",
    "back.out(1.7)",
    "back.out(2)",
    "back.out(3)",
    "elastic.out(1, 0.3)",
    "elastic.out(1, 0.5)",
    "bounce.out",
    "circ.out",
    "expo.out",
    "sine.out"
  ]

  return (
    <div className={`flex justify-center items-center ${className}`}>
      {/* Settings Panel */}
      {showPanel && (
        <div 
          className="fixed w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-30 max-h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar"
          style={{ 
            top: '80px', 
            left: '348px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 #f1f5f9'
          }}
        >
          <style dangerouslySetInnerHTML={{
            __html: `
              .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 3px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 3px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
              }
            `
          }} />
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Starburst Controls</h3>
            <button
              onClick={() => setShowPanel(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Tracker Logo */}
            <div className="border-b pb-3">
              <h4 className="font-semibold mb-2 text-gray-800">Tracker Logo</h4>
              
              <select
                value={selectedTracker}
                onChange={(e) => setSelectedTracker(e.target.value as keyof typeof trackerLogos)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                {Object.entries(trackerLogos).map(([key, { name }]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Basic Parameters */}
            <div className="border-b pb-3">
              <h4 className="font-semibold mb-2 text-gray-800">Basic Settings</h4>
              
              {/* Dot Count */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dot Count: {starburstParams.dotCount}
                </label>
                <input
                  type="range"
                  min="4"
                  max="30"
                  value={starburstParams.dotCount}
                  onChange={(e) => updateParam('dotCount', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Dot Size */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dot Size: {(starburstParams.dotSize * 100).toFixed(0)}% of tracker
                </label>
                <input
                  type="range"
                  min="0.05"
                  max="0.3"
                  step="0.01"
                  value={starburstParams.dotSize}
                  onChange={(e) => updateParam('dotSize', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Travel Distance */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Distance: {starburstParams.travelDistance}px
                </label>
                <input
                  type="range"
                  min="50"
                  max="800"
                  step="10"
                  value={starburstParams.travelDistance}
                  onChange={(e) => updateParam('travelDistance', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Scale Variance */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scale Variance: ±{(starburstParams.scaleVariance * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.05"
                  value={starburstParams.scaleVariance}
                  onChange={(e) => updateParam('scaleVariance', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Distance Variance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distance Variance: ±{starburstParams.distanceVariance}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="10"
                  value={starburstParams.distanceVariance}
                  onChange={(e) => updateParam('distanceVariance', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Animation Timing */}
            <div className="border-b pb-3">
              <h4 className="font-semibold mb-2 text-gray-800">Animation Timing</h4>
              
              {/* Animation Duration */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Animation Duration: {starburstParams.animationDuration.toFixed(1)}s
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={starburstParams.animationDuration}
                  onChange={(e) => updateParam('animationDuration', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Stagger Delay */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stagger Delay: {(starburstParams.staggerDelay * 1000).toFixed(0)}ms
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.1"
                  step="0.001"
                  value={starburstParams.staggerDelay}
                  onChange={(e) => updateParam('staggerDelay', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Scale In Duration */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scale In Duration: {starburstParams.scaleInDuration.toFixed(2)}s
                </label>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.01"
                  value={starburstParams.scaleInDuration}
                  onChange={(e) => updateParam('scaleInDuration', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Scale In Ease */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scale In Easing
                </label>
                <select
                  value={starburstParams.scaleInEase}
                  onChange={(e) => updateParam('scaleInEase', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  {easingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fade Out Parameters */}
            <div className="border-b pb-3">
              <h4 className="font-semibold mb-2 text-gray-800">Fade Out</h4>
              
              {/* Fade Out Delay */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fade Out Delay: {starburstParams.fadeOutDelay.toFixed(1)}s
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={starburstParams.fadeOutDelay}
                  onChange={(e) => updateParam('fadeOutDelay', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Fade Out Duration */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fade Out Duration: {starburstParams.fadeOutDuration.toFixed(1)}s
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={starburstParams.fadeOutDuration}
                  onChange={(e) => updateParam('fadeOutDuration', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Fade Out Scale */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Final Scale: {starburstParams.fadeOutScale.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={starburstParams.fadeOutScale}
                  onChange={(e) => updateParam('fadeOutScale', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Fade Out Variance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fade Out Variance: ±{(starburstParams.fadeOutVariance * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.05"
                  value={starburstParams.fadeOutVariance}
                  onChange={(e) => updateParam('fadeOutVariance', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Physics Parameters (if Physics2D available) */}
            {Physics2DPlugin && (
              <div className="border-b pb-3">
                <h4 className="font-semibold mb-2 text-gray-800">Physics2D Settings</h4>
                
                {/* Velocity Multiplier */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Velocity Multiplier: {starburstParams.physicsVelocityMultiplier.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={starburstParams.physicsVelocityMultiplier}
                    onChange={(e) => updateParam('physicsVelocityMultiplier', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Angle Variance */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Angle Variance: ±{starburstParams.physicsAngleVariance.toFixed(0)}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={starburstParams.physicsAngleVariance}
                    onChange={(e) => updateParam('physicsAngleVariance', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Gravity */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gravity: {starburstParams.physicsGravity}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={starburstParams.physicsGravity}
                    onChange={(e) => updateParam('physicsGravity', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Friction */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Friction: {starburstParams.physicsFriction.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={starburstParams.physicsFriction}
                    onChange={(e) => updateParam('physicsFriction', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Fallback Parameters */}
            <div className="border-b pb-3">
              <h4 className="font-semibold mb-2 text-gray-800">Fallback Animation</h4>
              
              {/* Fallback Ease */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fallback Easing
                </label>
                <select
                  value={starburstParams.fallbackEase}
                  onChange={(e) => updateParam('fallbackEase', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  {easingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fallback Stagger */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fallback Stagger: {(starburstParams.fallbackStagger * 1000).toFixed(0)}ms
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.1"
                  step="0.001"
                  value={starburstParams.fallbackStagger}
                  onChange={(e) => updateParam('fallbackStagger', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={exportParams}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Export
              </button>
              <button
                onClick={resetParams}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Panel Toggle Button */}
      {!showPanel && showSettingsPanel && (
        <button
          onClick={() => setShowPanel(true)}
          className="fixed bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors z-30 text-sm font-medium"
          style={{ top: '80px', left: '380px' }}
        >
          Show Settings
        </button>
      )}

      <div 
        ref={containerRef}
        className="relative select-none"
        style={{ 
          width: size * 3,
          height: size * 3,
          transformOrigin: 'center center'
        }}
      >
        {/* Clickable area - just the tracker size to prevent overlap */}
        <div
          className="absolute cursor-pointer"
          onClick={handleClick}
          onMouseDown={handleClick} // Also handle mousedown as backup
          onTouchStart={(e) => {
            e.preventDefault()
            e.stopPropagation()
            // Convert touch event to mouse-like event
            const mouseEvent = {
              preventDefault: () => e.preventDefault(),
              stopPropagation: () => e.stopPropagation()
            } as React.MouseEvent
            handleClick(mouseEvent)
          }}
          style={{
            width: size,
            height: size,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            pointerEvents: 'auto',
            position: 'absolute',
            // Removed debug background
          }}
        />

        {/* Starburst dots - positioned first so they appear behind the logo */}
        {Array.from({ length: starburstParams.dotCount }).map((_, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) {
                dotsRef.current[index] = el
                // Removed console.log to prevent spam
              }
            }}
            className="absolute rounded-full"
            style={{
              backgroundColor: currentBurstColor,
              width: size * starburstParams.dotSize,
              height: size * starburstParams.dotSize,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              transformOrigin: 'center center',
              opacity: 0,
              boxShadow: `0 2px 8px rgba(0, 0, 0, 0.2)`,
              zIndex: 1,
              pointerEvents: 'none', // Explicitly disable pointer events
              userSelect: 'none', // Prevent text selection
            }}
          />
        ))}

        {/* Logo container - exact tracker size */}
        <div
          ref={logoContainerRef}
          className="absolute pointer-events-none"
          style={{
            width: size,
            height: size,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            transformOrigin: 'center center',
            zIndex: 2
          }}
        >
          <img
            ref={logoRef}
            src={`/images/tracker_logos/${trackerLogos[currentTrackerType].file}`}
            alt={trackerLogos[currentTrackerType].name}
            style={{
              width: '100%',
              height: '100%',
              filter: 'drop-shadow(2px 4px 12px rgba(8, 41, 60, 0.16))'
            }}
          />
        </div>

        {/* Blocked overlay SVG container - exact tracker size */}
        <div
          ref={svgContainerRef}
          className="absolute pointer-events-none"
          style={{
            width: size,
            height: size,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            transformOrigin: 'center center',
            zIndex: 3
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-all duration-75 hover:brightness-110 active:brightness-95 pointer-events-none"
          >
            <defs>
              <clipPath id="clip0_47_6262">
                <rect width="80" height="80" rx="40" fill="white"/>
              </clipPath>
            </defs>
            <g clipPath="url(#clip0_47_6262)">
              {/* Diagonal line */}
              <line
                ref={lineRef}
                x1="12.4"
                y1="12.4"
                x2="67.6"
                y2="67.6"
                stroke="#D1454A"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Circle stroke for drawing animation */}
              <circle 
                ref={circleStrokeRef}
                cx="40" 
                cy="40" 
                r="39" 
                stroke="#D1454A" 
                strokeWidth="6"
                fill="none"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
} 