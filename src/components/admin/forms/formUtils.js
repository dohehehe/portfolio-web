export async function saveEditorContent(editorRef, label) {
  if (!editorRef.current?.isReady()) {
    throw new Error(`${label} 에디터가 준비되지 않았습니다.`);
  }

  const data = await editorRef.current.save();
  return data.blocks?.length ? data : null;
}

export function normalizeGallery(rawValue) {
  if (!Array.isArray(rawValue)) {
    return [];
  }

  return rawValue
    .map((item) => {
      if (typeof item === "string") {
        return {
          img_url: item,
          caption_ko: "",
          caption_en: "",
        };
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      return {
        img_url: item.img_url ?? "",
        caption_ko: item.caption_ko ?? "",
        caption_en: item.caption_en ?? "",
      };
    })
    .filter((item) => item?.img_url);
}

export function serializeGallery(items) {
  if (!items?.length) {
    return null;
  }

  return items.map(({ img_url, caption_ko, caption_en }) => ({
    img_url,
    caption_ko: caption_ko?.trim() || null,
    caption_en: caption_en?.trim() || null,
  }));
}
