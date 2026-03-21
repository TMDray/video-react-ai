import type React from "react";

export type FormatId = "landscape" | "linkedin" | "short";

export interface FormatConfig {
  id: FormatId;
  width: number;
  height: number;
  label: string;
}

export interface VideoEntry {
  id: string;
  title: string;
  component: React.FC;
  durationInFrames: number;
  fps: number;
  formats?: FormatId[];
  defaultProps?: Record<string, unknown>;
}

export interface SfxCue {
  /** SFX filename without extension (looked up in public/audio/sfx/) */
  sfx: string;
  /** Absolute frame where SFX starts */
  frame: number;
  /** Duration in frames */
  durationInFrames: number;
  /** Volume 0–1 */
  volume?: number;
}

export interface VoiceoverSegment {
  id: string;
  text: string;
  /** Informational: frame range hint for documentation */
  fromFrame?: number;
  toFrame?: number;
}

export interface AudioConfig {
  voiceover: {
    voiceId: string;
    voiceSettings?: {
      stability?: number;
      similarityBoost?: number;
      style?: number;
    };
    segments: VoiceoverSegment[];
  };
  sfx: SfxCue[];
  music?: {
    /** Path relative to public/ */
    src: string;
    volume: number;
  };
}

// ---------------------------------------------------------------------------
// Video Script (structured storyboard — optional, not enforced)
// ---------------------------------------------------------------------------

/** Role of a scene in the narrative arc. Covers marketing AND entertainment. */
export type SceneRole =
  // Universal
  | "hook"           // 0-3s — grab attention immediately
  | "pattern-break"  // visual/audio interrupt to reset attention
  | "cta"            // call to action / end card
  // Marketing / Conversion
  | "problem"        // pain point / relatable situation
  | "agitate"        // amplify consequences, create urgency
  | "solution"       // introduce the answer
  | "demo"           // show the product / proof in action
  | "social-proof"   // testimonial, stats, logos
  | "before"         // current painful reality (BAB)
  | "after"          // improved state (BAB)
  | "bridge"         // how to get from before to after (BAB)
  // Entertainment / Storytelling
  | "setup"          // establish context, characters, world
  | "build"          // rising tension, development
  | "climax"         // peak moment, revelation, punchline
  | "twist"          // unexpected turn
  | "payoff"         // resolution, emotional landing
  // Generic
  | "content";       // general content (no specific narrative role)

export interface ScriptScene {
  id: string;
  role: SceneRole;
  /** Duration hint (e.g. "3s", "5s"). Claude converts to frames. */
  duration: string;
  /** What the viewer sees */
  visual: string;
  /** Voiceover text (exact words spoken) */
  voiceover?: string;
  /** On-screen text overlay — keep under 7 words */
  textOverlay?: string;
  /** SFX to trigger (e.g. "whoosh", "success-ding") */
  sfx?: string[];
  /** Transition INTO this scene */
  transition?: "cut" | "fade" | "slide" | "wipe";
  /** Implementation notes */
  notes?: string;
}

export interface VideoScript {
  title: string;
  /** Target platform — affects pacing, format & tone */
  platform: "linkedin" | "tiktok" | "youtube" | "instagram" | "generic";
  /** Total target duration (e.g. "30s", "60s") */
  duration: string;
  /** Tone / style keywords (e.g. "pro, dynamic" or "funny, absurd") */
  tone: string;
  /** Target audience */
  audience?: string;
  /** Objective — what should the viewer DO or FEEL after watching? */
  objective?: string;
  /** Narrative framework (marketing or storytelling) */
  framework?: "PAS" | "BAB" | "AIDA" | "HSO" | "setup-build-payoff" | "free";
  /** Music mood (e.g. "upbeat corporate 120bpm", "lo-fi chill 80bpm") */
  musicMood?: string;
  /** Ordered list of scenes */
  scenes: ScriptScene[];
}

export interface CaptionConfig {
  /** Path to SRT file relative to public/ (e.g. "subs/intro.srt") */
  src: string;
  /** Max ms between tokens to combine on one page (default 1200) */
  combineTokensWithinMs?: number;
  /** Optional style overrides for the caption container */
  style?: React.CSSProperties;
}
