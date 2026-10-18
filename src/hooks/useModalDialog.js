import { useEffect, useRef } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Opens a native <dialog> (top layer, inert background, Escape) for as long
// as the component is mounted, with scroll lock, focus restore and a Tab
// trap. Returns the keydown handler for the trap. `focusSelector` picks what
// gets focus on open; `opener` is where focus returns (Safari doesn't focus
// buttons on click, so callers pass it).
export default function useModalDialog(ref, { onClose, opener, focusSelector }) {
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    const dialog = ref.current
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
    if (focusSelector) dialog.querySelector(focusSelector)?.focus()

    return () => {
      dialog.removeEventListener('cancel', onCancel)
      dialog.removeEventListener('close', onNativeClose)
      if (dialog.open) dialog.close()
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPadding
      if (returnTo && typeof returnTo.focus === 'function') returnTo.focus({ preventScroll: true })
    }
    // runs once per open; the dialog closes by unmounting
  }, [])

  return function onKeyDown(e) {
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
}
