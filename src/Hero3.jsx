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
