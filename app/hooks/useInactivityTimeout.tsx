import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { InactivityWarningModal } from '../components/InactivityWarningModal'

interface UseInactivityTimeoutOptions {
  timeoutMinutes?: number
  warningSeconds?: number
  onLogout?: () => void
}

export function useInactivityTimeout({
  timeoutMinutes = 5, // Default 1 minute
  warningSeconds = 15, // Default 15 seconds warning
  onLogout
}: UseInactivityTimeoutOptions = {}) {
  const { signOut } = useAuth()
  const router = useRouter()
  const [showWarning, setShowWarning] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()
  const [warningTimeoutId, setWarningTimeoutId] = useState<NodeJS.Timeout>()

  const resetTimer = useCallback(() => {
    console.log('Resetting timer...')
    // Clear existing timeouts
    if (timeoutId) {
      console.log('Clearing existing timeout')
      clearTimeout(timeoutId)
    }
    if (warningTimeoutId) {
      console.log('Clearing existing warning timeout')
      clearTimeout(warningTimeoutId)
    }

    // Hide warning if it's showing
    setShowWarning(false)

    // Set new timeout for warning
    const warningTimeout = setTimeout(() => {
      console.log('Warning timeout triggered')
      setShowWarning(true)
    }, (timeoutMinutes * 60 - warningSeconds) * 1000)

    // Set new timeout for logout
    const logoutTimeout = setTimeout(async () => {
      console.log('Logout timeout triggered')
      try {
        await signOut()
        if (onLogout) onLogout()
        router.push('/sign-in')
      } catch (error) {
        console.error('Error during automatic logout:', error)
      }
    }, timeoutMinutes * 60 * 1000)

    setWarningTimeoutId(warningTimeout)
    setTimeoutId(logoutTimeout)
    console.log('New timers set:', {
      warningTimeout: (timeoutMinutes * 60 - warningSeconds) * 1000,
      logoutTimeout: timeoutMinutes * 60 * 1000
    })
  }, [timeoutMinutes, warningSeconds, signOut, onLogout, router])

  const handleUserActivity = useCallback(() => {
    console.log('User activity detected')
    resetTimer()
  }, [resetTimer])

  useEffect(() => {
    console.log('Setting up inactivity timeout with:', {
      timeoutMinutes,
      warningSeconds
    })
    // Add event listeners for user activity
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'focus'
    ]

    events.forEach(event => {
      window.addEventListener(event, handleUserActivity)
    })

    // Initial timer setup
    resetTimer()

    // Cleanup function
    return () => {
      console.log('Cleaning up event listeners and timeouts')
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity)
      })
      if (timeoutId) clearTimeout(timeoutId)
      if (warningTimeoutId) clearTimeout(warningTimeoutId)
    }
  }, [handleUserActivity, resetTimer])

  const handleStayLoggedIn = useCallback(() => {
    console.log('User chose to stay logged in')
    setShowWarning(false)
    resetTimer()
  }, [resetTimer])

  const handleLogout = useCallback(async () => {
    console.log('User chose to logout')
    setShowWarning(false)
    try {
      await signOut()
      if (onLogout) onLogout()
      router.push('/sign-in')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }, [signOut, onLogout, router])

  const WarningModalComponent = () => {
    console.log('Rendering warning modal, showWarning:', showWarning)
    return (
      <InactivityWarningModal
        isOpen={showWarning}
        onOpenChange={setShowWarning}
        warningSeconds={warningSeconds}
        onStayLoggedIn={handleStayLoggedIn}
        onLogout={handleLogout}
      />
    )
  }

  return {
    WarningModal: WarningModalComponent,
    resetTimer
  }
} 