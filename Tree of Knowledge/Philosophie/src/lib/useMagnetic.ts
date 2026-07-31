import { useRef } from "react";

interface MagneticOptions {
  strength?: number; // 0–1, wie stark das Element dem Cursor folgt
  maxOffset?: number; // maximale Verschiebung in px
}

/**
 * Gibt Event-Handler zurück, die ein Element sanft dem Cursor folgen lassen
 * (begrenzt auf maxOffset) und beim Verlassen per CSS-Transition zurückfedern.
 * Bewusst nur auf ausgewählte "Signature"-CTAs angewendet, nicht global —
 * ein magnetischer Effekt auf jedem Button würde eher unruhig als hochwertig wirken.
 */
export function useMagnetic({ strength = 0.35, maxOffset = 10 }: MagneticOptions = {}) {
  const ref = useRef<HTMLElement | null>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const x = Math.max(-maxOffset, Math.min(maxOffset, relX * strength));
    const y = Math.max(-maxOffset, Math.min(maxOffset, relY * strength));
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  };

  return { ref, onMouseMove, onMouseLeave };
}
