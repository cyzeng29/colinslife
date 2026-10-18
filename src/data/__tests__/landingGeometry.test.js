import { describe, expect, it } from 'vitest'
import { DESK_FRAME, DESK_PANEL, LAYERS } from '../landingGeometry.js'

const bottom = (box) => box.y + box.h
const GLOW = 22 // panel glow, canvas px

describe('desk frame', () => {
  it('keeps the water splashes under the bridge clear of the panel and its glow', () => {
    for (const slug of ['marker-swirl', 'marker-alert']) {
      expect(bottom(LAYERS[slug]) + GLOW).toBeLessThan(DESK_FRAME.y)
    }
  })

  it('still sits under every desk object and ends where the drawn panel does', () => {
    for (const slug of ['frisbee', 'globe', 'shelf', 'desk']) {
      if (LAYERS[slug]) expect(LAYERS[slug].y).toBeGreaterThan(DESK_FRAME.y)
    }
    expect(bottom(DESK_FRAME)).toBe(bottom(DESK_PANEL))
  })
})
