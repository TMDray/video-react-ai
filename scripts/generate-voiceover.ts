/**
 * Generate voiceover segments via ElevenLabs API.
 *
 * Usage: npx tsx scripts/generate-voiceover.ts <video-slug>
 * Example: npx tsx scripts/generate-voiceover.ts hello-world
 *
 * Requires ELEVENLABS_API_KEY in .env or environment.
 * Skips segments that already exist.
 *
 * Features:
 * - Retry logic (3x with exponential backoff) for rate limits (429)
 * - Clear error messages for API/network failures
 * - Proper exit codes (0=success, 1=failure)
 */
import * as fs from "fs";
import * as path from "path";

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: npx tsx scripts/generate-voiceover.ts <video-slug>");
  process.exit(1);
}

/**
 * Retry helper with exponential backoff.
 * On 429 (rate limit): waits 5s × attempt
 * On other errors: waits 1s × attempt
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  label = ""
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const isRateLimit = err?.statusCode === 429 || err?.status === 429;
      const isLast = attempt === maxAttempts;

      if (isLast) {
        throw err;
      }

      const delay = isRateLimit ? 5000 * attempt : 1000 * attempt;
      console.warn(
        `  ⚠️  [${label}] Attempt ${attempt}/${maxAttempts} failed — retrying in ${delay / 1000}s...`
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw new Error("Unreachable");
}

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("❌ ELEVENLABS_API_KEY not set. Set it in .env or environment.");
    console.error(
      "   Get a free key: https://elevenlabs.io/sign-up"
    );
    process.exit(1);
  }

  // Dynamic import of the video's audio config
  const configPath = path.resolve(__dirname, `../src/videos/${slug}/audio.config.ts`);
  if (!fs.existsSync(configPath)) {
    console.error(`❌ Audio config not found: ${configPath}`);
    console.error("   Run: npm run new-video -- " + slug + ' "Title"');
    process.exit(1);
  }

  let audioConfig: any;
  try {
    const mod = await import(configPath);
    audioConfig = mod.audioConfig;
  } catch (err: any) {
    console.error(`❌ Error loading audio.config.ts:`);
    console.error(`   ${err?.message ?? err}`);
    process.exit(1);
  }

  const outDir = path.resolve(__dirname, `../public/audio/voiceover/${slug}`);
  fs.mkdirSync(outDir, { recursive: true });

  let client: any;
  try {
    const { ElevenLabsClient } = await import("elevenlabs");
    client = new ElevenLabsClient({ apiKey });
  } catch (err: any) {
    console.error(`❌ Failed to initialize ElevenLabs client:`);
    console.error(`   ${err?.message ?? err}`);
    process.exit(1);
  }

  const { voiceover } = audioConfig;

  console.log(`📝 Generating voiceover for "${slug}" (${voiceover.segments.length} segments)...\n`);

  let successCount = 0;
  let skipCount = 0;

  for (const segment of voiceover.segments) {
    const outPath = path.join(outDir, `${segment.id}.mp3`);
    if (fs.existsSync(outPath)) {
      console.log(`  ⏭️  ${segment.id}`);
      skipCount++;
      continue;
    }

    console.log(`  🎙️  ${segment.id} — "${segment.text}"`);

    try {
      const audio = await withRetry(
        () =>
          client.textToSpeech.convert(voiceover.voiceId, {
            text: segment.text,
            model_id: "eleven_multilingual_v2",
            output_format: "mp3_44100_128",
            voice_settings: voiceover.voiceSettings ?? {
              stability: 0.6,
              similarity_boost: 0.8,
              style: 0.2,
            },
          }),
        3,
        segment.id
      );

      const chunks: Buffer[] = [];
      for await (const chunk of audio) {
        chunks.push(Buffer.from(chunk));
      }

      try {
        fs.writeFileSync(outPath, Buffer.concat(chunks));
        console.log(`     ✅ ${outPath}`);
        successCount++;
      } catch (writeErr: any) {
        console.error(`     ❌ Failed to write file:`);
        console.error(`        ${writeErr?.message ?? writeErr}`);
        process.exit(1);
      }
    } catch (err: any) {
      console.error(`     ❌ Generation failed:`);
      console.error(`        ${err?.message ?? err}`);
      if (err?.statusCode === 429) {
        console.error(
          `        Rate limited. Your API key may be on the free tier (quota exceeded).`
        );
        console.error(`        Upgrade at: https://elevenlabs.io/account/subscription`);
      }
      process.exit(1);
    }
  }

  console.log(`\n✅ Done!`);
  console.log(`   Generated: ${successCount} | Skipped: ${skipCount}`);
}

main().catch((err) => {
  console.error(`❌ Unexpected error:`, err?.message ?? err);
  process.exit(1);
});
