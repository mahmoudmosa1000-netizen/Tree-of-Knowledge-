"use client";

import { useEffect, useState } from "react";
import KineticText from "./KineticText";

const SESSION_KEY = "tok-intro-shown";
const AUTO_DISMISS_MS = 5200;

/**
 * Zeigt einmal pro Sitzung die Vision des Projekts, bevor die App selbst erscheint.
 * "Wissen ist kein Ziel, sondern eine Reise." — macht die Philosophie aus dem
 * README zum ersten Erlebnis statt nur zur Dokumentation.
 */
export default function IntroOverlay() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      // sessionStorage nicht verfügbar (z.B. privater Modus) -> Intro trotzdem einmalig zeigen
    }
    setVisible(true);
    const timer = setTimeout(dismiss, AUTO_DISMISS_MS);
    const onKey = () => dismiss();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismiss = () => {
    setLeaving(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setTimeout(() => setVisible(false), 700);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Willkommen bei Tree of Knowledge"
      onClick={dismiss}
      className={`fixed inset-0 z-[500] flex flex-col items-center justify-center px-6 bg-bg cursor-pointer transition-opacity duration-700 ${
        leaving ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="max-w-lg text-center animate-fade-in-up">
        <div className="font-display italic text-gold text-h1 mb-6 select-none" aria-hidden="true">
          🌳
        </div>
        <p className="font-display italic text-h2 text-ink leading-snug mb-3">
          <KineticText text="Wissen ist kein Ziel," wordDelay={0.09} as="span" />
          <br />
          <KineticText text="sondern eine Reise." wordDelay={0.09} baseDelay={0.45} as="span" />
        </p>
        <p className="text-lede text-muted font-display italic mb-1">
          Jede Frage eröffnet neue Perspektiven.
        </p>
        <p className="text-body text-violet-bright/80 font-mono mt-6">
          Tree of Knowledge lädt dich ein, Philosophie interaktiv zu erleben.
        </p>
      </div>

      <p className="absolute bottom-8 text-label text-muted/60 font-mono animate-fade-in">
        zum Beginnen tippen oder warten
      </p>
    </div>
  );
}
