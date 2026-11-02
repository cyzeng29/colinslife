import { describe, expect, it } from 'vitest'
import { GLOBE_R, LAND_GRID, faceRotation, flatPoint, landPoints, morphPoint, spherePoint } from '../globeProjection.js'

const FACING = { lat: 0, lon: 0 }

describe('the flat map', () => {
  it('runs west to east across the full width', () => {
    expect(flatPoint(0, -180).x).toBe(-1)
    expect(flatPoint(0, 0).x).toBe(0)
    expect(flatPoint(0, 180).x).toBe(1)
  })

  it('puts north above south, centred on the canvas', () => {
    const top = flatPoint(LAND_GRID.latTop, 0).y
    const bottom = flatPoint(LAND_GRID.latBottom, 0).y
    expect(top).toBeLessThan(bottom)
    expect(top).toBeCloseTo(-bottom)
  })
})

describe('the globe', () => {
  it('puts the facing point at the centre, nearest the viewer', () => {
    const p = spherePoint(36, -78.9, faceRotation(36, -78.9))
    expect(p.x).toBeCloseTo(0)
    expect(p.y).toBeCloseTo(0)
    expect(p.z).toBeCloseTo(GLOBE_R)
  })

  it('keeps north up and east to the right', () => {
    expect(spherePoint(45, 0, FACING).y).toBeLessThan(0)
    expect(spherePoint(0, 45, FACING).x).toBeGreaterThan(0)
  })

  it('stays on the sphere however it is turned', () => {
    const p = spherePoint(52, 13, { lat: 30, lon: -100 })
    expect(Math.hypot(p.x, p.y, p.z)).toBeCloseTo(GLOBE_R)
  })
})

describe('the morph', () => {
  it('starts as the flat map, every dot showing', () => {
    const p = morphPoint(40, 170, 0, FACING)
    expect(p).toMatchObject(flatPoint(40, 170))
    expect(p.alpha).toBe(1)
  })

  it('ends as the globe, its far side hidden', () => {
    const front = morphPoint(10, 20, 1, FACING)
    const sphere = spherePoint(10, 20, FACING)
    expect(front.x).toBeCloseTo(sphere.x)
    expect(front.y).toBeCloseTo(sphere.y)
    expect(front.alpha).toBeGreaterThan(0)
    expect(morphPoint(0, 180, 1, FACING).alpha).toBe(0)
  })

  it('passes between the two, fading out what ends up behind', () => {
    const flat = flatPoint(0, 90)
    const sphere = spherePoint(0, 90, FACING)
    const mid = morphPoint(0, 90, 0.5, FACING)
    expect(mid.x).toBeCloseTo((flat.x + sphere.x) / 2)
    const behind = morphPoint(0, 180, 0.5, FACING)
    expect(behind.alpha).toBeGreaterThan(0)
    expect(behind.alpha).toBeLessThan(1)
  })
})

describe('landPoints', () => {
  it('reads a dot for each 1, by row and column', () => {
    expect(landPoints(['0100', '0001'])).toEqual([
      { lat: LAND_GRID.latTop, lon: -180 + LAND_GRID.lonStep },
      { lat: LAND_GRID.latTop - LAND_GRID.latStep, lon: -180 + 3 * LAND_GRID.lonStep },
    ])
  })
})
