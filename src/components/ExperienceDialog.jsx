import { useEffect, useRef } from 'react'
import Frame from './Frame.jsx'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Detail view for one sheet. Uses the native <dialog> (top layer, inert
// background, Escape) plus focus trapping, focus restore and scroll lock.
export default function ExperienceDialog({ entry, kind, index, total, opener, onClose }) {
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    const dialog = ref.current
    // Safari doesn't focus buttons on click, so the caller passes the opener
    const returnTo = opener || document.activeElement

    const body = document.body
    const prevOverflow = body.style.overflow
    const prevPadding = body.style.paddingRight
    const gutter = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (gutter > 0) body.style.paddingRight = gutter + 'px'

    const onCancel = (e) => {
      e.preventDefault()
      closeRef.current()
    }
    // Some browsers close the dialog natively anyway; keep React in sync.
    // `close` fires a task after close(), so a stale one (e.g. from StrictMode's
    // dev-only unmount/remount) can arrive after showModal() reopened it.
    const onNativeClose = () => {
      if (!dialog.open) closeRef.current()
    }
    dialog.addEventListener('cancel', onCancel)
    dialog.addEventListener('close', onNativeClose)
    if (!dialog.open) dialog.showModal()
    dialog.querySelector('.xd-close')?.focus()

    return () => {
      dialog.removeEventListener('cancel', onCancel)
      dialog.removeEventListener('close', onNativeClose)
      if (dialog.open) dialog.close()
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPadding
      if (returnTo && typeof returnTo.focus === 'function') returnTo.focus({ preventScroll: true })
    }
  }, [])

  function onKeyDown(e) {
    if (e.key !== 'Tab') return
    const items = [...ref.current.querySelectorAll(FOCUSABLE)]
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    const inside = ref.current.contains(document.activeElement)
    if (e.shiftKey && (document.activeElement === first || !inside)) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
      e.preventDefault()
      first.focus()
    }
  }

  const { id, title, org, when, bullets, details, tools, links = [], context, outcomes = [], media = [] } = entry
  const titleId = `${id}-dialog-title`
  const count = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`

  return (
    <dialog
      ref={ref}
      className="xdialog"
      aria-labelledby={titleId}
      onKeyDown={onKeyDown}
      // Clicks on the backdrop land on the <dialog> itself
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="xd-inner">
        <div className="xd-bar">
          <p className="xd-kicker mono">
            {kind} · {count}
          </p>
          <button type="button" className="xd-close mono" onClick={onClose}>
            close <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* title and text on the left, images stacked on the right, so the whole
            entry fits on screen when it opens */}
        <div className={'xd-grid' + (media.length ? '' : ' is-text-only')}>
          <div className="xd-main">
            <header className="xd-head">
              <h2 id={titleId}>{title}</h2>
              {(org || when) && <p className="xd-meta">{[org, when].filter(Boolean).join(' · ')}</p>}
              {tools && <p className="card-tools">{tools}</p>}
            </header>
            <div className="xd-text">
              {context && (
                <section>
                  <h3 className="xd-label mono">context</h3>
                  <p>{context}</p>
                </section>
              )}
              <section>
                <h3 className="xd-label mono">what I did</h3>
                <ul>
                  {(details ?? bullets).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </section>
              {outcomes.length > 0 && (
                <section>
                  <h3 className="xd-label mono">outcomes</h3>
                  <ul>
                    {outcomes.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </section>
              )}
              {links.length > 0 && (
                <section>
                  <h3 className="xd-label mono">links</h3>
                  <ul className="xd-links">
                    {links.map((l) => (
                      <li key={l.href}>
                        <a href={l.href} target="_blank" rel="noopener noreferrer">
                          {l.label} <span aria-hidden="true">↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>

          {/* one slot per media entry; an entry without a src shows a placeholder */}
          {media.length > 0 && (
            <aside className="xd-side">
              {media.map((img, i) => (
                <Frame key={i} kind={img.kind || 'photo'} ratio="4/3" {...img} label={img.kind || 'photo'} loading="eager" />
              ))}
            </aside>
          )}
        </div>
      </div>
    </dialog>
  )
}
