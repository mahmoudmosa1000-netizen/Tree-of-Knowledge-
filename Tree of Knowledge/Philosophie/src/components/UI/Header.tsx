"use client";

import { useState } from "react";
import { useTreeStore } from "@/stores/treeStore";
import type { ViewMode } from "@/types";
import OllamaModal from "./OllamaModal";

const VIEWS: { id: ViewMode; label: string; key: string }[] = [
  { id: "tree", label: "Baum", key: "T" },
  { id: "mindmap", label: "Mind Map", key: "M" },
  { id: "timeline", label: "Timeline", key: "L" },
  { id: "galaxy", label: "Galaxie", key: "G" },
  { id: "quiz", label: "Quiz", key: "Q" },
];

export default function Header() {
  const { view, setView, search, setSearch, language, setLanguage } = useTreeStore();
  const [showOllama, setShowOllama] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center gap-5 px-6 py-3.5 bg-bg/70 backdrop-blur-xl border-b border-violet/20">
      <div className="flex items-baseline gap-1.5">
        <span className="font-display italic text-h2 text-gold leading-none">T</span>
        <span className="font-display text-ink text-body tracking-wide">
          ree of Knowledge
        </span>
      </div>

      <nav className="flex gap-0.5 ml-6">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            title={`Taste: ${v.key}`}
            className={`text-label font-mono px-3 py-1.5 rounded-full border transition-colors duration-200 ${
              view === v.id
                ? "bg-gold/15 border-gold/50 text-gold-bright"
                : "border-transparent text-muted hover:text-ink hover:border-violet/30"
            }`}
          >
            {v.label}
          </button>
        ))}
      </nav>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Suche…"
        className="ml-auto w-48 bg-white/[0.04] border border-violet/25 rounded-full px-3 py-1.5 text-body text-ink placeholder:text-muted outline-none focus:border-violet-bright/60 transition-colors"
      />

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as any)}
        className="bg-white/[0.04] border border-violet/25 rounded-full px-3 py-1.5 text-body text-ink outline-none focus:border-violet-bright/60"
      >
        <option value="de">DE</option>
        <option value="en">EN</option>
        <option value="ar">عر</option>
      </select>

      <button
        onClick={() => setShowOllama(true)}
        className="text-body w-7 h-7 flex items-center justify-center rounded-full border border-violet/25 text-muted hover:text-gold hover:border-gold/40 transition-colors"
        title="Ollama KI konfigurieren"
      >
        ⚙
      </button>

      {showOllama && <OllamaModal onClose={() => setShowOllama(false)} />}
    </header>
  );
}
