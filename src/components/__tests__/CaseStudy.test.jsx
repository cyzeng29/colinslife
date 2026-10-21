import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import CaseGrid from '../caseStudies/CaseGrid.jsx'
import CaseStudy from '../../pages/CaseStudy.jsx'
import { caseStudies } from '../../data/caseStudies.js'

function Where() {
  const { pathname, hash } = useLocation()
  return <p data-testid="where">{pathname + hash}</p>
}

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<CaseGrid />} />
        <Route path="/work/:id" element={<CaseStudy />} />
      </Routes>
      <Where />
    </MemoryRouter>,
  )
const where = () => screen.getByTestId('where').textContent

describe('case study grid', () => {
  it('shows every case study in order, each linking to its own page', () => {
    renderAt('/')
    const titles = screen.getAllByRole('heading', { level: 3 })
    expect(titles.map((h) => h.textContent)).toEqual(caseStudies.map((c) => c.title + (c.at ? ` @ ${c.at}` : '')))
    expect(screen.getByRole('link', { name: /Ashbya Genome Database/ })).toHaveAttribute('href', '/work/ashbya-genome-database')
  })

  it('shows the discipline, date and skills under each title', () => {
    renderAt('/')
    const card = screen.getByRole('heading', { name: /AI Merchandise Planner/ }).closest('article')
    expect(within(card).getByText('Software Engineering | 2024 to 2025')).toBeInTheDocument()
    expect(within(within(card).getByRole('list', { name: 'Skills' })).getByText('Claude API')).toBeInTheDocument()
  })

  it('opens the case study when its card is followed', () => {
    renderAt('/')
    fireEvent.click(screen.getByRole('link', { name: /Insight/ }))
    expect(where()).toBe('/work/insight')
    expect(screen.getByRole('heading', { level: 1, name: 'A journal that asks better questions' })).toBeInTheDocument()
  })
})

describe('case study page', () => {
  it('tells the story under a list of its sections', () => {
    renderAt('/work/ashbya-genome-database')
    expect(screen.getByRole('heading', { level: 1, name: 'Building a searchable home for the lab’s yeast genomes' })).toBeInTheDocument()
    const nav = within(screen.getByRole('navigation', { name: /sections/ }))
    expect(nav.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Context', 'Solution', 'Process', 'Results'])
    expect(nav.getByRole('link', { name: 'Context' })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('heading', { name: 'Key challenges' })).toBeInTheDocument()
    expect(screen.getByText('1,482')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /fungalpangenome/ })).toHaveAttribute('target', '_blank')
  })

  it('jumps to a section from the list', () => {
    renderAt('/work/ashbya-genome-database')
    const scrollIntoView = vi.fn()
    document.getElementById('cs-process').scrollIntoView = scrollIntoView
    fireEvent.click(screen.getByRole('link', { name: 'Process' }))
    expect(scrollIntoView).toHaveBeenCalled()
  })

  it('leaves out results it has none of, and reflections not yet written', () => {
    renderAt('/work/event-horizon')
    const nav = within(screen.getByRole('navigation', { name: /sections/ }))
    expect(nav.queryByRole('link', { name: 'Results' })).not.toBeInTheDocument()
    expect(nav.queryByRole('link', { name: 'Reflection' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /kooling\.itch\.io/ })).toBeInTheDocument()
  })

  it('leads back to the case studies on Home and on to the next one, wrapping at the end', () => {
    renderAt('/work/event-horizon')
    expect(screen.getByRole('link', { name: /Case studies/ })).toHaveAttribute('href', '/#case-studies')
    fireEvent.click(screen.getByRole('link', { name: /Next: Ashbya Genome Database/ }))
    expect(where()).toBe('/work/ashbya-genome-database')
  })

  it('sends an unknown case study back to the case studies on Home', () => {
    renderAt('/work/not-a-case')
    expect(where()).toBe('/#case-studies')
  })
})
