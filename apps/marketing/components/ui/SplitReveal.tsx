"use client";

import {
  createElement,
  useMemo,
  type HTMLAttributes,
  type ReactElement,
} from "react";

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

interface SplitRevealProps extends HTMLAttributes<HTMLElement> {
  as?: Tag;
  text: string;
  wordClassName?: string;
  charClassName?: string;
}

/**
 * Splits text into word + char spans for GSAP to animate.
 * Each char is wrapped in <span data-char> inside an inline-block
 * overflow-hidden word span, so y: 100% hides the glyph cleanly.
 */
export default function SplitReveal({
  as = "span",
  text,
  className = "",
  wordClassName = "",
  charClassName = "",
  ...rest
}: SplitRevealProps) {
  const words = useMemo(() => text.split(/(\s+)/), [text]);

  const content: ReactElement[] = words.map((word, wi) => {
    if (/^\s+$/.test(word)) {
      return (
        <span key={`s-${wi}`} aria-hidden="true">
          {"\u00A0"}
        </span>
      );
    }
    return (
      <span
        key={`w-${wi}`}
        className={`inline-block overflow-hidden align-baseline ${wordClassName}`}
      >
        {Array.from(word).map((ch, ci) => (
          <span
            key={`c-${ci}`}
            data-char
            className={`inline-block ${charClassName}`}
          >
            {ch}
          </span>
        ))}
      </span>
    );
  });

  return createElement(
    as,
    { className, "aria-label": text, ...rest },
    <span aria-hidden="true" className="inline-block">
      {content}
    </span>,
  );
}
