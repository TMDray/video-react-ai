import { z } from "zod";

/**
 * Generic template props schema for data-driven videos
 * Override these defaults in your composition's defaultProps
 */
export const templateSchema = z.object({
  title: z.string().default("Video Title"),
  subtitle: z.string().default("Video subtitle"),
  body: z.string().default("Your main message here"),
  ctaText: z.string().default("Learn More"),
  logoUrl: z.string().default("logo-placeholder.svg"),
});

export type TemplateProps = z.infer<typeof templateSchema>;
