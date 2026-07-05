"use client";

import { useCallback, useState } from "react";
import { resolveImageDimensions } from "@/utils/imageDimensions";

export default function AspectRatioImage({
  src,
  alt = "",
  className,
  width,
  height,
  img_width,
  img_height,
  onLoad,
  ...rest
}) {
  const [dimensions, setDimensions] = useState(() =>
    resolveImageDimensions({ width, height, img_width, img_height }),
  );

  const handleLoad = useCallback(
    (event) => {
      const nextDimensions = resolveImageDimensions(event.currentTarget);

      if (nextDimensions) {
        setDimensions((current) => {
          if (
            current?.width === nextDimensions.width &&
            current?.height === nextDimensions.height
          ) {
            return current;
          }

          return nextDimensions;
        });
      }

      onLoad?.(event);
    },
    [onLoad],
  );

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={dimensions?.width}
      height={dimensions?.height}
      onLoad={handleLoad}
      {...rest}
    />
  );
}
