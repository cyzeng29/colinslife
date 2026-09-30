import { FrameHint } from './Doodles.jsx'

// Relative paths (e.g. 'images/me.jpg') resolve against the deploy base path,
// so the same content works at a domain root or under a subpath.
export function asset(src) {
  if (!src) return ''
  if (/^(https?:)?\/\//.test(src) || src.startsWith('/') || src.startsWith('data:')) return src
  return import.meta.env.BASE_URL + src
}

// One image slot. kind: 'photo' (taped corners), 'screenshot' (browser bar),
// or 'drawing' (sketchy uneven border). Empty src renders a quiet placeholder.
export default function Frame({ kind = 'photo', ratio = '4/3', src, alt = '', label, caption, className = '' }) {
  const url = asset(src)
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
        {url ? (
          <img src={url} alt={alt} loading="lazy" />
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
