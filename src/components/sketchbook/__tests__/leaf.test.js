import { describe, expect, it } from 'vitest'
import { STRIPS, dragProgress, leafAngles, shouldCommit, sliceFor, spreadFor, splitCaption, stripLight } from '../leaf.js'

describe('a turning leaf', () => {
  it('lies flat at the start and the end of a turn', () => {
    expect(leafAngles(0).absolute.every((a) => a === 0)).toBe(true)
    expect(leafAngles(1).absolute.every((a) => Math.abs(a - 180) < 1e-9)).toBe(true)
  })

  it('curls in the middle, the free edge ahead of the spine, and never past flat', () => {
    for (const p of [0.1, 0.3, 0.5, 0.7, 0.9]) {
      const { absolute } = leafAngles(p)
      expect(absolute).toHaveLength(STRIPS)
      expect(absolute).toEqual([...absolute].sort((a, b) => a - b))
      expect(absolute[0]).toBeGreaterThanOrEqual(0)
      expect(absolute[STRIPS - 1]).toBeLessThanOrEqual(180)
    }
    const { absolute } = leafAngles(0.5)
    expect(absolute[STRIPS - 1] - absolute[0]).toBeGreaterThan(30)
  })

  it('bends most near the free edge', () => {
    const { steps } = leafAngles(0.5)
    expect(steps[0]).toBe(0)
    expect(steps[STRIPS - 1]).toBeGreaterThan(steps[1])
  })

  it('darkens a strip as it turns edge-on, and is plain lying flat', () => {
    expect(stripLight(0).front).toBe(0)
    expect(stripLight(180).back).toBeCloseTo(0)
    expect(stripLight(80).front).toBeGreaterThan(stripLight(20).front)
    expect(stripLight(45).glint).toBeGreaterThan(stripLight(5).glint)
    expect(stripLight(135).glint).toBe(0)
  })

  it('shows each strip its own slice of the page on each side', () => {
    expect(sliceFor('next', 0)).toEqual({ front: 0, back: STRIPS - 1 })
    expect(sliceFor('prev', 0)).toEqual({ front: STRIPS - 1, back: 0 })
    const fronts = Array.from({ length: STRIPS }, (_, i) => sliceFor('next', i).front)
    expect(new Set(fronts).size).toBe(STRIPS)
  })
})

describe('dragging a leaf', () => {
  const book = { spine: 400, pageWidth: 400 }

  it('follows the pointer from where it was picked up to the far edge', () => {
    expect(dragProgress('next', { x: 700, x0: 700, ...book })).toBe(0)
    expect(dragProgress('next', { x: 0, x0: 700, ...book })).toBe(1)
    expect(dragProgress('next', { x: 350, x0: 700, ...book })).toBeCloseTo(0.5)
    expect(dragProgress('prev', { x: 800, x0: 100, ...book })).toBe(1)
    expect(dragProgress('prev', { x: 900, x0: 100, ...book })).toBe(1)
    expect(dragProgress('next', { x: 900, x0: 700, ...book })).toBe(0)
  })

  it('goes over past halfway, or when thrown, and falls back when thrown back', () => {
    expect(shouldCommit('next', 0.6)).toBe(true)
    expect(shouldCommit('next', 0.4)).toBe(false)
    expect(shouldCommit('next', 0.2, -1.2)).toBe(true)
    expect(shouldCommit('next', 0.8, 1.2)).toBe(false)
    expect(shouldCommit('prev', 0.2, 1.2)).toBe(true)
  })
})

describe('the open book', () => {
  it('puts the pages a leaf uncovers and lands on underneath it', () => {
    expect(spreadFor(1, null)).toEqual({ left: 1, right: 1, leaf: null })
    expect(spreadFor(1, { dir: 'next' })).toEqual({ left: 1, right: 2, leaf: { front: 1, back: 2 } })
    expect(spreadFor(1, { dir: 'prev' })).toEqual({ left: 0, right: 1, leaf: { front: 1, back: 0 } })
  })

  it('reads a caption as its kind and title', () => {
    expect(splitCaption('painting — a title')).toEqual({ kind: 'painting', title: 'a title' })
    expect(splitCaption('just a title')).toEqual({ kind: '', title: 'just a title' })
    expect(splitCaption()).toEqual({ kind: '', title: '' })
  })
})
