import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'

vi.mock('../audio/notes.js', () => ({ playNote: vi.fn() }))

// skip the intro video (jsdom can't play it)
sessionStorage.setItem('intro-seen', '1')
window.matchMedia = (query) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} })
// jsdom can't scroll the page
window.scrollTo = vi.fn()

describe('App routes', () => {
  it('sends the old /encore link to the create page', () => {
    render(
      <MemoryRouter initialEntries={['/encore']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'create' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'create' })).toHaveClass('active')
  })

  it('sends the old /work link to the case studies on Home, and keeps the full list at /work/list', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/work']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Case studies' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'experience' })).toHaveAttribute('href', '/#case-studies')
    expect(screen.getByRole('link', { name: /Ashbya Genome Database/ })).toHaveAttribute('href', '/work/ashbya-genome-database')
    unmount()

    render(
      <MemoryRouter initialEntries={['/work/list']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Undergraduate Research Intern' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'experience' })).toHaveClass('active')
  })
})
