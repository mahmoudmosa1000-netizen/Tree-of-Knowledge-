"use client";

// Feste, deterministische Platzhalter-Positionen, die grob eine Baumkrone andeuten —
// bewusst nicht an echte Daten gebunden, da die Skeleton-Ansicht erscheint, bevor
// die API überhaupt geantwortet hat.
const SKELETON_NODES = [
  { x: 500, y: 60 }, { x: 420, y: 90 }, { x: 580, y: 90 }, { x: 350, y: 130 },
  { x: 460, y: 120 }, { x: 540, y: 120 }, { x: 650, y: 130 }, { x: 300, y: 180 },
  { x: 390, y: 170 }, { x: 500, y: 160 }, { x: 610, y: 170 }, { x: 700, y: 180 },
  { x: 260, y: 240 }, { x: 350, y: 230 }, { x: 440, y: 220 }, { x: 560, y: 220 },
  { x: 650, y: 230 }, { x: 740, y: 240 }, { x: 320, y: 300 }, { x: 420, y: 290 },
  { x: 580, y: 290 }, { x: 680, y: 300 },
];

export default function TreeSkeleton() {
  return (
    <div className="fixed inset-0 flex flex-col" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Baum wird geladen…</span>

      {/* Skeleton-Header */}
      <div className="h-16 flex items-center gap-3 px-4 sm:px-6 bg-bg/70 border-b border-violet/10">
        <div className="w-24 h-4 rounded-full bg-white/[0.06] animate-pulse" />
        <div className="hidden sm:flex gap-2 ml-4">
          {[16, 20, 18, 16, 14].map((w, i) => (
            <div
              key={i}
              className="h-6 rounded-full bg-white/[0.05] animate-pulse"
              style={{ width: `${w * 4}px`, animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
        <div className="ml-auto w-40 h-7 rounded-full bg-white/[0.05] animate-pulse hidden sm:block" />
      </div>

      {/* Skeleton-Baum */}
      <div className="flex-1 relative">
        <svg viewBox="0 0 1000 460" className="w-full h-full" aria-hidden="true">
          <rect x="470" y="380" width="60" height="80" fill="#161b2c" rx="8" opacity="0.6" />
          {SKELETON_NODES.map((n, i) => (
            <g key={i}>
              <line
                x1={500}
                y1={420}
                x2={n.x}
                y2={n.y}
                stroke="#161b2c"
                strokeWidth={1}
                opacity={0.4}
              />
              <circle
                cx={n.x}
                cy={n.y}
                r={9}
                fill="#1e2540"
                className="animate-pulse"
                style={{ animationDelay: `${(i % 8) * 0.1}s`, animationDuration: "1.8s" }}
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
