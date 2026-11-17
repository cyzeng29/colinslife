import { useRef, useState } from 'react'
import Sketchbook from '../sketchbook/Sketchbook.jsx'
import SketchGrid from '../sketchbook/SketchGrid.jsx'
import useModalDialog from '../../hooks/useModalDialog.js'

// The desk's sketchbook, opened: the drawings as a book to flip through, or
// all at once in a grid to scroll. A click on the backdrop closes it; one on
// the book only turns a page.
export default function SketchbookDialog({ copy, pages, opener, onClose }) {
  const ref = useRef(null)
  const onKeyDown = useModalDialog(ref, { onClose, opener, focusSelector: '.sk-close' })
  const [view, setView] = useState('book')
  const views = [
    { id: 'book', label: copy.book },
    { id: 'grid', label: copy.grid },
  ]

  return (
    <dialog
      ref={ref}
      className="bp-dialog sk-dialog"
      aria-labelledby="sk-title"
      onKeyDown={onKeyDown}
      onClick={(e) => (e.target === e.currentTarget || e.target.classList.contains('sk-stage')) && onClose()}
    >
      <div className={`sk-stage is-${view}`}>
        <header className="gl-head sk-head">
          <h2 id="sk-title" className="gl-title">
            {copy.title}
          </h2>
          <div className="gl-views" role="group" aria-label="view">
            {views.map((v) => (
              <button key={v.id} type="button" className="gl-view" aria-pressed={view === v.id} onClick={() => setView(v.id)}>
                {v.label}
              </button>
            ))}
          </div>
          <button type="button" className="bp-close sk-close" aria-label="close" onClick={onClose}>
            <span aria-hidden="true">×</span>
          </button>
        </header>
        {view === 'book' ? <Sketchbook pages={pages} /> : <SketchGrid pages={pages} label={copy.gridLabel} />}
      </div>
    </dialog>
  )
}
