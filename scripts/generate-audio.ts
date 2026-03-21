/**
 * Generate SFX + ambient music procedurally.
 *
 * Usage: npx tsx scripts/generate-audio.ts
 *
 * Skips files that already exist.
 */
import * as fs from "fs";
import * as path from "path";

const SAMPLE_RATE = 44100;
const OUT_SFX = path.resolve(__dirname, "../public/audio/sfx");
const OUT_MUSIC = path.resolve(__dirname, "../public/audio/music");

// ── WAV Writer ────────────────────────────────────────────

function writeWav(filePath: string, samples: Float32Array): void {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(SAMPLE_RATE, 24);
  buf.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i])) * 32767), 44 + i * 2);
  }
  fs.writeFileSync(filePath, buf);
}

function fade(samples: Float32Array, fadeIn: number, fadeOut: number): Float32Array {
  for (let i = 0; i < fadeIn && i < samples.length; i++) {
    samples[i] *= i / fadeIn;
  }
  for (let i = 0; i < fadeOut && i < samples.length; i++) {
    samples[samples.length - 1 - i] *= i / fadeOut;
  }
  return samples;
}

// ── SFX Generators ────────────────────────────────────────

function keyClick(): Float32Array {
  const dur = 0.06;
  const s = new Float32Array(Math.floor(SAMPLE_RATE * dur));
  for (let i = 0; i < s.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 80);
    s[i] = env * (Math.random() * 0.5 + Math.sin(2 * Math.PI * 4000 * t) * 0.3);
  }
  return s;
}

function recordingBeep(): Float32Array {
  const dur = 0.3;
  const s = new Float32Array(Math.floor(SAMPLE_RATE * dur));
  for (let i = 0; i < s.length; i++) {
    const t = i / SAMPLE_RATE;
    const freq = t < 0.12 ? 880 : 1320;
    const env = Math.exp(-(t % 0.15) * 20);
    s[i] = env * Math.sin(2 * Math.PI * freq * t) * 0.4;
  }
  return s;
}

function whoosh(): Float32Array {
  const dur = 0.4;
  const s = new Float32Array(Math.floor(SAMPLE_RATE * dur));
  for (let i = 0; i < s.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.sin((Math.PI * t) / dur);
    s[i] = env * (Math.random() * 2 - 1) * 0.3;
  }
  return fade(s, 200, 400);
}

function notifChime(): Float32Array {
  const dur = 0.5;
  const s = new Float32Array(Math.floor(SAMPLE_RATE * dur));
  const freqs = [1047, 1319, 1568]; // C6, E6, G6
  for (let i = 0; i < s.length; i++) {
    const t = i / SAMPLE_RATE;
    let val = 0;
    for (let f = 0; f < freqs.length; f++) {
      const onset = f * 0.08;
      if (t >= onset) {
        const env = Math.exp(-(t - onset) * 6);
        val += env * Math.sin(2 * Math.PI * freqs[f] * t) * 0.25;
      }
    }
    s[i] = val;
  }
  return s;
}

function successDing(): Float32Array {
  const dur = 0.4;
  const s = new Float32Array(Math.floor(SAMPLE_RATE * dur));
  for (let i = 0; i < s.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 8);
    s[i] = env * (Math.sin(2 * Math.PI * 1200 * t) * 0.4 + Math.sin(2 * Math.PI * 1800 * t) * 0.2);
  }
  return s;
}

function typingBurst(): Float32Array {
  const dur = 1.5;
  const s = new Float32Array(Math.floor(SAMPLE_RATE * dur));
  let nextClick = 0;
  for (let i = 0; i < s.length; i++) {
    const t = i / SAMPLE_RATE;
    if (t >= nextClick) {
      const clickLen = Math.floor(SAMPLE_RATE * 0.015);
      for (let j = 0; j < clickLen && i + j < s.length; j++) {
        s[i + j] += Math.exp(-j / (SAMPLE_RATE * 0.005)) * (Math.random() * 0.3);
      }
      nextClick = t + 0.04 + Math.random() * 0.08;
    }
  }
  return fade(s, 200, 600);
}

// ── Ambient Music ─────────────────────────────────────────

function ambientPad(): Float32Array {
  const dur = 25;
  const s = new Float32Array(Math.floor(SAMPLE_RATE * dur));
  const chords = [
    [220, 261.63, 329.63], // Am
    [174.61, 220, 261.63], // F
    [261.63, 329.63, 392], // C
    [196, 246.94, 293.66], // G
  ];
  const chordDur = 6;

  for (let i = 0; i < s.length; i++) {
    const t = i / SAMPLE_RATE;
    const chordIdx = Math.min(Math.floor(t / chordDur), chords.length - 1);
    const chord = chords[chordIdx];
    let val = 0;
    for (const freq of chord) {
      val += Math.sin(2 * Math.PI * freq * t) * 0.08;
      val += Math.sin(2 * Math.PI * freq * 2 * t) * 0.03;
    }
    // LFO tremolo
    val *= 0.8 + 0.2 * Math.sin(2 * Math.PI * 0.3 * t);
    s[i] = val;
  }

  // Smooth
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 1; i < s.length - 1; i++) {
      s[i] = s[i] * 0.6 + (s[i - 1] + s[i + 1]) * 0.2;
    }
  }

  return fade(s, SAMPLE_RATE * 2, SAMPLE_RATE * 3);
}

// ── Main ──────────────────────────────────────────────────

function generate(name: string, dir: string, fn: () => Float32Array) {
  const filePath = path.join(dir, `${name}.wav`);
  if (fs.existsSync(filePath)) {
    console.log(`  Skip (exists): ${name}`);
    return;
  }
  writeWav(filePath, fn());
  console.log(`  OK: ${name}`);
}

fs.mkdirSync(OUT_SFX, { recursive: true });
fs.mkdirSync(OUT_MUSIC, { recursive: true });

console.log("Generating SFX...");
generate("keypress", OUT_SFX, keyClick);
generate("recording-beep", OUT_SFX, recordingBeep);
generate("whoosh", OUT_SFX, whoosh);
generate("notif-chime", OUT_SFX, notifChime);
generate("success-ding", OUT_SFX, successDing);
generate("typing", OUT_SFX, typingBurst);

console.log("Generating music...");
generate("ambient", OUT_MUSIC, ambientPad);

console.log("Done!");
