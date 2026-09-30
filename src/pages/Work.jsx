import { useEffect, useRef, useState } from 'react'
import WorkCard from '../components/WorkCard.jsx'
import ExperienceDialog from '../components/ExperienceDialog.jsx'
import ExperienceTimeline from '../components/ExperienceTimeline.jsx'
import usePianoHeight from '../hooks/usePianoHeight.js'
import { experience, projects } from '../data/content.js'

const groups = [
  { label: 'experience', kind: 'experience', items: experience },
  { label: 'projects', kind: 'project', items: projects },
]
const allIds = groups.flatMap((g) => g.items.map((i) => i.id))

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Work() {
  const pianoH = usePianoHeight()
  const [activeId, setActiveId] = useState(allIds[0])
  const [open, setOpen] = useState(null) // { id, opener }
  const jumpLock = useRef(null) // id of the last timeline click

  // Current entry = the last sheet whose top has passed a line a third of
  // the way down the space below the piano. After a timeline click, that
  // entry stays current until the visitor scrolls themselves (the page may
  // not be able to scroll far enough to bring the last entries to the line).
  useEffect(() => {
    let frame = 0
    function update() {
      frame = 0
      if (jumpLock.current) {
        setActiveId(jumpLock.current)
        return
      }
      const line = pianoH + (window.innerHeight - pianoH) * 0.33
      let current = allIds[0]
      for (const id of allIds) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      setActiveId(atBottom ? allIds[allIds.length - 1] : current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const release = () => {
      jumpLock.current = null
    }
    const inputs = ['wheel', 'touchmove', 'keydown']
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    inputs.forEach((t) => window.addEventListener(t, release, { passive: true }))
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      inputs.forEach((t) => window.removeEventListener(t, release))
    }
  }, [pianoH])

  function jumpTo(id) {
    const el = document.getElementById(id)
    if (!el) return
    jumpLock.current = id
    setActiveId(id)
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    // Land keyboard and screen reader users on the entry they picked
    el.querySelector('.card-title')?.focus({ preventScroll: true })
  }

  const openGroup = open && groups.find((g) => g.items.some((i) => i.id === open.id))
  const openIndex = openGroup ? openGroup.items.findIndex((i) => i.id === open.id) : -1

  return (
    <section className="page-content work-layout">
      <ExperienceTimeline groups={groups} activeId={activeId} onJump={jumpTo} />

      <div className="work-main">
        {groups.map((g) => (
          <div key={g.label}>
            <p className="section-label mono">{g.label}</p>
            <div className="cards">
              {g.items.map((item, i) => (
                <WorkCard
                  key={item.id}
                  entry={item}
                  index={i}
                  kind={g.kind}
                  onOpen={(id, opener) => setOpen({ id, opener })}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {openGroup && (
        <ExperienceDialog
          key={open.id}
          entry={openGroup.items[openIndex]}
          kind={openGroup.kind}
          index={openIndex}
          total={openGroup.items.length}
          opener={open.opener}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  )
}
