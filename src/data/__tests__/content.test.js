import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { about, experience, home, projects } from '../content.js'

const base = import.meta.env.BASE_URL
const local = (href) => href.startsWith(base) && !/^(https?:)?\/\//.test(href)

describe('content assets', () => {
  it('points every filled image slot at a file in public/', () => {
    const entries = [...experience, ...projects]
    const images = [
      home.photo,
      about.photo,
      ...entries.flatMap((e) => [e.thumb, ...e.media]),
      ...about.interests.flatMap((it) => it.images),
      ...about.clubs.map((c) => c.photo ?? {}),
    ].filter((img) => img.src)
    for (const img of images) {
      expect(existsSync(resolve('public', img.src)), img.src).toBe(true)
      expect(img.alt, img.src).not.toBe('')
    }
  })

  it('points local links at files in public/', () => {
    const links = [...experience, ...projects].flatMap((e) => e.links).filter((l) => local(l.href))
    expect(links.length).toBeGreaterThan(0)
    for (const l of links) expect(existsSync(resolve('public', l.href.slice(base.length))), l.href).toBe(true)
  })
})
