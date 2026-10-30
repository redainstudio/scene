import { motion } from 'motion/react'
import { Plus, ArrowUpRight } from 'lucide-react'
import NeuralCanvas from './hero2/NeuralCanvas.jsx'
import './hero2/hero2.css'

const EASE = [0.16, 1, 0.3, 1]

function LogoIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g transform="rotate(-35 12 12)" fill="currentColor">
        <rect x="2" y="5" width="20" height="6" rx="3" />
        <rect x="2" y="13" width="20" height="6" rx="3" />
      </g>
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <circle cx="3.5" cy="3.5" r="1.5" />
      <circle cx="10.5" cy="3.5" r="1.5" />
      <circle cx="3.5" cy="10.5" r="1.5" />
      <circle cx="10.5" cy="10.5" r="1.5" />
    </svg>
  )
}

export default function Hero2() {
  return (
    <div className="hero2-page">
      <motion.nav
        className="hero2-nav"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: EASE }}
      >
        <div className="hero2-nav__left">
          <a href="/" className="hero2-logo" aria-label="NeuralKinetics home">
            <LogoIcon />
            <span>NeuralKinetics</span>
          </a>
          <button type="button" className="hero2-menu">
            <span className="hero2-menu__plus"><Plus size={13} strokeWidth={3} /></span>
            <span>Menu</span>
          </button>
          <div className="hero2-nav__tags" aria-label="Product categories">
            <span>Knowledge AI</span>
            <i />
            <span>Source-backed</span>
          </div>
        </div>
        <div className="hero2-private">
          <span className="hero2-private__icon"><GridIcon /></span>
          <span>Private knowledge</span>
        </div>
      </motion.nav>

      <main className="hero2-main">
        <motion.section
          className="hero2-copy"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.9, ease: EASE }}
          aria-labelledby="hero2-title"
        >
          <div className="hero2-kicker"><span /> YOUR KNOWLEDGE, IN MOTION</div>
          <h1 id="hero2-title">Answers grounded in <span>your knowledge.</span></h1>
          <p className="hero2-description">
            Turn your documents into an AI assistant that shows the source behind every answer.
          </p>
          <div className="hero2-actions">
            <a className="hero2-button hero2-button--solid" href="#how-it-works">
              See how it works <ArrowUpRight size={16} strokeWidth={1.8} />
            </a>
            <a className="hero2-button hero2-button--outline" href="#platform">Explore the platform</a>
          </div>
          <div className="hero2-proof" aria-label="Key features">
            <span>Source citations</span>
            <span>Hybrid search</span>
            <span>Easy to embed</span>
          </div>
        </motion.section>

        <motion.section
          id="how-it-works"
          className="hero2-scene"
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 1.05, ease: EASE }}
          aria-label="How your knowledge assistant works"
        >
          <div className="hero2-scene__canvas">
            <NeuralCanvas />
          </div>
        </motion.section>
      </main>

      <div className="hero2-page__glow" aria-hidden="true" />
    </div>
  )
}
