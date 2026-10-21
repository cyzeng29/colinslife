import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CanvasRegion from './CanvasRegion.jsx'
import LandingSidebar from './LandingSidebar.jsx'
import StringHall from './StringHall.jsx'
import Character from './Character.jsx'
import Bridge from './Bridge.jsx'
import Desk from './Desk.jsx'
import { octave } from '../PianoNav.jsx'
import { usePluck } from '../PluckProvider.jsx'
import usePianoHeight from '../../hooks/usePianoHeight.js'
import useScrollProgress from '../../hooks/useScrollProgress.js'
import useMediaQuery from '../../hooks/useMediaQuery.js'
import useArrowScreens from '../../hooks/useArrowScreens.js'
import {
  CANVAS,
  DESK_FEET_Y,
  DESK_FRAME,
  FEET_Y,
  HALL,
  HALL_REACH_Y,
  SCREEN_TWO_Y,
  SEAM_Y,
  SIDEBAR_W,
  stageRegions,
} from '../../data/landingGeometry.js'
import { landing } from '../../data/content.js'

const navKeys = octave.filter((k) => k.to)
// walk under the string, then pluck; ~0.6s from click to page change
const MOVE_MS = 280
const PLUCK_MS = 320

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// The Home landing, drawn by Colin: the sidebar, the hall with the strings
// (screen 1, stretched to fill the window so half the bridge peeks up from
// the bottom edge), the bridge in the fog, and the desk (screen 2). It
// continues the piano bar's drawing above. Scrolling (or ↓ / ↑) walks Colin
// down to his spot at the desk and back; a piano nav key makes him pluck its string
// first, then goes there.
export default function Landing() {
  const rootRef = useRef(null)
  const hallRef = useRef(null)
  const deskRef = useRef(null)
  const screenTwoRef = useRef(null) // the second screen starts here (whole bridge in view)
  const [plucking, setPlucking] = useState(null)
  const navigate = useNavigate()
  const pluck = usePluck()
  const phone = useMediaQuery('(max-width: 700px)')
  usePianoHeight() // sets --piano-h, used for scroll offsets
  useScrollProgress(rootRef, screenTwoRef)
  useArrowScreens(screenTwoRef)
  const regions = stageRegions(phone)

  // How far the walk down has to go: from where Colin stands under the
  // strings to where he stands at the desk, which depends on how tall the
  // window makes the hall. Also how tall the sidebar is: from the bottom of
  // the piano to the bottom of the desk panel on the desk screen, so it stays
  // put the whole way down and Recruiter Mode lines up with the panel's edge;
  // and the strip of landing below that edge (--side-tail), so scrolling on
  // past the desk takes the sidebar away with the panel instead of leaving
  // Recruiter Mode below it.
  useEffect(() => {
    const hall = hallRef.current
    const desk = deskRef.current
    const screenTwo = screenTwoRef.current
    const root = rootRef.current
    if (!hall || !desk || !screenTwo || !root) return
    const measure = () => {
      const scale = hall.clientWidth / regions.hallTop.w // px per canvas px
      const deskTop = desk.getBoundingClientRect().top
      const feet = hall.getBoundingClientRect().top + (FEET_Y - regions.hallTop.y) * scale
      const deskFeet = deskTop + (DESK_FEET_Y - regions.desk.y) * scale
      root.style.setProperty('--walk-px', `${Math.max(0, deskFeet - feet)}px`)
      const panelBottom = deskTop + (DESK_FRAME.y + DESK_FRAME.h - regions.desk.y) * scale
      const sideH = Math.max(0, panelBottom - screenTwo.getBoundingClientRect().top)
      root.style.setProperty('--side-h', `${sideH}px`)
      root.style.setProperty('--side-tail', `${Math.max(0, root.getBoundingClientRect().bottom - panelBottom)}px`)
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(hall)
    return () => ro.disconnect()
  }, [regions.hallTop, regions.desk])

  useEffect(() => {
    if (!pluck) return
    let timers = []
    let pending = false
    const clear = () => {
      timers.forEach(clearTimeout)
      timers = []
    }

    function go(key) {
      pending = false
      setPlucking(null)
      // Home scrolls to the top (HOME) or to its case studies (EXPERIENCE)
      navigate(key.to)
    }

    const unregister = pluck.register((key) => {
      if (reducedMotion()) return false // plain link, no animation
      clear()
      // a second key mid-pluck skips straight to the new destination
      if (pending) {
        go(key)
        return true
      }
      pending = true
      setPlucking({ to: key.to, phase: 'move' })
      timers.push(setTimeout(() => setPlucking({ to: key.to, phase: 'pluck' }), MOVE_MS))
      timers.push(setTimeout(() => go(key), MOVE_MS + PLUCK_MS))
      return true
    })
    return () => {
      unregister()
      clear()
    }
  }, [pluck, navigate])

  return (
    <div
      className="landing"
      ref={rootRef}
      style={{
        // sidebar column width as drawn, and canvas-unit maths in index.css
        '--sidebar-w': `${(SIDEBAR_W / CANVAS.w) * 100}%`,
        '--stage-fr': regions.hallTop.w,
        // the second screen starts this far (canvas px) above the gap's centre
        // (negative: below it)
        '--screen-two-lead': SEAM_Y - SCREEN_TWO_Y,
        // where the drawn hall panel sits across the stage
        '--hall-left': `${((HALL.x - regions.hallTop.x) / regions.hallTop.w) * 100}%`,
        '--hall-right': `${((regions.hallTop.x + regions.hallTop.w - HALL.x - HALL.w) / regions.hallTop.w) * 100}%`,
        // canvas px the hall panel reaches up behind the key labels
        '--hall-reach': HALL.y - HALL_REACH_Y,
      }}
    >
      <LandingSidebar content={landing.sidebar} />
      <div className="stage">
        <div className="hall" ref={hallRef}>
          <CanvasRegion region={regions.hallTop} className="hall-top">
            <StringHall keys={navKeys} plucking={plucking} />
            <Character keys={navKeys} plucking={plucking} />
          </CanvasRegion>
        </div>
        <div className="seam">
          {/* scroll-snap point and walk target for the desk screen: the
              desk panel's top edge lands just under the piano */}
          <span ref={screenTwoRef} className="screen-two" aria-hidden="true" />
          {/* centred on the gap, so half the bridge sits in each panel */}
          <CanvasRegion
            region={regions.seam}
            className="seam-region"
            style={{ transform: `translateY(${(-(SEAM_Y - regions.seam.y) / regions.seam.h) * 100}%)` }}
          >
            <Bridge text={landing.bridge.text} />
          </CanvasRegion>
        </div>
        <CanvasRegion region={regions.desk} className="desk-region" ref={deskRef}>
          <Desk content={landing} />
        </CanvasRegion>
      </div>
    </div>
  )
}
