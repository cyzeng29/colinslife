import { useCallback, useEffect, useRef, useState } from 'react'

const FULL_TURN_MS = 860 // a whole page turned by a button or a click
const SETTLE_MS = 620 // a released leaf finishing or falling back, for a whole page's distance
const MIN_SETTLE_MS = 160

const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2)
const easeOut = (k) => 1 - (1 - k) ** 3

// Which spread of `count` is open, and the leaf being turned, if any:
// { dir: 'next' | 'prev', p, held }. A leaf can be turned all the way at once
// (`flip`), or picked up (`grab`), moved (`drag`) and let go (`release`), when it
// either finishes the turn or falls back. With `reduced` it never animates.
export default function usePageTurn(count, reduced = false) {
  const [index, setIndex] = useState(0)
  const [turn, setTurn] = useState(null)
  const live = useRef(null)
  const frame = useRef(0)

  const show = useCallback((next) => {
    live.current = next
    setTurn(next)
  }, [])

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const open = (dir) => (dir === 'next' ? index < count - 1 : index > 0)

  function land(dir, over) {
    if (over) setIndex((i) => i + (dir === 'next' ? 1 : -1))
    show(null)
  }

  // Moves the leaf from where it is to `to` (1 over, 0 back), then lands it
  function settle(to, { ms, ease }) {
    const { dir, p: from } = live.current
    cancelAnimationFrame(frame.current)
    if (reduced) return land(dir, to === 1)
    const start = performance.now()
    const step = (now) => {
      const k = Math.min(1, (now - start) / ms)
      show({ dir, p: from + (to - from) * ease(k), held: false })
      if (k < 1) frame.current = requestAnimationFrame(step)
      else land(dir, to === 1)
    }
    frame.current = requestAnimationFrame(step)
  }

  function flip(dir) {
    if (live.current || !open(dir)) return
    if (reduced) return setIndex((i) => i + (dir === 'next' ? 1 : -1))
    show({ dir, p: 0, held: false })
    settle(1, { ms: FULL_TURN_MS, ease: easeInOut })
  }

  // Picks up the leaf, if there's one to turn that way
  function grab(dir) {
    if (live.current || !open(dir)) return false
    show({ dir, p: 0, held: true })
    return true
  }

  function drag(p) {
    if (live.current?.held) show({ ...live.current, p })
  }

  function release(over) {
    if (!live.current?.held) return
    const to = over ? 1 : 0
    const ms = Math.max(MIN_SETTLE_MS, SETTLE_MS * Math.abs(to - live.current.p))
    settle(to, { ms, ease: easeOut })
  }

  return { index, turn, flip, grab, drag, release }
}
