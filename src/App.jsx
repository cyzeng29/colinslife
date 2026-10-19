import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import PianoNav from './components/PianoNav.jsx'
import Home from './pages/Home.jsx'
import Work from './pages/Work.jsx'
import About from './pages/About.jsx'
import Create from './pages/Create.jsx'
import IntroOverlay from './components/IntroOverlay.jsx'
import { asset } from './components/Frame.jsx'
import { InkFilters } from './components/Doodles.jsx'
import { LightboxProvider } from './components/Lightbox.jsx'
import { PluckProvider } from './components/PluckProvider.jsx'

export default function App() {
  const location = useLocation()

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
              <Route path="/work" element={<Work />} />
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
