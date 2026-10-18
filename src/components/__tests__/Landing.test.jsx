import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import PianoNav from '../PianoNav.jsx'
import Landing from '../landing/Landing.jsx'
import { PluckProvider } from '../PluckProvider.jsx'
import { experience, landing } from '../../data/content.js'

vi.mock('../../audio/notes.js', () => ({ playNote: vi.fn(), isMuted: () => false, setMuted: vi.fn() }))

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
  return <p data-testid="where">{useLocation().pathname}</p>
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
    expect(where()).toBe('/work')
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
    expect(where()).toBe('/work')
  })
})

describe('Landing content', () => {
  beforeEach(() => mockReducedMotion(false))

  it('shows the sidebar name, facts and a recruiter shortcut to the work page', () => {
    renderLanding()
    expect(screen.getByRole('heading', { level: 1, name: landing.sidebar.name })).toBeInTheDocument()
    expect(screen.getByAltText(landing.sidebar.tagline)).toBeInTheDocument()
    for (const fact of landing.sidebar.facts) expect(screen.getByText(fact)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: 'Recruiter Mode' }))
    expect(where()).toBe('/work')
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
    await act(async () => vi.advanceTimersByTime(1500))
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 1000, behavior: 'auto' })
    window.scrollY = 1000
    fireEvent.keyDown(window, { key: 'ArrowUp' })
    await act(async () => vi.advanceTimersByTime(1500))
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
})

