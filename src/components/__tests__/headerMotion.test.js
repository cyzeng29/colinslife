import { describe, expect, it } from 'vitest'
import { condenseProgress, flight, homeUnderlineStop, underlineSpan } from '../headerMotion.js'

describe('header condensing', () => {
  const at = (sideTop) => condenseProgress({ sideTop, caseTop: 0, pianoH: 100, range: 400 })

  it('stays open while the sidebar is stuck under the piano', () => {
    expect(at(100)).toBe(0)
    expect(at(140)).toBe(0)
  })

  it('condenses steadily as the sidebar scrolls away, then holds', () => {
    expect(at(-100)).toBeCloseTo(0.5)
    expect(at(0)).toBeGreaterThan(0)
    expect(at(0)).toBeLessThan(at(-100))
    expect(at(-300)).toBe(1)
    expect(at(-2000)).toBe(1)
  })

  it('follows the case studies on phones', () => {
    const phone = (caseTop) => condenseProgress({ sideTop: 0, caseTop, pianoH: 100, range: 400, phone: true })
    expect(phone(900)).toBe(0)
    expect(phone(500)).toBe(0)
    expect(phone(300)).toBeCloseTo(0.5)
    expect(phone(100)).toBe(1)
  })

  it('stays open with no room to measure', () => {
    expect(condenseProgress({ sideTop: -500, caseTop: 0, pianoH: 0, range: 0 })).toBe(0)
  })
})

describe('name flight', () => {
  const sidebar = { left: 40, top: 300, width: 300 }
  const corner = { left: 60, top: 20, width: 150 }

  it('starts exactly on the sidebar name', () => {
    expect(flight(sidebar, corner, 0)).toEqual({ x: -20, y: 280, s: 2 })
  })

  it('lands at rest in the corner', () => {
    const end = flight(sidebar, corner, 1)
    expect(end.x).toBeCloseTo(0)
    expect(end.y).toBeCloseTo(0)
    expect(end.s).toBe(1)
  })

  it('is halfway at the midpoint', () => {
    expect(flight(sidebar, corner, 0.5)).toEqual({ x: -10, y: 140, s: 1.5 })
  })

  it('never scales from an unmeasured slot', () => {
    expect(flight(sidebar, { left: 0, top: 0, width: 0 }, 0).s).toBe(1)
  })
})

describe('the underline on Home', () => {
  // 100px header, 1100px window: the case studies' top crosses 60% of the way
  // down the 1000px below the header (y = 700) after 1000px of scrolling
  const u = (scrollY) => homeUnderlineStop({ caseTop: 1700 - scrollY, pianoH: 100, viewportH: 1100 })

  it('stays on HOME the whole way through the landing', () => {
    expect(u(0)).toBe(0)
    expect(u(500)).toBe(0)
    expect(u(999)).toBe(0)
  })

  it('moves to EXPERIENCE once the case studies fill a good part of the window, before they reach the header', () => {
    expect(u(1000)).toBe(1)
    expect(u(1300)).toBe(1)
    expect(u(1800)).toBe(1)
  })
})

describe('which labels the underline spans', () => {
  const labels = [
    { to: '/', label: 'home' },
    { to: '/work', label: 'experience' },
    { to: '/about', label: 'about' },
  ]

  it('runs from home toward experience on Home', () => {
    expect(underlineSpan('/', labels)).toEqual({ from: 'home', to: 'experience' })
  })

  it("rests on another page's own label", () => {
    expect(underlineSpan('/about', labels)).toEqual({ from: 'about', to: 'about' })
    expect(underlineSpan('/nowhere', labels)).toEqual({ from: 'home', to: 'home' })
  })

  it('counts the pages under a label as that label', () => {
    expect(underlineSpan('/work/list', labels)).toEqual({ from: 'experience', to: 'experience' })
    expect(underlineSpan('/work/insight', labels)).toEqual({ from: 'experience', to: 'experience' })
    expect(underlineSpan('/workshop', labels)).toEqual({ from: 'home', to: 'home' })
  })
})
