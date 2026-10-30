import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, LockKeyhole, MoveUpRight } from 'lucide-react'
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

function AsciiField() {
  const canvasRef = useRef(null)
  const pointer = useRef({ x: -1000, y: -1000 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let time = 0
    let last = 0
    const glyphs = ' .·:;+=*xX#%@'
    const fontSize = 10
    const cellW = 7.2
    const cellH = 11.2

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = `${fontSize}px "SFMono-Regular", Consolas, monospace`
      ctx.textBaseline = 'middle'
      draw(0)
    }

    const draw = (delta) => {
      time += delta
      ctx.clearRect(0, 0, width, height)
      const cols = Math.ceil(width / cellW)
      const rows = Math.ceil(height / cellH)
      const cx = width * .52
      const cy = height * .49
      const radius = Math.min(width * .48, height * .48)
      const px = pointer.current.x
      const py = pointer.current.y

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const pxl = x * cellW
          const pyl = y * cellH
          const nx = (pxl - cx) / radius
          const ny = (pyl - cy) / radius
          const r = Math.sqrt(nx * nx + ny * ny)
          const angle = Math.atan2(ny, nx)
          const waveA = Math.sin(r * 17 - time * 1.25 + angle * 2.4)
          const waveB = Math.cos(nx * 9 + ny * 7 + time * .72)
          const ripple = Math.sin(Math.sqrt((pxl - px) ** 2 + (pyl - py) ** 2) * .035 - time * 2)
          const shell = Math.exp(-Math.pow((r - (.56 + .055 * Math.sin(angle * 3 + time * .35))) * 5.4, 2))
          const inner = Math.exp(-r * r * 2.8)
          const strands = Math.max(0, waveA * .5 + waveB * .28 + .22)
          const density = Math.max(0, Math.min(1, shell * .82 + inner * .24 + strands * .17 - Math.max(0, r - 1.08) * 1.9))
          if (density < .13) continue

          const shimmer = .78 + .22 * Math.sin(time * 1.4 + x * .18 + y * .12)
          const local = Math.max(0, ripple) * Math.exp(-Math.sqrt((pxl - px) ** 2 + (pyl - py) ** 2) * .009)
          const value = Math.min(1, density * shimmer + local * .3)
          const index = Math.min(glyphs.length - 1, Math.floor(value * (glyphs.length - 1)))
          const glyph = glyphs[index]
          const alpha = Math.min(.84, .08 + value * .66 + local * .22)
          ctx.fillStyle = `rgba(25,25,28,${alpha})`
          ctx.fillText(glyph, pxl, pyl)

          if (value > .79 && (x + y) % 17 === 0) {
            ctx.fillStyle = `rgba(0,0,0,${.34 + local * .5})`
            ctx.fillRect(pxl + 1, pyl - 1, 2, 2)
          }
        }
      }

      // Fine orbital arcs and moving data markers.
      ctx.save()
      ctx.translate(cx, cy)
      ctx.strokeStyle = 'rgba(30,30,34,.12)'
      ctx.lineWidth = .7
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.ellipse(0, 0, radius * (.39 + i * .16), radius * (.19 + i * .105), -.42 + i * .42, 0, Math.PI * 2)
        ctx.stroke()
      }
      for (let i = 0; i < 7; i++) {
        const a = time * (.18 + i * .012) + i * (Math.PI * 2 / 7)
        const rx = radius * (.66 + (i % 2) * .1)
        const ry = radius * (.39 + (i % 3) * .07)
        const x = Math.cos(a) * rx
        const y = Math.sin(a) * ry
        ctx.beginPath()
        ctx.arc(x, y, i % 3 === 0 ? 2.2 : 1.2, 0, Math.PI * 2)
        ctx.fillStyle = i % 3 === 0 ? 'rgba(15,15,17,.8)' : 'rgba(80,80,85,.52)'
        ctx.fill()
      }
      ctx.restore()
    }

    const tick = (now) => {
      frame = requestAnimationFrame(tick)
      const delta = last ? Math.min((now - last) / 1000, .04) : 0
      last = now
      draw(delta)
    }

    const onPointer = (event) => {
      const rect = canvas.getBoundingClientRect()
      pointer.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }
    const onLeave = () => { pointer.current = { x: -1000, y: -1000 } }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    canvas.addEventListener('pointermove', onPointer)
    canvas.addEventListener('pointerleave', onLeave)
    if (!reduced) frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      canvas.removeEventListener('pointermove', onPointer)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="ascii-field__canvas" aria-label="Animated ASCII knowledge field" role="img" />
}

function FloatingReadout({ className, label, value, detail }) {
  return (
    <div className={`ascii-readout ${className}`}>
      <span className="ascii-readout__label">{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
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
        <a href="/" className="hero2-logo" aria-label="NeuralKinetics home">
          <LogoIcon /><span>NeuralKinetics</span>
        </a>
        <div className="hero2-nav__center"><span className="hero2-nav__pulse" /> KNOWLEDGE ENGINE <span className="hero2-nav__slash">/</span> 01.0</div>
        <div className="hero2-nav__right">
          <a href="#platform">Platform</a>
          <a href="#security">Security</a>
          <a className="hero2-nav__cta" href="#get-started">Get started <ArrowUpRight size={14} /></a>
        </div>
      </motion.nav>

      <main className="hero2-main">
        <motion.section
          className="hero2-copy"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .12, duration: .85, ease: EASE }}
          aria-labelledby="hero2-title"
        >
          <div className="hero2-kicker"><span /> INTELLIGENCE, CONNECTED.</div>
          <h1 id="hero2-title">Make your<br />knowledge <em>think.</em></h1>
          <p className="hero2-description">
            Your information has the answers. NeuralKinetics connects your documents and data to an AI that finds them, understands them, and shows its work.
          </p>
          <div className="hero2-actions" id="get-started">
            <a className="hero2-button hero2-button--solid" href="#platform">Explore the platform <ArrowUpRight size={16} /></a>
            <a className="hero2-button hero2-button--quiet" href="#how-it-works"><span className="hero2-play"><i /></span> See the system</a>
          </div>
          <div className="hero2-footnote"><LockKeyhole size={12} /> PRIVATE BY DESIGN <span /> GROUNDED IN YOUR SOURCES <span /> BUILT TO SCALE</div>
        </motion.section>

        <motion.section
          className="ascii-stage"
          initial={{ opacity: 0, scale: .97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: .18, duration: 1.1, ease: EASE }}
          aria-label="Live ASCII visualization of connected knowledge"
        >
          <div className="ascii-stage__topline">
            <span><i /> LIVE KNOWLEDGE FIELD</span>
            <span>SYS.NODE_001 <b>●</b> ACTIVE</span>
          </div>
          <div className="ascii-stage__visual">
            <div className="ascii-stage__grid" />
            <AsciiField />
            <div className="ascii-stage__crosshair ascii-stage__crosshair--one">+</div>
            <div className="ascii-stage__crosshair ascii-stage__crosshair--two">+</div>
            <FloatingReadout className="ascii-readout--left" label="INPUT STREAM" value="1,284" detail="DOCUMENTS CONNECTED" />
            <FloatingReadout className="ascii-readout--right" label="RETRIEVAL" value="98.4%" detail="SOURCE RELEVANCE" />
            <div className="ascii-stage__core-label"><span>NK</span><i /> KNOWLEDGE GRAPH</div>
            <div className="ascii-stage__coordinates">X 04.821&nbsp;&nbsp; Y 19.204&nbsp;&nbsp; Z 00.018</div>
          </div>
          <div className="ascii-stage__bottomline">
            <span>01 <i /> INGEST</span><span>02 <i /> UNDERSTAND</span><span>03 <i /> RETRIEVE</span><span>04 <i /> RESPOND</span>
          </div>
        </motion.section>
      </main>

      <footer className="hero2-bottom" id="platform">
        <div className="hero2-bottom__left"><span>BUILT FOR KNOWLEDGE THAT MOVES.</span><b>NEURALKINETICS © 2026</b></div>
        <div className="hero2-bottom__right" id="security"><span>SECURE BY DEFAULT</span><span>CONTEXT-AWARE RETRIEVAL</span><span>TRACEABLE ANSWERS</span><MoveUpRight size={13} /></div>
      </footer>
    </div>
  )
}
