// Tiny synth for the piano keys. No audio files needed: each note is two
// oscillators with a quick attack and a slow fade.

let ctx = null

// The visitor's sound preference (the White Dragon tile in the piano bar).
// Remembered per browser; storage can be blocked, so default to sound on.
const MUTE_KEY = 'piano-muted'
let muted = false
try {
  muted = localStorage.getItem(MUTE_KEY) === '1'
} catch {
  // ignore
}

export function isMuted() {
  return muted
}

export function setMuted(value) {
  muted = value
  try {
    localStorage.setItem(MUTE_KEY, value ? '1' : '0')
  } catch {
    // ignore
  }
}

function ensureContext() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

// Browsers keep audio locked until the visitor interacts with the page
// (hovering does not count). Unlock on the first click, tap, or keypress.
if (typeof window !== 'undefined') {
  const unlock = () => ensureContext()
  window.addEventListener('pointerdown', unlock, { once: true })
  window.addEventListener('keydown', unlock, { once: true })
}

export function playNote(freq, { volume = 0.12, duration = 1.4 } = {}) {
  // Muted, or still locked (no click yet): stay silent instead of queuing a stray sound
  if (muted || !ctx || ctx.state !== 'running') return

  const now = ctx.currentTime
  const master = ctx.createGain()
  master.gain.setValueAtTime(0.0001, now)
  master.gain.exponentialRampToValueAtTime(volume, now + 0.015)
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration)
  master.connect(ctx.destination)

  // A triangle wave for body, plus a quieter sine an octave up for shimmer
  const partials = [
    { type: 'triangle', mult: 1, level: 1 },
    { type: 'sine', mult: 2, level: 0.35 },
  ]
  partials.forEach(({ type, mult, level }) => {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq * mult
    g.gain.value = level
    osc.connect(g).connect(master)
    osc.start(now)
    osc.stop(now + duration + 0.05)
  })
}
