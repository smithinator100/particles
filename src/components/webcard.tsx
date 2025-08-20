'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ProfileImg } from './profile-img'
import { Tracker } from './tracker'

interface WebcardProps {
  className?: string
  state?: 'hidden' | 'intro'
  profileState?: 'shield' | 'shield-intro'
  showSettingsPanel?: boolean
}

interface SpawnedTracker {
  id: number
  x: number
  y: number
  trackerType: string
  currentState: 'hidden' | 'intro' | 'blocked'
}

interface WebcardParams {
  trackerCount: number
  spawnAreaPadding: number
  trackerSize: number
  animationDelay: number
  introToBlockedDelay: number
  spawnAreaWidth: number
  spawnAreaHeight: number
  spawnAreaOffsetX: number
  spawnAreaOffsetY: number
  showSpawnPreview: boolean
}

const defaultParams: WebcardParams = {
  trackerCount: 8,
  spawnAreaPadding: 40,
  trackerSize: 60,
  animationDelay: 200,
  introToBlockedDelay: 1000,
  spawnAreaWidth: 400,
  spawnAreaHeight: 300,
  spawnAreaOffsetX: 190,
  spawnAreaOffsetY: -100,
  showSpawnPreview: false
}

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
  }
} as const

const trackerTypes = Object.keys(trackerLogos) as (keyof typeof trackerLogos)[]

export function Webcard({ 
  className = '', 
  state = 'hidden', 
  profileState = 'shield',
  showSettingsPanel = false 
}: WebcardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)
  const [spawnedTrackers, setSpawnedTrackers] = useState<SpawnedTracker[]>([])
  const [params, setParams] = useState<WebcardParams>(defaultParams)
  const [showPanel, setShowPanel] = useState(showSettingsPanel)
  const nextTrackerId = useRef(0)
  const usedTrackerTypes = useRef<Set<string>>(new Set())
  const activeTimeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  const updateParam = (key: keyof WebcardParams, value: number | string | boolean) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }

  // Function to clear all active timeouts
  const clearAllTimeouts = () => {
    activeTimeouts.current.forEach(timeout => clearTimeout(timeout))
    activeTimeouts.current.clear()
  }

  // Function to get next tracker type without duplicates
  const getNextTrackerType = (): keyof typeof trackerLogos => {
    // If we've used all tracker types, reset the set
    if (usedTrackerTypes.current.size >= trackerTypes.length) {
      usedTrackerTypes.current.clear()
    }

    // Get unused tracker types
    const unusedTypes = trackerTypes.filter(type => !usedTrackerTypes.current.has(type))
    
    // Pick a random unused type
    const selectedType = unusedTypes[Math.floor(Math.random() * unusedTypes.length)]
    
    // Mark it as used
    usedTrackerTypes.current.add(selectedType)
    
    return selectedType
  }

  // Function to generate random positions within spawn area while preventing overlaps
  const generateRandomPositionsWithinSpawnArea = (count: number): { x: number; y: number }[] => {
    const positions: { x: number; y: number }[] = []
    
    // Calculate minimum distance between centers to ensure 24px spacing between trackers
    // The visual tracker size is just params.trackerSize (60px), not the container size
    // For 24px spacing: radius + 24px + radius = (size/2) + 24 + (size/2) = size + 24
    const minDistance = params.trackerSize + 24
    
    // Calculate tracker half-size for boundary calculations (visual size, not container)
    const trackerHalfSize = params.trackerSize / 2
    
    // Define spawn area boundaries - keep trackers fully within the area
    // Add just enough padding to keep the tracker containers inside
    const minX = params.spawnAreaPadding + trackerHalfSize
    const maxX = params.spawnAreaWidth - params.spawnAreaPadding - trackerHalfSize
    const minY = params.spawnAreaPadding + trackerHalfSize
    const maxY = params.spawnAreaHeight - params.spawnAreaPadding - trackerHalfSize
    
    // Ensure we have a valid spawn area
    if (maxX <= minX || maxY <= minY) {
      console.warn('Spawn area too small for trackers')
      return []
    }
    
    // Function to check if a position has minimum distance from existing positions
    const isPositionValid = (x: number, y: number): boolean => {
      return positions.every(pos => {
        const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2)
        return distance >= minDistance
      })
    }
    
    // Generate positions with overlap checking and better distribution
    for (let i = 0; i < count; i++) {
      let attempts = 0
      let validPosition = false
      let x = 0
      let y = 0
      
      // Try to find a valid position (max 200 attempts per tracker for better distribution)
      while (!validPosition && attempts < 200) {
        // Generate truly random position within full spawn area bounds
        x = minX + Math.random() * (maxX - minX)
        y = minY + Math.random() * (maxY - minY)
        
        validPosition = isPositionValid(x, y)
        attempts++
      }
      
      // If we still couldn't find a valid position, try a fallback strategy
      if (!validPosition && attempts >= 200) {
        // Try placing near edges or corners where there might be more space
        const edgeOptions = [
          // Near left edge
          { x: minX + Math.random() * 50, y: minY + Math.random() * (maxY - minY) },
          // Near right edge  
          { x: maxX - Math.random() * 50, y: minY + Math.random() * (maxY - minY) },
          // Near top edge
          { x: minX + Math.random() * (maxX - minX), y: minY + Math.random() * 50 },
          // Near bottom edge
          { x: minX + Math.random() * (maxX - minX), y: maxY - Math.random() * 50 }
        ]
        
        for (const option of edgeOptions) {
          if (isPositionValid(option.x, option.y)) {
            x = option.x
            y = option.y
            validPosition = true
            break
          }
        }
      }
      
      // Add the position (even if not ideal, to avoid missing trackers)
      positions.push({ x, y })
    }
    
    return positions
  }

  const spawnTrackers = () => {
    if (!containerRef.current) return

    // Clear any existing timeouts to prevent conflicts
    clearAllTimeouts()

    const newTrackers: SpawnedTracker[] = []

    // Clear existing trackers
    setSpawnedTrackers([])
    
    // Reset used tracker types for a fresh start
    usedTrackerTypes.current.clear()

    // Generate random positions within spawn area
    const positions = generateRandomPositionsWithinSpawnArea(params.trackerCount)

    // Create trackers with unique types and distributed positions
    for (let i = 0; i < params.trackerCount; i++) {
      const position = positions[i] || positions[positions.length - 1] // Fallback to last position if needed
      
      newTrackers.push({
        id: nextTrackerId.current++,
        x: position.x,
        y: position.y,
        trackerType: getNextTrackerType(),
        currentState: 'hidden'
      })
    }

    // Step 1: Add all trackers in hidden state
    setSpawnedTrackers(newTrackers)

    // Step 2: Animate trackers to intro state with stagger
    newTrackers.forEach((tracker, index) => {
      const timeout1 = setTimeout(() => {
        setSpawnedTrackers(prev => prev.map(t =>
          t.id === tracker.id ? { ...t, currentState: 'intro' } : t
        ))
        
        // Step 3: Transition to blocked state after intro delay
        const timeout2 = setTimeout(() => {
          setSpawnedTrackers(prev => prev.map(t =>
            t.id === tracker.id ? { ...t, currentState: 'blocked' } : t
          ))
          activeTimeouts.current.delete(timeout2)
        }, params.introToBlockedDelay)
        
        activeTimeouts.current.add(timeout2)
        activeTimeouts.current.delete(timeout1)
      }, index * params.animationDelay)
      
      activeTimeouts.current.add(timeout1)
    })
  }

  const clearTrackers = () => {
    clearAllTimeouts()
    setSpawnedTrackers([])
  }

  useEffect(() => {
    if (!cardRef.current || !profileRef.current || !linesRef.current || !dotsRef.current) return

    const card = cardRef.current
    const profile = profileRef.current
    const lines = linesRef.current.querySelectorAll('.line')
    const dots = dotsRef.current.querySelectorAll('.dot')

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to viewport center (-1 to 1)
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      const mouseX = (e.clientX - centerX) / (window.innerWidth / 2)
      const mouseY = (e.clientY - centerY) / (window.innerHeight / 2)
      
      // Apply subtle movements with different intensities
      gsap.to(profile, {
        x: mouseX * 8,
        y: mouseY * 6,
        duration: 0.3,
        ease: "power2.out"
      })
      
      gsap.to(lines, {
        x: mouseX * 12,
        y: mouseY * 8,
        duration: 0.4,
        ease: "power2.out"
      })
      
      gsap.to(dots, {
        x: mouseX * 6,
        y: mouseY * 4,
        duration: 0.5,
        ease: "power2.out"
      })
      
      // Move the card itself and add subtle tilt
      gsap.to(card, {
        x: mouseX * 15,
        y: mouseY * 10,
        rotationX: mouseY * -2,
        rotationY: mouseX * 2,
        duration: 0.3,
        ease: "power2.out",
        transformPerspective: 1000
      })
    }

    // Reset positions when mouse leaves the viewport
    const handleMouseLeave = () => {
      gsap.to([profile, lines, dots], {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      })
      
      gsap.to(card, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        ease: "power2.out"
      })
    }

    // Add event listeners to window for global mouse tracking
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // Initial state setup
    if (state === 'hidden') {
      // Profile completely hidden
      gsap.set(profile, { 
        opacity: 0,
        scale: 0,
        x: 0,
        y: 0
      })
      
      // Lines with 0px width and hidden
      gsap.set(lines, {
        width: '0px',
        opacity: 0,
        scaleX: 0,
        transformOrigin: 'left center',
        x: 0,
        y: 0
      })
      
      // Circles hidden - start from below their position
      gsap.set(dots, {
        opacity: 0,
        y: 60,
        x: 0
      })
      
      gsap.set(card, {
        opacity: 0,
        scale: 0.95,
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0
      })
    } else if (state === 'intro') {
      gsap.to(card, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      })
      
      // Profile first
      gsap.to(profile, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay: 0.2,
        ease: "back.out(1.7)"
      })
      
      // Then lines - animate to their original sizes (quicker timing)
      gsap.to(lines[0], {
        width: '57px',
        opacity: 1,
        scaleX: 1,
        duration: 0.4,
        delay: 0.4,
        ease: "power2.out"
      })
      gsap.to(lines[1], {
        width: '86px',
        opacity: 1,
        scaleX: 1,
        duration: 0.4,
        delay: 0.5,
        ease: "power2.out"
      })
      gsap.to(lines[2], {
        width: '39px',
        opacity: 1,
        scaleX: 1,
        duration: 0.4,
        delay: 0.6,
        ease: "power2.out"
      })
      
      // Then circles - slide in from bottom with back ease
      gsap.to(dots, {
        opacity: 1,
        y: 0,  // Move to final position
        duration: 0.6,
        delay: 1.0,
        stagger: 0.08,
        ease: "back.out(1.7)"
      })
    }

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [state])

  return (
    <div className={`flex justify-center items-center ${className}`}>
      {/* Parameters Panel */}
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
            <h3 className="text-lg font-semibold text-gray-800">Webcard Controls</h3>
            <button
              onClick={() => setShowPanel(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Spawn Trackers Button */}
            <div className="border-b pb-3">
              <button
                onClick={spawnTrackers}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium mb-2"
              >
                🎯 Spawn Trackers ({params.trackerCount})
              </button>
              <button
                onClick={clearTrackers}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Clear Trackers
              </button>
            </div>

            {/* Tracker Settings */}
            <div className="border-b pb-3">
              <h4 className="font-semibold mb-2 text-gray-800">Tracker Settings</h4>
              
              {/* Tracker Count */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracker Count: {params.trackerCount}
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={params.trackerCount}
                  onChange={(e) => updateParam('trackerCount', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Tracker Size */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracker Size: {params.trackerSize}px
                </label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="5"
                  value={params.trackerSize}
                  onChange={(e) => updateParam('trackerSize', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Spawn Area Padding */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spawn Padding: {params.spawnAreaPadding}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={params.spawnAreaPadding}
                  onChange={(e) => updateParam('spawnAreaPadding', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Animation Delay */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Animation Delay: {params.animationDelay}ms
                </label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="25"
                  value={params.animationDelay}
                  onChange={(e) => updateParam('animationDelay', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Intro to Blocked Delay */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intro → Blocked Delay: {params.introToBlockedDelay}ms
                </label>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  value={params.introToBlockedDelay}
                  onChange={(e) => updateParam('introToBlockedDelay', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

            </div>

            {/* Spawn Area Settings */}
            <div className="border-b pb-3">
              <h4 className="font-semibold mb-2 text-gray-800">Spawn Area Settings</h4>
              
              {/* Show Preview */}
              <div className="mb-3 flex items-center">
                <input
                  type="checkbox"
                  id="showPreview"
                  checked={params.showSpawnPreview}
                  onChange={(e) => updateParam('showSpawnPreview', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="showPreview" className="text-sm font-medium text-gray-700">
                  Show Spawn Area Preview
                </label>
              </div>

              {/* Spawn Area Width */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spawn Area Width: {params.spawnAreaWidth}px
                </label>
                <input
                  type="range"
                  min="400"
                  max="1200"
                  step="20"
                  value={params.spawnAreaWidth}
                  onChange={(e) => updateParam('spawnAreaWidth', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Spawn Area Height */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spawn Area Height: {params.spawnAreaHeight}px
                </label>
                <input
                  type="range"
                  min="300"
                  max="800"
                  step="20"
                  value={params.spawnAreaHeight}
                  onChange={(e) => updateParam('spawnAreaHeight', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Spawn Area Offset X */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horizontal Offset: {params.spawnAreaOffsetX}px
                </label>
                <input
                  type="range"
                  min="-300"
                  max="300"
                  step="10"
                  value={params.spawnAreaOffsetX}
                  onChange={(e) => updateParam('spawnAreaOffsetX', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Spawn Area Offset Y */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vertical Offset: {params.spawnAreaOffsetY}px
                </label>
                <input
                  type="range"
                  min="-300"
                  max="300"
                  step="10"
                  value={params.spawnAreaOffsetY}
                  onChange={(e) => updateParam('spawnAreaOffsetY', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

            </div>

            {/* Stats */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Stats</h4>
              <p className="text-sm text-gray-600">
                Active Trackers: {spawnedTrackers.length}
              </p>
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

      {/* Main Container for Card and Trackers */}
      <div 
        ref={containerRef}
        className="relative flex justify-center items-center"
        style={{ minWidth: '800px', minHeight: '600px' }}
      >
        {/* Spawn Area Preview */}
        {params.showSpawnPreview && (
          <div
            className="absolute border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-20 pointer-events-none"
            style={{
              width: params.spawnAreaWidth,
              height: params.spawnAreaHeight,
              left: `calc(50% + ${params.spawnAreaOffsetX}px - ${params.spawnAreaWidth/2}px)`,
              top: `calc(50% + ${params.spawnAreaOffsetY}px - ${params.spawnAreaHeight/2}px)`,
              zIndex: 1
            }}
          >
            <div className="absolute top-2 left-2 text-xs text-blue-600 font-medium bg-white px-2 py-1 rounded">
              Spawn Area ({params.spawnAreaWidth}×{params.spawnAreaHeight})
            </div>
          </div>
        )}

        {/* Webcard */}
        <div 
          ref={cardRef}
          className="flex w-[520px] h-[300px] flex-col items-start rounded-2xl border-[6px] border-white shadow-lg overflow-hidden relative cursor-pointer z-10"
          style={{
            background: 'linear-gradient(113deg, #2C2737 2.01%, #564A72 100%)'
          }}
        >
          
          {/* Top bar with dots */}
          <div className="flex p-3 items-center gap-1 self-stretch"
               style={{ backgroundColor: '#2A2437' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
              <circle cx="4" cy="4" r="4" fill="#453D57"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
              <circle cx="4" cy="4" r="4" fill="#453D57"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
              <circle cx="4" cy="4" r="4" fill="#453D57"/>
            </svg>
          </div>

          {/* Content area */}
          <div className="flex items-center gap-10 p-10 w-full">
            <div ref={profileRef}>
              <ProfileImg
                src="/images/profile-pic.png"
                alt="Profile"
                size="xl"
                state={profileState === 'shield-intro' ? 'shield-intro' : 'intro'}
                className="flex-shrink-0"
              />
            </div>
            
            <div ref={linesRef} className="flex flex-col gap-4 items-start">
              <div
                className="line h-1.5 rounded-full w-[57px]"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.09)' }}
              />
              <div
                className="line h-1.5 rounded-full w-[86px]"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
              />
              <div
                className="line h-1.5 rounded-full w-[39px]"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
              />
            </div>
          </div>

          {/* Bottom dots */}
          <div ref={dotsRef} className="flex items-center gap-6 absolute left-20 bottom-10">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="dot w-10 h-10 rounded-full"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
              />
            ))}
          </div>
        </div>

        {/* Spawned Trackers - positioned relative to container */}
        {spawnedTrackers.map((tracker) => (
          <div
            key={tracker.id}
            className="absolute"
            style={{
              left: `calc(50% + ${params.spawnAreaOffsetX}px + ${tracker.x}px - ${params.spawnAreaWidth/2}px - ${params.trackerSize * 1.5}px)`,
              top: `calc(50% + ${params.spawnAreaOffsetY}px + ${tracker.y}px - ${params.spawnAreaHeight/2}px - ${params.trackerSize * 1.5}px)`,
              zIndex: 20
            }}
          >
            <Tracker
              trackerType={tracker.trackerType as keyof typeof trackerLogos}
              size={params.trackerSize}
              state={tracker.currentState}
              onStateChange={(newState) => {
                console.log(`🔄 Tracker ${tracker.id} state changed to:`, newState)
                // Only update state for non-terminal transitions
                if (newState !== 'hidden') {
                  console.log(`📝 Updating tracker ${tracker.id} state to:`, newState)
                  setSpawnedTrackers(prev => prev.map(t =>
                    t.id === tracker.id ? { ...t, currentState: newState } : t
                  ))
                }
                // Note: We don't handle 'hidden' state here anymore - trackers are removed onClick
              }}
              onExplode={() => {
                console.log(`💥 Tracker ${tracker.id} exploded - removing immediately`)
                // Remove tracker immediately when clicked, don't wait for hidden state
                setSpawnedTrackers(prev => {
                  const filtered = prev.filter(t => t.id !== tracker.id)
                  console.log(`📊 Trackers before removal: ${prev.length}, after removal: ${filtered.length}`)
                  return filtered
                })
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
} 