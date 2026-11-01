import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home.jsx'
import useScrollToTopOnNavigate from '../hooks/useScrollToTopOnNavigate.js'
import { landing } from '../data/content.js'

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

  it('takes a backpack skill to its first case study and rings them all', () => {
    const scrolled = Element.prototype.scrollIntoView
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute('open', '')
    }
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute('open')
    }
    const { container } = renderAt('/')
    fireEvent.click(screen.getByRole('button', { name: landing.backpack.label }))
    scrolled.mockClear()
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('link', { name: 'React' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    const first = container.querySelector('#case-ashbya-genome-database')
    expect(scrolled.mock.contexts).toEqual([first])
    expect(within(first).getByRole('link')).toHaveFocus()
    const ringed = [...container.querySelectorAll('.case-card-ring')].map((ring) => ring.parentElement.id)
    expect(ringed).toEqual(['case-ashbya-genome-database', 'case-insight'])
  })
})
