interface DropCapProps {
  letter: string;
  className?: string;
}

/**
 * Ornamental drop-cap that uses the Monsieur la Doulaise script font.
 * Used at the start of each story chapter to give the prose a
 * hand-lettered manuscript feel.
 */
export default function DropCap({ letter, className = "" }: DropCapProps) {
  return (
    <span
      className={`font-script text-[5rem] md:text-[6.5rem] leading-[0.8] float-left pr-4 pt-2 text-ink ${className}`}
      aria-hidden="true"
    >
      {letter}
    </span>
  );
}
