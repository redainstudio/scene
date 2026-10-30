import { motion } from 'motion/react'
import { FileText, FileSpreadsheet, Layers3, Search, Sparkles, ShieldCheck, ArrowUpRight, Check } from 'lucide-react'

const float = (distance = 10, duration = 5, delay = 0) => ({
  y: [0, -distance, 0],
  transition: { duration, delay, repeat: Infinity, ease: 'easeInOut' },
})

function OrbitLines() {
  return (
    <svg className="h2-orbit-art" viewBox="0 0 760 690" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="h2-line" x1="100" y1="100" x2="660" y2="590" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8D85FF" stopOpacity=".08" />
          <stop offset=".5" stopColor="#7065F4" stopOpacity=".62" />
          <stop offset="1" stopColor="#8D85FF" stopOpacity=".08" />
        </linearGradient>
        <radialGradient id="h2-halo">
          <stop stopColor="#776CF7" stopOpacity=".2" />
          <stop offset="1" stopColor="#776CF7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="380" cy="345" r="278" stroke="#E8E7F2" strokeDasharray="2 9" />
      <circle cx="380" cy="345" r="225" stroke="#E8E7F2" strokeDasharray="3 8" />
      <circle cx="380" cy="345" r="170" stroke="#EFEEF5" />
      <ellipse cx="380" cy="345" rx="286" ry="116" transform="rotate(-32 380 345)" stroke="url(#h2-line)" strokeDasharray="5 8" />
      <ellipse cx="380" cy="345" rx="286" ry="116" transform="rotate(48 380 345)" stroke="url(#h2-line)" strokeDasharray="5 8" />
      <circle cx="380" cy="345" r="210" fill="url(#h2-halo)" />
      <path d="M130 245C218 264 251 306 315 333" stroke="url(#h2-line)" strokeWidth="1.4" />
      <path d="M490 322C565 274 593 236 650 210" stroke="url(#h2-line)" strokeWidth="1.4" />
      <path d="M300 465C255 513 222 542 158 555" stroke="url(#h2-line)" strokeWidth="1.4" />
      <path d="M456 455C510 499 552 532 628 544" stroke="url(#h2-line)" strokeWidth="1.4" />
      <circle cx="130" cy="245" r="4" fill="#8178F8" />
      <circle cx="650" cy="210" r="4" fill="#8178F8" />
      <circle cx="158" cy="555" r="4" fill="#8178F8" />
      <circle cx="628" cy="544" r="4" fill="#8178F8" />
    </svg>
  )
}

function KnowledgeCore() {
  return (
    <div className="h2-core">
      <div className="h2-core__outer-ring" />
      <div className="h2-core__inner-ring" />
      <div className="h2-core__orb">
        <svg viewBox="0 0 300 300" className="h2-core__network" aria-hidden="true">
          <defs>
            <radialGradient id="h2-orb-fill" cx="38%" cy="30%">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset=".58" stopColor="#F1F0FF" />
              <stop offset="1" stopColor="#DCD9FF" />
            </radialGradient>
            <filter id="h2-soft-glow"><feGaussianBlur stdDeviation="9" /></filter>
          </defs>
          <circle cx="150" cy="150" r="126" fill="#756AF5" opacity=".13" filter="url(#h2-soft-glow)" />
          <circle cx="150" cy="150" r="112" fill="url(#h2-orb-fill)" stroke="#BDB8FF" strokeOpacity=".75" />
          <g stroke="#9B95E8" strokeOpacity=".55" strokeWidth="1.2">
            <path d="M67 119L111 77L156 105L205 72L236 126L202 173L225 220L169 235L126 206L76 221L58 166Z" />
            <path d="M67 119L126 206L156 105L202 173L111 77L169 235L236 126L76 221L205 72" />
            <path d="M58 166L156 105L225 220M111 77L202 173L76 221" />
          </g>
          <g fill="#6F64EC">
            <circle cx="67" cy="119" r="4" /><circle cx="111" cy="77" r="4" />
            <circle cx="156" cy="105" r="5" /><circle cx="205" cy="72" r="3.5" />
            <circle cx="236" cy="126" r="4" /><circle cx="202" cy="173" r="5" />
            <circle cx="225" cy="220" r="3.5" /><circle cx="169" cy="235" r="4" />
            <circle cx="126" cy="206" r="5" /><circle cx="76" cy="221" r="3.5" />
            <circle cx="58" cy="166" r="3.5" />
          </g>
          <circle cx="150" cy="150" r="27" fill="#fff" fillOpacity=".88" />
          <circle cx="150" cy="150" r="17" fill="#6F64EC" />
          <path d="M143 150L148 155L158 144" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <motion.div className="h2-core__satellite h2-core__satellite--one" animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}>
        <span />
      </motion.div>
      <motion.div className="h2-core__satellite h2-core__satellite--two" animate={{ rotate: -360 }} transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}>
        <span />
      </motion.div>
      <div className="h2-core__caption"><span /> KNOWLEDGE ENGINE <b>LIVE</b></div>
    </div>
  )
}

export default function Hero2Scene() {
  return (
    <div className="h2-visual" aria-label="Documents flow into a private knowledge engine and become cited answers">
      <div className="h2-visual__ambient h2-visual__ambient--one" />
      <div className="h2-visual__ambient h2-visual__ambient--two" />
      <OrbitLines />
      <KnowledgeCore />

      <motion.div className="h2-float-card h2-source-card" animate={float(9, 5.2, .2)}>
        <div className="h2-card-top"><span className="h2-card-icon h2-card-icon--doc"><FileText size={16} /></span><span className="h2-card-meta">01 / SOURCES</span></div>
        <strong>Your workspace</strong>
        <div className="h2-file-row"><span className="h2-file-type h2-file-type--pdf">PDF</span><span>Product handbook.pdf</span><Check size={13} /></div>
        <div className="h2-file-row"><span className="h2-file-type h2-file-type--sheet"><FileSpreadsheet size={12} /></span><span>Q3 knowledge.xlsx</span><Check size={13} /></div>
        <div className="h2-card-foot"><span className="h2-pulse-dot" /> 24 files connected</div>
      </motion.div>

      <motion.div className="h2-float-card h2-index-card" animate={float(12, 6.1, .8)}>
        <div className="h2-card-top"><span className="h2-card-icon h2-card-icon--layers"><Layers3 size={16} /></span><span className="h2-card-meta">02 / UNDERSTANDING</span></div>
        <strong>Knowledge mapped</strong>
        <div className="h2-index-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <div className="h2-index-labels"><span>Chunks</span><b>1,284</b></div>
        <div className="h2-index-labels"><span>Relationships</span><b>8,920</b></div>
      </motion.div>

      <motion.div className="h2-float-card h2-search-card" animate={float(8, 5.7, .5)}>
        <div className="h2-card-top"><span className="h2-card-icon h2-card-icon--search"><Search size={15} /></span><span className="h2-card-meta">03 / RETRIEVAL</span></div>
        <strong>Relevant context found</strong>
        <div className="h2-match"><span>Semantic match</span><b>98.4%</b></div>
        <div className="h2-match-track"><i /></div>
        <div className="h2-search-tags"><span>Vector</span><span>Keyword</span><span>Reranked</span></div>
      </motion.div>

      <motion.div className="h2-float-card h2-answer-card" animate={float(11, 5.4, 1.1)}>
        <div className="h2-answer-head"><span className="h2-answer-avatar"><Sparkles size={14} /></span><span>KNOWLEDGE AI</span><span className="h2-answer-live">LIVE</span></div>
        <div className="h2-question">What is our refund policy?</div>
        <div className="h2-answer-copy">Customers can request a refund within <b>30 days</b> of purchase, subject to the policy conditions.</div>
        <div className="h2-citation"><span><FileText size={11} /> Policy.pdf · p. 08</span><ArrowUpRight size={12} /></div>
      </motion.div>

      <motion.div className="h2-trust-chip" animate={float(5, 4.6, .4)}>
        <ShieldCheck size={14} /><span>Private by design</span>
      </motion.div>
      <div className="h2-visual__index"><span>01</span><i /> A BETTER WAY TO FIND WHAT YOU KNOW</div>
    </div>
  )
}
