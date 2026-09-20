const fs = require("fs");
const path = require("path");

const CACHE_FILE = path.join(
  __dirname,
  "..",
  "data",
  "rockstar-cache.json"
);

const ROCKSTAR_URL =
  "https://www.rockstargames.com/gta-online";

function cleanText(text = "") {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function updateRockstar() {
  console.log("🐺 Zlormack GTA Planner");
  console.log("Connexion a Rockstar Games...");
  console.log(ROCKSTAR_URL);

  const now = new Date().toISOString();

  let cache = {
    last_update: now,
    source: "Rockstar Games",
    source_url: ROCKSTAR_URL,
    status: "error",
    title: null,
    events: [],
    bonuses: [],
    discounts: [],
    message: null
  };

  try {
    const response = await fetch(ROCKSTAR_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 Zlormack-GTA-Planner/1.0",
        "Accept":
          "text/html,application/xhtml+xml"
      }
    });

    if (!response.ok) {
      throw new Error(
        `Rockstar a retourne HTTP ${response.status}`
      );
    }

    const html = await response.text();

    const titleMatch = html.match(
      /<title[^>]*>([\s\S]*?)<\/title>/i
    );

    const title = titleMatch
      ? cleanText(titleMatch[1])
      : "GTA Online";

    cache = {
      ...cache,
      status: "online",
      title,
      message:
        "Connexion aux informations publiques Rockstar reussie."
    };

    console.log("✓ Rockstar accessible");
    console.log(`✓ ${title}`);
  } catch (error) {
    cache.message = error.message;

    console.error("✗ Echec Rockstar");
    console.error(error.message);
  }

  fs.writeFileSync(
    CACHE_FILE,
    JSON.stringify(cache, null, 2) + "\n",
    "utf8"
  );

  console.log(`✓ Cache enregistre : ${CACHE_FILE}`);
}

updateRockstar();
