import { brand } from "../brand.config";

/**
 * Re-exports brand colors as the project-wide palette.
 * Import from here, not from brand.config directly.
 */
export const colors = brand.colors;

/** RGBA version of the primary color for glows/shadows */
export function primaryGlow(alpha = 0.5): string {
  return hexToRgba(colors.primary, alpha);
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
