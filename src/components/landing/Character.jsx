import { useEffect, useState } from 'react'
import { Layer, LayerImg, Spot, useRegion } from './CanvasRegion.jsx'
import { LAYERS, PICK_X, hasLayer } from '../../data/landingGeometry.js'

const STEP_MS = 110

// The front-walk frames are drawn where he stands at the desk (char-front).
// Shift them all by the same amount so that pose's feet land on the plucking
// pose's feet, keeping the frames registered with each other. Walking down
// undoes the sideways part of the shift, so he arrives on the desk pose.
const deskShiftX = (() => {
  const desk = LAYERS['char-front']
  const stand = LAYERS['char-pluck']
  return desk && stand ? stand.x + stand.w / 2 - (desk.x + desk.w / 2) : 0
})()
function frontWalkBox(slug) {
  const box = LAYERS[slug]
  const desk = LAYERS['char-front']
  const stand = LAYERS['char-pluck']
  return { ...box, x: box.x + deskShiftX, y: box.y + stand.y + stand.h - (desk.y + desk.h) }
}
// Stardew-style front walk: step, stand, other step, stand
const FRONT_WALK = [
  ['walking-front-1', 'f1'],
  ['char-front', 'stand'],
  ['walking-front-2', 'f2'],
]
// Walking back up he faces away: the two back-walk frames, their feet set on
// the plucking pose's feet so he doesn't hop when he turns around.
const BACK_WALK = [
  ['walking-back-1', 'b1'],
  ['walking-back-2', 'b2'],
]
function backWalkBox(slug) {
  const box = LAYERS[slug]
  const stand = LAYERS['char-pluck']
  return { ...box, y: stand.y + stand.h - box.h }
}

// Colin under the strings, from behind. On a pluck he walks (the two drawn
// back-walk frames) until the pick lines up with the string, then plucks.
// Scrolling walks him down past the bridge to his spot at the desk (--walk,
// set on the landing), facing front and stepping through the front-walk
// frames (back-walk until those are drawn); there the desk pose takes over.
// Scrolling back up, he turns and walks away through the back-walk frames.
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
      style={{ '--dx': `${dx}%`, '--walk-dx': `${(-deskShiftX / region.w) * 100}%` }}
      aria-hidden="true"
    >
      {/* all frames stay mounted (no reload flicker); only the current one shows */}
      {['char-pluck', 'walking-back-1', 'walking-back-2'].map((slug) => (
        <Layer key={slug} slug={slug} className={`char-frame frame-${slug}` + (slug === frame ? ' is-current' : '')} />
      ))}
      {hasLayer('walking-front-1') && (
        <>
          {FRONT_WALK.map(([slug, beat]) => (
            <Spot key={slug} box={frontWalkBox(slug)} className={`char-walk-front ${beat}`}>
              <LayerImg slug={slug} />
            </Spot>
          ))}
          {BACK_WALK.map(([slug, beat]) => (
            <Spot key={slug} box={backWalkBox(slug)} className={`char-walk-back ${beat}`}>
              <LayerImg slug={slug} />
            </Spot>
          ))}
        </>
      )}
    </div>
  )
}
