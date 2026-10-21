// The intro video's splash ends on a near-black green, darker than the site.
// A colour layer over the video (mix-blend-mode: lighten) sets a floor the
// picture can't go darker than: from the video's own teal at the start of
// the splash, easing down to the site's green, which it then holds.
// Times are seconds into the video; colours are [r, g, b].
export const ENDING_FLOOR = [
  [2.07, [63, 142, 146]], // the video's teal at this point, so the layer appears seamlessly
  [2.2, [74, 130, 121]],
  [2.33, [77, 117, 99]],
  [2.47, [77, 98, 75]], // --page-green
]

// The floor colour at time t, or null before the layer starts
export function endingFloor(t) {
  const first = ENDING_FLOOR[0]
  if (!(t >= first[0])) return null
  const last = ENDING_FLOOR[ENDING_FLOOR.length - 1]
  if (t >= last[0]) return last[1]
  const i = ENDING_FLOOR.findIndex(([at]) => at > t)
  const [t0, c0] = ENDING_FLOOR[i - 1]
  const [t1, c1] = ENDING_FLOOR[i]
  const k = (t - t0) / (t1 - t0)
  return c0.map((v, j) => v + (c1[j] - v) * k)
}
