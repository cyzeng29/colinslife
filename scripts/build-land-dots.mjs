// Makes landDots.json for the globe pop-up: a grid over the world, one row of
// 0s and 1s per latitude (north to south), with a 1 where there's land. Only
// needs running again to change the grid:
//   npm run land
import { readFileSync, writeFileSync } from 'node:fs'
import { geoContains } from 'd3-geo'
import { feature } from 'topojson-client'
import { LAND_GRID } from '../src/components/landing/globeProjection.js'

const OUT = 'src/data/landDots.json'
const { lonStep, latStep, latTop, latBottom } = LAND_GRID

const atlas = JSON.parse(readFileSync('node_modules/world-atlas/land-50m.json', 'utf8'))
const land = feature(atlas, atlas.objects.land)

const cols = Math.round(360 / lonStep)
const rowCount = Math.floor((latTop - latBottom) / latStep) + 1
const rows = []
for (let r = 0; r < rowCount; r++) {
  const lat = latTop - r * latStep
  let row = ''
  for (let c = 0; c < cols; c++) row += geoContains(land, [-180 + c * lonStep, lat]) ? '1' : '0'
  rows.push(row)
}

writeFileSync(OUT, JSON.stringify({ rows }, null, 0) + '\n')
const dots = rows.join('').replaceAll('0', '').length
console.log(`${OUT}: ${rowCount} rows, ${dots} dots`)
