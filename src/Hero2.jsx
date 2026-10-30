import { motion } from 'motion/react'
import { ArrowUpRight, FileText, Globe2, LockKeyhole, ShieldCheck, Sparkles, Database, Layers3 } from 'lucide-react'
import KnowledgeWebGL from './hero2/KnowledgeWebGL'
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

function SourceNode({ className, icon: Icon, name, type }) {
  return (
    <motion.div
      className={`source-node ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: .65, duration: .7, ease: EASE }}
    >
      <span className="source-node__icon"><Icon size={15} /></span>
      <span className="source-node__copy"><b>{name}</b><small>{type}</small></span>
      <span className="source-node__pulse" />
    </motion.div>
  )
}

export default function Hero2() {
  return (
    <div className="hero2-page">
      <motion.nav className="hero2-nav" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, ease: EASE }}>
        <a href="/" className="hero2-logo" aria-label="NeuralKinetics home"><LogoIcon /><span>NeuralKinetics</span></a>
        <div className="hero2-nav__center"><span /> KNOWLEDGE INFRASTRUCTURE <i /> BUILT FOR ANSWERS</div>
        <div className="hero2-nav__right">
          <a href="#platform">Platform</a>
          <a href="#security">Security</a>
          <a className="hero2-nav__cta" href="#get-started">Get started <ArrowUpRight size={14} /></a>
        </div>
      </motion.nav>

      <main className="hero2-main">
        <motion.section className="hero2-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08, duration: .85, ease: EASE }}>
          <div className="hero2-kicker"><span /> YOUR KNOWLEDGE, IN MOTION</div>
          <h1>Everything<br />your business<br /><em>knows.</em></h1>
          <p className="hero2-description">
            Bring scattered documents and data into one intelligent knowledge layer. Ask better questions, get grounded answers, and trace every response back to its source.
          </p>
          <div className="hero2-actions" id="get-started">
            <a className="hero2-button hero2-button--solid" href="#platform">Build your knowledge base <ArrowUpRight size={16} /></a>
            <a className="hero2-button hero2-button--quiet" href="#how-it-works">Explore the platform <span>↗</span></a>
          </div>
          <div className="hero2-trustline"><LockKeyhole size={12} /> PRIVATE BY DESIGN <i /> SOURCE-GROUNDED <i /> READY TO SCALE</div>
        </motion.section>

        <motion.section className="knowledge-stage" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .12, duration: 1.05, ease: EASE }} aria-label="Interactive visualization of the knowledge engine">
          <div className="knowledge-stage__header">
            <span><i /> KNOWLEDGE ENGINE <b>LIVE</b></span>
            <span>01 / CONNECTED INTELLIGENCE</span>
          </div>
          <div className="knowledge-stage__scene">
            <div className="knowledge-stage__backdrop" />
            <svg className="knowledge-stage__routes" viewBox="0 0 1100 700" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="route-fade" x1="0" x2="1"><stop offset="0" stopColor="#a5a5aa" stopOpacity="0" /><stop offset=".48" stopColor="#55555b" stopOpacity=".48" /><stop offset="1" stopColor="#a5a5aa" stopOpacity="0" /></linearGradient>
              </defs>
              <path d="M70 180 C250 180 250 280 425 320 S680 360 1010 225" />
              <path d="M55 520 C260 510 300 430 445 390 S760 310 1040 495" />
              <path d="M95 345 C300 345 350 345 470 350 S780 355 1010 350" />
            </svg>
            <div className="knowledge-stage__orb">
              <KnowledgeWebGL />
              <div className="knowledge-stage__orb-core"><span>NK</span></div>
              <div className="knowledge-stage__orb-ring knowledge-stage__orb-ring--one" />
              <div className="knowledge-stage__orb-ring knowledge-stage__orb-ring--two" />
            </div>
            <div className="knowledge-stage__orbit-label knowledge-stage__orbit-label--top">SEMANTIC INDEX <span>↗</span></div>
            <div className="knowledge-stage__orbit-label knowledge-stage__orbit-label--bottom">CONTEXTUAL RETRIEVAL <span>↗</span></div>

            <SourceNode className="source-node--one" icon={FileText} name="Documents" type="PDF · DOCX" />
            <SourceNode className="source-node--two" icon={Database} name="Structured data" type="CSV · DATABASE" />
            <SourceNode className="source-node--three" icon={Globe2} name="Connected apps" type="WEB · API" />

            <motion.div className="answer-node" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: .7, ease: EASE }}>
              <div className="answer-node__top"><span><Sparkles size={12} /> ANSWER GENERATED</span><i /></div>
              <p>Grounded in your knowledge.<br /><b>Verified at the source.</b></p>
              <div className="answer-node__source"><ShieldCheck size={13} /> 3 source references <ArrowUpRight size={11} /></div>
            </motion.div>

            <div className="knowledge-stage__metric knowledge-stage__metric--left"><span>CONNECTED SOURCES</span><b>1,284</b><small>AND GROWING</small></div>
            <div className="knowledge-stage__metric knowledge-stage__metric--right"><span>RETRIEVAL ACCURACY</span><b>98.4<sup>%</sup></b><small>CONTEXT MATCH</small></div>
            <div className="knowledge-stage__coordinate">NODE 07.24 <i /> ENCRYPTED SESSION</div>
          </div>
          <div className="knowledge-stage__footer">
            <span><Layers3 size={13} /> INGEST</span><i /><span>UNDERSTAND</span><i /><span>RETRIEVE</span><i /><span>ANSWER</span>
          </div>
        </motion.section>
      </main>

      <footer className="hero2-bottom" id="platform">
        <div className="hero2-bottom__statement">ONE INTELLIGENCE LAYER. YOUR ENTIRE BUSINESS.</div>
        <div className="hero2-bottom__features"><span>CONNECTED KNOWLEDGE</span><i /><span>VERIFIABLE ANSWERS</span><i /><span id="security">PRIVATE BY DEFAULT</span></div>
      </footer>
    </div>
  )
}
