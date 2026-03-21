import type { VideoEntry } from "../lib/types";
import { HelloWorldComposition } from "./hello-world/Composition";

export const videos: VideoEntry[] = [
  {
    id: "hello-world",
    title: "Hello World",
    component: HelloWorldComposition,
    durationInFrames: 450,
    fps: 30,
  },
  // NEW_VIDEO -- new-video.sh appends here
];
