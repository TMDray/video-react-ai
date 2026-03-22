import { z } from "zod";

/**
 * Hello World demo composition props
 * Shows how to parameterize a multi-scene video composition
 */
export const helloWorldSchema = z.object({
  headline: z.string().default("Build videos with code"),
  brandName: z.string().default("Acme"),
  tagline: z.string().default("Your tagline here"),
  logoUrl: z.string().default("logo-placeholder.svg"),
  ctaText: z.string().default("Get Started"),
  logoX: z.number().min(-1).max(1).default(0),
  logoY: z.number().min(-1).max(1).default(0),
  logoScale: z.number().min(0.1).max(3).default(1),
});

export type HelloWorldProps = z.infer<typeof helloWorldSchema>;
