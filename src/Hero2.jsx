import { motion } from 'motion/react'
import {
  ArrowUpRight, FileText, FileSpreadsheet, Globe2, Database, ShieldCheck,
  Sparkles, LockKeyhole, Search, MessageSquareText, ArrowDownRight
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

function SourceCard({ icon: Icon, type, title, detail, index }) {
  return (
    <motion.div
      className={`source-card source-card--${index}`}
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: .4 + index * .12, duration: .7, ease: EASE }}
    >
      <span className="source-card__icon"><Icon size={16} strokeWidth={1.7} /></span>
      <span className="source-card__copy"><small>{type}</small><b>{title}</b><em>{detail}</em></span>
      <span className="source-card__check"><span /></span>
    </motion.div>
  )
}

function KnowledgeMap() {
  const nodes = [
    [230, 35, 'POLICY'], [318, 62, 'PRODUCT'], [390, 120, 'SUPPORT'], [362, 220, 'CUSTOMERS'],
    [280, 270, 'BILLING'], [160, 240, 'GUIDES'], [92, 158, 'OPERATIONS'], [135, 82, 'SALES'],
    [230, 145, ''], [290, 166, ''], [202, 205, ''], [122, 185, ''], [330, 92, ''],
    [390, 195, ''], [255, 225, ''], [175, 112, ''], [76, 115, ''], [310, 30, ''],
    [415, 65, ''], [65, 225, ''], [230, 305, ''], [340, 290, ''], [420, 265, ''],
  ]
  const links = [[0,8],[0,15],[1,8],[1,12],[1,17],[2,9],[2,12],[2,13],[3,9],[3,13],[3,21],[4,10],[4,14],[4,20],[4,21],[5,10],[5,11],[5,14],[6,11],[6,16],[6,19],[7,15],[7,16],[8,9],[8,10],[8,15],[9,12],[9,13],[9,14],[10,11],[10,14],[11,19],[12,18],[13,22],[14,20],[14,21],[17,18],[20,21],[21,22]]
  return (
    <div className="knowledge-map">
      <div className="knowledge-map__halo knowledge-map__halo--one" />
      <div className="knowledge-map__halo knowledge-map__halo--two" />
      <svg viewBox="0 0 470 340" className="knowledge-map__svg" role="img" aria-label="Connected knowledge graph linking business information">
        <defs>
          <linearGradient id="map-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".08" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".42" />
            <stop offset="1" stopColor="#fff" stopOpacity=".08" />
          </linearGradient>
          <radialGradient id="map-core"><stop stopColor="#fff" stopOpacity=".22" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
        </defs>
        {links.map(([a,b], i) => <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} className="knowledge-map__edge" />)}
        <circle cx="245" cy="170" r="122" fill="url(#map-core)" />
        {nodes.map(([x,y,label], i) => (
          <g key={i} className={`knowledge-map__node ${label ? 'knowledge-map__node--label' : ''}`}>
            <circle cx={x} cy={y} r={label ? 4.3 : 2.8} />
            {label && <text x={x + (x > 340 ? -9 : 9)} y={y - 9} textAnchor={x > 340 ? 'end' : 'start'}>{label}</text>}
          </g>
        ))}
        <circle className="knowledge-map__pulse" cx="245" cy="170" r="24" />
        <circle cx="245" cy="170" r="7" className="knowledge-map__center" />
        <path className="knowledge-map__signal" d="M20 158 C95 158 105 100 174 114 S272 210 340 177 S400 150 455 152" />
      </svg>
      <div className="knowledge-map__caption"><span className="knowledge-map__caption-dot" /> LIVE KNOWLEDGE GRAPH <span>23 ENTITIES · 39 RELATIONSHIPS</span></div>
      <div className="knowledge-map__core-label"><span>NK</span><b>NEURAL INDEX</b><small>SEMANTIC RELATIONSHIPS</small></div>
    </div>
  )
}

function AnswerPreview() {
  return (
    <motion.div
      className="answer-preview"
      initial={{ opacity: 0, x: 20, y: 5 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: .9, duration: .8, ease: EASE }}
    >
      <div className="answer-preview__top"><span><Sparkles size={13} /> KNOWLEDGE ASSISTANT</span><i /></div>
      <div className="answer-preview__question">How does our annual refund policy work?</div>
      <div className="answer-preview__answer">Annual plans can be refunded within <b>14 days of purchase</b>, according to your billing policy.</div>
      <div className="answer-preview__sources">
        <span className="answer-preview__source-icon"><FileText size={12} /></span>
        <span><b>Product handbook</b><small>Refunds & cancellations · p. 24</small></span>
        <ArrowUpRight size={12} />
      </div>
      <div className="answer-preview__verified"><ShieldCheck size={13} /> ANSWER VERIFIED AGAINST SOURCE</div>
    </motion.div>
  )
}

export default function Hero2() {
  return (
    <div className="hero2-page">
      <motion.nav className="hero2-nav" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, ease: EASE }}>
        <a href="/" className="hero2-logo" aria-label="NeuralKinetics home"><LogoIcon /><span>NeuralKinetics</span></a>
        <div className="hero2-nav__center"><span /> YOUR BUSINESS, CONNECTED</div>
        <div className="hero2-nav__right">
          <a href="#platform">Platform</a>
          <a href="#security">Security</a>
          <a className="hero2-nav__cta" href="#get-started">Get started <ArrowUpRight size={14} /></a>
        </div>
      </motion.nav>

      <main className="hero2-main">
        <motion.section className="hero2-intro" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08, duration: .8, ease: EASE }}>
          <div className="hero2-intro__left">
            <div className="hero2-kicker"><span /> YOUR BUSINESS HAS THE ANSWERS.</div>
            <h1>Make all of it<br /><em>work together.</em></h1>
          </div>
          <div className="hero2-intro__right">
            <p>Turn scattered documents, data, and team knowledge into one intelligent source of truth. Ask a question. Get an answer you can trace back to where it came from.</p>
            <div className="hero2-actions" id="get-started">
              <a className="hero2-button hero2-button--solid" href="#platform">Build your knowledge base <ArrowUpRight size={16} /></a>
              <a className="hero2-button hero2-button--quiet" href="#how-it-works">Explore the platform <ArrowUpRight size={14} /></a>
            </div>
            <div className="hero2-proof"><LockKeyhole size={12} /> PRIVATE BY DESIGN <i /> SOURCE-GROUNDED <i /> BUILT FOR TEAMS</div>
          </div>
        </motion.section>

        <motion.section className="knowledge-experience" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .22, duration: .95, ease: EASE }} aria-label="How NeuralKinetics connects business knowledge to verified answers">
          <div className="knowledge-experience__top">
            <span><i /> THE KNOWLEDGE ENGINE</span>
            <span>FROM SCATTERED INFORMATION TO CLEAR ANSWERS <b>↗</b></span>
          </div>
          <div className="knowledge-experience__body">
            <div className="source-stack">
              <div className="source-stack__heading"><span>01</span><b>YOUR SOURCES</b><small>Bring knowledge together</small></div>
              <SourceCard index={1} icon={FileText} type="DOCUMENTS" title="Product handbook" detail="PDF · DOCX · 24 pages" />
              <SourceCard index={2} icon={FileSpreadsheet} type="STRUCTURED DATA" title="Customer records" detail="CSV · SPREADSHEETS" />
              <SourceCard index={3} icon={Globe2} type="CONNECTED TOOLS" title="Support workspace" detail="WEB · API · CRM" />
              <div className="source-stack__more"><span>+</span> Connect another source</div>
            </div>
            <div className="knowledge-map-wrap">
              <div className="knowledge-map-wrap__label"><span>02</span><b>CONNECT THE CONTEXT</b></div>
              <KnowledgeMap />
            </div>
            <div className="answer-stack">
              <div className="answer-stack__heading"><span>03</span><b>GET GROUNDED ANSWERS</b></div>
              <AnswerPreview />
              <div className="answer-stack__note"><ShieldCheck size={13} /> Every response links back to its source.</div>
            </div>
            <svg className="knowledge-experience__flow" viewBox="0 0 1200 360" preserveAspectRatio="none" aria-hidden="true">
              <path d="M250 178 C330 178 350 178 430 178" />
              <path d="M790 178 C860 178 890 178 950 178" />
              <circle r="3"><animateMotion dur="4.8s" repeatCount="indefinite" path="M250 178 C330 178 350 178 430 178" /></circle>
              <circle r="3"><animateMotion dur="5.4s" begin="1s" repeatCount="indefinite" path="M790 178 C860 178 890 178 950 178" /></circle>
            </svg>
          </div>
          <div className="knowledge-experience__bottom">
            <span><Database size={12} /> DOCUMENTS + DATA + TOOLS</span>
            <span className="knowledge-experience__bottom-center">ONE SEARCHABLE KNOWLEDGE LAYER</span>
            <span><MessageSquareText size={12} /> CONTEXTUAL, TRACEABLE ANSWERS</span>
          </div>
        </motion.section>
      </main>

      <footer className="hero2-bottom" id="platform">
        <span>NEURALKINETICS <b>© 2026</b></span>
        <div><span>CONNECTED KNOWLEDGE</span><i /><span>VERIFIABLE ANSWERS</span><i /><span id="security">PRIVATE BY DEFAULT</span></div>
      </footer>
    </div>
  )
}
