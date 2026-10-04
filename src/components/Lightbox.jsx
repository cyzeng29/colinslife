import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'

const LightboxContext = createContext(null)

// open({ src, alt, caption, from }) shows one image large; `from` is the
// on-page <img> it grows out of and shrinks back into. Null outside a
// provider, so images there simply aren't zoomable.
export const useLightbox = () => useContext(LightboxContext)

const DURATION = 320
const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)'
const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Keyframe that makes the large image cover `from`'s box exactly: a uniform
// scale (so nothing stretches) plus a clip that crops it to the thumbnail's
// shape, the way object-fit: cover crops the on-page image.
function coverFrame(from, to) {
  const a = from.getBoundingClientRect()
  const b = to.getBoundingClientRect()
  if (!a.width || !b.width) return null
  const s = Math.max(a.width / b.width, a.height / b.height)
  const dx = a.left + a.width / 2 - (b.left + b.width / 2)
  const dy = a.top + a.height / 2 - (b.top + b.height / 2)
  const ix = (b.width - a.width / s) / 2
  const iy = (b.height - a.height / s) / 2
  const radius = parseFloat(getComputedStyle(from).borderTopLeftRadius) || 0
  return {
    transform: `translate(${dx}px, ${dy}px) scale(${s})`,
    clipPath: `inset(${iy}px ${ix}px round ${radius / s}px)`,
  }
}

export function LightboxProvider({ children }) {
  const [item, setItem] = useState(null)
  const open = useCallback((next) => setItem(next), [])

  return (
    <LightboxContext.Provider value={open}>
      {children}
      {item && <Lightbox item={item} onClosed={() => setItem(null)} />}
    </LightboxContext.Provider>
  )
}

function Lightbox({ item, onClosed }) {
  const dialogRef = useRef(null)
  const imgRef = useRef(null)
  const scrimRef = useRef(null)
  const closing = useRef(false)
  const onClosedRef = useRef(onClosed)
  onClosedRef.current = onClosed

  const animate = useCallback((dir) => {
    const img = imgRef.current
    const scrim = scrimRef.current
    const motion = !prefersReducedMotion() && typeof img?.animate === 'function'
    if (!motion) return Promise.resolve()
    // Measure the resting layout: drop any run still in flight (StrictMode
    // opens twice in dev; a close can interrupt the opening zoom).
    const fading = [scrim, ...dialogRef.current.querySelectorAll('.lb-close, .lb-figure figcaption')]
    for (const el of [img, ...fading]) el.getAnimations().forEach((a) => a.cancel())
    const start = item.from?.isConnected ? coverFrame(item.from, img) : null
    const imgFrames = start ? [start, { transform: 'none', clipPath: 'inset(0px 0px round 0px)' }] : [{ opacity: 0 }, { opacity: 1 }]
    const opts = { duration: DURATION, easing: EASE, direction: dir === 'in' ? 'normal' : 'reverse', fill: 'both' }
    const fade = [{ opacity: 0 }, { opacity: 1 }]
    const runs = [img.animate(imgFrames, opts), ...fading.map((el) => el.animate(fade, opts))]
    return Promise.all(runs.map((r) => r.finished)).catch(() => {})
  }, [item])

  const close = useCallback(() => {
    if (closing.current) return
    closing.current = true
    animate('out').then(() => onClosedRef.current())
  }, [animate])

  // Open before paint so the first frame is already the thumbnail-sized one.
  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
    const img = imgRef.current
    if (img.complete) animate('in')
    else img.addEventListener('load', () => animate('in'), { once: true })
  }, [animate])

  useEffect(() => {
    const dialog = dialogRef.current
    const returnTo = item.from?.closest('button') || document.activeElement
    const body = document.body
    const prevOverflow = body.style.overflow
    body.style.overflow = 'hidden'
    const onCancel = (e) => {
      e.preventDefault()
      close()
    }
    dialog.addEventListener('cancel', onCancel)
    dialog.querySelector('.lb-close')?.focus({ preventScroll: true })
    return () => {
      dialog.removeEventListener('cancel', onCancel)
      if (dialog.open) dialog.close()
      body.style.overflow = prevOverflow
      if (returnTo?.isConnected) returnTo.focus({ preventScroll: true })
    }
  }, [item, close])

  return (
    <dialog ref={dialogRef} className="lightbox" aria-label={item.alt || 'Enlarged image'} onClick={close}>
      <div className="lb-scrim" ref={scrimRef} aria-hidden="true" />
      <button type="button" className="lb-close mono" onClick={close}>
        close <span aria-hidden="true">✕</span>
      </button>
      <figure className="lb-figure">
        <img ref={imgRef} src={item.src} alt={item.alt} />
        {item.caption && <figcaption className="mono">{item.caption}</figcaption>}
      </figure>
    </dialog>
  )
}
