import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import PianoNav from './components/PianoNav.jsx'
import Home from './pages/Home.jsx'
import WorkList from './pages/WorkList.jsx'
import CaseStudy from './pages/CaseStudy.jsx'
import About from './pages/About.jsx'
import Create from './pages/Create.jsx'
import IntroOverlay from './components/IntroOverlay.jsx'
import { asset } from './components/Frame.jsx'
import { InkFilters } from './components/Doodles.jsx'
import { LightboxProvider } from './components/Lightbox.jsx'
import { PluckProvider } from './components/PluckProvider.jsx'
import useScrollToTopOnNavigate from './hooks/useScrollToTopOnNavigate.js'

export default function App() {
  const location = useLocation()
  useScrollToTopOnNavigate()

  return (
    <LightboxProvider>
      <PluckProvider>
        <InkFilters />
        <IntroOverlay />
        <PianoNav />
        <div className="shell">
          {/* key={pathname} forces a remount on route change, which re-triggers
              the "rise" entrance animation defined in index.css */}
          <div className="page active" key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              {/* the case studies live on Home, under the landing */}
              <Route path="/work" element={<Navigate to="/#case-studies" replace />} />
              <Route path="/work/list" element={<WorkList />} />
              <Route path="/work/:id" element={<CaseStudy />} />
              <Route path="/about" element={<About />} />
              <Route path="/create" element={<Create />} />
              {/* the page's old name, for existing links */}
              <Route path="/encore" element={<Navigate to="/create" replace />} />
            </Routes>
          </div>
          <footer>
            <div className="footer-text">
              <span>colin zeng</span>
              <span>designed in procreate &amp; figma</span>
            </div>
            {/* the white-signature version reads on the green page */}
            <img src={asset('images/footer-dark.png')} alt="Hand-drawn self-portrait of Colin Zeng" loading="lazy" />
          </footer>
        </div>
      </PluckProvider>
    </LightboxProvider>
  )
}
