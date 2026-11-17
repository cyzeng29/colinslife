import { asset } from '../Frame.jsx'
import { FrameHint } from '../Doodles.jsx'
import { splitCaption } from './leaf.js'

const two = (n) => String(n).padStart(2, '0')

// The left page of a spread: the notes for the piece opposite
export function NotePage({ page, number, total }) {
  const { kind, title } = splitCaption(page.caption)
  return (
    <div className="sb-paper is-left is-note">
      <p className="sb-no mono">
        no. {two(number)} <span aria-hidden="true">/</span> {two(total)}
      </p>
      <div className="sb-note">
        {kind && <p className="sb-kind mono">{kind}</p>}
        {title && <p className="sb-title">{title}</p>}
        <span className="sb-rule" aria-hidden="true" />
      </div>
    </div>
  )
}

// The right page: the piece itself. A drawing is printed on the paper; a photo
// is taped in. A page with `items` holds a few drawings together, two over
// one. `decorative` copies (on a turning leaf) have no alt text.
export function ArtPage({ page, broken, onBroken, decorative = false }) {
  const kind = page.kind || 'drawing'
  if (page.items) {
    return (
      <div className={`sb-paper is-right is-art is-${kind} is-cluster`}>
        <div className="sb-cluster">
          {page.items.map((item) => (
            <div className="sb-cluster-item" key={item.src}>
              <img src={asset(item.src)} alt={decorative ? '' : item.alt} draggable="false" />
            </div>
          ))}
        </div>
      </div>
    )
  }
  const ok = page.src && !broken
  return (
    <div className={`sb-paper is-right is-art is-${kind}`}>
      <div className="sb-mount">
        {ok ? (
          <img src={asset(page.src)} alt={decorative ? '' : page.alt} draggable="false" onError={onBroken} />
        ) : (
          <div className="frame-empty" aria-hidden="true">
            <FrameHint kind="drawing" />
            <span className="mono">{page.placeholder || 'page'}</span>
          </div>
        )}
      </div>
    </div>
  )
}
