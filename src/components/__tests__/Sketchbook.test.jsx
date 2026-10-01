import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Sketchbook from '../Sketchbook.jsx'

const pages = ['one', 'two', 'three'].map((n) => ({ kind: 'drawing', src: `${n}.png`, alt: `${n} drawing`, caption: `${n} caption` }))

// jsdom has no PointerEvent, so fireEvent would drop clientX
if (!window.PointerEvent) window.PointerEvent = class PointerEvent extends MouseEvent {}

const book = () => screen.getByRole('group', { name: /sketchbook/i })
const caption = () => document.querySelector('.sb-caption')
const finishTurn = (container) => fireEvent.animationEnd(container.querySelector('.sb-leaf'))

function setReducedMotion(reduce) {
  window.matchMedia = vi.fn().mockReturnValue({ matches: reduce })
}

afterEach(() => {
  delete window.matchMedia
})

describe('Sketchbook', () => {
  it('opens on the first page with its caption', () => {
    render(<Sketchbook pages={pages} />)
    expect(screen.getByAltText('one drawing')).toBeInTheDocument()
    expect(caption()).toHaveTextContent('one caption')
    expect(book()).toHaveAccessibleName(/page 1 of 3/)
    expect(screen.getByRole('button', { name: /prev/ })).toHaveAttribute('aria-disabled', 'true')
  })

  it('turns a leaf forward with the next button and settles on the next page', async () => {
    const { container } = render(<Sketchbook pages={pages} />)
    await userEvent.click(screen.getByRole('button', { name: /next/ }))
    expect(container.querySelector('.sb-leaf.is-next')).toBeInTheDocument()
    expect(caption()).toHaveTextContent('two caption')
    finishTurn(container)
    expect(container.querySelector('.sb-leaf')).not.toBeInTheDocument()
    expect(screen.getByAltText('two drawing')).toBeInTheDocument()
    expect(screen.queryByAltText('one drawing')).not.toBeInTheDocument()
  })

  it('flips with the arrow keys and stops at both ends', async () => {
    const { container } = render(<Sketchbook pages={pages} />)
    book().focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(container.querySelector('.sb-leaf')).not.toBeInTheDocument()
    for (let i = 0; i < 2; i++) {
      await userEvent.keyboard('{ArrowRight}')
      finishTurn(container)
    }
    expect(book()).toHaveAccessibleName(/page 3 of 3/)
    await userEvent.keyboard('{ArrowRight}')
    expect(container.querySelector('.sb-leaf')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/ })).toHaveAttribute('aria-disabled', 'true')
    await userEvent.keyboard('{ArrowLeft}')
    expect(container.querySelector('.sb-leaf.is-prev')).toBeInTheDocument()
    finishTurn(container)
    expect(caption()).toHaveTextContent('two caption')
  })

  it('flips by clicking a half of the page or dragging across it', () => {
    const { container } = render(<Sketchbook pages={pages} />)
    const el = book()
    el.getBoundingClientRect = () => ({ left: 0, width: 200 })
    fireEvent.pointerDown(el, { clientX: 150 })
    fireEvent.pointerUp(el, { clientX: 150 })
    finishTurn(container)
    expect(caption()).toHaveTextContent('two caption')
    fireEvent.pointerDown(el, { clientX: 60 })
    fireEvent.pointerUp(el, { clientX: 140 }) // drag right on the right half → back
    finishTurn(container)
    expect(caption()).toHaveTextContent('one caption')
  })

  it('swaps pages instantly when reduced motion is preferred', async () => {
    setReducedMotion(true)
    const { container } = render(<Sketchbook pages={pages} />)
    await userEvent.click(screen.getByRole('button', { name: /next/ }))
    expect(container.querySelector('.sb-leaf')).not.toBeInTheDocument()
    expect(screen.getByAltText('two drawing')).toBeInTheDocument()
  })

  it('shows a placeholder when a page image fails to load', () => {
    const { container } = render(<Sketchbook pages={pages} />)
    fireEvent.error(screen.getByAltText('one drawing'))
    expect(screen.queryByAltText('one drawing')).not.toBeInTheDocument()
    expect(container.querySelector('.sb-page .frame-empty')).toBeInTheDocument()
  })
})
