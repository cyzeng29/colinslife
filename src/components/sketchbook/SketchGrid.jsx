import { asset } from '../Frame.jsx'
import { useLightbox } from '../Lightbox.jsx'

// Every piece in the sketchbook on its own, in columns to scroll through. A
// page holding several drawings gives each one its own place. Each enlarges.
export const piecesOf = (pages) => pages.flatMap((page) => (page.items ? page.items.map((item) => ({ kind: page.kind, ...item })) : page.src ? [page] : []))

export default function SketchGrid({ pages, label }) {
  const openLightbox = useLightbox()
  return (
    <ul className="sk-grid" aria-label={label}>
      {piecesOf(pages).map((piece) => {
        const img = <img src={asset(piece.src)} alt={piece.alt} loading="lazy" draggable="false" />
        return (
          <li key={piece.src} className={`sk-piece is-${piece.kind || 'drawing'}`}>
            {openLightbox ? (
              <button
                type="button"
                aria-label={`Enlarge: ${piece.alt}`}
                onClick={(e) => openLightbox({ src: asset(piece.src), alt: piece.alt, caption: piece.caption, from: e.currentTarget.querySelector('img') })}
              >
                {img}
              </button>
            ) : (
              img
            )}
            {piece.caption && <span className="sk-piece-caption mono">{piece.caption}</span>}
          </li>
        )
      })}
    </ul>
  )
}
