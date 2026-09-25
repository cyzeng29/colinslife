import { Routes, Route, useLocation } from 'react-router-dom'
import PianoNav from './components/PianoNav.jsx'
import Home from './pages/Home.jsx'
import Work from './pages/Work.jsx'
import About from './pages/About.jsx'

export default function App() {
  const location = useLocation()

  return (
    <>
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
        <footer>colin zeng — built by hand, not a template</footer>
      </div>
    </>
  )
}
