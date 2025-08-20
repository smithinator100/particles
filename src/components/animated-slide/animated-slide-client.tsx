"use client"

import { useRef, useLayoutEffect, useEffect, useState } from 'react'
import gsap from 'gsap'
// If you use Shadcn UI, adjust the import paths below as needed
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// import { Button } from '@/components/ui/button'













export function AnimatedSlideClient() {
  const [state, setState] = useState(0)
  const [copyFeedback, setCopyFeedback] = useState('')
  
  // Global animation control states
  const [staggerInterval, setStaggerInterval] = useState(0.2)
  const [staggerMultiplier, setStaggerMultiplier] = useState(1)
  
  // Individual word controls
  const [protection, setProtection] = useState({
    distance: 60,
    duration: 0.6,
    easing: "sine.inOut"
  })
  
  const [privacy, setPrivacy] = useState({
    distance: 60,
    duration: 0.6,
    easing: "sine.inOut"
  })
  
  const [peaceOfMind, setPeaceOfMind] = useState({
    distance: 60,
    duration: 0.6,
    easing: "sine.inOut"
  })

  // Presets
  const presets = {
    "default": {
      global: {
        staggerInterval: 0.2,
        staggerMultiplier: 1
      },
      words: {
        protection: {
          distance: 60,
          duration: 0.6,
          easing: "sine.inOut"
        },
        privacy: {
          distance: 60,
          duration: 0.6,
          easing: "sine.inOut"
        },
        peaceOfMind: {
          distance: 60,
          duration: 0.6,
          easing: "sine.inOut"
        }
      }
    },
    "state1-power-ease": {
      global: {
        staggerInterval: 0.1,
        staggerMultiplier: 1.2
      },
      words: {
        protection: {
          distance: 100,
          duration: 0.8,
          easing: "power4.out"
        },
        privacy: {
          distance: 100,
          duration: 0.8,
          easing: "power3.out"
        },
        peaceOfMind: {
          distance: 100,
          duration: 0.8,
          easing: "power2.out"
        }
      }
    },
    "state1-back-ease": {
      global: {
        staggerInterval: 0.25,
        staggerMultiplier: 0.6
      },
      words: {
        protection: {
          distance: 60,
          duration: 0.8,
          easing: "back.out(3)"
        },
        privacy: {
          distance: 80,
          duration: 0.8,
          easing: "back.out(1.7)"
        },
        peaceOfMind: {
          distance: 100,
          duration: 0.8,
          easing: "back.out(1.7)"
        }
      }
    }
  }
  
  // Refs for individual text parts in state 1
  const protectionRef = useRef<HTMLSpanElement>(null)
  const privacyRef = useRef<HTMLSpanElement>(null)
  const peaceOfMindRef = useRef<HTMLSpanElement>(null)

  const easingOptions = [
    // Sine easing
    "sine.in",
    "sine.out", 
    "sine.inOut",
    
    // Power easing
    "power1.in",
    "power1.out",
    "power1.inOut",
    "power2.in",
    "power2.out", 
    "power2.inOut",
    "power3.in",
    "power3.out",
    "power3.inOut",
    "power4.in",
    "power4.out",
    "power4.inOut",
    
    // Quart & Quint
    "quart.in",
    "quart.out",
    "quart.inOut",
    "quint.in",
    "quint.out",
    "quint.inOut",
    
    // Back easing (with overshoot)
    "back.in(1.7)",
    "back.out(1.7)",
    "back.inOut(1.7)",
    "back.in(3)",
    "back.out(3)",
    "back.inOut(3)",
    
    // Elastic easing
    "elastic.in(1, 0.3)",
    "elastic.out(1, 0.3)",
    "elastic.inOut(1, 0.3)",
    "elastic.in(1, 0.5)",
    "elastic.out(1, 0.5)",
    "elastic.inOut(1, 0.5)",
    
    // Bounce easing
    "bounce.in",
    "bounce.out",
    "bounce.inOut",
    
    // Circular easing
    "circ.in",
    "circ.out",
    "circ.inOut",
    
    // Exponential easing
    "expo.in",
    "expo.out",
    "expo.inOut",
    
    // Linear (no easing)
    "none"
  ]

  useLayoutEffect(() => {
    // Set initial state for individual text parts when they exist
    if (protectionRef.current && privacyRef.current && peaceOfMindRef.current) {
      gsap.set(protectionRef.current, {
        y: protection.distance,
        opacity: 0,
      })
      gsap.set(privacyRef.current, {
        y: privacy.distance,
        opacity: 0,
      })
      gsap.set(peaceOfMindRef.current, {
        y: peaceOfMind.distance,
        opacity: 0,
      })
    }
  }, [state, protection.distance, privacy.distance, peaceOfMind.distance])

  useEffect(() => {
    console.log('State changed to:', state)
    
    if (state === 1) {
      // State 1: Staggered animation with individual settings for each word
      console.log('Animating text parts in state 1')
      
      // Calculate stagger delays with multiplier
      const baseStagger = staggerInterval * staggerMultiplier
      
      // Animate each text part with individual settings and staggered timing
      gsap.to(protectionRef.current, {
        y: 0,
        opacity: 1,
        duration: protection.duration,
        ease: protection.easing,
        onComplete: () => console.log('Protection animation complete')
      })
      gsap.to(privacyRef.current, {
        y: 0,
        opacity: 1,
        duration: privacy.duration,
        ease: privacy.easing,
        delay: baseStagger,
        onComplete: () => console.log('Privacy animation complete')
      })
      gsap.to(peaceOfMindRef.current, {
        y: 0,
        opacity: 1,
        duration: peaceOfMind.duration,
        ease: peaceOfMind.easing,
        delay: baseStagger * 2,
        onComplete: () => console.log('Peace of mind animation complete')
      })
    }
  }, [state, protection, privacy, peaceOfMind, staggerInterval, staggerMultiplier])

  function handleNext() {
    console.log('Click detected, current state:', state)
    // Toggle between state 0 and state 1
    const nextState = state === 0 ? 1 : 0
    setState(nextState)
    console.log('Toggling to state:', nextState)
  }

  function copySettings() {
    const settings = {
      global: {
        staggerInterval,
        staggerMultiplier
      },
      words: {
        protection,
        privacy,
        peaceOfMind
      }
    }
    
    const settingsJson = JSON.stringify(settings, null, 2)
    
    navigator.clipboard.writeText(settingsJson).then(() => {
      setCopyFeedback('✓ Settings copied!')
      setTimeout(() => setCopyFeedback(''), 2000)
    }).catch(() => {
      setCopyFeedback('✗ Copy failed')
      setTimeout(() => setCopyFeedback(''), 2000)
    })
  }

  function loadPreset(presetName: string) {
    const preset = presets[presetName as keyof typeof presets]
    if (preset) {
      // Load global settings
      setStaggerInterval(preset.global.staggerInterval)
      setStaggerMultiplier(preset.global.staggerMultiplier)
      
      // Load word settings
      setProtection(preset.words.protection)
      setPrivacy(preset.words.privacy)
      setPeaceOfMind(preset.words.peaceOfMind)
      
      setCopyFeedback(`✓ Loaded "${presetName}" preset!`)
      setTimeout(() => setCopyFeedback(''), 2000)
    }
  }

  console.log('Component rendering, current state:', state)

  return (
    <main className="relative min-h-screen w-full bg-white flex flex-col items-center justify-center py-16">
      {/* Control Panel */}
      <div className="fixed top-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-10 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-3">Animation Controls</h3>
        
        {/* Presets Section */}
        <div className="mb-4 pb-3 border-b">
          <h4 className="font-semibold mb-2">Presets</h4>
          <div className="space-y-2">
            {Object.keys(presets).map((presetName) => (
              <button
                key={presetName}
                onClick={() => loadPreset(presetName)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 rounded transition-colors text-sm"
              >
                {presetName}
              </button>
            ))}
          </div>
        </div>
        
        {/* Copy Settings Button */}
        <div className="mb-4 pb-3 border-b">
          <button
            onClick={copySettings}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Copy Settings
          </button>
          {copyFeedback && (
            <div className="mt-2 text-sm text-center font-medium">
              {copyFeedback}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          {/* Global Stagger Controls */}
          <div className="border-b pb-3">
            <h4 className="font-semibold mb-2">Global Timing</h4>
            
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Stagger Interval: {staggerInterval}s
                </label>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={staggerInterval}
                  onChange={(e) => setStaggerInterval(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Stagger Multiplier: {staggerMultiplier}x
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={staggerMultiplier}
                  onChange={(e) => setStaggerMultiplier(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Protection Controls */}
          <div className="border-b pb-3">
            <h4 className="font-semibold mb-2 text-[#29c589]">Protection</h4>
            
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Distance: {protection.distance}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="150"
                  value={protection.distance}
                  onChange={(e) => setProtection({...protection, distance: Number(e.target.value)})}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Duration: {protection.duration}s
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.1"
                  value={protection.duration}
                  onChange={(e) => setProtection({...protection, duration: Number(e.target.value)})}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Easing Type
                </label>
                <select
                  value={protection.easing}
                  onChange={(e) => setProtection({...protection, easing: e.target.value})}
                  className="w-full p-1 border border-gray-300 rounded text-sm"
                >
                  {easingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Privacy Controls */}
          <div className="border-b pb-3">
            <h4 className="font-semibold mb-2 text-[#4c9df3]">Privacy</h4>
            
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Distance: {privacy.distance}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="150"
                  value={privacy.distance}
                  onChange={(e) => setPrivacy({...privacy, distance: Number(e.target.value)})}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Duration: {privacy.duration}s
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.1"
                  value={privacy.duration}
                  onChange={(e) => setPrivacy({...privacy, duration: Number(e.target.value)})}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Easing Type
                </label>
                <select
                  value={privacy.easing}
                  onChange={(e) => setPrivacy({...privacy, easing: e.target.value})}
                  className="w-full p-1 border border-gray-300 rounded text-sm"
                >
                  {easingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Peace of Mind Controls */}
          <div>
            <h4 className="font-semibold mb-2 text-[#8d75cd]">Peace of Mind</h4>
            
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Distance: {peaceOfMind.distance}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="150"
                  value={peaceOfMind.distance}
                  onChange={(e) => setPeaceOfMind({...peaceOfMind, distance: Number(e.target.value)})}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Duration: {peaceOfMind.duration}s
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.1"
                  value={peaceOfMind.duration}
                  onChange={(e) => setPeaceOfMind({...peaceOfMind, duration: Number(e.target.value)})}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Easing Type
                </label>
                <select
                  value={peaceOfMind.easing}
                  onChange={(e) => setPeaceOfMind({...peaceOfMind, easing: e.target.value})}
                  className="w-full p-1 border border-gray-300 rounded text-sm"
                >
                  {easingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        className="cursor-pointer flex-1 flex items-center justify-center w-full"
        onClick={handleNext}
        role="button"
        tabIndex={0}
        aria-label="Progress to next slide"
      >
        <section className="w-full max-w-5xl mx-auto px-4">
          <div className="mb-16 text-center">
            <h1
              className="text-[48px] font-extrabold leading-[48px] tracking-[-0.48px] mb-4 font-['Proxima_Nova',_sans-serif]"
              style={{ fontFamily: 'Proxima Nova', fontWeight: 800, letterSpacing: '-0.48px', lineHeight: '48px' }}
            >
              {state >= 1 && (
                <>
                  <span 
                    ref={protectionRef}
                    className="text-[#29c589] inline-block"
                  >
                    Protection.
                  </span>{' '}
                  <span 
                    ref={privacyRef}
                    className="text-[#4c9df3] inline-block"
                  >
                    Privacy.
                  </span>{' '}
                  <span 
                    ref={peaceOfMindRef}
                    className="text-[#8d75cd] inline-block"
                  >
                    Peace of mind.
                  </span>
                </>
              )}
            </h1>
            {state >= 2 && (
              <p
                className="text-[48px] font-extrabold leading-[48px] tracking-[-0.48px] font-['Proxima_Nova',_sans-serif]"
                style={{ fontFamily: 'Proxima Nova', fontWeight: 800, letterSpacing: '-0.48px', lineHeight: '48px' }}
              >
                Get the browser built for data protection, not data collection.
              </p>
            )}
          </div>
          {state >= 3 && (
            <div className="flex flex-col items-center gap-5">
              <div className="uppercase text-[14px] font-semibold tracking-[2.1px] text-[#222] mb-2 font-['Proxima_Nova',_sans-serif]">
                The duck duck go browser is already available on
              </div>
              <div className="flex flex-row gap-2">
                <button className="flex items-center justify-center gap-2 w-[140px] h-[44px] px-5 rounded-[8px] border-0 bg-[rgba(0,0,0,0.06)] text-[#222] text-[16px] font-bold leading-[1]">
                  Mac
                </button>
                <button className="flex items-center justify-center gap-2 w-[140px] h-[44px] px-5 rounded-[8px] border-0 bg-[rgba(0,0,0,0.06)] text-[#222] text-[16px] font-bold leading-[1]">
                  iOS
                </button>
                <button className="flex items-center justify-center gap-2 w-[140px] h-[44px] px-5 rounded-[8px] border-0 bg-[rgba(0,0,0,0.06)] text-[#222] text-[16px] font-bold leading-[1]">
                  Windows
                </button>
                <button className="flex items-center justify-center gap-2 w-[140px] h-[44px] px-5 rounded-[8px] border-0 bg-[rgba(0,0,0,0.06)] text-[#222] text-[16px] font-bold leading-[1]">
                  Android
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
} 