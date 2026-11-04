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
    expect(screen.getByRole('link', { name: /Genome Database/ })).toHaveAttribute('href', '/work/ashbya-genome-database')
  })

  it('shows the discipline, date and skills under each title', () => {
    renderAt('/')
    const card = screen.getByRole('heading', { name: /AI Merchandise Planning/ }).closest('article')
    expect(within(card).getByText('Software Engineering | 2024 to 2025')).toBeInTheDocument()
    expect(within(within(card).getByRole('list', { name: 'Skills' })).getByText('Claude API')).toBeInTheDocument()
  })

  it('opens the case study when its card is followed', () => {
    renderAt('/')
    fireEvent.click(screen.getByRole('link', { name: /Insight/ }))
    expect(where()).toBe('/work/insight')
    expect(screen.getByRole('heading', { level: 1, name: 'Insight' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'A journal that asks better questions' })).toBeInTheDocument()
  })
})

describe('case study page', () => {
  it('tells the story under a list of its sections', () => {
    renderAt('/work/ashbya-genome-database')
    expect(screen.getByRole('heading', { level: 1, name: 'Genome Database @ Dietrich Lab' })).toBeInTheDocument()
    expect(screen.getByText('Undergraduate Research Intern')).toBeInTheDocument()
    expect(screen.getByText('Jan 2026 — present')).toBeInTheDocument()
    expect(screen.getByText(/React, JavaScript, PostgreSQL/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Building a searchable home for the lab’s yeast genomes' })).toBeInTheDocument()
    const nav = within(screen.getByRole('navigation', { name: /sections/ }))
    expect(nav.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'Context',
      'Problem',
      'Process',
      'Audience',
      'Visuals',
      'Impact',
      'Reflection',
      'Next steps',
    ])
    expect(nav.getByRole('link', { name: 'Context' })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('heading', { level: 2, name: 'New Approaches To Understanding Genes' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Publication' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Visuals' })).toContainElement(screen.getByRole('img', { name: /Foldseek structure search/ }))
    const foldseek = screen.getByRole('img', { name: /Foldseek structure search/ }).closest('figure')
    expect(within(foldseek).getByRole('heading', { level: 3, name: 'Foldseek Structure Search' })).toBeInTheDocument()
    expect(within(foldseek).getByText(/Compares the A\. gossypii gene AGR387C/)).toBeInTheDocument()
    expect(screen.getByText('1,482')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /fungalpangenome/ })).toHaveLength(1)
    expect(screen.getByRole('link', { name: /fungalpangenome/ })).toHaveAttribute('target', '_blank')
  })

  it('builds the usual sections for a case study written without them', () => {
    renderAt('/work/insight')
    const nav = within(screen.getByRole('navigation', { name: /sections/ }))
    expect(nav.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Context', 'Solution', 'Process', 'Results'])
    expect(screen.getByRole('heading', { name: 'Key challenges' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'How it came together' })).toBeInTheDocument()
  })

  it('tells the Snaily story with its walkthrough and live demo', () => {
    renderAt('/work/snaily')
    expect(screen.getByRole('heading', { level: 2, name: 'The love of physical snail mail turned digital' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Live demo/ })).toHaveAttribute('href', 'https://snaily-seven.vercel.app/')
    expect(screen.getByLabelText(/Walkthrough of Snaily/)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /The Snaily logo/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Thanks' })).not.toBeInTheDocument()
  })

  it('tells the Quantworks story with its screen recordings and scope', () => {
    renderAt('/work/ai-merchandise-planner')
    expect(screen.getByRole('heading', { level: 2, name: 'Envisioning SIZEO Dashboard' })).toBeInTheDocument()
    const nav = within(screen.getByRole('navigation', { name: /sections/ }))
    expect(nav.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'Context',
      'Goal',
      'Research',
      'Process',
      'Multi-Trend Tool',
      'Agents & Chatbot',
      'Scope',
      'Reflection',
    ])
    const process = screen.getByRole('region', { name: 'Categorizing Visualizations' })
    expect(within(process).getByLabelText(/Trend Almanac/)).toHaveAttribute('src', expect.stringContaining('videos/quantworks_trends.mp4'))
    const agents = screen.getByRole('region', { name: 'Intuitive Management of Agents and Chatbot' })
    expect(within(agents).getByLabelText(/chatbot/)).toHaveAttribute('src', expect.stringContaining('videos/quantworks_agents.mp4'))
    const scope = within(screen.getByRole('region', { name: 'Scope' }))
    expect(scope.getByText('30+')).toBeInTheDocument()
    expect(scope.getByText('agents')).toBeInTheDocument()
    expect(scope.getByText('of SKUs processed weekly')).toBeInTheDocument()
    expect(scope.getByText('~10')).toBeInTheDocument()
    expect(scope.getByText('enterprise clients')).toBeInTheDocument()
    expect(scope.getByText('of users on the platform')).toBeInTheDocument()
    expect(scope.getByRole('link', { name: /Figma Prototype/ })).toBeInTheDocument()
  })

  it('plays recordings silently on a loop, with controls to pause them', () => {
    renderAt('/work/ai-merchandise-planner')
    const video = screen.getByLabelText(/Trend Almanac/)
    expect(video.muted).toBe(true)
    expect(video).toHaveAttribute('loop')
    expect(video).toHaveAttribute('controls')
    expect(video).toHaveAttribute('autoplay')
  })

  it('does not start recordings on its own under reduced motion', () => {
    const matchMedia = window.matchMedia
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    renderAt('/work/ai-merchandise-planner')
    expect(screen.getByLabelText(/Trend Almanac/)).not.toHaveAttribute('autoplay')
    window.matchMedia = matchMedia
  })

  it('falls back to the caption when a recording cannot be played', () => {
    renderAt('/work/ai-merchandise-planner')
    fireEvent.error(screen.getByLabelText(/Trend Almanac/))
    expect(screen.queryByLabelText(/Trend Almanac/)).not.toBeInTheDocument()
    expect(screen.getByText('Trend Almanac, Trend Identification and Map Store View')).toBeInTheDocument()
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
    fireEvent.click(screen.getByRole('link', { name: /Next: Genome Database/ }))
    expect(where()).toBe('/work/ashbya-genome-database')
  })

  it('sends an unknown case study back to the case studies on Home', () => {
    renderAt('/work/not-a-case')
    expect(where()).toBe('/#case-studies')
  })
})
