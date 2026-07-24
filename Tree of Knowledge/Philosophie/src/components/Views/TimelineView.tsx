"use client";

import type { Philosopher } from "@/types";
import { useTreeStore } from "@/stores/treeStore";

interface Props {
  philosophers: Philosopher[];
}

export default function TimelineView({ philosophers }: Props) {
  const select = useTreeStore((s) => s.select);
  const sorted = [...philosophers].sort((a, b) => a.birthYear - b.birthYear);

  let lastEra = "";

  return (
    <div className="w-full h-full overflow-y-auto px-6 py-10">
      <div className="relative max-w-2xl mx-auto border-l border-violet/25 pl-8">
        {sorted.map((p, i) => {
          const showEraHeader = p.era !== lastEra;
          lastEra = p.era;
          const delay = Math.min(i * 0.045, 0.55);

          return (
            <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${delay}s` }}>
              {showEraHeader && (
                <div className="relative -ml-8 pl-8 mb-4 mt-10 first:mt-0">
                  <span
                    className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2"
                    style={{ borderColor: p.color, background: "#03050A" }}
                  />
                  <div className="flex items-center gap-3">
                    <h3
                      className="font-display italic text-h3 shrink-0"
                      style={{ color: p.color }}
                    >
                      {p.era}
                    </h3>
                    <span className="h-px flex-1" style={{ background: `${p.color}33` }} />
                  </div>
                </div>
              )}

              <button
                onClick={() => select(p.id)}
                className="relative block text-left mb-9 w-full group"
              >
                <span
                  className="absolute -left-[38px] top-1.5 w-2.5 h-2.5 rounded-full transition-transform duration-300 group-hover:scale-125"
                  style={{ background: p.color, boxShadow: `0 0 8px ${p.color}` }}
                />
                <div className="text-label text-sage font-mono mb-1">
                  {p.era} · {p.life}
                </div>
                <div className="font-display text-h2 text-ink group-hover:text-gold-bright transition-colors duration-300">
                  {p.name}
                </div>
                <div className="text-lede text-muted font-display italic mt-1">
                  „{p.quote}"
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
