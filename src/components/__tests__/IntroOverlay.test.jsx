import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import IntroOverlay from '../IntroOverlay.jsx'

describe('IntroOverlay', () => {
  beforeEach(() => {
    sessionStorage.clear()
    window.matchMedia = vi.fn((query) => ({ matches: false, media: query }))
    // jsdom can't play video
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('fades into the site on skip, then gets out of the way for the session', () => {
    const { container } = render(<IntroOverlay />)
    const intro = container.querySelector('.intro')
    fireEvent.click(screen.getByRole('button', { name: 'skip' }))
    // fading: the video into the site's green, then the overlay away
    expect(intro).toHaveClass('fading')
    expect(sessionStorage.getItem('intro-seen')).toBe('1')
    act(() => vi.advanceTimersByTime(799))
    expect(container.querySelector('.intro')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1))
    expect(container.querySelector('.intro')).not.toBeInTheDocument()
  })

  it('stays away once seen this session', () => {
    sessionStorage.setItem('intro-seen', '1')
    const { container } = render(<IntroOverlay />)
    expect(container.querySelector('.intro')).not.toBeInTheDocument()
  })
})
