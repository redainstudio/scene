import './index.css'
import './hero3/hero3.css'
import { AiBotAvatar } from './hero3/AiBotAvatar'

function GrabbingHand() {
  return (
    <svg
      className="hero3-hand"
      viewBox="0 0 440 520"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <filter id="hero3-hand-glow" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <linearGradient id="hero3-hand-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#fbfaff" />
        </linearGradient>
      </defs>

      {/* Soft halo, matching the brain illustration on the home page */}
      <path
        d="M127 520 C124 464 110 416 91 371 C72 326 68 291 84 261 C96 239 119 231 139 244 C157 256 170 282 182 305 C172 267 164 225 164 186 C164 158 181 141 201 144 C222 147 231 167 230 194 C229 232 238 266 247 295 C246 252 246 205 259 170 C268 145 291 136 310 148 C329 160 329 183 323 211 C316 246 313 278 315 307 C324 281 337 258 358 255 C380 252 396 270 390 295 C382 334 357 370 340 405 C323 442 317 481 319 520 Z"
        fill="none"
        stroke="#8d88d6"
        strokeWidth="9"
        opacity=".2"
        filter="url(#hero3-hand-glow)"
      />

      <g className="hero3-hand__rise">
        {/* One continuous, softly irregular hand silhouette */}
        <path
          className="hero3-hand__outline"
          d="M127 520 C124 464 110 416 91 371 C72 326 68 291 84 261 C96 239 119 231 139 244 C157 256 170 282 182 305 C172 267 164 225 164 186 C164 158 181 141 201 144 C222 147 231 167 230 194 C229 232 238 266 247 295 C246 252 246 205 259 170 C268 145 291 136 310 148 C329 160 329 183 323 211 C316 246 313 278 315 307 C324 281 337 258 358 255 C380 252 396 270 390 295 C382 334 357 370 340 405 C323 442 317 481 319 520 Z"
          fill="url(#hero3-hand-fill)"
          stroke="#514b9b"
          strokeWidth="2.1"
          strokeLinejoin="round"
        />

        {/* Pinching thumb and index finger contours */}
        <path d="M84 262 C108 286 128 312 151 338 C165 354 184 363 205 358" />
        <path d="M139 244 C157 266 173 295 187 324 C195 341 207 351 222 351" />
        <path d="M230 194 C231 237 244 278 259 315 C267 334 281 343 299 338" />
        <path d="M323 211 C316 249 315 285 319 319 C321 339 312 352 294 358" />

        {/* Delicate anatomical folds, drawn like the brain's inner grooves */}
        <path d="M145 390 C165 412 188 421 213 416 C230 412 244 402 254 388" />
        <path d="M124 426 C148 449 177 459 205 453" />
        <path d="M229 449 C252 438 271 418 280 394" />
        <path d="M177 305 C187 321 196 333 211 340" />
        <path d="M247 295 C260 312 275 322 294 324" />
        <path d="M94 315 C105 343 117 361 137 378" />
        <path d="M351 318 C340 344 328 362 309 379" />
        <path d="M182 186 C187 173 199 166 210 172" />
        <path d="M275 184 C285 169 302 168 310 180" />

        {/* Fine sketch marks and small organic details */}
        <path d="M113 278 C124 286 131 298 135 310" />
        <path d="M176 222 C181 240 184 256 184 272" />
        <path d="M207 376 C218 380 229 379 239 373" />
        <path d="M268 238 C272 255 278 270 288 282" />
        <path d="M350 284 C358 292 359 305 355 317" />
        <path d="M157 468 C174 478 192 482 211 480" />
        <path d="M238 475 C258 466 273 453 283 436" />
        <path d="M145 350 C151 357 158 363 166 367" />
        <path d="M294 359 C302 353 309 347 314 338" />

        {/* Tiny ink-like nodes echo the brain's fine details */}
        <g className="hero3-hand__dots">
          <circle cx="105" cy="296" r="1.5" />
          <circle cx="171" cy="202" r="1.4" />
          <circle cx="218" cy="228" r="1.3" />
          <circle cx="279" cy="204" r="1.5" />
          <circle cx="357" cy="339" r="1.4" />
          <circle cx="161" cy="403" r="1.4" />
          <circle cx="265" cy="424" r="1.4" />
          <circle cx="207" cy="458" r="1.2" />
        </g>
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
          bottom: -150px;
          width: clamp(300px, 39vw, 480px);
          height: auto;
          overflow: visible;
          transform: translateX(-50%);
          pointer-events: none;
        }
        .hero3-hand__rise {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: hero3-hand-rise 1.65s cubic-bezier(.2,.8,.2,1) both,
                     hero3-hand-hover 5s ease-in-out 1.65s infinite;
        }
        .hero3-hand__outline {
          fill: url(#hero3-hand-fill);
        }
        .hero3-hand__rise > path:not(.hero3-hand__outline) {
          fill: none;
          stroke: #d5d2e9;
          stroke-width: 1.45;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .hero3-hand__dots {
          fill: #aaa6ce;
          opacity: .8;
        }
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
        @media (max-width: 600px) {
          .hero3-hand {
            width: min(94vw, 390px);
            bottom: -125px;
          }
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
