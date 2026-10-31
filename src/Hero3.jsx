import './index.css'
import './hero3/hero3.css'
import { AiBotAvatar } from './hero3/AiBotAvatar'

function GrabbingHand() {
  return (
    <svg
      className="hero3-hand"
      viewBox="0 0 400 560"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero3-skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7c9a8" />
          <stop offset=".48" stopColor="#e9a77f" />
          <stop offset="1" stopColor="#c97958" />
        </linearGradient>
        <linearGradient id="hero3-finger" x1="0" y1="0" x2="1" y2=".8">
          <stop offset="0" stopColor="#ffdec4" />
          <stop offset=".52" stopColor="#edb18d" />
          <stop offset="1" stopColor="#c97958" />
        </linearGradient>
        <linearGradient id="hero3-palm" x1=".1" y1="0" x2=".9" y2="1">
          <stop offset="0" stopColor="#f8c8a7" />
          <stop offset=".58" stopColor="#e5a17b" />
          <stop offset="1" stopColor="#c87858" />
        </linearGradient>
        <filter id="hero3-hand-shadow" x="-35%" y="-25%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      <ellipse cx="204" cy="492" rx="118" ry="25" fill="#172033" opacity=".13" filter="url(#hero3-hand-shadow)" />

      <g className="hero3-hand__rise">
        {/* Wrist and palm */}
        <path
          d="M145 548 C147 493 138 453 123 411 C104 359 103 315 119 273 C132 239 161 224 198 224 C242 224 273 244 286 280 C302 325 293 374 278 414 C265 451 254 495 258 548 Z"
          fill="url(#hero3-palm)"
          stroke="#bd795d"
          strokeOpacity=".34"
          strokeWidth="3"
        />

        {/* Little finger */}
        <path
          className="hero3-hand__finger hero3-hand__finger--little"
          d="M269 320 C291 300 305 272 310 244 C314 222 331 210 346 219 C361 228 357 249 349 272 C340 302 323 331 296 352"
          fill="url(#hero3-finger)" stroke="#bd795d" strokeOpacity=".4" strokeWidth="3"
        />
        {/* Ring finger */}
        <path
          className="hero3-hand__finger hero3-hand__finger--ring"
          d="M235 286 C251 253 258 218 255 183 C253 159 267 143 285 148 C303 153 305 174 301 199 C297 238 285 278 266 311"
          fill="url(#hero3-finger)" stroke="#bd795d" strokeOpacity=".4" strokeWidth="3"
        />
        {/* Middle finger */}
        <path
          className="hero3-hand__finger hero3-hand__finger--middle"
          d="M190 274 C198 237 199 196 190 161 C184 137 195 119 214 118 C233 117 242 136 241 160 C241 202 237 247 225 286"
          fill="url(#hero3-finger)" stroke="#bd795d" strokeOpacity=".4" strokeWidth="3"
        />
        {/* Index finger */}
        <path
          className="hero3-hand__finger hero3-hand__finger--index"
          d="M148 291 C143 255 130 222 110 195 C96 176 100 155 117 146 C134 137 151 151 162 172 C183 208 194 245 194 282"
          fill="url(#hero3-finger)" stroke="#bd795d" strokeOpacity=".4" strokeWidth="3"
        />
        {/* Thumb curls inward to meet the fingers */}
        <path
          className="hero3-hand__finger hero3-hand__finger--thumb"
          d="M126 350 C95 333 69 310 53 282 C40 260 47 240 65 234 C82 228 96 244 107 262 C120 283 142 296 164 302"
          fill="url(#hero3-finger)" stroke="#bd795d" strokeOpacity=".4" strokeWidth="3"
        />

        {/* Palm highlights and natural crease details */}
        <path d="M143 350 C166 372 211 382 251 354" fill="none" stroke="#b96f53" strokeOpacity=".38" strokeWidth="5" strokeLinecap="round" />
        <path d="M158 407 C183 422 218 423 242 407" fill="none" stroke="#fff0e2" strokeOpacity=".38" strokeWidth="4" strokeLinecap="round" />
        <path d="M122 270 C137 291 150 305 166 313" fill="none" stroke="#fff0e2" strokeOpacity=".42" strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

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
        .hero3-hand {
          position: absolute;
          z-index: 1;
          left: 50%;
          bottom: -78px;
          width: clamp(260px, 36vw, 430px);
          height: auto;
          overflow: visible;
          transform: translateX(-50%);
          pointer-events: none;
        }
        .hero3-hand__rise {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: hero3-hand-rise 1.55s cubic-bezier(.2,.8,.2,1) both, hero3-hand-hover 4.8s ease-in-out 1.55s infinite;
        }
        .hero3-hand__finger {
          transform-box: fill-box;
          transform-origin: 50% 100%;
        }
        .hero3-hand__finger--index { animation: hero3-finger-close 1.1s ease-out 1s both; }
        .hero3-hand__finger--middle { animation: hero3-finger-close 1.1s ease-out 1.08s both; }
        .hero3-hand__finger--ring { animation: hero3-finger-close 1.1s ease-out 1.16s both; }
        .hero3-hand__finger--little { animation: hero3-finger-close 1.1s ease-out 1.24s both; }
        .hero3-hand__finger--thumb { animation: hero3-thumb-close 1.1s ease-out 1.12s both; }
        .hero3-empty__avatar { position: relative; z-index: 2; }
        @keyframes hero3-hand-rise {
          from { transform: translateY(145px); }
          to { transform: translateY(0); }
        }
        @keyframes hero3-hand-hover {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes hero3-finger-close {
          from { rotate: 0deg; }
          to { rotate: -7deg; }
        }
        @keyframes hero3-thumb-close {
          from { rotate: 0deg; }
          to { rotate: 10deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero3-hand__rise, .hero3-hand__finger { animation: none !important; }
        }
        @media (max-width: 600px) {
          .hero3-hand { width: min(82vw, 340px); bottom: -55px; }
        }
      `}</style>

      <GrabbingHand />

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
