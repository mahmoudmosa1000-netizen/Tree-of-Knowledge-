"use client";

import { useEffect, useState } from "react";
import Header from "@/components/UI/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import TreeSVG from "@/components/Tree/TreeSVG";
import MindMapView from "@/components/Views/MindMapView";
import TimelineView from "@/components/Views/TimelineView";
import QuizView from "@/components/Views/QuizView";
import { useTreeStore } from "@/stores/treeStore";
import type { Philosopher, ViewMode } from "@/types";

type ApiPhilosopher = Philosopher & { influences: string[] };

export default function Page() {
  const { view, setView, select, selectedId } = useTreeStore();
  const [philosophers, setPhilosophers] = useState<ApiPhilosopher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Daten laden
  useEffect(() => {
    fetch("/api/philosophers")
      .then((r) => {
        if (!r.ok) throw new Error("API nicht erreichbar");
        return r.json();
      })
      .then((data) => setPhilosophers(data.philosophers))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Teilbare Links: #philosopher=kant&view=galaxy
  useEffect(() => {
    const hash = new URLSearchParams(location.hash.replace("#", ""));
    const p = hash.get("philosopher");
    const v = hash.get("view") as ViewMode | null;
    if (p) select(p);
    if (v) setView(v);
  }, [select, setView]);

  // Keyboard-Shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, ViewMode> = {
        t: "tree",
        m: "mindmap",
        l: "timeline",
        g: "galaxy",
        q: "quiz",
      };
      const key = e.key.toLowerCase();
      if (map[key]) setView(map[key]);
      if (e.key === "Escape") select(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setView, select]);

  const selected = philosophers.find((p) => p.id === selectedId) ?? null;

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-5">
        <div className="font-display italic text-gold text-initial animate-pulse">T</div>
        <div className="w-9 h-9 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
        <p className="text-gold-dim text-label font-mono uppercase">
          lädt …
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-ember font-mono text-body">⚠ {error}</p>
        <p className="text-muted text-meta">
          Läuft die Datenbank? Alternativ die Standalone <code>index.html</code> öffnen.
        </p>
      </div>
    );
  }

  return (
    <main className="fixed inset-0">
      <Header />

      <div className="absolute inset-0 pt-16">
        <div key={view} className="w-full h-full animate-fade-in-up">
          {view === "tree" && <TreeSVG philosophers={philosophers} />}
          {view === "mindmap" && <MindMapView philosophers={philosophers} />}
          {view === "timeline" && <TimelineView philosophers={philosophers} />}
          {view === "galaxy" && <MindMapView philosophers={philosophers} />}
          {view === "quiz" && <QuizView philosophers={philosophers} />}
        </div>
      </div>

      <Sidebar philosopher={selected} />
    </main>
  );
}
