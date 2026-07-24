import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const philosophers = await prisma.philosopher.findMany({
      include: {
        influences: { select: { toId: true } },
      },
      orderBy: { birthYear: "asc" },
    });

    const shaped = philosophers.map((p: (typeof philosophers)[number]) => ({
      id: p.id,
      name: p.name,
      shortName: p.shortName,
      life: p.life,
      era: p.era,
      birthYear: p.birthYear,
      x: p.x,
      y: p.y,
      color: p.color,
      quote: p.quote,
      bio: p.bio,
      bioEn: p.bioEn,
      ideas: p.ideas,
      works: p.works,
      wiki: p.wiki,
      influences: p.influences.map((i: { toId: string }) => i.toId),
    }));

    return NextResponse.json({ philosophers: shaped });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Philosophen konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}
