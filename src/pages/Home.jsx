import Landing from '../components/landing/Landing.jsx'
import CaseStudies from '../components/CaseStudies.jsx'
import { projects } from '../data/content.js'

export default function Home() {
  return (
    <>
      <Landing />

      <CaseStudies projects={projects} />
    </>
  )
}
