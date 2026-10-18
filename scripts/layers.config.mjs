// Which drawn layers become which web images. Every source in
// drawings/landing/ is a full-canvas (2732x2048) Procreate layer export.
// Each output slug names its source file and a rectangle (canvas px) to look
// in; the script trims to the drawing inside it. Rectangles also split merged
// layers (e.g. the four strings) and skip stray specks.
// `trim: false` keeps the rectangle as-is (the opaque frame).

export const CANVAS = { w: 2732, h: 2048 }
export const TOP_H = 466

export const layers = {
  // page frame: the piano band and its labels are drawn in the sticky bar,
  // the rest behind the landing (TOP_H is the split line)
  'frame-top': { src: 'frame', rect: [0, 0, 2732, 466], trim: false },
  'frame-body': { src: 'frame', rect: [0, 466, 2732, 1582], trim: false },

  'tile-zeng': { src: 'tiles', rect: [80, 40, 242, 380] },
  'tile-yi': { src: 'tiles', rect: [322, 40, 233, 380] },
  'tile-blank': { src: 'tiles', rect: [555, 40, 240, 380] },
  piano: { src: 'piano', rect: [770, 40, 1880, 380] },

  // the drawn key labels (in the piano bar, on every page)
  'label-home': { src: 'headings', rect: [845, 395, 120, 71] },
  'label-experience': { src: 'headings', rect: [1255, 395, 190, 71] },
  'label-about': { src: 'headings', rect: [1985, 395, 120, 71] },
  'label-colin': { src: 'headings', rect: [2440, 395, 125, 71] },
  // one string per nav key (peg + line), then the shared line they hang to
  'string-home': { src: 'headings', rect: [845, 466, 120, 166] },
  'string-experience': { src: 'headings', rect: [1255, 466, 190, 166] },
  'string-about': { src: 'headings', rect: [1985, 466, 120, 166] },
  'string-encore': { src: 'headings', rect: [2440, 466, 125, 166] },
  'string-bar': { src: 'headings', rect: [880, 628, 1640, 40] },

  'side-name': { src: 'text', rect: [40, 555, 560, 345] },
  'side-tagline': { src: 'text', rect: [40, 980, 560, 180] },
  'side-fact-duke': { src: 'text', rect: [40, 1220, 560, 110] },
  'side-fact-lab': { src: 'text', rect: [40, 1400, 560, 160] },
  'side-recruiter': { src: 'text', rect: [40, 1780, 600, 140] },

  'char-pluck': { src: 'char-pluck', rect: [1570, 490, 320, 430] },
  'walking-back-1': { src: 'walking-back-1', rect: [1570, 455, 310, 430] },
  'walking-back-2': { src: 'walking-back-2', rect: [1570, 455, 310, 430] },
  'char-front': { src: 'char-front', rect: [1570, 1110, 260, 440] },

  'marker-swirl': { src: 'bridge', rect: [1230, 930, 130, 70] },
  bridge: { src: 'bridge', rect: [1420, 800, 600, 300] },
  'marker-alert': { src: 'bridge', rect: [2160, 850, 160, 150] },

  shelf: { src: 'shelf', rect: [820, 1210, 430, 50] },
  frisbee: { src: 'frisbee', rect: [820, 1060, 200, 190] },
  globe: { src: 'globe', rect: [1040, 1060, 160, 185] },
  dog: { src: 'dog', rect: [700, 1440, 760, 360] },
  backpack: { src: 'backpack', rect: [1320, 1260, 310, 570] },
  desk: { src: 'desk', rect: [970, 1620, 1520, 220] },
  camera: { src: 'camera', rect: [1040, 1685, 150, 100] },
  sketchbook: { src: 'sketchbook', rect: [1885, 1640, 290, 150] },
  monitor: { src: 'monitor', rect: [2150, 1500, 350, 300] },
  'popup-monitor': { src: 'popup-monitor', rect: [2090, 1140, 420, 560] },
  'popup-backpack': { src: 'popup-backpack', rect: [790, 625, 1520, 860] },
}

// Drawings Colin is adding later. Missing ones are reported but never fail
// the run; the site falls back (CSS fog, CSS zzz, COLIN label, blank tile).
// Each is exported on the same canvas and trimmed to its full drawing.
export const optional = [
  'walking-front-1',
  'walking-front-2',
  'label-encore',
  'tile-dragon',
  'tile-dragon-muted',
  'cloud-1',
  'cloud-2',
  'cloud-3',
  'zzz',
]
