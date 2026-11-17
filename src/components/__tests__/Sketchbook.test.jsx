import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import Sketchbook from '../sketchbook/Sketchbook.jsx'

const pages = ['one', 'two', 'three'].map((n) => ({ kind: 'drawing', src: `${n}.png`, alt: `${n} drawing`, caption: `drawing — ${n} title` }))

// jsdom has no PointerEvent, so fireEvent would drop clientX and pointerId
if (!window.PointerEvent) {
  window.PointerEvent = class PointerEvent extends MouseEvent {
    constructor(type, init = {}) {
      super(type, init)
      this.pointerId = init.pointerId ?? 1
      this.pointerType = init.pointerType ?? 'mouse'
    }
  }
}

const book = () => screen.getByRole('group', { name: /sketchbook/i })
const leaf = () => screen.queryByTestId('sb-leaf')
const settle = () =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(1200)
  })
const click = (name) => fireEvent.click(screen.getByRole('button', { name }))

// The book is 800 wide from x = 0, so the spine is at 400 and each page 400 wide
function placeBook() {
  book().getBoundingClientRect = () => ({ left: 0, top: 0, width: 800, height: 556, right: 800, bottom: 556 })
}
// `at` is when, in ms from the last event, so a drag has a speed
function press(type, x, { at = 0 } = {}) {
  if (at) vi.advanceTimersByTime(at)
  fireEvent[type](book(), { clientX: x, clientY: 200, pointerId: 1, button: 0 })
}

function setMedia({ reduce = false } = {}) {
  window.matchMedia = vi.fn((query) => ({
    matches: query.includes('reduce') ? reduce : false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }))
}

describe('Sketchbook', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'setTimeout', 'clearTimeout'] })
    setMedia()
  })
  afterEach(() => {
    vi.useRealTimers()
    delete window.matchMedia
  })

  it('opens on the first spread: its notes on the left, the piece on the right', () => {
    render(<Sketchbook pages={pages} />)
    expect(screen.getByTestId('sb-left')).toHaveTextContent('no. 01 / 03')
    expect(screen.getByTestId('sb-left')).toHaveTextContent('one title')
    expect(screen.getByTestId('sb-left')).toHaveTextContent('drawing')
    expect(screen.getByAltText('one drawing')).toBeInTheDocument()
    expect(book()).toHaveAccessibleName(/page 1 of 3: one title/)
    expect(screen.getByRole('button', { name: /prev/ })).toHaveAttribute('aria-disabled', 'true')
  })

  it('turns a curling leaf over with the next button and lands on the next spread', async () => {
    render(<Sketchbook pages={pages} />)
    click(/next/)
    expect(leaf()).toHaveClass('is-next')
    expect(leaf().querySelectorAll('.sb-strip').length).toBeGreaterThan(8)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })
    const strips = [...leaf().querySelectorAll('.sb-strip')]
    expect(strips[strips.length - 1].style.transform).toMatch(/rotateY\(-[\d.]+deg\)/) // the free edge curls ahead
    await settle()
    expect(leaf()).not.toBeInTheDocument()
    expect(screen.getByAltText('two drawing')).toBeInTheDocument()
    expect(screen.queryByAltText('one drawing')).not.toBeInTheDocument()
    expect(screen.getByTestId('sb-left')).toHaveTextContent('two title')
  })

  it('turns with the arrow keys and stops at both ends', async () => {
    render(<Sketchbook pages={pages} />)
    book().focus()
    fireEvent.keyDown(book(), { key: 'ArrowLeft' })
    expect(leaf()).not.toBeInTheDocument()
    for (let i = 0; i < 2; i++) {
      fireEvent.keyDown(book(), { key: 'ArrowRight' })
      await settle()
    }
    expect(book()).toHaveAccessibleName(/page 3 of 3/)
    fireEvent.keyDown(book(), { key: 'ArrowRight' })
    expect(leaf()).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/ })).toHaveAttribute('aria-disabled', 'true')
    fireEvent.keyDown(book(), { key: 'ArrowLeft' })
    expect(leaf()).toHaveClass('is-prev')
    await settle()
    expect(book()).toHaveAccessibleName(/page 2 of 3/)
  })

  it('turns a page by clicking it: the right page forward, the left page back', async () => {
    render(<Sketchbook pages={pages} />)
    placeBook()
    press('pointerDown', 600)
    press('pointerUp', 600)
    await settle()
    expect(book()).toHaveAccessibleName(/page 2 of 3/)
    press('pointerDown', 200)
    press('pointerUp', 202)
    await settle()
    expect(book()).toHaveAccessibleName(/page 1 of 3/)
  })

  it('lets the leaf follow a drag, and turns it once past halfway', async () => {
    render(<Sketchbook pages={pages} />)
    placeBook()
    press('pointerDown', 760)
    press('pointerMove', 700, { at: 100 })
    expect(leaf()).toHaveClass('is-next')
    press('pointerMove', 300, { at: 400 })
    const held = leaf().style.transform
    press('pointerMove', 200, { at: 400 })
    expect(leaf().style.transform).not.toBe(held) // it moves with the pointer
    press('pointerUp', 200, { at: 400 })
    await settle()
    expect(book()).toHaveAccessibleName(/page 2 of 3/)
  })

  it('lets a leaf fall back when let go before halfway', async () => {
    render(<Sketchbook pages={pages} />)
    placeBook()
    press('pointerDown', 760)
    press('pointerMove', 740, { at: 200 })
    press('pointerMove', 600, { at: 600 })
    press('pointerUp', 600, { at: 300 })
    await settle()
    expect(leaf()).not.toBeInTheDocument()
    expect(book()).toHaveAccessibleName(/page 1 of 3/)
  })

  it('turns a page thrown quickly, even a short way', async () => {
    render(<Sketchbook pages={pages} />)
    placeBook()
    press('pointerDown', 760)
    press('pointerMove', 740, { at: 100 })
    press('pointerMove', 640, { at: 40 })
    press('pointerUp', 640, { at: 10 })
    await settle()
    expect(book()).toHaveAccessibleName(/page 2 of 3/)
  })

  it('only turns a page toward the spine, and lets a cancelled drag fall back', async () => {
    render(<Sketchbook pages={pages} />)
    placeBook()
    press('pointerDown', 600)
    press('pointerMove', 700, { at: 100 }) // the right page dragged away from the spine
    press('pointerUp', 700, { at: 100 })
    expect(leaf()).not.toBeInTheDocument()
    press('pointerDown', 760)
    press('pointerMove', 500, { at: 100 })
    fireEvent.pointerCancel(book(), { pointerId: 1 })
    await settle()
    expect(book()).toHaveAccessibleName(/page 1 of 3/)
  })

  it('swaps pages straight away when reduced motion is preferred', () => {
    setMedia({ reduce: true })
    render(<Sketchbook pages={pages} />)
    click(/next/)
    expect(leaf()).not.toBeInTheDocument()
    expect(screen.getByAltText('two drawing')).toBeInTheDocument()
  })

  it('shows a placeholder when a page image fails to load', () => {
    const { container } = render(<Sketchbook pages={pages} />)
    fireEvent.error(screen.getByAltText('one drawing'))
    expect(screen.queryByAltText('one drawing')).not.toBeInTheDocument()
    expect(container.querySelector('.sb-paper .frame-empty')).toBeInTheDocument()
  })

  it('holds several drawings on one page, and leaves enlarging them to the grid', async () => {
    const shared = [...pages.slice(0, 1), { kind: 'drawing', caption: 'ink drawings — a, b and c', items: ['a', 'b', 'c'].map((n) => ({ src: `${n}.png`, alt: `${n} ink` })) }]
    render(<Sketchbook pages={shared} />)
    click(/next/)
    await settle()
    for (const n of ['a', 'b', 'c']) expect(screen.getByAltText(`${n} ink`)).toBeInTheDocument()
    expect(screen.getByTestId('sb-left')).toHaveTextContent('a, b and c')
    expect(screen.queryByRole('button', { name: /enlarge/ })).not.toBeInTheDocument()
  })

  it('announces the piece on the open spread', async () => {
    render(<Sketchbook pages={pages} />)
    click(/next/)
    await settle()
    expect(screen.getByText('drawing — two title')).toHaveAttribute('aria-live', 'polite')
  })
})
