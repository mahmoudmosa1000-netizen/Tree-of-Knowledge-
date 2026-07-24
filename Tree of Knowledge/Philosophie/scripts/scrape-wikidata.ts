/**
 * Auto-Scraper: lädt Philosophen (Q4964182 = "philosopher") von Wikidata
 * via SPARQL und ergänzt/aktualisiert sie in der Datenbank.
 *
 * Ausführen mit: npx ts-node scripts/scrape-wikidata.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";

const QUERY = `
SELECT ?person ?personLabel ?dob ?bioLabel WHERE {
  ?person wdt:P106 wd:Q4964182.       # Beruf: Philosoph
  ?person wdt:P569 ?dob.              # Geburtsdatum
  OPTIONAL { ?person wdt:P135 ?bio. } # philosophische Richtung
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}
ORDER BY ?dob
LIMIT 80
`;

interface WikidataRow {
  person: { value: string };
  personLabel: { value: string };
  dob: { value: string };
  bioLabel?: { value: string };
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24);
}

async function main() {
  console.log("Frage Wikidata nach Philosophen an …");

  const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(QUERY)}&format=json`;
  const res = await fetch(url, {
    headers: { "User-Agent": "TreeOfKnowledge/1.0 (educational project)" },
  });

  if (!res.ok) {
    throw new Error(`Wikidata antwortet mit Status ${res.status}`);
  }

  const json = (await res.json()) as { results: { bindings: WikidataRow[] } };
  const rows = json.results.bindings;

  console.log(`Gefunden: ${rows.length} Philosophen. Importiere …`);

  let imported = 0;
  for (const row of rows) {
    const name = row.personLabel.value;
    const id = slugify(name);
    if (!id) continue;

    const year = new Date(row.dob.value).getUTCFullYear();
    const wikiTitle = row.personLabel.value.replace(/ /g, "_");

    await prisma.philosopher.upsert({
      where: { id },
      update: {},
      create: {
        id,
        name,
        shortName: name.split(" ").pop() ?? name,
        life: `${year}`,
        era: row.bioLabel?.value ?? "Unbekannt",
        birthYear: year,
        x: 500 + (Math.random() - 0.5) * 800,
        y: 100 + Math.random() * 350,
        color: "#8899AA",
        quote: "",
        bio: "",
        ideas: [],
        works: [],
        wiki: wikiTitle,
      },
    });
    imported++;
  }

  console.log(`✓ ${imported} Philosophen importiert/aktualisiert.`);
}

main()
  .catch((e) => {
    console.error("Scraper-Fehler:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
