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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 'clamp(260px, 32vw, 430px)',
          aspectRatio: '926 / 1500',
          flex: '0 1 auto',
        }}
      >
        <img
          src={handImage}
          alt=""
          aria-hidden="true"
          draggable="false"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />

        <AiBotAvatar
          className="hero3-empty__avatar"
          size={240}
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
