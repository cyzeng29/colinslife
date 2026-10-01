import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InterestDesk from '../InterestDesk.jsx'
import { about } from '../../data/content.js'

const pair = (id) => [
  { kind: 'photo', src: '', caption: `${id} caption one` },
  { kind: 'photo', src: '', caption: `${id} caption two` },
]
const interests = ['sports', 'music', 'art'].map((id) => ({
  id,
  label: id,
  penguin: { src: `p/${id}.png`, alt: `${id} penguin` },
  images: pair(id),
}))

const renderDesk = (props = {}) => render(<InterestDesk table="t.png" interests={interests} {...props} />)

describe('InterestDesk', () => {
  it('starts on the first interest with its penguin on the desk', () => {
    renderDesk()
    const tabs = screen.getAllByRole('tab')
    expect(tabs.map((t) => t.textContent)).toEqual(['sports', 'music', 'art'])
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByAltText('sports penguin')).toBeInTheDocument()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('sports caption one')
  })

  it('shows two captioned images side by side for the selected interest', async () => {
    renderDesk()
    const panel = screen.getByRole('tabpanel')
    const captions = () => [...panel.querySelectorAll('figure figcaption')].map((c) => c.textContent)
    expect(captions()).toEqual(['sports caption one', 'sports caption two'])
    await userEvent.click(screen.getByRole('tab', { name: 'art' }))
    expect(captions()).toEqual(['art caption one', 'art caption two'])
  })

  it('swaps the penguin and panel when a circle is clicked', async () => {
    renderDesk()
    await userEvent.click(screen.getByRole('tab', { name: 'music' }))
    expect(screen.getByRole('tab', { name: 'music' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByAltText('music penguin')).toBeInTheDocument()
    expect(screen.queryByAltText('sports penguin')).not.toBeInTheDocument()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('music caption one')
  })

  it('removes the outgoing penguin once its exit animation ends', async () => {
    const { container } = renderDesk()
    await userEvent.click(screen.getByRole('tab', { name: 'art' }))
    const leaving = container.querySelector('.desk-penguin.is-leaving')
    expect(leaving).toBeInTheDocument()
    fireEvent.animationEnd(leaving)
    expect(container.querySelector('.is-leaving')).not.toBeInTheDocument()
    expect(container.querySelectorAll('.desk-penguin')).toHaveLength(1)
  })

  it('moves selection and focus with arrow keys, Home and End', async () => {
    renderDesk()
    const user = userEvent.setup()
    await user.click(screen.getByRole('tab', { name: 'sports' }))
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'music' })).toHaveFocus()
    expect(screen.getByAltText('music penguin')).toBeInTheDocument()
    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'art' })).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'sports' })).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'art' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'sports' })).toHaveAttribute('aria-selected', 'true')
  })

  it('keeps one roving tab stop on the selected circle', async () => {
    renderDesk()
    await userEvent.click(screen.getByRole('tab', { name: 'music' }))
    expect(screen.getAllByRole('tab').map((t) => t.tabIndex)).toEqual([-1, 0, -1])
  })

  it('falls back to a sketch when a penguin image is missing or fails', () => {
    const missing = interests.map((it, i) => (i === 0 ? { ...it, penguin: { src: '', alt: '' } } : it))
    const { container, unmount } = render(<InterestDesk table="t.png" interests={missing} />)
    expect(container.querySelector('.desk-penguin-fallback')).toBeInTheDocument()
    unmount()

    const { container: c2 } = renderDesk()
    fireEvent.error(screen.getByAltText('sports penguin'))
    expect(screen.queryByAltText('sports penguin')).not.toBeInTheDocument()
    expect(c2.querySelector('.desk-penguin-fallback')).toBeInTheDocument()
  })

  it('shows an empty stage when the table image fails', () => {
    const { container } = renderDesk()
    fireEvent.error(container.querySelector('.desk-table'))
    expect(container.querySelector('.desk-table')).not.toBeInTheDocument()
    expect(container.querySelector('.desk-stage')).toHaveClass('is-empty')
  })
})

describe('about desk content', () => {
  it('points at drawings that exist in public/', () => {
    const files = [about.desk.table, ...about.interests.map((it) => it.penguin.src)]
    for (const src of files) expect(existsSync(resolve('public', src)), src).toBe(true)
  })

  it('gives every penguin alt text and a unique id', () => {
    const ids = about.interests.map((it) => it.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const it of about.interests) expect(it.penguin.alt).not.toBe('')
  })

  it('gives every interest two images, each with a caption', () => {
    for (const it of about.interests) {
      expect(it.images, it.id).toHaveLength(2)
      for (const img of it.images) expect(img.caption, it.id).toBeTruthy()
    }
  })
})
