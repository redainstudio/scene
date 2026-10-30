import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import NeuralCanvas from './NeuralCanvas.jsx'

const EASE = [0.16, 1, 0.3, 1]

function LogoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g transform="rotate(-35 12 12)" fill="#000">
        <rect x="2" y="5" width="20" height="6" rx="3" />
        <rect x="2" y="13" width="20" height="6" rx="3" />
      </g>
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="#fff" aria-hidden="true">
      <circle cx="3.5" cy="3.5" r="1.5" />
      <circle cx="10.5" cy="3.5" r="1.5" />
      <circle cx="3.5" cy="10.5" r="1.5" />
      <circle cx="10.5" cy="10.5" r="1.5" />
    </svg>
  )
}

export default function App() {
  return (
    <div className="hero">
      {/* Generative background: files -> tunnel -> binary -> brain */}
      <motion.div
        className="hero__scene"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        <NeuralCanvas />
      </motion.div>

      {/* Navbar */}
      <motion.nav
        className="nav"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className="nav__left">
          <a href="#" className="logo">
            <LogoIcon />
            <span className="logo__text">NeuralKinetics</span>
          </a>

          <button type="button" className="menu-btn">
            <span className="menu-btn__circle">
              <Plus size={12} strokeWidth={3} color="#000" />
            </span>
            <span className="menu-btn__label">Menu</span>
          </button>

          <div className="pill pill--tags">
            <span className="pill__text">Advanced Bionics</span>
            <span className="pill__text">Cognitive AI</span>
          </div>
        </div>

        <div className="nav__right">
          <div className="pill pill--right">
            <button type="button" className="icon-btn" aria-label="Adaptive Systems">
              <GridIcon />
            </button>
            <span className="pill__text pill__text--right">Adaptive Systems</span>
          </div>
        </div>
      </motion.nav>

      {/* Spacer keeps footer pinned to bottom via space-between */}
      <div aria-hidden="true" />

      {/* Footer content */}
      <motion.footer
        className="footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1, ease: EASE }}
      >
        <div className="footer__left">
          <motion.div
            className="subtitle"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
          >
            <span className="subtitle__dot" />
            <span className="subtitle__text">Best digital banking card 2026</span>
          </motion.div>

          <motion.h1
            className="heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
          >
            One Card, Zero
            <br />
            Limits. Worldwide.
          </motion.h1>

          <motion.div
            className="buttons"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8, ease: EASE }}
          >
            <button type="button" className="btn btn--solid">See Features</button>
            <button type="button" className="btn btn--outline">How It Works</button>
          </motion.div>
        </div>

        <div className="footer__right">
          <span className="tag">Neuromorphic</span>
          <span className="tag">AGI</span>
          <span className="tag">Cybernetics</span>
        </div>
      </motion.footer>
    </div>
  )
}
