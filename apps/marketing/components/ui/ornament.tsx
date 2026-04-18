interface OrnamentProps {
  className?: string;
  variant?: "wave" | "diamond";
}

/**
 * Hand-drawn filigree divider. Paths are plotted so an external
 * GSAP draw-in (DrawSVG-style stroke-dashoffset tween) renders cleanly.
 */
export default function Ornament({
  className = "",
  variant = "wave",
}: OrnamentProps) {
  if (variant === "diamond") {
    return (
      <svg
        viewBox="0 0 220 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M0 8 L90 8"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeLinecap="round"
          pathLength={1}
        />
        <path
          d="M130 8 L220 8"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeLinecap="round"
          pathLength={1}
        />
        <path
          d="M100 8 L110 2 L120 8 L110 14 Z"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeLinejoin="round"
          fill="currentColor"
          fillOpacity="0.18"
          pathLength={1}
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 240 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0 10 Q30 0 60 10 T120 10"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        pathLength={1}
      />
      <path
        d="M120 10 Q150 20 180 10 T240 10"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        pathLength={1}
      />
      <circle cx="120" cy="10" r="2" fill="currentColor" fillOpacity="0.9" />
      <circle cx="75" cy="10" r="1" fill="currentColor" fillOpacity="0.5" />
      <circle cx="165" cy="10" r="1" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}
