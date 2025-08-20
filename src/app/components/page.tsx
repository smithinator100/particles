'use client'

import { useState } from 'react'
import { AnimatedSlide } from '@/components/animated-slide'
import { ProfileImg } from '@/components/profile-img'
import { Webcard } from '@/components/webcard'
import { Tracker } from '@/components/tracker'
import { ParticleEffects } from '@/components/particle-effects'

interface Component {
  id: string
  name: string
  description: string
  component: React.ComponentType<any>
  states?: string[]
}

const components: Component[] = [
  {
    id: 'animated-slide',
    name: 'Animated Slide',
    description: 'Animated slide component with transitions',
    component: AnimatedSlide
  },
  {
    id: 'profile-img',
    name: 'Profile Image',
    description: '',
    component: ProfileImg,
    states: ['hidden', 'intro', 'shield-intro']
  },
  {
    id: 'webcard',
    name: 'Web Card',
    description: '',
    component: Webcard,
    states: ['hidden', 'intro']
  },
  {
    id: 'tracker',
    name: 'Tracker',
    description: 'Interactive tracker with customizable starburst animation. Use segmented nav to change states, then click the tracker when in "Blocked" state to see the burst effect. Settings panel on the right allows you to customize the animation parameters.',
    component: Tracker,
    states: ['hidden', 'intro', 'blocked']
  },
  {
    id: 'particle-effects',
    name: 'Particle Effects',
    description: 'Click the black circle to create floating smiley emojis',
    component: ParticleEffects
  }
]

export default function ComponentsPage() {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
  const [selectedState, setSelectedState] = useState<string>('')
  const [webcardProfileState, setWebcardProfileState] = useState<'shield' | 'shield-intro'>('shield')

  // Reset state when component changes
  const handleComponentSelect = (component: Component) => {
    setSelectedComponent(component)
    setSelectedState(component.states?.[0] || '')
  }

  const renderSelectedComponent = () => {
    if (!selectedComponent) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v12a4 4 0 004 4h10a2 2 0 002-2V7a2 2 0 00-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Component Selected</h3>
            <p className="text-gray-500">Select a component from the sidebar to view it here</p>
          </div>
        </div>
      )
    }

    const ComponentToRender = selectedComponent.component

    // Provide sample props for each component
    const getSampleProps = () => {
      switch (selectedComponent.id) {
        case 'animated-slide':
          return {}
        case 'profile-img':
          return {
            src: '/images/profile-pic.png',
            alt: 'Profile photo',
            size: 'xl' as const,
            showBorder: true,
            state: selectedState as 'hidden' | 'intro' | 'shield-intro'
          }
        case 'webcard':
          return {
            state: selectedState as 'hidden' | 'intro',
            profileState: webcardProfileState,
            showSettingsPanel: true
          }
        case 'tracker':
          return {
            size: 80,
            state: selectedState as 'hidden' | 'intro' | 'blocked',
            showSettingsPanel: true
          }
        case 'particle-effects':
          return {}
        default:
          return {}
      }
    }

    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center justify-center">
          <ComponentToRender {...getSampleProps()} />
        </div>
      </div>
    )
  }

  const renderSegmentedNav = () => {
    if (!selectedComponent?.states || selectedComponent.states.length === 0) {
      return null
    }

    return (
      <div className="flex items-center bg-gray-100 rounded-lg p-1">
        {selectedComponent.states.map((state) => (
          <button
            key={state}
            onClick={() => setSelectedState(state)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedState === state
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {state.charAt(0).toUpperCase() + state.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Component Viewer
          </h1>
          <p className="text-sm text-gray-600">
            Select a component to preview
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {components.map((component) => (
              <button
                key={component.id}
                onClick={() => handleComponentSelect(component)}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  selectedComponent?.id === component.id
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <h3 className="font-medium text-gray-900 mb-1">
                  {component.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {component.description}
                </p>
                {component.states && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {component.states.length} states
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="text-center">
            {selectedComponent?.states && (
              <div className="flex justify-center items-center gap-6">
                {renderSegmentedNav()}
                {selectedComponent.id === 'webcard' && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setWebcardProfileState('shield')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          webcardProfileState === 'shield'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Shield Off
                      </button>
                      <button
                        onClick={() => setWebcardProfileState('shield-intro')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          webcardProfileState === 'shield-intro'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Shield On
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 p-8 relative" style={{
          backgroundColor: '#F8f8f8',
          backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}>
          {renderSelectedComponent()}
        </div>
      </div>
    </div>
  )
} 