import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Landing from '../components/landing/Landing.jsx'
import CaseGrid from '../components/caseStudies/CaseGrid.jsx'

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function Home() {
  const { hash, key } = useLocation()
  const arrived = useRef(false)

  // /#case-studies (the EXPERIENCE key, "← Case studies") goes to the case
  // studies: straight there when arriving from another page, gliding when
  // already here. HOME while already here glides back to the top.
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1))
    if (!arrived.current) {
      arrived.current = true
      target?.scrollIntoView?.({ behavior: 'auto' })
      return
    }
    const behavior = reducedMotion() ? 'auto' : 'smooth'
    if (target) target.scrollIntoView?.({ behavior })
    else window.scrollTo?.({ top: 0, behavior })
  }, [hash, key])

  return (
    <>
      <Landing />

      {/* .case-studies: where the header condenses and the underline moves
          to EXPERIENCE (useHeaderCondense), and a scroll resting point */}
      <section className="case-studies" id="case-studies" aria-labelledby="case-studies-title">
        <h2 className="sr-only" id="case-studies-title">
          Case studies
        </h2>
        <CaseGrid />
      </section>
    </>
  )
}
