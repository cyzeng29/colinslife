import { describe, expect, it } from 'vitest'
import { ZOOM, clampView, maxZoom, viewPoint, zoomAbout } from '../globeProjection.js'

const whole = { k: 1, x: 0, y: 0 }

describe('zooming the map', () => {
  it('shows the whole map, centred, at the widest', () => {
    expect(clampView({ k: 0.5, x: 0.4, y: -0.3 })).toEqual(whole)
  })

  it('never zooms past its limit', () => {
    expect(clampView({ k: 99, x: 0, y: 0 }).k).toBe(ZOOM.max)
    expect(clampView({ k: 99, x: 0, y: 0 }, maxZoom('globe')).k).toBe(ZOOM.globeMax)
    expect(maxZoom('globe')).toBeLessThan(maxZoom('flat'))
  })

  it('keeps the point under the pointer where it is', () => {
    const at = { x: 0.5, y: -0.2 }
    const before = { x: whole.x + at.x / whole.k, y: whole.y + at.y / whole.k }
    const next = zoomAbout(whole, 2.5, at)
    expect(next.k).toBe(2.5)
    expect(next.x + at.x / next.k).toBeCloseTo(before.x)
    expect(next.y + at.y / next.k).toBeCloseTo(before.y)
  })

  it("can't pan off the edge of the map", () => {
    const next = clampView({ k: 2, x: 5, y: -5 })
    expect(next.x).toBeCloseTo(0.5) // the right edge sits at the canvas's right edge
    expect(next.y).toBeLessThan(0)
    expect(next.y).toBeGreaterThan(-0.49)
  })

  it('spreads points apart as it zooms, and keeps a globe centred', () => {
    const view = { k: 3, x: 0.2, y: 0.1 }
    const a = viewPoint({ x: 0.2, y: 0.1 }, view, 0)
    const b = viewPoint({ x: 0.21, y: 0.1 }, view, 0)
    expect(a).toEqual({ x: 0, y: 0 })
    expect(b.x - a.x).toBeCloseTo(0.03)
    expect(viewPoint({ x: 0, y: 0 }, view, 1)).toEqual({ x: 0, y: 0 })
  })
})
