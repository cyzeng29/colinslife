import { useEffect, useRef, useState } from 'react'

const SEEN_KEY = 'intro-seen'

// Swap these when you have a vertical (9:16) cut for phones.
// Until then both point at the same file and object-fit: cover crops it.
const SOURCES = {
  landscape: '/dive.mp4',
  portrait: '/dive.mp4',
}

function shouldSkip() {
  // Only play on the home page, so a direct link to /work isn't interrupted
  if (window.location.pathname !== '/') return true
  // Visitors who asked their OS to reduce motion never see it
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  // Once per browser session
  try {
    if (sessionStorage.getItem(SEEN_KEY)) return true
  } catch {
    // storage can be blocked; just play the intro
  }
  return false
}

function pickSource() {
  const portrait = window.matchMedia('(orientation: portrait)').matches
  return portrait ? SOURCES.portrait : SOURCES.landscape
}

export default function IntroOverlay() {
  const [visible, setVisible] = useState(() => !shouldSkip())
  const [fading, setFading] = useState(false)
  const [blocked, setBlocked] = useState(false) // autoplay refused by the browser
  const videoRef = useRef(null)
  const [src] = useState(pickSource)

  function finish() {
    if (fading) return
    setFading(true)
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      // ignore
    }
    // wait for the CSS fade-out, then remove the overlay entirely
    setTimeout(() => setVisible(false), 600)
  }

  // Try to autoplay; if the browser refuses, show a tap-to-play button
  useEffect(() => {
    if (!visible) return
    const v = videoRef.current
    if (!v) return
    const attempt = v.play()
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => setBlocked(true))
    }
  }, [visible])

  // Lock page scroll while the intro is up
  useEffect(() => {
    if (!visible) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className={'intro' + (fading ? ' fading' : '')} role="presentation">
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish} // missing/broken file should never trap visitors
      />

      {blocked && (
        <button
          className="intro-play mono"
          onClick={() => {
            setBlocked(false)
            videoRef.current?.play().catch(finish)
          }}
        >
          tap to play
        </button>
      )}

      <button className="intro-skip mono" onClick={finish}>
        skip
      </button>
    </div>
  )
}
