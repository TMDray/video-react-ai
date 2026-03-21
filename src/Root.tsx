import { Composition } from "remotion";
import { loadFonts } from "./lib/fonts";
import { FORMATS, ALL_FORMAT_IDS } from "./lib/formats";
import type { FormatId } from "./lib/types";
import { videos } from "./videos/registry";

loadFonts();

export const Root: React.FC = () => {
  return (
    <>
      {videos.map((video) => {
        const formats = video.formats ?? ALL_FORMAT_IDS;
        return formats.map((formatId: FormatId) => {
          const format = FORMATS[formatId];
          return (
            <Composition
              key={`${video.id}-${formatId}`}
              id={`${video.id}-${formatId}`}
              component={video.component}
              durationInFrames={video.durationInFrames}
              fps={video.fps}
              width={format.width}
              height={format.height}
              defaultProps={video.defaultProps}
            />
          );
        });
      })}
    </>
  );
};
