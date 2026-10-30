import { motion } from 'motion/react'
import { Plus, ArrowUpRight, LockKeyhole } from 'lucide-react'
import Hero2Scene from './hero2/Hero2Scene.jsx'
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
    <div className="hero2-page hero2-page--constellation">
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
          <button type="button" className="hero2-menu" aria-label="Open menu">
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

      <main className="hero2-main hero2-main--constellation">
        <motion.section
          className="hero2-story"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.9, ease: EASE }}
          aria-labelledby="hero2-title"
        >
          <div className="hero2-story__eyebrow"><span /> THE INTELLIGENCE LAYER FOR YOUR BUSINESS</div>
          <h1 id="hero2-title">Your knowledge.<br /><span>In motion.</span></h1>
          <p className="hero2-description">
            Turn scattered documents into a private AI that understands your business, finds the right context, and answers with proof.
          </p>
          <div className="hero2-actions">
            <a className="hero2-button hero2-button--solid" href="#how-it-works">
              Explore the experience <ArrowUpRight size={16} strokeWidth={1.8} />
            </a>
            <a className="hero2-button hero2-button--outline" href="#platform">Discover the platform</a>
          </div>
          <div className="hero2-story__foot">
            <div className="hero2-story__avatars" aria-hidden="true"><span>PDF</span><span>DOC</span><span>AI</span></div>
            <div><strong>One connected brain.</strong><span>Every answer tied back to its source.</span></div>
          </div>
        </motion.section>

        <motion.section
          id="how-it-works"
          className="hero2-scene hero2-scene--constellation"
          initial={{ opacity: 0, scale: 0.96, x: 24 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.22, duration: 1.1, ease: EASE }}
          aria-label="Interactive illustration of documents becoming source-backed AI answers"
        >
          <div className="hero2-scene__topline">
            <span>FROM RAW INFORMATION</span>
            <span className="hero2-scene__legend"><i /> TO USEFUL INTELLIGENCE</span>
          </div>
          <Hero2Scene />
          <div className="hero2-scene__bottomline" aria-hidden="true">
            <span>INGEST</span><i /><span>UNDERSTAND</span><i /><span>RETRIEVE</span><i /><span>RESPOND</span>
          </div>
        </motion.section>
      </main>

      <footer className="hero2-footer">
        <div className="hero2-footer__security"><LockKeyhole size={13} /> Your data stays yours</div>
        <div className="hero2-footer__proof"><span>Source citations</span><span>Hybrid retrieval</span><span>Easy to embed</span></div>
        <div className="hero2-footer__note">BUILT FOR KNOWLEDGE THAT MOVES YOU FORWARD <i /></div>
      </footer>
      <div className="hero2-page__glow" aria-hidden="true" />
    </div>
  )
}
