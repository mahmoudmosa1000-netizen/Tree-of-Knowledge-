import type { Philosopher } from "@/types";

/**
 * Erzeugt eine quadratische, teilbare Zitat-Karte (1080×1080, social-media-tauglich)
 * und löst entweder den nativen Share-Dialog aus (Mobile) oder einen Download (Desktop).
 */
export async function exportQuoteCard(p: Philosopher): Promise<void> {
  const size = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Sicherstellen, dass Fraunces/Inter/Mono bereits geladen sind, bevor wir zeichnen
  try {
    await document.fonts.ready;
  } catch {
    /* ignore */
  }

  const displayFont =
    getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() || "Georgia, serif";
  const bodyFont =
    getComputedStyle(document.documentElement).getPropertyValue("--font-body").trim() || "sans-serif";
  const monoFont =
    getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace";

  // Hintergrund
  ctx.fillStyle = "#03050A";
  ctx.fillRect(0, 0, size, size);

  // Radialer Glühschein in der Farbe des Philosophen
  const glow = ctx.createRadialGradient(size / 2, size * 0.38, 0, size / 2, size * 0.38, size * 0.75);
  glow.addColorStop(0, `${p.color}33`);
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  // Feine Sternenpartikel für Atmosphäre
  ctx.fillStyle = "rgba(150,205,255,0.35)";
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 1.3;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Illuminierte Initiale
  ctx.textAlign = "center";
  ctx.fillStyle = p.color;
  ctx.font = `italic 500 160px ${displayFont}`;
  ctx.shadowColor = p.color;
  ctx.shadowBlur = 40;
  ctx.fillText(p.name.charAt(0), size / 2, 260);
  ctx.shadowBlur = 0;

  // Zitat, zentriert und umgebrochen
  ctx.fillStyle = "#DCE9FF";
  ctx.font = `italic 400 52px ${displayFont}`;
  const quoteLines = wrapText(ctx, `„${p.quote}"`, size - 180);
  const lineHeight = 68;
  const quoteBlockHeight = quoteLines.length * lineHeight;
  let y = size / 2 - quoteBlockHeight / 2 + 20;
  quoteLines.forEach((line) => {
    ctx.fillText(line, size / 2, y);
    y += lineHeight;
  });

  // Name + Epoche
  ctx.font = `italic 600 40px ${displayFont}`;
  ctx.fillStyle = p.color;
  ctx.fillText(p.name, size / 2, size - 190);

  ctx.font = `400 22px ${monoFont}`;
  ctx.fillStyle = "#9FC3E8";
  ctx.fillText(`${p.era} · ${p.life}`, size / 2, size - 150);

  // App-Branding
  ctx.font = `italic 400 24px ${displayFont}`;
  ctx.fillStyle = "rgba(150,205,255,0.55)";
  ctx.fillText("Tree of Knowledge", size / 2, size - 70);

  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return;

  const fileName = `zitat-${p.id}.png`;
  const file = new File([blob], fileName, { type: "image/png" });

  // Mobile: nativer Share-Dialog, falls verfügbar
  if (typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `${p.name} — Tree of Knowledge`,
        text: `„${p.quote}" — ${p.name}`,
      });
      return;
    } catch {
      // Nutzer hat abgebrochen oder Share fehlgeschlagen -> Download-Fallback
    }
  }

  // Desktop-Fallback: Download auslösen
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}
