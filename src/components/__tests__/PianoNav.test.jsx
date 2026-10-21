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
  const { pathname, hash } = useLocation()
  return <p data-testid="where">{pathname + hash}</p>
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

  it('draws only the header (no backdrop), at the top and once scrolled', () => {
    const drawn = (container) =>
      [...container.querySelectorAll('.piano-region img')].map((img) => img.getAttribute('src').split('/').pop())
    const { container } = renderNav()
    const atTop = drawn(container)
    expect(atTop).not.toContain('frame-top.png')
    expect(atTop).toEqual(expect.arrayContaining(['tile-zeng.png', 'tile-yi.png', 'piano.png', 'label-create.png']))
    scrollTo(200)
    expect(drawn(container)).toEqual(atTop)
  })

  it('puts a hit area over each of the eight drawn white keys', () => {
    const { container } = renderNav()
    expect(container.querySelectorAll('.key')).toHaveLength(8)
    expect(container.querySelector('img[src$="piano.png"]')).toBeInTheDocument()
  })

  it('makes the C, E, A and high C keys the navigation', () => {
    renderNav()
    const links = screen.getAllByRole('link').map((l) => l.textContent)
    expect(links).toEqual(['home', 'experience', 'about', 'create'])
    expect(screen.getByRole('link', { name: 'create' })).toHaveAttribute('href', '/create')
  })

  it('labels the high C key with the drawn CREATE label', () => {
    const { container } = renderNav()
    const labels = [...container.querySelectorAll('.key-label')].map((img) => img.getAttribute('src').split('/').pop())
    expect(labels).toEqual(['label-home.png', 'label-experience.png', 'label-about.png', 'label-create.png'])
  })

  it('marks the create key active on its own page', () => {
    renderNav(null, '/create')
    expect(screen.getByRole('link', { name: 'create' })).toHaveClass('active')
    expect(screen.getByRole('link', { name: 'home' })).not.toHaveClass('active')
  })

  it('keeps the experience key current on the case study pages', () => {
    renderNav(null, '/work/insight')
    expect(screen.getByRole('link', { name: 'experience' })).toHaveClass('active')
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
    expect(screen.getByTestId('where')).toHaveTextContent('/#case-studies')
  })

  it('keeps the tiles, not the name, at the top of Home', () => {
    renderNav()
    expect(screen.queryByRole('link', { name: 'Colin Zeng, home' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'piano sound' })).toHaveLength(1)
  })

  it('shows the name in the corner on other pages, linking home', () => {
    renderNav(null, '/about')
    const name = screen.getByRole('link', { name: 'Colin Zeng, home' })
    expect(name).toHaveAttribute('href', '/')
    fireEvent.click(name)
    expect(screen.getByTestId('where')).toHaveTextContent(/^\/$/)
  })

  it('puts the tiles, sound tile included, away once condensed', () => {
    const { container } = renderNav(null, '/about')
    expect(screen.queryByRole('button', { name: 'piano sound' })).not.toBeInTheDocument()
    expect(container.querySelector('.header-tiles')).toHaveAttribute('aria-hidden', 'true')
  })

  it('underlines the current page and slides from home toward experience on Home', () => {
    const left = (container) => {
      const u = container.querySelector('.nav-underline').style
      return [u.getPropertyValue('--x0'), u.getPropertyValue('--x1')]
    }
    const labelLeft = (container, label) => container.querySelector(`.key-label[src$="label-${label}.png"]`).style.left
    const home = renderNav()
    const [homeFrom, homeTo] = left(home.container)
    expect(parseFloat(homeFrom)).toBeLessThan(parseFloat(labelLeft(home.container, 'home')))
    expect(parseFloat(homeTo)).toBeLessThan(parseFloat(labelLeft(home.container, 'experience')))
    expect(parseFloat(homeTo)).toBeGreaterThan(parseFloat(labelLeft(home.container, 'home')))
    home.unmount()

    const work = renderNav(null, '/work')
    const [from, to] = left(work.container)
    expect(from).toBe(to)
    expect(from).toBe(homeTo)
    expect(work.container.querySelector('.key-label.is-current')).toHaveAttribute('src', expect.stringMatching(/label-experience\.png$/))
  })

  it('leaves navigation to a registered pluck handler', () => {
    renderNav(<TakeOver />)
    fireEvent.click(screen.getByRole('link', { name: 'experience' }))
    expect(screen.getByTestId('where')).toHaveTextContent(/^\/$/)
  })
})
