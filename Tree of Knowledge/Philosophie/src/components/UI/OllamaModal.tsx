"use client";

import { useEffect, useState } from "react";
import { useTreeStore } from "@/stores/treeStore";
import { useMagnetic } from "@/lib/useMagnetic";

export default function OllamaModal({ onClose }: { onClose: () => void }) {
  const { ollamaUrl, setOllamaUrl } = useTreeStore();
  const [value, setValue] = useState(ollamaUrl);
  const saveMagnet = useMagnetic({ strength: 0.35, maxOffset: 7 });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = () => {
    setOllamaUrl(value);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ollama-modal-title"
        className="glass-panel bg-bg-raised/90 border border-violet/15 rounded-2xl p-7 w-[min(420px,90vw)] animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="ollama-modal-title" className="font-display text-h3 text-ink mb-1">
          🦙 Ollama KI konfigurieren
        </h3>
        <p className="text-body text-muted mb-4">
          Lokal starten mit: <code className="text-sage">OLLAMA_ORIGINS=* ollama serve</code>
        </p>
        <label htmlFor="ollama-url-input" className="text-label text-violet-bright/80 font-mono mb-1 block">
          Ollama-URL
        </label>
        <input
          id="ollama-url-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder="http://localhost:11434"
          autoFocus
          className="w-full bg-white/5 border border-violet/25 rounded-lg px-3 py-2 text-body text-ink outline-none focus-visible:border-violet-bright focus-visible:ring-2 focus-visible:ring-violet-bright/40 mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-meta px-3 py-1.5 rounded-full border border-white/10 text-muted hover:text-ink focus-visible:ring-2 focus-visible:ring-violet-bright/50 outline-none"
          >
            Abbrechen
          </button>
          <button
            ref={saveMagnet.ref as React.RefObject<HTMLButtonElement>}
            onMouseMove={saveMagnet.onMouseMove}
            onMouseLeave={saveMagnet.onMouseLeave}
            onClick={save}
            className="text-meta px-3 py-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold-bright hover:bg-gold/30 transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-gold-bright/50 outline-none"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
