/**
 * Translate an SRT file to another language via DeepL (or Google Translate fallback).
 *
 * Usage: npx tsx scripts/translate-srt.ts <input.srt> <target-lang>
 * Example: npx tsx scripts/translate-srt.ts public/subs/intro.srt fr
 *
 * Requires DEEPL_API_KEY in .env or environment (free tier: 500K chars/month).
 * Falls back to Google Translate free API if DeepL is unavailable.
 *
 * Output: writes <input>.<lang>.srt next to the original file.
 */
import * as fs from "fs";
import * as path from "path";

// ── CLI args ─────────────────────────────────────────────

const inputPath = process.argv[2];
const targetLang = process.argv[3];

if (!inputPath || !targetLang) {
  console.error(
    "Usage: npx tsx scripts/translate-srt.ts <input.srt> <target-lang>",
  );
  console.error("Example: npx tsx scripts/translate-srt.ts public/subs/intro.srt fr");
  process.exit(1);
}

const resolvedInput = path.resolve(inputPath);
if (!fs.existsSync(resolvedInput)) {
  console.error(`File not found: ${resolvedInput}`);
  process.exit(1);
}

// ── SRT parsing ──────────────────────────────────────────

interface SrtBlock {
  index: string;
  timestamp: string;
  text: string;
}

function parseSrtFile(content: string): SrtBlock[] {
  const blocks: SrtBlock[] = [];
  const parts = content.trim().replace(/\r\n/g, "\n").split(/\n\n+/);

  for (const part of parts) {
    const lines = part.split("\n");
    if (lines.length < 3) continue;

    const index = lines[0].trim();
    const timestamp = lines[1].trim();
    const text = lines.slice(2).join("\n").trim();
    blocks.push({ index, timestamp, text });
  }

  return blocks;
}

function serializeSrtBlocks(blocks: SrtBlock[]): string {
  return blocks.map((b) => `${b.index}\n${b.timestamp}\n${b.text}`).join("\n\n") + "\n";
}

// ── Translation backends ─────────────────────────────────

async function translateWithDeepL(
  texts: string[],
  targetLang: string,
  apiKey: string,
): Promise<string[]> {
  // DeepL free API uses api-free.deepl.com, pro uses api.deepl.com
  const baseUrl = apiKey.endsWith(":fx")
    ? "https://api-free.deepl.com"
    : "https://api.deepl.com";

  const res = await fetch(`${baseUrl}/v2/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: texts,
      target_lang: targetLang.toUpperCase(),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DeepL API error ${res.status}: ${body}`);
  }

  const data = (await res.json()) as {
    translations: { text: string }[];
  };
  return data.translations.map((t) => t.text);
}

async function translateWithGoogle(
  texts: string[],
  targetLang: string,
): Promise<string[]> {
  const results: string[] = [];

  for (const text of texts) {
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", "auto");
    url.searchParams.set("tl", targetLang.toLowerCase());
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", text);

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`Google Translate error ${res.status}`);
    }

    const data = (await res.json()) as [[[string]]];
    // Google returns nested arrays: [[["translated text", "original", ...]]]
    const translated = data[0].map((segment: string[]) => segment[0]).join("");
    results.push(translated);
  }

  return results;
}

// ── Main ─────────────────────────────────────────────────

async function main() {
  const srtContent = fs.readFileSync(resolvedInput, "utf-8");
  const blocks = parseSrtFile(srtContent);

  if (blocks.length === 0) {
    console.error("No SRT blocks found in file.");
    process.exit(1);
  }

  const texts = blocks.map((b) => b.text);
  console.log(
    `Translating ${blocks.length} segments to "${targetLang}"...`,
  );

  let translated: string[];
  const deeplKey = process.env.DEEPL_API_KEY;

  if (deeplKey) {
    console.log("Using DeepL API...");
    try {
      translated = await translateWithDeepL(texts, targetLang, deeplKey);
    } catch (err) {
      console.warn(`DeepL failed: ${err}. Falling back to Google Translate...`);
      translated = await translateWithGoogle(texts, targetLang);
    }
  } else {
    console.log("No DEEPL_API_KEY found. Using Google Translate fallback...");
    translated = await translateWithGoogle(texts, targetLang);
  }

  // Build translated blocks (preserve timestamps)
  const translatedBlocks: SrtBlock[] = blocks.map((block, i) => ({
    ...block,
    text: translated[i],
  }));

  // Output path: intro.srt → intro.fr.srt
  const ext = path.extname(resolvedInput);
  const base = resolvedInput.slice(0, -ext.length);
  const outputPath = `${base}.${targetLang.toLowerCase()}${ext}`;

  fs.writeFileSync(outputPath, serializeSrtBlocks(translatedBlocks), "utf-8");
  console.log(`Done! Output: ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
