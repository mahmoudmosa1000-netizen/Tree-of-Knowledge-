"use client";

import { useState } from "react";
import type { AIChatMessage, Philosopher } from "@/types";
import { useTreeStore } from "@/stores/treeStore";

interface Props {
  philosopher: Philosopher;
}

export default function AIChat({ philosopher }: Props) {
  const ollamaUrl = useTreeStore((s) => s.ollamaUrl);
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const question = input.trim();
    if (!question || loading) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content: question }]);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          philosopherName: philosopher.name,
          ollamaUrl,
        }),
      });

      if (!res.body) throw new Error("Kein Stream verfügbar");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: copy[copy.length - 1].content + chunk,
          };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "⚠ Ollama nicht erreichbar. Prüfe ⚙ Ollama-Einstellungen.",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-violet/15 pt-4">
      <div className="text-label text-violet-bright/80 font-mono font-semibold mb-2.5">
        🦙 Frag {philosopher.name}
      </div>

      <div className="flex flex-col gap-2 mb-3 max-h-52 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-body px-3 py-2 rounded-lg ${
              m.role === "user"
                ? "bg-violet/20 text-violet-bright self-end"
                : "bg-white/[0.04] text-ink/80 font-display italic"
            }`}
          >
            {m.content || (loading && i === messages.length - 1 ? "…" : "")}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={`Was würde ${philosopher.shortName} sagen?`}
          aria-label={`Frage an ${philosopher.name}`}
          className="flex-1 bg-white/5 border border-violet/25 rounded-lg px-3 py-1.5 text-body text-ink placeholder:text-muted outline-none focus-visible:border-violet-bright focus-visible:ring-2 focus-visible:ring-violet-bright/40"
        />
        <button
          onClick={send}
          disabled={loading}
          aria-label="Frage senden"
          className="text-body px-3 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold-bright disabled:opacity-40 hover:bg-gold/25 transition-colors focus-visible:ring-2 focus-visible:ring-gold-bright/50 outline-none"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
