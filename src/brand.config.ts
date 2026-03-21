/**
 * Brand Configuration — THE customization hub.
 *
 * Edit this single file to personalize the entire template
 * for your brand. All colors, fonts, and text flow from here.
 */
export const brand = {
  name: "Acme",
  tagline: "Your tagline here",
  logo: "logo-placeholder.svg",
  url: "acme.com",

  colors: {
    primary: "#6366f1",
    primaryLight: "#818cf8",
    primaryDark: "#4f46e5",
    bg: "#0f172a",
    bgLight: "#1e293b",
    surface: "#334155",
    text: "#f8fafc",
    textMuted: "#94a3b8",
    success: "#22c55e",
    danger: "#ef4444",
    warning: "#f59e0b",
    white: "#ffffff",
    black: "#000000",
  },

  fonts: {
    heading: "Inter",
    headingWeights: [400, 500, 600, 700] as const,
    body: "Inter",
    bodyWeights: [300, 400, 500] as const,
  },

  cta: {
    text: "Get Started",
    url: "acme.com/start",
  },
} as const;

export type Brand = typeof brand;
