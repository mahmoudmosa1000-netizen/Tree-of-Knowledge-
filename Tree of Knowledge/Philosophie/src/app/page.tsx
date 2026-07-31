"use client";

import { useEffect, useState } from "react";
import Header from "@/components/UI/Header";
import IntroOverlay from "@/components/UI/IntroOverlay";
import CompareView from "@/components/UI/CompareView";
import TreeSkeleton from "@/components/UI/TreeSkeleton";
import Sidebar from "@/components/Sidebar/Sidebar";
import TreeSVG from "@/components/Tree/TreeSVG";
import MindMapView from "@/components/Views/MindMapView";
import TimelineView from "@/components/Views/TimelineView";
import QuizView from "@/components/Views/QuizView";
import SchoolsView from "@/components/Views/SchoolsView";
import { useTreeStore } from "@/stores/treeStore";
import type { Philosopher, ViewMode } from "@/types";

type ApiPhilosopher = Philosopher & { influences: string[] };

export default function Page() {
  const { view, setView, select, selectedId, compareIds, compareOpen, setCompareOpen } = useTreeStore();
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
        s: "schools",
      };
      const key = e.key.toLowerCase();
      if (map[key]) setView(map[key]);
      if (key === "r" && philosophers.length > 0) {
        const pick = philosophers[Math.floor(Math.random() * philosophers.length)];
        setView("tree");
        select(pick.id);
      }
      if (e.key === "Escape") select(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setView, select, philosophers]);

  const selected = philosophers.find((p) => p.id === selectedId) ?? null;

  if (loading) {
    return (
      <>
        <IntroOverlay />
        <TreeSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        <IntroOverlay />
        <div
          className="fixed inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center"
          role="alert"
        >
          <p className="text-ember font-mono text-body">⚠ {error}</p>
          <p className="text-muted text-meta">
            Läuft die Datenbank? Alternativ die Standalone <code>index.html</code> öffnen.
          </p>
        </div>
      </>
    );
  }

  return (
    <main className="fixed inset-0">
      <IntroOverlay />
      <Header philosophers={philosophers} />

      <div className="absolute inset-0 pt-16">
        <div key={view} className="w-full h-full animate-fade-in-up">
          {view === "tree" && <TreeSVG philosophers={philosophers} />}
          {view === "mindmap" && <MindMapView philosophers={philosophers} />}
          {view === "timeline" && <TimelineView philosophers={philosophers} />}
          {view === "galaxy" && <MindMapView philosophers={philosophers} />}
          {view === "quiz" && <QuizView philosophers={philosophers} />}
          {view === "schools" && <SchoolsView philosophers={philosophers} />}
        </div>
      </div>

      <Sidebar philosopher={selected} />
      <CompareView philosophers={philosophers} />

      {compareIds.length === 2 && !compareOpen && (
        <button
          onClick={() => setCompareOpen(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 text-body px-5 py-2.5 rounded-full bg-gold/15 border border-gold/40 text-gold-bright hover:bg-gold/25 transition-colors backdrop-blur-xl shadow-lg animate-pop-in focus-visible:ring-2 focus-visible:ring-gold-bright/50 outline-none"
        >
          ⚖ Vergleich anzeigen
        </button>
      )}
    </main>
  );
}
