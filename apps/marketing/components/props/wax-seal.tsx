interface WaxSealProps {
  size?: number;
  /** Two monogram letters to stamp. */
  initials?: string;
  className?: string;
  /** Render a broken/cracked wax (post-open state). */
  broken?: boolean;
}

/**
 * SVG wax seal with burgundy base, raised-rim highlight, and carved initials.
 * Combines with the `.wax-base` background for the warm radial sheen.
 */
export default function WaxSeal({
  size = 120,
  initials = "DL",
  className = "",
  broken = false,
}: WaxSealProps) {
  const r = size / 2;
  const letters = initials.slice(0, 2).split("");

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="wax-grad" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#c17070" />
          <stop offset="55%" stopColor="#8b3b3b" />
          <stop offset="100%" stopColor="#4f1f1f" />
        </radialGradient>
        <radialGradient id="wax-rim" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
        </radialGradient>
        <filter id="wax-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* Soft cast shadow beneath the seal */}
      <ellipse
        cx={r}
        cy={r + 4}
        rx={r * 0.95}
        ry={r * 0.88}
        fill="rgba(0,0,0,0.35)"
        filter="url(#wax-shadow)"
      />

      {/* Scalloped/irregular wax edge */}
      <g transform={`translate(${r} ${r})`}>
        <path
          d={scallopedCircle(r * 0.95, 16, 0.06)}
          fill="url(#wax-grad)"
          stroke="rgba(0,0,0,0.25)"
          strokeWidth="0.5"
        />
        {/* Inner rim highlight */}
        <circle
          r={r * 0.72}
          fill="none"
          stroke="rgba(255,220,200,0.18)"
          strokeWidth="0.8"
        />
        <circle r={r * 0.95} fill="url(#wax-rim)" />

        {/* Carved monogram initials */}
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--font-cormorant), Georgia, serif"
          fontSize={r * 0.9}
          fontStyle="italic"
          fontWeight="500"
          fill="#3a1414"
          opacity="0.85"
          style={{ letterSpacing: "-0.05em" }}
        >
          {letters.join("")}
        </text>

        {/* Subtle highlight carve */}
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--font-cormorant), Georgia, serif"
          fontSize={r * 0.9}
          fontStyle="italic"
          fontWeight="500"
          fill="none"
          stroke="rgba(255,220,200,0.25)"
          strokeWidth="0.4"
          style={{ letterSpacing: "-0.05em" }}
        >
          {letters.join("")}
        </text>

        {broken && (
          <path
            d={`M ${-r * 0.85} 2 L ${-r * 0.2} -4 L ${r * 0.05} 6 L ${r * 0.3} -3 L ${r * 0.8} 5`}
            stroke="#2a0909"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            opacity="0.65"
          />
        )}
      </g>
    </svg>
  );
}

/** Generate a near-circular path with gentle scalloping for the wax edge.
 *  Rounded to 2 decimal places so server and client serialize identical
 *  path strings — otherwise float precision drift between Node and the
 *  browser produces a hydration mismatch. */
function scallopedCircle(radius: number, points: number, jitter: number): string {
  const round = (n: number) => Math.round(n * 100) / 100;
  const cmds: string[] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const seed = Math.sin(i * 11.31) * 43.12;
    const noise = (seed - Math.floor(seed)) * 2 - 1; // deterministic pseudo-random
    const r = radius * (1 - jitter + noise * jitter * 0.6);
    const x = round(Math.cos(angle) * r);
    const y = round(Math.sin(angle) * r);
    cmds.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  cmds.push("Z");
  return cmds.join(" ");
}
