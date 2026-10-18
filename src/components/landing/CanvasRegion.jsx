import { createContext, forwardRef, useContext } from 'react'
import { asset } from '../Frame.jsx'
import { LAYERS } from '../../data/landingGeometry.js'

const RegionContext = createContext(null)

// A rectangle of Colin's drawing ({ x, y, w, h } in canvas px) shown at the
// width of its container. Everything inside is placed in canvas coordinates
// (as percentages of the region), so it scales with the page and lines up
// exactly as drawn.
const CanvasRegion = forwardRef(function CanvasRegion({ region, className = '', style, children }, ref) {
  return (
    <div ref={ref} className={`canvas-region ${className}`} style={{ aspectRatio: `${region.w} / ${region.h}`, ...style }}>
      <RegionContext.Provider value={region}>{children}</RegionContext.Provider>
    </div>
  )
})
export default CanvasRegion

export function useRegion() {
  return useContext(RegionContext)
}

// CSS position for a canvas box inside a region
export function place(box, region) {
  return {
    left: `${((box.x - region.x) / region.w) * 100}%`,
    top: `${((box.y - region.y) / region.h) * 100}%`,
    width: `${(box.w / region.w) * 100}%`,
    height: `${(box.h / region.h) * 100}%`,
  }
}

export const layerSrc = (slug) => asset(`images/landing/${slug}.png`)

// One drawn layer at its drawn position. Renders nothing if the layer hasn't
// been exported yet.
export function Layer({ slug, alt = '', className = '', style, ...rest }) {
  const region = useRegion()
  const box = LAYERS[slug]
  if (!box) return null
  return (
    <img
      className={`layer ${className}`}
      src={layerSrc(slug)}
      alt={alt}
      draggable="false"
      style={{ ...place(box, region), ...style }}
      {...rest}
    />
  )
}

// A positioned element (button, link, heading...) covering a layer's box, or
// any canvas box. Put a <LayerImg> inside to show the drawing.
export const Spot = forwardRef(function Spot({ as: Tag = 'div', slug, box, className = '', style, children, ...rest }, ref) {
  const region = useRegion()
  const b = box || LAYERS[slug]
  if (!b) return null
  return (
    <Tag ref={ref} className={`spot ${className}`} style={{ ...place(b, region), ...style }} {...rest}>
      {children}
    </Tag>
  )
})

// A layer's drawing filling its parent (inside a Spot, or in a stacked list)
export function LayerImg({ slug, alt = '', className = '' }) {
  if (!LAYERS[slug]) return null
  return <img className={`layer-img ${className}`} src={layerSrc(slug)} alt={alt} draggable="false" />
}
