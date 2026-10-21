import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { caseStudies, findCaseStudy } from '../caseStudies.js'

// tests run from the project root
const publicFile = (src) => resolve('public', src)

describe('case studies', () => {
  it('lists the six chosen case studies, the lab database first', () => {
    expect(caseStudies.map((c) => c.id)).toEqual([
      'ashbya-genome-database',
      'ai-merchandise-planner',
      'insight',
      'frisbee-play-classifier',
      'speech-dysfluency-removal',
      'event-horizon',
    ])
  })

  it('takes role, dates, tools and links from the matching content entry', () => {
    const agd = findCaseStudy('ashbya-genome-database')
    expect(agd.role).toBe('Undergraduate Research Intern')
    expect(agd.org).toBe('Dietrich Lab, Duke University')
    expect(agd.tools).toContain('PostgreSQL')
    expect(agd.links[0].href).toMatch(/agd\.php$/)
  })

  it('points every picture at a file that exists', () => {
    for (const c of caseStudies) {
      const images = [c.tile, c.contextImage, c.solution.image].filter(Boolean)
      for (const img of images) expect(existsSync(publicFile(img.src)), `${c.id}: ${img.src}`).toBe(true)
    }
  })

  it('gives every picture on a case page a description', () => {
    for (const c of caseStudies) {
      for (const img of [c.contextImage, c.solution.image].filter(Boolean)) expect(img.alt, c.id).toBeTruthy()
    }
  })

  it('finds nothing for an unknown id', () => {
    expect(findCaseStudy('nope')).toBeUndefined()
  })
})
