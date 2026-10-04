import { beforeAll, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LightboxProvider } from '../Lightbox.jsx'
import Frame from '../Frame.jsx'
import Sketchbook from '../Sketchbook.jsx'

// jsdom has no showModal/close; Escape fires `cancel` like browsers do.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open')
  }
})

const withLightbox = (ui) => render(<LightboxProvider>{ui}</LightboxProvider>)

describe('Lightbox', () => {
  it('enlarges a framed image with its caption when clicked', async () => {
    const user = userEvent.setup()
    withLightbox(<Frame src="/a.png" alt="a field" caption="finals day" />)
    await user.click(screen.getByRole('button', { name: 'Enlarge image: a field' }))
    const dialog = screen.getByRole('dialog', { name: 'a field' })
    expect(dialog).toHaveAttribute('open')
    expect(dialog.querySelector('img')).toHaveAttribute('src', '/a.png')
    expect(dialog).toHaveTextContent('finals day')
  })

  it('closes from the close button and returns focus to the image', async () => {
    const user = userEvent.setup()
    withLightbox(<Frame src="/a.png" alt="a field" />)
    const trigger = screen.getByRole('button', { name: /Enlarge image/ })
    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: /close/ }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    withLightbox(<Frame src="/a.png" alt="a field" />)
    await user.click(screen.getByRole('button', { name: /Enlarge image/ }))
    screen.getByRole('dialog').dispatchEvent(new Event('cancel', { cancelable: true }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('leaves placeholders, opted-out frames and frames outside a provider alone', () => {
    withLightbox(
      <>
        <Frame src="" label="photo" />
        <Frame src="/b.png" alt="thumb" zoomable={false} />
      </>,
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByAltText('thumb')).toBeInTheDocument()
  })

  it('renders plain images without a provider', () => {
    render(<Frame src="/a.png" alt="a field" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByAltText('a field')).toBeInTheDocument()
  })

  it('enlarges the current sketchbook page from its own button', async () => {
    const user = userEvent.setup()
    const pages = [
      { src: '/p1.png', alt: 'first page', caption: 'page one' },
      { src: '/p2.png', alt: 'second page', caption: 'page two' },
    ]
    withLightbox(<Sketchbook pages={pages} />)
    await user.click(screen.getByRole('button', { name: /enlarge/ }))
    const dialog = screen.getByRole('dialog', { name: 'first page' })
    expect(dialog).toHaveTextContent('page one')
  })
})
