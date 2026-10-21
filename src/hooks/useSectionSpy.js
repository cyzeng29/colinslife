import { useEffect, useState } from 'react'

// The id of the section being read: the last of `ids` whose element has
// crossed a line a third of the way down the window. Starts on the first.
// Without IntersectionObserver (old browsers, tests) it stays on the first.
export default function useSectionSpy(ids) {
  const [active, setActive] = useState(ids[0])
  const key = ids.join(' ')

  useEffect(() => {
    const list = key.split(' ')
    setActive(list[0])
    if (typeof IntersectionObserver === 'undefined') return
    const els = list.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-33% 0px -62% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])

  return active
}
