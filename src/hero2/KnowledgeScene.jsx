import { motion } from 'motion/react'
import NeuralCanvas from './NeuralCanvas.jsx'

export default function KnowledgeScene() {
  return (
    <motion.section
      id="how-it-works"
      className="knowledge-scene knowledge-scene--animated"
      aria-label="Animated knowledge pipeline showing documents being extracted, indexed in a neural knowledge base, retrieved, verified, and returned with citations"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="knowledge-scene__intro">
        <span>THE KNOWLEDGE PIPELINE</span>
        <span className="knowledge-live"><i /> LIVE DATA FLOW</span>
      </div>
      <div className="knowledge-canvas-wrap">
        <NeuralCanvas />
      </div>
    </motion.section>
  )
}
