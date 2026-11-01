import { useEffect } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import PianoNav from '../PianoNav.jsx'
import { PluckProvider, usePluck } from '../PluckProvider.jsx'
import { playNote } from '../../audio/notes.js'

vi.mock('../../audio/notes.js', () => ({ playNote: vi.fn() }))

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

  it('marks the home key current at the top of Home', () => {
    renderNav()
    expect(screen.getByRole('link', { name: 'home' })).toHaveClass('active')
    expect(screen.getByRole('link', { name: 'home' })).toHaveAttribute('aria-current', 'page')
  })

  it('swaps the piano for the slim string header on other pages', () => {
    const { container } = renderNav(null, '/about')
    expect(container.querySelector('.key')).not.toBeInTheDocument()
    expect(container.querySelector('img[src$="piano.png"]')).not.toBeInTheDocument()
    const links = screen.getAllByRole('link', { name: /^(home|experience|about|create)$/ })
    expect(links.map((l) => l.textContent)).toEqual(['home', 'experience', 'about', 'create'])
    expect(links.map((l) => l.getAttribute('href'))).toEqual(['/', '/#case-studies', '/about', '/create'])
    const labels = [...container.querySelectorAll('.string-note img')].map((img) => img.getAttribute('src').split('/').pop())
    expect(labels).toEqual(['label-home.png', 'label-experience.png', 'label-about.png', 'label-create.png'])
  })

  it('marks the create note current on its own page', () => {
    renderNav(null, '/create')
    expect(screen.getByRole('link', { name: 'create' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'home' })).not.toHaveAttribute('aria-current')
  })

  it('keeps the experience note current on the case study pages', () => {
    renderNav(null, '/work/insight')
    expect(screen.getByRole('link', { name: 'experience' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'home' })).not.toHaveAttribute('aria-current')
  })

  it('plays the note when pressed and navigates from the string header', () => {
    renderNav(null, '/about')
    const about = screen.getByRole('link', { name: 'about' })
    fireEvent.pointerDown(about)
    expect(playNote).toHaveBeenCalledWith(440)
    fireEvent.click(screen.getByRole('link', { name: 'create' }))
    expect(screen.getByTestId('where')).toHaveTextContent('/create')
  })

  it('keeps the string header out of reach while the piano shows', () => {
    const { container } = renderNav()
    expect(container.querySelector('.string-nav')).toHaveAttribute('aria-hidden', 'true')
    for (const link of container.querySelectorAll('.string-nav a')) expect(link).toHaveAttribute('tabindex', '-1')
  })

  it('plays a note from an unlabeled key without navigating', () => {
    const { container } = renderNav()
    const d = container.querySelector('.key.note')
    fireEvent.pointerDown(d)
    expect(playNote).toHaveBeenCalledWith(293.66)
    fireEvent.click(d)
    expect(screen.getByTestId('where')).toHaveTextContent('/')
  })

  it('has no sound toggle', () => {
    renderNav()
    expect(screen.queryByRole('button', { name: 'piano sound' })).not.toBeInTheDocument()
  })

  it('navigates as a plain link when nothing takes over the pluck', () => {
    renderNav()
    fireEvent.click(screen.getByRole('link', { name: 'experience' }))
    expect(screen.getByTestId('where')).toHaveTextContent('/#case-studies')
  })

  it('keeps the tiles, not the name, at the top of Home', () => {
    const { container } = renderNav()
    expect(screen.queryByRole('link', { name: 'Colin Zeng, home' })).not.toBeInTheDocument()
    expect(container.querySelector('.header-tiles')).not.toHaveAttribute('aria-hidden')
  })

  it('shows the name in the corner on other pages, linking home', () => {
    renderNav(null, '/about')
    const name = screen.getByRole('link', { name: 'Colin Zeng, home' })
    expect(name).toHaveAttribute('href', '/')
    fireEvent.click(name)
    expect(screen.getByTestId('where')).toHaveTextContent(/^\/$/)
  })


  it('underlines HOME and slides toward EXPERIENCE on Home', () => {
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
  })

  it("underlines the current page's note in the string header", () => {
    const slot = (path) => {
      const { container, unmount } = renderNav(null, path)
      const value = container.querySelector('.string-nav-underline').style.getPropertyValue('--i')
      unmount()
      return value
    }
    expect(slot('/about')).toBe('2')
    expect(slot('/create')).toBe('3')
    expect(slot('/work/insight')).toBe('1')
    // on Home it follows the scroll from HOME (0) to EXPERIENCE (1)
    expect(slot('/')).toContain('var(--nav-u')
  })

  it('leaves navigation to a registered pluck handler', () => {
    renderNav(<TakeOver />)
    fireEvent.click(screen.getByRole('link', { name: 'experience' }))
    expect(screen.getByTestId('where')).toHaveTextContent(/^\/$/)
  })
})
