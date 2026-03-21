import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

/**
 * Load all project fonts via @remotion/google-fonts.
 * Call once in Root.tsx at module level.
 *
 * To change fonts: update brand.config.ts, then update
 * the import and loadFont call here to match.
 */
export function loadFonts() {
  const { fontFamily } = loadInter("normal");
  return { heading: fontFamily, body: fontFamily };
}

/** CSS font-family strings for use in components */
export const fontHeading = `"Inter", sans-serif`;
export const fontBody = `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
