/**
 * Kleiner Streaming-Client für eine lokale Ollama-Instanz.
 * Wird server-seitig von /api/ai/route.ts verwendet, um CORS-Probleme
 * des Browsers mit http://localhost:11434 zu umgehen.
 */

export interface OllamaChatOptions {
  baseUrl: string; // z.B. http://localhost:11434
  model: string; // z.B. "llama3"
  systemPrompt: string;
  userMessage: string;
}

export async function* streamOllamaChat({
  baseUrl,
  model,
  systemPrompt,
  userMessage,
}: OllamaChatOptions): AsyncGenerator<string> {
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Ollama antwortet mit Status ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const json = JSON.parse(line);
        const chunk: string | undefined = json?.message?.content;
        if (chunk) yield chunk;
        if (json?.done) return;
      } catch {
        // unvollständige Zeile ignorieren
      }
    }
  }
}
