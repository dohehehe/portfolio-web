"use client";

import MuxPlayer from "@mux/mux-player-react";
import { getMuxPlaybackId } from "@/components/work/gallery/galleryUtils";
import styles from "./GalleryMuxVideo.module.css";

const VARIANT_CLASS = {
  fullWidth: styles.fullWidth,
  pair: styles.pair,
  carousel: styles.carousel,
  preview: styles.preview,
};

export default function GalleryMuxVideo({
  videoUrl,
  title = "",
  variant = "fullWidth",
  className = "",
}) {
  const playbackId = getMuxPlaybackId(videoUrl);

  if (!playbackId) {
    return null;
  }

  const variantClassName = VARIANT_CLASS[variant] ?? VARIANT_CLASS.fullWidth;

  return (
    <MuxPlayer
      className={`${styles.player} ${variantClassName} ${className}`.trim()}
      playbackId={playbackId}
      streamType="on-demand"
      autoPlay="muted"
      muted
      nohotkeys
      playsInline
      metadata={{ video_title: title || undefined }}
    />
  );
}
