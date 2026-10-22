import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home.jsx'
import useScrollToTopOnNavigate from '../hooks/useScrollToTopOnNavigate.js'

vi.mock('../audio/notes.js', () => ({ playNote: vi.fn() }))

window.matchMedia = (query) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} })

function Shell({ children }) {
  useScrollToTopOnNavigate()
  return (
    <>
      <Link to="/about">about</Link>
      <Link to="/create">create</Link>
      <Link to="/#case-studies">experience</Link>
      <Link to="/">home</Link>
      {children}
    </>
  )
}

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<p>about page</p>} />
          <Route path="/create" element={<p>create page</p>} />
        </Routes>
      </Shell>
    </MemoryRouter>,
  )
const go = (name) => fireEvent.click(screen.getByRole('link', { name }))

describe('scrolling when the page changes', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn()
    Element.prototype.scrollIntoView = vi.fn()
  })

  it('opens another page at its top', () => {
    renderAt('/about')
    expect(window.scrollTo).not.toHaveBeenCalled() // the first load is the browser's
    go('create')
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('takes EXPERIENCE from another page straight to the case studies on Home', () => {
    renderAt('/about')
    go('experience')
    const section = document.getElementById('case-studies')
    expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto' })
    expect(window.scrollTo).not.toHaveBeenCalledWith(0, 0)
  })

  it('glides to the case studies, and back to the top, when already on Home', () => {
    renderAt('/')
    go('experience')
    expect(document.getElementById('case-studies').scrollIntoView).toHaveBeenLastCalledWith({ behavior: 'smooth' })
    go('home')
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'smooth' })
  })
})
