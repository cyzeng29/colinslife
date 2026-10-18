import { useEffect } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import PianoNav from '../PianoNav.jsx'
import { PluckProvider, usePluck } from '../PluckProvider.jsx'
import { playNote, setMuted } from '../../audio/notes.js'

vi.mock('../../audio/notes.js', () => {
  let muted = false
  return {
    playNote: vi.fn(),
    isMuted: () => muted,
    setMuted: vi.fn((v) => {
      muted = v
    }),
  }
})

function Where() {
  return <p data-testid="where">{useLocation().pathname}</p>
}

function TakeOver() {
  const pluck = usePluck()
  useEffect(() => pluck.register(() => true), [pluck])
  return null
}

const renderNav = (extra = null, path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <PluckProvider>
        <PianoNav />
        {extra}
        <Where />
      </PluckProvider>
    </MemoryRouter>,
  )

const scrollTo = (y) =>
  act(() => {
    window.scrollY = y
    window.dispatchEvent(new Event('scroll'))
  })

describe('PianoNav', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.scrollY = 0
  })

  it('keeps the drawn band joined to the hall at the top of Home', () => {
    const { container } = renderNav()
    expect(container.querySelector('.piano-panel')).toBeNull()
  })

  it('fills the band in as one rounded panel once Home scrolls', () => {
    const { container } = renderNav()
    scrollTo(200)
    expect(container.querySelector('.piano-panel')).toBeInTheDocument()
    scrollTo(0)
    expect(container.querySelector('.piano-panel')).toBeNull()
  })

  it('shows the band as one rounded panel on other pages', () => {
    const { container } = renderNav(null, '/work')
    expect(container.querySelector('.piano-panel')).toBeInTheDocument()
  })

  it('puts a hit area over each of the eight drawn white keys', () => {
    const { container } = renderNav()
    expect(container.querySelectorAll('.key')).toHaveLength(8)
    expect(container.querySelector('img[src$="piano.png"]')).toBeInTheDocument()
  })

  it('makes the C, E, A and high C keys the navigation', () => {
    renderNav()
    const links = screen.getAllByRole('link').map((l) => l.textContent)
    expect(links).toEqual(['home', 'experience', 'about', 'encore'])
    expect(screen.getByRole('link', { name: 'encore' })).toHaveAttribute('href', '/encore')
  })

  it('marks the encore key active on its own page', () => {
    renderNav(null, '/encore')
    expect(screen.getByRole('link', { name: 'encore' })).toHaveClass('active')
    expect(screen.getByRole('link', { name: 'home' })).not.toHaveClass('active')
  })

  it('plays a note from an unlabeled key without navigating', () => {
    const { container } = renderNav()
    const d = container.querySelector('.key.note')
    fireEvent.pointerDown(d)
    expect(playNote).toHaveBeenCalledWith(293.66)
    fireEvent.click(d)
    expect(screen.getByTestId('where')).toHaveTextContent('/')
  })

  it('switches sound off and on from the White Dragon tile', () => {
    renderNav()
    const tile = screen.getByRole('button', { name: 'piano sound' })
    expect(tile).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(tile)
    expect(tile).toHaveAttribute('aria-pressed', 'false')
    expect(setMuted).toHaveBeenLastCalledWith(true)
    fireEvent.click(tile)
    expect(tile).toHaveAttribute('aria-pressed', 'true')
  })

  it('navigates as a plain link when nothing takes over the pluck', () => {
    renderNav()
    fireEvent.click(screen.getByRole('link', { name: 'experience' }))
    expect(screen.getByTestId('where')).toHaveTextContent('/work')
  })

  it('leaves navigation to a registered pluck handler', () => {
    renderNav(<TakeOver />)
    fireEvent.click(screen.getByRole('link', { name: 'experience' }))
    expect(screen.getByTestId('where')).toHaveTextContent(/^\/$/)
  })
})
