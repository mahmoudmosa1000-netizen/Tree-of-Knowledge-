"use client";

import { useRef, useState } from "react";
import type { Philosopher } from "@/types";
import { useTreeStore } from "@/stores/treeStore";
import { exportQuoteCard } from "@/lib/exportQuoteCard";
import KineticText from "@/components/UI/KineticText";
import AIChat from "./AIChat";

interface Props {
  philosopher: Philosopher | null;
}

export default function Sidebar({ philosopher }: Props) {
  const { sidebarOpen, setSidebarOpen, learned, toggleLearned, language, compareIds, toggleCompare, setCompareOpen } =
    useTreeStore();
  const [exporting, setExporting] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);

  if (!philosopher) return null;
  const isLearned = !!learned[philosopher.id];
  const isComparing = compareIds.includes(philosopher.id);

  const onSpotlightMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = spotlightRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  const copyQuote = () => {
    navigator.clipboard?.writeText(`„${philosopher.quote}" — ${philosopher.name}`);
  };

  const shareQuoteImage = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      await exportQuoteCard(philosopher);
    } finally {
      setExporting(false);
    }
  };

  const copyLink = () => {
    const url = `${location.origin}${location.pathname}#philosopher=${philosopher.id}`;
    navigator.clipboard?.writeText(url);
  };

  return (
    <aside
      onMouseMove={onSpotlightMove}
      className={`glass-panel group fixed right-0 top-0 bottom-0 w-[min(440px,92vw)] bg-bg-raised/90 border-l border-violet/15 backdrop-blur-xl px-7 pt-9 pb-10 overflow-y-auto z-50 transition-transform duration-500 ease-spring ${
        sidebarOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${philosopher.color}14, transparent 70%)`,
        }}
      />
      <button
        onClick={() => setSidebarOpen(false)}
        aria-label="Sidebar schließen"
        className="absolute top-4 right-5 text-muted hover:text-gold text-h3 leading-none focus-visible:ring-2 focus-visible:ring-violet-bright/50 rounded-full outline-none"
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
        „<KineticText text={philosopher.quote} wordDelay={0.028} />"
        <button
          onClick={copyQuote}
          aria-label="Zitat kopieren"
          className="ml-2 text-muted hover:text-gold not-italic font-sans text-meta align-middle focus-visible:ring-2 focus-visible:ring-gold-bright/50 rounded outline-none"
          title="Zitat kopieren"
        >
          ⧉
        </button>
        <button
          onClick={shareQuoteImage}
          disabled={exporting}
          aria-label="Zitat als Bild teilen"
          className="ml-1.5 text-muted hover:text-gold not-italic font-sans text-meta align-middle focus-visible:ring-2 focus-visible:ring-gold-bright/50 rounded outline-none disabled:opacity-40"
          title="Als Bild teilen"
        >
          {exporting ? "…" : "🖼"}
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
          aria-pressed={isLearned}
          className={`text-meta px-3 py-1.5 rounded-full font-mono border transition-colors focus-visible:ring-2 focus-visible:ring-sage/50 outline-none ${
            isLearned
              ? "bg-sage/15 border-sage/50 text-sage"
              : "border-white/10 text-muted hover:border-sage/40 hover:text-sage"
          }`}
        >
          {isLearned ? "✓ Gelernt" : "★ Als gelernt markieren"}
        </button>
        <button
          onClick={copyLink}
          className="text-meta px-3 py-1.5 rounded-full font-mono border border-white/10 text-muted hover:border-violet-bright/50 hover:text-violet-bright transition-colors focus-visible:ring-2 focus-visible:ring-violet-bright/50 outline-none"
        >
          🔗 Link teilen
        </button>
        <button
          onClick={() => {
            const willShowCompare = !isComparing && compareIds.length >= 1;
            toggleCompare(philosopher.id);
            if (willShowCompare) setCompareOpen(true);
          }}
          aria-pressed={isComparing}
          className={`text-meta px-3 py-1.5 rounded-full font-mono border transition-colors focus-visible:ring-2 focus-visible:ring-gold-bright/50 outline-none ${
            isComparing
              ? "bg-gold/15 border-gold/50 text-gold-bright"
              : "border-white/10 text-muted hover:border-gold/40 hover:text-gold"
          }`}
        >
          ⚖ {isComparing ? "Im Vergleich" : "Vergleichen"}
        </button>
      </div>

      {compareIds.length === 1 && !isComparing && (
        <p className="text-meta text-muted/70 mb-2 -mt-4">
          Wähle einen zweiten Philosophen, um sie zu vergleichen.
        </p>
      )}

      <AIChat philosopher={philosopher} />
      </div>
    </aside>
  );
}
