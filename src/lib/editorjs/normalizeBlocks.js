export function normalizeBlocks(contents) {
  if (!contents) {
    return [];
  }

  if (typeof contents === "string") {
    try {
      return normalizeBlocks(JSON.parse(contents));
    } catch {
      return [];
    }
  }

  if (Array.isArray(contents)) {
    return contents;
  }

  if (Array.isArray(contents.blocks)) {
    return contents.blocks;
  }

  return [];
}

export function normalizeEditorData(contents) {
  const blocks = normalizeBlocks(contents);

  if (blocks.length === 0) {
    return undefined;
  }

  return { blocks };
}
