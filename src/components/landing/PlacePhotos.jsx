import { asset } from '../Frame.jsx'
import { useLightbox } from '../Lightbox.jsx'

// A picked place's photos, in a row under the globe's caption. Each one
// enlarges in the lightbox; outside a lightbox provider they're just pictures.
export default function PlacePhotos({ place, photos }) {
  const openLightbox = useLightbox()
  return (
    <ul className="gl-photos" aria-label={`photos from ${place}`}>
      {photos.map((photo) => {
        const img = <img src={asset(photo.src)} alt={photo.alt} loading="eager" draggable="false" />
        return (
          <li key={photo.src} className="gl-photo">
            {openLightbox ? (
              <button
                type="button"
                aria-label={`Enlarge photo: ${photo.alt}`}
                onClick={(e) => openLightbox({ src: asset(photo.src), alt: photo.alt, caption: photo.caption, from: e.currentTarget.querySelector('img') })}
              >
                {img}
              </button>
            ) : (
              img
            )}
            {photo.caption && <span className="gl-photo-caption">{photo.caption}</span>}
          </li>
        )
      })}
    </ul>
  )
}
