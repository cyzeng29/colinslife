import { useEffect, useState } from 'react'
import { Layer, useRegion } from './CanvasRegion.jsx'
import { LAYERS, PICK_X, hasLayer } from '../../data/landingGeometry.js'

const STEP_MS = 110

// Colin under the strings, from behind. On a pluck he walks (the two drawn
// back-walk frames) until the pick lines up with the string, then plucks.
// Scrolling walks him down toward the bridge (--walk, set on the landing),
// stepping through the back-walk frames for now (the front-walk frames take
// over once they're drawn); he then appears at the desk.
export default function Character({ plucking, keys }) {
  const region = useRegion()
  const [step, setStep] = useState(0)
  const moving = plucking?.phase === 'move'

  useEffect(() => {
    if (!moving) return
    const id = setInterval(() => setStep((s) => s + 1), STEP_MS)
    return () => clearInterval(id)
  }, [moving])

  const target = plucking && LAYERS[`string-${keys.find((k) => k.to === plucking.to)?.label}`]
  const dx = target ? ((target.x + target.w / 2 - PICK_X) / region.w) * 100 : 0
  const frame = moving ? `walking-back-${(step % 2) + 1}` : 'char-pluck'

  return (
    <div
      className={'hall-char' + (plucking?.phase === 'pluck' ? ' is-plucking' : '') + (moving ? ' is-moving' : '')}
      style={{ '--dx': `${dx}%` }}
      aria-hidden="true"
    >
      {/* all frames stay mounted (no reload flicker); only the current one shows */}
      {['char-pluck', 'walking-back-1', 'walking-back-2'].map((slug) => (
        <Layer key={slug} slug={slug} className={`char-frame frame-${slug}` + (slug === frame ? ' is-current' : '')} />
      ))}
      {hasLayer('walking-front-1') && (
        <>
          <Layer slug="walking-front-1" className="char-walk-front f1" />
          <Layer slug="walking-front-2" className="char-walk-front f2" />
        </>
      )}
    </div>
  )
}
