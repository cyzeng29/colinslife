import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'

vi.mock('../audio/notes.js', () => ({ playNote: vi.fn(), isMuted: () => false, setMuted: vi.fn() }))

// skip the intro video (jsdom can't play it)
sessionStorage.setItem('intro-seen', '1')
window.matchMedia = (query) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} })

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
})
