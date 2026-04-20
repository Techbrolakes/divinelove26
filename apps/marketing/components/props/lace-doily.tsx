interface LaceDoilyProps {
  size?: number;
  className?: string;
}

/**
 * SVG lace doily — used beneath the "The Finer Details" / "Our Story"
 * jump-point on the desk scene. Filigree scallop pattern.
 */
export default function LaceDoily({ size = 320, className = "" }: LaceDoilyProps) {
  const r = size / 2;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <filter id="doily-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>

      <g transform={`translate(${r} ${r})`}>
        {/* Shadow */}
        <circle
          r={r * 0.95}
          fill="rgba(0,0,0,0.1)"
          filter="url(#doily-shadow)"
          transform="translate(2 4)"
        />

        {/* Base disc */}
        <circle r={r * 0.92} fill="#fbf3e0" opacity="0.97" />

        {/* Outer scallop ring */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const cx = Math.round(Math.cos(angle) * r * 0.92 * 100) / 100;
          const cy = Math.round(Math.sin(angle) * r * 0.92 * 100) / 100;
          return (
            <circle
              key={`s1-${i}`}
              cx={cx}
              cy={cy}
              r={Math.round(r * 0.08 * 100) / 100}
              fill="#fbf3e0"
            />
          );
        })}

        {/* Inner filigree rings */}
        <circle
          r={r * 0.75}
          fill="none"
          stroke="#8a7a4f"
          strokeWidth="0.5"
          strokeDasharray="2 3"
          opacity="0.55"
        />
        <circle
          r={r * 0.58}
          fill="none"
          stroke="#8a7a4f"
          strokeWidth="0.5"
          strokeDasharray="1 4"
          opacity="0.5"
        />

        {/* Petal pattern — 12-point rosette */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const x = Math.round(Math.cos(angle) * r * 0.4 * 100) / 100;
          const y = Math.round(Math.sin(angle) * r * 0.4 * 100) / 100;
          const deg = Math.round(((angle * 180) / Math.PI) * 100) / 100;
          return (
            <ellipse
              key={`p-${i}`}
              cx={x}
              cy={y}
              rx={Math.round(r * 0.14 * 100) / 100}
              ry={Math.round(r * 0.06 * 100) / 100}
              fill="none"
              stroke="#8a7a4f"
              strokeWidth="0.6"
              transform={`rotate(${deg} ${x} ${y})`}
              opacity="0.6"
            />
          );
        })}

        {/* Center ring */}
        <circle
          r={r * 0.22}
          fill="none"
          stroke="#8a7a4f"
          strokeWidth="0.8"
          opacity="0.7"
        />
        <circle r={r * 0.06} fill="#8a7a4f" opacity="0.8" />
      </g>
    </svg>
  );
}
