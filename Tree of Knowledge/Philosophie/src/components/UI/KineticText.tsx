"use client";

interface Props {
  text: string;
  className?: string;
  wordDelay?: number;
  baseDelay?: number;
  as?: "span" | "p" | "blockquote" | "h3";
}

/**
 * Blendet einen Text Wort für Wort ein (gestaffelte Verzögerung pro Wort).
 * Respektiert prefers-reduced-motion automatisch über die globale CSS-Regel,
 * die Animation-Dauern auf ~0 kürzt — die Wörter erscheinen dann einfach sofort.
 */
export default function KineticText({ text, className, wordDelay = 0.035, baseDelay = 0, as: Tag = "span" }: Props) {
  const words = text.split(" ");
  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block animate-kinetic-word"
          style={{ animationDelay: `${baseDelay + i * wordDelay}s` }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}
