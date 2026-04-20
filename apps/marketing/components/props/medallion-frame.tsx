interface MedallionFrameProps {
  /** Diameter in pixels. */
  size?: number;
  className?: string;
}

/**
 * Ornamental gold filigree that encircles the monogram seal. A ring of
 * tiny pearls, a double hairline, and four scrolling flourishes at the
 * cardinal points make the centrepiece feel ceremonial. Each path is
 * authored with pathLength=1 so GSAP can draw them in by tweening
 * stroke-dashoffset from 1 → 0.
 */
export default function MedallionFrame({
  size = 320,
  className = "",
}: MedallionFrameProps) {
  const s = size;
  const r = s / 2;

  // 36 pearl dots around the outer ring
  const pearls = Array.from({ length: 36 }).map((_, i) => {
    const angle = (i / 36) * Math.PI * 2;
    const px = Math.round((r + Math.cos(angle) * r * 0.94) * 100) / 100;
    const py = Math.round((r + Math.sin(angle) * r * 0.94) * 100) / 100;
    return { cx: px, cy: py, i };
  });

  return (
    <svg
      viewBox={`0 0 ${s} ${s}`}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="medallion-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(201,168,76,0)" />
          <stop offset="85%" stopColor="rgba(201,168,76,0)" />
          <stop offset="100%" stopColor="rgba(201,168,76,0.35)" />
        </radialGradient>
        <linearGradient id="medallion-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8d8a8" />
          <stop offset="50%" stopColor="#c5a875" />
          <stop offset="100%" stopColor="#8e6f3e" />
        </linearGradient>
      </defs>

      {/* Soft ambient halo around the ring */}
      <circle cx={r} cy={r} r={r * 0.98} fill="url(#medallion-glow)" />

      {/* Pearl ring */}
      <g data-medallion-pearls>
        {pearls.map((p) => (
          <circle
            key={p.i}
            cx={p.cx}
            cy={p.cy}
            r={1.8}
            fill="url(#medallion-stroke)"
            opacity="0.85"
          />
        ))}
      </g>

      {/* Double hairline rings — drawn in on mount */}
      <circle
        data-medallion-ring
        cx={r}
        cy={r}
        r={r * 0.86}
        fill="none"
        stroke="url(#medallion-stroke)"
        strokeWidth="0.8"
        opacity="0.75"
        pathLength={1}
      />
      <circle
        data-medallion-ring
        cx={r}
        cy={r}
        r={r * 0.78}
        fill="none"
        stroke="url(#medallion-stroke)"
        strokeWidth="0.5"
        opacity="0.55"
        pathLength={1}
      />

      {/* Four cardinal flourishes — simple scroll shapes at N,E,S,W */}
      <g
        stroke="url(#medallion-stroke)"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      >
        {/* Top */}
        <path
          data-medallion-curl
          d={`M ${r - 14} ${r * 0.12} Q ${r} ${r * 0.04} ${r + 14} ${r * 0.12}`}
          pathLength={1}
        />
        <circle
          data-medallion-curl
          cx={r}
          cy={r * 0.1}
          r={2}
          fill="url(#medallion-stroke)"
          stroke="none"
        />
        {/* Bottom */}
        <path
          data-medallion-curl
          d={`M ${r - 14} ${s - r * 0.12} Q ${r} ${s - r * 0.04} ${r + 14} ${s - r * 0.12}`}
          pathLength={1}
        />
        <circle
          data-medallion-curl
          cx={r}
          cy={s - r * 0.1}
          r={2}
          fill="url(#medallion-stroke)"
          stroke="none"
        />
        {/* Left */}
        <path
          data-medallion-curl
          d={`M ${r * 0.12} ${r - 14} Q ${r * 0.04} ${r} ${r * 0.12} ${r + 14}`}
          pathLength={1}
        />
        <circle
          data-medallion-curl
          cx={r * 0.1}
          cy={r}
          r={2}
          fill="url(#medallion-stroke)"
          stroke="none"
        />
        {/* Right */}
        <path
          data-medallion-curl
          d={`M ${s - r * 0.12} ${r - 14} Q ${s - r * 0.04} ${r} ${s - r * 0.12} ${r + 14}`}
          pathLength={1}
        />
        <circle
          data-medallion-curl
          cx={s - r * 0.1}
          cy={r}
          r={2}
          fill="url(#medallion-stroke)"
          stroke="none"
        />
      </g>
    </svg>
  );
}
