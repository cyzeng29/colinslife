import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import ClubList from '../ClubList.jsx'
import { about } from '../../data/content.js'

describe('ClubList', () => {
  it('lists every club by name under a duke label', () => {
    render(<ClubList clubs={about.clubs} />)
    const section = screen.getByRole('region', { name: 'Duke clubs' })
    const names = within(section)
      .getAllByRole('listitem')
      .map((li) => li.textContent)
    expect(names).toEqual(about.clubs.map((c) => c.name))
  })

  it('shows optional details only when filled in', () => {
    const clubs = [
      { name: 'Bare Club' },
      { name: 'Full Club', role: 'Member', when: '2025 — present', blurb: 'We meet weekly.', href: 'https://example.com' },
    ]
    const { container } = render(<ClubList clubs={clubs} />)
    expect(container.querySelectorAll('.club-meta')).toHaveLength(1)
    expect(screen.getByText('Member · 2025 — present')).toBeInTheDocument()
    expect(screen.getByText('We meet weekly.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Full Club/ })).toHaveAttribute('href', 'https://example.com')
    expect(screen.queryByRole('link', { name: /Bare Club/ })).not.toBeInTheDocument()
    expect(container.querySelector('.clubs-photos')).not.toBeInTheDocument()
  })

  it('puts club photos beside the list, captioned with the club name', () => {
    render(<ClubList clubs={[{ name: 'Snap Club', photo: { src: 'snap.jpg', alt: 'members' } }]} />)
    expect(screen.getByAltText('members')).toBeInTheDocument()
    expect(screen.getByText('Snap Club', { selector: 'figcaption' })).toBeInTheDocument()
  })

  it('renders nothing without clubs', () => {
    const { container } = render(<ClubList clubs={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
