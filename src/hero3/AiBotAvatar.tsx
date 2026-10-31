import { useEffect, useId, useRef, type CSSProperties } from "react";
import { AI_BOT_SVG, createAiBot, type AiBot, type AiBotOptions } from "./engine";
import s from "./AiBotAvatar.module.css";

export {
  AI_BOT_EMOTIONS, AI_BOT_MOTIONS, AI_BOT_SHAPES,
  type AiBotActivity, type AiBotEmotion, type AiBotMotion, type AiBotShape,
} from "./engine";

export interface AiBotAvatarProps extends AiBotOptions {
  colors?: readonly [string, string];
  size?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export function AiBotAvatar({
  colors,
  size = 112,
  label = "AI assistant",
  className,
  style,
  ...options
}: AiBotAvatarProps) {
  const gradId = `bot-${useId().replace(/:/g, "")}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const moverRef = useRef<SVGGElement>(null);
  const bodyGroupRef = useRef<SVGGElement>(null);
  const bodyRef = useRef<SVGPathElement>(null);
  const faceRef = useRef<SVGGElement>(null);
  const mouthRef = useRef<SVGPathElement>(null);
  const groundRef = useRef<SVGEllipseElement>(null);
  const coreRef = useRef<SVGEllipseElement>(null);
  const eyes = useRef<(SVGPathElement | null)[]>([]);
  const blush = useRef<(SVGEllipseElement | null)[]>([]);
  const hearts = useRef<(SVGPathElement | null)[]>([]);
  const bot = useRef<AiBot | null>(null);
  const latest = useRef(options);

  useEffect(() => {
    latest.current = options;
    bot.current?.update(options);
  });

  useEffect(() => {
    const svg = svgRef.current;
    const mover = moverRef.current;
    const bodyGroup = bodyGroupRef.current;
    const body = bodyRef.current;
    const face = faceRef.current;
    const mouth = mouthRef.current;
    const ground = groundRef.current;
    const core = coreRef.current;

    if (!svg || !mover || !bodyGroup || !body || !face || !mouth || !ground || !core) return;

    bot.current = createAiBot(
      {
        svg, mover, bodyGroup, body, face, mouth, ground, core,
        eyes: eyes.current, blush: blush.current, hearts: hearts.current,
      },
      latest.current,
    );

    return () => {
      bot.current?.destroy();
      bot.current = null;
    };
  }, []);

  const vars = {
    "--bot-size": `${size}px`,
    "--bot-1": colors?.[0] ?? "#66a6ff",
    "--bot-2": colors?.[1] ?? "#0059d4",
    position: "relative",
    display: "block",
    flex: "0 0 auto",
    overflow: "visible",
    width: `${size}px`,
    height: `${size}px`,
    ...style,
  } as CSSProperties;

  return (
    <span
      className={`${s.root}${className ? ` ${className}` : ""}`}
      style={vars}
      role="img"
      aria-label={label}
    >
      <svg
        ref={svgRef}
        className={s.svg}
        viewBox={AI_BOT_SVG.viewBox}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: `${-size * 0.25}px`,
          display: "block",
          width: `${size * 1.5}px`,
          height: `${size * 1.5}px`,
          overflow: "visible",
        }}
      >
        <defs>
          <radialGradient
            id={gradId}
            gradientUnits="userSpaceOnUse"
            cx="-4.8"
            cy="-6.4"
            r="24"
          >
            <stop offset="0" stopColor="var(--bot-1)" />
            <stop offset="1" stopColor="var(--bot-2)" />
          </radialGradient>
          <filter id={`${gradId}-soft`} x="-50%" y="-300%" width="200%" height="700%">
            <feGaussianBlur stdDeviation="1.3" />
          </filter>
          <filter id={`${gradId}-core`} x="-50%" y="-300%" width="200%" height="700%">
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
          <filter id={`${gradId}-blush`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="0.55" />
          </filter>
        </defs>

        <ellipse
          ref={groundRef}
          className={s.ground}
          cx="0"
          cy={AI_BOT_SVG.groundY}
          rx="10"
          ry="2.1"
          filter={`url(#${gradId}-soft)`}
        />
        <ellipse
          ref={coreRef}
          className={s.core}
          cx="0"
          cy={AI_BOT_SVG.groundY}
          rx="6.5"
          ry="0.9"
          filter={`url(#${gradId}-core)`}
        />

        <g ref={moverRef}>
          <g ref={bodyGroupRef}>
            <path
              ref={bodyRef}
              d={AI_BOT_SVG.body}
              fill={`url(#${gradId}) #3478f6`}
            />
          </g>

          <g ref={faceRef}>
            {AI_BOT_SVG.blush.map((b, i) => (
              <ellipse
                key={`blush${i}`}
                ref={(node) => { blush.current[i] = node; }}
                className={s.blush}
                cx={b.cx}
                cy={b.cy}
                rx="1.9"
                ry="1.1"
                opacity="0"
                filter={`url(#${gradId}-blush)`}
              />
            ))}
            {AI_BOT_SVG.eyes.map((d, i) => (
              <path
                key={`eye${i}`}
                ref={(node) => { eyes.current[i] = node; }}
                d={d}
                fill="#101010"
                stroke="#101010"
                strokeWidth="0"
                strokeLinejoin="round"
              />
            ))}
            <path
              ref={mouthRef}
              d={AI_BOT_SVG.mouth}
              fill="#101010"
              stroke="#101010"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {Array.from({ length: AI_BOT_SVG.hearts }, (_, i) => (
          <path
            key={i}
            ref={(node) => { hearts.current[i] = node; }}
            className={s.heart}
            d={AI_BOT_SVG.heart}
            opacity="0"
          />
        ))}
      </svg>
    </span>
  );
}
