/**
 * Transition presets for @remotion/transitions.
 *
 * Usage:
 *   import { TransitionSeries } from "@remotion/transitions";
 *   import { fadePresentation, springTiming } from "@/lib/transitions";
 *
 *   <TransitionSeries>
 *     <TransitionSeries.Sequence durationInFrames={90}>
 *       <SceneA />
 *     </TransitionSeries.Sequence>
 *     <TransitionSeries.Transition
 *       presentation={fadePresentation()}
 *       timing={springTiming()}
 *     />
 *     <TransitionSeries.Sequence durationInFrames={90}>
 *       <SceneB />
 *     </TransitionSeries.Sequence>
 *   </TransitionSeries>
 */

import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import {
  springTiming as remotionSpringTiming,
  linearTiming as remotionLinearTiming,
} from "@remotion/transitions";

// ── Presentation presets ──────────────────────────────────

export function fadePresentation() {
  return fade();
}

export function slidePresentation(
  direction: "from-left" | "from-right" | "from-top" | "from-bottom" = "from-left",
) {
  return slide({ direction });
}

export function wipePresentation(
  direction: "from-left" | "from-right" | "from-top" | "from-bottom" = "from-left",
) {
  return wipe({ direction });
}

// ── Timing presets ────────────────────────────────────────

export function springTiming(durationInFrames = 15) {
  return remotionSpringTiming({
    config: { damping: 15, stiffness: 120, mass: 0.8 },
    durationInFrames,
  });
}

export function linearTiming(durationInFrames = 10) {
  return remotionLinearTiming({ durationInFrames });
}
