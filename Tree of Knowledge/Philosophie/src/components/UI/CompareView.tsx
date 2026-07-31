"use client";

import { useState } from "react";
import { useTreeStore } from "@/stores/treeStore";
import type { Philosopher } from "@/types";

type ApiPhilosopher = Philosopher & { influences: string[] };

interface Props {
  philosophers: ApiPhilosopher[];
}

function PhilosopherPicker({
  philosophers,
  excludeId,
  value,
  onPick,
  label,
}: {
  philosophers: ApiPhilosopher[];
  excludeId?: string;
  value: ApiPhilosopher | null;
  onPick: (id: string) => void;
  label: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const matches = philosophers
    .filter((p) => p.id !== excludeId)
    .filter((p) => !query || p.name.toLowerCase().includes(query.trim().toLowerCase()))
    .slice(0, 8);

  if (value && !open) {
    return (
      <button
        onClick={() => {
          setOpen(true);
          setQuery("");
        }}
        className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg border border-violet/25 bg-white/[0.03] hover:border-violet-bright/40 transition-colors focus-visible:ring-2 focus-visible:ring-violet-bright/40 outline-none"
      >
        <span
          className="font-display italic text-h3 shrink-0"
          style={{ color: value.color, textShadow: `0 0 12px ${value.color}55` }}
        >
          {value.name.charAt(0)}
        </span>
        <span className="min-w-0">
          <span className="block font-display text-body text-ink truncate">{value.name}</span>
          <span className="block text-meta text-muted">ändern</span>
        </span>
      </button>
    );
  }

  return (
    <div className="relative">
      <input
        autoFocus={open}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder={label}
        className="w-full bg-white/5 border border-violet/25 rounded-lg px-3 py-2.5 text-body text-ink placeholder:text-muted outline-none focus-visible:border-violet-bright focus-visible:ring-2 focus-visible:ring-violet-bright/40"
      />
      {open && (
        <div className="glass-panel bg-bg-raised/95 border border-violet/15 rounded-lg overflow-hidden absolute top-full left-0 right-0 mt-1 z-10 max-h-56 overflow-y-auto">
          {matches.length === 0 && (
            <div className="px-3 py-2.5 text-meta text-muted">Keine Treffer</div>
          )}
          {matches.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                onPick(p.id);
                setOpen(false);
                setQuery("");
              }}
              className="w-full text-left flex items-center gap-2.5 px-3 py-2 hover:bg-violet/10 transition-colors"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color, boxShadow: `0 0 5px ${p.color}` }} />
              <span className="text-body text-ink truncate">{p.name}</span>
              <span className="text-meta text-muted ml-auto shrink-0">{p.era}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[100px_1fr_1fr] gap-4 py-4 border-t border-white/[0.06] first:border-t-0 first:pt-0">
      <div className="text-label text-violet-bright/70 font-mono pt-0.5">{label}</div>
      {children}
    </div>
  );
}

export default function CompareView({ philosophers }: Props) {
  const { compareIds, compareOpen, setCompareOpen, setCompareSlot, clearCompare } = useTreeStore();

  if (!compareOpen) return null;

  const a = philosophers.find((p) => p.id === compareIds[0]) ?? null;
  const b = philosophers.find((p) => p.id === compareIds[1]) ?? null;

  const sameEra = a && b && a.era === b.era;
  const aInfluencesB = a && b && a.influences.includes(b.id);
  const bInfluencesA = a && b && b.influences.includes(a.id);
  const yearsApart = a && b ? Math.abs(a.birthYear - b.birthYear) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Philosophen vergleichen"
      className="fixed inset-0 z-[300] bg-black/70 flex items-center justify-center px-4 py-8 animate-fade-in"
      onClick={() => setCompareOpen(false)}
    >
      <div
        className="glass-panel bg-bg-raised/90 border border-violet/15 rounded-2xl w-full max-w-2xl max-h-[88vh] overflow-y-auto p-7 animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="text-label text-violet-bright font-mono">⚖ Vergleich</div>
          <div className="flex gap-2">
            {(a || b) && (
              <button
                onClick={clearCompare}
                className="text-meta px-3 py-1.5 rounded-full border border-white/10 text-muted hover:text-ink focus-visible:ring-2 focus-visible:ring-violet-bright/50 outline-none"
              >
                Zurücksetzen
              </button>
            )}
            <button
              onClick={() => setCompareOpen(false)}
              aria-label="Vergleich schließen"
              className="text-h3 text-muted hover:text-gold leading-none focus-visible:ring-2 focus-visible:ring-violet-bright/50 rounded-full outline-none px-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Auswahl */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          <PhilosopherPicker
            philosophers={philosophers}
            excludeId={b?.id}
            value={a}
            onPick={(id) => setCompareSlot(0, id)}
            label="Philosoph A wählen…"
          />
          <PhilosopherPicker
            philosophers={philosophers}
            excludeId={a?.id}
            value={b}
            onPick={(id) => setCompareSlot(1, id)}
            label="Philosoph B wählen…"
          />
        </div>

        {!a || !b ? (
          <p className="text-meta text-muted/70 text-center py-10">
            Wähle zwei Philosophen aus, um sie Ebene für Ebene zu vergleichen.
          </p>
        ) : (
          <>
            <div className="text-center my-5 text-body font-mono">
              {aInfluencesB || bInfluencesA ? (
                <span className="text-gold-bright">
                  {aInfluencesB ? `${a.name} beeinflusste ${b.name}` : `${b.name} beeinflusste ${a.name}`}
                </span>
              ) : sameEra ? (
                <span className="text-sage">Beide gehören zur Epoche „{a.era}"</span>
              ) : (
                <span className="text-muted">{yearsApart} Jahre trennen ihre Geburt</span>
              )}
            </div>

            <div className="mt-2">
              <Row label="Name">
                <span className="font-display italic text-h3" style={{ color: a.color }}>{a.name}</span>
                <span className="font-display italic text-h3" style={{ color: b.color }}>{b.name}</span>
              </Row>
              <Row label="Epoche">
                <span className="text-body text-ink/80">{a.era}</span>
                <span className="text-body text-ink/80">{b.era}</span>
              </Row>
              <Row label="Lebensdaten">
                <span className="text-body font-mono text-muted">{a.life}</span>
                <span className="text-body font-mono text-muted">{b.life}</span>
              </Row>
              <Row label="Zitat">
                <span className="text-lede font-display italic text-ink/85">„{a.quote}"</span>
                <span className="text-lede font-display italic text-ink/85">„{b.quote}"</span>
              </Row>
              <Row label="Ideen">
                <span className="flex flex-wrap gap-1.5">
                  {a.ideas.map((i) => (
                    <span key={i} className="text-meta px-2 py-0.5 rounded-full font-mono" style={{ background: `${a.color}1a`, color: a.color, border: `1px solid ${a.color}44` }}>{i}</span>
                  ))}
                </span>
                <span className="flex flex-wrap gap-1.5">
                  {b.ideas.map((i) => (
                    <span key={i} className="text-meta px-2 py-0.5 rounded-full font-mono" style={{ background: `${b.color}1a`, color: b.color, border: `1px solid ${b.color}44` }}>{i}</span>
                  ))}
                </span>
              </Row>
              {(a.works.length > 0 || b.works.length > 0) && (
                <Row label="Werke">
                  <span className="flex flex-col gap-1.5">
                    {a.works.map((w) => (
                      <span key={w} className="text-body text-ink/70 font-display italic bg-white/[0.02] border-l-2 border-violet/30 px-2.5 py-1 rounded-r">{w}</span>
                    ))}
                  </span>
                  <span className="flex flex-col gap-1.5">
                    {b.works.map((w) => (
                      <span key={w} className="text-body text-ink/70 font-display italic bg-white/[0.02] border-l-2 border-violet/30 px-2.5 py-1 rounded-r">{w}</span>
                    ))}
                  </span>
                </Row>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
