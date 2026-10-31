import './index.css'
import './hero3/hero3.css'
import { AiBotAvatar } from './hero3/AiBotAvatar'
import handImage from './Mechanical Hand Technical Sketch (1).png'

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

        <AiBotAvatar
          className="hero3-empty__avatar"
          size={240}
          colors={['#ffffff', '#e9e9e9']}
          outline="#101010"
          outlineWidth={0.18}
          emotion="happy"
          activity="idle"
          lookAround
          followCursor
          hoverGiggle
          style={{
            position: 'absolute',
            left: '52%',
            top: '59%',
            zIndex: 2,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </main>
  )
}
