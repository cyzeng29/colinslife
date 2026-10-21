import { describe, expect, it } from 'vitest'
import { ENDING_FLOOR, endingFloor } from '../introEnding.js'

const lum = ([r, g, b]) => 0.3 * r + 0.59 * g + 0.11 * b

describe('the intro ending colour floor', () => {
  it('leaves the video alone until the splash ending', () => {
    expect(endingFloor(0)).toBeNull()
    expect(endingFloor(2)).toBeNull()
    expect(endingFloor(NaN)).toBeNull()
  })

  it('fades smoothly from light down to the site green, never darker', () => {
    const start = ENDING_FLOOR[0][0]
    let prev = Infinity
    for (let t = start; t <= 3; t += 0.01) {
      const l = lum(endingFloor(t))
      expect(l).toBeLessThanOrEqual(prev + 1e-9)
      prev = l
    }
    // --page-green, held to the end
    expect(endingFloor(2.47)).toEqual([77, 98, 75])
    expect(endingFloor(2.7)).toEqual([77, 98, 75])
    expect(Math.min(...[2.1, 2.3, 2.45].map((t) => lum(endingFloor(t))))).toBeGreaterThan(lum([77, 98, 75]))
  })
})
