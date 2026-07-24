/**
 * Seed-Skript für Tree of Knowledge
 * Lädt die Philosophen-Daten (extrahiert aus der Standalone index.html)
 * und schreibt sie inklusive Einfluss-Netzwerk in die Datenbank.
 *
 * Ausführen mit: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import raw from "./philosophers-seed.json";

const prisma = new PrismaClient();

interface RawPhilosopher {
  id: string;
  by: number;
  name: string;
  s: string;
  life: string;
  era: string;
  x: number;
  y: number;
  c: string;
  ideas: string[];
  quote: string;
  inf: string[];
  bio: string;
  bio_en?: string;
  works: string[];
  wiki?: string;
}

async function main() {
  const philosophers = raw as RawPhilosopher[];
  console.log(`Seeding ${philosophers.length} Philosophen …`);

  // 1) Philosophen anlegen
  for (const p of philosophers) {
    await prisma.philosopher.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        shortName: p.s,
        life: p.life,
        era: p.era,
        birthYear: p.by,
        x: p.x,
        y: p.y,
        color: p.c,
        quote: p.quote,
        bio: p.bio,
        bioEn: p.bio_en ?? null,
        ideas: p.ideas ?? [],
        works: p.works ?? [],
        wiki: p.wiki ?? null,
      },
    });
  }

  // 2) Einfluss-Netzwerk anlegen (a beeinflusst b)
  let influenceCount = 0;
  for (const p of philosophers) {
    for (const targetId of p.inf ?? []) {
      const targetExists = philosophers.some((x) => x.id === targetId);
      if (!targetExists) continue;
      await prisma.influence.upsert({
        where: { fromId_toId: { fromId: p.id, toId: targetId } },
        update: {},
        create: { fromId: p.id, toId: targetId },
      });
      influenceCount++;
    }
  }

  console.log(`✓ ${philosophers.length} Philosophen, ${influenceCount} Einflüsse gespeichert.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
