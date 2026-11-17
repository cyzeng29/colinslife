import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import WorkList from '../pages/WorkList.jsx'
import { contact, recruiter } from '../data/content.js'
import { findCaseStudy } from '../data/caseStudies.js'

const renderPage = () =>
  render(
    <MemoryRouter>
      <WorkList />
    </MemoryRouter>,
  )

describe('recruiter mode', () => {
  it('lists every role, then every project, in order', () => {
    renderPage()
    const list = (name) =>
      within(screen.getByRole('region', { name }))
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent)
    expect(list('experience')).toEqual(recruiter.experience.map((e) => e.org))
    expect(list('projects')).toEqual(recruiter.projects.map((e) => e.org))
  })

  it('gives each role its dates, one line and the skills gained', () => {
    renderPage()
    const role = screen.getByRole('heading', { name: 'Duke Applied Machine Learning' }).closest('li')
    expect(within(role).getByText('Machine Learning Engineer')).toBeInTheDocument()
    expect(within(role).getByText('Aug 2025 — May 2026')).toBeInTheDocument()
    expect(within(role).getByText(/79\.6% accuracy/)).toBeInTheDocument()
    expect(within(within(role).getByRole('list', { name: 'Skills' })).getByText('PyTorch')).toBeInTheDocument()
    expect(within(role).getByRole('link', { name: /case study/ })).toHaveAttribute('href', '/work/speech-dysfluency-removal')
  })

  it('leaves out the case study link where there is none', () => {
    renderPage()
    const role = screen.getByRole('heading', { name: 'NCSSM Summer Research' }).closest('li')
    expect(within(role).queryByRole('link')).not.toBeInTheDocument()
  })

  it('only links case studies that exist', () => {
    const ids = [...recruiter.experience, ...recruiter.projects].map((e) => e.caseStudy).filter(Boolean)
    for (const id of ids) expect(findCaseStudy(id), id).toBeTruthy()
  })

  it('links the contact details up top', () => {
    renderPage()
    const links = within(screen.getByRole('list', { name: 'Links' }))
    for (const { label, href } of contact) {
      expect(links.getByRole('link', { name: new RegExp(label) })).toHaveAttribute('href', href)
    }
  })
})
