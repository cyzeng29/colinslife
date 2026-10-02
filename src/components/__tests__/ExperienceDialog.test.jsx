import { StrictMode } from 'react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import ExperienceDialog from '../ExperienceDialog.jsx'

// jsdom has no showModal/close. Mirror browsers: close() fires its `close`
// event in a later task, not synchronously.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function () {
    if (!this.open) return
    this.removeAttribute('open')
    setTimeout(() => this.dispatchEvent(new Event('close')))
  }
})

const entry = { id: 'demo', title: 'Demo Entry', bullets: ['did a thing'], media: [] }
const tick = () => act(() => new Promise((r) => setTimeout(r, 0)))

describe('ExperienceDialog', () => {
  it('stays open under StrictMode, which mounts effects twice in dev', async () => {
    const onClose = vi.fn()
    render(
      <StrictMode>
        <ExperienceDialog entry={entry} kind="project" index={0} total={1} onClose={onClose} />
      </StrictMode>,
    )
    await tick()
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog', { name: 'Demo Entry' })).toHaveAttribute('open')
  })

  it('shows what I did and links beside the stacked images', () => {
    const full = {
      ...entry,
      media: [{ kind: 'screenshot', src: 'a.png', alt: 'first image' }, { kind: 'photo', src: '' }],
      links: [{ label: 'Repo', href: 'https://example.com' }],
    }
    const { container } = render(<ExperienceDialog entry={full} kind="project" index={0} total={1} onClose={() => {}} />)
    const side = container.querySelector('.xd-side')
    expect(side.querySelectorAll('figure')).toHaveLength(2)
    expect(screen.getByAltText('first image')).toBeInTheDocument()
    expect(side.querySelector('.frame-empty')).toBeInTheDocument() // slot without a src
    const headings = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(headings).toEqual(['what I did', 'links'])
    const text = container.querySelector('.xd-text')
    expect(text).toContainElement(screen.getByRole('link', { name: /Repo/ }))
    expect(text.compareDocumentPosition(side) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('shows one image slot per media entry, and none without media', () => {
    const one = { ...entry, media: [{ kind: 'photo', src: '' }] }
    const { container, unmount } = render(<ExperienceDialog entry={one} kind="project" index={0} total={1} onClose={() => {}} />)
    expect(container.querySelectorAll('.xd-side figure')).toHaveLength(1)
    unmount()

    const { container: c2 } = render(<ExperienceDialog entry={entry} kind="project" index={0} total={1} onClose={() => {}} />)
    expect(c2.querySelector('.xd-side')).not.toBeInTheDocument()
    expect(c2.querySelector('.xd-grid')).toHaveClass('is-text-only')
  })

  it('reports a native close so the page can unmount it', async () => {
    const onClose = vi.fn()
    render(<ExperienceDialog entry={entry} kind="project" index={0} total={1} onClose={onClose} />)
    act(() => screen.getByRole('dialog').close())
    await tick()
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
