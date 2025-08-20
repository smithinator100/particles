"use client"

import { useRef, useLayoutEffect, useEffect, useState, ReactNode } from 'react'
import gsap from 'gsap'
// If you use Shadcn UI, adjust the import paths below as needed
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// import { Button } from '@/components/ui/button'

const states = [
  'Blank',
  'Headline',
  'Headline + Subheadline',
  'Headline + Subheadline + Buttons',
] as const

interface PlatformButtonProps {
  label: string;
  icon: ReactNode;
}

function PlatformButton({ label, icon }: PlatformButtonProps) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 w-[140px] h-[44px] px-5 rounded-[8px] border-0 bg-[rgba(0,0,0,0.06)] text-[#222] text-[16px] font-bold leading-[1] font-['Proxima_Nova',_sans-serif] shadow-none select-none"
      style={{ fontFamily: 'Proxima Nova', fontWeight: 700, lineHeight: '100%' }}
    >
      <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      {label}
    </button>
  );
}

function PlatformMacOs20() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 18 16">
      <g>
        <path d="M5.625 4.14286C5.625 3.74837 5.3102 3.42857 4.92188 3.42857C4.53355 3.42857 4.21875 3.74837 4.21875 4.14286V6.14286C4.21875 6.53735 4.53355 6.85714 4.92188 6.85714C5.3102 6.85714 5.625 6.53735 5.625 6.14286V4.14286Z" fill="#222" fillOpacity="0.84" />
        <path d="M13.7812 4.14286C13.7812 3.74837 13.4665 3.42857 13.0781 3.42857C12.6898 3.42857 12.375 3.74837 12.375 4.14286V6.14286C12.375 6.53735 12.6898 6.85714 13.0781 6.85714C13.4665 6.85714 13.7812 6.53735 13.7812 6.14286V4.14286Z" fill="#222" fillOpacity="0.84" />
        <path clipRule="evenodd" d="M3.51562 0C1.574 0 0 1.59898 0 3.57143V12.4286C0 14.401 1.574 16 3.51562 16H14.4844C16.426 16 18 14.401 18 12.4286V3.57143C18 1.59898 16.426 0 14.4844 0H3.51562ZM1.40625 3.57143C1.40625 2.38796 2.35065 1.42857 3.51562 1.42857H9.01909C8.01248 2.8331 6.75 5.26515 6.75 8.42857C6.75 8.82306 7.0648 9.14286 7.45312 9.14286H8.72518C8.73873 9.88307 8.77302 10.5452 8.82149 11.136C6.64605 11.0373 5.07611 9.89421 4.59108 9.36864C4.32549 9.08084 3.88053 9.06626 3.59723 9.33607C3.31393 9.60588 3.29958 10.0579 3.56517 10.3457C4.27632 11.1163 6.26729 12.5231 8.9831 12.5702C9.05857 13.0831 9.14396 13.5174 9.23057 13.8819C9.29366 14.1474 9.35745 14.3761 9.4186 14.5714H3.51562C2.35065 14.5714 1.40625 13.612 1.40625 12.4286V3.57143ZM10.9134 14.5714H14.4844C15.6494 14.5714 16.5938 13.612 16.5938 12.4286V3.57143C16.5938 2.38796 15.6494 1.42857 14.4844 1.42857H10.8394C10.1206 2.18793 8.4068 4.45881 8.18096 7.71429H9.42188C9.8102 7.71429 10.125 8.03408 10.125 8.42857C10.125 9.4422 10.1639 10.3101 10.2255 11.0487C11.9254 10.7533 13.0309 9.83843 13.3762 9.40674C13.621 9.10057 14.0639 9.05404 14.3653 9.3028C14.6666 9.55156 14.7125 10.0014 14.4676 10.3076C13.9201 10.9921 12.4914 12.1252 10.3905 12.4693C10.4558 12.8937 10.5272 13.2505 10.5976 13.5467C10.7128 14.0318 10.8251 14.3538 10.9026 14.545C10.9063 14.5541 10.9099 14.5629 10.9134 14.5714Z" fill="#222" fillOpacity="0.84" fillRule="evenodd" />
      </g>
    </svg>
  );
}

function PlatformApple20() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 14 18">
      <path d="M10.9783 4.33662C10.9743 4.3285 10.9811 4.31921 10.99 4.32056C11.3815 4.37979 11.7919 4.51374 12.2571 4.75877C12.522 4.89829 12.7691 5.08582 13.005 5.32136C13.225 5.54096 13.4648 6.02142 13.2233 6.21711V6.21711C13.0338 6.37061 12.8254 6.5625 12.5792 6.83114C12.3329 7.09978 12.1434 7.42599 11.954 7.84814C11.7645 8.27029 11.6888 8.75 11.6888 9.30647C11.6888 9.95888 11.8024 10.4962 12.0298 10.9567C12.2571 11.4172 12.5223 11.7626 12.8254 12.0504C13.1286 12.3383 13.3938 12.5302 13.6211 12.6453V12.6453C13.8693 12.771 13.9556 13.0058 13.8606 13.2672C13.8085 13.4105 13.753 13.5606 13.7158 13.6623C13.5264 14.1804 13.2422 14.7177 12.8254 15.3317C12.4655 15.869 12.0677 16.3487 11.6509 16.8092C11.2341 17.2697 10.7226 17.4808 10.1543 17.4808C9.75643 17.4808 9.43437 17.4232 9.18809 17.3081C8.94181 17.193 8.67659 17.0779 8.41137 16.9627C8.14614 16.8476 7.7862 16.79 7.33153 16.79C6.87686 16.79 6.53586 16.8476 6.23275 16.9627C5.92963 17.0779 5.66441 17.193 5.39919 17.3273C5.13396 17.4616 4.83085 17.5 4.47091 17.5C3.92152 17.5 3.4479 17.2889 3.05007 16.8476C2.65223 16.4063 2.21651 15.8882 1.79973 15.2933C1.30717 14.5641 0.871448 13.7007 0.530447 12.6645C0.189445 11.6283 0 10.5729 0 9.51754C0 8.38542 0.20839 7.44518 0.625169 6.65844C1.04195 5.87171 1.59134 5.31524 2.2544 4.91228C2.91746 4.50932 3.59946 4.31743 4.31935 4.31743C4.69824 4.31743 5.05819 4.375 5.38024 4.50932C5.7023 4.64364 6.02436 4.75877 6.32747 4.89309C6.63058 5.02741 6.87686 5.08498 7.12314 5.08498C7.36942 5.08498 7.6157 5.00822 7.91881 4.8739C8.22192 4.73958 8.56292 4.60526 8.94181 4.47094C9.3207 4.33662 9.71854 4.27906 10.1543 4.27906C10.3217 4.27906 10.5805 4.29756 10.9665 4.35275C10.9755 4.35403 10.9824 4.34475 10.9783 4.33662V4.33662ZM8.43978 3.67462C8.43351 3.68097 8.42626 3.68636 8.41834 3.69051C7.98695 3.91657 7.57416 4.02961 7.17997 4.02961C7.1428 4.02961 7.10563 4.02961 7.06846 4.02734C6.99965 4.02315 6.95525 3.96077 6.93369 3.89528V3.89528C6.91475 3.83772 6.93369 3.78015 6.93369 3.7034C6.93369 3.26206 7.02842 2.82072 7.21786 2.39857C7.40731 1.97643 7.63464 1.63103 7.88092 1.3432C8.18403 0.95943 8.58187 0.652412 9.05548 0.402961C9.40127 0.220832 9.73697 0.100076 10.0552 0.0406936C10.2519 0.00399503 10.4384 0.145338 10.4384 0.345395V0.345395C10.4384 0.786732 10.3627 1.22807 10.1922 1.65022C10.0217 2.07237 9.79432 2.45614 9.52909 2.78235C9.24752 3.12459 8.89155 3.42915 8.46118 3.65869C8.4533 3.6629 8.44606 3.66826 8.43978 3.67462V3.67462Z" fill="#222" fillOpacity="0.84" />
    </svg>
  );
}

function PlatformWindows20() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 16 16">
      <g>
        <path d="M7.25 0H0V7.25H7.25V0Z" fill="#222" fillOpacity="0.84" />
        <path d="M7.25 8.75H0V16H7.25V8.75Z" fill="#222" fillOpacity="0.84" />
        <path d="M8.75 0H16V7.25H8.75V0Z" fill="#222" fillOpacity="0.84" />
        <path d="M16 8.75H8.75V16H16V8.75Z" fill="#222" fillOpacity="0.84" />
      </g>
    </svg>
  );
}

function PlatformAndroid20() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 18 10">
      <path d="M13.1493 7.47288C13.0005 7.47288 12.8551 7.42937 12.7314 7.34785C12.6077 7.26632 12.5112 7.15045 12.4543 7.01489C12.3974 6.87932 12.3825 6.73015 12.4115 6.58623C12.4405 6.44232 12.5122 6.31012 12.6174 6.20637C12.7226 6.10261 12.8566 6.03195 13.0026 6.00332C13.1485 5.97469 13.2998 5.98939 13.4372 6.04554C13.5747 6.10169 13.6922 6.19679 13.7748 6.31879C13.8575 6.4408 13.9016 6.58424 13.9016 6.73097C13.9016 6.92774 13.8224 7.11645 13.6813 7.25558C13.5402 7.39471 13.3488 7.47288 13.1493 7.47288ZM4.86635 7.47288C4.71756 7.47288 4.57211 7.42937 4.4484 7.34785C4.32468 7.26632 4.22826 7.15045 4.17132 7.01489C4.11438 6.87932 4.09949 6.73015 4.12852 6.58623C4.15754 6.44232 4.22919 6.31012 4.3344 6.20637C4.43961 6.10261 4.57365 6.03195 4.71958 6.00332C4.86551 5.97469 5.01677 5.98939 5.15423 6.04554C5.2917 6.10169 5.40919 6.19679 5.49185 6.31879C5.57451 6.4408 5.61863 6.58424 5.61863 6.73097C5.61863 6.92774 5.53937 7.11645 5.39829 7.25558C5.25721 7.39471 5.06587 7.47288 4.86635 7.47288ZM13.4158 3.02144L14.9203 0.463405C14.9406 0.428379 14.9537 0.389742 14.9588 0.349714C14.9639 0.309686 14.961 0.269056 14.9501 0.230157C14.9393 0.191258 14.9207 0.154858 14.8956 0.123046C14.8704 0.0912342 14.8391 0.0646385 14.8035 0.0447866C14.7679 0.0249348 14.7287 0.0122178 14.6881 0.00736645C14.6475 0.00251505 14.6063 0.00562479 14.5669 0.016517C14.5275 0.0274092 14.4907 0.0458691 14.4585 0.0708366C14.4264 0.095804 14.3996 0.126787 14.3796 0.162005L12.8594 2.75095C11.652 2.20681 10.3393 1.92732 9.01176 1.93176C7.68269 1.92855 6.36824 2.20521 5.15629 2.74322L3.63604 0.154277C3.5953 0.0839811 3.52799 0.0324583 3.44883 0.0109762C3.36967 -0.0105058 3.2851 -0.000198797 3.21362 0.0396432C3.14215 0.0794852 3.08958 0.14562 3.06742 0.223583C3.04525 0.301547 3.05529 0.384995 3.09534 0.455677L4.59208 3.01371C3.29794 3.70978 2.20028 4.71317 1.39845 5.93304C0.596632 7.15292 0.115977 8.55075 0 10H18C17.8876 8.55178 17.4092 7.15439 16.6084 5.93538C15.8076 4.71638 14.71 3.71458 13.4158 3.02144Z" fill="#222" fillOpacity="0.84" />
    </svg>
  );
}

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