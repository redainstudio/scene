import { motion } from 'motion/react'
import { ShieldCheck } from 'lucide-react'
import NeuralCanvas from './NeuralCanvas.jsx'

export default function KnowledgeScene() {
  return (
    <motion.section
      id="how-it-works"
      className="knowledge-scene knowledge-scene--animated"
      aria-label="Animated knowledge pipeline showing documents moving through a neural knowledge base into source-backed answers"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="knowledge-scene__head">
        <div>
          <span className="knowledge-eyebrow">THE KNOWLEDGE PIPELINE</span>
          <strong>Watch information become trusted answers.</strong>
        </div>
        <span className="knowledge-live"><i /> LIVE SYSTEM FLOW</span>
      </div>

      <div className="knowledge-canvas-wrap">
        <NeuralCanvas />
      </div>

      <div className="knowledge-scene__footer">
        <span>UPLOAD</span><i />
        <span>PROCESS</span><i />
        <span>UNDERSTAND</span><i />
        <span>ANSWER</span>
        <small><ShieldCheck size={12} /> PRIVATE BY DESIGN</small>
      </div>
    </motion.section>
  )
}
