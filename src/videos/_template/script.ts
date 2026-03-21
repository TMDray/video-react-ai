import type { VideoScript } from "@/lib/types";

export const script: VideoScript = {
  title: "__TITLE__",
  platform: "linkedin",
  duration: "30s",
  tone: "professional, dynamic",
  audience: "Describe your target audience",
  objective: "What should the viewer do or feel after watching?",
  framework: "PAS",
  musicMood: "upbeat corporate 120bpm",
  scenes: [
    {
      id: "hook",
      role: "hook",
      duration: "3s",
      visual: "Bold visual that grabs attention immediately",
      voiceover: "Opening line — question, stat, or bold claim",
      textOverlay: "Key phrase (max 7 words)",
      sfx: ["whoosh"],
      transition: "cut",
    },
    {
      id: "main",
      role: "content",
      duration: "20s",
      visual: "Core content of the video",
      voiceover: "Main message — adapt to your narrative",
      sfx: [],
      transition: "slide",
    },
    {
      id: "outro",
      role: "cta",
      duration: "5s",
      visual: "Logo + CTA button",
      voiceover: "Call to action — clear and direct",
      textOverlay: "CTA text",
      sfx: ["success-ding"],
      transition: "fade",
    },
  ],
};
