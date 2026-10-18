import { useSyncExternalStore } from 'react'

// Whether the window has scrolled away from the very top.
export default function useScrolled() {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener('scroll', onChange, { passive: true })
      return () => window.removeEventListener('scroll', onChange)
    },
    () => window.scrollY > 0,
    () => false,
  )
}
