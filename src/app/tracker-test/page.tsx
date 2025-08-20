'use client'

import { useState } from 'react'
import { Tracker } from '@/components/tracker'

export default function TrackerTestPage() {
  const [trackerState, setTrackerState] = useState<'hidden' | 'intro' | 'blocked'>('hidden')

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tracker Animation Demo</h1>
        
        {/* Instructions */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Auto-Play Animation</h2>
          <p className="text-sm text-gray-600 mb-2">
            The tracker will automatically play through the following sequence:
          </p>
          <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
            <li>Start as <strong>hidden</strong></li>
            <li>Transition to <strong>intro</strong> (logo appears)</li>
            <li>After 800ms, transition to <strong>blocked</strong> (draw animation plays)</li>
            <li>Click the tracker when blocked to trigger the <strong>explosion</strong> animation</li>
            <li>After explosion, returns to <strong>hidden</strong> and the cycle restarts</li>
          </ol>
        </div>

        {/* Tracker Test Area */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-lg font-semibold mb-4">Interactive Tracker</h2>
          <div className="flex justify-center items-center min-h-[300px] bg-gray-50 rounded-lg">
            <Tracker
              state={trackerState}
              size={80}
              onStateChange={(newState) => {
                console.log('State changed to:', newState)
                setTrackerState(newState)
              }}
            />
          </div>
          <p className="mt-4 text-center text-sm text-gray-600">
            Current state: <span className="font-medium">{trackerState}</span>
          </p>
          <p className="mt-2 text-center text-xs text-gray-500">
            {trackerState === 'blocked' && 'Click the tracker to trigger the explosion!'}
            {trackerState === 'intro' && 'Wait for the blocked state...'}
            {trackerState === 'hidden' && 'Watch it appear...'}
          </p>
        </div>
      </div>
    </div>
  )
} 