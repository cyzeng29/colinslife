import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// Opening a different page starts at its top, not wherever the last page was
// scrolled. Leaves alone: the first load (the browser restores it), back and
// forward (the browser restores those too), and links to a spot on a page
// (#case-studies), which that page scrolls to itself.
export default function useScrollToTopOnNavigate() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  const first = useRef(true)

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (navigationType === 'POP' || hash) return
    window.scrollTo?.(0, 0)
  }, [pathname]) // only a change of page; hash and navigation type are read at that moment
}
