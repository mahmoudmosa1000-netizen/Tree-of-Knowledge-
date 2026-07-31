"use client";

import { useEffect, useMemo, useState } from "react";
import type { Philosopher } from "@/types";
import { useTreeStore } from "@/stores/treeStore";
import { useMagnetic } from "@/lib/useMagnetic";
import KineticText from "@/components/UI/KineticText";

interface Props {
  philosophers: Philosopher[];
}

function buildQuiz(philosophers: Philosopher[], query: string) {
  const pool = philosophers.filter((p) => p.quote);
  const targets = query
    ? pool.filter((p) => p.name.toLowerCase().includes(query))
    : pool;
  return targets.map((p) => {
    const distractors = pool
      .filter((x) => x.id !== p.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((x) => x.name);
    const options = [...distractors, p.name].sort(() => Math.random() - 0.5);
    return {
      id: p.id,
      question: `Von wem stammt das Zitat: „${p.quote}"?`,
      options,
      correct: p.name,
    };
  });
}

export default function QuizView({ philosophers }: Props) {
  const search = useTreeStore((s) => s.search);
  const query = search.trim().toLowerCase();
  const quiz = useMemo(() => buildQuiz(philosophers, query), [philosophers, query]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const nextMagnet = useMagnetic({ strength: 0.35, maxOffset: 9 });

  const q = quiz.length > 0 ? quiz[index % quiz.length] : null;

  const pick = (opt: string) => {
    if (picked || !q) return;
    setPicked(opt);
    if (opt === q.correct) setScore((s) => s + 1);
  };

  const next = () => {
    setPicked(null);
    setIndex((i) => i + 1);
  };

  // Tastaturkürzel wie im README dokumentiert: 1-4 wählt Antwort, N/Leertaste = nächste Frage
  useEffect(() => {
    if (!q) return;
    const onKey = (e: KeyboardEvent) => {
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= q.options.length) {
        pick(q.options[num - 1]);
      } else if ((e.key === "n" || e.key === "N" || e.key === " ") && picked) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, picked]);

  if (!q) {
    return (
      <div className="w-full h-full flex items-center justify-center px-6">
        <div className="text-center animate-fade-in">
          <p className="font-display italic text-h3 text-muted mb-1">Keine Treffer</p>
          <p className="text-meta text-muted/70">
            Kein Zitat von jemandem mit „{search.trim()}" im Namen verfügbar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center px-6">
      <div key={index} className="glass-panel-gold max-w-xl w-full bg-bg-raised/50 border border-violet/15 rounded-2xl p-7 backdrop-blur-xl animate-fade-in-up">
        <div className="text-label text-sage font-mono mb-4">
          Frage {(index % quiz.length) + 1} / {quiz.length} · Punkte: {score}
        </div>
        <KineticText
          text={q.question}
          wordDelay={0.025}
          as="h3"
          className="font-display text-h2 text-ink mb-7 leading-snug"
        />

        <div className="flex flex-col gap-2">
          {q.options.map((opt, i) => {
            const isCorrect = picked && opt === q.correct;
            const isWrong = picked === opt && opt !== q.correct;
            return (
              <button
                key={opt}
                onClick={() => pick(opt)}
                className={`text-left text-body px-4 py-2.5 rounded-lg border transition-colors font-mono focus-visible:ring-2 focus-visible:ring-violet-bright/50 outline-none ${
                  isCorrect
                    ? "border-sage/60 bg-sage/10 text-sage animate-pulse-correct"
                    : isWrong
                    ? "border-ember/60 bg-ember/10 text-ember animate-shake"
                    : "border-white/10 text-ink/80 hover:border-violet-bright/40"
                }`}
              >
                {i + 1}. {opt}
              </button>
            );
          })}
        </div>

        {picked && (
          <button
            ref={nextMagnet.ref as React.RefObject<HTMLButtonElement>}
            onMouseMove={nextMagnet.onMouseMove}
            onMouseLeave={nextMagnet.onMouseLeave}
            onClick={next}
            className="mt-7 text-meta px-4 py-2 rounded-full bg-gold/15 border border-gold/40 text-gold-bright hover:bg-gold/25 transition-[background,transform] duration-200 animate-pop-in focus-visible:ring-2 focus-visible:ring-gold-bright/50 outline-none"
          >
            Nächste Frage (N) →
          </button>
        )}
      </div>
    </div>
  );
}
