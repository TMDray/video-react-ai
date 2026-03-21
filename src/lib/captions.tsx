import { useCallback, useEffect, useState } from "react";
import {
  AbsoluteFill,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  parseSrt,
  createTikTokStyleCaptions,
  type TikTokPage,
  type TikTokToken,
} from "@remotion/captions";
import { colors, primaryGlow } from "@/lib/colors";
import { fontHeading } from "@/lib/fonts";

// ── Types ────────────────────────────────────────────────

export interface SubtitleLayerProps {
  /** Path to the SRT file relative to public/ (e.g. "subs/intro.srt") */
  src: string;
  /** Override the default TikTok-style caption styling */
  style?: React.CSSProperties;
  /** Max milliseconds between tokens to combine on one page (default 1200) */
  combineTokensWithinMs?: number;
}

// ── Component ────────────────────────────────────────────

/**
 * Renders TikTok-style animated captions from an SRT file.
 * Automatically parses the SRT, groups tokens into pages,
 * and highlights the active word.
 *
 * Usage:
 *   <SubtitleLayer src="subs/intro.srt" />
 */
export const SubtitleLayer: React.FC<SubtitleLayerProps> = ({
  src,
  style,
  combineTokensWithinMs = 1200,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [pages, setPages] = useState<TikTokPage[]>([]);

  const loadCaptions = useCallback(async () => {
    const res = await fetch(staticFile(src));
    const srtText = await res.text();
    const { captions } = parseSrt({ input: srtText });
    const { pages: tikTokPages } = createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: combineTokensWithinMs,
    });
    setPages(tikTokPages);
  }, [src, combineTokensWithinMs]);

  useEffect(() => {
    loadCaptions();
  }, [loadCaptions]);

  const currentTimeMs = (frame / fps) * 1000;

  // Find the active page for this frame
  const activePage = pages.find(
    (page) =>
      currentTimeMs >= page.startMs &&
      currentTimeMs < page.startMs + page.durationMs,
  );

  if (!activePage) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 140,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 8,
          maxWidth: "80%",
          ...style,
        }}
      >
        {activePage.tokens.map((token, i) => (
          <CaptionWord
            key={`${activePage.startMs}-${i}`}
            token={token}
            currentTimeMs={currentTimeMs}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── Word component ───────────────────────────────────────

const CaptionWord: React.FC<{
  token: TikTokToken;
  currentTimeMs: number;
}> = ({ token, currentTimeMs }) => {
  const isActive =
    currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;

  return (
    <span
      style={{
        fontFamily: fontHeading,
        fontSize: 68,
        fontWeight: 700,
        color: isActive ? colors.primary : colors.white,
        textShadow: isActive
          ? `0 0 20px ${primaryGlow(0.7)}, 0 2px 8px rgba(0,0,0,0.8)`
          : "0 2px 8px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.6)",
        transition: "color 0.1s ease-out, text-shadow 0.1s ease-out",
        transform: isActive ? "scale(1.08)" : "scale(1)",
        display: "inline-block",
        lineHeight: 1.2,
      }}
    >
      {token.text}
    </span>
  );
};
