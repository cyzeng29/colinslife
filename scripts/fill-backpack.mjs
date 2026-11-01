// Makes backpack-filled.png from the drawn backpack: every see-through part
// inside its outline (name-tag window, zip strip, straps) filled in solid, for
// the backpack pop-up. Run again if the backpack is redrawn:
//   node scripts/fill-backpack.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { decodePng, encodePng } from './png.mjs'

const FILL = [0xee, 0xee, 0xec] // --key-white
const SOLID = 40 // alpha that counts as outline
const REACH = 2 // how wide a gap in the outline the outside can't pass through

const img = decodePng(readFileSync('public/images/landing/backpack.png'))
const { width: w, height: h, data } = img
const alpha = (x, y) => data[(y * w + x) * 4 + 3]

// The outline, thickened so a small gap in the line doesn't leak
const wall = new Uint8Array(w * h)
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    if (alpha(x, y) < SOLID) continue
    for (let dy = -REACH; dy <= REACH; dy++) {
      for (let dx = -REACH; dx <= REACH; dx++) {
        const nx = x + dx
        const ny = y + dy
        if (nx >= 0 && ny >= 0 && nx < w && ny < h) wall[ny * w + nx] = 1
      }
    }
  }
}

// Everything reachable from the image's edge is outside the backpack
const outside = new Uint8Array(w * h)
const stack = []
const visit = (x, y) => {
  if (x < 0 || y < 0 || x >= w || y >= h) return
  const i = y * w + x
  if (outside[i] || wall[i]) return
  outside[i] = 1
  stack.push(i)
}
for (let x = 0; x < w; x++) {
  visit(x, 0)
  visit(x, h - 1)
}
for (let y = 0; y < h; y++) {
  visit(0, y)
  visit(w - 1, y)
}
while (stack.length) {
  const i = stack.pop()
  const x = i % w
  const y = (i - x) / w
  visit(x + 1, y)
  visit(x - 1, y)
  visit(x, y + 1)
  visit(x, y - 1)
}

// Thickening kept the outside back from the line; let it grow back so the
// drawing's soft outer edge stays untouched
const nearOutside = (x, y) => {
  for (let dy = -REACH; dy <= REACH; dy++) {
    for (let dx = -REACH; dx <= REACH; dx++) {
      const nx = x + dx
      const ny = y + dy
      if (nx >= 0 && ny >= 0 && nx < w && ny < h && outside[ny * w + nx]) return true
    }
  }
  return false
}

// Lay the fill under whatever isn't fully opaque inside the outline
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    if (outside[y * w + x] || nearOutside(x, y)) continue
    const p = (y * w + x) * 4
    const a = data[p + 3] / 255
    for (let c = 0; c < 3; c++) data[p + c] = Math.round(data[p + c] * a + FILL[c] * (1 - a))
    data[p + 3] = 255
  }
}

writeFileSync('public/images/landing/backpack-filled.png', encodePng(img))
