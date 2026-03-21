/**
 * Generate voiceover segments via ElevenLabs API.
 *
 * Usage: npx tsx scripts/generate-voiceover.ts <video-slug>
 * Example: npx tsx scripts/generate-voiceover.ts hello-world
 *
 * Requires ELEVENLABS_API_KEY in .env or environment.
 * Skips segments that already exist.
 */
import * as fs from "fs";
import * as path from "path";

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: npx tsx scripts/generate-voiceover.ts <video-slug>");
  process.exit(1);
}

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("ELEVENLABS_API_KEY not set. Set it in .env or environment.");
    process.exit(1);
  }

  // Dynamic import of the video's audio config
  const configPath = path.resolve(__dirname, `../src/videos/${slug}/audio.config.ts`);
  if (!fs.existsSync(configPath)) {
    console.error(`Audio config not found: ${configPath}`);
    process.exit(1);
  }

  const { audioConfig } = await import(configPath);
  const outDir = path.resolve(__dirname, `../public/audio/voiceover/${slug}`);
  fs.mkdirSync(outDir, { recursive: true });

  const { ElevenLabsClient } = await import("elevenlabs");
  const client = new ElevenLabsClient({ apiKey });
  const { voiceover } = audioConfig;

  console.log(`Generating voiceover for "${slug}" (${voiceover.segments.length} segments)...`);

  for (const segment of voiceover.segments) {
    const outPath = path.join(outDir, `${segment.id}.mp3`);
    if (fs.existsSync(outPath)) {
      console.log(`  Skip (exists): ${segment.id}`);
      continue;
    }

    console.log(`  Generating: ${segment.id} — "${segment.text}"`);
    const audio = await client.textToSpeech.convert(voiceover.voiceId, {
      text: segment.text,
      model_id: "eleven_multilingual_v2",
      output_format: "mp3_44100_128",
      voice_settings: voiceover.voiceSettings ?? {
        stability: 0.6,
        similarity_boost: 0.8,
        style: 0.2,
      },
    });

    const chunks: Buffer[] = [];
    for await (const chunk of audio) {
      chunks.push(Buffer.from(chunk));
    }
    fs.writeFileSync(outPath, Buffer.concat(chunks));
    console.log(`  OK: ${outPath}`);
  }

  console.log("Done!");
}

main().catch(console.error);
