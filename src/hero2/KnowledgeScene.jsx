import { motion } from 'motion/react'
import { FileText, FileSpreadsheet, Image as ImageIcon, Search, ShieldCheck, Sparkles, ArrowUpRight } from 'lucide-react'

const docs = [
  { name: 'Product handbook', meta: 'PDF · 2.4 MB', icon: FileText },
  { name: 'Q3 revenue data', meta: 'XLSX · 840 KB', icon: FileSpreadsheet },
  { name: 'Brand guidelines', meta: 'DOCX · 1.1 MB', icon: FileText },
]

function DocumentStack() {
  return (
    <div className="knowledge-docs" aria-label="Uploaded documents">
      <div className="knowledge-docs__stack" aria-hidden="true">
        <div className="knowledge-doc knowledge-doc--back"><span /><span /><span /></div>
        <div className="knowledge-doc knowledge-doc--middle"><span /><span /><span /><span /></div>
        <div className="knowledge-doc knowledge-doc--front">
          <div className="knowledge-doc__fold" />
          <FileText size={25} strokeWidth={1.4} />
          <span className="knowledge-doc__rule knowledge-doc__rule--wide" />
          <span className="knowledge-doc__rule" />
          <span className="knowledge-doc__rule knowledge-doc__rule--short" />
          <small>PDF</small>
        </div>
      </div>
      <div className="knowledge-docs__caption">
        <span className="knowledge-eyebrow">01 / INGEST</span>
        <strong>Your content</strong>
        <span>Documents, files and data</span>
      </div>
    </div>
  )
}

function KnowledgeCore() {
  return (
    <div className="knowledge-core-wrap" aria-label="Knowledge processing engine">
      <div className="knowledge-core__orbit knowledge-core__orbit--one" />
      <div className="knowledge-core__orbit knowledge-core__orbit--two" />
      <div className="knowledge-core">
        <div className="knowledge-core__ring knowledge-core__ring--outer" />
        <div className="knowledge-core__ring knowledge-core__ring--inner" />
        <div className="knowledge-core__mark">
          <span /><span /><span /><span /><span /><span /><span />
        </div>
        <div className="knowledge-core__pulse" />
      </div>
      <div className="knowledge-core__caption">
        <span className="knowledge-eyebrow">02 / UNDERSTAND</span>
        <strong>Knowledge engine</strong>
        <span>Extract · Index · Connect</span>
      </div>
    </div>
  )
}

function AnswerCard() {
  return (
    <div className="knowledge-answer-wrap" aria-label="Source-backed AI answer">
      <div className="knowledge-question">
        <span className="knowledge-question__avatar">Y</span>
        <span>What are our key product principles?</span>
      </div>
      <div className="knowledge-answer">
        <div className="knowledge-answer__top">
          <span className="knowledge-answer__brand"><span /> KNOWLEDGE AI</span>
          <span className="knowledge-answer__verified"><ShieldCheck size={12} /> VERIFIED</span>
        </div>
        <strong>Three principles guide the product.</strong>
        <div className="knowledge-answer__line knowledge-answer__line--long" />
        <div className="knowledge-answer__line knowledge-answer__line--medium" />
        <div className="knowledge-answer__line knowledge-answer__line--short" />
        <div className="knowledge-source">
          <span className="knowledge-source__icon"><FileText size={12} /></span>
          <span><b>Product principles.pdf</b><small>Page 04 · Source citation</small></span>
          <ArrowUpRight size={13} />
        </div>
      </div>
      <div className="knowledge-answer__caption">
        <span className="knowledge-eyebrow">03 / RESPOND</span>
        <strong>Answers you can trust</strong>
        <span>Every answer links to its source</span>
      </div>
    </div>
  )
}

export default function KnowledgeScene() {
  return (
    <motion.section
      className="knowledge-scene"
      aria-label="How NeuralKinetics turns documents into source-backed answers"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="knowledge-scene__head">
        <div>
          <span className="knowledge-eyebrow">THE KNOWLEDGE PIPELINE</span>
          <strong>From scattered information to clear answers.</strong>
        </div>
        <span className="knowledge-live"><i /> SYSTEM FLOW</span>
      </div>

      <div className="knowledge-flow">
        <svg className="knowledge-flow__connectors" viewBox="0 0 720 340" preserveAspectRatio="none" aria-hidden="true">
          <path className="knowledge-flow__path" d="M105 148 C165 148 174 92 238 92 S314 148 360 148 S450 204 510 204 S590 148 650 148" />
          <path className="knowledge-flow__path knowledge-flow__path--dash" d="M105 148 C165 148 174 92 238 92 S314 148 360 148 S450 204 510 204 S590 148 650 148" />
          <circle cx="105" cy="148" r="4" />
          <circle cx="360" cy="148" r="4" />
          <circle cx="650" cy="148" r="4" />
        </svg>
        <DocumentStack />
        <KnowledgeCore />
        <AnswerCard />
      </div>

      <div className="knowledge-scene__footer">
        <span><b>01</b> INGEST</span><i />
        <span><b>02</b> UNDERSTAND</span><i />
        <span><b>03</b> RESPOND</span>
        <small>PRIVATE BY DESIGN <ShieldCheck size={12} /></small>
      </div>
    </motion.section>
  )
}
