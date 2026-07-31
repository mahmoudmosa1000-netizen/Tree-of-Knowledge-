"use client";

import { useState } from "react";
import { useTreeStore } from "@/stores/treeStore";
import type { Philosopher, ViewMode } from "@/types";
import { useMagnetic } from "@/lib/useMagnetic";
import OllamaModal from "./OllamaModal";

const VIEWS: { id: ViewMode; label: string; key: string }[] = [
  { id: "tree", label: "Baum", key: "T" },
  { id: "mindmap", label: "Mind Map", key: "M" },
  { id: "timeline", label: "Timeline", key: "L" },
  { id: "galaxy", label: "Galaxie", key: "G" },
  { id: "quiz", label: "Quiz", key: "Q" },
  { id: "schools", label: "Schulen", key: "S" },
];

interface Props {
  philosophers: Philosopher[];
}

export default function Header({ philosophers }: Props) {
  const { view, setView, search, setSearch, language, setLanguage, setCompareOpen, select } = useTreeStore();
  const [showOllama, setShowOllama] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const randomMagnet = useMagnetic({ strength: 0.4, maxOffset: 8 });
  const compareMagnet = useMagnetic({ strength: 0.4, maxOffset: 8 });

  const discoverRandom = () => {
    if (philosophers.length === 0) return;
    const pick = philosophers[Math.floor(Math.random() * philosophers.length)];
    setView("tree");
    select(pick.id);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center gap-3 sm:gap-5 px-3 sm:px-6 py-3.5 bg-bg/70 backdrop-blur-xl border-b border-violet/20">
        <h1 className="flex items-baseline gap-1.5 shrink-0 m-0">
          <span className="font-display italic text-h2 text-gold leading-none">T</span>
          <span className="hidden sm:inline font-display text-ink text-body tracking-wide font-normal">
            ree of Knowledge
          </span>
        </h1>

        <nav className="flex gap-0.5 sm:ml-6 overflow-x-auto no-scrollbar" aria-label="Ansichten">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              title={`Taste: ${v.key}`}
              className={`text-label font-mono px-3 py-1.5 rounded-full border transition-colors duration-200 shrink-0 focus-visible:ring-2 focus-visible:ring-violet-bright/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg outline-none ${
                view === v.id
                  ? "bg-gold/15 border-gold/50 text-gold-bright"
                  : "border-transparent text-muted hover:text-ink hover:border-violet/30"
              }`}
            >
              {v.label}
            </button>
          ))}
        </nav>

        {/* Desktop-Suche */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Suche…"
          aria-label="Philosophen durchsuchen"
          className="hidden sm:block ml-auto w-40 lg:w-48 bg-white/[0.04] border border-violet/25 rounded-full px-3 py-1.5 text-body text-ink placeholder:text-muted outline-none focus-visible:border-violet-bright/60 focus-visible:ring-2 focus-visible:ring-violet-bright/40 transition-colors"
        />

        {/* Mobile-Suchsymbol, öffnet Overlay */}
        <button
          onClick={() => setMobileSearchOpen(true)}
          className="sm:hidden ml-auto w-7 h-7 shrink-0 flex items-center justify-center rounded-full border border-violet/25 text-muted hover:text-ink hover:border-violet-bright/40 transition-colors focus-visible:ring-2 focus-visible:ring-violet-bright/50 outline-none"
          aria-label="Suche öffnen"
          title="Suche"
        >
          🔍
        </button>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
          aria-label="Sprache wählen"
          className="bg-white/[0.04] border border-violet/25 rounded-full px-2.5 sm:px-3 py-1.5 text-body text-ink outline-none focus-visible:border-violet-bright/60 focus-visible:ring-2 focus-visible:ring-violet-bright/40"
        >
          <option value="de">DE</option>
          <option value="en">EN</option>
          <option value="ar">عر</option>
        </select>

        <button
          ref={randomMagnet.ref as React.RefObject<HTMLButtonElement>}
          onMouseMove={randomMagnet.onMouseMove}
          onMouseLeave={randomMagnet.onMouseLeave}
          onClick={discoverRandom}
          className="hidden sm:flex items-center gap-1.5 text-label font-mono px-3 py-1.5 rounded-full border border-violet/25 text-muted hover:text-ink hover:border-violet-bright/40 transition-[color,border-color,transform] duration-200 focus-visible:ring-2 focus-visible:ring-violet-bright/50 outline-none"
          title="Zufälligen Philosophen entdecken"
        >
          🎲 Zufall
        </button>
        <button
          onClick={discoverRandom}
          className="sm:hidden w-7 h-7 shrink-0 flex items-center justify-center rounded-full border border-violet/25 text-muted hover:text-ink hover:border-violet-bright/40 transition-colors focus-visible:ring-2 focus-visible:ring-violet-bright/50 outline-none"
          aria-label="Zufälligen Philosophen entdecken"
          title="Zufall"
        >
          🎲
        </button>

        <button
          ref={compareMagnet.ref as React.RefObject<HTMLButtonElement>}
          onMouseMove={compareMagnet.onMouseMove}
          onMouseLeave={compareMagnet.onMouseLeave}
          onClick={() => setCompareOpen(true)}
          className="hidden sm:flex items-center gap-1.5 text-label font-mono px-3 py-1.5 rounded-full border border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50 transition-[color,background,border-color,transform] duration-200 focus-visible:ring-2 focus-visible:ring-gold-bright/50 outline-none"
          title="Zwei Philosophen vergleichen"
        >
          ⚖ Vergleich
        </button>
        <button
          onClick={() => setCompareOpen(true)}
          className="sm:hidden w-7 h-7 shrink-0 flex items-center justify-center rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors focus-visible:ring-2 focus-visible:ring-gold-bright/50 outline-none"
          aria-label="Vergleich öffnen"
          title="Vergleich"
        >
          ⚖
        </button>

        <button
          onClick={() => setShowOllama(true)}
          className="text-body w-7 h-7 shrink-0 flex items-center justify-center rounded-full border border-violet/25 text-muted hover:text-gold hover:border-gold/40 transition-colors focus-visible:ring-2 focus-visible:ring-violet-bright/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg outline-none"
          title="Ollama KI konfigurieren"
        >
          ⚙
        </button>

        {showOllama && <OllamaModal onClose={() => setShowOllama(false)} />}
      </header>

      {/* Mobile-Such-Overlay */}
      {mobileSearchOpen && (
        <div className="sm:hidden fixed top-16 left-0 right-0 z-40 px-3 pb-3 bg-bg/95 backdrop-blur-xl border-b border-violet/20 animate-fade-in-up">
          <div className="flex gap-2">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Philosophen durchsuchen…"
              aria-label="Philosophen durchsuchen"
              className="flex-1 bg-white/[0.04] border border-violet/25 rounded-full px-3 py-1.5 text-body text-ink placeholder:text-muted outline-none focus-visible:border-violet-bright/60 focus-visible:ring-2 focus-visible:ring-violet-bright/40"
            />
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="text-meta px-3 py-1.5 rounded-full border border-white/10 text-muted hover:text-ink focus-visible:ring-2 focus-visible:ring-violet-bright/50 outline-none"
            >
              Fertig
            </button>
          </div>
        </div>
      )}
    </>
  );
}
