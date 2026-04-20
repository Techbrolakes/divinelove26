type Position =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "corner-seal";

interface FloralGarnishProps {
  position: Position;
  className?: string;
  /** Overall size relative to the parent — supplied as a Tailwind class. */
  size?: string;
}

/**
 * Positioned floral bouquet SVG. Hand-tuned vector flowers in cream,
 * burgundy and sage so they echo the wax seal without needing raster assets.
 * The parent container should be `relative`.
 */
export default function FloralGarnish({
  position,
  className = "",
  size,
}: FloralGarnishProps) {
  const anchor =
    position === "top-left"
      ? "top-0 left-0 -translate-x-[35%] -translate-y-[10%]"
      : position === "top-right"
        ? "top-0 right-0 translate-x-[35%] -translate-y-[10%]"
        : position === "bottom-left"
          ? "bottom-0 left-0 -translate-x-[25%] translate-y-[15%]"
          : position === "bottom-right"
            ? "bottom-0 right-0 translate-x-[25%] translate-y-[15%]"
            : "top-0 left-0 -translate-x-[10%] -translate-y-[28%]";

  const defaultSize =
    position === "corner-seal"
      ? "w-28 md:w-36"
      : "w-32 md:w-44 lg:w-52";

  const flip = position.includes("right");

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute ${anchor} ${size ?? defaultSize} ${className}`}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <FloralBouquet />
    </div>
  );
}

function FloralBouquet() {
  // Hand-built composition — large anthurium leaf, two white roses,
  // hanging amaranth, gypsophila accents. Renders as layered SVG
  // so it scales at any size and recolors via currentColor where useful.
  return (
    <svg
      viewBox="0 0 300 420"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto polaroid-shadow"
    >
      <defs>
        <radialGradient id="rose" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#fbf3e0" />
          <stop offset="55%" stopColor="#f0e3c6" />
          <stop offset="100%" stopColor="#c7b38a" />
        </radialGradient>
        <radialGradient id="rose-dark" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f2e3c5" />
          <stop offset="100%" stopColor="#b89c67" />
        </radialGradient>
        <linearGradient id="leaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b7f52" />
          <stop offset="100%" stopColor="#2f4427" />
        </linearGradient>
        <linearGradient id="amaranth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a58c56" />
          <stop offset="100%" stopColor="#5d4a24" />
        </linearGradient>
      </defs>

      {/* Large anthurium leaf — back layer */}
      <path
        d="M70 30 Q20 120 60 210 Q100 260 140 220 Q160 140 120 70 Q100 40 70 30 Z"
        fill="url(#leaf)"
        opacity="0.9"
      />
      <path
        d="M75 40 Q100 130 120 210"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1.2"
        fill="none"
      />

      {/* Smaller leaf */}
      <path
        d="M210 60 Q240 120 220 200 Q195 240 170 205 Q165 140 190 80 Q200 65 210 60 Z"
        fill="url(#leaf)"
        opacity="0.78"
      />

      {/* Hanging amaranth — long trailing beads */}
      <g opacity="0.9">
        {Array.from({ length: 9 }).map((_, i) => (
          <circle
            key={i}
            cx={55 + i * 2}
            cy={270 + i * 22}
            r={6 - i * 0.3}
            fill="url(#amaranth)"
          />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <circle
            key={`b-${i}`}
            cx={88 - i * 1.5}
            cy={240 + i * 26}
            r={5 - i * 0.25}
            fill="url(#amaranth)"
          />
        ))}
      </g>

      {/* Primary rose — large creamy anthurium/peony */}
      <g transform="translate(120 140)">
        {petal(0, 0, 62, 0, "url(#rose)")}
        {petal(-34, -28, 54, -22, "url(#rose)")}
        {petal(34, -28, 54, 22, "url(#rose)")}
        {petal(-36, 22, 48, -38, "url(#rose)")}
        {petal(34, 24, 48, 38, "url(#rose)")}
        <circle r="18" fill="url(#rose-dark)" />
        <circle r="8" fill="#c7b38a" opacity="0.65" />
      </g>

      {/* Secondary rose — upper right */}
      <g transform="translate(205 115)">
        {petal(0, 0, 44, 0, "url(#rose)")}
        {petal(-22, -18, 36, -22, "url(#rose)")}
        {petal(22, -18, 36, 22, "url(#rose)")}
        <circle r="10" fill="url(#rose-dark)" />
      </g>

      {/* Accent rose — lower */}
      <g transform="translate(180 220)">
        {petal(0, 0, 40, 0, "url(#rose)")}
        {petal(-20, -16, 34, -20, "url(#rose)")}
        {petal(20, -16, 34, 20, "url(#rose)")}
        <circle r="9" fill="url(#rose-dark)" />
      </g>

      {/* Gypsophila — tiny white dots */}
      <g fill="#fbf3e0" opacity="0.9">
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i / 14) * Math.PI * 2;
          const r = 90 + (i % 3) * 12;
          const cx = Math.round((150 + Math.cos(angle) * r) * 100) / 100;
          const cy = Math.round((160 + Math.sin(angle) * r * 0.7) * 100) / 100;
          return <circle key={i} cx={cx} cy={cy} r={2.2} />;
        })}
      </g>
    </svg>
  );
}

function petal(
  x: number,
  y: number,
  radius: number,
  angle: number,
  fill: string,
) {
  return (
    <ellipse
      cx={x}
      cy={y}
      rx={radius * 0.7}
      ry={radius}
      fill={fill}
      transform={`rotate(${angle} ${x} ${y})`}
      opacity="0.95"
    />
  );
}
