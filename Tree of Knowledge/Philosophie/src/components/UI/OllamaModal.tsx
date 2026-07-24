"use client";

import { useState } from "react";
import { useTreeStore } from "@/stores/treeStore";

export default function OllamaModal({ onClose }: { onClose: () => void }) {
  const { ollamaUrl, setOllamaUrl } = useTreeStore();
  const [value, setValue] = useState(ollamaUrl);

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-bg-raised border border-violet/30 rounded-2xl p-7 w-[min(420px,90vw)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-h3 text-ink mb-1">🦙 Ollama KI konfigurieren</h3>
        <p className="text-body text-muted mb-4">
          Lokal starten mit: <code className="text-sage">OLLAMA_ORIGINS=* ollama serve</code>
        </p>
        <label className="text-label text-violet-bright/80 font-mono mb-1 block">
          Ollama-URL
        </label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="http://localhost:11434"
          className="w-full bg-white/5 border border-violet/25 rounded-lg px-3 py-2 text-body text-ink outline-none focus:border-violet-bright mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-meta px-3 py-1.5 rounded-full border border-white/10 text-muted hover:text-ink"
          >
            Abbrechen
          </button>
          <button
            onClick={() => {
              setOllamaUrl(value);
              onClose();
            }}
            className="text-meta px-3 py-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold-bright hover:bg-gold/30"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
