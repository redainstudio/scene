import './index.css'
import './hero3/hero3.css'
import { AiBotAvatar } from './hero3/AiBotAvatar'
import handImage from './Mechanical Hand Technical Sketch (1).png'

const facePlatePoints = '105,10 155,28 190,68 190,122 155,162 105,180 55,162 20,122 20,68 55,28'
const faceInnerPoints = '105,24 145,39 176,73 176,117 145,151 105,166 65,151 34,117 34,73 65,39'

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
            width: 210,
            height: 210,
            zIndex: 2,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <svg
            viewBox="0 0 210 190"
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              overflow: 'visible',
              pointerEvents: 'none',
            }}
          >
            <polygon
              points={facePlatePoints}
              transform="translate(0 5)"
              fill="#ffffff"
              stroke="#111111"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <polygon
              points={faceInnerPoints}
              transform="translate(0 5)"
              fill="none"
              stroke="#777777"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {[
              [105, 10, 105, 24], [155, 28, 145, 39], [190, 68, 176, 73],
              [190, 122, 176, 117], [155, 162, 145, 151], [105, 180, 105, 166],
              [55, 162, 65, 151], [20, 122, 34, 117], [20, 68, 34, 73], [55, 28, 65, 39],
            ].map(([x1, y1, x2, y2], i) => (
              <line
                key={i}
                x1={x1}
                y1={y1 + 5}
                x2={x2}
                y2={y2 + 5}
                stroke="#333333"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            ))}
            {[
              [105, 16], [174, 48], [184, 139], [105, 174],
              [26, 139], [36, 48],
            ].map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy + 5} r="3.2" fill="#ffffff" stroke="#111111" strokeWidth="1.4" />
                <circle cx={cx} cy={cy + 5} r="0.9" fill="#111111" />
              </g>
            ))}
          </svg>

          <AiBotAvatar
            className="hero3-empty__avatar"
            size={160}
            shape="mechanical"
            colors={['#ffffff', '#ffffff']}
            outline="#101010"
            outlineWidth={0.8}
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
