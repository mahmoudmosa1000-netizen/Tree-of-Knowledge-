"use client";

import type { Philosopher } from "@/types";
import { useTreeStore } from "@/stores/treeStore";
import AIChat from "./AIChat";

interface Props {
  philosopher: Philosopher | null;
}

export default function Sidebar({ philosopher }: Props) {
  const { sidebarOpen, setSidebarOpen, learned, toggleLearned, language } =
    useTreeStore();

  if (!philosopher) return null;
  const isLearned = !!learned[philosopher.id];

  const copyQuote = () => {
    navigator.clipboard?.writeText(`„${philosopher.quote}" — ${philosopher.name}`);
  };

  const copyLink = () => {
    const url = `${location.origin}${location.pathname}#philosopher=${philosopher.id}`;
    navigator.clipboard?.writeText(url);
  };

  return (
    <aside
      className={`fixed right-0 top-0 bottom-0 w-[min(440px,92vw)] bg-bg-raised/95 border-l border-violet/25 backdrop-blur-xl px-7 pt-9 pb-10 overflow-y-auto z-50 transition-transform duration-500 ease-spring ${
        sidebarOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <button
        onClick={() => setSidebarOpen(false)}
        className="absolute top-4 right-5 text-muted hover:text-gold text-h3 leading-none"
      >
        ✕
      </button>

      {/* Illuminierte Initiale — Signaturelement, wie in einer alten Handschrift */}
      <div key={philosopher.id} className="animate-fade-in-up">
      <div className="flex items-start gap-4 mb-5">
        <div
          className="font-display italic text-initial shrink-0 select-none"
          style={{ color: philosopher.color, textShadow: `0 0 24px ${philosopher.color}55` }}
        >
          {philosopher.name.charAt(0)}
        </div>
        <div className="pt-1.5">
          <div className="text-label text-sage font-mono font-medium mb-1.5">
            {philosopher.era}
          </div>
          <h2 className="font-display text-h1 text-ink mb-1">
            {philosopher.name}
          </h2>
          <div className="text-meta text-muted font-mono">{philosopher.life}</div>
        </div>
      </div>
      <div
        className="h-px w-full mb-5 opacity-40"
        style={{ background: `linear-gradient(90deg, ${philosopher.color}, transparent)` }}
      />

      <blockquote className="border-l-2 pl-4 font-display italic text-ink/90 text-lede mb-6" style={{ borderColor: `${philosopher.color}66` }}>
        „{philosopher.quote}"
        <button
          onClick={copyQuote}
          className="ml-2 text-muted hover:text-gold not-italic font-sans text-meta align-middle"
          title="Zitat kopieren"
        >
          ⧉
        </button>
      </blockquote>

      <div className="text-label text-violet-bright/80 font-mono font-semibold mb-2.5">
        Ideen
      </div>
      <div className="flex flex-wrap gap-1.5 mb-6">
        {philosopher.ideas.map((idea) => (
          <span
            key={idea}
            className="text-meta px-2.5 py-0.5 rounded-full font-mono"
            style={{
              background: `${philosopher.color}1a`,
              color: philosopher.color,
              border: `1px solid ${philosopher.color}44`,
            }}
          >
            {idea}
          </span>
        ))}
      </div>

      <div className="text-label text-violet-bright/80 font-mono font-semibold mb-2.5">
        Biografie
      </div>
      <p className="text-body text-ink/70 leading-relaxed mb-6">
        {language === "en" && philosopher.bioEn ? philosopher.bioEn : philosopher.bio}
      </p>

      {philosopher.works.length > 0 && (
        <>
          <div className="text-label text-violet-bright/80 font-mono font-semibold mb-2.5">
            Werke
          </div>
          <div className="flex flex-col gap-1.5 mb-6">
            {philosopher.works.map((w) => (
              <div
                key={w}
                className="text-body text-ink/70 font-display italic bg-white/[0.02] border-l-2 border-violet/30 px-3 py-1.5 rounded-r"
              >
                {w}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex gap-2 mb-7">
        <button
          onClick={() => toggleLearned(philosopher.id)}
          className={`text-meta px-3 py-1.5 rounded-full font-mono border transition-colors ${
            isLearned
              ? "bg-sage/15 border-sage/50 text-sage"
              : "border-white/10 text-muted hover:border-sage/40 hover:text-sage"
          }`}
        >
          {isLearned ? "✓ Gelernt" : "★ Als gelernt markieren"}
        </button>
        <button
          onClick={copyLink}
          className="text-meta px-3 py-1.5 rounded-full font-mono border border-white/10 text-muted hover:border-violet-bright/50 hover:text-violet-bright transition-colors"
        >
          🔗 Link teilen
        </button>
      </div>

      <AIChat philosopher={philosopher} />
      </div>
    </aside>
  );
}
