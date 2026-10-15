export function resolveImageDimensions(source) {
  if (!source) {
    return null;
  }

  const width = source.width ?? source.img_width ?? source.naturalWidth;
  const height = source.height ?? source.img_height ?? source.naturalHeight;

  if (!width || !height) {
    return null;
  }

  return { width, height };
}
