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
});

export type HelloWorldProps = z.infer<typeof helloWorldSchema>;
