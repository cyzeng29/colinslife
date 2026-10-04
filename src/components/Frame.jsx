import { FrameHint } from './Doodles.jsx'
import { useLightbox } from './Lightbox.jsx'

// Relative paths (e.g. 'images/me.jpg') resolve against the deploy base path,
// so the same content works at a domain root or under a subpath.
export function asset(src) {
  if (!src) return ''
  if (/^(https?:)?\/\//.test(src) || src.startsWith('/') || src.startsWith('data:')) return src
  return import.meta.env.BASE_URL + src
}

// One image slot. kind: 'photo' (rounded, hand-inked outline), 'screenshot' (browser bar),
// or 'drawing' (sketchy uneven border). Empty src renders a quiet placeholder.
// loading defaults to lazy; pass 'eager' inside scroll containers such as a
// dialog, where some browsers never start a lazy image scrolled into view.
// Inside a LightboxProvider a filled frame is a button that enlarges the
// image; pass zoomable={false} where a click already means something else.
export default function Frame({
  kind = 'photo',
  ratio = '4/3',
  src,
  alt = '',
  label,
  caption,
  className = '',
  loading = 'lazy',
  zoomable = true,
}) {
  const url = asset(src)
  const openLightbox = useLightbox()
  const img = url && <img src={url} alt={alt} loading={loading} />
  return (
    <figure className={`frame frame-${kind} ${className}`}>
      {kind === 'screenshot' && (
        <span className="frame-bar" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
      <div className="frame-box" style={{ aspectRatio: ratio }}>
        {url && openLightbox && zoomable ? (
          <button
            type="button"
            className="frame-zoom"
            aria-label={alt ? `Enlarge image: ${alt}` : 'Enlarge image'}
            onClick={(e) => openLightbox({ src: url, alt, caption, from: e.currentTarget.querySelector('img') })}
          >
            {img}
          </button>
        ) : url ? (
          img
        ) : (
          <div className="frame-empty" aria-hidden="true">
            <FrameHint kind={kind} />
            <span className="mono">{label || kind}</span>
          </div>
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
