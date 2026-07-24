import { NextRequest } from "next/server";
import { streamOllamaChat } from "@/lib/ollama";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { message, philosopherName, ollamaUrl, model } = await req.json();

  if (!message || !philosopherName) {
    return new Response("message und philosopherName sind erforderlich", {
      status: 400,
    });
  }

  const systemPrompt = `Du bist ${philosopherName}, ein Philosoph. Antworte im Stil und aus der Perspektive dieses Denkers, verständlich und in kurzen Absätzen auf Deutsch.`;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of streamOllamaChat({
          baseUrl: ollamaUrl || "http://localhost:11434",
          model: model || "llama3",
          systemPrompt,
          userMessage: message,
        })) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            "\n[Fehler: Ollama nicht erreichbar. Bitte lokal `OLLAMA_ORIGINS=* ollama serve` starten.]"
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
