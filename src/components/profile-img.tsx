import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { gsap } from 'gsap'

interface ProfileImgProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  state?: 'hidden' | 'intro' | 'shield' | 'shield-intro'
  showShield?: boolean
  onAnimateToHidden?: () => void
}

export interface ProfileImgRef {
  animateToHidden: () => gsap.core.Timeline
}



export const ProfileImg = forwardRef<ProfileImgRef, ProfileImgProps>(function ProfileImg({
  size = 'md',
  className = '',
  state = 'intro',
  showShield = false,
  onAnimateToHidden
}, ref) {
  const shieldRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const baseClasses = `
    inline-flex
    items-center
    overflow-hidden
    bg-white
    ${sizeClasses[size]}
    ${className}
  `

  // Static styles (non-animated properties)
  const getStateStyle = () => {
    return {
      borderRadius: '80px'
    }
  }

  // Show shield when state is 'shield' or 'shield-intro' or when explicitly enabled
  const shouldShowShield = state === 'shield' || state === 'shield-intro' || showShield

  // Method to animate from shield-intro to hidden
  const animateToHidden = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        onAnimateToHidden?.()
      }
    })

    // First, animate the shield out
    if (shieldRef.current && shouldShowShield) {
      tl.to(shieldRef.current, {
        scale: 0,
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: "back.in(1.7)"
      })
    }

    // Then animate the profile picture out
    if (profileRef.current) {
      tl.to(profileRef.current, {
        scale: 0,
        opacity: 0,
        borderColor: 'transparent',
        boxShadow: '0px 0px 0px 0px rgba(68, 255, 98, 0)',
        duration: 0.4,
        ease: "back.in(1.7)"
      }, "-=0.1") // Start slightly before shield animation completes
    }

    return tl
  }

  // Expose the animation method via ref
  useImperativeHandle(ref, () => ({
    animateToHidden
  }))

  // GSAP animation for profile picture
  useEffect(() => {
    if (profileRef.current) {
      switch (state) {
        case 'hidden':
          // If transitioning to hidden from shield-intro, use the animated transition
          if (state === 'hidden') {
            animateToHidden()
          } else {
            gsap.set(profileRef.current, {
              scale: 0,
              opacity: 0,
              borderColor: 'transparent',
              boxShadow: '0px 0px 0px 0px rgba(68, 255, 98, 0)'
            })
          }
          break
        case 'intro':
          gsap.to(profileRef.current, {
            scale: 1,
            opacity: 1,
            borderColor: 'transparent',
            boxShadow: '0px 0px 0px 0px rgba(68, 255, 98, 0)',
            duration: 0.48,
            ease: "quint.out"
          })
          break
        case 'shield':
          gsap.to(profileRef.current, {
            scale: 1,
            opacity: 1,
            borderColor: '#B3F1AA',
            boxShadow: '0px 0px 20px 0px rgba(68, 255, 98, 0.40)',
            duration: 0.48,
            ease: "quint.out"
          })
          break
        case 'shield-intro':
          gsap.to(profileRef.current, {
            scale: 1,
            opacity: 1,
            borderColor: '#B3F1AA',
            boxShadow: '0px 0px 20px 0px rgba(68, 255, 98, 0.40)',
            duration: 0.48,
            ease: "quint.out"
          })
          break
      }
    }
  }, [state])

  // GSAP animation for shield
  useEffect(() => {
    if (shouldShowShield && shieldRef.current) {
      // Set initial state
      gsap.set(shieldRef.current, {
        scale: 0,
        opacity: 0,
        y: 10
      })

      // Animate in
      gsap.to(shieldRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
        delay: 0.1
      })
    }
  }, [shouldShowShield])

  return (
    <div className="relative inline-block">
      <div ref={profileRef} className={baseClasses} style={{...getStateStyle(), border: '4px solid transparent', boxShadow: 'none'}}>
        <video
          src="/images/profile.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-all duration-300 ease-in-out"
          style={{ borderRadius: '76px' }} // Slightly smaller to account for border
        />
      </div>
      
      {/* Shield Badge */}
      {shouldShowShield && (
        <div 
          ref={shieldRef}
          className="absolute bg-white flex items-center justify-center"
          style={{
            display: 'flex',
            width: '48px',
            height: '48px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            position: 'absolute',
            right: '-12px',
            bottom: '0px',
            borderRadius: '40px',
            border: '2.5px solid #7BD66D',
            background: '#FFF',
            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
          }}
                  >
            <img 
              src="/images/shield.svg" 
              alt="Shield" 
              className="w-6 h-6"
            />
          </div>
      )}
    </div>
  )
})