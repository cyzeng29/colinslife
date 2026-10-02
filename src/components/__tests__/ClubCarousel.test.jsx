import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ClubCarousel from '../ClubCarousel.jsx'
import { about } from '../../data/content.js'

const clubs = [
  { name: 'Snap Club', photo: { src: 'snap.jpg', alt: 'members', caption: 'Spring retreat' } },
  { name: 'Bare Club' },
  { name: 'Full Club', role: 'Member', when: '2025 — present', blurb: 'We meet weekly.', href: 'https://example.com' },
]
const current = () => screen.getByRole('heading', { level: 3 }).textContent

describe('ClubCarousel', () => {
  it('starts on the first club with its photo and caption', () => {
    render(<ClubCarousel clubs={clubs} />)
    expect(screen.getByRole('region', { name: 'Duke clubs' })).toBeInTheDocument()
    expect(current()).toBe('Snap Club')
    expect(screen.getByAltText('members')).toBeInTheDocument()
    expect(screen.getByText('Spring retreat', { selector: 'figcaption' })).toBeInTheDocument()
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('cycles with next and prev, wrapping at both ends', async () => {
    const user = userEvent.setup()
    render(<ClubCarousel clubs={clubs} />)
    await user.click(screen.getByRole('button', { name: /prev/ }))
    expect(current()).toMatch('Full Club')
    await user.click(screen.getByRole('button', { name: /next/ }))
    expect(current()).toBe('Snap Club')
    await user.click(screen.getByRole('button', { name: /next/ }))
    expect(current()).toBe('Bare Club')
  })

  it('cycles with the arrow keys', async () => {
    const user = userEvent.setup()
    render(<ClubCarousel clubs={clubs} />)
    screen.getByRole('group', { name: /Duke clubs/ }).focus()
    await user.keyboard('{ArrowRight}')
    expect(current()).toBe('Bare Club')
    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(current()).toMatch('Full Club')
  })

  it('shows a placeholder without a photo and optional details only when filled in', async () => {
    const user = userEvent.setup()
    const { container } = render(<ClubCarousel clubs={clubs} />)
    await user.click(screen.getByRole('button', { name: /next/ }))
    expect(container.querySelector('.frame-empty')).toBeInTheDocument()
    expect(container.querySelector('.club-meta')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /next/ }))
    expect(screen.getByText('Member · 2025 — present')).toBeInTheDocument()
    expect(screen.getByText('We meet weekly.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Full Club/ })).toHaveAttribute('href', 'https://example.com')
  })

  it('hides the controls for a single club and renders nothing without clubs', () => {
    const { unmount } = render(<ClubCarousel clubs={[clubs[1]]} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    unmount()
    const { container } = render(<ClubCarousel clubs={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('reaches every club in the site content', async () => {
    const user = userEvent.setup()
    render(<ClubCarousel clubs={about.clubs} />)
    const seen = []
    for (let i = 0; i < about.clubs.length; i++) {
      seen.push(current())
      await user.click(screen.getByRole('button', { name: /next/ }))
    }
    expect(seen).toEqual(about.clubs.map((c) => c.name))
  })
})
