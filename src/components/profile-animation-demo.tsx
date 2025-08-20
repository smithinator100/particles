'use client'

import { useState, useRef } from 'react'
import { ProfileImg, ProfileImgRef } from './profile-img'

export function ProfileAnimationDemo() {
  const [profileState, setProfileState] = useState<'shield-intro' | 'hidden'>('shield-intro')
  const profileRef = useRef<ProfileImgRef>(null)

  const handleAnimateToHidden = () => {
    // Use the ref method for controlled animation
    profileRef.current?.animateToHidden()
  }

  const handleStateChange = () => {
    setProfileState(prev => prev === 'shield-intro' ? 'hidden' : 'shield-intro')
  }

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <h2 className="text-2xl font-bold text-white">Profile Picture Animation Demo</h2>
      
      <div className="flex items-center gap-4">
        <ProfileImg 
          ref={profileRef}
          size="xl"
          state={profileState}
          showShield={profileState === 'shield-intro'}
          onAnimateToHidden={() => {
            console.log('Animation to hidden completed')
            // You can update state here if needed
          }}
        />
      </div>

      <div className="flex gap-4">
        <button 
          onClick={handleStateChange}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Toggle State: {profileState}
        </button>
        
        <button 
          onClick={handleAnimateToHidden}
          className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          disabled={profileState === 'hidden'}
        >
          Animate to Hidden
        </button>
      </div>

      <div className="text-gray-300 text-center max-w-md">
        <p className="mb-2">
          This demo shows the profile picture animating from shield-intro state to hidden state.
        </p>
        <p>
          The shield badge animates out first, followed by the profile picture scaling and fading out.
        </p>
      </div>
    </div>
  )
} 