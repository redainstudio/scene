import { motion } from 'motion/react'
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  FileText,
  LockKeyhole,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react'
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

function ProductPreview() {
  return (
    <motion.div
      className="product-stage"
      initial={{ opacity: 0, y: 28, scale: .985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: .2, duration: 1, ease: EASE }}
      aria-label="Preview of the NeuralKinetics knowledge assistant"
    >
      <div className="product-stage__ambient" />
      <div className="product-window">
        <div className="product-window__topbar">
          <div className="product-window__brand">
            <span className="product-window__brand-mark"><LogoIcon /></span>
            <span>NeuralKinetics</span>
            <i />
            <span className="product-window__workspace">Acme workspace</span>
            <ChevronDown size={13} />
          </div>
          <div className="product-window__top-actions">
            <span className="product-window__status"><i /> All systems operational</span>
            <button type="button" aria-label="More workspace options"><MoreHorizontal size={17} /></button>
            <span className="product-window__avatar">A</span>
          </div>
        </div>

        <div className="product-window__body">
          <aside className="workspace-sidebar">
            <div className="workspace-sidebar__search"><Search size={13} /><span>Search workspace</span><kbd>⌘ K</kbd></div>
            <div className="workspace-sidebar__section">
              <span className="workspace-sidebar__label">WORKSPACE</span>
              <div className="workspace-nav workspace-nav--active"><MessageSquareText size={14} /> Assistant <span>⌘1</span></div>
              <div className="workspace-nav"><FileText size={14} /> Knowledge base</div>
            </div>
            <div className="workspace-sidebar__section workspace-sidebar__sources">
              <div className="workspace-sidebar__label-row"><span className="workspace-sidebar__label">YOUR SOURCES</span><Plus size={13} /></div>
              <div className="source-file"><span className="source-file__icon source-file__icon--pdf">PDF</span><span><b>Product handbook</b><small>2.4 MB · Updated today</small></span><i /></div>
              <div className="source-file"><span className="source-file__icon source-file__icon--doc">DOC</span><span><b>Support playbook</b><small>840 KB · Updated yesterday</small></span><i /></div>
              <div className="source-file"><span className="source-file__icon source-file__icon--sheet">CSV</span><span><b>Pricing & plans</b><small>128 KB · Updated Oct 24</small></span><i /></div>
              <button className="workspace-add-source" type="button"><Upload size={12} /> Add a source</button>
            </div>
            <div className="workspace-sidebar__bottom"><LockKeyhole size={12} /> Private workspace</div>
          </aside>

          <section className="assistant-panel">
            <div className="assistant-panel__heading">
              <div><span className="assistant-panel__eyebrow">AI ASSISTANT</span><h3>Ask your knowledge</h3></div>
              <span className="assistant-panel__ready"><i /> Ready</span>
            </div>
            <div className="assistant-conversation">
              <div className="assistant-date">TODAY, 10:42 AM</div>
              <div className="chat-message chat-message--user">What is our refund policy for annual plans?</div>
              <div className="assistant-response">
                <div className="assistant-response__identity"><span><Sparkles size={12} /></span><b>NeuralKinetics</b><small>Generated answer</small></div>
                <p>Annual plans are eligible for a refund within <strong>14 days of the initial purchase</strong>, provided the account has not exceeded the usage threshold.</p>
                <p>After the 14-day period, subscriptions remain active until the end of the billing term and are not prorated.</p>
                <div className="answer-confidence"><ShieldCheck size={13} /><span>Answer grounded in your sources</span><b>98% match</b></div>
                <div className="answer-citations">
                  <div className="answer-citations__heading"><span>3 SOURCES USED</span><span>View all <ArrowUpRight size={10} /></span></div>
                  <div className="citation-row"><span className="citation-row__file">PDF</span><span><b>Product handbook</b><small>Section 08 · Refunds & cancellations</small></span><span className="citation-row__page">p. 24</span><ArrowUpRight size={12} /></div>
                  <div className="citation-row"><span className="citation-row__file citation-row__file--doc">DOC</span><span><b>Support playbook</b><small>Annual subscription policy</small></span><span className="citation-row__page">p. 06</span><ArrowUpRight size={12} /></div>
                </div>
              </div>
            </div>
            <div className="assistant-composer">
              <span>Ask anything about your knowledge...</span>
              <div><span><Plus size={14} /></span><button type="button" aria-label="Send message"><ArrowUpRight size={15} /></button></div>
            </div>
            <div className="assistant-panel__foot"><LockKeyhole size={10} /> Your data is private and secure</div>
          </section>
        </div>
      </div>

      <motion.div
        className="floating-insight floating-insight--top"
        initial={{ opacity: 0, x: 16, y: 8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: .85, duration: .7, ease: EASE }}
      >
        <span className="floating-insight__icon"><Check size={14} /></span>
        <span><b>Source verified</b><small>Every answer, traceable</small></span>
      </motion.div>
      <motion.div
        className="floating-insight floating-insight--bottom"
        initial={{ opacity: 0, x: -14, y: 8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1, duration: .7, ease: EASE }}
      >
        <span className="floating-insight__metric">03</span>
        <span><b>Connected sources</b><small>One searchable knowledge base</small></span>
      </motion.div>
    </motion.div>
  )
}

export default function Hero2() {
  return (
    <div className="hero2-page">
      <motion.nav
        className="hero2-nav"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .7, ease: EASE }}
      >
        <div className="hero2-nav__left">
          <a href="/" className="hero2-logo" aria-label="NeuralKinetics home">
            <LogoIcon />
            <span>NeuralKinetics</span>
          </a>
          <span className="hero2-nav__divider" />
          <span className="hero2-nav__descriptor">Knowledge infrastructure</span>
        </div>
        <div className="hero2-nav__right">
          <a href="#platform" className="hero2-nav__link">Platform</a>
          <a href="#how-it-works" className="hero2-nav__link">How it works</a>
          <a href="#security" className="hero2-nav__link">Security</a>
          <a href="#get-started" className="hero2-nav__cta">Get started <ArrowUpRight size={14} /></a>
        </div>
      </motion.nav>

      <main className="hero2-main">
        <section className="hero2-copy" aria-labelledby="hero2-title">
          <motion.div
            className="hero2-copy__content"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .08, duration: .85, ease: EASE }}
          >
            <div className="hero2-kicker"><span className="hero2-kicker__line" /> THE KNOWLEDGE LAYER FOR YOUR BUSINESS</div>
            <h1 id="hero2-title">Your knowledge.<br /><span>Finally useful.</span></h1>
            <p className="hero2-description">
              Bring your documents, data, and internal expertise together. Give your team an AI assistant that answers with context—and shows exactly where it found the answer.
            </p>
            <div className="hero2-actions" id="get-started">
              <a className="hero2-button hero2-button--solid" href="#platform">Build your knowledge base <ArrowUpRight size={16} /></a>
              <a className="hero2-button hero2-button--text" href="#how-it-works"><span className="hero2-play"><span /></span> See how it works</a>
            </div>
            <div className="hero2-trust">
              <div className="hero2-trust__avatars"><span>N</span><span>A</span><span>+</span></div>
              <span>Built for teams that need <b>answers they can trust.</b></span>
            </div>
          </motion.div>
          <div className="hero2-side-note">
            <span className="hero2-side-note__index">01 / 03</span>
            <span>From scattered information<br />to confident decisions.</span>
          </div>
        </section>

        <ProductPreview />
      </main>

      <footer className="hero2-bottom" id="platform">
        <div className="hero2-bottom__statement"><span className="hero2-bottom__dot" /> ONE KNOWLEDGE BASE. MANY WAYS TO USE IT.</div>
        <div className="hero2-capabilities">
          <span><FileText size={13} /> Your documents</span>
          <i />
          <span><Search size={13} /> Intelligent retrieval</span>
          <i />
          <span><ShieldCheck size={13} /> Verifiable answers</span>
          <i />
          <span><LockKeyhole size={13} /> Private by design</span>
        </div>
      </footer>
    </div>
  )
}
