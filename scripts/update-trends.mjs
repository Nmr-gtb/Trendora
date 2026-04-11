/**
 * Script de mise à jour automatique des tendances Trendora
 * Appelé chaque dimanche à 23h59 via GitHub Actions
 *
 * Utilise l'API Anthropic (Claude) pour générer de nouvelles opportunités
 * et mettre à jour les tendances existantes.
 */

import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, "..", "src", "data.js");

// Lire les données actuelles
function parseCurrentData() {
  const content = readFileSync(DATA_PATH, "utf-8");
  const weekMatch = content.match(/export const WEEK_LABEL = "(.+?)"/);
  const currentWeekLabel = weekMatch ? weekMatch[1] : "";

  // Extraire le tableau OPPORTUNITIES via eval sécurisé
  const oppsMatch = content.match(
    /export const OPPORTUNITIES = (\[[\s\S]*\]);/
  );
  if (!oppsMatch) {
    throw new Error("Impossible de parser les données actuelles");
  }

  // eslint-disable-next-line no-eval
  const opportunities = eval(`(${oppsMatch[1]})`);
  return { opportunities, currentWeekLabel };
}

// Calculer la date du prochain lundi
function getNextMondayLabel() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);

  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  return `Semaine du ${nextMonday.getDate()} ${months[nextMonday.getMonth()]} ${nextMonday.getFullYear()}`;
}

async function updateTrends() {
  const client = new Anthropic();
  const { opportunities, currentWeekLabel } = parseCurrentData();
  const newWeekLabel = getNextMondayLabel();

  const existingNames = opportunities.map((o) => o.name);
  const maxId = Math.max(...opportunities.map((o) => o.id));

  const categories = ["tech", "sante", "immobilier", "btp", "marketing"];

  console.log(`Mise à jour : ${currentWeekLabel} → ${newWeekLabel}`);
  console.log(
    `${opportunities.length} opportunités existantes, max ID = ${maxId}`
  );

  // Demander à Claude de générer les mises à jour
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    messages: [
      {
        role: "user",
        content: `Tu es un analyste de tendances business. Tu dois mettre à jour un radar d'opportunités hebdomadaire.

CONTEXTE :
- Nous avons ${opportunities.length} opportunités existantes
- Le prochain ID libre est ${maxId + 1}
- Les catégories sont : ${categories.join(", ")}
- Chaque opportunité a un score sur 100 basé sur 5 critères :
  - demande (max 25) : volume de mentions et recherches
  - croissance (max 25) : vitesse de la tendance
  - concurrence (max 20) : moins = mieux
  - monetisation (max 15) : potentiel de revenus
  - faisabilite (max 15) : facilité à lancer un MVP

TACHE :
1. Génère 3 NOUVELLES opportunités business réalistes et actuelles (pas des copies des existantes).
   Chaque nouvelle opportunité doit être dans une catégorie différente.
   weekTrend = "new" pour les nouvelles.

2. Choisis 5 opportunités existantes au hasard qui passent de "stable" à "up" ou de "new" à "up".

Voici les noms existants (ne les duplique PAS) :
${existingNames.map((n) => `- ${n}`).join("\n")}

IMPORTANT : Le score total doit être la somme des 5 sous-scores. Sois réaliste — pas de scores > 90 sauf si justifié.

Réponds UNIQUEMENT avec un JSON valide, pas de markdown, pas de texte autour. Format :
{
  "new_opportunities": [
    {
      "id": ${maxId + 1},
      "name": "...",
      "category": "tech|sante|immobilier|btp|marketing",
      "score": 78,
      "scores": { "demande": 20, "croissance": 18, "concurrence": 16, "monetisation": 12, "faisabilite": 12 },
      "trend": "+120%",
      "market": "€1.2B",
      "type": "SaaS",
      "mentions": 450,
      "sources": "Reddit, Twitter/X, Google Trends",
      "problem": "Description détaillée du problème (3-4 phrases)",
      "solution": "Description détaillée de la solution avec cible et pricing (4-5 phrases)",
      "competitors": "Analyse concurrentielle (2-3 phrases)",
      "weekTrend": "new"
    }
  ],
  "trending_up_ids": [2, 7, 15, 22, 36]
}`,
      },
    ],
  });

  // Parser la réponse
  const responseText = response.content[0].text.trim();
  let updates;
  try {
    updates = JSON.parse(responseText);
  } catch (parseError) {
    // Essayer d'extraire le JSON d'un bloc markdown
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      updates = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error(
        `Impossible de parser la réponse de Claude: ${parseError.message}`
      );
    }
  }

  console.log(
    `Nouvelles opportunités : ${updates.new_opportunities?.length || 0}`
  );
  console.log(`Trending up IDs : ${updates.trending_up_ids?.join(", ")}`);

  // Mettre à jour les weekTrend existants
  const updatedOpportunities = opportunities.map((opp) => {
    // Les anciennes "new" deviennent "stable" ou "up"
    if (opp.weekTrend === "new") {
      return { ...opp, weekTrend: "stable" };
    }
    // Les IDs qui montent
    if (updates.trending_up_ids?.includes(opp.id)) {
      return { ...opp, weekTrend: "up" };
    }
    // Les anciens "up" redeviennent "stable"
    if (opp.weekTrend === "up") {
      return { ...opp, weekTrend: "stable" };
    }
    return opp;
  });

  // Ajouter les nouvelles opportunités
  const allOpportunities = [
    ...updatedOpportunities,
    ...(updates.new_opportunities || []),
  ];

  // Générer le fichier data.js
  const dataContent = `export const WEEK_LABEL = "${newWeekLabel}";

export const OPPORTUNITIES = ${JSON.stringify(allOpportunities, null, 2)};
`;

  writeFileSync(DATA_PATH, dataContent, "utf-8");
  console.log(
    `Fichier data.js mis à jour : ${allOpportunities.length} opportunités`
  );
  console.log(`Nouvelle semaine : ${newWeekLabel}`);
}

updateTrends().catch((error) => {
  console.error("Erreur lors de la mise à jour :", error);
  process.exit(1);
});
