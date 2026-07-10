export function isGalleryVideo(item) {
  return Boolean(item?.video_url);
}

export function getGalleryItemKey(item, index) {
  return `${item.video_url || item.img_url}-${index}`;
}

export function getMuxPlaybackId(videoUrl) {
  if (!videoUrl || typeof videoUrl !== "string") {
    return null;
  }

  const trimmed = videoUrl.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    const segment = url.pathname.replace(/^\/+|\/+$/g, "").split("/")[0];

    return segment || null;
  } catch {
    return /^[a-zA-Z0-9]+$/.test(trimmed) ? trimmed : null;
  }
}
