import { Routes, Route, useLocation } from 'react-router-dom'
import PianoNav from './components/PianoNav.jsx'
import Home from './pages/Home.jsx'
import Work from './pages/Work.jsx'
import About from './pages/About.jsx'
import IntroOverlay from './components/IntroOverlay.jsx'
import { asset } from './components/Frame.jsx'
import { InkFilters } from './components/Doodles.jsx'
import { LightboxProvider } from './components/Lightbox.jsx'

export default function App() {
  const location = useLocation()

  return (
    <LightboxProvider>
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
          </Routes>
        </div>
        <footer>
          <span>colin zeng</span>
          <picture>
            {/* Dark-mode variant has the signature recolored white */}
            <source srcSet={asset('images/footer-dark.png')} media="(prefers-color-scheme: dark)" />
            <img src={asset('images/footer.png')} alt="Hand-drawn self-portrait of Colin Zeng" loading="lazy" />
          </picture>
        </footer>
      </div>
    </LightboxProvider>
  )
}
