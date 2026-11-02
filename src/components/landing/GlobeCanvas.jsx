import { useEffect, useRef } from 'react'
import landDots from '../../data/landDots.json'
import { CANVAS_RATIO, GLOBE_R, faceRotation, landPoints, morphPoint } from './globeProjection.js'

const LAND = landPoints(landDots.rows)
const MORPH_MS = 700
const TURN_MS = 120 // how quickly the globe catches up with where it's headed
const PULSE_MS = 1600
const ARROW_DEG = 10
const MAX_TILT = 80
const MARKER_HIT_PX = 14
const MARKER_FULL_SIZE_PX = 860
const CLICK_SLOP_PX = 4
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
export default function GlobeCanvas({ places, view, selected, turnKey, onSelect, onHover, reducedMotion, label }) {
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
  })
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
    const toPx = (p) => ({ x: scene.size / 2 + p.x * unit, y: height / 2 + p.y * unit })

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, scene.size, height)

    // The globe's body fades in as the map curls, so it reads as solid against
    // the page behind
    if (scene.t > 0) {
      ctx.globalAlpha = scene.t
      ctx.beginPath()
      ctx.arc(scene.size / 2, height / 2, GLOBE_R * unit, 0, Math.PI * 2)
      ctx.fillStyle = cssVar(canvas, '--scrim')
      ctx.fill()
      ctx.globalAlpha = scene.t * 0.3
      ctx.strokeStyle = cssVar(canvas, '--on-green')
      ctx.stroke()
    }

    const dot = Math.max(0.9, scene.size * 0.0016)
    const buckets = Array.from({ length: ALPHA_STEPS + 1 }, () => [])
    for (const { lat, lon } of LAND) {
      const p = morphPoint(lat, lon, scene.t, scene.rotation)
      const step = Math.round(p.alpha * ALPHA_STEPS)
      if (step > 0) buckets[step].push(toPx(p))
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
    draw(now)
    const { selected, reducedMotion } = propsRef.current
    if (scene.morphStart !== null || scene.heading || (selected && !reducedMotion)) schedule()
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

  const markerAt = (e) => {
    const canvas = canvasRef.current
    const scene = sceneRef.current
    const box = canvas.getBoundingClientRect()
    const unit = scene.size / 2
    let best = null
    let bestDist = MARKER_HIT_PX
    for (const place of propsRef.current.places) {
      const p = morphPoint(place.lat, place.lon, scene.t, scene.rotation)
      if (p.alpha <= 0) continue
      const dist = Math.hypot(
        scene.size / 2 + p.x * unit - (e.clientX - box.left),
        box.height / 2 + p.y * unit - (e.clientY - box.top),
      )
      if (dist < bestDist) {
        best = place
        bestDist = dist
      }
    }
    return best
  }

  const onPointerDown = (e) => {
    const scene = sceneRef.current
    scene.drag = { x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY }
    // Captured either way, so letting go outside the canvas still ends the drag
    canvasRef.current.setPointerCapture?.(e.pointerId)
    if (view === 'globe') scene.heading = null
  }
  const onPointerMove = (e) => {
    const scene = sceneRef.current
    if (!scene.drag) {
      const place = markerAt(e)
      canvasRef.current.style.cursor = place ? 'var(--cursor-pointer)' : ''
      onHover(place)
      return
    }
    if (view !== 'globe') return
    const degPerPx = (180 / Math.PI) / (GLOBE_R * (scene.size / 2))
    scene.rotation = {
      lat: clampTilt(scene.rotation.lat + (e.clientY - scene.drag.y) * degPerPx),
      lon: scene.rotation.lon - (e.clientX - scene.drag.x) * degPerPx,
    }
    scene.drag.x = e.clientX
    scene.drag.y = e.clientY
    schedule()
  }
  const onPointerUp = (e) => {
    const { drag } = sceneRef.current
    sceneRef.current.drag = null
    if (!drag || Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > CLICK_SLOP_PX) return
    const place = markerAt(e)
    if (place) onSelectRef.current(place)
  }
  const onPointerCancel = () => {
    sceneRef.current.drag = null
  }

  const onKeyDown = (e) => {
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
      className={'gl-canvas' + (view === 'globe' ? ' is-globe' : '')}
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
}
