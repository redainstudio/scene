import './index.css'
import './hero3/hero3.css'
import { AiBotAvatar } from './hero3/AiBotAvatar'


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
      <style>{`
        .hero3-empty__avatar {
          position: relative;
          z-index: 2;
        }
        @keyframes hero3-hand-rise {
          from { transform: translateY(125px); }
          to { transform: translateY(0); }
        }
        @keyframes hero3-hand-hover {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero3-hand__rise { animation: none !important; }
        }
      `}</style>


      <AiBotAvatar
        className="hero3-empty__avatar"
        size={112}
        emotion="happy"
        activity="idle"
        lookAround
        followCursor
        hoverGiggle
      />
    </main>
  )
}
