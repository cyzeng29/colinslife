// npm run layers
// Turns Colin's full-canvas layer exports (drawings/landing/*.png) into
// trimmed web images (public/images/landing/) plus a map of where each one
// sits on the canvas (src/data/landingLayers.json). Re-run after adding or
// redrawing a layer.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { alphaBounds, crop, decodePng, encodePng } from './png.mjs'
import { CANVAS, TOP_H, layers, optional } from './layers.config.mjs'

const SRC = 'drawings/landing'
const OUT = 'public/images/landing'
const MAP = 'src/data/landingLayers.json'

mkdirSync(OUT, { recursive: true })
const cache = new Map()
const load = (name) => {
  if (!cache.has(name)) {
    const img = decodePng(readFileSync(`${SRC}/${name}.png`))
    if (img.width !== CANVAS.w || img.height !== CANVAS.h) {
      throw new Error(`${name}.png is ${img.width}x${img.height}; export on the ${CANVAS.w}x${CANVAS.h} canvas`)
    }
    cache.set(name, img)
  }
  return cache.get(name)
}

const warnings = []
const out = {}
const jobs = [
  ...Object.entries(layers),
  ...optional.map((slug) => [slug, { src: slug, rect: [0, 0, CANVAS.w, CANVAS.h], optional: true }]),
]

for (const [slug, { src, rect: [x, y, w, h], trim = true, optional: isOptional }] of jobs) {
  if (!existsSync(`${SRC}/${src}.png`)) {
    if (!isOptional) warnings.push(`missing required layer: ${src}.png (for ${slug})`)
    continue
  }
  const img = load(src)
  const box = trim ? alphaBounds(img, { x, y, w, h }) : { x, y, w, h }
  if (!box) {
    warnings.push(`${slug}: nothing drawn inside its rectangle in ${src}.png`)
    continue
  }
  writeFileSync(`${OUT}/${slug}.png`, encodePng(crop(img, box)))
  out[slug] = box
  console.log(`${slug.padEnd(18)} ${box.w}x${box.h} at ${box.x},${box.y}`)
}

const known = new Set([...Object.values(layers).map((l) => l.src), ...optional])
for (const f of readdirSync(SRC)) {
  const name = f.replace(/\.png$/, '')
  if (!known.has(name)) warnings.push(`unknown file ${f} (add it to scripts/layers.config.mjs)`)
}

writeFileSync(MAP, JSON.stringify({ canvas: CANVAS, top: TOP_H, layers: out }, null, 2) + '\n')
console.log(`\nwrote ${Object.keys(out).length} layers to ${OUT} and ${MAP}`)
warnings.forEach((w) => console.warn('warning:', w))
const missingOptional = optional.filter((s) => !out[s])
if (missingOptional.length) console.log('not drawn yet (fallbacks used):', missingOptional.join(', '))
