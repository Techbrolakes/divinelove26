import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

interface PaperCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Visual variant — which parchment base + border treatment. */
  tone?: "parchment" | "cream" | "night";
  /** Add double stationery border inside. */
  bordered?: boolean;
  /** Corner radius. Defaults to a slight 2px for paper vs modal. */
  radius?: number;
}

/**
 * A reusable parchment / paper card for letter-like surfaces. Used by the
 * Save-the-Date, program booklet, gratitude note, and any other scene
 * needing a printed-page look.
 */
const PaperCard = forwardRef<HTMLDivElement, PaperCardProps>(function PaperCard(
  {
    children,
    className = "",
    tone = "parchment",
    bordered = true,
    radius = 2,
    style,
    ...rest
  },
  ref,
) {
  const toneClass =
    tone === "night"
      ? "envelope-paper text-white"
      : tone === "cream"
        ? "bg-cream text-ink"
        : "parchment text-ink";

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45),0_2px_6px_rgba(0,0,0,0.08)] ${toneClass} ${className}`}
      style={{ borderRadius: radius, ...style }}
      {...rest}
    >
      {bordered && (
        <>
          <div
            className="pointer-events-none absolute inset-2 border opacity-40"
            style={{
              borderColor:
                tone === "night" ? "rgba(201,168,76,0.45)" : "rgba(60,40,20,0.3)",
              borderRadius: Math.max(1, radius - 1),
            }}
          />
          <div
            className="pointer-events-none absolute inset-[7px] border opacity-20"
            style={{
              borderColor:
                tone === "night" ? "rgba(201,168,76,0.35)" : "rgba(60,40,20,0.2)",
              borderRadius: Math.max(1, radius - 1),
            }}
          />
        </>
      )}
      {children}
    </div>
  );
});

export default PaperCard;
