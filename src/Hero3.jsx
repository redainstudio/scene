import './index.css'
import './hero3/hero3.css'
import { AiBotAvatar } from './hero3/AiBotAvatar'
import handImage from './Mechanical Hand Technical Sketch (1).png'

const polar = (radius, angle) => ({
  x: 170 + radius * Math.cos(angle),
  y: 170 + radius * Math.sin(angle),
})

const armorSegments = Array.from({ length: 10 }, (_, index) => {
  const sector = (Math.PI * 2) / 10
  const start = index * sector + 0.035
  const end = (index + 1) * sector - 0.035
  const outerStart = polar(169, start)
  const outerEnd = polar(169, end)
  const innerEnd = polar(147, end)
  const innerStart = polar(147, start)
  const mid = (start + end) / 2
  const seam = polar(157, mid)
  const screw = polar(160, mid)

  return {
    key: index,
    path: `M ${outerStart.x} ${outerStart.y} A 169 169 0 0 1 ${outerEnd.x} ${outerEnd.y} L ${innerEnd.x} ${innerEnd.y} A 147 147 0 0 0 ${innerStart.x} ${innerStart.y} Z`,
    seam: {
      x1: seam.x,
      y1: seam.y,
      x2: 170 + 147 * Math.cos(mid),
      y2: 170 + 147 * Math.sin(mid),
    },
    screw,
  }
})

export default function Hero3() {
  return (
    <main
      className="hero3-empty"
      aria-label="AI bot hero"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
        display: 'block',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 0,
          transform: 'translateX(-50%)',
          width: 'clamp(260px, 32vw, 430px)',
          aspectRatio: '926 / 1500',
        }}
      >
        <img
          src={handImage}
          alt=""
          aria-hidden="true"
          draggable="false"
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            display: 'block',
            width: 'auto',
            height: '100%',
            maxWidth: 'none',
            objectFit: 'contain',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: '52%',
            top: '59%',
            width: 340,
            height: 340,
            zIndex: 2,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        >
          <svg
            viewBox="0 0 340 340"
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              overflow: 'visible',
            }}
          >
            <defs>
              <linearGradient id="palm-armor" x1="0" y1="0" x2="0.8" y2="1">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="0.58" stopColor="#f5f5f5" />
                <stop offset="1" stopColor="#dedede" />
              </linearGradient>
              <filter id="palm-armor-shadow" x="-20%" y="-20%" width="140%" height="150%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="blur" />
                <feOffset dy="2.5" result="offset" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.22" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g filter="url(#palm-armor-shadow)">
              {armorSegments.map((segment) => (
                <g key={segment.key}>
                  <path
                    d={segment.path}
                    fill="url(#palm-armor)"
                    stroke="#292929"
                    strokeWidth="0.85"
                    strokeLinejoin="round"
                  />
                  <line
                    x1={segment.seam.x1}
                    y1={segment.seam.y1}
                    x2={segment.seam.x2}
                    y2={segment.seam.y2}
                    stroke="#777777"
                    strokeWidth="0.65"
                    opacity="0.85"
                  />
                  <circle
                    cx={segment.screw.x}
                    cy={segment.screw.y}
                    r="2.15"
                    fill="#ffffff"
                    stroke="#292929"
                    strokeWidth="0.85"
                  />
                  <circle
                    cx={segment.screw.x}
                    cy={segment.screw.y}
                    r="0.55"
                    fill="#555555"
                  />
                </g>
              ))}
            </g>
          </svg>

          <AiBotAvatar
            className="hero3-empty__avatar"
            size={240}
            shape="plate"
            colors={['#ffffff', '#e6e6e6']}
            outline="#292929"
            outlineWidth={0.12}
            emotion="happy"
            activity="idle"
            lookAround
            followCursor
            hoverGiggle
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              zIndex: 2,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      </div>
    </main>
  )
}
