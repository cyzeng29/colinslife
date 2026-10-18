import { useSyncExternalStore } from 'react'

// Live result of a CSS media query (false where matchMedia is unavailable).
export default function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia?.(query)
      mq?.addEventListener?.('change', onChange)
      return () => mq?.removeEventListener?.('change', onChange)
    },
    () => Boolean(window.matchMedia?.(query).matches),
    () => false,
  )
}
