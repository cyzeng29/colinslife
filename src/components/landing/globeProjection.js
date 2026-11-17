// Where a place on Earth lands on the pop-up's map, as the map curls from flat
// (t = 0) into a globe (t = 1). Units: x runs -1 to 1 across the canvas, y
// grows downward, and the origin is the canvas centre.

// The dot grid. Antarctica and the far north are left off, as they'd only
// stretch the flat map. latStep keeps the flat map's dots evenly spaced.
const FLAT_STRETCH = 1.3
export const LAND_GRID = {
  lonStep: 2.5,
  latStep: 2.5 / FLAT_STRETCH,
  latTop: 78,
  latBottom: -58,
}
const LAT_MIDDLE = (LAND_GRID.latTop + LAND_GRID.latBottom) / 2

// The canvas is 2 wide by this tall, so the flat map fills its width and the
// globe (GLOBE_R) fits its height.
export const CANVAS_RATIO = 1.6
export const GLOBE_R = 0.58

const RAD = Math.PI / 180
const lerp = (a, b, t) => a + (b - a) * t

export const flatPoint = (lat, lon) => ({
  x: lon / 180,
  y: ((LAT_MIDDLE - lat) / 180) * FLAT_STRETCH,
})

// `rotation` is the { lat, lon } that faces the viewer. z is toward the viewer,
// from -GLOBE_R (far side) to GLOBE_R.
export const spherePoint = (lat, lon, rotation) => {
  const phi = lat * RAD
  const dLon = (lon - rotation.lon) * RAD
  const tilt = rotation.lat * RAD
  const up = Math.sin(phi)
  const out = Math.cos(phi) * Math.cos(dLon)
  return {
    x: GLOBE_R * Math.cos(phi) * Math.sin(dLon),
    y: -GLOBE_R * (up * Math.cos(tilt) - out * Math.sin(tilt)),
    z: GLOBE_R * (up * Math.sin(tilt) + out * Math.cos(tilt)),
  }
}

// Dots dim toward the globe's edge and vanish round the back
const faceAlpha = (z) => (z <= 0 ? 0 : 0.35 + 0.65 * (z / GLOBE_R))

export const morphPoint = (lat, lon, t, rotation) => {
  const flat = flatPoint(lat, lon)
  const sphere = spherePoint(lat, lon, rotation)
  return {
    x: lerp(flat.x, sphere.x, t),
    y: lerp(flat.y, sphere.y, t),
    alpha: lerp(1, faceAlpha(sphere.z), t),
  }
}

export const faceRotation = (lat, lon) => ({ lat, lon })

// The land's dots as [{ lat, lon }], from landDots.json's rows
export const landPoints = (rows) => {
  const points = []
  rows.forEach((row, r) => {
    const lat = LAND_GRID.latTop - r * LAND_GRID.latStep
    for (let c = 0; c < row.length; c++) {
      if (row[c] === '1') points.push({ lat, lon: -180 + c * LAND_GRID.lonStep })
    }
  })
  return points
}

// Zooming. The view is a scale `k` (1 shows the whole map) and the map point
// `x, y` at the canvas centre. Flat, the map can be panned no further than its
// edges; as a globe it stays centred, since spinning it does the panning, and
// zooms less far: close up, a globe is mostly its own dark body and scattered dots.
export const ZOOM = { min: 1, max: 6, globeMax: 2, step: 2.5 }
export const maxZoom = (view) => (view === 'globe' ? ZOOM.globeMax : ZOOM.max)
const MAP_HALF_H = 0.49 // the flat map's dots run from about -0.49 to 0.49 down the canvas
const CANVAS_HALF_H = 1 / CANVAS_RATIO

export function clampView({ k, x, y }, max = ZOOM.max) {
  const zoom = Math.min(max, Math.max(ZOOM.min, k))
  const limX = Math.max(0, 1 - 1 / zoom)
  const limY = Math.max(0, MAP_HALF_H - CANVAS_HALF_H / zoom)
  // + 0 turns a -0 into a plain 0
  return { k: zoom, x: Math.max(-limX, Math.min(limX, x)) + 0, y: Math.max(-limY, Math.min(limY, y)) + 0 }
}

// The view after zooming to `k`, keeping the map point under `at` (canvas
// units from the centre) where it is
export function zoomAbout(view, k, at = { x: 0, y: 0 }, max = ZOOM.max) {
  const under = { x: view.x + at.x / view.k, y: view.y + at.y / view.k }
  return clampView({ k, x: under.x - at.x / k, y: under.y - at.y / k }, max)
}

// Where a map point lands on the canvas, in canvas units from the centre. As
// the map curls into a globe the pan eases out (`t`), keeping the globe centred.
export const viewPoint = (p, view, t) => ({ x: (p.x - view.x * (1 - t)) * view.k, y: (p.y - view.y * (1 - t)) * view.k })
