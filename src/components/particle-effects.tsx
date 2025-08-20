'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'

interface ParticleParams {
  particleCount: number
  particleSize: number
  horizontalDrift: number
  verticalDistance: number
  minDuration: number
  maxDuration: number
  maxRotation: number
  scaleEnd: number
  staggerDelay: number
  staggerVariance: number
  emoji: string
  // Line emitter parameters
  emitterType: 'point' | 'line'
  lineLength: number
  lineAngle: number
  lineCenterX: number
  lineCenterY: number
  showLinePreview: boolean
}

interface ParticleEffectsProps {
  state?: string
}

const defaultParams: ParticleParams = {
  particleCount: 25,
  particleSize: 36,
  horizontalDrift: 300,
  verticalDistance: 400,
  minDuration: 3,
  maxDuration: 5,
  maxRotation: 360,
  scaleEnd: 0.3,
  staggerDelay: 100,
  staggerVariance: 50,
  emoji: '😊',
  // Line emitter parameters
  emitterType: 'point',
  lineLength: 200,
  lineAngle: 0,
  lineCenterX: 0,
  lineCenterY: 0,
  showLinePreview: false
}

export function ParticleEffects({ state }: ParticleEffectsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement[]>([])
  const [params, setParams] = useState<ParticleParams>(defaultParams)
  const [showPanel, setShowPanel] = useState(true)

  const createParticle = () => {
    if (!containerRef.current) return

    const particle = document.createElement('div')
    particle.textContent = params.emoji
    particle.style.position = 'absolute'
    particle.style.fontSize = `${params.particleSize}px`
    particle.style.pointerEvents = 'none'
    particle.style.zIndex = '10'

    // Calculate spawn position based on emitter type
    let spawnX: number
    let spawnY: number

    if (params.emitterType === 'line') {
      // Calculate random position along the line
      const t = Math.random() // Random position along line (0 to 1)
      const angleRad = (params.lineAngle * Math.PI) / 180
      
      // Calculate line endpoints
      const halfLength = params.lineLength / 2
      const startX = params.lineCenterX - halfLength * Math.cos(angleRad)
      const startY = params.lineCenterY - halfLength * Math.sin(angleRad)
      const endX = params.lineCenterX + halfLength * Math.cos(angleRad)
      const endY = params.lineCenterY + halfLength * Math.sin(angleRad)
      
      // Interpolate along the line
      spawnX = startX + t * (endX - startX)
      spawnY = startY + t * (endY - startY)
    } else {
      // Point emitter (original behavior)
      spawnX = 0
      spawnY = 0
    }

    particle.style.left = '50%'
    particle.style.top = '80%'
    particle.style.transform = `translate(calc(-50% + ${spawnX}px), calc(-50% + ${spawnY}px))`

    containerRef.current.appendChild(particle)
    particlesRef.current.push(particle)

    // Animate particle upward with physics-like motion
    const tl = gsap.timeline({
      onComplete: () => {
        particle.remove()
        const index = particlesRef.current.indexOf(particle)
        if (index > -1) {
          particlesRef.current.splice(index, 1)
        }
      }
    })

    // Use parameters for randomization
    const randomX = (Math.random() - 0.5) * params.horizontalDrift
    const randomRotation = (Math.random() - 0.5) * params.maxRotation
    const randomDuration = params.minDuration + Math.random() * (params.maxDuration - params.minDuration)

    tl.to(particle, {
      x: randomX,
      y: -params.verticalDistance,
      rotation: randomRotation,
      scale: params.scaleEnd,
      opacity: 0,
      duration: randomDuration,
      ease: 'power2.out'
    })
  }

  const handleCircleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Create particles based on parameters
    for (let i = 0; i < params.particleCount; i++) {
      const baseDelay = i * params.staggerDelay
      const variance = (Math.random() - 0.5) * params.staggerVariance
      const finalDelay = Math.max(0, baseDelay + variance)
      
      setTimeout(() => {
        createParticle()
      }, finalDelay)
    }

    // Add click animation to the circle
    gsap.to(event.currentTarget, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    })
  }

  const updateParam = (key: keyof ParticleParams, value: number | string | boolean) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }

  const exportParams = () => {
    const dataStr = JSON.stringify(params, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'particle-animation-params.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const resetParams = () => {
    setParams(defaultParams)
  }

  // Clean up particles on unmount
  useEffect(() => {
    return () => {
      particlesRef.current.forEach(particle => {
        particle.remove()
      })
      particlesRef.current = []
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-visible"
      style={{ minHeight: '500px' }}
    >
      {/* Control Panel */}
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
            <h3 className="text-lg font-semibold text-gray-800">Particle Controls</h3>
            <button
              onClick={() => setShowPanel(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Emitter Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emitter Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateParam('emitterType', 'point')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    params.emitterType === 'point'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Point
                </button>
                <button
                  onClick={() => updateParam('emitterType', 'line')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    params.emitterType === 'line'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Line
                </button>
              </div>
            </div>

            {/* Line Emitter Controls */}
            {params.emitterType === 'line' && (
              <>
                {/* Line Length */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Line Length: {params.lineLength}px
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    value={params.lineLength}
                    onChange={(e) => updateParam('lineLength', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Line Angle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Line Angle: {params.lineAngle}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={params.lineAngle}
                    onChange={(e) => updateParam('lineAngle', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Line Position */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Line Center X: {params.lineCenterX}px
                    </label>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={params.lineCenterX}
                      onChange={(e) => updateParam('lineCenterX', Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Line Center Y: {params.lineCenterY}px
                    </label>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={params.lineCenterY}
                      onChange={(e) => updateParam('lineCenterY', Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Show Line Preview */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showLinePreview"
                    checked={params.showLinePreview}
                    onChange={(e) => updateParam('showLinePreview', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="showLinePreview" className="text-sm font-medium text-gray-700">
                    Show Line Preview
                  </label>
                </div>
              </>
            )}

            {/* Particle Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Particle Count: {params.particleCount}
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={params.particleCount}
                onChange={(e) => updateParam('particleCount', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Particle Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Particle Size: {params.particleSize}px
              </label>
              <input
                type="range"
                min="12"
                max="72"
                value={params.particleSize}
                onChange={(e) => updateParam('particleSize', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Horizontal Drift */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horizontal Drift: {params.horizontalDrift}px
              </label>
              <input
                type="range"
                min="50"
                max="800"
                value={params.horizontalDrift}
                onChange={(e) => updateParam('horizontalDrift', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Vertical Distance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vertical Distance: {params.verticalDistance}px
              </label>
              <input
                type="range"
                min="200"
                max="800"
                value={params.verticalDistance}
                onChange={(e) => updateParam('verticalDistance', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Duration Range */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Duration: {params.minDuration}s
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.1"
                  value={params.minDuration}
                  onChange={(e) => updateParam('minDuration', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Duration: {params.maxDuration}s
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.1"
                  value={params.maxDuration}
                  onChange={(e) => updateParam('maxDuration', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Rotation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Rotation: {params.maxRotation}°
              </label>
              <input
                type="range"
                min="0"
                max="720"
                value={params.maxRotation}
                onChange={(e) => updateParam('maxRotation', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Scale End */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Scale: {params.scaleEnd}
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={params.scaleEnd}
                onChange={(e) => updateParam('scaleEnd', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Stagger Delay */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stagger Delay: {params.staggerDelay}ms
              </label>
              <input
                type="range"
                min="10"
                max="500"
                value={params.staggerDelay}
                onChange={(e) => updateParam('staggerDelay', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Stagger Variance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stagger Variance: {params.staggerVariance}ms
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={params.staggerVariance}
                onChange={(e) => updateParam('staggerVariance', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Emoji */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Particle Emoji
              </label>
              <input
                type="text"
                value={params.emoji}
                onChange={(e) => updateParam('emoji', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="😊"
                maxLength={2}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={exportParams}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Export Parameters
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
      {!showPanel && (
        <button
          onClick={() => setShowPanel(true)}
          className="fixed bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors z-30 text-sm font-medium"
          style={{ top: '80px', left: '380px' }}
        >
          Show Controls
        </button>
      )}

      {/* Black circle in center */}
      <div
        onClick={handleCircleClick}
        className="w-24 h-24 bg-black rounded-full cursor-pointer flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg relative z-20"
        style={{ 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <span className="text-white text-xs font-medium select-none">CLICK</span>
      </div>

      {/* Line Preview */}
      {params.emitterType === 'line' && params.showLinePreview && (
        <div
          className="absolute pointer-events-none z-10"
          style={{
            left: '50%',
            top: '80%',
            transform: `translate(calc(-50% + ${params.lineCenterX}px), calc(-50% + ${params.lineCenterY}px))`,
          }}
        >
          <div
            className="bg-red-400 opacity-60"
            style={{
              width: `${params.lineLength}px`,
              height: '2px',
              transform: `rotate(${params.lineAngle}deg)`,
              transformOrigin: 'center',
            }}
          />
          {/* Line endpoints */}
          <div
            className="absolute w-2 h-2 bg-red-600 rounded-full"
            style={{
              left: `-${params.lineLength / 2}px`,
              top: '-1px',
              transform: `rotate(${params.lineAngle}deg)`,
              transformOrigin: `${params.lineLength / 2}px 1px`,
            }}
          />
          <div
            className="absolute w-2 h-2 bg-red-600 rounded-full"
            style={{
              left: `${params.lineLength / 2 - 2}px`,
              top: '-1px',
              transform: `rotate(${params.lineAngle}deg)`,
              transformOrigin: `${-params.lineLength / 2 + 2}px 1px`,
            }}
          />
        </div>
      )}
    </div>
  )
} 