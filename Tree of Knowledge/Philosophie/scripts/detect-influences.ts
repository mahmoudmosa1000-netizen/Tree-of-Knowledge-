/**
 * Erkennt automatisch mögliche Einflüsse zwischen Philosophen:
 * - Nur spätere Philosophen können frühere beeinflusst haben (Geburtsjahr).
 * - Gewichtung nach Anzahl gemeinsamer Ideen/Schlagworte.
 *
 * Ausführen mit: npx ts-node scripts/detect-influences.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MIN_SHARED_IDEAS = 1;
const MAX_YEAR_GAP = 150; // Einfluss wird unwahrscheinlicher je größer der Abstand

function sharedIdeaCount(a: string[], b: string[]): number {
  const setB = new Set(b.map((x) => x.toLowerCase()));
  return a.filter((x) => setB.has(x.toLowerCase())).length;
}

async function main() {
  const philosophers = await prisma.philosopher.findMany();
  console.log(`Analysiere ${philosophers.length} Philosophen auf mögliche Einflüsse …`);

  let created = 0;

  for (const later of philosophers) {
    for (const earlier of philosophers) {
      if (later.id === earlier.id) continue;
      if (later.birthYear <= earlier.birthYear) continue; // später geboren = möglicher Nachfolger
      if (later.birthYear - earlier.birthYear > MAX_YEAR_GAP) continue;

      const shared = sharedIdeaCount(later.ideas, earlier.ideas);
      if (shared < MIN_SHARED_IDEAS) continue;

      const exists = await prisma.influence.findUnique({
        where: { fromId_toId: { fromId: earlier.id, toId: later.id } },
      });
      if (exists) continue;

      await prisma.influence.create({
        data: { fromId: earlier.id, toId: later.id },
      });
      created++;
      console.log(`  + ${earlier.name} → ${later.name} (${shared} gemeinsame Ideen)`);
    }
  }

  console.log(`✓ ${created} neue Einfluss-Beziehungen erkannt und gespeichert.`);
}

main()
  .catch((e) => {
    console.error("Fehler bei der Einfluss-Erkennung:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
