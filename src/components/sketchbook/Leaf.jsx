import { STRIPS, leafAngles, sliceFor, stripLight } from './leaf.js'

// The page being turned, as a chain of strips each hinged to the last (see
// leaf.js). Every strip shows its slice of `front` on one side and of `back` on
// the other, with shading that follows its angle to the light.
export default function Leaf({ dir, p, front, back, strips = STRIPS }) {
  const { base, steps, absolute } = leafAngles(p, strips)
  const sign = dir === 'next' ? -1 : 1

  const strip = (i) => {
    const slice = sliceFor(dir, i, strips)
    const light = stripLight(absolute[i])
    return (
      <div
        className="sb-strip"
        style={{
          transform: i ? `rotateY(${sign * steps[i]}deg)` : undefined,
          '--sb-shade-front': light.front.toFixed(3),
          '--sb-shade-back': light.back.toFixed(3),
          '--sb-glint': light.glint.toFixed(3),
        }}
      >
        <div className="sb-face is-front">
          <div className="sb-slice" style={{ left: `${-slice.front * 100}%` }}>
            {front}
          </div>
        </div>
        <div className="sb-face is-back">
          <div className="sb-slice" style={{ left: `${-slice.back * 100}%` }}>
            {back}
          </div>
        </div>
        {i + 1 < strips && strip(i + 1)}
      </div>
    )
  }

  return (
    <div
      className={`sb-leaf is-${dir}`}
      style={{ '--sb-strips': strips, transform: `rotateY(${sign * base}deg)` }}
      aria-hidden="true"
      data-testid="sb-leaf"
    >
      {strip(0)}
    </div>
  )
}
