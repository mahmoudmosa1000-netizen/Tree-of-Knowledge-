"use client";

import { useMemo, useState } from "react";
import type { Philosopher } from "@/types";

interface Props {
  philosophers: Philosopher[];
}

function buildQuiz(philosophers: Philosopher[]) {
  const pool = philosophers.filter((p) => p.quote);
  return pool.map((p) => {
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
  const quiz = useMemo(() => buildQuiz(philosophers), [philosophers]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  if (quiz.length === 0) return null;
  const q = quiz[index % quiz.length];

  const pick = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    if (opt === q.correct) setScore((s) => s + 1);
  };

  const next = () => {
    setPicked(null);
    setIndex((i) => i + 1);
  };

  return (
    <div className="w-full h-full flex items-center justify-center px-6">
      <div key={index} className="max-w-xl w-full bg-bg-raised/60 border border-violet/25 rounded-2xl p-7 backdrop-blur-sm animate-fade-in-up">
        <div className="text-label text-sage font-mono mb-4">
          Frage {(index % quiz.length) + 1} · Punkte: {score}
        </div>
        <h3 className="font-display text-h2 text-ink mb-7 leading-snug">{q.question}</h3>

        <div className="flex flex-col gap-2">
          {q.options.map((opt, i) => {
            const isCorrect = picked && opt === q.correct;
            const isWrong = picked === opt && opt !== q.correct;
            return (
              <button
                key={opt}
                onClick={() => pick(opt)}
                className={`text-left text-body px-4 py-2.5 rounded-lg border transition-colors font-mono ${
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
            onClick={next}
            className="mt-7 text-meta px-4 py-2 rounded-full bg-gold/15 border border-gold/40 text-gold-bright hover:bg-gold/25 transition-colors animate-pop-in"
          >
            Nächste Frage (N) →
          </button>
        )}
      </div>
    </div>
  );
}
