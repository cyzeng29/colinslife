import { useEffect, useState } from 'react'

// Tracks the sticky piano's height and mirrors it into the --piano-h CSS
// variable, so sticky elements and scroll targets can sit just below it.
export default function usePianoHeight() {
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const el = document.querySelector('.piano-wrap')
    if (!el) return
    const update = () => {
      const h = Math.round(el.getBoundingClientRect().height)
      setHeight(h)
      document.documentElement.style.setProperty('--piano-h', h + 'px')
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return height
}
