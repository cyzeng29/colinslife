import { describe, expect, it } from 'vitest'
import { DESK_FRAME, DESK_PANEL, DESK_SHIFT, HALL_REACH_Y, LAYERS, SCREEN_TWO_Y } from '../landingGeometry.js'

const bottom = (box) => box.y + box.h
const GLOW = 22 // panel glow, canvas px

describe('desk frame', () => {
  it('keeps the water splashes under the bridge clear of the panel and its glow', () => {
    for (const slug of ['marker-swirl', 'marker-alert']) {
      expect(bottom(LAYERS[slug]) + GLOW).toBeLessThan(DESK_FRAME.y)
    }
  })

  it('still sits under every desk object and ends inside the drawn panel', () => {
    for (const slug of ['frisbee', 'globe', 'shelf', 'desk', 'dog', 'backpack', 'monitor']) {
      if (LAYERS[slug]) {
        expect(LAYERS[slug].y + DESK_SHIFT).toBeGreaterThan(DESK_FRAME.y)
        expect(bottom(LAYERS[slug]) + DESK_SHIFT).toBeLessThan(bottom(DESK_FRAME))
      }
    }
    expect(bottom(DESK_FRAME)).toBeLessThanOrEqual(bottom(DESK_PANEL))
  })

  it('puts the desk screen with the panel top under the piano and the shelf clear of the labels', () => {
    // the bar's bottom edge lines up with SCREEN_TWO_Y; the labels fill the
    // band above it, down from just under the piano
    const labelsBand = SCREEN_TWO_Y - DESK_FRAME.y
    expect(labelsBand).toBe(466 - HALL_REACH_Y)
    for (const slug of ['frisbee', 'globe']) {
      expect(LAYERS[slug].y + DESK_SHIFT).toBeGreaterThan(SCREEN_TWO_Y)
    }
  })
})
