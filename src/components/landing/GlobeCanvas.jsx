import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import landDots from '../../data/landDots.json'
import { CANVAS_RATIO, GLOBE_R, ZOOM, clampView, faceRotation, flatPoint, landPoints, maxZoom, morphPoint, viewPoint, zoomAbout } from './globeProjection.js'

const LAND = landPoints(landDots.rows)
const MORPH_MS = 700
const TURN_MS = 120 // how quickly the globe catches up with where it's headed
const PULSE_MS = 1600
const ARROW_DEG = 10
const MAX_TILT = 80
const MARKER_HIT_PX = 14
const MARKER_FULL_SIZE_PX = 860
const CLICK_SLOP_PX = 4
const ZOOM_MS = 140 // how quickly a zoom eases in
const WHEEL_RATE = 0.0016 // zoom per pixel scrolled
// Dots are drawn in one path per brightness, so a frame takes few fills
const ALPHA_STEPS = 8
const LAND_ALPHA = 0.62

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const clampTilt = (lat) => Math.max(-MAX_TILT, Math.min(MAX_TILT, lat))
const shortestTurn = (deg) => ((((deg + 180) % 360) + 360) % 360) - 180
const cssVar = (el, name) => getComputedStyle(el).getPropertyValue(name).trim()

// The dotted world on a canvas, flat or curled into a globe. The dots and
// markers move outside React: props say where to head, and frames run only
// while something is moving (or the chosen marker is pulsing).
// It zooms: a click on open map zooms in there, the wheel and a pinch zoom
// about the pointer, and zoomed in, dragging the flat map moves it. Markers
// keep their size, so close places come apart. `zoomIn` and `zoomOut` (on
// the ref) step it from buttons; `onZoom` hears the zoom level as it changes.
const GlobeCanvas = forwardRef(function GlobeCanvas({ places, view, selected, turnKey, onSelect, onHover, onZoom, zoomed = false, reducedMotion, label }, ref) {
  const canvasRef = useRef(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const first = places[0]
  const sceneRef = useRef({
    size: 0,
    t: view === 'globe' ? 1 : 0,
    morphFrom: 0,
    morphStart: null,
    rotation: first ? faceRotation(first.lat, first.lon) : { lat: 20, lon: 0 },
    heading: null, // where the rotation is easing to; null while still or dragged
    frame: null,
    last: 0,
    drag: null,
    zoom: { k: 1, x: 0, y: 0 },
    zoomTo: null, // the view the zoom is easing to
    pointers: new Map(), // touches down, for a pinch
    pinch: null,
  })
  const onZoomRef = useRef(onZoom)
  onZoomRef.current = onZoom
  const propsRef = useRef()
  propsRef.current = { places, view, selected, reducedMotion }

  const draw = (now) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext?.('2d')
    const scene = sceneRef.current
    if (!ctx || !scene.size) return
    const dpr = window.devicePixelRatio || 1
    const unit = scene.size / 2
    const height = scene.size / CANVAS_RATIO
    const toPx = (p) => {
      const v = viewPoint(p, scene.zoom, scene.t)
      return { x: scene.size / 2 + v.x * unit, y: height / 2 + v.y * unit }
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, scene.size, height)

    // The globe's body fades in as the map curls, so it reads as solid against
    // the page behind
    if (scene.t > 0) {
      ctx.globalAlpha = scene.t
      ctx.beginPath()
      ctx.arc(scene.size / 2, height / 2, GLOBE_R * unit * scene.zoom.k, 0, Math.PI * 2)
      ctx.fillStyle = cssVar(canvas, '--scrim')
      ctx.fill()
      // its rim, until zoomed in past where it fits (it would show as stray
      // corners of a circle)
      const rimFits = Math.max(0, 1 - (scene.zoom.k - 1) * 4)
      if (rimFits > 0) {
        ctx.globalAlpha = scene.t * 0.3 * rimFits
        ctx.strokeStyle = cssVar(canvas, '--on-green')
        ctx.stroke()
      }
    }

    // A little bigger zoomed in, so the land still reads as land
    const dot = Math.max(0.9, scene.size * 0.0016) * Math.min(2, Math.sqrt(scene.zoom.k))
    const inView = (q) => q.x > -dot && q.y > -dot && q.x < scene.size + dot && q.y < height + dot
    const buckets = Array.from({ length: ALPHA_STEPS + 1 }, () => [])
    for (const { lat, lon } of LAND) {
      const p = morphPoint(lat, lon, scene.t, scene.rotation)
      const step = Math.round(p.alpha * ALPHA_STEPS)
      if (step === 0) continue
      const q = toPx(p)
      if (inView(q)) buckets[step].push(q)
    }
    ctx.fillStyle = cssVar(canvas, '--on-green')
    buckets.forEach((points, step) => {
      if (!points.length) return
      ctx.globalAlpha = (step / ALPHA_STEPS) * LAND_ALPHA
      ctx.beginPath()
      for (const { x, y } of points) {
        ctx.moveTo(x + dot, y)
        ctx.arc(x, y, dot, 0, Math.PI * 2)
      }
      ctx.fill()
    })

    const { places, selected, reducedMotion } = propsRef.current
    const halo = cssVar(canvas, '--olive-pale')
    const marker = cssVar(canvas, '--key-white')
    // Smaller on a small map, and the chosen one on top of its neighbours
    const size = Math.max(0.6, Math.min(1, scene.size / MARKER_FULL_SIZE_PX))
    const ordered = selected ? [...places.filter((place) => place !== selected), selected] : places
    for (const place of ordered) {
      const p = morphPoint(place.lat, place.lon, scene.t, scene.rotation)
      if (p.alpha <= 0) continue
      const { x, y } = toPx(p)
      const chosen = place === selected
      const pulse = chosen && !reducedMotion ? (now % PULSE_MS) / PULSE_MS : 0
      ctx.fillStyle = halo
      ctx.globalAlpha = p.alpha * (chosen ? 0.5 - pulse * 0.4 : 0.4)
      ctx.beginPath()
      ctx.arc(x, y, ((chosen ? 11 : 6) + pulse * 8) * size, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = marker
      ctx.globalAlpha = p.alpha
      ctx.beginPath()
      ctx.arc(x, y, (chosen ? 5.5 : 3) * size, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  const step = (now) => {
    const scene = sceneRef.current
    scene.frame = null
    const dt = now - scene.last
    scene.last = now
    if (scene.morphStart !== null) {
      if (scene.morphStart < 0) scene.morphStart = now
      const target = propsRef.current.view === 'globe' ? 1 : 0
      const progress = Math.min(1, (now - scene.morphStart) / MORPH_MS)
      scene.t = scene.morphFrom + (target - scene.morphFrom) * ease(progress)
      if (progress === 1) scene.morphStart = null
    }
    if (scene.heading) {
      const k = 1 - Math.exp(-Math.min(dt, 64) / TURN_MS)
      const dLon = shortestTurn(scene.heading.lon - scene.rotation.lon)
      const dLat = scene.heading.lat - scene.rotation.lat
      if (Math.abs(dLon) < 0.05 && Math.abs(dLat) < 0.05) {
        scene.rotation = scene.heading
        scene.heading = null
      } else {
        scene.rotation = { lat: scene.rotation.lat + dLat * k, lon: scene.rotation.lon + dLon * k }
      }
    }
    if (scene.zoomTo) {
      const k = 1 - Math.exp(-Math.min(dt, 64) / ZOOM_MS)
      const to = scene.zoomTo
      const from = scene.zoom
      if (Math.abs(to.k - from.k) < 0.002 && Math.abs(to.x - from.x) < 0.0005 && Math.abs(to.y - from.y) < 0.0005) {
        scene.zoom = to
        scene.zoomTo = null
      } else {
        scene.zoom = { k: from.k + (to.k - from.k) * k, x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k }
      }
    }
    draw(now)
    const { selected, reducedMotion } = propsRef.current
    if (scene.morphStart !== null || scene.heading || scene.zoomTo || (selected && !reducedMotion)) schedule()
  }
  const schedule = () => {
    const scene = sceneRef.current
    if (scene.frame !== null || !canvasRef.current?.getContext?.('2d')) return
    if (!scene.last) scene.last = performance.now()
    scene.frame = requestAnimationFrame(step)
  }

  // Fit the canvas to its box, sharp on any screen
  useEffect(() => {
    const canvas = canvasRef.current
    const scene = sceneRef.current
    const fit = () => {
      const size = canvas.clientWidth
      if (!size) return
      const dpr = window.devicePixelRatio || 1
      scene.size = size
      canvas.width = Math.round(size * dpr)
      canvas.height = Math.round((size / CANVAS_RATIO) * dpr)
      draw(performance.now())
    }
    fit()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(fit)
    observer?.observe(canvas)
    return () => {
      observer?.disconnect()
      if (scene.frame !== null) cancelAnimationFrame(scene.frame)
      scene.frame = null
    }
  }, [])

  // Flat or globe
  useEffect(() => {
    const scene = sceneRef.current
    const target = view === 'globe' ? 1 : 0
    if (scene.t === target) return
    if (reducedMotion) {
      scene.t = target
      scene.morphStart = null
      draw(performance.now())
      return
    }
    scene.morphFrom = scene.t
    scene.morphStart = -1 // starts on the next frame
    schedule()
  }, [view, reducedMotion])

  // Turn to the chosen place, also when it's picked again after a spin
  useEffect(() => {
    const scene = sceneRef.current
    if (selected) {
      const facing = faceRotation(selected.lat, selected.lon)
      if (reducedMotion) {
        scene.rotation = facing
        scene.heading = null
      } else {
        scene.heading = facing
      }
    }
    draw(performance.now())
    schedule()
  }, [selected, turnKey, reducedMotion])

  // Where a pointer is on the canvas, in canvas units from the centre
  const canvasAt = (e) => {
    const box = canvasRef.current.getBoundingClientRect()
    const unit = sceneRef.current.size / 2 || 1
    return { x: (e.clientX - box.left - box.width / 2) / unit, y: (e.clientY - box.top - box.height / 2) / unit }
  }

  // Heads for a new view: eased, or straight there under reduced motion or mid-gesture
  const setView = (next, { now = false } = {}) => {
    const scene = sceneRef.current
    const to = clampView(next, maxZoom(propsRef.current.view))
    onZoomRef.current?.(to.k)
    if (now || propsRef.current.reducedMotion) {
      scene.zoom = to
      scene.zoomTo = null
      draw(performance.now())
    } else {
      scene.zoomTo = to
    }
    schedule()
  }
  const target = () => sceneRef.current.zoomTo || sceneRef.current.zoom
  const zoomBy = (factor, at, opts) => setView(zoomAbout(target(), target().k * factor, at, maxZoom(propsRef.current.view)), opts)

  useImperativeHandle(ref, () => ({
    zoomIn: () => zoomBy(ZOOM.step),
    zoomOut: () => zoomBy(1 / ZOOM.step),
  }))

  // The wheel zooms about the pointer. Listened for directly, as React's wheel
  // listener can't stop the pop-up scrolling instead.
  useEffect(() => {
    const canvas = canvasRef.current
    const onWheel = (e) => {
      e.preventDefault()
      zoomBy(Math.exp(-e.deltaY * WHEEL_RATE), canvasAt(e), { now: true })
    }
    canvas.addEventListener('wheel', onWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', onWheel)
  }, [])

  // A globe zooms less far: coming round from the flat map, ease back to its limit
  useEffect(() => {
    if (target().k > maxZoom(view)) setView(target())
  }, [view])

  // Picked while zoomed in on the flat map: slide over to it
  useEffect(() => {
    if (!selected || view === 'globe' || target().k <= 1) return
    const p = flatPoint(selected.lat, selected.lon)
    setView({ k: target().k, x: p.x, y: p.y })
  }, [selected, turnKey])

  const markerAt = (e) => {
    const scene = sceneRef.current
    const at = canvasAt(e)
    const unit = scene.size / 2
    let best = null
    let bestDist = MARKER_HIT_PX
    for (const place of propsRef.current.places) {
      const p = morphPoint(place.lat, place.lon, scene.t, scene.rotation)
      if (p.alpha <= 0) continue
      const v = viewPoint(p, scene.zoom, scene.t)
      const dist = Math.hypot(v.x - at.x, v.y - at.y) * unit
      if (dist < bestDist) {
        best = place
        bestDist = dist
      }
    }
    return best
  }

  const spread = (pointers) => {
    const [a, b] = [...pointers.values()]
    return { dist: Math.hypot(a.x - b.x, a.y - b.y), mid: { clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 } }
  }

  const onPointerDown = (e) => {
    const scene = sceneRef.current
    scene.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
    // Captured either way, so letting go outside the canvas still ends the drag
    canvasRef.current.setPointerCapture?.(e.pointerId)
    if (scene.pointers.size === 2) {
      // a second finger: a pinch, not a drag or a click
      scene.drag = null
      const { dist } = spread(scene.pointers)
      scene.pinch = { dist: Math.max(1, dist), k: target().k }
      return
    }
    scene.drag = { x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY }
    if (view === 'globe') scene.heading = null
  }
  const onPointerMove = (e) => {
    const scene = sceneRef.current
    if (scene.pointers.has(e.pointerId)) scene.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (scene.pinch && scene.pointers.size === 2) {
      const { dist, mid } = spread(scene.pointers)
      setView(zoomAbout(scene.zoom, scene.pinch.k * (dist / scene.pinch.dist), canvasAt(mid), maxZoom(view)), { now: true })
      return
    }
    if (!scene.drag) {
      const place = markerAt(e)
      canvasRef.current.style.cursor = place ? 'var(--cursor-pointer)' : ''
      onHover(place)
      return
    }
    const unit = scene.size / 2
    if (view !== 'globe') {
      // zoomed in, the flat map moves with the pointer
      if (scene.zoom.k <= 1) return
      const { k, x, y } = scene.zoom
      setView({ k, x: x - (e.clientX - scene.drag.x) / (unit * k), y: y - (e.clientY - scene.drag.y) / (unit * k) }, { now: true })
    } else {
      const degPerPx = (180 / Math.PI) / (GLOBE_R * unit * scene.zoom.k)
      scene.rotation = {
        lat: clampTilt(scene.rotation.lat + (e.clientY - scene.drag.y) * degPerPx),
        lon: scene.rotation.lon - (e.clientX - scene.drag.x) * degPerPx,
      }
      schedule()
    }
    scene.drag.x = e.clientX
    scene.drag.y = e.clientY
  }
  const onPointerUp = (e) => {
    const scene = sceneRef.current
    scene.pointers.delete(e.pointerId)
    if (scene.pinch) {
      if (scene.pointers.size === 0) scene.pinch = null
      scene.drag = null
      return
    }
    const { drag } = scene
    scene.drag = null
    if (!drag || Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > CLICK_SLOP_PX) return
    const place = markerAt(e)
    if (place) onSelectRef.current(place)
    // a click on open map zooms in there (a globe zooms about its middle)
    else if (target().k < maxZoom(view) - 0.01) zoomBy(ZOOM.step, view === 'globe' ? { x: 0, y: 0 } : canvasAt(e))
  }
  const onPointerCancel = (e) => {
    const scene = sceneRef.current
    scene.pointers.delete(e.pointerId)
    if (!scene.pointers.size) scene.pinch = null
    scene.drag = null
  }

  const onKeyDown = (e) => {
    if (e.key === '+' || e.key === '=' || e.key === '-' || e.key === '_') {
      e.preventDefault()
      return zoomBy(e.key === '+' || e.key === '=' ? ZOOM.step : 1 / ZOOM.step)
    }
    const turns = { ArrowLeft: [0, -ARROW_DEG], ArrowRight: [0, ARROW_DEG], ArrowUp: [ARROW_DEG, 0], ArrowDown: [-ARROW_DEG, 0] }
    const turn = turns[e.key]
    if (!turn || view !== 'globe') return
    e.preventDefault()
    const scene = sceneRef.current
    const from = scene.heading || scene.rotation
    const to = { lat: clampTilt(from.lat + turn[0]), lon: from.lon + turn[1] }
    if (reducedMotion) {
      scene.rotation = to
      draw(performance.now())
    } else {
      scene.heading = to
      schedule()
    }
  }

  return (
    <canvas
      ref={canvasRef}
      className={'gl-canvas' + (view === 'globe' ? ' is-globe' : '') + (zoomed ? ' is-zoomed' : '')}
      role="img"
      aria-label={label}
      tabIndex={view === 'globe' ? 0 : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onPointerLeave={() => onHover(null)}
      onKeyDown={onKeyDown}
    />
  )
})
export default GlobeCanvas
