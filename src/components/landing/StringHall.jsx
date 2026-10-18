import { Layer } from './CanvasRegion.jsx'

// Screen 1: a drawn string hangs from each piano nav key down to one shared
// line. `plucking` is { to, phase } while a key's pluck plays; in the 'pluck'
// phase that key's string vibrates. Purely visual: the keys are the controls.
export default function StringHall({ keys, plucking }) {
  return (
    <div className="strings" aria-hidden="true">
      <Layer slug="string-bar" />
      {keys.map((k) => (
        <Layer
          key={k.to}
          slug={`string-${k.label}`}
          data-testid={`string-${k.label}`}
          className={'string' + (plucking?.to === k.to && plucking.phase === 'pluck' ? ' is-plucked' : '')}
        />
      ))}
    </div>
  )
}
