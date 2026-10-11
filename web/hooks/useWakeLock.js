import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'keepScreenOn'

// Keeps the screen awake while a recipe is open, via the Screen Wake Lock API
// (Safari 16.4+, Chrome 84+, Firefox 126+). The browser drops the lock whenever
// the tab is hidden, so it's re-requested when the page becomes visible again.
// The on/off choice is remembered per device.
export function useWakeLock() {
  const [supported, setSupported] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const lockRef = useRef(null)

  useEffect(() => {
    setSupported('wakeLock' in navigator)
    try {
      setEnabled(localStorage.getItem(STORAGE_KEY) === '1')
    } catch {
      // Storage blocked — default to off.
    }
  }, [])

  useEffect(() => {
    if (!supported || !enabled) return undefined

    let cancelled = false
    const acquire = async () => {
      if (document.visibilityState !== 'visible' || lockRef.current) return
      try {
        const lock = await navigator.wakeLock.request('screen')
        if (cancelled) {
          lock.release()
          return
        }
        lockRef.current = lock
        lock.addEventListener('release', () => {
          lockRef.current = null
        })
      } catch {
        // Refused (e.g. low-power mode) — leave the toggle on and retry on the
        // next visibility change.
      }
    }

    acquire()
    document.addEventListener('visibilitychange', acquire)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', acquire)
      lockRef.current?.release()
      lockRef.current = null
    }
  }, [supported, enabled])

  const toggle = useCallback(() => {
    setEnabled((on) => {
      try {
        if (on) localStorage.removeItem(STORAGE_KEY)
        else localStorage.setItem(STORAGE_KEY, '1')
      } catch {
        // Storage blocked — the toggle still works for this visit.
      }
      return !on
    })
  }, [])

  return { supported, enabled, toggle }
}
