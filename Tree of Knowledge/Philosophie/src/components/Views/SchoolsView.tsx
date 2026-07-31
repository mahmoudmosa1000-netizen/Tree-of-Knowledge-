"use client";

import { useMemo, useState } from "react";
import schoolsData from "@/data/schools.json";
import type { Philosopher, School } from "@/types";
import { useTreeStore } from "@/stores/treeStore";

const SCHOOLS = schoolsData as School[];

const CATEGORY_COLORS: Record<string, string> = {
  philosophisch: "#96CDFF",
  wirtschaftlich: "#FFBE78",
  politisch: "#7BAE6E",
  religiös: "#E879F9",
};

interface Pos {
  x: number;
  y: number;
}

/** Klassisches Baum-Layout: Blätter zuerst nacheinander platzieren, Eltern auf den
 *  Mittelwert ihrer Kinder setzen — ergibt ein sauber zentriertes Diagramm. */
function computeLayout(schools: School[]): Record<string, Pos> {
  const children: Record<string, string[]> = {};
  schools.forEach((s) => {
    const key = s.parent ?? "__root__";
    children[key] = children[key] || [];
    children[key].push(s.id);
  });
  const byId = Object.fromEntries(schools.map((s) => [s.id, s]));
  const pos: Record<string, Pos> = {};
  const LEVEL_H = 130;
  const LEAF_W = 190;
  let leafCounter = 0;

  function place(id: string, depth: number) {
    pos[id] = { x: 0, y: 70 + depth * LEVEL_H };
    const kids = children[id] || [];
    if (kids.length === 0) {
      pos[id].x = 90 + leafCounter * LEAF_W;
      leafCounter++;
    } else {
      kids.forEach((k) => place(k, depth + 1));
      const xs = kids.map((k) => pos[k].x);
      pos[id].x = xs.reduce((a, b) => a + b, 0) / xs.length;
    }
  }
  (children["__root__"] || []).forEach((r) => place(r, 0));
  return pos;
}

interface Props {
  philosophers: Philosopher[];
}

export default function SchoolsView({ philosophers }: Props) {
  const select = useTreeStore((s) => s.select);
  const [activeId, setActiveId] = useState<string | null>(null);
  const pos = useMemo(() => computeLayout(SCHOOLS), []);
  const byId = useMemo(() => Object.fromEntries(SCHOOLS.map((s) => [s.id, s])), []);
  const phById = useMemo(() => Object.fromEntries(philosophers.map((p) => [p.id, p])), [philosophers]);

  const maxX = Math.max(...Object.values(pos).map((p) => p.x)) + 150;
  const maxY = Math.max(...Object.values(pos).map((p) => p.y)) + 80;
  const active = activeId ? byId[activeId] : null;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg
        viewBox={`0 0 ${Math.max(maxX, 900)} ${Math.max(maxY, 480)}`}
        className="w-full h-full"
        role="group"
        aria-label="Stammbaum der Denkrichtungen"
      >
        {/* Verbindungslinien */}
        {SCHOOLS.filter((s) => s.parent).map((s) => {
          const p1 = pos[s.parent!];
          const p2 = pos[s.id];
          const midY = (p1.y + p2.y) / 2;
          return (
            <path
              key={`link-${s.id}`}
              d={`M${p1.x},${p1.y + 18} C${p1.x},${midY} ${p2.x},${midY} ${p2.x},${p2.y - 18}`}
              stroke="rgba(150,205,255,0.3)"
              strokeWidth={1.5}
              fill="none"
              aria-hidden="true"
            />
          );
        })}

        {/* Knoten */}
        {SCHOOLS.map((s) => {
          const p = pos[s.id];
          const c = CATEGORY_COLORS[s.category] ?? "#96CDFF";
          const isActive = s.id === activeId;
          const w = Math.max(120, s.name.length * 7.5 + 30);
          return (
            <g
              key={s.id}
              transform={`translate(${p.x - w / 2}, ${p.y - 18})`}
              style={{ cursor: "pointer" }}
              onClick={() => setActiveId(s.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveId(s.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${s.name}, ${s.category}, ca. ${s.year < 0 ? Math.abs(s.year) + " v. Chr." : s.year}`}
            >
              <rect
                width={w}
                height={36}
                rx={18}
                fill={`${c}22`}
                stroke={c}
                strokeWidth={isActive ? 2 : 1}
                className="transition-[filter] duration-150 hover:brightness-125"
                style={{ filter: isActive ? "brightness(1.4)" : undefined }}
              />
              <text
                x={w / 2}
                y={23}
                textAnchor="middle"
                fill={c}
                fontSize={11.5}
                fontFamily="var(--font-mono), monospace"
                fontWeight={600}
                style={{ pointerEvents: "none" }}
              >
                {s.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legende */}
      <div className="absolute bottom-5 right-5 bg-bg-raised/85 border border-white/10 rounded-lg px-3.5 py-3 text-meta font-mono flex flex-col gap-1.5">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-2 text-ink/70">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
            {cat}
          </div>
        ))}
      </div>

      {/* Detail-Panel */}
      {active && (
        <div className="glass-panel absolute bottom-0 left-0 right-0 bg-bg-raised/95 border-t border-violet/25 backdrop-blur-xl px-6 py-5 max-h-[38vh] overflow-y-auto animate-fade-in-up">
          <div
            className="text-label font-mono mb-1.5"
            style={{ color: CATEGORY_COLORS[active.category] }}
          >
            {active.category} · ca. {active.year < 0 ? `${Math.abs(active.year)} v. Chr.` : active.year}
          </div>
          <div className="font-display italic text-h2 text-ink mb-2">{active.name}</div>
          <p className="text-body text-muted leading-relaxed mb-3 max-w-2xl">{active.desc}</p>
          <div className="flex flex-wrap gap-2">
            {active.founders.map((fid) => {
              const p = phById[fid];
              if (!p) return null;
              return (
                <button
                  key={fid}
                  onClick={() => select(fid)}
                  className="text-meta font-mono px-3 py-1.5 rounded-full flex items-center gap-2 hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-violet-bright/50 outline-none"
                  style={{ color: p.color }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: p.color, boxShadow: `0 0 5px ${p.color}` }}
                  />
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
