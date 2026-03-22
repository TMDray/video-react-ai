import type { VideoEntry } from "../lib/types";
import { HelloWorldComposition } from "./hello-world/Composition";
import { helloWorldSchema } from "./hello-world/schema";
import { brand } from "../brand.config";

export const videos: VideoEntry[] = [
  {
    id: "hello-world",
    title: "Hello World",
    component: HelloWorldComposition,
    durationInFrames: 450,
    fps: 30,
    schema: helloWorldSchema,
    defaultProps: helloWorldSchema.parse({
      headline: "Build videos with code",
      brandName: brand.name,
      tagline: brand.tagline,
      logoUrl: brand.logo,
      ctaText: brand.cta.text,
    }),
  },
  // NEW_VIDEO -- new-video.sh appends here
];
