"use client";

import type { Philosopher } from "@/types";
import { useTreeStore } from "@/stores/treeStore";

interface Props {
  philosophers: Philosopher[];
}

/**
 * Baum-Ansicht: jeder Philosoph erscheint als leuchtender Apfel
 * an seiner in den Daten hinterlegten (x, y) Position.
 */
export default function TreeSVG({ philosophers }: Props) {
  const { select, selectedId, learned, search } = useTreeStore();

  const query = search.trim().toLowerCase();
  const hasMatches = !query || philosophers.some((p) => p.name.toLowerCase().includes(query));

  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 1000 460" className="w-full h-full" role="group" aria-label="Baum der Philosophen, jeder Knoten ist auswählbar">
        <defs>
          <radialGradient id="trunk" cx="50%" cy="0%" r="100%">
            <stop offset="0%" stopColor="#3a2415" />
            <stop offset="100%" stopColor="#1a0f08" />
          </radialGradient>
        </defs>

        {/* Stamm */}
        <rect x="470" y="380" width="60" height="80" fill="url(#trunk)" rx="8" aria-hidden="true" />

        {/* Äste (grob, verbinden Zentrum mit jedem Philosophen) — Grünton für Wachstum */}
        {philosophers.map((p) => (
          <line
            key={`branch-${p.id}`}
            x1={500}
            y1={420}
            x2={p.x}
            y2={p.y}
            stroke="#1e3a52"
            strokeWidth={1.2}
            opacity={0.55}
            aria-hidden="true"
          />
        ))}

        {/* Äpfel / Philosophen — echte Buttons: klickbar, tastaturbedienbar, für Screenreader benannt */}
        {philosophers.map((p, i) => {
          const dim = query && !p.name.toLowerCase().includes(query);
          const isSelected = p.id === selectedId;
          const isLearned = !!learned[p.id];

          return (
            <g
              key={p.id}
              transform={`translate(${p.x}, ${p.y})`}
              opacity={dim ? 0.15 : 1}
              style={{ cursor: "pointer", transition: "opacity 0.3s ease" }}
              onClick={() => select(p.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  select(p.id);
                }
              }}
              role="button"
              tabIndex={dim ? -1 : 0}
              aria-label={`${p.name}, ${p.era}, ${p.life}${isLearned ? ", als gelernt markiert" : ""}`}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <circle r={19} fill="none" stroke={p.color} strokeWidth={1.5} strokeDasharray="3 3" opacity={0.7} />
              )}
              {/* Eigene Gruppe für die Sway-Animation, damit die Positionierung des äußeren <g> unangetastet bleibt */}
              <g
                className="animate-sway"
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  animationDelay: `${(i % 7) * 0.35}s`,
                  animationDuration: `${4 + (i % 5) * 0.4}s`,
                }}
              >
                <circle
                  r={isSelected ? 14 : 10}
                  fill={p.color}
                  style={{
                    filter: `drop-shadow(0 0 8px ${p.color})`,
                    transition: "r 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                />
                {isLearned && (
                  <text x="12" y="-8" fontSize="10" fill="#FFBE78" aria-hidden="true">
                    ✓
                  </text>
                )}
              </g>
              <text
                x="0"
                y="22"
                textAnchor="middle"
                fontSize="9"
                fill="#9FC3E8"
                fontFamily="var(--font-mono), monospace"
                aria-hidden="true"
              >
                {p.shortName}
              </text>
            </g>
          );
        })}
      </svg>

      {!hasMatches && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
          <div className="text-center animate-fade-in">
            <p className="font-display italic text-h3 text-muted mb-1">Keine Treffer</p>
            <p className="text-meta text-muted/70">
              Niemand im Baum trägt „{search.trim()}" im Namen.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
