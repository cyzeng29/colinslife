import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import PianoNav from '../PianoNav.jsx'
import Landing from '../landing/Landing.jsx'
import { PluckProvider } from '../PluckProvider.jsx'
import { contact, experience, landing } from '../../data/content.js'

vi.mock('../../audio/notes.js', () => ({ playNote: vi.fn() }))

// jsdom has no showModal/close; mirror browsers closely enough for the hook
HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute('open', '')
}
HTMLDialogElement.prototype.close = function () {
  this.removeAttribute('open')
}

function mockReducedMotion(reduce) {
  window.matchMedia = vi.fn((query) => ({
    matches: reduce && query.includes('reduce'),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }))
}

function Where() {
  const { pathname, hash } = useLocation()
  return <p data-testid="where">{pathname + hash}</p>
}

const renderLanding = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <PluckProvider>
        <PianoNav />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/work" element={<p>work page</p>} />
          <Route path="/about" element={<p>about page</p>} />
        </Routes>
        <Where />
      </PluckProvider>
    </MemoryRouter>,
  )

const where = () => screen.getByTestId('where').textContent
const key = (name) => screen.getByRole('link', { name })

describe('Landing pluck navigation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockReducedMotion(false)
  })
  afterEach(() => vi.useRealTimers())

  it('plucks the matching string before changing page', () => {
    renderLanding()
    fireEvent.click(key('experience'))
    expect(where()).toBe('/')
    act(() => vi.advanceTimersByTime(300))
    expect(screen.getByTestId('string-experience')).toHaveClass('is-plucked')
    expect(where()).toBe('/')
    act(() => vi.advanceTimersByTime(400))
    // EXPERIENCE leads to the case studies under the landing
    expect(where()).toBe('/#case-studies')
  })

  it('skips the animation when a second key is pressed mid-pluck', () => {
    renderLanding()
    fireEvent.click(key('experience'))
    fireEvent.click(key('about'))
    expect(where()).toBe('/about')
  })

  it('navigates at once under reduced motion', () => {
    mockReducedMotion(true)
    renderLanding()
    fireEvent.click(key('experience'))
    expect(where()).toBe('/#case-studies')
  })
})

describe('Landing content', () => {
  beforeEach(() => mockReducedMotion(false))

  it('shows the sidebar name, facts and a recruiter shortcut to the full work list', () => {
    renderLanding()
    expect(screen.getByRole('heading', { level: 1, name: landing.sidebar.name })).toBeInTheDocument()
    expect(screen.getByAltText(landing.sidebar.tagline)).toBeInTheDocument()
    // a hidden hover lens over each letter of "interactive"
    const art = screen.getByAltText(landing.sidebar.tagline).parentElement
    const letters = art.querySelectorAll('[aria-hidden="true"] > span')
    expect(letters).toHaveLength('interactive'.length)
    // each letter hops when the cursor reaches it
    fireEvent.pointerEnter(letters[0])
    expect(letters[0]).toHaveClass('is-hopping')
    expect(letters[1]).not.toHaveClass('is-hopping')
    for (const { label, detail } of landing.sidebar.facts) {
      expect(screen.getByText(label)).toBeInTheDocument()
      expect(screen.getByText(detail)).toBeInTheDocument()
    }
    // contact links: profiles open in a new tab, email opens the mail app
    const links = within(screen.getByRole('list', { name: 'Contact' }))
    for (const { label, href } of contact) expect(links.getByRole('link', { name: label })).toHaveAttribute('href', href)
    expect(links.getByRole('link', { name: 'github' })).toHaveAttribute('target', '_blank')
    expect(links.getByRole('link', { name: 'email' })).not.toHaveAttribute('target')
    fireEvent.click(screen.getByRole('link', { name: 'Recruiter Mode' }))
    expect(where()).toBe('/work/list')
  })

  it('opens and closes the bridge bubble from the "!" marker', () => {
    renderLanding()
    const bubble = screen.getByText(landing.bridge.text)
    expect(bubble).not.toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'where i live' }))
    expect(bubble).toBeVisible()
    expect(screen.getByRole('button', { name: /the bridge/ })).toHaveAttribute('aria-expanded', 'true')
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(bubble).not.toBeVisible()
  })

  it('makes every desk object a button and keeps Kora decorative', () => {
    const { container } = renderLanding()
    const desk = within(container.querySelector('.desk-group'))
    for (const obj of landing.desk) {
      expect(desk.getByRole('button', { name: new RegExp(obj.label) })).toBeInTheDocument()
    }
    expect(desk.getByRole('img', { name: landing.dog.alt })).toBeInTheDocument()
    expect(desk.queryByRole('button', { name: /kora/ })).not.toBeInTheDocument()
  })

  it('switches the monitor screen on and off', () => {
    const { container } = renderLanding()
    const monitor = screen.getByRole('button', { name: /^monitor/ })
    const screenLayer = container.querySelector('.monitor-screen')
    expect(monitor).toHaveAttribute('aria-pressed', 'false')
    expect(screenLayer).not.toHaveClass('is-on')
    fireEvent.click(monitor)
    expect(monitor).toHaveAttribute('aria-pressed', 'true')
    expect(screenLayer).toHaveClass('is-on')
  })

  it('unrolls the backpack scroll with the experience list, and closes back to the backpack', () => {
    renderLanding()
    const backpack = screen.getByRole('button', { name: landing.backpack.label })
    fireEvent.click(backpack)
    const dialog = screen.getByRole('dialog', { name: landing.backpack.title })
    for (const e of experience) expect(within(dialog).getByText(e.title)).toBeInTheDocument()
    expect(within(dialog).getByText('PostgreSQL')).toBeInTheDocument()
    fireEvent(dialog, new Event('cancel', { cancelable: true }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(backpack).toHaveFocus()
  })
})

describe('Landing screens by arrow key', () => {
  const realRect = Element.prototype.getBoundingClientRect
  beforeEach(() => {
    mockReducedMotion(false)
    window.scrollTo = vi.fn()
    // the second screen starts 1000px down the page
    Element.prototype.getBoundingClientRect = function () {
      const top = this.classList.contains('screen-two') ? 1000 - window.scrollY : 0
      return { top, left: 0, width: 0, height: 0, right: 0, bottom: top }
    }
  })
  afterEach(() => {
    Element.prototype.getBoundingClientRect = realRect
    window.scrollY = 0
  })

  it('walks down to the desk on ↓ and back up on ↑', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] })
    renderLanding()
    fireEvent.keyDown(window, { key: 'ArrowDown' })
    await act(async () => vi.advanceTimersByTime(2000))
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 1000, behavior: 'auto' })
    window.scrollY = 1000
    fireEvent.keyDown(window, { key: 'ArrowUp' })
    await act(async () => vi.advanceTimersByTime(2000))
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'auto' })
    vi.useRealTimers()
  })

  it('leaves the arrows alone below the desk, with modifiers, or in a dialog', () => {
    renderLanding()
    window.scrollY = 2000
    fireEvent.keyDown(window, { key: 'ArrowDown' })
    fireEvent.keyDown(window, { key: 'ArrowUp' })
    window.scrollY = 0
    fireEvent.keyDown(window, { key: 'ArrowDown', metaKey: true })
    fireEvent.click(screen.getByRole('button', { name: landing.backpack.label }))
    fireEvent.keyDown(window, { key: 'ArrowDown' })
    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('steps through the walk frames only while the page scrolls mid-way', async () => {
    vi.useFakeTimers()
    const { container } = renderLanding()
    const root = container.querySelector('.landing')
    window.scrollY = 300
    fireEvent.scroll(window)
    await act(async () => vi.advanceTimersByTime(20))
    expect(root).toHaveAttribute('data-walking')
    await act(async () => vi.advanceTimersByTime(400))
    expect(root).not.toHaveAttribute('data-walking')
    vi.useRealTimers()
  })

  it('walks the whole way to the desk, handing over to the desk pose only on arrival', async () => {
    vi.useFakeTimers()
    const { container } = renderLanding()
    const root = container.querySelector('.landing')
    window.scrollY = 600
    fireEvent.scroll(window)
    await act(async () => vi.advanceTimersByTime(20))
    // mid-way: still walking (facing front), not yet at the desk
    expect(root.style.getPropertyValue('--walk')).toBe('0.600')
    expect(root.style.getPropertyValue('--arrive')).toBe('0.000')
    expect(root).toHaveAttribute('data-descending')
    window.scrollY = 1000
    fireEvent.scroll(window)
    await act(async () => vi.advanceTimersByTime(20))
    expect(root.style.getPropertyValue('--walk')).toBe('1.000')
    expect(root.style.getPropertyValue('--arrive')).toBe('1.000')
    expect(root).not.toHaveAttribute('data-descending')
    vi.useRealTimers()
  })

  it('faces the way the page last moved: down toward the desk, up toward the strings', async () => {
    vi.useFakeTimers()
    const { container } = renderLanding()
    const root = container.querySelector('.landing')
    for (const [y, heading] of [
      [400, 'down'],
      [250, 'up'],
      [250, 'up'], // no movement: keeps facing the same way
      [500, 'down'],
    ]) {
      window.scrollY = y
      fireEvent.scroll(window)
      await act(async () => vi.advanceTimersByTime(20))
      expect(root).toHaveAttribute('data-heading', heading)
    }
    vi.useRealTimers()
  })

  it('walks back up with the back-walk frames, feet on the standing pose', () => {
    const { container } = renderLanding()
    const frames = container.querySelectorAll('.hall-char .char-walk-back')
    expect([...frames].map((f) => f.querySelector('img').getAttribute('src').split('/').pop())).toEqual([
      'walking-back-1.png',
      'walking-back-2.png',
    ])
    const stand = container.querySelector('.frame-char-pluck')
    const bottom = (el) => parseFloat(el.style.top) + parseFloat(el.style.height)
    for (const f of frames) expect(bottom(f)).toBeCloseTo(bottom(stand), 6)
  })

  it('walks down with the front-walk frames, standing where he plucks', () => {
    const { container } = renderLanding()
    const frames = container.querySelectorAll('.hall-char .char-walk-front')
    // Stardew-style cycle: step, stand, other step (then stand again)
    expect([...frames].map((f) => f.querySelector('img').getAttribute('src').split('/').pop())).toEqual([
      'walking-front-1.png',
      'char-front.png',
      'walking-front-2.png',
    ])
    // drawn down at the desk, but shown in the hall: inside its top/bottom edges
    for (const f of frames) {
      expect(parseFloat(f.style.top)).toBeGreaterThanOrEqual(0)
      expect(parseFloat(f.style.top) + parseFloat(f.style.height)).toBeLessThanOrEqual(100)
    }
  })
})

