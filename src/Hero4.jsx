import { useEffect, useRef } from 'react'
import './index.css'

const SOURCE_URL =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261030_025250_100df7b8-31fd-4614-aa4a-c1b7d5b6b273.png&w=1600&q=85'

const SOURCE_RECTS = {
  LA: [0, 0.06, 0.47, 0.4],
  RA: [0.53, 0.06, 0.47, 0.4],
  LB: [0, 0.55, 0.47, 0.4],
  RB: [0.53, 0.55, 0.47, 0.4],
}

const LOOP = 20
const LEVELS = [0, 0.26, 0.52, 0.78, 1]

function hash(a, b) {
  const value = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
  return value - Math.floor(value)
}

function smooth(edge0, edge1, value) {
  const x = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)))
  return x * x * (3 - 2 * x)
}

function mixAt(t, on, off, duration) {
  return smooth(on, on + duration, t) * (1 - smooth(off, off + duration, t))
}

function makeTile(image, rect) {
  const [x, y, width, height] = rect
  const sourceX = x * image.naturalWidth
  const sourceY = y * image.naturalHeight
  const sourceWidth = width * image.naturalWidth
  const sourceHeight = height * image.naturalHeight
  const tileWidth = 420
  const tileHeight = Math.round(tileWidth * sourceHeight / sourceWidth)
  const canvas = document.createElement('canvas')
  canvas.width = tileWidth
  canvas.height = tileHeight
  const context = canvas.getContext('2d')
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, tileWidth, tileHeight)
  return canvas
}

function drawPair(context, leftTile, rightTile, width, height, time, pose) {
  const portrait = height > width
  const handWidth = width * (portrait ? 0.66 : 0.53)
  const handHeight = handWidth * ((0.4 * 1520) / (0.47 * 2688))
  const centerY = height * (portrait ? 0.66 : 0.54)
  const angle = (Math.PI * 2 * time) / LOOP
  const drawHand = (tile, side, phase) => {
    const reach =
      (0.035 * Math.sin(angle + phase) + 0.012 * Math.sin(2 * angle + 1.3 + phase)) * width
    const scale = 1 + 0.07 * Math.sin(angle + 0.9 + phase)
    const rotation = (side === 'left' ? 1 : -1) * 0.045 * Math.sin(angle + 2.1 + phase)
    const x =
      side === 'left'
        ? reach - width * 0.045
        : width - handWidth + width * 0.045 - reach
    const pivotX = side === 'left' ? 0 : width

    context.save()
    context.translate(pivotX, centerY)
    context.rotate(rotation)
    context.scale(scale, scale)
    context.translate(-pivotX, -centerY)
    context.drawImage(tile, x, centerY - handHeight / 2, handWidth, handHeight)
    context.restore()
  }

  drawHand(pose === 'B' ? leftTile.LB : leftTile.LA, 'left', 0)
  drawHand(pose === 'B' ? rightTile.RB : rightTile.RA, 'right', Math.PI)
}

function PartnerLogo({ name, path }) {
  return (
    <span className="kindred-logo">
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d={path} fill="currentColor" />
      </svg>
      {name}
    </span>
  )
}

export default function Hero4() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const context = canvas.getContext('2d', { alpha: false })
    const image = new Image()
    image.crossOrigin = 'anonymous'

    let frameId = 0
    let startTime = 0
    let disposed = false
    let ready = false
    let width = 0
    let height = 0
    let dpr = 1
    let step = 7
    let rowStep = 14.35
    let cols = 0
    let rows = 0
    let radius = 3.2
    let fieldA
    let fieldB
    let fieldContextA
    let fieldContextB
    let tileSet
    let dataA
    let dataB

    const fontPreconnect = document.createElement('link')
    fontPreconnect.rel = 'preconnect'
    fontPreconnect.href = 'https://fonts.googleapis.com'
    document.head.appendChild(fontPreconnect)

    const fontPreconnectStatic = document.createElement('link')
    fontPreconnectStatic.rel = 'preconnect'
    fontPreconnectStatic.href = 'https://fonts.gstatic.com'
    fontPreconnectStatic.crossOrigin = 'anonymous'
    document.head.appendChild(fontPreconnectStatic)

    const fontLink = document.createElement('link')
    fontLink.rel = 'stylesheet'
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
    document.head.appendChild(fontLink)

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      width = Math.max(1, bounds.width)
      height = Math.max(1, bounds.height)
      dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      step = Math.max(5, width / 205)
      rowStep = step * 2.05
      cols = Math.ceil(width / step)
      rows = Math.ceil(height / rowStep)
      radius = step * 0.46

      fieldA = document.createElement('canvas')
      fieldB = document.createElement('canvas')
      fieldA.width = fieldB.width = cols
      fieldA.height = fieldB.height = rows
      fieldContextA = fieldA.getContext('2d', { willReadFrequently: true })
      fieldContextB = fieldB.getContext('2d', { willReadFrequently: true })
      if (ready) {
        renderFrame(0)
      }
    }

    const drawField = (fieldContext, leftTile, rightTile, time, pose) => {
      fieldContext.setTransform(1, 0, 0, 1, 0, 0)
      fieldContext.fillStyle = '#fff'
      fieldContext.fillRect(0, 0, cols, rows)
      fieldContext.setTransform(cols / width, 0, 0, rows / height, 0, 0)
      drawPair(fieldContext, leftTile, rightTile, width, height, time, pose)
    }

    const renderFrame = (rawTime) => {
      if (!ready || disposed || !fieldContextA || !fieldContextB) return
      const time = ((rawTime % LOOP) + LOOP) % LOOP
      const poseATiles = { LA: tileSet.LA, RA: tileSet.RA }
      const poseBTiles = { LB: tileSet.LB, RB: tileSet.RB }

      drawField(fieldContextA, poseATiles, poseATiles, time, 'A')
      drawField(fieldContextB, poseBTiles, poseBTiles, time, 'B')
      dataA = fieldContextA.getImageData(0, 0, cols, rows).data
      dataB = fieldContextB.getImageData(0, 0, cols, rows).data

      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.fillStyle = '#f7f7f5'
      context.fillRect(0, 0, width, height)
      context.fillStyle = '#0d0d0d'

      const leftMix = mixAt(time, 6.2, 14.6, 1.6)
      const rightMix = mixAt(time, 2.4, 10.4, 1.6)
      const tick = Math.floor(time * 7)
      const portrait = height > width
      const quietCenterY = portrait ? 0.33 : 0.385
      const quietWidth = portrait ? 0.44 : 0.2

      for (let j = 0; j < rows; j += 1) {
        const rowGlitch = hash(j, tick) > 0.965
        const shift = rowGlitch ? Math.round((hash(tick, j) - 0.5) * 8) : 0
        const y = (j + 0.5) * rowStep
        const normalizedY = y / height
        const ey = (normalizedY - quietCenterY) / 0.085

        for (let i = 0; i < cols; i += 1) {
          const seed = 0.55 * hash(i, j) + 0.45 * hash(j * 3.1, 7.7)
          const mix = i < cols / 2 ? leftMix : rightMix
          const sampleI = Math.max(0, Math.min(cols - 1, i - shift))
          const offset = (j * cols + sampleI) * 4
          const useB = seed < mix
          const luminance = (useB ? dataB : dataA)[offset] / 255
          let value = Math.max(0, Math.min(1, (1 - luminance - 0.16) / 0.42))
          if (value <= 0) continue

          value *= 0.86 + 0.14 * Math.sin(time * 3.2 + seed * 40)
          const centerX = Math.abs((i + 0.5) / cols - 0.5)
          value *= smooth(0.035, 0.11, centerX)
          const ex = centerX / quietWidth
          value *= smooth(0.85, 1.25, Math.hypot(ex, ey))

          if (mix > 0.001 && mix < 0.999 && Math.abs(seed - mix) < 0.12) {
            value *= Math.abs(seed - mix) / 0.12
            if (hash(i + tick, j) <= 0.4) value *= 0.3
          }

          let level = 0
          for (let k = LEVELS.length - 1; k >= 1; k -= 1) {
            if (value >= LEVELS[k] - 0.13) {
              level = LEVELS[k]
              break
            }
          }
          if (!level) continue

          const dotRadius = level === 0.26 ? radius * 0.38 : radius * level
          const x = (i + 0.5) * step
          context.beginPath()
          context.arc(x, y, dotRadius, 0, Math.PI * 2)
          context.fill()
        }
      }
    }

    const animate = (now) => {
      if (disposed) return
      if (!startTime) startTime = now
      renderFrame((now - startTime) / 1000)
      frameId = window.requestAnimationFrame(animate)
    }

    const handleImageLoad = () => {
      if (disposed) return
      try {
        tileSet = Object.fromEntries(
          Object.entries(SOURCE_RECTS).map(([key, rect]) => [key, makeTile(image, rect)]),
        )
        ready = true
        resize()
        startTime = performance.now()
        frameId = window.requestAnimationFrame(animate)
      } catch (error) {
        console.error('Kindred halftone image could not be processed.', error)
      }
    }

    const handleImageError = () => {
      console.error('Kindred hand source image failed to load. Check the image URL and CORS access.')
      context.fillStyle = '#f7f7f5'
      context.fillRect(0, 0, canvas.width, canvas.height)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    window.addEventListener('resize', resize)
    image.addEventListener('load', handleImageLoad, { once: true })
    image.addEventListener('error', handleImageError, { once: true })
    image.src = SOURCE_URL
    resize()

    const deterministicRender = (time) => renderFrame(Number(time) || 0)
    window.__render = deterministicRender

    return () => {
      disposed = true
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', resize)
      image.removeEventListener('load', handleImageLoad)
      image.removeEventListener('error', handleImageError)
      fontPreconnect.remove()
      fontPreconnectStatic.remove()
      fontLink.remove()
      if (window.__render === deterministicRender) delete window.__render
    }
  }, [])

  return (
    <main className="kindred-hero">
      <canvas ref={canvasRef} className="kindred-dots" aria-hidden="true" />

      <nav className="kindred-nav" aria-label="Main navigation">
        <a className="kindred-brand" href="#" aria-label="Kindred home">
          <svg viewBox="0 0 16 18" aria-hidden="true">
            <path d="M2 0h4v18H2zM7 9c3-1 5-4 6-9h3c-1 5-3 8-6 9 3 1 5 4 6 9h-3c-1-5-3-8-6-9z" />
          </svg>
          <span>Kindred</span>
        </a>
        <div className="kindred-links">
          <a href="#platform">Platform</a>
          <a href="#marketplace">Marketplace</a>
          <a href="#creators">Creators</a>
          <a href="#resources">Resources</a>
          <a href="#company">Company</a>
        </div>
        <a className="kindred-signin" href="#signin">Sign In</a>
      </nav>

      <section className="kindred-copy">
        <h1>
          <span>Reconnecting</span>
          Human Creativity.
        </h1>
        <p>We’re not building another platform. We’re building a place where people belong.</p>
        <div className="kindred-cta-wrap">
          <a className="kindred-cta" href="#join">Join the circle</a>
        </div>
      </section>

      <div className="kindred-logos" aria-label="Community partners">
        <PartnerLogo name="Lumenix" path="M3 15c0-7 5-12 14-12-1 9-6 14-13 13l-1 2-2-1z" />
        <PartnerLogo name="Velora" path="M10 1l8 4.5v9L10 19l-8-4.5v-9zM10 6l-4 2.3v4.4L10 15l4-2.3V8.3z" />
        <PartnerLogo name="Nimbus" path="M1 5q4.5-3 9 0t9 0v3q-4.5 3-9 0t-9 0zm0 7q4.5-3 9 0t9 0v3q-4.5 3-9 0t-9 0z" />
        <PartnerLogo name="Quanta" path="M10 1a9 9 0 110 18 9 9 0 010-18zm0 3a6 6 0 100 12 6 6 0 000-12zm0 3a3 3 0 110 6 3 3 0 010-6z" />
        <PartnerLogo name="Solstice" path="M1 17L7 6l3 5 3-7 6 13z" />
        <PartnerLogo name="Parallax" path="M10 1l9 4-9 4-9-4zm-9 8l9 4 9-4v3l-9 4-9-4zm0 5l9 4 9-4v2l-9 4-9-4z" />
      </div>

      <style>{`
        :root {
          --bg: #f7f7f5;
          --ink: #111111;
          --mute: #9a9a9a;
          --sub: #7b7b7b;
        }
        .kindred-hero, .kindred-hero * { box-sizing: border-box; }
        .kindred-hero {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100svh;
          min-height: 660px;
          overflow: hidden;
          isolation: isolate;
          background: var(--bg);
          color: var(--ink);
          font-family: Inter, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .kindred-dots {
          position: absolute;
          z-index: 1;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
        }
        .kindred-nav {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(18px, 2.6vw, 40px);
          padding: 36px 24px 0;
          font-size: 13.5px;
        }
        .kindred-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-right: 10px;
          color: var(--ink);
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -.01em;
        }
        .kindred-brand svg { width: 16px; height: 18px; fill: currentColor; }
        .kindred-links { display: flex; align-items: center; gap: clamp(18px, 2.6vw, 40px); }
        .kindred-links a {
          color: #3a3a3a;
          text-decoration: none;
          transition: color .2s ease;
        }
        .kindred-links a:hover { color: #000; }
        .kindred-signin {
          margin-left: 10px;
          padding: 10px 21px;
          border-radius: 999px;
          background: #111;
          color: #fff;
          text-decoration: none;
          font-weight: 500;
          transition: transform .25s ease;
        }
        .kindred-signin:hover { transform: translateY(-1px); }
        .kindred-copy {
          position: absolute;
          z-index: 3;
          top: 24.5%;
          left: 50%;
          width: min(92vw, 720px);
          transform: translateX(-50%);
          text-align: center;
        }
        .kindred-copy h1 {
          color: var(--ink);
          font-size: clamp(38px, 3.75vw, 68px);
          font-weight: 500;
          letter-spacing: -.035em;
          line-height: 1.04;
        }
        .kindred-copy h1 span { display: block; color: var(--mute); }
        .kindred-copy p {
          max-width: 340px;
          margin: 20px auto 0;
          color: var(--sub);
          font-size: clamp(13px, 1.02vw, 15.5px);
          line-height: 1.4;
        }
        .kindred-cta-wrap { position: relative; display: inline-block; margin-top: clamp(34px, 3.6vw, 52px); }
        .kindred-cta-wrap::before {
          position: absolute;
          z-index: -1;
          right: 10%;
          bottom: -6px;
          left: 10%;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(90deg, #ffcf5a, #7dffa8, #5ad7ff, #9b7bff, #ff6fd8, #ffb36b);
          filter: blur(9px);
          opacity: .85;
          content: '';
          transition: opacity .3s ease, filter .3s ease, bottom .3s ease;
        }
        .kindred-cta {
          display: inline-block;
          padding: 11px 20px;
          border-radius: 999px;
          background: #111;
          color: #fff;
          font-size: 13.5px;
          font-weight: 500;
          text-decoration: none;
          transition: transform .3s ease;
        }
        .kindred-cta-wrap:hover::before { bottom: -9px; filter: blur(12px); opacity: 1; }
        .kindred-cta-wrap:hover .kindred-cta { transform: translateY(-1px); }
        .kindred-logos {
          position: absolute;
          z-index: 3;
          right: 0;
          bottom: clamp(28px, 6vh, 64px);
          left: 0;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: clamp(26px, 4.6vw, 66px);
          padding: 0 16px;
          color: #8d8d8d;
        }
        .kindred-logo {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: clamp(14px, 1.18vw, 17px);
          font-weight: 500;
          letter-spacing: -.01em;
          white-space: nowrap;
        }
        .kindred-logo svg { width: 17px; height: 17px; flex: 0 0 auto; }
        @media (max-width: 760px) {
          .kindred-nav { justify-content: space-between; padding: 22px 18px 0; }
          .kindred-links { display: none; }
          .kindred-brand { margin-right: auto; }
          .kindred-signin { margin-left: 0; }
          .kindred-copy { top: 20%; }
          .kindred-copy h1 { font-size: clamp(38px, 8vw, 56px); }
          .kindred-logos { gap: 14px 24px; font-size: 13px; }
          .kindred-logo { font-size: 13px; }
        }
        @media (max-width: 420px) {
          .kindred-copy { top: 19%; }
          .kindred-copy p { max-width: 300px; }
          .kindred-logos { bottom: 24px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .kindred-cta, .kindred-cta-wrap::before, .kindred-signin { transition: none; }
        }
      `}</style>
    </main>
  )
}
