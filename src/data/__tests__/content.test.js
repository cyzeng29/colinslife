import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { about, experience, landing, projects, skills } from '../content.js'
import { caseStudies, findCaseStudy } from '../caseStudies.js'
import { LAYERS } from '../landingGeometry.js'

const base = import.meta.env.BASE_URL
const local = (href) => href.startsWith(base) && !/^(https?:)?\/\//.test(href)

describe('content assets', () => {
  it('points every filled image slot at a file in public/', () => {
    const entries = [...experience, ...projects]
    const images = [
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

  it('has a trimmed image for every drawn layer the landing uses', () => {
    const slugs = [
      ...Object.keys(LAYERS),
      'side-name',
      'side-tagline',
      ...landing.desk.map((d) => d.slug),
    ]
    for (const slug of slugs) {
      expect(LAYERS[slug], slug).toBeDefined()
      expect(existsSync(resolve('public/images/landing', `${slug}.png`)), slug).toBe(true)
    }
  })
})

describe('backpack skills', () => {
  const words = skills.flatMap((g) => g.words)
  const names = words.map((w) => w.name)

  it('lists each skill once, at a known size', () => {
    expect(new Set(names).size).toBe(names.length)
    for (const w of words) expect([1, 2, 3], w.name).toContain(w.tier)
  })

  it('links only to case studies that exist', () => {
    for (const w of words) {
      for (const id of w.studies) expect(findCaseStudy(id), `${w.name} -> ${id}`).toBeTruthy()
    }
  })

  it("links a skill to every case study whose skills list names it", () => {
    for (const study of caseStudies) {
      for (const tool of study.tools) {
        const word = words.find((w) => w.name === tool)
        if (word) expect(word.studies, `${tool} -> ${study.id}`).toContain(study.id)
      }
    }
  })

  it('covers the technical skills on the resume', () => {
    const resume = [
      'Python', 'Java', 'SQL', 'JavaScript', 'TypeScript', 'PHP', 'C++', 'R', 'HTML/CSS',
      'React', 'Vite', 'PyTorch', 'scikit-learn', 'YOLOv8', 'pandas', 'NumPy', 'Streamlit', 'Plotly',
      'PostgreSQL', 'MySQL/MariaDB', 'Linux server admin', 'Vercel', 'Git', 'Docker',
      'Claude API', 'Groq API', 'Whisper', 'BLAST+', 'JBrowse2', 'AlphaFold',
    ]
    for (const name of resume) expect(names, name).toContain(name)
  })
})
